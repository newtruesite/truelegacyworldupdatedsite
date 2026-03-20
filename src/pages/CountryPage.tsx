import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductSection } from "@/components/products/ProductSection";
import { FlagIntro } from "@/components/ui/FlagIntro";
import { TestimonialsSplit } from "@/components/ui/split-testimonial";
import { TLBackground } from "@/components/ui/TLBackground";
import { VSLPlayer } from "@/components/ui/VSLPlayer";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { trackEvent } from "@/lib/analytics";
import type { Country } from "@/lib/countries";
import { COUNTRIES, getCountryBySlug, getFlagSrcSet } from "@/lib/countries";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

// ── Custom SVG Icons (no emojis) ──────────────────────────────
function IconArrow({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconYoutube({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#FF0000" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}
function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconWhatsapp({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
function IconUsers({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
// PDF section icons (high-quality SVG, no emojis)
type PdfIconKey = "water" | "shower" | "money" | "leaf" | "meat" | "wrench";

function PdfIcon({
  name,
  className,
}: {
  name: PdfIconKey;
  className?: string;
}) {
  const size = 32;
  const wrap = (children: React.ReactNode) => (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
  switch (name) {
    case "water":
      return wrap(<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />);
    case "shower":
      return wrap(
        <>
          <path d="M4 12a8 8 0 0 1 16 0" />
          <path d="M6 15v3m0 0v3m0-3h3m-3 0H6" />
          <path d="M12 15v3m0 0v3m0-3h3m-3 0h-3" />
          <path d="M18 15v3m0 0v3m0-3h3m-3 0h-3" />
        </>,
      );
    case "money":
      return wrap(
        <>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </>,
      );
    case "leaf":
      return wrap(
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />,
      );
    case "meat":
      return wrap(
        <>
          <path d="M6 12c0-2.5 1.5-5 3-6.5S12 4 12 4s2.5 1.5 4 2.5 3 4 3 6.5-1 5-3 5-5 1.5-6.5 1-3.5 0-4.5-1.5-1.5-2.5-1" />
          <path d="M8 16c-1.5 0-2-.5-2.5-1.5" />
        </>,
      );
    case "wrench":
      return wrap(
        <>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </>,
      );
    default:
      return wrap(<circle cx="12" cy="12" r="10" />);
  }
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconDollar({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IconGlobe({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconTrendingUp({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

const IMG_WRAPPER_CLASS =
  "rounded-[1.5rem] overflow-hidden border-[2px] border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COUNTRY_LEADERS: Record<
  string,
  Array<{
    name: string;
    role: string;
    image: string;
    intro: string;
    instagram?: string;
  }>
> = {
  usa: [
    {
      name: "Coach Mehdi",
      role: "Global Founder & Market Builder",
      image: "/leaders/mehdi-hero.png",
      intro:
        "After 24 years in the U.S., Mehdi expanded into Morocco and Colombia — mentoring leaders who want to build intentional, flexible lives with Enagic.",
      instagram: "https://www.instagram.com/mehdicohen_/",
    },
    {
      name: "Coach Zah",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/zah-hero.png",
      intro:
        "From coaching elite performers to guiding entrepreneurs, Zah brings performance, leadership, and leverage together to build generational legacy.",
      instagram: "https://www.instagram.com/zahphysique/",
    },
  ],
  canada: [
    {
      name: "Coach Zah",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/zah-hero.png",
      intro:
        "Supporting Canadian leaders who want to combine world-class performance with long-term financial freedom through True Legacy.",
      instagram: "https://www.instagram.com/zahphysique/",
    },
  ],
  morocco: [
    {
      name: "Coach Mehdi",
      role: "Regional Expansion · Morocco",
      image: "/leaders/mehdi-hero.png",
      intro:
        "Helping open new markets in North Africa while mentoring leaders who want to build with purpose and long-term vision.",
      instagram: "https://www.instagram.com/mehdicohen_/",
    },
  ],
  nigeria: [
    {
      name: "Coach Simon Loh",
      role: "Global Entrepreneur & Strategist",
      image: "/leaders/simon-hero.png",
      intro:
        "Supporting expansion into Nigeria and beyond, helping leaders apply disciplined, proven business strategies in fast-growing markets.",
      instagram: "https://www.instagram.com/simonloh_/",
    },
  ],
  colombia: [
    {
      name: "Coach Mehdi",
      role: "Regional Expansion · Colombia",
      image: "/leaders/mehdi-hero.png",
      intro:
        "Leading the launch of new LATAM markets from Colombia, uniting health, leadership, and long-term opportunity.",
      instagram: "https://www.instagram.com/mehdicohen_/",
    },
    {
      name: "Coach Magaly",
      role: "Coach & Impact-Driven Entrepreneur",
      image: "/leaders/magaly-hero.png",
      intro:
        "Helping Spanish-speaking leaders build businesses that align with their values, health, and families across Latin America.",
      instagram: "https://www.instagram.com/mcardonita/",
    },
  ],
  brazil: [
    {
      name: "Coach Ming Way",
      role: "Business Builder & Mentor",
      image: "/leaders/mingway-hero.png",
      intro:
        "Partnering with Brazilian leaders who want to build disciplined, sustainable businesses that create long-term legacy.",
      instagram: "https://www.instagram.com/mingwaysia/",
    },
  ],
  mexico: [
    {
      name: "Coach Zah",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/zah-hero.png",
      intro:
        "Bringing a decade of high-performance coaching to help leaders in Mexico build strong wellness businesses with Enagic.",
      instagram: "https://www.instagram.com/zahphysique/",
    },
  ],
  paraguay: [
    {
      name: "Coach Magaly",
      role: "Coach & Impact-Driven Entrepreneur",
      image: "/leaders/magaly-hero.png",
      intro:
        "Supporting leaders in Paraguay and across LATAM who want to build more intentional, family-centered financial futures.",
      instagram: "https://www.instagram.com/mcardonita/",
    },
  ],
  turkey: [
    {
      name: "Coach Mehdi",
      role: "Global Founder & Market Builder",
      image: "/leaders/mehdi-hero.png",
      intro:
        "Expanding True Legacy into Turkey and Europe — mentoring leaders who want to build intentional, flexible lives with Enagic.",
      instagram: "https://www.instagram.com/mehdicohen_/",
    },
    {
      name: "Coach Zah",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/zah-hero.png",
      intro:
        "Bringing high-performance coaching to Turkish entrepreneurs who want to combine wellness and long-term financial freedom.",
      instagram: "https://www.instagram.com/zahphysique/",
    },
  ],
};

type PdfConfig = {
  icon: PdfIconKey;
  title: string;
  desc: string;
  url: string;
  name: string;
  badge?: string;
};

type PdfSectionConfig = {
  sectionTitle: string;
  sectionSubtitle: string;
  ctaLabel: string;
  pdfs: PdfConfig[];
};

const PDF_SECTION_CONTENT: Record<"en" | "es" | "fr" | "pt", PdfSectionConfig> =
  {
    en: {
      sectionTitle: "Free Resources to Start Your Journey",
      sectionSubtitle:
        "Download our exclusive guides. Learn the products, master the business, and start building your True Legacy.",
      ctaLabel: "Get Free Access →",
      pdfs: [
        {
          icon: "water",
          title: "Kangen Water Machines Complete Guide",
          desc: "Everything you need to know about all 6 Kangen machines — specs, benefits, pricing, and which machine is right for each customer.",
          url: "https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf",
          name: "Kangen Water Ionizers Guide",
          badge: "Most Popular",
        },
        {
          icon: "shower",
          title: "Anespa DX Shower System Guide",
          desc: "Discover how the Anespa DX turns a daily shower into a mineral hot-spring spa experience your customers will talk about.",
          url: "https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf",
          name: "Anespa DX Guide",
        },
        {
          icon: "money",
          title: "The 8-Point Compensation Plan",
          desc: "Understand exactly how you earn as a True Legacy distributor. This is the document every serious builder studies first.",
          url: "https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf",
          name: "Compensation Plan Guide",
          badge: "Essential",
        },
        {
          icon: "leaf",
          title: "Kangen Ukon Turmeric Guide",
          desc: "Wild Okinawan turmeric, the science behind curcumin, and why this product is a perfect add-on for health-conscious buyers.",
          url: "https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf",
          name: "Kangen Ukon Guide",
        },
        {
          icon: "meat",
          title: "Kangen Wagyu Beef Guide",
          desc: "Premium hormone-free Wagyu beef raised on Kangen Water. A conversation-starting product for high-end customers.",
          url: "https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf",
          name: "Kangen Wagyu Guide",
        },
        {
          icon: "wrench",
          title: "Machine Care & Maintenance",
          desc: "Keep customers happy for life. Proper machine care reduces returns, builds trust, and generates referrals on autopilot.",
          url: "https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf",
          name: "Machine Care Guide",
        },
      ],
    },
    es: {
      sectionTitle: "Recursos Gratuitos Para Empezar Tu Viaje",
      sectionSubtitle:
        "Descarga nuestras guías exclusivas. Aprende los productos, domina el negocio y empieza a construir tu True Legacy.",
      ctaLabel: "Obtener Acceso Gratuito →",
      pdfs: [
        {
          icon: "water",
          title: "Guía Completa de Máquinas Aqua Kangen",
          desc: "Todo lo que necesitas saber sobre las 6 máquinas Kangen — especificaciones, beneficios, precios y cuál es la ideal para cada cliente.",
          url: "https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf",
          name: "Guía de Ionizadores Kangen",
          badge: "Más Popular",
        },
        {
          icon: "shower",
          title: "Guía del Sistema de Ducha Anespa DX",
          desc: "Descubre cómo el Anespa DX convierte tu ducha diaria en una experiencia de spa de aguas termales japonesas.",
          url: "https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf",
          name: "Guía Anespa DX",
        },
        {
          icon: "money",
          title: "El Plan de Compensación de 8 Puntos",
          desc: "Entiende exactamente cómo ganas dinero como distribuidor de True Legacy. Documento clave para construir ingresos serios.",
          url: "https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf",
          name: "Guía del Plan de Compensación",
          badge: "Esencial",
        },
        {
          icon: "leaf",
          title: "Guía de Cúrcuma Kangen Ukon",
          desc: "Cúrcuma silvestre de Okinawa. Beneficios para la salud y por qué este producto se vende solo cuando lo entiendes bien.",
          url: "https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf",
          name: "Guía Kangen Ukon",
        },
        {
          icon: "meat",
          title: "Guía de Kangen Wagyu Beef",
          desc: "Carne Wagyu premium libre de hormonas, criada con Aqua Kangen. Perfecta para clientes que aman el lujo y la salud.",
          url: "https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf",
          name: "Guía Kangen Wagyu",
        },
        {
          icon: "wrench",
          title: "Cuidado y Mantenimiento de Máquinas",
          desc: "Mantén a tus clientes felices de por vida. El mantenimiento correcto reduce devoluciones y genera recomendaciones.",
          url: "https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf",
          name: "Guía de Mantenimiento",
        },
      ],
    },
    fr: {
      sectionTitle: "Ressources Gratuites Pour Démarrer",
      sectionSubtitle:
        "Téléchargez nos guides exclusifs. Apprenez les produits, maîtrisez le business et commencez à construire votre True Legacy.",
      ctaLabel: "Obtenir un Accès Gratuit →",
      pdfs: [
        {
          icon: "water",
          title: "Guide Complet des Machines Kangen Water",
          desc: "Tout ce que vous devez savoir sur les 6 machines Kangen — spécifications, bénéfices, prix et quelle machine convient à chaque client.",
          url: "https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf",
          name: "Guide des Ioniseurs Kangen",
          badge: "Le Plus Populaire",
        },
        {
          icon: "shower",
          title: "Guide du Système de Douche Anespa DX",
          desc: "Découvrez comment l’Anespa DX transforme votre douche quotidienne en une expérience de spa aux sources thermales japonaises.",
          url: "https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf",
          name: "Guide Anespa DX",
        },
        {
          icon: "money",
          title: "Le Plan de Rémunération en 8 Points",
          desc: "Comprenez exactement comment vous gagnez en tant que distributeur True Legacy. Le document à maîtriser pour bâtir des revenus solides.",
          url: "https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf",
          name: "Guide du Plan de Rémunération",
          badge: "Essentiel",
        },
        {
          icon: "leaf",
          title: "Guide du Curcuma Kangen Ukon",
          desc: "Curcuma sauvage d’Okinawa. Les bienfaits pour la santé et pourquoi ce produit se vend pratiquement tout seul.",
          url: "https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf",
          name: "Guide Kangen Ukon",
        },
        {
          icon: "meat",
          title: "Guide du Kangen Wagyu Beef",
          desc: "Boeuf Wagyu premium sans hormones, élevé à l’eau Kangen. Un produit unique pour vos clients haut de gamme.",
          url: "https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf",
          name: "Guide Kangen Wagyu",
        },
        {
          icon: "wrench",
          title: "Entretien & Maintenance des Machines",
          desc: "Gardez vos clients satisfaits à vie. Un bon entretien réduit les retours et génère des recommandations naturelles.",
          url: "https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf",
          name: "Guide d’Entretien",
        },
      ],
    },
    pt: {
      sectionTitle: "Recursos Gratuitos Para Começar Sua Jornada",
      sectionSubtitle:
        "Baixe nossos guias exclusivos. Aprenda os produtos, domine o negócio e comece a construir seu True Legacy.",
      ctaLabel: "Obter Acesso Gratuito →",
      pdfs: [
        {
          icon: "water",
          title: "Guia Completo das Máquinas Kangen Water",
          desc: "Tudo o que você precisa saber sobre as 6 máquinas Kangen.",
          url: "https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf",
          name: "Guia de Ionizadores Kangen",
          badge: "Mais Popular",
        },
        {
          icon: "shower",
          title: "Guia do Sistema de Chuveiro Anespa DX",
          desc: "Descubra como o Anespa DX transforma seu chuveiro em experiência de spa.",
          url: "https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf",
          name: "Guia Anespa DX",
        },
        {
          icon: "money",
          title: "O Plano de Compensação de 8 Pontos",
          desc: "Entenda como você ganha como distribuidor True Legacy.",
          url: "https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf",
          name: "Guia do Plano de Compensação",
          badge: "Essencial",
        },
        {
          icon: "leaf",
          title: "Guia de Cúrcuma Kangen Ukon",
          desc: "Cúrcuma selvagem de Okinawa e benefícios para a saúde.",
          url: "https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf",
          name: "Guia Kangen Ukon",
        },
        {
          icon: "meat",
          title: "Guia do Kangen Wagyu Beef",
          desc: "Carne Wagyu premium sem hormônios, criada com Água Kangen.",
          url: "https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf",
          name: "Guia Kangen Wagyu",
        },
        {
          icon: "wrench",
          title: "Cuidado e Manutenção das Máquinas",
          desc: "Mantenha seus clientes felizes. A manutenção correta reduz devoluções.",
          url: "https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf",
          name: "Guia de Manutenção",
        },
      ],
    },
  };

const EIGHT_POINTS_EN = {
  heading: "The 8-Point Payment System",
  subheading:
    "Every sale generates up to 8 commission points — paid directly to distributors at every level.",
  description:
    "Enagic's unique Direct Sales model pays commissions on every transaction to up to 8 people in your upline. There are no middlemen, no monthly fees — just direct payments from Enagic to your bank account within days of a sale.",
  points: [
    {
      point: "1",
      label: "You earn on your own sales",
      desc: "Every machine you sell pays you directly",
    },
    {
      point: "2",
      label: "You earn on your team's sales",
      desc: "When people you introduce make sales, you earn too",
    },
    {
      point: "3",
      label: "8 levels deep",
      desc: "Earn commissions up to 8 levels in your organisation",
    },
    {
      point: "4",
      label: "No monthly quotas",
      desc: "No subscription fees, no monthly minimums",
    },
    {
      point: "5",
      label: "Paid within days",
      desc: "Enagic pays commissions directly to your bank account",
    },
    {
      point: "6",
      label: "Global earnings",
      desc: "Your team can operate in 29+ countries — you earn globally",
    },
    {
      point: "7",
      label: "Rank advancement bonuses",
      desc: "Hit rank milestones and unlock additional bonuses",
    },
    {
      point: "8",
      label: "Residual income potential",
      desc: "Build a team that generates income even when you're not working",
    },
  ],
  cta: "Join the True Legacy Team →",
};
const EIGHT_POINTS_ES = {
  heading: "El Sistema de Pago de 8 Puntos",
  subheading:
    "Cada venta genera hasta 8 puntos de comisión — pagados directamente a los distribuidores en cada nivel.",
  description:
    "El modelo único de ventas directas de Enagic paga comisiones en cada transacción a hasta 8 personas en tu línea superior. Sin intermediarios, sin tarifas mensuales — solo pagos directos de Enagic a tu cuenta bancaria.",
  points: [
    {
      point: "1",
      label: "Ganas en tus propias ventas",
      desc: "Cada máquina que vendes te paga directamente",
    },
    {
      point: "2",
      label: "Ganas en las ventas de tu equipo",
      desc: "Cuando las personas que introduces venden, tú también ganas",
    },
    {
      point: "3",
      label: "8 niveles de profundidad",
      desc: "Gana comisiones hasta 8 niveles en tu organización",
    },
    {
      point: "4",
      label: "Sin cuotas mensuales",
      desc: "Sin tarifas de suscripción, sin mínimos mensuales",
    },
    {
      point: "5",
      label: "Pago en días",
      desc: "Enagic paga comisiones directamente a tu cuenta bancaria",
    },
    {
      point: "6",
      label: "Ganancias globales",
      desc: "Tu equipo puede operar en 29+ países — ganas globalmente",
    },
    {
      point: "7",
      label: "Bonos de avance de rango",
      desc: "Alcanza hitos de rango y desbloquea bonos adicionales",
    },
    {
      point: "8",
      label: "Potencial de ingresos residuales",
      desc: "Construye un equipo que genere ingresos incluso cuando no estás trabajando",
    },
  ],
  cta: "Únete al Equipo True Legacy →",
};
const EIGHT_POINTS_FR = {
  heading: "Le Système de Paiement en 8 Points",
  subheading:
    "Chaque vente génère jusqu'à 8 points de commission — payés directement aux distributeurs à chaque niveau.",
  description:
    "Le modèle de vente directe unique d'Enagic paie des commissions sur chaque transaction à jusqu'à 8 personnes dans votre upline. Pas d'intermédiaires, pas de frais mensuels — seulement des paiements directs d'Enagic sur votre compte bancaire.",
  points: [
    {
      point: "1",
      label: "Vous gagnez sur vos propres ventes",
      desc: "Chaque machine vendue vous paie directement",
    },
    {
      point: "2",
      label: "Vous gagnez sur les ventes de votre équipe",
      desc: "Quand ceux que vous introduisez vendent, vous gagnez aussi",
    },
    {
      point: "3",
      label: "8 niveaux de profondeur",
      desc: "Gagnez des commissions jusqu'à 8 niveaux dans votre organisation",
    },
    {
      point: "4",
      label: "Pas de quotas mensuels",
      desc: "Pas de frais d'abonnement, pas de minimums mensuels",
    },
    {
      point: "5",
      label: "Payé en quelques jours",
      desc: "Enagic paie les commissions directement sur votre compte bancaire",
    },
    {
      point: "6",
      label: "Revenus mondiaux",
      desc: "Votre équipe peut opérer dans 29+ pays — vous gagnez globalement",
    },
    {
      point: "7",
      label: "Bonus d'avancement de rang",
      desc: "Atteignez des étapes de rang et débloquez des bonus supplémentaires",
    },
    {
      point: "8",
      label: "Potentiel de revenus résiduels",
      desc: "Construisez une équipe qui génère des revenus même quand vous ne travaillez pas",
    },
  ],
  cta: "Rejoindre l'Équipe True Legacy →",
};
function getEightPoints(locale: string) {
  return locale === "es"
    ? EIGHT_POINTS_ES
    : locale === "fr"
      ? EIGHT_POINTS_FR
      : EIGHT_POINTS_EN;
}

// Pillar icons (SVG, no emojis)
type PillarIconKey = "water" | "money" | "globe";
function PillarIcon({
  name,
  color,
  className,
}: {
  name: PillarIconKey;
  color: string;
  className?: string;
}) {
  const size = 40;
  const style = { color };
  const wrap = (children: React.ReactNode) => (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color,
      }}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
      >
        {children}
      </svg>
    </span>
  );
  switch (name) {
    case "water":
      return wrap(<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />);
    case "money":
      return wrap(
        <>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </>,
      );
    case "globe":
      return wrap(
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>,
      );
    default:
      return wrap(<circle cx="12" cy="12" r="10" />);
  }
}

// V20: Three Pillars — Health | Wealth | Legacy
const PILLARS = {
  en: [
    {
      icon: "water" as PillarIconKey,
      title: "Health",
      subtitle: "Kangen Water Changes Your Body",
      description:
        "Ionized alkaline water at pH 8.5–9.5 helps neutralize acidity, boost hydration at the cellular level, and support your immune system. Used by athletes, doctors, and families across 29+ countries. This is not a filter — it is a medical-grade ionizer made in Japan.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Wealth",
      subtitle: "The 8-Point System Pays You Directly",
      description:
        "Every time you or your team sells a machine, Enagic pays commissions to up to 8 people in your network — directly to your bank account. No monthly fees. No middlemen. The average K8 sale generates $400–$800 in commission. One sale per week changes your financial situation completely.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Legacy",
      subtitle: "Build Something That Outlasts You",
      description:
        "True Legacy is a global movement of distributors in 29+ countries building income that compounds. When your team grows, you earn even while you sleep. This is not a job — it is a business that travels with you, works across borders, and can be passed to your family.",
      color: "#9B59B6",
    },
  ],
  es: [
    {
      icon: "water" as PillarIconKey,
      title: "Salud",
      subtitle: "Aqua Kangen Transforma Tu Cuerpo",
      description:
        "El agua alcalina ionizada a pH 8.5–9.5 ayuda a neutralizar la acidez, potenciar la hidratación a nivel celular y apoyar tu sistema inmune. Usada por atletas, médicos y familias en 29+ países. No es un filtro — es un ionizador de grado médico fabricado en Japón.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Riqueza",
      subtitle: "El Sistema de 8 Puntos Te Paga Directamente",
      description:
        "Cada vez que tú o tu equipo vende una máquina, Enagic paga comisiones a hasta 8 personas en tu red — directamente a tu cuenta bancaria. Sin cuotas mensuales. Sin intermediarios. La venta promedio de un K8 genera $400–$800 en comisión. Una venta por semana cambia completamente tu situación financiera.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Legado",
      subtitle: "Construye Algo Que Te Sobreviva",
      description:
        "True Legacy es un movimiento global de distribuidores en 29+ países construyendo ingresos que se multiplican. Cuando tu equipo crece, ganas incluso mientras duermes. No es un trabajo — es un negocio que viaja contigo, funciona a través de fronteras y puede dejarse a tu familia.",
      color: "#9B59B6",
    },
  ],
  fr: [
    {
      icon: "water" as PillarIconKey,
      title: "Santé",
      subtitle: "L'Eau Kangen Transforme Votre Corps",
      description:
        "L'eau alcaline ionisée à pH 8,5–9,5 aide à neutraliser l'acidité, stimuler l'hydratation au niveau cellulaire et soutenir votre système immunitaire. Utilisée par des athlètes, médecins et familles dans 29+ pays. Ce n'est pas un filtre — c'est un ioniseur de qualité médicale fabriqué au Japon.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Richesse",
      subtitle: "Le Système de 8 Points Vous Paie Directement",
      description:
        "Chaque fois que vous ou votre équipe vend une machine, Enagic verse des commissions à jusqu'à 8 personnes dans votre réseau — directement sur votre compte bancaire. Pas de frais mensuels. Pas d'intermédiaires. Une vente par semaine change complètement votre situation financière.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Héritage",
      subtitle: "Construisez Quelque Chose Qui Vous Survive",
      description:
        "True Legacy est un mouvement mondial de distributeurs dans 29+ pays construisant des revenus qui se multiplient. Quand votre équipe grandit, vous gagnez même en dormant. Ce n'est pas un emploi — c'est un business qui voyage avec vous.",
      color: "#9B59B6",
    },
  ],
  pt: [
    {
      icon: "water" as PillarIconKey,
      title: "Saúde",
      subtitle: "A Água Kangen Transforma Seu Corpo",
      description:
        "Água alcalina ionizada em pH 8,5–9,5 ajuda a neutralizar a acidez e apoiar seu sistema imunológico. Não é um filtro — é um ionizador de grau médico fabricado no Japão.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Riqueza",
      subtitle: "O Sistema de 8 Pontos Paga Você Diretamente",
      description:
        "Cada venda gera comissões para até 8 pessoas na sua rede — diretamente na sua conta. Uma venda por semana muda sua situação financeira.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Legado",
      subtitle: "Construa Algo Que Lhe Sobreviva",
      description:
        "True Legacy é um movimento global em 29+ países. Quando sua equipe cresce, você ganha mesmo dormindo.",
      color: "#9B59B6",
    },
  ],
} as const;

function getPillars(locale: string) {
  return locale === "es"
    ? PILLARS.es
    : locale === "fr"
      ? PILLARS.fr
      : locale === "pt"
        ? PILLARS.pt
        : PILLARS.en;
}

function getContent(country: Country, locale: "en" | "es" | "fr" | "pt") {
  const es = locale === "es";
  const fr = locale === "fr";
  const pt = locale === "pt";
  return {
    headline: es
      ? `Salud Verdadera. Riqueza Real. ${country.nativeName}.`
      : fr
        ? `Vraie Santé. Vraie Richesse. ${country.nativeName}.`
        : pt
          ? `Saúde Verdadeira. Riqueza Real. ${country.nativeName}.`
          : `True Health. Real Wealth. ${country.name}.`,
    sub: es
      ? "True Legacy es un equipo global de coaches que comparten Aqua Kangen y emGuarde — dos de las tecnologías de bienestar más comentadas. No solo vendemos productos; construimos líderes."
      : fr
        ? "True Legacy est une équipe mondiale de coachs qui partagent l’eau Kangen et emGuarde — deux des technologies bien‑être les plus reconnues. Nous ne faisons pas que vendre des produits. Nous formons des leaders."
        : pt
          ? "True Legacy é uma equipe global de mentores que compartilham Kangen Water e emGuarde — duas das tecnologias de bem-estar mais reconhecidas. Não apenas vendemos produtos. Formamos líderes."
          : "True Legacy is a global team of coaches sharing Kangen Water and emGuarde — two of the most talked-about wellness technologies on the market. We don't just sell products. We build leaders.",
    watchLabel: es
      ? "Mira el Video Completo"
      : fr
        ? "Regardez la vidéo complète"
        : pt
          ? "Assista ao Blueprint Completo"
          : "Watch the Full Blueprint",
    vslTitle: es
      ? `Blueprint de True Legacy — ${country.nativeName}`
      : fr
        ? `Blueprint True Legacy — ${country.nativeName}`
        : pt
          ? `Blueprint True Legacy — ${country.nativeName}`
          : `True Legacy Blueprint — ${country.name}`,
    ctaHeadline: es
      ? "¿Listo para construir tu legado con nosotros?"
      : fr
        ? "Prêt à construire votre héritage avec nous ?"
        : pt
          ? "Pronto para construir seu legado conosco?"
          : "Ready to build your legacy with us?",
    ctaDesc: es
      ? "Miles de líderes ya están transformando vidas. Tu oportunidad comienza aquí."
      : fr
        ? "Des milliers de leaders transforment déjà des vies. Votre opportunité commence ici."
        : pt
          ? "Milhares de líderes já estão transformando vidas. Sua oportunidade começa aqui."
          : "Thousands of leaders worldwide are already building their legacy. Your opportunity starts here.",
    points: es
      ? [
          "Aqua Kangen de grado médico para tu salud",
          "Protección EMF con emGuarde 24/7",
          "Plan de compensación de 8 niveles",
          "Comunidad global de líderes y mentores",
        ]
      : fr
        ? [
            "Eau Kangen de qualité médicale pour une vraie santé",
            "Protection EMF avec emGuarde 24h/24",
            "Plan de compensation 8 points pour des revenus mondiaux",
            "Communauté mondiale de leaders et de mentors",
          ]
        : pt
          ? [
              "Água Kangen de grau médico para sua saúde",
              "Proteção EMF com emGuarde 24/7",
              "Plano de compensação de 8 níveis",
              "Comunidade global de líderes e mentores",
            ]
          : [
              "Medical-grade Kangen Water for real health",
              "EMF protection with emGuarde 24/7",
              "8-tier compensation plan for global income",
              "Global community of leaders and mentors",
            ],
    joinBtn: es
      ? "Empieza Ahora"
      : fr
        ? "Prenez le lead"
        : pt
          ? "Comece Agora"
          : "Take the Lead",
    communityBtn: es
      ? "Comunidad de Facebook"
      : fr
        ? "Communauté Facebook"
        : pt
          ? "Comunidade do Facebook"
          : "Join the Facebook Community",
    productsLabel: es
      ? "Nuestros Productos"
      : fr
        ? "Nos Produits"
        : pt
          ? "Nossos Produtos"
          : "Our Products",
    productsSub: es
      ? "Tecnología de bienestar que funciona"
      : fr
        ? "Une technologie bien‑être qui fonctionne"
        : pt
          ? "Tecnologia de bem-estar que funciona"
          : "Wellness Technology That Works",
    leadersLabel: es
      ? "Líderes en"
      : fr
        ? "Leaders True Legacy en"
        : pt
          ? "Líderes em"
          : "Leaders Building True Legacy in",
    socialProofLeaders: es
      ? "Líderes en todos los países"
      : fr
        ? "Leaders dans tous les pays"
        : pt
          ? "Líderes em todos os países"
          : "Leaders across all countries",
    socialProofCountries: es
      ? "Más de 51 países activos"
      : fr
        ? "Plus de 51 pays actifs"
        : pt
          ? "Mais de 51 países ativos"
          : "51+ countries active",
    socialProofEnagic: es
      ? "Red distribuidor certificado Enagic"
      : fr
        ? "Réseau de distributeurs certifiés Enagic"
        : pt
          ? "Rede de distribuidores certificados Enagic"
          : "Enagic certified distributor network",
    joinCommunity: es
      ? "Únete a la comunidad"
      : fr
        ? "Rejoindre la communauté"
        : pt
          ? "Junte-se à comunidade"
          : "Join the Community",
    testimonialsLabel: es
      ? "Lo Que Dicen"
      : fr
        ? "Ce que disent nos leaders"
        : pt
          ? "O Que Nossos Líderes Dizem"
          : "What Our Leaders Are Saying",
    globalLabel: es
      ? "También disponible en"
      : fr
        ? "Également disponible dans"
        : pt
          ? "Também disponível em"
          : "Also available in",
    ytHandle: es
      ? "@TrueLegacyLATAM"
      : fr
        ? "@TrueLegacyWorld"
        : pt
          ? "@TrueLegacyLATAM"
          : "@TrueLegacyWorld",
    seeMore: es
      ? "Explorar la tecnología"
      : fr
        ? "Explorer la technologie"
        : pt
          ? "Explorar a tecnologia"
          : "Explore the Technology",
    getPaidHeadline: es
      ? "Cobra por compartir productos que sanan"
      : fr
        ? "Soyez payé pour partager des produits qui guérissent"
        : pt
          ? "Ganhe compartilhando produtos que curam"
          : "Get Paid to Share World-Healing Products",
    getPaidSub: es
      ? "No es solo bienestar. Es un negocio construido sobre productos que realmente cambian vidas."
      : fr
        ? "Ce n'est pas qu'un programme bien‑être. C'est une activité construite sur des produits qui changent réellement des vies."
        : pt
          ? "Não é apenas bem-estar. É um negócio construído sobre produtos que realmente mudam vidas."
          : "This isn't just wellness. It's a business built on products that actually change lives.",
    getPaidCard1Title: es
      ? "Ingresos reales. Productos reales."
      : fr
        ? "Revenus réels. Produits réels."
        : pt
          ? "Renda real. Produtos reais."
          : "Real Income. Real Products.",
    getPaidCard1Desc: es
      ? "Ganas compartiendo máquinas de Aqua Kangen y dispositivos emGuarde — productos que la gente recompra, recomienda y recomienda. Sin ventas frías. Solo bienestar genuino que se vende solo."
      : fr
        ? "Vous gagnez en partageant les machines Kangen et les appareils emGuarde — des produits que les gens recommandent et rachètent. Pas de ventes forcées. Juste du bien‑être authentique."
        : pt
          ? "Você ganha compartilhando máquinas Kangen Water e dispositivos emGuarde — produtos que as pessoas recomendam e compram de novo. Sem vendas agressivas. Apenas bem-estar genuíno."
          : "You earn by sharing Kangen Water machines and emGuarde devices — products people reorder, recommend, and rave about. No cold pitching. No fake hype. Just genuine wellness that sells itself.",
    getPaidCard2Title: es
      ? "Mercado global. Alcance ilimitado."
      : fr
        ? "Marché mondial. Portée illimitée."
        : pt
          ? "Mercado global. Alcance ilimitado."
          : "Global Market. Unlimited Reach.",
    getPaidCard2Desc: es
      ? "True Legacy tiene alcance global: Norteamérica, Latinoamérica, Europa, África, Asia. Al unirte, te conectas a una red internacional con sistemas probados — alcance ilimitado."
      : fr
        ? "True Legacy est présent en Amérique du Nord, Amérique latine, Europe, Afrique et Asie. En nous rejoignant, vous bénéficiez d'une portée mondiale illimitée."
        : pt
          ? "True Legacy atua na América do Norte, América Latina, Europa, África e Ásia. Ao se juntar, você se conecta a uma rede internacional com alcance global ilimitado."
          : "True Legacy operates across North America, Latin America, Europe, Africa, and Asia — full global reach. When you join, you plug into an international network with proven systems already in place.",
    getPaidCard3Title: es
      ? "Plan de compensación de 8 puntos de Enagic"
      : fr
        ? "Plan de compensation Enagic à 8 points"
        : pt
          ? "Plano de compensação de 8 pontos da Enagic"
          : "Enagic's 8-Point Compensation Plan",
    getPaidCard3Desc: es
      ? "Enagic paga hasta 8 puntos de comisión directos por venta — puedes ganar con cada máquina vendida en tu red, no solo tus ventas directas. Así es como los líderes construyen riqueza generacional."
      : fr
        ? "Enagic verse jusqu'à 8 points de commission directe par vente — vous pouvez gagner sur chaque machine vendue dans votre réseau, pas seulement vos ventes directes."
        : pt
          ? "A Enagic paga até 8 pontos de comissão direta por venda — você pode ganhar em cada máquina vendida na sua rede. É assim que líderes constroem riqueza geracional."
          : "Enagic pays up to 8 direct commission points per sale — meaning you can earn on every machine sold within your network, not just your direct sales. This is how leaders build generational wealth.",
    getPaidCtaHeadline: es
      ? "¿Listo para construir tu legado?"
      : fr
        ? "Prêt à construire votre héritage ?"
        : pt
          ? "Pronto para construir seu legado?"
          : "Ready to build your legacy?",
    getPaidCtaDesc: es
      ? "Únete a líderes en todos los países que ganan mientras sanan el mundo. No se necesita experiencia — solo la voluntad de liderar."
      : fr
        ? "Rejoignez des leaders dans tous les pays qui gagnent tout en soignant le monde. Aucune expérience requise — seulement la volonté de mener."
        : pt
          ? "Junte-se a líderes em todos os países que ganham enquanto curam o mundo. Nenhuma experiência necessária — apenas vontade de liderar."
          : "Join leaders across all countries who are earning while healing the world. No experience needed — just the willingness to lead.",
    getPaidCtaBtn: es
      ? "Comienza tu camino"
      : fr
        ? "Commencez votre parcours"
        : pt
          ? "Comece sua jornada"
          : "Start Your Journey",
  };
}

const DEFAULT_JOTFORM = "https://form.jotform.com/260232994952060";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COUNTRY_TO_CONTINENT: Record<
  string,
  { id: string; nameEn: string; nameEs: string; nameFr: string; namePt: string }
> = {
  usa: {
    id: "north-america",
    nameEn: "N. America",
    nameEs: "Norteamérica",
    nameFr: "Amérique du Nord",
    namePt: "N. América",
  },
  canada: {
    id: "north-america",
    nameEn: "N. America",
    nameEs: "Norteamérica",
    nameFr: "Amérique du Nord",
    namePt: "N. América",
  },
  colombia: {
    id: "south-america",
    nameEn: "S. America / LATAM",
    nameEs: "Sudamérica / LATAM",
    nameFr: "Amérique latine",
    namePt: "América do Sul / LATAM",
  },
  paraguay: {
    id: "south-america",
    nameEn: "S. America / LATAM",
    nameEs: "Sudamérica / LATAM",
    nameFr: "Amérique latine",
    namePt: "América do Sul / LATAM",
  },
  mexico: {
    id: "south-america",
    nameEn: "S. America / LATAM",
    nameEs: "Sudamérica / LATAM",
    nameFr: "Amérique latine",
    namePt: "América do Sul / LATAM",
  },
  brazil: {
    id: "south-america",
    nameEn: "S. America / LATAM",
    nameEs: "Sudamérica / LATAM",
    nameFr: "Amérique latine",
    namePt: "América do Sul / LATAM",
  },
  morocco: {
    id: "africa",
    nameEn: "Africa",
    nameEs: "África",
    nameFr: "Afrique",
    namePt: "África",
  },
  nigeria: {
    id: "africa",
    nameEn: "Africa",
    nameEs: "África",
    nameFr: "Afrique",
    namePt: "África",
  },
  india: {
    id: "asia",
    nameEn: "Asia",
    nameEs: "Asia",
    nameFr: "Asie",
    namePt: "Ásia",
  },
  uae: {
    id: "asia",
    nameEn: "Asia",
    nameEs: "Asia",
    nameFr: "Asie",
    namePt: "Ásia",
  },
  malaysia: {
    id: "asia",
    nameEn: "Asia",
    nameEs: "Asia",
    nameFr: "Asie",
    namePt: "Ásia",
  },
  turkey: {
    id: "europe",
    nameEn: "Europe",
    nameEs: "Europa",
    nameFr: "Europe",
    namePt: "Europa",
  },
};

export default function CountryPage() {
  const { country: slug } = useParams<{ country: string }>();
  const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(
    new Set(),
  );
  const country = getCountryBySlug(slug || "");
  const { locale, setLocale } = useLocaleContext();

  // Ensure LATAM pages default to Spanish
  useEffect(() => {
    if (
      country &&
      ["mexico", "brazil", "colombia", "paraguay"].includes(country.slug)
    ) {
      if (locale !== "es" && locale !== "pt") {
        setLocale("es");
      }
    }
  }, [country?.slug]);

  if (!country) return <Navigate to="/" replace />;

  const jotformUrl = country.jotformUrl ?? DEFAULT_JOTFORM;
  const copy = t[locale];
  const c = getContent(country, locale);

  const followLabel =
    locale === "es"
      ? "Seguir"
      : locale === "fr"
        ? "Suivre"
        : locale === "pt"
          ? "Seguir"
          : "Follow";

  return (
    <>
      <Navbar />

      <div className="page-wrapper" style={{ background: "#060b1e" }}>
        {/* ===== HERO (TL background style) ===== */}
        <div id="hero">
          <TLBackground className="pt-28 md:pt-20 pb-0 scroll-mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
              <FlagIntro country={country} />
              <p className="text-center text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-4 font-light leading-relaxed">
                {copy.heroSub}
              </p>

              {/* Video + CTA grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] items-start pb-20">
                {/* VSL */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                    {c.watchLabel}
                  </p>
                  <div className={IMG_WRAPPER_CLASS}>
                    <VSLPlayer
                      youtubeId={country.youtubeId}
                      title={c.vslTitle}
                    />
                  </div>
                </motion.div>

                {/* CTA Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 1.0 }}
                  className="rounded-3xl border border-white/10 p-6 md:p-8"
                  style={{
                    background: "rgba(5,16,48,0.6)",
                    backdropFilter: "blur(24px)",
                  }}
                >
                  <h2 className="text-2xl md:text-3xl text-white mb-3 leading-tight font-display font-bold">
                    {c.ctaHeadline}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">
                    {c.ctaDesc}
                  </p>

                  {/* Points */}
                  <ul className="space-y-2.5 mb-6">
                    {c.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#1B3A8C]/30 flex items-center justify-center text-blue-400">
                          <IconCheck size={11} />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Primary CTA */}
                  <a
                    href={jotformUrl}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("join_click", {
                        location: "country_hero",
                        countrySlug: country.slug,
                        locale,
                      })
                    }
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white transition-all hover:scale-105 shadow-lg shadow-yellow-500/25"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B3A8C 0%, #1e6fc0 100%)",
                      boxShadow: "0 8px 32px rgba(27,58,140,0.4)",
                    }}
                  >
                    {copy.unlockLegacy} <IconArrow size={18} />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/18649072149"
                    target="_blank" rel="noopener noreferrer"
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-green-500/20 px-6 py-3 text-sm font-semibold text-green-400 hover:bg-green-500/10 transition-all"
                  >
                    <IconWhatsapp size={16} /> {copy.getInTouch}
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/groups/truelegacycommunity"
                    target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all"
                  >
                    <IconFacebook size={15} /> {c.communityBtn}
                  </a>

                  {/* Social */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex gap-5">
                    <a
                      href={country.youtube}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <IconYoutube size={14} /> {c.ytHandle}
                    </a>
                    <a
                      href={country.instagram}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-pink-400 transition-colors"
                    >
                      <IconInstagram size={14} />{" "}
                      {["colombia", "mexico", "paraguay", "brazil"].includes(
                        country.slug,
                      )
                        ? "@truelegacylatam"
                        : "@truelegacyworld"}
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </TLBackground>
        </div>

        {/* Trust strip — 51+ Years | 29+ Countries | 3M+ Lives | #1 Water Ionizer */}
        <section
          className="trust-strip flex flex-wrap justify-center items-center gap-8 md:gap-10 py-5 px-6 border-t border-[rgba(0,168,150,0.1)] border-b border-[rgba(0,168,150,0.1)] my-8"
          style={{ background: "rgba(0,168,150,0.06)" }}
        >
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              51+
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Años en el negocio"
                : locale === "fr"
                  ? "Années d'activité"
                  : locale === "pt"
                    ? "Anos no negócio"
                    : "Years in Business"}
            </span>
          </div>
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              29+
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Países"
                : locale === "fr"
                  ? "Pays"
                  : locale === "pt"
                    ? "Países"
                    : "Countries"}
            </span>
          </div>
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              3M+
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Vidas transformadas"
                : locale === "fr"
                  ? "Vies transformées"
                  : locale === "pt"
                    ? "Vidas transformadas"
                    : "Lives Changed"}
            </span>
          </div>
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              #1
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Ionizador de agua"
                : locale === "fr"
                  ? "Ioniseur d'eau"
                  : locale === "pt"
                    ? "Ionizador de água"
                    : "Rated #1 Water Ionizer"}
            </span>
          </div>
        </section>

        {/* ===== THREE PILLARS (V20) — Health | Wealth | Legacy ===== */}
        <section
          className="pillars-section py-16 px-4 sm:px-6 border-t border-white/5"
          style={{ background: "#060b1e" }}
        >
          <div className="mx-auto max-w-5xl">
            <h2
              className="text-center text-white font-extrabold mb-2"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                marginBottom: 8,
              }}
            >
              {(copy as { healthWealth?: string }).healthWealth ??
                (locale === "es"
                  ? "Salud = Riqueza"
                  : locale === "fr"
                    ? "Santé = Richesse"
                    : "Health = Wealth")}
            </h2>
            <p className="text-center text-[#5a8595] max-w-[600px] mx-auto mb-0 text-base leading-relaxed">
              {(copy as { pillarsSub?: string }).pillarsSub ??
                (locale === "es"
                  ? "Tres pilares que crean una vida de libertad."
                  : locale === "fr"
                    ? "Trois piliers qui créent une vie de liberté."
                    : "Three pillars that create a life of freedom.")}
            </p>
            <div className="pillars-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {getPillars(locale).map((p) => (
                <div
                  key={p.title}
                  className="pillar-card rounded-2xl border border-white/[0.07] p-8 bg-white/[0.03] transition-all hover:-translate-y-1.5 hover:border-white/10"
                >
                  <div className="pillar-icon text-4xl mb-4">
                    <PillarIcon name={p.icon} color={p.color} />
                  </div>
                  <h3 className="pillar-title text-white font-extrabold text-xl mb-1.5">
                    {p.title}
                  </h3>
                  <p
                    className="pillar-subtitle text-sm font-semibold mb-3"
                    style={{ color: p.color }}
                  >
                    {p.subtitle}
                  </p>
                  <p className="pillar-desc text-[#8ba3b0] text-[15px] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS (moved up after Pillars — V20) ===== */}
        <section
          className="py-20 border-t border-white/5"
          style={{ background: "#060b1e" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F5A623] mb-2">
                {locale === "es"
                  ? "Testimonios"
                  : locale === "fr"
                    ? "Témoignages"
                    : locale === "pt"
                      ? "Depoimentos"
                      : "Testimonials"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                {c.testimonialsLabel}
              </h2>
            </motion.div>
            <TestimonialsSplit locale={locale} />
            <div className="ig-follow-strip flex justify-center gap-2 sm:gap-3 md:gap-4 mt-8 flex-wrap">
              <a
                href="https://www.instagram.com/truelegacyworld/"
                target="_blank" rel="noopener noreferrer"
                className="ig-follow-btn inline-flex items-center gap-2.5 text-white py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 rounded-full font-bold text-xs sm:text-sm no-underline transition-all hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                  boxShadow: "0 4px 20px rgba(131,58,180,0.3)",
                }}
              >
                <IconInstagram size={18} />
                {followLabel} @truelegacyworld
              </a>
              {["colombia", "brazil", "mexico", "paraguay"].includes(
                country.slug,
              ) && (
                <a
                  href="https://www.instagram.com/truelegacylatam/"
                  target="_blank" rel="noopener noreferrer"
                  className="ig-follow-btn ig-latam inline-flex items-center gap-2.5 text-white py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 rounded-full font-bold text-xs sm:text-sm no-underline transition-all hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                    boxShadow: "0 4px 20px rgba(131,58,180,0.3)",
                  }}
                >
                  <IconInstagram size={18} />
                  {followLabel} @truelegacylatam
                </a>
              )}
              {/* YouTube follow buttons */}
              {["colombia", "brazil", "mexico", "paraguay"].includes(
                country.slug,
              ) ? (
                <a
                  href="https://www.youtube.com/@TrueLegacyLATAM"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 rounded-full font-bold text-xs sm:text-sm no-underline transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #c4302b, #ff0000)",
                    boxShadow: "0 4px 20px rgba(196,48,43,0.3)",
                  }}
                >
                  <IconYoutube size={18} />
                  {locale === "es" ? "Ver en YouTube" : "Watch on YouTube"}{" "}
                  @TrueLegacyLATAM
                </a>
              ) : (
                <a
                  href="https://www.youtube.com/@TrueLegacyWorld"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 rounded-full font-bold text-xs sm:text-sm no-underline transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #c4302b, #ff0000)",
                    boxShadow: "0 4px 20px rgba(196,48,43,0.3)",
                  }}
                >
                  <IconYoutube size={18} />
                  {locale === "fr"
                    ? "Regarder sur YouTube"
                    : locale === "pt"
                      ? "Assistir no YouTube"
                      : "Watch on YouTube"}{" "}
                  @TrueLegacyWorld
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ===== 8-POINT PAYMENT SYSTEM ===== */}
        <section
          className="py-16 px-4 sm:px-6 border-t border-white/5"
          style={{ background: "#060b1e" }}
        >
          <div className="mx-auto max-w-6xl">
            {(() => {
              const eight = getEightPoints(locale);
              return (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {eight.heading}
                  </h2>
                  <p className="text-[#00a896] font-semibold mb-4">
                    {eight.subheading}
                  </p>
                  <p className="text-slate-400 mb-10 max-w-3xl">
                    {eight.description}
                  </p>
                  <div className="eight-points-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {eight.points.map((item) => (
                      <div
                        key={item.point}
                        className="point-card rounded-xl border p-5 bg-white/[0.03] border-[rgba(0,168,150,0.15)] hover:border-[rgba(0,168,150,0.4)] hover:-translate-y-0.5 transition-all"
                      >
                        <div
                          className="point-number w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm mb-3"
                          style={{
                            background:
                              "linear-gradient(135deg, #00a896, #00c4ae)",
                          }}
                        >
                          {item.point}
                        </div>
                        <h3 className="font-bold text-white text-sm mb-1">
                          {item.label}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                  <a
                    href={jotformUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-all hover:opacity-90"
                    style={{
                      background: "linear-gradient(135deg, #00a896, #00c4ae)",
                    }}
                  >
                    {eight.cta}
                  </a>
                </>
              );
            })()}
          </div>
        </section>

        {/* ===== GET PAID TO SHARE WORLD-HEALING PRODUCTS ===== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16 px-4 sm:px-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,22,50,0.95) 0%, rgba(5,30,60,0.9) 100%)",
            borderTop: "1px solid rgba(245,166,35,0.2)",
            borderBottom: "1px solid rgba(245,166,35,0.2)",
          }}
        >
          <div className="mx-auto max-w-6xl rounded-[1.5rem] p-8 sm:p-10 md:py-12 md:px-16 border border-yellow-500/30">
            <div className="text-center mb-12">
              <h2 className="section-title text-center">
                {copy.paidSection.headline}
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                {copy.paidSection.sub}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <IconDollar size={26} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">
                  {copy.paidSection.card1Title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {copy.paidSection.card1Body}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <IconGlobe size={26} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">
                  {copy.paidSection.card2Title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {copy.paidSection.card2Body}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <IconTrendingUp size={26} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">
                  {copy.paidSection.card3Title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {copy.paidSection.card3Body}
                </p>
              </motion.div>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to={
                  [
                    "mexico",
                    "colombia",
                    "paraguay",
                    "brazil",
                    "morocco",
                  ].includes(country.slug)
                    ? `/${country.slug}/training`
                    : "/training"
                }
                className="self-center rounded-xl border border-[rgba(201,168,76,0.5)] px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/10 transition-colors text-center"
              >
                {locale === "es"
                  ? "Descargar Plan de Compensación (PDF)"
                  : locale === "fr"
                    ? "Télécharger le Plan de Compensation (PDF)"
                    : locale === "pt"
                      ? "Baixar Plano de Compensação (PDF)"
                      : "Download Compensation Plan (PDF)"}
              </Link>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-yellow-500/30 bg-[#0a1628]/90 p-6 md:p-8">
              <div className="text-center md:text-left max-w-lg">
                <h3 className="section-title text-center">
                  {copy.paidSection.ctaHeadline}
                </h3>
                <p className="text-slate-400">{copy.paidSection.ctaBody}</p>
              </div>
              <a
                href={jotformUrl}
                target="_blank" rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("join_click", {
                    location: "country_get_paid",
                    countrySlug: country.slug,
                    locale,
                  })
                }
                className="shrink-0 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 sm:px-8 sm:py-4 transition-all hover:scale-105 w-full sm:w-auto text-center"
              >
                {copy.startJourney}
              </a>
            </div>
          </div>
        </motion.section>

        {/* ===== SOCIAL PROOF STRIP (stat updated: leaders across 3 continents, not 100k+) ===== */}
        <section className="py-10" style={{ background: "#060b1e" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <IconUsers size={20} />
                <span className="text-sm text-slate-400">
                  <strong className="text-white font-bold">
                    {c.socialProofLeaders}
                  </strong>
                </span>
              </div>
              <div className="text-sm text-slate-400">
                <strong className="text-white font-bold">
                  {c.socialProofCountries}
                </strong>
              </div>
              <div className="text-sm text-slate-400">
                <strong className="text-white font-bold">
                  {c.socialProofEnagic}
                </strong>
              </div>
              <a
                href="https://www.facebook.com/groups/truelegacycommunity"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                <IconFacebook size={16} /> {c.joinCommunity}
              </a>
            </div>
          </div>
        </section>

        {/* ===== LOCALIZED PDF RESOURCES (lead magnet) ===== */}
        <section
          className="py-16 border-t border-white/5"
          style={{ background: "#050b18" }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {(() => {
              const pdfConfig = PDF_SECTION_CONTENT[locale];
              return (
                <div className="pdf-section-inner rounded-[1.75rem] border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-slate-950/90">
                  <div className="section-heading px-4 sm:px-8 pt-8 sm:pt-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300 mb-2">
                      {locale === "es"
                        ? "Investigación & Recursos"
                        : locale === "fr"
                          ? "Recherche & Ressources"
                          : locale === "pt"
                            ? "Pesquisa e Recursos"
                            : "Research & Resources"}
                    </p>
                    <h2 className="section-title">{pdfConfig.sectionTitle}</h2>
                    <p className="section-subtitle">
                      {pdfConfig.sectionSubtitle}
                    </p>
                  </div>
                  <div className="pdf-grid px-4 sm:px-8 pb-8 sm:pb-10 pt-6 sm:pt-8">
                    {pdfConfig.pdfs.map((pdf) => (
                      <div key={pdf.name} className="pdf-card">
                        {pdf.badge && (
                          <span className="pdf-badge">{pdf.badge}</span>
                        )}
                        <div className="pdf-icon">
                          <PdfIcon name={pdf.icon} />
                        </div>
                        <h3 className="pdf-card-title">{pdf.title}</h3>
                        <p className="pdf-card-desc">{pdf.desc}</p>
                        <Link
                          to={
                            [
                              "mexico",
                              "colombia",
                              "paraguay",
                              "brazil",
                              "morocco",
                            ].includes(country.slug)
                              ? `/${country.slug}/training`
                              : "/training"
                          }
                          className="pdf-cta-btn"
                          onClick={() =>
                            trackEvent("country_pdf_click", {
                              countrySlug: country.slug,
                              locale,
                              pdfName: pdf.name,
                            })
                          }
                        >
                          {pdfConfig.ctaLabel}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ===== OTHER COUNTRIES ===== */}
        <section
          className="py-12 border-t border-white/5"
          style={{ background: "#070c1a" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 mb-6">
              {c.globalLabel}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center gap-3">
              {COUNTRIES.filter((cx) => cx.slug !== country.slug).map((cx) => (
                <Link
                  key={cx.slug}
                  to={`/${cx.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white transition-all"
                >
                  <span
                    className="inline-flex h-6 w-8 shrink-0 overflow-hidden rounded border border-white/20 bg-[#0a2060]"
                    role="img"
                    aria-label={`Flag of ${cx.name}`}
                  >
                    {failedFlagSlugs.has(cx.slug) ? (
                      <span className="flex h-full w-full items-center justify-center text-lg leading-none">
                        {cx.flagEmoji || cx.flag || "🏳️"}
                      </span>
                    ) : (
                      <img
                        {...getFlagSrcSet(cx.slug)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={() =>
                          setFailedFlagSlugs((prev) =>
                            new Set(prev).add(cx.slug),
                          )
                        }
                      />
                    )}
                  </span>
                  <span className="font-medium">{cx.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FULL PRODUCT CATALOG FOR THIS COUNTRY (Kangen Air USA/Canada only) ===== */}
        <ProductSection
          productIds={
            country.slug === "usa" || country.slug === "canada"
              ? [
                  "k8",
                  "sd501",
                  "sd501_super",
                  "sd501_dx",
                  "anespa_dx",
                  "emguarde",
                  "ukon_sigma",
                  "kangen_wagyu",
                  "kangen_air",
                ]
              : [
                  "k8",
                  "sd501",
                  "sd501_super",
                  "sd501_dx",
                  "anespa_dx",
                  "emguarde",
                  "ukon_sigma",
                  "kangen_wagyu",
                ]
          }
          country={country}
          variant="country"
        />

        {/* ===== EVENTS TEASER (V20) ===== */}
        <section
          className="py-12 border-t border-white/5"
          style={{ background: "#060b1e" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {locale === "es"
                ? "Próximos Eventos"
                : locale === "fr"
                  ? "Événements à venir"
                  : locale === "pt"
                    ? "Próximos Eventos"
                    : "Upcoming Events"}
            </h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              {locale === "es"
                ? "Únete a nuestros masterclass y entrenamientos en vivo."
                : locale === "fr"
                  ? "Rejoignez nos masterclass et formations en direct."
                  : locale === "pt"
                    ? "Junte-se aos nossos masterclass e treinamentos ao vivo."
                    : "Join our live masterclasses and training events."}
            </p>
            <Link
              to={
                ["brazil", "mexico", "colombia", "paraguay"].includes(
                  country.slug,
                )
                  ? "/events/latam"
                  : ["india", "uae", "malaysia"].includes(country.slug)
                    ? "/events/asia"
                    : ["nigeria", "morocco"].includes(country.slug)
                      ? "/events/africa"
                      : "/events/global"
              }
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #00a896, #00c4ae)",
              }}
            >
              {locale === "es"
                ? "Ver Eventos"
                : locale === "fr"
                  ? "Voir les événements"
                  : locale === "pt"
                    ? "Ver Eventos"
                    : "View Events"}{" "}
              <IconArrow size={18} />
            </Link>
          </div>
        </section>

        <Footer />

        {/* ===== STICKY CTA BAR (Section 11 CRO) ===== */}
        <div
          id="sticky-cta"
          className="sticky-cta-bar"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            top: "auto",
            width: "100%",
            zIndex: 9000,
            transform: "none",
            margin: 0,
            borderRadius: 0,
            background: "rgba(5,14,20,0.97)",
            borderTop: "1px solid rgba(0,168,150,0.3)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <p className="sticky-cta-text text-sm text-slate-400 m-0 font-medium">
            {locale === "es"
              ? "¿Listo para construir tu True Legacy?"
              : locale === "fr"
                ? "Prêt à construire votre True Legacy ?"
                : locale === "pt"
                  ? "Pronto para construir seu True Legacy?"
                  : "Ready to build your True Legacy?"}
          </p>
          <a
            href={jotformUrl}
            target="_blank" rel="noopener noreferrer"
            onClick={() =>
              trackEvent("join_click", {
                location: "sticky_cta",
                countrySlug: country.slug,
                locale,
              })
            }
            className="sticky-cta-btn inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold text-white whitespace-nowrap transition-colors"
            style={{ background: "#00a896", minHeight: "44px" }}
          >
            {locale === "es"
              ? "Únete al Equipo →"
              : locale === "fr"
                ? "Rejoindre l'Équipe →"
                : locale === "pt"
                  ? "Junte-se à Equipe →"
                  : "Join the Team →"}
          </a>
        </div>
      </div>
    </>
  );
}
