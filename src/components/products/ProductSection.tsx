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
      ? copy.prod_section_title_all
      : variant === "home"
        ? copy.prod_section_title_home
        : copy.prod_section_title_default;

  const subtitle =
    variant === "homeAll"
      ? copy.prod_section_sub_all
      : variant === "home"
        ? copy.prod_section_sub_home
        : copy.prod_section_sub_default;

  const contactLabel = copy.prod_section_talk_distributor;

  const productsIntro = copy.prod_section_intro;

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
            <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-6 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                {copy.prod_section_recommended}
              </p>
              <h3 className="text-xl font-bold text-white mb-2">
                {copy.prod_section_duo_title}
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                {copy.prod_section_duo_body}
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
                      {pCopy?.downloadGuide ?? copy.prod_section_guides_in_training}
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
