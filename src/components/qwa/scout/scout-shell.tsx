import { Link, useLocation } from '@tanstack/react-router';
import { ArrowUpRight, Bell, ChevronDown, ChevronRight, CircleHelp, Crosshair, Gauge, Inbox, Layers3, ListChecks, Search, Settings2, ShieldCheck, Workflow } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useScout } from './scout-context';
import { cn } from '@/lib/utils';
const navigation = [
  { label: 'Overview', to: '/internal/demand-scout', icon: Gauge },
  { label: 'Signals inbox', to: '/internal/demand-scout/signals', icon: Inbox },
  { label: 'Outreach queue', to: '/internal/demand-scout/outreach', icon: ListChecks },
  { label: 'Playbooks & scoring', to: '/internal/demand-scout/playbooks', icon: Layers3 },
  { label: 'Sources & connectors', to: '/internal/demand-scout/settings', icon: Settings2 },
] as const;
export function ScoutShell({ children }: { children: ReactNode }) {
  const { state, notice } = useScout();
  const location = useLocation();
  const active = navigation.find(item => location.pathname.replace(/\/$/,'') === item.to)?.label ?? 'Opportunity detail';
  return <div className="min-h-screen bg-paper text-foreground lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
    <aside className="border-r border-border bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
      <div className="flex h-[76px] items-center gap-2.5 border-b border-border px-6"><span className="grid size-8 place-items-center rounded-md bg-ink text-ink-foreground"><Workflow className="size-5" /></span><Link to="/app" className="text-xl font-semibold">QWA<span className="ml-1.5 text-xs font-normal text-muted-foreground">WORKSPACE</span></Link></div>
      <div className="hidden px-5 py-5 lg:block"><p className="text-xs font-semibold text-muted-foreground">REVENUE INTELLIGENCE</p><div className="mt-3 flex items-center gap-2"><Crosshair className="size-4 text-signal"/><span className="text-sm font-semibold">Demand Scout</span><span className="ml-auto rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">BETA</span></div></div>
      <nav aria-label="Demand Scout" className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1 lg:px-3">{navigation.map(({label,to,icon:Icon}) => <Link key={to} to={to} className={cn('flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm transition-colors',active===label ? 'bg-signal-soft font-medium text-signal' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}><Icon className="size-[18px]"/><span>{label}</span>{label==='Signals inbox' && <span className="ml-auto text-xs">{state.opportunities.length}</span>}</Link>)}</nav>
      <div className="mt-auto hidden space-y-4 border-t p-5 lg:block"><div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-positive"/> Human approval required</div><Link to="/internal/revenue" className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground">Revenue Engine <ArrowUpRight className="size-4"/></Link><Link to="/app/demand-scout" className="flex items-center gap-3 border-t pt-4"><span className="grid size-8 place-items-center rounded-md bg-secondary text-xs font-semibold">Q</span><span className="text-xs"><strong className="block font-medium">QWA Demo Workspace</strong><span className="text-muted-foreground">Synthetic data only</span></span><ChevronDown className="ml-auto size-4 text-muted-foreground"/></Link></div>
    </aside>
    <div className="min-w-0"><header className="flex h-[76px] items-center justify-between gap-3 border-b bg-card px-5 lg:px-8"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="hidden sm:inline">Revenue Intelligence</span><ChevronRight className="hidden size-3 sm:block"/><span className="font-medium text-foreground">{active}</span></div><div className="flex items-center gap-3"><Button asChild variant="ghost" className="hidden text-muted-foreground md:flex"><Link to="/internal/demand-scout/signals"><Search/> Search signals <span className="ml-6 text-[10px]">⌕</span></Link></Button><Button asChild variant="ghost" size="icon" title="Audit and run activity"><Link to="/internal/demand-scout/settings"><Bell/></Link></Button><span className="grid size-8 place-items-center rounded-full border bg-secondary text-xs font-medium" title="Demo operator">QW</span></div></header>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-signal/15 bg-signal-soft/60 px-5 py-2.5 text-xs lg:px-8"><p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-signal"/><strong className="font-semibold text-signal">DEMO MODE</strong><span className="text-muted-foreground">Synthetic businesses & signals. No live collection or external sending.</span></p><Link to="/internal/demand-scout/settings" className="flex items-center gap-1 font-medium text-signal">View sources <ArrowUpRight className="size-3"/></Link></div>
      <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">{children}</main>
      {notice && <div role="status" className="fixed bottom-5 left-5 right-5 z-50 rounded-md border bg-ink px-5 py-3 text-sm text-ink-foreground shadow-card lg:left-auto lg:max-w-lg">{notice}</div>}
      <footer className="flex flex-wrap justify-between gap-2 border-t px-5 py-4 text-[11px] text-muted-foreground lg:px-8"><span>QWA Revenue Operating System · Demand Scout</span><span className="flex items-center gap-1.5"><CircleHelp className="size-3"/> Demo estimates are not verified revenue</span></footer>
    </div>
  </div>;
}
