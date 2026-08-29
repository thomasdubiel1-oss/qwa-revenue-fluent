import { createFileRoute } from "@tanstack/react-router";

import { SolutionPageView } from "@/components/qwa/content/solution-page";
import { solutionHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/solutions/ai-lead-response")({
  head: () => solutionHead("ai-lead-response"),
  component: AiLeadResponsePage,
});

function AiLeadResponsePage() {
  return <SolutionPageView slug="ai-lead-response" />;
}
