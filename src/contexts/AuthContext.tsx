import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient"
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
  setUser: (u: User | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isDev = import.meta.env.DEV

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Hydrate from existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (isDev) console.log("[AuthContext] Session hydrated", session?.user?.email ?? "none")
    })

    // Subscribe to future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (isDev) console.log("[AuthContext] Auth state change", _event)
    })

    return () => subscription.unsubscribe()
  }, [isDev])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error("Auth not configured")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error("Auth not configured")
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
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
    <AuthContext.Provider value={{ user, loading, setUser, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
