import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  ChevronDown,
  ChevronUp,
  Home,
  LayoutDashboard,
  Share2,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const ITEMS = [
  { to: '/app', label: 'Home', icon: Home, exact: true },
  { to: '/app/today', label: 'Today', icon: CalendarCheck2 },
  { to: '/crm', label: 'Contacts', icon: LayoutDashboard, exact: true },
  { to: '/app/share', label: 'Share', icon: Share2 },
  { to: '/app/bookings', label: 'Bookings', icon: CalendarCheck2 },
  { to: '/app/library', label: 'Library', icon: BookOpen },
  { to: '/training', label: 'Academy', icon: BookOpen },
  { to: '/crm/growth', label: 'Team', icon: Users },
  { to: '/crm/platform', label: 'Analytics', icon: BarChart3 },
]

export function AppNavigation() {
  const { pathname } = useLocation()
  const appRoute =
    pathname.startsWith('/app') ||
    pathname === '/crm' ||
    pathname.startsWith('/crm/') ||
    pathname.includes('/training')

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('tl_app_nav_collapsed') === 'true'
  })

  const [isScrollVisible, setIsScrollVisible] = useState(true)
  const lastScrollY = useRef(0)

  const handleSetCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    try {
      localStorage.setItem('tl_app_nav_collapsed', String(collapsed))
    } catch {
      // ignore storage errors
    }
  }

  useEffect(() => {
    document.body.classList.toggle('tl-app-route', appRoute)
    return () => document.body.classList.remove('tl-app-route')
  }, [appRoute])

  useEffect(() => {
    if (!appRoute) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const maxScroll = docHeight - winHeight

      // Near top (< 60px) or near bottom (> maxScroll - 80px) -> always visible
      if (currentScrollY < 60 || currentScrollY >= maxScroll - 80) {
        setIsScrollVisible(true)
      } else if (currentScrollY > lastScrollY.current + 12) {
        // Scrolling downward -> smoothly hide
        setIsScrollVisible(false)
      } else if (currentScrollY < lastScrollY.current - 12) {
        // Scrolling upward -> smoothly reveal
        setIsScrollVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [appRoute])

  if (!appRoute) return null

  return (
    <div
      className={`fixed z-[9400] left-1/2 -translate-x-1/2 bottom-[max(10px,env(safe-area-inset-bottom))] transition-all duration-300 ease-out ${
        isScrollVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-28 opacity-0 pointer-events-none'
      }`}
    >
      {isCollapsed ? (
        /* Collapsed Floating Pill */
        <button
          type="button"
          onClick={() => handleSetCollapsed(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/40 bg-[#070e24]/95 text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl hover:border-cyan-400 hover:bg-[#0d1d46] transition-all hover:scale-105 active:scale-95 group cursor-pointer"
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
      ) : (
        /* Expanded Full Navigation Bar with Top Collapse Handle */
        <div className="relative group/nav">
          <button
            type="button"
            onClick={() => handleSetCollapsed(true)}
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-0.5 rounded-full border border-white/20 bg-[#070e24] hover:bg-[#0f214f] hover:border-cyan-400/60 text-[10px] font-extrabold text-slate-300 hover:text-cyan-300 transition-all shadow-lg cursor-pointer"
            title="Collapse navigation"
            aria-label="Collapse navigation"
          >
            <span>Hide</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          <nav
            className="tl-app-nav !position-static !transform-none !bottom-auto !left-auto"
            aria-label="True Legacy app navigation"
          >
            {ITEMS.map(({ to, label, icon: Icon, exact }) => (
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
    </div>
  )
}


