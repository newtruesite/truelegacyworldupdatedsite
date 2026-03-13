import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

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

  const data = useMemo(() => CONTINENT_DATA[continent] ?? null, [continent])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'linear-gradient(160deg, #020d16 0%, #041824 60%, #021018 100%)' }}>
        <div className="text-center">
          <p className="text-slate-200 mb-4">Invalid continent selection.</p>
          <Link to="/" className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white border border-white/20 hover:bg-white/10">
            Back to Map
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #020d16 0%, #041824 60%, #021018 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          color: '#ffffff',
          padding: '10px 18px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(10px)',
          transition: 'background 0.2s',
          zIndex: 10,
        }}
      >
        ← Back to Map
      </button>

      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{data.emoji}</div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #90cce0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 14px',
            letterSpacing: '-0.5px',
          }}
        >
          {data.name}
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: '#5a8595',
            maxWidth: '420px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}
        >
          Select your country to explore products and join the True Legacy team near you
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(data.countries.length, 3)}, 1fr)`,
          gap: '20px',
          width: '100%',
          maxWidth: `${Math.min(data.countries.length, 3) * 220}px`,
        }}
      >
        {data.countries.map((country) => (
          <button
            key={country.code}
            onClick={() => navigate(`/${country.slug}`)}
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
            <img
              src={`https://flagcdn.com/w160/${country.code}.png`}
              srcSet={`https://flagcdn.com/w320/${country.code}.png 2x`}
              alt={country.name}
              loading="lazy"
              style={{
                width: '96px',
                height: '64px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                display: 'block',
              }}
            />
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
  )
}

