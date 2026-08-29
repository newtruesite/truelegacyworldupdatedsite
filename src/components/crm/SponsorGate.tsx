import { crmSupabase } from '@/lib/crm'
import type { CrmDistributor, CrmMembership } from '@/lib/crm'
import { Network, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export function SponsorGate({ membership, distributors, children }: { membership: CrmMembership | null; distributors: CrmDistributor[]; children: React.ReactNode }) {
  const [sponsorState, setSponsorState] = useState<'checking'|'missing'|'confirmed'>(membership?.distributor_id ? 'checking' : 'confirmed')
  const [sponsorId, setSponsorId] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const distributorId = membership?.distributor_id
    if (!distributorId || !crmSupabase) return
    crmSupabase.from('crm_team_relationships').select('sponsor_distributor_id').eq('distributor_id', distributorId).maybeSingle().then(({ data }) => {
      setSponsorState(data?.sponsor_distributor_id ? 'confirmed' : 'missing')
    })
  }, [membership?.distributor_id])

  const currentDistributor = useMemo(() => distributors.find(d => d.id === membership?.distributor_id), [distributors, membership?.distributor_id])
  const isTopAdmin = membership?.role === 'admin' || currentDistributor?.slug === 'ming-way-sia' || currentDistributor?.slug === 'mehdi-cohen' || currentDistributor?.slug === 'simon-loh'

  const choices = useMemo(() => distributors.filter(item => item.active && item.id !== membership?.distributor_id), [distributors, membership?.distributor_id])

  if (sponsorState === 'checking') return <main className="min-h-screen bg-black" />
  if (!membership?.distributor_id || isTopAdmin || sponsorState === 'confirmed') return <>{children}</>

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!crmSupabase || !sponsorId) return
    setSaving(true)
    setMessage('')
    const { error } = await crmSupabase.rpc('crm_choose_sponsor', { p_sponsor_distributor_id: sponsorId })
    setSaving(false)
    if (error) {
      setMessage(error.message)
      return
    }
    setSponsorState('confirmed')
  }

  return <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white"><section className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/[0.03] p-7 sm:p-10"><Network className="h-10 w-10 text-[#2997ff]"/><p className="mt-6 text-xs font-bold uppercase tracking-[.25em] text-[#2997ff]">Required first step</p><h1 className="mt-2 text-3xl font-black">Who is your direct sponsor?</h1><p className="mt-4 leading-7 text-[#cccccc]">Choose the person who directly introduced or enrolled you. This connects your training progress, team development, and reporting to the correct leadership line.</p><form onSubmit={submit} className="mt-7 grid gap-4"><label className="text-sm font-semibold text-[#cccccc]">Direct sponsor/upline<select required value={sponsorId} onChange={event => setSponsorId(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black px-4 text-white"><option value="">Select your sponsor</option>{choices.map(item => <option key={item.id} value={item.id}>{item.display_name}{item.title ? ` — ${item.title}` : ''}</option>)}</select></label><div className="flex items-start gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-4 text-sm leading-6 text-amber-100"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0"/><p>Please choose carefully. After confirmation, only a True Legacy administrator can transfer the relationship.</p></div><button disabled={saving || !sponsorId} className="h-12 rounded-xl bg-cyan-500 font-bold text-slate-950 disabled:opacity-50">{saving ? 'Saving…' : 'Confirm my sponsor'}</button>{message && <p role="alert" className="text-sm text-rose-300">{message}</p>}</form></section></main>
}
