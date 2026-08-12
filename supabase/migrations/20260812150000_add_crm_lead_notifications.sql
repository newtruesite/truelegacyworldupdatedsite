CREATE TABLE public.crm_notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL UNIQUE REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL DEFAULT 'truelegacyworld@proton.me',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

CREATE INDEX crm_notification_queue_status_idx ON public.crm_notification_queue (status, created_at);
ALTER TABLE public.crm_notification_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM admins view notification queue" ON public.crm_notification_queue
  FOR SELECT TO authenticated USING (public.crm_is_admin());
REVOKE ALL ON public.crm_notification_queue FROM anon, authenticated;
GRANT SELECT ON public.crm_notification_queue TO authenticated;

CREATE OR REPLACE FUNCTION public.crm_queue_lead_notification()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.crm_notification_queue (lead_id)
  VALUES (NEW.id)
  ON CONFLICT (lead_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_queue_new_lead_notification
AFTER INSERT ON public.crm_leads
FOR EACH ROW EXECUTE FUNCTION public.crm_queue_lead_notification();

