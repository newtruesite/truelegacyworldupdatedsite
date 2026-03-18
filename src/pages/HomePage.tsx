import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ProductSection } from '@/components/products/ProductSection'
import { SEO } from '@/components/SEO'
import { PhotoCarousel3D } from '@/components/ui/PhotoCarousel3D'
import { SocialProofStrip } from '@/components/ui/SocialProofStrip'
import { TLBackground } from '@/components/ui/TLBackground'
import WorldMap from '@/components/ui/WorldMap'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { trackEvent } from '@/lib/analytics'
import { t } from '@/lib/translations'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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
        
        // Section entrance animations
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible')
                    }
                })
            },
            { threshold: 0.1 }
        )
        
        document.querySelectorAll('.section-animate').forEach((section) => {
            sectionObserver.observe(section)
        })
        
        return () => {
            heroObserver.disconnect()
            footerObserver.disconnect()
            sectionObserver.disconnect()
        }
    }, [])

    return (
        <div className="page-wrapper" style={{ background: '#060b1e' }}>
            <SEO
                title={
                    locale === 'es'
                        ? 'True Legacy | Distribuidores Enagic de clase mundial'
                        : locale === 'fr'
                            ? 'True Legacy | Distributeurs Enagic de classe mondiale'
                            : 'True Legacy | World Class Enagic Distributors'
                }
                description={
                    locale === 'es'
                        ? 'Únete a una comunidad de emprendedores que ganan dinero compartiendo productos que cambian vidas como Kangen Water y emGuarde.'
                        : locale === 'fr'
                            ? "Rejoignez une communauté d'entrepreneurs qui gagnent de l'argent en partageant des produits qui changent la vie comme Kangen Water et emGuarde."
                            : 'Join a community of entrepreneurs who make money by sharing world-changing products like the Kangen water machine and emGuarde.'
                }
            />
            <Navbar />

            <main className="content-wrapper">

                {/* ===== HERO + MAP ===== */}
                <section ref={heroRef} className="map-section">
                <TLBackground className="relative flex flex-col items-center justify-start pt-20 pb-8 md:pt-32 md:pb-0">

                    {/* Hero Text — extra top margin for spacing from navbar / "top categories" */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="map-heading relative z-10 w-full max-w-5xl mx-auto text-center px-6 mt-8 mb-10"
                    >
                        {/* Eyebrow */}
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-tl-gold opacity-80"
                        >
                            {locale === 'es'
                                ? 'Ubica tu región en el mapa'
                                : locale === 'fr'
                                ? 'Trouvez votre région sur la carte'
                                : 'Find your region on the map'}
                        </motion.p>

                        {/* Main heading — fluid on mobile, larger and more confident */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                            className="hero-title mb-6 px-1"
                        >
                            {copy.hero_heading}
                            <br />
                            <span className="gradient-text">{copy.hero_around}</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                            className="hero-subtitle"
                        >
                            {copy.heroSub}
                        </motion.p>
                        <p className="mt-4 hero-subtitle opacity-75 max-w-xl">
                            {locale === 'es'
                                ? 'Únete a una comunidad de emprendedores que ganan compartiendo productos que cambian el mundo — como la máquina de Agua Kangen y emGuarde. Elige tu región en el mapa y comienza tu camino.'
                                : locale === 'fr'
                                ? "Rejoignez une communauté d’entrepreneurs qui gagnent en partageant des produits qui changent le monde — comme la machine d’eau Kangen et emGuarde. Choisissez votre région sur la carte et commencez votre parcours."
                                : 'Join a community of entrepreneurs who make money by sharing world‑changing products — like the Kangen water machine and emGuarde. Pick your region on the map and start your journey.'}
                        </p>
                        <SocialProofStrip />
                    </motion.div>

                    {/* World Map — logo is inbuilt inside WorldMap */}
                    <motion.div
                        id="map"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.25 }}
                        className="relative z-10 w-full max-w-6xl mx-auto px-4 scroll-mt-28 pb-16"
                    >
                        <div className="relative w-full">
                            <div className="absolute -inset-x-10 -top-10 h-40 bg-gradient-to-b from-white/5 to-transparent opacity-40 pointer-events-none" />
                            <div className="relative w-full overflow-visible">
                                <WorldMap />
                            </div>
                        </div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-slate-500">{copy.homeScrollToExplore}</span>
                        <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
                    </motion.div>
                </TLBackground>
                </section>

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
                                {copy.homeLeadersTitle}
                            </p>
                            <h2 className="text-3xl md:text-5xl text-white mb-4 leading-tight font-display font-bold">
                                {copy.homeLeadersHeadline}
                            </h2>
                            <p className="text-slate-400 text-base leading-relaxed font-light">
                                {copy.homeLeadersTagline}
                            </p>
                            </div>
                            <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-tl-blue/10 text-slate-400">
                                <IconGlobe />
                            </div>
                        </motion.div>
                    </div>

                    <PhotoCarousel3D />
                </section>

                {/* ===== JOIN THE TEAM (below leaders) ===== */}
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
                            <a
                                href="https://form.jotform.com/260232994952060"
                                target="_blank" rel="noopener noreferrer"
                                onClick={() =>
                                    trackEvent('join_click', {
                                        location: 'home_join',
                                        locale,
                                    })
                                }
                                className="btn-primary inline-flex items-center justify-center"
                            >
                                {copy.join_cta}
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* ===== TRAINING LIBRARY TEASER ===== */}
                <section className="relative py-16 border-t border-white/5" style={{ background: '#060b1e' }}>
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-2xl border border-cyan-500/25 p-8 md:p-12 text-center"
                            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(15,23,42,0.8))' }}
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10,9 9,9 8,9" />
                                </svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {locale === 'es' ? 'Biblioteca de Entrenamiento' : 
                                 locale === 'fr' ? 'Bibliothèque de Formation' :
                                 locale === 'pt' ? 'Biblioteca de Treinamento' : 
                                 'Training Library'}
                            </h3>
                            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                                {locale === 'es' ? 'Accede a guías exclusivas, entrenamientos de productos y recursos para distribuidores que te ayudarán a construir tu negocio True Legacy.' :
                                 locale === 'fr' ? 'Accédez à des guides exclusifs, des formations produits et des ressources distributeurs qui vous aideront à construire votre entreprise True Legacy.' :
                                 locale === 'pt' ? 'Acesse guias exclusivos, treinamentos de produtos e recursos para distribuidores que ajudarão você a construir seu negócio True Legacy.' :
                                 'Access exclusive guides, product trainings, and distributor resources that will help you build your True Legacy business.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/training"
                                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-semibold text-white transition-all hover:scale-[1.02] hover:-translate-y-0.5"
                                    style={{
                                        background: 'linear-gradient(135deg, #1B5A8C, #1e88e5)',
                                        boxShadow: '0 2px 8px rgba(27, 90, 140, 0.2)',
                                    }}
                                >
                                    {locale === 'es' ? 'Acceso a Distribuidores' :
                                     locale === 'fr' ? 'Accès Distributeurs' :
                                     locale === 'pt' ? 'Acesso a Distribuidores' :
                                     'Distributor Login'}
                                </Link>
                                <Link
                                    to="/training#pdf-guides"
                                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-semibold text-cyan-300 border border-cyan-500/30 transition-all hover:bg-cyan-500/10 hover:-translate-y-0.5"
                                >
                                    {locale === 'es' ? 'Guías de Productos' :
                                     locale === 'fr' ? 'Guides Produits' :
                                     locale === 'pt' ? 'Guias de Produtos' :
                                     'Product Guides'}
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ===== ALL PRODUCTS ===== */}
                <ProductSection
                    productIds={['k8', 'sd501', 'sd501_super', 'sd501_dx', 'anespa_dx', 'emguarde', 'ukon_sigma', 'kangen_wagyu', 'kangen_air']}
                    variant="homeAll"
                />

            </main>

            {/* Sticky mobile CTA — visible after hero, hidden at footer */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden transition-transform duration-300 ${
                    stickyCtaVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ background: 'linear-gradient(to top, rgba(6,11,30,0.98), transparent)' }}
            >
                <a
                    href="https://form.jotform.com/260232994952060"
                    target="_blank" rel="noopener noreferrer"
                    onClick={() =>
                        trackEvent('join_click', {
                            location: 'home_join_sticky',
                            locale,
                        })
                    }
                    className="btn-primary flex items-center justify-center w-full"
                >
                    {copy.join_cta}
                </a>
            </div>

            <div ref={footerRef}><Footer /></div>
        </div>
    )
}
