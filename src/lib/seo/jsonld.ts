/**
 * Structured-data helpers.
 *
 * Every builder here emits schema.org JSON-LD that is verifiable from what the
 * page actually renders. Nothing invents ratings, prices, review counts,
 * addresses, awards or customer claims — QWA publishes no such data yet, so
 * those properties are deliberately absent rather than guessed.
 */
import { SITE_NAME, absoluteUrl } from "@/config/seo";

export type JsonLd = Record<string, unknown>;

/** Head-ready <script type="application/ld+json"> payloads. */
export function jsonLdScripts(items: JsonLd[]): { type: string; children: string }[] {
  return items.map((item) => ({
    type: "application/ld+json",
    children: JSON.stringify(item),
  }));
}

const ORGANIZATION_ID = `${absoluteUrl("/")}#organization`;
const WEBSITE_ID = `${absoluteUrl("/")}#website`;

/** Organization — name, canonical URL and description only. */
export function organizationSchema(description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: "QWA",
    url: absoluteUrl("/"),
    description,
  };
}

export function webSiteSchema(description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * BreadcrumbList for nested public routes. Pass the trail in order, starting
 * at Home; every item must match a link path that genuinely exists.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * SoftwareApplication for a product page. Only used where the page genuinely
 * describes an application. No `offers` block: QWA does not publish pricing,
 * and no `aggregateRating`: QWA publishes no ratings.
 */
export function softwareApplicationSchema(input: {
  name: string;
  path: string;
  description: string;
  applicationCategory: string;
  featureList?: string[];
}): JsonLd {
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    url: absoluteUrl(input.path),
    description: input.description,
    applicationCategory: input.applicationCategory,
    operatingSystem: "Web-based",
    provider: { "@id": ORGANIZATION_ID },
  };
  if (input.featureList?.length) schema["featureList"] = input.featureList;
  return schema;
}

/**
 * FAQPage. Only call this when the exact same questions and answers are
 * visibly rendered on the page — that is the condition Google states, and it
 * is enforced here by passing the page's own FAQ array.
 */
export function faqPageSchema(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Evergreen explainer pages describe themselves as an Article. */
export function articleSchema(input: {
  headline: string;
  path: string;
  description: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    url: absoluteUrl(input.path),
    description: input.description,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isAccessibleForFree: true,
  };
}
