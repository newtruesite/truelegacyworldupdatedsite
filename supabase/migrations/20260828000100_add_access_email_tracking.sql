-- Migration: Add access email tracking to crm_distributors
-- Adds last_access_email_sent_at column and RPC to log when an access email is sent to a leader.

ALTER TABLE public.crm_distributors
  ADD COLUMN IF NOT EXISTS last_access_email_sent_at TIMESTAMP WITH TIME ZONE;

-- RPC for CRM admins to record when an access email has been dispatched
CREATE OR REPLACE FUNCTION public.crm_record_access_email_sent(
  p_distributor_id UUID
)
RETURNS public.crm_distributors
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dist public.crm_distributors;
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT (SELECT public.crm_is_admin()) THEN RAISE EXCEPTION 'Admin access required'; END IF;

  UPDATE public.crm_distributors
  SET
    last_access_email_sent_at = now(),
    updated_at = now()
  WHERE id = p_distributor_id
  RETURNING * INTO v_dist;

  IF v_dist.id IS NULL THEN RAISE EXCEPTION 'Distributor not found'; END IF;
  RETURN v_dist;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_record_access_email_sent(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_record_access_email_sent(UUID) TO authenticated;
