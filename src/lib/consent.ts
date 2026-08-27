/**
 * Consent + storage preferences.
 *
 * Deliberately minimal and provider-neutral. QWA currently sets no third-party
 * cookies and loads no analytics SDK, so the only client storage in use is
 * first-party sessionStorage for campaign attribution.
 *
 * Categories:
 *   essential  — always allowed; cannot be switched off (form state, security)
 *   attribution— first-party sessionStorage UTM/landing capture
 *   analytics  — any future third-party measurement (GA4/GTM/PostHog)
 *
 * Default posture is conservative: `analytics` is OFF until an explicit
 * decision is recorded. `attribution` defaults ON because it is first-party,
 * session-scoped and directly serves the request the visitor initiates — the
 * owner/counsel should confirm this basis before launch in EU/UK markets.
 */

export type ConsentCategory = "essential" | "attribution" | "analytics";

export type ConsentState = {
  attribution: boolean;
  analytics: boolean;
  /** null until the visitor (or configuration) records an explicit decision. */
  decidedAt: string | null;
};

const STORAGE_KEY = "qwa:consent";

export const DEFAULT_CONSENT: ConsentState = {
  attribution: true,
  analytics: false,
  decidedAt: null,
};

let cached: ConsentState | null = null;
const listeners = new Set<(state: ConsentState) => void>();

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return DEFAULT_CONSENT;
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = raw ? { ...DEFAULT_CONSENT, ...(JSON.parse(raw) as Partial<ConsentState>) } : DEFAULT_CONSENT;
  } catch {
    cached = DEFAULT_CONSENT;
  }
  return cached;
}

export function isAllowed(category: ConsentCategory): boolean {
  if (category === "essential") return true;
  const state = getConsent();
  return category === "analytics" ? state.analytics : state.attribution;
}

/** Record an explicit preference. Safe to call from a future preference UI. */
export function setConsent(next: Partial<Omit<ConsentState, "decidedAt">>): ConsentState {
  const state: ConsentState = {
    ...getConsent(),
    ...next,
    decidedAt: new Date().toISOString(),
  };
  cached = state;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — preference is honoured for this page view only */
    }
    window.dispatchEvent(new CustomEvent("qwa:consent", { detail: state }));
  }
  for (const listener of listeners) listener(state);
  return state;
}

export function onConsentChange(listener: (state: ConsentState) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Clear stored preferences and any attribution data captured under them. */
export function resetConsent() {
  cached = null;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem("qwa:utm");
    window.sessionStorage.removeItem("qwa:landing");
  } catch {
    /* nothing to clear */
  }
}
