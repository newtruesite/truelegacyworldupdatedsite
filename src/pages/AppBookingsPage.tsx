import { SEO } from '@/components/SEO'
import { Navbar } from '@/components/layout/Navbar'
import { crmConfigured, crmSupabase, getCrmDistributors, getCrmMembership } from '@/lib/crm'
import type { CrmDistributor, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { ArrowLeft, ArrowRight, CalendarCheck2, Check, Clock3, Copy, ExternalLink, Link2, Settings2, UserRoundCheck, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type BookingType = { id: string; distributor_id: string; slug: string; title: string; description: string; duration_minutes: number; buffer_minutes: number; timezone: string; active: boolean }
type WindowRow = { id: string; distributor_id: string; weekday: number; start_time: string; end_time: string; active: boolean }
type Meeting = { id: string; distributor_id: string; guest_name: string; guest_email: string; guest_phone: string|null; starts_at: string; ends_at: string; status: string; notes: string|null }
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AppBookingsPage() {
  const [session, setSession] = useState<Session|null>(null)
  const [membership, setMembership] = useState<CrmMembership|null>(null)
  const [distributor, setDistributor] = useState<CrmDistributor|null>(null)
  const [bookingType, setBookingType] = useState<BookingType|null>(null)
  const [windows, setWindows] = useState<WindowRow[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(crmConfigured)
  const [saving, setSaving] = useState<number|null>(null)

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
        const [distributors, typesResult, windowsResult, meetingsResult] = await Promise.all([
          getCrmDistributors(),
          crmSupabase!.from('crm_booking_types').select('*').eq('active', true).order('created_at'),
          crmSupabase!.from('crm_availability_windows').select('*').eq('active', true).order('weekday'),
          crmSupabase!.from('crm_meetings').select('*').order('starts_at', { ascending: true }).limit(500),
        ])
        const owner = distributors.find(item => item.id === member.distributor_id) || (session?.user ? distributors.find(item => item.auth_user_id === session.user.id) : null) || (session?.user?.email ? distributors.find(item => item.login_email?.toLowerCase() === session.user.email!.toLowerCase()) : null) || (member.role === 'admin' ? distributors.find(item => item.slug === 'mehdi-cohen') || distributors[0] : null) || null
        setDistributor(owner)
        setBookingType(((typesResult.data || []) as BookingType[]).find(item => item.distributor_id === owner?.id) || null)
        setWindows(((windowsResult.data || []) as WindowRow[]).filter(item => item.distributor_id === owner?.id))
        setMeetings(((meetingsResult.data || []) as Meeting[]).filter(item => item.distributor_id === owner?.id))
      } finally { if (current) setLoading(false) }
    }
    load()
    return () => { current = false }
  }, [session])

  const upcoming = useMemo(() => { const now = new Date(); return meetings.filter(item => item.status === 'scheduled' && new Date(item.starts_at) >= now).slice(0, 20) }, [meetings])
  const completed = meetings.filter(item => item.status === 'completed').length
  const bookingUrl = distributor && bookingType ? `${window.location.origin}/book/${distributor.slug}/${bookingType.slug}` : ''

  async function toggleDay(day: number) {
    if (!crmSupabase || !distributor) return
    setSaving(day)
    const existing = windows.find(item => item.weekday === day)
    if (existing) {
      const { error } = await crmSupabase.from('crm_availability_windows').delete().eq('id', existing.id)
      if (!error) setWindows(current => current.filter(item => item.id !== existing.id))
    } else {
      const { data, error } = await crmSupabase.from('crm_availability_windows').insert({ distributor_id: distributor.id, weekday: day, start_time: '09:00', end_time: '17:00' }).select().single()
      if (!error && data) setWindows(current => [...current, data as WindowRow].sort((a, b) => a.weekday - b.weekday))
    }
    setSaving(null)
  }

  async function updateStatus(meetingId: string, status: string) {
    if (!crmSupabase) return
    const { error } = await crmSupabase.rpc('crm_update_meeting_status', { p_meeting_id: meetingId, p_status: status })
    if (!error) setMeetings(current => current.map(item => item.id === meetingId ? { ...item, status } : item))
  }

  if (!crmConfigured) return <Gate title="Booking connection required" />
  if (loading) return <main className="min-h-screen bg-black" />
  if (!session) return <Gate title="Distributor login required" action={<Link to="/crm" className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Sign in</Link>} />
  if (!membership?.active) return <Gate title="Account not authorized" />

  return <main className="min-h-screen bg-black px-4 pb-32 pt-7 text-white sm:px-6 lg:px-8">
    <SEO title="Bookings | True Legacy" description="Manage True Legacy discovery calls and availability." noIndex />
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/app"
            aria-label="Back to app home"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.04] hover:bg-white/[.08] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-cyan-400" />
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-[.24em] text-[#2997ff]">Phase 3A · Scheduling</p>
            <h1 className="mt-1 text-4xl font-black sm:text-5xl">Bookings</h1>
            <p className="mt-2 text-sm text-[#cccccc]">Turn interest into a scheduled conversation, connected directly to your CRM.</p>
          </div>
        </div>
        {bookingUrl && (
          <a href={bookingUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 font-bold text-[#2997ff]">
            Open booking page <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </header>

      <section className="mt-7 grid gap-4 sm:grid-cols-3"><Metric icon={<CalendarCheck2 />} value={upcoming.length} label="Upcoming" /><Metric icon={<UserRoundCheck />} value={completed} label="Completed" /><Metric icon={<Clock3 />} value={`${bookingType?.duration_minutes || 30} min`} label="Call length" /></section>

      <div className="mt-7 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-6"><section className="rounded-[28px] border border-white/20 bg-gradient-to-br from-cyan-400/[.1] to-blue-500/[.04] p-6"><Link2 className="h-7 w-7 text-[#2997ff]"/><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-[#2997ff]">Your public link</p><h2 className="mt-2 text-2xl font-black">{bookingType?.title || 'Discovery call'}</h2><p className="mt-3 break-all rounded-xl bg-black/20 p-3 text-xs text-[#cccccc]">{bookingUrl || 'Booking link unavailable'}</p><button disabled={!bookingUrl} onClick={async()=>{await navigator.clipboard.writeText(bookingUrl);setCopied(true);window.setTimeout(()=>setCopied(false),1400)}} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 font-black text-slate-950 disabled:opacity-50"><Copy className="h-4 w-4"/>{copied ? 'Link copied' : 'Copy booking link'}</button></section>

          <section className="rounded-[28px] border border-white/10 bg-white/[.03] p-6"><div className="flex items-center gap-3"><Settings2 className="text-amber-300"/><div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Weekly availability</p><h2 className="mt-1 text-xl font-black">9:00 AM – 5:00 PM</h2></div></div><p className="mt-3 text-sm leading-6 text-[#cccccc]">Turn days on or off. Times display in your booking timezone: {bookingType?.timezone || 'America/New_York'}.</p><div className="mt-5 grid grid-cols-7 gap-2">{DAYS.map((day, index) => { const active = windows.some(item => item.weekday === index); return <button key={day} disabled={saving === index} onClick={()=>toggleDay(index)} className={`grid min-h-14 place-items-center rounded-xl border text-xs font-black transition ${active ? 'border-emerald-300/30 bg-emerald-300/10 text-[#cccccc]' : 'border-white/10 text-[#86868b]'}`}><span>{day}</span>{active ? <Check className="h-3 w-3"/> : <X className="h-3 w-3"/>}</button> })}</div></section></div>

        <section className="rounded-[28px] border border-white/10 bg-white/[.03] p-5 sm:p-7"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2997ff]">Meeting pipeline</p><h2 className="mt-2 text-2xl font-black">Upcoming conversations</h2></div><div className="mt-5 space-y-3">{upcoming.map(meeting => <article key={meeting.id} className="rounded-2xl border border-white/[.08] bg-black/15 p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-400/10 text-center"><span className="text-lg font-black text-[#2997ff]">{new Date(meeting.starts_at).getDate()}</span><span className="-mt-2 text-[9px] uppercase text-[#2997ff]">{new Date(meeting.starts_at).toLocaleDateString([], { month: 'short' })}</span></div><div className="min-w-0 flex-1"><h3 className="truncate font-black">{meeting.guest_name}</h3><p className="mt-1 text-xs text-[#cccccc]">{new Date(meeting.starts_at).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })} · {meeting.guest_email}</p></div><div className="flex gap-2"><button onClick={()=>updateStatus(meeting.id,'completed')} className="rounded-lg border border-emerald-300/20 px-3 py-2 text-xs font-bold text-[#cccccc]">Complete</button><button onClick={()=>updateStatus(meeting.id,'cancelled')} className="rounded-lg border border-rose-300/20 px-3 py-2 text-xs font-bold text-rose-200">Cancel</button></div></div></article>)}{upcoming.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center"><CalendarCheck2 className="mx-auto h-9 w-9 text-[#86868b]"/><h3 className="mt-4 font-black">No upcoming calls yet</h3><p className="mt-2 text-sm text-[#86868b]">Copy your booking link and share it with your next prospect.</p></div>}</div></section>
      </div>
    </div>
  </main>
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string|number; label: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><span className="text-[#2997ff]">{icon}</span><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#86868b]">{label}</p></div> }
function Gate({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="grid min-h-screen place-items-center bg-black p-5 text-white">
        <div className="max-w-md text-center">
          <CalendarCheck2 className="mx-auto h-12 w-12 text-[#2997ff]" />
          <h1 className="mt-5 text-3xl font-black">{title}</h1>
          <p className="mt-3 text-sm text-[#cccccc]">
            Sign in with your verified distributor account to manage availability, schedule calls, and view upcoming bookings.
          </p>
          <div className="mt-7 space-y-3">
            {action || (
              <Link
                to="/crm"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2997ff] px-6 font-black text-slate-950 transition-colors hover:bg-cyan-300 cursor-pointer"
              >
                Distributor Sign In <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/leaders/apply"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 font-black text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer"
            >
              Sign Up Now — Apply for Leadership <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
