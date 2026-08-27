import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import type { DemoRequestPayload, LeadSubmitResult } from "./types";

type SubmitInput = DemoRequestPayload & {
  /** Honeypot field value; any content marks the submission as automated. */
  trap?: string | undefined;
};

/**
 * Public write boundary for demo requests. Validation, sanitization, rate
 * limiting and bot suppression are all decided here — the client heuristics
 * are a convenience, not the authority.
 */
export const submitDemoRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: SubmitInput) => {
    if (!data || typeof data !== "object") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    const { persistDemoRequest, recordSuppressedSubmission } = await import("./leads.server");

    const MIN_FILL_MS = 2500;
    const automated =
      (typeof data.trap === "string" && data.trap.trim().length > 0) ||
      !Number.isFinite(data.elapsedMs) ||
      data.elapsedMs < MIN_FILL_MS;

    if (automated) {
      // Bots get a normal-looking success and no stored lead.
      try {
        await recordSuppressedSubmission("honeypot_or_timetrap");
      } catch {
        /* suppression accounting must never fail the request */
      }
      return { ok: true, provider: "supabase" };
    }

    const forwarded = getRequestHeader("x-forwarded-for") ?? undefined;
    const ipSignal = forwarded?.split(",")[0]?.trim() || getRequestHeader("cf-connecting-ip");
    const userAgent = getRequestHeader("user-agent") ?? undefined;

    const { trap: _trap, ...payload } = data;
    return persistDemoRequest(payload as DemoRequestPayload, {
      ipSignal: ipSignal ?? undefined,
      userAgent,
    });
  });
