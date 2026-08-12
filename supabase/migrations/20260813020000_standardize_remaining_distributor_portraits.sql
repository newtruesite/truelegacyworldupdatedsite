-- Complete the shared True Legacy 4:5 portrait system for all current distributors.

UPDATE public.crm_distributors
SET avatar_url = '/leaders/standardized/alex-gonzalez.png', updated_at = now()
WHERE slug = 'alex-gonzalez';

UPDATE public.crm_distributors
SET avatar_url = '/leaders/standardized/zah-naderi.png', updated_at = now()
WHERE slug = 'zah-naderi';

UPDATE public.crm_distributors
SET avatar_url = '/leaders/standardized/emanuela-doustova.png', updated_at = now()
WHERE slug = 'emanuela-doustova';
