-- Add Emanuela Doustova with the confirmed profile details available today.

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
  'emanuela-doustova',
  'emanuela-doustova',
  'Emanuela Doustova',
  'immanueladoustova@gmail.com',
  'True Legacy Distributor',
  'Profile details coming soon.',
  '/leaders/emanuela-doustova.jpg',
  ARRAY['USA'],
  ARRAY['en'],
  '+1 (818) 858-8585',
  'https://www.instagram.com/emanuelabraj/',
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
