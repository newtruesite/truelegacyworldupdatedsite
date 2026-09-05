import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Droplets,
  ExternalLink,
  Filter,
  Layers,
  MessageCircle,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Sun,
  Waves,
  Wrench,
  Zap,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { DistributorBuyButton } from '@/components/products/DistributorBuyButton'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import { getLeaderPortrait, getPublicDistributors, submitCrmApplication, type PublicDistributor } from '@/lib/crm'

interface AnespaLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

export function AnespaLandingPage({ profile: propProfile, distributorSlug }: AnespaLandingPageProps) {
  const [profile, setProfile] = useState<PublicDistributor | null>(propProfile || null)
  const [loadingProfile, setLoadingProfile] = useState(!propProfile)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('United States')
  const [notes, setNotes] = useState('')

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
    <div className="min-h-screen bg-[#040817] text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title="Anespa® DX Mineral Ion Water Spa | True Legacy"
        description="Turn every bath or shower into a spa ritual. Anespa® DX filters tap water and adds natural Japanese mineral ions for a gentler, more restorative shower experience."
      />

      {/* Spa Water Texture Ambient Header Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[650px] overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.18)_0%,rgba(34,211,238,0.06)_45%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/4 top-32 h-[350px] w-[350px] rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 top-48 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040817]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={profile?.slug ? `/d/${profile.slug}` : '/'}
              label={profile ? `Back to ${profile.display_name?.split(' ')[0] || 'Leader'}'s Profile` : 'Go back'}
            />
            <Link to="/" className="flex items-center gap-2 group">
              <TrueLegacyLogo />
              <span className="text-[10px] font-semibold text-cyan-400/90 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
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
                  className="w-6 h-6 rounded-full object-cover border border-cyan-400/60 shrink-0 group-hover:scale-105 transition-transform"
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
              className="rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:border-cyan-300 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all shadow-[0_0_20px_rgba(14,165,233,0.2)] active:scale-95"
            >
              Talk to Me
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Copy Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#2997ff]">
                <Droplets className="h-3.5 w-3.5 text-cyan-300 animate-bounce" />
                MINERAL ION WATER SPA
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
                Turn Every Bath or Shower Into a{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  Spa Ritual.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#cccccc] sm:text-lg">
                Anespa® DX is a home spa system designed to filter tap water and add natural minerals for a gentler,
                more relaxing bath or shower experience.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection('features')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 text-sm font-black text-slate-950 shadow-[0_10px_35px_rgba(14,165,233,0.35)] hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Discover Anespa® DX
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-cyan-400" />
                  Talk to Me
                </button>
              </div>

              {/* Verified Distributor Identity Badge */}
              {profile && (
                <div className="mt-10 flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 max-w-md">
                  <img
                    src={portraitUrl}
                    alt={`${profile.display_name} profile avatar`}
                    className="h-12 w-12 rounded-xl object-cover border border-cyan-400/30"
                  />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#2997ff]">Your Personal Advisor</p>
                    <p className="text-sm font-black text-white">{profile.display_name}</p>
                    <p className="text-xs text-[#86868b]">{profile.title || 'Independent Enagic Distributor'}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Product Showcase Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md rounded-[32px] border border-cyan-500/20 bg-gradient-to-b from-cyan-900/20 via-slate-900/40 to-black/80 p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-md">
                {/* Floating Spa Glow Badge */}
                <div className="absolute -top-3.5 right-6 rounded-full border border-cyan-400/40 bg-[#040817] px-4 py-1 text-[11px] font-bold text-cyan-300 shadow-lg">
                  Made in Japan · Enagic®
                </div>

                <div className="relative my-4 flex justify-center">
                  {/* Water Ripple Waves Animation Background */}
                  <div className="absolute inset-0 grid place-items-center opacity-30">
                    <div className="h-64 w-64 rounded-full border border-cyan-400/30 animate-ping" />
                    <div className="h-48 w-48 rounded-full border border-sky-300/40 animate-pulse" />
                  </div>

                  <img
                    src="/products/anespa-dx.png"
                    alt="Enagic Anespa DX Mineral Ion Water Spa Home System"
                    className="relative z-10 h-72 sm:h-80 w-auto object-contain drop-shadow-[0_20px_40px_rgba(14,165,233,0.3)] transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="space-y-2 border-t border-white/10 pt-5 text-center">
                  <h3 className="text-xl font-black text-white">Anespa® DX Mineral Spa</h3>
                  <p className="text-xs text-[#cccccc]">Dual Filtration · Futamata Tufa · Maifan Stones</p>

                  <div className="pt-3">
                    <DistributorBuyButton
                      profile={profile}
                      productId="anespa_dx"
                      label="Order Anespa® DX"
                      className="w-full justify-center"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section (Three Cards) */}
      <section id="features" className="py-16 sm:py-24 border-t border-white/10 bg-[#060b1e]/60 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2997ff]">SPA PERFORMANCE & DESIGN</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              Engineered for Your Daily Restorative Shower
            </h2>
            <p className="mt-4 text-base text-[#cccccc]">
              Experience three core pillars designed to transform standard tap water into a fresh, soothing home spa experience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition-all hover:border-cyan-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                <ShowerHead className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">1. Relaxing Massage Shower Head</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                Adjustable settings for a more soothing shower experience. Choose your preferred stream intensity to gently massage tiredness away.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition-all hover:border-cyan-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-300">
                <Layers className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">2. Dual-Stage Filtration</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                Active charcoal and Futamata ceramic layers help filter water before it reaches skin and hair, reducing residual chlorine and odor.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition-all hover:border-cyan-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 text-blue-300">
                <Waves className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">3. Mineral Ion Water</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                Natural minerals and negative ions create a fresh, invigorating feel that leaves your body feeling clean, soft, and refreshed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sourced From Nature Section */}
      <section className="py-16 sm:py-24 border-t border-white/10 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                <Sun className="h-3.5 w-3.5" />
                SOURCED FROM NATURE
              </div>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl lg:text-5xl leading-tight">
                Inspired by Japan’s Famous Hot Springs
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#cccccc]">
                The Anespa® DX brings authentic Japanese hot spring mineral water principles directly to your home.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base">Futamata Radium Hot Spring Tufa</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#cccccc]">
                      The filtration cartridge incorporates mineral Tufa sourced directly from the renowned Futamata Radium Hot Spring in Hokkaido, Japan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Filter className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base">Maifan Mineral Stone Layer</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#cccccc]">
                      Contains Maifan Stone, a natural mineral-rich stone traditionally prized for conditioning water and imparting beneficial mineral ions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-black/90 p-6 sm:p-8 shadow-[0_20px_60px_rgba(14,165,233,0.15)] backdrop-blur-md">
                <div className="relative min-h-[380px] sm:min-h-[460px] w-full flex items-center justify-center rounded-2xl bg-black/50 p-6 border border-white/10 overflow-visible">
                  {/* Glowing Ambient Radial Aura */}
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.22)_0%,transparent_70%)] pointer-events-none" />
                  
                  <img
                    src="/products/anespa-dx.png"
                    alt="Enagic Anespa DX Mineral Ion Water Spa Home System"
                    className="relative z-10 h-auto w-auto max-h-[360px] sm:max-h-[420px] max-w-full object-contain drop-shadow-[0_20px_45px_rgba(14,165,233,0.4)] transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-[#cccccc]">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Japanese Mineral Ionization
                  </span>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold text-cyan-300">
                    Hokkaido Tufa & Maifan Stones
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Enagic Specifications & Performance */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060b1e]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2997ff]">OFFICIAL ENAGIC® SPECIFICATIONS</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Technical & Performance Highlights</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Built in Japan with premium materials and double-stage mineral conditioning.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#2997ff]">Flow Rate</p>
              <h4 className="mt-2 text-2xl font-black text-white">2.6 GPM</h4>
              <p className="mt-1 text-xs text-[#cccccc]">Up to 10 liters/min of continuous mineral shower water.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#2997ff]">External Filter</p>
              <h4 className="mt-2 text-2xl font-black text-white">Active Carbon</h4>
              <p className="mt-1 text-xs text-[#cccccc]">Filters chlorine, odor, rust, and pipe sediment.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#2997ff]">Internal Minerals</p>
              <h4 className="mt-2 text-2xl font-black text-white">200g Ceramic</h4>
              <p className="mt-1 text-xs text-[#cccccc]">Futamata Tufa & Maifan mineral stone cartridge.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#2997ff]">Warranty & Quality</p>
              <h4 className="mt-2 text-2xl font-black text-white">3-Year Warranty</h4>
              <p className="mt-1 text-xs text-[#cccccc]">Manufactured in Japan under ISO 13485 quality standards.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-start gap-4">
              <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Mineral-Ion Water</h4>
                <p className="mt-1 text-xs text-[#cccccc]">Formulated specifically for relaxing bath or shower use.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-start gap-4">
              <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Same pH Range as Tap Water</h4>
                <p className="mt-1 text-xs text-[#cccccc]">Preserves natural pH balance while filtering impurities.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-start gap-4">
              <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Simple Installation & Operation</h4>
                <p className="mt-1 text-xs text-[#cccccc]">Easily connects to standard bath faucets and shower arms.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-start gap-4">
              <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">3-Year Enagic Warranty</h4>
                <p className="mt-1 text-xs text-[#cccccc]">Backed by Enagic’s official 3-year manufacturer warranty.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-start gap-4 sm:col-span-2 lg:col-span-2">
              <Wrench className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">DX Model Enhanced Design</h4>
                <p className="mt-1 text-xs text-[#cccccc]">
                  The DX model includes a larger ceramic cartridge and a redesigned base for easier, effortless filter replacement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 sm:py-28 border-t border-white/10 relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2997ff]">ELEVATE YOUR DAILY ROUTINE</p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Create a More Restorative Ritual at Home.
          </h2>
          <p className="mt-6 text-base text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
            Experience the difference of mineral-filtered spa water every morning and night. Connect with a True Legacy leader to learn more.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-black text-slate-950 shadow-[0_10px_35px_rgba(14,165,233,0.35)] hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              Talk to Me
            </button>

            <Link
              to="/landing-pages"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all"
            >
              Explore More Landing Pages
              <ArrowLeft className="h-4 w-4 text-cyan-400 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lead Consultation Modal */}
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
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-[#080d21] p-6 sm:p-8 shadow-2xl"
            >
              {formSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Thank You!</h3>
                  <p className="text-sm text-[#cccccc] leading-relaxed">
                    Your inquiry for the Anespa® DX Mineral Spa has been received. {profile?.display_name || 'Your advisor'} will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setFormSuccess(false)
                    }}
                    className="mt-4 rounded-xl bg-cyan-400 px-6 py-2.5 text-xs font-black text-slate-950"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2997ff]">ANate SPA CONSULTATION</p>
                    <h3 className="mt-1 text-2xl font-black text-white">Connect with {profile?.display_name || 'Advisor'}</h3>
                    <p className="mt-1 text-xs text-[#cccccc]">
                      Ask questions about Anespa® DX installation, specifications, or Japanese spa technology.
                    </p>
                  </div>

                  {formError && (
                    <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
                      {formError}
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-1/2 h-12 rounded-xl border border-white/10 bg-white/5 font-bold text-xs text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-1/2 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-black text-xs text-slate-950 disabled:opacity-50"
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
