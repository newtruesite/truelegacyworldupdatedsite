import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { getPublicDistributors } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { localizedProductVideo } from '@/lib/productVideos'
import { ArrowRight, BookOpen, BriefcaseBusiness, Check, Copy, Instagram, MessageCircle, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

type LandingVariant = 'business' | 'duo' | 'training'

const VARIANTS: Record<LandingVariant, {
  eyebrow: string
  headline: (name: string) => string
  subheadline: string
  interest: 'distributor' | 'duo' | 'training'
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
}

const BENEFITS: Record<LandingVariant, string[]> = {
  business: ['A product-centered independent business', 'A simple system designed for duplication', 'Weekly education and leadership support', 'A global team with local distributor attribution'],
  duo: ['Kangen Water education centered on the Leveluk K8', 'Portable emGuarde GO product education', 'Two separate product videos below', 'Market availability confirmed with your distributor'],
  training: ['A structured training library', 'Product and presentation education', 'Weekly English and Spanish team calls', 'Leadership, media, and follow-up development'],
}

function whatsappUrl(profile: PublicDistributor, variant: LandingVariant) {
  if (!profile.phone) return null
  const subject = variant === 'duo' ? 'the Duo products' : variant === 'business' ? 'the True Legacy business' : 'the True Legacy training system'
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

  return <div className="page-wrapper bg-[#05091a] text-white">
    <SEO
      title={`${profile?.display_name || 'True Legacy'} | ${variant === 'duo' ? 'Duo Products' : variant === 'business' ? 'Business Presentation' : 'Training'}`}
      description={copy?.subheadline || ''}
      image={profile?.avatar_url || undefined}
    />
    <Navbar />
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.2),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200"><Icon className="h-4 w-4" />{copy?.eyebrow}</div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] sm:text-6xl">{copy?.headline(profile?.display_name || 'your True Legacy distributor')}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy?.subheadline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold hover:bg-emerald-400"><MessageCircle className="h-5 w-5" />Connect with {profile?.display_name}</a>}
              <Link to={applyUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold hover:bg-cyan-400">Request information <ArrowRight className="h-5 w-5" /></Link>
              <button onClick={share} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"><Copy className="h-4 w-4" />{copied ? 'Link copied' : 'Share this page'}</button>
            </div>
          </div>
          {profile ? <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-cyan-950/30">
            <img src={profile.avatar_url || '/logos/tl-square-white.png'} alt={profile.display_name} className="h-[430px] w-full rounded-2xl object-cover object-top" />
            <div className="px-2 pb-1 pt-5"><p className="text-2xl font-black">{profile.display_name}</p><p className="mt-1 text-sm text-slate-400">{profile.title} · {profile.regions.join(' · ')}</p><div className="mt-4 flex flex-wrap gap-3">{profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-pink-300 hover:text-white"><Instagram className="h-4 w-4" />Instagram</a>}<Link to={`/d/${profile.slug}`} className="text-sm text-cyan-300 hover:text-white">Full profile</Link></div></div>
          </aside> : <div className="h-[520px] animate-pulse rounded-3xl bg-white/5" />}
        </div>
      </section>

      {profile && <section className="px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Why {profile.display_name} shared this</p><h2 className="mt-3 text-3xl font-black">A personal introduction—not a generic advertisement.</h2><div className="mt-6 whitespace-pre-line leading-7 text-slate-300">{profile.bio}</div></div>
        <div className="grid gap-3 sm:grid-cols-2">{BENEFITS[variant].map(item => <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-200"><Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />{item}</div>)}</div>
      </div></section>}

      {variant === 'duo' && <section className="border-y border-white/10 bg-[#080e24] px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto max-w-6xl"><div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">The Duo product presentation</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Watch each product story.</h2><p className="mt-4 text-slate-300">These videos provide an introduction. Product availability and official specifications vary by market, so confirm details directly with {profile?.display_name}.</p></div><div className="grid gap-8 lg:grid-cols-2"><div><YouTubeEmbed url={waterDemoUrl} title="Leveluk K8 Kangen Water system" /><h3 className="mt-4 text-xl font-bold">Leveluk K8</h3><p className="mt-2 text-sm leading-6 text-slate-400">The featured flagship Kangen Water ionizer for home water education.</p></div><div><YouTubeEmbed url={emguardeDemoUrl} title="emGuarde GO portable product" /><h3 className="mt-4 text-xl font-bold">emGuarde GO</h3><p className="mt-2 text-sm leading-6 text-slate-400">A compact, rechargeable set of two designed for portable use. Availability varies by market.</p></div></div></div></section>}

      {variant === 'business' && <section className="border-y border-white/10 bg-[#080e24] px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"><YouTubeEmbed url="https://youtu.be/lB5fW55DmaI?si=HzPbgiwUup9u5UN-" title="True Legacy Duo business presentation" /><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Business through education</p><h2 className="mt-3 text-3xl font-black">Share products. Develop people. Duplicate a clear process.</h2><p className="mt-5 leading-7 text-slate-300">True Legacy supports independent distributors with product education, presentations, mentoring, and CRM-based referral attribution. This is an independent business opportunity—not employment or guaranteed income.</p><Link to={applyUrl} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold hover:bg-cyan-400">Explore with {profile?.display_name}<ArrowRight className="h-5 w-5" /></Link></div></div></section>}

      {variant === 'training' && <section className="border-y border-white/10 bg-[#080e24] px-4 py-16 sm:px-6 md:py-24"><div className="mx-auto max-w-6xl"><div className="grid gap-8 md:grid-cols-3">{[['Product mastery','Build confidence with structured product and presentation education.'],['Leadership systems','Learn prospecting, follow-up, communication, media, and duplication.'],['Global community','Join weekly calls and learn alongside leaders across featured markets.']].map(([title,text],i)=><article key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">{i===0?<PlayCircle />:i===1?<BookOpen />:<ShieldCheck />}</div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></article>)}</div><div className="mt-10 flex flex-col items-center rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-8 text-center"><h2 className="text-3xl font-black">Preview the system. Join through your distributor.</h2><p className="mt-4 max-w-2xl text-slate-300">Training content remains protected by the current team access code. Submit your interest through {profile?.display_name} to learn about access and team support.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link to={applyUrl} className="rounded-xl bg-cyan-500 px-6 py-3 font-bold hover:bg-cyan-400">Request training information</Link><Link to="/training" className="rounded-xl border border-white/15 px-6 py-3 font-bold hover:bg-white/5">Training login</Link></div></div></div></section>}

      <section className="px-4 py-16 text-center sm:px-6 md:py-24"><div className="mx-auto max-w-3xl"><h2 className="text-3xl font-black">Ready to continue with {profile?.display_name}?</h2><p className="mt-4 text-slate-300">Your inquiry will be attributed directly to this distributor inside the True Legacy team CRM.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-500 px-6 py-3 font-bold hover:bg-emerald-400">Message on WhatsApp</a>}<Link to={applyUrl} className="rounded-xl bg-cyan-500 px-6 py-3 font-bold hover:bg-cyan-400">Submit my interest</Link></div><p className="mt-8 text-xs leading-5 text-slate-500">Independent distributor presentation. Product information is educational and not medical advice. Earnings are not guaranteed; individual results vary.</p></div></section>
    </main>
    <Footer />
  </div>
}
