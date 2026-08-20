import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'

const STEPS = [
    {
        number: '01',
        title: 'Experience the Products',
        description:
            'Start by transforming your own health with Kangen water and emGuarde technology. Become a living testimony of what True Legacy represents.',
        detail: 'Receive your Kangen machine → Drink alkaline water daily → Feel the difference in 30 days.',
        color: 'from-blue-600 to-blue-400',
        glow: 'shadow-blue-500/20',
    },
    {
        number: '02',
        title: 'Connect with Your Sponsor',
        description:
            'Your upline mentor guides you through onboarding, training, and your first conversations. You are never building alone in True Legacy.',
        detail: 'Join your team WhatsApp → Attend weekly calls → Get your personal link.',
        color: 'from-cyan-600 to-cyan-400',
        glow: 'shadow-cyan-500/20',
    },
    {
        number: '03',
        title: 'Share the Vision',
        description:
            'Use our proven VSL funnels, this global website, and your personal story to introduce others to True Legacy. No hard selling — just real conversations.',
        detail: 'Share your country link → Let the VSL do the work → Follow up with your sponsor.',
        color: 'from-green-600 to-green-400',
        glow: 'shadow-green-500/20',
    },
    {
        number: '04',
        title: 'Grow Your Global Team',
        description:
            'As your referrals join and purchase, you earn commission on 8 tiers of the compensation plan. Build across multiple countries simultaneously.',
        detail: '8-tier commission structure → Global team bonuses → Monthly leader rewards.',
        color: 'from-purple-600 to-purple-400',
        glow: 'shadow-purple-500/20',
    },
    {
        number: '05',
        title: 'Build Your Legacy',
        description:
            'Reach leadership ranks, attend global events in Morocco, USA, Colombia, and beyond — and create income streams that work while you sleep.',
        detail: 'Achieve Director rank → Attend world events → Build passive royalty income.',
        color: 'from-amber-600 to-amber-400',
        glow: 'shadow-amber-500/20',
    },
]

export function Timeline() {
    return (
        <section className="py-24" id="how-it-works">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block mb-3 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-400">
                        The Blueprint
                    </span>
                    <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                        Step-by-Step:{' '}
                        <span className="gradient-text">Build Your Legacy</span>
                    </h2>
                    <p className="mx-auto max-w-xl text-[#cccccc] text-lg">
                        There's no guessing, no hustling alone. Follow this proven path and watch your health, wealth, and freedom transform.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-500 to-amber-400 opacity-40 hidden sm:block" />

                    <div className="space-y-8">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                className="relative"
                            >
                                {/* Shine border wrapper */}
                                <div className="shine-border-wrapper rounded-2xl">
                                    <div className="glass rounded-2xl border border-white/10 p-6 sm:pl-20 transition-all duration-300 hover:border-white/20">
                                        {/* Number badge (positioned over left border line) */}
                                        <div
                                            className={`absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white text-sm font-bold shadow-lg ${step.glow}`}
                                        >
                                            {step.number}
                                        </div>

                                        {/* Mobile number */}
                                        <div
                                            className={`mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white text-xs font-bold sm:hidden`}
                                        >
                                            {step.number}
                                        </div>

                                        <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                                        <p className="mb-3 text-sm text-[#cccccc] leading-relaxed">{step.description}</p>
                                        <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                                            {step.detail.split('→').map((d, di) => (
                                                <span key={di} className="flex items-center gap-1">
                                                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#2997ff]" />
                                                    <span className="text-xs text-[#86868b]">{d.trim()}</span>
                                                    {di < step.detail.split('→').length - 1 && (
                                                        <ArrowRight className="h-3 w-3 text-[#86868b]" />
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <Link
                        to="/usa"
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 px-8 py-4 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30"
                    >
                        Start Building Your Legacy Today
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
