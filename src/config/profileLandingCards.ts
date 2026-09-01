import {
  Sparkles,
  Droplets,
  Radio,
  BriefcaseBusiness,
  GraduationCap,
  Package,
  CalendarDays,
  ShowerHead,
  Flame,
  type LucideIcon,
} from 'lucide-react'

export interface ProfileLandingCardConfig {
  id: string
  displayOrder: number
  active: boolean
  isNew?: boolean
  isComingSoon?: boolean
  numberLabel: string
  categoryLabel: {
    en: string
    es: string
    fr?: string
  }
  eyebrow: {
    en: string
    es: string
    fr?: string
  }
  title: {
    en: string
    es: string
    fr?: string
  }
  description: {
    en: (firstName: string) => string
    es: (firstName: string) => string
    fr?: (firstName: string) => string
  }
  ctaText: {
    en: string
    es: string
    fr?: string
  }
  image?: string
  imageAlt: string
  cardType: 'duo' | 'k8' | 'emguarde' | 'presentation' | 'academy' | 'collection' | 'anespa' | 'events' | string
  accentColor: {
    borderGlow: string
    gradient: string
    iconBg: string
    badgeText: string
    btnBg: string
    glowBlur: string
    textHighlight: string
  }
  icon: LucideIcon
  analyticsInterest: string
  getPath: (slug: string) => string
  supportedCountries?: string[]
  supportedLanguages?: string[]
}

export const PROFILE_LANDING_CARDS: ProfileLandingCardConfig[] = [
  // 01. Meet the True Legacy Duo
  {
    id: 'duo',
    displayOrder: 1,
    active: true,
    numberLabel: '01',
    categoryLabel: {
      en: 'THE DUO',
      es: 'EL DÚO',
    },
    eyebrow: {
      en: 'CELLULAR SYNERGY STACK',
      es: 'SINERGIA CELULAR',
    },
    title: {
      en: 'Meet the K8 + emGuarde GO Duo',
      es: 'Conoce el Dúo K8 + emGuarde GO',
    },
    description: {
      en: () => 'See how two complementary technologies support the water you drink and the environment around you.',
      es: () => 'Descubre cómo dos tecnologías complementarias optimizan el agua que bebes y el entorno que te rodea.',
    },
    ctaText: {
      en: 'See the Duo in Action',
      es: 'Ver el Dúo en Acción',
    },
    imageAlt: 'Leveluk K8 and emGuarde GO Duo Synergy',
    cardType: 'duo',
    accentColor: {
      borderGlow: 'hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.18)]',
      gradient: 'from-cyan-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/30',
      badgeText: 'text-[#2997ff]',
      btnBg: 'bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950',
      glowBlur: 'bg-cyan-400/20',
      textHighlight: 'group-hover:text-cyan-300',
    },
    icon: Sparkles,
    analyticsInterest: 'duo',
    getPath: (slug: string) => `/d/${slug}/duo`,
  },

  // 02. Explore Kangen Water
  {
    id: 'kangen',
    displayOrder: 2,
    active: true,
    numberLabel: '02',
    categoryLabel: {
      en: 'IONIZATION',
      es: 'IONIZACIÓN',
    },
    eyebrow: {
      en: '8 PLATINUM PLATES · 5 WATERS',
      es: '8 PLACAS DE PLATINO · 5 AGUAS',
    },
    title: {
      en: 'Discover the Leveluk K8',
      es: 'Descubre el Leveluk K8',
    },
    description: {
      en: () => 'Understand the machine, the different water types it creates, and how families use them in everyday life.',
      es: () => 'Conoce la máquina, los diferentes tipos de agua que produce y cómo las familias la utilizan a diario.',
    },
    ctaText: {
      en: 'Explore Kangen Water®',
      es: 'Explorar Agua Kangen®',
    },
    image: '/products/k8.png',
    imageAlt: 'Enagic Leveluk K8 Water Ionizer System',
    cardType: 'k8',
    accentColor: {
      borderGlow: 'hover:border-sky-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.18)]',
      gradient: 'from-sky-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-sky-500/10 text-sky-300 border border-sky-400/30',
      badgeText: 'text-sky-400',
      btnBg: 'bg-sky-500/20 text-sky-300 group-hover:bg-sky-400 group-hover:text-slate-950',
      glowBlur: 'bg-sky-400/20',
      textHighlight: 'group-hover:text-sky-300',
    },
    icon: Droplets,
    analyticsInterest: 'product',
    getPath: (slug: string) => `/d/${slug}/kangen`,
  },

  // 03. Discover emGuarde
  {
    id: 'emguarde',
    displayOrder: 3,
    active: true,
    numberLabel: '03',
    categoryLabel: {
      en: 'PROTECTION',
      es: 'PROTECCIÓN',
    },
    eyebrow: {
      en: '360° HARMONIC RESONANCE',
      es: 'RESONANCIA ARMÓNICA 360°',
    },
    title: {
      en: 'Understand emGuarde® Protection',
      es: 'Comprende la Protección emGuarde®',
    },
    description: {
      en: () => 'A simple visual introduction to emGuarde, its harmonic resonance technology, and where it fits in your space.',
      es: () => 'Una introducción visual a emGuarde, su tecnología de resonancia armónica y cómo se adapta a tu espacio.',
    },
    ctaText: {
      en: 'Discover emGuarde®',
      es: 'Descubrir emGuarde®',
    },
    image: '/products/emguarde-go.png',
    imageAlt: 'emGuarde GO Cellular EMF Harmonic Protection System',
    cardType: 'emguarde',
    accentColor: {
      borderGlow: 'hover:border-violet-400/50 hover:shadow-[0_0_30px_rgba(167,139,250,0.18)]',
      gradient: 'from-violet-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-violet-500/10 text-violet-300 border border-violet-400/30',
      badgeText: 'text-violet-400',
      btnBg: 'bg-violet-500/20 text-violet-300 group-hover:bg-violet-400 group-hover:text-slate-950',
      glowBlur: 'bg-violet-500/20',
      textHighlight: 'group-hover:text-violet-300',
    },
    icon: Radio,
    analyticsInterest: 'duo',
    getPath: (slug: string) => `/d/${slug}/emguarde`,
  },

  // 04. See the Business Opportunity
  {
    id: 'business',
    displayOrder: 4,
    active: true,
    numberLabel: '04',
    categoryLabel: {
      en: 'OPPORTUNITY',
      es: 'OPORTUNIDAD',
    },
    eyebrow: {
      en: 'GLOBAL MODEL · MENTORSHIP',
      es: 'MODELO GLOBAL · MENTORÍA',
    },
    title: {
      en: 'See the Business Opportunity',
      es: 'Ver la Oportunidad de Negocio',
    },
    description: {
      en: (name) => `A clear introduction to the model, mentorship, global community, and what building with ${name} can look like.`,
      es: (name) => `Una introducción clara al modelo, tutoría, comunidad global y lo que significa construir con ${name}.`,
    },
    ctaText: {
      en: 'Watch the Presentation',
      es: 'Ver la Presentación',
    },
    image: '/assets/business-opportunity-preview.jpg',
    imageAlt: 'True Legacy Global Business Opportunity Presentation',
    cardType: 'presentation',
    accentColor: {
      borderGlow: 'hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.18)]',
      gradient: 'from-emerald-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/30',
      badgeText: 'text-emerald-400',
      btnBg: 'bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-slate-950',
      glowBlur: 'bg-emerald-500/20',
      textHighlight: 'group-hover:text-emerald-300',
    },
    icon: BriefcaseBusiness,
    analyticsInterest: 'distributor',
    getPath: (slug: string) => `/d/${slug}/business`,
  },

  // 05. Learn, Lead & Build With Confidence
  {
    id: 'training',
    displayOrder: 5,
    active: true,
    numberLabel: '05',
    categoryLabel: {
      en: 'ACADEMY',
      es: 'ACADEMIA',
    },
    eyebrow: {
      en: 'TRAINING HUB · RESOURCES',
      es: 'CENTRO DE CAPACITACIÓN · RECURSOS',
    },
    title: {
      en: 'Learn, Lead & Build with Confidence',
      es: 'Aprende, Lidera y Construye con Confianza',
    },
    description: {
      en: () => 'Step inside the training system for product knowledge, conversations, leadership, and team development.',
      es: () => 'Entra al sistema de formación para adquirir conocimientos de productos, conversaciones y desarrollo de equipo.',
    },
    ctaText: {
      en: 'Enter the Academy',
      es: 'Entrar a la Academia',
    },
    image: '/assets/academy-leadership-team-v2.jpg',
    imageAlt: 'True Legacy Essential Enagic Workshop & Leadership Team',
    cardType: 'academy',
    accentColor: {
      borderGlow: 'hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.18)]',
      gradient: 'from-amber-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-amber-500/10 text-amber-300 border border-amber-400/30',
      badgeText: 'text-amber-400',
      btnBg: 'bg-amber-500/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950',
      glowBlur: 'bg-amber-500/20',
      textHighlight: 'group-hover:text-amber-300',
    },
    icon: GraduationCap,
    analyticsInterest: 'training',
    getPath: (slug: string) => `/d/${slug}/training`,
  },

  // 06. Explore the Product Collection
  {
    id: 'products',
    displayOrder: 6,
    active: true,
    numberLabel: '06',
    categoryLabel: {
      en: 'SHOWCASE',
      es: 'CATÁLOGO',
    },
    eyebrow: {
      en: 'COMPLETE JAPANESE LINEUP',
      es: 'LÍNEA JAPONESA COMPLETA',
    },
    title: {
      en: 'Explore the Product Collection',
      es: 'Explorar la Colección de Productos',
    },
    description: {
      en: () => 'Compare the complete Enagic range—from flagship water ionizers to home, wellness, and protection technologies.',
      es: () => 'Compara la gama completa de Enagic, desde ionizadores de agua hasta tecnologías para el hogar y la protección.',
    },
    ctaText: {
      en: 'View All Products',
      es: 'Ver Todos los Productos',
    },
    imageAlt: 'Complete Enagic Product Showcase Lineup',
    cardType: 'collection',
    accentColor: {
      borderGlow: 'hover:border-teal-400/50 hover:shadow-[0_0_30px_rgba(45,212,191,0.18)]',
      gradient: 'from-teal-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-teal-500/10 text-teal-300 border border-teal-400/30',
      badgeText: 'text-teal-400',
      btnBg: 'bg-teal-500/20 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950',
      glowBlur: 'bg-teal-500/20',
      textHighlight: 'group-hover:text-teal-300',
    },
    icon: Package,
    analyticsInterest: 'product',
    getPath: (slug: string) => `/d/${slug}/products`,
  },

  // 07. Discover Anespa DX (NEW CARD)
  {
    id: 'anespa',
    displayOrder: 7,
    active: true,
    isNew: true,
    numberLabel: '07',
    categoryLabel: {
      en: 'HOME WELLNESS',
      es: 'BIENESTAR EN EL HOGAR',
    },
    eyebrow: {
      en: 'MINERAL SHOWER SYSTEM',
      es: 'SISTEMA DE DUCHA MINERAL',
    },
    title: {
      en: 'Transform Your Everyday Shower',
      es: 'Transforma tu Ducha Diaria',
    },
    description: {
      en: () => 'Discover how Anespa DX brings Japanese mineral-water technology into your daily bath and shower experience.',
      es: () => 'Descubre cómo Anespa DX lleva la tecnología de agua mineral japonesa a tu experiencia diaria de baño y ducha.',
    },
    ctaText: {
      en: 'Discover Anespa DX',
      es: 'Descubrir Anespa DX',
    },
    image: '/products/anespa-dx.png',
    imageAlt: 'Enagic Anespa DX Mineral Ion Water Spa Home Unit',
    cardType: 'anespa',
    accentColor: {
      borderGlow: 'hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(14,165,233,0.22)]',
      gradient: 'from-cyan-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/30',
      badgeText: 'text-[#2997ff]',
      btnBg: 'bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950',
      glowBlur: 'bg-cyan-400/20',
      textHighlight: 'group-hover:text-cyan-300',
    },
    icon: ShowerHead,
    analyticsInterest: 'anespa',
    getPath: (slug: string) => `/d/${slug}/anespa`,
  },

  // 08. Join Live True Legacy Events (NEW CARD)
  {
    id: 'events',
    displayOrder: 8,
    active: true,
    numberLabel: '08',
    categoryLabel: {
      en: 'LIVE EVENTS',
      es: 'EVENTOS EN VIVO',
    },
    eyebrow: {
      en: 'WEEKLY GLOBAL & LATAM CALLS',
      es: 'LLAMADAS SEMANALES GLOBAL Y LATAM',
    },
    title: {
      en: 'Experience True Legacy Live',
      es: 'Vive True Legacy en Vivo',
    },
    description: {
      en: () => 'Join a live presentation, explore the products and business vision, meet the community, and ask your questions in real time.',
      es: () => 'Únete a una presentación en vivo, explora los productos y la visión de negocio, conoce a la comunidad y haz tus preguntas en tiempo real.',
    },
    ctaText: {
      en: 'View Upcoming Events',
      es: 'Ver Próximos Eventos',
    },
    image: '/assets/profile-live-event.jpg',
    imageAlt: 'True Legacy emGuarde GO live presentation featuring Mehdi Cohen, Zah Naderi, and Simon Loh',
    cardType: 'events',
    accentColor: {
      borderGlow: 'hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.22)]',
      gradient: 'from-blue-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-blue-500/10 text-blue-300 border border-blue-400/30',
      badgeText: 'text-blue-400',
      btnBg: 'bg-blue-500/20 text-blue-300 group-hover:bg-blue-400 group-hover:text-slate-950',
      glowBlur: 'bg-blue-500/20',
      textHighlight: 'group-hover:text-blue-300',
    },
    icon: CalendarDays,
    analyticsInterest: 'events',
    getPath: (slug: string) => `/d/${slug}/events`,
  },

  // ==========================================
  // FUTURE LANDING PAGE PLACEHOLDERS (INACTIVE)
  // ==========================================
  // 09. Discover Kangen Ukon Sigma (NEW CARD)
  {
    id: 'ukon',
    displayOrder: 9,
    active: true,
    isNew: true,
    numberLabel: '09',
    categoryLabel: { en: 'DAILY WELLNESS', es: 'BIENESTAR DIARIO', fr: 'BIEN-ÊTRE QUOTIDIEN' },
    eyebrow: { en: 'OKINAWAN TURMERIC FORMULA', es: 'FÓRMULA DE CÚRCUMA DE OKINAWA', fr: 'FORMULE DE CURCUMA D\'OKINAWA' },
    title: { en: 'Discover Kangen Ukon Sigma', es: 'Descubre Kangen Ukon Sigma', fr: 'Découvrez Kangen Ukon Sigma' },
    description: {
      en: () => 'Explore Enagic’s premium turmeric supplement, grown in Okinawa and produced in Japan with a patented softgel formulation.',
      es: () => 'Explora el suplemento de cúrcuma de Enagic, cultivado en Okinawa y producido en Japón con cápsula blanda patentada.',
      fr: () => 'Découvrez le complément de curcuma premium d\'Enagic, cultivé à Okinawa y produit au Japon.',
    },
    ctaText: { en: 'Explore Ukon Sigma', es: 'Explorar Ukon Sigma', fr: 'Explorer Ukon Sigma' },
    image: '/products/ukon-sigma.png',
    imageAlt: 'Enagic Kangen Ukon Sigma Dietary Supplement',
    cardType: 'ukon',
    accentColor: {
      borderGlow: 'hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.22)]',
      gradient: 'from-amber-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-amber-500/10 text-amber-300 border border-amber-400/30',
      badgeText: 'text-amber-400',
      btnBg: 'bg-amber-500/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950',
      glowBlur: 'bg-amber-500/20',
      textHighlight: 'group-hover:text-amber-300',
    },
    icon: Sparkles,
    analyticsInterest: 'ukon',
    getPath: (slug: string) => `/d/${slug}/ukon`,
  },
  // 10. Discover Kangen Beaute (NEW CARD)
  {
    id: 'beaute',
    displayOrder: 10,
    active: true,
    isNew: true,
    numberLabel: '10',
    categoryLabel: { en: 'SKINCARE RITUAL', es: 'RITUAL DE LA PIEL', fr: 'RITUEL SOIN DE PEAU' },
    eyebrow: { en: 'THE TIMELESS RADIANCE COLLECTION', es: 'LA COLECCIÓN DE RESPLANDOR', fr: 'LA COLLECTION ÉCLAT' },
    title: { en: 'Discover Kangen Beauté', es: 'Descubre Kangen Beauté', fr: 'Découvrez Kangen Beauté' },
    description: {
      en: () => 'Explore a three-step skincare ritual inspired by Kangen Water, Okinawan Ukon, Japanese precision, and Korean artistry.',
      es: () => 'Explora un ritual de cuidado de la piel en tres pasos inspirado en el Agua Kangen y el Ukon de Okinawa.',
      fr: () => 'Découvrez un rituel soin en trois étapes inspiré de l\'Eau Kangen et du Ukon d\'Okinawa.',
    },
    ctaText: { en: 'Explore the Ritual', es: 'Explorar el Ritual', fr: 'Explorer le Rituel' },
    image: '/assets/profile-kangen-beaute.png',
    imageAlt: 'Enagic Kangen Beaute Three Step Skincare Collection',
    cardType: 'beaute',
    accentColor: {
      borderGlow: 'hover:border-amber-300/60 hover:shadow-[0_0_30px_rgba(254,243,199,0.2)]',
      gradient: 'from-amber-950/40 via-slate-900/60 to-black',
      iconBg: 'bg-amber-400/10 text-amber-200 border border-amber-300/30',
      badgeText: 'text-amber-300',
      btnBg: 'bg-amber-400/20 text-amber-200 group-hover:bg-amber-300 group-hover:text-slate-950',
      glowBlur: 'bg-amber-400/20',
      textHighlight: 'group-hover:text-amber-200',
    },
    icon: Sparkles,
    analyticsInterest: 'beaute',
    getPath: (slug: string) => `/d/${slug}/beaute`,
  },
  // 11. Experience Kangen Wagyu (NEW CARD)
  {
    id: 'wagyu',
    displayOrder: 11,
    active: true,
    isNew: true,
    numberLabel: '11',
    categoryLabel: { en: 'CULINARY EXPERIENCE', es: 'EXPERIENCIA CULINARIA', fr: 'EXPÉRIENCE CULINAIRE' },
    eyebrow: { en: 'PREMIUM AMERICAN WAGYU', es: 'WAGYU AMERICANO PREMIUM', fr: 'WAGYU AMÉRICAIN PREMIUM' },
    title: { en: 'Experience Kangen Wagyu', es: 'Experimenta Kangen Wagyu', fr: 'Découvrez Kangen Wagyu' },
    description: {
      en: () => 'Discover premium American Wagyu raised at Masami Ranch in California with Japanese Wagyu heritage and daily Kangen Water hydration.',
      es: () => 'Descubre carne Wagyu americana premium criada en Masami Ranch en California con herencia Wagyu e hidratación con Agua Kangen.',
      fr: () => 'Découvrez du Wagyu américain d\'exception élevé au Masami Ranch en Californie avec de l\'Eau Kangen au quotidien.',
    },
    ctaText: { en: 'Explore Kangen Wagyu', es: 'Explorar Kangen Wagyu', fr: 'Explorer Kangen Wagyu' },
    image: '/assets/profile-kangen-wagyu.png',
    imageAlt: 'Kangen Wagyu Premium American Beef Collection',
    cardType: 'wagyu',
    accentColor: {
      borderGlow: 'hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.22)]',
      gradient: 'from-amber-950/40 via-stone-900/60 to-black',
      iconBg: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
      badgeText: 'text-amber-400',
      btnBg: 'bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950',
      glowBlur: 'bg-amber-500/20',
      textHighlight: 'group-hover:text-amber-300',
    },
    icon: Flame,
    analyticsInterest: 'wagyu',
    getPath: (slug: string) => `/d/${slug}/wagyu`,
  },
]

/**
 * Returns active landing cards sorted by displayOrder.
 * Filters out inactive or coming-soon cards unless explicitly allowed by admin config.
 */
export function getActiveProfileLandingCards(includeComingSoon = false): ProfileLandingCardConfig[] {
  return PROFILE_LANDING_CARDS.filter((card) => card.active || (includeComingSoon && card.isComingSoon)).sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
}
