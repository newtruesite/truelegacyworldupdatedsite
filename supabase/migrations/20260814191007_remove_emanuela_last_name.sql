-- Use Emanuela's preferred public display name while preserving her login email.
UPDATE public.crm_distributors
SET display_name = 'Emanuela', updated_at = now()
WHERE slug = 'emanuela';
