import {
    AUTH_DISABLED_ERROR_CODE,
    isSupabaseConfigured,
    supabase,
    supabaseConfigIssue,
} from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"

type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthEnabled: boolean
  authDisabledReason: string | null
  setUser: (u: User | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthEnabled: isSupabaseConfigured,
  authDisabledReason: supabaseConfigIssue,
  setUser: () => {},
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const isDev = import.meta.env.DEV

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    // Hydrate from existing session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (isDev)
          console.log("[AuthContext] Session hydrated", session?.user?.email ?? "none")
      })
      .catch((error: unknown) => {
        setUser(null)
        if (isDev) console.error("[AuthContext] Session hydration failed", error)
      })
      .finally(() => {
        setLoading(false)
      })

    // Subscribe to future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (isDev) console.log("[AuthContext] Auth state change", _event)
    })

    return () => subscription.unsubscribe()
  }, [isDev])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error(AUTH_DISABLED_ERROR_CODE)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error(AUTH_DISABLED_ERROR_CODE)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    // Session returned immediately → email confirmation is disabled, user is in.
    if (data.session) {
      setUser(data.session.user)
      return
    }

    // No session returned. This happens when:
    //   a) Email confirmation is still enabled in Supabase (Dashboard → Auth → Settings → disable it), OR
    //   b) The email already exists (Supabase silently returns no-session to prevent enumeration).
    // Attempt signIn as a fallback — succeeds for case (b) with correct password.
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (!signInError && signInData.session) {
      setUser(signInData.session.user)
      return
    }

    // Both signup and signin failed to produce a session.
    // If signIn says "not confirmed", email confirmation is still enabled on the server.
    // Go to: Supabase Dashboard → Authentication → Settings → disable "Enable email confirmations" → Save changes
    const signInMsg = (signInError as { message?: string } | null)?.message?.toLowerCase() ?? ""
    if (signInMsg.includes("not confirmed") || signInMsg.includes("email_not_confirmed")) {
      throw new Error("SUPABASE_EMAIL_CONFIRMATION_ENABLED")
    }
    // Otherwise the email already exists — surface that directly.
    throw new Error("user_already_exists")
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthEnabled: isSupabaseConfigured,
        authDisabledReason: supabaseConfigIssue,
        setUser,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
