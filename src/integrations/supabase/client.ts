import { createClient } from '@supabase/supabase-js'

// These are browser-safe public project identifiers, never service-role credentials.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://mzadjxuylfphlpytmwfs.supabase.co'
const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)?.trim() || 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1'

export const crmConfigured = Boolean(supabaseUrl && supabaseKey)

export const crmSupabase = crmConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'true-legacy-world-crm-auth',
      },
    })
  : null
