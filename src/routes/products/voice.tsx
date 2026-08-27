import { createFileRoute } from "@tanstack/react-router";
import { VoiceAgentStory } from "@/components/qwa/story/product-stories";
import { ProductCta, ProductHero, ProductShell, RelatedProducts } from "@/components/qwa/product/primitives";
import {
  ConversationAnalyticsSection,
  InboundVoiceSection,
  OutboundSection,
  PreCallBriefSection,
  SummarySection,
  TakeoverSection,
  VoiceBookingSection,
  VoiceGovernanceSection,
  VoiceIntegrationsSection,
} from "@/components/qwa/product/voice-sections";

const title = "Voice + Conversations — QWA";
const description =
  "A persistent, context-aware AI conversation layer across voice, SMS, email, DM and web chat — one record, human takeover at any moment, and every call written back as structured data.";

export const Route = createFileRoute("/products/voice")({
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
  component: VoicePage,
});

function VoicePage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Voice + Conversations"
        title="Every conversation continues where the last one left off."
        lede="Voice, SMS, email, DM and web chat run on one customer record. QWA answers on the first ring, remembers what was promised, follows the rules you set and hands a live conversation to a person the moment it should."
        secondaryLabel="See the continuity"
        secondaryHref="#inbound-voice"
        note="One record. Four surfaces. No restarts."
        visual={<VoiceAgentStory />}
      />

      <InboundVoiceSection />
      <OutboundSection />
      <TakeoverSection />
      <VoiceBookingSection />
      <SummarySection />
      <PreCallBriefSection />
      <ConversationAnalyticsSection />
      <VoiceGovernanceSection />
      <VoiceIntegrationsSection />

      <RelatedProducts current="voice" />

      <ProductCta
        title="Hear what your customers hear today."
        lede="Bring one real inbound path — a missed call, a form reply, an abandoned chat. In thirty minutes we show where the thread breaks and what the conversation layer would do instead."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
