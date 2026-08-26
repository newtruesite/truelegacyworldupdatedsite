/**
 * True Legacy Portrait Standard Engine — AI Generation Service
 *
 * Provider hierarchy:
 *   1. OpenAI gpt-image-1 edit (multi-reference, identity-preserved portrait edit)
 *   2. In-browser canvas composite (fallback / preview only — clearly labeled)
 *
 * Auto-retry: Up to MAX_AUTO_RETRY_ATTEMPTS attempts, validating after each.
 * Only returns a result once it passes all quality checks.
 */

import { removeBackground } from '@imgly/background-removal'
import {
  TRUE_LEGACY_LEADER_PORTRAIT_PROMPT,
  ACTIVE_STYLE_REFERENCES,
  PORTRAIT_ASPECT_RATIO,
  MAX_AUTO_RETRY_ATTEMPTS,
  AUTO_RETRY_FAILURE_REASONS,
  validateGeneratedPortrait,
  type LeaderPortraitStatus,
  type QualityValidationResult,
  type PortraitStyleReference,
} from '@/config/portraitStandard'

// ---------------------------------------------------------------------------
// PUBLIC TYPES
// ---------------------------------------------------------------------------

export type PortraitProviderCapability =
  | 'openai_image_edit'   // Full reference-guided identity edit (best)
  | 'canvas_fallback'     // In-browser compositing (preview only)

export interface GeneratePortraitOptions {
  sourceImage: File | Blob | string
  styleReferences?: PortraitStyleReference[]
  prompt?: string
  onProgress?: (stageText: string, percent: number) => void
  signal?: AbortSignal
}

export interface PortraitGenerationResult {
  success: boolean
  portraitUrl: string
  blob?: Blob
  promptUsed: string
  provider: PortraitProviderCapability
  attemptCount: number
  generationTimestamp: string
  status: LeaderPortraitStatus
  validationNotes?: string[]
  error?: string
}

// ---------------------------------------------------------------------------
// MAIN PUBLIC FUNCTION: Generate with auto-retry
// ---------------------------------------------------------------------------

/**
 * Generates a True Legacy standardized portrait with automatic retry on validation failure.
 * Returns only once the portrait passes quality validation, or after max retries.
 */
export async function generateLeaderPortraitAI(
  options: GeneratePortraitOptions
): Promise<PortraitGenerationResult> {
  const {
    sourceImage,
    styleReferences = ACTIVE_STYLE_REFERENCES,
    prompt = TRUE_LEGACY_LEADER_PORTRAIT_PROMPT,
    onProgress,
    signal,
  } = options

  const report = (stage: string, pct: number) => onProgress?.(stage, pct)

  let lastResult: PortraitGenerationResult | null = null
  let lastValidation: QualityValidationResult | null = null

  for (let attempt = 1; attempt <= MAX_AUTO_RETRY_ATTEMPTS; attempt++) {
    if (signal?.aborted) {
      throw new Error('Generation cancelled.')
    }

    const isRetry = attempt > 1
    const basePercent = isRetry ? 10 : 0

    if (isRetry) {
      report(
        `Auto-retrying (attempt ${attempt} of ${MAX_AUTO_RETRY_ATTEMPTS})…`,
        5
      )
      await delay(400, signal)
    }

    // Determine provider
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined

    if (openaiApiKey) {
      lastResult = await generateWithOpenAI({
        sourceImage,
        styleReferences,
        prompt,
        apiKey: openaiApiKey,
        attempt,
        maxAttempts: MAX_AUTO_RETRY_ATTEMPTS,
        onProgress: (stage, pct) => report(stage, basePercent + pct * 0.85),
        signal,
      })
    } else {
      lastResult = await generateWithCanvasFallback({
        sourceImage,
        prompt,
        attempt,
        maxAttempts: MAX_AUTO_RETRY_ATTEMPTS,
        onProgress: (stage, pct) => report(stage, basePercent + pct * 0.85),
        signal,
      })
    }

    if (!lastResult.success) {
      // Non-retriable failure (abort, file error, API auth)
      return lastResult
    }

    // Validate output
    report('Verifying portrait against True Legacy directory standards…', 90)
    lastValidation = await validateGeneratedPortrait(lastResult.blob || lastResult.portraitUrl)

    if (lastValidation.valid) {
      report('Portrait ready for review.', 100)
      return {
        ...lastResult,
        attemptCount: attempt,
        status: 'ready_for_review',
        validationNotes: lastValidation.notes,
      }
    }

    // Check if this failure type warrants a retry
    const shouldRetry = lastValidation.failureReason
      ? (AUTO_RETRY_FAILURE_REASONS as readonly string[]).includes(lastValidation.failureReason)
      : true

    if (!shouldRetry || attempt >= MAX_AUTO_RETRY_ATTEMPTS) {
      break
    }

    report(`Quality check failed (${lastValidation.failureReason}) — retrying…`, 95)
  }

  // All attempts failed — return last result with failure status
  return {
    success: false,
    portraitUrl: lastResult?.portraitUrl ?? '',
    blob: lastResult?.blob,
    promptUsed: prompt,
    provider: lastResult?.provider ?? 'canvas_fallback',
    attemptCount: MAX_AUTO_RETRY_ATTEMPTS,
    generationTimestamp: new Date().toISOString(),
    status: 'generation_failed',
    error:
      lastValidation?.error ??
      "We couldn't create a portrait that meets the True Legacy standard from this photo. Try uploading another clear photo.",
  }
}

// ---------------------------------------------------------------------------
// PROVIDER: OpenAI gpt-image-1 image edit
// ---------------------------------------------------------------------------

interface OpenAIGenerateArgs {
  sourceImage: File | Blob | string
  styleReferences: PortraitStyleReference[]
  prompt: string
  apiKey: string
  attempt: number
  maxAttempts: number
  onProgress: (stage: string, pct: number) => void
  signal?: AbortSignal
}

async function generateWithOpenAI(args: OpenAIGenerateArgs): Promise<PortraitGenerationResult> {
  const { sourceImage, prompt, apiKey, attempt, maxAttempts, onProgress, signal } = args

  onProgress(
    attempt === 1
      ? 'Connecting to True Legacy Portrait Studio AI…'
      : `Regenerating portrait (attempt ${attempt} of ${maxAttempts})…`,
    10
  )

  try {
    // Convert source to PNG Blob for the OpenAI API
    const sourceBlob = await toBlob(sourceImage)
    const sourceFile = new File([sourceBlob], 'portrait-source.png', { type: 'image/png' })

    onProgress('Uploading identity source and applying studio standard…', 35)

    // Build multipart form for gpt-image-1 edits endpoint
    const form = new FormData()
    form.append('model', 'gpt-image-1')
    form.append('image[]', sourceFile, 'portrait-source.png')

    // Attach up to 3 active style reference images as additional inputs
    // OpenAI image edit supports multiple image[] inputs
    const refsToAttach = ACTIVE_STYLE_REFERENCES.slice(0, 3)
    for (const ref of refsToAttach) {
      try {
        const refBlob = await fetchUrlAsBlob(ref.url)
        const refFile = new File([refBlob], `${ref.id}.png`, { type: 'image/png' })
        form.append('image[]', refFile, `${ref.id}.png`)
      } catch {
        console.warn(`Could not attach style reference ${ref.name} — skipping.`)
      }
    }

    form.append('prompt', prompt)
    form.append('n', '1')
    form.append('size', PORTRAIT_ASPECT_RATIO) // '1024x1536' — portrait orientation
    form.append('quality', 'high')

    onProgress('AI is reconstructing your studio portrait…', 55)

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
      signal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      let userMessage = 'The AI portrait service is temporarily unavailable. Please try again shortly.'

      if (response.status === 401) {
        userMessage = 'OpenAI API key is invalid or expired. Please check your VITE_OPENAI_API_KEY setting.'
      } else if (response.status === 429) {
        userMessage = 'AI service rate limit reached. Please wait a moment and try again.'
      } else if (response.status === 400) {
        userMessage = 'This photo could not be processed. Please try a different, clearer photo.'
      }

      console.error('OpenAI API error:', response.status, errorText)
      return {
        success: false,
        portraitUrl: '',
        promptUsed: prompt,
        provider: 'openai_image_edit',
        attemptCount: attempt,
        generationTimestamp: new Date().toISOString(),
        status: 'generation_failed',
        error: userMessage,
      }
    }

    onProgress('Processing AI studio output…', 80)

    const data = await response.json()
    const imageData = data?.data?.[0]

    if (!imageData) {
      throw new Error('No image data returned from OpenAI.')
    }

    let blob: Blob
    let portraitUrl: string

    if (imageData.b64_json) {
      // Base64 response — convert to Blob
      blob = base64ToBlob(imageData.b64_json, 'image/png')
      portraitUrl = URL.createObjectURL(blob)
    } else if (imageData.url) {
      // URL response — fetch as blob for local use
      blob = await fetchUrlAsBlob(imageData.url)
      portraitUrl = URL.createObjectURL(blob)
    } else {
      throw new Error('OpenAI returned an unrecognized image format.')
    }

    onProgress('Portrait generated — running quality verification…', 90)

    return {
      success: true,
      portraitUrl,
      blob,
      promptUsed: prompt,
      provider: 'openai_image_edit',
      attemptCount: attempt,
      generationTimestamp: new Date().toISOString(),
      status: 'ready_for_review',
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err

    console.error('OpenAI portrait generation error:', err)
    return {
      success: false,
      portraitUrl: '',
      promptUsed: prompt,
      provider: 'openai_image_edit',
      attemptCount: attempt,
      generationTimestamp: new Date().toISOString(),
      status: 'generation_failed',
      error:
        err instanceof Error
          ? err.message
          : "Portrait generation failed. Please try again.",
    }
  }
}

// ---------------------------------------------------------------------------
// PROVIDER: In-Browser Canvas Fallback (preview quality only)
// ---------------------------------------------------------------------------

interface CanvasFallbackArgs {
  sourceImage: File | Blob | string
  prompt: string
  attempt: number
  maxAttempts: number
  onProgress: (stage: string, pct: number) => void
  signal?: AbortSignal
}

async function generateWithCanvasFallback(
  args: CanvasFallbackArgs
): Promise<PortraitGenerationResult> {
  const { sourceImage, prompt, attempt, maxAttempts, onProgress, signal } = args

  onProgress(
    attempt === 1
      ? 'Running in-browser portrait preview (no AI API configured)…'
      : `Retrying canvas preview (attempt ${attempt} of ${maxAttempts})…`,
    20
  )

  try {
    let cutoutBlob: Blob | null = null
    try {
      cutoutBlob = await removeBackground(sourceImage, {
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.min(65, Math.round(20 + (current / total) * 45))
            onProgress('Removing background…', pct)
          }
        },
      })
    } catch {
      console.warn('Background removal failed — using original image.')
    }

    onProgress('Compositing True Legacy studio backdrop…', 75)
    await delay(150, signal)

    const source = cutoutBlob ?? sourceImage
    const blob = await renderStudioCanvas(source)

    onProgress('Canvas portrait ready (preview only — connect OpenAI for studio quality).', 100)

    return {
      success: true,
      portraitUrl: URL.createObjectURL(blob),
      blob,
      promptUsed: prompt,
      provider: 'canvas_fallback',
      attemptCount: attempt,
      generationTimestamp: new Date().toISOString(),
      status: 'ready_for_review',
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err
    return {
      success: false,
      portraitUrl: '',
      promptUsed: prompt,
      provider: 'canvas_fallback',
      attemptCount: attempt,
      generationTimestamp: new Date().toISOString(),
      status: 'generation_failed',
      error: 'Canvas portrait rendering failed. Please try again.',
    }
  }
}

// ---------------------------------------------------------------------------
// CANVAS RENDERING ENGINE
// Produces a best-effort 4:5 charcoal studio composite for preview purposes.
// ---------------------------------------------------------------------------

async function renderStudioCanvas(source: File | Blob | string): Promise<Blob> {
  const W = 768
  const H = 960 // 4:5

  return new Promise(async (resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      let blobUrl = ''
      if (typeof source === 'string') {
        img.src = source
      } else {
        blobUrl = URL.createObjectURL(source)
        img.src = blobUrl
      }

      img.onload = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)

        const canvas = document.createElement('canvas')
        canvas.width = W
        canvas.height = H
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!

        // Layer 1: Charcoal base gradient
        const bg = ctx.createLinearGradient(0, 0, 0, H)
        bg.addColorStop(0, '#181c27')
        bg.addColorStop(0.4, '#10141e')
        bg.addColorStop(0.8, '#0b0f18')
        bg.addColorStop(1, '#070910')
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, W, H)

        // Layer 2: Soft halo centered at 28% from top (head area)
        const haloX = W * 0.5
        const haloY = H * 0.28
        const halo = ctx.createRadialGradient(haloX, haloY, W * 0.04, haloX, haloY, W * 0.72)
        halo.addColorStop(0, 'rgba(240,242,248,0.18)')
        halo.addColorStop(0.28, 'rgba(210,220,238,0.10)')
        halo.addColorStop(0.58, 'rgba(180,190,215,0.04)')
        halo.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = halo
        ctx.fillRect(0, 0, W, H)

        // Layer 3: Subject placement — scale to fill frame with 4:5 crop alignment
        const sw = img.naturalWidth || img.width
        const sh = img.naturalHeight || img.height
        const srcRatio = sw / sh

        let scale: number
        let drawX: number
        let drawY: number

        if (srcRatio < 0.8) {
          // Portrait-shaped — scale to width
          scale = W / sw
        } else {
          // Square or landscape — scale to height with some headroom
          scale = (H * 0.92) / sh
        }

        const drawW = sw * scale
        const drawH = sh * scale
        drawX = (W - drawW) / 2
        drawY = Math.max(H * 0.05, (H - drawH) * 0.18)

        ctx.drawImage(img, drawX, drawY, drawW, drawH)

        // Layer 4: Bottom fade gradient
        const fade = ctx.createLinearGradient(0, H * 0.68, 0, H)
        fade.addColorStop(0, 'rgba(0,0,0,0)')
        fade.addColorStop(0.6, 'rgba(7,9,16,0.4)')
        fade.addColorStop(1, 'rgba(5,7,12,0.85)')
        ctx.fillStyle = fade
        ctx.fillRect(0, H * 0.68, W, H * 0.32)

        // Layer 5: Edge vignette
        const vig = ctx.createRadialGradient(W / 2, H * 0.46, W * 0.38, W / 2, H * 0.46, W * 0.90)
        vig.addColorStop(0, 'rgba(0,0,0,0)')
        vig.addColorStop(0.72, 'rgba(3,5,10,0.30)')
        vig.addColorStop(1, 'rgba(3,5,10,0.72)')
        ctx.fillStyle = vig
        ctx.fillRect(0, 0, W, H)

        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Canvas encoding failed.'))),
          'image/png',
          0.96
        )
      }

      img.onerror = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        reject(new Error('Could not load source image.'))
      }
    } catch (err) {
      reject(err)
    }
  })
}

// ---------------------------------------------------------------------------
// UTILITIES
// ---------------------------------------------------------------------------

async function toBlob(source: File | Blob | string): Promise<Blob> {
  if (source instanceof Blob) return source
  if (typeof source === 'string') {
    if (source.startsWith('data:')) {
      const parts = source.split(',')
      const mime = parts[0].match(/:(.*?);/)?.[1] ?? 'image/png'
      const binary = atob(parts[1])
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      return new Blob([bytes], { type: mime })
    }
    const res = await fetch(source)
    return res.blob()
  }
  return source
}

async function fetchUrlAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
  return res.blob()
}

function base64ToBlob(base64: string, mime: string): Blob {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('Aborted'))
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(new Error('Aborted')) })
  })
}

/** Returns whether an OpenAI API key is configured */
export function isOpenAIConfigured(): boolean {
  return Boolean(import.meta.env.VITE_OPENAI_API_KEY)
}

/** Returns a human-readable description of the active provider and quality level */
export function getProviderStatus(): { provider: PortraitProviderCapability; label: string; quality: 'studio' | 'preview' } {
  if (isOpenAIConfigured()) {
    return { provider: 'openai_image_edit', label: 'OpenAI gpt-image-1', quality: 'studio' }
  }
  return { provider: 'canvas_fallback', label: 'Browser Preview (no AI key)', quality: 'preview' }
}

/** Downloads a portrait blob as a PNG file */
export function downloadPortrait(blob: Blob, filename = 'true-legacy-portrait.png'): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
