import type { DemoRequestPayload, LeadProvider, LeadSubmitResult } from "./types";

/**
 * Default adapter: records the lead locally so the conversion path is fully
 * exercisable without any credentials or external service.
 *
 * To connect a real destination later (HighLevel, Lovable Cloud, or a webhook),
 * implement `LeadProvider` in its own module and register it below. No form or
 * component code needs to change.
 */
const localProvider: LeadProvider = {
  name: "local",
  async submit(payload: DemoRequestPayload): Promise<LeadSubmitResult> {
    // Simulated network latency so loading states are real in preview.
    await new Promise((r) => setTimeout(r, 650));
    console.info("[qwa:lead] captured (no destination configured yet)", payload);
    return { ok: true, provider: "local" };
  },
};

let activeProvider: LeadProvider = localProvider;

/** Swap the destination at runtime (used by a future integration bootstrap). */
export function setLeadProvider(provider: LeadProvider) {
  activeProvider = provider;
}

export function getLeadProvider(): LeadProvider {
  return activeProvider;
}

export async function submitDemoRequest(
  payload: DemoRequestPayload,
): Promise<LeadSubmitResult> {
  const provider = activeProvider;
  try {
    return await provider.submit(payload);
  } catch (error) {
    return {
      ok: false,
      provider: provider.name,
      retryable: true,
      error: error instanceof Error ? error.message : "Unknown submission error",
    };
  }
}
