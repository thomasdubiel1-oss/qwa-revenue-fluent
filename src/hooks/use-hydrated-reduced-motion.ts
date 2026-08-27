import * as React from "react";
import { useReducedMotion } from "motion/react";

/**
 * SSR-safe reduced-motion preference.
 *
 * The server cannot know the visitor's motion preference, so it always renders
 * the motion-enabled markup. Branching on the real preference during the first
 * client render therefore produces a hydration mismatch. This hook returns
 * `false` for the initial render and resolves to the true preference in an
 * effect — one frame later, before any scroll-driven sequence has begun.
 */
export function useHydratedReducedMotion(): boolean {
  const prefersReduced = useReducedMotion();
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    setReduced(Boolean(prefersReduced));
  }, [prefersReduced]);
  return reduced;
}
