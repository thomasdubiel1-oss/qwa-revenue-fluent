import { createFileRoute } from "@tanstack/react-router";

import { IndustryPageView } from "@/components/qwa/content/industry-page";
import { industryHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/industries/hvac")({
  head: () => industryHead("hvac"),
  component: HvacPage,
});

function HvacPage() {
  return <IndustryPageView slug="hvac" />;
}
