/**
 * Phase 9 — server-function boundary for the control plane and governance.
 * Same posture as Phase 5–8: INTERNAL_OPS_TOKEN is verified before any data
 * access, and server-only modules load inside the handler.
 */
import { createServerFn } from "@tanstack/react-start";

import type { ControlPlaneState, SimulationResult } from "./controlplane.types";
import type { ConfigVersion } from "./governance.types";
import type { OpsResponse } from "./types";

type Keyed<T> = T & { key?: string | undefined };

function requireObject<T>(data: T): T {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  return data;
}

export const opsControlPlaneFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ windowHours?: number | undefined }>) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<ControlPlaneState>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    const { loadControlPlaneState } = await import("./controlplane.server");
    return { ok: true, data: await loadControlPlaneState({ windowHours: data.windowHours }) };
  });

/** Read-only: runs the real rules against a real lead and mutates nothing. */
export const opsSimulateLeadFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ leadId: string }>) => {
    requireObject(data);
    if (typeof data.leadId !== "string" || data.leadId.length < 8) throw new Error("invalid_id");
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<SimulationResult>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    const { simulateLead } = await import("./automation.server");
    return { ok: true, data: await simulateLead(data.leadId) };
  });

export const opsConfigVersionsFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<Record<string, never>>) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<ConfigVersion[]>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    const { listConfigVersions } = await import("./governance.server");
    return { ok: true, data: await listConfigVersions() };
  });

export const opsCreateConfigVersionFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ config: unknown; reason: string }>) => {
    requireObject(data);
    if (typeof data.reason !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { createConfigVersion } = await import("./governance.server");
    return createConfigVersion({ config: data.config, reason: data.reason });
  });

export const opsRollbackConfigFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ version: number; reason: string }>) => {
    requireObject(data);
    if (typeof data.version !== "number" || !Number.isFinite(data.version)) {
      throw new Error("invalid_payload");
    }
    if (typeof data.reason !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { rollbackConfig } = await import("./governance.server");
    return rollbackConfig({ version: data.version, reason: data.reason });
  });
