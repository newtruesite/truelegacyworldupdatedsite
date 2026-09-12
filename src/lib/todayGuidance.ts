import type { CrmLead } from './crm'

export function leadNextStep(lead: Pick<CrmLead, 'status'>): string {
  switch (lead.status) {
    case 'new': return 'Introduce yourself and ask what they would like to learn.'
    case 'contacted': return 'Ask about their questions and agree on a useful next step.'
    case 'qualified': return 'Offer a discovery call. Invite mentor support if you need help answering questions.'
    case 'nurturing': return 'Check whether their interests have changed, then agree on a follow-up date.'
    case 'converted': return 'Check in on their experience and offer the relevant setup resources.'
    case 'closed': return 'Review their contact preferences before reaching out again.'
  }
}

export function followUpQueue(leads: CrmLead[], now: Date): CrmLead[] {
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return leads.filter(lead => lead.status !== 'closed' && lead.status !== 'converted' &&
    (lead.status === 'new' || (lead.next_follow_up_at && new Date(lead.next_follow_up_at) < endOfDay)))
    .sort((a, b) => {
      const dateA = a.next_follow_up_at ? new Date(a.next_follow_up_at).getTime() : Infinity
      const dateB = b.next_follow_up_at ? new Date(b.next_follow_up_at).getTime() : Infinity
      return dateA - dateB || new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
    })
}
