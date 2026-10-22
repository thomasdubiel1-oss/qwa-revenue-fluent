import { createFileRoute } from '@tanstack/react-router';
import { ScoutSettings } from '@/components/qwa/scout/settings';
import { scoutHead } from '@/lib/scout/head';
export const Route=createFileRoute('/internal/demand-scout/settings')({head:()=>scoutHead('settings'),component:ScoutSettings});
