import * as React from "react";
import { Container, Reveal, Section, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const stages = [
  { label: "Acquire", body: "Demand captured across paid, organic, social and voice." },
  { label: "Engage", body: "Instant, governed conversation in the customer's channel." },
  { label: "Convert", body: "Qualification, booking and assisted selling in one path." },
  { label: "Attribute", body: "Revenue joined back to every touch that produced it." },
  { label: "Predict", body: "Forecast intent, value and likely close on live data." },
  { label: "Decide", body: "Budget, offer and routing choices ranked by revenue impact." },
  { label: "Execute", body: "Changes shipped to channels within policy limits you set." },
  { label: "Learn", body: "Outcomes rewrite the model — the loop gets sharper weekly." },
];

export function ClosedLoop() {
  const [active, setActive] = React.useState(0);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = 1 - (r.bottom - window.innerHeight * 0.5) / (r.height || 1);
      const idx = Math.min(stages.length - 1, Math.max(0, Math.floor(p * stages.length)));
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Section tone="ink" className="overflow-hidden">
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-eyebrow text-ink-foreground/60">Closed-loop intelligence</p>
            <h2 className="text-display mt-5 text-[clamp(2rem,4.6vw,3.5rem)]">
              A system that optimizes revenue, not clicks.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-foreground/70 sm:text-lg">
              Channel dashboards optimize their own metric. QWA runs a single loop where every
              decision is scored against the money it produced downstream.
            </p>
          </div>
        </Reveal>

        <div ref={ref} className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {stages.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "min-w-0 rounded-2xl border p-5 transition-all duration-500 lg:p-6",
                i <= active
                  ? "border-ink-foreground/25 bg-ink-foreground/[0.06]"
                  : "border-ink-foreground/10 bg-transparent",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                    i <= active ? "bg-signal" : "bg-ink-foreground/25",
                  )}
                />
                <span className="text-data text-[0.65rem] text-ink-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3
                className={cn(
                  "mt-4 text-lg font-medium tracking-tight transition-colors duration-500",
                  i <= active ? "text-ink-foreground" : "text-ink-foreground/45",
                )}
              >
                {s.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-foreground/60">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

const metrics = [
  { k: "Median first response", v: "9s", d: "was 3h 12m", tone: "positive" },
  { k: "Qualified leads / mo", v: "1,284", d: "+34% vs. baseline", tone: "positive" },
  { k: "Appointments set", v: "612", d: "48% of qualified", tone: "muted" },
  { k: "Lead-to-sale conversion", v: "27.4%", d: "+6.1 pts", tone: "positive" },
  { k: "Attributable revenue", v: "$3.42M", d: "trailing 90 days", tone: "muted" },
  { k: "Blended CAC", v: "$318", d: "−22%", tone: "positive" },
  { k: "Revenue recovered", v: "$486K", d: "reactivation loop", tone: "positive" },
];

export function OutcomePanel() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Executive view"
          title="The numbers a revenue leader actually reviews."
          lede="One panel for the whole funnel: speed, throughput, conversion, cost and attributed revenue. Figures below are an illustrative simulation, not customer results."
        />

        <Reveal className="mt-14 lg:mt-16">
          <div className="surface-card overflow-hidden shadow-lift">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4 sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-positive animate-node-pulse" />
                <p className="truncate text-sm font-medium">Revenue overview — demo workspace</p>
              </div>
              <span className="text-data shrink-0 text-[0.7rem] text-muted-foreground">
                Trailing 90 days · simulated data
              </span>
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3 lg:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.k} className="min-w-0 p-5 sm:p-7">
                  <p className="truncate text-xs text-muted-foreground">{m.k}</p>
                  <p className="text-data mt-3 text-2xl font-medium tracking-tight sm:text-[1.75rem]">
                    {m.v}
                  </p>
                  <p
                    className={cn(
                      "mt-2 truncate text-xs",
                      m.tone === "positive" ? "text-positive" : "text-muted-foreground",
                    )}
                  >
                    {m.d}
                  </p>
                </div>
              ))}
              <div className="min-w-0 p-5 sm:p-7">
                <p className="truncate text-xs text-muted-foreground">Revenue by source</p>
                <div className="mt-4 grid gap-2">
                  {[
                    ["Paid", 78],
                    ["Organic", 54],
                    ["Voice", 41],
                    ["Social", 26],
                  ].map(([label, w]) => (
                    <div key={String(label)} className="flex items-center gap-3">
                      <span className="w-14 shrink-0 text-[0.7rem] text-muted-foreground">
                        {label}
                      </span>
                      <span className="h-1.5 min-w-0 flex-1 rounded-full bg-muted">
                        <span
                          className="block h-1.5 rounded-full bg-signal"
                          style={{ width: `${w}%` }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
