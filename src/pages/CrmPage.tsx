import { SEO } from '@/components/SEO'
import { addLeadNote, assignLead, crmConfigured, crmSupabase, getCrmDistributors, getCrmLeads, getCrmMembership, getLeadNotes, updateLeadStatus } from '@/lib/crm'
import type { CrmDistributor, CrmLead, CrmLeadNote, CrmMembership, LeadStatus } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { ChevronDown, ChevronUp, Download, LogOut, MessageCircle, Search, ShieldCheck, UserRoundCheck, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'nurturing', 'converted', 'closed']
const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-cyan-400/10 text-cyan-200', contacted: 'bg-blue-400/10 text-blue-200', qualified: 'bg-violet-400/10 text-violet-200',
  nurturing: 'bg-amber-400/10 text-amber-200', converted: 'bg-emerald-400/10 text-emerald-200', closed: 'bg-slate-400/10 text-slate-300',
}

function csvCell(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export default function CrmPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [notes, setNotes] = useState<Record<string, CrmLeadNote[]>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!crmSupabase) {
      setLoading(false)
      return
    }
    crmSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => data.subscription.unsubscribe()
  }, [])

  const load = async (activeSession = session) => {
    if (!activeSession) return
    setLoading(true)
    setMessage('')
    try {
      const member = await getCrmMembership(activeSession.user.id)
      setMembership(member)
      if (member?.active) {
        const [leadRows, distributorRows] = await Promise.all([getCrmLeads(), getCrmDistributors()])
        setLeads(leadRows)
        setDistributors(distributorRows)
      }
    } catch {
      setMessage('The CRM could not be loaded. Confirm that this account has an active True Legacy role.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) load(session)
    else {
      setMembership(null)
      setLeads([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      const haystack = [lead.full_name, lead.email, lead.phone, lead.country, lead.interest, lead.referrer_name, lead.referral_code].join(' ').toLowerCase()
      return matchesStatus && (!query || haystack.includes(query))
    })
  }, [leads, search, statusFilter])

  const sendMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!crmSupabase) return
    setMessage('')
    const email = String(new FormData(event.currentTarget).get('email') || '').trim().toLowerCase()
    const { error } = await crmSupabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/crm` } })
    setMessage(error ? 'The secure sign-in link could not be sent.' : 'Check your email for the secure True Legacy CRM sign-in link.')
  }

  const signInWithPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!crmSupabase) return
    setMessage('')
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')
    const { error } = await crmSupabase.auth.signInWithPassword({ email, password })
    setMessage(error ? 'The email or password was not accepted.' : '')
  }

  const changeStatus = async (lead: CrmLead, status: LeadStatus) => {
    setWorking(lead.id)
    try {
      await updateLeadStatus(lead.id, status, lead.next_follow_up_at)
      setLeads(current => current.map(item => item.id === lead.id ? { ...item, status } : item))
    } catch { setMessage('The lead status could not be updated.') }
    finally { setWorking('') }
  }

  const changeAssignment = async (leadId: string, distributorId: string) => {
    setWorking(leadId)
    try {
      await assignLead(leadId, distributorId || null)
      setLeads(current => current.map(item => item.id === leadId ? { ...item, assigned_distributor_id: distributorId || null } : item))
    } catch { setMessage('The lead assignment could not be updated.') }
    finally { setWorking('') }
  }

  const toggleDetails = async (leadId: string) => {
    if (expanded === leadId) {
      setExpanded(null)
      return
    }
    setExpanded(leadId)
    if (!notes[leadId]) {
      try {
        const leadNotes = await getLeadNotes(leadId)
        setNotes(current => ({ ...current, [leadId]: leadNotes }))
      }
      catch { setMessage('Notes could not be loaded.') }
    }
  }

  const saveNote = async (event: FormEvent<HTMLFormElement>, leadId: string) => {
    event.preventDefault()
    const form = event.currentTarget
    const body = String(new FormData(form).get('note') || '').trim()
    if (!body) return
    setWorking(leadId)
    try {
      await addLeadNote(leadId, body)
      form.reset()
      const leadNotes = await getLeadNotes(leadId)
      setNotes(current => ({ ...current, [leadId]: leadNotes }))
    } catch { setMessage('The note could not be saved.') }
    finally { setWorking('') }
  }

  const exportCsv = () => {
    const header = ['Submitted', 'Name', 'Email', 'Phone', 'Country', 'Interest', 'Referrer', 'Referral code', 'Attribution', 'Assigned distributor', 'Status', 'Consent time']
    const rows = filtered.map(lead => [lead.submitted_at, lead.full_name, lead.email, lead.phone, lead.country, lead.interest, lead.referrer_name, lead.referral_code, lead.attribution_method, distributors.find(item => item.id === lead.assigned_distributor_id)?.display_name || '', lead.status, lead.consent_at])
    const csv = [header, ...rows].map(row => row.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `true-legacy-crm-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const assignedName = (id: string | null) => distributors.find(item => item.id === id)?.display_name || 'Unassigned'

  if (!crmConfigured) return <CrmMessage title="CRM connection required" body="The secure CRM interface is ready, but this preview is not connected to its dedicated Supabase project yet." />
  if (loading && !session) return <div className="min-h-screen bg-[#060b1e]" />
  if (!session) return <CrmLogin onPasswordSubmit={signInWithPassword} onMagicLinkSubmit={sendMagicLink} message={message} />
  if (!loading && (!membership || !membership.active)) return <CrmMessage title="Account not authorized" body={`The signed-in account ${session.user.email || ''} does not have an active True Legacy CRM role.`} action={<button onClick={() => crmSupabase?.auth.signOut()} className="rounded-xl border border-white/15 px-5 py-3 text-sm">Sign out</button>} />

  const unassigned = leads.filter(item => !item.assigned_distributor_id).length
  const newCount = leads.filter(item => item.status === 'new').length
  const dueCount = leads.filter(item => item.next_follow_up_at && new Date(item.next_follow_up_at) <= new Date()).length

  return (
    <main className="min-h-screen bg-[#060b1e] px-4 py-8 text-white md:px-8">
      <SEO title="True Legacy CRM" description="Private True Legacy team lead-routing platform." noIndex />
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div><img src="/logos/tl-square-white.png" alt="True Legacy" className="mb-5 h-12 w-12 object-contain" /><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Internal team platform</p><h1 className="mt-2 text-3xl font-black md:text-5xl">Lead routing CRM</h1><p className="mt-2 text-sm text-slate-400">{membership?.role === 'admin' ? 'Administrator view — all team leads' : `Distributor view — assigned leads only`} · {session.user.email}</p></div>
          <button onClick={() => crmSupabase?.auth.signOut()} className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"><LogOut className="h-4 w-4" /> Sign out</button>
        </header>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<Users className="h-5 w-5" />} value={leads.length} label="Accessible leads" />
          <Metric icon={<UserRoundCheck className="h-5 w-5" />} value={newCount} label="New leads" />
          <Metric icon={<ShieldCheck className="h-5 w-5" />} value={unassigned} label="Needs assignment" />
          <Metric icon={<MessageCircle className="h-5 w-5" />} value={dueCount} label="Follow-ups due" />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row"><label className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 sm:max-w-md"><Search className="h-4 w-4 text-slate-500" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search leads" className="w-full bg-transparent text-sm outline-none" /></label><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-[#0a1020] px-4 text-sm"><option value="all">All statuses</option>{STATUSES.map(status => <option key={status} value={status}>{status}</option>)}</select></div>
            <button onClick={exportCsv} disabled={!filtered.length} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-4 text-sm font-bold text-cyan-200 disabled:opacity-40"><Download className="h-4 w-4" /> Export CSV</button>
          </div>
          {message && <p role="alert" className="border-b border-amber-400/20 bg-amber-400/10 px-5 py-3 text-sm text-amber-100">{message}</p>}
          <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-sm"><thead className="bg-black/20 text-[10px] uppercase tracking-wider text-slate-500"><tr>{['Submitted', 'Lead', 'Interest', 'Attribution', 'Assigned to', 'Status', 'Contact', 'Details'].map(label => <th key={label} className="px-5 py-4 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y divide-white/10">{filtered.map(lead => [
            <tr key={lead.id}><td className="whitespace-nowrap px-5 py-4 text-slate-400">{new Date(lead.submitted_at).toLocaleString()}</td><td className="px-5 py-4"><p className="font-bold">{lead.full_name}</p><a href={`mailto:${lead.email}`} className="text-xs text-cyan-300">{lead.email}</a><p className="mt-1 text-xs text-slate-500">{lead.country}</p></td><td className="px-5 py-4 capitalize">{lead.interest}</td><td className="px-5 py-4"><p className="capitalize">{lead.attribution_method.replaceAll('_', ' ')}</p><p className="mt-1 text-xs text-slate-500">{lead.referrer_name || lead.referral_code || '—'}</p></td><td className="px-5 py-4">{membership?.role === 'admin' ? <select disabled={working === lead.id} value={lead.assigned_distributor_id || ''} onChange={event => changeAssignment(lead.id, event.target.value)} className="rounded-lg border border-white/10 bg-[#0a1020] px-3 py-2 text-xs"><option value="">Unassigned</option>{distributors.filter(item => item.active).map(item => <option key={item.id} value={item.id}>{item.display_name}</option>)}</select> : assignedName(lead.assigned_distributor_id)}</td><td className="px-5 py-4"><select disabled={working === lead.id} value={lead.status} onChange={event => changeStatus(lead, event.target.value as LeadStatus)} className={`rounded-lg border border-white/10 px-3 py-2 text-xs capitalize ${STATUS_STYLES[lead.status]}`}>{STATUSES.map(status => <option className="bg-[#0a1020] text-white" key={status} value={status}>{status}</option>)}</select></td><td className="px-5 py-4"><div className="flex gap-2"><a href={`mailto:${lead.email}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:text-cyan-200">Email</a>{lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs text-emerald-200">WhatsApp</a>}</div></td><td className="px-5 py-4"><button onClick={() => toggleDetails(lead.id)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs">View {expanded === lead.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button></td></tr>,
            expanded === lead.id ? <tr key={`${lead.id}-details`}><td colSpan={8} className="bg-black/20 p-5"><div className="grid gap-5 lg:grid-cols-[1fr_1fr]"><div className="grid gap-3 sm:grid-cols-2"><Detail label="Phone" value={lead.phone} /><Detail label="Referral code" value={lead.referral_code} /><Detail label="Referrer" value={lead.referrer_name} /><Detail label="Consent" value={new Date(lead.consent_at).toLocaleString()} /><Detail label="Source" value={lead.source_path} /><Detail label="Language" value={lead.locale.toUpperCase()} /></div><div><h3 className="text-sm font-bold">Team notes</h3><form onSubmit={event => saveNote(event, lead.id)} className="mt-3 flex gap-2"><textarea required name="note" maxLength={3000} placeholder="Add a follow-up note" className="min-h-20 flex-1 rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-cyan-400" /><button disabled={working === lead.id} className="self-end rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold">Save</button></form><div className="mt-3 space-y-2">{(notes[lead.id] || []).map(note => <div key={note.id} className="rounded-xl border border-white/10 p-3"><p className="text-sm text-slate-300">{note.body}</p><p className="mt-2 text-[10px] text-slate-500">{new Date(note.created_at).toLocaleString()}</p></div>)}{notes[lead.id]?.length === 0 && <p className="text-xs text-slate-500">No notes yet.</p>}</div></div></div></td></tr> : null,
          ])}</tbody></table></div>
          {!loading && !filtered.length && <div className="p-12 text-center text-sm text-slate-500">No leads match this view.</div>}
        </section>
      </div>
    </main>
  )
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><span className="text-cyan-300">{icon}</span><p className="mt-4 text-3xl font-black">{value}</p><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p></div>
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 break-words text-sm text-slate-300">{value || '—'}</p></div>
}

function CrmLogin({ onPasswordSubmit, onMagicLinkSubmit, message }: { onPasswordSubmit: (event: FormEvent<HTMLFormElement>) => void; onMagicLinkSubmit: (event: FormEvent<HTMLFormElement>) => void; message: string }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#060b1e] px-4 py-10 text-white"><SEO title="True Legacy CRM Sign In" description="Private team CRM sign in." noIndex /><div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-white/[0.03] p-8 text-center"><img src="/logos/tl-square-white.png" alt="True Legacy" className="mx-auto h-16 w-16 object-contain" /><h1 className="mt-6 text-3xl font-black">Private team CRM</h1><p className="mt-3 text-sm leading-6 text-slate-400">Sign in with the email and password connected to your True Legacy administrator or distributor profile.</p><form onSubmit={onPasswordSubmit} className="mt-7 grid gap-4"><input required name="email" type="email" autoComplete="email" placeholder="Authorized email" className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-400" /><input required name="password" type="password" autoComplete="current-password" placeholder="Password" className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-400" /><button className="h-12 rounded-xl bg-cyan-500 font-bold">Sign in securely</button></form><div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-600"><span className="h-px flex-1 bg-white/10" />or<span className="h-px flex-1 bg-white/10" /></div><form onSubmit={onMagicLinkSubmit} className="grid gap-3"><input required name="email" type="email" autoComplete="email" placeholder="Authorized email" className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-400" /><button className="h-12 rounded-xl border border-cyan-400/30 font-bold text-cyan-200">Email me a sign-in link</button></form>{message && <p role="alert" className="mt-4 text-sm text-cyan-200">{message}</p>}</div></main>
}

function CrmMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#060b1e] px-4 text-white"><SEO title={`${title} | True Legacy CRM`} description={body} noIndex /><div className="w-full max-w-lg rounded-3xl border border-amber-400/20 bg-white/[0.03] p-8 text-center"><img src="/logos/tl-square-white.png" alt="True Legacy" className="mx-auto h-14 w-14 object-contain" /><h1 className="mt-6 text-3xl font-black">{title}</h1><p className="mt-4 text-sm leading-6 text-slate-400">{body}</p>{action && <div className="mt-6">{action}</div>}</div></main>
}
