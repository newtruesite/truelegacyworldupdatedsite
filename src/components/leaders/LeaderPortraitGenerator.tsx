import { useState, useRef, useCallback, useEffect } from 'react'
import {
  UploadCloud,
  Sparkles,
  RotateCcw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  BadgeCheck,
  Camera,
  Info,
  FileImage,
  Layers,
  Loader2,
  RefreshCw,
  UserCheck,
} from 'lucide-react'
import {
  validatePortraitFile,
  TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE,
  type LeaderPortraitData,
  type LeaderPortraitStatus,
} from '@/config/portraitStandard'
import { generateLeaderPortraitAI } from '@/services/portraitGenerationService'

export interface LeaderPortraitGeneratorProps {
  onPortraitChange?: (portraitData: LeaderPortraitData) => void
  onApprovePortrait?: (approvedUrl: string, portraitData: LeaderPortraitData) => void
  initialPortrait?: LeaderPortraitData
  title?: string
  supportingCopy?: string
  guidanceNote?: string
  className?: string
}

export function LeaderPortraitGenerator({
  onPortraitChange,
  onApprovePortrait,
  initialPortrait,
  title = 'Leader Portrait',
  supportingCopy = 'Upload your photo and generate an official True Legacy leader portrait that matches the leadership directory standard.',
  guidanceNote = 'Your final portrait will keep your real identity, outfit, and recognizable appearance while standardizing the crop, background, lighting, and finish.',
  className = '',
}: LeaderPortraitGeneratorProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(initialPortrait?.originalFile || null)
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>(initialPortrait?.originalPreviewUrl || '')
  const [originalFileName, setOriginalFileName] = useState<string>(initialPortrait?.originalFileName || '')
  const [originalFileSize, setOriginalFileSize] = useState<number>(initialPortrait?.originalFileSize || 0)

  const [generatedPortraitUrl, setGeneratedPortraitUrl] = useState<string>(initialPortrait?.generatedPortraitUrl || '')
  const [approvedPortraitUrl, setApprovedPortraitUrl] = useState<string>(initialPortrait?.approvedPortraitUrl || '')
  const [status, setStatus] = useState<LeaderPortraitStatus>(initialPortrait?.status || 'not_uploaded')

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationNotes, setValidationNotes] = useState<string[]>(initialPortrait?.validationNotes || [])
  const [isDragging, setIsDragging] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStage, setGenerationStage] = useState<string>('')
  const [qualityPassed, setQualityPassed] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const generatedFileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Notify parent component of portrait state changes
  const notifyParent = useCallback(
    (updatedState: Partial<LeaderPortraitData>) => {
      if (!onPortraitChange) return
      const currentData: LeaderPortraitData = {
        originalFile,
        originalFileName,
        originalFileSize,
        originalPreviewUrl,
        generatedPortraitUrl,
        approvedPortraitUrl,
        promptUsed: '',
        status,
        qualityPassed,
        validationNotes,
        ...updatedState,
      }
      onPortraitChange(currentData)
    },
    [
      onPortraitChange,
      originalFile,
      originalFileName,
      originalFileSize,
      originalPreviewUrl,
      generatedPortraitUrl,
      approvedPortraitUrl,
      status,
      qualityPassed,
      validationNotes,
    ]
  )

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalPreviewUrl && originalPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(originalPreviewUrl)
      }
      if (generatedPortraitUrl && generatedPortraitUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedPortraitUrl)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [originalPreviewUrl, generatedPortraitUrl])

  // Handle uploaded original image file
  const handleProcessFile = async (file: File) => {
    setErrorMessage('')
    setIsValidating(true)

    try {
      const validation = await validatePortraitFile(file)
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid image file.')
        setIsValidating(false)
        return
      }

      if (originalPreviewUrl && originalPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(originalPreviewUrl)
      }

      const previewUrl = URL.createObjectURL(file)
      setOriginalFile(file)
      setOriginalPreviewUrl(previewUrl)
      setOriginalFileName(file.name)
      setOriginalFileSize(file.size)
      setQualityPassed(true)
      setImageDimensions(validation.dimensions || null)
      setStatus('photo_uploaded')
      setGeneratedPortraitUrl('')
      setApprovedPortraitUrl('')
      setValidationNotes([])

      notifyParent({
        originalFile: file,
        originalFileName: file.name,
        originalFileSize: file.size,
        originalPreviewUrl: previewUrl,
        generatedPortraitUrl: '',
        approvedPortraitUrl: '',
        status: 'photo_uploaded',
        qualityPassed: true,
        validationNotes: [],
      })
    } catch {
      setErrorMessage('Failed to read and validate the uploaded photo. Please try another image.')
    } finally {
      setIsValidating(false)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleProcessFile(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      handleProcessFile(file)
    }
  }

  // Load sample reference photo for quick testing
  const handleLoadSamplePhoto = async () => {
    setErrorMessage('')
    setIsValidating(true)
    try {
      const sampleUrl = TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE
      const response = await fetch(sampleUrl)
      const blob = await response.blob()
      const sampleFile = new File([blob], 'leader-reference-sample.jpg', { type: 'image/jpeg' })
      await handleProcessFile(sampleFile)
    } catch {
      setOriginalPreviewUrl(TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE)
      setOriginalFileName('leader-reference-sample.jpg')
      setOriginalFileSize(60841)
      setQualityPassed(true)
      setImageDimensions({ width: 600, height: 750 })
      setStatus('photo_uploaded')
      notifyParent({
        originalFileName: 'leader-reference-sample.jpg',
        originalFileSize: 60841,
        originalPreviewUrl: TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE,
        status: 'photo_uploaded',
        qualityPassed: true,
      })
    } finally {
      setIsValidating(false)
    }
  }

  // Handle removing the photo
  const handleRemovePhoto = () => {
    if (originalPreviewUrl && originalPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(originalPreviewUrl)
    }
    if (generatedPortraitUrl && generatedPortraitUrl.startsWith('blob:')) {
      URL.revokeObjectURL(generatedPortraitUrl)
    }

    setOriginalFile(null)
    setOriginalPreviewUrl('')
    setOriginalFileName('')
    setOriginalFileSize(0)
    setGeneratedPortraitUrl('')
    setApprovedPortraitUrl('')
    setStatus('not_uploaded')
    setErrorMessage('')
    setValidationNotes([])
    setQualityPassed(false)
    setImageDimensions(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    notifyParent({
      originalFile: null,
      originalFileName: '',
      originalFileSize: 0,
      originalPreviewUrl: '',
      generatedPortraitUrl: '',
      approvedPortraitUrl: '',
      status: 'not_uploaded',
      qualityPassed: false,
      validationNotes: [],
    })
  }

  // Direct AI Generation workflow with automatic reference attachment & auto-retry
  const handleGenerateAIPortrait = async () => {
    if (isGenerating || (!originalFile && !originalPreviewUrl)) return
    setIsGenerating(true)
    setStatus('generating')
    setErrorMessage('')
    setGenerationStage('Attaching approved True Legacy portrait references & analyzing source photo...')

    const source = originalFile || originalPreviewUrl
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const result = await generateLeaderPortraitAI({
        sourceImage: source,
        onProgress: (stage) => {
          setGenerationStage(stage)
        },
        signal: controller.signal,
      })

      if (result.success && result.portraitUrl) {
        setGeneratedPortraitUrl(result.portraitUrl)
        setStatus('ready_for_review')
        setValidationNotes(result.validationNotes || [])
        notifyParent({
          generatedPortraitUrl: result.portraitUrl,
          status: 'ready_for_review',
          validationNotes: result.validationNotes,
        })
      } else {
        setStatus('generation_failed')
        setErrorMessage(
          result.error ||
            "We couldn't create a portrait that meets the True Legacy standard from this photo. Try uploading another clear photo."
        )
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setStatus('generation_failed')
      setErrorMessage(
        "We couldn't create a portrait that meets the True Legacy standard from this photo. Try uploading another clear photo."
      )
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }

  // Handle uploading custom approved portrait manually if desired
  const handleGeneratedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (generatedPortraitUrl && generatedPortraitUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedPortraitUrl)
      }
      const preview = URL.createObjectURL(file)
      setGeneratedPortraitUrl(preview)
      setStatus('ready_for_review')
      notifyParent({
        generatedPortraitUrl: preview,
        status: 'ready_for_review',
      })
    }
  }

  // Approve / Use This Portrait handler
  const handleApprovePortrait = (portraitUrlToUse: string) => {
    setApprovedPortraitUrl(portraitUrlToUse)
    const newStatus: LeaderPortraitStatus = 'applicant_approved'
    setStatus(newStatus)
    const updatedData: LeaderPortraitData = {
      originalFile,
      originalFileName,
      originalFileSize,
      originalPreviewUrl,
      generatedPortraitUrl,
      approvedPortraitUrl: portraitUrlToUse,
      promptUsed: '',
      status: newStatus,
      qualityPassed,
      validationNotes,
    }
    notifyParent(updatedData)
    if (onApprovePortrait) {
      onApprovePortrait(portraitUrlToUse, updatedData)
    }
  }

  // Format file size helper
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  // Status badge mapping
  const renderStatusBadge = () => {
    switch (status) {
      case 'applicant_approved':
      case 'admin_approved':
        return (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shrink-0">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="whitespace-nowrap">Portrait Approved</span>
          </div>
        )
      case 'ready_for_review':
        return (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#2997ff]/30 bg-[#2997ff]/10 px-3.5 py-1.5 text-xs font-bold text-[#2997ff] shrink-0">
            <Sparkles className="h-4 w-4 shrink-0 text-[#2997ff]" />
            <span className="whitespace-nowrap">Ready for Review</span>
          </div>
        )
      case 'generating':
        return (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 shrink-0">
            <Loader2 className="h-4 w-4 animate-spin shrink-0 text-amber-400" />
            <span className="whitespace-nowrap">Generating Portrait</span>
          </div>
        )
      case 'photo_uploaded':
        return (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white shrink-0">
            <BadgeCheck className="h-4 w-4 shrink-0 text-[#2997ff]" />
            <span className="whitespace-nowrap">Photo Uploaded</span>
          </div>
        )
      case 'generation_failed':
        return (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-rose-400/30 bg-rose-400/10 px-3.5 py-1.5 text-xs font-bold text-rose-300 shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span className="whitespace-nowrap">Generation Failed</span>
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-[#868c98] shrink-0">
            <Camera className="h-4 w-4 shrink-0 text-[#868c98]" />
            <span className="whitespace-nowrap">No Photo Uploaded</span>
          </div>
        )
    }
  }

  return (
    <section
      className={`w-full max-w-full min-w-0 box-border overflow-x-clip rounded-[28px] sm:rounded-[32px] border border-white/10 bg-[#090d16]/95 p-4 sm:p-7 md:p-8 backdrop-blur-xl shadow-2xl ${className}`}
      aria-labelledby="leader-portrait-title"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2997ff]">
            <Camera className="h-4 w-4 shrink-0 text-[#2997ff]" />
            <span className="truncate">Official Portrait Standardization</span>
          </div>
          <h2 id="leader-portrait-title" className="mt-2 text-xl sm:text-2xl md:text-3xl font-black text-white break-words">
            {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#aeb4c0] max-w-2xl">
            {supportingCopy}
          </p>
        </div>

        {/* Dynamic Status Badge */}
        {renderStatusBadge()}
      </div>

      {/* Explanatory Note */}
      <div className="mt-5 min-w-0">
        <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3.5 sm:p-4 text-xs leading-relaxed text-[#8f96a3] min-w-0">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2997ff]" />
          <span className="min-w-0">
            <strong className="text-white">Directory Quality Guarantee:</strong> {guidanceNote}
          </span>
        </div>
      </div>

      {/* Main Upload / Review Area */}
      <div className="mt-6 min-w-0">
        {!originalPreviewUrl ? (
          /* ================= STEP 1: DRAG & DROP UPLOAD AREA ================= */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-10 md:p-12 text-center cursor-pointer transition-all duration-300 w-full min-w-0 box-border ${
              isDragging
                ? 'border-[#2997ff] bg-[#2997ff]/[0.08] shadow-lg shadow-[#2997ff]/10'
                : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              aria-label="Upload leader photo"
            />

            <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#2997ff] shadow-inner group-hover:scale-105 group-hover:border-[#2997ff]/40 transition-all duration-300 shrink-0">
              <UploadCloud className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-white group-hover:text-[#2997ff] transition-colors px-2">
              {isDragging ? 'Drop your photo here' : 'Upload Your Photo'}
            </h3>

            <p className="mt-1 text-xs text-[#868c98] px-2">
              Supports JPG, JPEG, PNG, or WEBP up to 10 MB
            </p>

            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:border-[#2997ff]/50 hover:bg-[#2997ff]/20 active:scale-[0.99]"
              >
                Choose Photo
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLoadSamplePhoto()
                }}
                className="inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-xs font-medium text-[#868c98] transition hover:border-white/25 hover:text-white"
              >
                Try sample photo
              </button>
            </div>

            {isValidating ? (
              <p className="mt-4 text-xs font-semibold text-[#2997ff] animate-pulse">
                Checking photo resolution and quality…
              </p>
            ) : null}
          </div>
        ) : (
          /* ================= STEP 2 & 3: ACTIVE PHOTO & AI GENERATION VIEW ================= */
          <div className="space-y-6 min-w-0">
            {/* Top File Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 text-xs min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-[#2997ff]">
                  <FileImage className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{originalFileName || 'Uploaded Photo'}</p>
                  <p className="text-[#868c98] truncate">
                    {formatFileSize(originalFileSize)}
                    {imageDimensions ? ` · ${imageDimensions.width}×${imageDimensions.height}px` : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex flex-1 sm:flex-initial min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                  <span>Replace Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 font-semibold text-rose-300 transition hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Remove</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                  aria-label="Replace photo"
                />
              </div>
            </div>

            {/* Side-by-Side on Desktop / Vertical Stack on Mobile */}
            <div className="grid gap-6 md:grid-cols-2 min-w-0 w-full">
              {/* 1. Left Card: Original Photo */}
              <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-4 min-w-0 w-full shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#aeb4c0]">
                    Original Photo
                  </span>
                  <span className="text-[11px] text-[#747b88] font-medium">Source identity</span>
                </div>

                <div className="relative mt-3 aspect-[4/5] w-full max-w-full overflow-hidden rounded-xl bg-black/60 border border-white/5 select-none">
                  <img
                    src={originalPreviewUrl}
                    alt="Uploaded candidate source"
                    className="block h-full w-full object-cover object-top"
                  />
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur-md">
                    Original Source
                  </div>
                </div>
              </div>

              {/* 2. Right Card: True Legacy Portrait */}
              <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-4 min-w-0 w-full shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Layers className="h-3.5 w-3.5 shrink-0 text-[#2997ff]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
                      True Legacy Portrait
                    </span>
                  </div>
                  <span className="text-[11px] text-[#2997ff] font-semibold shrink-0">
                    {approvedPortraitUrl
                      ? 'Portrait Approved'
                      : generatedPortraitUrl
                      ? 'Ready for Review'
                      : '4:5 Studio Standard'}
                  </span>
                </div>

                {/* 4:5 Portrait Output Studio Canvas */}
                <div className="relative mt-3 aspect-[4/5] w-full max-w-full overflow-hidden rounded-xl border border-white/15 select-none shadow-xl">
                  {/* Layer 1: Deep Neutral Charcoal / Slate Base */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#141824] via-[#0e121d] to-[#06080e]" />

                  {/* Layer 2: Soft Diffused Smoky Halo */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-90"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 32%, rgba(255, 255, 255, 0.16) 0%, rgba(210, 225, 245, 0.08) 25%, rgba(41, 151, 255, 0.03) 50%, transparent 75%)',
                    }}
                  />

                  {/* Layer 3: Subtle Studio Edge Vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(3, 5, 10, 0.70) 100%)',
                    }}
                  />

                  {/* Layer 4: Display Generated/Approved or Loading / Placeholder State */}
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-black/75 backdrop-blur-sm z-10 min-w-0">
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#2997ff]/20 border-t-[#2997ff] animate-spin" />
                        <Sparkles className="absolute h-6 w-6 text-[#2997ff] animate-pulse" />
                      </div>
                      <p className="mt-4 text-sm font-bold text-white">Generating your portrait...</p>
                      <p className="mt-1 text-xs text-[#aeb4c0]">Applying True Legacy studio standards.</p>
                      {generationStage ? (
                        <p className="mt-3 text-[11px] text-[#2997ff] max-w-[240px] leading-relaxed break-words">
                          {generationStage}
                        </p>
                      ) : null}
                    </div>
                  ) : approvedPortraitUrl || generatedPortraitUrl ? (
                    <img
                      src={approvedPortraitUrl || generatedPortraitUrl}
                      alt="True Legacy Standardized Leader Portrait"
                      className="block absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: 'center top' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center min-w-0">
                      <div className="relative h-24 w-20 sm:h-28 sm:w-24 overflow-hidden rounded-xl border border-dashed border-[#2997ff]/50 p-0.5 bg-black/40">
                        <img
                          src="/leaders/standardized/alex-gonzalez.png"
                          alt="Style Reference"
                          className="h-full w-full rounded-lg object-cover object-top opacity-50"
                        />
                      </div>
                      <p className="mt-3 text-xs font-bold text-white">
                        Standard 4:5 Studio Portrait
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#8f96a3] max-w-[220px]">
                        Charcoal studio gradient, smoky halo, upper-torso crop & balanced lighting.
                      </p>
                    </div>
                  )}

                  {/* Layer 5: Verified Directory Standard Badge */}
                  <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] font-bold uppercase tracking-wider text-[#2997ff] backdrop-blur-md shadow-lg">
                    <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#2997ff]" />
                    <span>Directory Standard</span>
                  </span>

                  {/* Bottom Vignette */}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#06080e]/90 via-[#06080e]/30 to-transparent pointer-events-none" />
                </div>

                {/* ================= PROPORTIONATE POLISHED ACTION BUTTON AREA ================= */}
                <div className="mt-4 space-y-3 min-w-0">
                  {generatedPortraitUrl && !approvedPortraitUrl ? (
                    <div className="flex flex-col space-y-2.5 min-w-0 w-full">
                      {/* Primary Full-Width CTA: Use This Portrait */}
                      <button
                        type="button"
                        onClick={() => handleApprovePortrait(generatedPortraitUrl)}
                        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99] shadow-lg shadow-cyan-950/20 whitespace-nowrap"
                      >
                        <UserCheck className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">Use This Portrait</span>
                      </button>

                      {/* Secondary Action: Generate Again */}
                      <button
                        type="button"
                        disabled={isGenerating}
                        onClick={handleGenerateAIPortrait}
                        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 active:scale-[0.99] transition whitespace-nowrap"
                      >
                        <RefreshCw className="h-4 w-4 shrink-0 text-[#2997ff]" />
                        <span className="whitespace-nowrap">Generate Again</span>
                      </button>
                    </div>
                  ) : null}

                  {approvedPortraitUrl ? (
                    <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs font-bold text-emerald-300 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>Approved as Official Leader Portrait</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setApprovedPortraitUrl('')
                            setStatus('ready_for_review')
                            notifyParent({ approvedPortraitUrl: '', status: 'ready_for_review' })
                          }}
                          className="text-[11px] underline text-emerald-300/80 hover:text-white"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Tertiary Action Links */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#8f96a3] hover:text-white underline text-left"
                    >
                      Upload Different Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => generatedFileInputRef.current?.click()}
                      className="text-[#2997ff] hover:underline text-left sm:text-right"
                    >
                      Upload Custom Approved Portrait
                    </button>
                    <input
                      ref={generatedFileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleGeneratedPhotoUpload}
                      className="hidden"
                      aria-label="Upload custom portrait"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button: Generate My Leader Portrait */}
            {!generatedPortraitUrl ? (
              <div className="pt-2 min-w-0">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAIPortrait}
                  className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-cyan-400 px-6 py-3 font-black text-sm text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-60 shadow-lg shadow-cyan-950/20 whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin shrink-0 text-slate-950" />
                      <span className="truncate">Generating your portrait...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>Generate My Leader Portrait</span>
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Validation / Error Banner */}
        {errorMessage ? (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-xl border border-rose-300/20 bg-rose-300/[0.08] p-3.5 sm:p-4 text-xs leading-relaxed text-rose-100 min-w-0"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
            <span className="break-words min-w-0">{errorMessage}</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
