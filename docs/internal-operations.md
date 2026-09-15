# QWA Internal Revenue Operations — architecture notes

Internal only. Every route below requires an authenticated internal account with
an enabled role (Phase 10), is marked noindex/noarchive, and is absent from the
sitemap and public navigation. Nothing in this system sends email, SMS or calls,
connects a CRM (HighLevel remains deferred), or produces revenue/ROAS/opportunity
figures.

The Phase 5–9 shared `INTERNAL_OPS_TOKEN` no longer exists anywhere in the code
or configuration.

## Phase freezes

| Phase | Scope                                              | Frozen commit                              |
| ----- | -------------------------------------------------- | ------------------------------------------ |
| 4C    | Launch hardening, SEO gate, consent, legal, health | `740867cf6c7363243ca34fd37585ba645faf2a03` |
| 5     | Lead operations console                            | `b162c589f6148d1d011c08102c71485298881712` |
| 6     | Revenue intelligence                               | `a7b45eab4770c6ba91867cffea7a35675d9e7e05` |
| 7     | Operator command center                            | `08231044a2c936d46d02ce43e9b0d8948da8473b` |
| 8     | Automation control plane & playbook engine         | `43c4b975edf02b58c7dd035f278a337e08c6cc04` |

The public visual/copy/interaction baseline stays frozen; it changes only for a
verified regression, security issue or critical accessibility defect.

## Routes

- `/internal/leads` — lead detail, notes, tasks, activity, delivery retry
- `/internal/revenue` — executive intelligence, operator attention
- `/internal/work-queue` — deterministic Phase 7 priority queues
- `/internal/automation` — playbook modes, recommendations, executions
- `/internal/control-plane` — Phase 9 governance, simulation, anomalies
- `/internal/access` — Phase 10 admin-only internal role administration

## Phase 9 — control plane

### Configuration governance

`public.automation_config_versions` (service-role only, RLS enabled, no
policies) stores an append-only history of `AutomationConfig` snapshots: SLA
targets, per-playbook enablement/cooldown/max-executions, and anomaly
thresholds. Version 1 is the Phase 8 baseline, materialised on first read so
behaviour is unchanged until an operator edits something.

- Saving a change validates + clamps the values (`normalizeConfig`), requires a
  change reason, rejects no-op edits, inserts a new version and activates it.
- Rollback re-inserts a prior snapshot verbatim as a new version with
  `source = rollback` and `rolled_back_from`; history is never rewritten.
- Every governance event is audited into `automation_executions` with
  `playbook_key = 'governance'` under the neutral `internal_operator` label.
- A single partial unique index guarantees exactly one active version.

The active configuration feeds the Phase 7 work-queue SLA snapshot and the
Phase 8 execution gate (enablement, cooldown, max executions per lead).

### Simulation

`simulateLead()` evaluates every playbook trigger/stop predicate and the real
execution gate against a real lead and returns the inputs, rule text, boolean
results, thresholds, limits, execution counts, idempotency key and the exact
gate reason code. It contains no write path and is labelled as simulation in the
UI.

### Anomaly rules (deterministic, no scoring model)

| Signal                 | Rule                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Overdue accumulation   | `count(open leads past SLA target) >= overdueLeads` (default 5)                                |
| Delivery failures      | `count(open leads, latest delivery = failed) >= deliveryFailures` (default 3)                  |
| Stuck pending delivery | `count(latest delivery = pending AND age >= deliveryFailureHours) >= stuckPending` (default 3) |
| Automation errors      | `count(executions with outcome = failed in window) >= executionErrors` (default 1)             |
| Stale recommendations  | `count(pending recommendations older than staleRecommendationHours) >= 1` (default 24h)        |

Default anomaly window: 24h. Each signal shows observed count, threshold,
window, evidence rows and a drill-down link.

### Observability

Execution counts (executed / skipped / blocked / failed plus reason-code tally)
come only from recorded `automation_executions` rows in the stated window.
Execution latency is not persisted, so no latency figure is shown.

## Security posture

- All Phase 7–9 operational tables are service-role only: RLS enabled, no
  policies, no `anon` / `authenticated` grants. They are unreachable from the
  Data API. The Supabase linter reports these as INFO "RLS Enabled No Policy";
  that is the intended posture.
- The service-role client is imported inside handlers, never at module scope.
- The operator key is session-scoped in the browser and verified server-side.

## Phase 10 — internal identity, roles and access

### Access model

- Operators sign in with backend email/password auth on any `/internal/*` route.
  There is no public signup, no invitation flow, and no shared token.
- The signed-in user must have an **enabled** row in `public.internal_users`
  (`user_id` → `auth.users.id`) carrying a `role` of `viewer`, `ops` or `admin`
  and a neutral `display_label`. A row with `disabled_at` set is refused.
- `requireInternalAccess(minRole)` in `src/lib/ops/auth.server.ts` verifies the
  request bearer token, resolves the role and enforces the minimum. Every server
  function calls it before touching data; the UI role is advisory only.
- The authenticated actor is bound with `AsyncLocalStorage` and written to the
  `actor_label` / `actor_user_id` audit columns on every operational and
  governance mutation. Historical rows keep the neutral `internal_operator`
  label.

### Role matrix

| Capability                                                            | viewer | ops | admin |
| --------------------------------------------------------------------- | ------ | --- | ----- |
| Read leads, work queue, revenue intelligence, automation, control plane | yes    | yes | yes   |
| Lead status change, delivery retry, notes, tasks                        | no     | yes | yes   |
| Recommendation approve / dismiss / snooze, dry-run preview              | no     | yes | yes   |
| Automation mode, kill switch, live automation run                       | no     | no  | yes   |
| Configuration version create / activate / rollback                      | no     | no  | yes   |
| Internal access administration (`/internal/access`)                     | no     | no  | yes   |

### Owner setup — the first real admin (already completed)

The first admin was provisioned once through a one-time, self-disabling
bootstrap endpoint that refused to act if `public.internal_users` already had
any row. It touched only one hard-coded owner email, created that auth account
with a random throwaway password that was never returned or logged, marked the
email confirmed, upserted the `internal_users` row with role `admin` and the
neutral label `ops_lead`, and triggered a standard Auth password-recovery email
so the owner sets their own password. No link, token or secret was ever
returned.

That endpoint has since been **removed from the codebase** — once the first
admin exists it can never do anything again, so keeping it only adds attack
surface. It must not be reintroduced.

Provisioning from here on:

1. An owner creates the auth account in supported backend user management.
2. An admin maps it in `/internal/access` with role `viewer`, `ops` or `admin`
   and a neutral display label. That screen never creates accounts, never
   invites, and never sends external communication.
3. If every admin were ever lost, recovery is an owner action in backend user
   management plus a direct `public.internal_users` row change — there is no
   console bypass and no reusable secret anywhere.



### Sign-in, sign-out, recovery

- Sign-out clears the query cache and ends the backend session; protected data
  is refetched only after a fresh sign-in.
- An expired or invalid session renders the sign-in panel again and returns no
  data — server functions answer `unauthenticated`, not partial results.
- Password recovery is an owner action in backend user management. Losing access
  never grants a bypass path from the console.
- Revoking access: set the user's row to disabled in `/internal/access`, or
  disable the auth account. Either is sufficient; both is preferred for
  offboarding.

### Lockout protection

- An admin can never demote or disable their own account.
- The server refuses any change that would leave zero enabled admins
  (`last_admin`), regardless of which admin requests it.

### Future organization / workspace path

`public.tenants`, `public.accounts` and `public.account_memberships` already
exist with member-scoped RLS and the `account_role` enum for the eventual
customer-facing workspace model. `internal_users` stays separate: it is QWA
staff access, not customer membership. When client workspaces ship, internal
consoles keep using `internal_users`, and customer surfaces use
`account_memberships` + `has_account_role`; no internal role is ever inferred
from a customer membership.
