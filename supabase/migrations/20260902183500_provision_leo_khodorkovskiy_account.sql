-- Provision / Update Leo Khodorkovskiy account with login email Lkhod1987@gmail.com
-- Sets up public.crm_distributors, auth.users, auth.identities, and public.crm_memberships.

DO $$
DECLARE
  v_user_id UUID;
  v_dist_id UUID;
  v_email TEXT := 'lkhod1987@gmail.com';
  v_slug TEXT := 'leo-khodorkovskiy';
  v_name TEXT := 'Leo Khodorkovskiy';
  v_title TEXT := 'True Legacy 1A Leader';
  v_password TEXT := 'TrueLegacy2026!';
  v_hashed TEXT;
BEGIN
  v_hashed := extensions.crypt(v_password, extensions.gen_salt('bf'));

  -- 1. Ensure distributor profile exists in public.crm_distributors
  INSERT INTO public.crm_distributors (
    slug,
    referral_code,
    display_name,
    title,
    bio,
    avatar_url,
    regions,
    languages,
    login_email,
    active,
    accepting_leads
  ) VALUES (
    v_slug,
    v_slug,
    v_name,
    v_title,
    'Leo is a dedicated True Legacy leader building international business with purpose and impact.',
    '/leaders/standardized/leo-khodorkovskiy.png',
    ARRAY['Global', 'USA'],
    ARRAY['en', 'ru'],
    lower(v_email),
    true,
    true
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    display_name = EXCLUDED.display_name,
    title = EXCLUDED.title,
    login_email = lower(v_email),
    active = true,
    accepting_leads = true,
    updated_at = now()
  RETURNING id INTO v_dist_id;

  IF v_dist_id IS NULL THEN
    SELECT id INTO v_dist_id FROM public.crm_distributors WHERE slug = v_slug;
  END IF;

  -- 2. Check if auth.users exists with this email
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(v_email);

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      lower(v_email),
      v_hashed,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', v_name),
      now(),
      now(),
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', lower(v_email)),
      'email',
      lower(v_email),
      now(),
      now(),
      now()
    );
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = v_hashed,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{name}', to_jsonb(v_name)),
      updated_at = now()
    WHERE id = v_user_id;

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', lower(v_email)),
      'email',
      lower(v_email),
      now(),
      now(),
      now()
    )
    ON CONFLICT (provider, provider_id) DO UPDATE
    SET
      identity_data = EXCLUDED.identity_data,
      updated_at = now();
  END IF;

  -- 3. Link auth_user_id in crm_distributors and set crm_memberships
  UPDATE public.crm_distributors
  SET
    auth_user_id = v_user_id,
    login_email = lower(v_email),
    updated_at = now()
  WHERE id = v_dist_id;

  INSERT INTO public.crm_memberships (
    user_id,
    distributor_id,
    role,
    active,
    created_at
  ) VALUES (
    v_user_id,
    v_dist_id,
    'distributor',
    true,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    distributor_id = EXCLUDED.distributor_id,
    role = 'distributor',
    active = true;

END $$;
