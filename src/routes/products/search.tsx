import { createFileRoute } from "@tanstack/react-router";
import { ProductCta, ProductHero, ProductShell } from "@/components/qwa/product/primitives";
import {
  ArchitectureSection,
  DiagnosticsSection,
  DiscoveryGraphVisual,
  GeoSection,
  IntentSection,
  MonitoringSection,
  ProductionSection,
  SearchGovernanceSection,
} from "@/components/qwa/product/search-sections";

const title = "Search & Answer Optimization — QWA";
const description =
  "Technical diagnostics, topical authority mapping, intent-to-revenue joins and generative answer readiness — search work measured by pipeline, not by position alone.";

export const Route = createFileRoute("/products/search")({
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
  component: SearchPage,
});

function SearchPage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Search & Answer Optimization"
        title="Be findable by people and by the systems answering for them."
        lede="QWA maps the demand you want, fixes what is blocking discovery, builds the authority to earn it, and joins every session to the conversations and revenue that followed. Rankings are a means; pipeline is the measure."
        secondaryLabel="See answer readiness"
        secondaryHref="#geo"
        note="No ranking guarantees. Human approval before publication."
        visual={<DiscoveryGraphVisual />}
      />

      <DiagnosticsSection />
      <ArchitectureSection />
      <IntentSection />
      <GeoSection />
      <ProductionSection />
      <MonitoringSection />
      <SearchGovernanceSection />

      <ProductCta
        title="Bring the queries you should own and don't."
        lede="We map one cluster end to end — what is blocking it, what would earn it, and what it would be worth if it converted at your current rates."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
