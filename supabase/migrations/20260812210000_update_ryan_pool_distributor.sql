-- Upgrade the existing Ryan Pool profile without changing his referral slug.

UPDATE public.crm_distributors
SET
  display_name = 'Ryan Pool Sr',
  login_email = 'ryanpool9@yahoo.com',
  title = 'True Legacy Leader',
  bio = $bio$Ryan Pool is an entrepreneur, former athlete, and community-minded leader based in Los Angeles. Passionate about health, fitness, personal development, and entrepreneurship, Ryan is focused on building businesses, connecting with like-minded people, and creating opportunities for others.

As an independent entrepreneur in the wellness space, Ryan is expanding his network and helping people discover new ways to prioritize hydration, wellness, and a healthier lifestyle. His vision goes beyond business—he wants to build a strong legacy for his family, create financial freedom, and inspire others to pursue their own goals with purpose, discipline, and consistency.$bio$,
  avatar_url = '/leaders/ryan-pool-sr.jpg',
  regions = ARRAY['USA'],
  languages = ARRAY['en'],
  phone = '213-733-6286',
  instagram_url = 'https://www.instagram.com/ryanpoolsr/',
  active = true,
  accepting_leads = true,
  updated_at = now()
WHERE slug = 'ryan-pool';
