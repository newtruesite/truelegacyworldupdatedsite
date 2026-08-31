-- Migration: 20260831140000_allow_phone_only_leads.sql
-- Description: Allow leads to be created with either an email address OR a phone number.

-- 1. Drop NOT NULL constraint on email column in crm_leads
ALTER TABLE public.crm_leads ALTER COLUMN email DROP NOT NULL;

-- 2. Drop old check constraints on email if present
ALTER TABLE public.crm_leads DROP CONSTRAINT IF EXISTS crm_leads_email_check;
ALTER TABLE public.crm_leads DROP CONSTRAINT IF EXISTS crm_leads_contact_info_check;

-- 3. Add updated check constraint ensuring either email or phone is present
ALTER TABLE public.crm_leads ADD CONSTRAINT crm_leads_contact_info_check
  CHECK (
    (email IS NOT NULL AND char_length(email) BETWEEN 3 AND 254) OR
    (phone IS NOT NULL AND char_length(phone) BETWEEN 5 AND 50)
  );

-- 4. Update submit_crm_application RPC to accept phone-only or email-only leads
CREATE OR REPLACE FUNCTION public.submit_crm_application(payload JSONB)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_id UUID;
  matched_distributor UUID;
  selected_distributor UUID;
  attribution TEXT := 'unassigned';
  raw_email TEXT := nullif(trim(COALESCE(payload ->> 'email', '')), '');
  normalized_email TEXT := CASE WHEN raw_email IS NOT NULL THEN lower(raw_email) ELSE NULL END;
  raw_phone TEXT := nullif(trim(COALESCE(payload ->> 'phone', '')), '');
  interest_value TEXT := COALESCE(payload ->> 'interest', '');
  locale_value TEXT := COALESCE(payload ->> 'locale', 'en');
  has_referrer_value BOOLEAN := COALESCE((payload ->> 'hasReferrer')::BOOLEAN, false);
  referral_value TEXT := lower(trim(COALESCE(payload ->> 'referralCode', '')));
  selected_slug TEXT := lower(trim(COALESCE(payload ->> 'selectedDistributor', '')));
BEGIN
  IF COALESCE(payload ->> 'website', '') <> '' THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;
  IF char_length(trim(COALESCE(payload ->> 'fullName', ''))) NOT BETWEEN 2 AND 160 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  
  -- Require either a valid email address OR a phone number
  IF normalized_email IS NULL AND raw_phone IS NULL THEN
    RAISE EXCEPTION 'Either email or phone number is required';
  END IF;

  IF normalized_email IS NOT NULL AND normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;

  IF raw_phone IS NOT NULL AND char_length(raw_phone) NOT BETWEEN 5 AND 50 THEN
    RAISE EXCEPTION 'Invalid phone number';
  END IF;

  IF char_length(trim(COALESCE(payload ->> 'country', ''))) NOT BETWEEN 2 AND 100 THEN RAISE EXCEPTION 'Invalid country'; END IF;
  IF interest_value NOT IN ('product', 'duo', 'distributor', 'training', 'events') THEN RAISE EXCEPTION 'Invalid interest'; END IF;
  IF locale_value NOT IN ('en', 'es', 'fr', 'pt') THEN locale_value := 'en'; END IF;
  IF COALESCE((payload ->> 'consent')::BOOLEAN, false) IS NOT TRUE THEN RAISE EXCEPTION 'Consent required'; END IF;

  IF referral_value <> '' THEN
    SELECT id INTO matched_distributor FROM public.crm_distributors
    WHERE active AND (referral_code = referral_value OR slug = referral_value)
    LIMIT 1;
  END IF;

  IF selected_slug <> '' THEN
    SELECT id INTO selected_distributor FROM public.crm_distributors
    WHERE active AND accepting_leads AND slug = selected_slug
    LIMIT 1;
  END IF;

  IF matched_distributor IS NOT NULL THEN
    attribution := 'referral_link';
  ELSIF has_referrer_value AND nullif(trim(COALESCE(payload ->> 'referredBy', '')), '') IS NOT NULL THEN
    attribution := 'named_referrer';
  ELSIF NOT has_referrer_value AND selected_distributor IS NOT NULL THEN
    matched_distributor := selected_distributor;
    attribution := 'visitor_selected';
  END IF;

  INSERT INTO public.crm_leads (
    full_name, email, phone, country, interest, has_referrer, referrer_name,
    referral_code, selected_distributor_id, assigned_distributor_id,
    attribution_method, locale, source_path, consent, consent_at, privacy_version
  ) VALUES (
    trim(payload ->> 'fullName'), normalized_email, raw_phone, trim(payload ->> 'country'),
    interest_value, has_referrer_value, nullif(trim(COALESCE(payload ->> 'referredBy', '')), ''),
    nullif(referral_value, ''), selected_distributor, matched_distributor,
    attribution, locale_value, left(COALESCE(payload ->> 'sourcePath', '/apply'), 300),
    true, now(), COALESCE(nullif(payload ->> 'privacyVersion', ''), '2026-08-phase-1')
  ) RETURNING id INTO new_id;

  INSERT INTO public.crm_lead_activity (lead_id, activity_type, details)
  VALUES (new_id, 'created', jsonb_build_object('attribution', attribution));

  IF matched_distributor IS NOT NULL THEN
    INSERT INTO public.crm_assignment_history (lead_id, to_distributor_id)
    VALUES (new_id, matched_distributor);
  END IF;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_crm_application(JSONB) TO anon, authenticated;
