import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
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
  Check,
  Droplets,
  Radio,
  PlayCircle,
  MessageCircle,
  HelpCircle,
  XCircle,
  Info,
  Globe2,
  FileText,
  Copy
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
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

export function BusinessLandingPage({ profile: initialProfile, distributorSlug: initialSlug }: BusinessLandingPageProps) {
  const { slug: routeSlug } = useParams<{ slug?: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { locale } = useLocaleContext()

  const resolvedSlug = initialSlug || routeSlug || searchParams.get('ref') || 'mehdi-cohen'
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(initialProfile)
  const [activeTab, setActiveTab] = useState<'k8' | 'emguarde'>('k8')
  const [copied, setCopied] = useState(false)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [qualificationsExpanded, setQualificationsExpanded] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialProfile !== undefined) {
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
    (profile?.avatar_url && !profile.avatar_url.includes('mehdi-cohen') ? profile.avatar_url : null) ||
    getLeaderPortrait(distributorSlugActive, profile?.avatar_url) ||
    resolveLeaderPhoto(distributorSlugActive)

  const whatsappNumber = profile?.phone ? profile.phone.replace(/\D/g, '') : '18649072149'

  const generateWhatsAppUrl = (customMsg?: string) => {
    let msg = ''
    if (customMsg) {
      msg = customMsg
    } else if (locale === 'es') {
      msg = `Hola ${distributorFirstName}, estuve revisando la página de negocio de True Legacy y me gustaría conversar sobre los productos y la oportunidad de distribuidor.`
    } else if (locale === 'fr') {
      msg = `Bonjour ${distributorFirstName}, j'ai examiné la présentation d'affaires True Legacy et j'aimerais échanger avec vous.`
    } else if (locale === 'pt') {
      msg = `Olá ${distributorFirstName}, analisei a apresentação de negócios da True Legacy e gostaria de conversar com você.`
    } else {
      msg = `Hi ${distributorFirstName}, I reviewed the True Legacy business presentation and would like to talk about the Duo strategy and building as a distributor.`
    }
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
  }

  const defaultWhatsAppUrl = generateWhatsAppUrl()
  const bookingStrategyUrl = `/book/${encodeURIComponent(distributorSlugActive)}/strategy`
  const videoUrl = locale === 'es' ? 'https://youtu.be/t1OtNA4p8y4' : 'https://youtu.be/lB5fW55DmaI'

  // Scroll tracking for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom
        setShowStickyCta(heroBottom < 0)
      }
      if (finalCtaRef.current) {
        const finalCtaTop = finalCtaRef.current.getBoundingClientRect().top
        if (finalCtaTop < window.innerHeight) {
          setShowStickyCta(false)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyPageUrl = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      await navigator.share({ title: `True Legacy Business | ${distributorName}`, url }).catch(() => undefined)
      return
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Compensation data
  const commissionData = {
    k8: {
      name: 'Leveluk K8®',
      price: '$5,890 + applicable taxes',
      pointValue: '$350',
      tiers: [
        { rank: '1A', points: '1 Point', commission: '$350', note: 'Direct sale qualification' },
        { rank: '2A', points: '2 Points', commission: '$700', note: 'Direct sale qualification' },
        { rank: '3A', points: '3 Points', commission: '$1,050', note: 'Direct sale qualification' },
        { rank: '4A', points: '4 Points', commission: '$1,400', note: 'Direct sale qualification' },
        { rank: '5A', points: '5 Points', commission: '$1,750', note: 'Direct sale qualification' },
        { rank: '6A', points: '6 Points', commission: '$2,100', note: 'Direct sale qualification' },
      ],
    },
    emguarde: {
      name: 'emGuarde® GO',
      price: '$2,880 + applicable taxes',
      pointValue: '$150',
      tiers: [
        { rank: '1A', points: '1 Point', commission: '$150', note: 'Direct sale qualification' },
        { rank: '2A', points: '2 Points', commission: '$300', note: 'Direct sale qualification' },
        { rank: '3A', points: '3 Points', commission: '$450', note: 'Direct sale qualification' },
        { rank: '4A', points: '4 Points', commission: '$600', note: 'Direct sale qualification' },
        { rank: '5A', points: '5 Points', commission: '$750', note: 'Direct sale qualification' },
        { rank: '6A', points: '6 Points', commission: '$900', note: 'Direct sale qualification' },
      ],
    },
  }

  const ranksProgression = [
    { rank: '1A', sales: 'Sales 1–2', desc: 'Your starting direct sales position. Establishes your first commission lanes.' },
    { rank: '2A', sales: 'Sales 3–10', desc: 'Opens your 2-point direct sale lane. Point value multiplies immediately.' },
    { rank: '3A', sales: 'Sales 11–20', desc: 'Opens your 3-point lane as your cumulative group sales develop.' },
    { rank: '4A', sales: 'Sales 21–50', desc: 'Opens your 4-point lane. Cumulative team and direct production advances rank.' },
    { rank: '5A', sales: 'Sales 51–100', desc: 'Opens your 5-point lane. Senior distributor leadership tier.' },
    { rank: '6A', sales: '101+ Sales', desc: 'Flagship leadership milestone. Unlocks 6-point direct lanes and executive development bonuses.' },
  ]

  return (
    <div className="min-h-screen bg-[#020408] text-white selection:bg-cyan-500/30 selection:text-cyan-200 font-sans antialiased overflow-x-hidden">
      <SEO
        title={`True Legacy Business | ${distributorName}`}
        description="Two Products. One Business Strategy. A System Built to Duplicate. Explore the True Legacy business model, progressive commission structure, and global leadership community."
        image="https://www.truelegacyworld.com/business/business-hero-master.jpg"
      />

      {/* TOP NOTIFICATION / DISTRIBUTOR BADGE */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#020408]/85 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LandingHeaderBackButton />
            <Link to="/" className="flex items-center gap-3 group">
              <TrueLegacyLogo className="h-6 w-auto text-white group-hover:text-cyan-400 transition-colors" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Distributor Badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">
              <img
                src={leaderPhoto}
                alt={distributorName}
                className="w-6 h-6 rounded-full object-cover border border-amber-400/60 shrink-0"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/logos/tl-square-white.png'
                }}
              />
              <span className="text-zinc-400">Presented by</span>
              <span className="font-bold text-white">{distributorName}</span>
            </div>

            {/* Quick Share Button */}
            <button
              onClick={copyPageUrl}
              className="p-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all"
              title="Share page"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Direct Connect CTA */}
            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Talk to {distributorFirstName}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 01 — HERO */}
      {/* ========================================================================= */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Background Image: Master Hero with K8 + emGuarde on marble kitchen island at blue hour */}
        <div className="absolute inset-0 z-0">
          <img
            src="/business/business-hero-master.jpg"
            alt="True Legacy Business Environment"
            className="w-full h-full object-cover object-center lg:object-right"
          />
          {/* Subtle gradient scrim to ensure negative space left is deeply readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020408] via-[#020408]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-[#020408]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-950/40 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-300">
                THE TRUE LEGACY BUSINESS
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] mb-6">
              TWO PRODUCTS.<br />
              ONE BUSINESS STRATEGY.<br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                A SYSTEM BUILT TO SCALE.
              </span>
            </h1>

            {/* Supporting copy */}
            <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed mb-8">
              Build around two distinct product conversations, a progressive commission structure, and a proven training ecosystem designed to help entrepreneurs learn, share and duplicate what works.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <button
                onClick={() => scrollToSection('section-what-we-build')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 transition-all cursor-pointer"
              >
                <span>SEE HOW IT WORKS</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('section-presentation')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-white hover:bg-white/15 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-amber-300" />
                <span>WATCH THE PRESENTATION</span>
              </button>

              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-emerald-300 hover:bg-emerald-900/50 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>TALK TO {distributorFirstName.toUpperCase()}</span>
              </a>
            </div>

            {/* Trust Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Established</div>
                <div className="text-sm font-bold text-white mt-0.5">52+ Years Enagic</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Global Reach</div>
                <div className="text-sm font-bold text-white mt-0.5">173 Countries</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Flagship Focus</div>
                <div className="text-sm font-bold text-white mt-0.5">Premium Hardware</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Infrastructure</div>
                <div className="text-sm font-bold text-white mt-0.5">Training + Systems</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — EXECUTIVE OVERVIEW & PRESENTATION */}
      {/* ========================================================================= */}
      <section id="section-presentation" ref={videoSectionRef} className="py-20 lg:py-24 border-b border-white/10 relative bg-[#040815]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
              COMPLETE EXECUTIVE OVERVIEW
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              SEE THE FULL PICTURE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
                OFFICIAL BUSINESS PRESENTATION.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-300">
              Watch the comprehensive True Legacy business presentation explaining product synergy, the patented 8-point compensation system, and our duplication roadmap.
            </p>
          </div>

          {/* Video Player Container */}
          <div className="relative rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-b from-[#0e1726] via-[#060a12] to-[#020408] p-3 sm:p-5 shadow-2xl">
            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video">
              <iframe
                src={videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]}
                title="True Legacy Global Business Presentation"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Verified True Legacy Executive Briefing
              </span>
              <span className="font-semibold text-zinc-300">
                Official Curriculum · Presented by Team Leadership
              </span>
            </div>
          </div>

          {/* Action Callout */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>TALK TO {distributorFirstName.toUpperCase()} ON WHATSAPP</span>
            </a>

            <Link
              to={bookingStrategyUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/15 transition-all"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>BOOK A STRATEGY CALL</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — THE FIRST QUESTION: WHAT ARE YOU ACTUALLY BUILDING? */}
      {/* ========================================================================= */}
      <section id="section-what-we-build" className="py-24 border-b border-white/10 relative bg-[#040711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6">
              <div className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400 mb-3">START HERE</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                WHAT ARE YOU<br />
                <span className="text-zinc-400">ACTUALLY BUILDING?</span>
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
                <p className="font-semibold text-white">
                  At its core, the business model is clean, direct, and straightforward.
                </p>
                <p>
                  You introduce people to premium Enagic wellness and environmental technologies that households and businesses use every day.
                </p>
                <p>
                  When qualifying sales are made, Enagic's patented direct-sales compensation structure generates upfront commissions.
                </p>
                <p>
                  As your cumulative business advances through the rank structure, the commission value associated with future qualifying direct sales increases significantly.
                </p>
              </div>

              {/* Progression Pipeline in HTML/CSS */}
              <div className="mt-8 p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-md">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
                  The Core Progression Loop
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
                  <span className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">SHARE</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">SALE</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300">POINTS</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300">RANK</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">LEADERSHIP</span>
                </div>
                <div className="text-xs text-zinc-400 mt-3">
                  Every step builds cumulative enterprise value. No starting over each month.
                </div>
              </div>
            </div>

            {/* Right B-roll Editorial */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
                <img
                  src="/business/business-broll-01-entrepreneur.jpg"
                  alt="Modern Entrepreneur Vision"
                  className="w-full aspect-[16/10] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Vision & Focus</div>
                  <div className="text-sm text-zinc-300 mt-1">
                    Building an independent, asset-backed global business with institutional discipline.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — TWO PRODUCTS: TWO CONVERSATIONS */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408] overflow-hidden">
        {/* Background B-roll subtle layer */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src="/business/business-broll-02-two-worlds.jpg"
            alt="Two Worlds Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">THE FOUNDATION</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              TWO PRODUCTS.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
                TWO DISTINCT CONVERSATIONS.
              </span>
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Rather than pitching a sprawling product catalog, True Legacy focuses the business front door on two world-class flagship technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CARD 1: KANGEN WATER (K8) */}
            <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#061527] via-[#030b15] to-[#02050b] p-8 sm:p-10 flex flex-col justify-between shadow-2xl hover:border-cyan-400/50 transition-all group">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-xs font-bold text-cyan-300">
                    <Droplets className="w-3.5 h-3.5" />
                    WATER & CELLULAR HEALTH
                  </span>
                  <span className="text-xs font-bold text-zinc-400">FLAGSHIP IONIZATION</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Leveluk K8®
                </h3>
                <div className="text-sm font-semibold text-cyan-400 mb-4">
                  Enagic® 8-Plate Medical Ionization System
                </div>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                  A premium Japanese water-ionization system built around something every household and business already consumes every single day: water. Generates 5 distinct functional water grades, active molecular hydrogen (H2), and powerful antioxidant potential.
                </p>

                {/* Exact Product PNG Composition */}
                <div className="my-6 relative py-4 flex items-center justify-center bg-radial from-cyan-950/40 to-transparent rounded-2xl">
                  <img
                    src="/products/k8.png"
                    alt="Leveluk K8"
                    className="max-h-64 object-contain drop-shadow-[0_20px_35px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/30 mb-6">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Compensation Value</div>
                  <div className="text-2xl font-black text-white mt-1">
                    $350 <span className="text-xs font-semibold text-cyan-300">/ COMMISSION POINT</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Base retail: $5,890 + tax · 8 commission points allocated per machine.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  to={`/d/${distributorSlugActive}/k8`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-100 transition-colors"
                >
                  <span>Explore Kangen Water</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-zinc-500 font-mono">CONVERSATION 01</span>
              </div>
            </div>

            {/* CARD 2: EMGUARDE */}
            <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#19140a] via-[#0e0c06] to-[#02050b] p-8 sm:p-10 flex flex-col justify-between shadow-2xl hover:border-amber-400/50 transition-all group">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-xs font-bold text-amber-300">
                    <Radio className="w-3.5 h-3.5" />
                    ENVIRONMENTAL HARMONIZATION
                  </span>
                  <span className="text-xs font-bold text-zinc-400">PATENTED RESONANCE</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-amber-300 transition-colors">
                  emGuarde® GO
                </h3>
                <div className="text-sm font-semibold text-amber-400 mb-4">
                  Patented 360° Electromagnetic Harmonizer
                </div>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                  A second product category creating an entirely different conversation around today's increasingly connected environments. Harmonizes electromagnetic noise across a 3-meter radius without interfering with telecommunications or WiFi connectivity.
                </p>

                {/* Exact Product PNG Composition */}
                <div className="my-6 relative py-4 flex items-center justify-center bg-radial from-amber-950/40 to-transparent rounded-2xl">
                  <img
                    src="/products/emguarde-tight.png"
                    alt="emGuarde GO"
                    className="max-h-64 object-contain drop-shadow-[0_20px_35px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/products/emguarde.png'
                    }}
                  />
                </div>

                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/30 mb-6">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Compensation Value</div>
                  <div className="text-2xl font-black text-white mt-1">
                    $150 <span className="text-xs font-semibold text-amber-300">/ COMMISSION POINT</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Base retail: $2,880 + tax · 8 commission points allocated per set.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  to={`/d/${distributorSlugActive}/emguarde`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-100 transition-colors"
                >
                  <span>Explore emGuarde</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-zinc-500 font-mono">CONVERSATION 02</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — HOW THE MONEY WORKS: INTERACTIVE 8-POINT COMMISSION CALCULATOR */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#030612]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
              THE COMPENSATION STRUCTURE
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              ONE POINT.<br />
              MORE VALUE AS YOU PROGRESS.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-300">
              The commission value associated with a qualifying direct sale increases as you advance through the rank structure.
            </p>

            {/* Interactive Toggle */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('k8')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'k8'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Leveluk K8® ($350 / pt)
              </button>
              <button
                onClick={() => setActiveTab('emguarde')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'emguarde'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                emGuarde® GO ($150 / pt)
              </button>
            </div>
          </div>

          {/* Active Product Details */}
          <div className="max-w-5xl mx-auto mb-10 p-6 rounded-2xl border border-white/15 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Selected Model: {commissionData[activeTab].name}
              </div>
              <div className="text-sm text-zinc-300 mt-1">
                Official Retail Price: <strong className="text-white">{commissionData[activeTab].price}</strong>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400">Commission Base Per Point</div>
              <div className="text-2xl font-black text-white">{commissionData[activeTab].pointValue}</div>
            </div>
          </div>

          {/* 1A to 6A Commission Value Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {commissionData[activeTab].tiers.map((tier) => (
              <div
                key={tier.rank}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  activeTab === 'k8'
                    ? 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400'
                    : 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400'
                }`}
              >
                <div className="text-xs font-mono font-bold text-zinc-400">{tier.rank} Direct Lane</div>
                <div className="text-xs text-zinc-500 mt-0.5">{tier.points}</div>
                <div className="text-2xl sm:text-3xl font-black text-white my-3 tracking-tight">
                  {tier.commission}
                </div>
                <div className="text-[11px] text-zinc-400 leading-tight">
                  Per direct sale in this lane
                </div>
              </div>
            ))}
          </div>

          {/* Official 8-Point Patent Certificate Callout */}
          <div className="max-w-5xl mx-auto mt-12 p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-r from-white/[0.04] to-transparent flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-2 shrink-0 flex items-center justify-center">
              <Award className="w-12 h-12 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                PATENTED IN JAPAN & GLOBALLY
              </div>
              <h4 className="text-lg font-bold text-white mt-1">
                The 8-Point Global Patented Commission System
              </h4>
              <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                When a product is sold, Enagic allocates a dedicated marketing pre-budget of exactly 8 points distributed out equally to qualifying distributors. No traditional advertising budgets. The distributor is the distribution channel.
              </p>
            </div>
            <div className="text-xs text-zinc-400 md:text-right shrink-0">
              Patent No. 87449502<br />
              Verified Enagic Corporation
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — RANK PROGRESSION: THE BUSINESS GROWS IN STAGES */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Metaphor B-roll */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/business/business-broll-03-progression.jpg"
                  alt="Architectural Progression Metaphor"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Cumulative Growth
                  </div>
                  <div className="text-sm text-zinc-300 mt-1">
                    Every direct and indirect group sale counts toward your permanent rank milestones.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stages Flow */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
                SYSTEMATIC ADVANCEMENT
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
                THE BUSINESS<br />
                GROWS IN STAGES.
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg mb-8 leading-relaxed">
                You do not need to figure out everything on day one. Enagic's rank structure provides a clear, progressive roadmap from your very first direct sale to enterprise leadership.
              </p>

              <div className="space-y-3">
                {ranksProgression.map((item, idx) => (
                  <div
                    key={item.rank}
                    className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/40 transition-all flex items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-lg font-black text-cyan-300 shrink-0">
                        {item.rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{item.sales}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                            Stage 0{idx + 1}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expandable Qualifications */}
              <div className="mt-6">
                <button
                  onClick={() => setQualificationsExpanded(!qualificationsExpanded)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{qualificationsExpanded ? 'Hide' : 'Expand'} Advanced Qualification Details</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${qualificationsExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {qualificationsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-zinc-400 space-y-2 leading-relaxed"
                    >
                      <p>
                        • Direct sales and cumulative group sales both count toward milestone totals.
                      </p>
                      <p>
                        • 6A qualification requires 100 cumulative group sales within your active organization plus 1 final direct sale into the 6A lane.
                      </p>
                      <p>
                        • Points pay out up to 8 points per transaction through the upline according to Enagic's patented commission rules.
                      </p>
                      <p>
                        • No monthly minimum sales required to maintain your achieved title rank once qualified.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 — THE DUO REVEAL: THE AHA MOMENT */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#040815] overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/business/duo-water-wave-hero.jpg"
            alt="Duo Synergy"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
              THE DUO STRATEGY
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              NOW YOU CAN SEE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
                WHY THE DUO MATTERS.
              </span>
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              Instead of beginning with only one product conversation, the Duo strategy introduces two complementary positions.
            </p>
          </div>

          {/* Architecture Visual */}
          <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-b from-[#0a182e] via-[#050e1c] to-[#02050b] shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Account 1 */}
              <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-center">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  ACCOUNT 01
                </div>
                <h4 className="text-xl font-black text-white mt-1">KANGEN WATER®</h4>
                <div className="text-sm font-semibold text-zinc-300">Leveluk K8</div>
                <div className="text-3xl font-black text-cyan-300 my-4">$350 / POINT</div>
                <div className="text-xs text-zinc-400">
                  Everyday hydration ritual · Household centerpiece
                </div>
              </div>

              {/* Account 2 */}
              <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/40 text-center">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  ACCOUNT 02
                </div>
                <h4 className="text-xl font-black text-white mt-1">EMGUARDE®</h4>
                <div className="text-sm font-semibold text-zinc-300">emGuarde GO</div>
                <div className="text-3xl font-black text-amber-300 my-4">$150 / POINT</div>
                <div className="text-xs text-zinc-400">
                  Connected workspace & home · Modern technology
                </div>
              </div>
            </div>

            {/* Core Realization Box */}
            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 mb-2">
                THE STRUCTURAL REALIZATION
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mb-4">
                TWO PRODUCTS. TWO PRODUCT POSITIONS. ONE BUSINESS STRATEGY.
              </div>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Kangen Water creates one natural conversation. emGuarde creates another. Together, the Duo gives an independent distributor two distinct ways to open conversations and introduce the business from the very beginning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07 — WHY TWO CONVERSATIONS MATTER */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
                MULTIPLE ENTRY POINTS
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
                MORE THAN<br />
                ONE WAY TO CONNECT.
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6">
                Not every person enters through the same door. A single product often limits your audience to people with one specific interest.
              </p>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
                The Duo creates multiple natural entry points into the same underlying ecosystem:
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Some people connect with Water</div>
                    <div className="text-xs text-zinc-400 mt-1">Health, fitness, longevity, athletic recovery, and kitchen wellness.</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Some people connect with Technology & Environment</div>
                    <div className="text-xs text-zinc-400 mt-1">Connected workspaces, screen fatigue, EMF consciousness, and office defense.</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Some people connect with the Business Opportunity</div>
                    <div className="text-xs text-zinc-400 mt-1">Entrepreneurs looking for high-ticket direct sales, global distribution, and leadership duplication.</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>All three doors lead directly into the True Legacy System.</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/business/business-broll-05-conversations.jpg"
                  alt="Real Business Conversations"
                  className="w-full aspect-[16/11] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Natural Conversations</div>
                  <div className="text-sm text-zinc-300 mt-1">
                    Real entrepreneurs having real conversations with zero artificial hype.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 — THEN REVEAL TRUE LEGACY */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-gradient-to-b from-[#020408] via-[#080d1e] to-[#020408]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
            THE DIFFERENCE
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            THE PRODUCTS ARE THE VEHICLE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300">
              THE SYSTEM IS WHAT HELPS YOU BUILD.
            </span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Buying a product and building a business are two completely different things. True Legacy exists to give independent distributors structure, clarity, and duplication around what happens next.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09 — TRUE LEGACY OPERATING SYSTEM */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#030612]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
              INFRASTRUCTURE AT YOUR FINGERTIPS
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              YOU DON'T START<br />WITH A BLANK PAGE.
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Every distributor in True Legacy receives turnkey digital tools, CRM, landing pages, and structured media assets from day one.
            </p>
          </div>

          {/* Hub Ecosystem Diagram in HTML/CSS */}
          <div className="max-w-5xl mx-auto relative p-8 sm:p-12 rounded-3xl border border-white/15 bg-white/[0.02] backdrop-blur-xl">
            {/* Center Node */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 shadow-xl shadow-cyan-500/30 flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full bg-[#020408] flex flex-col items-center justify-center">
                  <span className="text-xs text-zinc-400">DISTRIBUTOR</span>
                  <span className="text-lg font-black text-white">YOU</span>
                </div>
              </div>
              <div className="text-xs font-semibold text-cyan-300 mt-2">
                Supported by the True Legacy Operating System
              </div>
            </div>

            {/* Surrounding Tools Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
              {[
                { name: 'Academy', desc: 'Step-by-step masterclasses', icon: BookOpen },
                { name: 'Lead CRM', desc: 'Track prospect engagement', icon: Target },
                { name: 'Personal Website', desc: 'Custom /d/[slug] storefront', icon: Globe2 },
                { name: 'Product Landers', desc: 'K8, emGuarde, Duo pages', icon: Sparkles },
                { name: 'Live Webinars', desc: 'Weekly global presentations', icon: Tv },
                { name: 'Follow-Up Flows', desc: 'Automated messaging templates', icon: MessageSquare },
                { name: 'Sales Scripts', desc: 'Field-tested objection handling', icon: FileText },
                { name: 'Call Booking', desc: 'Integrated calendar system', icon: Calendar },
                { name: 'Multilingual Media', desc: 'EN, ES, FR, PT assets', icon: Layers },
                { name: 'Leadership Dev', desc: 'Mentorship & progression', icon: Award },
                { name: 'Team Events', desc: 'Quarterly global workshops', icon: Users },
                { name: 'Market Expansion', desc: 'LATAM & emerging markets', icon: MapPin },
              ].map((tool) => {
                const IconComponent = tool.icon
                return (
                  <div
                    key={tool.name}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all"
                  >
                    <IconComponent className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                    <div className="font-bold text-white text-sm">{tool.name}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{tool.desc}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <span>Learn</span>
              <span className="text-zinc-600">•</span>
              <span>Present</span>
              <span className="text-zinc-600">•</span>
              <span>Follow Up</span>
              <span className="text-zinc-600">•</span>
              <span>Organize</span>
              <span className="text-zinc-600">•</span>
              <span>Duplicate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10 — THE ACADEMY */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
                LEARN WHILE YOU BUILD
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
                A SYSTEM YOU CAN<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-200">
                  ACTUALLY FOLLOW.
                </span>
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6">
                New distributors don't fail because they lack ambition. They fail because they don't know what to say, who to talk to, or how to follow up effectively.
              </p>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
                The True Legacy Academy provides a structured curriculum that covers everything from product science to enterprise team leadership.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8 text-xs font-semibold text-zinc-300">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Structured Onboarding</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Product Education</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Business Fundamentals</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Sales Conversations</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Field-Tested Scripts</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Weekly Live Calls</span>
                </div>
              </div>

              <Link
                to={`/d/${distributorSlugActive}/training`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-sm font-bold text-white transition-all"
              >
                <span>PREVIEW THE ACADEMY</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/business/business-broll-06-workspace.jpg"
                  alt="True Legacy Digital Workspace"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Turnkey Digital Platform</div>
                  <div className="text-sm text-zinc-300 mt-1">
                    Manage your pipeline, training modules, and landing pages on desktop and mobile.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 & 12 — THE TEAM PROOF & MALAYSIA QUARTERLY EVENT */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#040714] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
              BEHIND THE SYSTEM
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              THIS WASN'T BUILT<br />IN A VACUUM.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
              True Legacy operates within a larger leadership and training ecosystem that has been developing distributors and sharing experience across international markets for years.
            </p>
          </div>
        </div>

        {/* Kuala Lumpur Skyline Establishing B-Roll (Section 12 Intro) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-64 sm:h-80">
            <img
              src="/business/business-broll-07-kl-skyline.jpg"
              alt="Kuala Lumpur Global Leadership Gathering"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-black/30" />
            <div className="absolute bottom-6 left-6 sm:left-8">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                INTERNATIONAL LEADERSHIP SUMMIT · KUALA LUMPUR
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                TRAIN TOGETHER. BUILD TOGETHER. GROW TOGETHER.
              </h3>
            </div>
          </div>
        </div>

        {/* THE REAL MALAYSIA EVENT PHOTOGRAPH — FULL WIDTH EDITORIAL MOMENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black">
            <img
              src="/business/malaysia-group-event-optimized.jpg"
              alt="Malaysia Leadership & Training Event — Official True Legacy Community"
              className="w-full h-auto object-cover max-h-[750px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="p-4 rounded-2xl backdrop-blur-md bg-black/70 border border-white/15 max-w-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Official True Legacy Leadership Event
                </span>
                <div className="text-base sm:text-lg font-bold text-white mt-1">
                  Enagic Global Workshop & Leadership Assembly · Malaysia
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Quarterly gatherings bring leaders and distributors together from across Asia, the Americas, and Europe for in-person masterclasses, strategy alignment, and culture building.
                </p>
              </div>

              <div className="text-right hidden sm:block">
                <span className="px-3 py-1.5 rounded-full border border-white/20 bg-black/60 text-xs font-semibold text-zinc-300 backdrop-blur-md">
                  Real Community · Real Leadership · Real Infrastructure
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13 — EXPERIENCE > THEORY */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
                PROVEN LEADERSHIP
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
                A SYSTEM SHAPED<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">
                  BY PEOPLE WHO BUILD.
                </span>
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6">
                This isn't academic theory or textbook sales advice. Every framework inside True Legacy has been forged by distributors who have built organizations across multiple continents.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-300 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Real leaders actively presenting in the field</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Multi-country duplication systems tested over years</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Direct mentorship access for emerging distributors</span>
                </div>
              </div>
            </div>

            {/* Stage Leaders Real Photo */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/business/malaysia-stage-leaders.jpg"
                  alt="True Legacy Leaders on Stage in Malaysia"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    On-Stage Masterclass Experience
                  </div>
                  <div className="text-sm text-zinc-300 mt-1">
                    Simon Loh, Ming-Way Sia, Mehdi Cohen, and international leadership training on stage in Kuala Lumpur.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14 — MARKET EXPANSION: BLUE OCEAN STRATEGY */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#040815] overflow-hidden">
        {/* Background B-roll */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src="/business/business-broll-08-global-vision.jpg"
            alt="Global Boardroom Vision"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
              WHERE TRUE LEGACY SPECIALIZES
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              BUILD EXISTING MARKETS.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
                HELP OPEN NEW ONES.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
              We combine institutional stability with early-mover strategic expansion into under-served territories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mature Markets */}
            <div className="p-8 rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Mature Markets</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                In established regions like North America and Western Europe, our strategy focuses on fresh branding, digital funnels, modern positioning, and introducing the Duo to revitalize distributor growth.
              </p>
              <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Modern positioning replaces outdated network marketing tropes.
              </div>
            </div>

            {/* Emerging & LATAM Markets */}
            <div className="p-8 rounded-3xl border border-amber-500/30 bg-white/[0.03] backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Emerging & LATAM Expansion</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                In developing markets such as Latin America, awareness is still in its early stages. True Legacy develops local leaders early, establishes compliant infrastructure, and creates strategic "blue ocean" footholds.
              </p>
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                First-generation leadership development in high-growth territories.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15 — LEADERSHIP & DUPLICATION: THE LONG GAME */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
                THE LONG GAME
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
                THE GOAL ISN'T<br />
                TO NEED YOU FOREVER.
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6">
                A truly scalable organization cannot depend on one person doing everything. If the business collapses when you step away, you haven't built an organization—you've built another job.
              </p>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
                The objective is to master a simple system well enough that others can learn it, execute it, and eventually teach it to their own teams.
              </p>

              {/* Duplication Cycle */}
              <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.02]">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
                  The Duplication Lifecycle
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    01<br />LEARN
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    02<br />DO
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300">
                    03<br />TEACH
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    04<br />LEAD
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/business/business-broll-09-leadership.jpg"
                  alt="Leadership Mentorship Briefing"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Sustainable Duplication
                  </div>
                  <div className="text-sm text-zinc-300 mt-1">
                    Empowering emerging leaders to conduct presentations and train teams autonomously.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 16 — BEYOND 6A: A MILESTONE, NOT THE FINISH LINE */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#030612]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
            ADVANCED HORIZONS
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
            6A IS A MILESTONE.<br />
            <span className="text-zinc-400">NOT THE FINISH LINE.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Reaching 101 group sales (6A) is just the entrance to executive team development. At advanced levels, the business focuses on developing other 6A leaders within your organization.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
              <div className="text-xl font-black text-cyan-300">6A</div>
              <div className="text-xs font-bold text-white mt-1">Foundation</div>
              <div className="text-[11px] text-zinc-400 mt-2">101+ cumulative group sales. Unlocks top-tier 6-point lanes.</div>
            </div>

            <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.02]">
              <div className="text-xl font-black text-white">6A2</div>
              <div className="text-xs font-bold text-white mt-1">Leadership</div>
              <div className="text-[11px] text-zinc-400 mt-2">Developing two distinct 6A leaders in separate branches.</div>
            </div>

            <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.02]">
              <div className="text-xl font-black text-white">6A2-2</div>
              <div className="text-xs font-bold text-white mt-1">Duplication</div>
              <div className="text-[11px] text-zinc-400 mt-2">Second-generation leadership development and depth.</div>
            </div>

            <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20">
              <div className="text-xl font-black text-amber-300">6A2-3 & Beyond</div>
              <div className="text-xs font-bold text-white mt-1">Legacy Bonusing</div>
              <div className="text-[11px] text-zinc-400 mt-2">Enagic global legacy monthly leadership bonuses.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 17 — WHO THIS IS FOR (THE FILTER) */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
              CANDID ALIGNMENT
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              THIS IS A BUSINESS.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">
                NOT A LOTTERY TICKET.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400">
              We protect our team culture and focus our energy on partners who possess genuine entrepreneurial discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* GOOD FIT */}
            <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-white">This Is For You If:</h3>
              </div>
              <ul className="space-y-4 text-sm sm:text-base text-zinc-300">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>You are willing to learn a proven communication and sales system.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>You genuinely respect premium, Japanese-engineered wellness hardware.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>You enjoy building relationships and speaking with other professionals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>You have a long-term, multi-year asset-building mindset.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>You want to develop as a public speaker, coach, and community leader.</span>
                </li>
              </ul>
            </div>

            {/* NOT A FIT */}
            <div className="p-8 rounded-3xl border border-red-500/30 bg-red-950/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                  <XCircle className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-white">This Is NOT For You If:</h3>
              </div>
              <ul className="space-y-4 text-sm sm:text-base text-zinc-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>You are looking for guaranteed or overnight get-rich-quick income.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>You expect completely passive income without putting in initial sales work.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>You are unwilling to communicate or follow up with interested prospects.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>You resist following an established duplication framework.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Long Term Metaphor B-roll */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            <img
              src="/business/business-broll-10-long-term.jpg"
              alt="Long Term Entrepreneurial Vision"
              className="w-full aspect-[21/9] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10 max-w-lg">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Quiet Purpose & Time Freedom
              </div>
              <div className="text-sm text-zinc-300 mt-0.5">
                The ultimate goal is building enterprise equity that gives you choice, direction, and long-term autonomy.
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 19 — DISTRIBUTOR HANDOFF */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-white/10 relative bg-[#020408]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-xl">
            <div className="text-center mb-8">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
                YOUR VERIFIED GUIDE
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white tracking-tight">
                BUSINESSES ARE BUILT<br />THROUGH PEOPLE.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Leader Photo */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-amber-400/80 p-1 shadow-2xl shadow-amber-500/20">
                  <img
                    src={leaderPhoto}
                    alt={distributorName}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/logos/tl-square-white.png'
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500 text-[11px] font-black text-white uppercase tracking-wider shadow-lg">
                  Active
                </div>
              </div>

              {/* Bio & Intro */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-black text-white">{distributorName}</h3>
                <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase mt-1">
                  Independent Enagic® Distributor · True Legacy Leadership
                </div>
                <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Have a candid conversation with {distributorFirstName} about the products, the Duo strategy, the compensation structure, and what building with True Legacy looks like in your market.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href={defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp {distributorFirstName}</span>
                  </a>

                  <Link
                    to={bookingStrategyUrl}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-5 py-2.5 text-xs font-bold text-white transition-all"
                  >
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Book Strategy Call</span>
                  </Link>

                  <button
                    onClick={copyPageUrl}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 20 — FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section ref={finalCtaRef} className="py-28 relative bg-[#020408] overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">
            YOUR NEXT MOVE
          </span>
          <h2 className="mt-4 text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            YOU'VE SEEN WHAT WE BUILD.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
              NOW DECIDE IF IT FITS YOU.
            </span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Two products. A progressive business model. A system. A team. A path to develop as a leader.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('section-presentation')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 transition-all cursor-pointer"
            >
              <PlayCircle className="w-5 h-5 text-amber-300" />
              <span>WATCH THE PRESENTATION</span>
            </button>

            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-8 py-4 text-base font-bold text-emerald-300 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>TALK TO {distributorFirstName.toUpperCase()}</span>
            </a>
          </div>

          {/* Compliance Disclaimer */}
          <div className="mt-16 pt-8 border-t border-white/10 text-xs text-zinc-500 max-w-2xl mx-auto leading-relaxed space-y-2">
            <p>
              <strong>Compliance Notice:</strong> This page is presented by an Independent Enagic® Distributor. True Legacy is an independent distributor community and training ecosystem, not an official corporate entity of Enagic Co., Ltd.
            </p>
            <p>
              Compensation illustrations shown above are mathematical examples based on Enagic's patented 8-point commission plan and do not constitute income guarantees. Actual distributor earnings vary based on individual effort, sales volume, leadership skill, market conditions, and compliance with company policies.
            </p>
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM BAR FOR MOBILE / SCROLLED DESKTOP */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#020408]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-3 px-4 sm:px-8"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={leaderPhoto}
                alt={distributorName}
                className="w-9 h-9 rounded-full object-cover border border-amber-400/80"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/logos/tl-square-white.png'
                }}
              />
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white">{distributorName}</div>
                <div className="text-[10px] text-zinc-400">Independent True Legacy Guide</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollToSection('section-presentation')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Watch Video
              </button>

              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Talk to {distributorFirstName}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
