import {
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
import { NavLink, useLocation } from 'react-router-dom'
import { crmSupabase, getCrmMembership } from '@/lib/crm'
import { useLocaleContext } from '@/contexts/LocaleContext'

const ITEMS = [
  { to: '/app', label: 'home', icon: Home, exact: true },
  { to: '/app/today', label: 'today', icon: CalendarCheck2 },
  { to: '/crm', label: 'contacts', icon: LayoutDashboard, exact: true },
  { to: '/training', label: 'academy', icon: BookOpen },
  { to: '/app/share', label: 'share', icon: Share2 },
  { to: '/app/bookings', label: 'bookings', icon: CalendarCheck2 },
  { to: '/app/library', label: 'library', icon: BookOpen },
  { to: '/crm/growth', label: 'team', icon: Users, adminOnly: true },
  { to: '/crm/platform', label: 'analytics', icon: BarChart3, adminOnly: true },
  { to: '/app/settings', label: 'settings', icon: Settings },
]

const NAV_COPY = {
  en: { home:'Home', today:'Today', contacts:'Contacts', academy:'Academy', share:'Share', bookings:'Bookings', library:'Library', team:'Team', analytics:'Analytics', settings:'Settings', navigation:'Navigation', expand:'Expand app navigation', hide:'Hide', hideLabel:'Hide navigation bar', aria:'True Legacy app navigation' },
  es: { home:'Inicio', today:'Hoy', contacts:'Contactos', academy:'Academia', share:'Compartir', bookings:'Reservas', library:'Biblioteca', team:'Equipo', analytics:'Analíticas', settings:'Configuración', navigation:'Navegación', expand:'Expandir la navegación', hide:'Ocultar', hideLabel:'Ocultar la barra de navegación', aria:'Navegación de la aplicación True Legacy' },
  fr: { home:'Accueil', today:'Aujourd’hui', contacts:'Contacts', academy:'Académie', share:'Partager', bookings:'Réservations', library:'Bibliothèque', team:'Équipe', analytics:'Analyses', settings:'Paramètres', navigation:'Navigation', expand:'Développer la navigation', hide:'Masquer', hideLabel:'Masquer la barre de navigation', aria:"Navigation de l’application True Legacy" },
  pt: { home:'Início', today:'Hoje', contacts:'Contatos', academy:'Academia', share:'Compartilhar', bookings:'Reservas', library:'Biblioteca', team:'Equipe', analytics:'Análises', settings:'Configurações', navigation:'Navegação', expand:'Expandir navegação', hide:'Ocultar', hideLabel:'Ocultar barra de navegação', aria:'Navegação do aplicativo True Legacy' },
} as const

export function AppNavigation() {
  const { locale } = useLocaleContext()
  const copy = NAV_COPY[locale]
  const { pathname } = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [authUserId, setAuthUserId] = useState<string | null>(null)
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
    // Auth callbacks run under the session lock; do database reads in a separate effect.
    crmSupabase.auth.getSession().then(({ data }) => {
      setAuthUserId(data.session?.user.id ?? null)
    }).catch(() => setAuthUserId(null))
    const { data } = crmSupabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserId(session?.user.id ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let current = true
    setIsAdmin(false)
    if (authUserId) {
      getCrmMembership(authUserId).then(member => {
        if (current) setIsAdmin(Boolean(member?.active && member.role === 'admin'))
      }).catch(() => { if (current) setIsAdmin(false) })
    }
    return () => { current = false }
  }, [authUserId])

  useEffect(() => {
    document.body.classList.toggle('tl-app-route', appRoute)
    return () => document.body.classList.remove('tl-app-route')
  }, [appRoute])

  if (!appRoute) return null

  return (
    <>
      {isCollapsed ? (
        <div className="fixed z-[9400] right-4 sm:right-8 bottom-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => handleSetCollapsed(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-cyan-400/50 bg-[#05091a]/95 text-white shadow-2xl backdrop-blur-xl hover:border-cyan-400 hover:bg-[#0d1d46] transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            title={copy.expand}
            aria-label={copy.expand}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
              {copy.navigation}
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="fixed z-[9400] left-1/2 -translate-x-1/2 bottom-[max(10px,env(safe-area-inset-bottom))] w-[min(960px,calc(100vw-20px))] pointer-events-none">
          {/* External Hide Bubble floating cleanly above the left side of the nav bar */}
          <div className="flex justify-start pl-3 pb-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => handleSetCollapsed(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-[#05091a]/95 hover:bg-[#0d1d46] hover:border-cyan-400/60 text-[11px] font-bold text-slate-200 hover:text-cyan-300 transition-all shadow-2xl backdrop-blur-xl cursor-pointer"
              title={copy.hideLabel}
              aria-label={copy.hideLabel}
            >
              <span>{copy.hide}</span>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>
          </div>

          <nav className="tl-app-nav pointer-events-auto" aria-label={copy.aria}>
            {ITEMS.filter(item => !item.adminOnly || isAdmin).map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                <Icon aria-hidden="true" />
                <span>{copy[label as keyof typeof copy]}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
