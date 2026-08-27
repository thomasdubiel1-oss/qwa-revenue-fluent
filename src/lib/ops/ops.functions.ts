/**
 * Server-function boundary for the internal Lead Operations Console.
 *
 * Every function validates the internal access key server-side before any
 * lead data is read or written. Nothing here imports the service-role client
 * at module scope — the server-only module is loaded inside handlers.
 */
import { createServerFn } from "@tanstack/react-start";

import type {
  OpsFilters,
  OpsLeadDetail,
  OpsLeadRow,
  OpsOverview,
  OpsResponse,
} from "./types";

type KeyedInput<T> = T & { key?: string | undefined };

function requireObject<T>(data: T): T {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  return data;
}

/** Public: reports only whether the console has an access secret configured. */
export const opsAccessStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  const { checkOpsAccess } = await import("./ops.server");
  const access = checkOpsAccess("");
  return { configured: access.state !== "unconfigured" };
});

export const opsOverviewFn = createServerFn({ method: "POST" })
  .inputValidator((data: KeyedInput<Record<string, never>>) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<OpsOverview>> => {
    const { checkOpsAccess, loadOverview } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    return { ok: true, data: await loadOverview() };
  });

export const opsLeadsFn = createServerFn({ method: "POST" })
  .inputValidator((data: KeyedInput<{ filters?: OpsFilters }>) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<OpsLeadRow[]>> => {
    const { checkOpsAccess, loadLeads } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    return { ok: true, data: await loadLeads(data.filters ?? {}) };
  });

export const opsLeadDetailFn = createServerFn({ method: "POST" })
  .inputValidator((data: KeyedInput<{ id: string }>) => {
    requireObject(data);
    if (typeof data.id !== "string" || data.id.length < 8) throw new Error("invalid_id");
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<OpsLeadDetail | null>> => {
    const { checkOpsAccess, loadLeadDetail } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    return { ok: true, data: await loadLeadDetail(data.id) };
  });

export const opsSetStatusFn = createServerFn({ method: "POST" })
  .inputValidator((data: KeyedInput<{ id: string; status: string }>) => {
    requireObject(data);
    if (typeof data.id !== "string" || typeof data.status !== "string") {
      throw new Error("invalid_payload");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess, setLeadStatus } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    return setLeadStatus(data.id, data.status);
  });

export const opsRetryDeliveryFn = createServerFn({ method: "POST" })
  .inputValidator((data: KeyedInput<{ deliveryId: string }>) => {
    requireObject(data);
    if (typeof data.deliveryId !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess, retryDelivery } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    return retryDelivery(data.deliveryId);
  });
