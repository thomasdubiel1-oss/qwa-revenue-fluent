import { motion } from "motion/react";
import { MotionReveal } from "../motion-primitives";
import {
  Chip,
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
import { Container, Section } from "../primitives";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FlagshipMedia } from "@/components/qwa/media/flagship-media";

/* -------------------------------------------------------------------------
 * Signature visual — the revenue return path.
 * A closed-won event sends value backward across the joined journey.
 * ---------------------------------------------------------------------- */

const journey = [
  { stage: "Source", detail: "Paid social · retargeting set", weight: 0.18 },
  { stage: "Creative", detail: "15s comparison cut, variant B", weight: 0.14 },
  { stage: "Conversation", detail: "DM thread, 9 messages", weight: 0.21 },
  { stage: "Voice", detail: "Inbound call, 6m 12s", weight: 0.24 },
  { stage: "Appointment", detail: "Held Tue 10:30, rep Alvarez", weight: 0.15 },
  { stage: "Sale", detail: "Closed won · $14,200", weight: 0.08 },
];

export function ReturnPathVisual() {
  return (
    <FlagshipMedia id="attribution-return-path" unframed>
      <ReturnPathVisualPanel />
    </FlagshipMedia>
  );
}

function ReturnPathVisualPanel() {
  return (
    <ProductPanel
      title="Journey · CU-40118 · closed won"
      meta="6 joined touches"
      footer={
        <IllustrativeNote>
          Illustrative journey and contribution weights. Not a customer result.
        </IllustrativeNote>
      }
    >
      <PanelBlock className="py-6">
        <ol className="grid gap-0">
          {journey.map((j, i) => (
            <li key={j.stage} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4">
              <div className="relative flex flex-col items-center">
                <motion.span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal"
                  initial={{ scale: 0.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: duration.fast, ease: ease.out, delay: i * 0.1 }}
                />
                {i < journey.length - 1 ? (
                  <motion.span
                    className="w-px flex-1 bg-hairline-strong"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: 0.05 + i * 0.1 }}
                    style={{ transformOrigin: "top" }}
                  />
                ) : null}
              </div>
              <div className={cn("min-w-0", i < journey.length - 1 && "pb-5")}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[0.9375rem] font-medium leading-snug">{j.stage}</p>
                  <motion.span
                    className="text-data text-[0.75rem] text-signal"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: duration.base,
                      ease: ease.out,
                      delay: 0.8 - i * 0.1,
                    }}
                  >
                    {Math.round(j.weight * 100)}% credit
                  </motion.span>
                </div>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {j.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* The return: revenue travels back up the same rail and lands on the
            named source. It resolves after every credit weight is settled. */}
        <div className="mt-1 grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4">
          <div className="flex justify-center">
            <motion.span
              className="w-px bg-[var(--positive)]"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: ease.out, delay: 1.05 }}
              style={{ transformOrigin: "bottom" }}
            />
          </div>
          <motion.p
            className="pb-1 text-[0.8125rem] leading-snug"
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: duration.base, ease: ease.out, delay: 1.7 }}
          >
            <span className="text-data text-[var(--positive)]">$14,200 returned</span>
            <span className="text-muted-foreground">
              {" "}
              to Paid social · retargeting set
            </span>
          </motion.p>
        </div>
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Revenue", value: "$14,200", accent: true },
          { label: "Touches", value: "6 of 7" },
          { label: "Model", value: "Contribution" },
        ]}
      />
    </ProductPanel>
  );
}

/* ---------------------------------------------------------------------- */

export function JoinedJourneySection() {
  return (
    <ProductSection
      id="journey"
      eyebrow="One joined journey"
      title="One record, not seven disconnected reports."
      lede="Source, campaign, creative, conversation, appointment, rep and sale are written against the same customer record as they happen. Attribution is a read of that record, not a reconstruction after the fact."
      points={[
        "Identity resolved across ad click, web session, phone number and CRM contact",
        "Offline outcomes — calls, appointments held, signed contracts — join the same chain",
        "Every touch keeps its own timestamp, channel and owning system",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Record · CU-40118" meta="identity resolved" footer={<IllustrativeNote />}>
        <PanelBlock label="Joined identities">
          <div className="flex flex-wrap gap-2">
            <Chip active>Ad click id</Chip>
            <Chip active>Web session</Chip>
            <Chip active>Phone +1 415…</Chip>
            <Chip active>CRM contact</Chip>
            <Chip>Loyalty id</Chip>
          </div>
        </PanelBlock>
        <PanelBlock label="Record fields" muted>
          <FieldGrid
            fields={[
              { label: "First touch", value: "Paid social · 02 Mar" },
              { label: "Last touch", value: "Voice · 19 Mar" },
              { label: "Outcome", value: "Closed won", accent: true },
              { label: "Owning rep", value: "M. Alvarez" },
            ]}
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const models = [
  { name: "Last touch", use: "Fast operational reads", caveat: "Overstates closing channels" },
  { name: "Linear", use: "Even journey coverage", caveat: "Ignores intensity of a touch" },
  { name: "Position based", use: "First and last emphasis", caveat: "Weights set by policy, not proof" },
  { name: "Contribution", use: "Default QWA model", caveat: "An estimate, stated as one" },
];

export function ModelSection() {
  return (
    <ProductSection
      id="model"
      eyebrow="Contribution model"
      title="An honest estimate, labelled as an estimate."
      lede="QWA distributes credit across the touches that preceded a closed-won outcome using a model you choose. It does not claim to know causation. The model, its window and its assumptions travel with every number it produces."
      points={[
        "Model selectable per business unit; the active model is shown on every report",
        "Weights and windows are configuration, visible to anyone reading the number",
        "Any figure can be re-run under a different model without changing the source data",
      ]}
      media="left"
    >
      <ProductPanel title="Attribution models" meta="contribution active" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {models.map((m, i) => (
              <li
                key={m.name}
                className="grid gap-1 border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[0.9375rem] font-medium">{m.name}</p>
                  {i === 3 ? (
                    <span className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-signal">
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{m.use}</p>
                <p className="text-data text-[0.7rem] text-muted-foreground/70">{m.caveat}</p>
              </li>
            ))}
          </ul>
        </PanelBlock>
        <PanelBlock muted>
          <DecisionCallout
            label="Attribution window"
            value="90 days"
            rule="Touches older than the window are retained but excluded from credit."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Return path — full-bleed ink moment
 * ---------------------------------------------------------------------- */

const returnChain = [
  { label: "Closed won", value: "$14,200", sub: "Signed 19 Mar" },
  { label: "Appointment", value: "$2,130", sub: "15% contribution" },
  { label: "Voice call", value: "$3,408", sub: "24% contribution" },
  { label: "DM thread", value: "$2,982", sub: "21% contribution" },
  { label: "Creative B", value: "$1,988", sub: "14% contribution" },
  { label: "Paid social", value: "$2,556", sub: "18% contribution" },
];

export function ReturnPathSection() {
  return (
    <Section tone="ink" id="return" className="scroll-mt-24 py-24 lg:py-32">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Revenue return path</p>
          <h2 className="text-display mt-5 max-w-[20ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            When a deal closes, the money travels back up the journey.
          </h2>
          <p className="mt-5 max-w-[36rem] text-pretty text-[1.0625rem] leading-relaxed text-ink-foreground/70">
            Closed-won value is split across the touches that preceded it and written back onto each
            one. A campaign, a creative variant and a single conversation each carry the revenue they
            contributed to — not an index, a currency figure.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <ProductPanel
            tone="ink"
            title="Return path · CU-40118"
            meta="contribution model · 90d"
            footer={
              <IllustrativeNote tone="ink">
                Illustrative allocation. Contribution is a modelled estimate, not measured causation.
              </IllustrativeNote>
            }
          >
            <PanelBlock className="py-0">
              <ol className="grid sm:grid-cols-2 lg:grid-cols-3">
                {returnChain.map((r, i) => (
                  <motion.li
                    key={r.label}
                    className="min-w-0 border-b border-ink-foreground/12 px-5 py-5 last:border-b-0 sm:[&:nth-last-child(-n+1)]:border-b-0 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: i * 0.07 }}
                  >
                    <p className="text-[0.7rem] uppercase tracking-[0.12em] text-ink-foreground/50">
                      {r.label}
                    </p>
                    <p className="text-data mt-2 text-[1.375rem] font-medium tracking-tight">
                      {r.value}
                    </p>
                    <p className="text-data mt-1.5 text-[0.7rem] text-ink-foreground/45">{r.sub}</p>
                  </motion.li>
                ))}
              </ol>
            </PanelBlock>
          </ProductPanel>
        </MotionReveal>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */

export function AmbiguitySection() {
  return (
    <ProductSection
      id="ambiguity"
      eyebrow="Unattributed and ambiguous"
      title="What we cannot attribute is shown, not hidden."
      lede="Every attribution system has gaps: privacy-restricted sessions, walk-ins, word of mouth, blocked identifiers. QWA reports them as their own line rather than quietly redistributing them into whichever channel looks best."
      points={[
        "Unattributed revenue reported as a first-class figure on every ledger",
        "Ambiguous touches flagged with the reason the join failed",
        "Coverage rate published alongside the model so readers can weigh the number",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Coverage · March" meta="ledger integrity" footer={<IllustrativeNote />}>
        <PanelBlock label="Revenue coverage">
          <FieldGrid
            fields={[
              { label: "Attributed", value: "$412,800" },
              { label: "Partially joined", value: "$38,200" },
              { label: "Unattributed", value: "$61,400" },
              { label: "Coverage rate", value: "80.6%", accent: true },
            ]}
          />
        </PanelBlock>
        <PanelBlock label="Why joins failed" muted>
          <ul className="grid gap-2.5 text-[0.875rem] leading-relaxed text-muted-foreground">
            <li>Consent withheld — no identifier written (41 records)</li>
            <li>Offline walk-in with no prior digital touch (23 records)</li>
            <li>Call from a number not present on any record (17 records)</li>
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const ledger = [
  { name: "Paid social · retargeting", spend: "$18,400", revenue: "$96,300", deals: "17" },
  { name: "Creative · 15s comparison B", spend: "—", revenue: "$74,100", deals: "13" },
  { name: "Organic search · comparison pages", spend: "—", revenue: "$58,900", deals: "11" },
  { name: "Voice · inbound overflow", spend: "$4,100", revenue: "$52,400", deals: "9" },
  { name: "Reactivation · dormant 90d", spend: "$900", revenue: "$31,200", deals: "6" },
];

export function LedgerSection() {
  return (
    <ProductSection
      id="ledgers"
      eyebrow="Contribution ledgers"
      title="Campaign, creative and channel, all in the same currency."
      lede="Because credit is written back to each touch, a creative variant and a phone queue can be compared on the same line. Spend sits next to attributed revenue and the deals behind it."
      media="below"
    >
      <ProductPanel
        title="Contribution ledger · March"
        meta="contribution model · 90d"
        footer={<IllustrativeNote />}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                {["Contributor", "Spend", "Attributed revenue", "Deals"].map((h) => (
                  <th
                    key={h}
                    className="text-data px-5 py-3 text-[0.65rem] font-normal uppercase tracking-[0.14em] text-muted-foreground/80"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.name} className="border-b border-hairline last:border-b-0">
                  <td className="px-5 py-4 text-[0.9375rem]">{row.name}</td>
                  <td className="text-data px-5 py-4 text-[0.875rem] text-muted-foreground">
                    {row.spend}
                  </td>
                  <td className="text-data px-5 py-4 text-[0.875rem] font-medium">{row.revenue}</td>
                  <td className="text-data px-5 py-4 text-[0.875rem] text-muted-foreground">
                    {row.deals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function ReconciliationSection() {
  return (
    <ProductSection
      id="finance"
      eyebrow="Finance reconciliation"
      title="A view finance can sign, not argue with."
      lede="Attributed revenue is reconciled against booked revenue in the system of record. Differences are itemised — timing, refunds, adjustments, unattributed — until the two sides agree."
      points={[
        "Attributed total reconciled line by line against booked revenue",
        "Timing differences and refunds itemised rather than netted away",
        "Reconciled periods can be locked so historic reporting stops moving",
      ]}
      media="left"
      tone="paper"
    >
      <ProductPanel title="Reconciliation · March" meta="period open" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {[
              ["Booked revenue (system of record)", "$512,400"],
              ["Attributed to journeys", "$412,800"],
              ["Unattributed", "$61,400"],
              ["Partially joined", "$38,200"],
              ["Timing difference", "$0"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-baseline justify-between gap-4 border-b border-hairline px-0 py-3.5 first:pt-5 last:border-b-0 last:pb-5"
              >
                <span className="text-[0.875rem] text-muted-foreground">{k}</span>
                <span className="text-data shrink-0 text-[0.875rem] font-medium">{v}</span>
              </li>
            ))}
          </ul>
        </PanelBlock>
        <PanelBlock muted>
          <DecisionCallout
            label="Variance"
            value="$0"
            rule="Reconciles once unattributed and partial lines are included."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function FeedbackSection() {
  return (
    <ProductSection
      id="feedback"
      eyebrow="Back into the engine"
      title="Attribution is only useful if it changes the next decision."
      lede="Contribution figures are written back into the Revenue Engine, where they shape budget, routing, creative selection and reactivation timing. The loop closes without anyone exporting a spreadsheet."
      media="below"
    >
      <div className="grid gap-10 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Budget",
            value: "Reallocated",
            caption: "Spend follows attributed revenue rather than click volume.",
          },
          {
            label: "Creative",
            value: "Ranked",
            caption: "Variants sorted by revenue contributed, not engagement.",
          },
          {
            label: "Routing",
            value: "Tuned",
            caption: "Lead paths that produce closed-won get more inventory.",
          },
          {
            label: "Reactivation",
            value: "Timed",
            caption: "Dormancy windows learned from journeys that reopened.",
          },
        ].map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
      <IllustrativeNote className="mt-8" />
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const governance = [
  { control: "Model selection", held: "Revenue operations", detail: "Active model and weights are configuration, versioned on change." },
  { control: "Attribution windows", held: "Revenue operations", detail: "Window length set per business unit and shown on every report." },
  { control: "Manual overrides", held: "Named approver", detail: "Any override records who made it, when and the stated reason." },
  { control: "Finance approval", held: "Finance", detail: "Periods close only after finance signs the reconciliation." },
  { control: "Audit trail", held: "System", detail: "Every number can be traced to the events and model that produced it." },
];

export function AttributionGovernanceSection() {
  return (
    <ProductSection
      id="governance"
      eyebrow="Governance"
      title="Numbers that survive being questioned."
      lede="Attribution is contested by definition. Every input, weight and override in QWA has an owner and a record, so a disputed figure can be resolved by reading it rather than re-litigating it."
      media="below"
      tone="paper"
    >
      <ProductPanel title="Controls" meta="ownership" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {governance.map((g) => (
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
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function AttributionIntegrationsSection() {
  return (
    <ProductSection
      id="integrations"
      eyebrow="Connections"
      title="Adapter-shaped, so the chain does not break at the edge."
      lede="QWA reads and writes through adapters: ad platforms, web analytics, telephony, CRM, commerce and finance systems. Each adapter is enabled deliberately; nothing is assumed to be connected."
      media="below"
    >
      <div className="flex flex-wrap gap-2.5">
        {[
          "Ad platforms",
          "Web analytics",
          "Telephony",
          "CRM",
          "Commerce",
          "Finance / ERP",
          "Warehouse",
          "Webhooks",
        ].map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <RecordBadge id="Adapter framework" state="configured per deployment" />
      </div>
      <IllustrativeNote className="mt-6">
        Categories describe the adapter surface. No integration is active until it is configured for
        your deployment.
      </IllustrativeNote>
    </ProductSection>
  );
}
