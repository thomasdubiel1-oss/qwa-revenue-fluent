/**
 * Server-function boundary for the Phase 7 operator workflow.
 * Every handler verifies INTERNAL_OPS_TOKEN before touching lead data, and
 * loads server-only modules inside the handler (never at module scope).
 */
import { createServerFn } from "@tanstack/react-start";

import type { OpsResponse } from "./types";
import type { LeadWorkflow, SlaThresholds, WorkQueueResult } from "./workflow.types";

type Keyed<T> = T & { key?: string | undefined };

function requireObject<T>(data: T): T {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  return data;
}

function requireId(id: unknown): string {
  if (typeof id !== "string" || id.length < 8) throw new Error("invalid_id");
  return id;
}

export const opsWorkQueueFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ sla?: Partial<SlaThresholds> | undefined }>) => requireObject(data))
  .handler(async ({ data }): Promise<OpsResponse<WorkQueueResult>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    const { loadWorkQueue } = await import("./workflow.server");
    return { ok: true, data: await loadWorkQueue(data.sla) };
  });

export const opsLeadWorkflowFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ id: string }>) => {
    requireObject(data);
    requireId(data.id);
    return data;
  })
  .handler(async ({ data }): Promise<OpsResponse<LeadWorkflow>> => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false, access };
    const { loadLeadWorkflow } = await import("./workflow.server");
    return { ok: true, data: await loadLeadWorkflow(data.id) };
  });

export const opsAddNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ id: string; note: string }>) => {
    requireObject(data);
    requireId(data.id);
    if (typeof data.note !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { addLeadNote } = await import("./workflow.server");
    return addLeadNote(data.id, data.note);
  });

export const opsCreateTaskFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: Keyed<{ id: string; title: string; description?: string; dueAt?: string }>) => {
      requireObject(data);
      requireId(data.id);
      if (typeof data.title !== "string") throw new Error("invalid_payload");
      return data;
    },
  )
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { createLeadTask } = await import("./workflow.server");
    return createLeadTask({
      leadId: data.id,
      title: data.title,
      description: data.description,
      dueAt: data.dueAt,
    });
  });

export const opsSetTaskDoneFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ taskId: string; completed: boolean }>) => {
    requireObject(data);
    requireId(data.taskId);
    if (typeof data.completed !== "boolean") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { setTaskCompletion } = await import("./workflow.server");
    return setTaskCompletion(data.taskId, data.completed);
  });

export const opsMoveStatusFn = createServerFn({ method: "POST" })
  .inputValidator((data: Keyed<{ id: string; status: string; note?: string }>) => {
    requireObject(data);
    requireId(data.id);
    if (typeof data.status !== "string") throw new Error("invalid_payload");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkOpsAccess } = await import("./ops.server");
    const access = checkOpsAccess(data.key);
    if (access.state !== "ready") return { ok: false as const, error: access.state };
    const { moveLeadStatus } = await import("./workflow.server");
    return moveLeadStatus(data.id, data.status, data.note);
  });
