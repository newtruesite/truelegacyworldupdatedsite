import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CalendarCheck2,
  ChevronDown,
  ChevronUp,
  Home,
  LayoutDashboard,
  Share2,
  Settings,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { crmSupabase, getCrmMembership } from '@/lib/crm'

const ITEMS = [
  { to: '/app', label: 'Home', icon: Home, exact: true },
  { to: '/app/today', label: 'Today', icon: CalendarCheck2 },
  { to: '/crm', label: 'Contacts', icon: LayoutDashboard, exact: true },
  { to: '/training', label: 'Academy', icon: BookOpen },
  { to: '/app/share', label: 'Share', icon: Share2 },
  { to: '/app/bookings', label: 'Bookings', icon: CalendarCheck2 },
  { to: '/app/library', label: 'Library', icon: BookOpen },
  { to: '/crm/growth', label: 'Team', icon: Users, adminOnly: true },
  { to: '/crm/platform', label: 'Analytics', icon: BarChart3, adminOnly: true },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function AppNavigation() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const isDistributorPage = pathname.startsWith('/d/')
  const appRoute =
    !isDistributorPage &&
    (pathname.startsWith('/app') ||
      pathname === '/crm' ||
      pathname.startsWith('/crm/') ||
      pathname === '/training')

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('tl_app_nav_collapsed') === 'true'
  })

  const handleSetCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    try {
      localStorage.setItem('tl_app_nav_collapsed', String(collapsed))
    } catch {
      // ignore storage errors
    }
  }

  useEffect(() => {
    if (!crmSupabase) return
    crmSupabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user?.id) {
        const member = await getCrmMembership(data.session.user.id)
        setIsAdmin(member?.role === 'admin')
      }
    })
    const { data } = crmSupabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.id) {
        const member = await getCrmMembership(session.user.id)
        setIsAdmin(member?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('tl-app-route', appRoute)
    return () => document.body.classList.remove('tl-app-route')
  }, [appRoute])

  if (!appRoute) return null

  const isDeepAppRoute = appRoute && pathname !== '/app'

  return (
    <>
      {/* Universal App Back Button for sub-routes */}
      {isDeepAppRoute && (
        <div className="fixed top-3 sm:top-4 left-3 sm:left-4 z-[9200]">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1)
              } else {
                navigate('/app')
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#05091a]/90 hover:bg-[#0d1d46] hover:border-cyan-400/50 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white shadow-xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back</span>
          </button>
        </div>
      )}

      {isCollapsed ? (
        <div className="fixed z-[9400] right-4 sm:right-8 bottom-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => handleSetCollapsed(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-cyan-400/50 bg-[#05091a]/95 text-white shadow-2xl backdrop-blur-xl hover:border-cyan-400 hover:bg-[#0d1d46] transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            title="Expand app navigation"
            aria-label="Expand app navigation"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
              Navigation
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="fixed z-[9400] left-1/2 -translate-x-1/2 bottom-[max(10px,env(safe-area-inset-bottom))] w-[min(960px,calc(100vw-20px))] pointer-events-none">
          {/* External Hide Bubble floating above the nav bar */}
          <div className="flex justify-end pr-2 pb-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => handleSetCollapsed(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-[#05091a]/95 hover:bg-[#0d1d46] hover:border-cyan-400/60 text-[11px] font-bold text-slate-200 hover:text-cyan-300 transition-all shadow-2xl backdrop-blur-xl cursor-pointer"
              title="Hide navigation bar"
              aria-label="Hide navigation bar"
            >
              <span>Hide</span>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>
          </div>

          <nav className="tl-app-nav pointer-events-auto" aria-label="True Legacy app navigation">
            {ITEMS.filter(item => !item.adminOnly || isAdmin).map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
