/**
 * Evaluation layer contract for candidate outputs.
 *
 * PLACEHOLDER / MOCKED. No model, no ML scoring and no human review exist yet.
 * `MockEvaluator` returns deterministic pseudo-scores derived from job metadata
 * purely so downstream selection logic can be built and tested. Never present
 * these numbers as measured quality.
 */
import type { ProviderAttempt, VideoJob, VideoJobRequest } from "./types";

export const EVALUATION_DIMENSIONS = [
  "promptAdherence",
  "visualQuality",
  "motionCoherence",
  "characterConsistency",
  "brandSafety",
  "audioQuality",
  "textLegibility",
  "commercialUsability",
] as const;

export type EvaluationDimension = (typeof EVALUATION_DIMENSIONS)[number];

export interface EvaluationScores extends Record<EvaluationDimension, number> {}

export interface EvaluationResult {
  attemptProviderId: ProviderAttempt["providerId"];
  /** 0..1 weighted composite. */
  overall: number;
  scores: EvaluationScores;
  /** Always true until a real evaluator ships. */
  mocked: true;
  method: string;
  notes: string[];
}

export interface OutputEvaluator {
  readonly id: string;
  readonly mocked: boolean;
  evaluate(job: VideoJob, attempt: ProviderAttempt): Promise<EvaluationResult>;
}

const DIMENSION_WEIGHTS: Record<EvaluationDimension, number> = {
  promptAdherence: 0.2,
  visualQuality: 0.18,
  motionCoherence: 0.14,
  characterConsistency: 0.12,
  brandSafety: 0.12,
  audioQuality: 0.08,
  textLegibility: 0.08,
  commercialUsability: 0.08,
};

/** Deterministic hash so mock scores are stable across renders. */
function pseudoScore(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 0.55 + (Math.abs(h) % 400) / 1000; // 0.55 – 0.95
}

export function mockScores(
  request: VideoJobRequest,
  providerId: string,
): EvaluationScores {
  const scores = {} as EvaluationScores;
  for (const dim of EVALUATION_DIMENSIONS) {
    scores[dim] = Number(pseudoScore(`${providerId}:${dim}:${request.aspectRatio}`).toFixed(3));
  }
  if (!request.audioRequired) scores.audioQuality = 0;
  return scores;
}

export function compositeScore(scores: EvaluationScores): number {
  let total = 0;
  for (const dim of EVALUATION_DIMENSIONS) total += scores[dim] * DIMENSION_WEIGHTS[dim];
  return Number(total.toFixed(3));
}

export class MockEvaluator implements OutputEvaluator {
  readonly id = "mock-evaluator-v0";
  readonly mocked = true;

  async evaluate(job: VideoJob, attempt: ProviderAttempt): Promise<EvaluationResult> {
    const scores = mockScores(job.request, attempt.providerId);
    return {
      attemptProviderId: attempt.providerId,
      overall: compositeScore(scores),
      scores,
      mocked: true,
      method: this.id,
      notes: ["Simulated scores — no output was generated or inspected."],
    };
  }
}
