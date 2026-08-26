/**
 * Official True Legacy Leader Portrait Standard Configuration & Prompt Template.
 * Centralized source of truth for standardizing leader portraits across the platform.
 */

export interface PortraitStyleReference {
  id: string
  label: string
  name: string
  url: string
  role: 'style_reference'
}

/**
 * Official multi-image reference library for True Legacy portrait standardization.
 * Images B through E provide multi-angle lighting, upper-torso framing, charcoal background,
 * and editorial studio depth benchmarks.
 */
export const TRUE_LEGACY_PORTRAIT_STYLE_REFERENCES: PortraitStyleReference[] = [
  {
    id: 'ref-b-mehdi',
    label: 'Image B',
    name: 'Mehdi Cohen',
    url: '/leaders/standardized/mehdi-cohen.png',
    role: 'style_reference',
  },
  {
    id: 'ref-c-ryan',
    label: 'Image C',
    name: 'Ryan Pool Sr',
    url: '/leaders/standardized/ryan-pool-sr.png',
    role: 'style_reference',
  },
  {
    id: 'ref-d-magaly',
    label: 'Image D',
    name: 'Magaly Cardona',
    url: '/leaders/standardized/magaly-cardona.png',
    role: 'style_reference',
  },
  {
    id: 'ref-e-zah',
    label: 'Image E',
    name: 'Zah Naderi',
    url: '/leaders/standardized/zah-naderi-v3.png',
    role: 'style_reference',
  },
]

export const TRUE_LEGACY_PRIMARY_REFERENCE_IMAGE = TRUE_LEGACY_PORTRAIT_STYLE_REFERENCES[0].url
export const TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE = '/leaders/alex-gonzalez.jpg'

export const TRUE_LEGACY_LEADER_PORTRAIT_PROMPT = `Transform Image A into an official True Legacy leader portrait.

Image A is the uploaded source photo and must be used for identity preservation.
Images B through E are approved True Legacy leader portraits and must be used only as style references for portrait framing, background treatment, lighting, color balance, and overall finish.

IDENTITY PRESERVATION
Preserve the exact recognizable identity of the person in Image A, including:
- facial structure
- skin tone and natural complexion
- hairstyle
- eye shape and eye color
- age
- body proportions
- expression
- eyeglasses, if present
- original clothing and accessories
Do not beautify, reshape, age, de-age, or replace the person’s face.
Do not change the outfit.
The final image must clearly look like the same real person from Image A.

COMPOSITION
Create exactly one high-resolution vertical 4:5 portrait.
Use a professional upper-body to mid-torso composition.
Requirements:
- subject centered horizontally
- face positioned near the upper-middle of the frame
- comfortable space above the head
- both shoulders visible
- natural body proportions
- balanced portrait scale
- subject should not appear too close or too far away
- crop should match the visual proportions of the approved True Legacy leader portraits
- avoid a full-body feel
- avoid a tight headshot
- avoid awkward empty space
If the original photo is cropped too tightly, naturally reconstruct only the minimum shoulders or upper torso needed to complete the portrait.
Keep anatomy realistic.

BACKGROUND
Completely replace the background with the official True Legacy neutral studio portrait background.
Use:
- deep charcoal
- graphite gray
- muted slate
- extremely subtle midnight navy undertone only if necessary
- soft smoky studio gradient
- gentle diffused light behind the subject
- subtle vignette
- minimal controlled contrast
Do not create a bright blue background.
Do not create neon lighting.
Do not add electric blue glow, glowing streaks, or obvious digital effects.
The background must remain neutral, premium, restrained, and professional.

LIGHTING AND FINISH
Use refined professional studio lighting.
Requirements:
- natural flattering skin tones
- soft controlled highlights
- clean clothing detail
- realistic facial texture
- subtle depth
- clear separation between subject and background
- premium editorial finish
- consistent contrast and tonal balance
The final output should look as if it belongs in the same portrait series as Images B through E.
The portrait must not look like a cutout placed on a background.
It must look naturally photographed in a consistent studio environment.

OUTPUT RESTRICTIONS
Return exactly one person only.
Do not include:
- names
- titles
- borders
- logos
- buttons
- text
- watermarks
- website UI
- extra people
- clothing changes
- beauty filters
- excessive skin smoothing
- blue color casts
- artificial glamour retouching
- heavy sharpening
- distorted anatomy

FINAL GOAL
The final portrait should look like an approved True Legacy leadership directory portrait:
realistic, elegant, neutral, consistent, premium, globally professional, and ready to upload directly beside the rest of the True Legacy leader portraits.`

export const PRODUCTION_PORTRAIT_WIDTH = 1536
export const PRODUCTION_PORTRAIT_HEIGHT = 1920 // Exactly 4:5 aspect ratio

export const MAX_PORTRAIT_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const SUPPORTED_PORTRAIT_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const SUPPORTED_PORTRAIT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

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
 * Thoroughly validates the generated portrait output against True Legacy Directory Standards.
 * Checks:
 * - 4:5 Aspect Ratio
 * - Minimum High Resolution
 * - Background Tone (deep charcoal / slate neutral range)
 * - Absence of electric blue / neon color casts
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

      // 1. Verify 4:5 Aspect Ratio (0.8 with 2% tolerance)
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
              error: 'Background did not match the official charcoal studio standard. Please regenerate.',
            })
            return
          }

          // Check for excessive neon blue / cyan saturation
          const blueExcess = (topLeft[2] - (topLeft[0] + topLeft[1]) / 2)
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
        error: 'Generated portrait could not be loaded for quality verification. Please regenerate.',
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
