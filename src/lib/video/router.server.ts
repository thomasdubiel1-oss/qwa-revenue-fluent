/**
 * SERVER ONLY — QWA VideoRouter.
 *
 * Provider-neutral: it asks every registered adapter for capabilities, health
 * and estimates, then delegates ranking to the pure heuristics in scoring.ts.
 * No provider-specific branching lives here or above this layer.
 */
import { normalizeJobRequest } from "./normalize";
import { listPlanningAdapters, listShotAdapters } from "./providers/index.server";
import {
  DEFAULT_HEURISTICS,
  rankProviders,
  SCORING_MODEL_VERSION,
  type ProviderScore,
  type ScoringContext,
  type ScoringHeuristic,
} from "./scoring";
import { createAttempt, createJob } from "./job";
import {
  COST_MODEL_NOTE,
  costComparison,
  WORKFLOW_PRESETS,
  type CostComparisonRow,
  type RoutingStrategy,
  type WorkflowPreset,
  type WorkflowPresetId,
} from "./presets";
import { evaluatePublishGate, type PublishGate } from "./usage-rights";
import type {
  ProviderCapabilities,
  ProviderStatus,
  UsageRightsStatus,
  VideoJob,
  VideoJobInput,
  VideoJobRequest,
} from "./types";

export interface PlanningStage {
  providerId: string;
  displayName: string;
  integrationMode: ProviderCapabilities["integrationMode"];
  health: ProviderStatus["health"];
  note: string;
  estimatedCostUsd: number;
  usageRightsStatus: UsageRightsStatus;
  capabilities: ProviderCapabilities["planning"];
}

export interface RoutingPlan {
  request: VideoJobRequest;
  strategy: RoutingStrategy;
  preset: WorkflowPreset;
  /** Pre-production hub(s) that own storyboard/shot planning for this job. */
  planning: PlanningStage[];
  /** Only the shots that must escalate to a premium provider. */
  escalationPolicy: string[];
  costComparison: CostComparisonRow[];
  costModelNote: string;
  publishGate: PublishGate;
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
  const { listAdapters } = await import("./providers/index.server");
  return Promise.all(listAdapters().map((adapter) => adapter.getStatus()));
}

async function buildPlanningStages(request: VideoJobRequest): Promise<PlanningStage[]> {
  const adapters = listPlanningAdapters();
  const statuses = await Promise.all(adapters.map((a) => a.getStatus()));
  return adapters.map((adapter, i) => {
    const caps = adapter.capabilities;
    const status = statuses[i]!;
    return {
      providerId: caps.id,
      displayName: caps.displayName,
      integrationMode: caps.integrationMode,
      health: status.health,
      note: status.note,
      estimatedCostUsd: Math.round(adapter.estimateCostUsd(request) * 100) / 100,
      usageRightsStatus: caps.defaultUsageRights,
      capabilities: caps.planning,
    };
  });
}

export async function buildScoringContexts(request: VideoJobRequest): Promise<ScoringContext[]> {
  const adapters = listShotAdapters();
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
  input: VideoJobInput & { presetId?: WorkflowPresetId },
  heuristics: ScoringHeuristic[] = DEFAULT_HEURISTICS,
): Promise<RoutingPlan> {
  const request = normalizeJobRequest(input);
  const preset =
    WORKFLOW_PRESETS[input.presetId ?? "low_cost_prototype"] ?? WORKFLOW_PRESETS.low_cost_prototype;
  const strategy = preset.strategy;
  const planning = await buildPlanningStages(request);
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
  if (strategy === "prototype_first") {
    const hub = planning[0];
    decision.unshift(
      hub
        ? `Prototype-first: ${hub.displayName} owns storyboard, shot plan and rough assembly (~$${hub.estimatedCostUsd.toFixed(2)}, ${hub.integrationMode === "manual_handoff" ? "manual handoff" : "API"}).`
        : "Prototype-first: no planning provider registered.",
    );
    decision.push("Premium generation is reserved for shots that fail the prototype quality bar.");
  } else {
    decision.unshift(
      "Commercial final: planning may run on the low-cost hub, but every delivered shot is generated on a commercial path.",
    );
  }
  decision.push("Simulated routing — scores are mock heuristics, not benchmarks.");

  const prototypeRights: UsageRightsStatus = planning.some(
    (p) => p.usageRightsStatus === "prototype_only",
  )
    ? "prototype_only"
    : "unknown";

  const escalationPolicy =
    strategy === "prototype_first"
      ? [
          "Assemble the full spot from prototype material first.",
          "Score each shot; only shots below the quality threshold escalate.",
          primary
            ? `Escalated shots route to ${primary.displayName}, then ${
                eligible
                  .slice(1, 3)
                  .map((r) => r.displayName)
                  .join(" → ") || "no fallback"
              }.`
            : "No eligible premium provider for escalation.",
          "Prototype material never ships: it is replaced or cleared before publish.",
        ]
      : [
          "Every delivered shot is generated by a ranked commercial provider.",
          "Planning artifacts stay internal and are not published.",
          "Each asset needs a recorded human clearance before publish.",
        ];

  return {
    request,
    strategy,
    preset,
    planning,
    escalationPolicy,
    costComparison: costComparison(),
    costModelNote: COST_MODEL_NOTE,
    publishGate: evaluatePublishGate(prototypeRights, [], "ready_for_publish"),
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
