import { submitDemoRequestFn } from "./leads.functions";
import type { DemoRequestPayload, LeadProvider, LeadSubmitResult } from "./types";

export type SubmitOptions = {
  /** Honeypot field value, forwarded so the server decides on abuse. */
  trap?: string | undefined;
};

/**
 * Default adapter: persists the lead through a server function backed by the
 * project database. No privileged key ever reaches the browser.
 *
 * Downstream CRM delivery (HighLevel/webhook) is handled by the durable
 * outbox written alongside each lead — swapping destinations never touches
 * form or component code.
 */
const supabaseProvider: LeadProvider = {
  name: "supabase",
  async submit(payload: DemoRequestPayload): Promise<LeadSubmitResult> {
    return submitDemoRequestFn({ data: payload });
  },
};

let activeProvider: LeadProvider = supabaseProvider;

/** Swap the destination at runtime (used by a future integration bootstrap). */
export function setLeadProvider(provider: LeadProvider) {
  activeProvider = provider;
}

export function getLeadProvider(): LeadProvider {
  return activeProvider;
}

export async function submitDemoRequest(
  payload: DemoRequestPayload,
  options: SubmitOptions = {},
): Promise<LeadSubmitResult> {
  const provider = activeProvider;
  try {
    if (provider === supabaseProvider) {
      return await submitDemoRequestFn({
        data: { ...payload, ...(options.trap ? { trap: options.trap } : {}) },
      });
    }
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
