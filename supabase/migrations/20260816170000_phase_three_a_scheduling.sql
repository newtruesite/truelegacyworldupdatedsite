-- Phase 3A: secure distributor scheduling, public booking links, and CRM-linked meetings.

CREATE TABLE public.crm_booking_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL REFERENCES public.crm_distributors(id) ON DELETE CASCADE,
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 100),
  description TEXT NOT NULL DEFAULT '' CHECK (char_length(description) <= 500),
  duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (duration_minutes BETWEEN 15 AND 120),
  buffer_minutes INTEGER NOT NULL DEFAULT 15 CHECK (buffer_minutes BETWEEN 0 AND 60),
  location_mode TEXT NOT NULL DEFAULT 'video' CHECK (location_mode IN ('video', 'phone')),
  timezone TEXT NOT NULL DEFAULT 'America/New_York' CHECK (char_length(timezone) BETWEEN 3 AND 100),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (distributor_id, slug)
);

CREATE TABLE public.crm_availability_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL REFERENCES public.crm_distributors(id) ON DELETE CASCADE,
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (start_time < end_time),
  UNIQUE (distributor_id, weekday, start_time, end_time)
);

CREATE TABLE public.crm_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_type_id UUID NOT NULL REFERENCES public.crm_booking_types(id) ON DELETE RESTRICT,
  distributor_id UUID NOT NULL REFERENCES public.crm_distributors(id) ON DELETE RESTRICT,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL CHECK (char_length(guest_name) BETWEEN 2 AND 160),
  guest_email TEXT NOT NULL CHECK (char_length(guest_email) BETWEEN 3 AND 254),
  guest_phone TEXT CHECK (guest_phone IS NULL OR char_length(guest_phone) BETWEEN 5 AND 50),
  guest_timezone TEXT NOT NULL CHECK (char_length(guest_timezone) BETWEEN 3 AND 100),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 1000),
  source TEXT NOT NULL DEFAULT 'booking_page' CHECK (char_length(source) <= 80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (starts_at < ends_at)
);

CREATE UNIQUE INDEX crm_meetings_active_start_idx
  ON public.crm_meetings (distributor_id, starts_at)
  WHERE status = 'scheduled';
CREATE INDEX crm_booking_types_distributor_idx ON public.crm_booking_types (distributor_id, active);
CREATE INDEX crm_availability_distributor_idx ON public.crm_availability_windows (distributor_id, weekday, active);
CREATE INDEX crm_meetings_distributor_time_idx ON public.crm_meetings (distributor_id, starts_at DESC);
CREATE INDEX crm_meetings_lead_idx ON public.crm_meetings (lead_id) WHERE lead_id IS NOT NULL;

CREATE TRIGGER crm_booking_types_updated_at BEFORE UPDATE ON public.crm_booking_types
FOR EACH ROW EXECUTE FUNCTION public.crm_set_updated_at();
CREATE TRIGGER crm_meetings_updated_at BEFORE UPDATE ON public.crm_meetings
FOR EACH ROW EXECUTE FUNCTION public.crm_set_updated_at();

INSERT INTO public.crm_booking_types (distributor_id, slug, title, description, duration_minutes, buffer_minutes, timezone)
SELECT id, 'discovery-call', 'True Legacy Discovery Call', 'A focused conversation about your goals and the best next step for you.', 30, 15, 'America/New_York'
FROM public.crm_distributors WHERE active
ON CONFLICT (distributor_id, slug) DO NOTHING;

INSERT INTO public.crm_availability_windows (distributor_id, weekday, start_time, end_time)
SELECT d.id, day_number, '09:00'::TIME, '17:00'::TIME
FROM public.crm_distributors d CROSS JOIN generate_series(1, 5) AS day_number
WHERE d.active
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.crm_get_booking_page(p_distributor_slug TEXT, p_booking_slug TEXT DEFAULT 'discovery-call')
RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'distributor', jsonb_build_object('slug', d.slug, 'name', d.display_name, 'title', d.title, 'avatarUrl', d.avatar_url),
    'bookingType', jsonb_build_object('slug', b.slug, 'title', b.title, 'description', b.description, 'durationMinutes', b.duration_minutes, 'locationMode', b.location_mode, 'timezone', b.timezone)
  )
  FROM public.crm_booking_types b
  JOIN public.crm_distributors d ON d.id = b.distributor_id
  WHERE d.slug = lower(trim(p_distributor_slug)) AND d.active AND b.slug = lower(trim(p_booking_slug)) AND b.active
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.crm_get_booking_slots(p_distributor_slug TEXT, p_booking_slug TEXT, p_date DATE)
RETURNS TABLE (starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH config AS (
    SELECT b.distributor_id, b.duration_minutes, b.buffer_minutes, b.timezone
    FROM public.crm_booking_types b JOIN public.crm_distributors d ON d.id = b.distributor_id
    WHERE d.slug = lower(trim(p_distributor_slug)) AND d.active AND b.slug = lower(trim(p_booking_slug)) AND b.active
    LIMIT 1
  ), candidates AS (
    SELECT c.distributor_id, c.buffer_minutes,
      slot_start AS starts_at,
      slot_start + make_interval(mins => c.duration_minutes) AS ends_at
    FROM config c
    JOIN public.crm_availability_windows w ON w.distributor_id = c.distributor_id AND w.active
      AND w.weekday = EXTRACT(DOW FROM p_date)::SMALLINT
    CROSS JOIN LATERAL generate_series(
      (p_date + w.start_time) AT TIME ZONE c.timezone,
      ((p_date + w.end_time) AT TIME ZONE c.timezone) - make_interval(mins => c.duration_minutes),
      make_interval(mins => c.duration_minutes + c.buffer_minutes)
    ) AS slot_start
  )
  SELECT c.starts_at, c.ends_at FROM candidates c
  WHERE c.starts_at > now() + interval '2 hours'
    AND c.starts_at < now() + interval '61 days'
    AND NOT EXISTS (
      SELECT 1 FROM public.crm_meetings m
      WHERE m.distributor_id = c.distributor_id AND m.status = 'scheduled'
        AND tstzrange(m.starts_at, m.ends_at + make_interval(mins => c.buffer_minutes), '[)')
          && tstzrange(c.starts_at, c.ends_at + make_interval(mins => c.buffer_minutes), '[)')
    )
  ORDER BY c.starts_at;
$$;

CREATE OR REPLACE FUNCTION public.crm_book_meeting(p_distributor_slug TEXT, p_booking_slug TEXT, p_starts_at TIMESTAMPTZ, p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  booking public.crm_booking_types%ROWTYPE;
  distributor public.crm_distributors%ROWTYPE;
  meeting_id UUID;
  lead_id UUID;
  normalized_email TEXT := lower(trim(COALESCE(p_payload ->> 'email', '')));
  normalized_name TEXT := trim(COALESCE(p_payload ->> 'fullName', ''));
  normalized_phone TEXT := nullif(trim(COALESCE(p_payload ->> 'phone', '')), '');
  guest_tz TEXT := trim(COALESCE(p_payload ->> 'timezone', 'UTC'));
  country_value TEXT := trim(COALESCE(p_payload ->> 'country', 'Not provided'));
  interest_value TEXT := COALESCE(p_payload ->> 'interest', 'product');
  meeting_end TIMESTAMPTZ;
BEGIN
  IF COALESCE(p_payload ->> 'website', '') <> '' THEN RAISE EXCEPTION 'Invalid submission'; END IF;
  IF char_length(normalized_name) NOT BETWEEN 2 AND 160 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN RAISE EXCEPTION 'Invalid email'; END IF;
  IF normalized_phone IS NOT NULL AND char_length(normalized_phone) NOT BETWEEN 5 AND 50 THEN RAISE EXCEPTION 'Invalid phone'; END IF;
  IF char_length(country_value) NOT BETWEEN 2 AND 100 THEN RAISE EXCEPTION 'Invalid country'; END IF;
  IF interest_value NOT IN ('product', 'duo', 'distributor', 'training', 'events') THEN RAISE EXCEPTION 'Invalid interest'; END IF;
  IF char_length(guest_tz) NOT BETWEEN 3 AND 100 THEN RAISE EXCEPTION 'Invalid timezone'; END IF;
  IF COALESCE((p_payload ->> 'consent')::BOOLEAN, false) IS NOT TRUE THEN RAISE EXCEPTION 'Consent required'; END IF;

  SELECT b.* INTO booking FROM public.crm_booking_types b
  JOIN public.crm_distributors d ON d.id = b.distributor_id
  WHERE d.slug = lower(trim(p_distributor_slug)) AND d.active AND b.slug = lower(trim(p_booking_slug)) AND b.active
  LIMIT 1 FOR UPDATE OF b;
  IF booking.id IS NULL THEN RAISE EXCEPTION 'Booking page not found'; END IF;
  SELECT * INTO distributor FROM public.crm_distributors WHERE id = booking.distributor_id;
  meeting_end := p_starts_at + make_interval(mins => booking.duration_minutes);

  IF NOT EXISTS (
    SELECT 1 FROM public.crm_get_booking_slots(p_distributor_slug, p_booking_slug, (p_starts_at AT TIME ZONE booking.timezone)::DATE) s
    WHERE s.starts_at = p_starts_at
  ) THEN RAISE EXCEPTION 'This time is no longer available'; END IF;

  INSERT INTO public.crm_leads (
    full_name, email, phone, country, interest, has_referrer, referral_code,
    selected_distributor_id, assigned_distributor_id, attribution_method, locale,
    source_path, consent, consent_at, privacy_version, next_follow_up_at
  ) VALUES (
    normalized_name, normalized_email, normalized_phone, country_value, interest_value, true, distributor.referral_code,
    distributor.id, distributor.id, 'referral_link', 'en', left('/book/' || distributor.slug || '/' || booking.slug, 300),
    true, now(), '2026-08-phase-3a', p_starts_at
  ) RETURNING id INTO lead_id;

  INSERT INTO public.crm_lead_activity (lead_id, activity_type, details)
  VALUES (lead_id, 'created', jsonb_build_object('attribution', 'booking_page', 'meetingStartsAt', p_starts_at));
  INSERT INTO public.crm_assignment_history (lead_id, to_distributor_id) VALUES (lead_id, distributor.id);

  INSERT INTO public.crm_meetings (booking_type_id, distributor_id, lead_id, guest_name, guest_email, guest_phone, guest_timezone, starts_at, ends_at, notes)
  VALUES (booking.id, distributor.id, lead_id, normalized_name, normalized_email, normalized_phone, guest_tz, p_starts_at, meeting_end, nullif(trim(COALESCE(p_payload ->> 'notes', '')), ''))
  RETURNING id INTO meeting_id;

  RETURN jsonb_build_object('meetingId', meeting_id, 'startsAt', p_starts_at, 'endsAt', meeting_end, 'distributorName', distributor.display_name);
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'This time is no longer available';
END;
$$;

CREATE OR REPLACE FUNCTION public.crm_update_meeting_status(p_meeting_id UUID, p_status TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE meeting public.crm_meetings%ROWTYPE;
BEGIN
  IF p_status NOT IN ('scheduled', 'completed', 'cancelled', 'no_show') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  SELECT * INTO meeting FROM public.crm_meetings WHERE id = p_meeting_id FOR UPDATE;
  IF meeting.id IS NULL OR NOT (public.crm_is_admin() OR meeting.distributor_id = public.crm_current_distributor_id()) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  UPDATE public.crm_meetings SET status = p_status WHERE id = p_meeting_id;
END;
$$;

ALTER TABLE public.crm_booking_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_availability_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view permitted booking types" ON public.crm_booking_types FOR SELECT TO authenticated
USING (public.crm_is_admin() OR distributor_id = public.crm_current_distributor_id());
CREATE POLICY "Members manage permitted booking types" ON public.crm_booking_types FOR ALL TO authenticated
USING (public.crm_is_admin() OR distributor_id = public.crm_current_distributor_id())
WITH CHECK (public.crm_is_admin() OR distributor_id = public.crm_current_distributor_id());
CREATE POLICY "Members view permitted availability" ON public.crm_availability_windows FOR SELECT TO authenticated
USING (public.crm_is_admin() OR distributor_id = public.crm_current_distributor_id());
CREATE POLICY "Members manage permitted availability" ON public.crm_availability_windows FOR ALL TO authenticated
USING (public.crm_is_admin() OR distributor_id = public.crm_current_distributor_id())
WITH CHECK (public.crm_is_admin() OR distributor_id = public.crm_current_distributor_id());
CREATE POLICY "Members view permitted meetings" ON public.crm_meetings FOR SELECT TO authenticated
USING (public.crm_is_admin() OR distributor_id = public.crm_current_distributor_id());

REVOKE ALL ON public.crm_booking_types, public.crm_availability_windows, public.crm_meetings FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_booking_types, public.crm_availability_windows TO authenticated;
GRANT SELECT ON public.crm_meetings TO authenticated;

REVOKE ALL ON FUNCTION public.crm_get_booking_page(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_get_booking_slots(TEXT, TEXT, DATE) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_book_meeting(TEXT, TEXT, TIMESTAMPTZ, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_update_meeting_status(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_get_booking_page(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_booking_slots(TEXT, TEXT, DATE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_book_meeting(TEXT, TEXT, TIMESTAMPTZ, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_update_meeting_status(UUID, TEXT) TO authenticated;
