const SPANISH_ROUTES = new Set([
  '/colombia',
  '/mexico',
  '/paraguay',
  '/brazil',
  '/events/latam',
  '/latam/distributors',
])
const FRENCH_ROUTES = new Set(['/morocco'])

const LATAM_PREFIXES = ['/colombia', '/mexico', '/brazil', '/paraguay', '/latam']
const FRENCH_PREFIXES = ['/morocco']

export function getPageLang(pathname: string): string {
  const p = pathname.toLowerCase().replace(/\/$/, '') || '/'
  if (SPANISH_ROUTES.has(p)) return 'es'
  if (FRENCH_ROUTES.has(p)) return 'fr'
  if (LATAM_PREFIXES.some(prefix => p.startsWith(prefix + '/'))) return 'es'
  if (FRENCH_PREFIXES.some(prefix => p.startsWith(prefix + '/'))) return 'fr'
  return 'en'
}

export function getActiveLang(pathname: string): string {
  const pageLang = getPageLang(pathname)
  const key = 'tl_lang_' + pathname.replace(/[^a-z0-9/]/gi, '_')
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(key)
    if (stored) return stored
  }
  return pageLang
}

export function setUserLang(pathname: string, lang: string): void {
  const key = 'tl_lang_' + pathname.replace(/[^a-z0-9/]/gi, '_')
  if (typeof window !== 'undefined') sessionStorage.setItem(key, lang)
}
