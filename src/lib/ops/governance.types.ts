/**
 * Phase 9 — Automation governance types.
 *
 * A configuration version is a full, inspectable snapshot of every tunable
 * operational value: SLA thresholds, per-playbook limits and anomaly
 * thresholds. Rules themselves stay in code (`playbooks.ts`) and are
 * versioned there; this layer versions the *configuration* applied to them.
 *
 * Nothing here models CRM stages, revenue, ROAS or opportunities, and no
 * value stored here can cause an external send.
 */
import { PLAYBOOKS } from "./playbooks";
import type { SlaThresholds } from "./workflow.types";
import { DEFAULT_SLA } from "./workflow.types";

export type PlaybookConfig = {
  enabled: boolean;
  cooldownHours: number;
  maxExecutionsPerLead: number;
};

export type AnomalyThresholds = {
  /** Rolling window used by every anomaly rule, in hours. */
  windowHours: number;
  /** Overdue open leads at or above this count raises attention. */
  overdueLeads: number;
  /** Delivery failures at or above this count raises attention. */
  deliveryFailures: number;
  /** Deliveries still pending past the failure target, at or above this count. */
  stuckPending: number;
  /** Automation executions with outcome `failed` in the window. */
  executionErrors: number;
  /** Recommendations pending approval for longer than this many hours. */
  staleRecommendationHours: number;
};

export type AutomationConfig = {
  sla: SlaThresholds;
  playbooks: Record<string, PlaybookConfig>;
  anomalies: AnomalyThresholds;
};

export const DEFAULT_ANOMALIES: AnomalyThresholds = {
  windowHours: 24,
  overdueLeads: 5,
  deliveryFailures: 3,
  stuckPending: 3,
  executionErrors: 1,
  staleRecommendationHours: 24,
};

/** The Phase 8 behaviour, expressed as configuration. Version 1 baseline. */
export function baselineConfig(): AutomationConfig {
  const playbooks: Record<string, PlaybookConfig> = {};
  for (const p of PLAYBOOKS) {
    playbooks[p.key] = {
      enabled: p.enabled,
      cooldownHours: p.cooldownHours,
      maxExecutionsPerLead: p.maxExecutionsPerLead,
    };
  }
  return { sla: { ...DEFAULT_SLA }, playbooks, anomalies: { ...DEFAULT_ANOMALIES } };
}

export type ConfigVersion = {
  version: number;
  isActive: boolean;
  config: AutomationConfig;
  source: "baseline" | "operator" | "rollback";
  changeReason: string | null;
  actorLabel: string;
  rolledBackFrom: number | null;
  createdAt: string;
  activatedAt: string | null;
};

export type ConfigDiffEntry = { path: string; from: string; to: string };

const NUM = (v: unknown, fallback: number, min: number, max: number) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.round(n * 100) / 100, min), max);
};

/** Never trust stored or submitted JSON — clamp everything into a safe range. */
export function normalizeConfig(input: unknown): AutomationConfig {
  const base = baselineConfig();
  const raw = (input ?? {}) as Partial<AutomationConfig>;
  const sla = (raw.sla ?? {}) as Partial<SlaThresholds>;
  const anomalies = (raw.anomalies ?? {}) as Partial<AnomalyThresholds>;
  const playbooks: Record<string, PlaybookConfig> = {};
  for (const [key, def] of Object.entries(base.playbooks)) {
    const p = ((raw.playbooks ?? {}) as Record<string, Partial<PlaybookConfig>>)[key] ?? {};
    playbooks[key] = {
      enabled: typeof p.enabled === "boolean" ? p.enabled : def.enabled,
      cooldownHours: NUM(p.cooldownHours, def.cooldownHours, 0, 24 * 30),
      maxExecutionsPerLead: NUM(p.maxExecutionsPerLead, def.maxExecutionsPerLead, 1, 20),
    };
  }
  return {
    sla: {
      triageHours: NUM(sla.triageHours, base.sla.triageHours, 0.25, 24 * 14),
      followUpHours: NUM(sla.followUpHours, base.sla.followUpHours, 1, 24 * 30),
      deliveryFailureHours: NUM(sla.deliveryFailureHours, base.sla.deliveryFailureHours, 0.25, 24 * 14),
      staleNewHours: NUM(sla.staleNewHours, base.sla.staleNewHours, 1, 24 * 30),
    },
    playbooks,
    anomalies: {
      windowHours: NUM(anomalies.windowHours, base.anomalies.windowHours, 1, 24 * 30),
      overdueLeads: NUM(anomalies.overdueLeads, base.anomalies.overdueLeads, 1, 10000),
      deliveryFailures: NUM(anomalies.deliveryFailures, base.anomalies.deliveryFailures, 1, 10000),
      stuckPending: NUM(anomalies.stuckPending, base.anomalies.stuckPending, 1, 10000),
      executionErrors: NUM(anomalies.executionErrors, base.anomalies.executionErrors, 1, 10000),
      staleRecommendationHours: NUM(
        anomalies.staleRecommendationHours,
        base.anomalies.staleRecommendationHours,
        1,
        24 * 30,
      ),
    },
  };
}

/** Flat, human-readable diff so no rule ever changes silently. */
export function diffConfig(from: AutomationConfig, to: AutomationConfig): ConfigDiffEntry[] {
  const out: ConfigDiffEntry[] = [];
  const walk = (a: unknown, b: unknown, path: string) => {
    if (typeof a === "object" && a && typeof b === "object" && b) {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      for (const k of keys) {
        walk(
          (a as Record<string, unknown>)[k],
          (b as Record<string, unknown>)[k],
          path ? `${path}.${k}` : k,
        );
      }
      return;
    }
    if (String(a) !== String(b)) out.push({ path, from: String(a), to: String(b) });
  };
  walk(from, to, "");
  return out;
}
