import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Filter,
  MessageCircle,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Star,
  Waves,
  Wrench,
  Zap,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { DistributorBuyButton } from '@/components/products/DistributorBuyButton'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { getLeaderPortrait, getPublicDistributors, submitCrmApplication, type PublicDistributor } from '@/lib/crm'

interface AnespaLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

const JOURNEY_STAGES = [
  {
    number: '01',
    label: 'TAP WATER IN',
    title: 'Ordinary Tap Water',
    body: 'Standard municipal water enters the system — carrying chlorine, rust sediment, and the chemical residue of city pipe networks.',
    icon: Droplets,
    accent: 'from-slate-600/30 to-slate-800/10',
    borderColor: 'border-slate-500/30',
    iconColor: 'text-slate-300',
  },
  {
    number: '02',
    label: 'CARBON FILTRATION',
    title: 'Active Carbon Purification',
    body: 'The external carbon filter removes chlorine, odor, rust, and pipe residue — delivering clean, odor-free water to the mineral stage.',
    icon: Filter,
    accent: 'from-amber-800/20 to-amber-900/10',
    borderColor: 'border-amber-600/30',
    iconColor: 'text-amber-400',
  },
  {
    number: '03',
    label: 'MINERAL IONIZATION',
    title: 'Hokkaido Mineral Infusion',
    body: 'Futamata Radium Tufa and Maifan mineral stones from Japan\'s most celebrated hot springs release natural mineral ions into the water.',
    icon: Sparkles,
    accent: 'from-stone-700/20 to-stone-900/10',
    borderColor: 'border-stone-500/30',
    iconColor: 'text-stone-300',
  },
  {
    number: '04',
    label: 'SPA EXPERIENCE',
    title: 'Your Private Onsen',
    body: 'Mineral-rich water flows through the massage shower head — gentle, fresh, and invigorating. Your bathroom becomes a Japanese hot spring.',
    icon: ShowerHead,
    accent: 'from-cyan-900/20 to-teal-900/10',
    borderColor: 'border-cyan-600/30',
    iconColor: 'text-cyan-300',
  },
]

export function AnespaLandingPage({ profile: propProfile, distributorSlug }: AnespaLandingPageProps) {
  const [profile, setProfile] = useState<PublicDistributor | null>(propProfile || null)
  const [loadingProfile, setLoadingProfile] = useState(!propProfile)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [activeStage, setActiveStage] = useState(0)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('United States')

  const activeSlug = distributorSlug || 'mehdi-cohen'

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
      setLoadingProfile(false)
      return
    }
    getPublicDistributors()
      .then((distributors) => {
        const found =
          distributors.find((d) => d.slug.toLowerCase() === activeSlug.toLowerCase()) ||
          distributors.find((d) => d.slug === 'mehdi-cohen') ||
          distributors[0]
        setProfile(found || null)
      })
      .finally(() => setLoadingProfile(false))
  }, [propProfile, activeSlug])

  const portraitUrl = useMemo(() => {
    return (
      (profile?.avatar_url && !profile.avatar_url.includes('mehdi-cohen') ? profile.avatar_url : null) ||
      getLeaderPortrait(profile?.slug || activeSlug, profile?.avatar_url) ||
      '/logos/tl-square-white.png'
    )
  }, [profile, activeSlug])

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Please enter your full name.')
      return
    }

    if (!email.trim() && !phone.trim()) {
      setFormError('Please provide an email address or phone number.')
      return
    }

    setSubmitting(true)
    try {
      await submitCrmApplication({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        country: country.trim(),
        interest: 'product',
        selectedDistributor: profile?.slug || 'mehdi-cohen',
        hasReferrer: true,
        sourcePath: typeof window !== 'undefined' ? window.location.pathname : '/anespa',
        consent: true,
        privacyVersion: '2026-08-phase-1',
        referredBy: profile?.display_name || 'True Legacy Leader',
      })
      setFormSuccess(true)
    } catch {
      setFormError('Unable to submit request right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0b09] text-white selection:bg-amber-400 selection:text-black">
      <SEO
        title="Anespa® DX Mineral Ion Water Spa | True Legacy"
        description="Turn every shower into a private Japanese onsen. Anespa® DX filters tap water and infuses natural Hokkaido mineral ions for a gentler, more restorative spa experience."
      />

      {/* ─────────────────────────────────────────────
          NAVIGATION HEADER
      ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0b09]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={profile?.slug ? `/d/${profile.slug}` : '/'}
              label={profile ? `Back to ${profile.display_name?.split(' ')[0] || 'Leader'}'s Profile` : 'Go back'}
            />
            <Link to="/" className="flex items-center gap-2 group">
              <TrueLegacyLogo />
              <span className="text-[10px] font-semibold text-amber-400/90 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
                Anespa® DX
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {profile && (
              <Link
                to={`/d/${profile.slug}`}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-2.5 py-1 transition-all group shrink-0"
                title={`Shared by ${profile.display_name}`}
              >
                <img
                  src={portraitUrl}
                  alt={profile.display_name}
                  className="w-6 h-6 rounded-full object-cover border border-amber-400/60 shrink-0 group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/logos/tl-square-white.png'
                  }}
                />
                <span className="hidden sm:inline text-xs font-bold text-white truncate max-w-[110px]">
                  {profile.display_name.split(' ')[0]}
                </span>
              </Link>
            )}

            <DistributorBuyButton profile={profile} productId="anespa_dx" label="Buy Now" compactOnMobile className="shrink-0" />
            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-600/20 px-3.5 py-2 text-xs font-bold text-amber-300 hover:border-amber-300 hover:from-amber-500/30 hover:to-orange-600/30 transition-all shadow-[0_0_20px_rgba(251,191,36,0.15)] active:scale-95"
            >
              Talk to Me
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          CINEMATIC HERO — Full Bleed Japanese Onsen
      ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img
            src="/true-legacy-assets/anespa-hero-onsen.jpg"
            alt="Japanese onsen private spa bath"
            className="h-full w-full object-cover object-center"
          />
          {/* Multi-layer cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b09]/90 via-[#0d0b09]/60 to-[#0d0b09]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/80 via-transparent to-[#0d0b09]/30" />
          {/* Warm amber tint overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(120,60,0,0.25)_0%,transparent_60%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:py-32">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-amber-300"
            >
              <Waves className="h-3.5 w-3.5" />
              MINERAL ION WATER SPA · ENAGIC®
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-7 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05]"
            >
              Turn Your Shower
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-stone-200 to-amber-400 bg-clip-text text-transparent">
                Into a Spa.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-stone-300 sm:text-xl"
            >
              Inspired by Japan's legendary hot springs, Anespa® DX filters your tap water and 
              infuses natural Hokkaido mineral ions — transforming your daily shower into a private onsen ritual.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollToSection('journey')}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-black text-black shadow-[0_10px_40px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-orange-400 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Discover the Journey
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-7 py-4 text-sm font-bold text-white hover:border-amber-400/50 hover:bg-white/[0.10] transition-all backdrop-blur-sm"
              >
                <MessageCircle className="h-4 w-4 text-amber-400" />
                Talk to Me
              </button>
            </motion.div>

            {/* Distributor Identity Badge */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-3.5 max-w-sm"
              >
                <img
                  src={portraitUrl}
                  alt={`${profile.display_name} profile avatar`}
                  className="h-12 w-12 rounded-xl object-cover border border-amber-400/30"
                />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Your Personal Spa Advisor</p>
                  <p className="text-sm font-black text-white">{profile.display_name}</p>
                  <p className="text-xs text-stone-400">{profile.title || 'Independent Enagic Distributor'}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="h-5 w-5 text-amber-400/70" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────
          VIDEO SECTION — Right After Hero
      ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-t border-white/[0.06] bg-[#0f0d0a]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">See It In Action</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">The Anespa® DX Experience</h2>
            <p className="mt-3 text-sm text-stone-400 max-w-xl mx-auto">
              Watch how Anespa® DX transforms ordinary tap water into mineral-rich spa water — right in your home.
            </p>
          </div>
          <YouTubeEmbed
            url="https://youtu.be/A2CbEilm3z8"
            title="Anespa DX Mineral Ion Water Spa Experience"
            className="aspect-video w-full shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10 rounded-2xl overflow-hidden"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          TRUST STRIP
      ───────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-[#100e0b]/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
            {[
              { icon: Star, text: 'Made in Japan' },
              { icon: ShieldCheck, text: '3-Year Warranty' },
              { icon: Sparkles, text: 'Hokkaido Mineral Ions' },
              { icon: Filter, text: 'Dual-Stage Filtration' },
              { icon: Waves, text: 'Onsen-Inspired Technology' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-amber-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          THE 4-STAGE TRANSFORMATION JOURNEY
      ───────────────────────────────────────────── */}
      <section id="journey" className="py-20 sm:py-32 bg-[#0d0b09]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">The Anespa® Journey</p>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl leading-tight">
              Tap Water In.
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-stone-300 bg-clip-text text-transparent">Onsen Out.</span>
            </h2>
            <p className="mt-5 text-base text-stone-400 max-w-2xl mx-auto leading-relaxed">
              Four precise stages transform ordinary tap water into mineral-enriched spa water — every single day.
            </p>
          </div>

          {/* Stage Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {JOURNEY_STAGES.map((stage, i) => (
              <button
                key={i}
                onClick={() => setActiveStage(i)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  activeStage === i
                    ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                    : 'border border-white/15 text-stone-400 hover:border-amber-400/40 hover:text-amber-300'
                }`}
              >
                {stage.number} · {stage.label}
              </button>
            ))}
          </div>

          {/* Active Stage Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className={`rounded-3xl border bg-gradient-to-br ${JOURNEY_STAGES[activeStage].accent} ${JOURNEY_STAGES[activeStage].borderColor} p-10 sm:p-14 text-center max-w-2xl mx-auto`}
            >
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${JOURNEY_STAGES[activeStage].borderColor} bg-white/[0.04] ${JOURNEY_STAGES[activeStage].iconColor}`}>
                {(() => {
                  const Icon = JOURNEY_STAGES[activeStage].icon
                  return <Icon className="h-8 w-8" />
                })()}
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-stone-400">
                Stage {JOURNEY_STAGES[activeStage].number}
              </p>
              <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                {JOURNEY_STAGES[activeStage].title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-stone-300 max-w-lg mx-auto">
                {JOURNEY_STAGES[activeStage].body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Full Journey Grid (always visible below) */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY_STAGES.map((stage, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveStage(i)}
                whileHover={{ y: -4 }}
                className={`cursor-pointer rounded-2xl border bg-gradient-to-br p-6 transition-all ${
                  activeStage === i
                    ? `${stage.borderColor} ${stage.accent} ring-1 ring-amber-400/30`
                    : 'border-white/10 bg-white/[0.025] hover:border-white/20'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stage.borderColor} bg-white/[0.04] ${stage.iconColor}`}>
                  {(() => {
                    const Icon = stage.icon
                    return <Icon className="h-5 w-5" />
                  })()}
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-stone-500">{stage.number}</p>
                <h4 className="mt-1 text-sm font-black text-white">{stage.title}</h4>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed line-clamp-2">{stage.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          PRODUCT SHOWCASE — Editorial Split Layout
      ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-32 border-t border-white/[0.06] bg-[#0f0d0a] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            {/* Product Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 relative"
            >
              {/* Shower Ritual Ambient Image */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
                <img
                  src="/true-legacy-assets/anespa-shower-ritual.jpg"
                  alt="Luxury spa shower with mineral water and steam"
                  className="w-full h-[500px] sm:h-[580px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Product Floating Card */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md p-4">
                    <img
                      src="/products/anespa-dx.png"
                      alt="Enagic Anespa DX unit"
                      className="h-20 w-auto object-contain drop-shadow-[0_8px_20px_rgba(245,158,11,0.3)]"
                    />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Enagic® Anespa® DX</p>
                      <h3 className="text-lg font-black text-white leading-tight">Mineral Ion Water Spa</h3>
                      <p className="text-xs text-stone-400 mt-0.5">Hokkaido Tufa · Maifan Stones · Active Carbon</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Editorial Copy Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">SOURCED FROM NATURE</p>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl leading-tight">
                Inspired by Japan's
                <br />
                <span className="text-stone-300">Most Sacred Springs.</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-stone-400 max-w-lg">
                For over a century, Futamata in Hokkaido has been revered for its therapeutic radium hot springs. 
                Anespa® DX harnesses the same mineral principles — bringing that ancient restorative ritual directly to your home shower.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  {
                    title: 'Futamata Radium Tufa',
                    body: 'The filtration cartridge incorporates mineral Tufa sourced directly from the renowned Futamata Radium Hot Spring in Hokkaido — one of Japan\'s most celebrated therapeutic springs.',
                    icon: Sparkles,
                  },
                  {
                    title: 'Maifan Mineral Stones',
                    body: 'Maifan Stone — a natural mineral-rich stone prized across East Asia — conditions water and releases beneficial mineral ions, the same way nature has for millennia.',
                    icon: Waves,
                  },
                  {
                    title: 'Active Carbon Purification',
                    body: 'Before minerals touch your water, an external carbon filter removes chlorine, rust sediment, and pipe odor — so only clean, purified water enters the mineral stage.',
                    icon: Filter,
                  },
                ].map(({ title, body, icon: Icon }) => (
                  <div key={title} className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 hover:border-amber-400/20 transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm">{title}</h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-stone-400">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SPECIFICATIONS
      ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.06] bg-[#0d0b09]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">OFFICIAL ENAGIC® SPECS</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Technical Excellence</h2>
            <p className="mt-3 text-sm text-stone-400">
              Built in Japan with premium materials and double-stage mineral conditioning.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { label: 'Flow Rate', value: '2.6 GPM', sub: 'Up to 10 liters/min of mineral spa water.' },
              { label: 'External Filter', value: 'Active Carbon', sub: 'Removes chlorine, rust, and pipe sediment.' },
              { label: 'Mineral Cartridge', value: '200g Ceramic', sub: 'Futamata Tufa & Maifan stone blend.' },
              { label: 'Warranty', value: '3-Year', sub: 'ISO 13485 quality. Made in Japan.' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 text-center hover:border-amber-400/20 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">{label}</p>
                <h4 className="mt-2 text-2xl font-black text-white">{value}</h4>
                <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CheckCircle2, title: 'Mineral-Ion Water', body: 'Formulated specifically for relaxing bath or shower use — not for drinking.' },
              { icon: CheckCircle2, title: 'Natural pH Balance', body: 'Preserves natural water pH while filtering impurities and adding minerals.' },
              { icon: CheckCircle2, title: 'Simple Installation', body: 'Connects easily to standard bath faucets and shower arms. No plumber needed.' },
              { icon: ShieldCheck, title: '3-Year Enagic Warranty', body: "Backed by Enagic's official 3-year manufacturer warranty." },
              { icon: Wrench, title: 'DX Enhanced Design', body: 'Larger ceramic cartridge and redesigned base for effortless filter replacement.' },
              { icon: Zap, title: 'Massage Shower Head', body: 'Multiple adjustable settings for a soothing, customizable shower intensity.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 hover:border-amber-400/20 transition-colors">
                <Icon className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">{title}</h4>
                  <p className="mt-1 text-xs text-stone-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          CLOSING CTA — Cinematic Full Bleed
      ───────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-36 overflow-hidden border-t border-white/[0.06]">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[#0d0b09]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(180,100,0,0.12)_0%,transparent_70%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Product image centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto mb-10 w-48 sm:w-56"
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.2)_0%,transparent_70%)] blur-2xl scale-150" />
            <img
              src="/products/anespa-dx.png"
              alt="Enagic Anespa DX"
              className="relative z-10 w-full object-contain drop-shadow-[0_20px_50px_rgba(245,158,11,0.25)] hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">ELEVATE YOUR DAILY RITUAL</p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Your Private Onsen.
            <br />
            Every Single Day.
          </h2>
          <p className="mt-6 text-base text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Experience the restorative power of mineral-filtered spa water every morning and evening. 
            Connect with a True Legacy advisor to bring Anespa® DX to your home.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <DistributorBuyButton
              profile={profile}
              productId="anespa_dx"
              label="Order Anespa® DX"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-9 py-4 text-sm font-black text-black shadow-[0_10px_40px_rgba(245,158,11,0.35)] hover:from-amber-400 hover:to-orange-400 hover:scale-[1.02] transition-all"
            />
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.04] px-8 py-4 text-sm font-bold text-white hover:border-amber-400/40 hover:bg-white/[0.08] transition-all"
            >
              <MessageCircle className="h-4 w-4 text-amber-400" />
              Talk to Me
            </button>
          </div>

          {/* Distributor attribution at bottom */}
          {profile && (
            <div className="mt-12 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <img
                src={portraitUrl}
                alt={profile.display_name}
                className="h-8 w-8 rounded-full object-cover border border-amber-400/30"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logos/tl-square-white.png' }}
              />
              <p className="text-xs text-stone-400">
                Shared by <span className="font-bold text-white">{profile.display_name}</span> · True Legacy Leader
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          LEAD CONSULTATION MODAL
      ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-[#100e0b] p-6 sm:p-8 shadow-2xl"
            >
              {formSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Thank You!</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    Your inquiry for the Anespa® DX has been received. {profile?.display_name || 'Your advisor'} will contact you shortly.
                  </p>
                  <button
                    onClick={() => { setShowModal(false); setFormSuccess(false) }}
                    className="mt-4 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-black text-black"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">ANESPA SPA CONSULTATION</p>
                    <h3 className="mt-1 text-2xl font-black text-white">Connect with {profile?.display_name || 'Advisor'}</h3>
                    <p className="mt-1 text-xs text-stone-400">
                      Ask about Anespa® DX installation, specifications, or Japanese spa technology.
                    </p>
                  </div>

                  {formError && (
                    <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
                      {formError}
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-1/2 h-12 rounded-xl border border-white/10 bg-white/5 font-bold text-xs text-white hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-1/2 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-black text-xs text-black disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
