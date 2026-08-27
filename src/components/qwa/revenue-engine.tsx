import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container, Eyebrow, Section } from "./primitives";
import { MotionReveal, useMediaQuery } from "./motion-primitives";
import { RiveStage } from "./rive-stage";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  time: string;
  title: string;
  body: string;
  event: { channel: string; label: string; meta: string; value?: string };
};

const steps: Step[] = [
  {
    id: "arrive",
    time: "T+0s",
    title: "A signal arrives",
    body: "A paid click, a search visit, an Instagram DM or an inbound call — every entry point lands in the same graph with full source context.",
    event: { channel: "Instagram DM", label: "New signal captured", meta: "campaign: q3-retarget-04" },
  },
  {
    id: "respond",
    time: "T+9s",
    title: "Immediate AI response",
    body: "QWA answers in the channel the customer chose, in your voice, with your offer logic — before intent decays.",
    event: { channel: "DM reply", label: "First response sent", meta: "latency 9.2s" },
  },
  {
    id: "qualify",
    time: "T+1m",
    title: "Qualification",
    body: "Budget, timing, location and fit are resolved conversationally and written to the customer record — no forms, no drop-off.",
    event: { channel: "Qualification", label: "Fit score 87", meta: "budget · timing · service area" },
  },
  {
    id: "followup",
    time: "T+6m",
    title: "Voice, SMS and DM follow-up",
    body: "Sequenced, governed follow-up across channels. Cadence adapts to observed response behavior, not a static drip.",
    event: { channel: "Voice + SMS", label: "Follow-up executed", meta: "3 touches · 1 answered" },
  },
  {
    id: "appointment",
    time: "T+11m",
    title: "Appointment booked",
    body: "Real availability, real calendars, confirmations and reminders. Show-rate protection built into the sequence.",
    event: { channel: "Calendar", label: "Appointment set", meta: "Tue 10:20am · rep: J. Ruiz" },
  },
  {
    id: "assist",
    time: "In room",
    title: "Salesperson assistance",
    body: "Your rep gets the full history, the likely objection and the next best offer — one screen, before the conversation starts.",
    event: { channel: "Sales assist", label: "Brief delivered", meta: "next best offer: bundle B" },
  },
  {
    id: "sale",
    time: "T+2d",
    title: "Sale",
    body: "Closed-won is written back to the graph and joined to every touch that produced it.",
    event: { channel: "CRM", label: "Closed–won", meta: "contract signed", value: "$14,200" },
  },
  {
    id: "attribute",
    time: "Continuous",
    title: "Revenue attribution",
    body: "The revenue travels back down the chain — to the campaign, the creative, the conversation and the rep that produced it. Not to a last click.",
    event: { channel: "Attribution", label: "Revenue assigned", meta: "q3-retarget-04 · creative 12", value: "$14,200" },
  },
  {
    id: "learn",
    time: "Ongoing",
    title: "The system learns",
    body: "Outcomes re-weight the model: budget, cadence and next-best-action shift before the next signal arrives.",
    event: { channel: "Optimization", label: "Next best action updated", meta: "creative 12 · +18% budget" },
  },
  {
    id: "reactivate",
    time: "Later",
    title: "Reactivation",
    body: "Dormant leads and past customers re-enter the loop on intent, not on a calendar date — pipeline you already paid for.",
    event: { channel: "Reactivation", label: "Dormant lead re-engaged", meta: "intent signal · 214 days idle" },
  },
];


const ATTRIBUTION_INDEX = steps.findIndex((s) => s.id === "attribute");
const LEARN_INDEX = steps.findIndex((s) => s.id === "learn");

export function RevenueEngine() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();

  return (
    <Section id="revenue-engine" tone="paper" className="overflow-hidden py-0">
      <Container className="pt-20 sm:pt-24 lg:pt-28">
        <MotionReveal className="max-w-3xl">
          <Eyebrow>The Revenue Engine</Eyebrow>
          <h2 className="text-display mt-5 text-[clamp(2rem,4.6vw,3.5rem)]">
            One lead, followed end to end.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Most stacks lose the thread between the click and the invoice. QWA keeps one record of
            the customer, the conversation and the money — and sends the money back to its source.
          </p>
        </MotionReveal>
      </Container>

      {isDesktop && !reduced ? <PinnedSequence /> : <LinearSequence />}
    </Section>
  );
}

/* -------------------------------------------------------------------------
 * Desktop: pinned, scrubbed cinematic sequence (GSAP ScrollTrigger)
 * ---------------------------------------------------------------------- */

function PinnedSequence() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: () => `+=${steps.length * 62}%`,
        pin: stage,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          const i = Math.min(steps.length - 1, Math.floor(p * steps.length + 0.0001));
          setIndex((prev) => (prev === i ? prev : i));
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const step = steps[index]!;

  return (
    <div ref={wrapRef} className="relative">
      <div ref={stageRef} className="flex min-h-screen items-center">
        <Container className="w-full py-16">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-24">
            <StepNarrative index={index} step={step} progress={progress} />
            <RecordStage index={index} progress={progress} />
          </div>
        </Container>
      </div>
    </div>
  );
}

function StepNarrative({
  index,
  step,
  progress,
}: {
  index: number;
  step: Step;
  progress: number;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-4">
        <span className="text-data text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-hairline">
          <span
            className="block h-px bg-signal"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </span>
        <span className="text-data text-xs text-signal">{step.time}</span>
      </div>

      <div className="relative mt-10 min-h-[16rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: duration.base, ease: ease.out }}
          >
            <h3 className="text-display text-[clamp(1.9rem,3vw,2.8rem)]">{step.title}</h3>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <ol className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={cn(
                "h-1 w-1 rounded-full transition-colors duration-500",
                i <= index ? "bg-signal" : "bg-hairline-strong",
              )}
            />
            <span
              className={cn(
                "text-[0.7rem] transition-colors duration-500",
                i === index
                  ? "text-foreground"
                  : i < index
                    ? "text-muted-foreground"
                    : "text-muted-foreground/45",
              )}
            >
              {s.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The system-of-record panel: journey spine, event feed, attribution return. */
function RecordStage({ index, progress }: { index: number; progress: number }) {
  const attributing = index >= ATTRIBUTION_INDEX;
  const learning = index >= LEARN_INDEX;
  const visible = steps.slice(0, index + 1).slice(-4);

  return (
    <RiveStage
      label="Animated walkthrough of a single customer record moving from first signal to attributed revenue"
      fallback={
        <div className="surface-card overflow-hidden shadow-card">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <span className="text-data text-[0.7rem] text-muted-foreground">Record · QWA-84213</span>
            <span className="text-data text-[0.7rem] text-muted-foreground">
              stage {index + 1}/{steps.length}
            </span>
          </div>

          <div className="h-px w-full bg-hairline">
            <motion.div
              className="h-px bg-signal"
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
            <JourneySpine index={index} attributing={attributing} />

            <div className="grid content-start gap-2.5">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.985 }}
                    animate={{ opacity: s.id === steps[index]!.id ? 1 : 0.45, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.985 }}
                    transition={{ duration: duration.fast, ease: ease.out }}
                  >
                    <EventCard step={s} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-hairline">
            {[
              ["Response", index >= 1 ? "9.2s" : "—"],
              ["Appointment", index >= 4 ? "Booked" : "—"],
              ["Attributed", attributing ? "$14,200" : "—"],
            ].map(([k, v]) => (
              <div key={k} className="border-r border-hairline px-5 py-4 last:border-r-0">
                <p className="text-[0.7rem] text-muted-foreground">{k}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={v}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: duration.fast, ease: ease.out }}
                    className={cn(
                      "text-data mt-1 text-sm font-medium",
                      v !== "—" && "text-foreground",
                    )}
                  >
                    {v}
                  </motion.p>
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {learning ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: duration.base, ease: ease.out }}
                className="overflow-hidden border-t border-hairline bg-signal-soft/60"
              >
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <p className="text-sm font-medium">Next best action updated</p>
                  <span className="text-data text-[0.7rem] text-muted-foreground">
                    creative 12 · budget +18%
                  </span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      }
    />
  );
}

const spineNodes = ["Source", "Response", "Qualify", "Follow-up", "Appt", "Assist", "Sale"];

/** Vertical journey with a return path that carries revenue back to the source. */
function JourneySpine({ index, attributing }: { index: number; attributing: boolean }) {
  const reachedNode = Math.min(spineNodes.length - 1, index);
  const gap = 34;
  const height = (spineNodes.length - 1) * gap + 16;
  const spineX = 30;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 120 ${height}`}
        className="h-full w-full text-signal"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="xMinYMin meet"
      >
        <line
          x1={spineX}
          y1="8"
          x2={spineX}
          y2={height - 8}
          stroke="var(--hairline-strong)"
          strokeWidth="1"
        />
        <motion.line
          x1={spineX}
          y1="8"
          x2={spineX}
          y2={height - 8}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: (reachedNode * gap) / (height - 16) }}
          transition={{ duration: duration.base, ease: ease.out }}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {spineNodes.map((_, i) => (
          <motion.circle
            key={i}
            cx={spineX}
            cy={8 + i * gap}
            r={i === reachedNode ? 4.5 : 3}
            animate={{
              opacity: i <= reachedNode ? 1 : 0.28,
              scale: i === reachedNode ? 1 : 0.9,
            }}
            transition={{ duration: duration.fast, ease: ease.out }}
            fill={i <= reachedNode ? "currentColor" : "var(--hairline-strong)"}
          />
        ))}

        {/* Revenue returning to the source that produced it */}
        <motion.path
          d={`M${spineX} ${height - 8} C 2 ${height - 8}, 2 8, ${spineX} 8`}
          stroke="var(--positive)"
          strokeWidth="1.25"
          strokeDasharray="3 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={attributing ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.1, ease: ease.out }}
        />
        {spineNodes.map((n, i) => (
          <text
            key={`t-${n}`}
            x={spineX + 13}
            y={8 + i * gap + 3}
            fontSize="9"
            className={cn(
              "transition-colors duration-500",
              i <= reachedNode ? "fill-foreground" : "fill-muted-foreground/45",
            )}
          >
            {n}
          </text>
        ))}
      </svg>

      <AnimatePresence>
        {attributing ? (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7, duration: duration.base, ease: ease.out }}
            className="text-data absolute bottom-0 left-0 whitespace-nowrap rounded-full bg-positive/10 px-2 py-0.5 text-[0.6rem] text-positive"
          >
            $14,200 → source
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}


/* -------------------------------------------------------------------------
 * Mobile / reduced motion: linear progression, no pinning, no scrub
 * ---------------------------------------------------------------------- */

function LinearSequence() {
  return (
    <Container className="pb-24 pt-14 sm:pb-28">
      <ol className="relative border-l border-hairline pl-6">
        {steps.map((s, i) => (
          <li key={s.id}>
            <MotionReveal className="relative py-7" amount={0.4}>
              <span
                className={cn(
                  "absolute -left-[1.72rem] top-9 h-[9px] w-[9px] rounded-full",
                  s.id === "attribute" || s.id === "learn" ? "bg-positive" : "bg-signal",
                )}
                aria-hidden="true"
              />
              <p className="text-eyebrow">
                {String(i + 1).padStart(2, "0")} · {s.time}
              </p>
              <h3 className="mt-3 text-xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              <div className="mt-4">
                <EventCard step={s} />
              </div>
            </MotionReveal>
          </li>
        ))}
      </ol>
    </Container>
  );
}

function EventCard({ step }: { step: Step }) {
  return (
    <div className="rounded-xl border border-hairline bg-paper px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">{step.event.label}</p>
        <span className="text-data shrink-0 text-[0.65rem] text-muted-foreground">{step.time}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-data truncate text-[0.7rem] text-muted-foreground">
          {step.event.channel} · {step.event.meta}
        </p>
        {step.event.value ? (
          <span className="text-data shrink-0 text-[0.75rem] font-medium text-positive">
            {step.event.value}
          </span>
        ) : null}
      </div>
    </div>
  );
}
