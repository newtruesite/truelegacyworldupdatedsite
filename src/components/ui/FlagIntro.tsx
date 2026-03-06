import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Country } from '@/lib/countries'
import { getFlagImageUrl } from '@/lib/countries'

interface FlagIntroProps {
    country: Country
}

export function FlagIntro({ country }: FlagIntroProps) {
    const [flagFailed, setFlagFailed] = useState(false)
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Animated flag drop with subtle ruffle */}
            <motion.div
                initial={{ y: -80, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 18,
                    delay: 0.1,
                }}
                className="mb-6 relative"
            >
                <motion.div
                    className="relative w-40 h-28 md:w-48 md:h-32 rounded-md overflow-hidden border border-white/20 bg-[#0a2060]"
                    animate={{ skewX: [-2, 2, -2], y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        boxShadow: '0 0 40px rgba(6,182,212,0.4)',
                        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.08), transparent 45%, rgba(15,118,210,0.5) 80%)',
                    }}
                >
                    {/* Country flag — image with emoji fallback */}
                    {flagFailed ? (
                        <motion.div
                            className="flex h-full w-full items-center justify-center text-6xl md:text-7xl select-none"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            role="img"
                            aria-label={`Flag of ${country.name}`}
                        >
                            {country.flagEmoji || country.flag || '🏳️'}
                        </motion.div>
                    ) : (
                        <img
                            src={getFlagImageUrl(country.slug, 160)}
                            alt={`Flag of ${country.name}`}
                            className="h-full w-full object-cover"
                            onError={() => setFlagFailed(true)}
                        />
                    )}
                    {/* flag pole */}
                    <div className="absolute -left-2 top-0 h-full w-1 bg-gradient-to-b from-slate-100 via-slate-400 to-slate-700" />
                </motion.div>
                {/* Glow ring — centered so it doesn't affect layout */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="absolute left-1/2 top-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-xl pointer-events-none"
                />
            </motion.div>

            {/* Country name reveal — only the animated flowing flag above, no duplicate */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                    True Legacy World — {country.region}
                </p>
                <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                    {country.locale === 'es'
                        ? `Bienvenido a ${country.nativeName}`
                        : `Welcome to ${country.name}`}
                </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-6 h-0.5 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
        </div>
    )
}
