/**
 * Pure provider scoring/ranking heuristics — no I/O, unit-testable.
 *
 * NON-PRODUCTION: weights and estimates below are mock heuristics used to
 * exercise the routing architecture. They are not calibrated against real
 * provider benchmarks or real billing data.
 */
import { clipsRequired } from "./normalize";
import type { ProviderCapabilities, ProviderId, ProviderStatus, VideoJobRequest } from "./types";

export const SCORING_MODEL_VERSION = "mock-heuristic-v1";

export interface ScoringWeights {
  capability: number;
  quality: number;
  cost: number;
  latency: number;
  availability: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  capability: 0.34,
  quality: 0.24,
  cost: 0.18,
  latency: 0.14,
  availability: 0.1,
};

/** A pluggable heuristic. Return 0..1; `null` means "no opinion". */
export interface ScoringHeuristic {
  id: string;
  label: string;
  weight: number;
  score(ctx: ScoringContext): number | null;
}

export interface ScoringContext {
  request: VideoJobRequest;
  capabilities: ProviderCapabilities;
  status: ProviderStatus;
  estimatedCostUsd: number;
  estimatedLatencySeconds: number;
}

export interface ProviderScore {
  providerId: ProviderId;
  displayName: string;
  score: number;
  eligible: boolean;
  /** Hard requirements the provider cannot meet. */
  blockers: string[];
  /** Human-readable "why this rank" trail for auditability. */
  rationale: string[];
  estimatedCostUsd: number;
  estimatedLatencySeconds: number;
  clipsRequired: number;
  health: ProviderStatus["health"];
  modelVersion: string;
}

const QUALITY_RANK: Record<ProviderCapabilities["qualityTier"], number> = {
  efficient: 0.4,
  balanced: 0.7,
  premium: 1,
};

/** Hard eligibility gates — a provider failing any of these is never selected. */
export function findBlockers(request: VideoJobRequest, caps: ProviderCapabilities): string[] {
  const blockers: string[] = [];
  if (!caps.aspectRatios.includes(request.aspectRatio)) {
    blockers.push(`Does not support ${request.aspectRatio}`);
  }
  if (request.audioRequired && !caps.supportsAudio) {
    blockers.push("No native audio generation");
  }
  if (request.characterConsistencyRequired && !caps.supportsCharacterConsistency) {
    blockers.push("No character consistency controls");
  }
  if (request.referenceAssets.length > 0 && !caps.supportsReferenceAssets) {
    blockers.push("No reference asset support");
  }
  if (request.durationTargetSeconds > caps.maxClipDurationSeconds && !caps.supportsExtension) {
    blockers.push(
      `Cannot reach ${request.durationTargetSeconds}s (max clip ${caps.maxClipDurationSeconds}s, no extension)`,
    );
  }
  return blockers;
}

function costScore(ctx: ScoringContext): number {
  const { costCeilingUsd } = ctx.request;
  if (costCeilingUsd > 0) {
    if (ctx.estimatedCostUsd > costCeilingUsd) return 0;
    return 1 - ctx.estimatedCostUsd / costCeilingUsd;
  }
  // No ceiling: normalize against a nominal $40 job budget.
  return Math.max(0, 1 - ctx.estimatedCostUsd / 40);
}

function latencyScore(ctx: ScoringContext): number {
  // Normalize against a nominal 20-minute worst case.
  const raw = Math.max(0, 1 - ctx.estimatedLatencySeconds / 1200);
  const bias =
    ctx.request.latencyPreference === "fastest"
      ? 1.25
      : ctx.request.latencyPreference === "quality-first"
        ? 0.6
        : 1;
  return Math.min(1, raw * bias);
}

function qualityScore(ctx: ScoringContext): number {
  const tier = QUALITY_RANK[ctx.capabilities.qualityTier];
  const target = QUALITY_RANK[ctx.request.qualityTarget];
  // Reward meeting the target; mildly penalize overshoot (paying for unused headroom).
  return tier >= target ? 1 - (tier - target) * 0.15 : Math.max(0, 1 - (target - tier) * 0.9);
}

function capabilityScore(ctx: ScoringContext): number {
  const { capabilities: caps, request } = ctx;
  let score = 0.55;
  const clips = clipsRequired(request.durationTargetSeconds, caps.maxClipDurationSeconds);
  if (clips <= 1) score += 0.2;
  else if (clips <= 4) score += 0.1;
  else score -= 0.1;
  if (request.audioRequired && caps.supportsAudio) score += 0.1;
  if (request.referenceAssets.length > 0 && caps.supportsReferenceAssets) score += 0.08;
  if (request.characterConsistencyRequired && caps.supportsCharacterConsistency) score += 0.08;
  if (request.aspectRatio === "9:16" && caps.aspectRatios.includes("9:16")) score += 0.04;
  return Math.max(0, Math.min(1, score));
}

function availabilityScore(ctx: ScoringContext): number {
  switch (ctx.status.health) {
    case "ready":
      return 1;
    case "degraded":
      return 0.45;
    case "unknown":
      return 0.3;
    default:
      return 0;
  }
}

export const DEFAULT_HEURISTICS: ScoringHeuristic[] = [
  {
    id: "capability",
    label: "Capability fit",
    weight: DEFAULT_WEIGHTS.capability,
    score: capabilityScore,
  },
  {
    id: "quality",
    label: "Quality tier match",
    weight: DEFAULT_WEIGHTS.quality,
    score: qualityScore,
  },
  { id: "cost", label: "Cost efficiency", weight: DEFAULT_WEIGHTS.cost, score: costScore },
  { id: "latency", label: "Latency fit", weight: DEFAULT_WEIGHTS.latency, score: latencyScore },
  {
    id: "availability",
    label: "Availability",
    weight: DEFAULT_WEIGHTS.availability,
    score: availabilityScore,
  },
];

function describe(label: string, value: number): string {
  return `${label}: ${(value * 100).toFixed(0)}/100`;
}

export function scoreProvider(
  ctx: ScoringContext,
  heuristics: ScoringHeuristic[] = DEFAULT_HEURISTICS,
): ProviderScore {
  const blockers = findBlockers(ctx.request, ctx.capabilities);
  const rationale: string[] = [];
  let total = 0;
  let weightSum = 0;

  for (const h of heuristics) {
    const value = h.score(ctx);
    if (value === null) continue;
    const clamped = Math.max(0, Math.min(1, value));
    total += clamped * h.weight;
    weightSum += h.weight;
    rationale.push(describe(h.label, clamped));
  }

  const normalized = weightSum > 0 ? total / weightSum : 0;
  const clips = clipsRequired(
    ctx.request.durationTargetSeconds,
    ctx.capabilities.maxClipDurationSeconds,
  );

  rationale.push(
    `${clips} generation${clips === 1 ? "" : "s"} needed for ${ctx.request.durationTargetSeconds}s`,
  );
  if (blockers.length > 0) rationale.push(`Blocked: ${blockers.join("; ")}`);
  if (!ctx.status.configured) {
    rationale.push(`Credentials missing: ${ctx.status.missingEnv.join(", ") || "unknown"}`);
  }

  return {
    providerId: ctx.capabilities.id,
    displayName: ctx.capabilities.displayName,
    score: blockers.length > 0 ? 0 : Math.round(normalized * 1000) / 1000,
    eligible: blockers.length === 0,
    blockers,
    rationale,
    estimatedCostUsd: Math.round(ctx.estimatedCostUsd * 100) / 100,
    estimatedLatencySeconds: Math.round(ctx.estimatedLatencySeconds),
    clipsRequired: clips,
    health: ctx.status.health,
    modelVersion: SCORING_MODEL_VERSION,
  };
}

/** Rank descending by score; ineligible providers always sort last. */
export function rankProviders(
  contexts: ScoringContext[],
  heuristics: ScoringHeuristic[] = DEFAULT_HEURISTICS,
): ProviderScore[] {
  return contexts
    .map((ctx) => scoreProvider(ctx, heuristics))
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      if (b.score !== a.score) return b.score - a.score;
      return a.estimatedCostUsd - b.estimatedCostUsd;
    });
}
