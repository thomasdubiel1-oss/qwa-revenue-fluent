/**
 * Server-function boundary for the Phase 7 operator workflow.
 * Every handler authorizes the caller's internal session and role (Phase 10)
 * before touching lead data, and loads server-only modules inside the handler.
 */
import { createServerFn } from "@tanstack/react-start";

import type { OpsResponse } from "./types";
import type { LeadWorkflow, SlaThresholds, WorkQueueResult } from "./workflow.types";

function requireObject<T>(data: T): T {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  return data;
}

function requireId(id: unknown): string {
  if (typeof id !== "string" || id.length < 8) throw new Error("invalid_id");
  return id;
}

export const opsWorkQueueFn = createServerFn({ method: "POST" })
  .inputValidator((data: { sla?: Partial<SlaThresholds> | undefined }) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<WorkQueueResult>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadWorkQueue } = await import("./workflow.server");
    return { ok: true, data: await loadWorkQueue(data.sla) };
  });

export const opsLeadWorkflowFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => {
    requireObject(data);
    requireId(data.id);
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<LeadWorkflow>> => {
    const { requireInternalAccess, accessState } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") return { ok: false, access: accessState(access) };
    const { loadLeadWorkflow } = await import("./workflow.server");
    return { ok: true, data: await loadLeadWorkflow(data.id) };
  });

export const opsAddNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; note: string }) => {
    requireObject(data);
    requireId(data.id);
    if (typeof data.note !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("ops");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { addLeadNote } = await import("./workflow.server");
    return withActor(access.actor, () => addLeadNote(data.id, data.note));
  });

export const opsCreateTaskFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; title: string; description?: string; dueAt?: string }) => {
    requireObject(data);
    requireId(data.id);
    if (typeof data.title !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("ops");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { createLeadTask } = await import("./workflow.server");
    return withActor(access.actor, () =>
      createLeadTask({
        leadId: data.id,
        title: data.title,
        description: data.description,
        dueAt: data.dueAt,
      }),
    );
  });

export const opsSetTaskDoneFn = createServerFn({ method: "POST" })
  .inputValidator((data: { taskId: string; completed: boolean }) => {
    requireObject(data);
    requireId(data.taskId);
    if (typeof data.completed !== "boolean") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("ops");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { setTaskCompletion } = await import("./workflow.server");
    return withActor(access.actor, () => setTaskCompletion(data.taskId, data.completed));
  });

export const opsMoveStatusFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: string; note?: string }) => {
    requireObject(data);
    requireId(data.id);
    if (typeof data.status !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { requireInternalAccess, withActor } = await import("./auth.server");
    const access = await requireInternalAccess("ops");
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { moveLeadStatus } = await import("./workflow.server");
    return withActor(access.actor, () => moveLeadStatus(data.id, data.status, data.note));
  });
