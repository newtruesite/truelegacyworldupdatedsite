import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  Droplets,
  ExternalLink,
  GraduationCap,
  Package,
  Radio,
  Share2,
  Sparkles,
  UserRound,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { getPublicDistributors, type PublicDistributor } from '@/lib/crm'

interface LandingPageCardItem {
  id: string
  category: string
  title: string
  description: string
  cta: string
  image?: string
  path: string
  badge?: string
  featured?: boolean
  icon?: any
}

export default function LandingPagesHubPage() {
  const [searchParams] = useSearchParams()
  const refParam = searchParams.get('ref') || ''
  const [distributors, setDistributors] = useState<PublicDistributor[]>([])

  useEffect(() => {
    getPublicDistributors().then(setDistributors)
  }, [])

  const distributor = useMemo(() => {
    if (refParam) {
      const found = distributors.find((d) => d.slug.toLowerCase() === refParam.toLowerCase())
      if (found) return found
    }
    return distributors.find((d) => d.slug === 'mehdi-cohen') || distributors[0] || null
  }, [distributors, refParam])

  const getLink = (basePath: string) => {
    if (distributor) {
      if (basePath.startsWith('/apply')) {
        return `${basePath}?ref=${distributor.slug}`
      }
      return `/d/${distributor.slug}${basePath}`
    }
    return basePath
  }

  // 1. Featured Anespa DX Card (Req #3)
  const featuredAnespaCard: LandingPageCardItem = {
    id: 'anespa',
    category: 'HOME SPA · WELLNESS',
    title: 'Discover Anespa® DX',
    description: 'Bring the feeling of a natural hot spring into your bath or shower with Enagic’s Mineral Ion Water Spa.',
    cta: 'Explore Anespa® DX',
    image: '/products/anespa-dx.png',
    path: '/anespa',
    badge: 'NEW FEATURED SPA',
    featured: true,
  }

  // 2. Complete Landing Pages Catalog
  const catalogCards: LandingPageCardItem[] = [
    {
      id: 'duo',
      category: 'FLAGSHIP SYNERGY',
      title: 'Duo Technologies',
      description: 'K8 Japanese water ionization combined with emGuarde GO 360° cellular defense synergy.',
      cta: 'Explore Duo Page',
      image: '/products/k8.png',
      path: '/duo',
      badge: 'Flagship',
    },
    {
      id: 'kangen',
      category: 'JAPANESE HYDRATION',
      title: 'Kangen Water® Ionizers',
      description: 'Leveluk K8 ionization technology, 5 water types, and everyday antioxidant hydration benefits.',
      cta: 'Explore Kangen Water',
      image: '/products/k8.png',
      path: '/kangen',
      badge: 'Ionization',
    },
    {
      id: 'emguarde',
      category: 'FREQUENCY HARMONIZATION',
      title: 'emGuarde® Defense',
      description: 'Harmonize high-frequency electro-smoke and ambient electromagnetic noise across a 3m radius.',
      cta: 'Explore emGuarde',
      image: '/products/emguarde-go.png',
      path: '/emguarde',
      badge: 'Protection',
    },
    {
      id: 'jr4',
      category: 'STARTER IONIZER',
      title: 'Leveluk JrIV',
      description: 'Compact four-plate starter model designed primarily for singles and couples.',
      cta: 'Explore Leveluk JrIV',
      image: '/products/jr-iv.png',
      path: '/jr4',
      badge: 'Junior Model',
    },
    {
      id: 'products',
      category: 'ENAGIC CATALOG',
      title: 'Product Collection',
      description: 'The complete Enagic Japanese lineup—ionizers, Anespa DX shower, and Ukon wellness.',
      cta: 'Explore Collection',
      image: '/products/sd501-dx.png',
      path: '/products',
      badge: 'Showcase',
    },
    {
      id: 'business',
      category: 'BUSINESS MODEL',
      title: 'Business Opportunity',
      description: 'Global business model, mentorship, global community, and independent distribution introduction.',
      cta: 'Explore Opportunity',
      path: '/business',
      icon: BriefcaseBusiness,
      badge: 'Global Model',
    },
    {
      id: 'profile',
      category: 'DISTRIBUTOR HUB',
      title: 'Leader Profile & Bio',
      description: 'Verified distributor profile, biography, active markets, languages, and contact channels.',
      cta: 'View Profile',
      path: '',
      icon: UserRound,
      badge: 'Verified',
    },
    {
      id: 'training',
      category: 'MENTORSHIP SYSTEM',
      title: 'Leadership Academy',
      description: 'Public preview of the True Legacy 8-step duplication and leadership training portal.',
      cta: 'Explore Academy',
      path: '/training',
      icon: GraduationCap,
      badge: 'Academy',
    },
    {
      id: 'events',
      category: 'COMMUNITY & LIVE CALLS',
      title: 'Live Global Events',
      description: 'Current weekly multi-language briefings and masterclass event schedules.',
      cta: 'View Live Schedule',
      path: '/events',
      icon: CalendarDays,
      badge: 'Live Calls',
    },
    {
      id: 'apply',
      category: 'QUALIFICATION INTAKE',
      title: 'Direct Application Form',
      description: 'Direct candidate application form pre-attributed to your True Legacy CRM profile.',
      cta: 'Open Form',
      path: '/apply',
      icon: ClipboardCheck,
      badge: 'Intake Form',
    },
  ]

  return (
    <div className="min-h-screen bg-[#040817] text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title="More Landing Pages & Portals | True Legacy"
        description="Explore True Legacy's complete directory of product, wellness, and business landing pages."
      />

      {/* Spa & Portal Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.16)_0%,rgba(34,211,238,0.05)_45%,transparent_70%)] blur-3xl" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040817]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/app/share"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all"
              title="Return to Share Center"
            >
              <ArrowLeft className="h-4 w-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <TrueLegacyLogo />
          </div>

          <div className="flex items-center gap-3 text-xs text-[#86868b]">
            <Link to="/app" className="hover:text-cyan-300 transition-colors">
              Workspace Home
            </Link>
          </div>
        </div>
      </header>

      {/* Page Title & Hero */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[#2997ff]">
            <Sparkles className="h-3.5 w-3.5" />
            LANDING PAGES INDEX
          </span>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight">
            More Landing Pages
          </h1>
          <p className="mt-4 text-base text-[#cccccc] sm:text-lg leading-relaxed">
            Explore specialized product, home spa, and business portals. Share any link with prospective clients and team members.
          </p>
        </div>

        {/* FEATURED CARD SECTION: ANESPA DX (Requirement #3) */}
        <section className="mt-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Featured Spa Experience</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-[32px] border border-cyan-400/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-black p-6 sm:p-10 shadow-[0_20px_60px_rgba(14,165,233,0.15)] hover:border-cyan-400/60 transition-all"
          >
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-cyan-300">
                    {featuredAnespaCard.category}
                  </span>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300">
                    {featuredAnespaCard.badge}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                  {featuredAnespaCard.title}
                </h2>

                <p className="mt-4 text-base text-[#cccccc] leading-relaxed max-w-2xl">
                  {featuredAnespaCard.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to={getLink(featuredAnespaCard.path)}
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-sm font-black text-slate-950 shadow-[0_10px_30px_rgba(14,165,233,0.3)] hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {featuredAnespaCard.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="https://www.enagic.com/en_US/products/anespadx-mineral-ion-water-spa"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-xs font-bold text-white hover:bg-white/[0.08] transition-all"
                  >
                    Official Specifications <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative p-4">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-2xl animate-pulse" />
                  <img
                    src={featuredAnespaCard.image}
                    alt="Enagic Anespa DX Mineral Ion Water Spa Unit"
                    className="relative z-10 h-64 sm:h-72 w-auto object-contain drop-shadow-[0_15px_30px_rgba(14,165,233,0.25)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ADDITIONAL EXTENDED PORTALS GRID */}
        <section className="mt-16">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white">All Landing Pages & Portals</h3>
            <span className="text-xs text-[#86868b]">{catalogCards.length + 1} Available Pages</span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogCards.map((item) => {
              const Icon = item.icon || Sparkles
              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan-400/40 hover:bg-white/[0.05]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#2997ff]">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-[#86868b]">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-12 w-12 object-contain" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                          <Icon className="h-5 w-5" />
                        </div>
                      )}
                      <h4 className="text-xl font-black text-white">{item.title}</h4>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-[#cccccc]">{item.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Link
                      to={getLink(item.path)}
                      className="inline-flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-bold text-cyan-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-all"
                    >
                      <span>{item.cta}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
