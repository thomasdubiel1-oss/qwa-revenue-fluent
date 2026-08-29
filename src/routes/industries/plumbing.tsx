import { createFileRoute } from "@tanstack/react-router";

import { IndustryPageView } from "@/components/qwa/content/industry-page";
import { industryHead } from "@/lib/seo/page-heads";

export const Route = createFileRoute("/industries/plumbing")({
  head: () => industryHead("plumbing"),
  component: PlumbingPage,
});

function PlumbingPage() {
  return <IndustryPageView slug="plumbing" />;
}
