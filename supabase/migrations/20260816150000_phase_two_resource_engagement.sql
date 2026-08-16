-- Phase 2: approved resources, favorites, attributed sharing, forms, and engagement.

CREATE TABLE IF NOT EXISTS public.crm_resources (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('products','business','training','events')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('page','video','guide','event')),
  destination_path TEXT NOT NULL CHECK (destination_path LIKE '/%' AND char_length(destination_path) <= 300),
  form_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_resource_forms (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  interest TEXT NOT NULL CHECK (interest IN ('product','duo','distributor','training','events')),
  submit_label JSONB NOT NULL DEFAULT '{"en":"Send my request"}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_resources DROP CONSTRAINT IF EXISTS crm_resources_form_id_fkey;
ALTER TABLE public.crm_resources ADD CONSTRAINT crm_resources_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.crm_resource_forms(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.crm_resource_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES public.crm_resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, resource_id)
);

CREATE TABLE IF NOT EXISTS public.crm_resource_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id TEXT NOT NULL REFERENCES public.crm_resources(id) ON DELETE CASCADE,
  distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('share','view','cta_click','form_start','form_submit')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en','es','fr','pt')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_resource_events_rollup_idx ON public.crm_resource_events(distributor_id,resource_id,event_name,occurred_at DESC);

INSERT INTO public.crm_resource_forms (id,title,description,interest,submit_label) VALUES
('product-interest','{"en":"Request a product consultation","es":"Solicita una consulta de producto","fr":"Demander une consultation produit","pt":"Solicite uma consulta de produto"}','{"en":"Tell us what you want to improve and a True Legacy distributor will follow up.","es":"Cuéntanos qué deseas mejorar y un distribuidor de True Legacy te contactará.","fr":"Expliquez-nous votre objectif et un distributeur True Legacy vous contactera.","pt":"Conte-nos o que deseja melhorar e um distribuidor True Legacy entrará em contato."}','product','{"en":"Request consultation","es":"Solicitar consulta","fr":"Demander une consultation","pt":"Solicitar consulta"}'),
('business-interest','{"en":"Explore the business","es":"Explora el negocio","fr":"Explorer l’activité","pt":"Explore o negócio"}','{"en":"Share your goals and receive a personalized next step.","es":"Comparte tus metas y recibe un próximo paso personalizado.","fr":"Partagez vos objectifs et recevez une prochaine étape personnalisée.","pt":"Compartilhe seus objetivos e receba um próximo passo personalizado."}','distributor','{"en":"Request information","es":"Solicitar información","fr":"Demander des informations","pt":"Solicitar informações"}'),
('event-interest','{"en":"Join a True Legacy event","es":"Únete a un evento True Legacy","fr":"Participer à un événement True Legacy","pt":"Participe de um evento True Legacy"}','{"en":"Register your interest and your distributor will send the right event details.","es":"Registra tu interés y tu distribuidor enviará los detalles correctos.","fr":"Inscrivez votre intérêt et votre distributeur vous enverra les détails.","pt":"Registre seu interesse e seu distribuidor enviará os detalhes."}','events','{"en":"Request event details","es":"Solicitar detalles","fr":"Demander les détails","pt":"Solicitar detalhes"}')
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,interest=EXCLUDED.interest,submit_label=EXCLUDED.submit_label,active=true;

INSERT INTO public.crm_resources (id,title,description,category,resource_type,destination_path,form_id,position) VALUES
('true-legacy-duo','{"en":"The True Legacy Duo","es":"El Dúo True Legacy","fr":"Le Duo True Legacy","pt":"O Duo True Legacy"}','{"en":"A clear introduction to K8 and emGuarde GO.","es":"Una introducción clara a K8 y emGuarde GO.","fr":"Une introduction claire au K8 et à emGuarde GO.","pt":"Uma introdução clara ao K8 e emGuarde GO."}','products','page','/products','product-interest',1),
('k8-water-system','{"en":"K8 Water System","es":"Sistema de Agua K8","fr":"Système d’eau K8","pt":"Sistema de Água K8"}','{"en":"Explore ionized water education, demonstrations, and product options.","es":"Explora educación, demostraciones y opciones de agua ionizada.","fr":"Découvrez l’eau ionisée, les démonstrations et les options produit.","pt":"Explore educação, demonstrações e opções de água ionizada."}','products','page','/usa/k8','product-interest',2),
('emguarde-go','{"en":"emGuarde GO","es":"emGuarde GO","fr":"emGuarde GO","pt":"emGuarde GO"}','{"en":"Learn how True Legacy presents whole-home EMF harmonization.","es":"Descubre cómo True Legacy presenta la armonización EMF del hogar.","fr":"Découvrez l’approche True Legacy de l’harmonisation EMF.","pt":"Conheça a abordagem True Legacy para harmonização EMF."}','products','page','/usa/emguarde','product-interest',3),
('business-overview','{"en":"True Legacy Business Overview","es":"Presentación del Negocio True Legacy","fr":"Présentation de l’activité True Legacy","pt":"Visão Geral do Negócio True Legacy"}','{"en":"See the community, systems, and support behind the opportunity.","es":"Conoce la comunidad, los sistemas y el apoyo de la oportunidad.","fr":"Découvrez la communauté, les systèmes et le soutien.","pt":"Conheça a comunidade, os sistemas e o suporte."}','business','page','/distributors','business-interest',4),
('academy-preview','{"en":"True Legacy Academy","es":"Academia True Legacy","fr":"Académie True Legacy","pt":"Academia True Legacy"}','{"en":"Preview the learning path distributors use to build responsibly.","es":"Conoce la ruta de aprendizaje para construir responsablemente.","fr":"Découvrez le parcours d’apprentissage des distributeurs.","pt":"Conheça a jornada de aprendizado dos distribuidores."}','training','page','/training',NULL,5),
('live-events','{"en":"True Legacy Live Events","es":"Eventos en Vivo True Legacy","fr":"Événements True Legacy","pt":"Eventos ao Vivo True Legacy"}','{"en":"Connect prospects with the next suitable community event.","es":"Conecta prospectos con el próximo evento adecuado.","fr":"Connectez vos prospects au prochain événement adapté.","pt":"Conecte prospects ao próximo evento adequado."}','events','event','/events','event-interest',6)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,category=EXCLUDED.category,resource_type=EXCLUDED.resource_type,destination_path=EXCLUDED.destination_path,form_id=EXCLUDED.form_id,position=EXCLUDED.position,active=true,updated_at=now();

CREATE OR REPLACE FUNCTION public.crm_record_resource_event(p_resource_id TEXT,p_slug TEXT,p_event_name TEXT,p_locale TEXT DEFAULT 'en',p_metadata JSONB DEFAULT '{}'::jsonb)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE did UUID; clean_locale TEXT := left(COALESCE(p_locale,'en'),2);
BEGIN
  IF p_event_name NOT IN ('share','view','cta_click','form_start') THEN RAISE EXCEPTION 'Invalid event'; END IF;
  IF clean_locale NOT IN ('en','es','fr','pt') THEN clean_locale := 'en'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.crm_resources WHERE id=p_resource_id AND active) THEN RAISE EXCEPTION 'Invalid resource'; END IF;
  SELECT id INTO did FROM public.crm_distributors WHERE slug=lower(trim(p_slug)) AND active LIMIT 1;
  INSERT INTO public.crm_resource_events(resource_id,distributor_id,event_name,locale,metadata)
  VALUES(p_resource_id,did,p_event_name,clean_locale,COALESCE(p_metadata,'{}'::jsonb));
END; $$;

CREATE OR REPLACE FUNCTION public.crm_submit_resource_form(p_resource_id TEXT,p_slug TEXT,p_payload JSONB)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE form_interest TEXT; form_ref TEXT; lead_id UUID; clean_payload JSONB;
BEGIN
  SELECT f.interest INTO form_interest FROM public.crm_resources r JOIN public.crm_resource_forms f ON f.id=r.form_id
  WHERE r.id=p_resource_id AND r.active AND f.active;
  IF form_interest IS NULL THEN RAISE EXCEPTION 'Form unavailable'; END IF;
  SELECT referral_code INTO form_ref FROM public.crm_distributors WHERE slug=lower(trim(p_slug)) AND active LIMIT 1;
  clean_payload := p_payload || jsonb_build_object('interest',form_interest,'referralCode',COALESCE(form_ref,''),'hasReferrer',form_ref IS NOT NULL,'sourcePath','/resource/'||p_resource_id||'/'||left(COALESCE(p_slug,''),100),'privacyVersion','2026-08-phase-2');
  lead_id := public.submit_crm_application(clean_payload);
  INSERT INTO public.crm_resource_events(resource_id,distributor_id,lead_id,event_name,locale,metadata)
  SELECT p_resource_id,d.id,lead_id,'form_submit',CASE WHEN COALESCE(p_payload->>'locale','en') IN ('en','es','fr','pt') THEN p_payload->>'locale' ELSE 'en' END,'{}'::jsonb
  FROM public.crm_distributors d WHERE d.slug=lower(trim(p_slug)) AND d.active;
  RETURN lead_id;
END; $$;

ALTER TABLE public.crm_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_resource_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_resource_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_resource_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads active resources" ON public.crm_resources FOR SELECT TO anon,authenticated USING(active);
CREATE POLICY "Public reads active resource forms" ON public.crm_resource_forms FOR SELECT TO anon,authenticated USING(active);
CREATE POLICY "Members manage own favorites" ON public.crm_resource_favorites FOR ALL TO authenticated USING(user_id=(select auth.uid())) WITH CHECK(user_id=(select auth.uid()));
CREATE POLICY "Members view permitted resource events" ON public.crm_resource_events FOR SELECT TO authenticated USING(distributor_id IS NULL AND public.crm_is_admin() OR distributor_id IS NOT NULL AND public.crm_can_view_growth(distributor_id));

GRANT SELECT ON public.crm_resources,public.crm_resource_forms TO anon,authenticated;
GRANT SELECT,INSERT,DELETE ON public.crm_resource_favorites TO authenticated;
GRANT SELECT ON public.crm_resource_events TO authenticated;
REVOKE ALL ON FUNCTION public.crm_record_resource_event(TEXT,TEXT,TEXT,TEXT,JSONB),public.crm_submit_resource_form(TEXT,TEXT,JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_record_resource_event(TEXT,TEXT,TEXT,TEXT,JSONB),public.crm_submit_resource_form(TEXT,TEXT,JSONB) TO anon,authenticated;
