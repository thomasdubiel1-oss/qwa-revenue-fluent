import * as React from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { products, relatedProducts, type ProductKey } from "@/config/site";
import { Container, Section } from "../primitives";
import { MotionReveal } from "../motion-primitives";
import { SiteHeader } from "../site-header";
import { SiteFooter } from "../site-footer";
import { DemoRequestProvider, useDemoRequest } from "../demo-request";
import { Button } from "@/components/ui/button";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/* -------------------------------------------------------------------------
 * Phase 2 product-page primitives.
 *
 * Every product page (Voice, Acquisition, Creative Studio, Attribution,
 * SEO/GEO, Live Shopping, BI, V4) composes this same vocabulary so the
 * system reads as one product, not a set of landing pages.
 *
 * Panel chrome contract — do not deviate per page:
 *   radius        rounded-xl
 *   border        border-border (ink: border-ink-foreground/15)
 *   header/footer 40px rhythm, mono 0.7rem, muted
 *   body blocks   PanelBlock (px-5 py-5), separated by hairlines
 *   data type     .text-data, tabular
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

/** Product hero: category, outcome headline, one primary action, one visual. */
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
    <Section bleed className="overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-40">
      <div className="qwa-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 xl:gap-20">
          <MotionReveal className="min-w-0">
            <p className="text-eyebrow">{eyebrow}</p>
            <h1 className="text-display mt-6 max-w-[17ch] text-balance text-[clamp(2.35rem,4.6vw,3.7rem)]">
              {title}
            </h1>
            <p className="text-lede mt-6 max-w-[34rem]">{lede}</p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3">
              <Button variant="ink" size="xl" onClick={open}>
                Book a demo
              </Button>
              {secondaryLabel && secondaryHref ? (
                <a
                  href={secondaryHref}
                  className="text-[0.9375rem] font-medium text-foreground underline-offset-[6px] transition-colors hover:text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {secondaryLabel}
                </a>
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
      <h2 className="text-display mt-5 max-w-[21ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "mt-5 max-w-[33rem] text-pretty text-[1.0625rem] leading-relaxed",
            tone === "ink" ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {lede}
        </p>
      ) : null}
      {points?.length ? (
        <ul
          className={cn(
            "mt-7 grid max-w-[33rem] gap-3 border-t pt-6",
            tone === "ink" ? "border-ink-foreground/15" : "border-hairline",
          )}
        >
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
    <Section
      id={id}
      tone={tone}
      className={cn("scroll-mt-24 py-20 sm:py-24 lg:py-28", className)}
    >
      <Container>
        {media === "below" ? (
          <>
            <MotionReveal className="max-w-3xl">{heading}</MotionReveal>
            {children ? <MotionReveal className="mt-12">{children}</MotionReveal> : null}
          </>
        ) : (
          <div
            className={cn(
              "grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-20",
              media === "left" && "lg:[&>*:first-child]:order-2",
            )}
          >
            <MotionReveal>{heading}</MotionReveal>
            {children ? (
              <MotionReveal delay={0.08} className="min-w-0">
                {children}
              </MotionReveal>
            ) : null}
          </div>
        )}
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------
 * Panel system — one chrome for every QWA surface on the site.
 * ---------------------------------------------------------------------- */

const PanelToneContext = React.createContext<"default" | "ink">("default");

export function usePanelTone() {
  return React.useContext(PanelToneContext);
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
  /** Left-hand chrome label. Use the record or object identity, not a headline. */
  title: React.ReactNode;
  /** Right-hand chrome label. Use system state, never marketing copy. */
  meta?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  tone?: "default" | "ink";
}) {
  return (
    <PanelToneContext.Provider value={tone}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border shadow-card",
          tone === "ink"
            ? "border-ink-foreground/15 bg-ink text-ink-foreground"
            : "border-border bg-card",
          className,
        )}
      >
        <div
          className={cn(
            "flex h-11 items-center justify-between gap-4 border-b px-5",
            tone === "ink" ? "border-ink-foreground/12" : "border-hairline",
          )}
        >
          <span
            className={cn(
              "text-data min-w-0 truncate text-[0.7rem]",
              tone === "ink" ? "text-ink-foreground/65" : "text-muted-foreground",
            )}
          >
            {title}
          </span>
          {meta ? (
            <span
              className={cn(
                "text-data shrink-0 text-[0.7rem]",
                tone === "ink" ? "text-ink-foreground/45" : "text-muted-foreground/80",
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
              "border-t px-5 py-3",
              tone === "ink" ? "border-ink-foreground/12" : "border-hairline",
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </PanelToneContext.Provider>
  );
}

/** Standard padded region inside a panel. Blocks stack, separated by hairlines. */
export function PanelBlock({
  label,
  children,
  muted = false,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  /** Recessed background for secondary regions (derived fields, system output). */
  muted?: boolean;
  className?: string;
}) {
  const tone = usePanelTone();
  return (
    <div
      className={cn(
        "border-t px-5 py-5 first:border-t-0",
        tone === "ink" ? "border-ink-foreground/12" : "border-hairline",
        muted && (tone === "ink" ? "bg-ink-foreground/[0.035]" : "bg-paper"),
        className,
      )}
    >
      {label ? (
        <p
          className={cn(
            "text-data mb-4 text-[0.65rem] uppercase tracking-[0.14em]",
            tone === "ink" ? "text-ink-foreground/45" : "text-muted-foreground/80",
          )}
        >
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/** Bottom strip of derived values. Always three cells, always mono. */
export function PanelStats({
  cells,
  className,
}: {
  cells: { label: string; value: React.ReactNode; accent?: boolean }[];
  className?: string;
}) {
  const tone = usePanelTone();
  return (
    <div
      className={cn(
        "grid border-t",
        cells.length === 2 ? "grid-cols-2" : "grid-cols-3",
        tone === "ink" ? "border-ink-foreground/12" : "border-hairline",
        className,
      )}
    >
      {cells.map((c) => (
        <div
          key={c.label}
          className={cn(
            "min-w-0 border-r px-5 py-3.5 last:border-r-0",
            tone === "ink" ? "border-ink-foreground/12" : "border-hairline",
          )}
        >
          <p
            className={cn(
              "truncate text-[0.7rem]",
              tone === "ink" ? "text-ink-foreground/50" : "text-muted-foreground",
            )}
          >
            {c.label}
          </p>
          <p
            className={cn(
              "text-data mt-1 truncate text-[0.9375rem] font-medium",
              c.accent && "text-positive",
            )}
          >
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * The persistent identity of a record. Shown wherever the point being made is
 * "this is still the same customer" — across channels, sessions and systems.
 */
export function RecordBadge({
  id,
  state,
  className,
}: {
  id: string;
  state?: string;
  className?: string;
}) {
  const tone = usePanelTone();
  return (
    <span
      className={cn(
        "text-data inline-flex items-center gap-2 rounded-md border px-2 py-1 text-[0.68rem]",
        tone === "ink"
          ? "border-ink-foreground/20 text-ink-foreground/70"
          : "border-hairline-strong text-muted-foreground",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
      {id}
      {state ? (
        <span className={tone === "ink" ? "text-ink-foreground/40" : "text-muted-foreground/70"}>
          · {state}
        </span>
      ) : null}
    </span>
  );
}

/**
 * The outcome of a rule. Used where the decision matters more than the inputs
 * that produced it (routing, approval, next action).
 */
export function DecisionCallout({
  label,
  value,
  rule,
  className,
}: {
  label: string;
  value: string;
  rule?: string;
  className?: string;
}) {
  const tone = usePanelTone();
  return (
    <div
      className={cn(
        "border-l-2 border-signal pl-4",
        className,
      )}
    >
      <p
        className={cn(
          "text-data text-[0.65rem] uppercase tracking-[0.14em]",
          tone === "ink" ? "text-ink-foreground/45" : "text-muted-foreground/80",
        )}
      >
        {label}
      </p>
      <p className="mt-1.5 text-[1.375rem] font-medium tracking-tight">{value}</p>
      {rule ? (
        <p
          className={cn(
            "text-data mt-1.5 text-[0.7rem]",
            tone === "ink" ? "text-ink-foreground/50" : "text-muted-foreground",
          )}
        >
          {rule}
        </p>
      ) : null}
    </div>
  );
}

/** Structured fields as they appear on a QWA record. */
export function FieldGrid({
  fields,
  columns = 2,
  className,
}: {
  fields: { label: string; value: string; accent?: boolean }[];
  columns?: 2 | 3;
  className?: string;
}) {
  const tone = usePanelTone();
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
          <dt
            className={cn(
              "text-[0.7rem] uppercase tracking-[0.12em]",
              tone === "ink" ? "text-ink-foreground/45" : "text-muted-foreground",
            )}
          >
            {f.label}
          </dt>
          <dd
            className={cn(
              "mt-1.5 text-[0.9375rem] font-medium",
              f.accent && "text-signal",
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
            "mt-2 max-w-[22rem] text-[0.8125rem] leading-relaxed",
            tone === "ink" ? "text-ink-foreground/55" : "text-muted-foreground",
          )}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}

/** Channel / integration marker. Square-ish, not a marketing pill. */
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
        "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-[0.8125rem] transition-colors",
        active
          ? "border-signal/40 bg-signal-soft text-foreground"
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
  lede?: string;
  note?: string;
}) {
  const { open } = useDemoRequest();
  return (
    <Section tone="ink" className="py-24 lg:py-32">
      <Container>
        <MotionReveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-display max-w-[16ch] text-balance text-[clamp(2rem,3.8vw,3.05rem)]">
            {title}
          </h2>
          {lede ? (
            <p className="mt-5 max-w-[34ch] text-pretty text-lg leading-relaxed text-ink-foreground/70">
              {lede}
            </p>
          ) : null}
          <div className="mt-9">
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

/**
 * Cross-navigation between sibling products. Keeps the suite legible as one
 * system: three adjacent surfaces, each named with the outcome it owns.
 */
export function RelatedProducts({ current }: { current: ProductKey }) {
  const siblings = relatedProducts[current].map((key) => products[key]);

  return (
    <Section className="border-t border-hairline py-20 lg:py-24">
      <Container>
        <MotionReveal>
          <p className="text-eyebrow">Continue</p>
          <h2 className="text-display mt-5 max-w-[24ch] text-balance text-[clamp(1.6rem,2.6vw,2.15rem)]">
            {products[current].name} does not work alone.
          </h2>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((item) => (
              <li key={item.key} className="bg-background">
                <Link
                  to={item.href}
                  className="group flex h-full min-h-11 flex-col justify-between gap-6 p-6 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <div className="min-w-0">
                    <p className="text-[1.0625rem] font-medium text-foreground">{item.name}</p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-signal">
                    Explore
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </MotionReveal>
      </Container>
    </Section>
  );
}
