import { createServerFn } from "@tanstack/react-start";

import type { VideoJobInput } from "./types";
import type { WorkflowPresetId } from "./presets";

/**
 * Thin RPC wrappers. Server-only modules are imported inside handlers so the
 * adapter/config chain never enters the client bundle.
 */

export const getProviderStatuses = createServerFn({ method: "GET" }).handler(async () => {
  const { getProviderStatuses: read } = await import("./router.server");
  return read();
});

export const planVideoRoute = createServerFn({ method: "POST" })
  .inputValidator((input: VideoJobInput & { presetId?: WorkflowPresetId }) => input)
  .handler(async ({ data }) => {
    const { planRoute } = await import("./router.server");
    return planRoute(data);
  });
