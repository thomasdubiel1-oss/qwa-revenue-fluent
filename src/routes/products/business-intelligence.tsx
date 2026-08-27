import { createFileRoute } from "@tanstack/react-router";
import { ProductCta, ProductHero, ProductShell, RelatedProducts } from "@/components/qwa/product/primitives";
import {
  AnomalySection,
  BiGovernanceSection,
  DataQualitySection,
  ExecutiveBriefVisual,
  ForecastSection,
  LayersSection,
  SingleSourceSection,
} from "@/components/qwa/product/bi-sections";

const title = "Business Intelligence — QWA";
const description =
  "One set of numbers across ads, conversations, appointments, CRM and finance: executive briefs, anomaly detection with stated confidence, ranged forecasts and published data quality.";

export const Route = createFileRoute("/products/business-intelligence")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BusinessIntelligencePage,
});

function BusinessIntelligencePage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Business Intelligence"
        title="Revenue truth, at the altitude each person needs."
        lede="One customer and revenue graph feeds every view: a weekly brief for the board, functional reads for the teams, live numbers for operators. Definitions are shared, lineage is visible, and coverage is published next to the figure."
        secondaryLabel="See anomaly handling"
        secondaryHref="#anomalies"
        note="Traceable lineage. Ranged forecasts. Coverage always stated."
        visual={<ExecutiveBriefVisual />}
      />

      <SingleSourceSection />
      <LayersSection />
      <AnomalySection />
      <ForecastSection />
      <DataQualitySection />
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
