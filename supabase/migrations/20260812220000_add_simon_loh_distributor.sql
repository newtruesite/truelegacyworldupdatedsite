-- Add Simon Loh to the True Legacy distributor directory and CRM routing.

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
  'simon-loh',
  'simon-loh',
  'Simon Loh',
  'symenloh@gmail.com',
  'True Legacy Distributor',
  $bio$I’m a global entrepreneur who has spent the last several years building and scaling businesses across multiple international markets. Since 2016, I’ve had the opportunity to work with and support more than 10,000 entrepreneurs, generate over $30 million in sales volume, and help expand operations in countries including Malaysia, India, the United Arab Emirates, Turkey, and Nigeria.

My focus is on helping people move beyond traditional career limitations by applying practical, disciplined, and proven business strategies. Through speaking, mentoring, and direct collaboration, I work with individuals who want to build more intentional, flexible, and sustainable professional lives.$bio$,
  NULL,
  ARRAY['Malaysia'],
  ARRAY['en'],
  '+60 12-661 2042',
  'https://www.instagram.com/simonloh_/',
  true,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  referral_code = EXCLUDED.referral_code,
  display_name = EXCLUDED.display_name,
  login_email = EXCLUDED.login_email,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  regions = EXCLUDED.regions,
  languages = EXCLUDED.languages,
  phone = EXCLUDED.phone,
  instagram_url = EXCLUDED.instagram_url,
  active = EXCLUDED.active,
  accepting_leads = EXCLUDED.accepting_leads,
  updated_at = now();
