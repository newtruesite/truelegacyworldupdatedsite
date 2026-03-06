import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Globe, Users, Trophy, Zap, Heart, Star } from 'lucide-react'

const LEADERS = [
    {
        id: 1,
        name: 'Coach Mehdi',
        handle: '@mehdicohen_',
        region: 'Morocco · Colombia · USA',
        role: 'Global Founder & Market Builder',
        intro: 'After 24 years in the U.S., Mehdi expanded into Morocco and now Colombia — opening new markets while mentoring leaders who want more intentional, flexible lives with Enagic.',
        image: '/leaders/mehdi-hero.png',
        icon: Globe,
        gradient: 'from-[#1B3A8C] to-blue-600',
        glow: 'rgba(27,58,140,0.5)',
    },
    {
        id: 2,
        name: 'Coach Zah',
        handle: '@zahphysique',
        region: 'Miami · USA',
        role: 'Elite Performance & Leadership Coach',
        intro: 'For more than a decade Zah has coached elite athletes, celebrities, and executives — now channeling that performance mindset into leadership, leverage, and legacy with Enagic.',
        image: '/leaders/zah-hero.png',
        icon: Users,
        gradient: 'from-blue-600 to-indigo-600',
        glow: 'rgba(37,99,235,0.5)',
    },
    {
        id: 3,
        name: 'Coach Magaly',
        handle: '@mcardonita',
        region: 'USA · LATAM',
        role: 'Coach & Impact-Driven Entrepreneur',
        intro: 'Magaly helps people design work that aligns with their values — guiding leaders across the U.S. and Latin America to build intentional businesses through Enagic and community.',
        image: '/leaders/magaly-hero.png',
        icon: Trophy,
        gradient: 'from-indigo-500 to-purple-600',
        glow: 'rgba(99,102,241,0.5)',
    },
    {
        id: 4,
        name: 'Coach Ming Way',
        handle: '@mingwaysia',
        region: 'Asia Pacific',
        role: 'Business Builder & Mentor',
        intro: 'Ming Way built from the ground up alongside his father, developing discipline and resilience that he now uses to help others build responsible, legacy-focused businesses.',
        image: '/leaders/mingway-hero.png',
        icon: Zap,
        gradient: 'from-amber-500 to-orange-600',
        glow: 'rgba(245,158,11,0.5)',
    },
    {
        id: 5,
        name: 'Coach Simon Loh',
        handle: '@simonloh_',
        region: 'Asia Pacific',
        role: 'Global Entrepreneur & Strategist',
        intro: 'Since 2016 Simon has supported more than 10,000 entrepreneurs and over $30M in sales volume — helping leaders in markets like Malaysia, India, UAE, Turkey, and Nigeria build sustainable businesses.',
        image: '/leaders/simon-hero.png',
        icon: Star,
        gradient: 'from-cyan-600 to-blue-700',
        glow: 'rgba(6,182,212,0.5)',
    },
]

export function PhotoCarousel3D() {
    const [active, setActive] = useState(0)
    const [direction, setDirection] = useState(0)
    const count = LEADERS.length

    const prev = () => {
        setDirection(-1)
        setActive((a) => (a - 1 + count) % count)
    }

    const next = () => {
        setDirection(1)
        setActive((a) => (a + 1) % count)
    }

    useEffect(() => {
        const t = setInterval(next, 5000)
        return () => clearInterval(t)
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
    const Icon = activeLeader.icon

    return (
        <div className="w-full px-4 md:px-8 pb-12">
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
                                    setDirection(idx > active ? 1 : -1)
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

            {/* Leader intro (below 3D cards, no overlap) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 max-w-xl mx-auto text-center px-4"
                >
                    <div className="flex justify-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{activeLeader.role}</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">{activeLeader.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{activeLeader.intro}</p>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
                <button
                    onClick={prev}
                    aria-label="Previous leader"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                    {LEADERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActive(idx)}
                            aria-label={`Go to leader ${idx + 1}`}
                            className={`transition-all duration-300 rounded-full ${idx === active
                                ? 'w-6 h-2.5 bg-orange-500'
                                : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    aria-label="Next leader"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
