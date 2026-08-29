# QWA Internal Revenue Operations — architecture notes

Internal only. Every route below is behind the server-side `INTERNAL_OPS_TOKEN`
boundary, marked noindex/noarchive, and absent from the sitemap and public
navigation. Nothing in this system sends email, SMS or calls, connects a CRM
(HighLevel remains deferred), or produces revenue/ROAS/opportunity figures.

## Phase freezes

| Phase | Scope | Frozen commit |
| --- | --- | --- |
| 4C | Launch hardening, SEO gate, consent, legal, health | `740867cf6c7363243ca34fd37585ba645faf2a03` |
| 5 | Lead operations console | `b162c589f6148d1d011c08102c71485298881712` |
| 6 | Revenue intelligence | `a7b45eab4770c6ba91867cffea7a35675d9e7e05` |
| 7 | Operator command center | `08231044a2c936d46d02ce43e9b0d8948da8473b` |
| 8 | Automation control plane & playbook engine | `43c4b975edf02b58c7dd035f278a337e08c6cc04` |

The public visual/copy/interaction baseline stays frozen; it changes only for a
verified regression, security issue or critical accessibility defect.

## Routes

- `/internal/leads` — lead detail, notes, tasks, activity, delivery retry
- `/internal/revenue` — executive intelligence, operator attention
- `/internal/work-queue` — deterministic Phase 7 priority queues
- `/internal/automation` — playbook modes, recommendations, executions
- `/internal/control-plane` — Phase 9 governance, simulation, anomalies

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

| Signal | Rule |
| --- | --- |
| Overdue accumulation | `count(open leads past SLA target) >= overdueLeads` (default 5) |
| Delivery failures | `count(open leads, latest delivery = failed) >= deliveryFailures` (default 3) |
| Stuck pending delivery | `count(latest delivery = pending AND age >= deliveryFailureHours) >= stuckPending` (default 3) |
| Automation errors | `count(executions with outcome = failed in window) >= executionErrors` (default 1) |
| Stale recommendations | `count(pending recommendations older than staleRecommendationHours) >= 1` (default 24h) |

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
