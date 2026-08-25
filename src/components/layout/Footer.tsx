import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { COUNTRIES, getFlagSrcSet } from '@/lib/countries'
import { ArrowRight, Globe, Youtube } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function getFooterLabels(locale: 'en' | 'es' | 'fr' | 'pt') {
  return {
    en: {
      tagline: 'A global platform for product education, leadership development, community, and responsible independent business building.',
      joinCommunity: 'Join the Community',
      explore: 'EXPLORE',
      globalPresence: 'GLOBAL PRESENCE',
      marketCount: 'Leaders across 14 featured markets',
      exploreNetwork: 'Explore Our Global Network',
      connect: 'CONNECT',
      home: 'Home',
      business: 'Explore the Business',
      duo: 'True Legacy Duo',
      training: 'Leadership Training',
      events: 'Live Events',
      products: 'Products',
      authorized: 'Authorized Enagic Distributor · True Legacy World · Independent Distributor Organization',
      privacy: 'Privacy',
      terms: 'Terms',
      medical: 'Medical Disclaimer',
      earnings: 'Earnings Disclosure',
      distributor: 'Distributor Disclosure',
      disclosure: 'This website is independently owned and operated by authorized Enagic independent distributors. True Legacy is an independent global team and educational platform, not Enagic corporate. Product statements have not been evaluated by the FDA or medical authorities and are not intended to diagnose, treat, cure, or prevent any disease. Business results depend on individual skill, effort, and market conditions.',
      rights: 'All rights reserved.',
    },
    es: {
      tagline: 'Una plataforma global para educación sobre productos, desarrollo de liderazgo, comunidad y creación responsable de negocios independientes.',
      joinCommunity: 'Únete a la Comunidad',
      explore: 'EXPLORAR',
      globalPresence: 'PRESENCIA GLOBAL',
      marketCount: 'Líderes en 14 mercados destacados',
      exploreNetwork: 'Explorar Nuestra Red Global',
      connect: 'CONECTAR',
      home: 'Inicio',
      business: 'Explorar el Negocio',
      duo: 'True Legacy Duo',
      training: 'Capacitación y Liderazgo',
      events: 'Eventos en Vivo',
      products: 'Productos',
      authorized: 'Distribuidor Autorizado de Enagic · True Legacy World · Organización Independiente de Distribuidores',
      privacy: 'Privacidad',
      terms: 'Términos',
      medical: 'Aviso Médico',
      earnings: 'Divulgación de Ingresos',
      distributor: 'Divulgación de Distribuidor',
      disclosure: 'Este sitio web es propiedad y está operado de forma independiente por distribuidores autorizados de Enagic. True Legacy es un equipo global y plataforma educativa independiente, no la corporación Enagic. Las declaraciones sobre productos no han sido evaluadas por la FDA o autoridades médicas. Los resultados dependen del esfuerzo y habilidades individuales.',
      rights: 'Todos los derechos reservados.',
    },
    fr: {
      tagline: 'Une plateforme mondiale dédiée à l’éducation sur les produits, au développement du leadership, à la communauté et au développement d’activités responsables.',
      joinCommunity: 'Rejoindre la Communauté',
      explore: 'EXPLORER',
      globalPresence: 'PRÉSENCE MONDIALE',
      marketCount: 'Leaders sur 14 marchés majeurs',
      exploreNetwork: 'Explorer Notre Réseau Mondial',
      connect: 'CONNECTER',
      home: 'Accueil',
      business: 'Découvrir l’Activité',
      duo: 'True Legacy Duo',
      training: 'Formation & Leadership',
      events: 'Événements en Direct',
      products: 'Produits',
      authorized: 'Distributeur Agréé Enagic · True Legacy World · Organisation Indépendante de Distributeurs',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      medical: 'Avertissement Médical',
      earnings: 'Déclaration sur les Revenus',
      distributor: 'Déclaration du Distributeur',
      disclosure: 'Ce site web est exploité de manière indépendante par des distributeurs agréés Enagic. True Legacy est une équipe mondiale et une plateforme éducative indépendante, distincte d’Enagic corporate. Les déclarations relatives aux produits n’ont pas été évaluées par les autorités médicales.',
      rights: 'Tous droits réservés.',
    },
    pt: {
      tagline: 'Uma plataforma global para educação de produtos, desenvolvimento de liderança, comunidade e construção responsável de negócios independentes.',
      joinCommunity: 'Participe da Comunidade',
      explore: 'EXPLORAR',
      globalPresence: 'PRESENÇA GLOBAL',
      marketCount: 'Líderes em 14 mercados em destaque',
      exploreNetwork: 'Explorar Nossa Rede Global',
      connect: 'CONECTAR',
      home: 'Início',
      business: 'Explorar o Negócio',
      duo: 'True Legacy Duo',
      training: 'Treinamento & Liderança',
      events: 'Eventos ao Vivo',
      products: 'Produtos',
      authorized: 'Distribuidor Autorizado Enagic · True Legacy World · Organização Independente de Distribuidores',
      privacy: 'Privacidade',
      terms: 'Termos',
      medical: 'Aviso Médico',
      earnings: 'Divulgação de Rendimentos',
      distributor: 'Divulgação do Distribuidor',
      disclosure: 'Este site é propriedade e operado de forma independente por distribuidores autorizados da Enagic. True Legacy é uma equipe global e plataforma educacional independente. As declarações de produtos não foram avaliadas por autoridades médicas.',
      rights: 'Todos os direitos reservados.',
    },
  }[locale]
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())
  const location = useLocation()
  const { locale } = useLocaleContext()
  const labels = getFooterLabels(locale)

  return (
    <footer className="relative border-t border-white/10 bg-[#05070c] text-white pt-12 pb-8 sm:pt-14 sm:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Desktop Grid / Stacked Mobile */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 pb-10">
          {/* COLUMN 1 — BRAND (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link
                to="/"
                className="group logo-container inline-flex items-center mb-4 transition-opacity hover:opacity-90"
                style={{ textDecoration: 'none', background: 'transparent', border: 'none', padding: 0 }}
              >
                <TrueLegacyLogo variant="footer" />
              </Link>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed max-w-sm">
                {labels.tagline}
              </p>
            </div>

            <div className="mt-5">
              <a
                href="https://www.facebook.com/groups/truelegacycommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/[0.08] hover:border-white/30 active:scale-95"
              >
                <span>{labels.joinCommunity}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#2997ff] transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* COLUMN 2 — EXPLORE (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              {labels.explore}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-[#86868b] transition-colors hover:text-white">
                  {labels.home}
                </Link>
              </li>
              <li>
                <Link to="/business" className="text-[#86868b] transition-colors hover:text-white">
                  {labels.business}
                </Link>
              </li>
              <li>
                <Link to="/duo" className="text-[#86868b] transition-colors hover:text-white">
                  {labels.duo}
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-[#86868b] transition-colors hover:text-white">
                  {labels.training}
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-[#86868b] transition-colors hover:text-white">
                  {labels.events}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#86868b] transition-colors hover:text-white">
                  {labels.products}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — GLOBAL PRESENCE (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
              {labels.globalPresence}
            </h3>
            <p className="text-xs text-[#86868b] mb-3">
              {labels.marketCount}
            </p>

            {/* Compact Flag Grid */}
            <div className="grid grid-cols-7 gap-1.5 max-w-[260px] mb-3.5">
              {COUNTRIES.map((country) => (
                <Link
                  key={country.slug}
                  to={`/${country.slug}`}
                  title={country.name}
                  className="group relative flex h-7 w-8 items-center justify-center rounded-md border border-white/10 bg-black/60 p-0.5 transition-all hover:border-cyan-400/50 hover:bg-black/90 hover:scale-105"
                >
                  <span className="inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[3px] border border-white/10">
                    {failedFlagSlugs.has(country.slug) ? (
                      <span className="flex h-full w-full items-center justify-center text-[10px] leading-none">
                        {country.flagEmoji}
                      </span>
                    ) : (
                      <img
                        {...getFlagSrcSet(country.slug)}
                        alt={country.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(country.slug))}
                      />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              to="/distributors"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#2997ff] hover:text-cyan-300 transition-colors"
            >
              <span>{labels.exploreNetwork}</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* COLUMN 4 — CONNECT (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              {labels.connect}
            </h3>

            <div className="space-y-4">
              {/* True Legacy World */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#cccccc] mb-1.5">
                  True Legacy World
                </p>
                <div className="flex flex-col space-y-1.5">
                  <a
                    href="https://www.instagram.com/truelegacyworld/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-[#86868b] transition-colors hover:text-white"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 transition-colors group-hover:bg-pink-500/20 group-hover:text-pink-400">
                      <IconInstagram className="h-3 w-3 text-pink-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    </div>
                    <span>@truelegacyworld</span>
                  </a>
                  <a
                    href="https://youtube.com/@TrueLegacyWorld"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-[#86868b] transition-colors hover:text-white"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 transition-colors group-hover:bg-red-500/20 group-hover:text-red-400">
                      <Youtube className="h-3 w-3 text-red-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    </div>
                    <span>@TrueLegacyWorld</span>
                  </a>
                </div>
              </div>

              {/* True Legacy LATAM */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#cccccc] mb-1.5">
                  True Legacy LATAM
                </p>
                <div className="flex flex-col space-y-1.5">
                  <a
                    href="https://www.instagram.com/truelegacylatam?igsh=MTgxZW9yMTMxd2FpbQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-[#86868b] transition-colors hover:text-white"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 transition-colors group-hover:bg-pink-500/20 group-hover:text-pink-400">
                      <IconInstagram className="h-3 w-3 text-pink-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    </div>
                    <span>@truelegacylatam</span>
                  </a>
                  <a
                    href="https://youtube.com/@TrueLegacyLATAM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-[#86868b] transition-colors hover:text-white"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 transition-colors group-hover:bg-red-500/20 group-hover:text-red-400">
                      <Youtube className="h-3 w-3 text-red-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    </div>
                    <span>@TrueLegacyLATAM</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR & COMPLIANCE SECTION */}
        <div className="border-t border-white/10 pt-6">
          {/* Row 1 — Organization */}
          <p className="text-center text-xs font-medium text-[#cccccc] tracking-tight">
            {labels.authorized}
          </p>

          {/* Row 2 — Legal Links */}
          <nav aria-label="Legal" className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-[#86868b]">
            <Link to="/legal/privacy" className="hover:text-white transition-colors">
              {labels.privacy}
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/legal/terms" className="hover:text-white transition-colors">
              {labels.terms}
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/legal/medical" className="hover:text-white transition-colors">
              {labels.medical}
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/legal/earnings" className="hover:text-white transition-colors">
              {labels.earnings}
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/legal/distributor" className="hover:text-white transition-colors">
              {labels.distributor}
            </Link>
          </nav>

          {/* Row 3 — Enagic Disclosure */}
          <p className="mx-auto mt-4 max-w-4xl text-center text-[11px] leading-relaxed text-[#66666e]">
            {labels.disclosure}
          </p>

          {/* Row 4 — Copyright */}
          <p className="mt-3 text-center text-xs text-[#86868b]">
            © {currentYear} True Legacy World. {labels.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}

