import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle, Eye, EyeOff, Loader2, Lock, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const { locale } = useLocaleContext()

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEs = locale === 'es'
  const isFr = locale === 'fr'

  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as { from?: { pathname?: string } })?.from
      navigate(from?.pathname ?? '/training', { replace: true })
    }
  }, [user, loading, navigate, location.state])

  const getFriendlyError = (msg: string) => {
    const m = msg.toLowerCase()
    if (m.includes('invalid login credentials'))
      return isEs ? 'Correo o contraseña incorrectos.' : 'Incorrect email or password.'
    if (m.includes('already registered'))
      return isEs
        ? 'Este correo ya está registrado. Intenta iniciar sesión.'
        : 'Email already registered. Try signing in.'
    if (m.includes('password should be'))
      return isEs
        ? 'La contraseña debe tener al menos 6 caracteres.'
        : 'Password must be at least 6 characters.'
    return isEs ? 'Ocurrió un error. Inténtalo de nuevo.' : msg
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setAuthError('')
    setAuthSuccess('')
    setIsSubmitting(true)

    if (!isSupabaseConfigured) {
      setAuthError(
        isEs
          ? 'El inicio de sesión está temporalmente deshabilitado. Contacta a tu líder True Legacy.'
          : 'Login is temporarily unavailable. Contact your True Legacy leader.',
      )
      setIsSubmitting(false)
      return
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      setAuthError(isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.')
      setIsSubmitting(false)
      return
    }

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setAuthError(getFriendlyError(error.message))
        } else {
          setAuthSuccess(
            isEs
              ? '¡Cuenta creada! Revisa tu correo para confirmar.'
              : 'Account created! Check your email to confirm.',
          )
          setAuthMode('login')
          setPassword('')
          setConfirmPassword('')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setAuthError(getFriendlyError(error.message))
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message.toLowerCase() : ''
      if (msg.includes('failed to fetch') || msg.includes('networkerror')) {
        setAuthError(
          isEs
            ? 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
            : 'Connection failed. Check your internet and try again.',
        )
      } else {
        setAuthError(isEs ? 'Ocurrió un error inesperado.' : 'An unexpected error occurred.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center" style={{ background: '#060b1e' }}>
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Member Login — True Legacy World"
        description="Sign in to access the True Legacy Leadership Academy training portal."
      />
      <div
        className="relative flex min-h-dvh flex-col overflow-hidden"
        style={{ background: '#060b1e' }}
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-indigo-800/10 rounded-full blur-[100px]" />
        </div>

        <Navbar />

        <div className="relative flex flex-1 items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-4 mx-auto">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isEs ? 'Área de Miembros' : isFr ? 'Espace Membres' : 'Member Area'}
              </h1>
              <p className="text-slate-400 text-sm">
                {isEs
                  ? 'Accede a la academia de liderazgo True Legacy'
                  : isFr
                    ? "Accédez à l'académie de leadership True Legacy"
                    : 'Access the True Legacy leadership academy'}
              </p>
            </motion.div>

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            >
              {/* Toggle */}
              <div className="flex bg-black/30 p-1 rounded-xl mb-6 border border-white/10">
                {(['login', 'signup'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setAuthMode(mode); setAuthError(''); setAuthSuccess('') }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      authMode === mode
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'login'
                      ? (isEs ? 'Iniciar sesión' : isFr ? 'Se connecter' : 'Sign in')
                      : (isEs ? 'Crear cuenta' : isFr ? 'Créer un compte' : 'Create account')}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isEs ? 'Correo electrónico' : isFr ? 'Adresse e-mail' : 'Email address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEs ? 'tu@correo.com' : 'you@email.com'}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isEs ? 'Contraseña' : isFr ? 'Mot de passe' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isEs ? 'Mínimo 6 caracteres' : isFr ? 'Min. 6 caractères' : 'Min. 6 characters'}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      required
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password (signup) */}
                <AnimatePresence>
                  {authMode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        {isEs ? 'Confirmar contraseña' : isFr ? 'Confirmer le mot de passe' : 'Confirm password'}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={isEs ? 'Repite tu contraseña' : isFr ? 'Répétez le mot de passe' : 'Repeat your password'}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        required
                        autoComplete="new-password"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Feedback */}
                <AnimatePresence mode="wait">
                  {authError && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{authError}</p>
                    </motion.div>
                  )}
                  {authSuccess && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2.5 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-green-300 text-sm">{authSuccess}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEs ? 'Procesando…' : isFr ? 'Traitement…' : 'Processing…'}
                    </>
                  ) : (
                    <>
                      {authMode === 'login'
                        ? (isEs ? 'Iniciar sesión' : isFr ? 'Se connecter' : 'Sign in')
                        : (isEs ? 'Crear mi cuenta' : isFr ? 'Créer mon compte' : 'Create my account')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-6 space-y-2"
            >
              <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs">
                <Lock className="w-3 h-3" />
                <span>
                  {isEs
                    ? 'Conexión cifrada y segura'
                    : isFr
                      ? 'Connexion sécurisée et chiffrée'
                      : 'Secure encrypted connection'}
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                {isEs ? '¿Problemas?' : isFr ? 'Des problèmes ?' : 'Need help?'}{' '}
                <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  {isEs ? 'Volver al inicio' : isFr ? "Retour à l'accueil" : 'Return to home'}
                </Link>
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  )
}
