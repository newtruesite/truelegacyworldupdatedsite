import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { COUNTRIES, getFlagSrcSet } from '@/lib/countries'
import { t } from '@/lib/translations'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

// ── Custom SVG Icon Components ──────────────────────────────
function IconShield({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
}
function IconDroplets({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
            <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
        </svg>
    )
}
function IconGlobe({ className }: { className?: string }) {
    return (
        <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
function IconChevron({ className }: { className?: string }) {
    return (
        <svg className={className} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    )
}

// ── True Legacy Logo + tagline (Creating True Health Around the World) ──────────────────
function NavLogo() {
    return (
        <div className="flex flex-col gap-0.5">
            <img
                src="/logos/tl-horizontal-white.png"
                alt="True Legacy"
                className="h-9 md:h-11 w-auto block"
                loading="eager"
                fetchPriority="high"
            />
            <span className="text-[10px] md:text-xs font-medium text-slate-400 tracking-wide hidden sm:block">
                Creating True Health Around the World
            </span>
        </div>
    )
}

const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug)

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [countriesOpen, setCountriesOpen] = useState(false)
    const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())
    const [navVisible, setNavVisible] = useState(true)
    const lastScrollY = useRef(0)

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY
            if (y > lastScrollY.current && y > 80) setNavVisible(false)
            else setNavVisible(true)
            lastScrollY.current = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const isHome = pathname === '/'
    const firstSegment = pathname.slice(1).split('/')[0]
    const isCountryPage = firstSegment && COUNTRY_SLUGS.includes(firstSegment)
    const country = isCountryPage ? COUNTRIES.find((c) => c.slug === firstSegment) : null
    const jotformUrl = country?.jotformUrl ?? null
    const { locale, setLocale: setLocaleOverride } = useLocaleContext()
    const navLabels = {
        home: t[locale].nav_home,
        training: t[locale].nav_training,
        community: locale === 'es' ? 'Comunidad de Facebook' : locale === 'fr' ? 'Communauté Facebook' : 'Facebook Community',
        countries: locale === 'es' ? 'Países' : locale === 'fr' ? 'Pays' : 'Countries',
        findRegion: locale === 'es' ? 'Encuentra tu región' : locale === 'fr' ? 'Trouvez votre région' : 'Find Your Region',
        unlockLegacy: t[locale].unlockLegacy,
        navProductK8: t[locale].navProductK8,
        navProductEmguarde: t[locale].navProductEmguarde,
    }

    const goToCountry = (slug: string) => {
        setCountriesOpen(false)
        setMenuOpen(false)
        navigate(`/${slug}`)
    }

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-300 ease-out overflow-visible"
            style={{ transform: navVisible ? 'translateY(0)' : 'translateY(-100%)' }}
        >
            <nav
                className="mx-3 mt-2 pt-2 rounded-2xl px-4 sm:px-5 py-3 flex items-center justify-between min-h-[52px]"
                style={{
                    background: 'rgba(5,16,48,0.85)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
            >
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                    <NavLogo />
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 lg:flex">
                    {[
                        { label: navLabels.home, to: '/' },
                        { label: navLabels.training, to: '/training' },
                    ].map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                'px-3 py-2 text-[13px] font-medium transition-colors rounded-lg',
                                pathname === to ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                    <a
                        href="https://www.facebook.com/groups/truelegacycommunity"
                        target="_blank" rel="noopener noreferrer"
                        className="px-3 py-2 text-[13px] font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                        {navLabels.community}
                    </a>

                    {/* Separator */}
                    <div className="w-px h-5 bg-white/10 mx-2" />

                    {/* Products — country-aware so /usa/k8, /colombia/emguarde etc. */}
                    <Link to={country ? `/${country.slug}/emguarde` : '/emguarde'}
                        className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-purple-300 hover:text-purple-200 transition-colors rounded-lg hover:bg-purple-500/10"
                    >
                        <IconShield className="text-purple-400" /> {navLabels.navProductEmguarde}
                    </Link>
                    <Link to={country ? `/${country.slug}/k8` : '/k8'}
                        className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-cyan-300 hover:text-cyan-200 transition-colors rounded-lg hover:bg-cyan-500/10"
                    >
                        <IconDroplets className="text-cyan-400" /> {navLabels.navProductK8}
                    </Link>

                    {/* Separator */}
                    <div className="w-px h-5 bg-white/10 mx-2" />

                    {/* Countries dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setCountriesOpen(!countriesOpen)}
                            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            <IconGlobe /> {navLabels.countries}
                            <IconChevron className={cn('transition-transform duration-200', countriesOpen && 'rotate-180')} />
                        </button>
                        <AnimatePresence>
                            {countriesOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 py-1.5 shadow-2xl"
                                    style={{ background: 'rgba(5,16,48,0.95)', backdropFilter: 'blur(20px)' }}
                                >
                                    {COUNTRIES.map((c) => (
                                        <button
                                            key={c.slug}
                                            onClick={() => goToCountry(c.slug)}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                                        >
                                            <span className="inline-flex h-5 w-7 flex-shrink-0 overflow-hidden rounded border border-white/20 bg-[#0a2060]">
                                                {failedFlagSlugs.has(c.slug) ? (
                                                    <span className="flex h-full w-full items-center justify-center text-base leading-none">{c.flagEmoji}</span>
                                                ) : (
                                                    <img {...getFlagSrcSet(c.slug)} alt="" className="h-full w-full object-cover" loading="lazy" onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(c.slug))} />
                                                )}
                                            </span>
                                            <span>{c.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Language toggle — EN | ES | FR (FR shown for Morocco / when locale is fr) */}
                <div className="flex items-center gap-0.5 text-[12px] font-medium text-slate-400">
                    {(['en', 'es', 'fr'] as const).map((loc) => (
                        <button
                            key={loc}
                            onClick={() => setLocaleOverride(loc)}
                            className={cn(
                                'min-h-[44px] min-w-[44px] flex items-center justify-center px-2 py-2 rounded-lg transition-colors',
                                locale === loc ? 'text-white bg-white/10' : 'hover:text-white hover:bg-white/5'
                            )}
                            aria-label={loc === 'en' ? 'English' : loc === 'es' ? 'Español' : 'Français'}
                        >
                            {loc === 'en' ? 'EN' : loc === 'es' ? 'ES' : 'FR'}
                        </button>
                    ))}
                </div>

                {/* CTA — Unlock Your Legacy only on country pages (has jotform); Find Your Region on home/other */}
                <div className="flex items-center gap-3">
                    {jotformUrl ? (
                        <a
                            href={jotformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                                trackEvent('join_click', {
                                    location: 'navbar_desktop',
                                    countrySlug: country?.slug ?? null,
                                    locale,
                                })
                            }
                            className="hidden sm:inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #1B3A8C 0%, #1e6fc0 100%)',
                                boxShadow: '0 4px 20px rgba(27,58,140,0.4)',
                            }}
                        >
                            {navLabels.unlockLegacy}
                        </a>
                    ) : (
                        <Link
                            to="/#map"
                            className="hidden sm:inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #1B3A8C 0%, #1e6fc0 100%)',
                                boxShadow: '0 4px 20px rgba(27,58,140,0.4)',
                            }}
                        >
                            {navLabels.findRegion}
                        </Link>
                    )}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors lg:hidden"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu — full-height drawer from right */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                            onClick={() => setMenuOpen(false)}
                            aria-hidden
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm border-l border-white/10 overflow-y-auto shadow-2xl lg:hidden"
                            style={{ background: 'rgba(5,16,48,0.98)', backdropFilter: 'blur(24px)' }}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <span className="text-sm font-semibold text-white">Menu</span>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-4 space-y-1">
                                {[{ label: navLabels.home, to: '/' }, { label: navLabels.training, to: '/training' }].map(({ label, to }) => (
                                    <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                                        className={cn(
                                            'flex items-center min-h-[56px] px-4 py-3 text-base font-medium rounded-xl transition-colors',
                                            pathname === to ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                                        )}
                                    >
                                        {label}
                                    </Link>
                                ))}
                                <a href="https://www.facebook.com/groups/truelegacycommunity" target="_blank" rel="noopener noreferrer"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center min-h-[56px] px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    {navLabels.community}
                                </a>
                                <div className="section-divider my-2" />
                                <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{locale === 'es' ? 'Productos' : locale === 'fr' ? 'Produits' : 'Products'}</p>
                                <Link to={country ? `/${country.slug}/emguarde` : '/emguarde'} onClick={() => setMenuOpen(false)}
                                    className="flex items-center min-h-[56px] gap-2.5 px-4 py-3 text-base font-medium text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors"
                                >
                                    <IconShield className="text-purple-400" /> {navLabels.navProductEmguarde}
                                </Link>
                                <Link to={country ? `/${country.slug}/k8` : '/k8'} onClick={() => setMenuOpen(false)}
                                    className="flex items-center min-h-[56px] gap-2.5 px-4 py-3 text-base font-medium text-cyan-300 hover:bg-cyan-500/10 rounded-xl transition-colors"
                                >
                                    <IconDroplets className="text-cyan-400" /> {navLabels.navProductK8}
                                </Link>
                                <div className="section-divider my-2" />
                                <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{locale === 'es' ? 'Elige tu país' : locale === 'fr' ? 'Choisissez votre pays' : 'Select Country'}</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {COUNTRIES.map((c) => (
                                        <button key={c.slug} onClick={() => goToCountry(c.slug)}
                                            className="flex items-center min-h-[56px] gap-2 rounded-xl px-3 py-3 text-base text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <span className="inline-flex h-5 w-7 flex-shrink-0 overflow-hidden rounded border border-white/20 bg-[#0a2060]">
                                                {failedFlagSlugs.has(c.slug) ? (
                                                    <span className="flex h-full w-full items-center justify-center text-base leading-none">{c.flagEmoji}</span>
                                                ) : (
                                                    <img {...getFlagSrcSet(c.slug)} alt="" className="h-full w-full object-cover" loading="lazy" onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(c.slug))} />
                                                )}
                                            </span>
                                            <span>{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-2 pb-8">
                                    {jotformUrl ? (
                                        <a
                                            href={jotformUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                trackEvent('join_click', {
                                                    location: 'navbar_mobile',
                                                    countrySlug: country?.slug ?? null,
                                                    locale,
                                                })
                                                setMenuOpen(false)
                                            }}
                                            className="flex items-center justify-center min-h-[56px] w-full rounded-xl px-4 py-3 text-center text-base font-bold text-white transition-all"
                                            style={{ background: 'linear-gradient(135deg, #1B3A8C, #1e6fc0)' }}
                                        >
                                            {navLabels.unlockLegacy}
                                        </a>
                                    ) : (
                                        <Link
                                            to="/#map"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center justify-center min-h-[56px] w-full rounded-xl px-4 py-3 text-center text-base font-bold text-white transition-all"
                                            style={{ background: 'linear-gradient(135deg, #1B3A8C, #1e6fc0)' }}
                                        >
                                            {navLabels.findRegion}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}
