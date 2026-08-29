import { createFileRoute } from "@tanstack/react-router";

import { PUBLIC_ROUTES, SITE_INDEXABLE, absoluteUrl } from "@/config/seo";

/**
 * Configuration-driven sitemap. While the site is unpublished
 * (VITE_SITE_INDEXABLE unset) an empty urlset is served so nothing is
 * submitted for indexing prematurely.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // No <lastmod>: a build-time date is not a page-specific modification
        // timestamp, and publishing one would be misleading.
        const urls = SITE_INDEXABLE
          ? PUBLIC_ROUTES.map(
              (route) =>
                `  <url>\n    <loc>${absoluteUrl(route.path)}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority.toFixed(1)}</priority>\n  </url>`,
            ).join("\n")
          : "";

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

        return new Response(xml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
