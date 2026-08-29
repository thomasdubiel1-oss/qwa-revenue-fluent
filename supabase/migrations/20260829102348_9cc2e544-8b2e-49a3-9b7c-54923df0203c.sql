CREATE TABLE public.automation_settings (
  id text PRIMARY KEY DEFAULT 'global',
  mode text NOT NULL DEFAULT 'off',
  kill_switch boolean NOT NULL DEFAULT false,
  actor_label text NOT NULL DEFAULT 'internal_operator',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT automation_settings_single CHECK (id = 'global'),
  CONSTRAINT automation_settings_mode CHECK (mode IN ('off','recommend','internal_auto'))
);

GRANT ALL ON public.automation_settings TO service_role;
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_automation_settings_updated_at
BEFORE UPDATE ON public.automation_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.automation_settings (id, mode, kill_switch) VALUES ('global','off',false);

CREATE TABLE public.automation_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_request_id uuid NOT NULL REFERENCES public.demo_requests(id) ON DELETE CASCADE,
  playbook_key text NOT NULL,
  playbook_version integer NOT NULL,
  execution_key text NOT NULL,
  status text NOT NULL DEFAULT 'recommended',
  action_type text NOT NULL,
  action_payload jsonb,
  reason_codes text[] NOT NULL DEFAULT '{}',
  explanation text,
  snooze_until timestamptz,
  resolved_at timestamptz,
  actor_label text NOT NULL DEFAULT 'internal_operator',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT automation_recommendations_status CHECK (
    status IN ('recommended','approved','dismissed','snoozed','auto_executed','blocked','failed')
  ),
  CONSTRAINT automation_recommendations_key_unique UNIQUE (execution_key)
);

CREATE INDEX automation_recommendations_lead_idx ON public.automation_recommendations (demo_request_id);
CREATE INDEX automation_recommendations_status_idx ON public.automation_recommendations (status);

GRANT ALL ON public.automation_recommendations TO service_role;
ALTER TABLE public.automation_recommendations ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_automation_recommendations_updated_at
BEFORE UPDATE ON public.automation_recommendations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.automation_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_request_id uuid REFERENCES public.demo_requests(id) ON DELETE CASCADE,
  playbook_key text NOT NULL,
  playbook_version integer NOT NULL,
  execution_key text NOT NULL,
  mode text NOT NULL,
  outcome text NOT NULL,
  reason_code text NOT NULL,
  detail jsonb,
  actor_label text NOT NULL DEFAULT 'internal_operator',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT automation_executions_outcome CHECK (
    outcome IN ('executed','skipped','blocked','failed')
  )
);

CREATE INDEX automation_executions_lead_idx ON public.automation_executions (demo_request_id);
CREATE INDEX automation_executions_key_idx ON public.automation_executions (execution_key);
CREATE UNIQUE INDEX automation_executions_executed_key_idx
  ON public.automation_executions (execution_key)
  WHERE outcome = 'executed';

GRANT ALL ON public.automation_executions TO service_role;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;