import { useLocaleContext } from "@/contexts/LocaleContext";
import type { Country } from "@/lib/countries";
import { getDistributorLink } from "@/lib/distributorRouter";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import { useState } from "react";
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
  const [showAllProducts, setShowAllProducts] = useState(false);

  const copy = t[locale];

  const title =
    variant === "homeAll"
      ? locale === "es"
        ? "Línea Completa de Productos"
        : locale === "fr"
          ? "Gamme Complète de Produits"
          : locale === "pt"
            ? "Linha Completa de Produtos"
            : "Complete Product and Technology Line"
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
        ? "Explora 11 productos y tecnologías en mercados compatibles."
        : locale === "fr"
          ? "Découvrez 11 produits et technologies sur les marchés pris en charge."
          : locale === "pt"
            ? "Explore 11 produtos e tecnologias nos mercados atendidos."
            : "Explore 11 products and technologies across supported markets."
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
      ? "Conoce la línea de productos, sus usos previstos y su disponibilidad por mercado. Habla con un distribuidor para confirmar la información local."
      : locale === "fr"
        ? "Découvrez la gamme, les usages prévus et la disponibilité par marché. Contactez un distributeur pour confirmer les informations locales."
        : locale === "pt"
          ? "Conheça a linha de produtos, seus usos previstos e a disponibilidade por mercado. Fale com um distribuidor para confirmar as informações locais."
          : "Explore the product line, intended uses, and market-specific availability. Contact a distributor to confirm current information in your location.";

  const visibleProductIds =
    variant === "country" && !showAllProducts
      ? productIds.slice(0, 4)
      : productIds;

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
          {/* Duo package: K8 + emGuarde — recommended combo (hidden for homeAll) */}
          {variant !== "homeAll" && (
            <div id="duo-package" className="mt-8 mx-auto max-w-3xl rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-6 text-center md:p-8 md:text-left">
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
                  ? "Sistema Duo: Kangen K8 + emGuarde"
                  : locale === "fr"
                    ? "Pack Duo : Kangen K8 + emGuarde"
                    : locale === "pt"
                      ? "Sistema Duo: Kangen K8 + emGuarde"
                      : "Duo package: Kangen K8 + emGuarde"}
              </h3>
              <p className="text-slate-300 text-sm mb-6">
                {locale === "es"
                  ? "La mejor agua alcalina en casa con el K8 y protección EMF 24/7 con emGuarde. El combo que más recomendamos para salud y negocio."
                  : locale === "fr"
                    ? "La meilleure eau alcaline à la maison avec le K8 et une protection EMF 24/7 avec emGuarde. Le combo que nous recommandons le plus."
                    : locale === "pt"
                      ? "A melhor água alcalina em casa com o K8 e proteção EMF 24/7 com emGuarde. O combo que mais recomendamos."
                      : "Best-in-class alkaline water at home with the K8 and 24/7 EMF protection with emGuarde. The combo we recommend most for health and business."}
              </p>
              <div className="mb-6 grid grid-cols-2 items-end gap-4 rounded-2xl border border-white/10 bg-[#071127]/70 p-4 sm:p-6">
                <div>
                  <img src="/products/k8.png" alt="K8 flagship Kangen Water ionizer" className="mx-auto h-40 w-full object-contain drop-shadow-2xl sm:h-56" />
                  <p className="mt-3 text-center text-sm font-bold text-white">K8 Flagship</p>
                </div>
                <div>
                  <img src="/products/emguarde-go.png" alt="emGuarde GO product set" className="mx-auto h-36 w-full object-contain drop-shadow-2xl sm:h-48" />
                  <p className="mt-3 text-center text-sm font-bold text-white">emGuarde GO</p>
                </div>
              </div>
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
          {visibleProductIds.map((id, index) => {
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
                  {id === 'emguarde_original' && (
                    <span className="absolute top-3 right-3 rounded-full bg-red-600 text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1 text-white shadow-lg">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-xl mb-2 text-center md:text-left">
                  {pCopy?.label ?? product.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 text-center md:text-left">
                  {pCopy?.short}
                </p>
                {product.availability && (
                  <p className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-center text-xs leading-relaxed text-cyan-100 md:text-left">
                    <span className="font-semibold">
                      {locale === "es" ? "Disponibilidad: " : locale === "fr" ? "Disponibilité : " : locale === "pt" ? "Disponibilidade: " : "Availability: "}
                    </span>
                    {product.availability[locale]}
                  </p>
                )}
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
        {variant === "country" && productIds.length > 4 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAllProducts((current) => !current)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/[0.06] px-7 text-sm font-bold text-cyan-200 transition-all hover:bg-cyan-400/[0.12]"
            >
              {showAllProducts
                ? locale === "es"
                  ? "Ver menos productos"
                  : locale === "fr"
                    ? "Voir moins de produits"
                    : locale === "pt"
                      ? "Ver menos produtos"
                      : "Show fewer products"
                : locale === "es"
                  ? "Cargar más productos"
                  : locale === "fr"
                    ? "Afficher plus de produits"
                    : locale === "pt"
                      ? "Carregar mais produtos"
                      : "Load more products"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
