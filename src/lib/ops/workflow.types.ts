/**
 * Phase 7 — Operator workflow types.
 *
 * Everything here is derived from real stored rows (demo_requests,
 * lead_deliveries, lead_tasks, lead_activity). No CRM stages, opportunities,
 * revenue or ROAS are modelled — see src/lib/ops/revenue-contract.ts.
 */

export const QUEUE_KEYS = [
  "delivery_failed",
  "stale_new",
  "new",
  "contacted_followup",
  "reviewing",
  "qualified",
  "delivery_pending",
] as const;

export type QueueKey = (typeof QUEUE_KEYS)[number];

export const QUEUE_LABELS: Record<QueueKey, string> = {
  delivery_failed: "Delivery failures",
  stale_new: "Stale new",
  new: "New / untriaged",
  contacted_followup: "Contacted — awaiting next action",
  reviewing: "Reviewing",
  qualified: "Qualified",
  delivery_pending: "Delivery pending",
};

/**
 * Operational targets, not marketing claims. Hours. Overridable per request
 * from the console so a team can tune them without a deploy.
 */
export type SlaThresholds = {
  /** New lead must leave `new` within this many hours. */
  triageHours: number;
  /** A contacted lead must have a next action within this many hours. */
  followUpHours: number;
  /** A failed delivery must be attended to within this many hours. */
  deliveryFailureHours: number;
  /** A `new` lead older than this is considered stale. */
  staleNewHours: number;
};

export const DEFAULT_SLA: SlaThresholds = {
  triageHours: 4,
  followUpHours: 48,
  deliveryFailureHours: 2,
  staleNewHours: 24,
};

export type WorkQueueItem = {
  leadId: string;
  submittedAt: string;
  updatedAt: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  monthlyLeads: string;
  primaryGoal: string;
  status: string;
  sourceCta: string | null;
  utmCampaign: string | null;
  deliveryId: string | null;
  deliveryStatus: string | null;
  attemptCount: number;
  lastError: string | null;
  queue: QueueKey;
  /** Deterministic total; see PRIORITY_MODEL. */
  priority: number;
  /** Every component of the score, written out. No opaque scoring. */
  reasons: { label: string; points: number }[];
  ageHours: number;
  /** Hours since the clock that governs this item's SLA started. */
  slaAgeHours: number;
  slaThresholdHours: number;
  /** slaAgeHours >= threshold */
  overdue: boolean;
  /** Within the final quarter of the threshold and not yet overdue. */
  dueSoon: boolean;
  openTasks: number;
  overdueTasks: number;
  nextTaskDueAt: string | null;
  lastActivityAt: string | null;
};

export type WorkQueueSummary = {
  dueNow: number;
  overdue: number;
  staleNew: number;
  deliveryFailures: number;
  deliveryPending: number;
  tasksDueToday: number;
  openTasks: number;
  untriaged: number;
  totalOpen: number;
};

export type WorkQueueResult = {
  generatedAt: string;
  sla: SlaThresholds;
  summary: WorkQueueSummary;
  counts: Record<QueueKey, number>;
  items: WorkQueueItem[];
};

export type LeadActivityEntry = {
  id: string;
  kind: "activity" | "task" | "event" | "delivery" | "status";
  type: string;
  at: string;
  title: string;
  detail: string | null;
  actorLabel: string | null;
};

export type LeadTask = {
  id: string;
  title: string;
  description: string | null;
  dueAt: string | null;
  completedAt: string | null;
  actorLabel: string;
  createdAt: string;
  overdue: boolean;
};

export type LeadWorkflow = {
  tasks: LeadTask[];
  timeline: LeadActivityEntry[];
};

/** Written out so the ordering is auditable rather than inferred. */
export const PRIORITY_MODEL = {
  queueBase: {
    delivery_failed: 100,
    stale_new: 80,
    contacted_followup: 70,
    new: 60,
    qualified: 50,
    reviewing: 40,
    delivery_pending: 30,
  } as Record<QueueKey, number>,
  overdueBonus: 25,
  overdueTaskBonus: 15,
  openTaskBonus: 5,
  /** min(20, ageHours / 6) — one point per six hours, capped. */
  ageCap: 20,
  /** Self-reported monthly lead volume band, matched in order. */
  volumeBonus: [
    { match: "25,000+", points: 10 },
    { match: "5,000 – 25,000", points: 8 },
    { match: "1,000 – 5,000", points: 6 },
    { match: "250 – 1,000", points: 3 },
  ],
} as const;
