import * as React from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Container, Section } from "../primitives";
import { SiteHeader } from "../site-header";
import { SiteFooter } from "../site-footer";
import { DemoRequestProvider, useDemoRequest } from "../demo-request";
import { MotionReveal } from "../motion-primitives";
import { cn } from "@/lib/utils";

/**
 * Editorial content shell for solution, industry and resource pages.
 *
 * Same restraint as the product pages — one hairline grid, generous rhythm,
 * no decorative imagery — but tuned for reading and scanning: a direct answer
 * above the fold, short answer blocks, tables where a table reads better than
 * prose, and visible FAQs that structured data can honestly point at.
 */

export type Crumb = { name: string; path: string };

export function ContentPage({ children }: { children: React.ReactNode }) {
  return (
    <DemoRequestProvider>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </DemoRequestProvider>
  );
}

/** Visible breadcrumb trail. Mirrors the BreadcrumbList emitted in head(). */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted-foreground">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="rounded transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {crumb.name}
                </Link>
              )}
              {isLast ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Page opener: the only H1 on the page, followed immediately by the direct
 * answer paragraph so both readers and answer engines get the definition
 * before any marketing framing.
 */
export function ContentHero({
  eyebrow,
  title,
  answer,
  support,
  trail,
  ctaLabel = "Book a demo",
  analyticsSource,
}: {
  eyebrow: string;
  title: string;
  answer: string;
  support?: string;
  trail: Crumb[];
  ctaLabel?: string;
  analyticsSource?: string;
}) {
  const { open } = useDemoRequest();
  return (
    <Section className="pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-20">
      <Container>
        <Breadcrumbs trail={trail} />
        <MotionReveal className="mt-8 max-w-[52rem]">
          <p className="text-eyebrow">{eyebrow}</p>
          <h1 className="text-display mt-5 text-balance text-[clamp(2.1rem,4.4vw,3.4rem)]">
            {title}
          </h1>
          <p className="mt-7 max-w-[64ch] text-pretty text-lg leading-relaxed text-foreground">
            {answer}
          </p>
          {support ? (
            <p className="mt-4 max-w-[68ch] text-pretty text-base leading-relaxed text-muted-foreground">
              {support}
            </p>
          ) : null}
          <div className="mt-9">
            <Button size="lg" onClick={() => open(analyticsSource ? "content_hero" : "content_hero")}>
              {ctaLabel}
            </Button>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}

export function ContentSection({
  id,
  eyebrow,
  heading,
  lede,
  tone = "default",
  children,
}: {
  id?: string;
  eyebrow?: string;
  heading: string;
  lede?: string;
  tone?: "default" | "paper";
  children?: React.ReactNode;
}) {
  return (
    <Section
      id={id}
      tone={tone}
      className="border-t border-hairline py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <MotionReveal className="max-w-[52rem]">
          {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
          <h2 className="text-display mt-4 text-balance text-[clamp(1.55rem,2.6vw,2.15rem)]">
            {heading}
          </h2>
          {lede ? (
            <p className="mt-5 max-w-[64ch] text-pretty text-base leading-relaxed text-muted-foreground">
              {lede}
            </p>
          ) : null}
        </MotionReveal>
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </Section>
  );
}

/** Numbered workflow. Each step names the trigger and the resulting record. */
export function StepList({
  steps,
}: {
  steps: { title: string; detail: string }[];
}) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-hairline sm:grid-cols-2">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4 bg-background p-6">
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 font-mono text-[0.75rem] tabular-nums text-signal"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="text-[1.0625rem] font-medium text-foreground">{step.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {step.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CardGrid({
  items,
  columns = 3,
}: {
  items: { title: string; detail: string }[];
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={cn(
        "grid gap-px overflow-hidden rounded-xl border border-border bg-hairline sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
      )}
    >
      {items.map((item) => (
        <li key={item.title} className="bg-background p-6">
          <h3 className="text-[1.0625rem] font-medium text-foreground">{item.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Compact answer block: a claim and the qualification that keeps it honest. */
export function PointList({ points }: { points: string[] }) {
  return (
    <ul className="grid max-w-[68ch] gap-3">
      {points.map((point) => (
        <li key={point} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export function ComparisonTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-hairline bg-paper">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-5 py-3 font-medium text-foreground">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-hairline last:border-b-0">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th
                    key={cell}
                    scope="row"
                    className="px-5 py-4 align-top font-medium text-foreground"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={`${row[0]}-${index}`} className="px-5 py-4 align-top text-muted-foreground">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type Faq = { question: string; answer: string };

/**
 * Visible FAQ. The same array is passed to faqPageSchema(), so the structured
 * data can never describe content a visitor cannot read.
 */
export function FaqSection({ faqs, heading = "Frequently asked questions" }: { faqs: Faq[]; heading?: string }) {
  return (
    <ContentSection id="faq" eyebrow="FAQ" heading={heading} tone="paper">
      <dl className="grid max-w-[68ch] gap-8">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="text-[1.0625rem] font-medium text-foreground">{faq.question}</dt>
            <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </ContentSection>
  );
}

export function RelatedLinks({
  heading = "Related",
  links,
}: {
  heading?: string;
  links: { label: string; href: string; detail: string }[];
}) {
  return (
    <Section className="border-t border-hairline py-16 lg:py-20">
      <Container>
        <MotionReveal>
          <p className="text-eyebrow">{heading}</p>
        </MotionReveal>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.href} className="bg-background">
              <Link
                to={link.href}
                className="flex h-full min-h-11 flex-col gap-2 p-6 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="text-[1.0625rem] font-medium text-foreground">{link.label}</span>
                <span className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {link.detail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function ContentCta({
  title,
  lede,
  note,
  analyticsSource,
}: {
  title: string;
  lede?: string;
  note?: string;
  analyticsSource?: string;
}) {
  const { open } = useDemoRequest();
  return (
    <Section tone="ink" className="py-20 lg:py-28">
      <Container>
        <MotionReveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-display max-w-[18ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
            {title}
          </h2>
          {lede ? (
            <p className="mt-5 max-w-[38ch] text-pretty text-lg leading-relaxed text-ink-foreground/70">
              {lede}
            </p>
          ) : null}
          <div className="mt-9">
            <Button variant="onInk" size="xl" onClick={() => open(analyticsSource ? "content_hero" : "content_hero")}>
              Book a demo
            </Button>
          </div>
          {note ? <p className="mt-5 text-[0.8125rem] text-ink-foreground/50">{note}</p> : null}
        </MotionReveal>
      </Container>
    </Section>
  );
}
