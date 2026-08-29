/**
 * Phase 8 — Versioned operational playbooks.
 *
 * Every rule is a plain, inspectable predicate over data QWA already stores
 * (lead status, delivery state, SLA age, open tasks). There is no model, no
 * score inference and no hidden weighting: `evaluatePlaybooks` returns the
 * exact predicate result plus a human sentence explaining it.
 *
 * Bumping `version` invalidates prior idempotency keys on purpose — a revised
 * rule is allowed to act once more per lead.
 */
import type { PlaybookAction, PlaybookSummary } from "./automation.types";
import type { WorkQueueItem } from "./workflow.types";

export type PlaybookDefinition = PlaybookSummary & {
  /** Trigger predicate. Deterministic; depends only on the item passed in. */
  trigger: (item: WorkQueueItem) => boolean;
  /** Stop condition — evaluated first; when true the playbook never fires. */
  stop: (item: WorkQueueItem) => boolean;
  /** Sentence written into the audit trail with the concrete numbers. */
  explain: (item: WorkQueueItem) => string;
};

const hours = (n: number) => `${n}h`;

export const PLAYBOOKS: PlaybookDefinition[] = [
  {
    key: "new_lead_triage",
    version: 1,
    name: "New lead triage",
    intent: "Every inbound lead leaves the untriaged state inside the triage target.",
    triggerText: "status = new AND queue = new AND (due soon OR overdue vs triage target)",
    stopText: "status has moved off `new`, or an open task already exists",
    action: {
      type: "create_task",
      title: "Triage new lead",
      detail: "Review submission context and move the lead off `new`.",
      dueInHours: 4,
    },
    slaHoursLabel: "triage target",
    priorityBoost: 10,
    cooldownHours: 24,
    maxExecutionsPerLead: 1,
    enabled: true,
    stop: (i) => i.status !== "new" || i.openTasks > 0,
    trigger: (i) => i.queue === "new" && (i.dueSoon || i.overdue),
    explain: (i) =>
      `New lead untriaged for ${Math.floor(i.slaAgeHours)}h against a ${hours(i.slaThresholdHours)} triage target.`,
  },
  {
    key: "stale_lead_recovery",
    version: 1,
    name: "Stale lead recovery",
    intent: "A lead left in `new` past the stale threshold gets an explicit recovery plan.",
    triggerText: "queue = stale_new",
    stopText: "status has moved off `new`",
    action: {
      type: "create_task",
      title: "Stale lead recovery plan",
      detail: "Decide recovery path: re-qualify, reassign, or disqualify with a recorded reason.",
      dueInHours: 8,
    },
    slaHoursLabel: "stale-new threshold",
    priorityBoost: 15,
    cooldownHours: 48,
    maxExecutionsPerLead: 2,
    enabled: true,
    stop: (i) => i.status !== "new",
    trigger: (i) => i.queue === "stale_new",
    explain: (i) =>
      `Lead has been in \`new\` for ${Math.floor(i.ageHours)}h, past the ${hours(i.slaThresholdHours)} stale threshold.`,
  },
  {
    key: "contacted_follow_up",
    version: 1,
    name: "Contacted follow-up",
    intent: "A contacted lead never sits without a scheduled next action.",
    triggerText: "status = contacted AND no open task AND (due soon OR overdue vs follow-up target)",
    stopText: "an open task already exists, or status has moved on",
    action: {
      type: "create_task",
      title: "Schedule next follow-up",
      detail: "Record the next internal follow-up step for this contacted lead.",
      dueInHours: 24,
    },
    slaHoursLabel: "follow-up target",
    priorityBoost: 12,
    cooldownHours: 48,
    maxExecutionsPerLead: 3,
    enabled: true,
    stop: (i) => i.status !== "contacted" || i.openTasks > 0,
    trigger: (i) => i.queue === "contacted_followup" && (i.dueSoon || i.overdue),
    explain: (i) =>
      `No next action recorded for ${Math.floor(i.slaAgeHours)}h against a ${hours(i.slaThresholdHours)} follow-up target.`,
  },
  {
    key: "qualified_handoff_readiness",
    version: 1,
    name: "Qualified handoff readiness",
    intent: "A qualified lead has a complete internal handoff packet before anyone claims it.",
    triggerText: "status = qualified AND no open task",
    stopText: "status is no longer qualified, or a handoff task is already open",
    action: {
      type: "create_task",
      title: "Prepare qualified handoff packet",
      detail:
        "Assemble stored context (source, campaign, goal, volume band) for internal handoff. No external send.",
      dueInHours: 24,
    },
    slaHoursLabel: "follow-up target",
    priorityBoost: 8,
    cooldownHours: 72,
    maxExecutionsPerLead: 1,
    enabled: true,
    stop: (i) => i.status !== "qualified" || i.openTasks > 0,
    trigger: (i) => i.queue === "qualified",
    explain: (i) =>
      `Qualified ${Math.floor(i.slaAgeHours)}h ago with no open internal task; handoff packet not started.`,
  },
  {
    key: "delivery_failure_recovery",
    version: 1,
    name: "Delivery failure recovery",
    intent: "Every failed outbox delivery is attended to inside the failure target.",
    triggerText: "latest delivery status = failed",
    stopText: "the latest delivery is no longer failed",
    action: {
      type: "flag_review",
      title: "Delivery failure needs operator review",
      detail:
        "Inspect the last error and retry through the existing outbox boundary. Retry stays a human action.",
    },
    slaHoursLabel: "failure attention target",
    priorityBoost: 25,
    cooldownHours: 4,
    maxExecutionsPerLead: 5,
    enabled: true,
    stop: (i) => i.deliveryStatus !== "failed",
    trigger: (i) => i.queue === "delivery_failed",
    explain: (i) =>
      `Outbox delivery failed after ${i.attemptCount} attempt(s); unattended for ${Math.floor(i.slaAgeHours)}h against a ${hours(i.slaThresholdHours)} target.`,
  },
  {
    key: "delivery_pending_escalation",
    version: 1,
    name: "Delivery pending escalation",
    intent: "A delivery stuck pending past its target is escalated rather than silently waiting.",
    triggerText: "latest delivery status = pending AND overdue vs failure target",
    stopText: "the delivery has left the pending state",
    action: {
      type: "log_activity",
      title: "Delivery pending past target",
      detail: "Recorded an operational activity entry so the delay is visible on the lead timeline.",
    },
    slaHoursLabel: "failure attention target",
    priorityBoost: 10,
    cooldownHours: 12,
    maxExecutionsPerLead: 3,
    enabled: true,
    stop: (i) => i.deliveryStatus !== "pending",
    trigger: (i) => i.queue === "delivery_pending" && i.overdue,
    explain: (i) =>
      `Delivery pending for ${Math.floor(i.slaAgeHours)}h against a ${hours(i.slaThresholdHours)} target.`,
  },
];

export function playbookByKey(key: string): PlaybookDefinition | undefined {
  return PLAYBOOKS.find((p) => p.key === key);
}

export function playbookSummaries(): PlaybookSummary[] {
  return PLAYBOOKS.map(({ trigger: _t, stop: _s, explain: _e, ...rest }) => rest);
}

/** Stable idempotency key: one execution per playbook version per lead. */
export function executionKey(playbookKey: string, version: number, leadId: string) {
  return `${playbookKey}:v${version}:${leadId}`;
}

export type PlaybookMatch = {
  playbook: PlaybookDefinition;
  item: WorkQueueItem;
  executionKey: string;
  explanation: string;
  action: PlaybookAction;
};

/** Deterministic evaluation over the Phase 7 work queue snapshot. */
export function evaluatePlaybooks(items: WorkQueueItem[]): {
  matches: PlaybookMatch[];
  stopped: { item: WorkQueueItem; playbook: PlaybookDefinition }[];
} {
  const matches: PlaybookMatch[] = [];
  const stopped: { item: WorkQueueItem; playbook: PlaybookDefinition }[] = [];

  for (const item of items) {
    for (const playbook of PLAYBOOKS) {
      if (!playbook.enabled) continue;
      if (playbook.stop(item)) {
        if (playbook.trigger(item)) stopped.push({ item, playbook });
        continue;
      }
      if (!playbook.trigger(item)) continue;
      matches.push({
        playbook,
        item,
        executionKey: executionKey(playbook.key, playbook.version, item.leadId),
        explanation: playbook.explain(item),
        action: playbook.action,
      });
    }
  }

  matches.sort(
    (a, b) =>
      b.item.priority + b.playbook.priorityBoost - (a.item.priority + a.playbook.priorityBoost),
  );
  return { matches, stopped };
}
