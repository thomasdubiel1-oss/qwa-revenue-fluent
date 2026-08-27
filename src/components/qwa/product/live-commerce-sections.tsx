import { motion } from "motion/react";
import { MotionReveal } from "../motion-primitives";
import { Container, Section } from "../primitives";
import {
  Chip,
  DecisionCallout,
  FieldGrid,
  IllustrativeNote,
  PanelBlock,
  PanelProgress,
  PanelStats,
  ProductPanel,
  ProductSection,
  RecordBadge,
  StatCell,
} from "./primitives";
import { duration, ease } from "@/lib/motion";
import { FlagshipMedia } from "@/components/qwa/media/flagship-media";

/* -------------------------------------------------------------------------
 * Signature visual — the live room console.
 * Audience signal on the left, the offer state and the record it writes to.
 * ---------------------------------------------------------------------- */

const stream = [
  { t: "00:14:02", who: "Viewer", body: "does this fit a 3-car garage?", tag: "Question" },
  { t: "00:14:05", who: "QWA", body: "Answered in chat · spec card surfaced", tag: "Response" },
  { t: "00:14:22", who: "Viewer", body: "added bundle to cart", tag: "Intent" },
  { t: "00:14:26", who: "QWA", body: "Offer window opened · 6 min", tag: "Decision" },
  { t: "00:15:40", who: "Viewer", body: "checkout completed · $1,340", tag: "Order" },
  { t: "00:15:41", who: "QWA", body: "Order joined to viewer record", tag: "Record" },
];

export function LiveRoomVisual() {
  return (
    <FlagshipMedia id="live-commerce-room" unframed>
      <LiveRoomVisualPanel />
    </FlagshipMedia>
  );
}

function LiveRoomVisualPanel() {
  return (
    <ProductPanel
      title="Room · LC-2214 · live"
      meta="00:15:41 elapsed"
      footer={
        <IllustrativeNote>
          Illustrative session. Not a customer result or performance guarantee.
        </IllustrativeNote>
      }
    >
      <PanelBlock label="Session stream" className="py-5">
        <ul className="grid gap-3.5">
          {stream.map((s, i) => (
            <motion.li
              key={s.t}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-3"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: duration.base, ease: ease.out, delay: i * 0.09 }}
            >
              <span className="text-data text-[0.7rem] text-muted-foreground/80">{s.t}</span>
              <div className="min-w-0">
                <p className="text-[0.9375rem] leading-snug">
                  <span className="font-medium">{s.who}</span>
                  <span className="text-muted-foreground"> — {s.body}</span>
                </p>
                <p className="text-data mt-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-signal">
                  {s.tag}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* The order does not just happen — it lands on the room that produced
            it, while the room is still running. */}
        <motion.p
          className="mt-4 border-t border-hairline pt-3 text-[0.8125rem] leading-snug"
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: duration.base, ease: ease.out, delay: 0.75 }}
        >
          <span className="text-data text-[var(--positive)]">$1,340 attributed</span>
          <span className="text-muted-foreground"> to room LC-2214 · offer window 2</span>
        </motion.p>
      </PanelBlock>
      <PanelBlock label="Offer window" muted>
        <PanelProgress value={0.62} />
        <p className="text-data mt-3 text-[0.7rem] text-muted-foreground">
          3m 42s remaining · inventory checked against system of record
        </p>
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Viewers", value: "1,208" },
          { label: "Orders", value: "37" },
          { label: "Revenue", value: "$41,900", accent: true },
        ]}
      />
    </ProductPanel>
  );
}

/* ---------------------------------------------------------------------- */

export function AudienceSignalSection() {
  return (
    <ProductSection
      level="sub"
      id="signal"
      eyebrow="Audience signal"
      title="Every reaction resolves to a person."
      lede="Questions, dwell, repeat views, cart adds and drop-offs are classified within the rolling window and joined to a viewer record — so the same person is recognisable in the chat, in the cart and in tomorrow's follow-up."
      points={[
        "Questions and reactions classified in real time, not just counted",
        "Cart, checkout and abandonment events joined to the same viewer",
        "Signal survives the session — it is available after the stream ends",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Signal · LC-2214" meta="rolling 60s" footer={<IllustrativeNote />}>
        <PanelBlock label="Classified signal">
          <FieldGrid
            fields={[
              { label: "Product questions", value: "41" },
              { label: "Sizing / fit", value: "17" },
              { label: "Price objections", value: "9" },
              { label: "Buying intent", value: "63", accent: true },
            ]}
          />
        </PanelBlock>
        <PanelBlock label="Viewer record" muted>
          <div className="flex flex-wrap gap-2">
            <RecordBadge id="VW-88104" state="returning" />
            <RecordBadge id="Cart" state="1 bundle" />
            <RecordBadge id="Channel" state="live + SMS" />
          </div>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function ResponseSection() {
  return (
    <ProductSection
      level="sub"
      id="response"
      eyebrow="Real-time response"
      title="Answers while the moment is still open."
      lede="QWA answers product questions in chat, surfaces the right spec or comparison, and hands anything sensitive to a human host. Speed matters here more than anywhere else in the loop."
      points={[
        "Answers drawn from your product data, not from a general model's guesswork",
        "Escalation to a host the moment a question leaves the approved boundary",
        "Every answer recorded against the viewer and reviewable afterwards",
      ]}
      media="left"
    >
      <ProductPanel title="Response policy" meta="active" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {[
              ["Product spec", "Answered automatically", "From catalogue"],
              ["Availability", "Answered automatically", "From inventory"],
              ["Pricing exceptions", "Escalated to host", "Policy boundary"],
              ["Medical / legal claims", "Blocked", "Never answered"],
            ].map(([topic, action, why]) => (
              <li
                key={topic}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline px-5 py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{topic}</p>
                  <p className="mt-1 text-[0.8125rem] text-muted-foreground">{action}</p>
                </div>
                <span className="text-data shrink-0 text-[0.7rem] text-muted-foreground/70">
                  {why}
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
 * Offer orchestration — ink moment
 * ---------------------------------------------------------------------- */

const offerRules = [
  { label: "Trigger", value: "Buying intent > threshold", body: "Opened when classified intent in the room crosses the configured level." },
  { label: "Inventory", value: "Checked live", body: "Never offered beyond what the system of record can actually fulfil." },
  { label: "Margin floor", value: "Enforced", body: "Discount depth bounded by a floor your finance team sets." },
  { label: "Duration", value: "Bounded", body: "Windows expire on a timer; no indefinite urgency theatre." },
  { label: "Frequency", value: "Capped", body: "A viewer sees a limited number of windows per session." },
  { label: "Override", value: "Host controls", body: "The host can close any window instantly, from the console." },
];

export function OfferSection() {
  return (
    <Section tone="ink" id="offers" className="scroll-mt-24 py-24 lg:py-32">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Offer orchestration</p>
          <h2 className="text-display mt-5 max-w-[20ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            Urgency with a rulebook behind it.
          </h2>
          <p className="mt-5 max-w-[36rem] text-pretty text-[1.0625rem] leading-relaxed text-ink-foreground/70">
            Time-boxed offers are powerful and easy to abuse. In QWA every window is bounded by
            inventory, margin, duration and frequency rules that your team sets before the stream
            starts — and the host can close one at any time.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <ProductPanel
            tone="ink"
            title="Offer engine · rules"
            meta="6 constraints"
            footer={<IllustrativeNote tone="ink" />}
          >
            <PanelBlock className="py-0">
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
                {offerRules.map((r, i) => (
                  <motion.li
                    key={r.label}
                    className="min-w-0 border-b border-ink-foreground/12 px-5 py-5 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: i * 0.06 }}
                  >
                    <p className="text-[0.7rem] uppercase tracking-[0.12em] text-ink-foreground/50">
                      {r.label}
                    </p>
                    <p className="mt-2 text-[1.0625rem] font-medium tracking-tight">{r.value}</p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-foreground/60">
                      {r.body}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </PanelBlock>
          </ProductPanel>
        </MotionReveal>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */

export function CheckoutSection() {
  return (
    <ProductSection
      level="sub"
      id="checkout"
      eyebrow="Checkout continuity"
      title="The purchase does not leave the moment."
      lede="Cart, checkout and confirmation happen against your commerce system while the viewer stays in the room. If they drop, the cart persists on the record and follow-up picks it up on another channel."
      points={[
        "Orders written to your commerce platform, not a parallel ledger",
        "Abandoned carts persist against the viewer record after the stream ends",
        "Follow-up continues on SMS, email or DM with the session context intact",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Order · OR-77219" meta="confirmed" footer={<IllustrativeNote />}>
        <PanelBlock label="Order">
          <FieldGrid
            fields={[
              { label: "Value", value: "$1,340" },
              { label: "Source", value: "Live room LC-2214" },
              { label: "Offer window", value: "Applied" },
              { label: "Fulfilment", value: "Commerce system", accent: true },
            ]}
          />
        </PanelBlock>
        <PanelBlock muted>
          <DecisionCallout
            label="If abandoned"
            value="SMS at +2h"
            rule="Cart, question history and viewed products carry into the follow-up."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function HostConsoleSection() {
  return (
    <ProductSection
      level="sub"
      id="console"
      eyebrow="Host console"
      title="The person on camera stays in charge."
      lede="Hosts see what the room is asking, what the engine is about to do, and what is selling — in one view. Nothing significant happens on stream without a human able to stop it."
      media="below"
    >
      <div className="grid gap-10 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Room pulse", value: "Live", caption: "Classified questions and intent, summarised as they arrive." },
          { label: "Queued action", value: "Visible", caption: "The next engine action is shown before it fires." },
          { label: "Kill switch", value: "One tap", caption: "Close any offer window or pause automation instantly." },
          { label: "Sell-through", value: "Per SKU", caption: "What is moving, against inventory, in the moment." },
        ].map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
      <IllustrativeNote className="mt-8" />
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function PostStreamSection() {
  return (
    <ProductSection
      level="sub"
      id="post-stream"
      eyebrow="After the stream"
      title="A session is an asset, not an event."
      lede="When the room closes, the recording, the questions, the moments that converted and the viewer records remain. Clips feed Creative Studio, questions feed content, and unconverted viewers feed follow-up."
      points={[
        "Converting moments identified and exported as clip candidates",
        "Unanswered and repeated questions routed into content and FAQ work",
        "Unconverted viewers enter follow-up with full session context",
      ]}
      media="left"
      tone="paper"
    >
      <ProductPanel title="Session · LC-2214 · closed" meta="assets" footer={<IllustrativeNote />}>
        <PanelBlock label="Produced">
          <ul className="grid gap-2.5 text-[0.875rem] leading-relaxed text-muted-foreground">
            <li>6 clip candidates from converting moments</li>
            <li>23 distinct questions clustered into 7 content topics</li>
            <li>1,171 viewer records available for follow-up</li>
            <li>Full transcript joined to the session record</li>
          </ul>
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "Conversion", value: "3.1%" },
            { label: "AOV", value: "$1,132" },
            { label: "Attributed", value: "$41,900", accent: true },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const commerceGovernance = [
  { control: "Discount policy", held: "Finance", detail: "Margin floors and maximum depth set before any window can open." },
  { control: "Claim boundaries", held: "Brand / legal", detail: "Topics the engine may never answer are blocked, not merely discouraged." },
  { control: "Inventory truth", held: "Commerce system", detail: "Offers are constrained by the system of record, never by a cached count." },
  { control: "Host override", held: "Host", detail: "Any automated action can be paused or closed live from the console." },
  { control: "Session record", held: "System", detail: "Transcript, offers, orders and decisions retained for review." },
];

export function CommerceGovernanceSection() {
  return (
    <ProductSection
      level="sub"
      id="governance"
      eyebrow="Governance"
      title="Live is the least forgiving surface you have."
      lede="Mistakes on a live stream are public and permanent. QWA constrains what the engine can offer, say and promise, and keeps a record of every decision it made in the room."
      media="below"
    >
      <ProductPanel title="Controls" meta="ownership" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {commerceGovernance.map((g) => (
              <li
                key={g.control}
                className="grid gap-1.5 border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{g.control}</p>
                  <p className="text-data mt-1 text-[0.7rem] text-muted-foreground/70">
                    Held by {g.held}
                  </p>
                </div>
                <p className="text-[0.875rem] leading-relaxed text-muted-foreground">{g.detail}</p>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {["Commerce platform", "Inventory", "Payments", "Streaming", "SMS", "Email"].map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>
      <IllustrativeNote className="mt-6">
        Adapter categories only. Nothing is connected until configured for your deployment.
      </IllustrativeNote>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Host copilot — the assist layer, never the replacement.
 * ---------------------------------------------------------------------- */

const copilotCues = [
  {
    signal: "Repeated sizing question · 6 viewers",
    suggestion: "Surface the fit comparison card",
    why: "Same question cluster in the last 90 seconds",
  },
  {
    signal: "Price hesitation · 3 viewers",
    suggestion: "Bundle framing, no discount",
    why: "Margin floor blocks a deeper offer",
  },
  {
    signal: "Cart adds rising on SKU 44-B",
    suggestion: "Switch to SKU 44-B next",
    why: "Inventory confirmed · 41 units",
  },
  {
    signal: "Warranty claim asked twice",
    suggestion: "Escalate — host answers live",
    why: "Outside the approved answer boundary",
  },
];

export function HostCopilotSection() {
  return (
    <ProductSection
      level="sub"
      id="copilot"
      eyebrow="Host copilot"
      title="One suggestion at a time, with the reason attached."
      lede="The copilot reads the room and offers the next useful move — a spec card, a product switch, an objection frame, an escalation. It never fires on its own, never stacks prompts, and every cue carries the evidence behind it so the host can judge it in a second."
      points={[
        "Cues are ranked and rate-limited — the host sees one, not a feed",
        "Every recommendation shows the signal that produced it",
        "Anything outside the approved boundary is escalated, never answered",
      ]}
      media="right"
    >
      <ProductPanel title="Copilot · LC-2214" meta="assist only" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {copilotCues.map((c, i) => (
              <motion.li
                key={c.signal}
                className="grid gap-1.5 border-b border-hairline px-5 py-4 first:pt-5 last:border-b-0 last:pb-5"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: duration.base, ease: ease.out, delay: i * 0.07 }}
              >
                <p className="text-data text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {c.signal}
                </p>
                <p className="text-[0.9375rem] font-medium leading-snug text-signal">
                  {c.suggestion}
                </p>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{c.why}</p>
              </motion.li>
            ))}
          </ul>
        </PanelBlock>
        <PanelBlock label="Host control" muted>
          <DecisionCallout
            label="Default"
            value="Nothing auto-fires"
            rule="The host accepts, edits or dismisses. Automation runs only where your team has enabled it."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Live session → checkout / DM / appointment handoff.
 * ---------------------------------------------------------------------- */

const handoffPaths = [
  { path: "Buy now", dest: "Checkout in room", carried: "Session, product, offer window" },
  { path: "Needs a size check", dest: "DM follow-up", carried: "Question history, viewed SKUs" },
  { path: "High-consideration item", dest: "Appointment", carried: "Cart, host notes, timezone" },
  { path: "Left the room", dest: "Reactivation queue", carried: "Cart state, last product viewed" },
];

export function LiveHandoffSection() {
  return (
    <ProductSection
      level="sub"
      id="handoff"
      eyebrow="Handoff"
      title="Intent leaves the room with its context intact."
      lede="Not every buyer converts on stream. Each path out of the live session — checkout, DM, appointment or follow-up — carries the same session, product and offer context, so the next conversation starts where the room left off."
      media="below"
    >
      <div className="overflow-hidden rounded-[var(--radius)] border border-hairline">
        <ul>
          {handoffPaths.map((h, i) => (
            <motion.li
              key={h.path}
              className="grid gap-1.5 border-b border-hairline px-5 py-4 last:border-b-0 sm:grid-cols-[minmax(0,16rem)_minmax(0,12rem)_minmax(0,1fr)] sm:items-baseline sm:gap-6"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: duration.base, ease: ease.out, delay: i * 0.06 }}
            >
              <p className="min-w-0 text-[0.9375rem] font-medium">{h.path}</p>
              <p className="text-data min-w-0 text-[0.8125rem] text-signal">{h.dest}</p>
              <p className="min-w-0 text-[0.8125rem] leading-relaxed text-muted-foreground">
                Carries: {h.carried}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
      <IllustrativeNote className="mt-6">
        Routing rules are configured per deployment. Nothing is sent without an enabled channel.
      </IllustrativeNote>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Stream-to-revenue attribution + reactivation.
 * ---------------------------------------------------------------------- */

export function LiveAttributionSection() {
  return (
    <ProductSection
      level="sub"
      id="attribution"
      eyebrow="Attribution"
      title="Revenue traced back to the minute that produced it."
      lede="Orders, later purchases and booked appointments are joined to the segment, host, product and offer window that contributed. The unit of analysis is the moment, not the stream."
      points={[
        "Purchases resolved to segment, host, SKU and offer window",
        "Conversions after the stream credited to the session that started them",
        "Same revenue record the rest of QWA reads — no separate live ledger",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Session revenue · LC-2214" meta="traced" footer={<IllustrativeNote />}>
        <PanelBlock label="By moment">
          <FieldGrid
            fields={[
              { label: "Segment 2 · demo", value: "In room" },
              { label: "Segment 4 · Q&A", value: "In room + DM" },
              { label: "Post-stream follow-up", value: "SMS + email" },
              { label: "Joined to record", value: "All paths", accent: true },
            ]}
          />
        </PanelBlock>
        <PanelBlock label="Reactivation" muted>
          <DecisionCallout
            label="Abandoned cart, no reply"
            value="Follow-up at +2h, then +48h"
            rule="Behaviour decides the path: viewed but no cart gets content, cart gets the cart, buyer gets nothing."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}
