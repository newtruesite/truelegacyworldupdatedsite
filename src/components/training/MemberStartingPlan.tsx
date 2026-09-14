import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, HandHeart } from 'lucide-react'
import { useLocaleContext, type Locale } from '@/contexts/LocaleContext'
import { crmSupabase } from '@/lib/crm'
import { readStartingPlan } from '@/lib/memberDirection'
import type { StartingPlan, StartingPlanFocus } from '@/lib/memberDirection'

const paths = {
  product: { steps: ['/training', '/app/library'] },
  referral: { steps: ['/app/share', '/crm'] },
  business: { steps: ['/crm/growth', '/app/bookings'] },
  leadership: { steps: ['/crm/growth', '/training'] },
} as const

type Copy = {
  eyebrow: string; title: string; intro: string; change: string; start: string; cancel: string
  focusQuestion: string; experienceQuestion: string; timeQuestion: string; mentorQuestion: string
  mentorYes: string; mentorNo: string; contactQuestion: string; save: string; saving: string; saved: string; error: string
  weekly: string; mentorFlag: string
  contactOptions: Record<StartingPlan['preferredContact'], string>
  experienceOptions: Record<StartingPlan['experience'], string>
  guidance: Record<StartingPlan['experience'], string>
  path: Record<StartingPlanFocus, { label: string; description: string; steps: [string, string] }>
}

const copy: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Your direction', title: 'Choose your focus', intro: 'Answer four quick questions so Today can recommend the most useful next move. You can change this anytime.', change: 'Change my plan', start: 'Set my direction', cancel: 'Cancel', focusQuestion: 'What is your main focus?', experienceQuestion: 'How familiar are you with this?', timeQuestion: 'Time you would like to set aside weekly', mentorQuestion: 'Would mentor support help right now?', mentorYes: 'Yes, show me my mentor', mentorNo: 'Not right now', contactQuestion: 'Best way to connect', save: 'Save my direction', saving: 'Saving…', saved: 'Your direction is saved to your account.', error: 'Your plan could not be saved. Your answers are still here; please try again.', weekly: 'Weekly time preference', mentorFlag: 'Mentor support requested', contactOptions: { whatsapp: 'WhatsApp', email: 'Email', 'team-call': 'Team call' }, experienceOptions: { new: 'I am just starting', some: 'I have some experience', experienced: 'I am experienced' }, guidance: { new: 'Start with one resource, then bring your questions to your team.', some: 'Choose one area to practise this week and review it with your team.', experienced: 'Review your next priority and share what you learn with your team.' }, path: { product: { label: 'Learn about the products', description: 'Build confidence with product education.', steps: ['Explore the Academy', 'Find product resources'] }, referral: { label: 'Share and refer', description: 'Learn to introduce people and follow up thoughtfully.', steps: ['Find your personal sharing links', 'Review your contacts'] }, business: { label: 'Build my business', description: 'Make learning, conversations, and follow-ups a regular habit.', steps: ['Continue your setup', 'Prepare your booking link'] }, leadership: { label: 'Support my team', description: 'Help members with their setup and learning progress.', steps: ['Review team progress', 'Open training resources'] } },
  },
  es: {
    eyebrow: 'Tu dirección', title: 'Elige tu enfoque', intro: 'Responde cuatro preguntas rápidas para que Hoy recomiende tu siguiente paso más útil. Puedes cambiarlo cuando quieras.', change: 'Cambiar mi plan', start: 'Definir mi dirección', cancel: 'Cancelar', focusQuestion: '¿Cuál es tu enfoque principal?', experienceQuestion: '¿Qué experiencia tienes en esta área?', timeQuestion: 'Tiempo que deseas dedicar cada semana', mentorQuestion: '¿Te ayudaría el apoyo de un mentor ahora?', mentorYes: 'Sí, muéstrame mi mentor', mentorNo: 'Ahora no', contactQuestion: 'Mejor forma de conectar', save: 'Guardar mi dirección', saving: 'Guardando…', saved: 'Tu dirección se guardó en tu cuenta.', error: 'No se pudo guardar tu plan. Tus respuestas siguen aquí; inténtalo de nuevo.', weekly: 'Preferencia de tiempo semanal', mentorFlag: 'Apoyo de mentor solicitado', contactOptions: { whatsapp: 'WhatsApp', email: 'Correo electrónico', 'team-call': 'Llamada de equipo' }, experienceOptions: { new: 'Estoy comenzando', some: 'Tengo algo de experiencia', experienced: 'Tengo experiencia' }, guidance: { new: 'Comienza con un recurso y luego lleva tus preguntas a tu equipo.', some: 'Elige un área para practicar esta semana y revísala con tu equipo.', experienced: 'Revisa tu próxima prioridad y comparte lo que aprendas con tu equipo.' }, path: { product: { label: 'Aprender sobre los productos', description: 'Desarrolla confianza con educación sobre productos.', steps: ['Explorar la Academia', 'Buscar recursos de productos'] }, referral: { label: 'Compartir y referir', description: 'Aprende a presentar y dar seguimiento con intención.', steps: ['Buscar tus enlaces personales', 'Revisar tus contactos'] }, business: { label: 'Desarrollar mi negocio', description: 'Convierte el aprendizaje, las conversaciones y el seguimiento en hábitos.', steps: ['Continuar tu configuración', 'Preparar tu enlace de reservas'] }, leadership: { label: 'Apoyar a mi equipo', description: 'Ayuda a los miembros con su configuración y aprendizaje.', steps: ['Revisar el progreso del equipo', 'Abrir recursos de capacitación'] } },
  },
  fr: {
    eyebrow: 'Votre direction', title: 'Choisissez votre priorité', intro: 'Répondez à quatre questions rapides pour que Aujourd’hui recommande la prochaine action la plus utile. Vous pouvez modifier ce choix à tout moment.', change: 'Modifier mon plan', start: 'Définir ma direction', cancel: 'Annuler', focusQuestion: 'Quelle est votre priorité principale ?', experienceQuestion: 'Quel est votre niveau d’expérience ?', timeQuestion: 'Temps à consacrer chaque semaine', mentorQuestion: 'Le soutien d’un mentor vous aiderait-il maintenant ?', mentorYes: 'Oui, afficher mon mentor', mentorNo: 'Pas maintenant', contactQuestion: 'Meilleur moyen de contact', save: 'Enregistrer ma direction', saving: 'Enregistrement…', saved: 'Votre direction est enregistrée dans votre compte.', error: 'Votre plan n’a pas pu être enregistré. Vos réponses sont conservées ; réessayez.', weekly: 'Temps hebdomadaire souhaité', mentorFlag: 'Soutien d’un mentor demandé', contactOptions: { whatsapp: 'WhatsApp', email: 'E-mail', 'team-call': 'Appel d’équipe' }, experienceOptions: { new: 'Je débute', some: 'J’ai un peu d’expérience', experienced: 'Je suis expérimenté(e)' }, guidance: { new: 'Commencez par une ressource, puis apportez vos questions à votre équipe.', some: 'Choisissez un domaine à pratiquer cette semaine et révisez-le avec votre équipe.', experienced: 'Examinez votre prochaine priorité et partagez vos apprentissages avec votre équipe.' }, path: { product: { label: 'Découvrir les produits', description: 'Renforcez votre assurance grâce à la formation produit.', steps: ['Explorer l’Académie', 'Trouver des ressources produit'] }, referral: { label: 'Partager et recommander', description: 'Apprenez à présenter et à assurer un suivi attentionné.', steps: ['Trouver vos liens personnels', 'Consulter vos contacts'] }, business: { label: 'Développer mon activité', description: 'Faites de l’apprentissage, des conversations et du suivi une habitude.', steps: ['Continuer votre configuration', 'Préparer votre lien de réservation'] }, leadership: { label: 'Soutenir mon équipe', description: 'Aidez les membres dans leur configuration et leur apprentissage.', steps: ['Consulter la progression de l’équipe', 'Ouvrir les ressources de formation'] } },
  },
  pt: {
    eyebrow: 'Sua direção', title: 'Escolha seu foco', intro: 'Responda a quatro perguntas rápidas para que Hoje recomende o próximo passo mais útil. Você pode alterar isso a qualquer momento.', change: 'Alterar meu plano', start: 'Definir minha direção', cancel: 'Cancelar', focusQuestion: 'Qual é o seu foco principal?', experienceQuestion: 'Qual é a sua experiência nesta área?', timeQuestion: 'Tempo que deseja dedicar por semana', mentorQuestion: 'O apoio de um mentor ajudaria agora?', mentorYes: 'Sim, mostre meu mentor', mentorNo: 'Agora não', contactQuestion: 'Melhor forma de contato', save: 'Salvar minha direção', saving: 'Salvando…', saved: 'Sua direção foi salva na sua conta.', error: 'Não foi possível salvar seu plano. Suas respostas continuam aqui; tente novamente.', weekly: 'Preferência de tempo semanal', mentorFlag: 'Apoio de mentor solicitado', contactOptions: { whatsapp: 'WhatsApp', email: 'E-mail', 'team-call': 'Chamada da equipe' }, experienceOptions: { new: 'Estou começando', some: 'Tenho alguma experiência', experienced: 'Tenho experiência' }, guidance: { new: 'Comece com um recurso e depois leve suas perguntas à equipe.', some: 'Escolha uma área para praticar esta semana e revise-a com sua equipe.', experienced: 'Revise sua próxima prioridade e compartilhe o que aprender com sua equipe.' }, path: { product: { label: 'Aprender sobre os produtos', description: 'Ganhe confiança com educação sobre produtos.', steps: ['Explorar a Academia', 'Encontrar recursos de produtos'] }, referral: { label: 'Compartilhar e indicar', description: 'Aprenda a apresentar e acompanhar com atenção.', steps: ['Encontrar seus links pessoais', 'Revisar seus contatos'] }, business: { label: 'Desenvolver meu negócio', description: 'Transforme aprendizado, conversas e acompanhamento em hábitos.', steps: ['Continuar sua configuração', 'Preparar seu link de agendamento'] }, leadership: { label: 'Apoiar minha equipe', description: 'Ajude os membros na configuração e no aprendizado.', steps: ['Revisar o progresso da equipe', 'Abrir recursos de treinamento'] } },
  },
}

// These are personal learning preferences only. They never grant roles or access.
export function MemberStartingPlan({ user, onPlanChange }: { user: User; onPlanChange?: (plan: StartingPlan) => void }) {
  const { locale } = useLocaleContext()
  const t = copy[locale]
  const initialPlan = readStartingPlan(user.user_metadata?.tl_starting_plan)
  const [saved, setSaved] = useState(initialPlan)
  const [editing, setEditing] = useState(!initialPlan)
  const [focus, setFocus] = useState<StartingPlanFocus>(saved?.focus ?? 'product')
  const [experience, setExperience] = useState<StartingPlan['experience']>(saved?.experience ?? 'new')
  const [weeklyTime, setWeeklyTime] = useState<StartingPlan['weeklyTime']>(saved?.weeklyTime ?? '1–2 hours')
  const [mentorSupport, setMentorSupport] = useState(saved?.mentorSupport ?? false)
  const [preferredContact, setPreferredContact] = useState<StartingPlan['preferredContact']>(saved?.preferredContact ?? 'whatsapp')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!crmSupabase || saving) return
    setSaving(true); setError(''); setFeedback('')
    const plan: StartingPlan = { focus, experience, weeklyTime, mentorSupport, preferredContact }
    try {
      const { data, error: saveError } = await crmSupabase.auth.updateUser({ data: { tl_starting_plan: plan } })
      if (saveError || data.user?.id !== user.id) throw new Error('save failed')
      const confirmed = readStartingPlan(data.user.user_metadata?.tl_starting_plan)
      if (!confirmed) throw new Error('missing saved plan')
      setSaved(confirmed); setEditing(false); setFeedback(t.saved); onPlanChange?.(confirmed)
    } catch { setError(t.error) }
    finally { setSaving(false) }
  }

  const activePath = saved ? t.path[saved.focus] : null
  return <section id="starting-plan" aria-labelledby="starting-plan-title" className="mt-7 scroll-mt-24 rounded-[28px] border border-cyan-400/20 bg-cyan-400/[.05] p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="flex items-center gap-2 text-sm font-bold text-[#2997ff]"><Compass className="h-5 w-5" /> {t.eyebrow}</p><h2 id="starting-plan-title" className="mt-2 text-2xl font-black">{activePath?.label || t.title}</h2><p className="mt-2 max-w-2xl text-base text-[#cccccc]">{activePath?.description || t.intro}</p></div>
      <button type="button" disabled={saving} onClick={() => { setEditing(!editing); setError(''); setFeedback('') }} className="rounded-xl border border-white/20 px-4 py-3 text-sm font-bold hover:bg-white/10 disabled:opacity-50">{editing ? t.cancel : saved ? t.change : t.start}</button>
    </div>
    {editing ? <form onSubmit={save} className="mt-6 space-y-5">
      <fieldset disabled={saving} className="grid gap-5 md:grid-cols-3">
        <label className="text-sm font-semibold">{t.focusQuestion}<select value={focus} onChange={event => setFocus(event.target.value as StartingPlanFocus)} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950 p-3 text-base text-white">{Object.entries(t.path).map(([key, path]) => <option key={key} value={key}>{path.label}</option>)}</select></label>
        <label className="text-sm font-semibold">{t.experienceQuestion}<select value={experience} onChange={event => setExperience(event.target.value as StartingPlan['experience'])} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950 p-3 text-base text-white">{Object.entries(t.experienceOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="text-sm font-semibold">{t.timeQuestion}<select value={weeklyTime} onChange={event => setWeeklyTime(event.target.value as StartingPlan['weeklyTime'])} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950 p-3 text-base text-white">{['1–2 hours', '3–5 hours', '6+ hours'].map(value => <option key={value}>{value}</option>)}</select></label>
      </fieldset>
      <fieldset disabled={saving} className="grid gap-5 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-2">
        <div><legend className="text-sm font-semibold">{t.mentorQuestion}</legend><div className="mt-3 flex flex-wrap gap-2"><ChoiceButton active={mentorSupport} onClick={() => setMentorSupport(true)}>{t.mentorYes}</ChoiceButton><ChoiceButton active={!mentorSupport} onClick={() => setMentorSupport(false)}>{t.mentorNo}</ChoiceButton></div></div>
        {mentorSupport && <label className="text-sm font-semibold">{t.contactQuestion}<select value={preferredContact} onChange={event => setPreferredContact(event.target.value as StartingPlan['preferredContact'])} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950 p-3 text-base text-white">{Object.entries(t.contactOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
      </fieldset>
      <button disabled={saving} className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50">{saving ? t.saving : t.save}</button>
    </form> : saved && activePath ? <div className="mt-5"><p className="text-sm text-[#cccccc]">{t.guidance[saved.experience]} {t.weekly}: {saved.weeklyTime}.</p>{saved.mentorSupport && <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/[.08] px-3 py-1.5 text-xs font-bold text-emerald-200"><HandHeart className="h-4 w-4" /> {t.mentorFlag} · {t.contactOptions[saved.preferredContact]}</p>}<div className="mt-4 grid gap-3 sm:grid-cols-2">{paths[saved.focus].steps.map((to, index) => <Link key={to} to={to} className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/20 p-4 text-base font-semibold hover:border-cyan-300/50"><span>{index + 1}. {activePath.steps[index]}</span><ArrowRight className="h-5 w-5 shrink-0" /></Link>)}</div></div> : null}
    {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}{feedback && <p role="status" className="mt-3 text-sm text-cyan-200">{feedback}</p>}
  </section>
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${active ? 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100' : 'border-white/15 bg-white/[.03] text-[#cccccc] hover:bg-white/[.07]'}`}>{children}</button>
}
