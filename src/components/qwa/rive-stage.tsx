import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * RIVE INTEGRATION BOUNDARY
 * -------------------------------------------------------------------------
 * QWA's cinematic set pieces are authored in code today. When a designed
 * `.riv` state machine lands, drop it in `public/rive/` and pass its path to
 * <RiveStage />: the DOM contract, sizing, accessibility and reduced-motion
 * handling below stay exactly the same, so no consuming section changes.
 *
 * To activate:
 *   1. bun add @rive-app/react-canvas
 *   2. implement `loadRiveRuntime` (dynamic import of useRive) below
 *   3. pass src="/rive/<asset>.riv" + stateMachine="<Machine>" and, optionally,
 *      `inputs` — numbers/booleans are forwarded to the state machine.
 *
 * Until an asset exists this component renders its `fallback` verbatim. It
 * never simulates a Rive animation.
 */

export type RiveStageProps = {
  /** Path to a .riv asset. When omitted, the fallback renders. */
  src?: string;
  stateMachine?: string;
  /** State machine inputs, driven by scroll progress or UI state. */
  inputs?: Record<string, number | boolean>;
  /** Rendered when no asset is available or motion is reduced. */
  fallback: React.ReactNode;
  /** Accessible description of what the animation communicates. */
  label: string;
  className?: string;
};

const riveRuntimeAvailable = false;

export function RiveStage({ src, fallback, label, className }: RiveStageProps) {
  React.useEffect(() => {
    if (src && !riveRuntimeAvailable) {
      console.info(
        `[QWA] RiveStage received "${src}" but the Rive runtime is not installed. Rendering fallback.`,
      );
    }
  }, [src]);

  return (
    <div className={cn("relative", className)} role="img" aria-label={label}>
      {fallback}
    </div>
  );
}
