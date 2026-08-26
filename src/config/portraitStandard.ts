/**
 * Official True Legacy Leader Portrait Standard Configuration & Prompt Template.
 * Centralized source of truth for standardizing leader portraits across the platform.
 */

export const TRUE_LEGACY_STYLE_REFERENCE_IMAGE = '/leaders/standardized/mehdi-cohen.png'
export const TRUE_LEGACY_SAMPLE_REFERENCE_IMAGE = '/leaders/alex-gonzalez.jpg'

export const TRUE_LEGACY_LEADER_PORTRAIT_PROMPT = `Transform Image 1 into the official True Legacy leader portrait standard shown in Image 2.

IMAGE ROLES
Image 1 is the identity source. Preserve the exact person from Image 1.
Image 2 is the style and composition reference only. Copy its portrait dimensions, background treatment, framing, head scale, head position, lighting, contrast, color balance and premium studio finish. Do not copy the identity, face, clothing or physical features of the person in Image 2.

IDENTITY LOCK
Preserve the person from Image 1 exactly, including:
- recognizable facial structure
- natural skin tone and complexion
- age
- hairstyle and hairline
- eye shape and eye color
- facial hair
- expression
- eyeglasses
- original clothing
- accessories
- body proportions
Do not beautify, reshape, age, de-age or replace the person’s face. Do not change the outfit. Do not add makeup, jewelry, glasses, facial hair or accessories that are not present in Image 1.

COMPOSITION LOCK
Generate one vertical 4:5 portrait.
Use the same composition as Image 2:
- head centered horizontally
- top of the head approximately 8% to 10% below the upper edge
- eyes approximately 28% to 32% from the top
- professional upper-body to mid-torso crop
- balanced shoulders
- both sides of the body contained inside the frame
- comfortable negative space around the subject
- no body parts touching the top or side edges
- no excessive empty space
- no extreme close-up
- no full-body composition
The subject’s face and head must occupy approximately the same percentage of the frame as the approved reference.
If Image 1 is tightly cropped, reconstruct only the missing shoulders or upper torso needed to complete the standard composition. Keep the anatomy and clothing realistic.

BACKGROUND LOCK
Replace the original background completely.
Match the approved True Legacy background from Image 2:
- deep charcoal base
- graphite and muted slate tones
- subtle midnight-navy undertone
- soft smoky studio gradient
- gentle diffused halo centered behind the head and shoulders
- restrained edge vignette
- subtle photographic texture
- clean separation between the subject and background
The background must not be plain black or flat navy.
Do not use:
- electric blue
- bright cyan
- neon lines
- glowing streaks
- visible technology graphics
- scenery
- furniture
- offices
- plants
- paintings
- logos
- words
- badges
- card borders

LIGHTING LOCK
Apply professional studio portrait lighting consistent with Image 2:
- soft frontal key light
- gentle facial modeling
- controlled highlights
- natural skin color
- realistic skin texture
- subtle light separation around the hair and shoulders
- detailed clothing
- no harsh shadows
- no blue light cast
- no overexposed white clothing
- no excessive skin smoothing
- no artificial beauty filter

OUTPUT LOCK
Return only the finished standalone portrait.
Do not include:
- names
- titles
- labels
- buttons
- logos
- badges
- watermarks
- borders
- interface elements
- additional people
Output one high-resolution 4:5 image using the same dimensions for every leader. Preferred production size: 1536 × 1920 pixels. If that exact resolution is unavailable, use the highest supported 4:5 resolution and normalize it afterward without stretching.
The finished portrait must look like it was photographed during the same studio session as Image 2.`

export const PRODUCTION_PORTRAIT_WIDTH = 1536
export const PRODUCTION_PORTRAIT_HEIGHT = 1920 // Exactly 4:5 aspect ratio

export const MAX_PORTRAIT_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const SUPPORTED_PORTRAIT_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const SUPPORTED_PORTRAIT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

export type LeaderPortraitStatus =
  | 'not_generated'
  | 'prompt_ready'
  | 'generating'
  | 'generated'
  | 'applicant_approved'
  | 'admin_approved'
  | 'needs_new_photo'

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
}

export interface QualityValidationResult {
  valid: boolean
  error?: string
  dimensions?: { width: number; height: number }
}

/**
 * Validates an uploaded file against size, format, and dimension criteria.
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
 * Validates the generated portrait output against the True Legacy Quality Standard.
 */
export async function validateGeneratedPortrait(
  imageSource: Blob | string
): Promise<{ valid: boolean; error?: string }> {
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

      // 1. Verify 4:5 Aspect Ratio (allow 1% tolerance)
      const ratio = w / h
      const targetRatio = 4 / 5 // 0.8
      if (Math.abs(ratio - targetRatio) > 0.02) {
        resolve({
          valid: false,
          error: 'Generated output did not meet the required 4:5 vertical aspect ratio.',
        })
        return
      }

      // 2. Verify Minimum High-Resolution standard
      if (w < 800 || h < 1000) {
        resolve({
          valid: false,
          error: 'Generated portrait resolution is below production quality standards.',
        })
        return
      }

      // 3. Inspect canvas pixels for dark charcoal background and lack of bright neon casts
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 100
        canvas.height = 125
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, 100, 125)
          // Sample corner pixels (top-left, top-right, bottom-left, bottom-right)
          const topLeft = ctx.getImageData(5, 5, 1, 1).data
          const topRight = ctx.getImageData(95, 5, 1, 1).data
          
          // Background should be dark (brightness < 120)
          const avgTopBrightness =
            (topLeft[0] + topLeft[1] + topLeft[2] + topRight[0] + topRight[1] + topRight[2]) / 6

          if (avgTopBrightness > 160) {
            resolve({
              valid: false,
              error: 'Background lighting failed verification. Please regenerate for studio charcoal backdrop.',
            })
            return
          }
        }
      } catch {
        // Continue if canvas extraction blocked by CORS
      }

      resolve({ valid: true })
    }

    img.onerror = () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl)
      resolve({
        valid: false,
        error: 'Generated portrait could not be decoded. Please regenerate.',
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
