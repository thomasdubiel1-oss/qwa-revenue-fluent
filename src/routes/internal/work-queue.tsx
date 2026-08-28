/**
 * Phase 7 — Operator Command Center.
 *
 * Same access boundary as Phase 5/6: INTERNAL_OPS_TOKEN verified server-side,
 * all reads/writes through server functions, route noindex/noarchive and
 * absent from sitemap and public navigation.
 *
 * Priority is deterministic and fully written out per row — no opaque score.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpsShell, Panel, Pill, StatCard } from "@/components/qwa/internal/ops-ui";
import { internalHead } from "@/config/seo";
import { opsAccessStatusFn, opsRetryDeliveryFn } from "@/lib/ops/ops.functions";
import { opsMoveStatusFn, opsWorkQueueFn } from "@/lib/ops/workflow.functions";
import {
  DEFAULT_SLA,
  QUEUE_KEYS,
  QUEUE_LABELS,
  type QueueKey,
  type SlaThresholds,
  type WorkQueueItem,
} from "@/lib/ops/workflow.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/internal/work-queue")({
  ssr: false,
  head: () => internalHead("Operator Work Queue — QWA Internal"),
  validateSearch: (search: Record<string, unknown>): { queue?: QueueKey } => {
    const q = typeof search["queue"] === "string" ? (search["queue"] as QueueKey) : undefined;
    return q && (QUEUE_KEYS as readonly string[]).includes(q) ? { queue: q } : {};
  },
  component: WorkQueueConsole,
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

function age(hours: number) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

function SlaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <Input
        type="number"
        min={1}
        max={1440}
        className="h-10 w-24"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function WorkQueueConsole() {
  const initial = Route.useSearch();
  const { key, save } = useOpsKey();
  const [draftKey, setDraftKey] = React.useState("");
  const [sla, setSla] = React.useState<SlaThresholds>(DEFAULT_SLA);
  const [queue, setQueue] = React.useState<QueueKey | "all">(initial.queue ?? "all");
  const [onlyOverdue, setOnlyOverdue] = React.useState(false);
  const [sort, setSort] = React.useState<"priority" | "oldest" | "newest">("priority");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const accessStatus = useServerFn(opsAccessStatusFn);
  const workQueueFn = useServerFn(opsWorkQueueFn);
  const moveStatusFn = useServerFn(opsMoveStatusFn);
  const retryFn = useServerFn(opsRetryDeliveryFn);

  const configured = useQuery({
    queryKey: ["ops", "configured"],
    queryFn: () => accessStatus({}),
  });

  const queueQuery = useQuery({
    queryKey: ["ops", "work-queue", key, sla],
    queryFn: () => workQueueFn({ data: { key, sla } }),
    enabled: Boolean(key),
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["ops"] });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: string }) => moveStatusFn({ data: { key, ...vars } }),
    onSuccess: () => {
      setConfirmId(null);
      invalidate();
    },
  });
  const retryMutation = useMutation({
    mutationFn: (deliveryId: string) => retryFn({ data: { key, deliveryId } }),
    onSuccess: invalidate,
  });

  const denied = queueQuery.data && queueQuery.data.ok === false && queueQuery.data.access.state === "denied";
  const unconfigured = configured.data?.configured === false;
  const result = queueQuery.data?.ok ? queueQuery.data.data : null;

  const items: WorkQueueItem[] = React.useMemo(() => {
    let rows = result?.items ?? [];
    if (queue !== "all") rows = rows.filter((r) => r.queue === queue);
    if (onlyOverdue) rows = rows.filter((r) => r.overdue);
    if (sort === "oldest") rows = [...rows].sort((a, b) => (a.submittedAt < b.submittedAt ? -1 : 1));
    if (sort === "newest") rows = [...rows].sort((a, b) => (a.submittedAt > b.submittedAt ? -1 : 1));
    return rows;
  }, [result, queue, onlyOverdue, sort]);

  if (unconfigured) {
    return (
      <OpsShell title="Operator Work Queue" subtitle="Access not yet enabled">
        <Panel
          title="Console locked — access dependency not configured"
          description="The route and its server boundary exist, but no operator credential is present."
        >
          <p className="max-w-2xl text-sm text-muted-foreground">
            The work queue reads lead PII exclusively through server-side, service-role queries and
            stays inert until a secret named{" "}
            <code className="text-foreground">INTERNAL_OPS_TOKEN</code> (32+ random characters) is
            added in Project Settings → Secrets. No users or passwords have been invented; when a
            real auth layer arrives only{" "}
            <code className="text-foreground">checkOpsAccess</code> changes.
          </p>
        </Panel>
      </OpsShell>
    );
  }

  if (!key || denied) {
    return (
      <OpsShell title="Operator Work Queue" subtitle="Internal access required">
        <Panel title="Enter operator access key" description="Session-scoped. Never stored on disk.">
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
            <Button type="submit">Unlock</Button>
          </form>
          {denied ? (
            <p className="mt-3 text-xs text-destructive">
              That key was rejected. No lead data was returned.
            </p>
          ) : null}
        </Panel>
      </OpsShell>
    );
  }

  const s = result?.summary;

  return (
    <OpsShell
      title="Operator Work Queue"
      subtitle="Deterministic prioritisation of inbound demo requests and delivery exceptions"
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link to="/internal/leads">Lead operations</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/internal/revenue">Revenue intelligence</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={invalidate}>
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={() => save("")}>
            Lock
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Overdue"
          value={s?.overdue ?? "—"}
          hint="Past operational target"
          tone={(s?.overdue ?? 0) > 0 ? "warn" : "default"}
        />
        <StatCard label="Due soon" value={s?.dueNow ?? "—"} hint="Final quarter of target" tone="signal" />
        <StatCard label="Stale new" value={s?.staleNew ?? "—"} hint={`> ${sla.staleNewHours}h in new`} />
        <StatCard
          label="Delivery failures"
          value={s?.deliveryFailures ?? "—"}
          tone={(s?.deliveryFailures ?? 0) > 0 ? "warn" : "default"}
        />
        <StatCard label="Tasks due today" value={s?.tasksDueToday ?? "—"} hint={`${s?.openTasks ?? 0} open`} />
        <StatCard label="Open items" value={s?.totalOpen ?? "—"} hint="Excludes archived / disqualified" />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <Panel
          title="Operational targets"
          description="Internal thresholds — tuning affects due/overdue state only, never lead data."
          className="lg:col-span-2"
        >
          <div className="flex flex-wrap gap-4">
            <SlaField
              label="Triage new (h)"
              value={sla.triageHours}
              onChange={(v) => setSla((p) => ({ ...p, triageHours: v }))}
            />
            <SlaField
              label="Stale new (h)"
              value={sla.staleNewHours}
              onChange={(v) => setSla((p) => ({ ...p, staleNewHours: v }))}
            />
            <SlaField
              label="Follow-up (h)"
              value={sla.followUpHours}
              onChange={(v) => setSla((p) => ({ ...p, followUpHours: v }))}
            />
            <SlaField
              label="Delivery attention (h)"
              value={sla.deliveryFailureHours}
              onChange={(v) => setSla((p) => ({ ...p, deliveryFailureHours: v }))}
            />
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => setSla(DEFAULT_SLA)}>
                Reset defaults
              </Button>
            </div>
          </div>
        </Panel>
        <Panel title="Queue volumes" description="Each lead appears in exactly one queue.">
          <ul className="flex flex-col gap-1.5">
            {QUEUE_KEYS.map((k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => setQueue(k)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    queue === k && "bg-signal-soft/60",
                  )}
                >
                  <span className="text-muted-foreground">{QUEUE_LABELS[k]}</span>
                  <span className="tabular-nums">{result?.counts[k] ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={queue === "all" ? "default" : "outline"}
          onClick={() => setQueue("all")}
        >
          All ({result?.items.length ?? 0})
        </Button>
        {QUEUE_KEYS.map((k) => (
          <Button
            key={k}
            size="sm"
            variant={queue === k ? "default" : "outline"}
            onClick={() => setQueue(k)}
          >
            {QUEUE_LABELS[k]} ({result?.counts[k] ?? 0})
          </Button>
        ))}
        <Button
          size="sm"
          variant={onlyOverdue ? "default" : "outline"}
          onClick={() => setOnlyOverdue((v) => !v)}
          aria-pressed={onlyOverdue}
        >
          Overdue only
        </Button>
        <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="priority">Priority</option>
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
          </select>
        </label>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border/70 bg-card">
        <table className="w-full min-w-[62rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left">
              {["Priority", "Queue", "Lead", "Status", "Age", "SLA", "Delivery", "Tasks", ""].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queueQuery.isLoading ? (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Building queue…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  Nothing waiting in this queue. Inbound leads appear here automatically.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <React.Fragment key={item.leadId}>
                  <tr
                    className={cn(
                      "border-b border-border/50 transition-colors last:border-0 hover:bg-muted/40",
                      item.overdue && "bg-destructive/5",
                    )}
                  >
                    <td className="px-3 py-2.5 tabular-nums font-semibold">{item.priority}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground">
                      {QUEUE_LABELS[item.queue]}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{item.company}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.name} · {item.monthlyLeads}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <Pill tone={item.status === "new" ? "signal" : "neutral"}>{item.status}</Pill>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs tabular-nums text-muted-foreground">
                      {age(item.ageHours)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs tabular-nums">
                      {item.overdue ? (
                        <Pill tone="warn">
                          overdue {age(item.slaAgeHours)} / {item.slaThresholdHours}h
                        </Pill>
                      ) : item.dueSoon ? (
                        <Pill tone="signal">
                          due soon {age(item.slaAgeHours)} / {item.slaThresholdHours}h
                        </Pill>
                      ) : (
                        <span className="text-muted-foreground">
                          {age(item.slaAgeHours)} / {item.slaThresholdHours}h
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <Pill
                        tone={
                          item.deliveryStatus === "failed"
                            ? "warn"
                            : item.deliveryStatus === "sent"
                              ? "positive"
                              : item.deliveryStatus
                                ? "signal"
                                : "muted"
                        }
                      >
                        {item.deliveryStatus ?? "none"}
                        {item.attemptCount > 0 ? ` · ${item.attemptCount}` : ""}
                      </Pill>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs tabular-nums text-muted-foreground">
                      {item.openTasks === 0 ? "—" : `${item.openTasks} open`}
                      {item.overdueTasks > 0 ? ` · ${item.overdueTasks} overdue` : ""}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-expanded={expanded === item.leadId}
                          onClick={() =>
                            setExpanded((prev) => (prev === item.leadId ? null : item.leadId))
                          }
                        >
                          Why
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/internal/leads" search={{ lead: item.leadId }}>
                            Open
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expanded === item.leadId ? (
                    <tr className="border-b border-border/50 bg-muted/30">
                      <td colSpan={9} className="px-4 py-4">
                        <div className="grid gap-5 lg:grid-cols-2">
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              Why this is surfaced
                            </h3>
                            <ul className="mt-2 flex flex-col gap-1 text-xs">
                              {item.reasons.map((r) => (
                                <li key={r.label} className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">{r.label}</span>
                                  <span className="tabular-nums">+{r.points}</span>
                                </li>
                              ))}
                              <li className="mt-1 flex justify-between gap-4 border-t border-border/60 pt-1 font-medium">
                                <span>Total priority</span>
                                <span className="tabular-nums">{item.priority}</span>
                              </li>
                            </ul>
                            {item.lastError ? (
                              <p className="mt-2 text-[0.68rem] text-destructive">
                                Last delivery error: {item.lastError}
                              </p>
                            ) : null}
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              Fast actions
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {(["reviewing", "contacted", "qualified"] as const).map((next) => (
                                <Button
                                  key={next}
                                  size="sm"
                                  variant="outline"
                                  disabled={statusMutation.isPending || item.status === next}
                                  onClick={() =>
                                    statusMutation.mutate({ id: item.leadId, status: next })
                                  }
                                >
                                  Move to {next}
                                </Button>
                              ))}
                              {item.deliveryId && item.deliveryStatus !== "sent" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={retryMutation.isPending}
                                  onClick={() => retryMutation.mutate(item.deliveryId as string)}
                                >
                                  Retry delivery
                                </Button>
                              ) : null}
                              {confirmId === item.leadId ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={statusMutation.isPending}
                                    onClick={() =>
                                      statusMutation.mutate({
                                        id: item.leadId,
                                        status: "disqualified",
                                      })
                                    }
                                  >
                                    Confirm disqualify
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={statusMutation.isPending}
                                    onClick={() =>
                                      statusMutation.mutate({ id: item.leadId, status: "archived" })
                                    }
                                  >
                                    Confirm archive
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmId(item.leadId)}
                                >
                                  Disqualify / archive…
                                </Button>
                              )}
                            </div>
                            <p className="mt-2 text-[0.68rem] text-muted-foreground">
                              Notes and follow-up tasks are added from the lead detail drawer. No
                              email, SMS or calls are sent — no communication provider is connected.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {items.length} item{items.length === 1 ? "" : "s"} · priority = queue base + age (1 pt / 6h,
        cap 20) + overdue 25 + overdue task 15 / open task 5 + volume band. Operator actions are
        recorded under the neutral label <code>internal_operator</code> because only shared-token
        access exists today.
      </p>
    </OpsShell>
  );
}
