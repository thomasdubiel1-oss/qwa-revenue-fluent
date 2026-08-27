/**
 * QWA flagship media foundation — types.
 *
 * The manifest is the single source of truth for every high-end media slot on
 * the public site. A slot exists in code before any footage does: each entry
 * declares its story beat, geometry, fallback strategy and production status,
 * so the site is premium and complete with zero external assets present.
 *
 * Nothing here fabricates footage. `source === null` means the slot renders its
 * code-driven composition and no <video> element is created at all.
 */
import type { ProviderId, UsageRightsStatus } from "@/lib/video/types";

/** How the slot is currently satisfied. */
export type MediaKind =
  /** Rendered entirely in code (SVG/DOM/Motion/GSAP). No footage wanted. */
  | "code_motion"
  /** Code composition today; an external clip is genuinely worth producing. */
  | "video_with_code_fallback"
  /** Reserved slot with no committed medium yet (e.g. future audio demo). */
  | "reserved";

export type MediaStatus =
  /** Shipped and complete as a code composition. */
  | "code_ready"
  /** Code fallback ships; an external asset is queued for production. */
  | "needs_generation"
  /** An asset exists but was made on a non-commercial plan. Internal only. */
  | "prototype_only"
  /** Human-recorded clearance; safe for public delivery. */
  | "commercially_cleared";

export type MediaPriority = "P0" | "P1" | "P2";

export type AspectRatioToken = "16:9" | "4:3" | "3:2" | "1:1" | "4:5" | "9:16";

/**
 * What mobile gets. Mobile is never a shrunken desktop frame: either the
 * composition re-lays out, or a purpose-built crop/asset is required.
 */
export type MobileBehavior =
  /** Composition reflows to a taller, fewer-element arrangement. */
  | "recompose"
  /** A separately produced portrait/square crop is required. */
  | "dedicated_crop"
  /** Motion is dropped on small screens; the static state renders. */
  | "static_only";

/** What a reduced-motion visitor sees. Must always be a complete state. */
export type ReducedMotionBehavior =
  /** Animation stops at its resolved final frame — full story visible. */
  | "resolved_state"
  /** Video is never mounted; the poster/code composition renders. */
  | "poster_only";

/** A concrete video file bound to a slot. Absent until footage is cleared. */
export interface MediaSource {
  /** Landscape/desktop file. */
  desktopSrc: string;
  /** Purpose-built portrait or square crop. */
  mobileSrc?: string;
  /** Static first-frame image; prevents any flash or layout shift. */
  posterSrc?: string;
  type?: string;
}

/**
 * An approved external STILL image bound to a slot.
 *
 * Provider-agnostic: the still can come from any tool. It renders only when
 * `rightsStatus === "commercially_cleared"`, which is only ever set by the
 * human clearance mechanism (see lib/video/usage-rights).
 */
export interface MediaStill {
  /** Landscape/desktop image URL. */
  desktopSrc: string;
  /** Purpose-built portrait/square crop. Absent = code fallback on mobile. */
  mobileSrc?: string;
  /** Aspect ratio the still was authored at; overrides the slot ratio. */
  aspectRatio?: AspectRatioToken;
  /** CSS object-position for framing; never distort the image. */
  objectPosition?: string;
  /** Business-story alt text. */
  alt: string;
  rightsStatus: UsageRightsStatus;
  /** Named human who confirmed clearance in QWA. */
  clearedBy?: string;
  clearedAt?: string;
  provider?: string;
  notes?: string;
}


export interface FlagshipMediaAsset {
  id: string;
  /** Public route this slot lives on. */
  route: string;
  /** Where in the page, in plain language. */
  placement: string;
  /** The story beat this media must carry. One sentence. */
  purpose: string;
  kind: MediaKind;
  status: MediaStatus;
  priority: MediaPriority;

  aspectRatio: AspectRatioToken;
  mobileAspectRatio: AspectRatioToken;
  /** Target loop length in seconds. `null` for open-ended scroll sequences. */
  targetDurationSeconds: number | null;
  /** Silent loop = muted, looping, no audio track authored. */
  silentLoop: boolean;

  mobileBehavior: MobileBehavior;
  reducedMotion: ReducedMotionBehavior;

  /** Name of the code composition that renders when no footage exists. */
  fallbackComponent: string;

  /** True only when a code composition cannot carry the beat well enough. */
  externalGenerationRequired: boolean;
  /** Ordered provider preference, planning hub first. Empty when code-first. */
  providerPreference: ProviderId[];
  usageRightsStatus: UsageRightsStatus;

  /** Shot brief placeholder. Written now, generated later. */
  shotBrief: string;
  notes: string;

  /** Bound footage. `null` until an asset is produced AND cleared. */
  source: MediaSource | null;
}
