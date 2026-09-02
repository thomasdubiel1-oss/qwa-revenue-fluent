/**
 * Phase 8 — Revenue Automation Control Plane.
 *
 * Same boundary as Phase 5–7: INTERNAL_OPS_TOKEN verified server-side, every
 * read/write through server functions, route noindex/noarchive and absent
 * from sitemap and public navigation.
 *
 * No mode of this console can send email, SMS or calls, change ad spend, or
 * create CRM/revenue records. INTERNAL-AUTO performs internal task/activity
 * mutations only.
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
import {
  opsAutomationStateFn,
  opsDecideRecommendationFn,
  opsRunAutomationFn,
  opsSetAutomationModeFn,
  opsSetKillSwitchFn,
} from "@/lib/ops/automation.functions";
import {
  AUTOMATION_MODE_DESCRIPTIONS,
  AUTOMATION_MODE_LABELS,
  AUTOMATION_MODES,
  type AutomationMode,
  type RecommendationView,
} from "@/lib/ops/automation.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/internal/automation")({
  ssr: false,
  head: () => internalHead("Automation Control Plane — QWA Internal"),
  component: AutomationConsole,
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

function reasonLabel(code: string) {
  return code.replace(/_/g, " ");
}

function statusTone(status: string) {
  if (status === "approved" || status === "auto_executed") return "positive" as const;
  if (status === "dismissed" || status === "blocked" || status === "failed") return "warn" as const;
  if (status === "snoozed") return "muted" as const;
  return "neutral" as const;
}

function RecommendationRow({
  rec,
  busy,
  onDecide,
}: {
  rec: RecommendationView;
  busy: boolean;
  onDecide: (decision: "approve" | "dismiss" | "snooze") => void;
}) {
  return (
    <li className="border-t border-border/50 py-3 first:border-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/internal/leads"
              search={{ lead: rec.leadId }}
              className="truncate text-sm font-medium underline-offset-4 hover:text-signal hover:underline"
            >
              {rec.company || rec.name}
            </Link>
            <Pill tone="signal">{rec.playbookName}</Pill>
            <Pill tone={statusTone(rec.recommendationStatus)}>
              {rec.recommendationStatus.replace(/_/g, " ")}
            </Pill>
            {rec.overdue ? <Pill tone="warn">overdue</Pill> : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{rec.explanation}</p>
          <p className="mt-1 text-xs">
            <span className="text-muted-foreground">Recommended action: </span>
            {rec.action.title}
            <span className="text-muted-foreground">
              {" "}
              · v{rec.playbookVersion} · priority {rec.basePriority} (+{rec.priorityBoost} playbook)
            </span>
          </p>
          <p className="mt-1 text-[0.68rem] text-muted-foreground">
            reason: {rec.reasonCodes.map(reasonLabel).join(", ")}
            {rec.snoozeUntil
              ? ` · snoozed until ${new Date(rec.snoozeUntil).toLocaleString()}`
              : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onDecide("approve")}
            className="min-h-11"
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onDecide("snooze")}
            className="min-h-11"
          >
            Snooze 24h
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onDecide("dismiss")}
            className="min-h-11"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </li>
  );
}

function AutomationConsole() {
  const { key, save } = useOpsKey();
  const [draftKey, setDraftKey] = React.useState("");
  const [dryRun, setDryRun] = React.useState<null | {
    executed: { leadId: string; playbookKey: string; action: string }[];
    skipped: { leadId: string; playbookKey: string; reasonCode: string }[];
  }>(null);
  const queryClient = useQueryClient();

  const accessStatus = useServerFn(opsAccessStatusFn);
  const stateFn = useServerFn(opsAutomationStateFn);
  const modeFn = useServerFn(opsSetAutomationModeFn);
  const killFn = useServerFn(opsSetKillSwitchFn);
  const runFn = useServerFn(opsRunAutomationFn);
  const decideFn = useServerFn(opsDecideRecommendationFn);

  const configured = useQuery({
    queryKey: ["ops", "configured"],
    queryFn: () => accessStatus({}),
  });

  const stateQuery = useQuery({
    queryKey: ["ops", "automation", key],
    queryFn: () => stateFn({ data: { key } }),
    enabled: Boolean(key),
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["ops"] });

  const modeMutation = useMutation({
    mutationFn: (mode: AutomationMode) => modeFn({ data: { key, mode } }),
    onSuccess: invalidate,
  });
  const killMutation = useMutation({
    mutationFn: (engaged: boolean) => killFn({ data: { key, engaged } }),
    onSuccess: invalidate,
  });
  const runMutation = useMutation({
    mutationFn: (isDry: boolean) => runFn({ data: { key, dryRun: isDry } }),
    onSuccess: (res, isDry) => {
      if (res.ok && isDry)
        setDryRun({ executed: res.result.executed, skipped: res.result.skipped });
      if (!isDry) setDryRun(null);
      invalidate();
    },
  });
  const decideMutation = useMutation({
    mutationFn: (vars: {
      leadId: string;
      playbookKey: string;
      decision: "approve" | "dismiss" | "snooze";
    }) => decideFn({ data: { key, ...vars, snoozeHours: 24 } }),
    onSuccess: invalidate,
  });

  const denied =
    stateQuery.data && stateQuery.data.ok === false && stateQuery.data.access.state === "denied";
  const unconfigured = configured.data?.configured === false;
  const state = stateQuery.data?.ok ? stateQuery.data.data : null;

  if (unconfigured) {
    return (
      <OpsShell title="Automation Control Plane" subtitle="Access not yet enabled">
        <Panel
          title="Console locked — access dependency not configured"
          description="The route and its server boundary exist, but no operator credential is present."
        >
          <p className="max-w-2xl text-sm text-muted-foreground">
            Automation stays inert until a secret named{" "}
            <code className="text-foreground">INTERNAL_OPS_TOKEN</code> (32+ random characters) is
            added in Project Settings → Secrets. With no credential the control plane evaluates
            nothing and mutates nothing.
          </p>
        </Panel>
      </OpsShell>
    );
  }

  if (!key || denied) {
    return (
      <OpsShell title="Automation Control Plane" subtitle="Internal access required">
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

  const pending = state?.recommendations.filter(
    (r) => r.recommendationStatus === "pending" || r.recommendationStatus === "recommended",
  );

  return (
    <OpsShell
      title="Automation Control Plane"
      subtitle={
        state
          ? `Mode ${AUTOMATION_MODE_LABELS[state.mode]}${state.killSwitch ? " · kill switch engaged" : ""} · window ${state.windowHours}h from ${new Date(state.windowStart).toLocaleString()}`
          : "Loading…"
      }
      actions={
        <>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/control-plane">Control plane</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/work-queue">Work queue</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link to="/internal/leads">Leads</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => runMutation.mutate(true)}
            disabled={runMutation.isPending}
          >
            Dry-run preview
          </Button>
          <Button
            variant={state?.killSwitch ? "default" : "destructive"}
            size="sm"
            className="min-h-11"
            onClick={() => killMutation.mutate(!state?.killSwitch)}
            disabled={killMutation.isPending}
          >
            {state?.killSwitch ? "Release kill switch" : "Kill switch"}
          </Button>
        </>
      }
    >
      {stateQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Evaluating playbooks…</p>
      ) : null}
      {stateQuery.isError ? (
        <p className="text-sm text-destructive">
          Automation state failed to load. Retry the request.
        </p>
      ) : null}

      {state ? (
        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
            <StatCard label="Eligible" value={state.counts.eligible} />
            <StatCard label="Recommended" value={state.counts.recommended} />
            <StatCard label="Approved" value={state.counts.approved} tone="signal" />
            <StatCard label="Dismissed" value={state.counts.dismissed} />
            <StatCard label="Snoozed" value={state.counts.snoozed} />
            <StatCard label="Auto-executed" value={state.counts.autoExecuted} tone="signal" />
            <StatCard label="Blocked / skipped" value={state.counts.blocked} />
            <StatCard
              label="Failed"
              value={state.counts.failed}
              tone={state.counts.failed > 0 ? "warn" : "default"}
            />
          </section>

          <Panel
            title="Control mode"
            description="No mode sends external communication. INTERNAL-AUTO performs internal task / activity mutations only."
          >
            <div className="flex flex-wrap gap-2">
              {AUTOMATION_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  disabled={modeMutation.isPending || (state.killSwitch && mode !== "off")}
                  onClick={() => modeMutation.mutate(mode)}
                  className={cn(
                    "min-h-11 rounded-lg border px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
                    state.mode === mode
                      ? "border-signal/50 bg-signal-soft text-signal"
                      : "border-border/70 hover:border-signal/40",
                  )}
                >
                  <span className="block text-sm font-medium">{AUTOMATION_MODE_LABELS[mode]}</span>
                  <span className="mt-0.5 block max-w-xs text-muted-foreground">
                    {AUTOMATION_MODE_DESCRIPTIONS[mode]}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                className="min-h-11"
                disabled={runMutation.isPending || state.mode === "off" || state.killSwitch}
                onClick={() => runMutation.mutate(false)}
              >
                Run now
              </Button>
              <span className="text-xs text-muted-foreground">
                {state.killSwitch
                  ? "Kill switch engaged — automated internal mutations are disabled."
                  : state.mode === "off"
                    ? "Mode OFF — evaluation is read-only."
                    : state.mode === "recommend"
                      ? "RECOMMEND — only operator-approved recommendations execute."
                      : "INTERNAL-AUTO — eligible recommendations execute internal mutations."}
              </span>
            </div>
            {dryRun ? (
              <div className="mt-4 rounded-lg border border-border/70 bg-muted/40 p-3 text-xs">
                <p className="font-medium">
                  Dry run: {dryRun.executed.length} would execute · {dryRun.skipped.length} skipped
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {dryRun.executed.slice(0, 12).map((e) => (
                    <li key={`${e.leadId}-${e.playbookKey}`} className="text-muted-foreground">
                      would {e.action.replace(/_/g, " ")} · {e.playbookKey} · lead{" "}
                      {e.leadId.slice(0, 8)}
                    </li>
                  ))}
                  {dryRun.executed.length === 0 ? (
                    <li className="text-muted-foreground">
                      Nothing would execute in the current mode.
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}
          </Panel>

          <Panel
            title="Playbook health"
            description="Versioned, deterministic rules. Trigger and stop conditions are written out in full."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[54rem] text-sm">
                <thead>
                  <tr className="text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
                    <th className="pb-2 text-left font-medium">Playbook</th>
                    <th className="pb-2 text-left font-medium">Trigger / stop</th>
                    <th className="pb-2 text-left font-medium">Action</th>
                    <th className="pb-2 text-right font-medium">Eligible</th>
                    <th className="pb-2 text-right font-medium">Pending</th>
                    <th className="pb-2 text-right font-medium">Executed</th>
                    <th className="pb-2 text-right font-medium">Blocked</th>
                  </tr>
                </thead>
                <tbody>
                  {state.playbooks.map((p) => (
                    <tr key={p.key} className="border-t border-border/50 align-top">
                      <td className="py-2 pr-3">
                        <span className="font-medium">{p.name}</span>
                        <span className="block text-[0.68rem] text-muted-foreground">
                          {p.key} v{p.version} · cooldown {p.cooldownHours}h · max{" "}
                          {p.maxExecutionsPerLead}/lead · +{p.priorityBoost} priority
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">
                        <span className="block">Trigger: {p.triggerText}</span>
                        <span className="block">Stop: {p.stopText}</span>
                      </td>
                      <td className="py-2 pr-3 text-xs">{p.action.title}</td>
                      <td className="py-2 text-right tabular-nums">{p.eligible}</td>
                      <td className="py-2 text-right tabular-nums">{p.pending}</td>
                      <td className="py-2 text-right tabular-nums">{p.executed}</td>
                      <td className="py-2 text-right tabular-nums">{p.blocked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Recommendations"
            description="Approve, snooze or dismiss. Every decision is recorded against the neutral internal_operator label."
          >
            {state.recommendations.length > 0 ? (
              <>
                <p className="mb-2 text-xs text-muted-foreground">
                  {pending?.length ?? 0} awaiting a decision · {state.recommendations.length} total
                  eligible.
                </p>
                <ul className="flex flex-col">
                  {state.recommendations.map((rec) => (
                    <RecommendationRow
                      key={rec.executionKey}
                      rec={rec}
                      busy={decideMutation.isPending}
                      onDecide={(decision) =>
                        decideMutation.mutate({
                          leadId: rec.leadId,
                          playbookKey: rec.playbookKey,
                          decision,
                        })
                      }
                    />
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No lead currently satisfies a playbook trigger. Nothing is recommended.
              </p>
            )}
          </Panel>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel
              title="Blocked & exceptions"
              description="Explicit reason codes — never an unexplained skip."
            >
              {state.blocked.length === 0 ? (
                <p className="text-sm text-muted-foreground">No blocked items.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {state.blocked.slice(0, 30).map((b, index) => (
                    <li
                      key={`${b.leadId}-${b.playbookKey}-${index}`}
                      className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-2 text-xs last:border-0"
                    >
                      <Link
                        to="/internal/leads"
                        search={{ lead: b.leadId }}
                        className="font-medium underline-offset-4 hover:text-signal hover:underline"
                      >
                        {b.company || b.leadId.slice(0, 8)}
                      </Link>
                      <Pill tone="muted">{b.playbookName}</Pill>
                      <Pill tone="warn">{reasonLabel(b.reasonCode)}</Pill>
                      <span className="text-muted-foreground">{b.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Recent executions"
              description={`Append-only audit log for the last ${state.windowHours}h.`}
            >
              {state.executions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No executions recorded in this window.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {state.executions.slice(0, 30).map((e) => (
                    <li key={e.id} className="border-b border-border/40 pb-2 text-xs last:border-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tabular-nums text-muted-foreground">
                          {new Date(e.createdAt).toLocaleString()}
                        </span>
                        <Pill
                          tone={
                            e.outcome === "executed"
                              ? "positive"
                              : e.outcome === "failed"
                                ? "warn"
                                : "muted"
                          }
                        >
                          {e.outcome}
                        </Pill>
                        <span>
                          {e.playbookKey} v{e.playbookVersion}
                        </span>
                        <span className="text-muted-foreground">{reasonLabel(e.reasonCode)}</span>
                        <span className="text-muted-foreground">mode {e.mode}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <p className="text-xs text-muted-foreground">
            Automation never emails, texts, calls, changes ad spend, creates CRM opportunities, or
            records revenue. HighLevel is not connected. Actor identity stays the neutral{" "}
            <code className="text-foreground">internal_operator</code> label until real
            authentication exists.
          </p>
        </div>
      ) : null}
    </OpsShell>
  );
}
