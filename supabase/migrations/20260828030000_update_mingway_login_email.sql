-- Migration: Update Ming-Way Sia Login Email to elle26@gmail.com
-- Synchronizes auth.users, auth.identities, public.crm_distributors, and public.crm_memberships.

DO $$
DECLARE
  v_user_id UUID;
  v_dist_id UUID;
  v_new_email TEXT := 'elle26@gmail.com';
  v_old_email TEXT := 'mingwaysia@gmail.com';
  v_password TEXT := 'TrueLegacy2026!';
  v_hashed TEXT;
BEGIN
  v_hashed := extensions.crypt(v_password, extensions.gen_salt('bf'));

  -- 1. Get distributor ID for Ming-Way Sia
  SELECT id INTO v_dist_id FROM public.crm_distributors WHERE slug = 'ming-way-sia';

  -- 2. Check if auth.users exists with new or old email
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(v_new_email);

  IF v_user_id IS NULL THEN
    -- Check if old email existed to update
    SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(v_old_email);

    IF v_user_id IS NOT NULL THEN
      -- Update existing user email to new email
      UPDATE auth.users
      SET
        email = lower(v_new_email),
        encrypted_password = v_hashed,
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{name}', '"Ming-Way Sia"'),
        updated_at = now()
      WHERE id = v_user_id;

      UPDATE auth.identities
      SET
        provider_id = lower(v_new_email),
        identity_data = jsonb_build_object('sub', v_user_id::text, 'email', lower(v_new_email)),
        updated_at = now()
      WHERE user_id = v_user_id;
    ELSE
      -- Create brand new user in auth.users
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
        lower(v_new_email),
        v_hashed,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('name', 'Ming-Way Sia'),
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
        jsonb_build_object('sub', v_user_id::text, 'email', lower(v_new_email)),
        'email',
        lower(v_new_email),
        now(),
        now(),
        now()
      );
    END IF;
  ELSE
    -- User already exists with new email, update password and confirmation
    UPDATE auth.users
    SET
      encrypted_password = v_hashed,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{name}', '"Ming-Way Sia"'),
      updated_at = now()
    WHERE id = v_user_id;
  END IF;

  -- 3. Link distributor record to auth_user_id & login_email
  IF v_dist_id IS NOT NULL AND v_user_id IS NOT NULL THEN
    UPDATE public.crm_distributors
    SET
      auth_user_id = v_user_id,
      login_email = lower(v_new_email),
      active = true,
      accepting_leads = true,
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
  END IF;
END $$;
