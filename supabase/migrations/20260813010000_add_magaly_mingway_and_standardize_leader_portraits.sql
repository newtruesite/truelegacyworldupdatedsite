-- Add Magaly Cardona and Ming-Way Sia as public distributor profiles.
-- Their login and contact fields remain empty until confirmed details arrive.

INSERT INTO public.crm_distributors (
  slug, referral_code, display_name, login_email, title, bio, avatar_url,
  regions, languages, phone, instagram_url, active, accepting_leads
)
VALUES
  (
    'magaly-cardona', 'magaly-cardona', 'Magaly Cardona', NULL,
    'True Legacy Distributor',
    'Magaly helps people design work that aligns with their values—guiding leaders across the U.S. and Latin America to build intentional businesses through Enagic and community.',
    '/leaders/standardized/magaly-cardona.png',
    ARRAY['USA', 'LATAM'], ARRAY['en', 'es'], NULL, NULL, true, true
  ),
  (
    'ming-way-sia', 'ming-way-sia', 'Ming-Way Sia', NULL,
    'True Legacy Distributor',
    'Ming-Way built from the ground up alongside his father, developing discipline and resilience that he now uses to help others build responsible, legacy-focused businesses.',
    '/leaders/standardized/ming-way-sia.png',
    ARRAY['Malaysia', 'India'], ARRAY['en'], NULL, NULL, true, true
  )
ON CONFLICT (slug) DO UPDATE SET
  referral_code = EXCLUDED.referral_code,
  display_name = EXCLUDED.display_name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  regions = EXCLUDED.regions,
  languages = EXCLUDED.languages,
  active = EXCLUDED.active,
  accepting_leads = EXCLUDED.accepting_leads,
  updated_at = now();

UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/mehdi-cohen.png', updated_at = now() WHERE slug = 'mehdi-cohen';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/ryan-pool-sr.png', updated_at = now() WHERE slug = 'ryan-pool';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/simon-loh.png', updated_at = now() WHERE slug = 'simon-loh';
