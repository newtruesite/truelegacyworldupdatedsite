import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { COUNTRIES, getFlagSrcSet } from '@/lib/countries'
import { REGIONS } from '@/components/ui/RegionMap'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'

// Map the URL region IDs back to the string names used in the COUNTRIES array
const regionIdToName: Record<string, string> = {
    'north-america': 'North America',
    'latin-america': 'Latin America',
    'africa': 'Africa',
    'asia': 'Asia',
}

export default function RegionPage() {
    const { regionId } = useParams<{ regionId: string }>()
    const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())
    const { locale, setLocale } = useLocaleContext()

    if (!regionId || !regionIdToName[regionId]) {
        // If an invalid region is typed in the URL, redirect home
        return <Navigate to="/" replace />
    }

    const regionName = regionIdToName[regionId]
    const regionInfo = REGIONS.find(r => r.id === regionId)

    // Filter countries to only show those in the selected region
    const regionCountries = COUNTRIES.filter(c => c.region === regionName)

    return (
        <div className="page-wrapper bg-[#070b16]">
            <Navbar />

            <main className="flex-grow pt-28 pb-16">
                <AuroraBackground className="min-h-[80vh] py-12">
                    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                        {/* Header and Back Button */}
                        <div className="mb-12">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {locale === 'es'
                                    ? 'Volver al mapa global'
                                    : locale === 'fr'
                                    ? 'Retour à la carte globale'
                                    : 'Back to Global Map'}
                            </Link>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-block mb-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                                    {locale === 'es'
                                        ? 'Selecciona tu región'
                                        : locale === 'fr'
                                        ? 'Sélectionnez votre région'
                                        : 'Region Selection'}
                                </span>
                                <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight">
                                    <span className="gradient-text">{regionName}</span>
                                </h1>
                                <p className="mt-4 text-xl text-slate-400 max-w-2xl">
                                    {locale === 'es'
                                        ? 'Elige un país para ver el plano True Legacy dedicado a tu mercado.'
                                        : locale === 'fr'
                                        ? 'Choisissez un pays ci‑dessous pour voir le plan True Legacy dédié à votre marché.'
                                        : 'Select a hub below to view the dedicated True Legacy blueprint for your selected country.'}
                                </p>
                            </motion.div>
                        </div>

                        {/* High-Definition Country Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {regionCountries.map((country, index) => (
                                <motion.div
                                    key={country.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link
                                        to={`/${country.slug}`}
                                        onClick={() => {
                                            if (regionId === 'latin-america') {
                                                setLocale('es')
                                            }
                                        }}
                                        className="group block relative overflow-hidden rounded-2xl glass border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* FLAG BOX — full flag visible on mobile (aspect ratio), retina srcset */}
                                        <div className="relative w-full aspect-[4/3] min-h-[120px] rounded-xl overflow-hidden border border-white/20 bg-[#0a2060] mb-4 flex items-center justify-center">
                                            {failedFlagSlugs.has(country.slug) ? (
                                                <motion.div
                                                    animate={{ x: [0, 2, -2, 2, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                                    className="text-6xl select-none"
                                                    role="img"
                                                    aria-label={`Flag of ${country.name}`}
                                                >
                                                    {country.flagEmoji || country.flag || '🏳️'}
                                                </motion.div>
                                            ) : (
                                                <img
                                                    {...getFlagSrcSet(country.slug)}
                                                    alt={`${country.name} flag — True Legacy World`}
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                    decoding="async"
                                                    onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(country.slug))}
                                                />
                                            )}
                                        </div>

                                        {/* COUNTRY NAME */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                    {country.name}
                                                </h3>
                                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                    {country.nativeName}
                                                </span>
                                            </div>
                                            <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-all flex-shrink-0">
                                                <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* hover glow */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-cyan-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {regionCountries.length === 0 && (
                            <div className="text-center py-20 glass rounded-2xl border border-white/10">
                                <p className="text-xl text-slate-400">More countries in {regionName} coming soon!</p>
                            </div>
                        )}
                    </div>
                </AuroraBackground>
            </main>
            <Footer />
        </div>
    )
}
