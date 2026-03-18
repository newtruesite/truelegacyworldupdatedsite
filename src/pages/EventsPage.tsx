import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { COUNTRIES } from '@/lib/countries'
import { Navbar } from '@/components/layout/Navbar'

const REGIONS = ['latam', 'global', 'asia', 'africa'] as const
type RegionSlug = (typeof REGIONS)[number]

const COUNTRY_TO_REGION: Record<string, RegionSlug> = {
  brazil: 'latam', mexico: 'latam', colombia: 'latam', paraguay: 'latam',
  india: 'asia', uae: 'asia', malaysia: 'asia',
  nigeria: 'africa', morocco: 'africa',
}
const DEFAULT_REGION: RegionSlug = 'global'

function paramToRegion(param: string | undefined): RegionSlug {
  if (!param) return DEFAULT_REGION
  const lower = param.toLowerCase()
  if (REGIONS.includes(lower as RegionSlug)) return lower as RegionSlug
  return (COUNTRY_TO_REGION[lower] as RegionSlug) ?? DEFAULT_REGION
}

function getRegionLocale(region: RegionSlug): 'en' | 'es' | 'fr' | 'pt' {
  if (region === 'latam') return 'es'
  if (region === 'africa') return 'en'
  return 'en'
}

function getRegionBreadcrumbLabel(region: RegionSlug, locale: string): string {
  if (region === 'latam') return locale === 'es' ? 'LATAM' : 'Sudamérica'
  if (region === 'global') return 'Global'
  if (region === 'asia') return 'Asia'
  if (region === 'africa') return 'Africa'
  return 'Events'
}

const UPCOMING_EVENTS = [
  {
    id: 'masterclass-march-2026',
    title: 'TRUE LEGACY MASTERCLASS',
    date: 'March 29th, 2026',
    image: '/assets/event-masterclass.png',
    latamImage: '/assets/event-latam-flyer-DkOd8-Qj-0d566419-1e76-4a4e-9c79-e242f47c70d7.png',
    registerUrl: 'https://tr.ee/8yBqHZ',
    timezones: [
      { region: 'Malaysia', time: '8:00 PM' },
      { region: 'India', time: '5:30 PM' },
      { region: 'UAE', time: '4:00 PM' },
      { region: 'Turkey', time: '3:00 PM' },
      { region: 'Nigeria', time: '1:00 PM' },
      { region: 'Miami', time: '7:00 AM' },
    ],
    description_en: `This is not just another training. This is a 3-hour power-packed Masterclass designed to help you move to the next level in Enagic — with clarity, strategy, and real execution.

🚨 Entry is strictly by registration only

✅ Open to you and your prospects
✅ Designed for growth, duplication & rank advancement
✅ Limited seats — personalised attention will be given

If you are serious about building momentum in 2026, this is where you need to be.

⏳ Seats are limited. Register now and show up ready. 💥`,
    description_es: `Esto no es solo otro entrenamiento. Este es un Masterclass de 3 horas diseñado para llevarte al siguiente nivel en Enagic — con claridad, estrategia y ejecución real.

🚨 La entrada es estrictamente por registro

✅ Abierto para ti y tus prospectos
✅ Diseñado para el crecimiento, duplicación y avance de rango
✅ Asientos limitados — se dará atención personalizada

Si estás serio sobre construir impulso en 2026, aquí es donde debes estar.

⏳ Los asientos son limitados. Regístrate ahora y preséntate listo. 💥`,
    description_fr: `Ce n'est pas juste une autre formation. C'est une Masterclass de 3 heures conçue pour vous aider à passer au niveau supérieur dans Enagic — avec clarté, stratégie et exécution réelle.

🚨 L'entrée est strictement sur inscription

✅ Ouvert à vous et vos prospects
✅ Conçu pour la croissance, la duplication et l'avancement de rang
✅ Places limitées — attention personnalisée garantie

Si vous êtes sérieux au sujet de construire l'élan en 2026, c'est là où vous devez être.

⏳ Places limitées. Inscrivez-vous maintenant. 💥`,
  },
]

const LABELS = {
  en: { breadcrumbHome: 'Home', breadcrumbEvents: 'Events', hero: 'Upcoming Events', register: 'Register now', noEvents: 'No upcoming events for this region.' },
  es: { breadcrumbHome: 'Inicio', breadcrumbEvents: 'Eventos', hero: 'Próximos Eventos', register: 'Regístrate ahora', noEvents: 'No hay eventos próximos para esta región.' },
  fr: { breadcrumbHome: 'Accueil', breadcrumbEvents: 'Événements', hero: 'Événements à venir', register: "S'inscrire maintenant", noEvents: "Aucun événement à venir pour cette région." },
  pt: { breadcrumbHome: 'Início', breadcrumbEvents: 'Eventos', hero: 'Próximos Eventos', register: 'Registre-se agora', noEvents: 'Nenhum evento próximo para esta região.' },
}

export default function EventsPage() {
  const { country: param } = useParams<{ country: string }>()
  const navigate = useNavigate()
  const region = paramToRegion(param)
  const lang = getRegionLocale(region) as keyof typeof LABELS
  const t = LABELS[lang] ?? LABELS.en
  const events = UPCOMING_EVENTS
  const regionLabel = getRegionBreadcrumbLabel(region, lang)

  // Redirect old country-slug URLs to region URLs once
  useEffect(() => {
    if (!param) return
    const lower = param.toLowerCase()
    if (REGIONS.includes(lower as RegionSlug)) return
    const targetRegion = COUNTRY_TO_REGION[lower] ?? DEFAULT_REGION
    navigate(`/events/${targetRegion}`, { replace: true })
  }, [param, navigate])

  return (
    <div className="page-wrapper bg-[#060b1e] text-white">
      <Navbar />
      <div className="content-wrapper mx-auto max-w-4xl px-4 py-16 sm:px-6">

        <h1 className="section-title text-center mb-10">{t.hero} — {regionLabel}</h1>

        {events.length === 0 ? (
          <p className="text-slate-400">{t.noEvents}</p>
        ) : (
          <div className="space-y-10">
            {events.map((event) => {
              const desc = lang === 'es' ? event.description_es : lang === 'fr' ? event.description_fr : event.description_en
              return (
                <article key={event.id} className="event-card rounded-2xl overflow-hidden border border-white/10 bg-white/5 max-w-3xl mx-auto">
                  <div className="relative w-full bg-white/5 flex items-center justify-center p-4">
                    <img
                      src={region === 'latam' && event.latamImage ? event.latamImage : event.image}
                      alt={event.title}
                      className="event-image max-w-full max-h-[500px] w-auto h-auto object-contain"
                    />
                  </div>
                  <div className="p-5 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{event.title}</h2>
                    <p className="text-[#00a896] font-semibold text-base mb-5">{event.date}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-4 rounded-xl bg-white/5 border border-white/5">
                      {event.timezones.map((tz) => (
                        <div key={tz.region} className="text-sm text-slate-300">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-0.5">{tz.region}</span>
                          <span className="font-bold text-white">{tz.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="whitespace-pre-line text-slate-300 text-sm leading-relaxed mb-6">{desc}</div>
                    <a
                      href={event.registerUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="event-register-btn inline-flex items-center justify-center w-full min-h-[56px] px-6 py-4 rounded-xl font-bold text-base text-white transition-all hover:opacity-95 hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg, #00a896, #00c4ae)' }}
                    >
                      {t.register}
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
