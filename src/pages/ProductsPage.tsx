import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TLBackground } from '@/components/ui/TLBackground'
import { PRODUCTS, type ProductCategory, type ProductId } from '@/lib/products'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { trackEvent } from '@/lib/analytics'

const CATEGORY_ORDER: ProductCategory[] = ['ionizer', 'shower', 'supplement', 'meat', 'air', 'accessory']

function getCategoryLabel(category: ProductCategory, locale: 'en' | 'es' | 'fr'): string {
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
  const { locale } = useLocaleContext()

  const allProducts = Object.values(PRODUCTS)

  const title =
    locale === 'es'
      ? 'Todos los Productos Enagic que Representamos'
      : locale === 'fr'
        ? 'Tous les Produits Enagic que Nous Représentons'
        : 'All Enagic Products We Represent'

  const subtitle =
    locale === 'es'
      ? 'Explora cada máquina, suplemento y tecnología que utilizamos para construir True Health y True Wealth.'
      : locale === 'fr'
        ? "Découvrez chaque machine, complément et technologie que nous utilisons pour créer la vraie santé et la vraie richesse."
        : 'Explore every machine, supplement and technology we use to build True Health and True Wealth.'

  const learnMoreLabel =
    locale === 'es'
      ? 'Ver detalles oficiales'
      : locale === 'fr'
        ? 'Voir les détails officiels'
        : 'View official details'

  const downloadGuideLabel =
    locale === 'es'
      ? 'Descargar guía'
      : locale === 'fr'
        ? 'Télécharger le guide'
        : 'Download guide'

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#060b1e' }}>
      <Navbar />

      <main className="flex-grow">
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
                    <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                      {productsInCategory.length.toString().padStart(2, '0')}{' '}
                      {locale === 'fr' ? 'produits' : locale === 'es' ? 'productos' : 'products'}
                    </span>
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
                          className="group block rounded-3xl border border-white/10 p-7 md:p-8 bg-[rgba(5,16,48,0.8)] backdrop-blur-xl hover:border-white/30 hover:-translate-y-1 transition-all"
                        >
                          <div className="rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-black/50 mb-4 aspect-[4/3] bg-[#0a1628] relative flex items-center justify-center">
                            <img
                              src={product.imageSrc}
                              alt={product.imageAlt}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <h3 className="font-bold text-white text-lg md:text-xl mb-2">{product.name}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            {/* Short description is handled by per-language marketing copy on country pages; keep this concise here. */}
                            {locale === 'es'
                              ? 'Habla con tu líder True Legacy para entender cómo este producto encaja en tu estrategia de salud y de ingresos.'
                              : locale === 'fr'
                                ? "Discutez avec votre leader True Legacy pour comprendre comment ce produit s'intègre dans votre stratégie de santé et de revenus."
                                : 'Speak with your True Legacy leader to understand how this product fits into your health and income strategy.'}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {product.enagicProductUrl && (
                              <a
                                href={product.enagicProductUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  trackEvent('product_view_enagic', {
                                    productId: id,
                                    locale,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10 transition-all"
                              >
                                {learnMoreLabel}
                              </a>
                            )}
                            {product.pdfGuideUrl && (
                              <a
                                href={product.pdfGuideUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  trackEvent('product_download_pdf', {
                                    productId: id,
                                    locale,
                                    url: product.pdfGuideUrl,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-all"
                              >
                                {downloadGuideLabel}
                              </a>
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

