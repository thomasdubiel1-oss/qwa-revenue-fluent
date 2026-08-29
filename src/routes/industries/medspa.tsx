import { createFileRoute } from "@tanstack/react-router";

import { IndustryPageView } from "@/components/qwa/content/industry-page";
import { industryHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/industries/medspa")({
  head: () => industryHead("medspa"),
  component: MedspaPage,
});

function MedspaPage() {
  return <IndustryPageView slug="medspa" />;
}
