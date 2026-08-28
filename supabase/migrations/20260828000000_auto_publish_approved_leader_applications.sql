-- Migration: Auto-publish approved leader applications to crm_distributors
-- When an admin approves a leader application in the CRM, this automatically
-- provisions / activates the distributor so they immediately go live in the directory.

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
  v_app public.crm_leader_applications;
  v_slug TEXT;
  v_base_slug TEXT;
  v_counter INT := 0;
  v_title TEXT;
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
  RETURNING * INTO v_app;

  IF v_app.id IS NULL THEN RAISE EXCEPTION 'Application not found'; END IF;

  -- If approved, automatically create / activate distributor record so they go live immediately
  IF p_status = 'approved' THEN
    -- Generate clean slug from full_name
    v_base_slug := lower(regexp_replace(trim(v_app.full_name), '[^a-zA-Z0-9]+', '-', 'g'));
    v_base_slug := trim(both '-' from v_base_slug);
    IF v_base_slug = '' OR v_base_slug IS NULL THEN
      v_base_slug := 'leader-' || substr(v_app.id::text, 1, 8);
    END IF;

    v_slug := v_base_slug;
    -- Handle collision if slug exists for a different email
    WHILE EXISTS (SELECT 1 FROM public.crm_distributors WHERE slug = v_slug AND login_email <> v_app.email) LOOP
      v_counter := v_counter + 1;
      v_slug := v_base_slug || '-' || v_counter;
    END LOOP;

    v_title := 'True Legacy ' || COALESCE(NULLIF(trim(v_app.current_rank), ''), '6A') || ' Leader';

    INSERT INTO public.crm_distributors (
      slug,
      referral_code,
      display_name,
      login_email,
      title,
      bio,
      regions,
      languages,
      phone,
      instagram_url,
      active,
      accepting_leads
    )
    VALUES (
      v_slug,
      v_slug,
      v_app.full_name,
      v_app.email,
      v_title,
      COALESCE(v_app.leadership_summary, 'Global product education, leadership, and team support.'),
      COALESCE(v_app.regions, ARRAY['Global']),
      COALESCE(v_app.languages, ARRAY['en']),
      v_app.phone,
      v_app.instagram_url,
      true,
      true
    )
    ON CONFLICT (slug) DO UPDATE
    SET
      display_name = EXCLUDED.display_name,
      login_email = EXCLUDED.login_email,
      title = EXCLUDED.title,
      bio = EXCLUDED.bio,
      regions = EXCLUDED.regions,
      languages = EXCLUDED.languages,
      phone = EXCLUDED.phone,
      instagram_url = EXCLUDED.instagram_url,
      active = true,
      accepting_leads = true,
      updated_at = now();
  END IF;

  RETURN v_app;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_review_leader_application(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_review_leader_application(UUID, TEXT, TEXT) TO authenticated;
