import { BookOpen, Home, LayoutDashboard, Menu, Share2 } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const ITEMS = [
  { to: '/app', label: 'Home', icon: Home, exact: true },
  { to: '/crm', label: 'Leads', icon: LayoutDashboard, exact: true },
  { to: '/app/share', label: 'Share', icon: Share2 },
  { to: '/app/library', label: 'Learn', icon: BookOpen },
  { to: '/crm/platform', label: 'More', icon: Menu },
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
