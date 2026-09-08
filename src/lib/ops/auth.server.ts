/**
 * Phase 10 — internal identity and authorization boundary.
 *
 * ACCESS MODEL:
 *   Every internal console read/write is authorized here, server-side, from an
 *   authenticated Supabase session (bearer token attached by the client
 *   function middleware). The signed-in user must have an enabled row in
 *   `public.internal_users`; that row's role (viewer | ops | admin) decides
 *   what the request may do. There is no shared access token, no public
 *   signup, and no client-supplied role of any kind.
 *
 *   Role ranking: viewer (read-only) < ops (operational mutations) <
 *   admin (governance, configuration, role administration).
 *
 * Lead PII still never reaches an anonymous client: data access continues to
 * run through the service-role client inside server functions, only after the
 * authorization check below succeeds.
 */
import { AsyncLocalStorage } from "node:async_hooks";

import { createClient } from "@supabase/supabase-js";
import { getRequest } from "@tanstack/react-start/server";

import type { Database } from "@/integrations/supabase/types";

import type { InternalActor, InternalRole, OpsAccessState } from "./types";

const RANK: Record<InternalRole, number> = { viewer: 1, ops: 2, admin: 3 };

const actorStore = new AsyncLocalStorage<InternalActor>();

/** Runs `fn` with the authenticated actor bound to the async context. */
export function withActor<T>(actor: InternalActor, fn: () => T | Promise<T>): Promise<T> {
  return Promise.resolve(actorStore.run(actor, fn));
}

export function currentActor(): InternalActor | undefined {
  return actorStore.getStore();
}

/** Audit columns for any operational/governance mutation. */
export function actorFields(fallbackLabel = "internal_operator") {
  const actor = currentActor();
  return {
    actor_label: actor?.label ?? fallbackLabel,
    actor_user_id: actor?.userId ?? null,
  };
}

function bearerToken(): string | null {
  const request = getRequest();
  const header = request?.headers?.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  if (!token || token.split(".").length !== 3) return null;
  return token;
}

function userClient(token: string) {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("supabase_env_missing");
  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export type AccessResult =
  | { state: "ready"; actor: InternalActor }
  | { state: "unauthenticated" }
  | { state: "forbidden"; role?: InternalRole };

/**
 * Resolves the authenticated internal actor and enforces the minimum role.
 * Returns a discriminated result — it never throws for an ordinary denial.
 */
export async function requireInternalAccess(min: InternalRole): Promise<AccessResult> {
  const token = bearerToken();
  if (!token) return { state: "unauthenticated" };

  let client: ReturnType<typeof userClient>;
  try {
    client = userClient(token);
  } catch {
    return { state: "unauthenticated" };
  }

  const { data: claims, error: claimsError } = await client.auth.getClaims(token);
  const userId = claims?.claims?.sub;
  if (claimsError || !userId) return { state: "unauthenticated" };

  const { data: row, error } = await client
    .from("internal_users")
    .select("role,display_label,disabled_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !row || row.disabled_at) return { state: "forbidden" };

  const role = row.role as InternalRole;
  if (RANK[role] < RANK[min]) return { state: "forbidden", role };

  return {
    state: "ready",
    actor: { userId, role, label: row.display_label || "internal_operator" },
  };
}

/** Narrows an access result to the shape returned to clients. */
export function accessState(result: AccessResult): OpsAccessState {
  if (result.state === "ready") return { state: "ready" };
  if (result.state === "unauthenticated") return { state: "unauthenticated" };
  return { state: "forbidden" };
}

export type InternalUserRow = {
  userId: string;
  role: InternalRole;
  displayLabel: string;
  disabled: boolean;
  createdAt: string;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Admin-only: existing internal users. No user is ever invented here. */
export async function listInternalUsers(): Promise<InternalUserRow[]> {
  const db = await admin();
  const { data, error } = await db
    .from("internal_users")
    .select("user_id,role,display_label,disabled_at,created_at")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[qwa:ops] internal user list failed", error.code ?? "unknown");
    return [];
  }
  return (data ?? []).map((row) => ({
    userId: row.user_id,
    role: row.role as InternalRole,
    displayLabel: row.display_label,
    disabled: Boolean(row.disabled_at),
    createdAt: row.created_at,
  }));
}

/**
 * Admin-only: change role / enablement for an EXISTING internal user.
 * Admins cannot remove their own admin rights (last-admin lockout guard).
 */
export async function updateInternalUser(input: {
  userId: string;
  role?: InternalRole | undefined;
  disabled?: boolean | undefined;
}): Promise<{ ok: boolean; error?: string }> {
  const actor = currentActor();
  if (actor && actor.userId === input.userId && (input.role !== "admin" || input.disabled)) {
    return { ok: false, error: "cannot_modify_self" };
  }

  const db = await admin();
  const patch: { role?: InternalRole; disabled_at?: string | null } = {};
  if (input.role) patch.role = input.role;
  if (typeof input.disabled === "boolean") {
    patch.disabled_at = input.disabled ? new Date().toISOString() : null;
  }
  if (Object.keys(patch).length === 0) return { ok: false, error: "no_change" };

  const { error } = await db.from("internal_users").update(patch).eq("user_id", input.userId);
  if (error) {
    console.error("[qwa:ops] internal user update failed", error.code ?? "unknown");
    return { ok: false, error: "update_failed" };
  }
  return { ok: true };
}
