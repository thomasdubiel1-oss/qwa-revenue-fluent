import { createFileRoute } from "@tanstack/react-router";

import { SolutionPageView } from "@/components/qwa/content/solution-page";
import { solutionHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/solutions/ai-voice-agent")({
  head: () => solutionHead("ai-voice-agent"),
  component: AiVoiceAgentPage,
});

function AiVoiceAgentPage() {
  return <SolutionPageView slug="ai-voice-agent" />;
}
