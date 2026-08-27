import { createFileRoute } from "@tanstack/react-router";
import { ProductCta, ProductHero, ProductShell } from "@/components/qwa/product/primitives";
import {
  AmbiguitySection,
  AttributionGovernanceSection,
  AttributionIntegrationsSection,
  FeedbackSection,
  JoinedJourneySection,
  LedgerSection,
  ModelSection,
  ReconciliationSection,
  ReturnPathSection,
  ReturnPathVisual,
} from "@/components/qwa/product/attribution-sections";

const title = "Revenue Attribution — QWA";
const description =
  "One joined journey from first touch to closed won: contribution modelling, a revenue return path onto every contributing touch, honest unattributed reporting and finance reconciliation.";

export const Route = createFileRoute("/products/attribution")({
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
  component: AttributionPage,
});

function AttributionPage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Revenue Attribution"
        title="The definitive record of how revenue was actually created."
        lede="Campaigns, creatives, conversations, appointments and reps are written to one journey. When a deal closes, its value travels back across that journey — so every contributor carries the revenue it earned, in currency, not in credit points."
        secondaryLabel="See the return path"
        secondaryHref="#return"
        note="Contribution modelling. Unattributed shown. Reconciled with finance."
        visual={<ReturnPathVisual />}
      />

      <JoinedJourneySection />
      <ModelSection />
      <ReturnPathSection />
      <AmbiguitySection />
      <LedgerSection />
      <ReconciliationSection />
      <FeedbackSection />
      <AttributionGovernanceSection />
      <AttributionIntegrationsSection />

      <ProductCta
        title="Bring the number your teams argue about most."
        lede="We trace one closed-won deal end to end — the joined journey, the model, the return path and the reconciliation — and show exactly where your current picture breaks."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
