import { SEO } from '@/components/SEO'
import { crmConfigured, crmSupabase, getCrmMembership } from '@/lib/crm'
import type { CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Boxes,
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  GraduationCap,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type CollectionId = 'start' | 'products' | 'business' | 'leadership'

type ResourceFolder = {
  title: string
  description: string
  collection: CollectionId
  topics: string[]
  href?: string
  official?: boolean
}

const SAGA_LIBRARY = 'https://thesaga.app/globalwavecreators/library'

const COLLECTIONS = [
  { id: 'start' as const, title: 'Start & Operate', subtitle: 'Set up correctly and confidently', icon: Wrench },
  { id: 'products' as const, title: 'Product Mastery', subtitle: 'Know the complete Enagic line', icon: Boxes },
  { id: 'business' as const, title: 'Business Growth', subtitle: 'Connect, invite, present, and follow up', icon: BriefcaseBusiness },
  { id: 'leadership' as const, title: 'Leadership & Compliance', subtitle: 'Duplicate responsibly and lead the team', icon: Users },
] as const

const FOLDERS: ResourceFolder[] = [
  { title: 'Getting Started with the Team System', description: 'Account setup, daily use, contacts, tasks, and the first distributor workflow.', collection: 'start', topics: ['SAGA setup', 'daily workflow', 'contacts'] },
  { title: 'Placing an Order', description: 'Ordering steps, documents, customer information, and distributor responsibilities.', collection: 'start', topics: ['orders', 'documents', 'customers'] },
  { title: 'Pricing & Financing Options', description: 'Market-aware pricing, payment options, and responsible financing conversations.', collection: 'start', topics: ['pricing', 'financing', 'markets'] },
  { title: 'Installation, Cleaning & Pre-Filters', description: 'Installation guidance, routine cleaning, maintenance, and pre-filter education.', collection: 'start', topics: ['installation', 'cleaning', 'maintenance'] },
  { title: 'Compensation Plan', description: 'The Enagic opportunity, compensation fundamentals, commission calculations, and the road to 6A2.', collection: 'start', topics: ['compensation', 'commissions', '6A2'] },
  { title: 'Complete Product Information', description: 'A central product index for ionizers, Anespa, emGuarde, Kangen Air, Ukon, and Kangen Wagyu.', collection: 'products', topics: ['K8', 'Anespa', 'emGuarde', 'Ukon'] },
  { title: 'Kangen Authority Training', description: 'Deeper product positioning, demonstration confidence, and customer education.', collection: 'products', topics: ['authority', 'education', 'demonstrations'] },
  { title: 'Filtration Education', description: 'Water filtration fundamentals and how to explain filtration responsibly.', collection: 'products', topics: ['filtration', 'water', 'education'] },
  { title: 'Demos, Events & Webinars', description: 'Why events matter, demo preparation, supplies, training, and presentation resources.', collection: 'products', topics: ['demos', 'events', 'supplies'] },
  { title: 'Shareable Product Resources', description: 'Temporary product videos, documents, images, and links for distributor conversations.', collection: 'products', topics: ['videos', 'documents', 'sharing'] },
  { title: 'The Prospect Flow', description: 'Connections, story sharing, Instagram lead generation, qualifying, invitations, and three-way calls.', collection: 'business', topics: ['prospecting', 'Instagram', 'qualifying'] },
  { title: 'Conversation & Follow-Up Scripts', description: 'Warm and cold starts, social-media replies, invitations, follow-ups, serving, and launching.', collection: 'business', topics: ['scripts', 'follow-up', 'launching'] },
  { title: 'Networking & Conversations', description: 'A growing library for relationship-first networking and confident conversations.', collection: 'business', topics: ['networking', 'conversations', 'relationships'] },
  { title: 'Content Resources & Prompts', description: 'Content planning, social-media ideas, prompts, and responsible distributor storytelling.', collection: 'business', topics: ['content', 'prompts', 'social media'] },
  { title: 'Testimonials', description: 'Individual experiences for education and social proof, always presented with the proper disclaimer.', collection: 'business', topics: ['stories', 'testimonials', 'disclaimer'] },
  { title: 'ChatGPT for Distributors', description: 'Practical AI support for planning, writing, organizing, and follow-up—with human review.', collection: 'business', topics: ['AI', 'ChatGPT', 'productivity'] },
  { title: 'Team Training Replays', description: 'Recurring team and company training replays organized by topic and date.', collection: 'leadership', topics: ['replays', 'team calls', 'training'] },
  { title: 'Personal Development & Business Training', description: 'Leadership challenges, development programs, sprints, and business fundamentals.', collection: 'leadership', topics: ['leadership', 'challenges', 'development'] },
  { title: 'Compliance & Distributor Files', description: 'Earnings disclosure, policies and procedures, compliance basics, and the distributor handbook.', collection: 'leadership', topics: ['compliance', 'policies', 'disclosures'] },
  { title: 'PDFs & Reading Materials', description: 'A structured reading shelf for approved guides, workbooks, and distributor documents.', collection: 'leadership', topics: ['PDFs', 'guides', 'workbooks'] },
  { title: 'Tax Education', description: 'General business tax-learning resources with clear direction to consult a qualified professional.', collection: 'leadership', topics: ['tax', 'business', 'disclaimer'] },
  { title: 'EWS Login', description: 'Open your personal Enagic Web System account.', collection: 'start', topics: ['EWS', 'official', 'login'], href: 'https://app.enagicwebsystem.com/backoffice.php?section=logout', official: true },
  { title: 'EWS System Training', description: 'Learn how to set up and use the Enagic Web System.', collection: 'start', topics: ['EWS', 'training', 'official'], href: 'https://app.enagicwebsystem.com/training', official: true },
  { title: 'Monday Distributor Training', description: 'Access the recurring Monday distributor training and available replays.', collection: 'leadership', topics: ['Monday', 'live training', 'replays'], href: 'https://www.truehealthlifestyle.team/monday', official: true },
  { title: 'Saturday Business Calls', description: 'Join the recurring Saturday business training calls and access replays.', collection: 'leadership', topics: ['Saturday', 'business call', 'replays'], href: 'https://www.truehealthlifestyle.team/saturday', official: true },
]

export default function AppLibraryPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState<CollectionId | 'all'>('all')

  useEffect(() => {
    if (!crmSupabase) { setLoading(false); return }
    crmSupabase.auth.getSession().then(({ data }) => { setSession(data.session); if (!data.session) setLoading(false) })
    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    getCrmMembership(session.user.id).then(member => { setMembership(member); setLoading(false) }).catch(() => setLoading(false))
  }, [session?.user.id])

  const visibleFolders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return FOLDERS.filter(folder => {
      const matchesCollection = collection === 'all' || folder.collection === collection
      const haystack = `${folder.title} ${folder.description} ${folder.topics.join(' ')}`.toLowerCase()
      return matchesCollection && (!normalized || haystack.includes(normalized))
    })
  }, [collection, query])

  if (!crmConfigured) return <Gate title="Library connection required" body="The secure distributor connection is unavailable in this preview." />
  if (loading) return <main className="min-h-screen bg-[#05091a]" />
  if (!session) return <Gate title="Distributor sign-in required" body="Sign in with your True Legacy distributor account to open the private library." action={<Link to="/crm" className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Sign in</Link>} />
  if (!membership?.active) return <Gate title="Account not authorized" body="An active True Legacy distributor profile is required to access this library." />

  return <main className="min-h-screen bg-[#05091a] px-4 pb-28 pt-[max(22px,env(safe-area-inset-top))] text-white sm:px-6">
    <SEO title="Distributor Library | True Legacy" description="Private True Legacy distributor resource library." noIndex />
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center gap-4"><Link to="/app" aria-label="Back to app home" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.04]"><ArrowLeft /></Link><div><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Private distributor resources</p><h1 className="text-2xl font-black">True Legacy Library</h1></div></header>

      <section className="mt-7 overflow-hidden rounded-[30px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.18),transparent_35%),linear-gradient(145deg,rgba(37,99,235,.12),rgba(255,255,255,.025))] p-6 sm:p-9">
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end"><div><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-3 py-1.5 text-xs font-bold text-cyan-200"><LockKeyhole className="h-3.5 w-3.5" /> Distributor access only</span><h2 className="mt-5 max-w-3xl text-3xl font-black sm:text-5xl">Everything you need—organized around the work.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Learn the products, operate the business, build conversations, and duplicate responsibly from one searchable resource center.</p></div><Link to="/training" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 font-black text-slate-950">Continue Academy <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[.06] p-4 text-sm leading-6 text-slate-300"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><p><strong className="text-amber-200">Temporary resource phase:</strong> external training references remain in their original protected source until a True Legacy version is ready. They will be replaced here without changing the library structure.</p></div>
      </section>

      <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{COLLECTIONS.map(item => { const Icon = item.icon; const count = FOLDERS.filter(folder => folder.collection === item.id).length; return <button key={item.id} onClick={() => setCollection(current => current === item.id ? 'all' : item.id)} className={`rounded-2xl border p-5 text-left transition ${collection === item.id ? 'border-cyan-300/40 bg-cyan-300/[.1]' : 'border-white/10 bg-white/[.035] hover:border-white/20'}`}><Icon className="h-7 w-7 text-cyan-300" /><h3 className="mt-4 text-lg font-black">{item.title}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{item.subtitle}</p><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{count} folders</p></button> })}</section>

      <section className="mt-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Resource center</p><h2 className="mt-2 text-3xl font-black">Browse every subject</h2></div><label className="relative block w-full sm:max-w-sm"><span className="sr-only">Search the distributor library</span><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products, scripts, compliance…" className="h-12 w-full rounded-xl border border-white/10 bg-white/[.035] pl-11 pr-11 text-sm outline-none focus:border-cyan-300/50" />{query && <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500"><X className="h-4 w-4" /></button>}</label></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleFolders.map(folder => { const parent = COLLECTIONS.find(item => item.id === folder.collection)!; const Icon = parent.icon; const target = folder.href || SAGA_LIBRARY; return <article key={folder.title} className="flex min-h-72 flex-col rounded-[24px] border border-white/10 bg-white/[.035] p-5"><div className="flex items-start justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Icon className="h-5 w-5" /></span><span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${folder.official ? 'border-emerald-300/20 bg-emerald-300/[.08] text-emerald-200' : 'border-amber-300/20 bg-amber-300/[.08] text-amber-200'}`}>{folder.official ? 'Direct resource' : 'Temporary source'}</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[.17em] text-slate-500">{parent.title}</p><h3 className="mt-2 text-xl font-black">{folder.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{folder.description}</p><div className="mt-5 flex flex-wrap gap-2">{folder.topics.map(topic => <span key={topic} className="rounded-lg bg-white/[.04] px-2.5 py-1 text-[10px] text-slate-400">{topic}</span>)}</div><a href={target} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 font-bold text-cyan-200 hover:bg-white/[.04]">{folder.official ? 'Open resource' : 'Open temporary library'} <ExternalLink className="h-4 w-4" /></a></article> })}</div>
        {visibleFolders.length === 0 && <div className="mt-5 rounded-3xl border border-dashed border-white/15 p-12 text-center"><Search className="mx-auto h-8 w-8 text-slate-600" /><h3 className="mt-4 text-xl font-black">No matching resources</h3><p className="mt-2 text-sm text-slate-500">Try another search or show all collections.</p><button onClick={() => { setQuery(''); setCollection('all') }} className="mt-5 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold">Reset library</button></div>}
      </section>

      <section className="mt-9 grid gap-4 sm:grid-cols-3"><LibraryPoint icon={<BookOpenCheck />} title="Guided learning" text="Use the Academy when you want structured modules, quizzes, and progress." /><LibraryPoint icon={<FileText />} title="Fast reference" text="Use the Library when you need an answer, document, script category, or replay." /><LibraryPoint icon={<ShieldCheck />} title="Responsible sharing" text="Compliance, disclosures, and official sources stay visible throughout the system." /></section>
    </div>
  </main>
}

function LibraryPoint({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><span className="text-cyan-300">{icon}</span><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div> }
function Gate({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-[#05091a] p-5 text-white"><SEO title={`${title} | True Legacy`} description={body} noIndex /><div className="max-w-md text-center"><GraduationCap className="mx-auto h-11 w-11 text-cyan-300" /><h1 className="mt-5 text-3xl font-black">{title}</h1><p className="mt-4 leading-7 text-slate-400">{body}</p>{action && <div className="mt-7">{action}</div>}</div></main> }
