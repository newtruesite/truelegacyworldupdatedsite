import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Droplets,
  ExternalLink,
  Info,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sun,
  Waves,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { DistributorBuyButton } from '@/components/products/DistributorBuyButton'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import { getLeaderPortrait, getPublicDistributors, submitCrmApplication, type PublicDistributor } from '@/lib/crm'

interface BeauteLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

export function BeauteLandingPage({ profile: propProfile, distributorSlug }: BeauteLandingPageProps) {
  const [profile, setProfile] = useState<PublicDistributor | null>(propProfile || null)
  const [loadingProfile, setLoadingProfile] = useState(!propProfile)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openIngredients, setOpenIngredients] = useState<string | null>(null)

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

  const firstName = useMemo(() => profile?.display_name.split(' ')[0] || 'Leader', [profile])

  const portraitUrl = useMemo(() => {
    if (!profile) return '/leaders/standardized/mehdi-cohen.png'
    return getLeaderPortrait(profile.slug, profile.avatar_url || undefined)
  }, [profile])

  const whatsappMessage = useMemo(() => {
    return encodeURIComponent(
      `Hi ${firstName}, I viewed your Kangen Beauté page and would like to learn more about the three-step collection and availability in my market.`
    )
  }, [firstName])

  const whatsappUrl = useMemo(() => {
    const phoneNum = profile?.phone ? profile.phone.replace(/[^0-9]/g, '') : '14389947844'
    return `https://wa.me/${phoneNum}?text=${whatsappMessage}`
  }, [profile, whatsappMessage])

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
        interest: 'beaute',
        selectedDistributor: profile?.slug || 'mehdi-cohen',
        hasReferrer: true,
        sourcePath: typeof window !== 'undefined' ? window.location.pathname : `/d/${activeSlug}/beaute`,
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

  const faqs = [
    {
      q: 'What products are included?',
      a: 'The Timeless Radiance Collection includes First Light Essence, Vital Rich Cream, and Crystal Ampoule Cream.',
    },
    {
      q: 'What order should I use them?',
      a: 'The collection is presented as a three-step ritual: First Light Essence, Vital Rich Cream, and Crystal Ampoule Cream. Follow the official package directions for timing, quantity, and frequency.',
    },
    {
      q: 'Is Kangen Beauté made with Kangen Water?',
      a: 'Enagic describes the collection as built around Kangen Water at pH 5.5. Review the official product information and individual labels for formula-specific details.',
    },
    {
      q: 'Does the collection contain turmeric?',
      a: 'The collection is inspired by Okinawan Ukon, and curcumin appears within the disclosed ingredient lists.',
    },
    {
      q: 'Is it fragrance-free?',
      a: 'No. Fragrance and fragrance-related allergens (such as limonene, linalool, hexyl cinnamal) appear in the official ingredient disclosures.',
    },
    {
      q: 'Is Kangen Beauté vegan?',
      a: 'Do not label the collection vegan. Disclosed ingredients include animal-derived or potentially animal-derived materials such as milk ingredients, salmon testis exosomes, collagen, beeswax, and mink oil.',
    },
    {
      q: 'Is it suitable for sensitive skin?',
      a: 'Irritation potential varies by person. The formulas are complex and contain fragrance. Review the complete ingredient lists and patch test before broader use.',
    },
    {
      q: 'Does it remove wrinkles or reverse aging?',
      a: 'No guaranteed result should be promised. Official cosmetic language focuses on helping improve the appearance of firmness, smoothness, fine lines, radiance, and hydration. Individual results vary.',
    },
    {
      q: 'Can it treat acne, eczema, rosacea, or another skin condition?',
      a: 'The collection is cosmetic and should not be presented as treatment for a medical skin condition. Speak with a qualified healthcare professional for medical concerns.',
    },
    {
      q: 'Where is the collection available?',
      a: 'Availability varies by market. Contact the verified distributor shown on this page to confirm current local options.',
    },
    {
      q: 'How can I purchase it?',
      a: 'Your distributor can confirm availability, current pricing, and the correct official ordering process for your country.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#040714] text-white selection:bg-amber-400 selection:text-black">
      <SEO
        title={`Kangen Beauté® | Three-Step Skincare Ritual | ${profile?.display_name || 'True Legacy'}`}
        description={`Explore Kangen Beauté, Enagic’s three-step skincare collection inspired by Kangen Water and Okinawan Ukon, with personal guidance from ${profile?.display_name || 'your advisor'}.`}
      />

      {/* Pearl & Champagne Gold Ambient Background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(254,243,199,0.14)_0%,rgba(14,165,233,0.05)_45%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/4 top-32 h-[350px] w-[350px] rounded-full bg-amber-200/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 top-48 h-[400px] w-[400px] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      {/* 1. SIMPLIFIED HEADER (No distracting global nav links) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040714]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={`/d/${activeSlug}`}
              label={`Return to ${firstName}'s profile`}
            />
            <Link to="/" className="flex items-center gap-2 group">
              <TrueLegacyLogo />
              <span className="text-[10px] font-semibold text-amber-300 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
                Kangen Beauté®
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <DistributorBuyButton profile={profile} productId="kangen_beaute" label="Buy Now" compactOnMobile className="shrink-0" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-amber-300/40 bg-gradient-to-r from-amber-400/20 to-sky-500/20 px-4 py-2 text-xs font-bold text-amber-200 hover:border-amber-300 hover:from-amber-400/30 hover:to-sky-500/30 transition-all shadow-[0_0_20px_rgba(254,243,199,0.15)]"
            >
              Ask {firstName}
            </a>
          </div>
        </div>
      </header>

      {/* 2. LUXURY HERO */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Hero Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-amber-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                THE TIMELESS RADIANCE COLLECTION
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
                Return to Your Original{' '}
                <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-sky-200 bg-clip-text text-transparent">
                  Beauty
                </span>
              </h1>

              <p className="mt-3 text-lg font-extrabold text-amber-200/90 sm:text-xl">
                Three Meticulously Crafted Steps. One Elevated Skincare Ritual.
              </p>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#cccccc] sm:text-lg">
                Kangen Beauté® is an exclusive Enagic skincare collection inspired by Kangen Water® and Okinawan Ukon, bringing together Japanese precision and Korean skincare artistry.
              </p>

              {/* 3 Step Visual Product Pill Badges */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-amber-200">
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">1. First Light Essence</span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">2. Vital Rich Cream</span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">3. Crystal Ampoule Cream</span>
              </div>

              {/* Personalized Line */}
              {profile && (
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#86868b]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Shared personally with you by <strong className="text-white">{profile.display_name}</strong></span>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection('ritual')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-4 text-sm font-black text-slate-950 shadow-[0_10px_35px_rgba(254,243,199,0.25)] hover:from-amber-300 hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Discover the Three-Step Ritual
                  <ChevronRight className="h-4 w-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white hover:border-amber-300/50 hover:bg-white/[0.08] transition-all"
                >
                  <MessageCircle className="h-4 w-4 text-amber-300" />
                  Ask {firstName}
                </a>
              </div>

              <p className="mt-6 text-xs text-[#86868b] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                For external use only · Individual results may vary
              </p>
            </motion.div>

            {/* Right Column: Collection Product Artwork */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md rounded-[32px] border border-amber-300/30 bg-gradient-to-b from-amber-950/20 via-slate-900/50 to-black p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <div className="absolute -top-3.5 right-6 rounded-full border border-amber-300/40 bg-[#040714] px-4 py-1 text-[11px] font-bold text-amber-200 shadow-lg">
                  Japanese & Korean Skincare Artistry
                </div>

                <div className="relative my-6 flex min-h-[340px] items-center justify-center sm:min-h-[400px]">
                  <div className="absolute inset-0 rounded-full bg-amber-300/10 blur-2xl animate-pulse pointer-events-none" />
                  
                  <img
                    src="/products/kangen-beaute-collection-original.png"
                    alt="Kangen Beauté three-product collection: First Light Essence, Vital Rich Cream, and Crystal Ampoule Cream"
                    className="relative z-10 h-auto max-h-[340px] w-auto max-w-full object-contain drop-shadow-[0_20px_45px_rgba(254,243,199,0.25)] transition-transform duration-500 hover:scale-105 sm:max-h-[400px]"
                  />
                </div>

                <div className="space-y-2 border-t border-white/10 pt-5 text-center">
                  <h3 className="text-xl font-black text-white">Kangen Beauté® Collection</h3>
                  <p className="text-xs text-[#cccccc]">First Light Essence · Vital Rich Cream · Crystal Ampoule Cream</p>

                  <div className="pt-3">
                    <DistributorBuyButton
                      profile={profile}
                      productId="kangen_beaute"
                      label="Order Kangen Beauté®"
                      className="w-full justify-center"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. COLLECTION TRUST STRIP */}
      <section className="py-6 border-y border-white/10 bg-[#080e22]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#cccccc] max-w-5xl mx-auto">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Three-step skincare ritual
            </span>
            <span className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-300" />
              Inspired by Kangen Water®
            </span>
            <span className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-300" />
              Features Okinawan Ukon
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Exclusive to Enagic®
            </span>
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-300" />
              Full ingredient transparency
            </span>
          </div>
        </div>
      </section>

      {/* 4. PHILOSOPHY AND FORMULATION STORY */}
      <section className="py-16 sm:py-24 border-t border-white/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">THE KANGEN BEAUTÉ PHILOSOPHY</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              Where Water, Heritage and Skincare Artistry Meet
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition-all hover:border-amber-300/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-300/30">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">Enagic Heritage</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                Kangen Beauté is built around Kangen Water at pH 5.5 and formulated to help support the skin’s moisture barrier while delivering hydration-focused care.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition-all hover:border-amber-300/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-300/30">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">Japanese Precision</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                The collection draws from Enagic’s Japanese heritage, water-ionization knowledge, and Okinawan Ukon story.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition-all hover:border-amber-300/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-300/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">Korean Artistry</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                Advanced skincare ingredients and a proprietary delivery approach create a layered ritual designed for hydration, nourishment, and a luminous-looking finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE THREE-STEP RITUAL */}
      <section id="ritual" className="py-16 sm:py-24 border-t border-white/10 bg-[#060b1c]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">LAYERED BEAUTY RITUAL</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl lg:text-5xl">The Three-Step Ritual</h2>
            <p className="mt-4 text-base text-[#cccccc]">
              Each formula plays a different role. Use the complete collection as a layered ritual, following the official product directions.
            </p>
          </div>

          <div className="mt-14 space-y-12">
            {/* Step 1 */}
            <div className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-950/20 via-slate-900/50 to-black p-6 sm:p-10 grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-300">
                  STEP 1 · PREPARE + HYDRATE
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">First Light Essence</h3>
                <p className="text-sm leading-relaxed text-[#cccccc]">
                  A multilayered essence designed to refresh the look of skin, support a smooth hydrated feel, and prepare the skin for the next step.
                </p>

                {/* Accurate Infographic Features from Official Sheet */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sky-300">
                      <Droplets className="h-4 w-4" />
                      <span>pH 5.5 Balance</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Helps support the look of a comfortable, balanced skin barrier.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      <span>Milk-Derived Actives</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Milk Exosome Complex & Curcumin Composite to condition skin.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sky-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>5-Type Hyaluronic Complex</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      5 types of hyaluronic acid maintain soft, hydrated-looking skin.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Prepare & Absorb</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Designed to blend the formula seamlessly into the skin surface.
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean PNG bottle (Proportionate Sizing) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative flex items-center justify-center p-6 w-full">
                  <div className="absolute h-48 w-48 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />
                  <img
                    src="/products/kangen-beaute-step-1-original.png"
                    alt="Kangen Beauté First Light Essence, Step I"
                    className="relative z-10 h-auto max-h-[340px] w-auto max-w-full object-contain drop-shadow-[0_15px_35px_rgba(14,165,233,0.3)] transition-transform duration-500 hover:scale-105 sm:max-h-[380px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-950/20 via-slate-900/50 to-black p-6 sm:p-10 grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                  STEP 2 · NOURISH + RENEW
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Vital Rich Cream</h3>
                <p className="text-sm leading-relaxed text-[#cccccc]">
                  A rich treatment cream designed to help improve the appearance of firmness, smoothness, tone, and radiance as part of an evening skincare ritual.
                </p>

                {/* Accurate Infographic Features from Official Sheet */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      <span>Skin Renewal (PDRN)</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      PDRN + peptides help support smoother, firmer-looking skin.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <Sun className="h-4 w-4" />
                      <span>Brightening Support</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Niacinamide helps promote a more even, radiant appearance.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Deep Infusion</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Formulated to channel active ingredients deep into the skin.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <Leaf className="h-4 w-4" />
                      <span>Nature & Innovation</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Harmony of PDRN, Niacinamide, and Okinawan Ukon curcumin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean PNG jar (Proportionate Sizing) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative flex items-center justify-center p-6 w-full">
                  <div className="absolute h-48 w-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
                  <img
                    src="/products/kangen-beaute-step-2-original.png"
                    alt="Kangen Beauté Vital Rich Cream, Step II"
                    className="relative z-10 h-auto max-h-[320px] w-auto max-w-full object-contain drop-shadow-[0_15px_35px_rgba(245,158,11,0.3)] transition-transform duration-500 hover:scale-105 sm:max-h-[360px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-950/20 via-slate-900/50 to-black p-6 sm:p-10 grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                  STEP 3 · PROTECT + REVITALIZE
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Crystal Ampoule Cream</h3>
                <p className="text-sm leading-relaxed text-[#cccccc]">
                  The final seal in the ritual. A concentrated cream designed to help lock in moisture and leave skin with a luminous, silky finish.
                </p>

                {/* Accurate Infographic Features from Official Sheet */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <Sparkles className="h-4 w-4" />
                      <span>Deep Nourishment</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Omega-7 + essential fatty acids enhance soft & smooth skin.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Barrier Support</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      Ceramide-like lipids support moisture & strengthen skin barrier.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>120nm Nano Delivery</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      120nm technology glides smoothly for a clean, residue-free finish.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <Droplets className="h-4 w-4" />
                      <span>Silk Rich Finish</span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-normal">
                      120nm Vesicle Complex & Mink Oil Composite for radiant glow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean PNG bottle (Proportionate Sizing) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative flex items-center justify-center p-6 w-full">
                  <div className="absolute h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
                  <img
                    src="/products/kangen-beaute-step-3-original.png"
                    alt="Kangen Beauté Crystal Ampoule Cream, Step III"
                    className="relative z-10 h-auto max-h-[340px] w-auto max-w-full object-contain drop-shadow-[0_15px_35px_rgba(52,211,153,0.3)] transition-transform duration-500 hover:scale-105 sm:max-h-[380px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MORNING AND EVENING ROUTINE */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">DAILY APPLICATION</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Build the Ritual Into Your Routine</h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            {/* Morning Routine */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 space-y-4">
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300">
                MORNING ROUTINE
              </span>
              <ol className="space-y-3 text-xs text-[#cccccc] list-decimal list-inside leading-relaxed pt-2">
                <li>Begin with clean, dry skin.</li>
                <li>Apply First Light Essence according to the package directions.</li>
                <li>Follow with the appropriate Beauté cream if directed for morning use.</li>
                <li>Complete the routine with a suitable broad-spectrum sunscreen from your existing skincare routine.</li>
              </ol>
            </div>

            {/* Evening Routine */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 space-y-4">
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                EVENING RITUAL
              </span>
              <ol className="space-y-3 text-xs text-[#cccccc] list-decimal list-inside leading-relaxed pt-2">
                <li>Cleanse and dry the skin.</li>
                <li>Apply First Light Essence.</li>
                <li>Follow with Vital Rich Cream.</li>
                <li>Complete the ritual with Crystal Ampoule Cream when directed.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURED INGREDIENTS */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060b1c]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">FORMULATION HIGHLIGHTS</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Advanced Ingredients in Harmony</h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">Kangen Water at pH 5.5</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Used to help support a balanced, hydrated feel.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">Okinawan Ukon</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Turmeric-inspired care connected to Enagic’s Okinawan heritage.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">5-Type Hyaluronic Acid</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Multiple forms of hyaluronic acid for layered hydration.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">Niacinamide</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Included to support a brighter and more even-looking complexion.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">Peptide Complex</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">A multi-peptide system included within the disclosed formulas.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">PDRN & Sodium DNA</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Featured within the Vital Rich Cream ingredient story.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">Collagen & Elastin</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Included as cosmetic-conditioning ingredients.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-200 text-base">Botanical Extracts</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Includes Centella asiatica, green tea, camellia, grapefruit, oat, and ginseng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INGREDIENT TRANSPARENCY */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">FULL INGREDIENT DISCLOSURE</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Luxury Includes Knowing What Is Inside</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Review the complete ingredient list before applying any product, especially if you have known sensitivities or ethical ingredient preferences.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <button
                onClick={() => setOpenIngredients(openIngredients === 'step1' ? null : 'step1')}
                className="w-full flex items-center justify-between text-sm font-bold text-white"
              >
                <span>First Light Essence: Full INCI List</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openIngredients === 'step1' ? 'rotate-180' : ''}`} />
              </button>
              {openIngredients === 'step1' && (
                <p className="mt-3 text-xs text-[#cccccc] leading-relaxed pt-2 border-t border-white/5">
                  Water (Kangen Water pH 5.5), Glycerin, Niacinamide, Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Hyaluronic Acid, Sodium Acetylated Hyaluronate, Hydroxypropyltrimonium Hyaluronate, Centella Asiatica Extract, Camellia Sinensis Leaf Extract, Curcumin, Fragrance, Limonene, Linalool.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <button
                onClick={() => setOpenIngredients(openIngredients === 'step2' ? null : 'step2')}
                className="w-full flex items-center justify-between text-sm font-bold text-white"
              >
                <span>Vital Rich Cream: Full INCI List</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openIngredients === 'step2' ? 'rotate-180' : ''}`} />
              </button>
              {openIngredients === 'step2' && (
                <p className="mt-3 text-xs text-[#cccccc] leading-relaxed pt-2 border-t border-white/5">
                  Water (Kangen Water pH 5.5), Butylene Glycol, Caprylic/Capric Triglyceride, Beeswax, Niacinamide, Sodium DNA (PDRN), Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Hydrolyzed Collagen, Salmon Testis Extract (Exosomes), Curcumin, Whey Protein, Fragrance, Hexyl Cinnamal, Hydroxycitronellal.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <button
                onClick={() => setOpenIngredients(openIngredients === 'step3' ? null : 'step3')}
                className="w-full flex items-center justify-between text-sm font-bold text-white"
              >
                <span>Crystal Ampoule Cream: Full INCI List</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openIngredients === 'step3' ? 'rotate-180' : ''}`} />
              </button>
              {openIngredients === 'step3' && (
                <p className="mt-3 text-xs text-[#cccccc] leading-relaxed pt-2 border-t border-white/5">
                  Water (Kangen Water pH 5.5), Mink Oil, Glycerin, Ceramide NP, Palmitoleic Acid (Omega-7), Hydrolyzed Elastin, Curcumin, Panax Ginseng Root Extract, Fragrance, Benzyl Salicylate, Limonene.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-amber-300/30 bg-amber-400/5 p-4 text-xs text-amber-200/90 leading-relaxed">
              <strong className="block text-amber-300 mb-1">Important Transparency Disclosure:</strong>
              Disclosed ingredients include fragrance allergens (limonene, linalool, hexyl cinnamal), milk/whey proteins, salmon testis exosomes, collagen, beeswax, and mink oil. This collection is not labeled vegan or hypoallergenic.
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHO MAY CONSIDER THE COLLECTION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060b1c]/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white text-center">Is Kangen Beauté Right for Your Ritual?</h2>
          <div className="mt-8 space-y-3 text-xs sm:text-sm text-[#cccccc]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
              <span>People seeking layered hydration and moisture barrier support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
              <span>People interested in a richer evening skincare ritual</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
              <span>People wanting to improve the appearance of smoothness and radiance</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
              <span>Existing Enagic customers exploring the Kangen lifestyle beyond water</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SAFETY AND PATCH TESTING */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-3">
            <h3 className="text-xl font-black text-white">Start With Care</h3>
            <ul className="text-xs text-[#cccccc] space-y-2 list-disc list-inside leading-relaxed">
              <li>For external use only. Read complete ingredient lists before use.</li>
              <li>Patch test each product on a small area of skin before applying broadly.</li>
              <li>Introduce one new product at a time if you have sensitive skin.</li>
              <li>Avoid direct contact with eyes. Discontinue use if irritation occurs.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 11. ENAGIC HERITAGE */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060b1c]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">EXCLUSIVE TO ENAGIC</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">A New Expression of the Kangen Lifestyle</h2>
              <p className="mt-4 text-base text-[#cccccc] leading-relaxed">
                Kangen Beauté extends Enagic’s water-centered heritage into a three-step skincare collection created exclusively for the company.
              </p>

              <div className="mt-8">
                <a
                  href="https://www.enagic.com/en_US/product-kangen-beaute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-bold text-white hover:bg-white/[0.08] transition-all"
                >
                  View Official Kangen Beauté Information <ExternalLink className="h-3.5 w-3.5 text-amber-300" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative flex items-center justify-center p-6 w-full">
                <div className="absolute h-56 w-56 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
                <img
                  src="/products/kangen-beaute-collection-original.png"
                  alt="Enagic Kangen Beauté three-step skincare collection"
                  className="relative z-10 h-auto max-h-80 w-auto max-w-full object-contain drop-shadow-[0_15px_35px_rgba(254,243,199,0.25)] transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">FAQS</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Questions About Kangen Beauté</h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openFaq === index ? 'rotate-180 text-amber-300' : 'text-[#86868b]'}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs text-[#cccccc] leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. PERSONAL DISTRIBUTOR GUIDANCE */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060b1c]/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 text-center sm:text-left grid gap-8 sm:grid-cols-12 items-center">
            <div className="sm:col-span-4 flex justify-center">
              <img
                src={portraitUrl}
                alt={`${profile?.display_name || firstName} profile`}
                className="h-28 w-28 rounded-2xl object-cover border-2 border-amber-300/40 shadow-xl"
              />
            </div>
            <div className="sm:col-span-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">YOUR PERSONAL BEAUTÉ GUIDE</p>
              <h3 className="text-2xl font-black text-white">Explore the Ritual With {firstName}</h3>
              <p className="text-xs text-[#cccccc] leading-relaxed">
                {profile?.slug === 'mehdi-cohen' ? (
                  `I shared Kangen Beauté with you because it brings another dimension to the Kangen lifestyle. It is about understanding the three-step ritual, knowing what is inside each formula, and deciding whether it fits your skin and preferences. Message me directly to confirm availability and options in your market.`
                ) : (
                  `${firstName} can help you understand the three-step Kangen Beauté ritual, confirm availability, and guide you through the official purchasing options in your market.`
                )}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all"
                >
                  Ask {firstName} About Kangen Beauté
                </a>
                <Link
                  to={`/d/${activeSlug}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all"
                >
                  View {firstName}’s Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA */}
      <section className="py-20 sm:py-28 border-t border-white/10 relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(254,243,199,0.12),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">BEGIN YOUR RITUAL</p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Ready to Explore Kangen Beauté?
          </h2>
          <p className="mt-6 text-base text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
            Discover the complete three-step collection and ask your verified distributor about availability, pricing, and official purchasing options in your market.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-sm font-black text-slate-950 shadow-[0_10px_35px_rgba(254,243,199,0.25)] hover:from-amber-300 hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Message {firstName}
            </a>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white hover:border-amber-300/50 hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              Request Beauté Information
            </button>
          </div>

          <p className="mt-6 text-xs text-[#86868b]">Premium skincare. Complete transparency. Personal guidance.</p>
        </div>
      </section>

      {/* 15. COSMETIC DISCLAIMER */}
      <section className="py-8 border-t border-white/10 bg-[#04060d]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] leading-relaxed text-[#71717a]">
            Kangen Beauté is a cosmetic skincare collection for external use only. It is not intended to diagnose, treat, cure, or prevent any medical condition. Cosmetic results vary by individual. Review the complete ingredient lists, patch test before broader use, and discontinue use if irritation occurs. Product formulation, packaging, availability, and permitted claims may vary by country.
          </p>
        </div>
      </section>

      {/* Inquiry Form Modal */}
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
                    Your inquiry for Kangen Beauté® has been received. {profile?.display_name || 'Your advisor'} will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setFormSuccess(false)
                    }}
                    className="mt-4 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-black text-slate-950"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">KANGEN BEAUTÉ INQUIRY</p>
                    <h3 className="mt-1 text-2xl font-black text-white">Connect with {profile?.display_name || 'Advisor'}</h3>
                    <p className="mt-1 text-xs text-[#cccccc]">
                      Ask questions about the three-step Kangen Beauté® collection, availability, or ordering in your country.
                    </p>
                  </div>

                  {formError && (
                    <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
                      {formError}
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-300 outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-300 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-300 outline-none"
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
                      className="w-1/2 h-12 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 font-black text-xs text-slate-950 disabled:opacity-50"
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
