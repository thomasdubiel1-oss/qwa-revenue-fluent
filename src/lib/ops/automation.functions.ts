/**
 * Phase 8 — server-function boundary for the automation control plane.
 * Phase 10: every handler authorizes the caller's internal session and role
 * server-side. Reads require `viewer`, operational decisions require `ops`,
 * and mode / kill switch / live execution require `admin`.
 */
import { createServerFn } from "@tanstack/react-start";

import type { AutomationState, RecommendationView } from "./automation.types";
import type { OpsResponse } from "./types";
import type { SlaThresholds } from "./workflow.types";

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
    (data: { sla?: Partial<SlaThresholds> | undefined; windowHours?: number | undefined }) =>
      requireObject(data),
  )
  .handler(async ({ data }): Promise<OpsResponse<AutomationState>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadAutomationState } = await import("./automation.server");
    return {
      ok: true,
      data: await loadAutomationState({ sla: data.sla, windowHours: data.windowHours }),
    };
  });

export const opsSetAutomationModeFn = createServerFn({ method: "POST" })
  .inputValidator((data: { mode: string }) => {
    requireObject(data);
    if (typeof data.mode !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("admin");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { setMode } = await import("./automation.server");
    return withActor(access.actor, () => setMode(data.mode));
  });

export const opsSetKillSwitchFn = createServerFn({ method: "POST" })
  .inputValidator((data: { engaged: boolean }) => {
    requireObject(data);
    if (typeof data.engaged !== "boolean") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("admin");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { setKillSwitch } = await import("./automation.server");
    return withActor(access.actor, () => setKillSwitch(data.engaged));
  });

export const opsRunAutomationFn = createServerFn({ method: "POST" })
  .inputValidator((data: { dryRun: boolean }) => {
    requireObject(data);
    if (typeof data.dryRun !== "boolean") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    // A dry run mutates nothing; a live run may write internal recommendations.
    const access = await requireInternalAccess(data.dryRun ? "ops" : "admin");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { runAutomation } = await import("./automation.server");
    const result = await withActor(access.actor, () => runAutomation({ dryRun: data.dryRun }));
    return { ok: true as const, result };
  });

export const opsDecideRecommendationFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      leadId: string;
      playbookKey: string;
      decision: "approve" | "dismiss" | "snooze";
      snoozeHours?: number;
    }) => {
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
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("ops");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { decideRecommendation } = await import("./automation.server");
    return withActor(access.actor, () =>
      decideRecommendation({
        leadId: data.leadId,
        playbookKey: data.playbookKey,
        decision: data.decision,
        snoozeHours: data.snoozeHours,
      }),
    );
  });

export const opsLeadRecommendationsFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => {
    requireObject(data);
    requireId(data.id);
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<RecommendationView[]>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadLeadRecommendations } = await import("./automation.server");
    return { ok: true, data: await loadLeadRecommendations(data.id) };
  });
