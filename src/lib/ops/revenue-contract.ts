/**
 * FORWARD-COMPATIBLE REVENUE CONTRACT (Phase 6, documentation-only).
 *
 * No CRM is connected yet and no revenue exists in the database. Rather than
 * migrating speculative tables, this module defines the exact interface a
 * future CRM ingestion (HighLevel or otherwise) must satisfy. When the
 * connection is approved, the additive migration is mechanical:
 *
 *   public.crm_opportunities
 *     id                uuid pk
 *     demo_request_id   uuid null references public.demo_requests(id)
 *     external_contact_id      text not null
 *     external_opportunity_id  text not null unique
 *     pipeline / stage         text
 *     status            text  -- 'open' | 'won' | 'lost' | 'abandoned'
 *     amount_cents      bigint null       -- never inferred, only synced
 *     currency          text default 'USD'
 *     closed_at         timestamptz null
 *     source_attribution jsonb null       -- snapshot of demo_request_context
 *     synced_at / created_at / updated_at timestamptz
 *   + GRANTs to service_role only (server-side ingestion; no anon/authenticated
 *     access), RLS enabled with no public policy — same posture as the existing
 *     lead tables.
 *
 * Until such rows exist, every revenue/ROAS/pipeline surface in the internal
 * console must remain absent rather than estimated. `REVENUE_DATA_AVAILABLE`
 * is the single switch the UI reads.
 */

export const REVENUE_DATA_AVAILABLE = false as const;

export type CrmOpportunityStatus = "open" | "won" | "lost" | "abandoned";

/** Shape a future CRM sync must produce, one row per opportunity. */
export type CrmOpportunityRecord = {
  /** Our lead, when the CRM record can be linked back to a demo request. */
  demoRequestId: string | null;
  externalContactId: string;
  externalOpportunityId: string;
  pipeline: string | null;
  stage: string | null;
  status: CrmOpportunityStatus;
  /** Integer minor units. Null when the CRM has no amount — never estimated. */
  amountCents: number | null;
  currency: string;
  closedAt: string | null;
  /** Attribution snapshot copied from demo_request_context at link time. */
  sourceAttribution: {
    sourceCta: string | null;
    sourceRoute: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
  } | null;
  syncedAt: string;
};

/** Contract for whichever adapter performs the sync (HighLevel is deferred). */
export type CrmRevenueAdapter = {
  readonly id: string;
  readonly configured: boolean;
  /** Pull opportunities changed since a watermark; must be idempotent. */
  fetchChangedSince(since: string): Promise<CrmOpportunityRecord[]>;
};

/** Metrics that become derivable only once the contract above is populated. */
export const DEFERRED_REVENUE_METRICS = [
  "Pipeline value by source / campaign",
  "Closed-won revenue and win rate",
  "Cost per acquisition and ROAS",
  "Lead-to-opportunity and opportunity-to-won conversion",
  "Revenue-weighted attribution",
] as const;
