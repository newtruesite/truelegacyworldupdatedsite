-- Migration: Add custom application settings to crm_distributors

ALTER TABLE public.crm_distributors
ADD COLUMN IF NOT EXISTS application_settings JSONB DEFAULT '{}'::jsonb;

-- Update get_public_crm_distributors to include application_settings
DROP FUNCTION IF EXISTS public.get_public_crm_distributors();

CREATE OR REPLACE FUNCTION public.get_public_crm_distributors()
RETURNS TABLE (
  id UUID,
  slug TEXT,
  referral_code TEXT,
  display_name TEXT,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  regions TEXT[],
  languages TEXT[],
  application_settings JSONB
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$
  SELECT 
    d.id, 
    d.slug, 
    d.referral_code, 
    d.display_name, 
    d.title, 
    d.bio, 
    d.avatar_url, 
    d.regions, 
    d.languages,
    COALESCE(d.application_settings, '{}'::jsonb) AS application_settings
  FROM public.crm_distributors d
  WHERE d.active AND d.accepting_leads
  ORDER BY d.display_name;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_crm_distributors() TO anon, authenticated;

-- Update crm_update_distributor_profile to accept and save applicationSettings
CREATE OR REPLACE FUNCTION public.crm_update_distributor_profile(
  p_distributor_id UUID,
  p_payload JSONB
)
RETURNS public.crm_distributors
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  result public.crm_distributors;
  normalized_name TEXT := trim(COALESCE(p_payload ->> 'displayName', ''));
  normalized_title TEXT := trim(COALESCE(p_payload ->> 'title', ''));
  normalized_bio TEXT := trim(COALESCE(p_payload ->> 'bio', ''));
  normalized_phone TEXT := nullif(trim(COALESCE(p_payload ->> 'phone', '')), '');
  normalized_instagram TEXT := nullif(trim(COALESCE(p_payload ->> 'instagramUrl', '')), '');
  normalized_avatar TEXT := nullif(trim(COALESCE(p_payload ->> 'avatarUrl', '')), '');
  normalized_regions TEXT[] := ARRAY(SELECT trim(value) FROM jsonb_array_elements_text(COALESCE(p_payload -> 'regions', '[]'::jsonb)) value WHERE trim(value) <> '' LIMIT 20);
  normalized_languages TEXT[] := ARRAY(SELECT lower(trim(value)) FROM jsonb_array_elements_text(COALESCE(p_payload -> 'languages', '[]'::jsonb)) value WHERE lower(trim(value)) IN ('en','es','fr','pt','zh','yue','ms','ar','ru') LIMIT 12);
  normalized_app_settings JSONB := COALESCE(p_payload -> 'applicationSettings', '{}'::jsonb);
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
      avatar_url = COALESCE(normalized_avatar, avatar_url),
      regions = normalized_regions,
      languages = normalized_languages,
      accepting_leads = COALESCE((p_payload ->> 'acceptingLeads')::BOOLEAN, accepting_leads),
      application_settings = COALESCE(normalized_app_settings, application_settings, '{}'::jsonb)
  WHERE id = p_distributor_id
  RETURNING * INTO result;

  IF result.id IS NULL THEN RAISE EXCEPTION 'Distributor not found'; END IF;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.crm_update_distributor_profile(UUID, JSONB) TO authenticated;
