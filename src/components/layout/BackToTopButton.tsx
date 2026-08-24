import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function BackToTopButton() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 400)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [pathname])

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
      className={`fixed bottom-20 sm:bottom-20 right-4 sm:right-8 z-[9300] grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full border border-cyan-400/40 bg-[#05091a]/95 text-cyan-400 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:bg-cyan-400 hover:text-slate-950 hover:border-cyan-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
    </button>
  )
}
