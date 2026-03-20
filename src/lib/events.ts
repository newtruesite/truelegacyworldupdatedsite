// Single source for all event registration/join CTAs
export const EVENTS_FORM_URL = 'https://tr.ee/8yBqHZ'

export type EventRegion = 'latam' | 'global' | 'asia' | 'africa'

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
    title: 'LATAM WEEKLY PRESENTATION',
    title_es: 'PRESENTACIÓN SEMANAL LATAM',
    title_fr: 'PRÉSENTATION HEBDOMADAIRE LATAM',
    title_pt: 'APRESENTAÇÃO SEMANAL LATAM',
    date: 'Every Tuesday',
    date_es: 'Todos los Martes',
    date_fr: 'Chaque Mardi',
    date_pt: 'Toda Terça-feira',
    image: '/assets/event-latam-flyer.png',
    latamImage: '/assets/event-latam-flyer.png',
    registerUrl: 'https://tr.ee/8yBqHZ',
    latamZoomUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    joinUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    timezones: [
      { region: 'Colombia', time: '7:00 PM' },
      { region: 'EST', time: '8:00 PM' },
      { region: 'PST', time: '5:00 PM' },
    ],
    latamTimezones: [
      { region: 'Colombia', time: '7:00 PM' },
      { region: 'EST', time: '8:00 PM' },
      { region: 'PST', time: '5:00 PM' },
    ],
    description_en: `Join the LATAM weekly Zoom presentation every Tuesday — designed for Spanish and Portuguese-speaking communities across South America.

✅ Share Enagic's life-changing health products
✅ Build your True Legacy business in South America
✅ Connect with the regional LATAM community

Click "Join Now" to enter the Zoom directly.`,
    description_es: `Únete a la presentación semanal LATAM cada martes — diseñada para las comunidades hispanohablantes y lusohablantes de Sudamérica.

✅ Comparte los productos de salud Enagic que cambian vidas
✅ Construye tu negocio True Legacy en Sudamérica
✅ Conéctate con la comunidad regional LATAM

Haz clic en "Unirse Ahora" para entrar al Zoom directamente.`,
    description_fr: `Rejoignez la présentation hebdomadaire LATAM chaque mardi — conçue pour les communautés hispanophones et lusophones d'Amérique du Sud.

✅ Partagez les produits de santé Enagic qui changent la vie
✅ Développez votre activité True Legacy en Amérique du Sud
✅ Connectez-vous avec la communauté régionale LATAM

Cliquez sur "Rejoindre" pour accéder directement au Zoom.`,
    description_pt: `Participe da apresentação semanal LATAM toda terça-feira — projetada para as comunidades de língua espanhola e portuguesa da América do Sul.

✅ Compartilhe os produtos de saúde da Enagic que mudam vidas
✅ Construa seu negócio True Legacy na América do Sul
✅ Conecte-se com a comunidade regional LATAM

Clique em "Entrar Agora" para acessar o Zoom diretamente.`,
    regions: ['latam'],
    hasFirstTimePrompt: false,
  },
  {
    id: 'duo-presentation-thursday',
    title: 'TRUE LEGACY WEEKLY PRESENTATION',
    title_es: 'PRESENTACIÓN SEMANAL TRUE LEGACY',
    title_fr: 'PRÉSENTATION HEBDOMADAIRE TRUE LEGACY',
    title_pt: 'APRESENTAÇÃO SEMANAL TRUE LEGACY',
    date: 'Every Thursday',
    date_es: 'Todos los Jueves',
    date_fr: 'Chaque Jeudi',
    date_pt: 'Toda Quinta-feira',
    image: '/assets/event-global-flyer-UKa8W2ck.jpg',
    registerUrl: 'https://tr.ee/8yBqHZ',
    latamZoomUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
    joinUrl: 'https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success',
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
    description_en: `Join True Legacy's weekly Zoom presentation every Thursday — an open introduction to the Enagic business and health products available in 51+ countries.

✅ Open to members, prospects, and guests
✅ Learn about building income across 51+ countries
✅ Ask questions live

Click "Join Now" to enter the Zoom directly.`,
    description_es: `Únete a la presentación semanal de True Legacy cada jueves — una introducción abierta al negocio Enagic y productos de salud disponibles en más de 51 países.

✅ Abierto a miembros, prospectos e invitados
✅ Aprende a construir ingresos en más de 51 países
✅ Haz preguntas en vivo

Haz clic en "Unirse Ahora" para entrar al Zoom directamente.`,
    description_fr: `Rejoignez la présentation hebdomadaire de True Legacy chaque jeudi — une introduction ouverte à l'activité Enagic et aux produits de santé disponibles dans plus de 51 pays.

✅ Ouvert aux membres, prospects et invités
✅ Découvrez comment construire un revenu dans 51+ pays
✅ Posez des questions en direct

Cliquez sur "Rejoindre" pour accéder directement au Zoom.`,
    description_pt: `Participe da apresentação semanal da True Legacy toda quinta-feira — uma introdução aberta ao negócio Enagic e produtos de saúde disponíveis em mais de 51 países.

✅ Aberto a membros, prospects e convidados
✅ Aprenda a construir renda em mais de 51 países
✅ Faça perguntas ao vivo

Clique em "Entrar Agora" para acessar o Zoom diretamente.`,
    regions: ['global', 'latam'],
    hasFirstTimePrompt: false,
  },
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
    title_es: 'CLASE MAGISTRAL SOBRE EL VERDADERO LEGADO',
    title_fr: 'CLASSE MAGISTRALE VRAI HÉRITAGE',
    title_pt: 'AULA MAGISTRAL VERDADEIRO LEGADO',
    regions: ['global', 'latam'],
    hasFirstTimePrompt: true,
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
