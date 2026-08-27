import { createFileRoute } from "@tanstack/react-router";
import { ProductCta, ProductHero, ProductShell } from "@/components/qwa/product/primitives";
import {
  BriefSection,
  CreativeFeedbackSection,
  CreativeGovernanceSection,
  ProductionPipelineVisual,
  ProviderRoutingSection,
  QualitySection,
  ShotDecompositionSection,
  VariantSection,
} from "@/components/qwa/product/creative-studio-sections";

const title = "Creative Studio — QWA";
const description =
  "Production as a pipeline: brief, script, shot decomposition, model-agnostic provider routing, versioned variants for every placement, and human approval before anything publishes.";

export const Route = createFileRoute("/products/creative-studio")({
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
  component: CreativeStudioPage,
});

function CreativeStudioPage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Creative Studio"
        title="Production that runs like a pipeline, not a scramble."
        lede="A brief enters. Script, shots, provider routing, assembly and review follow in order. What leaves is versioned, on-brand, approved by a named person and measured against the revenue it produced."
        secondaryLabel="See provider routing"
        secondaryHref="#routing"
        note="Model-agnostic. Human-gated. Fully versioned."
        visual={<ProductionPipelineVisual />}
      />

      <BriefSection />
      <ShotDecompositionSection />
      <ProviderRoutingSection />
      <VariantSection />
      <QualitySection />
      <CreativeFeedbackSection />
      <CreativeGovernanceSection />

      <ProductCta
        title="Bring one campaign you never had time to make."
        lede="We walk the brief through the pipeline together — script, shots, routing, variants and the approval gate — and you see exactly where your team stays in control."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
