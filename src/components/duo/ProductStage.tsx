import React from 'react'

export type ProductType = 'k8' | 'emguarde'
export type ProductStageContext =
  | 'hero'
  | 'equation'
  | 'spotlight'
  | 'showcase'
  | 'card'
  | 'cta'
  | 'mobile'

interface ProductStageProps {
  product: ProductType
  context: ProductStageContext
  className?: string
  alt?: string
  priority?: boolean
}

/**
 * Standardized Product Asset System for True Legacy Duo
 * 
 * Rules enforced:
 * 1. Uses ONLY official unaltered transparent PNG assets (/products/k8.png and /products/emguarde-go.png).
 * 2. object-fit: contain (NEVER cover) - zero cropping, zero aspect distortion.
 * 3. Proportional physical hierarchy: K8 home ionizer reads larger than emGuarde portable cylinders.
 * 4. Transparent padding compensation: compensates for 1:1 square K8 asset vs 16:9 emGuarde asset.
 */
export function ProductStage({
  product,
  context,
  className = '',
  alt,
  priority = false,
}: ProductStageProps) {
  const isK8 = product === 'k8'
  const src = isK8 ? '/products/k8.png' : '/products/emguarde-tight.png'
  const defaultAlt = isK8
    ? 'Enagic Leveluk K8 Flagship 8-Plate Water Ionizer'
    : 'emGuarde GO Dual-Unit Portable Electromagnetic Harmonizer Set'

  // Context-specific container styling & image sizing
  const getContainerAndImageClasses = () => {
    switch (context) {
      case 'hero':
        // For hero visual contexts if individual assets are isolated
        return {
          container: 'relative w-full flex items-center justify-center py-4',
          image: isK8
            ? 'h-60 sm:h-72 md:h-80 w-auto max-w-[90%] object-contain drop-shadow-[0_20px_40px_rgba(6,182,212,0.35)]'
            : 'h-48 sm:h-56 md:h-64 w-auto max-w-[80%] object-contain drop-shadow-[0_20px_40px_rgba(16,185,129,0.3)]',
        }

      case 'equation':
        // Section 03: Split equation cards (Water vs Environment)
        return {
          container: 'my-4 relative w-full h-52 sm:h-60 flex items-center justify-center overflow-hidden',
          image: isK8
            ? 'h-full max-h-52 sm:max-h-60 w-auto max-w-full object-contain drop-shadow-[0_15px_30px_rgba(6,182,212,0.25)] transition-transform duration-300 group-hover:scale-105'
            : 'h-40 sm:h-48 max-h-48 w-auto max-w-full object-contain drop-shadow-[0_12px_24px_rgba(16,185,129,0.25)] transition-transform duration-300 group-hover:scale-105',
        }

      case 'spotlight':
        // Sections 05 & 07: Dedicated feature story visual
        return {
          container: 'relative w-full flex items-center justify-center p-2',
          image: isK8
            ? 'max-h-64 sm:max-h-76 md:max-h-84 w-auto max-w-[90%] object-contain drop-shadow-[0_25px_50px_rgba(6,182,212,0.35)]'
            : 'max-h-52 sm:max-h-64 md:max-h-72 w-auto max-w-[85%] object-contain drop-shadow-[0_20px_40px_rgba(16,185,129,0.3)]',
        }

      case 'showcase':
        // Section 09: Meet the Duo side-by-side showcase cards
        return {
          container: 'my-4 relative w-full h-52 sm:h-60 flex items-center justify-center overflow-hidden',
          image: isK8
            ? 'h-full max-h-52 sm:max-h-60 w-auto max-w-full object-contain drop-shadow-[0_15px_30px_rgba(6,182,212,0.25)] transition-transform duration-300 group-hover:scale-105'
            : 'h-40 sm:h-48 max-h-48 w-auto max-w-full object-contain drop-shadow-[0_12px_24px_rgba(16,185,129,0.25)] transition-transform duration-300 group-hover:scale-105',
        }

      case 'card':
        // Section 12: Individual deep-dive cards (Explore Individually)
        return {
          container: 'my-4 relative w-full h-48 sm:h-56 flex items-center justify-center overflow-hidden',
          image: isK8
            ? 'h-full max-h-48 sm:max-h-56 w-auto max-w-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105'
            : 'h-36 sm:h-44 max-h-44 w-auto max-w-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105',
        }

      case 'cta':
        // Section 15 / Final CTA: Dual product side-by-side (Strict proportionate scale)
        return {
          container: 'relative flex items-end justify-center',
          image: isK8
            ? 'h-[160px] sm:h-[185px] md:h-[200px] max-h-[200px] w-auto max-w-[220px] object-contain drop-shadow-[0_20px_40px_rgba(6,182,212,0.35)]'
            : 'h-[130px] sm:h-[150px] md:h-[165px] max-h-[165px] w-auto max-w-[110px] object-contain drop-shadow-[0_15px_30px_rgba(16,185,129,0.35)] mb-0.5',
        }

      case 'mobile':
      default:
        return {
          container: 'relative w-full flex items-center justify-center p-2',
          image: isK8
            ? 'max-h-44 sm:max-h-52 w-auto max-w-full object-contain drop-shadow-lg'
            : 'max-h-32 sm:max-h-40 w-auto max-w-full object-contain drop-shadow-lg',
        }
    }
  }

  const { container, image } = getContainerAndImageClasses()

  return (
    <div className={`${container} ${className}`}>
      <img
        src={src}
        alt={alt || defaultAlt}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={image}
      />
    </div>
  )
}
