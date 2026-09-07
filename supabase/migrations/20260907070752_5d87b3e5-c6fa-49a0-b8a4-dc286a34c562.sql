DO $$ BEGIN
  CREATE TYPE public.internal_role AS ENUM ('viewer', 'ops', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.internal_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.internal_role NOT NULL DEFAULT 'viewer',
  display_label text NOT NULL,
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.internal_users TO authenticated;
GRANT ALL ON public.internal_users TO service_role;

ALTER TABLE public.internal_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_internal_role(_user_id uuid, _roles public.internal_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.internal_users u
    WHERE u.user_id = _user_id
      AND u.disabled_at IS NULL
      AND u.role = ANY(_roles)
  );
$$;

REVOKE ALL ON FUNCTION public.has_internal_role(uuid, public.internal_role[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_internal_role(uuid, public.internal_role[]) TO authenticated;

DROP POLICY IF EXISTS internal_users_read_self ON public.internal_users;
CREATE POLICY internal_users_read_self ON public.internal_users
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS internal_users_admin_read ON public.internal_users;
CREATE POLICY internal_users_admin_read ON public.internal_users
  FOR SELECT TO authenticated
  USING (public.has_internal_role(auth.uid(), ARRAY['admin']::public.internal_role[]));

DROP POLICY IF EXISTS internal_users_admin_manage ON public.internal_users;
CREATE POLICY internal_users_admin_manage ON public.internal_users
  FOR ALL TO authenticated
  USING (public.has_internal_role(auth.uid(), ARRAY['admin']::public.internal_role[]))
  WITH CHECK (public.has_internal_role(auth.uid(), ARRAY['admin']::public.internal_role[]));

DROP TRIGGER IF EXISTS update_internal_users_updated_at ON public.internal_users;
CREATE TRIGGER update_internal_users_updated_at
  BEFORE UPDATE ON public.internal_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.lead_activity ADD COLUMN IF NOT EXISTS actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.lead_tasks ADD COLUMN IF NOT EXISTS actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.automation_settings ADD COLUMN IF NOT EXISTS actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.automation_recommendations ADD COLUMN IF NOT EXISTS actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.automation_executions ADD COLUMN IF NOT EXISTS actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.automation_config_versions ADD COLUMN IF NOT EXISTS actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;