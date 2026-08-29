import { createFileRoute } from "@tanstack/react-router";

import { SolutionPageView } from "@/components/qwa/content/solution-page";
import { solutionHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/solutions/revenue-attribution")({
  head: () => solutionHead("revenue-attribution"),
  component: RevenueAttributionPage,
});

function RevenueAttributionPage() {
  return <SolutionPageView slug="revenue-attribution" />;
}
