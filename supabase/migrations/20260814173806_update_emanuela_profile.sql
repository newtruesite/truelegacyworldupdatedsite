-- Correct Emanuela's authorized email and shorten her public referral URL.
UPDATE public.crm_distributors
SET
  slug = 'emanuela',
  referral_code = 'emanuela',
  login_email = 'immanuelladoustova@gmail.com',
  updated_at = now()
WHERE slug = 'emanuela-doustova'
   OR lower(login_email) = 'immanueladoustova@gmail.com';
