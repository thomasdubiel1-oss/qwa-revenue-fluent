import { createFileRoute } from "@tanstack/react-router";

/**
 * Uptime / readiness probe.
 *
 * Intentionally dependency-light: it reports whether the server runtime is
 * alive and which backend configuration is present, without touching the
 * database or leaking any value. Suitable for external uptime monitors.
 */
export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const body = {
          status: "ok",
          service: "qwa-web",
          time: new Date().toISOString(),
          config: {
            database: Boolean(process.env["SUPABASE_URL"]),
            service_role: Boolean(process.env["SUPABASE_SERVICE_ROLE_KEY"]),
            cron_secret: Boolean(process.env["LOVABLE_CRON_SECRET"]),
            // Deferred integration: absence here is expected pre-launch.
            crm_outbox: Boolean(process.env["LEAD_WEBHOOK_URL"]),
          },
        };
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
