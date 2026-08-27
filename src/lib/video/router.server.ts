/**
 * SERVER ONLY — QWA VideoRouter.
 *
 * Provider-neutral: it asks every registered adapter for capabilities, health
 * and estimates, then delegates ranking to the pure heuristics in scoring.ts.
 * No provider-specific branching lives here or above this layer.
 */
import { normalizeJobRequest } from "./normalize";
import { listAdapters } from "./providers/index.server";
import {
  DEFAULT_HEURISTICS,
  rankProviders,
  SCORING_MODEL_VERSION,
  type ProviderScore,
  type ScoringContext,
  type ScoringHeuristic,
} from "./scoring";
import { createAttempt, createJob } from "./job";
import type { ProviderStatus, VideoJob, VideoJobInput, VideoJobRequest } from "./types";

export interface RoutingPlan {
  request: VideoJobRequest;
  ranked: ProviderScore[];
  /** Highest-scoring eligible provider, or null when none qualifies. */
  primary: ProviderScore | null;
  /** Ordered graceful-fallback chain after the primary. */
  fallbacks: ProviderScore[];
  /** Audit trail for why the primary won. */
  decision: string[];
  modelVersion: string;
  simulated: true;
  generatedAt: string;
}

export async function getProviderStatuses(): Promise<ProviderStatus[]> {
  return Promise.all(listAdapters().map((adapter) => adapter.getStatus()));
}

export async function buildScoringContexts(
  request: VideoJobRequest,
): Promise<ScoringContext[]> {
  const adapters = listAdapters();
  const statuses = await Promise.all(adapters.map((a) => a.getStatus()));
  return adapters.map((adapter, i) => ({
    request,
    capabilities: adapter.capabilities,
    status: statuses[i]!,
    estimatedCostUsd: adapter.estimateCostUsd(request),
    estimatedLatencySeconds: adapter.estimateLatencySeconds(request),
  }));
}

export async function planRoute(
  input: VideoJobInput,
  heuristics: ScoringHeuristic[] = DEFAULT_HEURISTICS,
): Promise<RoutingPlan> {
  const request = normalizeJobRequest(input);
  const ranked = rankProviders(await buildScoringContexts(request), heuristics);
  const eligible = ranked.filter((r) => r.eligible);
  const primary = eligible[0] ?? null;

  const decision: string[] = [];
  if (primary) {
    decision.push(
      `${primary.displayName} ranked first at ${(primary.score * 100).toFixed(0)}/100.`,
    );
    decision.push(...primary.rationale);
    const runnerUp = eligible[1];
    if (runnerUp) {
      decision.push(
        `Ahead of ${runnerUp.displayName} by ${((primary.score - runnerUp.score) * 100).toFixed(0)} points.`,
      );
    }
    decision.push(
      `Estimated $${primary.estimatedCostUsd.toFixed(2)} and ~${Math.round(primary.estimatedLatencySeconds / 60)} min for ${request.durationTargetSeconds}s.`,
    );
  } else {
    decision.push("No provider satisfies every hard requirement for this job.");
    for (const r of ranked) {
      if (r.blockers.length > 0) decision.push(`${r.displayName}: ${r.blockers.join("; ")}`);
    }
  }
  decision.push("Simulated routing — scores are mock heuristics, not benchmarks.");

  return {
    request,
    ranked,
    primary,
    fallbacks: eligible.slice(1),
    decision,
    modelVersion: SCORING_MODEL_VERSION,
    simulated: true,
    generatedAt: new Date().toISOString(),
  };
}

/** Build a draft job from a plan. Not persisted — future Postgres insert point. */
export function draftJobFromPlan(id: string, plan: RoutingPlan): VideoJob {
  const attempts = (plan.primary ? [plan.primary, ...plan.fallbacks] : plan.ranked).map((r) =>
    createAttempt(r.providerId, r.estimatedCostUsd, r.estimatedLatencySeconds),
  );
  return createJob(id, plan.request, attempts);
}
