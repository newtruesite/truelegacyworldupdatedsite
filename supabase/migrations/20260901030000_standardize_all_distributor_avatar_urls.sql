-- Standardize all distributor avatar_url records in public.crm_distributors to their canonical standardized portraits.
-- This eliminates legacy photo URL mismatches between database records and standardized UI assets.

UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/mehdi-cohen.png' WHERE slug = 'mehdi-cohen';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/simon-loh-v2.png' WHERE slug = 'simon-loh';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/ming-way-sia.png' WHERE slug = 'ming-way-sia';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/zah-naderi-v3.png' WHERE slug = 'zah-naderi';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/alex-gonzalez.png' WHERE slug = 'alex-gonzalez';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/ryan-pool-sr.png' WHERE slug = 'ryan-pool';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/magaly-cardona.png' WHERE slug = 'magaly-cardona';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/emanuela-doustova.png' WHERE slug = 'emanuela';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/jesse-schexnayder.png' WHERE slug = 'jesse-schexnayder';
UPDATE public.crm_distributors SET avatar_url = '/leaders/standardized/angel-mok-v2.png' WHERE slug = 'angel-mok';
