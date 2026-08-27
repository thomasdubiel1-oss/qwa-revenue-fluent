/**
 * Pure job lifecycle helpers. No persistence yet — the shapes below map 1:1 to
 * a future Postgres schema (video_jobs / video_job_attempts), so swapping the
 * in-memory store for Lovable Cloud later touches only the store module.
 */
import type {
  JobState,
  ProviderAttempt,
  ProviderId,
  VideoJob,
  VideoJobRequest,
} from "./types";
import { canPublish } from "./usage-rights";

export const JOB_STATES: JobState[] = [
  "draft",
  "queued",
  "generating",
  "evaluating",
  "selected",
  "ready_for_review",
  "ready_for_publish",
  "ready",
  "failed",
];

const ALLOWED_TRANSITIONS: Record<JobState, JobState[]> = {
  draft: ["queued", "failed"],
  queued: ["generating", "failed"],
  generating: ["evaluating", "failed"],
  evaluating: ["selected", "failed"],
  // Publish readiness is never reached directly: everything lands on review
  // first, and only the usage-rights gate can promote it.
  selected: ["ready_for_review", "failed"],
  ready_for_review: ["ready_for_publish", "failed"],
  ready_for_publish: ["ready", "failed"],
  ready: [],
  failed: ["queued"],
};

export function canTransition(from: JobState, to: JobState): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function createAttempt(
  providerId: ProviderId,
  estimatedCostUsd: number,
  estimatedLatencySeconds: number,
): ProviderAttempt {
  return {
    providerId,
    providerJobId: null,
    state: "draft",
    submittedAt: null,
    completedAt: null,
    estimatedCostUsd,
    actualCostUsd: null,
    estimatedLatencySeconds,
    actualLatencySeconds: null,
    qualityScore: null,
    outputUrl: null,
    error: null,
  };
}

export function createJob(
  id: string,
  request: VideoJobRequest,
  attempts: ProviderAttempt[],
  now: string = new Date().toISOString(),
): VideoJob {
  return {
    id,
    request,
    state: "draft",
    usageRightsStatus: "unknown",
    clearedBy: null,
    clearedAt: null,
    createdAt: now,
    updatedAt: now,
    attempts,
    selectedProviderId: null,
    failureReason: null,
  };
}

export function advanceJob(job: VideoJob, to: JobState, reason?: string): VideoJob {
  if (!canTransition(job.state, to)) {
    throw new Error(`Illegal job transition: ${job.state} → ${to}`);
  }
  if (
    (to === "ready_for_publish" || to === "ready") &&
    !canPublish(job.usageRightsStatus)
  ) {
    throw new Error(
      `Job ${job.id} cannot reach "${to}": usage rights are "${job.usageRightsStatus}". Record a commercial clearance first.`,
    );
  }
  return {
    ...job,
    state: to,
    updatedAt: new Date().toISOString(),
    failureReason: to === "failed" ? (reason ?? "Unknown failure") : job.failureReason,
  };
}
