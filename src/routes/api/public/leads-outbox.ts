import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "crypto";

/**
 * Outbox drain endpoint for a future scheduler (cron / pg_net).
 * Authenticated with the project's cron secret; no lead data is returned.
 */
function authorized(request: Request): boolean {
  const secret = process.env["LOVABLE_CRON_SECRET"];
  if (!secret) return false;
  const header = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = createHash("sha256").update(header).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/leads-outbox")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
        const { drainLeadOutbox } = await import("@/lib/leads/outbox.server");
        const result = await drainLeadOutbox();
        return Response.json(result);
      },
    },
  },
});
