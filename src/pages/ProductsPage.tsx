import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { TLBackground } from '@/components/ui/TLBackground'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { trackEvent } from '@/lib/analytics'
import { getDistributorLink } from '@/lib/distributorRouter'
import { PRODUCTS, type ProductCategory, type ProductId } from '@/lib/products'
import { motion } from 'framer-motion'
import { PlayCircle, Plus } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const CATEGORY_ORDER: ProductCategory[] = ['ionizer', 'shower', 'supplement', 'meat', 'air', 'accessory']

function getCategoryLabel(category: ProductCategory, locale: 'en' | 'es' | 'fr' | 'pt'): string {
  if (locale === 'es') {
    switch (category) {
      case 'ionizer':
        return 'Ionizadores Kangen Water®'
      case 'shower':
        return 'Ducha y Spa en Casa'
      case 'supplement':
        return 'Suplementos Kangen Ukon®'
      case 'meat':
        return 'Kangen Beef Set'
      case 'air':
        return 'Purificación de Aire'
      case 'accessory':
        return 'Protección & Accesorios'
      default:
        return 'Productos'
    }
  }
  if (locale === 'fr') {
    switch (category) {
      case 'ionizer':
        return 'Ioniseurs Kangen Water®'
      case 'shower':
        return 'Douche & Spa à Domicile'
      case 'supplement':
        return 'Compléments Kangen Ukon®'
      case 'meat':
        return 'Kangen Beef Set'
      case 'air':
        return "Purification de l'Air"
      case 'accessory':
        return 'Protection & Accessoires'
      default:
        return 'Produits'
    }
  }
  if (locale === 'pt') {
    switch (category) {
      case 'ionizer':
        return 'Ionizadores Kangen Water®'
      case 'shower':
        return 'Chuveiro e Spa em Casa'
      case 'supplement':
        return 'Suplementos Kangen Ukon®'
      case 'meat':
        return 'Kangen Beef Set'
      case 'air':
        return 'Purificação do Ar'
      case 'accessory':
        return 'Proteção e Acessórios'
      default:
        return 'Produtos'
    }
  }

  switch (category) {
    case 'ionizer':
      return 'Kangen Water® Ionizers'
    case 'shower':
      return 'Shower & Home Spa'
    case 'supplement':
      return 'Kangen Ukon® Supplements'
    case 'meat':
      return 'Kangen Beef Set'
    case 'air':
      return 'Air Purification'
    case 'accessory':
      return 'Protection & Accessories'
    default:
      return 'Products'
  }
}

export default function ProductsPage() {
  const { countrySlug } = useParams<{ countrySlug?: string }>()
  const { locale } = useLocaleContext()
  const trainingTo = countrySlug ? `/${countrySlug}/training` : '/training'

  const allProducts = Object.values(PRODUCTS)

  const title =
    locale === 'es'
      ? 'Todos los Productos Enagic que Representamos'
      : locale === 'fr'
        ? 'Tous les Produits Enagic que Nous Représentons'
        : locale === 'pt'
          ? 'Todos os Produtos Enagic que Representamos'
          : 'All Enagic Products We Represent'

  const subtitle =
    locale === 'es'
      ? 'Explora cada máquina, suplemento y tecnología que utilizamos para construir True Health y True Wealth.'
      : locale === 'fr'
        ? "Découvrez chaque machine, complément et technologie que nous utilisons pour créer la vraie santé et la vraie richesse."
        : locale === 'pt'
          ? 'Explore cada máquina, suplemento e tecnologia que usamos para construir True Health e True Wealth.'
          : 'Explore every machine, supplement and technology we use to build True Health and True Wealth.'

  const learnMoreLabel =
    locale === 'es'
      ? 'Ver detalles oficiales'
      : locale === 'fr'
        ? 'Voir les détails officiels'
        : locale === 'pt'
          ? 'Ver detalhes oficiais'
          : 'View official details'

  const downloadGuideLabel =
    locale === 'es'
      ? 'Descargar guía'
      : locale === 'fr'
        ? 'Télécharger le guide'
        : locale === 'pt'
          ? 'Baixar guia'
          : 'Download guide'

  return (
    <div className="page-wrapper" style={{ background: '#060b1e' }}>
      <Navbar />

      <main className="content-wrapper">
        <TLBackground className="pt-28 pb-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-tl-gold opacity-80"
            >
              Enagic® · True Legacy
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white leading-tight mb-4 font-display font-bold"
              style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-slate-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light"
            >
              {subtitle}
            </motion.p>
          </div>
        </TLBackground>

        {/* Duo package hero: K8 + emGuarde GO */}
        <section className="py-8 px-4" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.1) 100%)' }}>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#0a1628]/90 p-6 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur md:p-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:text-left">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                {locale === 'es' ? 'Recomendado' : locale === 'fr' ? 'Recommandé' : locale === 'pt' ? 'Recomendado' : 'Recommended'}
              </p>
              <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                {locale === 'es' ? 'Sistema Duo: Kangen K8 + emGuarde GO' : locale === 'fr' ? 'Pack Duo : Kangen K8 + emGuarde GO' : locale === 'pt' ? 'Sistema Duo: Kangen K8 + emGuarde GO' : 'Duo package: Kangen K8 + emGuarde GO'}
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-sm text-slate-300 md:text-base lg:mx-0">
                {locale === 'es' ? 'Agua Kangen en casa con el K8 y soporte EMF portátil con el nuevo set de dos emGuarde GO.' : locale === 'fr' ? "L’eau Kangen à domicile avec le K8 et un soutien EMF portable grâce au nouveau lot de deux emGuarde GO." : locale === 'pt' ? 'Água Kangen em casa com o K8 e suporte EMF portátil com o novo conjunto de dois emGuarde GO.' : 'Kangen Water at home with the K8 and portable EMF support from the new emGuarde GO set of two.'}
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <a
                  href="https://www.youtube.com/watch?v=l8Uk9Mbegsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('duo_demo_watch', { locale, source: 'products_page' })}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <PlayCircle className="h-5 w-5" />
                  {locale === 'es' ? 'Ver demo Duo' : locale === 'fr' ? 'Voir la démo Duo' : locale === 'pt' ? 'Assistir à demo Duo' : 'Watch Duo Demo'}
                </a>
                <Link
                  to={['mexico', 'colombia', 'brazil', 'paraguay'].includes(countrySlug ?? '') ? "/latam/distributors" : "/distributors"}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {locale === 'es' ? 'Hablar con un distribuidor' : locale === 'fr' ? 'Parler à un distributeur' : locale === 'pt' ? 'Falar com um distribuidor' : 'Talk to a distributor'}
                </Link>
              </div>
            </div>

            <div className="relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:mt-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                <img src="/products/k8.png" alt="Leveluk K8 Kangen Water ionizer" className="mx-auto h-36 w-full object-contain sm:h-48" />
                <p className="mt-2 text-sm font-semibold text-white">Leveluk K8</p>
              </div>
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-950/30 sm:h-11 sm:w-11">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                <img src="/products/emguarde-go.png" alt="emGuarde GO portable device set of two" className="mx-auto h-36 w-full object-contain sm:h-48" />
                <p className="mt-2 text-sm font-semibold text-white">emGuarde GO™</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16" style={{ background: '#070c1a' }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
            {CATEGORY_ORDER.map((category) => {
              const productsInCategory = allProducts.filter((p) => p.category === category)
              if (!productsInCategory.length) return null

              const categoryLabel = getCategoryLabel(category, locale)

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white font-display">{categoryLabel}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {productsInCategory.map((product) => {
                      const id = product.id as ProductId
                      return (
                        <motion.article
                          key={product.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                          className="group block rounded-3xl border border-white/10 p-5 md:p-8 bg-[rgba(5,16,48,0.8)] backdrop-blur-xl hover:border-white/30 hover:-translate-y-1 transition-all"
                        >
                          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-4 aspect-[4/3] md:aspect-square bg-white/5 relative flex items-center justify-center p-8 md:p-10">
                            <img
                              src={product.imageSrc}
                              alt={product.imageAlt}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <h3 className="font-bold text-white text-lg md:text-xl mb-2 text-center md:text-left">{product.name}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed mb-4 text-center md:text-left">
                            {/* Short description is handled by per-language marketing copy on country pages; keep this concise here. */}
                            {locale === 'es'
                              ? 'Habla con tu líder True Legacy para entender cómo este producto encaja en tu estrategia de salud y de ingresos.'
                              : locale === 'fr'
                                ? "Discutez avec votre leader True Legacy pour comprendre comment ce produit s'intègre dans votre stratégie de santé et de revenus."
                                : 'Speak with your True Legacy leader to understand how this product fits into your health and income strategy.'}
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {id === 'k8' ? (
                                <Link
                                    to="/k8"
                                    onClick={() =>
                                        trackEvent('product_view_internal', {
                                            productId: id,
                                            locale,
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-semibold text-white transition-all min-h-[44px]"
                                >
                                    {learnMoreLabel}
                                </Link>
                            ) : id === 'emguarde' ? (
                                <Link
                                    to="/emguarde"
                                    onClick={() =>
                                        trackEvent('product_view_internal', {
                                            productId: id,
                                            locale,
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-2xl bg-purple-500 hover:bg-purple-400 px-4 py-2 text-xs font-semibold text-white transition-all min-h-[44px]"
                                >
                                    {learnMoreLabel}
                                </Link>
                            ) : id === 'kangen_air' ? (
                                <Link
                                    to={countrySlug ? `/${countrySlug}/kangen-air` : '/kangen-air'}
                                    onClick={() =>
                                        trackEvent('product_view_internal', {
                                            productId: id,
                                            locale,
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-white transition-all min-h-[44px]"
                                >
                                    {learnMoreLabel}
                                </Link>
                            ) : (
                                <Link
                                    to={getDistributorLink(countrySlug)}
                                    className="inline-flex items-center gap-1.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-semibold text-white transition-all min-h-[44px]"
                                >
                                    {locale === 'es' ? 'Hablar con distribuidor' : locale === 'fr' ? 'Parler à un distributeur' : locale === 'pt' ? 'Falar com distribuidor' : 'Talk to distributor'}
                                </Link>
                            )}
                            {product.enagicProductUrl && id !== 'k8' && id !== 'emguarde' && id !== 'kangen_air' && (
                              <a
                                href={product.enagicProductUrl}
                                target="_blank" rel="noopener noreferrer"
                                onClick={() =>
                                  trackEvent('product_view_enagic', {
                                    productId: id,
                                    locale,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10 transition-all min-h-[44px]"
                              >
                                {learnMoreLabel}
                              </a>
                            )}
                            <Link
                              to={trainingTo}
                              onClick={() =>
                                trackEvent('product_download_pdf', {
                                  productId: id,
                                  locale,
                                  url: trainingTo,
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-all min-h-[44px]"
                            >
                              {downloadGuideLabel}
                            </Link>
                            {(id === 'k8' || id === 'emguarde' || id === 'kangen_air') && (
                              <Link
                                to={getDistributorLink(countrySlug)}
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-transparent px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-all min-h-[44px]"
                              >
                                {locale === 'es' ? 'Hablar con distribuidor' : locale === 'fr' ? 'Parler à un distributeur' : locale === 'pt' ? 'Falar com distribuidor' : 'Talk to a distributor'}
                              </Link>
                            )}
                          </div>
                        </motion.article>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
