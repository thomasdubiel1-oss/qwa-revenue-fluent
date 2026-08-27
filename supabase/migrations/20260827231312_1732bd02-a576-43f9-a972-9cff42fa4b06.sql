-- ============ demo_requests (PII scope) ============
CREATE TABLE public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  website TEXT NOT NULL,
  monthly_leads TEXT NOT NULL,
  primary_goal TEXT NOT NULL,
  notes TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'new',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.demo_requests TO service_role;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: lead PII is server-side only.

CREATE INDEX demo_requests_submitted_at_idx ON public.demo_requests (submitted_at DESC);
CREATE INDEX demo_requests_email_idx ON public.demo_requests (lower(email));

-- ============ demo_request_context (attribution scope) ============
CREATE TABLE public.demo_request_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_request_id UUID NOT NULL REFERENCES public.demo_requests(id) ON DELETE CASCADE,
  source_cta TEXT,
  source_route TEXT,
  page_title TEXT,
  landing_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT,
  elapsed_ms INTEGER,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.demo_request_context TO service_role;
ALTER TABLE public.demo_request_context ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX demo_request_context_request_idx ON public.demo_request_context (demo_request_id);

-- ============ lead_deliveries (provider-neutral outbox) ============
CREATE TABLE public.lead_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_request_id UUID NOT NULL REFERENCES public.demo_requests(id) ON DELETE CASCADE,
  destination TEXT NOT NULL DEFAULT 'highlevel',
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provider_ref TEXT,
  response_meta JSONB,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.lead_deliveries TO service_role;
ALTER TABLE public.lead_deliveries ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX lead_deliveries_request_destination_idx
  ON public.lead_deliveries (demo_request_id, destination);
CREATE INDEX lead_deliveries_pending_idx
  ON public.lead_deliveries (status, next_attempt_at);

-- ============ conversion_events (server-side source of truth) ============
CREATE TABLE public.conversion_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  demo_request_id UUID REFERENCES public.demo_requests(id) ON DELETE SET NULL,
  source_cta TEXT,
  source_route TEXT,
  utm_campaign TEXT,
  metadata JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.conversion_events TO service_role;
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX conversion_events_occurred_idx ON public.conversion_events (occurred_at DESC);

-- ============ abuse control (hashed signal only, no raw IPs) ============
CREATE TABLE public.submission_throttle (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_hash TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', now()),
  hit_count INTEGER NOT NULL DEFAULT 1,
  blocked_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.submission_throttle TO service_role;
ALTER TABLE public.submission_throttle ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX submission_throttle_window_idx
  ON public.submission_throttle (signal_hash, window_start);

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_demo_requests_updated_at BEFORE UPDATE ON public.demo_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lead_deliveries_updated_at BEFORE UPDATE ON public.lead_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ retention hook (policy-driven purge, invoked manually/by schedule) ============
CREATE OR REPLACE FUNCTION public.purge_expired_lead_data(retention_days INTEGER DEFAULT 730)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed INTEGER;
BEGIN
  DELETE FROM public.demo_requests
  WHERE submitted_at < now() - (retention_days || ' days')::interval;
  GET DIAGNOSTICS removed = ROW_COUNT;

  DELETE FROM public.conversion_events
  WHERE occurred_at < now() - (retention_days || ' days')::interval;

  DELETE FROM public.submission_throttle
  WHERE window_start < now() - interval '7 days';

  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_lead_data(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purge_expired_lead_data(INTEGER) TO service_role;