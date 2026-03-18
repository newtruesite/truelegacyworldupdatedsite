import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Shield, ExternalLink, Download, Play, CheckCircle, Zap, Battery, Globe } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { COUNTRIES } from '@/lib/countries'
import { t } from '@/lib/translations'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { getWhatsAppLink } from '@/config/contactLinks'
import { SEO } from '@/components/SEO'

const FEATURES_EN = [
    { icon: Shield, text: '26 FT diameter EMF coverage' },
    { icon: Zap, text: 'Neutralizes EMF up to 1000 MHz' },
    { icon: CheckCircle, text: 'Measurable effectiveness in real time' },
    { icon: Battery, text: 'No batteries or maintenance required' },
    { icon: Globe, text: 'Safe for homes, offices, cars & airplanes' },
]
const FEATURES_ES = [
    { icon: Shield, text: 'Cobertura EMF de 26 pies de diámetro' },
    { icon: Zap, text: 'Neutraliza EMF hasta 1000 MHz' },
    { icon: CheckCircle, text: 'Efectividad medible en tiempo real' },
    { icon: Battery, text: 'Sin pilas ni mantenimiento' },
    { icon: Globe, text: 'Seguro para hogares, oficinas, autos y aviones' },
]

const EMF_STATS = [
    { pct: '71%', labelEn: 'report sleep problems', labelEs: 'reportan problemas de sueño' },
    { pct: '64%', labelEn: 'experience fatigue', labelEs: 'experimentan fatiga' },
    { pct: '61%', labelEn: 'have cognitive difficulties', labelEs: 'tienen dificultades cognitivas' },
    { pct: '60%', labelEn: 'feel stress & anxiety', labelEs: 'sienten estrés y ansiedad' },
]

export default function EmGuardePage() {
    const { countrySlug } = useParams<{ countrySlug: string }>()
    const country = COUNTRIES.find((c) => c.slug === countrySlug) ?? COUNTRIES.find((c) => c.slug === 'usa')!
    const { locale } = useLocaleContext()
    const copy = t[locale]
    const jotformUrl = country.jotformUrl ?? 'https://form.jotform.com/260232994952060'
    const isSpanish = locale === 'es'
    const isLatamCountry = ['mexico', 'brazil', 'colombia', 'paraguay'].includes(countrySlug ?? '')
    const FEATURES = isSpanish ? FEATURES_ES : FEATURES_EN

    const [heroImgError, setHeroImgError] = useState(false)

    return (
        <div className="page-wrapper bg-[#070b16]">
            <SEO 
                title={`emGuarde EMF Protection Technology | True Legacy ${country.name}`}
                description="emGuarde by Enagic neutralizes harmful EMF radiation up to 1000 MHz within a 26-foot radius. Protect your home and office today."
                image="/products/emguarde.png"
            />
            <Navbar />

            <AuroraBackground className="pt-28 pb-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16 pt-8"
                    >
                        <span className="inline-block mb-4 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-400">
                            {copy.emguarde.badge}
                        </span>
                        <h1 className="page-hero-title mb-6">
                            {copy.emguarde.headline}<br />
                            <span className="gradient-text">{copy.emguarde.headlineAccent}</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg md:text-xl text-slate-400 leading-relaxed mb-8">
                            {copy.emguarde.sub}
                        </p>
                        
                        {/* VSL-style video embed */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="max-w-4xl mx-auto mb-8"
                        >
                            <YouTubeEmbed 
                                url={isLatamCountry ? "https://www.youtube.com/watch?v=VFjtegRuzfQ" : "https://youtu.be/I8fFj7-FaPw?si=Rw9aEsxSN9iiy1iq"}
                                title="emGuarde EMF Protection Technology"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Product Visual + Features Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="glass rounded-3xl border border-white/10 p-10 flex items-center justify-center min-h-[350px] bg-black/20"
                        >
                            <div className="text-center w-full">
                                {!heroImgError ? (
                                    <img
                                        src="/products/emguarde.png"
                                        alt="Emguarde EMF protection device — Enagic technology"
                                        className="max-h-[280px] w-auto max-w-[600px] object-contain mx-auto mb-4 w-full md:max-w-[600px]"
                                        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
                                        loading="lazy"
                                        onError={(e) => {
                                            const t = e.currentTarget
                                            if (t.src.includes('emguarde')) {
                                                t.src = '/products/emguarde.png'
                                                t.onerror = () => setHeroImgError(true)
                                            } else setHeroImgError(true)
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                                        <div className="w-24 h-24 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                            <Shield className="w-12 h-12 text-purple-400" />
                                        </div>
                                        <span className="text-white font-bold text-xl">emGuarde™</span>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-white mb-2">emGuarde™</h3>
                                <p className="text-slate-400 text-sm">{isSpanish ? 'Solo 430g — Discreto y potente' : 'Only 430g — Discreet & Powerful'}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">{copy.emguarde.featuresTitle}</h2>
                            {FEATURES.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-4 glass rounded-xl border border-white/10 p-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-slate-200 font-medium">{text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* The Unseen Side Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass rounded-3xl border border-white/10 p-8 md:p-12 mb-16"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            {copy.emguarde.statsTitle}
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-10">
                            {copy.emguarde.statsSub}
                        </p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {EMF_STATS.map(({ pct, labelEn, labelEs }) => (
                                <div key={pct} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">{pct}</div>
                                    <div className="text-sm text-slate-400">{isSpanish ? labelEs : labelEn}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-600 mt-6 text-center">{isSpanish ? 'Fuente: EMF Safety Network – Estudio 2019' : 'Source: EMF Safety Network – 2019 Study'}</p>
                    </motion.div>

                    {/* CTA Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                    >
                        <a
                            href="https://www.enagic.com/en_US/product-certifications"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                        >
                            <CheckCircle className="w-4 h-4 text-green-400" /> {copy.emguarde.certifications}
                        </a>
                        <a
                            href={isLatamCountry ? "https://www.youtube.com/watch?v=VFjtegRuzfQ" : "https://youtu.be/I8fFj7-FaPw?si=Rw9aEsxSN9iiy1iq"}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-red-600/80 hover:bg-red-600 px-6 py-4 text-sm font-semibold text-white transition-all"
                        >
                            <Play className="w-4 h-4" /> {copy.emguarde.watchVideo}
                        </a>
                        <a
                            href="https://emguarde.com/"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-sm font-semibold text-white hover:scale-105 transition-all"
                        >
                            <ExternalLink className="w-4 h-4" /> {copy.emguarde.learnMore}
                        </a>
                        <Link
                            to={countrySlug ? `/${countrySlug}/training` : '/training'}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all min-h-[48px] hover:scale-[1.02]"
                        >
                            <Download className="w-4 h-4 text-cyan-400" /> {copy.emguarde.downloadPdf}
                        </Link>
                        <a
                            href={getWhatsAppLink(countrySlug, "Hi! I'm interested in the emGuarde EMF protection.")}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-transparent px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all min-h-[48px] hover:scale-[1.02] col-span-1 sm:col-span-2 lg:col-span-1"
                        >
                            {isSpanish ? 'Hablar con distribuidor' : locale === 'fr' ? 'Parler à un distributeur' : locale === 'pt' ? 'Falar com distribuidor' : 'Talk to a distributor'}
                        </a>
                    </motion.div>

                    {/* CTA button above back link */}
                    <div className="text-center mb-8">
                        <a
                            href={jotformUrl}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105"
                        >
                            {copy.unlockLegacy}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                    </div>

                    {/* Back */}
                    <div className="text-center pb-16">
                        <Link
                            to={`/${countrySlug}`}
                            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            {copy.emguarde.backLink} {country.name}
                        </Link>
                    </div>
                </div>
            </AuroraBackground>

            <Footer />
        </div>
    )
}
