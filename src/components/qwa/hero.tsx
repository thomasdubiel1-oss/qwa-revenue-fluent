import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Container, Pill } from "./primitives";
import { useDemoRequest } from "./demo-request";
import { RiveStage } from "./rive-stage";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const channels = [
  { label: "Ads", detail: "Paid click" },
  { label: "Search", detail: "Organic query" },
  { label: "DM", detail: "Instagram" },
  { label: "Voice", detail: "Inbound call" },
  { label: "Web", detail: "Form fill" },
];

const outcomes = [
  { label: "Appointment", detail: "Tue 10:20am" },
  { label: "Sale", detail: "Closed–won" },
  { label: "Revenue", detail: "Attributed" },
];

export function Hero() {
  const { open } = useDemoRequest();
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
  };
  const item = reduced
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: duration.slow, ease: ease.out },
        },
      };

  return (
    <section className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      <div className="hairline-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <Container className="pb-20 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <motion.div
            className="min-w-0"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={item}>
              <Pill>
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-node-pulse" />
                The AI Revenue Operating System
              </Pill>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-display mt-7 text-[clamp(2.6rem,7.2vw,4.75rem)]"
            >
              Turn every customer signal into revenue.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              QWA unifies acquisition, conversations, sales, attribution and autonomous optimization
              into one closed-loop system — so every ad, message, call and appointment is measured
              against the revenue it actually produced.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <Button variant="ink" size="xl" onClick={open}>
                Book a private demo
              </Button>
              <Button variant="quiet" size="xl" asChild>
                <a href="#revenue-engine">See how QWA works</a>
              </Button>
            </motion.div>

            <motion.dl
              variants={item}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-hairline pt-7"
            >
              {[
                ["< 30s", "First response"],
                ["1 graph", "Customer + revenue"],
                ["Closed loop", "Signal to sale"],
              ].map(([v, k]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-data text-[0.95rem] font-medium sm:text-lg">{v}</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">{k}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.18 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function HeroVisual() {
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % channels.length), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  const current = channels[active] ?? channels[0]!;

  return (
    <RiveStage
      label="Live simulation of customer signals from ads, search, social, voice and web resolving into appointments, sales and attributed revenue"
      className="min-w-0"
      fallback={
        <div className="relative min-w-0">
          <div
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[3rem] opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 60% 40%, color-mix(in oklab, var(--signal) 16%, transparent), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="glass-panel rounded-[1.75rem] p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 pb-4">
              <span className="text-eyebrow">Live signal flow</span>
              <span className="text-data inline-flex items-center gap-2 text-[0.7rem] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-positive animate-node-pulse" />
                simulation
              </span>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
              <ul className="grid gap-2">
                {channels.map((c, i) => (
                  <li
                    key={c.label}
                    className={cn(
                      "relative flex min-w-0 items-center justify-between gap-2 rounded-xl border border-hairline bg-card/60 px-3 py-2.5",
                    )}
                  >
                    {i === active && !reduced ? (
                      <motion.span
                        layoutId="hero-channel-active"
                        className="absolute inset-0 rounded-xl border border-signal/40 bg-signal-soft"
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative truncate text-xs font-medium sm:text-sm">
                      {c.label}
                    </span>
                    <span className="text-data relative hidden truncate text-[0.65rem] text-muted-foreground sm:inline">
                      {c.detail}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="relative flex flex-col items-center">
                <svg
                  viewBox="0 0 60 200"
                  className="h-40 w-8 text-signal sm:h-48 sm:w-14"
                  fill="none"
                  aria-hidden="true"
                >
                  {channels.map((_, i) => (
                    <path
                      key={i}
                      d={`M0 ${20 + i * 40} C 30 ${20 + i * 40}, 30 100, 60 100`}
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity={i === active ? 0.9 : 0.18}
                      strokeDasharray="4 6"
                      className={i === active && !reduced ? "animate-flow" : undefined}
                    />
                  ))}
                </svg>
                <div className="mt-2 grid place-items-center rounded-2xl border border-hairline-strong bg-ink px-3 py-4 text-ink-foreground">
                  <span className="text-[0.6rem] font-medium tracking-[0.16em]">QWA</span>
                </div>
              </div>

              <ul className="grid gap-2">
                {outcomes.map((o) => (
                  <li
                    key={o.label}
                    className="min-w-0 rounded-xl border border-hairline bg-card px-3 py-3 shadow-card"
                  >
                    <p className="truncate text-xs font-medium sm:text-sm">{o.label}</p>
                    <p className="text-data mt-1 truncate text-[0.65rem] text-muted-foreground">
                      {o.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-hairline bg-paper px-4 py-3">
              <motion.p
                key={current.label}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.fast, ease: ease.out }}
                className="text-data text-[0.7rem] text-muted-foreground"
              >
                <span className="text-foreground">{current.label}</span> signal captured · qualified
                in 8s · routed to booking · attributed to campaign
              </motion.p>
            </div>
          </div>
        </div>
      }
    />
  );
}
