import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { crmSupabase, getPublicDistributors } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'
import { ArrowUpRight, BookOpen, BriefcaseBusiness, CalendarDays, Globe2, Instagram, Languages, MapPin, Phone, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

export default function DistributorProfilePage() {
  const { slug } = useParams()
  const { locale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(undefined)

  useEffect(() => {
    getPublicDistributors().then(items => setProfile(items.find(item => item.slug === slug) || null))
  }, [slug])

  useEffect(() => {
    if (!profile || !crmSupabase) return
    void crmSupabase.rpc('crm_track_share_click', { p_slug: profile.slug, p_campaign: 'profile', p_locale: locale })
  }, [profile, locale])

  if (profile === null) return <NotFoundPage />

  const title = locale === 'es' ? 'Conecta con este distribuidor' : locale === 'fr' ? 'Contactez ce distributeur' : locale === 'pt' ? 'Conecte-se com este distribuidor' : 'Connect with this distributor'
  const cta = locale === 'es' ? 'Enviar mi interés' : locale === 'fr' ? 'Envoyer ma demande' : locale === 'pt' ? 'Enviar meu interesse' : 'Submit my interest'
  const firstName = profile?.display_name.split(' ')[0] || 'your leader'
  const profileHeroAssets: Record<string, string> = {
    'jesse-schexnayder': '/leaders/jesse-hero-transparent.png',
    'mehdi-cohen': '/leaders/mehdi-hero.png',
    'simon-loh': '/leaders/simon-hero.png',
    'ming-way-sia': '/leaders/mingway-hero.png',
    'zah-naderi': '/leaders/zah-hero.png',
    'magaly-cardona': '/leaders/magaly-hero.png',
    'ryan-pool': '/leaders/ryan-hero.png',
    'alex-gonzalez': '/leaders/alex-hero-transparent.png',
    'emanuela-doustova': '/leaders/emanuela-hero-transparent.png',
  }
  const profileHero = profile ? profileHeroAssets[profile.slug] || profile.avatar_url || '/logos/tl-square-white.png' : '/logos/tl-square-white.png'
  const currentProfilePhoto = profile?.avatar_url || profileHero
  const landingPages = [
    { slug: 'business', eyebrow: 'Build', label: 'Explore the business', text: `See how ${firstName} approaches leadership, duplication, and building a legacy-driven business.`, cta: 'See the opportunity', icon: BriefcaseBusiness, visual: 'business' },
    { slug: 'duo', eyebrow: 'Discover', label: 'Meet the True Legacy Duo', text: 'Explore the K8 and emGuarde GO through clear product demonstrations.', cta: 'Explore the Duo', icon: Sparkles, visual: 'duo' },
    { slug: 'training', eyebrow: 'Learn', label: 'Preview the training', text: 'See the education and support available inside the community.', cta: 'Preview the system', icon: BookOpen, visual: 'training' },
    { slug: 'events', eyebrow: 'Connect', label: 'Join a live event', text: 'Find the next English or Spanish community presentation.', cta: 'View live events', icon: CalendarDays, visual: 'events' },
  ]

  return <div className="page-wrapper bg-[#060b1e] text-white">
    <SEO title={`${profile?.display_name || 'Distributor'} | True Legacy World`} description={profile?.bio || 'True Legacy distributor profile and team attribution link.'} />
    <Navbar />
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-20 sm:px-6">
      {profile ? <><article className="mx-auto grid w-full max-w-4xl gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[280px_1fr] md:p-10">
        <img src={profile.avatar_url || '/logos/tl-square-white.png'} alt={profile.display_name} className="h-[360px] w-full rounded-2xl object-cover object-top" />
        <div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">True Legacy verified profile</p><h1 className="mt-3 text-4xl font-black">{profile.display_name}</h1><p className="mt-2 text-slate-400">{profile.title}</p><p className="mt-6 whitespace-pre-line leading-7 text-slate-300">{profile.bio}</p><div className="mt-6 grid gap-3 text-sm text-slate-300"><p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-cyan-300" /> {profile.regions.join(' · ')}</p><p className="flex items-center gap-3"><Languages className="h-4 w-4 text-cyan-300" /> {profile.languages.map(item => ({ en: 'English', zh: 'Mandarin', yue: 'Cantonese', ms: 'Malay', es: 'Spanish', fr: 'French', pt: 'Portuguese', ar: 'Arabic' }[item] ?? item.toUpperCase())).join(' · ')}</p><p className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-cyan-300" /> True Legacy team attribution</p>{profile.phone && <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 hover:text-cyan-200"><Phone className="h-4 w-4 text-cyan-300" /> {profile.phone}</a>}{profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cyan-200"><Instagram className="h-4 w-4 text-cyan-300" /> Instagram</a>}</div><div className="mt-8"><p className="mb-3 text-sm text-slate-400">{title}</p><Link to={`/apply?ref=${profile.referral_code}`} className="inline-flex rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold hover:bg-cyan-400">{cta}</Link></div></div>
      </article><section className="w-full py-5 sm:py-8 lg:py-12">
        <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Choose your experience</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Explore with {firstName}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Four clear ways to learn, connect, and take your next step. Every response stays personally connected to {profile.display_name}.</p>
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-semibold text-cyan-100">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Personalized to {firstName}
          </div>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:gap-7">
          {landingPages.map((item, index) => <Link key={item.slug} to={`/d/${profile.slug}/${item.slug}`} className="group relative flex min-h-[460px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#091329] shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition duration-500 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:shadow-[0_28px_80px_rgba(8,145,178,0.16)] sm:min-h-[500px]">
            <div className="relative h-52 shrink-0 overflow-hidden sm:h-60 lg:h-64">
              {item.visual === 'business' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_44%,rgba(34,211,238,0.2),transparent_38%),linear-gradient(135deg,#07142f,#0a2550)]" />
                <div aria-hidden="true" className="absolute -right-14 top-2 h-56 w-56 rounded-full border border-cyan-300/15 sm:h-64 sm:w-64" />
                <div className="absolute bottom-0 right-[5%] h-[94%] w-[72%] transition duration-700 group-hover:scale-[1.035]">
                  <img src={currentProfilePhoto} alt={`${profile.display_name} profile`} style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'center bottom' }} className="drop-shadow-[0_22px_34px_rgba(0,0,0,0.55)]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#06112d] via-[#06112d]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a1229]/70 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">A personal path with {firstName}</span>
              </>}
              {item.visual === 'duo' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,rgba(34,211,238,0.24),transparent_48%),linear-gradient(135deg,#07142f,#0b2450)]" />
                <img src="/products/k8.png" alt="K8 water ionizer" className="absolute bottom-2 left-[8%] h-[74%] w-[43%] object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] transition duration-700 group-hover:-translate-x-1 group-hover:scale-105" />
                <img src="/products/emguarde-go.png" alt="emGuarde GO" className="absolute bottom-1 right-[7%] h-[91%] w-[39%] object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)] transition duration-700 group-hover:translate-x-1 group-hover:scale-105" />
                <span className="absolute right-5 top-5 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-md">Water + environment</span>
              </>}
              {item.visual === 'training' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(34,211,238,0.18),transparent_46%),linear-gradient(135deg,#07142f,#0a2550)]" />
                <div className="absolute inset-x-[6%] bottom-0 flex h-[92%] items-end justify-center">
                  {['/leaders/standardized/simon-loh.png', '/leaders/standardized/mehdi-cohen.png', '/leaders/standardized/ming-way-sia.png'].map((src, leaderIndex) => <img key={src} src={src} alt="True Legacy leader" className={`h-[86%] w-[36%] rounded-t-2xl border border-white/15 object-cover object-top shadow-2xl shadow-black/40 transition duration-700 group-hover:-translate-y-1 ${leaderIndex === 1 ? 'z-20 h-[96%] -mx-3' : 'z-10 opacity-90'}`} />)}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a1229]/80 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">Learn · apply · duplicate</span>
              </>}
              {item.visual === 'events' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(245,158,11,0.18),transparent_42%),linear-gradient(135deg,#07142f,#0a2550)]" />
                <div className="absolute inset-x-[8%] bottom-3 top-3 flex items-center justify-center gap-3 sm:gap-4">
                  <img src="/assets/mehdicohen-global-weekly.png" alt="Unlock Your True Legacy global English event" className="h-[92%] min-w-0 flex-1 rounded-lg object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.45)] transition duration-700 group-hover:-translate-y-1 group-hover:-rotate-1" />
                  <img src="/assets/mehdicohen-latam-weekly.png" alt="La Revolución del Biohacking LATAM Spanish event" className="h-[92%] min-w-0 flex-1 rounded-lg object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.45)] transition duration-700 group-hover:-translate-y-1 group-hover:rotate-1" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#071126]/50 via-transparent to-[#071126]/10" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a1229]/80 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-amber-200/25 bg-amber-400/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur-md">English + Spanish events</span>
              </>}
            </div>
            <div className="relative flex flex-1 flex-col border-t border-white/[0.07] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-3"><span className="inline-flex rounded-xl border border-cyan-200/20 bg-cyan-200/10 p-2.5"><item.icon className="h-5 w-5 text-cyan-200" /></span><span className="text-[10px] font-bold tracking-[0.22em] text-slate-500">0{index + 1}</span></span>
                <ArrowUpRight className="h-5 w-5 text-slate-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
              </div>
              <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">{item.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{item.label}</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-5 text-xs font-bold uppercase tracking-[0.14em] text-cyan-200"><span>{item.cta}</span><span aria-hidden="true" className="inline-block text-lg transition-transform duration-300 group-hover:translate-x-1">→</span></div>
            </div>
          </Link>)}
        </div>
      </section></> : <div className="w-full animate-pulse rounded-3xl border border-white/10 p-20 text-center text-slate-500">Loading verified profile…</div>}
    </main>
    <Footer />
  </div>
}
