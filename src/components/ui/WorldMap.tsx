import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COUNTRIES, type Country } from '@/lib/countries'
import { useLocaleContext } from '@/contexts/LocaleContext'

type PinConfig = {
  id: string
  label: string
  top: string
  left: string
  route: string
}

function getCountryLabel(country: Country, locale: 'en' | 'es' | 'fr'): string {
  if (locale === 'en') return country.name
  return country.nativeName || country.name
}

function PinMarker({ label, onClick, index }: { label: string; onClick: () => void; index: number }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="absolute left-0 top-0 flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e3eef8] rounded-lg -translate-x-1/2 min-w-[80px] py-2"
      style={{ touchAction: 'manipulation' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.3 + index * 0.12 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.98 }}
      aria-label={label}
      title={label}
    >
      {/* TL-branded pin with glow */}
      <span className="map-dot-pulse flex shrink-0 -translate-y-1/2 inline-flex items-center justify-center">
        <span className="relative inline-flex items-center justify-center">
          <span className="absolute inline-flex h-6 w-6 rounded-full bg-cyan-400/40 blur-sm" aria-hidden />
          <svg
            className="relative w-4 h-5 text-[#F5A623] drop-shadow-md"
            viewBox="0 0 20 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M10 0C5.86 0 2.5 3.36 2.5 7.5c0 5.33 6.3 11.73 7.02 12.44a.7.7 0 0 0 .96 0c.72-.71 7.02-7.11 7.02-12.44C17.5 3.36 14.14 0 10 0Zm0 11.25a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z" />
          </svg>
        </span>
      </span>
      {/* Label below the dot */}
      <span className="mt-1 px-2.5 py-1 rounded-md bg-[#0a1628]/95 text-white text-[10px] sm:text-xs font-semibold tracking-wide whitespace-nowrap border border-[#F5A623]/40 shadow-lg">
        {label}
      </span>
    </motion.button>
  )
}

export function WorldMap() {
  const navigate = useNavigate()
  const { locale } = useLocaleContext()

  const pins = useMemo<PinConfig[]>(
    () =>
      COUNTRIES.map((country) => ({
        id: country.slug,
        label: getCountryLabel(country, locale),
        top: `${country.mapY}%`,
        left: `${country.mapX}%`,
        route: `/${country.slug}`,
      })),
    [locale]
  )

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#e3eef8] flex items-center justify-center">
      {/* 1) Pins overlay first (DOM index 0), nextSibling = img */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative z-10 h-full w-full pointer-events-auto">
          {pins.map((pin, index) => (
            <div
              key={pin.id}
              className="absolute pointer-events-auto left-0 top-0"
              style={{ top: pin.top, left: pin.left, transform: 'translate(-50%, -50%)' }}
            >
              <PinMarker
                label={pin.label}
                index={index}
                onClick={() => navigate(pin.route)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* 2) Map image */}
      <img
        src="/assets/maps/world-map-light.png"
        alt="True Legacy World — select your country to explore your local True Legacy community"
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
        loading="lazy"
      />
      {/* 3) Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0,transparent_55%,rgba(0,8,25,0.4)_100%)]" />
    </div>
  )
}

export default WorldMap

