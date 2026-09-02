/**
 * SERVER ONLY. Shared adapter scaffolding.
 *
 * Provider calls are NOT implemented: no vendor endpoints are hardcoded and no
 * request is ever made without credentials. Each adapter marks its integration
 * points with TODO so a real implementation can drop in without touching the
 * router, scoring or UI.
 */
import { getCapabilities } from "../capabilities";
import { describeProviderConfig, PROVIDER_ENV, readProviderConfig } from "../config.server";
import { clipsRequired } from "../normalize";
import type {
  PollResult,
  ProviderId,
  ProviderStatus,
  SubmitResult,
  VideoJobRequest,
  VideoProviderAdapter,
} from "../types";

export interface AdapterPricing {
  /** Mock price per generated second, USD. Not vendor-confirmed. */
  usdPerSecond: number;
  /** Mock wall-clock seconds per generated clip. Not vendor-confirmed. */
  secondsPerClip: number;
  /** Fixed queue overhead in seconds. */
  queueOverheadSeconds: number;
}

export class NotConfiguredError extends Error {
  constructor(id: ProviderId, missingEnv: string[]) {
    super(`Provider "${id}" is not configured. Missing server env: ${missingEnv.join(", ")}.`);
    this.name = "NotConfiguredError";
  }
}

export function createAdapter(
  id: ProviderId,
  pricing: AdapterPricing,
  integrationNote: string,
): VideoProviderAdapter {
  const capabilities = getCapabilities(id);
  const envNames = PROVIDER_ENV[id];
  const requiredEnv = envNames ? [envNames.apiKey] : [];

  function estimateCostUsd(request: VideoJobRequest): number {
    const clips = clipsRequired(request.durationTargetSeconds, capabilities.maxClipDurationSeconds);
    const seconds = clips * capabilities.maxClipDurationSeconds;
    return seconds * pricing.usdPerSecond * request.outputCount;
  }

  function estimateLatencySeconds(request: VideoJobRequest): number {
    const clips = clipsRequired(request.durationTargetSeconds, capabilities.maxClipDurationSeconds);
    // Clips within one output are generated sequentially; outputs are queued.
    return pricing.queueOverheadSeconds + clips * pricing.secondsPerClip * request.outputCount;
  }

  return {
    capabilities,
    requiredEnv,
    estimateCostUsd,
    estimateLatencySeconds,

    async getStatus(): Promise<ProviderStatus> {
      const { configured, missingEnv } = describeProviderConfig(id);
      return {
        id,
        configured,
        missingEnv,
        // Without credentials there is nothing to probe — never report "ready".
        health: configured ? "unknown" : "not_configured",
        note: configured
          ? `Credentials present. Live health probe not implemented yet — ${integrationNote}`
          : `Add ${missingEnv.join(", ")} in Project Settings → Secrets to enable this adapter.`,
        checkedAt: new Date().toISOString(),
      };
    },

    async submit(request: VideoJobRequest): Promise<SubmitResult> {
      const config = readProviderConfig(id);
      if (!config.configured) throw new NotConfiguredError(id, config.missingEnv);
      // TODO(integration): POST the normalized request to the vendor API.
      // Map `request` to the vendor payload here — nowhere else in the system.
      void request;
      throw new Error(`Provider "${id}" submit() is not implemented. ${integrationNote}`);
    },

    async poll(providerJobId: string): Promise<PollResult> {
      const config = readProviderConfig(id);
      if (!config.configured) throw new NotConfiguredError(id, config.missingEnv);
      // TODO(integration): GET vendor job status and map it to PollResult.
      void providerJobId;
      throw new Error(`Provider "${id}" poll() is not implemented. ${integrationNote}`);
    },
  };
}
