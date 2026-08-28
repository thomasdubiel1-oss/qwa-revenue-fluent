/**
 * Server-only operator workflow data access (Phase 7).
 *
 * Same posture as Phase 5/6: the service-role client is imported inside
 * functions, never at module scope; access is gated by `checkOpsAccess`
 * before any of this runs. `lead_activity` and `lead_tasks` are RLS-enabled
 * with no policies and no anon/authenticated grants — unreachable from the
 * Data API by design.
 *
 * Actor identity is a neutral label (`internal_operator`) because only a
 * shared token exists today. No individual user is ever claimed.
 */
import type {
  LeadActivityEntry,
  LeadTask,
  LeadWorkflow,
  QueueKey,
  SlaThresholds,
  WorkQueueItem,
  WorkQueueResult,
} from "./workflow.types";
import { DEFAULT_SLA, PRIORITY_MODEL, QUEUE_KEYS } from "./workflow.types";
import { LEAD_STATUSES } from "./types";

export const OPERATOR_LABEL = "internal_operator";

const HOUR = 60 * 60 * 1000;

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export function normalizeSla(input?: Partial<SlaThresholds> | undefined): SlaThresholds {
  const clamp = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) && v > 0 && v <= 24 * 60 ? Math.round(v) : fallback;
  return {
    triageHours: clamp(input?.triageHours, DEFAULT_SLA.triageHours),
    followUpHours: clamp(input?.followUpHours, DEFAULT_SLA.followUpHours),
    deliveryFailureHours: clamp(input?.deliveryFailureHours, DEFAULT_SLA.deliveryFailureHours),
    staleNewHours: clamp(input?.staleNewHours, DEFAULT_SLA.staleNewHours),
  };
}

/** Audit trail rides the existing conversion_events table plus lead_activity. */
async function audit(
  leadId: string | null,
  activityType: string,
  note: string | null,
  metadata: Record<string, unknown>,
) {
  const db = await admin();
  if (leadId) {
    await db.from("lead_activity").insert({
      demo_request_id: leadId,
      activity_type: activityType,
      note,
      actor_label: OPERATOR_LABEL,
      metadata: metadata as never,
    });
  }
  await db.from("conversion_events").insert({
    event_name: `ops_${activityType}`,
    demo_request_id: leadId,
    metadata: { ...metadata, actor: OPERATOR_LABEL } as never,
  });
}

function volumePoints(band: string) {
  for (const rule of PRIORITY_MODEL.volumeBonus) {
    if (band.includes(rule.match)) return rule.points;
  }
  return 0;
}

type LeadRow = {
  id: string;
  submitted_at: string;
  updated_at: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  monthly_leads: string;
  primary_goal: string;
  status: string;
};

export async function loadWorkQueue(
  slaInput?: Partial<SlaThresholds> | undefined,
): Promise<WorkQueueResult> {
  const sla = normalizeSla(slaInput);
  const db = await admin();
  const now = Date.now();

  const [{ data: leads }, { data: deliveries }, { data: contexts }, { data: tasks }, { data: activity }] =
    await Promise.all([
      db
        .from("demo_requests")
        .select("id,submitted_at,updated_at,name,company,email,phone,monthly_leads,primary_goal,status")
        .order("submitted_at", { ascending: false })
        .limit(1000),
      db
        .from("lead_deliveries")
        .select("id,demo_request_id,status,attempt_count,last_error,created_at"),
      db.from("demo_request_context").select("demo_request_id,source_cta,source_route,utm_campaign,utm_source"),
      db.from("lead_tasks").select("id,demo_request_id,due_at,completed_at"),
      db.from("lead_activity").select("demo_request_id,created_at"),
    ]);

  const latestDelivery = new Map<
    string,
    { id: string; status: string; attempt_count: number; last_error: string | null; created_at: string }
  >();
  for (const d of deliveries ?? []) {
    const prev = latestDelivery.get(d.demo_request_id);
    if (!prev || prev.created_at < d.created_at) latestDelivery.set(d.demo_request_id, d);
  }

  const ctxById = new Map((contexts ?? []).map((c) => [c.demo_request_id, c]));

  const taskAgg = new Map<string, { open: number; overdue: number; nextDue: string | null }>();
  let tasksDueToday = 0;
  let openTasks = 0;
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  for (const t of tasks ?? []) {
    if (t.completed_at) continue;
    openTasks += 1;
    const agg = taskAgg.get(t.demo_request_id) ?? { open: 0, overdue: 0, nextDue: null };
    agg.open += 1;
    if (t.due_at) {
      const due = new Date(t.due_at).getTime();
      if (due < now) agg.overdue += 1;
      if (due <= endOfDay.getTime()) tasksDueToday += 1;
      if (!agg.nextDue || t.due_at < agg.nextDue) agg.nextDue = t.due_at;
    }
    taskAgg.set(t.demo_request_id, agg);
  }

  const lastActivity = new Map<string, string>();
  for (const a of activity ?? []) {
    const prev = lastActivity.get(a.demo_request_id);
    if (!prev || prev < a.created_at) lastActivity.set(a.demo_request_id, a.created_at);
  }

  const items: WorkQueueItem[] = [];

  for (const raw of (leads ?? []) as LeadRow[]) {
    if (raw.status === "archived" || raw.status === "disqualified") continue;

    const delivery = latestDelivery.get(raw.id) ?? null;
    const ctx = ctxById.get(raw.id) ?? null;
    const ageHours = (now - new Date(raw.submitted_at).getTime()) / HOUR;
    const sinceUpdateHours = (now - new Date(raw.updated_at).getTime()) / HOUR;
    const taskInfo = taskAgg.get(raw.id) ?? { open: 0, overdue: 0, nextDue: null };

    let queue: QueueKey;
    let slaAgeHours: number;
    let slaThresholdHours: number;

    if (delivery?.status === "failed") {
      queue = "delivery_failed";
      slaAgeHours = sinceUpdateHours;
      slaThresholdHours = sla.deliveryFailureHours;
    } else if (raw.status === "new" && ageHours >= sla.staleNewHours) {
      queue = "stale_new";
      slaAgeHours = ageHours;
      slaThresholdHours = sla.staleNewHours;
    } else if (raw.status === "new") {
      queue = "new";
      slaAgeHours = ageHours;
      slaThresholdHours = sla.triageHours;
    } else if (raw.status === "contacted") {
      queue = "contacted_followup";
      slaAgeHours = sinceUpdateHours;
      slaThresholdHours = sla.followUpHours;
    } else if (raw.status === "reviewing") {
      queue = "reviewing";
      slaAgeHours = sinceUpdateHours;
      slaThresholdHours = sla.followUpHours;
    } else if (raw.status === "qualified") {
      queue = "qualified";
      slaAgeHours = sinceUpdateHours;
      slaThresholdHours = sla.followUpHours;
    } else if (delivery?.status === "pending") {
      queue = "delivery_pending";
      slaAgeHours = sinceUpdateHours;
      slaThresholdHours = sla.deliveryFailureHours;
    } else {
      continue;
    }

    if (delivery?.status === "pending" && queue !== "delivery_failed" && raw.status !== "new") {
      queue = "delivery_pending";
      slaThresholdHours = sla.deliveryFailureHours;
    }

    const overdue = slaAgeHours >= slaThresholdHours;
    const dueSoon = !overdue && slaAgeHours >= slaThresholdHours * 0.75;

    const reasons: { label: string; points: number }[] = [];
    const base = PRIORITY_MODEL.queueBase[queue];
    reasons.push({ label: `Queue: ${queue.replace(/_/g, " ")}`, points: base });

    const agePoints = Math.min(PRIORITY_MODEL.ageCap, Math.floor(ageHours / 6));
    if (agePoints > 0) {
      reasons.push({ label: `Age ${Math.floor(ageHours)}h (1 pt / 6h, cap 20)`, points: agePoints });
    }

    let total = base + agePoints;

    if (overdue) {
      reasons.push({
        label: `Overdue vs ${slaThresholdHours}h target (${Math.floor(slaAgeHours)}h elapsed)`,
        points: PRIORITY_MODEL.overdueBonus,
      });
      total += PRIORITY_MODEL.overdueBonus;
    }
    if (taskInfo.overdue > 0) {
      reasons.push({
        label: `${taskInfo.overdue} overdue task${taskInfo.overdue === 1 ? "" : "s"}`,
        points: PRIORITY_MODEL.overdueTaskBonus,
      });
      total += PRIORITY_MODEL.overdueTaskBonus;
    } else if (taskInfo.open > 0) {
      reasons.push({
        label: `${taskInfo.open} open task${taskInfo.open === 1 ? "" : "s"}`,
        points: PRIORITY_MODEL.openTaskBonus,
      });
      total += PRIORITY_MODEL.openTaskBonus;
    }

    const vol = volumePoints(raw.monthly_leads);
    if (vol > 0) {
      reasons.push({ label: `Volume band ${raw.monthly_leads}`, points: vol });
      total += vol;
    }

    items.push({
      leadId: raw.id,
      submittedAt: raw.submitted_at,
      updatedAt: raw.updated_at,
      name: raw.name,
      company: raw.company,
      email: raw.email,
      phone: raw.phone,
      monthlyLeads: raw.monthly_leads,
      primaryGoal: raw.primary_goal,
      status: raw.status,
      sourceCta: ctx?.source_cta ?? ctx?.source_route ?? null,
      utmCampaign: ctx?.utm_campaign ?? ctx?.utm_source ?? null,
      deliveryId: delivery?.id ?? null,
      deliveryStatus: delivery?.status ?? null,
      attemptCount: delivery?.attempt_count ?? 0,
      lastError: delivery?.last_error ?? null,
      queue,
      priority: total,
      reasons,
      ageHours: Math.round(ageHours * 10) / 10,
      slaAgeHours: Math.round(slaAgeHours * 10) / 10,
      slaThresholdHours,
      overdue,
      dueSoon,
      openTasks: taskInfo.open,
      overdueTasks: taskInfo.overdue,
      nextTaskDueAt: taskInfo.nextDue,
      lastActivityAt: lastActivity.get(raw.id) ?? null,
    });
  }

  items.sort((a, b) => b.priority - a.priority || (a.submittedAt < b.submittedAt ? -1 : 1));

  const counts = Object.fromEntries(QUEUE_KEYS.map((k) => [k, 0])) as Record<QueueKey, number>;
  for (const item of items) counts[item.queue] += 1;

  return {
    generatedAt: new Date().toISOString(),
    sla,
    counts,
    summary: {
      dueNow: items.filter((i) => i.dueSoon).length,
      overdue: items.filter((i) => i.overdue).length,
      staleNew: counts.stale_new,
      deliveryFailures: counts.delivery_failed,
      deliveryPending: counts.delivery_pending,
      tasksDueToday,
      openTasks,
      untriaged: counts.new + counts.stale_new,
      totalOpen: items.length,
    },
    items,
  };
}

export async function loadLeadWorkflow(leadId: string): Promise<LeadWorkflow> {
  const db = await admin();
  const now = Date.now();

  const [{ data: tasks }, { data: activity }] = await Promise.all([
    db
      .from("lead_tasks")
      .select("*")
      .eq("demo_request_id", leadId)
      .order("created_at", { ascending: false }),
    db
      .from("lead_activity")
      .select("*")
      .eq("demo_request_id", leadId)
      .order("created_at", { ascending: false }),
  ]);

  const mapped: LeadTask[] = (tasks ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    dueAt: t.due_at,
    completedAt: t.completed_at,
    actorLabel: t.actor_label,
    createdAt: t.created_at,
    overdue: Boolean(!t.completed_at && t.due_at && new Date(t.due_at).getTime() < now),
  }));

  const timeline: LeadActivityEntry[] = (activity ?? []).map((a) => ({
    id: a.id,
    kind: a.activity_type === "note_added" ? "activity" : "status",
    type: a.activity_type,
    at: a.created_at,
    title: a.activity_type.replace(/_/g, " "),
    detail: a.note,
    actorLabel: a.actor_label,
  }));

  return { tasks: mapped, timeline };
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function addLeadNote(leadId: string, note: string) {
  const body = clean(note, 2000);
  if (body.length < 2) return { ok: false as const, error: "note_too_short" };
  const db = await admin();
  const { data: lead } = await db
    .from("demo_requests")
    .select("id")
    .eq("id", leadId)
    .maybeSingle();
  if (!lead) return { ok: false as const, error: "not_found" };

  await audit(leadId, "note_added", body, { length: body.length });
  return { ok: true as const };
}

export async function createLeadTask(input: {
  leadId: string;
  title: string;
  description?: string | undefined;
  dueAt?: string | undefined;
}) {
  const title = clean(input.title, 160);
  if (title.length < 2) return { ok: false as const, error: "title_required" };
  const description = clean(input.description, 1000) || null;
  let dueAt: string | null = null;
  if (input.dueAt) {
    const parsed = new Date(input.dueAt);
    if (Number.isNaN(parsed.getTime())) return { ok: false as const, error: "invalid_due_at" };
    dueAt = parsed.toISOString();
  }

  const db = await admin();
  const { data: lead } = await db
    .from("demo_requests")
    .select("id")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) return { ok: false as const, error: "not_found" };

  const { data, error } = await db
    .from("lead_tasks")
    .insert({
      demo_request_id: input.leadId,
      title,
      description,
      due_at: dueAt,
      actor_label: OPERATOR_LABEL,
    })
    .select("id")
    .maybeSingle();
  if (error) return { ok: false as const, error: "insert_failed" };

  await audit(input.leadId, "task_created", title, { task_id: data?.id ?? null, due_at: dueAt });
  return { ok: true as const, id: data?.id ?? null };
}

export async function setTaskCompletion(taskId: string, completed: boolean) {
  const db = await admin();
  const { data: task } = await db
    .from("lead_tasks")
    .select("id,demo_request_id,title,completed_at")
    .eq("id", taskId)
    .maybeSingle();
  if (!task) return { ok: false as const, error: "not_found" };

  const { error } = await db
    .from("lead_tasks")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("id", taskId);
  if (error) return { ok: false as const, error: "update_failed" };

  await audit(
    task.demo_request_id,
    completed ? "task_completed" : "task_reopened",
    task.title,
    { task_id: taskId },
  );
  return { ok: true as const };
}

/**
 * Status move with an operator note, recorded on the workflow timeline as well
 * as the existing conversion_events audit trail.
 */
export async function moveLeadStatus(leadId: string, status: string, note?: string | undefined) {
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
    return { ok: false as const, error: "invalid_status" };
  }
  const { setLeadStatus } = await import("./ops.server");
  const result = await setLeadStatus(leadId, status);
  if (!result.ok) return result;
  const body = clean(note, 500);
  await audit(leadId, "status_changed", body || null, { to: status });
  return result;
}
