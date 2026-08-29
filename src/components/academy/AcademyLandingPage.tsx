import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BriefcaseBusiness,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Lock,
  MessageCircle,
  Play,
  PlayCircle,
  Radio,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  X,
  Zap,
  Check,
  Clock,
  Compass,
  Award,
  ArrowUpRight,
  Laptop,
  Tablet,
  Phone,
  BarChart3,
  Calendar,
  Share2,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { crmSupabase, getLeaderPortrait, type PublicDistributor } from '@/lib/crm'

// Standardized fallback leader portraits mapping
const LEADER_PORTRAITS: Record<string, string> = {
  'mehdi-cohen': '/leaders/standardized/mehdi-cohen.png',
  'magaly-cardona': '/leaders/standardized/magaly-cardona.png',
  'ryan-pool': '/leaders/standardized/ryan-pool-sr.png',
  'ryan-pool-sr': '/leaders/standardized/ryan-pool-sr.png',
  'ming-way-sia': '/leaders/standardized/ming-way-sia.png',
  'alex-gonzalez': '/leaders/standardized/alex-gonzalez.png',
  'zah-naderi': '/leaders/standardized/zah-naderi-v3.png',
  'simon-loh': '/leaders/standardized/simon-loh-v2.png',
  emanuela: '/leaders/standardized/emanuela-doustova.png',
  'emanuela-braj': '/leaders/standardized/emanuela-doustova.png',
  'jesse-schexnayder': '/leaders/standardized/jesse-schexnayder.png',
  'angel-mok': '/leaders/standardized/angel-mok-v2.png',
}

function resolveLeaderPhoto(slug: string, customUrl?: string | null): string {
  if (customUrl && !customUrl.includes('placeholder')) return customUrl
  const normalized = slug.toLowerCase().trim()
  if (LEADER_PORTRAITS[normalized]) return LEADER_PORTRAITS[normalized]
  if (normalized.includes('ryan')) return LEADER_PORTRAITS['ryan-pool']
  if (normalized.includes('emanuela')) return LEADER_PORTRAITS['emanuela']
  if (normalized.includes('zah')) return LEADER_PORTRAITS['zah-naderi']
  if (normalized.includes('simon')) return LEADER_PORTRAITS['simon-loh']
  if (normalized.includes('ming')) return LEADER_PORTRAITS['ming-way-sia']
  if (normalized.includes('magaly')) return LEADER_PORTRAITS['magaly-cardona']
  if (normalized.includes('mehdi')) return LEADER_PORTRAITS['mehdi-cohen']
  if (normalized.includes('alex')) return LEADER_PORTRAITS['alex-gonzalez']
  if (normalized.includes('jesse')) return LEADER_PORTRAITS['jesse-schexnayder']
  if (normalized.includes('angel')) return LEADER_PORTRAITS['angel-mok']
  return '/logos/tl-square-white.png'
}

// 10 Real Training Modules with Real Video & Resource Links
interface AcademyModule {
  id: string
  title: Record<string, string>
  instructor: string
  instructorSlug?: string
  category: 'foundation' | 'product' | 'communication' | 'systems' | 'leadership' | 'market'
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  videoUrl: string
  description: Record<string, string>
  keyTakeaways: Record<string, string[]>
  resources?: Array<{ title: string; url: string; type: 'pdf' | 'doc' | 'link' }>
}

const REAL_ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 'purpose-vision',
    title: {
      en: 'The Power of Your Purpose in Enagic',
      es: 'El Poder de tu Propósito en Enagic',
      fr: 'Le Pouvoir de Votre Mission dans Enagic',
      pt: 'O Poder do Seu Propósito na Enagic',
    },
    instructor: 'True Legacy Leadership',
    category: 'foundation',
    duration: '45 min',
    level: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=2O7DboiJBdE',
    description: {
      en: 'Rediscover your Why, uncover your deeper purpose, and build your 3-Year Vision roadmap with a guided framework to shape your leadership path.',
      es: 'Redescubriremos tu Porqué, descubriremos tu propósito más profundo y elaboraremos tu Visión a 3 Años con un marco guiado para tu camino al liderazgo.',
      fr: 'Redécouvrez votre Pourquoi, définissez votre vision à 3 ans et construisez les bases solides de votre parcours de leadership.',
      pt: 'Redescubra seu Porquê, defina sua visão de 3 anos e construa uma base sólida para sua liderança.',
    },
    keyTakeaways: {
      en: ['Defining the Core "Why"', '3-Year Vision Crafting', 'Mindset for Long-Term Duplication'],
      es: ['Definición del "Porqué" Central', 'Creación de Visión a 3 Años', 'Mentalidad para Duplicación a Largo Plazo'],
    },
    resources: [
      {
        title: 'Template: Letter to Your Future Self',
        url: 'https://drive.google.com/file/d/1_yOHfNqi2pomD28jeqSWjpjnFy4xIlY0/view',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'kangen-science',
    title: {
      en: 'Mastering the $10B Flagship Technologies: LeveLuk & emGuarde',
      es: 'Dominando los Productos de $10 Billones: LeveLuk y emGuarde',
      fr: 'Maîtriser les Technologies Phares: LeveLuk et emGuarde',
      pt: 'Dominando as Tecnologias Principais: LeveLuk e emGuarde',
    },
    instructor: 'Simon Loh & Mehdi Cohen',
    instructorSlug: 'simon-loh',
    category: 'product',
    duration: '60 min',
    level: 'Beginner',
    videoUrl: 'https://youtu.be/_LcCVpKnVxk',
    description: {
      en: 'Position the LeveLuk K8 series confidently against competitors and understand how emGuarde GO uniquely protects against ambient EMF radiation.',
      es: 'Posiciona la serie LeveLuk frente a la competencia y descubre por qué emGuarde GO es único en la protección contra radiación electromagnética ambiental.',
      fr: 'Positionnez la série LeveLuk avec assurance et comprenez les avantages uniques de la technologie emGuarde GO.',
      pt: 'Posicione a série LeveLuk com autoridade e compreenda as vantagens exclusivas do emGuarde GO.',
    },
    keyTakeaways: {
      en: ['Medical Device Certifications & Standards', 'emGuarde Frequency Harmonization', 'Clear, Compliant Product Demos'],
      es: ['Certificaciones de Dispositivo Médico', 'Armonización de Frecuencias emGuarde', 'Demostraciones Claras y Cumplidas'],
    },
    resources: [
      {
        title: 'Kangen Water Ionizers Product Guide',
        url: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf',
        type: 'pdf',
      },
      {
        title: 'Machine Maintenance & Care Guide',
        url: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'product-lineup',
    title: {
      en: 'The 8-Point Compensation System & Action Architecture',
      es: 'El Sistema de 8 Puntos y Plan de Acción',
      fr: 'Le Système de Rémunération à 8 Points et le Plan d’Action',
      pt: 'O Sistema de Compensação de 8 Pontos e o Plano de Ação',
    },
    instructor: 'True Legacy Executive Leaders',
    category: 'foundation',
    duration: '60 min',
    level: 'Intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=FndRvUtZXL0',
    description: {
      en: "Break down Enagic's patented 8-Point compensation model and how top leaders use it to build sustainable, multi-generational organization revenue.",
      es: 'Analiza el programa patentado de 8 Puntos de Enagic y descubre cómo estructurar rangos y construir ingresos sostenibles.',
      fr: 'Comprenez le modèle de rémunération breveté à 8 points pour structurer votre organisation de façon pérenne.',
      pt: 'Analise o plano patenteado de 8 pontos para estruturar sua organização com sustentabilidade.',
    },
    keyTakeaways: {
      en: ['Direct vs Indirect Point Distribution', '6A Milestone Pathways', 'Maximizing Market Leverage'],
      es: ['Distribución Directa vs Indirecta', 'Caminos al Rango 6A', 'Apalancamiento de Mercado'],
    },
    resources: [
      {
        title: 'Enagic 8-Point Compensation Guide',
        url: 'https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf',
        type: 'pdf',
      },
      {
        title: '6-Month Projection Spreadsheet',
        url: 'https://docs.google.com/spreadsheets/d/1zvfw-oBtkKLdSfVTquQw8J3g0ptTvBGT68weJF93MzA/edit',
        type: 'doc',
      },
    ],
  },
  {
    id: 'leadership-structure',
    title: {
      en: 'The Blueprint for Building Lasting Legacy with Enagic',
      es: 'El Plan para Construir tu Legado con Enagic',
      fr: 'Le Plan pour Bâtir un Héritage Durable avec Enagic',
      pt: 'O Plano para Construir seu Legado com a Enagic',
    },
    instructor: 'Coach Ming-Way Sia & Simon Loh',
    instructorSlug: 'ming-way-sia',
    category: 'leadership',
    duration: '75 min',
    level: 'Intermediate',
    videoUrl: 'https://youtu.be/Jz1LFvYTonI',
    description: {
      en: 'Why 8 Points is just the entry point, 6A2 is the baseline, and true legacy builds across 6A2-3 through 6A2-8 with structural stability.',
      es: 'Por qué los 8 Puntos son solo el comienzo, 6A2 es la entrada y el verdadero legado se construye en 6A2-3 en adelante con solidez estructural.',
      fr: 'Pourquoi les 8 points ne sont que le début et comment construire une organisation autonome et pérenne.',
      pt: 'Por que os 8 pontos são o início e como estruturar uma organização autônoma e duradoura.',
    },
    keyTakeaways: {
      en: ['Structural Stability Frameworks', 'Developing Independent Hubs', 'Generational Wealth Systems'],
      es: ['Estructuras de Estabilidad', 'Desarrollo de Centros Independientes', 'Sistemas de Riqueza Generacional'],
    },
  },
  {
    id: 'systems-funnels',
    title: {
      en: 'The System to Reach 6A Faster (Without Burnout)',
      es: 'El Sistema para Alcanzar 6A Más Rápido (Sin Agotarte)',
      fr: 'Le Système pour Atteindre 6A Plus Vite (Sans Épuisement)',
      pt: 'O Sistema para Atingir 6A Mais Rápido (Sem Esgotamento)',
    },
    instructor: 'Mehdi Cohen',
    instructorSlug: 'mehdi-cohen',
    category: 'systems',
    duration: '90 min',
    level: 'Advanced',
    videoUrl: 'https://youtu.be/tL5KtgzCB74',
    description: {
      en: 'Master the True Legacy workflow: attract the right builders, convert them into leaders, and scale duplicate systems that operate seamlessly.',
      es: 'Cómo atraer a los prospectos ideales, convertirlos en líderes y escalar sistemas duplicables que operen sin fricción.',
      fr: 'Attirez les bons profils, formez-les en leaders et mettez en place des systèmes qui tournent avec fluidité.',
      pt: 'Atraia os perfis certos, transforme-os em líderes e aplique sistemas duplicáveis.',
    },
    keyTakeaways: {
      en: ['Initial Contact to Duplication Funnel', 'CRM Follow-up Cadence', 'Time Leverage for Builders'],
      es: ['Embudo de Contacto a Duplicación', 'Cadencia de Seguimiento CRM', 'Apalancamiento de Tiempo'],
    },
    resources: [
      {
        title: 'Conversation & Invitation Script Framework',
        url: 'https://drive.google.com/file/d/1EePq-zNaNgUPnPBdnsg_FKyUelYXZJKR/view',
        type: 'doc',
      },
      {
        title: 'Duo Presentation Slide Deck',
        url: 'https://drive.google.com/file/d/1983E6d1pi6GW0bKZi_6KNkaDBf7zyyNd/view',
        type: 'doc',
      },
    ],
  },
  {
    id: 'prospecting-basics',
    title: {
      en: 'The PRIME 6™: Prospecting the Right People in 20 Minutes',
      es: 'El 99% Prospecta a la Persona Equivocada (Soluciónalo en 20 Min)',
      fr: 'Le Système PRIME 6™ : Cibler les Bons Profils en 20 Min',
      pt: 'O Sistema PRIME 6™ : Prospectando os Perfis Certos em 20 Min',
    },
    instructor: 'True Legacy Academy Trainers',
    category: 'communication',
    duration: '20 min',
    level: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=OAKaQqLIwmg',
    description: {
      en: 'Learn the PRIME 6 target archetypes, the 4 Decision Models, and the 48-Hour Momentum Rule to identify high-caliber entrepreneurial partners.',
      es: 'Aprende los 6 grupos objetivo, los 4 arquetipos de decisión y la Regla de las 48 Horas para identificar líderes en lugar de solo coleccionar contactos.',
      fr: 'Identifiez les 6 profils cibles et les 4 modèles de décision pour trouver de vrais partenaires engagés.',
      pt: 'Identifique os 6 perfis ideais e aplique a regra das 48 horas para recrutar parceiros qualificados.',
    },
    keyTakeaways: {
      en: ['The 4 Buyer Archetypes', 'The True Legacy Quadrant Matrix', '48-Hour Momentum Activation'],
      es: ['Los 4 Arquetipos de Decisión', 'Matriz de Cuadrantes True Legacy', 'Activación de Impulso en 48 Horas'],
    },
    resources: [
      {
        title: 'True Legacy Prospect List Mastery Doc',
        url: 'https://docs.google.com/document/d/18JD9AseUR_7gmdSbsrHXge5WqdfQhXTuvTfXOxk5hLA/edit',
        type: 'doc',
      },
    ],
  },
  {
    id: 'social-media-prospecting',
    title: {
      en: 'Turn Every Presentation Into a Builder Magnet',
      es: 'Convierte Cada Presentación en un Imán de Líderes',
      fr: 'Faites de Chaque Présentation un Aimant à Bâtisseurs',
      pt: 'Transforme Cada Apresentação em um Ímã de Construtores',
    },
    instructor: 'Magaly Cardona & Mehdi Cohen',
    instructorSlug: 'magaly-cardona',
    category: 'communication',
    duration: '90 min',
    level: 'Intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=l8Uk9Mbegsk',
    description: {
      en: 'How to craft presentation language that attracts active builders rather than passive consumers, using ethical communication and high-trust storytelling.',
      es: 'El lenguaje que utilizas determina a quién atraes. Aprende la psicología de presentación de alta conversión y cómo el DUO activa a los constructores clave.',
      fr: 'Le langage utilisé détermine qui vous attirez. Maîtrisez la psychologie de présentation pour attirer des bâtisseurs sérieux.',
      pt: 'A linguagem certa atrai os líderes certos. Domine a psicologia da apresentação de alta conversão.',
    },
    keyTakeaways: {
      en: ['Presentation Archetype Alignment', 'High-Trust Problem Framing', 'Natural Transition to Opportunity'],
      es: ['Alineación de Arquetipos', 'Planteamiento de Problemas de Alta Confianza', 'Transición Natural a la Oportunidad'],
    },
  },
  {
    id: 'closing-techniques',
    title: {
      en: 'STOP PITCHING. START CLOSING: The 15-Minute Clarity System',
      es: 'DEJA DE HABLAR. EMPIEZA A CERRAR: El Sistema de 15 Minutos',
      fr: 'ARRÊTEZ D’ARGUMENTER. COMMENCEZ À CONCLURE',
      pt: 'PARE DE FALAR DEMAIS. COMECE A FECHAR',
    },
    instructor: 'True Legacy Master Trainers',
    category: 'communication',
    duration: '15 min',
    level: 'Advanced',
    videoUrl: 'https://www.youtube.com/watch?v=ie-tFol7F4Q',
    description: {
      en: 'Most people talk too much; leaders ask precise diagnostic questions. Master the 14-minute frame, the 11 diagnostic questions, and high-integrity closing.',
      es: 'La mayoría habla demasiado; los líderes preguntan con precisión diagnóstica. Domina el marco de 14 minutos y las 11 preguntas clave de claridad.',
      fr: 'Posez les bonnes questions diagnostiques pour amener le prospect à une décision claire et sereine.',
      pt: 'Faça perguntas diagnósticas precisas para conduzir o prospecto a uma decisão segura e consciente.',
    },
    keyTakeaways: {
      en: ['The 14-Minute Diagnostic Frame', '11 Clarity Diagnostic Questions', 'Frictionless Decision Facilitation'],
      es: ['Marco Diagnóstico de 14 Minutos', '11 Preguntas Clave de Claridad', 'Facilitación de Decisiones sin Fricción'],
    },
  },
  {
    id: 'business-media',
    title: {
      en: 'Why Objections Are Good & How to Turn Them into Breakthroughs',
      es: 'Por Qué las Objeciones Son Buenas y Cómo Resolverlas',
      fr: 'Pourquoi les Objections Sont Positives et Comment les Traiter',
      pt: 'Por Que Objeções São Boas e Como Resolvê-las',
    },
    instructor: 'Simon Loh',
    instructorSlug: 'simon-loh',
    category: 'communication',
    duration: '60 min',
    level: 'Intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=ut9H9n9dE70',
    description: {
      en: 'Turn resistance into clarity. Address the 4 root categories of objections: money, spouse, time, and uncertainty with deep empathy and logic.',
      es: 'Convierte la resistencia en claridad. Domina las 4 categorías principales: dinero, pareja, tiempo e incertidumbre con empatía y lógica.',
      fr: 'Transformez les doutes en clarté en traitant les 4 grandes catégories d’objections avec méthode.',
      pt: 'Transforme dúvidas em clareza abordando as 4 categorias de objeções com segurança e empatia.',
    },
    keyTakeaways: {
      en: ['4 Core Root Objections', 'The Empathy-Reflect-Solve Method', 'Handling "I Need to Research"'],
      es: ['4 Objeciones Raíz Principales', 'Método Empatía-Reflexión-Solución', 'Manejo del "Necesito Investigar"'],
    },
  },
  {
    id: 'income-projection',
    title: {
      en: 'Business Media Positioning vs Social Media Vanity',
      es: 'Posicionamiento en Medios de Negocios vs Likes en Redes',
      fr: 'Médias d’Affaires et Image de Marque Professionnelle',
      pt: 'Posicionamento Profissional vs Métricas de Vaidade',
    },
    instructor: 'Eunice Seet (6A2)',
    category: 'systems',
    duration: '45 min',
    level: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=fjD6atjMN2g',
    description: {
      en: 'Stop chasing vanity likes. Turn your online presence into a digital storefront that builds institutional trust and attracts high-caliber leaders 24/7.',
      es: 'Deja de perseguir likes y usa los medios digitales para construir un escaparate que genera confianza y atrae líderes continuamente.',
      fr: 'Transformez votre présence en ligne en un véritable outil d’attraction de profils de haut niveau.',
      pt: 'Transforme sua presença online em uma vitrine profissional de alta conversão para atrair líderes.',
    },
    keyTakeaways: {
      en: ['The 3-Pillar Magnetic Content Engine', 'Bio & Positioning Architecture', 'Attracting High-Performers'],
      es: ['Motor de Contenido Magnético de 3 Pilares', 'Arquitectura de Biografía y Marca', 'Atracción de Líderes de Alto Nivel'],
    },
  },
]

export function AcademyLandingPage({
  profile,
  distributorSlug,
}: {
  profile: PublicDistributor | null
  distributorSlug?: string
}) {
  const { locale } = useLocaleContext()
  const lang = locale === 'es' ? 'es' : locale === 'fr' ? 'fr' : locale === 'pt' ? 'pt' : 'en'

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedVideo, setSelectedVideo] = useState<AcademyModule | null>(null)
  const [activeDeviceView, setActiveDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeWeek, setActiveWeek] = useState(1)

  useEffect(() => {
    if (crmSupabase) {
      crmSupabase.auth.getSession().then(({ data }) => {
        setIsLoggedIn(Boolean(data.session))
      })
    }
  }, [])

  const leaderPhoto = useMemo(() => {
    if (!profile) return '/logos/tl-square-white.png'
    return resolveLeaderPhoto(profile.slug, profile.avatar_url)
  }, [profile])

  const filteredModules = useMemo(() => {
    return REAL_ACADEMY_MODULES.filter((m) => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory
      const titleText = (m.title[lang] || m.title.en).toLowerCase()
      const descText = (m.description[lang] || m.description.en).toLowerCase()
      const instructorText = m.instructor.toLowerCase()
      const query = searchQuery.toLowerCase().trim()
      const matchSearch = !query || titleText.includes(query) || descText.includes(query) || instructorText.includes(query)
      return matchCat && matchSearch
    })
  }, [activeCategory, searchQuery, lang])

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    return url
  }

  const applyUrl = `/apply?ref=${profile?.referral_code || distributorSlug || 'truelegacy'}&interest=training&source=academy`
  const opportunityUrl = profile ? `/d/${profile.slug}/business` : '/business'
  const crmPortalUrl = isLoggedIn ? '/crm' : '/app'

  return (
    <div className="page-wrapper bg-[#050608] text-white min-h-screen selection:bg-[#2997ff] selection:text-black">
      <SEO
        title="True Legacy Academy | Global Leadership & Business-Building Education"
        description="Enagic provides the vehicle. True Legacy helps develop the builder. Access structured onboarding, product mastery, leadership training, and systems."
        image={leaderPhoto}
      />
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* =========================================================================
            SECTION 1: HERO
        ========================================================================= */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-white/[0.08]">
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(41,151,255,0.18),transparent_65%),radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(168,85,247,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(5,6,8,0.8)_80%,#050608_100%)]" />
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            {/* Guide Badge (if personalized) */}
            {profile && (
              <Link
                to={`/d/${profile.slug}`}
                className="group mb-8 inline-flex items-center gap-3.5 rounded-full border border-white/15 bg-white/[0.04] p-1.5 pr-5 backdrop-blur-xl hover:border-cyan-400/40 hover:bg-white/[0.08] transition-all duration-300 shadow-2xl active:scale-95"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/20 bg-[#0d131f]">
                  <img src={leaderPhoto} alt={profile.display_name} className="h-full w-full object-cover object-top" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-black" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-wide text-white">{profile.display_name}</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">{profile.title || 'True Legacy Leader'} · Academy Guide</p>
                </div>
              </Link>
            )}

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-extrabold uppercase tracking-[0.28em] mb-6 shadow-inner">
              <GraduationCap className="h-4 w-4" />
              <span>True Legacy Academy</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.08]">
              YOU DON’T HAVE TO FIGURE THIS OUT ALONE.
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400 max-w-3xl leading-snug">
              A business opportunity is only as powerful as your ability to build it.
            </p>

            {/* Supporting Body */}
            <p className="mt-5 text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
              Enagic gives independent distributors access to an established global company, patented medical technologies, and a proven business model. True Legacy provides the education, systems, leadership development, and practical training designed to help you execute responsibly.
            </p>

            {/* Punchline Statement Banner */}
            <div className="mt-8 px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md max-w-2xl text-center shadow-2xl">
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#2997ff]">
                THE VEHICLE ALREADY EXISTS. WE HELP DEVELOP THE DRIVER.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
              {isLoggedIn ? (
                <a
                  href={crmPortalUrl}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2997ff] to-cyan-400 text-slate-950 font-black text-sm tracking-wide hover:shadow-[0_0_30px_rgba(41,151,255,0.4)] transition-all active:scale-95"
                >
                  <span>Continue My Training</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <a
                  href="#curriculum-preview"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2997ff] to-cyan-400 text-slate-950 font-black text-sm tracking-wide hover:shadow-[0_0_30px_rgba(41,151,255,0.4)] transition-all active:scale-95"
                >
                  <span>Explore the Academy</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}

              <Link
                to={opportunityUrl}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/15 bg-white/[0.04] text-white font-bold text-sm hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
              >
                <span>Explore the Opportunity</span>
              </Link>
            </div>

            {/* Micro Badge Notice */}
            <p className="mt-5 text-[11px] text-[#64748b]">
              Access included for authorized True Legacy independent distributors · Independent education platform
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: ACADEMY PREVIEW (Interactive Interface Sneak Peek)
        ========================================================================= */}
        <section id="curriculum-preview" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Live Platform Preview</p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                WELCOME TO YOUR BUSINESS-BUILDING ROADMAP
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
                This is a structured, end-to-end learning ecosystem. Video training, progress tracking, downloadable PDF scripts, and live interactive mentorship—all unified in one place.
              </p>
            </div>

            {/* Interactive Academy Mockup Frame */}
            <div className="rounded-3xl border border-white/15 bg-[#0a0f1d]/90 p-4 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
              {/* Window Topbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-[#64748b] hidden sm:inline">truelegacyworld.com/academy · Leadership Portal</span>
                </div>

                {/* Filter / Search inside mockup */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                    <input
                      type="text"
                      placeholder="Search lessons & scripts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-9 pr-3 rounded-lg border border-white/10 bg-black/60 text-xs text-white placeholder:text-[#475569] focus:outline-none focus:border-cyan-400/50 w-48 sm:w-60"
                    />
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                {[
                  { id: 'all', label: 'All Modules' },
                  { id: 'foundation', label: 'Foundation' },
                  { id: 'product', label: 'Product Mastery' },
                  { id: 'communication', label: 'Communication & Closing' },
                  { id: 'systems', label: 'Systems & Funnels' },
                  { id: 'leadership', label: 'Leadership Structure' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#2997ff] text-slate-950 shadow-md'
                        : 'bg-white/[0.04] text-[#94a3b8] hover:bg-white/[0.08] hover:text-white border border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid of Real Training Modules */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredModules.slice(0, 6).map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedVideo(m)}
                    className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Thumbnail / Preview Banner */}
                      <div className="relative aspect-video rounded-xl bg-[#0e1626] overflow-hidden mb-4 border border-white/10 flex items-center justify-center">
                        <img
                          src={`https://img.youtube.com/vi/${m.videoUrl.includes('v=') ? m.videoUrl.split('v=')[1]?.split('&')[0] : m.videoUrl.split('youtu.be/')[1]?.split('?')[0]}/hqdefault.jpg`}
                          alt={m.title[lang] || m.title.en}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-[#2997ff] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white">
                          {m.duration}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                          {m.category}
                        </span>
                        <span className="text-[10px] text-[#64748b]">Level: {m.level}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {m.title[lang] || m.title.en}
                      </h3>

                      {/* Instructor */}
                      <p className="mt-1 text-xs text-[#94a3b8] line-clamp-1">
                        Trainer: <span className="text-white font-medium">{m.instructor}</span>
                      </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400 font-bold">
                      <span className="inline-flex items-center gap-1">
                        Watch Lesson <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      {m.resources && m.resources.length > 0 && (
                        <span className="text-[11px] text-[#94a3b8] flex items-center gap-1 font-normal">
                          <Download className="h-3 w-3" /> {m.resources.length} resource{m.resources.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* View Full Academy CTA inside preview */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#94a3b8] text-center sm:text-left">
                  Showing 6 of 10+ core foundation modules · Regular live additions & global masterclasses
                </div>
                <a
                  href="#all-categories"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs hover:bg-cyan-500/20 transition-all"
                >
                  <span>Explore All 8 Knowledge Pillars</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: WHY THE ACADEMY EXISTS (Shift the Mindset)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.06),transparent_60%)]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-4">Core Philosophy</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              THE OPPORTUNITY IS SIMPLE.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2997ff] via-cyan-300 to-white">
                BECOMING SKILLED TAKES DEVELOPMENT.
              </span>
            </h2>

            <div className="mt-8 space-y-6 text-base sm:text-lg text-[#cbd5e1] leading-relaxed text-left sm:text-center">
              <p>
                Having access to a powerful business model does not automatically teach someone how to communicate with confidence, ask diagnostic questions, present medical technology, lead a team, or pioneer an emerging market.
              </p>
              <p className="text-white font-medium">
                Those are learned skills.
              </p>
              <p className="text-[#94a3b8]">
                True Legacy Academy exists to dramatically shorten your learning curve. Instead of handing you a distributor ID and wishing you good luck, we provide an engineered path designed to help you understand what you are building, why you are building it, and exactly what skill to master next.
              </p>
            </div>

            {/* High Impact Punchline Card */}
            <div className="mt-12 p-8 sm:p-10 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 to-black shadow-[0_0_50px_rgba(41,151,255,0.15)] relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-32 w-32 bg-cyan-500/10 rounded-full blur-2xl" />
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400 mb-3">Our Core Promise</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                “YOU DON’T NEED TO KNOW EVERYTHING BEFORE YOU START.
                <br />
                <span className="text-cyan-300">YOU NEED TO BE WILLING TO LEARN.”</span>
              </h3>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: THE TRUE LEGACY ROADMAP (Stages 1 to 5)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Skill Progression Architecture</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                FROM NEW DISTRIBUTOR TO INDEPENDENT LEADER
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#94a3b8]">
                We measure advancement through capability and skill mastery, not hype. Follow the 5-stage progression designed for duplicable global success.
              </p>
            </div>

            {/* 5 Progression Steps */}
            <div className="grid gap-6 md:grid-cols-5">
              {[
                {
                  step: 'STAGE 1',
                  title: 'FOUNDATION',
                  sub: 'Understand what you have',
                  color: 'from-blue-500/20 to-cyan-500/10',
                  border: 'border-blue-500/30',
                  items: ['Enagic fundamentals', 'Product ecosystem & science', 'Compliance & ethics', 'Setting expectations & vision'],
                },
                {
                  step: 'STAGE 2',
                  title: 'COMMUNICATION',
                  sub: 'Learn how to talk about it',
                  color: 'from-cyan-500/20 to-emerald-500/10',
                  border: 'border-cyan-500/30',
                  items: ['Starting conversations', 'Asking diagnostic questions', 'Storytelling framework', 'Resolving objections'],
                },
                {
                  step: 'STAGE 3',
                  title: 'BUILDING',
                  sub: 'Turn knowledge into activity',
                  color: 'from-emerald-500/20 to-teal-500/10',
                  border: 'border-emerald-500/30',
                  items: ['Prospecting & pipeline CRM', 'DUO demonstrations', 'Digital business storefront', 'Customer follow-up systems'],
                },
                {
                  step: 'STAGE 4',
                  title: 'LEADERSHIP',
                  sub: 'Learn how to develop others',
                  color: 'from-purple-500/20 to-indigo-500/10',
                  border: 'border-purple-500/30',
                  items: ['Coaching & duplication', 'Team culture & accountability', 'Training other builders', 'Independent market strategy'],
                },
                {
                  step: 'STAGE 5',
                  title: 'EXPANSION',
                  sub: 'Think beyond yourself',
                  color: 'from-amber-500/20 to-rose-500/10',
                  border: 'border-amber-500/30',
                  items: ['Emerging market entry', 'Cross-border collaboration', 'Regional live event scale', 'Long-term legacy building'],
                },
              ].map((stage, idx) => (
                <div
                  key={stage.step}
                  className={`rounded-2xl border ${stage.border} bg-gradient-to-b ${stage.color} p-6 flex flex-col justify-between relative overflow-hidden`}
                >
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-[#2997ff]">{stage.step}</span>
                    <h3 className="mt-2 text-lg font-black text-white">{stage.title}</h3>
                    <p className="text-xs text-[#94a3b8] mb-4 font-medium">{stage.sub}</p>
                    <ul className="space-y-2 text-xs text-[#cbd5e1]">
                      {stage.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/10 text-[10px] font-mono text-[#64748b]">
                    Phase 0{idx + 1} · Capability Milestone
                  </div>
                </div>
              ))}
            </div>

            {/* Sequence Rule */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 rounded-full border border-white/15 bg-white/[0.03] text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white">
                <span className="text-cyan-400">LEARN IT.</span>
                <span>&rarr;</span>
                <span className="text-blue-400">DO IT.</span>
                <span>&rarr;</span>
                <span className="text-purple-400">TEACH IT.</span>
                <span>&rarr;</span>
                <span className="text-emerald-400">DUPLICATE IT.</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: SIX-WEEK ONBOARDING TIMELINE
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#070b14]/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Structured First Steps</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                YOUR FIRST SIX WEEKS SHOULDN’T FEEL RANDOM.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#94a3b8]">
                New distributors need clarity before complexity. The True Legacy onboarding path gives you a structured weekly focus instead of overwhelming you with information all at once.
              </p>
            </div>

            {/* 6 Weeks Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  week: 'WEEK 1',
                  title: 'Foundation & Ecosystem',
                  desc: 'Understand the product science, the compensation model, community guidelines, and align your personal goals.',
                  badge: 'Orientation',
                },
                {
                  week: 'WEEK 2',
                  title: 'Your Personal Story',
                  desc: 'Learn how to communicate your why naturally and ethically, without sounding like a salesperson or using canned scripts.',
                  badge: 'Authenticity',
                },
                {
                  week: 'WEEK 3',
                  title: 'High-Value Conversations',
                  desc: 'Master asking diagnostic questions, identifying prospect needs, and starting meaningful discussions about hydration & business.',
                  badge: 'Communication',
                },
                {
                  week: 'WEEK 4',
                  title: 'Demonstrations & Presentations',
                  desc: 'Learn how to run clean, impactful K8 & emGuarde demonstrations and use True Legacy recorded video presentations.',
                  badge: 'Presentation',
                },
                {
                  week: 'WEEK 5',
                  title: 'Building Your Daily System',
                  desc: 'Set up your private CRM leads pipeline, define your daily method of operation, and utilize digital follow-up tools.',
                  badge: 'Infrastructure',
                },
                {
                  week: 'WEEK 6',
                  title: 'Leadership & Duplication',
                  desc: 'Learn how to onboard your first direct partner through this exact same 6-week framework with total confidence.',
                  badge: 'Duplication',
                },
              ].map((w, idx) => (
                <div
                  key={w.week}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-cyan-400/40 hover:bg-white/[0.04] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black tracking-widest text-[#2997ff]">{w.week}</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-bold text-[#94a3b8] group-hover:text-white transition-colors">
                        {w.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{w.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">{w.desc}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-[#64748b]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Included in Distributor Launch Kit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: EVERYTHING IN ONE ECOSYSTEM (8 Interactive Categories)
        ========================================================================= */}
        <section id="all-categories" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Complete Education Suite</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                EVERYTHING YOU NEED TO KEEP DEVELOPING.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#94a3b8]">
                Eight comprehensive training departments covering every aspect of high-level independent distributor operations.
              </p>
            </div>

            {/* 8 Pillar Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Sparkles,
                  title: '1. Product Mastery',
                  desc: 'Comprehensive training on Kangen Water, Leveluk K8, emGuarde GO, Ukon, and certified medical applications.',
                  bullets: ['Water ionization science', 'EMF harmonization physics', 'Approved demonstration scripts'],
                },
                {
                  icon: BriefcaseBusiness,
                  title: '2. Business Fundamentals',
                  desc: 'Mastering the patented 8-Point compensation plan, distributor rank structures, compliance, and organization building.',
                  bullets: ['8-Point distribution model', 'Direct vs group sales', 'Sustainable rank planning'],
                },
                {
                  icon: MessageCircle,
                  title: '3. Communication & Sales',
                  desc: 'Diagnostic questioning frameworks, invitation psychology, addressing root objections, and ethical closing.',
                  bullets: ['The 14-Minute Clarity frame', '11 Diagnostic questions', 'Resolving money & time concerns'],
                },
                {
                  icon: Globe,
                  title: '4. Marketing & Branding',
                  desc: 'Positioning yourself professionally on business media, magnetic content creation, and digital storefront setup.',
                  bullets: ['3-Pillar content system', 'High-trust bio optimization', 'Attracting business builders'],
                },
                {
                  icon: LayoutDashboard,
                  title: '5. Systems & Technology',
                  desc: 'Operating your private True Legacy CRM, managing prospect pipelines, calendar scheduling, and automated nurturing.',
                  bullets: ['Live contact attribution', 'Instant lead notifications', 'Custom referral share links'],
                },
                {
                  icon: Users,
                  title: '6. Leadership Development',
                  desc: 'Leadership psychology, team accountability, developing independent trainers, and building resilient culture.',
                  bullets: ['Duplication frameworks', 'Team meeting facilitation', 'Developing next-gen 6A leaders'],
                },
                {
                  icon: Compass,
                  title: '7. Market Expansion',
                  desc: 'Entering emerging markets, local leadership development, cross-border logistics, and international growth strategy.',
                  bullets: ['Emerging market playbooks', 'LATAM & Asian strategies', 'Local event organization'],
                },
                {
                  icon: Radio,
                  title: '8. Live Training & Calls',
                  desc: 'Weekly live English global masterclasses, LATAM Spanish workshops, live Q&A, and interactive community sessions.',
                  bullets: ['Weekly Wednesday Global Call', 'LATAM Spanish workshops', 'Executive leadership briefings'],
                },
              ].map((pillar, i) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-cyan-400/40 hover:bg-white/[0.04] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-black text-white mb-2">{pillar.title}</h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">{pillar.desc}</p>
                    <ul className="space-y-1.5 text-xs text-[#cbd5e1]">
                      {pillar.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                          <span className="h-1 w-1 rounded-full bg-cyan-400" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Complete Course Series
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: LEARN ON YOUR SCHEDULE (Multi-Device Responsive)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#070b14]/80 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Anytime, Anywhere</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  THE ACADEMY GOES WHERE YOU GO.
                </h2>
                <div className="mt-6 space-y-4 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
                  <p>
                    Some people learn early in the morning before family commitments. Some study during an evening commute. Others review scripts right before an executive presentation.
                  </p>
                  <p>
                    Your development should not depend solely on someone else’s calendar. Access high-definition training on demand, resume lessons seamlessly, and combine self-paced mastery with live global calls.
                  </p>
                </div>

                {/* Device Selector Tabs */}
                <div className="mt-8 flex items-center gap-3">
                  {[
                    { id: 'desktop', icon: Laptop, label: 'Desktop' },
                    { id: 'tablet', icon: Tablet, label: 'Tablet' },
                    { id: 'mobile', icon: Smartphone, label: 'Mobile App' },
                  ].map((dev) => (
                    <button
                      key={dev.id}
                      onClick={() => setActiveDeviceView(dev.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeDeviceView === dev.id
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                          : 'bg-white/5 text-[#94a3b8] hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      <dev.icon className="h-4 w-4" />
                      <span>{dev.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-[#cbd5e1]">
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                    <p className="font-bold text-white">Full Screen Videos</p>
                    <p className="text-[#64748b] text-[11px] mt-0.5">Optimized 16:9 streaming</p>
                  </div>
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                    <p className="font-bold text-white">1-Click PDF Downloads</p>
                    <p className="text-[#64748b] text-[11px] mt-0.5">Offline guides & slides</p>
                  </div>
                </div>
              </div>

              {/* Device Visual Mockup Container */}
              <div className="flex items-center justify-center p-6 rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1626] to-[#050608] shadow-2xl">
                <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black p-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                      <span className="text-[11px] font-bold text-white">True Legacy Mobile Portal</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">100% Responsive</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Currently In Progress</p>
                      <p className="text-xs font-bold text-white mt-1">The PRIME 6™: Prospecting the Right People</p>
                      <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 w-3/4 rounded-full" />
                      </div>
                      <span className="text-[10px] text-[#64748b] mt-1 block">75% completed · 5 mins remaining</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span>Next Live Masterclass</span>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-bold">Wed 8:30 PM EST</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: ON-DEMAND + LIVE (Two Pillars)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Two Integrated Pillars</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                LEARN ON DEMAND. DEVELOP LIVE.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#94a3b8]">
                Self-paced education gives you knowledge. Live community interaction gives you execution and confidence.
              </p>
            </div>

            {/* Side-by-Side Dual Comparison */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left: On-Demand Academy */}
              <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-black/80 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl" />
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider mb-4">
                    <Video className="h-3.5 w-3.5" />
                    <span>Pillar 01 · On-Demand Academy</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Learn at Your Own Pace</h3>
                  <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">
                    Always available 24/7 on your personal device. Return to core modules whenever you need to prepare for a demonstration or train a new partner.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#cbd5e1]">
                    {[
                      'High-definition recorded video masterclasses',
                      'Downloadable objection handling & invitation scripts',
                      'Product science breakdown & certification archives',
                      'Patent & 8-Point compensation plan video models',
                      'Private CRM video setup & lead workflow guides',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#64748b] font-mono">
                  Available 24/7/365 worldwide
                </div>
              </div>

              {/* Right: Live Development */}
              <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-black/80 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl" />
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-black uppercase tracking-wider mb-4">
                    <Radio className="h-3.5 w-3.5" />
                    <span>Pillar 02 · Live Development</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Connected to Real Leaders</h3>
                  <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">
                    You are never building in isolation. Join weekly live calls, ask real-time questions, and learn directly from top global builders in English and Spanish.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#cbd5e1]">
                    {[
                      'Weekly Global Strategy & Leadership Calls (Wednesday)',
                      'LATAM Spanish expansion workshops & presentations',
                      'Live interactive Q&A & pipeline coaching sessions',
                      'Regional summits & in-person team workshops',
                      'Direct access to senior mentors across 14 markets',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#64748b] font-mono">
                  Global English & LATAM Spanish schedules
                </div>
              </div>
            </div>

            {/* Core Summary Line */}
            <div className="mt-12 text-center">
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white">
                <span className="text-cyan-400">THE LIBRARY GIVES YOU INFORMATION.</span>
                <span className="mx-3 text-[#64748b]">·</span>
                <span className="text-purple-400">THE COMMUNITY HELPS YOU APPLY IT.</span>
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: LEARN FROM PEOPLE ACTUALLY BUILDING (Verified Mentors)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#070b14]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Field-Tested Leadership</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                TRAINING SHOULD COME FROM EXPERIENCE, NOT THEORY ALONE.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#94a3b8]">
                Every module, script, and workshop in True Legacy Academy is authored and led by distributors actively building international organizations today.
              </p>
            </div>

            {/* Leaders Grid with their Teaching Domain */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  slug: 'mehdi-cohen',
                  name: 'Mehdi Cohen',
                  title: '6A Leader',
                  focus: 'Global & LATAM Strategy · Systems & CRM',
                  desc: 'Pioneering emerging markets, architecting digital tools, and leading bilingual team expansion.',
                },
                {
                  slug: 'magaly-cardona',
                  name: 'Magaly Cardona',
                  title: '6A Leader',
                  focus: 'Relationship Building · Authentic Storytelling',
                  desc: 'Guiding leaders across the U.S. and Latin America with values-aligned leadership.',
                },
                {
                  slug: 'simon-loh',
                  name: 'Simon Loh',
                  title: '6A2-4 Leader',
                  focus: 'Global Compensation Mastery · Asian & Middle East Markets',
                  desc: 'Accountant by training, international builder spanning Malaysia, UAE, Türkiye, and India.',
                },
                {
                  slug: 'ming-way-sia',
                  name: 'Ming-Way Sia',
                  title: '6A2-5 Leader',
                  focus: 'Structural Legacy · Team Duplication',
                  desc: 'Built from the ground up, developing generational discipline and long-term organization stability.',
                },
                {
                  slug: 'zah-naderi',
                  name: 'Zah Naderi',
                  title: 'True Legacy Leader',
                  focus: 'High-Performance Mindset · Executive Leadership',
                  desc: 'Over a decade coaching elite performers, corporate executives, and top athletes.',
                },
                {
                  slug: 'ryan-pool',
                  name: 'Ryan Pool Sr',
                  title: 'True Legacy Leader',
                  focus: 'Community Building · Disciplined Execution',
                  desc: 'Former athlete and entrepreneur building community and family legacy in Los Angeles.',
                },
                {
                  slug: 'alex-gonzalez',
                  name: 'Alex Gonzalez',
                  title: 'True Legacy Leader',
                  focus: 'Health & Wellness Marketing · 35+ Years Experience',
                  desc: 'Over 35 years in the supplement industry, passionate about physical and financial health.',
                },
                {
                  slug: 'angel-mok',
                  name: 'Angel Mok E Lin',
                  title: 'True Legacy Leader',
                  focus: 'Global Cross-Border Distribution · Equity & Purpose',
                  desc: 'Former equity trader building international distribution across Dubai, Singapore, and Türkiye.',
                },
              ].map((ldr) => (
                <div
                  key={ldr.slug}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-cyan-400/40 hover:bg-white/[0.04] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-white/15 bg-[#0e1626]">
                        <img
                          src={resolveLeaderPhoto(ldr.slug)}
                          alt={ldr.name}
                          className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-white truncate">{ldr.name}</h3>
                        <p className="text-[11px] text-cyan-400 font-semibold truncate">{ldr.title}</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Teaching Area:</p>
                      <p className="text-xs font-bold text-white mt-0.5">{ldr.focus}</p>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed">{ldr.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-[#64748b] font-mono">
                    Active True Legacy Trainer
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: WHY THIS MATTERS WITH ENAGIC (Visual Equation)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Strategic Alignment</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              A GREAT COMPANY IS EVEN MORE POWERFUL WHEN YOU KNOW HOW TO LEVERAGE THE OPPORTUNITY.
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#94a3b8] max-w-3xl mx-auto leading-relaxed">
              Enagic brings 50+ years of Japanese manufacturing excellence, medical device certifications, and a global distribution infrastructure. True Legacy does not replace Enagic—we equip independent distributors with the education and tools needed to build responsibly.
            </p>

            {/* Visual Value Equation Box */}
            <div className="mt-14 p-8 sm:p-12 rounded-3xl border border-white/15 bg-gradient-to-b from-[#0d1627] to-[#050608] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <div className="grid gap-6 md:grid-cols-3 items-center">
                {/* Enagic Side */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-left">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 font-black">
                    E
                  </div>
                  <h3 className="text-xl font-black text-white">ENAGIC</h3>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mt-1 mb-4">The Global Vehicle</p>
                  <ul className="space-y-2 text-xs text-[#cbd5e1]">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-400" /> Patented Medical Ionizers</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-400" /> 50-Year Company Track Record</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-400" /> Global Branch Infrastructure</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-400" /> 8-Point Compensation Model</li>
                  </ul>
                </div>

                {/* Plus Sign / True Legacy Side */}
                <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 text-left relative">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 font-black">
                    TL
                  </div>
                  <h3 className="text-xl font-black text-white">TRUE LEGACY</h3>
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mt-1 mb-4">The Development System</p>
                  <ul className="space-y-2 text-xs text-[#cbd5e1]">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-cyan-400" /> Structured Academy Education</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-cyan-400" /> Private CRM & Lead Pipeline</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-cyan-400" /> Mentorship & Duplication</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-cyan-400" /> Emerging Market Strategy</li>
                  </ul>
                </div>

                {/* Equals / Prepared Builder */}
                <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 font-black">
                    =
                  </div>
                  <h3 className="text-xl font-black text-white">THE RESULT</h3>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1 mb-4">A Prepared Distributor</p>
                  <ul className="space-y-2 text-xs text-[#cbd5e1]">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" /> Clear Step-by-Step Roadmap</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" /> High-Confidence Presenting</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" /> Active Team Support</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" /> Long-Term Sustainability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: THE REAL VALUE (Conceptual Reveal)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(41,151,255,0.08),transparent_70%)]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Unbundled Value</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              WHAT WOULD THIS EDUCATION COST ON ITS OWN?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              In traditional entrepreneurship, builders pay thousands of dollars separately for sales training, executive coaching, CRM software, branding courses, and mastermind memberships.
            </p>

            {/* Unbundled Grid */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              {[
                'Sales & Closing Training',
                'Executive Leadership Coaching',
                'Custom CRM & Pipeline Software',
                'Personal Branding & Media Strategy',
                'Product Science & Tech Demos',
                'Emerging Market Expansion Playbooks',
                'Weekly Masterclasses & Live Q&A',
                'Downloadable Script Vaults',
                'Global Peer Community',
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-[#cbd5e1] flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Premium Reveal Card */}
            <div className="mt-12 p-8 sm:p-10 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#091529] to-black shadow-2xl">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">Included Access</span>
              <h3 className="text-2xl sm:text-4xl font-black text-white mt-2">
                TRUE LEGACY ACADEMY
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto">
                Included at no additional cost for eligible independent distributors who choose to build directly with the True Legacy organization.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2997ff]">
                Because we believe developing people is how you develop markets.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 12: WHAT WE DON'T DO (No Hype, High Integrity)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-black uppercase tracking-wider mb-4">
              <span>Authenticity & Compliance</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              NO HYPE. NO MAGIC BUTTON.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-2xl mx-auto">
              True Legacy does not promote unrealistic shortcuts. Building a successful independent business requires genuine dedication, skill development, and consistent effort.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <p className="text-xs font-black uppercase tracking-wider text-rose-400 mb-2">No Guarantees</p>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  The Academy cannot guarantee income, rank, or individual results. Your business outcome depends on your execution.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <p className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-2">Real Capability</p>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  What we do provide is the clearest environment, proven frameworks, live examples, and tools to master the profession.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-2">Independent Accountability</p>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  You remain an independent business owner operating with full compliance, respect for Enagic policies, and personal ethics.
                </p>
              </div>
            </div>

            <div className="mt-10 px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.03] inline-block">
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white">
                WE PROVIDE THE ENVIRONMENT. YOU PROVIDE THE EFFORT.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 13: MEMBER EXPERIENCE / PROOF (Skill Transformation)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#070b14]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-3">Real Transformation</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                FROM “I DON’T KNOW HOW” TO “LET ME SHOW YOU.”
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#94a3b8]">
                Real growth happens when uncertainty is replaced by understanding and structured repetition.
              </p>
            </div>

            {/* Transformation Milestones */}
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Overcoming Presentation Anxiety',
                  before: '“I was afraid of speaking about medical water or getting technical questions I couldn’t answer.”',
                  after: '“With the standardized video demonstrations and clear script outlines, I let the tools do the talking with total confidence.”',
                  milestone: 'First Demonstration Conducted',
                },
                {
                  title: 'Structuring a Real Daily Pipeline',
                  before: '“I had random contacts scattered across sticky notes and didn’t know who to follow up with.”',
                  after: '“The True Legacy CRM automated my reminders and gave me a clear 20-minute daily method of operation.”',
                  milestone: 'Daily System Activated',
                },
                {
                  title: 'Onboarding New Team Partners',
                  before: '“I was terrified of enrolling someone because I thought I would have to teach them everything myself.”',
                  after: '“I plugged them straight into the 6-Week Academy Roadmap, and they began learning from senior leaders immediately.”',
                  milestone: 'First Duplication Achieved',
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full">
                      {card.milestone}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-4 mb-4">{card.title}</h3>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-rose-500/[0.05] border border-rose-500/15">
                        <p className="font-bold text-rose-300 text-[10px] uppercase">Before Academy:</p>
                        <p className="text-[#cbd5e1] italic mt-1">{card.before}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/15">
                        <p className="font-bold text-emerald-300 text-[10px] uppercase">With True Legacy:</p>
                        <p className="text-white mt-1">{card.after}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-[#64748b] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Skill Capability Milestone</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 14: THE BIGGER MISSION (Developing Independent Leaders)
        ========================================================================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(41,151,255,0.1),transparent_70%)]" />
          <div className="max-w-4xl mx-auto text-center relative">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2997ff] mb-4">The True Legacy Vision</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              THE GOAL ISN’T TO KEEP YOU DEPENDENT ON US.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400">
                THE GOAL IS TO DEVELOP YOU UNTIL SOMEONE ELSE CAN DEPEND ON YOU.
              </span>
            </h2>

            <div className="mt-8 space-y-4 text-base sm:text-lg text-[#cbd5e1] leading-relaxed max-w-2xl mx-auto">
              <p>
                Sustainable global organizations are never built by one superstar. They are built by empowered, independent leaders who develop more leaders.
              </p>
              <p className="text-[#94a3b8] text-sm sm:text-base">
                Learn the technologies. Master the business. Refine your communication. Build confidence. Step into leadership. Then help the next person do the same. That is how communities expand, how markets grow, and how true legacy is built.
              </p>
            </div>

            {/* 4-Step Progression Sequence */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              {[
                { label: 'STUDENT', desc: 'Absorb the fundamentals' },
                { label: 'BUILDER', desc: 'Execute daily activity' },
                { label: 'LEADER', desc: 'Guide and support others' },
                { label: 'MENTOR', desc: 'Duplicate the system' },
              ].map((step, idx) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="px-5 py-3 rounded-2xl border border-white/15 bg-white/[0.03] text-center min-w-[140px]">
                    <p className="text-xs font-black text-cyan-400 tracking-wider">0{idx + 1} · {step.label}</p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">{step.desc}</p>
                  </div>
                  {idx < 3 && <ChevronRight className="h-4 w-4 text-[#475569] hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 15: FINAL CTA
        ========================================================================= */}
        <section className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#050608] to-[#0a1020]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              YOU BRING THE AMBITION.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2997ff] to-cyan-300">
                WE’LL BRING THE ENVIRONMENT TO DEVELOP IT.
              </span>
            </h2>

            <p className="mt-6 text-sm sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
              When you choose to build with True Legacy, you are entering an international community committed to education, leadership, systems, and long-term development.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {isLoggedIn ? (
                <a
                  href={crmPortalUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl bg-gradient-to-r from-[#2997ff] to-cyan-400 text-slate-950 font-black text-sm tracking-wide hover:shadow-[0_0_35px_rgba(41,151,255,0.5)] transition-all active:scale-95"
                >
                  <span>Continue My Training in CRM</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  to={opportunityUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl bg-gradient-to-r from-[#2997ff] to-cyan-400 text-slate-950 font-black text-sm tracking-wide hover:shadow-[0_0_35px_rgba(41,151,255,0.5)] transition-all active:scale-95"
                >
                  <span>Explore the True Legacy Opportunity</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {profile?.phone && (
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(profile.display_name)},%20I'm%20exploring%20the%20True%20Legacy%20Academy%20and%20would%20like%20to%20learn%20more!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-bold text-sm hover:bg-emerald-500/20 transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span>Connect with {profile.display_name.split(' ')[0]}</span>
                </a>
              )}
            </div>

            {/* Disclaimer */}
            <p className="mt-8 text-[11px] text-[#64748b] max-w-xl mx-auto leading-relaxed">
              True Legacy Academy is an independent distributor training resource. Enagic® is a registered trademark of Enagic Co., Ltd. True Legacy operates independently. No earnings or rank outcomes are guaranteed.
            </p>
          </div>
        </section>
      </main>

      {/* =========================================================================
          VIDEO MODAL VIEWER
      ========================================================================= */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl rounded-3xl border border-white/20 bg-[#070b14] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                    {selectedVideo.category} · {selectedVideo.duration}
                  </span>
                  <h3 className="text-base sm:text-xl font-bold text-white line-clamp-1">
                    {selectedVideo.title[lang] || selectedVideo.title.en}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative w-full pt-[56.25%] bg-black">
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title[lang] || selectedVideo.title.en}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer with Resources */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {selectedVideo.description[lang] || selectedVideo.description.en}
                </p>

                {selectedVideo.resources && selectedVideo.resources.length > 0 && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs font-bold text-white mb-2">Lesson Downloads & Templates:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.resources.map((res, ri) => (
                        <a
                          key={ri}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>{res.title}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
