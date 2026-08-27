import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container, Section } from "../primitives";
import { MotionReveal } from "../motion-primitives";
import { SiteHeader } from "../site-header";
import { SiteFooter } from "../site-footer";
import { DemoRequestProvider, useDemoRequest } from "../demo-request";
import { Button } from "@/components/ui/button";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
 * Phase 2 product-page primitives.
 * Every product page (Voice, Acquisition, Creative Studio, Attribution,
 * SEO/GEO, Live Shopping, BI, V4) composes this same vocabulary so the
 * system stays one product, not a set of landing pages.
 * ---------------------------------------------------------------------- */

/** Page chrome: demo context, header, semantic main, footer. */
export function ProductShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoRequestProvider>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </DemoRequestProvider>
  );
}

/** Product hero: category, outcome headline, two actions, one visual. */
export function ProductHero({
  eyebrow,
  title,
  lede,
  secondaryLabel,
  secondaryHref,
  note,
  visual,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  secondaryLabel?: string;
  secondaryHref?: string;
  note?: string;
  visual: React.ReactNode;
}) {
  const { open } = useDemoRequest();

  return (
    <Section bleed className="overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40">
      <div className="qwa-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <MotionReveal className="min-w-0">
            <p className="text-eyebrow">{eyebrow}</p>
            <h1 className="text-display mt-6 text-[clamp(2.4rem,5.4vw,4.1rem)]">{title}</h1>
            <p className="text-lede mt-7 max-w-[34rem]">{lede}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button variant="ink" size="xl" onClick={open}>
                Book a demo
              </Button>
              {secondaryLabel && secondaryHref ? (
                <Button variant="quiet" size="xl" asChild>
                  <a href={secondaryHref}>{secondaryLabel}</a>
                </Button>
              ) : null}
            </div>
            {note ? <p className="mt-6 text-[0.8125rem] text-muted-foreground">{note}</p> : null}
          </MotionReveal>

          <MotionReveal delay={0.12} className="min-w-0">
            {visual}
          </MotionReveal>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Editorial section: a heading block and a product surface. `media="left"`
 * alternates the rhythm so a long page never reads as a stack of cards.
 */
export function ProductSection({
  id,
  eyebrow,
  title,
  lede,
  points,
  children,
  media = "right",
  tone = "default",
  className,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  points?: string[];
  children?: React.ReactNode;
  media?: "left" | "right" | "below";
  tone?: "default" | "paper" | "ink";
  className?: string;
}) {
  const heading = (
    <div className="min-w-0">
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="text-display mt-5 text-[clamp(1.9rem,3.4vw,2.9rem)]">{title}</h2>
      {lede ? (
        <p
          className={cn(
            "mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed",
            tone === "ink" ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {lede}
        </p>
      ) : null}
      {points?.length ? (
        <ul className="mt-8 grid gap-3.5 border-t border-hairline pt-7">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed">
              <span
                className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-signal"
                aria-hidden="true"
              />
              <span className={tone === "ink" ? "text-ink-foreground/75" : "text-muted-foreground"}>
                {p}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <Section id={id} tone={tone} className={cn("scroll-mt-24", className)}>
      <Container>
        {media === "below" ? (
          <>
            <MotionReveal className="max-w-3xl">{heading}</MotionReveal>
            {children ? <MotionReveal className="mt-14">{children}</MotionReveal> : null}
          </>
        ) : (
          <div
            className={cn(
              "grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
              media === "left" && "lg:[&>*:first-child]:order-2",
            )}
          >
            <MotionReveal>{heading}</MotionReveal>
            {children ? <MotionReveal delay={0.08} className="min-w-0">{children}</MotionReveal> : null}
          </div>
        )}
      </Container>
    </Section>
  );
}

/**
 * A single coherent piece of QWA software. Panels share one chrome so every
 * product visual on the site reads as the same application.
 */
export function ProductPanel({
  title,
  meta,
  children,
  footer,
  className,
  tone = "default",
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  tone?: "default" | "ink";
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-card",
        tone === "ink"
          ? "border-ink-foreground/15 bg-ink text-ink-foreground"
          : "border-border bg-card",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4 border-b px-5 py-3.5",
          tone === "ink" ? "border-ink-foreground/12" : "border-hairline",
        )}
      >
        <span
          className={cn(
            "text-data truncate text-[0.7rem]",
            tone === "ink" ? "text-ink-foreground/60" : "text-muted-foreground",
          )}
        >
          {title}
        </span>
        {meta ? (
          <span
            className={cn(
              "text-data shrink-0 text-[0.7rem]",
              tone === "ink" ? "text-ink-foreground/45" : "text-muted-foreground",
            )}
          >
            {meta}
          </span>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
      {footer ? (
        <div
          className={cn(
            "border-t px-5 py-3.5",
            tone === "ink" ? "border-ink-foreground/12" : "border-hairline",
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

/** Structured fields as they appear on a QWA customer record. */
export function FieldGrid({
  fields,
  columns = 2,
  className,
}: {
  fields: { label: string; value: string; accent?: boolean }[];
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-5",
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {fields.map((f) => (
        <div key={f.label} className="min-w-0">
          <dt className="text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
            {f.label}
          </dt>
          <dd
            className={cn(
              "mt-1.5 text-[0.9375rem] font-medium",
              f.accent ? "text-signal" : "text-foreground",
            )}
          >
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Required label wherever numbers appear. Nothing on the site is a claim. */
export function IllustrativeNote({
  children = "Illustrative product data. Not a customer result or performance guarantee.",
  tone = "default",
  className,
}: {
  children?: React.ReactNode;
  tone?: "default" | "ink";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[0.75rem] leading-relaxed",
        tone === "ink" ? "text-ink-foreground/45" : "text-muted-foreground/80",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Small labelled metric used inside panels and the executive view. */
export function StatCell({
  label,
  value,
  caption,
  tone = "default",
  size = "sm",
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: "default" | "ink";
  size?: "sm" | "lg";
}) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          "text-[0.7rem] uppercase tracking-[0.12em]",
          tone === "ink" ? "text-ink-foreground/50" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-data mt-2 font-medium tracking-tight",
          size === "lg" ? "text-[clamp(1.75rem,3vw,2.5rem)]" : "text-[1.25rem]",
        )}
      >
        {value}
      </p>
      {caption ? (
        <p
          className={cn(
            "mt-2 text-[0.8125rem] leading-relaxed",
            tone === "ink" ? "text-ink-foreground/55" : "text-muted-foreground",
          )}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}

/** Channel / integration chip. Neutral by default, signal when connected. */
export function Chip({
  children,
  active = false,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors",
        active
          ? "border-signal/35 bg-signal-soft text-foreground"
          : "border-hairline text-muted-foreground",
        className,
      )}
    >
      {active ? (
        <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}

/** Horizontal progress hairline used in panels to show a running process. */
export function PanelProgress({ value }: { value: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="h-px w-full bg-hairline">
      <motion.div
        className="h-px bg-signal"
        initial={reduced ? false : { width: 0 }}
        whileInView={{ width: `${Math.round(value * 100)}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: duration.slow, ease: ease.out }}
      />
    </div>
  );
}

/** Closing invitation. One action, nothing else. */
export function ProductCta({
  title,
  lede,
  note,
}: {
  title: string;
  lede: string;
  note?: string;
}) {
  const { open } = useDemoRequest();
  return (
    <Section tone="ink" className="py-28 lg:py-36">
      <Container>
        <MotionReveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-display max-w-[18ch] text-[clamp(2.1rem,4.4vw,3.3rem)]">{title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-foreground/70">{lede}</p>
          <div className="mt-10">
            <Button variant="onInk" size="xl" onClick={open}>
              Book a demo
            </Button>
          </div>
          {note ? <p className="mt-5 text-[0.8125rem] text-ink-foreground/50">{note}</p> : null}
        </MotionReveal>
      </Container>
    </Section>
  );
}
