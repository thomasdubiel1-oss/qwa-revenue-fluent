/**
 * Server-only revenue intelligence for the Phase 6 executive console.
 *
 * Every number here is derived from stored rows: demo_requests,
 * demo_request_context, conversion_events and lead_deliveries. No revenue,
 * ROAS, pipeline value or sales stage is invented — see revenue-contract.ts
 * for the forward-compatible interface those metrics will use later.
 *
 * Reads run exclusively through the service-role client inside server
 * functions, behind the same INTERNAL_OPS_TOKEN gate as Phase 5.
 */
import type {
  Breakdown,
  Delta,
  FunnelStage,
  IntelWindow,
  OpsInsight,
  RevenueIntel,
  TrendPoint,
} from "./intel.types";

/** Below this many leads a share/rate is reported but flagged as small-sample. */
const SMALL_SAMPLE = 10;

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

type LeadRow = {
  id: string;
  status: string;
  submitted_at: string;
  primary_goal: string;
  monthly_leads: string;
};

type ContextRow = {
  demo_request_id: string;
  source_cta: string | null;
  source_route: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
};

function label(value: string | null | undefined) {
  return (value ?? "").trim() || "—";
}

function delta(current: number, previous: number, previousHasData: boolean): Delta {
  if (!previousHasData || previous === 0) return { current, previous, pct: null };
  return { current, previous, pct: ((current - previous) / previous) * 100 };
}

function breakdown(leads: LeadRow[], keyOf: (lead: LeadRow) => string, limit = 8): Breakdown[] {
  const map = new Map<string, { count: number; qualified: number; disqualified: number }>();
  for (const lead of leads) {
    const k = keyOf(lead);
    const entry = map.get(k) ?? { count: 0, qualified: 0, disqualified: 0 };
    entry.count += 1;
    if (lead.status === "qualified") entry.qualified += 1;
    if (lead.status === "disqualified") entry.disqualified += 1;
    map.set(k, entry);
  }
  return [...map.entries()]
    .map(([k, v]) => ({
      label: k,
      count: v.count,
      qualified: v.qualified,
      disqualified: v.disqualified,
      qualifiedShare: v.count > 0 ? (v.qualified / v.count) * 100 : null,
      smallSample: v.count < SMALL_SAMPLE,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function weekKey(iso: string) {
  const d = new Date(iso);
  const day = (d.getUTCDay() + 6) % 7; // Monday-based
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

function series(leads: LeadRow[], keyer: (iso: string) => string): TrendPoint[] {
  const map = new Map<string, number>();
  for (const lead of leads) {
    const k = keyer(lead.submitted_at);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
}

export async function loadRevenueIntel(options: {
  windowDays: IntelWindow;
  staleHours: number;
}): Promise<RevenueIntel> {
  const db = await admin();
  const windowDays = options.windowDays;
  const staleHours = Math.min(Math.max(options.staleHours, 1), 720);

  const [{ data: leadsRaw }, { data: contextsRaw }, { data: eventsRaw }, { data: deliveriesRaw }] =
    await Promise.all([
      db.from("demo_requests").select("id,status,submitted_at,primary_goal,monthly_leads"),
      db
        .from("demo_request_context")
        .select("demo_request_id,source_cta,source_route,utm_source,utm_campaign"),
      db.from("conversion_events").select("event_name,occurred_at,demo_request_id"),
      db.from("lead_deliveries").select("demo_request_id,status"),
    ]);

  const leads = (leadsRaw ?? []) as LeadRow[];
  const contexts = (contextsRaw ?? []) as ContextRow[];
  const events = (eventsRaw ?? []) as {
    event_name: string;
    occurred_at: string;
    demo_request_id: string | null;
  }[];
  const deliveries = (deliveriesRaw ?? []) as { demo_request_id: string; status: string }[];

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const windowStart = now - windowDays * day;
  const prevStart = now - 2 * windowDays * day;

  const ts = (lead: LeadRow) => new Date(lead.submitted_at).getTime();
  const inWindow = leads.filter((l) => ts(l) >= windowStart);
  const inPrev = leads.filter((l) => ts(l) >= prevStart && ts(l) < windowStart);
  const earliest = leads.reduce<number | null>(
    (min, l) => (min === null || ts(l) < min ? ts(l) : min),
    null,
  );
  /** Previous period is only comparable when data existed that far back. */
  const previousComparable = earliest !== null && earliest <= windowStart;

  const ctxById = new Map(contexts.map((c) => [c.demo_request_id, c]));

  const acceptedEvents = events.filter((e) => e.event_name === "demo_request_accepted");
  const suppressedEvents = events.filter((e) => e.event_name === "demo_request_suppressed");
  const acceptedInWindow = acceptedEvents.filter(
    (e) => new Date(e.occurred_at).getTime() >= windowStart,
  );
  const acceptedInPrev = acceptedEvents.filter((e) => {
    const t = new Date(e.occurred_at).getTime();
    return t >= prevStart && t < windowStart;
  });
  const suppressedInWindow = suppressedEvents.filter(
    (e) => new Date(e.occurred_at).getTime() >= windowStart,
  );

  const statusCounts: Record<string, number> = {};
  for (const lead of inWindow) statusCounts[lead.status] = (statusCounts[lead.status] ?? 0) + 1;

  const count = (...statuses: string[]) =>
    statuses.reduce((sum, s) => sum + (statusCounts[s] ?? 0), 0);

  const submitted = inWindow.length;
  const share = (n: number) => (submitted > 0 ? (n / submitted) * 100 : 0);

  const funnel: FunnelStage[] = [
    { key: "submitted", label: "Submitted", count: submitted, share: 100 },
    {
      key: "triaged",
      label: "Triaged (moved out of new)",
      count: submitted - count("new"),
      share: share(submitted - count("new")),
    },
    {
      key: "engaged",
      label: "Reviewing / contacted",
      count: count("reviewing", "contacted"),
      share: share(count("reviewing", "contacted")),
    },
    {
      key: "qualified",
      label: "Qualified",
      count: count("qualified"),
      share: share(count("qualified")),
    },
    {
      key: "closed_out",
      label: "Disqualified / archived",
      count: count("disqualified", "archived"),
      share: share(count("disqualified", "archived")),
    },
  ];

  const deliveryByLead = new Map<string, string>();
  for (const d of deliveries) deliveryByLead.set(d.demo_request_id, d.status);
  const delivery = { pending: 0, sent: 0, failed: 0, none: 0 };
  for (const lead of inWindow) {
    const status = deliveryByLead.get(lead.id);
    if (status === "sent") delivery.sent += 1;
    else if (status === "failed") delivery.failed += 1;
    else if (status === "pending") delivery.pending += 1;
    else delivery.none += 1;
  }

  // Submission → server-recorded acceptance latency.
  const submittedAtById = new Map(leads.map((l) => [l.id, new Date(l.submitted_at).getTime()]));
  const latencies: number[] = [];
  for (const e of acceptedEvents) {
    if (!e.demo_request_id) continue;
    const start = submittedAtById.get(e.demo_request_id);
    if (start === undefined) continue;
    const ms = new Date(e.occurred_at).getTime() - start;
    if (ms >= 0 && ms < 10 * 60 * 1000) latencies.push(ms);
  }

  const staleCutoff = now - staleHours * 60 * 60 * 1000;
  const staleLeads = leads.filter((l) => l.status === "new" && ts(l) < staleCutoff);
  const oldestStale = staleLeads.reduce<number | null>((max, l) => {
    const hours = (now - ts(l)) / (60 * 60 * 1000);
    return max === null || hours > max ? hours : max;
  }, null);

  const ctx = (lead: LeadRow) => ctxById.get(lead.id);
  const bySourceCta = breakdown(inWindow, (l) => label(ctx(l)?.source_cta));
  const bySourceRoute = breakdown(inWindow, (l) => label(ctx(l)?.source_route));
  const byUtmSource = breakdown(inWindow, (l) => label(ctx(l)?.utm_source));
  const byUtmCampaign = breakdown(inWindow, (l) => label(ctx(l)?.utm_campaign));
  const byGoal = breakdown(inWindow, (l) => label(l.primary_goal));
  const byVolumeBand = breakdown(inWindow, (l) => label(l.monthly_leads));

  const totalSubmissionAttempts = acceptedInWindow.length + suppressedInWindow.length;
  const suppressionRate =
    totalSubmissionAttempts > 0
      ? (suppressedInWindow.length / totalSubmissionAttempts) * 100
      : null;

  const leadsDelta = delta(inWindow.length, inPrev.length, previousComparable);
  const insights: OpsInsight[] = [];
  const windowLabel = `last ${windowDays} days`;
  const smallSample = inWindow.length < SMALL_SAMPLE;

  if (leadsDelta.pct !== null && Math.abs(leadsDelta.pct) >= 30) {
    const up = leadsDelta.pct > 0;
    insights.push({
      id: "volume-shift",
      severity: up ? "info" : "watch",
      title: up ? "Lead volume up vs prior period" : "Lead volume down vs prior period",
      detail: `Submissions changed ${leadsDelta.pct.toFixed(0)}% against the immediately preceding ${windowDays}-day period.`,
      evidence: `${leadsDelta.current} leads in the ${windowLabel} vs ${leadsDelta.previous} in the prior ${windowDays} days.`,
      smallSample: inWindow.length < SMALL_SAMPLE || inPrev.length < SMALL_SAMPLE,
    });
  }

  if (suppressionRate !== null && suppressionRate >= 25 && totalSubmissionAttempts >= 5) {
    insights.push({
      id: "suppression",
      severity: suppressionRate >= 50 ? "alert" : "watch",
      title: "Elevated suppression rate",
      detail:
        "A high share of submission attempts were blocked by the honeypot / time-trap heuristics.",
      evidence: `${suppressedInWindow.length} suppressed of ${totalSubmissionAttempts} attempts (${suppressionRate.toFixed(0)}%) in the ${windowLabel}.`,
      smallSample: totalSubmissionAttempts < SMALL_SAMPLE,
    });
  }

  if (delivery.failed > 0) {
    insights.push({
      id: "delivery-failed",
      severity: "alert",
      title: "CRM delivery failures",
      detail: "One or more outbox rows are in a failed state and need a retry.",
      evidence: `${delivery.failed} failed deliveries among ${inWindow.length} leads in the ${windowLabel}.`,
      smallSample: false,
      drill: { delivery: "failed" },
    });
  }

  if (delivery.pending >= 5) {
    insights.push({
      id: "delivery-backlog",
      severity: process.env["LEAD_WEBHOOK_URL"] ? "watch" : "info",
      title: "CRM delivery backlog",
      detail: process.env["LEAD_WEBHOOK_URL"]
        ? "Pending outbox rows are accumulating faster than they drain."
        : "Pending rows are expected: no CRM destination is configured yet (HighLevel deferred).",
      evidence: `${delivery.pending} pending deliveries in the ${windowLabel}.`,
      smallSample: false,
      drill: { delivery: "pending" },
    });
  }

  if (staleLeads.length > 0) {
    insights.push({
      id: "stale-new",
      severity: staleLeads.length >= 5 ? "alert" : "watch",
      title: "Stale new leads",
      detail: `Leads still in "new" beyond the ${staleHours}-hour triage threshold.`,
      evidence: `${staleLeads.length} leads untouched; oldest ${oldestStale === null ? "—" : `${oldestStale.toFixed(0)}h`} old.`,
      smallSample: false,
      drill: { status: "new", sort: "oldest" },
    });
  }

  const topSource = bySourceCta[0];
  if (topSource && inWindow.length >= SMALL_SAMPLE && topSource.count / inWindow.length >= 0.6) {
    insights.push({
      id: "source-concentration",
      severity: "watch",
      title: "Source concentration",
      detail: "A single CTA accounts for most inbound demand, concentrating acquisition risk.",
      evidence: `${topSource.count} of ${inWindow.length} leads (${((topSource.count / inWindow.length) * 100).toFixed(0)}%) came from "${topSource.label}" in the ${windowLabel}.`,
      smallSample: false,
      drill: { source: topSource.label },
    });
  }

  for (const campaign of byUtmCampaign) {
    if (campaign.label === "—" || campaign.count < SMALL_SAMPLE) continue;
    if ((campaign.qualifiedShare ?? 0) < 10) {
      insights.push({
        id: `campaign-quality-${campaign.label}`,
        severity: "watch",
        title: `Low qualification share: ${campaign.label}`,
        detail: "Campaign generates volume but few leads reach qualified status.",
        evidence: `${campaign.qualified} qualified of ${campaign.count} leads (${(campaign.qualifiedShare ?? 0).toFixed(0)}%) in the ${windowLabel}.`,
        smallSample: false,
        drill: { campaign: campaign.label },
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      id: "nominal",
      severity: "info",
      title: "No threshold conditions met",
      detail:
        "Volume, suppression, delivery health, triage latency and source concentration are all within configured thresholds.",
      evidence: `Evaluated ${inWindow.length} leads and ${delivery.pending + delivery.sent + delivery.failed} delivery rows in the ${windowLabel}.`,
      smallSample,
    });
  }

  return {
    windowDays,
    generatedAt: new Date().toISOString(),
    totals: {
      allTimeLeads: leads.length,
      windowLeads: inWindow.length,
      accepted: acceptedInWindow.length,
      suppressed: suppressedInWindow.length,
      suppressionRate,
      last7: leads.filter((l) => ts(l) >= now - 7 * day).length,
      last30: leads.filter((l) => ts(l) >= now - 30 * day).length,
    },
    deltas: {
      leads: leadsDelta,
      accepted: delta(acceptedInWindow.length, acceptedInPrev.length, previousComparable),
      qualified: delta(
        inWindow.filter((l) => l.status === "qualified").length,
        inPrev.filter((l) => l.status === "qualified").length,
        previousComparable,
      ),
    },
    statusCounts,
    funnel,
    delivery,
    timing: {
      medianMs: median(latencies),
      averageMs:
        latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : null,
      sample: latencies.length,
    },
    staleNew: { count: staleLeads.length, thresholdHours: staleHours, oldestHours: oldestStale },
    bySourceCta,
    bySourceRoute,
    byUtmSource,
    byUtmCampaign,
    byGoal,
    byVolumeBand,
    trendDaily: series(inWindow, dayKey),
    trendWeekly: series(inWindow, weekKey),
    insights,
    destinationConfigured: Boolean(process.env["LEAD_WEBHOOK_URL"]),
    smallSample,
  };
}
