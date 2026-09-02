/**
 * Provider-neutral CRM outbox drain (server-only).
 *
 * Every accepted lead gets a `lead_deliveries` row with status `pending`.
 * This module delivers those rows to whatever destination is configured by
 * environment. Nothing here stores or returns credentials.
 *
 * HighLevel (or any webhook) is enabled purely by setting the environment
 * variable below — no form, component, or schema change is required:
 *   LEAD_WEBHOOK_URL     destination endpoint (HighLevel inbound webhook URL)
 *   LEAD_WEBHOOK_TOKEN   optional bearer token
 *
 * The posted body is a clean, HighLevel-friendly shape (friendly field names
 * plus attribution) so a receiving workflow can map fields directly — it never
 * leaks raw internal column names.
 *
 * Retention: delivered rows follow the demo_request lifecycle and are removed
 * by `public.purge_expired_lead_data()`.
 */

const MAX_ATTEMPTS = 5;
const BACKOFF_MINUTES = [1, 5, 30, 120, 720];

export type DrainResult = {
  processed: number;
  sent: number;
  failed: number;
  skipped: "no_destination" | null;
};

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  website: string;
  monthly_leads: string;
  primary_goal: string;
  notes: string | null;
  consent: boolean;
  submitted_at: string;
  demo_request_context?: Array<{
    source_cta: string | null;
    source_route: string | null;
    page_title: string | null;
    landing_path: string | null;
    referrer: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    gclid: string | null;
    fbclid: string | null;
  }> | null;
};

/** Clean, HighLevel-ready payload — friendly field names + attribution. */
function buildCrmPayload(destination: string, lead: LeadRow) {
  const ctx = lead.demo_request_context?.[0] ?? null;
  return {
    destination,
    lead: {
      id: lead.id,
      submitted_at: lead.submitted_at,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      website: lead.website,
      monthly_leads: lead.monthly_leads,
      primary_goal: lead.primary_goal,
      notes: lead.notes,
      consent: lead.consent,
      attribution: ctx
        ? {
            source_cta: ctx.source_cta,
            source_route: ctx.source_route,
            page_title: ctx.page_title,
            landing_path: ctx.landing_path,
            referrer: ctx.referrer,
            utm_source: ctx.utm_source,
            utm_medium: ctx.utm_medium,
            utm_campaign: ctx.utm_campaign,
            utm_term: ctx.utm_term,
            utm_content: ctx.utm_content,
            gclid: ctx.gclid,
            fbclid: ctx.fbclid,
          }
        : null,
    },
  };
}

export async function drainLeadOutbox(limit = 20): Promise<DrainResult> {
  const endpoint = process.env["LEAD_WEBHOOK_URL"];
  if (!endpoint) {
    return { processed: 0, sent: 0, failed: 0, skipped: "no_destination" };
  }

  const token = process.env["LEAD_WEBHOOK_TOKEN"];
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: rows } = await supabaseAdmin
    .from("lead_deliveries")
    .select("id,demo_request_id,attempt_count,destination")
    .eq("status", "pending")
    .lte("next_attempt_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(limit);

  let sent = 0;
  let failed = 0;

  for (const row of rows ?? []) {
    const { data: lead } = (await supabaseAdmin
      .from("demo_requests")
      .select("*, demo_request_context(*)")
      .eq("id", row.demo_request_id)
      .maybeSingle()) as { data: LeadRow | null };
    if (!lead) continue;

    const attempt = row.attempt_count + 1;
    const now = new Date().toISOString();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(buildCrmPayload(row.destination, lead)),
      });

      if (response.ok) {
        sent += 1;
        await supabaseAdmin
          .from("lead_deliveries")
          .update({
            status: "sent",
            attempt_count: attempt,
            last_attempt_at: now,
            response_meta: { status: response.status },
            last_error: null,
          })
          .eq("id", row.id);
        continue;
      }
      throw new Error(`http_${response.status}`);
    } catch (error) {
      failed += 1;
      const reason = error instanceof Error ? error.message : "unknown_error";
      const exhausted = attempt >= MAX_ATTEMPTS;
      const backoff = BACKOFF_MINUTES[Math.min(attempt - 1, BACKOFF_MINUTES.length - 1)] ?? 60;
      await supabaseAdmin
        .from("lead_deliveries")
        .update({
          status: exhausted ? "failed" : "pending",
          attempt_count: attempt,
          last_attempt_at: now,
          next_attempt_at: new Date(Date.now() + backoff * 60_000).toISOString(),
          last_error: reason.slice(0, 300),
        })
        .eq("id", row.id);
    }
  }

  return { processed: rows?.length ?? 0, sent, failed, skipped: null };
}
