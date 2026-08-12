import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import NotFoundPage from "@/pages/NotFoundPage";
import { ProductSection } from "@/components/products/ProductSection";
import { FlagIntro } from "@/components/ui/FlagIntro";
import { TLBackground } from "@/components/ui/TLBackground";
import { VSLPlayer } from "@/components/ui/VSLPlayer";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { trackEvent } from "@/lib/analytics";
import type { Country } from "@/lib/countries";
import { COUNTRIES, getCountryBySlug, getFlagSrcSet } from "@/lib/countries";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

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
      name: "Coach Ryan",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/ryan-hero.png",
      intro:
        "From coaching elite performers to guiding entrepreneurs, Ryan brings performance, leadership, and leverage together to build generational legacy.",
      instagram: "https://www.instagram.com/ryanpool/",
    },
  ],
  canada: [
    {
      name: "Coach Ryan",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/ryan-hero.png",
      intro:
        "Supporting Canadian leaders who want to combine product education, responsible entrepreneurship, and long-term team development through True Legacy.",
      instagram: "https://www.instagram.com/ryanpool/",
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
      name: "Coach Ryan",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/ryan-hero.png",
      intro:
        "Bringing a decade of high-performance coaching to help leaders in Mexico build strong wellness businesses with Enagic.",
      instagram: "https://www.instagram.com/ryanpool/",
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
      name: "Coach Ryan",
      role: "Elite Performance & Leadership Coach",
      image: "/leaders/ryan-hero.png",
      intro:
        "Bringing practical product education and team development to Turkish entrepreneurs building responsibly for the long term.",
      instagram: "https://www.instagram.com/ryanpool/",
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
    "Enagic uses an 8-point commission system tied to eligible product sales.",
  description:
    "Compensation depends on eligibility, sales activity, rank, market rules, and the current Enagic compensation plan. Review official materials before making a decision; no income is guaranteed.",
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
      label: "8-point structure",
      desc: "Learn how eligible product sales are allocated under the official plan",
    },
    {
      point: "4",
      label: "No monthly quotas",
      desc: "No subscription fees, no monthly minimums",
    },
    {
      point: "5",
      label: "Official payments",
      desc: "Payment timing and methods depend on Enagic and your market",
    },
    {
      point: "6",
      label: "International team",
      desc: "True Legacy has members and leaders across 14 featured markets",
    },
    {
      point: "7",
      label: "Rank advancement bonuses",
      desc: "Hit rank milestones and unlock additional bonuses",
    },
    {
      point: "8",
      label: "Individual results vary",
      desc: "Earnings are not guaranteed and depend on many individual factors",
    },
  ],
  cta: "Join the True Legacy Team →",
};
const EIGHT_POINTS_ES = {
  heading: "El Sistema de Pago de 8 Puntos",
  subheading:
    "Enagic utiliza un sistema de comisiones de 8 puntos vinculado a ventas de productos elegibles.",
  description:
    "La compensación depende de elegibilidad, ventas, rango, reglas del mercado y el plan vigente de Enagic. Revisa los materiales oficiales; no se garantiza ningún ingreso.",
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
      label: "Estructura de 8 puntos",
      desc: "Conoce cómo se asignan las ventas elegibles según el plan oficial",
    },
    {
      point: "4",
      label: "Sin cuotas mensuales",
      desc: "Sin tarifas de suscripción, sin mínimos mensuales",
    },
    {
      point: "5",
      label: "Pagos oficiales",
      desc: "Los tiempos y métodos dependen de Enagic y de tu mercado",
    },
    {
      point: "6",
      label: "Equipo internacional",
      desc: "True Legacy tiene miembros y líderes en 14 mercados destacados",
    },
    {
      point: "7",
      label: "Bonos de avance de rango",
      desc: "Alcanza hitos de rango y desbloquea bonos adicionales",
    },
    {
      point: "8",
      label: "Los resultados varían",
      desc: "Los ingresos no están garantizados y dependen de factores individuales",
    },
  ],
  cta: "Únete al Equipo True Legacy →",
};
const EIGHT_POINTS_FR = {
  heading: "Le Système de Paiement en 8 Points",
  subheading:
    "Enagic utilise un système de commission à 8 points lié aux ventes de produits éligibles.",
  description:
    "La rémunération dépend de l’éligibilité, des ventes, du rang, des règles du marché et du plan Enagic en vigueur. Aucun revenu n’est garanti.",
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
      label: "Structure à 8 points",
      desc: "Découvrez comment les ventes éligibles sont réparties selon le plan officiel",
    },
    {
      point: "4",
      label: "Pas de quotas mensuels",
      desc: "Pas de frais d'abonnement, pas de minimums mensuels",
    },
    {
      point: "5",
      label: "Paiements officiels",
      desc: "Les délais et méthodes dépendent d’Enagic et de votre marché",
    },
    {
      point: "6",
      label: "Équipe internationale",
      desc: "True Legacy compte des membres et leaders dans 14 marchés clés",
    },
    {
      point: "7",
      label: "Bonus d'avancement de rang",
      desc: "Atteignez des étapes de rang et débloquez des bonus supplémentaires",
    },
    {
      point: "8",
      label: "Les résultats varient",
      desc: "Les revenus ne sont pas garantis et dépendent de facteurs individuels",
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
      subtitle: "Learn About Kangen Water Systems",
      description:
        "Explore how Enagic water ionizers produce multiple water types for different household uses. Product information is educational and is not medical advice.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Wealth",
      subtitle: "Understand the Independent Opportunity",
      description:
        "Enagic offers an independent distributor opportunity based on eligible product sales. Compensation and eligibility vary; no income or business result is guaranteed.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Legacy",
      subtitle: "Build Something That Outlasts You",
      description:
        "True Legacy has members and leaders across 14 featured markets, with education, mentorship, and systems intended to support responsible long-term team development.",
      color: "#9B59B6",
    },
  ],
  es: [
    {
      icon: "water" as PillarIconKey,
      title: "Salud",
      subtitle: "Conoce los Sistemas Kangen Water",
      description:
        "Conoce cómo los ionizadores de agua Enagic producen distintos tipos de agua para diferentes usos domésticos. Esta información es educativa y no constituye asesoramiento médico.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Riqueza",
      subtitle: "Comprende la Oportunidad Independiente",
      description:
        "Enagic ofrece una oportunidad de distribución independiente basada en ventas de productos elegibles. La compensación y elegibilidad varían; no se garantiza ningún ingreso.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Legado",
      subtitle: "Construye Algo Que Te Sobreviva",
      description:
        "True Legacy tiene miembros y líderes en 14 mercados destacados, con educación, mentoría y sistemas para apoyar el desarrollo responsable de equipos a largo plazo.",
      color: "#9B59B6",
    },
  ],
  fr: [
    {
      icon: "water" as PillarIconKey,
      title: "Santé",
      subtitle: "Découvrez les Systèmes Kangen Water",
      description:
        "Découvrez comment les ioniseurs Enagic produisent plusieurs types d’eau pour différents usages domestiques. Ces informations sont éducatives et ne constituent pas un avis médical.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Richesse",
      subtitle: "Comprendre l’Opportunité Indépendante",
      description:
        "Enagic propose une opportunité de distributeur indépendant fondée sur les ventes de produits éligibles. La rémunération varie et aucun revenu n’est garanti.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Héritage",
      subtitle: "Construisez Quelque Chose Qui Vous Survive",
      description:
        "True Legacy compte des membres et leaders dans 14 marchés clés, avec formation, mentorat et systèmes pour soutenir un développement responsable à long terme.",
      color: "#9B59B6",
    },
  ],
  pt: [
    {
      icon: "water" as PillarIconKey,
      title: "Saúde",
      subtitle: "Conheça os Sistemas Kangen Water",
      description:
        "Conheça como os ionizadores Enagic produzem diferentes tipos de água para usos domésticos. Estas informações são educativas e não substituem orientação médica.",
      color: "#00a896",
    },
    {
      icon: "money" as PillarIconKey,
      title: "Riqueza",
      subtitle: "Entenda a Oportunidade Independente",
      description:
        "A Enagic oferece uma oportunidade de distribuidor independente baseada em vendas de produtos elegíveis. A remuneração varia e nenhuma renda é garantida.",
      color: "#F5A623",
    },
    {
      icon: "globe" as PillarIconKey,
      title: "Legado",
      subtitle: "Construa Algo Que Lhe Sobreviva",
      description:
        "True Legacy tem membros e líderes em 14 mercados em destaque, com educação, mentoria e sistemas para apoiar o desenvolvimento responsável de equipes.",
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
      ? "Conoce los productos, responsabilidades y apoyo antes de decidir si esta oportunidad es para ti."
      : fr
        ? "Découvrez les produits, responsabilités et le soutien avant de décider si cette opportunité vous convient."
        : pt
          ? "Conheça os produtos, responsabilidades e suporte antes de decidir se esta oportunidade combina com você."
          : "Learn about the products, responsibilities, and support before deciding whether this opportunity fits you.",
    points: es
      ? [
          "Educación sobre los sistemas Kangen Water de Enagic",
          "Información y disponibilidad de emGuarde por mercado",
          "Explicación responsable del sistema de 8 puntos",
          "Miembros y líderes en 14 mercados destacados",
        ]
      : fr
        ? [
            "Formation aux systèmes Kangen Water d’Enagic",
            "Informations et disponibilité d’emGuarde selon le marché",
            "Présentation responsable du système à 8 points",
            "Membres et leaders dans 14 marchés clés",
          ]
        : pt
          ? [
              "Educação sobre os sistemas Kangen Water da Enagic",
              "Informações e disponibilidade do emGuarde por mercado",
              "Explicação responsável do sistema de 8 pontos",
              "Membros e líderes em 14 mercados em destaque",
            ]
          : [
              "Education about Enagic Kangen Water systems",
              "emGuarde information and market availability",
              "Responsible explanation of the 8-point system",
              "Members and leaders across 14 featured markets",
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
      ? "14 mercados destacados"
      : fr
        ? "14 marchés clés"
        : pt
          ? "14 mercados em destaque"
          : "14 featured markets",
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
      ? "Explora la oportunidad de distribuidor independiente"
      : fr
        ? "Découvrez l’opportunité de distributeur indépendant"
        : pt
          ? "Conheça a oportunidade de distribuidor independente"
          : "Explore the Independent Distributor Opportunity",
    getPaidSub: es
      ? "Conoce el modelo basado en productos de Enagic y el apoyo educativo de True Legacy."
      : fr
        ? "Découvrez le modèle Enagic fondé sur les produits et le soutien éducatif de True Legacy."
        : pt
          ? "Conheça o modelo baseado em produtos da Enagic e o apoio educacional da True Legacy."
          : "Learn about Enagic’s product-based model and True Legacy’s educational support.",
    getPaidCard1Title: es
      ? "Ingresos reales. Productos reales."
      : fr
        ? "Revenus réels. Produits réels."
        : pt
          ? "Renda real. Produtos reais."
          : "Real Income. Real Products.",
    getPaidCard1Desc: es
      ? "Los distribuidores independientes pueden recibir comisiones por ventas de productos elegibles según el plan vigente de Enagic. Los resultados varían."
      : fr
        ? "Les distributeurs indépendants peuvent recevoir des commissions sur les ventes de produits éligibles selon le plan Enagic en vigueur. Les résultats varient."
        : pt
          ? "Distribuidores independentes podem receber comissões por vendas de produtos elegíveis conforme o plano vigente da Enagic. Os resultados variam."
          : "Independent distributors may receive commissions on eligible product sales under Enagic’s current plan. Individual results vary.",
    getPaidCard2Title: es
      ? "Mercado global. Alcance ilimitado."
      : fr
        ? "Marché mondial. Portée illimitée."
        : pt
          ? "Mercado global. Alcance ilimitado."
          : "Global Market. Unlimited Reach.",
    getPaidCard2Desc: es
      ? "True Legacy tiene miembros y líderes en 14 mercados destacados, con educación y apoyo para equipos internacionales."
      : fr
        ? "True Legacy compte des membres et leaders dans 14 marchés clés, avec formation et soutien pour les équipes internationales."
        : pt
          ? "True Legacy tem membros e líderes em 14 mercados em destaque, com educação e apoio para equipes internacionais."
          : "True Legacy has members and leaders across 14 featured markets, with education and support for international teams.",
    getPaidCard3Title: es
      ? "Plan de compensación de 8 puntos de Enagic"
      : fr
        ? "Plan de compensation Enagic à 8 points"
        : pt
          ? "Plano de compensação de 8 pontos da Enagic"
          : "Enagic's 8-Point Compensation Plan",
    getPaidCard3Desc: es
      ? "Enagic utiliza un sistema de comisiones de 8 puntos vinculado a ventas elegibles. Consulta los materiales oficiales para conocer términos y requisitos."
      : fr
        ? "Enagic utilise un système de commission à 8 points lié aux ventes éligibles. Consultez les documents officiels pour les conditions."
        : pt
          ? "A Enagic utiliza um sistema de comissões de 8 pontos ligado a vendas elegíveis. Consulte os materiais oficiais para conhecer os requisitos."
          : "Enagic uses an 8-point commission system tied to eligible product sales. Review official materials for current terms and eligibility.",
    getPaidCtaHeadline: es
      ? "¿Listo para construir tu legado?"
      : fr
        ? "Prêt à construire votre héritage ?"
        : pt
          ? "Pronto para construir seu legado?"
          : "Ready to build your legacy?",
    getPaidCtaDesc: es
      ? "Conecta con un distribuidor para conocer los productos, responsabilidades, costos y apoyo antes de decidir."
      : fr
        ? "Contactez un distributeur pour comprendre les produits, responsabilités, coûts et soutien avant de décider."
        : pt
          ? "Fale com um distribuidor para conhecer produtos, responsabilidades, custos e suporte antes de decidir."
          : "Connect with a distributor to understand the products, responsibilities, costs, and support before deciding.",
    getPaidCtaBtn: es
      ? "Comienza tu camino"
      : fr
        ? "Commencez votre parcours"
        : pt
          ? "Comece sua jornada"
          : "Start Your Journey",
  };
}

const DEFAULT_JOTFORM = "/apply";

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
  const { locale } = useLocaleContext();

  if (!country) return <NotFoundPage />;

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
      <SEO title={`True Legacy ${country.name} | Product Education and Team Support`} description={`Explore True Legacy product education, weekly calls, training, and independent distributor support for ${country.name}.`} />
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

        {/* Trust strip — owner-approved foundation facts */}
        <section
          className="trust-strip flex flex-wrap justify-center items-center gap-8 md:gap-10 py-5 px-6 border-t border-[rgba(0,168,150,0.1)] border-b border-[rgba(0,168,150,0.1)] my-8"
          style={{ background: "rgba(0,168,150,0.06)" }}
        >
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              52
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Años de innovación"
                : locale === "fr"
                  ? "Années d’innovation"
                  : locale === "pt"
                    ? "Anos de inovação"
                    : "Years of Innovation"}
            </span>
          </div>
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              14
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Mercados destacados"
                : locale === "fr"
                  ? "Marchés clés"
                  : locale === "pt"
                    ? "Mercados em destaque"
                    : "Featured Markets"}
            </span>
          </div>
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              1974
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Innovando desde"
                : locale === "fr"
                  ? "Innovation depuis"
                  : locale === "pt"
                    ? "Inovando desde"
                    : "Pioneering Since"}
            </span>
          </div>
          <div className="trust-stat text-center">
            <span className="trust-stat-number text-[22px] font-extrabold text-[#00a896] block">
              K8
            </span>
            <span className="trust-stat-label text-xs text-[#5a8595] tracking-wider">
              {locale === "es"
                ? "Modelo insignia destacado"
                : locale === "fr"
                  ? "Modèle phare présenté"
                  : locale === "pt"
                    ? "Modelo carro-chefe em destaque"
                    : "Featured Flagship Model"}
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
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm leading-relaxed text-slate-300">
              {locale === "es"
                ? "Estamos revisando las historias de la comunidad para confirmar permisos y mantener una comunicación responsable."
                : locale === "fr"
                  ? "Nous révisons les témoignages de la communauté afin de confirmer les autorisations et de maintenir une communication responsable."
                  : locale === "pt"
                    ? "Estamos revisando as histórias da comunidade para confirmar permissões e manter uma comunicação responsável."
                    : "We are reviewing community stories to confirm permissions and maintain responsible, accurate communication."}
            </div>
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
