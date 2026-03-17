import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { CheckCircle, FileText, ExternalLink, Download, Play, Users, Target, Lightbulb } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { t } from '@/lib/translations'

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
    title: 'The Power of Your Purpose in Enagic',
    description:
      'In this session, your Enagic journey gets personal. We\'ll rediscover your Why, uncover your deeper purpose, and craft your 3-Year Vision alongside a letter from your future self. Expect guided reflection, a vision exercise, and steps to shape your path to leadership.',
    category: 'foundation',
    videoUrl: 'https://www.youtube.com/watch?v=2O7DboiJBdE&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'beginner',
    duration: '45 min',
    resources: [
      {
        title: 'Future Self Letter Template',
        url: 'https://drive.google.com/file/d/1_yOHfNqi2pomD28jeqSWjpjnFy4xIlY0/view?fbclid=IwY2xjawPwpb5leHRuA2FlbQIxMABicmlkETFDWTEzdmFua3U1Wkt2Tkdoc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHptWaiPgIwt2Fz2sMptJMUjbiZqUUdZdvmXzDchAE23zyzbS5updXJAD-v2G_aem_GM5pTxCd9ro80xVn66pbGQ',
        type: 'pdf',
      },
    ]
  },
  // 2. Product Mastery
  {
    id: 'kangen-science',
    title: 'Mastering the $10 Billion Products: LeveLuk & emGuarde',
    description:
      'This session equips you to position the LeveLuk series against competitors and highlights why emGuarde stands out. You\'ll gain confidence in Enagic\'s technology, certifications, and learn how emGuarde\'s unique advantages—like improving sleep and mood—can transform your closing power.',
    category: 'product',
    videoUrl: 'https://youtu.be/_LcCVpKnVxk?si=1UTiKWXvUP0MHjhm',
    level: 'beginner',
    duration: '60 min',
    resources: [
      {
        title: 'Kangen Water Ionizers Product Guide',
        url: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf',
        type: 'pdf',
      },
      {
        title: 'Machine Care & Maintenance Guide',
        url: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf',
        type: 'pdf',
      },
    ]
  },
  {
    id: 'product-lineup',
    title: 'The 8-Point Program & Massive Action Blueprint',
    description:
      'Break down Enagic’s patented 8-Point Program and see how top leaders use it to duplicate fast, rank up, and build sustainable income. This is the core blueprint for scaling your organization globally.',
    category: 'product',
    videoUrl:
      'https://www.youtube.com/watch?v=FndRvUtZXL0&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'intermediate',
    duration: '60 min',
    resources: [
      {
        title: '8-Point Compensation Plan Guide',
        url: 'https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf',
        type: 'pdf',
      },
      {
        title: '6-Month Projection Sheet',
        url: 'https://docs.google.com/spreadsheets/d/1zvfw-oBtkKLdSfVTquQw8J3g0ptTvBGT68weJF93MzA/edit#gid=1905539002',
        type: 'doc',
      },
    ]
  },
  // 4. Leadership & Structure
  {
    id: 'leadership-structure',
    title: 'The Blueprint to Building a Legacy with Enagic',
    description:
      'This session is a game-changer. You\'ll learn why 8 Points is just the start, 6A2 is the gateway, and true legacy begins beyond that. We break down how to structure for exponential growth, engineer long-term stability, and set the stage for generational income. This is your must-watch if you\'re serious about building real legacy.',
    category: 'leadership',
    videoUrl: 'https://youtu.be/Jz1LFvYTonI?si=fAbyqC4dChuIMn6t',
    level: 'intermediate',
    duration: '75 min',
    resources: [
      {
        title: 'Compensation Plan Guide',
        url: 'https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf',
        type: 'pdf',
      },
    ]
  },
  // 5. Systems & Funnels
  {
    id: 'systems-funnels',
    title: 'The System to Hit 6A Faster—Without Burning Out',
    description:
      'In this session, we break down the True Legacy funnel system—how to attract the right people, turn them into leaders, and scale without overwhelm. You\'ll master the steps from first contact to duplication—building a team that grows even when you rest. Learn how to attract the right prospects, exact steps from contact to duplication, how to automate and avoid burnout, and why this system accelerates 6A success.',
    category: 'systems',
    videoUrl: 'https://youtu.be/tL5KtgzCB74?si=C-P3B8IRwfQG32B5',
    level: 'advanced',
    duration: '90 min',
    resources: [
      {
        title: 'Conversation & Invitation Script',
        url: 'https://drive.google.com/file/d/1EePq-zNaNgUPnPBdnsg_FKyUelYXZJKR/view?usp=drive_link',
        type: 'doc',
      },
      {
        title: 'Invitation Variations by Prospect Type',
        url: 'https://drive.google.com/file/d/1g3k3cyhxwaKMC0a1hGSnIsXTf_U8F0op/view?usp=drive_link',
        type: 'doc',
      },
      {
        title: 'Duo Presentation Lead Template',
        url: 'https://drive.google.com/file/d/1983E6d1pi6GW0bKZi_6KNkaDBf7zyyNd/view?usp=drive_link',
        type: 'doc',
      },
    ]
  },
  // Prospecting & Invitations
  // 6. Prospecting & Invitations
  {
    id: 'prospecting-basics',
    title: '99% of Distributors Prospect the Wrong People — Fix This in 20 Min',
    description:
      'This is where everything shifts. If your pipeline feels stuck or you\'re talking to the wrong people—this training changes the game. Inside this breakthrough session, you\'ll learn: The PRIME 6™ – six target groups naturally aligned with Enagic, The 4 Archetypes – how people think, decide, and take action, The True Legacy Quadrants – instantly identify who\'s ready and who\'s not, The Prospect List Framework – build a high-quality, duplicatable list, The 48-Hour Rule – create momentum immediately after building your list. This isn\'t about collecting contacts. This is about identifying future leaders.',
    category: 'prospecting',
    videoUrl: 'https://www.youtube.com/watch?v=OAKaQqLIwmg&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'beginner',
    duration: '20 min',
    resources: [
      {
        title: 'True Legacy Prospect List Mastery',
        url: 'https://docs.google.com/document/d/18JD9AseUR_7gmdSbsrHXge5WqdfQhXTuvTfXOxk5hLA/edit?usp=sharing',
        type: 'doc',
      },
    ]
  },
  // 7. Turn Every Presentation Into a Builder Magnet
  {
    id: 'social-media-prospecting',
    title: 'Turn Every Presentation Into a Builder Magnet — Here\'s How',
    description:
      'Your Language Determines the People You Invite. This isn\'t just about giving a great demo—it\'s about using intentional language to attract the right people from the start. In this True Legacy Masterclass, you\'ll learn: The 3 Types of People who join Enagic, How to invite using the 4 Archetypes: Seeker, Builder, Protector, Architect, The psychology of high-conversion invitations, How the DUO Presentation activates each archetype, Product Demo vs Business Demo — what really closes, How to turn every demo into a duplication machine, How to attract your future 6A, 6A2, and 6A2-3 leaders. Your words shape your team. Your team shapes your future.',
    category: 'prospecting',
    videoUrl: 'https://www.youtube.com/watch?v=l8Uk9Mbegsk',
    level: 'intermediate',
    duration: '90 min',
    resources: [
      {
        title: 'Business Builder Invitation & Archetypes Profile',
        url: 'https://docs.google.com/document/d/1V6WPSTj3jBQ5Ja3frJ2sZGAcOEmlm-uXpzC4JzUwqnE/edit?usp=sharing',
        type: 'doc',
      },
    ]
  },
  // 8. Closing & Business Media
  {
    id: 'closing-techniques',
    title: 'STOP TALKING. START CLOSING.',
    description:
      'The 15-Minute System That Closes. This session unlocks one of the most powerful skills every Enagic leader must master: how to guide prospects into clarity and action using expert-level questions and strategic closing psychology. Most talk too much. Top leaders ask with precision. In this masterclass, you\'ll learn: The 14-Minute True Legacy Closing Framework, How to open your Zoom call with presence & authority, The 11-Question Diagnostic System to reveal pain, desire & readiness, How to identify the 4 Archetypes and tailor your close, The Precision 20% Close — the only part that really matters, How to ask for the decision without pressure, How to develop tonality, posture, and trusted advisor energy. This will shift how you close, lead, and duplicate.',
    category: 'closing',
    videoUrl: 'https://www.youtube.com/watch?v=ie-tFol7F4Q&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com',
    level: 'advanced',
    duration: '15 min',
    resources: [
      {
        title: 'Closing Framework Notes (external site)',
        url: 'https://www.truelegacyworld.com/true-legacy-leadership-training',
        type: 'doc',
      },
    ]
  },
  {
    id: 'business-media',
    title: 'Why Objections Are a Good Sign — And How to Turn Them into WINS',
    description:
      'Turn resistance into clarity. Learn the 4 core objection categories and exactly how to address money, spouse, timing, fear, and “I need to research” in a way that builds trust and momentum.',
    category: 'closing',
    videoUrl: 'https://www.youtube.com/watch?v=ut9H9n9dE70',
    level: 'intermediate',
    duration: '60 min',
    resources: [
      {
        title: 'Objection Handling Notes (external site)',
        url: 'https://www.truelegacyworld.com/true-legacy-leadership-training',
        type: 'doc',
      },
    ]
  },
  // 10. Business Media Training
  {
    id: 'income-projection',
    title: '❌ Forget Social Media — This Is Real Business Media',
    description:
      'Training with Eunice Seet (6A2). This session is your wake-up call to stop chasing likes and start using media to build a real business. Eunice breaks down how to turn your online presence into a powerful digital storefront that builds trust, attracts the right people, and works for you 24/7. Here\'s what you\'ll learn: Digital Storefront – Position yourself online like a pro, Target Audience & Bio – Speak directly to who you want to attract, Three-Pillar Magnetic Content – Combine Lifestyle, Educational, and Business posts to naturally draw in your ideal prospects. This training will shift how you show up online and how you attract your next team leaders. Don\'t just post—position. This is Business Media.',
    category: 'systems',
    videoUrl: 'https://www.youtube.com/watch?v=fjD6atjMN2g',
    level: 'beginner',
    duration: '45 min',
    resources: [
      {
        title: 'True Legacy Leadership Training Overview',
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

          </div>
        </AuroraBackground>
      </main>
      <Footer />
    </div>
  )
}