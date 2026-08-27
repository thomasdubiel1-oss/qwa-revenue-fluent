import { motion } from "motion/react";
import { Container, Section } from "../primitives";
import { MotionItem, MotionReveal, MotionStagger } from "../motion-primitives";
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
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
 * Signature visual — the production pipeline.
 * A brief entering one end and versioned, measured output leaving the other.
 * ---------------------------------------------------------------------- */

const pipeline = [
  { stage: "Brief", detail: "Offer, audience, claim boundaries" },
  { stage: "Script", detail: "Hook, proof, single call to action" },
  { stage: "Shots", detail: "Decomposed into generatable units" },
  { stage: "Routing", detail: "Provider chosen per shot" },
  { stage: "Assembly", detail: "Cuts, captions, aspect variants" },
  { stage: "Review", detail: "Named human approves or rejects" },
];

export function ProductionPipelineVisual() {
  return (
    <ProductPanel
      title="Job · CS-2210 · coverage comparison"
      meta="6 stages · human gated"
      footer={<IllustrativeNote>Illustrative pipeline state. No provider is called from this page.</IllustrativeNote>}
    >
      <PanelBlock className="py-6">
        <ol className="grid gap-0">
          {pipeline.map((p, i) => (
            <li key={p.stage} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4">
              <div className="relative flex flex-col items-center">
                <motion.span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal"
                  initial={{ scale: 0.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: duration.fast, ease: ease.out, delay: i * 0.12 }}
                />
                {i < pipeline.length - 1 ? (
                  <motion.span
                    className="w-px flex-1 bg-hairline-strong"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: 0.06 + i * 0.12 }}
                    style={{ transformOrigin: "top" }}
                  />
                ) : null}
              </div>
              <div className={cn("min-w-0", i < pipeline.length - 1 && "pb-5")}>
                <p className="text-[0.9375rem] font-medium leading-snug">{p.stage}</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {p.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Variants", value: "9" },
          { label: "Aspects", value: "3" },
          { label: "Approved", value: "By name" },
        ]}
      />
    </ProductPanel>
  );
}

/* -------------------------------------------------------------------------
 * Brief intake
 * ---------------------------------------------------------------------- */

export function BriefSection() {
  return (
    <ProductSection
      id="brief"
      eyebrow="Brief intake"
      title="Production starts from an outcome, not a prompt."
      lede="A brief in QWA names the offer, the audience, the claim boundaries and the metric the work is meant to move. Everything produced downstream is traceable to it."
      points={[
        "Offer, audience and success metric captured as structured fields",
        "Claim boundaries and prohibited language set before generation",
        "Winning patterns from Acquisition can seed the brief automatically",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Brief · CS-2210" meta="approved 14 Mar" footer={<IllustrativeNote />}>
        <PanelBlock label="Brief fields">
          <FieldGrid
            fields={[
              { label: "Objective", value: "Qualified conversations, not clicks", accent: true },
              { label: "Audience", value: "Renewing two-vehicle households" },
              { label: "Primary claim", value: "Coverage comparison in one minute" },
              { label: "Prohibited", value: "Price guarantees, competitor names" },
            ]}
          />
        </PanelBlock>
        <PanelBlock label="Seeded from performance" muted>
          <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
            The 15-second comparison format produced the highest revenue contribution last cycle.
            QWA proposes it as the starting structure; a person can discard it.
          </p>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Script and shot decomposition
 * ---------------------------------------------------------------------- */

const shots = [
  { n: "01", label: "Hook", body: "Two policies side by side, one visibly shorter.", spec: "2.5s · static-to-motion" },
  { n: "02", label: "Proof", body: "The roadside line item resolving into a monthly figure.", spec: "5s · generated" },
  { n: "03", label: "Human", body: "Advisor on a call, unhurried, mid-sentence.", spec: "4s · generated" },
  { n: "04", label: "Action", body: "One instruction, held long enough to read.", spec: "3.5s · template" },
];

export function ShotDecompositionSection() {
  return (
    <ProductSection
      id="shots"
      eyebrow="Script and shots"
      title="A script that survives contact with production."
      lede="QWA decomposes the script into shots with explicit duration, motion and intent. Each shot becomes an independently generatable, independently replaceable unit."
      points={[
        "Shot-level intent recorded, not just a text prompt",
        "Any single shot can be regenerated without rebuilding the cut",
        "Templates and generated footage mix inside the same timeline",
      ]}
      media="left"
    >
      <ProductPanel title="Shot list · CS-2210" meta="15s master" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ol>
            {shots.map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <span className="text-data pt-1 text-[0.7rem] text-muted-foreground/60">{s.n}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                      {s.label}
                    </p>
                    <p className="text-data text-[0.7rem] text-muted-foreground/70">{s.spec}</p>
                  </div>
                  <p className="mt-1.5 text-pretty text-[0.9375rem] leading-relaxed">{s.body}</p>
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
 * Provider routing — the honest one
 * ---------------------------------------------------------------------- */

const candidates = [
  { name: "Provider A", trait: "Strongest motion coherence at 5s", state: "Not configured" },
  { name: "Provider B", trait: "Lowest cost per generated second", state: "Not configured" },
  { name: "Provider C", trait: "Best text and product legibility", state: "Not configured" },
  { name: "Provider D", trait: "Fastest turnaround under load", state: "Not configured" },
];

export function ProviderRoutingSection() {
  return (
    <ProductSection
      id="routing"
      eyebrow="Provider routing"
      title="Model-agnostic by design, not by slogan."
      lede="Each shot is routed to the generation provider best suited to it, scored on capability, cost, latency and prior quality. Providers are adapters — they can be swapped without touching the brief or the cut."
      points={[
        "Routing scored per shot, not once per campaign",
        "Cost and latency estimated before a job is committed",
        "New providers added as adapters, existing work unaffected",
      ]}
      media="right"
      tone="paper"
    >
      <ProductPanel title="Routing candidates · shot 02" meta="simulation only" footer={
        <IllustrativeNote>
          Provider credentials are configured server-side by your team. No provider is connected or
          called from this page.
        </IllustrativeNote>
      }>
        <PanelBlock className="py-5">
          <DecisionCallout
            label="Would route to"
            value="Highest capability match"
            rule="Scored on motion coherence, cost per second, latency and prior quality"
          />
        </PanelBlock>
        <PanelBlock className="py-0">
          <ul>
            {candidates.map((c) => (
              <li
                key={c.name}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3.5 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{c.name}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{c.trait}</p>
                </div>
                <span className="text-data shrink-0 text-[0.7rem] text-muted-foreground/70">
                  {c.state}
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
 * Variants and formats
 * ---------------------------------------------------------------------- */

const formats = ["9:16", "1:1", "16:9", "6s", "15s", "30s", "Captioned", "Sound-off"];

export function VariantSection() {
  return (
    <ProductSection
      id="variants"
      eyebrow="Variants and formats"
      title="One approved idea, every placement it needs."
      lede="From a single approved master, QWA produces the aspect ratios, durations and caption treatments each channel requires — versioned, so you always know which cut ran where."
      points={[
        "Aspect, duration and caption variants derived from one master",
        "Every variant versioned and traceable to its brief",
        "Sound-off legibility treated as a requirement, not an option",
      ]}
      media="left"
    >
      <ProductPanel title="Variant set · CS-2210" meta="v3 · 9 assets" footer={<IllustrativeNote />}>
        <PanelBlock label="Derived formats">
          <div className="flex flex-wrap gap-2">
            {formats.map((f, i) => (
              <Chip key={f} active={i < 3}>
                {f}
              </Chip>
            ))}
          </div>
        </PanelBlock>
        <PanelBlock label="Version history" muted className="py-0 pt-5">
          <ul className="pb-5">
            {[
              { v: "v3", note: "Hook shortened to 2.5s after review", state: "Live" },
              { v: "v2", note: "Captions rebuilt for sound-off legibility", state: "Archived" },
              { v: "v1", note: "First assembly from shot list", state: "Archived" },
            ].map((h) => (
              <li
                key={h.v}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3 last:border-b-0 last:pb-0"
              >
                <p className="min-w-0 text-[0.875rem]">
                  <span className="text-data mr-3 text-[0.75rem] text-muted-foreground">{h.v}</span>
                  {h.note}
                </p>
                <span
                  className={cn(
                    "text-data shrink-0 text-[0.7rem]",
                    h.state === "Live" ? "text-positive" : "text-muted-foreground/70",
                  )}
                >
                  {h.state}
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
 * Brand consistency and evaluation
 * ---------------------------------------------------------------------- */

const checks = [
  { label: "Brand system", detail: "Type, color, logo placement and safe areas enforced on export." },
  { label: "Claim boundaries", detail: "Prohibited language flagged before a cut reaches review." },
  { label: "Legibility", detail: "Caption contrast and hold time checked at each aspect ratio." },
  { label: "Artifact review", detail: "Generated footage screened for defects a person would catch." },
];

export function QualitySection() {
  return (
    <Section id="quality" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-20">
          <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-eyebrow">Consistency and review</p>
            <h2 className="text-display mt-5 max-w-[17ch] text-balance text-[clamp(1.85rem,3.2vw,2.7rem)]">
              Volume is worthless if the work is off-brand.
            </h2>
            <p className="text-lede mt-5 max-w-[30rem]">
              Every asset passes the same checks before it reaches a human reviewer, and nothing
              publishes without a named approval.
            </p>
          </MotionReveal>

          <MotionStagger stagger={0.05} className="min-w-0 border-t border-hairline">
            {checks.map((c) => (
              <MotionItem key={c.label}>
                <div className="border-b border-hairline py-5">
                  <h3 className="text-[1.0625rem] font-medium tracking-tight">{c.label}</h3>
                  <p className="mt-1.5 max-w-[38rem] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
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
 * Performance feedback loop
 * ---------------------------------------------------------------------- */

const headline = [
  { label: "Revenue from produced creative", value: "$96K", caption: "Joined to the full contribution chain" },
  { label: "Cost per approved asset", value: "$41", caption: "Generation, assembly and review" },
  { label: "Brief to first cut", value: "2h 40m", caption: "Median across the last production cycle" },
];

const secondary = [
  { label: "Assets produced", value: "142" },
  { label: "Approved without rework", value: "78%" },
  { label: "Published without review", value: "0" },
];

export function CreativeFeedbackSection() {
  return (
    <Section id="feedback" tone="paper" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Performance feedback</p>
          <h2 className="text-display mt-5 max-w-[19ch] text-balance text-[clamp(1.85rem,3.2vw,2.7rem)]">
            Creative is measured in revenue, then rewritten.
          </h2>
          <p className="text-lede mt-5 max-w-[35rem]">
            Outcomes return from Acquisition and the Revenue Engine, so the next brief starts from
            what actually produced qualified conversations — not from taste.
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
  { label: "Approval gate", detail: "Nothing publishes without a named human approval.", held: "You" },
  { label: "Claim policy", detail: "Language your legal team prohibits, enforced before review.", held: "You and legal" },
  { label: "Provider allowlist", detail: "Which generation providers may be used, and for what.", held: "You" },
  { label: "Rights and retention", detail: "Where assets live, how long, and who may export them.", held: "You" },
  { label: "Disclosure", detail: "AI-generated footage labelled per your policy and jurisdiction.", held: "You" },
  { label: "Version history", detail: "Every cut, prompt and approval retained and auditable.", held: "System" },
];

export function CreativeGovernanceSection() {
  return (
    <Section id="governance" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-20">
          <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-eyebrow">Governance and control</p>
            <h2 className="text-display mt-5 max-w-[16ch] text-balance text-[clamp(1.85rem,3.2vw,2.7rem)]">
              Generated does not mean unsupervised.
            </h2>
            <p className="text-lede mt-5 max-w-[30rem]">
              Speed is only useful when the work is safe to run. Every asset carries the record of
              how it was made and who cleared it.
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
