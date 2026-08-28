import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const leadersList = [
  { slug: 'alex-gonzalez', name: 'Alex Gonzalez', email: 'photosbyalexg2541@icloud.com', pass: 'Legacy@Alex2026!' },
  { slug: 'angel-mok', name: 'Angel Mok E Lin', email: 'kangenlover88@gmail.com', pass: 'Legacy@Angel2026!' },
  { slug: 'emanuela', name: 'Emanuela', email: 'immanuelladoustova@gmail.com', pass: 'Legacy@Emanuela2026!' },
  { slug: 'jesse-schexnayder', name: 'Jesse Schexnayder', email: 'jesse@hotshotzpromo.com', pass: 'Legacy@Jesse2026!' },
  { slug: 'magaly-cardona', name: 'Magaly Cardona', email: 'magyc14@hotmail.com', pass: 'Legacy@Magaly2026!' },
  { slug: 'mehdi-cohen', name: 'Mehdi Cohen', email: 'mehdicohen1@proton.me', pass: 'Legacy@Mehdi2026!' },
  { slug: 'ming-way-sia', name: 'Ming-Way Sia', email: 'mingwaysia@gmail.com', pass: 'Legacy@Ming2026!' },
  { slug: 'ryan-pool', name: 'Ryan Pool Sr', email: 'ryanpool9@yahoo.com', pass: 'Legacy@Ryan2026!' },
  { slug: 'simon-loh', name: 'Simon Loh', email: 'symenloh@gmail.com', pass: 'Legacy@Simon2026!' },
  { slug: 'veronica-calafat', name: 'Veronica Calafat', email: 'verocalafat@yahoo.es', pass: 'Legacy@Veronica2026!' },
  { slug: 'zah-naderi', name: 'Zah Naderi', email: 'zahnaderi7@gmail.com', pass: 'Legacy@Zah2026!' },
]

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Missing service credentials' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Get all existing users
  const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const allUsers = usersData?.users || []

  const results = []

  for (const leader of leadersList) {
    try {
      const { data: dist } = await admin
        .from('crm_distributors')
        .select('id, slug, display_name')
        .eq('slug', leader.slug)
        .maybeSingle()

      if (!dist) {
        results.push({ leader: leader.slug, status: 'distributor_not_found' })
        continue
      }

      const existing = allUsers.find(
        (u) => u.email?.toLowerCase() === leader.email.toLowerCase()
      )

      let userId = existing?.id

      if (existing) {
        const { error: updateErr } = await admin.auth.admin.updateUserById(existing.id, {
          password: leader.pass,
          email_confirm: true,
          user_metadata: { name: leader.name },
        })
        if (updateErr) {
          results.push({ leader: leader.slug, status: 'update_failed', error: updateErr.message })
          continue
        }
      } else {
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
          email: leader.email,
          password: leader.pass,
          email_confirm: true,
          user_metadata: { name: leader.name },
        })
        if (createErr || !created?.user) {
          results.push({ leader: leader.slug, status: 'create_failed', error: createErr?.message })
          continue
        }
        userId = created.user.id
      }

      await admin
        .from('crm_distributors')
        .update({
          auth_user_id: userId,
          login_email: leader.email.toLowerCase(),
          active: true,
          accepting_leads: true,
        })
        .eq('id', dist.id)

      await admin
        .from('crm_memberships')
        .upsert(
          {
            user_id: userId,
            distributor_id: dist.id,
            role: leader.slug === 'mehdi-cohen' ? 'admin' : 'distributor',
            active: true,
          },
          { onConflict: 'user_id' }
        )

      results.push({ leader: leader.slug, email: leader.email, status: 'success', pass: leader.pass })
    } catch (err: any) {
      results.push({ leader: leader.slug, status: 'exception', error: err?.message })
    }
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
