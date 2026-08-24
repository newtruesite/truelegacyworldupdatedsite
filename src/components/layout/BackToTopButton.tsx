import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function BackToTopButton() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const hiddenOnPrivateApp =
    pathname === '/app' ||
    pathname.startsWith('/app/') ||
    pathname === '/crm' ||
    pathname.startsWith('/crm/') ||
    pathname.startsWith('/training') ||
    pathname.includes('/training')

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 560)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [pathname])

  if (hiddenOnPrivateApp) return null

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
      className={`fixed bottom-24 right-4 z-[70] grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/90 text-[#2997ff] shadow-[0_12px_32px_rgba(0,0,0,.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05091a] sm:bottom-24 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
