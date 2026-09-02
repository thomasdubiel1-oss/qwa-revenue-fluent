import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  Cable,
  CalendarRange,
  Contact,
  FileBarChart,
  Gauge,
  Globe2,
  Megaphone,
  Radio,
  Settings2,
  ShoppingBag,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const sections = [
  ["Executive Command", "/internal/executive", Gauge, "V1"],
  ["Revenue Engine", "/internal/revenue", Activity, "V1"],
  ["Acquisition Engine", null, Megaphone, "V2"],
  ["Live Shopping", null, Radio, "V2"],
  ["Content Studio", null, Sparkles, "V2"],
  ["AI Agent Control", "/internal/control-plane", Bot, "V3"],
  ["Quantum Concierge", null, Contact, "V1"],
  ["CRM & Customers", "/internal/leads", Contact, "V1"],
  ["Commerce & Products", null, ShoppingBag, "V2"],
  ["Funnels & Websites", null, Globe2, "V2"],
  ["Creators & Affiliates", null, Boxes, "V2"],
  ["Analytics & Attribution", null, BarChart3, "V1"],
  ["Automations", "/internal/automation", Workflow, "V3"],
  ["Integrations", null, Cable, "V1"],
  ["Reports & Forecasting", null, FileBarChart, "V2"],
  ["Administration", null, Settings2, "V1"],
] as const;

export function TwinShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between border-b border-border/70 px-5">
          <Link to="/" className="font-semibold tracking-tight">
            QWA <span className="text-muted-foreground">Twin</span>
          </Link>
          <span className="rounded-full border border-signal/40 bg-signal-soft px-2 py-1 text-[0.65rem] font-semibold text-signal">
            SIMULATION
          </span>
        </div>
        <nav
          aria-label="Digital Twin sections"
          className="flex gap-1 overflow-x-auto p-3 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto"
        >
          {sections.map(([label, href, Icon, release]) => {
            const classes = cn(
              "flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
              href
                ? "text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                : "cursor-not-allowed text-muted-foreground/50",
            );
            const body = (
              <>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                <span className="text-[0.6rem] font-medium">{release}</span>
              </>
            );
            return href ? (
              <Link
                key={label}
                to={href}
                className={cn(
                  classes,
                  href === "/internal/executive" &&
                    "bg-ink text-ink-foreground hover:bg-ink hover:text-ink-foreground",
                )}
              >
                {body}
              </Link>
            ) : (
              <span key={label} className={classes} aria-disabled="true" title="Planned section">
                {body}
              </span>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}

export function TwinHeader({
  title,
  account,
  children,
}: {
  title: string;
  account: string;
  children?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center gap-3 border-b border-border/70 bg-background/92 px-5 py-3 backdrop-blur lg:px-8">
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {account} · Last 30 days
        </p>
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
          <CalendarRange className="h-3.5 w-3.5" /> Aug 4–Sep 2
        </span>
      </div>
    </header>
  );
}
