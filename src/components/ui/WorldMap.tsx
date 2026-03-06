import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Convert lat/long to CSS percentage for equirectangular map: left = (lon+180)/360*100, top = (90-lat)/180*100
function latLongToPercent(lat: number, long: number): { top: string; left: string } {
  const left = ((long + 180) / 360) * 100
  const top = ((90 - lat) / 180) * 100
  return { top: `${top}%`, left: `${left}%` }
}

type PinConfig = {
  id: string
  label: string
  top: string
  left: string
  route: string
}

const PINS: PinConfig[] = [
  { id: 'north-america', label: 'North America', ...latLongToPercent(45, -100), route: '/region/north-america' },
  { id: 'south-america', label: 'Latin America', ...latLongToPercent(-15, -60), route: '/region/latin-america' },
  { id: 'africa', label: 'Africa', ...latLongToPercent(0, 20), route: '/region/africa' },
  { id: 'asia', label: 'Asia', ...latLongToPercent(25, 55), route: '/region/asia' },
]

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
    >
      {/* Small True Legacy logo above the pin dot so it's visible on the map */}
      <img
        src="/logos/tl-horizontal-white.png"
        alt=""
        className="w-10 h-3.5 object-contain object-center -translate-y-1/2 mb-0.5 opacity-90 drop-shadow-md"
        aria-hidden
      />
      {/* Dot centered on the map pin — pulse animation */}
      <span className="map-dot-pulse flex shrink-0 -translate-y-1/2 inline-flex items-center justify-center">
        <svg className="w-4 h-4 text-[#F5A623] drop-shadow-md relative z-10" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <circle cx="8" cy="8" r="6" />
        </svg>
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

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#e3eef8] flex items-center justify-center">
      {/* 1) Pins overlay first (DOM index 0), nextSibling = img */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative z-10 h-full w-full pointer-events-auto">
          {PINS.map((pin, index) => (
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
        src="/world-map-hero.png"
        alt="True Legacy World — global regions: North America, Latin America, Africa, Asia"
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
        loading="lazy"
      />
      {/* 3) Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0,transparent_55%,rgba(0,8,25,0.4)_100%)]" />
    </div>
  )
}

export default WorldMap

