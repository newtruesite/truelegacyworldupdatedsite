-- Migration: Promote Mehdi, Simon, Magaly, and Angel to CRM Admins
-- Ensures only Admins can review/approve Leader Applications and dispatch onboarding.

UPDATE public.crm_memberships
SET role = 'admin'
WHERE distributor_id IN (
  SELECT id FROM public.crm_distributors
  WHERE slug IN ('mehdi-cohen', 'simon-loh', 'magaly-cardona', 'angel-mok')
);

-- Ensure all other distributors remain with role 'distributor'
UPDATE public.crm_memberships
SET role = 'distributor'
WHERE distributor_id IN (
  SELECT id FROM public.crm_distributors
  WHERE slug NOT IN ('mehdi-cohen', 'simon-loh', 'magaly-cardona', 'angel-mok')
);
