/**
 * Phase 8 — server-function boundary for the automation control plane.
 * Every handler verifies INTERNAL_OPS_TOKEN before touching data and loads
 * server-only modules inside the handler (never at module scope).
 */
import { createServerFn } from "@tanstack/react-start";

import type { AutomationState, RecommendationView } from "./automation.types";
import type { OpsResponse } from "./types";
import type { SlaThresholds } from "./workflow.types";

type Keyed<T> = T & { key?: string | undefined };

function requireObject<T>(data: T): T {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  return data;
}

function requireId(id: unknown): string {
  if (typeof id !== "string" || id.length < 8) throw new Error("invalid_id");
  return id;
}

export const opsAutomationStateFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: Keyed<{ sla?: Partial<SlaThresholds> | undefined; windowHours?: number | undefined }>) =>
      requireObject(data),
  )
  .handler(async ({ data }): Promise<OpsResponse<AutomationState>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    const { loadAutomationState } = await import("./automation.server");
    return {
      ok: true,
      data: await loadAutomationState({ sla: data.sla, windowHours: data.windowHours }),
    };
  });

export const opsSetAutomationModeFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ mode: string }>) => {
    requireObject(data);
    if (typeof data.mode !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { setMode } = await import("./automation.server");
    return setMode(data.mode);
  });

export const opsSetKillSwitchFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ engaged: boolean }>) => {
    requireObject(data);
    if (typeof data.engaged !== "boolean") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { setKillSwitch } = await import("./automation.server");
    return setKillSwitch(data.engaged);
  });

export const opsRunAutomationFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ dryRun: boolean }>) => {
    requireObject(data);
    if (typeof data.dryRun !== "boolean") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { runAutomation } = await import("./automation.server");
    const result = await runAutomation({ dryRun: data.dryRun });
    return { ok: true as const, result };
  });

export const opsDecideRecommendationFn = createServerFn({ method: "POST" })
  .inputValidator(
    (
      data: Keyed<{
        leadId: string;
        playbookKey: string;
        decision: "approve" | "dismiss" | "snooze";
        snoozeHours?: number;
      }>,
    ) => {
      requireObject(data);
      requireId(data.leadId);
      if (typeof data.playbookKey !== "string") throw new Error("invalid_payload");
      if (!["approve", "dismiss", "snooze"].includes(data.decision)) {
        throw new Error("invalid_decision");
      }
      return data;
    },
  )
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { decideRecommendation } = await import("./automation.server");
    return decideRecommendation({
      leadId: data.leadId,
      playbookKey: data.playbookKey,
      decision: data.decision,
      snoozeHours: data.snoozeHours,
    });
  });

export const opsLeadRecommendationsFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ id: string }>) => {
    requireObject(data);
    requireId(data.id);
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<RecommendationView[]>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    const { loadLeadRecommendations } = await import("./automation.server");
    return { ok: true, data: await loadLeadRecommendations(data.id) };
  });
