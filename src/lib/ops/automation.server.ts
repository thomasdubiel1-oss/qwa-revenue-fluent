/**
 * Phase 8 — Automation control plane, server-only.
 *
 * Posture identical to Phase 5–7: the service-role client is imported inside
 * functions, never at module scope, and `checkOpsAccess` gates every caller
 * before anything here runs. Automation tables are RLS-enabled with no
 * policies and no anon/authenticated grants — unreachable from the Data API.
 *
 * HARD LIMIT: the only mutations this module performs are `lead_tasks`
 * inserts, `lead_activity` inserts and automation bookkeeping. No email, SMS,
 * call, ad-spend, CRM or revenue write exists anywhere in this file.
 */
import type {
  AutomationCounts,
  AutomationMode,
  AutomationState,
  BlockedView,
  ExecutionOutcome,
  ExecutionView,
  LeadAutomationBadge,
  PlaybookHealth,
  RecommendationStatus,
  RecommendationView,
} from "./automation.types";
import { AUTOMATION_MODES, REASON_CODES } from "./automation.types";
import type { SimulationResult, SimulationRuleResult } from "./controlplane.types";
import { evaluatePlaybooks, executionKey, PLAYBOOKS, playbookByKey } from "./playbooks";
import type { PlaybookMatch } from "./playbooks";
import { OPERATOR_LABEL } from "./workflow.server";
import type { SlaThresholds, WorkQueueItem } from "./workflow.types";

const HOUR = 60 * 60 * 1000;
const DEFAULT_WINDOW_HOURS = 24 * 14;

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

type RecommendationRow = {
  id: string;
  demo_request_id: string;
  playbook_key: string;
  playbook_version: number;
  execution_key: string;
  status: string;
  action_type: string;
  reason_codes: string[];
  explanation: string | null;
  snooze_until: string | null;
  created_at: string;
};

export async function loadSettings(): Promise<{ mode: AutomationMode; killSwitch: boolean }> {
  const db = await admin();
  const { data } = await db
    .from("automation_settings")
    .select("mode,kill_switch")
    .eq("id", "global")
    .maybeSingle();
  const mode = (data?.mode ?? "off") as AutomationMode;
  return {
    mode: AUTOMATION_MODES.includes(mode) ? mode : "off",
    killSwitch: Boolean(data?.kill_switch),
  };
}

export async function setMode(mode: string) {
  if (!AUTOMATION_MODES.includes(mode as AutomationMode)) {
    return { ok: false as const, error: "invalid_mode" };
  }
  const db = await admin();
  const { error } = await db
    .from("automation_settings")
    .update({ mode, actor_label: OPERATOR_LABEL })
    .eq("id", "global");
  if (error) return { ok: false as const, error: "update_failed" };
  await logExecution({
    leadId: null,
    playbookKey: "control_plane",
    version: 0,
    executionKey: `mode:${mode}:${Date.now()}`,
    mode: mode as AutomationMode,
    outcome: "executed",
    reasonCode: "mode_changed",
    detail: { mode },
  });
  return { ok: true as const, mode: mode as AutomationMode };
}

export async function setKillSwitch(engaged: boolean) {
  const db = await admin();
  const update: { kill_switch: boolean; actor_label: string; mode?: string } = {
    kill_switch: engaged,
    actor_label: OPERATOR_LABEL,
  };
  // Engaging the kill switch also forces the mode back to OFF so no execution
  // path can run even if the switch is later released without a review.
  if (engaged) update.mode = "off";
  const { error } = await db.from("automation_settings").update(update).eq("id", "global");
  if (error) return { ok: false as const, error: "update_failed" };
  await logExecution({
    leadId: null,
    playbookKey: "control_plane",
    version: 0,
    executionKey: `kill:${engaged}:${Date.now()}`,
    mode: "off",
    outcome: "executed",
    reasonCode: engaged ? REASON_CODES.KILL_SWITCH : "kill_switch_released",
    detail: { engaged },
  });
  return { ok: true as const, killSwitch: engaged };
}

async function logExecution(input: {
  leadId: string | null;
  playbookKey: string;
  version: number;
  executionKey: string;
  mode: AutomationMode;
  outcome: ExecutionOutcome;
  reasonCode: string;
  detail: Record<string, unknown>;
}) {
  const db = await admin();
  await db.from("automation_executions").insert({
    demo_request_id: input.leadId,
    playbook_key: input.playbookKey,
    playbook_version: input.version,
    execution_key: input.executionKey,
    mode: input.mode,
    outcome: input.outcome,
    reason_code: input.reasonCode,
    detail: input.detail as never,
    actor_label: OPERATOR_LABEL,
  });
}

function toView(
  match: PlaybookMatch,
  row: RecommendationRow | undefined,
  reasonCodes: string[],
): RecommendationView {
  const status = (row?.status ?? "pending") as RecommendationStatus | "pending";
  return {
    id: row?.id ?? null,
    leadId: match.item.leadId,
    company: match.item.company,
    name: match.item.name,
    status: match.item.status,
    queue: match.item.queue,
    playbookKey: match.playbook.key,
    playbookVersion: match.playbook.version,
    playbookName: match.playbook.name,
    executionKey: match.executionKey,
    action: match.action,
    reasonCodes,
    explanation: match.explanation,
    priorityBoost: match.playbook.priorityBoost,
    basePriority: match.item.priority,
    recommendationStatus: status,
    snoozeUntil: row?.snooze_until ?? null,
    createdAt: row?.created_at ?? null,
    overdue: match.item.overdue,
    slaAgeHours: match.item.slaAgeHours,
    slaThresholdHours: match.item.slaThresholdHours,
  };
}

type Gate = { allowed: boolean; reasonCode: string };

function gateFor(
  match: PlaybookMatch,
  row: RecommendationRow | undefined,
  executedCount: number,
  lastExecutedAt: string | null,
  mode: AutomationMode,
  killSwitch: boolean,
  now: number,
  limits?: { enabled: boolean; cooldownHours: number; maxExecutionsPerLead: number } | undefined,
): Gate {
  // Phase 9: governed configuration overrides the code defaults when present.
  const cooldownHours = limits?.cooldownHours ?? match.playbook.cooldownHours;
  const maxExecutions = limits?.maxExecutionsPerLead ?? match.playbook.maxExecutionsPerLead;
  if (limits && limits.enabled === false) {
    return { allowed: false, reasonCode: REASON_CODES.PLAYBOOK_DISABLED };
  }
  if (killSwitch) return { allowed: false, reasonCode: REASON_CODES.KILL_SWITCH };
  if (mode === "off") return { allowed: false, reasonCode: REASON_CODES.MODE_OFF };
  if (row?.status === "dismissed") return { allowed: false, reasonCode: REASON_CODES.DISMISSED };
  if (row?.status === "snoozed" && row.snooze_until && new Date(row.snooze_until).getTime() > now) {
    return { allowed: false, reasonCode: REASON_CODES.SNOOZED };
  }
  if (row?.status === "auto_executed") {
    return { allowed: false, reasonCode: REASON_CODES.ALREADY_EXECUTED };
  }
  if (executedCount >= maxExecutions) {
    return { allowed: false, reasonCode: REASON_CODES.RATE_LIMIT };
  }
  if (lastExecutedAt && now - new Date(lastExecutedAt).getTime() < cooldownHours * HOUR) {
    return { allowed: false, reasonCode: REASON_CODES.COOLDOWN };
  }
  if (mode === "recommend" && row?.status !== "approved") {
    return { allowed: false, reasonCode: REASON_CODES.REQUIRES_APPROVAL };
  }
  return { allowed: true, reasonCode: REASON_CODES.ELIGIBLE };
}

/** Phase 9: the governed active configuration, with the Phase 8 baseline fallback. */
async function effectiveConfig() {
  const { loadActiveConfig } = await import("./governance.server");
  return loadActiveConfig();
}

async function snapshot(sla?: Partial<SlaThresholds> | undefined) {
  const { loadWorkQueue } = await import("./workflow.server");
  const config = await effectiveConfig();
  const queue = await loadWorkQueue({ ...config.sla, ...(sla ?? {}) });
  return queue.items;
}

async function loadBookkeeping(leadIds: string[]) {
  const db = await admin();
  const [{ data: recs }, { data: execs }] = await Promise.all([
    db
      .from("automation_recommendations")
      .select(
        "id,demo_request_id,playbook_key,playbook_version,execution_key,status,action_type,reason_codes,explanation,snooze_until,created_at",
      )
      .limit(2000),
    db
      .from("automation_executions")
      .select(
        "id,demo_request_id,playbook_key,playbook_version,execution_key,mode,outcome,reason_code,detail,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500),
  ]);
  const byKey = new Map<string, RecommendationRow>();
  for (const r of (recs ?? []) as RecommendationRow[]) {
    if (leadIds.length === 0 || leadIds.includes(r.demo_request_id)) byKey.set(r.execution_key, r);
  }
  return { recommendations: (recs ?? []) as RecommendationRow[], byKey, executions: execs ?? [] };
}

export async function loadAutomationState(input?: {
  sla?: Partial<SlaThresholds> | undefined;
  windowHours?: number | undefined;
}): Promise<AutomationState> {
  const now = Date.now();
  const windowHours =
    typeof input?.windowHours === "number" && input.windowHours > 0 && input.windowHours <= 24 * 90
      ? Math.round(input.windowHours)
      : DEFAULT_WINDOW_HOURS;
  const windowStart = new Date(now - windowHours * HOUR).toISOString();

  const [{ mode, killSwitch }, items, stateConfig] = await Promise.all([
    loadSettings(),
    snapshot(input?.sla),
    effectiveConfig(),
  ]);

  const companyById = new Map(items.map((i) => [i.leadId, i.company]));
  const { matches, stopped } = evaluatePlaybooks(items);
  const { byKey, executions } = await loadBookkeeping(items.map((i) => i.leadId));

  const executedByPair = new Map<string, { count: number; last: string }>();
  for (const e of executions) {
    if (e.outcome !== "executed" || !e.demo_request_id) continue;
    const pair = `${e.playbook_key}:${e.demo_request_id}`;
    const prev = executedByPair.get(pair);
    if (!prev) executedByPair.set(pair, { count: 1, last: e.created_at });
    else
      executedByPair.set(pair, {
        count: prev.count + 1,
        last: prev.last > e.created_at ? prev.last : e.created_at,
      });
  }

  const recommendations: RecommendationView[] = [];
  const blocked: BlockedView[] = [];
  const wouldExecute: RecommendationView[] = [];
  const wouldSkip: BlockedView[] = [];

  for (const match of matches) {
    const row = byKey.get(match.executionKey);
    const pair = executedByPair.get(`${match.playbook.key}:${match.item.leadId}`);
    const gate = gateFor(
      match,
      row,
      pair?.count ?? 0,
      pair?.last ?? null,
      mode,
      killSwitch,
      now,
      stateConfig.playbooks[match.playbook.key],
    );

    const view = toView(match, row, [gate.reasonCode]);
    recommendations.push(view);
    if (gate.allowed) wouldExecute.push(view);
    else {
      const blockedEntry: BlockedView = {
        leadId: match.item.leadId,
        company: match.item.company,
        playbookKey: match.playbook.key,
        playbookName: match.playbook.name,
        reasonCode: gate.reasonCode,
        detail: match.explanation,
      };
      wouldSkip.push(blockedEntry);
      if (
        gate.reasonCode !== REASON_CODES.REQUIRES_APPROVAL &&
        gate.reasonCode !== REASON_CODES.MODE_OFF
      ) {
        blocked.push(blockedEntry);
      }
    }
  }

  for (const s of stopped) {
    blocked.push({
      leadId: s.item.leadId,
      company: s.item.company,
      playbookKey: s.playbook.key,
      playbookName: s.playbook.name,
      reasonCode: REASON_CODES.STOP_CONDITION,
      detail: s.playbook.stopText,
    });
  }

  const windowExecutions = executions.filter((e) => e.created_at >= windowStart);
  const counts: AutomationCounts = {
    eligible: recommendations.length,
    recommended: recommendations.filter(
      (r) => r.recommendationStatus === "pending" || r.recommendationStatus === "recommended",
    ).length,
    approved: recommendations.filter((r) => r.recommendationStatus === "approved").length,
    dismissed: recommendations.filter((r) => r.recommendationStatus === "dismissed").length,
    snoozed: recommendations.filter((r) => r.recommendationStatus === "snoozed").length,
    autoExecuted: windowExecutions.filter(
      (e) => e.outcome === "executed" && e.playbook_key !== "control_plane",
    ).length,
    blocked: windowExecutions.filter((e) => e.outcome === "blocked" || e.outcome === "skipped")
      .length,
    failed: windowExecutions.filter((e) => e.outcome === "failed").length,
  };

  const playbooks: PlaybookHealth[] = PLAYBOOKS.map((p) => {
    const mine = recommendations.filter((r) => r.playbookKey === p.key);
    const execs = windowExecutions.filter((e) => e.playbook_key === p.key);
    return {
      key: p.key,
      version: p.version,
      name: p.name,
      intent: p.intent,
      triggerText: p.triggerText,
      stopText: p.stopText,
      action: p.action,
      slaHoursLabel: p.slaHoursLabel,
      priorityBoost: p.priorityBoost,
      cooldownHours: p.cooldownHours,
      maxExecutionsPerLead: p.maxExecutionsPerLead,
      enabled: p.enabled,
      eligible: mine.length,
      pending: mine.filter(
        (m) => m.recommendationStatus === "pending" || m.recommendationStatus === "recommended",
      ).length,
      executed: execs.filter((e) => e.outcome === "executed").length,
      blocked: blocked.filter((b) => b.playbookKey === p.key).length,
      lastExecutedAt: execs.find((e) => e.outcome === "executed")?.created_at ?? null,
    };
  });

  const executionViews: ExecutionView[] = windowExecutions.slice(0, 100).map((e) => ({
    id: e.id,
    leadId: e.demo_request_id,
    company: e.demo_request_id ? (companyById.get(e.demo_request_id) ?? "—") : "—",
    playbookKey: e.playbook_key,
    playbookVersion: e.playbook_version,
    mode: e.mode,
    outcome: e.outcome as ExecutionOutcome,
    reasonCode: e.reason_code,
    detail:
      e.detail && typeof e.detail === "object" ? JSON.stringify(e.detail).slice(0, 300) : null,
    createdAt: e.created_at,
  }));

  return {
    generatedAt: new Date().toISOString(),
    windowStart,
    windowHours,
    mode,
    killSwitch,
    counts,
    playbooks,
    recommendations,
    blocked,
    executions: executionViews,
    dryRun: { mode, wouldExecute, wouldSkip },
  };
}

/** Upsert the recommendation row that backs approve/dismiss/snooze. */
async function ensureRecommendation(match: PlaybookMatch, status: RecommendationStatus) {
  const db = await admin();
  const { data } = await db
    .from("automation_recommendations")
    .select("id,status")
    .eq("execution_key", match.executionKey)
    .maybeSingle();

  if (data) {
    await db
      .from("automation_recommendations")
      .update({ status, actor_label: OPERATOR_LABEL, resolved_at: new Date().toISOString() })
      .eq("id", data.id);
    return data.id;
  }

  const { data: inserted } = await db
    .from("automation_recommendations")
    .insert({
      demo_request_id: match.item.leadId,
      playbook_key: match.playbook.key,
      playbook_version: match.playbook.version,
      execution_key: match.executionKey,
      status,
      action_type: match.action.type,
      action_payload: match.action as never,
      reason_codes: [REASON_CODES.ELIGIBLE],
      explanation: match.explanation,
      actor_label: OPERATOR_LABEL,
    })
    .select("id")
    .maybeSingle();
  return inserted?.id ?? null;
}

async function findMatch(leadId: string, playbookKey: string, sla?: Partial<SlaThresholds>) {
  const items = await snapshot(sla);
  const { matches } = evaluatePlaybooks(items);
  return matches.find((m) => m.item.leadId === leadId && m.playbook.key === playbookKey) ?? null;
}

export async function decideRecommendation(input: {
  leadId: string;
  playbookKey: string;
  decision: "approve" | "dismiss" | "snooze";
  snoozeHours?: number | undefined;
}) {
  const match = await findMatch(input.leadId, input.playbookKey);
  if (!match) return { ok: false as const, error: "not_eligible" };

  const status: RecommendationStatus =
    input.decision === "approve"
      ? "approved"
      : input.decision === "dismiss"
        ? "dismissed"
        : "snoozed";

  const id = await ensureRecommendation(match, status);
  if (!id) return { ok: false as const, error: "write_failed" };

  if (input.decision === "snooze") {
    const h = Math.min(Math.max(input.snoozeHours ?? 24, 1), 24 * 30);
    const db = await admin();
    await db
      .from("automation_recommendations")
      .update({ snooze_until: new Date(Date.now() + h * HOUR).toISOString() })
      .eq("id", id);
  }

  const { logWorkflowActivity } = await import("./workflow.server");
  await logWorkflowActivity(
    input.leadId,
    `automation_${input.decision}`,
    `${match.playbook.name} — ${input.decision}`,
    {
      playbook: match.playbook.key,
      version: match.playbook.version,
      execution_key: match.executionKey,
    },
  );

  await logExecution({
    leadId: input.leadId,
    playbookKey: match.playbook.key,
    version: match.playbook.version,
    executionKey: match.executionKey,
    mode: (await loadSettings()).mode,
    outcome: "skipped",
    reasonCode: `operator_${input.decision}`,
    detail: { decision: input.decision },
  });

  return { ok: true as const, status };
}

/** Perform one safe internal mutation for a match. Never external. */
async function performAction(match: PlaybookMatch, mode: AutomationMode) {
  const { createLeadTask, logWorkflowActivity } = await import("./workflow.server");

  if (match.action.type === "create_task") {
    const dueAt = match.action.dueInHours
      ? new Date(Date.now() + match.action.dueInHours * HOUR).toISOString()
      : undefined;
    const created = await createLeadTask({
      leadId: match.item.leadId,
      title: `${match.action.title} — ${match.playbook.name}`,
      description: `${match.action.detail}\n\nWhy: ${match.explanation}\nPlaybook ${match.playbook.key} v${match.playbook.version} (${mode}).`,
      ...(dueAt ? { dueAt } : {}),
    });
    return created.ok;
  }

  const type =
    match.action.type === "flag_review" ? "automation_flagged_review" : "automation_note";
  await logWorkflowActivity(
    match.item.leadId,
    type,
    `${match.action.title}: ${match.explanation}`,
    { playbook: match.playbook.key, version: match.playbook.version, mode },
  );
  return true;
}

/**
 * Run the control plane. `dryRun` never mutates lead data — it returns exactly
 * what a live run would do with the same inputs.
 */
export async function runAutomation(options: { dryRun: boolean }): Promise<{
  mode: AutomationMode;
  killSwitch: boolean;
  dryRun: boolean;
  executed: { leadId: string; playbookKey: string; action: string }[];
  skipped: { leadId: string; playbookKey: string; reasonCode: string }[];
  failed: { leadId: string; playbookKey: string; reasonCode: string }[];
}> {
  const now = Date.now();
  const { mode, killSwitch } = await loadSettings();
  const runConfig = await effectiveConfig();
  const items = await snapshot();

  const { matches } = evaluatePlaybooks(items);
  const { byKey, executions } = await loadBookkeeping(items.map((i) => i.leadId));

  const executedByPair = new Map<string, { count: number; last: string }>();
  for (const e of executions) {
    if (e.outcome !== "executed" || !e.demo_request_id) continue;
    const pair = `${e.playbook_key}:${e.demo_request_id}`;
    const prev = executedByPair.get(pair);
    if (!prev) executedByPair.set(pair, { count: 1, last: e.created_at });
    else
      executedByPair.set(pair, {
        count: prev.count + 1,
        last: prev.last > e.created_at ? prev.last : e.created_at,
      });
  }

  const executed: { leadId: string; playbookKey: string; action: string }[] = [];
  const skipped: { leadId: string; playbookKey: string; reasonCode: string }[] = [];
  const failed: { leadId: string; playbookKey: string; reasonCode: string }[] = [];

  for (const match of matches) {
    const row = byKey.get(match.executionKey);
    const pair = executedByPair.get(`${match.playbook.key}:${match.item.leadId}`);
    const gate = gateFor(
      match,
      row,
      pair?.count ?? 0,
      pair?.last ?? null,
      mode,
      killSwitch,
      now,
      runConfig.playbooks[match.playbook.key],
    );

    if (!gate.allowed) {
      skipped.push({
        leadId: match.item.leadId,
        playbookKey: match.playbook.key,
        reasonCode: gate.reasonCode,
      });
      if (!options.dryRun) {
        await logExecution({
          leadId: match.item.leadId,
          playbookKey: match.playbook.key,
          version: match.playbook.version,
          executionKey: match.executionKey,
          mode,
          outcome: "skipped",
          reasonCode: gate.reasonCode,
          detail: { explanation: match.explanation },
        });
      }
      continue;
    }

    if (options.dryRun) {
      executed.push({
        leadId: match.item.leadId,
        playbookKey: match.playbook.key,
        action: match.action.type,
      });
      continue;
    }

    // Claim the idempotency key first: the partial unique index on
    // (execution_key) WHERE outcome='executed' makes a duplicate impossible.
    const db = await admin();
    const { error: claimError } = await db.from("automation_executions").insert({
      demo_request_id: match.item.leadId,
      playbook_key: match.playbook.key,
      playbook_version: match.playbook.version,
      execution_key: match.executionKey,
      mode,
      outcome: "executed",
      reason_code: REASON_CODES.ELIGIBLE,
      detail: { action: match.action.type, explanation: match.explanation } as never,
      actor_label: OPERATOR_LABEL,
    });
    if (claimError) {
      skipped.push({
        leadId: match.item.leadId,
        playbookKey: match.playbook.key,
        reasonCode: REASON_CODES.ALREADY_EXECUTED,
      });
      continue;
    }

    const ok = await performAction(match, mode);
    if (!ok) {
      failed.push({
        leadId: match.item.leadId,
        playbookKey: match.playbook.key,
        reasonCode: REASON_CODES.MUTATION_FAILED,
      });
      await logExecution({
        leadId: match.item.leadId,
        playbookKey: match.playbook.key,
        version: match.playbook.version,
        executionKey: `${match.executionKey}:fail:${Date.now()}`,
        mode,
        outcome: "failed",
        reasonCode: REASON_CODES.MUTATION_FAILED,
        detail: { action: match.action.type },
      });
      continue;
    }

    await ensureRecommendation(match, "auto_executed");
    executed.push({
      leadId: match.item.leadId,
      playbookKey: match.playbook.key,
      action: match.action.type,
    });
  }

  return { mode, killSwitch, dryRun: options.dryRun, executed, skipped, failed };
}

/** Compact per-lead badges for the work queue and lead detail surfaces. */
export async function loadLeadBadges(items: WorkQueueItem[]): Promise<LeadAutomationBadge[]> {
  const { matches } = evaluatePlaybooks(items);
  const { byKey } = await loadBookkeeping(items.map((i) => i.leadId));
  return matches.map((m) => {
    const row = byKey.get(m.executionKey);
    return {
      leadId: m.item.leadId,
      playbookKey: m.playbook.key,
      playbookName: m.playbook.name,
      actionLabel: m.action.title,
      status: (row?.status ?? "pending") as RecommendationStatus | "pending",
      priorityBoost: m.playbook.priorityBoost,
    };
  });
}

export async function loadLeadRecommendations(leadId: string): Promise<RecommendationView[]> {
  const items = await snapshot();
  const { matches } = evaluatePlaybooks(items.filter((i) => i.leadId === leadId));
  const { byKey } = await loadBookkeeping([leadId]);
  return matches.map((m) => toView(m, byKey.get(m.executionKey), [REASON_CODES.ELIGIBLE]));
}

export function playbookExists(key: string) {
  return Boolean(playbookByKey(key));
}

/**
 * Phase 9 — deterministic, read-only simulation for a single real lead.
 *
 * Runs the exact Phase 8 predicates and the exact execution gate against live
 * data and returns every input, rule and threshold that produced the outcome.
 * There is no write path in this function: it never inserts, updates or
 * deletes anything.
 */
export async function simulateLead(leadId: string): Promise<SimulationResult> {
  const now = Date.now();
  const [{ mode, killSwitch }, items, config, versionRow] = await Promise.all([
    loadSettings(),
    snapshot(),
    effectiveConfig(),
    (async () => {
      const { loadActiveConfigVersion } = await import("./governance.server");
      return loadActiveConfigVersion();
    })(),
  ]);

  const item = items.find((i) => i.leadId === leadId) ?? null;
  const base = {
    simulatedAt: new Date().toISOString(),
    readOnly: true as const,
    mode,
    killSwitch,
    configVersion: versionRow.version,
    thresholds: config.sla,
  };

  if (!item) {
    return { ...base, found: false, lead: null, rules: [] };
  }

  const { byKey, executions } = await loadBookkeeping([leadId]);
  const executedByPlaybook = new Map<string, { count: number; last: string }>();
  for (const e of executions) {
    if (e.outcome !== "executed" || e.demo_request_id !== leadId) continue;
    const prev = executedByPlaybook.get(e.playbook_key);
    if (!prev) executedByPlaybook.set(e.playbook_key, { count: 1, last: e.created_at });
    else
      executedByPlaybook.set(e.playbook_key, {
        count: prev.count + 1,
        last: prev.last > e.created_at ? prev.last : e.created_at,
      });
  }

  const rules: SimulationRuleResult[] = PLAYBOOKS.map((p) => {
    const limits = config.playbooks[p.key];
    const triggerResult = p.trigger(item);
    const stopResult = p.stop(item);
    const key = executionKey(p.key, p.version, item.leadId);
    const stats = executedByPlaybook.get(p.key);
    const enabled = limits?.enabled ?? p.enabled;
    const outcome: SimulationRuleResult["outcome"] = !enabled
      ? "disabled"
      : stopResult
        ? "stopped"
        : triggerResult
          ? "matched"
          : "no_match";

    let gateAllowed = false;
    let gateReasonCode: string =
      outcome === "disabled"
        ? REASON_CODES.PLAYBOOK_DISABLED
        : outcome === "stopped"
          ? REASON_CODES.STOP_CONDITION
          : REASON_CODES.NOT_ELIGIBLE;

    if (outcome === "matched") {
      const match: PlaybookMatch = {
        playbook: p,
        item,
        executionKey: key,
        explanation: p.explain(item),
        action: p.action,
      };
      const gate = gateFor(
        match,
        byKey.get(key),
        stats?.count ?? 0,
        stats?.last ?? null,
        mode,
        killSwitch,
        now,
        limits,
      );
      gateAllowed = gate.allowed;
      gateReasonCode = gate.reasonCode;
    }

    return {
      playbookKey: p.key,
      playbookName: p.name,
      playbookVersion: p.version,
      outcome,
      triggerText: p.triggerText,
      stopText: p.stopText,
      triggerResult,
      stopResult,
      explanation: p.explain(item),
      actionType: p.action.type,
      actionTitle: p.action.title,
      actionDetail: p.action.detail,
      dueInHours: p.action.dueInHours ?? null,
      cooldownHours: limits?.cooldownHours ?? p.cooldownHours,
      maxExecutionsPerLead: limits?.maxExecutionsPerLead ?? p.maxExecutionsPerLead,
      executedCount: stats?.count ?? 0,
      lastExecutedAt: stats?.last ?? null,
      executionKey: key,
      gateAllowed,
      gateReasonCode,
    };
  });

  return {
    ...base,
    found: true,
    lead: {
      id: item.leadId,
      company: item.company,
      name: item.name,
      status: item.status,
      queue: item.queue,
      priority: item.priority,
      priorityReasons: item.reasons,
      ageHours: item.ageHours,
      slaAgeHours: item.slaAgeHours,
      slaThresholdHours: item.slaThresholdHours,
      overdue: item.overdue,
      dueSoon: item.dueSoon,
      openTasks: item.openTasks,
      deliveryStatus: item.deliveryStatus,
      attemptCount: item.attemptCount,
    },
    rules,
  };
}
