-- Phase 4: academy, organization hierarchy, nurture automation, analytics, and managed content.

CREATE TABLE IF NOT EXISTS public.crm_courses (
  id TEXT PRIMARY KEY,
  position INTEGER NOT NULL DEFAULT 0,
  title JSONB NOT NULL,
  description JSONB NOT NULL DEFAULT '{}'::jsonb,
  audience TEXT NOT NULL DEFAULT 'distributor',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_training_modules
  ADD COLUMN IF NOT EXISTS course_id TEXT REFERENCES public.crm_courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS passing_score INTEGER NOT NULL DEFAULT 80;

CREATE TABLE IF NOT EXISTS public.crm_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL REFERENCES public.crm_training_modules(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  prompt JSONB NOT NULL,
  choices JSONB NOT NULL,
  correct_choice INTEGER NOT NULL CHECK (correct_choice >= 0),
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.crm_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL REFERENCES public.crm_distributors(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES public.crm_training_modules(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_quiz_attempts_member_idx ON public.crm_quiz_attempts(distributor_id,module_id,attempted_at DESC);

CREATE TABLE IF NOT EXISTS public.crm_nurture_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interest TEXT NOT NULL CHECK (interest IN ('product','duo','distributor','training','events')),
  locale TEXT NOT NULL CHECK (locale IN ('en','es','pt')),
  name TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (interest, locale)
);

CREATE TABLE IF NOT EXISTS public.crm_nurture_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.crm_nurture_campaigns(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','completed','cancelled')),
  next_send_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lead_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS public.crm_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('page_view','qr_open','share','lead','email_open','link_click','conversion','training_complete')),
  campaign TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  source_path TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_analytics_rollup_idx ON public.crm_analytics_events(distributor_id,event_name,occurred_at DESC);

CREATE TABLE IF NOT EXISTS public.crm_managed_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('product','event','training','announcement')),
  slug TEXT NOT NULL,
  title JSONB NOT NULL,
  body JSONB NOT NULL DEFAULT '{}'::jsonb,
  media_url TEXT,
  cta_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(content_type,slug)
);

INSERT INTO public.crm_courses(id,position,title,description) VALUES
('launch',1,'{"en":"Distributor Launch","es":"Lanzamiento del Distribuidor","pt":"Lançamento do Distribuidor"}','{"en":"The essential path from setup to first presentation.","es":"La ruta esencial desde la configuración hasta la primera presentación.","pt":"O caminho essencial da configuração à primeira apresentação."}'),
('product-mastery',2,'{"en":"Product Mastery","es":"Dominio de Productos","pt":"Domínio de Produtos"}','{"en":"Build confidence in the K8, emGuarde GO, and the Duo story.","es":"Desarrolla confianza en K8, emGuarde GO y la historia Duo.","pt":"Desenvolva confiança no K8, emGuarde GO e na história Duo."}'),
('duplication',3,'{"en":"Duplication & Leadership","es":"Duplicación y Liderazgo","pt":"Duplicação e Liderança"}','{"en":"Prospecting, presenting, follow-up, and team development.","es":"Prospección, presentación, seguimiento y desarrollo de equipo.","pt":"Prospecção, apresentação, acompanhamento e desenvolvimento de equipe."}')
ON CONFLICT(id) DO UPDATE SET position=EXCLUDED.position,title=EXCLUDED.title,description=EXCLUDED.description,updated_at=now();

UPDATE public.crm_training_modules SET course_id = CASE
  WHEN category='foundation' THEN 'launch'
  WHEN category='product' THEN 'product-mastery'
  ELSE 'duplication'
END WHERE course_id IS NULL;

INSERT INTO public.crm_nurture_campaigns(interest,locale,name,steps)
SELECT interest, locale, interest || ' · ' || upper(locale),
  CASE locale
    WHEN 'es' THEN '[{"delay_hours":0,"channel":"email","campaign":"duo","subject":"Tu guía True Legacy"},{"delay_hours":24,"channel":"whatsapp","campaign":"events"},{"delay_hours":72,"channel":"email","campaign":"training"}]'::jsonb
    WHEN 'pt' THEN '[{"delay_hours":0,"channel":"email","campaign":"duo","subject":"Seu guia True Legacy"},{"delay_hours":24,"channel":"whatsapp","campaign":"events"},{"delay_hours":72,"channel":"email","campaign":"training"}]'::jsonb
    ELSE '[{"delay_hours":0,"channel":"email","campaign":"duo","subject":"Your True Legacy guide"},{"delay_hours":24,"channel":"whatsapp","campaign":"events"},{"delay_hours":72,"channel":"email","campaign":"training"}]'::jsonb
  END
FROM unnest(ARRAY['product','duo','distributor','training','events']) interest
CROSS JOIN unnest(ARRAY['en','es','pt']) locale
ON CONFLICT(interest,locale) DO NOTHING;

CREATE OR REPLACE FUNCTION public.crm_is_in_downline(p_member UUID, p_upline UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  WITH RECURSIVE organization AS (
    SELECT distributor_id FROM public.crm_team_relationships WHERE sponsor_distributor_id=p_upline
    UNION ALL
    SELECT r.distributor_id FROM public.crm_team_relationships r JOIN organization o ON r.sponsor_distributor_id=o.distributor_id
  ) SELECT EXISTS(SELECT 1 FROM organization WHERE distributor_id=p_member);
$$;

CREATE OR REPLACE FUNCTION public.crm_can_view_growth(p_distributor_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT public.crm_is_admin()
    OR p_distributor_id=public.crm_current_distributor_id()
    OR public.crm_is_in_downline(p_distributor_id,public.crm_current_distributor_id());
$$;

CREATE OR REPLACE FUNCTION public.crm_record_analytics(p_slug TEXT,p_event_name TEXT,p_campaign TEXT DEFAULT NULL,p_locale TEXT DEFAULT 'en',p_source_path TEXT DEFAULT NULL,p_metadata JSONB DEFAULT '{}'::jsonb)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE did UUID;
BEGIN
  IF p_event_name NOT IN ('page_view','qr_open','share','lead','email_open','link_click','conversion','training_complete') THEN RAISE EXCEPTION 'Invalid event'; END IF;
  SELECT id INTO did FROM public.crm_distributors WHERE slug=p_slug AND active LIMIT 1;
  INSERT INTO public.crm_analytics_events(distributor_id,event_name,campaign,locale,source_path,metadata)
  VALUES(did,p_event_name,left(p_campaign,40),left(COALESCE(p_locale,'en'),5),left(p_source_path,300),COALESCE(p_metadata,'{}'::jsonb));
END; $$;

CREATE OR REPLACE FUNCTION public.crm_submit_quiz(p_module_id TEXT,p_answers JSONB)
RETURNS TABLE(score INTEGER,passed BOOLEAN) LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE did UUID:=public.crm_current_distributor_id(); total_count INTEGER; correct_count INTEGER; result_score INTEGER; pass_score INTEGER;
BEGIN
  IF did IS NULL THEN RAISE EXCEPTION 'No distributor profile'; END IF;
  SELECT count(*),count(*) FILTER(WHERE (p_answers->>(q.position::text))::INTEGER=q.correct_choice)
    INTO total_count,correct_count FROM public.crm_quiz_questions q WHERE q.module_id=p_module_id AND q.active;
  IF total_count=0 THEN RAISE EXCEPTION 'Quiz unavailable'; END IF;
  SELECT passing_score INTO pass_score FROM public.crm_training_modules WHERE id=p_module_id;
  result_score:=round((correct_count::numeric/total_count)*100);
  INSERT INTO public.crm_quiz_attempts(distributor_id,module_id,score,passed,answers) VALUES(did,p_module_id,result_score,result_score>=pass_score,p_answers);
  IF result_score>=pass_score THEN PERFORM public.crm_set_training_progress(did,p_module_id,true); END IF;
  RETURN QUERY SELECT result_score,result_score>=pass_score;
END; $$;

ALTER TABLE public.crm_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_nurture_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_nurture_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_managed_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view courses" ON public.crm_courses FOR SELECT TO authenticated USING(active OR public.crm_is_admin());
CREATE POLICY "Members view quiz questions" ON public.crm_quiz_questions FOR SELECT TO authenticated USING(active);
CREATE POLICY "Members view quiz attempts" ON public.crm_quiz_attempts FOR SELECT TO authenticated USING(public.crm_can_view_growth(distributor_id));
CREATE POLICY "Members view nurture campaigns" ON public.crm_nurture_campaigns FOR SELECT TO authenticated USING(active OR public.crm_is_admin());
CREATE POLICY "Members view nurture enrollments" ON public.crm_nurture_enrollments FOR SELECT TO authenticated USING(public.crm_is_admin() OR EXISTS(SELECT 1 FROM public.crm_leads l WHERE l.id=lead_id AND public.crm_can_view_growth(l.assigned_distributor_id)));
CREATE POLICY "Members view analytics" ON public.crm_analytics_events FOR SELECT TO authenticated USING(distributor_id IS NULL OR public.crm_can_view_growth(distributor_id));
CREATE POLICY "Public views published content" ON public.crm_managed_content FOR SELECT TO anon,authenticated USING(published OR public.crm_is_admin());
CREATE POLICY "Admins manage courses" ON public.crm_courses FOR ALL TO authenticated USING(public.crm_is_admin()) WITH CHECK(public.crm_is_admin());
CREATE POLICY "Admins manage questions" ON public.crm_quiz_questions FOR ALL TO authenticated USING(public.crm_is_admin()) WITH CHECK(public.crm_is_admin());
CREATE POLICY "Admins manage campaigns" ON public.crm_nurture_campaigns FOR ALL TO authenticated USING(public.crm_is_admin()) WITH CHECK(public.crm_is_admin());
CREATE POLICY "Admins manage content" ON public.crm_managed_content FOR ALL TO authenticated USING(public.crm_is_admin()) WITH CHECK(public.crm_is_admin());

GRANT SELECT ON public.crm_courses,public.crm_quiz_questions,public.crm_quiz_attempts,public.crm_nurture_campaigns,public.crm_nurture_enrollments,public.crm_analytics_events,public.crm_managed_content TO authenticated;
GRANT SELECT ON public.crm_managed_content TO anon;
GRANT INSERT,UPDATE,DELETE ON public.crm_courses,public.crm_quiz_questions,public.crm_nurture_campaigns,public.crm_managed_content TO authenticated;
REVOKE ALL ON FUNCTION public.crm_is_in_downline(UUID,UUID),public.crm_record_analytics(TEXT,TEXT,TEXT,TEXT,TEXT,JSONB),public.crm_submit_quiz(TEXT,JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_record_analytics(TEXT,TEXT,TEXT,TEXT,TEXT,JSONB) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.crm_submit_quiz(TEXT,JSONB) TO authenticated;
