import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, CircleAlert, Clock3, ShieldCheck } from "lucide-react";
import * as React from "react";
import { Panel, Pill } from "@/components/qwa/internal/ops-ui";
import { TwinHeader, TwinShell } from "@/components/qwa/internal/twin-shell";
import { Button } from "@/components/ui/button";
import { internalHead } from "@/config/seo";
import { simulatedExecutiveRepository } from "@/lib/twin/adapter";
import type { ExecutiveSnapshot, JourneyStatus } from "@/lib/twin/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/internal/executive")({
  ssr: false,
  head: () => internalHead("Executive Command Center — QWA Digital Twin"),
  component: ExecutiveCommandCenter,
});

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
const statusTone: Record<JourneyStatus, "positive" | "signal" | "warn" | "muted"> = {
  completed: "positive",
  active: "signal",
  failed: "warn",
  waiting: "muted",
  conflict: "warn",
};

export function ExecutiveCommandCenter() {
  const [snapshot, setSnapshot] = React.useState<ExecutiveSnapshot | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  React.useEffect(() => {
    void simulatedExecutiveRepository.getSnapshot().then(setSnapshot);
  }, []);

  if (!snapshot)
    return (
      <TwinShell>
        <div className="p-8 text-sm text-muted-foreground">Loading executive snapshot…</div>
      </TwinShell>
    );
  const journey = snapshot.journeys.find((item) => item.id === selected) ?? null;
  const maxRevenue = Math.max(...snapshot.channels.map((channel) => channel.revenue));

  return (
    <TwinShell>
      <TwinHeader title="Executive Command Center" account={snapshot.account}>
        <Pill tone="signal">V1 simulated</Pill>
      </TwinHeader>
      <div className="space-y-6 p-5 lg:p-8">
        <section
          aria-label="Executive metrics"
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {snapshot.metrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-xl border border-border/70 bg-card p-4 shadow-sm"
              title={metric.definition}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <span
                  className={cn(
                    "text-xs font-medium",
                    metric.direction === "up" ? "text-positive" : "text-muted-foreground",
                  )}
                >
                  {metric.change}
                </span>
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight tabular-nums">
                {metric.value}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {metric.definition}
              </p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <Panel
            title="Revenue performance"
            description="Attributed revenue by channel · USD · 30 days · refreshed 18:30 UTC"
          >
            <div
              className="space-y-4"
              role="img"
              aria-label="Attributed revenue by channel; Meta leads with $221,720"
            >
              {snapshot.channels.map((channel) => (
                <div
                  key={channel.name}
                  className="grid grid-cols-[5rem_1fr_5.5rem] items-center gap-3"
                >
                  <span className="text-sm">{channel.name}</span>
                  <span className="h-3 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-signal"
                      style={{ width: `${(channel.revenue / maxRevenue) * 100}%` }}
                    />
                  </span>
                  <span className="text-right text-sm tabular-nums">{money(channel.revenue)}</span>
                  <span />
                  <span className="-mt-2 text-xs text-muted-foreground">
                    Spend {money(channel.spend)}
                  </span>
                  <span className="-mt-2 text-right text-xs font-medium">
                    {channel.roas ? `${channel.roas.toFixed(1)}×` : "organic"}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel
            title="Revenue funnel"
            description="Stage counts with conversion from the prior stage"
          >
            <ol className="space-y-3">
              {snapshot.funnel.map((stage, index) => (
                <li key={stage.label} className="grid grid-cols-[1fr_auto] gap-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>{stage.label}</span>
                      <span className="tabular-nums">{stage.count.toLocaleString()}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground/70"
                        style={{
                          width: `${Math.max(8, (stage.count / snapshot.funnel[0]!.count) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {index === 0 ? "base" : `${stage.rate}%`}
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <Panel
            title="Attention required"
            description="Evidence-backed exceptions, ordered by commercial risk"
          >
            <ul className="space-y-3">
              {snapshot.alerts.map((alert) => (
                <li key={alert.id} className="rounded-lg border border-border/70 p-3">
                  <div className="flex items-start gap-3">
                    <CircleAlert
                      className={cn(
                        "mt-0.5 h-4 w-4",
                        alert.severity === "high" ? "text-destructive" : "text-signal",
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {alert.evidence}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel
            title="Recommended action"
            description="Decision Agent · bounded proposal · no action taken"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <Pill tone="warn">{snapshot.recommendation.state}</Pill>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {snapshot.recommendation.title}
                </h3>
                <p className="mt-2 text-sm text-positive">
                  Expected impact {snapshot.recommendation.expectedImpact}
                </p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-semibold tabular-nums">
                  {snapshot.recommendation.confidence}%
                </p>
                <p className="text-xs text-muted-foreground">confidence</p>
              </div>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-3">
              {snapshot.recommendation.evidence.map((evidence) => (
                <li
                  key={evidence}
                  className="flex gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0 text-signal" />
                  {evidence}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <Button disabled title="Approval workflow is simulated">
                Approve shift
              </Button>
              <Button variant="outline" disabled>
                Reject
              </Button>
              <span className="self-center text-xs text-muted-foreground">
                Controls intentionally disabled in simulation
              </span>
            </div>
          </Panel>
        </div>

        <Panel
          title="Revenue journey"
          description="One traceable path from acquisition through optimization"
        >
          {snapshot.journeys.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-border/70 p-4 text-left transition-colors hover:border-signal/50 hover:bg-signal-soft/30 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{item.contact}</span>
                  <Pill tone="positive">{item.outcome}</Pill>
                  <span className="text-xs text-muted-foreground">{item.id}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.source} · {item.campaign} · {item.steps.length} recorded events
                </p>
              </div>
              <div className="flex items-center gap-3">
                <strong className="tabular-nums">{money(item.value)}</strong>
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
          {journey ? (
            <div className="mt-5 border-t border-border pt-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">Journey {journey.id}</h3>
                <div className="flex items-center gap-3">
                  <Link
                    to="/app/journeys/$journeyId"
                    params={{ journeyId: journey.id }}
                    className="text-sm font-medium text-signal hover:underline"
                  >
                    Open full journey
                  </Link>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Close trace
                  </button>
                </div>
              </div>
              <ol className="grid gap-3 lg:grid-cols-3">
                {journey.steps.map((step) => (
                  <li key={step.id} className="rounded-lg border border-border/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Pill tone={statusTone[step.status]}>{step.status}</Pill>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {step.occurredAt}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.system}</p>
                    <p className="mt-3 text-sm">{step.detail}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {step.status === "waiting" ? (
                        <Clock3 className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      {step.evidence}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </Panel>
      </div>
    </TwinShell>
  );
}
