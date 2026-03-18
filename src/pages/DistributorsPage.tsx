import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TLBackground } from "@/components/ui/TLBackground";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";
import { Calendar, Globe, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";

const DISTRIBUTORS = [
  {
    name: "Mehdi Cohen",
    title: "True Legacy World",
    photo: "/leaders/mehdi-hero.png",
    fallbackInitial: "M",
    website: "https://mehdicohen.com",
    whatsapp:
      "https://api.whatsapp.com/send/?phone=18649072149&text&type=phone_number&app_absent=0",
    latamWhatsapp: "https://wa.me/+573001844049",
    calendly: "https://calendly.com/aquacharged/true-legacy-one-on-one",
    telegram: "https://t.me/mehdicohen",
    instagram: "https://www.instagram.com/mehdicohen/",
    region: "Global & LATAM",
  },
  {
    name: "Zah Naderi",
    title: "True Legacy Leader",
    photo: "/leaders/zah-hero.png",
    fallbackInitial: "Z",
    website: "https://zahphysique.com",
    instagram: "https://www.instagram.com/zahphysique/",
    region: "Global",
  },
];

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function DistributorsPage() {
  const { locale } = useLocaleContext();

  const isSpanish = locale === "es" || locale === "pt";

  const title = isSpanish
    ? "Distribuidores True Legacy"
    : locale === "fr"
      ? "Distributeurs True Legacy"
      : "True Legacy Distributors";

  const subtitle = isSpanish
    ? "Conecta con un líder cerca de ti. WhatsApp, sitio web y redes para comenzar tu camino."
    : locale === "fr"
      ? "Connectez-vous avec un leader près de chez vous. WhatsApp, site web et réseaux pour commencer."
      : "Connect with a leader near you. WhatsApp, website and socials to start your journey.";

  const whatsappLabel = "WhatsApp";
  const websiteLabel = isSpanish
    ? "Sitio web"
    : locale === "fr"
      ? "Site web"
      : "Website";

  return (
    <div className="page-wrapper" style={{ background: "#060b1e" }}>
      <Navbar />
      <main className="content-wrapper">
        <TLBackground className="pt-28 pb-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-tl-gold opacity-80"
            >
              True Legacy World
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white leading-tight mb-4 font-display font-bold text-3xl md:text-4xl"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          </div>
        </TLBackground>

        <section className="py-12 md:py-16" style={{ background: "#070c1a" }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
            {DISTRIBUTORS.map((dist, index) => (
              <DistributorCard
                key={dist.name}
                dist={dist}
                index={index}
                whatsappLabel={whatsappLabel}
                websiteLabel={websiteLabel}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function DistributorCard({
  dist,
  index,
  whatsappLabel,
  websiteLabel,
}: {
  dist: (typeof DISTRIBUTORS)[0];
  index: number;
  whatsappLabel: string;
  websiteLabel: string;
}) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      className="rounded-2xl border border-white/10 bg-[rgba(5,16,48,0.8)] p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
    >
      <div className="shrink-0 w-32 sm:w-48 h-32 sm:h-76 rounded-2xl border-2 border-white/10 overflow-hidden bg-cyan-500/10 flex items-center justify-center">
        {!imgError ? (
          <img
            src={dist.photo}
            alt={dist.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : null}
        {(imgError || !dist.photo) && (
          <span className="text-cyan-400 font-bold text-2xl">
            {dist.fallbackInitial}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-white mb-1">{dist.name}</h2>
        <p className="text-slate-400 text-sm mb-4">{dist.title}</p>
        <p className="text-slate-500 text-xs mb-4">{dist.region}</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {dist.whatsapp && (
            <a
              href={dist.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-4 py-3 text-sm min-h-11 transition-colors"
            >
              <IconWhatsApp className="w-5 h-5 shrink-0" />
              {whatsappLabel}
            </a>
          )}
          {(dist as any).latamWhatsapp && (
            <a
              href={(dist as any).latamWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-4 py-3 text-sm min-h-11 transition-colors"
            >
              <IconWhatsApp className="w-5 h-5 shrink-0" />
              WhatsApp (LATAM)
            </a>
          )}
          {dist.calendly && (
            <a
              href={dist.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 text-sm min-h-11 transition-colors"
            >
              <Calendar className="w-5 h-5 shrink-0" />
              Book a Call
            </a>
          )}
          {dist.website && (
            <a
              href={dist.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-4 py-3 text-sm min-h-11 transition-colors"
            >
              <Globe className="w-5 h-5 shrink-0" />
              {websiteLabel}
            </a>
          )}
          {dist.telegram && (
            <a
              href={dist.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] hover:bg-[#1E8BC7] text-white font-semibold px-4 py-3 text-sm min-h-11 transition-colors"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              Telegram
            </a>
          )}
          {dist.instagram && (
            <a
              href={dist.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-3 text-sm min-h-11 transition-colors"
            >
              <Instagram className="w-5 h-5 shrink-0" />
              Instagram
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
