/**
 * QWA analytics layer.
 *
 * A single, vendor-neutral surface for conversion events. Nothing here embeds a
 * third-party SDK: events are pushed to `window.dataLayer` (if a tag manager is
 * ever installed) and re-emitted as a DOM CustomEvent so any future provider can
 * subscribe without touching product code.
 */

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
  | "unknown";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const DEV = import.meta.env.DEV;

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    ...props,
    route: window.location.pathname,
    ts: Date.now(),
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("qwa:analytics", { detail: payload }));

  if (DEV) console.info("[qwa:analytics]", payload);
}
