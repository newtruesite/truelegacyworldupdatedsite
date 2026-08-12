import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { COUNTRIES } from '@/lib/countries'
import { crmConfigured, getPublicDistributors, submitCrmApplication } from '@/lib/crm'
import type { LeadInterest, PublicDistributor } from '@/lib/crm'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'

const COPY = {
  en: {
    eyebrow: 'Team lead routing', title: 'Let’s connect you with the right person.',
    intro: 'Tell us what you are interested in and who introduced you. Referral attribution is respected; visitors without a referrer can choose an available distributor.',
    name: 'Full name', email: 'Email', phone: 'Phone or WhatsApp', country: 'Country', selectCountry: 'Select your country',
    interest: 'What are you interested in?', referred: 'Did someone refer you to True Legacy?', yes: 'Yes', no: 'No',
    who: 'Who referred you?', whoPlaceholder: 'Name, handle, or referral code', choose: 'Choose a distributor', selectDistributor: 'Select a distributor',
    growth: 'Additional verified team profiles can be added as the platform grows.',
    consent: 'I consent to having my information routed to the named referrer or selected independent distributor for follow-up. I have reviewed the', privacy: 'Privacy Policy',
    submit: 'Send my application', submitting: 'Sending securely…', successTitle: 'Application received.',
    success: 'Your information was securely recorded with its referral and team attribution. The appropriate distributor can now follow up.',
    directory: 'View Distributor Profiles', error: 'We could not securely submit your application. Please try again.',
    setup: 'The private CRM connection is being finalized. No information was transmitted. Please return after the team confirms the secure connection.',
    referredThrough: 'Referred through',
  },
  es: {
    eyebrow: 'Asignación de prospectos', title: 'Conectémosle con la persona correcta.',
    intro: 'Cuéntenos qué le interesa y quién le presentó True Legacy. Respetamos la atribución; si no tiene referente, puede elegir un distribuidor.',
    name: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono o WhatsApp', country: 'País', selectCountry: 'Seleccione su país',
    interest: '¿Qué le interesa?', referred: '¿Alguien le recomendó True Legacy?', yes: 'Sí', no: 'No',
    who: '¿Quién le recomendó?', whoPlaceholder: 'Nombre, usuario o código de referencia', choose: 'Elija un distribuidor', selectDistributor: 'Seleccione un distribuidor',
    growth: 'Se añadirán más perfiles verificados a medida que crezca la plataforma.',
    consent: 'Autorizo que mi información se dirija a mi referente o al distribuidor seleccionado para seguimiento. He revisado la', privacy: 'Política de Privacidad',
    submit: 'Enviar mi solicitud', submitting: 'Enviando de forma segura…', successTitle: 'Solicitud recibida.',
    success: 'Su información fue guardada de forma segura con la atribución correspondiente. El distribuidor apropiado puede darle seguimiento.',
    directory: 'Ver distribuidores', error: 'No pudimos enviar su solicitud de forma segura. Inténtelo de nuevo.',
    setup: 'La conexión privada del CRM se está finalizando. No se transmitió información. Regrese cuando el equipo confirme la conexión segura.',
    referredThrough: 'Referido por',
  },
  fr: {
    eyebrow: 'Routage des contacts', title: 'Connectons-vous à la bonne personne.',
    intro: 'Dites-nous ce qui vous intéresse et qui vous a présenté True Legacy. Les recommandations sont respectées; sans référent, vous pouvez choisir un distributeur.',
    name: 'Nom complet', email: 'E-mail', phone: 'Téléphone ou WhatsApp', country: 'Pays', selectCountry: 'Choisissez votre pays',
    interest: 'Qu’est-ce qui vous intéresse?', referred: 'Quelqu’un vous a-t-il recommandé True Legacy?', yes: 'Oui', no: 'Non',
    who: 'Qui vous a recommandé?', whoPlaceholder: 'Nom, identifiant ou code de parrainage', choose: 'Choisissez un distributeur', selectDistributor: 'Sélectionnez un distributeur',
    growth: 'D’autres profils vérifiés seront ajoutés à mesure que la plateforme grandira.',
    consent: 'J’accepte que mes informations soient transmises à mon référent ou au distributeur choisi pour le suivi. J’ai consulté la', privacy: 'Politique de confidentialité',
    submit: 'Envoyer ma demande', submitting: 'Envoi sécurisé…', successTitle: 'Demande reçue.',
    success: 'Vos informations ont été enregistrées avec leur attribution. Le distributeur approprié peut maintenant vous contacter.',
    directory: 'Voir les distributeurs', error: 'Votre demande n’a pas pu être envoyée. Veuillez réessayer.',
    setup: 'La connexion CRM privée est en cours de finalisation. Aucune information n’a été transmise. Revenez après confirmation de la connexion sécurisée.',
    referredThrough: 'Recommandé par',
  },
  pt: {
    eyebrow: 'Roteamento de contatos', title: 'Vamos conectar você à pessoa certa.',
    intro: 'Conte o que lhe interessa e quem apresentou a True Legacy. A indicação é respeitada; sem indicador, você pode escolher um distribuidor.',
    name: 'Nome completo', email: 'E-mail', phone: 'Telefone ou WhatsApp', country: 'País', selectCountry: 'Selecione seu país',
    interest: 'Qual é o seu interesse?', referred: 'Alguém indicou a True Legacy para você?', yes: 'Sim', no: 'Não',
    who: 'Quem indicou você?', whoPlaceholder: 'Nome, usuário ou código de indicação', choose: 'Escolha um distribuidor', selectDistributor: 'Selecione um distribuidor',
    growth: 'Mais perfis verificados serão adicionados à medida que a plataforma crescer.',
    consent: 'Autorizo que minhas informações sejam encaminhadas ao meu indicador ou ao distribuidor escolhido para acompanhamento. Li a', privacy: 'Política de Privacidade',
    submit: 'Enviar minha inscrição', submitting: 'Enviando com segurança…', successTitle: 'Inscrição recebida.',
    success: 'Suas informações foram registradas com segurança e com a atribuição correta. O distribuidor apropriado poderá entrar em contato.',
    directory: 'Ver distribuidores', error: 'Não foi possível enviar sua inscrição com segurança. Tente novamente.',
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const referralCode = useMemo(() => new URLSearchParams(location.search).get('ref')?.trim().toLowerCase() || '', [location.search])
  const presetInterest = useMemo(() => new URLSearchParams(location.search).get('interest')?.trim().toLowerCase() || '', [location.search])
  const referralDistributor = distributors.find((item) => item.slug === referralCode || item.referral_code === referralCode)

  useEffect(() => {
    getPublicDistributors().then(setDistributors)
  }, [])

  useEffect(() => {
    if (referralCode && referralDistributor) setHasReferrer('Yes')
  }, [referralCode, referralDistributor])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!crmConfigured) {
      setError(t.setup)
      return
    }
    const data = new FormData(event.currentTarget)
    setSubmitting(true)
    try {
      await submitCrmApplication({
        fullName: String(data.get('fullName') || ''),
        email: String(data.get('email') || ''),
        phone: String(data.get('phone') || ''),
        country: String(data.get('country') || ''),
        interest: String(data.get('interest') || ''),
        hasReferrer: hasReferrer === 'Yes',
        referredBy: referralDistributor?.display_name || String(data.get('referredBy') || ''),
        referralCode: referralDistributor?.referral_code || referralCode,
        selectedDistributor: String(data.get('selectedDistributor') || ''),
        locale,
        sourcePath: `${location.pathname}${location.search}`,
        consent: data.get('consent') === 'on',
        privacyVersion: '2026-08-phase-1',
        website: String(data.get('website') || ''),
      })
      setSubmitted(true)
    } catch {
      setError(t.error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper bg-[#060b1e] text-white">
      <SEO title="True Legacy Interest and Referral Form" description="Tell True Legacy what you are interested in, who referred you, and which distributor should assist you." />
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">{t.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-slate-300">{t.intro}</p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
            <h2 className="text-xl font-semibold">{t.successTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t.success}</p>
            <Link to={locale === 'es' || locale === 'pt' ? '/latam/distributors' : '/distributors'} className="mt-5 inline-flex rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold hover:bg-cyan-400">{t.directory}</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" name="website" /></label></div>
            {referralDistributor && <div className="flex items-center gap-4 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4"><img src={referralDistributor.avatar_url || '/logos/tl-square-white.png'} alt="" className="h-14 w-14 rounded-full object-cover" /><div><p className="text-xs uppercase tracking-wider text-cyan-200">{t.referredThrough}</p><p className="font-semibold">{referralDistributor.display_name}</p></div></div>}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-slate-300">{t.name}<input required name="fullName" autoComplete="name" minLength={2} maxLength={160} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>
              <label className="text-sm text-slate-300">{t.email}<input required type="email" name="email" autoComplete="email" maxLength={254} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>
              <label className="text-sm text-slate-300">{t.phone}<input name="phone" autoComplete="tel" maxLength={50} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>
              <label className="text-sm text-slate-300">{t.country}<select required name="country" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1020] px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"><option value="">{t.selectCountry}</option>{COUNTRIES.map(country => <option key={country.slug} value={country.slug}>{country.name}</option>)}</select></label>
            </div>

            <fieldset><legend className="text-sm font-semibold text-white">{t.interest}</legend><div className="mt-3 grid gap-2">{INTERESTS.map(interest => <label key={interest.value} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300"><input required type="radio" name="interest" value={interest.value} defaultChecked={presetInterest === interest.value} className="mt-1" />{interest.labels[locale]}</label>)}</div></fieldset>

            {!referralDistributor && <fieldset><legend className="text-sm font-semibold text-white">{t.referred}</legend><div className="mt-3 flex gap-3">{[{ value: 'Yes', label: t.yes }, { value: 'No', label: t.no }].map(item => <label key={item.value} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm"><input required type="radio" name="hasReferrer" value={item.value} onChange={() => setHasReferrer(item.value)} />{item.label}</label>)}</div></fieldset>}

            {hasReferrer === 'Yes' && !referralDistributor && <label className="block text-sm text-slate-300">{t.who}<input required name="referredBy" maxLength={160} placeholder={t.whoPlaceholder} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>}
            {hasReferrer === 'No' && <label className="block text-sm text-slate-300">{t.choose}<select required name="selectedDistributor" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1020] px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"><option value="">{t.selectDistributor}</option>{distributors.map(distributor => <option key={distributor.slug} value={distributor.slug}>{distributor.display_name} — {distributor.regions.join(' & ')}</option>)}</select><span className="mt-2 block text-xs text-slate-500">{t.growth}</span></label>}

            <label className="flex items-start gap-3 text-xs leading-5 text-slate-400"><input required type="checkbox" name="consent" className="mt-1" />{t.consent} <Link to="/legal/privacy" className="text-cyan-300 underline">{t.privacy}</Link>.</label>
            {error && <p role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">{error}</p>}
            <button disabled={submitting} type="submit" className="w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-white hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-60">{submitting ? t.submitting : t.submit}</button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
