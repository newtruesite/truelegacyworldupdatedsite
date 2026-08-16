import { SEO } from '@/components/SEO'
import { SAGA_COLLECTIONS, SAGA_FOLDERS, SAGA_LIBRARY_URL } from '@/data/sagaLibrary'
import type { SagaCollectionId, SagaFolder } from '@/data/sagaLibrary'
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, FolderOpen, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function SagaLibraryPage() {
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState<SagaCollectionId | 'all'>('all')
  const [selected, setSelected] = useState<SagaFolder | null>(null)

  useEffect(() => {
    if (!selected) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null) }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [selected])

  const visibleFolders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return SAGA_FOLDERS.filter(folder => {
      const matchesCollection = collection === 'all' || folder.collection === collection
      const searchable = `${folder.title} ${folder.description} ${folder.folders.join(' ')} ${folder.previews.join(' ')}`.toLowerCase()
      return matchesCollection && (!normalized || searchable.includes(normalized))
    })
  }, [collection, query])

  return <main className="min-h-screen bg-[#070615] px-4 pb-28 pt-6 text-white sm:px-6 lg:px-8">
    <SEO title="SAGA Library Catalog" description="An organized directory of the SAGA resource library." noIndex />
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center gap-4"><Link to="/app" aria-label="Back to distributor workspace" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.04]"><ArrowLeft /></Link><div><p className="text-xs font-bold uppercase tracking-[.22em] text-violet-300">Separate resource catalog</p><h1 className="text-2xl font-black">SAGA Library</h1></div></header>

      <section className="mt-7 overflow-hidden rounded-[30px] border border-violet-300/20 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,.24),transparent_38%),linear-gradient(145deg,rgba(76,29,149,.18),rgba(255,255,255,.025))] p-6 sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[.08] px-3 py-1.5 text-xs font-bold text-violet-200"><BookOpen className="h-3.5 w-3.5" /> SAGA catalog</span>
        <h2 className="mt-5 max-w-4xl text-3xl font-black sm:text-5xl">The complete library, organized for faster browsing.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Browse every captured SAGA section by category, search for a topic, and preview the materials inside before opening the source library.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"><a href={SAGA_LIBRARY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-300 px-5 font-black text-violet-950">Open the SAGA source library <ExternalLink className="h-4 w-4" /></a><p className="text-xs leading-5 text-slate-500">SAGA content remains attributed to and hosted by SAGA.</p></div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{SAGA_COLLECTIONS.map(item => <button key={item.id} onClick={() => setCollection(collection === item.id ? 'all' : item.id)} className={`rounded-2xl border p-4 text-left transition ${collection === item.id ? 'border-violet-300/50 bg-violet-300/15' : 'border-white/10 bg-white/[.035] hover:border-violet-300/30'}`}><p className="font-black">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.subtitle}</p></button>)}</section>

      <section className="mt-9"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">{visibleFolders.length} catalog sections</p><h2 className="mt-2 text-3xl font-black">Browse the SAGA library</h2></div><label className="relative block w-full sm:max-w-sm"><span className="sr-only">Search the SAGA library</span><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search resources, products, scripts…" className="h-12 w-full rounded-xl border border-white/10 bg-white/[.035] pl-11 pr-11 text-sm outline-none focus:border-violet-300/50" />{query ? <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500"><X className="h-4 w-4" /></button> : null}</label></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleFolders.map(folder => { const parent = SAGA_COLLECTIONS.find(item => item.id === folder.collection)!; const count = folder.folders.length + folder.previews.length; return <button key={folder.id} onClick={() => setSelected(folder)} className="group flex min-h-72 flex-col rounded-[24px] border border-white/10 bg-white/[.035] p-5 text-left transition hover:-translate-y-1 hover:border-violet-300/30"><div className="flex items-start justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-400/10 text-violet-300"><FolderOpen className="h-5 w-5" /></span><span className="rounded-full border border-violet-300/20 bg-violet-300/[.08] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-200">SAGA</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[.17em] text-slate-500">{parent.title}</p><h3 className="mt-2 text-xl font-black">{folder.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{folder.description}</p><div className="mt-5 flex flex-wrap gap-2">{[...folder.folders, ...folder.previews].slice(0, 3).map(topic => <span key={topic} className="rounded-lg bg-white/[.04] px-2.5 py-1 text-[10px] text-slate-400">{topic}</span>)}</div><div className="mt-auto flex items-center justify-between border-t border-white/[.07] pt-5"><span className="text-xs font-bold text-slate-500">{count} resources</span><span className="inline-flex items-center gap-2 text-sm font-black text-violet-200">Preview <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></button> })}</div>
        {visibleFolders.length === 0 ? <div className="mt-5 rounded-3xl border border-dashed border-white/15 p-12 text-center"><Search className="mx-auto h-8 w-8 text-slate-600" /><h3 className="mt-4 text-xl font-black">No matching resources</h3><button onClick={() => { setQuery(''); setCollection('all') }} className="mt-5 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold">Reset library</button></div> : null}
      </section>
    </div>

    {selected ? <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="saga-preview-title" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null) }}><section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#100d22] p-5 shadow-2xl sm:rounded-[28px] sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">SAGA catalog preview</p><h2 id="saga-preview-title" className="mt-2 text-2xl font-black sm:text-3xl">{selected.title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{selected.description}</p></div><button onClick={() => setSelected(null)} aria-label="Close preview" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.04]"><X className="h-5 w-5" /></button></div>
      {selected.folders.length ? <ResourceList title="Folders" items={selected.folders} /> : null}<ResourceList title="Materials" items={selected.previews} />
      <a href={SAGA_LIBRARY_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-300 px-5 font-black text-violet-950">Open in SAGA <ExternalLink className="h-4 w-4" /></a>
    </section></div> : null}
  </main>
}

function ResourceList({ title, items }: { title: string; items: string[] }) { return <div className="mt-7"><h3 className="text-sm font-black uppercase tracking-[.16em] text-violet-300">{title}</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{items.map(item => <div key={item} className="rounded-xl border border-white/[.07] bg-white/[.035] p-3 text-sm text-slate-300">{item}</div>)}</div></div> }
