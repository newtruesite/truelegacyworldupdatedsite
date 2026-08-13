import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
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
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Weekly True Legacy presentations</p>
              <h1 className="mt-4 text-4xl font-black sm:text-5xl">Choose your live event.</h1>
              <p className="mt-5 text-lg leading-8 text-slate-300">Explore the Global English or LATAM Spanish presentation. View all event details first or join the correct Zoom room directly.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {EVENTS.map(event => (
                <article key={event.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
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
