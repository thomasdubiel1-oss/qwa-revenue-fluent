import { createFileRoute } from "@tanstack/react-router";
import { DecisionIntelligenceStory } from "@/components/qwa/story/product-stories";
import { productHead } from "@/lib/seo/page-heads";
import {
  ChapterOpener,
  ProductCta,
  ProductHero,
  ProductShell,
  RelatedProducts,
} from "@/components/qwa/product/primitives";
import {
  ApprovalSection,
  AutonomyLadderSection,
  DecisionBriefSection,
  DecisionGovernanceSection,
  DecisionHistorySection,
  DetectSection,
  ExperimentSection,
  GuardrailSection,
  NextBestActionSection,
  ScenarioSection,
} from "@/components/qwa/product/decision-intelligence-sections";

const title = "Decision Intelligence — QWA";
const description =
  "Next best action per record, a five-level autonomy ladder, experiments with holdouts, hard guardrails and a decision log where every change has an author, a reason and an outcome.";

export const Route = createFileRoute("/products/decision-intelligence")({
  head: () =>
    productHead({ path: "/products/decision-intelligence", name: "Decision Intelligence", title, description }),
  component: DecisionIntelligencePage,
});

function DecisionIntelligencePage() {
  return (
    <ProductShell>
      <ProductHero
        eyebrow="Decision Intelligence"
        title="Autonomy you grant deliberately, and can withdraw instantly."
        lede="QWA proposes the next action for every record and every budget line, with its inputs, its bounds and the alternative it rejected. How much it may do on its own is set per decision type — and every change it makes is logged, measured and reversible."
        secondaryLabel="See how a decision is made"
        secondaryHref="#detect-chapter"
        note="Bounded. Reversible. Named owner on every decision."
        visual={<DecisionIntelligenceStory />}
      />

      <ChapterOpener
        id="detect-chapter"
        index="01"
        label="Detect and frame"
        title="A decision starts as evidence, not as an idea."
        lede="Material opportunities and problems surface from the same governed business and revenue graph the reporting layer reads. Each one is written up as a case — what was observed, over what population, how stable it is, and how confident the reading is."
      />
      <DetectSection />

      <ChapterOpener
        id="propose"
        index="02"
        label="Propose and simulate"
        title="A recommendation with its range, its cost and its alternatives."
        lede="The proposal names the action, the assumptions it rests on, the bounds it would run inside and the expected effect as a range. The options that were not chosen are shown alongside it, including doing nothing."
        tone="paper"
      />
      <DecisionBriefSection />
      <ScenarioSection />
      <NextBestActionSection />

      <ChapterOpener
        id="govern"
        index="03"
        label="Guardrails and approval"
        title="Authority is granted per decision type, and withdrawn in one change."
        lede="Spend ceilings, rate limits, blast radius, stop conditions and a tested reversal path are set before anything can run. A named person approves inside a defined envelope, and how much the system may do on its own is set decision by decision."
      />
      <GuardrailSection />
      <ApprovalSection />
      <AutonomyLadderSection />

      <ChapterOpener
        id="learn"
        index="04"
        label="Execute, measure, learn"
        title="Result against expectation, on the record."
        lede="Approved decisions become bounded actions, their outcomes are attributed on the same graph that produced the evidence, and each result is compared to what was expected. Reversals stay visible — a rolled-back decision is a finding, not an embarrassment."
      />
      <ExperimentSection />
      <DecisionHistorySection />

      <ChapterOpener
        index="05"
        label="Enterprise"
        title="Audit history, policy layer and provider neutrality."
        lede="Permissions, policy, full decision history and the record of who granted which authority stay with your team. Adapters connect the systems you already run, and the reasoning layer is not locked to a single model or vendor."
        tone="paper"
        quiet
      />
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
