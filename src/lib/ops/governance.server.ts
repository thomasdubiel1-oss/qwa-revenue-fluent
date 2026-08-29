/**
 * Phase 9 — Automation configuration governance, server-only.
 *
 * Same posture as Phase 5–8: the service-role client is imported inside
 * functions, never at module scope; `checkOpsAccess` gates every caller in the
 * server-function layer. `automation_config_versions` is RLS-enabled with no
 * policies and no anon/authenticated grants — unreachable from the Data API.
 *
 * Version 1 is the Phase 8 baseline, materialised on first read so current
 * behaviour is preserved exactly until an operator changes something.
 */
import type { AutomationConfig, ConfigVersion } from "./governance.types";
import { baselineConfig, diffConfig, normalizeConfig } from "./governance.types";
import { OPERATOR_LABEL } from "./workflow.server";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

type Row = {
  version: number;
  is_active: boolean;
  config: unknown;
  source: string;
  change_reason: string | null;
  actor_label: string;
  rolled_back_from: number | null;
  created_at: string;
  activated_at: string | null;
};

function toVersion(row: Row): ConfigVersion {
  return {
    version: row.version,
    isActive: row.is_active,
    config: normalizeConfig(row.config),
    source: (["baseline", "operator", "rollback"] as const).includes(row.source as never)
      ? (row.source as ConfigVersion["source"])
      : "operator",
    changeReason: row.change_reason,
    actorLabel: row.actor_label,
    rolledBackFrom: row.rolled_back_from,
    createdAt: row.created_at,
    activatedAt: row.activated_at,
  };
}

const SELECT =
  "version,is_active,config,source,change_reason,actor_label,rolled_back_from,created_at,activated_at";

async function auditConfigEvent(input: {
  reasonCode: string;
  version: number;
  detail: Record<string, unknown>;
}) {
  const db = await admin();
  await db.from("automation_executions").insert({
    demo_request_id: null,
    playbook_key: "governance",
    playbook_version: input.version,
    execution_key: `governance:${input.reasonCode}:v${input.version}:${Date.now()}`,
    mode: "off",
    outcome: "executed",
    reason_code: input.reasonCode,
    detail: input.detail as never,
    actor_label: OPERATOR_LABEL,
  });
}

/** Materialise version 1 (the Phase 8 baseline) if governance is empty. */
export async function ensureBaselineVersion(): Promise<void> {
  const db = await admin();
  const { data } = await db
    .from("automation_config_versions")
    .select("version")
    .limit(1)
    .maybeSingle();
  if (data) return;
  const now = new Date().toISOString();
  await db.from("automation_config_versions").insert({
    version: 1,
    is_active: true,
    config: baselineConfig() as never,
    source: "baseline",
    change_reason: "Phase 8 behaviour captured as the initial governed baseline.",
    actor_label: OPERATOR_LABEL,
    activated_at: now,
  });
  await auditConfigEvent({
    reasonCode: "config_baseline_created",
    version: 1,
    detail: { source: "baseline" },
  });
}

export async function listConfigVersions(): Promise<ConfigVersion[]> {
  await ensureBaselineVersion();
  const db = await admin();
  const { data } = await db
    .from("automation_config_versions")
    .select(SELECT)
    .order("version", { ascending: false })
    .limit(50);
  return ((data ?? []) as Row[]).map(toVersion);
}

export async function loadActiveConfigVersion(): Promise<ConfigVersion> {
  await ensureBaselineVersion();
  const db = await admin();
  const { data } = await db
    .from("automation_config_versions")
    .select(SELECT)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) {
    return {
      version: 1,
      isActive: true,
      config: baselineConfig(),
      source: "baseline",
      changeReason: null,
      actorLabel: OPERATOR_LABEL,
      rolledBackFrom: null,
      createdAt: new Date().toISOString(),
      activatedAt: null,
    };
  }
  return toVersion(data as Row);
}

/** Effective configuration used by every Phase 7–9 read path. */
export async function loadActiveConfig(): Promise<AutomationConfig> {
  try {
    return (await loadActiveConfigVersion()).config;
  } catch {
    // Governance must never take the operator console offline.
    return baselineConfig();
  }
}

async function setActive(version: number) {
  const db = await admin();
  // The partial unique index allows exactly one active row: clear first.
  await db.from("automation_config_versions").update({ is_active: false }).eq("is_active", true);
  await db
    .from("automation_config_versions")
    .update({ is_active: true, activated_at: new Date().toISOString() })
    .eq("version", version);
}

/**
 * Create a new version from the currently active one plus a validated patch,
 * and activate it. Rejects no-op changes so the history stays meaningful.
 */
export async function createConfigVersion(input: {
  config: unknown;
  reason: string;
}): Promise<
  | { ok: true; version: number; diff: { path: string; from: string; to: string }[] }
  | { ok: false; error: string }
> {
  const reason = String(input.reason ?? "").trim();
  if (reason.length < 4) return { ok: false, error: "reason_required" };
  if (reason.length > 500) return { ok: false, error: "reason_too_long" };

  const current = await loadActiveConfigVersion();
  const next = normalizeConfig(input.config);
  const diff = diffConfig(current.config, next);
  if (diff.length === 0) return { ok: false, error: "no_changes" };

  const db = await admin();
  const { data: top } = await db
    .from("automation_config_versions")
    .select("version")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const version = (top?.version ?? 0) + 1;

  const { error } = await db.from("automation_config_versions").insert({
    version,
    is_active: false,
    config: next as never,
    source: "operator",
    change_reason: reason,
    actor_label: OPERATOR_LABEL,
  });
  if (error) return { ok: false, error: "write_failed" };

  await setActive(version);
  await auditConfigEvent({
    reasonCode: "config_version_activated",
    version,
    detail: { reason, from_version: current.version, diff },
  });
  return { ok: true, version, diff };
}

/** Roll back by activating a prior version verbatim. History is append-only. */
export async function rollbackConfig(input: {
  version: number;
  reason: string;
}): Promise<{ ok: true; version: number } | { ok: false; error: string }> {
  const reason = String(input.reason ?? "").trim();
  if (reason.length < 4) return { ok: false, error: "reason_required" };

  const db = await admin();
  const { data } = await db
    .from("automation_config_versions")
    .select(SELECT)
    .eq("version", input.version)
    .maybeSingle();
  if (!data) return { ok: false, error: "version_not_found" };
  const target = toVersion(data as Row);
  const current = await loadActiveConfigVersion();
  if (current.version === target.version) return { ok: false, error: "already_active" };

  const { data: top } = await db
    .from("automation_config_versions")
    .select("version")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const version = (top?.version ?? 0) + 1;

  const { error } = await db.from("automation_config_versions").insert({
    version,
    is_active: false,
    config: target.config as never,
    source: "rollback",
    change_reason: reason,
    actor_label: OPERATOR_LABEL,
    rolled_back_from: target.version,
  });
  if (error) return { ok: false, error: "write_failed" };

  await setActive(version);
  await auditConfigEvent({
    reasonCode: "config_rolled_back",
    version,
    detail: { reason, restored_from_version: target.version, previous_version: current.version },
  });
  return { ok: true, version };
}
