/**
 * Pure input normalization. No I/O, no provider knowledge — unit-testable.
 */
import type {
  AspectRatio,
  DurationTarget,
  LatencyPreference,
  QualityTier,
  VideoJobInput,
  VideoJobRequest,
} from "./types";

export const DURATION_TARGETS: DurationTarget[] = [15, 30, 60];
export const ASPECT_RATIOS: AspectRatio[] = ["16:9", "9:16", "1:1"];
export const QUALITY_TIERS: QualityTier[] = ["efficient", "balanced", "premium"];
export const LATENCY_PREFERENCES: LatencyPreference[] = ["fastest", "balanced", "quality-first"];

const MAX_OUTPUTS = 4;

/** Snap any number to the nearest first-class ad length. */
export function normalizeDuration(value: number | undefined): DurationTarget {
  if (typeof value !== "number" || !Number.isFinite(value)) return 30;
  return DURATION_TARGETS.reduce<DurationTarget>(
    (best, candidate) => (Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best),
    DURATION_TARGETS[0]!,
  );
}

export function normalizeAspectRatio(value: string | undefined): AspectRatio {
  return ASPECT_RATIOS.includes(value as AspectRatio) ? (value as AspectRatio) : "16:9";
}

export function normalizeQuality(value: string | undefined): QualityTier {
  return QUALITY_TIERS.includes(value as QualityTier) ? (value as QualityTier) : "balanced";
}

export function normalizeLatencyPreference(value: string | undefined): LatencyPreference {
  return LATENCY_PREFERENCES.includes(value as LatencyPreference)
    ? (value as LatencyPreference)
    : "balanced";
}

function clampOutputCount(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.min(MAX_OUTPUTS, Math.max(1, Math.round(value)));
}

function clampCostCeiling(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * 100) / 100;
}

/** Turn partial/untrusted input into a complete, valid job request. */
export function normalizeJobRequest(input: VideoJobInput): VideoJobRequest {
  return {
    objective: (input.objective ?? "").trim() || "Untitled creative objective",
    prompt: (input.prompt ?? "").trim(),
    durationTargetSeconds: normalizeDuration(input.durationTargetSeconds),
    aspectRatio: normalizeAspectRatio(input.aspectRatio),
    qualityTarget: normalizeQuality(input.qualityTarget),
    costCeilingUsd: clampCostCeiling(input.costCeilingUsd),
    latencyPreference: normalizeLatencyPreference(input.latencyPreference),
    audioRequired: input.audioRequired === true,
    characterConsistencyRequired: input.characterConsistencyRequired === true,
    referenceAssets: Array.isArray(input.referenceAssets) ? input.referenceAssets : [],
    outputCount: clampOutputCount(input.outputCount),
  };
}

/**
 * How many generations a provider needs to cover the target duration,
 * given its maximum single-clip length.
 */
export function clipsRequired(
  durationTargetSeconds: number,
  maxClipDurationSeconds: number,
): number {
  if (maxClipDurationSeconds <= 0) return 0;
  return Math.ceil(durationTargetSeconds / maxClipDurationSeconds);
}
