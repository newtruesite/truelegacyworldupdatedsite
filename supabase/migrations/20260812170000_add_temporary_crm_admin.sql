-- Temporary password-login administrator while the Wix-managed sending domain
-- cannot publish Resend's required subdomain MX record.
INSERT INTO public.crm_admin_allowlist (email)
VALUES ('mehdicohen1@proton.me')
ON CONFLICT DO NOTHING;

INSERT INTO public.crm_memberships (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE lower(email) = 'mehdicohen1@proton.me'
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin', distributor_id = NULL, active = true;
