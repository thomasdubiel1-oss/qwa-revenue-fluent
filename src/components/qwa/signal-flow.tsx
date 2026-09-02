import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/**
 * QWA signal flow — the product's visual signature.
 *
 * Sources (ads, search, DM, voice, web) are interpreted by the QWA intelligence
 * node and resolved into an appointment, a sale and attributed revenue that is
 * routed back to the source that produced it.
 *
 * All values are illustrative simulation data.
 */

type Source = {
  id: string;
  label: string;
  detail: string;
};

const sources: Source[] = [
  { id: "ads", label: "Ads", detail: "q3-retarget-04" },
  { id: "search", label: "Search", detail: "non-brand query" },
  { id: "dm", label: "DM", detail: "Instagram" },
  { id: "voice", label: "Voice", detail: "inbound call" },
  { id: "web", label: "Web", detail: "pricing page" },
];

/** One pass of the loop, as the panel narrates it. */
const phases = [
  {
    key: "capture",
    node: "Interpreting signal",
    event: (s: Source) => `${s.label} signal captured · ${s.detail}`,
  },
  {
    key: "respond",
    node: "Responding in channel",
    event: (s: Source) => `First response sent · ${s.label} · 9.2s`,
  },
  {
    key: "qualify",
    node: "Qualifying",
    event: () => "Fit score 87 · budget, timing, service area",
  },
  { key: "book", node: "Booking", event: () => "Appointment set · Tue 10:20am" },
  { key: "sale", node: "Writing outcome", event: () => "Closed–won · $14,200" },
  {
    key: "attribute",
    node: "Attributing revenue",
    event: (s: Source) => `$14,200 attributed to ${s.label}`,
  },
] as const;

const SOURCE_Y = (i: number) => (220 * (i + 0.5)) / sources.length;
const OUTCOME_Y = (i: number) => (220 * (i + 0.5)) / 3;

export function SignalFlow({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [cycle, setCycle] = React.useState(0);
  // Start from the same frame the server rendered, then resolve. Branching on
  // `reduced` during the first render causes a hydration mismatch.
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    if (reduced) {
      // Reduced motion gets the complete, resolved state — revenue attributed.
      setPhase(phases.length - 1);
      return;
    }
    const id = window.setInterval(() => {
      setPhase((p) => {
        if (p === phases.length - 1) {
          setCycle((c) => c + 1);
          return 0;
        }
        return p + 1;
      });
    }, 1900);
    return () => window.clearInterval(id);
  }, [reduced]);

  const activeIndex = cycle % sources.length;
  const active = sources[activeIndex]!;
  const current = phases[phase]!;

  const booked = phase >= 3;
  const sold = phase >= 4;
  const attributed = phase >= 5;

  // Illustrative running totals so the panel has memory across cycles.
  const attributedTotal = 14200 * (cycle + (attributed ? 1 : 0));

  return (
    <div className={cn("relative min-w-0", className)}>
      <div className="surface-card p-4 shadow-card sm:p-5">
        {/* Panel chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute inset-0 rounded-full bg-signal/30 animate-node-pulse" />
              <span className="h-1 w-1 rounded-full bg-signal" />
            </span>
            <p className="text-[0.8125rem] font-medium">Signal flow</p>
          </div>
          <p className="shrink-0 text-[0.75rem] text-muted-foreground">Illustrative simulation</p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(3.5rem,0.62fr)_minmax(0,1fr)] items-stretch gap-2 pt-4 sm:gap-3">
          {/* Sources */}
          <ul className="grid content-between gap-1.5">
            {sources.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={s.id}
                  className={cn(
                    "relative flex min-w-0 items-center justify-between gap-2 rounded-md border px-2.5 py-2 transition-colors duration-500 sm:px-3",
                    isActive
                      ? "border-signal/40 bg-signal-soft/60"
                      : "border-hairline bg-transparent",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "h-1 w-1 shrink-0 rounded-full transition-colors duration-500",
                        isActive ? "bg-signal" : "bg-hairline-strong",
                      )}
                    />
                    <span className="truncate text-[0.8rem] font-medium">{s.label}</span>
                  </span>
                  {isActive ? (
                    <span className="text-data hidden shrink-0 text-[0.6rem] sm:inline">
                      {attributed ? (
                        <span className="text-positive">+$14,200</span>
                      ) : (
                        <span className="text-muted-foreground">{s.detail}</span>
                      )}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {/* Routing + intelligence node */}
          <div className="relative">
            <svg
              viewBox="0 0 120 220"
              preserveAspectRatio="none"
              className="h-full w-full text-signal"
              fill="none"
              aria-hidden="true"
            >
              {sources.map((s, i) => (
                <path
                  key={s.id}
                  d={`M0 ${SOURCE_Y(i)} C 34 ${SOURCE_Y(i)}, 26 110, 46 110`}
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="3 6"
                  opacity={i === activeIndex ? 0.85 : 0.16}
                  className={i === activeIndex && !reduced ? "animate-flow" : undefined}
                />
              ))}
              {[0, 1, 2].map((i) => {
                const reachedOutcome = i === 0 ? booked : i === 1 ? sold : attributed;
                return (
                  <path
                    key={i}
                    d={`M74 110 C 94 110, 86 ${OUTCOME_Y(i)}, 120 ${OUTCOME_Y(i)}`}
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="3 6"
                    opacity={reachedOutcome ? 0.8 : 0.14}
                    className={reachedOutcome && !reduced ? "animate-flow" : undefined}
                  />
                );
              })}
              {/* Attribution returning to the source that produced the revenue */}
              <motion.path
                d={`M120 ${OUTCOME_Y(2)} C 60 214, 40 214, 0 ${SOURCE_Y(activeIndex)}`}
                stroke="var(--positive)"
                strokeWidth="1.1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="3 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  attributed ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: reduced ? 0 : 1.1, ease: ease.out }}
              />
            </svg>

            {/* Intelligence node */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative grid place-items-center">
                {!reduced ? (
                  <motion.span
                    key={`ring-${phase}-${cycle}`}
                    className="absolute h-14 w-14 rounded-full border border-signal/40"
                    initial={{ scale: 0.7, opacity: 0.7 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, ease: ease.out }}
                  />
                ) : null}
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-ink text-ink-foreground shadow-lift sm:h-14 sm:w-14">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.35"
                    />
                    <circle cx="12" cy="12" r="3" className="fill-signal" />
                    <path
                      d="M4 12h4M16 12h4M12 4v4M12 16v4"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.45"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Outcomes */}
          <ul className="grid content-between gap-1.5">
            {[
              { label: "Appointment", value: booked ? "Tue 10:20am" : "pending", on: booked },
              { label: "Sale", value: sold ? "Closed–won" : "pending", on: sold },
              {
                label: "Revenue",
                value: attributed ? `$${attributedTotal.toLocaleString("en-US")}` : "attributing…",
                on: attributed,
              },
            ].map((o) => (
              <li
                key={o.label}
                className={cn(
                  "min-w-0 rounded-lg border px-2.5 py-2.5 transition-colors duration-500 sm:px-3",
                  o.on
                    ? "border-hairline-strong bg-card shadow-card"
                    : "border-hairline bg-card/40",
                )}
              >
                <p className="truncate text-[0.8rem] font-medium">{o.label}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={o.value}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: duration.fast, ease: ease.out }}
                    className={cn(
                      "text-data mt-1 truncate text-[0.65rem]",
                      o.on ? "text-foreground" : "text-muted-foreground",
                      o.label === "Revenue" && o.on && "text-positive",
                    )}
                  >
                    {o.value}
                  </motion.p>
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>

        {/* Node state + event readout */}
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex items-center gap-2 bg-paper px-3.5 py-2.5">
            <span className="h-1 w-1 rounded-full bg-signal animate-node-pulse" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current.key}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: duration.fast, ease: ease.out }}
                className="text-data whitespace-nowrap text-[0.65rem] text-foreground"
              >
                {current.node}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="min-w-0 bg-paper px-3.5 py-2.5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${current.key}-${cycle}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: duration.fast, ease: ease.out }}
                className="text-data truncate text-[0.65rem] text-muted-foreground"
              >
                {current.event(active)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
