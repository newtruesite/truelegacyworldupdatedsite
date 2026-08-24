import { BarChart3, BookOpen, CalendarCheck2, Home, LayoutDashboard, Share2, Users } from 'lucide-react'
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
  const appRoute = pathname.startsWith('/app') || pathname === '/crm' || pathname.startsWith('/crm/') || pathname.includes('/training')
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

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
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY.current + 12) {
        // Scrolling downward -> smoothly hide
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current - 12) {
        // Scrolling upward -> smoothly reveal
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [appRoute])

  if (!appRoute) return null

  return (
    <nav
      className={`tl-app-nav transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0 pointer-events-none'
      }`}
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
  )
}

