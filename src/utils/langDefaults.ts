const SPANISH_ROUTES = new Set([
  '/colombia',
  '/mexico',
  '/paraguay',
  '/events/latam',
  '/latam/distributors',
])
const FRENCH_ROUTES = new Set(['/morocco'])
const PORTUGUESE_ROUTES = new Set(['/brazil'])

const LATAM_PREFIXES = ['/colombia', '/mexico', '/paraguay', '/latam']
const FRENCH_PREFIXES = ['/morocco']
const PORTUGUESE_PREFIXES = ['/brazil']

export function getPageLang(pathname: string): string {
  const p = pathname.toLowerCase().replace(/\/$/, '') || '/'
  if (SPANISH_ROUTES.has(p)) return 'es'
  if (FRENCH_ROUTES.has(p)) return 'fr'
  if (PORTUGUESE_ROUTES.has(p)) return 'pt'
  if (LATAM_PREFIXES.some(prefix => p.startsWith(prefix + '/'))) return 'es'
  if (FRENCH_PREFIXES.some(prefix => p.startsWith(prefix + '/'))) return 'fr'
  if (PORTUGUESE_PREFIXES.some(prefix => p.startsWith(prefix + '/'))) return 'pt'
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
