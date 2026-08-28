import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  BarList,
  CopyButton,
  KeyValue,
  OpsShell,
  Panel,
  Pill,
  StatCard,
} from "@/components/qwa/internal/ops-ui";
import { internalHead } from "@/config/seo";
import {
  opsAccessStatusFn,
  opsLeadDetailFn,
  opsLeadsFn,
  opsOverviewFn,
  opsRetryDeliveryFn,
  opsSetStatusFn,
} from "@/lib/ops/ops.functions";
import { LEAD_STATUSES, type OpsFilters, type OpsLeadRow } from "@/lib/ops/types";
import { cn } from "@/lib/utils";

/** Drill-down parameters accepted from the Revenue Intelligence console. */
type LeadsSearch = {
  status?: string;
  delivery?: string;
  source?: string;
  campaign?: string;
  goal?: string;
  from?: string;
  to?: string;
  sort?: OpsFilters["sort"];
};

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

export const Route = createFileRoute("/internal/leads")({
  ssr: false,
  head: () => internalHead("Lead Operations — QWA Internal"),
  validateSearch: (search: Record<string, unknown>): LeadsSearch => {
    const sort = str(search["sort"]);
    return {
      ...(str(search["status"]) ? { status: str(search["status"]) as string } : {}),
      ...(str(search["delivery"]) ? { delivery: str(search["delivery"]) as string } : {}),
      ...(str(search["source"]) ? { source: str(search["source"]) as string } : {}),
      ...(str(search["campaign"]) ? { campaign: str(search["campaign"]) as string } : {}),
      ...(str(search["goal"]) ? { goal: str(search["goal"]) as string } : {}),
      ...(str(search["from"]) ? { from: str(search["from"]) as string } : {}),
      ...(str(search["to"]) ? { to: str(search["to"]) as string } : {}),
      ...(sort === "newest" || sort === "oldest" || sort === "company" ? { sort } : {}),
    };
  },
  component: LeadOpsConsole,
});


const KEY_STORAGE = "qwa:ops-key";

function useOpsKey() {
  const [key, setKey] = React.useState<string>("");
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

function fmtDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function deliveryTone(status: string | null) {
  if (status === "sent") return "positive" as const;
  if (status === "failed") return "warn" as const;
  if (status === "pending") return "signal" as const;
  return "muted" as const;
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 min-w-[9rem] rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function LeadOpsConsole() {
  const search0 = Route.useSearch();
  const { key, save } = useOpsKey();
  const [draftKey, setDraftKey] = React.useState("");
  const [filters, setFilters] = React.useState<OpsFilters>({ sort: "newest", ...search0 });

  const [search, setSearch] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const accessStatus = useServerFn(opsAccessStatusFn);
  const overviewFn = useServerFn(opsOverviewFn);
  const leadsFn = useServerFn(opsLeadsFn);
  const detailFn = useServerFn(opsLeadDetailFn);
  const setStatusFn = useServerFn(opsSetStatusFn);
  const retryFn = useServerFn(opsRetryDeliveryFn);

  const configured = useQuery({
    queryKey: ["ops", "configured"],
    queryFn: () => accessStatus({}),
  });

  const overview = useQuery({
    queryKey: ["ops", "overview", key],
    queryFn: () => overviewFn({ data: { key } as { key?: string } }),
    enabled: Boolean(key),
  });

  React.useEffect(() => {
    const id = window.setTimeout(() => setFilters((f) => ({ ...f, search })), 250);
    return () => window.clearTimeout(id);
  }, [search]);

  const leads = useQuery({
    queryKey: ["ops", "leads", key, filters],
    queryFn: () => leadsFn({ data: { key, filters } }),
    enabled: Boolean(key),
  });

  const detail = useQuery({
    queryKey: ["ops", "detail", key, openId],
    queryFn: () => detailFn({ data: { key, id: openId as string } }),
    enabled: Boolean(key && openId),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["ops"] });
  };

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: string }) =>
      setStatusFn({ data: { key, ...vars } }),
    onSuccess: invalidate,
  });

  const retryMutation = useMutation({
    mutationFn: (deliveryId: string) => retryFn({ data: { key, deliveryId } }),
    onSuccess: invalidate,
  });

  const denied =
    (overview.data && overview.data.ok === false && overview.data.access.state === "denied") ||
    (leads.data && leads.data.ok === false && leads.data.access.state === "denied");

  const unconfigured = configured.data?.configured === false;

  const rows: OpsLeadRow[] = leads.data?.ok ? leads.data.data : [];
  const summary = overview.data?.ok ? overview.data.data : null;

  const sourceOptions = React.useMemo(
    () => ["all", ...new Set(rows.map((r) => r.sourceCta ?? r.sourceRoute ?? "—"))],
    [rows],
  );
  const campaignOptions = React.useMemo(
    () => ["all", ...new Set(rows.map((r) => r.utmCampaign ?? r.utmSource ?? "—"))],
    [rows],
  );
  const goalOptions = React.useMemo(
    () => ["all", ...new Set(rows.map((r) => r.primaryGoal))],
    [rows],
  );

  if (unconfigured) {
    return (
      <OpsShell title="Lead Operations" subtitle="Access not yet enabled">
        <Panel
          title="Console locked — access dependency not configured"
          description="The route and its server boundary exist, but no operator credential is present."
        >
          <div className="max-w-2xl space-y-3 text-sm text-muted-foreground">
            <p>
              This console reads lead PII exclusively through server-side, service-role queries.
              It stays inert until an access secret named <code className="text-foreground">INTERNAL_OPS_TOKEN</code>{" "}
              (32+ random characters) is added in Project Settings → Secrets.
            </p>
            <p>
              No users, passwords, or accounts have been invented. When a full auth layer is
              introduced, the recommended model is backend auth plus a separate{" "}
              <code className="text-foreground">user_roles</code> table with an{" "}
              <code className="text-foreground">ops</code> role verified server-side; only{" "}
              <code className="text-foreground">checkOpsAccess</code> in{" "}
              <code className="text-foreground">src/lib/ops/ops.server.ts</code> would change.
            </p>
          </div>
        </Panel>
      </OpsShell>
    );
  }

  if (!key || denied) {
    return (
      <OpsShell title="Lead Operations" subtitle="Internal access required">
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

  return (
    <OpsShell
      title="Lead Operations"
      subtitle="Inbound demo requests, attribution and CRM delivery state"
      actions={
        <>
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
        <StatCard label="Total leads" value={summary?.totalLeads ?? "—"} hint="All time" />
        <StatCard label="New" value={summary?.newLeads ?? "—"} hint="Awaiting triage" tone="signal" />
        <StatCard label="Last 7 days" value={summary?.last7Days ?? "—"} />
        <StatCard
          label="CRM pending"
          value={summary?.delivery.pending ?? "—"}
          hint={summary?.destinationConfigured ? "Destination configured" : "No destination configured"}
        />
        <StatCard label="CRM sent" value={summary?.delivery.sent ?? "—"} />
        <StatCard
          label="CRM failed"
          value={summary?.delivery.failed ?? "—"}
          tone={(summary?.delivery.failed ?? 0) > 0 ? "warn" : "default"}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Accepted conversions"
          value={summary?.acceptedConversions ?? "—"}
          hint="Server-recorded"
        />
        <StatCard
          label="Suppressed submissions"
          value={summary?.suppressedSubmissions ?? "—"}
          hint="Honeypot / time-trap"
        />
        <StatCard label="Contacted" value={summary?.byStatus["contacted"] ?? 0} />
        <StatCard label="Qualified" value={summary?.byStatus["qualified"] ?? 0} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <Panel title="Top sources" description="By CTA placement or route">
          <BarList items={summary?.topSources ?? []} />
        </Panel>
        <Panel title="Top campaigns" description="UTM campaign, falling back to source">
          <BarList items={summary?.topCampaigns ?? []} />
        </Panel>
        <Panel title="Goal & volume mix" description="Self-reported at submission">
          <BarList items={[...(summary?.goalMix ?? []), ...(summary?.volumeMix ?? [])]} />
        </Panel>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Operational view only — counts reflect stored submissions. No revenue or ROAS is shown
        because no revenue data exists yet; small samples are not statistically meaningful.
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Search
          </span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, company, email or website"
          />
        </label>
        <Select
          label="Status"
          value={filters.status ?? "all"}
          onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          options={["all", ...LEAD_STATUSES].map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Delivery"
          value={filters.delivery ?? "all"}
          onChange={(v) => setFilters((f) => ({ ...f, delivery: v }))}
          options={["all", "pending", "sent", "failed", "none"].map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Source"
          value={filters.source ?? "all"}
          onChange={(v) => setFilters((f) => ({ ...f, source: v }))}
          options={sourceOptions.map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Campaign"
          value={filters.campaign ?? "all"}
          onChange={(v) => setFilters((f) => ({ ...f, campaign: v }))}
          options={campaignOptions.map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Goal"
          value={filters.goal ?? "all"}
          onChange={(v) => setFilters((f) => ({ ...f, goal: v }))}
          options={goalOptions.map((v) => ({ value: v, label: v }))}
        />
        <label className="flex flex-col gap-1">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            From
          </span>
          <Input
            type="date"
            className="w-[10rem]"
            value={filters.from ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value || undefined }))}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            To
          </span>
          <Input
            type="date"
            className="w-[10rem]"
            value={filters.to ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value || undefined }))}
          />
        </label>
        <Select
          label="Sort"
          value={filters.sort ?? "newest"}
          onChange={(v) => setFilters((f) => ({ ...f, sort: v as OpsFilters["sort"] }))}
          options={[
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "company", label: "Company A–Z" },
          ]}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            setFilters({ sort: "newest" });
          }}
        >
          Reset
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border/70 bg-card">
        <table className="w-full min-w-[68rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left">
              {[
                "Submitted",
                "Name",
                "Company",
                "Work email",
                "Phone",
                "Volume",
                "Primary goal",
                "Status",
                "Source",
                "Campaign",
                "CRM",
                "",
              ].map((h) => (
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
            {leads.isLoading ? (
              <tr>
                <td colSpan={12} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Loading leads…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  No leads match these filters yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/50 transition-colors last:border-0 hover:bg-muted/50",
                    openId === row.id && "bg-signal-soft/40",
                  )}
                >
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs tabular-nums text-muted-foreground">
                    {fmtDate(row.submittedAt)}
                  </td>
                  <td className="px-3 py-2.5">{row.name}</td>
                  <td className="px-3 py-2.5">{row.company}</td>
                  <td className="px-3 py-2.5">
                    <a className="hover:text-signal" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">
                    {row.phone ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">
                    {row.monthlyLeads}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{row.primaryGoal}</td>
                  <td className="px-3 py-2.5">
                    <Pill tone={row.status === "new" ? "signal" : "neutral"}>{row.status}</Pill>
                  </td>
                  <td className="max-w-[12rem] truncate px-3 py-2.5 text-xs text-muted-foreground">
                    {row.sourceCta ?? row.sourceRoute ?? "—"}
                  </td>
                  <td className="max-w-[10rem] truncate px-3 py-2.5 text-xs text-muted-foreground">
                    {row.utmCampaign ?? row.utmSource ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <Pill tone={deliveryTone(row.deliveryStatus)}>
                      {row.deliveryStatus ?? "none"}
                      {row.attemptCount > 0 ? ` · ${row.attemptCount}` : ""}
                    </Pill>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">
                    <Button size="sm" variant="outline" onClick={() => setOpenId(row.id)}>
                      Open
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {rows.length} lead{rows.length === 1 ? "" : "s"} shown.
      </p>

      <Sheet open={Boolean(openId)} onOpenChange={(open) => !open && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Lead detail</SheetTitle>
          </SheetHeader>
          {detail.isLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
          ) : detail.data?.ok && detail.data.data ? (
            (() => {
              const d = detail.data.data;
              return (
                <div className="mt-4 flex flex-col gap-6">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Pill tone="signal">{d.lead.status}</Pill>
                      <Pill tone={deliveryTone(d.lead.deliveryStatus)}>
                        CRM {d.lead.deliveryStatus ?? "none"}
                      </Pill>
                      <CopyButton value={d.lead.email} label="Copy email" />
                      <CopyButton
                        value={[
                          d.lead.name,
                          d.lead.company,
                          d.lead.email,
                          d.lead.phone ?? "",
                          d.lead.website,
                        ]
                          .filter(Boolean)
                          .join("\n")}
                        label="Copy contact"
                      />
                    </div>
                    <KeyValue label="Submitted" value={fmtDate(d.lead.submittedAt)} />
                    <KeyValue label="Name" value={d.lead.name} />
                    <KeyValue label="Company" value={d.lead.company} />
                    <KeyValue label="Work email" value={d.lead.email} />
                    <KeyValue label="Phone" value={d.lead.phone ?? ""} />
                    <KeyValue label="Website" value={d.lead.website} />
                    <KeyValue label="Monthly lead volume" value={d.lead.monthlyLeads} />
                    <KeyValue label="Primary goal" value={d.lead.primaryGoal} />
                    <KeyValue label="Notes" value={d.lead.notes ?? ""} />
                    <KeyValue
                      label="Consent"
                      value={`${d.lead.consent ? "Granted" : "Not granted"} · ${fmtDate(d.lead.consentAt)}`}
                    />
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-semibold">Set internal status</h3>
                    <div className="flex flex-wrap gap-2">
                      {LEAD_STATUSES.map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={d.lead.status === s ? "default" : "outline"}
                          disabled={statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ id: d.lead.id, status: s })}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-semibold">Attribution context</h3>
                    {d.context ? (
                      <>
                        <KeyValue label="Source CTA" value={d.context.sourceCta ?? ""} />
                        <KeyValue label="Source route" value={d.context.sourceRoute ?? ""} />
                        <KeyValue label="Landing path" value={d.context.landingPath ?? ""} />
                        <KeyValue label="Page title" value={d.context.pageTitle ?? ""} />
                        <KeyValue label="Referrer" value={d.context.referrer ?? ""} />
                        <KeyValue
                          label="UTM"
                          value={[
                            d.context.utmSource,
                            d.context.utmMedium,
                            d.context.utmCampaign,
                            d.context.utmTerm,
                            d.context.utmContent,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        />
                        <KeyValue
                          label="Click IDs"
                          value={[d.context.gclid, d.context.fbclid].filter(Boolean).join(" · ")}
                        />
                        <KeyValue
                          label="Time to submit"
                          value={
                            d.context.elapsedMs
                              ? `${Math.round(d.context.elapsedMs / 100) / 10}s`
                              : ""
                          }
                        />
                        <KeyValue label="Captured" value={fmtDate(d.context.createdAt)} />
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">No context captured.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-semibold">Server-side events</h3>
                    <ul className="flex flex-col gap-2">
                      {d.events.length === 0 ? (
                        <li className="text-xs text-muted-foreground">No events recorded.</li>
                      ) : (
                        d.events.map((e: (typeof d.events)[number]) => (
                          <li key={e.id} className="rounded-md border border-border/60 px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-medium">{e.eventName}</span>
                              <span className="text-[0.68rem] tabular-nums text-muted-foreground">
                                {fmtDate(e.occurredAt)}
                              </span>
                            </div>
                            {e.metadata ? (
                              <pre className="mt-1 whitespace-pre-wrap break-words text-[0.68rem] text-muted-foreground">
                                {e.metadata}
                              </pre>
                            ) : null}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-semibold">CRM outbox</h3>
                    <ul className="flex flex-col gap-2">
                      {d.deliveries.map((delivery: (typeof d.deliveries)[number]) => (
                        <li
                          key={delivery.id}
                          className="rounded-md border border-border/60 px-3 py-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-medium">
                              {delivery.destination} · {delivery.status} · attempt{" "}
                              {delivery.attemptCount}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={retryMutation.isPending}
                              onClick={() => retryMutation.mutate(delivery.id)}
                            >
                              Retry delivery
                            </Button>
                          </div>
                          <p className="mt-1 text-[0.68rem] text-muted-foreground">
                            Last attempt {fmtDate(delivery.lastAttemptAt)} · next{" "}
                            {fmtDate(delivery.nextAttemptAt)}
                          </p>
                          {delivery.lastError ? (
                            <p className="mt-1 text-[0.68rem] text-destructive">
                              {delivery.lastError}
                            </p>
                          ) : null}
                        </li>
                      ))}
                      {d.deliveries.length === 0 ? (
                        <li className="text-xs text-muted-foreground">No delivery rows.</li>
                      ) : null}
                    </ul>
                    {retryMutation.data && "drain" in (retryMutation.data as object) ? (
                      <p className="mt-2 text-[0.68rem] text-muted-foreground">
                        Requeued. Drain result:{" "}
                        {JSON.stringify((retryMutation.data as { drain: unknown }).drain)}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">Lead not found.</p>
          )}
        </SheetContent>
      </Sheet>
    </OpsShell>
  );
}
