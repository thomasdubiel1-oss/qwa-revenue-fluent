import { createFileRoute } from "@tanstack/react-router";

import {
  ComparisonTable,
  ContentCta,
  ContentHero,
  ContentPage,
  ContentSection,
  CardGrid,
  FaqSection,
  PointList,
  RelatedLinks,
  StepList,
  type Faq,
} from "@/components/qwa/content/content-page";
import { pageHead } from "@/config/seo";
import { articleSchema, breadcrumbSchema, faqPageSchema } from "@/lib/seo/jsonld";

const PATH = "/resources/what-is-an-ai-revenue-engine";
const TITLE = "What Is an AI Revenue Engine? Definition and How It Works | QWA";
const DESCRIPTION =
  "An AI revenue engine is a closed-loop system that acquires, engages, converts, attributes and learns from every customer signal. How it works, and how it differs from a CRM, marketing automation, call tracking and point AI tools.";

const faqs: Faq[] = [
  {
    question: "What is an AI revenue engine in one sentence?",
    answer:
      "It is a system that connects demand generation, customer conversations, conversion, attribution and decision-making onto one customer record, uses AI to act inside that loop, and feeds every outcome back so the next decision is better informed.",
  },
  {
    question: "Is an AI revenue engine just a CRM with AI features?",
    answer:
      "No. A CRM is a system of record that stores what people entered; an AI revenue engine is a system of action that produces the record as a by-product of running the loop. Most implementations keep the CRM as the system of record and reconcile against it.",
  },
  {
    question: "How is it different from marketing automation?",
    answer:
      "Marketing automation executes predefined sequences against a contact list. A revenue engine also handles live two-way conversations, books outcomes, joins those outcomes to spend, and changes subsequent decisions based on what closed rather than on what was opened or clicked.",
  },
  {
    question: "Do we still need call tracking?",
    answer:
      "Call tracking supplies an input — which campaign produced which call. A revenue engine consumes that input and joins it forward to the appointment, the sale and the reconciled revenue, which call tracking alone does not do.",
  },
  {
    question: "What does closed-loop actually mean here?",
    answer:
      "It means the outcome of an action returns to the place the action was decided. Closed revenue informs acquisition, creative, routing and reactivation, instead of being reported once and discarded.",
  },
  {
    question: "Does it replace our existing stack?",
    answer:
      "Typically not. It connects to ad platforms, telephony, CRM, scheduling, commerce and finance through adapters. The value comes from joining those systems onto one record, not from replacing them.",
  },
  {
    question: "What has to be true before it works?",
    answer:
      "Identity has to resolve across channels, the systems of record have to be connected, and the business needs a written definition of a qualified lead. Without those three, automation accelerates an unclear process rather than improving it.",
  },
];

const loop: { title: string; detail: string }[] = [
  {
    title: "Acquire",
    detail:
      "Demand is generated and captured across paid, organic, outbound and referral, with source, campaign and creative identifiers attached to the signal from the first moment.",
  },
  {
    title: "Engage",
    detail:
      "Every signal receives an immediate, relevant response on the channel it arrived on — call, text, chat, form or message — and the conversation continues on one thread rather than restarting per channel.",
  },
  {
    title: "Convert",
    detail:
      "Qualification, booking and handoff turn interest into a scheduled or completed commercial outcome, with the qualification answers preserved for whoever takes it next.",
  },
  {
    title: "Attribute",
    detail:
      "Touches are joined into one journey, an explicit contribution model distributes credit, and attributed revenue is reconciled against the revenue actually booked in the system of record.",
  },
  {
    title: "Predict",
    detail:
      "Patterns in the joined record — response times, source quality, conversion intervals — become forecasts and expectations that can be checked against what subsequently happened.",
  },
  {
    title: "Decide",
    detail:
      "Explicit, inspectable rules and models turn those expectations into recommended actions: where to spend, which leads to prioritise, which conversation to have next.",
  },
  {
    title: "Execute",
    detail:
      "Approved decisions are carried out within defined limits — modes, cooldowns and stop conditions — with a human able to approve, override or halt any of them.",
  },
  {
    title: "Learn",
    detail:
      "Outcomes are written back to the record, so the model, the rules and the operator all see whether the decision worked. This is the step that makes it a loop rather than a pipeline.",
  },
];

export const Route = createFileRoute("/resources/what-is-an-ai-revenue-engine")({
  head: () =>
    pageHead({
      path: PATH,
      title: TITLE,
      description: DESCRIPTION,
      type: "article",
      jsonLd: [
        articleSchema({
          headline: "What is an AI revenue engine?",
          path: PATH,
          description: DESCRIPTION,
        }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "What is an AI revenue engine?", path: PATH },
        ]),
        // Identical to the FAQ rendered below.
        faqPageSchema(faqs),
      ],
    }),
  component: ExplainerPage,
});

function ExplainerPage() {
  return (
    <ContentPage>
      <ContentHero
        eyebrow="Resource · Explainer"
        title="What is an AI revenue engine?"
        answer="An AI revenue engine is a closed-loop system that connects demand generation, customer conversations, conversion, revenue attribution and decision-making onto a single customer record, uses AI to act at each stage, and feeds every outcome back into the next decision. Unlike a CRM, which stores what happened, a revenue engine is responsible for making the next thing happen and for measuring whether it worked."
        support="The term is used loosely. This page sets out a specific, testable definition: the eight stages the loop has to contain, what breaks when a stage is missing, and how the category differs from the tools it is most often confused with."
        trail={[
          { name: "Home", path: "/" },
          { name: "What is an AI revenue engine?", path: PATH },
        ]}
        analyticsSource="resource_revenue_engine_hero"
      />

      <ContentSection
        id="definition"
        eyebrow="Definition"
        heading="The three conditions that make it an engine"
        lede="A stack of AI tools is not a revenue engine. Three properties separate the two, and all three have to hold at once."
        tone="paper"
      >
        <PointList
          points={[
            "One record. Every signal, conversation, appointment and outcome for a buyer resolves to a single record, across channels, sessions and devices. Without this, nothing downstream can be joined.",
            "Action, not just storage. The system is responsible for the next action — the reply, the qualification, the booking, the follow-up — rather than waiting for a person to read a dashboard and decide.",
            "A closed loop. Outcomes return to the point of decision. Revenue that closed changes what gets spent, prioritised and said next, instead of being reported once and archived.",
          ]}
        />
      </ContentSection>

      <ContentSection
        id="loop"
        eyebrow="The loop"
        heading="Acquire → Engage → Convert → Attribute → Predict → Decide → Execute → Learn"
        lede="Each stage consumes what the previous one produced. A missing stage does not slow the loop down; it opens it, and an open loop is just a pipeline with extra reporting."
      >
        <StepList steps={loop} />
      </ContentSection>

      <ContentSection
        id="failure-modes"
        eyebrow="Failure modes"
        heading="What it looks like when a stage is missing"
        lede="Each of these is a common stack, and each fails in a predictable way."
        tone="paper"
      >
        <CardGrid
          items={[
            {
              title: "No Engage",
              detail:
                "Demand is generated and then queued. Leads wait hours for a first reply, and campaign performance is judged on cost per lead because nothing downstream is measurable.",
            },
            {
              title: "No Attribute",
              detail:
                "Conversations and bookings happen, but budget decisions are made from platform-reported conversions, so the same sale is claimed several times and offline closes vanish.",
            },
            {
              title: "No Learn",
              detail:
                "Decisions are made and executed, but outcomes never return. The system repeats the same allocation regardless of what closed, and improvement depends on someone noticing.",
            },
            {
              title: "No single record",
              detail:
                "Each tool holds part of the buyer. A call, a form and a DM from one person look like three leads, and every join downstream is guesswork.",
            },
          ]}
          columns={2}
        />
      </ContentSection>

      <ContentSection
        id="comparison"
        eyebrow="Comparison"
        heading="How it differs from the tools it gets confused with"
        lede="These categories are complements, not competitors. The distinction is what each is responsible for."
      >
        <ComparisonTable
          caption="Comparison of an AI revenue engine with a CRM, marketing automation, call tracking and point AI tools"
          columns={["Category", "Primary responsibility", "What it does not do"]}
          rows={[
            [
              "AI revenue engine",
              "Runs and closes the loop: engages every signal, converts it, joins it to revenue and changes the next decision.",
              "Does not replace your ledger, your calendar or your ad platforms — it connects and reconciles against them.",
            ],
            [
              "CRM",
              "System of record for contacts, pipeline stages and history entered by people.",
              "Does not act on signals in real time, and cannot state which spend produced the revenue it holds.",
            ],
            [
              "Marketing automation",
              "Executes predefined campaigns and sequences against segments and lists.",
              "Does not hold live two-way conversations, resource a booking, or reconcile outcomes to closed revenue.",
            ],
            [
              "Call tracking",
              "Attributes inbound calls to the campaign, keyword or source that produced them.",
              "Does not carry the call forward to the appointment, the sale or the reconciled revenue figure.",
            ],
            [
              "Point AI tools",
              "Solve one task well — a chat widget, a note summariser, a copy generator, a voice bot.",
              "Do not share a record, so the outcome of one tool is invisible to the decisions made by the others.",
            ],
          ]}
        />
      </ContentSection>

      <ContentSection
        id="evaluating"
        eyebrow="Evaluating"
        heading="Questions worth asking any vendor in this category"
        lede="These separate a genuine loop from a bundle of features, and none of them require a benchmark to answer."
        tone="paper"
      >
        <PointList
          points={[
            "Show me one buyer's record end to end: first touch, every conversation, the appointment, the sale, and the reconciliation against the ledger.",
            "What share of revenue can you actually join, and where is that coverage figure displayed?",
            "Which attribution model is in use, can I change it, and does the model travel with the number?",
            "What can the system do without a human approving it, and what are the limits, cooldowns and stop conditions?",
            "When an automated action is taken, where is it recorded, and can I see why it was chosen?",
            "What happens to revenue you cannot attribute — is it reported, or redistributed into the channels that can be measured?",
          ]}
        />
      </ContentSection>

      <FaqSection faqs={faqs} />

      <RelatedLinks
        links={[
          {
            label: "Revenue Engine",
            href: "/products/revenue-engine",
            detail: "The QWA implementation of the loop described on this page.",
          },
          {
            label: "Revenue attribution",
            href: "/solutions/revenue-attribution",
            detail: "The Attribute stage in operational detail.",
          },
          {
            label: "AI lead response",
            href: "/solutions/ai-lead-response",
            detail: "The Engage stage, where most loops break first.",
          },
          {
            label: "Decision Intelligence",
            href: "/products/decision-intelligence",
            detail: "Decide and Execute, with limits and human control.",
          },
          {
            label: "Business Intelligence",
            href: "/products/business-intelligence",
            detail: "Where Learn becomes something a leadership team can read.",
          },
          {
            label: "AI voice agent",
            href: "/solutions/ai-voice-agent",
            detail: "Engage on the channel most systems still treat as separate.",
          },
        ]}
      />

      <ContentCta
        title="See the loop running on a real record."
        lede="We follow one signal from first touch through conversation, booking, closed revenue and reconciliation — and show where the loop opens today."
        note="No sales sequence. A reply within one business day."
        analyticsSource="resource_revenue_engine_cta"
      />
    </ContentPage>
  );
}
