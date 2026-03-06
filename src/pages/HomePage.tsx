import { motion } from 'framer-motion'
import { TLBackground } from '@/components/ui/TLBackground'
import WorldMap from '@/components/ui/WorldMap'
import { PhotoCarousel3D } from '@/components/ui/PhotoCarousel3D'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'

// Custom SVG icons (no emojis)
function IconChevronDown() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    )
}

function IconGlobe() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

function IconInstagram({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    )
}

const COACHES = [
    {
        name: "Coach Mehdi",
        handle: "@mehdicohen_",
        image: "/leaders/mehdi-hero.png",
        instagram: "https://www.instagram.com/mehdicohen_/",
        bio: [
            "After spending 24 years living and working in the United States, I built my life the traditional way — career, routine, and a clear idea of what success was supposed to look like.",
            "Over time, I realized I wanted something more intentional and flexible. That shift began when I was introduced to Enagic’s Japanese technology and the business model behind it.",
            "I chose to expand beyond what was familiar, helping open new markets internationally — first in Morocco, now in Colombia — while continuing to mentor and support people across the U.S. who want to build with purpose and long-term vision."
        ]
    },
    {
        name: "Coach Zah",
        handle: "@zahphysique",
        image: "/leaders/zah-hero.png",
        instagram: "https://www.instagram.com/zahphysique/",
        bio: [
            "For more than a decade, I've had the privilege of coaching some of the world’s top performers — elite athletes, celebrities, and C-suite executives.",
            "But what I discovered along that journey went beyond just training — it was about mastering leadership, understanding leverage, and embracing a vision that’s bigger than yourself.",
            "I realized true, lasting impact isn't created in isolation. It comes from connecting with the right people and choosing the right vehicle. That’s what led me to Enagic — a company built on authenticity, proven systems, and sustainable growth.",
            "Now, we have a space where like-minded leaders unite, blend their strengths, and leverage our collective expertise to build generational wealth and a lasting legacy."
        ]
    },
    {
        name: "Coach Magaly",
        handle: "@mcardonita",
        image: "/leaders/magaly-hero.png",
        instagram: "https://www.instagram.com/mcardonita/",
        bio: [
            "After years of trying to create a life that felt both meaningful and balanced, I realized I wanted a way of working that aligned more deeply with my values. That journey led me to Enagic and a community centered around growth, education, and contribution.",
            "What began as a personal shift became a professional calling. Today, as a coach and entrepreneur, I support people in the U.S. and around the world who want to build with more intention — whether that’s in their health, their work, or the direction of their lives."
        ]
    },
    {
        name: "Coach Ming Way",
        handle: "@mingwaysia",
        image: "/leaders/mingway-hero.png",
        instagram: "https://www.instagram.com/mingwaysia/",
        bio: [
            "I made the decision to step away from a traditional academic path and work alongside my father to build a business from the ground up. It wasn’t glamorous — for two years, I worked relentlessly, navigating challenges that tested my discipline, resilience, and character.",
            "That period became the foundation for everything that followed. What began as uncertainty turned into a long-term vision — a business and a legacy built through consistency, responsibility, and commitment.",
            "Today, I focus on helping others think beyond default paths, take ownership of their decisions, and build lives and businesses that reflect their values, not just society’s expectations."
        ]
    },
    {
        name: "Coach Simon Loh",
        handle: "@simonloh_",
        image: "/leaders/simon-hero.png",
        instagram: "https://www.instagram.com/simonloh_/",
        bio: [
            "I’m a global entrepreneur who has spent the last several years building and scaling businesses across multiple international markets.",
            "Since 2016, I’ve had the opportunity to work with and support more than 10,000 entrepreneurs, generate over $30 million in sales volume, and help expand operations in countries including Malaysia, India, the United Arab Emirates, Turkey, and Nigeria.",
            "My focus is on helping people move beyond traditional career limitations by applying practical, disciplined, and proven business strategies. Through speaking, mentoring, and direct collaboration, I work with individuals who want to build more intentional, flexible, and sustainable professional lives."
        ]
    }
]

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#060b1e' }}>
            <Navbar />

            <main className="flex-grow">

                {/* ===== HERO + MAP ===== */}
                <TLBackground className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-12">

                    {/* Hero Text — extra top margin for spacing from navbar / "top categories" */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-5xl mx-auto text-center px-6 mt-8 mb-10"
                    >
                        {/* Eyebrow */}
                        <p className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-tl-gold opacity-80">
                            Find your region on the map &nbsp;·&nbsp; Ubica tu región en el mapa
                        </p>

                        {/* Main heading */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-5 font-display font-bold">
                            Creating True Health
                            <br />
                            <span className="gradient-text">Around the World.</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                            With True Legacy, you lead a global movement transforming lives —
                            creating real health breakthroughs and genuine opportunities for lasting prosperity.
                        </p>
                        <p className="mt-4 text-sm md:text-base text-slate-500 font-light max-w-xl mx-auto">
                            Join a community of entrepreneurs who make money by sharing world-changing products — like the <strong className="text-cyan-400/90">Kangen</strong> water machine and <strong className="text-purple-400/90">emGuarde</strong>. Pick your region on the map and start your journey.
                        </p>
                    </motion.div>

                    {/* World Map — taller aspect so "True Legacy" at top of image isn't cut off */}
                    <motion.div
                        id="map"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.1, delay: 0.25 }}
                        className="relative z-10 w-full max-w-6xl mx-auto px-4 scroll-mt-28"
                    >
                        <div
                            className="w-full rounded-3xl overflow-hidden shadow-2xl"
                            style={{
                                aspectRatio: '16/9',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <WorldMap />
                        </div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-slate-500">Scroll to Explore</span>
                        <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
                    </motion.div>
                </TLBackground>

                {/* ===== LEADERS CAROUSEL ===== */}
                <section className="relative py-24" style={{ background: '#060b1e' }}>
                    {/* Accent arcs at top */}
                    <div className="absolute inset-x-0 top-0 h-px section-divider" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                        >
                            <div className="max-w-xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tl-gold mb-3">
                                    The Leaders
                                </p>
                                <h2 className="text-3xl md:text-5xl text-white mb-4 leading-tight font-display font-bold">
                                    A Movement Across<br />
                                    <span className="gradient-text-blue">Every Continent</span>
                                </h2>
                                <p className="text-slate-400 text-base leading-relaxed font-light">
                                    Connecting visionary leaders from Morocco to Miami, Lagos to Bogotá — each building a True Legacy.
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-tl-blue/10 text-slate-400">
                                <IconGlobe />
                            </div>
                        </motion.div>
                    </div>

                    <PhotoCarousel3D />

                    {/* Leaders grid */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="w-full relative rounded-3xl overflow-hidden mb-24 hidden md:block"
                        >
                            <img src="/leaders/group.png" alt="True Legacy Leaders" className="w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#060b1e] via-transparent to-transparent flex items-end justify-center pb-8 border border-white/10 rounded-3xl" />
                        </motion.div>

                        <div className="space-y-24">
                            {COACHES.map((coach, i) => (
                                <motion.div
                                    key={coach.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className={`flex flex-col gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                                >
                                    {/* Photo — no white border, full bleed */}
                                    <div className="w-full md:w-5/12 max-w-[380px] flex-shrink-0">
                                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] flex items-end justify-center">
                                            <img
                                                src={coach.image}
                                                alt={coach.name}
                                                className="w-full h-full object-cover object-center"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                            {/* Subtle gradient overlay at bottom */}
                                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060b1e] via-transparent to-transparent" />
                                        </div>
                                    </div>

                                    <div className="w-full md:flex-1 flex flex-col justify-center pt-2">
                                        <h3 className="text-3xl lg:text-4xl font-display font-bold text-white mb-1">
                                            {coach.name}
                                        </h3>
                                        <a
                                            href={coach.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm text-tl-gold hover:text-white transition-colors mb-8"
                                        >
                                            <IconInstagram size={14} />
                                            <span>{coach.handle}</span>
                                        </a>
                                        <div className="space-y-4">
                                            {coach.bio.map((para, idx) => (
                                                <p key={idx} className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
