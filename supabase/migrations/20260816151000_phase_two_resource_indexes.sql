CREATE INDEX IF NOT EXISTS crm_resources_form_id_idx ON public.crm_resources(form_id) WHERE form_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS crm_resource_favorites_resource_idx ON public.crm_resource_favorites(resource_id);
CREATE INDEX IF NOT EXISTS crm_resource_events_resource_idx ON public.crm_resource_events(resource_id,occurred_at DESC);
CREATE INDEX IF NOT EXISTS crm_resource_events_lead_idx ON public.crm_resource_events(lead_id) WHERE lead_id IS NOT NULL;
