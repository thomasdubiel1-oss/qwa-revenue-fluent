import type { DemoSource } from "@/lib/analytics";

export type LeadAttribution = {
  /** Route the CTA was pressed on. */
  sourceRoute: string;
  /** Named CTA placement. */
  sourceCta: DemoSource;
  pageTitle?: string;
  referrer?: string;
  landingPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
};

export type DemoRequestPayload = {
  email: string;
  name: string;
  company: string;
  website: string;
  monthlyLeads: string;
  primaryGoal: string;
  phone?: string | undefined;
  notes?: string | undefined;
  /** Consent to be contacted about this request. */
  consent: boolean;
  attribution: LeadAttribution;
  /** Milliseconds between form render and submit — used for bot heuristics. */
  elapsedMs: number;
};

export type LeadSubmitResult =
  | { ok: true; id?: string; provider: string }
  | { ok: false; error: string; provider: string; retryable: boolean };

/**
 * Provider adapter boundary. A future HighLevel / Lovable Cloud / webhook
 * integration implements this interface only — the form never changes.
 */
export type LeadProvider = {
  name: string;
  submit: (payload: DemoRequestPayload) => Promise<LeadSubmitResult>;
};
