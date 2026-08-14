-- Add Jesse Schexnayder with his confirmed contact and referral details.

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
  'jesse-schexnayder',
  'jesse-hotshotz',
  'Jesse Schexnayder',
  'jesse@hotshotzpromo.com',
  'True Legacy Distributor',
  'You could say I am a serial entrepreneur. Most know me for my latest venture, HotShotz Reusable Heat Packs. I have a love for life and the universe, and I’m the CEO of Let’s Go!!',
  '/leaders/standardized/jesse-schexnayder.png',
  ARRAY['USA'],
  ARRAY['en'],
  '+1 (916) 214-6943',
  NULL,
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
