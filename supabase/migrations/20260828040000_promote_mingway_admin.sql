-- Migration: Promote Ming-Way Sia to CRM Admin and Ensure Top Leaders bypass sponsor requirement
-- Ensures Ming-Way Sia, Mehdi Cohen, Simon Loh, Magaly Cardona, and Angel Mok are CRM Admins.

UPDATE public.crm_memberships
SET role = 'admin'
WHERE distributor_id IN (
  SELECT id FROM public.crm_distributors
  WHERE slug IN ('mehdi-cohen', 'simon-loh', 'magaly-cardona', 'angel-mok', 'ming-way-sia')
);
