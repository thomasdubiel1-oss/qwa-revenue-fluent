import { createFileRoute } from "@tanstack/react-router";

import { IndustryPageView } from "@/components/qwa/content/industry-page";
import { industryHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/industries/solar")({
  head: () => industryHead("solar"),
  component: SolarPage,
});

function SolarPage() {
  return <IndustryPageView slug="solar" />;
}
