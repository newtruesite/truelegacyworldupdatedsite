import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then((result: { data: { session: Session | null } }) => {
      const currentSession = result.data.session
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)
    })

    const subscriptionResult: { data: { subscription: { unsubscribe: () => void } } } =
      supabase.auth.onAuthStateChange((_event: string, nextSession: Session | null) => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
      })

    return () => {
      subscriptionResult.data.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
