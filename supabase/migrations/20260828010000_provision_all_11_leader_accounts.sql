-- Migration: Provision/Update all 11 Leader Login Accounts in Supabase Auth
-- Sets the active working temporary password 'TrueLegacy2026!' for every leader.

DO $$
DECLARE
  r RECORD;
  v_user_id UUID;
  v_dist_id UUID;
  v_password TEXT := 'TrueLegacy2026!';
  v_hashed TEXT;
BEGIN
  v_hashed := extensions.crypt(v_password, extensions.gen_salt('bf'));

  -- List of all 11 verified leaders and their login emails
  FOR r IN (
    SELECT
      slug,
      display_name,
      CASE
        WHEN slug = 'alex-gonzalez' THEN 'photosbyalexg2541@icloud.com'
        WHEN slug = 'angel-mok' THEN 'kangenlover88@gmail.com'
        WHEN slug = 'emanuela' THEN 'immanuelladoustova@gmail.com'
        WHEN slug = 'jesse-schexnayder' THEN 'jesse@hotshotzpromo.com'
        WHEN slug = 'magaly-cardona' THEN 'magyc14@hotmail.com'
        WHEN slug = 'mehdi-cohen' THEN 'mehdicohen1@proton.me'
        WHEN slug = 'ming-way-sia' THEN 'elle26@gmail.com'
        WHEN slug = 'ryan-pool' THEN 'ryanpool9@yahoo.com'
        WHEN slug = 'simon-loh' THEN 'symenloh@gmail.com'
        WHEN slug = 'veronica-calafat' THEN 'verocalafat@yahoo.es'
        WHEN slug = 'zah-naderi' THEN 'zahnaderi7@gmail.com'
        ELSE login_email
      END as target_email
    FROM public.crm_distributors
    WHERE slug IN (
      'alex-gonzalez', 'angel-mok', 'emanuela', 'jesse-schexnayder',
      'magaly-cardona', 'mehdi-cohen', 'ming-way-sia', 'ryan-pool',
      'simon-loh', 'veronica-calafat', 'zah-naderi'
    )
  ) LOOP
    IF r.target_email IS NOT NULL AND r.target_email <> '' THEN
      -- 1. Check if auth.users exists
      SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(r.target_email);

      IF v_user_id IS NULL THEN
        -- Create user in auth.users
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
          lower(r.target_email),
          v_hashed,
          now(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          jsonb_build_object('name', r.display_name),
          now(),
          now(),
          ''
        );
      ELSE
        -- Update password and confirmation in auth.users
        UPDATE auth.users
        SET
          encrypted_password = v_hashed,
          email_confirmed_at = COALESCE(email_confirmed_at, now()),
          raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{provider}', '"email"'),
          raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{name}', to_jsonb(r.display_name)),
          updated_at = now()
        WHERE id = v_user_id;
      END IF;

      -- 2. Ensure auth.identities has email provider
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
        jsonb_build_object('sub', v_user_id::text, 'email', lower(r.target_email)),
        'email',
        lower(r.target_email),
        now(),
        now(),
        now()
      )
      ON CONFLICT (provider, provider_id) DO UPDATE
      SET
        identity_data = EXCLUDED.identity_data,
        updated_at = now();

      -- 3. Link to public.crm_distributors and public.crm_memberships
      SELECT id INTO v_dist_id FROM public.crm_distributors WHERE slug = r.slug;

      IF v_dist_id IS NOT NULL THEN
        UPDATE public.crm_distributors
        SET
          auth_user_id = v_user_id,
          login_email = lower(r.target_email),
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
          CASE WHEN r.slug = 'mehdi-cohen' THEN 'admin' ELSE 'distributor' END,
          true,
          now()
        )
        ON CONFLICT (user_id) DO UPDATE
        SET
          distributor_id = EXCLUDED.distributor_id,
          role = EXCLUDED.role,
          active = true;
      END IF;
    END IF;
  END LOOP;
END $$;
