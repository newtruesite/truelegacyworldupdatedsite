-- PostgreSQL has no jsonb_object_length(jsonb). Replace the deployed profile
-- function's link-count expression with the supported object-key count.
DO $$
DECLARE
  function_definition TEXT;
BEGIN
  SELECT pg_get_functiondef(p.oid)
  INTO function_definition
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname = 'crm_update_distributor_profile'
    AND pg_get_function_identity_arguments(p.oid) = 'p_distributor_id uuid, p_payload jsonb';

  IF function_definition IS NULL THEN
    RAISE EXCEPTION 'crm_update_distributor_profile(uuid, jsonb) not found';
  END IF;

  function_definition := replace(
    function_definition,
    'IF jsonb_object_length(normalized_purchase_links) > 50 THEN',
    'IF (SELECT count(*) FROM jsonb_object_keys(normalized_purchase_links)) > 50 THEN'
  );

  EXECUTE function_definition;
END;
$$;
