import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { getPublicDistributors } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'
import { BookOpen, BriefcaseBusiness, CalendarDays, Globe2, Instagram, Languages, MapPin, Phone, Sparkles } from 'lucide-react'
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

  if (profile === null) return <NotFoundPage />

  const title = locale === 'es' ? 'Conecta con este distribuidor' : locale === 'fr' ? 'Contactez ce distributeur' : locale === 'pt' ? 'Conecte-se com este distribuidor' : 'Connect with this distributor'
  const cta = locale === 'es' ? 'Enviar mi interés' : locale === 'fr' ? 'Envoyer ma demande' : locale === 'pt' ? 'Enviar meu interesse' : 'Submit my interest'

  return <div className="page-wrapper bg-[#060b1e] text-white">
    <SEO title={`${profile?.display_name || 'Distributor'} | True Legacy World`} description={profile?.bio || 'True Legacy distributor profile and team attribution link.'} />
    <Navbar />
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-20 sm:px-6">
      {profile ? <><article className="grid w-full gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[280px_1fr] md:p-10">
        <img src={profile.avatar_url || '/logos/tl-square-white.png'} alt={profile.display_name} className="h-[360px] w-full rounded-2xl object-cover object-top" />
        <div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">True Legacy verified profile</p><h1 className="mt-3 text-4xl font-black">{profile.display_name}</h1><p className="mt-2 text-slate-400">{profile.title}</p><p className="mt-6 whitespace-pre-line leading-7 text-slate-300">{profile.bio}</p><div className="mt-6 grid gap-3 text-sm text-slate-300"><p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-cyan-300" /> {profile.regions.join(' · ')}</p><p className="flex items-center gap-3"><Languages className="h-4 w-4 text-cyan-300" /> {profile.languages.map(item => ({ en: 'English', zh: 'Mandarin', yue: 'Cantonese', ms: 'Malay', es: 'Spanish', fr: 'French', pt: 'Portuguese' }[item] ?? item.toUpperCase())).join(' · ')}</p><p className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-cyan-300" /> True Legacy team attribution</p>{profile.phone && <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 hover:text-cyan-200"><Phone className="h-4 w-4 text-cyan-300" /> {profile.phone}</a>}{profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cyan-200"><Instagram className="h-4 w-4 text-cyan-300" /> Instagram</a>}</div><div className="mt-8"><p className="mb-3 text-sm text-slate-400">{title}</p><Link to={`/apply?ref=${profile.referral_code}`} className="inline-flex rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold hover:bg-cyan-400">{cta}</Link></div></div>
      </article><section className="w-full"><p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Share {profile.display_name}'s landing pages</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
        { slug: 'business', label: 'Business Presentation', text: 'Leadership, duplication, and the independent opportunity.', icon: BriefcaseBusiness },
        { slug: 'duo', label: 'Duo Products', text: 'K8 and emGuarde GO with both product videos.', icon: Sparkles },
        { slug: 'training', label: 'Training System', text: 'Public preview of team education and support.', icon: BookOpen },
        { slug: 'events', label: 'Weekly Events', text: 'English and Spanish live calls with personalized follow-up.', icon: CalendarDays },
      ].map(item => <Link key={item.slug} to={`/d/${profile.slug}/${item.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"><item.icon className="h-6 w-6 text-cyan-300" /><h2 className="mt-4 font-bold group-hover:text-cyan-200">{item.label}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p></Link>)}</div></section></> : <div className="w-full animate-pulse rounded-3xl border border-white/10 p-20 text-center text-slate-500">Loading verified profile…</div>}
    </main>
    <Footer />
  </div>
}
