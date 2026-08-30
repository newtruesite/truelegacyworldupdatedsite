import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { COUNTRIES } from '@/lib/countries'
import { crmConfigured, getPublicDistributors, submitCrmApplication } from '@/lib/crm'
import type { LeadInterest, PublicDistributor } from '@/lib/crm'
import { BriefcaseBusiness, Check, Copy, ExternalLink, GraduationCap, MessageCircle, MessageSquare, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'

const COPY = {
  en: {
    eyebrow: 'Team lead routing',
    title: 'Let’s connect you with the right person.',
    intro: 'Tell us what you are interested in and who introduced you. Referral attribution is respected; visitors without a referrer can choose an available distributor.',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone or WhatsApp',
    country: 'Country',
    selectCountry: 'Select your country',
    interest: 'What are you interested in?',
    multipleAllowed: 'Select all that apply',
    customInterestLabel: 'Other / Write your own interest',
    customInterestPlaceholder: 'Type your specific interest here...',
    commentsLabel: 'Comments or Questions (Optional)',
    commentsPlaceholder: 'Tell us anything specific you’d like to ask or share...',
    interestRequired: 'Please select at least one interest or specify your own.',
    referred: 'Did someone refer you to True Legacy?',
    yes: 'Yes',
    no: 'No',
    who: 'Who referred you?',
    whoPlaceholder: 'Name, handle, or referral code',
    choose: 'Choose a distributor',
    selectDistributor: 'Select a distributor',
    growth: 'Additional verified team profiles can be added as the platform grows.',
    submit: 'Send my request',
    submitting: 'Sending securely…',
    successTitle: 'Request received.',
    success: 'Your information was securely recorded with its referral and team attribution. The appropriate distributor can now follow up.',
    directory: 'View Distributor Profiles',
    error: 'We could not securely submit your request. Please try again.',
    setup: 'The private CRM connection is being finalized. No information was transmitted. Please return after the team confirms the secure connection.',
    referredThrough: 'Referred through',
  },
  es: {
    eyebrow: 'Asignación de prospectos',
    title: 'Conectémosle con la persona correcta.',
    intro: 'Cuéntenos qué le interesa y quién le presentó True Legacy. Respetamos la atribución; si no tiene referente, puede elegir un distribuidor.',
    name: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono o WhatsApp',
    country: 'País',
    selectCountry: 'Seleccione su país',
    interest: '¿Qué le interesa?',
    multipleAllowed: 'Seleccione todas las que apliquen',
    customInterestLabel: 'Otro / Escriba su propio interés',
    customInterestPlaceholder: 'Escriba su interés específico aquí...',
    commentsLabel: 'Comentarios o Preguntas (Opcional)',
    commentsPlaceholder: 'Cuéntenos cualquier detalle o pregunta que tenga...',
    interestRequired: 'Por favor seleccione al menos un interés o especifique el suyo.',
    referred: '¿Alguien le recomendó True Legacy?',
    yes: 'Sí',
    no: 'No',
    who: '¿Quién le recomendó?',
    whoPlaceholder: 'Nombre, usuario o código de referencia',
    choose: 'Elija un distribuidor',
    selectDistributor: 'Seleccione un distribuidor',
    growth: 'Se añadirán más perfiles verificados a medida que crezca la plataforma.',
    submit: 'Enviar mi solicitud',
    submitting: 'Enviando de forma segura…',
    successTitle: 'Solicitud recibida.',
    success: 'Su información fue guardada de forma segura con la atribución correspondiente. El distribuidor apropiado puede darle seguimiento.',
    directory: 'Ver distribuidores',
    error: 'No pudimos enviar su solicitud de forma segura. Inténtelo de nuevo.',
    setup: 'La conexión privada del CRM se está finalizando. No se transmitió información. Regrese cuando el equipo confirme la conexión segura.',
    referredThrough: 'Referido por',
  },
  fr: {
    eyebrow: 'Routage des contacts',
    title: 'Connectons-vous à la bonne personne.',
    intro: 'Dites-nous ce qui vous intéresse et qui vous a présenté True Legacy. Les recommandations sont respectées; sans référent, vous pouvez choisir un distributeur.',
    name: 'Nom complet',
    email: 'E-mail',
    phone: 'Téléphone ou WhatsApp',
    country: 'Pays',
    selectCountry: 'Choisissez votre pays',
    interest: 'Qu’est-ce qui vous intéresse?',
    multipleAllowed: 'Sélectionnez tout ce qui s’applique',
    customInterestLabel: 'Autre / Précisez votre intérêt',
    customInterestPlaceholder: 'Indiquez votre intérêt ici...',
    commentsLabel: 'Commentaires ou Questions (Facultatif)',
    commentsPlaceholder: 'Partagez vos questions ou précisions éventuelles...',
    interestRequired: 'Veuillez sélectionner au moins un intérêt ou préciser le vôtre.',
    referred: 'Quelqu’un vous a-t-il recommandé True Legacy?',
    yes: 'Oui',
    no: 'Non',
    who: 'Qui vous a recommandé?',
    whoPlaceholder: 'Nom, identifiant ou code de parrainage',
    choose: 'Choisissez un distributeur',
    selectDistributor: 'Sélectionnez un distributeur',
    growth: 'D’autres profils vérifiés seront ajoutés à mesure que la plateforme grandira.',
    submit: 'Envoyer ma demande',
    submitting: 'Envoi sécurisé…',
    successTitle: 'Demande reçue.',
    success: 'Vos informations ont été enregistrées avec leur attribution. Le distributeur approprié peut maintenant vous contacter.',
    directory: 'Voir les distributeurs',
    error: 'Votre demande n’a pas pu être envoyée. Veuillez réessayer.',
    setup: 'La connexion CRM privée est en cours de finalisation. Aucune information n’a été transmise. Revenez après confirmation de la connexion sécurisée.',
    referredThrough: 'Recommandé par',
  },
  pt: {
    eyebrow: 'Roteamento de contatos',
    title: 'Vamos conectar você à pessoa certa.',
    intro: 'Conte o que lhe interessa e quem apresentou a True Legacy. A indicação é respeitada; sem indicador, você pode escolher um distribuidor.',
    name: 'Nome completo',
    email: 'E-mail',
    phone: 'Telefone ou WhatsApp',
    country: 'País',
    selectCountry: 'Selecione seu país',
    interest: 'Qual é o seu interesse?',
    multipleAllowed: 'Selecione todas as que se aplicam',
    customInterestLabel: 'Outro / Escreva seu próprio interesse',
    customInterestPlaceholder: 'Digite seu interesse específico aqui...',
    commentsLabel: 'Comentários ou Dúvidas (Opcional)',
    commentsPlaceholder: 'Conte-nos qualquer detalhe ou dúvida que você tenha...',
    interestRequired: 'Por favor selecione ao menos um interesse ou especifique o seu.',
    referred: 'Alguém indicou a True Legacy para você?',
    yes: 'Sim',
    no: 'Não',
    who: 'Quem indicou você?',
    whoPlaceholder: 'Nome, usuário ou código de indicação',
    choose: 'Escolha um distribuidor',
    selectDistributor: 'Selecione um distribuidor',
    growth: 'Mais perfis verificados serão adicionados à medida que a plataforma crescer.',
    submit: 'Enviar minha solicitação',
    submitting: 'Enviando com segurança…',
    successTitle: 'Solicitação recebida.',
    success: 'Suas informações foram registradas com segurança e com a atribuição correta. O distribuidor apropriado poderá entrar em contato.',
    directory: 'Ver distribuidores',
    error: 'Não foi possível enviar sua solicitação com segurança. Tente novamente.',
    setup: 'A conexão privada do CRM está sendo finalizada. Nenhuma informação foi transmitida. Volte após a confirmação da conexão segura.',
    referredThrough: 'Indicado por',
  },
} as const

const INTERESTS: Array<{ value: LeadInterest; labels: Record<'en' | 'es' | 'fr' | 'pt', string> }> = [
  { value: 'product', labels: { en: 'Product information for myself or my family', es: 'Información de productos para mí o mi familia', fr: 'Informations produits pour moi ou ma famille', pt: 'Informações de produtos para mim ou minha família' } },
  { value: 'duo', labels: { en: 'K8 + emGuarde GO Duo package', es: 'Paquete Duo K8 + emGuarde GO', fr: 'Pack Duo K8 + emGuarde GO', pt: 'Pacote Duo K8 + emGuarde GO' } },
  { value: 'distributor', labels: { en: 'Independent distributor opportunity', es: 'Oportunidad de distribuidor independiente', fr: 'Opportunité de distributeur indépendant', pt: 'Oportunidade de distribuidor independente' } },
  { value: 'training', labels: { en: 'Training and team support', es: 'Capacitación y apoyo de equipo', fr: 'Formation et soutien d’équipe', pt: 'Treinamento e suporte de equipe' } },
  { value: 'events', labels: { en: 'Events and community', es: 'Eventos y comunidad', fr: 'Événements et communauté', pt: 'Eventos e comunidade' } },
]

export default function ApplicationPage() {
  const { locale } = useLocaleContext()
  const location = useLocation()
  const t = COPY[locale]
  const [hasReferrer, setHasReferrer] = useState('')
  const [distributors, setDistributors] = useState<PublicDistributor[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submittedLead, setSubmittedLead] = useState<{
    fullName: string
    phone: string
    distributorSlug: string
    distributorName: string
  } | null>(null)
  const [copiedSlug, setCopiedSlug] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const referralCode = useMemo(() => new URLSearchParams(location.search).get('ref')?.trim().toLowerCase() || '', [location.search])
  const presetInterest = useMemo(() => new URLSearchParams(location.search).get('interest')?.trim().toLowerCase() || '', [location.search])
  const presetCountry = useMemo(() => new URLSearchParams(location.search).get('country')?.trim().toLowerCase() || '', [location.search])
  const referralDistributor = distributors.find((item) => item.slug === referralCode || item.referral_code === referralCode)

  // Multi-interest state
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const preset = searchParams.get('interest')?.trim().toLowerCase()
    if (preset && ['product', 'duo', 'distributor', 'training', 'events'].includes(preset)) {
      return [preset]
    }
    return ['duo']
  })
  const [customInterestChecked, setCustomInterestChecked] = useState(false)
  const [customInterestText, setCustomInterestText] = useState('')
  const [comments, setComments] = useState('')

  useEffect(() => {
    getPublicDistributors().then(setDistributors)
  }, [])

  useEffect(() => {
    if (referralCode && referralDistributor) setHasReferrer('Yes')
  }, [referralCode, referralDistributor])

  useEffect(() => {
    if (presetInterest && ['product', 'duo', 'distributor', 'training', 'events'].includes(presetInterest)) {
      setSelectedInterests((prev) => (prev.includes(presetInterest) ? prev : [...prev, presetInterest]))
    }
  }, [presetInterest])

  const toggleInterest = (val: string) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    )
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!crmConfigured) {
      setError(t.setup)
      return
    }

    if (selectedInterests.length === 0 && (!customInterestChecked || !customInterestText.trim())) {
      setError(t.interestRequired)
      return
    }

    const data = new FormData(event.currentTarget)
    const fullName = String(data.get('fullName') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const country = String(data.get('country') || '').trim()
    const selectedDistributorSlug = String(data.get('selectedDistributor') || '')
    const matchedDistributor = referralDistributor || distributors.find(d => d.slug === selectedDistributorSlug) || distributors[0]

    // Determine primary interest enum for database compatibility
    const primaryInterest =
      selectedInterests.find((i) => ['duo', 'product', 'distributor', 'training', 'events'].includes(i)) ||
      'duo'

    // Combine all interests for descriptive logging and source tracking
    const interestLabels = selectedInterests
      .map((val) => INTERESTS.find((item) => item.value === val)?.labels[locale] || val)
    if (customInterestChecked && customInterestText.trim()) {
      interestLabels.push(`Other: ${customInterestText.trim()}`)
    }
    const combinedInterestsString = interestLabels.join(', ')

    // Enriched source path with parameters
    const sourceUrlParams = new URLSearchParams()
    if (selectedInterests.length) sourceUrlParams.set('interests', selectedInterests.join(','))
    if (customInterestText.trim()) sourceUrlParams.set('custom_interest', customInterestText.trim())
    if (comments.trim()) sourceUrlParams.set('note', comments.trim().slice(0, 80))
    const enrichedSourcePath = `${location.pathname}?${sourceUrlParams.toString()}`.slice(0, 300)

    setSubmitting(true)
    try {
      await submitCrmApplication({
        fullName,
        email,
        phone,
        country,
        interest: primaryInterest,
        selectedInterests,
        customInterest: customInterestChecked ? customInterestText.trim() : undefined,
        allInterests: combinedInterestsString,
        comments: comments.trim(),
        hasReferrer: hasReferrer === 'Yes',
        referredBy: referralDistributor?.display_name || String(data.get('referredBy') || ''),
        referralCode: referralDistributor?.referral_code || referralCode,
        selectedDistributor: selectedDistributorSlug,
        locale,
        sourcePath: enrichedSourcePath,
        consent: true, // Automatically approved on submission
        privacyVersion: '2026-08-phase-1',
        website: String(data.get('website') || ''),
      })
      setSubmittedLead({
        fullName,
        phone,
        distributorSlug: matchedDistributor?.slug || referralDistributor?.slug || 'mehdi-cohen',
        distributorName: matchedDistributor?.display_name || referralDistributor?.display_name || 'True Legacy',
      })
      setSubmitted(true)
    } catch {
      setError(t.error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper bg-black text-white">
      <SEO title="True Legacy Interest and Referral Form" description="Tell True Legacy what you are interested in, who referred you, and which distributor should assist you." />
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2997ff]">{t.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-[#cccccc]">{t.intro}</p>

        {submitted ? (
          <div className="mt-10 space-y-8">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
              <h2 className="text-xl font-semibold text-white">{t.successTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[#cccccc]">{t.success}</p>
            </div>

            {/* 3 Core Landing Pages Options */}
            <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2997ff]">
                  {locale === 'es' ? 'Enviar o Explorar Páginas de Destino' : 'Send or Explore Landing Pages'}
                </p>
              </div>
              <h3 className="text-2xl font-black text-white">
                {locale === 'es' ? 'Elige una de las 3 páginas de presentación' : 'Choose from 3 presentation landing pages'}
              </h3>
              <p className="mt-2 text-sm text-[#cccccc]">
                {locale === 'es'
                  ? 'Puedes enviar estas páginas personalizadas directamente por WhatsApp o abrirlas para explorar:'
                  : 'You can send these personalized pages directly via WhatsApp or open them to explore:'}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    id: 'business',
                    title: locale === 'es' ? 'Oportunidad de Negocio' : 'Business Opportunity',
                    desc: locale === 'es' ? 'Modelo independiente, liderazgo y duplicación.' : 'Independent distributor model, leadership, and duplication.',
                    badge: 'BUSINESS',
                    icon: BriefcaseBusiness,
                    path: `/d/${submittedLead?.distributorSlug || 'mehdi-cohen'}/business`,
                    color: 'from-amber-500/10 to-amber-500/0 border-amber-400/20 text-amber-300',
                  },
                  {
                    id: 'duo',
                    title: locale === 'es' ? 'Dúo K8 + emGuarde' : 'True Legacy Duo',
                    desc: locale === 'es' ? 'Demostraciones de agua Kangen y tecnología EMF.' : 'Kangen Water & emGuarde GO product demonstrations.',
                    badge: 'PRODUCTS',
                    icon: Sparkles,
                    path: `/d/${submittedLead?.distributorSlug || 'mehdi-cohen'}/duo`,
                    color: 'from-cyan-500/10 to-cyan-500/0 border-cyan-400/20 text-[#2997ff]',
                  },
                  {
                    id: 'training',
                    title: locale === 'es' ? 'Academia de Liderazgo' : 'Leadership Academy',
                    desc: locale === 'es' ? 'Sistema de capacitación, duplicación y eventos.' : 'Training system, duplication tools, and live education.',
                    badge: 'TRAINING',
                    icon: GraduationCap,
                    path: `/d/${submittedLead?.distributorSlug || 'mehdi-cohen'}/training`,
                    color: 'from-violet-500/10 to-violet-500/0 border-violet-400/20 text-violet-300',
                  },
                ].map((item) => {
                  const fullUrl = `${window.location.origin}${item.path}`
                  const firstName = submittedLead?.fullName?.split(' ')[0] || ''
                  const leadPhone = submittedLead?.phone?.replace(/\D/g, '') || ''
                  const waMsg = encodeURIComponent(
                    locale === 'es'
                      ? `Hola ${firstName}, aquí tienes la información de ${item.title} de True Legacy: ${fullUrl}`
                      : `Hi ${firstName}, here is the True Legacy ${item.title} page for you: ${fullUrl}`
                  )
                  const waUrl = leadPhone ? `https://wa.me/${leadPhone}?text=${waMsg}` : `https://wa.me/?text=${waMsg}`
                  const Icon = item.icon

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-5 transition-all hover:border-white/25 hover:shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10 ${item.color}`}>
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#86868b] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="mt-3 font-bold text-white text-base">{item.title}</h4>
                        <p className="mt-1 text-xs text-[#cccccc] leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="mt-5 space-y-2 pt-3 border-t border-white/10">
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-md"
                        >
                          {locale === 'es' ? 'Abrir Página' : 'Open Page'}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 text-[11px] font-bold text-emerald-300 transition-colors"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </a>
                          <button
                            type="button"
                            onClick={async () => {
                              await navigator.clipboard.writeText(fullUrl)
                              setCopiedSlug(item.id)
                              setTimeout(() => setCopiedSlug(''), 1500)
                            }}
                            className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2 text-[11px] font-bold text-white transition-colors"
                          >
                            {copiedSlug === item.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                {locale === 'es' ? 'Copiado' : 'Copied'}
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 text-cyan-400" />
                                {locale === 'es' ? 'Copiar' : 'Copy'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                to={locale === 'es' || locale === 'pt' ? '/latam/distributors' : '/distributors'}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {t.directory}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" name="website" /></label></div>
            {referralDistributor && (
              <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-cyan-400/10 p-4">
                <img src={referralDistributor.avatar_url || '/logos/tl-square-white.png'} alt="" className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#2997ff]">{t.referredThrough}</p>
                  <p className="font-semibold text-white">{referralDistributor.display_name}</p>
                </div>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-[#cccccc]">
                {t.name}
                <input required name="fullName" autoComplete="name" minLength={2} maxLength={160} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/20 focus:outline-none" />
              </label>
              <label className="text-sm text-[#cccccc]">
                {t.email}
                <input required type="email" name="email" autoComplete="email" maxLength={254} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/20 focus:outline-none" />
              </label>
              <label className="text-sm text-[#cccccc]">
                {t.phone}
                <input name="phone" autoComplete="tel" maxLength={50} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/20 focus:outline-none" />
              </label>
              <label className="text-sm text-[#cccccc]">
                {t.country}
                <select required name="country" defaultValue={COUNTRIES.some(country => country.slug === presetCountry) ? presetCountry : ''} className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white focus:border-white/20 focus:outline-none">
                  <option value="">{t.selectCountry}</option>
                  {COUNTRIES.map(country => <option key={country.slug} value={country.slug}>{country.name}</option>)}
                </select>
              </label>
            </div>

            {/* Interests Section - Multi-select + Custom option */}
            <fieldset className="space-y-3">
              <div className="flex items-center justify-between">
                <legend className="text-sm font-semibold text-white">{t.interest}</legend>
                <span className="text-xs text-[#86868b]">{t.multipleAllowed}</span>
              </div>
              <div className="grid gap-2">
                {INTERESTS.map((interest) => {
                  const isChecked = selectedInterests.includes(interest.value)
                  return (
                    <label
                      key={interest.value}
                      className={`flex items-center gap-3.5 rounded-xl border px-4 py-3 text-sm transition-all cursor-pointer ${
                        isChecked
                          ? 'border-cyan-500/50 bg-cyan-500/10 text-white font-medium shadow-sm'
                          : 'border-white/10 bg-black/20 text-[#cccccc] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleInterest(interest.value)}
                        className="h-4 w-4 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
                      />
                      <span className="flex-1 select-none">{interest.labels[locale]}</span>
                    </label>
                  )
                })}

                {/* Custom Interest Option at the bottom */}
                <div
                  className={`rounded-xl border transition-all ${
                    customInterestChecked
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-white/10 bg-black/20 hover:border-white/20'
                  }`}
                >
                  <label className="flex items-center gap-3.5 px-4 py-3 text-sm text-[#cccccc] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customInterestChecked}
                      onChange={(e) => setCustomInterestChecked(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
                    />
                    <span className="font-medium text-white select-none">{t.customInterestLabel}</span>
                  </label>
                  {customInterestChecked && (
                    <div className="px-4 pb-3.5 pt-1">
                      <input
                        type="text"
                        value={customInterestText}
                        onChange={(e) => setCustomInterestText(e.target.value)}
                        placeholder={t.customInterestPlaceholder}
                        maxLength={160}
                        autoFocus
                        className="w-full rounded-lg border border-white/20 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder:text-[#86868b] focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Comments / Questions Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                {t.commentsLabel}
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t.commentsPlaceholder}
                maxLength={1000}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-[#86868b] focus:border-white/20 focus:outline-none resize-y"
              />
            </div>

            {/* Referrer Attribution */}
            {!referralDistributor && (
              <fieldset>
                <legend className="text-sm font-semibold text-white">{t.referred}</legend>
                <div className="mt-3 flex gap-3">
                  {[
                    { value: 'Yes', label: t.yes },
                    { value: 'No', label: t.no },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm cursor-pointer hover:border-white/20">
                      <input required type="radio" name="hasReferrer" value={item.value} onChange={() => setHasReferrer(item.value)} />
                      {item.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {hasReferrer === 'Yes' && !referralDistributor && (
              <label className="block text-sm text-[#cccccc]">
                {t.who}
                <input required name="referredBy" maxLength={160} placeholder={t.whoPlaceholder} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/20 focus:outline-none" />
              </label>
            )}

            {hasReferrer === 'No' && (
              <label className="block text-sm text-[#cccccc]">
                {t.choose}
                <select required name="selectedDistributor" className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white focus:border-white/20 focus:outline-none">
                  <option value="">{t.selectDistributor}</option>
                  {distributors.map(distributor => <option key={distributor.slug} value={distributor.slug}>{distributor.display_name} — {distributor.regions.join(' & ')}</option>)}
                </select>
                <span className="mt-2 block text-xs text-[#86868b]">{t.growth}</span>
              </label>
            )}

            {error && (
              <p role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                {error}
              </p>
            )}

            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? t.submitting : t.submit}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
