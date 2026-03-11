import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { t } from '@/lib/translations'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { TLBackground } from '@/components/ui/TLBackground'
import WorldMap from '@/components/ui/WorldMap'
import { PhotoCarousel3D } from '@/components/ui/PhotoCarousel3D'
import { SocialProofStrip } from '@/components/ui/SocialProofStrip'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductSection } from '@/components/products/ProductSection'

function IconGlobe() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

function IconGlobeLarge() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
function IconHeart() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    )
}
function IconTrendingUp() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}

export default function HomePage() {
    const { locale } = useLocaleContext()
    const copy = t[locale]
    const [pastHero, setPastHero] = useState(false)
    const [footerInView, setFooterInView] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)
    const stickyCtaVisible = pastHero && !footerInView

    useEffect(() => {
        const hero = heroRef.current
        const footer = footerRef.current
        if (!hero || !footer) return
        const heroObserver = new IntersectionObserver(
            ([entry]) => setPastHero(!!entry && !entry.isIntersecting),
            { threshold: 0 }
        )
        heroObserver.observe(hero)
        const footerObserver = new IntersectionObserver(
            ([entry]) => setFooterInView(!!entry?.isIntersecting),
            { threshold: 0 }
        )
        footerObserver.observe(footer)
        return () => {
            heroObserver.disconnect()
            footerObserver.disconnect()
        }
    }, [])

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#060b1e' }}>
            <Navbar />

            <main className="flex-grow">

                {/* ===== HERO + MAP ===== */}
                <div ref={heroRef}>
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

                        {/* Main heading — fluid on mobile */}
                        <h1 className="text-white leading-[1.1] mb-5 font-display font-bold px-1" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
                            Creating True Health
                            <br />
                            <span className="gradient-text">Around the World.</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-400 font-light max-w-2xl mx-auto leading-relaxed min-[480px]:text-base">
                            With True Legacy, you lead a global movement transforming lives —
                            creating real health breakthroughs and genuine opportunities for lasting prosperity.
                        </p>
                        <p className="mt-4 text-sm md:text-base text-slate-500 font-light max-w-xl mx-auto min-[480px]:text-base">
                            Join a community of entrepreneurs who make money by sharing world-changing products — like the <strong className="text-cyan-400/90">Kangen</strong> water machine and <strong className="text-purple-400/90">emGuarde</strong>. Pick your region on the map and start your journey.
                        </p>
                        <SocialProofStrip />
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
                </div>

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
                </section>

                {/* ===== ENAGIC PRODUCTS (GLOBAL TEASER) ===== */}
                <ProductSection productIds={['k8', 'sd501', 'anespa_dx', 'emguarde']} variant="home" />

                {/* ===== JOIN THE TEAM ===== */}
                <section id="join" className="relative py-20 md:py-24" style={{ background: '#060b1e' }}>
                    <div className="absolute inset-x-0 top-0 h-px section-divider" />
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-14"
                        >
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                                {copy.join_heading}
                            </h2>
                            <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                                {copy.join_sub}
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass rounded-2xl border border-white/10 p-8 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-5">
                                    <IconGlobeLarge />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{copy.join_global}</h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                    {copy.join_global_body}
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="glass rounded-2xl border border-white/10 p-8 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 mb-5">
                                    <IconHeart />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{copy.join_healing}</h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                    {copy.join_healing_body}
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="glass rounded-2xl border border-white/10 p-8 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tl-gold/20 text-tl-gold mb-5">
                                    <IconTrendingUp />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{copy.join_income}</h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                    {copy.join_income_body}
                                </p>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <Link
                                to="/#map"
                                className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02]"
                                style={{
                                    background: 'linear-gradient(135deg, #1B3A8C 0%, #1e6fc0 100%)',
                                    boxShadow: '0 4px 24px rgba(27,58,140,0.4)',
                                }}
                            >
                                {copy.join_cta}
                            </Link>
                        </motion.div>
                    </div>
                </section>

            </main>

            {/* Sticky mobile CTA — visible after hero, hidden at footer */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden transition-transform duration-300 ${
                    stickyCtaVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ background: 'linear-gradient(to top, rgba(6,11,30,0.98), transparent)' }}
            >
                <Link
                    to="/#map"
                    className="flex items-center justify-center min-h-[48px] w-full rounded-2xl font-bold text-white"
                    style={{
                        background: 'linear-gradient(135deg, #1B3A8C 0%, #1e6fc0 100%)',
                        boxShadow: '0 4px 24px rgba(27,58,140,0.4)',
                    }}
                >
                    Join the Team
                </Link>
            </div>

            <div ref={footerRef}><Footer /></div>
        </div>
    )
}
