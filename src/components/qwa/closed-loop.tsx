import * as React from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container, Section, SectionHeading } from "./primitives";
import { MetricValue, MotionItem, MotionReveal, MotionStagger, PointerCard } from "./motion-primitives";
import { duration, ease } from "@/lib/motion";
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
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState(reduced ? stages.length - 1 : 0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const stageIndex = useTransform(scrollYProgress, (p) =>
    Math.min(stages.length - 1, Math.max(0, Math.floor(p * stages.length))),
  );

  useMotionValueEvent(stageIndex, "change", (v) => {
    if (!reduced) setActive(v);
  });

  return (
    <Section tone="ink" className="overflow-hidden">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow text-ink-foreground/60">Closed-loop intelligence</p>
          <h2 className="text-display mt-5 text-[clamp(2rem,4.6vw,3.5rem)]">
            A system that optimizes revenue, not clicks.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-foreground/70 sm:text-lg">
            Channel dashboards optimize their own metric. QWA runs a single loop where every
            decision is scored against the money it produced downstream.
          </p>
        </MotionReveal>

        <div ref={ref} className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-ink-foreground/12 bg-ink-foreground/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {stages.map((s, i) => (
            <motion.div
              key={s.label}
              animate={{
                backgroundColor:
                  i <= active
                    ? "color-mix(in oklab, var(--ink-foreground) 6%, var(--ink))"
                    : "var(--ink)",
              }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="group relative min-w-0 p-6 lg:p-7"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left bg-signal"
                animate={{ scaleX: i <= active ? 1 : 0 }}
                transition={{ duration: duration.base, ease: ease.out }}
              />
              <div className="flex items-center gap-2">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  animate={{
                    backgroundColor:
                      i <= active
                        ? "var(--signal)"
                        : "color-mix(in oklab, var(--ink-foreground) 25%, transparent)",
                    scale: i === active ? 1.25 : 1,
                  }}
                  transition={{ duration: duration.fast, ease: ease.out }}
                />
                <span className="text-data text-[0.65rem] text-ink-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3
                className={cn(
                  "mt-5 text-lg font-medium tracking-tight transition-colors duration-500",
                  i <= active ? "text-ink-foreground" : "text-ink-foreground/40",
                )}
              >
                {s.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-foreground/60">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

type Metric = {
  k: string;
  value: number;
  format: (n: number) => string;
  d: string;
  positive?: boolean;
};

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

const metrics: Metric[] = [
  { k: "Median first response", value: 9, format: (n) => `${Math.round(n)}s`, d: "was 3h 12m", positive: true },
  { k: "Qualified leads / mo", value: 1284, format: (n) => Math.round(n).toLocaleString("en-US"), d: "+34% vs. baseline", positive: true },
  { k: "Appointments set", value: 612, format: (n) => Math.round(n).toLocaleString("en-US"), d: "48% of qualified" },
  { k: "Lead-to-sale conversion", value: 27.4, format: (n) => `${n.toFixed(1)}%`, d: "+6.1 pts", positive: true },
  { k: "Attributable revenue", value: 3.42, format: (n) => `$${n.toFixed(2)}M`, d: "trailing 90 days" },
  { k: "Blended CAC", value: 318, format: usd, d: "−22%", positive: true },
  { k: "Revenue recovered", value: 486000, format: (n) => `$${Math.round(n / 1000)}K`, d: "reactivation loop", positive: true },
];

const sources: [string, number][] = [
  ["Paid", 78],
  ["Organic", 54],
  ["Voice", 41],
  ["Social", 26],
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

        <MotionReveal className="mt-14 lg:mt-16">
          <PointerCard intensity={2}>
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

              <MotionStagger
                stagger={0.05}
                className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3 lg:grid-cols-4"
              >
                {metrics.map((m) => (
                  <MotionItem key={m.k} className="min-w-0 p-5 sm:p-7">
                    <p className="truncate text-xs text-muted-foreground">{m.k}</p>
                    <p className="text-data mt-3 text-2xl font-medium tracking-tight sm:text-[1.75rem]">
                      <MetricValue value={m.value} format={m.format} />
                    </p>
                    <p
                      className={cn(
                        "mt-2 truncate text-xs",
                        m.positive ? "text-positive" : "text-muted-foreground",
                      )}
                    >
                      {m.d}
                    </p>
                  </MotionItem>
                ))}
                <MotionItem className="min-w-0 p-5 sm:p-7">
                  <p className="truncate text-xs text-muted-foreground">Revenue by source</p>
                  <div className="mt-4 grid gap-2">
                    {sources.map(([label, w], i) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="w-14 shrink-0 text-[0.7rem] text-muted-foreground">
                          {label}
                        </span>
                        <span className="h-1.5 min-w-0 flex-1 rounded-full bg-muted">
                          <motion.span
                            className="block h-1.5 rounded-full bg-signal"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${w}%` }}
                            viewport={{ once: true, amount: 0.8 }}
                            transition={{
                              duration: 0.9,
                              ease: ease.out,
                              delay: 0.1 + i * 0.08,
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </MotionItem>
              </MotionStagger>
            </div>
          </PointerCard>
        </MotionReveal>
      </Container>
    </Section>
  );
}
