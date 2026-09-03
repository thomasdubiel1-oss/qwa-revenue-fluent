import type { Session } from "@supabase/supabase-js";
import { Loader2, LockKeyhole, LogOut } from "lucide-react";
import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type AuthState =
  { status: "loading" } | { status: "anonymous" } | { status: "authenticated"; session: Session };

export function AppAuthBoundary({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAuth(
        data.session ? { status: "authenticated", session: data.session } : { status: "anonymous" },
      );
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session ? { status: "authenticated", session } : { status: "anonymous" });
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function requestMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(undefined);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });
    setSubmitting(false);
    setMessage(error ? error.message : "Check your email for a secure sign-in link.");
  }

  if (auth.status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Checking session" />
      </div>
    );
  }

  if (auth.status === "anonymous") {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6">
        <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <LockKeyhole className="mb-5 size-8 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            QWA Digital Twin
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your approved work email. Access is limited by account membership and role.
          </p>
          <form className="mt-6 space-y-3" onSubmit={requestMagicLink}>
            <Input
              aria-label="Work email"
              autoComplete="email"
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Sending…" : "Email me a sign-in link"}
            </Button>
          </form>
          {message ? (
            <p className="mt-4 text-sm text-muted-foreground" role="status">
              {message}
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <div className="relative">
      <Button
        className="fixed right-4 top-4 z-50 gap-2"
        size="sm"
        variant="outline"
        onClick={() => void supabase.auth.signOut()}
      >
        <LogOut className="size-4" /> Sign out
      </Button>
      {children}
    </div>
  );
}
