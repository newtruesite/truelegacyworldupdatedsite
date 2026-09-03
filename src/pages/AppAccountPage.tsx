import { SEO } from '@/components/SEO'
import { Navbar } from '@/components/layout/Navbar'
import { LeaderPortraitGenerator } from '@/components/leaders/LeaderPortraitGenerator'
import type { LeaderPortraitData } from '@/config/portraitStandard'
import {
  crmConfigured,
  crmSupabase,
  getCrmDistributors,
  getCrmMembership,
  updateDistributorProfile,
  setCustomLeaderAvatar,
  setCustomApplicationSettings,
  convertToPermanentDataUrl,
} from '@/lib/crm'
import type {
  CrmDistributor,
  CrmMembership,
  DistributorCustomApplicationSettings,
  DistributorProfileUpdate,
} from '@/lib/crm'
import {
  STANDARD_PURCHASE_PRODUCTS,
  OTHER_PURCHASE_PRODUCTS,
  isValidPurchaseUrl,
} from '@/config/productPurchaseLinks'
import type { Session } from '@supabase/supabase-js'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Layers,
  LoaderCircle,
  Lock,
  Save,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Sliders,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

const LANGUAGE_OPTIONS = [
  ['en', 'English'],
  ['es', 'Spanish'],
  ['fr', 'French'],
  ['pt', 'Portuguese'],
  ['zh', 'Mandarin'],
  ['yue', 'Cantonese'],
  ['ms', 'Malay'],
  ['ar', 'Arabic'],
  ['ru', 'Russian'],
] as const

const INTEREST_OPTIONS = [
  { id: 'duo', label: 'K8 + emGuarde GO Duo Package' },
  { id: 'product', label: 'Enagic Kangen Water (K8 / SD501)' },
  { id: 'distributor', label: 'Independent Distributor Business Opportunity' },
  { id: 'training', label: 'Leadership Academy & Team Coaching' },
  { id: 'events', label: 'Live Masterclasses & Global Events' },
]

export default function AppAccountPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(crmConfigured)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Collapsible section states - all collapsed by default for sleek appearance
  const [isPortraitStudioOpen, setIsPortraitStudioOpen] = useState(false)
  const [isProfileInfoOpen, setIsProfileInfoOpen] = useState(false)
  const [isFormCustomizerOpen, setIsFormCustomizerOpen] = useState(false)
  const [isPurchaseLinksOpen, setIsPurchaseLinksOpen] = useState(false)
  const [isSecurityOpen, setIsSecurityOpen] = useState(false)

  // Direct Purchase Links state
  const [purchaseLinks, setPurchaseLinks] = useState<Record<string, string>>({})
  const [purchaseLinkErrors, setPurchaseLinkErrors] = useState<Record<string, string>>({})

  // Password update state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Verified email update state
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')
  const [emailError, setEmailError] = useState('')

  // Application Page Customization Form State
  const [customHeadline, setCustomHeadline] = useState('')
  const [customIntro, setCustomIntro] = useState('')
  const [customEyebrow, setCustomEyebrow] = useState('')
  const [customSubmitButtonText, setCustomSubmitButtonText] = useState('')
  const [customBadge, setCustomBadge] = useState('')
  const [customNote, setCustomNote] = useState('')
  const [selectedDefaultInterests, setSelectedDefaultInterests] = useState<string[]>(['duo'])

  useEffect(() => {
    if (!crmSupabase) {
      getCrmDistributors().then((rows) => {
        setDistributors(rows)
        setSelectedId(rows[0]?.id || '')
        setLoading(false)
      })
      return
    }

    let active = true

    const loadProfile = async () => {
      try {
        const { data: authData } = await crmSupabase!.auth.getSession()
        const currentSession = authData.session
        if (!active) return
        setSession(currentSession)

        const [rows, member] = await Promise.all([
          getCrmDistributors(),
          currentSession?.user ? getCrmMembership(currentSession.user.id).catch(() => null) : Promise.resolve(null),
        ])
        if (!active) return

        setDistributors(rows)
        setMembership(member)

        if (currentSession?.user) {
          let targetDistributor = rows.find((item) => item.id === member?.distributor_id)
          if (!targetDistributor) {
            targetDistributor = rows.find((item) => item.auth_user_id === currentSession.user.id)
          }
          if (!targetDistributor && currentSession.user.email) {
            const cleanUserEmail = currentSession.user.email.toLowerCase()
            targetDistributor = rows.find((item) => item.login_email?.toLowerCase() === cleanUserEmail)
          }
          if (!targetDistributor && member?.role === 'admin') {
            targetDistributor = rows.find((item) => item.slug === 'mehdi-cohen') || rows[0]
          }

          if (targetDistributor) {
            setSelectedId(targetDistributor.id)
          } else if (rows.length > 0) {
            setSelectedId(rows[0].id)
          }
        } else if (rows.length > 0) {
          setSelectedId(rows[0].id)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()

    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      if (next?.user) {
        loadProfile()
      }
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const distributor = useMemo(() => {
    if (selectedId) {
      const found = distributors.find((item) => item.id === selectedId)
      if (found) return found
    }
    if (session?.user) {
      const byUser = distributors.find(
        (item) =>
          item.id === membership?.distributor_id ||
          item.auth_user_id === session.user.id ||
          (item.login_email && item.login_email.toLowerCase() === session.user.email?.toLowerCase())
      )
      if (byUser) return byUser
    }
    return distributors[0] || null
  }, [distributors, selectedId, session, membership])

  // Sync application customization state & purchase links when distributor changes
  useEffect(() => {
    if (distributor) {
      const settings = distributor.application_settings || {}
      setCustomHeadline(settings.customHeadline || '')
      setCustomIntro(settings.customIntro || '')
      setCustomEyebrow(settings.customEyebrow || '')
      setCustomSubmitButtonText(settings.customSubmitButtonText || '')
      setCustomBadge(settings.customBadge || '')
      setCustomNote(settings.customNote || '')
      setSelectedDefaultInterests(settings.defaultInterests || ['duo'])
      setPurchaseLinks(distributor.purchase_links || {})
      setPurchaseLinkErrors({})
    }
  }, [distributor])

  const toggleDefaultInterest = (id: string) => {
    setSelectedDefaultInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const appFormUrl = useMemo(() => {
    const slug = distributor?.slug || 'jesse-hotshotz'
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.truelegacyworld.com'
    return `${origin}/apply?ref=${slug}&interest=duo&source=duo`
  }, [distributor])

  const hasCustomizations = Boolean(
    customHeadline.trim() ||
      customIntro.trim() ||
      customEyebrow.trim() ||
      customSubmitButtonText.trim() ||
      customBadge.trim() ||
      customNote.trim()
  )

  const handlePurchaseLinkChange = (productId: string, val: string) => {
    setPurchaseLinks((prev) => ({
      ...prev,
      [productId]: val,
    }))
    if (val.trim() && !isValidPurchaseUrl(val)) {
      setPurchaseLinkErrors((prev) => ({
        ...prev,
        [productId]: 'Please enter a valid URL starting with http:// or https://',
      }))
    } else {
      setPurchaseLinkErrors((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
    }
  }

  const allOpen = isPortraitStudioOpen && isProfileInfoOpen && isFormCustomizerOpen && isPurchaseLinksOpen && isSecurityOpen
  const toggleAllSections = () => {
    const nextState = !allOpen
    setIsPortraitStudioOpen(nextState)
    setIsProfileInfoOpen(nextState)
    setIsFormCustomizerOpen(nextState)
    setIsPurchaseLinksOpen(nextState)
    setIsSecurityOpen(nextState)
  }

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.')
      setPasswordMessage('')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter.')
      setPasswordMessage('')
      return
    }
    setPasswordSaving(true)
    setPasswordError('')
    setPasswordMessage('')
    try {
      if (crmSupabase && session) {
        const { error: updateErr } = await crmSupabase.auth.updateUser({ password: newPassword })
        if (updateErr) throw updateErr
        setPasswordMessage('Your password has been updated securely. You can now use it to sign in to the CRM portal.')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMessage('Password updated successfully.')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (updateError) {
      setPasswordError(updateError instanceof Error ? updateError.message : 'Failed to update password. Please try again.')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleEmailUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = newEmail.trim().toLowerCase()
    const currentEmail = session?.user.email?.trim().toLowerCase()
    setEmailError('')
    setEmailMessage('')

    if (!crmSupabase || !session) {
      setEmailError('Please sign in again before changing your email.')
      return
    }
    if (!normalizedEmail || normalizedEmail !== confirmEmail.trim().toLowerCase()) {
      setEmailError('The new email addresses do not match.')
      return
    }
    if (normalizedEmail === currentEmail) {
      setEmailError('Enter a different email address.')
      return
    }

    setEmailSaving(true)
    try {
      const { error: updateError } = await crmSupabase.auth.updateUser(
        { email: normalizedEmail },
        { emailRedirectTo: `${window.location.origin}/app/settings` }
      )
      if (updateError) throw updateError
      setEmailMessage(`Verification sent. For your protection, complete the confirmation steps sent to your current email and ${normalizedEmail}.`)
      setNewEmail('')
      setConfirmEmail('')
    } catch (updateError) {
      setEmailError(updateError instanceof Error ? updateError.message : 'The email change could not be started. Please try again.')
    } finally {
      setEmailSaving(false)
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!distributor) return
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const data = new FormData(event.currentTarget)
      const rawAvatar = customAvatarUrl || distributor.avatar_url || null
      const permanentAvatar = rawAvatar ? await convertToPermanentDataUrl(rawAvatar) : null

      const applicationSettings: DistributorCustomApplicationSettings = {
        customHeadline: customHeadline.trim() || undefined,
        customIntro: customIntro.trim() || undefined,
        customEyebrow: customEyebrow.trim() || undefined,
        customSubmitButtonText: customSubmitButtonText.trim() || undefined,
        customBadge: customBadge.trim() || undefined,
        customNote: customNote.trim() || undefined,
        defaultInterests: selectedDefaultInterests.length > 0 ? selectedDefaultInterests : ['duo'],
      }

      // Check if profile info fields were present in form data or use existing values as fallback
      const formDisplayName = data.get('displayName')
      const displayName = formDisplayName !== null ? String(formDisplayName) : distributor.display_name
      const title = data.get('title') !== null ? String(data.get('title')) : distributor.title
      const bio = data.get('bio') !== null ? String(data.get('bio')) : distributor.bio || ''
      const phone = data.get('phone') !== null ? String(data.get('phone')) : distributor.phone || ''
      const instagramUrl = data.get('instagramUrl') !== null ? String(data.get('instagramUrl')) : distributor.instagram_url || ''
      const websiteUrl = data.get('websiteUrl') !== null ? String(data.get('websiteUrl')) : distributor.website_url || ''
      const regions = data.get('regions') !== null
        ? String(data.get('regions')).split(',').map((item) => item.trim()).filter(Boolean)
        : distributor.regions
      const languages = data.getAll('languages').length > 0
        ? data.getAll('languages').map(String)
        : distributor.languages
      const acceptingLeads = data.get('acceptingLeads') !== null
        ? data.get('acceptingLeads') === 'on'
        : distributor.accepting_leads

      // Validate purchase links before proceeding
      const invalidEntries = Object.entries(purchaseLinks).filter(([, url]) => url && url.trim() && !isValidPurchaseUrl(url))
      if (invalidEntries.length > 0) {
        setError('Please enter valid URLs (starting with http:// or https://) for your product purchase links.')
        setIsPurchaseLinksOpen(true)
        setSaving(false)
        return
      }

      // Clean purchase links (filter empty strings)
      const cleanPurchaseLinks: Record<string, string> = {}
      for (const [key, val] of Object.entries(purchaseLinks)) {
        if (val && val.trim()) {
          cleanPurchaseLinks[key] = val.trim()
        }
      }

      const payload: DistributorProfileUpdate = {
        displayName,
        title,
        bio,
        phone,
        instagramUrl,
        websiteUrl,
        avatarUrl: permanentAvatar,
        regions,
        languages,
        acceptingLeads,
        applicationSettings,
        purchaseLinks: cleanPurchaseLinks,
      }

      if (permanentAvatar && distributor.slug) {
        setCustomLeaderAvatar(distributor.slug, permanentAvatar)
        setCustomAvatarUrl(permanentAvatar)
      }

      if (distributor.slug) {
        setCustomApplicationSettings(distributor.slug, applicationSettings)
      }

      if (session && crmConfigured) {
        const updated = await updateDistributorProfile(distributor.id, payload)
        setDistributors((rows) =>
          rows.map((item) =>
            item.id === updated.id
              ? {
                  ...updated,
                  avatar_url: permanentAvatar || updated.avatar_url,
                  application_settings: applicationSettings,
                  purchase_links: cleanPurchaseLinks,
                }
              : item
          )
        )
        setMessage('Your profile, direct product purchase links, and application settings have been saved successfully.')
      } else {
        throw new Error('Account storage is unavailable')
      }
    } catch {
      setError('Your changes could not be saved. Check the fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePortraitChange = (data: LeaderPortraitData) => {
    if (data.approvedPortraitUrl) {
      setCustomAvatarUrl(data.approvedPortraitUrl)
    }
  }

  if (loading)
    return (
      <main className="grid min-h-screen place-items-center bg-black text-white">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#2997ff]" />
      </main>
    )
  if (!distributor)
    return (
      <AccountState
        title="Leader account not found"
        body="No leader profiles were found. Please check back later."
      />
    )

  const currentAvatar = customAvatarUrl || distributor.avatar_url || '/logos/tl-square-white.png'
  const isOwnAccount = Boolean(
    session?.user &&
      (distributor.auth_user_id === session.user.id || membership?.distributor_id === distributor.id)
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#12233d,#05070c_48%)] text-white">
      <Navbar />
      <main className="account-settings-page min-h-[100dvh] overflow-visible px-4 pb-48 sm:pb-56 pt-6 sm:pt-10 text-white sm:px-6">
        <SEO
          title="Leader Account Settings | True Legacy"
          description="Manage your verified True Legacy leader profile, security, and personal application form."
          noIndex
        />
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between w-full min-w-0">
            <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
              <Link
                to="/app"
                aria-label="Back to app home"
                className="mt-1 grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.04] hover:bg-white/[.08] transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-cyan-400" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[.24em] text-[#2997ff]">
                  Verified leader account
                </p>
                <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl lg:text-5xl tracking-tight">
                  Account Settings
                </h1>
                <p className="mt-2.5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#aeb4c0] break-words">
                  Customize your verified profile, security password, portrait, and personalized application form ({distributor.display_name}).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 lg:pt-1">
              <button
                type="button"
                onClick={toggleAllSections}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 text-xs font-bold text-white transition cursor-pointer"
              >
                <Layers className="h-4 w-4 text-cyan-400" />
                {allOpen ? 'Collapse All' : 'Expand All'}
              </button>
              <Link
                to={`/d/${distributor.slug}`}
                target="_blank"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-xs sm:text-sm font-bold text-white hover:bg-white/5 transition"
              >
                View Public Profile <ExternalLink className="h-4 w-4 text-cyan-400" />
              </Link>
            </div>
          </header>

          {membership?.role === 'admin' ? (
            <div className="mt-6 block max-w-sm text-sm text-[#aeb4c0] w-full">
              <label htmlFor="profile-to-manage-select" className="block text-xs font-bold uppercase tracking-wider text-[#2997ff] mb-2">
                Profile to manage
              </label>
              <select
                id="profile-to-manage-select"
                value={selectedId}
                onChange={(event) => {
                  setSelectedId(event.target.value)
                  setMessage('')
                  setError('')
                }}
                className="account-input w-full"
              >
                <option value="">Choose a leader</option>
                {distributors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.display_name} ({item.slug})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start w-full max-w-full min-w-0">
            {/* Aside Sidebar */}
            <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[.035] p-5 text-center shadow-xl w-full min-w-0">
            <div className="relative group">
              <img
                src={currentAvatar}
                alt={distributor.display_name}
                className="mx-auto aspect-[4/5] w-full rounded-2xl border border-white/10 bg-[#0a0d13] object-cover object-top"
              />
              <div className="mt-3 text-center">
                <span className="text-[11px] font-semibold text-[#aeb4c0]">Active Directory Portrait</span>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[.08] px-3 py-1.5 text-xs font-bold text-emerald-200">
              <ShieldCheck className="h-4 w-4" /> Verified Profile
            </div>
            <p className="mt-3 text-xs leading-5 text-[#868c98]">
              Your portrait and custom application settings are synchronized across all public links and personal forms.
            </p>

            {/* Quick Share Application Link Card */}
            <div className="mt-6 border-t border-white/10 pt-5 text-left">
              <p className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Personal Application Link</p>
              <p className="mt-1 text-xs text-[#86868b] break-all font-mono">
                /apply?ref={distributor.slug}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={appFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 py-2 text-xs font-bold text-slate-950 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Test Link
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(appFormUrl)
                    setCopiedLink(true)
                    setTimeout(() => setCopiedLink(false), 2000)
                  }}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
                  aria-label="Copy application link"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area with 4 Modular Collapsible Cards */}
          <div className="space-y-6 w-full max-w-full min-w-0">
            {/* CARD 1: Collapsible Leader Portrait Studio & AI Generator */}
            <div className="rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsPortraitStudioOpen(!isPortraitStudioOpen)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-400/15 text-violet-300 border border-violet-400/30">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-300 shrink-0">
                        AI Studio Generator
                      </span>
                      <span className="text-xs text-[#86868b] hidden sm:inline">4:5 Standard</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">
                      Leader Studio Portrait
                    </h2>
                    <p className="text-xs text-[#868c98] truncate">
                      Generate or upload standardized 4:5 luxury studio headshots
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-bold text-violet-300">
                    {isPortraitStudioOpen ? 'Collapse' : 'Studio / Generator'}
                  </span>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#86868b] transition-transform duration-200 ${
                      isPortraitStudioOpen ? 'rotate-180 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </div>
              </button>

              {isPortraitStudioOpen && (
                <div className="px-5 pb-6 sm:px-7 sm:pb-7 pt-2 border-t border-white/10 animate-in fade-in-50 duration-200">
                  <LeaderPortraitGenerator
                    title="Leader Portrait"
                    onPortraitChange={handlePortraitChange}
                    onApprovePortrait={(approvedUrl) => {
                      setCustomAvatarUrl(approvedUrl)
                      setMessage('Standardized portrait approved for your profile. Click "Save all changes" below to finalize.')
                    }}
                  />
                </div>
              )}
            </div>

            {/* Profile & Application Settings Form */}
            <form key={distributor.id} onSubmit={submit} className="space-y-6">

              {/* CARD 2: Collapsible Public Profile Information Form */}
              <div className="rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setIsProfileInfoOpen(!isProfileInfoOpen)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/15 text-cyan-400 border border-cyan-400/30">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300 shrink-0">
                          Directory & Bio
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">
                        Public Profile Information
                      </h2>
                      <p className="text-xs text-[#868c98] truncate">
                        {distributor.display_name} · {distributor.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-bold text-cyan-400">
                      {isProfileInfoOpen ? 'Collapse' : 'Edit Profile'}
                    </span>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#86868b] transition-transform duration-200 ${
                        isProfileInfoOpen ? 'rotate-180 text-white' : ''
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </button>

                {isProfileInfoOpen && (
                  <div className="px-5 pb-6 sm:px-7 sm:pb-7 pt-4 border-t border-white/10 space-y-5 animate-in fade-in-50 duration-200">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Display name">
                        <input
                          required
                          name="displayName"
                          defaultValue={distributor.display_name}
                          minLength={2}
                          maxLength={120}
                          className="account-input"
                        />
                      </Field>
                      <Field label="Leadership title">
                        <input
                          required
                          name="title"
                          defaultValue={distributor.title}
                          maxLength={160}
                          className="account-input"
                        />
                      </Field>
                      <Field label="Phone / WhatsApp">
                        <input
                          name="phone"
                          defaultValue={distributor.phone || ''}
                          maxLength={50}
                          className="account-input"
                        />
                      </Field>
                      <Field label="Instagram profile URL">
                        <input
                          name="instagramUrl"
                          type="url"
                          defaultValue={distributor.instagram_url || ''}
                          placeholder="https://instagram.com/username"
                          className="account-input"
                        />
                      </Field>
                      <Field label="Personal website" hint="Shown on your public profile.">
                        <input
                          name="websiteUrl"
                          type="url"
                          defaultValue={distributor.website_url || ''}
                          placeholder="https://yourwebsite.com"
                          maxLength={500}
                          className="account-input"
                        />
                      </Field>
                      <Field label="Markets and regions" hint="Separate markets with commas.">
                        <input
                          required
                          name="regions"
                          defaultValue={distributor.regions.join(', ')}
                          className="account-input"
                        />
                      </Field>
                      <Field label="Account email" hint="Change securely in the Security section below.">
                        <input
                          value={isOwnAccount ? session?.user?.email || distributor.login_email || '' : distributor.login_email || ''}
                          disabled
                          className="account-input opacity-65"
                        />
                      </Field>
                    </div>
                    <Field label="Biography" className="mt-5">
                      <textarea
                        name="bio"
                        defaultValue={distributor.bio || ''}
                        maxLength={5000}
                        rows={6}
                        className="account-input resize-y"
                      />
                    </Field>
                    <fieldset className="mt-5">
                      <legend className="text-sm font-bold">Languages</legend>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {LANGUAGE_OPTIONS.map(([value, label]) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 rounded-xl border border-white/10 p-3 text-sm text-[#c9ced7]"
                          >
                            <input
                              type="checkbox"
                              name="languages"
                              value={value}
                              defaultChecked={distributor.languages.includes(value)}
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm leading-6">
                      <input
                        type="checkbox"
                        name="acceptingLeads"
                        defaultChecked={distributor.accepting_leads}
                        className="mt-1"
                      />
                      <span>
                        <strong className="block">Accept new referrals</strong>
                        <span className="text-[#868c98]">Allow visitors without an existing sponsor to select you.</span>
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* CARD 3: Collapsible Personal Application Form Customizer */}
              <div className="rounded-[28px] border border-cyan-500/30 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setIsFormCustomizerOpen(!isFormCustomizerOpen)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/15 text-cyan-400 border border-cyan-400/30">
                      <Sliders className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300 shrink-0">
                          Live Form Customizer
                        </span>
                        {hasCustomizations && (
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                            Customized
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">
                        Personal Application Form Settings
                      </h2>
                      <p className="text-xs text-[#868c98] truncate">
                        Customize what prospects see when they visit <code>/apply?ref={distributor.slug}</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-bold text-cyan-400">
                      {isFormCustomizerOpen ? 'Collapse' : 'Customize Form'}
                    </span>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#86868b] transition-transform duration-200 ${
                        isFormCustomizerOpen ? 'rotate-180 text-white' : ''
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </button>

                {isFormCustomizerOpen && (
                  <div className="px-5 pb-6 sm:px-7 sm:pb-7 pt-4 border-t border-white/10 space-y-6 animate-in fade-in-50 duration-200">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Custom Page Headline"
                        hint="Defaults to 'Let’s connect you with the right person.'"
                      >
                        <input
                          value={customHeadline}
                          onChange={(e) => setCustomHeadline(e.target.value)}
                          placeholder={`e.g. Work with ${distributor.display_name} · True Legacy`}
                          maxLength={140}
                          className="account-input"
                        />
                      </Field>

                      <Field
                        label="Custom Eyebrow / Tag"
                        hint="Small banner text above the headline"
                      >
                        <input
                          value={customEyebrow}
                          onChange={(e) => setCustomEyebrow(e.target.value)}
                          placeholder={`e.g. Direct Leadership Inquiry · ${distributor.display_name}`}
                          maxLength={80}
                          className="account-input"
                        />
                      </Field>

                      <Field
                        label="Custom Submit Button Text"
                        hint="Defaults to 'Send my request'"
                      >
                        <input
                          value={customSubmitButtonText}
                          onChange={(e) => setCustomSubmitButtonText(e.target.value)}
                          placeholder="e.g. Apply to Work with Me, Request Duo Package, etc."
                          maxLength={60}
                          className="account-input"
                        />
                      </Field>

                      <Field
                        label="Distributor Badge Tag"
                        hint="e.g. 'Verified Global Leader', '6A2 Leader'"
                      >
                        <input
                          value={customBadge}
                          onChange={(e) => setCustomBadge(e.target.value)}
                          placeholder="e.g. True Legacy Global Partner"
                          maxLength={40}
                          className="account-input"
                        />
                      </Field>
                    </div>

                    <Field
                      label="Custom Subtitle / Welcome Message"
                      hint="Main introductory text explaining the next steps to your lead."
                    >
                      <textarea
                        value={customIntro}
                        onChange={(e) => setCustomIntro(e.target.value)}
                        placeholder="e.g. Ready to elevate your health and unlock global distribution? Complete this short inquiry and I will personally reach out within 24 hours via WhatsApp."
                        rows={3}
                        maxLength={500}
                        className="account-input resize-y"
                      />
                    </Field>

                    <Field
                      label="Personal Instructions / Note Banner (Optional)"
                      hint="Special note shown inside a highlighted banner right above the form fields."
                    >
                      <textarea
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        placeholder="e.g. Please ensure your WhatsApp number is correct with country code so I can send you the presentation package directly."
                        rows={2}
                        maxLength={300}
                        className="account-input resize-y"
                      />
                    </Field>

                    {/* Default Pre-selected Interests */}
                    <fieldset className="border-t border-white/10 pt-5">
                      <legend className="text-sm font-bold text-white mb-2">Default Pre-Selected Interest Options</legend>
                      <p className="text-xs text-[#868c98] mb-3">
                        Choose which checkboxes are pre-checked by default when visitors open your application link:
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {INTEREST_OPTIONS.map((opt) => {
                          const isChecked = selectedDefaultInterests.includes(opt.id)
                          return (
                            <label
                              key={opt.id}
                              className={`flex items-center gap-3 rounded-xl border p-3 text-xs transition-all cursor-pointer ${
                                isChecked
                                  ? 'border-cyan-500/50 bg-cyan-500/10 text-white font-bold'
                                  : 'border-white/10 bg-black/20 text-[#868c98] hover:border-white/20'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleDefaultInterest(opt.id)}
                                className="h-4 w-4 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0"
                              />
                              <span>{opt.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>

                    {/* LIVE PREVIEW OF APPLICATION FORM */}
                    <div className="rounded-2xl border border-white/15 bg-black/60 p-5 sm:p-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                            Live Preview (How Leads See It)
                          </span>
                        </div>
                        <a
                          href={appFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                        >
                          Open full page <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      <div className="space-y-4 text-left">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2997ff]">
                            {customEyebrow.trim() || 'Team lead routing'}
                          </p>
                          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                            {customHeadline.trim() || 'Let’s connect you with the right person.'}
                          </h3>
                          <p className="text-xs text-[#cccccc] mt-1 leading-relaxed">
                            {customIntro.trim() ||
                              'Tell us what you are interested in and who introduced you. Referral attribution is respected; visitors without a referrer can choose an available distributor.'}
                          </p>
                        </div>

                        {/* Distributor attribution banner */}
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={currentAvatar}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover border border-cyan-400/40"
                            />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-[#2997ff]">Referred Through</p>
                              <p className="font-bold text-white text-xs">{distributor.display_name}</p>
                              <p className="text-[10px] text-[#86868b]">{distributor.title}</p>
                            </div>
                          </div>
                          {customBadge.trim() && (
                            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                              {customBadge.trim()}
                            </span>
                          )}
                        </div>

                        {customNote.trim() && (
                          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-[#cccccc]">
                            <p className="font-bold text-white text-[11px] mb-0.5">Message from {distributor.display_name}:</p>
                            <p className="text-[11px]">{customNote.trim()}</p>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="button"
                            className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20"
                          >
                            {customSubmitButtonText.trim() || 'Send my request'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 4: Collapsible Direct Purchase Links Form */}
              <div className="rounded-[28px] border border-amber-500/30 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setIsPurchaseLinksOpen(!isPurchaseLinksOpen)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/30">
                      <ShoppingCart className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 shrink-0">
                          E-Commerce & Orders
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">
                        Direct Purchase Links
                      </h2>
                      <p className="text-xs text-[#868c98] truncate">
                        Configure direct-purchase checkout URLs to display "Buy Now" buttons on your landing pages
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-bold text-amber-300">
                      {isPurchaseLinksOpen ? 'Collapse' : 'Manage Links'}
                    </span>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#86868b] transition-transform duration-200 ${
                        isPurchaseLinksOpen ? 'rotate-180 text-white' : ''
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </button>

                {isPurchaseLinksOpen && (
                  <div className="px-5 pb-6 sm:px-7 sm:pb-7 pt-4 border-t border-white/10 space-y-6 animate-in fade-in-50 duration-200">
                    {/* Guidance / Info Box */}
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4 text-xs text-[#cccccc] leading-relaxed">
                      <p className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                        <ShoppingCart className="h-4 w-4" /> How Direct Purchase Links Work
                      </p>
                      <p>
                        Add your personal Enagic or distributor checkout URL for each product below. When a valid link is saved, a high-converting <strong>Buy Now</strong> button will automatically appear on that product card across your personal landing pages and full product showcase. If left empty, only standard lead consultation & WhatsApp inquiries will display.
                      </p>
                    </div>

                    {/* Standard Promoted Products (Top) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <Sparkles className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">Standard Flagship Products</h3>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {STANDARD_PURCHASE_PRODUCTS.map((prod) => {
                          const val = purchaseLinks[prod.id] || ''
                          const err = purchaseLinkErrors[prod.id]
                          return (
                            <div key={prod.id} className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{prod.name}</span>
                                  <span className="text-[10px] font-normal text-cyan-400 uppercase tracking-wider">Purchase Link</span>
                                </label>
                                {val.trim() && !err && (
                                  <a
                                    href={val}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                                  >
                                    Test Link <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              <p className="text-[11px] text-[#86868b] leading-tight">{prod.subtitle}</p>
                              <input
                                type="url"
                                value={val}
                                onChange={(e) => handlePurchaseLinkChange(prod.id, e.target.value)}
                                placeholder={prod.placeholder}
                                className={`account-input text-xs ${err ? '!border-rose-500/80 !bg-rose-500/[0.05]' : ''}`}
                              />
                              {err && <p className="text-[11px] text-rose-400 font-medium">{err}</p>}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Other Products Section (Below Standard Products) */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <Layers className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">Other Products & Catalog Lineup</h3>
                      </div>
                      <p className="text-xs text-[#86868b]">
                        Configure direct purchase links for additional Enagic water ionizers, shower spas, supplements, and specialty products.
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {OTHER_PURCHASE_PRODUCTS.map((prod) => {
                          const val = purchaseLinks[prod.id] || ''
                          const err = purchaseLinkErrors[prod.id]
                          return (
                            <div key={prod.id} className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{prod.name}</span>
                                  <span className="text-[10px] font-normal text-amber-400 uppercase tracking-wider">Purchase Link</span>
                                </label>
                                {val.trim() && !err && (
                                  <a
                                    href={val}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                                  >
                                    Test Link <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              <p className="text-[11px] text-[#86868b] leading-tight">{prod.subtitle}</p>
                              <input
                                type="url"
                                value={val}
                                onChange={(e) => handlePurchaseLinkChange(prod.id, e.target.value)}
                                placeholder={prod.placeholder}
                                className={`account-input text-xs ${err ? '!border-rose-500/80 !bg-rose-500/[0.05]' : ''}`}
                              />
                              {err && <p className="text-[11px] text-rose-400 font-medium">{err}</p>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status alerts for profile form */}
              {message ? (
                <p className="flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[.08] p-4 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  {message}
                </p>
              ) : null}
              {error ? (
                <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[.08] p-4 text-sm text-rose-100">
                  {error}
                </p>
              ) : null}

              {/* Master Save Button for Profile & App Settings */}
              <button
                disabled={saving}
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 font-black text-slate-950 disabled:opacity-60 transition hover:bg-cyan-300 shadow-xl shadow-cyan-400/20 text-sm"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving changes securely…' : 'Save all profile & application settings'}
              </button>
            </form>

            {/* CARD 4: Collapsible Portal Security & Password Update */}
            <div className="rounded-[28px] border border-amber-500/30 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    <KeyRound className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 shrink-0">
                        CRM Portal Security
                      </span>
                      <span className="text-xs text-[#86868b] hidden sm:inline font-mono">/app sign-in</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">
                      Security & Portal Password
                    </h2>
                    <p className="text-xs text-[#868c98] truncate">
                      Change your password for sign-in access to the CRM Portal and App
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-bold text-amber-300">
                    {isSecurityOpen ? 'Collapse' : 'Change Password'}
                  </span>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#86868b] transition-transform duration-200 ${
                      isSecurityOpen ? 'rotate-180 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </div>
              </button>

              {isSecurityOpen && (
                <div className="px-5 pb-6 sm:px-7 sm:pb-7 pt-4 border-t border-white/10 space-y-7 animate-in fade-in-50 duration-200">
                  {isOwnAccount ? <><form onSubmit={handleEmailUpdate} className="space-y-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/[.04] p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                      <div>
                        <h3 className="font-black text-white">Secure sign-in email change</h3>
                        <p className="mt-1 text-xs leading-5 text-[#aeb4c0]">Your current sign-in is <strong className="text-white">{session?.user.email || distributor.login_email}</strong>. Verification is required before the new address becomes active.</p>
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="New email address">
                        <input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required autoComplete="email" placeholder="new@email.com" className="account-input" />
                      </Field>
                      <Field label="Confirm new email">
                        <input type="email" value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} required autoComplete="email" placeholder="Repeat new email" className="account-input" />
                      </Field>
                    </div>
                    {emailMessage && <p className="flex items-start gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[.08] p-4 text-sm leading-6 text-emerald-100"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />{emailMessage}</p>}
                    {emailError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[.08] p-4 text-sm text-rose-100">{emailError}</p>}
                    <button disabled={emailSaving || !newEmail || !confirmEmail} type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-xs font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:opacity-60">
                      <ShieldCheck className="h-4 w-4" />
                      {emailSaving ? 'Sending verification…' : 'Send verification emails'}
                    </button>
                  </form>

                  <form onSubmit={handlePasswordUpdate} className="space-y-5">
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                    <Lock className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>
                      Passwords must contain at least <strong>8 characters</strong>. Changing your password here immediately updates your secure credentials across the True Legacy CRM and Distributor App.
                    </span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="New Password" hint="Minimum 8 characters">
                      <div className="relative mt-2">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                          minLength={8}
                          className="account-input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </Field>

                    <Field label="Confirm New Password" hint="Must match new password">
                      <div className="relative mt-2">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          required
                          minLength={8}
                          className="account-input pr-10"
                        />
                      </div>
                    </Field>
                  </div>

                  {passwordMessage && (
                    <p className="flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[.08] p-4 text-sm text-emerald-100">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      {passwordMessage}
                    </p>
                  )}
                  {passwordError && (
                    <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[.08] p-4 text-sm text-rose-100">
                      {passwordError}
                    </p>
                  )}

                  <button
                    disabled={passwordSaving || !newPassword}
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-6 font-black text-slate-950 disabled:opacity-60 transition shadow-lg shadow-amber-400/20 text-xs"
                  >
                    <KeyRound className="h-4 w-4" />
                    {passwordSaving ? 'Updating password securely…' : 'Update Portal Password'}
                  </button>
                  </form>
                  </> : <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm leading-6 text-[#aeb4c0]"><strong className="text-white">Security changes are owner-verified.</strong> The leader must sign in to their own account to change their email or password. This prevents an administrator session from replacing another person’s credentials.</div>}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
    </div>
  )
}

function Field({
  label,
  hint,
  className = '',
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block text-sm text-[#c9ced7] ${className}`}>
      <span className="font-bold text-white">{label}</span>
      {hint ? <span className="ml-2 text-xs text-[#747b88]">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

function AccountState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-black p-5 text-white">
      <SEO title={`${title} | True Legacy`} description={body} noIndex />
      <div className="max-w-md text-center">
        <Settings2 className="mx-auto h-10 w-10 text-[#2997ff]" />
        <h1 className="mt-5 text-3xl font-black">{title}</h1>
        <p className="mt-4 leading-7 text-[#aeb4c0]">{body}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </main>
  )
}
