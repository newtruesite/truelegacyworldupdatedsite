import { SEO } from '@/components/SEO'
import { crmConfigured, crmSupabase, getCrmMembership } from '@/lib/crm'
import type { CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { ArrowLeft, ArrowRight, CalendarDays, FileText, GraduationCap, LayoutDashboard, LineChart, LockKeyhole, QrCode, Share2, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const TRUE_LEGACY_TOOLS = [
  { title: 'Trackable Resource Center', detail: 'Share approved pages and see views, actions, and generated leads.', to: '/app/resources', eyebrow: 'Share & measure', icon: FileText },
  { title: 'True Legacy Academy', detail: 'Courses, modules, quizzes, and tracked learning progress.', to: '/training', eyebrow: 'Learn', icon: GraduationCap },
  { title: 'Lead CRM', detail: 'Manage your contacts, conversations, and distributor follow-up.', to: '/crm', eyebrow: 'Manage', icon: LayoutDashboard },
  { title: 'Growth Center', detail: 'Track duplication, personal links, and business-building progress.', to: '/crm/growth', eyebrow: 'Grow', icon: LineChart },
  { title: 'Share Center', detail: 'Choose and share your official True Legacy pages and QR codes.', to: '/app/share', eyebrow: 'Share', icon: QrCode },
  { title: 'True Legacy Events', detail: 'Find weekly calls and community events hosted by True Legacy.', to: '/events', eyebrow: 'Connect', icon: CalendarDays },
  { title: 'Distributor Workspace', detail: 'Return to your private True Legacy home and personal tools.', to: '/app', eyebrow: 'Workspace', icon: Users },
] as const

export default function AppLibraryPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [loading, setLoading] = useState(crmConfigured)

  useEffect(() => {
    if (!crmSupabase) return
    crmSupabase.auth.getSession().then(({ data }) => { setSession(data.session); if (!data.session) setLoading(false) })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!session) return
    getCrmMembership(session.user.id).then(member => { setMembership(member); setLoading(false) }).catch(() => setLoading(false))
  }, [session])

  if (!crmConfigured) return <Gate title="Tool Center connection required" body="The secure distributor connection is unavailable in this preview." />
  if (loading) return <main className="min-h-screen bg-black" />
  if (!session) return <Gate title="Distributor sign-in required" body="Sign in with your True Legacy distributor account to open the private Tool Center." action={<Link to="/crm" className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Sign in</Link>} />
  if (!membership?.active) return <Gate title="Account not authorized" body="An active True Legacy distributor profile is required to access this Tool Center." />

  return <main className="min-h-screen bg-black px-4 pb-28 pt-6 text-white sm:px-6 lg:px-8">
    <SEO title="True Legacy Tool Center" description="Private tools created for the True Legacy distributor community." noIndex />
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center gap-4"><Link to="/app" aria-label="Back to app home" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.04]"><ArrowLeft /></Link><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#2997ff]">Private distributor workspace</p><h1 className="text-2xl font-black">True Legacy Tool Center</h1></div></header>
      <section className="mt-7 overflow-hidden rounded-[30px] border border-white/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.18),transparent_35%),linear-gradient(145deg,rgba(37,99,235,.12),rgba(255,255,255,.025))] p-6 sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-cyan-300/[.07] px-3 py-1.5 text-xs font-bold text-[#2997ff]"><LockKeyhole className="h-3.5 w-3.5" /> True Legacy distributors only</span>
        <h2 className="mt-5 max-w-4xl text-3xl font-black sm:text-5xl">Everything here is built for True Legacy.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#cccccc] sm:text-base">Open the Academy, manage leads, grow your network, share official pages, and stay connected to the True Legacy community—all from one private workspace.</p>
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[.06] p-4 text-sm leading-6 text-[#cccccc]"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><p><strong className="text-amber-200">True Legacy only:</strong> this center contains native True Legacy tools and destinations. External resource catalogs are kept separate so ownership and purpose remain clear.</p></div>
      </section>
      <section className="mt-9"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Your workspace</p><h2 className="mt-2 text-3xl font-black">Choose a True Legacy tool</h2><p className="mt-2 text-sm text-[#86868b]">Each destination is part of the True Legacy distributor experience.</p></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{TRUE_LEGACY_TOOLS.map(tool => { const Icon = tool.icon; return <Link key={tool.to} to={tool.to} className="group flex min-h-64 flex-col rounded-[24px] border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-1 hover:border-white/20"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-400/10 text-[#2997ff]"><Icon className="h-6 w-6" /></span><span className="rounded-full border border-white/20 bg-cyan-300/[.08] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#2997ff]">True Legacy</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[.17em] text-[#86868b]">{tool.eyebrow}</p><h3 className="mt-2 text-xl font-black">{tool.title}</h3><p className="mt-3 text-sm leading-6 text-[#cccccc]">{tool.detail}</p><div className="mt-auto flex items-center justify-between border-t border-white/[.07] pt-5"><span className="text-xs font-bold text-[#86868b]">Private workspace</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#2997ff]">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></Link> })}</div>
      </section>
      <section className="mt-9 grid gap-4 sm:grid-cols-3"><LibraryPoint icon={<GraduationCap />} title="Learn in order" text="Use the Academy for courses, modules, quizzes, and tracked progress." /><LibraryPoint icon={<Share2 />} title="Share officially" text="Use approved True Legacy pages and personal distributor links." /><LibraryPoint icon={<ShieldCheck />} title="Build responsibly" text="Keep contacts, growth activity, and distributor resources in one secure space." /></section>
    </div>
  </main>
}

function LibraryPoint({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><span className="text-[#2997ff]">{icon}</span><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[#86868b]">{text}</p></div> }
function Gate({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-black p-5 text-white"><SEO title={`${title} | True Legacy`} description={body} noIndex /><div className="max-w-md text-center"><GraduationCap className="mx-auto h-11 w-11 text-[#2997ff]" /><h1 className="mt-5 text-3xl font-black">{title}</h1><p className="mt-4 leading-7 text-[#cccccc]">{body}</p>{action ? <div className="mt-7">{action}</div> : null}</div></main> }
