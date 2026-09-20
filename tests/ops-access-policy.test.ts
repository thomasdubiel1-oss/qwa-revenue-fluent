/**
 * Phase 10 regression tests — internal RBAC + last-admin protection.
 * Pure policy tests: no database, no network, no production data touched.
 */
import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateInternalUserUpdate,
  hasMinRole,
  intentRemovesAdmin,
  isInternalRole,
  parseBearerToken,
  ROLE_RANK,
} from "../src/lib/ops/access-policy.ts";

test("role ranking is strictly viewer < ops < admin", () => {
  assert.ok(ROLE_RANK.viewer < ROLE_RANK.ops);
  assert.ok(ROLE_RANK.ops < ROLE_RANK.admin);
});

test("viewer cannot satisfy ops or admin boundaries", () => {
  assert.equal(hasMinRole("viewer", "viewer"), true);
  assert.equal(hasMinRole("viewer", "ops"), false);
  assert.equal(hasMinRole("viewer", "admin"), false);
});

test("ops satisfies operational boundaries but not governance", () => {
  assert.equal(hasMinRole("ops", "viewer"), true);
  assert.equal(hasMinRole("ops", "ops"), true);
  assert.equal(hasMinRole("ops", "admin"), false);
});

test("admin satisfies every boundary", () => {
  for (const min of ["viewer", "ops", "admin"] as const) {
    assert.equal(hasMinRole("admin", min), true);
  }
});

test("untrusted role values are rejected", () => {
  assert.equal(isInternalRole("admin"), true);
  assert.equal(isInternalRole("superadmin"), false);
  assert.equal(isInternalRole("Admin"), false);
  assert.equal(isInternalRole(undefined), false);
  assert.equal(isInternalRole(null), false);
  assert.equal(isInternalRole(3), false);
});

test("only structurally valid bearer JWTs are accepted", () => {
  assert.equal(parseBearerToken("Bearer aaa.bbb.ccc"), "aaa.bbb.ccc");
  assert.equal(parseBearerToken(null), null);
  assert.equal(parseBearerToken(undefined), null);
  assert.equal(parseBearerToken(""), null);
  assert.equal(parseBearerToken("Bearer "), null);
  assert.equal(parseBearerToken("bearer aaa.bbb.ccc"), null, "scheme is case-sensitive");
  assert.equal(parseBearerToken("Basic aaa.bbb.ccc"), null);
  assert.equal(parseBearerToken("Bearer sb_publishable_abc"), null, "api keys are not sessions");
  assert.equal(parseBearerToken("Bearer aaa.bbb"), null);
});

const NOW = new Date("2026-01-01T00:00:00.000Z");

test("an admin cannot demote or disable their own account", () => {
  for (const intent of [{ role: "viewer" as const }, { disabled: true }]) {
    const result = evaluateInternalUserUpdate({
      actorUserId: "me",
      targetUserId: "me",
      target: { role: "admin", disabled: false },
      enabledAdminCount: 3,
      intent,
      now: NOW,
    });
    assert.deepEqual(result, { ok: false, error: "cannot_modify_self" });
  }
});

test("an admin may still change their own display-neutral non-demoting fields", () => {
  const result = evaluateInternalUserUpdate({
    actorUserId: "me",
    targetUserId: "me",
    target: { role: "admin", disabled: false },
    enabledAdminCount: 1,
    intent: { role: "admin" },
    now: NOW,
  });
  assert.equal(result.ok, true);
});

test("the last enabled admin cannot be demoted or disabled by anyone", () => {
  for (const intent of [{ role: "ops" as const }, { disabled: true }]) {
    const result = evaluateInternalUserUpdate({
      actorUserId: "other-admin",
      targetUserId: "last-admin",
      target: { role: "admin", disabled: false },
      enabledAdminCount: 1,
      intent,
      now: NOW,
    });
    assert.deepEqual(result, { ok: false, error: "last_admin" });
  }
});

test("demoting an admin is allowed while another enabled admin remains", () => {
  const result = evaluateInternalUserUpdate({
    actorUserId: "admin-a",
    targetUserId: "admin-b",
    target: { role: "admin", disabled: false },
    enabledAdminCount: 2,
    intent: { role: "ops" },
    now: NOW,
  });
  assert.deepEqual(result, { ok: true, patch: { role: "ops" } });
});

test("already-disabled admins do not count toward the lockout guard", () => {
  const result = evaluateInternalUserUpdate({
    actorUserId: "admin-a",
    targetUserId: "admin-b",
    target: { role: "admin", disabled: true },
    enabledAdminCount: 1,
    intent: { role: "viewer" },
    now: NOW,
  });
  assert.deepEqual(result, { ok: true, patch: { role: "viewer" } });
});

test("disabling stamps a timestamp and re-enabling clears it", () => {
  const disable = evaluateInternalUserUpdate({
    actorUserId: "admin-a",
    targetUserId: "ops-b",
    target: { role: "ops", disabled: false },
    enabledAdminCount: 2,
    intent: { disabled: true },
    now: NOW,
  });
  assert.deepEqual(disable, { ok: true, patch: { disabled_at: NOW.toISOString() } });

  const enable = evaluateInternalUserUpdate({
    actorUserId: "admin-a",
    targetUserId: "ops-b",
    target: { role: "ops", disabled: true },
    enabledAdminCount: 2,
    intent: { disabled: false },
    now: NOW,
  });
  assert.deepEqual(enable, { ok: true, patch: { disabled_at: null } });
});

test("an empty intent changes nothing", () => {
  const result = evaluateInternalUserUpdate({
    actorUserId: "admin-a",
    targetUserId: "ops-b",
    target: { role: "ops", disabled: false },
    enabledAdminCount: 2,
    intent: {},
    now: NOW,
  });
  assert.deepEqual(result, { ok: false, error: "no_change" });
});

test("intentRemovesAdmin only flags demotion or disablement", () => {
  assert.equal(intentRemovesAdmin({ role: "admin" }), false);
  assert.equal(intentRemovesAdmin({ disabled: false }), false);
  assert.equal(intentRemovesAdmin({ role: "ops" }), true);
  assert.equal(intentRemovesAdmin({ disabled: true }), true);
});

test("guards hold even when the actor is unknown", () => {
  const result = evaluateInternalUserUpdate({
    actorUserId: undefined,
    targetUserId: "last-admin",
    target: { role: "admin", disabled: false },
    enabledAdminCount: 1,
    intent: { disabled: true },
    now: NOW,
  });
  assert.deepEqual(result, { ok: false, error: "last_admin" });
});
