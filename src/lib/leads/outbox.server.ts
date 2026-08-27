/**
 * Provider-neutral CRM outbox drain (server-only).
 *
 * Every accepted lead gets a `lead_deliveries` row with status `pending`.
 * This module delivers those rows to whatever destination is configured by
 * environment. Nothing here stores or returns credentials.
 *
 * HighLevel (or any webhook) is enabled purely by setting the environment
 * variable below — no form, component, or schema change is required:
 *   LEAD_WEBHOOK_URL     destination endpoint
 *   LEAD_WEBHOOK_TOKEN   optional bearer token
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
    const { data: lead } = await supabaseAdmin
      .from("demo_requests")
      .select("*, demo_request_context(*)")
      .eq("id", row.demo_request_id)
      .maybeSingle();
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
        body: JSON.stringify({ destination: row.destination, lead }),
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
