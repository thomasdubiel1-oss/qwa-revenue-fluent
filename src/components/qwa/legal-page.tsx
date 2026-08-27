import * as React from "react";

import { Container } from "./primitives";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { DemoRequestProvider } from "./demo-request";

/**
 * Shared shell for policy pages. These documents describe the system's actual
 * technical behaviour only. Anything requiring a legal position is rendered as
 * an explicit review marker rather than invented text.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <DemoRequestProvider>
      <SiteHeader />
      <main id="main">
        <Container className="py-20 lg:py-28">
          <div className="max-w-[68ch]">
            <p className="text-eyebrow">{eyebrow}</p>
            <h1 className="text-display mt-5 text-[clamp(2.1rem,4vw,3rem)]">{title}</h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{intro}</p>

            <div className="mt-14 grid gap-12">{children}</div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </DemoRequestProvider>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-medium tracking-tight">{heading}</h2>
      <div className="grid gap-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/** Explicit marker for text that must be supplied by the owner or counsel. */
export function PendingReview({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-hairline-strong bg-surface px-4 py-3 text-[0.875rem] leading-relaxed text-muted-foreground">
      <span className="text-data mr-2 text-xs uppercase tracking-wide text-signal">
        Pending legal review
      </span>
      {children}
    </p>
  );
}
