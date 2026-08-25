-- Leader self-service profile settings and reviewed leader applications.

CREATE TABLE public.crm_leader_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 160),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) BETWEEN 5 AND 50),
  country TEXT NOT NULL CHECK (char_length(country) BETWEEN 2 AND 100),
  enagic_distributor_id TEXT NOT NULL CHECK (char_length(enagic_distributor_id) BETWEEN 3 AND 50),
  current_rank TEXT NOT NULL CHECK (char_length(current_rank) BETWEEN 2 AND 80),
  years_active INTEGER NOT NULL CHECK (years_active BETWEEN 0 AND 80),
  active_team_size INTEGER NOT NULL CHECK (active_team_size BETWEEN 0 AND 1000000),
  sponsor_name TEXT NOT NULL CHECK (char_length(sponsor_name) BETWEEN 2 AND 160),
  instagram_url TEXT CHECK (instagram_url IS NULL OR char_length(instagram_url) <= 300),
  regions TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT ARRAY['en']::TEXT[],
  leadership_summary TEXT NOT NULL CHECK (char_length(leadership_summary) BETWEEN 80 AND 3000),
  verified_distributor BOOLEAN NOT NULL,
  true_legacy_team_member BOOLEAN NOT NULL,
  information_accurate BOOLEAN NOT NULL,
  consent BOOLEAN NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'declined')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX crm_leader_applications_status_idx
  ON public.crm_leader_applications (status, submitted_at DESC);
CREATE INDEX crm_leader_applications_email_idx
  ON public.crm_leader_applications (lower(email));

CREATE TRIGGER crm_leader_applications_updated_at
BEFORE UPDATE ON public.crm_leader_applications
FOR EACH ROW EXECUTE FUNCTION public.crm_set_updated_at();

ALTER TABLE public.crm_leader_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM admins review leader applications"
ON public.crm_leader_applications
FOR ALL TO authenticated
USING ((SELECT public.crm_is_admin()))
WITH CHECK ((SELECT public.crm_is_admin()));

REVOKE ALL ON public.crm_leader_applications FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.crm_leader_applications TO authenticated;

CREATE OR REPLACE FUNCTION public.crm_update_distributor_profile(
  p_distributor_id UUID,
  p_payload JSONB
)
RETURNS public.crm_distributors
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.crm_distributors;
  normalized_name TEXT := trim(COALESCE(p_payload ->> 'displayName', ''));
  normalized_title TEXT := trim(COALESCE(p_payload ->> 'title', ''));
  normalized_bio TEXT := trim(COALESCE(p_payload ->> 'bio', ''));
  normalized_phone TEXT := nullif(trim(COALESCE(p_payload ->> 'phone', '')), '');
  normalized_instagram TEXT := nullif(trim(COALESCE(p_payload ->> 'instagramUrl', '')), '');
  normalized_regions TEXT[] := ARRAY(SELECT trim(value) FROM jsonb_array_elements_text(COALESCE(p_payload -> 'regions', '[]'::jsonb)) value WHERE trim(value) <> '' LIMIT 20);
  normalized_languages TEXT[] := ARRAY(SELECT lower(trim(value)) FROM jsonb_array_elements_text(COALESCE(p_payload -> 'languages', '[]'::jsonb)) value WHERE lower(trim(value)) IN ('en','es','fr','pt','zh','yue','ms','ar','ru') LIMIT 12);
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT ((SELECT public.crm_is_admin()) OR p_distributor_id = (SELECT public.crm_current_distributor_id())) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF normalized_name = '' OR char_length(normalized_name) NOT BETWEEN 2 AND 120 THEN RAISE EXCEPTION 'Invalid display name'; END IF;
  IF normalized_title = '' OR char_length(normalized_title) > 160 THEN RAISE EXCEPTION 'Invalid title'; END IF;
  IF char_length(normalized_bio) > 5000 THEN RAISE EXCEPTION 'Biography is too long'; END IF;
  IF normalized_phone IS NOT NULL AND char_length(normalized_phone) NOT BETWEEN 5 AND 50 THEN RAISE EXCEPTION 'Invalid phone'; END IF;
  IF normalized_instagram IS NOT NULL AND normalized_instagram !~ '^https://(www\.)?instagram\.com/' THEN RAISE EXCEPTION 'Invalid Instagram URL'; END IF;
  IF cardinality(normalized_regions) = 0 THEN RAISE EXCEPTION 'At least one market is required'; END IF;
  IF cardinality(normalized_languages) = 0 THEN RAISE EXCEPTION 'At least one language is required'; END IF;

  UPDATE public.crm_distributors
  SET display_name = normalized_name,
      title = normalized_title,
      bio = nullif(normalized_bio, ''),
      phone = normalized_phone,
      instagram_url = normalized_instagram,
      regions = normalized_regions,
      languages = normalized_languages,
      accepting_leads = COALESCE((p_payload ->> 'acceptingLeads')::BOOLEAN, accepting_leads)
  WHERE id = p_distributor_id
  RETURNING * INTO result;

  IF result.id IS NULL THEN RAISE EXCEPTION 'Distributor not found'; END IF;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_crm_leader_application(p_payload JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  normalized_email TEXT := lower(trim(COALESCE(p_payload ->> 'email', '')));
  normalized_phone TEXT := nullif(trim(COALESCE(p_payload ->> 'phone', '')), '');
  normalized_instagram TEXT := nullif(trim(COALESCE(p_payload ->> 'instagramUrl', '')), '');
  normalized_regions TEXT[] := ARRAY(SELECT trim(value) FROM jsonb_array_elements_text(COALESCE(p_payload -> 'regions', '[]'::jsonb)) value WHERE trim(value) <> '' LIMIT 20);
  normalized_languages TEXT[] := ARRAY(SELECT lower(trim(value)) FROM jsonb_array_elements_text(COALESCE(p_payload -> 'languages', '[]'::jsonb)) value WHERE lower(trim(value)) IN ('en','es','fr','pt','zh','yue','ms','ar','ru') LIMIT 12);
BEGIN
  IF COALESCE(p_payload ->> 'website', '') <> '' THEN RAISE EXCEPTION 'Invalid submission'; END IF;
  IF char_length(trim(COALESCE(p_payload ->> 'fullName', ''))) NOT BETWEEN 2 AND 160 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN RAISE EXCEPTION 'Invalid email'; END IF;
  IF normalized_phone IS NOT NULL AND char_length(normalized_phone) NOT BETWEEN 5 AND 50 THEN RAISE EXCEPTION 'Invalid phone'; END IF;
  IF char_length(trim(COALESCE(p_payload ->> 'country', ''))) NOT BETWEEN 2 AND 100 THEN RAISE EXCEPTION 'Invalid country'; END IF;
  IF char_length(trim(COALESCE(p_payload ->> 'distributorId', ''))) NOT BETWEEN 3 AND 50 THEN RAISE EXCEPTION 'Invalid distributor ID'; END IF;
  IF char_length(trim(COALESCE(p_payload ->> 'currentRank', ''))) NOT BETWEEN 2 AND 80 THEN RAISE EXCEPTION 'Invalid rank'; END IF;
  IF COALESCE((p_payload ->> 'yearsActive')::INTEGER, -1) NOT BETWEEN 0 AND 80 THEN RAISE EXCEPTION 'Invalid years active'; END IF;
  IF COALESCE((p_payload ->> 'activeTeamSize')::INTEGER, -1) NOT BETWEEN 0 AND 1000000 THEN RAISE EXCEPTION 'Invalid team size'; END IF;
  IF char_length(trim(COALESCE(p_payload ->> 'sponsorName', ''))) NOT BETWEEN 2 AND 160 THEN RAISE EXCEPTION 'Invalid sponsor'; END IF;
  IF normalized_instagram IS NOT NULL AND normalized_instagram !~ '^https://(www\.)?instagram\.com/' THEN RAISE EXCEPTION 'Invalid Instagram URL'; END IF;
  IF cardinality(normalized_regions) = 0 OR cardinality(normalized_languages) = 0 THEN RAISE EXCEPTION 'Markets and languages are required'; END IF;
  IF char_length(trim(COALESCE(p_payload ->> 'leadershipSummary', ''))) NOT BETWEEN 80 AND 3000 THEN RAISE EXCEPTION 'Leadership summary must be between 80 and 3000 characters'; END IF;
  IF COALESCE((p_payload ->> 'verifiedDistributor')::BOOLEAN, false) IS NOT TRUE
     OR COALESCE((p_payload ->> 'trueLegacyTeamMember')::BOOLEAN, false) IS NOT TRUE
     OR COALESCE((p_payload ->> 'informationAccurate')::BOOLEAN, false) IS NOT TRUE
     OR COALESCE((p_payload ->> 'consent')::BOOLEAN, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'Qualification confirmations are required';
  END IF;

  INSERT INTO public.crm_leader_applications (
    full_name, email, phone, country, enagic_distributor_id, current_rank,
    years_active, active_team_size, sponsor_name, instagram_url, regions,
    languages, leadership_summary, verified_distributor,
    true_legacy_team_member, information_accurate, consent
  ) VALUES (
    trim(p_payload ->> 'fullName'), normalized_email, normalized_phone,
    trim(p_payload ->> 'country'), trim(p_payload ->> 'distributorId'),
    trim(p_payload ->> 'currentRank'), (p_payload ->> 'yearsActive')::INTEGER,
    (p_payload ->> 'activeTeamSize')::INTEGER, trim(p_payload ->> 'sponsorName'),
    normalized_instagram, normalized_regions, normalized_languages,
    trim(p_payload ->> 'leadershipSummary'), true, true, true, true
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_update_distributor_profile(UUID, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_update_distributor_profile(UUID, JSONB) TO authenticated;
REVOKE ALL ON FUNCTION public.submit_crm_leader_application(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_crm_leader_application(JSONB) TO anon, authenticated;

