import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendKey = Deno.env.get('RESEND_API_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Supabase service configuration missing' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // 1. STRICT AUTHENTICATION & ADMIN ROLE VERIFICATION
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization header required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const token = authHeader.replace('Bearer ', '').trim()
  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const { data: userData, error: userError } = await adminClient.auth.getUser(token)

  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired authentication token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Verify caller is an active admin in crm_memberships
  const { data: membershipData, error: membershipError } = await adminClient
    .from('crm_memberships')
    .select('role, active')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (membershipError || !membershipData || !membershipData.active || membershipData.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Administrator permissions required to send access invitations' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // 2. PARSE REQUEST PAYLOAD
  const body = await request.json().catch(() => ({}))
  const {
    email,
    displayName,
    slug,
    appUrl = 'https://www.truelegacyworld.com',
    linkType = 'magiclink', // 'magiclink' | 'recovery' | 'invite'
  } = body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid leader email is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const cleanName = displayName || 'Leader'
  const cleanSlug = slug || 'leader'
  const crmLoginUrl = `${appUrl}/crm`
  const settingsUrl = `${appUrl}/app/settings`
  const publicProfileUrl = `${appUrl}/d/${cleanSlug}`

  // 3. GENERATE SECURE ONE-TIME LINK VIA SUPABASE AUTH (NO RAW PASSWORDS)
  let generatedLinkUrl = crmLoginUrl
  try {
    const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
      type: linkType === 'recovery' ? 'recovery' : 'magiclink',
      email: email.trim().toLowerCase(),
      options: {
        redirectTo: linkType === 'recovery' ? `${appUrl}/crm?recovery=true` : `${appUrl}/app`,
      },
    })

    if (!linkErr && linkData?.properties?.action_link) {
      generatedLinkUrl = linkData.properties.action_link
    }
  } catch (err) {
    console.error('Error generating secure authentication link:', err)
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Secure True Legacy Leader Access</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000; min-height: 100vh; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #070b14; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); background: radial-gradient(circle at 50% 0%, rgba(41, 151, 255, 0.15) 0%, transparent 70%);">
              <p style="margin: 0 0 8px 0; color: #2997ff; font-size: 11px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">SECURE LEADERSHIP ACCESS</p>
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">TRUE LEGACY</h1>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 13px;">Your Command Center, Web App & Personal Lead Pipeline</p>
            </td>
          </tr>

          <!-- Welcome Body -->
          <tr>
            <td style="padding: 32px 32px 20px 32px;">
              <p style="margin: 0 0 16px 0; color: #e2e8f0; font-size: 16px; line-height: 1.5;">
                Hi <strong>${escapeHtml(cleanName)}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Your verified leader portal access has been provisioned on the <strong>True Legacy Platform</strong>. Click the secure button below to authenticate directly without needing a temporary password.
              </p>

              <!-- Single Secure Action CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${generatedLinkUrl}" style="background-color: #2997ff; color: #000000; font-weight: 900; font-size: 15px; text-decoration: none; padding: 16px 36px; border-radius: 12px; display: inline-block; box-shadow: 0 10px 25px -5px rgba(41, 151, 255, 0.4);">
                  Sign In Securely to Leader Portal &rarr;
                </a>
              </div>

              <!-- Quick Info Card -->
              <table role="presentation" width="100%" style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; margin-bottom: 28px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 14px 0; color: #38bdf8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Portal Account Overview</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; font-size: 13px; width: 140px;"><strong>Authorized Email:</strong></td>
                        <td style="padding: 4px 0; color: #ffffff; font-size: 13px; font-family: monospace; color: #38bdf8;">${escapeHtml(email)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Public Profile URL:</strong></td>
                        <td style="padding: 4px 0; color: #ffffff; font-size: 13px;"><a href="${publicProfileUrl}" style="color: #38bdf8; text-decoration: none;">${publicProfileUrl}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Direct CRM URL:</strong></td>
                        <td style="padding: 4px 0; color: #ffffff; font-size: 13px;"><a href="${crmLoginUrl}" style="color: #38bdf8; text-decoration: none;">${crmLoginUrl}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Safety Note -->
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                Note: This secure sign-in link is unique to your account and will expire automatically. Never share this link with anyone.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #030712; border-top: 1px solid rgba(255,255,255,0.08); text-align: center;">
              <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">Need help? Reply directly to this email or reach out to team administration.</p>
              <p style="margin: 0; color: #475569; font-size: 11px;">&copy; ${new Date().getFullYear()} True Legacy World. World-Class Enagic Leaders.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  // 4. DISPATCH VIA RESEND IF CONFIGURED
  if (resendKey) {
    try {
      const fromEmail = Deno.env.get('CRM_EMAIL_FROM') || 'True Legacy <hello@updates.mehdicohen.com>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: `Your Secure True Legacy Leader Portal Access`,
          html: emailHtml,
        }),
      })

      if (res.ok) {
        return new Response(JSON.stringify({ ok: true, method: 'resend', linkUrl: generatedLinkUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } catch (err) {
      console.error('Resend dispatch error:', err)
    }
  }

  return new Response(JSON.stringify({ ok: true, method: 'supabase_auth', linkUrl: generatedLinkUrl }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
