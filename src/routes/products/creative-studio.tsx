import { createFileRoute } from "@tanstack/react-router";
import { CreativeAcquisitionStory } from "@/components/qwa/story/product-stories";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
import {
  BriefSection,
  CreativeDistributionSection,
  CreativeFeedbackSection,
  CreativeGovernanceSection,
  CreativeHandoffSection,
  CreativeLearningSection,
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
        secondaryLabel="See how it works"
        secondaryHref="#brief-chapter"
        note="Model-agnostic. Human-gated. Fully versioned."
        visual={<CreativeAcquisitionStory />}
      />

      <ChapterOpener
        id="brief-chapter"
        index="01"
        label="The brief"
        title="Every asset starts from one controlled brief."
        lede="The offer, the audience, the brand system, the claims your legal team allows and the requirements of each channel are captured once, as structured constraints. Nothing produced downstream can drift from them without a person deciding it should."
      />
      <BriefSection />

      <ChapterOpener
        index="02"
        label="Production"
        title="Produced across providers, held to the same constraints."
        tone="paper"
        lede="The script becomes shots, each shot is routed to the provider best suited to it, and every cut and variant is versioned. Providers are interchangeable adapters; the brief, the brand rules and the human approval gate are not."
      />
      <ShotDecompositionSection />
      <ProviderRoutingSection />
      <VariantSection />
      <QualitySection />

      <ChapterOpener
        id="distribution-chapter"
        index="03"
        label="Distribution"
        title="Approved creative becomes qualified conversations."
        lede="Cleared variants are released into paid, organic, email, messaging and live channels carrying their version and tracking. The response arrives in the Revenue Engine identified, and is answered while intent is still alive."
      />
      <CreativeDistributionSection />
      <CreativeHandoffSection />

      <ChapterOpener
        id="intelligence"
        index="04"
        label="Intelligence"
        title="Creative is judged on revenue, then rewritten."
        lede="Outcomes return from Acquisition and the Revenue Engine, so a variant is measured by the qualified pipeline and closed revenue behind it rather than by views. What performed becomes the starting structure of the next brief."
      />
      <CreativeFeedbackSection />
      <CreativeLearningSection />

      <ChapterOpener
        index="05"
        label="Enterprise"
        title="Provenance, permission and provider neutrality."
        tone="paper"
        quiet
        lede="Every cut retains its prompt, version and named approval. Permissions, claim policy, rights, retention and disclosure stay under your control, and no part of the pipeline is locked to a single model or vendor."
      />
      <CreativeGovernanceSection />

      <RelatedProducts current="creative-studio" />

      <ProductCta
        title="Bring one campaign you never had time to make."
        lede="We walk the brief through the pipeline together — script, shots, routing, variants and the approval gate — and you see exactly where your team stays in control."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
