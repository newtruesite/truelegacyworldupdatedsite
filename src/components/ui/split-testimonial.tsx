"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Star } from "lucide-react"

export interface Testimonial {
    id: number
    quote: string
    name: string
    role: string
    company?: string
    flagEmoji?: string
    image?: string
    stars?: number
    instagram?: string
    handle?: string
    tiktok?: string
    region?: string
    isLeader?: boolean
}

const V10_TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: 'Nigara Ismail',
        location: 'True Legacy Distributor',
        role: 'True Legacy Distributor',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@nigara.ismail',
        instagram: 'https://www.instagram.com/nigara.ismail/',
        quote:
            'Joining True Legacy changed everything for me. The products speak for themselves — I just share my story and the sales follow naturally.',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
    } as any,
    {
        id: 2,
        name: 'Zahphysique',
        role: 'True Legacy Distributor',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@zahphysique',
        instagram: 'https://www.instagram.com/zahphysique/',
        quote:
            'As a fitness professional, I needed products I could genuinely stand behind. Kangen Water is now a non-negotiable part of my recovery stack.',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
    },
    {
        id: 3,
        name: 'Egbert Nah',
        role: 'True Legacy Distributor',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@egbertnah',
        instagram: 'https://www.instagram.com/egbertnah/',
        quote:
            "I was skeptical at first. Six months in, I've built a team across 3 countries and replaced my corporate salary. This opportunity is real.",
        stars: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
    },
    {
        id: 4,
        name: 'Doinitar Otar',
        role: 'True Legacy Distributor',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@doinitarotar',
        instagram: 'https://www.instagram.com/doinitarotar/',
        quote:
            "The compensation plan is unlike anything I've seen. Transparent, fair, and it actually pays. My family's financial future looks completely different now.",
        stars: 5,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
    },
    {
        id: 5,
        name: 'OCB Bullet',
        role: 'True Legacy Distributor',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@ocbbullet',
        instagram: 'https://www.instagram.com/ocbbullet/',
        quote:
            'Started with just the K8 machine for my own health. Within 3 weeks I had sold 4 units to family and friends who saw the difference in me.',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
    },
    {
        id: 6,
        name: 'Vero Calafat',
        role: 'True Legacy Distributor — LATAM',
        company: 'LATAM',
        flagEmoji: '🌎',
        handle: '@vero.calafat',
        instagram: 'https://www.instagram.com/vero.calafat/',
        quote:
            'En Latinoamérica el mercado es enorme y la competencia es casi nula. True Legacy me dio las herramientas para construir un negocio de verdad.',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b9e77e49?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'latam',
    },
    {
        id: 7,
        name: 'Thomas Sinner',
        role: 'True Legacy Distributor',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@thomas_sinner',
        instagram: 'https://www.instagram.com/thomas_sinner/',
        quote:
            "The emGuarde product alone opened doors I didn't expect. Professionals, executives, families — everyone wants EMF protection. Easy conversations.",
        stars: 5,
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
    },
    {
        id: 8,
        name: 'Katie Pilkey',
        role: 'True Legacy Distributor',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@katiepilkey',
        instagram: 'https://www.instagram.com/katiepilkey/',
        quote:
            "I run this business completely from my phone. Between the training library and the True Legacy team support, I never feel like I'm doing this alone.",
        stars: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
    },
    {
        id: 9,
        name: 'Elin Mok',
        role: 'True Legacy Distributor — Asia',
        company: 'Asia',
        flagEmoji: '🌏',
        handle: '@elinmok98',
        instagram: 'https://www.instagram.com/elinmok98/',
        quote:
            'As a distributor in Asia, the demand for Kangen products is incredible. The brand speaks for itself — I just connect people to it.',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'asia',
    },
    {
        id: 10,
        name: 'Moroccan Princess',
        role: 'True Legacy Distributor — Morocco',
        company: 'Morocco',
        flagEmoji: '🇲🇦',
        handle: '@moroccanprincess91',
        instagram: 'https://www.instagram.com/moroccanprincess91/',
        quote:
            'Au Maroc, l\'eau Kangen est une révolution. Les gens comprennent immédiatement la valeur. Mon équipe grandit chaque semaine.',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'africa',
    },
    {
        id: 11,
        name: 'Mehdi Cohen',
        role: 'True Legacy World — Founder & Leader',
        company: 'Global',
        flagEmoji: '🌍',
        handle: '@mehdi_cohen',
        instagram: 'https://www.instagram.com/mehdicohen/',
        tiktok: 'https://www.tiktok.com/@mehdi_cohen',
        quote:
            'True Legacy is about creating something that outlasts you. Every distributor who joins this family is not just building income — they are building a legacy.',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face&q=80',
        region: 'global',
        isLeader: true,
    },
]

const DEFAULT_TESTIMONIALS: Testimonial[] = V10_TESTIMONIALS

// Spanish testimonials for LATAM / Spanish country pages (reuse V10 content for now)
const SPANISH_TESTIMONIALS: Testimonial[] = V10_TESTIMONIALS

interface TestimonialsSplitProps {
    testimonials?: Testimonial[]
    locale?: 'en' | 'es' | 'fr'
}

export function TestimonialsSplit({ testimonials, locale = 'en' }: TestimonialsSplitProps) {
    const list = testimonials ?? (locale === 'es' ? SPANISH_TESTIMONIALS : DEFAULT_TESTIMONIALS)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)

    const active = list[activeIndex]

    const nextTestimonial = () => {
        setActiveIndex((prev) => (prev + 1) % list.length)
    }

    const prevTestimonial = () => {
        setActiveIndex((prev) => (prev - 1 + list.length) % list.length)
    }

    const igUrl = (company: string | undefined) => {
        if (!company) return 'https://www.instagram.com/truelegacyworld/'
        const latam = ['Colombia', 'Brazil', 'Mexico', 'Paraguay', 'Norteamérica', 'Europa', 'Sudamérica', 'LATAM', 'Latin America']
        return latam.some((r) => company?.includes(r)) ? 'https://www.instagram.com/truelegacylatam/' : 'https://www.instagram.com/truelegacyworld/'
    }

    const igHandle = (company: string | undefined) => {
        if (!company) return '@truelegacyworld'
        const latam = ['Colombia', 'Brazil', 'Mexico', 'Paraguay', 'Norteamérica', 'Europa', 'Sudamérica', 'LATAM', 'Latin America']
        return latam.some((r) => company?.includes(r)) ? '@truelegacylatam' : '@truelegacyworld'
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-20">
            <div
                className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center cursor-pointer group"
                onClick={nextTestimonial}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Left: Quote Content */}
                <div className="space-y-6">
                    {/* Company Tag */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.company}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-slate-500"
                        >
                            <span className="w-8 h-px bg-orange-500/50" />
                            {active.flagEmoji && (
                                <span className="text-lg leading-none drop-shadow-sm">
                                    {active.flagEmoji}
                                </span>
                            )}
                            {active.company}
                        </motion.div>
                    </AnimatePresence>

                    {/* Stars */}
                    {active.stars && (
                        <div className="flex gap-1">
                            {Array.from({ length: active.stars }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                    )}

                    {/* Quote */}
                    <div className="relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.blockquote
                                key={active.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="text-base md:text-lg font-light leading-relaxed tracking-tight text-white"
                            >
                                "{active.quote}"
                            </motion.blockquote>
                        </AnimatePresence>
                    </div>

                    {/* Author Info */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-10 h-px bg-white/20" />
                            <div>
                                <p className="text-sm font-semibold text-white">{active.name}</p>
                                <p className="text-xs text-slate-400">
                                    {active.role}
                                    {active.isLeader ? ' · Team Leader' : ''}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right: Instagram (above photo) + Photo */}
                <div className="relative w-full md:w-64 md:h-80 flex-shrink-0 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-2 mb-3">
                        <a
                            href={active.instagram ?? igUrl(active.company)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="testimonial-ig-link inline-flex items-center gap-1.5 text-sm text-[#c13584] hover:opacity-100 opacity-80 font-semibold transition-opacity"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                            <span>
                                {active.handle
                                    ? active.handle
                                    : active.instagram
                                    ? active.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@').replace(/\/?$/, '')
                                    : igHandle(active.company)}
                            </span>
                        </a>
                        {active.tiktok && (
                            <a
                                href={active.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.78 1.52V6.73a4.84 4.84 0 01-1.01-.04z" />
                                </svg>
                                <span>@mehdi_cohen</span>
                            </a>
                        )}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
                            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                            exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full h-full min-h-[200px] md:min-h-[280px]"
                        >
                            <div
                                className="w-full h-full rounded-[1.5rem] overflow-hidden border-[2px] border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] bg-[#0a1628] flex items-center justify-center"
                            >
                                {active.image ? (
                                    <img
                                        src={active.image}
                                        alt={active.name}
                                        className="testimonial-avatar w-full h-full object-cover"
                                        style={{ minWidth: 72, minHeight: 72 }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-800 to-navy-900 flex items-center justify-center">
                                        <span className="text-4xl font-black text-white">{active.name[0]}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Dots and Next in their own row below the card so they don't overlap CTAs */}
            <div className="mt-8 mb-6 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    {/* Progress Dots */}
                    <div className="flex items-center gap-3">
                        {list.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveIndex(index)
                                }}
                                className="relative p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label={`Testimonial ${index + 1}`}
                            >
                                <span
                                    className={`block w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                            ? "bg-orange-500 scale-100"
                                            : "bg-white/20 scale-75 hover:bg-white/40 hover:scale-100"
                                        }`}
                                />
                                {index === activeIndex && (
                                    <motion.span
                                        layoutId="activeDot"
                                        className="absolute inset-0 border border-orange-500/50 rounded-full"
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); prevTestimonial() }}
                        className="testimonial-prev inline-flex items-center gap-1.5 min-h-[44px] px-4 text-sm text-orange-400 hover:text-orange-300 font-medium"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>{locale === 'es' ? 'Anterior' : locale === 'fr' ? 'Précédent' : 'Previous'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); nextTestimonial() }}
                        className="testimonial-next inline-flex items-center gap-1.5 min-h-[44px] px-4 text-sm text-orange-400 hover:text-orange-300 font-medium"
                    >
                        <span>{locale === 'es' ? 'Siguiente' : locale === 'fr' ? 'Suivant' : 'Next'}</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
