/**
 * Portrait Reference Admin Panel
 *
 * Admin-only component for managing the True Legacy Portrait Standard reference library.
 * Lives inside the CRM under an "Portrait Standard" admin section.
 *
 * Features:
 * - View all reference portraits with active/inactive status
 * - Toggle references on/off (persisted in localStorage for now)
 * - Preview current active reference set in a horizontal strip
 * - Link to the Portrait Studio page for testing
 * - Prompt display (read-only, shows current locked prompt)
 * - Tolerance values display
 */

import { useState, useEffect } from 'react'
import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
  Settings2,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import {
  TRUE_LEGACY_PORTRAIT_REFERENCES,
  ACTIVE_STYLE_REFERENCES,
  TRUE_LEGACY_LEADER_PORTRAIT_PROMPT,
  MAX_AUTO_RETRY_ATTEMPTS,
  PORTRAIT_TOLERANCES,
  type PortraitStyleReference,
} from '@/config/portraitStandard'
import { getProviderStatus } from '@/services/portraitGenerationService'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'tl-portrait-admin-active-ids'

function loadActiveIds(): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as string[]
      return new Set(parsed)
    }
  } catch {
    // Ignore
  }
  // Default: whatever the config says
  return new Set(TRUE_LEGACY_PORTRAIT_REFERENCES.filter((r) => r.active).map((r) => r.id))
}

function saveActiveIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function PortraitReferenceAdmin() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeIds, setActiveIds] = useState<Set<string>>(loadActiveIds)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)
  const [isTolerancesExpanded, setIsTolerancesExpanded] = useState(false)

  const providerStatus = getProviderStatus()

  const activeRefs = TRUE_LEGACY_PORTRAIT_REFERENCES.filter((r) => activeIds.has(r.id))
  const inactiveRefs = TRUE_LEGACY_PORTRAIT_REFERENCES.filter((r) => !activeIds.has(r.id))

  const toggleRef = (ref: PortraitStyleReference) => {
    setActiveIds((prev) => {
      const next = new Set(prev)
      if (next.has(ref.id)) {
        if (next.size <= 1) return prev // Must keep at least one reference
        next.delete(ref.id)
      } else {
        next.add(ref.id)
      }
      saveActiveIds(next)
      return next
    })
  }

  return (
    <section className="mt-6 rounded-2xl border border-[#2997ff]/20 bg-[#2997ff]/[0.03] overflow-hidden">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-white/[0.02] transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#2997ff]/25 bg-[#2997ff]/10 text-[#2997ff]">
            <Camera className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-white">Portrait Standard Control</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#2997ff]/20 bg-[#2997ff]/8 px-2 py-0.5 text-[10px] font-bold text-[#2997ff]">
                <ShieldCheck className="h-3 w-3" />
                Admin Only
              </span>
            </div>
            <p className="text-xs text-[#5d6673] truncate">
              Manage the reference library · {activeRefs.length} active of{' '}
              {TRUE_LEGACY_PORTRAIT_REFERENCES.length} portraits
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-[#5d6673] shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#5d6673] shrink-0" />
        )}
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="border-t border-white/8 p-4 sm:p-5 space-y-6">
          {/* Provider Status */}
          <div
            className={`flex items-center gap-3 rounded-xl border p-3.5 ${
              providerStatus.quality === 'studio'
                ? 'border-emerald-400/20 bg-emerald-400/[0.05]'
                : 'border-amber-400/20 bg-amber-400/[0.05]'
            }`}
          >
            <Zap
              className={`h-4.5 w-4.5 shrink-0 ${
                providerStatus.quality === 'studio' ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <div className="min-w-0">
              <p
                className={`text-xs font-black ${
                  providerStatus.quality === 'studio' ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {providerStatus.quality === 'studio'
                  ? `AI Provider: ${providerStatus.label} — Studio Quality Active`
                  : 'No AI API Configured — Running in Canvas Preview Mode'}
              </p>
              <p className="text-[11px] text-[#5d6673] mt-0.5">
                {providerStatus.quality === 'studio'
                  ? 'Real AI image editing is active. Multi-reference portrait generation enabled.'
                  : 'Add VITE_OPENAI_API_KEY to your .env to enable studio-quality AI generation.'}
              </p>
            </div>
          </div>

          {/* Active Reference Strip */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#6b7480]">
                Active Style References ({activeRefs.length})
              </p>
              <Link
                to="/leaders/portrait"
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] text-[#2997ff] hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Test Studio
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {TRUE_LEGACY_PORTRAIT_REFERENCES.map((ref) => {
                const isActive = activeIds.has(ref.id)
                return (
                  <div
                    key={ref.id}
                    className={`relative rounded-xl border overflow-hidden transition-all ${
                      isActive
                        ? 'border-emerald-400/30 shadow-sm shadow-emerald-400/10'
                        : 'border-white/8 opacity-50'
                    }`}
                  >
                    <div className="aspect-[4/5] w-full bg-black/60">
                      <img
                        src={ref.url}
                        alt={ref.name}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay info */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2">
                      <p className="text-[10px] font-black text-white leading-tight truncate">
                        {ref.name}
                      </p>
                      <p className="text-[9px] text-[#6b7480] truncate">{ref.label}</p>
                    </div>

                    {/* Active badge */}
                    {isActive && (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-emerald-400/90 px-1.5 py-0.5 text-[9px] font-black text-slate-950">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Active
                      </div>
                    )}

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleRef(ref)}
                      title={isActive ? 'Deactivate reference' : 'Activate reference'}
                      className={`absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-lg border transition ${
                        isActive
                          ? 'border-emerald-400/30 bg-black/70 text-emerald-400 hover:bg-emerald-400/20'
                          : 'border-white/15 bg-black/70 text-[#5d6673] hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </button>
                  </div>
                )
              })}
            </div>

            <p className="mt-2.5 flex items-start gap-1.5 text-[11px] text-[#4d5560] leading-relaxed">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#2997ff]" />
              <span>
                Active references are automatically attached to every portrait generation request.
                Aim for <strong className="text-[#8d939e]">4–6 visually consistent</strong> references
                for best results. The generation engine can attach up to 3 simultaneously to the AI.
              </span>
            </p>
          </div>

          {/* Retry Config */}
          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-[#6b7480] mb-2.5">
              Auto-Retry Configuration
            </p>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#2997ff]/10 text-[#2997ff] shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Max {MAX_AUTO_RETRY_ATTEMPTS} automatic retries per generation
                </p>
                <p className="text-[11px] text-[#5d6673]">
                  System validates each result and auto-retries on quality failures before showing
                  the user any output.
                </p>
              </div>
            </div>
          </div>

          {/* Tolerance Reference */}
          <div>
            <button
              type="button"
              onClick={() => setIsTolerancesExpanded(!isTolerancesExpanded)}
              className="flex w-full items-center justify-between gap-2 text-[11px] font-black uppercase tracking-wider text-[#6b7480] hover:text-white transition"
            >
              <span>Validation Tolerances</span>
              {isTolerancesExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {isTolerancesExpanded && (
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {Object.entries(PORTRAIT_TOLERANCES).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/6 bg-black/25 px-3 py-2"
                  >
                    <span className="text-[11px] font-mono text-[#5d6673] truncate">{key}</span>
                    <span className="text-[11px] font-black text-white shrink-0">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prompt Reference */}
          <div>
            <button
              type="button"
              onClick={() => setIsPromptExpanded(!isPromptExpanded)}
              className="flex w-full items-center justify-between gap-2 text-[11px] font-black uppercase tracking-wider text-[#6b7480] hover:text-white transition"
            >
              <span>Current Locked Generation Prompt</span>
              {isPromptExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {isPromptExpanded && (
              <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/8 bg-black/50 p-3.5 font-mono text-[11px] leading-relaxed text-[#c9ced7] break-words">
                {TRUE_LEGACY_LEADER_PORTRAIT_PROMPT}
              </pre>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 pt-1 border-t border-white/8">
            <Link
              to="/leaders/portrait"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white hover:bg-white/8 transition"
            >
              <Camera className="h-3.5 w-3.5 text-[#2997ff]" />
              Open Portrait Studio
            </Link>
            <Link
              to="/leaders/apply"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white hover:bg-white/8 transition"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
              Test Leader Application
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
