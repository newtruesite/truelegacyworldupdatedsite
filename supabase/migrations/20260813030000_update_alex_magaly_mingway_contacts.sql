-- Store the verified public contact details for Alex, Magaly, and Ming-Way.

UPDATE public.crm_distributors
SET
  phone = CASE slug
    WHEN 'alex-gonzalez' THEN '+1 (954) 263-5001'
    WHEN 'magaly-cardona' THEN '+1 (864) 201-8298'
    WHEN 'ming-way-sia' THEN '+60 12-276-1229'
  END,
  instagram_url = CASE slug
    WHEN 'alex-gonzalez' THEN 'https://www.instagram.com/alexgonzalez_vp/'
    WHEN 'magaly-cardona' THEN 'https://www.instagram.com/mcardonita/'
    WHEN 'ming-way-sia' THEN 'https://www.instagram.com/mingwaysia/'
  END,
  updated_at = now()
WHERE slug IN ('alex-gonzalez', 'magaly-cardona', 'ming-way-sia');
