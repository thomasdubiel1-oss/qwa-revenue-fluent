# QWA SEO / GEO growth plan

Scope: the public marketing site only. Internal `/internal/*` routes, API routes
and the sitemap remain excluded from indexing, and the whole site stays
`noindex` unless `VITE_SITE_INDEXABLE=true` in a production build.

## Current published surface

| Group      | Routes                                                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home       | `/`                                                                                                                                                                   |
| Products   | nine `/products/*` pages                                                                                                                                              |
| Solutions  | `/solutions/ai-lead-response`, `/solutions/ai-appointment-setting`, `/solutions/ai-voice-agent`, `/solutions/customer-reactivation`, `/solutions/revenue-attribution` |
| Industries | `/industries/dental`, `/industries/medspa`, `/industries/hvac`, `/industries/plumbing`, `/industries/solar`                                                           |
| Resources  | `/resources/what-is-an-ai-revenue-engine`                                                                                                                             |
| Legal      | `/privacy`, `/terms`                                                                                                                                                  |

Every route above is declared once in `src/config/seo.ts` (`PUBLIC_ROUTES`),
which is the single source for canonical URLs, robots directives and the
sitemap. Adding a route anywhere else does not make it public.

## Structured data policy

Builders live in `src/lib/seo/jsonld.ts`.

- `Organization` + `WebSite` — home only.
- `BreadcrumbList` — every nested public page, matching the visible breadcrumb.
- `SoftwareApplication` — `/products/revenue-engine` only, because that page
  genuinely describes an application. No `offers`, no `aggregateRating`.
- `FAQPage` — only where the identical FAQ is visibly rendered on the page.
- `Article` — the resources explainer.

Never emitted: ratings, review counts, prices, awards, employee counts,
postal addresses or customer claims. If a fact is not verifiable from the
business, it does not go into schema and it does not go into copy.

## Content rules

1. One logical `<h1>` per page, followed by a descriptive heading hierarchy.
2. The first paragraph answers the page's question directly — no throat-clearing.
3. No invented statistics, testimonials, customer names, case studies,
   guarantees or regulatory claims.
4. No hidden text, keyword stuffing, location spam or doorway pages.
5. Tables and step lists are used where they genuinely read better than prose.
6. Every page links to at least three related pages and carries one CTA.

## Programmatic expansion (Industry x Problem x Solution)

The typed model lives in `src/content/seo-growth-model.ts`. It is a planning
artefact: it produces _candidates_, never routes, and nothing in it is wired
into the sitemap or the router.

A candidate becomes a page only after a human writes it and it passes all six
quality gates:

| Gate                      | Test                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `differentiated-intent`   | The query behind this page is materially different from an existing page's query, not a synonym.                        |
| `unique-industry-context` | At least 60% of the body is specific to that industry: its lead sources, its terminology, its workflow, its objections. |
| `substantive-usefulness`  | A practitioner in that industry would find something here they could act on today.                                      |
| `internal-linking`        | Linked from its industry page and its solution page, and links back to both.                                            |
| `canonical-correctness`   | Self-canonical, present exactly once in `PUBLIC_ROUTES`, no near-duplicate competing for the same query.                |
| `human-review`            | A named person has read the whole page and approved the claims in it.                                                   |

Batch generation is explicitly out of scope. If the combination cannot clear
`substantive-usefulness` on its own merits, the right answer is a section on an
existing page, not a new URL.

## Review cadence

- On every new public route: confirm it is in `PUBLIC_ROUTES`, has unique
  title/description/canonical, and renders one `<h1>`.
- Before enabling indexing: re-check that `/internal/*` is absent from the
  sitemap and that robots disallows it.
- Quarterly: prune pages that no longer clear the quality gates rather than
  padding them.
