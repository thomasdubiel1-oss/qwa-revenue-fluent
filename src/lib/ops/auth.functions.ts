/**
 * Phase 10 — internal identity server-function boundary.
 *
 * `opsSessionFn` reports the caller's internal role (or why they have none).
 * The two admin functions manage EXISTING internal users only; no user is ever
 * created, invented, or invited here.
 */
import { createServerFn } from "@tanstack/react-start";

import { INTERNAL_ROLES, type InternalRole } from "./types";

export type InternalSession =
  | { state: "unauthenticated" }
  | { state: "forbidden" }
  | { state: "ready"; role: InternalRole; label: string };

export type InternalUserView = {
  userId: string;
  role: InternalRole;
  displayLabel: string;
  disabled: boolean;
  createdAt: string;
};

export const opsSessionFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<InternalSession> => {
    const { requireInternalAccess } = await import("./auth.server");
    const access = await requireInternalAccess("viewer");
    if (access.state === "ready") {
      return { state: "ready", role: access.actor.role, label: access.actor.label };
    }
    return access.state === "unauthenticated" ? { state: "unauthenticated" } : { state: "forbidden" };
  },
);

export const opsInternalUsersFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: boolean; users: InternalUserView[] }> => {
    const { requireInternalAccess, listInternalUsers } = await import("./auth.server");
    const access = await requireInternalAccess("admin");
    if (access.state !== "ready") return { ok: false, users: [] };
    return { ok: true, users: await listInternalUsers() };
  },
);

export const opsUpdateInternalUserFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { userId: string; role?: InternalRole | undefined; disabled?: boolean | undefined }) => {
      if (!data || typeof data.userId !== "string" || !data.userId.trim()) {
        throw new Error("invalid_payload");
      }
      if (data.role !== undefined && !INTERNAL_ROLES.includes(data.role)) {
        throw new Error("invalid_role");
      }
      return data;
    },
  )
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const { requireInternalAccess, withActor, updateInternalUser } = await import("./auth.server");
    const access = await requireInternalAccess("admin");
    if (access.state !== "ready") return { ok: false, error: "forbidden" };
    return withActor(access.actor, () =>
      updateInternalUser({
        userId: data.userId,
        role: data.role,
        disabled: data.disabled,
      }),
    );
  });
