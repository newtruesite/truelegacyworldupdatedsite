import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  ExternalLink,
  Globe2,
  HeartPulse,
  Info,
  Layers,
  MessageCircle,
  PlayCircle,
  Radio,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
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

const TECH_PILLARS = [
  {
    icon: Radio,
    title: 'Harmonic Resonance Noise Suppression',
    subtitle: 'Suppresses Frequencies Up to 3.6GHz+',
    description:
      'emGuarde generates a patented harmonic scalar field that specifically suppresses high-frequency electromagnetic noise radiation caused by 5G, Wi-Fi 6, smart meters, and Bluetooth devices.',
    stat: '3.6 GHz+',
    statLabel: 'Targeted Noise Suppression Range',
  },
  {
    icon: ShieldCheck,
    title: '4-Meter Radius 360° Protective Bubble',
    subtitle: '8-Meter Total Coverage Diameter',
    description:
      'Creates a continuous protective micro-environment in your bedroom, office, vehicle, or living room, harmonizing biological electromagnetic disruption for everyone inside the field.',
    stat: '4 Meters',
    statLabel: 'Active Spherical Radius (8m Diameter)',
  },
  {
    icon: Wifi,
    title: 'Zero Interference with Connectivity',
    subtitle: '100% Full Wireless Speed & Signals',
    description:
      'Unlike crude Faraday cages or passive blockers, emGuarde harmonizes radiation noise frequencies without blocking your phone calls, internet speed, Bluetooth pairing, or Wi-Fi strength.',
    stat: '100%',
    statLabel: 'Wireless Transmission Signal Preserved',
  },
]

const BLOOD_ANALYSIS_POINTS = [
  {
    title: 'Before emGuarde Exposure (High EMF Stress)',
    desc: 'Darkfield live blood microscopy shows red blood cells stacked tightly together (Rouleaux formation), severely reducing surface area, oxygen delivery, and microcirculation.',
    tag: 'ROULEAUX CELL AGGREGATION',
    color: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  },
  {
    title: 'After 30 Mins in emGuarde Field',
    desc: 'Red blood cells separate into buoyant, freely flowing single cells with restored negative zeta potential, optimizing oxygen delivery and nutrient absorption.',
    tag: 'RESTORED MICROCIRCULATION',
    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
]

const FAQS = [
  {
    q: 'How is emGuarde different from EMF stickers or passive pendants?',
    a: 'Passive stickers and magnetic pendants lack active power and cannot neutralize high-frequency 5G/Wi-Fi radiation fields. emGuarde is an active, powered device with patented harmonic resonance circuitry tested by accredited independent laboratories.',
  },
  {
    q: 'Does emGuarde interfere with Wi-Fi speed, cell reception, or Bluetooth?',
    a: 'No. emGuarde is specifically engineered to neutralize biological noise frequencies without absorbing or reflecting the communication signal frequencies. Your devices will operate at peak speed and signal strength.',
  },
  {
    q: 'What is emGuarde GO and how is it powered?',
    a: 'emGuarde GO is the portable travel version. Powered by standard USB-C, it easily plugs into your car, laptop, power bank, or hotel outlet to maintain a 4-meter harmonized environment wherever you go.',
  },
  {
    q: 'How does emGuarde pair with Kangen Water in the True Legacy Duo?',
    a: 'True Legacy designed the Duo Package to create 360° wellness: Kangen Water provides internal cellular hydration and antioxidant defense, while emGuarde harmonizes your external electromagnetic environment.',
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
    `Hi ${distributorName}, I'm reviewing the emGuarde GO EMF defense page on True Legacy and would love to ask you some questions about availability and package options.`
  )
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMsg}` : null

  return (
    <div className="page-wrapper min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`emGuarde® & emGuarde GO · Patented 5G & EMF Harmonization · ${distributorName}`}
        description="Discover the patented harmonic resonance technology of emGuarde and emGuarde GO. Suppress high-frequency EMF radiation noise up to 3.6GHz across a 4-meter radius without blocking wireless signals."
      />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <TrueLegacyLogo className="h-7 w-auto text-white" />
            <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-violet-300">
              EMGUARDE®
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
            <Radio className="h-3.5 w-3.5" /> Patented Harmonic EMF Defense
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]">
            Silent Environmental Defense. <br />
            <span className="bg-gradient-to-r from-violet-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              Harmonized Living in a 5G World.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#cccccc] leading-relaxed">
            We are surrounded by continuous high-frequency electromagnetic radiation from 5G towers, Wi-Fi 6 routers, electric vehicles, and smartphones. emGuarde suppresses radiation noise across a 4-meter radius without interfering with your signals.
          </p>

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
                <h3 className="text-lg sm:text-xl font-black text-white mt-2">emGuarde GO Environmental Defense</h3>
                <p className="text-xs text-[#86868b]">Comprehensive lab testing: signal attenuation, oscilloscope analysis, and live blood cells.</p>
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
                  title="emGuarde GO Technology Presentation"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-[#86868b]">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <PlayCircle className="h-4 w-4 text-violet-400" /> Complete emGuarde GO Patented Harmonic Resonance Overview
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-violet-400" /> Watch time: ~8 minutes
              </span>
            </div>
          </div>
        </section>

        {/* 3 CORE TECHNOLOGY PILLARS */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">Patented Innovation</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">How Harmonic Resonance Works</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Rather than attempting to block signals or wearing ineffective passive stickers, emGuarde actively suppresses harmful high-frequency noise frequencies.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TECH_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-violet-400/30 transition-all shadow-xl group"
                >
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-400/10 border border-violet-400/30 text-violet-300 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-black text-white">{pillar.title}</h3>
                    <p className="text-xs font-bold text-violet-400 mt-1">{pillar.subtitle}</p>
                    <p className="mt-3 text-xs text-[#cccccc] leading-relaxed">{pillar.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-2xl font-black text-violet-300">{pillar.stat}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#86868b]">{pillar.statLabel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* LIVE BLOOD CELL & MICROCIRCULATION ANALYSIS */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">Biological Impact</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">Live Blood Cell Analysis</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              See the documented microcirculation response when human blood is exposed to typical EMF environments vs. an active emGuarde harmonized field.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {BLOOD_ANALYSIS_POINTS.map((pt, idx) => (
              <div key={idx} className={`rounded-3xl border ${pt.color} p-6 sm:p-8 backdrop-blur-xl`}>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider mb-4">
                  <Activity className="h-3.5 w-3.5" /> {pt.tag}
                </div>
                <h3 className="text-xl font-black text-white">{pt.title}</h3>
                <p className="mt-3 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>

          {/* Laboratory Testing Badges */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/60 p-6 flex flex-wrap items-center justify-around gap-6 text-center">
            <div>
              <p className="text-lg font-black text-white">SIRIM QAS</p>
              <p className="text-[10px] text-[#86868b] uppercase tracking-wider">International Testing</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">TÜV SÜD</p>
              <p className="text-[10px] text-[#86868b] uppercase tracking-wider">EMC Certified</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">CE & FCC</p>
              <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Global Standards</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">C-TICK</p>
              <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Radiation Compliance</p>
            </div>
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
              emGuarde GO protects your external field, but your body is over 70% water. Discover the <strong>True Legacy Duo</strong> pairing emGuarde GO with the medical-grade <strong>Enagic Leveluk K8</strong> hydrogen water ionizer.
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
            <h2 className="text-2xl sm:text-4xl font-black text-white">Ready to Harmonize Your Environment?</h2>
            <p className="mt-3 text-xs sm:text-sm text-[#cccccc] max-w-xl mx-auto">
              Connect directly with <strong>{distributorName}</strong> to check emGuarde GO market availability, bundle pricing, and worldwide delivery.
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
