import { createFileRoute } from "@tanstack/react-router";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
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

const title = "Customer Acquisition — QWA";
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
      { property: "og:url", content: "https://qwa-revenue-fluent.lovable.app/products/acquisition" },
    ],
    links: [{ rel: "canonical", href: "https://qwa-revenue-fluent.lovable.app/products/acquisition" }],
  }),
  component: AcquisitionPage,
});

function AcquisitionPage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Customer Acquisition"
        title="Buy demand you can trace to revenue."
        lede="QWA joins every source, campaign and creative to what actually closed. Lead quality is graded on downstream outcomes, budget proposals cite the rule that produced them, and nothing moves without a named approval."
        secondaryLabel="How it works"
        secondaryHref="#demand"
        note="Spend and closed revenue on the same record."
        visual={<AcquisitionLedgerVisual />}
      />

      <ChapterOpener
        id="demand"
        index="01"
        label="Demand"
        title="Demand arrives from everywhere. It should land in one place."
        lede="Paid, owned, earned and offline all resolve onto a single record at the moment they arrive, so the spend that created the lead is already attached before anyone works it."
      />
      <DemandIntakeSection />

      <ChapterOpener
        id="execution"
        index="02"
        label="Execution"
        title="Campaign and creative, graded on what closed."
        lede="Every ad, offer and placement is credited across the whole journey rather than the last click. Budget follows measured contribution, inside limits your team sets."
        tone="paper"
      />
      <CreativePerformanceSection />
      <PacingSection />

      <ChapterOpener
        id="pipeline"
        index="03"
        label="Qualified pipeline"
        title="Cheap leads that never qualify are a cost."
        lede="Sources are scored on what happens after the click — reached, qualified, booked, closed — and that verdict is what returns to the platforms buying on your behalf."
      />
      <LeadQualitySection />

      <ChapterOpener
        index="04"
        label="Closed revenue"
        title="Revenue travels back to what produced it."
        lede="When a deal closes, QWA walks the record backward and credits every touch that contributed — channel, campaign, creative and conversation — then feeds that verdict into the next budget and offer decision."
      />
      <AcquisitionAttributionSection />

      <ChapterOpener
        id="enterprise"
        index="05"
        label="Measurement and control"
        title="Reporting finance trusts, authority your team keeps."
        lede="One surface a revenue leader can read without reconciliation, and explicit control over budget, channels, data sharing and the attribution model itself."
        quiet
      />
      <AcquisitionExecutiveSection />
      <AcquisitionGovernanceSection />

      <RelatedProducts current="acquisition" />

      <ProductCta
        title="Find the spend that never became revenue."
        lede="Bring one month of channel spend and one month of closed deals. In thirty minutes we show what a joined record would have told you, and what it would have changed."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}

