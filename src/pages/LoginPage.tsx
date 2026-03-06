import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/AuroraBackground'

declare global {
  interface Window {
    netlifyIdentity?: {
      open: (action?: 'login' | 'signup' | 'recovery') => void
      on: (event: string, cb: (user: unknown) => void) => void
    }
  }
}

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const identity = window.netlifyIdentity
    if (!identity) return
    identity.on('login', () => {
      navigate('/training', { replace: true })
    })
  }, [navigate])

  const openLogin = () => window.netlifyIdentity?.open('login')
  const openSignup = () => window.netlifyIdentity?.open('signup')
  const openRecovery = () => window.netlifyIdentity?.open('recovery')

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060b1e' }}>
      <AuroraBackground className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex justify-center mb-8">
            <img
              src="/logos/tl-horizontal-white.png"
              alt="True Legacy World"
              className="h-12 w-auto object-contain"
              loading="eager"
            />
          </Link>
          <div className="glass rounded-3xl border border-white/10 p-8 shadow-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              Member Login
            </h1>
            <p className="text-slate-400 text-center text-sm mb-8">
              Access your training materials and team resources
            </p>

            <button
              type="button"
              onClick={openLogin}
              className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white py-3 px-4 mb-4 transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={openSignup}
              className="w-full min-h-[48px] rounded-2xl border border-white/20 text-white font-semibold py-3 px-4 mb-4 transition-all hover:bg-white/5"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={openLogin}
              className="w-full min-h-[48px] rounded-2xl border border-white/15 bg-white/5 font-semibold text-white py-3 px-4 mb-4 flex items-center justify-center gap-3 transition-all hover:bg-white/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={openRecovery}
              className="w-full text-sm text-slate-400 hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">
            Enable Google in Netlify Dashboard → Identity → External Providers to use Google sign-in.
          </p>
        </motion.div>
      </AuroraBackground>
    </div>
  )
}
