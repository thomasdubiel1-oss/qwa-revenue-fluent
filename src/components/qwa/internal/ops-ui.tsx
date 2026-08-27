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
