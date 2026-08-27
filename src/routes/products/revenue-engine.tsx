import { createFileRoute } from "@tanstack/react-router";
import { RevenueEngine } from "@/components/qwa/revenue-engine";
import {
  ProductCta,
  ProductHero,
  ProductShell,
} from "@/components/qwa/product/primitives";
import {
  AppointmentSection,
  AttributionSection,
  ExecutiveViewSection,
  GovernanceSection,
  ImmediateResponseSection,
  IntegrationsSection,
  LearningSection,
  QualificationSection,
  ReactivationSection,
  RevenueLoopVisual,
  SalesAssistSection,
  VoiceHandoffSection,
} from "@/components/qwa/product/revenue-engine-sections";

const title = "Revenue Engine — QWA";
const description =
  "QWA's Revenue Engine turns every lead into a managed revenue journey: immediate response, qualification, cross-channel follow-up, booking, sales assistance, attribution, learning and reactivation.";

export const Route = createFileRoute("/products/revenue-engine")({
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
  component: RevenueEnginePage,
});

function RevenueEnginePage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Revenue Engine"
        title="Turn every lead into a managed revenue journey."
        lede="QWA answers in seconds, qualifies in conversation, follows up across voice, SMS and DM, books the appointment, briefs the salesperson, attributes the sale back to its source, learns from the outcome and reactivates what went quiet."
        secondaryLabel="Watch the revenue loop"
        secondaryHref="#loop"
        note="One record from first signal to closed revenue."
        visual={<RevenueLoopVisual />}
      />

      <RevenueEngine
        id="loop"
        eyebrow="The ten-stage loop"
        title="One lead, followed end to end."
        lede="Ten stages, one record. Scroll once and you have the whole operating loop — from the first signal to the revenue travelling back to the campaign that produced it."
      />

      <ImmediateResponseSection />
      <QualificationSection />
      <VoiceHandoffSection />
      <AppointmentSection />
      <SalesAssistSection />
      <AttributionSection />
      <LearningSection />
      <ReactivationSection />
      <ExecutiveViewSection />
      <GovernanceSection />
      <IntegrationsSection />

      <ProductCta
        title="Map your lead-to-revenue journey."
        lede="Bring your current path from first touch to closed sale. In thirty minutes we mark every point where the thread breaks, and show what the Revenue Engine would do instead."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
