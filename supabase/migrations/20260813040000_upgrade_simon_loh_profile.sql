-- Upgrade Simon Loh's public profile, routing markets, languages, and contact details.

UPDATE public.crm_distributors
SET
  display_name = 'Simon Loh',
  referral_code = 'simon-loh',
  login_email = 'symenloh@gmail.com',
  bio = $bio$Accountant by training, entrepreneur by life. Simon escaped the rat race in 2016 and built his Enagic business across international markets. Today, he travels the world sharing his experience and training entrepreneurs to pursue financial freedom through Enagic and the True Legacy community.$bio$,
  avatar_url = '/leaders/standardized/simon-loh.png',
  regions = ARRAY['Malaysia', 'India', 'UAE', 'Türkiye', 'Nigeria', 'Kazakhstan', 'USA', 'Canada'],
  languages = ARRAY['en', 'zh', 'yue', 'ms'],
  phone = '+60126612042',
  active = true,
  accepting_leads = true,
  updated_at = now()
WHERE slug = 'simon-loh';
