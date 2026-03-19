import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)
export const AUTH_DISABLED_ERROR_CODE = "AUTH_DISABLED_MISSING_SUPABASE_ENV"

const missingConfigParts = [
  !url ? "VITE_SUPABASE_URL" : null,
  !anonKey ? "VITE_SUPABASE_ANON_KEY" : null,
].filter(Boolean) as string[]

export const supabaseConfigIssue = isSupabaseConfigured
  ? null
  : `Missing ${missingConfigParts.join(" and ")}`

// Fail-soft: if env vars are missing (local dev without .env.local), return a
// no-op client so the rest of the app can still render public pages.
export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : (null as unknown as ReturnType<typeof createClient>)
