import { motion } from "motion/react";
import { Container, Section } from "../primitives";
import { MotionItem, MotionReveal, MotionStagger } from "../motion-primitives";
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
  StatCell,
} from "./primitives";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
 * Signature visual — the spend-to-revenue ledger.
 * Left column is what was spent. Right column is what came back, joined to
 * the record chain rather than a platform-reported conversion.
 * ---------------------------------------------------------------------- */

type LedgerRow = {
  source: string;
  spend: string;
  leads: string;
  revenue: string;
  index: number;
  best?: boolean;
};

const ledger: LedgerRow[] = [
  { source: "Paid social · retargeting", spend: "$4,180", leads: "212", revenue: "$61,400", index: 0.94, best: true },
  { source: "Search · high intent", spend: "$9,640", leads: "331", revenue: "$88,900", index: 0.71 },
  { source: "Creator partnerships", spend: "$3,200", leads: "148", revenue: "$21,050", index: 0.44 },
  { source: "Paid social · prospecting", spend: "$7,900", leads: "506", revenue: "$28,300", index: 0.29 },
  { source: "Marketplace listings", spend: "$1,450", leads: "64", revenue: "$4,100", index: 0.12 },
];

export function AcquisitionLedgerVisual() {
  return (
    <ProductPanel
      title="Acquisition ledger · last 30 days"
      meta="joined to closed revenue"
      footer={<IllustrativeNote />}
    >
      <PanelBlock className="py-0">
        <div className="hidden grid-cols-[minmax(0,1.5fr)_5rem_4rem_6rem] gap-4 border-b border-hairline py-3 sm:grid">
          {["Source", "Spend", "Leads", "Revenue"].map((h, i) => (
            <span
              key={h}
              className={cn(
                "text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/80",
                i > 0 && "text-right",
              )}
            >
              {h}
            </span>
          ))}
        </div>
        <ul>
          {ledger.map((r, i) => (
            <li key={r.source} className="border-b border-hairline py-4 last:border-b-0 last:pb-5">
              <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1.5fr)_5rem_4rem_6rem] sm:items-baseline">
                <p className="min-w-0 truncate text-[0.9375rem] font-medium">{r.source}</p>
                <p className="text-data text-[0.8125rem] text-muted-foreground sm:text-right">
                  <span className="sm:hidden">Spend </span>
                  {r.spend}
                </p>
                <p className="text-data text-[0.8125rem] text-muted-foreground sm:text-right">
                  <span className="sm:hidden">Leads </span>
                  {r.leads}
                </p>
                <p
                  className={cn(
                    "text-data text-[0.9375rem] font-medium sm:text-right",
                    r.best && "text-positive",
                  )}
                >
                  {r.revenue}
                </p>
              </div>
              <div className="mt-2.5 h-px w-full bg-hairline">
                <motion.div
                  className={cn("h-px", r.best ? "bg-positive" : "bg-signal/60")}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: r.index }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: duration.slow, ease: ease.out, delay: 0.12 * i }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Spend", value: "$26,370" },
          { label: "Revenue", value: "$203,750", accent: true },
          { label: "Blended CAC", value: "$213" },
        ]}
      />
    </ProductPanel>
  );
}

/* -------------------------------------------------------------------------
 * Intake — where demand arrives
 * ---------------------------------------------------------------------- */

const intake = [
  { label: "Paid channels", items: ["Search", "Paid social", "Retargeting", "Marketplace"] },
  { label: "Owned", items: ["Site forms", "Web chat", "Landing pages", "Email"] },
  { label: "Earned and offline", items: ["Creators", "Referrals", "Inbound calls", "Events"] },
];

export function DemandIntakeSection() {
  return (
    <ProductSection
      id="intake"
      eyebrow="Demand intake"
      title="Every source arrives on the same record."
      lede="A lead from paid social, a form fill, a phone call and a DM are the same person to QWA. Identity is resolved on arrival so nothing is counted twice and nothing is orphaned."
      points={[
        "Identity resolution across phone, email, handle and device",
        "Source, campaign, creative and placement captured at intake",
        "Duplicate and bot traffic collapsed before it reaches your team",
      ]}
      media="right"
      level="sub"
      tone="paper"
    >
      <ProductPanel title="Intake adapters" meta="configured per account" footer={<IllustrativeNote />}>
        {intake.map((g) => (
          <PanelBlock key={g.label} label={g.label}>
            <div className="flex flex-wrap gap-2">
              {g.items.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </PanelBlock>
        ))}
        <PanelStats
          cells={[
            { label: "Sources joined", value: "11" },
            { label: "Duplicates merged", value: "184" },
            { label: "Orphaned leads", value: "0" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Lead quality feedback loop
 * ---------------------------------------------------------------------- */

const qualityRows = [
  { label: "Reached", value: 0.92, note: "Contact made within response window" },
  { label: "Qualified", value: 0.58, note: "Met the criteria your team defined" },
  { label: "Booked", value: 0.31, note: "Appointment placed on a real calendar" },
  { label: "Closed", value: 0.11, note: "Revenue recognized against the source" },
];

export function LeadQualitySection() {
  return (
    <ProductSection
      id="quality"
      eyebrow="Lead quality"
      title="Volume is the wrong number to optimize."
      lede="QWA measures each source by what happens after the click. A campaign producing cheap leads that never qualify is a cost, and it is reported as one."
      points={[
        "Quality scored on downstream outcomes, not form completions",
        "Signals fed back to the platforms that can act on them",
        "Sources ranked by contribution to closed revenue",
      ]}
      media="left"
    >
      <ProductPanel
        title="Cohort · paid social prospecting"
        meta="506 leads"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-0">
          <ul>
            {qualityRows.map((q) => (
              <li key={q.label} className="border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[0.9375rem] font-medium">{q.label}</p>
                  <p className="text-data text-[0.875rem] tabular-nums text-muted-foreground">
                    {Math.round(q.value * 100)}%
                  </p>
                </div>
                <div className="mt-3">
                  <PanelProgress value={q.value} />
                </div>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">{q.note}</p>
              </li>
            ))}
          </ul>
        </PanelBlock>
        <PanelBlock label="Signal returned to platform" muted>
          <FieldGrid
            columns={2}
            fields={[
              { label: "Event", value: "Qualified conversation" },
              { label: "Value", value: "Modeled, not form-fill", accent: true },
            ]}
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Budget pacing and guardrails
 * ---------------------------------------------------------------------- */

export function PacingSection() {
  return (
    <ProductSection
      id="pacing"
      eyebrow="Pacing and guardrails"
      title="Recommendations you approve, inside limits you set."
      lede="QWA proposes reallocations from measured contribution. Every proposal names the rule that produced it, the ceiling it respects and the person who has to approve it."
      points={[
        "Per-channel floors, ceilings and daily pacing enforced",
        "Proposals require named approval before anything moves",
        "Every change is reversible and recorded with its rationale",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Pacing proposal · week 14" meta="awaiting approval" footer={<IllustrativeNote />}>
        <PanelBlock className="py-5">
          <DecisionCallout
            label="Proposed"
            value="Shift $2,100 → retargeting"
            rule="Retargeting revenue index 0.94 · prospecting 0.29 · within channel ceiling"
          />
        </PanelBlock>
        <PanelBlock label="Guardrails applied" muted>
          <FieldGrid
            fields={[
              { label: "Channel ceiling", value: "$6,500 / week" },
              { label: "Minimum learning spend", value: "Protected" },
              { label: "Approver", value: "Growth lead", accent: true },
              { label: "Reversible", value: "One action, full history" },
            ]}
          />
        </PanelBlock>
        <PanelStats
          cells={[
            { label: "Proposals", value: "3" },
            { label: "Auto-applied", value: "0" },
            { label: "Rules cited", value: "3" },
          ]}
        />
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Creative and offer performance
 * ---------------------------------------------------------------------- */

const creatives = [
  { name: "Coverage comparison · 15s", role: "First touch", revenue: "$38,900", share: 0.86 },
  { name: "Founder explainer · 30s", role: "Consideration", revenue: "$24,400", share: 0.54 },
  { name: "Renewal reminder · static", role: "Reactivation", revenue: "$12,750", share: 0.28 },
];

export function CreativePerformanceSection() {
  return (
    <ProductSection
      id="creative"
      eyebrow="Creative and offer"
      title="Which creative actually produced revenue."
      lede="Creative is graded on its contribution to closed deals across the whole journey, not on the last click before a form. The result routes straight back into what gets produced next."
      points={[
        "Creative and offer credited across the full contribution chain",
        "Role in the journey separated from raw click performance",
        "Winning patterns handed to Creative Studio as the next brief",
      ]}
      media="left"
    >
      <ProductPanel title="Creative contribution" meta="revenue-weighted" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {creatives.map((c, i) => (
              <li key={c.name} className="border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="min-w-0 text-[0.9375rem] font-medium">{c.name}</p>
                  <p className="text-data text-[0.9375rem] font-medium">{c.revenue}</p>
                </div>
                <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{c.role}</p>
                <div className="mt-3 h-px w-full bg-hairline">
                  <motion.div
                    className="h-px bg-signal"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: c.share }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: duration.slow, ease: ease.out, delay: 0.1 * i }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Attribution back to source
 * ---------------------------------------------------------------------- */

const chain = [
  { label: "Paid social · retargeting", detail: "First touch · 11 Mar" },
  { label: "Coverage comparison · 15s", detail: "Creative that produced the click" },
  { label: "Web chat", detail: "Question answered in 4 seconds" },
  { label: "SMS follow-up", detail: "Quote delivered and confirmed" },
  { label: "Appointment · A. Okafor", detail: "Booked from the conversation" },
];

export function AcquisitionAttributionSection() {
  return (
    <Section id="attribution" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Attribution</p>
          <h2 className="text-display mt-5 max-w-[19ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            Revenue travels back to what produced it.
          </h2>
          <p className="text-lede mt-5 max-w-[35rem]">
            When a deal closes, QWA walks the record backward and credits every touch that
            contributed — the channel, the campaign, the creative and the conversation.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <ProductPanel
            tone="ink"
            title="Closed · $14,200"
            meta="credit path resolved"
            footer={<IllustrativeNote tone="ink" />}
          >
            <PanelBlock className="py-0">
              <ol>
                {chain.map((c, i) => (
                  <li
                    key={c.label}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-4 border-b border-ink-foreground/12 py-4 first:pt-5 last:border-b-0 last:pb-5"
                  >
                    <span className="text-data pt-1 text-[0.7rem] text-ink-foreground/40">
                      {String(chain.length - i).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-pretty text-[1rem] font-medium leading-snug">{c.label}</p>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-foreground/55">
                        {c.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </PanelBlock>
            <PanelStats
              cells={[
                { label: "Touches joined", value: "5" },
                { label: "Days to close", value: "9" },
                { label: "Credited source", value: "Retargeting" },
              ]}
            />
          </ProductPanel>
        </MotionReveal>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------
 * Executive view
 * ---------------------------------------------------------------------- */

const headline = [
  { label: "Revenue per dollar", value: "7.7x", caption: "Closed revenue against measured spend" },
  { label: "Cost per qualified", value: "$88", caption: "Not cost per form completion" },
  { label: "Contribution margin", value: "$147K", caption: "After acquisition cost, by source" },
];

const secondary = [
  { label: "Sources measured", value: "11" },
  { label: "Unattributed revenue", value: "3.1%" },
  { label: "Budget moved without approval", value: "$0" },
];

export function AcquisitionExecutiveSection() {
  return (
    <Section id="executive" tone="paper" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Executive view</p>
          <h2 className="text-display mt-5 max-w-[19ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            One page a CFO can read without a translator.
          </h2>
          <p className="text-lede mt-5 max-w-[34rem]">
            Spend, qualified demand and closed revenue on the same surface, joined by the same
            record — not reconciled between three dashboards that disagree.
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
                Illustrative demo figures for a single simulated account. Not benchmarks or a
                projection of your results.
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
  { label: "Budget authority", detail: "Ceilings, floors and who may approve a reallocation.", held: "You" },
  { label: "Channel policy", detail: "Which platforms QWA may buy on, and which it may only read.", held: "You" },
  { label: "Data sharing", detail: "What is returned to ad platforms, and in what form.", held: "You" },
  { label: "Attribution model", detail: "Credit rules agreed with finance before anything is reported.", held: "You and finance" },
  { label: "Change log", detail: "Every proposal, approval and rollback retained with its rationale.", held: "System" },
];

export function AcquisitionGovernanceSection() {
  return (
    <Section id="governance" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-20">
          <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-eyebrow">Governance and control</p>
            <h2 className="text-display mt-5 max-w-[16ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
              Nothing moves money without a name attached.
            </h2>
            <p className="text-lede mt-5 max-w-[30rem]">
              Autonomy stops where budget begins. QWA recommends; your team decides; the system
              keeps the receipt.
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
