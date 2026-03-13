import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Menu, Video, FileText, ExternalLink, Download } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const BENEFITS = [
  'Exclusive weekly live training calls with global leaders',
  'Step-by-step video modules on building your True Legacy business',
  'Private community of top earners and health advocates',
  'Marketing assets, scripts, and tools — ready to deploy',
  "Access to Mehdi Cohen's personal mentorship content",
]

const MODULES = [
  { id: '1', title: 'Welcome & Overview' },
  { id: '2', title: 'Building Your Foundation' },
  { id: '3', title: 'Product Knowledge' },
  { id: '4', title: 'Sales & Invitation' },
  { id: '5', title: 'Team Building' },
]

type LessonItem = { id: string; title: string; description?: string; youtubeId?: string; link?: string }
const TRAINING_LESSONS: Record<string, LessonItem[]> = {
  '1': [
    { id: '1-1', title: 'Lesson 1 — Welcome to True Legacy', description: 'Introduction to the training and what you\'ll learn.', youtubeId: undefined, link: undefined },
  ],
  '2': [
    { id: '2-1', title: 'Lesson 2 — Your Foundation', description: 'Core principles for building your business.', youtubeId: undefined, link: undefined },
  ],
  '3': [
    { id: '3-1', title: 'Lesson 3 — Product Knowledge', description: 'Deep dive into Kangen Water and emGuarde.', youtubeId: undefined, link: undefined },
  ],
  '4': [
    { id: '4-1', title: 'Lesson 4 — Sales & Invitation', description: 'How to invite and share with others.', youtubeId: undefined, link: undefined },
  ],
  '5': [
    { id: '5-1', title: 'Lesson 5 — Team Building', description: 'Growing your team and supporting leaders.', youtubeId: undefined, link: undefined },
  ],
}

const TRAINING_PDFS = [
  { category: 'products', title: 'Kangen Water Ionizers Guide', desc: 'Complete product guide for all Kangen Water machines. Essential reading for every distributor.', url: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf' },
  { category: 'products', title: 'Anespa DX Guide', desc: 'Full specifications and selling points for the Anespa DX shower system.', url: 'https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf' },
  { category: 'business', title: '8-Point Compensation Plan', desc: 'Understand exactly how you earn. The most important document for building your income.', url: 'https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf' },
  { category: 'products', title: 'Machine Care & Maintenance', desc: 'Keep your customers happy with proper machine care. Reduces returns, builds trust.', url: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf' },
  { category: 'products', title: 'Kangen Ukon Guide', desc: 'Complete guide to the Ukon Sigma turmeric product line.', url: 'https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf' },
  { category: 'products', title: 'Kangen Wagyu Guide', desc: 'Product guide for the premium Wagyu beef line.', url: 'https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf' },
]

export default function TrainingPage() {
  const navigate = useNavigate()
  const [isAuthed, setIsAuthed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModule, setActiveModule] = useState(MODULES[0].id)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const leadCaptured = localStorage.getItem('tl_pdf_access')
    if (leadCaptured) {
      setIsAuthed(true)
      return
    }
    const identity = window.netlifyIdentity
    if (!identity) {
      navigate('/login', { replace: true, state: { from: { pathname: '/training' } } })
      return
    }

    const checkUser = () => {
      const user = identity.currentUser()
      const leadCaptured = typeof localStorage !== 'undefined' && localStorage.getItem('tl_pdf_access')
      if (user || leadCaptured) {
        setIsAuthed(true)
      } else {
        navigate('/login', { replace: true, state: { from: { pathname: '/training' } } })
      }
    }

    const handleLogout = () => {
      setIsAuthed(false)
      navigate('/login', { replace: true })
    }

    identity.on('init', checkUser)
    identity.on('login', checkUser)
    identity.on('logout', handleLogout)

    // Trigger initial init if needed
    identity.init?.()
    checkUser()

    return () => {
      identity.off?.('init', checkUser)
      identity.off?.('login', checkUser)
      identity.off?.('logout', handleLogout)
    }
  }, [navigate])

  const currentModule = MODULES.find((m) => m.id === activeModule)
  const lessons = TRAINING_LESSONS[activeModule] ?? []

  if (!isAuthed) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#060b1e' }}>
      <Navbar />
      <main className="flex-grow">
        <AuroraBackground className="pt-24 pb-16 min-h-screen">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Top hero / category-style header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tl-gold mb-3">
                  True Legacy Academy
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display">
                  Leadership Training Portal
                </h1>
                <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl">
                  On-demand leadership and business training for True Legacy partners worldwide — organized into clear modules you can
                  work through at your own pace.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200">
                  Weekly calls
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200">
                  Playbooks & scripts
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200">
                  Global team systems
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar — collapse to dropdown on mobile */}
              <div className="lg:col-span-1">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex lg:hidden w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white font-medium mb-4"
                >
                  <span>Modules</span>
                  <Menu className="h-5 w-5" />
                </button>
                <nav
                  className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}
                  id="training-content"
                >
                  <ul className="space-y-1">
                    {MODULES.map((m) => (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModule(m.id)
                            setSidebarOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            activeModule === m.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {m.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Main content — content wall: video embed + description + links per lesson */}
              <div className="lg:col-span-3 space-y-8">
                <h2 className="text-xl font-bold text-white">{currentModule?.title}</h2>
                {lessons.length === 0 ? (
                  <div className="glass rounded-2xl border border-white/10 p-6 md:p-10">
                    <p className="text-slate-400">No lessons in this module yet. Check back soon.</p>
                  </div>
                ) : (
                  lessons.map((lesson) => (
                    <div key={lesson.id} className="glass rounded-2xl border border-white/10 p-6 md:p-10">
                      <h3 className="text-lg font-semibold text-white mb-2">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-slate-400 text-sm mb-6">{lesson.description}</p>
                      )}
                      {lesson.youtubeId ? (
                        <div className="aspect-video rounded-xl overflow-hidden bg-black/40 mb-6">
                          <iframe
                            title={lesson.title}
                            src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="aspect-video rounded-xl bg-black/40 flex items-center justify-center mb-6">
                          <div className="flex flex-col items-center gap-3 text-slate-500">
                            <Video className="h-12 w-12" />
                            <span>Video link TBD</span>
                            {lesson.link && (
                              <a href={lesson.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">
                                Open link
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {lesson.link && !lesson.youtubeId && (
                        <a href={lesson.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                          Watch or download →
                        </a>
                      )}
                    </div>
                  ))
                )}
                <div className="glass rounded-2xl border border-white/10 p-6 md:p-10">
                  <h3 className="text-lg font-semibold text-white mb-4">What you get</h3>
                  <ul className="space-y-3">
                    {BENEFITS.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-slate-300">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-cyan-400 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Training PDF Library */}
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-white mb-2">True Legacy Training Library</h2>
                  <p className="text-slate-400 text-sm mb-6">Everything you need to become the most effective True Legacy distributor. Click to open or download.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TRAINING_PDFS.map((pdf) => (
                      <div key={pdf.url} className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{pdf.title}</h3>
                            <p className="text-slate-400 text-sm mt-1">{pdf.desc}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/50 px-3 py-2 text-sm font-medium text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                            <ExternalLink className="h-4 w-4" /> Open PDF
                          </a>
                          <a href={pdf.url} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/20 px-3 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/30 transition-colors">
                            <Download className="h-4 w-4" /> Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AuroraBackground>
      </main>
      <Footer />
    </div>
  )
}
