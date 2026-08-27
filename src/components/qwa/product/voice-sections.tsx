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
import { FlagshipMedia } from "@/components/qwa/media/flagship-media";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

const RECORD_ID = "QWA-90417";
const RECORD_NAME = "Marisol Vance";

/* -------------------------------------------------------------------------
 * Signature visual — the continuity rail.
 * Channels are lanes. One thread crosses them without ever restarting.
 * ---------------------------------------------------------------------- */

const lanes = ["Web chat", "SMS", "Voice", "Email"] as const;

type Hop = { lane: number; x: number; label: string; day: string };

const hops: Hop[] = [
  { lane: 0, x: 30, label: "Asked about coverage", day: "Mon" },
  { lane: 1, x: 108, label: "Answered, quote sent", day: "Mon" },
  { lane: 2, x: 190, label: "Called back, recognized", day: "Tue" },
  { lane: 1, x: 268, label: "Reminder confirmed", day: "Wed" },
  { lane: 3, x: 348, label: "Summary and next step", day: "Wed" },
];

export function ContinuityVisual() {
  return (
    <FlagshipMedia id="voice-continuity" unframed>
      <ContinuityVisualPanel />
    </FlagshipMedia>
  );
}

function ContinuityVisualPanel() {
  const reduced = useReducedMotion();
  const laneY = (i: number) => 26 + i * 26;
  const path = hops
    .map((h, i) => {
      const y = laneY(h.lane);
      if (i === 0) return `M${h.x} ${y}`;
      const prev = hops[i - 1]!;
      const py = laneY(prev.lane);
      const mid = (prev.x + h.x) / 2;
      return `C${mid} ${py}, ${mid} ${y}, ${h.x} ${y}`;
    })
    .join(" ");

  return (
    <ProductPanel
      title={`Record · ${RECORD_ID} · ${RECORD_NAME}`}
      meta="one thread · four surfaces"
      footer={<IllustrativeNote />}
    >
      <PanelBlock className="pb-4">
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
          <ul className="grid" aria-hidden="true">
            {lanes.map((l) => (
              <li
                key={l}
                className="text-data flex h-[26px] items-center text-[0.7rem] text-muted-foreground"
              >
                {l}
              </li>
            ))}
          </ul>

          <svg viewBox="0 0 380 120" className="h-auto w-full text-signal" fill="none">
            <title>One conversation thread continuing across web chat, SMS, voice and email</title>
            {lanes.map((l, i) => (
              <line
                key={l}
                x1="8"
                x2="372"
                y1={laneY(i)}
                y2={laneY(i)}
                stroke="var(--hairline-strong)"
                strokeWidth="0.75"
                strokeDasharray="1 4"
              />
            ))}
            <motion.path
              d={path}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.8, ease: ease.out }}
            />
            {/* Context does not restart at a channel boundary: one marker rides
                the whole thread once the path has drawn. */}
            {reduced ? null : (
              <circle r="2.2" fill="var(--positive)" opacity="0.85">
                <animateMotion dur="7s" begin="1.9s" repeatCount="indefinite" path={path} />
              </circle>
            )}
            {hops.map((h, i) => (
              <g key={h.label}>
                <motion.circle
                  cx={h.x}
                  cy={laneY(h.lane)}
                  r="3.2"
                  fill="currentColor"
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: duration.fast, ease: ease.out, delay: 0.3 + i * 0.32 }}
                />
                <motion.text
                  x={h.x}
                  y={laneY(h.lane) - 8}
                  fontSize="6.5"
                  textAnchor={i === hops.length - 1 ? "end" : "middle"}
                  className="fill-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: duration.base, delay: 0.45 + i * 0.32 }}
                >
                  {h.day}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
      </PanelBlock>

      <PanelBlock label="Carried across every hop" muted>
        <FieldGrid
          fields={[
            { label: "Identity", value: "Phone, email and handle resolved" },
            { label: "Stated need", value: "Two-vehicle policy · March renewal" },
            { label: "Last offer", value: "Quote 41-882 · $118/mo", accent: true },
            { label: "Open question", value: "Roadside add-on pricing" },
          ]}
        />
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Records", value: "1" },
          { label: "Channel hops", value: "5" },
          { label: "Restarts", value: "0" },
        ]}
      />
    </ProductPanel>
  );
}

/* -------------------------------------------------------------------------
 * Inbound voice
 * ---------------------------------------------------------------------- */

const callTurns = [
  { t: "00:02", who: "QWA", body: "Thanks for calling — I have your quote from Monday open. Is this about the roadside add-on?" },
  { t: "00:11", who: "Caller", body: "Yes. And can it start before the fifteenth?" },
  { t: "00:16", who: "QWA", body: "It can. Roadside is $9 a month on your quote, and a start date of the twelfth is available." },
  { t: "00:34", who: "Caller", body: "Let's do it. Can someone walk me through the paperwork?" },
];

export function InboundVoiceSection() {
  return (
    <ProductSection
      id="inbound-voice"
      eyebrow="Inbound voice"
      title="The call is answered by something that already knows them."
      lede="QWA picks up on the first ring, recognizes the number against the record and continues the conversation the customer was already having — no menu tree, no repeated intake."
      points={[
        "Number, email and handle resolved to one record before the greeting",
        "Qualification happens in the call, not in a form afterwards",
        "Anything outside policy escalates to a person instead of guessing",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel
        title="Live call · inbound"
        meta="recognized in 0.4s"
        footer={<IllustrativeNote>Simulated call. Not a recording of a real customer.</IllustrativeNote>}
      >
        <PanelBlock className="py-0">
          <ol className="divide-y divide-hairline">
            {callTurns.map((c) => (
              <li key={c.t} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-3.5 first:pt-5 last:pb-5">
                <span className="text-data pt-0.5 text-[0.7rem] tabular-nums text-muted-foreground/70">
                  {c.t}
                </span>
                <div className="min-w-0">
                  <p className="text-data text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {c.who}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-pretty text-[0.9375rem] leading-relaxed",
                      c.who === "QWA" && "font-medium",
                    )}
                  >
                    {c.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "Answer time", value: "1 ring" },
            { label: "Intake repeated", value: "None" },
            { label: "Fields captured", value: "6" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Outbound + consent
 * ---------------------------------------------------------------------- */

const consentRows = [
  { label: "Voice", state: "Consented", detail: "Verbal opt-in captured 12 Mar" },
  { label: "SMS", state: "Consented", detail: "Double opt-in · reply STOP honored" },
  { label: "Email", state: "Consented", detail: "Marketing and transactional separated" },
  { label: "Social DM", state: "Not consented", detail: "Outbound suppressed on this record" },
];

export function OutboundSection() {
  return (
    <ProductSection
      id="outbound"
      eyebrow="Outbound and consent"
      title="Follow-up that respects the rules you set."
      lede="Cadence, channel and hour are policy, not improvisation. QWA reaches out inside working hours, in consented channels only, and stops the moment a customer says stop."
      points={[
        "Per-channel consent state carried on the record",
        "Working-hour and time-zone windows enforced before send",
        "Frequency caps, quiet periods and suppression lists honored",
      ]}
      media="left"
    >
      <ProductPanel title="Contact policy" meta="account default: strict" footer={<IllustrativeNote />}>
        <PanelBlock className="py-5">
          <DecisionCallout
            label="Next outbound"
            value="SMS · Thu 9:05am local"
            rule="Held 11h: outside contact window (8:00–19:00, America/Los_Angeles)"
          />
        </PanelBlock>
        <PanelBlock label="Consent state" muted className="py-0 pt-5">
          <ul>
            {consentRows.map((r) => (
              <li
                key={r.label}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3 last:border-b-0 last:pb-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{r.label}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{r.detail}</p>
                </div>
                <span
                  className={cn(
                    "text-data shrink-0 text-[0.7rem]",
                    r.state === "Consented" ? "text-positive" : "text-muted-foreground",
                  )}
                >
                  {r.state}
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
 * Human takeover / warm transfer
 * ---------------------------------------------------------------------- */

const takeover = [
  { n: "01", label: "Trigger", head: "Rep clicks take over, or a rule fires.", body: "Pricing exceptions, complaints and legal language escalate automatically." },
  { n: "02", label: "State handed", head: "Live transcript, record fields and the pending offer.", body: "The rep sees what was promised before they speak." },
  { n: "03", label: "Warm transfer", head: "Caller stays on the line, context travels ahead.", body: "QWA introduces the rep and steps back mid-call." },
  { n: "04", label: "Return", head: "Rep hands routine follow-up back.", body: "Reminders and confirmations resume automatically, on the same thread." },
];

export function TakeoverSection() {
  return (
    <ProductSection
      id="takeover"
      eyebrow="Human takeover"
      title="A person can step in mid-sentence."
      lede="Autonomy without an exit is a liability. Any conversation can be taken over by a named human in one action, with the full state of the thread already in front of them."
      points={[
        "One-click takeover from any channel, including live voice",
        "Escalation rules you author, evaluated on every turn",
        "Hand-back resumes automation without restarting the customer",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Takeover path" meta="median handoff: 3.1s" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ol>
            {takeover.map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <span className="text-data pt-1 text-[0.7rem] text-muted-foreground/60">{s.n}</span>
                <div className="min-w-0">
                  <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-pretty text-[1rem] font-medium leading-snug">{s.head}</p>
                  <p className="mt-1.5 text-pretty text-[0.875rem] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Booking from voice
 * ---------------------------------------------------------------------- */

export function VoiceBookingSection() {
  return (
    <ProductSection
      id="booking"
      eyebrow="Booking from the conversation"
      title="The appointment is made before the call ends."
      lede="Availability is read from the real calendar during the call. QWA offers windows it can actually honor, books the one the customer picks and sends the confirmation before hanging up."
      points={[
        "Live calendar, territory and skill constraints applied in-call",
        "Confirmation sent in the customer's consented channel",
        "Reminders and self-serve reschedule attached to the same record",
      ]}
      media="left"
    >
      <ProductPanel title="In-call scheduling" meta="held during conversation" footer={<IllustrativeNote />}>
        <PanelBlock className="py-5">
          <DecisionCallout
            label="Booked"
            value="Thu 11:30am · A. Okafor"
            rule="Offered 3 windows · customer selected second · confirmation sent by SMS"
          />
        </PanelBlock>
        <PanelBlock muted>
          <FieldGrid
            columns={2}
            fields={[
              { label: "Duration", value: "45 min · policy review" },
              { label: "Mode", value: "Video call" },
              { label: "Confirmation", value: "Delivered 00:51 into call", accent: true },
              { label: "Reminders", value: "T-24h and T-1h queued" },
            ]}
          />
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "Windows offered", value: "3" },
            { label: "Time to book", value: "38s" },
            { label: "Rep involvement", value: "None" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Summary, disposition, structured fields
 * ---------------------------------------------------------------------- */

export function SummarySection() {
  return (
    <ProductSection
      id="summary"
      eyebrow="Summary and disposition"
      title="Every call ends as structured data, not an audio file."
      lede="A transcript nobody opens is not a record. QWA writes the summary, the disposition and the fields your systems actually query — and the next best action for whoever picks this up."
      points={[
        "Disposition chosen from your taxonomy, not a free-text note",
        "Fields mapped to your CRM objects during implementation",
        "Recording and retention behave exactly as your policy defines",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title={`Call record · ${RECORD_ID}`} meta="duration 4m 12s" footer={<IllustrativeNote />}>
        <PanelBlock label="Summary" className="py-5">
          <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            Returning caller confirmed the two-vehicle quote, added roadside coverage at $9/mo and
            asked for a start date before the fifteenth. Booked a 45-minute policy review with A.
            Okafor for Thursday. No pricing exception required.
          </p>
        </PanelBlock>
        <PanelBlock label="Written to record" muted>
          <FieldGrid
            fields={[
              { label: "Disposition", value: "Qualified · appointment set", accent: true },
              { label: "Sentiment", value: "Positive · no escalation" },
              { label: "Products discussed", value: "Auto · roadside add-on" },
              { label: "Next best action", value: "Send coverage comparison" },
            ]}
          />
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "Fields written", value: "11" },
            { label: "Manual notes", value: "0" },
            { label: "Recording", value: "Per policy" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Pre-call brief
 * ---------------------------------------------------------------------- */

const brief = [
  { label: "Where they are", value: "Confirmed quote, added roadside, wants a start date before the 15th." },
  { label: "What was promised", value: "$118/mo plus $9 roadside. Start date of the 12th is available." },
  { label: "Likely objection", value: "Comparison shopping on deductible, not on monthly price." },
  { label: "Open with", value: "The 12th start date, then the coverage comparison." },
];

export function PreCallBriefSection() {
  return (
    <ProductSection
      id="brief"
      eyebrow="Pre-call brief"
      title="Your rep never asks a question the record already answers."
      lede="Two minutes before the appointment, the person taking it gets the whole conversation reduced to what changes the outcome."
      points={[
        "Every prior channel folded into one page",
        "Commitments already made, stated plainly",
        "A recommended opening the rep can ignore",
      ]}
      media="left"
    >
      <ProductPanel title="Brief · A. Okafor" meta="delivered T-2h" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {brief.map((b) => (
              <li key={b.label} className="border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                    {b.label}
                  </p>
                  <RecordBadge id={RECORD_ID} />
                </div>
                <p className="mt-2 text-pretty text-[0.9375rem] leading-relaxed">{b.value}</p>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Conversation analytics — executive view
 * ---------------------------------------------------------------------- */

const headline = [
  { label: "Answered inbound", value: "99.1%", caption: "Across voice, chat and messaging" },
  { label: "Conversation to appointment", value: "31.7%", caption: "Qualified conversations that booked" },
  { label: "Revenue from conversations", value: "$486K", caption: "Joined to a full source chain" },
];

const secondary = [
  { label: "Median answer", value: "1 ring" },
  { label: "Escalated to human", value: "8.4%" },
  { label: "Consent violations", value: "0" },
];

export function ConversationAnalyticsSection() {
  return (
    <Section id="analytics" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Conversation analytics</p>
          <h2 className="text-display mt-5 max-w-[20ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            Conversations measured in revenue, not minutes.
          </h2>
          <p className="text-lede mt-5 max-w-[34rem]">
            Talk time and call volume describe activity. QWA reports what the conversation layer did
            to pipeline, and every outcome travels back into the attribution chain.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {headline.map((m) => (
                <div key={m.label} className="p-6 sm:p-7 lg:p-8">
                  <StatCell size="lg" {...m} />
                </div>
              ))}
            </div>
            <div className="grid divide-y divide-hairline border-t border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {secondary.map((m) => (
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
 * Governance
 * ---------------------------------------------------------------------- */

const controls = [
  { label: "Escalation policy", detail: "Conditions that must reach a named human, immediately.", held: "You" },
  { label: "Recording and consent", detail: "Per-jurisdiction recording, disclosure and retention configuration.", held: "You" },
  { label: "Contact windows", detail: "Hours, time zones and frequency caps per channel.", held: "You" },
  { label: "Human takeover", detail: "One action to take any live conversation, without losing state.", held: "Your rep" },
  { label: "Voice identity", detail: "Disclosure that the caller is speaking with an AI assistant.", held: "You" },
  { label: "Audit trail", detail: "Every turn, decision and override retained and exportable.", held: "System" },
];

export function VoiceGovernanceSection() {
  return (
    <Section id="governance" tone="paper" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-20">
          <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-eyebrow">Governance and control</p>
            <h2 className="text-display mt-5 max-w-[16ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
              Speaking on your behalf is a permission, not a default.
            </h2>
            <p className="text-lede mt-5 max-w-[30rem]">
              Every conversation runs inside limits your team sets, and every action is attributable
              to a rule and a person.
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
 * Integrations
 * ---------------------------------------------------------------------- */

const adapterGroups = [
  { heading: "Telephony", items: ["SIP trunking", "Number provisioning", "Call recording sinks"] },
  { heading: "Messaging", items: ["SMS and MMS", "Social DM", "Web chat", "Email"] },
  { heading: "Records", items: ["CRM objects", "Custom fields", "Conversation sync"] },
  { heading: "Scheduling", items: ["Rep calendars", "Territory rules", "Dispatch windows"] },
  { heading: "Speech and language", items: ["Model-agnostic routing", "Bring your own provider", "On-prem inference"] },
  { heading: "Compliance", items: ["Consent stores", "Suppression lists", "Retention policy"] },
];

export function VoiceIntegrationsSection() {
  return (
    <Section id="integrations" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">System of record</p>
          <h2 className="text-display mt-5 max-w-[20ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            Adapter-based, model-agnostic, no rip and replace.
          </h2>
          <p className="text-lede mt-5 max-w-[36rem]">
            QWA connects to the telephony, messaging and record systems you already run. Each
            integration is scoped with you during implementation.
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
