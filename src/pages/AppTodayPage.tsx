import { SEO } from '@/components/SEO'
import { Navbar } from '@/components/layout/Navbar'
import { AppPageHeader } from '@/components/layout/AppPageHeader'
import { MemberStartingPlan } from '@/components/training/MemberStartingPlan'
import { readStartingPlan } from '@/lib/memberDirection'
import type { StartingPlan } from '@/lib/memberDirection'
import { chooseNextBestAction, followUpQueue, leadNextStep } from '@/lib/todayGuidance'
import type { NextBestActionKey } from '@/lib/todayGuidance'
import { crmConfigured, crmSupabase, getCrmDistributors, getCrmLeads, getCrmMembership } from '@/lib/crm'
import type { CrmDistributor, CrmLead, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { ArrowRight, BookOpenCheck, CalendarCheck2, CheckCircle2, Clock3, Compass, GraduationCap, HandHeart, Mail, MessageCircle, Sparkles, UserPlus, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { Link } from 'react-router-dom'

type Module = { id: string; position: number; category: string; title: Record<string, string>; video_url: string | null }
type Item = { id: string; position: number; title: Record<string, string> }
type Progress = { distributor_id: string; module_id?: string; item_id?: string; completed: boolean }
type Meeting = { id: string; distributor_id: string; guest_name: string; guest_email: string; starts_at: string; status: string }
type Relationship = { distributor_id: string; sponsor_distributor_id: string | null }

const todayCopy = {
  en: {
    eyebrow: 'YOUR DAILY OPERATING SYSTEM', title: 'Today', welcomeBack: 'Welcome back', welcome: 'Here is the shortest path to momentum.', recommended: 'recommended actions', next: 'YOUR NEXT MOVE', mentorEyebrow: 'YOUR MENTOR CONNECTION', mentorTitle: 'You do not have to do this alone.', mentorBody: (name: string) => `${name} is connected to your True Legacy account and can help you prepare for conversations, understand the system, and choose your next step.`, contact: 'Connect with', mentorPending: 'Your mentor connection is being confirmed.', mentorPendingBody: 'Continue with the Academy while your sponsor connection is completed.', academy: 'Open Academy', actions: {
      direction: ['Set your direction', 'Answer four quick questions so this page can guide you toward your goal.', '#starting-plan', 'Choose my focus'],
      overdue: ['Reconnect with the people waiting on you', 'Start with your overdue follow-ups. A thoughtful response is the best next move.', '/crm?attention=due', 'Open follow-ups'],
      meeting: ['Prepare for today’s conversation', 'Review the guest and the relevant presentation before your scheduled call.', '/app/bookings', 'Review bookings'],
      'new-lead': ['Welcome your newest contact', 'Make a human first connection and ask what they would most like to understand.', '/crm', 'Open new contacts'],
      setup: ['Complete your next setup step', 'Finish one onboarding action before adding more to your day.', '/crm/growth', 'Continue setup'],
      learning: ['Continue one Academy lesson', 'Build confidence by finishing the next lesson in your learning path.', '/training', 'Continue learning'],
      share: ['Start one meaningful conversation', 'Choose the page that fits the person, then send it with a personal message.', '/app/share', 'Choose a page'],
      bookings: ['Prepare your discovery-call link', 'Make it simple for the next interested person to choose a time with you.', '/app/bookings', 'Open bookings'],
      team: ['Support one team member', 'Review team progress and help one person move through their next step.', '/crm/growth', 'Review team progress'],
    },
  },
  es: {
    eyebrow: 'TU SISTEMA DIARIO', title: 'Hoy', welcomeBack: 'Bienvenido de nuevo', welcome: 'Este es el camino más corto para avanzar.', recommended: 'acciones recomendadas', next: 'TU SIGUIENTE PASO', mentorEyebrow: 'TU CONEXIÓN CON EL MENTOR', mentorTitle: 'No tienes que hacerlo solo.', mentorBody: (name: string) => `${name} está conectado a tu cuenta True Legacy y puede ayudarte a preparar conversaciones, entender el sistema y elegir tu siguiente paso.`, contact: 'Conectar con', mentorPending: 'Estamos confirmando tu conexión con el mentor.', mentorPendingBody: 'Continúa con la Academia mientras se completa la conexión con tu patrocinador.', academy: 'Abrir la Academia', actions: {
      direction: ['Define tu dirección', 'Responde cuatro preguntas rápidas para que esta página pueda guiarte hacia tu meta.', '#starting-plan', 'Elegir mi enfoque'], overdue: ['Reconecta con quienes esperan tu respuesta', 'Comienza con tus seguimientos vencidos. Una respuesta atenta es el mejor siguiente paso.', '/crm?attention=due', 'Abrir seguimientos'], meeting: ['Prepárate para la conversación de hoy', 'Revisa al invitado y la presentación adecuada antes de tu llamada.', '/app/bookings', 'Revisar reservas'], 'new-lead': ['Da la bienvenida a tu contacto más reciente', 'Haz una primera conexión humana y pregunta qué desea comprender.', '/crm', 'Abrir contactos nuevos'], setup: ['Completa tu siguiente paso de configuración', 'Termina una acción de incorporación antes de agregar más a tu día.', '/crm/growth', 'Continuar configuración'], learning: ['Continúa una lección de la Academia', 'Gana confianza terminando la siguiente lección de tu ruta.', '/training', 'Continuar aprendiendo'], share: ['Inicia una conversación significativa', 'Elige la página adecuada y envíala con un mensaje personal.', '/app/share', 'Elegir una página'], bookings: ['Prepara tu enlace de llamada', 'Facilita que la próxima persona interesada elija un horario contigo.', '/app/bookings', 'Abrir reservas'], team: ['Apoya a un miembro del equipo', 'Revisa el progreso y ayuda a una persona con su siguiente paso.', '/crm/growth', 'Revisar el equipo'],
    },
  },
  fr: {
    eyebrow: 'VOTRE SYSTÈME QUOTIDIEN', title: 'Aujourd’hui', welcomeBack: 'Bon retour', welcome: 'Voici le chemin le plus direct pour avancer.', recommended: 'actions recommandées', next: 'VOTRE PROCHAINE ACTION', mentorEyebrow: 'VOTRE LIEN AVEC LE MENTOR', mentorTitle: 'Vous n’avez pas à avancer seul(e).', mentorBody: (name: string) => `${name} est lié à votre compte True Legacy et peut vous aider à préparer vos conversations, comprendre le système et choisir la prochaine étape.`, contact: 'Contacter', mentorPending: 'Votre lien avec le mentor est en cours de confirmation.', mentorPendingBody: 'Poursuivez l’Académie pendant la confirmation de votre parrain.', academy: 'Ouvrir l’Académie', actions: {
      direction: ['Définissez votre direction', 'Répondez à quatre questions rapides afin que cette page vous guide vers votre objectif.', '#starting-plan', 'Choisir ma priorité'], overdue: ['Recontactez les personnes qui vous attendent', 'Commencez par vos suivis en retard. Une réponse attentionnée est la meilleure prochaine action.', '/crm?attention=due', 'Ouvrir les suivis'], meeting: ['Préparez la conversation du jour', 'Consultez le profil de l’invité et la présentation adaptée avant votre appel.', '/app/bookings', 'Voir les réservations'], 'new-lead': ['Accueillez votre nouveau contact', 'Créez un premier lien humain et demandez ce que la personne souhaite comprendre.', '/crm', 'Ouvrir les nouveaux contacts'], setup: ['Terminez la prochaine étape de configuration', 'Finalisez une action d’intégration avant d’en ajouter une autre.', '/crm/growth', 'Continuer la configuration'], learning: ['Continuez une leçon de l’Académie', 'Renforcez votre assurance en terminant la prochaine leçon de votre parcours.', '/training', 'Continuer à apprendre'], share: ['Lancez une conversation utile', 'Choisissez la page adaptée et envoyez-la avec un message personnel.', '/app/share', 'Choisir une page'], bookings: ['Préparez votre lien de rendez-vous', 'Permettez à la prochaine personne intéressée de choisir facilement un créneau.', '/app/bookings', 'Ouvrir les réservations'], team: ['Soutenez un membre de l’équipe', 'Consultez la progression et aidez une personne à avancer.', '/crm/growth', 'Voir la progression'],
    },
  },
  pt: {
    eyebrow: 'SEU SISTEMA DIÁRIO', title: 'Hoje', welcomeBack: 'Bem-vindo de volta', welcome: 'Este é o caminho mais curto para avançar.', recommended: 'ações recomendadas', next: 'SEU PRÓXIMO PASSO', mentorEyebrow: 'SUA CONEXÃO COM O MENTOR', mentorTitle: 'Você não precisa fazer isso sozinho.', mentorBody: (name: string) => `${name} está conectado à sua conta True Legacy e pode ajudar você a preparar conversas, entender o sistema e escolher o próximo passo.`, contact: 'Falar com', mentorPending: 'Sua conexão com o mentor está sendo confirmada.', mentorPendingBody: 'Continue com a Academia enquanto a conexão com seu patrocinador é concluída.', academy: 'Abrir a Academia', actions: {
      direction: ['Defina sua direção', 'Responda a quatro perguntas rápidas para que esta página possa orientar você até sua meta.', '#starting-plan', 'Escolher meu foco'], overdue: ['Reconecte-se com quem espera sua resposta', 'Comece pelos acompanhamentos atrasados. Uma resposta atenciosa é o melhor próximo passo.', '/crm?attention=due', 'Abrir acompanhamentos'], meeting: ['Prepare-se para a conversa de hoje', 'Revise o convidado e a apresentação adequada antes da chamada.', '/app/bookings', 'Revisar agendamentos'], 'new-lead': ['Receba seu contato mais recente', 'Faça uma primeira conexão humana e pergunte o que a pessoa deseja entender.', '/crm', 'Abrir novos contatos'], setup: ['Conclua a próxima etapa de configuração', 'Finalize uma ação de integração antes de acrescentar mais ao seu dia.', '/crm/growth', 'Continuar configuração'], learning: ['Continue uma lição da Academia', 'Ganhe confiança concluindo a próxima lição da sua trilha.', '/training', 'Continuar aprendendo'], share: ['Inicie uma conversa significativa', 'Escolha a página certa e envie com uma mensagem pessoal.', '/app/share', 'Escolher uma página'], bookings: ['Prepare seu link de chamada', 'Facilite para a próxima pessoa interessada escolher um horário com você.', '/app/bookings', 'Abrir agendamentos'], team: ['Apoie um membro da equipe', 'Revise o progresso e ajude uma pessoa a dar o próximo passo.', '/crm/growth', 'Revisar equipe'],
    },
  },
} as const satisfies Record<string, { actions: Record<NextBestActionKey, readonly [string, string, string, string]> } & Record<string, unknown>>

export default function AppTodayPage() {
  const { locale } = useLocaleContext()
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [distributor, setDistributor] = useState<CrmDistributor | null>(null)
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [training, setTraining] = useState<Progress[]>([])
  const [onboarding, setOnboarding] = useState<Progress[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [mentor, setMentor] = useState<CrmDistributor | null>(null)
  const [startingPlan, setStartingPlan] = useState<StartingPlan | null>(null)
  const [loading, setLoading] = useState(crmConfigured)
  const [loadError, setLoadError] = useState(false)
  const [reload, setReload] = useState(0)
  const [partialData, setPartialData] = useState(false)
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!crmSupabase) return
    crmSupabase.auth.getSession().then(({ data, error }) => { if (error) setLoadError(true); setSession(data.session); if (!data.session) setLoading(false) }).catch(() => { setLoadError(true); setLoading(false) })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => { setSession(next); if (!next) setLoading(false) })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !crmSupabase) return
    let current = true
    setLoading(true)
    setLoadError(false)
    setMembership(null)
    async function load() {
      try {
        const member = await getCrmMembership(session!.user.id)
        if (!current) return
        setMembership(member)
        if (!member?.active) return
        const [team, allLeads, msResult, isResult, tpResult, opResult, mtResult, relationshipResult] = await Promise.all([
          getCrmDistributors(),
          getCrmLeads(),
          crmSupabase!.from('crm_training_modules').select('*').eq('active', true).order('position'),
          crmSupabase!.from('crm_onboarding_items').select('*').eq('active', true).order('position'),
          crmSupabase!.from('crm_training_progress').select('*'),
          crmSupabase!.from('crm_onboarding_progress').select('*'),
          crmSupabase!.from('crm_meetings').select('*').eq('status', 'scheduled').order('starts_at', { ascending: true }),
          crmSupabase!.from('crm_team_relationships').select('distributor_id,sponsor_distributor_id'),
        ])
        const mine = team.find(item => item.id === member.distributor_id) || (session?.user ? team.find(item => item.auth_user_id === session.user.id) : null) || (session?.user?.email ? team.find(item => item.login_email?.toLowerCase() === session.user.email!.toLowerCase()) : null) || (member.role === 'admin' ? team.find(item => item.slug === 'mehdi-cohen') || team[0] : null) || null
        if (!current) return
        const relationship = ((relationshipResult.data || []) as Relationship[]).find(item => item.distributor_id === mine?.id)
        setPartialData([msResult, isResult, tpResult, opResult, mtResult, relationshipResult].some(result => result.error))
        setDistributor(mine)
        setStartingPlan(readStartingPlan(session!.user.user_metadata?.tl_starting_plan))
        setMentor(team.find(item => item.id === relationship?.sponsor_distributor_id) || null)
        setLeads(allLeads.filter(item => item.assigned_distributor_id === mine?.id))
        setModules((msResult.error || tpResult.error ? [] : msResult.data || []) as Module[])
        setItems((isResult.error || opResult.error ? [] : isResult.data || []) as Item[])
        setTraining(((tpResult.data || []) as Progress[]).filter(item => item.distributor_id === mine?.id))
        setOnboarding(((opResult.data || []) as Progress[]).filter(item => item.distributor_id === mine?.id))
        setMeetings(((mtResult.data || []) as Meeting[]).filter(item => item.distributor_id === mine?.id))
      } catch { if (current) setLoadError(true) }
      finally { if (current) { setLoadedUserId(session!.user.id); setLoading(false) } }
    }
    load()
    return () => { current = false }
  }, [session, reload])

  const now = new Date()
  const queue = followUpQueue(leads, now)
  const due = queue.filter(item => item.next_follow_up_at && new Date(item.next_follow_up_at) < new Date(now.getFullYear(), now.getMonth(), now.getDate()))
  const today = queue.filter(item => { if (!item.next_follow_up_at) return false; const d = new Date(item.next_follow_up_at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate() })
  const newLeads = useMemo(() => leads.filter(item => item.status === 'new'), [leads])
  const todayMeetings = meetings.filter(item => { const d = new Date(item.starts_at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate() })

  const completedTraining = training.filter(item => item.completed)
  const completedOnboarding = onboarding.filter(item => item.completed)
  const nextModule = modules.find(item => !completedTraining.some(p => p.module_id === item.id))
  const nextOnboarding = items.find(item => !completedOnboarding.some(p => p.item_id === item.id))
  const nextBestAction = chooseNextBestAction({ hasPlan: Boolean(startingPlan), focus: startingPlan?.focus, overdueFollowUps: due.length, meetingsToday: todayMeetings.length, newLeads: newLeads.length, hasOnboardingStep: Boolean(nextOnboarding), hasLearningStep: Boolean(nextModule) })
  const t = todayCopy[locale]
  const [nextTitle, nextBody, nextTo, nextCta] = t.actions[nextBestAction]
  const actionCount = queue.length + todayMeetings.length + (nextModule ? 1 : 0) + (nextOnboarding ? 1 : 0) + (startingPlan ? 0 : 1)

  if (!crmConfigured) return <TodayMessage title="App connection required" body="The secure True Legacy connection is unavailable." />
  if (loading || (session && loadedUserId !== session.user.id)) return <TodayMessage title="Loading your day…" body="Getting your contacts, calls, and learning progress." />
  if (loadError) return <TodayMessage title="Your daily plan could not load" body="You can still open your contacts and training, or try loading your plan again." action={<div className="flex flex-wrap justify-center gap-4"><button onClick={() => session ? setReload(value => value + 1) : window.location.reload()} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Try again</button><Link to="/crm" className="px-3 py-3 underline">Contacts</Link><Link to="/training" className="px-3 py-3 underline">Academy</Link></div>} />
  if (!session) return <TodayMessage title="Distributor login required" body="Sign in to see your leads, follow-ups, and next training actions." action={<Link to="/crm" className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Sign in</Link>} />
  if (!membership?.active) return <TodayMessage title="Account not authorized" body="An active distributor account is required to open Today." />

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="min-h-screen bg-black px-4 pb-32 pt-7 text-white sm:px-6 lg:px-8">
        <SEO title="Today | True Legacy" description="Your daily True Legacy distributor action plan." noIndex />
        <div className="mx-auto max-w-7xl">
          <AppPageHeader
            eyebrow={t.eyebrow}
            title={t.title}
            description={`${t.welcomeBack}${distributor ? `, ${distributor.display_name.split(' ')[0]}` : ''}. ${t.welcome}`}
            backTo="/app"
            maxWidthClass="max-w-7xl"
            stat={
              <div className="rounded-2xl border border-white/20 bg-cyan-300/[.07] px-5 py-2.5">
                <span className="text-2xl font-black text-[#2997ff]">{actionCount}</span>
                <span className="ml-2 text-xs sm:text-sm text-[#cccccc]">{t.recommended}</span>
              </div>
            }
          />

          <section className="mt-7 overflow-hidden rounded-[28px] border border-cyan-300/25 bg-gradient-to-br from-cyan-400/[.14] via-blue-500/[.07] to-transparent p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl"><p className="flex items-center gap-2 text-xs font-black tracking-[.2em] text-cyan-300"><Compass className="h-4 w-4" /> {t.next}</p><h2 className="mt-3 text-2xl font-black sm:text-3xl">{nextTitle}</h2><p className="mt-2 leading-7 text-[#cccccc]">{nextBody}</p></div>
              <Link to={nextTo} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300">{nextCta}<ArrowRight className="h-4 w-4" /></Link>
            </div>
          </section>

          <MemberStartingPlan key={session.user.id} user={session.user} onPlanChange={setStartingPlan} />
          {startingPlan?.mentorSupport && <MentorSupport mentor={mentor} plan={startingPlan} copy={t} />}
          {partialData && <p role="status" className="mt-4 rounded-xl border border-amber-300/20 p-4 text-sm text-amber-200">Some call or learning progress could not load. Your contacts remain available. <button onClick={() => setReload(value => value + 1)} className="ml-2 underline">Try again</button></p>}

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Metric icon={<Clock3 />} value={due.length} label="Overdue follow-ups" tone="rose" /><Metric icon={<CalendarCheck2 />} value={today.length} label="Due today" tone="amber" /><Metric icon={<UserPlus />} value={newLeads.length} label="New contacts" tone="cyan" /><Metric icon={<CalendarCheck2 />} value={todayMeetings.length} label="Calls today" tone="cyan" /><Metric icon={<CheckCircle2 />} value={`${completedOnboarding.length}/${items.length}`} label="Onboarding" tone="emerald" /></section>

          {todayMeetings.length > 0 && <section className="mt-7 rounded-[28px] border border-white/20 bg-violet-400/[.05] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2997ff]">Scheduled today</p><h2 className="mt-2 text-2xl font-black">Your conversations</h2></div><Link to="/app/bookings" className="text-sm font-bold text-[#2997ff]">All bookings</Link></div><div className="mt-5 grid gap-3 md:grid-cols-2">{todayMeetings.map(meeting => <article key={meeting.id} className="flex items-center gap-4 rounded-2xl border border-white/[.08] bg-black/15 p-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-sm font-black text-[#2997ff]">{new Date(meeting.starts_at).toLocaleTimeString([], { hour: 'numeric' })}</span><div className="min-w-0"><h3 className="truncate font-black">{meeting.guest_name}</h3><p className="mt-1 truncate text-xs text-[#86868b]">{new Date(meeting.starts_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · {meeting.guest_email}</p></div></article>)}</div></section>}

          <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
            <section className="rounded-[28px] border border-white/10 bg-white/[.03] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-rose-300">People first</p><h2 className="mt-2 text-2xl font-black">Follow-up queue</h2></div><Link to="/crm?attention=due" className="text-sm font-bold text-[#2997ff]">All contacts</Link></div><div className="mt-5 space-y-3">{queue.slice(0, 8).map(lead => <LeadAction key={lead.id} lead={lead} />)}{queue.length === 0 ? <EmptyState /> : null}</div></section>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-white/20 bg-gradient-to-br from-cyan-400/[.1] to-blue-500/[.04] p-6">
                <GraduationCap className="h-7 w-7 text-[#2997ff]" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-[#2997ff]">Next learning action</p>
                <h2 className="mt-1.5 text-lg sm:text-xl font-black text-white">{nextModule ? (nextModule.title[locale] || nextModule.title.en) : modules.length ? 'Academy complete' : 'Explore your Academy'}</h2>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cccccc]">{nextModule ? `${completedTraining.length} of ${modules.length} modules complete. Continue with the next lesson.` : modules.length ? 'You have completed every active training module.' : 'Open the Academy to explore the available learning paths.'}</p>
                <Link to="/training" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 hover:bg-cyan-300 transition-colors">Open Academy <ArrowRight className="h-4 w-4" /></Link>
              </section>
              <section className="rounded-[28px] border border-amber-300/15 bg-amber-300/[.05] p-6">
                <Sparkles className="h-7 w-7 text-amber-300" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-amber-300">Next setup action</p>
                <h2 className="mt-1.5 text-lg sm:text-xl font-black text-white">{nextOnboarding ? (nextOnboarding.title[locale] || nextOnboarding.title.en) : items.length ? 'Onboarding complete' : 'Explore your setup steps'}</h2>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cccccc]">{completedOnboarding.length} of {items.length} True Legacy setup steps complete.</p>
                <Link to="/crm/growth" className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-black text-amber-200 hover:text-amber-100 transition-colors">Open progress center <ArrowRight className="h-4 w-4" /></Link>
              </section>
            </div>
          </div>

          <section className="mt-7 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
            <QuickAction to="/app/bookings" icon={<CalendarCheck2 className="h-5 w-5" />} title="Share your calendar" text="Send your personal discovery-call booking link." />
            <QuickAction to="/app/share" icon={<MessageCircle className="h-5 w-5" />} title="Share a presentation" text="Send an official personalized True Legacy page." />
            <QuickAction to="/crm/growth" icon={<Users className="h-5 w-5" />} title="Support your team" text="Review onboarding and academy progress." />
            <QuickAction to="/app/library" icon={<BookOpenCheck className="h-5 w-5" />} title="Find a resource" text="Open the True Legacy Tool Center." />
          </section>
        </div>
      </main>
    </div>
  )
}

function LeadAction({ lead }: { lead: CrmLead }) {
  const overdue = Boolean(lead.next_follow_up_at && new Date(lead.next_follow_up_at) < new Date())
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent(`True Legacy Follow-Up · ${lead.full_name}`)}`

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/[.08] bg-black/15 p-4 sm:flex-row sm:items-center">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${overdue ? 'bg-rose-400/10 text-rose-300' : 'bg-cyan-400/10 text-[#2997ff]'}`}>
        <Users className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-black">{lead.full_name}</h3>
          <span className="rounded-full bg-white/[.06] px-2 py-1 text-[10px] font-bold uppercase text-[#cccccc]">{lead.interest}</span>
        </div>
        <p className="mt-1 text-xs text-[#86868b]">
          {overdue ? 'Follow-up overdue' : lead.next_follow_up_at ? `Follow up ${new Date(lead.next_follow_up_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'New contact — make the first connection'}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#cccccc]">{leadNextStep(lead)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {lead.phone && (
          <a
            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300/25 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        )}
        {lead.email && (
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 transition-colors"
            title="Compose in Gmail"
          >
            <Mail className="h-3.5 w-3.5" />
            Gmail
          </a>
        )}
        <Link to={`/crm?contact=${lead.id}`} className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-colors">
          Open
        </Link>
      </div>
    </article>
  )
}

function MentorSupport({ mentor, plan, copy }: { mentor: CrmDistributor | null; plan: StartingPlan; copy: { mentorEyebrow: string; mentorTitle: string; mentorBody: (name: string) => string; contact: string; mentorPending: string; mentorPendingBody: string; academy: string } }) {
  if (!mentor) return <section className="mt-7 rounded-[28px] border border-emerald-300/15 bg-emerald-400/[.04] p-5 sm:p-7"><HandHeart className="h-7 w-7 text-emerald-300" /><p className="mt-4 text-xs font-black tracking-[.2em] text-emerald-300">{copy.mentorEyebrow}</p><h2 className="mt-2 text-xl font-black">{copy.mentorPending}</h2><p className="mt-2 max-w-2xl leading-7 text-[#cccccc]">{copy.mentorPendingBody}</p><Link to="/training" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-emerald-200">{copy.academy}<ArrowRight className="h-4 w-4" /></Link></section>

  const digits = mentor.phone?.replace(/\D/g, '')
  const contact = plan.preferredContact === 'whatsapp' && digits
    ? { href: `https://wa.me/${digits}`, external: true }
    : plan.preferredContact === 'email' && mentor.login_email
      ? { href: `mailto:${mentor.login_email}`, external: true }
      : plan.preferredContact === 'team-call'
        ? { href: '/events', external: false }
        : { href: `/d/${mentor.slug}`, external: false }

  const button = <>{copy.contact} {mentor.display_name.split(' ')[0]}<ArrowRight className="h-4 w-4" /></>
  return <section className="mt-7 rounded-[28px] border border-emerald-300/20 bg-gradient-to-br from-emerald-400/[.09] to-cyan-400/[.03] p-5 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><img src={mentor.avatar_url || '/logos/tl-square-white.png'} alt={mentor.display_name} className="h-20 w-20 rounded-2xl border border-white/15 object-cover object-top" /><div className="min-w-0 flex-1"><p className="text-xs font-black tracking-[.2em] text-emerald-300">{copy.mentorEyebrow}</p><h2 className="mt-2 text-xl font-black">{copy.mentorTitle}</h2><p className="mt-2 max-w-3xl leading-7 text-[#cccccc]">{copy.mentorBody(mentor.display_name)}</p></div>{contact.external ? <a href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel={contact.href.startsWith('http') ? 'noreferrer' : undefined} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-100 hover:bg-emerald-400/20">{button}</a> : <Link to={contact.href} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-100 hover:bg-emerald-400/20">{button}</Link>}</div></section>
}
const METRIC_TONES: Record<string, string> = { rose: 'text-rose-300', amber: 'text-amber-300', cyan: 'text-[#2997ff]', emerald: 'text-[#cccccc]' }
function Metric({ icon, value, label, tone }: { icon: React.ReactNode; value: string | number; label: string; tone: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><span className={METRIC_TONES[tone]}>{icon}</span><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#86868b]">{label}</p></div> }
function QuickAction({ to, icon, title, text }: { to: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[.025] hover:bg-white/[.05] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-[#2997ff] border border-cyan-400/20 group-hover:scale-105 group-hover:bg-cyan-400/20 group-hover:border-cyan-400/40 transition-all">
          {icon}
        </span>
        <h3 className="mt-3 text-xs sm:text-sm font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-[11px] sm:text-xs text-[#86868b] leading-relaxed line-clamp-2">
          {text}
        </p>
      </div>
    </Link>
  )
}
function EmptyState() { return <div className="rounded-2xl border border-dashed border-emerald-300/20 p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-[#cccccc]" /><h3 className="mt-3 font-black">You are caught up</h3><p className="mt-2 text-sm text-[#86868b]">No new or overdue contacts need attention.</p></div> }
function TodayMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-black p-5 text-white"><div className="max-w-md text-center"><CalendarCheck2 className="mx-auto h-12 w-12 text-[#2997ff]" /><h1 className="mt-5 text-3xl font-black">{title}</h1><p className="mt-4 leading-7 text-[#cccccc]">{body}</p>{action ? <div className="mt-7">{action}</div> : null}</div></main> }
