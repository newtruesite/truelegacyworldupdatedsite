import React from 'react'
import { motion } from 'framer-motion'
import { Droplets, Zap, Shield, Leaf, Radio, Battery, Wifi, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'


const KANGEN_ITEMS = [
    {
        icon: Droplets,
        title: 'Deep Cellular Hydration',
        description:
            "Kangen water's micro-clustered molecules penetrate cell walls 6x more effectively than tap water, hydrating you at a cellular level.",
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        span: 'col-span-2',
    },
    {
        icon: Zap,
        title: 'Powerful Antioxidant',
        description:
            'With a negative ORP (Oxidation Reduction Potential), Kangen water neutralizes harmful free radicals — the root cause of aging and disease.',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        span: 'col-span-1',
    },
    {
        icon: Leaf,
        title: 'Alkaline pH Balance',
        description:
            "Disease thrives in acidity. Kangen water's pH 8.5–9.5 alkali range restores your body's natural balance and boosts energy.",
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        span: 'col-span-1',
    },
    {
        icon: Shield,
        title: 'Certified by 6,500 Hospitals',
        description:
            "Enagic's Kangen machines are the only water ionizers certified as medical devices by the Japanese Ministry of Health.",
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        span: 'col-span-2',
    },
]

const EMGUARDE_ITEMS = [
    {
        icon: Shield,
        title: '8-Meter Protection Radius',
        description:
            'emGuarde harmonizes electromagnetic noise radiation within a full 8-meter diameter — covering your home, office, or car.',
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        span: 'col-span-1',
    },
    {
        icon: Radio,
        title: 'Frequency-Targeted Defense',
        description:
            'Patented technology suppresses harmful EMF frequencies between 3MHz–1000GHz — the range emitted by phones, WiFi, and 5G.',
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        span: 'col-span-2',
    },
    {
        icon: Wifi,
        title: 'No WiFi Interference',
        description:
            'Unlike faraday cages, emGuarde harmonizes EMF without blocking signals. Your internet stays fast while your health stays protected.',
        color: 'text-teal-400',
        bg: 'bg-teal-400/10',
        span: 'col-span-1',
    },
    {
        icon: Battery,
        title: 'Ultra-Low Power (0.5W)',
        description:
            'Runs on just 0.5W via USB. Lightweight (430g) and portable — use it anywhere. Always-on 24/7 silent protection.',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        span: 'col-span-1',
    },
    {
        icon: Clock,
        title: '24/7 Silent Operation',
        description:
            'No noise, no maintenance, no interruption. emGuarde works continuously in the background, protecting your environment around the clock.',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        span: 'col-span-1',
    },
]

interface BentoItemProps {
    icon: React.ElementType
    title: string
    description: string
    color: string
    bg: string
    span?: string
}

function BentoItem({ icon: Icon, title, description, color, bg, span = 'col-span-1' }: BentoItemProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={cn(
                'glass rounded-2xl border border-white/10 border-t-2 border-t-[#F5A623] p-6 group cursor-default hover:border-white/20 hover:shadow-lg transition-all duration-150',
                span
            )}
        >
            <div className={cn('mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl', bg)}>
                <Icon className={cn('h-6 w-6', color)} />
            </div>
            <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </motion.div>
    )
}

export function BentoGrid() {
    return (
        <section className="py-24" id="products">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Kangen Water */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="mb-3">
                        <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-400">
                            Kangen Water by Enagic
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                        The Water That{' '}
                        <span className="gradient-text">Everyday Product Education</span>
                    </h2>
                    <p className="mb-10 max-w-2xl text-slate-400 text-lg">
                        Not all water is the same. Medical-grade Kangen water is restructured at a molecular level to deliver antioxidants, alkalinity, and deep hydration your body has been craving.
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {KANGEN_ITEMS.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={cn(
                                    i === 0 || i === 3 ? 'lg:col-span-2' : 'lg:col-span-1'
                                )}
                            >
                                <BentoItem {...item} span="" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* emGuarde */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-3">
                        <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
                            emGuarde Technology
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                        Shield Your Life from{' '}
                        <span className="gradient-text">Invisible Radiation</span>
                    </h2>
                    <p className="mb-10 max-w-2xl text-slate-400 text-lg">
                        Every device around you emits electromagnetic noise. emGuarde's patented technology harmonizes those frequencies — protecting your family 24/7 without blocking your WiFi.
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {EMGUARDE_ITEMS.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={cn(
                                    i === 1 ? 'lg:col-span-2' : 'lg:col-span-1'
                                )}
                            >
                                <BentoItem {...item} span="" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
