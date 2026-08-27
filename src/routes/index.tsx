import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SITE_NAME, absoluteUrl, pageHead } from "@/config/seo";
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
  head: () => {
    const head = pageHead({ path: "/", title, description });
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
            description,
          }),
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <DemoRequestProvider>
      <SiteHeader />
      <main id="main">
        <Hero />
        <RevenueEngine
          intro={
            <Link
              to="/products/revenue-engine"
              className="inline-flex min-h-11 items-center gap-2 rounded-sm text-[0.9375rem] font-medium text-signal transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore the Revenue Engine
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <ClosedLoop />
        <PlatformPreview />
        <OutcomePanel />
        <ClosingCta />
      </main>
      <SiteFooter />
    </DemoRequestProvider>
  );
}
