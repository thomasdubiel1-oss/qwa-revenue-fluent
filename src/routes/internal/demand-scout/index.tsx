import { createFileRoute } from '@tanstack/react-router';
import { ScoutOverview } from '@/components/qwa/scout/overview';
import { scoutHead } from '@/lib/scout/head';
export const Route=createFileRoute('/internal/demand-scout/')({head:()=>scoutHead('Revenue Intelligence'),component:ScoutOverview});
