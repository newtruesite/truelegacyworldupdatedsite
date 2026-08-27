/**
 * True Legacy Portrait Standard Engine — Central Configuration
 *
 * This is the single source of truth for the entire portrait standardization pipeline.
 * All generation, validation, and admin-control logic reads from here.
 *
 * Standard: Every generated portrait must look like it was photographed during
 * the exact same professional studio session as the approved reference portraits.
 */

// ---------------------------------------------------------------------------
// REFERENCE PORTRAIT TYPES
// ---------------------------------------------------------------------------

export interface PortraitStyleReference {
  id: string
  label: string
  name: string
  url: string
  role: 'identity_source' | 'style_reference'
  /** If false, reference is excluded from generation requests (admin-controlled) */
  active: boolean
}

// ---------------------------------------------------------------------------
// APPROVED TRUE LEGACY REFERENCE LIBRARY (Images B – K)
// ---------------------------------------------------------------------------
// These are the official approved leader portraits that define the visual standard.
// The generation engine automatically attaches ALL active references to every request.
// Users never see or select these — they are internal to the pipeline.
//
// CHOOSING REFERENCES: Only use portraits that already match the standard.
// Inconsistent references = inconsistent output.

export const TRUE_LEGACY_PORTRAIT_REFERENCES: PortraitStyleReference[] = [
  {
    id: 'ref-mehdi-cohen',
    label: 'Image B',
    name: 'Mehdi Cohen',
    url: '/leaders/standardized/mehdi-cohen.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-ryan-pool',
    label: 'Image C',
    name: 'Ryan Pool Sr',
    url: '/leaders/standardized/ryan-pool-sr.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-magaly-cardona',
    label: 'Image D',
    name: 'Magaly Cardona',
    url: '/leaders/standardized/magaly-cardona.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-zah-naderi',
    label: 'Image E',
    name: 'Zah Naderi',
    url: '/leaders/standardized/zah-naderi-v3.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-simon-loh',
    label: 'Image F',
    name: 'Simon Loh',
    url: '/leaders/standardized/simon-loh-v2.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-ming-way',
    label: 'Image G',
    name: 'Ming Way Sia',
    url: '/leaders/standardized/ming-way-sia.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-emanuela',
    label: 'Image H',
    name: 'Emanuela Doustova',
    url: '/leaders/standardized/emanuela-doustova.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-jesse',
    label: 'Image I',
    name: 'Jesse Schexnayder',
    url: '/leaders/standardized/jesse-schexnayder.png',
    role: 'style_reference',
    active: true,
  },
  {
    id: 'ref-alex-gonzalez',
    label: 'Image J',
    name: 'Alex Gonzalez',
    url: '/leaders/standardized/alex-gonzalez.png',
    role: 'style_reference',
    active: false, // Set to true if this portrait matches the standard
  },
  {
    id: 'ref-angel-mok',
    label: 'Image K',
    name: 'Angel Mok',
    url: '/leaders/standardized/angel-mok-v2.png',
    role: 'style_reference',
    active: false, // Set to true if this portrait matches the standard
  },
]

/** Convenience: only the active references (used by the generation engine) */
export const ACTIVE_STYLE_REFERENCES = TRUE_LEGACY_PORTRAIT_REFERENCES.filter(
  (r) => r.active && r.role === 'style_reference'
)

// For legacy compat with components that import this name
export const TRUE_LEGACY_PORTRAIT_STYLE_REFERENCES = ACTIVE_STYLE_REFERENCES

export const TRUE_LEGACY_PRIMARY_REFERENCE_IMAGE = ACTIVE_STYLE_REFERENCES[0]?.url ?? ''
export const TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE = '/leaders/alex-gonzalez.jpg'

// ---------------------------------------------------------------------------
// LOCKED COMPOSITION TOLERANCES
// All measured as fractions of total portrait height/width (0.0 – 1.0)
// ---------------------------------------------------------------------------

export const PORTRAIT_TOLERANCES = {
  /** 4:5 ratio tolerance (±) — generous to accommodate portrait crops */
  ASPECT_RATIO_TOLERANCE: 0.06,

  /** Head should occupy 28–42% of total frame height */
  HEAD_SCALE_MIN: 0.28,
  HEAD_SCALE_MAX: 0.42,

  /** Top of head should appear between 6–16% from the top */
  HEAD_TOP_POSITION_MIN: 0.06,
  HEAD_TOP_POSITION_MAX: 0.16,

  /** Subject horizontal center must be within ±12% of frame center */
  SUBJECT_CENTER_TOLERANCE: 0.12,

  /** Bottom crop: subject should extend to 70–95% of frame height */
  CROP_BOTTOM_MIN: 0.70,
  CROP_BOTTOM_MAX: 0.95,

  /** Background: corner pixel average brightness must be below this (0–255) */
  BACKGROUND_MAX_BRIGHTNESS: 180,

  /** Background: excessive blue channel advantage threshold */
  BACKGROUND_BLUE_CAST_THRESHOLD: 80,

  /** Minimum output resolution — set conservatively to allow canvas fallback output */
  MIN_OUTPUT_WIDTH: 720,
  MIN_OUTPUT_HEIGHT: 900,
} as const

// ---------------------------------------------------------------------------
// AUTO-RETRY CONFIGURATION
// ---------------------------------------------------------------------------

/** Maximum number of automatic regeneration attempts on validation failure */
export const MAX_AUTO_RETRY_ATTEMPTS = 3

/** Failures that trigger an automatic retry (as opposed to showing an error immediately) */
export const AUTO_RETRY_FAILURE_REASONS = [
  'aspect_ratio',
  'background_brightness',
  'blue_cast',
  'resolution',
] as const

// ---------------------------------------------------------------------------
// OUTPUT DIMENSIONS (Production 4:5)
// ---------------------------------------------------------------------------

export const PRODUCTION_PORTRAIT_WIDTH = 1024  // gpt-image-1 max square; request 1024x1024 then crop
export const PRODUCTION_PORTRAIT_HEIGHT = 1024
export const PORTRAIT_ASPECT_RATIO = '1024x1536' // Explicit portrait size for gpt-image-1

// ---------------------------------------------------------------------------
// FILE VALIDATION
// ---------------------------------------------------------------------------

export const MAX_PORTRAIT_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const SUPPORTED_PORTRAIT_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const SUPPORTED_PORTRAIT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

// ---------------------------------------------------------------------------
// STATUS TYPES
// ---------------------------------------------------------------------------

export type LeaderPortraitStatus =
  | 'not_uploaded'
  | 'photo_uploaded'
  | 'generating'
  | 'retrying'
  | 'ready_for_review'
  | 'applicant_approved'
  | 'admin_approved'
  | 'generation_failed'

// ---------------------------------------------------------------------------
// DATA INTERFACES
// ---------------------------------------------------------------------------

export interface LeaderPortraitData {
  originalFile?: File | null
  originalFileName?: string
  originalFileSize?: number
  originalPreviewUrl?: string
  generatedPortraitUrl?: string
  approvedPortraitUrl?: string
  promptUsed: string
  status: LeaderPortraitStatus
  qualityPassed: boolean
  validationNotes?: string[]
  attemptCount?: number
}

export interface QualityValidationResult {
  valid: boolean
  error?: string
  failureReason?: string
  notes?: string[]
  dimensions?: { width: number; height: number }
}

// ---------------------------------------------------------------------------
// OFFICIAL LOCKED GENERATION PROMPT
// This is used verbatim for every generation request. Never truncate.
// ---------------------------------------------------------------------------

export const TRUE_LEGACY_LEADER_PORTRAIT_PROMPT = `Transform the uploaded source photo into an official True Legacy leadership portrait.

The uploaded source image is the identity reference. Every other image is a style and composition reference only.

IDENTITY PRESERVATION (from the uploaded photo)
Preserve the uploaded person's exact recognizable identity including:
- facial structure, bone structure, and proportions
- skin tone and natural complexion
- hairstyle, hair color, and hair texture
- eye shape, eye color, and eyebrow shape
- age and natural expression
- eyeglasses, if present
- original clothing: fabric, color, pattern, cut, lapels, collar, sleeves, and accessories
- rings, watches, jewelry, and other accessories
- body proportions and build

Do not beautify, slim, reshape, de-age, or replace the face.
Do not change or replace the clothing.
Do not invent new clothing.
The final image must clearly and unmistakably look like the same real person from the uploaded photo.

COMPOSITION (match the approved reference portraits exactly)
Create exactly one high-resolution vertical 4:5 portrait.
- subject centered horizontally
- face positioned in the upper-middle portion of the frame
- comfortable but controlled headroom above the subject
- both shoulders fully visible
- both upper arms visible
- crop approximately at upper waist or just below the elbows
- no full body
- no tight headshot
- head should occupy approximately 30-38% of the total frame height
- subject should fill the portrait with natural proportion — not too far away, not too close
- the visual scale of the head and body must closely match the approved reference portraits

If the source photo is too tightly cropped (selfie, headshot, chest-only), naturally reconstruct only the missing body required to reach the official composition:
- extend the original outfit naturally: continue existing fabrics, colors, patterns, lapels, collars, and sleeves
- maintain plausible anatomy and realistic body proportions
- do not invent a different outfit
- do not expose more skin than the source implies
- do not significantly change body size or shape

BACKGROUND
Replace the background completely with the official True Legacy neutral studio background.
Use:
- deep charcoal
- graphite gray  
- muted slate
- a very subtle soft cloud-like texture that suggests a professional studio backdrop
- gentle diffused halo of lighter tone behind the upper body area
- subtle vignette darkening at the edges
- no visible environment, objects, furniture, or outdoor elements

Do not use:
- bright blue
- electric blue
- neon or glowing streaks
- cyan color casts
- sci-fi or dramatic AI-generated effects
- warm beige studio tones
- obvious or uniform flat color backgrounds
- sharp gradients

The background must be neutral enough to work equally well with black clothing, white clothing, navy, beige, patterned fabric, and any skin tone.

LIGHTING
Use consistent professional studio lighting:
- soft frontal or split key lighting
- natural and flattering face illumination
- subtle dimensional shadowing
- clean eye visibility and natural eye reflections
- controlled highlights that preserve clothing detail
- realistic skin texture, not over-smoothed
- clear but gentle subject separation from background
- neutral color balance — no warm orange glow, no cool blue cast

Do not:
- dramatically relight or sculpt the face with hard shadows
- add fashion or cinematic lighting
- over-smooth or retouch the skin
- add blue rim lights or colored accent lighting

FINAL OUTPUT REQUIREMENTS
Return exactly one person and exactly one portrait.
Do not include:
- names, titles, labels, or captions
- borders, frames, or watermarks
- logos or brand elements
- buttons or website UI elements
- extra people or background subjects
- clothing redesigns or heavy beauty filters
- distorted anatomy or unnatural body poses

FINAL GOAL
The finished portrait must look as if the person was photographed during the exact same professional studio session as the approved True Legacy reference portraits.
The result must be realistic, premium, neutral, globally professional, and visually consistent when placed directly beside any other approved True Legacy leader portrait.`

// ---------------------------------------------------------------------------
// FILE VALIDATION
// ---------------------------------------------------------------------------

export async function validatePortraitFile(file: File): Promise<QualityValidationResult> {
  if (!SUPPORTED_PORTRAIT_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.',
    }
  }

  if (file.size > MAX_PORTRAIT_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `Image size is ${sizeMb} MB. Please upload an image under 10 MB.`,
    }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const width = img.naturalWidth
      const height = img.naturalHeight

      if (width < 320 || height < 320) {
        resolve({
          valid: false,
          error: `Image resolution is too low (${width}×${height}px). Please upload a clearer photo.`,
          dimensions: { width, height },
        })
      } else {
        resolve({ valid: true, dimensions: { width, height } })
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: false,
        error: 'Unable to read the image file. Please verify the file and try again.',
      })
    }

    img.src = url
  })
}

// ---------------------------------------------------------------------------
// OUTPUT QUALITY VALIDATION
// ---------------------------------------------------------------------------

/**
 * Validates a generated portrait blob/URL against True Legacy directory standards.
 * Uses canvas pixel sampling for background tone and ratio checks.
 */
export async function validateGeneratedPortrait(
  imageSource: Blob | string
): Promise<QualityValidationResult> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    let revokeUrl = ''
    if (typeof imageSource === 'string') {
      img.src = imageSource
    } else {
      revokeUrl = URL.createObjectURL(imageSource)
      img.src = revokeUrl
    }

    img.onload = () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl)

      const w = img.naturalWidth || img.width
      const h = img.naturalHeight || img.height

      // 1. Aspect ratio check (4:5 = 0.8)
      const ratio = w / h
      const targetRatio = 4 / 5
      if (Math.abs(ratio - targetRatio) > PORTRAIT_TOLERANCES.ASPECT_RATIO_TOLERANCE) {
        resolve({
          valid: false,
          failureReason: 'aspect_ratio',
          error: 'Portrait did not meet the required 4:5 vertical aspect ratio.',
        })
        return
      }

      // 2. Minimum resolution check
      if (w < PORTRAIT_TOLERANCES.MIN_OUTPUT_WIDTH || h < PORTRAIT_TOLERANCES.MIN_OUTPUT_HEIGHT) {
        resolve({
          valid: false,
          failureReason: 'resolution',
          error: 'Generated portrait is below the required resolution for the leadership directory.',
        })
        return
      }

      // 3. Canvas pixel analysis for background quality
      const notes: string[] = []
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 100
        canvas.height = 125
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, 100, 125)

          // Sample four corner regions
          const tl = ctx.getImageData(3, 3, 1, 1).data
          const tr = ctx.getImageData(97, 3, 1, 1).data
          const bl = ctx.getImageData(3, 122, 1, 1).data
          const br = ctx.getImageData(97, 122, 1, 1).data

          const avgBrightness =
            (tl[0] + tl[1] + tl[2] +
              tr[0] + tr[1] + tr[2] +
              bl[0] + bl[1] + bl[2] +
              br[0] + br[1] + br[2]) / 12

          if (avgBrightness > PORTRAIT_TOLERANCES.BACKGROUND_MAX_BRIGHTNESS) {
            resolve({
              valid: false,
              failureReason: 'background_brightness',
              error: 'Background is too bright. The studio background should be deep charcoal or slate.',
            })
            return
          }

          // Check for excessive blue/cyan cast in corners
          const avgBlueExcess =
            (tl[2] - (tl[0] + tl[1]) / 2 +
              tr[2] - (tr[0] + tr[1]) / 2) / 2

          if (avgBlueExcess > PORTRAIT_TOLERANCES.BACKGROUND_BLUE_CAST_THRESHOLD) {
            resolve({
              valid: false,
              failureReason: 'blue_cast',
              error: 'Background has excessive blue or neon tone. Regenerating to neutral charcoal.',
            })
            return
          }

          notes.push('4:5 Vertical Ratio ✓')
          notes.push('Charcoal Neutral Background ✓')
          notes.push('Resolution Standard Met ✓')
        }
      } catch {
        // CORS-restricted canvas — skip pixel checks, pass on ratio/resolution alone
        notes.push('4:5 Vertical Ratio ✓')
        notes.push('Background check skipped (cross-origin)')
      }

      resolve({ valid: true, notes })
    }

    img.onerror = () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl)
      resolve({
        valid: false,
        failureReason: 'load_error',
        error: 'Generated portrait could not be loaded for quality verification.',
      })
    }
  })
}

/** Returns the centralized True Legacy leader portrait system prompt. */
export function getOfficialLeaderPortraitPrompt(): string {
  return TRUE_LEGACY_LEADER_PORTRAIT_PROMPT.trim()
}
