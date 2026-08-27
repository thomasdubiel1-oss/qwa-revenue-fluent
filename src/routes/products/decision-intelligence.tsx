import { createFileRoute } from "@tanstack/react-router";
import { DecisionIntelligenceStory } from "@/components/qwa/story/product-stories";
import { ProductCta, ProductHero, ProductShell, RelatedProducts } from "@/components/qwa/product/primitives";
import {
  AutonomyLadderSection,
  DecisionGovernanceSection,
  DecisionHistorySection,
  ExperimentSection,
  GuardrailSection,
  NextBestActionSection,
} from "@/components/qwa/product/decision-intelligence-sections";

const title = "Decision Intelligence — QWA";
const description =
  "Next best action per record, a five-level autonomy ladder, experiments with holdouts, hard guardrails and a decision log where every change has an author, a reason and an outcome.";

export const Route = createFileRoute("/products/decision-intelligence")({
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
  component: DecisionIntelligencePage,
});

function DecisionIntelligencePage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Decision Intelligence"
        title="Autonomy you grant deliberately, and can withdraw instantly."
        lede="QWA proposes the next action for every record and every budget line, with its inputs, its bounds and the alternative it rejected. How much it may do on its own is set per decision type — and every change it makes is logged, measured and reversible."
        secondaryLabel="See the autonomy ladder"
        secondaryHref="#autonomy"
        note="Bounded. Reversible. Named owner on every decision."
        visual={<DecisionIntelligenceStory />}
      />

      <NextBestActionSection />
      <AutonomyLadderSection />
      <ExperimentSection />
      <GuardrailSection />
      <DecisionHistorySection />
      <DecisionGovernanceSection />

      <RelatedProducts current="decision-intelligence" />

      <ProductCta
        title="Start at recommend. Move one decision when the evidence earns it."
        lede="We map your highest-frequency revenue decision, the bounds it would need, and the evidence that would justify letting the system act inside them."
        note="No sales sequence. A reply within one business day."
      />
    </ProductShell>
  );
}
