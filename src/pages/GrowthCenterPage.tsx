import { SEO } from '@/components/SEO'
import { crmSupabase, getCrmDistributors, getCrmLeads, getCrmMembership } from '@/lib/crm'
import type { CrmDistributor, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { CheckCircle2, Copy, ExternalLink, GraduationCap, Link2, LogOut, QrCode, Share2, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Module = { id: string; position: number; category: string; title: Record<string,string>; video_url: string | null }
type Item = { id: string; position: number; title: Record<string,string> }
type Progress = { distributor_id: string; module_id?: string; item_id?: string; completed: boolean }
type Relationship = { distributor_id: string; sponsor_distributor_id: string | null }
type ClickRow = { distributor_id: string; campaign: string }

const CAMPAIGNS = [
  { id:'profile', label:'Distributor Profile', path:'' },
  { id:'business', label:'Business Presentation', path:'/business' },
  { id:'duo', label:'Duo Products', path:'/duo' },
  { id:'training', label:'Training Preview', path:'/training' },
  { id:'events', label:'Live Events', path:'/events' },
] as const

export default function GrowthCenterPage() {
  const [session,setSession]=useState<Session|null>(null)
  const [membership,setMembership]=useState<CrmMembership|null>(null)
  const [distributors,setDistributors]=useState<CrmDistributor[]>([])
  const [selected,setSelected]=useState('')
  const [modules,setModules]=useState<Module[]>([])
  const [items,setItems]=useState<Item[]>([])
  const [training,setTraining]=useState<Progress[]>([])
  const [onboarding,setOnboarding]=useState<Progress[]>([])
  const [relationships,setRelationships]=useState<Relationship[]>([])
  const [clicks,setClicks]=useState<ClickRow[]>([])
  const [leadTotals,setLeadTotals]=useState<Record<string,number>>({})
  const [qr,setQr]=useState<{label:string;data:string}|null>(null)
  const [copied,setCopied]=useState('')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{ crmSupabase?.auth.getSession().then(({data})=>setSession(data.session)); const {data}=crmSupabase!.auth.onAuthStateChange((_e,s)=>setSession(s)); return()=>data.subscription.unsubscribe() },[])
  useEffect(()=>{ if(!session)return; (async()=>{ const member=await getCrmMembership(session.user.id); setMembership(member); if(!member?.active)return; const [ds,ms,is_,tp,op,rs,cs,ls]=await Promise.all([
    getCrmDistributors(), crmSupabase!.from('crm_training_modules').select('*').eq('active',true).order('position'), crmSupabase!.from('crm_onboarding_items').select('*').eq('active',true).order('position'), crmSupabase!.from('crm_training_progress').select('*'), crmSupabase!.from('crm_onboarding_progress').select('*'), crmSupabase!.from('crm_team_relationships').select('*'), crmSupabase!.from('crm_link_clicks').select('distributor_id,campaign'), getCrmLeads()
  ]); setDistributors(ds); setModules((ms.data||[]) as Module[]); setItems((is_.data||[]) as Item[]); setTraining((tp.data||[]) as Progress[]); setOnboarding((op.data||[]) as Progress[]); setRelationships((rs.data||[]) as Relationship[]); setClicks((cs.data||[]) as ClickRow[]); const totals:Record<string,number>={}; ls.forEach(l=>{if(l.assigned_distributor_id) totals[l.assigned_distributor_id]=(totals[l.assigned_distributor_id]||0)+1}); setLeadTotals(totals); const defaultId=member.role==='distributor'?member.distributor_id:(ds[0]?.id||''); setSelected(defaultId||''); setLoading(false) })().catch(()=>setLoading(false)) },[session?.user.id])

  const visible=useMemo(()=>{ if(membership?.role==='admin')return distributors.filter(d=>d.active); const mine=membership?.distributor_id; const team=new Set([mine,...relationships.filter(r=>r.sponsor_distributor_id===mine).map(r=>r.distributor_id)]); return distributors.filter(d=>team.has(d.id)) },[distributors,membership,relationships])
  const distributor=visible.find(d=>d.id===selected)||visible[0]
  const doneModules=training.filter(p=>p.distributor_id===distributor?.id&&p.completed).length
  const doneItems=onboarding.filter(p=>p.distributor_id===distributor?.id&&p.completed).length
  const locale='en'
  const canEdit=membership?.role==='admin'||membership?.distributor_id===distributor?.id

  const setProgress=async(kind:'training'|'onboarding',id:string,completed:boolean)=>{ if(!distributor||!crmSupabase)return; const fn=kind==='training'?'crm_set_training_progress':'crm_set_onboarding_progress'; const args=kind==='training'?{p_distributor_id:distributor.id,p_module_id:id,p_completed:completed}:{p_distributor_id:distributor.id,p_item_id:id,p_completed:completed}; const {error}=await crmSupabase.rpc(fn,args); if(error)return; const setter=kind==='training'?setTraining:setOnboarding; setter(current=>[...current.filter(p=>!(p.distributor_id===distributor.id&&(kind==='training'?p.module_id:p.item_id)===id)),{distributor_id:distributor.id,[kind==='training'?'module_id':'item_id']:id,completed}]) }
  const showQr=(label:string,url:string)=>setQr({label,data:`https://api.qrserver.com/v1/create-qr-code/?size=720x720&data=${encodeURIComponent(url)}`})
  if(!session)return <Message title="Growth Center sign-in required" body="Sign in to the CRM first, then open the Growth Center." action={<Link to="/crm" className="rounded-xl bg-cyan-500 px-5 py-3 font-bold">CRM sign in</Link>}/>
  if(loading)return <main className="min-h-screen bg-black"/>
  if(!membership?.active)return <Message title="Account not authorized" body="This account does not have an active True Legacy role."/>

  return <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8"><SEO title="True Legacy Growth Center" description="Private distributor sharing and training progress center." noIndex/><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#2997ff]">Duplication & team development</p><h1 className="mt-2 text-4xl font-black">Growth Center</h1><p className="mt-2 text-sm text-[#cccccc]">Personal links, campaign results, onboarding, and training progress.</p></div><div className="flex gap-2"><Link to="/crm" className="rounded-xl border border-white/15 px-4 py-3 text-sm">Lead dashboard</Link><button onClick={()=>crmSupabase?.auth.signOut()} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm"><LogOut className="h-4 w-4"/>Sign out</button></div></header>
  {visible.length>1&&<section className="mt-6 rounded-2xl border border-white/10 bg-white/[.03] p-4"><label className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Viewing distributor/team member</label><select value={distributor?.id||''} onChange={e=>setSelected(e.target.value)} className="mt-2 h-11 w-full max-w-md rounded-xl border border-white/10 bg-black px-4"><option value={membership.distributor_id||''}>My progress</option>{visible.filter(d=>d.id!==membership.distributor_id).map(d=><option key={d.id} value={d.id}>{d.display_name}</option>)}</select></section>}
  {distributor&&<><section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={<Link2/>} value={clicks.filter(c=>c.distributor_id===distributor.id).length} label="Tracked clicks"/><Metric icon={<Users/>} value={leadTotals[distributor.id]||0} label="Attributed leads"/><Metric icon={<CheckCircle2/>} value={`${doneItems}/${items.length}`} label="Onboarding"/><Metric icon={<GraduationCap/>} value={`${doneModules}/${modules.length}`} label="Training modules"/></section>
  <section className="mt-7"><h2 className="text-2xl font-black">Personal Sharing Center</h2><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{CAMPAIGNS.map(c=>{const url=`${window.location.origin}/d/${distributor.slug}${c.path}`; const clickCount=clicks.filter(x=>x.distributor_id===distributor.id&&x.campaign===c.id).length; return <article key={c.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="font-bold">{c.label}</p><p className="mt-1 text-xs text-[#86868b]">{clickCount} tracked clicks</p><p className="mt-3 truncate rounded-lg bg-black/20 p-3 text-xs text-[#cccccc]">{url}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={async()=>{await navigator.clipboard.writeText(url);setCopied(c.id);setTimeout(()=>setCopied(''),1200)}} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs"><Copy className="h-4 w-4"/>{copied===c.id?'Copied':'Copy'}</button><button onClick={()=>navigator.share?navigator.share({title:c.label,url}):navigator.clipboard.writeText(url)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs"><Share2 className="h-4 w-4"/>Share</button><button onClick={()=>showQr(c.label,url)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs"><QrCode className="h-4 w-4"/>QR</button><a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs"><ExternalLink className="h-4 w-4"/>Open</a></div></article>})}</div></section>
  <section className="mt-8 grid gap-6 xl:grid-cols-2"><ProgressPanel title="Distributor Onboarding" subtitle={`${doneItems} of ${items.length} completed`} percent={items.length?Math.round(doneItems/items.length*100):0}>{items.map(item=><CheckRow key={item.id} label={item.title[locale]||item.title.en} checked={onboarding.some(p=>p.distributor_id===distributor.id&&p.item_id===item.id&&p.completed)} disabled={!canEdit} onChange={v=>setProgress('onboarding',item.id,v)}/>)}</ProgressPanel><ProgressPanel title="Training Progress" subtitle={`${doneModules} of ${modules.length} modules completed`} percent={modules.length?Math.round(doneModules/modules.length*100):0}>{modules.map(module=><div key={module.id} className="rounded-xl border border-white/10 p-3"><CheckRow label={module.title[locale]||module.title.en} checked={training.some(p=>p.distributor_id===distributor.id&&p.module_id===module.id&&p.completed)} disabled={!canEdit} onChange={v=>setProgress('training',module.id,v)}/>{module.video_url&&<a href={module.video_url} target="_blank" rel="noreferrer" className="ml-8 mt-1 inline-flex items-center gap-1 text-xs text-[#2997ff]">Watch training <ExternalLink className="h-3 w-3"/></a>}</div>)}</ProgressPanel></section></>}
  {qr&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={()=>setQr(null)}><div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center text-slate-950" onClick={e=>e.stopPropagation()}><h3 className="text-xl font-black">{qr.label}</h3><img src={qr.data} alt={`${qr.label} QR code`} className="mx-auto mt-5 w-full"/><a href={qr.data} download={`${qr.label.toLowerCase().replaceAll(' ','-')}-qr.png`} className="mt-5 inline-flex rounded-xl bg-cyan-500 px-5 py-3 font-bold">Download QR code</a><button onClick={()=>setQr(null)} className="mt-3 block w-full text-sm text-[#86868b]">Close</button></div></div>}</div></main>
}

function Metric({icon,value,label}:{icon:React.ReactNode;value:string|number;label:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><span className="text-[#2997ff]">{icon}</span><p className="mt-4 text-3xl font-black">{value}</p><p className="text-xs uppercase tracking-wider text-[#86868b]">{label}</p></div>}
function ProgressPanel({title,subtitle,percent,children}:{title:string;subtitle:string;percent:number;children:React.ReactNode}){return <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="flex items-end justify-between"><div><h2 className="text-xl font-black">{title}</h2><p className="mt-1 text-xs text-[#86868b]">{subtitle}</p></div><p className="text-2xl font-black text-[#2997ff]">{percent}%</p></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-cyan-400" style={{width:`${percent}%`}}/></div><div className="mt-5 space-y-2">{children}</div></section>}
function CheckRow({label,checked,disabled,onChange}:{label:string;checked:boolean;disabled:boolean;onChange:(v:boolean)=>void}){return <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-3 text-sm"><input type="checkbox" checked={checked} disabled={disabled} onChange={e=>onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-cyan-400"/><span className={checked?'text-[#cccccc] line-through':'text-slate-200'}>{label}</span></label>}
function Message({title,body,action}:{title:string;body:string;action?:React.ReactNode}){return <main className="flex min-h-screen items-center justify-center bg-black p-4 text-white"><div className="max-w-lg rounded-3xl border border-white/10 p-8 text-center"><h1 className="text-3xl font-black">{title}</h1><p className="mt-4 text-[#cccccc]">{body}</p>{action&&<div className="mt-6">{action}</div>}</div></main>}
