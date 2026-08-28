/**
 * Leader Access & Onboarding Panel — CRM Admin Only
 *
 * Dedicated dashboard module for managing leader portal invitations,
 * dispatching login credentials, temporary passwords, and setup instructions.
 */

import {
  AlertCircle,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getCrmDistributors,
  recordLeaderAccessEmailSent,
  sendLeaderLoginAccess,
  type CrmDistributor,
} from '@/lib/crm'
import {
  LeaderAccessDispatcherModal,
  type LeaderAccessTarget,
} from './LeaderAccessDispatcherModal'

export function LeaderAccessPanel() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalTarget, setModalTarget] = useState<LeaderAccessTarget | null>(null)
  const [isBulkModal, setIsBulkModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quickSendingId, setQuickSendingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [bannerMessage, setBannerMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const rows = await getCrmDistributors()
      setDistributors(rows)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = distributors.filter((d) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      d.display_name.toLowerCase().includes(q) ||
      (d.login_email && d.login_email.toLowerCase().includes(q)) ||
      d.slug.toLowerCase().includes(q) ||
      (d.title && d.title.toLowerCase().includes(q))
    )
  })

  const withEmailCount = distributors.filter((d) => Boolean(d.login_email)).length
  const sentCount = distributors.filter((d) => Boolean(d.last_access_email_sent_at)).length

  // Quick single send
  const handleQuickSend = async (dist: CrmDistributor) => {
    if (!dist.login_email) return
    setQuickSendingId(dist.id)
    setBannerMessage('')
    try {
      const res = await sendLeaderLoginAccess({
        email: dist.login_email,
        displayName: dist.display_name,
        slug: dist.slug,
        tempPassword: 'TrueLegacy2026!',
      })
      if (res.success) {
        await recordLeaderAccessEmailSent(dist.id)
        setDistributors((prev) =>
          prev.map((d) =>
            d.id === dist.id
              ? { ...d, last_access_email_sent_at: new Date().toISOString() }
              : d
          )
        )
        setBannerMessage(`Complete login & app setup guide dispatched to ${dist.display_name} (${dist.login_email})!`)
        setTimeout(() => setBannerMessage(''), 4000)
      } else {
        setBannerMessage(`Failed to send email: ${res.error}`)
      }
    } finally {
      setQuickSendingId(null)
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-xl">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-4 border-b border-white/8 bg-white/[0.02] p-4 text-left hover:bg-white/[0.035] transition sm:p-5"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#2997ff]/25 bg-[#2997ff]/10 text-[#2997ff]">
            <KeyRound className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-white">Leader Portal Access & Credentials Dispatcher</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#2997ff]/20 bg-[#2997ff]/8 px-2 py-0.5 text-[10px] font-bold text-[#2997ff]">
                <ShieldCheck className="h-3 w-3" />
                Admin Only
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-black text-cyan-300">
                {distributors.length} Verified Leaders
              </span>
              {sentCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                  {sentCount} Dispatched
                </span>
              )}
            </div>
            <p className="text-xs text-[#86868b] truncate">
              Send dashboard login access, instructions, and temporary passwords to new and existing leaders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isExpanded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                load()
              }}
              title="Refresh"
              className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#86868b] hover:text-white transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#86868b]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#86868b]" />
          )}
        </div>
      </button>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Banner message */}
          {bannerMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{bannerMessage}</span>
            </div>
          )}

          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86868b]" />
              <input
                type="search"
                placeholder="Search leaders by name, email, or slug…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3.5 py-2 text-xs text-white placeholder-[#5d6673] focus:border-[#2997ff]/50 focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsBulkModal(true)
                  setModalTarget(null)
                  setIsModalOpen(true)
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2997ff] hover:bg-[#2997ff]/90 px-3.5 py-2 text-xs font-black text-black transition shadow-lg shadow-cyan-500/20"
              >
                <Send className="h-3.5 w-3.5" />
                Broadcast to All Leaders ({withEmailCount})
              </button>
            </div>
          </div>

          {/* Leader Table / Cards */}
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-[#86868b]">
              <Loader2 className="h-5 w-5 animate-spin text-[#2997ff]" />
              <span className="text-xs">Loading verified leaders…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/6 bg-white/[0.01] py-12 text-center text-xs text-[#86868b]">
              No leaders match your search criteria.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((dist) => {
                const hasEmail = Boolean(dist.login_email)
                const isSent = Boolean(dist.last_access_email_sent_at)
                return (
                  <div
                    key={dist.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-4 hover:border-white/20 transition space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-white truncate">{dist.display_name}</h4>
                          <p className="text-[11px] text-[#2997ff] truncate">
                            {dist.login_email || 'No email configured'}
                          </p>
                        </div>
                        {isSent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 shrink-0">
                            <Check className="h-2.5 w-2.5" /> Sent
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 shrink-0">
                            Unsent
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-[#86868b] space-y-1">
                        <p className="truncate">Rank: <span className="text-[#cbd5e1]">{dist.title || 'Leader'}</span></p>
                        <p className="truncate">Public: <a href={`/d/${dist.slug}`} target="_blank" rel="noreferrer" className="text-[#38bdf8] hover:underline">/d/{dist.slug}</a></p>
                        {dist.last_access_email_sent_at && (
                          <p className="text-[10px] text-[#5d6673]">
                            Last sent: {new Date(dist.last_access_email_sent_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-white/6">
                      <button
                        type="button"
                        disabled={!hasEmail || quickSendingId === dist.id}
                        onClick={() => handleQuickSend(dist)}
                        title="Directly send magic link / reset email via Supabase"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white disabled:opacity-40 transition"
                      >
                        {quickSendingId === dist.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3 text-[#2997ff]" />
                        )}
                        Quick Send
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setModalTarget({
                            id: dist.id,
                            displayName: dist.display_name,
                            email: dist.login_email || '',
                            slug: dist.slug,
                            phone: dist.phone,
                          })
                          setIsBulkModal(false)
                          setIsModalOpen(true)
                        }}
                        title="Customize instructions, preview email, or send via WhatsApp"
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#2997ff]/40 bg-[#2997ff]/10 hover:bg-[#2997ff]/20 px-2.5 py-1.5 text-[11px] font-bold text-[#2997ff] transition"
                      >
                        <Mail className="h-3 w-3" />
                        Details
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <LeaderAccessDispatcherModal
        target={modalTarget}
        allDistributors={distributors}
        isBulk={isBulkModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDispatched={() => {
          load()
        }}
      />
    </section>
  )
}
