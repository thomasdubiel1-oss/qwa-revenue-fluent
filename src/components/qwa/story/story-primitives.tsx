import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/**
 * QWA product-story visual system.
 *
 * One visual language for every capability story on the public site:
 * a beginning (source), a progression (stages), an outcome, and — where the
 * business story requires it — a teal return path that closes the loop.
 *
 * Rules encoded here so no individual composition can drift:
 *  - Teal (`signal`) is semantic. It marks the active state, the outcome and
 *    the return path only. Everything upstream is graphite on ivory.
 *  - Four to seven major objects per frame. The primitives take a stage list;
 *    callers keep it short.
 *  - Desktop/tablet read left to right. Mobile recomposes to a vertical
 *    progression with the same semantics — never a shrunken horizontal rail.
 *  - Motion is a single idea: the rail traces once, stages settle, the outcome
 *    and the return path resolve last. Reduced motion renders the final frame.
 */

export type StoryStageKind = "source" | "step" | "active" | "outcome";

export interface StoryStage {
  /** Short noun. Two words maximum — this is the object, not a sentence. */
  label: string;
  /** One supporting clause. Optional; omitted on dense rails. */
  caption?: string;
  kind?: StoryStageKind;
  /** Qualitative state tag. Never a fabricated metric. */
  chip?: string;
}

export interface StoryReturnPath {
  /** Stage index the value travels from (usually the outcome). */
  from: number;
  /** Stage index the value returns to (usually the source). */
  to: number;
  label: string;
}

/* -------------------------------------------------------------------------
 * Frame
 * ---------------------------------------------------------------------- */

/**
 * The shared container. Soft contact shadow, one hairline, generous internal
 * whitespace, and a single accessible description of the story being told —
 * the SVG/geometry underneath stays out of the accessibility tree.
 */
export function StoryFrame({
  eyebrow,
  outcome,
  description,
  children,
  footnote,
  className,
}: {
  /** Chrome label, left. The subject of the story. */
  eyebrow: string;
  /** Chrome label, right. The end state, in two or three words. */
  outcome?: string;
  /** Screen-reader sentence describing the whole composition. */
  description: string;
  children: React.ReactNode;
  footnote?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-card",
        className,
      )}
    >
      <div className="flex h-11 items-center justify-between gap-4 border-b border-hairline px-5">
        <span className="text-data min-w-0 truncate text-[0.7rem] text-muted-foreground">
          {eyebrow}
        </span>
        {outcome ? (
          <span className="text-data shrink-0 text-[0.7rem] text-signal">{outcome}</span>
        ) : null}
      </div>

      <figcaption className="sr-only">{description}</figcaption>

      <div className="px-5 py-8 sm:px-8 sm:py-10" aria-hidden="true">
        {children}
      </div>

      {footnote ? (
        <div className="border-t border-hairline px-5 py-3">
          <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/70">
            {footnote}
          </p>
        </div>
      ) : null}
    </figure>
  );
}

/* -------------------------------------------------------------------------
 * Shared motion helpers
 * ---------------------------------------------------------------------- */

/** Standard once-only in-view reveal, disabled cleanly under reduced motion. */
export function useStoryMotion() {
  const reduced = useHydratedReducedMotion();
  return {
    reduced,
    viewport: { once: true, amount: 0.4 } as const,
    trace: (delay = 0) =>
      reduced
        ? {}
        : {
            initial: { scaleX: 0 },
            whileInView: { scaleX: 1 },
            transition: { duration: 0.9, delay, ease: ease.out },
          },
    settle: (delay = 0) =>
      reduced
        ? {}
        : {
            initial: { opacity: 0, y: 6 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay, ease: ease.out },
          },
  };
}

/* -------------------------------------------------------------------------
 * Stage node
 * ---------------------------------------------------------------------- */

const NODE_STYLE: Record<StoryStageKind, string> = {
  source: "h-4 w-4 rounded-[5px] border-2 border-foreground/70 bg-card",
  step: "h-2.5 w-2.5 rounded-full bg-foreground/35",
  active: "h-3.5 w-3.5 rounded-full bg-signal ring-4 ring-signal/15",
  outcome: "h-5 w-5 rounded-full bg-signal ring-[6px] ring-signal/12",
};

function StageDot({ kind = "step" }: { kind?: StoryStageKind }) {
  return <span className={cn("block shrink-0", NODE_STYLE[kind])} />;
}

function StageText({
  stage,
  align,
}: {
  stage: StoryStage;
  align: "center" | "left";
}) {
  const emphasised = stage.kind === "outcome" || stage.kind === "active";
  return (
    <div className={cn("min-w-0", align === "center" ? "text-center" : "text-left")}>
      <p
        className={cn(
          "text-[0.8125rem] font-medium leading-snug tracking-[-0.01em]",
          emphasised ? "text-foreground" : "text-foreground/80",
        )}
      >
        {stage.label}
      </p>
      {stage.caption ? (
        <p className="mt-1 text-[0.75rem] leading-snug text-muted-foreground">{stage.caption}</p>
      ) : null}
      {stage.chip ? (
        <span
          className={cn(
            "text-data mt-2 inline-flex rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em]",
            stage.kind === "outcome" || stage.kind === "active"
              ? "bg-signal/10 text-signal"
              : "bg-paper text-muted-foreground",
          )}
        >
          {stage.chip}
        </span>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * StoryJourney — the primary composition
 * ---------------------------------------------------------------------- */

export function StoryJourney({
  stages,
  returnPath,
  className,
}: {
  stages: StoryStage[];
  returnPath?: StoryReturnPath;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="hidden sm:block">
        <HorizontalJourney stages={stages} {...(returnPath ? { returnPath } : {})} />
      </div>
      <div className="sm:hidden">
        <VerticalJourney stages={stages} {...(returnPath ? { returnPath } : {})} />
      </div>
    </div>
  );
}

function HorizontalJourney({
  stages,
  returnPath,
}: {
  stages: StoryStage[];
  returnPath?: StoryReturnPath;
}) {
  const { reduced, viewport, trace, settle } = useStoryMotion();
  const n = stages.length;
  const centre = (i: number) => ((i + 0.5) / n) * 100;

  const from = returnPath ? centre(returnPath.from) : 0;
  const to = returnPath ? centre(returnPath.to) : 0;
  const left = Math.min(from, to);
  const width = Math.abs(from - to);

  return (
    <div className="min-w-0">
      {/* Rail + nodes */}
      <div className="relative">
        <div
          className="absolute left-0 right-0 top-[0.5625rem] h-px -translate-y-1/2 bg-hairline-strong"
          style={{ marginLeft: `${centre(0)}%`, marginRight: `${100 - centre(n - 1)}%` }}
        />
        <motion.div
          className="absolute top-[0.5625rem] h-px origin-left -translate-y-1/2 bg-foreground/25"
          style={{ left: `${centre(0)}%`, right: `${100 - centre(n - 1)}%` }}
          viewport={viewport}
          {...trace()}
        />
        <ul
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {stages.map((s, i) => (
            <motion.li
              key={s.label}
              className="flex min-w-0 flex-col items-center gap-4 px-1.5"
              viewport={viewport}
              {...settle(reduced ? 0 : 0.35 + i * 0.07)}
            >
              <StageDot {...(s.kind ? { kind: s.kind } : {})} />
              <StageText stage={s} align="center" />
            </motion.li>
          ))}
        </ul>
      </div>

      {returnPath ? (
        <motion.div
          className="relative mt-8 h-14"
          viewport={viewport}
          {...settle(reduced ? 0 : 0.9)}
        >
          <div
            className="absolute top-0 h-11 rounded-b-[14px] border-b-2 border-l-2 border-r-2 border-signal"
            style={{ left: `${left}%`, width: `${width}%` }}
          />
          <div
            className="absolute top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-[0.4rem] rotate-45 border-l-2 border-t-2 border-signal"
            style={{ left: `${to}%` }}
          />
          <p
            className="text-data absolute top-[2.75rem] -translate-x-1/2 translate-y-1 bg-card px-3 text-[0.65rem] uppercase tracking-[0.14em] text-signal"
            style={{ left: `${left + width / 2}%` }}
          >
            {returnPath.label}
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}

function VerticalJourney({
  stages,
  returnPath,
}: {
  stages: StoryStage[];
  returnPath?: StoryReturnPath;
}) {
  const { reduced, viewport, settle } = useStoryMotion();
  const hasReturn = Boolean(returnPath);

  return (
    <div className={cn("relative", hasReturn && "pl-7")}>
      {hasReturn && returnPath ? (
        <motion.div
          className="pointer-events-none absolute bottom-4 left-0 top-4 w-5"
          viewport={viewport}
          {...settle(reduced ? 0 : 0.6)}
        >
          <div className="absolute inset-0 rounded-l-[14px] border-b-2 border-l-2 border-t-2 border-signal" />
          <div className="absolute right-0 top-0 h-2.5 w-2.5 -translate-y-px translate-x-1/2 rotate-45 border-r-2 border-t-2 border-signal" />
        </motion.div>
      ) : null}


      <ul className="relative grid gap-6">
        <div className="absolute bottom-3 left-[0.5625rem] top-3 w-px -translate-x-1/2 bg-hairline-strong" />
        {stages.map((s, i) => (
          <motion.li
            key={s.label}
            className="relative grid grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-4"
            viewport={viewport}
            {...settle(reduced ? 0 : 0.1 + i * 0.06)}
          >
            <span className="flex h-5 items-center justify-center">
              <StageDot {...(s.kind ? { kind: s.kind } : {})} />
            </span>
            <StageText stage={s} align="left" />
          </motion.li>
        ))}
      </ul>

      {hasReturn && returnPath ? (
        <p className="text-data mt-6 text-[0.6rem] uppercase leading-relaxed tracking-[0.14em] text-signal">
          {returnPath.label}
        </p>
      ) : null}
    </div>

  );
}

/* -------------------------------------------------------------------------
 * Supporting objects shared across the six stories
 * ---------------------------------------------------------------------- */

/** A small set of inputs entering the story from the left / top. */
export function StoryInputs({ items, label }: { items: string[]; label: string }) {
  const { reduced, viewport, settle } = useStoryMotion();
  return (
    <div className="min-w-0">
      <p className="text-data mb-3 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <motion.li
            key={it}
            className="rounded-full border border-hairline-strong bg-paper px-3 py-1.5 text-[0.75rem] text-foreground/75"
            viewport={viewport}
            {...settle(reduced ? 0 : i * 0.05)}
          >
            {it}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Distribution fan: one controlled input reaching several channels. */
export function StoryFanOut({
  origin,
  branches,
  converge,
}: {
  origin: string;
  branches: string[];
  /** Label for the single line the branches rejoin into. */
  converge?: string;
}) {
  const { reduced, viewport, settle } = useStoryMotion();
  return (
    <div className="grid min-w-0 items-center gap-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="rounded-lg border border-hairline-strong bg-paper px-4 py-3 text-[0.8125rem] font-medium text-foreground/85">
        {origin}
      </div>

      <ul className="grid gap-2">
        {branches.map((b, i) => (
          <motion.li
            key={b}
            className="flex items-center gap-3"
            viewport={viewport}
            {...settle(reduced ? 0 : 0.15 + i * 0.07)}
          >
            <span className="h-px w-6 shrink-0 bg-hairline-strong sm:w-8" />
            <span className="min-w-0 flex-1 truncate rounded-md border border-hairline bg-card px-3 py-2 text-[0.75rem] text-foreground/75">
              {b}
            </span>
            <span className="h-px w-6 shrink-0 bg-hairline-strong sm:w-8" />
          </motion.li>
        ))}
      </ul>

      {converge ? (
        <motion.div
          className="rounded-lg border-2 border-signal/35 bg-signal/[0.06] px-4 py-3 text-[0.8125rem] font-medium text-signal"
          viewport={viewport}
          {...settle(reduced ? 0 : 0.5)}
        >
          {converge}
        </motion.div>
      ) : null}
    </div>
  );
}
