/**
 * SERVER ONLY — LTX Studio adapter.
 *
 * INTEGRATION MODE: manual_handoff.
 *
 * QWA has no verified LTX Studio API path in this architecture, so this
 * adapter deliberately declares NO credentials and NO endpoints. Nothing here
 * pretends to be connected: submit()/poll() describe the human handoff instead
 * of calling a vendor. If an official API is confirmed later, swap this file
 * for a `createAdapter(...)` implementation — the router, scoring and UI stay
 * untouched.
 *
 * LICENSING: outputs produced under a personal/free LTX plan are internal
 * prototyping material. They start at `prototype_only` and cannot reach a
 * publish-ready state without a recorded human clearance.
 */
import { getCapabilities } from "../capabilities";
import { clipsRequired } from "../normalize";
import type {
  PollResult,
  ProviderStatus,
  SubmitResult,
  VideoJobRequest,
  VideoProviderAdapter,
} from "../types";

const HANDOFF_NOTE =
  "Manual handoff: run the storyboard/prototype in LTX Studio, then import the shot plan and rough cut into QWA. No API credentials are configured or required.";

/** Simulated planning-tier economics. Not vendor pricing. */
const PLANNING_FLAT_USD = 4;
const PROTOTYPE_USD_PER_SECOND = 0.06;

export const ltxAdapter: VideoProviderAdapter = {
  capabilities: getCapabilities("ltx"),
  requiredEnv: [],

  estimateCostUsd(request: VideoJobRequest): number {
    return (
      PLANNING_FLAT_USD +
      request.durationTargetSeconds * PROTOTYPE_USD_PER_SECOND * request.outputCount
    );
  },

  estimateLatencySeconds(request: VideoJobRequest): number {
    const clips = clipsRequired(
      request.durationTargetSeconds,
      getCapabilities("ltx").maxClipDurationSeconds,
    );
    // Human-in-the-loop: planning turnaround dominates, not GPU time.
    return 900 + clips * 45;
  },

  async getStatus(): Promise<ProviderStatus> {
    return {
      id: "ltx",
      configured: false,
      missingEnv: [],
      health: "manual_handoff",
      note: `${HANDOFF_NOTE} Outputs are marked prototype_only until commercially cleared.`,
      checkedAt: new Date().toISOString(),
    };
  },

  async submit(): Promise<SubmitResult> {
    throw new Error(
      `LTX Studio is a manual-handoff workflow provider in QWA. ${HANDOFF_NOTE}`,
    );
  },

  async poll(): Promise<PollResult> {
    throw new Error(
      `LTX Studio has no automated job state in QWA. ${HANDOFF_NOTE}`,
    );
  },
};
