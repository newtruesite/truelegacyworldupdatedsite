/**
 * True Legacy Leader Portrait Generator
 *
 * Three clean states:
 *   1. Upload  — User drags or selects their photo
 *   2. Generating — Full-width progress, auto-retry counter
 *   3. Review — Side-by-side comparison with proportionate action buttons
 *
 * Users never see: prompts, reference images, crop settings, AI parameters.
 * Everything is hidden inside the engine.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  UploadCloud,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Camera,
  RefreshCw,
  UserCheck,
  Download,
  RotateCcw,
  Trash2,
  ShieldCheck,
  BadgeCheck,
  Zap,
} from 'lucide-react'
import {
  getOfficialLeaderPortraitPrompt,
  validatePortraitFile,
  ACTIVE_STYLE_REFERENCES,
  type LeaderPortraitData,
  type LeaderPortraitStatus,
} from '@/config/portraitStandard'
import {
  generateLeaderPortraitAI,
  downloadPortrait,
  getProviderStatus,
  getProviderStatusAsync,
} from '@/services/portraitGenerationService'

export interface LeaderPortraitGeneratorProps {
  onPortraitChange?: (data: LeaderPortraitData) => void
  onApprovePortrait?: (approvedUrl: string, data: LeaderPortraitData) => void
  initialPortrait?: LeaderPortraitData
  title?: string
  className?: string
}

type UIState = 'upload' | 'generating' | 'review'

export function LeaderPortraitGenerator({
  onPortraitChange,
  onApprovePortrait,
  initialPortrait,
  title = 'Leader Portrait',
  className = '',
}: LeaderPortraitGeneratorProps) {
  // ── Source photo state ────────────────────────────────────────────────────
  const [originalFile, setOriginalFile] = useState<File | null>(
    initialPortrait?.originalFile ?? null
  )
  const [originalUrl, setOriginalUrl] = useState(initialPortrait?.originalPreviewUrl ?? '')
  const [originalName, setOriginalName] = useState(initialPortrait?.originalFileName ?? '')

  // ── Generated portrait state ──────────────────────────────────────────────
  const [generatedUrl, setGeneratedUrl] = useState(initialPortrait?.generatedPortraitUrl ?? '')
  const [generatedBlob, setGeneratedBlob] = useState<Blob | undefined>()
  const [approvedUrl, setApprovedUrl] = useState(initialPortrait?.approvedPortraitUrl ?? '')
  const [validationNotes, setValidationNotes] = useState<string[]>(
    initialPortrait?.validationNotes ?? []
  )

  // ── UI / status state ─────────────────────────────────────────────────────
  const [uiState, setUiState] = useState<UIState>(
    initialPortrait?.generatedPortraitUrl ? 'review' : 'upload'
  )
  const [status, setStatus] = useState<LeaderPortraitStatus>(
    initialPortrait?.status ?? 'not_uploaded'
  )
  const [isDragging, setIsDragging] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStage, setGenerationStage] = useState('')
  const [generationPercent, setGenerationPercent] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isApproved, setIsApproved] = useState(Boolean(initialPortrait?.approvedPortraitUrl))

  const fileInputRef = useRef<HTMLInputElement>(null)
  const customUploadRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [providerStatus, setProviderStatus] = useState(getProviderStatus())

  useEffect(() => {
    let active = true
    getProviderStatusAsync().then((status) => {
      if (active) setProviderStatus(status)
    })
    return () => { active = false }
  }, [])

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (originalUrl.startsWith('blob:')) URL.revokeObjectURL(originalUrl)
      if (generatedUrl.startsWith('blob:')) URL.revokeObjectURL(generatedUrl)
    }
  }, [originalUrl, generatedUrl])

  // ── Parent notification ───────────────────────────────────────────────────
  const notify = useCallback(
    (patch: Partial<LeaderPortraitData>) => {
      onPortraitChange?.({
        originalFile,
        originalFileName: originalName,
        originalFileSize: originalFile?.size,
        originalPreviewUrl: originalUrl,
        generatedPortraitUrl: generatedUrl,
        approvedPortraitUrl: approvedUrl,
        promptUsed: getOfficialLeaderPortraitPrompt(),
        status,
        qualityPassed: validationNotes.length > 0,
        validationNotes,
        ...patch,
      })
    },
    [onPortraitChange, originalFile, originalName, originalUrl, generatedUrl, approvedUrl, status, validationNotes]
  )

  // ── File processing ───────────────────────────────────────────────────────
  const processFile = async (file: File) => {
    setErrorMessage('')
    setIsValidating(true)
    try {
      const result = await validatePortraitFile(file)
      if (!result.valid) {
        setErrorMessage(result.error ?? 'Invalid photo.')
        setIsValidating(false)
        return
      }

      if (originalUrl.startsWith('blob:')) URL.revokeObjectURL(originalUrl)
      if (generatedUrl.startsWith('blob:')) URL.revokeObjectURL(generatedUrl)

      const url = URL.createObjectURL(file)
      setOriginalFile(file)
      setOriginalUrl(url)
      setOriginalName(file.name)
      setGeneratedUrl('')
      setApprovedUrl('')
      setGeneratedBlob(undefined)
      setIsApproved(false)
      setValidationNotes([])
      setAttemptCount(0)
      setStatus('photo_uploaded')
      setUiState('upload') // stay on upload — user clicks Generate
      notify({ originalFile: file, originalPreviewUrl: url, status: 'photo_uploaded' })
    } finally {
      setIsValidating(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) processFile(f)
  }

  // ── Remove photo ──────────────────────────────────────────────────────────
  const handleRemove = () => {
    abortRef.current?.abort()
    if (originalUrl.startsWith('blob:')) URL.revokeObjectURL(originalUrl)
    if (generatedUrl.startsWith('blob:')) URL.revokeObjectURL(generatedUrl)
    setOriginalFile(null)
    setOriginalUrl('')
    setOriginalName('')
    setGeneratedUrl('')
    setApprovedUrl('')
    setGeneratedBlob(undefined)
    setIsApproved(false)
    setStatus('not_uploaded')
    setUiState('upload')
    setErrorMessage('')
    setValidationNotes([])
    setAttemptCount(0)
  }

  // ── Generate portrait ─────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (isGenerating || !originalFile) return

    setIsGenerating(true)
    setStatus('generating')
    setUiState('generating')
    setErrorMessage('')
    setGenerationPercent(0)
    setGenerationStage('Starting True Legacy Portrait Studio…')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const result = await generateLeaderPortraitAI({
        sourceImage: originalFile,
        styleReferences: ACTIVE_STYLE_REFERENCES,
        onProgress: (stage, pct) => {
          setGenerationStage(stage)
          setGenerationPercent(pct)
          // Track retry attempts from stage text
          const match = stage.match(/attempt (\d+) of/)
          if (match) setAttemptCount(parseInt(match[1]) - 1)
        },
        signal: controller.signal,
      })

      if (result.success && result.portraitUrl) {
        if (generatedUrl.startsWith('blob:')) URL.revokeObjectURL(generatedUrl)
        setGeneratedUrl(result.portraitUrl)
        setGeneratedBlob(result.blob)
        setAttemptCount(result.attemptCount)
        setValidationNotes(result.validationNotes ?? [])
        setStatus('ready_for_review')
        setUiState('review')
        notify({
          generatedPortraitUrl: result.portraitUrl,
          status: 'ready_for_review',
          validationNotes: result.validationNotes,
          attemptCount: result.attemptCount,
        })
      } else {
        setErrorMessage(
          result.error ??
            "We couldn't create a portrait that meets the True Legacy standard from this photo. Try uploading another clear photo."
        )
        setStatus('generation_failed')
        setUiState('upload') // Return to upload state with error shown
        notify({ status: 'generation_failed' })
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setErrorMessage("Generation was interrupted. Please try again.")
        setStatus('generation_failed')
        setUiState('upload')
      }
      // AbortError — user cancelled, stay put
    } finally {
      setIsGenerating(false)
      abortRef.current = null
    }
  }

  // ── Approve portrait ──────────────────────────────────────────────────────
  const handleApprove = () => {
    const url = generatedUrl
    setApprovedUrl(url)
    setIsApproved(true)
    setStatus('applicant_approved')
    const data: LeaderPortraitData = {
      originalFile,
      originalFileName: originalName,
      originalPreviewUrl: originalUrl,
      generatedPortraitUrl: url,
      approvedPortraitUrl: url,
      promptUsed: getOfficialLeaderPortraitPrompt(),
      status: 'applicant_approved',
      qualityPassed: true,
      validationNotes,
    }
    notify(data)
    onApprovePortrait?.(url, data)
  }

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = () => {
    const blob = generatedBlob
    if (blob) {
      downloadPortrait(blob, `true-legacy-portrait-${Date.now()}.png`)
    } else if (generatedUrl) {
      const a = document.createElement('a')
      a.href = generatedUrl
      a.download = `true-legacy-portrait-${Date.now()}.png`
      a.click()
    }
  }

  // ── Custom portrait upload ────────────────────────────────────────────────
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    if (generatedUrl.startsWith('blob:')) URL.revokeObjectURL(generatedUrl)
    setGeneratedBlob(undefined)
    setGeneratedUrl(url)
    setStatus('ready_for_review')
    setUiState('review')
    setIsApproved(false)
    e.target.value = ''
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <section
      className={`w-full min-w-0 box-border overflow-x-clip rounded-3xl border border-white/10 bg-[#070b14]/95 shadow-2xl ${className}`}
      aria-labelledby="portrait-section-title"
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-5 sm:px-7 sm:py-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#2997ff]">
            <Camera className="h-3.5 w-3.5 shrink-0" />
            <span>Official Portrait Standardization</span>
          </div>
          <h2
            id="portrait-section-title"
            className="mt-1.5 text-xl font-black text-white sm:text-2xl"
          >
            {title}
          </h2>
        </div>

        {/* Provider badge */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold shrink-0 ${
            providerStatus.quality === 'studio'
              ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
              : 'border-amber-400/25 bg-amber-400/10 text-amber-300'
          }`}
        >
          <Zap className="h-3 w-3 shrink-0" />
          <span className="whitespace-nowrap">
            {providerStatus.quality === 'studio' ? 'On-Device Portrait Engine Active' : 'Preview Mode'}
          </span>
        </div>
      </div>

      {/* ── Canvas area ── */}
      <div className="p-4 sm:p-6 md:p-7">
        {/* ===================== STATE: UPLOAD ===================== */}
        {uiState === 'upload' && (
          <div className="space-y-5">
            {/* Drag & drop zone */}
            <div
              role="button"
              tabIndex={0}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              aria-label="Upload your photo to generate a True Legacy leader portrait"
              className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer select-none transition-all duration-200 ${
                isDragging
                  ? 'border-[#2997ff] bg-[#2997ff]/8 shadow-lg shadow-[#2997ff]/10'
                  : originalUrl
                  ? 'border-white/20 bg-white/[0.015] hover:border-white/30'
                  : 'border-white/12 bg-white/[0.018] hover:border-white/25 hover:bg-white/[0.025]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
                className="hidden"
              />

              {originalUrl ? (
                /* ── Photo already loaded — show preview + actions ── */
                <div className="w-full flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-left" onClick={(e) => e.stopPropagation()}>
                  <div className="shrink-0 aspect-[4/5] w-28 sm:w-32 rounded-xl overflow-hidden border border-white/12 bg-black/60 shadow-lg">
                    <img
                      src={originalUrl}
                      alt="Uploaded source"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#aeb4c0]">Photo ready to generate</p>
                    <p className="mt-0.5 text-sm font-black text-white truncate">{originalName}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/20 bg-rose-400/8 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/15 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Empty upload zone ── */
                <>
                  <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl border border-white/8 bg-white/[0.04] text-[#2997ff] group-hover:scale-[1.04] transition-transform shrink-0">
                    <UploadCloud className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="mt-4 text-base sm:text-lg font-black text-white group-hover:text-[#2997ff] transition-colors">
                    {isDragging ? 'Drop your photo here' : 'Upload Your Photo'}
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-[#778090]">
                    Drag & drop or click to choose. JPG, PNG, or WEBP up to 10 MB.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                    className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 px-7 py-2.5 text-sm font-bold text-white hover:border-[#2997ff]/50 hover:bg-[#2997ff]/15 transition"
                  >
                    Choose Photo
                  </button>
                  {isValidating && (
                    <p className="mt-4 text-xs text-[#2997ff] animate-pulse">
                      Checking photo quality…
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Quality checklist (shown after photo is loaded) */}
            {originalUrl && (
              <div className="rounded-2xl border border-white/6 bg-black/25 p-4 sm:p-5">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#6b7480] mb-3">
                  Portrait Requirements
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-[#8d939e]">
                  {[
                    'Face clearly visible & natural expression',
                    'Single person in the photo',
                    'Photo taken in reasonable lighting',
                    'Clothing you want to keep in the portrait',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error display */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-rose-300/18 bg-rose-300/[0.07] p-4 text-xs leading-relaxed text-rose-100"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Generate button */}
            {originalUrl && (
              <button
                type="button"
                disabled={isGenerating || !originalFile}
                onClick={handleGenerate}
                className="inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-cyan-950/20 whitespace-nowrap"
              >
                <Sparkles className="h-4.5 w-4.5 shrink-0" />
                <span>Generate My Leader Portrait</span>
              </button>
            )}
          </div>
        )}

        {/* ===================== STATE: GENERATING ===================== */}
        {uiState === 'generating' && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center space-y-6">
            {/* Spinner */}
            <div className="relative h-20 w-20 shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-[#2997ff]/15 border-t-[#2997ff] animate-spin" />
              <div className="absolute inset-3 rounded-full border border-[#2997ff]/8 border-t-[#2997ff]/40 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-[#2997ff] animate-pulse" />
              </div>
            </div>

            <div>
              <p className="text-lg font-black text-white">Generating your portrait…</p>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[#778090]">
                The AI is calibrating your portrait to the official True Legacy studio standard.
                This usually takes 20–40 seconds.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm space-y-2">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#2997ff] transition-all duration-700"
                  style={{ width: `${Math.max(8, generationPercent)}%` }}
                />
              </div>
              {generationStage && (
                <p className="text-[11px] text-[#5d6673] leading-relaxed">{generationStage}</p>
              )}
              {attemptCount > 0 && (
                <p className="text-[11px] font-semibold text-amber-400">
                  Auto-refining result (attempt {attemptCount + 1} of 3)…
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                abortRef.current?.abort()
                setIsGenerating(false)
                setUiState('upload')
                setStatus(originalFile ? 'photo_uploaded' : 'not_uploaded')
              }}
              className="text-xs text-[#5d6673] hover:text-white underline transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ===================== STATE: REVIEW ===================== */}
        {uiState === 'review' && (
          <div className="space-y-5">
            {/* Side-by-side portrait comparison */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Left: Original photo */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/8">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#6b7480]">
                    Your Photo
                  </span>
                  <span className="text-[11px] text-[#4d5560]">Identity source</span>
                </div>
                <div className="mt-3 aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/8 bg-black/60">
                  <img
                    src={originalUrl}
                    alt="Original uploaded photo"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Right: Generated portrait */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/8">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-white">
                      True Legacy Portrait
                    </span>
                  </div>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approved
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#2997ff] font-semibold">Ready for review</span>
                  )}
                </div>

                <div className="relative mt-3 aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/12 bg-black shadow-xl">
                  {/* Studio background layers */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#181c27] via-[#10141e] to-[#070910]" />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 28%, rgba(240,242,248,0.16) 0%, rgba(200,215,235,0.07) 30%, transparent 65%)',
                    }}
                  />

                  {/* Portrait image */}
                  <img
                    src={generatedUrl}
                    alt="True Legacy standardized leader portrait"
                    className="relative z-10 h-full w-full object-cover object-top"
                  />

                  {/* Directory standard badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/80 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#2997ff] backdrop-blur-md">
                    <BadgeCheck className="h-3 w-3" />
                    Directory Standard
                  </div>

                  {/* Validation check badges */}
                  {validationNotes.length > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex flex-wrap gap-1">
                      {validationNotes.slice(0, 2).map((note) => (
                        <span
                          key={note}
                          className="inline-flex items-center gap-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 backdrop-blur-md"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {note}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Approved overlay */}
                  {isApproved && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl border-2 border-emerald-400/50 bg-emerald-400/[0.06]">
                      <div className="rounded-full border border-emerald-400/30 bg-black/80 px-4 py-2 text-xs font-black text-emerald-300 backdrop-blur-md flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Portrait Approved
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Action buttons ── */}
            <div className="space-y-2.5 pt-1">
              {!isApproved ? (
                <>
                  {/* Primary: Use This Portrait */}
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99] shadow-lg shadow-cyan-950/15 whitespace-nowrap"
                  >
                    <UserCheck className="h-4.5 w-4.5 shrink-0" />
                    <span className="whitespace-nowrap">Use This Portrait</span>
                  </button>

                  {/* Secondary: Generate Again */}
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGenerate}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-bold text-white hover:bg-white/8 active:scale-[0.99] transition whitespace-nowrap"
                  >
                    <RefreshCw className="h-4 w-4 shrink-0 text-[#2997ff]" />
                    <span className="whitespace-nowrap">Generate Again</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Approved state: Download */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 active:scale-[0.99] whitespace-nowrap"
                  >
                    <Download className="h-4.5 w-4.5 shrink-0" />
                    <span className="whitespace-nowrap">Download Your Portrait</span>
                  </button>

                  {/* Change mind */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsApproved(false)
                      setApprovedUrl('')
                      setStatus('ready_for_review')
                    }}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-transparent px-5 py-2.5 text-xs font-bold text-[#8d939e] hover:text-white hover:border-white/25 transition whitespace-nowrap"
                  >
                    Review Portrait Again
                  </button>
                </>
              )}

              {/* Tertiary text links */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#6b7480] hover:text-white underline transition text-left"
                >
                  Upload Different Photo
                </button>
                <button
                  type="button"
                  onClick={() => customUploadRef.current?.click()}
                  className="text-xs text-[#2997ff] hover:underline transition text-right"
                >
                  Upload Custom Portrait
                </button>
              </div>
            </div>

            {/* Provider disclosure (canvas mode only) */}
            {providerStatus.quality === 'preview' && (
              <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3.5 text-xs leading-relaxed text-amber-200/80">
                <strong className="text-amber-300">Preview mode:</strong> Sign in is required.
                This portrait was generated using in-browser compositing and may not fully match the
                True Legacy studio standard. Sign in to use the private cutout and standardized
                studio background service.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
        aria-label="Upload new photo"
      />
      <input
        ref={customUploadRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleCustomUpload}
        className="hidden"
        aria-label="Upload custom approved portrait"
      />
    </section>
  )
}
