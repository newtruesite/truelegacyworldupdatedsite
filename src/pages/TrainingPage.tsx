import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, LogOut, Menu, Video } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

declare global {
  interface Window {
    netlifyIdentity?: {
      currentUser: () => { email: string } | null
      on: (event: string, cb: (user: unknown) => void) => void
      logout: () => void
      open?: (action?: 'login' | 'signup' | 'recovery') => void
    }
  }
}

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

export default function TrainingPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string } | null | undefined>(undefined)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModule, setActiveModule] = useState(MODULES[0].id)

  useEffect(() => {
    const identity = window.netlifyIdentity
    if (!identity) {
      setUser(null)
      return
    }
    const onInit = () => {
      setUser(identity.currentUser())
    }
    identity.on('init', onInit)
    onInit()
    identity.on('login', (u) => setUser(u as { email: string }))
    identity.on('logout', () => setUser(null))
    return () => {
      identity.on('init', () => {})
      identity.on('login', () => {})
      identity.on('logout', () => {})
    }
  }, [])

  useEffect(() => {
    if (user === null) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const handleLogout = () => {
    window.netlifyIdentity?.logout()
    navigate('/', { replace: true })
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b1e' }}>
        <div className="text-slate-400">Loading…</div>
      </div>
    )
  }

  if (user === null) {
    return null
  }

  const currentModule = MODULES.find((m) => m.id === activeModule)
  const lessons = TRAINING_LESSONS[activeModule] ?? []

  return (
    <div className="min-h-screen" style={{ background: '#060b1e' }}>
      <Navbar />
      <AuroraBackground className="pt-28 pb-16 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Leadership Training
            </h1>
            <button
              type="button"
              id="logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 min-h-[48px]"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
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
            </div>
          </div>
        </div>
      </AuroraBackground>
      <Footer />
    </div>
  )
}
