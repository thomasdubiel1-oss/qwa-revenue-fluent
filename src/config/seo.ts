/**
 * Central SEO configuration.
 *
 * Canonical host and indexing behaviour are configuration-driven so the site
 * can stay private/unpublished today and become indexable at launch by setting
 * two environment variables — no code edit, no copy change.
 *
 *   VITE_SITE_URL        Absolute origin, no trailing slash (production host)
 *   VITE_SITE_INDEXABLE  "true" to allow crawling + indexing. Anything else
 *                        (including unset) keeps the site noindex/disallow.
 */

const FALLBACK_ORIGIN = "https://quantumwebai.com";

function normalizeOrigin(value: string | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return FALLBACK_ORIGIN;
  return raw.replace(/\/+$/, "");
}

export const SITE_ORIGIN = normalizeOrigin(import.meta.env["VITE_SITE_URL"] as string | undefined);

/** Production indexing is opt-in. Unpublished/preview builds stay out of search. */
export const SITE_INDEXABLE =
  String(import.meta.env["VITE_SITE_INDEXABLE"] ?? "").toLowerCase() === "true";

export const SITE_NAME = "Quantum Web AI";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Every publicly crawlable route, with sitemap weighting. Internal tools excluded. */
export const PUBLIC_ROUTES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/products/revenue-engine", priority: 0.9, changefreq: "monthly" },
  { path: "/products/voice", priority: 0.9, changefreq: "monthly" },
  { path: "/products/acquisition", priority: 0.9, changefreq: "monthly" },
  { path: "/products/creative-studio", priority: 0.9, changefreq: "monthly" },
  { path: "/products/attribution", priority: 0.9, changefreq: "monthly" },
  { path: "/products/search", priority: 0.8, changefreq: "monthly" },
  { path: "/products/live-commerce", priority: 0.8, changefreq: "monthly" },
  { path: "/products/business-intelligence", priority: 0.8, changefreq: "monthly" },
  { path: "/products/decision-intelligence", priority: 0.8, changefreq: "monthly" },
  { path: "/solutions/ai-lead-response", priority: 0.9, changefreq: "monthly" },
  { path: "/solutions/ai-appointment-setting", priority: 0.9, changefreq: "monthly" },
  { path: "/solutions/ai-voice-agent", priority: 0.9, changefreq: "monthly" },
  { path: "/solutions/customer-reactivation", priority: 0.85, changefreq: "monthly" },
  { path: "/solutions/revenue-attribution", priority: 0.85, changefreq: "monthly" },
  { path: "/industries/dental", priority: 0.8, changefreq: "monthly" },
  { path: "/industries/medspa", priority: 0.8, changefreq: "monthly" },
  { path: "/industries/hvac", priority: 0.8, changefreq: "monthly" },
  { path: "/industries/plumbing", priority: 0.8, changefreq: "monthly" },
  { path: "/industries/solar", priority: 0.8, changefreq: "monthly" },
  { path: "/resources/what-is-an-ai-revenue-engine", priority: 0.9, changefreq: "monthly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
];

type MetaTag = Record<string, string>;

/**
 * Standard head payload for a public page: title, description, canonical,
 * Open Graph / Twitter, and the configuration-driven robots directive.
 */
export function pageHead(options: {
  path: string;
  title: string;
  description: string;
  /** Absolute https URL of a meaningful cover image, when one exists. */
  image?: string;
  /** og:type override — "article" for evergreen explainers. */
  type?: "website" | "article";
  /**
   * Structured data for this page. Emitted only when the site is indexable is
   * NOT required — valid JSON-LD is harmless on a noindex page and keeps
   * preview parity with production.
   */
  jsonLd?: Record<string, unknown>[];
}): {
  meta: MetaTag[];
  links: { rel: string; href: string }[];
  scripts?: { type: string; children: string }[];
} {
  const url = absoluteUrl(options.path);
  const meta: MetaTag[] = [
    { title: options.title },
    { name: "description", content: options.description },
    {
      name: "robots",
      content: SITE_INDEXABLE ? "index, follow, max-image-preview:large" : "noindex, nofollow",
    },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: options.title },
    { property: "og:description", content: options.description },
    { property: "og:type", content: options.type ?? "website" },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: options.title },
    { name: "twitter:description", content: options.description },
  ];
  if (options.image) {
    meta.push({ property: "og:image", content: options.image });
    meta.push({ name: "twitter:image", content: options.image });
  }
  const links = [{ rel: "canonical", href: url }];
  if (!options.jsonLd?.length) return { meta, links };
  return {
    meta,
    links,
    scripts: options.jsonLd.map((entry) => ({
      type: "application/ld+json",
      children: JSON.stringify(entry),
    })),
  };
}

/** Head payload for internal-only tooling routes: never indexed, no canonical. */
export function internalHead(title: string): { meta: MetaTag[] } {
  return {
    meta: [{ title }, { name: "robots", content: "noindex, nofollow, noarchive" }],
  };
}
