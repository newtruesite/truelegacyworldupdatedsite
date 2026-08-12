import { crmConfigured, crmSupabase } from '@/integrations/supabase/client'

export type CrmRole = 'admin' | 'distributor'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'closed'
export type LeadInterest = 'product' | 'duo' | 'distributor' | 'training' | 'events'

export type PublicDistributor = {
  id: string
  slug: string
  referral_code: string
  display_name: string
  title: string
  bio: string | null
  avatar_url: string | null
  regions: string[]
  languages: string[]
  phone?: string | null
  instagram_url?: string | null
}

export type CrmDistributor = PublicDistributor & {
  active: boolean
  accepting_leads: boolean
  login_email: string | null
}

export type CrmMembership = {
  user_id: string
  role: CrmRole
  distributor_id: string | null
  active: boolean
}

export type CrmLead = {
  id: string
  full_name: string
  email: string
  phone: string | null
  country: string
  interest: LeadInterest
  has_referrer: boolean
  referrer_name: string | null
  referral_code: string | null
  selected_distributor_id: string | null
  assigned_distributor_id: string | null
  attribution_method: 'referral_link' | 'named_referrer' | 'visitor_selected' | 'unassigned'
  status: LeadStatus
  locale: 'en' | 'es' | 'fr' | 'pt'
  source_path: string
  consent: boolean
  consent_at: string
  privacy_version: string
  next_follow_up_at: string | null
  submitted_at: string
  updated_at: string
}

export type CrmLeadNote = {
  id: string
  lead_id: string
  author_user_id: string
  body: string
  created_at: string
}

const FALLBACK_DISTRIBUTORS: PublicDistributor[] = [
  {
    id: 'preview-mehdi',
    slug: 'mehdi-cohen',
    referral_code: 'mehdi-cohen',
    display_name: 'Mehdi Cohen',
    title: 'True Legacy World',
    bio: 'Global and LATAM product education, leadership, and team support.',
    avatar_url: '/leaders/mehdi-hero.png',
    regions: ['Global', 'LATAM'],
    languages: ['en', 'es', 'fr'],
  },
  {
    id: 'preview-ryan',
    slug: 'ryan-pool',
    referral_code: 'ryan-pool',
    display_name: 'Ryan Pool',
    title: 'True Legacy Leader',
    bio: 'Global product education, leadership, and team support.',
    avatar_url: '/leaders/ryan-hero.png',
    regions: ['Global'],
    languages: ['en'],
  },
  {
    id: 'preview-alex',
    slug: 'alex-gonzalez',
    referral_code: 'alex-gonzalez',
    display_name: 'Alex Gonzalez',
    title: 'True Legacy Distributor',
    bio: 'Alex Gonzalez brings over 35 years of experience in marketing within the supplement industry. Throughout his career, he has remained passionate about health, wellness, and helping others live their best lives. For Alex, a healthy lifestyle isn’t just a profession—it’s a personal commitment and the most important foundation for a fulfilling life.',
    avatar_url: '/leaders/alex-gonzalez.jpg',
    regions: ['USA'],
    languages: ['en', 'es'],
  },
  {
    id: 'preview-zah',
    slug: 'zah-naderi',
    referral_code: 'zah-naderi',
    display_name: 'Zah Naderi',
    title: 'True Legacy Distributor',
    bio: "For more than a decade, I've had the privilege of coaching some of the world’s top performers—elite athletes, celebrities, and C-suite executives. But what I discovered along that journey went beyond just training—it was about mastering leadership, understanding leverage, and embracing a vision that’s bigger than yourself.\n\nI realized true, lasting impact isn't created in isolation. It comes from connecting with the right people and choosing the right vehicle. That’s what led me to Enagic—a company built on authenticity, proven systems, and sustainable growth.\n\nNow, we have a space where like-minded leaders unite, blend their strengths, and leverage our collective expertise to build generational wealth and a lasting legacy.",
    avatar_url: '/leaders/zah-naderi.jpg',
    regions: ['USA'],
    languages: ['en'],
    phone: '+1 (585) 319-6018',
    instagram_url: 'https://www.instagram.com/zahphysique/',
  },
]

export async function getPublicDistributors(): Promise<PublicDistributor[]> {
  if (!crmSupabase) return FALLBACK_DISTRIBUTORS
  const { data, error } = await crmSupabase.rpc('get_public_crm_distributors')
  if (error || !Array.isArray(data)) return FALLBACK_DISTRIBUTORS
  return data as PublicDistributor[]
}

export async function submitCrmApplication(payload: Record<string, unknown>) {
  if (!crmSupabase) throw new Error('CRM_NOT_CONFIGURED')
  const { data, error } = await crmSupabase.rpc('submit_crm_application', { payload })
  if (error) throw error
  // The database is the source of truth. Notification failure must never lose the lead.
  crmSupabase.functions.invoke('crm-lead-notify', { body: { leadId: data } }).catch(() => undefined)
  return data as string
}

export async function getCrmSession() {
  if (!crmSupabase) return null
  const { data } = await crmSupabase.auth.getSession()
  return data.session
}

export async function getCrmMembership(userId: string): Promise<CrmMembership | null> {
  if (!crmSupabase) return null
  const { data, error } = await crmSupabase.from('crm_memberships').select('*').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data as CrmMembership | null
}

export async function getCrmLeads(): Promise<CrmLead[]> {
  if (!crmSupabase) return []
  const { data, error } = await crmSupabase.from('crm_leads').select('*').order('submitted_at', { ascending: false })
  if (error) throw error
  return (data || []) as CrmLead[]
}

export async function getCrmDistributors(): Promise<CrmDistributor[]> {
  if (!crmSupabase) return []
  const { data, error } = await crmSupabase.from('crm_distributors').select('*').order('display_name')
  if (error) throw error
  return (data || []) as CrmDistributor[]
}

export async function getLeadNotes(leadId: string): Promise<CrmLeadNote[]> {
  if (!crmSupabase) return []
  const { data, error } = await crmSupabase.from('crm_lead_notes').select('*').eq('lead_id', leadId).order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as CrmLeadNote[]
}

export async function updateLeadStatus(leadId: string, status: LeadStatus, nextFollowUpAt?: string | null) {
  if (!crmSupabase) throw new Error('CRM_NOT_CONFIGURED')
  const { error } = await crmSupabase.rpc('crm_update_lead_status', {
    p_lead_id: leadId,
    p_status: status,
    p_next_follow_up_at: nextFollowUpAt || null,
  })
  if (error) throw error
}

export async function assignLead(leadId: string, distributorId: string | null) {
  if (!crmSupabase) throw new Error('CRM_NOT_CONFIGURED')
  const { error } = await crmSupabase.rpc('crm_assign_lead', { p_lead_id: leadId, p_distributor_id: distributorId })
  if (error) throw error
}

export async function addLeadNote(leadId: string, body: string) {
  if (!crmSupabase) throw new Error('CRM_NOT_CONFIGURED')
  const { error } = await crmSupabase.rpc('crm_add_lead_note', { p_lead_id: leadId, p_body: body })
  if (error) throw error
}

export { crmConfigured, crmSupabase }
