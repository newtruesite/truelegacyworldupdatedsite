import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { DuoLandingPage } from '@/components/duo/DuoLandingPage'
import { BusinessLandingPage } from '@/components/business/BusinessLandingPage'
import { AcademyLandingPage } from '@/components/academy/AcademyLandingPage'
import { KangenLandingPage } from '@/components/kangen/KangenLandingPage'
import { EmguardeLandingPage } from '@/components/emguarde/EmguardeLandingPage'
import { crmSupabase, getPublicDistributors, getLeaderPortrait } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { localizedProductVideo } from '@/lib/productVideos'
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Droplets,
  Instagram,
  MessageCircle,
  PlayCircle,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

type LandingVariant = 'business' | 'duo' | 'training' | 'events' | 'kangen' | 'water' | 'emguarde'

const VARIANTS: Record<LandingVariant, {
  eyebrow: string
  headline: (name: string) => string
  subheadline: string
  interest: 'distributor' | 'duo' | 'training' | 'events' | 'product'
  icon: typeof BriefcaseBusiness
}> = {
  business: {
    eyebrow: 'A personalized True Legacy presentation',
    headline: (name) => `Build with purpose alongside ${name}`,
    subheadline: 'Discover a product-based independent business built around education, leadership, duplication, and long-term community support.',
    interest: 'distributor',
    icon: BriefcaseBusiness,
  },
  duo: {
    eyebrow: 'Two technologies · One personalized introduction',
    headline: (name) => `Explore the Duo with ${name}`,
    subheadline: 'Learn about the Leveluk K8 Kangen Water system and the portable emGuarde GO set, then connect directly with the distributor who shared this page.',
    interest: 'duo',
    icon: Sparkles,
  },
  kangen: {
    eyebrow: 'Enagic® Japanese Medical Ionization',
    headline: (name) => `Discover Kangen Water® with ${name}`,
    subheadline: 'Explore 50 years of Japanese engineering, active molecular hydrogen (H2) hydration, negative ORP antioxidant power, and the Leveluk K8.',
    interest: 'product',
    icon: Droplets,
  },
  water: {
    eyebrow: 'Enagic® Japanese Medical Ionization',
    headline: (name) => `Discover Kangen Water® with ${name}`,
    subheadline: 'Explore 50 years of Japanese engineering, active molecular hydrogen (H2) hydration, negative ORP antioxidant power, and the Leveluk K8.',
    interest: 'product',
    icon: Droplets,
  },
  emguarde: {
    eyebrow: 'Patented 5G & EMF Harmonization',
    headline: (name) => `Harmonize Your Environment with ${name}`,
    subheadline: 'Learn how emGuarde suppresses high-frequency electromagnetic radiation noise up to 3.6GHz+ across a 4-meter radius without blocking wireless signals.',
    interest: 'duo',
    icon: Radio,
  },
  training: {
    eyebrow: 'True Legacy Leadership Academy',
    headline: (name) => `Train, grow, and build with ${name}`,
    subheadline: 'See how True Legacy supports independent distributors with product education, leadership development, practical systems, and a global learning community.',
    interest: 'training',
    icon: BookOpen,
  },
  events: {
    eyebrow: 'Weekly True Legacy live events',
    headline: (name) => `Join a live presentation with ${name}`,
    subheadline: 'Meet the community, learn about the products and independent distributor opportunity, and ask questions during a live weekly call.',
    interest: 'events',
    icon: CalendarDays,
  },
}

const BENEFITS: Record<LandingVariant, string[]> = {
  business: ['A product-centered independent business', 'A simple system designed for duplication', 'Weekly education and leadership support', 'A global team with local distributor attribution'],
  duo: ['Kangen Water education centered on the Leveluk K8', 'Portable emGuarde GO product education', 'Two separate product videos below', 'Market availability confirmed with your distributor'],
  kangen: ['Leveluk K8 8-plate medical-grade ionization', 'Molecular Hydrogen (H2) cellular antioxidant power', '5 distinct water types for home and health', 'Direct consultation and machine pricing'],
  water: ['Leveluk K8 8-plate medical-grade ionization', 'Molecular Hydrogen (H2) cellular antioxidant power', '5 distinct water types for home and health', 'Direct consultation and machine pricing'],
  emguarde: ['Patented harmonic resonance noise suppression', '4-meter radius 360° environmental protection', 'Zero interference with Wi-Fi, phone, or Bluetooth', 'Portable USB-C powered emGuarde GO edition'],
  training: ['A structured training library', 'Product and presentation education', 'Weekly English and Spanish team calls', 'Leadership, media, and follow-up development'],
  events: ['Live product and business education', 'Open to members, prospects, and guests', 'English and Spanish weekly options', 'Direct follow-up with your referring distributor'],
}

const MEHDI_EVENT_PAGES = [
  {
    id: 'global',
    language: 'English',
    micro: 'Upcoming Live Event',
    headline: 'Unlock Your True Legacy',
    subheadline: 'Live Zoom Presentation',
    date: 'Every Wednesday',
    time: '8:30 PM Eastern / 5:30 PM Pacific',
    meetingId: '885 7773 4807',
    passcode: 'Truelegacy',
    image: '/assets/mehdicohen-global-weekly.png',
    imageAlt: 'True Legacy World Wednesday weekly presentation featuring the K8 and emGuarde GO',
    zoomUrl: 'https://us06web.zoom.us/j/88577734807?pwd=C02Pr5lK6HEYyXsXiBo1wqAS7ZcVLV.1',
    description: 'A direct, no-pressure introduction to the K8, emGuarde GO, and the team-based independent distributor model behind True Legacy.',
    topics: ['Product education for the K8 and emGuarde GO', 'An introduction to the independent distributor model', 'Leadership, community, and building beyond borders', 'Live questions with True Legacy team leaders'],
  },
  {
    id: 'latam',
    language: 'Español',
    micro: 'Evento en Vivo',
    headline: 'La Revolución del Biohacking Llega a LATAM',
    subheadline: 'Presentación en Vivo por Zoom',
    date: 'Cada jueves',
    time: '7:00 PM Colombia / 8:00 PM Eastern',
    meetingId: '848 5224 4046',
    passcode: 'Truelegacy',
    image: '/assets/mehdicohen-latam-weekly.png',
    imageAlt: 'Presentación semanal de True Legacy LATAM los jueves',
    zoomUrl: 'https://us06web.zoom.us/j/84852244046?pwd=Ci7k3oLkcaBa5odDvrw6O9fokzXbK8.1',
    description: 'Una conversación directa y sin presión sobre bienestar, tecnología y una oportunidad global pensada para LATAM.',
    topics: ['La tecnología de biohacking que está revolucionando el mercado', 'Una introducción clara al modelo de negocio y sus comisiones', 'Cómo comenzar sin experiencia previa', 'Primeros pasos para iniciar un negocio global desde casa'],
  },
] as const

const LEADER_PORTRAITS: Record<string, string> = {
  'mehdi-cohen': '/leaders/standardized/mehdi-cohen.png',
  'simon-loh': '/leaders/standardized/simon-loh-v2.png',
  'ming-way-sia': '/leaders/standardized/ming-way-sia.png',
  'zah-naderi': '/leaders/standardized/zah-naderi-v3.png',
  'alex-gonzalez': '/leaders/standardized/alex-gonzalez.png',
  'ryan-pool': '/leaders/standardized/ryan-pool-sr.png',
  'magaly-cardona': '/leaders/standardized/magaly-cardona.png',
  emanuela: '/leaders/standardized/emanuela-doustova.png',
  'jesse-schexnayder': '/leaders/standardized/jesse-schexnayder.png',
  'angel-mok': '/leaders/standardized/angel-mok-v2.png',
}

function whatsappUrl(profile: PublicDistributor, variant: LandingVariant): string | null {
  if (!profile.phone) return null
  const number = profile.phone.replace(/\D/g, '')
  if (!number) return null
  const text = encodeURIComponent(`Hi ${profile.display_name}, I'm reviewing your True Legacy page (${variant}) and would like more information.`)
  return `https://wa.me/${number}?text=${text}`
}

export default function DistributorLandingPage() {
  const { slug, campaign } = useParams<{ slug: string; campaign: string }>()
  const { locale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(undefined)
  const [copied, setCopied] = useState(false)
  const variant = campaign && campaign in VARIANTS ? (campaign as LandingVariant) : null

  useEffect(() => {
    let active = true
    const loadProfile = () => {
      getPublicDistributors().then((items) => {
        if (!active) return
        setProfile(items.find((item) => item.slug === slug) || null)
      })
    }
    loadProfile()
    window.addEventListener('truelegacy:leader-portrait-updated', loadProfile)
    return () => {
      active = false
      window.removeEventListener('truelegacy:leader-portrait-updated', loadProfile)
    }
  }, [slug])

  useEffect(() => {
    if (!profile || !variant || !crmSupabase) return
    void crmSupabase.rpc('crm_track_share_click', { p_slug: profile.slug, p_campaign: variant, p_locale: locale })
  }, [profile, variant, locale])

  const shareUrl = typeof window === 'undefined' ? '' : window.location.href
  const share = async () => {
    if (navigator.share) {
      await navigator
        .share({
          title: profile ? `Connect with ${profile.display_name} | True Legacy` : 'True Legacy',
          url: shareUrl,
        })
        .catch(() => undefined)
      return
    }
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const copy = useMemo(() => (variant ? VARIANTS[variant] : null), [variant])
  if (!variant || profile === null) return <NotFoundPage />

  if (variant === 'duo') {
    return <DuoLandingPage profile={profile} distributorSlug={slug} />
  }

  if (variant === 'kangen' || variant === 'water') {
    return <KangenLandingPage profile={profile} distributorSlug={slug} />
  }

  if (variant === 'emguarde') {
    return <EmguardeLandingPage profile={profile} distributorSlug={slug} />
  }

  if (variant === 'business') {
    return <BusinessLandingPage profile={profile} distributorSlug={slug} />
  }

  if (variant === 'training') {
    return <AcademyLandingPage profile={profile || null} distributorSlug={slug} />
  }

  const leaderPhoto =
    profile?.avatar_url ||
    (profile?.slug && getLeaderPortrait(profile.slug, LEADER_PORTRAITS[profile.slug])) ||
    '/logos/tl-square-white.png'
  const Icon = copy?.icon || Sparkles
  const applyUrl = `/apply?ref=${profile?.referral_code || slug}&interest=${copy?.interest || 'duo'}&source=${variant}`
  const whatsapp = profile ? whatsappUrl(profile, variant) : null
  const waterDemoUrl = localizedProductVideo('kangenWater', locale)
  const emguardeDemoUrl = localizedProductVideo('emguardeGo', locale)

  return (
    <div className="page-wrapper bg-black text-white">
      <SEO
        title={`${copy?.headline(profile?.display_name || 'Your Guide') || 'True Legacy'} | True Legacy`}
        description={copy?.subheadline || 'True Legacy personalized product and business presentation.'}
        image={leaderPhoto}
      />
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-24 pb-20 sm:px-6 md:pt-32">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[.07] to-white/[.02] p-6 text-center sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#2997ff]">
            <Icon className="h-3.5 w-3.5" />
            {copy?.eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            {copy?.headline(profile?.display_name || 'Your Guide')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#c9ced7] sm:text-base">
            {copy?.subheadline}
          </p>

          {profile ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 text-left">
              <div className="flex items-center gap-3">
                <img
                  src={leaderPhoto}
                  alt={profile.display_name}
                  className="h-12 w-12 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#868c98]">Your Verified Guide</p>
                  <p className="font-bold text-white text-sm sm:text-base">{profile.display_name}</p>
                  <p className="text-xs text-[#2997ff]">{profile.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={share}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  {copied ? <Check className="h-5 w-5 text-[#2997ff]" /> : <Copy className="h-5 w-5 text-white" />}
                </button>
              </div>
            </div>
          ) : null}
        </header>

        {variant === 'events' ? (
          <section className="mt-12 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black">Live Presentation Schedule</h2>
              <p className="mt-2 text-sm text-[#868c98]">
                Join one of our weekly Zoom calls to meet the leadership team and get your questions answered live.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {MEHDI_EVENT_PAGES.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.02] flex flex-col justify-between"
                >
                  <div>
                    <img src={event.image} alt={event.imageAlt} className="aspect-video w-full object-cover" />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-cyan-400/10 border border-cyan-400/20 px-3 py-0.5 text-xs font-bold text-[#2997ff]">
                          {event.language} · {event.micro}
                        </span>
                        <span className="text-xs text-[#868c98]">{event.date}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-black">{event.headline}</h3>
                      <p className="mt-1 text-xs text-[#2997ff] font-bold">{event.time}</p>
                      <p className="mt-3 text-xs leading-relaxed text-[#c9ced7]">{event.description}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <a
                      href={event.zoomUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-xs font-black text-slate-950 hover:bg-cyan-300 transition-colors"
                    >
                      Join Zoom Meeting <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <div className="rounded-3xl border border-white/10 bg-white/[.02] p-8 text-center sm:p-12">
            <h2 className="text-2xl font-black sm:text-3xl">Take the Next Step</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#868c98]">
              Ready to learn more or speak directly with {profile?.display_name || 'your guide'}? Submit a short request
              and we will connect with you shortly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={applyUrl}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-8 text-sm font-black text-slate-950 hover:bg-cyan-300 transition-colors"
              >
                Send Request <ArrowRight className="h-4 w-4" />
              </Link>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 text-sm font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" /> Message on WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
