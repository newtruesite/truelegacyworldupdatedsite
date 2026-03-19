import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { COUNTRIES } from "@/lib/countries";
import { getDistributorLink } from "@/lib/distributorRouter";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Cpu,
  Download,
  Droplets,
  ExternalLink,
  Globe,
  Layers,
  Play,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const FEATURES_EN = [
  { icon: Layers, text: "8 Platinum-Coated Titanium Plates" },
  { icon: Globe, text: "Multi-voltage for international use" },
  { icon: Cpu, text: "Intuitive interface & automated settings" },
  { icon: CheckCircle, text: "Energy-efficient design" },
  { icon: Droplets, text: "5 distinct types of ionized water" },
];
const FEATURES_ES = [
  { icon: Layers, text: "8 placas de titanio recubiertas de platino" },
  { icon: Globe, text: "Multivoltaje para uso internacional" },
  { icon: Cpu, text: "Interfaz intuitiva y ajustes automáticos" },
  { icon: CheckCircle, text: "Diseño energéticamente eficiente" },
  { icon: Droplets, text: "5 tipos distintos de agua ionizada" },
];

export default function K8Page() {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const country =
    COUNTRIES.find((c) => c.slug === countrySlug) ??
    COUNTRIES.find((c) => c.slug === "usa") ??
    COUNTRIES[0];
  const { locale } = useLocaleContext();
  const copy = t[locale];
  const jotformUrl =
    country.jotformUrl ?? "https://form.jotform.com/260232994952060";
  const isSpanish = locale === "es";
  const FEATURES = isSpanish ? FEATURES_ES : FEATURES_EN;

  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <div className="page-wrapper bg-[#070b16]">
      <SEO
        title={
          locale === "es"
            ? `Leveluk K8 Máquina de Aqua Kangen${countrySlug ? ` en ${country.name}` : ""} | True Legacy`
            : locale === "fr"
              ? `Leveluk K8 Machine à Eau Kangen${countrySlug ? ` en ${country.name}` : ""} | True Legacy`
              : `Leveluk K8 Kangen Water Machine${countrySlug ? ` in ${country.name}` : ""} | True Legacy`
        }
        description={
          locale === "es"
            ? `El Leveluk K8 es la máquina de agua ionizada más potente de Enagic con 8 placas de titanio bañadas en platino. ${countrySlug ? `Disponible en ${country.name}. ` : ""}Descubre el poder de Aqua Kangen hoy.`
            : locale === "fr"
              ? `Le Leveluk K8 est la machine à eau ionisée la plus puissante d'Enagic avec 8 plaques en titane plaqué platine. ${countrySlug ? `Disponible en ${country.name}. ` : ""}Découvrez la puissance de l'eau Kangen aujourd'hui.`
              : `The Leveluk K8 is Enagic's most powerful ionized water machine featuring 8 platinum-dipped titanium plates. ${countrySlug ? `Available in ${country.name}. ` : ""}Experience premium antioxidant water today.`
        }
        image="/products/k8.png"
        canonical={`https://truelegacyworld.com${countrySlug ? `/${countrySlug}` : ""}/k8`}
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
            <span className="inline-block mb-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
              {copy.k8.badge}
            </span>
            <h1 className="page-hero-title mb-6">
              {copy.k8.headline}
              <br />
              <span className="gradient-text">{copy.k8.headlineAccent}</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl text-slate-400 leading-relaxed mb-8">
              {copy.k8.sub}
            </p>

            {/* VSL-style video embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <YouTubeEmbed
                url="https://youtu.be/Lm2DYOwU2rc?si=qSI-i8XX8EOv6ZUC"
                title="Leveluk K8 Kangen Water Machine"
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
                    src="/products/k8.png"
                    alt="Leveluk K8 Kangen Water machine"
                    className="max-h-[280px] w-auto object-contain mx-auto mb-4"
                    onError={() => setHeroImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-24 h-24 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                      <Droplets className="w-12 h-12 text-cyan-400" />
                    </div>
                    <span className="text-white font-bold text-xl">
                      Leveluk K8
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">
                  Leveluk K8
                </h3>
                <p className="text-slate-400 text-sm">{FEATURES[0].text}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {copy.k8.featuresTitle}
              </h2>
              {FEATURES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-4 glass rounded-xl border border-white/10 p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-slate-200 font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 5 Water Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              {copy.k8.waterTypesTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {copy.waterTypes.map(({ name, use, color }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl border border-white/10 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${color}`} />
                  <div className="p-5">
                    <h4 className="font-bold text-white text-sm mb-2">
                      {name}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {use}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 8 Plates Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border border-cyan-500/20 p-8 md:p-12 mb-16 text-center"
          >
            <div className="text-6xl font-bold gradient-text mb-4">8</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              {copy.k8.titaniumTitle}
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              {copy.k8.titaniumSub}
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
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />{" "}
              {copy.k8.certifications}
            </a>
            <a
              href="https://youtu.be/Lm2DYOwU2rc?si=qSI-i8XX8EOv6ZUC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-red-600/80 hover:bg-red-600 px-6 py-4 text-sm font-semibold text-white transition-all"
            >
              <Play className="w-4 h-4" /> {copy.k8.watchVideo}
            </a>
            <a
              href="https://www.enagic.com/en_US/products/leveluk-k8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 text-sm font-semibold text-white hover:scale-105 transition-all"
            >
              <ExternalLink className="w-4 h-4" /> {copy.k8.learnMore}
            </a>
            <Link
              to={countrySlug ? `/${countrySlug}/training` : "/training"}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all min-h-[48px] hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 text-cyan-400" />{" "}
              {copy.k8.downloadPdf}
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
          <div className="text-center mb-8">
            <a
              href={jotformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105"
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
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {copy.k8.backLink} {country.name}
            </Link>
          </div>
        </div>
      </AuroraBackground>

      <Footer />
    </div>
  );
}
