import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ScoutProvider } from '@/components/qwa/scout/scout-context';
import { ScoutShell } from '@/components/qwa/scout/scout-shell';
export const Route = createFileRoute('/internal/demand-scout')({ ssr:false, component: ScoutLayout });
function ScoutLayout(){return <ScoutProvider><ScoutShell><Outlet/></ScoutShell></ScoutProvider>;}
