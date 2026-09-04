import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Leaf,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  Utensils,
  X,
  Droplets,
  Award,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { getProductPurchaseLink } from '@/config/productPurchaseLinks'
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
  const [openFaq, setOpenFaq] = useState<number | null>(0)

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

  // Dynamic Wagyu Purchase Link detection
  const wagyuPurchaseUrl = useMemo(() => {
    return getProductPurchaseLink(profile?.purchase_links, 'kangen_wagyu')
  }, [profile?.purchase_links])

  const whatsappMessage = useMemo(() => {
    return encodeURIComponent(
      `Hi ${distributorFirstName}, I am viewing your Kangen Wagyu® presentation on True Legacy and would like to learn more about the cuts, availability, and official ordering options.`
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
      setFormError(err?.message || 'Submission error. Please connect directly via WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  // Multilingual Copy Dictionary
  const copy = useMemo(() => {
    if (locale === 'es') {
      return {
        seoTitle: `Kangen Wagyu® | Wagyu Americano de Lujo | ${distributorFullName}`,
        seoDesc: `Descubre Kangen Wagyu®, carne Wagyu americana premium con herencia japonesa criada en Masami Ranch en California con hidratación diaria de Agua Kangen®.`,
        eyebrow: 'KANGEN WAGYU® · WAGYU AMERICANO · HERENCIA JAPONESA',
        heroTitle1: 'CRIADO DIFERENTE.',
        heroTitle2: 'SABE DIFERENTE.',
        heroBody: 'Wagyu americano premium que combina la genética japonesa Kuroge Wagyu con Black Angus de máxima calidad, criado en Masami Ranch en el norte de California e hidratado a diario con Agua Kangen®. Disfruta de un marmoleado profundo, textura aterciopelada y un final sedoso e inolvidable.',
        presentedBy: 'Presentado por',
        exploreBtn: 'Explorar Kangen Wagyu',
        howRaisedBtn: 'Cómo se Cría',
        buyNow: 'Comprar Ahora',
        askOrdering: 'Consultar Pedidos',
        askFirst: `Preguntar a ${distributorFirstName}`,
      }
    }
    if (locale === 'fr') {
      return {
        seoTitle: `Kangen Wagyu® | Wagyu Américain d'Exception | ${distributorFullName}`,
        seoDesc: `Découvrez Kangen Wagyu®, du Wagyu américain d'exception élevé au ranch Masami en Californie avec une hydratation quotidienne à l'Eau Kangen®.`,
        eyebrow: 'KANGEN WAGYU® · WAGYU AMÉRICAIN · HÉRITAGE JAPONAIS',
        heroTitle1: 'ÉLEVÉ DIFFÉREMMENT.',
        heroTitle2: 'GOÛT INCOMPARABLE.',
        heroBody: 'Wagyu américain d’exception alliant la génétique Kuroge Wagyu japonaise au Black Angus de premier choix, élevé au ranch Masami en Californie du Nord et hydraté chaque jour à l’Eau Kangen®. Découvrez un persillage intense, une texture veloutée et une finale beurrée inoubliable.',
        presentedBy: 'Présenté par',
        exploreBtn: 'Explorer Kangen Wagyu',
        howRaisedBtn: 'Son Élevage',
        buyNow: 'Acheter',
        askOrdering: 'Commander / Infos',
        askFirst: `Demander à ${distributorFirstName}`,
      }
    }
    if (locale === 'pt') {
      return {
        seoTitle: `Kangen Wagyu® | Wagyu Americano Premium | ${distributorFullName}`,
        seoDesc: `Descubra Kangen Wagyu®, carne Wagyu americana premium com genética Kuroge japonesa criada na Masami Ranch na Califórnia com Água Kangen®.`,
        eyebrow: 'KANGEN WAGYU® · WAGYU AMERICANO · HERANÇA JAPONESA',
        heroTitle1: 'CRIADO DIFERENTE.',
        heroTitle2: 'SABOR INCOMPARÁVEL.',
        heroBody: 'Wagyu americano premium combinando genética japonesa Kuroge Wagyu com Black Angus de excelência, criado na Masami Ranch no norte da Califórnia e hidratado diariamente com Água Kangen®. Desfrute de marmoreio excepcional, textura aveludada e um sabor marcante.',
        presentedBy: 'Apresentado por',
        exploreBtn: 'Explorar Kangen Wagyu',
        howRaisedBtn: 'Como é Criado',
        buyNow: 'Comprar Agora',
        askOrdering: 'Consultar Pedidos',
        askFirst: `Falar com ${distributorFirstName}`,
      }
    }
    // Default English
    return {
      seoTitle: `Kangen Wagyu® | Premium American Wagyu | True Legacy`,
      seoDesc: `Discover Kangen Wagyu®, premium American Wagyu with Japanese heritage raised at Masami Ranch in Northern California and hydrated daily with Kangen Water®.`,
      eyebrow: 'KANGEN WAGYU® · AMERICAN WAGYU · JAPANESE HERITAGE',
      heroTitle1: 'RAISED DIFFERENT.',
      heroTitle2: 'TASTES DIFFERENT.',
      heroBody: 'Premium American Wagyu combining Japanese Kuroge Wagyu heritage with high-quality Black Angus, raised at Masami Ranch in Northern California and hydrated daily with Kangen Water®. Expect deep marbling, a velvety texture, and an unforgettable culinary experience.',
      presentedBy: 'Presented by',
      exploreBtn: 'Explore Kangen Wagyu',
      howRaisedBtn: "How It's Raised",
      buyNow: 'Buy Now',
      askOrdering: 'Ask About Ordering',
      askFirst: `Ask ${distributorFirstName}`,
    }
  }, [locale, distributorFullName, distributorFirstName])

  // Trust Strip Items
  const trustPoints = [
    { label: 'NO ADDED HORMONES', icon: ShieldCheck },
    { label: 'NO ANTIBIOTICS', icon: Leaf },
    { label: 'NO ANIMAL BYPRODUCTS', icon: CheckCircle2 },
    { label: 'KANGEN WATER® HYDRATED', icon: Droplets, highlight: true },
    { label: 'MASAMI RANCH · CALIFORNIA', icon: MapPin },
    { label: 'SHIPS FROZEN', icon: Truck },
  ]

  // The 4 Difference Story Blocks
  const differencePillars = [
    {
      num: '01',
      title: 'KANGEN WATER® HYDRATED',
      desc: 'Every animal drinks the same electrolyzed-reduced water Enagic has championed since 1974. It is the defining practice that sets Kangen Wagyu apart and contributes to exceptional animal well-being.',
      tag: 'Enagic® Heritage Hydration',
      waterAccent: true,
    },
    {
      num: '02',
      title: 'NOTHING ADDED',
      desc: 'No added hormones, no antibiotics, no chemical growth promotants, and zero animal byproducts. The cattle thrive on a wholesome vegetarian diet, pasture grass-fed and meticulously grain-finished.',
      tag: 'Pure Integrity Standard',
    },
    {
      num: '03',
      title: 'MASAMI RANCH · 6,500 ACRES',
      desc: 'Located in Corning in Northern California, Masami Ranch provides open pastures, clean air, and thoughtful low-stress husbandry. Serene surroundings directly reflect in tenderness on your plate.',
      tag: 'Northern California Pasture',
    },
    {
      num: '04',
      title: 'FROZEN FROM RANCH TO DOOR',
      desc: 'Each cut is vacuum-sealed at the peak of freshness and delivered directly to your door using specialized cold-chain thermal packaging, guaranteeing that what is packed is what you savor.',
      tag: 'Certified Cold-Chain Shipping',
    },
  ]

  // Accordion FAQs
  const faqs = [
    {
      q: 'What is Kangen Wagyu?',
      a: 'Kangen Wagyu® is a premium culinary program from Enagic featuring artisanal American Wagyu beef raised at Masami Ranch in Corning, California. It brings together historic Japanese Kuroge Wagyu genetics, premium American Black Angus, and daily hydration with Kangen Water®.',
    },
    {
      q: 'Where is it raised?',
      a: 'Kangen Wagyu is exclusively raised at Masami Ranch in Corning, Northern California. The ranch spans over 6,500 acres of fertile Sacramento Valley grazing land, providing ample room, fresh air, and peaceful low-stress living conditions.',
    },
    {
      q: 'What breed is Kangen Wagyu?',
      a: 'Kangen Wagyu is an authentic F1 cross between 100% fullblood Japanese Kuroge Wagyu (Black Wagyu) and premium American Black Angus cattle. This combination delivers the delicate, buttery marbling of Japanese Wagyu alongside the robust, satisfying structure of American steakhouse beef.',
    },
    {
      q: 'What makes it different?',
      a: 'The key distinction is the intersection of world-class genetics, a clean vegetarian feeding regimen (grass-fed and grain-finished), and daily hydration with Kangen Water®. No other Wagyu program in the world hydrates its herd with Enagic electrolyzed-reduced water.',
    },
    {
      q: 'Is it hydrated with Kangen Water?',
      a: 'Yes. Enagic states that the cattle at Masami Ranch receive fresh Kangen Water daily as a foundational pillar of their daily hydration routine, reflecting the company’s 50-year commitment to water excellence.',
    },
    {
      q: 'Are hormones added?',
      a: 'No. Kangen Wagyu cattle are raised with strict standards that prohibit the use of added growth hormones or artificial stimulants at any stage of life.',
    },
    {
      q: 'Are antibiotics used?',
      a: 'No. The ranch operates with a zero-antibiotic protocol for its finishing herd, focusing instead on clean nutrition, clean water, and stress-free pasture management.',
    },
    {
      q: 'How is it shipped?',
      a: 'Every cut is portioned, vacuum-sealed, and rapidly frozen at the source. Shipments travel in heavy-duty insulated cold-chain containers with dry ice/cool packs to ensure they arrive completely frozen at your doorstep.',
    },
    {
      q: 'How do I order?',
      a: 'If your distributor has a configured Kangen Wagyu purchase link, simply click the "Buy Now" button on this page. If the link is not currently displayed, click "Ask About Ordering" or the WhatsApp button to verify current inventory, pricing, and ordering procedures with your distributor.',
    },
    {
      q: 'Is it available in my country?',
      a: 'Kangen Wagyu is currently delivered exclusively within supported markets in the United States due to perishable cold-chain logistics. Availability and regional delivery schedules can vary, so please message your distributor to confirm eligibility for your address.',
    },
  ]

  // Reusable Buy CTA component adhering to strict Requirement 2
  const DynamicWagyuButton = ({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-xs sm:text-sm font-black',
      lg: 'px-8 py-4 text-sm sm:text-base font-black',
    }[size]

    if (wagyuPurchaseUrl) {
      return (
        <a
          href={wagyuPurchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c583] to-[#c5a059] text-stone-950 font-black tracking-wide uppercase shadow-lg shadow-[#c5a059]/20 hover:from-[#e5c583] hover:to-[#dfba73] hover:scale-[1.02] active:scale-[0.98] transition-transform ${sizeClasses} ${className}`}
        >
          <span>{copy.buyNow}</span>
          <ArrowUpRight className="h-4 w-4 text-stone-950 stroke-[2.5]" />
        </a>
      )
    }

    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#c5a059]/40 bg-[#26201b]/90 text-[#f5da9e] font-black tracking-wide uppercase hover:bg-[#362e27] hover:border-[#dfba73] hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md ${sizeClasses} ${className}`}
      >
        <MessageCircle className="h-4 w-4 text-[#e5c583]" />
        <span>{copy.askOrdering}</span>
      </a>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0908] text-[#ede8df] font-sans selection:bg-[#c5a059]/30 selection:text-[#f5da9e] overflow-x-hidden">
      <SEO title={copy.seoTitle} description={copy.seoDesc} />

      {/* ─────────────────────────────────────────────────────────────
          1. STICKY LUXURY NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#2b241f] bg-[#0c0a09]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <TrueLegacyLogo className="h-8 w-auto text-[#ede8df] group-hover:text-[#e5c583] transition-colors" />
          </Link>

          {/* Desktop Nav Anchors */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider text-[#a89f91] uppercase">
            <a href="#overview" className="hover:text-[#e5c583] transition-colors">Overview</a>
            <a href="#difference" className="hover:text-[#e5c583] transition-colors">The Difference</a>
            <a href="#heritage" className="hover:text-[#e5c583] transition-colors">Heritage</a>
            <a href="#ranch" className="hover:text-[#e5c583] transition-colors">The Ranch</a>
            <a href="#experience" className="hover:text-[#e5c583] transition-colors">Experience</a>
            <a href="#collection" className="hover:text-[#e5c583] transition-colors">The Sets</a>
            <a href="#faq" className="hover:text-[#e5c583] transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center rounded-lg border border-[#3e342b] bg-[#1a1614] p-1 text-[11px] font-bold">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    locale === lang
                      ? 'bg-[#c5a059] text-stone-950 font-black shadow-sm'
                      : 'text-[#8f8576] hover:text-[#ede8df]'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Dynamic Purchase / Ordering CTA */}
            <DynamicWagyuButton size="sm" className="hidden sm:inline-flex" />

            {/* WhatsApp Contact */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${distributorFirstName}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#3e342b] bg-[#1a1614] px-3.5 py-2 text-xs font-bold text-[#e8e2d5] hover:border-[#c5a059] hover:text-[#e5c583] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span className="hidden md:inline">WhatsApp {distributorFirstName}</span>
            </a>
          </div>
        </div>
      </header>

      <main id="overview">
        {/* ─────────────────────────────────────────────────────────────
            2. CINEMATIC HERO SECTION
            ───────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-28 border-b border-[#2b241f] bg-gradient-to-b from-[#14110e] via-[#0a0908] to-[#0a0908]">
          {/* Subtle Ambient Warm Gold & Ranch Glows */}
          <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-[#c5a059]/10 via-[#8b2522]/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-l from-[#362e27]/20 to-transparent blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              {/* Left Column: Narrative Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#c5a059]/30 bg-[#1f1a16]/80 px-4 py-1.5 text-xs font-black tracking-widest text-[#e5c583] uppercase shadow-sm">
                  <Flame className="h-3.5 w-3.5 text-[#e5c583]" />
                  <span>{copy.eyebrow}</span>
                </div>

                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-[#f7f4ee] leading-[1.08]">
                  {copy.heroTitle1}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5c583] via-[#c5a059] to-[#dfba73]">
                    {copy.heroTitle2}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#d6cebf] leading-relaxed max-w-2xl font-normal">
                  {copy.heroBody}
                </p>

                {/* Distributor Attribution Badge */}
                <div className="flex items-center gap-4 rounded-2xl border border-[#3e342b] bg-[#14110e]/90 p-3.5 max-w-md shadow-xl backdrop-blur-sm">
                  <img
                    src={profile?.avatar_url || getLeaderPortrait(profile?.slug || activeSlug, '/leaders/standardized/mehdi-cohen.png')}
                    alt={distributorFullName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-[#c5a059]/60 shadow-md"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/leaders/standardized/mehdi-cohen.png'
                    }}
                  />
                  <div>
                    <p className="text-[10px] font-bold text-[#a89f91] uppercase tracking-wider">
                      {copy.presentedBy}
                    </p>
                    <p className="text-sm font-black text-[#f7f4ee]">{distributorFullName}</p>
                    <p className="text-xs text-[#c5a059] font-medium">Independent Enagic Distributor</p>
                  </div>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <DynamicWagyuButton size="md" />

                  <a
                    href="#collection"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#3e342b] bg-[#1a1614] px-6 py-3 text-xs sm:text-sm font-bold text-[#ede8df] hover:border-[#c5a059] hover:bg-[#26201b] transition-colors shadow-sm"
                  >
                    <span>{copy.exploreBtn}</span>
                    <ChevronRight className="h-4 w-4 text-[#c5a059]" />
                  </a>

                  <a
                    href="#difference"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold text-[#a89f91] hover:text-[#f7f4ee] transition-colors"
                  >
                    <span>{copy.howRaisedBtn}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Visual */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl border border-[#3e342b] bg-gradient-to-b from-[#1c1714] to-[#0c0a09] p-3 shadow-2xl overflow-hidden group">
                  <div className="relative overflow-hidden rounded-2xl bg-black aspect-[4/3] sm:aspect-square">
                    <img
                      src="/products/wagyu-hero-steak.jpg"
                      alt="Premium Kangen Wagyu Seared Ribeye Steak with Rosemary and Sea Salt"
                      fetchPriority="high"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Badge Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 rounded-xl bg-black/80 backdrop-blur-md border border-[#c5a059]/40 px-3.5 py-1.5 text-[#f5da9e] font-bold shadow-lg">
                        <Award className="h-3.5 w-3.5 text-[#e5c583]" />
                        <span>Masami Ranch · F1 Crossbreed</span>
                      </div>
                      <span className="text-[11px] font-bold text-white/90 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
                        100% Japanese Kuroge × Black Angus
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. TRUST STRIP (RESTRAINED & COMPACT)
            ───────────────────────────────────────────────────────────── */}
        <section className="py-5 bg-[#0f0d0b] border-b border-[#2b241f]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
              {trustPoints.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-xl bg-[#14110e]/60 border border-[#26201b]"
                  >
                    <IconComponent
                      className={`h-4 w-4 shrink-0 ${
                        item.highlight ? 'text-[#2997ff]' : 'text-[#c5a059]'
                      }`}
                    />
                    <span className="text-[11px] font-bold tracking-wider text-[#d6cebf]">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. THE KANGEN DIFFERENCE
            ───────────────────────────────────────────────────────────── */}
        <section id="difference" className="py-16 sm:py-24 border-b border-[#2b241f] relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5c583]">
                THE KANGEN DIFFERENCE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#f7f4ee] tracking-tight">
                WATER FIRST.
                <br />
                <span className="text-[#c5a059]">THEN EVERYTHING ELSE.</span>
              </h2>
              <p className="text-base text-[#a89f91] leading-relaxed max-w-2xl mx-auto">
                Marbling is the visible finish. What creates it is a deliberate series of uncompromised decisions made every single day at the ranch—beginning with what the cattle drink.
              </p>
            </div>

            {/* Featured Wide Editorial Photograph */}
            <div className="mt-12 overflow-hidden rounded-3xl border border-[#3e342b] bg-[#14110e] shadow-2xl relative">
              <img
                src="/wagyu/wagyu-water-trough.png"
                alt="Black Wagyu cattle drinking clean Kangen Water at Masami Ranch trough in Northern California pasture"
                loading="lazy"
                className="w-full max-h-[500px] object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-lg rounded-2xl bg-[#0c0a09]/90 border border-[#3e342b] p-4 backdrop-blur-md shadow-2xl">
                <p className="text-xs font-bold text-[#e5c583] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Droplets className="h-3.5 w-3.5 text-[#2997ff]" />
                  <span>Daily Hydration Routine</span>
                </p>
                <p className="text-xs text-[#d6cebf] leading-relaxed">
                  Enagic documents that the cattle at Masami Ranch are hydrated daily with electrolyzed-reduced Kangen Water® as a foundational element of their care.
                </p>
              </div>
            </div>

            {/* 4 Editorial Story Blocks */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {differencePillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#3e342b] bg-gradient-to-b from-[#181411] to-[#0f0d0b] p-6 space-y-3 flex flex-col justify-between hover:border-[#c5a059]/40 transition-colors shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#c5a059] tracking-widest">{pillar.num}</span>
                      <span className="text-[10px] font-bold text-[#a89f91] uppercase tracking-wider bg-[#26201b] px-2.5 py-1 rounded-md">
                        {pillar.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#f7f4ee] leading-snug">{pillar.title}</h3>
                    <p className="text-xs text-[#d6cebf] leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. HERITAGE SECTION
            ───────────────────────────────────────────────────────────── */}
        <section id="heritage" className="py-16 sm:py-24 border-b border-[#2b241f] bg-[#0c0a09]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5c583]">
                  WAGYU LINEAGE
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#f7f4ee] leading-tight">
                  JAPANESE HERITAGE.
                  <br />
                  <span className="text-[#c5a059]">AMERICAN CRAFT.</span>
                </h2>
                <p className="text-sm sm:text-base text-[#d6cebf] leading-relaxed">
                  Kangen Wagyu is bred from a deliberate 50/50 cross between 100% fullblood Japanese Kuroge Wagyu (Black Wagyu) and high-quality American Black Angus.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="rounded-2xl border border-[#3e342b] bg-[#14110e] p-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇯🇵</span>
                      <h3 className="text-sm font-black text-[#f7f4ee] uppercase tracking-wider">
                        100% Fullblood Kuroge Wagyu
                      </h3>
                    </div>
                    <p className="text-xs text-[#a89f91] leading-relaxed">
                      Japan's most prized genetic line, renowned worldwide for its intricate web of intramuscular marbling, low-melting-point unsaturated fats, and melt-in-the-mouth tenderness.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#3e342b] bg-[#14110e] p-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇺🇸</span>
                      <h3 className="text-sm font-black text-[#f7f4ee] uppercase tracking-wider">
                        High-Quality Black Angus
                      </h3>
                    </div>
                    <p className="text-xs text-[#a89f91] leading-relaxed">
                      The benchmark American breed, selected for robust muscle density, natural climate resilience, and the deep, savory beef flavor celebrated in top American steakhouses.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#c5a059]/40 bg-gradient-to-r from-[#26201b] to-[#1a1614] p-4 text-xs font-bold text-[#f5da9e]">
                    Result: F1 American Wagyu marrying Japanese silkiness with American substance.
                  </div>
                </div>
              </div>

              {/* Right Dual Imagery */}
              <div className="lg:col-span-6 space-y-6">
                <div className="overflow-hidden rounded-3xl border border-[#3e342b] bg-[#14110e] shadow-2xl">
                  <img
                    src="/wagyu/wagyu-cattle-herd.jpg"
                    alt="Authentic black Kuroge Wagyu and Angus cattle at Masami Ranch"
                    loading="lazy"
                    className="w-full h-64 sm:h-72 object-cover object-center"
                  />
                  <div className="p-3.5 bg-[#0f0d0b] text-center border-t border-[#26201b]">
                    <p className="text-[11px] text-[#a89f91] italic">
                      The herd at Masami Ranch in Corning, California.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#3e342b] bg-[#14110e] shadow-2xl">
                  <img
                    src="/products/wagyu-raw-cuts.jpg"
                    alt="Intricate intramuscular marbling characteristic of Kangen Wagyu beef cuts with salt and fresh herbs"
                    loading="lazy"
                    className="w-full h-64 sm:h-72 object-cover object-center"
                  />
                  <div className="p-3.5 bg-[#0f0d0b] text-center border-t border-[#26201b]">
                    <p className="text-[11px] text-[#a89f91] italic">
                      Intricate intramuscular marbling characteristic of Kangen Wagyu beef cuts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. MASAMI RANCH (CORNING, CALIFORNIA)
            ───────────────────────────────────────────────────────────── */}
        <section id="ranch" className="py-16 sm:py-24 border-b border-[#2b241f] bg-gradient-to-b from-[#0a0908] to-[#120f0d]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5c583]">
                  CORNING, CALIFORNIA
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#f7f4ee] leading-tight">
                  WHERE IT STARTS.
                </h2>
                <p className="text-sm sm:text-base text-[#d6cebf] leading-relaxed">
                  Nestled against the foothills of the Northern Sacramento Valley, Masami Ranch spans 6,500 acres of protected pastureland.
                </p>
                <p className="text-xs sm:text-sm text-[#a89f91] leading-relaxed">
                  The herd thrives in a quiet, low-stress environment. Ample grazing acreage, fresh air, clean vegetarian nutrition, and daily Kangen Water® hydration form a deliberate husbandry cycle designed around quality rather than volume.
                </p>

                <div className="inline-flex items-center gap-3 rounded-xl border border-[#3e342b] bg-[#1a1614] px-4 py-3 text-xs text-[#e5c583]">
                  <MapPin className="h-4 w-4 text-[#c5a059] shrink-0" />
                  <div>
                    <p className="font-bold text-[#f7f4ee]">Masami Ranch</p>
                    <p className="text-[#a89f91]">Corning, California · Northern Sacramento Valley</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full overflow-hidden rounded-3xl border border-[#3e342b] bg-[#14110e] shadow-2xl">
                  <img
                    src="/products/wagyu-masami-pasture.jpg"
                    alt="Pristine green pastures of Masami Ranch in Corning, Northern California"
                    loading="lazy"
                    className="h-80 sm:h-[420px] w-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            7. PREMIUM CULINARY EXPERIENCE
            ───────────────────────────────────────────────────────────── */}
        <section id="experience" className="py-16 sm:py-24 border-b border-[#2b241f] bg-[#0c0a09]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5c583]">
                THE CULINARY ART
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#f7f4ee] tracking-tight">
                FROM THE RANCH TO YOUR TABLE.
              </h2>
              <p className="text-sm sm:text-base text-[#a89f91] leading-relaxed">
                A sensory journey from pasture to searing skillet. Rich aroma, velvety mouthfeel, and deep caramelized crust.
              </p>
            </div>

            {/* Chef Searing & Plated Photography Side-by-Side */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-[#3e342b] bg-[#14110e] shadow-2xl relative group">
                <img
                  src="/wagyu/wagyu-chef-sear.jpg"
                  alt="Chef searing thick marbled Kangen Wagyu ribeye in cast iron skillet with aromatic rosemary and butter"
                  loading="lazy"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="p-6 bg-[#0f0d0b] border-t border-[#26201b] space-y-2">
                  <h3 className="text-lg font-black text-[#f7f4ee]">Cast Iron Searing & Crust</h3>
                  <p className="text-xs text-[#a89f91] leading-relaxed">
                    Because the intramuscular fat in Kangen Wagyu has a notably low melting point, high direct heat in cast iron creates a deep golden crust while keeping the interior juicy and tender.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-[#3e342b] bg-[#14110e] shadow-2xl relative group">
                <img
                  src="/wagyu/wagyu-plated-steak.jpg"
                  alt="Plated medium-rare Kangen Wagyu steak sliced with roasted potatoes and glazed carrots with Kangen Wagyu box"
                  loading="lazy"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="p-6 bg-[#0f0d0b] border-t border-[#26201b] space-y-2">
                  <h3 className="text-lg font-black text-[#f7f4ee]">Refined Dining at Home</h3>
                  <p className="text-xs text-[#a89f91] leading-relaxed">
                    Every cut delivers a balance of rich beef flavor and gentle umami that transforms an evening into an extraordinary culinary memory.
                  </p>
                </div>
              </div>
            </div>

            {/* Sensory Attribute Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#3e342b] bg-[#14110e] p-5 space-y-2">
                <Sparkles className="h-5 w-5 text-[#c5a059]" />
                <h4 className="text-sm font-black text-[#f7f4ee]">Exceptional Marbling</h4>
                <p className="text-xs text-[#a89f91] leading-relaxed">
                  Delicate webs of intramuscular fat melt at human body temperature for effortless tenderness.
                </p>
              </div>

              <div className="rounded-2xl border border-[#3e342b] bg-[#14110e] p-5 space-y-2">
                <Utensils className="h-5 w-5 text-[#c5a059]" />
                <h4 className="text-sm font-black text-[#f7f4ee]">Velvety Texture</h4>
                <p className="text-xs text-[#a89f91] leading-relaxed">
                  Slices effortlessly and dissolves gently on the palate without chewy resistance.
                </p>
              </div>

              <div className="rounded-2xl border border-[#3e342b] bg-[#14110e] p-5 space-y-2">
                <Flame className="h-5 w-5 text-[#c5a059]" />
                <h4 className="text-sm font-black text-[#f7f4ee]">Rich, Buttery Flavor</h4>
                <p className="text-xs text-[#a89f91] leading-relaxed">
                  Savory, deep, and satisfying umami that leaves a clean, pleasant finish.
                </p>
              </div>

              <div className="rounded-2xl border border-[#3e342b] bg-[#14110e] p-5 space-y-2">
                <PackageCheck className="h-5 w-5 text-[#c5a059]" />
                <h4 className="text-sm font-black text-[#f7f4ee]">Frozen Delivery</h4>
                <p className="text-xs text-[#a89f91] leading-relaxed">
                  Individually vacuum-sealed at the source and packed with cold-chain dry ice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            8. PRODUCT / PREMIUM SET SECTION
            ───────────────────────────────────────────────────────────── */}
        <section id="collection" className="py-16 sm:py-24 border-b border-[#2b241f] bg-gradient-to-b from-[#0f0d0b] via-[#14110e] to-[#0a0908]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5c583]">
                CURATED SELECTION
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#f7f4ee] tracking-tight">
                THE KANGEN WAGYU PREMIUM EXPERIENCE
              </h2>
              <p className="text-xs sm:text-sm text-[#a89f91] leading-relaxed">
                Product sets, availability, and reorder eligibility can change. Current offerings are confirmed through your distributor's official Enagic portal.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Card 1: Premium Set: First Order (SKU 2115) */}
              <div className="rounded-3xl border border-[#c5a059]/40 bg-gradient-to-b from-[#1c1714] via-[#14110e] to-[#0c0a09] p-6 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-4 right-4 bg-[#c5a059] text-stone-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                  SKU 2115 · FIRST ORDER
                </div>

                <div className="space-y-4">
                  {/* Official dark box isolated */}
                  <div className="h-52 rounded-2xl overflow-hidden border border-[#3e342b] bg-black/60 flex items-center justify-center p-3">
                    <img
                      src="/wagyu/kangen-wagyu-box-dark.png"
                      alt="Official Kangen Cattle Wagyu Premium Selection Box"
                      className="max-h-48 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#f7f4ee]">Premium Set: First Order</h3>
                    <p className="text-xs text-[#e5c583] font-bold mt-1">Comprehensive 29-Piece Culinary Box</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#d6cebf] border-t border-[#26201b] pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>5 Premium Steaks (8 oz each)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>12 Gourmet Burger Patties (4 oz each)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>12 Artisan Sausages (3 oz each)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>Vacuum-sealed & cold-chain shipped</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#26201b]">
                  <DynamicWagyuButton className="w-full" />
                </div>
              </div>

              {/* Card 2: Premium Set: Reorder Program (Cutting board steaks & patties) */}
              <div className="rounded-3xl border border-[#3e342b] bg-gradient-to-b from-[#181411] via-[#120f0d] to-[#0c0a09] p-6 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-4 right-4 bg-[#26201b] text-[#d6cebf] border border-[#3e342b] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  REORDER PROGRAM
                </div>

                <div className="space-y-4">
                  {/* Cutting board with steaks, burger patties, and sausages */}
                  <div className="h-52 rounded-2xl overflow-hidden border border-[#3e342b] bg-black/40 flex items-center justify-center p-2">
                    <img
                      src="/products/wagyu-jerky-pouch.jpg"
                      alt="Kangen Wagyu Steaks, Burger Patties, and Artisan Sausages on Cutting Board"
                      className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#f7f4ee]">Premium Set: Reorder</h3>
                    <p className="text-xs text-[#a89f91] font-bold mt-1">Exclusive For Returning Customers</p>
                  </div>

                  <p className="text-xs text-[#d6cebf] leading-relaxed border-t border-[#26201b] pt-4">
                    A dedicated recurring reorder option available to registered customers through official Enagic accounts, keeping your freezer stocked with artisanal cuts.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#26201b]">
                  <DynamicWagyuButton className="w-full" />
                </div>
              </div>

              {/* Card 3: Kangen Wagyu Jerky Set (Pouch image) */}
              <div className="rounded-3xl border border-[#3e342b] bg-gradient-to-b from-[#181411] via-[#120f0d] to-[#0c0a09] p-6 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-4 right-4 bg-[#26201b] text-[#e5c583] border border-[#c5a059]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  WAGYU & ANGUS BLEND
                </div>

                <div className="space-y-4">
                  {/* Official Beef Jerky Pouch package */}
                  <div className="h-52 rounded-2xl overflow-hidden border border-[#3e342b] bg-black/40 flex items-center justify-center p-2">
                    <img
                      src="/products/wagyu-marbled-steak.jpg"
                      alt="Official Kangen Wagyu and Angus Beef Jerky Pouch with Savory Slices"
                      className="h-full w-auto max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#f7f4ee]">Kangen Wagyu Jerky Set</h3>
                    <p className="text-xs text-[#e5c583] font-bold mt-1">Artisan Packaged Savory Blend</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#d6cebf] border-t border-[#26201b] pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>12 individual 8 oz pouches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>Kangen Wagyu & Angus savory recipe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>Convenient for travel, gifting & snacking</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#26201b]">
                  <DynamicWagyuButton className="w-full" />
                </div>
              </div>
            </div>

            {/* Cold Chain Box Callout */}
            <div className="max-w-2xl mx-auto rounded-2xl border border-[#3e342b] bg-[#14110e] p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
              <img
                src="/products/wagyu-shipping-box.jpg"
                alt="Official Enagic Kangen Cattle insulated shipping container"
                className="w-24 sm:w-28 h-auto object-contain rounded-lg"
              />
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-black text-[#f7f4ee] uppercase tracking-wider">
                  Official Insulated Thermal Delivery
                </p>
                <p className="text-xs text-[#a89f91] leading-relaxed">
                  Orders ship frozen in customized Enagic Kangen Cattle containers engineered for temperature retention from ranch arrival to your table.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            9. DISTRIBUTOR PERSONAL GUIDANCE (SECTION 12 & 13)
            ───────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 border-b border-[#2b241f] bg-[#0e0c0a]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-[#c5a059]/30 bg-gradient-to-br from-[#1a1614] via-[#14110e] to-[#0c0a09] p-8 sm:p-12 grid gap-8 lg:grid-cols-12 items-center shadow-2xl">
              <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
                <img
                  src={profile?.avatar_url || getLeaderPortrait(profile?.slug || activeSlug, '/leaders/standardized/mehdi-cohen.png')}
                  alt={distributorFullName}
                  className="h-28 w-28 rounded-full object-cover border-4 border-[#c5a059]/60 shadow-2xl"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/leaders/standardized/mehdi-cohen.png'
                  }}
                />
                <div>
                  <h3 className="text-xl font-black text-[#f7f4ee]">{distributorFullName}</h3>
                  <p className="text-xs text-[#e5c583] font-bold">Independent Enagic Distributor</p>
                  <p className="text-[11px] text-[#a89f91]">True Legacy Global</p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5c583]">
                    PERSONAL ASSISTANCE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#f7f4ee] mt-1">
                    CURIOUS ABOUT KANGEN WAGYU?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a89f91] mt-1">
                    Questions about availability, ordering or which option is right for you?
                  </p>
                </div>

                <div className="rounded-2xl border border-[#3e342b] bg-[#0c0a09]/70 p-4 text-xs sm:text-sm text-[#d6cebf] leading-relaxed italic">
                  "I shared Kangen Wagyu with you because it demonstrates the extraordinary scope of the Enagic philosophy. Beyond our medical-grade water ionizers, this represents agricultural excellence, pure hydration, and artisanal dining. I'm here to help you verify current batch availability, check delivery eligibility, and ensure you place an authorized order."
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-xs font-black text-slate-950 hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp {distributorFirstName}</span>
                  </a>

                  <DynamicWagyuButton size="md" />

                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3e342b] bg-[#1a1614] px-5 py-3 text-xs font-bold text-[#ede8df] hover:border-[#c5a059] hover:bg-[#26201b] transition-colors"
                  >
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            10. ACCORDION FAQ SECTION (SECTION 14)
            ───────────────────────────────────────────────────────────── */}
        <section id="faq" className="py-16 sm:py-24 border-b border-[#2b241f] bg-[#0a0908]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5c583]">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#f7f4ee]">
                Questions About Kangen Wagyu
              </h2>
              <p className="text-xs sm:text-sm text-[#a89f91]">
                Clear, transparent answers about the breed, ranching practices, and ordering.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#3e342b] bg-[#14110e]/60 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-[#f7f4ee] hover:text-[#e5c583] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-[#c5a059] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#e5c583]' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#d6cebf] leading-relaxed border-t border-[#26201b] pt-3"
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

        {/* ─────────────────────────────────────────────────────────────
            11. FINAL CINEMATIC CTA (SECTION 15)
            ───────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-32 border-b border-[#2b241f] bg-gradient-to-b from-[#14110e] via-[#1c1714] to-[#0a0908] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c5a059]/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#e5c583]">
              CULINARY EXCELLENCE
            </span>

            <h2 className="text-4xl sm:text-6xl font-black text-[#f7f4ee] tracking-tight">
              TASTE WHAT
              <br />
              <span className="text-[#c5a059]">DIFFERENT LOOKS LIKE.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#d6cebf] max-w-xl mx-auto leading-relaxed">
              Discover Kangen Wagyu and speak directly with your True Legacy distributor about current batch availability and doorstep cold-chain delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <DynamicWagyuButton size="lg" />

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#3e342b] bg-[#1a1614] px-7 py-4 text-xs sm:text-sm font-bold text-[#ede8df] hover:border-[#c5a059] hover:text-[#e5c583] transition-colors shadow-md"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>WhatsApp {distributorFirstName}</span>
              </a>
            </div>

            <p className="text-[11px] text-[#a89f91] pt-2">
              Authentic American Wagyu · Raised at Masami Ranch · Delivered in supported U.S. markets
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            12. COMPLIANCE & AVAILABILITY DISCLOSURE (SECTION 11)
            ───────────────────────────────────────────────────────────── */}
        <section className="py-10 bg-black text-[#756d61] text-[11px] leading-relaxed border-t border-[#2b241f]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
            <p className="font-bold text-[#a89f91]">Official Food, Shipping & Regulatory Disclosure:</p>
            <p>
              Kangen Wagyu® is a perishable food product raised at Masami Ranch in Corning, California. Product contents, pricing, packaging, inventory, and delivery timing are managed under official Enagic policies and are subject to change. Review official product labels, allergen information, and thawing directions upon delivery. Kangen Water® hydration is part of Enagic’s documented ranching practices and is not intended to diagnose, treat, cure, or guarantee specific health or nutritional outcomes.
            </p>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          13. INQUIRY LEAD MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-[#c5a059]/40 bg-[#14110e] p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-[#a89f91] hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-[#e5c583] uppercase">
                  TRUE LEGACY · KANGEN WAGYU®
                </span>
                <h3 className="text-xl font-black text-[#f7f4ee]">Inquire With {distributorFirstName}</h3>
                <p className="text-xs text-[#a89f91]">
                  Receive current set details, availability, and official ordering guidance.
                </p>
              </div>

              {formSuccess ? (
                <div className="p-6 rounded-2xl bg-[#1c1714] border border-[#c5a059]/40 text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-[#c5a059] mx-auto" />
                  <p className="font-bold text-[#f7f4ee]">Inquiry Received</p>
                  <p className="text-xs text-[#d6cebf]">
                    Thank you! {distributorFirstName} will connect with you shortly regarding Kangen Wagyu availability.
                  </p>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setFormSuccess(false)
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#c5a059] text-stone-950 font-bold text-xs"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#d6cebf] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-[#3e342b] bg-[#0c0a09] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#d6cebf] block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-[#3e342b] bg-[#0c0a09] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#d6cebf] block mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-[#3e342b] bg-[#0c0a09] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#d6cebf] block mb-1">Delivery Country / State</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States (California, etc.)"
                      className="w-full rounded-xl border border-[#3e342b] bg-[#0c0a09] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs text-rose-400 font-medium">{formError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c583] to-[#c5a059] text-stone-950 font-black text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                  </button>
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
