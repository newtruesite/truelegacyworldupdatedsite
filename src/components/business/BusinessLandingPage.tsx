import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Globe2,
  PlayCircle,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  Compass,
  Users,
  Building2,
  CheckCircle2,
  ChevronRight,
  Layers,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Target,
  Zap,
  Briefcase,
  Share2,
  Lock,
  Cpu,
  Tv,
  BookOpen,
  MessageSquare,
  Flame,
  Check
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { crmSupabase, getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'
import { trackEvent } from '@/lib/analytics'

interface BusinessLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

const LEADER_PORTRAITS: Record<string, string> = {
  'mehdi-cohen': '/leaders/standardized/mehdi-cohen.png',
  'simon-loh': '/leaders/standardized/simon-loh-v2.png',
  'ming-way-sia': '/leaders/standardized/ming-way-sia.png',
  'zah-naderi': '/leaders/standardized/zah-naderi-v3.png',
  'alex-gonzalez': '/leaders/standardized/alex-gonzalez.png',
  'ryan-pool': '/leaders/standardized/ryan-pool-sr.png',
  'ryan-pool-sr': '/leaders/standardized/ryan-pool-sr.png',
  'magaly-cardona': '/leaders/standardized/magaly-cardona.png',
  emanuela: '/leaders/standardized/emanuela-doustova.png',
  'emanuela-braj': '/leaders/standardized/emanuela-doustova.png',
  'emanuela-doustova': '/leaders/standardized/emanuela-doustova.png',
  'jesse-schexnayder': '/leaders/standardized/jesse-schexnayder.png',
  'angel-mok': '/leaders/standardized/angel-mok-v2.png',
  'angel-mok-e-lin': '/leaders/standardized/angel-mok-v2.png',
}

function resolveLeaderPhoto(nameOrSlug: string): string {
  const normalized = nameOrSlug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')

  if (LEADER_PORTRAITS[normalized]) {
    return LEADER_PORTRAITS[normalized]
  }

  if (normalized.includes('ryan')) return '/leaders/standardized/ryan-pool-sr.png'
  if (normalized.includes('emanuela')) return '/leaders/standardized/emanuela-doustova.png'
  if (normalized.includes('mehdi')) return '/leaders/standardized/mehdi-cohen.png'
  if (normalized.includes('magaly')) return '/leaders/standardized/magaly-cardona.png'
  if (normalized.includes('simon')) return '/leaders/standardized/simon-loh-v2.png'
  if (normalized.includes('ming')) return '/leaders/standardized/ming-way-sia.png'
  if (normalized.includes('zah')) return '/leaders/standardized/zah-naderi-v3.png'
  if (normalized.includes('alex')) return '/leaders/standardized/alex-gonzalez.png'
  if (normalized.includes('angel')) return '/leaders/standardized/angel-mok-v2.png'
  if (normalized.includes('jesse')) return '/leaders/standardized/jesse-schexnayder.png'

  return getLeaderPortrait(normalized, '/logos/tl-square-white.png')
}

const I18N = {
  en: {
    badge: 'GLOBAL MARKET-DEVELOPMENT ECOSYSTEM',
    headlineTop: "WE DON'T JUST BUILD DISTRIBUTORS.",
    headlineBottom: 'WE BUILD MARKETS.',
    subheadline:
      'True Legacy is a global leadership community focused on identifying emerging opportunities, developing local leaders, and helping expand Enagic into both new and established markets.',
    heroSupporting: 'Find opportunity early. Build leadership locally. Create something that lasts.',
    watchPresentation: 'Watch the Business Presentation',
    exploreOpportunity: 'Explore the Opportunity',
    sharedBy: 'Shared personally with you by',
    verifiedGuide: 'Your Verified Guide',
    contactDistributor: 'Contact',

    // Section 2: Business Video
    videoHeading: 'SEE THE VISION BEFORE YOU SEE THE BUSINESS',
    videoP1: 'This is not simply about selling a product.',
    videoP2:
      'It is about understanding where the world is moving, positioning intelligently, developing leaders, and building something meaningful in your market.',

    // Section 3: The Problem
    problemHeading: 'MOST PEOPLE ENTER MARKETS AFTER EVERYONE ELSE.',
    problemP1: 'They wait until the opportunity becomes obvious.',
    problemP2: 'Until everyone knows the product.',
    problemP3: 'Until competition is everywhere.',
    problemP4: 'Until the market has already been built.',
    problemP5: 'We think differently.',
    problemP6:
      'True Legacy actively looks for markets where awareness is still developing, where strong local leadership is needed, and where the right people can help build the foundation instead of simply entering after everything is established.',
    problemP7: 'But emerging markets are only part of the strategy.',
    problemP8: 'When we operate inside mature markets, the objective changes.',
    problemP9:
      'We look for areas where growth has slowed, positioning has become stale, or leadership has become disconnected from the next generation of entrepreneurs.',
    problemP10: 'Then we bring new energy, systems, branding, leadership development, and strategy.',
    problemStatement: 'DIFFERENT MARKETS REQUIRE DIFFERENT STRATEGIES.',

    // Section 4: Our Specialty
    specialtyHeading: 'HOW TRUE LEGACY BUILDS MARKETS',
    stages: [
      {
        num: '01',
        name: 'DISCOVER',
        tagline: 'Find the opportunity before it becomes obvious.',
        points: [
          'Emerging regions',
          'Cultural shifts',
          'Product awareness',
          'Leadership gaps',
          'New demographics',
          'Expansion opportunities',
        ],
      },
      {
        num: '02',
        name: 'DEVELOP',
        tagline: 'Build people before building numbers.',
        points: [
          'Identify local leaders',
          'Communication development',
          'Personal branding',
          'Product knowledge',
          'Business fundamentals',
          'Leadership training',
          'Mentorship',
          'Systems',
        ],
      },
      {
        num: '03',
        name: 'EXPAND',
        tagline: 'Turn individual momentum into a market.',
        points: [
          'Local events',
          'Education',
          'Community',
          'Duplication',
          'Cross-border collaboration',
          'Leadership development',
          'Market infrastructure',
        ],
      },
    ],
    specialtyClosing1: 'The goal is not to create followers.',
    specialtyClosing2: 'The goal is to develop leaders capable of building without us.',

    // Section 5: Global Market Strategy
    strategyHeading: 'FROM MARKET ENTRY TO MARKET EXPANSION',
    emergingTitle: 'EMERGING MARKETS',
    emergingDesc: 'Markets where awareness is still developing and the focus is building strong foundations.',
    emergingExamples: ['Morocco', 'Colombia', 'Paraguay', 'Nigeria'],
    growthTitle: 'GROWTH MARKETS',
    growthDesc: 'Markets where leadership, infrastructure, events, systems, and community are actively expanding.',
    growthExamples: ['Mexico', 'Brazil', 'UAE', 'India', 'Malaysia', 'Spain'],
    establishedTitle: 'ESTABLISHED MARKETS',
    establishedDesc: 'Markets where the objective becomes acceleration, repositioning, stronger leadership, and renewed momentum.',
    establishedExamples: ['USA', 'Canada', 'European Union'],
    strategyStatement1: "We don't copy and paste one strategy around the world.",
    strategyStatement2: 'We adapt the strategy to the market.',

    // Section 6: We Live the Strategy
    liveStrategyHeading: 'WE LIVE THE STRATEGY WE TEACH.',
    liveStoryP1:
      'True Legacy was not created from theory or slides. It was forged by leaders who packed their bags, left established surroundings, and proved the model in the field.',
    liveStoryP2:
      'Mehdi Cohen and Magaly Cardona built substantial experience in the United States before deliberately choosing to step outside their comfort zone. They entered Morocco, immersed themselves in the culture, and established operations where no direct network existed.',
    liveStoryP3:
      'They later expanded that focus into Colombia and across Latin America—navigating different languages, building genuine trust from zero, and creating self-sustaining leadership communities.',
    liveTakeaway1: 'It is easy to talk about entering new markets.',
    liveTakeaway2:
      'It is different to actually move your life, enter unfamiliar environments, build relationships from nothing, and learn how to create momentum.',

    // Section 7: Two Types of Builders
    buildersHeading: 'WHERE DO YOU FIT?',
    builderCard1Title: 'THE MARKET BUILDER',
    builderCard1Points: [
      'You see opportunity where others do not.',
      'You like being early.',
      'You are interested in building something from the ground up.',
      'You are willing to learn your market, develop people, and create the foundation.',
    ],
    builderCard1Advantage: 'Your advantage: positioning.',
    builderCard2Title: 'THE MARKET ACCELERATOR',
    builderCard2Points: [
      'You live in or understand an existing market.',
      'You already have relationships, cultural knowledge, experience, or community.',
      'Your opportunity is to bring new energy, leadership, branding, systems, and strategy into that environment.',
    ],
    builderCard2Advantage: 'Your advantage: leverage.',
    buildersBanner1: 'THERE IS NO "BEST MARKET."',
    buildersBanner2: "THERE IS A BEST STRATEGY FOR THE MARKET YOU'RE IN.",

    // Section 8: The Vehicle
    vehicleHeading: 'A GLOBAL VEHICLE FOR A GLOBAL STRATEGY',
    vehicleIntro:
      'True Legacy operates through the Enagic independent distributor model—combining Japanese OEM manufacturing with a worldwide direct-distribution license.',
    vehiclePoints: [
      { title: 'Established in 1974', desc: 'Over 50 years of uninterrupted Japanese manufacturing excellence and financial stability.' },
      { title: 'Global Branch Presence', desc: 'Direct corporate offices and service locations across 23+ international economic hubs.' },
      { title: 'Gold-Standard Product Ecosystem', desc: 'Medical-grade Leveluk water ionizers and emGuarde GO environmental technologies.' },
      { title: 'Independent Distributor License', desc: 'Direct corporate contract with worldwide sales authorization and zero territorial boundaries.' },
      { title: 'Patented Global Compensation', desc: 'Direct and indirect commission architecture tied to authentic product movement, not recruitment.' },
    ],
    vehicleCompliance:
      'Independent distributor presentation. Results vary based on individual effort, market conditions, and leadership skills. No income, rank, or specific financial results are guaranteed.',

    // Section 9: The System
    systemHeading: 'THE OPPORTUNITY GETS YOU IN. THE SYSTEM HELPS YOU BUILD.',
    systemSub: 'A complete operational infrastructure engineered to remove guesswork and duplicate leadership across borders.',
    systemItems: [
      { title: 'Structured Onboarding', desc: 'Clear step-by-step roadmap from day one.' },
      { title: 'Product & Water Education', desc: 'Scientific demonstrations, certifications, and compliance.' },
      { title: 'Business Fundamentals', desc: 'Compensation mastery, business structuring, and pipeline logic.' },
      { title: 'Weekly English & LATAM Calls', desc: 'Live strategy, guest overviews, and leadership development.' },
      { title: 'Leadership Academy', desc: 'Deep-dive modules on duplication, mindset, and organization.' },
      { title: 'Market Strategy Frameworks', desc: 'Custom blue-ocean positioning for emerging and mature regions.' },
      { title: 'Personal Branding & Media', desc: 'Studio portrait templates, video scripts, and digital authority.' },
      { title: 'Communication Frameworks', desc: 'Authentic conversational scripts that invite without pressure.' },
      { title: 'CRM & Attribution Platform', desc: 'Proprietary lead routing ensuring your referrals stay attributed to you.' },
      { title: 'Live Events & Seminars', desc: 'In-person workshops, regional intensives, and annual summits.' },
      { title: 'Turnkey Presentation Tools', desc: 'Standardized pitch decks, video funnels, and PDF guides.' },
      { title: 'Direct 6A+ Mentorship', desc: 'Direct guidance from leaders actively building in the field.' },
    ],

    // Section 10: Leadership Ecosystem
    leadersHeading: 'BUILT BY DIFFERENT PEOPLE. ACROSS DIFFERENT MARKETS. WITH ONE VISION.',
    leadersSub:
      'You are not depending on a single individual. You are stepping into an international leadership network with decades of collective experience.',
    leadersList: [
      { name: 'Mehdi Cohen', role: 'Global Strategy & LATAM Expansion', market: 'Global · LATAM · Morocco · USA', desc: '10+ years in wellness and international market development.' },
      { name: 'Simon Loh', role: 'Asia Market Experience & Global Expansion', market: 'Malaysia · India · UAE · Global', desc: '6A2-4 leader with extensive cross-border organization experience.' },
      { name: 'Magaly Cardona', role: 'Community Building & LATAM Leadership', market: 'USA · Latin America', desc: '6A leader specializing in values-aligned business and culture.' },
      { name: 'Ming-Way Sia', role: 'Leadership Development & Systems', market: 'Malaysia · India · Global', desc: '6A2-5 leader focused on disciplined execution and duplication.' },
      { name: 'Ryan Pool Sr', role: 'Sales Strategy & USA Expansion', market: 'United States', desc: 'Entrepreneur and former athlete building strong family legacy.' },
      { name: 'Alex Gonzalez', role: 'Brand Marketing & Industry Strategy', market: 'United States · LATAM', desc: '35+ years of executive marketing in the health and supplement space.' },
      { name: 'Zah Naderi', role: 'Executive Performance Coaching', market: 'USA · Global', desc: 'Elite athlete coach bringing high-performance standards to team building.' },
      { name: 'Emanuela Braj', role: 'Sales Leadership & Empowerment', market: 'United States · Eastern Europe', desc: 'Over a decade of sales leadership and purpose-driven mentorship.' },
      { name: 'Angel Mok', role: 'Global Expansion & Emerging Markets', market: 'Malaysia · Singapore · UAE', desc: 'Former equity trader building international freedom and impact.' },
      { name: 'Jesse Schexnayder', role: 'Entrepreneurial Momentum', market: 'United States', desc: 'Serial entrepreneur and product innovator scaling high-energy teams.' },
    ],

    // Section 11: Proof
    proofHeading: 'MARKETS ARE BUILT ONE LEADER AT A TIME.',
    proofSub: 'Real transformations from people who developed skills, entered new territories, and built lasting momentum.',
    proofStories: [
      {
        title: 'Entering a New Country From Scratch',
        person: 'Mehdi & Magaly',
        market: 'Morocco & LATAM',
        story: 'Arrived without a local network, learned cultural nuances, built genuine personal trust, and created a thriving international team spanning multiple cities.',
      },
      {
        title: 'Building Cross-Border Momentum',
        person: 'Simon Loh & Ming-Way Sia',
        market: 'Asia & Middle East',
        story: 'Developed duplication systems that allowed leaders in Malaysia, India, and the UAE to run independent presentations, trainings, and customer support.',
      },
      {
        title: 'Transitioning From Corporate Career to Global Business',
        person: 'Angel Mok & Emanuela Braj',
        market: 'USA & Global',
        story: 'Leveraged structured True Legacy frameworks to transition from high-stress corporate environments into self-directed international entrepreneurship.',
      },
      {
        title: 'Modernizing an Established Market',
        person: 'Ryan Pool & Alex Gonzalez',
        market: 'United States',
        story: 'Applied fresh digital branding, CRM systems, and health education to revitalize established territory with next-generation entrepreneurial energy.',
      },
    ],

    // Section 12: The Mission
    missionHeading: 'THIS IS BIGGER THAN ANOTHER BUSINESS.',
    missionLines: [
      'We believe the next generation of entrepreneurs will think globally.',
      'They will care about their health.',
      'They will own more of their time.',
      'They will build across borders.',
      'They will use technology instead of fearing it.',
      'They will develop themselves before trying to lead others.',
      'And they will build businesses that give them more choice over where they live, who they work with, and the impact they create.',
    ],
    missionPurpose1: 'True Legacy exists to find those people.',
    missionPurpose2: 'Develop them.',
    missionPurpose3: 'Connect them.',
    missionPurpose4: 'And give them a platform to create an impact far beyond themselves.',
    missionFourPillars: [
      'BETTER HEALTH.',
      'STRONGER LEADERS.',
      'NEW MARKETS.',
      'GENERATIONAL LEGACY.',
    ],

    // Section 13: Final CTA
    finalHeading: 'WHERE COULD YOU BUILD YOUR LEGACY?',
    finalSub1: 'Every market has opportunity.',
    finalSub2: 'The question is understanding where you fit, what your advantage is, and what strategy makes sense for you.',
    exploreMarketBtn: 'Explore Your Market With Us',
    strategyCallBtn: 'Book a Market Strategy Call',
    finalTrust: 'An intelligent conversation about strategy, market positioning, and real execution. No hype. No pressure.',
    stickyMobileCta: 'Explore With',
  },

  es: {
    badge: 'ECOSISTEMA GLOBAL DE DESARROLLO DE MERCADOS',
    headlineTop: 'NO SOLO FORMAMOS DISTRIBUIDORES.',
    headlineBottom: 'CONSTRUIMOS MERCADOS.',
    subheadline:
      'True Legacy es una comunidad global de liderazgo enfocada en identificar oportunidades emergentes, desarrollar líderes locales y expandir Enagic tanto en mercados nuevos como establecidos.',
    heroSupporting: 'Encuentra la oportunidad temprano. Desarrolla liderazgo local. Crea algo que perdure.',
    watchPresentation: 'Ver la Presentación de Negocio',
    exploreOpportunity: 'Explorar la Oportunidad',
    sharedBy: 'Compartido personalmente contigo por',
    verifiedGuide: 'Tu Guía Verificado',
    contactDistributor: 'Contactar a',

    // Section 2: Business Video
    videoHeading: 'CONOCE LA VISIÓN ANTES DE CONOCER EL NEGOCIO',
    videoP1: 'Esto no se trata simplemente de vender un producto.',
    videoP2:
      'Se trata de entender hacia dónde se mueve el mundo, posicionarse con inteligencia, formar líderes y construir algo con verdadero impacto en tu mercado.',

    // Section 3: The Problem
    problemHeading: 'LA MAYORÍA ENTRA A LOS MERCADOS CUANDO YA TODOS ESTÁN DENTRO.',
    problemP1: 'Esperan hasta que la oportunidad sea obvia.',
    problemP2: 'Hasta que todo el mundo conozca el producto.',
    problemP3: 'Hasta que la competencia esté en todas partes.',
    problemP4: 'Hasta que el mercado ya haya sido construido por otros.',
    problemP5: 'Nosotros pensamos diferente.',
    problemP6:
      'True Legacy busca activamente mercados donde el conocimiento aún está en desarrollo, donde se necesita liderazgo local sólido y donde las personas correctas pueden construir los cimientos en lugar de entrar cuando todo está listo.',
    problemP7: 'Pero los mercados emergentes son solo una parte de la estrategia.',
    problemP8: 'Cuando operamos en mercados maduros, el objetivo cambia.',
    problemP9:
      'Buscamos áreas donde el crecimiento se ha desacelerado, el posicionamiento se ha vuelto obsoleto o el liderazgo se ha desconectado de la nueva generación de emprendedores.',
    problemP10: 'Entonces aportamos nueva energía, sistemas, marca, formación de liderazgo y estrategia.',
    problemStatement: 'MERCADOS DIFERENTES REQUIEREN ESTRATEGIAS DIFERENTES.',

    // Section 4: Our Specialty
    specialtyHeading: 'CÓMO TRUE LEGACY CONSTRUYE MERCADOS',
    stages: [
      {
        num: '01',
        name: 'DESCUBRIR',
        tagline: 'Encontrar la oportunidad antes de que sea evidente.',
        points: [
          'Regiones emergentes',
          'Cambios culturales',
          'Conocimiento del producto',
          'Vacíos de liderazgo',
          'Nuevos perfiles demográficos',
          'Oportunidades de expansión',
        ],
      },
      {
        num: '02',
        name: 'DESARROLLAR',
        tagline: 'Construir personas antes de construir números.',
        points: [
          'Identificar líderes locales',
          'Desarrollo de comunicación',
          'Marca personal',
          'Conocimiento de producto',
          'Fundamentos de negocio',
          'Capacitación de liderazgo',
          'Mentoría',
          'Sistemas',
        ],
      },
      {
        num: '03',
        name: 'EXPANDIR',
        tagline: 'Convertir el impulso individual en un mercado sólido.',
        points: [
          'Eventos locales',
          'Educación',
          'Comunidad',
          'Duplicación',
          'Colaboración internacional',
          'Desarrollo de liderazgo',
          'Infraestructura de mercado',
        ],
      },
    ],
    specialtyClosing1: 'El objetivo no es crear seguidores.',
    specialtyClosing2: 'El objetivo es desarrollar líderes capaces de construir sin nosotros.',

    // Section 5: Global Market Strategy
    strategyHeading: 'DESDE EL INGRESO HASTA LA EXPANSIÓN DE MERCADO',
    emergingTitle: 'MERCADOS EMERGENTES',
    emergingDesc: 'Mercados donde el conocimiento está naciendo y el foco es sentar bases firmes.',
    emergingExamples: ['Marruecos', 'Colombia', 'Paraguay', 'Nigeria'],
    growthTitle: 'MERCADOS EN CRECIMIENTO',
    growthDesc: 'Mercados donde el liderazgo, infraestructura, eventos y comunidad se expanden con fuerza.',
    growthExamples: ['México', 'Brasil', 'Emiratos Árabes', 'India', 'Malasia', 'España'],
    establishedTitle: 'MERCADOS ESTABLECIDOS',
    establishedDesc: 'Mercados donde el objetivo es acelerar, reposicionar la marca y renovar el impulso.',
    establishedExamples: ['Estados Unidos', 'Canadá', 'Unión Europea'],
    strategyStatement1: 'No copiamos y pegamos una sola fórmula por el mundo.',
    strategyStatement2: 'Adaptamos la estrategia a cada mercado.',

    // Section 6: We Live the Strategy
    liveStrategyHeading: 'VIVIMOS LA ESTRATEGIA QUE ENSEÑAMOS.',
    liveStoryP1:
      'True Legacy no nació de la teoría ni de presentaciones. Fue creado por líderes que hicieron sus maletas, dejaron entornos cómodos y demostraron el modelo sobre el terreno.',
    liveStoryP2:
      'Mehdi Cohen y Magaly Cardona construyeron una sólida trayectoria en Estados Unidos antes de decidir voluntariamente salir de su zona de confort. Se trasladaron a Marruecos, se integraron en la cultura y establecieron operaciones donde no existía ninguna red previa.',
    liveStoryP3:
      'Posteriormente expandieron ese enfoque hacia Colombia y América Latina: comprendiendo nuevas culturas, forjando confianza real desde cero y formando comunidades de líderes autosuficientes.',
    liveTakeaway1: 'Es fácil hablar de entrar a nuevos mercados.',
    liveTakeaway2:
      'Es muy diferente mudar tu vida, entrar a entornos desconocidos, construir relaciones desde cero y aprender a crear impulso real.',

    // Section 7: Two Types of Builders
    buildersHeading: '¿DÓNDE ENCAJAS TÚ?',
    builderCard1Title: 'EL CONSTRUCTOR DE MERCADO',
    builderCard1Points: [
      'Ves oportunidades donde otros aún no ven nada.',
      'Te gusta llegar temprano.',
      'Te interesa construir algo desde los cimientos.',
      'Estás dispuesto a estudiar tu mercado, formar personas y crear las bases.',
    ],
    builderCard1Advantage: 'Tu ventaja: posicionamiento temprano.',
    builderCard2Title: 'EL ACELERADOR DE MERCADO',
    builderCard2Points: [
      'Vives o conoces a fondo un mercado ya existente.',
      'Cuentas con relaciones, conocimiento cultural, experiencia o comunidad.',
      'Tu oportunidad es aportar nueva energía, liderazgo, marca, sistemas y estrategia a ese entorno.',
    ],
    builderCard2Advantage: 'Tu ventaja: apalancamiento.',
    buildersBanner1: 'NO EXISTE UN "MEJOR MERCADO."',
    buildersBanner2: 'EXISTE LA MEJOR ESTRATEGIA PARA EL MERCADO EN EL QUE ESTÁS.',

    // Section 8: The Vehicle
    vehicleHeading: 'UN VEHÍCULO GLOBAL PARA UNA ESTRATEGIA GLOBAL',
    vehicleIntro:
      'True Legacy opera a través del modelo de distribuidor independiente de Enagic, combinando manufactura japonesa con una licencia de distribución directa mundial.',
    vehiclePoints: [
      { title: 'Fundada en 1974', desc: 'Más de 50 años de excelencia ininterrumpida en fabricación japonesa y solidez financiera.' },
      { title: 'Sedes Internacionales', desc: 'Oficinas corporativas directas en más de 23 sedes económicas mundiales.' },
      { title: 'Tecnologías Gold Standard', desc: 'Ionizadores de agua médicos Leveluk y tecnología de armonización emGuarde GO.' },
      { title: 'Licencia Independiente Global', desc: 'Contrato directo con autorización para comercializar en todo el mundo sin límites territoriales.' },
      { title: 'Plan de Compensación Patentado', desc: 'Estructura de comisiones directa e indirecta basada en ventas reales de producto, no en reclutamiento.' },
    ],
    vehicleCompliance:
      'Presentación para distribuidores independientes. Los resultados varían según el esfuerzo individual, las condiciones del mercado y las habilidades de liderazgo. No se garantizan ingresos, rangos ni resultados económicos específicos.',

    // Section 9: The System
    systemHeading: 'LA OPORTUNIDAD TE ABRE LA PUERTA. EL SISTEMA TE ENSEÑA A CONSTRUIR.',
    systemSub: 'Una infraestructura completa diseñada para eliminar la improvisación y duplicar liderazgo a través de fronteras.',
    systemItems: [
      { title: 'Onboarding Estructurado', desc: 'Plan de acción paso a paso desde el primer día.' },
      { title: 'Educación de Producto y Agua', desc: 'Demostraciones científicas, certificaciones y cumplimiento.' },
      { title: 'Fundamentos del Negocio', desc: 'Dominio del plan de compensación y estructura de negocio.' },
      { title: 'Llamadas Semanales Globales y LATAM', desc: 'Estrategia en vivo, visión y desarrollo de liderazgo.' },
      { title: 'Academia de Liderazgo', desc: 'Módulos profundos de duplicación, mentalidad y gestión de equipos.' },
      { title: 'Estrategias de Océano Azul', desc: 'Posicionamiento estratégico en mercados emergentes y maduros.' },
      { title: 'Marca Personal y Medios', desc: 'Plantillas de estudio fotográfico, guiones de video y presencia digital.' },
      { title: 'Marcos de Comunicación', desc: 'Guiones conversacionales elegantes que invitan sin presionar.' },
      { title: 'Plataforma CRM y Atribución', desc: 'Rastreo automatizado que garantiza que tus prospectos queden contigo.' },
      { title: 'Eventos y Seminarios en Vivo', desc: 'Talleres presenciales, entrenamientos regionales y cumbres.' },
      { title: 'Herramientas de Presentación', desc: 'Diapositivas estandarizadas, embudos de video y guías PDF.' },
      { title: 'Mentoría Directa con Líderes 6A+', desc: 'Acompañamiento de líderes que construyen activamente en el campo.' },
    ],

    // Section 10: Leadership Ecosystem
    leadersHeading: 'CONSTRUIDO POR PERSONAS DIVERSAS. EN MERCADOS DISTINTOS. CON UNA MISMA VISIÓN.',
    leadersSub:
      'No dependes de una sola persona. Ingresas a una red internacional de liderazgo con décadas de experiencia acumulada.',
    leadersList: [
      { name: 'Mehdi Cohen', role: 'Estrategia Global y Expansión LATAM', market: 'Global · LATAM · Marruecos · EE. UU.', desc: 'Más de 10 años en bienestar y desarrollo de mercados internacionales.' },
      { name: 'Simon Loh', role: 'Experiencia en Asia y Expansión Global', market: 'Malasia · India · EAU · Global', desc: 'Líder 6A2-4 con amplia experiencia en organizaciones transfronterizas.' },
      { name: 'Magaly Cardona', role: 'Desarrollo Comunitario y Liderazgo LATAM', market: 'EE. UU. · Latinoamérica', desc: 'Líder 6A especializada en negocios alineados con valores y cultura.' },
      { name: 'Ming-Way Sia', role: 'Desarrollo de Liderazgo y Duplicación', market: 'Malasia · India · Global', desc: 'Líder 6A2-5 enfocado en disciplina, ejecución y duplicación.' },
      { name: 'Ryan Pool Sr', role: 'Estrategia Comercial y Expansión en EE. UU.', market: 'Estados Unidos', desc: 'Empresario y exatleta enfocado en construir un legado familiar duradero.' },
      { name: 'Alex Gonzalez', role: 'Marketing Estratégico y Veterano del Sector', market: 'EE. UU. · LATAM', desc: 'Más de 35 años de experiencia ejecutiva en marketing y suplementación.' },
      { name: 'Zah Naderi', role: 'Coaching Ejecutivo de Alto Rendimiento', market: 'EE. UU. · Global', desc: 'Entrenador de atletas de élite aplicando disciplina a equipos de negocio.' },
      { name: 'Emanuela Braj', role: 'Liderazgo en Ventas y Empoderamiento', market: 'EE. UU. · Europa del Este', desc: 'Más de una década de experiencia comercial y mentoría con propósito.' },
      { name: 'Angel Mok', role: 'Expansión Global y Mercados Emergentes', market: 'Malasia · Singapur · EAU', desc: 'Extrader bursátil construyendo libertad e impacto internacional.' },
      { name: 'Jesse Schexnayder', role: 'Impulso Emprendedor y Sistemas', market: 'Estados Unidos', desc: 'Emprendedor en serie e innovador escalando equipos de alta energía.' },
    ],

    // Section 11: Proof
    proofHeading: 'LOS MERCADOS SE CONSTRUYEN UN LÍDER A LA VEZ.',
    proofSub: 'Transformaciones reales de personas que desarrollaron habilidades, abrieron nuevas plazas y generaron impulso duradero.',
    proofStories: [
      {
        title: 'Abrir un Nuevo País Desde Cero',
        person: 'Mehdi y Magaly',
        market: 'Marruecos y LATAM',
        story: 'Llegaron sin red de contactos local, comprendieron la cultura, forjaron confianza y consolidaron una organización internacional en varias ciudades.',
      },
      {
        title: 'Crear Impulso Transfronterizo',
        person: 'Simon Loh y Ming-Way Sia',
        market: 'Asia y Medio Oriente',
        story: 'Desarrollaron sistemas de duplicación que permiten a líderes en Malasia, India y Emiratos realizar presentaciones y soporte de forma autónoma.',
      },
      {
        title: 'De la Carrera Corporativa al Negocio Global',
        person: 'Angel Mok y Emanuela Braj',
        market: 'EE. UU. y Global',
        story: 'Aprovecharon los marcos estructurados de True Legacy para hacer la transición del mundo corporativo al emprendimiento internacional independiente.',
      },
      {
        title: 'Modernizar un Mercado Establecido',
        person: 'Ryan Pool y Alex Gonzalez',
        market: 'Estados Unidos',
        story: 'Aplicaron marca digital moderna, CRM y educación en salud para revitalizar plazas consolidadas con la energía de nuevas generaciones.',
      },
    ],

    // Section 12: The Mission
    missionHeading: 'ESTO ES MUCHO MÁS QUE OTRO NEGOCIO.',
    missionLines: [
      'Creemos que la próxima generación de emprendedores pensará de forma global.',
      'Cuidarán conscientemente de su salud.',
      'Serán dueños de su tiempo.',
      'Construirán proyectos a través de fronteras.',
      'Aprovecharán la tecnología en lugar de temerle.',
      'Se desarrollarán primero a sí mismos antes de intentar liderar a otros.',
      'Y construirán negocios que les den verdadera libertad sobre dónde vivir, con quién trabajar y el impacto que dejan.',
    ],
    missionPurpose1: 'True Legacy existe para encontrar a esas personas.',
    missionPurpose2: 'Formarlas.',
    missionPurpose3: 'Conectarlas.',
    missionPurpose4: 'Y brindarles una plataforma para crear un impacto que trascienda.',
    missionFourPillars: [
      'MEJOR SALUD.',
      'LÍDERES SÓLIDOS.',
      'NUEVOS MERCADOS.',
      'LEGADO GENERACIONAL.',
    ],

    // Section 13: Final CTA
    finalHeading: '¿DÓNDE PODRÍAS CONSTRUIR TU LEGADO?',
    finalSub1: 'Cada mercado tiene una oportunidad.',
    finalSub2: 'La clave está en entender dónde encajas, cuál es tu ventaja y qué estrategia tiene sentido para ti.',
    exploreMarketBtn: 'Explora Tu Mercado Con Nosotros',
    strategyCallBtn: 'Agendar una Llamada de Estrategia',
    finalTrust: 'Una conversación inteligente sobre estrategia, posicionamiento de mercado y ejecución real. Sin promesas vacías ni presión.',
    stickyMobileCta: 'Explorar con',
  },

  fr: {
    badge: 'ÉCOSYSTÈME GLOBAL DE DÉVELOPPEMENT DE MARCHÉS',
    headlineTop: 'NOUS NE FORMONS PAS SEULEMENT DES DISTRIBUTEURS.',
    headlineBottom: 'NOUS BÂTISSONS DES MARCHÉS.',
    subheadline:
      'True Legacy est une communauté mondiale de leadership dédiée à identifier les opportunités émergentes, former des leaders locaux et développer Enagic sur les marchés neufs comme établis.',
    heroSupporting: 'Identifier l’opportunité tôt. Bâtir le leadership localement. Créer pour durer.',
    watchPresentation: 'Regarder la Présentation Commerciale',
    exploreOpportunity: 'Découvrir l’Opportunité',
    sharedBy: 'Partagé personnellement avec vous par',
    verifiedGuide: 'Votre Guide Vérifié',
    contactDistributor: 'Contacter',

    // Section 2: Business Video
    videoHeading: 'DÉCOUVREZ LA VISION AVANT DE DÉCOUVRIR LE MODÈLE',
    videoP1: 'Il ne s’agit pas simplement de vendre un produit.',
    videoP2:
      'Il s’agit de comprendre les grandes tendances mondiales, de se positionner intelligemment, de former des leaders et de bâtir une présence durable sur votre marché.',

    // Section 3: The Problem
    problemHeading: 'LA PLUPART DES GENS ARRIVENT SUR UN MARCHÉ APRÈS TOUT LE MONDE.',
    problemP1: 'Ils attendent que l’opportunité devienne évidente.',
    problemP2: 'Que tout le monde connaisse le produit.',
    problemP3: 'Que la concurrence soit partout.',
    problemP4: 'Que le marché soit déjà entièrement construit.',
    problemP5: 'Nous pensons différemment.',
    problemP6:
      'True Legacy recherche activement les marchés où la notoriété est encore en développement, où un leadership local solide est nécessaire et où les bonnes personnes peuvent poser les fondations au lieu d’arriver une fois tout établi.',
    problemP7: 'Mais les marchés émergents ne sont qu’une partie de l’équation.',
    problemP8: 'Sur les marchés matures, l’objectif change.',
    problemP9:
      'Nous identifions les zones où la croissance ralentit, où le positionnement a vieilli ou où les leaders se sont déconnectés de la nouvelle génération d’entrepreneurs.',
    problemP10: 'Nous y apportons une nouvelle énergie, des systèmes modernes, une image de marque forte et une stratégie adaptée.',
    problemStatement: 'À MARCHÉS DIFFÉRENTS, STRATÉGIES DIFFÉRENTES.',

    // Section 4: Our Specialty
    specialtyHeading: 'COMMENT TRUE LEGACY DÉVELOPPE LES MARCHÉS',
    stages: [
      {
        num: '01',
        name: 'DÉCOUVRIR',
        tagline: 'Repérer l’opportunité avant qu’elle ne devienne évidente.',
        points: ['Régions émergentes', 'Évolutions culturelles', 'Sensibilisation produit', 'Besoins en leadership', 'Nouveaux profils', 'Axes d’expansion'],
      },
      {
        num: '02',
        name: 'DÉVELOPPER',
        tagline: 'Développer les individus avant de chercher les chiffres.',
        points: ['Identifier les leaders', 'Communication & prise de parole', 'Image de marque', 'Expertise produit', 'Fondamentaux business', 'Coaching leadership', 'Mentorat', 'Systèmes'],
      },
      {
        num: '03',
        name: 'EXPANSER',
        tagline: 'Transformer un élan individuel en un marché pérenne.',
        points: ['Événements locaux', 'Formation continue', 'Communauté', 'Duplication', 'Synergie internationale', 'Développement de leaders', 'Infrastructures de marché'],
      },
    ],
    specialtyClosing1: 'Notre but n’est pas de créer des suiveurs.',
    specialtyClosing2: 'Notre but est de former des leaders capables de bâtir sans nous.',

    // Section 5: Global Market Strategy
    strategyHeading: 'DE L’IMPLANTATION À L’EXPANSION DU MARCHÉ',
    emergingTitle: 'MARCHÉS ÉMERGENTS',
    emergingDesc: 'Marchés où la notoriété démarre et où la priorité est d’établir des bases solides.',
    emergingExamples: ['Maroc', 'Colombie', 'Paraguay', 'Nigeria'],
    growthTitle: 'MARCHÉS EN CROISSANCE',
    growthDesc: 'Marchés où le leadership, les événements, les outils et la communauté s’étendent activement.',
    growthExamples: ['Mexique', 'Brésil', 'Émirats', 'Inde', 'Malaisie', 'Espagne'],
    establishedTitle: 'MARCHÉS ÉTABLIS',
    establishedDesc: 'Marchés où l’objectif est d’accélérer, repositionner l’image et renouveler la dynamique.',
    establishedExamples: ['États-Unis', 'Canada', 'Union Européenne'],
    strategyStatement1: 'Nous ne copions-collons pas une stratégie unique.',
    strategyStatement2: 'Nous adaptons la stratégie à chaque marché.',

    // Section 6: We Live the Strategy
    liveStrategyHeading: 'NOUS VIVONS LA STRATÉGIE QUE NOUS ENSEIGNONS.',
    liveStoryP1:
      'True Legacy n’est pas né de théories. Notre modèle a été forgé sur le terrain par des leaders qui ont osé quitter leur zone de confort pour prouver la méthode.',
    liveStoryP2:
      'Mehdi Cohen et Magaly Cardona ont développé une solide expérience aux États-Unis avant de choisir d’ouvrir de nouveaux horizons. Ils se sont installés au Maroc, ont appris la culture locale et ont créé une organisation là où aucun réseau n’existait.',
    liveStoryP3:
      'Ils ont ensuite étendu cette démarche à la Colombie et à l’Amérique latine : tisser des liens authentiques, s’adapter aux langues et former des équipes autonomes.',
    liveTakeaway1: 'Il est facile de parler d’ouvrir de nouveaux marchés.',
    liveTakeaway2:
      'C’est tout autre chose de déménager, de s’immerger dans des environnements inconnus, de créer des relations à partir de zéro et d’apprendre à générer une vraie dynamique.',

    // Section 7: Two Types of Builders
    buildersHeading: 'OÙ VOUS SITUEZ-VOUS ?',
    builderCard1Title: 'LE BÂTISSEUR DE MARCHÉ',
    builderCard1Points: [
      'Vous voyez des opportunités là où d’autres ne voient rien.',
      'Vous aimez être précurseur.',
      'Vous souhaitez construire un projet depuis les fondations.',
      'Vous êtes prêt à comprendre votre marché, former des personnes et poser les bases.',
    ],
    builderCard1Advantage: 'Votre avantage : le positionnement précoce.',
    builderCard2Title: 'L’ACCÉLÉRATEUR DE MARCHÉ',
    builderCard2Points: [
      'Vous vivez ou maîtrisez un marché déjà existant.',
      'Vous possédez déjà un réseau, une connaissance culturelle ou une communauté.',
      'Votre opportunité est d’apporter une nouvelle énergie, du leadership, des outils et une stratégie moderne.',
    ],
    builderCard2Advantage: 'Votre avantage : l’effet de levier.',
    buildersBanner1: 'IL N’Y A PAS DE « MEILLEUR MARCHÉ ».',
    buildersBanner2: 'IL Y A UNE MEILLEURE STRATÉGIE POUR LE MARCHÉ OÙ VOUS ÊTES.',

    // Section 8: The Vehicle
    vehicleHeading: 'UN VÉHICULE MONDIAL POUR UNE STRATÉGIE MONDIALE',
    vehicleIntro:
      'True Legacy opère à travers le modèle de distributeur indépendant Enagic, associant l’excellence industrielle japonaise à une licence de distribution internationale.',
    vehiclePoints: [
      { title: 'Fondée en 1974', desc: 'Plus de 50 ans d’excellence manufacturière et de stabilité financière.' },
      { title: 'Implantation Internationale', desc: 'Bureaux officiels directs dans plus de 23 centres économiques mondiaux.' },
      { title: 'Technologies Références', desc: 'Ioniseurs d’eau Leveluk et harmoniseurs environnementaux emGuarde GO.' },
      { title: 'Licence Mondiale Indépendante', desc: 'Contrat direct sans frontières géographiques ni quotas imposés.' },
      { title: 'Rémunération Brevetée', desc: 'Structure de commissions directes et indirectes adossée aux ventes réelles.' },
    ],
    vehicleCompliance:
      'Présentation pour distributeurs indépendants. Les résultats dépendent du travail individuel, du contexte de marché et du leadership. Aucun revenu ou rang n’est garanti.',

    // Section 9: The System
    systemHeading: 'L’OPPORTUNITÉ VOUS OUVRE LA PORTE. LE SYSTÈME VOUS APPREND À BÂTIR.',
    systemSub: 'Une infrastructure opérationnelle complète pour éliminer les doutes et dupliquer le leadership au-delà des frontières.',
    systemItems: [
      { title: 'Onboarding Structuré', desc: 'Feuille de route claire dès le premier jour.' },
      { title: 'Formation Produit & Eau', desc: 'Démonstrations scientifiques et conformité.' },
      { title: 'Fondamentaux du Modèle', desc: 'Maîtrise du plan de rémunération et gestion.' },
      { title: 'Appels Hebdomadaires', desc: 'Sessions stratégiques en direct en anglais et espagnol.' },
      { title: 'Académie de Leadership', desc: 'Modules avancés sur la duplication et le management.' },
      { title: 'Stratégies Océan Bleu', desc: 'Positionnement ciblé pour marchés neufs ou saturés.' },
      { title: 'Image de Marque & Médias', desc: 'Portraits professionnels, scripts et autorité digitale.' },
      { title: 'Cadres de Communication', desc: 'Scripts relationnels authentiques sans démarche agressive.' },
      { title: 'Plateforme CRM & Attribution', desc: 'Attribution sécurisée de tous vos prospects et contacts.' },
      { title: 'Événements & Séminaires', desc: 'Ateliers en présentiel, immersions et sommets annuels.' },
      { title: 'Outils de Présentation', desc: 'Présentations normalisées, vidéos et guides PDF.' },
      { title: 'Mentorat Direct 6A+', desc: 'Accompagnement par des leaders actifs sur le terrain.' },
    ],

    // Section 10: Leadership Ecosystem
    leadersHeading: 'DES PARCOURS DIFFÉRENTS. DES MARCHÉS DIVERS. UNE MÊME VISION.',
    leadersSub:
      'Vous ne dépendez pas d’une seule personne. Vous intégrez un réseau international de leaders aux expertises complémentaires.',
    leadersList: [
      { name: 'Mehdi Cohen', role: 'Stratégie Globale & Expansion LATAM', market: 'Global · LATAM · Maroc · USA', desc: '10+ ans d’expérience dans le bien-être et le développement international.' },
      { name: 'Simon Loh', role: 'Expertise Asie & Expansion Globale', market: 'Malaisie · Inde · EAU · Global', desc: 'Leader 6A2-4 pilotant des organisations transfrontalières d’envergure.' },
      { name: 'Magaly Cardona', role: 'Développement Communautaire & LATAM', market: 'USA · Amérique Latine', desc: 'Leader 6A experte en développement aligné sur les valeurs et la culture.' },
      { name: 'Ming-Way Sia', role: 'Systèmes de Duplication & Leadership', market: 'Malaisie · Inde · Global', desc: 'Leader 6A2-5 axé sur la rigueur d’exécution et la duplication.' },
      { name: 'Ryan Pool Sr', role: 'Stratégie Commerciale & Marché USA', market: 'États-Unis', desc: 'Entrepreneur et ancien athlète bâtissant un héritage familial pérenne.' },
      { name: 'Alex Gonzalez', role: 'Marketing Stratégique & Vétéran Santé', market: 'USA · LATAM', desc: 'Plus de 35 ans d’expérience de direction dans les compléments et la santé.' },
      { name: 'Zah Naderi', role: 'Coaching de Haute Performance', market: 'USA · Global', desc: 'Coach d’athlètes d’élite appliquant les standards d’excellence aux équipes.' },
      { name: 'Emanuela Braj', role: 'Leadership Commercial & Mentorat', market: 'USA · Europe de l’Est', desc: 'Plus de 10 ans d’expertise en vente et accompagnement porteur de sens.' },
      { name: 'Angel Mok', role: 'Expansion Internationale & Marchés Neufs', market: 'Malaisie · Singapour · EAU', desc: 'Ancienne opératrice boursière créant liberté et impact international.' },
      { name: 'Jesse Schexnayder', role: 'Dynamique Entrepreneuriale & Systèmes', market: 'États-Unis', desc: 'Entrepreneur en série et innovateur stimulant des équipes à haute énergie.' },
    ],

    // Section 11: Proof
    proofHeading: 'LES MARCHÉS SE CONSTRUISENT UN LEADER À LA FOIS.',
    proofSub: 'Des parcours concrets de personnes ayant développé leurs compétences et ouvert de nouveaux territoires.',
    proofStories: [
      {
        title: 'Ouvrir un Nouveau Pays de Zéro',
        person: 'Mehdi & Magaly',
        market: 'Maroc & LATAM',
        story: 'Arrivés sans contact sur place, ils ont compris la culture, gagné la confiance et structuré une équipe internationale dans plusieurs villes.',
      },
      {
        title: 'Bâtir une Dynamique Transfrontalière',
        person: 'Simon Loh & Ming-Way Sia',
        market: 'Asie & Moyen-Orient',
        story: 'Mise en place de protocoles de duplication permettant aux leaders de Malaisie, d’Inde et des Émirats d’animer des réunions en totale autonomie.',
      },
      {
        title: 'Du Salariat Supérieur à l’Entrepreneuriat Mondial',
        person: 'Angel Mok & Emanuela Braj',
        market: 'USA & Global',
        story: 'Transition réussie de carrières exigeantes vers une liberté internationale grâce aux méthodes cadrées de True Legacy.',
      },
      {
        title: 'Moderniser un Marché Établi',
        person: 'Ryan Pool & Alex Gonzalez',
        market: 'États-Unis',
        story: 'Utilisation du branding digital, du CRM et de l’éducation santé pour insuffler une dynamique nouvelle aux marchés matures.',
      },
    ],

    // Section 12: The Mission
    missionHeading: 'C’EST BIEN PLUS GRAND QU’UNE SIMPLE ENTREPRISE.',
    missionLines: [
      'Nous pensons que la prochaine génération d’entrepreneurs pensera de façon globale.',
      'Elle prendra soin de sa santé.',
      'Elle maîtrisera son temps.',
      'Elle construira au-delà des frontières.',
      'Elle utilisera la technologie comme un levier.',
      'Elle travaillera sur elle-même avant de vouloir guider les autres.',
      'Et elle bâtira des projets lui offrant le libre choix de son lieu de vie et de son impact.',
    ],
    missionPurpose1: 'True Legacy existe pour trouver ces personnes.',
    missionPurpose2: 'Les former.',
    missionPurpose3: 'Les connecter.',
    missionPurpose4: 'Et leur offrir une tribune pour créer un impact bien au-delà d’elles-mêmes.',
    missionFourPillars: [
      'MEILLEURE SANTÉ.',
      'LEADERS SOLIDES.',
      'NOUVEAUX MARCHÉS.',
      'HÉRITAGE DURABLE.',
    ],

    // Section 13: Final CTA
    finalHeading: 'OÙ ALLEZ-VOUS BÂTIR VOTRE HÉRITAGE ?',
    finalSub1: 'Chaque marché recèle des opportunités.',
    finalSub2: 'L’enjeu est de comprendre votre valeur ajoutée, votre avantage et la stratégie la plus pertinente pour vous.',
    exploreMarketBtn: 'Explorer Votre Marché Avec Nous',
    strategyCallBtn: 'Réserver un Échange Stratégique',
    finalTrust: 'Un échange constructif sur la stratégie, le positionnement et l’exécution. Sans fausses promesses ni pression.',
    stickyMobileCta: 'Explorer avec',
  },

  pt: {
    badge: 'ECOSSISTEMA GLOBAL DE DESENVOLVIMENTO DE MERCADOS',
    headlineTop: 'NÃO FORMAMOS APENAS DISTRIBUIDORES.',
    headlineBottom: 'CONSTRUÍMOS MERCADOS.',
    subheadline:
      'A True Legacy é uma comunidade global de liderança dedicada a identificar oportunidades emergentes, desenvolver líderes locais e expandir a Enagic tanto em novos mercados quanto em mercados consolidados.',
    heroSupporting: 'Encontre a oportunidade cedo. Desenvolva liderança localmente. Construa algo duradouro.',
    watchPresentation: 'Assistir à Apresentação de Negócios',
    exploreOpportunity: 'Explorar a Oportunidade',
    sharedBy: 'Compartilhado pessoalmente com você por',
    verifiedGuide: 'Seu Guia Verificado',
    contactDistributor: 'Contatar',

    // Section 2: Business Video
    videoHeading: 'CONHEÇA A VISÃO ANTES DE CONHECER O NEGÓCIO',
    videoP1: 'Isto não se trata apenas de vender um produto.',
    videoP2:
      'Trata-se de entender para onde o mundo está caminhando, posicionar-se com inteligência, formar líderes e construir algo relevante no seu mercado.',

    // Section 3: The Problem
    problemHeading: 'A MAIORIA ENTRA NOS MERCADOS DEPOIS DE TODO MUNDO.',
    problemP1: 'Eles esperam até que a oportunidade fique óbvia.',
    problemP2: 'Até que todo mundo conheça o produto.',
    problemP3: 'Até que a concorrência esteja em toda parte.',
    problemP4: 'Até que o mercado já tenha sido construído por outros.',
    problemP5: 'Nós pensamos diferente.',
    problemP6:
      'A True Legacy busca ativamente mercados onde o conhecimento ainda está se desenvolvendo, onde liderança local sólida é necessária e onde as pessoas certas podem construir os alicerces.',
    problemP7: 'Mas os mercados emergentes são apenas parte da estratégia.',
    problemP8: 'Quando atuamos em mercados consolidados, o objetivo muda.',
    problemP9:
      'Buscamos regiões onde o crescimento desacelerou, o posicionamento ficou desatualizado ou a liderança perdeu conexão com a nova geração.',
    problemP10: 'Então trazemos nova energia, sistemas, posicionamento de marca, formação e estratégia.',
    problemStatement: 'MERCADOS DIFERENTES EXIGEM ESTRATÉGIAS DIFERENTES.',

    // Section 4: Our Specialty
    specialtyHeading: 'COMO A TRUE LEGACY CONSTRÓI MERCADOS',
    stages: [
      {
        num: '01',
        name: 'DESCOBRIR',
        tagline: 'Encontrar a oportunidade antes que ela se torne óbvia.',
        points: ['Regiões emergentes', 'Mudanças culturais', 'Conscientização de produto', 'Lacunas de liderança', 'Novos perfis', 'Frentes de expansão'],
      },
      {
        num: '02',
        name: 'DESENVOLVER',
        tagline: 'Construir pessoas antes de focar em números.',
        points: ['Identificar líderes locais', 'Comunicação & oratória', 'Marca pessoal', 'Domínio de produtos', 'Fundamentos de negócios', 'Treinamento de liderança', 'Mentoria', 'Sistemas'],
      },
      {
        num: '03',
        name: 'EXPANDIR',
        tagline: 'Transformar o impulso individual em um mercado autossustentável.',
        points: ['Eventos presenciais', 'Educação contínua', 'Comunidade', 'Duplicação', 'Colaboração internacional', 'Formação de líderes', 'Infraestrutura de mercado'],
      },
    ],
    specialtyClosing1: 'O objetivo não é criar seguidores.',
    specialtyClosing2: 'O objetivo é desenvolver líderes capazes de construir sem nós.',

    // Section 5: Global Market Strategy
    strategyHeading: 'DA ENTRADA À EXPANSÃO DE MERCADO',
    emergingTitle: 'MERCADOS EMERGENTES',
    emergingDesc: 'Mercados onde a conscientização está no início e o foco é criar alicerces fortes.',
    emergingExamples: ['Marrocos', 'Colômbia', 'Paraguai', 'Nigéria'],
    growthTitle: 'MERCADOS EM CRESCIMENTO',
    growthDesc: 'Mercados onde liderança, eventos, sistemas e comunidade estão em franca expansão.',
    growthExamples: ['México', 'Brasil', 'Emirados Árabes', 'Índia', 'Malásia', 'Espanha'],
    establishedTitle: 'MERCADOS CONSOLIDADOS',
    establishedDesc: 'Mercados onde o objetivo é acelerar, renovar a marca e restabelecer o ritmo.',
    establishedExamples: ['Estados Unidos', 'Canadá', 'União Europeia'],
    strategyStatement1: 'Não copiamos e colamos uma única fórmula pelo mundo.',
    strategyStatement2: 'Adaptamos a estratégia a cada mercado.',

    // Section 6: We Live the Strategy
    liveStrategyHeading: 'VIVEMOS A ESTRATÉGIA QUE ENSINAMOS.',
    liveStoryP1:
      'A True Legacy não foi criada com base em teorias de sala de aula. Foi forjada no campo por líderes que fizeram as malas, deixaram ambientes confortáveis e comprovaram o modelo na prática.',
    liveStoryP2:
      'Mehdi Cohen e Magaly Cardona construíram sólida experiência nos Estados Unidos antes de decidirem se desafiar fora da zona de conforto. Foram para o Marrocos, aprenderam a cultura local e ergueram operações onde não havia rede anterior.',
    liveStoryP3:
      'Mais tarde, expandiram essa atuação para a Colômbia e América Latina: compreendendo idiomas e costumes, estabelecendo confiança real e formando comunidades autônomas.',
    liveTakeaway1: 'É fácil falar sobre entrar em novos mercados.',
    liveTakeaway2:
      'É muito diferente mudar de país, entrar em ambientes desconhecidos, construir relacionamentos do zero e aprender a gerar impulso real.',

    // Section 7: Two Types of Builders
    buildersHeading: 'ONDE VOCÊ SE ENCAIXA?',
    builderCard1Title: 'O CONSTRUTOR DE MERCADO',
    builderCard1Points: [
      'Você enxerga oportunidades onde outros ainda não veem nada.',
      'Você gosta de chegar primeiro.',
      'Tem interesse em construir algo desde os alicerces.',
      'Está disposto a estudar o mercado, formar pessoas e estabelecer as bases.',
    ],
    builderCard1Advantage: 'Sua vantagem: posicionamento pioneiro.',
    builderCard2Title: 'O ACELERADOR DE MERCADO',
    builderCard2Points: [
      'Você vive ou entende a fundo um mercado já existente.',
      'Já possui rede de contatos, conhecimento cultural ou comunidade.',
      'Sua oportunidade é trazer nova energia, liderança, marca, sistemas e estratégia para esse ambiente.',
    ],
    builderCard2Advantage: 'Sua vantagem: alavancagem.',
    buildersBanner1: 'NÃO EXISTE UM "MELHOR MERCADO."',
    buildersBanner2: 'EXISTE A MELHOR ESTRATÉGIA PARA O MERCADO EM QUE VOCÊ ESTÁ.',

    // Section 8: The Vehicle
    vehicleHeading: 'UM VEÍCULO GLOBAL PARA UMA ESTRATÉGIA GLOBAL',
    vehicleIntro:
      'A True Legacy opera através do modelo de distribuidor independente Enagic, combinando a excelência industrial japonesa com uma licença de distribuição mundial.',
    vehiclePoints: [
      { title: 'Fundada em 1974', desc: 'Mais de 50 anos de solidez financeira e fabricação própria no Japão.' },
      { title: 'Presença Internacional', desc: 'Escritórios corporativos oficiais em mais de 23 polos econômicos do mundo.' },
      { title: 'Tecnologias Padrão Ouro', desc: 'Ionizadores médicos Leveluk e harmonizadores ambientais emGuarde GO.' },
      { title: 'Licença Global Independente', desc: 'Contrato direto com autorização de vendas no mundo todo sem restrições de território.' },
      { title: 'Plano de Compensação Patenteado', desc: 'Estrutura de comissões atrelada ao volume real de produtos comercializados.' },
    ],
    vehicleCompliance:
      'Apresentação de distribuidor independente. Os resultados dependem do trabalho individual, contexto de mercado e liderança. Ganhos, qualificações ou resultados financeiros não são garantidos.',

    // Section 9: The System
    systemHeading: 'A OPORTUNIDADE ABRE A PORTA. O SISTEMA ENSINA VOCÊ A CONSTRUIR.',
    systemSub: 'Uma infraestrutura operacional completa para eliminar improvisos e duplicar liderança internacional.',
    systemItems: [
      { title: 'Onboarding Estruturado', desc: 'Plano de ação claro passo a passo desde o início.' },
      { title: 'Educação de Produto & Água', desc: 'Demonstrações científicas, laudos e conformidade.' },
      { title: 'Fundamentos de Negócios', desc: 'Domínio do plano de compensação e estruturação.' },
      { title: 'Chamadas Semanais Globais & LATAM', desc: 'Estratégia ao vivo, alinhamento e visão de futuro.' },
      { title: 'Academia de Liderança', desc: 'Módulos profundos de duplicação, mentalidade e gestão.' },
      { title: 'Estratégias de Oceano Azul', desc: 'Posicionamento inteligente para mercados novos ou saturados.' },
      { title: 'Marca Pessoal & Mídia', desc: 'Fotos em estúdio, roteiros de vídeo e autoridade online.' },
      { title: 'Modelos de Comunicação', desc: 'Roteiros de conversa elegantes que convidam sem pressionar.' },
      { title: 'Plataforma CRM & Atribuição', desc: 'Roteamento seguro garantindo que seus contatos permaneçam seus.' },
      { title: 'Eventos & Seminários ao Vivo', desc: 'Workshops presenciais, imersões e convenções anuais.' },
      { title: 'Ferramentas de Apresentação', desc: 'Apresentações padronizadas, funis de vídeo e guias em PDF.' },
      { title: 'Mentoria Direta com Líderes 6A+', desc: 'Acompanhamento de quem constrói ativamente no campo.' },
    ],

    // Section 10: Leadership Ecosystem
    leadersHeading: 'CONSTRUÍDO POR PESSOAS DIVERSAS. EM MERCADOS DIFERENTES. COM UMA SÓ VISÃO.',
    leadersSub:
      'Você não depende de uma única pessoa. Você acessa uma rede internacional de líderes com ampla experiência prática.',
    leadersList: [
      { name: 'Mehdi Cohen', role: 'Estratégia Global & Expansão LATAM', market: 'Global · LATAM · Marrocos · EUA', desc: 'Mais de 10 anos em bem-estar e desenvolvimento de mercados.' },
      { name: 'Simon Loh', role: 'Experiência na Ásia & Expansão Global', market: 'Malásia · Índia · EAU · Global', desc: 'Líder 6A2-4 com histórico de grandes organizações internacionais.' },
      { name: 'Magaly Cardona', role: 'Desenvolvimento Comunitário & LATAM', market: 'EUA · América Latina', desc: 'Líder 6A com foco em liderança alinhada a valores e cultura.' },
      { name: 'Ming-Way Sia', role: 'Sistemas de Liderança & Duplicação', market: 'Malasia · Índia · Global', desc: 'Líder 6A2-5 focado em disciplina e execução prática.' },
      { name: 'Ryan Pool Sr', role: 'Estratégia Comercial & Mercado EUA', market: 'Estados Unidos', desc: 'Empresário e ex-atleta construindo legado familiar de longo prazo.' },
      { name: 'Alex Gonzalez', role: 'Marketing Estratégico & Indústria de Saúde', market: 'EUA · LATAM', desc: 'Mais de 35 anos de atuação executiva no mercado de suplementação.' },
      { name: 'Zah Naderi', role: 'Coaching de Alta Performance', market: 'EUA · Global', desc: 'Treinador de atletas de elite aplicando rigor a equipes de negócios.' },
      { name: 'Emanuela Braj', role: 'Liderança Comercial & Mentoria', market: 'EUA · Leste Europeu', desc: 'Mais de uma década em vendas e mentoria voltada para propósito.' },
      { name: 'Angel Mok', role: 'Expansão Global & Mercados Emergentes', market: 'Malásia · Singapura · EAU', desc: 'Ex-trader do mercado financeiro gerando liberdade e impacto global.' },
      { name: 'Jesse Schexnayder', role: 'Impulso Empreendedor & Sistemas', market: 'Estados Unidos', desc: 'Empreendedor em série escalando times de alta energia.' },
    ],

    // Section 11: Proof
    proofHeading: 'MERCADOS SÃO CONSTRUÍDOS UM LÍDER POR VEZ.',
    proofSub: 'Histórias reais de pessoas que desenvolveram competências, abriram novas praças e criaram resultados consistentes.',
    proofStories: [
      {
        title: 'Abrindo um Novo País do Zero',
        person: 'Mehdi e Magaly',
        market: 'Marrocos & LATAM',
        story: 'Chegaram sem contatos locais, compreenderam a cultura, estabeleceram confiança e consolidaram uma equipe internacional em várias cidades.',
      },
      {
        title: 'Gerando Impulso Internacional',
        person: 'Simon Loh e Ming-Way Sia',
        market: 'Ásia & Oriente Médio',
        story: 'Criaram métodos de duplicação que capacitam líderes na Malásia, Índia e Emirados a liderar reuniões e suporte de forma independente.',
      },
      {
        title: 'Da Carreira Executiva ao Negócio Global',
        person: 'Angel Mok e Emanuela Braj',
        market: 'EUA & Global',
        story: 'Fizeram a transição do ambiente corporativo de alta pressão para o empreendedorismo internacional autônomo com o apoio da True Legacy.',
      },
      {
        title: 'Modernizando um Mercado Consolidado',
        person: 'Ryan Pool e Alex Gonzalez',
        market: 'Estados Unidos',
        story: 'Utilizaram posicionamento digital, CRM e educação em saúde para reenergizar praças maduras com novas gerações de empreendedores.',
      },
    ],

    // Section 12: The Mission
    missionHeading: 'ISTO É MUITO MAIOR QUE APENAS UM NEGÓCIO.',
    missionLines: [
      'Acreditamos que a próxima geração de empreendedores pensará de forma global.',
      'Cuidará conscientemente da sua saúde.',
      'Terá mais domínio sobre o seu tempo.',
      'Construirá além de fronteiras geográficas.',
      'Usará a tecnologia a seu favor em vez de temê-la.',
      'Irá se desenvolver antes de querer liderar os outros.',
      'E construirá negócios que ofereçam real liberdade de escolha sobre onde morar e com quem trabalhar.',
    ],
    missionPurpose1: 'A True Legacy existe para encontrar essas pessoas.',
    missionPurpose2: 'Formá-las.',
    missionPurpose3: 'Conectá-las.',
    missionPurpose4: 'E fornecer uma plataforma para que gerem um impacto que vá muito além delas.',
    missionFourPillars: [
      'MAIS SAÚDE.',
      'LÍDERES FORTES.',
      'NOVOS MERCADOS.',
      'LEGADO GENERACIONAL.',
    ],

    // Section 13: Final CTA
    finalHeading: 'ONDE VOCÊ VAI CONSTRUIR SEU LEGADO?',
    finalSub1: 'Todo mercado tem uma grande oportunidade.',
    finalSub2: 'A questão é entender onde você se encaixa, qual é a sua vantagem e qual estratégia faz sentido para a sua realidade.',
    exploreMarketBtn: 'Explore Seu Mercado Conosco',
    strategyCallBtn: 'Agendar Conversa de Estratégia',
    finalTrust: 'Uma conversa inteligente sobre estratégia, posicionamento e execução prática. Sem promessas fáceis e sem pressão.',
    stickyMobileCta: 'Explorar com',
  },
}

export function BusinessLandingPage({ profile: initialProfile, distributorSlug }: BusinessLandingPageProps) {
  const { locale, setLocale } = useLocaleContext()
  const routeParams = useParams<{ slug?: string }>()
  const [searchParams] = useSearchParams()

  const resolvedSlug = routeParams.slug || searchParams.get('ref') || distributorSlug || 'mehdi-cohen'
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(initialProfile)
  const [activeMarketTab, setActiveMarketTab] = useState<'emerging' | 'growth' | 'established'>('emerging')
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [hideStickyAtBottom, setHideStickyAtBottom] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)

  const t = I18N[locale] || I18N.en

  useEffect(() => {
    if (initialProfile && initialProfile.slug === resolvedSlug) {
      setProfile(initialProfile)
      return
    }
    getPublicDistributors().then((distributors) => {
      const found = distributors.find((d) => d.slug === resolvedSlug || d.referral_code === resolvedSlug)
      setProfile(found || distributors.find((d) => d.slug === 'mehdi-cohen') || distributors[0] || null)
    })
  }, [initialProfile, resolvedSlug])

  const distributorName = profile?.display_name || (resolvedSlug === 'mehdi-cohen' ? 'Mehdi Cohen' : 'True Legacy')
  const distributorFirstName = distributorName.split(' ')[0]
  const distributorSlugActive = profile?.slug || resolvedSlug || 'mehdi-cohen'
  const referralCode = profile?.referral_code || distributorSlugActive

  const leaderPhoto =
    profile?.avatar_url ||
    getLeaderPortrait(distributorSlugActive, LEADER_PORTRAITS[distributorSlugActive]) ||
    '/leaders/standardized/mehdi-cohen.png'

  const whatsappNumber = profile?.phone ? profile.phone.replace(/\D/g, '') : '18649072149'

  const generateWhatsAppUrl = (customMsg?: string) => {
    let msg = ''
    if (customMsg) {
      msg = customMsg
    } else if (locale === 'es') {
      msg = `Hola ${distributorFirstName}, estuve revisando la visión de desarrollo de mercados de True Legacy y me gustaría conversar sobre mi mercado.`
    } else if (locale === 'fr') {
      msg = `Bonjour ${distributorFirstName}, j'ai découvert la vision de développement de marchés de True Legacy et j'aimerais échanger sur les opportunités pour mon marché.`
    } else if (locale === 'pt') {
      msg = `Olá ${distributorFirstName}, conheci a visão de desenvolvimento de mercados da True Legacy e gostaria de conversar sobre a estratégia para o meu mercado.`
    } else {
      msg = `Hi ${distributorFirstName}, I reviewed True Legacy's market-building vision and would like to discuss the strategy for my market.`
    }
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
  }

  const defaultWhatsAppUrl = generateWhatsAppUrl()
  const applicationUrl = `/apply?ref=${encodeURIComponent(referralCode)}&interest=distributor&source=business`
  const bookingStrategyUrl = `/book/${encodeURIComponent(distributorSlugActive)}/strategy`

  // Video URL
  const videoUrl = locale === 'es' ? 'https://youtu.be/t1OtNA4p8y4' : 'https://youtu.be/lB5fW55DmaI'

  // Scroll tracking for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom
        setShowStickyCta(heroBottom < 0)
      }
      if (finalCtaRef.current) {
        const finalTop = finalCtaRef.current.getBoundingClientRect().top
        setHideStickyAtBottom(finalTop < window.innerHeight - 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // CRM Analytics Tracking
  useEffect(() => {
    if (distributorSlugActive && crmSupabase) {
      void crmSupabase.rpc('crm_track_share_click', {
        p_slug: distributorSlugActive,
        p_campaign: 'business',
        p_locale: locale,
      })
    }
  }, [distributorSlugActive, locale])

  const scrollToVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#030611] text-[#f5f5f7] font-sans antialiased selection:bg-amber-500/30 selection:text-white relative">
      <SEO
        title={`True Legacy Business | ${distributorName} — We Build Markets`}
        description={`${t.headlineTop} ${t.headlineBottom} — ${t.subheadline}`}
        image="https://www.truelegacyworld.com/logos/tl-square-white.png"
      />

      {/* ========================================================================= */}
      {/* SIMPLIFIED DEDICATED HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#030611]/90 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <TrueLegacyLogo variant="nav" />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  className={`px-2.5 py-1 rounded-md transition-all uppercase tracking-wider ${
                    locale === lang
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                  title={`Switch to ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  location: 'business_header',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/15 hover:brightness-110 transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xs:inline">{t.contactDistributor} {distributorFirstName}</span>
              <span className="xs:hidden">{t.contactDistributor}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: HERO */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-14 pb-20 sm:pt-24 sm:pb-32 border-b border-white/10 bg-gradient-to-b from-[#030611] via-[#050b1c] to-[#040816]"
      >
        {/* Elegant Global Atmosphere & Connection Grid */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[850px] rounded-full bg-cyan-500/10 blur-[150px]" />
          <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[130px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Market Ecosystem Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300 shadow-sm backdrop-blur-md">
            <Globe2 className="h-3.5 w-3.5 text-amber-400" />
            {t.badge}
          </div>

          {/* Main Hero Headline */}
          <h1 className="mt-7 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] max-w-4xl">
            <span className="text-[#86868b] block text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1">
              {t.headlineTop}
            </span>
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              {t.headlineBottom}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-3xl text-base sm:text-lg md:text-xl text-[#cccccc] leading-relaxed">
            {t.subheadline}
          </p>

          {/* Punchy Supporting Statement */}
          <div className="mt-5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs sm:text-sm font-semibold text-cyan-300 backdrop-blur-sm">
            {t.heroSupporting}
          </div>

          {/* Personalized Guide Line */}
          <div className="mt-8 flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.03] p-2 pr-5 backdrop-blur-xl shadow-xl">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-amber-400/40 bg-slate-900 shadow-inner">
              <img
                src={leaderPhoto}
                alt={distributorName}
                className="h-full w-full object-cover object-top"
              />
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#030611]"
                title="Verified"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <span>{t.verifiedGuide}</span>
                <ShieldCheck className="h-3 w-3 text-amber-400" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {t.sharedBy} <strong className="text-amber-300">{distributorName}</strong>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={scrollToVideo}
              className="w-full sm:w-auto inline-flex min-h-13 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 px-8 py-3.5 text-base font-black text-slate-950 shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all active:scale-95"
            >
              <PlayCircle className="h-5 w-5" />
              {t.watchPresentation}
            </button>

            <Link
              to={applicationUrl}
              onClick={() =>
                trackEvent('link_click', {
                  location: 'business_hero_explore',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="w-full sm:w-auto inline-flex min-h-13 items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-base font-bold text-white transition-all shadow-lg active:scale-95"
            >
              {t.exploreOpportunity}
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: BUSINESS VIDEO (HERO -> VIDEO -> EXPLANATION) */}
      {/* ========================================================================= */}
      <section
        id="video-presentation"
        ref={videoRef}
        className="py-16 sm:py-24 border-b border-white/10 bg-[#02040b] relative"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400">
              Executive Overview
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {t.videoHeading}
            </h2>
            <div className="mt-4 space-y-1.5 text-base sm:text-lg text-[#cccccc] leading-relaxed">
              <p className="font-semibold text-white">{t.videoP1}</p>
              <p>{t.videoP2}</p>
            </div>
          </div>

          {/* Large Visual Video Container */}
          <div className="relative rounded-3xl border-2 border-amber-400/30 bg-gradient-to-b from-[#14120e] via-[#09080b] to-[#04060c] p-3 sm:p-5 shadow-2xl shadow-amber-500/10">
            <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src={videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]}
                  title="True Legacy Global Business Presentation"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-[#86868b]">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                Strategic Market Development Briefing
              </span>
              <span className="font-semibold text-slate-300">
                Official True Legacy Leadership Curriculum
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE PROBLEM */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#040816] relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-rose-300">
              <Target className="h-3.5 w-3.5" />
              Strategic Market Reality
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {t.problemHeading}
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* The Conventional Approach */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-4">
              <p className="text-xs font-black uppercase tracking-wider text-rose-400">
                The Common Crowd Behavior
              </p>
              <ul className="space-y-3 text-sm sm:text-base text-[#cccccc]">
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{t.problemP1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{t.problemP2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{t.problemP3}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{t.problemP4}</span>
                </li>
              </ul>
            </div>

            {/* True Legacy Market-Building Approach */}
            <div className="rounded-3xl border border-cyan-400/25 bg-cyan-950/20 p-6 sm:p-8 space-y-4 shadow-xl">
              <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                The True Legacy Approach
              </p>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {t.problemP5}
              </p>
              <p className="text-sm sm:text-base text-[#cccccc] leading-relaxed">
                {t.problemP6}
              </p>
              <div className="pt-3 border-t border-white/10 space-y-2 text-xs sm:text-sm text-slate-300">
                <p className="font-semibold text-cyan-200">{t.problemP7} {t.problemP8}</p>
                <p>{t.problemP9}</p>
                <p className="font-semibold text-white">{t.problemP10}</p>
              </div>
            </div>
          </div>

          {/* Strong Visual Statement */}
          <div className="mt-12 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 p-6 text-center shadow-lg">
            <p className="text-base sm:text-xl font-black text-amber-200 uppercase tracking-wide">
              {t.problemStatement}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: OUR SPECIALTY (3-STAGE VISUAL PROCESS) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#030611] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300">
              <Compass className="h-3.5 w-3.5" />
              Our Core Discipline
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.specialtyHeading}
            </h2>
          </div>

          {/* 3-Stage Cards */}
          <div className="grid gap-8 lg:grid-cols-3">
            {t.stages.map((stage, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1629] via-[#070b15] to-[#04060d] p-7 sm:p-8 flex flex-col justify-between hover:border-cyan-400/40 transition-all shadow-2xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-lg font-black text-cyan-300">
                      {stage.num}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">
                      Stage {stage.num}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {stage.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-amber-300/90 leading-snug">
                    {stage.tagline}
                  </p>

                  <ul className="mt-6 space-y-2.5 pt-6 border-t border-white/10">
                    {stage.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#cccccc]">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Closing Distinction Banner */}
          <div className="mt-14 rounded-3xl border border-white/20 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-amber-500/10 p-8 text-center backdrop-blur-xl">
            <p className="text-sm sm:text-base font-semibold text-slate-300">
              {t.specialtyClosing1}
            </p>
            <p className="mt-2 text-xl sm:text-2xl font-black text-white tracking-wide">
              {t.specialtyClosing2}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: GLOBAL MARKET STRATEGY */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#040816] relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Globe className="h-3.5 w-3.5" />
              Global Presence & Expansion
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.strategyHeading}
            </h2>
          </div>

          {/* 3 Categories Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {/* Emerging */}
            <div
              onClick={() => setActiveMarketTab('emerging')}
              className={`cursor-pointer rounded-3xl border p-7 transition-all ${
                activeMarketTab === 'emerging'
                  ? 'border-cyan-400/50 bg-cyan-950/30 shadow-xl'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  Tier 1
                </span>
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
              <h3 className="text-xl font-black text-white">{t.emergingTitle}</h3>
              <p className="mt-2 text-xs text-[#cccccc] leading-relaxed">{t.emergingDesc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                {t.emergingExamples.map((ex, i) => (
                  <span key={i} className="text-[11px] font-bold text-cyan-300 bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg">
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            {/* Growth */}
            <div
              onClick={() => setActiveMarketTab('growth')}
              className={`cursor-pointer rounded-3xl border p-7 transition-all ${
                activeMarketTab === 'growth'
                  ? 'border-amber-400/50 bg-amber-950/30 shadow-xl'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  Tier 2
                </span>
                <TrendingUp className="h-4 w-4 text-amber-400" />
              </div>
              <h3 className="text-xl font-black text-white">{t.growthTitle}</h3>
              <p className="mt-2 text-xs text-[#cccccc] leading-relaxed">{t.growthDesc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                {t.growthExamples.map((ex, i) => (
                  <span key={i} className="text-[11px] font-bold text-amber-300 bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg">
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            {/* Established */}
            <div
              onClick={() => setActiveMarketTab('established')}
              className={`cursor-pointer rounded-3xl border p-7 transition-all ${
                activeMarketTab === 'established'
                  ? 'border-emerald-400/50 bg-emerald-950/30 shadow-xl'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Tier 3
                </span>
                <Building2 className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white">{t.establishedTitle}</h3>
              <p className="mt-2 text-xs text-[#cccccc] leading-relaxed">{t.establishedDesc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                {t.establishedExamples.map((ex, i) => (
                  <span key={i} className="text-[11px] font-bold text-emerald-300 bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Statement Below Strategy */}
          <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center">
            <p className="text-sm sm:text-base text-[#cccccc]">
              {t.strategyStatement1}
            </p>
            <p className="mt-1 text-base sm:text-lg font-black text-amber-300">
              {t.strategyStatement2}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: WE LIVE THE STRATEGY */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#030611] relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#12100d] via-[#09080c] to-[#04060d] p-8 sm:p-12 shadow-2xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              {/* Photo Composition - Dual Leaders Mehdi & Magaly */}
              <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-400/30 bg-black/40 shadow-2xl">
                  <img
                    src="/leaders/standardized/mehdi-cohen.png"
                    alt="Mehdi Cohen"
                    className="h-56 sm:h-80 w-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-black text-white">Mehdi Cohen</p>
                    <p className="text-[10px] sm:text-xs text-amber-300 font-semibold">6A Leader</p>
                  </div>
                </div>

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-400/30 bg-black/40 shadow-2xl">
                  <img
                    src="/leaders/standardized/magaly-cardona.png"
                    alt="Magaly Cardona"
                    className="h-56 sm:h-80 w-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-black text-white">Magaly Cardona</p>
                    <p className="text-[10px] sm:text-xs text-amber-300 font-semibold">6A Leader</p>
                  </div>
                </div>
              </div>

              {/* Narrative */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-300">
                  <Flame className="h-3.5 w-3.5" />
                  Field Proven
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {t.liveStrategyHeading}
                </h2>

                <div className="space-y-3.5 text-sm sm:text-base text-[#cccccc] leading-relaxed">
                  <p>{t.liveStoryP1}</p>
                  <p>{t.liveStoryP2}</p>
                  <p>{t.liveStoryP3}</p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-1 text-slate-200">
                  <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">{t.liveTakeaway1}</p>
                  <p className="text-sm sm:text-base font-bold text-amber-200">{t.liveTakeaway2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: TWO TYPES OF BUILDERS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#040816]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.buildersHeading}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1: The Market Builder */}
            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-[#0c1628] to-[#050912] p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-white">{t.builderCard1Title}</h3>
                <ul className="mt-6 space-y-3.5">
                  {t.builderCard1Points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#cccccc]">
                      <Check className="h-4 w-4 text-cyan-400 mt-1 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center rounded-2xl bg-cyan-500/10 py-3">
                <p className="text-sm font-black text-cyan-300 uppercase tracking-wider">
                  {t.builderCard1Advantage}
                </p>
              </div>
            </div>

            {/* Card 2: The Market Accelerator */}
            <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#18140c] to-[#080705] p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-400/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-white">{t.builderCard2Title}</h3>
                <ul className="mt-6 space-y-3.5">
                  {t.builderCard2Points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#cccccc]">
                      <Check className="h-4 w-4 text-amber-400 mt-1 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center rounded-2xl bg-amber-500/10 py-3">
                <p className="text-sm font-black text-amber-300 uppercase tracking-wider">
                  {t.builderCard2Advantage}
                </p>
              </div>
            </div>
          </div>

          {/* Large Statement Below Both Cards */}
          <div className="mt-14 rounded-3xl border border-white/20 bg-black/60 p-8 text-center shadow-xl">
            <p className="text-sm sm:text-base font-bold text-[#86868b] uppercase tracking-widest">
              {t.buildersBanner1}
            </p>
            <p className="mt-2 text-xl sm:text-3xl font-black text-white tracking-tight">
              {t.buildersBanner2}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: THE VEHICLE (ENAGIC INDEPENDENT DISTRIBUTOR MODEL) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#030611] relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#2997ff]">
              <Award className="h-3.5 w-3.5" />
              Corporate & Manufacturing Backing
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.vehicleHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#cccccc] leading-relaxed">
              {t.vehicleIntro}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {t.vehiclePoints.map((vp, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <h4 className="text-sm font-bold text-white">{vp.title}</h4>
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
            <p className="text-xs text-[#86868b] leading-relaxed max-w-3xl mx-auto">
              {t.vehicleCompliance}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: THE SYSTEM */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#040816]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.systemHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#cccccc]">
              {t.systemSub}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {t.systemItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#86868b] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: LEADERSHIP ECOSYSTEM */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#030611] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {t.leadersHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#cccccc]">
              {t.leadersSub}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {t.leadersList.map((leader, i) => {
              const photo = resolveLeaderPhoto(leader.name)
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/15 bg-white/[0.03] p-5 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-xl text-center"
                >
                  <div>
                    <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-2xl border border-white/20 bg-slate-900">
                      <img
                        src={photo}
                        alt={leader.name}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-base font-black text-white">{leader.name}</h3>
                    <p className="text-xs font-bold text-amber-300 mt-0.5">{leader.role}</p>
                    <p className="text-[11px] text-cyan-400 mt-1 flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {leader.market}
                    </p>
                    <p className="mt-3 text-xs text-[#86868b] leading-relaxed">{leader.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11: PROOF */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-28 border-b border-white/10 bg-[#040816]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.proofHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#cccccc]">
              {t.proofSub}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {t.proofStories.map((story, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/15 bg-white/[0.03] p-7 flex flex-col justify-between hover:border-white/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      {story.person}
                    </span>
                    <span className="text-[11px] text-cyan-300 font-semibold">
                      {story.market}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
                  <p className="text-sm text-[#cccccc] leading-relaxed">{story.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 12: THE MISSION (CINEMATIC & EMOTIONAL) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-32 border-b border-white/10 bg-gradient-to-b from-[#030611] via-[#020308] to-[#010205] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,170,72,0.08),transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
            The Purpose
          </span>

          <h2 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {t.missionHeading}
          </h2>

          <div className="mt-10 space-y-3.5 text-base sm:text-xl text-[#cccccc] leading-relaxed max-w-2xl mx-auto">
            {t.missionLines.map((line, i) => (
              <p key={i} className="font-medium text-slate-200">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-10 py-6 border-y border-white/10 space-y-1 text-sm sm:text-base font-semibold text-cyan-300">
            <p>{t.missionPurpose1}</p>
            <p>{t.missionPurpose2}</p>
            <p>{t.missionPurpose3}</p>
            <p className="text-white font-bold">{t.missionPurpose4}</p>
          </div>

          {/* 4 Pillars Final Cinematic Statement */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {t.missionFourPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-center backdrop-blur-md"
              >
                <p className="text-xs sm:text-sm font-black text-amber-200 tracking-wider">
                  {pillar}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 13: FINAL CTA */}
      {/* ========================================================================= */}
      <section ref={finalCtaRef} className="py-20 sm:py-32 bg-[#02040a] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full border-2 border-amber-400/40 p-0.5 shadow-2xl">
            <img
              src={leaderPhoto}
              alt={distributorName}
              className="h-full w-full rounded-full object-cover object-top"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            {t.finalHeading}
          </h2>

          <div className="mt-5 max-w-2xl mx-auto space-y-1.5 text-base sm:text-lg text-[#cccccc] leading-relaxed">
            <p className="font-semibold text-slate-200">{t.finalSub1}</p>
            <p>{t.finalSub2}</p>
          </div>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={applicationUrl}
              onClick={() =>
                trackEvent('form_click', {
                  location: 'business_final_explore',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="w-full sm:w-auto inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:brightness-110 px-8 py-4 text-base font-black text-slate-950 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
            >
              {t.exploreMarketBtn}
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  location: 'business_final_strategy',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="w-full sm:w-auto inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 px-8 py-4 text-base font-bold text-white transition-all shadow-lg active:scale-95"
            >
              <MessageCircle className="h-5 w-5 text-emerald-400" />
              {t.strategyCallBtn}
            </a>
          </div>

          <p className="mt-6 text-xs sm:text-sm font-medium text-[#86868b] max-w-lg mx-auto">
            {t.finalTrust}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MOBILE STICKY CTA */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showStickyCta && !hideStickyAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-4 left-4 z-40 sm:hidden"
          >
            <Link
              to={applicationUrl}
              onClick={() =>
                trackEvent('link_click', {
                  location: 'business_mobile_sticky',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 py-3.5 text-sm font-black text-slate-950 shadow-2xl shadow-amber-500/30 active:scale-95"
            >
              {t.stickyMobileCta} {distributorFirstName}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
