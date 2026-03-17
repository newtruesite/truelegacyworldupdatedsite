import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { COUNTRIES, getFlagSrcSet } from '@/lib/countries'
import { useLocaleContext } from '@/contexts/LocaleContext'

const CONTINENT_DATA: Record<
  string,
  {
    name: string
    emoji: string
    countries: Array<{ code: string; name: string; slug: string }>
  }
> = {
  'north-america': {
    name: 'North America',
    emoji: '🌎',
    countries: [
      { code: 'us', name: 'United States', slug: 'usa' },
      { code: 'ca', name: 'Canada', slug: 'canada' },
    ],
  },
  'south-america': {
    name: 'South America',
    emoji: '🌎',
    countries: [
      { code: 'co', name: 'Colombia', slug: 'colombia' },
      { code: 'py', name: 'Paraguay', slug: 'paraguay' },
      { code: 'mx', name: 'Mexico', slug: 'mexico' },
      { code: 'br', name: 'Brazil', slug: 'brazil' },
    ],
  },
  africa: {
    name: 'Africa',
    emoji: '🌍',
    countries: [
      { code: 'ma', name: 'Morocco', slug: 'morocco' },
      { code: 'ng', name: 'Nigeria', slug: 'nigeria' },
    ],
  },
  asia: {
    name: 'Asia',
    emoji: '🌏',
    countries: [
      { code: 'in', name: 'India', slug: 'india' },
      { code: 'ae', name: 'UAE', slug: 'uae' },
      { code: 'my', name: 'Malaysia', slug: 'malaysia' },
    ],
  },
}

export default function SelectCountryPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const continent = params.get('continent') || ''
  const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())

  // Ensure Spanish locale if LATAM/South America is selected directly
  const { setLocale } = useLocaleContext()
  useEffect(() => {
    if (continent === 'south-america') {
      setLocale('es')
    }
  }, [continent, setLocale])

  const isInvalidContinent = continent && !CONTINENT_DATA[continent]
  const isAllCountries = !continent || isInvalidContinent

  if (isInvalidContinent) {
    return (
      <div className="page-wrapper min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #020d16 0%, #041824 60%, #021018 100%)' }}>
        <Navbar />
        <div className="content-wrapper flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl mx-auto">
            <div className="text-5xl mb-4">🌍</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight break-words">
              Let's get you to the right region
            </h1>
            <p className="text-slate-400 mb-8 text-sm md:text-base leading-relaxed">
              We couldn't find the region you're looking for. Please try selecting a region from the world map or view all available countries.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Back to World Map
              </Link>
              <Link
                to="/select-country"
                className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-300 border border-white/10 hover:text-white hover:bg-white/5 transition-all"
              >
                Browse all countries
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayData = useMemo(() => {
    if (isAllCountries) {
      return {
        name: 'All Countries',
        emoji: '🌍',
        countries: COUNTRIES.map((c) => ({
          slug: c.slug,
          name: c.name,
          flagEmoji: c.flagEmoji,
        })),
      }
    }
    
    // Map the continent data to include the properties we need for rendering
    const contData = CONTINENT_DATA[continent]
    return {
      name: contData.name,
      emoji: contData.emoji,
      countries: contData.countries.map((c) => {
        // Find the full country object from COUNTRIES to get the flagEmoji
        const fullCountry = COUNTRIES.find((country) => country.slug === c.slug)
        return {
          slug: c.slug,
          name: fullCountry?.name || c.name,
          flagEmoji: fullCountry?.flagEmoji || '🌍',
        }
      })
    }
  }, [continent, isAllCountries])

  return (
    <div
      className="page-wrapper min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #020d16 0%, #041824 60%, #021018 100%)',
      }}
    >
      <Navbar />
      <div className="content-wrapper flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 relative w-full">
      <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors"
        >
          ← Back to Map
        </button>
      </div>

      <div className="text-center mb-10 w-full max-w-2xl mx-auto px-2">
        <div className="text-5xl md:text-6xl mb-4">{displayData.emoji}</div>
        <h1 className="page-hero-title mb-4 gradient-text text-3xl md:text-5xl font-bold break-words leading-tight">
          {displayData.name}
        </h1>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
          Select your country to explore products and join the True Legacy team near you
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full max-w-6xl mx-auto pb-12"
      >
        {displayData.countries.map((country) => (
          <button
            key={country.slug}
            onClick={() => {
              try {
                sessionStorage.setItem('last_page', window.location.href)
                sessionStorage.setItem('last_page_label', 'Select Region')
                sessionStorage.setItem('last_continent_id', continent)
                sessionStorage.setItem('last_continent_name', displayData.name)
              } catch {
                /* ignore */
              }
              navigate(`/${country.slug}`)
            }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '32px 24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,168,150,0.1)'
              e.currentTarget.style.borderColor = 'rgba(0,168,150,0.5)'
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'
              const cta = e.currentTarget.querySelector('[data-cta]') as HTMLElement | null
              if (cta) cta.style.color = '#00a896'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)'
              const cta = e.currentTarget.querySelector('[data-cta]') as HTMLElement | null
              if (cta) cta.style.color = '#4a7a8a'
            }}
          >
            <span className="inline-flex overflow-hidden rounded border-2 border-white/15 bg-[#0a2060] shadow-xl" style={{ width: '96px', height: '64px' }}>
              {failedFlagSlugs.has(country.slug) ? (
                <span className="flex h-full w-full items-center justify-center text-3xl leading-none">{country.flagEmoji}</span>
              ) : (
                <img {...getFlagSrcSet(country.slug)} alt={country.name} className="h-full w-full object-cover" loading="lazy" onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(country.slug))} />
              )}
            </span>
            <div>
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#ffffff',
                  letterSpacing: '-0.2px',
                  marginBottom: '4px',
                }}
              >
                {country.name}
              </div>
              <div
                data-cta
                style={{
                  fontSize: '12px',
                  color: '#4a7a8a',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
              >
                View Products →
              </div>
            </div>
          </button>
        ))}
      </div>
      </div>
    </div>
  )
}

