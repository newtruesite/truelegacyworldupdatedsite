import { motion } from 'framer-motion'
import { ExternalLink, Quote } from 'lucide-react'

const TESTIMONIALS = [
    {
        handle: '@nigara.ismail',
        name: 'Nigara Ismail',
        instagram: 'https://instagram.com/nigara.ismail',
        quote:
            'True Legacy completely transformed my health and finances. Kangen water healed my gut after years of inflammation, and the business gave me true time freedom.',
        initials: 'NI',
        gradient: 'from-blue-500 to-cyan-400',
        role: 'Health & Wellness Leader',
    },
    {
        handle: '@ryanpool',
        name: 'Ryan Pool',
        instagram: 'https://instagram.com/ryanpool',
        quote:
            "As a fitness coach, I've seen nothing like Kangen water. My clients recover faster, perform better — and my True Legacy income is freedom redefined.",
        initials: 'RP',
        gradient: 'from-green-500 to-cyan-400',
        role: 'Fitness & Wellness Coach',
    },
    {
        handle: '@egbertnah',
        name: 'Egbert Nah',
        instagram: 'https://instagram.com/egbertnah',
        quote:
            'Within 6 months of joining True Legacy, I replaced my full salary. The emGuarde technology gave my family protection — and the community gave me purpose.',
        initials: 'EN',
        gradient: 'from-purple-500 to-blue-400',
        role: 'Global Entrepreneur',
    },
    {
        handle: '@doinitarotar',
        name: 'Doinita Rotar',
        instagram: 'https://instagram.com/doinitarotar',
        quote:
            "I was skeptical about network marketing — until I experienced True Legacy's culture. Real mentorship, real results. My Legacy is being written right now.",
        initials: 'DR',
        gradient: 'from-pink-500 to-purple-400',
        role: 'Legacy Builder',
    },
    {
        handle: '@ocbbullet',
        name: 'OCB Bullet',
        instagram: 'https://instagram.com/ocbbullet',
        quote:
            'The emGuarde device changed everything in my home office. Less brain fog, more energy, sharper focus. And the income is allowing me to compete and win.',
        initials: 'OB',
        gradient: 'from-orange-500 to-red-400',
        role: 'Competitive Athlete & Entrepreneur',
    },
    {
        handle: '@vero.calafat',
        name: 'Vero Calafat',
        instagram: 'https://instagram.com/vero.calafat',
        quote:
            "True Legacy World brought me into a global family of healers and builders. My health is thriving, my income is growing, and I'm leaving a legacy for my children.",
        initials: 'VC',
        gradient: 'from-cyan-500 to-green-400',
        role: 'Latin America Leader',
    },
    {
        handle: '@thomas_sinner',
        name: 'Thomas Sinner',
        instagram: 'https://instagram.com/thomas_sinner',
        quote:
            'I went from burned out in corporate to building a 7-figure legacy. True Legacy gave me the roadmap, the tools, and the belief that it was possible.',
        initials: 'TS',
        gradient: 'from-blue-600 to-indigo-400',
        role: 'Former Corporate Executive',
    },
    {
        handle: '@elinmok98',
        name: 'Elin Mok',
        instagram: 'https://instagram.com/elinmok98',
        quote:
            "Youth and legacy aren't opposites — True Legacy proved that. At 25, I'm building generational wealth, travelling globally, and healing daily with Kangen water.",
        initials: 'EM',
        gradient: 'from-teal-500 to-blue-400',
        role: 'Young Legacy Innovator',
    },
    {
        handle: '@moroccanprincess91',
        name: 'Moroccan Princess',
        instagram: 'https://instagram.com/moroccanprincess91',
        quote:
            'True Legacy gave me a platform to build globally from Morocco. Mehdi Cohen\'s mentorship changed my belief system — and Kangen changed my body.',
        initials: 'MP',
        gradient: 'from-amber-500 to-orange-400',
        role: 'North Africa Leader',
    },
    {
        handle: '@swolejd_',
        name: 'Swole JD',
        instagram: 'https://instagram.com/swolejd_',
        quote:
            'In the gym, recovery is everything. Kangen water cut my recovery time in half. And True Legacy gave me a business that funds the lifestyle I train hard for.',
        initials: 'SJ',
        gradient: 'from-red-500 to-pink-400',
        role: 'Strength & Performance Coach',
    },
]

const duplicated = [...TESTIMONIALS, ...TESTIMONIALS]

export function TestimonialSection() {
    return (
        <section className="py-24 overflow-hidden" id="testimonials">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block mb-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                        Real People. Real Results.
                    </span>
                    <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                        True Legacy{' '}
                        <span className="gradient-text">Leaders Worldwide</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-slate-400 text-lg">
                        Thousands of people across the globe are healing their bodies, building wealth, and leaving a lasting legacy. See what they're saying.
                    </p>
                </motion.div>
            </div>

            {/* Scrolling marquee row 1 */}
            <div className="relative">
                <div className="flex gap-6 animate-marquee" style={{ width: 'max-content' }}>
                    {duplicated.map((t, i) => (
                        <TestimonialCard key={`r1-${i}`} testimonial={t} />
                    ))}
                </div>
            </div>

            {/* Scrolling marquee row 2 — reversed */}
            <div className="relative mt-6">
                <div
                    className="flex gap-6"
                    style={{
                        width: 'max-content',
                        animation: 'marquee-scroll 35s linear infinite reverse',
                    }}
                >
                    {[...duplicated].reverse().map((t, i) => (
                        <TestimonialCard key={`r2-${i}`} testimonial={t} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function TestimonialCard({ testimonial: t }: { testimonial: (typeof TESTIMONIALS)[0] }) {
    return (
        <div className="glass shrink-0 w-80 rounded-2xl border border-white/10 p-6 hover:border-cyan-500/30 transition-all duration-300 group">
            <Quote className="mb-3 h-5 w-5 text-cyan-400/60" />
            <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-4">
                "{t.quote}"
            </p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-white text-sm font-bold shrink-0`}
                    >
                        {t.initials}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                </div>
                <a
                    href={t.instagram}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300 opacity-0 group-hover:opacity-100"
                >
                    <ExternalLink className="h-3 w-3" />
                    {t.handle}
                </a>
            </div>
        </div>
    )
}
