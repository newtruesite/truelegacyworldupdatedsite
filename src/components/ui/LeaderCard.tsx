import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Globe2, Instagram, Languages, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export interface LeaderCardData {
  slug: string
  name: string
  title: string
  photo?: string
  fallbackInitial?: string
  regions: string[]
  languages: string[]
  whatsapp?: string
  instagram?: string
}

export interface LeaderPortraitConfig {
  src: string
  scale?: number
  offsetX?: string
  offsetY?: string
  objectPosition?: string
}

export const LEADER_PORTRAIT_REGISTRY: Record<string, LeaderPortraitConfig> = {
  'mehdi-cohen': {
    src: '/leaders/mehdi-hero.png',
    scale: 1.02,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'simon-loh': {
    src: '/leaders/simon-hero.png',
    scale: 1.03,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'ming-way-sia': {
    src: '/leaders/mingway-hero.png',
    scale: 1.02,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'zah-naderi': {
    src: '/leaders/zah-hero-v3.png',
    scale: 1.02,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'alex-gonzalez': {
    src: '/leaders/alex-hero-transparent.png',
    scale: 1.03,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'ryan-pool': {
    src: '/leaders/ryan-hero.png',
    scale: 1.03,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'magaly-cardona': {
    src: '/leaders/magaly-hero.png',
    scale: 1.05,
    offsetY: '1%',
    objectPosition: 'top center',
  },
  emanuela: {
    src: '/leaders/emanuela-hero-transparent.png',
    scale: 1.03,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'jesse-schexnayder': {
    src: '/leaders/jesse-hero-transparent.png',
    scale: 1.04,
    offsetY: '0%',
    objectPosition: 'top center',
  },
  'angel-mok': {
    src: '/leaders/standardized/angel-mok-v2.png',
    scale: 1.02,
    offsetY: '0%',
    objectPosition: 'top center',
  },
}

const LANGUAGE_NAMES: Record<string, Record<string, string>> = {
  en: { en: 'English', es: 'Spanish', fr: 'French', pt: 'Portuguese', zh: 'Mandarin', yue: 'Cantonese', ms: 'Malay', ar: 'Arabic', ru: 'Russian' },
  es: { en: 'Inglés', es: 'Español', fr: 'Francés', pt: 'Portugués', zh: 'Mandarín', yue: 'Cantonés', ms: 'Malayo', ar: 'Árabe', ru: 'Ruso' },
  fr: { en: 'Anglais', es: 'Espagnol', fr: 'Français', pt: 'Portugais', zh: 'Mandarin', yue: 'Cantonais', ms: 'Malais', ar: 'Arabe', ru: 'Russe' },
  pt: { en: 'Inglês', es: 'Espanhol', fr: 'Francês', pt: 'Português', zh: 'Mandarim', yue: 'Cantonês', ms: 'Malaio', ar: 'Árabe', ru: 'Russo' },
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

export interface LeaderCardProps {
  dist: LeaderCardData
  index?: number
  profileLabel?: string
  locale?: string
  portraitScale?: number
  portraitPositionX?: string
  portraitPositionY?: string
  className?: string
}

export function LeaderCard({
  dist,
  index = 0,
  profileLabel = 'View profile',
  locale = 'en',
  portraitScale,
  portraitPositionX,
  portraitPositionY,
  className = '',
}: LeaderCardProps) {
  const [imgError, setImgError] = useState(false)

  // Resolve best portrait asset and framing configuration
  const config = LEADER_PORTRAIT_REGISTRY[dist.slug] || {}
  const imageSource = !imgError && (config.src || dist.photo)
  const scale = portraitScale ?? config.scale ?? 1.03
  const offsetY = portraitPositionY ?? config.offsetY ?? '0%'
  const offsetX = portraitPositionX ?? config.offsetX ?? '0%'
  const objectPosition = config.objectPosition ?? 'top center'

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 7) * 0.05 }}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#090d16] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-cyan-950/20 ${className}`}
    >
      {/* Universal Luxury Studio Portrait Canvas */}
      <Link to={`/d/${dist.slug}`} className="relative block aspect-[4/5] w-full overflow-hidden select-none">
        {/* Layer 1: Deep Neutral Studio Gradient (Charcoal -> Midnight Navy Base) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141926] via-[#0d121c] to-[#07090f]" />

        {/* Layer 2: Soft Diffused Radial Studio Backlight (Flattering for all skin tones & clothing) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            background:
              'radial-gradient(circle at 50% 36%, rgba(255, 255, 255, 0.10) 0%, rgba(56, 189, 248, 0.05) 35%, rgba(15, 23, 42, 0.01) 70%)',
          }}
        />

        {/* Layer 3: Subtle Studio Vignette for Depth & Edge Separation */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(4, 7, 13, 0.65) 100%)',
          }}
        />

        {/* Layer 4: Standardized Leader Portrait with Calibrated Framing */}
        {imageSource ? (
          <img
            src={imageSource}
            alt={dist.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            style={{
              transform: `scale(${scale}) translate(${offsetX}, ${offsetY})`,
              objectPosition,
            }}
          />
        ) : (
          <span className="relative flex h-full items-center justify-center text-5xl font-black text-[#2997ff]">
            {dist.fallbackInitial || dist.name.charAt(0)}
          </span>
        )}

        {/* Layer 5: Seamless Gradient Blend to Card Body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#090d16] via-[#090d16]/40 to-transparent pointer-events-none" />

        {/* Verified Badge */}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#2997ff] backdrop-blur-md shadow-lg">
          <BadgeCheck className="h-4 w-4 text-[#2997ff]" />
          {locale === 'es' ? 'Verificado' : locale === 'fr' ? 'Vérifié' : locale === 'pt' ? 'Verificado' : 'Verified'}
        </span>
      </Link>

      {/* Card Content with Uniform Dimensions */}
      <div className="flex flex-1 flex-col p-5 bg-[#090d16]">
        {/* Name Area (Standardized Height to keep all cards aligned) */}
        <div className="min-h-[3.25rem] flex items-center">
          <h2 className="text-lg sm:text-xl font-bold !text-white leading-snug line-clamp-2">
            {dist.name}
          </h2>
        </div>

        {/* Title / Role Area */}
        <p className="mt-1 text-xs font-semibold text-[#2997ff]/90 min-h-[2.25rem] line-clamp-2 leading-snug">
          {dist.title}
        </p>

        {/* Geographic & Language Metadata */}
        <div className="mt-4 space-y-2 text-xs leading-5 text-[#cccccc] flex-1">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2997ff]" />
            <span className="line-clamp-1">{dist.regions.join(' · ')}</span>
          </p>
          <p className="flex items-start gap-2">
            <Languages className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2997ff]" />
            <span className="line-clamp-1">
              {dist.languages.map((item) => LANGUAGE_NAMES[locale]?.[item] || item.toUpperCase()).join(' · ')}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Globe2 className="h-3.5 w-3.5 shrink-0 text-[#2997ff]" />
            <span>
              {locale === 'es'
                ? 'Equipo True Legacy'
                : locale === 'fr'
                ? 'Équipe True Legacy'
                : locale === 'pt'
                ? 'Equipe True Legacy'
                : 'True Legacy team'}
            </span>
          </p>
        </div>

        {/* Standardized Bottom Button Row */}
        <div className="mt-auto flex items-center gap-2 pt-5 border-t border-white/[0.07]">
          <Link
            to={`/d/${dist.slug}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 text-xs sm:text-sm font-bold text-slate-950 transition-colors shadow-md shadow-cyan-500/10 active:scale-95"
          >
            {profileLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>

          {dist.whatsapp && (
            <a
              href={dist.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${dist.name}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              <IconWhatsApp className="h-5 w-5" />
            </a>
          )}

          {dist.instagram && (
            <a
              href={dist.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram ${dist.name}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
