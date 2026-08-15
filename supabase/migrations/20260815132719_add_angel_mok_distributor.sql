-- Add Angel Mok E Lin with her confirmed login email, markets, and referral name.

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
  'angel-mok',
  'angel',
  'Angel Mok E Lin',
  'kangenlover88@gmail.com',
  'True Legacy Distributor',
  $bio$After graduating from university, I entered the fast-paced world of equity trading and built a successful career. Yet, despite the financial success, I knew I wanted something more meaningful.

That search led me to True Legacy through Coach Simon, where I discovered a new path of entrepreneurship, purpose, and personal growth.

Today, I travel the world with my equity business AND as a global distributor for Enagic, building an international business while helping others discover new possibilities for themselves.

For me, success is no longer just about income - it’s about freedom, impact, and the legacy we leave behind.$bio$,
  '/leaders/standardized/angel-mok.png',
  ARRAY['Malaysia', 'Singapore', 'Dubai', 'Türkiye', 'Nigeria'],
  ARRAY['en'],
  NULL,
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

-- If an Auth account already exists for Angel, connect it to her distributor record.
UPDATE public.crm_distributors AS distributor
SET auth_user_id = auth_user.id,
    updated_at = now()
FROM auth.users AS auth_user
WHERE distributor.slug = 'angel-mok'
  AND lower(auth_user.email) = 'kangenlover88@gmail.com';

INSERT INTO public.crm_memberships (user_id, role, distributor_id, active)
SELECT auth_user.id, 'distributor', distributor.id, true
FROM auth.users AS auth_user
JOIN public.crm_distributors AS distributor ON distributor.slug = 'angel-mok'
WHERE lower(auth_user.email) = 'kangenlover88@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'distributor',
  distributor_id = EXCLUDED.distributor_id,
  active = true;
