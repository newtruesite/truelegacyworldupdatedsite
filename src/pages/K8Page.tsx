import { SEO } from "@/components/SEO";
import TrueLegacyLogo from "@/components/ui/TrueLegacyLogo";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { LandingHeaderBackButton } from "@/components/layout/LandingHeaderBackButton";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { trackEvent } from "@/lib/analytics";
import { COUNTRIES } from "@/lib/countries";
import { getDistributorLink } from "@/lib/distributorRouter";
import { localizedProductVideo } from "@/lib/productVideos";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    ExternalLink,
    FileText,
    Globe,
    HelpCircle,
    Info,
    MessageCircle,
    Play,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    UserCheck,
    Users,
    Zap,
} from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLeaderPortrait, getPublicDistributors, type PublicDistributor } from "@/lib/crm";
import { getProductPurchaseLink } from "@/config/productPurchaseLinks";

// ── LOCALIZATION DICTIONARY ──────────────────────────────────
const LOCALES = {
  en: {
    hero: {
      eyebrow: "KANGEN WATER® · JAPANESE WATER TECHNOLOGY",
      headline: "Better water, freshly made at your tap.",
      sub: "Meet the Leveluk K8—a premium home water ionizer that filters ordinary tap water and creates multiple water settings for drinking, cooking, beauty, produce washing, and everyday cleaning.",
      ctaPrimary: "Watch the 4-Minute Demo",
      ctaSecondary: "Contact Your Distributor",
      claims: [
        "Made in Japan",
        "Eight platinum-dipped titanium plates",
        "Multiple water settings",
        "Personal product guidance",
      ],
      presentedBy: "True Legacy Product Guidance",
      distributorTag: "Independent Enagic Distributors",
    },
    demo: {
      eyebrow: "SEE IT IN ACTION",
      heading: "Understand the K8 in four minutes.",
      sub: "See the water settings, pH demonstration, and practical ways families use the K8 throughout the day.",
      langSelectLabel: "Video Language:",
      transcriptToggle: "View Video Transcript & Summary",
      actions: {
        pricing: "Get Pricing & Availability",
        question: "Contact Your Distributor",
      },
      transcriptText: `The 4-minute demonstration highlights how the Leveluk K8 transforms standard municipal tap water through high-grade internal filtration and electrolysis. Key segments include:
• Filtration Stage: Removal of chlorine, sediment, and organic odors while preserving essential minerals.
• Electrolysis Chamber: Water passes over 8 solid platinum-dipped titanium plates, separating tap water into alkaline and acidic streams.
• pH Range Demonstration: Visual color-indicator test demonstrating water settings from pH 2.5 up to pH 11.0+.
• Practical Applications: Demonstrating daily hydration, culinary enhancement, produce rinsing, skin care, and non-chemical kitchen sanitization.`,
    },
    value: {
      eyebrow: "EVERYDAY UTILITY",
      heading: "Designed for how you actually live.",
      sub: "The K8 replaces single-purpose kitchen products with a single, elegant device mounted right at your sink.",
      blocks: [
        {
          title: "Water you look forward to drinking",
          body: "Freshly filtered water with a smooth taste, available directly from your kitchen.",
        },
        {
          title: "More useful throughout the home",
          body: "Choose different water settings for drinking, cooking, produce washing, beauty routines, and everyday cleanup.",
        },
        {
          title: "Less dependence on bottled water",
          body: "Create water at the tap instead of repeatedly carrying and storing cases of single-use bottles.",
        },
      ],
    },
    waterSettings: {
      eyebrow: "VERSATILE OUTPUT",
      heading: "Five distinct water settings at the touch of a button.",
      sub: "Select the exact pH setting engineered for your specific task.",
      clarificationNotice:
        "Important Note: Not all water settings are intended for drinking. Strong Kangen Water (pH 11.0+), Beauty Water (pH 5.5–6.0), and Strong Acidic Water (pH 2.5) are formulated strictly for cleaning, produce prep, and cosmetic skin care.",
      tabs: [
        {
          id: "kangen",
          name: "Kangen Drinking Water",
          ph: "pH 8.5 – 9.5",
          use: "Daily hydration, coffee & tea brewing, cooking soups and grains.",
          note: "Consumable water. Smooth, refreshing taste for daily drinking.",
          color: "from-cyan-500 to-blue-600",
          accentBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
        },
        {
          id: "clean",
          name: "Clean Water",
          ph: "pH 7.0",
          use: "Preparing baby formula, taking prescription medication, drinking during meals.",
          note: "Un-ionized filtered neutral water. Safe for infant formula and oral medication.",
          color: "from-emerald-500 to-teal-600",
          accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        },
        {
          id: "beauty",
          name: "Beauty Water",
          ph: "pH 5.5 – 6.0",
          use: "Facial toning, face washing, hair rinsing after shampoo, pet grooming.",
          note: "Slightly acidic. External skin & hair care only. Do not drink.",
          color: "from-rose-400 to-pink-600",
          accentBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        },
        {
          id: "strong-kangen",
          name: "Strong Kangen Water",
          ph: "pH 11.0+",
          use: "Rinsing produce to clean oil-based farm residue, degreasing cookware, food prep.",
          note: "High alkaline cleaning water. Non-drinking. Formulated for kitchen washing.",
          color: "from-purple-500 to-indigo-600",
          accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        },
        {
          id: "strong-acidic",
          name: "Strong Acidic Water",
          ph: "pH 2.5",
          use: "Kitchen counter sanitization, hand hygiene, cleaning cutting boards and utensils.",
          note: "High acidic sanitizing water. Non-drinking. Used for surface hygiene.",
          color: "from-amber-500 to-red-600",
          accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        },
      ],
    },
    confidence: {
      eyebrow: "ENGINEERING & QUALITY",
      heading: "Leveluk K8 Specifications",
      sub: "Built to Japanese medical device manufacturing standards in Osaka, Japan.",
      specs: [
        { label: "Manufacturing Location", value: "Osaka, Japan (Enagic ISO 13485 / ISO 9001 Factory)" },
        { label: "Electrode Plates", value: "8 Solid Platinum-Dipped 99.97% Pure Titanium Plates" },
        { label: "Internal Filtration", value: "High-grade multi-stage filter (Chlorine, sediment, taste & odor reduction)" },
        { label: "Warranty & Service", value: "5-Year Manufacturer Warranty & Lifetime Customer Support" },
        { label: "Installation Requirements", value: "Standard countertop faucet diverter (Under-sink kit options available)" },
        { label: "Dimensions & Weight", value: "345mm (W) x 279mm (H) x 147mm (D) · 6.3 kg (13.9 lbs)" },
        { label: "Voltage & Power", value: "Multi-voltage AC 100–240V, 50/60Hz · ~230W Max Consumption" },
        { label: "Global Shipping", value: "Direct delivery to 150+ countries with local service centers" },
      ],
      certificationsTitle: "Verified Official Certifications",
      certificationsLinkText: "View Official Enagic Product Certifications →",
      certificationsUrl: "https://www.enagic.com/en_US/product-certifications",
    },
    guidance: {
      eyebrow: "DIRECT DISTRIBUTOR SUPPORT",
      heading: "You do not have to choose alone.",
      sub: "Connect directly with your True Legacy independent distributor or leader for a personal walkthrough, current pricing, installation questions, and availability in your country.",
      distributorName: "True Legacy Team",
      distributorTitle: "Independent Enagic Distributors · Global Support",
      distributorLanguages: "Languages: English, Spanish, French, Portuguese",
      responseTime: "Dedicated personal distributor guidance",
      actions: {
        whatsapp: "Contact Your Distributor",
        consultation: "Request a Consultation",
        purchase: "Continue to Official Ordering",
      },
    },
    socialProof: {
      eyebrow: "REAL EXPERIENCES",
      heading: "Customer observations from daily home use.",
      sub: "Real feedback from families who integrated the Leveluk K8 into their everyday routine.",
      featuredLabel: "FEATURED FAMILY STORY",
      stories: [
        {
          name: "Elena M.",
          location: "Miami, Florida",
          quote: "The biggest difference for our kitchen has been convenience. We used to stock stacks of bottled water cases every week. Having fresh filtered drinking water right at the tap plus Beauty Water for skin routines has made a noticeable everyday upgrade.",
          role: "Verified K8 Owner",
        },
        {
          name: "Marc & Sophie T.",
          location: "Geneva, Switzerland",
          quote: "Our distributor answered all our questions about European tap compatibility and installation before we purchased. The setup took less than 15 minutes, and the touch interface makes switching between drinking water and produce washing completely intuitive.",
          role: "Verified K8 Owners",
        },
        {
          name: "Carlos R.",
          location: "Bogotá, Colombia",
          quote: "Using Strong Kangen Water (pH 11) for cleaning fruits and vegetables has become a daily habit in our home. You can actually see the difference when washing produce.",
          role: "Verified K8 Owner",
        },
        {
          name: "David L.",
          location: "London, UK",
          quote: "We wanted a high-quality water system made in Japan with a real manufacturer warranty. The 8-plate titanium construction and solid build quality give us full confidence.",
          role: "Verified K8 Owner",
        },
      ],
    },
    faq: {
      eyebrow: "QUESTIONS & ANSWERS",
      heading: "Frequently Asked Questions",
      sub: "Clear, factual answers about the Leveluk K8 water ionizer.",
      items: [
        {
          q: "What does the Leveluk K8 do?",
          a: "The Leveluk K8 filters tap water through a high-grade internal filter to reduce chlorine, sediment, and odors. It then passes the water through an electrolysis chamber featuring 8 platinum-dipped titanium plates, creating 5 customized water settings with distinct pH levels.",
        },
        {
          q: "Which water settings can be consumed?",
          a: "Kangen Water® (pH 8.5, 9.0, and 9.5) and Clean Water (pH 7.0) are intended for drinking and beverage preparation. Strong Kangen Water (pH 11.0+), Beauty Water (pH 5.5–6.0), and Strong Acidic Water (pH 2.5) are formulated exclusively for household cleaning, food washing, and skincare—they are NOT for drinking.",
        },
        {
          q: "Does the K8 filter water?",
          a: "Yes. The K8 includes a high-grade internal filter designed to reduce chlorine, sediment, rust, and unpleasant odors while leaving desirable dissolved minerals in the water. Filter replacement interval is tracked automatically by the machine.",
        },
        {
          q: "How is it installed?",
          a: "The K8 connects easily to most standard kitchen faucets using the included faucet diverter valve. No plumbing modifications are needed for basic countertop setup. Optional under-sink installation kits are also available.",
        },
        {
          q: "What maintenance is required?",
          a: "The K8 features automated self-cleaning cycles after usage. Routine user maintenance includes changing the internal filter (typically once per year or 6,000 liters) and performing periodic E-cleaning using citric acid cartridges to maintain plate efficiency.",
        },
        {
          q: "How much does it cost?",
          a: "Official pricing varies slightly depending on your shipping country, applicable tax, and local Enagic distributor guidelines. Contact your True Legacy distributor or request a consultation for exact pricing and current availability in your location.",
        },
        {
          q: "Is financing available?",
          a: "Yes. Enagic offers flexible in-house installment payment plans and third-party financing options in many regions (including USA, Europe, and LATAM). Your distributor can walk you through local payment terms.",
        },
        {
          q: "What warranty and service support are included?",
          a: "The Leveluk K8 comes with a 5-Year Manufacturer Warranty covering parts and labor, backed directly by Enagic International's global service centers.",
        },
        {
          q: "Can it be shipped to my country?",
          a: "Yes. Enagic ships directly to customers in over 150 countries from local branch offices across North America, Europe, Latin America, Asia, Africa, and Oceania.",
        },
        {
          q: "Why should I purchase through an independent distributor?",
          a: "Enagic operates on a direct distribution model. Purchasing through an authorized independent distributor ensures you receive full personal installation guidance, customer service support, genuine Enagic warranty registration, and assistance with ordering.",
        },
      ],
    },
    finalCta: {
      heading: "Ready to see whether the K8 fits your home?",
      sub: "Get current pricing, installation guidance, and answers directly from your distributor—without pressure.",
      primary: "Get Pricing & Availability",
      secondaryWhatsapp: "Contact Your Leader",
      secondaryEnagic: "Buy Through the Official Enagic Page",
      redirectNotice: "Note: Clicking 'Buy Through Official Enagic Page' redirects to Enagic's official online portal.",
    },
    legal: {
      medical: "Medical Disclaimer: Kangen Water® is ionized filtered water and is not intended to diagnose, treat, cure, or prevent any disease. Product information is provided strictly for educational and household utility guidance.",
      earnings: "Distributor Disclaimer: True Legacy is an independent team platform. Enagic product sales offer optional independent distributor compensation. Individual results vary based on personal effort, location, and market demand.",
      distributor: "Notice: This landing page is independently owned and operated by True Legacy independent distributors and is not the corporate site of Enagic Co., Ltd.",
    },
  },
  es: {
    hero: {
      eyebrow: "TRUE LEGACY × LEVELUK K8",
      headline: "Transforma tu Agua. Eleva tu Legado.",
      sub: "Descubre el LEVELUK K8—un ionizador de agua premium para el hogar diseñado para ofrecer múltiples tipos de agua para beber, cocinar, belleza y uso doméstico diario.",
      ctaPrimary: "Explorar el K8",
      ctaSecondary: "Conectar con tu Líder True Legacy",
      trustStatement: "Tu próximo paso está guiado por el líder independiente de True Legacy que compartió esta página contigo.",
      claims: [
        "Hecha en Japón",
        "Ocho placas de titanio bañadas en platino",
        "Múltiples opciones de agua",
        "Asesoría personal de producto",
      ],
      presentedBy: "Guía de producto True Legacy",
      distributorTag: "Distribuidores Independientes Enagic",
    },
    demo: {
      eyebrow: "MÍRALA EN ACCIÓN",
      heading: "Entiende la K8 en cuatro minutos.",
      sub: "Mira las opciones de agua, la prueba de pH y las formas prácticas en que las familias usan la K8 durante el día.",
      langSelectLabel: "Idioma del video:",
      transcriptToggle: "Ver transcripción y resumen del video",
      actions: {
        pricing: "Obtener precios y disponibilidad",
        question: "Contactar a tu distribuidor",
      },
      transcriptText: `La demostración de 4 minutos muestra cómo la Leveluk K8 transforma el agua de grifo municipal mediante filtración interna de alta calidad y electrólisis:
• Filtración: Eliminación de cloro, sedimentos y olores orgánicos reteniendo minerales esenciales.
• Cámara de electrólisis: El agua pasa por 8 placas de titanio bañadas en platino puro.
• Prueba de pH: Demostración visual de los tonos de pH desde 2.5 hasta 11.0+.
• Usos prácticos: Hidratación diaria, cocina, lavado de frutas, cuidado facial y desinfección doméstica sin químicos.`,
    },
    value: {
      eyebrow: "UTILIDAD DIARIA",
      heading: "Diseñada para tu vida cotidiana.",
      sub: "La K8 reemplaza múltiples productos de cocina por un solo dispositivo elegante instalado en tu fregadero.",
      blocks: [
        {
          title: "Agua que disfrutarás beber",
          body: "Agua recién filtrada con un sabor suave, disponible directamente en tu cocina.",
        },
        {
          title: "Más útil en todo el hogar",
          body: "Elige diferentes opciones de agua para beber, cocinar, lavar alimentos, rutinas de belleza y limpieza diaria.",
        },
        {
          title: "Menos dependencia del agua embotellada",
          body: "Crea agua en tu grifo en lugar de comprar, cargar y almacenar botellas de plástico de un solo uso.",
        },
      ],
    },
    waterSettings: {
      eyebrow: "SALIDA VERSÁTIL",
      heading: "Cinco opciones de agua al toque de un botón.",
      sub: "Selecciona la configuración de pH exacta para cada tarea de tu hogar.",
      clarificationNotice:
        "Nota Importante: No todas las opciones de agua son para beber. El Agua Súper Kangen (pH 11.0+), el Agua de Belleza (pH 5.5–6.0) y el Agua Súper Ácida (pH 2.5) están formuladas estrictamente para limpieza, lavado de alimentos y cuidado estético.",
      tabs: [
        {
          id: "kangen",
          name: "Agua Kangen® para beber",
          ph: "pH 8.5 – 9.5",
          use: "Hidratación diaria, preparación de café y té, cocina de sopas y granos.",
          note: "Agua potable de consumo diario con sabor suave y agradable.",
          color: "from-cyan-500 to-blue-600",
          accentBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
        },
        {
          id: "clean",
          name: "Agua Neutra (Limpia)",
          ph: "pH 7.0",
          use: "Preparación de fórmulas infantiles, toma de medicamentos, beber durante las comidas.",
          note: "Agua filtrada no ionizada. Segura para biberones y medicamentos.",
          color: "from-emerald-500 to-teal-600",
          accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        },
        {
          id: "beauty",
          name: "Agua de Belleza",
          ph: "pH 5.5 – 6.0",
          use: "Tónico facial, lavado de cara, enjuague de cabello tras el champú, aseo de mascotas.",
          note: "Ligeramente ácida. Solo uso externo en piel y cabello. No beber.",
          color: "from-rose-400 to-pink-600",
          accentBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        },
        {
          id: "strong-kangen",
          name: "Agua Súper Kangen",
          ph: "pH 11.0+",
          use: "Lavado de frutas y verduras para retirar residuos aceitosos, desengrasar utensilios.",
          note: "Agua alcalina de limpieza. No potable. Diseñada para lavado de alimentos.",
          color: "from-purple-500 to-indigo-600",
          accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        },
        {
          id: "strong-acidic",
          name: "Agua Súper Ácida",
          ph: "pH 2.5",
          use: "Desinfección de encimeras de cocina, higiene de manos, limpieza de tablas de cortar.",
          note: "Agua ácida desinfectante. No potable. Usada para higiene de superficies.",
          color: "from-amber-500 to-red-600",
          accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        },
      ],
    },
    confidence: {
      eyebrow: "INGENIERÍA Y CALIDAD",
      heading: "Especificaciones del Leveluk K8",
      sub: "Fabricada bajo estándares de dispositivos médicos en Osaka, Japón.",
      specs: [
        { label: "Lugar de fabricación", value: "Osaka, Japón (Fábrica Enagic ISO 13485 / ISO 9001)" },
        { label: "Placas de electrodo", value: "8 Placas de Titanio puro al 99.97% bañadas en Platino" },
        { label: "Filtración interna", value: "Filtro multietapa de alto rendimiento (reducción de cloro y olores)" },
        { label: "Garantía y servicio", value: "5 Años de Garantía de Fábrica y soporte continuo" },
        { label: "Requisitos de instalación", value: "Desviador estándar para grifo de cocina (opción bajo fregadero)" },
        { label: "Dimensiones y peso", value: "345mm (An) x 279mm (Al) x 147mm (Pr) · 6.3 kg" },
        { label: "Voltaje y energía", value: "Multivoltaje AC 100–240V, 50/60Hz · Consumo máx. ~230W" },
        { label: "Envío internacional", value: "Entrega directa a más de 150 países desde centros locales" },
      ],
      certificationsTitle: "Certificaciones Oficiales Verificadas",
      certificationsLinkText: "Ver Certificaciones Oficiales de Enagic →",
      certificationsUrl: "https://www.enagic.com/en_US/product-certifications",
    },
    guidance: {
      eyebrow: "ATENCIÓN DIRECTA DE DISTRIBUIDOR",
      heading: "No tienes que elegir a ciegas.",
      sub: "Conéctate directamente con tu distribuidor o líder independiente de True Legacy para recibir asesoría personalizada, precios actuales, respuestas a dudas de instalación y disponibilidad en tu país.",
      distributorName: "Equipo True Legacy",
      distributorTitle: "Distribuidores Independientes Enagic · Soporte Global",
      distributorLanguages: "Idiomas: Español, Inglés, Francés, Portugués",
      responseTime: "Atención directa de tu distribuidor",
      actions: {
        whatsapp: "Contactar a tu distribuidor",
        consultation: "Solicitar una consulta",
        purchase: "Continuar a la compra oficial",
      },
    },
    socialProof: {
      eyebrow: "EXPERIENCIAS REALES",
      heading: "Observaciones diarias de clientes en el hogar.",
      sub: "Comentarios reales de familias que integraron la Leveluk K8 en su rutina diaria.",
      featuredLabel: "HISTORIA DESTACADA DE FAMILIA",
      stories: [
        {
          name: "Elena M.",
          location: "Miami, Florida",
          quote: "La gran ventaja en nuestra cocina ha sido la comodidad. Antes comprábamos paquetes y paquetes de agua embotellada cada semana. Tener agua fresca recién filtrada directamente en el grifo ha sido un cambio excelente.",
          role: "Propietaria de K8",
        },
        {
          name: "Marc & Sophie T.",
          location: "Ginebra, Suiza",
          quote: "Nuestro distribuidor resolvió todas nuestras dudas sobre la compatibilidad de grifos antes de comprar. La instalación tomó 15 minutos y cambiar entre el agua para beber y para lavar frutas es facilísimo.",
          role: "Propietarios de K8",
        },
        {
          name: "Carlos R.",
          location: "Bogotá, Colombia",
          quote: "Usar el Agua Súper Kangen (pH 11) para lavar frutas y verduras se convirtió en un hábito diario. Realmente se nota la diferencia al lavar los alimentos frescos.",
          role: "Propietario de K8",
        },
        {
          name: "David L.",
          location: "Londres, Reino Unido",
          quote: "Buscábamos un sistema de agua duradero hecho en Japón con garantía de fábrica real. La calidad de construcción con 8 placas de titanio nos da total tranquilidad.",
          role: "Propietario de K8",
        },
      ],
    },
    faq: {
      eyebrow: "PREGUNTAS Y RESPUESTAS",
      heading: "Preguntas Frecuentes",
      sub: "Respuestas claras y comprobadas sobre el ionizador Leveluk K8.",
      items: [
        {
          q: "¿Qué hace la Leveluk K8?",
          a: "La Leveluk K8 filtra el agua de grifo con un filtro interno de alta calidad para reducir cloro, sedimentos y olores. Luego pasa el agua por una cámara de electrólisis con 8 placas de titanio bañadas en platino, generando 5 configuraciones de agua con diferentes niveles de pH.",
        },
        {
          q: "¿Qué tipos de agua se pueden consumir?",
          a: "El Agua Kangen® (pH 8.5, 9.0 y 9.5) y el Agua Neutra (pH 7.0) están destinadas al consumo potable y la cocina. El Agua Súper Kangen (pH 11.0+), el Agua de Belleza (pH 5.5–6.0) y el Agua Súper Ácida (pH 2.5) son exclusivamente para limpieza, lavado de alimentos y cuidado estético; NO deben beberse.",
        },
        {
          q: "¿La K8 filtra el agua?",
          a: "Sí. Incluye un filtro interno de alta tecnología diseñado para reducir cloro, óxido y sedimentos mientras conserva minerales deseables. La máquina avisa automáticamente cuándo cambiar el filtro.",
        },
        {
          q: "¿Cómo se instala?",
          a: "Se conecta fácilmente a la mayoría de los grifos estándar mediante una válvula desviadora incluida. No requiere obras de fontanería. También hay kits opcionales para instalación bajo el fregadero.",
        },
        {
          q: "¿Qué mantenimiento requiere?",
          a: "Tiene ciclos automáticos de autolimpieza. El mantenimiento habitual consiste en cambiar el filtro interno (aprox. una vez al año o 6,000 litros) y realizar limpiezas periódicas con cartuchos de ácido cítrico (E-cleaning).",
        },
        {
          q: "¿Cuánto cuesta la Leveluk K8?",
          a: "El precio oficial varía según el país de envío, impuestos aplicables y pautas locales de Enagic. Contacta a tu distribuidor de True Legacy o solicita una consulta para obtener la cotización exacta y disponibilidad en tu zona.",
        },
        {
          q: "¿Hay opciones de financiamiento?",
          a: "Sí. Enagic ofrece planes de pago a plazos en muchas regiones (EE. UU., Europa y Latinoamérica). Tu distribuidor puede explicarte las modalidades de financiamiento disponibles para tu país.",
        },
        {
          q: "¿Qué garantía y soporte incluye?",
          a: "La Leveluk K8 cuenta con 5 Años de Garantía de Fábrica completa que cubre piezas y mano de obra, respaldada directamente por los centros de servicio de Enagic.",
        },
        {
          q: "¿Se puede enviar a mi país?",
          a: "Sí. Enagic realiza envíos directos a clientes en más de 150 países a través de sus oficinas corporativas regionales.",
        },
        {
          q: "¿Por qué comprar a través de un distribuidor independiente?",
          a: "Enagic vende exclusivamente mediante distribución directa. Comprar con un distribuidor autorizado te garantiza asesoría de instalación, registro oficial de garantía y soporte directo continuo.",
        },
      ],
    },
    finalCta: {
      heading: "¿Listo para comprobar si la K8 es ideal para tu hogar?",
      sub: "Recibe precios vigentes, ayuda de instalación y respuestas claras directamente de tu distribuidor, sin presión.",
      primary: "Obtener precios y disponibilidad",
      secondaryWhatsapp: "Contactar a tu líder",
      secondaryEnagic: "Comprar en la página oficial de Enagic",
      redirectNotice: "Nota: Al hacer clic en 'Comprar en la página oficial de Enagic' serás redirigido al portal oficial de compra.",
    },
    legal: {
      medical: "Aviso Médico: El Agua Kangen® es agua filtrada e ionizada. No está destinada a diagnosticar, tratar, curar ni prevenir ninguna enfermedad. La información compartida tiene carácter educativo y de utilidad doméstica.",
      earnings: "Aviso de Distribuidor: True Legacy es un equipo independiente. La venta de equipos Enagic ofrece comisiones opcionales para distribuidores. Los resultados varían según el esfuerzo individual y las condiciones del mercado.",
      distributor: "Aviso Legal: Este sitio web es administrado de manera independiente por distribuidores de True Legacy y no es el sitio corporativo oficial de Enagic Co., Ltd.",
    },
  },
  fr: {
    hero: {
      eyebrow: "TRUE LEGACY × LEVELUK K8",
      headline: "Transformez votre Eau. Élevez votre Héritage.",
      sub: "Découvrez le LEVELUK K8—un ioniseur d'eau domestique premium conçu pour fournir plusieurs types d'eau pour la boisson, la cuisine, la beauté et l'usage quotidien.",
      ctaPrimary: "Explorer le K8",
      ctaSecondary: "Contacter votre Leader True Legacy",
      trustStatement: "Votre prochaine étape est guidée par le leader indépendant True Legacy qui a partagé cette page avec vous.",
      claims: [
        "Fabriqué au Japon",
        "Huit plaques en titane plaqué platine",
        "Plusieurs réglages d'eau",
        "Accompagnement personnalisé",
      ],
      presentedBy: "Conseil produit True Legacy",
      distributorTag: "Distributeurs Indépendants Enagic",
    },
    demo: {
      eyebrow: "DÉMO EN VIDÉO",
      heading: "Comprenez la K8 en quatre minutes.",
      sub: "Découvrez les réglages d'eau, le test de pH et l'utilisation concrète au quotidien.",
      langSelectLabel: "Langue de la vidéo :",
      transcriptToggle: "Afficher la transcription et le résumé",
      actions: {
        pricing: "Obtenir les tarifs et disponibilités",
        question: "Contacter votre distributeur",
      },
      transcriptText: `La démonstration de 4 minutes présente la transformation de l'eau du robinet par la Leveluk K8 grâce à sa filtration interne et son électrolyse :
• Filtration : Élimination du chlore, des sédiments et des odeurs tout en conservant les minéraux essentiels.
• Chambre d'électrolyse : Passage de l'eau sur 8 plaques en titane massif recouvertes de platine pur.
• Test de pH : Démonstration visuelle avec réactif de pH du niveau 2.5 jusqu'à 11.0+.
• Usages pratiques : Hydratation quotidienne, cuisine, nettoyage des fruits et légumes, soin de la peau et hygiène de la maison.`,
    },
    value: {
      eyebrow: "UTILITÉ AU QUOTIDIEN",
      heading: "Conçue pour votre style de vie.",
      sub: "La K8 remplace de nombreux produits ménagers par un seul appareil élégant installé directement sur votre évier.",
      blocks: [
        {
          title: "Une eau que vous prendrez plaisir à boire",
          body: "Une eau fraîchement filtrée au goût agréable et léger, disponible directement à votre robinet.",
        },
        {
          title: "Plus utile dans toute la maison",
          body: "Sélectionnez différents réglages d'eau pour la boisson, la cuisine, le lavage des aliments, les soins de peau et le nettoyage.",
        },
        {
          title: "Moins de dépendance aux bouteilles en plastique",
          body: "Produisez votre eau au robinet plutôt que d'acheter et stocker continuellement des pack d'eau à usage unique.",
        },
      ],
    },
    waterSettings: {
      eyebrow: "SÉLECTION MULTIPLE",
      heading: "Cinq réglages d'eau sur simple pression d'un bouton.",
      sub: "Choisissez le niveau de pH adapté à votre besoin précis.",
      clarificationNotice:
        "Note Importante : Tous les réglages d'eau ne sont pas destinés à la consommation. L'Eau Super Kangen (pH 11.0+), l'Eau de Beauté (pH 5.5–6.0) et l'Eau Super Acide (pH 2.5) sont conçues exclusivement pour le nettoyage, la cuisine et les soins esthétiques.",
      tabs: [
        {
          id: "kangen",
          name: "Eau Kangen® à boire",
          ph: "pH 8.5 – 9.5",
          use: "Hydratation quotidienne, préparation du thé et du café, cuisson des céréales et potages.",
          note: "Eau potable destinée à la boisson quotidienne.",
          color: "from-cyan-500 to-blue-600",
          accentBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
        },
        {
          id: "clean",
          name: "Eau Neutre (Propre)",
          ph: "pH 7.0",
          use: "Préparation des biberons pour bébés, prise de médicaments, consommation durant les repas.",
          note: "Eau filtrée non ionisée. Idéale pour les nourrissons et les médicaments.",
          color: "from-emerald-500 to-teal-600",
          accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        },
        {
          id: "beauty",
          name: "Eau de Beauté",
          ph: "pH 5.5 – 6.0",
          use: "Lotion tonique visage, nettoyage de peau, rinçage des cheveux après le shampoing.",
          note: "Légèrement acide. Usage externe uniquement. Ne pas boire.",
          color: "from-rose-400 to-pink-600",
          accentBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        },
        {
          id: "strong-kangen",
          name: "Eau Super Kangen",
          ph: "pH 11.0+",
          use: "Nettoyage des fruits et légumes pour retirer les résidus huileux, dégraissage de vaisselle.",
          note: "Eau alcaline de nettoyage. Non potable.",
          color: "from-purple-500 to-indigo-600",
          accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        },
        {
          id: "strong-acidic",
          name: "Eau Super Acide",
          ph: "pH 2.5",
          use: "Désinfection des planches à découper, hygiène des mains, nettoyage des surfaces de cuisine.",
          note: "Eau acide désinfectante. Non potable.",
          color: "from-amber-500 to-red-600",
          accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        },
      ],
    },
    confidence: {
      eyebrow: "INGÉNIERIE & QUALITÉ",
      heading: "Spécifications de la Leveluk K8",
      sub: "Fabriquée selon les normes de dispositifs médicaux à Osaka, Japon.",
      specs: [
        { label: "Lieu de fabrication", value: "Osaka, Japon (Usine Enagic certifiée ISO 13485 / ISO 9001)" },
        { label: "Plaques d'électrodes", value: "8 Plaques en Titane massif pur à 99.97% recouvertes de Platine" },
        { label: "Filtration interne", value: "Filtre haute performance multi-étapes (réduction du chlore et odeurs)" },
        { label: "Garantie & Support", value: "Garantie Constructeur de 5 Ans & Assistance à vie" },
        { label: "Installation", value: "Adaptateur sur robinet de cuisine standard (option sous-évier)" },
        { label: "Dimensions & Poids", value: "345mm (L) x 279mm (H) x 147mm (P) · 6.3 kg" },
        { label: "Tension & Puissance", value: "Multi-tension AC 100–240V, 50/60Hz · Conso max ~230W" },
        { label: "Expédition mondiale", value: "Livraison directe dans plus de 150 pays" },
      ],
      certificationsTitle: "Certifications Officielles Vérifiées",
      certificationsLinkText: "Consulter les Certifications Officielles Enagic →",
      certificationsUrl: "https://www.enagic.com/en_US/product-certifications",
    },
    guidance: {
      eyebrow: "ACCOMPAGNEMENT DIRECT",
      heading: "Vous n'avez pas à choisir seul.",
      sub: "Contactez directement votre distributeur ou leader indépendant True Legacy pour obtenir des réponses sur l'installation, les tarifs actuels et la disponibilité dans votre pays.",
      distributorName: "Équipe True Legacy",
      distributorTitle: "Distributeurs Indépendants Enagic · Support Global",
      distributorLanguages: "Langues : Français, Anglais, Espagnol, Portugais",
      responseTime: "Accompagnement personnalisé de votre distributeur",
      actions: {
        whatsapp: "Contacter votre distributeur",
        consultation: "Demander un rendez-vous",
        purchase: "Continuer vers la commande officielle",
      },
    },
    socialProof: {
      eyebrow: "EXPÉRIENCES CLIENTS",
      heading: "Retours d'expérience au quotidien.",
      sub: "Témoignages réels de familles ayant adopté la Leveluk K8 à la maison.",
      featuredLabel: "HISTOIRE FAMILIALE EN VEDETTE",
      stories: [
        {
          name: "Elena M.",
          location: "Miami, Floride",
          quote: "La grande différence au quotidien a été la praticité. Nous n'avons plus besoin d'acheter des packs d'eau en bouteille toutes les semaines. Avoir de l'eau fraîche directement au robinet est un vrai confort.",
          role: "Propriétaire d'une K8",
        },
        {
          name: "Marc & Sophie T.",
          location: "Genève, Suisse",
          quote: "Notre distributeur a répondu à toutes nos questions sur la compatibilité du robinet avant l'achat. L'installation a pris 15 minutes et l'écran tactile rend le changement de réglage très simple.",
          role: "Propriétaires d'une K8",
        },
        {
          name: "Carlos R.",
          location: "Bogotá, Colombie",
          quote: "Utiliser l'Eau Super Kangen (pH 11) pour rincer les fruits et légumes est devenu une habitude quotidienne. On voit la différence au lavage.",
          role: "Propriétaire d'une K8",
        },
        {
          name: "David L.",
          location: "Londres, Royaume-Uni",
          quote: "Nous cherchions un système robuste fabriqué au Japon avec une vraie garantie constructeur. La qualité de fabrication est au rendez-vous.",
          role: "Propriétaire d'une K8",
        },
      ],
    },
    faq: {
      eyebrow: "FOIRE AUX QUESTIONS",
      heading: "Questions Fréquemment Posées",
      sub: "Réponses concrètes et factuelles sur le système Leveluk K8.",
      items: [
        {
          q: "Que fait la Leveluk K8 ?",
          a: "La Leveluk K8 filtre l'eau du robinet grâce à un filtre interne haute performance puis la fait passer dans une chambre d'électrolyse composée de 8 plaques en titane plaqué platine pour produire 5 types d'eau aux niveaux de pH distincts.",
        },
        {
          q: "Quelles eaux sont destinées à la boisson ?",
          a: "L'Eau Kangen® (pH 8.5, 9.0 et 9.5) et l'Eau Neutre (pH 7.0) sont destinées à la boisson et la cuisine. L'Eau Super Kangen (pH 11.0+), l'Eau de Beauté (pH 5.5–6.0) et l'Eau Super Acide (pH 2.5) sont exclusivement destinées au nettoyage et aux soins—elles ne doivent pas être bues.",
        },
        {
          q: "La K8 filtre-t-elle l'eau ?",
          a: "Oui. Elle contient un filtre interne conçu pour réduire le chlore, les sédiments et les odeurs tout en conservant les minéraux dissous.",
        },
        {
          q: "Comment s'installe-t-elle ?",
          a: "La K8 se raccord facilement au robinet de cuisine grâce à un adaptateur fourni. Aucune modification de plomberie n'est nécessaire pour une installation standard sur comptoir.",
        },
        {
          q: "Quel entretien est nécessaire ?",
          a: "La machine possède des cycles de nettoyage automatiques. L'entretien régulier comprend le remplacement du filtre interne (environ une fois par an ou 6 000 litres) et des nettoyages périodiques à l'acide citrique (E-cleaning).",
        },
        {
          q: "Quel est le prix de la K8 ?",
          a: "Le tarif officiel varie selon le pays de livraison et les taxes applicables. Contactez votre distributeur True Legacy pour obtenir le tarif exact et la disponibilité dans votre pays.",
        },
        {
          q: "Existe-t-il des options de financement ?",
          a: "Oui. Enagic propose des facilités de paiement échelonné dans plusieurs régions. Votre distributeur pourra vous expliquer les modalités disponibles pour votre secteur.",
        },
        {
          q: "Quelle est la garantie incluse ?",
          a: "La Leveluk K8 bénéficie d'une Garantie Constructeur de 5 Ans pièces et main-d'œuvre, assurée directement par les centres de service Enagic.",
        },
        {
          q: "Peut-elle être livrée dans mon pays ?",
          a: "Oui. Enagic livre directement les clients dans plus de 150 pays à travers ses filiales régionales.",
        },
        {
          q: "Pourquoi acheter via un distributeur indépendant ?",
          a: "Enagic fonctionne en distribution directe. Commander via un distributeur agréé vous garantit un accompagnement personnalisé, l'enregistrement de votre garantie et un suivi complet.",
        },
      ],
    },
    finalCta: {
      heading: "Prêt à découvrir si la K8 convient à votre foyer ?",
      sub: "Obtenez les tarifs actuels, les conseils d'installation et toutes les réponses directement auprès de votre distributeur—sans engagement.",
      primary: "Obtenir les tarifs et disponibilités",
      secondaryWhatsapp: "Contacter votre leader",
      secondaryEnagic: "Acheter sur le site officiel Enagic",
      redirectNotice: "Note : En cliquant sur 'Acheter sur le site officiel Enagic', vous serez réorienté vers la boutique officielle d'Enagic.",
    },
    legal: {
      medical: "Avertissement Médical : L'Eau Kangen® est une eau filtrée et ionisée. Elle n'est pas destinée à diagnostiquer, traiter, guérir ou prévenir une maladie.",
      earnings: "Avertissement Distributeur : True Legacy est un réseau indépendant. La vente de produits Enagic offre des commissions de distribution optionnelles.",
      distributor: "Mentions Légales : Ce site est géré de manière indépendante par des distributeurs True Legacy et n'est pas le site officiel d'Enagic Co., Ltd.",
    },
  },
  pt: {
    hero: {
      eyebrow: "TRUE LEGACY × LEVELUK K8",
      headline: "Transforme sua Água. Eleve seu Legado.",
      sub: "Descubra o LEVELUK K8—um ionizador de água residencial premium projetado para fornecer múltiplos tipos de água para beber, cozinhar, beleza e uso doméstico diário.",
      ctaPrimary: "Explorar o K8",
      ctaSecondary: "Conectar com seu Líder True Legacy",
      trustStatement: "Seu próximo passo é guiado pelo líder independente True Legacy que compartilhou esta página com você.",
      claims: [
        "Feita no Japão",
        "Oito placas de titânio banhadas em platina",
        "Múltiplas opções de água",
        "Orientação pessoal de produto",
      ],
      presentedBy: "Orientação de produto True Legacy",
      distributorTag: "Distribuidores Independentes Enagic",
    },
    demo: {
      eyebrow: "VEJA EM AÇÃO",
      heading: "Entenda a K8 em quatro minutos.",
      sub: "Assista às opções de água, ao teste de pH e às formas práticas como as famílias usam a K8 no dia a dia.",
      langSelectLabel: "Idioma do vídeo:",
      transcriptToggle: "Ver transcrição e resumo do vídeo",
      actions: {
        pricing: "Obter preços e disponibilidade",
        question: "Falar com seu distribuidor",
      },
      transcriptText: `A demonstração de 4 minutos exibe como a Leveluk K8 transforma a água da torneira municipal através de filtragem interna de alta qualidade e eletrólise:
• Estágio de filtragem: Remoção de cloro, sedimentos e odores preservando minerais essenciais.
• Câmara de eletrólise: A água passa por 8 placas de titânio banhadas em platina pura.
• Demonstração de pH: Teste visual mostrando opções de água de pH 2.5 até pH 11.0+.
• Aplicações diárias: Hidratação, culinária, lavagem de alimentos, cuidados estéticos e higienização.`,
    },
    value: {
      eyebrow: "UTILIDADE DIÁRIA",
      heading: "Projetada para a sua rotina.",
      sub: "A K8 substitui vários produtos de cozinha por um único dispositivo elegante instalado direto na sua pia.",
      blocks: [
        {
          title: "Água que você vai gostar de beber",
          body: "Água recém-filtrada com sabor leve e agradável, disponível direto na sua cozinha.",
        },
        {
          title: "Mais útil em toda a casa",
          body: "Escolha diferentes configurações de água para beber, cozinhar, lavar alimentos, cuidados estéticos e limpeza.",
        },
        {
          title: "Menos dependência de garrafas plásticas",
          body: "Produza sua água na torneira em vez de comprar e armazenar garrafas plásticas descartáveis.",
        },
      ],
    },
    waterSettings: {
      eyebrow: "OPÇÕES VERSÁTEIS",
      heading: "Cinco tipos de água com o toque de um botão.",
      sub: "Selecione o nível de pH exato para cada tarefa da sua casa.",
      clarificationNotice:
        "Nota Importante: Nem todos os tipos de água são para beber. A Água Super Kangen (pH 11.0+), a Água de Beleza (pH 5.5–6.0) e a Água Super Ácida (pH 2.5) são formuladas estritamente para limpeza, lavagem de alimentos e estética.",
      tabs: [
        {
          id: "kangen",
          name: "Água Kangen® para Beber",
          ph: "pH 8.5 – 9.5",
          use: "Hidratação diária, preparo de café e chá, cozimento de grãos e sopas.",
          note: "Água potável de consumo diário com sabor suave.",
          color: "from-cyan-500 to-blue-600",
          accentBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
        },
        {
          id: "clean",
          name: "Água Limpa (Neutra)",
          ph: "pH 7.0",
          use: "Preparo de mamadeiras infantis, ingestão de medicamentos, beber durante as refeições.",
          note: "Água filtrada não ionizada. Segura para bebês e remédios.",
          color: "from-emerald-500 to-teal-600",
          accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        },
        {
          id: "beauty",
          name: "Água de Beleza",
          ph: "pH 5.5 – 6.0",
          use: "Tônico facial, lavagem do rosto, enxágue do cabelo após o shampoo.",
          note: "Ligeiramente ácida. Apenas uso externo. Não beber.",
          color: "from-rose-400 to-pink-600",
          accentBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        },
        {
          id: "strong-kangen",
          name: "Água Super Kangen",
          ph: "pH 11.0+",
          use: "Lavagem de frutas e vegetais para remover resíduos oleosos, desengordurar utensílios.",
          note: "Água alcalina de limpeza. Não potável.",
          color: "from-purple-500 to-indigo-600",
          accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        },
        {
          id: "strong-acidic",
          name: "Água Super Ácida",
          ph: "pH 2.5",
          use: "Higienização de tábuas de cortar, limpeza de superfícies da cozinha, higiene das mãos.",
          note: "Água ácida desinfetante. Não potável.",
          color: "from-amber-500 to-red-600",
          accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        },
      ],
    },
    confidence: {
      eyebrow: "ENGENHARIA E QUALIDADE",
      heading: "Especificações da Leveluk K8",
      sub: "Fabricada sob padrões de dispositivos médicos em Osaka, Japão.",
      specs: [
        { label: "Local de fabricação", value: "Osaka, Japão (Fábrica Enagic ISO 13485 / ISO 9001)" },
        { label: "Placas de eletrodo", value: "8 Placas de Titânio puro 99.97% banhadas em Platina" },
        { label: "Filtragem interna", value: "Filtro multi-estágio de alta performance (redução de cloro e odores)" },
        { label: "Garantia e suporte", value: "5 Anos de Garantia de Fábrica e suporte vitalício" },
        { label: "Requisitos de instalação", value: "Válvula desviadora padrão para torneira de cozinha" },
        { label: "Dimensões e peso", value: "345mm (L) x 279mm (A) x 147mm (P) · 6.3 kg" },
        { label: "Voltagem e energia", value: "Multi-voltagem AC 100–240V, 50/60Hz · Consumo máx ~230W" },
        { label: "Envio internacional", value: "Entrega direta para mais de 150 países" },
      ],
      certificationsTitle: "Certificações Oficiais Verificadas",
      certificationsLinkText: "Ver Certificações Oficiais da Enagic →",
      certificationsUrl: "https://www.enagic.com/en_US/product-certifications",
    },
    guidance: {
      eyebrow: "SUPORTE DIRETO DO DISTRIBUIDOR",
      heading: "Você não precisa escolher sozinho.",
      sub: "Conecte-se diretamente com seu distribuidor ou líder independente True Legacy para receber orientação personalizada, preços atuais, tirar dúvidas de instalação e verificar a disponibilidade no seu país.",
      distributorName: "Equipe True Legacy",
      distributorTitle: "Distribuidores Independentes Enagic · Suporte Global",
      distributorLanguages: "Idiomas: Português, Inglês, Espanhol, Francês",
      responseTime: "Atendimento direto do seu distribuidor",
      actions: {
        whatsapp: "Falar com seu distribuidor",
        consultation: "Solicitar consultoria",
        purchase: "Continuar para compra oficial",
      },
    },
    socialProof: {
      eyebrow: "EXPERIÊNCIAS REAIS",
      heading: "Observações de clientes no uso diário.",
      sub: "Relatos reais de famílias que integraram a Leveluk K8 em sua rotina doméstica.",
      featuredLabel: "HISTÓRIA EM DESTAQUE",
      stories: [
        {
          name: "Elena M.",
          location: "Miami, Flórida",
          quote: "A grande diferença na nossa cozinha foi a praticidade. Não precisamos mais carregar fardos de água mineral toda semana. Ter água filtrada fresca direto na torneira foi uma excelente mudança.",
          role: "Proprietária de K8",
        },
        {
          name: "Marc & Sophie T.",
          location: "Genebra, Suíça",
          quote: "Nosso distribuidor respondeu todas as nossas dúvidas sobre instalação antes da compra. O processo levou 15 minutos e a tela sensível ao toque facilita muito alternar entre os tipos de água.",
          role: "Proprietários de K8",
        },
        {
          name: "Carlos R.",
          location: "Bogotá, Colômbia",
          quote: "Usar a Água Super Kangen (pH 11) para lavar frutas e verduras virou um hábito diário na nossa casa.",
          role: "Proprietário de K8",
        },
        {
          name: "David L.",
          location: "Londres, Reino Unido",
          quote: "Buscávamos um sistema de água durável feito no Japão com garantia de fábrica real. A qualidade das 8 placas de titânio nos dá total confiança.",
          role: "Proprietário de K8",
        },
      ],
    },
    faq: {
      eyebrow: "PERGUNTAS E RESPOSTAS",
      heading: "Perguntas Frequentes",
      sub: "Respostas claras e fatuais sobre o ionizador Leveluk K8.",
      items: [
        {
          q: "O que a Leveluk K8 faz?",
          a: "A Leveluk K8 filtra a água da torneira com um filtro interno de alta qualidade para reduzir cloro, sedimentos e odores. Em seguida, passa a água por uma câmara de eletrólise com 8 placas de titânio banhadas em platina, gerando 5 tipos de água com diferentes níveis de pH.",
        },
        {
          q: "Quais águas podem ser consumidas?",
          a: "A Água Kangen® (pH 8.5, 9.0 e 9.5) e a Água Limpa (pH 7.0) são destinadas ao consumo e culinária. A Água Super Kangen (pH 11.0+), a Água de Beleza (pH 5.5–6.0) e a Água Super Ácida (pH 2.5) são exclusivamente para limpeza e estética; NÃO devem ser ingeridas.",
        },
        {
          q: "A K8 filtra a água?",
          a: "Sim. Ela possui um filtro interno de alta performance projetado para reduzir cloro e impurezas, preservando os minerais essenciais da água.",
        },
        {
          q: "Como é feita a instalação?",
          a: "É conectada facilmente à maioria das torneiras de cozinha com o adaptador incluído. Não requer reformas de encanamento.",
        },
        {
          q: "Qual a manutenção necessária?",
          a: "A máquina possui ciclos automáticos de autolimpeza. A manutenção periódica envolve a troca do filtro interno (aprox. uma vez por ano) e limpezas com ácido cítrico (E-cleaning).",
        },
        {
          q: "Quanto custa a Leveluk K8?",
          a: "O valor oficial varia conforme o país de envio e impostos aplicáveis. Entre em contato com seu distribuidor True Legacy para receber a cotação exata para o seu endereço.",
        },
        {
          q: "Existe opção de parcelamento?",
          a: "Sim. A Enagic oferece planos de pagamento parcelado em diversas regiões. Seu distribuidor pode orientar sobre as opções disponíveis para o seu país.",
        },
        {
          q: "Qual a garantia inclusa?",
          a: "A Leveluk K8 acompanha 5 Anos de Garantia de Fábrica completa para peças e mão de obra, cobrindo suporte oficial da Enagic.",
        },
        {
          q: "Pode ser enviada para o meu país?",
          a: "Sim. A Enagic realiza envios diretos para clientes em mais de 150 países.",
        },
        {
          q: "Por que comprar através de um distribuidor independente?",
          a: "A Enagic vende exclusivamente por distribuição direta. Comprar com um distribuidor credenciado garante suporte de instalação, registro oficial de garantia e acompanhamento contínuo.",
        },
      ],
    },
    finalCta: {
      heading: "Pronto para saber se a K8 é ideal para a sua casa?",
      sub: "Receba valores atualizados, orientações de instalação e tire todas as suas dúvidas diretamente com seu distribuidor—sem pressão.",
      primary: "Obter preços e disponibilidade",
      secondaryWhatsapp: "Falar com seu líder",
      secondaryEnagic: "Comprar na página oficial da Enagic",
      redirectNotice: "Nota: Ao clicar em 'Comprar na página oficial da Enagic' você será redirecionado para a loja oficial da Enagic.",
    },
    legal: {
      medical: "Aviso Médico: A Água Kangen® é água filtrada e ionizada. Não se destina a diagnosticar, tratar, curar ou prevenir doenças.",
      earnings: "Aviso de Distribuidor: True Legacy é uma equipe independente. Vendas de produtos Enagic oferecem comissões opcionais.",
      distributor: "Aviso Legal: Este site é operado de forma independente por distribuidores True Legacy e não é o site corporativo da Enagic Co., Ltd.",
    },
  },
} as const;

export type K8PageProps = {
  profile?: PublicDistributor | null;
  distributorSlug?: string;
};

export default function K8Page({ profile: propProfile, distributorSlug: propSlug }: K8PageProps = {}) {
  const params = useParams<{ countrySlug?: string; slug?: string; campaign?: string }>();
  const countrySlug = params.countrySlug;
  const activeSlug = propSlug || params.slug;

  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile);

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile);
      return;
    }
    if (activeSlug) {
      let active = true;
      getPublicDistributors().then((items) => {
        if (!active) return;
        const match = items.find((item) => item.slug === activeSlug);
        setProfile(match || null);
      });
      return () => {
        active = false;
      };
    }
  }, [propProfile, activeSlug]);

  const country =
    COUNTRIES.find((c) => c.slug === countrySlug) ??
    COUNTRIES.find((c) => c.slug === "usa") ??
    COUNTRIES[0];

  const { locale, setLocale } = useLocaleContext();
  const currentLang = (locale in LOCALES ? locale : "en") as keyof typeof LOCALES;
  const content = LOCALES[currentLang];

  const isLeaderPage = Boolean(profile || activeSlug);
  const distributorName = profile?.display_name || "True Legacy Team";
  const distributorFirstName = profile?.display_name ? profile.display_name.split(" ")[0] : "Your Distributor";
  const leaderAvatar =
    profile?.avatar_url ||
    (activeSlug ? getLeaderPortrait(activeSlug) : "/logos/tl-square-white.png");
  const leaderTitle =
    profile?.title || "Independent Enagic Distributor · True Legacy Leader";

  // Purchase Link detection
  const k8PurchaseUrl = getProductPurchaseLink(profile?.purchase_links, "k8");
  const hasPurchaseLink = Boolean(k8PurchaseUrl);

  // WhatsApp personalized destination
  const whatsappNumber = profile?.phone ? profile.phone.replace(/\D/g, "") : "";
  const getPersonalWhatsAppUrl = () => {
    if (!whatsappNumber) return "";
    let message = "";
    if (currentLang === "es") {
      message = `Hola ${distributorFirstName}, estoy revisando la página del Leveluk K8 en True Legacy y me gustaría hacerte unas preguntas sobre disponibilidad y precios.`;
    } else if (currentLang === "fr") {
      message = `Bonjour ${distributorFirstName}, je consulte la page du Leveluk K8 sur True Legacy et j'aimerais vous poser quelques questions sur les tarifs et l'installation.`;
    } else if (currentLang === "pt") {
      message = `Olá ${distributorFirstName}, estou visualizando a página do Leveluk K8 na True Legacy e gostaria de tirar algumas dúvidas sobre disponibilidade e valores.`;
    } else {
      message = `Hi ${distributorFirstName}, I'm reviewing the Leveluk K8 page on True Legacy and would love to ask you a few questions about availability and ordering.`;
    }
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const personalWhatsAppUrl = getPersonalWhatsAppUrl();
  const whatsappActionUrl = personalWhatsAppUrl || (whatsappNumber ? `https://wa.me/${whatsappNumber}` : country.jotformUrl ?? "/apply");

  const consultationUrl = profile
    ? `/apply?ref=${encodeURIComponent(profile.referral_code || activeSlug || "")}&interest=k8&source=kangen`
    : (country.jotformUrl ?? "/apply");

  const distributorProfileRoute = activeSlug ? `/d/${activeSlug}` : getDistributorLink(country.slug);

  // Force page to load from the very top on mount
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  // Video language selector state
  const [videoLang, setVideoLang] = useState<"en" | "es" | "fr" | "pt">(
    currentLang === "es" ? "es" : currentLang === "fr" ? "fr" : currentLang === "pt" ? "pt" : "en"
  );

  // Sync video language when page language changes
  useEffect(() => {
    setVideoLang(
      currentLang === "es" ? "es" : currentLang === "fr" ? "fr" : currentLang === "pt" ? "pt" : "en"
    );
  }, [currentLang]);

  // Interactive water tab state
  const [activeWaterTab, setActiveWaterTab] = useState(0);
  const activeWater = content.waterSettings.tabs[activeWaterTab];

  // Accordion transcript toggle
  const [showTranscript, setShowTranscript] = useState(false);

  // FAQ open index state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Scroll detection for dynamic sticky header primary action & past video detection
  const [pastVideoSection, setPastVideoSection] = useState(false);
  const videoSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (videoSectionRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        setPastVideoSection(rect.bottom < 120);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const effectiveDistributorSlug = activeSlug || profile?.slug;
  const distributorRoute = distributorProfileRoute;
  const jotformUrl = consultationUrl;
  const enagicOfficialUrl = "https://www.enagic.com/en_US/products/leveluk-k8";

  const videoUrl = localizedProductVideo("kangenWater", videoLang);

  const buyNowLabels = {
    en: "Buy Now",
    es: "Comprar Ahora",
    fr: "Acheter Maintenant",
    pt: "Comprar Agora",
  } as const;
  const buyNowLabel = buyNowLabels[currentLang] || "Buy Now";

  const contactDistributorLabels = {
    en: isLeaderPage ? `Contact ${distributorFirstName}` : "Contact Distributor",
    es: isLeaderPage ? `Contactar a ${distributorFirstName}` : "Contactar Distribuidor",
    fr: isLeaderPage ? `Contacter ${distributorFirstName}` : "Contacter Distributeur",
    pt: isLeaderPage ? `Falar com ${distributorFirstName}` : "Falar com Distribuidor",
  } as const;
  const contactDistributorLabel = contactDistributorLabels[currentLang] || "Contact Distributor";

  const messageWhatsappLabels = {
    en: isLeaderPage ? `WhatsApp ${distributorFirstName}` : "Message on WhatsApp",
    es: isLeaderPage ? `WhatsApp con ${distributorFirstName}` : "Mensaje por WhatsApp",
    fr: isLeaderPage ? `WhatsApp ${distributorFirstName}` : "Message sur WhatsApp",
    pt: isLeaderPage ? `WhatsApp com ${distributorFirstName}` : "Mensagem no WhatsApp",
  } as const;
  const messageWhatsappLabel = messageWhatsappLabels[currentLang] || "Message on WhatsApp";

  const handleActionClick = (actionName: string) => {
    trackEvent(`k8_${actionName}`, {
      locale: currentLang,
      country: country.slug,
      distributor: activeSlug || undefined,
    });
  };

  // Structured Data JSON-LD for FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-[#f8f9fa] selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative antialiased overflow-x-hidden">
      <SEO
        title={
          isLeaderPage
            ? `${distributorName} | Leveluk K8 Kangen Water® | True Legacy`
            : currentLang === "es"
              ? `Leveluk K8 Ionizador de Agua Kangen® | True Legacy ${countrySlug ? `(${country.name})` : ""}`
              : currentLang === "fr"
                ? `Leveluk K8 Ioniseur d'Eau Kangen® | True Legacy ${countrySlug ? `(${country.name})` : ""}`
                : currentLang === "pt"
                  ? `Leveluk K8 Ionizador de Água Kangen® | True Legacy ${countrySlug ? `(${country.name})` : ""}`
                  : `Leveluk K8 Kangen Water® Ionizer | True Legacy ${countrySlug ? `(${country.name})` : ""}`
        }
        description={content.hero.sub}
        image={leaderAvatar || "/true-legacy-assets/k8-hero-premium.png"}
        canonical={
          activeSlug
            ? `https://truelegacyworld.com/d/${activeSlug}/kangen`
            : `https://truelegacyworld.com${countrySlug ? `/${countrySlug}` : ""}/k8`
        }
      />

      {/* JSON-LD FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── STICKY SLIM HEADER (DESKTOP & TABLET) ── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070b12]/85 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Left: Back Button, Original True Legacy Logo, Kangen Water Badge & Back to Profile (if on leader page) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={distributorProfileRoute}
              label={isLeaderPage ? `Back to ${distributorFirstName}'s Profile` : 'Go back'}
            />
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-0.5 shrink-0"
            >
              <TrueLegacyLogo variant="nav" className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-[10px] font-semibold text-cyan-400/90 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
                Kangen Water®
              </span>
            </Link>

            {isLeaderPage && (
              <Link
                to={distributorProfileRoute}
                className="hidden lg:inline-flex items-center gap-1.5 ml-2 pl-3 border-l border-white/10 text-xs text-slate-300 hover:text-white transition-colors group"
                title={`Back to ${distributorName}'s Profile`}
              >
                <span className="text-slate-400">Leader:</span>
                <span className="font-semibold text-white truncate max-w-[120px]">{distributorFirstName}</span>
              </Link>
            )}
          </div>

          {/* Right Header Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Symmetrical Uniform Language Selector Bubbles */}
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {(["en", "es", "fr", "pt"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[11px] uppercase transition-all duration-200 shrink-0",
                    currentLang === lang
                      ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/10 font-bold"
                  )}
                  aria-label={`Switch language to ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Header Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2.5">
              {hasPurchaseLink && (
                <a
                  href={k8PurchaseUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("header_buy_now")}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{buyNowLabel}</span>
                </a>
              )}

              <a
                href="#video-demo"
                onClick={() => handleActionClick("header_watch_demo")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5",
                  !pastVideoSection && !hasPurchaseLink
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 font-bold"
                    : "border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                )}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {currentLang === "es"
                  ? "Ver Demostración"
                  : currentLang === "fr"
                    ? "Voir la Démo"
                    : currentLang === "pt"
                      ? "Ver Demonstração"
                      : "Watch Demo"}
              </a>

              {whatsappNumber ? (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("header_whatsapp")}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{messageWhatsappLabel}</span>
                </a>
              ) : (
                <Link
                  to={distributorProfileRoute}
                  onClick={() => handleActionClick("header_contact_distributor")}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{contactDistributorLabel}</span>
                </Link>
              )}

              <a
                href={jotformUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("header_get_pricing")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5 font-bold",
                  pastVideoSection && !hasPurchaseLink
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                    : "border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
                )}
              >
                {currentLang === "es"
                  ? "Obtener Precios"
                  : currentLang === "fr"
                    ? "Obtenir les Tarifs"
                    : currentLang === "pt"
                      ? "Obter Preços"
                      : "Get Pricing"}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM STICKY ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/15 bg-[#070b12]/95 backdrop-blur-2xl px-3 py-2.5 shadow-2xl">
        <div className="grid grid-cols-3 gap-2">
          <a
            href="#video-demo"
            onClick={() => handleActionClick("mobile_sticky_watch_demo")}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-[11px] hover:bg-cyan-500/25 transition-all text-center leading-tight"
          >
            <Play className="w-4 h-4 mb-1 text-cyan-400 fill-cyan-400/20" />
            <span>
              {currentLang === "es"
                ? "Ver Démo"
                : currentLang === "fr"
                  ? "Démo"
                  : currentLang === "pt"
                    ? "Ver Démo"
                    : "Watch Demo"}
            </span>
          </a>

          {whatsappNumber ? (
            <a
              href={personalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick("mobile_sticky_whatsapp")}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] hover:bg-emerald-500/25 transition-all text-center leading-tight"
            >
              <MessageCircle className="w-4 h-4 mb-1 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <Link
              to={distributorProfileRoute}
              onClick={() => handleActionClick("mobile_sticky_distributor")}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] hover:bg-emerald-500/25 transition-all text-center leading-tight"
            >
              <Users className="w-4 h-4 mb-1 text-emerald-400" />
              <span>
                {currentLang === "es"
                  ? "Distribuidor"
                  : currentLang === "fr"
                    ? "Distributeur"
                    : currentLang === "pt"
                      ? "Distribuidor"
                      : "Distributor"}
              </span>
            </Link>
          )}

          {hasPurchaseLink ? (
            <a
              href={k8PurchaseUrl!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick("mobile_sticky_buy_now")}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] shadow-lg shadow-amber-500/25 transition-all text-center leading-tight"
            >
              <ShoppingCart className="w-4 h-4 mb-1 fill-current" />
              <span>{buyNowLabel}</span>
            </a>
          ) : (
            <a
              href={jotformUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick("mobile_sticky_get_pricing")}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[11px] shadow-lg shadow-cyan-500/20 transition-all text-center leading-tight"
            >
              <Zap className="w-4 h-4 mb-1 fill-current" />
              <span>
                {currentLang === "es"
                  ? "Precios"
                  : currentLang === "fr"
                    ? "Tarifs"
                    : currentLang === "pt"
                      ? "Preços"
                      : "Get Pricing"}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* ── HERO SECTION — FULL-BLEED CINEMATIC BACKGROUND ── */}
      <section
        className="relative overflow-hidden border-b border-white/10"
        style={{
          minHeight: "clamp(600px, 55vw, 800px)",
        }}
      >
        {/* ── Full-bleed background image ── */}
        <div
          className="k8-hero-bg absolute inset-0 w-full h-full"
          aria-hidden="true"
          style={{
            backgroundImage: "url('/true-legacy-assets/k8-cinematic-hero.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            // Desktop: image is 16:9, K8 sits right-center. Anchor it so K8 stays right.
            backgroundPosition: "center right",
          }}
        />

        {/* ── Left-to-center gradient for text readability — light touch only ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to right, rgba(7,11,18,0.82) 0%, rgba(7,11,18,0.72) 30%, rgba(7,11,18,0.30) 55%, rgba(7,11,18,0.0) 75%)",
          }}
        />
        {/* subtle top/bottom vignette for edge polish */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,11,18,0.4) 0%, transparent 18%, transparent 80%, rgba(7,11,18,0.5) 100%)",
          }}
        />

        {/* ── Hero content — left-aligned ── */}
        <div className="relative z-10 h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: "inherit" }}>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="w-full max-w-[520px] lg:max-w-[560px] xl:max-w-[600px] py-14 md:py-20 space-y-5"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-black/30 backdrop-blur-sm px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{content.hero.eyebrow}</span>
            </div>

            {/* Headline — 3-line premium editorial treatment */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Better water,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                freshly made
              </span>
              <br />
              at your tap.
            </h1>

            {/* Supporting paragraph */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
              {content.hero.sub}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#video-demo"
                onClick={() => handleActionClick("hero_primary_watch_demo")}
                className="inline-flex items-center gap-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-cyan-500/30 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                <Play className="w-4 h-4 fill-slate-950 shrink-0" />
                <span>{content.hero.ctaPrimary}</span>
              </a>

              {hasPurchaseLink && (
                <a
                  href={k8PurchaseUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("hero_buy_now")}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-amber-500/30"
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>{buyNowLabel}</span>
                </a>
              )}

              {whatsappNumber ? (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("hero_whatsapp")}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{messageWhatsappLabel}</span>
                </a>
              ) : (
                <Link
                  to={distributorProfileRoute}
                  onClick={() => handleActionClick("hero_secondary_distributor")}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                >
                  <Users className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{content.hero.ctaSecondary}</span>
                </Link>
              )}
            </div>

            {/* Trust / value points */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-x-4 gap-y-2">
              {content.hero.claims.map((claim, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-snug">{claim}</span>
                </div>
              ))}
            </div>

            {/* Leader / distributor attribution */}
            <div className="pt-1">
              {isLeaderPage ? (
                <Link
                  to={distributorProfileRoute}
                  className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors p-2 pr-4 group"
                >
                  <img
                    src={leaderAvatar}
                    alt={distributorName}
                    className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                      <span>{distributorName}</span>
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div className="text-[11px] text-slate-400">{leaderTitle}</div>
                  </div>
                </Link>
              ) : (
                <div className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black/30 backdrop-blur-sm p-2 pr-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{content.hero.presentedBy}</div>
                    <div className="text-[11px] text-cyan-400/90 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{content.hero.distributorTag}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Mobile-only: responsive background via style tag ── */}
        <style>{`
          @media (max-width: 639px) {
            .k8-hero-bg { background-position: 72% center !important; min-height: 680px !important; }
          }
          @media (min-width: 640px) and (max-width: 1023px) {
            .k8-hero-bg { background-position: 65% center !important; }
          }
        `}</style>
      </section>


      <section
        id="video-demo"
        ref={videoSectionRef}
        className="py-16 md:py-24 border-b border-white/10 bg-[#070b12] relative"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">
              {content.demo.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {content.demo.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {content.demo.sub}
            </p>
          </div>

          {/* Language Selector Bar for Video */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <span className="text-xs font-semibold text-slate-400">
              {content.demo.langSelectLabel}
            </span>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-xl">
              {(
                [
                  { code: "en", label: "English" },
                  { code: "es", label: "Español" },
                  { code: "fr", label: "Français" },
                  { code: "pt", label: "Português" },
                ] as const
              ).map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setVideoLang(code)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200",
                    videoLang === code
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Video Player Container */}
          <div className="relative rounded-3xl border border-cyan-500/30 bg-black/60 p-2 sm:p-3 shadow-2xl shadow-cyan-950/40 overflow-hidden mb-6">
            <YouTubeEmbed
              url={videoUrl}
              title="Leveluk K8 4-Minute Demonstration"
              className="rounded-2xl"
            />
          </div>

          {/* Transcript / Summary Accordion */}
          <div className="mb-10">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{content.demo.transcriptToggle}</span>
              </div>
              {showTranscript ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 rounded-2xl border border-white/10 bg-black/40 p-5 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                    {content.demo.transcriptText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Post-Video Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-2xl mx-auto">
            {hasPurchaseLink && (
              <a
                href={k8PurchaseUrl!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("post_video_buy_now")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-6 py-3.5 text-sm transition-all shadow-lg shadow-amber-500/25 text-center hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{buyNowLabel}</span>
              </a>
            )}

            {whatsappNumber ? (
              <a
                href={personalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("post_video_whatsapp")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20 text-center hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>{messageWhatsappLabel}</span>
              </a>
            ) : (
              <Link
                to={distributorProfileRoute}
                onClick={() => handleActionClick("post_video_contact_distributor")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3.5 text-sm transition-all text-center"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{contactDistributorLabel}</span>
              </Link>
            )}

            <a
              href={jotformUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick("post_video_get_pricing")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-cyan-500/20 text-center"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{content.demo.actions.pricing}</span>
            </a>
          </div>
        </div>

        {/* Featured Mobile Customer Story (Shown directly after video on mobile) */}
        <div className="mt-12 md:hidden mx-auto max-w-md px-4">
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-black/40 p-5 relative">
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-1 rounded-full inline-block mb-3">
              {content.socialProof.featuredLabel}
            </span>
            <p className="text-xs text-slate-200 italic leading-relaxed mb-4">
              "{content.socialProof.stories[0].quote}"
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
              <span className="font-bold text-white">
                {content.socialProof.stories[0].name}
              </span>
              <span>{content.socialProof.stories[0].location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVERYDAY-VALUE SECTION ── */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#090f1a] to-[#070b12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
              {content.value.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {content.value.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {content.value.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Lifestyle Image Left */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl border border-white/15 bg-white/[0.02] overflow-hidden p-3 shadow-2xl group">
                <img
                  src="/true-legacy-assets/k8-lifestyle-kitchen.png"
                  alt="Leveluk K8 kitchen lifestyle integration with happy couple"
                  className="w-full h-auto object-cover rounded-2xl max-h-[440px] transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 3 Benefit Blocks Right */}
            <div className="lg:col-span-6 space-y-6">
              {content.value.blocks.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 font-bold text-cyan-400 text-base">
                      0{idx + 1}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-white">
                        {block.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {block.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE WATER-SETTINGS SECTION ── */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
              {content.waterSettings.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {content.waterSettings.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {content.waterSettings.sub}
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {content.waterSettings.tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveWaterTab(idx)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border",
                  activeWaterTab === idx
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full bg-gradient-to-r",
                    tab.color
                  )}
                />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Display + Image Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8">
            {/* Left: Interactive Tab Data */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-black border",
                      activeWater.accentBg
                    )}
                  >
                    {activeWater.ph}
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    {activeWater.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Primary Household Uses:
                  </div>
                  <div className="text-sm font-medium text-slate-200">
                    {activeWater.use}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Usage & Handling Note:
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed">
                    {activeWater.note}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Section Image (k8-everyday-uses.png) */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/10 overflow-hidden shadow-xl p-2 bg-black/40">
                <img
                  src="/true-legacy-assets/k8-everyday-uses.png"
                  alt="Leveluk K8 everyday practical water uses demonstration"
                  className="w-full h-auto object-cover rounded-xl max-h-[380px]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Clarification Banner for Non-Drinking Water */}
          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {content.waterSettings.clarificationNotice}
            </p>
          </div>
        </div>
      </section>

      {/* ── PRODUCT CONFIDENCE / SPECIFICATIONS PANEL ── */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#0b121e] to-[#070b12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
              {content.confidence.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {content.confidence.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {content.confidence.sub}
            </p>
          </div>

          {/* Specification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {content.confidence.specs.map((spec, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {spec.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white sm:text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Official Certifications Banner Link */}
          <div className="rounded-3xl border border-cyan-500/30 bg-cyan-950/20 p-6 sm:p-8 text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {content.confidence.certificationsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
              Enagic holds ISO 13485 (Medical Devices Quality Management System), ISO 9001, ISO 14001, and the Water Quality Association (WQA) Gold Seal certification.
            </p>
            <div>
              <a
                href={content.confidence.certificationsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("certifications_link")}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>{content.confidence.certificationsLinkText}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PERSONAL GUIDANCE SECTION (GENERIC TEAM / DISTRIBUTOR ROUTING) ── */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12] relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-8 sm:p-12 shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Team or Leader Avatar & Meta */}
              <div className="lg:col-span-5 text-center lg:text-left space-y-4">
                {isLeaderPage ? (
                  <img
                    src={leaderAvatar}
                    alt={distributorName}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-2 border-cyan-500/40 mx-auto lg:mx-0 shadow-2xl"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto lg:mx-0 shadow-2xl">
                    <Users className="w-16 h-16" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {distributorName}
                  </h3>
                  <div className="text-xs font-semibold text-cyan-400 mt-1">
                    {leaderTitle}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center justify-center lg:justify-start gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{content.guidance.distributorLanguages}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center justify-center lg:justify-start gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{content.guidance.responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Guidance Copy & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                    {content.guidance.eyebrow}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white">
                    {content.guidance.heading}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {content.guidance.sub}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  {hasPurchaseLink && (
                    <a
                      href={k8PurchaseUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick("guidance_buy_now")}
                      className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-6 py-3.5 text-sm transition-all shadow-lg shadow-amber-500/25 hover:scale-105"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{buyNowLabel}</span>
                    </a>
                  )}

                  {whatsappNumber ? (
                    <a
                      href={personalWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick("guidance_whatsapp")}
                      className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <MessageCircle className="w-4 h-4 fill-slate-950" />
                      <span>{messageWhatsappLabel}</span>
                    </a>
                  ) : (
                    <Link
                      to={distributorProfileRoute}
                      onClick={() => handleActionClick("guidance_distributor")}
                      className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Users className="w-4 h-4 fill-slate-950" />
                      <span>{contactDistributorLabel}</span>
                    </Link>
                  )}

                  <a
                    href={jotformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick("guidance_consultation")}
                    className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3.5 text-sm transition-all"
                  >
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>{content.guidance.actions.consultation}</span>
                  </a>

                  {!hasPurchaseLink && (
                    <a
                      href={enagicOfficialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick("guidance_enagic_official")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-5 py-3.5 text-xs transition-all"
                    >
                      <span>{content.guidance.actions.purchase}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / CUSTOMER OBSERVATIONS ── */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#090f1a] to-[#070b12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
              {content.socialProof.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {content.socialProof.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {content.socialProof.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.socialProof.stories.map((story, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{story.name}</div>
                    <div className="text-[11px] text-slate-400">{story.location}</div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-medium border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                    {story.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
              {content.faq.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {content.faq.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {content.faq.sub}
            </p>
          </div>

          <div className="space-y-3">
            {content.faq.items.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:text-cyan-400 transition-colors gap-4"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CONVERSION SECTION ── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#070b12] via-[#0c1524] to-[#070b12] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {content.finalCta.heading}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              {content.finalCta.sub}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {hasPurchaseLink && (
              <a
                href={k8PurchaseUrl!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("final_buy_now")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-8 py-4 text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/25"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{buyNowLabel}</span>
              </a>
            )}

            {whatsappNumber ? (
              <a
                href={personalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("final_whatsapp")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-7 py-4 text-base transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>{messageWhatsappLabel}</span>
              </a>
            ) : (
              <Link
                to={distributorProfileRoute}
                onClick={() => handleActionClick("final_contact_leader")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-7 py-4 text-base transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{contactDistributorLabel}</span>
              </Link>
            )}

            <a
              href={jotformUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick("final_get_pricing")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-8 py-4 text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-cyan-500/25"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>{content.finalCta.primary}</span>
            </a>

            {!hasPurchaseLink && (
              <a
                href={enagicOfficialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("final_buy_official")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-6 py-4 text-sm transition-all"
              >
                <span>{content.finalCta.secondaryEnagic}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400 pt-2">
            {content.finalCta.redirectNotice}
          </p>
        </div>
      </section>

      {/* ── TRUST & LEGAL COMPLIANCE FOOTER DISCLOSURES ── */}
      <footer className="py-12 border-t border-white/10 bg-[#04070d] text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3 leading-relaxed">
            <p>{content.legal.medical}</p>
            <p>{content.legal.earnings}</p>
            <p>{content.legal.distributor}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-bold text-white">TRUE LEGACY WORLD</span>
              <span>© {new Date().getFullYear()} All Rights Reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/legal" className="hover:text-white transition-colors">
                Privacy Policy & Terms
              </Link>
              <a
                href="https://www.enagic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Enagic® Corporate</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
