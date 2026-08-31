import { SEO } from '@/components/SEO'
import { crmConfigured, crmSupabase, getCrmDistributors, getCrmMembership } from '@/lib/crm'
import type { CrmDistributor, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Copy,
  Droplets,
  ExternalLink,
  GraduationCap,
  Layers,
  Package,
  QrCode,
  Radio,
  Share2,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

interface SharePageItem {
  id: string
  label: string
  description: string
  path: string
  icon: any
  category: 'core' | 'extended'
  badge?: string
  isRootPath?: boolean
}

const PRIMARY_PAGES: SharePageItem[] = [
  {
    id: 'profile',
    label: 'My Profile',
    description: 'Your verified leader profile, biography, markets, languages, and direct contact channels.',
    path: '',
    icon: UserRound,
    category: 'core',
    badge: 'Hub',
  },
  {
    id: 'duo',
    label: 'Duo Technologies',
    description: 'K8 water ionization & emGuarde GO 360° cellular synergy presentation.',
    path: '/duo',
    icon: Sparkles,
    category: 'core',
    badge: 'Flagship',
  },
  {
    id: 'kangen',
    label: 'Kangen Water®',
    description: 'Leveluk K8 Japanese ionization technology, 5 water types, and everyday benefits.',
    path: '/kangen',
    icon: Droplets,
    category: 'core',
    badge: 'Hydration',
  },
  {
    id: 'emguarde',
    label: 'emGuarde® Defense',
    description: 'Harmonize electro-smoke and EMF radiation noise across a 3m radius presentation.',
    path: '/emguarde',
    icon: Radio,
    category: 'core',
    badge: 'Protection',
  },
  {
    id: 'business',
    label: 'Business Opportunity',
    description: 'Global business model, mentorship, global community, and team building introduction.',
    path: '/business',
    icon: BriefcaseBusiness,
    category: 'core',
    badge: 'Model',
  },
  {
    id: 'products',
    label: 'Product Collection',
    description: 'The complete Enagic Japanese product lineup—ionizers, Anespa DX shower, and Ukon wellness.',
    path: '/products',
    icon: Package,
    category: 'core',
    badge: 'Showcase',
  },
]

const EXTENDED_PAGES: SharePageItem[] = [
  {
    id: 'training',
    label: 'Leadership Academy',
    description: 'Public preview of the True Legacy mentorship and duplication training system.',
    path: '/training',
    icon: GraduationCap,
    category: 'extended',
    badge: 'Academy',
  },
  {
    id: 'events',
    label: 'Live Global Events',
    description: 'Current weekly multi-language briefings and masterclass schedules.',
    path: '/events',
    icon: CalendarDays,
    category: 'extended',
    badge: 'Live',
  },
  {
    id: 'apply',
    label: 'Direct Application Form',
    description: 'Direct candidate qualification form pre-attributed to your True Legacy CRM profile.',
    path: '/apply',
    icon: ClipboardCheck,
    category: 'extended',
    badge: 'Intake',
    isRootPath: true,
  },
]

const ALL_PAGES = [...PRIMARY_PAGES, ...EXTENDED_PAGES]

export default function AppSharePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [selected, setSelected] = useState<string>('profile')
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [showMorePages, setShowMorePages] = useState(false)
  const [selectedDistributorId, setSelectedDistributorId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCrmDistributors().then((team) => {
      setDistributors(team)
    })
    if (!crmSupabase) {
      setLoading(false)
      return
    }
    crmSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    Promise.all([getCrmMembership(session.user.id), getCrmDistributors()])
      .then(([member, team]) => {
        setMembership(member)
        setDistributors(team)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session?.user.id])

  const matchedDistributor = useMemo(() => {
    if (membership?.distributor_id) {
      const byId = distributors.find((item) => item.id === membership.distributor_id)
      if (byId) return byId
    }
    const email = session?.user.email?.trim().toLowerCase()
    if (email) {
      const byEmail = distributors.find((item) => item.login_email?.trim().toLowerCase() === email)
      if (byEmail) return byEmail
    }
    return (
      distributors.find((item) => item.slug === 'mehdi-cohen' && item.active) ||
      distributors.find((item) => item.active) ||
      distributors[0] ||
      null
    )
  }, [distributors, membership, session?.user.email])

  useEffect(() => {
    if (!selectedDistributorId && matchedDistributor) setSelectedDistributorId(matchedDistributor.id)
  }, [matchedDistributor, selectedDistributorId])

  const distributor = useMemo(
    () => distributors.find((item) => item.id === selectedDistributorId) || matchedDistributor,
    [distributors, matchedDistributor, selectedDistributorId]
  )

  const page = ALL_PAGES.find((item) => item.id === selected) || PRIMARY_PAGES[0]

  const url = useMemo(() => {
    if (!distributor) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.truelegacyworld.com'
    if (page.isRootPath) {
      return `${origin}${page.path}?ref=${distributor.slug}`
    }
    return `${origin}/d/${distributor.slug}${page.path}`
  }, [distributor, page])

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=720x720&data=${encodeURIComponent(url)}`

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1300)
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${distributor?.display_name} · ${page.label}`,
        text: page.description,
        url,
      })
    } else {
      await copy()
    }
  }

  if (loading && distributors.length === 0) return <main className="min-h-screen bg-black" />
  if (!distributor)
    return (
      <Message
        title="Distributor profile required"
        body="This distributor login has not been connected to an active profile yet. Please ask a True Legacy administrator to link it."
      />
    )

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-[max(22px,env(safe-area-inset-top))] text-white sm:px-6">
      <SEO
        title="True Legacy Share Center"
        description="Choose and share personalized distributor landing pages."
        noIndex
      />
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center gap-4">
          <Link
            to="/app"
            aria-label="Back to app home"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.04] hover:bg-white/[.08] transition-colors"
          >
            <ArrowLeft />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#2997ff]">Duplication tools</p>
            <h1 className="text-2xl font-black">Share Center</h1>
          </div>
        </header>

        {/* Distributor identity header */}
        <section className="mt-7 grid gap-5 rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-400/[.1] to-blue-500/[.04] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7">
          <img
            src={distributor.avatar_url || '/icons/icon-192.png'}
            alt={distributor.display_name}
            className="h-24 w-24 rounded-3xl border border-white/15 bg-black object-cover object-top"
          />
          <div>
            <p className="text-sm text-[#2997ff]">Sharing as</p>
            {membership?.role === 'admin' || !session ? (
              <select
                aria-label="Choose distributor profile"
                value={distributor.id}
                onChange={(event) => {
                  setSelectedDistributorId(event.target.value)
                  setShowQr(false)
                }}
                className="mt-2 w-full max-w-sm rounded-xl border border-white/15 bg-black px-4 py-3 text-lg font-black text-white"
              >
                <option value={matchedDistributor?.id || ''}>{matchedDistributor?.display_name}</option>
                {distributors
                  .filter((item) => item.active && item.id !== matchedDistributor?.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.display_name}
                    </option>
                  ))}
              </select>
            ) : (
              <h2 className="mt-1 text-3xl font-black">{distributor.display_name}</h2>
            )}
            <p className="mt-2 text-sm text-[#cccccc]">
              Every page keeps your referral attribution and contact details.
            </p>
          </div>
          <a
            href={`/d/${distributor.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 font-bold hover:bg-white/[0.08] transition-colors"
          >
            View profile <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        {/* 1. CHOOSE WHAT TO SHARE */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">1 · Choose what to share</p>
            <span className="text-xs text-[#86868b]">
              {PRIMARY_PAGES.length + (showMorePages ? EXTENDED_PAGES.length : 0)} landing pages
            </span>
          </div>

          {/* Primary Landing Pages Grid */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRIMARY_PAGES.map((item) => {
              const Icon = item.icon
              const active = item.id === selected
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelected(item.id)
                    setShowQr(false)
                  }}
                  className={`share-choice ${active ? 'is-active' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>
                      <Icon className="h-5 w-5" />
                    </span>
                    {item.badge && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                  {active && <Check className="share-choice__check" />}
                </button>
              )
            })}
          </div>

          {/* Collapsible Access More Landing Pages Button & Container */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowMorePages((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-bold text-white hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Access More Landing Pages & Portals ({EXTENDED_PAGES.length})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
                <span>{showMorePages ? 'Collapse' : 'Expand'}</span>
                {showMorePages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>

            {showMorePages && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-white/10 bg-black/40 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {EXTENDED_PAGES.map((item) => {
                  const Icon = item.icon
                  const active = item.id === selected
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelected(item.id)
                        setShowQr(false)
                      }}
                      className={`share-choice ${active ? 'is-active' : ''}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>
                          <Icon className="h-5 w-5" />
                        </span>
                        {item.badge && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                      {active && <Check className="share-choice__check" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* 2. SHARE LINK PREVIEW & ACTIONS */}
        <section className="mt-8 overflow-hidden rounded-[28px] border border-white/20 bg-white/[.035]">
          <div className="p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#2997ff]">2 · Share {page.label}</p>
            <h2 className="mt-2 text-2xl font-black">Ready for your next conversation</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#cccccc]">
              {page.description} The lead remains connected to {distributor.display_name} inside the True Legacy
              system.
            </p>
            <p className="mt-5 break-all rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-[#2997ff]">
              {url}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button onClick={share} className="share-primary">
                <Share2 />
                Share now
              </button>
              <button onClick={copy} className="share-secondary">
                <Copy />
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={() => setShowQr((value) => !value)} className="share-secondary">
                <QrCode />
                QR code
              </button>
              <a href={url} target="_blank" rel="noreferrer" className="share-secondary">
                <ExternalLink />
                Preview
              </a>
            </div>
          </div>
          {showQr && (
            <div className="grid gap-6 border-t border-white/10 bg-black/20 p-5 sm:grid-cols-[220px_1fr] sm:items-center sm:p-7">
              <div className="rounded-2xl bg-white p-3">
                <img src={qrUrl} alt={`${page.label} QR code`} className="w-full" />
              </div>
              <div>
                <h3 className="text-xl font-black">Scan to open {page.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#cccccc]">
                  Use this QR code at presentations, events, or in printed materials. It opens your selected
                  personalized page.
                </p>
                <a
                  href={qrUrl}
                  download={`${distributor.slug}-${page.id}-qr.png`}
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-cyan-400 px-5 font-black text-slate-950"
                >
                  Download QR
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Message({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-5 text-white">
      <div className="max-w-md text-center">
        <Sparkles className="mx-auto h-10 w-10 text-[#2997ff]" />
        <h1 className="mt-5 text-3xl font-black">{title}</h1>
        <p className="mt-4 text-[#cccccc]">{body}</p>
        {action && <div className="mt-7">{action}</div>}
      </div>
    </main>
  )
}
