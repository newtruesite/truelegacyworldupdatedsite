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
        ? "Esenciales de Bienestar Emblemáticos"
        : locale === "fr"
          ? "Essentiels Bien-être Phares"
          : locale === "pt"
            ? "Essenciais de Bem-estar Emblemáticos"
            : "Flagship Wellness Essentials"
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
        ? "Descubre los productos y tecnologías que definen la experiencia True Legacy."
        : locale === "fr"
          ? "Découvrez les produits et technologies qui définissent l’expérience True Legacy."
          : locale === "pt"
            ? "Conheça os produtos e tecnologias que definem a experiência True Legacy."
            : "Discover the products and technologies that define the True Legacy experience."
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
    variant === "homeAll"
      ? locale === "es"
      ? "Explora cada esencial, sus usos previstos y su disponibilidad por mercado. Habla con un distribuidor para recibir orientación personalizada en tu ubicación."
      : locale === "fr"
        ? "Explorez chaque essentiel, ses usages prévus et sa disponibilité par marché. Contactez un distributeur pour obtenir des conseils adaptés à votre région."
        : locale === "pt"
          ? "Explore cada essencial, seus usos previstos e a disponibilidade por mercado. Fale com um distribuidor para receber orientação personalizada em sua região."
          : "Explore each essential, its intended uses, and market-specific availability. Connect with a distributor for personalized guidance in your location."
      : locale === "es"
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
          <p className="text-[#cccccc] max-w-3xl mx-auto mt-4 text-base leading-relaxed">
            {productsIntro}
          </p>
          {/* Duo package: K8 + emGuarde — recommended combo (hidden for homeAll) */}
          {variant !== "homeAll" && (
            <div id="duo-package" className="mt-8 mx-auto grid max-w-4xl items-center gap-6 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-cyan-500/[0.08] to-purple-500/[0.08] p-5 text-center md:grid-cols-[0.9fr_1.1fr] md:p-6 md:text-left">
              <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#2997ff]">
                {locale === "es"
                  ? "Recomendado"
                  : locale === "fr"
                    ? "Recommandé"
                    : locale === "pt"
                      ? "Recomendado"
                      : "Recommended"}
              </p>
              <h3 className="mb-2 text-xl font-bold text-white">
                {locale === "es"
                  ? "Sistema Duo: Kangen K8 + emGuarde"
                  : locale === "fr"
                    ? "Pack Duo : Kangen K8 + emGuarde"
                    : locale === "pt"
                      ? "Sistema Duo: Kangen K8 + emGuarde"
                      : "Duo package: Kangen K8 + emGuarde"}
              </h3>
              <p className="mb-5 text-sm leading-6 text-[#cccccc]">
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
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-150 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-md"
              >
                {contactLabel}
              </Link>
              </div>
              <div className="grid grid-cols-2 items-end gap-2 rounded-2xl border border-white/10 bg-black/75 px-3 py-4 sm:px-5">
                <div>
                  <img src="/products/k8.png" alt="K8 flagship Kangen Water ionizer" className="mx-auto h-28 w-full origin-bottom scale-[0.78] object-contain drop-shadow-2xl sm:h-36" />
                  <p className="mt-1 text-center text-xs font-bold text-white sm:text-sm">K8 Flagship</p>
                </div>
                <div>
                  <img src="/products/emguarde-go.png" alt="emGuarde GO product set" className="mx-auto h-32 w-full origin-bottom scale-[1.12] object-contain drop-shadow-2xl sm:h-40" />
                  <p className="mt-1 text-center text-xs font-bold text-white sm:text-sm">emGuarde GO</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div
          className={
            variant === "homeAll"
              ? "products-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto"
              : variant === "country"
                ? "products-grid mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
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
                className={`product-card group flex h-full flex-col border border-white/10 border-t-2 border-t-[#F5A623] hover:border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150 ${variant === "country" ? "rounded-2xl p-4 sm:p-5" : "rounded-3xl p-5 md:p-8"}`}
                data-product={id}
                style={{
                  background: "transparent",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className={`overflow-hidden border border-white/10 shadow-lg mb-4 aspect-square bg-white/5 flex items-center justify-center relative ${variant === "country" ? "rounded-xl p-5" : "rounded-2xl p-8 md:aspect-[4/3] md:p-10"}`}>
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
                <h3 className={`font-bold text-white mb-2 text-center md:text-left ${variant === "country" ? "text-lg" : "text-xl"}`}>
                  {pCopy?.label ?? product.name}
                </h3>
                <p className="text-[#cccccc] text-sm leading-relaxed mb-4 text-center md:text-left">
                  {pCopy?.short}
                </p>
                {product.availability && (
                  <p className="mb-4 rounded-xl border border-white/20 bg-cyan-500/5 px-3 py-2 text-center text-xs leading-relaxed text-[#2997ff] md:text-left">
                    <span className="font-semibold">
                      {locale === "es" ? "Disponibilidad: " : locale === "fr" ? "Disponibilité : " : locale === "pt" ? "Disponibilidade: " : "Availability: "}
                    </span>
                    {product.availability[locale]}
                  </p>
                )}
                <div className="mt-auto flex flex-wrap gap-3 justify-center pt-1 md:justify-start">
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
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2 text-xs font-semibold text-[#2997ff] hover:bg-cyan-500/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
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
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-cyan-400/[0.06] px-7 text-sm font-bold text-[#2997ff] transition-all hover:bg-cyan-400/[0.12]"
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
