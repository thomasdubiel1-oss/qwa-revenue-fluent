import { createFileRoute } from "@tanstack/react-router";
import { RevenueEngineStory } from "@/components/qwa/story/product-stories";
import { RevenueEngine } from "@/components/qwa/revenue-engine";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
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
        visual={<RevenueEngineStory />}
      />

      <RevenueEngine
        id="loop"
        eyebrow="The ten-stage loop"
        title="One lead, followed end to end."
        lede="Ten stages, one record. Scroll once and you have the whole operating loop — from the first signal to the revenue travelling back to the campaign that produced it."
      />

      <ChapterOpener
        id="response"
        index="01"
        label="Response"
        title="The first ten minutes decide the deal."
        lede="Speed and judgement, in the same conversation. QWA replies while intent is still alive, then works out who this is and where they belong before a human spends a minute on them."
      />
      <ImmediateResponseSection />
      <QualificationSection />

      <ChapterOpener
        id="conversation"
        index="02"
        label="Conversation"
        title="From reply to a rep in the room."
        lede="One thread across voice, SMS and DM, ending in an appointment that holds — and a salesperson who arrives already briefed on everything said before them."
      />
      <VoiceHandoffSection />
      <AppointmentSection />
      <SalesAssistSection />

      <AttributionSection />
      <LearningSection />

      <ChapterOpener
        id="recovery"
        index="04"
        label="Recovery"
        title="Nothing paid for is left dormant."
        lede="Leads that went quiet stay on the same record. When intent returns, the engine re-enters the journey where it stopped rather than starting a new one."
      />
      <ReactivationSection />

      <ChapterOpener
        id="enterprise"
        index="05"
        label="Enterprise readiness"
        title="Run it in your business, on your terms."
        lede="The reporting a revenue leader reads, the controls your team holds, and the adapter layer that lets QWA sit alongside the systems you already run."
        quiet
      />
      <ExecutiveViewSection />
      <GovernanceSection />
      <IntegrationsSection />


      <RelatedProducts current="revenue-engine" />

      <ProductCta
        title="Map your lead-to-revenue journey."
        lede="Bring your current path from first touch to closed sale. In thirty minutes we mark every point where the thread breaks, and show what the Revenue Engine would do instead."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
