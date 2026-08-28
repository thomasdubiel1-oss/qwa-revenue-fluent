# QWA Launch Readiness (Phase 4C)

Operational reference for taking the site from private/unpublished to production.
Nothing here is applied automatically — each item is a deliberate launch action.

## 1. Environment configuration

| Variable | Scope | Required for | Status |
| --- | --- | --- | --- |
| `VITE_SITE_URL` | build/client | Canonical URLs, OG `og:url`, sitemap | **Set at launch** (defaults to `https://quantumwebai.com`) |
| `VITE_SITE_INDEXABLE` | build/client | Turns robots/sitemap/`meta robots` from noindex to indexable | **Set to `true` only at launch** |
| `SUPABASE_URL` | server | Lead persistence | Configured |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Lead persistence (server-only) | Configured |
| `LOVABLE_CRON_SECRET` | server | Authenticates `/api/public/leads-outbox` | Configured |
| `LEAD_WEBHOOK_URL` | server | CRM/HighLevel outbox destination | **Deferred** — outbox queues durably without it |
| `LEAD_WEBHOOK_TOKEN` | server | Auth header for the CRM webhook | **Deferred** |

Client-visible values must be `VITE_*` only. No service-role key, webhook token
or cron secret is referenced anywhere in browser-reachable code.

## 2. SEO switch

Indexing is a single configuration flip:

- `VITE_SITE_INDEXABLE` unset → `/robots.txt` returns `Disallow: /`,
  `/sitemap.xml` returns an empty urlset, every page emits `noindex, nofollow`.
- `VITE_SITE_INDEXABLE=true` → crawling allowed (excluding `/internal/` and
  `/api/`), full sitemap, `index, follow, max-image-preview:large`.

Canonical URLs, OG and Twitter tags all derive from `VITE_SITE_URL` via
`src/config/seo.ts`. `PUBLIC_ROUTES` in that file is the single sitemap source —
add new public routes there.

## 3. Analytics

The analytics layer (`src/lib/analytics.ts`) is provider-neutral: it pushes to
`window.dataLayer` and re-emits a `qwa:analytics` DOM event. No SDK is bundled.

Lifecycle events: `demo_cta_clicked`, `demo_modal_opened`, `demo_modal_dismissed`,
`demo_form_started`, `demo_form_submitted`, `demo_form_success`, `demo_form_failed` —
each carries `source`, `route` and `ts`.

To enable a provider at launch:

1. Obtain the real container/project ID from the owner (GA4 `G-…`, GTM `GTM-…`,
   or a PostHog project key). **Do not invent IDs.**
2. Add the loader snippet in `src/routes/__root.tsx` `head().scripts`, gated on
   `isAllowed("analytics")` from `src/lib/consent.ts`.
3. Update the Privacy page "Cookies and third-party tracking" section to name
   the provider before the tag goes live.

Duplicate suppression: identical `event + source` pairs inside 1200 ms are
dropped client-side. The authoritative record of a successful conversion is the
server: a `demo_requests` row plus a `conversion_events` row written by the lead
server function. Client `demo_form_success` is a funnel signal, not the ledger.

## 4. Consent

`src/lib/consent.ts` holds the preference store (`attribution`, `analytics`).
Defaults: attribution on (first-party, session-scoped), analytics off until an
explicit decision. `resetConsent()` clears both the preference and captured
attribution. A visible preference UI/banner is **not** shipped — that is a legal
decision for the owner; the hooks are in place to drive one.

## 5. Security posture

- All five lead tables (`demo_requests`, `demo_request_context`,
  `lead_deliveries`, `conversion_events`, `submission_throttle`) have RLS
  enabled with **zero policies** and no `anon`/`authenticated` grants. They are
  unreachable from any browser client — intentional, server-only by design.
- Writes go exclusively through `submitDemoRequestFn`, which re-validates,
  sanitises, rate-limits (hashed signal, hourly window) and enforces
  idempotency server-side. Client heuristics are convenience only.
- Bot submissions (honeypot or sub-2.5s fill) return a normal success and store
  nothing.
- Network addresses are one-way hashed before storage; server logs emit error
  codes only, never lead PII.
- `/api/public/leads-outbox` requires the cron secret.
- `/api/public/health` exposes liveness plus booleans for which configuration is
  present — never a value.

## 6. Monitoring and operations

- **Health check**: `GET /api/public/health` → `200` JSON. Point an uptime
  monitor here. No credentials needed.
- **Error monitoring**: root `errorComponent` reports through
  `src/lib/lovable-error-reporting.ts`. If a third-party monitor (e.g. Sentry)
  is adopted, add its DSN as a server secret and call it from that module — no
  placeholder DSN is committed.
- **Backups**: managed backend takes automated backups; point-in-time recovery
  window should be confirmed by the owner before launch.
- **Rollback**: revert to the previously published commit and re-publish. No
  destructive schema migration is part of this phase, so a code rollback is
  safe against the current database. Any future column drop must ship as an
  additive migration first.
- **Environment separation**: the preview host and the production host are
  distinct deployments of the same code; only production should carry
  `VITE_SITE_INDEXABLE=true`.

## 7. Open owner / counsel items

1. Legal entity name, registered address, and privacy contact address.
2. Governing law, venue, warranty disclaimer, limitation of liability.
3. Confirmation of the 730-day retention default and legal basis for processing.
4. Decision on a cookie/consent banner for EU/UK traffic.
5. Analytics provider choice and real IDs.
6. HighLevel credentials (`LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN`) — deferred.
7. Final `VITE_SITE_URL` production domain.

## Phase 5 — Internal Lead Operations Console

Route: `/internal/leads` (noindex, nofollow, noarchive; excluded from sitemap and all public navigation).

Access model (owner action required before use):
1. Add a secret named `INTERNAL_OPS_TOKEN` (32+ random characters) in Project Settings → Secrets.
2. Operators enter that key once per browser session; it is held in sessionStorage only and validated server-side with a timing-safe compare.
3. Until the secret exists, the console renders a locked state and returns zero lead data.

Recommended upgrade path: backend auth + a separate `user_roles` table with an `ops` role verified
server-side. Only `checkOpsAccess()` in `src/lib/ops/ops.server.ts` needs to change.

HighLevel remains deferred: retries requeue the outbox row and the drain reports `no_destination`
until `LEAD_WEBHOOK_URL` is set.
