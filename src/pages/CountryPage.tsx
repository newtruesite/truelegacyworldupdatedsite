import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TLBackground } from '@/components/ui/TLBackground'
import { FlagIntro } from '@/components/ui/FlagIntro'
import { VSLPlayer } from '@/components/ui/VSLPlayer'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TestimonialsSplit } from '@/components/ui/split-testimonial'
import { COUNTRIES, getCountryBySlug, getFlagImageUrl } from '@/lib/countries'
import type { Country } from '@/lib/countries'
import { t } from '@/lib/translations'

// ── Custom SVG Icons (no emojis) ──────────────────────────────
function IconArrow({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    )
}
function IconYoutube({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
        </svg>
    )
}
function IconInstagram({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    )
}
function IconFacebook({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )
}
function IconWhatsapp({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    )
}
function IconShield({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
}
function IconDroplet({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
    )
}
function IconStar({ size = 14, filled = false }: { size?: number; filled?: boolean }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#F5A623' : 'none'} stroke="#F5A623" strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}
function IconUsers({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
function IconCheck({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
function IconDollar({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
function IconGlobe({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
function IconTrendingUp({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}

const IMG_WRAPPER_CLASS = 'rounded-[1.5rem] overflow-hidden border-[2px] border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]'

// ── Per-country leaders ─────────────────────────────────────
const COUNTRY_LEADERS: Record<string, Array<{ name: string; role: string; image: string; intro: string; instagram?: string }>> = {
    usa: [
        {
            name: 'Coach Mehdi',
            role: 'Global Founder & Market Builder',
            image: '/leaders/mehdi-hero.png',
            intro: 'After 24 years in the U.S., Mehdi expanded into Morocco and Colombia — mentoring leaders who want to build intentional, flexible lives with Enagic.',
            instagram: 'https://www.instagram.com/mehdicohen_/',
        },
        {
            name: 'Coach Zah',
            role: 'Elite Performance & Leadership Coach',
            image: '/leaders/zah-hero.png',
            intro: 'From coaching elite performers to guiding entrepreneurs, Zah brings performance, leadership, and leverage together to build generational legacy.',
            instagram: 'https://www.instagram.com/zahphysique/',
        },
    ],
    canada: [
        {
            name: 'Coach Zah',
            role: 'Elite Performance & Leadership Coach',
            image: '/leaders/zah-hero.png',
            intro: 'Supporting Canadian leaders who want to combine world-class performance with long-term financial freedom through True Legacy.',
            instagram: 'https://www.instagram.com/zahphysique/',
        },
    ],
    morocco: [
        {
            name: 'Coach Mehdi',
            role: 'Regional Expansion · Morocco',
            image: '/leaders/mehdi-hero.png',
            intro: 'Helping open new markets in North Africa while mentoring leaders who want to build with purpose and long-term vision.',
            instagram: 'https://www.instagram.com/mehdicohen_/',
        },
    ],
    nigeria: [
        {
            name: 'Coach Simon Loh',
            role: 'Global Entrepreneur & Strategist',
            image: '/leaders/simon-hero.png',
            intro: 'Supporting expansion into Nigeria and beyond, helping leaders apply disciplined, proven business strategies in fast-growing markets.',
            instagram: 'https://www.instagram.com/simonloh_/',
        },
    ],
    colombia: [
        {
            name: 'Coach Mehdi',
            role: 'Regional Expansion · Colombia',
            image: '/leaders/mehdi-hero.png',
            intro: 'Leading the launch of new LATAM markets from Colombia, uniting health, leadership, and long-term opportunity.',
            instagram: 'https://www.instagram.com/mehdicohen_/',
        },
        {
            name: 'Coach Magaly',
            role: 'Coach & Impact-Driven Entrepreneur',
            image: '/leaders/magaly-hero.png',
            intro: 'Helping Spanish-speaking leaders build businesses that align with their values, health, and families across Latin America.',
            instagram: 'https://www.instagram.com/mcardonita/',
        },
    ],
    brazil: [
        {
            name: 'Coach Ming Way',
            role: 'Business Builder & Mentor',
            image: '/leaders/mingway-hero.png',
            intro: 'Partnering with Brazilian leaders who want to build disciplined, sustainable businesses that create long-term legacy.',
            instagram: 'https://www.instagram.com/mingwaysia/',
        },
    ],
    mexico: [
        {
            name: 'Coach Zah',
            role: 'Elite Performance & Leadership Coach',
            image: '/leaders/zah-hero.png',
            intro: 'Bringing a decade of high-performance coaching to help leaders in Mexico build strong wellness businesses with Enagic.',
            instagram: 'https://www.instagram.com/zahphysique/',
        },
    ],
    paraguay: [
        {
            name: 'Coach Magaly',
            role: 'Coach & Impact-Driven Entrepreneur',
            image: '/leaders/magaly-hero.png',
            intro: 'Supporting leaders in Paraguay and across LATAM who want to build more intentional, family-centered financial futures.',
            instagram: 'https://www.instagram.com/mcardonita/',
        },
    ],
}

function getContent(country: Country) {
    const es = country.locale === 'es'
    return {
        headline: es ? `Salud Verdadera. Riqueza Real. ${country.nativeName}.` : `True Health. Real Wealth. ${country.name}.`,
        sub: es
            ? 'True Legacy es un equipo global de coaches que comparten Agua Kangen y emGuarde — dos de las tecnologías de bienestar más comentadas. No solo vendemos productos; construimos líderes.'
            : 'True Legacy is a global team of coaches sharing Kangen Water and emGuarde — two of the most talked-about wellness technologies on the market. We don\'t just sell products. We build leaders.',
        watchLabel: es ? 'Mira el Video Completo' : 'Watch the Full Blueprint',
        vslTitle: es ? `Blueprint de True Legacy — ${country.nativeName}` : `True Legacy Blueprint — ${country.name}`,
        ctaHeadline: es ? '¿Listo para construir tu legado con nosotros?' : 'Ready to build your legacy with us?',
        ctaDesc: es ? 'Miles de líderes ya están transformando vidas. Tu oportunidad comienza aquí.' : 'Thousands of leaders worldwide are already building their legacy. Your opportunity starts here.',
        points: es
            ? ['Agua Kangen de grado médico para tu salud', 'Protección EMF con emGuarde 24/7', 'Plan de compensación de 8 niveles', 'Comunidad global de líderes y mentores']
            : ['Medical-grade Kangen Water for real health', 'EMF protection with emGuarde 24/7', '8-tier compensation plan for global income', 'Global community of leaders and mentors'],
        joinBtn: es ? 'Empieza Ahora' : 'Take the Lead',
        communityBtn: es ? 'Comunidad de Facebook' : 'Join the Facebook Community',
        productsLabel: es ? 'Nuestros Productos' : 'Our Products',
        productsSub: es ? 'Tecnología de bienestar que funciona' : 'Wellness Technology That Works',
        leadersLabel: es ? 'Líderes en' : 'Leaders Building True Legacy in',
        testimonialStripQuote: es ? 'Con trabajo duro, enfoque y fe, recuperé la estabilidad financiera y descubrí un nuevo sentido de propósito. Este negocio me devolvió la esperanza.' : 'Through hard work, focus, and faith, I was able to regain financial stability and discover a new sense of purpose. This business gave me back hope.',
        testimonialStripName: 'Nigara Ismailova',
        testimonialStripRole: es ? 'Líder True Legacy' : 'True Legacy Leader',
        socialProofLeaders: es ? 'Líderes en 3 continentes' : 'Leaders across 3 continents',
        socialProofCountries: es ? 'Más de 45 países activos' : '45+ countries active',
        socialProofEnagic: es ? 'Red distribuidor certificado Enagic' : 'Enagic certified distributor network',
        joinCommunity: es ? 'Únete a la comunidad' : 'Join the Community',
        testimonialsLabel: es ? 'Lo Que Dicen' : 'What Our Leaders Are Saying',
        globalLabel: es ? 'También disponible en' : 'Also available in',
        ytHandle: es ? '@TrueLegacyLATAM' : '@TrueLegacyWorld',
        seeMore: es ? 'Explorar la tecnología' : 'Explore the Technology',
        getPaidHeadline: es ? 'Cobra por compartir productos que sanan' : 'Get Paid to Share World-Healing Products',
        getPaidSub: es ? 'No es solo bienestar. Es un negocio construido sobre productos que realmente cambian vidas.' : "This isn't just wellness. It's a business built on products that actually change lives.",
        getPaidCard1Title: es ? 'Ingresos reales. Productos reales.' : 'Real Income. Real Products.',
        getPaidCard1Desc: es ? 'Ganas compartiendo máquinas Kangen Water y dispositivos emGuarde — productos que la gente recompra, recomienda y recomienda. Sin ventas frías. Solo bienestar genuino que se vende solo.' : 'You earn by sharing Kangen Water machines and emGuarde devices — products people reorder, recommend, and rave about. No cold pitching. No fake hype. Just genuine wellness that sells itself.',
        getPaidCard2Title: es ? 'Mercado global. Alcance ilimitado.' : 'Global Market. Unlimited Reach.',
        getPaidCard2Desc: es ? 'True Legacy opera en Norteamérica, Latinoamérica y África. Al unirte, te conectas a una red internacional con sistemas probados — tu potencial de ingresos no tiene fronteras.' : 'True Legacy operates across North America, Latin America, and Africa. When you join, you plug into an international network with proven systems already in place — your income potential has no borders.',
        getPaidCard3Title: es ? 'Plan de compensación de 8 puntos de Enagic' : "Enagic's 8-Point Compensation Plan",
        getPaidCard3Desc: es ? 'Enagic paga hasta 8 puntos de comisión directos por venta — puedes ganar con cada máquina vendida en tu red, no solo tus ventas directas. Así es como los líderes construyen riqueza generacional.' : "Enagic pays up to 8 direct commission points per sale — meaning you can earn on every machine sold within your network, not just your direct sales. This is how leaders build generational wealth.",
        getPaidCtaHeadline: es ? '¿Listo para construir tu legado?' : 'Ready to build your legacy?',
        getPaidCtaDesc: es ? 'Únete a coaches en 3 continentes que ganan mientras sanan el mundo. No se necesita experiencia — solo la voluntad de liderar.' : 'Join coaches across 3 continents who are earning while healing the world. No experience needed — just the willingness to lead.',
        getPaidCtaBtn: es ? 'Comienza tu camino' : 'Start Your Journey',
    }
}

const DEFAULT_JOTFORM = 'https://form.jotform.com/260232994952060'

export default function CountryPage() {
    const { country: slug } = useParams<{ country: string }>()
    const [k8ImgError, setK8ImgError] = useState(false)
    const [emguardeImgError, setEmguardeImgError] = useState(false)
    const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())
    const country = getCountryBySlug(slug || '')
    if (!country) return <Navigate to="/" replace />

    const locale = country.locale ?? 'en'
    const jotformUrl = country.jotformUrl ?? DEFAULT_JOTFORM
    const copy = t[locale]
    const c = getContent(country)

    return (
        <div className="min-h-screen" style={{ background: '#060b1e' }}>
            <Navbar />

            {/* ===== HERO (TL background style) ===== */}
            <TLBackground className="min-h-screen pt-20 pb-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
                    <FlagIntro country={country} />
                    <p className="text-center text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-4 font-light leading-relaxed">
                        {copy.heroSub}
                    </p>

                    {/* Video + CTA grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] items-start pb-20">

                        {/* VSL */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.8 }}
                        >
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                                {c.watchLabel}
                            </p>
                            <div className={IMG_WRAPPER_CLASS}>
                                <VSLPlayer youtubeId={country.youtubeId} title={c.vslTitle} />
                            </div>
                        </motion.div>

                        {/* CTA Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 1.0 }}
                            className="rounded-3xl border border-white/10 p-6 md:p-8"
                            style={{ background: 'rgba(5,16,48,0.6)', backdropFilter: 'blur(24px)' }}
                        >
                            <h2 className="text-2xl md:text-3xl text-white mb-3 leading-tight font-display font-bold">
                                {c.ctaHeadline}
                            </h2>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">{c.ctaDesc}</p>

                            {/* Points */}
                            <ul className="space-y-2.5 mb-6">
                                {c.points.map((point) => (
                                    <li key={point} className="flex items-start gap-3 text-sm text-slate-300">
                                        <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#1B3A8C]/30 flex items-center justify-center text-blue-400">
                                            <IconCheck size={11} />
                                        </span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Primary CTA */}
                            <a
                                href={jotformUrl}
                                target="_blank" rel="noopener noreferrer"
                                className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white transition-all hover:scale-105 shadow-lg shadow-yellow-500/25"
                                style={{
                                    background: 'linear-gradient(135deg, #1B3A8C 0%, #1e6fc0 100%)',
                                    boxShadow: '0 8px 32px rgba(27,58,140,0.4)',
                                }}
                            >
                                {copy.unlockLegacy} <IconArrow size={18} />
                            </a>

                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/18649072149"
                                target="_blank" rel="noopener noreferrer"
                                className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-green-500/20 px-6 py-3 text-sm font-semibold text-green-400 hover:bg-green-500/10 transition-all"
                            >
                                <IconWhatsapp size={16} /> {copy.getInTouch}
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/groups/truelegacycommunity"
                                target="_blank" rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all"
                            >
                                <IconFacebook size={15} /> {c.communityBtn}
                            </a>

                            {/* Social */}
                            <div className="mt-5 pt-4 border-t border-white/10 flex gap-5">
                                <a href={country.youtube} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <IconYoutube size={14} /> {c.ytHandle}
                                </a>
                                <a href={country.instagram} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-pink-400 transition-colors"
                                >
                                    <IconInstagram size={14} /> @truelegacyworld
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </TLBackground>

            {/* ===== PRODUCTS SECTION ===== */}
            <section className="py-20" style={{ background: '#070c1a' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F5A623] mb-3">{c.productsLabel}</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
                            {c.productsSub}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* emGuarde */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link
                                to={`/${country.slug}/emguarde`}
                                className="group block rounded-3xl border border-purple-500/15 p-8 hover:border-purple-500/40 transition-all hover:-translate-y-1"
                                style={{ background: 'rgba(5,16,48,0.6)', backdropFilter: 'blur(20px)' }}
                            >
                                <div className="rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-black/50 mb-4 aspect-[4/3] bg-[#0a1628] relative flex items-center justify-center">
                                    {!emguardeImgError && (
                                        <img
                                            src="/products/emguarde.png"
                                            alt="emGuarde — EMF harmonizer by Enagic, True Legacy World"
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 bg-black/40"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setEmguardeImgError(true)}
                                        />
                                    )}
                                    {emguardeImgError && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-purple-400/90">
                                            <IconShield size={48} />
                                            <span className="text-sm font-semibold text-white/90">emGuarde™</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-white text-xl mb-2">emGuarde™</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    {locale === 'es' ? 'Un armonizador EMF que equilibra tu entorno ante dispositivos modernos y mejora tu calma y bienestar diarios.' : 'A breakthrough EMF harmonizer, balancing your environment around modern devices and enhancing your daily calm and well-being.'}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                                    {copy.seeMore} <IconArrow size={16} />
                                </span>
                            </Link>
                        </motion.div>

                        {/* K8 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link
                                to={`/${country.slug}/k8`}
                                className="group block rounded-3xl border border-cyan-500/15 p-8 hover:border-cyan-500/40 transition-all hover:-translate-y-1"
                                style={{ background: 'rgba(5,16,48,0.6)', backdropFilter: 'blur(20px)' }}
                            >
                                <div className="rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-black/50 mb-4 aspect-[4/3] bg-[#0a1628] relative flex items-center justify-center">
                                    {!k8ImgError && (
                                        <img
                                            src="/products/k8.png"
                                            alt="Leveluk K8 Kangen Water ionizer by Enagic — True Legacy World"
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 bg-black/40"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setK8ImgError(true)}
                                        />
                                    )}
                                    {k8ImgError && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cyan-400/90">
                                            <IconDroplet size={48} />
                                            <span className="text-sm font-semibold text-white/90">Leveluk K8</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-white text-xl mb-2">Leveluk K8</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    {locale === 'es' ? 'El K8 es nuestro ionizador estrella, con cinco tipos de agua para beber, cocinar y limpiar — un esencial moderno para hogares conscientes de su salud.' : 'The K8 is our flagship ionizer, delivering five versatile waters for drinking, cooking, and cleaning — a modern essential for health-conscious homes.'}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                    {copy.seeMore} <IconArrow size={16} />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== GET PAID TO SHARE WORLD-HEALING PRODUCTS ===== */}
            <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="py-16 px-4 sm:px-6"
                style={{
                    background: 'linear-gradient(135deg, rgba(10,22,50,0.95) 0%, rgba(5,30,60,0.9) 100%)',
                    borderTop: '1px solid rgba(245,166,35,0.2)',
                    borderBottom: '1px solid rgba(245,166,35,0.2)',
                }}
            >
                <div className="mx-auto max-w-6xl rounded-[1.5rem] p-8 sm:p-10 md:py-12 md:px-16 border border-yellow-500/30">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            {copy.paidSection.headline}
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            {copy.paidSection.sub}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                                <IconDollar size={26} />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2">{copy.paidSection.card1Title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">{copy.paidSection.card1Body}</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                                <IconGlobe size={26} />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2">{copy.paidSection.card2Title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">{copy.paidSection.card2Body}</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                                <IconTrendingUp size={26} />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2">{copy.paidSection.card3Title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">{copy.paidSection.card3Body}</p>
                        </motion.div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-yellow-500/30 bg-[#0a1628]/90 p-6 md:p-8">
                        <div className="text-center md:text-left max-w-lg">
                            <h3 className="text-white font-black text-2xl mb-2">{copy.paidSection.ctaHeadline}</h3>
                            <p className="text-slate-400">{copy.paidSection.ctaBody}</p>
                        </div>
                        <a
                            href={jotformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 transition-all hover:scale-105 whitespace-nowrap"
                        >
                            {copy.startJourney}
                        </a>
                    </div>
                </div>
            </motion.section>

            {/* ===== TESTIMONIAL STRIP ===== */}
            <div className="section-divider" />
            <div className="py-8 px-4" style={{ background: '#070c1a' }}>
                <div className="mx-auto max-w-5xl">
                    <blockquote className="text-center">
                        <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed italic mb-4 max-w-3xl mx-auto">
                            &ldquo;{c.testimonialStripQuote}&rdquo;
                        </p>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => <IconStar key={i} size={14} filled />)}
                        </div>
                        <p className="text-sm font-semibold text-white">{c.testimonialStripName}</p>
                        <p className="text-xs text-slate-500">{c.testimonialStripRole}</p>
                    </blockquote>
                </div>
            </div>
            <div className="section-divider" />

            {/* ===== SOCIAL PROOF STRIP (stat updated: leaders across 3 continents, not 100k+) ===== */}
            <section className="py-10" style={{ background: '#060b1e' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <IconUsers size={20} />
                            <span className="text-sm text-slate-400"><strong className="text-white font-bold">{c.socialProofLeaders}</strong></span>
                        </div>
                        <div className="text-sm text-slate-400">
                            <strong className="text-white font-bold">{c.socialProofCountries}</strong>
                        </div>
                        <div className="text-sm text-slate-400">
                            <strong className="text-white font-bold">{c.socialProofEnagic}</strong>
                        </div>
                        <a href="https://www.facebook.com/groups/truelegacycommunity" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                        >
                            <IconFacebook size={16} /> {c.joinCommunity}
                        </a>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-20 border-t border-white/5" style={{ background: '#060b1e' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F5A623] mb-2">{locale === 'es' ? 'Testimonios' : 'Testimonials'}</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-display">{c.testimonialsLabel}</h2>
                    </motion.div>
                    <TestimonialsSplit locale={locale} />
                </div>
            </section>

            {/* ===== OTHER COUNTRIES ===== */}
            <section className="py-12 border-t border-white/5" style={{ background: '#070c1a' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 mb-6">{c.globalLabel}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {COUNTRIES.filter(cx => cx.slug !== country.slug).map(cx => (
                            <Link key={cx.slug} to={`/${cx.slug}`}
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white transition-all"
                            >
                                <span className="inline-flex h-6 w-8 flex-shrink-0 overflow-hidden rounded border border-white/20 bg-[#0a2060]" role="img" aria-label={`Flag of ${cx.name}`}>
                                    {failedFlagSlugs.has(cx.slug) ? (
                                        <span className="flex h-full w-full items-center justify-center text-lg leading-none">{cx.flagEmoji || cx.flag || '🏳️'}</span>
                                    ) : (
                                        <img src={getFlagImageUrl(cx.slug, 80)} alt="" className="h-full w-full object-cover" onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(cx.slug))} />
                                    )}
                                </span>
                                <span className="font-medium">{cx.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
