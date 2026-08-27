/**
 * QWA Creative Engine — provider-neutral video orchestration types.
 *
 * Nothing in this file is provider-specific. Adapters implement these
 * contracts; product UI only ever consumes them.
 */

export type ProviderId =
  | "veo"
  | "seedance"
  | "kling"
  | "runway"
  | "higgsfield"
  | "ltx";

/**
 * What a provider does in the pipeline. Planning providers never compete for
 * shot generation ranking; shot providers never own the storyboard stage.
 */
export type ProviderRole = "shot_generation" | "planning";

/**
 * How QWA actually reaches the provider today.
 * `manual_handoff` = no verified API path in this architecture; a human runs
 * the step in the vendor tool and imports the result. No endpoints invented.
 */
export type IntegrationMode = "api" | "manual_handoff";

export type CostTier = "low" | "medium" | "high";

/** Default production standing of outputs from this provider. */
export type ProductionTier = "prototype" | "production";

/**
 * Commercial-use standing of a job or asset. This is a workflow status, not a
 * legal determination: `commercially_cleared` only means a human confirmed
 * clearance inside QWA.
 */
export type UsageRightsStatus =
  | "unknown"
  | "prototype_only"
  | "blocked_for_publish"
  | "commercially_cleared";

export type AspectRatio = "16:9" | "9:16" | "1:1";

/** First-class ad lengths for QWA. */
export type DurationTarget = 15 | 30 | 60;

export type QualityTier = "efficient" | "balanced" | "premium";

export type LatencyPreference = "fastest" | "balanced" | "quality-first";

export type ProviderHealth =
  | "not_configured"
  | "manual_handoff"
  | "ready"
  | "degraded"
  | "unavailable"
  | "unknown";

/** Static, discoverable capability metadata. Safe to expose to the browser. */
export interface PlanningCapabilities {
  storyboard: boolean;
  shotSequencing: boolean;
  aspectPlanning: boolean;
  durationPlanning: boolean;
  /** Rough-cut assembly of placeholder/prototype footage. */
  prototypeAssembly: boolean;
  /** Low-cost generation inside the planning tool, where supported. */
  prototypeGeneration: boolean;
}

export interface ProviderCapabilities {
  id: ProviderId;
  displayName: string;
  role: ProviderRole;
  integrationMode: IntegrationMode;
  costTier: CostTier;
  /** Default production standing for outputs before human clearance. */
  productionTier: ProductionTier;
  /** Usage-rights status outputs start at. Never assumes clearance. */
  defaultUsageRights: UsageRightsStatus;
  planning: PlanningCapabilities;
  /** Vendor summary in one line — no marketing claims. */
  summary: string;
  /** Durations a single generation can produce, in seconds. */
  supportedClipDurations: number[];
  maxClipDurationSeconds: number;
  aspectRatios: AspectRatio[];
  supportsAudio: boolean;
  supportsImageToVideo: boolean;
  supportsReferenceAssets: boolean;
  /** Continue a finished clip to build longer sequences. */
  supportsExtension: boolean;
  /** Keep a character/avatar stable across shots. */
  supportsCharacterConsistency: boolean;
  qualityTier: QualityTier;
  maxResolution: "720p" | "1080p" | "4k";
}

/** Runtime state of an adapter, resolved server-side only. */
export interface ProviderStatus {
  id: ProviderId;
  health: ProviderHealth;
  /** True only when every required server env var is present. */
  configured: boolean;
  missingEnv: string[];
  /** Human-readable note for the internal status panel. */
  note: string;
  checkedAt: string;
}

export interface ReferenceAsset {
  id: string;
  kind: "image" | "video" | "audio";
  label: string;
  /** Storage pointer, resolved server-side. Never a raw secret URL in UI. */
  uri?: string;
}

/** Normalized, provider-neutral job request. */
export interface VideoJobRequest {
  objective: string;
  prompt: string;
  durationTargetSeconds: DurationTarget;
  aspectRatio: AspectRatio;
  qualityTarget: QualityTier;
  /** USD ceiling for the whole job. 0 or undefined = no ceiling. */
  costCeilingUsd: number;
  latencyPreference: LatencyPreference;
  audioRequired: boolean;
  characterConsistencyRequired: boolean;
  referenceAssets: ReferenceAsset[];
  /** Number of candidate outputs to generate for evaluation. */
  outputCount: number;
}

/** Raw (possibly partial/untrusted) input before normalization. */
export type VideoJobInput = Partial<
  Omit<VideoJobRequest, "referenceAssets" | "durationTargetSeconds">
> & {
  durationTargetSeconds?: number;
  referenceAssets?: ReferenceAsset[];
};

export type JobState =
  | "draft"
  | "queued"
  | "generating"
  | "evaluating"
  | "selected"
  | "ready_for_review"
  | "ready_for_publish"
  | "ready"
  | "failed";

export interface CreativeAsset {
  id: string;
  label: string;
  providerId: ProviderId;
  kind: "storyboard" | "shot" | "rough_cut" | "audio" | "final";
  usageRightsStatus: UsageRightsStatus;
  /** Free/personal-plan output; internal prototyping only. */
  prototypeOnly: boolean;
  outputUrl: string | null;
  createdAt: string;
}

export interface ProviderAttempt {
  providerId: ProviderId;
  /** Vendor-side job identifier once submitted. */
  providerJobId: string | null;
  state: JobState;
  submittedAt: string | null;
  completedAt: string | null;
  estimatedCostUsd: number;
  /** Populated from provider billing once real calls exist. */
  actualCostUsd: number | null;
  estimatedLatencySeconds: number;
  actualLatencySeconds: number | null;
  /** Mocked until a real evaluator is wired in. */
  qualityScore: number | null;
  outputUrl: string | null;
  error: string | null;
}

export interface VideoJob {
  id: string;
  request: VideoJobRequest;
  state: JobState;
  /** Workflow-level commercial standing. Gated by usage-rights.ts. */
  usageRightsStatus: UsageRightsStatus;
  /** Set only when a human confirms clearance in the internal workflow. */
  clearedBy: string | null;
  clearedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Ordered by routing rank. */
  attempts: ProviderAttempt[];
  selectedProviderId: ProviderId | null;
  failureReason: string | null;
}

/* ------------------------------------------------------------------ */
/* Adapter contract                                                    */
/* ------------------------------------------------------------------ */

export interface SubmitResult {
  providerJobId: string;
  estimatedLatencySeconds: number;
}

export interface PollResult {
  state: Extract<JobState, "generating" | "ready" | "failed">;
  progress: number;
  outputUrl: string | null;
  error: string | null;
}

/**
 * Every provider integration implements this. Adapters are server-only:
 * they read secrets from process.env inside their methods.
 */
export interface VideoProviderAdapter {
  readonly capabilities: ProviderCapabilities;
  /** Server env var names this adapter needs before it can run. */
  readonly requiredEnv: string[];
  /** Rough price for a job, before any provider call. */
  estimateCostUsd(request: VideoJobRequest): number;
  /** Rough wall-clock time to first output. */
  estimateLatencySeconds(request: VideoJobRequest): number;
  /** Resolves credentials/health without performing a generation. */
  getStatus(): Promise<ProviderStatus>;
  submit(request: VideoJobRequest): Promise<SubmitResult>;
  poll(providerJobId: string): Promise<PollResult>;
  cancel?(providerJobId: string): Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Extension points (interfaces only — not implemented in this phase)   */
/* ------------------------------------------------------------------ */

export interface Shot {
  index: number;
  durationSeconds: number;
  prompt: string;
  referenceAssetIds: string[];
}

/** Future: turn a script/objective into a shot list. */
export interface StoryboardPlanner {
  plan(request: VideoJobRequest): Promise<Shot[]>;
}

/** Future: voiceover, music, captions, assembly, publishing. */
export interface PostProductionStage {
  readonly id: "audio" | "captions" | "assembly" | "qa" | "publish";
  run(job: VideoJob): Promise<VideoJob>;
}
