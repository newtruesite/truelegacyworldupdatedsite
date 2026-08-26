import { SEO } from '@/components/SEO'
import { LeaderPortraitGenerator } from '@/components/leaders/LeaderPortraitGenerator'
import type { LeaderPortraitData } from '@/config/portraitStandard'
import { crmConfigured, crmSupabase, getCrmDistributors, getCrmMembership, updateDistributorProfile } from '@/lib/crm'
import type { CrmDistributor, CrmMembership, DistributorProfileUpdate } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { CheckCircle2, ExternalLink, LoaderCircle, Save, Settings2, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

const LANGUAGE_OPTIONS = [
  ['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['pt', 'Portuguese'],
  ['zh', 'Mandarin'], ['yue', 'Cantonese'], ['ms', 'Malay'], ['ar', 'Arabic'], ['ru', 'Russian'],
] as const

export default function AppAccountPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [membership, setMembership] = useState<CrmMembership | null>(null)
  const [distributors, setDistributors] = useState<CrmDistributor[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(crmConfigured)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!crmSupabase) {
      getCrmDistributors().then((rows) => {
        setDistributors(rows)
        setSelectedId(rows[0]?.id || '')
        setLoading(false)
      })
      return
    }

    crmSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      getCrmDistributors().then((rows) => {
        setDistributors(rows)
        const ownId = rows.find((item) => item.slug === 'mehdi-cohen')?.id || rows[0]?.id
        setSelectedId(ownId || '')
        setLoading(false)
      })
    })

    const { data } = crmSupabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    getCrmMembership(session.user.id)
      .then((member) => {
        setMembership(member)
        if (member?.distributor_id) {
          setSelectedId(member.distributor_id)
        }
      })
      .catch(() => {})
  }, [session])

  const distributor = useMemo(() => distributors.find(item => item.id === selectedId) || distributors[0] || null, [distributors, selectedId])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!distributor) return
    const data = new FormData(event.currentTarget)
    const payload: DistributorProfileUpdate = {
      displayName: String(data.get('displayName') || ''),
      title: String(data.get('title') || ''),
      bio: String(data.get('bio') || ''),
      phone: String(data.get('phone') || ''),
      instagramUrl: String(data.get('instagramUrl') || ''),
      regions: String(data.get('regions') || '').split(',').map(item => item.trim()).filter(Boolean),
      languages: data.getAll('languages').map(String),
      acceptingLeads: data.get('acceptingLeads') === 'on',
    }
    setSaving(true); setError(''); setMessage('')
    try {
      if (session && crmConfigured) {
        const updated = await updateDistributorProfile(distributor.id, payload)
        setDistributors(rows => rows.map(item => item.id === updated.id ? updated : item))
        setMessage('Your public leader information has been saved.')
      } else {
        // Local preview update
        setDistributors(rows =>
          rows.map(item =>
            item.id === distributor.id
              ? {
                  ...item,
                  display_name: payload.displayName,
                  title: payload.title,
                  bio: payload.bio,
                  phone: payload.phone,
                  instagram_url: payload.instagramUrl,
                  regions: payload.regions,
                  languages: payload.languages,
                  accepting_leads: payload.acceptingLeads,
                  avatar_url: customAvatarUrl || item.avatar_url,
                }
              : item
          )
        )
        setMessage('Preview profile updated successfully.')
      }
    } catch {
      setError('Your changes could not be saved. Check the fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePortraitChange = (data: LeaderPortraitData) => {
    if (data.approvedPortraitUrl) {
      setCustomAvatarUrl(data.approvedPortraitUrl)
    }
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-black text-white"><LoaderCircle className="h-8 w-8 animate-spin text-[#2997ff]" /></main>
  if (!distributor) return <AccountState title="Leader account not found" body="No leader profiles were found. Please check back later." />

  const currentAvatar = customAvatarUrl || distributor.avatar_url || '/logos/tl-square-white.png'

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#12233d,#05070c_48%)] px-4 pb-32 pt-10 text-white sm:px-6">
    <SEO title="Leader Account Settings | True Legacy" description="Manage your verified True Legacy leader profile." noIndex />
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.24em] text-[#2997ff]">Verified leader account</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">Account settings</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#aeb4c0]">Update the information shown on your public profile and leader directory card.</p></div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/leaders/portrait" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2997ff]/40 bg-[#2997ff]/10 px-4 text-sm font-bold text-[#2997ff] hover:bg-[#2997ff]/20 transition"><Sparkles className="h-4 w-4" /> Portrait Studio</Link>
          <Link to={`/d/${distributor.slug}`} target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-bold">View public profile <ExternalLink className="h-4 w-4" /></Link>
        </div>
      </header>

      {membership?.role === 'admin' ? <label className="mt-7 block max-w-sm text-sm text-[#aeb4c0]">Profile to manage<select value={selectedId} onChange={event => { setSelectedId(event.target.value); setMessage(''); setError('') }} className="account-input mt-2"><option value="">Choose a leader</option>{distributors.map(item => <option key={item.id} value={item.id}>{item.display_name}</option>)}</select></label> : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start w-full max-w-full min-w-0">
        <aside className="lg:sticky lg:top-10 h-fit rounded-[28px] border border-white/10 bg-white/[.035] p-5 text-center shadow-xl w-full min-w-0">
          <div className="relative group">
            <img src={currentAvatar} alt={distributor.display_name} className="mx-auto aspect-[4/5] w-full rounded-2xl border border-white/10 bg-[#0a0d13] object-cover object-top" />
            <div className="mt-3 text-center">
              <span className="text-[11px] font-semibold text-[#aeb4c0]">Active Directory Portrait</span>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[.08] px-3 py-1.5 text-xs font-bold text-emerald-200"><ShieldCheck className="h-4 w-4" /> Verified profile</div>
          <p className="mt-3 text-xs leading-5 text-[#868c98]">Your portrait is standardized to the True Legacy 4:5 luxury studio format for consistency across the directory.</p>
        </aside>

        <div className="space-y-8 w-full max-w-full min-w-0">
          {/* Integrated AI Leader Portrait Generator */}
          <LeaderPortraitGenerator
            title="Leader Portrait"
            supportingCopy="Upload your photo and generate a professional True Legacy leader portrait that matches the leadership directory standard."
            guidanceNote="Your final portrait will keep your real identity, outfit, and recognizable appearance while standardizing the crop, background, lighting, and finish."
            onPortraitChange={handlePortraitChange}
            onApprovePortrait={(approvedUrl) => {
              setCustomAvatarUrl(approvedUrl)
              setMessage('Standardized portrait approved for your profile. Click "Save profile changes" to finalize.')
            }}
          />

          {/* Public Profile Information Form */}
          <form key={distributor.id} onSubmit={submit} className="rounded-[28px] border border-white/10 bg-black/35 p-5 sm:p-8">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-[#2997ff]"><UserRound className="h-5 w-5" /></span><div><h2 className="text-xl font-black">Public profile information</h2><p className="text-sm text-[#868c98]">Changes appear wherever your CRM profile is used.</p></div></div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Display name"><input required name="displayName" defaultValue={distributor.display_name} minLength={2} maxLength={120} className="account-input" /></Field>
              <Field label="Leadership title"><input required name="title" defaultValue={distributor.title} maxLength={160} className="account-input" /></Field>
              <Field label="Phone / WhatsApp"><input name="phone" defaultValue={distributor.phone || ''} maxLength={50} className="account-input" /></Field>
              <Field label="Instagram profile URL"><input name="instagramUrl" type="url" defaultValue={distributor.instagram_url || ''} placeholder="https://instagram.com/username" className="account-input" /></Field>
              <Field label="Markets and regions" hint="Separate markets with commas."><input required name="regions" defaultValue={distributor.regions.join(', ')} className="account-input" /></Field>
              <Field label="Account email" hint="Contact support to change the sign-in email."><input value={session?.user?.email || distributor.login_email || 'leader@truelegacyworld.com'} disabled className="account-input opacity-65" /></Field>
            </div>
            <Field label="Biography" className="mt-5"><textarea name="bio" defaultValue={distributor.bio || ''} maxLength={5000} rows={8} className="account-input resize-y" /></Field>
            <fieldset className="mt-5"><legend className="text-sm font-bold">Languages</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{LANGUAGE_OPTIONS.map(([value, label]) => <label key={value} className="flex items-center gap-2 rounded-xl border border-white/10 p-3 text-sm text-[#c9ced7]"><input type="checkbox" name="languages" value={value} defaultChecked={distributor.languages.includes(value)} />{label}</label>)}</div></fieldset>
            <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm leading-6"><input type="checkbox" name="acceptingLeads" defaultChecked={distributor.accepting_leads} className="mt-1" /><span><strong className="block">Accept new referrals</strong><span className="text-[#868c98]">Allow visitors without an existing sponsor to select you.</span></span></label>
            {message ? <p className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[.08] p-4 text-sm text-emerald-100"><CheckCircle2 className="h-5 w-5" />{message}</p> : null}
            {error ? <p role="alert" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/[.08] p-4 text-sm text-rose-100">{error}</p> : null}
            <button disabled={saving} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 font-black text-slate-950 disabled:opacity-60 transition hover:bg-cyan-300"><Save className="h-4 w-4" />{saving ? 'Saving securely…' : 'Save profile changes'}</button>
          </form>
        </div>
      </div>
    </div>
  </main>
}

function Field({ label, hint, className = '', children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return <label className={`block text-sm text-[#c9ced7] ${className}`}><span className="font-bold text-white">{label}</span>{hint ? <span className="ml-2 text-xs text-[#747b88]">{hint}</span> : null}<span className="mt-2 block">{children}</span></label>
}

function AccountState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-black p-5 text-white"><SEO title={`${title} | True Legacy`} description={body} noIndex /><div className="max-w-md text-center"><Settings2 className="mx-auto h-10 w-10 text-[#2997ff]" /><h1 className="mt-5 text-3xl font-black">{title}</h1><p className="mt-4 leading-7 text-[#aeb4c0]">{body}</p>{action ? <div className="mt-6">{action}</div> : null}</div></main>
}

