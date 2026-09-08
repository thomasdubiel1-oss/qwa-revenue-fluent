/**
 * Server-function boundary for the internal Lead Operations Console.
 *
 * Every function authorizes the caller's Supabase session and internal role
 * server-side (Phase 10) before any lead data is read or written. Nothing here
 * imports the service-role client at module scope — server-only modules are
 * loaded inside handlers.
 */
import { createServerFn } from "@tanstack/react-start";

import type { OpsFilters, OpsLeadDetail, OpsLeadRow, OpsOverview, OpsResponse } from "./types";

function requireObject<T>(data: T): T {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  return data;
}

export const opsOverviewFn = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, never>) => requireObject(data))
  .handler(async (): Promise<OpsResponse<OpsOverview>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadOverview } = await import("./ops.server");
    return { ok: true, data: await loadOverview() };
  });

export const opsLeadsFn = createServerFn({ method: "POST" })
  .inputValidator((data: { filters?: OpsFilters }) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<OpsLeadRow[]>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadLeads } = await import("./ops.server");
    return { ok: true, data: await loadLeads(data.filters ?? {}) };
  });

export const opsLeadDetailFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => {
    requireObject(data);
    if (typeof data.id !== "string" || data.id.length < 8) throw new Error("invalid_id");
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<OpsLeadDetail | null>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadLeadDetail } = await import("./ops.server");
    return { ok: true, data: await loadLeadDetail(data.id) };
  });

export const opsSetStatusFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: string }) => {
    requireObject(data);
    if (typeof data.id !== "string" || typeof data.status !== "string") {
      throw new Error("invalid_payload");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("ops");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { setLeadStatus } = await import("./ops.server");
    return withActor(access.actor, () => setLeadStatus(data.id, data.status));
  });

export const opsRetryDeliveryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { deliveryId: string }) => {
    requireObject(data);
    if (typeof data.deliveryId !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("ops");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { retryDelivery } = await import("./ops.server");
    return withActor(access.actor, () => retryDelivery(data.deliveryId));
  });
