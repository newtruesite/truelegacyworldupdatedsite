-- Confirm the approved Phase 2 routing policy and Simon Loh portrait.

UPDATE public.crm_distributors
SET avatar_url = '/leaders/simon-loh.jpg', updated_at = now()
WHERE slug = 'simon-loh';

INSERT INTO public.crm_settings (key, value)
VALUES (
  'routing_rules',
  '{
    "referral_link_priority": true,
    "preserve_named_referrer": true,
    "no_referrer_can_choose_distributor": true,
    "no_selection_stays_unassigned": true,
    "admin_can_reassign": true,
    "automatic_round_robin": false
  }'::JSONB
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = now();
