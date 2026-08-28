import * as React from "react";

import { cn } from "@/lib/utils";

/** Dedicated internal shell — denser than the public site, same design tokens. */
export function OpsShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/92 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[100rem] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              QWA Internal · Revenue Ops
            </p>
            <h1 className="truncate text-lg font-semibold tracking-[-0.01em]">{title}</h1>
            {subtitle ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-[100rem] px-5 py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "signal" | "warn";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card p-4",
        tone === "signal" && "border-signal/40 bg-signal-soft/50",
        tone === "warn" && "border-destructive/35",
      )}
    >
      <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-[-0.02em]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "signal" | "positive" | "warn" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.68rem] font-medium",
        tone === "neutral" && "border-border text-foreground",
        tone === "muted" && "border-border/60 text-muted-foreground",
        tone === "signal" && "border-signal/45 bg-signal-soft text-signal",
        tone === "positive" && "border-signal/45 bg-signal-soft text-signal",
        tone === "warn" && "border-destructive/45 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border/70 bg-card", className)}>
      <div className="border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-[-0.01em]">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function BarList({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">No data yet.</p>;
  }
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-xs text-muted-foreground" title={item.label}>
            {item.label}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-signal/70"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-xs tabular-nums">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="rounded-md border border-border/70 px-2 py-1 text-[0.68rem] text-muted-foreground transition-colors hover:border-signal/50 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? "Copied" : (label ?? "Copy")}
    </button>
  );
}

export function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/50 py-2 last:border-0">
      <span className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="break-words text-sm">{value || <span className="text-muted-foreground">—</span>}</span>
    </div>
  );
}

/** Signed change vs the prior comparable period. Renders nothing when unsupported. */
export function DeltaLabel({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <span className="text-xs text-muted-foreground">no comparable prior period</span>;
  }
  const up = pct >= 0;
  return (
    <span className={cn("text-xs tabular-nums", up ? "text-signal" : "text-destructive")}>
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(0)}% vs prior period
    </span>
  );
}

export function SmallSampleNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="mt-2 text-[0.68rem] text-muted-foreground">
      {children ?? "Small sample — directional only, not statistically meaningful."}
    </p>
  );
}

/** Minimal column trend. Axis-free by design: comprehension over decoration. */
export function Sparkbars({
  points,
  ariaLabel,
}: {
  points: { date: string; count: number }[];
  ariaLabel: string;
}) {
  if (points.length === 0) {
    return <p className="text-xs text-muted-foreground">No submissions in this window.</p>;
  }
  const max = Math.max(1, ...points.map((p) => p.count));
  return (
    <div>
      <div className="flex h-24 items-end gap-[3px]" role="img" aria-label={ariaLabel}>
        {points.map((p) => (
          <span
            key={p.date}
            title={`${p.date}: ${p.count}`}
            className="min-w-[3px] flex-1 rounded-sm bg-signal/60"
            style={{ height: `${Math.max(4, (p.count / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.62rem] text-muted-foreground">
        <span>{points[0]?.date}</span>
        <span>peak {max}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

/** Horizontal funnel bars with explicit counts — no implied downstream revenue. */
export function FunnelBars({
  stages,
  onSelect,
}: {
  stages: { key: string; label: string; count: number; share: number }[];
  onSelect?: (key: string) => void;
}) {
  return (
    <ol className="flex flex-col gap-2.5">
      {stages.map((stage) => {
        const body = (
          <>
            <span className="w-52 shrink-0 truncate text-xs text-muted-foreground">
              {stage.label}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-signal/70"
                style={{ width: `${Math.min(100, stage.share)}%` }}
              />
            </span>
            <span className="w-24 shrink-0 text-right text-xs tabular-nums">
              {stage.count} · {stage.share.toFixed(0)}%
            </span>
          </>
        );
        return (
          <li key={stage.key}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(stage.key)}
                className="flex w-full items-center gap-3 rounded-md px-1 py-1 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {body}
              </button>
            ) : (
              <div className="flex w-full items-center gap-3 px-1 py-1">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Breakdown table with qualification share; small samples are labelled inline. */
export function BreakdownTable({
  rows,
  onSelect,
}: {
  rows: {
    label: string;
    count: number;
    qualified: number;
    qualifiedShare: number | null;
    smallSample: boolean;
  }[];
  onSelect?: (label: string) => void;
}) {
  if (rows.length === 0) {
    return <p className="text-xs text-muted-foreground">No data in this window.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
          <th className="pb-2 text-left font-medium">Segment</th>
          <th className="pb-2 text-right font-medium">Leads</th>
          <th className="pb-2 text-right font-medium">Qualified</th>
          <th className="pb-2 text-right font-medium">Share</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-border/50">
            <td className="py-2 pr-2">
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(row.label)}
                  className="max-w-[16rem] truncate text-left underline-offset-4 hover:text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {row.label}
                </button>
              ) : (
                <span className="block max-w-[16rem] truncate">{row.label}</span>
              )}
              {row.smallSample ? (
                <span className="ml-1 text-[0.62rem] text-muted-foreground">small sample</span>
              ) : null}
            </td>
            <td className="py-2 text-right tabular-nums">{row.count}</td>
            <td className="py-2 text-right tabular-nums">{row.qualified}</td>
            <td className="py-2 text-right tabular-nums">
              {row.qualifiedShare === null ? "—" : `${row.qualifiedShare.toFixed(0)}%`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

