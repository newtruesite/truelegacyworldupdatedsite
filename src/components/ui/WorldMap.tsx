import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocaleContext } from '@/contexts/LocaleContext'

declare global {
  interface Window {
    jsVectorMap?: any
  }
}

export function WorldMap() {
  const navigate = useNavigate()
  const { locale } = useLocaleContext()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.jsVectorMap) return

    const regionsMap: Record<number, string> = {
      0: '/region/north-america',
      1: '/region/latin-america',
      2: '/region/africa',
      3: '/region/asia',
    }

    const map = new window.jsVectorMap({
      selector: '#world-map',
      map: 'world',
      backgroundColor: 'transparent',
      zoomButtons: false,
      zoomOnScroll: false,
      regionStyle: {
        initial: {
          fill: '#1a2a3a',
          stroke: '#0d1f2d',
          strokeWidth: 0.5,
        },
        hover: {
          fill: '#00a896',
          cursor: 'pointer',
        },
        selected: {
          fill: '#00a896',
        },
      },
      markers: [
        { name: locale === 'es' ? 'Norteamérica' : locale === 'fr' ? 'Amérique du Nord' : 'North America', coords: [40.7128, -74.006] },
        { name: locale === 'es' ? 'Latinoamérica' : locale === 'fr' ? 'Amérique latine' : 'Latin America', coords: [-15.78, -47.9292] },
        { name: locale === 'es' ? 'África' : locale === 'fr' ? 'Afrique' : 'Africa', coords: [-1.2921, 36.8219] },
        { name: locale === 'es' ? 'Asia' : locale === 'fr' ? 'Asie' : 'Asia Pacific', coords: [35.6762, 139.6503] },
      ],
      markerStyle: {
        initial: {
          image: '/assets/icons/tl-pin.png',
          width: 40,
          height: 48,
        },
        hover: {
          width: 48,
          height: 56,
        },
      },
      onMarkerClick(_: unknown, index: number) {
        const route = regionsMap[index]
        if (route) navigate(route)
      },
      onRegionClick: () => {
        // keep behavior simple for now; markers handle navigation
      },
    })

    return () => {
      map && map.destroy && map.destroy()
    }
  }, [navigate, locale])

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="pointer-events-none absolute inset-x-[-40px] top-6 h-64 rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(6,16,56,0.8)_0,rgba(6,11,30,0)_70%)]" />
      <div className="relative w-full max-w-5xl">
        <div
          id="world-map"
          className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a1628]/80"
          style={{ height: '500px' }}
        />
      </div>
    </div>
  )
}

export default WorldMap

