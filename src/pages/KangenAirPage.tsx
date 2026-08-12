import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { SEO } from "@/components/SEO"
import { AuroraBackground } from "@/components/ui/AuroraBackground"
import { useLocaleContext } from "@/contexts/LocaleContext"
import { COUNTRIES } from "@/lib/countries"
import { getDistributorLink } from "@/lib/distributorRouter"
import { t } from "@/lib/translations"
import { motion } from "framer-motion"
import {
    CheckCircle,
    Download,
    Fan,
    Leaf,
    Shield,
    Sun,
    Zap,
} from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"

const FEATURES_EN = [
  { icon: Sun, text: "Photocatalytic oxidation technology" },
  { icon: Zap, text: "UV LED light disinfection" },
  { icon: Shield, text: "No harmful ozone emissions" },
  { icon: Fan, text: "Compact, portable design" },
  { icon: Leaf, text: "Low energy consumption" },
]
const FEATURES_ES = [
  { icon: Sun, text: "Tecnología de oxidación fotocatalítica" },
  { icon: Zap, text: "Desinfección con luz UV LED" },
  { icon: Shield, text: "Sin emisiones de ozono dañinas" },
  { icon: Fan, text: "Diseño compacto y portátil" },
  { icon: Leaf, text: "Bajo consumo de energía" },
]
const FEATURES_FR = [
  { icon: Sun, text: "Technologie d'oxydation photocatalytique" },
  { icon: Zap, text: "Désinfection par lumière UV LED" },
  { icon: Shield, text: "Aucune émission d'ozone nocif" },
  { icon: Fan, text: "Design compact et portable" },
  { icon: Leaf, text: "Faible consommation d'énergie" },
]
const FEATURES_PT = [
  { icon: Sun, text: "Tecnologia de oxidação fotocatalítica" },
  { icon: Zap, text: "Desinfecção com luz UV LED" },
  { icon: Shield, text: "Sem emissões de ozônio nocivo" },
  { icon: Fan, text: "Design compacto e portátil" },
  { icon: Leaf, text: "Baixo consumo de energia" },
]

const FEATURES_MAP = { en: FEATURES_EN, es: FEATURES_ES, fr: FEATURES_FR, pt: FEATURES_PT } as const

export default function KangenAirPage() {
  const { countrySlug } = useParams<{ countrySlug: string }>()
  const country =
    COUNTRIES.find((c) => c.slug === countrySlug) ??
    COUNTRIES.find((c) => c.slug === "usa") ??
    COUNTRIES[0]
  const { locale } = useLocaleContext()
  const copy = t[locale]
  const jotformUrl =
    country.jotformUrl ?? "/apply"
  const FEATURES = FEATURES_MAP[locale] ?? FEATURES_EN

  const [heroImgError, setHeroImgError] = useState(false)

  return (
    <div className="page-wrapper bg-[#070b16]">
      <SEO
        title={
          locale === "es"
            ? `Kangen Air Purificador de Aire${countrySlug ? ` en ${country.name}` : ""} | True Legacy`
            : locale === "fr"
              ? `Kangen Air Purificateur d'Air${countrySlug ? ` en ${country.name}` : ""} | True Legacy`
              : locale === "pt"
                ? `Kangen Air Purificador de Ar${countrySlug ? ` em ${country.name}` : ""} | True Legacy`
                : `Kangen Air Purifier${countrySlug ? ` in ${country.name}` : ""} | True Legacy`
        }
        description={
          locale === "es"
            ? `Kangen Air combina oxidación fotocatalítica y UV LED para purificar el aire sin ozono. ${countrySlug ? `Disponible en ${country.name}. ` : ""}Descubre la purificación de aire de nueva generación.`
            : locale === "fr"
              ? `Kangen Air combine l'oxydation photocatalytique et les UV LED pour purifier l'air sans ozone. ${countrySlug ? `Disponible en ${country.name}. ` : ""}Découvrez la purification de l'air nouvelle génération.`
              : locale === "pt"
                ? `Kangen Air combina oxidação fotocatalítica e UV LED para purificar o ar sem ozônio. ${countrySlug ? `Disponível em ${country.name}. ` : ""}Descubra a purificação de ar de nova geração.`
                : `Kangen Air combines photocatalytic oxidation and UV LED to purify air without ozone. ${countrySlug ? `Available in ${country.name}. ` : ""}Experience next-generation air purification technology.`
        }
        image="/products/kangen-air.png"
        canonical={`https://truelegacyworld.com${countrySlug ? `/${countrySlug}` : ""}/kangen-air`}
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
            <span className="inline-block mb-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              {copy.kangen_air.badge}
            </span>
            <h1 className="page-hero-title mb-6">
              {copy.kangen_air.headline}
              <br />
              <span className="gradient-text">
                {copy.kangen_air.headlineAccent}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl text-slate-400 leading-relaxed mb-8">
              {copy.kangen_air.sub}
            </p>
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
                    src="/products/kangen-air.png"
                    alt="Kangen Air purifier by Enagic"
                    className="max-h-[280px] w-auto object-contain mx-auto mb-4"
                    onError={() => setHeroImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-24 h-24 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                      <Fan className="w-12 h-12 text-emerald-400" />
                    </div>
                    <span className="text-white font-bold text-xl">
                      Kangen Air
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">
                  Kangen Air
                </h3>
                <p className="text-slate-400 text-sm">
                  {FEATURES[0].text}
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
                {copy.kangen_air.featuresTitle}
              </h2>
              {FEATURES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-4 glass rounded-xl border border-white/10 p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-slate-200 font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border border-emerald-500/20 p-8 md:p-12 mb-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Sun className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              {copy.kangen_air.howItWorksTitle}
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              {copy.kangen_air.howItWorksSub}
            </p>
          </motion.div>

          {/* Ordering Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border border-white/10 p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              {copy.kangen_air.orderingTitle}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 text-center max-w-2xl mx-auto">
              {copy.kangen_air.orderingSub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={getDistributorLink(countrySlug)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-emerald-500/70 hover:bg-emerald-400 text-white font-semibold px-6 py-4 text-sm min-h-[48px] transition-all hover:scale-[1.02] w-full sm:w-auto"
              >
                {copy.kangen_air.talkToDistributor}
              </Link>
            </div>
          </motion.div>

          {/* CTA Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
          >
            <a
              href="https://www.enagic.com/en_US/product-certifications"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />{" "}
              {copy.kangen_air.certifications}
            </a>
            <Link
              to={countrySlug ? `/${countrySlug}/training` : "/training"}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all min-h-[48px] hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 text-cyan-400" />{" "}
              {copy.kangen_air.downloadPdf}
            </Link>
            <Link
              to={getDistributorLink(countrySlug)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-4 text-sm min-h-[48px] transition-all hover:scale-[1.02] w-full sm:w-auto"
            >
              {copy.kangen_air.talkToDistributor}
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
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {copy.kangen_air.backLink} {country.name}
            </Link>
          </div>
        </div>
      </AuroraBackground>

      <Footer />
    </div>
  )
}
