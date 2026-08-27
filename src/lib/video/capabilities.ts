/**
 * Static capability registry. Client-safe: contains no endpoints and no secrets.
 * Adapters import their entry from here so capability discovery has one source.
 */
import type { ProviderCapabilities, ProviderId } from "./types";

export const PROVIDER_CAPABILITIES: Record<ProviderId, ProviderCapabilities> = {
  veo: {
    id: "veo",
    displayName: "Google Veo",
    summary: "High-fidelity generation with native audio; strongest all-round default.",
    supportedClipDurations: [4, 6, 8],
    maxClipDurationSeconds: 8,
    aspectRatios: ["16:9", "9:16"],
    supportsAudio: true,
    supportsImageToVideo: true,
    supportsReferenceAssets: true,
    supportsExtension: true,
    supportsCharacterConsistency: true,
    qualityTier: "premium",
    maxResolution: "4k",
  },
  seedance: {
    id: "seedance",
    displayName: "ByteDance Seedance",
    summary: "Fast, cost-efficient multi-shot generation; strong motion for short-form.",
    supportedClipDurations: [5, 10],
    maxClipDurationSeconds: 10,
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsAudio: false,
    supportsImageToVideo: true,
    supportsReferenceAssets: false,
    supportsExtension: false,
    supportsCharacterConsistency: false,
    qualityTier: "efficient",
    maxResolution: "1080p",
  },
  kling: {
    id: "kling",
    displayName: "Kling",
    summary: "Long single takes and controllable motion; useful for product hero shots.",
    supportedClipDurations: [5, 10],
    maxClipDurationSeconds: 10,
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsAudio: false,
    supportsImageToVideo: true,
    supportsReferenceAssets: true,
    supportsExtension: true,
    supportsCharacterConsistency: true,
    qualityTier: "balanced",
    maxResolution: "1080p",
  },
  runway: {
    id: "runway",
    displayName: "Runway",
    summary: "Editorial control and reference-driven styling; predictable creative direction.",
    supportedClipDurations: [5, 10],
    maxClipDurationSeconds: 10,
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsAudio: false,
    supportsImageToVideo: true,
    supportsReferenceAssets: true,
    supportsExtension: true,
    supportsCharacterConsistency: true,
    qualityTier: "balanced",
    maxResolution: "1080p",
  },
  higgsfield: {
    id: "higgsfield",
    displayName: "Higgsfield",
    summary: "Camera-motion presets and character-led performance shots.",
    supportedClipDurations: [3, 5],
    maxClipDurationSeconds: 5,
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsAudio: false,
    supportsImageToVideo: true,
    supportsReferenceAssets: true,
    supportsExtension: false,
    supportsCharacterConsistency: true,
    qualityTier: "efficient",
    maxResolution: "1080p",
  },
};

export const PROVIDER_IDS = Object.keys(PROVIDER_CAPABILITIES) as ProviderId[];

export function getCapabilities(id: ProviderId): ProviderCapabilities {
  return PROVIDER_CAPABILITIES[id];
}
