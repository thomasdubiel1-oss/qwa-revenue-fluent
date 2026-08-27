import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/config/seo";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
import {
  ArchitectureSection,
  DiagnosticsSection,
  DiscoveryDemandSection,
  DiscoveryGraphVisual,
  DiscoveryRevenueSection,
  GeoSection,
  IntentSection,
  MonitoringSection,
  ProductionSection,
  SearchGovernanceSection,
  SurfaceMapSection,
} from "@/components/qwa/product/search-sections";

const title = "Search & Answer Optimization — QWA";
const description =
  "Technical diagnostics, topical authority mapping, intent-to-revenue joins and generative answer readiness — search work measured by pipeline, not by position alone.";

export const Route = createFileRoute("/products/search")({
  head: () => pageHead({ path: "/products/search", title, description }),
  component: SearchPage,
});

function SearchPage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Search & Answer Optimization"
        title="Be findable by people and by the systems answering for them."
        lede="QWA maps the demand you want, fixes what is blocking discovery, builds the authority to earn it, and joins every session to the conversations and revenue that followed. Rankings are a means; pipeline is the measure."
        secondaryLabel="See how it works"
        secondaryHref="#discovery"
        note="No ranking guarantees. Human approval before publication."
        visual={<DiscoveryGraphVisual />}
      />

      <ChapterOpener
        id="discovery"
        index="01"
        label="Discovery map"
        title="Know exactly how buyers find your category."
        lede="Search, maps, answer engines, assistants and the sources they quote are mapped as one picture. QWA records what each surface understands about you, what is blocking discovery, where the authority map is thin, and which intent clusters are worth owning."
      />
      <SurfaceMapSection />
      <DiagnosticsSection />
      <ArchitectureSection />
      <IntentSection />

      <ChapterOpener
        index="02"
        label="Execution"
        title="Pages and entities built to be understood and cited."
        lede="Content, structured data and entity signals are produced against the brief and the authority map, with sources attached. Factual and brand review are separate recorded approvals, and publication stops at a person unless your team decides otherwise."
      />
      <GeoSection />
      <ProductionSection />

      <ChapterOpener
        id="visibility"
        index="03"
        label="Qualified demand"
        title="Visibility measured in conversations, not impressions."
        lede="Where a source is connected, presence is tracked per cluster and page. What matters more is what followed: the session becomes a conversation in the Revenue Engine with the cluster, page and surface that earned it attached."
        tone="paper"
      />
      <MonitoringSection />
      <DiscoveryDemandSection />

      <ChapterOpener
        id="revenue"
        index="04"
        label="Revenue"
        title="Discovery traced to closed revenue, then reinvested."
        lede="Clusters, pages, entities and surfaces are followed through lead, appointment and closed-won, so investment moves toward the topics that produce customers rather than the ones that produce traffic."
      />
      <DiscoveryRevenueSection />

      <ChapterOpener
        index="05"
        label="Enterprise"
        title="Approvals, provenance and provider neutrality."
        tone="paper"
        quiet
        lede="Editorial and factual approval, source quality, full change history and controls over autonomous publishing stay with your team. Adapters connect to the systems and data sources you already run, and no part of the work is locked to a single search or model provider."
      />
      <SearchGovernanceSection />

      <RelatedProducts current="search" />

      <ProductCta
        title="Bring the queries you should own and don't."
        lede="We map one cluster end to end — what is blocking it, what would earn it, and what it would be worth if it converted at your current rates."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
