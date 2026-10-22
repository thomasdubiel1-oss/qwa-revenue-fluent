import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
export const scoutWorkspaceFn = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ accountId: z.string().uuid().optional() }))
  .handler(async ({ data, context }) => {
    const { data: memberships, error } = await context.supabase.from('account_memberships').select('account_id,tenant_id,role,accounts(name)').eq('user_id', context.userId);
    if (error) throw new Error('Workspace membership could not be verified.');
    const available = memberships ?? [];
    const membership = available.find(row => row.account_id === data.accountId) ?? (data.accountId ? undefined : available.length === 1 ? available[0] : undefined);
    if (data.accountId && !membership) throw new Error('Workspace access denied.');
    return { memberships: available.map(row => ({ accountId: row.account_id, tenantId: row.tenant_id, role: row.role, name: row.accounts?.name ?? 'QWA workspace' })), active: membership ? { accountId: membership.account_id, tenantId: membership.tenant_id, role: membership.role } : null };
  });

const componentsSchema = z.object({ buyingIntent: z.number().min(0).max(100), painSeverity: z.number().min(0).max(100), budgetLikelihood: z.number().min(0).max(100), qwaFit: z.number().min(0).max(100), accessibility: z.number().min(0).max(100), urgency: z.number().min(0).max(100), evidenceQuality: z.number().min(0).max(100) });
const stateSchema = z.object({
  version: z.literal(1), runs: z.number().int().min(0), weights: componentsSchema.refine(value => Object.values(value).some(weight => weight > 0)),
  opportunities: z.array(z.object({ id: z.string().regex(/^demo-\d{2}$/), business: z.string().max(200), industry: z.string().max(100), geography: z.string().max(100), source: z.string().max(100), text: z.string().max(5000), date: z.string().datetime(), url: z.string().url().refine(value => new URL(value).hostname === 'signals.example.com'), pain: z.string().max(200), intent: z.enum(['Buying','Exploring','Problem aware']), components: componentsSchema, solution: z.string().max(100), value: z.tuple([z.number().nonnegative(),z.number().nonnegative()]), status: z.enum(['review','approved','dismissed']) })).max(100),
  drafts: z.array(z.object({ opportunityId: z.string(), messages: z.array(z.string().min(1).max(5000)).length(3), channel: z.enum(['Email','LinkedIn','X']), status: z.enum(['draft','approved','sent']) })).max(100),
  events: z.array(z.object({ id: z.string().max(100), opportunityId: z.string().optional(), kind: z.string().max(100), detail: z.string().max(1000), at: z.string().datetime() })).max(10000),
  outcomes: z.array(z.object({ opportunityId: z.string(), outcome: z.enum(['reply','booked','won','lost']), at: z.string().datetime() })).max(1000),
});
export const scoutReadStateFn = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ accountId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { data: membership } = await context.supabase.from('account_memberships').select('tenant_id,role').eq('account_id',data.accountId).eq('user_id',context.userId).maybeSingle();
    if (!membership) throw new Error('Workspace access denied.');
    const { data: workspace, error } = await context.supabase.from('scout_workspaces').select('state,revision').eq('account_id',data.accountId).maybeSingle();
    if (error) throw new Error('Unable to load Demand Scout.');
    const parsed = stateSchema.safeParse(workspace?.state);
    return { state: parsed.success ? parsed.data : null, revision: workspace?.revision ?? 0, role: membership.role };
  });
export const scoutSaveStateFn = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ accountId: z.string().uuid(), revision: z.number().int().nonnegative(), state: stateSchema }))
  .handler(async ({ data, context }) => {
    const { data: membership } = await context.supabase.from('account_memberships').select('tenant_id,role').eq('account_id',data.accountId).eq('user_id',context.userId).maybeSingle();
    if (!membership || !['owner','admin','operator'].includes(membership.role)) throw new Error('Operator access required.');
    const { data: current } = await context.supabase.from('scout_workspaces').select('id,revision').eq('account_id',data.accountId).maybeSingle();
    if (current && current.revision !== data.revision) throw new Error('Workspace changed. Reload before saving.');
    const revision = data.revision + 1;
    const patch = { state: data.state, revision, updated_at: new Date().toISOString() };
    const result = current ? await context.supabase.from('scout_workspaces').update(patch).eq('id',current.id).eq('revision',data.revision).select('id').maybeSingle() : await context.supabase.from('scout_workspaces').insert({ ...patch, account_id: data.accountId, tenant_id: membership.tenant_id, name: 'Demand Scout — demo workspace', is_demo: true }).select('id').single();
    if (result.error || !result.data) throw new Error('Workspace changed or save failed. Reload and try again.');
    return { revision };
  });
