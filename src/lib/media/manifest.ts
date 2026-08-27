/**
 * QWA flagship media manifest.
 *
 * Every entry ships with a working code composition today. `source: null` on
 * all of them is deliberate: no external footage has been generated, so no
 * <video> element is mounted anywhere and nothing can 404 or render broken.
 *
 * Production rule for anything marked `externalGenerationRequired`:
 *   LTX storyboard/prototype  →  human evaluation  →  premium provider for
 *   approved shots only  →  commercial clearance  →  bind `source` here.
 */
import type { FlagshipMediaAsset, MediaPriority } from "./types";

export const FLAGSHIP_MEDIA: FlagshipMediaAsset[] = [
  {
    id: "home-hero",
    route: "/",
    placement: "Homepage hero, right column",
    purpose:
      "Establish QWA as a revenue operating system: scattered customer signals resolve into one governed loop that returns revenue to its source.",
    kind: "video_with_code_fallback",
    status: "needs_generation",
    priority: "P0",
    aspectRatio: "4:3",
    mobileAspectRatio: "4:5",
    targetDurationSeconds: 15,
    silentLoop: true,
    mobileBehavior: "recompose",
    reducedMotion: "poster_only",
    fallbackComponent: "SignalFlow",
    externalGenerationRequired: true,
    providerPreference: ["ltx", "veo", "runway"],
    usageRightsStatus: "unknown",
    shotBrief:
      "PLACEHOLDER — 12-18s silent loop, no cuts to camera, no people, no UI screenshots. Abstract precision: fine light traces entering from five directions at different rhythms, converging on a single calm structure, resolving into one continuous returning path. Paper-white ground, ink linework, one deep teal accent. Restraint over spectacle; must loop seamlessly and read at 25% opacity behind nothing. No text, no logos, no product claims.",
    notes:
      "The only slot where generative video is clearly worth the spend. Code fallback (SignalFlow) is production-quality and ships until footage clears.",
    source: null,
  },
  {
    id: "revenue-engine-loop",
    route: "/products/revenue-engine",
    placement: "Pinned scroll sequence, mid-page",
    purpose:
      "Walk the closed loop end to end: lead, response, qualification, voice/SMS, appointment, salesperson assist, sale, attribution, reactivation.",
    kind: "code_motion",
    status: "code_ready",
    priority: "P0",
    aspectRatio: "16:9",
    mobileAspectRatio: "4:5",
    targetDurationSeconds: null,
    silentLoop: false,
    mobileBehavior: "recompose",
    reducedMotion: "resolved_state",
    fallbackComponent: "LoopRail / RevenueEngine",
    externalGenerationRequired: false,
    providerPreference: [],
    usageRightsStatus: "commercially_cleared",
    shotBrief:
      "Not applicable — generative video cannot render legible state, labels or record continuity. Code only.",
    notes:
      "Scroll-driven, so duration is reader-controlled. Reduced motion renders every stage resolved and readable at once.",
    source: null,
  },
  {
    id: "attribution-return-path",
    route: "/products/attribution",
    placement: "Signature visual, hero column",
    purpose:
      "Show revenue travelling backward: source, lead, conversation, appointment, sale, then the dollar amount returned to the campaign that produced it.",
    kind: "code_motion",
    status: "code_ready",
    priority: "P0",
    aspectRatio: "4:3",
    mobileAspectRatio: "1:1",
    targetDurationSeconds: null,
    silentLoop: false,
    mobileBehavior: "recompose",
    reducedMotion: "resolved_state",
    fallbackComponent: "RevenueReturnPathVisual",
    externalGenerationRequired: false,
    providerPreference: [],
    usageRightsStatus: "commercially_cleared",
    shotBrief:
      "Not applicable — the beat depends on exact figures tracing a named path. Code only.",
    notes: "Numbers are illustrative and labelled as such in the panel footer.",
    source: null,
  },
  {
    id: "voice-continuity",
    route: "/products/voice",
    placement: "Continuity rail, hero column",
    purpose:
      "One customer record stays intact across a call, an SMS thread and the CRM without the customer repeating themselves.",
    kind: "code_motion",
    status: "code_ready",
    priority: "P1",
    aspectRatio: "4:3",
    mobileAspectRatio: "1:1",
    targetDurationSeconds: null,
    silentLoop: false,
    mobileBehavior: "recompose",
    reducedMotion: "resolved_state",
    fallbackComponent: "ContinuityRailVisual",
    externalGenerationRequired: false,
    providerPreference: [],
    usageRightsStatus: "commercially_cleared",
    shotBrief:
      "Not applicable for video. A future audio demo slot is reserved separately (voice-audio-demo).",
    notes: "Channel handoff must stay legible; motion only advances the active channel.",
    source: null,
  },
  {
    id: "voice-audio-demo",
    route: "/products/voice",
    placement: "Below the continuity rail (reserved, not yet rendered)",
    purpose:
      "Let a prospect hear a real QWA answer-and-qualify exchange, with transcript alongside.",
    kind: "reserved",
    status: "needs_generation",
    priority: "P2",
    aspectRatio: "16:9",
    mobileAspectRatio: "16:9",
    targetDurationSeconds: 30,
    silentLoop: false,
    mobileBehavior: "static_only",
    reducedMotion: "poster_only",
    fallbackComponent: "— (slot not mounted until a real recording exists)",
    externalGenerationRequired: false,
    providerPreference: [],
    usageRightsStatus: "unknown",
    shotBrief:
      "Requires a genuine recorded call with documented consent from both parties. Do not synthesise a fake customer.",
    notes:
      "Intentionally not rendered. A synthetic 'customer call' would be a fabricated claim.",
    source: null,
  },
  {
    id: "live-commerce-room",
    route: "/products/live-commerce",
    placement: "Live room console, hero column",
    purpose:
      "A live room turns an offer into a cart, an order, and an attributed line of revenue while the room is still running.",
    kind: "video_with_code_fallback",
    status: "needs_generation",
    priority: "P1",
    aspectRatio: "16:9",
    mobileAspectRatio: "9:16",
    targetDurationSeconds: 12,
    silentLoop: true,
    mobileBehavior: "dedicated_crop",
    reducedMotion: "poster_only",
    fallbackComponent: "LiveRoomConsoleVisual",
    externalGenerationRequired: true,
    providerPreference: ["ltx", "kling", "runway"],
    usageRightsStatus: "unknown",
    shotBrief:
      "PLACEHOLDER — 10-15s silent loop. Atmosphere only: soft studio light falling across a neutral set, shallow depth, slow drift. No identifiable faces, no brands, no on-screen products, no captions. Exists to sit behind the console UI, not to demonstrate a product.",
    notes:
      "Console UI stays code-driven and always readable. Footage is background texture and must never carry information.",
    source: null,
  },
  {
    id: "decision-intelligence-guardrail",
    route: "/products/decision-intelligence",
    placement: "Decision record, hero column",
    purpose:
      "An approval leads to a guarded action, an observed outcome, and either a rollback or a recorded lesson.",
    kind: "code_motion",
    status: "code_ready",
    priority: "P1",
    aspectRatio: "4:3",
    mobileAspectRatio: "1:1",
    targetDurationSeconds: null,
    silentLoop: false,
    mobileBehavior: "recompose",
    reducedMotion: "resolved_state",
    fallbackComponent: "DecisionRecordVisual",
    externalGenerationRequired: false,
    providerPreference: [],
    usageRightsStatus: "commercially_cleared",
    shotBrief: "Not applicable — governance detail must be readable, not cinematic.",
    notes: "Rollback state must be reachable and visible, not implied.",
    source: null,
  },
  {
    id: "creative-studio-pipeline",
    route: "/products/creative-studio",
    placement: "Production pipeline, hero column",
    purpose:
      "Storyboard and prototype come first; premium generation is spent only on approved shots, and nothing publishes without clearance.",
    kind: "code_motion",
    status: "code_ready",
    priority: "P1",
    aspectRatio: "4:3",
    mobileAspectRatio: "1:1",
    targetDurationSeconds: null,
    silentLoop: false,
    mobileBehavior: "recompose",
    reducedMotion: "resolved_state",
    fallbackComponent: "ProductionPipelineVisual",
    externalGenerationRequired: false,
    providerPreference: [],
    usageRightsStatus: "commercially_cleared",
    shotBrief:
      "Not applicable — the pipeline is the argument for spending less on generation, so it should not be generated.",
    notes: "Mirrors the LTX prototype-first architecture in the Creative Engine.",
    source: null,
  },
];

export const MEDIA_BY_ID: Record<string, FlagshipMediaAsset> = Object.fromEntries(
  FLAGSHIP_MEDIA.map((m) => [m.id, m]),
);

export function getMedia(id: string): FlagshipMediaAsset | undefined {
  return MEDIA_BY_ID[id];
}

export function mediaForRoute(route: string): FlagshipMediaAsset[] {
  return FLAGSHIP_MEDIA.filter((m) => m.route === route);
}

export const PRIORITY_ORDER: MediaPriority[] = ["P0", "P1", "P2"];

export function productionQueue(): FlagshipMediaAsset[] {
  return [...FLAGSHIP_MEDIA].sort(
    (a, b) =>
      PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority) ||
      Number(b.externalGenerationRequired) - Number(a.externalGenerationRequired),
  );
}

/** Slots that genuinely warrant spending generation credits. */
export function externalGenerationQueue(): FlagshipMediaAsset[] {
  return productionQueue().filter((m) => m.externalGenerationRequired);
}

export const MEDIA_STATUS_LABEL: Record<FlagshipMediaAsset["status"], string> = {
  code_ready: "Code ready",
  needs_generation: "Needs generation",
  prototype_only: "Prototype only",
  commercially_cleared: "Commercially cleared",
};

export const MOBILE_BEHAVIOR_LABEL: Record<FlagshipMediaAsset["mobileBehavior"], string> = {
  recompose: "Recomposes for portrait",
  dedicated_crop: "Dedicated portrait crop required",
  static_only: "Static on small screens",
};

export const REDUCED_MOTION_LABEL: Record<FlagshipMediaAsset["reducedMotion"], string> = {
  resolved_state: "Renders fully resolved state",
  poster_only: "Poster / code composition only",
};
