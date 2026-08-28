/** Types for the Phase 6 internal Revenue Intelligence console. */

export type IntelWindow = 7 | 30 | 90;

export type Delta = {
  current: number;
  previous: number;
  /** Null when the previous period has no data (delta not mathematically supported). */
  pct: number | null;
};

export type Breakdown = {
  label: string;
  count: number;
  qualified: number;
  disqualified: number;
  /** Null until the sample is large enough to be meaningful. */
  qualifiedShare: number | null;
  smallSample: boolean;
};

export type FunnelStage = {
  key: string;
  label: string;
  count: number;
  /** Share of submitted leads in window. */
  share: number;
};

export type TrendPoint = { date: string; count: number };

export type OpsInsight = {
  id: string;
  severity: "info" | "watch" | "alert";
  title: string;
  detail: string;
  /** Human-readable evidence: raw counts and the window they came from. */
  evidence: string;
  smallSample: boolean;
  /** Optional drill-down into the Phase 5 lead console. */
  drill?: Record<string, string> | undefined;
};

export type RevenueIntel = {
  windowDays: IntelWindow;
  generatedAt: string;
  totals: {
    allTimeLeads: number;
    windowLeads: number;
    accepted: number;
    suppressed: number;
    suppressionRate: number | null;
    last7: number;
    last30: number;
  };
  deltas: {
    leads: Delta;
    accepted: Delta;
    qualified: Delta;
  };
  statusCounts: Record<string, number>;
  funnel: FunnelStage[];
  delivery: { pending: number; sent: number; failed: number; none: number };
  timing: {
    /** Submission → server-recorded acceptance, milliseconds. */
    medianMs: number | null;
    averageMs: number | null;
    sample: number;
  };
  staleNew: { count: number; thresholdHours: number; oldestHours: number | null };
  bySourceCta: Breakdown[];
  bySourceRoute: Breakdown[];
  byUtmSource: Breakdown[];
  byUtmCampaign: Breakdown[];
  byGoal: Breakdown[];
  byVolumeBand: Breakdown[];
  trendDaily: TrendPoint[];
  trendWeekly: TrendPoint[];
  insights: OpsInsight[];
  destinationConfigured: boolean;
  /** True when the whole window sample is too small for confident reading. */
  smallSample: boolean;
};
