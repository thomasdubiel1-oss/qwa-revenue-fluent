import { createFileRoute } from "@tanstack/react-router";
import { LiveCommerceStory } from "@/components/qwa/story/product-stories";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
import {
  AudienceSignalSection,
  CheckoutSection,
  CommerceGovernanceSection,
  HostConsoleSection,
  HostCopilotSection,
  LiveAttributionSection,
  LiveHandoffSection,
  OfferSection,
  PostStreamSection,
  ResponseSection,
} from "@/components/qwa/product/live-commerce-sections";

const title = "Live Commerce — QWA";
const description =
  "Read the room in real time: classified audience signal, instant answers, bounded offer windows, checkout continuity and a host console that keeps a person in control.";

export const Route = createFileRoute("/products/live-commerce")({
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
  component: LiveCommercePage,
});

function LiveCommercePage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Live Commerce"
        title="Sell in the moment, without losing the record."
        lede="Questions, intent and hesitation in a live room are read as they happen. QWA answers, opens bounded offers, keeps checkout inside the moment, and writes everything back to the customer record so the session keeps working after the stream ends."
        secondaryLabel="See how it works"
        secondaryHref="#capture"
        note="Inventory-aware. Margin-bounded. Host can stop anything."
        visual={<LiveCommerceStory />}
      />

      <ChapterOpener
        id="capture"
        index="01"
        label="Live signal capture"
        title="A live room is a stream of intent, read as it happens."
        lede="Comments, questions, product views, cart events, DMs and host cues are classified in real time and attached to a viewer record. The room stops being a broadcast and becomes an input the rest of the business can act on."
      />
      <AudienceSignalSection />

      <ChapterOpener
        id="selling"
        index="02"
        label="Host + AI selling"
        title="The person on camera stays in charge."
        lede="QWA answers what it is allowed to answer, gives the host product context, objection framing and product-switch suggestions, and escalates anything sensitive. Assistance is rate-limited and visible before it fires — the host can stop any of it."
      />
      <ResponseSection />
      <HostCopilotSection />
      <HostConsoleSection />
      <OfferSection />

      <ChapterOpener
        id="conversion"
        index="03"
        label="Conversion"
        title="Intent moves to checkout without losing the moment."
        lede="Cart and checkout happen against your commerce system while the viewer stays in the room. Where a purchase is not the right next step, the path out — DM, appointment or follow-up — carries the same session, product and offer context."
        tone="paper"
      />
      <CheckoutSection />
      <LiveHandoffSection />

      <ChapterOpener
        id="revenue"
        index="04"
        label="Revenue + reactivation"
        title="Every order traced to the moment that produced it."
        lede="Purchases and later conversions are credited to the segment, host, product and offer window that contributed. When the room closes, viewers, carts and questions keep working — clips, content topics and behaviour-based follow-up all come out of the same session record."
      />
      <LiveAttributionSection />
      <PostStreamSection />

      <ChapterOpener
        index="05"
        label="Enterprise"
        title="Moderation, offer controls and human override."
        lede="Discount policy, claim boundaries, disclosure, permissions and inventory truth are held by your team, not the engine. Every decision made in the room is recorded and reviewable, and adapters keep the work neutral to the platform you stream on."
        tone="paper"
        quiet
      />
      <CommerceGovernanceSection />

      <RelatedProducts current="live-commerce" />

      <ProductCta
        title="Bring one stream that should have sold more."
        lede="We walk the room through QWA — the signal it would have read, the answers it would have given, the offers it would have been allowed to make — and where your host stays in control."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
