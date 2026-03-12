import { motion } from 'framer-motion'
import type { Country } from '@/lib/countries'
import { PRODUCTS, type ProductId } from '@/lib/products'
import { t } from '@/lib/translations'
import { useLocaleContext } from '@/contexts/LocaleContext'

type Variant = 'home' | 'country'

type Props = {
  productIds: ProductId[]
  country?: Country
  variant?: Variant
}

export function ProductSection({ productIds, country, variant = 'country' }: Props) {
  const { locale } = useLocaleContext()
  const copy = t[locale as 'en'] as any

  const title =
    variant === 'home'
      ? locale === 'es'
        ? 'Tecnología Enagic que Representamos'
        : locale === 'fr'
          ? 'Technologie Enagic que Nous Représentons'
          : 'Enagic Technology We Represent'
      : locale === 'es'
        ? 'Nuestros Productos'
        : locale === 'fr'
          ? 'Nos Produits'
          : 'Our Products'

  const subtitle =
    variant === 'home'
      ? locale === 'es'
        ? 'Una vista rápida de los productos que impulsan el movimiento True Legacy.'
        : locale === 'fr'
          ? 'Un aperçu rapide des produits qui alimentent le mouvement True Legacy.'
          : 'A quick look at the products powering the True Legacy movement.'
      : locale === 'es'
        ? 'Tecnología de bienestar que funciona'
        : locale === 'fr'
          ? 'Une technologie bien-être qui fonctionne'
          : 'Wellness Technology That Works'

  const contactLabel =
    locale === 'es'
      ? 'Hablar con un distribuidor'
      : locale === 'fr'
        ? 'Parler à un distributeur'
        : 'Talk to a distributor'

  const jotformUrl = country?.jotformUrl

  return (
    <section className={variant === 'home' ? 'py-20' : 'py-20'} style={{ background: variant === 'home' ? '#060b1e' : '#070c1a' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F5A623] mb-3">{title}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
            {subtitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {productIds.map((id, index) => {
            const product = PRODUCTS[id]
            const pCopy = copy.products?.[id]
            if (!product) return null
            return (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="product-card group block rounded-3xl border border-white/10 p-8 hover:border-white/30 transition-all hover:-translate-y-1"
                data-product={id}
                style={{ background: '#0a0a0a', backdropFilter: 'blur(20px)' }}
              >
                <div className="rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-black/50 mb-4 aspect-[4/3] bg-[#05070F] flex items-center justify-center">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="product-image w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  {pCopy?.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-black/70 text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 text-white/90">
                      {pCopy.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-xl mb-2">
                  {pCopy?.label ?? product.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {pCopy?.short}
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.enagicProductUrl && (
                    <a
                      href={product.enagicProductUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10 transition-all"
                    >
                      {pCopy?.learnMore}
                    </a>
                  )}
                  {product.pdfGuideUrl && (
                    <a
                      href={product.pdfGuideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-all"
                    >
                      {pCopy?.downloadGuide}
                    </a>
                  )}
                  {jotformUrl && (
                    <a
                      href={jotformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-yellow-500 text-black px-4 py-2 text-xs font-bold hover:bg-yellow-400 transition-all"
                    >
                      {contactLabel}
                    </a>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

