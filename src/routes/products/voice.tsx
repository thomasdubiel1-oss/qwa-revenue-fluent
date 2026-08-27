import { createFileRoute } from "@tanstack/react-router";
import { VoiceAgentStory } from "@/components/qwa/story/product-stories";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
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
      { property: "og:url", content: "https://qwa-revenue-fluent.lovable.app/products/voice" },
    ],
    links: [{ rel: "canonical", href: "https://qwa-revenue-fluent.lovable.app/products/voice" }],
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
        secondaryHref="#conversation"
        note="One record. Four surfaces. No restarts."
        visual={<VoiceAgentStory />}
      />

      <ChapterOpener
        id="conversation"
        index="01"
        label="Immediate conversation"
        title="Answered in seconds, continued in context."
        lede="Voice, SMS, DM and web chat are one thread. QWA responds while intent is alive, recognizes who is calling before the greeting, qualifies need and urgency inside the conversation, and follows up only in the channels and hours a customer consented to."
      />
      <InboundVoiceSection />
      <OutboundSection />

      <ChapterOpener
        id="handoff"
        index="02"
        label="Handoff and appointment"
        title="The moment it should become a person, it does."
        lede="Escalation rules you author, takeover in one action from any channel including live voice, a booking made against the real calendar before the call ends, and a rep who arrives already briefed on everything said before them."
        tone="paper"
      />
      <TakeoverSection />
      <VoiceBookingSection />
      <PreCallBriefSection />

      <ChapterOpener
        id="outcome"
        index="03"
        label="Outcome and learning"
        title="Conversations measured in revenue, not minutes."
        lede="Each conversation ends as structured data — disposition, fields, next best action — and that outcome travels into appointment, sale, attribution and reactivation, so the system learns from what closed rather than from how much it talked."
      />
      <SummarySection />
      <ConversationAnalyticsSection />

      <ChapterOpener
        id="enterprise"
        index="04"
        label="Enterprise readiness"
        title="Permission, auditability and the systems you already run."
        lede="Speaking on your behalf is granted, scoped and logged. QWA connects through adapters to your telephony, messaging and record systems, and stays model- and provider-neutral."
        quiet
      />
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
