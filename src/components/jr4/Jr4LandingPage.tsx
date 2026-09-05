import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Droplets,
  ExternalLink,
  Filter,
  Info,
  MessageCircle,
  Sparkles,
  Waves,
  X,
  Zap,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { getLeaderPortrait, getPublicDistributors, submitCrmApplication, type PublicDistributor } from '@/lib/crm'

interface Jr4LandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

export function Jr4LandingPage({ profile: propProfile, distributorSlug }: Jr4LandingPageProps) {
  const { locale, setLocale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null>(propProfile || null)
  const [loadingProfile, setLoadingProfile] = useState(!propProfile)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('United States')
  const [faucetStyle, setFaucetStyle] = useState('Standard Aerator')
  const [householdSize, setHouseholdSize] = useState('1-2 People')
  const [waterSource, setWaterSource] = useState('City/Tap Water')
  const [notes, setNotes] = useState('')

  // Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openOwnership, setOpenOwnership] = useState<number | null>(0)

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

  const leaderFirstName = useMemo(() => {
    if (!profile) return 'Mehdi'
    return profile.display_name.split(' ')[0] || profile.display_name
  }, [profile])

  const isMehdi = useMemo(() => {
    return !profile || profile.slug.toLowerCase() === 'mehdi-cohen'
  }, [profile])

  const whatsappUrl = useMemo(() => {
    const num = profile?.phone ? profile.phone.replace(/\D/g, '') : '18649072149'
    const msg = encodeURIComponent(
      `Hi ${leaderFirstName}, I viewed your Leveluk JrIV page and would like to know whether this machine fits my household, water source, and faucet.`
    )
    return `https://wa.me/${num}?text=${msg}`
  }, [profile, leaderFirstName])

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
        sourcePath: typeof window !== 'undefined' ? window.location.pathname : `/d/${activeSlug}/jr4`,
        consent: true,
        privacyVersion: '2026-08-phase-1',
        referredBy: profile?.display_name || 'True Legacy Leader',
        applicationSettings: {
          faucetStyle,
          householdSize,
          waterSource,
          notes,
          campaign: 'jr4',
        },
      })
      setFormSuccess(true)
    } catch {
      setFormError('Unable to submit inquiry. Please try messaging directly on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  // Multilingual Copies
  const copy = useMemo(() => {
    const lang = locale === 'es' ? 'es' : locale === 'fr' ? 'fr' : locale === 'pt' ? 'pt' : 'en'
    return {
      en: {
        badge: 'LEVELUK JRIV · KANGEN WATER®',
        headline1: 'KANGEN WATER.',
        headline2: 'SIMPLIFIED.',
        subhead: 'The LeveLuk JrIV brings Enagic\'s Kangen Water® technology into a streamlined four-plate ionizer designed especially for singles, couples and lower-demand households.',
        primaryCta: 'Explore the JrIV',
        secondaryCta: `Ask ${leaderFirstName}`,
        heroSpecs: 'Four electrode plates · 120 watts · Five water types · 3-year warranty (U.S. ref.)',
      },
      es: {
        badge: 'LEVELUK JRIV · KANGEN WATER®',
        headline1: 'KANGEN WATER.',
        headline2: 'SIMPLIFICADO.',
        subhead: 'El LeveLuk JrIV lleva la tecnología Kangen Water® de Enagic a un ionizador de cuatro placas diseñado especialmente para personas solteras, parejas y hogares de menor demanda.',
        primaryCta: 'Explorar el JrIV',
        secondaryCta: `Preguntar a ${leaderFirstName}`,
        heroSpecs: 'Cuatro placas de titanio · 120 vatios · Cinco tipos de agua · Garantía 3 años (ref. EE.UU.)',
      },
      fr: {
        badge: 'LEVELUK JRIV · KANGEN WATER®',
        headline1: 'KANGEN WATER.',
        headline2: 'SIMPLIFIÉ.',
        subhead: 'Le LeveLuk JrIV apporte la technologie Kangen Water® d\'Enagic dans un ioniseur quatre plaques conçu spécialement pour les personnes seules, les couples et les foyers à faible demande.',
        primaryCta: 'Explorer le JrIV',
        secondaryCta: `Demander à ${leaderFirstName}`,
        heroSpecs: 'Quatre plaques titane · 120 watts · Cinq types d\'eau · Garantie 3 ans (réf. É.-U.)',
      },
      pt: {
        badge: 'LEVELUK JRIV · KANGEN WATER®',
        headline1: 'KANGEN WATER.',
        headline2: 'SIMPLIFICADO.',
        subhead: 'O LeveLuk JrIV traz a tecnologia Kangen Water® da Enagic em um ionizador de quatro placas projetado especialmente para solteiros, casais e lares com menor demanda.',
        primaryCta: 'Explorar o JrIV',
        secondaryCta: `Perguntar a ${leaderFirstName}`,
        heroSpecs: 'Quatro placas de titânio · 120 watts · Cinco tipos de água · Garantia 3 anos (ref. EUA)',
      },
    }[lang]
  }, [locale, leaderFirstName])

  // FAQ List — 13 required questions, all compliant
  const faqList = useMemo(() => [
    {
      q: 'What is the LeveLuk JrIV?',
      a: 'The LeveLuk JrIV is a countertop water ionizer made by Enagic®. It uses four solid platinum-coated titanium electrode plates to perform electrolysis on filtered tap water, producing five different water types across a pH range of 2.5–11.5.',
    },
    {
      q: 'How is JrIV different from the K8?',
      a: 'The JrIV uses 4 electrode plates and draws 120W of power, while the K8 uses 8 electrode plates and draws 230W. Both produce the same five water types, but the K8 has higher water output capability and a longer U.S. warranty (5 years vs. 3 years). The JrIV is designed primarily for singles and couples with lower output requirements.',
    },
    {
      q: 'How many electrode plates does the JrIV have?',
      a: 'The JrIV has 4 solid platinum-coated titanium electrode plates, each measuring 135 × 75 mm.',
    },
    {
      q: 'What five water types does it produce?',
      a: 'The JrIV produces: Kangen Water® (pH 8.5–9.5, intended for drinking), Clean Water (pH 7.0, intended for drinking/medications), Beauty Water (pH 5.5–6.0, not for drinking), Strong Kangen Water (pH 11.0+, not for drinking), and Strong Acidic Water (pH 2.5, not for drinking). Only Kangen Water® and Clean Water are intended for drinking.',
    },
    {
      q: 'Who is the JrIV recommended for?',
      a: 'Enagic recommends the JrIV primarily for singles and couples or smaller households with lower water-output requirements. Those wanting higher output capability or living in larger households may want to consider a model with more electrode plates, like the K8.',
    },
    {
      q: 'Can families use the JrIV?',
      a: 'The JrIV\'s lower plate count (4 plates) and lower power rating (120W) mean it has a lower water output rate (3.0–4.9 L/min for Kangen Water) than larger models. Larger families with continuous high-volume demand should compare it honestly against the 8-plate K8 before ordering.',
    },
    {
      q: 'How much water can the JrIV produce?',
      a: 'According to official reference data: Kangen Water production rate is 3.0–4.9 L/min. Acidic Water is 0.2–1.9 L/min. Strong Acidic Water is 0.3–0.7 L/min. These figures represent standard test conditions and vary with source water, pressure, temperature, and machine condition.',
    },
    {
      q: 'Does the JrIV clean itself automatically?',
      a: 'Yes. The JrIV uses a microcomputer-controlled automatic cleaning system. Periodic deep cleaning using food-grade citric acid (E-Cleaning) is also recommended per official Enagic operating instructions.',
    },
    {
      q: 'How will I know when to change the filter?',
      a: 'The JrIV has a smart filter notification system that alerts you via the LCD display and buzzer when replacement is due according to system usage metrics. This is a system notification, not a real-time water purity test.',
    },
    {
      q: 'What is the electrolysis enhancer tank?',
      a: 'The JrIV includes a built-in electrolysis enhancer tank that is used specifically when producing Strong Kangen Water (pH 11.0+) and Strong Acidic Water (pH 2.5), according to official operating instructions.',
    },
    {
      q: 'What is the warranty?',
      a: 'The referenced U.S. product page lists a 3-year manufacturer warranty. Exact warranty terms vary by geographic market. Confirm current warranty in your specific region before purchasing.',
    },
    {
      q: 'How do I order the JrIV?',
      a: 'Contact the verified distributor who shared this page. Pricing, availability, shipping, regional financing, and ordering procedures vary by country and market. Never order through unverified third-party links.',
    },
    {
      q: 'Can I speak with my distributor before choosing?',
      a: `Absolutely. ${leaderFirstName} can review your household size, water source, faucet compatibility, and help you understand whether the JrIV or another Kangen model is the better fit.`,
    },
  ], [leaderFirstName])

  return (
    <div className="min-h-screen bg-[#060911] text-white selection:bg-cyan-400 selection:text-black font-sans">
      <SEO
        title={`LeveLuk JrIV | Compact Kangen Water® System | ${profile?.display_name || 'True Legacy'}`}
        description={`The LeveLuk JrIV by Enagic® — a streamlined four-plate Kangen Water ionizer designed for singles, couples and lower-demand households. Explore with ${profile?.display_name || 'your guide'}.`}
        image="/products/jr-iv.png"
      />

      {/* ─── STICKY NAVIGATION HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060911]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={profile?.slug ? `/d/${profile.slug}` : '/'}
              label={profile ? `Back to ${profile.display_name?.split(' ')[0] || 'Leader'}'s Profile` : 'Go back'}
            />
            <Link to="/" className="flex items-center gap-2 group" aria-label="True Legacy World Home">
              <TrueLegacyLogo className="h-8 w-auto transition-transform group-hover:scale-105" />
              <span className="text-[10px] font-semibold text-cyan-400/90 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
                LeveLuk JrIV
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
                  {leaderFirstName}
                </span>
              </Link>
            )}

            {/* Language selector */}
            <div className="relative">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
                className="appearance-none rounded-xl border border-white/15 bg-white/5 py-1.5 pl-3 pr-8 text-xs font-bold text-slate-200 outline-none hover:bg-white/10 focus:border-cyan-400 transition cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en" className="bg-slate-900 text-white">EN</option>
                <option value="es" className="bg-slate-900 text-white">ES</option>
                <option value="fr" className="bg-slate-900 text-white">FR</option>
                <option value="pt" className="bg-slate-900 text-white">PT</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400/20 transition active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Ask {leaderFirstName}</span>
            </button>
          </div>
        </div>
      </header>

      <main>

        {/* ─── CINEMATIC HERO — Full Bleed Kitchen ─── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/true-legacy-assets/jr4-hero-kitchen.jpg"
              alt="Premium kitchen with LeveLuk JrIV water ionizer"
              className="h-full w-full object-cover object-center"
            />
            {/* Left dark gradient for copy space */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060911]/95 via-[#060911]/75 to-[#060911]/10" />
            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060911]/80 via-transparent to-[#060911]/20" />
            {/* Subtle cyan tint right */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(34,211,238,0.06)_0%,transparent_55%)]" />
          </div>

          {/* Hero content */}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:py-32">
            <div className="grid items-center gap-10 lg:grid-cols-12">

              {/* Left: Editorial copy */}
              <div className="lg:col-span-7">
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300"
                >
                  <Waves className="h-3.5 w-3.5" />
                  {copy.badge}
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="mt-7 text-6xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.95]"
                >
                  {copy.headline1}
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-white to-cyan-400 bg-clip-text text-transparent">
                    {copy.headline2}
                  </span>
                </motion.h1>

                {/* Subhead */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl"
                >
                  {copy.subhead}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-10 flex flex-wrap items-center gap-4"
                >
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-cyan-400 px-8 py-4 text-sm font-black text-slate-950 shadow-[0_10px_40px_rgba(34,211,238,0.35)] hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {copy.primaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-7 py-4 text-sm font-bold text-white hover:border-cyan-400/50 hover:bg-white/[0.10] transition-all backdrop-blur-sm"
                  >
                    <MessageCircle className="h-4 w-4 text-cyan-400" />
                    {copy.secondaryCta}
                  </a>
                </motion.div>

                {/* Distributor badge */}
                {profile && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-10 flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-3.5 max-w-sm"
                  >
                    <img
                      src={portraitUrl}
                      alt={`${profile.display_name} profile`}
                      className="h-12 w-12 rounded-xl object-cover border border-cyan-400/30"
                    />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Your Personal Water Guide</p>
                      <p className="text-sm font-black text-white">{profile.display_name}</p>
                      <p className="text-xs text-slate-400">{profile.title || 'Independent Enagic Distributor'}</p>
                    </div>
                  </motion.div>
                )}

                {/* Spec pill */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-6 text-xs text-slate-500 font-medium"
                >
                  {copy.heroSpecs}
                </motion.p>
              </div>

              {/* Right: Product PNG */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:col-span-5 relative hidden lg:flex flex-col items-center"
              >
                {/* Glow halo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12)_0%,rgba(14,116,144,0.06)_50%,transparent_72%)] blur-2xl" />
                </div>

                {/* Badge */}
                <div className="absolute -top-2 right-4 z-20 rounded-full border border-cyan-400/40 bg-[#060911]/80 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold text-cyan-300 shadow-lg">
                  Made in Japan · Enagic®
                </div>

                {/* The real product PNG */}
                <img
                  src="/products/jr-iv.png"
                  alt="Enagic LeveLuk JrIV compact Kangen Water ionizer"
                  className="relative z-10 h-auto w-full max-w-[280px] xl:max-w-[320px] object-contain drop-shadow-[0_30px_60px_rgba(34,211,238,0.20)] hover:scale-105 transition-transform duration-500"
                />

                {/* Name tag */}
                <div className="relative z-10 mt-4 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">LeveLuk JrIV</p>
                  <p className="text-xs text-slate-400 mt-0.5">4 Plates · 120W · 5 Water Types</p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown className="h-5 w-5 text-cyan-400/60" />
            </motion.div>
          </motion.div>
        </section>

        {/* ─── TRUST STRIP ─── */}
        <section className="border-b border-white/10 bg-[#070c18]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: <Sparkles className="h-4 w-4" />, label: '4 PLATINUM-COATED TITANIUM PLATES' },
                { icon: <Droplets className="h-4 w-4" />, label: '5 WATER TYPES' },
                { icon: <Zap className="h-4 w-4" />, label: 'LOWER ENERGY CONSUMPTION' },
                { icon: <Waves className="h-4 w-4" />, label: 'DESIGNED FOR SINGLES & COUPLES' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 justify-center md:justify-start">
                  <span className="text-cyan-400 shrink-0">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── POSITIONING SECTION — "Not Every Home Needs the K8" ─── */}
        <section className="py-24 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

              {/* Left: Copy */}
              <div className="space-y-8">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">THE JUNIOR MODEL</span>

                <h2 className="text-5xl font-black tracking-tight text-white sm:text-6xl leading-[1.0]">
                  NOT EVERY HOME<br />
                  <span className="text-slate-400">NEEDS THE K8.</span>
                </h2>

                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    Some households need the greater output and eight-plate performance of the flagship K8. Others simply want the Kangen Water® experience in a machine designed around a smaller household.
                  </p>
                  <p>
                    That's where the JrIV fits.
                  </p>
                  <p className="font-bold text-white">
                    The right machine for the right home.
                  </p>
                </div>

                {/* Three audience cards */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'FOR SINGLES', icon: '◎' },
                    { label: 'FOR COUPLES', icon: '◎◎' },
                    { label: 'LOWER DEMAND', icon: '◎◎◎' },
                  ].map((item, i) => (
                    <div key={i} className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4 text-center">
                      <div className="text-lg text-cyan-400 mb-1">{item.icon}</div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{item.label}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-cyan-400 px-7 py-3.5 text-sm font-black text-slate-950 shadow-[0_8px_30px_rgba(34,211,238,0.3)] hover:bg-cyan-300 hover:scale-[1.02] transition-all"
                >
                  See If JrIV Fits My Home
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Right: Lifestyle image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src="/true-legacy-assets/jr4-lifestyle-couple.jpg"
                  alt="Couple using LeveLuk JrIV in morning kitchen"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060911]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    THIS FITS MY LIFE.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS — One Machine. Five Types of Water. ─── */}
        <section className="py-24 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">FROM YOUR TAP</span>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl leading-tight">
                ONE MACHINE.<br />FIVE TYPES OF WATER.
              </h2>
              <p className="mt-4 text-slate-300 text-base">
                The JrIV produces Enagic's five water types for drinking, cooking, cosmetic and household applications.
              </p>
            </div>

            {/* Process flow */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 mb-16">
              {[
                { step: '01', label: 'TAP WATER', desc: 'Cold water from your faucet' },
                { step: '02', label: 'FILTRATION', desc: 'High-grade activated charcoal filter' },
                { step: '03', label: 'ELECTROLYSIS', desc: '4 platinum-titanium plates' },
                { step: '04', label: '5 WATER TYPES', desc: 'pH 2.5 → 11.5' },
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="h-14 w-14 rounded-full border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center text-xs font-black text-cyan-400 mb-3">
                      {item.step}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-white">{item.label}</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[100px]">{item.desc}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block text-slate-600 text-xl font-thin mx-2">→</div>
                  )}
                </div>
              ))}
            </div>

            {/* 5 Water type cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  name: 'Kangen Water®',
                  ph: 'pH 8.5–9.5',
                  drink: true,
                  color: 'border-cyan-400/30 from-cyan-950/40',
                  badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
                  badgeLabel: '✓ FOR DRINKING',
                  desc: 'Electrolyzed hydrogen-rich water for daily hydration, tea, cooking.',
                },
                {
                  name: 'Clean Water',
                  ph: 'pH 7.0',
                  drink: true,
                  color: 'border-blue-400/30 from-blue-950/40',
                  badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
                  badgeLabel: '✓ FOR DRINKING',
                  desc: 'Filtered neutral water. Used for baby formula and medications.',
                },
                {
                  name: 'Beauty Water',
                  ph: 'pH 5.5–6.0',
                  drink: false,
                  color: 'border-pink-400/30 from-pink-950/30',
                  badge: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
                  badgeLabel: '✕ NOT FOR DRINKING',
                  desc: 'Slightly acidic. Gentle facial astringent, hair rinse, glass cleaning.',
                },
                {
                  name: 'Strong Kangen',
                  ph: 'pH 11.0+',
                  drink: false,
                  color: 'border-purple-400/30 from-purple-950/30',
                  badge: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
                  badgeLabel: '✕ NOT FOR DRINKING',
                  desc: 'High-alkaline water for kitchen degreasing and dishwashing.',
                },
                {
                  name: 'Strong Acidic',
                  ph: 'pH 2.5',
                  drink: false,
                  color: 'border-amber-400/30 from-amber-950/30',
                  badge: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
                  badgeLabel: '✕ NOT FOR DRINKING',
                  desc: 'Hypochlorous acid water for household surface sanitation.',
                },
              ].map((w, i) => (
                <div key={i} className={`rounded-2xl border ${w.color} bg-gradient-to-b to-slate-900/60 p-5 flex flex-col`}>
                  <span className={`self-start rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${w.badge} mb-3`}>
                    {w.badgeLabel}
                  </span>
                  <p className="font-mono text-xs text-slate-400 mb-1">{w.ph}</p>
                  <h3 className="text-base font-black text-white mb-2">{w.name}</h3>
                  <p className="text-xs leading-relaxed text-slate-400 flex-1">{w.desc}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              * Refer to the official LeveLuk JrIV owner's manual for detailed operating guidelines for each water setting.
            </p>
          </div>
        </section>

        {/* ─── FOUR PLATES TECHNOLOGY ─── */}
        <section className="py-24 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">ENGINEERED FOR EFFICIENCY</span>
                <h2 className="text-5xl font-black text-white sm:text-6xl leading-[1.0]">
                  FOUR SOLID<br />
                  <span className="text-cyan-400">ELECTRODE PLATES.</span>
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  The JrIV uses four solid platinum-coated titanium electrode plates to perform electrolysis. The reduced plate count helps keep energy consumption lower — 120W — while still allowing the machine to produce all five of Enagic's water types.
                </p>

                {/* Electrolysis process */}
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">Electrolysis Process</p>
                  {[
                    { n: '1', label: 'Source Tap Water', desc: 'Enters through cold faucet diverter valve' },
                    { n: '2', label: 'Internal Filtration', desc: 'High-grade antibacterial charcoal filter' },
                    { n: '3', label: 'Electrolysis Chamber', desc: '4 solid platinum-titanium plates split water' },
                    { n: '4', label: 'Dual Hose Output', desc: 'Selected water exits upper pipe or acidic hose' },
                  ].map((step) => (
                    <div key={step.n} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 border border-white/5 text-xs">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">{step.n}</span>
                      <span className="text-slate-300"><strong className="text-white">{step.label}:</strong> {step.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-4 text-xs text-slate-400">
                  <strong className="text-white block mb-1">Performance Notice:</strong>
                  Actual pH and ORP values vary with source water chemistry, flow rate, temperature, machine condition, and operating conditions. Published specifications represent standard laboratory testing conditions.
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { big: '4', label: 'Electrode Plates', sub: 'Solid Platinum-Coated Titanium' },
                  { big: '135×75', label: 'Plate Size (mm)', sub: 'Large solid surface area' },
                  { big: '120 W', label: 'Power Draw', sub: 'Energy-efficient operation' },
                  { big: '2.5–11.5', label: 'pH Range', sub: 'Full spectrum, 5 water types' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-cyan-400/30 transition-colors">
                    <div className="text-3xl font-black text-cyan-400">{stat.big}</div>
                    <div className="mt-1 text-sm font-bold text-white">{stat.label}</div>
                    <div className="mt-1 text-xs text-slate-400">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── ENERGY STORY ─── */}
        <section className="py-24 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

              {/* Water detail image */}
              <div className="lg:col-span-5 relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src="/true-legacy-assets/jr4-water-detail.jpg"
                  alt="Crystal clear water filling a glass from the LeveLuk JrIV"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080d18]/20 to-transparent" />
              </div>

              {/* Copy */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">120 WATTS</span>
                <h2 className="text-5xl font-black text-white sm:text-6xl leading-[1.0]">
                  DESIGNED TO DO MORE<br />
                  <span className="text-slate-400">WITH LESS.</span>
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  The JrIV operates at 120W — a lower power draw than Enagic's larger models. This reflects the machine's streamlined four-plate design, which is optimized for lower-demand households rather than maximum throughput.
                </p>

                {/* 4 ease-of-use features */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { n: '01', label: 'Touch-Button Selection', desc: 'Select your water mode from the front panel' },
                    { n: '02', label: 'Automatic Cleaning', desc: 'Microcomputer-triggered internal cleaning cycles' },
                    { n: '03', label: 'Smart Filter Notification', desc: 'LCD and buzzer alert when filter is due' },
                    { n: '04', label: 'Built-In Enhancer Tank', desc: 'For Strong Kangen (11.0+) and Strong Acidic (2.5)' },
                  ].map((feat) => (
                    <div key={feat.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-black text-cyan-400 mb-1.5">{feat.n}</div>
                      <p className="text-sm font-bold text-white">{feat.label}</p>
                      <p className="text-xs text-slate-400 mt-1">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── JRIV VS K8 ─── */}
        <section className="py-24 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">HONEST COMPARISON</span>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl leading-tight">
                WHICH KANGEN MACHINE<br />FITS YOUR HOME?
              </h2>
              <p className="mt-4 text-slate-300">Compare the streamlined JrIV against Enagic's flagship K8.</p>
            </div>

            {/* Side-by-side product cards */}
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {/* JrIV */}
              <div className="relative rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-cyan-950/30 to-slate-900/50 p-8 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/50 bg-[#060911] px-4 py-1 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                  RIGHT-SIZED
                </div>
                <img
                  src="/products/jr-iv.png"
                  alt="Enagic LeveLuk JrIV"
                  className="mx-auto h-40 w-auto object-contain mb-5 drop-shadow-[0_15px_30px_rgba(34,211,238,0.15)]"
                />
                <h3 className="text-xl font-black text-white">LeveLuk JrIV</h3>
                <p className="text-xs text-cyan-400 font-bold mb-5">Junior Model</p>
                <div className="space-y-2 text-sm text-left">
                  {[
                    ['Electrode Plates', '4 Solid Plates'],
                    ['Power Rating', '120W'],
                    ['Water Types', '5 Water Types'],
                    ['Best Suited For', 'Singles & Couples'],
                    ['Output Rate', '3.0–4.9 L/min'],
                    ['Warranty (U.S.)', '3 Years'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">{k}</span>
                      <span className="font-bold text-white text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-6 w-full rounded-xl bg-cyan-400 py-2.5 text-xs font-black text-slate-950 hover:bg-cyan-300 transition"
                >
                  Explore JrIV
                </button>
              </div>

              {/* K8 */}
              <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-slate-800/30 to-slate-900/50 p-8 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-[#060911] px-4 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  MAXIMUM CAPABILITY
                </div>
                <img
                  src="/products/k8.png"
                  alt="Enagic Leveluk K8"
                  className="mx-auto h-40 w-auto object-contain mb-5 drop-shadow-[0_15px_30px_rgba(255,255,255,0.06)]"
                />
                <h3 className="text-xl font-black text-white">Leveluk K8</h3>
                <p className="text-xs text-slate-400 font-bold mb-5">Flagship Model</p>
                <div className="space-y-2 text-sm text-left">
                  {[
                    ['Electrode Plates', '8 Solid Plates'],
                    ['Power Rating', '230W'],
                    ['Water Types', '5 Water Types'],
                    ['Best Suited For', 'Families & Heavy Use'],
                    ['Output Rate', '4.5–7.6 L/min'],
                    ['Warranty (U.S.)', '5 Years'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">{k}</span>
                      <span className="font-bold text-white text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/d/${activeSlug}/kangen`}
                  className="mt-6 block w-full rounded-xl border border-white/20 py-2.5 text-xs font-black text-white hover:bg-white/10 transition text-center"
                >
                  Explore K8
                </Link>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-500 max-w-2xl mx-auto">
              The JrIV is not the "cheaper K8" — it is the right-sized Kangen machine for lower-demand households. The K8 is not necessarily better for every visitor; the correct choice depends on household size, usage, and water conditions.
            </p>
          </div>
        </section>

        {/* ─── WHO IS IT FOR? ─── */}
        <section className="py-24 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">IS JRIV RIGHT FOR YOU?</span>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">IS JRIV<br />RIGHT FOR YOU?</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* YES IF */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/15 p-7">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">✓</div>
                  <div>
                    <h3 className="font-black text-white text-lg">YES IF</h3>
                    <p className="text-xs text-emerald-400 font-semibold">Strong match for your situation</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {[
                    "You're living alone",
                    "You're a couple",
                    'Your household has lower water-output requirements',
                    'You want the full five-water-type Kangen® experience',
                    'You prefer a streamlined, energy-efficient model',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CONSIDER K8 IF */}
              <div className="rounded-3xl border border-amber-500/30 bg-amber-950/15 p-7">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black">!</div>
                  <div>
                    <h3 className="font-black text-white text-lg">CONSIDER K8 IF</h3>
                    <p className="text-xs text-amber-400 font-semibold">Higher output requirements</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {[
                    'You have a larger household',
                    'You expect heavier continuous output requirements',
                    "You want Enagic's flagship eight-plate configuration",
                    'You need faster filling of multiple large bottles',
                    'You want the longest U.S. warranty (5 years)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-400/20 transition"
              >
                Not sure? Let's figure it out together
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ─── TECHNICAL SPECIFICATIONS ─── */}
        <section className="py-20 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">OFFICIAL U.S. REFERENCE DATA</span>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">LeveLuk JrIV Specifications</h2>
            </div>

            {/* Big number stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              {[
                { big: '4', label: 'ELECTRODE\nPLATES' },
                { big: '5', label: 'WATER\nTYPES' },
                { big: '120 W', label: 'POWER' },
                { big: '2.5–11.5', label: 'pH\nRANGE' },
                { big: '3 YR', label: 'WARRANTY\n(U.S.)' },
                { big: '6.3 kg', label: 'WEIGHT' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center hover:border-cyan-400/20 transition-colors">
                  <div className="text-2xl font-black text-cyan-400">{s.big}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-pre-line">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Full spec table */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/[0.05] text-xs font-bold uppercase tracking-wider text-cyan-300 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Specification</th>
                    <th className="px-6 py-4">Official Reference Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Electrode Plates</td><td className="px-6 py-3.5">4 solid plates</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Electrode Material</td><td className="px-6 py-3.5">Platinum-coated titanium</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Plate Size</td><td className="px-6 py-3.5">135 × 75 mm</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Published pH Range</td><td className="px-6 py-3.5">2.5 – 11.5</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Water Types</td><td className="px-6 py-3.5">5 distinct types</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Power Consumption</td><td className="px-6 py-3.5">120 W</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Total Weight</td><td className="px-6 py-3.5">6.3 kg (approx. 13.9 lbs)</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Dimensions (W × H × D)</td><td className="px-6 py-3.5">264 × 338 × 171 mm</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Kangen Water Production Rate</td><td className="px-6 py-3.5">3.0 – 4.9 L/min</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Acidic Water Production Rate</td><td className="px-6 py-3.5">0.2 – 1.9 L/min</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Strong Acidic Production Rate</td><td className="px-6 py-3.5">0.3 – 0.7 L/min</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Operation</td><td className="px-6 py-3.5">Fully automatic microcomputer</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Languages Displayed</td><td className="px-6 py-3.5">1 Language (English)</td></tr>
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Referenced U.S. Warranty</td><td className="px-6 py-3.5">3 Years Manufacturer Warranty</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">
              Specifications and included components can vary by geographic region. Confirm local voltage &amp; market specs prior to ordering.
            </p>
          </div>
        </section>

        {/* ─── OWNERSHIP & WARRANTY ACCORDIONS ─── */}
        <section className="py-20 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">OWNERSHIP EXPERIENCE</span>
              <h2 className="mt-3 text-3xl font-black text-white">Understand the Ownership Experience</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Internal Filtration Details',
                  body: 'The JrIV includes an internal FC1 high-grade filter utilizing premium antibacterial activated charcoal and calcium sulfite. It effectively reduces chlorine odor, taste, and sediment from municipal source water. It is not certified as a universal reverse-osmosis purifier.',
                },
                {
                  title: 'Filter Replacement Schedule',
                  body: 'Filter replacement timing depends on water usage volume and source water quality. The machine\'s smart notification system alerts you via the LCD screen and buzzer when replacement is due according to system metrics.',
                },
                {
                  title: 'Automatic & Periodic Cleaning',
                  body: 'The microcomputer automatically controls periodic internal cleaning cycles. Owners should also perform periodic deep cleaning (E-Cleaning with food-grade citric acid) according to official Enagic instructions to clear mineral scale from electrode plates.',
                },
                {
                  title: 'Manufacturer Warranty Terms',
                  body: 'The referenced U.S. model includes a 3-year manufacturer warranty covering defects in materials and workmanship. Regional terms and registration requirements vary by international market.',
                },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenOwnership(openOwnership === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/[0.02] transition cursor-pointer"
                  >
                    <span>{item.title}</span>
                    <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform ${openOwnership === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openOwnership === idx && (
                    <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5 mt-2">
                      {item.body}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://www.enagic.com/en_US/products/leveluk-jr4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition underline underline-offset-4"
              >
                <span>View Official Enagic JrIV Product Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-20 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">CLEAR ANSWERS</span>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Questions About the LeveLuk JrIV</h2>
            </div>

            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/[0.02] transition cursor-pointer text-sm"
                    >
                      <span className="pr-4">{item.q}</span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 mt-2">
                        {item.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── DISTRIBUTOR HANDOFF ─── */}
        <section className="py-20 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 to-slate-950 p-8 sm:p-10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src={portraitUrl}
                  alt={profile?.display_name || 'Leader'}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-xl shrink-0"
                />
                <div className="space-y-3 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">NOT SURE WHICH MACHINE FITS YOUR HOME?</span>
                  <h3 className="text-2xl font-black text-white">
                    Talk Directly with {leaderFirstName}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {isMehdi
                      ? `"I shared the JrIV with you because not everyone needs the largest machine. I'll help you review your household size, water source, faucet, expected usage, and budget — so you choose honestly."`
                      : `${leaderFirstName} can help you review your household needs, water source, faucet compatibility, and understand whether the JrIV or another Kangen model is the better fit.`
                    }
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Ask {leaderFirstName} About the JrIV
                    </a>
                    <Link
                      to={`/d/${activeSlug}/kangen`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition"
                    >
                      Compare with K8
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CLOSING CINEMATIC CTA ─── */}
        <section className="relative min-h-[520px] flex items-center overflow-hidden border-b border-white/10">
          <div className="absolute inset-0">
            <img
              src="/true-legacy-assets/jr4-closing-cta.jpg"
              alt="Premium kitchen with LeveLuk JrIV"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060911]/95 via-[#060911]/75 to-[#060911]/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060911]/60 via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">LEVELUK JRIV</span>
              <h2 className="mt-5 text-5xl font-black text-white sm:text-6xl leading-[1.0]">
                THE KANGEN EXPERIENCE.<br />
                <span className="text-cyan-400">RIGHT-SIZED FOR YOUR LIFE.</span>
              </h2>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
                Five water types. Four platinum-coated titanium plates. One streamlined way to bring Kangen Water® into your home.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-cyan-400 px-8 py-4 text-sm font-black text-slate-950 shadow-[0_10px_40px_rgba(34,211,238,0.35)] hover:bg-cyan-300 hover:scale-[1.02] transition-all"
                >
                  Get Started with JrIV
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/[0.07] px-7 py-4 text-sm font-bold text-white hover:bg-white/[0.12] transition backdrop-blur-sm"
                >
                  <MessageCircle className="h-4 w-4 text-cyan-400" />
                  Ask {leaderFirstName}
                </a>
                <Link
                  to={`/d/${activeSlug}/kangen`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.07] px-6 py-4 text-sm font-bold text-cyan-300 hover:bg-cyan-400/[0.12] transition"
                >
                  Compare with K8
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DISCLAIMER ─── */}
        <section className="py-8 bg-[#04060c]">
          <div className="mx-auto max-w-5xl px-4 text-center text-[11px] leading-relaxed text-slate-500">
            The LeveLuk JrIV is a water ionization system, not a substitute for safe source water, appropriate filtration, plumbing assessment, or medical care. Actual pH, ORP, flow rate, and water characteristics vary with source-water chemistry, pressure, temperature, flow, machine condition, settings, and maintenance. Product specifications, voltage, included components, warranty, availability, and permitted claims vary by market. Follow the official manual and local Enagic guidance.
          </div>
        </section>

      </main>

      <Footer />

      {/* STICKY MOBILE BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#060911]/95 border-t border-white/10 backdrop-blur-lg sm:hidden">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-xs font-black text-slate-950 shadow-lg shadow-cyan-400/20 active:scale-95"
        >
          Explore the JrIV
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* COMPATIBILITY ASSESSMENT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0d1322] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              {formSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Request Sent</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                    Thank you! {leaderFirstName} will review your faucet and household parameters and reach out shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setFormSuccess(false); setShowModal(false) }}
                    className="mt-4 rounded-xl bg-cyan-400 px-6 py-2.5 text-xs font-bold text-slate-950"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">FAUCET & HOUSEHOLD REVIEW</span>
                    <h3 className="text-xl font-black text-white mt-1">Check JrIV Compatibility</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Assigned Guide: <strong className="text-cyan-300">{profile?.display_name || 'Mehdi Cohen'}</strong>
                    </p>
                  </div>

                  {formError && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Phone / WhatsApp</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Country</label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Household Size</label>
                        <select
                          value={householdSize}
                          onChange={(e) => setHouseholdSize(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
                        >
                          <option value="1 Person">1 Person (Single)</option>
                          <option value="2 People">2 People (Couple)</option>
                          <option value="3+ People">3+ People (Family)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Faucet Style</label>
                        <select
                          value={faucetStyle}
                          onChange={(e) => setFaucetStyle(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
                        >
                          <option value="Standard Aerator">Standard Aerator</option>
                          <option value="Pull-Out Spray Head">Pull-Out Spray Head</option>
                          <option value="Designer / Square">Designer / Square Faucet</option>
                          <option value="Undersink Direct">Undersink Installation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Water Source</label>
                        <select
                          value={waterSource}
                          onChange={(e) => setWaterSource(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
                        >
                          <option value="City/Tap Water">City Municipal Tap Water</option>
                          <option value="Well Water">Private Well Water</option>
                          <option value="RO System">Reverse Osmosis Filter</option>
                          <option value="Unsure">Unsure</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Notes / Questions</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mention any specific faucet brand, sink space, or questions..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 w-full rounded-xl bg-cyan-400 py-3 text-xs font-black text-slate-950 hover:bg-cyan-300 transition cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Submit Compatibility Check'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
