import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { scoutWorkspaceFn } from '@/lib/scout/workspace.functions';
import { scoutHead } from '@/lib/scout/head';
export const Route=createFileRoute('/app/demand-scout/')({head:()=>scoutHead('Private workspace'),component:Workspace});
function Workspace(){const resolve=useServerFn(scoutWorkspaceFn);const workspace=useQuery({queryKey:['scout','memberships'],queryFn:()=>resolve({data:{}}),retry:false});return <main className="min-h-screen bg-paper p-8"><h1 className="text-2xl font-semibold">QWA Demand Scout workspace</h1>{workspace.isPending?<p className="mt-5" role="status">Verifying account membership…</p>:workspace.error?<p className="mt-5" role="alert">Workspace access could not be verified. Sign in again or contact your QWA administrator.</p>:<div className="mt-6 max-w-xl"><p className="text-sm text-muted-foreground">{workspace.data?.memberships.length?'Account membership verified. Tenant storage is available; this first version uses the isolated interactive demo below.':'No QWA account membership is assigned. An owner must provision your organization and account before private data is available.'}</p>{workspace.data?.memberships.map(item=><p className="mt-3 text-sm" key={item.accountId}>{item.name} · {item.role}</p>)}</div>}<Button asChild className="mt-6"><Link to="/internal/demand-scout">Open synthetic demo</Link></Button></main>;}
