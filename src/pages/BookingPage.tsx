import { SEO } from '@/components/SEO'
import { crmConfigured, crmSupabase } from '@/lib/crm'
import { CalendarDays, CheckCircle2, Clock3, Globe2, Loader2, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'

type BookingPageData = { distributor: { slug: string; name: string; title: string; avatarUrl: string|null }; bookingType: { slug: string; title: string; description: string; durationMinutes: number; locationMode: string; timezone: string } }
type Slot = { starts_at: string; ends_at: string }
type Confirmation = { meetingId: string; startsAt: string; endsAt: string; distributorName: string }

function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` }

export default function BookingPage() {
  const { slug = '', typeSlug = 'discovery-call' } = useParams()
  const [page, setPage] = useState<BookingPageData|null>(null)
  const [date, setDate] = useState(dateKey(new Date(Date.now() + 86400000)))
  const [slots, setSlots] = useState<Slot[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState<Confirmation|null>(null)
  const browserTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', [])

  useEffect(() => {
    if (!crmSupabase) { setLoading(false); return }
    let current = true
    async function loadPage() {
      try {
        const { data } = await crmSupabase!.rpc('crm_get_booking_page', { p_distributor_slug: slug, p_booking_slug: typeSlug })
        if (current) setPage(data as BookingPageData|null)
      } finally { if (current) setLoading(false) }
    }
    loadPage()
    return () => { current = false }
  }, [slug, typeSlug])

  useEffect(() => {
    if (!page || !crmSupabase) return
    let current = true
    setSelected('')
    crmSupabase.rpc('crm_get_booking_slots', { p_distributor_slug: slug, p_booking_slug: typeSlug, p_date: date }).then(({ data }) => { if (current) setSlots((data || []) as Slot[]) })
    return () => { current = false }
  }, [date, page, slug, typeSlug])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!crmSupabase || !selected) return
    const form = new FormData(event.currentTarget)
    setSubmitting(true); setError('')
    const payload = { fullName: form.get('fullName'), email: form.get('email'), phone: form.get('phone'), country: form.get('country'), interest: form.get('interest'), notes: form.get('notes'), timezone: browserTimezone, consent: form.get('consent') === 'on', website: form.get('website') }
    const { data, error: bookingError } = await crmSupabase.rpc('crm_book_meeting', { p_distributor_slug: slug, p_booking_slug: typeSlug, p_starts_at: selected, p_payload: payload })
    if (bookingError) { setError(bookingError.message.includes('no longer available') ? 'That time was just booked. Please choose another slot.' : bookingError.message); setSubmitting(false); return }
    setConfirmation(data as Confirmation); setSubmitting(false)
  }

  if (!crmConfigured || loading) return <main className="grid min-h-screen place-items-center bg-[#05091a] text-white"><Loader2 className="h-10 w-10 animate-spin text-cyan-300"/></main>
  if (!page) return <main className="grid min-h-screen place-items-center bg-[#05091a] p-6 text-center text-white"><div><CalendarDays className="mx-auto h-12 w-12 text-slate-600"/><h1 className="mt-5 text-3xl font-black">Booking page unavailable</h1><p className="mt-3 text-slate-400">This booking link is not active.</p></div></main>
  if (confirmation) return <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#0d2a55,#05091a_58%)] p-5 text-white"><SEO title="Meeting confirmed | True Legacy" description="Your True Legacy meeting is confirmed." noIndex/><div className="w-full max-w-xl rounded-[32px] border border-emerald-300/20 bg-[#071126]/90 p-7 text-center shadow-2xl sm:p-10"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-300"/><p className="mt-6 text-xs font-black uppercase tracking-[.22em] text-emerald-300">You’re booked</p><h1 className="mt-3 text-4xl font-black">Conversation confirmed</h1><p className="mt-4 text-slate-300">You’re meeting with {confirmation.distributorName} on <strong>{new Date(confirmation.startsAt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</strong>.</p><p className="mt-6 text-sm text-slate-500">Keep this page for your records. Your contact details have been securely connected to the True Legacy CRM.</p></div></main>

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0d2a55,#05091a_58%)] px-4 py-8 text-white sm:px-6"><SEO title={`${page.bookingType.title} | ${page.distributor.name}`} description={page.bookingType.description} noIndex/><div className="mx-auto max-w-6xl"><div className="mb-7 flex items-center gap-3"><img src="/icons/icon-192.png" alt="True Legacy" className="h-11 w-11 rounded-xl"/><div><p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">True Legacy</p><p className="text-sm font-bold">Private conversation</p></div></div>
    <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-[#071126]/90 shadow-2xl lg:grid-cols-[.78fr_1.22fr]"><aside className="border-b border-white/10 bg-white/[.025] p-6 sm:p-9 lg:border-b-0 lg:border-r"><div className="flex items-center gap-4">{page.distributor.avatarUrl ? <img src={page.distributor.avatarUrl} alt={page.distributor.name} className="h-16 w-16 rounded-2xl border border-white/10 object-cover object-top"/> : <span className="grid h-16 w-16 place-items-center rounded-2xl bg-cyan-400/10 text-xl font-black text-cyan-200">{page.distributor.name[0]}</span>}<div><p className="text-xs uppercase tracking-wider text-slate-500">Meet with</p><h2 className="mt-1 text-lg font-black">{page.distributor.name}</h2><p className="text-xs text-slate-400">{page.distributor.title}</p></div></div><h1 className="mt-8 text-3xl font-black sm:text-4xl">{page.bookingType.title}</h1><p className="mt-4 leading-7 text-slate-400">{page.bookingType.description}</p><div className="mt-7 space-y-3 text-sm text-slate-300"><p className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-cyan-300"/>{page.bookingType.durationMinutes} minutes</p><p className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-cyan-300"/>Times shown in {browserTimezone.replaceAll('_',' ')}</p><p className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-cyan-300"/>Secure, CRM-connected booking</p></div></aside>
      <section className="p-6 sm:p-9"><label className="block text-xs font-black uppercase tracking-[.18em] text-cyan-300">Choose a date</label><input type="date" value={date} min={dateKey(new Date())} max={dateKey(new Date(Date.now()+60*86400000))} onChange={event=>setDate(event.target.value)} className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 [color-scheme:dark]"/><div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">{slots.map(slot => <button key={slot.starts_at} onClick={()=>setSelected(slot.starts_at)} className={`min-h-12 rounded-xl border px-3 text-sm font-black transition ${selected === slot.starts_at ? 'border-cyan-300 bg-cyan-400 text-slate-950' : 'border-white/10 bg-white/[.03] hover:border-cyan-300/30'}`}>{new Date(slot.starts_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</button>)}</div>{slots.length === 0 && <p className="mt-5 rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-slate-500">No times are available on this date. Try another day.</p>}
      {selected && <form onSubmit={submit} className="mt-8 border-t border-white/10 pt-7"><h2 className="text-xl font-black">Your details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field name="fullName" label="Full name" required/><Field name="email" label="Email" type="email" required/><Field name="phone" label="Phone"/><Field name="country" label="Country" required/></div><label className="mt-4 block text-xs font-bold text-slate-400">I’m interested in<select name="interest" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#0b1730] px-4 text-sm text-white"><option value="product">Water and wellness products</option><option value="duo">The Duo opportunity</option><option value="distributor">Building a business</option><option value="training">True Legacy training</option><option value="events">Events</option></select></label><label className="mt-4 block text-xs font-bold text-slate-400">Anything we should know?<textarea name="notes" maxLength={1000} className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm text-white"/></label><input name="website" className="hidden" tabIndex={-1} autoComplete="off"/><label className="mt-4 flex items-start gap-3 text-xs leading-5 text-slate-400"><input name="consent" type="checkbox" required className="mt-1"/>I agree to be contacted about this meeting and understand my information will be handled under the True Legacy privacy policy.</label>{error && <p className="mt-4 rounded-xl bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}<button disabled={submitting} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 font-black text-slate-950 disabled:opacity-60">{submitting ? <><Loader2 className="h-4 w-4 animate-spin"/>Booking…</> : 'Confirm conversation'}</button></form>}
      </section></div></div></main>
}

function Field({ name, label, type = 'text', required = false }: { name: string; label: string; type?: string; required?: boolean }) { return <label className="text-xs font-bold text-slate-400">{label}<input name={name} type={type} required={required} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm text-white"/></label> }
