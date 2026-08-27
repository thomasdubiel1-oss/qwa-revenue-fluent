import { createFileRoute } from "@tanstack/react-router";
import { ProductCta, ProductHero, ProductShell } from "@/components/qwa/product/primitives";
import {
  AudienceSignalSection,
  CheckoutSection,
  CommerceGovernanceSection,
  HostConsoleSection,
  LiveRoomVisual,
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
        secondaryLabel="See offer rules"
        secondaryHref="#offers"
        note="Inventory-aware. Margin-bounded. Host can stop anything."
        visual={<LiveRoomVisual />}
      />

      <AudienceSignalSection />
      <ResponseSection />
      <OfferSection />
      <CheckoutSection />
      <HostConsoleSection />
      <PostStreamSection />
      <CommerceGovernanceSection />

      <ProductCta
        title="Bring one stream that should have sold more."
        lede="We walk the room through QWA — the signal it would have read, the answers it would have given, the offers it would have been allowed to make — and where your host stays in control."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
