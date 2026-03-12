import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLocaleContext } from '@/contexts/LocaleContext'

type RegionId = 'north_america' | 'south_america' | 'africa' | 'asia'

type RegionPinConfig = {
  id: RegionId
  label: string
  top: string
  left: string
  route: string
}

const REGION_PINS_BASE: Array<{
  id: RegionId
  /** Percentage positions tuned for the world map background */
  top: number
  left: number
  /** Region route for that area */
  route: string
}> = [
  {
    id: 'north_america',
    top: 30,
    left: 18,
    route: '/region/north-america',
  },
  {
    id: 'south_america',
    top: 62,
    left: 27,
    route: '/region/latin-america',
  },
  {
    id: 'africa',
    top: 48,
    left: 48,
    route: '/region/africa',
  },
  {
    id: 'asia',
    top: 46,
    left: 68,
    route: '/region/asia',
  },
]

function getRegionLabel(id: RegionId, locale: 'en' | 'es' | 'fr'): string {
  switch (id) {
    case 'north_america':
      if (locale === 'es') return 'Norteamérica'
      if (locale === 'fr') return 'Amérique du Nord'
      return 'North America'
    case 'south_america':
      if (locale === 'es') return 'Sudamérica'
      if (locale === 'fr') return 'Amérique du Sud'
      return 'South America'
    case 'africa':
      if (locale === 'es') return 'África'
      if (locale === 'fr') return 'Afrique'
      return 'Africa'
    case 'asia':
      if (locale === 'es') return 'Asia'
      if (locale === 'fr') return 'Asie'
      return 'Asia'
    default:
      return ''
  }
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
      <span className="mt-1 px-2.5 py-1 rounded-md bg-[#0a1628]/95 text-white text-[10px] sm:text-xs font-semibold tracking-wide whitespace-nowrap border border-[#F5A623]/40 shadow-lg">
        {label}
      </span>
    </motion.button>
  )
}

export function WorldMap() {
  const navigate = useNavigate()
  const { locale } = useLocaleContext()

  const pins = useMemo<RegionPinConfig[]>(
    () =>
      REGION_PINS_BASE.map((region) => ({
        id: region.id,
        label: getRegionLabel(region.id, locale),
        top: `${region.top}%`,
        left: `${region.left}%`,
        route: region.route,
      })),
    [locale]
  )

  return (
    <div className="relative w-full overflow-visible flex items-center justify-center">
      {/* Soft outer glow anchoring the map into the background */}
      <div className="pointer-events-none absolute inset-x-[-40px] top-6 h-64 rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(6,16,56,0.8)_0,rgba(6,11,30,0)_70%)]" />
      <div className="relative w-full max-w-5xl">
        {/* Map image */}
        <div className="relative w-full">
          <img
            src="/assets/maps/world-map-truelegacy.png"
            alt="True Legacy World — choose your region to explore local True Legacy communities"
            className="block w-full h-auto object-contain pointer-events-none select-none"
            loading="lazy"
          />
          {/* Pins overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="relative z-10 h-full w-full pointer-events-auto">
              {pins.map((pin, index) => (
                <div
                  key={pin.id}
                  className="absolute pointer-events-auto left-0 top-0"
                  style={{ top: pin.top, left: pin.left, transform: 'translate(-50%, -60%)' }}
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
        </div>
      </div>
    </div>
  )
}

export default WorldMap

