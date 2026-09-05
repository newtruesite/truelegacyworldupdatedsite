import { SEO } from '@/components/SEO'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { trackEvent } from '@/lib/analytics'
import { getLeaderPortrait, getPublicDistributors, submitCrmApplication, type PublicDistributor } from '@/lib/crm'
import { getProductPurchaseLink } from '@/config/productPurchaseLinks'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplets,
  ExternalLink,
  FileText,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Leaf,
  MessageCircle,
  Play,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sun,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// ── LOCALIZATION DICTIONARY ──────────────────────────────────
const LOCALES = {
  en: {
    hero: {
      eyebrow: 'KANGEN UKON® · OKINAWAN TURMERIC · MADE IN JAPAN',
      headline_1: 'ANCIENT ROOTS.',
      headline_2: 'MODERN RITUAL.',
      sub: 'Kangen Ukon® brings Okinawan turmeric tradition into a modern daily supplement, produced in Japan and prepared using Kangen Water® as part of the process.',
      ctaPrimary: 'Explore Ukon',
      ctaSecondary: 'Watch the Story',
      claims: [
        'Made in Japan',
        'Okinawan Turmeric',
        'Kangen Water® Processed',
        '100 Capsules',
      ],
      presentedBy: 'True Legacy Product Guidance',
      distributorTag: 'Independent Enagic Distributor',
      buyNow: 'Buy Now',
      askOrdering: 'Ask About Ordering',
      contactDistributor: 'Contact Distributor',
      whatsappDistributor: 'WhatsApp',
    },
    journey: {
      eyebrow: 'THE UKON JOURNEY',
      headline: 'From Okinawan Earth to a Modern Ritual',
      sub: 'Dedicated fields, careful harvest, vivid golden turmeric, and precise Japanese formulation—shown through the real visual story of Ukon.',
      items: [
        {
          src: '/ukon/yanbaru-field-close.jpg',
          title: 'Rooted in Yanbaru, Okinawa',
          desc: 'Mineral-dense subtropical soil',
        },
        {
          src: '/ukon/farmer-among-ukon.jpg',
          title: 'Careful Cultivation',
          desc: 'Grown without synthetic chemicals',
        },
        {
          src: '/ukon/farm-harvest.jpg',
          title: 'Harvested at the Source',
          desc: 'Hand-harvested at peak vitality',
        },
        {
          src: '/ukon/turmeric-root.jpg',
          title: 'The Golden Rhizome',
          desc: 'Wild Haru & Autumn Aki Ukon',
        },
        {
          src: '/ukon/turmeric-spoon.jpg',
          title: 'Pure Curcuminoids',
          desc: 'Concentrated antioxidant essence',
        },
        {
          src: '/ukon/turmeric-powder-board.jpg',
          title: 'Artisanal Preparation',
          desc: 'Washed with Kangen Water®',
        },
        {
          src: '/ukon/turmeric-bowl.jpg',
          title: 'Ground Turmeric Root',
          desc: '100% natural, additive-free',
        },
        {
          src: '/ukon/mehdi-enagic-kangen-foods-okinawa.jpg',
          title: 'Enagic Kangen Foods Farm',
          desc: 'Mehdi Cohen at the Okinawa facility',
        },
      ],
    },
    supplement: {
      eyebrow: 'NEW TO UKON?',
      headline: 'Start with the supplement.',
      sub: 'The plant-based softgel—concentrated curcumin, Kangen Water®, and 100% additive-free turmeric essential oil in a single daily capsule.',
      badge: 'Core Formula · 100 Capsules',
      body1:
        'For centuries, Okinawan cultivation has revered wild turmeric for daily balance and vitality. Kangen Ukon® Sigma brings together organic Spring Turmeric (Wild Haru Ukon) and Autumn Turmeric (Aki Ukon), grown in northern Okinawa and prepared without synthetic binders or artificial preservatives.',
      body2:
        'Enagic’s patented softgel encapsulation utilizes a vegetable-derived carrageenan shell made from seaweed. This airtight matrix encases active curcuminoids and volatile essential oils, protecting them from atmospheric oxidation until the moment of consumption.',
      highlights: [
        { label: 'Okinawan Yanbaru Heritage', desc: 'Cultivated in northern Okinawa’s pristine subtropical soil' },
        { label: 'Dual Turmeric Synergy', desc: 'Combines both Spring Ukon and Autumn Ukon for balanced curcuminoid richness' },
        { label: 'Patented Softgel Matrix', desc: 'Individually blistered vegetable softgels preventing active oil oxidation' },
        { label: 'Kangen Water® Prepared', desc: 'Cleaned and prepared using Enagic’s proprietary water ionization technology' },
      ],
      ctaLearn: 'Explore Formulation',
      ctaBuy: 'Order Ukon Sigma',
    },
    heritage: {
      eyebrow: 'OKINAWA, JAPAN',
      headline: 'Rooted in centuries of tradition.',
      sub: 'In the subtropical hills of northern Okinawa, clean ocean air and fertile mineral soil have sustained wild turmeric cultivation for over five hundred years.',
      badge: '500-Year Japanese Botanical Legacy',
      body1:
        'Centuries ago during the Ryukyu Kingdom, court physicians prescribed local turmeric as a treasured daily botanical restorative. Today, Enagic preserves this revered tradition in northern Okinawa’s Yanbaru district—famed globally as one of the world’s prime longevity blue zones.',
      body2:
        'Grown with dedicated care and free from harmful agricultural pesticides, the turmeric thrives under intense Pacific sunlight and clean mountain rainfall before being carefully harvested at peak seasonal potency.',
      quote:
        '“The tradition is unbroken. The soil is pristine. And the standard of Japanese craftsmanship remains uncompromising.”',
      stats: [
        { value: '500+', label: 'Years of Okinawan Tradition' },
        { value: '100%', label: 'Japanese Cultivation' },
        { value: '0', label: 'Synthetic Pesticides or Binders' },
      ],
    },
    process: {
      eyebrow: 'FROM ROOT TO PRODUCT',
      headline: 'From Okinawa to your daily routine.',
      sub: 'A deliberate, transparent journey from Japanese volcanic soil to your morning wellness habit.',
      steps: [
        {
          num: '01',
          title: 'GROWN IN OKINAWA',
          desc: 'Cultivated in the mineral-rich subtropical soil of northern Yanbaru, nourished by clean ocean breezes and tropical rains.',
        },
        {
          num: '02',
          title: 'HARVESTED AT PEAK',
          desc: 'Hand-selected at optimal maturity to ensure the highest natural concentrations of curcumin and aromatic essential oils.',
        },
        {
          num: '03',
          title: 'CLEANSED WITH KANGEN WATER®',
          desc: 'Washed and prepared using Strong Acidic Water (pH 2.5) and Strong Kangen Water (pH 11.5) without synthetic cleansers.',
        },
        {
          num: '04',
          title: 'PRODUCED IN JAPAN',
          desc: 'Carefully encapsulated at Enagic’s certified cleanroom facility in Okinawa under strict pharmaceutical-grade quality control.',
        },
        {
          num: '05',
          title: 'PACKAGED AS KANGEN UKON®',
          desc: 'Individually sealed in patented vegetable softgels to safeguard volatile botanical oils against oxidation and light.',
        },
      ],
    },
    waterConnection: {
      eyebrow: 'THE ENAGIC DIFFERENCE',
      headline: 'Water is part of the process.',
      sub: 'How Kangen Water® technology purifies and enhances the preparation of every single capsule.',
      bridgeTag: 'Kangen Water® Technology Bridge',
      cards: [
        {
          title: 'Strong Acidic Water (pH 2.5)',
          tag: 'Natural Cleansing Stage',
          desc: 'Used to sanitize and wash the freshly harvested turmeric roots, removing external impurities naturally without synthetic sanitizers.',
        },
        {
          title: 'Strong Kangen Water (pH 11.5)',
          tag: 'Botanical Preparation',
          desc: 'Applied to soak and prepare the roots, neutralizing surface oils and maximizing the purity of the natural plant extracts.',
        },
        {
          title: 'Ionized Moisture Synergy',
          tag: 'Softgel Integrity',
          desc: 'Kangen Water is integrated during the encapsulation process, marrying Enagic’s water science with traditional Okinawan herbal wisdom.',
        },
      ],
    },
    family: {
      eyebrow: 'THE UKON FAMILY',
      headline: 'Three expressions of Okinawan wellness.',
      sub: 'Explore the full Enagic Ukon product family—from the core daily supplement to soothing tea and handcrafted botanical soap.',
      items: [
        {
          id: 'ukon_sigma',
          title: 'Kangen Ukon® Sigma',
          category: 'Flagship Supplement',
          img: '/products/ukon/ukon-sigma-box.png',
          desc: 'Enagic’s core dietary supplement combining Spring and Autumn Ukon with curcumin, tocotrienols, and essential plant oils.',
          features: ['100 Softgel Capsules', 'Made in Okinawa, Japan', 'Patented Plant Softgel'],
          hasPurchase: true,
        },
        {
          id: 'ukon_tea',
          title: 'Kangen Ukon® Tea',
          category: 'Antioxidant Herbal Infusion',
          img: '/products/ukon/ukon-tea.png',
          desc: 'A pure, caffeine-free herbal tea crafted from roasted Yanbaru turmeric, offering a rich, warm, and restorative daily brew.',
          features: ['100% Okinawan Turmeric', 'Naturally Caffeine-Free', 'Rich in Polyphenols'],
          hasPurchase: false,
        },
        {
          id: 'ukon_soap',
          title: 'Kangen Ukon® Soap',
          category: 'Botanical Cleansing Bar',
          img: '/products/ukon/ukon-soap.png',
          desc: 'A luxurious natural beauty bar infused with Okinawan turmeric extracts, raw honey, and plant oils for gentle daily skin radiance.',
          features: ['Artisan Hand-Poured', 'Turmeric & Honey Extract', 'Gentle for Face & Body'],
          hasPurchase: false,
        },
      ],
      learnMore: 'Learn More',
      buyNow: 'Buy Now',
      askAvailability: 'Ask About Availability',
    },
    facility: {
      eyebrow: 'ENAGIC KANGEN FOODS',
      headline: 'Made in Okinawa.',
      sub: 'Every capsule, teabag, and soap bar is produced in Enagic’s dedicated certified facility in Okinawa, Japan.',
      badge: 'Certified Okinawan Manufacturing',
      points: [
        'Dedicated Enagic Kangen Foods facility in Okinawa',
        'Cleanroom processing adhering to strict Japanese hygiene protocols',
        'The same Kangen Water® technology that cleanses the roots fills the production line',
        'Full batch traceability from dedicated Yanbaru farm soils to packaged box',
      ],
    },
    ritual: {
      eyebrow: 'DAILY WELLNESS RITUAL',
      headline: 'Simple enough for every day.',
      sub: 'A calm, intentional morning ritual that integrates seamlessly into modern living.',
      cards: [
        {
          title: '01. Morning Hydration',
          desc: 'Pair your daily serving of Kangen Ukon® with a fresh glass of Kangen Water® (pH 8.5–9.5) to kickstart your morning with clarity.',
        },
        {
          title: '02. Portable Freshness',
          desc: 'Individually sealed blister packs preserve every softgel against humidity and heat, slipping easily into your travel bag, briefcase, or desk.',
        },
        {
          title: '03. Daily Consistency',
          desc: 'Three smooth softgels each day deliver consistent botanical nutrition without complicated measuring, powders, or mess.',
        },
      ],
    },
    specs: {
      eyebrow: 'PRODUCT TRANSPARENCY',
      headline: 'Kangen Ukon® Sigma facts.',
      sub: 'Verified specifications and package details for the flagship dietary supplement.',
      rows: [
        { label: 'Product Name', value: 'Kangen Ukon® Sigma Dietary Supplement' },
        { label: 'Manufacturer', value: 'Enagic® (Produced in Okinawa, Japan)' },
        { label: 'Packaging', value: '100 Softgel Capsules per Box (Individually Blistered)' },
        { label: 'Serving Size', value: '3 Capsules Daily with Water' },
        { label: 'Key Botanicals', value: 'Spring Turmeric (Wild Haru Ukon), Autumn Turmeric (Aki Ukon)' },
        { label: 'Active Nutrients', value: 'Curcumin, Turmeric Essential Oil, Tocotrienols, Vitamins B1, B2, B6, B12, C, E, Niacin, Folic Acid' },
        { label: 'Softgel Shell', value: 'Plant-Derived Carrageenan (Seaweed Extract)' },
        { label: 'Water Processing', value: 'Cleansed and prepared using Enagic® Kangen Water® technology' },
      ],
      notice:
        'Dietary Supplement Notice: This product is not intended to diagnose, treat, cure, or prevent any disease. Packaging and serving recommendations may vary by market.',
    },
    video: {
      eyebrow: 'CINEMATIC STORY',
      headline: 'See the story behind Ukon.',
      sub: 'Take an intimate look at the pristine Yanbaru turmeric fields, the harvesting process, and Enagic’s dedicated Okinawa facility.',
      transcriptBtn: 'View Video Summary & Key Highlights',
      transcript: `The Okinawa Origin of Kangen Ukon® presentation highlights:
• Pristine Yanbaru Fields: Turmeric cultivated without synthetic chemicals in northern Okinawa's fertile subtropical soil.
• Traditional Hand Harvesting: Roots harvested at peak maturity when curcuminoid density and essential oils reach their zenith.
• Kangen Water® Cleansing: Fresh roots washed in Strong Acidic Water (pH 2.5) and conditioned with Strong Kangen Water (pH 11.5).
• Encapsulation Technology: Enclosing active turmeric oils in patented airtight vegetable-based softgels to prevent oxidation until swallowed.`,
    },
    guide: {
      eyebrow: 'COMPLIMENTARY RESOURCE',
      headline: 'The True Legacy Guide to Kangen Ukon®',
      sub: 'Five centuries of Okinawan turmeric heritage, preparation with Kangen Water®, and simple daily habits—gathered into one free editorial guide.',
      bullets: [
        'The 500-year Okinawan turmeric tradition, explained in plain language',
        'How Kangen Water® purifies every root without harsh agricultural chemicals',
        'Practical daily rituals for the supplement, tea, and botanical soap',
      ],
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'WhatsApp / Phone (Optional)',
      country: 'Country',
      submit: 'Send Me the Free Guide',
      submitting: 'Preparing Your Guide...',
      success: 'Thank you! Your guide request has been received. Your distributor will send it directly to your inbox.',
      consent: 'We respect your privacy. Your information is shared only with your verified True Legacy distributor for product education.',
    },
    ecosystem: {
      eyebrow: 'THE TRUE LEGACY ECOSYSTEM',
      headline: 'Part of a bigger wellness system.',
      sub: 'True Legacy educates global households on Enagic’s complementary pillars: Ionized Molecular Hydrogen Water, Environmental EMF Harmonization, and Ancient Botanical Nutrition.',
      kangenCard: {
        title: 'Leveluk K8 Water Ionizer',
        desc: '8-plate medical-grade Japanese water ionization creating active molecular hydrogen hydration right at your sink.',
        cta: 'Explore Kangen Water®',
      },
      ukonCard: {
        title: 'Kangen Ukon® Sigma',
        desc: 'Okinawan turmeric heritage encapsulated in patented vegetable softgels, prepared with Kangen Water®.',
        cta: 'You Are Here',
      },
    },
    faq: {
      eyebrow: 'FREQUENTLY ASKED QUESTIONS',
      headline: 'Everything you need to know about Ukon.',
      items: [
        {
          q: 'What is Kangen Ukon®?',
          a: 'Kangen Ukon® is Enagic’s premium line of dietary and lifestyle products centered around wild turmeric cultivated in Okinawa, Japan. The flagship product is Ukon Sigma, an encapsulated softgel dietary supplement combining Spring and Autumn turmeric with supporting antioxidant oils.',
        },
        {
          q: 'Where is Kangen Ukon grown and produced?',
          a: 'The turmeric is grown on dedicated organic farms in Yanbaru, northern Okinawa, Japan. Every supplement box, teabag, and soap bar is manufactured at Enagic’s dedicated Kangen Foods production facility on Okinawa island.',
        },
        {
          q: 'What type of turmeric is used?',
          a: 'Enagic utilizes both Spring Turmeric (known in Japan as Haru Ukon, celebrated for its high aromatic essential oil profile) and Autumn Turmeric (Aki Ukon, known for high curcumin content), creating a balanced, synergistic botanical formula.',
        },
        {
          q: 'How is Kangen Water® involved in the process?',
          a: 'Enagic uses its proprietary water technology directly in production: freshly harvested roots are cleansed with Strong Acidic Water (pH 2.5) to remove surface impurities without harsh chemicals, and prepared with Strong Kangen Water (pH 11.5) before gentle drying and encapsulation.',
        },
        {
          q: 'How many capsules are included, and what is the serving size?',
          a: 'Each standard box contains 100 softgel capsules sealed in individual blister cards. The official suggested serving size is 3 softgels daily taken with fresh water.',
        },
        {
          q: 'Is the capsule made of gelatin?',
          a: 'No. Enagic uses a patented vegetable-derived capsule shell made from carrageenan (a natural seaweed extract) and rice oil, making it free of bovine or porcine gelatin.',
        },
        {
          q: 'What other Ukon products are available?',
          a: 'In addition to Ukon Sigma supplement capsules, the Kangen Ukon family includes loose-leaf/bagged Okinawan Turmeric Tea and handcrafted Kangen Ukon Soap bars.',
        },
        {
          q: 'How do I order Kangen Ukon?',
          a: 'You can order directly online if your verified distributor has saved their official checkout link on this page (via the Buy Now button), or you can connect with your distributor via WhatsApp or the contact form to confirm pricing and delivery options for your specific country.',
        },
        {
          q: 'Does Kangen Ukon treat or cure medical conditions?',
          a: 'No. Kangen Ukon® is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease. Individuals taking prescription medication, pregnant, or nursing should consult their physician before adding any new supplement to their routine.',
        },
      ],
    },
    closing: {
      eyebrow: 'PERSONAL DISTRIBUTOR GUIDANCE',
      headline: 'Curious about Ukon?',
      sub: 'Talk directly with your True Legacy distributor about Kangen Ukon®, current availability, and ordering options in your market.',
      verifiedBadge: 'Verified True Legacy Distributor',
      independentTag: 'Independent Enagic® Distributor',
      buyNow: 'Buy Now',
      askOrdering: 'Ask About Ordering',
      whatsapp: 'WhatsApp',
      returnProfile: 'Return to Profile',
    },
  },
  es: {
    hero: {
      eyebrow: 'KANGEN UKON® · CÚRCUMA DE OKINAWA · HECHO EN JAPÓN',
      headline_1: 'RAÍCES ANCESTRALES.',
      headline_2: 'RITUAL MODERNO.',
      sub: 'Kangen Ukon® transforma la tradición de cúrcuma de Okinawa en un suplemento diario de máxima pureza, producido en Japón y elaborado con Agua Kangen®.',
      ctaPrimary: 'Explorar Ukon',
      ctaSecondary: 'Ver la Historia',
      claims: [
        'Hecho en Japón',
        'Cúrcuma de Okinawa',
        'Procesado con Agua Kangen®',
        '100 Cápsulas',
      ],
      presentedBy: 'Guía de Producto True Legacy',
      distributorTag: 'Distribuidor Independiente Enagic',
      buyNow: 'Comprar Ahora',
      askOrdering: 'Consultar Pedido',
      contactDistributor: 'Contactar Distribuidor',
      whatsappDistributor: 'WhatsApp',
    },
    journey: {
      eyebrow: 'EL VIAJE DE UKON',
      headline: 'De la tierra de Okinawa a un ritual moderno',
      sub: 'Campos dedicados, cosecha meticulosa, cúrcuma dorada viva y formulación japonesa de precisión a través de la historia visual de Ukon.',
      items: [
        {
          src: '/ukon/yanbaru-field-close.jpg',
          title: 'Arraigado en Yanbaru, Okinawa',
          desc: 'Suelo subtropical rico en minerales',
        },
        {
          src: '/ukon/farmer-among-ukon.jpg',
          title: 'Cultivo cuidadoso',
          desc: 'Sin pesticidas ni químicos sintéticos',
        },
        {
          src: '/ukon/farm-harvest.jpg',
          title: 'Cosechado en el origen',
          desc: 'Recolección a mano en plena vitalidad',
        },
        {
          src: '/ukon/turmeric-root.jpg',
          title: 'El rizoma dorado',
          desc: 'Sinergia de Haru y Aki Ukon silvestre',
        },
        {
          src: '/ukon/turmeric-spoon.jpg',
          title: 'Curcuminoides puros',
          desc: 'Esencia antioxidante concentrada',
        },
        {
          src: '/ukon/turmeric-powder-board.jpg',
          title: 'Preparación artesanal',
          desc: 'Lavado con Agua Kangen®',
        },
        {
          src: '/ukon/turmeric-bowl.jpg',
          title: 'Cúrcuma pura molida',
          desc: '100% natural y libre de aditivos',
        },
        {
          src: '/ukon/mehdi-enagic-kangen-foods-okinawa.jpg',
          title: 'Granja Enagic Kangen Foods',
          desc: 'Mehdi Cohen en la sede de Okinawa',
        },
      ],
    },
    supplement: {
      eyebrow: '¿NUEVO EN UKON?',
      headline: 'Comienza con el suplemento.',
      sub: 'La cápsula vegetal patentada: curcumina concentrada, Agua Kangen® y aceite esencial puro de cúrcuma en una sola cápsula diaria.',
      badge: 'Fórmula Principal · 100 Cápsulas',
      body1:
        'Durante generaciones, la agricultura de Okinawa ha reverenciado la cúrcuma silvestre para el equilibrio diario. Kangen Ukon® Sigma reúne Cúrcuma de Primavera (Haru Ukon) y Cúrcuma de Otoño (Aki Ukon), cultivadas sin pesticidas sintéticos.',
      body2:
        'La cápsula vegetal patentada de Enagic utiliza carragenina de algas marinas. Esta matriz hermética protege los aceites esenciales de la oxidación hasta el momento del consumo.',
      highlights: [
        { label: 'Origen Yanbaru, Okinawa', desc: 'Cultivado en suelo volcánico subtropical virgen del norte de Okinawa' },
        { label: 'Sinergia de Dos Cúrcumas', desc: 'Combina cúrcuma de primavera y otoño para mayor riqueza de curcuminoides' },
        { label: 'Cápsula Vegetal Hermética', desc: 'Blísters individuales que previenen la degradación por aire y luz' },
        { label: 'Tratado con Agua Kangen®', desc: 'Purificado y preparado con la tecnología de ionización de Enagic' },
      ],
      ctaLearn: 'Ver Formulación',
      ctaBuy: 'Ordenar Ukon Sigma',
    },
    heritage: {
      eyebrow: 'OKINAWA, JAPÓN',
      headline: 'Arraigado en siglos de tradición.',
      sub: 'En las colinas subtropicales del norte de Okinawa, el aire oceánico limpio y la tierra mineralizada han sustentado la cúrcuma por más de 500 años.',
      badge: '500 Años de Legado Botánico Japonés',
      body1:
        'Durante el Reino de Ryukyu, los médicos reales prescribían la cúrcuma local como un tónico botánico diario. Hoy, Enagic preserva esta tradición en Yanbaru, zona azul de longevidad.',
      body2:
        'Cultivada sin pesticidas sintéticos, la cúrcuma crece bajo el sol del Pacífico y lluvias limpias antes de su cosecha manual en el punto óptimo de madurez.',
      quote:
        '“La tradición continúa viva. La tierra permanece pura y los estándares de manufactura japonesa son insuperables.”',
      stats: [
        { value: '500+', label: 'Años de Tradición' },
        { value: '100%', label: 'Cultivo en Japón' },
        { value: '0', label: 'Químicos o Aglutinantes Sintéticos' },
      ],
    },
    process: {
      eyebrow: 'DEL CULTIVO A TU RUTINA',
      headline: 'De Okinawa a tu rutina diaria.',
      sub: 'Un viaje transparente desde la tierra volcánica japonesa hasta tu hábito de bienestar matutino.',
      steps: [
        {
          num: '01',
          title: 'CULTIVADO EN OKINAWA',
          desc: 'Cultivo natural en el suelo subtropical de Yanbaru, bañado por brisas marinas.',
        },
        {
          num: '02',
          title: 'COSECHA EN SU PUNTO',
          desc: 'Selección manual con la máxima concentración de aceites esenciales y curcumina.',
        },
        {
          num: '03',
          title: 'PURIFICADO CON AGUA KANGEN®',
          desc: 'Lavado con Agua Ácida Fuerte (pH 2.5) y preparado con Agua Kangen Fuerte (pH 11.5).',
        },
        {
          num: '04',
          title: 'PRODUCIDO EN JAPÓN',
          desc: 'Encapsulado en la fábrica certificada de Enagic en Okinawa bajo salas limpias.',
        },
        {
          num: '05',
          title: 'ENVASADO COMO KANGEN UKON®',
          desc: 'Sellado hermético individual en cápsulas vegetales para evitar la oxidación.',
        },
      ],
    },
    waterConnection: {
      eyebrow: 'LA DIFERENCIA ENAGIC',
      headline: 'El agua es parte del proceso.',
      sub: 'Cómo la tecnología de Agua Kangen® purifica y enriquece cada cápsula.',
      bridgeTag: 'Conexión con Tecnología Kangen Water®',
      cards: [
        {
          title: 'Agua Ácida Fuerte (pH 2.5)',
          tag: 'Etapa de Limpieza Natural',
          desc: 'Limpia profundamente las raíces de cúrcuma sin utilizar desinfectantes químicos sintéticos.',
        },
        {
          title: 'Agua Kangen Fuerte (pH 11.5)',
          tag: 'Preparación Botánica',
          desc: 'Acondiciona las raíces y extrae la vitalidad de los componentes botánicos con máxima pureza.',
        },
        {
          title: 'Sinergia de Ionización',
          tag: 'Integridad del Suplemento',
          desc: 'El Agua Kangen se integra en la preparación, uniendo la tecnología japonesa y la herencia natural.',
        },
      ],
    },
    family: {
      eyebrow: 'LA FAMILIA UKON',
      headline: 'Tres expresiones del bienestar de Okinawa.',
      sub: 'Descubre la gama completa: suplemento diario, infusión reconfortante y jabón botánico artesanal.',
      items: [
        {
          id: 'ukon_sigma',
          title: 'Kangen Ukon® Sigma',
          category: 'Suplemento Insignia',
          img: '/products/ukon/ukon-sigma-box.png',
          desc: 'El suplemento principal de Enagic con cúrcuma de primavera y otoño, curcumina y aceites botánicos.',
          features: ['100 Cápsulas Blandas', 'Hecho en Okinawa, Japón', 'Cápsula Vegetal Patentada'],
          hasPurchase: true,
        },
        {
          id: 'ukon_tea',
          title: 'Kangen Ukon® Tea',
          category: 'Té Botánico Antioxidante',
          img: '/products/ukon/ukon-tea.png',
          desc: 'Infusión pura sin cafeína elaborada con cúrcuma tostada de Yanbaru para una hidratación antioxidante.',
          features: ['100% Cúrcuma de Okinawa', 'Naturalmente Sin Cafeína', 'Rico en Polifenoles'],
          hasPurchase: false,
        },
        {
          id: 'ukon_soap',
          title: 'Kangen Ukon® Soap',
          category: 'Jabón Botánico Facial y Corporal',
          img: '/products/ukon/ukon-soap.png',
          desc: 'Barra natural enriquecida con cúrcuma de Okinawa, miel cruda y aceites nutritivos para una piel radiante.',
          features: ['Elaboración Artesanal', 'Extracto de Cúrcuma y Miel', 'Suave para Rostro y Cuerpo'],
          hasPurchase: false,
        },
      ],
      learnMore: 'Más Información',
      buyNow: 'Comprar Ahora',
      askAvailability: 'Consultar Disponibilidad',
    },
    facility: {
      eyebrow: 'ENAGIC KANGEN FOODS',
      headline: 'Hecho en Okinawa.',
      sub: 'Cada producto se fabrica en las instalaciones certificadas de Enagic en Okinawa, Japón.',
      badge: 'Manufactura Certificada en Okinawa',
      points: [
        'Instalaciones dedicadas Enagic Kangen Foods en Okinawa',
        'Salas limpias con estrictos protocolos sanitarios japoneses',
        'La misma tecnología de Agua Kangen® fluye por la línea de producción',
        'Trazabilidad total desde el suelo agrícola hasta el empaque final',
      ],
    },
    ritual: {
      eyebrow: 'RITUAL DE BIENESTAR',
      headline: 'Tan sencillo como tu día a día.',
      sub: 'Un hábito matutino claro y fácil de mantener en cualquier lugar.',
      cards: [
        {
          title: '01. Hidratación Matutina',
          desc: 'Toma tu porción diaria junto a un vaso de Agua Kangen® fresca (pH 8.5–9.5) para empezar tu día en balance.',
        },
        {
          title: '02. Blísters Portátiles',
          desc: 'Las cápsulas individuales selladas caben fácilmente en tu bolso, mochila o escritorio sin sufrir humedad.',
        },
        {
          title: '03. Constancia sin Esfuerzo',
          desc: 'Tres pequeñas cápsulas blandas al día aportan nutrición botánica constante sin polvos ni complicaciones.',
        },
      ],
    },
    specs: {
      eyebrow: 'TRANSPARENCIA TOTAL',
      headline: 'Datos de Kangen Ukon® Sigma.',
      sub: 'Especificaciones oficiales de la fórmula insignia.',
      rows: [
        { label: 'Producto', value: 'Kangen Ukon® Sigma Dietary Supplement' },
        { label: 'Fabricante', value: 'Enagic® (Producido en Okinawa, Japón)' },
        { label: 'Presentación', value: '100 Cápsulas Blandas por Caja (Blísters Individuales)' },
        { label: 'Porción Sugerida', value: '3 Cápsulas Diarias con Agua' },
        { label: 'Ingredientes Botánicos', value: 'Cúrcuma de Primavera (Haru Ukon), Cúrcuma de Otoño (Aki Ukon)' },
        { label: 'Nutrientes Activos', value: 'Curcumina, Aceites Esenciales, Tocotrienoles, Vitaminas B, C, E, Niacina' },
        { label: 'Cubierta de Cápsula', value: 'Carragenina Vegetal de Algas Marinas' },
        { label: 'Procesamiento con Agua', value: 'Elaborado con tecnología de ionización Enagic® Kangen Water®' },
      ],
      notice:
        'Aviso de Suplemento: Este producto no tiene la intención de diagnosticar, tratar, curar o prevenir ninguna enfermedad.',
    },
    video: {
      eyebrow: 'HISTORIA CINEMATOGRÁFICA',
      headline: 'Conoce la historia de Ukon.',
      sub: 'Descubre los campos de Yanbaru, la cosecha tradicional y la fábrica de Enagic en Okinawa.',
      transcriptBtn: 'Ver Resumen del Video',
      transcript: `El origen de Kangen Ukon® en Okinawa:
• Cultivos en Yanbaru: Cúrcuma orgánica sin pesticidas químicos en el norte de Okinawa.
• Cosecha Tradicional: Recolección manual en el punto óptimo de aceites esenciales.
• Purificación con Agua Kangen®: Lavado en Agua Ácida Fuerte (pH 2.5) y Agua Kangen Fuerte (pH 11.5).
• Encapsulado Vegetal: Sellado hermético que protege los aceites activos contra el aire y la luz.`,
    },
    guide: {
      eyebrow: 'RECURSO GRATUITO',
      headline: 'La Guía True Legacy de Kangen Ukon®',
      sub: 'Cinco siglos de tradición de Okinawa, procesamiento con Agua Kangen® y hábitos diarios sencillos.',
      bullets: [
        'La tradición de 500 años de cúrcuma explicada con claridad',
        'Cómo el Agua Kangen® purifica cada raíz sin químicos agrícolas',
        'Rutinas diarias prácticas para el suplemento, té y jabón',
      ],
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electrónico',
      phone: 'WhatsApp / Teléfono (Opcional)',
      country: 'País',
      submit: 'Enviarme la Guía Gratuita',
      submitting: 'Preparando tu Guía...',
      success: '¡Gracias! Tu solicitud ha sido recibida. Tu distribuidor te enviará la guía directamente.',
      consent: 'Respetamos tu privacidad. Tus datos se comparten únicamente con tu distribuidor verificado.',
    },
    ecosystem: {
      eyebrow: 'ECOSISTEMA TRUE LEGACY',
      headline: 'Parte de un sistema integral de bienestar.',
      sub: 'Enagic combina ionización de agua con hidrógeno molecular, armonización EMF y nutrición botánica milenaria.',
      kangenCard: {
        title: 'Ionizador Leveluk K8',
        desc: 'Tecnología médica japonesa de 8 placas para agua antioxidante rica en hidrógeno.',
        cta: 'Explorar Agua Kangen®',
      },
      ukonCard: {
        title: 'Kangen Ukon® Sigma',
        desc: 'Cúrcuma de Okinawa en cápsulas vegetales tratadas con Agua Kangen®.',
        cta: 'Estás Aquí',
      },
    },
    faq: {
      eyebrow: 'PREGUNTAS FRECUENTES',
      headline: 'Todo lo que necesitas saber sobre Ukon.',
      items: [
        {
          q: '¿Qué es Kangen Ukon®?',
          a: 'Kangen Ukon® es la línea de suplementos y productos botánicos de Enagic elaborados con cúrcuma silvestre de Okinawa, Japón. El producto principal es Ukon Sigma en cápsulas blandas.',
        },
        {
          q: '¿Dónde se cultiva y produce?',
          a: 'Se cultiva en granjas dedicadas en Yanbaru, al norte de Okinawa, y se fabrica en la planta certificada Enagic Kangen Foods en la isla de Okinawa.',
        },
        {
          q: '¿Qué tipo de cúrcuma se utiliza?',
          a: 'Utiliza Cúrcuma de Primavera (Haru Ukon, rica en aceites esenciales) y Cúrcuma de Otoño (Aki Ukon, con alto contenido de curcumina).',
        },
        {
          q: '¿Cómo interviene el Agua Kangen®?',
          a: 'Las raíces se lavan con Agua Ácida Fuerte (pH 2.5) para higienizarlas sin químicos y se acondicionan con Agua Kangen Fuerte (pH 11.5) antes del encapsulado.',
        },
        {
          q: '¿Cuántas cápsulas vienen y cuál es la dosis?',
          a: 'La caja contiene 100 cápsulas blandas en blísters individuales. La porción sugerida es de 3 cápsulas al día con agua.',
        },
        {
          q: '¿La cápsula contiene gelatina animal?',
          a: 'No. Utiliza una cápsula vegetal patentada a base de carragenina (alga marina) y aceite de arroz, libre de gelatinas bovinas o porcinas.',
        },
        {
          q: '¿Qué otros productos existen?',
          a: 'Además del suplemento Ukon Sigma, la familia incluye té de cúrcuma en hebras/saquitos y jabón botánico artesanal.',
        },
        {
          q: '¿Cómo puedo ordenar?',
          a: 'Puedes comprar en línea si tu distribuidor tiene su enlace guardado (botón Comprar Ahora) o consultar directamente por WhatsApp para conocer precios en tu país.',
        },
        {
          q: '¿Trata o cura alguna enfermedad?',
          a: 'No. Es un suplemento dietario y no tiene el propósito de diagnosticar, tratar, curar ni prevenir ninguna enfermedad.',
        },
      ],
    },
    closing: {
      eyebrow: 'ORIENTACIÓN DE TU DISTRIBUIDOR',
      headline: '¿Tienes preguntas sobre Ukon?',
      sub: 'Habla directamente con tu distribuidor True Legacy sobre Kangen Ukon®, disponibilidad y pedidos oficiales.',
      verifiedBadge: 'Distribuidor True Legacy Verificado',
      independentTag: 'Distribuidor Independiente Enagic®',
      buyNow: 'Comprar Ahora',
      askOrdering: 'Consultar Pedido',
      whatsapp: 'WhatsApp',
      returnProfile: 'Volver al Perfil',
    },
  },
  fr: {
    hero: {
      eyebrow: 'KANGEN UKON® · CURCUMA D’OKINAWA · FABRIQUÉ AU JAPON',
      headline_1: 'RACINES ANCESTRALES.',
      headline_2: 'RITUEL MODERNE.',
      sub: 'Kangen Ukon® incarne la tradition du curcuma d’Okinawa en un complément quotidien haut de gamme, produit au Japon et préparé avec l’Eau Kangen®.',
      ctaPrimary: 'Explorer Ukon',
      ctaSecondary: 'Voir l’Histoire',
      claims: [
        'Fabriqué au Japon',
        'Curcuma d’Okinawa',
        'Préparé à l’Eau Kangen®',
        '100 Gélules',
      ],
      presentedBy: 'Conseil Produit True Legacy',
      distributorTag: 'Distributeur Indépendant Enagic',
      buyNow: 'Acheter',
      askOrdering: 'Commander',
      contactDistributor: 'Contacter le Distributeur',
      whatsappDistributor: 'WhatsApp',
    },
    journey: {
      eyebrow: 'LE VOYAGE DU UKON',
      headline: 'De la terre d’Okinawa au rituel moderne',
      sub: 'Champs préservés, récolte minutieuse, curcuma doré vibrant et formulation japonaise d’excellence à travers l’histoire visuelle du Ukon.',
      items: [
        {
          src: '/ukon/yanbaru-field-close.jpg',
          title: 'Enraciné dans le Yanbaru, Okinawa',
          desc: 'Terres subtropicales riches en minéraux',
        },
        {
          src: '/ukon/farmer-among-ukon.jpg',
          title: 'Culture attentionnée',
          desc: 'Sans engrais ni pesticides de synthèse',
        },
        {
          src: '/ukon/farm-harvest.jpg',
          title: 'Récolte à la source',
          desc: 'Cueillie à la main à maturité optimale',
        },
        {
          src: '/ukon/turmeric-root.jpg',
          title: 'Le rhizome doré',
          desc: 'Synergie Haru & Aki Ukon sauvage',
        },
        {
          src: '/ukon/turmeric-spoon.jpg',
          title: 'Curcuminoïdes purs',
          desc: 'Concentré antioxydant naturel',
        },
        {
          src: '/ukon/turmeric-powder-board.jpg',
          title: 'Préparation artisanale',
          desc: 'Purifié avec l’Eau Kangen®',
        },
        {
          src: '/ukon/turmeric-bowl.jpg',
          title: 'Poudre de curcuma pure',
          desc: '100% naturel, sans aucun additif',
        },
        {
          src: '/ukon/mehdi-enagic-kangen-foods-okinawa.jpg',
          title: 'Domaine Enagic Kangen Foods',
          desc: 'Mehdi Cohen sur le site d’Okinawa',
        },
      ],
    },
    supplement: {
      eyebrow: 'NOUVEAU SUR UKON ?',
      headline: 'Commencez par le complément.',
      sub: 'La gélule végétale brevetée : curcumine concentrée, Eau Kangen® et huile essentielle pure de curcuma en une prise quotidienne.',
      badge: 'Formule Majeure · 100 Gélules',
      body1:
        'Depuis des siècles à Okinawa, le curcuma sauvage est vénéré pour l’équilibre corporel. Kangen Ukon® Sigma associe le Curcuma de Printemps et le Curcuma d’Automne, cultivés sans engrais ni pesticides de synthèse.',
      body2:
        'La gélule brevetée d’Enagic est conçue à base de carraghénane extrait d’algues marines, formant une capsule hermétique préservant les huiles essentielles actives de toute oxydation.',
      highlights: [
        { label: 'Terroir Yanbaru d’Okinawa', desc: 'Cultivé dans les terres subtropicales préservées du nord d’Okinawa' },
        { label: 'Double Synergie Botanique', desc: 'Associe curcuma de printemps et d’automne pour une haute teneur en curcuminoïdes' },
        { label: 'Gélule Végétale Hermétique', desc: 'Blisters individuels protégeant les huiles volatiles contre l’air et la lumière' },
        { label: 'Préparé à l’Eau Kangen®', desc: 'Purifié et conditionné selon la technologie d’ionisation exclusive d’Enagic' },
      ],
      ctaLearn: 'Découvrir la Formule',
      ctaBuy: 'Commander Ukon Sigma',
    },
    heritage: {
      eyebrow: 'OKINAWA, JAPON',
      headline: 'Enraciné dans des siècles de tradition.',
      sub: 'Dans les collines subtropicales du nord d’Okinawa, l’air marin pur et les sols volcaniques riches nourrissent le curcuma depuis plus de cinq cents ans.',
      badge: '500 Ans d’Héritage Botanique Japonais',
      body1:
        'Sous l’ère du Royaume des Ryukyu, les médecins de cour prescrivaient le curcuma comme un élixir de vitalité. Aujourd’hui, Enagic perpétue cet héritage dans le Yanbaru, célèbre zone bleue de longévité.',
      body2:
        'Cultivé sans pesticides chimiques, le curcuma puise l’énergie du soleil pacifique et des pluies bienfaisantes avant d’être récolté à la main à pleine maturité.',
      quote:
        '« La tradition est vivante, la terre est pure et l’exigence de fabrication japonaise demeure sans compromis. »',
      stats: [
        { value: '500+', label: 'Ans de Tradition' },
        { value: '100%', label: 'Culture au Japon' },
        { value: '0', label: 'Pesticides de Synthèse' },
      ],
    },
    process: {
      eyebrow: 'DE LA TERRE À VOTRE RITUEL',
      headline: 'D’Okinawa à votre quotidien.',
      sub: 'Un parcours transparent et rigoureux, du sol japonais jusqu’à votre rituel du matin.',
      steps: [
        {
          num: '01',
          title: 'CULTIVÉ À OKINAWA',
          desc: 'Culture biologique dans les terres subtropicales fertiles du nord de Yanbaru.',
        },
        {
          num: '02',
          title: 'RÉCOLTÉ À MATURITÉ',
          desc: 'Sélection manuelle optimale pour garantir la richesse en curcuminoïdes et huiles précieuses.',
        },
        {
          num: '03',
          title: 'NETTOYÉ À L’EAU KANGEN®',
          desc: 'Lavage à l’Eau Fortement Acide (pH 2.5) et préparation à l’Eau Forte Kangen (pH 11.5).',
        },
        {
          num: '04',
          title: 'PRODUIT AU JAPON',
          desc: 'Conditionné dans l’usine certifiée d’Enagic à Okinawa en salle blanche sous contrôle strict.',
        },
        {
          num: '05',
          title: 'SCELLÉ EN GÉLULES KANGEN UKON®',
          desc: 'Capsules végétales individuelles étanches pour préserver les principes actifs sans conservateur.',
        },
      ],
    },
    waterConnection: {
      eyebrow: 'L’EXPERTISE ENAGIC',
      headline: 'L’eau fait partie intégrante du procédé.',
      sub: 'Comment la technologie d’Eau Kangen® purifie et sublime chaque gélule.',
      bridgeTag: 'Synergie Technologique Kangen Water®',
      cards: [
        {
          title: 'Eau Fortement Acide (pH 2.5)',
          tag: 'Étape de Lavage Naturel',
          desc: 'Purifie les racines récoltées sans aucun désinfectant chimique ni solvant de synthèse.',
        },
        {
          title: 'Eau Forte Kangen (pH 11.5)',
          tag: 'Préparation Botanique',
          desc: 'Trempage des racines pour libérer et préserver les extraits végétaux avec une pureté remarquable.',
        },
        {
          title: 'Synergie d’Ionisation',
          tag: 'Intégrité de la Gélule',
          desc: 'L’Eau Kangen participe à l’encapsulation, unissant science de l’eau et sagesse botanique japonaise.',
        },
      ],
    },
    family: {
      eyebrow: 'LA FAMILLE UKON',
      headline: 'Trois déclinaisons du bien-être d’Okinawa.',
      sub: 'Découvrez la collection Enagic Ukon : complément quotidien, thé bienfaisant et savon botanique.',
      items: [
        {
          id: 'ukon_sigma',
          title: 'Kangen Ukon® Sigma',
          category: 'Complément Majeur',
          img: '/products/ukon/ukon-sigma-box.png',
          desc: 'Le complément phare d’Enagic alliant curcuma de printemps et d’automne, tocotriénols et huiles précieuses.',
          features: ['100 Gélules Végétales', 'Fabriqué à Okinawa, Japon', 'Gélule Végétale Brevetée'],
          hasPurchase: true,
        },
        {
          id: 'ukon_tea',
          title: 'Kangen Ukon® Tea',
          category: 'Infusion Botanique Antioxydante',
          img: '/products/ukon/ukon-tea.png',
          desc: 'Une infusion pure sans caféine à base de curcuma torréfié de Yanbaru, riche en arômes et antioxydants.',
          features: ['100% Curcuma d’Okinawa', 'Naturellement Sans Caféine', 'Riche en Polyphénols'],
          hasPurchase: false,
        },
        {
          id: 'ukon_soap',
          title: 'Kangen Ukon® Soap',
          category: 'Pain Végétal Visage et Corps',
          img: '/products/ukon/ukon-soap.png',
          desc: 'Un savon naturel artisanal infusé aux extraits de curcuma d’Okinawa et miel brut pour illuminer la peau.',
          features: ['Fabrication Artisanale', 'Extrait de Curcuma & Miel', 'Doux pour Visage et Corps'],
          hasPurchase: false,
        },
      ],
      learnMore: 'En Savoir Plus',
      buyNow: 'Acheter',
      askAvailability: 'Demander Disponibilité',
    },
    facility: {
      eyebrow: 'ENAGIC KANGEN FOODS',
      headline: 'Fabriqué à Okinawa.',
      sub: 'Chaque boîte est façonnée au sein de l’usine certifiée d’Enagic à Okinawa, Japon.',
      badge: 'Fabrication Certifiée à Okinawa',
      points: [
        'Unité de production Enagic Kangen Foods dédiée à Okinawa',
        'Salles blanches répondant aux normes d’hygiène pharmaceutique japonaises',
        'La même technologie d’Eau Kangen® circule sur la chaîne de production',
        'Traçabilité totale, du champ d’Okinawa jusqu’au conditionnement final',
      ],
    },
    ritual: {
      eyebrow: 'RITUEL DE BIEN-ÊTRE',
      headline: 'Simple et adapté à votre quotidien.',
      sub: 'Une habitude du matin pure et facile à maintenir en voyage comme chez soi.',
      cards: [
        {
          title: '01. Hydratation Matinale',
          desc: 'Prenez vos gélules avec un grand verre d’Eau Kangen® fraîche (pH 8.5–9.5) pour démarrer la journée en pleine clarté.',
        },
        {
          title: '02. Blisters Nomades',
          desc: 'Chaque capsule scellée reste préservée de l’humidité et s’emporte aisément dans votre sac, valise ou bureau.',
        },
        {
          title: '03. Régularité Sans Effort',
          desc: 'Trois petites gélules végétales par jour pour une nutrition botanique constante, sans poudres salissantes.',
        },
      ],
    },
    specs: {
      eyebrow: 'TRANSPARENCE TOTALE',
      headline: 'Caractéristiques de Kangen Ukon® Sigma.',
      sub: 'Données vérifiées et composition officielle de la formule.',
      rows: [
        { label: 'Nom du Produit', value: 'Kangen Ukon® Sigma Dietary Supplement' },
        { label: 'Fabricant', value: 'Enagic® (Fabriqué à Okinawa, Japon)' },
        { label: 'Conditionnement', value: '100 Gélules par Boîte (Sous Blisters Hermétiques)' },
        { label: 'Portion Conseillée', value: '3 Gélules par Jour avec un Verre d’Eau' },
        { label: 'Plantes Clés', value: 'Curcuma de Printemps (Haru Ukon), Curcuma d’Automne (Aki Ukon)' },
        { label: 'Actifs Nutritionnels', value: 'Curcumine, Huile Essentielle de Curcuma, Tocotriénols, Vitamines B, C, E' },
        { label: 'Enveloppe', value: 'Carraghénane Végétal d’Algues Marines' },
        { label: 'Procédé à l’Eau', value: 'Nettoyé et préparé selon la technologie Enagic® Kangen Water®' },
      ],
      notice:
        'Avertissement : Ce produit est un complément alimentaire et n’a pas pour but de diagnostiquer, traiter, guérir ou prévenir une maladie.',
    },
    video: {
      eyebrow: 'HISTOIRE CINÉMATIQUE',
      headline: 'Regardez l’histoire d’Ukon.',
      sub: 'Immersion au cœur des champs de Yanbaru et de l’usine Enagic d’Okinawa.',
      transcriptBtn: 'Voir le Résumé de la Vidéo',
      transcript: `L’origine de Kangen Ukon® à Okinawa :
• Champs de Yanbaru : Culture de curcuma biologique sans pesticides au nord d'Okinawa.
• Récolte Manuelle : Cueillette au sommet de concentration en curcumine et huiles.
• Traitement à l’Eau Kangen® : Lavage en Eau Acide Forte (pH 2.5) et Eau Forte Kangen (pH 11.5).
• Encapsulation Végétale : Scellement hermétique anti-oxydation pour préserver les principes actifs.`,
    },
    guide: {
      eyebrow: 'RESSOURCE GRATUITE',
      headline: 'Le Guide True Legacy de Kangen Ukon®',
      sub: 'Cinq siècles de sagesse d’Okinawa, préparation à l’Eau Kangen® et rituels quotidiens.',
      bullets: [
        'La tradition du curcuma d’Okinawa expliquée en toute simplicité',
        'Comment l’Eau Kangen® purifie chaque racine sans produits chimiques',
        'Des conseils pratiques pour intégrer le complément, le thé et le savon',
      ],
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse E-mail',
      phone: 'WhatsApp / Téléphone (Optionnel)',
      country: 'Pays',
      submit: 'M’envoyer le Guide Gratuit',
      submitting: 'Préparation du Guide...',
      success: 'Merci ! Votre demande a été enregistrée. Votre distributeur vous fera parvenir le guide sous peu.',
      consent: 'Nous respectons votre vie privée. Vos informations sont uniquement transmises à votre distributeur agréé.',
    },
    ecosystem: {
      eyebrow: 'ÉCOSYSTÈME TRUE LEGACY',
      headline: 'Une approche holistique du bien-être.',
      sub: 'Enagic associe l’eau ionisée à l’hydrogène moléculaire, la défense contre les ondes et la nutrition botanique japonaise.',
      kangenCard: {
        title: 'Ioniseur Leveluk K8',
        desc: '8 plaques en titane platiné pour une eau antioxydante d’exception à votre robinet.',
        cta: 'Explorer l’Eau Kangen®',
      },
      ukonCard: {
        title: 'Kangen Ukon® Sigma',
        desc: 'Curcuma d’Okinawa en gélules végétales traitées à l’Eau Kangen®.',
        cta: 'Vous Êtes Ici',
      },
    },
    faq: {
      eyebrow: 'QUESTIONS FRÉQUENTES',
      headline: 'Tout comprendre sur Kangen Ukon.',
      items: [
        {
          q: 'Qu’est-ce que Kangen Ukon® ?',
          a: 'Kangen Ukon® est la gamme d’Enagic dédiée au curcuma sauvage d’Okinawa au Japon. Le produit phare est Ukon Sigma, un complément alimentaire en gélules végétales scellées.',
        },
        {
          q: 'Où le curcuma est-il cultivé et produit ?',
          a: 'Il est cultivé dans des fermes dédiées à Yanbaru, au nord d’Okinawa, et conditionné dans l’usine Enagic Kangen Foods à Okinawa.',
        },
        {
          q: 'Quelles variétés de curcuma sont utilisées ?',
          a: 'Enagic combine le Curcuma de Printemps (Haru Ukon, riche en huiles essentielles aromatiques) et le Curcuma d’Automne (Aki Ukon, réputé pour sa curcumine).',
        },
        {
          q: 'Quel est le rôle de l’Eau Kangen® ?',
          a: 'Les racines sont lavées à l’Eau Fortement Acide (pH 2.5) sans produits chimiques, puis conditionnées à l’Eau Forte Kangen (pH 11.5) avant séchage et encapsulation.',
        },
        {
          q: 'Combien de gélules par boîte et quelle est la posologie ?',
          a: 'Chaque boîte contient 100 gélules sous blisters étanches. La portion recommandée est de 3 gélules par jour avec un verre d’eau.',
        },
        {
          q: 'La capsule contient-elle de la gélatine animale ?',
          a: 'Non. Enagic emploie une gélule végétale brevetée à base de carraghénane (extrait d’algue) et d’huile de riz, exempte de gélatine bovine ou porcine.',
        },
        {
          q: 'Quels sont les autres produits Ukon ?',
          a: 'Outre les gélules Ukon Sigma, la gamme comprend le thé d’Okinawa en feuilles/sachets et le savon végétal surgras au curcuma et miel.',
        },
        {
          q: 'Comment commander ?',
          a: 'Vous pouvez commander en ligne si votre distributeur a renseigné son lien officiel (bouton Acheter), ou le joindre sur WhatsApp pour vérifier les modalités dans votre pays.',
        },
        {
          q: 'Le produit soigne-t-il des maladies ?',
          a: 'Non. C’est un complément alimentaire qui ne prétend ni diagnostiquer, ni traiter, ni guérir, ni prévenir une pathologie.',
        },
      ],
    },
    closing: {
      eyebrow: 'CONSEIL DE VOTRE DISTRIBUTEUR',
      headline: 'Des questions sur Ukon ?',
      sub: 'Échangez directement avec votre distributeur True Legacy sur les disponibilités et la commande officielle.',
      verifiedBadge: 'Distributeur True Legacy Vérifié',
      independentTag: 'Distributeur Indépendant Enagic®',
      buyNow: 'Acheter',
      askOrdering: 'Commander',
      whatsapp: 'WhatsApp',
      returnProfile: 'Retour au Profil',
    },
  },
  pt: {
    hero: {
      eyebrow: 'KANGEN UKON® · CÚRCUMA DE OKINAWA · FEITO NO JAPÃO',
      headline_1: 'RAÍZES ANCESTRAIS.',
      headline_2: 'RITUAL MODERNO.',
      sub: 'Kangen Ukon® traduz a tradição de cúrcuma de Okinawa em um suplemento diário de excelência, produzido no Japão e preparado com Água Kangen®.',
      ctaPrimary: 'Explorar Ukon',
      ctaSecondary: 'Assistir à História',
      claims: [
        'Feito no Japão',
        'Cúrcuma de Okinawa',
        'Processado com Água Kangen®',
        '100 Cápsulas',
      ],
      presentedBy: 'Consultoria de Produto True Legacy',
      distributorTag: 'Distribuidor Independente Enagic',
      buyNow: 'Comprar Agora',
      askOrdering: 'Consultar Pedido',
      contactDistributor: 'Falar com Distribuidor',
      whatsappDistributor: 'WhatsApp',
    },
    journey: {
      eyebrow: 'A JORNADA DO UKON',
      headline: 'Da terra de Okinawa a um ritual moderno',
      sub: 'Campos dedicados, colheita cuidadosa, cúrcuma dourada intensa e formulação japonesa de precisão através da história visual do Ukon.',
      items: [
        {
          src: '/ukon/yanbaru-field-close.jpg',
          title: 'Enraizado em Yanbaru, Okinawa',
          desc: 'Solo subtropical rico em minerais',
        },
        {
          src: '/ukon/farmer-among-ukon.jpg',
          title: 'Cultivo cuidadoso',
          desc: 'Sem químicos sintéticos ou agrotóxicos',
        },
        {
          src: '/ukon/farm-harvest.jpg',
          title: 'Colhido na origem',
          desc: 'Colheita manual no ponto ideal de vitalidade',
        },
        {
          src: '/ukon/turmeric-root.jpg',
          title: 'O rizoma dourado',
          desc: 'Sinergia de Haru e Aki Ukon selvagem',
        },
        {
          src: '/ukon/turmeric-spoon.jpg',
          title: 'Curcuminoides puros',
          desc: 'Essência antioxidante concentrada',
        },
        {
          src: '/ukon/turmeric-powder-board.jpg',
          title: 'Preparo artesanal',
          desc: 'Higienizado com Água Kangen®',
        },
        {
          src: '/ukon/turmeric-bowl.jpg',
          title: 'Cúrcuma pura em pó',
          desc: '100% natural, sem aditivos',
        },
        {
          src: '/ukon/mehdi-enagic-kangen-foods-okinawa.jpg',
          title: 'Fazenda Enagic Kangen Foods',
          desc: 'Mehdi Cohen na fábrica de Okinawa',
        },
      ],
    },
    supplement: {
      eyebrow: 'NOVO NO UKON?',
      headline: 'Comece pelo suplemento.',
      sub: 'A cápsula vegetal patenteada: curcumina concentrada, Água Kangen® e óleo essencial de cúrcuma 100% puro em uma cápsula diária.',
      badge: 'Fórmula Principal · 100 Cápsulas',
      body1:
        'Por gerações, os agricultores de Okinawa reverenciam a cúrcuma silvestre para o equilíbrio e a vitalidade. Kangen Ukon® Sigma reúne Cúrcuma de Primavera (Haru Ukon) e Cúrcuma de Outono (Aki Ukon), cultivadas sem pesticidas sintéticos.',
      body2:
        'A cápsula patenteada da Enagic é produzida a partir de carragenina de algas marinhas. Essa cápsula hermética preserva os óleos essenciais contra a oxidação até o momento do consumo.',
      highlights: [
        { label: 'Origem Yanbaru, Okinawa', desc: 'Cultivado no solo subtropical preservado do norte de Okinawa' },
        { label: 'Sinergia de Duas Cúrcumas', desc: 'Combina cúrcuma de primavera e outono para máxima concentração botânica' },
        { label: 'Cápsula Vegetal Hermética', desc: 'Blísters individuais que protegem os óleos contra ar e luminosidade' },
        { label: 'Preparado com Água Kangen®', desc: 'Higienizado e processado com a tecnologia de ionização Enagic' },
      ],
      ctaLearn: 'Ver Formulação',
      ctaBuy: 'Comprar Ukon Sigma',
    },
    heritage: {
      eyebrow: 'OKINAWA, JAPÃO',
      headline: 'Enraizado em séculos de tradição.',
      sub: 'Nas colinas subtropicais de Yanbaru, o ar puro e a terra mineralizada sustentam o cultivo da cúrcuma há mais de quinhentos anos.',
      badge: '500 Anos de Legado Japonês',
      body1:
        'Na época do Reino de Ryukyu, os médicos reais prescreviam a cúrcuma local como tônico revigorante. Hoje, a Enagic mantém viva essa herança na zona azul de longevidade de Okinawa.',
      body2:
        'Sem agrotóxicos químicos, a planta absorve o sol do Pacífico e as águas puras das montanhas antes da colheita manual no ponto ideal de maturação.',
      quote:
        '“A tradição segue viva, o solo é puro e o padrão de manufatura japonês permanece impecável.”',
      stats: [
        { value: '500+', label: 'Anos de Tradição' },
        { value: '100%', label: 'Cultivado no Japão' },
        { value: '0', label: 'Aditivos Sintéticos' },
      ],
    },
    process: {
      eyebrow: 'DO CAMPO AO SEU DIA A DIA',
      headline: 'De Okinawa para a sua rotina diária.',
      sub: 'Um processo cuidadoso e transparente, do solo japonês até o seu hábito matinal de saúde.',
      steps: [
        {
          num: '01',
          title: 'CULTIVADO EM OKINAWA',
          desc: 'Cultivo natural no solo subtropical rico em minerais de Yanbaru.',
        },
        {
          num: '02',
          title: 'COLHEITA NO PONTO EXATO',
          desc: 'Seleção manual que preserva o ápice da curcumina e dos óleos aromáticos.',
        },
        {
          num: '03',
          title: 'LIMPO COM ÁGUA KANGEN®',
          desc: 'Lavado com Água Super Ácida (pH 2.5) e preparado com Água Super Kangen (pH 11.5).',
        },
        {
          num: '04',
          title: 'PRODUZIDO NO JAPÃO',
          desc: 'Encapsulado nas instalações certificadas da Enagic em Okinawa sob rigoroso controle de sala limpa.',
        },
        {
          num: '05',
          title: 'EMBALADO COMO KANGEN UKON®',
          desc: 'Selado hermeticamente em cápsulas vegetais para blindar os óleos contra oxidação.',
        },
      ],
    },
    waterConnection: {
      eyebrow: 'O DIFERENCIAL ENAGIC',
      headline: 'A água é parte fundamental do processo.',
      sub: 'Como a tecnologia de Água Kangen® purifica e valoriza cada cápsula produzida.',
      bridgeTag: 'Conexão Tecnológica Kangen Water®',
      cards: [
        {
          title: 'Água Super Ácida (pH 2.5)',
          tag: 'Higienização Natural',
          desc: 'Higieniza as raízes de cúrcuma sem utilizar qualquer bactericida químico ou solvente industrial.',
        },
        {
          title: 'Água Super Kangen (pH 11.5)',
          tag: 'Acondicionamento Botânico',
          desc: 'Acondiciona os tubérculos extraindo a vitalidade botânica em um meio aquoso cristalino.',
        },
        {
          title: 'Sinergia de Ionização',
          tag: 'Pureza da Cápsula',
          desc: 'A Água Kangen integra a etapa de encapsulamento, unindo engenharia e sabedoria tradicional.',
        },
      ],
    },
    family: {
      eyebrow: 'A FAMÍLIA UKON',
      headline: 'Três formas de viver o bem-estar de Okinawa.',
      sub: 'Conheça a linha completa: suplemento diário, chá reconfortante e sabonete artesanal.',
      items: [
        {
          id: 'ukon_sigma',
          title: 'Kangen Ukon® Sigma',
          category: 'Suplemento Principal',
          img: '/products/ukon/ukon-sigma-box.png',
          desc: 'O suplemento clássico da Enagic unindo cúrcuma de primavera e outono, curcumina e óleos essenciais.',
          features: ['100 Cápsulas Softgel', 'Feito em Okinawa, Japão', 'Cápsula Vegetal Patenteada'],
          hasPurchase: true,
        },
        {
          id: 'ukon_tea',
          title: 'Kangen Ukon® Tea',
          category: 'Chá Botânico Antioxidante',
          img: '/products/ukon/ukon-tea.png',
          desc: 'Chá puro e sem cafeína preparado com cúrcuma torrada de Yanbaru para uma infusão diária revigorante.',
          features: ['100% Cúrcuma de Okinawa', 'Naturalmente Sem Cafeína', 'Rico em Polifenóis'],
          hasPurchase: false,
        },
      ],
      learnMore: 'Saiba Mais',
      buyNow: 'Comprar Agora',
      askAvailability: 'Consultar Disponibilidade',
    },
    facility: {
      eyebrow: 'ENAGIC KANGEN FOODS',
      headline: 'Feito em Okinawa.',
      sub: 'Cada item é manufaturado na fábrica certificada da Enagic em Okinawa, Japão.',
      badge: 'Manufatura Certificada em Okinawa',
      points: [
        'Instalações exclusivas Enagic Kangen Foods em Okinawa',
        'Salas limpas sob estritas normas sanitárias japonesas',
        'A mesma tecnologia de Água Kangen® percorre a linha de produção',
        'Rastreabilidade integral da fazenda até a caixa final',
      ],
    },
    ritual: {
      eyebrow: 'RITUAL DE SAÚDE',
      headline: 'Simples para acompanhar seu dia.',
      sub: 'Um hábito matinal equilibrado, leve e fácil de praticar onde você estiver.',
      cards: [
        {
          title: '01. Hidratação Matinal',
          desc: 'Ingira suas cápsulas com um copo de Água Kangen® fresca (pH 8.5–9.5) para despertar seu organismo com leveza.',
        },
        {
          title: '02. Blísters Portáteis',
          desc: 'Cápsulas individuais fáceis de levar na bolsa, mala ou trabalho sem perigo de umidade.',
        },
        {
          title: '03. Praticidade Diária',
          desc: 'Três cápsulas suaves por dia garantem aporte de antioxidantes botânicos sem pós nem sujeira.',
        },
      ],
    },
    specs: {
      eyebrow: 'TRANSPARÊNCIA TOTAL',
      headline: 'Ficha Técnica do Kangen Ukon® Sigma.',
      sub: 'Especificações oficiais do produto.',
      rows: [
        { label: 'Produto', value: 'Kangen Ukon® Sigma Dietary Supplement' },
        { label: 'Fabricante', value: 'Enagic® (Fabricado em Okinawa, Japão)' },
        { label: 'Apresentação', value: '100 Cápsulas Softgel por Caixa (Blísters Individuais)' },
        { label: 'Porção Sugerida', value: '3 Cápsulas Diárias com Água' },
        { label: 'Plantas Principais', value: 'Cúrcuma de Primavera (Haru Ukon), Cúrcuma de Outono (Aki Ukon)' },
        { label: 'Nutrientes Ativos', value: 'Curcumina, Óleos Essenciais, Tocotrienóis, Vitaminas B, C, E, Niacina' },
        { label: 'Revestimento', value: 'Carragenina Vegetal de Algas Marinhas' },
        { label: 'Processamento de Água', value: 'Preparado com tecnologia de ionização Enagic® Kangen Water®' },
      ],
      notice:
        'Aviso de Suplemento: Este produto não se destina a diagnosticar, tratar, curar ou prevenir qualquer doença.',
    },
    video: {
      eyebrow: 'HISTÓRIA CINEMATOGRÁFICA',
      headline: 'Assista à história de Ukon.',
      sub: 'Veja as plantações de Yanbaru, a colheita tradicional e a fábrica da Enagic em Okinawa.',
      transcriptBtn: 'Ver Resumo do Vídeo',
      transcript: `A origem do Kangen Ukon® em Okinawa:
• Terras de Yanbaru: Cúrcuma orgânica cultivada sem agrotóxicos no norte de Okinawa.
• Colheita Manual: Colhido no auge da concentração de óleos aromáticos e curcumina.
• Tratamento com Água Kangen®: Lavagem em Água Super Ácida (pH 2.5) e Água Super Kangen (pH 11.5).
• Encapsulamento Vegetal: Selagem que blinda os princípios ativos contra ar e oxidação.`,
    },
    guide: {
      eyebrow: 'MATERIAL GRATUITO',
      headline: 'O Guia True Legacy do Kangen Ukon®',
      sub: 'Cinco séculos de tradição botânica de Okinawa, preparo com Água Kangen® e rotinas saudáveis.',
      bullets: [
        'A tradição de 500 anos da cúrcuma explicada de forma simples',
        'Como a Água Kangen® higieniza a colheita sem defensivos químicos',
        'Dicas práticas para usar o suplemento, chá e sabonete botânico',
      ],
      firstName: 'Nome',
      lastName: 'Sobrenome',
      email: 'E-mail',
      phone: 'WhatsApp / Telefone (Opcional)',
      country: 'País',
      submit: 'Enviar Meu Guia Gratuito',
      submitting: 'Preparando seu Guia...',
      success: 'Obrigado! Sua solicitação foi recebida. Seu distribuidor enviará o guia diretamente.',
      consent: 'Respeitamos sua privacidade. Seus dados são enviados unicamente ao seu distribuidor autorizado.',
    },
    ecosystem: {
      eyebrow: 'ECOSSISTEMA TRUE LEGACY',
      headline: 'Parte de um sistema integrado de bem-estar.',
      sub: 'A Enagic harmoniza a água enriquecida com hidrogênio, proteção eletromagnética e nutrição botânica japonesa.',
      kangenCard: {
        title: 'Ionizador Leveluk K8',
        desc: 'Tecnologia médica japonesa com 8 placas para água rica em hidrogênio molecular.',
        cta: 'Explorar Água Kangen®',
      },
      ukonCard: {
        title: 'Kangen Ukon® Sigma',
        desc: 'Cúrcuma de Okinawa em cápsulas vegetais tratadas com Água Kangen®.',
        cta: 'Você Está Aqui',
      },
    },
    faq: {
      eyebrow: 'PERGUNTAS FREQUENTES',
      headline: 'Tudo o que você precisa saber sobre o Ukon.',
      items: [
        {
          q: 'O que é o Kangen Ukon®?',
          a: 'Kangen Ukon® é a linha de produtos da Enagic baseada em cúrcuma silvestre de Okinawa, no Japão. O item principal é o Ukon Sigma em cápsulas softgel.',
        },
        {
          q: 'Onde é cultivado e produzido?',
          a: 'É cultivado em fazendas dedicadas em Yanbaru (norte de Okinawa) e embalado na fábrica certificada Enagic Kangen Foods em Okinawa.',
        },
        {
          q: 'Que tipo de cúrcuma é utilizada?',
          a: 'Combina a Cúrcuma de Primavera (Haru Ukon, rica em óleos aromáticos) e a Cúrcuma de Outono (Aki Ukon, rica em curcumina).',
        },
        {
          q: 'Qual é o papel da Água Kangen®?',
          a: 'As raízes são lavadas em Água Super Ácida (pH 2.5) sem químicos e preparadas em Água Super Kangen (pH 11.5) antes do encapsulamento.',
        },
        {
          q: 'Quantas cápsulas vêm e qual a porção diária?',
          a: 'Cada caixa contém 100 cápsulas em blísters herméticos. A porção indicada é de 3 cápsulas ao dia acompanhadas de água.',
        },
        {
          q: 'A cápsula contém gelatina animal?',
          a: 'Não. É feita com uma cápsula vegetal patenteada de carragenina (alga marinha) e óleo de arroz, livre de gelatina animal.',
        },
        {
          q: 'Quais outros produtos estão disponíveis?',
          a: 'Além do suplemento Ukon Sigma, a linha conta com chá de cúrcuma de Okinawa e sabonete botânico artesanal com mel.',
        },
        {
          q: 'Como posso fazer o pedido?',
          a: 'Você pode comprar online se o seu distribuidor tiver o link configurado (botão Comprar Agora) ou falar diretamente no WhatsApp.',
        },
        {
          q: 'Trata ou cura alguma condição médica?',
          a: 'Não. É um suplemento alimentar e não tem como objetivo diagnosticar, tratar, curar ou prevenir qualquer doença.',
        },
      ],
    },
    closing: {
      eyebrow: 'ORIENTAÇÃO DO SEU DISTRIBUIDOR',
      headline: 'Dúvidas sobre o Ukon?',
      sub: 'Converse diretamente com o seu distribuidor True Legacy sobre o Kangen Ukon® e pedidos oficiais.',
      verifiedBadge: 'Distribuidor True Legacy Verificado',
      independentTag: 'Distribuidor Independente Enagic®',
      buyNow: 'Comprar Agora',
      askOrdering: 'Consultar Pedido',
      whatsapp: 'WhatsApp',
      returnProfile: 'Voltar ao Perfil',
    },
  },
} as const

interface UkonLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

export function UkonLandingPage({ profile: propProfile, distributorSlug: propDistributorSlug }: UkonLandingPageProps) {
  const params = useParams<{ slug?: string; country?: string }>()
  const navigate = useNavigate()
  const activeSlug = propDistributorSlug || propProfile?.slug || params.slug || 'mehdi-cohen'
  const isLeaderPage = Boolean(activeSlug)

  const [profile, setProfile] = useState<PublicDistributor | null>(propProfile || null)
  const { locale, setLocale } = useLocaleContext()
  const currentLang = (['en', 'es', 'fr', 'pt'].includes(locale) ? locale : 'en') as 'en' | 'es' | 'fr' | 'pt'
  const content = LOCALES[currentLang]

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const [showIngredientsModal, setShowIngredientsModal] = useState(false)

  // Guide Lead Form
  const [guideFirstName, setGuideFirstName] = useState('')
  const [guideLastName, setGuideLastName] = useState('')
  const [guideEmail, setGuideEmail] = useState('')
  const [guidePhone, setGuidePhone] = useState('')
  const [guideCountry, setGuideCountry] = useState('United States')
  const [guideSubmitting, setGuideSubmitting] = useState(false)
  const [guideSuccess, setGuideSuccess] = useState(false)
  const [guideError, setGuideError] = useState('')

  // Load distributor profile
  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
      return
    }
    getPublicDistributors().then((distributors) => {
      const found =
        distributors.find((d) => d.slug.toLowerCase() === activeSlug.toLowerCase()) ||
        distributors.find((d) => d.slug === 'mehdi-cohen') ||
        distributors[0]
      if (found) setProfile(found)
    })
  }, [propProfile, activeSlug])

  // Purchase Link detection
  const ukonPurchaseUrl = useMemo(() => {
    return (
      getProductPurchaseLink(profile?.purchase_links, 'ukonPurchaseUrl') ||
      getProductPurchaseLink(profile?.purchase_links, 'ukon_sigma') ||
      getProductPurchaseLink(profile?.purchase_links, 'ukon') ||
      profile?.purchase_links?.ukonPurchaseUrl ||
      profile?.purchase_links?.ukon_sigma ||
      profile?.purchase_links?.ukon ||
      null
    )
  }, [profile?.purchase_links])

  const hasPurchaseLink = Boolean(ukonPurchaseUrl)

  // Distributor metadata & WhatsApp
  const distributorName = profile?.display_name || 'Mehdi Cohen'
  const distributorFirstName = distributorName.split(' ')[0]
  const distributorTitle = profile?.title || 'True Legacy Leader'
  const leaderAvatar =
    profile?.avatar_url ||
    (profile?.slug && getLeaderPortrait(profile.slug)) ||
    '/leaders/standardized/mehdi-cohen.png'
  const distributorProfileRoute = `/d/${profile?.slug || activeSlug}`

  const rawPhone = profile?.phone ? profile.phone.replace(/[^0-9]/g, '') : '14389947844'
  const whatsappNumber = rawPhone.length >= 7 ? rawPhone : null

  const whatsappInquiryMessage = useMemo(() => {
    return encodeURIComponent(
      `Hi ${distributorFirstName}, I'm reviewing your Kangen Ukon® page and would like more information on ordering and availability in my country.`
    )
  }, [distributorFirstName])

  const personalWhatsAppUrl = useMemo(() => {
    return `https://wa.me/${whatsappNumber}?text=${whatsappInquiryMessage}`
  }, [whatsappNumber, whatsappInquiryMessage])

  const handleActionClick = (actionName: string) => {
    trackEvent(`ukon_${actionName}`, {
      distributor: activeSlug,
      hasPurchaseLink,
      lang: currentLang,
    })
  }

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuideError('')

    if (!guideFirstName.trim()) {
      setGuideError('Please enter your first name.')
      return
    }
    if (!guideEmail.trim()) {
      setGuideError('Please provide a valid email address.')
      return
    }

    setGuideSubmitting(true)
    try {
      await submitCrmApplication({
        fullName: `${guideFirstName.trim()} ${guideLastName.trim()}`.trim(),
        email: guideEmail.trim().toLowerCase(),
        phone: guidePhone.trim(),
        country: guideCountry.trim(),
        interest: 'ukon',
        selectedDistributor: profile?.slug || activeSlug,
        hasReferrer: true,
        sourcePath: typeof window !== 'undefined' ? window.location.pathname : `/d/${activeSlug}/ukon`,
        consent: true,
        privacyVersion: '2026-09-ukon-guide',
        referredBy: profile?.display_name || 'True Legacy Leader',
      })
      setGuideSuccess(true)
      handleActionClick('guide_form_success')
    } catch {
      setGuideError('Unable to send guide request. Please try again or reach out on WhatsApp.')
    } finally {
      setGuideSubmitting(false)
    }
  }

  // Structured FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-[#f8f9fa] selection:bg-amber-500/30 selection:text-amber-200 font-sans relative antialiased overflow-x-hidden">
      <SEO
        title={`Kangen Ukon® | Okinawan Turmeric | ${profile?.display_name || 'True Legacy'}`}
        description="Discover Kangen Ukon®, premium Okinawan turmeric made in Japan and prepared using Kangen Water® as part of the production process."
        image={leaderAvatar || '/products/ukon/ukon-sigma-box.png'}
        canonical={`https://www.truelegacyworld.com/d/${activeSlug}/ukon`}
      />

      {/* JSON-LD FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── STICKY SLIM HEADER ── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070b12]/85 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Left: Back Button, True Legacy Logo, Ukon Badge & Back to Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={distributorProfileRoute}
              label={isLeaderPage ? `Back to ${distributorFirstName}'s Profile` : 'Go back'}
            />

            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-0.5 shrink-0"
            >
              <TrueLegacyLogo variant="nav" className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-[10px] font-semibold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
                Kangen Ukon®
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

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Symmetrical Uniform Language Selector */}
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  className={cn(
                    'w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[11px] uppercase transition-all duration-200 shrink-0',
                    currentLang === lang
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/10 font-bold'
                  )}
                  aria-label={`Switch language to ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              {hasPurchaseLink ? (
                <a
                  href={ukonPurchaseUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('header_buy_now')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{content.hero.buyNow}</span>
                </a>
              ) : (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('header_ask_ordering')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{content.hero.askOrdering}</span>
                </a>
              )}

              <a
                href="#ukon-video"
                onClick={() => handleActionClick('header_watch_story')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{content.hero.ctaSecondary}</span>
              </a>

              {whatsappNumber ? (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('header_whatsapp')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{content.hero.whatsappDistributor} {distributorFirstName}</span>
                </a>
              ) : (
                <Link
                  to={distributorProfileRoute}
                  onClick={() => handleActionClick('header_contact_distributor')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{content.hero.contactDistributor}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM STICKY ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/15 bg-[#070b12]/95 backdrop-blur-2xl px-3 py-2.5 shadow-2xl">
        <div className="grid grid-cols-3 gap-2">
          <a
            href="#ukon-video"
            onClick={() => handleActionClick('mobile_sticky_watch_story')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[11px] hover:bg-amber-500/25 transition-all text-center leading-tight"
          >
            <Play className="w-4 h-4 mb-1 text-amber-400 fill-amber-400/20" />
            <span>{content.hero.ctaSecondary}</span>
          </a>

          {whatsappNumber ? (
            <a
              href={personalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick('mobile_sticky_whatsapp')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] hover:bg-emerald-500/25 transition-all text-center leading-tight"
            >
              <MessageCircle className="w-4 h-4 mb-1 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <Link
              to={distributorProfileRoute}
              onClick={() => handleActionClick('mobile_sticky_profile')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] hover:bg-emerald-500/25 transition-all text-center leading-tight"
            >
              <Users className="w-4 h-4 mb-1 text-emerald-400" />
              <span>{distributorFirstName}</span>
            </Link>
          )}

          {hasPurchaseLink ? (
            <a
              href={ukonPurchaseUrl!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick('mobile_sticky_buy_now')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] shadow-lg shadow-amber-500/25 transition-all text-center leading-tight"
            >
              <ShoppingCart className="w-4 h-4 mb-1 fill-current" />
              <span>{content.hero.buyNow}</span>
            </a>
          ) : (
            <a
              href={personalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick('mobile_sticky_ask_ordering')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] shadow-lg shadow-amber-500/25 transition-all text-center leading-tight"
            >
              <ShoppingCart className="w-4 h-4 mb-1 fill-current" />
              <span>{content.hero.askOrdering}</span>
            </a>
          )}
        </div>
      </div>

      {/* ── HERO SECTION — FULL-BLEED CINEMATIC BACKGROUND ── */}
      <section
        className="relative overflow-hidden border-b border-white/10"
        style={{ minHeight: 'clamp(620px, 58vw, 840px)' }}
      >
        {/* Full-bleed background image */}
        <div
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
          style={{
            backgroundImage: "url('/true-legacy-assets/ukon-cinematic-hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center right',
          }}
        />

        {/* Editorial left gradient for razor-sharp typography */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to right, rgba(7,11,18,0.92) 0%, rgba(7,11,18,0.80) 35%, rgba(7,11,18,0.35) 65%, rgba(7,11,18,0.05) 85%)',
          }}
        />

        {/* Top/bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, rgba(7,11,18,0.5) 0%, transparent 20%, transparent 80%, rgba(7,11,18,0.7) 100%)',
          }}
        />

        {/* Hero Content Container */}
        <div className="relative z-10 h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 'inherit' }}>
          <div className="grid w-full lg:grid-cols-12 gap-8 items-center py-12 md:py-16">
            {/* Left Editorial Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-7 xl:col-span-7 space-y-5 max-w-xl"
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-sm px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{content.hero.eyebrow}</span>
              </div>

              {/* Headline — 2-line editorial treatment */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                {content.hero.headline_1}
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  {content.hero.headline_2}
                </span>
              </h1>

              {/* Supporting copy */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                {content.hero.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#supplement"
                  onClick={() => handleActionClick('hero_explore_ukon')}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-amber-500/25"
                >
                  <span>{content.hero.ctaPrimary}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                {hasPurchaseLink ? (
                  <a
                    href={ukonPurchaseUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('hero_buy_now')}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-black px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span>{content.hero.buyNow}</span>
                  </a>
                ) : (
                  <a
                    href={personalWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('hero_ask_ordering')}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-black px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span>{content.hero.askOrdering}</span>
                  </a>
                )}

                <a
                  href="#ukon-video"
                  onClick={() => handleActionClick('hero_watch_story')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold px-4 py-3 text-sm transition-all duration-200"
                >
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>{content.hero.ctaSecondary}</span>
                </a>

                {whatsappNumber && (
                  <a
                    href={personalWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('hero_whatsapp')}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp {distributorFirstName}</span>
                  </a>
                )}
              </div>

              {/* Distributor Attribution Badge */}
              {profile && (
                <div className="pt-2">
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md p-2 pr-4 shadow-xl">
                    <img
                      src={leaderAvatar}
                      alt={distributorName}
                      className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {content.hero.distributorTag}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">{distributorName}</p>
                      <p className="text-[10px] text-slate-400">{distributorTitle}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Product Placement Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end relative"
            >
              <div className="relative max-w-sm sm:max-w-md w-full">
                {/* Turmeric ambient aura */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-transparent blur-3xl pointer-events-none" />

                {/* Box Floating Showcase */}
                <div className="relative z-10 flex flex-col items-center">
                  <img
                    src="/products/ukon/ukon-sigma-box.png"
                    alt="Kangen Ukon Sigma Dietary Supplement Box"
                    className="w-full max-w-[460px] h-auto object-contain drop-shadow-[0_25px_50px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform duration-500"
                  />
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/60 backdrop-blur-md px-3.5 py-1 text-xs text-amber-200 shadow-lg">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold">Patented Seaweed Softgel · 100 Capsules</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HERO TRUST STRIP ── */}
      <section className="border-b border-white/10 bg-[#090e17] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>MADE IN JAPAN</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-300">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>OKINAWAN TURMERIC</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-300">
              <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>KANGEN WATER® PROCESSED</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100 CAPSULES PER BOX</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION (MOVED BELOW HERO) ── */}
      <section id="ukon-video" className="py-16 md:py-24 border-b border-white/10 bg-[#070b12]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{content.video.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {content.video.headline}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {content.video.sub}
            </p>
          </div>

          {/* YouTube Video Player Container */}
          <div className="relative rounded-3xl border border-amber-500/30 bg-black/60 p-2 sm:p-3 shadow-2xl shadow-amber-950/40 overflow-hidden mb-6">
            <YouTubeEmbed
              url="https://www.youtube.com/watch?v=0d_RcSmf2XI"
              title="Kangen Ukon® — The Story of Okinawan Turmeric"
              className="rounded-2xl"
            />
          </div>

          {/* Transcript Accordion */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between text-xs font-bold text-slate-300 hover:bg-white/5 transition-all"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                {content.video.transcriptBtn}
              </span>
              <ChevronDown
                className={cn('w-4 h-4 transition-transform duration-200', showTranscript ? 'rotate-180 text-amber-400' : '')}
              />
            </button>

            {showTranscript && (
              <div className="mt-2 rounded-2xl border border-white/10 bg-black/60 p-5 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {content.video.transcript}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── VISUAL JOURNEY: FROM OKINAWAN EARTH TO A MODERN RITUAL ── */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#060911] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.journey.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {content.journey.headline}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              {content.journey.sub}
            </p>
          </div>

          {/* 8-Photo Uniform Grid: All identical size, aspect ratio, and framing */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
            {content.journey.items.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left">
                  <p className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-amber-300/90 font-medium line-clamp-1 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: START WITH THE SUPPLEMENT ── */}
      <section id="supplement" className="py-20 md:py-28 border-b border-white/10 bg-[#070b12] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Official Box Product Focus */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-lg w-full rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.06] via-transparent to-black/60 p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
                <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-4">
                  {content.supplement.badge}
                </span>
                <img
                  src="/products/ukon/ukon-sigma-supplement-showcase.png"
                  alt="Kangen Ukon Sigma Box with Okinawan Turmeric Root"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(245,158,11,0.25)] mx-auto hover:scale-105 transition-transform duration-300"
                />
                <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Enagic® International</span>
                  <span className="text-amber-400 font-bold">100 Capsules</span>
                </div>
              </div>
            </div>

            {/* Right: Detailed Supplement Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Sun className="w-3.5 h-3.5" />
                <span>{content.supplement.eyebrow}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {content.supplement.headline}
              </h2>

              <p className="text-lg font-semibold text-amber-200/90 leading-snug">
                {content.supplement.sub}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {content.supplement.body1}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {content.supplement.body2}
              </p>

              {/* Highlights Grid */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {content.supplement.highlights.map((h, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-1">
                    <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {h.label}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {hasPurchaseLink ? (
                  <a
                    href={ukonPurchaseUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('supplement_buy_now')}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-amber-500/25"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{content.supplement.ctaBuy}</span>
                  </a>
                ) : (
                  <a
                    href={personalWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('supplement_ask_ordering')}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-amber-500/25"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{content.hero.askOrdering}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setShowIngredientsModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold px-5 py-3.5 text-sm transition-all"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{content.supplement.ctaLearn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: OKINAWAN HERITAGE STORY ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#090d16] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Leaf className="w-3.5 h-3.5" />
                <span>{content.heritage.eyebrow}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
                {content.heritage.headline}
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {content.heritage.sub}
              </p>

              <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>{content.heritage.body1}</p>
                <p>{content.heritage.body2}</p>
              </div>

              {/* Quote callout */}
              <div className="rounded-2xl border-l-4 border-amber-400 bg-white/[0.03] p-4 text-xs sm:text-sm text-amber-200 italic">
                {content.heritage.quote}
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                {content.heritage.stats.map((st, i) => (
                  <div key={i}>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">{st.value}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Landscape Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src="/true-legacy-assets/ukon-okinawa-heritage.jpg"
                  alt="Yanbaru Okinawa Turmeric Terraces Japan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white mb-2">
                    Yanbaru, Northern Okinawa
                  </span>
                  <p className="text-xs text-slate-300">
                    Pristine subtropical microclimate with mineral-dense volcanic soil, ocean mist, and clean rain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FROM ROOT TO PRODUCT (PROCESS SECTION) ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#070b12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Layers className="w-3.5 h-3.5" />
              <span>{content.process.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {content.process.headline}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {content.process.sub}
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 relative">
            {content.process.steps.map((st, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 sm:p-6 space-y-3 hover:border-amber-400/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 font-black text-sm">
                  {st.num}
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: KANGEN WATER CONNECTION (BLUE ACCENT BRIDGE) ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-gradient-to-b from-[#071322] via-[#070e1a] to-[#070b12] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>{content.waterConnection.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {content.waterConnection.headline}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {content.waterConnection.sub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {content.waterConnection.cards.map((wc, i) => (
              <div
                key={i}
                className="rounded-3xl border border-cyan-500/25 bg-black/40 backdrop-blur-md p-6 sm:p-8 space-y-4 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all shadow-xl"
              >
                <div className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  {wc.tag}
                </div>
                <h3 className="text-xl font-black text-white">{wc.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{wc.desc}</p>
              </div>
            ))}
          </div>

          {/* Cross-Link to Kangen Water */}
          <div className="mt-12 text-center">
            <Link
              to={`/d/${activeSlug}/kangen`}
              onClick={() => handleActionClick('water_connection_explore_kangen')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <span>Explore Enagic® Kangen Water® Ionization Technology</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: THE UKON FAMILY (3-PRODUCT SHOWCASE) ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#070b12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.family.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {content.family.headline}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {content.family.sub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.family.items.map((prod) => (
              <div
                key={prod.id}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 flex flex-col justify-between hover:border-amber-400/40 transition-all group shadow-xl"
              >
                <div>
                  <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 mb-4">
                    {prod.category}
                  </span>

                  <div className="relative h-56 flex items-center justify-center my-4 overflow-hidden">
                    <img
                      src={prod.img}
                      alt={prod.title}
                      className="max-h-52 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-xl font-black text-white mt-4">{prod.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">{prod.desc}</p>

                  <div className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                    {prod.features.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10">
                  {prod.hasPurchase && hasPurchaseLink ? (
                    <a
                      href={ukonPurchaseUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick(`family_buy_${prod.id}`)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 text-xs shadow-md shadow-amber-500/20 transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{content.family.buyNow}</span>
                    </a>
                  ) : (
                    <a
                      href={personalWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick(`family_ask_${prod.id}`)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-bold py-3 text-xs transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{prod.hasPurchase ? content.hero.askOrdering : content.family.askAvailability}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: MADE IN OKINAWA (FACILITY & QUALITY) ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#090d16]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.08] via-transparent to-black/60 p-8 sm:p-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
                  <Award className="w-3.5 h-3.5" />
                  <span>{content.facility.eyebrow}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {content.facility.headline}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {content.facility.sub}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-4">
                  {content.facility.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/10 bg-black/40">
                <ShieldCheck className="w-12 h-12 text-amber-400 mb-3" />
                <p className="text-sm font-black text-white uppercase tracking-wider">
                  Enagic® Okinawan Facility
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Every product undergoes stringent Japanese cleanroom validation before being cleared for global shipping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 11: DAILY RITUAL SECTION ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#070b12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Lifestyle Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/true-legacy-assets/ukon-daily-ritual.jpg"
                  alt="Daily Wellness Ritual with Kangen Ukon and Water"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Morning Wellness Ritual
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Fresh Kangen Water® + Kangen Ukon® Sigma softgels on natural stone slate.
                  </p>
                </div>
              </div>
            </div>

            {/* Ritual Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Sun className="w-3.5 h-3.5" />
                <span>{content.ritual.eyebrow}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {content.ritual.headline}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {content.ritual.sub}
              </p>

              <div className="space-y-4 pt-2">
                {content.ritual.cards.map((rc, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-1.5">
                    <p className="text-sm font-bold text-amber-300">{rc.title}</p>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{rc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 12: PRODUCT DETAILS & SUPPLEMENT FACTS ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#090d16]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Info className="w-3.5 h-3.5" />
              <span>{content.specs.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {content.specs.headline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {content.specs.sub}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl">
            <div className="divide-y divide-white/10">
              {content.specs.rows.map((r, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">{r.label}</span>
                  <span className="sm:col-span-2 text-white font-medium mt-1 sm:mt-0">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-[11px] text-center text-slate-500 leading-relaxed">
            {content.specs.notice}
          </p>
        </div>
      </section>

      {/* (Video section moved above — right after hero trust strip) */}

      {/* ── SECTION 16: FREE GUIDE / LEAD CAPTURE ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#090d16]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.08] via-black/40 to-black p-8 sm:p-12 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
                <FileText className="w-3.5 h-3.5" />
                <span>{content.guide.eyebrow}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {content.guide.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {content.guide.sub}
              </p>
            </div>

            {/* Bullets */}
            <div className="space-y-2 mb-8 max-w-xl mx-auto">
              {content.guide.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Form or Success message */}
            {guideSuccess ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-3 animate-in fade-in-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Guide Request Received</h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto leading-relaxed">
                  {content.guide.success}
                </p>
              </div>
            ) : (
              <form onSubmit={handleGuideSubmit} className="space-y-4 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {content.guide.firstName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={guideFirstName}
                      onChange={(e) => setGuideFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {content.guide.lastName}
                    </label>
                    <input
                      type="text"
                      value={guideLastName}
                      onChange={(e) => setGuideLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {content.guide.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={guideEmail}
                      onChange={(e) => setGuideEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {content.guide.phone}
                    </label>
                    <input
                      type="tel"
                      value={guidePhone}
                      onChange={(e) => setGuidePhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {content.guide.country}
                  </label>
                  <input
                    type="text"
                    value={guideCountry}
                    onChange={(e) => setGuideCountry(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {guideError && (
                  <p className="text-xs text-rose-400 font-medium">{guideError}</p>
                )}

                <button
                  type="submit"
                  disabled={guideSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{guideSubmitting ? content.guide.submitting : content.guide.submit}</span>
                </button>

                <p className="text-[10px] text-center text-slate-500">{content.guide.consent}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 17: TRUE LEGACY ECOSYSTEM ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#070b12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.ecosystem.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {content.ecosystem.headline}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {content.ecosystem.sub}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Kangen Water Card */}
            <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-black p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="inline-block rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  Ionization Technology
                </span>
                <h3 className="text-2xl font-black text-white">{content.ecosystem.kangenCard.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{content.ecosystem.kangenCard.desc}</p>
              </div>
              <Link
                to={`/d/${activeSlug}/kangen`}
                onClick={() => handleActionClick('ecosystem_explore_kangen')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-5 text-xs shadow-md shadow-cyan-500/25 transition-all"
              >
                <span>{content.ecosystem.kangenCard.cta}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Ukon Card */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-black p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Botanical Nutrition
                </span>
                <h3 className="text-2xl font-black text-white">{content.ecosystem.ukonCard.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{content.ecosystem.ukonCard.desc}</p>
              </div>
              <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300 font-bold py-3 px-5 text-xs">
                <span>{content.ecosystem.ukonCard.cta}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 18: FAQ ACCORDION ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#090d16]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{content.faq.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {content.faq.headline}
            </h2>
          </div>

          <div className="space-y-3">
            {content.faq.items.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">{item.q}</span>
                    <ChevronDown
                      className={cn('w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200', isOpen ? 'rotate-180' : '')}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 19: FINAL DISTRIBUTOR CTA ── */}
      <section className="py-20 md:py-28 border-b border-white/10 bg-[#070b12] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{content.closing.eyebrow}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {content.closing.headline}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4 leading-relaxed">
            {content.closing.sub}
          </p>

          {/* Distributor Card */}
          <div className="mt-10 max-w-md mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
            <img
              src={leaderAvatar}
              alt={distributorName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{content.closing.verifiedBadge}</span>
              </div>
              <h3 className="text-xl font-black text-white">{distributorName}</h3>
              <p className="text-xs text-amber-400 font-medium">{distributorTitle}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{content.closing.independentTag}</p>
            </div>

            <div className="w-full space-y-2 pt-2">
              {hasPurchaseLink ? (
                <a
                  href={ukonPurchaseUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('closing_buy_now')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 text-xs shadow-lg shadow-amber-500/25 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{content.closing.buyNow}</span>
                </a>
              ) : (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('closing_ask_ordering')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 text-xs shadow-lg shadow-amber-500/25 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{content.closing.askOrdering}</span>
                </a>
              )}

              {whatsappNumber && (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('closing_whatsapp')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold py-3.5 text-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{content.closing.whatsapp} {distributorFirstName}</span>
                </a>
              )}

              <Link
                to={distributorProfileRoute}
                className="inline-block text-[11px] text-slate-400 hover:text-white pt-2 transition-colors"
              >
                {content.closing.returnProfile}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── INGREDIENTS MODAL ── */}
      <AnimatePresence>
        {showIngredientsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#090d16] p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-black text-white">Supplement Facts & Formulation</h3>
                <button
                  type="button"
                  onClick={() => setShowIngredientsModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase p-1 cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>Active Botanical Blend:</strong> Wild Spring Turmeric (Haru Ukon) extract, Autumn Turmeric (Aki Ukon) powder, Curcumin, Turmeric Essential Oils.
                </p>
                <p>
                  <strong>Nutrient Fortification:</strong> Tocotrienols, Olive Oil, Flaxseed Oil, Evening Primrose Oil, Vitamin E, Vitamin C, Vitamin B1, B2, B6, B12, Niacin, Folic Acid.
                </p>
                <p>
                  <strong>Softgel Matrix:</strong> Plant-derived Carrageenan (Seaweed Extract), Glycerin, Rice Bran Oil, Beeswax.
                </p>
                <p>
                  <strong>Preparation:</strong> Cleaned and prepared using Enagic® Kangen Water® technology in Okinawa, Japan.
                </p>
                <div className="rounded-xl bg-white/5 p-3 text-[11px] text-slate-400 italic">
                  Notice: Sold strictly as a dietary supplement. Not intended to diagnose, treat, cure, or prevent any disease.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIngredientsModal(false)}
                className="w-full rounded-xl bg-amber-400 text-slate-950 font-bold py-2.5 text-xs mt-4 cursor-pointer"
              >
                Close Formulation Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  )
}
