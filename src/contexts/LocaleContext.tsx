import { COUNTRIES } from "@/lib/countries";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "tl_lang";
export type Locale = "en" | "es" | "fr" | "pt";

function getStored(): Locale | null {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(STORAGE_KEY) ??
    localStorage.getItem("truelegacy-locale");
  if (raw === "en" || raw === "es" || raw === "fr" || raw === "pt") return raw;
  return null;
}

// V20: Morocco is always French — brute force
function pathAndNavigatorLocale(pathname: string): Locale {
  if (pathname.includes("/morocco")) return "fr";
  if (
    pathname.includes("/es/") ||
    pathname.includes("/latam/") ||
    pathname.includes("/south-america/")
  )
    return "es";
  if (typeof navigator !== "undefined" && navigator.language.startsWith("es"))
    return "es";
  if (typeof navigator !== "undefined" && navigator.language.startsWith("fr"))
    return "fr";
  return "en";
}

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

const COUNTRY_SLUGS = new Set(COUNTRIES.map((c) => c.slug));
const SPANISH_LATAM_SLUGS = ["mexico", "paraguay", "colombia"] as const;

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const firstSegment = pathname.slice(1).split("/")[0];
  const country =
    firstSegment && COUNTRY_SLUGS.has(firstSegment)
      ? (COUNTRIES.find((c) => c.slug === firstSegment) ?? null)
      : null;

  const [override, setOverrideState] = useState<Locale | null>(getStored);

  useEffect(() => {
    const first = pathname.slice(1).split("/")[0];
    const isCountryRoute = COUNTRY_SLUGS.has(first);
    const thisCountrySlug = isCountryRoute ? first : "";
    const lastCountry = window.sessionStorage.getItem("tl_last_country") || "";

    // When switching between different country pages, clear user language choice
    // so the new country's default takes effect
    if (thisCountrySlug && lastCountry && thisCountrySlug !== lastCountry) {
      window.sessionStorage.removeItem("tl_user_chose_lang");
      window.localStorage.removeItem(STORAGE_KEY);
    }

    if (thisCountrySlug) {
      window.sessionStorage.setItem("tl_last_country", thisCountrySlug);
    }

    // Read user choice AFTER potential clear above
    const userChoseLang = window.sessionStorage.getItem("tl_user_chose_lang");

    if (isCountryRoute && !userChoseLang) {
      // No explicit user choice on a country page — apply country default
      const isSpanishLatam = SPANISH_LATAM_SLUGS.includes(thisCountrySlug as (typeof SPANISH_LATAM_SLUGS)[number]);
      const isMorocco = thisCountrySlug === "morocco";
      const defaultLocale: Locale = isSpanishLatam
        ? "es"
        : isMorocco
          ? "fr"
          : (COUNTRIES.find((c) => c.slug === thisCountrySlug)?.locale ?? "en") as Locale;
      window.localStorage.setItem(STORAGE_KEY, defaultLocale);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOverrideState(defaultLocale);
    } else {
      // Either user explicitly chose a language, or this is a non-country route
      // In both cases, keep whatever is stored
      const stored = getStored();
      setOverrideState(stored);
    }
  }, [pathname]);

  const setLocale = useCallback((locale: Locale) => {
    try {
      sessionStorage.setItem("tl_user_chose_lang", "true");
    } catch {
      /* ignore */
    }
    localStorage.setItem(STORAGE_KEY, locale);
    setOverrideState(locale);
  }, []);

  const locale = useMemo((): Locale => {
    if (override) return override;
    if (country) return country.locale;
    return pathAndNavigatorLocale(pathname);
  }, [override, country, pathname]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocaleContext(): {
  locale: Locale;
  setLocale: (locale: Locale) => void;
} {
  const ctx = useContext(LocaleContext);
  if (!ctx)
    throw new Error("useLocaleContext must be used within LocaleProvider");
  return ctx;
}
