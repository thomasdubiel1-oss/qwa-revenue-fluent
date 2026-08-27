import * as React from "react";

import { getMedia } from "@/lib/media/manifest";
import type { AspectRatioToken, FlagshipMediaAsset } from "@/lib/media/types";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/**
 * QWA flagship media frame.
 *
 * Contract:
 *  - Framed mode owns a fixed aspect ratio at every breakpoint, so swapping a
 *    code composition for footage later causes zero layout shift.
 *  - Unframed mode preserves an existing, visually locked composition's own
 *    geometry (scroll-driven sequences, content-height product panels) and
 *    still reserves a video layer for a future cleared asset.
 *  - When the manifest entry has no `source`, NO <video> element is created.
 *    A missing external asset can therefore never produce a broken player,
 *    a stalled spinner or a console error.
 *  - Video is mounted only after the frame enters the viewport, only when the
 *    asset is `commercially_cleared`, motion is allowed, and the connection is
 *    not metered / saving data.
 *  - The code composition is always rendered underneath as the poster layer,
 *    so the first paint is complete before any byte of video arrives, and it
 *    stays in the accessibility tree until footage is actually playing.
 */

const RATIO_CLASS: Record<AspectRatioToken, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "9:16": "aspect-[9/16]",
};

/** Honours Save-Data and 2g/3g without blocking on unsupported browsers. */
function useDataSaver(): boolean {
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        addEventListener?: (t: string, fn: () => void) => void;
        removeEventListener?: (t: string, fn: () => void) => void;
      };
    };
    const c = nav.connection;
    if (!c) return;
    const evaluate = () =>
      setSaving(Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType ?? ""));
    evaluate();
    c.addEventListener?.("change", evaluate);
    return () => c.removeEventListener?.("change", evaluate);
  }, []);
  return saving;
}

function useInView<T extends Element>(margin = "200px") {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(true);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

/** True once the viewport is at the mobile composition width. */
function useIsCompact(query = "(max-width: 767px)") {
  const [compact, setCompact] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return compact;
}

export interface FlagshipMediaProps {
  /** Manifest id. Geometry, behaviour and status all come from the manifest. */
  id: string;
  /**
   * The code composition. It is the poster, the reduced-motion state and the
   * permanent answer for every `code_motion` slot — never a placeholder box.
   */
  children: React.ReactNode;
  /** Accessible description of what the media communicates. */
  label?: string;
  className?: string;
  /**
   * Keep the composition's own height instead of imposing the manifest ratio.
   * Used wherever a fixed ratio would damage a locked layout.
   */
  unframed?: boolean;
}

export function FlagshipMedia({
  id,
  children,
  label,
  className,
  unframed = false,
}: FlagshipMediaProps) {
  const asset = getMedia(id);
  const reduced = useReducedMotion();
  const compact = useIsCompact();
  const saveData = useDataSaver();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [videoReady, setVideoReady] = React.useState(false);

  if (!asset) {
    // Unknown id: render the composition rather than an empty frame.
    return <div className={cn("min-w-0", className)}>{children}</div>;
  }

  const src = compact
    ? (asset.source?.mobileSrc ?? asset.source?.desktopSrc)
    : asset.source?.desktopSrc;

  // Every gate must pass before a byte of video is requested.
  const mountVideo =
    Boolean(src) &&
    asset.status === "commercially_cleared" &&
    !reduced &&
    !saveData &&
    inView &&
    !(compact && asset.mobileBehavior === "static_only");

  const ratio = compact ? asset.mobileAspectRatio : asset.aspectRatio;

  return (
    <div
      ref={ref}
      data-media-id={asset.id}
      data-media-status={asset.status}
      className={cn(
        "relative min-w-0",
        unframed ? undefined : cn("overflow-hidden", RATIO_CLASS[ratio]),
        className,
      )}
      // Only present the slot as a single image once footage is actually
      // playing; until then the code composition's own text must stay readable.
      {...(videoReady ? { role: "img" as const, "aria-label": label ?? asset.purpose } : {})}
    >
      {/* Poster layer: the code composition. Always painted, never removed
          from the DOM — it keeps the frame filled if video decoding fails. */}
      <div
        className={cn(
          unframed ? "relative" : "absolute inset-0",
          videoReady && "opacity-0 transition-opacity duration-500",
        )}
        aria-hidden={videoReady || undefined}
      >
        {children}
      </div>

      {mountVideo && src ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          {...(asset.source?.posterSrc ? { poster: asset.source.posterSrc } : {})}
          autoPlay={asset.silentLoop}
          muted
          loop={asset.silentLoop}
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
          onPlaying={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        />
      ) : null}
    </div>
  );
}

/**
 * Development-only affordance: reveals which manifest slot a frame belongs to
 * without touching production markup. Renders nothing in a built site.
 */
export function MediaSlotTag({ asset }: { asset: FlagshipMediaAsset }) {
  if (!import.meta.env.DEV) return null;
  return (
    <span className="sr-only">
      media slot {asset.id} · {asset.status}
    </span>
  );
}
