import { useState, useEffect } from 'react'
import {
  Check,
  ChevronRight,
  ExternalLink,
  KeyRound,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserX,
} from 'lucide-react'
import {
  crmSupabase,
  getCrmDistributors,
  sendLeaderLoginAccess,
  recordLeaderAccessEmailSent,
} from '@/lib/crm'
import type { CrmDistributor } from '@/lib/crm'

export function LeaderAccessAdmin() {
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState('')
  const [successId, setSuccessId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'linked' | 'pending'>('all')

  const loadData = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const data = await getCrmDistributors()
      setDistributors(data)
    } catch {
      setErrorMsg('Failed to load leader directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSendAccess = async (distributor: CrmDistributor, linkType: 'magiclink' | 'recovery') => {
    const email = distributor.login_email
    if (!email) {
      setErrorMsg(`No valid login email on file for ${distributor.display_name}. Please configure login email in distributor profile.`)
      return
    }

    setSendingId(distributor.id)
    setErrorMsg('')
    try {
      const result = await sendLeaderLoginAccess({
        email,
        displayName: distributor.display_name,
        slug: distributor.slug,
        linkType,
      })

      if (result.success) {
        await recordLeaderAccessEmailSent(distributor.id)
        setSuccessId(distributor.id)
        setTimeout(() => setSuccessId(''), 3500)
        await loadData()
      } else {
        setErrorMsg(result.error || 'Failed to dispatch secure access link.')
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error triggering access email.')
    } finally {
      setSendingId('')
    }
  }

  const filteredDistributors = distributors.filter((d) => {
    const isLinked = Boolean(d.auth_user_id || d.login_email)
    if (filter === 'linked' && !isLinked) return false
    if (filter === 'pending' && isLinked) return false

    const query = search.trim().toLowerCase()
    if (!query) return true
    const haystack = [d.display_name, d.login_email || '', d.slug, d.title].join(' ').toLowerCase()
    return haystack.includes(query)
  })

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                Security & Authentication Hub
              </span>
              <span className="text-xs text-[#86868b]">Admin Only</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Leader Access & Account Status</h2>
            <p className="mt-1 text-xs sm:text-sm text-[#cccccc]">
              Manage leader portal connections, dispatch secure one-time passwordless magic links, and trigger password resets.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            aria-label="Refresh leader access list"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-colors shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>

        {/* Security Principles Banner */}
        <div className="mt-5 grid sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/40 p-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Passwordless Onboarding</p>
              <p className="text-[11px] text-[#86868b] mt-0.5">Zero static or temporary passwords generated or transmitted.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/40 p-3">
            <KeyRound className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">One-Time Supabase Links</p>
              <p className="text-[11px] text-[#86868b] mt-0.5">Authenticated links expire automatically after single use.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/40 p-3">
            <UserCheck className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Audit Trail Logging</p>
              <p className="text-[11px] text-[#86868b] mt-0.5">Every access invitation and reset event is recorded.</p>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-300 hover:text-white" aria-label="Dismiss error">✕</button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leaders by name, email, or handle..."
            className="w-full h-10 rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 text-xs text-white placeholder:text-[#86868b] focus:border-cyan-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-[#cccccc] hover:text-white'
            }`}
          >
            All Leaders ({distributors.length})
          </button>
          <button
            onClick={() => setFilter('linked')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'linked' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-[#cccccc] hover:text-white'
            }`}
          >
            Active / Linked ({distributors.filter((d) => d.auth_user_id || d.login_email).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'pending' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-[#cccccc] hover:text-white'
            }`}
          >
            Pending Invite ({distributors.filter((d) => !d.auth_user_id && !d.login_email).length})
          </button>
        </div>
      </div>

      {/* Leaders Access Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="grid grid-cols-[minmax(240px,2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_minmax(140px,1fr)_minmax(220px,1.8fr)] items-center gap-3 border-b border-white/10 bg-black/40 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#86868b]">
          <div>Verified Leader</div>
          <div>Login / Auth Email</div>
          <div>Account State</div>
          <div>Last Invitation</div>
          <div className="text-right pr-2">Secure Actions</div>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {filteredDistributors.map((d) => {
            const isLinked = Boolean(d.auth_user_id || d.login_email)
            const targetEmail = d.login_email
            const isSending = sendingId === d.id
            const isSuccess = successId === d.id

            return (
              <div
                key={d.id}
                className="grid grid-cols-[minmax(240px,2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_minmax(140px,1fr)_minmax(220px,1.8fr)] items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Col 1: Leader Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={d.avatar_url || '/portraits/placeholder.jpg'}
                    alt={d.display_name}
                    className="h-10 w-10 rounded-full object-cover border border-white/15 shrink-0 bg-white/5"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{d.display_name}</p>
                    <p className="text-[11px] text-[#86868b] truncate">{d.title || d.slug}</p>
                  </div>
                </div>

                {/* Col 2: Email */}
                <div className="min-w-0">
                  <p className="font-mono text-xs text-cyan-300 truncate">{targetEmail || 'No email set'}</p>
                </div>

                {/* Col 3: Status Badge */}
                <div>
                  {isLinked ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Linked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Pending Invite
                    </span>
                  )}
                </div>

                {/* Col 4: Last Invitation Time */}
                <div className="text-xs text-[#86868b]">
                  {d.last_access_email_sent_at
                    ? new Date(d.last_access_email_sent_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Never sent'}
                </div>

                {/* Col 5: Secure Action Buttons (Magic Link & Password Reset) */}
                <div className="flex items-center justify-end gap-2">
                  {isSuccess ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <Check className="h-4 w-4" />
                      Dispatched
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSendAccess(d, 'magiclink')}
                        disabled={isSending || !targetEmail}
                        title="Send passwordless login link"
                        aria-label={`Send magic sign-in link to ${d.display_name}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-colors disabled:opacity-40"
                      >
                        <Sparkles className="h-3 w-3" />
                        {isSending ? 'Sending…' : 'Magic Link'}
                      </button>

                      <button
                        onClick={() => handleSendAccess(d, 'recovery')}
                        disabled={isSending || !targetEmail}
                        title="Send one-time password reset link"
                        aria-label={`Send password reset link to ${d.display_name}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-[#cccccc] hover:text-white transition-colors disabled:opacity-40"
                      >
                        <KeyRound className="h-3 w-3" />
                        Reset
                      </button>

                      <a
                        href={`/d/${d.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Preview Public Profile"
                        aria-label={`Preview public profile of ${d.display_name}`}
                        className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
