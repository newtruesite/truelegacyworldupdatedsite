import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    let isMounted = true;

    // Check configuration first
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Wrap in try-catch to catch extreme network errors that bypass the promise rejection
    try {
      supabase.auth
        .getSession()
        .then((result: { data: { session: Session | null } }) => {
          if (!isMounted) return;
          const currentSession = result.data.session;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (isDev) {
            if (currentSession?.user) {
              console.log("[AuthContext] Session loaded successfully for user");
            } else {
              console.log("[AuthContext] No active session found");
            }
          }

          setLoading(false);
        })
        .catch((error: unknown) => {
          if (!isMounted) return;
          if (isDev)
            console.error("[AuthContext] Supabase getSession error:", error);
          setLoading(false);
        });

      const subscriptionResult: {
        data: { subscription: { unsubscribe: () => void } };
      } = supabase.auth.onAuthStateChange(
        (_event: string, nextSession: Session | null) => {
          if (!isMounted) return;
          if (isDev) console.log(`[AuthContext] Auth state changed: ${_event}`);
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          setLoading(false); // just in case it fires while still loading
        },
      );

      return () => {
        isMounted = false;
        subscriptionResult.data.subscription.unsubscribe();
      };
    } catch (err) {
      if (!isMounted) return;
      if (isDev)
        console.error("[AuthContext] Supabase initialization failed:", err);
      setLoading(false);
    }
  }, []);

  // The UI contract for consumers (e.g. TrainingPage):
  // 1. loading === true: Show a spinner, don't assume logged out yet.
  // 2. loading === false && user === null: User is definitely logged out, show Auth card.
  // 3. loading === false && user !== null: User is logged in, show protected content.

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
