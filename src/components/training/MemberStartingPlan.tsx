import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { crmSupabase } from '@/lib/crm'

const paths = {
  product: { label: 'Learn about the products', description: 'Build confidence with product education.', steps: [['Explore the Academy', '/training'], ['Find product resources', '/app/library']] },
  referral: { label: 'Share and refer', description: 'Learn to introduce people and follow up thoughtfully.', steps: [['Find your personal sharing links', '/app/share'], ['Review your contacts', '/crm']] },
  business: { label: 'Build my business', description: 'Make learning, conversations, and follow-ups a regular habit.', steps: [['Continue your setup', '/crm/growth'], ['Prepare your booking link', '/app/bookings']] },
  leadership: { label: 'Support my team', description: 'Help members with their setup and learning progress.', steps: [['Review team progress', '/crm/growth'], ['Open training resources', '/training']] },
} as const
type Focus = keyof typeof paths
type StartingPlan = { focus: Focus; experience: 'new' | 'some' | 'experienced'; weeklyTime: '1–2 hours' | '3–5 hours' | '6+ hours' }

function readPlan(value: unknown): StartingPlan | null {
  if (!value || typeof value !== 'object') return null
  const plan = value as StartingPlan
  return Object.hasOwn(paths, plan.focus) && ['new', 'some', 'experienced'].includes(plan.experience) && ['1–2 hours', '3–5 hours', '6+ hours'].includes(plan.weeklyTime) ? plan : null
}

// These are personal learning preferences only. They never grant roles or access.
export function MemberStartingPlan({ user }: { user: User }) {
  const [saved, setSaved] = useState(() => readPlan(user.user_metadata?.tl_starting_plan))
  const [editing, setEditing] = useState(false)
  const [focus, setFocus] = useState<Focus>(saved?.focus ?? 'product')
  const [experience, setExperience] = useState<StartingPlan['experience']>(saved?.experience ?? 'new')
  const [weeklyTime, setWeeklyTime] = useState<StartingPlan['weeklyTime']>(saved?.weeklyTime ?? '1–2 hours')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!crmSupabase || saving) return
    setSaving(true)
    setError('')
    setFeedback('')
    const plan = { focus, experience, weeklyTime }
    try {
      const { data, error: saveError } = await crmSupabase.auth.updateUser({ data: { tl_starting_plan: plan } })
      if (saveError || data.user?.id !== user.id) throw new Error('save failed')
      const confirmed = readPlan(data.user.user_metadata?.tl_starting_plan)
      if (!confirmed) throw new Error('missing saved plan')
      setSaved(confirmed)
      setEditing(false)
      setFeedback('Your starting plan is saved to your account.')
    } catch {
      setError('Your plan could not be saved. Your answers are still here; please try again.')
    } finally { setSaving(false) }
  }

  return <section aria-labelledby="starting-plan-title" className="mt-7 rounded-[28px] border border-cyan-400/20 bg-cyan-400/[.05] p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="flex items-center gap-2 text-sm font-bold text-[#2997ff]"><Compass className="h-5 w-5" /> Your starting plan</p>
        <h2 id="starting-plan-title" className="mt-2 text-2xl font-black">{saved ? paths[saved.focus].label : 'Choose your focus'}</h2>
        <p className="mt-2 max-w-2xl text-base text-[#cccccc]">{saved ? paths[saved.focus].description : 'Answer three quick questions to find a useful place to begin. You can change your focus anytime.'}</p>
      </div>
      <button type="button" disabled={saving} onClick={() => { setEditing(!editing); setError(''); setFeedback('') }} className="rounded-xl border border-white/20 px-4 py-3 text-sm font-bold hover:bg-white/10 disabled:opacity-50">{editing ? 'Cancel' : saved ? 'Change my plan' : 'Get started'}</button>
    </div>
    {editing ? <form onSubmit={save} className="mt-6 space-y-5">
      <fieldset disabled={saving} className="grid gap-5 sm:grid-cols-3">
        <label className="text-sm font-semibold">What is your main focus?
          <select value={focus} onChange={event => setFocus(event.target.value as Focus)} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950 p-3 text-base text-white">{Object.entries(paths).map(([key, path]) => <option key={key} value={key}>{path.label}</option>)}</select>
        </label>
        <label className="text-sm font-semibold">How familiar are you with this?
          <select value={experience} onChange={event => setExperience(event.target.value as StartingPlan['experience'])} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950 p-3 text-base text-white"><option value="new">I am just starting</option><option value="some">I have some experience</option><option value="experienced">I am experienced</option></select>
        </label>
        <label className="text-sm font-semibold">Time you would like to set aside weekly
          <select value={weeklyTime} onChange={event => setWeeklyTime(event.target.value as StartingPlan['weeklyTime'])} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950 p-3 text-base text-white">{['1–2 hours', '3–5 hours', '6+ hours'].map(value => <option key={value}>{value}</option>)}</select>
        </label>
      </fieldset>
      <button disabled={saving} className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50">{saving ? 'Saving…' : 'Save my plan'}</button>
    </form> : saved ? <div className="mt-5">
      <p className="text-sm text-[#cccccc]">{saved.experience === 'new' ? 'Start with one resource, then bring your questions to your team.' : saved.experience === 'some' ? 'Choose one area to practise this week and review it with your team.' : 'Review your next priority and share what you learn with your team.'} Your weekly time preference: {saved.weeklyTime}.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{paths[saved.focus].steps.map(([label, to], index) => <Link key={to} to={to} className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/20 p-4 text-base font-semibold hover:border-cyan-300/50"><span>{index + 1}. {label}</span><ArrowRight className="h-5 w-5 shrink-0" /></Link>)}</div>
    </div> : null}
    {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
    <p role="status" className="mt-3 text-sm text-cyan-200">{feedback}</p>
  </section>
}
