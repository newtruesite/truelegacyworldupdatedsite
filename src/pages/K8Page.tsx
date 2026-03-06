import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Droplets, ExternalLink, Download, Play, CheckCircle, Layers, Cpu, Globe } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { COUNTRIES } from '@/lib/countries'
import { t } from '@/lib/translations'

const K8_PDF_URL = 'https://www.truelegacyworld.com/_files/ugd/7b12be_e690ffee275f44b887f409eac751f9dc.pdf'

const FEATURES_EN = [
    { icon: Layers, text: '8 Platinum-Coated Titanium Plates' },
    { icon: Globe, text: 'Multi-voltage for international use' },
    { icon: Cpu, text: 'Intuitive interface & automated settings' },
    { icon: CheckCircle, text: 'Energy-efficient design' },
    { icon: Droplets, text: '5 distinct types of ionized water' },
]
const FEATURES_ES = [
    { icon: Layers, text: '8 placas de titanio recubiertas de platino' },
    { icon: Globe, text: 'Multivoltaje para uso internacional' },
    { icon: Cpu, text: 'Interfaz intuitiva y ajustes automáticos' },
    { icon: CheckCircle, text: 'Diseño energéticamente eficiente' },
    { icon: Droplets, text: '5 tipos distintos de agua ionizada' },
]

export default function K8Page() {
    const { countrySlug } = useParams<{ countrySlug: string }>()
    const country = COUNTRIES.find((c) => c.slug === countrySlug) ?? COUNTRIES.find((c) => c.slug === 'usa')!
    const locale = country.locale ?? 'en'
    const copy = t[locale]
    const jotformUrl = country.jotformUrl ?? 'https://form.jotform.com/260232994952060'
    const isSpanish = locale === 'es'
    const FEATURES = isSpanish ? FEATURES_ES : FEATURES_EN

    const [pdfEmail, setPdfEmail] = useState('')
    const [pdfUnlocked, setPdfUnlocked] = useState(false)
    const [showPdfForm, setShowPdfForm] = useState(false)
    const [heroImgError, setHeroImgError] = useState(false)

    const handlePdfSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pdfEmail.trim()) {
            setPdfUnlocked(true)
            setShowPdfForm(false)
            window.open(K8_PDF_URL, '_blank')
        }
    }

    return (
        <div className="min-h-screen bg-[#070b16]">
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
                        <span className="inline-block mb-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                            {copy.k8.badge}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                            {copy.k8.headline}<br />
                            <span className="gradient-text">{copy.k8.headlineAccent}</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg md:text-xl text-slate-400 leading-relaxed">
                            {copy.k8.sub}
                        </p>
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
                                        src="/products/k8.png"
                                        alt="Leveluk K8 Kangen Water machine"
                                        className="max-h-[280px] w-auto object-contain mx-auto mb-4"
                                        onError={() => setHeroImgError(true)}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                                        <div className="w-24 h-24 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                                            <Droplets className="w-12 h-12 text-cyan-400" />
                                        </div>
                                        <span className="text-white font-bold text-xl">Leveluk K8</span>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-white mb-2">Leveluk K8</h3>
                                <p className="text-slate-400 text-sm">{FEATURES[0].text}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">{copy.k8.featuresTitle}</h2>
                            {FEATURES.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-4 glass rounded-xl border border-white/10 p-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <span className="text-slate-200 font-medium">{text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* 5 Water Types */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                            {copy.k8.waterTypesTitle}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {copy.waterTypes.map(({ name, use, color }, i) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass rounded-2xl border border-white/10 overflow-hidden"
                                >
                                    <div className={`h-2 bg-gradient-to-r ${color}`} />
                                    <div className="p-5">
                                        <h4 className="font-bold text-white text-sm mb-2">{name}</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">{use}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 8 Plates Callout */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass rounded-3xl border border-cyan-500/20 p-8 md:p-12 mb-16 text-center"
                    >
                        <div className="text-6xl font-black gradient-text mb-4">8</div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{copy.k8.titaniumTitle}</h3>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            {copy.k8.titaniumSub}
                        </p>
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
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                        >
                            <CheckCircle className="w-4 h-4 text-green-400" /> {copy.k8.certifications}
                        </a>
                        <a
                            href="https://youtu.be/Lm2DYOwU2rc?si=qSI-i8XX8EOv6ZUC"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-red-600/80 hover:bg-red-600 px-6 py-4 text-sm font-semibold text-white transition-all"
                        >
                            <Play className="w-4 h-4" /> {copy.k8.watchVideo}
                        </a>
                        <a
                            href="https://www.enagic.com/en_US/products/leveluk-k8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 text-sm font-semibold text-white hover:scale-105 transition-all"
                        >
                            <ExternalLink className="w-4 h-4" /> {copy.k8.learnMore}
                        </a>
                        {pdfUnlocked ? (
                            <a
                                href={K8_PDF_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                            >
                                <Download className="w-4 h-4 text-cyan-400" /> {copy.k8.downloadPdf}
                            </a>
                        ) : showPdfForm ? (
                            <form onSubmit={handlePdfSubmit} className="flex flex-col sm:flex-row gap-2 rounded-2xl border border-cyan-500/30 bg-white/5 p-3">
                                <input
                                    type="email"
                                    value={pdfEmail}
                                    onChange={(e) => setPdfEmail(e.target.value)}
                                    placeholder={isSpanish ? 'Tu correo electrónico' : 'Your email address'}
                                    required
                                    className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                                />
                                <button type="submit" className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition-all">
                                    {isSpanish ? 'Enviar' : 'Submit'}
                                </button>
                            </form>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowPdfForm(true)}
                                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                            >
                                <Download className="w-4 h-4 text-cyan-400" /> {copy.k8.downloadPdf}
                            </button>
                        )}
                    </motion.div>

                    {/* CTA button above back link */}
                    <div className="text-center mb-8">
                        <a
                            href={jotformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
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
                            {copy.k8.backLink} {country.name}
                        </Link>
                    </div>
                </div>
            </AuroraBackground>

            <Footer />
        </div>
    )
}
