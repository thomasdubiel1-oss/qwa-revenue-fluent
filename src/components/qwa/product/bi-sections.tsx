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
  StatCell,
} from "./primitives";
import { duration, ease } from "@/lib/motion";

/* -------------------------------------------------------------------------
 * Signature visual — the executive brief.
 * One headline number, the movement behind it, the question it raises.
 * ---------------------------------------------------------------------- */

const movement = [
  { label: "Paid social", delta: "+$38,400", dir: "up" as const, w: 0.82 },
  { label: "Voice overflow", delta: "+$12,900", dir: "up" as const, w: 0.4 },
  { label: "Organic search", delta: "+$6,100", dir: "up" as const, w: 0.22 },
  { label: "Outbound sequences", delta: "−$9,700", dir: "down" as const, w: 0.31 },
];

export function ExecutiveBriefVisual() {
  return (
    <ProductPanel
      title="Brief · week 12"
      meta="generated 06:00 · reviewed"
      footer={
        <IllustrativeNote>
          Illustrative reporting surface. Not a customer result or performance guarantee.
        </IllustrativeNote>
      }
    >
      <PanelBlock label="Headline">
        <p className="text-data text-[clamp(1.9rem,4vw,2.75rem)] font-medium tracking-tight">
          $512,400
        </p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Attributed revenue, up $47,700 against the prior week. Movement is concentrated in two
          sources.
        </p>
      </PanelBlock>
      <PanelBlock label="What moved" muted>
        <ul className="grid gap-3.5">
          {movement.map((m, i) => (
            <li key={m.label} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 truncate text-[0.875rem]">{m.label}</span>
                <span
                  className={
                    m.dir === "up"
                      ? "text-data shrink-0 text-[0.8125rem] text-positive"
                      : "text-data shrink-0 text-[0.8125rem] text-muted-foreground"
                  }
                >
                  {m.delta}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-hairline-strong">
                <motion.div
                  className={m.dir === "up" ? "h-full bg-signal" : "h-full bg-muted-foreground/50"}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: m.w }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: duration.slow, ease: ease.out, delay: i * 0.08 }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </PanelBlock>
      <PanelBlock label="Open question">
        <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
          Outbound decline coincides with a sequence change on 04 Mar. Confidence: medium — one week
          of data, no holdout.
        </p>
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Coverage", value: "80.6%" },
          { label: "Sources", value: "9 joined" },
          { label: "Reconciled", value: "Yes", accent: true },
        ]}
      />
    </ProductPanel>
  );
}

/* ---------------------------------------------------------------------- */

export function SingleSourceSection() {
  return (
    <ProductSection
      id="truth"
      eyebrow="One set of numbers"
      title="Stop reconciling four dashboards before the meeting."
      lede="Ads, web, conversations, appointments, CRM and finance are joined against one customer and revenue graph. Reports read from that graph, so two teams asking the same question get the same answer."
      points={[
        "Definitions held centrally — a qualified lead means one thing across the company",
        "Every metric traceable to the events and model that produced it",
        "Disagreements resolved by opening the record, not by comparing exports",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Metric · qualified lead" meta="definition" footer={<IllustrativeNote />}>
        <PanelBlock label="Definition">
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            A record with a resolved identity, a stated need inside a served category, and a
            confirmed contact method — scored at or above 60.
          </p>
        </PanelBlock>
        <PanelBlock label="Provenance" muted>
          <FieldGrid
            fields={[
              { label: "Owner", value: "Revenue operations" },
              { label: "Version", value: "v4 · 12 Feb" },
              { label: "Used by", value: "17 reports" },
              { label: "Status", value: "Locked", accent: true },
            ]}
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const layers = [
  { layer: "Executive", question: "Are we growing, and what is driving it?", cadence: "Weekly brief" },
  { layer: "Function", question: "Which channels, creatives and teams are producing?", cadence: "Daily" },
  { layer: "Operator", question: "What should I do in the next hour?", cadence: "Live" },
];

export function LayersSection() {
  return (
    <ProductSection
      id="layers"
      eyebrow="Three altitudes"
      title="The same truth, at the resolution each person needs."
      lede="An operator and a board member need different views of the same data, not different data. QWA renders one graph at three altitudes, and every level can drill into the level below it."
      media="below"
    >
      <ProductPanel title="Reporting layers" meta="one graph" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul className="grid lg:grid-cols-3">
            {layers.map((l, i) => (
              <motion.li
                key={l.layer}
                className="min-w-0 border-b border-hairline px-5 py-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: duration.base, ease: ease.out, delay: i * 0.08 }}
              >
                <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-signal">
                  {l.layer}
                </p>
                <p className="mt-3 text-[1.0625rem] font-medium leading-snug">{l.question}</p>
                <p className="text-data mt-3 text-[0.7rem] text-muted-foreground">{l.cadence}</p>
              </motion.li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Anomalies — ink moment
 * ---------------------------------------------------------------------- */

const anomalies = [
  {
    what: "Appointment no-show rate up 9 points",
    where: "North region · Tue–Thu",
    conf: "High",
    note: "Coincides with a reminder-window change on 09 Mar.",
  },
  {
    what: "Cost per qualified lead down 18%",
    where: "Paid social · retargeting",
    conf: "Medium",
    note: "Driven by one creative variant; sample is still small.",
  },
  {
    what: "Voice abandonment above threshold",
    where: "Inbound overflow · 18:00–20:00",
    conf: "High",
    note: "Staffing gap, not routing. Verified against schedule data.",
  },
];

export function AnomalySection() {
  return (
    <Section tone="ink" id="anomalies" className="scroll-mt-24 py-24 lg:py-32">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Anomalies and explanation</p>
          <h2 className="text-display mt-5 max-w-[20ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            Surfaced with a confidence level, not a confident guess.
          </h2>
          <p className="mt-5 max-w-[36rem] text-pretty text-[1.0625rem] leading-relaxed text-ink-foreground/70">
            QWA flags material movement and offers the most plausible explanation available from the
            record. Where the evidence is thin it says so. Correlation is never presented as proof.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <ProductPanel
            tone="ink"
            title="Anomalies · week 12"
            meta="3 material"
            footer={
              <IllustrativeNote tone="ink">
                Illustrative findings. Explanations are hypotheses drawn from correlated records.
              </IllustrativeNote>
            }
          >
            <PanelBlock className="py-0">
              <ul>
                {anomalies.map((a, i) => (
                  <motion.li
                    key={a.what}
                    className="grid gap-2 border-b border-ink-foreground/12 px-5 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] sm:gap-8"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: i * 0.08 }}
                  >
                    <div className="min-w-0">
                      <p className="text-[1.0625rem] font-medium leading-snug">{a.what}</p>
                      <p className="text-data mt-1.5 text-[0.7rem] text-ink-foreground/50">
                        {a.where}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-signal">
                        Confidence · {a.conf}
                      </p>
                      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-foreground/60">
                        {a.note}
                      </p>
                    </div>
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

export function ForecastSection() {
  return (
    <ProductSection
      id="forecast"
      eyebrow="Forecasting"
      title="A range with its assumptions attached."
      lede="Forecasts are produced from pipeline, historical conversion and current capacity, and are always shown as a range. The assumptions behind them are printed next to the number, not buried in a methodology page."
      points={[
        "Ranges, never single-point certainty",
        "Assumptions and input windows stated on the forecast itself",
        "Prior forecasts retained and scored against what actually happened",
      ]}
      media="left"
      tone="paper"
    >
      <ProductPanel title="Forecast · Q2" meta="range" footer={<IllustrativeNote />}>
        <PanelBlock label="Attributed revenue">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-data text-[1.75rem] font-medium tracking-tight">$1.42M</span>
            <span className="text-data text-[0.875rem] text-muted-foreground">
              to $1.68M · 80% band
            </span>
          </div>
        </PanelBlock>
        <PanelBlock label="Assumptions" muted>
          <ul className="grid gap-2.5 text-[0.875rem] leading-relaxed text-muted-foreground">
            <li>Capacity holds at current appointment volume</li>
            <li>Paid spend flat against March</li>
            <li>No pricing change in the period</li>
          </ul>
        </PanelBlock>
        <PanelBlock>
          <DecisionCallout
            label="Prior forecast accuracy"
            value="±6.4%"
            rule="Q1 forecast scored against booked revenue after close."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function DataQualitySection() {
  return (
    <ProductSection
      id="quality"
      eyebrow="Data quality"
      title="A number you can trust states how much it does not know."
      lede="Coverage, freshness, join success and source health are published alongside the reports that depend on them. When a feed breaks, the affected metrics are marked rather than quietly recalculated."
      media="below"
    >
      <div className="grid gap-10 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Coverage", value: "80.6%", caption: "Share of booked revenue joined to a journey." },
          { label: "Freshness", value: "< 15 min", caption: "Lag on the slowest connected source." },
          { label: "Join success", value: "94.2%", caption: "Events successfully resolved to a record." },
          { label: "Degraded feeds", value: "1", caption: "Affected metrics flagged wherever they appear." },
        ].map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
      <IllustrativeNote className="mt-8" />
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const biGovernance = [
  { control: "Metric definitions", held: "Revenue operations", detail: "Versioned centrally; changes are dated and visible on every report." },
  { control: "Access", held: "Administrators", detail: "Row and field-level access scoped by role and business unit." },
  { control: "Period locking", held: "Finance", detail: "Closed periods stop moving once reconciliation is signed." },
  { control: "Export", held: "Policy", detail: "Exports logged; sensitive fields excluded by configuration." },
  { control: "Lineage", held: "System", detail: "Every figure traceable to sources, transforms and the active model." },
];

export function BiGovernanceSection() {
  return (
    <ProductSection
      id="governance"
      eyebrow="Governance"
      title="Reporting an auditor can follow."
      lede="Definitions, access, lineage and locked periods are managed as controls with named owners. Nothing in the reporting layer is a black box to the people accountable for it."
      media="below"
      tone="paper"
    >
      <ProductPanel title="Controls" meta="ownership" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {biGovernance.map((g) => (
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
        {["Warehouse", "CRM", "Ad platforms", "Telephony", "Commerce", "Finance / ERP", "BI tools"].map(
          (c) => (
            <Chip key={c}>{c}</Chip>
          ),
        )}
      </div>
      <IllustrativeNote className="mt-6">
        Adapter categories only. Nothing is connected until configured for your deployment.
      </IllustrativeNote>
    </ProductSection>
  );
}
