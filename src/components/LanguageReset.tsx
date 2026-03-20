import { getPageLang } from '@/utils/langDefaults'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function LanguageReset() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const p = pathname.toLowerCase().replace(/\/$/, '') || '/'

    // Only on home: full locale reset to English (fresh start)
    if (p === '/') {
      sessionStorage.removeItem('tl_user_chose_lang')
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith('tl_lang_'))
        .forEach((k) => sessionStorage.removeItem(k))
      localStorage.setItem('tl_lang', 'en')
      return
    }

    // For all other routes: apply route-specific default only if user
    // hasn't explicitly chosen a language via the toggle
    const userChose = sessionStorage.getItem('tl_user_chose_lang')
    if (!userChose) {
      const lang = getPageLang(pathname)
      // Only write non-English defaults so navigating to shared pages
      // (like /distributors) preserves the previous locale context
      if (lang !== 'en') {
        localStorage.setItem('tl_lang', lang)
      }
    }
  }, [pathname])

  return null
}
