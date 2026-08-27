import { createFileRoute } from "@tanstack/react-router";
import { ProductCta, ProductHero, ProductShell } from "@/components/qwa/product/primitives";
import {
  AcquisitionAttributionSection,
  AcquisitionExecutiveSection,
  AcquisitionGovernanceSection,
  AcquisitionLedgerVisual,
  CreativePerformanceSection,
  DemandIntakeSection,
  LeadQualitySection,
  PacingSection,
} from "@/components/qwa/product/acquisition-sections";

const title = "Acquisition — QWA";
const description =
  "Measure acquisition by revenue, not clicks. QWA joins every source, campaign and creative to closed revenue, grades lead quality on downstream outcomes and proposes budget moves your team approves.";

export const Route = createFileRoute("/products/acquisition")({
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
  component: AcquisitionPage,
});

function AcquisitionPage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Acquisition"
        title="Buy demand you can trace to revenue."
        lede="QWA joins every source, campaign and creative to what actually closed. Lead quality is graded on downstream outcomes, budget proposals cite the rule that produced them, and nothing moves without a named approval."
        secondaryLabel="See the ledger"
        secondaryHref="#quality"
        note="Spend and closed revenue on the same record."
        visual={<AcquisitionLedgerVisual />}
      />

      <DemandIntakeSection />
      <LeadQualitySection />
      <PacingSection />
      <CreativePerformanceSection />
      <AcquisitionAttributionSection />
      <AcquisitionExecutiveSection />
      <AcquisitionGovernanceSection />

      <ProductCta
        title="Find the spend that never became revenue."
        lede="Bring one month of channel spend and one month of closed deals. In thirty minutes we show what a joined record would have told you, and what it would have changed."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
