/**
 * Phase 10 — owner-only first-admin bootstrap.
 *
 * Self-disabling: the handler refuses to do anything once ANY row exists in
 * `public.internal_users`. It only ever touches one hard-allowlisted owner
 * email, never accepts or returns a password, and never returns a recovery
 * link — Supabase Auth emails the password-set link to that mailbox directly.
 * There is no reusable secret and no public signup path.
 */
import { createFileRoute } from "@tanstack/react-router";

const BOOTSTRAP_ADMIN_EMAIL = "thomasdubiel1@gmail.com";
const BOOTSTRAP_ADMIN_LABEL = "ops_lead";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/internal/bootstrap-first-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { count, error: countError } = await supabaseAdmin
          .from("internal_users")
          .select("user_id", { count: "exact", head: true });
        if (countError) return json({ ok: false, error: "lookup_failed" }, 500);
        if ((count ?? 0) > 0) return json({ ok: false, error: "already_bootstrapped" }, 409);

        // Reuse the auth account if it already exists; never create a duplicate.
        const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        if (listError) return json({ ok: false, error: "auth_list_failed" }, 500);

        let user = (list?.users ?? []).find(
          (u) => (u.email ?? "").toLowerCase() === BOOTSTRAP_ADMIN_EMAIL,
        );

        if (!user) {
          // Random, never logged, never returned: the owner sets their own
          // password through the emailed recovery link.
          const throwaway = crypto.randomUUID() + crypto.randomUUID();
          const { data: created, error: createError } =
            await supabaseAdmin.auth.admin.createUser({
              email: BOOTSTRAP_ADMIN_EMAIL,
              password: throwaway,
              email_confirm: true,
            });
          if (createError || !created?.user) {
            return json({ ok: false, error: "auth_create_failed" }, 500);
          }
          user = created.user;
        }

        const { error: mapError } = await supabaseAdmin
          .from("internal_users")
          .upsert(
            { user_id: user.id, role: "admin", display_label: BOOTSTRAP_ADMIN_LABEL },
            { onConflict: "user_id" },
          );
        if (mapError) return json({ ok: false, error: "mapping_failed" }, 500);

        const { error: recoveryError } = await supabaseAdmin.auth.resetPasswordForEmail(
          BOOTSTRAP_ADMIN_EMAIL,
        );

        return json({
          ok: true,
          userId: user.id,
          role: "admin",
          label: BOOTSTRAP_ADMIN_LABEL,
          passwordEmailSent: !recoveryError,
          // Now that an internal_users row exists, this endpoint is disabled.
          selfDisabled: true,
        });
      },
    },
  },
});
