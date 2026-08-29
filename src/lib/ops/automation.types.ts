/**
 * Phase 8 — Revenue Automation Control Plane types.
 *
 * Nothing here models CRM stages, opportunities, revenue or ROAS, and no
 * action can ever reach an external channel. Every automated action is an
 * internal mutation on tables QWA already owns (lead_tasks, lead_activity).
 */

export const AUTOMATION_MODES = ["off", "recommend", "internal_auto"] as const;
export type AutomationMode = (typeof AUTOMATION_MODES)[number];

export const AUTOMATION_MODE_LABELS: Record<AutomationMode, string> = {
  off: "OFF",
  recommend: "RECOMMEND",
  internal_auto: "INTERNAL-AUTO",
};

export const AUTOMATION_MODE_DESCRIPTIONS: Record<AutomationMode, string> = {
  off: "No rules evaluated for execution. Console still previews eligibility read-only.",
  recommend: "Rules produce recommendations for a human to approve, dismiss or snooze.",
  internal_auto:
    "Approved-by-policy rules perform safe internal mutations only (task, activity entry, review flag).",
};

/** The only actions automation may ever perform. All internal, all reversible. */
export const AUTOMATION_ACTIONS = ["create_task", "log_activity", "flag_review"] as const;
export type AutomationActionType = (typeof AUTOMATION_ACTIONS)[number];

export const AUTOMATION_ACTION_LABELS: Record<AutomationActionType, string> = {
  create_task: "Create internal follow-up task",
  log_activity: "Add operational activity entry",
  flag_review: "Flag lead for operator review",
};

export type RecommendationStatus =
  | "recommended"
  | "approved"
  | "dismissed"
  | "snoozed"
  | "auto_executed"
  | "blocked"
  | "failed";

export type ExecutionOutcome = "executed" | "skipped" | "blocked" | "failed";

/** Machine-readable skip/block causes — never a free-text guess. */
export const REASON_CODES = {
  MODE_OFF: "mode_off",
  KILL_SWITCH: "kill_switch_engaged",
  PLAYBOOK_DISABLED: "playbook_disabled",
  NOT_ELIGIBLE: "trigger_not_met",
  STOP_CONDITION: "stop_condition_met",
  ALREADY_EXECUTED: "already_executed_idempotent",
  COOLDOWN: "cooldown_active",
  RATE_LIMIT: "max_executions_reached",
  SNOOZED: "snoozed_until_future",
  DISMISSED: "dismissed_by_operator",
  REQUIRES_APPROVAL: "requires_human_approval",
  ELIGIBLE: "eligible",
  DRY_RUN: "dry_run_preview",
  MUTATION_FAILED: "internal_mutation_failed",
} as const;

export type ReasonCode = (typeof REASON_CODES)[keyof typeof REASON_CODES];

export type PlaybookAction = {
  type: AutomationActionType;
  title: string;
  detail: string;
  /** Hours from execution time; only meaningful for create_task. */
  dueInHours?: number;
};

export type PlaybookSummary = {
  key: string;
  version: number;
  name: string;
  intent: string;
  triggerText: string;
  stopText: string;
  action: PlaybookAction;
  slaHoursLabel: string;
  priorityBoost: number;
  cooldownHours: number;
  maxExecutionsPerLead: number;
  enabled: boolean;
};

export type RecommendationView = {
  id: string | null;
  leadId: string;
  company: string;
  name: string;
  status: string;
  queue: string;
  playbookKey: string;
  playbookVersion: number;
  playbookName: string;
  executionKey: string;
  action: PlaybookAction;
  reasonCodes: string[];
  explanation: string;
  /** Additive, displayed alongside — the Phase 7 score itself is untouched. */
  priorityBoost: number;
  basePriority: number;
  recommendationStatus: RecommendationStatus | "pending";
  snoozeUntil: string | null;
  createdAt: string | null;
  overdue: boolean;
  slaAgeHours: number;
  slaThresholdHours: number;
};

export type BlockedView = {
  leadId: string;
  company: string;
  playbookKey: string;
  playbookName: string;
  reasonCode: string;
  detail: string;
};

export type ExecutionView = {
  id: string;
  leadId: string | null;
  company: string;
  playbookKey: string;
  playbookVersion: number;
  mode: string;
  outcome: ExecutionOutcome;
  reasonCode: string;
  detail: string | null;
  createdAt: string;
};

export type AutomationCounts = {
  eligible: number;
  recommended: number;
  approved: number;
  dismissed: number;
  snoozed: number;
  autoExecuted: number;
  blocked: number;
  failed: number;
};

export type PlaybookHealth = PlaybookSummary & {
  eligible: number;
  pending: number;
  executed: number;
  blocked: number;
  lastExecutedAt: string | null;
};

export type AutomationState = {
  generatedAt: string;
  /** Inclusive lower bound of the observability window. */
  windowStart: string;
  windowHours: number;
  mode: AutomationMode;
  killSwitch: boolean;
  counts: AutomationCounts;
  playbooks: PlaybookHealth[];
  recommendations: RecommendationView[];
  blocked: BlockedView[];
  executions: ExecutionView[];
  /** Rows automation would touch on the next run given the current mode. */
  dryRun: {
    mode: AutomationMode;
    wouldExecute: RecommendationView[];
    wouldSkip: BlockedView[];
  };
};

/** Compact per-lead automation state for work queue / lead detail surfaces. */
export type LeadAutomationBadge = {
  leadId: string;
  playbookKey: string;
  playbookName: string;
  actionLabel: string;
  status: RecommendationStatus | "pending";
  priorityBoost: number;
};
