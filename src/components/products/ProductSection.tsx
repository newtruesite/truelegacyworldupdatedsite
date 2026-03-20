import { useLocaleContext } from "@/contexts/LocaleContext";
import type { Country } from "@/lib/countries";
import { getDistributorLink } from "@/lib/distributorRouter";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Variant = "home" | "homeAll" | "country";

type Props = {
  productIds: ProductId[];
  country?: Country;
  variant?: Variant;
};

export function ProductSection({
  productIds,
  country,
  variant = "country",
}: Props) {
  const { locale } = useLocaleContext();

  const copy = t[locale];

  const title =
    variant === "homeAll"
      ? locale === "es"
        ? "Línea Completa de Productos"
        : locale === "fr"
          ? "Gamme Complète de Produits"
          : locale === "pt"
            ? "Linha Completa de Produtos"
            : "Complete Product Line"
      : variant === "home"
        ? locale === "es"
          ? "Tecnología Enagic que Representamos"
          : locale === "fr"
            ? "Technologie Enagic que Nous Représentons"
            : locale === "pt"
              ? "Tecnologia Enagic que Representamos"
              : "Enagic Technology We Represent"
        : locale === "es"
          ? "Nuestros Productos"
          : locale === "fr"
            ? "Nos Produits"
            : locale === "pt"
              ? "Nossos Produtos"
              : "Our Products";

  const subtitle =
    variant === "homeAll"
      ? locale === "es"
        ? "Los 9 productos Enagic que puedes usar y vender."
        : locale === "fr"
          ? "Les 9 produits Enagic que vous pouvez utiliser et vendre."
          : locale === "pt"
            ? "Os 9 produtos Enagic que você pode usar e vender."
            : "All 9 Enagic products you can use and sell."
      : variant === "home"
        ? locale === "es"
          ? "Una vista rápida de los productos que impulsan el movimiento True Legacy."
          : locale === "fr"
            ? "Un aperçu rapide des produits qui alimentent le mouvement True Legacy."
            : locale === "pt"
              ? "Uma visão rápida dos produtos que impulsionam o movimento True Legacy."
              : "A quick look at the products powering the True Legacy movement."
        : locale === "es"
          ? "Tecnología de bienestar que funciona"
          : locale === "fr"
            ? "Une technologie bien-être qui fonctionne"
            : locale === "pt"
              ? "Tecnologia de bem-estar que funciona"
              : "Wellness Technology That Works";

  const contactLabel =
    locale === "es"
      ? "Hablar con un distribuidor"
      : locale === "fr"
        ? "Parler à un distributeur"
        : locale === "pt"
          ? "Falar com um distribuidor"
          : "Talk to a distributor";

  const productsIntro =
    locale === "es"
      ? "Enagic fabrica 9 productos de clase mundial que usas en casa Y vendes para ganar comisiones. Cada producto tiene un beneficio de salud único — y cada venta te genera ingresos directos a través del sistema de 8 puntos."
      : locale === "fr"
        ? "Enagic fabrique 9 produits de classe mondiale que vous utilisez à la maison ET vendez pour gagner des commissions. Chaque produit a un avantage santé unique — et chaque vente vous génère des revenus directs via le système à 8 points."
        : locale === "pt"
          ? "Enagic fabrica 9 produtos de classe mundial que você usa em casa E vende para ganhar comissões. Cada produto tem um benefício de saúde único — e cada venda gera receita direta através do sistema de 8 pontos."
          : "Enagic manufactures 9 world-class products that you both use at home AND sell to earn commissions. Every product below has a unique health benefit — and every sale earns you direct income through the 8-point system.";

  return (
    <section
      className={variant === "home" ? "py-20" : "py-20"}
      style={{ background: variant === "home" ? "#060b1e" : "#070c1a" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F5A623] mb-3">
            {title}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
            {subtitle}
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto mt-4 text-base leading-relaxed">
            {productsIntro}
          </p>
          {/* Dual package: K8 + emGuarde — recommended combo (hidden for homeAll) */}
          {variant !== "homeAll" && (
            <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-6 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                {locale === "es"
                  ? "Recomendado"
                  : locale === "fr"
                    ? "Recommandé"
                    : locale === "pt"
                      ? "Recomendado"
                      : "Recommended"}
              </p>
              <h3 className="text-xl font-bold text-white mb-2">
                {locale === "es"
                  ? "Sistema dual: Kangen K8 + emGuarde"
                  : locale === "fr"
                    ? "Pack dual : Kangen K8 + emGuarde"
                    : locale === "pt"
                      ? "Sistema dual: Kangen K8 + emGuarde"
                      : "Dual package: Kangen K8 + emGuarde"}
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                {locale === "es"
                  ? "La mejor agua alcalina en casa con el K8 y protección EMF 24/7 con emGuarde. El combo que más recomendamos para salud y negocio."
                  : locale === "fr"
                    ? "La meilleure eau alcaline à la maison avec le K8 et une protection EMF 24/7 avec emGuarde. Le combo que nous recommandons le plus."
                    : locale === "pt"
                      ? "A melhor água alcalina em casa com o K8 e proteção EMF 24/7 com emGuarde. O combo que mais recomendamos."
                      : "Best-in-class alkaline water at home with the K8 and 24/7 EMF protection with emGuarde. The combo we recommend most for health and business."}
              </p>
              <Link
                to={getDistributorLink(country?.slug)}
                className="inline-flex items-center gap-2 rounded-md bg-cyan-500 hover:bg-cyan-400 hover:-translate-y-0.5 hover:shadow-md text-white font-semibold px-5 py-2.5 text-sm transition-all duration-150"
              >
                {contactLabel}
              </Link>
            </div>
          )}
        </motion.div>

        <div
          className={
            variant === "homeAll"
              ? "products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
              : "products-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
          }
        >
          {productIds.map((id, index) => {
            const product = PRODUCTS[id];
            const pCopy = copy.products?.[id];
            if (!product) return null;
            return (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="product-card group block rounded-3xl border border-white/10 border-t-2 border-t-[#F5A623] p-5 md:p-8 hover:border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150"
                data-product={id}
                style={{
                  background: "transparent",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-4 aspect-square md:aspect-[4/3] bg-white/5 flex items-center justify-center p-8 md:p-10 relative">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="product-image w-full h-full object-contain hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                    loading="lazy"
                    decoding="async"
                  />
                  {pCopy?.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-black/70 text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 text-white/90">
                      {pCopy.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-xl mb-2 text-center md:text-left">
                  {pCopy?.label ?? product.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 text-center md:text-left">
                  {pCopy?.short}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {id === 'kangen_air' ? (
                    <Link
                      to={country ? `/${country.slug}/kangen-air` : "/kangen-air"}
                      className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
                    >
                      {pCopy?.learnMore}
                    </Link>
                  ) : product.enagicProductUrl && (
                    <a
                      href={product.enagicProductUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
                    >
                      {pCopy?.learnMore}
                    </a>
                  )}
                  {product.pdfGuideUrl && (
                    <Link
                      to={country ? `/${country.slug}/training` : "/training"}
                      className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
                    >
                      {pCopy?.downloadGuide ??
                        (locale === "es"
                          ? "Guías en Capacitación"
                          : locale === "fr"
                            ? "Guides en Formation"
                            : locale === "pt"
                              ? "Guias no Treinamento"
                              : "Guides in Training")}
                    </Link>
                  )}
                  <Link
                    to={getDistributorLink(country?.slug)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-transparent px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 min-h-[44px]"
                  >
                    {contactLabel}
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
