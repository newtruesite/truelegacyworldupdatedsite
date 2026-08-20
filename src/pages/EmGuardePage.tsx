import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { COUNTRIES } from "@/lib/countries";
import { getDistributorLink } from "@/lib/distributorRouter";
import { localizedProductVideo } from "@/lib/productVideos";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import {
    Battery,
    CheckCircle,
    Download,
    ExternalLink,
    Globe,
    Play,
    Shield,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const FEATURES_EN = [
  { icon: Shield, text: "Set of 2 portable devices" },
  { icon: Zap, text: "Approximately 10-foot coverage diameter per device" },
  { icon: Battery, text: "Rechargeable 5,000 mAh battery" },
  { icon: CheckCircle, text: "Convenient USB-C charging" },
  { icon: Globe, text: "Designed for home, office, car, and travel" },
];
const FEATURES_ES = [
  { icon: Shield, text: "Juego de 2 dispositivos portátiles" },
  { icon: Zap, text: "Aproximadamente 10 pies de cobertura por dispositivo" },
  { icon: Battery, text: "Batería recargable de 5,000 mAh" },
  { icon: CheckCircle, text: "Práctica carga USB-C" },
  { icon: Globe, text: "Diseñado para hogar, oficina, auto y viajes" },
];

const GO_COPY = {
  en: { badge: "New Portable EMF Support", headline: "Protection That Goes", accent: "Where You Go.", sub: "emGuarde GO comes as a set of two compact, rechargeable devices designed to support a more balanced environment wherever life takes you.", detail: "Set of 2 — Compact, rechargeable, and travel-ready" },
  es: { badge: "Nuevo Soporte EMF Portátil", headline: "Protección Que Va", accent: "Contigo.", sub: "emGuarde GO viene en un juego de dos dispositivos compactos y recargables, diseñados para apoyar un ambiente más equilibrado dondequiera que vayas.", detail: "Juego de 2 — Compacto, recargable y listo para viajar" },
  fr: { badge: "Nouveau Soutien EMF Portable", headline: "Une Protection Qui Vous", accent: "Accompagne.", sub: "emGuarde GO est proposé en lot de deux appareils compacts et rechargeables, conçus pour favoriser un environnement plus équilibré partout où vous allez.", detail: "Lot de 2 — Compact, rechargeable et prêt à voyager" },
  pt: { badge: "Novo Suporte EMF Portátil", headline: "Proteção Que Vai", accent: "Com Você.", sub: "O emGuarde GO vem em um conjunto de dois dispositivos compactos e recarregáveis, projetados para apoiar um ambiente mais equilibrado onde você estiver.", detail: "Conjunto de 2 — Compacto, recarregável e pronto para viajar" },
} as const;

const EMF_STATS = [
  {
    pct: "71%",
    labelEn: "report sleep problems",
    labelEs: "reportan problemas de sueño",
  },
  { pct: "64%", labelEn: "experience fatigue", labelEs: "experimentan fatiga" },
  {
    pct: "61%",
    labelEn: "have cognitive difficulties",
    labelEs: "tienen dificultades cognitivas",
  },
  {
    pct: "60%",
    labelEn: "feel stress & anxiety",
    labelEs: "sienten estrés y ansiedad",
  },
];

export default function EmGuardePage() {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const country =
    COUNTRIES.find((c) => c.slug === countrySlug) ??
    COUNTRIES.find((c) => c.slug === "usa")!;
  const { locale } = useLocaleContext();
  const copy = t[locale];
  const goCopy = GO_COPY[locale];
  const jotformUrl =
    country.jotformUrl ?? "/apply";
  const isSpanish = locale === "es";
  const FEATURES = isSpanish ? FEATURES_ES : FEATURES_EN;
  const emguardeDemoUrl = localizedProductVideo("emguardeGo", locale);

  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <div className="page-wrapper bg-black">
      <SEO
        title={
          locale === "es"
            ? `emGuarde GO Protección EMF Portátil${countrySlug ? ` en ${country.name}` : ""} | True Legacy`
            : locale === "fr"
              ? `emGuarde GO Soutien EMF Portable${countrySlug ? ` en ${country.name}` : ""} | True Legacy`
              : `emGuarde GO Portable EMF Support${countrySlug ? ` in ${country.name}` : ""} | True Legacy`
        }
        description={
          locale === "es"
            ? `Descubre el nuevo set de dos emGuarde GO: dispositivos compactos, recargables y portátiles con carga USB-C. ${countrySlug ? `Información para ${country.name}.` : ""}`
            : locale === "fr"
              ? `Découvrez le nouveau lot de deux emGuarde GO : des appareils compacts, rechargeables et portables avec charge USB-C. ${countrySlug ? `Informations pour ${country.name}.` : ""}`
              : `Discover the new emGuarde GO set of two compact, rechargeable portable devices with USB-C charging. ${countrySlug ? `Information for ${country.name}.` : ""}`
        }
        image="/products/emguarde-go.png"
        canonical={`https://truelegacyworld.com${countrySlug ? `/${countrySlug}` : ""}/emguarde`}
      />
      <Navbar />

      <AuroraBackground className="pt-28 pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 pt-8"
          >
            <span className="inline-block mb-4 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#2997ff]">
              {goCopy.badge}
            </span>
            <h1 className="page-hero-title mb-6">
              {goCopy.headline}
              <br />
              <span className="gradient-text">
                {goCopy.accent}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl text-[#cccccc] leading-relaxed mb-8">
              {goCopy.sub}
            </p>

            {/* VSL-style video embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <YouTubeEmbed
                url={emguardeDemoUrl}
                title="emGuarde GO portable EMF support"
              />
            </motion.div>
          </motion.div>

          {/* Product Visual + Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl border border-white/10 p-10 flex items-center justify-center min-h-[350px] bg-black/20"
            >
              <div className="text-center w-full">
                {!heroImgError ? (
                  <img
                    src="/products/emguarde-go.png"
                    alt="emGuarde GO portable device set of two by Enagic"
                    className="max-h-[280px] w-full max-w-[600px] object-contain mx-auto mb-4"
                    style={{
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
                    }}
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget;
                      if (t.src.includes("emguarde")) {
                        t.src = "/products/emguarde-go.png";
                        t.onerror = () => setHeroImgError(true);
                      } else setHeroImgError(true);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-24 h-24 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                      <Shield className="w-12 h-12 text-[#2997ff]" />
                    </div>
                    <span className="text-white font-bold text-xl">
                      emGuarde GO™
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">
                  emGuarde GO™
                </h3>
                <p className="text-[#cccccc] text-sm">
                  {goCopy.detail}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {copy.emguarde.featuresTitle}
              </h2>
              {FEATURES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-4 glass rounded-xl border border-white/10 p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#2997ff]" />
                  </div>
                  <span className="text-slate-200 font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* The Unseen Side Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border border-white/10 p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {copy.emguarde.statsTitle}
            </h2>
            <p className="text-[#cccccc] text-lg leading-relaxed mb-10">
              {copy.emguarde.statsSub}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {EMF_STATS.map(({ pct, labelEn, labelEs }) => (
                <div
                  key={pct}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/5"
                >
                  <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">
                    {pct}
                  </div>
                  <div className="text-sm text-[#cccccc]">
                    {isSpanish ? labelEs : labelEn}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#86868b] mt-6 text-center">
              {isSpanish
                ? "Fuente: EMF Safety Network – Estudio 2019"
                : "Source: EMF Safety Network – 2019 Study"}
            </p>
          </motion.div>

          {/* CTA Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          >
            <a
              href="https://www.enagic.com/en_US/product-certifications"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />{" "}
              {copy.emguarde.certifications}
            </a>
            <a
              href={emguardeDemoUrl}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-red-600/80 hover:bg-red-600 px-6 py-4 text-sm font-semibold text-white transition-all"
            >
              <Play className="w-4 h-4" /> {copy.emguarde.watchVideo}
            </a>
            <a
              href="https://emguarde.com/"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-sm font-semibold text-white hover:scale-105 transition-all"
            >
              <ExternalLink className="w-4 h-4" /> {copy.emguarde.learnMore}
            </a>
            <Link
              to={countrySlug ? `/${countrySlug}/training` : "/training"}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all min-h-[48px] hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 text-[#2997ff]" />{" "}
              {copy.emguarde.downloadPdf}
            </Link>
            <Link
              to={getDistributorLink(countrySlug)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-4 text-sm min-h-[48px] transition-all hover:scale-[1.02] w-full sm:w-auto"
            >
              {isSpanish
                ? "Hablar con distribuidor"
                : locale === "fr"
                  ? "Parler à un distributeur"
                  : locale === "pt"
                    ? "Falar com distribuidor"
                    : "Talk to a distributor"}
            </Link>
          </motion.div>

          {/* CTA button above back link */}
          <div className="flex justify-center mb-8 px-4">
            <a
              href={jotformUrl}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-2xl transition-all hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
            >
              {copy.unlockLegacy}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Back */}
          <div className="text-center pb-16">
            <Link
              to={`/${countrySlug}`}
              className="inline-flex items-center gap-2 text-sm text-[#cccccc] hover:text-white transition-colors"
            >
              {copy.emguarde.backLink} {country.name}
            </Link>
          </div>
        </div>
      </AuroraBackground>

      <Footer />
    </div>
  );
}
