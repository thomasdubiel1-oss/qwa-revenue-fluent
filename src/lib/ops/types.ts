/** Shared types for the internal Lead Operations Console (Phase 5). */

export const LEAD_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "qualified",
  "disqualified",
  "archived",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type DeliveryStatus = "pending" | "sent" | "failed";

/** Internal staff roles (Phase 10). viewer < ops < admin. */
export const INTERNAL_ROLES = ["viewer", "ops", "admin"] as const;
export type InternalRole = (typeof INTERNAL_ROLES)[number];

export type InternalActor = { userId: string; role: InternalRole; label: string };

export type OpsAccessState =
  | { state: "ready" }
  /** No valid internal session on the request. */
  | { state: "unauthenticated" }
  /** Signed in, but not an enabled internal user with a sufficient role. */
  | { state: "forbidden" };

export type OpsOverview = {
  totalLeads: number;
  newLeads: number;
  byStatus: Record<string, number>;
  delivery: { pending: number; sent: number; failed: number };
  acceptedConversions: number;
  suppressedSubmissions: number;
  last7Days: number;
  topSources: { label: string; count: number }[];
  topCampaigns: { label: string; count: number }[];
  goalMix: { label: string; count: number }[];
  volumeMix: { label: string; count: number }[];
  destinationConfigured: boolean;
};

export type OpsLeadRow = {
  id: string;
  submittedAt: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  website: string;
  monthlyLeads: string;
  primaryGoal: string;
  status: string;
  sourceCta: string | null;
  sourceRoute: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  deliveryStatus: DeliveryStatus | null;
  deliveryId: string | null;
  attemptCount: number;
  lastError: string | null;
};

export type OpsLeadDetail = {
  lead: OpsLeadRow & {
    notes: string | null;
    consent: boolean;
    consentAt: string | null;
    updatedAt: string;
  };
  context: {
    pageTitle: string | null;
    landingPath: string | null;
    referrer: string | null;
    sourceCta: string | null;
    sourceRoute: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmTerm: string | null;
    utmContent: string | null;
    gclid: string | null;
    fbclid: string | null;
    elapsedMs: number | null;
    userAgent: string | null;
    createdAt: string;
  } | null;
  events: {
    id: string;
    eventName: string;
    occurredAt: string;
    sourceCta: string | null;
    sourceRoute: string | null;
    utmCampaign: string | null;
    metadata: string | null;
  }[];
  deliveries: {
    id: string;
    destination: string;
    status: string;
    attemptCount: number;
    lastAttemptAt: string | null;
    nextAttemptAt: string;
    lastError: string | null;
    providerRef: string | null;
    updatedAt: string;
  }[];
};

export type OpsFilters = {
  search?: string | undefined;
  status?: string | undefined;
  delivery?: string | undefined;
  source?: string | undefined;
  campaign?: string | undefined;
  goal?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  sort?: "newest" | "oldest" | "company" | undefined;
  limit?: number | undefined;
};

export type OpsResponse<T> = { ok: true; data: T } | { ok: false; access: OpsAccessState };
