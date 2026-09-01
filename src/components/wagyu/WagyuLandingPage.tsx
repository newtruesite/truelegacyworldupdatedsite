import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sun,
  Flame,
  Truck,
  PackageCheck,
  Utensils,
  Award,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Send,
  X,
  AlertTriangle,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { DistributorBuyButton } from '@/components/products/DistributorBuyButton'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { getLeaderPortrait, getPublicDistributors, submitCrmApplication, type PublicDistributor } from '@/lib/crm'

interface WagyuLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

export function WagyuLandingPage({ profile: propProfile, distributorSlug }: WagyuLandingPageProps) {
  const { locale, setLocale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null>(propProfile || null)
  const [loadingProfile, setLoadingProfile] = useState(!propProfile)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false))
  }, [propProfile, activeSlug])

  const distributorFirstName = profile?.display_name ? profile.display_name.split(' ')[0] : 'Mehdi'
  const distributorFullName = profile?.display_name || 'Mehdi Cohen'

  const whatsappMessage = useMemo(() => {
    return encodeURIComponent(
      `Hi ${distributorFirstName}, I viewed your Kangen Wagyu page and would like to learn more about the available sets, shipping, and official ordering options.`
    )
  }, [distributorFirstName])

  const whatsappUrl = useMemo(() => {
    const rawPhone = profile?.phone || '15146194689'
    const cleanPhone = rawPhone.replace(/\D/g, '')
    return `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
  }, [profile, whatsappMessage])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await submitCrmApplication({
        full_name: fullName,
        email: email || `${phone.replace(/\D/g, '')}@noemail.temp`,
        phone,
        country,
        sponsor_name: distributorFullName,
        sponsor_slug: activeSlug,
        interest: 'wagyu',
        source: 'wagyu_landing_page',
        notes: `Kangen Wagyu inquiry submitted from /d/${activeSlug}/wagyu`,
      })
      setFormSuccess(true)
    } catch (err: any) {
      setFormError(err?.message || 'Submission error. Please contact via WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  // Multilingual Copies
  const copy = useMemo(() => {
    if (locale === 'es') {
      return {
        seoTitle: `Kangen Wagyu® | Wagyu Americano Premium | ${distributorFullName}`,
        seoDesc: `Descubre Kangen Wagyu®, carne Wagyu americana premium criada en Masami Ranch en Corning, California con agua Kangen diaria y orientación personalizada de ${distributorFullName}.`,
        eyebrow: 'WAGYU AMERICANO PREMIUM · MASAMI RANCH, CALIFORNIA',
        title: 'Kangen Wagyu®',
        subtitle: 'Herencia Japonesa. Crianza Americana. Una Experiencia Culinaria Inolvidable.',
        body: 'Criado en Masami Ranch en Corning, California, Kangen Wagyu combina la genética Kuroge Wagyu japonesa con Black Angus y una crianza meticulosa que incluye hidratación diaria con Agua Kangen.',
        sharedBy: `Compartido personalmente contigo por ${distributorFullName}`,
        ctaPrimary: 'Explorar la Colección',
        ctaSecondary: `Consultar a ${distributorFirstName}`,
        supportText: 'Wagyu Americano Premium · Empacado al Vacío · Envíos en mercados de EE. UU. autorizados',
      }
    }
    if (locale === 'fr') {
      return {
        seoTitle: `Kangen Wagyu® | Wagyu Américain d'Exception | ${distributorFullName}`,
        seoDesc: `Découvrez Kangen Wagyu®, du Wagyu américain d'exception élevé au Masami Ranch en Californie avec de l'Eau Kangen au quotidien et les conseils de ${distributorFullName}.`,
        eyebrow: 'WAGYU AMÉRICAIN PREMIUM · MASAMI RANCH, CALIFORNIE',
        title: 'Kangen Wagyu®',
        subtitle: 'Héritage Japonais. Élevage Américain. Une Expérience Culinaire Inoubliable.',
        body: 'Élevé au ranch Masami à Corning, en Californie, Kangen Wagyu associe la génétique Kuroge Wagyu japonaise au Black Angus et à un élevage attentionné incluant de l’Eau Kangen au quotidien.',
        sharedBy: `Partagé personnellement avec vous par ${distributorFullName}`,
        ctaPrimary: 'Explorer la Collection',
        ctaSecondary: `Demander à ${distributorFirstName}`,
        supportText: 'Wagyu Américain Premium · Emballé sous vide · Livré dans les marchés américains pris en charge',
      }
    }
    if (locale === 'pt') {
      return {
        seoTitle: `Kangen Wagyu® | Wagyu Americano Premium | ${distributorFullName}`,
        seoDesc: `Descubra Kangen Wagyu®, carne Wagyu americana premium criada na Masami Ranch na Califórnia com água Kangen diária e orientação de ${distributorFullName}.`,
        eyebrow: 'WAGYU AMERICANO PREMIUM · MASAMI RANCH, CALIFÓRNIA',
        title: 'Kangen Wagyu®',
        subtitle: 'Herança Japonesa. Criação Americana. Uma Experiência Culinária Inesquecível.',
        body: 'Criado na Masami Ranch em Corning, Califórnia, Kangen Wagyu combina a genética japonesa Kuroge Wagyu com Black Angus e uma criação dedicada que inclui hidratação diária com Água Kangen.',
        sharedBy: `Compartilhado pessoalmente com você por ${distributorFullName}`,
        ctaPrimary: 'Explorar a Coleção',
        ctaSecondary: `Perguntar a ${distributorFirstName}`,
        supportText: 'Wagyu Americano Premium · Embalado a vácuo · Entregue em mercados dos EUA suportados',
      }
    }
    // Default EN
    return {
      seoTitle: `Kangen Wagyu® | Premium American Wagyu | ${distributorFullName}`,
      seoDesc: `Explore Kangen Wagyu®, premium American Wagyu raised at Masami Ranch in Corning, California with daily Kangen Water hydration and personal guidance from ${distributorFullName}.`,
      eyebrow: 'PREMIUM AMERICAN WAGYU · MASAMI RANCH, CALIFORNIA',
      title: 'Kangen Wagyu®',
      subtitle: 'Japanese Heritage. American Ranching. An Unforgettable Culinary Experience.',
      body: 'Raised at Masami Ranch in Corning, California, Kangen Wagyu combines Japanese Kuroge Wagyu genetics with Black Angus and a deliberate ranching approach that includes daily Kangen Water hydration.',
      sharedBy: `Shared personally with you by ${distributorFullName}`,
      ctaPrimary: 'Explore the Collection',
      ctaSecondary: `Ask ${distributorFirstName}`,
      supportText: 'Premium American Wagyu · Vacuum-sealed · Delivered in supported U.S. markets',
    }
  }, [locale, distributorFullName, distributorFirstName])

  // Trust Strip Features
  const trustItems = [
    'Raised in Corning, California',
    'Japanese Kuroge Wagyu × Black Angus',
    'Daily Kangen Water Hydration',
    'Grass-Fed & Grain-Finished',
    'No Added Hormones',
    'No Antibiotics',
    'No Animal Byproducts',
    'Vacuum-Sealed for Delivery',
  ]

  // FAQs
  const faqs = [
    {
      q: 'Is Kangen Wagyu raised in Japan?',
      a: 'The current official Enagic product information identifies Kangen Wagyu as premium American Wagyu raised at Masami Ranch in Corning, California.',
    },
    {
      q: 'Is it Japanese A5 Wagyu?',
      a: 'No. It should not be described as Japanese A5 Wagyu or Kobe beef. Enagic describes the cattle as an F1 cross between fullblood Japanese Kuroge Wagyu and high-quality Black Angus.',
    },
    {
      q: 'What does F1 American Wagyu mean?',
      a: 'In this context, F1 refers to a first-generation crossbreed between fullblood Japanese Kuroge Wagyu genetics and American Black Angus cattle, combining Wagyu marbling with familiar American beef structure.',
    },
    {
      q: 'Do the cattle drink Kangen Water?',
      a: 'Enagic states that the cattle at Masami Ranch are hydrated daily with Kangen Water as part of their daily hydration routine.',
    },
    {
      q: 'Does Kangen Water make the beef healthier or cause greater marbling?',
      a: 'The hydration practice is a defining part of Enagic’s ranch story, but it should not be interpreted as a medical, health, or scientific causal guarantee regarding marbling or nutrition.',
    },
    {
      q: 'Is the beef 100% grass-fed?',
      a: 'Enagic describes the cattle as grass-fed and grain-finished with a balanced vegetarian diet. It should not be described as 100% grass-fed or grass-finished.',
    },
    {
      q: 'Are added hormones or antibiotics used?',
      a: 'Enagic states that the cattle are raised with no added hormones, no antibiotics, and no animal byproducts.',
    },
    {
      q: 'What comes in the Premium First-Order Set?',
      a: 'The official first-order reference (SKU 2115) currently lists five 8 oz steaks, twelve 4 oz gourmet burger patties, and twelve 3 oz artisan sausages (29 pieces total).',
    },
    {
      q: 'Is the jerky 100% Wagyu beef?',
      a: 'The official description identifies the jerky as a blend of Kangen Wagyu and Angus beef, packaged in 12 individual 8 oz pouches.',
    },
    {
      q: 'Where is shipping available?',
      a: 'The official product currently markets direct vacuum-sealed delivery in supported U.S. markets. Confirm specific destination eligibility before ordering.',
    },
    {
      q: 'How are the cuts shipped and delivered?',
      a: 'Available cuts are vacuum-sealed and handled through official cold-chain shipping to preserve freshness through delivery.',
    },
    {
      q: 'How should Kangen Wagyu be stored and prepared?',
      a: 'Follow the storage, thawing, food safety, and cooking instructions included with your shipment. Because Wagyu features pronounced marbling, moderate heat and careful thawing yield optimal culinary results.',
    },
    {
      q: 'What if there is an issue with a perishable shipment?',
      a: 'Perishable shipments are handled through official Enagic shipping support policies. Inspect your order promptly upon arrival.',
    },
    {
      q: 'Does purchasing Kangen Wagyu connect to the Enagic business program?',
      a: 'This page is a consumer culinary experience. If you have questions about distributor points, commission eligibility, or business details, your independent distributor can provide official disclosures.',
    },
    {
      q: 'How do I place an official order?',
      a: 'Click any official ordering button on this page to be routed to the verified Enagic product destination with your distributor’s referral attribution intact.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#060810] text-[#e2e8f0] selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      <SEO title={copy.seoTitle} description={copy.seoDesc} />

      {/* 1. SIMPLIFIED PERSONALIZED HEADER */}
      <header className="sticky top-0 z-50 border-b border-amber-900/20 bg-[#060810]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <TrueLegacyLogo className="h-8 w-auto text-amber-100 group-hover:scale-105 transition-transform" />
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center rounded-lg border border-amber-500/20 bg-amber-950/20 p-1 text-xs font-bold">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`px-2 py-1 rounded transition-colors ${
                    locale === lang ? 'bg-amber-500/30 text-amber-200 border border-amber-400/30 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Personalized Ask Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-600/30 to-amber-900/40 px-4 py-2 text-xs font-black text-amber-200 hover:border-amber-300 hover:bg-amber-500/30 transition-all shadow-md"
            >
              <MessageCircle className="h-4 w-4 text-amber-300" />
              <span>Ask {distributorFirstName}</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* 2. CINEMATIC WAGYU HERO */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-28 border-b border-amber-900/20">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-red-950/30 via-amber-950/20 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              {/* Left Copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-4 py-1.5 text-xs font-black tracking-wider text-amber-300 uppercase shadow-inner">
                  <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span>{copy.eyebrow}</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  {copy.title}
                </h1>

                <p className="text-xl sm:text-2xl font-bold text-amber-200/90 leading-snug">
                  {copy.subtitle}
                </p>

                <p className="text-base text-[#cccccc] leading-relaxed max-w-2xl">
                  {copy.body}
                </p>

                {/* Personalized Guide Badge */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-black p-3.5 max-w-md shadow-lg">
                  <img
                    src={getLeaderPortrait(distributorFirstName)}
                    alt={distributorFullName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-amber-400/40 shadow"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/images/mehdi-portrait.png'
                    }}
                  />
                  <div>
                    <p className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider">
                      {copy.sharedBy}
                    </p>
                    <p className="text-sm font-black text-white">{distributorFullName}</p>
                    <p className="text-[11px] text-slate-400">Independent Enagic Distributor</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href="#collection"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-6 py-3 text-sm font-black text-slate-950 hover:from-amber-400 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    <span>{copy.ctaPrimary}</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-950/30 px-6 py-3 text-sm font-bold text-amber-200 hover:bg-amber-900/40 hover:border-amber-300 transition-all"
                  >
                    <MessageCircle className="h-4 w-4 text-amber-400" />
                    <span>{copy.ctaSecondary}</span>
                  </a>
                </div>

                <p className="text-xs text-slate-400 font-medium pt-1">
                  {copy.supportText}
                </p>
              </motion.div>

              {/* Right Media Hero Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900/80 via-amber-950/40 to-black p-4 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 text-center">
                    <img
                      src="/products/wagyu-hero-steak.jpg"
                      alt="Kangen Wagyu Grilled Ribeye Steak"
                      className="max-h-[300px] sm:max-h-[340px] w-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-4 p-3 text-center space-y-1 bg-black/40 rounded-xl border border-amber-500/20">
                    <h3 className="text-base font-black text-amber-200">Kangen Wagyu® Collection</h3>
                    <p className="text-xs text-[#cccccc]">Masami Ranch · Corning, California</p>
                    <div className="pt-2">
                      <DistributorBuyButton
                        profile={profile}
                        productId="kangen_wagyu"
                        label="View Official Wagyu Options"
                        className="w-full justify-center text-xs py-2.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. PRODUCT TRUST STRIP */}
        <section className="py-6 bg-gradient-to-r from-amber-950/30 via-stone-950 to-amber-950/30 border-b border-amber-900/20 overflow-x-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-6 min-w-max text-xs font-bold text-amber-200/90">
              {trustItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                  {idx < trustItems.length - 1 && <span className="text-amber-800 ml-4 font-normal">|</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MASAMI RANCH ORIGIN STORY */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">THE ORIGIN</span>
                <h2 className="text-3xl font-black text-white sm:text-4xl leading-tight">
                  Raised With Intention at Masami Ranch
                </h2>
                <p className="text-base text-[#cccccc] leading-relaxed">
                  Kangen Wagyu begins at Masami Ranch in Corning, California.
                </p>
                <p className="text-sm text-[#cccccc] leading-relaxed">
                  Enagic describes a deliberate approach to diet, care, hydration, and finishing. The cattle receive Kangen Water daily and follow a balanced vegetarian diet. They are grass-fed and grain-finished to create the marbling, tenderness, and depth of flavor associated with the Kangen Wagyu experience.
                </p>

                {/* Location Badge */}
                <div className="inline-flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-950/30 px-4 py-3 text-xs text-amber-200">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Masami Ranch</p>
                    <p className="text-slate-400">Corning, California · United States</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center">
                <div className="overflow-hidden rounded-3xl border border-amber-500/30 bg-stone-900/80 p-2 shadow-2xl">
                  <img
                    src="/products/wagyu-ranch-landscape.jpg"
                    alt="Masami Ranch Corning California"
                    className="h-80 sm:h-96 w-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. EXPLAIN AMERICAN WAGYU HONESTLY */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20 bg-[#090b14]/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">UNDERSTANDING THE BREED</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                An American Expression of Japanese Wagyu Heritage
              </h2>
              <p className="text-base text-[#cccccc] leading-relaxed">
                Kangen Wagyu is not Japanese A5 beef and should not be presented that way. Enagic describes the cattle as an F1 cross between fullblood Japanese Kuroge Wagyu and high-quality Black Angus.
              </p>
            </div>

            {/* Visual Breed Breakdown */}
            <div className="mt-12 max-w-4xl mx-auto grid gap-6 sm:grid-cols-3 items-center text-center">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 font-bold text-lg mb-1">
                  🇯🇵
                </div>
                <h3 className="font-bold text-white text-base">Japanese Kuroge Wagyu</h3>
                <p className="text-xs text-slate-400">Renowned Japanese genetic line noted for intricate intramuscular marbling.</p>
              </div>

              <div className="text-amber-400 font-black text-2xl hidden sm:block">+</div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 font-bold text-lg mb-1">
                  🇺🇸
                </div>
                <h3 className="font-bold text-white text-base">American Black Angus</h3>
                <p className="text-xs text-slate-400">High-quality American breed prized for robust muscle structure and rich beef flavor.</p>
              </div>
            </div>

            <div className="mt-8 text-center max-w-xl mx-auto rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
              <p className="text-sm font-bold text-amber-200">
                Result: F1 American Wagyu Crossbreed
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Raised in California. Inspired by Japanese Wagyu heritage.
              </p>
            </div>
          </div>
        </section>

        {/* 6. THE KANGEN WAGYU DIFFERENCE */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">RANCHING APPROACH</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                What Defines the Kangen Wagyu Experience
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-900/60 to-black p-6 space-y-3 hover:border-amber-400/40 transition-colors">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300 w-fit">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Daily Kangen Water Hydration</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  At Masami Ranch, Kangen Water is part of the cattle’s daily hydration routine as part of Enagic’s documented ranching process.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-900/60 to-black p-6 space-y-3 hover:border-amber-400/40 transition-colors">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300 w-fit">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Carefully Balanced Diet</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  The cattle follow a balanced vegetarian diet and are described as grass-fed and grain-finished for optimal flavor development.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-900/60 to-black p-6 space-y-3 hover:border-amber-400/40 transition-colors">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300 w-fit">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Thoughtful Ranching Approach</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  Enagic emphasizes strict attention to care, feeding, hydration, and finishing with no added hormones and no antibiotics.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-900/60 to-black p-6 space-y-3 hover:border-amber-400/40 transition-colors">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300 w-fit">
                  <Flame className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Marbling, Tenderness & Flavor</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  Kangen Wagyu is positioned around a rich culinary experience with pronounced marbling, tenderness, and depth of flavor.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-900/60 to-black p-6 space-y-3 hover:border-amber-400/40 transition-colors lg:col-span-2">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300 w-fit">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Prepared for Delivery</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  Available cuts are portioned, vacuum-sealed, and handled with care to preserve freshness and quality through cold-chain delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. PRODUCT COLLECTION */}
        <section id="collection" className="py-16 sm:py-24 border-b border-amber-900/20 bg-[#070912]/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">CURATED SELECTION</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Explore the Kangen Wagyu Collection</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Product sets, pricing, contents, availability, and reorder eligibility can change. Pull current information from the verified official Enagic product catalog.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* Card 1: Premium Set First Order */}
              <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900/90 via-amber-950/30 to-black p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  SKU 2115 · FIRST ORDER
                </div>

                <div className="space-y-4">
                  <div className="h-44 rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center p-2">
                    <img
                      src="/products/kangen-wagyu.png"
                      alt="Kangen Wagyu Premium Set SKU 2115"
                      className="max-h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">Premium Set: First Order</h3>
                    <p className="text-xs text-amber-300/90 font-semibold mt-1">Comprehensive 29-Piece Culinary Box</p>
                  </div>

                  <ul className="space-y-2 text-xs text-[#cccccc] border-t border-white/10 pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>5 Premium Steaks (8 oz each)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>12 Gourmet Burger Patties (4 oz each)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>12 Artisan Sausages (3 oz each)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Vacuum-sealed & cold-chain shipped</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <DistributorBuyButton
                    profile={profile}
                    productId="kangen_wagyu"
                    label="Explore First-Order Set"
                    className="w-full justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs py-3"
                  />
                </div>
              </div>

              {/* Card 2: Premium Set Reorder */}
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-stone-900/60 to-black p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-3 right-3 bg-white/10 text-slate-300 border border-white/15 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  REORDER PROGRAM
                </div>

                <div className="space-y-4">
                  <div className="h-44 rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center p-2">
                    <img
                      src="/products/kangen-wagyu.png"
                      alt="Kangen Wagyu Reorder Options"
                      className="max-h-40 w-auto object-contain opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">Premium Set: Reorder</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Exclusive For Returning Customers</p>
                  </div>

                  <p className="text-xs text-[#cccccc] leading-relaxed border-t border-white/10 pt-4">
                    A dedicated reorder option available for eligible returning customers through official Enagic accounts.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <DistributorBuyButton
                    profile={profile}
                    productId="kangen_wagyu"
                    label="View Reorder Options"
                    className="w-full justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3"
                  />
                </div>
              </div>

              {/* Card 3: Jerky Set */}
              <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-stone-900/60 to-black p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-3 right-3 bg-amber-950/40 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  WAGYU & ANGUS BLEND
                </div>

                <div className="space-y-4">
                  <div className="h-44 rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center p-4 text-center">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <Flame className="h-8 w-8 text-amber-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-amber-200">12 Individual Packages</p>
                      <p className="text-[10px] text-slate-400">8 oz per pouch</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">Kangen Wagyu Jerky Set</h3>
                    <p className="text-xs text-amber-300/90 font-semibold mt-1">Artisan Packaged Savory Blend</p>
                  </div>

                  <ul className="space-y-2 text-xs text-[#cccccc] border-t border-white/10 pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>12 individual 8 oz packages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Made from a blend of Kangen Wagyu & Angus beef</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Convenient for travel, gifting & snacking</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <DistributorBuyButton
                    profile={profile}
                    productId="kangen_wagyu"
                    label="Explore Jerky Set"
                    className="w-full justify-center bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-bold text-xs py-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. RANCH-TO-DOOR JOURNEY */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">PROCESS</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                From Masami Ranch to Your Table
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <span className="text-xs font-black text-amber-400">01</span>
                <h3 className="text-base font-bold text-white">Raised in California</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  The cattle are raised at Masami Ranch in Corning, California under deliberate management.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <span className="text-xs font-black text-amber-400">02</span>
                <h3 className="text-base font-bold text-white">Carefully Finished</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  Follows a documented vegetarian feeding, Kangen Water hydration, and finishing approach.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <span className="text-xs font-black text-amber-400">03</span>
                <h3 className="text-base font-bold text-white">Prepared & Sealed</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  Cuts are portioned and vacuum-sealed according to official product specifications.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <span className="text-xs font-black text-amber-400">04</span>
                <h3 className="text-base font-bold text-white">Delivered to Your Door</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  Orders are shipped using current official cold-chain fulfillment in supported U.S. markets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. CULINARY EXPERIENCE & PREPARATION */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20 bg-[#080a14]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">CULINARY GUIDANCE</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                Make the Cut the Center of the Experience
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-amber-500/20 bg-stone-900/60 p-5 space-y-2">
                <Utensils className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Premium Steaks</h3>
                <p className="text-xs text-slate-400">Designed for a refined steakhouse-style experience at home.</p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-stone-900/60 p-5 space-y-2">
                <Utensils className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Gourmet Burgers</h3>
                <p className="text-xs text-slate-400">A rich burger option built around premium American Wagyu.</p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-stone-900/60 p-5 space-y-2">
                <Utensils className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Artisan Sausages</h3>
                <p className="text-xs text-slate-400">A versatile option for grilling, entertaining, and shared meals.</p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-stone-900/60 p-5 space-y-2">
                <Utensils className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Premium Jerky</h3>
                <p className="text-xs text-slate-400">A savory packaged option for gifting, travel, and convenient enjoyment.</p>
              </div>
            </div>

            {/* Respect the Cut Panel */}
            <div className="mt-10 rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-3 max-w-4xl mx-auto">
              <h3 className="text-xl font-black text-amber-200">Respect the Cut</h3>
              <p className="text-xs text-[#cccccc] leading-relaxed">
                Thaw, handle, prepare, and cook each product according to the official package instructions and recognized food-safety guidance. Because Wagyu contains substantial marbling, preparation may differ from leaner conventional beef. Avoid overcooking, and follow current official USDA food safety recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* 10. GIFTING SECTION */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 p-8 sm:p-12 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">AN EXPERIENCE WORTH SHARING</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">A Premium Gift for the Table</h2>
              <p className="text-sm text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
                With premium presentation, curated sets, and direct delivery in supported markets, Kangen Wagyu can be explored for celebrations, client appreciation, family gatherings, and culinary gifting.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-black text-slate-950 hover:bg-amber-400 transition-all shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Ask About Gifting Options</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 11. PRODUCT & SHIPPING TRANSPARENCY */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20 bg-[#090b14]/70">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white sm:text-3xl">Before You Order</h2>
              <p className="text-xs text-slate-400">Essential information for a smooth ordering experience</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-4 text-xs text-[#cccccc] leading-relaxed">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-sm mb-1">Perishable Product Notice</p>
                  <p>Kangen Wagyu is a perishable food product. Product contents, pricing, and shipping eligibility vary by order type and destination.</p>
                </div>
              </div>

              <div className="grid gap-3 pt-2 border-t border-white/10 sm:grid-cols-2">
                <div>
                  <strong className="text-white block mb-1">Order Review</strong>
                  Review the official product description, unit counts, and weight specifications before purchasing.
                </div>
                <div>
                  <strong className="text-white block mb-1">Ingredients & Allergens</strong>
                  Review ingredient and allergen information for sausages, jerky, or processed products.
                </div>
                <div>
                  <strong className="text-white block mb-1">Program Eligibility</strong>
                  First-order and reorder programs have specific eligibility requirements.
                </div>
                <div>
                  <strong className="text-white block mb-1">Shipment Inspection</strong>
                  Inspect your shipment promptly upon arrival and follow official support procedures if compromised.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. FREQUENTLY ASKED QUESTIONS */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">QUESTIONS & ANSWERS</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Questions About Kangen Wagyu</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-white hover:text-amber-300 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-amber-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 sm:px-5 pb-5 text-xs text-[#cccccc] leading-relaxed border-t border-white/5 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 13. PERSONAL DISTRIBUTOR SECTION */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20 bg-[#080a14]/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-stone-900 to-black p-8 sm:p-12 grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <img
                  src={getLeaderPortrait(distributorFirstName)}
                  alt={distributorFullName}
                  className="h-28 w-28 rounded-full object-cover border-4 border-amber-400/40 shadow-2xl mb-3"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/images/mehdi-portrait.png'
                  }}
                />
                <h3 className="text-lg font-black text-white">{distributorFullName}</h3>
                <p className="text-xs text-amber-300/80 font-semibold">Independent Enagic Distributor</p>
                <p className="text-[11px] text-slate-400">True Legacy Global and LATAM</p>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">YOUR PERSONAL CONNECTION</span>
                <h3 className="text-2xl font-black text-white">Explore Kangen Wagyu With {distributorFirstName}</h3>

                <p className="text-xs text-[#cccccc] leading-relaxed italic bg-black/40 p-4 rounded-xl border border-white/10">
                  "I shared Kangen Wagyu with you because it shows a completely different side of the Enagic story. This is not a water machine or a supplement. It is a premium culinary product built around the same attention to water, quality, and experience that connects the broader Enagic product line. My role is to help you understand what is available, verify the current order options, and connect you with the correct official purchasing process. If you have questions about the sets, availability, or how Kangen Wagyu connects to the larger Enagic model, message me directly."
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-black text-slate-950 hover:bg-amber-400 transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Ask {distributorFirstName} About Kangen Wagyu</span>
                  </a>

                  <Link
                    to={`/d/${activeSlug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-bold text-white hover:bg-white/[0.08] transition-all"
                  >
                    <span>View {distributorFirstName}’s Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14. FINAL CTA */}
        <section className="py-16 sm:py-24 border-b border-amber-900/20 bg-gradient-to-b from-stone-950 via-amber-950/40 to-black">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">FROM THE RANCH TO YOUR TABLE</span>
            <h2 className="text-3xl font-black text-white sm:text-5xl">Ready to Experience Kangen Wagyu?</h2>
            <p className="text-sm text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
              Explore the current premium sets and connect with your verified distributor for availability, official ordering guidance, and support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <DistributorBuyButton
                profile={profile}
                productId="kangen_wagyu"
                label="View Official Wagyu Options"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl"
              />

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-950/40 px-6 py-3.5 text-xs font-bold text-amber-200 hover:bg-amber-900/50 transition-all"
              >
                <MessageCircle className="h-4 w-4 text-amber-400" />
                <span>Message {distributorFirstName}</span>
              </a>
            </div>

            <p className="text-xs text-slate-400 pt-2 font-medium">
              Premium American Wagyu. Raised with intention. Shared as an experience.
            </p>
          </div>
        </section>

        {/* 15. FOOD, SHIPPING AND AVAILABILITY DISCLOSURES */}
        <section className="py-12 bg-black text-slate-400 text-[11px] leading-relaxed border-t border-amber-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
            <p className="font-bold text-slate-300">Official Food & Availability Disclosure:</p>
            <p>
              Kangen Wagyu is a perishable food product. Product contents, pricing, inventory, shipping eligibility, delivery timing, and ordering programs may change. Review the current official product listing, ingredient labels, allergen information, storage instructions, and fulfillment policies before purchasing. Kangen Water hydration is part of Enagic’s documented ranching process and should not be interpreted as a medical or nutritional guarantee.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
