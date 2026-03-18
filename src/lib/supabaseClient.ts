import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // Fail-soft: log the configuration issue but still create a client
  // so the rest of the app can render instead of hard-crashing.
  // Supabase calls will fail until env vars are correctly configured.
  console.error(
    "Supabase URL or anon key missing from env; auth features will be disabled.",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://invalid-supabase-url.local",
  supabaseAnonKey || "invalid-anon-key",
);
