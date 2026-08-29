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
import { industries, type IndustrySlug } from "@/content/industries";

/**
 * Shared rendering for industry pages. Structure is consistent across the set;
 * every sentence is industry-specific and lives in src/content/industries.ts.
 */
export function IndustryPageView({ slug }: { slug: IndustrySlug }) {
  const content = industries[slug];
  const path = `/industries/${slug}`;

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
        analyticsSource={`industry_${slug}_hero`}
      />

      <ContentSection
        id="lead-sources"
        eyebrow="Lead sources"
        heading={content.leadSources.heading}
        lede={content.leadSources.lede}
        tone="paper"
      >
        <CardGrid items={content.leadSources.items} />
      </ContentSection>

      <ContentSection
        id="speed-to-lead"
        eyebrow="Speed to lead"
        heading={content.speed.heading}
        lede={content.speed.lede}
      >
        <PointList points={content.speed.points} />
      </ContentSection>

      <ContentSection
        id="booking"
        eyebrow="Appointment flow"
        heading={content.booking.heading}
        lede={content.booking.lede}
        tone="paper"
      >
        <StepList steps={content.booking.steps} />
      </ContentSection>

      <ContentSection
        id="attribution"
        eyebrow="Attribution"
        heading={content.attribution.heading}
        lede={content.attribution.lede}
      >
        <PointList points={content.attribution.points} />
      </ContentSection>

      <ContentSection
        id="modules"
        eyebrow="QWA modules"
        heading={content.modules.heading}
        lede={content.modules.lede}
      >
        <CardGrid items={content.modules.items} columns={2} />
      </ContentSection>

      <FaqSection faqs={content.faqs} />

      <RelatedLinks links={content.related} />

      <ContentCta
        title={content.cta.title}
        lede={content.cta.lede}
        note={content.cta.note}
        analyticsSource={`industry_${slug}_cta`}
      />
    </ContentPage>
  );
}
