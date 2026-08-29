/**
 * Phase 9 — Revenue Operations Control Plane aggregation, server-only.
 *
 * Composes existing Phase 7 (work queue) and Phase 8 (automation) reads plus
 * Phase 9 governance into one operator view. It performs no writes, invents no
 * metrics, and every anomaly below is a plain arithmetic rule stated in full.
 */
import type { AutomationState } from "./automation.types";
import type {
  AnomalySignal,
  ControlPlaneState,
  ExecutionOutcomeTally,
} from "./controlplane.types";
import type { WorkQueueResult } from "./workflow.types";

const HOUR = 3_600_000;

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function tally(state: AutomationState): ExecutionOutcomeTally {
  const out: ExecutionOutcomeTally = {
    executed: 0,
    skipped: 0,
    blocked: 0,
    failed: 0,
    byReason: [],
  };
  const reasons = new Map<string, number>();
  for (const e of state.executions) {
    if (e.outcome === "executed") out.executed += 1;
    else if (e.outcome === "failed") out.failed += 1;
    else if (e.outcome === "blocked") out.blocked += 1;
    else out.skipped += 1;
    reasons.set(e.reasonCode, (reasons.get(e.reasonCode) ?? 0) + 1);
  }
  out.byReason = [...reasons.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);
  return out;
}

function buildAnomalies(input: {
  queue: WorkQueueResult;
  state: AutomationState;
  thresholds: {
    windowHours: number;
    overdueLeads: number;
    deliveryFailures: number;
    stuckPending: number;
    executionErrors: number;
    staleRecommendationHours: number;
  };
  now: number;
}): AnomalySignal[] {
  const { queue, state, thresholds, now } = input;
  const signals: AnomalySignal[] = [];

  const overdueItems = queue.items.filter((i) => i.overdue);
  signals.push({
    key: "overdue_accumulation",
    title: "Overdue leads accumulating",
    rule: `count(open leads past their SLA target) >= ${thresholds.overdueLeads}`,
    observed: overdueItems.length,
    threshold: thresholds.overdueLeads,
    windowHours: null,
    breached: overdueItems.length >= thresholds.overdueLeads,
    evidence: overdueItems.slice(0, 5).map((i) => ({
      label: i.company,
      detail: `${i.slaAgeHours.toFixed(1)}h old vs ${i.slaThresholdHours}h target (${i.queue})`,
      leadId: i.leadId,
    })),
    drillTo: "work-queue",
    drillSearch: { view: "overdue" },
  });

  const failures = queue.items.filter((i) => i.deliveryStatus === "failed");
  signals.push({
    key: "delivery_failures",
    title: "Lead delivery failures",
    rule: `count(open leads whose latest outbox delivery = failed) >= ${thresholds.deliveryFailures}`,
    observed: failures.length,
    threshold: thresholds.deliveryFailures,
    windowHours: null,
    breached: failures.length >= thresholds.deliveryFailures,
    evidence: failures.slice(0, 5).map((i) => ({
      label: i.company,
      detail: `${i.attemptCount} attempt(s), latest status failed`,
      leadId: i.leadId,
    })),
    drillTo: "work-queue",
    drillSearch: { view: "delivery_failed" },
  });

  const stuck = queue.items.filter(
    (i) => i.deliveryStatus === "pending" && i.ageHours >= queue.sla.deliveryFailureHours,
  );
  signals.push({
    key: "stuck_pending_delivery",
    title: "Deliveries stuck pending",
    rule: `count(latest delivery = pending AND lead age >= ${queue.sla.deliveryFailureHours}h) >= ${thresholds.stuckPending}`,
    observed: stuck.length,
    threshold: thresholds.stuckPending,
    windowHours: null,
    breached: stuck.length >= thresholds.stuckPending,
    evidence: stuck.slice(0, 5).map((i) => ({
      label: i.company,
      detail: `pending for ${i.ageHours.toFixed(1)}h`,
      leadId: i.leadId,
    })),
    drillTo: "work-queue",
    drillSearch: { view: "delivery_pending" },
  });

  const errors = state.executions.filter((e) => e.outcome === "failed");
  signals.push({
    key: "automation_errors",
    title: "Automation execution errors",
    rule: `count(automation executions with outcome = failed in the last ${state.windowHours}h) >= ${thresholds.executionErrors}`,
    observed: errors.length,
    threshold: thresholds.executionErrors,
    windowHours: state.windowHours,
    breached: errors.length >= thresholds.executionErrors,
    evidence: errors.slice(0, 5).map((e) => ({
      label: e.playbookKey,
      detail: `${e.reasonCode} — ${new Date(e.createdAt).toISOString()}`,
      leadId: e.leadId,
    })),
    drillTo: "automation",
    drillSearch: {},
  });

  const staleRecs = state.recommendations.filter(
    (r) =>
      r.recommendationStatus === "pending" &&
      r.createdAt !== null &&
      now - new Date(r.createdAt).getTime() >= thresholds.staleRecommendationHours * HOUR,
  );
  signals.push({
    key: "stale_recommendations",
    title: "Recommendations awaiting a decision",
    rule: `count(pending recommendations older than ${thresholds.staleRecommendationHours}h) >= 1`,
    observed: staleRecs.length,
    threshold: 1,
    windowHours: thresholds.staleRecommendationHours,
    breached: staleRecs.length >= 1,
    evidence: staleRecs.slice(0, 5).map((r) => ({
      label: r.company,
      detail: `${r.playbookName} pending since ${r.createdAt}`,
      leadId: r.leadId,
    })),
    drillTo: "automation",
    drillSearch: {},
  });

  return signals;
}

export async function loadControlPlaneState(input?: {
  windowHours?: number | undefined;
}): Promise<ControlPlaneState> {
  const now = Date.now();
  const { loadActiveConfigVersion } = await import("./governance.server");
  const version = await loadActiveConfigVersion();
  const config = version.config;

  const windowHours =
    typeof input?.windowHours === "number" && input.windowHours > 0 && input.windowHours <= 24 * 90
      ? Math.round(input.windowHours)
      : config.anomalies.windowHours;

  const { loadWorkQueue } = await import("./workflow.server");
  const { loadAutomationState } = await import("./automation.server");
  const [queue, state] = await Promise.all([
    loadWorkQueue(config.sla),
    loadAutomationState({ sla: config.sla, windowHours }),
  ]);

  const db = await admin();
  const { count: versionCount } = await db
    .from("automation_config_versions")
    .select("version", { count: "exact", head: true });

  const last = state.executions[0] ?? null;

  return {
    generatedAt: new Date().toISOString(),
    windowHours,
    windowStart: state.windowStart,
    mode: state.mode,
    killSwitch: state.killSwitch,
    activeVersion: version,
    versionCount: versionCount ?? 1,
    queue: queue.summary,
    automation: {
      eligible: state.counts.eligible,
      pendingApproval: state.counts.recommended,
      approved: state.counts.approved,
      dismissed: state.counts.dismissed,
      snoozed: state.counts.snoozed,
      blocked: state.counts.blocked,
    },
    outcomes: tally(state),
    lastRunAt: last?.createdAt ?? null,
    lastRunOutcome: last?.outcome ?? null,
    // Execution duration is not persisted, so no latency figure is invented.
    lastRunDurationMs: null,
    playbooks: state.playbooks.map((p) => ({
      key: p.key,
      name: p.name,
      version: p.version,
      enabled: config.playbooks[p.key]?.enabled ?? p.enabled,
      eligible: p.eligible,
      pending: p.pending,
      executed: p.executed,
      blocked: p.blocked,
      lastExecutedAt: p.lastExecutedAt,
    })),
    anomalies: buildAnomalies({ queue, state, thresholds: config.anomalies, now }),
    recentExecutions: state.executions.slice(0, 12).map((e) => ({
      id: e.id,
      leadId: e.leadId,
      company: e.company,
      playbookKey: e.playbookKey,
      outcome: e.outcome,
      reasonCode: e.reasonCode,
      mode: e.mode,
      createdAt: e.createdAt,
    })),
  };
}
