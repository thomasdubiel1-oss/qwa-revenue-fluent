CREATE TYPE public.account_role AS ENUM ('owner', 'admin', 'operator', 'analyst', 'viewer');

CREATE TABLE public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, slug),
  UNIQUE (id, tenant_id)
);

CREATE TABLE public.account_memberships (
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  account_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.account_role NOT NULL DEFAULT 'viewer',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (account_id, user_id),
  FOREIGN KEY (account_id, tenant_id) REFERENCES public.accounts(id, tenant_id) ON DELETE CASCADE
);

CREATE INDEX account_memberships_user_idx ON public.account_memberships (user_id, tenant_id);

CREATE OR REPLACE FUNCTION public.is_account_member(target_account_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.account_memberships
    WHERE account_id = target_account_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_account_role(target_account_id uuid, allowed_roles public.account_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.account_memberships
    WHERE account_id = target_account_id
      AND user_id = auth.uid()
      AND role = ANY (allowed_roles)
  );
$$;

REVOKE ALL ON FUNCTION public.is_account_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_account_role(uuid, public.account_role[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_account_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_account_role(uuid, public.account_role[]) TO authenticated;

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenants_read_member ON public.tenants FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.account_memberships m
  WHERE m.tenant_id = tenants.id AND m.user_id = auth.uid()
));

CREATE POLICY accounts_read_member ON public.accounts FOR SELECT TO authenticated
USING (public.is_account_member(id));

CREATE POLICY memberships_read_same_account ON public.account_memberships FOR SELECT TO authenticated
USING (public.is_account_member(account_id));

CREATE POLICY memberships_manage_admin ON public.account_memberships FOR ALL TO authenticated
USING (public.has_account_role(account_id, ARRAY['owner', 'admin']::public.account_role[]))
WITH CHECK (public.has_account_role(account_id, ARRAY['owner', 'admin']::public.account_role[]));

GRANT SELECT ON public.tenants, public.accounts, public.account_memberships TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.account_memberships TO authenticated;

COMMENT ON FUNCTION public.is_account_member(uuid) IS 'RLS helper: true only when auth.uid() belongs to the target account.';
COMMENT ON FUNCTION public.has_account_role(uuid, public.account_role[]) IS 'RLS helper: account-scoped role authorization for auth.uid().';
