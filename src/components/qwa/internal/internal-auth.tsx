/**
 * Phase 10 — internal console sign-in gate.
 *
 * There is no public signup and no shared access token. Operators sign in with
 * a Supabase account that an owner has provisioned and mapped to a row in
 * `public.internal_users`. The role reported here is resolved SERVER-side;
 * it only drives what the UI offers. Every server function re-checks it.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LockKeyhole, LogOut, ShieldAlert } from "lucide-react";
import * as React from "react";

import { OpsShell, Panel } from "@/components/qwa/internal/ops-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { InternalSession } from "@/lib/ops/auth.functions";
import { opsSessionFn } from "@/lib/ops/auth.functions";
import type { InternalRole } from "@/lib/ops/types";

const RANK: Record<InternalRole, number> = { viewer: 1, ops: 2, admin: 3 };

type Ready = { role: InternalRole; label: string };

const SessionContext = React.createContext<Ready>({ role: "viewer", label: "internal_operator" });

/** Role of the signed-in operator. Only valid inside `<InternalGate>`. */
export function useInternalSession(): Ready & { can: (min: InternalRole) => boolean } {
  const value = React.useContext(SessionContext);
  return { ...value, can: (min) => RANK[value.role] >= RANK[min] };
}

/** Consistent role indicator used in every internal console header. */
export function RolePill() {
  const { role } = useInternalSession();
  return (
    <span className="rounded-full border border-border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
      {role}
    </span>
  );
}

export function InternalSignOutButton() {
  const queryClient = useQueryClient();
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={async () => {
        await queryClient.cancelQueries();
        queryClient.clear();
        await supabase.auth.signOut();
      }}
    >
      <LogOut className="size-4" aria-hidden="true" /> Sign out
    </Button>
  );
}

function SignInPanel({ title, reason }: { title: string; reason?: string }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(reason ?? null);

  const signIn = useMutation({
    mutationFn: async () => {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error(signInError.message);
    },
    onSuccess: () => {
      setPassword("");
      setError(null);
      void queryClient.invalidateQueries();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <OpsShell title={title} subtitle="Internal sign-in required">
      <Panel
        title="Sign in to the QWA internal console"
        description="Accounts are provisioned by an owner. There is no public signup."
      >
        <LockKeyhole className="mb-4 size-6 text-primary" aria-hidden="true" />
        <form
          className="max-w-md space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            signIn.mutate();
          }}
        >
          <Input
            type="email"
            required
            autoComplete="username"
            aria-label="Work email"
            placeholder="you@quantumwebai.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            required
            autoComplete="current-password"
            aria-label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={signIn.isPending} className="w-full sm:w-auto">
            {signIn.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        {error ? (
          <p className="mt-3 text-xs text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <p className="mt-4 max-w-md text-xs text-muted-foreground">
          Forgotten access is restored by an owner through backend user management — see
          docs/internal-operations.md.
        </p>
      </Panel>
    </OpsShell>
  );
}

function ForbiddenPanel({ title }: { title: string }) {
  return (
    <OpsShell title={title} subtitle="Not authorized" actions={<InternalSignOutButton />}>
      <Panel
        title="This account has no internal access"
        description="You are signed in, but your account is not an enabled internal user with a sufficient role."
      >
        <ShieldAlert className="mb-3 size-6 text-muted-foreground" aria-hidden="true" />
        <p className="max-w-xl text-sm text-muted-foreground">
          Ask an internal administrator to grant your account a role. Access is never granted from
          this screen, and no lead data was returned.
        </p>
      </Panel>
    </OpsShell>
  );
}

/**
 * Wraps an internal console. Renders sign-in / not-authorized states and only
 * renders children once the server has confirmed the minimum role.
 */
export function InternalGate({
  title,
  minRole = "viewer",
  children,
}: {
  title: string;
  minRole?: InternalRole;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const sessionFn = useServerFn(opsSessionFn);

  const session = useQuery<InternalSession>({
    queryKey: ["ops", "session"],
    queryFn: () => sessionFn({}),
    retry: false,
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void queryClient.invalidateQueries({ queryKey: ["ops"] });
      }
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  if (session.isLoading) {
    return (
      <OpsShell title={title} subtitle="Checking access…">
        <Panel title="Verifying your session">
          <p className="text-sm text-muted-foreground">One moment.</p>
        </Panel>
      </OpsShell>
    );
  }

  const state = session.data;
  // A failed call (expired/invalid token) is treated as signed out.
  if (!state || state.state === "unauthenticated") return <SignInPanel title={title} />;
  if (state.state === "forbidden") return <ForbiddenPanel title={title} />;
  if (RANK[state.role] < RANK[minRole]) return <ForbiddenPanel title={title} />;

  return (
    <SessionContext.Provider value={{ role: state.role, label: state.label }}>
      {children}
    </SessionContext.Provider>
  );
}
