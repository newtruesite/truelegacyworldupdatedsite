import { SEO } from '@/components/SEO'
import { Navbar } from '@/components/layout/Navbar'
import { AppPageHeader } from '@/components/layout/AppPageHeader'
import { getActiveProfileLandingCards } from '@/config/profileLandingCards'
import { crmConfigured, crmSupabase, getCrmDistributors, getCrmMembership } from '@/lib/crm'
import type { CrmDistributor, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Copy,
  ExternalLink,
  QrCode,
  Share2,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocaleContext, type Locale } from '@/contexts/LocaleContext'
import { Link } from 'react-router-dom'

interface SharePageItem {
  id: string
  label: string
  description: string
  icon: any
  getPath: (slug: string) => string
  badge?: string
}

const PORTUGUESE_CARD_COPY: Record<string, { label: string; description: string; badge: string }> = {
  duo: { label: 'Conheça o Duo K8 + emGuarde GO', description: 'Veja como duas tecnologias complementares apoiam a água que você bebe e o ambiente ao seu redor.', badge: 'O DUO' },
  kangen: { label: 'Conheça o Leveluk K8', description: 'Conheça o principal ionizador doméstico da Enagic e os cinco tipos de água que ele produz.', badge: 'IONIZAÇÃO' },
  emguarde: { label: 'Entenda a proteção emGuarde®', description: 'Conheça a tecnologia portátil de ressonância harmônica e como ela se integra ao dia a dia.', badge: 'PROTEÇÃO' },
  business: { label: 'Conheça a oportunidade de negócio', description: 'Veja o modelo de distribuidor independente, a orientação e o sistema de apoio da True Legacy.', badge: 'OPORTUNIDADE' },
  training: { label: 'Aprenda, lidere e construa com confiança', description: 'Acesse treinamentos, recursos e um caminho organizado para desenvolver suas habilidades.', badge: 'ACADEMIA' },
  events: { label: 'Viva a True Legacy ao vivo', description: 'Participe de chamadas semanais, apresentações e eventos da comunidade True Legacy.', badge: 'EVENTOS AO VIVO' },
  products: { label: 'Explore a coleção de produtos', description: 'Conheça a linha completa de produtos japoneses de bem-estar da Enagic.', badge: 'VITRINE' },
  anespa: { label: 'Transforme seu banho diário', description: 'Conheça o sistema de banho mineral Anespa DX para uma experiência de spa em casa.', badge: 'BEM-ESTAR EM CASA' },
  jr4: { label: 'Conheça o Leveluk JrIV', description: 'Explore o sistema compacto de água Kangen para espaços e rotinas menores.', badge: 'SISTEMA COMPACTO' },
  beaute: { label: 'Conheça Kangen Beauté', description: 'Explore o ritual japonês de cuidados com a pele em três etapas.', badge: 'RITUAL DE BELEZA' },
  wagyu: { label: 'Descubra Kangen Wagyu', description: 'Conheça uma experiência culinária premium criada para a comunidade True Legacy.', badge: 'EXPERIÊNCIA CULINÁRIA' },
  ukon: { label: 'Conheça Kangen Ukon Sigma', description: 'Explore a fórmula japonesa de cúrcuma de Okinawa para o bem-estar diário.', badge: 'BEM-ESTAR DIÁRIO' },
}

function getAllPages(locale: Locale): SharePageItem[] {
  const lang: 'en' | 'es' | 'fr' = locale === 'es' ? 'es' : locale === 'fr' ? 'fr' : 'en'
  const leaderLabel = locale === 'es' ? 'tu líder de True Legacy' : locale === 'fr' ? 'votre leader True Legacy' : locale === 'pt' ? 'seu líder True Legacy' : 'your True Legacy leader'
  return [
  {
    id: 'profile',
    label: locale === 'es' ? 'Mi perfil' : locale === 'fr' ? 'Mon profil' : locale === 'pt' ? 'Meu perfil' : 'My Profile',
    description: locale === 'es' ? 'Tu perfil de líder verificado, biografía, mercados, idiomas y canales de contacto directo.' : locale === 'fr' ? 'Votre profil de leader vérifié, votre biographie, vos marchés, vos langues et vos moyens de contact.' : locale === 'pt' ? 'Seu perfil de líder verificado, biografia, mercados, idiomas e canais de contato direto.' : 'Your verified leader profile, biography, markets, languages, and direct contact channels.',
    icon: UserRound,
    getPath: (slug) => `/d/${slug}`,
    badge: locale === 'es' ? 'Centro' : locale === 'fr' ? 'Accueil' : locale === 'pt' ? 'Central' : 'Hub',
  },
  ...getActiveProfileLandingCards().map((card): SharePageItem => ({
    id: card.id,
    label: locale === 'pt' && PORTUGUESE_CARD_COPY[card.id] ? PORTUGUESE_CARD_COPY[card.id].label : card.title[lang] || card.title.en,
    description: locale === 'pt' && PORTUGUESE_CARD_COPY[card.id] ? PORTUGUESE_CARD_COPY[card.id].description : (card.description[lang] || card.description.en)(leaderLabel),
    icon: card.icon,
    getPath: card.getPath,
    badge: locale === 'pt' && PORTUGUESE_CARD_COPY[card.id] ? PORTUGUESE_CARD_COPY[card.id].badge : card.categoryLabel[lang] || card.categoryLabel.en,
  })),
  ]
}

export default function AppSharePage() {
  const { locale } = useLocaleContext()
  const allPages = useMemo(() => getAllPages(locale), [locale])
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [selectedDistributorId, setSelectedDistributorId] = useState<string>('')
  const [selected, setSelected] = useState<string>('profile')
  const [copied, setCopied] = useState(false)
  const [copiedRaw, setCopiedRaw] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [loading, setLoading] = useState(crmConfigured)

  useEffect(() => {
    if (!crmSupabase) return
    crmSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !crmSupabase) return
    Promise.all([getCrmMembership(session.user.id), getCrmDistributors()])
      .then(([member, items]) => {
        setMembership(member)
        setDistributors(items)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session?.user.id])

  const matchedDistributor = useMemo(() => {
    if (!session) return null
    if (membership?.distributor_id) {
      const byId = distributors.find((item) => item.id === membership.distributor_id)
      if (byId) return byId
    }
    const email = session?.user.email?.trim().toLowerCase()
    if (email) {
      const byEmail = distributors.find((item) => item.login_email?.trim().toLowerCase() === email)
      if (byEmail) return byEmail
    }
    return (
      (membership?.role === 'admin'
        ? distributors.find((item) => item.slug === 'mehdi-cohen' && item.active) || distributors.find((item) => item.active)
        : null) || null
    )
  }, [distributors, membership, session])

  useEffect(() => {
    if (!selectedDistributorId && matchedDistributor) setSelectedDistributorId(matchedDistributor.id)
  }, [matchedDistributor, selectedDistributorId])

  const distributor = useMemo(
    () => (session ? distributors.find((item) => item.id === selectedDistributorId) || matchedDistributor : null),
    [distributors, matchedDistributor, selectedDistributorId, session]
  )

  const page = allPages.find((item) => item.id === selected) || allPages[0]

  const url = useMemo(() => {
    if (!distributor) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.truelegacyworld.com'
    return `${origin}${page.getPath(distributor.slug)}`
  }, [distributor, page])

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=720x720&data=${encodeURIComponent(url)}`

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1300)
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: page.label,
        text: page.description,
        url,
      })
    } else {
      await copy()
    }
  }

  if (!crmConfigured)
    return (
      <Message
        title="Share Center connection required"
        body="The secure distributor connection is unavailable in this preview."
      />
    )

  if (loading) return <main className="min-h-screen bg-black" />

  if (!session)
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="grid min-h-[calc(100vh-80px)] place-items-center bg-black p-5 text-white">
          <SEO title="Share & Connect | True Legacy" description="Sign in required to share pages." noIndex />
          <div className="mx-auto max-w-md text-center py-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.04] p-3 shadow-xl">
              <Share2 className="h-8 w-8 text-[#2997ff]" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[.24em] text-[#2997ff]">Share & Connect</p>
            <h1 className="mt-2 text-3xl font-black text-white">Sign In Required</h1>
            <p className="mt-3 text-sm leading-6 text-[#cccccc]">
              Please sign in with your verified distributor account to generate your personal landing page links, track inquiries, and download your personalized QR codes.
            </p>
            <div className="mt-8 space-y-3">
              <Link
                to="/crm"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2997ff] px-6 font-black text-slate-950 transition-colors hover:bg-cyan-300 cursor-pointer"
              >
                Distributor Sign In <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/leaders/apply"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 font-black text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer"
              >
                Sign Up Now — Apply for Leadership <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-white/15 text-sm font-semibold text-[#cccccc] hover:bg-white/5 transition-colors cursor-pointer"
              >
                Visit Public Website
              </Link>
            </div>
          </div>
        </main>
      </div>
    )

  if (!distributor)
    return (
      <Message
        title="Distributor profile required"
        body="This distributor login has not been connected to an active profile yet. Please ask a True Legacy administrator to link it."
      />
    )

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="min-h-screen bg-black px-4 pb-28 pt-6 text-white sm:px-6">
        <SEO
          title="True Legacy Share Center"
          description="Choose and share personalized distributor landing pages."
          noIndex
        />
        <div className="mx-auto max-w-6xl">
        <AppPageHeader
          eyebrow="DUPLICATION TOOLS"
          title="Share Center"
          description={`Choose and share personalized landing pages for ${distributor.display_name}.`}
          backTo="/app"
          maxWidthClass="max-w-6xl"
        >
          {/* Distributor identity header */}
          <section className="grid gap-5 rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-400/[.1] to-blue-500/[.04] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7">
            <img
              src={distributor.avatar_url || '/icons/icon-192.png'}
              alt={distributor.display_name}
              className="h-20 w-20 rounded-2xl border border-white/15 bg-black object-cover object-top"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2997ff]">Sharing as</p>
              {membership?.role === 'admin' || !session ? (
                <select
                  aria-label="Choose distributor profile"
                  value={distributor.id}
                  onChange={(event) => setSelectedDistributorId(event.target.value)}
                  className="mt-1 font-black bg-black/50 text-xl border border-white/20 rounded-xl px-3 py-1.5 text-white"
                >
                  {distributors
                    .filter((item) => item.active)
                    .map((item) => (
                      <option key={item.id} value={item.id} className="bg-slate-900 text-white">
                        {item.display_name}
                      </option>
                    ))}
                </select>
              ) : (
                <h2 className="text-2xl font-black text-white">{distributor.display_name}</h2>
              )}
              <p className="mt-1 text-xs text-[#cccccc]">
                {distributor.title || 'Verified Distributor'} · Every page keeps your referral attribution and contact details.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/d/${distributor.slug}`}
                target="_blank"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-xs font-bold text-white hover:bg-white/5 transition"
              >
                View Profile <ExternalLink className="h-4 w-4 text-cyan-400" />
              </Link>
            </div>
          </section>
        </AppPageHeader>

        {/* 1. CHOOSE WHAT TO SHARE */}
        <section className="mt-8 px-4 sm:px-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">1 · Choose what to share</p>
            <span className="text-xs text-[#86868b]">
              {allPages.length} individual pages
            </span>
          </div>

          {/* Every active personalized page in one visible selector. */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allPages.map((item) => {
              const Icon = item.icon
              const active = item.id === selected
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelected(item.id)
                    setShowQrModal(false)
                  }}
                  className={`share-choice ${active ? 'is-active' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>
                      <Icon className="h-5 w-5" />
                    </span>
                    {item.badge && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                  {active && <Check className="share-choice__check" />}
                </button>
              )
            })}
          </div>
        </section>

        {/* 2. SHARE LINK PREVIEW & ACTIONS */}
        <section className="mt-8 overflow-hidden rounded-[28px] border border-white/20 bg-white/[.035]">
          <div className="p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#2997ff]">2 · Share {page.label}</p>
            <h2 className="mt-2 text-2xl font-black">Ready for your next conversation</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#cccccc]">
              {page.description} The lead remains connected to {distributor.display_name} inside the True Legacy
              system.
            </p>
            <p className="mt-5 break-all rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-[#2997ff]">
              {url}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button onClick={share} className="share-primary">
                <Share2 />
                Share now
              </button>
              <button onClick={copy} className="share-secondary">
                <Copy />
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={() => setShowQrModal((value) => !value)} className="share-secondary">
                <QrCode />
                QR code
              </button>
              <a href={url} target="_blank" rel="noreferrer" className="share-secondary">
                <ExternalLink />
                Preview
              </a>
            </div>
          </div>
          {showQrModal && (
            <div className="grid gap-6 border-t border-white/10 bg-black/20 p-5 sm:grid-cols-[220px_1fr] sm:items-center sm:p-7">
              <div className="rounded-2xl bg-white p-3">
                <img src={qrUrl} alt={`${page.label} QR code`} className="w-full" />
              </div>
              <div>
                <h3 className="text-xl font-black">Scan to open {page.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#cccccc]">
                  Use this QR code at presentations, events, or in printed materials. It opens your selected
                  personalized page.
                </p>
                <a
                  href={qrUrl}
                  download={`${distributor.slug}-${page.id}-qr.png`}
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-cyan-400 px-5 font-black text-slate-950"
                >
                  Download QR
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  </div>
  )
}

function Message({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-5 text-white">
      <div className="max-w-md text-center">
        <Sparkles className="mx-auto h-10 w-10 text-[#2997ff]" />
        <h1 className="mt-5 text-3xl font-black">{title}</h1>
        <p className="mt-4 text-[#cccccc]">{body}</p>
        {action && <div className="mt-7">{action}</div>}
      </div>
    </main>
  )
}
