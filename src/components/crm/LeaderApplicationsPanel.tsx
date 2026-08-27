/**
 * Leader Applications Panel — CRM Admin Only
 *
 * Shows all leader applications submitted via /leaders/apply.
 * Admins can view details, leave review notes, and approve / decline each application.
 */

import {
  AlertCircle,
  BadgeCheck,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Globe,
  Instagram,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Shield,
  ShieldCheck,
  Star,
  Users,
  X,
  XCircle,
  SlidersHorizontal,
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import type { FormEvent } from 'react'
import {
  getLeaderApplications,
  reviewLeaderApplication,
  type LeaderApplication,
  type LeaderApplicationStatus,
} from '@/lib/crm'

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  LeaderApplicationStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-400/10',
    text: 'text-amber-300',
    border: 'border-amber-400/30',
    dot: 'bg-amber-400',
  },
  reviewing: {
    label: 'In Review',
    bg: 'bg-blue-400/10',
    text: 'text-blue-300',
    border: 'border-blue-400/30',
    dot: 'bg-blue-400',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-300',
    border: 'border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  declined: {
    label: 'Declined',
    bg: 'bg-rose-400/10',
    text: 'text-rose-300',
    border: 'border-rose-400/30',
    dot: 'bg-rose-400',
  },
}

function StatusBadge({ status }: { status: LeaderApplicationStatus }) {
  const c = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} shrink-0`} />
      {c.label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
}

// ── Application Row (collapsed) ────────────────────────────────────────────────

function ApplicationRow({
  app,
  isOpen,
  onToggle,
  onReview,
  working,
}: {
  app: LeaderApplication
  isOpen: boolean
  onToggle: () => void
  onReview: (id: string, status: LeaderApplicationStatus, notes?: string) => Promise<void>
  working: boolean
}) {
  const [noteText, setNoteText] = useState(app.review_notes ?? '')
  const [localStatus, setLocalStatus] = useState<LeaderApplicationStatus>(app.status)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const noteRef = useRef<HTMLTextAreaElement>(null)

  // Sync if parent updates
  useEffect(() => {
    setLocalStatus(app.status)
    setNoteText(app.review_notes ?? '')
  }, [app.status, app.review_notes])

  const handleAction = async (status: LeaderApplicationStatus) => {
    setSaving(true)
    setSaveMsg('')
    try {
      await onReview(app.id, status, noteText.trim() || undefined)
      setLocalStatus(status)
      setSaveMsg(status === 'approved' ? '✓ Application approved.' : status === 'declined' ? '✓ Application declined.' : `✓ Marked as ${STATUS_CONFIG[status].label}.`)
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const cfg = STATUS_CONFIG[localStatus]

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isOpen
          ? 'border-white/15 bg-white/[0.03]'
          : 'border-white/8 bg-white/[0.015] hover:border-white/12'
      }`}
    >
      {/* ── Row header (always visible) ── */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
      >
        {/* Status dot */}
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`} />

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-black text-white truncate">{app.full_name}</span>
            <StatusBadge status={localStatus} />
            {localStatus === 'approved' && (
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck className="h-3 w-3" />
                Leader
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#5d6673]">
            <span>{app.email}</span>
            <span>·</span>
            <span>{app.country}</span>
            <span>·</span>
            <span>{app.current_rank}</span>
            <span>·</span>
            <span>Submitted {formatDate(app.submitted_at)}</span>
          </div>
        </div>

        {/* Chevron */}
        <span className="text-[#4d5560] shrink-0">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {/* ── Expanded detail panel ── */}
      {isOpen && (
        <div className="border-t border-white/8 px-4 pb-5 pt-4 sm:px-5 space-y-5">
          {/* Two column info grid */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <InfoItem icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={app.email} />
            <InfoItem icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={app.phone ?? '—'} />
            <InfoItem icon={<Globe className="h-3.5 w-3.5" />} label="Country" value={app.country} />
            <InfoItem icon={<Star className="h-3.5 w-3.5" />} label="Enagic Rank" value={app.current_rank} />
            <InfoItem icon={<BadgeCheck className="h-3.5 w-3.5" />} label="Distributor ID" value={app.enagic_distributor_id} />
            <InfoItem icon={<Clock className="h-3.5 w-3.5" />} label="Years Active" value={`${app.years_active} year${app.years_active !== 1 ? 's' : ''}`} />
            <InfoItem icon={<Users className="h-3.5 w-3.5" />} label="Active Team Size" value={app.active_team_size.toLocaleString()} />
            <InfoItem icon={<Shield className="h-3.5 w-3.5" />} label="Sponsor" value={app.sponsor_name} />
            <InfoItem icon={<Calendar className="h-3.5 w-3.5" />} label="Submitted" value={formatDateTime(app.submitted_at)} />
          </div>

          {/* Regions & Languages */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#4d5560] mb-2">Markets / Regions</p>
              <div className="flex flex-wrap gap-1.5">
                {app.regions.map((r) => (
                  <span key={r} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-[#c9ced7]">{r}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#4d5560] mb-2">Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {app.languages.map((l) => (
                  <span key={l} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-[#c9ced7] uppercase">{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Instagram link */}
          {app.instagram_url && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#4d5560] mb-1.5">Instagram</p>
              <a
                href={app.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#2997ff] hover:underline"
              >
                <Instagram className="h-3.5 w-3.5" />
                {app.instagram_url.replace('https://www.', '').replace('https://', '')}
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          )}

          {/* Leadership summary */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#4d5560] mb-2">Leadership Summary</p>
            <p className="text-xs leading-relaxed text-[#c9ced7] whitespace-pre-line rounded-xl border border-white/6 bg-black/30 p-3.5">
              {app.leadership_summary}
            </p>
          </div>

          {/* Qualifications checklist */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#4d5560] mb-2">Qualifications Confirmed</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Verified Distributor', ok: app.verified_distributor },
                { label: 'True Legacy Team Member', ok: app.true_legacy_team_member },
                { label: 'Information Accurate', ok: app.information_accurate },
                { label: 'Consent Given', ok: app.consent },
              ].map(({ label, ok }) => (
                <div
                  key={label}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                    ok
                      ? 'border-emerald-400/25 bg-emerald-400/8 text-emerald-300'
                      : 'border-rose-400/25 bg-rose-400/8 text-rose-300'
                  }`}
                >
                  {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Previous review info */}
          {app.reviewed_at && (
            <div className="rounded-xl border border-white/6 bg-black/25 p-3 text-[11px] text-[#5d6673]">
              Last reviewed {formatDateTime(app.reviewed_at)}
              {app.review_notes && (
                <p className="mt-1.5 text-[#8d939e] whitespace-pre-line">{app.review_notes}</p>
              )}
            </div>
          )}

          {/* ── Review actions ── */}
          <div className="border-t border-white/8 pt-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#4d5560]">Review Decision</p>

            {/* Review note textarea */}
            <textarea
              ref={noteRef}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Optional review note (visible internally only)..."
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#4d5560] focus:border-[#2997ff]/50 focus:outline-none transition"
            />

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {localStatus !== 'reviewing' && (
                <button
                  type="button"
                  disabled={saving || working}
                  onClick={() => handleAction('reviewing')}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-400/8 px-4 py-2 text-xs font-bold text-blue-300 hover:bg-blue-400/15 disabled:opacity-50 transition whitespace-nowrap"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SlidersHorizontal className="h-3.5 w-3.5" />}
                  Mark In Review
                </button>
              )}

              {localStatus !== 'approved' && (
                <button
                  type="button"
                  disabled={saving || working}
                  onClick={() => handleAction('approved')}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/8 px-4 py-2.5 text-xs font-black text-emerald-300 hover:bg-emerald-400/20 disabled:opacity-50 transition whitespace-nowrap"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  Approve Application
                </button>
              )}

              {localStatus !== 'declined' && localStatus !== 'approved' && (
                <button
                  type="button"
                  disabled={saving || working}
                  onClick={() => handleAction('declined')}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/15 disabled:opacity-50 transition whitespace-nowrap"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  Decline
                </button>
              )}

              {(localStatus === 'approved' || localStatus === 'declined') && (
                <button
                  type="button"
                  disabled={saving || working}
                  onClick={() => handleAction('pending')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-bold text-[#8d939e] hover:text-white hover:border-white/25 disabled:opacity-50 transition whitespace-nowrap"
                >
                  Reset to Pending
                </button>
              )}
            </div>

            {saveMsg && (
              <p className={`text-xs font-semibold ${saveMsg.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {saveMsg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#4d5560] mb-1">
        <span className="text-[#2997ff]">{icon}</span>
        {label}
      </p>
      <p className="text-xs font-semibold text-[#c9ced7] truncate">{value}</p>
    </div>
  )
}

// ── Main Panel ────────────────────────────────────────────────────────────────

export function LeaderApplicationsPanel() {
  const [applications, setApplications] = useState<LeaderApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [working, setWorking] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeaderApplicationStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const apps = await getLeaderApplications()
      setApplications(apps)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isExpanded) load()
  }, [isExpanded])

  const handleReview = async (
    id: string,
    status: LeaderApplicationStatus,
    notes?: string
  ) => {
    setWorking(id)
    try {
      const updated = await reviewLeaderApplication(id, status, notes)
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)))
    } finally {
      setWorking('')
    }
  }

  const filtered = applications.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    const q = search.toLowerCase().trim()
    const matchesSearch =
      !q ||
      a.full_name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.current_rank.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    declined: applications.filter((a) => a.status === 'declined').length,
  }

  return (
    <section className="mt-6 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-4 border-b border-white/8 bg-white/[0.02] p-4 text-left hover:bg-white/[0.035] transition sm:p-5"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-400">
            <BadgeCheck className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-white">Leader Applications</span>
              {counts.pending > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-black text-amber-300">
                  {counts.pending} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-[#5d6673] truncate">
              Review and approve leader panel applications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isExpanded && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); load() }}
              title="Refresh"
              className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#5d6673] hover:text-white transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#5d6673]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#5d6673]" />
          )}
        </div>
      </button>

      {/* Panel body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Status filter + search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'pending', 'reviewing', 'approved', 'declined'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    statusFilter === s
                      ? s === 'all'
                        ? 'bg-white text-black'
                        : `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} border ${STATUS_CONFIG[s].border}`
                      : 'border border-white/10 bg-white/[0.03] text-[#8d939e] hover:text-white'
                  }`}
                >
                  {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
                  {counts[s] > 0 && (
                    <span className="ml-1.5 opacity-70">{counts[s]}</span>
                  )}
                </button>
              ))}
            </div>

            <input
              type="search"
              placeholder="Search by name, email, country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-[#4d5560] focus:border-[#2997ff]/50 focus:outline-none transition"
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-[#5d6673]">
              <Loader2 className="h-5 w-5 animate-spin text-[#2997ff]" />
              <span className="text-sm">Loading applications…</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
              <button
                type="button"
                onClick={load}
                className="ml-auto underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <BadgeCheck className="mx-auto mb-3 h-8 w-8 text-[#2d3340]" />
              <p className="text-sm font-bold text-[#4d5560]">
                {applications.length === 0
                  ? 'No applications submitted yet.'
                  : 'No applications match the current filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((app) => (
                <ApplicationRow
                  key={app.id}
                  app={app}
                  isOpen={openId === app.id}
                  onToggle={() => setOpenId(openId === app.id ? null : app.id)}
                  onReview={handleReview}
                  working={working === app.id}
                />
              ))}
            </div>
          )}

          {/* Summary footer */}
          {!loading && applications.length > 0 && (
            <div className="border-t border-white/8 pt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#4d5560]">
              <span><strong className="text-white">{counts.all}</strong> total</span>
              <span><strong className="text-amber-300">{counts.pending}</strong> pending review</span>
              <span><strong className="text-emerald-300">{counts.approved}</strong> approved</span>
              <span><strong className="text-rose-300">{counts.declined}</strong> declined</span>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
