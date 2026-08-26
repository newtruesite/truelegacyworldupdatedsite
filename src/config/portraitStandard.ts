/**
 * Official True Legacy Leader Portrait Standard Configuration & Prompt Template.
 * Centralized source of truth for standardizing leader portraits across the platform.
 */

export const TRUE_LEGACY_LEADER_PORTRAIT_PROMPT = `Transform the uploaded photo into the official True Legacy leader portrait style.

IDENTITY PRESERVATION
Preserve the person’s exact recognizable identity, including:
- facial structure
- skin tone and natural complexion
- hairstyle
- eye shape and eye color
- age
- body proportions
- expression
- eyeglasses, if present
- original clothing and accessories
Do not beautify, reshape, age, de-age, or replace the person’s face. Do not change their outfit. The final image must clearly look like the same real person in the uploaded photo.

PORTRAIT COMPOSITION
Create one standalone, high-resolution vertical 4:5 portrait.
Use a professional upper-body or mid-torso composition:
- subject centered horizontally
- face positioned near the upper-middle of the frame
- comfortable space above the head
- both shoulders visible and visually balanced
- natural body proportions
- professional mid-torso crop
- subject looking appropriately sized, not too close or too far away
The person’s head and face should match the visual size and positioning used across the existing True Legacy leader portraits.
If the original photo is tightly cropped, naturally reconstruct only the missing shoulders or upper torso necessary to complete the composition. Keep the result anatomically realistic.

BACKGROUND
Completely replace the original background with the official True Legacy neutral portrait background:
- deep charcoal
- graphite gray
- muted slate
- very subtle midnight navy undertone
- soft smoky studio gradient
- gentle diffused light behind the subject
- subtle vignette around the edges
- minimal, controlled contrast
The background must complement different skin tones and clothing colors, including black, navy, gray, white, cream, beige, blush, pink, and patterned outfits.
Use brand blue only as an extremely subtle undertone, if used at all.

LIGHTING AND FINISH
Use refined professional studio lighting:
- natural and flattering skin tones
- clear separation between the subject and background
- soft controlled highlights
- realistic facial texture
- clean clothing detail
- subtle depth
- polished premium editorial finish
Match the lighting, contrast, background darkness, portrait scale, and framing of the existing True Legacy leader portraits.

FINAL OUTPUT
Return exactly one person against the clean neutral background.
Do not include:
- names
- titles
- card borders
- buttons
- logos
- text
- watermarks
- website interface elements
- bright electric blue
- neon lines
- glowing streaks
- heavy blue color casts
- artificial beauty filters
- excessive skin smoothing
- dramatic facial retouching
- altered clothing
- additional people
The final result should look like it belongs naturally beside every other True Legacy leader portrait: premium, elegant, realistic, consistent, globally professional, and ready to upload directly to the leadership directory.`

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
 * Returns the centralized True Legacy leader portrait prompt.
 */
export function getOfficialLeaderPortraitPrompt(): string {
  return TRUE_LEGACY_LEADER_PORTRAIT_PROMPT.trim()
}
