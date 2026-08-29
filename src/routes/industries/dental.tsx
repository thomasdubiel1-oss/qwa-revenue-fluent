import { createFileRoute } from "@tanstack/react-router";

import { IndustryPageView } from "@/components/qwa/content/industry-page";
import { industryHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/industries/dental")({
  head: () => industryHead("dental"),
  component: DentalPage,
});

function DentalPage() {
  return <IndustryPageView slug="dental" />;
}
