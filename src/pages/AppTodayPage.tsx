import { SEO } from '@/components/SEO'
import { Navbar } from '@/components/layout/Navbar'
import { AppPageHeader } from '@/components/layout/AppPageHeader'
import { crmConfigured, crmSupabase, getCrmDistributors, getCrmLeads, getCrmMembership } from '@/lib/crm'
import type { CrmDistributor, CrmLead, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { ArrowRight, BookOpenCheck, CalendarCheck2, CheckCircle2, Clock3, GraduationCap, Mail, MessageCircle, Sparkles, UserPlus, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Module = { id: string; position: number; category: string; title: Record<string, string>; video_url: string | null }
type Item = { id: string; position: number; title: Record<string, string> }
type Progress = { distributor_id: string; module_id?: string; item_id?: string; completed: boolean }
type Meeting = { id: string; distributor_id: string; guest_name: string; guest_email: string; starts_at: string; status: string }

export default function AppTodayPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [distributor, setDistributor] = useState<CrmDistributor | null>(null)
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [training, setTraining] = useState<Progress[]>([])
  const [onboarding, setOnboarding] = useState<Progress[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(crmConfigured)

  useEffect(() => {
    if (!crmSupabase) return
    crmSupabase.auth.getSession().then(({ data }) => { setSession(data.session); if (!data.session) setLoading(false) })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !crmSupabase) return
    let current = true
    async function load() {
      try {
        const member = await getCrmMembership(session!.user.id)
        if (!current) return
        setMembership(member)
        if (!member?.active) return
        const [team, allLeads, msResult, isResult, tpResult, opResult, mtResult] = await Promise.all([
          getCrmDistributors(),
          getCrmLeads(),
          crmSupabase!.from('crm_training_modules').select('*').eq('active', true).order('position'),
          crmSupabase!.from('crm_onboarding_items').select('*').eq('active', true).order('position'),
          crmSupabase!.from('crm_training_progress').select('*'),
          crmSupabase!.from('crm_onboarding_progress').select('*'),
          crmSupabase!.from('crm_meetings').select('*').eq('status', 'scheduled').order('starts_at', { ascending: true }),
        ])
        const mine = team.find(item => item.id === member.distributor_id) || (session?.user ? team.find(item => item.auth_user_id === session.user.id) : null) || (session?.user?.email ? team.find(item => item.login_email?.toLowerCase() === session.user.email!.toLowerCase()) : null) || (member.role === 'admin' ? team.find(item => item.slug === 'mehdi-cohen') || team[0] : null) || null
        setDistributor(mine)
        setLeads(allLeads.filter(item => item.assigned_distributor_id === mine?.id))
        setModules((msResult.data || []) as Module[])
        setItems((isResult.data || []) as Item[])
        setTraining(((tpResult.data || []) as Progress[]).filter(item => item.distributor_id === mine?.id))
        setOnboarding(((opResult.data || []) as Progress[]).filter(item => item.distributor_id === mine?.id))
        setMeetings(((mtResult.data || []) as Meeting[]).filter(item => item.distributor_id === mine?.id))
      } finally { if (current) setLoading(false) }
    }
    load()
    return () => { current = false }
  }, [session])

  const now = new Date()
  const due = useMemo(() => leads.filter(item => item.next_follow_up_at && new Date(item.next_follow_up_at) < new Date(now.getFullYear(), now.getMonth(), now.getDate())), [leads, now])
  const today = useMemo(() => leads.filter(item => { if (!item.next_follow_up_at) return false; const d = new Date(item.next_follow_up_at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate() }), [leads, now])
  const newLeads = useMemo(() => leads.filter(item => item.status === 'new'), [leads])
  const todayMeetings = useMemo(() => meetings.filter(item => { const d = new Date(item.starts_at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate() }), [meetings, now])

  const completedTraining = training.filter(item => item.completed)
  const completedOnboarding = onboarding.filter(item => item.completed)
  const nextModule = modules.find(item => !completedTraining.some(p => p.module_id === item.id))
  const nextOnboarding = items.find(item => !completedOnboarding.some(p => p.item_id === item.id))
  const actionCount = due.length + today.length + newLeads.length + todayMeetings.length + (nextModule ? 1 : 0) + (nextOnboarding ? 1 : 0)

  if (!crmConfigured) return <TodayMessage title="App connection required" body="The secure True Legacy connection is unavailable." />
  if (loading) return <main className="min-h-screen bg-black" />
  if (!session) return <TodayMessage title="Distributor login required" body="Sign in to see your leads, follow-ups, and next training actions." action={<Link to="/crm" className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Sign in</Link>} />
  if (!membership?.active) return <TodayMessage title="Account not authorized" body="An active distributor account is required to open Today." />

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="min-h-screen bg-black px-4 pb-32 pt-7 text-white sm:px-6 lg:px-8">
        <SEO title="Today | True Legacy" description="Your daily True Legacy distributor action plan." noIndex />
        <div className="mx-auto max-w-7xl">
          <AppPageHeader
            eyebrow="YOUR DAILY OPERATING SYSTEM"
            title="Today"
            description={`Welcome back${distributor ? `, ${distributor.display_name.split(' ')[0]}` : ''}. Here is the shortest path to momentum.`}
            backTo="/app"
            maxWidthClass="max-w-7xl"
            stat={
              <div className="rounded-2xl border border-white/20 bg-cyan-300/[.07] px-5 py-2.5">
                <span className="text-2xl font-black text-[#2997ff]">{actionCount}</span>
                <span className="ml-2 text-xs sm:text-sm text-[#cccccc]">recommended actions</span>
              </div>
            }
          />

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Metric icon={<Clock3 />} value={due.length} label="Overdue follow-ups" tone="rose" /><Metric icon={<CalendarCheck2 />} value={today.length} label="Due today" tone="amber" /><Metric icon={<UserPlus />} value={newLeads.length} label="New contacts" tone="cyan" /><Metric icon={<CalendarCheck2 />} value={todayMeetings.length} label="Calls today" tone="cyan" /><Metric icon={<CheckCircle2 />} value={`${completedOnboarding.length}/${items.length}`} label="Onboarding" tone="emerald" /></section>

          {todayMeetings.length > 0 && <section className="mt-7 rounded-[28px] border border-white/20 bg-violet-400/[.05] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2997ff]">Scheduled today</p><h2 className="mt-2 text-2xl font-black">Your conversations</h2></div><Link to="/app/bookings" className="text-sm font-bold text-[#2997ff]">All bookings</Link></div><div className="mt-5 grid gap-3 md:grid-cols-2">{todayMeetings.map(meeting => <article key={meeting.id} className="flex items-center gap-4 rounded-2xl border border-white/[.08] bg-black/15 p-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-sm font-black text-[#2997ff]">{new Date(meeting.starts_at).toLocaleTimeString([], { hour: 'numeric' })}</span><div className="min-w-0"><h3 className="truncate font-black">{meeting.guest_name}</h3><p className="mt-1 truncate text-xs text-[#86868b]">{new Date(meeting.starts_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · {meeting.guest_email}</p></div></article>)}</div></section>}

          <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
            <section className="rounded-[28px] border border-white/10 bg-white/[.03] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-rose-300">People first</p><h2 className="mt-2 text-2xl font-black">Follow-up queue</h2></div><Link to="/crm?attention=due" className="text-sm font-bold text-[#2997ff]">All contacts</Link></div><div className="mt-5 space-y-3">{[...due, ...today, ...newLeads.filter(lead => !due.some(item => item.id === lead.id) && !today.some(item => item.id === lead.id))].slice(0, 8).map(lead => <LeadAction key={lead.id} lead={lead} />)}{due.length + today.length + newLeads.length === 0 ? <EmptyState /> : null}</div></section>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-white/20 bg-gradient-to-br from-cyan-400/[.1] to-blue-500/[.04] p-6">
                <GraduationCap className="h-7 w-7 text-[#2997ff]" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-[#2997ff]">Next learning action</p>
                <h2 className="mt-1.5 text-lg sm:text-xl font-black text-white">{nextModule ? nextModule.title.en : 'Academy complete'}</h2>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cccccc]">{nextModule ? `${completedTraining.length} of ${modules.length} modules complete. Continue with the next lesson.` : 'You have completed every active training module.'}</p>
                <Link to="/training" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 hover:bg-cyan-300 transition-colors">Open Academy <ArrowRight className="h-4 w-4" /></Link>
              </section>
              <section className="rounded-[28px] border border-amber-300/15 bg-amber-300/[.05] p-6">
                <Sparkles className="h-7 w-7 text-amber-300" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-amber-300">Next setup action</p>
                <h2 className="mt-1.5 text-lg sm:text-xl font-black text-white">{nextOnboarding ? nextOnboarding.title.en : 'Onboarding complete'}</h2>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cccccc]">{completedOnboarding.length} of {items.length} True Legacy setup steps complete.</p>
                <Link to="/crm/growth" className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-black text-amber-200 hover:text-amber-100 transition-colors">Open progress center <ArrowRight className="h-4 w-4" /></Link>
              </section>
            </div>
          </div>

          <section className="mt-7 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
            <QuickAction to="/app/bookings" icon={<CalendarCheck2 className="h-5 w-5" />} title="Share your calendar" text="Send your personal discovery-call booking link." />
            <QuickAction to="/app/share" icon={<MessageCircle className="h-5 w-5" />} title="Share a presentation" text="Send an official personalized True Legacy page." />
            <QuickAction to="/crm/growth" icon={<Users className="h-5 w-5" />} title="Support your team" text="Review onboarding and academy progress." />
            <QuickAction to="/app/library" icon={<BookOpenCheck className="h-5 w-5" />} title="Find a resource" text="Open the True Legacy Tool Center." />
          </section>
        </div>
      </main>
    </div>
  )
}

function LeadAction({ lead }: { lead: CrmLead }) {
  const overdue = Boolean(lead.next_follow_up_at && new Date(lead.next_follow_up_at) < new Date())
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent(`True Legacy Follow-Up · ${lead.full_name}`)}`

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/[.08] bg-black/15 p-4 sm:flex-row sm:items-center">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${overdue ? 'bg-rose-400/10 text-rose-300' : 'bg-cyan-400/10 text-[#2997ff]'}`}>
        <Users className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-black">{lead.full_name}</h3>
          <span className="rounded-full bg-white/[.06] px-2 py-1 text-[10px] font-bold uppercase text-[#cccccc]">{lead.interest}</span>
        </div>
        <p className="mt-1 text-xs text-[#86868b]">
          {overdue ? 'Follow-up overdue' : lead.next_follow_up_at ? `Follow up ${new Date(lead.next_follow_up_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'New contact — make the first connection'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {lead.phone && (
          <a
            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300/25 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        )}
        {lead.email && (
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 transition-colors"
            title="Compose in Gmail"
          >
            <Mail className="h-3.5 w-3.5" />
            Gmail
          </a>
        )}
        <Link to={`/crm?contact=${lead.id}`} className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-colors">
          Open
        </Link>
      </div>
    </article>
  )
}
const METRIC_TONES: Record<string, string> = { rose: 'text-rose-300', amber: 'text-amber-300', cyan: 'text-[#2997ff]', emerald: 'text-[#cccccc]' }
function Metric({ icon, value, label, tone }: { icon: React.ReactNode; value: string | number; label: string; tone: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><span className={METRIC_TONES[tone]}>{icon}</span><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#86868b]">{label}</p></div> }
function QuickAction({ to, icon, title, text }: { to: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[.025] hover:bg-white/[.05] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-[#2997ff] border border-cyan-400/20 group-hover:scale-105 group-hover:bg-cyan-400/20 group-hover:border-cyan-400/40 transition-all">
          {icon}
        </span>
        <h3 className="mt-3 text-xs sm:text-sm font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-[11px] sm:text-xs text-[#86868b] leading-relaxed line-clamp-2">
          {text}
        </p>
      </div>
    </Link>
  )
}
function EmptyState() { return <div className="rounded-2xl border border-dashed border-emerald-300/20 p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-[#cccccc]" /><h3 className="mt-3 font-black">You are caught up</h3><p className="mt-2 text-sm text-[#86868b]">No new or overdue contacts need attention.</p></div> }
function TodayMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-black p-5 text-white"><div className="max-w-md text-center"><CalendarCheck2 className="mx-auto h-12 w-12 text-[#2997ff]" /><h1 className="mt-5 text-3xl font-black">{title}</h1><p className="mt-4 leading-7 text-[#cccccc]">{body}</p>{action ? <div className="mt-7">{action}</div> : null}</div></main> }
