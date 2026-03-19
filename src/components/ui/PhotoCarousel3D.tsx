import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Globe, Star, Trophy, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const LEADERS = [
    {
        id: 1,
        name: 'Coach Mehdi',
        handle: '@mehdicohen_',
        instagramUrl: 'https://www.instagram.com/mehdicohen_/',
        region: 'Morocco · Colombia · USA',
        role: 'Global Founder & Market Builder',
        intro: 'After 24 years in the U.S., Mehdi expanded into Morocco and now Colombia — opening new markets while mentoring leaders who want more intentional, flexible lives with Enagic.',
        bio: [
            'After spending 24 years living and working in the United States, I built my life the traditional way — career, routine, and a clear idea of what success was supposed to look like.',
            'Over time, I realized I wanted something more intentional and flexible. That shift began when I was introduced to Enagic\'s Japanese technology and the business model behind it.',
            'I chose to expand beyond what was familiar, helping open new markets internationally — first in Morocco, now in Colombia — while continuing to mentor and support people across the U.S. who want to build with purpose and long-term vision.',
        ],
        image: '/leaders/mehdi-hero.png',
        icon: Globe,
        gradient: 'from-[#1B3A8C] to-blue-600',
        glow: 'rgba(27,58,140,0.5)',
    },
    {
        id: 2,
        name: 'Coach Zah',
        handle: '@zahphysique',
        instagramUrl: 'https://www.instagram.com/zahphysique/',
        region: 'Miami · USA',
        role: 'Elite Performance & Leadership Coach',
        intro: 'For more than a decade Zah has coached elite athletes, celebrities, and executives — now channeling that performance mindset into leadership, leverage, and legacy with Enagic.',
        bio: [
            "For more than a decade, I've had the privilege of coaching some of the world's top performers — elite athletes, celebrities, and C-suite executives.",
            "But what I discovered along that journey went beyond just training — it was about mastering leadership, understanding leverage, and embracing a vision that's bigger than yourself.",
            "I realized true, lasting impact isn't created in isolation. It comes from connecting with the right people and choosing the right vehicle. That's what led me to Enagic — a company built on authenticity, proven systems, and sustainable growth.",
            "Now, we have a space where like-minded leaders unite, blend their strengths, and leverage our collective expertise to build generational wealth and a lasting legacy.",
        ],
        image: '/leaders/zah-hero.png',
        icon: Users,
        gradient: 'from-blue-600 to-indigo-600',
        glow: 'rgba(37,99,235,0.5)',
    },
    {
        id: 3,
        name: 'Coach Magaly',
        handle: '@mcardonita',
        instagramUrl: 'https://www.instagram.com/mcardonita/',
        region: 'USA · LATAM',
        role: 'Coach & Impact-Driven Entrepreneur',
        intro: 'Magaly helps people design work that aligns with their values — guiding leaders across the U.S. and Latin America to build intentional businesses through Enagic and community.',
        bio: [
            'After years of trying to create a life that felt both meaningful and balanced, I realized I wanted a way of working that aligned more deeply with my values. That journey led me to Enagic and a community centered around growth, education, and contribution.',
            'What began as a personal shift became a professional calling. Today, as a coach and entrepreneur, I support people in the U.S. and around the world who want to build with more intention — whether that\'s in their health, their work, or the direction of their lives.',
        ],
        image: '/leaders/magaly-hero.png',
        icon: Trophy,
        gradient: 'from-indigo-500 to-purple-600',
        glow: 'rgba(99,102,241,0.5)',
    },
    {
        id: 4,
        name: 'Coach Ming Way',
        handle: '@mingwaysia',
        instagramUrl: 'https://www.instagram.com/mingwaysia/',
        region: 'Malaysia · India',
        role: 'Business Builder & Mentor',
        intro: 'Ming Way built from the ground up alongside his father, developing discipline and resilience that he now uses to help others build responsible, legacy-focused businesses.',
        bio: [
            'I made the decision to step away from a traditional academic path and work alongside my father to build a business from the ground up. It wasn\'t glamorous — for two years, I worked relentlessly, navigating challenges that tested my discipline, resilience, and character.',
            'That period became the foundation for everything that followed. What began as uncertainty turned into a long-term vision — a business and a legacy built through consistency, responsibility, and commitment.',
            'Today, I focus on helping others think beyond default paths, take ownership of their decisions, and build lives and businesses that reflect their values, not just society\'s expectations.',
        ],
        image: '/leaders/mingway-hero.png',
        icon: Zap,
        gradient: 'from-amber-500 to-orange-600',
        glow: 'rgba(245,158,11,0.5)',
    },
    {
        id: 5,
        name: 'Coach Simon Loh',
        handle: '@simonloh_',
        instagramUrl: 'https://www.instagram.com/simonloh_/',
        region: 'Malaysia · UAE · Nigeria',
        role: 'Global Entrepreneur & Strategist',
        intro: 'Since 2016 Simon has supported more than 10,000 entrepreneurs and over $30M in sales volume — helping leaders in markets like Malaysia, India, UAE, Turkey, and Nigeria build sustainable businesses.',
        bio: [
            "I'm a global entrepreneur who has spent the last several years building and scaling businesses across multiple international markets.",
            "Since 2016, I've had the opportunity to work with and support more than 10,000 entrepreneurs, generate over $30 million in sales volume, and help expand operations in countries including Malaysia, India, the United Arab Emirates, Turkey, and Nigeria.",
            'My focus is on helping people move beyond traditional career limitations by applying practical, disciplined, and proven business strategies. Through speaking, mentoring, and direct collaboration, I work with individuals who want to build more intentional, flexible, and sustainable professional lives.',
        ],
        image: '/leaders/simon-hero.png',
        icon: Star,
        gradient: 'from-cyan-600 to-blue-700',
        glow: 'rgba(6,182,212,0.5)',
    },
]

export function PhotoCarousel3D() {
    const [active, setActive] = useState(0)
    const count = LEADERS.length

    const prev = () => {
        setActive((a) => (a - 1 + count) % count)
    }

    const next = () => {
        setActive((a) => (a + 1) % count)
    }

    useEffect(() => {
        const t = setInterval(next, 5000)
        return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCardStyle = (idx: number) => {
        const diff = ((idx - active + count) % count + count) % count
        const normDiff = diff > count / 2 ? diff - count : diff

        if (normDiff === 0) return { zIndex: 10, x: '0%', scale: 1, opacity: 1, rotateY: 0 }
        if (normDiff === 1 || normDiff === -1) {
            return {
                zIndex: 5,
                x: normDiff > 0 ? '55%' : '-55%',
                scale: 0.82,
                opacity: 0.6,
                rotateY: normDiff > 0 ? -18 : 18,
            }
        }
        return {
            zIndex: 1,
            x: normDiff > 0 ? '90%' : '-90%',
            scale: 0.65,
            opacity: 0.2,
            rotateY: normDiff > 0 ? -28 : 28,
        }
    }

    const activeLeader = LEADERS[active]

    return (
        <div className="w-full px-4 md:px-8 pb-12 overflow-visible" style={{ touchAction: 'pan-y' }}>
            {/* 3D Stage */}
            <div
                className="relative mx-auto overflow-hidden"
                style={{ perspective: '1200px', height: 380 }}
            >
                {LEADERS.map((leader, idx) => {
                    const style = getCardStyle(idx)
                    const LIcon = leader.icon
                    return (
                        <motion.div
                            key={leader.id}
                            animate={{
                                x: style.x,
                                scale: style.scale,
                                opacity: style.opacity,
                                rotateY: style.rotateY,
                                zIndex: style.zIndex,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                            className="absolute top-0 left-1/2 w-[280px] sm:w-[320px] -translate-x-1/2 cursor-pointer"
                            onClick={() => {
                                if (idx !== active) {
                                    setActive(idx)
                                }
                            }}
                            style={{ zIndex: style.zIndex, transformStyle: 'preserve-3d' }}
                        >
                            <div
                                className={`relative h-[340px] rounded-3xl overflow-hidden bg-gradient-to-br ${leader.gradient} border border-white/15 shadow-2xl`}
                                style={{ boxShadow: `0 25px 60px ${leader.glow}` }}
                            >
                                {/* Leader Photo (if available) or Icon background */}
                                {leader.image ? (
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-15">
                                        <LIcon className="w-40 h-40 text-white" />
                                    </div>
                                )}
                                {/* Gradient fade bottom for readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-between p-6">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                                            {leader.region}
                                        </p>
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <h4 className="font-black text-white text-base mb-0.5">{leader.name}</h4>
                                        <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{leader.role}</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )
                })}
            </div>

            {/* Leader intro (below 3D cards): full bio + Instagram */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 max-w-2xl mx-auto text-center px-4"
                >
                    <div className="flex justify-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{activeLeader.role}</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-0.5">{activeLeader.name}</h3>
                    <a
                        href={activeLeader.instagramUrl}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-sm text-tl-gold hover:text-white transition-colors mb-3"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                        <span>{activeLeader.handle}</span>
                    </a>
                    <div className="text-slate-400 text-sm leading-relaxed text-left space-y-3">
                        {activeLeader.bio.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls — single row on mobile, no wrap */}
            <div className="mt-6 min-h-[52px] flex flex-nowrap items-center justify-center gap-3 sm:gap-4 pb-4 px-2">
                <button
                    onClick={prev}
                    aria-label="Previous leader"
                    className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Dots — same size so layout doesn't shift */}
                <div className="flex shrink-0 flex-wrap justify-center gap-1.5 sm:gap-2">
                    {LEADERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActive(idx)}
                            aria-label={`Go to leader ${idx + 1}`}
                            className={`transition-all duration-300 rounded-full shrink-0 ${idx === active
                                ? 'w-5 h-2.5 sm:w-6 bg-orange-500'
                                : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    aria-label="Next leader"
                    className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
