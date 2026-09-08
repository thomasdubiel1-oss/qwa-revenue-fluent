/**
 * Phase 9 — server-function boundary for the control plane and governance.
 * Phase 10: reads require an authenticated `viewer`; configuration version
 * creation, activation and rollback require `admin`. Server-only modules load
 * inside the handler.
 */
import { createServerFn } from "@tanstack/react-start";

import type { ControlPlaneState, SimulationResult } from "./controlplane.types";
import type { ConfigVersion } from "./governance.types";
import type { OpsResponse } from "./types";

function requireObject<T>(data: T): T {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  return data;
}

export const opsControlPlaneFn = createServerFn({ method: "POST" })
  .inputValidator((data: { windowHours?: number | undefined }) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<ControlPlaneState>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadControlPlaneState } = await import("./controlplane.server");
    return { ok: true, data: await loadControlPlaneState({ windowHours: data.windowHours }) };
  });

/** Read-only: runs the real rules against a real lead and mutates nothing. */
export const opsSimulateLeadFn = createServerFn({ method: "POST" })
  .inputValidator((data: { leadId: string }) => {
    requireObject(data);
    if (typeof data.leadId !== "string" || data.leadId.length < 8) throw new Error("invalid_id");
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<SimulationResult>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { simulateLead } = await import("./automation.server");
    return { ok: true, data: await simulateLead(data.leadId) };
  });

export const opsConfigVersionsFn = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, unknown>) => requireObject(data))
  .handler(async (): Promise<OpsResponse<ConfigVersion[]>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { listConfigVersions } = await import("./governance.server");
    return { ok: true, data: await listConfigVersions() };
  });

export const opsCreateConfigVersionFn = createServerFn({ method: "POST" })
  .inputValidator((data: { config: unknown; reason: string }) => {
    requireObject(data);
    if (typeof data.reason !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("admin");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { createConfigVersion } = await import("./governance.server");
    return withActor(access.actor, () =>
      createConfigVersion({ config: data.config, reason: data.reason }),
    );
  });

export const opsRollbackConfigFn = createServerFn({ method: "POST" })
  .inputValidator((data: { version: number; reason: string }) => {
    requireObject(data);
    if (typeof data.version !== "number" || !Number.isFinite(data.version)) {
      throw new Error("invalid_payload");
    }
    if (typeof data.reason !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("admin");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { rollbackConfig } = await import("./governance.server");
    return withActor(access.actor, () =>
      rollbackConfig({ version: data.version, reason: data.reason }),
    );
  });
