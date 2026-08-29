/**
 * Phase 9 — Revenue Operations Control Plane types.
 *
 * Every field below is derived from rows QWA already stores. Nothing models
 * revenue, ROAS, opportunities or CRM stages, and nothing can trigger an
 * external send. See src/lib/ops/revenue-contract.ts.
 */
import type { AutomationMode } from "./automation.types";
import type { ConfigVersion } from "./governance.types";
import type { WorkQueueSummary } from "./workflow.types";

export type AnomalyKey =
  | "overdue_accumulation"
  | "delivery_failures"
  | "stuck_pending_delivery"
  | "automation_errors"
  | "stale_recommendations";

export type AnomalySignal = {
  key: AnomalyKey;
  title: string;
  /** Exact rule, written out. No inferred or model-derived scoring. */
  rule: string;
  observed: number;
  threshold: number;
  windowHours: number | null;
  breached: boolean;
  /** Concrete rows behind the count. */
  evidence: { label: string; detail: string; leadId: string | null }[];
  /** Deep link target for the operator. */
  drillTo: "work-queue" | "automation" | "leads";
  drillSearch: Record<string, string>;
};

export type ExecutionOutcomeTally = {
  executed: number;
  skipped: number;
  blocked: number;
  failed: number;
  byReason: { code: string; count: number }[];
};

export type ControlPlaneState = {
  generatedAt: string;
  windowHours: number;
  windowStart: string;
  /** Automation posture. */
  mode: AutomationMode;
  killSwitch: boolean;
  activeVersion: ConfigVersion;
  versionCount: number;
  /** Queue health, straight from the Phase 7 snapshot. */
  queue: WorkQueueSummary;
  /** Automation counts, straight from the Phase 8 evaluator. */
  automation: {
    eligible: number;
    pendingApproval: number;
    approved: number;
    dismissed: number;
    snoozed: number;
    blocked: number;
  };
  outcomes: ExecutionOutcomeTally;
  lastRunAt: string | null;
  lastRunOutcome: string | null;
  /** Latency is only reported when it was actually measured. */
  lastRunDurationMs: number | null;
  playbooks: {
    key: string;
    name: string;
    version: number;
    enabled: boolean;
    eligible: number;
    pending: number;
    executed: number;
    blocked: number;
    lastExecutedAt: string | null;
  }[];
  anomalies: AnomalySignal[];
  recentExecutions: {
    id: string;
    leadId: string | null;
    company: string;
    playbookKey: string;
    outcome: string;
    reasonCode: string;
    mode: string;
    createdAt: string;
  }[];
};

export type SimulationRuleResult = {
  playbookKey: string;
  playbookName: string;
  playbookVersion: number;
  /** matched = trigger true and no stop condition; the gate decides execution. */
  outcome: "matched" | "stopped" | "no_match" | "disabled";
  triggerText: string;
  stopText: string;
  triggerResult: boolean;
  stopResult: boolean;
  explanation: string;
  actionType: string;
  actionTitle: string;
  actionDetail: string;
  dueInHours: number | null;
  cooldownHours: number;
  maxExecutionsPerLead: number;
  executedCount: number;
  lastExecutedAt: string | null;
  executionKey: string;
  /** What a live run would do right now, and precisely why. */
  gateAllowed: boolean;
  gateReasonCode: string;
};

export type SimulationResult = {
  simulatedAt: string;
  /** Always true — the simulator has no write path at all. */
  readOnly: true;
  mode: AutomationMode;
  killSwitch: boolean;
  configVersion: number;
  found: boolean;
  lead: {
    id: string;
    company: string;
    name: string;
    status: string;
    queue: string;
    priority: number;
    priorityReasons: { label: string; points: number }[];
    ageHours: number;
    slaAgeHours: number;
    slaThresholdHours: number;
    overdue: boolean;
    dueSoon: boolean;
    openTasks: number;
    deliveryStatus: string | null;
    attemptCount: number;
  } | null;
  thresholds: {
    triageHours: number;
    followUpHours: number;
    deliveryFailureHours: number;
    staleNewHours: number;
  };
  rules: SimulationRuleResult[];
};
