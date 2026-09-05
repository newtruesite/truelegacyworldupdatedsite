import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Droplets,
  ExternalLink,
  Filter,
  Flame,
  Info,
  Layers,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Waves,
  Wrench,
  Zap,
  X,
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
  
  // Compatibility Modal State
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
        badge: 'THE COMPACT KANGEN WATER® STARTER MODEL',
        title: 'Leveluk JrIV',
        subtitle: 'Five Water Types. Compact Design. Built for Smaller Households.',
        heroBody:
          'Designed primarily for singles and couples, the Leveluk JrIV combines four platinum-coated titanium electrode plates, lower power consumption, automatic operation, and access to Enagic’s five water types.',
        sharedBy: `Shared personally with you by ${profile?.display_name || 'Mehdi Cohen'}`,
        primaryCta: 'See If the JrIV Fits My Home',
        secondaryCta: `Ask ${leaderFirstName}`,
        heroSpecs: 'Four electrode plates · 120 watts · Five water types · Three-year warranty (Ref. U.S. Market)',
      },
      es: {
        badge: 'EL MODELO COMPACTO DE INICIACIÓN KANGEN WATER®',
        title: 'Leveluk JrIV',
        subtitle: 'Cinco Tipos de Agua. Diseño Compacto. Creado para Hogares Pequeños.',
        heroBody:
          'Diseñado principalmente para personas solteras y parejas, el Leveluk JrIV combina cuatro placas de titanio revestidas en platino, menor consumo de energía, funcionamiento automático y acceso a los cinco tipos de agua de Enagic.',
        sharedBy: `Compartido personalmente por ${profile?.display_name || 'Mehdi Cohen'}`,
        primaryCta: 'Verificar si el JrIV se Adapta a mi Hogar',
        secondaryCta: `Consultar a ${leaderFirstName}`,
        heroSpecs: 'Cuatro placas de titanio · 120 vatios · Cinco tipos de agua · Garantía de 3 años (Mercado EE. UU.)',
      },
      fr: {
        badge: 'LE MODÈLE COMPACT DE DÉMARRAGE KANGEN WATER®',
        title: 'Leveluk JrIV',
        subtitle: 'Cinq Types d’Eau. Design Compact. Conçu pour les Petits Foyers.',
        heroBody:
          'Conçu principalement pour les personnes seules et les couples, le Leveluk JrIV combine quatre plaques en titane revêtues de platine, une consommation d’énergie réduite, un fonctionnement automatique et l’accès aux cinq types d’eau Enagic.',
        sharedBy: `Partagé personnellement par ${profile?.display_name || 'Mehdi Cohen'}`,
        primaryCta: 'Vérifier si le JrIV Convient à Mon Foyer',
        secondaryCta: `Demander à ${leaderFirstName}`,
        heroSpecs: 'Quatre plaques en titane · 120 watts · Cinq types d’eau · Garantie 3 ans (Réf. É.-U.)',
      },
      pt: {
        badge: 'O MODELO COMPACTO DE ENTRADA KANGEN WATER®',
        title: 'Leveluk JrIV',
        subtitle: 'Cinco Tipos de Água. Design Compacto. Criado para Lares Menores.',
        heroBody:
          'Projetado principalmente para pessoas solteiras e casais, o Leveluk JrIV combina quatro placas de titânio revestidas em platina, menor consumo de energia, operação automática e acesso aos cinco tipos de água da Enagic.',
        sharedBy: `Compartilhado pessoalmente por ${profile?.display_name || 'Mehdi Cohen'}`,
        primaryCta: 'Ver se o JrIV Serve para Minha Casa',
        secondaryCta: `Perguntar a ${leaderFirstName}`,
        heroSpecs: 'Quatro placas de titânio · 120 watts · Cinco tipos de água · Garantia de 3 anos (Ref. EUA)',
      },
    }[lang]
  }, [locale, profile, leaderFirstName])

  // FAQ Accordion Content (All 13 Required Questions)
  const faqList = useMemo(() => [
    {
      q: 'Is the JrIV recommended for a family?',
      a: 'Enagic recommends the JrIV primarily for singles or couples because it has fewer plates (4 plates), lower power consumption (120W), and lower water output rate than larger models. A larger household should compare more robust machines like the 8-plate Leveluk K8.',
    },
    {
      q: 'Does it produce all five water types?',
      a: 'Yes. Enagic lists Strong Kangen Water (pH 11.0+), Kangen Water (pH 8.5–9.5), Clean Water (pH 7.0), Beauty Water (pH 5.5–6.0), and Strong Acidic Water (pH 2.5).',
    },
    {
      q: 'Can I drink all five water types?',
      a: 'No. Only drink water modes officially designated for drinking: Kangen Water® (pH 8.5, 9.0, 9.5) and Clean Water (pH 7.0). Strong Kangen Water, Beauty Water, and Strong Acidic Water are NOT for drinking. Always follow the machine manual.',
    },
    {
      q: 'Is the JrIV a water purifier?',
      a: 'Do not describe it as a universal purifier. It includes internal filtration (high-grade antibacterial activated charcoal and calcium sulfite) combined with water-ionization technology. Actual contaminant reduction depends on the installed filter and source-water conditions.',
    },
    {
      q: 'Does it work with every faucet?',
      a: 'No. Faucet and plumbing compatibility must be assessed before ordering. Standard faucets with removable aerators connect directly with included diverters, while pull-out spray heads or custom designer faucets may require alternative plumbing or an undersink kit.',
    },
    {
      q: 'Can it use well water?',
      a: 'Suitability depends on tested source-water chemistry, pressure, sediment, hardness, iron, contaminants, and any required pre-treatment. Do not connect the machine to an unsuitable source without professional assessment.',
    },
    {
      q: 'Does the JrIV require an electrolysis enhancer?',
      a: 'The built-in enhancer tank is used specifically for production of Strong Kangen Water (pH 11.0+) and Strong Acidic Water (pH 2.5) according to official operating instructions.',
    },
    {
      q: 'How often does the filter need replacement?',
      a: 'It depends on the specific filter model, household water usage, and local water quality. The machine includes a smart filter-change notification (LCD and buzzer), but this should be understood as a system notification rather than a real-time purity test.',
    },
    {
      q: 'Is the JrIV medical-grade?',
      a: 'Do not use "medical-grade" unless the exact market-specific device has an applicable regulatory classification in that specific country that legally supports that wording. Enagic is an ISO 13485 certified medical device manufacturer in Japan.',
    },
    {
      q: 'Will it create the same results as the K8?',
      a: 'The JrIV and K8 produce the same categories of water, but they use different numbers of electrode plates (4 plates vs. 8 plates) and have different power ratings (120W vs. 230W) and flow production capabilities.',
    },
    {
      q: 'What is the warranty?',
      a: 'The referenced U.S. product page lists a three-year manufacturer warranty. Confirm the exact current warranty terms in the purchaser’s specific geographic market.',
    },
    {
      q: 'What does it cost?',
      a: 'Pricing, taxes, shipping, regional financing options, and promotions vary by market and country. Contact the verified distributor on this page for current official regional details.',
    },
    {
      q: 'Can I order it internationally?',
      a: 'Availability, voltage requirements (120V vs 220-240V), included components, warranty terms, and official ordering procedures vary by country. Confirm the correct regional model before purchasing.',
    },
  ], [])

  return (
    <div className="page-wrapper bg-[#060911] text-white min-h-screen font-sans selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`Leveluk JrIV | Compact Kangen Water System | ${profile?.display_name || 'True Legacy Guide'}`}
        description={`Explore the Leveluk JrIV, Enagic’s compact four-plate starter model designed primarily for singles and couples, with guidance from ${profile?.display_name || 'your guide'}.`}
        image="/products/jr-iv.png"
      />

      {/* 1. SIMPLIFIED PERSONALIZED HEADER (This page only) */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060911]/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={`/d/${activeSlug}`}
              label="Return to Leader Profile"
            />
            <Link to="/" className="flex items-center gap-2 group" aria-label="True Legacy World Home">
              <TrueLegacyLogo className="h-8 w-auto transition-transform group-hover:scale-105" />
              <span className="text-[10px] font-semibold text-cyan-400/90 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
                Leveluk JrIV
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Corner Leader Profile Badge */}
            <Link
              to={`/d/${activeSlug}`}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-2.5 py-1 transition-all group shrink-0"
              title={`Shared by ${profile?.display_name || 'Leader'}`}
            >
              <img
                src={portraitUrl}
                alt={profile?.display_name || 'Leader'}
                className="w-6 h-6 rounded-full object-cover border border-cyan-400/60 shrink-0 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/logos/tl-square-white.png'
                }}
              />
              <span className="hidden sm:inline text-xs font-bold text-white truncate max-w-[110px]">
                {leaderFirstName}
              </span>
            </Link>

            {/* Language Selector */}
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

            {/* Ask Distributor Header Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/30 hover:border-emerald-400 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask {leaderFirstName}</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* 2. PREMIUM HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#060911] to-[#080d18] pt-12 pb-20 border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(41,151,255,0.15),rgba(255,255,255,0))]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  {copy.badge}
                </div>

                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                  {copy.title}
                </h1>

                <p className="text-xl font-bold leading-snug text-cyan-200/90 sm:text-2xl">
                  {copy.subtitle}
                </p>

                <p className="text-base leading-relaxed text-slate-300 max-w-2xl mx-auto lg:mx-0">
                  {copy.heroBody}
                </p>

                {/* Personalized Guide Attribution */}
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 pr-5 backdrop-blur-md">
                  <img
                    src={portraitUrl}
                    alt={profile?.display_name || 'Leader'}
                    className="h-10 w-10 rounded-xl object-cover border border-cyan-400/30"
                  />
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-200">{copy.sharedBy}</p>
                    <p className="text-[#2997ff] font-medium">Verified True Legacy Guide</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span>{copy.primaryCta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20 hover:border-emerald-400 active:scale-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{copy.secondaryCta}</span>
                  </a>
                </div>

                {/* Supporting Spec Pills */}
                <div className="pt-2 text-xs text-slate-400 font-medium">
                  {copy.heroSpecs}
                </div>
              </div>

              {/* Right Column Product Image */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-2xl backdrop-blur-xl text-center group">
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-3xl blur-xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
                  
                  <img
                    src="/products/jr-iv.png"
                    alt="Enagic Leveluk JrIV Compact Kangen Water Machine"
                    className="relative z-10 mx-auto h-72 sm:h-80 w-auto object-contain drop-shadow-[0_15px_35px_rgba(41,151,255,0.25)] transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-left text-xs">
                    <div>
                      <p className="font-bold text-white">Enagic® Leveluk JrIV</p>
                      <p className="text-slate-400">Compact Countertop Format</p>
                    </div>
                    <span className="rounded-full bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 font-bold text-cyan-300">
                      120W · 4-Plate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. QUICK PRODUCT-FIT SUMMARY ("The JrIV at a Glance") */}
        <section className="py-12 bg-[#080d1a] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-cyan-950/30 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white sm:text-3xl">The JrIV at a Glance</h2>
                  <p className="text-sm text-slate-300 mt-1">Key technical & practical highlights of Enagic's junior starter model.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="self-start md:self-auto inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400 hover:text-black transition cursor-pointer"
                >
                  <span>Evaluate Household Fit</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Grid Highlights */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-6 text-sm">
                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                  <div>
                    <strong className="block text-white">Target Audience</strong>
                    <span className="text-slate-300 text-xs">Recommended primarily for singles and couples.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                  <div>
                    <strong className="block text-white">4 Electrode Plates</strong>
                    <span className="text-slate-300 text-xs">Solid platinum-coated titanium plates (135 × 75 mm).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                  <div>
                    <strong className="block text-white">5 Water Types</strong>
                    <span className="text-slate-300 text-xs">Produces all five Enagic water categories.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                  <div>
                    <strong className="block text-white">Lower Power Draw</strong>
                    <span className="text-slate-300 text-xs">120-watt power rating for energy efficiency.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                  <div>
                    <strong className="block text-white">Auto Cleaning & Enhancer Tank</strong>
                    <span className="text-slate-300 text-xs">Microcomputer cleaning & built-in enhancer tank.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                  <div>
                    <strong className="block text-white">3-Year Warranty (U.S.)</strong>
                    <span className="text-slate-300 text-xs">Referenced U.S. manufacturer warranty term.</span>
                  </div>
                </div>
              </div>

              {/* Highlighted Disclaimer Banner */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <Info className="h-5 w-5 shrink-0 text-amber-400" />
                <p>
                  <strong className="text-white font-bold">Important Distinction:</strong> Compact does not mean identical output. The Leveluk JrIV is designed for moderate household demand, not high-volume continuous output.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHO THE JrIV IS DESIGNED FOR ("Is the JrIV the Right Fit for You?") */}
        <section className="py-16 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-black text-white sm:text-4xl">Is the JrIV the Right Fit for You?</h2>
              <p className="mt-3 text-slate-300 text-base">
                An honest comparative assessment to ensure you select the machine that matches your household demand.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Column 1: A Strong Fit For */}
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/40 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">A Strong Fit For</h3>
                    <p className="text-xs text-emerald-400 font-semibold">Recommended for moderate household use</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-1" />
                    <span><strong>One-person households:</strong> Single individuals wanting direct daily Kangen Water.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-1" />
                    <span><strong>Couples:</strong> Two-person homes with moderate daily drinking & cooking needs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-1" />
                    <span><strong>Smaller kitchen footprints:</strong> Countertops where space is at a premium.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-1" />
                    <span><strong>Full 5-water access:</strong> Those who want all five water types including Strong Acidic (pH 2.5).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-1" />
                    <span><strong>Lower energy preference:</strong> Users prioritizing lower power draw (120W).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-1" />
                    <span><strong>Realistic expectations:</strong> Users who understand its lower flow rate vs 7-8 plate models.</span>
                  </li>
                </ul>
              </div>

              {/* Column 2: Consider a Larger Model If */}
              <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900/40 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                    !
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Consider a Larger Model If</h3>
                    <p className="text-xs text-amber-400 font-semibold">Higher volume or larger family needs</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 shrink-0 text-amber-400 mt-1" />
                    <span><strong>Larger households:</strong> Families of 3 or more people using water continuously throughout the day.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 shrink-0 text-amber-400 mt-1" />
                    <span><strong>High volume demand:</strong> Frequent filling of multiple large water jugs or heavy cooking.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 shrink-0 text-amber-400 mt-1" />
                    <span><strong>Commercial / Business use:</strong> Restaurants, spas, offices, or high-traffic environments.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 shrink-0 text-amber-400 mt-1" />
                    <span><strong>Faster flow expectations:</strong> Users expecting maximum ionization flow speeds.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 shrink-0 text-amber-400 mt-1" />
                    <span><strong>Desire for flagship performance:</strong> Those wanting 8-plate power (e.g. Leveluk K8).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Assessment Callout */}
            <div className="mt-8 text-center bg-cyan-950/30 border border-cyan-400/20 rounded-2xl p-6 text-sm text-slate-300">
              <p className="max-w-3xl mx-auto">
                <strong className="text-white font-bold">Guiding Principle:</strong> Choosing the correct machine matters more than choosing the lowest price. Your household size, water conditions, expected usage, and faucet installation should be reviewed before ordering.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FIVE WATER TYPES ("One Machine. Five Water Types.") */}
        <section className="py-16 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">VERSATILE IONIZATION SYSTEM</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl mt-2">One Machine. Five Water Types.</h2>
              <p className="mt-3 text-slate-300 text-base">
                The JrIV produces Enagic’s five water types for different drinking, cooking, cosmetic, and household applications.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* 1. Kangen Water */}
              <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-cyan-950/40 to-slate-900/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      ✓ INTENDED FOR DRINKING
                    </span>
                    <span className="text-xs font-mono text-cyan-300">pH 8.5 – 9.5</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Kangen Water®</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Electrolyzed hydrogen-rich drinking water designed for daily hydration, brewing tea, and preparing healthy meals.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-slate-400">
                  Official Use: Daily drinking water, food preparation, soups, tea & coffee.
                </div>
              </div>

              {/* 2. Clean Water */}
              <div className="rounded-3xl border border-blue-400/30 bg-gradient-to-b from-blue-950/40 to-slate-900/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      ✓ INTENDED FOR DRINKING
                    </span>
                    <span className="text-xs font-mono text-blue-300">pH 7.0 Neutral</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Clean Water</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Purified, non-ionized filtered water passed through the high-grade internal filter without electrolysis.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-slate-400">
                  Official Use: Baby formula preparation and taking prescription medications.
                </div>
              </div>

              {/* 3. Beauty Water */}
              <div className="rounded-3xl border border-pink-400/30 bg-gradient-to-b from-pink-950/30 to-slate-900/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                      ✕ NOT FOR DRINKING
                    </span>
                    <span className="text-xs font-mono text-pink-300">pH 5.5 – 6.0</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Beauty Water</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Slightly acidic water matching the natural pH range of human skin for gentle facial astringent and hair rinsing.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-slate-400">
                  Official Use: Face washing, skin toning, hair rinsing, glass cleaning.
                </div>
              </div>

              {/* 4. Strong Kangen Water */}
              <div className="rounded-3xl border border-purple-400/30 bg-gradient-to-b from-purple-950/30 to-slate-900/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                      ✕ NOT FOR DRINKING
                    </span>
                    <span className="text-xs font-mono text-purple-300">pH 11.0+</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Strong Kangen Water</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    High-alkaline non-drinking water produced using the electrolysis enhancer tank for emulsifying grease and kitchen cleaning.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-slate-400">
                  Official Use: Dishwashing, kitchen degreasing, washing cutting boards.
                </div>
              </div>

              {/* 5. Strong Acidic Water */}
              <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-950/30 to-slate-900/60 p-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                      ✕ NOT FOR DRINKING
                    </span>
                    <span className="text-xs font-mono text-amber-300">pH 2.5</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Strong Acidic Water</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Hypochlorous acid water generated via electrolysis enhancer for external non-drinking household sanitation.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-slate-400">
                  Official Use: Sanitizing countertops, utensils, hands, and household surfaces.
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-400">
              * Refer to the official Leveluk JrIV owner's manual for detailed operating guidelines for each water setting.
            </div>
          </div>
        </section>

        {/* 6. FOUR-PLATE TECHNOLOGY ("Four Solid Platinum-Coated Titanium Plates") */}
        <section className="py-16 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  COMPACT ELECTROLYSIS TECHNOLOGY
                </span>

                <h2 className="text-3xl font-black text-white sm:text-4xl">
                  Four Solid Platinum-Coated Titanium Plates
                </h2>

                <p className="text-sm leading-relaxed text-slate-300">
                  The Leveluk JrIV uses four solid platinum-coated titanium electrode plates to perform electrolysis. Its smaller electrode configuration reduces energy consumption (120W) compared with Enagic’s more powerful models while still allowing it to produce the complete five-water system.
                </p>

                {/* Tech Diagram Flow */}
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="text-xs font-bold uppercase text-cyan-300 tracking-wider">Electrolysis Process Flow</div>
                  
                  <div className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">1</span>
                      <span><strong>Source Tap Water:</strong> Enters through cold water faucet diverter valve.</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">2</span>
                      <span><strong>Internal Filtration:</strong> High-grade antibacterial charcoal filter removes chlorine & sediment.</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">3</span>
                      <span><strong>Electrolysis Chamber:</strong> 4 solid platinum-coated titanium plates split water molecules.</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">4</span>
                      <span><strong>Dual Hose Output:</strong> Selected water streams out upper flexible pipe and lower acidic hose.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-cyan-400/20 bg-cyan-950/20 text-xs text-slate-300">
                  <strong className="text-white block mb-1">Performance Notice:</strong>
                  Actual pH and ORP values vary with source water chemistry, flow rate, temperature, machine condition, and operating conditions. Published specifications represent standard laboratory testing conditions.
                </div>
              </div>

              {/* Right Column Tech Cards */}
              <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
                  <div className="text-4xl font-black text-cyan-400">4</div>
                  <div className="mt-1 text-sm font-bold text-white">Electrode Plates</div>
                  <div className="mt-1 text-xs text-slate-400">Solid Platinum-Coated Titanium</div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
                  <div className="text-4xl font-black text-cyan-400">135×75</div>
                  <div className="mt-1 text-sm font-bold text-white">Plate Size (mm)</div>
                  <div className="mt-1 text-xs text-slate-400">Large Solid Surface Area</div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
                  <div className="text-4xl font-black text-cyan-400">120 W</div>
                  <div className="mt-1 text-sm font-bold text-white">Power Draw</div>
                  <div className="mt-1 text-xs text-slate-400">Energy-efficient operation</div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
                  <div className="text-4xl font-black text-cyan-400">-450 mV</div>
                  <div className="mt-1 text-sm font-bold text-white">Published ORP</div>
                  <div className="mt-1 text-xs text-slate-400">Under specified test conditions</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. USER-FRIENDLY OWNERSHIP ("Designed to Keep Everyday Use Simple") */}
        <section className="py-16 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">INTUITIVE OPERATION</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl mt-2">Designed to Keep Everyday Use Simple</h2>
              <p className="mt-3 text-slate-300 text-base">
                Four core system features that make operating and caring for the Leveluk JrIV effortless.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 mb-4 font-bold">
                    01
                  </div>
                  <h3 className="text-lg font-black text-white">Touch-Button Selection</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Select your desired water mode effortlessly using the control panel on the machine’s front face.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 mb-4 font-bold">
                    02
                  </div>
                  <h3 className="text-lg font-black text-white">Automatic Cleaning</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    The internal microcomputer periodically triggers a self-cleaning cycle to maintain electrode performance.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 mb-4 font-bold">
                    03
                  </div>
                  <h3 className="text-lg font-black text-white">Smart Filter Notification</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    The LCD and buzzer notify you when the system detects that filter replacement is due based on volume & usage.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 mb-4 font-bold">
                    04
                  </div>
                  <h3 className="text-lg font-black text-white">Built-In Enhancer Tank</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Supports production of Strong Kangen (pH 11.0+) and Strong Acidic (pH 2.5) water when operated according to instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TECHNICAL SPECIFICATIONS TABLE */}
        <section className="py-16 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">OFFICIAL U.S. REFERENCE DATA</span>
              <h2 className="text-3xl font-black text-white mt-2">Leveluk JrIV Specifications</h2>
            </div>

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
                  <tr className="hover:bg-white/[0.02]"><td className="px-6 py-3.5 font-bold text-white">Published Negative ORP</td><td className="px-6 py-3.5">-450 mV (under test conditions)</td></tr>
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

            <p className="mt-4 text-center text-xs text-slate-400">
              Specifications and included components can vary by geographic region. Confirm local voltage & market specs prior to ordering.
            </p>
          </div>
        </section>

        {/* 9. INSTALLATION AND COMPATIBILITY ASSESSMENT */}
        <section className="py-16 bg-[#080d18] border-b border-white/10" id="installation">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-slate-950 p-8 sm:p-12 shadow-2xl">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">PRE-ORDER FAUCET ASSESSMENT</span>
                  <h2 className="text-3xl font-black text-white sm:text-4xl">Before the JrIV Reaches Your Counter</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Countertop ionizer installation depends on your existing kitchen faucet style, available space, and water pressure. Let us evaluate your setup before ordering to guarantee seamless installation.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs text-slate-300 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span>Standard Aerator Threading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span>Counter Dimensions (264 × 338 mm)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span>Nearby Grounded Electric Outlet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span>Source Water Chemistry & Pressure</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 text-center lg:text-right">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="inline-flex min-h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-cyan-400 px-8 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition cursor-pointer"
                  >
                    <span>Check My Faucet Compatibility</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. JrIV VERSUS K8 COMPARISON */}
        <section className="py-16 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">HONEST MODEL COMPARISON</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl mt-2">JrIV or K8: Which One Fits Your Life?</h2>
              <p className="mt-3 text-slate-300 text-base">
                Compare Enagic’s junior starter model with the flagship 8-plate Leveluk K8.
              </p>
            </div>

            {/* Desktop Comparison Table */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/[0.05] text-xs font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-slate-400">Category</th>
                    <th className="px-6 py-4 text-cyan-300">Leveluk JrIV (Junior Model)</th>
                    <th className="px-6 py-4 text-cyan-400">Leveluk K8 (Flagship Model)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">Best Suited For</td>
                    <td className="px-6 py-4 text-slate-200">Singles and couples</td>
                    <td className="px-6 py-4 text-slate-200">Larger households or heavy use</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">Electrode Plates</td>
                    <td className="px-6 py-4 font-mono text-cyan-300">4 Solid Platinum-Coated Titanium</td>
                    <td className="px-6 py-4 font-mono text-cyan-400">8 Solid Platinum-Coated Titanium</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">Power Rating</td>
                    <td className="px-6 py-4">120 W</td>
                    <td className="px-6 py-4">230 W</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">Water Types</td>
                    <td className="px-6 py-4">5 Water Types</td>
                    <td className="px-6 py-4">5 Water Types</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">Water Output Rate</td>
                    <td className="px-6 py-4">Moderate (3.0–4.9 L/min)</td>
                    <td className="px-6 py-4">Higher / Rapid Flow (4.5–7.6 L/min)</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">Physical Format</td>
                    <td className="px-6 py-4">Compact Countertop</td>
                    <td className="px-6 py-4">Full Flagship Format</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold text-white">Manufacturer Warranty (U.S.)</td>
                    <td className="px-6 py-4">3 Years</td>
                    <td className="px-6 py-4">5 Years</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Comparison Cards */}
            <div className="md:hidden space-y-6">
              <div className="rounded-3xl border border-cyan-400/30 bg-cyan-950/20 p-6 space-y-3 text-sm">
                <div className="font-black text-cyan-300 text-lg border-b border-white/10 pb-2">Leveluk JrIV (Starter)</div>
                <div className="flex justify-between"><span>Plates:</span><strong className="text-white">4 Solid Plates</strong></div>
                <div className="flex justify-between"><span>Power:</span><strong className="text-white">120W</strong></div>
                <div className="flex justify-between"><span>Best for:</span><strong className="text-white">Singles & Couples</strong></div>
                <div className="flex justify-between"><span>Output:</span><strong className="text-white">Moderate Flow</strong></div>
                <div className="flex justify-between"><span>Warranty (US):</span><strong className="text-white">3 Years</strong></div>
              </div>

              <div className="rounded-3xl border border-cyan-400/40 bg-slate-900/60 p-6 space-y-3 text-sm">
                <div className="font-black text-cyan-400 text-lg border-b border-white/10 pb-2">Leveluk K8 (Flagship)</div>
                <div className="flex justify-between"><span>Plates:</span><strong className="text-white">8 Solid Plates</strong></div>
                <div className="flex justify-between"><span>Power:</span><strong className="text-white">230W</strong></div>
                <div className="flex justify-between"><span>Best for:</span><strong className="text-white">Families & Heavy Use</strong></div>
                <div className="flex justify-between"><span>Output:</span><strong className="text-white">Rapid Flow</strong></div>
                <div className="flex justify-between"><span>Warranty (US):</span><strong className="text-white">5 Years</strong></div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-300 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
              The K8 is not automatically necessary for every visitor, and the JrIV is not appropriate for every household. The correct choice depends on household demand, water conditions, expected use, budget, and long-term goals.
            </div>

            <div className="mt-6 text-center">
              <Link
                to={`/d/${activeSlug}/kangen`}
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition"
              >
                <span>View Full K8 Flagship Details</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 11. FILTERS, CLEANING AND WARRANTY */}
        <section className="py-16 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">OWNERSHIP EXPERIENCE</span>
              <h2 className="text-3xl font-black text-white mt-2">Understand the Ownership Experience</h2>
            </div>

            <div className="space-y-4">
              {/* Accordion 1: Internal Filtration */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenOwnership(openOwnership === 0 ? null : 0)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/[0.02] transition cursor-pointer"
                >
                  <span>Internal Filtration Details</span>
                  <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform ${openOwnership === 0 ? 'rotate-180' : ''}`} />
                </button>
                {openOwnership === 0 && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5 mt-2">
                    The JrIV includes an internal FC1 high-grade filter utilizing premium antibacterial activated charcoal and calcium sulfite. It effectively reduces chlorine odor, taste, and sediment from municipal source water. It is not certified as a universal reverse-osmosis purifier.
                  </div>
                )}
              </div>

              {/* Accordion 2: Filter Replacement */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenOwnership(openOwnership === 1 ? null : 1)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/[0.02] transition cursor-pointer"
                >
                  <span>Filter Replacement Schedule</span>
                  <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform ${openOwnership === 1 ? 'rotate-180' : ''}`} />
                </button>
                {openOwnership === 1 && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5 mt-2">
                    Filter replacement timing depends on water usage volume and source water quality. The machine's smart notification system alerts you via the LCD screen and buzzer when replacement is due according to system metrics.
                  </div>
                )}
              </div>

              {/* Accordion 3: Automatic and Deep Cleaning */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenOwnership(openOwnership === 2 ? null : 2)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/[0.02] transition cursor-pointer"
                >
                  <span>Automatic & Periodic Cleaning</span>
                  <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform ${openOwnership === 2 ? 'rotate-180' : ''}`} />
                </button>
                {openOwnership === 2 && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5 mt-2">
                    The microcomputer automatically controls periodic internal cleaning cycles. Owners should also perform periodic deep cleaning (E-Cleaning with food-grade citric acid) according to official Enagic instructions to clear mineral scale from electrode plates.
                  </div>
                )}
              </div>

              {/* Accordion 4: Manufacturer Warranty */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenOwnership(openOwnership === 3 ? null : 3)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/[0.02] transition cursor-pointer"
                >
                  <span>Manufacturer Warranty Terms</span>
                  <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform ${openOwnership === 3 ? 'rotate-180' : ''}`} />
                </button>
                {openOwnership === 3 && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5 mt-2">
                    The referenced U.S. model includes a 3-year manufacturer warranty covering defects in materials and workmanship. Regional terms and registration requirements vary by international market.
                  </div>
                )}
              </div>
            </div>

            {/* Official External Link */}
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

        {/* 12. FREQUENTLY ASKED QUESTIONS */}
        <section className="py-16 bg-[#060911] border-b border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">CLEAR ANSWERS</span>
              <h2 className="text-3xl font-black text-white mt-2">Questions About the Leveluk JrIV</h2>
            </div>

            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/[0.02] transition cursor-pointer text-sm sm:text-base"
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

        {/* 13. PERSONAL DISTRIBUTOR GUIDANCE */}
        <section className="py-16 bg-[#080d18] border-b border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 to-slate-950 p-8 sm:p-10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src={portraitUrl}
                  alt={profile?.display_name || 'Mehdi Cohen'}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-xl shrink-0"
                />
                <div className="space-y-3 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">YOUR PERSONAL WATER GUIDE</span>
                  <h3 className="text-2xl font-black text-white">Find the Right Machine With {leaderFirstName}</h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isMehdi ? (
                      `"I shared the JrIV with you because not everyone needs the largest machine. For a single person or couple with moderate water needs, the JrIV may be a more practical way to access Enagic’s five water types while using less power and taking up less counter space. The important part is choosing honestly. I’ll help you review your household size, water source, faucet, expected usage, and available options so you can understand whether the JrIV fits you or whether another model makes more sense."`
                    ) : (
                      `${leaderFirstName} can help you review your household needs, water source, faucet compatibility, and current official JrIV options.`
                    )}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Ask {leaderFirstName} About the JrIV</span>
                    </a>

                    <Link
                      to={`/d/${activeSlug}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition"
                    >
                      <span>View {leaderFirstName}’s Profile</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14. FINAL COMPATIBILITY CTA */}
        <section className="py-20 bg-gradient-to-b from-[#0a0f1d] to-[#04060c] text-center border-b border-white/10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">START WITH THE RIGHT FIT</span>
            <h2 className="text-3xl font-black text-white sm:text-4xl mt-3">
              Could the Leveluk JrIV Be Right for Your Home?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Review your household size, water source, faucet compatibility, current pricing, and official market options with the verified distributor who shared this page.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-8 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-cyan-400/25 hover:bg-cyan-300 transition cursor-pointer"
              >
                <span>Check My JrIV Compatibility</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3.5 text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message {leaderFirstName}</span>
              </a>
            </div>

            <div className="mt-6 text-xs text-slate-400">
              Clear information. Honest comparison. Personal guidance.
            </div>
          </div>
        </section>

        {/* 15. PRODUCT DISCLAIMER */}
        <section className="py-8 bg-[#04060c]">
          <div className="mx-auto max-w-5xl px-4 text-center text-[11px] leading-relaxed text-slate-500">
            The Leveluk JrIV is a water ionization system, not a substitute for safe source water, appropriate filtration, plumbing assessment, or medical care. Actual pH, ORP, flow rate, and water characteristics vary with source-water chemistry, pressure, temperature, flow, machine condition, settings, and maintenance. Product specifications, voltage, included components, warranty, availability, and permitted claims vary by market. Follow the official manual and local Enagic guidance.
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
          <span>Check JrIV Compatibility</span>
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
                  <h3 className="text-2xl font-black text-white">Compatibility Request Sent</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                    Thank you! {leaderFirstName} will review your faucet and household parameters and reach out shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSuccess(false)
                      setShowModal(false)
                    }}
                    className="mt-4 rounded-xl bg-cyan-400 px-6 py-2.5 text-xs font-bold text-slate-950"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">FAUCET & HOUSHOLD REVIEW</span>
                    <h3 className="text-xl font-black text-white">Check JrIV Faucet Compatibility</h3>
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
                    {submitting ? 'Evaluating...' : 'Submit Compatibility Check'}
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
