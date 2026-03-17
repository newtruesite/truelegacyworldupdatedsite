import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageLang } from '@/utils/langDefaults'

export function LanguageReset() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const lang = getPageLang(pathname)
    // V20: Morocco is always French by default
    const isMorocco = pathname.toLowerCase().includes('morocco')
    if (isMorocco) {
      const userChose = sessionStorage.getItem('tl_user_chose_lang')
      if (!userChose) localStorage.setItem('tl_lang', 'fr')
      return
    }
    if (lang === 'en') {
      sessionStorage.removeItem('tl_user_chose_lang')
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith('tl_lang_'))
        .forEach((k) => sessionStorage.removeItem(k))
      localStorage.setItem('tl_lang', 'en')
    } else {
      const userChose = sessionStorage.getItem('tl_user_chose_lang')
      if (!userChose) localStorage.setItem('tl_lang', lang)
    }
  }, [pathname])

  return null
}
