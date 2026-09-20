import { createServerFn } from "@tanstack/react-start";

import type { VideoJobInput } from "./types";
import type { WorkflowPresetId } from "./presets";

/**
 * Thin RPC wrappers. Server-only modules are imported inside handlers so the
 * adapter/config chain never enters the client bundle.
 *
 * Phase 10: these describe internal provider configuration posture (which
 * creative providers are configured, cost estimates, usage-rights policy), so
 * they are authorized like any other internal boundary — an anonymous caller
 * gets nothing.
 */

export const getProviderStatuses = createServerFn({ method: "GET" }).handler(async () => {
  const { requireInternalAccess } = await import("@/lib/ops/auth.server");
  const access = await requireInternalAccess("viewer");
  if (access.state !== "ready") return [];
  const { getProviderStatuses: read } = await import("./router.server");
  return read();
});

export const planVideoRoute = createServerFn({ method: "POST" })
  .inputValidator((input: VideoJobInput & { presetId?: WorkflowPresetId }) => input)
  .handler(async ({ data }) => {
    const { requireInternalAccess } = await import("@/lib/ops/auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state !== "ready") throw new Error("forbidden");
    const { planRoute } = await import("./router.server");
    return planRoute(data);
  });
