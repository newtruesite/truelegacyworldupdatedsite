import { BarChart3, BookOpen, CalendarCheck2, Home, LayoutDashboard, Share2, Users } from 'lucide-react'
import { useEffect } from 'react'
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
  useEffect(() => {
    document.body.classList.toggle('tl-app-route', appRoute)
    return () => document.body.classList.remove('tl-app-route')
  }, [appRoute])
  if (!appRoute) return null
  return <nav className="tl-app-nav" aria-label="True Legacy app navigation">{ITEMS.map(({ to, label, icon: Icon, exact }) => <NavLink key={to} to={to} end={exact} className={({ isActive }) => isActive ? 'is-active' : ''}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}</nav>
}
