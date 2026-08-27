-- Admin function to review (approve/decline/set to reviewing) a leader application.
-- Only CRM admins can call this.

CREATE OR REPLACE FUNCTION public.crm_review_leader_application(
  p_application_id UUID,
  p_status TEXT,
  p_review_notes TEXT DEFAULT NULL
)
RETURNS public.crm_leader_applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.crm_leader_applications;
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT (SELECT public.crm_is_admin()) THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF p_status NOT IN ('pending', 'reviewing', 'approved', 'declined') THEN
    RAISE EXCEPTION 'Invalid status: must be pending, reviewing, approved, or declined';
  END IF;

  UPDATE public.crm_leader_applications
  SET
    status = p_status,
    review_notes = COALESCE(p_review_notes, review_notes),
    reviewed_by = auth.uid(),
    reviewed_at = now()
  WHERE id = p_application_id
  RETURNING * INTO result;

  IF result.id IS NULL THEN RAISE EXCEPTION 'Application not found'; END IF;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_review_leader_application(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_review_leader_application(UUID, TEXT, TEXT) TO authenticated;
