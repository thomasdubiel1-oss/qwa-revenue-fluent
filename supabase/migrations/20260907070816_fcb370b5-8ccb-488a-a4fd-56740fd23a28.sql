REVOKE EXECUTE ON FUNCTION public.has_internal_role(uuid, public.internal_role[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_account_member(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_account_role(uuid, public.account_role[]) FROM anon;