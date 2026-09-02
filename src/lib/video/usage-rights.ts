/**
 * Commercial-use guardrail for QWA creative jobs and assets.
 *
 * IMPORTANT: this is a product workflow control, not legal advice and not a
 * rights determination. `commercially_cleared` means only that a human
 * confirmed clearance inside QWA for that asset and plan. Outputs produced on
 * free/personal vendor plans are treated as internal prototyping material.
 */
import type {
  CreativeAsset,
  JobState,
  ProviderCapabilities,
  UsageRightsStatus,
  VideoJob,
} from "./types";

export const USAGE_RIGHTS_LABEL: Record<UsageRightsStatus, string> = {
  unknown: "Rights unknown",
  prototype_only: "Prototype only",
  blocked_for_publish: "Blocked for publish",
  commercially_cleared: "Commercially cleared",
};

export const USAGE_RIGHTS_NOTE: Record<UsageRightsStatus, string> = {
  unknown: "No clearance recorded. Cannot be treated as publish-ready.",
  prototype_only:
    "Created under a personal/free plan. Internal prototyping only — regenerate or clear under a commercial plan before public use.",
  blocked_for_publish: "Explicitly withheld from publication by a reviewer.",
  commercially_cleared: "A named human confirmed commercial clearance for this asset in QWA.",
};

/** Statuses that may never reach a publish-ready state. */
const NON_PUBLISHABLE: UsageRightsStatus[] = ["unknown", "prototype_only", "blocked_for_publish"];

export function canPublish(status: UsageRightsStatus): boolean {
  return status === "commercially_cleared";
}

export interface PublishGate {
  allowed: boolean;
  resolvedState: JobState;
  reasons: string[];
}

/**
 * The single decision point for publish readiness. Any prototype/unknown asset
 * caps the job at `ready_for_review`.
 */
export function evaluatePublishGate(
  status: UsageRightsStatus,
  assets: CreativeAsset[] = [],
  requestedState: JobState = "ready_for_publish",
): PublishGate {
  const reasons: string[] = [];

  if (NON_PUBLISHABLE.includes(status)) {
    reasons.push(`Job rights status is "${USAGE_RIGHTS_LABEL[status]}".`);
  }
  for (const asset of assets) {
    if (asset.prototypeOnly || !canPublish(asset.usageRightsStatus)) {
      reasons.push(
        `${asset.label}: ${USAGE_RIGHTS_LABEL[asset.usageRightsStatus]} — not publish-ready.`,
      );
    }
  }

  const wantsPublish = requestedState === "ready_for_publish";
  const allowed = wantsPublish && reasons.length === 0;

  return {
    allowed,
    resolvedState: allowed
      ? "ready_for_publish"
      : wantsPublish
        ? "ready_for_review"
        : requestedState,
    reasons: reasons.length
      ? reasons
      : ["All attached assets carry a recorded commercial clearance."],
  };
}

/** Apply the gate to a job. Never upgrades rights, only caps state. */
export function applyPublishGate(job: VideoJob, assets: CreativeAsset[] = []): VideoJob {
  const gate = evaluatePublishGate(job.usageRightsStatus, assets, "ready_for_publish");
  return { ...job, state: gate.resolvedState };
}

/** Human confirmation is the only path to cleared. */
export function recordCommercialClearance(job: VideoJob, confirmedBy: string): VideoJob {
  const by = confirmedBy.trim();
  if (!by) return job;
  return {
    ...job,
    usageRightsStatus: "commercially_cleared",
    clearedBy: by,
    clearedAt: new Date().toISOString(),
  };
}

/** Starting rights status for output from a given provider. */
export function initialUsageRights(caps: ProviderCapabilities): UsageRightsStatus {
  return caps.defaultUsageRights;
}
