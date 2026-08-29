import { createFileRoute } from "@tanstack/react-router";

import { SolutionPageView } from "@/components/qwa/content/solution-page";
import { solutionHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/solutions/ai-appointment-setting")({
  head: () => solutionHead("ai-appointment-setting"),
  component: AiAppointmentSettingPage,
});

function AiAppointmentSettingPage() {
  return <SolutionPageView slug="ai-appointment-setting" />;
}
