import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { COUNTRIES } from '@/lib/countries'

const STORAGE_KEY = 'truelegacy-locale'
type Locale = 'en' | 'es' | 'fr'

function getStored(): Locale | null {
    if (typeof window === 'undefined') return null
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'es' || v === 'fr') return v
    return null
}

function pathAndNavigatorLocale(pathname: string): Locale {
    if (pathname.includes('/morocco')) return 'fr'
    if (pathname.includes('/es/') || pathname.includes('/latam/') || pathname.includes('/south-america/')) return 'es'
    if (typeof navigator !== 'undefined' && navigator.language.startsWith('es')) return 'es'
    if (typeof navigator !== 'undefined' && navigator.language.startsWith('fr')) return 'fr'
    return 'en'
}

const LocaleContext = createContext<{
    locale: Locale
    setLocale: (locale: Locale) => void
} | null>(null)

const COUNTRY_SLUGS = new Set(COUNTRIES.map((c) => c.slug))

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const pathname = location.pathname
    const firstSegment = pathname.slice(1).split('/')[0]
    const country = firstSegment && COUNTRY_SLUGS.has(firstSegment)
        ? COUNTRIES.find((c) => c.slug === firstSegment) ?? null
        : null

    const [override, setOverrideState] = useState<Locale | null>(getStored)

    useEffect(() => {
        const stored = getStored()
        setOverrideState(stored)
    }, [pathname])

    const setLocale = useCallback((locale: Locale) => {
        localStorage.setItem(STORAGE_KEY, locale)
        setOverrideState(locale)
    }, [])

    const locale = useMemo((): Locale => {
        if (override) return override
        if (country) return country.locale
        return pathAndNavigatorLocale(pathname)
    }, [override, country, pathname])

    const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    )
}

export function useLocaleContext(): { locale: Locale; setLocale: (locale: Locale) => void } {
    const ctx = useContext(LocaleContext)
    if (!ctx) throw new Error('useLocaleContext must be used within LocaleProvider')
    return ctx
}
