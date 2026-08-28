/**
 * Leader Access & Onboarding Dispatcher Modal
 *
 * Allows CRM Admins to:
 * 1. Dispatch official Supabase Auth login / password reset emails to leaders.
 * 2. Generate personalized onboarding instructions with temporary passwords or direct links.
 * 3. Copy formatted emails for Gmail / Outlook or WhatsApp.
 * 4. Broadcast access credentials to all leaders in bulk.
 */

import {
  AlertCircle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import {
  formatLeaderAccessEmail,
  recordLeaderAccessEmailSent,
  sendLeaderLoginAccess,
  type CrmDistributor,
} from '@/lib/crm'

export type LeaderAccessTarget = {
  id?: string
  displayName: string
  email: string
  slug: string
  phone?: string | null
}

interface LeaderAccessDispatcherModalProps {
  target: LeaderAccessTarget | null // single leader target
  allDistributors?: CrmDistributor[] // all distributors for bulk mode
  isBulk?: boolean
  isOpen: boolean
  onClose: () => void
  onDispatched?: () => void
}

export function LeaderAccessDispatcherModal({
  target,
  allDistributors = [],
  isBulk = false,
  isOpen,
  onClose,
  onDispatched,
}: LeaderAccessDispatcherModalProps) {
  const [activeTab, setActiveTab] = useState<'direct' | 'preview' | 'whatsapp'>('direct')
  const [tempPassword, setTempPassword] = useState('TrueLegacy2026!')
  const [includeTempPassword, setIncludeTempPassword] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    allDistributors.filter((d) => Boolean(d.login_email)).map((d) => d.id)
  )
  const [isSending, setIsSending] = useState(false)
  const [sendResults, setSendResults] = useState<{
    total: number
    succeeded: number
    failed: number
    errors: string[]
  } | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Single target fallback
  const singleTarget = target || (allDistributors[0] ? {
    id: allDistributors[0].id,
    displayName: allDistributors[0].display_name,
    email: allDistributors[0].login_email || '',
    slug: allDistributors[0].slug,
    phone: allDistributors[0].phone,
  } : null)

  // Format email for single target preview
  const formattedEmail = useMemo(() => {
    if (!singleTarget) return { subject: '', bodyText: '', bodyHtml: '' }
    return formatLeaderAccessEmail({
      name: singleTarget.displayName,
      email: singleTarget.email,
      slug: singleTarget.slug,
      tempPassword: includeTempPassword ? tempPassword : undefined,
    })
  }, [singleTarget, tempPassword, includeTempPassword])

  // Format WhatsApp invite
  const formattedWhatsApp = useMemo(() => {
    if (!singleTarget) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.truelegacyworld.com'
    return `🌟 *Welcome to True Legacy, ${singleTarget.displayName}!*

Your verified leadership portal is now live:
🔗 *Your Public Link:* ${origin}/d/${singleTarget.slug}

*Quick Setup Steps:*
1️⃣ Sign in to your portal: ${origin}/app
2️⃣ Use your email: ${singleTarget.email}
3️⃣ Upload your standardized portrait: ${origin}/app/settings

All customer inquiries from your link flow directly into your private CRM!

Welcome to the True Legacy Global Team! 🚀`
  }, [singleTarget])

  if (!isOpen) return null

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Handle single send
  const handleSingleSend = async () => {
    if (!singleTarget?.email) return
    setIsSending(true)
    setSendResults(null)
    try {
      const res = await sendLeaderLoginAccess({
        email: singleTarget.email,
        displayName: singleTarget.displayName,
        slug: singleTarget.slug,
        tempPassword: includeTempPassword ? tempPassword : 'TrueLegacy2026!',
      })
      if (res.success) {
        if (singleTarget.id) {
          await recordLeaderAccessEmailSent(singleTarget.id)
        }
        setSendResults({
          total: 1,
          succeeded: 1,
          failed: 0,
          errors: [],
        })
        onDispatched?.()
      } else {
        setSendResults({
          total: 1,
          succeeded: 0,
          failed: 1,
          errors: [res.error || 'Failed to dispatch email'],
        })
      }
    } finally {
      setIsSending(false)
    }
  }

  // Handle bulk send
  const handleBulkSend = async () => {
    const targets = allDistributors.filter(
      (d) => selectedIds.includes(d.id) && Boolean(d.login_email)
    )
    if (!targets.length) return

    setIsSending(true)
    setSendResults(null)

    let succeeded = 0
    let failed = 0
    const errors: string[] = []

    for (const dist of targets) {
      if (!dist.login_email) continue
      try {
        const res = await sendLeaderLoginAccess({
          email: dist.login_email,
          displayName: dist.display_name,
          slug: dist.slug,
          tempPassword: includeTempPassword ? tempPassword : 'TrueLegacy2026!',
        })
        if (res.success) {
          succeeded++
          await recordLeaderAccessEmailSent(dist.id)
        } else {
          failed++
          errors.push(`${dist.display_name}: ${res.error}`)
        }
      } catch (err: any) {
        failed++
        errors.push(`${dist.display_name}: ${err?.message || 'Error'}`)
      }
    }

    setSendResults({
      total: targets.length,
      succeeded,
      failed,
      errors,
    })
    setIsSending(false)
    onDispatched?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 bg-[#0a0f1d] text-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#2997ff]/30 bg-[#2997ff]/10 text-[#2997ff]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {isBulk ? 'Broadcast Leader Login & Access Emails' : `Send Login Access — ${singleTarget?.displayName || 'Leader'}`}
              </h2>
              <p className="text-xs text-[#86868b]">
                {isBulk
                  ? `Send dashboard access instructions to ${selectedIds.length} verified leaders`
                  : `Email: ${singleTarget?.email || 'No email configured'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 text-[#86868b] hover:text-white hover:bg-white/5 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 px-6 bg-black/40">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'direct'
                ? 'border-[#2997ff] text-[#2997ff]'
                : 'border-transparent text-[#86868b] hover:text-white'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            {isBulk ? 'Bulk Dispatch' : 'Direct Supabase Invite'}
          </button>
          {!isBulk && (
            <>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
                  activeTab === 'preview'
                    ? 'border-[#2997ff] text-[#2997ff]'
                    : 'border-transparent text-[#86868b] hover:text-white'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Email Template & Copy
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
                  activeTab === 'whatsapp'
                    ? 'border-[#2997ff] text-[#2997ff]'
                    : 'border-transparent text-[#86868b] hover:text-white'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                WhatsApp Message
              </button>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Results Alert */}
          {sendResults && (
            <div
              className={`rounded-2xl border p-4 text-xs ${
                sendResults.failed === 0
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-amber-400/30 bg-amber-400/10 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 font-black">
                {sendResults.failed === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                )}
                <span>
                  {sendResults.succeeded} of {sendResults.total} access email{sendResults.total === 1 ? '' : 's'} dispatched successfully!
                </span>
              </div>
              {sendResults.errors.length > 0 && (
                <ul className="mt-2 list-disc list-inside space-y-1 text-rose-300">
                  {sendResults.errors.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* TAB 1: Direct Send & Bulk Configuration */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              {isBulk ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black uppercase tracking-wider text-[#86868b]">
                      Select Leaders ({selectedIds.length} selected)
                    </p>
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIds(
                            allDistributors
                              .filter((d) => Boolean(d.login_email))
                              .map((d) => d.id)
                          )
                        }
                        className="text-[#2997ff] hover:underline font-bold"
                      >
                        Select All
                      </button>
                      <span className="text-white/20">|</span>
                      <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="text-[#86868b] hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-2 space-y-1">
                    {allDistributors.map((d) => {
                      const hasEmail = Boolean(d.login_email)
                      const isChecked = selectedIds.includes(d.id)
                      return (
                        <label
                          key={d.id}
                          className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                            !hasEmail
                              ? 'opacity-40 border-transparent bg-white/[0.01]'
                              : isChecked
                              ? 'border-[#2997ff]/40 bg-[#2997ff]/10 text-white'
                              : 'border-white/5 bg-white/[0.02] text-[#86868b] hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              disabled={!hasEmail}
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds((prev) => [...prev, d.id])
                                } else {
                                  setSelectedIds((prev) => prev.filter((id) => id !== d.id))
                                }
                              }}
                              className="rounded border-white/20 bg-black text-[#2997ff] focus:ring-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{d.display_name}</p>
                              <p className="text-[11px] text-[#86868b] truncate">
                                {d.login_email || 'No login email configured'}
                              </p>
                            </div>
                          </div>
                          {d.last_access_email_sent_at && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Sent {new Date(d.last_access_email_sent_at).toLocaleDateString()}
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white">{singleTarget?.displayName}</p>
                      <p className="text-xs text-[#2997ff]">{singleTarget?.email}</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                      Verified Leader
                    </span>
                  </div>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Clicking dispatch will send an official, secure password-setup and login magic link to <strong className="text-white">{singleTarget?.email}</strong>. When clicked, it directs them straight to their settings dashboard to manage their portrait and links.
                  </p>
                </div>
              )}

              {/* Temporary Password Options */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTempPassword}
                    onChange={(e) => setIncludeTempPassword(e.target.checked)}
                    className="rounded border-white/20 bg-black text-[#2997ff] focus:ring-0"
                  />
                  <span>Include Temporary Password in Instructions</span>
                </label>
                {includeTempPassword && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86868b]" />
                      <input
                        type="text"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white focus:border-[#2997ff] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setTempPassword(`TL-${Math.random().toString(36).substring(2, 7).toUpperCase()}!2026`)}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                    >
                      Generate New
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Email Template Preview & Copy */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-[#86868b]">
                  Subject: {formattedEmail.subject}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(formattedEmail.bodyText, 'email_text')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition"
                  >
                    {copiedKey === 'email_text' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === 'email_text' ? 'Copied!' : 'Copy Plaintext'}
                  </button>
                  <a
                    href={`mailto:${singleTarget?.email || ''}?subject=${encodeURIComponent(formattedEmail.subject)}&body=${encodeURIComponent(formattedEmail.bodyText)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2997ff]/40 bg-[#2997ff]/10 text-xs font-bold text-[#2997ff] hover:bg-[#2997ff]/20 transition"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in Mail App
                  </a>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-4 text-xs font-mono text-[#cbd5e1] whitespace-pre-wrap leading-relaxed">
                {formattedEmail.bodyText}
              </div>
            </div>
          )}

          {/* TAB 3: WhatsApp Preview */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-[#86868b]">
                  WhatsApp Direct Message
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(formattedWhatsApp, 'wa_text')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition"
                  >
                    {copiedKey === 'wa_text' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === 'wa_text' ? 'Copied!' : 'Copy Message'}
                  </button>
                  {singleTarget?.phone && (
                    <a
                      href={`https://wa.me/${singleTarget.phone.replace(/\D/g, '')}?text=${encodeURIComponent(formattedWhatsApp)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-400/40 bg-emerald-400/10 text-xs font-bold text-emerald-300 hover:bg-emerald-400/20 transition"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Send on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-4 text-xs font-mono text-[#a7f3d0] whitespace-pre-wrap leading-relaxed">
                {formattedWhatsApp}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#86868b] hover:text-white transition"
          >
            Close
          </button>
          
          <div className="flex gap-2">
            {isBulk ? (
              <button
                type="button"
                disabled={isSending || selectedIds.length === 0}
                onClick={handleBulkSend}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2997ff] hover:bg-[#2997ff]/90 px-5 py-2.5 text-xs font-black text-black disabled:opacity-50 transition shadow-lg shadow-cyan-500/20"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Dispatch Access to {selectedIds.length} Leaders
              </button>
            ) : (
              <button
                type="button"
                disabled={isSending || !singleTarget?.email}
                onClick={handleSingleSend}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2997ff] hover:bg-[#2997ff]/90 px-5 py-2.5 text-xs font-black text-black disabled:opacity-50 transition shadow-lg shadow-cyan-500/20"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Login Access to {singleTarget?.displayName}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
