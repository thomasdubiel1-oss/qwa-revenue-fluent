CREATE TABLE public.lead_activity (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_request_id uuid NOT NULL REFERENCES public.demo_requests(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  note text,
  actor_label text NOT NULL DEFAULT 'internal_operator',
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_activity_lead ON public.lead_activity(demo_request_id, created_at DESC);

GRANT ALL ON public.lead_activity TO service_role;
ALTER TABLE public.lead_activity ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lead_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_request_id uuid NOT NULL REFERENCES public.demo_requests(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_at timestamp with time zone,
  completed_at timestamp with time zone,
  actor_label text NOT NULL DEFAULT 'internal_operator',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_tasks_open ON public.lead_tasks(completed_at, due_at);
CREATE INDEX idx_lead_tasks_lead ON public.lead_tasks(demo_request_id, created_at DESC);

GRANT ALL ON public.lead_tasks TO service_role;
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_lead_tasks_updated_at
BEFORE UPDATE ON public.lead_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();