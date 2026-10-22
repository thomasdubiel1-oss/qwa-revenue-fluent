import { createFileRoute } from '@tanstack/react-router';
import { Playbooks } from '@/components/qwa/scout/playbooks';
import { scoutHead } from '@/lib/scout/head';
export const Route=createFileRoute('/internal/demand-scout/playbooks')({head:()=>scoutHead('playbooks'),component:Playbooks});
