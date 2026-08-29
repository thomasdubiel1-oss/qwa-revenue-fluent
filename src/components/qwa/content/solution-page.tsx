import {
  ContentCta,
  ContentHero,
  ContentPage,
  ContentSection,
  CardGrid,
  FaqSection,
  PointList,
  RelatedLinks,
  StepList,
} from "./content-page";
import { solutions, type SolutionSlug } from "@/content/solutions";

/**
 * Shared rendering for solution pages. The structure is consistent so the set
 * reads as one system; every word of the content is unique per page and lives
 * in src/content/solutions.ts.
 */
export function SolutionPageView({ slug }: { slug: SolutionSlug }) {
  const content = solutions[slug];
  const path = `/solutions/${slug}`;

  return (
    <ContentPage>
      <ContentHero
        eyebrow={content.eyebrow}
        title={content.h1}
        answer={content.answer}
        support={content.support}
        trail={[
          { name: "Home", path: "/" },
          { name: content.navLabel, path },
        ]}
        analyticsSource={`solution_${slug}_hero`}
      />

      <ContentSection
        id="problem"
        eyebrow="The problem"
        heading={content.problem.heading}
        lede={content.problem.lede}
        tone="paper"
      >
        <PointList points={content.problem.points} />
      </ContentSection>

      <ContentSection
        id="workflow"
        eyebrow="Workflow"
        heading={content.workflow.heading}
        lede={content.workflow.lede}
      >
        <StepList steps={content.workflow.steps} />
      </ContentSection>

      <ContentSection
        id="use-cases"
        eyebrow="Use cases"
        heading={content.useCases.heading}
        lede={content.useCases.lede}
        tone="paper"
      >
        <CardGrid items={content.useCases.items} />
      </ContentSection>

      <ContentSection
        id="integrations"
        eyebrow="Integration context"
        heading={content.integration.heading}
        lede={content.integration.lede}
      >
        <CardGrid items={content.integration.items} columns={2} />
      </ContentSection>

      <ContentSection
        id="considerations"
        eyebrow="Before you roll out"
        heading={content.considerations.heading}
        lede={content.considerations.lede}
      >
        <PointList points={content.considerations.points} />
      </ContentSection>

      <FaqSection faqs={content.faqs} />

      <RelatedLinks links={content.related} />

      <ContentCta
        title={content.cta.title}
        lede={content.cta.lede}
        note={content.cta.note}
        analyticsSource={`solution_${slug}_cta`}
      />
    </ContentPage>
  );
}
