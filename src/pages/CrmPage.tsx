import { SEO } from '@/components/SEO'
import { PortraitReferenceAdmin } from '@/components/leaders/PortraitReferenceAdmin'
import { LeaderApplicationsPanel } from '@/components/crm/LeaderApplicationsPanel'
import { LeaderAccessAdmin } from '@/components/crm/LeaderAccessAdmin'
import { SponsorGate } from '@/components/crm/SponsorGate'
import { addLeadNote, assignLead, crmConfigured, crmSupabase, getCrmDistributors, getCrmLeads, getCrmMembership, getLeadNotes, updateLeadStatus, submitCrmApplication } from '@/lib/crm'
import type { CrmDistributor, CrmLead, CrmLeadNote, CrmMembership, LeadStatus } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  Columns3,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Filter,
  List,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRoundCheck,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'nurturing', 'converted', 'closed']

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  new: { label: 'New', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  contacted: { label: 'Contacted', bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  qualified: { label: 'Qualified', bg: 'bg-violet-500/10', text: 'text-violet-300', border: 'border-violet-500/30', dot: 'bg-violet-400' },
  nurturing: { label: 'Nurturing', bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  converted: { label: 'Converted', bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  closed: { label: 'Closed', bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30', dot: 'bg-zinc-400' },
}

const INTEREST_CONFIG: Record<string, { label: string; badge: string }> = {
  product: { label: 'Product', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  duo: { label: 'Duo', badge: 'bg-cyan-500/10 text-[#2997ff] border-cyan-500/20' },
  distributor: { label: 'Business', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  training: { label: 'Training', badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  events: { label: 'Events', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
}

function formatLeadDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatLeadDateTime(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const datePart = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timePart = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${datePart} · ${timePart}`
}

function getGmailComposeUrl(to: string, subject: string = '', body: string = '') {
  const params = new URLSearchParams()
  params.set('view', 'cm')
  params.set('fs', '1')
  params.set('to', to)
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  return `https://mail.google.com/mail/?${params.toString()}`
}

function csvCell(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export default function CrmPage() {
  const [searchParams] = useSearchParams()
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [notes, setNotes] = useState<Record<string, CrmLeadNote[]>>({})
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [interestFilter, setInterestFilter] = useState('all')
  const [attentionFilter, setAttentionFilter] = useState<'all' | 'new' | 'due'>('all')
  const [view, setView] = useState<'table' | 'board'>(() => (window.localStorage.getItem('tl-crm-view') === 'board' ? 'board' : 'table'))
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState('')
  const [message, setMessage] = useState('')
  const [accountMessage, setAccountMessage] = useState('')
  const [recoveringPassword, setRecoveringPassword] = useState(false)
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [addingLead, setAddingLead] = useState(false)
  const [addLeadError, setAddLeadError] = useState('')
  const [activeTab, setActiveTab] = useState<'details' | 'nurture' | 'notes'>('details')
  const [adminScope, setAdminScope] = useState<'personal' | 'oversight'>('personal')
  const [oversightDistributorFilter, setOversightDistributorFilter] = useState<string>('all')
  const [adminSection, setAdminSection] = useState<'leads' | 'applications' | 'security' | 'portraits'>('leads')

  useEffect(() => {
    if (!crmSupabase) {
      setLoading(false)
      return
    }
    crmSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = crmSupabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      if (event === 'PASSWORD_RECOVERY') setRecoveringPassword(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const attention = searchParams.get('attention')
    if (attention === 'due' || attention === 'new') setAttentionFilter(attention)
    const contact = searchParams.get('contact')
    if (contact) setSelectedLeadId(contact)
  }, [searchParams])

  useEffect(() => {
    window.localStorage.setItem('tl-crm-view', view)
  }, [view])

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

  const isAdmin = membership?.role === 'admin'
  const myDistributorId = membership?.distributor_id

  const personalLeads = useMemo(() => {
    if (isAdmin && myDistributorId) {
      return leads.filter((l) => l.assigned_distributor_id === myDistributorId)
    }
    return leads
  }, [leads, isAdmin, myDistributorId])

  const unassignedLeads = useMemo(() => {
    return leads.filter((l) => !l.assigned_distributor_id)
  }, [leads])

  const baseLeads = useMemo(() => {
    if (!isAdmin || adminScope === 'personal') {
      return personalLeads
    }
    if (oversightDistributorFilter === 'all') return leads
    if (oversightDistributorFilter === 'unassigned') return unassignedLeads
    return leads.filter((l) => l.assigned_distributor_id === oversightDistributorFilter)
  }, [isAdmin, adminScope, personalLeads, leads, oversightDistributorFilter, unassignedLeads])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return baseLeads.filter((lead) => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      const matchesInterest = interestFilter === 'all' || lead.interest === interestFilter
      const matchesAttention =
        attentionFilter === 'all' ||
        (attentionFilter === 'new'
          ? lead.status === 'new'
          : Boolean(lead.next_follow_up_at && new Date(lead.next_follow_up_at) <= new Date()))
      const haystack = [lead.full_name, lead.email, lead.phone, lead.country, lead.interest, lead.referrer_name, lead.referral_code]
        .join(' ')
        .toLowerCase()
      return matchesStatus && matchesInterest && matchesAttention && (!query || haystack.includes(query))
    })
  }, [baseLeads, search, statusFilter, interestFilter, attentionFilter])

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null
    return leads.find((item) => item.id === selectedLeadId) || null
  }, [leads, selectedLeadId])

  const openLeadDrawer = async (leadId: string) => {
    setSelectedLeadId(leadId)
    if (!notes[leadId]) {
      try {
        const leadNotes = await getLeadNotes(leadId)
        setNotes((current) => ({ ...current, [leadId]: leadNotes }))
      } catch {
        setMessage('Notes could not be loaded.')
      }
    }
  }

  const changeStatus = async (lead: CrmLead, status: LeadStatus) => {
    setWorking(lead.id)
    try {
      await updateLeadStatus(lead.id, status, lead.next_follow_up_at)
      setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)))
    } catch {
      setMessage('The lead status could not be updated.')
    } finally {
      setWorking('')
    }
  }

  const changeAssignment = async (leadId: string, distributorId: string) => {
    setWorking(leadId)
    try {
      await assignLead(leadId, distributorId || null)
      setLeads((current) =>
        current.map((item) => (item.id === leadId ? { ...item, assigned_distributor_id: distributorId || null } : item))
      )
    } catch {
      setMessage('The lead assignment could not be updated.')
    } finally {
      setWorking('')
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
      setNotes((current) => ({ ...current, [leadId]: leadNotes }))
    } catch {
      setMessage('The note could not be saved.')
    } finally {
      setWorking('')
    }
  }

  const scheduleFollowUp = async (event: FormEvent<HTMLFormElement>, lead: CrmLead) => {
    event.preventDefault()
    const form = event.currentTarget
    const value = String(new FormData(form).get('followUp') || '')
    const nextFollowUp = value ? new Date(value).toISOString() : null
    setWorking(lead.id)
    try {
      await updateLeadStatus(lead.id, lead.status, nextFollowUp)
      setLeads((current) =>
        current.map((item) => (item.id === lead.id ? { ...item, next_follow_up_at: nextFollowUp } : item))
      )
      setMessage(nextFollowUp ? `Follow-up scheduled for ${lead.full_name}.` : `Follow-up cleared for ${lead.full_name}.`)
    } catch {
      setMessage('The follow-up date could not be saved.')
    } finally {
      setWorking('')
    }
  }

  const recordOutreach = async (lead: CrmLead, channel: 'WhatsApp' | 'Email' | 'SMS', landingUrl: string) => {
    try {
      await addLeadNote(lead.id, `${channel} nurture message prepared · ${landingUrl}`)
      if (notes[lead.id]) {
        const leadNotes = await getLeadNotes(lead.id)
        setNotes((current) => ({ ...current, [lead.id]: leadNotes }))
      }
      if (lead.status === 'new') {
        await updateLeadStatus(lead.id, 'contacted', lead.next_follow_up_at)
        setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status: 'contacted' } : item)))
      }
    } catch {
      /* Outreach logging */
    }
  }

  const handleAddLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAddLeadError('')
    setAddingLead(true)
    const formData = new FormData(event.currentTarget)

    const fullName = String(formData.get('fullName') || '').trim()
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const phone = String(formData.get('phone') || '').trim()
    const country = String(formData.get('country') || '').trim()
    const interest = String(formData.get('interest') || '')
    const locale = String(formData.get('locale') || 'en')
    const assignedId = String(formData.get('assignedTo') || '')

    if (fullName.length < 2) {
      setAddLeadError('Name must be at least 2 characters.')
      setAddingLead(false)
      return
    }
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setAddLeadError('Please enter a valid email address.')
      setAddingLead(false)
      return
    }
    if (country.length < 2) {
      setAddLeadError('Please enter a valid country.')
      setAddingLead(false)
      return
    }

    let assignedDistributor = distributors.find((d) => d.id === assignedId)
    if (membership?.role !== 'admin') {
      assignedDistributor = distributors.find((d) => d.id === membership?.distributor_id)
    }

    const payload = {
      fullName,
      email,
      phone,
      country,
      interest,
      hasReferrer: !!assignedDistributor,
      referredBy: '',
      referralCode: assignedDistributor ? assignedDistributor.referral_code : '',
      selectedDistributor: assignedDistributor ? assignedDistributor.slug : '',
      locale,
      sourcePath: '/crm/manual-addition',
      consent: true,
      privacyVersion: '2026-08-phase-1',
      website: '',
    }

    try {
      await submitCrmApplication(payload)
      setShowAddLeadModal(false)
      await load()
      setMessage(`Lead for ${fullName} added successfully.`)
    } catch (err: any) {
      setAddLeadError(err.message || 'Failed to add lead. Please try again.')
    } finally {
      setAddingLead(false)
    }
  }

  const exportCsv = async () => {
    const header = [
      'Submitted',
      'Name',
      'Email',
      'Phone',
      'Country',
      'Interest',
      'Referrer',
      'Referral code',
      'Attribution',
      'Assigned distributor',
      'Status',
      'Consent time',
    ]
    const rows = filtered.map((lead) => [
      lead.submitted_at,
      lead.full_name,
      lead.email,
      lead.phone || '',
      lead.country,
      lead.interest,
      lead.referrer_name || '',
      lead.referral_code || '',
      lead.attribution_method,
      assignedName(lead.assigned_distributor_id),
      lead.status,
      lead.consent_at || '',
    ])
    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `true-legacy-leads-${isOversight ? 'team' : 'personal'}-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()

    // Audit log the export
    if (crmSupabase) {
      try {
        await crmSupabase.rpc('crm_log_export', {
          p_count: filtered.length,
          p_scope: isOversight ? 'team_oversight' : 'personal',
        })
      } catch {}
    }
    setMessage(`Exported ${filtered.length} leads securely.`)
  }

  const assignedName = (id: string | null) => distributors.find((item) => item.id === id)?.display_name || 'Unassigned'
  const assignedDistributor = (lead: CrmLead) => distributors.find((item) => item.id === lead.assigned_distributor_id)

  const applySmartView = (preset: 'all' | 'new' | 'due' | 'product' | 'business') => {
    setSearch('')
    setStatusFilter('all')
    setInterestFilter('all')
    setAttentionFilter('all')
    if (preset === 'new' || preset === 'due') setAttentionFilter(preset)
    if (preset === 'product') setInterestFilter('product')
    if (preset === 'business') setInterestFilter('distributor')
  }

  if (!crmConfigured) {
    return (
      <CrmMessage
        title="CRM connection required"
        body="The secure CRM interface is ready, but this preview is not connected to its dedicated Supabase project yet."
      />
    )
  }
  if (loading && !session) return <div className="min-h-screen bg-black" />
  if (!session) {
    return (
      <CrmLogin
        onPasswordSubmit={async (e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          const email = String(data.get('email') || '').trim().toLowerCase()
          const password = String(data.get('password') || '')
          const { error } = await crmSupabase!.auth.signInWithPassword({ email, password })
          setMessage(error ? 'The email or password was not accepted.' : '')
        }}
        onMagicLinkSubmit={async (e) => {
          e.preventDefault()
          const email = String(new FormData(e.currentTarget).get('email') || '').trim().toLowerCase()
          const { error } = await crmSupabase!.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/crm` } })
          setMessage(error ? 'The sign-in link could not be sent.' : 'Check your email for the sign-in link.')
        }}
        onPasswordReset={async (email) => {
          const { error } = await crmSupabase!.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/crm` })
          setMessage(error ? 'The reset email could not be sent.' : 'Check your email for a password reset link.')
        }}
        message={message}
      />
    )
  }
  if (recoveringPassword) return <PasswordRecovery onComplete={() => setRecoveringPassword(false)} />
  if (!loading && (!membership || !membership.active)) {
    return (
      <CrmMessage
        title="Account not authorized"
        body={`The signed-in account ${session.user.email || ''} does not have an active True Legacy CRM role.`}
        action={
          <button onClick={() => crmSupabase?.auth.signOut()} className="rounded-xl border border-white/15 px-5 py-3 text-sm">
            Sign out
          </button>
        }
      />
    )
  }

  const isOversight = isAdmin && adminScope === 'oversight'
  const activeScopeLeads = isOversight ? baseLeads : personalLeads
  const newCount = activeScopeLeads.filter((l) => l.status === 'new').length
  const dueCount = activeScopeLeads.filter(
    (l) => l.next_follow_up_at && new Date(l.next_follow_up_at) <= new Date()
  ).length
  const unassignedCount = unassignedLeads.length

  return (
    <SponsorGate membership={membership} distributors={distributors}>
      <main className="min-h-screen bg-black px-3 py-6 text-white sm:px-6 lg:px-8">
        <SEO title="True Legacy CRM" description="Command Center & Lead Management Platform." noIndex />
        <div className="crm-container mx-auto w-full max-w-[1500px]">
          {/* Header */}
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img src="/logos/tl-square-white.png" alt="True Legacy" className="h-8 w-8 object-contain" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2997ff]">Sales Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">Contacts & Leads</h1>
              <p className="mt-1 text-xs sm:text-sm text-[#cccccc]">
                {isAdmin
                  ? isOversight
                    ? 'Admin Team Oversight & Overrides · Full Team View'
                    : 'Personal Distributor Workspace · My Assigned Leads'
                  : 'Distributor Workspace · My Assigned Leads'} ·{' '}
                <span className="text-white font-medium">{session.user.email}</span>
              </p>

              {/* Admin Personal vs Team Oversight Scope Switcher */}
              {isAdmin && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-black/50 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminScope('personal')
                      setStatusFilter('all')
                      setInterestFilter('all')
                      setAttentionFilter('all')
                      setSearch('')
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      adminScope === 'personal'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                        : 'text-[#cccccc] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <UserRoundCheck className="h-3.5 w-3.5" />
                    My Leads ({personalLeads.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminScope('oversight')
                      setStatusFilter('all')
                      setInterestFilter('all')
                      setAttentionFilter('all')
                      setSearch('')
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      adminScope === 'oversight'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25'
                        : 'text-[#cccccc] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin Oversight & Overrides ({leads.length})
                    {unassignedCount > 0 && (
                      <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                        {unassignedCount} unassigned
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {isAdmin && (
                <Link
                  to="/crm/growth"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Growth Center
                </Link>
              )}
              <button
                onClick={() => {
                  setShowAddLeadModal(true)
                  setAddLeadError('')
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <UserPlus className="h-4 w-4" />
                Add Lead
              </button>
              <button
                onClick={() => crmSupabase?.auth.signOut()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#86868b] hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          {/* Admin Navigation Hub (When Admin) */}
          {isAdmin && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setAdminSection('leads')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  adminSection === 'leads'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'border border-white/10 bg-white/[0.03] text-[#cccccc] hover:border-white/20 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                Contacts & Leads
              </button>

              <button
                type="button"
                onClick={() => setAdminSection('applications')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  adminSection === 'applications'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'border border-white/10 bg-white/[0.03] text-[#cccccc] hover:border-white/20 hover:text-white'
                }`}
              >
                <UserRoundCheck className="h-4 w-4" />
                Leader Applications
              </button>

              <button
                type="button"
                onClick={() => setAdminSection('security')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  adminSection === 'security'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'border border-white/10 bg-white/[0.03] text-[#cccccc] hover:border-white/20 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Leader Access & Security
              </button>

              <button
                type="button"
                onClick={() => setAdminSection('portraits')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  adminSection === 'portraits'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'border border-white/10 bg-white/[0.03] text-[#cccccc] hover:border-white/20 hover:text-white'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Portrait Standard
              </button>
            </div>
          )}

          {/* Admin Sub-Views: Applications, Security, or Portraits */}
          {isAdmin && adminSection === 'applications' && (
            <div className="mt-6">
              <LeaderApplicationsPanel />
            </div>
          )}

          {isAdmin && adminSection === 'security' && (
            <div className="mt-6">
              <LeaderAccessAdmin />
            </div>
          )}

          {isAdmin && adminSection === 'portraits' && (
            <div className="mt-6">
              <PortraitReferenceAdmin />
            </div>
          )}

          {/* Main Leads Workspace (Always for distributors, and when adminSection === 'leads' for admins) */}
          {(!isAdmin || adminSection === 'leads') && (
            <>
              {/* Quick KPI Stats Bar */}
              <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {isOversight ? (
                  <>
                    <MetricCard icon={<Users className="h-4 w-4 text-[#2997ff]" />} value={leads.length} label="Total Team Leads" />
                    <MetricCard icon={<UserRoundCheck className="h-4 w-4 text-cyan-400" />} value={newCount} label="New Inquiries" tone="cyan" />
                    <MetricCard
                      icon={<ShieldCheck className="h-4 w-4 text-amber-400" />}
                      value={unassignedCount}
                      label="Unassigned (Review)"
                      tone={unassignedCount > 0 ? 'rose' : 'amber'}
                    />
                    <MetricCard icon={<MessageCircle className="h-4 w-4 text-rose-400" />} value={dueCount} label="Follow-ups Due" tone="rose" />
                  </>
                ) : (
                  <>
                    <MetricCard icon={<Users className="h-4 w-4 text-[#2997ff]" />} value={personalLeads.length} label="My Active Leads" />
                    <MetricCard icon={<UserRoundCheck className="h-4 w-4 text-cyan-400" />} value={newCount} label="New Leads" tone="cyan" />
                    <MetricCard icon={<MessageCircle className="h-4 w-4 text-rose-400" />} value={dueCount} label="Follow-ups Due" tone="rose" />
                    <MetricCard
                      icon={<Sparkles className="h-4 w-4 text-emerald-400" />}
                      value={personalLeads.filter((l) => l.status === 'converted').length}
                      label="Converted Customers"
                      tone="emerald"
                    />
                  </>
                )}
              </section>

              {/* Admin Oversight Dedicated Banner & Distributor Filter */}
              {isOversight && (
                <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/[0.06] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-amber-400/40 bg-amber-400/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                          Admin Oversight Mode
                        </span>
                        <span className="text-xs text-[#86868b]">All Team Leads ({leads.length})</span>
                      </div>
                      <p className="mt-1 text-xs text-[#cccccc]">
                        Monitoring all distributor leads across True Legacy. You can reassign ownership, override statuses, and manage team attribution.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <select
                      value={oversightDistributorFilter}
                      onChange={(e) => setOversightDistributorFilter(e.target.value)}
                      className="h-10 rounded-xl border border-amber-400/40 bg-black/80 px-3 text-xs font-bold text-amber-200 focus:border-amber-400 outline-none w-full sm:w-auto"
                    >
                      <option value="all">All Distributors ({leads.length} leads)</option>
                      {unassignedCount > 0 && (
                        <option value="unassigned">⚠️ Unassigned Only ({unassignedCount} leads)</option>
                      )}
                      {distributors
                        .filter((d) => d.active)
                        .map((d) => {
                          const count = leads.filter((l) => l.assigned_distributor_id === d.id).length
                          return (
                            <option key={d.id} value={d.id}>
                              {d.display_name} ({count} leads)
                            </option>
                          )
                        })}
                    </select>
                  </div>
                </div>
              )}

              {/* Unassigned Leads Triage Banner */}
              {isAdmin && unassignedCount > 0 && (
                <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/[0.08] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">
                        {unassignedCount} Unassigned Lead{unassignedCount === 1 ? '' : 's'} Require Admin Review
                      </p>
                      <p className="text-xs text-rose-200/80">
                        Incoming leads without an assigned distributor owner. Assign an owner to route them to the appropriate pipeline.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAdminScope('oversight')
                      setOversightDistributorFilter('unassigned')
                    }}
                    className="rounded-xl bg-rose-500 hover:bg-rose-400 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shrink-0"
                  >
                    Review & Assign Now
                  </button>
                </div>
              )}

              {/* Lead Alerts Banner */}
              {(newCount > 0 || dueCount > 0) && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.06] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/15 text-[#2997ff]">
                      <BellRing className="h-4 w-4 animate-pulse" />
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">Lead Priority Queue</p>
                      <p className="text-xs text-[#cccccc]">
                        {newCount} new lead{newCount === 1 ? '' : 's'} · {dueCount} follow-up{dueCount === 1 ? '' : 's'} due for outreach
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAttentionFilter('new')}
                      className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-400/20 transition-colors"
                    >
                      Show New ({newCount})
                    </button>
                    <button
                      onClick={() => setAttentionFilter('due')}
                      className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition-colors"
                    >
                      Show Due ({dueCount})
                    </button>
                  </div>
                </div>
              )}

          {/* Main Command Center Container */}
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-xl shadow-2xl">
            {/* Top Toolbar: Smart Views + Search + Filters + Actions */}
            <div className="border-b border-white/10 p-4 space-y-3">
              {/* Row 1: Smart Views Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#86868b] mr-1">Views</span>
                  {[
                    ['all', 'All Contacts'],
                    ['new', 'New Leads'],
                    ['due', 'Follow-up Due'],
                    ['product', 'Product Leads'],
                    ['business', 'Business Leads'],
                  ].map(([preset, label]) => {
                    const isActive =
                      (preset === 'all' && statusFilter === 'all' && interestFilter === 'all' && attentionFilter === 'all') ||
                      (preset === 'new' && attentionFilter === 'new') ||
                      (preset === 'due' && attentionFilter === 'due') ||
                      (preset === 'product' && interestFilter === 'product') ||
                      (preset === 'business' && interestFilter === 'distributor')

                    return (
                      <button
                        key={preset}
                        onClick={() => applySmartView(preset as any)}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                            : 'border border-white/10 bg-white/[0.03] text-[#cccccc] hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                {/* View switcher & Export */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-0.5">
                    <button
                      onClick={() => setView('table')}
                      aria-label="Table view"
                      className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
                        view === 'table' ? 'bg-cyan-400/20 text-[#2997ff]' : 'text-[#86868b] hover:text-white'
                      }`}
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setView('board')}
                      aria-label="Board view"
                      className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
                        view === 'board' ? 'bg-cyan-400/20 text-[#2997ff]' : 'text-[#86868b] hover:text-white'
                      }`}
                    >
                      <Columns3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={exportCsv}
                    disabled={!filtered.length}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-[#cccccc] hover:text-white transition-colors disabled:opacity-40"
                  >
                    <Download className="h-3.5 w-3.5 text-[#2997ff]" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Row 2: Search Input & Filter Dropdowns (Flex layout that never causes overflow) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, phone, referrer..."
                    className="w-full h-10 rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-[#86868b] focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#86868b] hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 rounded-xl border border-white/10 bg-black/50 px-3 text-xs text-white focus:border-cyan-400 outline-none transition-colors"
                  >
                    <option value="all">All Statuses</option>
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_CONFIG[status]?.label || status}
                      </option>
                    ))}
                  </select>

                  <select
                    value={interestFilter}
                    onChange={(e) => setInterestFilter(e.target.value)}
                    className="h-10 rounded-xl border border-white/10 bg-black/50 px-3 text-xs text-white focus:border-cyan-400 outline-none transition-colors"
                  >
                    <option value="all">All Interests</option>
                    {['product', 'duo', 'distributor', 'training', 'events'].map((interest) => (
                      <option key={interest} value={interest}>
                        {INTEREST_CONFIG[interest]?.label || interest}
                      </option>
                    ))}
                  </select>

                  <select
                    value={attentionFilter}
                    onChange={(e) => setAttentionFilter(e.target.value as any)}
                    className="h-10 rounded-xl border border-white/10 bg-black/50 px-3 text-xs text-white focus:border-cyan-400 outline-none transition-colors"
                  >
                    <option value="all">All Attention</option>
                    <option value="new">New Leads</option>
                    <option value="due">Follow-ups Due</option>
                  </select>
                </div>
              </div>
            </div>

            {message && (
              <div className="border-b border-amber-400/20 bg-amber-400/10 px-5 py-2.5 text-xs text-amber-100 flex items-center justify-between">
                <span>{message}</span>
                <button onClick={() => setMessage('')} className="text-amber-300 hover:text-white">
                  ✕
                </button>
              </div>
            )}

            {/* View Area */}
            {view === 'board' ? (
              <PipelineBoard
                leads={filtered}
                distributors={distributors}
                working={working}
                onStatusChange={changeStatus}
                onOpen={openLeadDrawer}
              />
            ) : (
              <div>
                {/* Desktop & Laptop High-Density Layout */}
                <div className="hidden md:block">
                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(240px,2fr)_minmax(100px,0.9fr)_minmax(140px,1.2fr)_minmax(150px,1.2fr)_minmax(130px,1.1fr)_minmax(120px,0.9fr)] items-center gap-3 border-b border-white/10 bg-black/30 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#86868b]">
                    <div>Lead</div>
                    <div>Interest</div>
                    <div>Attribution</div>
                    <div>Assigned To</div>
                    <div>Status</div>
                    <div className="text-right pr-2">Actions</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-white/[0.06]">
                    {filtered.map((lead) => {
                      const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new
                      const interestCfg = INTEREST_CONFIG[lead.interest] || { label: lead.interest, badge: 'bg-white/5 text-white' }
                      const isSelected = selectedLeadId === lead.id
                      const isOverdue = lead.next_follow_up_at && new Date(lead.next_follow_up_at) <= new Date()

                      return (
                        <div
                          key={lead.id}
                          onClick={() => openLeadDrawer(lead.id)}
                          className={`group grid grid-cols-[minmax(240px,2fr)_minmax(100px,0.9fr)_minmax(140px,1.2fr)_minmax(150px,1.2fr)_minmax(130px,1.1fr)_minmax(120px,0.9fr)] items-center gap-3 px-5 py-3.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/[0.08] border-l-2 border-cyan-400'
                              : 'hover:bg-white/[0.035]'
                          }`}
                        >
                          {/* Col 1: Lead (Combined Name + Email + Country + Date) */}
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors truncate">
                                {lead.full_name}
                              </span>
                              {isOverdue && (
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping shrink-0" title="Follow-up due" />
                              )}
                            </div>
                            <p className="text-xs text-[#2997ff] truncate hover:underline">
                              {lead.email}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#86868b] truncate">
                              <span className="uppercase">{lead.country}</span> · {formatLeadDateTime(lead.submitted_at)}
                            </p>
                          </div>

                          {/* Col 2: Interest Badge */}
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${interestCfg.badge}`}
                            >
                              {interestCfg.label}
                            </span>
                          </div>

                          {/* Col 3: Attribution */}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white capitalize truncate">
                              {lead.attribution_method.replaceAll('_', ' ')}
                            </p>
                            <p className="text-[11px] text-[#86868b] truncate">
                              {lead.referrer_name || lead.referral_code || 'Direct Organic'}
                            </p>
                          </div>

                          {/* Col 4: Assigned To */}
                          <div onClick={(e) => e.stopPropagation()}>
                            {membership?.role === 'admin' ? (
                              <select
                                disabled={working === lead.id}
                                value={lead.assigned_distributor_id || ''}
                                onChange={(e) => changeAssignment(lead.id, e.target.value)}
                                className="h-8 w-full max-w-[150px] rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-xs text-white focus:border-cyan-400 outline-none transition-colors truncate"
                              >
                                <option value="">Unassigned</option>
                                {distributors
                                  .filter((d) => d.active)
                                  .map((d) => (
                                    <option key={d.id} value={d.id}>
                                      {d.display_name}
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              <span className="text-xs text-[#cccccc] font-medium truncate block">
                                {assignedName(lead.assigned_distributor_id)}
                              </span>
                            )}
                          </div>

                          {/* Col 5: Status */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <select
                              disabled={working === lead.id}
                              value={lead.status}
                              onChange={(e) => changeStatus(lead, e.target.value as LeadStatus)}
                              className={`h-8 rounded-lg border px-2.5 py-1 text-xs font-bold capitalize transition-all outline-none ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                            >
                              {STATUSES.map((status) => (
                                <option key={status} value={status} className="bg-black text-white">
                                  {STATUS_CONFIG[status]?.label || status}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Col 6: Actions */}
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={getGmailComposeUrl(lead.email, `True Legacy · Follow-Up with ${lead.full_name}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                              title="Compose in Gmail"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </a>

                            {lead.phone ? (
                              <a
                                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/25 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            ) : null}

                            <button
                              onClick={() => openLeadDrawer(lead.id)}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-colors"
                              title="View Details"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mobile Responsive Cards (< 768px) - 100% Fluid & Zero Horizontal Scroll */}
                <div className="md:hidden divide-y divide-white/[0.06] p-3 space-y-3">
                  {filtered.map((lead) => {
                    const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new
                    const interestCfg = INTEREST_CONFIG[lead.interest] || { label: lead.interest, badge: 'bg-white/5 text-white' }

                    return (
                      <div
                        key={lead.id}
                        onClick={() => openLeadDrawer(lead.id)}
                        className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3 cursor-pointer hover:border-cyan-400/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-white text-base">{lead.full_name}</h3>
                            <a
                              href={getGmailComposeUrl(lead.email, `True Legacy · ${lead.full_name}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-[#2997ff] hover:underline"
                            >
                              {lead.email}
                            </a>
                            <p className="text-[11px] text-[#86868b] mt-0.5">
                              <span className="uppercase">{lead.country}</span> · {formatLeadDateTime(lead.submitted_at)}
                            </p>
                          </div>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${interestCfg.badge}`}>
                            {interestCfg.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#86868b] block">Attribution</span>
                            <span className="font-medium text-white">{lead.referrer_name || 'Direct'}</span>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <select
                              disabled={working === lead.id}
                              value={lead.status}
                              onChange={(e) => changeStatus(lead, e.target.value as LeadStatus)}
                              className={`h-7 rounded-lg border px-2 text-[11px] font-bold capitalize ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                            >
                              {STATUSES.map((status) => (
                                <option key={status} value={status} className="bg-black text-white">
                                  {STATUS_CONFIG[status]?.label || status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={getGmailComposeUrl(lead.email, `True Legacy · ${lead.full_name}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-red-500/25 bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-300"
                            >
                              <Mail className="h-3 w-3" />
                              Gmail
                            </a>
                            {lead.phone ? (
                              <a
                                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-300"
                              >
                                <MessageCircle className="h-3 w-3" />
                                WhatsApp
                              </a>
                            ) : null}
                          </div>
                          <button
                            onClick={() => openLeadDrawer(lead.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#2997ff]"
                          >
                            Details <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {!loading && !filtered.length && (
                  <div className="p-12 text-center text-sm text-[#86868b]">
                    No leads match your active search or filters.
                  </div>
                )}
              </div>
            )}
          </section>
          </>
        )}
      </div>

        {/* Modern Slide-Over Lead Detail Drawer (attio / Linear style) */}
        {selectedLead ? (
          <div
            className="fixed inset-0 z-[120] flex justify-end bg-black/60 backdrop-blur-sm transition-all"
            onClick={() => setSelectedLeadId(null)}
          >
            <aside
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-xl flex-col border-l border-white/15 bg-[#090d16] text-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 z-10 border-b border-white/10 bg-[#090d16]/95 p-5 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-white truncate">{selectedLead.full_name}</h2>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          INTEREST_CONFIG[selectedLead.interest]?.badge || 'bg-white/5 text-white'
                        }`}
                      >
                        {INTEREST_CONFIG[selectedLead.interest]?.label || selectedLead.interest}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#2997ff]">{selectedLead.email}</p>
                    <p className="text-[11px] text-[#86868b]">
                      {selectedLead.country} · Submitted on {formatLeadDateTime(selectedLead.submitted_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLeadId(null)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[#cccccc] hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Status and Assignment Selector Bar */}
                <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#86868b]">Status:</span>
                    <select
                      disabled={working === selectedLead.id}
                      value={selectedLead.status}
                      onChange={(e) => changeStatus(selectedLead, e.target.value as LeadStatus)}
                      className={`h-8 rounded-lg border px-2.5 text-xs font-bold capitalize outline-none ${
                        STATUS_CONFIG[selectedLead.status]?.bg || ''
                      } ${STATUS_CONFIG[selectedLead.status]?.text || ''} ${
                        STATUS_CONFIG[selectedLead.status]?.border || ''
                      }`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status} className="bg-black text-white">
                          {STATUS_CONFIG[status]?.label || status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-[#86868b]">Assigned:</span>
                    {membership?.role === 'admin' ? (
                      <select
                        disabled={working === selectedLead.id}
                        value={selectedLead.assigned_distributor_id || ''}
                        onChange={(e) => changeAssignment(selectedLead.id, e.target.value)}
                        className="h-8 rounded-lg border border-white/10 bg-black/60 px-2 text-xs text-white focus:border-cyan-400 outline-none"
                      >
                        <option value="">Unassigned</option>
                        {distributors
                          .filter((d) => d.active)
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.display_name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {assignedName(selectedLead.assigned_distributor_id)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Quick Connect Action Row */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={getGmailComposeUrl(selectedLead.email, `True Legacy · ${selectedLead.full_name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 py-2.5 text-xs font-bold text-red-300 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Gmail Compose
                  </a>

                  {selectedLead.phone ? (
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20 py-2.5 text-xs font-bold text-emerald-300 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] py-2.5 text-xs text-[#86868b] opacity-60">
                      No Phone
                    </span>
                  )}

                  {selectedLead.phone ? (
                    <a
                      href={`sms:${selectedLead.phone.replace(/[^\d+]/g, '')}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 py-2.5 text-xs font-bold text-cyan-300 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      SMS Text
                    </a>
                  ) : null}

                  {selectedLead.phone ? (
                    <a
                      href={`tel:${selectedLead.phone.replace(/\s+/g, '')}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 py-2.5 text-xs font-bold text-white transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#2997ff]" />
                      Call
                    </a>
                  ) : null}
                </div>

                {/* Tabs */}
                <div className="mt-5 flex gap-1 border-b border-white/10">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2.5 text-xs font-bold border-b-2 transition-all px-3 ${
                      activeTab === 'details' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-[#86868b] hover:text-white'
                    }`}
                  >
                    Lead Details
                  </button>
                  <button
                    onClick={() => setActiveTab('nurture')}
                    className={`pb-2.5 text-xs font-bold border-b-2 transition-all px-3 ${
                      activeTab === 'nurture' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-[#86868b] hover:text-white'
                    }`}
                  >
                    Send Presentations
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`pb-2.5 text-xs font-bold border-b-2 transition-all px-3 ${
                      activeTab === 'notes' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-[#86868b] hover:text-white'
                    }`}
                  >
                    History & Notes ({notes[selectedLead.id]?.length || 0})
                  </button>
                </div>
              </div>

              {/* Drawer Body Tabs */}
              <div className="flex-1 p-5 space-y-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Follow-up scheduler */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarClock className="h-4 w-4 text-[#2997ff]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Next Follow-Up</h3>
                      </div>
                      <form onSubmit={(e) => scheduleFollowUp(e, selectedLead)} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                        <input
                          name="followUp"
                          type="datetime-local"
                          defaultValue={
                            selectedLead.next_follow_up_at
                              ? new Date(new Date(selectedLead.next_follow_up_at).getTime() - new Date().getTimezoneOffset() * 60000)
                                  .toISOString()
                                  .slice(0, 16)
                              : ''
                          }
                          className="h-10 rounded-xl border border-white/10 bg-black/60 px-3 text-xs text-white focus:border-cyan-400 outline-none"
                        />
                        <button
                          disabled={working === selectedLead.id}
                          className="h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 text-xs font-bold text-slate-950 transition-colors"
                        >
                          Save Date
                        </button>
                      </form>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <DetailCard
                        label="Lead Owner / Distributor"
                        value={assignedName(selectedLead.assigned_distributor_id) || 'Unassigned'}
                      />
                      <DetailCard label="Submission Time" value={formatLeadDateTime(selectedLead.submitted_at)} />
                      <DetailCard label="Last Updated" value={formatLeadDateTime(selectedLead.updated_at)} />
                      <DetailCard label="Phone" value={selectedLead.phone} />
                      <DetailCard label="Country" value={selectedLead.country} />
                      <DetailCard label="Referral Method" value={selectedLead.attribution_method.replaceAll('_', ' ')} />
                      <DetailCard label="Referrer Name" value={selectedLead.referrer_name} />
                      <DetailCard label="Referral Code" value={selectedLead.referral_code} />
                      <DetailCard label="Language" value={selectedLead.locale.toUpperCase()} />
                      <DetailCard label="Source Path" value={selectedLead.source_path} />
                      <DetailCard label="Consent Timestamp" value={formatLeadDateTime(selectedLead.consent_at)} />
                    </div>
                  </div>
                )}

                {activeTab === 'nurture' && (
                  <div>
                    <NurtureCenter
                      lead={selectedLead}
                      distributor={assignedDistributor(selectedLead)}
                      onOpen={recordOutreach}
                    />
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    {/* Add note */}
                    <form onSubmit={(e) => saveNote(e, selectedLead.id)} className="space-y-2">
                      <textarea
                        required
                        name="note"
                        maxLength={3000}
                        placeholder="Add interaction note (call notes, WhatsApp updates, objections, questions)..."
                        className="w-full min-h-[90px] rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-[#86868b] focus:border-cyan-400 outline-none"
                      />
                      <button
                        disabled={working === selectedLead.id}
                        className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors"
                      >
                        Save Note
                      </button>
                    </form>

                    {/* Notes timeline */}
                    <div className="space-y-2.5 pt-2">
                      {(notes[selectedLead.id] || []).map((note) => (
                        <div key={note.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                          <p className="text-xs text-[#cccccc] leading-relaxed whitespace-pre-wrap">{note.body}</p>
                          <p className="mt-2 text-[10px] text-[#86868b]">{formatLeadDateTime(note.created_at)}</p>
                        </div>
                      ))}
                      {notes[selectedLead.id]?.length === 0 && (
                        <p className="py-6 text-center text-xs text-[#86868b]">No contact history recorded yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        ) : null}

        {/* Add Lead Modal */}
        {showAddLeadModal ? (
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setShowAddLeadModal(false)
            }}
          >
            <section className="w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-3xl border border-white/15 bg-[#090d16] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2997ff]">Command Center</p>
                  <h2 className="mt-1 text-2xl font-black text-white">Add New Contact</h2>
                </div>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {addLeadError && (
                <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2.5 text-xs text-rose-200">
                  {addLeadError}
                </p>
              )}

              <form onSubmit={handleAddLead} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    required
                    minLength={2}
                    name="fullName"
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="e.g. sarah@example.com"
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1.5">Phone (Optional)</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1.5">Country</label>
                    <input
                      required
                      minLength={2}
                      name="country"
                      placeholder="e.g. United States"
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1.5">Interest Area</label>
                    <select
                      name="interest"
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-sm text-white focus:border-cyan-400 outline-none"
                    >
                      <option value="product">Product Mastery (K8)</option>
                      <option value="duo">Duo Package (K8 + emGuarde)</option>
                      <option value="distributor">Business Opportunity</option>
                      <option value="training">Leadership Academy</option>
                      <option value="events">Live Weekly Events</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1.5">Language</label>
                    <select
                      name="locale"
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-sm text-white focus:border-cyan-400 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                  {membership?.role === 'admin' ? (
                    <div>
                      <label className="block text-xs font-bold text-[#2997ff] uppercase tracking-wider mb-1.5">Assign Distributor</label>
                      <select
                        name="assignedTo"
                        className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-sm text-white focus:border-cyan-400 outline-none"
                      >
                        <option value="">Unassigned</option>
                        {distributors
                          .filter((d) => d.active)
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.display_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={addingLead}
                  className="mt-4 h-12 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  {addingLead ? 'Adding Lead...' : 'Create Contact'}
                </button>
              </form>
            </section>
          </div>
        ) : null}
      </main>
    </SponsorGate>
  )
}

function MetricCard({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-[#86868b]">{label}</p>
        <p className="mt-1 text-2xl font-black text-white">{value}</p>
      </div>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10">{icon}</span>
    </div>
  )
}

function DetailCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
      <p className="text-[10px] uppercase tracking-wider text-[#86868b]">{label}</p>
      <p className="mt-1 text-xs font-semibold text-white break-words">{value || '—'}</p>
    </div>
  )
}

function PipelineBoard({
  leads,
  distributors,
  working,
  onStatusChange,
  onOpen,
}: {
  leads: CrmLead[]
  distributors: CrmDistributor[]
  working: string
  onStatusChange: (lead: CrmLead, status: LeadStatus) => void
  onOpen: (leadId: string) => void
}) {
  return (
    <div className="overflow-x-auto p-4">
      <div className="grid min-w-[1200px] grid-cols-6 gap-3">
        {STATUSES.map((status) => {
          const column = leads.filter((lead) => lead.status === status)
          const statusCfg = STATUS_CONFIG[status]
          return (
            <section key={status} className="rounded-2xl border border-white/[0.08] bg-black/20 p-3">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${statusCfg.dot}`} />
                  <h3 className="text-xs font-black capitalize text-white">{statusCfg.label}</h3>
                </div>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-[#cccccc]">
                  {column.length}
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {column.map((lead) => {
                  const owner = distributors.find((d) => d.id === lead.assigned_distributor_id)
                  return (
                    <article
                      key={lead.id}
                      className="rounded-xl border border-white/10 bg-white/[0.035] hover:border-cyan-400/40 p-3 transition-colors cursor-pointer"
                      onClick={() => onOpen(lead.id)}
                    >
                      <p className="font-bold text-white text-xs truncate">{lead.full_name}</p>
                      <p className="text-[11px] text-[#86868b] truncate">{lead.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-[#86868b]">
                        <span className="truncate text-cyan-300/90 font-medium">
                          {owner ? owner.display_name : 'Unassigned'}
                        </span>
                        <span className="shrink-0">{formatLeadDate(lead.submitted_at)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-white/5">
                        <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[#2997ff]">
                          {lead.interest}
                        </span>
                        <span className="text-[10px] text-[#86868b] uppercase">{lead.country}</span>
                      </div>
                    </article>
                  )
                })}
                {column.length === 0 ? <p className="py-6 text-center text-xs text-[#86868b]">No contacts</p> : null}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function NurtureCenter({
  lead,
  distributor,
  onOpen,
}: {
  lead: CrmLead
  distributor?: CrmDistributor
  onOpen: (lead: CrmLead, channel: 'WhatsApp' | 'Email' | 'SMS', landingUrl: string) => void
}) {
  const [copied, setCopied] = useState('')
  if (!distributor) {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
        <h3 className="font-bold text-amber-200">Distributor assignment required</h3>
        <p className="mt-2 text-xs text-[#cccccc]">
          Assign this lead to an active distributor before sending personalized landing pages.
        </p>
      </div>
    )
  }

  const ALL_LANDING_PAGES = [
    {
      campaign: 'business' as const,
      label: '1 · Business Opportunity Page',
      purpose: 'Independent distributor model, compensation, and duplication.',
      badge: 'BUSINESS',
    },
    {
      campaign: 'duo' as const,
      label: '2 · Duo Products Page (K8 + emGuarde)',
      purpose: 'Leveluk K8 Kangen Water system & emGuarde GO demonstrations.',
      badge: 'PRODUCTS',
    },
    {
      campaign: 'training' as const,
      label: '3 · Leadership Academy & Training',
      purpose: 'Preview the education system, skills, and community resources.',
      badge: 'TRAINING',
    },
    {
      campaign: 'events' as const,
      label: '4 · Weekly Live Events',
      purpose: 'Live Zoom presentations in English and Spanish.',
      badge: 'EVENTS',
    },
  ]

  const nurtureMessage = (lead: CrmLead, distributor: CrmDistributor, campaign: string, url: string) => {
    const firstName = lead.full_name.trim().split(/\s+/)[0]
    if (lead.locale === 'es')
      return `Hola ${firstName}, soy ${distributor.display_name} de True Legacy. Gracias por tu interés. Preparé esta información sobre ${
        campaign === 'duo'
          ? 'K8 y emGuarde GO'
          : campaign === 'business'
          ? 'el modelo de negocio'
          : campaign === 'training'
          ? 'nuestro sistema de entrenamiento'
          : 'nuestros eventos en vivo'
      } para ti: ${url}\n\nRevísala cuando puedas y dime qué preguntas tienes.`
    if (lead.locale === 'pt')
      return `Olá ${firstName}, sou ${distributor.display_name} da True Legacy. Obrigado pelo seu interesse. Preparei estas informações para você: ${url}\n\nVeja quando puder e me diga quais perguntas você tem.`
    if (lead.locale === 'fr')
      return `Bonjour ${firstName}, je suis ${distributor.display_name} de True Legacy. Merci pour votre intérêt. J'ai préparé ces informations pour vous : ${url}\n\nConsultez-les quand vous pourrez et dites-moi quelles questions vous avez.`
    return `Hi ${firstName}, this is ${distributor.display_name} with True Legacy. Thanks for your interest. I prepared this information for you: ${url}\n\nTake a look when you can and let me know what questions you have.`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#2997ff]">Send Presentation Pages</h3>
          <p className="text-xs text-[#86868b]">Personalized with your referral attribution</p>
        </div>
      </div>

      <div className="grid gap-3">
        {ALL_LANDING_PAGES.map((page) => {
          const landingUrl = `${window.location.origin}/d/${distributor.slug}/${page.campaign}`
          const text = nurtureMessage(lead, distributor, page.campaign, landingUrl)
          const cleanPhone = lead.phone ? lead.phone.replace(/[^\d+]/g, '') : ''
          const whatsAppUrl = cleanPhone
            ? `https://wa.me/${cleanPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
            : `https://wa.me/?text=${encodeURIComponent(text)}`
          const smsUrl = cleanPhone
            ? `sms:${cleanPhone}?&body=${encodeURIComponent(text)}`
            : `sms:?&body=${encodeURIComponent(text)}`
          const emailSubject = `Information from ${distributor.display_name} · True Legacy`
          const gmailUrl = getGmailComposeUrl(lead.email, emailSubject, text)
          const isPrimary =
            lead.interest === page.campaign ||
            (lead.interest === 'product' && page.campaign === 'duo') ||
            (lead.interest === 'distributor' && page.campaign === 'business')

          return (
            <article
              key={page.campaign}
              className={`rounded-xl border p-4 transition-all ${
                isPrimary ? 'border-cyan-400/40 bg-cyan-400/[0.04]' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2997ff]">{page.badge}</span>
                {isPrimary && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-cyan-400/20 text-[#2997ff] border border-cyan-400/30 px-1.5 py-0.5 rounded">
                    Matched Interest
                  </span>
                )}
              </div>
              <p className="mt-1 font-bold text-white text-xs sm:text-sm">{page.label}</p>
              <p className="mt-0.5 text-xs text-[#86868b] leading-relaxed">{page.purpose}</p>

              <div className="mt-3 flex flex-wrap gap-2 pt-2.5 border-t border-white/10">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onOpen(lead, 'WhatsApp', landingUrl)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
                <a
                  href={smsUrl}
                  onClick={() => onOpen(lead, 'SMS', landingUrl)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  SMS Text
                </a>
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpen(lead, 'Email', landingUrl)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Gmail
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(text)
                    setCopied(page.campaign)
                    window.setTimeout(() => setCopied(''), 1500)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors"
                >
                  {copied === page.campaign ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === page.campaign ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={landingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors ml-auto"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Preview
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function CrmLogin({
  onPasswordSubmit,
  onMagicLinkSubmit,
  onPasswordReset,
  message,
}: {
  onPasswordSubmit: (event: FormEvent<HTMLFormElement>) => void
  onMagicLinkSubmit: (event: FormEvent<HTMLFormElement>) => void
  onPasswordReset: (email: string) => void
  message: string
}) {
  const [forgotten, setForgotten] = useState(false)
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <SEO title="True Legacy CRM Sign In" description="Private team CRM sign in." noIndex />
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/[0.03] p-8 text-center backdrop-blur-xl shadow-2xl">
        <img src="/logos/tl-square-white.png" alt="True Legacy" className="mx-auto h-16 w-16 object-contain" />
        <h1 className="mt-6 text-3xl font-black">{forgotten ? 'Reset your password' : 'Sales Command Center'}</h1>
        <p className="mt-3 text-sm leading-6 text-[#cccccc]">
          {forgotten
            ? 'Enter your authorized email to receive a recovery link.'
            : 'Sign in to access your leads, follow-ups, and organization tools.'}
        </p>
        {forgotten ? (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onPasswordReset(String(new FormData(event.currentTarget).get('email') || ''))
            }}
            className="mt-7 grid gap-4"
          >
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Authorized email"
              className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 outline-none focus:border-cyan-400 text-white"
            />
            <button className="h-12 rounded-xl bg-cyan-500 font-bold text-slate-950 hover:bg-cyan-400">
              Send password reset link
            </button>
            <button type="button" onClick={() => setForgotten(false)} className="text-sm text-[#2997ff]">
              Back to sign in
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={onPasswordSubmit} className="mt-7 grid gap-4">
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Authorized email"
                className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 outline-none focus:border-cyan-400 text-white"
              />
              <input
                required
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 outline-none focus:border-cyan-400 text-white"
              />
              <button className="h-12 rounded-xl bg-cyan-500 font-bold text-slate-950 hover:bg-cyan-400">
                Sign in securely
              </button>
              <button type="button" onClick={() => setForgotten(true)} className="text-sm text-[#2997ff]">
                Forgot password?
              </button>
            </form>
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#86868b]">
              <span className="h-px flex-1 bg-white/10" />
              or
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <form onSubmit={onMagicLinkSubmit} className="grid gap-3">
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Authorized email"
                className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 outline-none focus:border-cyan-400 text-white"
              />
              <button className="h-12 rounded-xl border border-white/20 font-bold text-[#2997ff] hover:bg-white/5">
                Email me a sign-in link
              </button>
            </form>
          </>
        )}
        {message && (
          <p role="alert" className="mt-4 text-sm text-[#2997ff]">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}

function PasswordRecovery({ onComplete }: { onComplete: () => void }) {
  const [message, setMessage] = useState('')
  const [updating, setUpdating] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!crmSupabase) return
    const form = event.currentTarget
    const formData = new FormData(form)
    const password = String(formData.get('newPassword') || '')
    const confirmation = String(formData.get('confirmPassword') || '')

    if (password.length < 12) {
      setMessage('Use at least 12 characters.')
      return
    }
    if (password !== confirmation) {
      setMessage('The passwords do not match.')
      return
    }

    setUpdating(true)
    try {
      const { error } = await crmSupabase.auth.updateUser({ password })
      if (error) setMessage('Failed to update password. Please try again.')
      else onComplete()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/[0.03] p-8 text-center">
        <h1 className="text-2xl font-black">Choose a new password</h1>
        <p className="mt-2 text-sm text-[#cccccc]">Enter your new secure CRM password below.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
          <input
            required
            minLength={12}
            name="newPassword"
            type="password"
            placeholder="New password (12+ characters)"
            className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-cyan-400"
          />
          <input
            required
            minLength={12}
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-cyan-400"
          />
          <button
            disabled={updating}
            className="h-12 rounded-xl bg-cyan-500 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
          >
            {updating ? 'Updating...' : 'Set new password'}
          </button>
        </form>
        {message && <p className="mt-3 text-xs text-rose-300">{message}</p>}
      </div>
    </main>
  )
}

function CrmMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-black p-5 text-white">
      <div className="max-w-md text-center">
        <Sparkles className="mx-auto h-12 w-12 text-[#2997ff]" />
        <h1 className="mt-5 text-3xl font-black">{title}</h1>
        <p className="mt-4 leading-7 text-[#cccccc]">{body}</p>
        {action ? <div className="mt-7">{action}</div> : null}
      </div>
    </main>
  )
}
