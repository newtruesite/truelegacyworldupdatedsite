import { goTrue } from "@/lib/netlifyAuth";
import type { User } from "gotrue-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    let isMounted = true;
    const validate = async () => {
      const stored = goTrue.currentUser();
      if (!stored) {
        if (isMounted) setLoading(false);
        return;
      }
      // Validate token (refreshes if needed); clear if expired
      try {
        await stored.jwt(false);
        if (isMounted) {
          setUser(stored);
          if (isDev) console.log("[AuthContext] Session restored");
        }
      } catch {
        if (isMounted) {
          if (isDev)
            console.log("[AuthContext] Stored session expired, clearing");
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    validate();
    return () => {
      isMounted = false;
    };
  }, [isDev]);

  // The UI contract for consumers (e.g. TrainingPage):
  // 1. loading === true: Show a spinner, don't assume logged out yet.
  // 2. loading === false && user === null: User is definitely logged out, show Auth card.
  // 3. loading === false && user !== null: User is logged in, show protected content.

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
