// Single source for all event registration/join CTAs
export const EVENTS_FORM_URL = 'https://tr.ee/8yBqHZ'

export type EventRegion = 'latam' | 'global'

export interface EventTimezone {
  region: string
  time: string
}

export interface TLEvent {
  id: string
  title: string
  title_es?: string
  title_fr?: string
  title_pt?: string
  date: string
  date_es?: string
  date_fr?: string
  date_pt?: string
  image?: string
  latamImage?: string
  registerUrl: string
  latamZoomUrl: string
  joinUrl?: string
  timezones: EventTimezone[]
  latamTimezones: EventTimezone[]
  description_en: string
  description_es: string
  description_fr: string
  description_pt?: string
  regions?: EventRegion[]
  countries?: string[]
  hasFirstTimePrompt?: boolean
}

export const UPCOMING_EVENTS: TLEvent[] = [
  {
    id: 'latam-tuesday-weekly',
    title: 'LATAM SPANISH WEEKLY CALL',
    title_es: 'PRESENTACIÓN SEMANAL LATAM',
    title_fr: 'PRÉSENTATION HEBDOMADAIRE LATAM',
    title_pt: 'APRESENTAÇÃO SEMANAL LATAM',
    date: 'Every Thursday',
    date_es: 'Todos los Jueves',
    date_fr: 'Chaque Jeudi',
    date_pt: 'Toda Quinta-feira',
    image: '/assets/event-latam-flyer.png',
    latamImage: '/assets/event-latam-flyer.png',
    registerUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    latamZoomUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    joinUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    timezones: [
      { region: 'Eastern', time: '8:00 PM' },
    ],
    latamTimezones: [
      { region: 'Eastern', time: '8:00 PM' },
    ],
    description_en: `Join the True Legacy LATAM Spanish call every Thursday at 8:00 p.m. Eastern.

✅ Product education and community updates
✅ Practical team-building support
✅ Connect with the regional LATAM community

Click below to join the Zoom directly.`,
    description_es: `Únete a la llamada semanal de True Legacy LATAM en español cada jueves a las 8:00 p. m., hora del Este.

✅ Educación sobre productos y novedades de la comunidad
✅ Apoyo práctico para desarrollar tu equipo
✅ Conéctate con la comunidad regional LATAM

Haz clic abajo para entrar al Zoom directamente.`,
    description_fr: `Rejoignez l'appel hebdomadaire True Legacy LATAM en espagnol chaque jeudi à 20 h, heure de l'Est.

✅ Formation aux produits et actualités de la communauté
✅ Soutien pratique au développement d'équipe
✅ Connectez-vous avec la communauté régionale LATAM

Cliquez ci-dessous pour accéder directement au Zoom.`,
    description_pt: `Participe da chamada semanal True Legacy LATAM em espanhol toda quinta-feira às 20h, horário do leste dos EUA.

✅ Educação sobre produtos e novidades da comunidade
✅ Apoio prático para desenvolver sua equipe
✅ Conecte-se com a comunidade regional LATAM

Clique abaixo para acessar o Zoom diretamente.`,
    regions: ['latam'],
    hasFirstTimePrompt: false,
  },
  {
    id: 'duo-presentation-thursday',
    title: 'GLOBAL ENGLISH WEEKLY CALL',
    title_es: 'PRESENTACIÓN SEMANAL TRUE LEGACY',
    title_fr: 'PRÉSENTATION HEBDOMADAIRE TRUE LEGACY',
    title_pt: 'APRESENTAÇÃO SEMANAL TRUE LEGACY',
    date: 'Every Wednesday',
    date_es: 'Todos los Miércoles',
    date_fr: 'Chaque Mercredi',
    date_pt: 'Toda Quarta-feira',
    image: '/assets/event-global-flyer-UKa8W2ck.jpg',
    registerUrl: 'https://us02web.zoom.us/j/87614486219?pwd=YcmJqE7nyYnShh2jdFVz4kRdFygQpv.1#success',
    latamZoomUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    joinUrl: 'https://us02web.zoom.us/j/87614486219?pwd=YcmJqE7nyYnShh2jdFVz4kRdFygQpv.1#success',
    timezones: [
      { region: 'Eastern', time: '8:30 PM' },
    ],
    latamTimezones: [
      { region: 'Eastern', time: '8:30 PM' },
    ],
    description_en: `Join the True Legacy global English call every Wednesday at 8:30 p.m. Eastern.

✅ Open to members, prospects, and guests
✅ Learn about the products and the independent distributor opportunity
✅ Ask questions live

Click below to join the Zoom directly.`,
    description_es: `Únete a la llamada global de True Legacy en inglés cada miércoles a las 8:30 p. m., hora del Este.

✅ Abierto a miembros, prospectos e invitados
✅ Conoce los productos y la oportunidad como distribuidor independiente
✅ Haz preguntas en vivo

Haz clic abajo para entrar al Zoom directamente.`,
    description_fr: `Rejoignez l'appel mondial True Legacy en anglais chaque mercredi à 20 h 30, heure de l'Est.

✅ Ouvert aux membres, prospects et invités
✅ Découvrez les produits et l'opportunité de distributeur indépendant
✅ Posez des questions en direct

Cliquez ci-dessous pour accéder directement au Zoom.`,
    description_pt: `Participe da chamada global True Legacy em inglês toda quarta-feira às 20h30, horário do leste dos EUA.

✅ Aberto a membros, prospects e convidados
✅ Conheça os produtos e a oportunidade como distribuidor independente
✅ Faça perguntas ao vivo

Clique abaixo para acessar o Zoom diretamente.`,
    regions: ['global'],
    hasFirstTimePrompt: false,
  },
]

const COUNTRY_TO_REGION: Record<string, EventRegion> = {
  brazil: 'latam',
  mexico: 'latam',
  colombia: 'latam',
  paraguay: 'latam',
}

const DEFAULT_EVENT_REGION: EventRegion = 'global'

export function getEventRegion(countrySlug: string | undefined): EventRegion {
  if (!countrySlug) return DEFAULT_EVENT_REGION
  const lower = countrySlug.toLowerCase()
  return COUNTRY_TO_REGION[lower] ?? DEFAULT_EVENT_REGION
}

export function getEventsByRegion(region?: EventRegion): TLEvent[] {
  const filtered = UPCOMING_EVENTS.filter(event => {
    if (!event.regions || event.regions.length === 0) return true
    if (region && event.regions.includes(region)) return true
    return false
  })
  // Deduplicate by event id
  const seen = new Set<string>()
  return filtered.filter(event => {
    if (seen.has(event.id)) return false
    seen.add(event.id)
    return true
  })
}

// Maps "Miami" (legacy) → "EST" and translates known region names by locale.
export function translateEventTimezoneRegion(region: string, locale: string): string {
  // Legacy fallback: "Miami" was used before EST
  const normalized = region === 'Miami' ? 'EST' : region
  if (locale === 'en') return normalized

  const regionMap: Record<string, Record<string, string>> = {
    Malaysia: { es: 'Malasia',  fr: 'Malaisie', pt: 'Malásia'  },
    India:    { es: 'India',    fr: 'Inde',      pt: 'Índia'    },
    UAE:      { es: 'EAU',      fr: 'EAU',       pt: 'EAU'      },
    Turkey:   { es: 'Turquía',  fr: 'Turquie',   pt: 'Turquia'  },
    Nigeria:  { es: 'Nigeria',  fr: 'Nigéria',   pt: 'Nigéria'  },
    Colombia: { es: 'Colombia', fr: 'Colombie',  pt: 'Colômbia' },
    Miami:    { es: 'EST',      fr: 'EST',        pt: 'EST'      },
  }

  const map = regionMap[region]
  if (!map) return normalized
  return map[locale] ?? normalized
}

// Translates AM/PM suffixes and English day names inside a time string to the
// given locale.  French output uses 24-hour notation; es/pt use a.m./p.m.
export function translateEventTimezoneTime(time: string, locale: string): string {
  if (locale === 'en') return time

  const dayNames: Record<string, Record<string, string>> = {
    Monday:    { es: 'lunes',        fr: 'lundi',    pt: 'segunda-feira' },
    Tuesday:   { es: 'martes',       fr: 'mardi',    pt: 'terça-feira'   },
    Wednesday: { es: 'miércoles',    fr: 'mercredi', pt: 'quarta-feira'  },
    Thursday:  { es: 'jueves',       fr: 'jeudi',    pt: 'quinta-feira'  },
    Friday:    { es: 'viernes',      fr: 'vendredi', pt: 'sexta-feira'   },
    Saturday:  { es: 'sábado',       fr: 'samedi',   pt: 'sábado'        },
    Sunday:    { es: 'domingo',      fr: 'dimanche', pt: 'domingo'       },
  }

  let result = time

  // Translate day names (appear inside parentheses e.g. "(Friday)")
  for (const [en, translations] of Object.entries(dayNames)) {
    if (result.includes(en)) {
      result = result.replace(en, translations[locale] ?? en)
    }
  }

  if (locale === 'fr') {
    // Convert to 24-hour clock and strip the AM/PM marker
    result = result.replace(/(\d{1,2}):(\d{2})\s*PM/i, (_, h, m) => {
      const h24 = parseInt(h, 10) === 12 ? 12 : parseInt(h, 10) + 12
      return `${String(h24).padStart(2, '0')}:${m}`
    })
    result = result.replace(/(\d{1,2}):(\d{2})\s*AM/i, (_, h, m) => {
      const h24 = parseInt(h, 10) === 12 ? 0 : parseInt(h, 10)
      return `${String(h24).padStart(2, '0')}:${m}`
    })
  } else {
    // es / pt: lowercase a.m. / p.m. with dots
    result = result.replace(/\bAM\b/gi, 'a.m.')
    result = result.replace(/\bPM\b/gi, 'p.m.')
  }

  return result.trim()
}
