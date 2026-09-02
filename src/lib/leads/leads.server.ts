/**
 * Server-only lead persistence.
 *
 * Data retention: rows written here are purged by the database helper
 * `public.purge_expired_lead_data(retention_days)`. Wire that to a schedule
 * once a retention policy is agreed — the default window is 730 days.
 *
 * Privacy: raw lead PII is never logged. Only non-identifying diagnostics
 * (status, provider, error class) are emitted.
 */
import { createHash } from "crypto";

import type { DemoRequestPayload, LeadSubmitResult } from "./types";

const MAX = {
  short: 160,
  email: 254,
  notes: 1000,
  url: 400,
} as const;

/** Hourly submission ceiling per hashed request signal. */
const RATE_LIMIT_PER_HOUR = 8;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127 ? " " : character;
  })
    .join("")
    .trim()
    .slice(0, max);
}

function optional(value: unknown, max: number): string | null {
  const v = clean(value, max);
  return v.length > 0 ? v : null;
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export type ServerLeadContext = {
  /** Raw request-derived signal (IP / forwarded-for). Hashed before storage. */
  ipSignal?: string | undefined;
  userAgent?: string | undefined;
};

type Sanitized = {
  name: string;
  email: string;
  phone: string | null;
  company: string;
  website: string;
  monthly_leads: string;
  primary_goal: string;
  notes: string | null;
  consent: boolean;
};

function sanitize(payload: DemoRequestPayload): { values?: Sanitized; error?: string } {
  const email = clean(payload.email, MAX.email).toLowerCase();
  const name = clean(payload.name, MAX.short);
  const company = clean(payload.company, MAX.short);
  const website = clean(payload.website, MAX.url);
  const monthly = clean(payload.monthlyLeads, MAX.short);
  const goal = clean(payload.primaryGoal, MAX.short);

  if (!EMAIL_RE.test(email)) return { error: "invalid_email" };
  if (name.length < 2) return { error: "invalid_name" };
  if (company.length < 2) return { error: "invalid_company" };
  if (!website) return { error: "invalid_website" };
  if (!monthly || !goal) return { error: "invalid_qualifiers" };
  if (payload.consent !== true) return { error: "consent_required" };

  return {
    values: {
      name,
      email,
      phone: optional(payload.phone, 40),
      company,
      website,
      monthly_leads: monthly,
      primary_goal: goal,
      notes: optional(payload.notes, MAX.notes),
      consent: true,
    },
  };
}

/**
 * Persist an accepted demo request plus its attribution context, queue an
 * outbox delivery for the future CRM integration, and record a server-side
 * conversion event. Idempotent on a derived key so a double submit (or a
 * retried network call) can never create a second lead.
 */
export async function persistDemoRequest(
  payload: DemoRequestPayload,
  ctx: ServerLeadContext = {},
): Promise<LeadSubmitResult> {
  const provider = "supabase";
  const { values, error } = sanitize(payload);
  if (!values) {
    return { ok: false, provider, retryable: false, error: error ?? "invalid_payload" };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // --- Abuse control: hashed request signal only, never a raw IP. ---
  const signalHash = sha256(`${ctx.ipSignal ?? "unknown"}|qwa-demo`);
  const windowStart = new Date();
  windowStart.setUTCMinutes(0, 0, 0);

  const { data: throttleRow } = await supabaseAdmin
    .from("submission_throttle")
    .select("id,hit_count")
    .eq("signal_hash", signalHash)
    .eq("window_start", windowStart.toISOString())
    .maybeSingle();

  if (throttleRow && throttleRow.hit_count >= RATE_LIMIT_PER_HOUR) {
    await supabaseAdmin
      .from("submission_throttle")
      .update({ blocked_count: throttleRow.hit_count, updated_at: new Date().toISOString() })
      .eq("id", throttleRow.id);
    return { ok: false, provider, retryable: false, error: "rate_limited" };
  }

  if (throttleRow) {
    await supabaseAdmin
      .from("submission_throttle")
      .update({ hit_count: throttleRow.hit_count + 1, updated_at: new Date().toISOString() })
      .eq("id", throttleRow.id);
  } else {
    await supabaseAdmin
      .from("submission_throttle")
      .insert({ signal_hash: signalHash, window_start: windowStart.toISOString() });
  }

  // --- Idempotency at the persistence layer (unique index backs this). ---
  const dayBucket = new Date().toISOString().slice(0, 10);
  const idempotencyKey = sha256(
    [values.email, values.company, values.primary_goal, dayBucket].join("|"),
  );

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("demo_requests")
    .insert({ ...values, idempotency_key: idempotencyKey, consent_at: new Date().toISOString() })
    .select("id")
    .maybeSingle();

  if (insertError) {
    // 23505 = unique violation → the same lead already exists today.
    if (insertError.code === "23505") {
      const { data: existing } = await supabaseAdmin
        .from("demo_requests")
        .select("id")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();
      return { ok: true, provider, ...(existing?.id ? { id: existing.id } : {}) };
    }
    console.error("[qwa:lead] persistence failed", insertError.code ?? "unknown");
    return { ok: false, provider, retryable: true, error: "persistence_failed" };
  }

  const leadId = inserted?.id;
  if (!leadId) {
    return { ok: false, provider, retryable: true, error: "persistence_failed" };
  }

  const a = payload.attribution;
  await supabaseAdmin.from("demo_request_context").insert({
    demo_request_id: leadId,
    source_cta: optional(a?.sourceCta, MAX.short),
    source_route: optional(a?.sourceRoute, MAX.url),
    page_title: optional(a?.pageTitle, MAX.short),
    landing_path: optional(a?.landingPath, MAX.url),
    referrer: optional(a?.referrer, MAX.url),
    utm_source: optional(a?.utmSource, MAX.short),
    utm_medium: optional(a?.utmMedium, MAX.short),
    utm_campaign: optional(a?.utmCampaign, MAX.short),
    utm_term: optional(a?.utmTerm, MAX.short),
    utm_content: optional(a?.utmContent, MAX.short),
    gclid: optional(a?.gclid, MAX.short),
    fbclid: optional(a?.fbclid, MAX.short),
    elapsed_ms: Number.isFinite(payload.elapsedMs) ? Math.trunc(payload.elapsedMs) : null,
    user_agent: optional(ctx.userAgent, MAX.short),
  });

  // --- Provider-neutral outbox: delivery happens later, form code unchanged. ---
  await supabaseAdmin.from("lead_deliveries").insert({
    demo_request_id: leadId,
    destination: "highlevel",
    status: "pending",
  });

  // --- Server-side conversion record (authoritative even if analytics blocked). ---
  await supabaseAdmin.from("conversion_events").insert({
    event_name: "demo_request_accepted",
    demo_request_id: leadId,
    source_cta: optional(a?.sourceCta, MAX.short),
    source_route: optional(a?.sourceRoute, MAX.url),
    utm_campaign: optional(a?.utmCampaign, MAX.short),
    metadata: { monthly_leads: values.monthly_leads, primary_goal: values.primary_goal },
  });

  return { ok: true, provider, id: leadId };
}

/** Silently absorbed bot submissions — counted, never stored as leads. */
export async function recordSuppressedSubmission(reason: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("conversion_events").insert({
    event_name: "demo_request_suppressed",
    metadata: { reason },
  });
}
