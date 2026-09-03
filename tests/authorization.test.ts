import assert from "node:assert/strict";
import test from "node:test";
import { accountRoles, can, isAccountRole } from "../src/lib/auth/authorization.ts";

test("every supported account role can read journeys", () => {
  for (const role of accountRoles) assert.equal(can(role, "journeys:read"), true);
});

test("only elevated roles can manage members", () => {
  assert.equal(can("owner", "members:manage"), true);
  assert.equal(can("admin", "members:manage"), true);
  assert.equal(can("operator", "members:manage"), false);
  assert.equal(can("analyst", "members:manage"), false);
  assert.equal(can("viewer", "members:manage"), false);
});

test("read-only roles cannot mutate journeys or approve automation", () => {
  for (const role of ["analyst", "viewer"] as const) {
    assert.equal(can(role, "journeys:write"), false);
    assert.equal(can(role, "automation:approve"), false);
  }
});

test("role parser rejects untrusted values", () => {
  assert.equal(isAccountRole("owner"), true);
  assert.equal(isAccountRole("superadmin"), false);
  assert.equal(isAccountRole(null), false);
});
