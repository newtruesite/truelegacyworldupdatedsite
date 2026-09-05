import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Search,
  Settings,
  QrCode,
  LayoutDashboard,
  UserRound,
  ClipboardCheck,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react'
import { getActiveProfileLandingCards } from '@/config/profileLandingCards'
import { getLeaderPortrait } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'

export interface QuickAccessDestination {
  id: string
  title: string
  category: string
  description: string
  path: string
  fullUrl: string
  icon: any
  group: 'pages' | 'business'
  badge?: string
  accentColor?: string
}

interface LeaderQuickAccessDrawerProps {
  isOpen: boolean
  onClose: () => void
  profile: PublicDistributor
  locale?: string
}

export function LeaderQuickAccessDrawer({
  isOpen,
  onClose,
  profile,
  locale = 'en',
}: LeaderQuickAccessDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedToast, setCopiedToast] = useState<string | null>(null)

  // Determine origin for absolute URLs
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.truelegacyworld.com'

  // Standardized leader photo
  const leaderPhoto = (profile.slug ? getLeaderPortrait(profile.slug, profile.avatar_url || undefined) : profile.avatar_url) || '/logos/tl-square-white.png'
  const firstName = profile.display_name.split(' ')[0] || 'Leader'

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background body scroll when drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Dynamically build destinations list from the source of truth (profileLandingCards.ts + core endpoints)
  const allDestinations = useMemo<QuickAccessDestination[]>(() => {
    const slug = profile.slug

    // 1. Core Profile Entry
    const profileItem: QuickAccessDestination = {
      id: 'profile',
      title: 'Main Profile & Bio',
      category: 'PROFILE HUB',
      description: 'Your verified public profile, story, active markets, languages, and contact channels.',
      path: `/d/${slug}`,
      fullUrl: `${origin}/d/${slug}`,
      icon: UserRound,
      group: 'pages',
      badge: 'Profile Hub',
      accentColor: 'from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-400/30',
    }

    // 2. Dynamic Landing Cards from registry
    const activeCards = getActiveProfileLandingCards()
    const mappedCards: QuickAccessDestination[] = activeCards.map((card) => {
      const isBusinessGroup =
        card.analyticsInterest === 'distributor' ||
        card.analyticsInterest === 'training' ||
        card.analyticsInterest === 'events' ||
        card.id === 'business' ||
        card.id === 'training' ||
        card.id === 'events'

      const targetPath = `${card.getPath(slug)}?source=profile&interest=${card.analyticsInterest}`

      return {
        id: card.id,
        title: card.title.en,
        category: card.categoryLabel.en,
        description: card.description.en(firstName),
        path: targetPath,
        fullUrl: `${origin}${targetPath}`,
        icon: card.icon,
        group: isBusinessGroup ? 'business' : 'pages',
        badge: card.eyebrow.en,
        accentColor: card.accentColor.gradient,
      }
    })

    // 3. Direct Lead Intake / Candidate Application
    const applyItem: QuickAccessDestination = {
      id: 'apply',
      title: 'Candidate Application Form',
      category: 'QUALIFICATION INTAKE',
      description: 'Direct candidate qualification form pre-attributed to your referral code in True Legacy CRM.',
      path: `/apply?ref=${profile.referral_code || slug}`,
      fullUrl: `${origin}/apply?ref=${profile.referral_code || slug}`,
      icon: ClipboardCheck,
      group: 'business',
      badge: 'Pre-Attributed',
      accentColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-400/30',
    }

    return [profileItem, ...mappedCards, applyItem]
  }, [profile.slug, profile.referral_code, origin, firstName])

  // Filter destinations by search query
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return allDestinations
    const q = searchQuery.toLowerCase().trim()
    return allDestinations.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.path.toLowerCase().includes(q)
    )
  }, [allDestinations, searchQuery])

  // Partition into Groups
  const landingPages = useMemo(
    () => filteredDestinations.filter((d) => d.group === 'pages'),
    [filteredDestinations]
  )
  const businessPages = useMemo(
    () => filteredDestinations.filter((d) => d.group === 'business'),
    [filteredDestinations]
  )

  // Copy handler
  const handleCopyLink = async (dest: QuickAccessDestination, e?: React.MouseEvent) => {
    e?.stopPropagation()
    e?.preventDefault()
    try {
      await navigator.clipboard.writeText(dest.fullUrl)
      setCopiedId(dest.id)
      setCopiedToast(`Copied ${dest.title} link!`)
      setTimeout(() => setCopiedId(null), 1800)
      setTimeout(() => setCopiedToast(null), 2500)
    } catch {
      // Fallback
    }
  }

  // Share handler
  const handleShare = async (dest: QuickAccessDestination, e?: React.MouseEvent) => {
    e?.stopPropagation()
    e?.preventDefault()
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${dest.title} · ${profile.display_name}`,
          text: dest.description,
          url: dest.fullUrl,
        })
      } catch {
        // Share cancelled or failed, no-op
      }
    } else {
      await handleCopyLink(dest, e)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Drawer / Sheet Panel */}
          <motion.aside
            initial={{ x: '100%', y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: '100%', y: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative z-10 flex h-[92vh] sm:h-full w-full max-w-full sm:max-w-xl md:max-w-2xl flex-col rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl border-t sm:border-t-0 sm:border-l border-cyan-500/20 bg-[#060913]/95 text-white shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="My Landing Pages Quick Access"
          >
            {/* Mobile Sheet Drag Handle */}
            <div className="sm:hidden flex items-center justify-center pt-3 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-white/20" />
            </div>

            {/* Header: Leader Info + Controls */}
            <div className="border-b border-white/10 px-5 sm:px-7 py-4 sm:py-5 bg-gradient-to-b from-white/[0.04] to-transparent">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-cyan-400/50 bg-black shadow-md">
                    <img
                      src={leaderPhoto}
                      alt={profile.display_name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-base font-black text-white">
                        {profile.display_name}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                        <BadgeCheck className="h-3 w-3 text-cyan-300" />
                        Leader
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#86868b] font-mono truncate">
                      <span>/d/{profile.slug}</span>
                      <span className="text-cyan-400">· Quick Access</span>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  aria-label="Close My Landing Pages"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#cccccc] hover:border-white/25 hover:bg-white/10 hover:text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Leader Shortcuts Strip: Manage Profile, Share Center, CRM Contacts */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Link
                  to="/app/settings"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-center"
                >
                  <Settings className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Manage Profile</span>
                </Link>
                <Link
                  to="/app/share"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-center"
                >
                  <QrCode className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Share & QR</span>
                </Link>
                <Link
                  to="/crm"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-center"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">CRM Leads</span>
                </Link>
              </div>

              {/* Search Box */}
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86868b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your landing pages & tools..."
                  className="h-9 w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-8 text-xs text-white placeholder-[#86868b] focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#86868b] hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Destinations List */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-7 custom-scrollbar">
              {/* Category 1: MY LANDING PAGES */}
              {landingPages.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                        {landingPages.length}
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2997ff]">
                        My Landing Pages
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#86868b]">Products & Ionization</span>
                  </div>

                  <div className="grid gap-2.5">
                    {landingPages.map((item) => (
                      <DestinationCard
                        key={item.id}
                        dest={item}
                        isCopied={copiedId === item.id}
                        onCopy={handleCopyLink}
                        onShare={handleShare}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Category 2: BUSINESS & SUPPORT */}
              {businessPages.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        {businessPages.length}
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Business & Support
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#86868b]">Opportunity & Mentorship</span>
                  </div>

                  <div className="grid gap-2.5">
                    {businessPages.map((item) => (
                      <DestinationCard
                        key={item.id}
                        dest={item}
                        isCopied={copiedId === item.id}
                        onCopy={handleCopyLink}
                        onShare={handleShare}
                      />
                    ))}
                  </div>
                </section>
              )}

              {filteredDestinations.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-[#86868b]">
                  No landing pages match “{searchQuery}”.
                </div>
              )}
            </div>

            {/* Bottom Footer Action Bar */}
            <div className="border-t border-white/10 bg-black/60 px-5 sm:px-7 py-3.5 flex items-center justify-between gap-3 text-xs text-[#86868b]">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate">Attribution tied to slug: <strong className="text-white font-mono">{profile.slug}</strong></span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${origin}/d/${profile.slug}`)
                  setCopiedToast(`Copied Master Profile Link!`)
                  setTimeout(() => setCopiedToast(null), 2500)
                }}
                className="shrink-0 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Master Profile</span>
              </button>
            </div>

            {/* Floating Toast Notification */}
            <AnimatePresence>
              {copiedToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/90 px-4 py-2 text-xs font-bold text-emerald-200 shadow-xl backdrop-blur-md"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{copiedToast}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

function DestinationCard({
  dest,
  isCopied,
  onCopy,
  onShare,
}: {
  dest: QuickAccessDestination
  isCopied: boolean
  onCopy: (dest: QuickAccessDestination, e?: React.MouseEvent) => void
  onShare: (dest: QuickAccessDestination, e?: React.MouseEvent) => void
}) {
  const Icon = dest.icon

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all duration-200 shadow-sm">
      {/* Left info column */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/50 text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {dest.title}
            </h4>
            {dest.badge && (
              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-[#86868b]">
                {dest.category}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[#86868b] line-clamp-1">
            {dest.description}
          </p>
          <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-cyan-400/80 truncate">
            <span>{dest.path}</span>
          </div>
        </div>
      </div>

      {/* Right Actions: Open, Copy, Share */}
      <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
        {/* Open Link Button */}
        <Link
          to={dest.path}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-cyan-500/10 px-2.5 text-xs font-semibold text-white hover:text-cyan-300 transition-all"
          title="Open Landing Page"
        >
          <span>Open</span>
          <ExternalLink className="h-3 w-3 text-[#86868b]" />
        </Link>

        {/* Copy Link Button */}
        <button
          onClick={(e) => onCopy(dest, e)}
          className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all cursor-pointer ${
            isCopied
              ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
              : 'border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10'
          }`}
          title="Copy direct share URL"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-[#86868b]" />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => onShare(dest, e)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#cccccc] hover:border-white/20 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          title="Share page"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
