import { createFileRoute } from '@tanstack/react-router';
import { OutreachQueue } from '@/components/qwa/scout/outreach';
import { scoutHead } from '@/lib/scout/head';
export const Route=createFileRoute('/internal/demand-scout/outreach')({head:()=>scoutHead('outreach'),component:OutreachQueue});
