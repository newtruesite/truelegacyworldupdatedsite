import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { CalendarDays, Clock3, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const EVENTS = [
  {
    id: 'global',
    eyebrow: 'Global · English',
    title: 'Unlock Your True Legacy',
    subtitle: 'Live product and business presentation',
    schedule: 'Every Wednesday · 8:30 PM Eastern / 5:30 PM Pacific',
    image: '/assets/mehdicohen-global-weekly.png',
    imageAlt: 'True Legacy Global English weekly presentation flyer',
    detailsUrl: '/events/global',
    zoomUrl: 'https://us06web.zoom.us/j/88577734807?pwd=C02Pr5lK6HEYyXsXiBo1wqAS7ZcVLV.1',
    detailsLabel: 'View Event Details',
    zoomLabel: 'Join Zoom',
  },
  {
    id: 'latam',
    eyebrow: 'LATAM · Español',
    title: 'La Revolución del Biohacking Llega a LATAM',
    subtitle: 'Presentación de productos y negocio en vivo',
    schedule: 'Cada jueves · 7:00 PM Colombia / 8:00 PM Eastern',
    image: '/assets/mehdicohen-latam-weekly.png',
    imageAlt: 'Flyer de la presentación semanal True Legacy LATAM',
    detailsUrl: '/events/latam',
    zoomUrl: 'https://us06web.zoom.us/j/84852244046?pwd=Ci7k3oLkcaBa5odDvrw6O9fokzXbK8.1',
    detailsLabel: 'Ver Detalles del Evento',
    zoomLabel: 'Entrar a Zoom',
  },
] as const

export default function EventsHubPage() {
  const { locale } = useLocaleContext()
  const copy = {
    en: { eyebrow: 'Weekly True Legacy presentations', title: 'Choose your live event.', subtitle: 'Explore the Global English or LATAM Spanish presentation. View all event details first or join the correct Zoom room directly.', globalSubtitle: 'Live product and business presentation', globalSchedule: 'Every Wednesday · 8:30 PM Eastern / 5:30 PM Pacific', globalDetails: 'View Event Details', zoom: 'Join Zoom', latamSubtitle: 'Live product and business presentation in Spanish', latamSchedule: 'Every Thursday · 7:00 PM Colombia / 8:00 PM Eastern', latamDetails: 'View Event Details' },
    es: { eyebrow: 'Presentaciones semanales True Legacy', title: 'Elige tu evento en vivo.', subtitle: 'Explora la presentación Global en inglés o LATAM en español. Consulta los detalles o entra directamente a la sala correcta de Zoom.', globalSubtitle: 'Presentación de productos y negocio en vivo', globalSchedule: 'Cada miércoles · 8:30 p. m. Este / 5:30 p. m. Pacífico', globalDetails: 'Ver detalles del evento', zoom: 'Entrar a Zoom', latamSubtitle: 'Presentación de productos y negocio en vivo', latamSchedule: 'Cada jueves · 7:00 p. m. Colombia / 8:00 p. m. Este', latamDetails: 'Ver detalles del evento' },
    fr: { eyebrow: 'Présentations hebdomadaires True Legacy', title: 'Choisissez votre événement en direct.', subtitle: 'Découvrez la présentation mondiale en anglais ou LATAM en espagnol. Consultez les détails ou rejoignez directement la bonne salle Zoom.', globalSubtitle: 'Présentation en direct des produits et de l’activité', globalSchedule: 'Chaque mercredi · 20 h 30 Est / 17 h 30 Pacifique', globalDetails: 'Voir les détails', zoom: 'Rejoindre Zoom', latamSubtitle: 'Présentation produits et activité en espagnol', latamSchedule: 'Chaque jeudi · 19 h Colombie / 20 h Est', latamDetails: 'Voir les détails' },
    pt: { eyebrow: 'Apresentações semanais True Legacy', title: 'Escolha seu evento ao vivo.', subtitle: 'Conheça a apresentação Global em inglês ou LATAM em espanhol. Veja os detalhes ou entre diretamente na sala correta do Zoom.', globalSubtitle: 'Apresentação ao vivo de produtos e negócio', globalSchedule: 'Toda quarta-feira · 20h30 Leste / 17h30 Pacífico', globalDetails: 'Ver detalhes do evento', zoom: 'Entrar no Zoom', latamSubtitle: 'Apresentação de produtos e negócio em espanhol', latamSchedule: 'Toda quinta-feira · 19h Colômbia / 20h Leste', latamDetails: 'Ver detalhes do evento' },
  }[locale]
  const events = EVENTS.map(event => event.id === 'global'
    ? { ...event, subtitle: copy.globalSubtitle, schedule: copy.globalSchedule, detailsLabel: copy.globalDetails, zoomLabel: copy.zoom }
    : { ...event, subtitle: copy.latamSubtitle, schedule: copy.latamSchedule, detailsLabel: copy.latamDetails, zoomLabel: copy.zoom })
  return (
    <div className="page-wrapper bg-[#060b1e] text-white">
      <SEO
        title="True Legacy Live Events | Global and LATAM"
        description="Choose the Global English or LATAM Spanish weekly True Legacy presentation, view the full details, and join live on Zoom."
        image="/assets/mehdicohen-global-weekly.png"
      />
      <Navbar />
      <main className="content-wrapper">
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.18),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(6,182,212,0.12),transparent_35%)]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">{copy.eyebrow}</p>
              <h1 className="mt-4 text-4xl font-black sm:text-5xl">{copy.title}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-300">{copy.subtitle}</p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
              {events.map(event => (
                <article key={event.id} className="w-full max-w-[480px] justify-self-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
                  <div className="aspect-[4/5] overflow-hidden bg-black/20">
                    <img src={event.image} alt={event.imageAlt} className="h-full w-full object-cover object-top transition duration-500 hover:scale-[1.02]" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{event.eyebrow}</p>
                    <h2 className="mt-3 text-2xl font-black sm:text-3xl">{event.title}</h2>
                    <p className="mt-2 text-slate-400">{event.subtitle}</p>
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
                      <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                      <span>{event.schedule}</span>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Link to={event.detailsUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-center font-bold hover:bg-white/10">
                        <CalendarDays className="h-5 w-5" />{event.detailsLabel}
                      </Link>
                      <a href={event.zoomUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-center font-bold text-slate-950 hover:bg-cyan-400">
                        {event.zoomLabel}<ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
