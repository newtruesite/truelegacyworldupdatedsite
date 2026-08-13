-- Require each distributor to identify their sponsor before using the team CRM.

CREATE OR REPLACE FUNCTION public.crm_choose_sponsor(p_sponsor_distributor_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_distributor UUID := public.crm_current_distributor_id();
BEGIN
  IF current_distributor IS NULL THEN
    RAISE EXCEPTION 'No distributor profile is connected to this account';
  END IF;
  IF current_distributor = p_sponsor_distributor_id THEN
    RAISE EXCEPTION 'A distributor cannot sponsor themselves';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.crm_distributors WHERE id = p_sponsor_distributor_id AND active) THEN
    RAISE EXCEPTION 'Sponsor is not available';
  END IF;
  IF EXISTS (SELECT 1 FROM public.crm_team_relationships WHERE distributor_id = current_distributor) THEN
    RAISE EXCEPTION 'Sponsor is already assigned; contact an administrator to change it';
  END IF;

  INSERT INTO public.crm_team_relationships (distributor_id, sponsor_distributor_id)
  VALUES (current_distributor, p_sponsor_distributor_id);
END;
$$;

-- Confirm the leadership ranks supplied by True Legacy.
UPDATE public.crm_distributors SET title = 'True Legacy 6A2-5 Leader', updated_at = now() WHERE slug = 'ming-way-sia';
UPDATE public.crm_distributors SET title = 'True Legacy 6A2-4 Leader', updated_at = now() WHERE slug = 'simon-loh';

-- Simon Loh is Mehdi Cohen's confirmed direct sponsor/upline.
INSERT INTO public.crm_team_relationships (distributor_id, sponsor_distributor_id)
SELECT member.id, sponsor.id
FROM public.crm_distributors member
JOIN public.crm_distributors sponsor ON sponsor.slug = 'simon-loh'
WHERE member.slug = 'mehdi-cohen'
ON CONFLICT (distributor_id) DO UPDATE SET sponsor_distributor_id = EXCLUDED.sponsor_distributor_id;

REVOKE ALL ON FUNCTION public.crm_choose_sponsor(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_choose_sponsor(UUID) TO authenticated;
