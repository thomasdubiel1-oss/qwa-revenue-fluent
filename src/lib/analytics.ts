/**
 * QWA analytics layer.
 *
 * A single, vendor-neutral surface for conversion events. Nothing here embeds a
 * third-party SDK: events are pushed to `window.dataLayer` (if a tag manager is
 * ever installed) and re-emitted as a DOM CustomEvent so any future provider can
 * subscribe without touching product code.
 */

import { isAllowed } from "@/lib/consent";

export type AnalyticsEvent =
  | "demo_cta_clicked"
  | "demo_modal_opened"
  | "demo_modal_dismissed"
  | "demo_form_started"
  | "demo_form_submitted"
  | "demo_form_success"
  | "demo_form_failed";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

/** Where a demo CTA was pressed. Keeps source naming consistent site-wide. */
export type DemoSource =
  | "site_header"
  | "home_hero"
  | "home_closing_cta"
  | "product_hero"
  | "product_cta"
  | "content_hero"
  | "content_cta"
  | "unknown";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const DEV = import.meta.env.DEV;

/**
 * Duplicate suppression. React 18 StrictMode double-invokes effects and CTA
 * handlers can fire twice on fast double-clicks; identical events inside this
 * window are dropped so funnel counts stay truthful. The server remains the
 * source of truth for a successful conversion (`demo_requests` row + a
 * `conversion_events` row written by the lead server function).
 */
const DEDUPE_WINDOW_MS = 1200;
const recent = new Map<string, number>();

function isDuplicate(key: string, now: number): boolean {
  const last = recent.get(key);
  if (last !== undefined && now - last < DEDUPE_WINDOW_MS) return true;
  recent.set(key, now);
  if (recent.size > 50) {
    for (const [k, t] of recent) if (now - t > DEDUPE_WINDOW_MS) recent.delete(k);
  }
  return false;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (isDuplicate(`${event}:${props["source"] ?? ""}`, now)) return;

  const payload = {
    event,
    ...props,
    route: window.location.pathname,
    ts: now,
  };

  // Third-party measurement (GTM/GA4/PostHog) only receives events once the
  // visitor has allowed the `analytics` category. The internal DOM event is
  // always emitted so first-party product code can observe the funnel.
  if (isAllowed("analytics")) {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
  }
  window.dispatchEvent(new CustomEvent("qwa:analytics", { detail: payload }));

  if (DEV) console.info("[qwa:analytics]", payload);
}
