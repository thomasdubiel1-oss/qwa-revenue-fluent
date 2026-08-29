import { createFileRoute } from "@tanstack/react-router";

import { SolutionPageView } from "@/components/qwa/content/solution-page";
import { solutionHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/solutions/customer-reactivation")({
  head: () => solutionHead("customer-reactivation"),
  component: CustomerReactivationPage,
});

function CustomerReactivationPage() {
  return <SolutionPageView slug="customer-reactivation" />;
}
