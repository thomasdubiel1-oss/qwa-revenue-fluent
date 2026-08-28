/**
 * Phase 6 — Internal Revenue Intelligence & Executive Operating Console.
 *
 * Same access boundary as the Phase 5 lead console: an INTERNAL_OPS_TOKEN
 * verified server-side, all reads through the service-role client inside
 * server functions, route noindex/noarchive and absent from sitemap/public nav.
 *
 * Every figure comes from stored rows. Revenue, ROAS, pipeline value and sales
 * stages are deliberately absent — see src/lib/ops/revenue-contract.ts.
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BreakdownTable,
  DeltaLabel,
  FunnelBars,
  OpsShell,
  Panel,
  Pill,
  SmallSampleNote,
  Sparkbars,
  StatCard,
} from "@/components/qwa/internal/ops-ui";
import { internalHead } from "@/config/seo";
import { opsAccessStatusFn } from "@/lib/ops/ops.functions";
import { opsRevenueIntelFn } from "@/lib/ops/intel.functions";
import type { IntelWindow } from "@/lib/ops/intel.types";
import { DEFERRED_REVENUE_METRICS, REVENUE_DATA_AVAILABLE } from "@/lib/ops/revenue-contract";

export const Route = createFileRoute("/internal/revenue")({
  ssr: false,
  head: () => internalHead("Revenue Intelligence — QWA Internal"),
  component: RevenueConsole,
});

const KEY_STORAGE = "qwa:ops-key";

function useOpsKey() {
  const [key, setKey] = React.useState("");
  React.useEffect(() => {
    try {
      setKey(window.sessionStorage.getItem(KEY_STORAGE) ?? "");
    } catch {
      /* storage unavailable */
    }
  }, []);
  const save = React.useCallback((next: string) => {
    setKey(next);
    try {
      if (next) window.sessionStorage.setItem(KEY_STORAGE, next);
      else window.sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* storage unavailable */
    }
  }, []);
  return { key, save };
}

function fmtDuration(ms: number | null) {
  if (ms === null) return "—";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function RevenueConsole() {
  const { key, save } = useOpsKey();
  const navigate = useNavigate();
  const [draftKey, setDraftKey] = React.useState("");
  const [windowDays, setWindowDays] = React.useState<IntelWindow>(30);
  const [staleHours, setStaleHours] = React.useState(72);

  const accessStatus = useServerFn(opsAccessStatusFn);
  const intelFn = useServerFn(opsRevenueIntelFn);

  const configured = useQuery({
    queryKey: ["ops", "configured"],
    queryFn: () => accessStatus({}),
  });

  const intel = useQuery({
    queryKey: ["ops", "intel", key, windowDays, staleHours],
    queryFn: () => intelFn({ data: { key, windowDays, staleHours } }),
    enabled: Boolean(key),
  });

  const denied = intel.data?.ok === false && intel.data.access.state === "denied";
  const unconfigured = configured.data?.configured === false;
  const data = intel.data?.ok ? intel.data.data : null;

  const drill = React.useCallback(
    (search: Record<string, string>) => {
      void navigate({ to: "/internal/leads", search });
    },
    [navigate],
  );

  if (unconfigured) {
    return (
      <OpsShell title="Revenue Intelligence" subtitle="Access not yet enabled">
        <Panel
          title="Console locked — access dependency not configured"
          description="The route and its server boundary exist, but no operator credential is present."
        >
          <p className="max-w-2xl text-sm text-muted-foreground">
            This surface derives every metric from lead data through server-side, service-role
            queries. It stays inert until an access secret named{" "}
            <code className="text-foreground">INTERNAL_OPS_TOKEN</code> (32+ random characters) is
            added in Project Settings → Secrets. No users or passwords have been invented.
          </p>
        </Panel>
      </OpsShell>
    );
  }

  if (!key || denied) {
    return (
      <OpsShell title="Revenue Intelligence" subtitle="Internal access required">
        <Panel title="Enter operator access key" description="Session-scoped. Never stored on disk.">
          <form
            className="flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              save(draftKey.trim());
            }}
          >
            <Input
              type="password"
              autoComplete="off"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="INTERNAL_OPS_TOKEN"
              aria-label="Operator access key"
            />
            <Button type="submit">Unlock</Button>
          </form>
          {denied ? (
            <p className="mt-3 text-xs text-destructive">
              That key was rejected. No data was returned.
            </p>
          ) : null}
        </Panel>
      </OpsShell>
    );
  }

  const t = data?.totals;

  return (
    <OpsShell
      title="Revenue Intelligence"
      subtitle={`Executive view · ${windowDays}-day window · derived only from stored lead data`}
      actions={
        <>
          <div className="flex items-center gap-1" role="group" aria-label="Time window">
            {([7, 30, 90] as IntelWindow[]).map((w) => (
              <Button
                key={w}
                size="sm"
                variant={w === windowDays ? "default" : "ghost"}
                onClick={() => setWindowDays(w)}
              >
                {w}d
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/internal/leads">Lead console</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => save("")}>
            Lock
          </Button>
        </>
      }
    >
      {intel.isLoading ? (
        <p className="text-sm text-muted-foreground">Computing…</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={`Leads · ${windowDays}d`}
          value={t?.windowLeads ?? "—"}
          hint={data ? undefined : "—"}
        />
        <StatCard label="Accepted demo requests" value={t?.accepted ?? "—"} hint="Server-recorded" />
        <StatCard label="Last 7 days" value={t?.last7 ?? "—"} />
        <StatCard label="Last 30 days" value={t?.last30 ?? "—"} />
      </div>
      {data ? (
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          <span className="text-xs text-muted-foreground">
            Leads: <DeltaLabel pct={data.deltas.leads.pct} />
          </span>
          <span className="text-xs text-muted-foreground">
            Accepted: <DeltaLabel pct={data.deltas.accepted.pct} />
          </span>
          <span className="text-xs text-muted-foreground">
            Qualified: <DeltaLabel pct={data.deltas.qualified.pct} />
          </span>
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Contacted"
          value={data?.statusCounts["contacted"] ?? 0}
          hint="Existing status values only"
        />
        <StatCard label="Qualified" value={data?.statusCounts["qualified"] ?? 0} />
        <StatCard
          label="Suppression rate"
          value={
            t?.suppressionRate === null || t?.suppressionRate === undefined
              ? "—"
              : `${t.suppressionRate.toFixed(0)}%`
          }
          hint={t ? `${t.suppressed} of ${t.accepted + t.suppressed} attempts` : undefined}
          tone={(t?.suppressionRate ?? 0) >= 25 ? "warn" : "default"}
        />
        <StatCard
          label="Submit → accept"
          value={fmtDuration(data?.timing.medianMs ?? null)}
          hint={
            data
              ? `median · avg ${fmtDuration(data.timing.averageMs)} · n=${data.timing.sample}`
              : undefined
          }
        />
      </div>

      {data?.smallSample ? (
        <SmallSampleNote>
          Small sample: {data.totals.windowLeads} leads in the {windowDays}-day window. Rates and
          deltas below are directional only.
        </SmallSampleNote>
      ) : null}

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <Panel
          title="Lead-state funnel"
          description="Real stored states only — no sales stages are implied. Click a stage to drill into the lead console."
        >
          <FunnelBars
            stages={data?.funnel ?? []}
            onSelect={(stageKey) => {
              if (stageKey === "qualified") drill({ status: "qualified" });
              else if (stageKey === "engaged") drill({ status: "contacted" });
              else if (stageKey === "triaged") drill({ sort: "oldest" });
              else if (stageKey === "closed_out") drill({ status: "archived" });
              else drill({});
            }}
          />
        </Panel>
        <Panel
          title="CRM delivery health"
          description="Tracked separately from lead state; delivery is an outbox concern, not a sales outcome."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Pending" value={data?.delivery.pending ?? 0} />
            <StatCard label="Sent" value={data?.delivery.sent ?? 0} />
            <StatCard
              label="Failed"
              value={data?.delivery.failed ?? 0}
              tone={(data?.delivery.failed ?? 0) > 0 ? "warn" : "default"}
            />
            <StatCard label="No row" value={data?.delivery.none ?? 0} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {data?.destinationConfigured
              ? "Destination configured."
              : "No CRM destination configured — HighLevel remains deferred, so pending rows are expected."}
          </p>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel title="Daily submissions" description={`Window: last ${windowDays} days`}>
          <Sparkbars points={data?.trendDaily ?? []} ariaLabel="Daily lead submissions" />
        </Panel>
        <Panel title="Weekly submissions" description="Monday-based ISO weeks">
          <Sparkbars points={data?.trendWeekly ?? []} ariaLabel="Weekly lead submissions" />
        </Panel>
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold tracking-[-0.01em]">Operational insights</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Threshold-based, not scored. Each item states the counts and window it came from.
        </p>
        <ul className="mt-3 grid gap-3 lg:grid-cols-2">
          {(data?.insights ?? []).map((insight) => (
            <li
              key={insight.id}
              className="rounded-xl border border-border/70 bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Pill
                  tone={
                    insight.severity === "alert"
                      ? "warn"
                      : insight.severity === "watch"
                        ? "signal"
                        : "muted"
                  }
                >
                  {insight.severity}
                </Pill>
                <span className="text-sm font-medium">{insight.title}</span>
                {insight.smallSample ? <Pill tone="muted">small sample</Pill> : null}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{insight.detail}</p>
              <p className="mt-1 text-xs tabular-nums">{insight.evidence}</p>
              {insight.drill ? (
                <button
                  type="button"
                  onClick={() => drill(insight.drill as Record<string, string>)}
                  className="mt-2 rounded-md text-xs text-signal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  View matching leads →
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <Panel title="By source CTA" description="Where the demo request was initiated">
          <BreakdownTable
            rows={data?.bySourceCta ?? []}
            onSelect={(labelValue) => drill({ source: labelValue })}
          />
        </Panel>
        <Panel title="By source route" description="Page the lead converted on">
          <BreakdownTable rows={data?.bySourceRoute ?? []} />
        </Panel>
        <Panel title="By UTM campaign" description="Falls back to “—” when untagged">
          <BreakdownTable
            rows={data?.byUtmCampaign ?? []}
            onSelect={(labelValue) => drill({ campaign: labelValue })}
          />
        </Panel>
        <Panel title="By UTM source" description="Paid/organic origin as tagged">
          <BreakdownTable rows={data?.byUtmSource ?? []} />
        </Panel>
        <Panel title="By primary goal" description="Self-reported at submission">
          <BreakdownTable
            rows={data?.byGoal ?? []}
            onSelect={(labelValue) => drill({ goal: labelValue })}
          />
        </Panel>
        <Panel title="By monthly lead-volume band" description="Self-reported at submission">
          <BreakdownTable rows={data?.byVolumeBand ?? []} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <Panel title="Triage threshold" description="Configurable stale-lead window">
          <label className="flex max-w-xs flex-col gap-1">
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Hours before a “new” lead is stale
            </span>
            <Input
              type="number"
              min={1}
              max={720}
              value={staleHours}
              onChange={(e) => setStaleHours(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
          <p className="mt-3 text-xs text-muted-foreground">
            {data
              ? `${data.staleNew.count} lead(s) still in “new” past ${data.staleNew.thresholdHours}h; oldest ${
                  data.staleNew.oldestHours === null
                    ? "—"
                    : `${data.staleNew.oldestHours.toFixed(0)}h`
                }.`
              : "—"}
          </p>
        </Panel>
        <Panel
          title="Revenue data — not connected"
          description="Deferred until a CRM sync exists. Nothing below is estimated."
        >
          <p className="text-xs text-muted-foreground">
            {REVENUE_DATA_AVAILABLE
              ? "Revenue data is available."
              : "No opportunity, sale or revenue rows exist. The forward-compatible contract (external contact/opportunity ids, stage, closed status, amount, closed_at, attribution link, sync timestamps) is defined in src/lib/ops/revenue-contract.ts; the additive table lands only when the CRM connection is approved."}
          </p>
          <ul className="mt-3 list-disc pl-5 text-xs text-muted-foreground">
            {DEFERRED_REVENUE_METRICS.map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Generated {data ? new Date(data.generatedAt).toLocaleString() : "—"} from{" "}
        {data?.totals.allTimeLeads ?? 0} stored leads. No revenue, ROAS, pipeline value or sales
        stage is shown because none exists in the data model yet.
      </p>
    </OpsShell>
  );
}
