import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { COUNTRIES, getFlagSrcSet } from '@/lib/countries'
import { Facebook, Youtube } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LATAM_SLUGS = ['colombia', 'mexico', 'paraguay', 'brazil']
const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug)

function getFooterLabels(locale: 'en' | 'es' | 'fr' | 'pt') {
    const shared = {
        home: locale === 'es' ? 'Inicio' : locale === 'fr' ? 'Accueil' : locale === 'pt' ? 'Início' : 'Home',
        training: locale === 'es' ? 'Capacitación' : locale === 'fr' ? 'Formation' : locale === 'pt' ? 'Treinamento' : 'Leadership Training',
        products: locale === 'es' ? 'Productos' : locale === 'fr' ? 'Produits' : locale === 'pt' ? 'Produtos' : 'Products',
        kangenWater: locale === 'es' ? 'Agua Kangen' : locale === 'fr' ? 'Eau Kangen' : locale === 'pt' ? 'Água Kangen' : 'Kangen Water',
        emguarde: 'emGuarde Technology',
        ourStory: locale === 'es' ? 'Nuestra historia' : locale === 'fr' ? 'Notre histoire' : locale === 'pt' ? 'Nossa história' : 'Our Story',
    }
    const localized = {
        en: {
            description: 'A team platform for product education, community, leadership development, and responsible distributor support.', joinCommunity: 'Join Our Facebook Community', regions: 'Global Regions', company: 'Company', follow: 'Follow Us', authorized: 'Authorized Enagic Distributor', team: 'True Legacy World — Global Team', innovation: 'Enagic has been pioneering water ionization technology since 1974 — 52 years of innovation.', privacy: 'Privacy', terms: 'Terms', medical: 'Medical Disclaimer', earnings: 'Earnings Disclosure', distributor: 'Distributor Disclosure', rights: 'All rights reserved.', platform: 'Independent team education and lead-routing platform.',
        },
        es: {
            description: 'Una plataforma de equipo para educación sobre productos, comunidad, desarrollo de liderazgo y apoyo responsable de distribuidores.', joinCommunity: 'Únete a nuestra comunidad de Facebook', regions: 'Regiones globales', company: 'Compañía', follow: 'Síguenos', authorized: 'Distribuidor autorizado de Enagic', team: 'True Legacy World — Equipo global', innovation: 'Enagic ha sido pionera en tecnología de ionización de agua desde 1974 — 52 años de innovación.', privacy: 'Privacidad', terms: 'Términos', medical: 'Aviso médico', earnings: 'Divulgación de ingresos', distributor: 'Divulgación del distribuidor', rights: 'Todos los derechos reservados.', platform: 'Plataforma independiente de educación del equipo y asignación de prospectos.',
        },
        fr: {
            description: "Une plateforme d’équipe dédiée à l’éducation sur les produits, à la communauté, au développement du leadership et au soutien responsable des distributeurs.", joinCommunity: 'Rejoignez notre communauté Facebook', regions: 'Régions mondiales', company: 'Entreprise', follow: 'Suivez-nous', authorized: 'Distributeur Enagic autorisé', team: 'True Legacy World — Équipe mondiale', innovation: "Enagic est un pionnier de la technologie d’ionisation de l’eau depuis 1974 — 52 ans d’innovation.", privacy: 'Confidentialité', terms: 'Conditions', medical: 'Avertissement médical', earnings: 'Déclaration sur les revenus', distributor: 'Déclaration du distributeur', rights: 'Tous droits réservés.', platform: "Plateforme indépendante d’éducation d’équipe et d’orientation des prospects.",
        },
        pt: {
            description: 'Uma plataforma de equipe para educação sobre produtos, comunidade, desenvolvimento de liderança e suporte responsável aos distribuidores.', joinCommunity: 'Participe da nossa comunidade no Facebook', regions: 'Regiões globais', company: 'Empresa', follow: 'Siga-nos', authorized: 'Distribuidor autorizado Enagic', team: 'True Legacy World — Equipe global', innovation: 'A Enagic é pioneira em tecnologia de ionização da água desde 1974 — 52 anos de inovação.', privacy: 'Privacidade', terms: 'Termos', medical: 'Aviso médico', earnings: 'Divulgação de rendimentos', distributor: 'Divulgação do distribuidor', rights: 'Todos os direitos reservados.', platform: 'Plataforma independente de educação da equipe e direcionamento de contatos.',
        },
    }[locale]
    return { ...shared, ...localized }
}

function IconInstagram({ className }: { className?: string }) {
    return (
        <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    )
}

export function Footer() {
    const currentYear = new Date().getFullYear()
    const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())
    const location = useLocation()
    const { locale } = useLocaleContext()
    const isLATAM = location.pathname.startsWith('/events/latam') || LATAM_SLUGS.some((s) => location.pathname.startsWith(`/${s}`) || location.pathname.startsWith(`/events/${s}`))
    const firstSegment = location.pathname.slice(1).split('/')[0]
    const footerCountrySlug = firstSegment && COUNTRY_SLUGS.includes(firstSegment) ? firstSegment : null
    const trainingHref = footerCountrySlug ? `/${footerCountrySlug}/training` : '/training'
    const productsHref = footerCountrySlug ? `/${footerCountrySlug}/products` : '/products'
    const labels = getFooterLabels(locale)

    return (
        <footer className="relative border-t border-white/10 bg-black">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link
                            to="/"
                            className="group mb-4 logo-container inline-flex items-center"
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', background: 'transparent', border: 'none', padding: 0, gap: 0 }}
                        >
                            <TrueLegacyLogo variant="footer" />
                        </Link>
                        <p className="text-sm text-[#cccccc] leading-relaxed mb-6">
                            {labels.description}
                        </p>
                        {/* Community CTA */}
                        <a
                            href="https://www.facebook.com/groups/truelegacycommunity"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1877F2] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#166FE5] hover:scale-105 shadow-lg"
                        >
                            <Facebook className="h-4 w-4" />
                            {labels.joinCommunity}
                        </a>
                    </div>

                    {/* Countries */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#cccccc]">
                            {labels.regions}
                        </h3>
                        <ul className="space-y-2">
                            {COUNTRIES.map((country) => (
                                <li key={country.slug}>
                                    <Link
                                        to={`/${country.slug}`}
                                        className="flex items-center gap-2 text-sm text-[#cccccc] transition-colors hover:text-white"
                                    >
                                        <span className="inline-flex h-4 w-6 shrink-0 overflow-hidden rounded border border-white/20 bg-black">
                                            {failedFlagSlugs.has(country.slug) ? (
                                                <span className="flex h-full w-full items-center justify-center text-xs leading-none">{country.flagEmoji}</span>
                                            ) : (
                                                <img {...getFlagSrcSet(country.slug)} alt="" className="h-full w-full object-cover" loading="lazy" onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(country.slug))} />
                                            )}
                                        </span>
                                        <span>{country.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#cccccc]">
                            {labels.company}
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { label: labels.home, href: '/' },
                                { label: labels.training, href: trainingHref },
                                { label: labels.products, href: productsHref },
                                { label: labels.kangenWater, href: '/k8' },
                                { label: labels.emguarde, href: '/emguarde' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-[#cccccc] transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials — Instagram, LATAM first on LATAM pages */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#cccccc]">
                            {labels.follow}
                        </h3>
                        <div className="footer-social flex flex-wrap gap-5 justify-start items-center mb-4" style={{ width: '190px', paddingRight: '25px', transform: 'rotate(360deg)' }}>
                            {isLATAM && (
                                <a
                                    href="https://www.instagram.com/truelegacylatam?igsh=MTgxZW9yMTMxd2FpbQ=="
                                    target="_blank" rel="noopener noreferrer"
                                    className="footer-social-link inline-flex items-center gap-2 text-sm font-semibold no-underline transition-colors hover:text-white min-h-[44px]"
                                    style={{ color: '#c13584' }}
                                >
                                    <IconInstagram />
                                    @truelegacylatam
                                </a>
                            )}
                            <a
                                href="https://www.instagram.com/truelegacyworld/"
                                target="_blank" rel="noopener noreferrer"
                                className="footer-social-link inline-flex items-center gap-2 text-sm font-semibold text-[#cccccc] no-underline transition-colors hover:text-white min-h-[44px]"
                            >
                                <IconInstagram />
                                @truelegacyworld
                            </a>
                            {!isLATAM && (
                                <a
                                    href="https://www.instagram.com/truelegacylatam?igsh=MTgxZW9yMTMxd2FpbQ=="
                                    target="_blank" rel="noopener noreferrer"
                                    className="footer-social-link inline-flex items-center gap-2 text-sm font-semibold text-[#cccccc] no-underline transition-colors hover:text-white min-h-[44px]"
                                >
                                    <IconInstagram />
                                    @truelegacylatam
                                </a>
                            )}
                        </div>
                        <div className="space-y-3">
                            <a
                                href="https://youtube.com/@TrueLegacyWorld"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-[#cccccc] transition-colors hover:text-white group min-h-[44px]"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-red-500/20">
                                    <Youtube className="h-4 w-4 text-red-400" />
                                </div>
                                @TrueLegacyWorld
                            </a>
                            <a
                                href="https://youtube.com/@TrueLegacyLATAM"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-[#cccccc] transition-colors hover:text-white group min-h-[44px]"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-red-500/20">
                                    <Youtube className="h-4 w-4 text-red-400" />
                                </div>
                                @TrueLegacyLATAM
                            </a>
                        </div>

                        <div className="mt-8">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#cccccc]">
                                {labels.products}
                            </h3>
                            <div className="space-y-1">
                                <Link to={productsHref} className="block text-sm text-[#cccccc] transition-colors hover:text-white">Kangen Water (Enagic)</Link>
                                <Link to={productsHref} className="block text-sm text-[#cccccc] transition-colors hover:text-white">emGuarde Technology</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#86868b]">
                    <span className="text-center">{labels.authorized}</span>
                    <span className="text-white/40 hidden sm:inline">·</span>
                    <span className="text-center">{labels.team}</span>
                    <span className="text-white/40 hidden sm:inline">·</span>
                    <span className="text-center">{labels.innovation}</span>
                </div>
                <nav aria-label="Legal" className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#86868b]">
                    <Link to="/legal/privacy" className="hover:text-white">{labels.privacy}</Link>
                    <Link to="/legal/terms" className="hover:text-white">{labels.terms}</Link>
                    <Link to="/legal/medical" className="hover:text-white">{labels.medical}</Link>
                    <Link to="/legal/earnings" className="hover:text-white">{labels.earnings}</Link>
                    <Link to="/legal/distributor" className="hover:text-white">{labels.distributor}</Link>
                </nav>
                {/* Bottom Bar */}
                <div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <p className="text-sm text-[#86868b] text-center sm:text-left">
                        © {currentYear} True Legacy World. {labels.rights}
                    </p>
                    <p className="text-xs text-[#86868b] text-center sm:text-right">{labels.platform}</p>
                </div>
            </div>
        </footer>
    )
}
