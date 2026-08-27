import { motion } from "motion/react";
import { MotionReveal } from "../motion-primitives";
import { Container, Section } from "../primitives";
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
import { duration, ease } from "@/lib/motion";

/* -------------------------------------------------------------------------
 * Signature visual — the decision record.
 * Every autonomous action is a proposal with inputs, bounds and an owner.
 * ---------------------------------------------------------------------- */

export function DecisionRecordVisual() {
  return (
    <ProductPanel
      title="Decision · DC-9042"
      meta="proposed · awaiting approval"
      footer={
        <IllustrativeNote>
          Illustrative decision record. Not a customer result or performance guarantee.
        </IllustrativeNote>
      }
    >
      <PanelBlock label="Proposed action">
        <p className="text-[1.0625rem] font-medium leading-snug">
          Shift $6,000 of weekly spend from outbound sequences to paid social retargeting.
        </p>
      </PanelBlock>
      <PanelBlock label="Inputs" muted>
        <FieldGrid
          fields={[
            { label: "Attributed CAC", value: "$418 vs $611" },
            { label: "Window", value: "Trailing 28 days" },
            { label: "Sample", value: "214 closed won" },
            { label: "Confidence", value: "Medium", accent: true },
          ]}
        />
      </PanelBlock>
      <PanelBlock label="Bounds">
        <ul className="grid gap-2.5 text-[0.875rem] leading-relaxed text-muted-foreground">
          <li>Maximum weekly shift: $8,000</li>
          <li>Floor on outbound spend: $12,000</li>
          <li>Reversible within one billing cycle</li>
        </ul>
      </PanelBlock>
      <PanelBlock muted>
        <DecisionCallout
          label="Gate"
          value="Human approval"
          rule="Above the autonomy threshold for budget reallocation."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: duration.base, ease: ease.out }}
          >
            <RecordBadge id="Owner" state="VP Revenue" />
          </motion.span>
          <RecordBadge id="Rollback" state="one click" />
        </div>
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Expected effect", value: "+$21k / mo" },
          { label: "Risk", value: "Bounded" },
          { label: "Reversible", value: "Yes", accent: true },
        ]}
      />
    </ProductPanel>
  );
}

/* ---------------------------------------------------------------------- */

export function NextBestActionSection() {
  return (
    <ProductSection
      id="next-best-action"
      eyebrow="Next best action"
      title="A recommendation is only useful if it names the action."
      lede="For every record and every budget line, QWA produces the single action most likely to move revenue — with the reasoning, the expected effect and the alternative it rejected."
      points={[
        "One action per record, not a list of possibilities",
        "The rejected alternative shown, so the choice can be argued with",
        "Expected effect expressed in revenue terms, with its confidence",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Record · CU-40277" meta="next best action" footer={<IllustrativeNote />}>
        <PanelBlock label="Recommended">
          <p className="text-[0.9375rem] font-medium">Call within 30 minutes; do not send SMS first.</p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Two inbound calls in the last hour, no reply to prior SMS, high-value category.
          </p>
        </PanelBlock>
        <PanelBlock label="Rejected alternative" muted>
          <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
            SMS follow-up — historically lower connect rate for this pattern, and duplicates a
            channel the record has already ignored.
          </p>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Autonomy ladder — ink moment
 * ---------------------------------------------------------------------- */

const ladder = [
  { level: "L0", name: "Observe", body: "The system reports. It proposes nothing and changes nothing." },
  { level: "L1", name: "Recommend", body: "Actions are proposed with reasoning; a person executes them." },
  { level: "L2", name: "Approve", body: "The system prepares the change; a named approver releases it." },
  { level: "L3", name: "Act within bounds", body: "The system acts inside explicit limits and logs every change." },
  { level: "L4", name: "Act and report", body: "Reserved for low-risk, fully reversible, well-evidenced actions." },
];

export function AutonomyLadderSection() {
  return (
    <Section tone="ink" id="autonomy" className="scroll-mt-24 py-24 lg:py-32">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Autonomy ladder</p>
          <h2 className="text-display mt-5 max-w-[20ch] text-balance text-[clamp(1.85rem,3.2vw,2.7rem)]">
            You decide how much the system is allowed to decide.
          </h2>
          <p className="mt-5 max-w-[36rem] text-pretty text-[1.0625rem] leading-relaxed text-ink-foreground/70">
            Autonomy is set per decision type, not as a global switch. Most organisations start at
            recommend, move individual decision types to bounded action once the evidence supports
            it, and can drop any of them back in a single change.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <ProductPanel
            tone="ink"
            title="Autonomy · by decision type"
            meta="5 levels"
            footer={
              <IllustrativeNote tone="ink">
                Levels describe the control model. Defaults are conservative and set per deployment.
              </IllustrativeNote>
            }
          >
            <PanelBlock className="py-0">
              <ol>
                {ladder.map((l, i) => (
                  <motion.li
                    key={l.level}
                    className="grid gap-2 border-b border-ink-foreground/12 px-5 py-5 last:border-b-0 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:gap-8"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: i * 0.07 }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-data text-[0.7rem] text-signal">{l.level}</span>
                      <span className="text-[1.0625rem] font-medium">{l.name}</span>
                    </div>
                    <p className="text-[0.875rem] leading-relaxed text-ink-foreground/60">{l.body}</p>
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

export function ExperimentSection() {
  return (
    <ProductSection
      id="experiments"
      eyebrow="Experiments"
      title="Learning that holds up when someone checks it."
      lede="Changes that matter are run as experiments with a holdout, a stated hypothesis and a pre-declared read date. Results are recorded whether or not they support the change."
      points={[
        "Holdout groups preserved so lift can be measured, not asserted",
        "Hypothesis, sample and read date declared before the test starts",
        "Negative results retained and visible in the decision history",
      ]}
      media="left"
    >
      <ProductPanel title="Experiment · EX-118" meta="reading 22 Mar" footer={<IllustrativeNote />}>
        <PanelBlock label="Hypothesis">
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Calling within 30 minutes of a second inbound signal raises appointment rate for
            high-value categories.
          </p>
        </PanelBlock>
        <PanelBlock label="Design" muted>
          <FieldGrid
            fields={[
              { label: "Treatment", value: "1,840 records" },
              { label: "Holdout", value: "460 records" },
              { label: "Read date", value: "22 Mar" },
              { label: "Primary metric", value: "Appointments held", accent: true },
            ]}
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function GuardrailSection() {
  return (
    <ProductSection
      id="guardrails"
      eyebrow="Guardrails"
      title="Bounded, reversible, and observable by default."
      lede="Autonomous action is safe only when its limits are explicit. Every decision type carries spend ceilings, rate limits, blast-radius caps and a rollback path that has been tested."
      media="below"
      tone="paper"
    >
      <div className="grid gap-10 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Spend ceiling", value: "Per decision", caption: "No action can exceed the limit set for its type." },
          { label: "Rate limit", value: "Per window", caption: "Frequency of automated change is capped." },
          { label: "Blast radius", value: "Scoped", caption: "Changes apply to a defined segment, never the whole book." },
          { label: "Rollback", value: "One click", caption: "Every automated change has a tested reverse path." },
        ].map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
      <IllustrativeNote className="mt-8" />
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const history = [
  { id: "DC-9038", action: "Paused creative variant D", by: "System · L3", result: "CAC −4.1%", state: "Kept" },
  { id: "DC-9031", action: "Extended reminder window to 24h", by: "M. Alvarez", result: "No-show −6 pts", state: "Kept" },
  { id: "DC-9024", action: "Raised outbound cadence", by: "System · L3", result: "Opt-out +2.3 pts", state: "Rolled back" },
  { id: "DC-9019", action: "Reallocated $4k to search", by: "VP Revenue", result: "Inconclusive", state: "Kept" },
];

export function DecisionHistorySection() {
  return (
    <ProductSection
      id="history"
      eyebrow="Decision history"
      title="Every change has an author, a reason and an outcome."
      lede="The decision log is the memory of the system. It records what was changed, who or what changed it, what happened next, and whether the change survived."
      media="below"
    >
      <ProductPanel title="Decision log" meta="last 4" footer={<IllustrativeNote />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                {["Id", "Change", "Author", "Observed", "State"].map((h) => (
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
              {history.map((r) => (
                <tr key={r.id} className="border-b border-hairline last:border-b-0">
                  <td className="text-data px-5 py-4 text-[0.8125rem] text-muted-foreground">
                    {r.id}
                  </td>
                  <td className="px-5 py-4 text-[0.9375rem]">{r.action}</td>
                  <td className="text-data px-5 py-4 text-[0.8125rem] text-muted-foreground">
                    {r.by}
                  </td>
                  <td className="text-data px-5 py-4 text-[0.8125rem]">{r.result}</td>
                  <td className="text-data px-5 py-4 text-[0.8125rem] text-muted-foreground">
                    {r.state}
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

const diGovernance = [
  { control: "Autonomy level", held: "Executive sponsor", detail: "Set per decision type; raising a level is an explicit, logged change." },
  { control: "Approval routing", held: "Named approvers", detail: "Each decision type routes to a person, never to a shared inbox." },
  { control: "Limits", held: "Finance / operations", detail: "Ceilings, rate limits and segment scope defined before autonomy is granted." },
  { control: "Rollback", held: "Any approver", detail: "Reversal available without engineering involvement." },
  { control: "Audit", held: "System", detail: "Inputs, model version, bounds and outcome retained per decision." },
];

export function DecisionGovernanceSection() {
  return (
    <ProductSection
      id="governance"
      eyebrow="Governance"
      title="Autonomy is granted deliberately, and can be withdrawn instantly."
      lede="No decision type acts on its own until someone with authority says it may, inside limits they set. QWA is designed so that withdrawing that permission is as easy as granting it."
      media="below"
      tone="paper"
    >
      <ProductPanel title="Controls" meta="ownership" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {diGovernance.map((g) => (
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
        {["Ad platforms", "CRM", "Telephony", "Commerce", "Warehouse", "Webhooks"].map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>
      <IllustrativeNote className="mt-6">
        Adapter categories only. Nothing is connected until configured for your deployment.
      </IllustrativeNote>
    </ProductSection>
  );
}
