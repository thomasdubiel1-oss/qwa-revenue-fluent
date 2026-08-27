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
import { FlagshipMedia } from "@/components/qwa/media/flagship-media";

/* -------------------------------------------------------------------------
 * Signature visual — the decision record.
 * Every autonomous action is a proposal with inputs, bounds and an owner.
 * ---------------------------------------------------------------------- */

export function DecisionRecordVisual() {
  return (
    <FlagshipMedia id="decision-intelligence-guardrail" unframed>
      <DecisionRecordVisualPanel />
    </FlagshipMedia>
  );
}

function DecisionRecordVisualPanel() {
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
        {/* Approval, guarded action, observed result and the way back out —
            each resolves in order so the governance chain reads as a sequence. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: "Approved by", state: "VP Revenue" },
            { id: "Acting within", state: "bounds" },
            { id: "Observed", state: "day 7 review" },
            { id: "Rollback", state: "one click" },
          ].map((b, i) => (
            <motion.span
              key={b.id}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: duration.base, ease: ease.out, delay: i * 0.18 }}
            >
              <RecordBadge id={b.id} state={b.state} />
            </motion.span>
          ))}
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
      level="sub"
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
          <p className="text-eyebrow text-ink-foreground/55">Autonomy ladder</p>
          <h3 className="text-display mt-4 max-w-[20ch] text-balance text-[clamp(1.6rem,2.6vw,2.1rem)]">
            You decide how much the system is allowed to decide.
          </h3>
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
      level="sub"
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
      level="sub"
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
      level="sub"
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
      level="sub"
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


/* -------------------------------------------------------------------------
 * Detect + frame — the evidence before the proposal.
 * ---------------------------------------------------------------------- */

const evidence = [
  { label: "Observed", value: "CAC gap of $193 between two channels", note: "Trailing 28 days, attributed revenue" },
  { label: "Population", value: "214 closed-won records", note: "Coverage 80.6% · stated with the figure" },
  { label: "Stability", value: "Holds across 3 of 4 weeks", note: "Week 2 excluded — feed degraded" },
  { label: "Not explained by", value: "Seasonality or mix shift", note: "Checked against the same period last year" },
  { label: "Confidence", value: "Medium", note: "No holdout yet; one variant drives most of the gap" },
];

export function DetectSection() {
  return (
    <ProductSection
      level="sub"
      id="detect"
      eyebrow="Detect and frame"
      title="Before anything is proposed, the case has to be stated."
      lede="Material movement is picked up from the same business and revenue graph the reporting layer reads. QWA frames it as a written case — what was observed, over what population, how stable it is, what it is not explained by, and how confident the reading is."
      points={[
        "Findings drawn from governed metrics, not a separate model's private view",
        "Weak or partial data is disclosed in the frame, not smoothed over",
        "Nothing advances to a proposal without an evidence record attached",
      ]}
      media="right"
    >
      <ProductPanel title="Finding · FD-2207" meta="framed" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {evidence.map((e, i) => (
              <motion.li
                key={e.label}
                className="grid gap-1 border-b border-hairline px-5 py-4 first:pt-5 last:border-b-0 last:pb-5"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: duration.base, ease: ease.out, delay: i * 0.06 }}
              >
                <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {e.label}
                </p>
                <p className="text-[0.9375rem] font-medium leading-snug">{e.value}</p>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{e.note}</p>
              </motion.li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * The decision brief — proposal with bounds, reusing the record visual.
 * ---------------------------------------------------------------------- */

export function DecisionBriefSection() {
  return (
    <ProductSection
      level="sub"
      id="brief"
      eyebrow="Decision brief"
      title="A proposal that reads like a memo, not a prediction."
      lede="The brief states the action, the inputs behind it, the bounds it would run inside and the gate it has to pass. Expected effect is a range with its assumptions attached — never a single confident number."
      points={[
        "Action, inputs, bounds and reversal path stated on one record",
        "Expected effect expressed as a range with the sample behind it",
        "The gate is part of the proposal, not an afterthought",
      ]}
      media="right"
      tone="paper"
    >
      <DecisionRecordVisual />
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Scenario comparison — alternatives, honestly costed.
 * ---------------------------------------------------------------------- */

const scenarios = [
  {
    option: "Shift $6k to retargeting",
    range: "+$14k to +$28k / mo",
    cost: "No new spend",
    risk: "Outbound pipeline thins if the gap closes",
    rec: true,
  },
  {
    option: "Shift $12k to retargeting",
    range: "+$18k to +$44k / mo",
    cost: "No new spend",
    risk: "Breaches the outbound floor; harder to reverse",
    rec: false,
  },
  {
    option: "Hold and run a holdout",
    range: "No near-term change",
    cost: "3 weeks of learning time",
    risk: "Gap persists while the test runs",
    rec: false,
  },
  {
    option: "Do nothing",
    range: "Baseline",
    cost: "None",
    risk: "Known CAC gap continues at current volume",
    rec: false,
  },
];

export function ScenarioSection() {
  return (
    <ProductSection
      level="sub"
      id="scenarios"
      eyebrow="Alternatives"
      title="The rejected options are shown, with why."
      lede="A single recommendation without its alternatives is an assertion. Each option carries an expected range, what it costs, what it risks and the assumption it depends on — including the option to do nothing."
      media="below"
    >
      <div className="overflow-hidden rounded-[var(--radius)] border border-hairline">
        <ul>
          {scenarios.map((sc, i) => (
            <motion.li
              key={sc.option}
              className="grid gap-2 border-b border-hairline px-5 py-5 last:border-b-0 lg:grid-cols-[minmax(0,16rem)_minmax(0,12rem)_minmax(0,10rem)_minmax(0,1fr)] lg:items-baseline lg:gap-6"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: duration.base, ease: ease.out, delay: i * 0.06 }}
            >
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-medium leading-snug">{sc.option}</p>
                {sc.rec ? (
                  <p className="text-data mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-signal">
                    Proposed
                  </p>
                ) : null}
              </div>
              <p
                className={
                  sc.rec
                    ? "text-data min-w-0 text-[0.8125rem] text-signal"
                    : "text-data min-w-0 text-[0.8125rem] text-muted-foreground"
                }
              >
                {sc.range}
              </p>
              <p className="min-w-0 text-[0.8125rem] text-muted-foreground">{sc.cost}</p>
              <p className="min-w-0 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {sc.risk}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
      <IllustrativeNote className="mt-6">
        Illustrative ranges. Modelled from your own history at deployment, never from benchmarks.
      </IllustrativeNote>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Approval state — authority, budget, named approver, stop conditions.
 * ---------------------------------------------------------------------- */

const approvalState = [
  { field: "Authority level", value: "L2 · recommend with approval" },
  { field: "Budget envelope", value: "$8,000 weekly maximum" },
  { field: "Named approver", value: "VP Revenue" },
  { field: "Policy check", value: "Passed · outbound floor respected" },
  { field: "Stop condition", value: "Opt-out rate +1.5 pts or CAC above baseline" },
  { field: "Reversal", value: "One click, within one billing cycle" },
];

export function ApprovalSection() {
  return (
    <ProductSection
      level="sub"
      id="approval"
      eyebrow="Approval"
      title="Who may say yes, inside what envelope, and what stops it."
      lede="Every proposal arrives with its authority level, budget envelope, policy result, named approver and the conditions that halt it automatically. Approval is a recorded act by a person, not a default."
      media="right"
      tone="paper"
    >
      <ProductPanel title="Gate · DC-9042" meta="awaiting approval" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {approvalState.map((a) => (
              <li
                key={a.field}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline px-5 py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <span className="text-[0.875rem] text-muted-foreground">{a.field}</span>
                <span className="text-data min-w-0 text-[0.8125rem]">{a.value}</span>
              </li>
            ))}
          </ul>
        </PanelBlock>
        <PanelBlock muted>
          <DecisionCallout
            label="If no one approves"
            value="Nothing happens"
            rule="Proposals expire in place. Silence is never treated as consent."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}
