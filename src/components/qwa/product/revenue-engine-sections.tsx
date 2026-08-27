import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container, Section } from "../primitives";
import { MotionItem, MotionReveal, MotionStagger } from "../motion-primitives";
import {
  Chip,
  FieldGrid,
  IllustrativeNote,
  PanelProgress,
  ProductPanel,
  ProductSection,
  StatCell,
} from "./primitives";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
 * Hero visual — one record, one loop.
 * ---------------------------------------------------------------------- */

export function RevenueLoopVisual() {
  return (
    <ProductPanel title="Record · QWA-84213 · Ridgeline HVAC" meta="live simulation">
      <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="border-hairline p-6 sm:border-r">
          <FieldGrid
            fields={[
              { label: "Source", value: "Paid social · q3-retarget-04" },
              { label: "First response", value: "9.2s", accent: true },
              { label: "Qualification", value: "Fit 87 · budget confirmed" },
              { label: "Appointment", value: "Tue 10:20am · J. Ruiz" },
            ]}
          />
          <div className="mt-7">
            <PanelProgress value={0.86} />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-data text-[0.7rem] text-muted-foreground">
                signal → attributed revenue
              </span>
              <span className="text-data text-[0.7rem] text-positive">$14,200 attributed</span>
            </div>
          </div>
        </div>

        <div className="grid content-center justify-items-center gap-4 bg-paper p-6">
          <LoopRing />
          <p className="text-center text-[0.75rem] leading-relaxed text-muted-foreground">
            Ten stages, one continuous record
          </p>
        </div>
      </div>
      <div className="border-t border-hairline px-5 py-3.5">
        <IllustrativeNote />
      </div>
    </ProductPanel>
  );
}

function LoopRing() {
  const reduced = useReducedMotion();
  const nodes = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(a) * 34, y: 50 + Math.sin(a) * 34 };
  });

  return (
    <svg viewBox="0 0 100 100" className="h-32 w-32 text-signal" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="34" stroke="var(--hairline-strong)" strokeWidth="1" />
      <motion.circle
        cx="50"
        cy="50"
        r="34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, ease: ease.out }}
        transform="rotate(-90 50 50)"
      />
      <circle cx="50" cy="50" r="21" stroke="var(--positive)" strokeWidth="1" strokeDasharray="3 5" opacity="0.7" />
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === 0 ? 3 : 2} fill="currentColor" opacity={i === 0 ? 1 : 0.55} />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * 3 — Immediate response
 * ---------------------------------------------------------------------- */

const channels = ["Web chat", "Forms", "SMS", "Instagram DM", "Voice", "Email"];

export function ImmediateResponseSection() {
  return (
    <ProductSection
      id="immediate-response"
      eyebrow="Immediate response"
      title="Intent decays. QWA answers before it does."
      lede="Every entry point is watched by the same responder. The customer gets an answer in the channel they chose, and the record gets structured fields — not a transcript nobody reads."
      points={[
        "One responder across web, form, SMS, DM, voice and email",
        "Replies follow your offer rules, hours and escalation limits",
        "Intent, service need and contact detail written as fields, not notes",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Inbound · conversation 4482" meta="channel: Instagram DM">
        <div className="border-b border-hairline px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {channels.map((c) => (
              <Chip key={c} active={c === "Instagram DM"}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <div className="grid gap-3 p-5">
          <Bubble side="in" meta="T+0s">
            Do you handle mini-split installs in Pasadena? Ours died last night.
          </Bubble>
          <Bubble side="out" meta="T+9s · QWA">
            We do — same-week installs in Pasadena. Is this for a single room or the whole house?
          </Bubble>
          <Bubble side="in" meta="T+41s">
            Two bedrooms. Ideally this week.
          </Bubble>
        </div>

        <div className="border-t border-hairline bg-paper p-5">
          <p className="text-eyebrow mb-4">Written to record</p>
          <FieldGrid
            fields={[
              { label: "Intent", value: "Replacement install", accent: true },
              { label: "Scope", value: "2 zones · mini-split" },
              { label: "Urgency", value: "This week" },
              { label: "Service area", value: "Pasadena · in territory" },
            ]}
          />
        </div>
        <div className="border-t border-hairline px-5 py-3.5">
          <IllustrativeNote>
            Simulated conversation. Response timing depends on your channels and configuration.
          </IllustrativeNote>
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

function Bubble({
  side,
  meta,
  children,
}: {
  side: "in" | "out";
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", side === "out" ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed",
          side === "out"
            ? "rounded-br-md bg-ink text-ink-foreground"
            : "rounded-bl-md border border-hairline bg-paper text-foreground",
        )}
      >
        {children}
      </div>
      <span className="text-data text-[0.65rem] text-muted-foreground">{meta}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 4 — Qualification and routing
 * ---------------------------------------------------------------------- */

const signalsScored = [
  { label: "Budget signal", value: "Confirmed range", weight: 0.9 },
  { label: "Timing", value: "Within 7 days", weight: 0.95 },
  { label: "Service fit", value: "Standard install", weight: 0.8 },
  { label: "Location", value: "In territory", weight: 1 },
  { label: "Decision authority", value: "Homeowner", weight: 0.7 },
];

const routes = [
  { label: "Book", detail: "Fit ≥ 70 and timing inside 14 days", active: true },
  { label: "Nurture", detail: "Qualified but timing beyond horizon", active: false },
  { label: "Escalate", detail: "High value, complex scope or VIP account", active: false },
  { label: "Human", detail: "Policy, complaint or out-of-policy request", active: false },
];

export function QualificationSection() {
  return (
    <ProductSection
      id="qualification"
      eyebrow="Qualification and routing"
      title="A score your revenue team can argue with."
      lede="Fit is resolved in conversation, not behind a gated form. Every input to the score is visible, and the routing rule that fired is written on the record."
      points={[
        "Budget, timing, location, scope and authority captured conversationally",
        "Deterministic routing rules you author: book, nurture, escalate or hand to a human",
        "Every decision is inspectable and reversible",
      ]}
      media="left"
    >
      <ProductPanel title="Qualification · QWA-84213" meta="rule set: hvac-residential-v4">
        <div className="grid gap-4 p-5">
          {signalsScored.map((s, i) => (
            <div key={s.label} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[0.875rem] font-medium">{s.label}</span>
                <span className="text-data text-[0.75rem] text-muted-foreground">{s.value}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-hairline">
                <motion.div
                  className="h-1 rounded-full bg-signal"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.weight * 100}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: duration.slow, ease: ease.out, delay: i * 0.06 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-hairline bg-paper px-5 py-4">
          <span className="text-[0.875rem] font-medium">Fit score</span>
          <span className="text-data text-[1.5rem] font-medium text-signal">87</span>
        </div>

        <ul className="border-t border-hairline">
          {routes.map((r) => (
            <li
              key={r.label}
              className={cn(
                "flex items-center justify-between gap-4 border-b border-hairline px-5 py-3.5 last:border-b-0",
                !r.active && "opacity-55",
              )}
            >
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-medium">{r.label}</p>
                <p className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">{r.detail}</p>
              </div>
              {r.active ? (
                <span className="text-data shrink-0 rounded-full bg-signal-soft px-2.5 py-1 text-[0.65rem] text-foreground">
                  rule fired
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="border-t border-hairline px-5 py-3.5">
          <IllustrativeNote />
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 5 — Voice and conversation handoff
 * ---------------------------------------------------------------------- */

const thread = [
  { channel: "Web form", time: "Mon 8:42pm", body: "Submitted: mini-split replacement, Pasadena." },
  { channel: "SMS", time: "Mon 8:42pm", body: "QWA confirmed scope and offered three windows." },
  { channel: "Voice", time: "Tue 9:04am", body: "Inbound call. QWA recognized the number and continued the same thread." },
  { channel: "Appointment", time: "Tue 9:07am", body: "Booked Wed 10:20am with J. Ruiz. Confirmation sent by SMS." },
];

export function VoiceHandoffSection() {
  return (
    <ProductSection
      id="continuity"
      eyebrow="Cross-channel continuity"
      title="Form to SMS to voice, without repeating anything."
      lede="Channels are surfaces on one record. When a customer calls after texting, QWA already knows who they are, what they asked for and what was offered."
      points={[
        "Identity resolved across phone, email, handle and device",
        "Voice picks up the exact state the text thread left behind",
        "A human can take over mid-conversation with full context",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Conversation thread · one customer" meta="4 channels · 0 restarts">
        <ol className="relative px-5 py-6">
          <span className="absolute bottom-8 left-[2.15rem] top-9 w-px bg-hairline" aria-hidden="true" />
          {thread.map((t, i) => (
            <li key={t.channel} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 py-3.5">
              <span className="relative mt-1.5 grid place-items-center">
                <motion.span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    i === thread.length - 1 ? "bg-positive" : "bg-signal",
                  )}
                  initial={{ scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: duration.base, ease: ease.out, delay: i * 0.1 }}
                />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[0.9375rem] font-medium">{t.channel}</p>
                  <span className="text-data text-[0.7rem] text-muted-foreground">{t.time}</span>
                </div>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="border-t border-hairline px-5 py-3.5">
          <IllustrativeNote />
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 6 — Appointment engine
 * ---------------------------------------------------------------------- */

const slots = [
  { day: "Tue", time: "8:00", state: "busy" },
  { day: "Tue", time: "10:20", state: "held" },
  { day: "Tue", time: "1:40", state: "open" },
  { day: "Wed", time: "9:00", state: "open" },
  { day: "Wed", time: "11:30", state: "busy" },
  { day: "Wed", time: "3:00", state: "open" },
] as const;

export function AppointmentSection() {
  return (
    <ProductSection
      id="appointments"
      eyebrow="Appointment engine"
      title="Booked against real calendars, protected until it happens."
      lede="Availability comes from the rep's actual calendar and territory, not a generic scheduler. After booking, QWA runs the confirmation, reminder and reschedule path so fewer appointments quietly evaporate."
      points={[
        "Territory and skill routing decide who is offered, not round-robin",
        "Confirmations, reminders and self-serve reschedule in the customer's channel",
        "No-show risk triggers an earlier touch instead of a post-mortem",
      ]}
      media="left"
    >
      <ProductPanel title="Scheduling · Pasadena territory" meta="rep: J. Ruiz">
        <div className="grid grid-cols-3 gap-2.5 p-5">
          {slots.map((s) => (
            <div
              key={`${s.day}-${s.time}`}
              className={cn(
                "rounded-xl border px-3 py-3 text-center",
                s.state === "held" && "border-signal/40 bg-signal-soft",
                s.state === "open" && "border-hairline bg-card",
                s.state === "busy" && "border-transparent bg-muted text-muted-foreground",
              )}
            >
              <p className="text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
                {s.day}
              </p>
              <p className="text-data mt-1 text-[0.9375rem] font-medium">{s.time}</p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                {s.state === "held" ? "held" : s.state === "open" ? "open" : "booked"}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-hairline bg-paper p-5">
          <FieldGrid
            columns={2}
            fields={[
              { label: "Confirmed", value: "SMS · delivered", accent: true },
              { label: "Reminder", value: "T-24h and T-2h" },
              { label: "Reschedule", value: "Self-serve link active" },
              { label: "No-show risk", value: "Low · prior reply in 4m" },
            ]}
          />
        </div>
        <div className="border-t border-hairline px-5 py-3.5">
          <IllustrativeNote />
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 7 — Salesperson assistance
 * ---------------------------------------------------------------------- */

export function SalesAssistSection() {
  return (
    <ProductSection
      id="sales-assist"
      eyebrow="Salesperson assistance"
      title="Your rep walks in already briefed."
      lede="QWA does not replace the person who closes. It gives them the history, the likely objection and a recommended offer on one screen, two minutes before the conversation starts."
      points={[
        "Everything the customer already said, summarized to what matters",
        "The objection this segment usually raises, with the response that works",
        "A recommended offer the rep can accept, adjust or ignore",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Pre-appointment brief · J. Ruiz" meta="delivered T-2h">
        <div className="p-5">
          <p className="text-[1.0625rem] font-medium leading-snug">
            Replacement buyer, urgent, price-aware but not price-led.
          </p>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Two-zone mini-split, unit failed Monday night. Asked twice about install timing, once
            about financing. No competing quote mentioned.
          </p>
        </div>

        <div className="grid border-t border-hairline sm:grid-cols-2">
          <div className="border-hairline p-5 sm:border-r">
            <p className="text-eyebrow mb-3">Likely objection</p>
            <p className="text-[0.9375rem] leading-relaxed">
              Total cost versus repairing the existing unit.
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Suggested framing: 5-year cost of ownership, not sticker price.
            </p>
          </div>
          <div className="p-5">
            <p className="text-eyebrow mb-3">Recommended offer</p>
            <p className="text-[0.9375rem] leading-relaxed">Bundle B · install within 72 hours</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Financing pre-qualified. Rep can override before or during the visit.
            </p>
          </div>
        </div>

        <div className="border-t border-hairline bg-paper px-5 py-4">
          <p className="text-[0.8125rem] text-muted-foreground">
            Prior interactions: 1 form · 6 SMS · 1 call · 1 reschedule
          </p>
        </div>
        <div className="border-t border-hairline px-5 py-3.5">
          <IllustrativeNote />
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 8 — Sale and attribution (the centerpiece)
 * ---------------------------------------------------------------------- */

const attributionChain = [
  { label: "Paid social", detail: "q3-retarget-04" },
  { label: "Creative 12", detail: "15s vertical · variant B" },
  { label: "Instagram DM", detail: "conversation 4482" },
  { label: "Qualification", detail: "fit 87 · rule hvac-v4" },
  { label: "Appointment", detail: "Wed 10:20am" },
  { label: "J. Ruiz", detail: "closed–won" },
];

export function AttributionSection() {
  return (
    <Section id="attribution" tone="ink" className="scroll-mt-24 overflow-hidden">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <MotionReveal>
            <p className="text-eyebrow">Sale and attribution</p>
            <h2 className="text-display mt-5 text-[clamp(2rem,3.8vw,3.1rem)]">
              The revenue goes back to everything that produced it.
            </h2>
            <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-foreground/70">
              Last click credits the final touch and hides the work. QWA holds the whole chain on
              one record, so closed revenue can be joined to the campaign, the creative, the
              conversation, the appointment and the person who closed it.
            </p>
            <ul className="mt-9 grid gap-3.5 border-t border-ink-foreground/15 pt-7">
              {[
                "Contribution across the chain, not a single winning touch",
                "Conversations and appointments are first-class attribution objects",
                "Offline and voice outcomes join the same model as digital ones",
              ].map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-positive" aria-hidden="true" />
                  <span className="text-ink-foreground/75">{p}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal delay={0.08} className="min-w-0">
            <ProductPanel
              tone="ink"
              title="Closed–won · QWA-84213"
              meta="contract value $14,200"
              footer={<IllustrativeNote tone="ink" />}
            >
              <ol className="p-5">
                {attributionChain.map((n, i) => (
                  <li key={n.label} className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-4 py-2.5">
                    <span className="relative grid h-full place-items-center">
                      {i < attributionChain.length - 1 ? (
                        <span className="absolute top-1/2 h-full w-px bg-ink-foreground/15" aria-hidden="true" />
                      ) : null}
                      <motion.span
                        className="relative h-2 w-2 rounded-full bg-positive"
                        initial={{ scale: 0.3, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: duration.base, ease: ease.out, delay: 0.5 + i * 0.09 }}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[0.9375rem] font-medium">{n.label}</p>
                      <p className="text-data truncate text-[0.7rem] text-ink-foreground/50">
                        {n.detail}
                      </p>
                    </div>
                    <motion.span
                      className="text-data shrink-0 text-[0.8125rem] text-positive"
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: duration.base, ease: ease.out, delay: 0.9 + i * 0.09 }}
                    >
                      $14,200
                    </motion.span>
                  </li>
                ))}
              </ol>
              <div className="grid grid-cols-2 border-t border-ink-foreground/12 sm:grid-cols-3">
                {[
                  ["Model", "Chain contribution"],
                  ["Touches joined", "9"],
                  ["Time to close", "2d 14h"],
                ].map(([k, v]) => (
                  <div key={k} className="border-r border-ink-foreground/12 px-5 py-4 last:border-r-0">
                    <p className="text-[0.7rem] text-ink-foreground/50">{k}</p>
                    <p className="text-data mt-1 text-[0.9375rem] font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </ProductPanel>
          </MotionReveal>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------
 * 9 — Learning loop
 * ---------------------------------------------------------------------- */

const adjustments = [
  { label: "Creative 12 weighting", from: "0.8", to: "1.0", state: "applied" },
  { label: "Follow-up delay, DM cohort", from: "20m", to: "9m", state: "applied" },
  { label: "Lead score: urgency term", from: "0.7", to: "0.9", state: "applied" },
  { label: "Paid social daily budget", from: "$420", to: "$496", state: "awaiting approval" },
];

export function LearningSection() {
  return (
    <ProductSection
      id="learning"
      eyebrow="Learning loop"
      title="Outcomes rewrite the rules — inside your limits."
      lede="Closed–won and closed–lost both feed back. Scoring, timing, channel weighting and routing shift with observed results, and anything that spends money or changes policy waits for a human."
      points={[
        "Feedback from real outcomes, not engagement proxies",
        "Changes are versioned, attributable and reversible",
        "Budget and policy changes require named approval",
      ]}
      media="left"
    >
      <ProductPanel title="Model adjustments · last 7 days" meta="governance: on">
        <ul>
          {adjustments.map((a) => (
            <li
              key={a.label}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-hairline px-5 py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-medium">{a.label}</p>
                <p className="text-data mt-1 text-[0.75rem] text-muted-foreground">
                  {a.from} → <span className="text-signal">{a.to}</span>
                </p>
              </div>
              <span
                className={cn(
                  "text-data shrink-0 rounded-full px-2.5 py-1 text-[0.65rem]",
                  a.state === "applied"
                    ? "bg-signal-soft text-foreground"
                    : "border border-hairline-strong text-muted-foreground",
                )}
              >
                {a.state}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-hairline bg-paper px-5 py-4">
          <IllustrativeNote />
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 10 — Reactivation
 * ---------------------------------------------------------------------- */

const dormant = [
  { name: "Record QWA-71104", reason: "Quoted, never scheduled", trigger: "Returned to pricing page", idle: "214 days" },
  { name: "Record QWA-68930", reason: "Past customer, single system", trigger: "Maintenance interval reached", idle: "11 months" },
  { name: "Record QWA-77420", reason: "Lost on timing", trigger: "Stated 'next spring' window opened", idle: "163 days" },
];

export function ReactivationSection() {
  return (
    <ProductSection
      id="reactivation"
      eyebrow="Reactivation"
      title="Pipeline you already paid for, re-entered on intent."
      lede="Dormant leads and past customers come back into the loop when something actually changes — a site visit, a service interval, a stated timeline arriving — rather than on a monthly blast."
      points={[
        "Triggers are business logic you define, not a generic drip",
        "Re-entry uses the original context, so nothing starts from zero",
        "Suppression rules and contact frequency limits are respected",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Reactivation queue" meta="trigger-based · 3 eligible">
        <ul>
          {dormant.map((d) => (
            <li key={d.name} className="border-b border-hairline px-5 py-4 last:border-b-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-data text-[0.8125rem]">{d.name}</p>
                <span className="text-data text-[0.7rem] text-muted-foreground">idle {d.idle}</span>
              </div>
              <p className="mt-1.5 text-[0.9375rem] font-medium">{d.trigger}</p>
              <p className="mt-1 text-[0.8125rem] text-muted-foreground">{d.reason}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-hairline bg-paper px-5 py-4">
          <IllustrativeNote>
            Illustrative queue. Recovery depends on your data, offer and contact policy.
          </IllustrativeNote>
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 11 — Executive view
 * ---------------------------------------------------------------------- */

const headlineMetrics = [
  { label: "Median first response", value: "12s", caption: "Across every inbound channel" },
  { label: "Lead to sale", value: "18.4%", caption: "Qualified leads that closed" },
  { label: "Attributable revenue", value: "$1.24M", caption: "Joined to a source chain" },
];

const secondaryMetrics = [
  { label: "Qualified leads", value: "1,842" },
  { label: "Appointments kept", value: "76%" },
  { label: "Blended CAC", value: "$318" },
  { label: "Recovered revenue", value: "$212K" },
];

export function ExecutiveViewSection() {
  return (
    <Section id="executive" className="scroll-mt-24">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Executive view</p>
          <h2 className="text-display mt-5 text-[clamp(1.9rem,3.4vw,2.9rem)]">
            Six numbers a revenue leader can act on.
          </h2>
          <p className="text-lede mt-6 max-w-[36rem]">
            Not a wall of charts. The state of the loop, in the terms a board asks about.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {headlineMetrics.map((m) => (
                <div key={m.label} className="p-7 lg:p-9">
                  <StatCell size="lg" {...m} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-hairline bg-hairline sm:grid-cols-4">
              {secondaryMetrics.map((m) => (
                <div key={m.label} className="bg-card p-6">
                  <StatCell {...m} />
                </div>
              ))}
            </div>
            <div className="border-t border-hairline px-6 py-4">
              <IllustrativeNote>
                Illustrative demo figures for a single simulated account. Not benchmarks, averages
                or a projection of your results.
              </IllustrativeNote>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------
 * 12 — Governance
 * ---------------------------------------------------------------------- */

const controls = [
  { label: "Escalation policy", detail: "Conditions that must reach a named human, immediately." },
  { label: "Budget ceilings", detail: "Hard spend limits per channel, campaign and day." },
  { label: "Approval steps", detail: "Changes that require sign-off before they take effect." },
  { label: "Working hours", detail: "When QWA may contact, per channel and time zone." },
  { label: "Channel permissions", detail: "Which channels QWA may initiate on, and which are read-only." },
  { label: "Audit trail", detail: "Every automated action, input and override, retained and exportable." },
  { label: "Human takeover", detail: "One click to take the conversation, mid-thread, without losing state." },
  { label: "Data boundaries", detail: "What is stored, what is redacted and what never leaves your systems." },
];

export function GovernanceSection() {
  return (
    <Section id="governance" tone="paper" className="scroll-mt-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-eyebrow">Governance and control</p>
            <h2 className="text-display mt-5 text-[clamp(1.9rem,3.4vw,2.9rem)]">
              Autonomy is only useful with a brake.
            </h2>
            <p className="text-lede mt-6">
              QWA acts continuously, inside limits your team sets and can change at any time. Every
              action is attributable.
            </p>
          </MotionReveal>

          <MotionStagger stagger={0.04} className="min-w-0 border-t border-hairline">
            {controls.map((c) => (
              <MotionItem key={c.label}>
                <div className="border-b border-hairline py-6">
                  <h3 className="text-[1.0625rem] font-medium tracking-tight">{c.label}</h3>
                  <p className="mt-2 max-w-[40rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {c.detail}
                  </p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------
 * 13 — Integrations / system of record
 * ---------------------------------------------------------------------- */

const adapterGroups = [
  { heading: "CRM and records", items: ["CRM objects", "Custom fields", "Lead and deal sync", "Webhooks"] },
  { heading: "Calendars and scheduling", items: ["Rep calendars", "Territory rules", "Dispatch windows"] },
  { heading: "Communications", items: ["Voice", "SMS", "Email", "Social DM", "Web chat"] },
  { heading: "Advertising and analytics", items: ["Ad platforms", "Conversion APIs", "Warehouse export"] },
  { heading: "Payments and contracts", items: ["Invoices", "Deposits", "Closed–won events"] },
  { heading: "Models", items: ["Model-agnostic routing", "Bring your own provider", "On-prem inference"] },
];

export function IntegrationsSection() {
  return (
    <Section id="integrations" className="scroll-mt-24">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">System of record</p>
          <h2 className="text-display mt-5 text-[clamp(1.9rem,3.4vw,2.9rem)]">
            Model-agnostic, platform-agnostic, adapter-based.
          </h2>
          <p className="text-lede mt-6 max-w-[38rem]">
            QWA is designed to sit alongside the systems you already run rather than replace them.
            Connectivity is built as an adapter layer, and each integration is scoped with you
            during implementation.
          </p>
        </MotionReveal>

        <MotionStagger stagger={0.05} className="mt-14 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {adapterGroups.map((g) => (
            <MotionItem key={g.heading} className="bg-background p-7">
              <h3 className="text-[1rem] font-medium tracking-tight">{g.heading}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((i) => (
                  <li key={i}>
                    <Chip>{i}</Chip>
                  </li>
                ))}
              </ul>
            </MotionItem>
          ))}
        </MotionStagger>

        <p className="mt-8 max-w-[46rem] text-[0.8125rem] leading-relaxed text-muted-foreground/80">
          Categories describe supported adapter architecture, not a claim that any specific vendor
          integration is live in your environment today. Availability is confirmed in scoping.
        </p>
      </Container>
    </Section>
  );
}
