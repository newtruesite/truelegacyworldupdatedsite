import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type SignupForm = z.infer<typeof signupSchema>
type LoginForm = z.infer<typeof loginSchema>

const BENEFITS = [
    'Exclusive weekly live training calls with global leaders',
    'Step-by-step video modules on building your True Legacy business',
    'Private community of top earners and health advocates',
    'Marketing assets, scripts, and tools — ready to deploy',
    `Access to Mehdi Cohen's personal mentorship content`,

]

export default function TrainingPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('signup')
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })
    const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

    const onSignup = (_data: SignupForm) => setSubmitted(true)
    const onLogin = (_data: LoginForm) => setSubmitted(true)

    return (
        <div className="min-h-screen">
            <Navbar />

            <AuroraBackground className="min-h-screen pt-28 pb-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
                        {/* Left — Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block mb-4 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-400">
                                🔐 Leadership Portal
                            </span>
                            <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
                                Access Your
                                <br />
                                <span className="gradient-text">Leadership Training</span>
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                The True Legacy training portal is where transformations accelerate. Sign in to access exclusive content built for serious legacy builders.
                            </p>

                            <ul className="space-y-4">
                                {BENEFITS.map((benefit, i) => (
                                    <motion.li
                                        key={benefit}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-cyan-400 mt-0.5" />
                                        <span className="text-sm text-slate-300">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Right — Auth Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {submitted ? (
                                <div className="glass rounded-3xl border border-white/10 p-10 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <div className="text-7xl mb-4">🎉</div>
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-white mb-3">Welcome to the Inner Circle!</h2>
                                    <p className="text-slate-400 mb-6">
                                        Your access is being activated. Check your email for login instructions and your first training module.
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        (Note: Real authentication coming soon. This is a UI preview.)
                                    </p>
                                </div>
                            ) : (
                                <div className="glass rounded-3xl border border-white/10 p-8">
                                    {/* Tab Toggle */}
                                    <div className="mb-8 flex rounded-2xl bg-white/5 p-1">
                                        {(['signup', 'login'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setMode(tab)}
                                                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${mode === tab
                                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                                    : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {tab === 'signup' ? 'Create Account' : 'Sign In'}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Google Auth Button */}
                                    <button className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/25">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </button>

                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="bg-transparent px-3 text-slate-500">or continue with email</span>
                                        </div>
                                    </div>

                                    {/* Signup Form */}
                                    {mode === 'signup' && (
                                        <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                                            <div>
                                                <input
                                                    {...signupForm.register('name')}
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                                                />
                                                {signupForm.formState.errors.name && (
                                                    <p className="mt-1 text-xs text-red-400">{signupForm.formState.errors.name.message}</p>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                                                <input
                                                    {...signupForm.register('email')}
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                                                />
                                                {signupForm.formState.errors.email && (
                                                    <p className="mt-1 text-xs text-red-400">{signupForm.formState.errors.email.message}</p>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                                                <input
                                                    {...signupForm.register('password')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Password (min. 8 characters)"
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-3.5 text-slate-500 hover:text-white"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                                {signupForm.formState.errors.password && (
                                                    <p className="mt-1 text-xs text-red-400">{signupForm.formState.errors.password.message}</p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-cyan-500/30"
                                            >
                                                Unlock Your Training Access
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </form>
                                    )}

                                    {/* Login Form */}
                                    {mode === 'login' && (
                                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                                                <input
                                                    {...loginForm.register('email')}
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                                                />
                                                {loginForm.formState.errors.email && (
                                                    <p className="mt-1 text-xs text-red-400">{loginForm.formState.errors.email.message}</p>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                                                <input
                                                    {...loginForm.register('password')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Password"
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-3.5 text-slate-500 hover:text-white"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <button
                                                type="submit"
                                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-cyan-500/30"
                                            >
                                                Access My Training
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </form>
                                    )}

                                    <p className="mt-6 text-center text-xs text-slate-600">
                                        By continuing you agree to True Legacy World's Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </AuroraBackground>

            <Footer />
        </div>
    )
}
