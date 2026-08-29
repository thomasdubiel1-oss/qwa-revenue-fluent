import { createFileRoute } from "@tanstack/react-router";
import { productHead } from "@/lib/seo/page-heads";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
import {
  AnomalySection,
  BiGovernanceSection,
  DataQualitySection,
  EntityGraphSection,
  ExecutiveBriefVisual,
  ForecastActionSection,
  ForecastSection,
  LayersSection,
  LineageSection,
  SingleSourceSection,
} from "@/components/qwa/product/bi-sections";

const title = "Business Intelligence — QWA";
const description =
  "One set of numbers across ads, conversations, appointments, CRM and finance: executive briefs, anomaly detection with stated confidence, ranged forecasts and published data quality.";

export const Route = createFileRoute("/products/business-intelligence")({
  head: () =>
    productHead({ path: "/products/business-intelligence", name: "Business Intelligence", title, description }),
  component: BusinessIntelligencePage,
});

function BusinessIntelligencePage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Business Intelligence"
        title="Revenue truth, at the altitude each person needs."
        lede="One customer and revenue graph feeds every view: a weekly brief for the board, functional reads for the teams, live numbers for operators. Definitions are shared, lineage is visible, and coverage is published next to the figure."
        secondaryLabel="See how it works"
        secondaryHref="#record"
        note="Traceable lineage. Ranged forecasts. Coverage always stated."
        visual={<ExecutiveBriefVisual />}
      />

      <ChapterOpener
        id="record"
        index="01"
        label="Unified business record"
        title="One governed view of the business, not nine exports."
        lede="Revenue, pipeline, acquisition spend, conversations, commerce and customer signals resolve into a small set of governed entities on the same customer and revenue graph the rest of QWA writes to. Reports read from that graph rather than from a copy of it."
      />
      <EntityGraphSection />
      <SingleSourceSection />

      <ChapterOpener
        id="definitions"
        index="02"
        label="Definitions + data quality"
        title="One definition, one lineage, one honest coverage number."
        lede="Qualified lead, appointment, CAC, attributable revenue and recovered revenue are defined once, owned by a named team and versioned. Every figure exposes the sources, joins, definition and model version behind it — and states how much of the business it covers."
      />
      <LineageSection />
      <DataQualitySection />

      <ChapterOpener
        id="executive"
        index="03"
        label="Executive operating view"
        title="What changed, why, and where to look next."
        lede="Instead of dashboard sprawl, each altitude gets the read it can act on: a weekly brief that explains movement in business language, functional views for the teams, and live numbers for operators. Material movement is surfaced with a confidence level rather than a confident guess."
        tone="paper"
      />
      <LayersSection />
      <AnomalySection />

      <ChapterOpener
        id="forward"
        index="04"
        label="Forecast + learning"
        title="From measured history to a range you can plan against."
        lede="Historical outcomes feed a ranged forward view with stated scenarios and leading indicators. Forecasts are labelled as forecasts, and where the range says the plan is at risk the reading hands off as evidence rather than as an instruction."
      />
      <ForecastSection />
      <ForecastActionSection />

      <ChapterOpener
        index="05"
        label="Enterprise"
        title="Permissions, audit history and provider neutrality."
        lede="Definition ownership, access scoping, period locking, export policy and full lineage stay with your team. Source adapters connect the systems you already run, exports and APIs keep the data portable, and no part of the reporting layer is locked to one model or vendor."
        tone="paper"
        quiet
      />
      <BiGovernanceSection />

      <RelatedProducts current="business-intelligence" />

      <ProductCta
        title="Bring the report two teams cannot agree on."
        lede="We take one contested metric, define it once, trace it to the events behind it, and show what the reconciled version actually says."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
