import * as React from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Container, Section, SectionHeading } from "./primitives";
import { MetricValue, MotionItem, MotionReveal, MotionStagger } from "./motion-primitives";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/** Four movements of the loop. Fewer, larger ideas beat an eight-cell grid. */
const stages = [
  {
    label: "Acquire",
    body: "Demand captured across paid, organic, social and voice — with the campaign and creative attached.",
  },
  {
    label: "Engage",
    body: "Instant, governed conversation in the customer's channel: qualification, booking and assisted selling in one path.",
  },
  {
    label: "Attribute",
    body: "Closed revenue joined back to every touch that produced it, not to a last click.",
  },
  {
    label: "Learn",
    body: "Outcomes re-weight budget, offer and routing before the next signal arrives.",
  },
];

export function ClosedLoop() {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState(reduced ? stages.length - 1 : 0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
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
          <p className="text-[0.8125rem] font-medium text-ink-foreground/60">
            Closed-loop intelligence
          </p>
          <h2 className="text-display mt-5 text-[clamp(2rem,3.8vw,3.05rem)]">
            A system that optimizes revenue, not clicks.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-foreground/70">
            Channel dashboards optimize their own metric. QWA runs one loop where every decision is
            scored against the money it produced downstream.
          </p>
        </MotionReveal>

        <div ref={ref} className="mt-16 lg:mt-24">
          {/* The loop line: nodes advance with scroll, then the return path closes it. */}
          <div className="relative hidden h-px w-full bg-ink-foreground/15 lg:block">
            <motion.span
              className="absolute inset-y-0 left-0 block bg-signal"
              animate={{ width: `${((active + 1) / stages.length) * 100}%` }}
              transition={{ duration: duration.slow, ease: ease.out }}
            />
            {stages.map((s, i) => (
              <motion.span
                key={s.label}
                className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${(i / stages.length) * 100 + 100 / stages.length / 2}%` }}
                animate={{
                  backgroundColor:
                    i <= active
                      ? "var(--signal)"
                      : "color-mix(in oklab, var(--ink-foreground) 25%, transparent)",
                  scale: i === active ? 1.4 : 1,
                }}
                transition={{ duration: duration.fast, ease: ease.out }}
              />
            ))}
          </div>

          <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {stages.map((s, i) => (
              <div key={s.label} className="min-w-0">
                <div className="flex items-center gap-2 lg:hidden">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full"
                    animate={{
                      backgroundColor:
                        i <= active
                          ? "var(--signal)"
                          : "color-mix(in oklab, var(--ink-foreground) 25%, transparent)",
                    }}
                    transition={{ duration: duration.fast, ease: ease.out }}
                  />
                  <span className="text-data text-[0.65rem] text-ink-foreground/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className={cn(
                    "mt-4 text-[1.375rem] font-medium tracking-tight transition-colors duration-500 lg:mt-0",
                    i <= active ? "text-ink-foreground" : "text-ink-foreground/35",
                  )}
                >
                  {s.label}
                </h3>
                <p className="mt-3 max-w-[26ch] text-[0.9375rem] leading-relaxed text-ink-foreground/60">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
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

/** Headline figures — the three a revenue leader opens the panel for. */
const headline: Metric[] = [
  {
    k: "Attributable revenue",
    value: 3.42,
    format: (n) => `$${n.toFixed(2)}M`,
    d: "trailing 90 days",
  },
  {
    k: "Median first response",
    value: 9,
    format: (n) => `${Math.round(n)}s`,
    d: "from 3h 12m",
    positive: true,
  },
  {
    k: "Lead-to-sale conversion",
    value: 27.4,
    format: (n) => `${n.toFixed(1)}%`,
    d: "+6.1 pts",
    positive: true,
  },
];

const secondary: Metric[] = [
  {
    k: "Appointments set",
    value: 612,
    format: (n) => Math.round(n).toLocaleString("en-US"),
    d: "48% of qualified leads",
  },
  { k: "Blended CAC", value: 318, format: usd, d: "−22%", positive: true },
  {
    k: "Revenue recovered",
    value: 486000,
    format: (n) => `$${Math.round(n / 1000)}K`,
    d: "from reactivation",
    positive: true,
  },
];

const sources: [string, number, string][] = [
  ["Paid", 78, "$1.34M"],
  ["Organic", 54, "$0.92M"],
  ["Voice", 41, "$0.71M"],
  ["Social", 26, "$0.45M"],
];

export function OutcomePanel() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Executive view"
          title="The numbers a revenue leader actually reviews."
          lede="Speed, conversion, cost and attributed revenue in one panel — joined to the source that produced each dollar."
        />

        <MotionReveal className="mt-14 lg:mt-20">
          <div className="surface-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4 sm:px-8">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-positive animate-node-pulse" />
                <p className="truncate text-sm font-medium">Revenue overview</p>
              </div>
              <p className="shrink-0 text-[0.75rem] text-muted-foreground">
                Illustrative data · trailing 90 days
              </p>
            </div>

            <MotionStagger
              stagger={0.06}
              className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {headline.map((m) => (
                <MotionItem key={m.k} className="min-w-0 px-5 py-9 sm:px-8">
                  <p className="truncate text-[0.8125rem] text-muted-foreground">{m.k}</p>
                  <p className="text-data mt-4 text-[2.25rem] font-medium leading-none tracking-tight sm:text-[2.75rem]">
                    <MetricValue value={m.value} format={m.format} />
                  </p>
                  <p
                    className={cn(
                      "mt-3 truncate text-xs",
                      m.positive ? "text-positive" : "text-muted-foreground",
                    )}
                  >
                    {m.d}
                  </p>
                </MotionItem>
              ))}
            </MotionStagger>

            <MotionStagger
              stagger={0.05}
              className="grid border-t border-border divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {secondary.map((m) => (
                <MotionItem key={m.k} className="min-w-0 px-5 py-6 sm:px-8">
                  <p className="truncate text-xs text-muted-foreground">{m.k}</p>
                  <p className="text-data mt-2.5 text-xl font-medium tracking-tight">
                    <MetricValue value={m.value} format={m.format} />
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 truncate text-[0.7rem]",
                      m.positive ? "text-positive" : "text-muted-foreground",
                    )}
                  >
                    {m.d}
                  </p>
                </MotionItem>
              ))}
            </MotionStagger>

            <div className="border-t border-border bg-paper px-5 py-8 sm:px-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[0.8125rem] font-medium">Attributed revenue by source</p>
                <p className="text-[0.75rem] text-muted-foreground">
                  joined at close, not last click
                </p>
              </div>
              <div className="mt-6 grid gap-3.5 sm:grid-cols-2 sm:gap-x-12">
                {sources.map(([label, w, amount], i) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-[0.8125rem] text-muted-foreground">
                      {label}
                    </span>
                    <span className="h-1 min-w-0 flex-1 rounded-full bg-muted">
                      <motion.span
                        className="block h-1 rounded-full bg-signal"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.9, ease: ease.out, delay: 0.08 + i * 0.07 }}
                      />
                    </span>
                    <span className="text-data w-16 shrink-0 text-right text-[0.78rem]">
                      {amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}
