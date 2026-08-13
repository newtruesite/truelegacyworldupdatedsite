import { SEO } from '@/components/SEO'
import { addLeadNote, assignLead, crmConfigured, crmSupabase, getCrmDistributors, getCrmLeads, getCrmMembership, getLeadNotes, updateLeadStatus } from '@/lib/crm'
import type { CrmDistributor, CrmLead, CrmLeadNote, CrmMembership, LeadStatus } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { BellRing, CalendarClock, ChevronDown, ChevronUp, Copy, Download, ExternalLink, Filter, LogOut, Mail, MessageCircle, Search, ShieldCheck, UserRoundCheck, Users } from 'lucide-react'
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
  const [interestFilter, setInterestFilter] = useState('all')
  const [attentionFilter, setAttentionFilter] = useState<'all' | 'new' | 'due'>('all')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState('')
  const [message, setMessage] = useState('')
  const [accountMessage, setAccountMessage] = useState('')

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
      const matchesInterest = interestFilter === 'all' || lead.interest === interestFilter
      const matchesAttention = attentionFilter === 'all' || (attentionFilter === 'new' ? lead.status === 'new' : Boolean(lead.next_follow_up_at && new Date(lead.next_follow_up_at) <= new Date()))
      const haystack = [lead.full_name, lead.email, lead.phone, lead.country, lead.interest, lead.referrer_name, lead.referral_code].join(' ').toLowerCase()
      return matchesStatus && matchesInterest && matchesAttention && (!query || haystack.includes(query))
    })
  }, [leads, search, statusFilter, interestFilter, attentionFilter])

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

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!crmSupabase) return
    const form = event.currentTarget
    const formData = new FormData(form)
    const password = String(formData.get('newPassword') || '')
    const confirmation = String(formData.get('confirmPassword') || '')
    if (password.length < 12) {
      setAccountMessage('Use at least 12 characters for your new password.')
      return
    }
    if (password !== confirmation) {
      setAccountMessage('The two passwords do not match.')
      return
    }
    const { error } = await crmSupabase.auth.updateUser({ password })
    setAccountMessage(error ? 'Your password could not be updated.' : 'Password updated successfully.')
    if (!error) form.reset()
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

  const scheduleFollowUp = async (event: FormEvent<HTMLFormElement>, lead: CrmLead) => {
    event.preventDefault()
    const form = event.currentTarget
    const value = String(new FormData(form).get('followUp') || '')
    const nextFollowUp = value ? new Date(value).toISOString() : null
    setWorking(lead.id)
    try {
      await updateLeadStatus(lead.id, lead.status, nextFollowUp)
      setLeads(current => current.map(item => item.id === lead.id ? { ...item, next_follow_up_at: nextFollowUp } : item))
      setMessage(nextFollowUp ? `Follow-up scheduled for ${lead.full_name}.` : `Follow-up cleared for ${lead.full_name}.`)
    } catch { setMessage('The follow-up date could not be saved.') }
    finally { setWorking('') }
  }

  const recordOutreach = async (lead: CrmLead, channel: 'WhatsApp' | 'Email', landingUrl: string) => {
    try {
      await addLeadNote(lead.id, `${channel} nurture message prepared · ${landingUrl}`)
      if (notes[lead.id]) {
        const leadNotes = await getLeadNotes(lead.id)
        setNotes(current => ({ ...current, [lead.id]: leadNotes }))
      }
      if (lead.status === 'new') {
        await updateLeadStatus(lead.id, 'contacted', lead.next_follow_up_at)
        setLeads(current => current.map(item => item.id === lead.id ? { ...item, status: 'contacted' } : item))
      }
    } catch { /* Opening the distributor's message should not be blocked by history logging. */ }
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
  const assignedDistributor = (lead: CrmLead) => distributors.find(item => item.id === lead.assigned_distributor_id)

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
          <div className="flex flex-col items-start gap-3"><details className="w-full max-w-sm rounded-xl border border-white/15 bg-white/[0.03] p-3"><summary className="cursor-pointer text-sm text-cyan-200">Change my password</summary><form onSubmit={changePassword} className="mt-3 grid gap-2"><input required minLength={12} name="newPassword" type="password" autoComplete="new-password" placeholder="New password (12+ characters)" className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm outline-none focus:border-cyan-400" /><input required minLength={12} name="confirmPassword" type="password" autoComplete="new-password" placeholder="Confirm new password" className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm outline-none focus:border-cyan-400" /><button className="h-10 rounded-lg bg-cyan-500 text-sm font-bold">Update password</button>{accountMessage && <p role="status" className="text-xs text-cyan-100">{accountMessage}</p>}</form></details><button onClick={() => crmSupabase?.auth.signOut()} className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"><LogOut className="h-4 w-4" /> Sign out</button></div>
        </header>

        {(newCount > 0 || dueCount > 0) && <section className="mt-7 flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><BellRing className="mt-0.5 h-5 w-5 text-cyan-300" /><div><p className="font-bold">Your lead alerts</p><p className="mt-1 text-sm text-slate-300">{newCount} new lead{newCount === 1 ? '' : 's'} · {dueCount} follow-up{dueCount === 1 ? '' : 's'} due</p></div></div><div className="flex gap-2"><button onClick={() => setAttentionFilter('new')} className="rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/10">Show new</button><button onClick={() => setAttentionFilter('due')} className="rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/10">Show due</button></div></section>}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<Users className="h-5 w-5" />} value={leads.length} label="Accessible leads" />
          <Metric icon={<UserRoundCheck className="h-5 w-5" />} value={newCount} label="New leads" />
          <Metric icon={<ShieldCheck className="h-5 w-5" />} value={unassigned} label="Needs assignment" />
          <Metric icon={<MessageCircle className="h-5 w-5" />} value={dueCount} label="Follow-ups due" />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 xl:flex-row"><label className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 xl:max-w-sm"><Search className="h-4 w-4 text-slate-500" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search leads" className="w-full bg-transparent text-sm outline-none" /></label><label className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-500" /><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-[#0a1020] px-3 text-sm"><option value="all">All statuses</option>{STATUSES.map(status => <option key={status} value={status}>{status}</option>)}</select></label><select value={interestFilter} onChange={event => setInterestFilter(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-[#0a1020] px-3 text-sm"><option value="all">All interests</option>{['product','duo','distributor','training','events'].map(interest => <option key={interest} value={interest}>{interest}</option>)}</select><select value={attentionFilter} onChange={event => setAttentionFilter(event.target.value as 'all' | 'new' | 'due')} className="h-11 rounded-xl border border-white/10 bg-[#0a1020] px-3 text-sm"><option value="all">All attention</option><option value="new">New leads</option><option value="due">Follow-ups due</option></select></div>
            <button onClick={exportCsv} disabled={!filtered.length} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-4 text-sm font-bold text-cyan-200 disabled:opacity-40"><Download className="h-4 w-4" /> Export CSV</button>
          </div>
          {message && <p role="alert" className="border-b border-amber-400/20 bg-amber-400/10 px-5 py-3 text-sm text-amber-100">{message}</p>}
          <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-sm"><thead className="bg-black/20 text-[10px] uppercase tracking-wider text-slate-500"><tr>{['Submitted', 'Lead', 'Interest', 'Attribution', 'Assigned to', 'Status', 'Contact', 'Details'].map(label => <th key={label} className="px-5 py-4 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y divide-white/10">{filtered.map(lead => [
            <tr key={lead.id}><td className="whitespace-nowrap px-5 py-4 text-slate-400">{new Date(lead.submitted_at).toLocaleString()}</td><td className="px-5 py-4"><p className="font-bold">{lead.full_name}</p><a href={`mailto:${lead.email}`} className="text-xs text-cyan-300">{lead.email}</a><p className="mt-1 text-xs text-slate-500">{lead.country}</p></td><td className="px-5 py-4 capitalize">{lead.interest}</td><td className="px-5 py-4"><p className="capitalize">{lead.attribution_method.replaceAll('_', ' ')}</p><p className="mt-1 text-xs text-slate-500">{lead.referrer_name || lead.referral_code || '—'}</p></td><td className="px-5 py-4">{membership?.role === 'admin' ? <select disabled={working === lead.id} value={lead.assigned_distributor_id || ''} onChange={event => changeAssignment(lead.id, event.target.value)} className="rounded-lg border border-white/10 bg-[#0a1020] px-3 py-2 text-xs"><option value="">Unassigned</option>{distributors.filter(item => item.active).map(item => <option key={item.id} value={item.id}>{item.display_name}</option>)}</select> : assignedName(lead.assigned_distributor_id)}</td><td className="px-5 py-4"><select disabled={working === lead.id} value={lead.status} onChange={event => changeStatus(lead, event.target.value as LeadStatus)} className={`rounded-lg border border-white/10 px-3 py-2 text-xs capitalize ${STATUS_STYLES[lead.status]}`}>{STATUSES.map(status => <option className="bg-[#0a1020] text-white" key={status} value={status}>{status}</option>)}</select></td><td className="px-5 py-4"><div className="flex gap-2"><a href={`mailto:${lead.email}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:text-cyan-200">Email</a>{lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs text-emerald-200">WhatsApp</a>}</div></td><td className="px-5 py-4"><button onClick={() => toggleDetails(lead.id)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs">View {expanded === lead.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button></td></tr>,
            expanded === lead.id ? <tr key={`${lead.id}-details`}><td colSpan={8} className="bg-black/20 p-5"><div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr_1fr]"><div><h3 className="text-sm font-bold">Lead details</h3><div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><Detail label="Phone" value={lead.phone} /><Detail label="Referral code" value={lead.referral_code} /><Detail label="Referrer" value={lead.referrer_name} /><Detail label="Source" value={lead.source_path} /><Detail label="Language" value={lead.locale.toUpperCase()} /></div><form onSubmit={event => scheduleFollowUp(event, lead)} className="mt-4 rounded-xl border border-white/10 p-4"><label className="flex items-center gap-2 text-xs font-bold text-cyan-200"><CalendarClock className="h-4 w-4" />Next follow-up</label><input name="followUp" type="datetime-local" defaultValue={lead.next_follow_up_at ? new Date(new Date(lead.next_follow_up_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''} className="mt-3 h-10 w-full rounded-lg border border-white/10 bg-[#0a1020] px-3 text-xs" /><button disabled={working === lead.id} className="mt-3 w-full rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold">Save follow-up</button></form></div><NurtureCenter lead={lead} distributor={assignedDistributor(lead)} onOpen={recordOutreach} /><div><h3 className="text-sm font-bold">Contact history & notes</h3><form onSubmit={event => saveNote(event, lead.id)} className="mt-3 grid gap-2"><textarea required name="note" maxLength={3000} placeholder="Add a call, WhatsApp, email, or follow-up note" className="min-h-20 rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-cyan-400" /><button disabled={working === lead.id} className="justify-self-end rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold">Save note</button></form><div className="mt-3 max-h-72 space-y-2 overflow-y-auto">{(notes[lead.id] || []).map(note => <div key={note.id} className="rounded-xl border border-white/10 p-3"><p className="text-sm text-slate-300">{note.body}</p><p className="mt-2 text-[10px] text-slate-500">{new Date(note.created_at).toLocaleString()}</p></div>)}{notes[lead.id]?.length === 0 && <p className="text-xs text-slate-500">No contact history yet.</p>}</div></div></div></td></tr> : null,
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

const NURTURE_STEPS: Record<string, Array<{ label: string; campaign: 'duo' | 'business' | 'training' | 'events'; purpose: string }>> = {
  product: [
    { label: 'Start with the Duo', campaign: 'duo', purpose: 'product overview and demonstrations' },
    { label: 'Invite to a live event', campaign: 'events', purpose: 'questions and community' },
  ],
  duo: [
    { label: 'Share the Duo', campaign: 'duo', purpose: 'K8 and emGuarde GO demonstrations' },
    { label: 'Invite to a live event', campaign: 'events', purpose: 'questions and next steps' },
  ],
  distributor: [
    { label: 'Share the business page', campaign: 'business', purpose: 'business model and duplication' },
    { label: 'Show the training system', campaign: 'training', purpose: 'team support and development' },
    { label: 'Invite to a live event', campaign: 'events', purpose: 'live presentation and questions' },
  ],
  training: [
    { label: 'Show the training system', campaign: 'training', purpose: 'training and leadership support' },
    { label: 'Share the business page', campaign: 'business', purpose: 'duplication and community' },
  ],
  events: [
    { label: 'Invite to a live event', campaign: 'events', purpose: 'the next live presentation' },
    { label: 'Follow with the Duo', campaign: 'duo', purpose: 'product demonstrations' },
  ],
}

function nurtureMessage(lead: CrmLead, distributor: CrmDistributor, campaign: string, url: string) {
  const firstName = lead.full_name.trim().split(/\s+/)[0]
  if (lead.locale === 'es') return `Hola ${firstName}, soy ${distributor.display_name} de True Legacy. Gracias por tu interés. Preparé esta información sobre ${campaign === 'duo' ? 'K8 y emGuarde GO' : campaign === 'business' ? 'el modelo de negocio' : campaign === 'training' ? 'nuestro sistema de entrenamiento' : 'nuestros eventos en vivo'} para ti: ${url}\n\nRevísala cuando puedas y dime qué preguntas tienes.`
  if (lead.locale === 'pt') return `Olá ${firstName}, sou ${distributor.display_name} da True Legacy. Obrigado pelo seu interesse. Preparei estas informações para você: ${url}\n\nVeja quando puder e me diga quais perguntas você tem.`
  if (lead.locale === 'fr') return `Bonjour ${firstName}, je suis ${distributor.display_name} de True Legacy. Merci pour votre intérêt. J'ai préparé ces informations pour vous : ${url}\n\nConsultez-les quand vous pourrez et dites-moi quelles questions vous avez.`
  return `Hi ${firstName}, this is ${distributor.display_name} with True Legacy. Thanks for your interest. I prepared this information for you: ${url}\n\nTake a look when you can and let me know what questions you have.`
}

function NurtureCenter({ lead, distributor, onOpen }: { lead: CrmLead; distributor?: CrmDistributor; onOpen: (lead: CrmLead, channel: 'WhatsApp' | 'Email', landingUrl: string) => void }) {
  const [copied, setCopied] = useState('')
  if (!distributor) return <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5"><h3 className="font-bold">Nurture center</h3><p className="mt-2 text-sm text-slate-400">Assign this lead to a distributor before sending personalized landing pages.</p></div>
  const steps = NURTURE_STEPS[lead.interest] || NURTURE_STEPS.product
  return <div><h3 className="text-sm font-bold">Recommended nurture path</h3><p className="mt-1 text-xs text-slate-500">Based on interest: <span className="capitalize text-cyan-200">{lead.interest}</span></p><div className="mt-3 space-y-3">{steps.map((step, index) => {
    const landingUrl = `${window.location.origin}/d/${distributor.slug}/${step.campaign}`
    const text = nurtureMessage(lead, distributor, step.campaign, landingUrl)
    const whatsAppUrl = lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}` : ''
    const emailUrl = `mailto:${lead.email}?subject=${encodeURIComponent(`Information from ${distributor.display_name} · True Legacy`)}&body=${encodeURIComponent(text)}`
    return <article key={step.campaign} className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Step {index + 1}</p><p className="mt-1 font-bold">{step.label}</p><p className="mt-1 text-xs text-slate-500">{step.purpose}</p><div className="mt-3 flex flex-wrap gap-2">{whatsAppUrl && <a href={whatsAppUrl} target="_blank" rel="noreferrer" onClick={() => onOpen(lead, 'WhatsApp', landingUrl)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/25 px-3 py-2 text-xs text-emerald-200"><MessageCircle className="h-3.5 w-3.5" />WhatsApp</a>}<a href={emailUrl} onClick={() => onOpen(lead, 'Email', landingUrl)} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/25 px-3 py-2 text-xs text-cyan-200"><Mail className="h-3.5 w-3.5" />Email</a><button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(step.campaign); window.setTimeout(() => setCopied(''), 1500) }} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs"><Copy className="h-3.5 w-3.5" />{copied === step.campaign ? 'Copied' : 'Copy'}</button><a href={landingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs"><ExternalLink className="h-3.5 w-3.5" />Preview</a></div></article>
  })}</div></div>
}

function CrmLogin({ onPasswordSubmit, onMagicLinkSubmit, message }: { onPasswordSubmit: (event: FormEvent<HTMLFormElement>) => void; onMagicLinkSubmit: (event: FormEvent<HTMLFormElement>) => void; message: string }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#060b1e] px-4 py-10 text-white"><SEO title="True Legacy CRM Sign In" description="Private team CRM sign in." noIndex /><div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-white/[0.03] p-8 text-center"><img src="/logos/tl-square-white.png" alt="True Legacy" className="mx-auto h-16 w-16 object-contain" /><h1 className="mt-6 text-3xl font-black">Private team CRM</h1><p className="mt-3 text-sm leading-6 text-slate-400">Sign in with the email and password connected to your True Legacy administrator or distributor profile.</p><form onSubmit={onPasswordSubmit} className="mt-7 grid gap-4"><input required name="email" type="email" autoComplete="email" placeholder="Authorized email" className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-400" /><input required name="password" type="password" autoComplete="current-password" placeholder="Password" className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-400" /><button className="h-12 rounded-xl bg-cyan-500 font-bold">Sign in securely</button></form><div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-600"><span className="h-px flex-1 bg-white/10" />or<span className="h-px flex-1 bg-white/10" /></div><form onSubmit={onMagicLinkSubmit} className="grid gap-3"><input required name="email" type="email" autoComplete="email" placeholder="Authorized email" className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-cyan-400" /><button className="h-12 rounded-xl border border-cyan-400/30 font-bold text-cyan-200">Email me a sign-in link</button></form>{message && <p role="alert" className="mt-4 text-sm text-cyan-200">{message}</p>}</div></main>
}

function CrmMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#060b1e] px-4 text-white"><SEO title={`${title} | True Legacy CRM`} description={body} noIndex /><div className="w-full max-w-lg rounded-3xl border border-amber-400/20 bg-white/[0.03] p-8 text-center"><img src="/logos/tl-square-white.png" alt="True Legacy" className="mx-auto h-14 w-14 object-contain" /><h1 className="mt-6 text-3xl font-black">{title}</h1><p className="mt-4 text-sm leading-6 text-slate-400">{body}</p>{action && <div className="mt-6">{action}</div>}</div></main>
}
