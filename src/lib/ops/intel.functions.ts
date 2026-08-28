/**
 * Server-function boundary for the Phase 6 Revenue Intelligence console.
 * Same access gate as Phase 5: the internal key is verified server-side before
 * any lead-derived data is computed, and the service-role client is only
 * imported inside the handler.
 */
import { createServerFn } from "@tanstack/react-start";

import type { IntelWindow, RevenueIntel } from "./intel.types";
import type { OpsResponse } from "./types";

const ALLOWED_WINDOWS: IntelWindow[] = [7, 30, 90];

export const opsRevenueIntelFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { key?: string | undefined; windowDays?: number; staleHours?: number }) => {
      if (!data || typeof data !== "object") throw new Error("invalid_payload");
      return data;
    },
  )
  .handler(async ({ data }): Promise<OpsResponse<RevenueIntel>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };

    const windowDays = ALLOWED_WINDOWS.includes(data.windowDays as IntelWindow)
      ? (data.windowDays as IntelWindow)
      : 30;
    const staleHours =
      typeof data.staleHours === "number" && Number.isFinite(data.staleHours)
        ? Math.min(Math.max(Math.round(data.staleHours), 1), 720)
        : 72;

    const { loadRevenueIntel } = await import("./intel.server");
    return { ok: true, data: await loadRevenueIntel({ windowDays, staleHours }) };
  });
