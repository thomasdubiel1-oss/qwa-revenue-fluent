/**
 * QWA motion tokens.
 * Every animated surface in the product site pulls its easing and duration
 * from here so motion reads as one system rather than per-component taste.
 */

export const ease = {
  /** Default entrance: quick out, long settle. */
  out: [0.16, 1, 0.3, 1] as const,
  /** Interface state changes (hover, open/close). */
  standard: [0.4, 0, 0.2, 1] as const,
  /** Exits and dismissals. */
  in: [0.4, 0, 1, 1] as const,
};

export const duration = {
  micro: 0.18,
  fast: 0.28,
  base: 0.5,
  slow: 0.8,
  cinematic: 1.2,
};

export const spring = {
  soft: { type: "spring", stiffness: 220, damping: 32, mass: 0.9 } as const,
  snap: { type: "spring", stiffness: 420, damping: 34, mass: 0.6 } as const,
};

/** Shared entrance variants used by Reveal / staggered groups. */
export const riseVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const staggerParent = (stagger = 0.07, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
