import { SEO } from '@/components/SEO'
import { Navbar } from '@/components/layout/Navbar'
import {
  crmConfigured,
  crmSupabase,
  getCrmDistributors,
  getCrmLeads,
  getCrmMembership,
  ENAGIC_PORTAL_URL,
  EWS_LOGIN_URL,
} from '@/lib/crm'
import type { CrmDistributor, CrmLead, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  Copy,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  LogOut,
  QrCode,
  Settings,
  Share2,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      setIsAtTop(scrollY <= 20)

      if (Math.abs(scrollY - lastScrollY) < 6) {
        return
      }

      if (scrollY > lastScrollY && scrollY > 60) {
        setScrollDirection('down')
      } else if (scrollY < lastScrollY) {
        setScrollDirection('up')
      }
      lastScrollY = scrollY > 0 ? scrollY : 0
    }

    window.addEventListener('scroll', updateScrollDirection, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateScrollDirection)
    }
  }, [])

  return { scrollDirection, isAtTop }
}

export default function AppHomePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [loading, setLoading] = useState(crmConfigured)
  const [copied, setCopied] = useState(false)
  const [portalConfirm, setPortalConfirm] = useState(false)
  const { scrollDirection, isAtTop } = useScrollDirection()

  const isHeaderHidden = scrollDirection === 'down' && !isAtTop

  useEffect(() => {
    if (!portalConfirm) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPortalConfirm(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [portalConfirm])

  useEffect(() => {
    if (!crmSupabase) return
    crmSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    Promise.all([getCrmMembership(session.user.id), getCrmDistributors(), getCrmLeads()])
      .then(([member, team, leadRows]) => {
        setMembership(member)
        setDistributors(team)
        setLeads(leadRows)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session])

  const distributor = useMemo(() => {
    const byId = distributors.find((item) => item.id === membership?.distributor_id)
    if (byId) return byId
    const email = session?.user.email?.trim().toLowerCase()
    const byEmail = email ? distributors.find((item) => item.login_email?.trim().toLowerCase() === email) : null
    if (byEmail) return byEmail
    if (membership?.role === 'admin')
      return distributors.find((item) => item.slug === 'mehdi-cohen' && item.active) || distributors.find((item) => item.active) || null
    return null
  }, [distributors, membership, session?.user.email])

  const myLeads = useMemo(() => {
    if (membership?.role === 'admin' && membership.distributor_id) {
      return leads.filter((item) => item.assigned_distributor_id === membership.distributor_id)
    }
    return leads
  }, [leads, membership])

  const newLeads = myLeads.filter((item) => item.status === 'new').length
  const dueLeads = myLeads.filter((item) => item.next_follow_up_at && new Date(item.next_follow_up_at) <= new Date()).length
  const profileUrl = distributor ? `${window.location.origin}/d/${distributor.slug}` : ''

  if (!crmConfigured)
    return (
      <AppMessage
        title="App connection required"
        body="The True Legacy app is ready, but its secure account connection is not available in this preview."
      />
    )
  if (loading) return <main className="min-h-screen bg-black" />
  if (!session) return <AppWelcome />
  if (!membership?.active)
    return (
      <AppMessage
        title="Account not authorized"
        body="This login does not currently have an active True Legacy distributor role."
        action={
          <button onClick={() => crmSupabase?.auth.signOut()} className="rounded-xl border border-white/15 px-5 py-3">
            Sign out
          </button>
        }
      />
    )

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="px-4 pb-28 pt-4 text-white sm:px-6">
        <SEO title="True Legacy App" description="Private True Legacy distributor home." noIndex />
        <div className="mx-auto max-w-6xl">
          {/* Sticky Header with Smooth Translate Hide on Scroll Down */}
          <header
            className={`sticky top-0 z-40 flex items-center justify-between gap-3 min-w-0 py-3.5 -mx-4 px-4 sm:-mx-6 sm:px-6 bg-black/90 backdrop-blur-xl border-b border-white/10 transition-transform duration-300 ease-in-out ${
              isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
            }`}
          >
            <Link to="/" className="flex items-center gap-3.5 min-w-0 transition-opacity hover:opacity-90">
              <img
                src="/icons/icon-192.png"
                alt="True Legacy"
                className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-2xl border border-white/15 bg-white/[0.04] p-1.5 shadow-lg object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold uppercase tracking-[.24em] text-[#2997ff] sm:text-xs leading-none mb-1">
                  True Legacy
                </p>
                <h1 className="text-lg sm:text-xl font-black leading-tight text-white truncate">
                  Distributor App
                </h1>
              </div>
            </Link>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                aria-label="Notifications"
                className="relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-colors text-white cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {newLeads + dueLeads > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-400 ring-2 ring-[#05091a]" />
                )}
              </button>
              <button
                onClick={() => crmSupabase?.auth.signOut()}
                aria-label="Sign out"
                className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-colors text-white cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>

        {/* Hero Welcome Card */}
        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-br from-cyan-400/[.14] via-blue-500/[.08] to-amber-400/[.08] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#2997ff]">Welcome back</p>
              <h2 className="mt-1 text-3xl font-black sm:text-4xl">{distributor?.display_name || session.user.email}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#cccccc]">
                Your leads, training, personal links, and team progress are connected in one place.
              </p>
            </div>
            {distributor?.avatar_url && (
              <img
                src={distributor.avatar_url}
                alt={distributor.display_name}
                className="h-28 w-28 rounded-3xl border border-white/15 bg-black object-cover object-top"
              />
            )}
          </div>
        </section>

        {/* Follow-up Banner */}
        {(newLeads > 0 || dueLeads > 0) && (
          <Link to="/crm" className="mt-5 flex items-center justify-between rounded-2xl border border-orange-300/20 bg-orange-400/[.08] p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-orange-300" />
              <div>
                <p className="font-bold">Your follow-up center</p>
                <p className="text-sm text-[#cccccc]">
                  {newLeads} new · {dueLeads} due
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}

        {/* Core App Feature Grid */}
        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-6">
          <AppCard to="/app/today" icon={<CalendarCheck2 />} eyebrow="Act" title="Today" detail={`${newLeads + dueLeads} actions`} color="cyan" />
          <AppCard to="/crm" icon={<LayoutDashboard />} eyebrow="Manage" title="Contacts" detail={`${leads.length} accessible`} color="amber" />
          <AppCard to="/app/bookings" icon={<CalendarCheck2 />} eyebrow="Meet" title="Bookings" detail="Schedule calls" color="cyan" />
          <AppCard to="/app/share" icon={<Share2 />} eyebrow="Connect" title="Share" detail="Pages & QR codes" color="violet" />
          <AppCard to="/app/library" icon={<GraduationCap />} eyebrow="Learn" title="Library" detail="Tools & resources" color="emerald" />
          <AppCard to="/app/settings" icon={<Settings />} eyebrow="Account" title="Settings" detail="Update your profile" color="cyan" />
        </section>

        {/* Separate Catalog Banner */}
        <Link
          to="/app/saga-library"
          className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/20 bg-violet-400/[.06] p-4 transition hover:border-white/20"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-[#2997ff]">
              <BookOpenCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#2997ff]">Separate catalog</p>
              <h2 className="mt-1 font-black">Browse the Library</h2>
              <p className="mt-1 text-xs text-[#86868b]">Organized external resources, clearly separated from True Legacy tools.</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-[#2997ff]" />
        </Link>

        {/* Personal Share Link Card */}
        {distributor && (
          <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[.035] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#2997ff]">Your personal link</p>
                <h2 className="mt-2 text-2xl font-black">Share your True Legacy page</h2>
              </div>
              <Link2 className="h-6 w-6 text-[#2997ff]" />
            </div>
            <p className="mt-4 truncate rounded-xl bg-black/20 p-3 text-sm text-[#cccccc]">{profileUrl}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(profileUrl)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1200)
                }}
                className="app-action cursor-pointer"
              >
                <Copy />
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => navigator.share?.({ title: `Connect with ${distributor.display_name}`, url: profileUrl })}
                className="app-action cursor-pointer"
              >
                <Share2 />
                Share
              </button>
              <Link to="/app/share" className="app-action">
                <QrCode />
                Choose page
              </Link>
            </div>
          </section>
        )}

        {/* Today's Focus */}
        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Continue your journey</p>
              <h2 className="mt-2 text-2xl font-black">Today’s focus</h2>
            </div>
            <Link to="/crm/platform" className="text-sm font-bold text-[#2997ff]">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <FocusCard
              icon={<BookOpenCheck />}
              title="Complete your Duo orientation"
              text="Watch the K8, emGuarde GO, and complete Duo presentation before advancing."
              to="/training"
            />
            <FocusCard
              icon={<CheckCircle2 />}
              title="Keep your onboarding moving"
              text="Review your checklist and help your developing team stay on track."
              to="/crm/growth"
            />
          </div>
        </section>

        {/* Official Enagic Resources Section */}
        <section className="mt-8 space-y-4">
          {/* Card 1: Distributor Support Portal */}
          <div className="rounded-[28px] border border-blue-300/15 bg-gradient-to-r from-blue-500/[.09] to-cyan-400/[.04] p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-400/10 text-blue-200">
                  <LifeBuoy className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200">Official Enagic resource</p>
                  <h2 className="mt-2 text-xl font-black">Distributor Support Portal</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cccccc]">
                    Access your Enagic distributor information and support tools.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPortalConfirm(true)}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-black text-white transition-colors hover:bg-blue-500 cursor-pointer"
              >
                Open Enagic Portal <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 2: EWS Login */}
          <div className="rounded-[28px] border border-cyan-300/15 bg-gradient-to-r from-cyan-500/[.09] to-blue-400/[.04] p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-200">Official Enagic resource</p>
                  <h2 className="mt-2 text-xl font-black">EWS Login</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cccccc]">
                    Access your Enagic Web System account, distributor tools, and EWS resources.
                  </p>
                </div>
              </div>
              <a
                href={EWS_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 font-black text-slate-950 transition-colors hover:bg-cyan-400 cursor-pointer"
              >
                Open EWS Login <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Portal Confirmation Modal */}
        {portalConfirm && (
          <div
            className="fixed inset-0 z-[10000] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setPortalConfirm(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="enagic-portal-title"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-[28px] border border-blue-300/20 bg-black p-6 shadow-2xl sm:p-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-400/10 text-blue-200">
                <LifeBuoy className="h-6 w-6" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-blue-200">Before you continue</p>
              <h2 id="enagic-portal-title" className="mt-2 text-2xl font-black">
                Use your personal Enagic login
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#cccccc]">
                Every distributor must sign in with their own Enagic Distributor Support Portal credentials. Your True Legacy email and password may be different and will not automatically sign you in.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPortalConfirm(false)}
                  className="min-h-12 rounded-xl border border-white/15 px-5 font-bold text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <a
                  href={ENAGIC_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setPortalConfirm(false)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-black text-white hover:bg-blue-500 cursor-pointer"
                >
                  Continue to Enagic <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  </div>
)
}

function AppCard({
  to,
  icon,
  eyebrow,
  title,
  detail,
  color,
}: {
  to: string
  icon: React.ReactNode
  eyebrow: string
  title: string
  detail: string
  color: string
}) {
  return (
    <Link to={to} className={`app-home-card app-home-card--${color}`}>
      <span>{icon}</span>
      <p>{eyebrow}</p>
      <h3>{title}</h3>
      <small>{detail}</small>
      <ArrowRight />
    </Link>
  )
}

function FocusCard({ icon, title, text, to }: { icon: React.ReactNode; title: string; text: string; to: string }) {
  return (
    <Link to={to} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-[#2997ff]">{icon}</span>
      <span>
        <strong className="block">{title}</strong>
        <small className="mt-2 block leading-5 text-[#cccccc]">{text}</small>
      </span>
      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#86868b]" />
    </Link>
  )
}

function AppWelcome() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0d2a55,#05091a_55%)] p-5 text-white">
      <SEO title="True Legacy App" description="The private distributor experience." noIndex />
      <div className="w-full max-w-md text-center">
        <img src="/icons/icon-192.png" alt="True Legacy" className="mx-auto h-28 w-28 rounded-[30px] shadow-2xl" />
        <p className="mt-7 text-xs font-bold uppercase tracking-[.28em] text-[#2997ff]">Learn · Connect · Build</p>
        <h1 className="mt-3 text-4xl font-black">Your True Legacy starts here.</h1>
        <p className="mt-4 leading-7 text-[#cccccc]">
          Sign in with your existing distributor account to access your leads, academy, personal links, and organization.
        </p>
        <div className="mt-8 space-y-3">
          <Link
            to="/crm"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 font-black text-slate-950 transition-colors hover:bg-cyan-300 cursor-pointer"
          >
            Distributor sign in <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/leaders/apply"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 font-black text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer"
          >
            Sign Up Now — Become a Leader <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/15 text-sm font-semibold text-[#cccccc] transition-colors hover:bg-white/5 cursor-pointer"
          >
            Visit public website
          </Link>
        </div>
      </div>
    </main>
  )
}

function AppMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-5 text-white">
      <div className="max-w-md text-center">
        <Sparkles className="mx-auto h-10 w-10 text-[#2997ff]" />
        <h1 className="mt-5 text-3xl font-black">{title}</h1>
        <p className="mt-4 text-[#cccccc]">{body}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </main>
  )
}
