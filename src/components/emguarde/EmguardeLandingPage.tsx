import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Award,
  BatteryCharging,
  Brain,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  ExternalLink,
  Flame,
  Globe2,
  HeartPulse,
  Info,
  Layers,
  MessageCircle,
  Microscope,
  PlayCircle,
  Radio,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Wifi,
  Zap,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { PRODUCT_VIDEOS } from '@/lib/productVideos'
import { getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'

interface EmguardeLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

function toEmbedUrl(url: string) {
  if (!url) return ''
  if (url.includes('youtu.be/')) {
    const after = url.split('youtu.be/')[1] || ''
    const id = after.split(/[?&]/)[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtube.com/watch')) {
    try {
      const u = new URL(url)
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : url
    } catch {
      return url
    }
  }
  return url
}

const FIVE_FEATURE_PILLARS = [
  {
    icon: Smartphone,
    title: 'Portability',
    subtitle: 'Take It Everywhere You Go',
    desc: 'Ultra-compact personal close-body design that fits effortlessly into pockets, purses, backpacks, or gym wear.',
    tag: 'CLOSE-BODY MOBILITY',
    stat: 'Everywhere',
    statLabel: 'Pocket & Travel Ready',
  },
  {
    icon: Microscope,
    title: 'Clinically Backed',
    subtitle: 'University Human Trials (UTAR)',
    desc: 'Validated by human clinical trials demonstrating measurable biological improvements in cellular health in just 3 days.',
    tag: 'PEER-VALIDATED',
    stat: '3 Days',
    statLabel: 'Measurable Biological Results',
  },
  {
    icon: ShieldCheck,
    title: 'Strong Coverage',
    subtitle: 'Powerful Harmonic Field',
    desc: 'Emits a stable, consistent personal protective zone that suppresses environmental high-frequency electrosmog noise.',
    tag: 'CONTINUOUS ENVELOPE',
    stat: '360°',
    statLabel: 'Close-Body Protective Field',
  },
  {
    icon: Award,
    title: 'Patented Technology',
    subtitle: 'US Patent US-12539416',
    desc: 'Proprietary harmonic resonance circuit engineered to harmonize electrosmog radiation without disrupting device connectivity.',
    tag: 'US-12539416',
    stat: 'Patented',
    statLabel: 'Harmonic Technology',
  },
  {
    icon: BatteryCharging,
    title: 'Up to 72 Hours',
    subtitle: 'Certified Lithium Battery',
    desc: 'Certified high-capacity lithium battery providing long-lasting, multi-day silent defense on a single USB charge.',
    tag: 'LONG-LASTING POWER',
    stat: 'Up to 72h',
    statLabel: 'Continuous Battery Life',
  },
]

const UTAR_CLINICAL_STUDIES = [
  {
    metric: '50.7%',
    change: 'REDUCTION',
    title: 'Blood Cell Aggregation (Rouleaux Formation)',
    subtitle: 'Figura 2.1 Pre-intervención vs Figura 2.2 Post-intervención',
    desc: 'Significant reduction in clustered red blood cells, promoting smoother circulation, improved microvascular blood flow, and optimal cellular oxygen delivery.',
    icon: HeartPulse,
    color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
  },
  {
    metric: '70.3%',
    change: 'IMPROVEMENT',
    title: 'Improvement in EHS Symptoms',
    subtitle: 'Electromagnetic Hypersensitivity Syndrome',
    desc: '70.3% of individuals suffering from electromagnetic hypersensitivity reported noticeable symptom relief from fatigue, brain fog, and electromagnetic radiation stress.',
    icon: UserCheck,
    color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
  },
  {
    metric: '59.5%',
    change: 'INCREASE',
    title: 'Elevation in Serotonin Levels',
    subtitle: 'Neurotransmitter & Mood Regulation',
    desc: 'Demonstrated a 59.5% increase in serotonin, directly supporting mood stability, deeper sleep cycles, appetite regulation, and balanced cognitive performance.',
    icon: Brain,
    color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
  },
  {
    metric: '42.5%',
    change: 'REDUCTION',
    title: 'Heat Shock Protein (HSP-27) Reduction',
    subtitle: 'Cellular Stress Biomarker',
    desc: 'Measurable 42.5% decrease in HSP-27, a key stress protein released by cells in response to physiological strain, heat shock, and environmental oxidative stress.',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
  },
]

const FAQS = [
  {
    q: 'What is The Enagic emGuarde™ and how does it protect the body?',
    a: 'The Enagic emGuarde™ is your close-body personal protection device designed for continuous protection in high electrosmog environments. Powered by patented US technology (US-12539416), it harmonizes environmental electromagnetic noise to support biological balance and well-being.',
  },
  {
    q: 'What university clinical research backs emGuarde?',
    a: 'emGuarde has been evaluated in human clinical trials conducted by Universiti Tunku Abdul Rahman (UTAR), demonstrating a 50.7% reduction in blood cell aggregation, a 70.3% improvement in EHS symptoms, a 59.5% increase in serotonin levels, and a 42.5% reduction in cellular stress protein (HSP-27) within 3 days.',
  },
  {
    q: 'Does emGuarde interfere with Wi-Fi, phone reception, or Bluetooth?',
    a: 'No. emGuarde harmonizes the ambient electrosmog noise affecting human biology without blocking or degrading wireless signals. Your smartphones, laptops, and Wi-Fi networks continue to function at full signal and speed.',
  },
  {
    q: 'How long does the battery last on the personal emGuarde?',
    a: 'The personal emGuarde is equipped with a certified lithium battery that delivers up to 72 hours of continuous close-body protection on a single charge.',
  },
  {
    q: 'How does emGuarde pair with Kangen Water in the True Legacy Duo?',
    a: 'True Legacy advocates a complete 360° wellness standard: The Enagic emGuarde™ provides external close-body environmental defense against electrosmog, while Enagic Kangen Water provides internal cellular hydration and antioxidant protection.',
  },
]

export function EmguardeLandingPage({ profile: propProfile, distributorSlug }: EmguardeLandingPageProps) {
  const { locale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedVideoLang, setSelectedVideoLang] = useState<'en' | 'es'>(locale === 'es' ? 'es' : 'en')

  const effectiveSlug = distributorSlug || profile?.slug || 'mehdi-cohen'

  useEffect(() => {
    setSelectedVideoLang(locale === 'es' ? 'es' : 'en')
  }, [locale])

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
      return
    }
    getPublicDistributors().then((items) => {
      const match = items.find((item) => item.slug === effectiveSlug)
      setProfile(match || items[0] || null)
    })
  }, [effectiveSlug, propProfile])

  const distributorName = profile?.display_name || 'True Legacy Leader'
  const leaderAvatar = profile?.avatar_url || (profile?.slug ? getLeaderPortrait(profile.slug) : '/logos/tl-square-white.png')

  const rawVideoUrl = PRODUCT_VIDEOS.emguardeGo[selectedVideoLang]
  const embedVideoUrl = useMemo(() => toEmbedUrl(rawVideoUrl), [rawVideoUrl])

  const applyUrl = `/apply?ref=${profile?.referral_code || effectiveSlug}&interest=duo&source=emguarde`
  const duoUrl = `/d/${effectiveSlug}/duo`

  const whatsappNumber = profile?.phone?.replace(/\D/g, '') || ''
  const whatsappMsg = encodeURIComponent(
    `Hi ${distributorName}, I'm reviewing The Enagic emGuarde page on True Legacy and would love to ask you some questions about availability and personal protection package options.`
  )
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMsg}` : null

  return (
    <div className="page-wrapper min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`The Enagic emGuarde™ · Close-Body Personal Protection Device · ${distributorName}`}
        description="Discover The Enagic emGuarde™: Your close-body personal protection device designed for continuous body protection in high electrosmog environments. Patented US-12539416, clinically backed by UTAR university research."
      />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <TrueLegacyLogo className="h-7 w-auto text-white" />
            <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-violet-300">
              ENAGIC emGuarde™
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            )}
            <Link
              to={applyUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90 px-4 py-1.5 text-xs font-black text-slate-950 transition-all shadow-md shadow-violet-500/20"
            >
              Request Info <Send className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:pt-20 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-violet-300 mb-6">
            <Radio className="h-3.5 w-3.5" /> The Enagic emGuarde™ · US Patent US-12539416
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]">
            Your Close-Body Personal <br />
            <span className="bg-gradient-to-r from-violet-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              Protection Device.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#cccccc] leading-relaxed">
            Designed for continuous body protection in a high electrosmog polluted environment. Invisible protection. Real benefits. Silent, elegant, and powerful.
          </p>

          {/* Core Benefit Badges Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
              <ShieldCheck className="h-4 w-4 text-violet-400" /> Harmonizes Your Environment
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
              <HeartPulse className="h-4 w-4 text-cyan-400" /> Supports Your Well-Being
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
              <Smartphone className="h-4 w-4 text-emerald-400" /> Goes With You Everywhere
            </span>
          </div>

          {/* Distributor Personal Introduction Card */}
          {profile && (
            <div className="mt-8 mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl text-left flex items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={leaderAvatar}
                  alt={distributorName}
                  className="h-12 w-12 rounded-full object-cover border border-violet-400/40 shrink-0 bg-black"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-violet-400">Personal Presentation Shared By</p>
                  <p className="font-bold text-white text-sm sm:text-base truncate">{distributorName}</p>
                  <p className="text-[11px] text-[#86868b] truncate">{profile.title || 'Verified True Legacy Leader'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                    aria-label="WhatsApp Message"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
                <Link
                  to={applyUrl}
                  className="inline-flex items-center gap-1 rounded-xl bg-violet-500 hover:bg-violet-400 px-3.5 py-2 text-xs font-black text-slate-950 transition-colors shadow-md"
                >
                  Connect
                </Link>
              </div>
            </div>
          )}

          {/* VIDEO PRESENTATION SECTION WITH LANGUAGE SELECTOR */}
          <div className="mt-12 sm:mt-16 mx-auto max-w-4xl rounded-3xl border border-violet-500/25 bg-gradient-to-b from-[#100d1e] to-[#080712] p-4 sm:p-6 shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                  Featured Technology Demonstration
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-2">The Enagic emGuarde™ in Action</h3>
                <p className="text-xs text-[#86868b]">Full product demonstration: patented harmonic resonance, lab validation, and close-body protection.</p>
              </div>

              {/* Language Selector Buttons */}
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedVideoLang('en')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedVideoLang === 'en'
                      ? 'bg-violet-500 text-white font-black shadow-md'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  <Globe2 className="h-3.5 w-3.5" /> English (~8m)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVideoLang('es')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedVideoLang === 'es'
                      ? 'bg-violet-500 text-white font-black shadow-md'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  <Globe2 className="h-3.5 w-3.5" /> Español (~8m)
                </button>
              </div>
            </div>

            {/* 16:9 Video Embed */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  key={embedVideoUrl}
                  src={embedVideoUrl}
                  title="The Enagic emGuarde Technology Presentation"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-[#86868b]">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <PlayCircle className="h-4 w-4 text-violet-400" /> Complete Enagic emGuarde™ Technology & Science Overview
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-violet-400" /> Watch time: ~8 minutes
              </span>
            </div>
          </div>
        </section>

        {/* 5 CORE PRODUCT PILLARS (IMAGE 1) */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">Engineered for Daily Life</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">5 Core Pillars of The Enagic emGuarde™</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Live in harmony. Protect yourself. Perform at your best with silent, elegant, and personal defense against modern electrosmog.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {FIVE_FEATURE_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl flex flex-col justify-between hover:border-violet-400/30 transition-all shadow-xl group text-center"
                >
                  <div>
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-400/10 border border-violet-400/30 text-violet-300 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="mt-4 inline-block rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-violet-300">
                      {pillar.tag}
                    </span>
                    <h3 className="mt-2 text-base font-black text-white">{pillar.title}</h3>
                    <p className="text-[11px] font-bold text-violet-400">{pillar.subtitle}</p>
                    <p className="mt-2 text-xs text-[#cccccc] leading-relaxed">{pillar.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10">
                    <p className="text-lg font-black text-violet-300">{pillar.stat}</p>
                    <p className="text-[9px] font-black uppercase tracking-wider text-[#86868b]">{pillar.statLabel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* UNIVERSITY-LED CLINICAL RESEARCH: UTAR (IMAGE 2) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-widest text-cyan-300 mb-3">
              <Microscope className="h-3.5 w-3.5" /> Universiti Tunku Abdul Rahman (UTAR)
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Investigación Clínica Liderada por la Universidad
            </h2>
            <p className="mt-2 text-sm sm:text-base text-cyan-300 font-semibold">
              Pruebas reales en humanos. Cambios biológicos medibles en solo 3 días.
            </p>
            <p className="mt-2 text-xs text-[#86868b] max-w-2xl mx-auto font-mono">
              Síndrome de Hipersensibilidad Electromagnética (EHS): Eficacia del dispositivo portátil emGuarde en la protección de adultos.
            </p>
          </div>

          {/* 4 Clinical Result Cards from Image 2 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {UTAR_CLINICAL_STUDIES.map((study, idx) => {
              const Icon = study.icon
              return (
                <div
                  key={idx}
                  className={`rounded-3xl border ${study.color} bg-gradient-to-b p-6 backdrop-blur-xl flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-transform`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                        {study.metric}
                      </span>
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 border border-white/15">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-2">
                      {study.change}
                    </span>
                    <h3 className="text-base font-black text-white leading-snug">{study.title}</h3>
                    <p className="text-[11px] font-semibold text-white/70 mt-1">{study.subtitle}</p>
                    <p className="mt-3 text-xs text-[#cbd5e1] leading-relaxed">{study.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 text-[10px] text-white/60">
                    Estudio Clínico UTAR
                  </div>
                </div>
              )
            })}
          </div>

          {/* Microcirculation Live Blood Callout Banner */}
          <div className="mt-10 rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Microcirculación & Oxigenación Celular</span>
              <h4 className="text-lg font-black text-white">Favorece una circulación más fluida y el suministro de oxígeno</h4>
              <p className="text-xs text-[#cccccc] max-w-2xl">
                Al reducir la agregación de glóbulos rojos (efecto Rouleaux), las células sanguíneas fluyen libremente, optimizando la oxigenación y reduciendo la carga de estrés oxidativo en todo el organismo.
              </p>
            </div>
            <Link
              to={applyUrl}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-black text-slate-950 transition-colors shadow-md"
            >
              Consultar Disponibilidad <Send className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* BRIDGE TO THE DUO PACKAGE */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-black to-violet-950/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> 360° Environmental Wellness Standard
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white max-w-2xl mx-auto">
              Harmonize Your Environment. <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                Hydrate Your Cells from Within.
              </span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
              The Enagic emGuarde™ protects your external field, but your body is over 70% water. Discover the <strong>True Legacy Duo</strong> pairing The Enagic emGuarde™ with the medical-grade <strong>Enagic Leveluk K8</strong> hydrogen water ionizer.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={duoUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-xs font-black text-black hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
              >
                Explore The Duo Technologies <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                to={applyUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-white transition-colors"
              >
                Request emGuarde Package Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-bold text-white text-sm sm:text-base">{faq.q}</span>
                    <span className={`grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-[#86868b] transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#cccccc] leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 text-center">
          <div className="rounded-3xl border border-violet-400/30 bg-black/60 p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Live in Harmony. Perform at Your Best.</h2>
            <p className="mt-3 text-xs sm:text-sm text-[#cccccc] max-w-xl mx-auto">
              Connect directly with <strong>{distributorName}</strong> to check Enagic emGuarde™ availability, personal protection packages, and worldwide delivery.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={applyUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90 px-8 py-3.5 text-sm font-black text-slate-950 transition-all shadow-lg shadow-violet-500/25"
              >
                Request emGuarde Consultation <Send className="h-4 w-4" />
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-6 py-3.5 text-sm font-bold text-emerald-300 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
