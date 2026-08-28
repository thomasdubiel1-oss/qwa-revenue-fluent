/**
 * Server-only data access for the internal Lead Operations Console.
 *
 * ACCESS MODEL (documented dependency):
 *   The console is gated by a single server-side secret, `INTERNAL_OPS_TOKEN`.
 *   When that secret is absent, every read/write here refuses and reports
 *   `unconfigured` — the route exists but returns no lead data at all.
 *   The intended upgrade path is Supabase auth + a `user_roles` table with an
 *   `ops` role checked server-side; the boundary functions below are the only
 *   place that would change.
 *
 * Lead PII never reaches an anonymous client: all reads run through the
 * service-role client inside server functions. No privileged credential is
 * ever imported at module scope or shipped to the browser.
 */
import { createHash, timingSafeEqual } from "crypto";

import type {
  DeliveryStatus,
  OpsAccessState,
  OpsFilters,
  OpsLeadDetail,
  OpsLeadRow,
  OpsOverview,
} from "./types";
import { LEAD_STATUSES } from "./types";

export function checkOpsAccess(key: unknown): OpsAccessState {
  const secret = process.env["INTERNAL_OPS_TOKEN"];
  if (!secret || secret.trim().length < 16) return { state: "unconfigured" };
  const provided = typeof key === "string" ? key : "";
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b) ? { state: "ready" } : { state: "denied" };
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function tally(values: (string | null | undefined)[], limit = 6) {
  const counts = new Map<string, number>();
  for (const raw of values) {
    const label = (raw ?? "").trim() || "—";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((x, y) => y.count - x.count)
    .slice(0, limit);
}

export async function loadOverview(): Promise<OpsOverview> {
  const db = await admin();

  const [{ data: leads }, { data: deliveries }, { data: events }, { data: contexts }] =
    await Promise.all([
      db.from("demo_requests").select("id,status,submitted_at,primary_goal,monthly_leads"),
      db.from("lead_deliveries").select("status"),
      db.from("conversion_events").select("event_name"),
      db.from("demo_request_context").select("source_cta,source_route,utm_source,utm_campaign"),
    ]);

  const byStatus: Record<string, number> = {};
  for (const row of leads ?? []) byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;

  const delivery = { pending: 0, sent: 0, failed: 0 };
  for (const row of deliveries ?? []) {
    if (row.status === "sent") delivery.sent += 1;
    else if (row.status === "failed") delivery.failed += 1;
    else delivery.pending += 1;
  }

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    totalLeads: leads?.length ?? 0,
    newLeads: byStatus["new"] ?? 0,
    byStatus,
    delivery,
    acceptedConversions: (events ?? []).filter((e) => e.event_name === "demo_request_accepted")
      .length,
    suppressedSubmissions: (events ?? []).filter((e) => e.event_name === "demo_request_suppressed")
      .length,
    last7Days: (leads ?? []).filter((l) => new Date(l.submitted_at).getTime() >= weekAgo).length,
    topSources: tally((contexts ?? []).map((c) => c.source_cta ?? c.source_route)),
    topCampaigns: tally((contexts ?? []).map((c) => c.utm_campaign ?? c.utm_source)),
    goalMix: tally((leads ?? []).map((l) => l.primary_goal)),
    volumeMix: tally((leads ?? []).map((l) => l.monthly_leads)),
    destinationConfigured: Boolean(process.env["LEAD_WEBHOOK_URL"]),
  };
}

export async function loadLeads(filters: OpsFilters): Promise<OpsLeadRow[]> {
  const db = await admin();
  const limit = Math.min(Math.max(filters.limit ?? 200, 1), 500);

  let query = db
    .from("demo_requests")
    .select(
      "id,submitted_at,name,company,email,phone,website,monthly_leads,primary_goal,status," +
        "demo_request_context(source_cta,source_route,utm_source,utm_campaign)," +
        "lead_deliveries(id,status,attempt_count,last_error,created_at)",
    )
    .limit(limit);

  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.goal && filters.goal !== "all") query = query.eq("primary_goal", filters.goal);
  if (filters.from) query = query.gte("submitted_at", new Date(filters.from).toISOString());
  if (filters.to) {
    const to = new Date(filters.to);
    to.setUTCHours(23, 59, 59, 999);
    query = query.lte("submitted_at", to.toISOString());
  }
  if (filters.search) {
    const term = filters.search.replace(/[%,()]/g, "").slice(0, 80);
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,company.ilike.%${term}%,email.ilike.%${term}%,website.ilike.%${term}%`,
      );
    }
  }

  const ascending = filters.sort === "oldest";
  query =
    filters.sort === "company"
      ? query.order("company", { ascending: true })
      : query.order("submitted_at", { ascending });

  const { data, error } = await query;
  if (error) {
    console.error("[qwa:ops] lead query failed", error.code ?? "unknown");
    return [];
  }

  type Joined = {
    id: string;
    submitted_at: string;
    name: string;
    company: string;
    email: string;
    phone: string | null;
    website: string;
    monthly_leads: string;
    primary_goal: string;
    status: string;
    demo_request_context: Array<Record<string, string | null>> | null;
    lead_deliveries: Array<{
      id: string;
      status: string;
      attempt_count: number;
      last_error: string | null;
      created_at: string;
    }> | null;
  };

  const rows: OpsLeadRow[] = ((data ?? []) as unknown as Joined[]).map((row) => {
    const ctx = row.demo_request_context?.[0] ?? null;
    const delivery =
      [...(row.lead_deliveries ?? [])].sort((a, b) =>
        a.created_at < b.created_at ? 1 : -1,
      )[0] ?? null;
    return {
      id: row.id,
      submittedAt: row.submitted_at,
      name: row.name,
      company: row.company,
      email: row.email,
      phone: row.phone,
      website: row.website,
      monthlyLeads: row.monthly_leads,
      primaryGoal: row.primary_goal,
      status: row.status,
      sourceCta: ctx?.["source_cta"] ?? null,
      sourceRoute: ctx?.["source_route"] ?? null,
      utmSource: ctx?.["utm_source"] ?? null,
      utmCampaign: ctx?.["utm_campaign"] ?? null,
      deliveryStatus: (delivery?.status as DeliveryStatus | undefined) ?? null,
      deliveryId: delivery?.id ?? null,
      attemptCount: delivery?.attempt_count ?? 0,
      lastError: delivery?.last_error ?? null,
    };
  });

  // Post-filters on joined attribution (PostgREST cannot filter these inline).
  return rows.filter((row) => {
    if (filters.delivery && filters.delivery !== "all") {
      const value = row.deliveryStatus ?? "none";
      if (value !== filters.delivery) return false;
    }
    if (filters.source && filters.source !== "all") {
      if ((row.sourceCta ?? row.sourceRoute ?? "—") !== filters.source) return false;
    }
    if (filters.campaign && filters.campaign !== "all") {
      if ((row.utmCampaign ?? row.utmSource ?? "—") !== filters.campaign) return false;
    }
    return true;
  });
}

export async function loadLeadDetail(id: string): Promise<OpsLeadDetail | null> {
  const db = await admin();
  const { data: lead } = await db.from("demo_requests").select("*").eq("id", id).maybeSingle();
  if (!lead) return null;

  const [{ data: context }, { data: events }, { data: deliveries }] = await Promise.all([
    db.from("demo_request_context").select("*").eq("demo_request_id", id).maybeSingle(),
    db
      .from("conversion_events")
      .select("*")
      .eq("demo_request_id", id)
      .order("occurred_at", { ascending: true }),
    db
      .from("lead_deliveries")
      .select("*")
      .eq("demo_request_id", id)
      .order("created_at", { ascending: true }),
  ]);

  const latest = deliveries?.[deliveries.length - 1] ?? null;

  return {
    lead: {
      id: lead.id,
      submittedAt: lead.submitted_at,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      website: lead.website,
      monthlyLeads: lead.monthly_leads,
      primaryGoal: lead.primary_goal,
      status: lead.status,
      notes: lead.notes,
      consent: lead.consent,
      consentAt: lead.consent_at,
      updatedAt: lead.updated_at,
      sourceCta: context?.source_cta ?? null,
      sourceRoute: context?.source_route ?? null,
      utmSource: context?.utm_source ?? null,
      utmCampaign: context?.utm_campaign ?? null,
      deliveryStatus: (latest?.status as DeliveryStatus | undefined) ?? null,
      deliveryId: latest?.id ?? null,
      attemptCount: latest?.attempt_count ?? 0,
      lastError: latest?.last_error ?? null,
    },
    context: context
      ? {
          pageTitle: context.page_title,
          landingPath: context.landing_path,
          referrer: context.referrer,
          sourceCta: context.source_cta,
          sourceRoute: context.source_route,
          utmSource: context.utm_source,
          utmMedium: context.utm_medium,
          utmCampaign: context.utm_campaign,
          utmTerm: context.utm_term,
          utmContent: context.utm_content,
          gclid: context.gclid,
          fbclid: context.fbclid,
          elapsedMs: context.elapsed_ms,
          userAgent: context.user_agent,
          createdAt: context.created_at,
        }
      : null,
    events: (events ?? []).map((e) => ({
      id: e.id,
      eventName: e.event_name,
      occurredAt: e.occurred_at,
      sourceCta: e.source_cta,
      sourceRoute: e.source_route,
      utmCampaign: e.utm_campaign,
      metadata: e.metadata == null ? null : JSON.stringify(e.metadata),
    })),
    deliveries: (deliveries ?? []).map((d) => ({
      id: d.id,
      destination: d.destination,
      status: d.status,
      attemptCount: d.attempt_count,
      lastAttemptAt: d.last_attempt_at,
      nextAttemptAt: d.next_attempt_at,
      lastError: d.last_error,
      providerRef: d.provider_ref,
      updatedAt: d.updated_at,
    })),
  };
}

/** Audit trail rides the existing conversion_events table — no schema change. */
async function audit(eventName: string, leadId: string | null, metadata: Record<string, unknown>) {
  const db = await admin();
  await db.from("conversion_events").insert({
    event_name: eventName,
    demo_request_id: leadId,
    metadata: { ...metadata, actor: "internal_ops_console" },
  });
}

export async function setLeadStatus(id: string, status: string) {
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
    return { ok: false as const, error: "invalid_status" };
  }
  const db = await admin();
  const { data: before } = await db
    .from("demo_requests")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { ok: false as const, error: "not_found" };

  const { error } = await db
    .from("demo_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false as const, error: "update_failed" };

  await audit("ops_lead_status_changed", id, { from: before.status, to: status });
  return { ok: true as const, status };
}

/**
 * Requeue a delivery through the existing outbox boundary. Valid even when no
 * destination is configured: the row simply returns to `pending` and the drain
 * reports `no_destination` until HighLevel (or any webhook) is wired up.
 */
export async function retryDelivery(deliveryId: string) {
  const db = await admin();
  const { data: row } = await db
    .from("lead_deliveries")
    .select("id,demo_request_id,status,attempt_count")
    .eq("id", deliveryId)
    .maybeSingle();
  if (!row) return { ok: false as const, error: "not_found" };

  const { error } = await db
    .from("lead_deliveries")
    .update({
      status: "pending",
      next_attempt_at: new Date().toISOString(),
      last_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deliveryId);
  if (error) return { ok: false as const, error: "update_failed" };

  await audit("ops_delivery_retry", row.demo_request_id, {
    delivery_id: deliveryId,
    previous_status: row.status,
    attempt_count: row.attempt_count,
  });

  const { drainLeadOutbox } = await import("@/lib/leads/outbox.server");
  const drain = await drainLeadOutbox(5);
  return { ok: true as const, drain };
}
