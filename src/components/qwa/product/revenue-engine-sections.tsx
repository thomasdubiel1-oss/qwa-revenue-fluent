import * as React from "react";
import { motion } from "motion/react";
import { Container, Section } from "../primitives";
import { MotionItem, MotionReveal, MotionStagger } from "../motion-primitives";
import {
  DecisionCallout,
  FieldGrid,
  IllustrativeNote,
  PanelBlock,
  PanelStats,
  ProductPanel,
  ProductSection,
  RecordBadge,
  StatCell,
} from "./primitives";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const RECORD_ID = "QWA-84213";
const RECORD_NAME = "Ridgeline HVAC";

/* -------------------------------------------------------------------------
 * Hero visual — the loop itself, not a dashboard card.
 * ---------------------------------------------------------------------- */

/** Ten stages; only the anchors carry a label so the rail stays readable. */
const railNodes = [
  { name: "Signal", label: true },
  { name: "Response", label: false },
  { name: "Qualify", label: true },
  { name: "Follow-up", label: false },
  { name: "Appointment", label: true },
  { name: "Assist", label: false },
  { name: "Sale", label: true },
  { name: "Attribute", label: false },
  { name: "Learn", label: false },
  { name: "Reactivate", label: true },
];


export function RevenueLoopVisual() {
  return (
    <ProductPanel
      title={`Record · ${RECORD_ID} · ${RECORD_NAME}`}
      meta="live simulation"
      footer={<IllustrativeNote />}
    >
      <PanelBlock className="pb-6">
        <LoopRail />
      </PanelBlock>
      <PanelBlock muted>
        <FieldGrid
          fields={[
            { label: "Source", value: "Paid social · q3-retarget-04" },
            { label: "First response", value: "9.2s", accent: true },
            { label: "Qualification", value: "Fit 87 · budget confirmed" },
            { label: "Appointment", value: "Tue 10:20am · J. Ruiz" },
          ]}
        />
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Stages", value: "10 / 10" },
          { label: "Touches joined", value: "9" },
          { label: "Attributed", value: "$14,200", accent: true },
        ]}
      />
    </ProductPanel>
  );
}

/**
 * One continuous path: ten stages left to right, and the revenue returning
 * underneath to the source that produced it.
 */
function LoopRail() {
  const left = 14;
  const right = 386;
  const y = 30;
  const span = (right - left) / (railNodes.length - 1);

  return (
    <div className="min-w-0">
      <svg
        viewBox="0 0 400 104"
        className="h-auto w-full text-signal"
        fill="none"
        aria-hidden="true"
      >
        <line x1={left} y1={y} x2={right} y2={y} stroke="var(--hairline-strong)" strokeWidth="1" />
        <motion.line
          x1={left}
          y1={y}
          x2={right}
          y2={y}
          stroke="currentColor"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: ease.out }}
        />
        {railNodes.map((n, i) => {
          const cx = left + i * span;
          return (
            <g key={n.name}>
              <motion.circle
                cx={cx}
                cy={y}
                r={n.label ? 3.2 : 1.9}
                fill="currentColor"
                opacity={n.label ? 1 : 0.5}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: n.label ? 1 : 0.5, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: duration.fast, ease: ease.out, delay: 0.25 + i * 0.08 }}
              />
              {n.label ? (
                <text
                  x={cx}
                  y={y - 12}
                  fontSize="7.5"
                  textAnchor={i === 0 ? "start" : i === railNodes.length - 1 ? "end" : "middle"}
                  className="fill-muted-foreground"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {n.name}
                </text>
              ) : null}
            </g>
          );
        })}


        {/* Revenue returns to the source that produced it. */}
        <motion.path
          d={`M${right} ${y + 6} C ${right} 82, ${left} 82, ${left} ${y + 6}`}
          stroke="var(--positive)"
          strokeWidth="1.25"
          strokeDasharray="3 5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.3, ease: ease.out, delay: 1.1 }}
        />
        <motion.text
          x="200"
          y="96"
          fontSize="7"
          textAnchor="middle"
          className="fill-[var(--positive)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: duration.base, delay: 2.1 }}
          style={{ letterSpacing: "0.06em" }}
        >
          $14,200 attributed back to source
        </motion.text>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 3 — Immediate response
 * ---------------------------------------------------------------------- */

const stream = [
  {
    t: "T+0s",
    kind: "in" as const,
    actor: "Customer · Instagram DM",
    body: "Do you handle mini-split installs in Pasadena? Ours died last night.",
  },
  {
    t: "T+2s",
    kind: "system" as const,
    actor: "QWA",
    body: "Identity resolved · record created · territory matched",
  },
  {
    t: "T+9s",
    kind: "out" as const,
    actor: "QWA · Instagram DM",
    body: "We do — same-week installs in Pasadena. Is this for a single room or the whole house?",
  },
  {
    t: "T+41s",
    kind: "in" as const,
    actor: "Customer · Instagram DM",
    body: "Two bedrooms. Ideally this week.",
  },
  {
    t: "T+43s",
    kind: "system" as const,
    actor: "QWA",
    body: "Four fields written to record · qualification opened",
  },
];

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
      <ProductPanel
        title="Event stream · conversation 4482"
        meta="Instagram DM"
        footer={
          <IllustrativeNote>
            Simulated conversation. Response timing depends on your channels and configuration.
          </IllustrativeNote>
        }
      >
        <PanelBlock className="py-0">
          <ol className="divide-y divide-hairline">
            {stream.map((e, i) => (
              <li
                key={e.t}
                className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 py-3.5 first:pt-5 last:pb-5"
              >
                <span
                  className={cn(
                    "text-data pt-0.5 text-[0.7rem] tabular-nums",
                    i === 2 ? "text-signal" : "text-muted-foreground/70",
                  )}
                >
                  {e.t}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-data text-[0.65rem] uppercase tracking-[0.12em]",
                      e.kind === "system" ? "text-muted-foreground/60" : "text-muted-foreground",
                    )}
                  >
                    {e.actor}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-pretty leading-relaxed",
                      e.kind === "system"
                        ? "text-[0.8125rem] text-muted-foreground"
                        : "text-[0.9375rem] text-foreground",
                      e.kind === "out" && "font-medium",
                    )}
                  >
                    {e.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </PanelBlock>

        <PanelBlock label="Written to record" muted>
          <FieldGrid
            fields={[
              { label: "Intent", value: "Replacement install", accent: true },
              { label: "Scope", value: "2 zones · mini-split" },
              { label: "Urgency", value: "This week" },
              { label: "Service area", value: "Pasadena · in territory" },
            ]}
          />
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "First response", value: "9.2s" },
            { label: "Entry points watched", value: "6" },
            { label: "Human touches", value: "0" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 4 — Qualification and routing
 * ---------------------------------------------------------------------- */

const scoreLedger = [
  { label: "Timing", observed: "Within 7 days", points: 24 },
  { label: "Location", observed: "In territory", points: 20 },
  { label: "Budget signal", observed: "Confirmed range", points: 18 },
  { label: "Service fit", observed: "Standard install", points: 15 },
  { label: "Decision authority", observed: "Homeowner", points: 10 },
];

const alternateRoutes = [
  "Nurture — qualified, timing beyond horizon",
  "Escalate — high value or complex scope",
  "Human — policy, complaint or out-of-policy request",
];

export function QualificationSection() {
  const total = scoreLedger.reduce((s, r) => s + r.points, 0);

  return (
    <ProductSection
      id="qualification"
      eyebrow="Qualification and routing"
      title="A score your revenue team can argue with."
      lede="Fit is resolved in conversation, not behind a gated form. Every input is itemized, and the routing rule that fired is written on the record."
      points={[
        "Budget, timing, location, scope and authority captured conversationally",
        "Deterministic routing rules you author: book, nurture, escalate or hand to a human",
        "Every decision is inspectable and reversible",
      ]}
      media="left"
    >
      <ProductPanel
        title={`Qualification · ${RECORD_ID}`}
        meta="rule set: hvac-residential-v4"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-5">
          <DecisionCallout
            label="Routing decision"
            value="Book — offer next available"
            rule="Rule 3 fired: fit ≥ 70 and timing inside 14 days"
          />
          <ul className="mt-5 grid gap-1.5 border-t border-hairline pt-4">
            {alternateRoutes.map((r) => (
              <li key={r} className="text-[0.8125rem] leading-relaxed text-muted-foreground/70">
                Not taken · {r}
              </li>
            ))}
          </ul>
        </PanelBlock>

        <PanelBlock label="Score inputs" muted className="py-0 pt-5">
          <table className="w-full border-collapse text-left">
            <tbody>
              {scoreLedger.map((r, i) => (
                <tr key={r.label} className="border-b border-hairline last:border-b-0">
                  <th
                    scope="row"
                    className="py-2.5 pr-4 text-[0.875rem] font-medium text-foreground"
                  >
                    {r.label}
                  </th>
                  <td className="py-2.5 pr-4 text-[0.8125rem] text-muted-foreground">
                    {r.observed}
                  </td>
                  <td className="w-[5.5rem] py-2.5 text-right">
                    <motion.span
                      className="text-data text-[0.8125rem] tabular-nums text-signal"
                      initial={{ opacity: 0, y: 4 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: duration.fast, ease: ease.out, delay: i * 0.06 }}
                    >
                      +{r.points}
                    </motion.span>
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row" className="py-3 pr-4 text-[0.875rem] font-medium">
                  Fit score
                </th>
                <td className="py-3 pr-4 text-[0.8125rem] text-muted-foreground">
                  threshold 70
                </td>
                <td className="text-data w-[5.5rem] py-3 text-right text-[1.0625rem] font-medium tabular-nums">
                  {total}
                </td>
              </tr>
            </tbody>
          </table>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 5 — Cross-channel continuity
 * ---------------------------------------------------------------------- */

const thread = [
  { channel: "Web form", time: "Mon 8:42pm", body: "Submitted: mini-split replacement, Pasadena." },
  { channel: "SMS", time: "Mon 8:44pm", body: "QWA confirmed scope and offered three windows." },
  {
    channel: "Voice",
    time: "Tue 9:04am",
    body: "Inbound call. Number recognized, thread continued mid-sentence.",
  },
  {
    channel: "Appointment",
    time: "Tue 9:07am",
    body: "Booked Wed 10:20am with J. Ruiz. Confirmation sent by SMS.",
  },
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
      <ProductPanel
        title="Channel transitions"
        meta="4 channels · 0 restarts"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-0">
          <ol className="relative">
            <span
              className="absolute bottom-10 left-[4.6rem] top-10 w-px bg-hairline"
              aria-hidden="true"
            />
            {thread.map((t, i) => (
              <li
                key={t.channel}
                className="grid grid-cols-[4.1rem_1rem_minmax(0,1fr)] items-start gap-x-4 border-b border-hairline py-4 last:border-b-0 first:pt-5 last:pb-5"
              >
                <span className="text-data pt-1 text-[0.7rem] text-muted-foreground/70">
                  {t.time.split(" ")[0]}
                  <span className="block text-muted-foreground/50">{t.time.split(" ")[1]}</span>
                </span>
                <span className="relative grid place-items-center pt-1.5">
                  <motion.span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full ring-4 ring-paper",
                      i === thread.length - 1 ? "bg-positive" : "bg-signal",
                    )}
                    initial={{ scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: i * 0.1 }}
                  />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <p className="text-[0.9375rem] font-medium">{t.channel}</p>
                    {/* The identity that never changes, restated at every hop. */}
                    <RecordBadge id={RECORD_ID} />
                  </div>
                  <p className="mt-1.5 text-pretty text-[0.875rem] leading-relaxed text-muted-foreground">
                    {t.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "Records created", value: "1" },
            { label: "Questions repeated", value: "0" },
            { label: "Context carried", value: "Full" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 6 — Appointment engine
 * ---------------------------------------------------------------------- */

const routing = [
  { label: "Territory", value: "Pasadena · zone 3" },
  { label: "Skill match", value: "Ductless certified" },
  { label: "Rep assigned", value: "J. Ruiz" },
  { label: "Drive time", value: "14m from prior job" },
];

const slots = [
  { day: "Tue", time: "8:00", state: "booked" },
  { day: "Tue", time: "10:20", state: "held" },
  { day: "Tue", time: "1:40", state: "open" },
  { day: "Wed", time: "9:00", state: "open" },
  { day: "Wed", time: "11:30", state: "booked" },
  { day: "Wed", time: "3:00", state: "open" },
] as const;

const lifecycle = [
  { label: "Confirmed", value: "SMS delivered · Tue 9:07am", state: "done" },
  { label: "Reminder", value: "T-24h and T-2h scheduled", state: "queued" },
  { label: "Reschedule", value: "Self-serve link active", state: "open" },
  { label: "No-show risk", value: "Low · replied in 4m", state: "done" },
] as const;

export function AppointmentSection() {
  return (
    <ProductSection
      id="appointments"
      eyebrow="Appointment engine"
      title="Booked against real calendars, protected until it happens."
      lede="Availability comes from the rep's actual calendar, territory and skill set. After booking, QWA runs the confirmation, reminder and reschedule path so fewer appointments quietly evaporate."
      points={[
        "Territory and skill routing decide who is offered, not round-robin",
        "Confirmations, reminders and self-serve reschedule in the customer's channel",
        "No-show risk triggers an earlier touch instead of a post-mortem",
      ]}
      media="left"
    >
      <ProductPanel
        title="Scheduling · Pasadena territory"
        meta="dispatch: live"
        footer={<IllustrativeNote />}
      >
        <PanelBlock label="Routing" className="py-5">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {routing.map((r) => (
              <div key={r.label} className="flex min-w-0 items-baseline justify-between gap-4">
                <dt className="text-[0.8125rem] text-muted-foreground">{r.label}</dt>
                <dd className="text-data truncate text-[0.8125rem] font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        </PanelBlock>

        <PanelBlock label="Availability" muted>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-hairline bg-hairline">
            {slots.map((s) => (
              <div
                key={`${s.day}-${s.time}`}
                className={cn(
                  "px-3 py-3",
                  s.state === "held" && "bg-signal-soft",
                  s.state === "open" && "bg-card",
                  s.state === "booked" && "bg-muted",
                )}
              >
                <p className="text-data text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {s.day}
                </p>
                <p
                  className={cn(
                    "text-data mt-1 text-[0.9375rem] font-medium tabular-nums",
                    s.state === "booked" && "text-muted-foreground",
                  )}
                >
                  {s.time}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[0.7rem]",
                    s.state === "held" ? "text-signal" : "text-muted-foreground",
                  )}
                >
                  {s.state === "held" ? "held for QWA-84213" : s.state}
                </p>
              </div>
            ))}
          </div>
        </PanelBlock>

        <PanelBlock label="Appointment lifecycle" className="py-0 pt-5">
          <ul>
            {lifecycle.map((l) => (
              <li
                key={l.label}
                className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-b-0 last:pb-5"
              >
                <span className="flex min-w-0 items-baseline gap-2.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full",
                      l.state === "done" ? "bg-positive" : "bg-signal",
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-[0.9375rem] font-medium">{l.label}</span>
                </span>
                <span className="text-data shrink-0 text-[0.75rem] text-muted-foreground">
                  {l.value}
                </span>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 7 — Salesperson assistance
 * ---------------------------------------------------------------------- */

const brief = [
  {
    n: "01",
    label: "Customer state",
    head: "Replacement buyer. Urgent. Price-aware, not price-led.",
    body: "Two-zone mini-split, unit failed Monday night. Asked twice about install timing, once about financing. No competing quote mentioned.",
  },
  {
    n: "02",
    label: "Likely objection",
    head: "Total cost versus repairing the existing unit.",
    body: "Suggested framing: five-year cost of ownership, not sticker price.",
  },
  {
    n: "03",
    label: "Recommended next action",
    head: "Open with the 72-hour install window.",
    body: "Timing is the strongest stated signal on this record. Lead with it before price.",
  },
  {
    n: "04",
    label: "Offer",
    head: "Bundle B · install within 72 hours",
    body: "Financing pre-qualified. Rep can override before or during the visit.",
  },
];

export function SalesAssistSection() {
  return (
    <ProductSection
      id="sales-assist"
      eyebrow="Salesperson assistance"
      title="Your rep walks in already briefed."
      lede="QWA does not replace the person who closes. It gives them the history, the likely objection and a recommended offer on one screen, two minutes before the conversation starts."
      points={[
        "Everything the customer already said, reduced to what changes the outcome",
        "The objection this segment usually raises, with the response that works",
        "A recommended offer the rep can accept, adjust or ignore",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel
        title="Pre-appointment brief · J. Ruiz"
        meta="delivered T-2h"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-0">
          <ol>
            {brief.map((b) => (
              <li
                key={b.n}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <span className="text-data pt-1 text-[0.7rem] text-muted-foreground/60">{b.n}</span>
                <div className="min-w-0">
                  <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                    {b.label}
                  </p>
                  <p className="mt-1.5 text-pretty text-[1rem] font-medium leading-snug">
                    {b.head}
                  </p>
                  <p className="mt-1.5 text-pretty text-[0.875rem] leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "Interactions", value: "1 form · 6 SMS · 1 call" },
            { label: "Reschedules", value: "1" },
            { label: "Read time", value: "~40s" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 8 — Sale and attribution (the centerpiece)
 * ---------------------------------------------------------------------- */

const attributionChain = [
  { label: "Paid social", detail: "q3-retarget-04", share: 0.28, amount: "$3,976" },
  { label: "Creative 12", detail: "15s vertical · variant B", share: 0.22, amount: "$3,124" },
  { label: "Instagram DM", detail: "conversation 4482", share: 0.18, amount: "$2,556" },
  { label: "Qualification", detail: "fit 87 · rule hvac-v4", share: 0.12, amount: "$1,704" },
  { label: "Appointment", detail: "Wed 10:20am", share: 0.1, amount: "$1,420" },
  { label: "J. Ruiz", detail: "closed–won", share: 0.1, amount: "$1,420" },
];

export function AttributionSection() {
  return (
    <Section id="attribution" tone="ink" className="scroll-mt-24 overflow-hidden py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-20">
          <MotionReveal>
            <p className="text-eyebrow">Sale and attribution</p>
            <h2 className="text-display mt-5 max-w-[17ch] text-balance text-[clamp(1.95rem,3.6vw,3rem)]">
              The revenue goes back to everything that produced it.
            </h2>
            <p className="mt-6 max-w-[33rem] text-pretty text-[1.0625rem] leading-relaxed text-ink-foreground/70">
              Last click credits the final touch and hides the work. QWA holds the whole chain on
              one record, so closed revenue is divided across the campaign, the creative, the
              conversation, the appointment and the person who closed it.
            </p>
            <ul className="mt-8 grid max-w-[33rem] gap-3 border-t border-ink-foreground/15 pt-6">
              {[
                "Contribution across the chain, not a single winning touch",
                "Conversations and appointments are first-class attribution objects",
                "Offline and voice outcomes join the same model as digital ones",
              ].map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <span
                    className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-positive"
                    aria-hidden="true"
                  />
                  <span className="text-ink-foreground/75">{p}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal delay={0.08} className="min-w-0">
            <ProductPanel
              tone="ink"
              title={`Closed–won · ${RECORD_ID}`}
              meta="model: chain contribution"
              footer={<IllustrativeNote tone="ink" />}
            >
              <PanelBlock className="flex flex-wrap items-end justify-between gap-4 py-5">
                <div className="min-w-0">
                  <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-ink-foreground/45">
                    Contract value
                  </p>
                  <p className="text-data mt-1.5 text-[clamp(1.75rem,3vw,2.4rem)] font-medium tracking-tight text-positive">
                    $14,200
                  </p>
                </div>
                <p className="text-data pb-1 text-[0.7rem] text-ink-foreground/45">
                  distributed across 6 contributors
                </p>
              </PanelBlock>

              <PanelBlock className="py-2">
                <ol>
                  {attributionChain.map((n, i) => (
                    <li key={n.label} className="relative py-2.5">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-[0.9375rem] font-medium">{n.label}</p>
                          <p className="text-data truncate text-[0.7rem] text-ink-foreground/50">
                            {n.detail}
                          </p>
                        </div>
                        <motion.span
                          className="text-data shrink-0 text-[0.875rem] tabular-nums text-positive"
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{
                            duration: duration.base,
                            ease: ease.out,
                            // Credit lands last-touch first, then travels back
                            // up the chain to the source.
                            delay: 0.35 + (attributionChain.length - 1 - i) * 0.13,
                          }}
                        >
                          {n.amount}
                        </motion.span>
                      </div>
                      <div className="mt-2 h-px w-full bg-ink-foreground/12">
                        <motion.div
                          className="h-px bg-positive"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: n.share }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{
                            duration: duration.slow,
                            ease: ease.out,
                            delay: 0.35 + (attributionChain.length - 1 - i) * 0.13,
                          }}
                          style={{ transformOrigin: "left" }}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              </PanelBlock>

              <PanelStats
                cells={[
                  { label: "Touches", value: "9" },

                  { label: "Time to close", value: "2d 14h" },
                  { label: "Unattributed", value: "$0" },
                ]}
              />
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

const consequence = [
  { step: "Outcome", value: "Closed–won · creative 12" },
  { step: "Change", value: "Weight 0.8 → 1.0" },
  { step: "Boundary", value: "Spend needs approval" },
  { step: "Next action", value: "Faster DM follow-up" },
];

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
      title="The outcome rewrites the rule — inside your limits."
      lede="Closed–won and closed–lost both travel back into the model. Scoring, timing, channel weighting and routing shift with observed results, and anything that spends money or changes policy waits for a named human."
      points={[
        "Feedback from real outcomes, not engagement proxies",
        "Changes are versioned, attributable and reversible",
        "Budget and policy changes require named approval",
      ]}
      media="left"
    >
      <ProductPanel
        title="Model adjustments · last 7 days"
        meta="governance: on"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-5">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {consequence.map((c, i) => (
              <li key={c.step} className="min-w-0">
                <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {i + 1} · {c.step}
                </p>
                <p className="mt-1.5 text-pretty text-[0.875rem] font-medium leading-snug">
                  {c.value}
                </p>
              </li>
            ))}
          </ol>
        </PanelBlock>

        <PanelBlock className="py-0" muted>
          <ul>
            {adjustments.map((a) => (
              <li
                key={a.label}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3.5 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{a.label}</p>
                  <p className="text-data mt-1 text-[0.75rem] text-muted-foreground">
                    {a.from} <span className="text-hairline-strong">→</span>{" "}
                    <span className="text-signal">{a.to}</span>
                  </p>
                </div>
                <span
                  className={cn(
                    "text-data shrink-0 text-[0.7rem]",
                    a.state === "applied" ? "text-muted-foreground" : "text-signal",
                  )}
                >
                  {a.state}
                </span>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * 10 — Reactivation
 * ---------------------------------------------------------------------- */

const dormant = [
  {
    id: "QWA-71104",
    trigger: "Returned to pricing page",
    context: "Quoted $9,400 · never scheduled",
    idle: "214 days",
  },
  {
    id: "QWA-68930",
    trigger: "Maintenance interval reached",
    context: "Past customer · single system installed 2024",
    idle: "11 months",
  },
  {
    id: "QWA-77420",
    trigger: "Stated 'next spring' window opened",
    context: "Lost on timing · full scope on record",
    idle: "163 days",
  },
];

export function ReactivationSection() {
  return (
    <ProductSection
      id="reactivation"
      eyebrow="Reactivation"
      title="Pipeline you already paid for, re-entered on intent."
      lede="What the loop learns is applied to records that already went quiet. Dormant leads and past customers re-enter when something actually changes — and they re-enter carrying everything the last conversation established."
      points={[
        "Triggers are business logic you define, not a generic drip",
        "Re-entry restores the prior record, so nothing starts from zero",
        "Suppression rules and contact frequency limits are respected",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel
        title="Reactivation queue"
        meta="trigger-based · 3 eligible"
        footer={
          <IllustrativeNote>
            Illustrative queue. Recovery depends on your data, offer and contact policy.
          </IllustrativeNote>
        }
      >
        <PanelBlock className="py-0">
          <ul>
            {dormant.map((d) => (
              <li
                key={d.id}
                className="border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <RecordBadge id={d.id} state="re-entering" />
                  <span className="text-data text-[0.7rem] text-muted-foreground/70">
                    idle {d.idle}
                  </span>
                </div>
                <p className="mt-2.5 text-[0.9375rem] font-medium">{d.trigger}</p>
                <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                  Context restored · {d.context}
                </p>
              </li>
            ))}
          </ul>
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "New records created", value: "0" },
            { label: "Prior context reused", value: "100%" },
            { label: "Contact policy", value: "Enforced" },
          ]}
        />
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
  { label: "Attributable revenue", value: "$1.24M", caption: "Joined to a full source chain" },
];

const secondaryMetrics = [
  { label: "Appointments kept", value: "76%" },
  { label: "Blended CAC", value: "$318" },
  { label: "Recovered revenue", value: "$212K" },
];

export function ExecutiveViewSection() {
  return (
    <Section id="executive" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Executive view</p>
          <h2 className="text-display mt-5 max-w-[19ch] text-balance text-[clamp(1.85rem,3.2vw,2.7rem)]">
            Six numbers a revenue leader can act on.
          </h2>
          <p className="text-lede mt-5 max-w-[34rem]">
            Not a wall of charts. The state of the loop, in the terms a board asks about.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {headlineMetrics.map((m) => (
                <div key={m.label} className="p-6 sm:p-7 lg:p-8">
                  <StatCell size="lg" {...m} />
                </div>
              ))}
            </div>
            <div className="grid divide-y divide-hairline border-t border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {secondaryMetrics.map((m) => (
                <div key={m.label} className="px-6 py-5 sm:px-7">
                  <StatCell {...m} />
                </div>
              ))}
            </div>
            <div className="border-t border-hairline px-6 py-3.5">
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
  {
    label: "Escalation policy",
    detail: "Conditions that must reach a named human, immediately.",
    held: "You",
  },
  {
    label: "Budget ceilings",
    detail: "Hard spend limits per channel, campaign and day.",
    held: "You",
  },
  {
    label: "Approval steps",
    detail: "Changes that require sign-off before they take effect.",
    held: "You",
  },
  {
    label: "Working hours",
    detail: "When QWA may contact, per channel and time zone.",
    held: "You",
  },
  {
    label: "Human takeover",
    detail: "One click to take the conversation mid-thread, without losing state.",
    held: "Your rep",
  },
  {
    label: "Audit trail",
    detail: "Every automated action, input and override, retained and exportable.",
    held: "System",
  },
  {
    label: "Data boundaries",
    detail: "What is stored, what is redacted and what never leaves your systems.",
    held: "You",
  },
];

export function GovernanceSection() {
  return (
    <Section id="governance" tone="paper" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-20">
          <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-eyebrow">Governance and control</p>
            <h2 className="text-display mt-5 max-w-[16ch] text-balance text-[clamp(1.85rem,3.2vw,2.7rem)]">
              Autonomy is only useful with a brake.
            </h2>
            <p className="text-lede mt-5 max-w-[30rem]">
              QWA acts continuously, inside limits your team sets and can change at any time. Every
              action is attributable to a rule and a person.
            </p>
          </MotionReveal>

          <MotionStagger stagger={0.04} className="min-w-0 border-t border-hairline">
            {controls.map((c) => (
              <MotionItem key={c.label}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-hairline py-5">
                  <h3 className="text-[1.0625rem] font-medium tracking-tight">{c.label}</h3>
                  <span className="text-data shrink-0 text-[0.7rem] text-muted-foreground/70">
                    control: {c.held}
                  </span>
                  <p className="col-span-2 max-w-[38rem] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
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
  {
    heading: "Records",
    items: ["CRM objects", "Custom fields", "Lead and deal sync", "Webhooks"],
  },
  {
    heading: "Scheduling",
    items: ["Rep calendars", "Territory rules", "Dispatch windows"],
  },
  {
    heading: "Communications",
    items: ["Voice", "SMS", "Email", "Social DM", "Web chat"],
  },
  {
    heading: "Advertising and analytics",
    items: ["Ad platforms", "Conversion APIs", "Warehouse export"],
  },
  {
    heading: "Payments and contracts",
    items: ["Invoices", "Deposits", "Closed–won events"],
  },
  {
    heading: "Models",
    items: ["Model-agnostic routing", "Bring your own provider", "On-prem inference"],
  },
];

export function IntegrationsSection() {
  return (
    <Section id="integrations" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">System of record</p>
          <h2 className="text-display mt-5 max-w-[20ch] text-balance text-[clamp(1.85rem,3.2vw,2.7rem)]">
            Model-agnostic, platform-agnostic, adapter-based.
          </h2>
          <p className="text-lede mt-5 max-w-[36rem]">
            QWA sits alongside the systems you already run rather than replacing them. Connectivity
            is built as an adapter layer, and each integration is scoped with you during
            implementation.
          </p>
        </MotionReveal>

        <MotionStagger
          stagger={0.05}
          className="mt-12 grid gap-x-10 gap-y-8 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {adapterGroups.map((g) => (
            <MotionItem key={g.heading} className="min-w-0">
              <h3 className="text-[0.9375rem] font-medium tracking-tight">{g.heading}</h3>
              <ul className="mt-3 grid gap-1.5 border-t border-hairline pt-3">
                {g.items.map((i) => (
                  <li key={i} className="text-[0.875rem] leading-relaxed text-muted-foreground">
                    {i}
                  </li>
                ))}
              </ul>
            </MotionItem>
          ))}
        </MotionStagger>

        <p className="mt-10 max-w-[44rem] text-pretty text-[0.8125rem] leading-relaxed text-muted-foreground/80">
          Adapter categories describe what QWA is designed to connect to. No integration is active
          on an account until it is configured and authorized by your team.
        </p>
      </Container>
    </Section>
  );
}
