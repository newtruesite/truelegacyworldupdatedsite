export type EventRegion = 'latam' | 'global' | 'asia' | 'africa'

export interface EventTimezone {
  region: string
  time: string
}

export interface TLEvent {
  id: string
  title: string
  date: string
  image: string
  latamImage?: string
  registerUrl: string
  latamZoomUrl: string
  timezones: EventTimezone[]
  latamTimezones: EventTimezone[]
  description_en: string
  description_es: string
  description_fr: string
}

export const UPCOMING_EVENTS: TLEvent[] = [
  {
    id: 'masterclass-march-2026',
    title: 'TRUE LEGACY MASTERCLASS',
    date: 'March 29th, 2026',
    image: '/assets/event-masterclass.png',
    latamImage: '/assets/event-latam-flyer.png',
    registerUrl: 'https://tr.ee/8yBqHZ',
    latamZoomUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    timezones: [
      { region: 'Malaysia', time: '8:00 PM' },
      { region: 'India', time: '5:30 PM' },
      { region: 'UAE', time: '4:00 PM' },
      { region: 'Turkey', time: '3:00 PM' },
      { region: 'Nigeria', time: '1:00 PM' },
      { region: 'Miami', time: '7:00 AM' },
    ],
    latamTimezones: [
      { region: 'Colombia', time: '7:00 PM' },
      { region: 'EST', time: '8:00 PM' },
      { region: 'PST', time: '5:00 PM' },
    ],
    description_en: `This is not just another training. This is a 3-hour power-packed Masterclass designed to help you move to the next level in Enagic — with clarity, strategy, and real execution.

🚨 Entry is strictly by registration only

✅ Open to you and your prospects
✅ Designed for growth, duplication & rank advancement
✅ Limited seats — personalised attention will be given

If you are serious about building momentum in 2026, this is where you need to be.

⏳ Seats are limited. Register now and show up ready. 💥`,
    description_es: `Esto no es solo otro entrenamiento. Este es un Masterclass de 3 horas diseñado para llevarte al siguiente nivel en Enagic — con claridad, estrategia y ejecución real.

🚨 La entrada es estrictamente por registro

✅ Abierto para ti y tus prospectos
✅ Diseñado para el crecimiento, duplicación y avance de rango
✅ Asientos limitados — se dará atención personalizada

Si estás serio sobre construir impulso en 2026, aquí es donde debes estar.

⏳ Los asientos son limitados. Regístrate ahora y preséntate listo. 💥`,
    description_fr: `Ce n'est pas juste une autre formation. C'est une Masterclass de 3 heures conçue pour vous aider à passer au niveau supérieur dans Enagic — avec clarté, stratégie et exécution réelle.

🚨 L'entrée est strictement sur inscription

✅ Ouvert à vous et vos prospects
✅ Conçu pour la croissance, la duplication et l'avancement de rang
✅ Places limitées — attention personnalisée garantie

Si vous êtes sérieux au sujet de construire l'élan en 2026, c'est là où vous devez être.

⏳ Places limitées. Inscrivez-vous maintenant. 💥`,
  },
]

const COUNTRY_TO_REGION: Record<string, EventRegion> = {
  brazil: 'latam',
  mexico: 'latam',
  colombia: 'latam',
  paraguay: 'latam',
  india: 'asia',
  uae: 'asia',
  malaysia: 'asia',
  nigeria: 'africa',
  morocco: 'africa',
}

const DEFAULT_EVENT_REGION: EventRegion = 'global'

export function getEventRegion(countrySlug: string | undefined): EventRegion {
  if (!countrySlug) return DEFAULT_EVENT_REGION
  const lower = countrySlug.toLowerCase()
  return COUNTRY_TO_REGION[lower] ?? DEFAULT_EVENT_REGION
}

export function getEventsByRegion(): TLEvent[] {
  // Currently all events are shown regardless of region; filter can be added later
  return UPCOMING_EVENTS
}
