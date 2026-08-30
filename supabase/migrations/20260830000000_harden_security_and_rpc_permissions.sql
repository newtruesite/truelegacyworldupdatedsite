-- Security Hardening & RPC Execution Lock-Down
-- Addresses Supabase Security Advisor Linter 0028 (anon security definer executable)

-- 1. REVOKE DEFAULT EXECUTE PRIVILEGES FROM PUBLIC AND ANON ON ALL EXISTING FUNCTIONS IN SCHEMA PUBLIC
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Ensure future functions in public schema do not automatically grant execution to public
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;

-- 2. EXPLICITLY GRANT EXECUTE ON INTENTIONAL PUBLIC ENTRYPOINTS TO ANON AND AUTHENTICATED
GRANT EXECUTE ON FUNCTION public.get_public_crm_distributors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_crm_application(JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_crm_leader_application(JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_track_share_click(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_record_analytics(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_record_resource_event(TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_submit_resource_form(TEXT, TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_booking_page(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_booking_slots(TEXT, TEXT, DATE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_book_meeting(TEXT, TEXT, TIMESTAMPTZ, JSONB) TO anon, authenticated;

-- 3. EXPLICITLY GRANT EXECUTE ON INTERNAL AUTHENTICATED RPCS ONLY TO AUTHENTICATED
GRANT EXECUTE ON FUNCTION public.crm_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_current_distributor_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_can_access_lead(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_update_lead_status(UUID, TEXT, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_assign_lead(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_add_lead_note(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_choose_sponsor(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_set_training_progress(UUID, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_set_onboarding_progress(UUID, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_submit_quiz(TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_review_leader_application(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_record_access_email_sent(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_update_meeting_status(UUID, TEXT) TO authenticated;

-- 4. ENSURE FIXED SEARCH_PATH ON KEY SECURITY DEFINER FUNCTIONS (Linter Remediation)
ALTER FUNCTION public.crm_is_admin() SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_current_distributor_id() SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_can_access_lead(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.submit_crm_application(JSONB) SET search_path = public, pg_temp;
ALTER FUNCTION public.submit_crm_leader_application(JSONB) SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_update_lead_status(UUID, TEXT, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_assign_lead(UUID, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_add_lead_note(UUID, TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_review_leader_application(UUID, TEXT, TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_record_access_email_sent(UUID) SET search_path = public, pg_temp;

-- 5. AUDIT LOGGING FOR LEAD CSV EXPORTS & SENSITIVE DATA ACCESS
CREATE TABLE IF NOT EXISTS public.crm_export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL DEFAULT 'leads_csv',
  lead_count INTEGER NOT NULL DEFAULT 0,
  scope TEXT NOT NULL DEFAULT 'personal', -- 'personal' or 'team_oversight'
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_export_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view export logs" ON public.crm_export_logs
  FOR SELECT TO authenticated
  USING (public.crm_is_admin());

CREATE POLICY "Authenticated members insert export logs" ON public.crm_export_logs
  FOR INSERT TO authenticated
  WITH CHECK (exported_by = auth.uid());

CREATE OR REPLACE FUNCTION public.crm_log_export(p_count INTEGER, p_scope TEXT DEFAULT 'personal')
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.crm_export_logs (exported_by, export_type, lead_count, scope)
  VALUES (auth.uid(), 'leads_csv', p_count, p_scope)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.crm_log_export(INTEGER, TEXT) TO authenticated;
