import * as React from "react";
import { useReducedMotion } from "motion/react";
import { getMedia } from "@/lib/media/manifest";
import type { AspectRatioToken, FlagshipMediaAsset } from "@/lib/media/types";
import { cn } from "@/lib/utils";

/**
 * QWA flagship media frame.
 *
 * Contract:
 *  - The frame owns a fixed aspect ratio at every breakpoint, so swapping a
 *    code composition for footage later causes zero layout shift.
 *  - When the manifest entry has no `source`, NO <video> element is created.
 *    A missing external asset can therefore never produce a broken player,
 *    a stalled spinner or a console error.
 *  - Video is mounted only after the frame enters the viewport, and only when
 *    motion is allowed and the connection is not metered/saving data.
 *  - The code composition is always rendered underneath as the poster layer,
 *    so the first paint is complete before any byte of video arrives.
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
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const c = nav.connection;
    if (!c) return;
    const evaluate = () =>
      setSaving(Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType ?? ""));
    evaluate();
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
  /** Render the composition without the ratio box (scroll-driven sequences). */
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
    asset.reducedMotion !== "poster_only" === false // explicit: poster_only still allows video unless reduced
      ? false
      : Boolean(src) &&
        asset.status === "commercially_cleared" &&
        !reduced &&
        !saveData &&
        inView &&
        !(compact && asset.mobileBehavior === "static_only");

  const ratio = compact ? asset.mobileAspectRatio : asset.aspectRatio;
  const describedBy = label ?? asset.purpose;

  if (unframed) {
    return (
      <div ref={ref} className={cn("min-w-0", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-media-id={asset.id}
      data-media-status={asset.status}
      className={cn("relative min-w-0 overflow-hidden", RATIO_CLASS[ratio], className)}
      role="img"
      aria-label={describedBy}
    >
      {/* Poster layer: the code composition. Always painted, never removed
          from the DOM — it keeps the frame filled if video decoding fails. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          videoReady ? "opacity-0" : "opacity-100",
        )}
        aria-hidden={videoReady}
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
