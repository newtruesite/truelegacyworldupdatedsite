import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { CheckCircle, FileText, ExternalLink, Download, Play, Users, Target, Lightbulb, LogOut } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { t } from '@/lib/translations'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'

// Training Module Types
type TrainingModule = {
  id: string
  title: string
  description: string
  category: 'foundation' | 'product' | 'leadership' | 'systems' | 'prospecting' | 'closing'
  videoUrl?: string
  resources: Array<{
    title: string
    url: string
    type: 'pdf' | 'doc' | 'template' | 'video'
  }>
  duration?: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

// Training Modules Data
const TRAINING_MODULES: TrainingModule[] = [
  // 1. Foundation & Purpose
  {
    id: 'purpose-vision',
    title: 'El Poder de tu Propósito en Enagic',
    description:
      'En esta sesión, tu viaje en Enagic se vuelve personal. Redescubriremos tu Porqué, descubriremos tu propósito más profundo y elaboraremos tu Visión a 3 Años junto con una carta de tu yo del futuro. Espera una reflexión guiada, un ejercicio de visión y pasos para dar forma a tu camino hacia el liderazgo.',
    category: 'foundation',
    videoUrl: 'https://www.youtube.com/watch?v=2O7DboiJBdE&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'beginner',
    duration: '45 min',
    resources: [
      {
        title: 'Plantilla: Carta de tu Yo del Futuro',
        url: 'https://drive.google.com/file/d/1_yOHfNqi2pomD28jeqSWjpjnFy4xIlY0/view?fbclid=IwY2xjawPwpb5leHRuA2FlbQIxMABicmlkETFDWTEzdmFua3U1Wkt2Tkdoc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHptWaiPgIwt2Fz2sMptJMUjbiZqUUdZdvmXzDchAE23zyzbS5updXJAD-v2G_aem_GM5pTxCd9ro80xVn66pbGQ',
        type: 'pdf',
      },
    ]
  },
  // 2. Product Mastery
  {
    id: 'kangen-science',
    title: 'Dominando los Productos de $10 Billones: LeveLuk y emGuarde',
    description:
      'Esta sesión te prepara para posicionar la serie LeveLuk frente a la competencia y destaca por qué emGuarde es único. Ganarás confianza en la tecnología de Enagic, sus certificaciones y aprenderás cómo las ventajas únicas de emGuarde (como mejorar el sueño y el estado de ánimo) pueden transformar tu poder de cierre.',
    category: 'product',
    videoUrl: 'https://youtu.be/_LcCVpKnVxk?si=1UTiKWXvUP0MHjhm',
    level: 'beginner',
    duration: '60 min',
    resources: [
      {
        title: 'Guía de Productos de Ionizadores Kangen',
        url: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf',
        type: 'pdf',
      },
      {
        title: 'Guía de Mantenimiento de Máquina',
        url: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf',
        type: 'pdf',
      },
    ]
  },
  {
    id: 'product-lineup',
    title: 'El Sistema de 8 Puntos y Plan de Acción',
    description:
      'Analiza el programa patentado de 8 Puntos de Enagic y descubre cómo los principales líderes lo utilizan para duplicar rápido, subir de rango y construir ingresos sostenibles. Esta es la base central para expandir tu organización globalmente.',
    category: 'product',
    videoUrl:
      'https://www.youtube.com/watch?v=FndRvUtZXL0&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'intermediate',
    duration: '60 min',
    resources: [
      {
        title: 'Guía del Plan de Compensación 8-Puntos',
        url: 'https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf',
        type: 'pdf',
      },
      {
        title: 'Hoja de Proyección a 6 Meses',
        url: 'https://docs.google.com/spreadsheets/d/1zvfw-oBtkKLdSfVTquQw8J3g0ptTvBGT68weJF93MzA/edit#gid=1905539002',
        type: 'doc',
      },
    ]
  },
  // 4. Leadership & Structure
  {
    id: 'leadership-structure',
    title: 'El Plan para Construir tu Legado con Enagic',
    description:
      'Esta sesión cambia todo. Aprenderás por qué los 8 Puntos son solo el comienzo, 6A2 es la entrada, y el verdadero legado empieza más allá. Desglosamos cómo estructurar para un crecimiento exponencial, planificar estabilidad a largo plazo y preparar el escenario para un ingreso generacional. Indispensable si buscas construir un verdadero legado.',
    category: 'leadership',
    videoUrl: 'https://youtu.be/Jz1LFvYTonI?si=fAbyqC4dChuIMn6t',
    level: 'intermediate',
    duration: '75 min',
    resources: [
      {
        title: 'Guía del Plan de Compensación',
        url: 'https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf',
        type: 'pdf',
      },
    ]
  },
  // 5. Systems & Funnels
  {
    id: 'systems-funnels',
    title: 'El Sistema para Alcanzar 6A Más Rápido (Sin Agotarte)',
    description:
      'Desglosamos el sistema True Legacy: cómo atraer a las personas adecuadas, convertirlas en líderes y escalar sin saturarte. Dominarás los pasos desde el primer contacto hasta la duplicación, construyendo un equipo que crece incluso cuando descansas.',
    category: 'systems',
    videoUrl: 'https://youtu.be/tL5KtgzCB74?si=C-P3B8IRwfQG32B5',
    level: 'advanced',
    duration: '90 min',
    resources: [
      {
        title: 'Guion de Conversación e Invitación',
        url: 'https://drive.google.com/file/d/1EePq-zNaNgUPnPBdnsg_FKyUelYXZJKR/view?usp=drive_link',
        type: 'doc',
      },
      {
        title: 'Variaciones de Invitación por Prospecto',
        url: 'https://drive.google.com/file/d/1g3k3cyhxwaKMC0a1hGSnIsXTf_U8F0op/view?usp=drive_link',
        type: 'doc',
      },
      {
        title: 'Plantilla de Presentación Duo',
        url: 'https://drive.google.com/file/d/1983E6d1pi6GW0bKZi_6KNkaDBf7zyyNd/view?usp=drive_link',
        type: 'doc',
      },
    ]
  },
  // Prospecting & Invitations
  // 6. Prospecting & Invitations
  {
    id: 'prospecting-basics',
    title: 'El 99% Prospecta a la Persona Equivocada (Soluciónalo en 20 Min)',
    description:
      'Si tu embudo se siente estancado, este entrenamiento es para ti. Aprenderás: Los 6 grupos objetivo, los 4 arquetipos de decisión, los Cuadrantes True Legacy para identificar quién está listo, y la Regla de las 48 Horas para crear impulso. No se trata de coleccionar contactos, sino de identificar líderes.',
    category: 'prospecting',
    videoUrl: 'https://www.youtube.com/watch?v=OAKaQqLIwmg&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'beginner',
    duration: '20 min',
    resources: [
      {
        title: 'Dominio de la Lista de Prospectos True Legacy',
        url: 'https://docs.google.com/document/d/18JD9AseUR_7gmdSbsrHXge5WqdfQhXTuvTfXOxk5hLA/edit?usp=sharing',
        type: 'doc',
      },
    ]
  },
  // 7. Turn Every Presentation Into a Builder Magnet
  {
    id: 'social-media-prospecting',
    title: 'Convierte Cada Presentación en un Imán de Líderes',
    description:
      'Tu lenguaje determina a quién invitas. No es solo dar una gran demostración, es usar el lenguaje correcto. Aprende los 3 tipos de personas que se unen, cómo invitar según los 4 arquetipos, la psicología de alta conversión, y cómo la presentación DUO activa a los prospectos clave.',
    category: 'prospecting',
    videoUrl: 'https://www.youtube.com/watch?v=l8Uk9Mbegsk',
    level: 'intermediate',
    duration: '90 min',
    resources: [
      {
        title: 'Perfil de Arquetipos e Invitación',
        url: 'https://docs.google.com/document/d/1V6WPSTj3jBQ5Ja3frJ2sZGAcOEmlm-uXpzC4JzUwqnE/edit?usp=sharing',
        type: 'doc',
      },
    ]
  },
  // 8. Closing & Business Media
  {
    id: 'closing-techniques',
    title: 'DEJA DE HABLAR. EMPIEZA A CERRAR.',
    description:
      'El Sistema de 15 Minutos que Cierra. Desbloquea cómo guiar a los prospectos a la claridad mediante preguntas expertas y psicología de cierre. La mayoría habla demasiado, los líderes preguntan con precisión. Domina el marco de 14 minutos, las 11 preguntas clave y el cierre del 20%.',
    category: 'closing',
    videoUrl: 'https://www.youtube.com/watch?v=ie-tFol7F4Q&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'advanced',
    duration: '15 min',
    resources: [
      {
        title: 'Notas del Marco de Cierre',
        url: 'https://www.truelegacyworld.com/true-legacy-leadership-training',
        type: 'doc',
      },
    ]
  },
  {
    id: 'business-media',
    title: 'Por Qué las Objeciones Son Buenas y Cómo Convertirlas en Éxitos',
    description:
      'Convierte la resistencia en claridad. Aprende las 4 categorías principales de objeciones y exactamente cómo manejar el dinero, cónyuge, tiempo, miedo y el "necesito investigar" para construir confianza.',
    category: 'closing',
    videoUrl: 'https://www.youtube.com/watch?v=ut9H9n9dE70',
    level: 'intermediate',
    duration: '60 min',
    resources: [
      {
        title: 'Notas para Manejo de Objeciones',
        url: 'https://www.truelegacyworld.com/true-legacy-leadership-training',
        type: 'doc',
      },
    ]
  },
  // 10. Business Media Training
  {
    id: 'income-projection',
    title: '❌ Olvida las Redes Sociales — Esto es Negocio Real',
    description:
      'Entrenamiento con Eunice Seet (6A2). Deja de perseguir likes y empieza a usar los medios para construir tu negocio. Convierte tu presencia en línea en un escaparate que genera confianza, atrae a la gente correcta y trabaja 24/7. Domina tu perfil y los 3 pilares del contenido magnético.',
    category: 'systems',
    videoUrl: 'https://www.youtube.com/watch?v=fjD6atjMN2g',
    level: 'beginner',
    duration: '45 min',
    resources: [
      {
        title: 'Resumen de Liderazgo True Legacy',
        url: 'https://www.truelegacyworld.com/true-legacy-leadership-training',
        type: 'doc',
      },
    ]
  }
]

const CATEGORY_INFO = {
  foundation: { title: 'Purpose & Vision', icon: Target, color: 'cyan' },
  product: { title: 'Product & Program Mastery', icon: Lightbulb, color: 'amber' },
  leadership: { title: 'Legacy & Leadership Structure', icon: Users, color: 'purple' },
  systems: { title: 'Systems & Funnels', icon: CheckCircle, color: 'green' },
  prospecting: { title: 'Prospecting & Invitations', icon: ExternalLink, color: 'blue' },
  closing: { title: 'Closing, Objections & Business Media', icon: FileText, color: 'orange' }
}

// Training Module Card Component
type TrainingModuleCardProps = {
  module: TrainingModule
  isExpanded?: boolean
  onToggle?: () => void
  copy: any
}

const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({ module, isExpanded = false, onToggle, copy }) => {
  const categoryInfo = CATEGORY_INFO[module.category]
  const IconComponent = categoryInfo.icon
  
  // Get localized title and description
  const moduleTranslation = copy.trainingModules?.[module.id as keyof typeof copy.trainingModules]
  const localizedTitle = moduleTranslation?.title || module.title
  const localizedDescription = moduleTranslation?.description || module.description

  const toEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const u = new URL(url)
        const id = u.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : url
      }
      if (url.includes('youtu.be/')) {
        const after = url.split('youtu.be/')[1] || ''
        const id = after.split(/[?&]/)[0]
        return id ? `https://www.youtube.com/embed/${id}` : url
      }
      return url
    } catch {
      return url
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return copy.training?.level_beginner || 'Beginner'
      case 'intermediate': return copy.training?.level_intermediate || 'Intermediate'
      case 'advanced': return copy.training?.level_advanced || 'Advanced'
      default: return level
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="training-module-card rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-${categoryInfo.color}-500/20 flex-shrink-0`}>
            <IconComponent className={`w-6 h-6 text-${categoryInfo.color}-400`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="section-title text-lg mb-0">{localizedTitle}</h3>
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getLevelBadgeColor(module.level)}`}>
                {getLevelText(module.level)}
              </span>
            </div>
            {module.duration && (
              <p className="text-slate-400 text-sm mb-2">{module.duration}</p>
            )}
          </div>
        </div>

        {module.videoUrl && (
          <div className="mb-5 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src={toEmbedUrl(module.videoUrl)}
                title={localizedTitle}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {localizedDescription}
        </p>

        {module.resources.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={onToggle}
              className="btn-secondary inline-flex items-center gap-2 flex-1 justify-center"
            >
              <Download className="w-4 h-4" />
              {copy.training?.resources || 'Resources'} ({module.resources.length})
            </button>
          </div>
        )}

        {isExpanded && module.resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 pt-4 space-y-2"
          >
            {module.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-200 flex-1">{resource.title}</span>
                <span className="text-slate-500 text-xs uppercase">{resource.type}</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

const TRAINING_PDFS = [
  { id: 'kangen_ionizers_guide', category: 'products', url: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf' },
  { id: 'anespa_dx_guide', category: 'products', url: 'https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf' },
  { id: 'compensation_plan_guide', category: 'business', url: 'https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf' },
  { id: 'machine_care_guide', category: 'products', url: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf' },
  { id: 'kangen_ukon_guide', category: 'products', url: 'https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf' },
  { id: 'kangen_wagyu_guide', category: 'products', url: 'https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf' },
]

export default function TrainingPage() {
  const { locale } = useLocaleContext()
  const params = useParams()
  const countrySlug = params.countrySlug
  
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
    setIsLoggingIn(false)
  }

  const [activeView, setActiveView] = useState<'sessions' | 'guides'>('sessions')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  // Check if this is a LATAM training page
  const isLatamTraining = countrySlug && ['colombia', 'brazil', 'mexico', 'paraguay'].includes(countrySlug)
  
  // Handle URL anchor for guides section
  useEffect(() => {
    if (window.location.hash === '#pdf-guides') {
      setActiveView('guides')
    }
  }, [])

  // Get translations for current locale
  const copy = t[locale] || t.en

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const filteredModules = selectedCategory === 'all' 
    ? TRAINING_MODULES 
    : TRAINING_MODULES.filter(module => module.category === selectedCategory)

  const categories = Object.keys(CATEGORY_INFO) as Array<keyof typeof CATEGORY_INFO>

  return (
    <div className="page-wrapper" style={{ background: '#060b1e' }}>
      <Navbar />
      <main className="content-wrapper">
        <AuroraBackground className="pt-24 pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : !user ? (
              <div className="max-w-md mx-auto mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mb-4">
                    <Target className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Distributor Login</h2>
                  <p className="text-slate-400 text-sm">Access the True Legacy training library.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      required
                    />
                  </div>
                  {authError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {authError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full min-h-[52px] flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
                {/* Hero Section */}
                <div className="text-center mb-12">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-tl-gold opacity-80"
              >
                {copy.training?.academy || 'True Legacy Leadership Academy'}
                {isLatamTraining && (
                  <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-medium">
                    LATAM
                  </span>
                )}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="page-hero-title mb-4"
              >
                {copy.training?.hero_title || 'Master Your Enagic Business'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed"
              >
                {copy.training?.hero_subtitle || 'Complete training system designed to take you from beginner to 6A leader. Learn from proven strategies and build your legacy business with confidence.'}
              </motion.p>
            </div>

            {/* Sessions/Guides Toggle */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setActiveView('sessions')}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeView === 'sessions'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {copy.training?.sessions_tab || 'Training Sessions'}
                  </button>
                  <button
                    onClick={() => setActiveView('guides')}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeView === 'guides'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {copy.training?.guides_tab || 'Informational Guides'}
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter - Only show for sessions view */}
            {activeView === 'sessions' && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {copy.training?.all_modules || 'All Modules'} ({TRAINING_MODULES.length})
                </button>
                {categories.map((category) => {
                  const info = CATEGORY_INFO[category]
                  const count = TRAINING_MODULES.filter(m => m.category === category).length
                  const categoryTitle = copy.training?.categories?.[category] || info.title
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category 
                          ? `bg-${info.color}-500/20 text-${info.color}-300 border border-${info.color}-500/30`
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {categoryTitle} ({count})
                    </button>
                  )
                })}
              </div>
            </div>
            )}

            {/* Training Sessions View */}
            {activeView === 'sessions' && (
            <div className="space-y-6">
              {filteredModules.map((module, index) => (
                <TrainingModuleCard
                  key={module.id}
                  module={module}
                  isExpanded={expandedModules.has(module.id)}
                  onToggle={() => toggleModule(module.id)}
                  copy={copy}
                />
              ))}
            </div>
            )}

            {/* Informational Guides View */}
            {activeView === 'guides' && (
            <section id="pdf-guides" className="mb-12">
              <div className="text-center mb-8">
                <h2 className="section-title mb-4">{copy.training?.essential_guides || 'Essential Product Guides'}</h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  {copy.training?.guides_subtitle || 'Download these comprehensive PDFs to master every product in the Enagic lineup. Essential reading for all distributors building their True Legacy business.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TRAINING_PDFS.map((pdf, i) => {
                  const pdfTranslation = copy.trainingPdfs?.[pdf.id as keyof typeof copy.trainingPdfs]
                  const title = pdfTranslation?.title || pdf.id
                  const desc = pdfTranslation?.desc || ''
                  
                  return (
                    <motion.a
                      key={pdf.id}
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="pdf-card flex flex-col p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-cyan-500/20 flex-shrink-0">
                          <FileText className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">{title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="px-2 py-1 rounded-md text-xs uppercase tracking-wider text-slate-500 bg-white/5 border border-white/10">
                          {pdf.category}
                        </span>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            </section>
            )}
            
            </>
            )}
          </div>
        </AuroraBackground>
      </main>
      <Footer />
    </div>
  )
}