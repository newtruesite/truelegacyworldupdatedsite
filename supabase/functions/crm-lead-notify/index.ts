import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;')

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!supabaseUrl || !serviceRoleKey || !resendKey) return new Response(JSON.stringify({ error: 'Notification service is not configured' }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const { leadId } = await request.json().catch(() => ({ leadId: '' }))
  if (!leadId || typeof leadId !== 'string') return new Response(JSON.stringify({ error: 'Invalid lead' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const admin = createClient(supabaseUrl, serviceRoleKey)
  const { data: queued } = await admin.from('crm_notification_queue').select('*').eq('lead_id', leadId).in('status', ['pending', 'failed']).lt('attempts', 4).maybeSingle()
  if (!queued) return new Response(JSON.stringify({ ok: true, skipped: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  await admin.from('crm_notification_queue').update({ status: 'processing', attempts: queued.attempts + 1, last_error: null }).eq('id', queued.id)
  const { data: lead, error: leadError } = await admin.from('crm_leads').select('*, assigned:crm_distributors!crm_leads_assigned_distributor_id_fkey(display_name)').eq('id', leadId).single()
  if (leadError || !lead) {
    await admin.from('crm_notification_queue').update({ status: 'failed', last_error: 'Lead could not be loaded' }).eq('id', queued.id)
    return new Response(JSON.stringify({ error: 'Lead could not be loaded' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const assignedName = Array.isArray(lead.assigned) ? lead.assigned[0]?.display_name : lead.assigned?.display_name
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('CRM_EMAIL_FROM') || 'True Legacy <hello@updates.mehdicohen.com>',
      to: [queued.recipient_email],
      subject: `New True Legacy lead: ${lead.full_name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827"><h1 style="font-size:24px">New True Legacy application</h1><p>A new contact has been securely added to the team CRM.</p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Name</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(lead.full_name)}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Email</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(lead.email)}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Country</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(lead.country)}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Interest</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(lead.interest)}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Attribution</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(lead.attribution_method)}</td></tr><tr><td style="padding:8px"><strong>Assigned to</strong></td><td style="padding:8px">${escapeHtml(assignedName || 'Unassigned')}</td></tr></table><p style="margin-top:24px"><a href="https://truelegacyworld.com/crm" style="background:#06b6d4;color:white;padding:12px 18px;border-radius:10px;text-decoration:none">Open the CRM</a></p></div>`,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    await admin.from('crm_notification_queue').update({ status: 'failed', last_error: detail.slice(0, 1000) }).eq('id', queued.id)
    return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  await admin.from('crm_notification_queue').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', queued.id)
  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})

