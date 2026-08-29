/**
 * Head builders for the content pages.
 *
 * Each builder produces the unique title / description / canonical / robots /
 * OG / Twitter set from `pageHead`, plus structured data that matches what the
 * page renders: BreadcrumbList for every nested route, and FAQPage only where
 * the identical FAQ array is visibly displayed.
 */
import { pageHead } from "@/config/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/jsonld";
import { industries, type IndustrySlug } from "@/content/industries";
import { solutions, type SolutionSlug } from "@/content/solutions";

export function solutionHead(slug: SolutionSlug) {
  const content = solutions[slug];
  const path = `/solutions/${slug}`;
  return pageHead({
    path,
    title: content.title,
    description: content.description,
    jsonLd: [
      breadcrumbSchema([
        // Only paths that genuinely exist appear in the trail; there is no
        // /solutions hub route, so none is claimed.
        { name: "Home", path: "/" },
        { name: content.navLabel, path },
      ]),
      // The same array is rendered by <FaqSection /> on this page.
      faqPageSchema(content.faqs),
    ],
  });
}

export function industryHead(slug: IndustrySlug) {
  const content = industries[slug];
  const path = `/industries/${slug}`;
  return pageHead({
    path,
    title: content.title,
    description: content.description,
    jsonLd: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: content.navLabel, path },
      ]),
      faqPageSchema(content.faqs),
    ],
  });
}

/**
 * Product page head: unique metadata plus a BreadcrumbList. SoftwareApplication
 * is added only on pages that genuinely describe an application (see
 * /products/revenue-engine), not blanket-applied across the product set.
 */
export function productHead(input: {
  path: string;
  name: string;
  title: string;
  description: string;
}) {
  return pageHead({
    path: input.path,
    title: input.title,
    description: input.description,
    jsonLd: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: input.name, path: input.path },
      ]),
    ],
  });
}
