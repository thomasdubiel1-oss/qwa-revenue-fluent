import { createFileRoute } from '@tanstack/react-router';
import { SignalsInbox } from '@/components/qwa/scout/signals';
import { scoutHead } from '@/lib/scout/head';
export const Route=createFileRoute('/internal/demand-scout/signals')({validateSearch:(search:Record<string,unknown>)=>({q:String(search.q??''),source:String(search.source??''),industry:String(search.industry??''),intent:String(search.intent??''),geography:String(search.geography??''),status:String(search.status??''),minimum:Math.min(100,Math.max(0,Number(search.minimum)||0)),recency:Math.max(0,Number(search.recency)||0)}),head:()=>scoutHead('Signals inbox'),component:SignalsInbox});
