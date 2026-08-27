REVOKE ALL ON FUNCTION public.purge_expired_lead_data(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_lead_data(INTEGER) TO service_role;