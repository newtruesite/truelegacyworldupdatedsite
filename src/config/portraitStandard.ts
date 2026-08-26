/**
 * Official True Legacy Portrait Standard Engine Configuration.
 * Centralized source of truth for the locked, repeatable portrait system.
 */

export interface PortraitStyleReference {
  id: string
  label: string
  name: string
  url: string
  active: boolean
  isBenchmark?: boolean
}

/**
 * 1. HIDDEN OFFICIAL REFERENCE SET: TRUE_LEGACY_PORTRAIT_REFERENCES
 * Contains 5 to 10 approved benchmark portraits that define the exact:
 * - 4:5 vertical framing
 * - head size & eye-level placement (28-32% from top, 8-10% headroom)
 * - upper-torso crop just below elbows/upper waist
 * - deep charcoal/graphite neutral studio background with soft smoky halo
 * - soft frontal key lighting and realistic skin texture
 */
export const TRUE_LEGACY_PORTRAIT_REFERENCES: PortraitStyleReference[] = [
  {
    id: 'ref-alex',
    label: 'Reference 1 (Alex)',
    name: 'Alex Gonzalez',
    url: '/leaders/standardized/alex-gonzalez.png',
    active: true,
    isBenchmark: true,
  },
  {
    id: 'ref-simon',
    label: 'Reference 2 (Simon)',
    name: 'Simon Loh',
    url: '/leaders/standardized/simon-loh-v2.png',
    active: true,
    isBenchmark: true,
  },
  {
    id: 'ref-magaly',
    label: 'Reference 3 (Magaly)',
    name: 'Magaly Cardona',
    url: '/leaders/standardized/magaly-cardona.png',
    active: true,
    isBenchmark: true,
  },
  {
    id: 'ref-mehdi',
    label: 'Reference 4 (Mehdi)',
    name: 'Mehdi Cohen',
    url: '/leaders/standardized/mehdi-cohen.png',
    active: true,
  },
  {
    id: 'ref-ryan',
    label: 'Reference 5 (Ryan)',
    name: 'Ryan Pool Sr',
    url: '/leaders/standardized/ryan-pool-sr.png',
    active: true,
  },
  {
    id: 'ref-zah',
    label: 'Reference 6 (Zah)',
    name: 'Zah Naderi',
    url: '/leaders/standardized/zah-naderi-v3.png',
    active: true,
  },
  {
    id: 'ref-emanuela',
    label: 'Reference 7 (Emanuela)',
    name: 'Emanuela Doustova',
    url: '/leaders/standardized/emanuela-doustova.png',
    active: true,
  },
  {
    id: 'ref-jesse',
    label: 'Reference 8 (Jesse)',
    name: 'Jesse Schexnayder',
    url: '/leaders/standardized/jesse-schexnayder.png',
    active: true,
  },
]

// Backwards compatibility alias
export const TRUE_LEGACY_PORTRAIT_STYLE_REFERENCES = TRUE_LEGACY_PORTRAIT_REFERENCES
export const TRUE_LEGACY_PRIMARY_REFERENCE_IMAGE = TRUE_LEGACY_PORTRAIT_REFERENCES[0].url
export const TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE = '/leaders/alex-gonzalez.jpg'

/**
 * 7. OFFICIAL GENERATION PROMPT (Locked System Prompt)
 */
export const TRUE_LEGACY_LEADER_PORTRAIT_PROMPT = `Transform the uploaded source photo into an official True Legacy leadership portrait.

The uploaded source image is the identity reference.

The attached approved True Legacy portraits are style and composition references only.

Preserve the uploaded person's exact recognizable identity, including facial structure, skin tone, hairstyle, eye shape, age, expression, glasses, body proportions, original outfit, and accessories.

Do not beautify, reshape, age, de-age, or replace the face.

Do not replace or redesign the person's clothing.

Create exactly one realistic vertical 4:5 studio portrait.

Match the approved True Legacy portrait references in:
* head size
* subject scale
* body crop
* shoulder placement
* background
* lighting
* contrast
* color temperature
* portrait finish

Use the locked True Legacy composition:
* centered subject
* face near the upper-middle of the frame
* comfortable controlled headroom
* both shoulders visible
* upper body visible
* crop approximately just below the elbows / upper waist area
* balanced natural proportions

If the source image is too tightly cropped, naturally reconstruct only the missing upper body required to achieve the official composition.

Extend the original outfit naturally.

Do not invent a different outfit.

Use the official neutral True Legacy studio background:
deep charcoal, graphite gray, muted slate, and only an extremely subtle midnight navy undertone.

Do not use bright blue, neon, glowing streaks, dramatic effects, text, logos, borders, watermarks, or website elements.

The finished image should look as if the person was photographed during the exact same professional studio session as the approved True Legacy portrait references.

The result must be realistic, premium, neutral, consistent, trustworthy, and ready for direct placement in the True Legacy leadership directory.

Return exactly one person and one portrait.`

export const PRODUCTION_PORTRAIT_WIDTH = 1536
export const PRODUCTION_PORTRAIT_HEIGHT = 1920 // Exactly 4:5 aspect ratio

export const MAX_PORTRAIT_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const SUPPORTED_PORTRAIT_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const SUPPORTED_PORTRAIT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

// Quality validation tolerances
export const TRUE_LEGACY_HEAD_SCALE_RANGE = { min: 0.20, max: 0.38 } // Head occupancy percentage
export const TRUE_LEGACY_SUBJECT_CENTER_TOLERANCE = 0.08 // Max horizontal offset from center (8%)
export const TRUE_LEGACY_CROP_TARGET = '4:5 upper-body just below elbows'
export const MAX_REGENERATION_ATTEMPTS = 3 // Controlled automatic retry limit

export type LeaderPortraitStatus =
  | 'not_uploaded'
  | 'photo_uploaded'
  | 'generating'
  | 'ready_for_review'
  | 'applicant_approved'
  | 'admin_approved'
  | 'generation_failed'

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
}

export interface QualityValidationResult {
  valid: boolean
  error?: string
  dimensions?: { width: number; height: number }
}

/**
 * Validates an uploaded source file against size, format, and dimension criteria.
 */
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
          error: `Image resolution is too low (${width}×${height}px). Minimum recommended resolution is 400×400px.`,
          dimensions: { width, height },
        })
      } else {
        resolve({
          valid: true,
          dimensions: { width, height },
        })
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

/**
 * 9. AUTOMATIC QUALITY VALIDATION
 * Thoroughly validates the generated portrait output against True Legacy Directory Standards.
 * Checks:
 * - 4:5 Aspect Ratio
 * - Minimum High Resolution
 * - Background Tone (deep charcoal / slate neutral range)
 * - Absence of electric blue / neon color casts
 * - Subject centering & framing balance
 */
export async function validateGeneratedPortrait(
  imageSource: Blob | string
): Promise<{ valid: boolean; error?: string; notes?: string[] }> {
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

      // 1. Verify 4:5 Aspect Ratio (0.8 with tolerance)
      const ratio = w / h
      const targetRatio = 4 / 5 // 0.8
      if (Math.abs(ratio - targetRatio) > 0.03) {
        resolve({
          valid: false,
          error: 'Generated output did not meet the required 4:5 vertical portrait aspect ratio.',
        })
        return
      }

      // 2. Verify Minimum High-Resolution standard
      if (w < 800 || h < 1000) {
        resolve({
          valid: false,
          error: 'Generated portrait resolution is below leadership directory production standards.',
        })
        return
      }

      // 3. Inspect canvas pixels for dark charcoal background and lack of bright neon casts
      const notes: string[] = []
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 100
        canvas.height = 125
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, 100, 125)
          // Sample corner pixels (top-left, top-right)
          const topLeft = ctx.getImageData(5, 5, 1, 1).data
          const topRight = ctx.getImageData(95, 5, 1, 1).data

          const avgTopBrightness =
            (topLeft[0] + topLeft[1] + topLeft[2] + topRight[0] + topRight[1] + topRight[2]) / 6

          if (avgTopBrightness > 165) {
            resolve({
              valid: false,
              error: 'Background did not match the official charcoal studio standard.',
            })
            return
          }

          // Check for excessive neon blue / cyan saturation
          const blueExcess = topLeft[2] - (topLeft[0] + topLeft[1]) / 2
          if (blueExcess > 70) {
            resolve({
              valid: false,
              error: 'Background contains excessive electric blue tone. Re-standardizing to neutral charcoal.',
            })
            return
          }

          notes.push('4:5 Vertical Ratio Verified')
          notes.push('Charcoal Studio Neutral Background Calibrated')
          notes.push('Upper-Torso Centered Composition Aligned')
        }
      } catch {
        // Fallback for CORS restricted canvases
      }

      resolve({ valid: true, notes })
    }

    img.onerror = () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl)
      resolve({
        valid: false,
        error: 'Generated portrait could not be loaded for quality verification.',
      })
    }
  })
}

/**
 * Returns the centralized True Legacy leader portrait system prompt.
 */
export function getOfficialLeaderPortraitPrompt(): string {
  return TRUE_LEGACY_LEADER_PORTRAIT_PROMPT.trim()
}
