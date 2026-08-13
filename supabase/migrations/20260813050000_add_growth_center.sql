-- True Legacy Growth Center: tracked sharing, onboarding, training progress, and team hierarchy.

CREATE TABLE IF NOT EXISTS public.crm_team_relationships (
  distributor_id UUID PRIMARY KEY REFERENCES public.crm_distributors(id) ON DELETE CASCADE,
  sponsor_distributor_id UUID REFERENCES public.crm_distributors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (distributor_id IS DISTINCT FROM sponsor_distributor_id)
);

CREATE TABLE IF NOT EXISTS public.crm_training_modules (
  id TEXT PRIMARY KEY,
  position INTEGER NOT NULL,
  category TEXT NOT NULL,
  title JSONB NOT NULL,
  video_url TEXT,
  required BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.crm_training_progress (
  distributor_id UUID NOT NULL REFERENCES public.crm_distributors(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES public.crm_training_modules(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (distributor_id, module_id)
);

CREATE TABLE IF NOT EXISTS public.crm_onboarding_items (
  id TEXT PRIMARY KEY,
  position INTEGER NOT NULL,
  title JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.crm_onboarding_progress (
  distributor_id UUID NOT NULL REFERENCES public.crm_distributors(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES public.crm_onboarding_items(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (distributor_id, item_id)
);

CREATE TABLE IF NOT EXISTS public.crm_link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL REFERENCES public.crm_distributors(id) ON DELETE CASCADE,
  campaign TEXT NOT NULL CHECK (campaign IN ('profile','business','duo','training','events')),
  locale TEXT NOT NULL DEFAULT 'en',
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_link_clicks_stats_idx ON public.crm_link_clicks(distributor_id, campaign, clicked_at DESC);

INSERT INTO public.crm_training_modules (id, position, category, title, video_url) VALUES
('purpose-vision',1,'foundation','{"en":"Purpose and Vision","es":"Propósito y Visión","pt":"Propósito e Visão"}','https://www.youtube.com/watch?v=2O7DboiJBdE'),
('kangen-science',2,'product','{"en":"Product Mastery: Leveluk and emGuarde","es":"Dominio de Productos: Leveluk y emGuarde","pt":"Domínio de Produtos: Leveluk e emGuarde"}','https://youtu.be/_LcCVpKnVxk'),
('product-lineup',3,'product','{"en":"The 8-Point System and Action Plan","es":"Sistema de 8 Puntos y Plan de Acción","pt":"Sistema de 8 Pontos e Plano de Ação"}','https://www.youtube.com/watch?v=FndRvUtZXL0'),
('leadership-structure',4,'leadership','{"en":"Build Your Enagic Legacy","es":"Construye tu Legado con Enagic","pt":"Construa seu Legado com a Enagic"}','https://youtu.be/Jz1LFvYTonI'),
('systems-funnels',5,'systems','{"en":"The True Legacy Duplication System","es":"Sistema de Duplicación True Legacy","pt":"Sistema de Duplicação True Legacy"}','https://youtu.be/tL5KtgzCB74'),
('prospecting-basics',6,'prospecting','{"en":"Prospecting Foundations","es":"Fundamentos de Prospección","pt":"Fundamentos de Prospecção"}','https://www.youtube.com/watch?v=OAKaQqLIwmg'),
('social-media-prospecting',7,'prospecting','{"en":"Turn Presentations into a Leader Magnet","es":"Convierte Presentaciones en un Imán de Líderes","pt":"Transforme Apresentações em um Ímã de Líderes"}','https://www.youtube.com/watch?v=l8Uk9Mbegsk'),
('closing-techniques',8,'closing','{"en":"Closing with Clarity","es":"Cierre con Claridad","pt":"Fechamento com Clareza"}','https://www.youtube.com/watch?v=ie-tFol7F4Q'),
('business-media',9,'closing','{"en":"Handling Objections","es":"Manejo de Objeciones","pt":"Lidando com Objeções"}','https://www.youtube.com/watch?v=ut9H9n9dE70'),
('income-projection',10,'systems','{"en":"Business Media","es":"Medios para Negocios","pt":"Mídia para Negócios"}','https://www.youtube.com/watch?v=fjD6atjMN2g')
ON CONFLICT (id) DO UPDATE SET position=EXCLUDED.position, category=EXCLUDED.category, title=EXCLUDED.title, video_url=EXCLUDED.video_url;

INSERT INTO public.crm_onboarding_items (id, position, title) VALUES
('profile',1,'{"en":"Complete your distributor profile","es":"Completa tu perfil de distribuidor","pt":"Complete seu perfil de distribuidor"}'),
('login',2,'{"en":"Secure your CRM login","es":"Asegura tu acceso al CRM","pt":"Proteja seu acesso ao CRM"}'),
('links',3,'{"en":"Review and share your personal links","es":"Revisa y comparte tus enlaces personales","pt":"Revise e compartilhe seus links pessoais"}'),
('products',4,'{"en":"Complete product foundations","es":"Completa los fundamentos de productos","pt":"Conclua os fundamentos de produtos"}'),
('first-list',5,'{"en":"Build your first prospect list","es":"Crea tu primera lista de prospectos","pt":"Crie sua primeira lista de prospects"}'),
('first-event',6,'{"en":"Invite your first guest to an event","es":"Invita a tu primer participante a un evento","pt":"Convide seu primeiro participante para um evento"}')
ON CONFLICT (id) DO UPDATE SET position=EXCLUDED.position, title=EXCLUDED.title;

CREATE OR REPLACE FUNCTION public.crm_can_view_growth(p_distributor_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT public.crm_is_admin()
    OR p_distributor_id = public.crm_current_distributor_id()
    OR EXISTS (SELECT 1 FROM public.crm_team_relationships r WHERE r.distributor_id=p_distributor_id AND r.sponsor_distributor_id=public.crm_current_distributor_id());
$$;

CREATE OR REPLACE FUNCTION public.crm_track_share_click(p_slug TEXT, p_campaign TEXT, p_locale TEXT DEFAULT 'en')
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE did UUID;
BEGIN
  IF p_campaign NOT IN ('profile','business','duo','training','events') THEN RAISE EXCEPTION 'Invalid campaign'; END IF;
  SELECT id INTO did FROM public.crm_distributors WHERE slug=p_slug AND active LIMIT 1;
  IF did IS NOT NULL THEN INSERT INTO public.crm_link_clicks(distributor_id,campaign,locale) VALUES(did,p_campaign,left(COALESCE(p_locale,'en'),5)); END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_set_training_progress(p_distributor_id UUID, p_module_id TEXT, p_completed BOOLEAN)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT (public.crm_is_admin() OR p_distributor_id=public.crm_current_distributor_id()) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  INSERT INTO public.crm_training_progress(distributor_id,module_id,completed,completed_at,updated_at)
  VALUES(p_distributor_id,p_module_id,p_completed,CASE WHEN p_completed THEN now() END,now())
  ON CONFLICT(distributor_id,module_id) DO UPDATE SET completed=EXCLUDED.completed,completed_at=EXCLUDED.completed_at,updated_at=now();
END; $$;

CREATE OR REPLACE FUNCTION public.crm_set_onboarding_progress(p_distributor_id UUID, p_item_id TEXT, p_completed BOOLEAN)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT (public.crm_is_admin() OR p_distributor_id=public.crm_current_distributor_id()) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  INSERT INTO public.crm_onboarding_progress(distributor_id,item_id,completed,completed_at,updated_at)
  VALUES(p_distributor_id,p_item_id,p_completed,CASE WHEN p_completed THEN now() END,now())
  ON CONFLICT(distributor_id,item_id) DO UPDATE SET completed=EXCLUDED.completed,completed_at=EXCLUDED.completed_at,updated_at=now();
END; $$;

ALTER TABLE public.crm_team_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_onboarding_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view training modules" ON public.crm_training_modules FOR SELECT TO authenticated USING(active);
CREATE POLICY "Members view onboarding items" ON public.crm_onboarding_items FOR SELECT TO authenticated USING(active);
CREATE POLICY "Members view permitted training progress" ON public.crm_training_progress FOR SELECT TO authenticated USING(public.crm_can_view_growth(distributor_id));
CREATE POLICY "Members view permitted onboarding progress" ON public.crm_onboarding_progress FOR SELECT TO authenticated USING(public.crm_can_view_growth(distributor_id));
CREATE POLICY "Members view permitted team relationships" ON public.crm_team_relationships FOR SELECT TO authenticated USING(public.crm_is_admin() OR distributor_id=public.crm_current_distributor_id() OR sponsor_distributor_id=public.crm_current_distributor_id());
CREATE POLICY "Members view permitted click stats" ON public.crm_link_clicks FOR SELECT TO authenticated USING(public.crm_can_view_growth(distributor_id));
GRANT SELECT ON public.crm_team_relationships,public.crm_training_modules,public.crm_training_progress,public.crm_onboarding_items,public.crm_onboarding_progress,public.crm_link_clicks TO authenticated;
REVOKE ALL ON FUNCTION public.crm_track_share_click(TEXT,TEXT,TEXT), public.crm_set_training_progress(UUID,TEXT,BOOLEAN), public.crm_set_onboarding_progress(UUID,TEXT,BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_track_share_click(TEXT,TEXT,TEXT) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.crm_set_training_progress(UUID,TEXT,BOOLEAN), public.crm_set_onboarding_progress(UUID,TEXT,BOOLEAN) TO authenticated;
