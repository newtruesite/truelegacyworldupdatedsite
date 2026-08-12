-- True Legacy World team CRM foundation.
-- Public applications enter through a validated RPC. CRM data stays behind RLS.

CREATE TABLE public.crm_admin_allowlist (
  email TEXT PRIMARY KEY CHECK (email = lower(email)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.crm_admin_allowlist (email) VALUES
  ('truelegacyworld@proton.me'),
  ('truelegacyworld@gmail.com')
ON CONFLICT DO NOTHING;

CREATE TABLE public.crm_distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  referral_code TEXT NOT NULL UNIQUE CHECK (referral_code = lower(referral_code)),
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 120),
  login_email TEXT UNIQUE CHECK (login_email IS NULL OR login_email = lower(login_email)),
  title TEXT NOT NULL DEFAULT 'True Legacy Distributor',
  bio TEXT,
  avatar_url TEXT,
  regions TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT ARRAY['en']::TEXT[],
  active BOOLEAN NOT NULL DEFAULT true,
  accepting_leads BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.crm_distributors
  (slug, referral_code, display_name, title, bio, avatar_url, regions, languages)
VALUES
  ('mehdi-cohen', 'mehdi-cohen', 'Mehdi Cohen', 'True Legacy World', 'Global and LATAM product education, leadership, and team support.', '/leaders/mehdi-hero.png', ARRAY['Global', 'LATAM'], ARRAY['en', 'es', 'fr']),
  ('ryan-pool', 'ryan-pool', 'Ryan Pool', 'True Legacy Leader', 'Global product education, leadership, and team support.', '/leaders/ryan-hero.png', ARRAY['Global'], ARRAY['en'])
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE public.crm_memberships (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'distributor')),
  distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((role = 'admin') OR (role = 'distributor' AND distributor_id IS NOT NULL))
);

CREATE TABLE public.crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 160),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) BETWEEN 5 AND 50),
  country TEXT NOT NULL CHECK (char_length(country) BETWEEN 2 AND 100),
  interest TEXT NOT NULL CHECK (interest IN ('product', 'duo', 'distributor', 'training', 'events')),
  has_referrer BOOLEAN NOT NULL,
  referrer_name TEXT CHECK (referrer_name IS NULL OR char_length(referrer_name) <= 160),
  referral_code TEXT CHECK (referral_code IS NULL OR char_length(referral_code) <= 100),
  selected_distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  assigned_distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  attribution_method TEXT NOT NULL CHECK (attribution_method IN ('referral_link', 'named_referrer', 'visitor_selected', 'unassigned')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'nurturing', 'converted', 'closed')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'es', 'fr', 'pt')),
  source_path TEXT NOT NULL DEFAULT '/apply' CHECK (char_length(source_path) <= 300),
  consent BOOLEAN NOT NULL,
  consent_at TIMESTAMPTZ NOT NULL,
  privacy_version TEXT NOT NULL DEFAULT '2026-08-phase-1',
  next_follow_up_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX crm_leads_submitted_at_idx ON public.crm_leads (submitted_at DESC);
CREATE INDEX crm_leads_email_idx ON public.crm_leads (lower(email));
CREATE INDEX crm_leads_assigned_idx ON public.crm_leads (assigned_distributor_id, status, submitted_at DESC);

CREATE TABLE public.crm_lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 3000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX crm_lead_notes_lead_idx ON public.crm_lead_notes (lead_id, created_at DESC);

CREATE TABLE public.crm_lead_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('created', 'status_changed', 'assigned', 'note_added')),
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX crm_lead_activity_lead_idx ON public.crm_lead_activity (lead_id, created_at DESC);

CREATE TABLE public.crm_assignment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  from_distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  to_distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.crm_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.crm_settings (key, value)
VALUES ('lead_notifications', '{"email":"truelegacyworld@proton.me","enabled":false}'::JSONB)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.crm_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_distributors_updated_at
BEFORE UPDATE ON public.crm_distributors
FOR EACH ROW EXECUTE FUNCTION public.crm_set_updated_at();

CREATE TRIGGER crm_leads_updated_at
BEFORE UPDATE ON public.crm_leads
FOR EACH ROW EXECUTE FUNCTION public.crm_set_updated_at();

CREATE OR REPLACE FUNCTION public.crm_is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.crm_memberships
    WHERE user_id = auth.uid() AND role = 'admin' AND active
  );
$$;

CREATE OR REPLACE FUNCTION public.crm_current_distributor_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT distributor_id FROM public.crm_memberships
  WHERE user_id = auth.uid() AND role = 'distributor' AND active
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.crm_can_access_lead(p_lead_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.crm_is_admin() OR EXISTS (
    SELECT 1 FROM public.crm_leads
    WHERE id = p_lead_id
      AND assigned_distributor_id = public.crm_current_distributor_id()
      AND deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.crm_sync_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  normalized_email TEXT := lower(COALESCE(NEW.email, ''));
  matched_distributor UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM public.crm_admin_allowlist WHERE email = normalized_email) THEN
    INSERT INTO public.crm_memberships (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin', distributor_id = NULL, active = true;
    RETURN NEW;
  END IF;

  SELECT id INTO matched_distributor
  FROM public.crm_distributors
  WHERE login_email = normalized_email AND active
  LIMIT 1;

  IF matched_distributor IS NOT NULL THEN
    UPDATE public.crm_distributors SET auth_user_id = NEW.id WHERE id = matched_distributor;
    INSERT INTO public.crm_memberships (user_id, role, distributor_id)
    VALUES (NEW.id, 'distributor', matched_distributor)
    ON CONFLICT (user_id) DO UPDATE SET role = 'distributor', distributor_id = matched_distributor, active = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.crm_sync_new_user();

INSERT INTO public.crm_memberships (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE lower(email) IN (SELECT email FROM public.crm_admin_allowlist)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', distributor_id = NULL, active = true;

CREATE OR REPLACE FUNCTION public.get_public_crm_distributors()
RETURNS TABLE (
  id UUID,
  slug TEXT,
  referral_code TEXT,
  display_name TEXT,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  regions TEXT[],
  languages TEXT[]
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT d.id, d.slug, d.referral_code, d.display_name, d.title, d.bio, d.avatar_url, d.regions, d.languages
  FROM public.crm_distributors d
  WHERE d.active AND d.accepting_leads
  ORDER BY d.display_name;
$$;

CREATE OR REPLACE FUNCTION public.submit_crm_application(payload JSONB)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_id UUID;
  matched_distributor UUID;
  selected_distributor UUID;
  attribution TEXT := 'unassigned';
  normalized_email TEXT := lower(trim(COALESCE(payload ->> 'email', '')));
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
  IF normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN RAISE EXCEPTION 'Invalid email'; END IF;
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
    trim(payload ->> 'fullName'), normalized_email,
    nullif(trim(COALESCE(payload ->> 'phone', '')), ''), trim(payload ->> 'country'),
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

CREATE OR REPLACE FUNCTION public.crm_update_lead_status(p_lead_id UUID, p_status TEXT, p_next_follow_up_at TIMESTAMPTZ DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE old_status TEXT;
BEGIN
  IF NOT public.crm_can_access_lead(p_lead_id) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF p_status NOT IN ('new', 'contacted', 'qualified', 'nurturing', 'converted', 'closed') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  SELECT status INTO old_status FROM public.crm_leads WHERE id = p_lead_id FOR UPDATE;
  UPDATE public.crm_leads SET status = p_status, next_follow_up_at = p_next_follow_up_at WHERE id = p_lead_id;
  IF old_status IS DISTINCT FROM p_status THEN
    INSERT INTO public.crm_lead_activity (lead_id, actor_user_id, activity_type, details)
    VALUES (p_lead_id, auth.uid(), 'status_changed', jsonb_build_object('from', old_status, 'to', p_status));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.crm_assign_lead(p_lead_id UUID, p_distributor_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE old_distributor UUID;
BEGIN
  IF NOT public.crm_is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF p_distributor_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.crm_distributors WHERE id = p_distributor_id AND active) THEN RAISE EXCEPTION 'Invalid distributor'; END IF;
  SELECT assigned_distributor_id INTO old_distributor FROM public.crm_leads WHERE id = p_lead_id FOR UPDATE;
  UPDATE public.crm_leads SET assigned_distributor_id = p_distributor_id WHERE id = p_lead_id;
  INSERT INTO public.crm_assignment_history (lead_id, from_distributor_id, to_distributor_id, assigned_by)
  VALUES (p_lead_id, old_distributor, p_distributor_id, auth.uid());
  INSERT INTO public.crm_lead_activity (lead_id, actor_user_id, activity_type, details)
  VALUES (p_lead_id, auth.uid(), 'assigned', jsonb_build_object('from', old_distributor, 'to', p_distributor_id));
END;
$$;

CREATE OR REPLACE FUNCTION public.crm_add_lead_note(p_lead_id UUID, p_body TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE new_note_id UUID;
BEGIN
  IF NOT public.crm_can_access_lead(p_lead_id) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF char_length(trim(p_body)) NOT BETWEEN 1 AND 3000 THEN RAISE EXCEPTION 'Invalid note'; END IF;
  INSERT INTO public.crm_lead_notes (lead_id, author_user_id, body)
  VALUES (p_lead_id, auth.uid(), trim(p_body)) RETURNING id INTO new_note_id;
  INSERT INTO public.crm_lead_activity (lead_id, actor_user_id, activity_type)
  VALUES (p_lead_id, auth.uid(), 'note_added');
  RETURN new_note_id;
END;
$$;

ALTER TABLE public.crm_admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_assignment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM admins manage distributor profiles" ON public.crm_distributors FOR ALL TO authenticated USING (public.crm_is_admin()) WITH CHECK (public.crm_is_admin());
CREATE POLICY "CRM members view distributor profiles" ON public.crm_distributors FOR SELECT TO authenticated USING (active OR public.crm_is_admin());
CREATE POLICY "CRM members view their membership" ON public.crm_memberships FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.crm_is_admin());
CREATE POLICY "CRM members view permitted leads" ON public.crm_leads FOR SELECT TO authenticated USING (deleted_at IS NULL AND (public.crm_is_admin() OR assigned_distributor_id = public.crm_current_distributor_id()));
CREATE POLICY "CRM members view permitted notes" ON public.crm_lead_notes FOR SELECT TO authenticated USING (public.crm_can_access_lead(lead_id));
CREATE POLICY "CRM members view permitted activity" ON public.crm_lead_activity FOR SELECT TO authenticated USING (public.crm_can_access_lead(lead_id));
CREATE POLICY "CRM admins view assignments" ON public.crm_assignment_history FOR SELECT TO authenticated USING (public.crm_is_admin());
CREATE POLICY "CRM admins manage settings" ON public.crm_settings FOR ALL TO authenticated USING (public.crm_is_admin()) WITH CHECK (public.crm_is_admin());
CREATE POLICY "CRM admins view allowlist" ON public.crm_admin_allowlist FOR SELECT TO authenticated USING (public.crm_is_admin());

REVOKE ALL ON public.crm_admin_allowlist, public.crm_distributors, public.crm_memberships, public.crm_leads, public.crm_lead_notes, public.crm_lead_activity, public.crm_assignment_history, public.crm_settings FROM anon;
GRANT SELECT ON public.crm_distributors, public.crm_memberships, public.crm_leads, public.crm_lead_notes, public.crm_lead_activity, public.crm_assignment_history, public.crm_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.crm_distributors, public.crm_settings TO authenticated;

REVOKE ALL ON FUNCTION public.get_public_crm_distributors() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_crm_application(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_update_lead_status(UUID, TEXT, TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_assign_lead(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_add_lead_note(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_crm_distributors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_crm_application(JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_update_lead_status(UUID, TEXT, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_assign_lead(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_add_lead_note(UUID, TEXT) TO authenticated;

