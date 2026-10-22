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
