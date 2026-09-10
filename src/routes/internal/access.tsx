/**
 * Phase 10 — internal access administration (admin only).
 *
 * This screen manages EXISTING internal users only. It cannot create accounts,
 * invite anyone, or send any external communication. Accounts are provisioned
 * by an owner through supported backend user management, then mapped to a row
 * in `public.internal_users`. Every action here is re-authorized server-side.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";

import {
  InternalGate,
  InternalSignOutButton,
  RolePill,
  useInternalSession,
} from "@/components/qwa/internal/internal-auth";
import { OpsShell, Panel, Pill } from "@/components/qwa/internal/ops-ui";
import { Button } from "@/components/ui/button";
import { internalHead } from "@/config/seo";
import { opsInternalUsersFn, opsUpdateInternalUserFn } from "@/lib/ops/auth.functions";
import { INTERNAL_ROLES, type InternalRole } from "@/lib/ops/types";

export const Route = createFileRoute("/internal/access")({
  ssr: false,
  head: () => internalHead("Internal Access — QWA Internal"),
  component: () => (
    <InternalGate title="Internal Access" minRole="admin">
      <AccessConsole />
    </InternalGate>
  ),
});

const ERRORS: Record<string, string> = {
  cannot_modify_self: "You cannot remove your own admin access.",
  last_admin: "This is the last enabled admin. Promote another admin first.",
  no_change: "Nothing changed.",
  forbidden: "Your account is not allowed to make that change.",
  update_failed: "The change could not be saved. Try again.",
};

function AccessConsole() {
  const queryClient = useQueryClient();
  const { label: myLabel } = useInternalSession();
  const [notice, setNotice] = React.useState<string | null>(null);

  const listFn = useServerFn(opsInternalUsersFn);
  const updateFn = useServerFn(opsUpdateInternalUserFn);

  const users = useQuery({
    queryKey: ["ops", "internal-users"],
    queryFn: () => listFn({}),
  });

  const update = useMutation({
    mutationFn: (vars: { userId: string; role?: InternalRole; disabled?: boolean }) =>
      updateFn({ data: vars }),
    onSuccess: (res) => {
      setNotice(res.ok ? "Access updated." : (ERRORS[res.error ?? ""] ?? "Change rejected."));
      void queryClient.invalidateQueries({ queryKey: ["ops"] });
    },
    onError: () => setNotice("Change rejected."),
  });

  const rows = users.data?.users ?? [];
  const enabledAdmins = rows.filter((u) => u.role === "admin" && !u.disabled).length;

  return (
    <OpsShell
      title="Internal Access"
      subtitle="Roles for existing internal accounts · no signup, no invitations"
      actions={
        <>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/control-plane">Control plane</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/leads">Leads</Link>
          </Button>
          <RolePill />
          <InternalSignOutButton />
        </>
      }
    >
      <Panel
        title="Internal users"
        description="viewer reads only · ops performs operational actions · admin governs configuration and access."
      >
        {users.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {!users.isLoading && rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No internal users are mapped yet. An owner provisions the account in backend user
            management and inserts the matching row before it appears here.
          </p>
        ) : null}

        {notice ? (
          <p className="mb-3 text-xs text-muted-foreground" role="status">
            {notice}
          </p>
        ) : null}

        {rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <caption className="sr-only">Internal users and their roles</caption>
              <thead>
                <tr className="text-left text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Operator
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Role
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    State
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Added
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => {
                  const isSelf = user.displayLabel === myLabel;
                  const isLastAdmin = user.role === "admin" && !user.disabled && enabledAdmins <= 1;
                  const locked = isSelf || isLastAdmin;
                  const busy = update.isPending;
                  return (
                    <tr key={user.userId} className="border-t border-border/50 align-middle">
                      <th scope="row" className="py-3 pr-4 text-left font-medium">
                        {user.displayLabel}
                        <span className="block font-mono text-[0.62rem] font-normal text-muted-foreground">
                          {user.userId}
                        </span>
                      </th>
                      <td className="py-3 pr-4">
                        <label className="sr-only" htmlFor={`role-${user.userId}`}>
                          Role for {user.displayLabel}
                        </label>
                        <select
                          id={`role-${user.userId}`}
                          className="min-h-11 rounded-md border border-border bg-background px-2 text-sm"
                          value={user.role}
                          disabled={busy || locked}
                          onChange={(e) =>
                            update.mutate({
                              userId: user.userId,
                              role: e.target.value as InternalRole,
                            })
                          }
                        >
                          {INTERNAL_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-4">
                        <Pill tone={user.disabled ? "warn" : "positive"}>
                          {user.disabled ? "disabled" : "enabled"}
                        </Pill>
                        {isSelf ? <Pill tone="muted">you</Pill> : null}
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="min-h-11"
                          disabled={busy || locked}
                          title={
                            isSelf
                              ? "You cannot change your own access"
                              : isLastAdmin
                                ? "Last enabled admin"
                                : undefined
                          }
                          onClick={() => {
                            const next = !user.disabled;
                            if (
                              !next ||
                              window.confirm(`Disable internal access for ${user.displayLabel}?`)
                            ) {
                              update.mutate({ userId: user.userId, disabled: next });
                            }
                          }}
                        >
                          {user.disabled ? "Enable" : "Disable"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        <p className="mt-4 max-w-2xl text-xs text-muted-foreground">
          Accounts are never created here. The server rejects any change that would remove your own
          admin access or leave no enabled admin, regardless of what this screen offers.
        </p>
      </Panel>
    </OpsShell>
  );
}
