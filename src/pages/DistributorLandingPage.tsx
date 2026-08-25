import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { crmSupabase, getPublicDistributors } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { localizedProductVideo } from '@/lib/productVideos'
import { ArrowRight, BookOpen, BriefcaseBusiness, CalendarDays, Check, Clock3, Copy, Instagram, MessageCircle, PlayCircle, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

type LandingVariant = 'business' | 'duo' | 'training' | 'events'

const VARIANTS: Record<LandingVariant, {
  eyebrow: string
  headline: (name: string) => string
  subheadline: string
  interest: 'distributor' | 'duo' | 'training' | 'events'
  icon: typeof BriefcaseBusiness
}> = {
  business: {
    eyebrow: 'A personalized True Legacy presentation',
    headline: (name) => `Build with purpose alongside ${name}`,
    subheadline: 'Discover a product-based independent business built around education, leadership, duplication, and long-term community support.',
    interest: 'distributor',
    icon: BriefcaseBusiness,
  },
  duo: {
    eyebrow: 'Two technologies · One personalized introduction',
    headline: (name) => `Explore the Duo with ${name}`,
    subheadline: 'Learn about the Leveluk K8 Kangen Water system and the portable emGuarde GO set, then connect directly with the distributor who shared this page.',
    interest: 'duo',
    icon: Sparkles,
  },
  training: {
    eyebrow: 'True Legacy Leadership Academy',
    headline: (name) => `Train, grow, and build with ${name}`,
    subheadline: 'See how True Legacy supports independent distributors with product education, leadership development, practical systems, and a global learning community.',
    interest: 'training',
    icon: BookOpen,
  },
  events: {
    eyebrow: 'Weekly True Legacy live events',
    headline: (name) => `Join a live presentation with ${name}`,
    subheadline: 'Meet the community, learn about the products and independent distributor opportunity, and ask questions during a live weekly call.',
    interest: 'events',
    icon: CalendarDays,
  },
}

const BENEFITS: Record<LandingVariant, string[]> = {
  business: ['A product-centered independent business', 'A simple system designed for duplication', 'Weekly education and leadership support', 'A global team with local distributor attribution'],
  duo: ['Kangen Water education centered on the Leveluk K8', 'Portable emGuarde GO product education', 'Two separate product videos below', 'Market availability confirmed with your distributor'],
  training: ['A structured training library', 'Product and presentation education', 'Weekly English and Spanish team calls', 'Leadership, media, and follow-up development'],
  events: ['Live product and business education', 'Open to members, prospects, and guests', 'English and Spanish weekly options', 'Direct follow-up with your referring distributor'],
}

const MEHDI_EVENT_PAGES = [
  {
    id: 'global',
    language: 'English',
    micro: 'Upcoming Live Event',
    headline: 'Unlock Your True Legacy',
    subheadline: 'Live Zoom Presentation',
    date: 'Every Wednesday',
    time: '8:30 PM Eastern / 5:30 PM Pacific',
    meetingId: '885 7773 4807',
    passcode: 'Truelegacy',
    image: '/assets/mehdicohen-global-weekly.png',
    imageAlt: 'True Legacy World Wednesday weekly presentation featuring the K8 and emGuarde GO',
    zoomUrl: 'https://us06web.zoom.us/j/88577734807?pwd=C02Pr5lK6HEYyXsXiBo1wqAS7ZcVLV.1',
    description: 'A direct, no-pressure introduction to the K8, emGuarde GO, and the team-based independent distributor model behind True Legacy.',
    topics: ['Product education for the K8 and emGuarde GO', 'An introduction to the independent distributor model', 'Leadership, community, and building beyond borders', 'Live questions with True Legacy team leaders'],
  },
  {
    id: 'latam',
    language: 'Español',
    micro: 'Evento en Vivo',
    headline: 'La Revolución del Biohacking Llega a LATAM',
    subheadline: 'Presentación en Vivo por Zoom',
    date: 'Cada jueves',
    time: '7:00 PM Colombia / 8:00 PM Eastern',
    meetingId: '848 5224 4046',
    passcode: 'Truelegacy',
    image: '/assets/mehdicohen-latam-weekly.png',
    imageAlt: 'Presentación semanal de True Legacy LATAM los jueves',
    zoomUrl: 'https://us06web.zoom.us/j/84852244046?pwd=Ci7k3oLkcaBa5odDvrw6O9fokzXbK8.1',
    description: 'Una conversación directa y sin presión sobre bienestar, tecnología y una oportunidad global pensada para LATAM.',
    topics: ['La tecnología de biohacking que está revolucionando el mercado', 'Una introducción clara al modelo de negocio y sus comisiones', 'Cómo comenzar sin experiencia previa', 'Primeros pasos para iniciar un negocio global desde casa'],
  },
] as const

function whatsappUrl(profile: PublicDistributor, variant: LandingVariant) {
  if (!profile.phone) return null
  const subject = variant === 'duo' ? 'the Duo products' : variant === 'business' ? 'the True Legacy business' : variant === 'events' ? 'the weekly True Legacy events' : 'the True Legacy training system'
  const message = `Hi ${profile.display_name}, I viewed your True Legacy page and would like to learn more about ${subject}.`
  return `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export default function DistributorLandingPage() {
  const { slug, campaign } = useParams()
  const { locale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(undefined)
  const [copied, setCopied] = useState(false)
  const variant = campaign && campaign in VARIANTS ? campaign as LandingVariant : null

  useEffect(() => {
    getPublicDistributors().then(items => setProfile(items.find(item => item.slug === slug) || null))
  }, [slug])

  useEffect(() => {
    if (!profile || !variant || !crmSupabase) return
    void crmSupabase.rpc('crm_track_share_click', { p_slug: profile.slug, p_campaign: variant, p_locale: locale })
  }, [profile, variant, locale])

  const shareUrl = typeof window === 'undefined' ? '' : window.location.href
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: profile ? `Connect with ${profile.display_name} | True Legacy` : 'True Legacy', url: shareUrl }).catch(() => undefined)
      return
    }
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const copy = useMemo(() => variant ? VARIANTS[variant] : null, [variant])
  if (!variant || profile === null) return <NotFoundPage />

  const Icon = copy?.icon || Sparkles
  const applyUrl = `/apply?ref=${profile?.referral_code || slug}&interest=${copy?.interest || 'duo'}&source=${variant}`
  const whatsapp = profile ? whatsappUrl(profile, variant) : null
  const waterDemoUrl = localizedProductVideo('kangenWater', locale)
  const emguardeDemoUrl = localizedProductVideo('emguardeGo', locale)

  return <div className="page-wrapper bg-black text-white">
    <SEO
      title={`${profile?.display_name || 'True Legacy'} | ${variant === 'duo' ? 'Duo Products' : variant === 'business' ? 'Business Presentation' : variant === 'events' ? 'Weekly Events' : 'Training'}`}
      description={copy?.subheadline || ''}
      image={profile?.avatar_url || undefined}
    />
    <Navbar />
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(6,182,212,0.14),transparent_45%),radial-gradient(circle_at_50%_70%,rgba(79,70,229,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl text-center flex flex-col items-center">
          {/* Centered Guide Badge */}
          {profile && (
            <Link
              to={`/d/${profile.slug}`}
              className="group mb-6 inline-flex items-center gap-3.5 rounded-full border border-white/15 bg-black/60 p-1.5 pr-5 backdrop-blur-xl shadow-2xl hover:border-cyan-400/40 hover:bg-black/80 transition-all duration-300 active:scale-95"
            >
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-[#141926] to-[#07090f]">
                <img
                  src={profile.avatar_url || '/logos/tl-square-white.png'}
                  alt={profile.display_name}
                  className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-black" title="Verified Distributor" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2997ff]">Your Verified Guide</span>
                  <ShieldCheck className="h-3 w-3 text-[#2997ff]" />
                </div>
                <p className="text-sm font-bold !text-white group-hover:text-cyan-300 transition-colors leading-tight">
                  {profile.display_name}
                </p>
              </div>
            </Link>
          )}

          {/* Campaign Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2997ff]">
            <Icon className="h-4 w-4" />
            {copy?.eyebrow}
          </div>

          {/* Main Hero Headline - Proportionate and Centered */}
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.12] !text-white tracking-tight max-w-3xl">
            {copy?.headline(profile?.display_name || 'your True Legacy distributor')}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-[#cccccc]">
            {copy?.subheadline}
          </p>

          {/* Action Buttons Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/10"
              >
                <MessageCircle className="h-5 w-5" />
                Connect with {profile?.display_name}
              </a>
            )}
            <Link
              to={applyUrl}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/10"
            >
              Request information <ArrowRight className="h-5 w-5" />
            </Link>
            <button
              onClick={share}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Link copied' : 'Share this page'}
            </button>
          </div>
        </div>
      </section>

      {profile && <section className="px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2997ff]">Why {profile.display_name} shared this</p><h2 className="mt-3 text-3xl font-black">A personal introduction—not a generic advertisement.</h2><div className="mt-6 whitespace-pre-line leading-7 text-[#cccccc]">{profile.bio}</div></div>
        <div className="grid gap-3 sm:grid-cols-2">{BENEFITS[variant].map(item => <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-200"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#2997ff]" />{item}</div>)}</div>
      </div></section>}

      {variant === 'duo' && <section className="border-y border-white/10 bg-black px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto max-w-6xl"><div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2997ff]">The Duo product presentation</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">See the Duo. Then watch each product story.</h2><p className="mt-4 text-[#cccccc]">These videos provide an introduction. Product availability and official specifications vary by market, so confirm details directly with {profile?.display_name}.</p></div><div className="mx-auto mb-12 grid max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-3xl border border-white/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-4 sm:gap-6 sm:p-8"><div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center"><img src="/products/k8.png" alt="Leveluk K8 Kangen Water ionizer" className="mx-auto h-40 w-full object-contain sm:h-64" /><h3 className="mt-3 font-bold">Leveluk K8</h3><p className="mt-1 text-xs text-[#cccccc]">Flagship water ionizer</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-cyan-400/15 text-[#2997ff] sm:h-14 sm:w-14"><Plus className="h-6 w-6" /></div><div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center"><img src="/products/emguarde-go.png" alt="emGuarde GO set of two" className="mx-auto h-40 w-full object-contain sm:h-64" /><h3 className="mt-3 font-bold">emGuarde GO</h3><p className="mt-1 text-xs text-[#cccccc]">Portable set of two</p></div></div><div className="grid gap-8 lg:grid-cols-2"><div><YouTubeEmbed url={waterDemoUrl} title="Leveluk K8 Kangen Water system" /><h3 className="mt-4 text-xl font-bold">Leveluk K8</h3><p className="mt-2 text-sm leading-6 text-[#cccccc]">The featured flagship Kangen Water ionizer for home water education.</p></div><div><YouTubeEmbed url={emguardeDemoUrl} title="emGuarde GO portable product" /><h3 className="mt-4 text-xl font-bold">emGuarde GO</h3><p className="mt-2 text-sm leading-6 text-[#cccccc]">A compact, rechargeable set of two designed for portable use. Availability varies by market.</p></div></div></div></section>}

      {variant === 'business' && <section className="border-y border-white/10 bg-black px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"><YouTubeEmbed url={locale === 'es' ? "https://youtu.be/t1OtNA4p8y4" : "https://youtu.be/lB5fW55DmaI?si=HzPbgiwUup9u5UN-"} title="True Legacy Duo business presentation" /><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2997ff]">Business through education</p><h2 className="mt-3 text-3xl font-black">Share products. Develop people. Duplicate a clear process.</h2><p className="mt-5 leading-7 text-[#cccccc]">True Legacy supports independent distributors with product education, presentations, mentoring, and CRM-based referral attribution. This is an independent business opportunity—not employment or guaranteed income.</p><Link to={applyUrl} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold hover:bg-cyan-400">Explore with {profile?.display_name}<ArrowRight className="h-5 w-5" /></Link></div></div></section>}

      {variant === 'training' && <section className="border-y border-white/10 bg-black px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto max-w-6xl"><div className="grid gap-8 md:grid-cols-3">{[['Product mastery','Build confidence with structured product and presentation education.'],['Leadership systems','Learn prospecting, follow-up, communication, media, and duplication.'],['Global community','Join weekly calls and learn alongside leaders across featured markets.']].map(([title,text],i)=><article key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-[#2997ff]">{i===0?<PlayCircle />:i===1?<BookOpen />:<ShieldCheck />}</div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#cccccc]">{text}</p></article>)}</div><div className="mt-10 flex flex-col items-center rounded-3xl border border-white/20 bg-cyan-400/[0.06] p-8 text-center"><h2 className="text-3xl font-black">Preview the system. Join through your distributor.</h2><p className="mt-4 max-w-2xl text-[#cccccc]">Training content remains protected by the current team access code. Submit your interest through {profile?.display_name} to learn about access and team support.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link to={applyUrl} className="rounded-xl bg-cyan-500 px-6 py-3 font-bold hover:bg-cyan-400">Request training information</Link><Link to="/training" className="rounded-xl border border-white/15 px-6 py-3 font-bold hover:bg-white/5">Training login</Link></div></div></div></section>}

      {variant === 'events' && <section className="border-y border-white/10 bg-black px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto max-w-6xl"><div className="mb-12 text-center"><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2997ff]">The two official MehdiCohen.com event presentations</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Choose your live experience.</h2><p className="mx-auto mt-4 max-w-2xl text-[#cccccc]">Join the English global presentation or the Spanish LATAM presentation, then follow up directly with {profile?.display_name}.</p></div><div className="space-y-12">{MEHDI_EVENT_PAGES.map((event, index) => <article key={event.id} className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] lg:grid-cols-2"><div className={index % 2 ? 'lg:order-2' : ''}><img src={event.image} alt={event.imageAlt} className="h-full min-h-[420px] w-full object-cover object-top" /></div><div className="flex flex-col justify-center p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2997ff]">{event.micro} · {event.language}</p><h3 className="mt-3 text-3xl font-black">{event.headline}</h3><p className="mt-2 text-lg font-bold text-slate-200">{event.subheadline}</p><p className="mt-5 leading-7 text-[#cccccc]">{event.description}</p><div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-[#cccccc] sm:grid-cols-2"><span className="inline-flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#2997ff]" />{event.date}</span><span className="inline-flex items-start gap-2"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#2997ff]" />{event.time}</span><span>Meeting ID: <strong className="text-white">{event.meetingId}</strong></span><span>Passcode: <strong className="text-white">{event.passcode}</strong></span></div><div className="mt-6 space-y-3">{event.topics.map(topic => <p key={topic} className="flex gap-3 text-sm text-[#cccccc]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2997ff]" />{topic}</p>)}</div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href={event.zoomUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-cyan-500 px-5 py-3 text-center font-bold hover:bg-cyan-400">{event.id === 'latam' ? 'Entrar a Zoom' : 'Join Zoom Meeting'}</a><Link to={applyUrl} className="rounded-xl border border-white/15 px-5 py-3 text-center font-bold hover:bg-white/5">Connect with {profile?.display_name}</Link></div></div></article>)}</div></div></section>}

      {profile && (
        <section className="px-4 py-16 sm:px-6 md:py-20">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#141926] via-[#090d16] to-[#04060a] p-8 sm:p-12 text-center shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_60%)]" />
            <div className="relative">
              <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-cyan-400/30 p-0.5 shadow-lg">
                <img
                  src={profile.avatar_url || '/logos/tl-square-white.png'}
                  alt={profile.display_name}
                  className="h-full w-full rounded-full object-cover object-top"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Ready to continue with {profile.display_name}?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#cccccc] leading-relaxed max-w-xl mx-auto">
                Your inquiry will be attributed directly to this leader inside the True Legacy team CRM.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/10 active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message {profile.display_name.split(' ')[0]} on WhatsApp
                  </a>
                )}
                <Link
                  to={applyUrl}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/10 active:scale-95"
                >
                  Submit my interest <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              <p className="mt-6 text-[11px] text-[#86868b]">
                Independent distributor presentation. Product information is educational and not medical advice. Earnings are not guaranteed; individual results vary.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
    <Footer />
  </div>
}
