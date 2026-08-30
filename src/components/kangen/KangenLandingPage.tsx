import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  Droplets,
  ExternalLink,
  Flame,
  Globe2,
  HeartPulse,
  Info,
  Layers,
  MessageCircle,
  Phone,
  PlayCircle,
  Plus,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { localizedProductVideo } from '@/lib/productVideos'
import { getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'

interface KangenLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

const WATER_TYPES = [
  {
    id: 'strong-kangen',
    pH: '11.5 pH',
    name: 'Strong Kangen Water',
    color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-300',
    tag: 'EMULSIFIER & DEGREASER',
    description:
      'High-alkalinity micro-clustered water with powerful solvent and oil-emulsifying properties. Effectively removes oil-based pesticides and chemicals from fresh produce that tap water cannot wash away.',
    uses: ['Pesticide removal from fruits & vegetables', 'Chemical-free kitchen degreasing', 'Deep stain removal without detergents', 'Soaking seeds for accelerated germination'],
  },
  {
    id: 'kangen-drinking',
    pH: '8.5 - 9.5 pH',
    name: 'Kangen Drinking Water',
    color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300',
    tag: 'DAILY CELLULAR HYDRATION',
    description:
      'Rich in dissolved molecular hydrogen (H2) and negative ORP antioxidants (-400mV to -850mV). Micro-clustered for rapid cellular absorption, superior taste, and optimal bioavailability.',
    uses: ['Daily cellular hydration and athletic recovery', 'Superior tea and coffee flavor extraction', 'Nutrient-preserving cooking and soups', 'Alkaline balance and metabolic support'],
  },
  {
    id: 'clean-water',
    pH: '7.0 pH',
    name: 'Clean Purified Water',
    color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300',
    tag: 'NEUTRAL PURITY',
    description:
      'Double-filtered neutral water free of chlorine, heavy metals, and odors while retaining essential minerals. Perfect for infant nutrition and time-released prescription medications.',
    uses: ['Baby formula and baby food preparation', 'Taking prescription medications', 'Neutral cooking and baking', 'Pure mineral-balanced hydration'],
  },
  {
    id: 'beauty-water',
    pH: '5.5 - 6.0 pH',
    name: 'Beauty Water',
    color: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-300',
    tag: 'NATURAL SKIN & HAIR TONER',
    description:
      'Mildly acidic water that precisely matches the acid mantle of human skin and hair. Acts as an organic astringent, tightening pores and enhancing moisture retention naturally.',
    uses: ['Daily facial toner and skin hydration mist', 'Hair rinse for shine and detangling', 'Post-shaving soothing astringent', 'Gentle plant misting for foliage vibrancy'],
  },
  {
    id: 'strong-acidic',
    pH: '2.5 pH',
    name: 'Strong Acidic Water',
    color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300',
    tag: 'NATURAL SANITIZATION (HOCl)',
    description:
      'Hypochlorous acid (HOCl) water with exceptional oxidation potential (+1,100mV). Certified by Japanese medical institutions as a powerful, non-toxic sanitizing solution.',
    uses: ['Sanitizing kitchen counters, cutting boards & utensils', 'Natural hand cleanser without alcohol dryness', 'Oral hygiene and gargling', 'Skin hygiene and minor abrasion cleansing'],
  },
]

const SCIENTIFIC_PILLARS = [
  {
    icon: Sparkles,
    title: 'Dissolved Molecular Hydrogen (H₂)',
    subtitle: 'The Ultimate Selective Antioxidant',
    description:
      'Unlike massive synthetic antioxidants, tiny H₂ molecules freely cross cell membranes and the blood-brain barrier, selectively neutralizing toxic hydroxyl radicals (•OH) while leaving vital physiological free radicals intact.',
    stat: '1.6+ ppm',
    statLabel: 'Peak Dissolved H₂ Concentration',
  },
  {
    icon: Zap,
    title: 'Negative ORP Antioxidant Potential',
    subtitle: 'Oxidation Reduction Power',
    description:
      'Standard tap and bottled waters have positive ORP (+200 to +400mV), acting as oxidizing agents. Kangen Water delivers a negative electrical charge (-400mV to -850mV), offering extraordinary cellular antioxidant defense.',
    stat: '-850 mV',
    statLabel: 'Potent Negative ORP Range',
  },
  {
    icon: Droplets,
    title: 'Micro-Clustered Electrolyzed Water',
    subtitle: 'Superior Cellular Permeability',
    description:
      'Electrolysis restructures large bulk water clusters into micro-clusters. This drastically reduces surface tension, enabling rapid absorption into tissues and aquaporins without the heavy, bloated feeling of ordinary water.',
    stat: '300%',
    statLabel: 'Faster Cellular Hydration Rate',
  },
]

const FAQS = [
  {
    q: 'How does Kangen Water differ from bottled alkaline water?',
    a: 'Bottled alkaline water is chemically alkalized using synthetic bicarbonate additives and loses its charge in plastic bottles. Kangen Water is electrically restructured (Electrolyzed Reduced Water) containing real active molecular hydrogen and negative ORP, fresh from a medical-grade device.',
  },
  {
    q: 'What is the Leveluk K8 and why is it considered the gold standard?',
    a: 'The Leveluk K8 is Enagic’s flagship 8-plate water ionizer. Built in Osaka, Japan with medical-grade platinum-dipped titanium plates, it features multi-voltage worldwide power, full touchscreen controls in 8 languages, and produces 5 distinct water types on demand.',
  },
  {
    q: 'Is Enagic an accredited medical device manufacturer?',
    a: 'Yes. Enagic’s manufacturing facility in Osaka is certified under ISO 13485 (Medical Device Quality Standard), ISO 9001, and ISO 14001. Enagic is also the only water ionizer manufacturer in the world to hold the prestigious Water Quality Association (WQA) Gold Seal.',
  },
  {
    q: 'How does Kangen Water connect to the True Legacy Duo Package?',
    a: 'True Legacy advocates for total 360° environmental wellness: Kangen Water addresses your internal cellular environment, while emGuarde GO harmonizes your external electromagnetic environment. Together, they form the ultimate modern health foundation.',
  },
]

export function KangenLandingPage({ profile: propProfile, distributorSlug }: KangenLandingPageProps) {
  const { locale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile)
  const [selectedWater, setSelectedWater] = useState(WATER_TYPES[1])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const effectiveSlug = distributorSlug || profile?.slug || 'mehdi-cohen'

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
  const videoUrl = localizedProductVideo('kangenWater', locale)
  const applyUrl = `/apply?ref=${profile?.referral_code || effectiveSlug}&interest=product&source=kangen`
  const duoUrl = `/d/${effectiveSlug}/duo`

  const whatsappNumber = profile?.phone?.replace(/\D/g, '') || ''
  const whatsappMsg = encodeURIComponent(
    `Hi ${distributorName}, I'm reviewing the Kangen Water Leveluk K8 page on True Legacy and would love to ask you some questions about the water demo and package options.`
  )
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMsg}` : null

  return (
    <div className="page-wrapper min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`Kangen Water® by Enagic · Leveluk K8 Medical Ionization · ${distributorName}`}
        description="Discover the science of Kangen Water: Molecular Hydrogen infusion, negative ORP antioxidant power, and 5 distinct water types produced by the Japanese medical-grade Leveluk K8."
      />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <TrueLegacyLogo className="h-7 w-auto text-white" />
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-cyan-300">
              KANGEN WATER®
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-1.5 text-xs font-black text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
            >
              Request Info <Send className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl bg-gradient-to-b from-cyan-500/15 via-blue-600/5 to-transparent blur-3xl" />

        {/* HERO SECTION */}
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:pt-20 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-cyan-300 mb-6">
            <Droplets className="h-3.5 w-3.5" /> Japanese Medical-Grade Ionization
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]">
            Change Your Water. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              Elevate Your Cellular Health.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#cccccc] leading-relaxed">
            50 years of Japanese engineering, active molecular hydrogen ($H_2$) infusion, and negative ORP antioxidant power. Discover how the Leveluk K8 replaces household chemicals and revitalizes your hydration.
          </p>

          {/* Distributor Personal Introduction Card */}
          {profile && (
            <div className="mt-8 mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl text-left flex items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={leaderAvatar}
                  alt={distributorName}
                  className="h-12 w-12 rounded-full object-cover border border-cyan-400/40 shrink-0 bg-black"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Personal Presentation Shared By</p>
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
                  className="inline-flex items-center gap-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-black text-slate-950 transition-colors shadow-md"
                >
                  Connect
                </Link>
              </div>
            </div>
          )}

          {/* VIDEO PRESENTATION SECTION */}
          <div className="mt-12 sm:mt-16 mx-auto max-w-4xl rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-3 sm:p-4 shadow-2xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
              <iframe
                src={videoUrl}
                title="Kangen Water Demonstration Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-3 text-xs text-[#86868b]">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <PlayCircle className="h-4 w-4 text-cyan-400" /> Watch the Complete Kangen Science & Water Demonstration
              </span>
              <span>Watch time: ~4 minutes · Scientific properties demonstrated</span>
            </div>
          </div>
        </section>

        {/* 3 SCIENTIFIC PILLARS */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">The Science of Ionization</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">Why Ordinary Water Falls Short</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Most bottled and tap waters are oxidized, acidic, and clustered into bulky molecular groups. Electrolyzed Reduced Water operates on a cellular level.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {SCIENTIFIC_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400/30 transition-all shadow-xl group"
                >
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-black text-white">{pillar.title}</h3>
                    <p className="text-xs font-bold text-cyan-400 mt-1">{pillar.subtitle}</p>
                    <p className="mt-3 text-xs text-[#cccccc] leading-relaxed">{pillar.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-2xl font-black text-cyan-300">{pillar.stat}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#86868b]">{pillar.statLabel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 5 TYPES OF ENAGIC WATER (INTERACTIVE WHEEL/TABS) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">One Machine · Infinite Applications</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">5 Distinct Waters at the Push of a Button</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              From deep antioxidant drinking water to medical-grade sanitizers and oil-emulsifiers, see how the Leveluk K8 transforms your home.
            </p>
          </div>

          {/* Water Type Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {WATER_TYPES.map((water) => (
              <button
                key={water.id}
                onClick={() => setSelectedWater(water)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedWater.id === water.id
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-105'
                    : 'border border-white/10 bg-white/[0.03] text-[#cccccc] hover:border-white/20 hover:text-white'
                }`}
              >
                {water.pH} · {water.name}
              </button>
            ))}
          </div>

          {/* Active Water Card Display */}
          <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-black to-black p-6 sm:p-10 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 mb-3">
                  {selectedWater.tag}
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">{selectedWater.name}</h3>
                <p className="text-2xl font-black text-cyan-400 mt-1 font-mono">{selectedWater.pH}</p>
                <p className="mt-4 text-sm text-[#cccccc] leading-relaxed">{selectedWater.description}</p>

                <div className="mt-6 space-y-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-white">Recommended Uses:</p>
                  {selectedWater.uses.map((use, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#cbd5e1]">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{use}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Spec Panel */}
              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">Electrolysis Plates</span>
                  <span className="text-xs font-black text-white">8 Solid Platinum-Dipped Titanium</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">Manufacturing</span>
                  <span className="text-xs font-black text-white">Osaka, Japan (ISO 13485)</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">Certification</span>
                  <span className="text-xs font-black text-amber-300">WQA Gold Seal Certified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">Direct Consultation</span>
                  <Link to={applyUrl} className="text-xs font-black text-cyan-400 hover:underline">
                    Inquire via {distributorName} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRIDGE TO THE DUO PACKAGE */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-black to-cyan-950/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-400/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-violet-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> 360° Environmental Wellness Standard
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white max-w-2xl mx-auto">
              Hydrate Your Cells. <br />
              <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                Harmonize Your Technology.
              </span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
              While Kangen Water provides internal cellular hydration and antioxidant defense, modern life also exposes us to 5G, Wi-Fi, and EMF radiation. Discover the <strong>True Legacy Duo</strong> pairing the Leveluk K8 with the portable <strong>emGuarde GO</strong>.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={duoUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-xs font-black text-black hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
              >
                Explore The Duo Technologies <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                to={applyUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-white transition-colors"
              >
                Request Leveluk K8 Package Pricing
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
          <div className="rounded-3xl border border-cyan-400/30 bg-black/60 p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Ready to Experience Kangen Water?</h2>
            <p className="mt-3 text-xs sm:text-sm text-[#cccccc] max-w-xl mx-auto">
              Connect directly with <strong>{distributorName}</strong> to receive full pricing details, water testing demonstrations, and international shipping options.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={applyUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-8 py-3.5 text-sm font-black text-slate-950 transition-colors shadow-lg shadow-cyan-500/25"
              >
                Request Leveluk K8 Consultation <Send className="h-4 w-4" />
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
