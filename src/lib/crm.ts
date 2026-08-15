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
    avatar_url: '/leaders/standardized/mehdi-cohen.png',
    regions: ['Global', 'LATAM', 'Morocco', 'USA', 'Canada'],
    languages: ['en', 'es', 'fr', 'ar'],
    phone: '+1 (864) 907-2149',
    instagram_url: 'https://www.instagram.com/mehdicohen_/',
  },
  {
    id: 'preview-ryan',
    slug: 'ryan-pool',
    referral_code: 'ryan-pool',
    display_name: 'Ryan Pool Sr',
    title: 'True Legacy Leader',
    bio: 'Ryan Pool is an entrepreneur, former athlete, and community-minded leader based in Los Angeles. Passionate about health, fitness, personal development, and entrepreneurship, Ryan is focused on building businesses, connecting with like-minded people, and creating opportunities for others.\n\nAs an independent entrepreneur in the wellness space, Ryan is expanding his network and helping people discover new ways to prioritize hydration, wellness, and a healthier lifestyle. His vision goes beyond business—he wants to build a strong legacy for his family, create financial freedom, and inspire others to pursue their own goals with purpose, discipline, and consistency.',
    avatar_url: '/leaders/standardized/ryan-pool-sr.png',
    regions: ['USA'],
    languages: ['en'],
    phone: '213-733-6286',
    instagram_url: 'https://www.instagram.com/ryanpoolsr/',
  },
  {
    id: 'preview-magaly',
    slug: 'magaly-cardona',
    referral_code: 'magaly-cardona',
    display_name: 'Magaly Cardona',
    title: 'True Legacy Distributor',
    bio: 'Magaly helps people design work that aligns with their values—guiding leaders across the U.S. and Latin America to build intentional businesses through Enagic and community.',
    avatar_url: '/leaders/standardized/magaly-cardona.png',
    regions: ['USA', 'LATAM'],
    languages: ['en', 'es'],
    phone: '+1 (864) 201-8298',
    instagram_url: 'https://www.instagram.com/mcardonita/',
  },
  {
    id: 'preview-ming-way',
    slug: 'ming-way-sia',
    referral_code: 'ming-way-sia',
    display_name: 'Ming-Way Sia',
    title: 'True Legacy 6A2-5 Leader',
    bio: 'Ming-Way built from the ground up alongside his father, developing discipline and resilience that he now uses to help others build responsible, legacy-focused businesses.',
    avatar_url: '/leaders/standardized/ming-way-sia.png',
    regions: ['Global', 'Malaysia', 'India'],
    languages: ['en'],
    phone: '+60 12-276-1229',
    instagram_url: 'https://www.instagram.com/mingwaysia/',
  },
  {
    id: 'preview-alex',
    slug: 'alex-gonzalez',
    referral_code: 'alex-gonzalez',
    display_name: 'Alex Gonzalez',
    title: 'True Legacy Distributor',
    bio: 'Alex Gonzalez brings over 35 years of experience in marketing within the supplement industry. Throughout his career, he has remained passionate about health, wellness, and helping others live their best lives. For Alex, a healthy lifestyle isn’t just a profession—it’s a personal commitment and the most important foundation for a fulfilling life.',
    avatar_url: '/leaders/standardized/alex-gonzalez.png',
    regions: ['USA'],
    languages: ['en', 'es'],
    phone: '+1 (954) 263-5001',
    instagram_url: 'https://www.instagram.com/alexgonzalez_vp/',
  },
  {
    id: 'preview-zah',
    slug: 'zah-naderi',
    referral_code: 'zah-naderi',
    display_name: 'Zah Naderi',
    title: 'True Legacy Distributor',
    bio: "For more than a decade, I've had the privilege of coaching some of the world’s top performers—elite athletes, celebrities, and C-suite executives. But what I discovered along that journey went beyond just training—it was about mastering leadership, understanding leverage, and embracing a vision that’s bigger than yourself.\n\nI realized true, lasting impact isn't created in isolation. It comes from connecting with the right people and choosing the right vehicle. That’s what led me to Enagic—a company built on authenticity, proven systems, and sustainable growth.\n\nNow, we have a space where like-minded leaders unite, blend their strengths, and leverage our collective expertise to build generational wealth and a lasting legacy.",
    avatar_url: '/leaders/standardized/zah-naderi.png',
    regions: ['Global', 'USA'],
    languages: ['en'],
    phone: '+1 (585) 319-6018',
    instagram_url: 'https://www.instagram.com/zahphysique/',
  },
  {
    id: 'preview-simon',
    slug: 'simon-loh',
    referral_code: 'simon-loh',
    display_name: 'Simon Loh',
    title: 'True Legacy 6A2-4 Leader',
    bio: 'Accountant by training, entrepreneur by life. Simon escaped the rat race in 2016 and built his Enagic business across international markets. Today, he travels the world sharing his experience and training entrepreneurs to pursue financial freedom through Enagic and the True Legacy community.',
    avatar_url: '/leaders/standardized/simon-loh.png',
    regions: ['Global', 'Malaysia', 'India', 'UAE', 'Türkiye', 'Nigeria', 'Kazakhstan', 'USA', 'Canada'],
    languages: ['en', 'zh', 'yue', 'ms'],
    phone: '+60126612042',
    instagram_url: 'https://www.instagram.com/simonloh_/',
  },
  {
    id: 'preview-emanuela',
    slug: 'emanuela',
    referral_code: 'emanuela',
    display_name: 'Emanuela',
    title: 'True Legacy Distributor',
    bio: 'Profile details coming soon.',
    avatar_url: '/leaders/standardized/emanuela-doustova.png',
    regions: ['USA'],
    languages: ['en'],
    phone: '+1 (818) 858-8585',
    instagram_url: 'https://www.instagram.com/emanuelabraj/',
  },
  {
    id: 'preview-jesse',
    slug: 'jesse-schexnayder',
    referral_code: 'jesse-hotshotz',
    display_name: 'Jesse Schexnayder',
    title: 'True Legacy Distributor',
    bio: "You could say I am a serial entrepreneur. Most know me for my latest venture, HotShotz Reusable Heat Packs. I have a love for life and the universe, and I’m the CEO of Let’s Go!!",
    avatar_url: '/leaders/standardized/jesse-schexnayder.png',
    regions: ['USA'],
    languages: ['en'],
    phone: '+1 (916) 214-6943',
    instagram_url: null,
  },
  {
    id: 'preview-angel',
    slug: 'angel-mok',
    referral_code: 'angel',
    display_name: 'Angel Mok E Lin',
    title: 'True Legacy Distributor',
    bio: 'After graduating from university, I entered the fast-paced world of equity trading and built a successful career. Yet, despite the financial success, I knew I wanted something more meaningful.\n\nThat search led me to True Legacy through Coach Simon, where I discovered a new path of entrepreneurship, purpose, and personal growth.\n\nToday, I travel the world with my equity business AND as a global distributor for Enagic, building an international business while helping others discover new possibilities for themselves.\n\nFor me, success is no longer just about income - it’s about freedom, impact, and the legacy we leave behind.',
    avatar_url: '/leaders/standardized/angel-mok.png',
    regions: ['Malaysia', 'Singapore', 'Dubai', 'Türkiye', 'Nigeria'],
    languages: ['en'],
    phone: null,
    instagram_url: null,
  },
]

export async function getPublicDistributors(): Promise<PublicDistributor[]> {
  if (!crmSupabase) return FALLBACK_DISTRIBUTORS
  const { data, error } = await crmSupabase.rpc('get_public_crm_distributors')
  if (error || !Array.isArray(data)) return FALLBACK_DISTRIBUTORS
  const remoteDistributors = (data as PublicDistributor[]).map(profile => {
    if (!['mehdi-cohen', 'simon-loh', 'ming-way-sia', 'zah-naderi', 'jesse-schexnayder', 'angel-mok'].includes(profile.slug)) return profile
    const confirmed = FALLBACK_DISTRIBUTORS.find(item => item.slug === profile.slug)
    return confirmed ? { ...profile, ...confirmed, id: profile.id } : profile
  })
  const remoteSlugs = new Set(remoteDistributors.map(profile => profile.slug))
  return [...remoteDistributors, ...FALLBACK_DISTRIBUTORS.filter(profile => !remoteSlugs.has(profile.slug))]
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
