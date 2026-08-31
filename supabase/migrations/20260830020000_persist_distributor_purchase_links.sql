-- Persist distributor-owned direct product purchase links.

ALTER TABLE public.crm_distributors
ADD COLUMN IF NOT EXISTS purchase_links JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.crm_distributors
DROP CONSTRAINT IF EXISTS crm_distributors_purchase_links_object;

ALTER TABLE public.crm_distributors
ADD CONSTRAINT crm_distributors_purchase_links_object
CHECK (jsonb_typeof(purchase_links) = 'object');

-- Purchase links are intentionally returned with the public distributor profile:
-- public product pages need them to render the distributor's direct-buy buttons.
DROP FUNCTION IF EXISTS public.get_public_crm_distributors();

CREATE FUNCTION public.get_public_crm_distributors()
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
  phone TEXT,
  instagram_url TEXT,
  purchase_links JSONB
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
    d.phone,
    d.instagram_url,
    COALESCE(d.purchase_links, '{}'::jsonb)
  FROM public.crm_distributors d
  WHERE d.active AND d.accepting_leads
  ORDER BY d.display_name;
$$;

REVOKE ALL ON FUNCTION public.get_public_crm_distributors() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_crm_distributors() TO anon, authenticated;

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
  normalized_purchase_links JSONB := COALESCE(p_payload -> 'purchaseLinks', '{}'::jsonb);
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
  IF jsonb_typeof(normalized_purchase_links) <> 'object' THEN RAISE EXCEPTION 'Invalid purchase links'; END IF;
  IF (SELECT count(*) FROM jsonb_object_keys(normalized_purchase_links)) > 50 THEN RAISE EXCEPTION 'Too many purchase links'; END IF;
  IF EXISTS (
    SELECT 1
    FROM jsonb_each(normalized_purchase_links) link
    WHERE char_length(link.key) NOT BETWEEN 1 AND 80
       OR jsonb_typeof(link.value) <> 'string'
       OR char_length(trim(link.value #>> '{}')) > 2000
       OR trim(link.value #>> '{}') !~ '^https?://[^[:space:]]+$'
  ) THEN RAISE EXCEPTION 'Invalid purchase link URL'; END IF;

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
      purchase_links = normalized_purchase_links
  WHERE id = p_distributor_id
  RETURNING * INTO result;

  IF result.id IS NULL THEN RAISE EXCEPTION 'Distributor not found'; END IF;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_update_distributor_profile(UUID, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_update_distributor_profile(UUID, JSONB) TO authenticated;
