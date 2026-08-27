import { createFileRoute } from "@tanstack/react-router";

import { SITE_INDEXABLE, absoluteUrl } from "@/config/seo";

/**
 * Robots directives follow the same switch as the rest of SEO: private until
 * VITE_SITE_INDEXABLE is set to "true" at launch.
 */
export const Route = createFileRoute("/robots[.]txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = SITE_INDEXABLE
          ? [
              "User-agent: *",
              "Allow: /",
              "Disallow: /internal/",
              "Disallow: /api/",
              "",
              `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
              "",
            ].join("\n")
          : ["User-agent: *", "Disallow: /", ""].join("\n");

        return new Response(body, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
