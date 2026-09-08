/**
 * Phase 6 — server-function boundary for revenue intelligence.
 * Phase 10: requires an authenticated internal `viewer` session.
 */
import { createServerFn } from "@tanstack/react-start";

import type { RevenueIntel } from "./intel.types";
import type { OpsResponse } from "./types";

export const opsRevenueIntelFn = createServerFn({ method: "POST" })
  .inputValidator((data: { windowDays?: number | undefined; staleHours?: number | undefined }) => {
    if (!data || typeof data !== "object") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<RevenueIntel>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadRevenueIntel } = await import("./intel.server");
    return {
      ok: true,
      data: await loadRevenueIntel({ windowDays: data.windowDays, staleHours: data.staleHours }),
    };
  });
