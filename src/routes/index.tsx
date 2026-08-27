import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/qwa/site-header";
import { SiteFooter } from "@/components/qwa/site-footer";
import { DemoRequestProvider } from "@/components/qwa/demo-request";
import { Hero } from "@/components/qwa/hero";
import { RevenueEngine } from "@/components/qwa/revenue-engine";
import { ClosedLoop, OutcomePanel } from "@/components/qwa/closed-loop";
import { PlatformPreview } from "@/components/qwa/platform";
import { ClosingCta } from "@/components/qwa/cta";

const title = "Quantum Web AI — The AI Revenue Operating System";
const description =
  "QWA unifies acquisition, AI conversations, appointments, sales assistance and revenue attribution into one closed loop — so every signal is measured against the revenue it produced.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <DemoRequestProvider>
      <SiteHeader />
      <main id="main">
        <Hero />
        <RevenueEngine />
        <ClosedLoop />
        <PlatformPreview />
        <OutcomePanel />
        <ClosingCta />
      </main>
      <SiteFooter />
    </DemoRequestProvider>
  );
}
