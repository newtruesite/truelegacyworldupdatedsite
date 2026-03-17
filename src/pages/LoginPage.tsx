import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { getPendingPdf } from '@/lib/openGatedPdf'
import { Navbar } from '@/components/layout/Navbar'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const redirectPdf = params.get('pdf')
    if (redirectPdf && params.get('redirect') === 'pdf') {
      try {
        sessionStorage.setItem('pending_pdf', redirectPdf)
      } catch {
        /* ignore */
      }
    }
    if (!window.netlifyIdentity) return
    const identity = window.netlifyIdentity

    const handleLogin = () => {
      identity.close?.()
      const pendingPdf = getPendingPdf()
      if (pendingPdf) {
        window.open(pendingPdf, '_blank')
      }
      const from = (location.state as { from?: Location })?.from
      if (from && typeof from === 'object' && 'pathname' in from && !pendingPdf) {
        navigate(from as never, { replace: true })
      } else {
        navigate('/training', { replace: true })
      }
    }

    identity.on('login', handleLogin)

    return () => {
      identity.off?.('login', handleLogin)
    }
  }, [navigate, location.state])

  const handleOpen = (action: 'login' | 'signup') => {
    if (typeof window === 'undefined' || !window.netlifyIdentity) return
    window.netlifyIdentity.open(action)
  }

  return (
    <div className="flex flex-col px-4" style={{ background: '#060b1e', minHeight: '100dvh' }}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-8">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#050b18]/95 px-6 py-8 shadow-2xl">
        <h1 className="text-xl font-semibold text-white mb-2 text-center">Member Login</h1>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Sign in with your True Legacy member email to access the full training portal.
        </p>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOpen('login')}
            className="w-full inline-flex items-center justify-center rounded-xl bg-white text-slate-900 px-4 py-3 text-sm font-semibold shadow-lg hover:bg-slate-100 transition-colors"
          >
            Continue with Email / Google
          </button>
          <button
            type="button"
            onClick={() => handleOpen('signup')}
            className="w-full inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5 transition-colors"
          >
            Create a New Member Account
          </button>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Having trouble? Contact your True Legacy leader or{' '}
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            return to the main site
          </Link>
          .
        </p>
      </div>
      </div>
    </div>
  )
}
