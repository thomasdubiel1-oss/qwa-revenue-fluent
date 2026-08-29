CREATE TABLE public.automation_config_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version integer NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT false,
  config jsonb NOT NULL,
  source text NOT NULL DEFAULT 'operator',
  change_reason text,
  actor_label text NOT NULL DEFAULT 'internal_operator',
  rolled_back_from integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  activated_at timestamp with time zone,
  CONSTRAINT automation_config_versions_source_check CHECK (source IN ('baseline','operator','rollback'))
);

CREATE UNIQUE INDEX automation_config_versions_single_active
  ON public.automation_config_versions (is_active) WHERE is_active;

GRANT ALL ON public.automation_config_versions TO service_role;

ALTER TABLE public.automation_config_versions ENABLE ROW LEVEL SECURITY;