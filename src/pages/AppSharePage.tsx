import { SEO } from '@/components/SEO'
import { crmConfigured, crmSupabase, getCrmDistributors, getCrmMembership } from '@/lib/crm'
import type { CrmDistributor, CrmMembership } from '@/lib/crm'
import type { Session } from '@supabase/supabase-js'
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Check, Copy, ExternalLink, GraduationCap, QrCode, Share2, Sparkles, UserRound, Waves } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const PAGES = [
  { id:'profile', label:'My Profile', description:'Your biography, markets, languages, and ways to connect.', path:'', icon:UserRound },
  { id:'business', label:'Business', description:'Leadership, duplication, and the independent opportunity.', path:'/business', icon:BriefcaseBusiness },
  { id:'duo', label:'Duo Products', description:'K8 and emGuarde GO with the product demonstrations.', path:'/duo', icon:Waves },
  { id:'training', label:'Training', description:'A public preview of the True Legacy education system.', path:'/training', icon:GraduationCap },
  { id:'events', label:'Live Events', description:'The current English and Spanish weekly presentations.', path:'/events', icon:CalendarDays },
] as const

export default function AppSharePage(){
  const [session,setSession]=useState<Session|null>(null)
  const [membership,setMembership]=useState<CrmMembership|null>(null)
  const [distributors,setDistributors]=useState<CrmDistributor[]>([])
  const [selected,setSelected]=useState<(typeof PAGES)[number]['id']>('profile')
  const [copied,setCopied]=useState(false)
  const [showQr,setShowQr]=useState(false)
  const [selectedDistributorId,setSelectedDistributorId]=useState('')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(!crmSupabase){setLoading(false);return}
    crmSupabase.auth.getSession().then(({data})=>{setSession(data.session);if(!data.session)setLoading(false)})
    const {data}=crmSupabase.auth.onAuthStateChange((_event,next)=>setSession(next))
    return()=>data.subscription.unsubscribe()
  },[])
  useEffect(()=>{if(!session)return;Promise.all([getCrmMembership(session.user.id),getCrmDistributors()]).then(([member,team])=>{setMembership(member);setDistributors(team);setLoading(false)}).catch(()=>setLoading(false))},[session?.user.id])

  const matchedDistributor=useMemo(()=>{
    const byId=distributors.find(item=>item.id===membership?.distributor_id)
    if(byId)return byId
    const email=session?.user.email?.trim().toLowerCase()
    const byEmail=email?distributors.find(item=>item.login_email?.trim().toLowerCase()===email):null
    if(byEmail)return byEmail
    if(membership?.role==='admin')return distributors.find(item=>item.slug==='mehdi-cohen'&&item.active)||distributors.find(item=>item.active)||null
    return null
  },[distributors,membership,session?.user.email])
  useEffect(()=>{
    if(!selectedDistributorId&&matchedDistributor)setSelectedDistributorId(matchedDistributor.id)
  },[matchedDistributor,selectedDistributorId])
  const distributor=useMemo(()=>distributors.find(item=>item.id===selectedDistributorId)||matchedDistributor,[distributors,matchedDistributor,selectedDistributorId])
  const page=PAGES.find(item=>item.id===selected)||PAGES[0]
  const url=distributor?`${window.location.origin}/d/${distributor.slug}${page.path}`:''
  const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=720x720&data=${encodeURIComponent(url)}`

  const copy=async()=>{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1300)}
  const share=async()=>{if(navigator.share)await navigator.share({title:`${distributor?.display_name} · ${page.label}`,text:page.description,url});else await copy()}

  if(!crmConfigured)return <Message title="Share Center connection required" body="The secure distributor connection is unavailable in this preview."/>
  if(loading)return <main className="min-h-screen bg-black"/>
  if(!session)return <Message title="Distributor sign-in required" body="Sign in to choose and share your personalized True Legacy pages." action={<Link to="/crm" className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Sign in</Link>}/>
  if(!membership?.active||!distributor)return <Message title="Distributor profile required" body="This distributor login has not been connected to an active profile yet. Please ask a True Legacy administrator to link it."/>

  return <main className="min-h-screen bg-black px-4 pb-28 pt-[max(22px,env(safe-area-inset-top))] text-white sm:px-6"><SEO title="True Legacy Share Center" description="Choose and share personalized distributor landing pages." noIndex/><div className="mx-auto max-w-6xl">
    <header className="flex items-center gap-4"><Link to="/app" aria-label="Back to app home" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.04]"><ArrowLeft/></Link><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#2997ff]">Duplication tools</p><h1 className="text-2xl font-black">Share Center</h1></div></header>

    <section className="mt-7 grid gap-5 rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-400/[.1] to-blue-500/[.04] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7"><img src={distributor.avatar_url||'/icons/icon-192.png'} alt={distributor.display_name} className="h-24 w-24 rounded-3xl border border-white/15 bg-black object-cover object-top"/><div><p className="text-sm text-[#2997ff]">Sharing as</p>{membership.role==='admin'?<select aria-label="Choose distributor profile" value={distributor.id} onChange={event=>{setSelectedDistributorId(event.target.value);setShowQr(false)}} className="mt-2 w-full max-w-sm rounded-xl border border-white/15 bg-black px-4 py-3 text-lg font-black text-white"><option value={matchedDistributor?.id||''}>{matchedDistributor?.display_name}</option>{distributors.filter(item=>item.active&&item.id!==matchedDistributor?.id).map(item=><option key={item.id} value={item.id}>{item.display_name}</option>)}</select>:<h2 className="mt-1 text-3xl font-black">{distributor.display_name}</h2>}<p className="mt-2 text-sm text-[#cccccc]">Every page keeps your referral attribution and contact details.</p></div><a href={`/d/${distributor.slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 font-bold">View profile <ExternalLink className="h-4 w-4"/></a></section>

    <section className="mt-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">1 · Choose what to share</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{PAGES.map(item=>{const Icon=item.icon;const active=item.id===selected;return <button key={item.id} onClick={()=>{setSelected(item.id);setShowQr(false)}} className={`share-choice ${active?'is-active':''}`}><span><Icon/></span><strong>{item.label}</strong><small>{item.description}</small>{active&&<Check className="share-choice__check"/>}</button>})}</div></section>

    <section className="mt-8 overflow-hidden rounded-[28px] border border-white/20 bg-white/[.035]"><div className="p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#2997ff]">2 · Share {page.label}</p><h2 className="mt-2 text-2xl font-black">Ready for your next conversation</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#cccccc]">{page.description} The lead remains connected to {distributor.display_name} inside the True Legacy system.</p><p className="mt-5 break-all rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-[#2997ff]">{url}</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><button onClick={share} className="share-primary"><Share2/>Share now</button><button onClick={copy} className="share-secondary"><Copy/>{copied?'Copied':'Copy'}</button><button onClick={()=>setShowQr(value=>!value)} className="share-secondary"><QrCode/>QR code</button><a href={url} target="_blank" rel="noreferrer" className="share-secondary"><ExternalLink/>Preview</a></div></div>
      {showQr&&<div className="grid gap-6 border-t border-white/10 bg-black/20 p-5 sm:grid-cols-[220px_1fr] sm:items-center sm:p-7"><div className="rounded-2xl bg-white p-3"><img src={qrUrl} alt={`${page.label} QR code`} className="w-full"/></div><div><h3 className="text-xl font-black">Scan to open {page.label}</h3><p className="mt-2 text-sm leading-6 text-[#cccccc]">Use this QR code at presentations, events, or in printed materials. It opens your selected personalized page.</p><a href={qrUrl} download={`${distributor.slug}-${page.id}-qr.png`} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-cyan-400 px-5 font-black text-slate-950">Download QR</a></div></div>}
    </section>
  </div></main>
}

function Message({title,body,action}:{title:string;body:string;action?:React.ReactNode}){return <main className="flex min-h-screen items-center justify-center bg-black p-5 text-white"><div className="max-w-md text-center"><Sparkles className="mx-auto h-10 w-10 text-[#2997ff]"/><h1 className="mt-5 text-3xl font-black">{title}</h1><p className="mt-4 text-[#cccccc]">{body}</p>{action&&<div className="mt-7">{action}</div>}</div></main>}
