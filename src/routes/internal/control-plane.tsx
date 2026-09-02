/**
 * Phase 9 — Revenue Operations Control Plane.
 *
 * One operator view over Phase 7 queue health, Phase 8 automation posture and
 * Phase 9 configuration governance. Same boundary as Phase 5–8: server-side
 * INTERNAL_OPS_TOKEN, noindex/noarchive, absent from sitemap and public nav.
 *
 * Nothing here can send email, SMS or calls, connect a CRM, or produce revenue
 * figures. Simulation is strictly read-only.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpsShell, Panel, Pill, StatCard } from "@/components/qwa/internal/ops-ui";
import { internalHead } from "@/config/seo";
import { opsAccessStatusFn } from "@/lib/ops/ops.functions";
import { opsSetAutomationModeFn, opsSetKillSwitchFn } from "@/lib/ops/automation.functions";
import { AUTOMATION_MODE_LABELS, type AutomationMode } from "@/lib/ops/automation.types";
import { opsWorkQueueFn } from "@/lib/ops/workflow.functions";
import {
  opsConfigVersionsFn,
  opsControlPlaneFn,
  opsCreateConfigVersionFn,
  opsRollbackConfigFn,
  opsSimulateLeadFn,
} from "@/lib/ops/governance.functions";
import type { AutomationConfig } from "@/lib/ops/governance.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/internal/control-plane")({
  ssr: false,
  head: () => internalHead("Revenue Operations Control Plane — QWA Internal"),
  component: ControlPlane,
});

const KEY_STORAGE = "qwa:ops-key";

function useOpsKey() {
  const [key, setKey] = React.useState("");
  React.useEffect(() => {
    try {
      setKey(window.sessionStorage.getItem(KEY_STORAGE) ?? "");
    } catch {
      /* storage unavailable */
    }
  }, []);
  const save = React.useCallback((next: string) => {
    setKey(next);
    try {
      if (next) window.sessionStorage.setItem(KEY_STORAGE, next);
      else window.sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* storage unavailable */
    }
  }, []);
  return { key, save };
}

const label = (s: string) => s.replace(/_/g, " ");

function NumberField({
  id,
  labelText,
  value,
  onChange,
  step = 1,
}: {
  id: string;
  labelText: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{labelText}</span>
      <Input
        id={id}
        type="number"
        step={step}
        value={value}
        className="min-h-11"
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function ControlPlane() {
  const { key, save } = useOpsKey();
  const [draftKey, setDraftKey] = React.useState("");
  const [selectedLead, setSelectedLead] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [draft, setDraft] = React.useState<AutomationConfig | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const accessStatus = useServerFn(opsAccessStatusFn);
  const controlFn = useServerFn(opsControlPlaneFn);
  const queueFn = useServerFn(opsWorkQueueFn);
  const versionsFn = useServerFn(opsConfigVersionsFn);
  const simulateFn = useServerFn(opsSimulateLeadFn);
  const createVersionFn = useServerFn(opsCreateConfigVersionFn);
  const rollbackFn = useServerFn(opsRollbackConfigFn);
  const modeFn = useServerFn(opsSetAutomationModeFn);
  const killFn = useServerFn(opsSetKillSwitchFn);

  const configured = useQuery({ queryKey: ["ops", "configured"], queryFn: () => accessStatus({}) });
  const stateQuery = useQuery({
    queryKey: ["ops", "control-plane", key],
    queryFn: () => controlFn({ data: { key } }),
    enabled: Boolean(key),
  });
  const queueQuery = useQuery({
    queryKey: ["ops", "control-plane-queue", key],
    queryFn: () => queueFn({ data: { key } }),
    enabled: Boolean(key),
  });
  const versionsQuery = useQuery({
    queryKey: ["ops", "config-versions", key],
    queryFn: () => versionsFn({ data: { key } }),
    enabled: Boolean(key),
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["ops"] });

  const simulateMutation = useMutation({
    mutationFn: (leadId: string) => simulateFn({ data: { key, leadId } }),
  });
  const saveMutation = useMutation({
    mutationFn: (vars: { config: AutomationConfig; reason: string }) =>
      createVersionFn({ data: { key, ...vars } }),
    onSuccess: (res) => {
      if (res.ok) {
        setNotice(`Activated configuration version ${res.version}.`);
        setReason("");
        setDraft(null);
      } else setNotice(`Change rejected: ${label(res.error)}.`);
      invalidate();
    },
  });
  const rollbackMutation = useMutation({
    mutationFn: (vars: { version: number; reason: string }) =>
      rollbackFn({ data: { key, ...vars } }),
    onSuccess: (res) => {
      setNotice(
        res.ok
          ? `Rolled back into version ${res.version}.`
          : `Rollback rejected: ${label(res.error)}.`,
      );
      invalidate();
    },
  });
  const modeMutation = useMutation({
    mutationFn: (mode: AutomationMode) => modeFn({ data: { key, mode } }),
    onSuccess: invalidate,
  });
  const killMutation = useMutation({
    mutationFn: (engaged: boolean) => killFn({ data: { key, engaged } }),
    onSuccess: invalidate,
  });

  const denied =
    stateQuery.data && stateQuery.data.ok === false && stateQuery.data.access.state === "denied";
  const unconfigured = configured.data?.configured === false;
  const state = stateQuery.data?.ok ? stateQuery.data.data : null;
  const versions = versionsQuery.data?.ok ? versionsQuery.data.data : [];
  const queueItems = queueQuery.data?.ok ? queueQuery.data.data.items : [];
  const sim = simulateMutation.data?.ok ? simulateMutation.data.data : null;
  const config = draft ?? state?.activeVersion.config ?? null;

  if (unconfigured) {
    return (
      <OpsShell title="Revenue Operations Control Plane" subtitle="Access not yet enabled">
        <Panel
          title="Console locked — access dependency not configured"
          description="The route and its server boundary exist, but no operator credential is present."
        >
          <p className="max-w-2xl text-sm text-muted-foreground">
            Add a secret named <code className="text-foreground">INTERNAL_OPS_TOKEN</code> (32+
            random characters) in Project Settings → Secrets. Until then the control plane reads
            nothing and changes nothing.
          </p>
        </Panel>
      </OpsShell>
    );
  }

  if (!key || denied) {
    return (
      <OpsShell title="Revenue Operations Control Plane" subtitle="Internal access required">
        <Panel
          title="Enter operator access key"
          description="Session-scoped. Never stored on disk."
        >
          <form
            className="flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              save(draftKey.trim());
            }}
          >
            <Input
              type="password"
              autoComplete="off"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="INTERNAL_OPS_TOKEN"
              aria-label="Operator access key"
            />
            <Button type="submit" className="min-h-11">
              Unlock
            </Button>
          </form>
          {denied ? (
            <p className="mt-3 text-sm text-destructive">
              Key rejected. Check the configured secret.
            </p>
          ) : null}
        </Panel>
      </OpsShell>
    );
  }

  return (
    <OpsShell
      title="Revenue Operations Control Plane"
      subtitle={
        state
          ? `Mode ${AUTOMATION_MODE_LABELS[state.mode]}${state.killSwitch ? " · kill switch engaged" : ""} · config v${state.activeVersion.version} · window ${state.windowHours}h`
          : "Loading…"
      }
      actions={
        <>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/work-queue">Work queue</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/automation">Automation</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/revenue">Revenue</Link>
          </Button>
          <Button
            variant={state?.killSwitch ? "default" : "destructive"}
            size="sm"
            className="min-h-11"
            onClick={() => {
              const next = !state?.killSwitch;
              if (
                !next ||
                window.confirm(
                  "Engage the kill switch? All automation execution stops immediately.",
                )
              ) {
                killMutation.mutate(next);
              }
            }}
            disabled={killMutation.isPending}
          >
            {state?.killSwitch ? "Release kill switch" : "Kill switch"}
          </Button>
        </>
      }
    >
      {stateQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading control plane…</p>
      ) : null}
      {stateQuery.isError ? (
        <p className="text-sm text-destructive">
          Control plane state failed to load. Retry the request.
        </p>
      ) : null}
      {notice ? <p className="text-sm text-foreground">{notice}</p> : null}

      {state ? (
        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
            <StatCard label="Open leads" value={state.queue.totalOpen} />
            <StatCard
              label="Overdue"
              value={state.queue.overdue}
              tone={state.queue.overdue > 0 ? "warn" : "default"}
            />
            <StatCard label="Untriaged" value={state.queue.untriaged} />
            <StatCard
              label="Delivery failures"
              value={state.queue.deliveryFailures}
              tone={state.queue.deliveryFailures > 0 ? "warn" : "default"}
            />
            <StatCard label="Eligible" value={state.automation.eligible} />
            <StatCard
              label="Awaiting approval"
              value={state.automation.pendingApproval}
              tone="signal"
            />
            <StatCard label="Blocked / skipped" value={state.automation.blocked} />
            <StatCard label="Config versions" value={state.versionCount} />
          </section>

          <Panel
            title="Automation posture"
            description="Modes are governed here and in the automation console. No mode sends external communication."
          >
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {(["off", "recommend", "internal_auto"] as AutomationMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    if (mode === state.mode) return;
                    if (
                      mode === "internal_auto" &&
                      !window.confirm(
                        "Switch to INTERNAL-AUTO? Internal tasks, activity and review flags may be created without approval. No external message is ever sent.",
                      )
                    )
                      return;
                    modeMutation.mutate(mode);
                  }}
                  className={cn(
                    "min-h-11 rounded-md border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    mode === state.mode
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={mode === state.mode}
                >
                  {AUTOMATION_MODE_LABELS[mode]}
                </button>
              ))}
              <span className="text-xs text-muted-foreground">
                Last run {state.lastRunAt ? new Date(state.lastRunAt).toLocaleString() : "—"}
                {state.lastRunOutcome ? ` · ${label(state.lastRunOutcome)}` : ""} · latency not
                recorded
              </span>
            </div>
          </Panel>

          <Panel
            title="Attention signals"
            description={`Deterministic arithmetic rules over stored rows. Window ${state.windowHours}h from ${new Date(state.windowStart).toLocaleString()}.`}
          >
            <ul className="flex flex-col gap-3">
              {state.anomalies.map((a) => (
                <li key={a.key} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={a.breached ? "warn" : "muted"}>
                      {a.breached ? "Attention" : "Normal"}
                    </Pill>
                    <span className="text-sm font-medium text-foreground">{a.title}</span>
                    <span className="text-xs text-muted-foreground">
                      observed {a.observed} · threshold {a.threshold}
                      {a.windowHours ? ` · ${a.windowHours}h window` : ""}
                    </span>
                    <Link
                      to={
                        a.drillTo === "automation"
                          ? "/internal/automation"
                          : a.drillTo === "leads"
                            ? "/internal/leads"
                            : "/internal/work-queue"
                      }
                      className="ml-auto text-xs underline underline-offset-4"
                    >
                      Drill down
                    </Link>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{a.rule}</p>
                  {a.evidence.length ? (
                    <ul className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                      {a.evidence.map((e, i) => (
                        <li key={`${a.key}-${i}`}>
                          <span className="text-foreground">{e.label}</span> — {e.detail}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">No matching rows.</p>
                  )}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Execution observability"
            description="Counts come from recorded automation executions only. Nothing is modelled or estimated."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Executed" value={state.outcomes.executed} />
              <StatCard label="Skipped" value={state.outcomes.skipped} />
              <StatCard label="Blocked" value={state.outcomes.blocked} />
              <StatCard
                label="Failed"
                value={state.outcomes.failed}
                tone={state.outcomes.failed > 0 ? "warn" : "default"}
              />
            </div>
            {state.outcomes.byReason.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {state.outcomes.byReason.map((r) => (
                  <Pill key={r.code} tone="muted">
                    {label(r.code)} · {r.count}
                  </Pill>
                ))}
              </div>
            ) : null}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="py-2">When</th>
                    <th>Lead</th>
                    <th>Playbook</th>
                    <th>Mode</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {state.recentExecutions.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="py-2 text-muted-foreground">
                        {new Date(e.createdAt).toLocaleString()}
                      </td>
                      <td>
                        {e.leadId ? (
                          <Link
                            to="/internal/leads"
                            search={{ lead: e.leadId }}
                            className="underline underline-offset-4"
                          >
                            {e.company}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">{e.company}</span>
                        )}
                      </td>
                      <td className="text-muted-foreground">{label(e.playbookKey)}</td>
                      <td className="text-muted-foreground">{label(e.mode)}</td>
                      <td>
                        <Pill tone={e.outcome === "failed" ? "warn" : "muted"}>
                          {label(e.outcome)} · {label(e.reasonCode)}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                  {state.recentExecutions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-3 text-sm text-muted-foreground">
                        No automation executions recorded in this window.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Playbook health"
            description="Enablement comes from the active configuration version; counts come from the live evaluation."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="py-2">Playbook</th>
                    <th>State</th>
                    <th>Eligible</th>
                    <th>Pending</th>
                    <th>Executed</th>
                    <th>Blocked</th>
                    <th>Last executed</th>
                  </tr>
                </thead>
                <tbody>
                  {state.playbooks.map((p) => (
                    <tr key={p.key} className="border-t border-border">
                      <td className="py-2 text-foreground">
                        {p.name} <span className="text-xs text-muted-foreground">v{p.version}</span>
                      </td>
                      <td>
                        <Pill tone={p.enabled ? "muted" : "warn"}>
                          {p.enabled ? "enabled" : "disabled"}
                        </Pill>
                      </td>
                      <td>{p.eligible}</td>
                      <td>{p.pending}</td>
                      <td>{p.executed}</td>
                      <td>{p.blocked}</td>
                      <td className="text-muted-foreground">
                        {p.lastExecutedAt ? new Date(p.lastExecutedAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Workflow simulation — read-only"
            description="Runs the exact live rules against a real lead. This never writes, executes or schedules anything."
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label
                htmlFor="sim-lead"
                className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground"
              >
                <span>Lead</span>
                <select
                  id="sim-lead"
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select an open lead…</option>
                  {queueItems.map((i) => (
                    <option key={i.leadId} value={i.leadId}>
                      {i.company} — {label(i.queue)} — priority {i.priority}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                type="button"
                className="min-h-11"
                disabled={!selectedLead || simulateMutation.isPending}
                onClick={() => simulateMutation.mutate(selectedLead)}
              >
                Simulate
              </Button>
            </div>

            {queueItems.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No open leads to simulate.</p>
            ) : null}

            {sim ? (
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="muted">Simulation · no data changed</Pill>
                  <span className="text-xs text-muted-foreground">
                    mode {AUTOMATION_MODE_LABELS[sim.mode]} · config v{sim.configVersion} · kill
                    switch {sim.killSwitch ? "engaged" : "released"} ·{" "}
                    {new Date(sim.simulatedAt).toLocaleString()}
                  </span>
                </div>
                {sim.lead ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground">{sim.lead.company}</span> · status{" "}
                      {label(sim.lead.status)} · queue {label(sim.lead.queue)} · priority{" "}
                      {sim.lead.priority} · {sim.lead.slaAgeHours.toFixed(1)}h vs{" "}
                      {sim.lead.slaThresholdHours}h target · open tasks {sim.lead.openTasks} ·
                      delivery {sim.lead.deliveryStatus ? label(sim.lead.deliveryStatus) : "none"} (
                      {sim.lead.attemptCount} attempt(s))
                    </p>
                    <ul className="flex flex-col gap-2">
                      {sim.rules.map((r) => (
                        <li key={r.playbookKey} className="rounded-lg border border-border p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill tone={r.outcome === "matched" ? "signal" : "muted"}>
                              {label(r.outcome)}
                            </Pill>
                            <span className="text-sm font-medium text-foreground">
                              {r.playbookName}{" "}
                              <span className="text-xs text-muted-foreground">
                                v{r.playbookVersion}
                              </span>
                            </span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              would {r.gateAllowed ? "execute" : "not execute"} ·{" "}
                              {label(r.gateReasonCode)}
                            </span>
                          </div>
                          <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                            <div>
                              <dt className="inline text-foreground">Trigger: </dt>
                              <dd className="inline font-mono">
                                {r.triggerText} → {String(r.triggerResult)}
                              </dd>
                            </div>
                            <div>
                              <dt className="inline text-foreground">Stop: </dt>
                              <dd className="inline font-mono">
                                {r.stopText} → {String(r.stopResult)}
                              </dd>
                            </div>
                            <div>
                              <dt className="inline text-foreground">Proposed internal action: </dt>
                              <dd className="inline">
                                {label(r.actionType)} — {r.actionTitle}
                                {r.dueInHours ? ` (due in ${r.dueInHours}h)` : ""}
                              </dd>
                            </div>
                            <div>
                              <dt className="inline text-foreground">Limits: </dt>
                              <dd className="inline">
                                cooldown {r.cooldownHours}h · max {r.maxExecutionsPerLead}/lead ·
                                executed {r.executedCount}
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="inline text-foreground">Explanation: </dt>
                              <dd className="inline">{r.explanation}</dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="inline text-foreground">Idempotency key: </dt>
                              <dd className="inline font-mono">{r.executionKey}</dd>
                            </div>
                          </dl>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/internal/leads"
                      search={{ lead: sim.lead.id }}
                      className="text-xs underline underline-offset-4"
                    >
                      Open lead detail
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    That lead is not in the open work queue, so no playbook evaluates against it.
                  </p>
                )}
              </div>
            ) : null}
          </Panel>

          {config ? (
            <Panel
              title="Configuration governance"
              description={`Active version ${state.activeVersion.version} (${state.activeVersion.source}) by ${state.activeVersion.actorLabel}. Changes create a new version; history is append-only.`}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <NumberField
                  id="cfg-triage"
                  labelText="Triage target (h)"
                  value={config.sla.triageHours}
                  step={0.25}
                  onChange={(n) => setDraft({ ...config, sla: { ...config.sla, triageHours: n } })}
                />
                <NumberField
                  id="cfg-follow"
                  labelText="Follow-up target (h)"
                  value={config.sla.followUpHours}
                  onChange={(n) =>
                    setDraft({ ...config, sla: { ...config.sla, followUpHours: n } })
                  }
                />
                <NumberField
                  id="cfg-delivery"
                  labelText="Delivery failure target (h)"
                  value={config.sla.deliveryFailureHours}
                  step={0.25}
                  onChange={(n) =>
                    setDraft({ ...config, sla: { ...config.sla, deliveryFailureHours: n } })
                  }
                />
                <NumberField
                  id="cfg-stale"
                  labelText="Stale new target (h)"
                  value={config.sla.staleNewHours}
                  onChange={(n) =>
                    setDraft({ ...config, sla: { ...config.sla, staleNewHours: n } })
                  }
                />
                <NumberField
                  id="cfg-window"
                  labelText="Anomaly window (h)"
                  value={config.anomalies.windowHours}
                  onChange={(n) =>
                    setDraft({ ...config, anomalies: { ...config.anomalies, windowHours: n } })
                  }
                />
                <NumberField
                  id="cfg-overdue"
                  labelText="Overdue leads threshold"
                  value={config.anomalies.overdueLeads}
                  onChange={(n) =>
                    setDraft({ ...config, anomalies: { ...config.anomalies, overdueLeads: n } })
                  }
                />
                <NumberField
                  id="cfg-failures"
                  labelText="Delivery failures threshold"
                  value={config.anomalies.deliveryFailures}
                  onChange={(n) =>
                    setDraft({ ...config, anomalies: { ...config.anomalies, deliveryFailures: n } })
                  }
                />
                <NumberField
                  id="cfg-errors"
                  labelText="Execution errors threshold"
                  value={config.anomalies.executionErrors}
                  onChange={(n) =>
                    setDraft({ ...config, anomalies: { ...config.anomalies, executionErrors: n } })
                  }
                />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Playbooks
                </span>
                <div className="flex flex-wrap gap-2">
                  {state.playbooks.map((p) => {
                    const pc = config.playbooks[p.key];
                    if (!pc) return null;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        aria-pressed={pc.enabled}
                        onClick={() =>
                          setDraft({
                            ...config,
                            playbooks: {
                              ...config.playbooks,
                              [p.key]: { ...pc, enabled: !pc.enabled },
                            },
                          })
                        }
                        className={cn(
                          "min-h-11 rounded-md border px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          pc.enabled
                            ? "border-foreground text-foreground"
                            : "border-border text-muted-foreground line-through",
                        )}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft) {
                    setNotice("No configuration changes to save.");
                    return;
                  }
                  if (
                    !window.confirm("Activate a new configuration version with these thresholds?")
                  )
                    return;
                  saveMutation.mutate({ config: draft, reason });
                }}
              >
                <label
                  htmlFor="cfg-reason"
                  className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground"
                >
                  <span>Change reason (required, recorded in the audit trail)</span>
                  <Input
                    id="cfg-reason"
                    value={reason}
                    className="min-h-11"
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why this threshold is changing"
                  />
                </label>
                <Button
                  type="submit"
                  className="min-h-11"
                  disabled={saveMutation.isPending || !draft}
                >
                  Save &amp; activate
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11"
                  onClick={() => setDraft(null)}
                  disabled={!draft}
                >
                  Discard edits
                </Button>
              </form>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-2">Version</th>
                      <th>Source</th>
                      <th>Reason</th>
                      <th>Actor</th>
                      <th>Created</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((v) => (
                      <tr key={v.version} className="border-t border-border">
                        <td className="py-2 text-foreground">
                          v{v.version} {v.isActive ? <Pill tone="signal">active</Pill> : null}
                        </td>
                        <td className="text-muted-foreground">
                          {label(v.source)}
                          {v.rolledBackFrom ? ` of v${v.rolledBackFrom}` : ""}
                        </td>
                        <td className="max-w-[22rem] text-muted-foreground">
                          {v.changeReason ?? "—"}
                        </td>
                        <td className="text-muted-foreground">{v.actorLabel}</td>
                        <td className="text-muted-foreground">
                          {new Date(v.createdAt).toLocaleString()}
                        </td>
                        <td>
                          {v.isActive ? null : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="min-h-11"
                              disabled={rollbackMutation.isPending}
                              onClick={() => {
                                if (!window.confirm(`Roll back to configuration v${v.version}?`))
                                  return;
                                rollbackMutation.mutate({
                                  version: v.version,
                                  reason: reason.trim() || `Rollback to v${v.version}`,
                                });
                              }}
                            >
                              Roll back
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ) : null}
        </div>
      ) : null}
    </OpsShell>
  );
}
