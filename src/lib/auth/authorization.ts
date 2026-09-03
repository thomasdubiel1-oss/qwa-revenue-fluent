export const accountRoles = ["owner", "admin", "operator", "analyst", "viewer"] as const;

export type AccountRole = (typeof accountRoles)[number];
export type AccountPermission =
  "account:manage" | "members:manage" | "journeys:read" | "journeys:write" | "automation:approve";

const permissionsByRole: Record<AccountRole, readonly AccountPermission[]> = {
  owner: [
    "account:manage",
    "members:manage",
    "journeys:read",
    "journeys:write",
    "automation:approve",
  ],
  admin: ["members:manage", "journeys:read", "journeys:write", "automation:approve"],
  operator: ["journeys:read", "journeys:write", "automation:approve"],
  analyst: ["journeys:read"],
  viewer: ["journeys:read"],
};

export function isAccountRole(value: unknown): value is AccountRole {
  return typeof value === "string" && accountRoles.includes(value as AccountRole);
}

export function can(role: AccountRole, permission: AccountPermission): boolean {
  return permissionsByRole[role].includes(permission);
}
