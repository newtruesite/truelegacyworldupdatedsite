export type StartingPlanFocus = 'product' | 'referral' | 'business' | 'leadership'

export type StartingPlan = {
  focus: StartingPlanFocus
  experience: 'new' | 'some' | 'experienced'
  weeklyTime: '1–2 hours' | '3–5 hours' | '6+ hours'
  mentorSupport: boolean
  preferredContact: 'whatsapp' | 'email' | 'team-call'
}

const focuses: StartingPlanFocus[] = ['product', 'referral', 'business', 'leadership']

export function readStartingPlan(value: unknown): StartingPlan | null {
  if (!value || typeof value !== 'object') return null
  const plan = value as Partial<StartingPlan>
  if (!plan.focus || !focuses.includes(plan.focus) || !plan.experience || !['new', 'some', 'experienced'].includes(plan.experience) || !plan.weeklyTime || !['1–2 hours', '3–5 hours', '6+ hours'].includes(plan.weeklyTime)) return null
  return { focus: plan.focus, experience: plan.experience, weeklyTime: plan.weeklyTime, mentorSupport: plan.mentorSupport === true, preferredContact: ['whatsapp', 'email', 'team-call'].includes(plan.preferredContact || '') ? plan.preferredContact! : 'whatsapp' }
}
