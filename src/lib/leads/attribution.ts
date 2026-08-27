import type { DemoSource } from "@/lib/analytics";
import type { LeadAttribution } from "./types";
import { isAllowed } from "@/lib/consent";

const LANDING_KEY = "qwa:landing";
const UTM_KEY = "qwa:utm";

type UtmBag = Partial<
  Pick<
    LeadAttribution,
    | "utmSource"
    | "utmMedium"
    | "utmCampaign"
    | "utmTerm"
    | "utmContent"
    | "gclid"
    | "fbclid"
    | "referrer"
  >
>;

const PARAM_MAP: Record<string, keyof UtmBag> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  gclid: "gclid",
  fbclid: "fbclid",
};

function readStored(): UtmBag {
  try {
    const raw = window.sessionStorage.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as UtmBag) : {};
  } catch {
    return {};
  }
}

/**
 * Persist first-touch campaign data for the session. Safe to call on every
 * mount; existing values are never overwritten by a later, emptier navigation.
 */
export function captureCampaignContext() {
  if (typeof window === "undefined") return;
  // First-party, session-scoped attribution storage respects the preference.
  if (!isAllowed("attribution")) return;
  try {
    const stored = readStored();
    const params = new URLSearchParams(window.location.search);
    const next: UtmBag = { ...stored };

    for (const [param, key] of Object.entries(PARAM_MAP)) {
      const value = params.get(param);
      if (value && !next[key]) next[key] = value;
    }
    if (!next.referrer && document.referrer && !document.referrer.includes(window.location.host)) {
      next.referrer = document.referrer;
    }
    window.sessionStorage.setItem(UTM_KEY, JSON.stringify(next));
    if (!window.sessionStorage.getItem(LANDING_KEY)) {
      window.sessionStorage.setItem(LANDING_KEY, window.location.pathname);
    }
  } catch {
    /* storage unavailable — attribution degrades, form still works */
  }
}

export function getAttribution(sourceCta: DemoSource): LeadAttribution {
  if (typeof window === "undefined") {
    return { sourceRoute: "", sourceCta };
  }
  const stored = readStored();
  let landingPath: string | undefined;
  try {
    landingPath = window.sessionStorage.getItem(LANDING_KEY) ?? undefined;
  } catch {
    landingPath = undefined;
  }

  return {
    sourceRoute: window.location.pathname,
    sourceCta,
    pageTitle: document.title,
    ...(landingPath !== undefined && { landingPath }),
    ...stored,
  };
}
