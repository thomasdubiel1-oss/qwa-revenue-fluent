import { createFileRoute } from "@tanstack/react-router";
import { AttributionStory } from "@/components/qwa/story/product-stories";
import { productHead } from "@/lib/seo/page-heads";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
import {
  AmbiguitySection,
  AttributionGovernanceSection,
  AttributionIntegrationsSection,
  ConfidenceLineageSection,
  ContinuitySection,
  FeedbackSection,
  IdentityResolutionSection,
  JoinedJourneySection,
  LedgerSection,
  ModelSection,
  ReconciliationSection,
  ReturnPathSection,
} from "@/components/qwa/product/attribution-sections";

const title = "Revenue Attribution — QWA";
const description =
  "The closed-revenue reconciliation layer: identity and journey joining, explainable multi-touch contribution, reconciliation to CRM, commerce and payment records, and outcomes fed back into acquisition and decisions.";

export const Route = createFileRoute("/products/attribution")({
  head: () =>
    productHead({ path: "/products/attribution", name: "Revenue Attribution", title, description }),
  component: AttributionPage,
});

function AttributionPage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Revenue Attribution"
        title="The reconciliation layer between what you spent and what actually closed."
        lede="Source, campaign, creative, conversation, appointment, rep and payment are joined into one journey. When a deal closes, its value travels back across that journey and is reconciled against the booked revenue in your system of record — in currency, with coverage and lineage stated."
        secondaryLabel="See the return path"
        secondaryHref="#return"
        note="Explainable contribution. Coverage stated. Reconciled with finance."
        visual={<AttributionStory />}
      />

      <ChapterOpener
        id="joining"
        index="01"
        label="Identity and journey joining"
        title="Before credit, the chain has to be real."
        lede="Attribution fails upstream of the model, at the joins. QWA resolves identity across click, session, phone and CRM contact, keeps deterministic and probabilistic matches apart, and carries source through lead, appointment and sale as one continuous record."
      />
      <IdentityResolutionSection />
      <JoinedJourneySection />
      <ContinuitySection />

      <ChapterOpener
        id="contribution"
        index="02"
        label="Multi-touch contribution"
        title="Credit distributed by an explainable, changeable model."
        lede="The active model, its window and its weights travel with every figure. Contribution is presented as an estimate because it is one, and any number can be re-run under a different model without altering the underlying events."
        tone="paper"
      />
      <ModelSection />
      <ReturnPathSection />
      <AmbiguitySection />

      <ChapterOpener
        id="reconciliation"
        index="03"
        label="Closed-revenue reconciliation"
        title="Reconciled to the money, not to the dashboard."
        lede="Attributed revenue is matched line by line against CRM, commerce and payment records. Timing differences, refunds, partial joins and unattributed revenue are itemised rather than netted away, and closed periods stop moving."
      />
      <LedgerSection />
      <ReconciliationSection />

      <ChapterOpener
        id="trust"
        index="04"
        label="Finance trust and decision feedback"
        title="A number finance will sign, and the engine will act on."
        lede="Every figure publishes its coverage, confidence and lineage. Those same outcomes are written back into acquisition, creative, routing and reactivation, so attribution changes the next decision instead of ending in a monthly deck."
        tone="paper"
      />
      <ConfidenceLineageSection />
      <FeedbackSection />

      <ChapterOpener
        id="enterprise"
        index="05"
        label="Enterprise readiness"
        title="Ownership, audit trail and the systems of record you already run."
        lede="Model selection, windows and overrides each have a named owner and a versioned record. QWA reads and writes through adapters to ad platforms, telephony, CRM, commerce and finance systems, and nothing is assumed to be connected."
        quiet
      />
      <AttributionGovernanceSection />
      <AttributionIntegrationsSection />

      <RelatedProducts current="attribution" />

      <ProductCta
        title="Bring the number your teams argue about most."
        lede="We trace one closed-won deal end to end — the joins, the model, the return path and the reconciliation — and show exactly where your current picture breaks."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}

