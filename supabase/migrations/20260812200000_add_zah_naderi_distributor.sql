-- Add public contact fields and Zah Naderi to the distributor directory.

ALTER TABLE public.crm_distributors
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT;

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
  instagram_url TEXT
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT d.id, d.slug, d.referral_code, d.display_name, d.title, d.bio,
    d.avatar_url, d.regions, d.languages, d.phone, d.instagram_url
  FROM public.crm_distributors d
  WHERE d.active AND d.accepting_leads
  ORDER BY d.display_name;
$$;

REVOKE ALL ON FUNCTION public.get_public_crm_distributors() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_crm_distributors() TO anon, authenticated;

INSERT INTO public.crm_distributors (
  slug,
  referral_code,
  display_name,
  login_email,
  title,
  bio,
  avatar_url,
  regions,
  languages,
  phone,
  instagram_url,
  active,
  accepting_leads
)
VALUES (
  'zah-naderi',
  'zah-naderi',
  'Zah Naderi',
  'zahnaderi7@gmail.com',
  'True Legacy Distributor',
  $bio$For more than a decade, I've had the privilege of coaching some of the world’s top performers—elite athletes, celebrities, and C-suite executives. But what I discovered along that journey went beyond just training—it was about mastering leadership, understanding leverage, and embracing a vision that’s bigger than yourself.

I realized true, lasting impact isn't created in isolation. It comes from connecting with the right people and choosing the right vehicle. That’s what led me to Enagic—a company built on authenticity, proven systems, and sustainable growth.

Now, we have a space where like-minded leaders unite, blend their strengths, and leverage our collective expertise to build generational wealth and a lasting legacy.$bio$,
  '/leaders/zah-naderi.jpg',
  ARRAY['USA'],
  ARRAY['en'],
  '+1 (585) 319-6018',
  'https://www.instagram.com/zahphysique/',
  true,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  referral_code = EXCLUDED.referral_code,
  display_name = EXCLUDED.display_name,
  login_email = EXCLUDED.login_email,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  regions = EXCLUDED.regions,
  languages = EXCLUDED.languages,
  phone = EXCLUDED.phone,
  instagram_url = EXCLUDED.instagram_url,
  active = EXCLUDED.active,
  accepting_leads = EXCLUDED.accepting_leads,
  updated_at = now();
