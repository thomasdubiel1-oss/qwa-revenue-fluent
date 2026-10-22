import { createFileRoute } from '@tanstack/react-router';
import { OpportunityDetail } from '@/components/qwa/scout/detail';
import { scoutHead } from '@/lib/scout/head';
export const Route=createFileRoute('/internal/demand-scout/opportunities/$opportunityId')({head:({params})=>scoutHead(`Opportunity ${params.opportunityId}`),component:OpportunityDetail});
