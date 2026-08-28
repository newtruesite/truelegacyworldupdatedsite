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

  const body = await request.json().catch(() => ({}))
  const {
    email,
    displayName,
    slug,
    tempPassword = 'TrueLegacy2026!',
    resetLink,
    appUrl = 'https://www.truelegacyworld.com',
  } = body

  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'Valid email is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const cleanName = displayName || 'Leader'
  const cleanSlug = slug || 'leader'
  const crmLoginUrl = `${appUrl}/app`
  const settingsUrl = `${appUrl}/app/settings`
  const publicProfileUrl = `${appUrl}/d/${cleanSlug}`
  const magicLink = resetLink || crmLoginUrl

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to True Legacy — Your Leader Access & CRM Guide</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000; min-height: 100vh; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #070b14; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); background: radial-gradient(circle at 50% 0%, rgba(41, 151, 255, 0.15) 0%, transparent 70%);">
              <p style="margin: 0 0 8px 0; color: #2997ff; font-size: 11px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">OFFICIAL LEADERSHIP ACCESS</p>
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
                Welcome to the official <strong>True Legacy Leadership Platform</strong>! Your verified leader profile has been activated and is live across our global directory.
              </p>

              <!-- Credentials Box -->
              <table role="presentation" width="100%" style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; margin-bottom: 28px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 14px 0; color: #38bdf8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Your Portal Login Credentials</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; font-size: 13px; width: 140px;"><strong>CRM Portal URL:</strong></td>
                        <td style="padding: 4px 0; color: #ffffff; font-size: 13px;"><a href="${crmLoginUrl}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">${crmLoginUrl}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Username / Email:</strong></td>
                        <td style="padding: 4px 0; color: #ffffff; font-size: 13px; font-family: monospace; color: #38bdf8; font-weight: bold;">${escapeHtml(email)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Temporary Password:</strong></td>
                        <td style="padding: 4px 0; color: #ffffff; font-size: 13px;"><span style="font-family: monospace; background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 6px; font-weight: bold; color: #facc15;">${escapeHtml(tempPassword)}</span></td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Your Public Link:</strong></td>
                        <td style="padding: 4px 0; color: #ffffff; font-size: 13px;"><a href="${publicProfileUrl}" style="color: #38bdf8; text-decoration: none;">${publicProfileUrl}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Main CTA Button -->
              <div style="text-align: center; margin: 28px 0 32px 0;">
                <a href="${crmLoginUrl}" style="background-color: #2997ff; color: #000000; font-weight: 900; font-size: 15px; text-decoration: none; padding: 16px 36px; border-radius: 12px; display: inline-block; box-shadow: 0 10px 25px -5px rgba(41, 151, 255, 0.4);">
                  Sign In to Leader Dashboard &rarr;
                </a>
              </div>

              <!-- Step-by-Step Instructions -->
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                  Quick Start Guide (4 Simple Steps)
                </h3>
                
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold;">1. Sign In to Your CRM</p>
                  <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                    Visit <a href="${crmLoginUrl}" style="color: #38bdf8; text-decoration: none;">${crmLoginUrl}</a> and enter your email (<strong style="color: #ffffff;">${escapeHtml(email)}</strong>) and temporary password (<strong style="color: #facc15;">${escapeHtml(tempPassword)}</strong>).
                  </p>
                </div>

                <div style="margin-bottom: 16px;">
                  <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold;">2. Download the App to Your Mobile Phone</p>
                  <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                    Install the True Legacy CRM directly onto your phone for instant mobile access:
                  </p>
                  <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                    <li><strong>iPhone (Safari):</strong> Go to <a href="${crmLoginUrl}" style="color: #38bdf8; text-decoration: none;">${crmLoginUrl}</a> &rarr; Tap the <strong>Share</strong> button (box with arrow) &rarr; Tap <strong>"Add to Home Screen"</strong>.</li>
                    <li><strong>Android (Chrome):</strong> Go to <a href="${crmLoginUrl}" style="color: #38bdf8; text-decoration: none;">${crmLoginUrl}</a> &rarr; Tap the <strong>Three Dots (⋮)</strong> &rarr; Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  </ul>
                </div>

                <div style="margin-bottom: 16px;">
                  <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold;">3. Upload or Generate Your Studio Portrait</p>
                  <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                    Go to <a href="${settingsUrl}" style="color: #38bdf8; text-decoration: none;">Account Settings (${settingsUrl})</a> to upload or generate your official luxury True Legacy studio portrait so you look consistent alongside all leaders.
                  </p>
                </div>

                <div style="margin-bottom: 0;">
                  <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold;">4. Share Your Custom Link & Track Leads</p>
                  <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                    Your personal verified landing page is live at <a href="${publicProfileUrl}" style="color: #38bdf8; text-decoration: none;">${publicProfileUrl}</a>. Every prospect who connects with you through this link will automatically route directly into your private CRM leads list!
                  </p>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #030712; border-top: 1px solid rgba(255,255,255,0.08); text-align: center;">
              <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">Need help? Reply directly to this email or reach out to your team sponsor.</p>
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

  // 1. If Resend Key is available, dispatch directly via Resend API
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
          subject: `Welcome to True Legacy — Your Leader Portal Login & Setup Guide`,
          html: emailHtml,
        }),
      })

      if (res.ok) {
        return new Response(JSON.stringify({ ok: true, method: 'resend' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } catch (err) {
      console.error('Resend dispatch error:', err)
    }
  }

  // 2. If Resend not configured or failed, trigger Supabase Auth reset/invite
  if (supabaseUrl && serviceRoleKey) {
    try {
      const admin = createClient(supabaseUrl, serviceRoleKey)
      const { error: authError } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: settingsUrl,
        },
      })
      if (!authError) {
        return new Response(JSON.stringify({ ok: true, method: 'supabase_auth' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } catch (authErr) {
      console.error('Supabase Auth recovery error:', authErr)
    }
  }

  return new Response(JSON.stringify({ ok: true, method: 'fallback_formatted', html: emailHtml }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
