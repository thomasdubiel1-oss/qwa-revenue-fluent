/**
 * Phase 10 — pure internal access policy.
 *
 * Everything in this module is deterministic and dependency-free so the
 * authorization rules that protect the internal consoles can be unit-tested
 * without a database, a network call, or a real session. `auth.server.ts` is
 * the only place these helpers are wired to real requests.
 */
import { INTERNAL_ROLES, type InternalRole } from "./types";

export const ROLE_RANK: Record<InternalRole, number> = { viewer: 1, ops: 2, admin: 3 };

export function isInternalRole(value: unknown): value is InternalRole {
  return typeof value === "string" && (INTERNAL_ROLES as readonly string[]).includes(value);
}

/** True when `role` satisfies the minimum role required by a boundary. */
export function hasMinRole(role: InternalRole, min: InternalRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

/**
 * Extracts a structurally valid bearer JWT from an Authorization header.
 * Returns null for anything that is missing, malformed, or not a 3-part JWT —
 * the caller then treats the request as unauthenticated.
 */
export function parseBearerToken(header: string | null | undefined): string | null {
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  if (!token || token.split(".").length !== 3) return null;
  return token;
}

export type InternalUserUpdateIntent = {
  role?: InternalRole | undefined;
  disabled?: boolean | undefined;
};

export type InternalUserUpdateDecision =
  | { ok: true; patch: { role?: InternalRole; disabled_at?: string | null } }
  | { ok: false; error: "cannot_modify_self" | "last_admin" | "no_change" };

/** True when the intent would strip admin capability from the target user. */
export function intentRemovesAdmin(intent: InternalUserUpdateIntent): boolean {
  return (intent.role !== undefined && intent.role !== "admin") || intent.disabled === true;
}

/**
 * Decides whether an admin-initiated role/enablement change is allowed.
 *
 * Two lockout guards, both enforced server-side:
 *   1. An admin can never demote or disable their own account.
 *   2. The last enabled admin can never be demoted or disabled by anyone.
 */
export function evaluateInternalUserUpdate(input: {
  actorUserId: string | undefined;
  targetUserId: string;
  target: { role: InternalRole; disabled: boolean } | undefined;
  enabledAdminCount: number;
  intent: InternalUserUpdateIntent;
  now?: Date;
}): InternalUserUpdateDecision {
  const removesAdmin = intentRemovesAdmin(input.intent);

  if (input.actorUserId && input.actorUserId === input.targetUserId && removesAdmin) {
    return { ok: false, error: "cannot_modify_self" };
  }

  if (
    removesAdmin &&
    input.target &&
    input.target.role === "admin" &&
    !input.target.disabled &&
    input.enabledAdminCount <= 1
  ) {
    return { ok: false, error: "last_admin" };
  }

  const patch: { role?: InternalRole; disabled_at?: string | null } = {};
  if (input.intent.role) patch.role = input.intent.role;
  if (typeof input.intent.disabled === "boolean") {
    patch.disabled_at = input.intent.disabled ? (input.now ?? new Date()).toISOString() : null;
  }
  if (Object.keys(patch).length === 0) return { ok: false, error: "no_change" };

  return { ok: true, patch };
}
