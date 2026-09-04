import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  BatteryCharging,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Globe2,
  HeartPulse,
  Laptop,
  MessageCircle,
  Microscope,
  Play,
  PlayCircle,
  Radio,
  Send,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users,
  Zap,
  Car,
  Plane,
  Home as HomeIcon,
  Layers,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { useLocaleContext, type Locale } from '@/contexts/LocaleContext'
import { PRODUCT_VIDEOS } from '@/lib/productVideos'
import { getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'
import { getProductPurchaseLink } from '@/config/productPurchaseLinks'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface EmguardeLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

function toEmbedUrl(url: string) {
  if (!url) return ''
  if (url.includes('youtu.be/')) {
    const after = url.split('youtu.be/')[1] || ''
    const id = after.split(/[?&]/)[0]
    return `https://www.youtube.com/embed/${id}?rel=0`
  }
  if (url.includes('youtube.com/watch')) {
    try {
      const u = new URL(url)
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : url
    } catch {
      return url
    }
  }
  return url
}

interface FeaturePillar {
  icon: typeof Smartphone
  title: string
  subtitle: string
  desc: string
  tag: string
  stat: string
  statLabel: string
}

interface ClinicalStudy {
  metric: string
  change: string
  title: string
  subtitle: string
  desc: string
  icon: typeof HeartPulse
  color: string
}

interface FaqItem {
  q: string
  a: string
}

interface LifestyleEnvironment {
  icon: typeof HomeIcon
  tag: string
  title: string
  desc: string
}

// ── COMPREHENSIVE LOCALIZATION DICTIONARY ──────────────────────────
const I18N: Record<
  Locale,
  {
    nav: {
      badge: string
      backToProfile: string
      back: string
      leader: string
      watchDemo: string
      buyNow: string
      whatsapp: string
      contactDistributor: string
      getPricing: string
    }
    hero: {
      eyebrow: string
      title1: string
      titleAccent: string
      title2: string
      sub: string
      ctaDemo: string
      ctaBuy: string
      claims: string[]
      presentedBy: string
      distributorTag: string
    }
    trustStrip: {
      patent: { title: string; desc: string }
      coverage: { title: string; desc: string }
      signal: { title: string; desc: string }
      trials: { title: string; desc: string }
    }
    whatIs: {
      eyebrow: string
      heading: string
      sub: string
      paragraph1: string
      paragraph2: string
      bullets: string[]
      badge: string
      caption: string
    }
    environmentShift: {
      eyebrow: string
      heading: string
      sub: string
      cards: {
        tag: string
        title: string
        desc: string
      }[]
    }
    techStory: {
      eyebrow: string
      heading: string
      sub: string
      patentNumber: string
      patentBadge: string
      mechanismHeading: string
      mechanismBody: string
      specsList: { label: string; value: string }[]
      complianceNotice: string
    }
    pillarsBadge: string
    pillarsTitle: string
    pillarsSubtitle: string
    pillars: FeaturePillar[]
    environments: {
      eyebrow: string
      heading: string
      sub: string
      items: LifestyleEnvironment[]
    }
    clinicalBadge: string
    clinicalTitle: string
    clinicalSubtitle: string
    clinicalStudies: ClinicalStudy[]
    specsBadge: string
    specTitle: string
    specSubtitle: string
    specs: { label: string; value: string }[]
    demoBadge: string
    demoTitle: string
    demoSubtitle: string
    watchTime: string
    duoBadge: string
    duoTitle1: string
    duoTitle2: string
    duoBody: string
    duoExploreBtn: string
    duoPricingBtn: string
    faqEyebrow: string
    faqTitle: string
    faqSubtitle: string
    faqs: FaqItem[]
    guidance: {
      eyebrow: string
      heading: string
      sub: string
      badge: string
      chatAction: string
      consultationAction: string
    }
    finalCta: {
      heading: string
      sub: string
      primary: string
      secondaryWhatsapp: string
      secondaryPricing: string
      redirectNotice: string
    }
    legal: {
      compliance: string
      distributor: string
      disclaimer: string
    }
  }
> = {
  en: {
    nav: {
      badge: 'emGuarde®',
      backToProfile: 'Back to Profile',
      back: 'Back',
      leader: 'Leader:',
      watchDemo: 'Watch Demo',
      buyNow: 'Buy Now',
      whatsapp: 'WhatsApp',
      contactDistributor: 'Contact Distributor',
      getPricing: 'Get Pricing',
    },
    hero: {
      eyebrow: 'PATENTED HARMONIC TECHNOLOGY · US-12539416',
      title1: 'Protect Your Biology.',
      titleAccent: 'Harmonize',
      title2: 'Your Environment.',
      sub: 'Your close-body personal protection device designed for continuous bodily balance in high electrosmog environments. Clinically evaluated, universally portable, and 100% wireless-signal transparent.',
      ctaDemo: 'Watch the Demonstration',
      ctaBuy: 'Buy emGuarde Now',
      claims: [
        'US Patent US-12539416 Harmonic Technology',
        '3-Meter (10ft) 360° Spherical Protective Zone',
        '0% Wireless Signal Blocking (Wi-Fi & 5G Safe)',
        'UTAR Human Clinical Trials (72h Biological Impact)',
      ],
      presentedBy: 'True Legacy Product Guidance',
      distributorTag: 'Independent Enagic Distributors',
    },
    trustStrip: {
      patent: { title: 'US Patent US-12539416', desc: 'Patented harmonic resonance circuit' },
      coverage: { title: '3m (10ft) Radius', desc: '360° continuous protective envelope' },
      signal: { title: '100% Signal Safe', desc: 'Wi-Fi, Bluetooth & phone signals unaffected' },
      trials: { title: 'UTAR Human Trials', desc: 'Peer-reviewed 72-hour clinical response' },
    },
    whatIs: {
      eyebrow: 'THE ARCHITECTURE OF BALANCE',
      heading: 'What is the Enagic emGuarde™?',
      sub: 'A precision-engineered electronic device that harmonizes ambient electromagnetic frequencies without blocking the wireless networks you rely on daily.',
      paragraph1:
        'Modern living immerses us in an unprecedented blanket of electromagnetic frequencies from mobile phones, 5G towers, Wi-Fi 6 routers, and high-frequency digital equipment. While essential for modern communication, this constant electromagnetic exposure creates high-frequency noise that interacts with human cellular physiology.',
      paragraph2:
        'The Enagic emGuarde™ is an ultra-portable harmonic suppressor developed through over a decade of frequency research. Powered by patented US technology, it suppresses targeted high-frequency electromagnetic noise within a 3-meter (10-foot) radius, supporting cellular equilibrium wherever your day takes you.',
      bullets: [
        'Formulates a stable 360° harmonic envelope around your body',
        'Zero interference with cell phone reception, laptops, or routers',
        'Lightweight, sleek graphite finish engineered for pocket or tabletop placement',
        'Rechargeable lithium battery providing up to 72 hours of silent operation',
      ],
      badge: 'Official Enagic Technology',
      caption: 'Shown: The Enagic emGuarde™ close-body personal protection device.',
    },
    environmentShift: {
      eyebrow: 'THE MODERN REALITY',
      heading: 'Why Our Environments Have Changed',
      sub: 'In just two decades, ambient high-frequency electrosmog density has multiplied exponentially across homes, offices, and vehicles.',
      cards: [
        {
          tag: 'SMART HOMES',
          title: 'Constant Domestic Immersion',
          desc: 'Modern residences now host dozens of connected smart devices, mesh Wi-Fi routers, smart meters, and Bluetooth appliances transmitting continuously 24/7.',
        },
        {
          tag: 'CONNECTED WORKSPACES',
          title: 'High-Density Electronic Hubs',
          desc: 'Commercial offices and co-working environments concentrate hundreds of active laptops, wireless monitors, and server relays within close quarters.',
        },
        {
          tag: 'IN-TRANSIT & COMMUTE',
          title: 'Enclosed Faraday Environments',
          desc: 'Modern electric vehicles, airplanes, and trains concentrate high electrical current and multi-band radio transceivers within reflective metal enclosures.',
        },
      ],
    },
    techStory: {
      eyebrow: 'SCIENTIFIC MECHANISM',
      heading: 'How the Technology is Designed to Work',
      sub: 'Targeted harmonic suppression rather than blunt brute-force signal blocking.',
      patentNumber: 'US-12539416',
      patentBadge: 'Patented US Resonance Technology',
      mechanismHeading: 'Harmonic Noise Suppression vs. Signal Blocking',
      mechanismBody:
        'Unlike primitive "EMF blockers" or Faraday shields that attempt to deflect radio waves (which forces phones to emit maximum power to connect), emGuarde employs a specialized micro-circuit that produces precise harmonic suppression frequencies. It targets and neutralizes ambient high-frequency noise spikes affecting biological tissue while allowing carrier communication waves (Wi-Fi, Bluetooth, 4G/5G) to pass through completely undisturbed.',
      specsList: [
        { label: 'Harmonic Radius', value: '3 Meters (approx. 10 ft) 360° Spherical' },
        { label: 'Technology Patent', value: 'US Patent No. US-12539416' },
        { label: 'Network Transparency', value: '100% Uninterrupted Wi-Fi & Cellular Speed' },
        { label: 'Operational Sound', value: '0 dB (Completely Silent Solid-State)' },
      ],
      complianceNotice:
        'emGuarde is engineered for environmental frequency harmonization and cellular well-being support. It does not claim to diagnose, treat, cure, or prevent any medical condition.',
    },
    pillarsBadge: 'ENGINEERED FOR MODERN LIFE',
    pillarsTitle: '5 Pillars of emGuarde™ Defense',
    pillarsSubtitle:
      'Engineered to accompany you seamlessly through high-density electromagnetic environments without lifestyle disruption.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Effortless Portability',
        subtitle: 'Everywhere You Go',
        desc: 'Ultra-compact close-body design that fits naturally into jacket pockets, laptop bags, car consoles, or nightstands.',
        tag: 'CLOSE-BODY MOBILITY',
        stat: 'Everywhere',
        statLabel: 'Pocket & Travel Ready',
      },
      {
        icon: Microscope,
        title: 'Clinically Evaluated',
        subtitle: 'University Human Trials (UTAR)',
        desc: 'Evaluated in human clinical research conducted by Universiti Tunku Abdul Rahman demonstrating measurable biological response within 72 hours.',
        tag: 'PEER-EVALUATED',
        stat: '3 Days',
        statLabel: 'Measurable Biological Impact',
      },
      {
        icon: ShieldCheck,
        title: '360° Spherical Envelope',
        subtitle: 'Generous 3-Meter Range',
        desc: 'Projects a consistent, stable harmonic envelope that blankets your personal workspace, vehicle cabin, or bedroom.',
        tag: 'CONTINUOUS ENVELOPE',
        stat: '360°',
        statLabel: '3-Meter Protective Radius',
      },
      {
        icon: Award,
        title: 'Patented US Circuitry',
        subtitle: 'US Patent US-12539416',
        desc: 'Proprietary harmonic resonance circuit engineered to harmonize electrosmog frequencies without degrading wireless communication.',
        tag: 'US-12539416',
        stat: 'Patented',
        statLabel: 'Harmonic Technology',
      },
      {
        icon: BatteryCharging,
        title: 'Up to 72 Hours',
        subtitle: 'Certified Lithium Battery',
        desc: 'High-density rechargeable battery provides multi-day silent defense on a single rapid USB-C charge.',
        tag: 'LONG-LASTING POWER',
        stat: 'Up to 72h',
        statLabel: 'Continuous Battery Life',
      },
    ],
    environments: {
      eyebrow: 'PRACTICAL INTEGRATION',
      heading: 'Real-Life Environments',
      sub: 'Engineered for how and where you live, work, and move every day.',
      items: [
        {
          icon: Laptop,
          tag: 'DESK & WORKSPACE',
          title: 'Office & Co-Working Hubs',
          desc: 'Place emGuarde beside your laptop to create a calm, focused personal bubble amidst dense office Wi-Fi and Bluetooth arrays.',
        },
        {
          icon: Car,
          tag: 'VEHICLE CONSOLE',
          title: 'In-Transit & Daily Commute',
          desc: 'Rests neatly in vehicle cup holders or console trays, mitigating concentrated automotive electrical and navigation fields.',
        },
        {
          icon: Plane,
          tag: 'LUGGAGE & FLIGHT',
          title: 'Travel & Hotel Stays',
          desc: 'TSA-compliant compact profile ready for carry-on luggage, airport terminals, and unfamiliar hotel Wi-Fi environments.',
        },
        {
          icon: HomeIcon,
          tag: 'BEDSIDE & HOME',
          title: 'Nightstand Restful Sanctuary',
          desc: 'Silent zero-emission operation beside your bed supports nocturnal cellular relaxation in connected smart homes.',
        },
      ],
    },
    clinicalBadge: 'UTAR UNIVERSITY CLINICAL RESEARCH',
    clinicalTitle: 'Human Clinical Trial Results (3 Days)',
    clinicalSubtitle:
      'Evaluated in university clinical research conducted by Universiti Tunku Abdul Rahman (UTAR). Demonstrating significant biological response within 72 hours.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'REDUCTION',
        title: 'Red Blood Cell Aggregation (Rouleaux Formation)',
        subtitle: 'Figure 2.1 Baseline vs. Figure 2.2 Post-intervention',
        desc: 'Statistically significant reduction in clumped red blood cells, promoting smoother microvascular blood flow and optimal cellular oxygen delivery.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'IMPROVEMENT',
        title: 'Alleviation of Subjective EHS Symptoms',
        subtitle: 'Electromagnetic Hypersensitivity Self-Assessment',
        desc: '70.3% of human trial participants reported noticeable symptom relief from fatigue, brain fog, and environmental electrosmog tension.',
        icon: Users,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'INCREASE',
        title: 'Elevation in Circulating Serotonin',
        subtitle: 'Neurotransmitter & Mood Regulation Marker',
        desc: 'Demonstrated a 59.5% increase in serotonin levels, directly supporting mood stability, deeper sleep latency, and balanced cognitive focus.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'REDUCTION',
        title: 'Heat Shock Protein (HSP-27) Reduction',
        subtitle: 'Cellular Stress & Strain Biomarker',
        desc: 'Measurable 42.5% decrease in HSP-27, a primary chaperone protein synthesized by cells in response to physiological strain and thermal electrosmog stress.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specsBadge: 'ENGINEERING & CERTIFICATIONS',
    specTitle: 'Device Specifications & Benchmarks',
    specSubtitle: 'Precision engineering manufactured to rigorous international quality and electromagnetic safety benchmarks.',
    specs: [
      { label: 'Technology Patent', value: 'US Patent No. US-12539416' },
      { label: 'Clinical Institution', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Effective Coverage', value: '3-Meter (approx. 10 ft) Radius (360° Spherical)' },
      { label: 'Battery Capacity', value: 'Up to 72 Hours Continuous Silent Protection' },
      { label: 'Charging Interface', value: 'Rapid USB-C Universal Fast Charging' },
      { label: 'Wireless Signal Impact', value: '0% Blocking / 100% Wi-Fi & Cellular Transparent' },
      { label: 'Global Distribution', value: 'Exclusively via Authorized Enagic Distribution Channels' },
    ],
    demoBadge: 'FEATURED VIDEO DEMONSTRATION',
    demoTitle: 'The Enagic emGuarde™ In-Depth Overview',
    demoSubtitle: 'Discover the scientific breakthrough, UTAR human clinical trials, and close-body frequency harmonization.',
    watchTime: 'Watch time: ~8 minutes',
    duoBadge: 'THE TRUE LEGACY DUO',
    duoTitle1: 'Two Technologies.',
    duoTitle2: 'One Connected Lifestyle.',
    duoBody:
      'True Legacy presents emGuarde and Kangen Water® as a unified duo education experience: external close-body environmental defense paired with internal cellular hydration and antioxidant wellness.',
    duoExploreBtn: 'Explore The True Legacy Duo',
    duoPricingBtn: 'Request Duo Consultation',
    faqEyebrow: 'CLEAR ANSWERS',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Clear, factual information regarding the Enagic emGuarde™ technology, operation, and ordering.',
    faqs: [
      {
        q: 'What is The Enagic emGuarde™ and what is it designed to do?',
        a: 'The Enagic emGuarde™ is a portable close-body electronic device designed to harmonize ambient high-frequency electromagnetic noise. Utilizing patented US technology (US-12539416), it generates a 3-meter spherical harmonic field that supports physiological equilibrium without blocking wireless communications.',
      },
      {
        q: 'Does emGuarde block or eliminate electromagnetic frequencies?',
        a: 'No, and by design. emGuarde does not block or shield radio frequencies—blocking signals would cause your phone and Wi-Fi to increase transmit power to break through. Instead, emGuarde suppresses specific high-frequency harmonic noise spikes that interact with human biology, leaving your Wi-Fi, 5G, and Bluetooth operating at full transmission speed.',
      },
      {
        q: 'What clinical research supports emGuarde?',
        a: 'emGuarde was evaluated in human clinical trials conducted by Universiti Tunku Abdul Rahman (UTAR). Results after 72 hours of exposure demonstrated a 50.7% reduction in red blood cell aggregation (Rouleaux formation), a 70.3% subjective improvement in EHS symptoms, a 59.5% increase in serotonin levels, and a 42.5% decrease in HSP-27 cellular stress proteins.',
      },
      {
        q: 'How large is the intended protective coverage area?',
        a: 'emGuarde creates a 3-meter (approximately 10-foot) radius spherical zone (360 degrees). This makes it ideal for your personal workspace, vehicle cabin, hotel suite, or beside your bed on a nightstand.',
      },
      {
        q: 'How long does the battery last and how do I recharge it?',
        a: 'The internal certified lithium-ion battery provides up to 72 hours of continuous operation on a single charge. It recharges easily using a standard USB-C cable connected to any phone charger, laptop port, or portable power bank.',
      },
      {
        q: 'How does emGuarde connect with Kangen Water in the True Legacy Duo?',
        a: 'True Legacy presents the technologies together as an integrated wellness philosophy: Leveluk K8 water ionization delivers internal cellular hydration and antioxidant support, while emGuarde provides external close-body frequency harmonization.',
      },
      {
        q: 'How do I order and is it available in my country?',
        a: 'emGuarde is distributed exclusively through authorized Enagic independent distributors and ships to over 150 countries. Exact pricing, regional import guidelines, and bundled packages vary by country. Click "Get Pricing" or connect directly with your distributor to receive verified details for your market.',
      },
    ],
    guidance: {
      eyebrow: 'DIRECT DISTRIBUTOR SUPPORT',
      heading: 'Personal Guidance on emGuarde™',
      sub: 'Connect directly with your True Legacy independent distributor for current market pricing, localized availability, and bundle recommendations.',
      badge: 'Dedicated Guidance',
      chatAction: 'Message on WhatsApp',
      consultationAction: 'Request Consultation',
    },
    finalCta: {
      heading: 'Ready to Experience emGuarde™ Harmonization?',
      sub: 'Receive current market pricing, delivery timelines, and direct support from your authorized True Legacy distributor.',
      primary: 'Get Pricing & Availability',
      secondaryWhatsapp: 'Chat on WhatsApp',
      secondaryPricing: 'Request Private Consultation',
      redirectNotice: 'Official purchase orders are fulfilled securely through Enagic corporate branch offices worldwide.',
    },
    legal: {
      compliance:
        'Compliance & Regulatory Notice: The Enagic emGuarde™ is an environmental electronic harmonization device. It does not block wireless frequencies, nor is it a medical device. It is not intended to diagnose, treat, cure, or prevent any disease. Clinical trial findings from Universiti Tunku Abdul Rahman (UTAR) represent observed physiological responses under trial parameters.',
      distributor:
        'Independent Distributor Disclosure: This landing page is independently administered by authorized True Legacy Enagic distributors and does not constitute the corporate website of Enagic Co., Ltd.',
      disclaimer: 'All trademarks, logos, and patents cited belong to their respective proprietary holders.',
    },
  },
  es: {
    nav: {
      badge: 'emGuarde®',
      backToProfile: 'Volver al Perfil',
      back: 'Atrás',
      leader: 'Líder:',
      watchDemo: 'Ver Demo',
      buyNow: 'Comprar',
      whatsapp: 'WhatsApp',
      contactDistributor: 'Contactar Distribuidor',
      getPricing: 'Ver Precios',
    },
    hero: {
      eyebrow: 'TECNOLOGÍA ARMÓNICA PATENTADA · US-12539416',
      title1: 'Protege Tu Biología.',
      titleAccent: 'Armoniza',
      title2: 'Tu Entorno.',
      sub: 'Dispositivo personal de protección cercana diseñado para favorecer el equilibrio biológico en entornos con alta densidad electromagnética. Clínicamente evaluado, ultraportátil y sin alterar tus redes inalámbricas.',
      ctaDemo: 'Ver Demostración',
      ctaBuy: 'Comprar emGuarde Ahora',
      claims: [
        'Patente en EE. UU. US-12539416',
        'Radio de Cobertura Esférica de 3 Metros',
        '0% de Bloqueo a Señales (Seguro con Wi-Fi y 5G)',
        'Ensayos Clínicos en Humanos UTAR (72 Horas)',
      ],
      presentedBy: 'Asesoría de Producto True Legacy',
      distributorTag: 'Distribuidores Independientes Enagic',
    },
    trustStrip: {
      patent: { title: 'Patente US-12539416', desc: 'Circuito de resonancia armónica' },
      coverage: { title: 'Radio de 3 Metros', desc: 'Campo protector esférico de 360°' },
      signal: { title: '100% Seguro con Redes', desc: 'Sin alterar Wi-Fi, Bluetooth ni celulares' },
      trials: { title: 'Ensayos UTAR (Humanos)', desc: 'Validación clínica en 72 horas' },
    },
    whatIs: {
      eyebrow: 'ARQUITECTURA DE EQUILIBRIO',
      heading: '¿Qué es el Enagic emGuarde™?',
      sub: 'Un dispositivo electrónico de precisión que armoniza el ruido electromagnético ambiental sin interferir en tus comunicaciones inalámbricas cotidianas.',
      paragraph1:
        'La vida moderna nos envuelve en una densidad de frecuencias electromagnéticas sin precedentes emitida por smartphones, torres 5G, routers Wi-Fi 6 y equipos digitales. Si bien son indispensables para comunicarnos, esta exposición continua genera ruido de alta frecuencia que interactúa con las células humanas.',
      paragraph2:
        'The Enagic emGuarde™ es un supresor armónico ultraportátil desarrollado tras más de una década de investigación. Basado en tecnología patentada en EE. UU., suprime el ruido electromagnético de alta frecuencia en un radio de 3 metros, favoreciendo el bienestar biológico dondequiera que estés.',
      bullets: [
        'Genera un campo armónico de 360° alrededor de tu cuerpo',
        'Cero interferencia con la cobertura de celulares o velocidad de Wi-Fi',
        'Diseño elegante en grafito para llevar en el bolsillo o colocar en tu escritorio',
        'Batería de litio recargable con hasta 72 horas de funcionamiento continuo',
      ],
      badge: 'Tecnología Oficial Enagic',
      caption: 'Dispositivo personal de protección cercana Enagic emGuarde™.',
    },
    environmentShift: {
      eyebrow: 'LA REALIDAD ACTUAL',
      heading: 'Por Qué Nuestros Entornos Han Cambiado',
      sub: 'En solo dos décadas, la densidad de radiación electromagnética ambiental se ha multiplicado exponencialmente en hogares, oficinas y transporte.',
      cards: [
        {
          tag: 'HOGARES CONECTADOS',
          title: 'Inmersión Doméstica Continua',
          desc: 'Las viviendas modernas concentran decenas de dispositivos inteligentes, routers de malla y electrodomésticos emitiendo señales 24/7.',
        },
        {
          tag: 'ESPACIOS DE TRABAJO',
          title: 'Alta Densidad Tecnológica',
          desc: 'Oficinas corporativas y espacios de coworking concentran cientos de portátiles, pantallas inalámbricas y servidores a corta distancia.',
        },
        {
          tag: 'TRANSPORTE Y VIAJES',
          title: 'Espacios Metálicos Cerrados',
          desc: 'Automóviles eléctricos, aviones y trenes concentran fuertes campos electromagnéticos y múltiples transmisores en espacios reducidos.',
        },
      ],
    },
    techStory: {
      eyebrow: 'MECANISMO CIENTÍFICO',
      heading: 'Cómo Está Diseñada Esta Tecnología',
      sub: 'Supresión armónica focalizada en lugar de bloqueos indiscriminados.',
      patentNumber: 'US-12539416',
      patentBadge: 'Tecnología de Resonancia Patentada en EE. UU.',
      mechanismHeading: 'Supresión de Ruido Armónico vs. Bloqueo de Señal',
      mechanismBody:
        'A diferencia de los bloqueadores rudimentarios que intentan desviar ondas de radio (lo cual obliga a los teléfonos a emitir con mayor potencia para conectarse), emGuarde emplea un microcircuito que genera frecuencias de resonancia armónica. Neutraliza el ruido electromagnético que afecta a los tejidos biológicos mientras deja pasar las ondas portadoras de comunicación (Wi-Fi, 4G, 5G, Bluetooth) con total normalidad.',
      specsList: [
        { label: 'Radio Armónico', value: '3 Metros (aprox. 10 pies) en 360°' },
        { label: 'Patente de Tecnología', value: 'Patente de EE. UU. US-12539416' },
        { label: 'Transparencia de Señal', value: '100% de Velocidad en Wi-Fi y Redes Móviles' },
        { label: 'Nivel Sonoro', value: '0 dB (Completamente Silencioso)' },
      ],
      complianceNotice:
        'emGuarde está diseñado para la armonización del entorno electromagnético. No tiene fines médicos ni afirma diagnosticar, tratar, curar o prevenir enfermedades.',
    },
    pillarsBadge: 'DISEÑADO PARA LA VIDA MODERNA',
    pillarsTitle: '5 Pilares de Defensa emGuarde™',
    pillarsSubtitle: 'Creado para acompañarte en entornos cotidianos sin alterar tu estilo de vida ni tus dispositivos.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Portabilidad Absoluta',
        subtitle: 'A Donde Quiera Que Vayas',
        desc: 'Diseño ultracompacto que cabe con facilidad en bolsillos, maletines, el coche o en tu mesa de noche.',
        tag: 'MOVILIDAD CERCANA',
        stat: 'Portátil',
        statLabel: 'Listo para Todo Momento',
      },
      {
        icon: Microscope,
        title: 'Evaluación Clínica',
        subtitle: 'Ensayos Universitarios (UTAR)',
        desc: 'Evaluado en ensayos clínicos en humanos por la Universiti Tunku Abdul Rahman, demostrando respuestas biológicas medibles en 72 horas.',
        tag: 'VALIDACIÓN MÉDICA',
        stat: '3 Días',
        statLabel: 'Impacto Biológico Medible',
      },
      {
        icon: ShieldCheck,
        title: 'Cobertura Esférica 360°',
        subtitle: 'Radio Generoso de 3 Metros',
        desc: 'Proyecta un campo armónico estable que cubre tu espacio de trabajo, el habitáculo del auto o tu habitación.',
        tag: 'CAMPO CONTINUO',
        stat: '360°',
        statLabel: 'Radio de 3 Metros',
      },
      {
        icon: Award,
        title: 'Circuito Patentado',
        subtitle: 'Patente EE. UU. US-12539416',
        desc: 'Circuito de resonancia armónica exclusivo diseñado para armonizar frecuencias sin degradar la conectividad.',
        tag: 'US-12539416',
        stat: 'Patentado',
        statLabel: 'Tecnología Armónica',
      },
      {
        icon: BatteryCharging,
        title: 'Hasta 72 Horas',
        subtitle: 'Batería de Litio Certificada',
        desc: 'Batería recargable de alta duración que brinda varios días de protección silenciosa con una sola carga USB-C.',
        tag: 'MÁXIMA AUTONOMÍA',
        stat: 'Hasta 72h',
        statLabel: 'Batería Continua',
      },
    ],
    environments: {
      eyebrow: 'INTEGRACIÓN PRÁCTICA',
      heading: 'Entornos de la Vida Real',
      sub: 'Diseñado para los lugares donde vives, trabajas y te trasladas diariamente.',
      items: [
        {
          icon: Laptop,
          tag: 'ESCRITORIO Y TRABAJO',
          title: 'Oficinas y Espacios de Trabajo',
          desc: 'Colócalo junto a tu laptop para crear un espacio de concentración armónico entre múltiples señales Wi-Fi y pantallas.',
        },
        {
          icon: Car,
          tag: 'CONSOLA DE VEHÍCULO',
          title: 'Trayectos y Conducción Diaria',
          desc: 'Se adapta perfectamente a portavasos o bandejas del coche, atenuando los campos eléctricos del tablero y navegación.',
        },
        {
          icon: Plane,
          tag: 'EQUIPAJE Y VIAJES',
          title: 'Vuelos y Estancias en Hoteles',
          desc: 'Aprobado para equipaje de mano; listo para terminales aéreas, trenes y redes Wi-Fi hoteleras.',
        },
        {
          icon: HomeIcon,
          tag: 'DORMITORIO Y HOGAR',
          title: 'Santuario de Descanso Nocturno',
          desc: 'Operación completamente silenciosa junto a tu cama, favoreciendo la relajación celular en hogares inteligentes.',
        },
      ],
    },
    clinicalBadge: 'INVESTIGACIÓN CLÍNICA UTAR',
    clinicalTitle: 'Resultados en Ensayos Clínicos en Humanos (3 Días)',
    clinicalSubtitle:
      'Evaluado en ensayos clínicos realizados por la Universiti Tunku Abdul Rahman (UTAR). Respuesta biológica demostrada en 72 horas.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'REDUCCIÓN',
        title: 'Aglomeración de Glóbulos Rojos (Formación Rouleaux)',
        subtitle: 'Figura 2.1 Antes de la prueba vs. Figura 2.2 Después',
        desc: 'Reducción estadísticamente significativa de glóbulos rojos apelmazados, promoviendo una circulación fluida y mejor transporte de oxígeno.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'MEJORÍA',
        title: 'Alivio de Síntomas Subjetivos de EHS',
        subtitle: 'Autoevaluación de Hipersensibilidad Electromagnética',
        desc: 'El 70.3% de los participantes reportó alivio notable de fatiga, pesadez mental y estrés por radiación ambiental.',
        icon: Users,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'AUMENTO',
        title: 'Elevación en Niveles de Serotonina',
        subtitle: 'Neurotransmisor Clave del Ánimo y el Sueño',
        desc: 'Incremento del 59.5% en serotonina, respaldando la estabilidad emocional, mejor descanso nocturno y rendimiento cognitivo.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'REDUCCIÓN',
        title: 'Reducción de Proteína de Estrés (HSP-27)',
        subtitle: 'Biomarcador Celular de Sobrecarga Fisiológica',
        desc: 'Disminución mensurable de 42.5% en HSP-27, proteína chaperona liberada ante sobrecargas celulares y estrés oxidativo ambiental.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specsBadge: 'INGENIERÍA Y CERTIFICACIONES',
    specTitle: 'Especificaciones Técnicas del Dispositivo',
    specSubtitle: 'Engeniería de precisión fabricada bajo rigurosos estándares internacionales de calidad y seguridad.',
    specs: [
      { label: 'Patente de Tecnología', value: 'Patente de EE. UU. No. US-12539416' },
      { label: 'Institución de Ensayos', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Radio de Cobertura', value: '3 Metros (aprox. 10 pies) en 360°' },
      { label: 'Duración de Batería', value: 'Hasta 72 Horas de Protección Silenciosa' },
      { label: 'Puerto de Carga', value: 'USB-C Universal de Carga Rápida' },
      { label: 'Interferencia en Señal', value: '0% Bloqueo / 100% Compatible con Wi-Fi y Móvil' },
      { label: 'Distribución Mundial', value: 'Exclusivamente por Distribuidores Oficiales Enagic' },
    ],
    demoBadge: 'DEMOSTRACIÓN EN VIDEO',
    demoTitle: 'Visión Detallada del Enagic emGuarde™',
    demoSubtitle: 'Descubre el avance científico, los ensayos clínicos en humanos de UTAR y la armonización de frecuencias.',
    watchTime: 'Duración del video: ~8 minutos',
    duoBadge: 'EL DUO TRUE LEGACY',
    duoTitle1: 'Dos Tecnologías.',
    duoTitle2: 'Un Estilo de Vida Conectado.',
    duoBody:
      'True Legacy presenta emGuarde y Kangen Water® como una experiencia integral de bienestar: defensa ambiental externa combinada con hidratación celular y soporte antioxidante interno.',
    duoExploreBtn: 'Explorar el True Legacy Duo',
    duoPricingBtn: 'Solicitar Consulta del Duo',
    faqEyebrow: 'RESPUESTAS CLARAS',
    faqTitle: 'Preguntas Frecuentes',
    faqSubtitle: 'Información comprobada sobre el funcionamiento, uso y adquisición de Enagic emGuarde™.',
    faqs: [
      {
        q: '¿Qué es Enagic emGuarde™ y qué función cumple?',
        a: 'The Enagic emGuarde™ es un dispositivo personal portátil diseñado para armonizar el ruido electromagnético de alta frecuencia. Con tecnología patentada en EE. UU. (US-12539416), genera un campo armónico esférico de 3 metros que apoya el equilibrio corporal sin cortar las señales inalámbricas.',
      },
      {
        q: '¿Bloquea o elimina las frecuencias electromagnéticas?',
        a: 'No, y por diseño. emGuarde no bloquea ni aísla las señales de radio: bloquear las ondas forzaría a tus teléfonos y routers a emitir con mayor potencia para conectarse. emGuarde suprime los picos de ruido armónico que interactúan con la biología humana, permitiendo que tu Wi-Fi, 5G y Bluetooth sigan funcionando a máxima velocidad.',
      },
      {
        q: '¿Qué ensayos clínicos respaldan al emGuarde?',
        a: 'Fue evaluado en ensayos clínicos con humanos por la Universiti Tunku Abdul Rahman (UTAR). Tras 72 horas, se constató una reducción del 50.7% en aglomeración de glóbulos rojos, un 70.3% de mejora subjetiva en síntomas de EHS, un 59.5% de incremento de serotonina y una caída del 42.5% en la proteína de estrés HSP-27.',
      },
      {
        q: '¿Cuál es el área de cobertura del dispositivo?',
        a: 'Genera un radio de 3 metros (aproximadamente 10 pies) en forma esférica (360 grados), haciéndolo perfecto para tu escritorio de trabajo, el habitáculo del coche, la habitación de hotel o tu mesita de noche.',
      },
      {
        q: '¿Cuánto dura la batería y cómo se recarga?',
        a: 'Su batería de litio certificada ofrece hasta 72 horas de funcionamiento continuo con una sola recarga. Se carga mediante cable USB-C estándar compatible con cualquier cargador de móvil o batería externa.',
      },
      {
        q: '¿Cómo se complementa con Kangen Water en el True Legacy Duo?',
        a: 'True Legacy promueve un bienestar integral en 360°: la ionización de agua Leveluk K8 brinda hidratación celular y defensa antioxidante interna, mientras que emGuarde aporta armonización de frecuencias ambiental en el entorno.',
      },
      {
        q: '¿Cómo puedo pedirlo y está disponible en mi país?',
        a: 'emGuarde se comercializa exclusivamente a través de distribuidores independientes autorizados de Enagic con envíos a más de 150 países. Precios e impuestos varían según el país. Haz clic en "Ver Precios" o habla con tu distribuidor para conocer las condiciones exactas en tu mercado.',
      },
    ],
    guidance: {
      eyebrow: 'ATENCIÓN DIRECTA DE TU DISTRIBUIDOR',
      heading: 'Asesoría Personalizada sobre emGuarde™',
      sub: 'Conéctate directamente con tu distribuidor independiente de True Legacy para conocer precios de tu mercado, disponibilidad local y paquetes recomendados.',
      badge: 'Orientación Directa',
      chatAction: 'Escribir por WhatsApp',
      consultationAction: 'Pedir Consulta',
    },
    finalCta: {
      heading: '¿Listo para Experimentar la Armonización emGuarde™?',
      sub: 'Obtén precios de tu país, tiempos de entrega y soporte directo de tu distribuidor autorizado de True Legacy.',
      primary: 'Consultar Precios y Disponibilidad',
      secondaryWhatsapp: 'Contactar por WhatsApp',
      secondaryPricing: 'Solicitar Asesoría Privada',
      redirectNotice: 'Los pedidos oficiales son procesados directamente por las oficinas corporativas de Enagic en todo el mundo.',
    },
    legal: {
      compliance:
        'Aviso de Cumplimiento: The Enagic emGuarde™ es un dispositivo electrónico de armonización ambiental. No bloquea frecuencias inalámbricas ni es un dispositivo médico. No está diseñado para diagnosticar, tratar, curar ni prevenir enfermedades. Los resultados de los ensayos de UTAR representan respuestas biológicas observadas bajo los parámetros de estudio.',
      distributor:
        'Aviso de Distribuidor Independiente: Esta página es administrada de manera independiente por distribuidores autorizados de True Legacy y no representa el sitio web corporativo de Enagic Co., Ltd.',
      disclaimer: 'Todas las marcas, logotipos y patentes pertenecen a sus respectivos titulares.',
    },
  },
  fr: {
    nav: {
      badge: 'emGuarde®',
      backToProfile: 'Retour au Profil',
      back: 'Retour',
      leader: 'Leader :',
      watchDemo: 'Voir la Démo',
      buyNow: 'Acheter',
      whatsapp: 'WhatsApp',
      contactDistributor: 'Contacter Distributeur',
      getPricing: 'Obtenir Tarifs',
    },
    hero: {
      eyebrow: 'TECHNOLOGIE HARMONIQUE BREVETÉE · US-12539416',
      title1: 'Protégez Votre Biologie.',
      titleAccent: 'Harmonisez',
      title2: 'Votre Environnement.',
      sub: 'Dispositif personnel de protection rapprochée conçu pour favoriser l’équilibre corporel dans les environnements à forte densité électromagnétique. Évalué cliniquement, ultra-portable et sans perturbation du signal sans fil.',
      ctaDemo: 'Voir la Démonstration',
      ctaBuy: 'Acheter emGuarde',
      claims: [
        'Brevet Américain US-12539416',
        'Rayon de Protection Sphérique de 3 Mètres',
        '0% de Blocage Réseau (Compatible Wi-Fi & 5G)',
        'Essais Cliniques Humains UTAR (72 Heures)',
      ],
      presentedBy: 'Conseil Produit True Legacy',
      distributorTag: 'Distributeurs Indépendants Enagic',
    },
    trustStrip: {
      patent: { title: 'Brevet US-12539416', desc: 'Circuit de résonance harmonique' },
      coverage: { title: 'Rayon de 3 Mètres', desc: 'Enveloppe protectrice sphérique à 360°' },
      signal: { title: '100% Transparent Réseau', desc: 'Wi-Fi, Bluetooth et mobiles inchangés' },
      trials: { title: 'Essais UTAR (Humains)', desc: 'Validation clinique en 72 heures' },
    },
    whatIs: {
      eyebrow: 'ARCHITECTURE D’ÉQUILIBRE',
      heading: 'Qu’est-ce que l’Enagic emGuarde™ ?',
      sub: 'Un dispositif électronique de haute précision qui harmonise les fréquences électromagnétiques ambiantes sans bloquer les réseaux sans fil dont vous dépendez chaque jour.',
      paragraph1:
        'La vie contemporaine nous plonge dans une densité inédite de fréquences électromagnétiques issues des smartphones, antennes 5G, box Wi-Fi 6 et appareils connectés. Bien qu’indispensables, ces rayonnements permanents génèrent un bruit haute fréquence qui interagit avec la physiologie cellulaire.',
      paragraph2:
        'L’Enagic emGuarde™ est un suppresseur harmonique ultra-portable issu de plus de dix ans de recherche. Grâce à sa technologie brevetée aux États-Unis, il neutralise le bruit électromagnétique sur un rayon de 3 mètres, soutenant ainsi l’équilibre corporel partout où vous allez.',
      bullets: [
        'Crée une enveloppe harmonique stable à 360° autour de vous',
        'Aucune baisse de débit Wi-Fi ni d’interférence téléphonique',
        'Finition graphite compacte pour la poche, le sac ou le bureau',
        'Batterie au lithium rechargeable offrant jusqu’à 72 heures d’autonomie',
      ],
      badge: 'Technologie Officielle Enagic',
      caption: 'Dispositif de protection personnelle rapprochée Enagic emGuarde™.',
    },
    environmentShift: {
      eyebrow: 'LE CONTEXTE ACTUEL',
      heading: 'Pourquoi Nos Environnements Ont Changé',
      sub: 'En deux décennies, la densité électromagnétique haute fréquence s’est multipliée de façon exponentielle au domicile, au travail et dans les transports.',
      cards: [
        {
          tag: 'MAISONS CONNECTÉES',
          title: 'Immersion Domestique Permanente',
          desc: 'Les foyers modernes cumulent des dizaines d’appareils connectés, répéteurs Wi-Fi et compteurs communicants émettant 24h/24.',
        },
        {
          tag: 'ESPACES DE TRAVAIL',
          title: 'Haute Densité Numérique',
          desc: 'Bureaux et espaces de coworking regroupent des centaines d’ordinateurs portables, écrans sans fil et serveurs à proximité immédiate.',
        },
        {
          tag: 'TRANSPORTS & DÉPLACEMENTS',
          title: 'Habitacles Métalliques Fermés',
          desc: 'Véhicules électriques, avions et trains concentrent d’importants courants électriques et émetteurs radio dans des espaces confinés.',
        },
      ],
    },
    techStory: {
      eyebrow: 'MÉCANISME SCIENTIFIQUE',
      heading: 'Comment Cette Technologie Fonctionne',
      sub: 'Une suppression harmonique ciblée plutôt qu’un blocage de signal contre-productif.',
      patentNumber: 'US-12539416',
      patentBadge: 'Technologie de Résonance Brevetée aux États-Unis',
      mechanismHeading: 'Suppression Harmonique vs Blocage de Signal',
      mechanismBody:
        'Contrairement aux bloqueurs rudimentaires qui tentent de dévier les ondes (ce qui pousse vos appareils à émettre à pleine puissance pour maintenir le contact), emGuarde utilise un micro-circuit de résonance harmonique. Il neutralise les pics de bruit électromagnétique affectant les tissus vivants tout en laissant passer les ondes de communication (Wi-Fi, 4G, 5G, Bluetooth) sans la moindre altération.',
      specsList: [
        { label: 'Rayon Harmonique', value: '3 Mètres (env. 10 pieds) à 360°' },
        { label: 'Brevet Technique', value: 'Brevet US n° US-12539416' },
        { label: 'Transparence Réseau', value: '100% de Débit Wi-Fi et Réseau Mobile' },
        { label: 'Niveau Sonore', value: '0 dB (Fonctionnement Totalement Silencieux)' },
      ],
      complianceNotice:
        'emGuarde est conçu pour l’harmonisation de l’environnement fréquentiel et le bien-être cellulaire. Il n’a aucune vocation médicale.',
    },
    pillarsBadge: 'CONÇU POUR LA VIE MODERNE',
    pillarsTitle: 'Les 5 Piliers de la Défense emGuarde™',
    pillarsSubtitle: 'Conçu pour vous accompagner naturellement au quotidien sans contrainte ni modification de vos habitudes.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Portabilité Sans Effort',
        subtitle: 'Partout Avec Vous',
        desc: 'Format ultra-compact se glissant naturellement dans une poche de veste, un sac ou sur votre table de chevet.',
        tag: 'MOBILITÉ RAPPROCHÉE',
        stat: 'Partout',
        statLabel: 'Prêt pour le Quotidien',
      },
      {
        icon: Microscope,
        title: 'Validation Clinique',
        subtitle: 'Essais Universitaires (UTAR)',
        desc: 'Évalué lors d’essais cliniques chez l’humain par l’Universiti Tunku Abdul Rahman, démontrant des bénéfices biologiques en 72 heures.',
        tag: 'VALIDATION CLINIQUE',
        stat: '3 Jours',
        statLabel: 'Impact Biologique Mesurable',
      },
      {
        icon: ShieldCheck,
        title: 'Enveloppe Sphérique 360°',
        subtitle: 'Rayon Confortable de 3 Mètres',
        desc: 'Projette une bulle d’harmonisation constante enveloppant votre bureau, votre véhicule ou votre espace de repos.',
        tag: 'BULLE CONSTANTE',
        stat: '360°',
        statLabel: 'Rayon de 3 Mètres',
      },
      {
        icon: Award,
        title: 'Circuit Breveté',
        subtitle: 'Brevet US US-12539416',
        desc: 'Micro-circuit propriétaire de résonance harmonique conçu pour harmoniser sans perturber vos télécommunications.',
        tag: 'US-12539416',
        stat: 'Breveté',
        statLabel: 'Technologie Harmonique',
      },
      {
        icon: BatteryCharging,
        title: 'Jusqu’à 72 Heures',
        subtitle: 'Batterie Lithium Certifiée',
        desc: 'Batterie rechargeable haute capacité offrant plusieurs jours de protection silencieuse sur une simple charge USB-C.',
        tag: 'GRANDE AUTONOMIE',
        stat: '72h Max',
        statLabel: 'Autonomie Continue',
      },
    ],
    environments: {
      eyebrow: 'INTÉGRATION CONCRÈTE',
      heading: 'Dans Votre Vie Quotidienne',
      sub: 'Conçu pour s’adapter aux lieux où vous vivez, travaillez et vous déplacez chaque jour.',
      items: [
        {
          icon: Laptop,
          tag: 'BUREAU & TRAVAIL',
          title: 'Espaces Professionnels & Coworking',
          desc: 'Posez-le près de votre ordinateur pour créer une zone de travail sereine au milieu des multiples réseaux Wi-Fi.',
        },
        {
          icon: Car,
          tag: 'HABITACLE DU VÉHICULE',
          title: 'Trajets et Conduite au Quotidien',
          desc: 'Se loge facilement dans un porte-gobelet ou la console centrale pour atténuer les champs électroniques de bord.',
        },
        {
          icon: Plane,
          tag: 'BAGAGES & VOYAGES',
          title: 'Vols et Séjours à l’Hôtel',
          desc: 'Format compact conforme aux normes cabine pour les aéroports, trains et chambres d’hôtel connectées.',
        },
        {
          icon: HomeIcon,
          tag: 'CHAMBRE & MAISON',
          title: 'Sanctuaire de Repos Nocturne',
          desc: 'Fonctionnement inaudible sur la table de nuit pour favoriser la régénération cellulaire dans les maisons intelligentes.',
        },
      ],
    },
    clinicalBadge: 'RECHERCHE CLINIQUE UNIVERSITAIRE UTAR',
    clinicalTitle: 'Résultats Cliniques Chez l’Humain (3 Jours)',
    clinicalSubtitle:
      'Évalué lors d’études cliniques menées par l’Universiti Tunku Abdul Rahman (UTAR). Effets biologiques démontrés dès 72 heures.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'RÉDUCTION',
        title: 'Agrégation des Globules Rouges (Rouleaux)',
        subtitle: 'Figure 2.1 État initial vs Figure 2.2 Après intervention',
        desc: 'Réduction statistiquement significative de l’agglutination des hématies, favorisant la fluidité sanguine et l’oxygénation des cellules.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'AMÉLIORATION',
        title: 'Soulagement des Symptômes d’EHS',
        subtitle: 'Auto-évaluation de l’Électrosensibilité',
        desc: '70.3% des participants ont rapporté un soulagement notable de la fatigue, du brouillard cérébral et de la tension liée aux ondes.',
        icon: Users,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'AUGMENTATION',
        title: 'Hausse des Niveaux de Sérotonine',
        subtitle: 'Neurotransmetteur de l’Humeur et du Sommeil',
        desc: 'Augmentation mesurée de 59.5% de la sérotonine, favorisant la stabilité de l’humeur, la qualité du sommeil et la clarté d’esprit.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'RÉDUCTION',
        title: 'Baisse de la Protéine de Stress (HSP-27)',
        subtitle: 'Biomarqueur de Stress et Surcharge Cellulaire',
        desc: 'Diminution mesurée de 42.5% de la protéine HSP-27, produite par les cellules en réponse au stress thermique et oxydatif.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specsBadge: 'INGÉNIERIE & NORMES',
    specTitle: 'Spécifications Techniques de l’Appareil',
    specSubtitle: 'Conception de précision conforme aux normes internationales de qualité et de sécurité électromagnétique.',
    specs: [
      { label: 'Brevet Technologique', value: 'Brevet US n° US-12539416' },
      { label: 'Centre Universitaire', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Rayon d’Action', value: '3 Mètres (env. 10 pieds) à 360°' },
      { label: 'Autonomie Batterie', value: 'Jusqu’à 72 Heures de Protection Continue' },
      { label: 'Recharge', value: 'Port Universel Rapide USB-C' },
      { label: 'Impact sur le Signal', value: '0% de Blocage / 100% Compatible Wi-Fi & Téléphone' },
      { label: 'Distribution Mondiale', value: 'Exclusivement via les Distributeurs Officiels Enagic' },
    ],
    demoBadge: 'DÉMONSTRATION EN VIDÉO',
    demoTitle: 'Présentation Complète de l’Enagic emGuarde™',
    demoSubtitle: 'Découvrez la rupture scientifique, les essais cliniques UTAR et l’harmonisation fréquentielle rapprochée.',
    watchTime: 'Durée : ~8 minutes',
    duoBadge: 'LE DUO TRUE LEGACY',
    duoTitle1: 'Deux Technologies.',
    duoTitle2: 'Un Seul Écosystème de Vie.',
    duoBody:
      'True Legacy associe emGuarde et l’Eau Kangen® dans une démarche de bien-être cohérente : protection environnementale externe et hydratation cellulaire interne.',
    duoExploreBtn: 'Découvrir le True Legacy Duo',
    duoPricingBtn: 'Demander un Conseil Duo',
    faqEyebrow: 'RÉPONSES CLAIRES',
    faqTitle: 'Foire Aux Questions',
    faqSubtitle: 'Informations vérifiées sur le fonctionnement, l’usage et la commande de l’Enagic emGuarde™.',
    faqs: [
      {
        q: 'Qu’est-ce que l’Enagic emGuarde™ et que fait-il concrètement ?',
        a: 'The Enagic emGuarde™ est un dispositif électronique portable conçu pour harmoniser le bruit électromagnétique ambiant de haute fréquence. Grâce à un brevet américain (US-12539416), il génère un champ harmonique sphérique de 3 mètres qui soutient l’équilibre corporel sans couper les réseaux sans fil.',
      },
      {
        q: 'Bloque-t-il ou élimine-t-il les ondes électromagnétiques ?',
        a: 'Non, et c’est voulu. emGuarde ne bloque pas les ondes radio—un blindage obligerait vos appareils à émettre plus fort pour capter le réseau. emGuarde supprime spécifiquement le bruit harmonique perturbateur pour la biologie tout en laissant vos débits 5G, Wi-Fi et Bluetooth totalement intacts.',
      },
      {
        q: 'Quelles études cliniques attestent de son efficacité ?',
        a: 'Il a été testé chez l’humain par l’Universiti Tunku Abdul Rahman (UTAR). Au bout de 72 heures, les données ont montré une réduction de 50.7% de l’agrégation sanguine, une amélioration de 70.3% des symptômes d’électrosensibilité, une hausse de 59.5% de sérotonine et une baisse de 42.5% de la protéine de stress HSP-27.',
      },
      {
        q: 'Quelle est la portée de protection du dispositif ?',
        a: 'emGuarde projette un champ sphérique de 3 mètres de rayon (360 degrés), ce qui est idéal pour votre bureau, l’habitacle de votre voiture, votre chambre d’hôtel ou votre table de nuit.',
      },
      {
        q: 'Combien de temps dure la batterie et comment la recharger ?',
        a: 'La batterie au lithium certifiée procure jusqu’à 72 heures d’utilisation continue par charge. Elle se recharge simplement via un câble USB-C standard relié à un chargeur ou un ordinateur portable.',
      },
      {
        q: 'Comment s’associe-t-il à l’Eau Kangen dans le Duo True Legacy ?',
        a: 'True Legacy propose une approche à 360° : le Leveluk K8 hydrate et protège vos cellules de l’intérieur grâce à l’eau ionisée, tandis qu’emGuarde assure l’harmonisation fréquentielle de votre environnement immédiat.',
      },
      {
        q: 'Comment commander et l’appareil est-il disponible dans mon pays ?',
        a: 'emGuarde est distribué exclusivement par le réseau de distributeurs agréés Enagic avec livraison dans plus de 150 pays. Cliquez sur "Obtenir Tarifs" ou contactez votre distributeur pour obtenir les prix officiels de votre zone.',
      },
    ],
    guidance: {
      eyebrow: 'ACCOMPAGNEMENT DIRECT',
      heading: 'Conseil Personnalisé sur emGuarde™',
      sub: 'Contactez directement votre distributeur indépendant True Legacy pour connaître les tarifs en vigueur, les modalités de livraison et les offres packagées.',
      badge: 'Conseil Dédié',
      chatAction: 'Échanger sur WhatsApp',
      consultationAction: 'Demander un Conseil',
    },
    finalCta: {
      heading: 'Prêt à Découvrir l’Harmonisation emGuarde™ ?',
      sub: 'Recevez les tarifs en vigueur, les délais d’expédition et l’accompagnement direct de votre distributeur agréé True Legacy.',
      primary: 'Obtenir Tarifs & Disponibilités',
      secondaryWhatsapp: 'Contacter sur WhatsApp',
      secondaryPricing: 'Demander un Conseil Privé',
      redirectNotice: 'Les commandes officielles sont traitées directement par les bureaux corporatifs d’Enagic à travers le monde.',
    },
    legal: {
      compliance:
        'Avertissement Réglementaire : The Enagic emGuarde™ est un dispositif électronique d’harmonisation environnementale. Il ne bloque pas les signaux sans fil et ne constitue pas un appareil médical. Il n’est pas destiné à diagnostiquer, traiter, guérir ou prévenir une quelconque pathologie.',
      distributor:
        'Mention Distributeur Indépendant : Cette page est gérée de manière indépendante par des distributeurs agréés True Legacy et ne constitue pas le site corporatif d’Enagic Co., Ltd.',
      disclaimer: 'Toutes les marques, logos et brevets cités appartiennent à leurs détenteurs respectifs.',
    },
  },
  pt: {
    nav: {
      badge: 'emGuarde®',
      backToProfile: 'Voltar ao Perfil',
      back: 'Voltar',
      leader: 'Líder:',
      watchDemo: 'Ver Demo',
      buyNow: 'Comprar',
      whatsapp: 'WhatsApp',
      contactDistributor: 'Falar com Distribuidor',
      getPricing: 'Ver Preços',
    },
    hero: {
      eyebrow: 'TECNOLOGIA HARMÔNICA PATENTEADA · US-12539416',
      title1: 'Proteja Sua Biologia.',
      titleAccent: 'Harmonize',
      title2: 'Seu Ambiente.',
      sub: 'Dispositivo pessoal de proteção aproximada desenvolvido para promover o equilíbrio biológico em ambientes com alta densidade eletromagnética. Clinicamente avaliado, ultraportátil e sem interferência em redes sem fio.',
      ctaDemo: 'Ver Demonstração',
      ctaBuy: 'Comprar emGuarde Agora',
      claims: [
        'Patente Americana US-12539416',
        'Raio de Cobertura Esférica de 3 Metros',
        '0% de Bloqueio de Sinal (100% Seguro com Wi-Fi)',
        'Ensaios Clínicos em Humanos UTAR (72 Horas)',
      ],
      presentedBy: 'Orientação de Produtos True Legacy',
      distributorTag: 'Distribuidores Independentes Enagic',
    },
    trustStrip: {
      patent: { title: 'Patente US-12539416', desc: 'Circuito de ressonância harmônica' },
      coverage: { title: 'Raio de 3 Metros', desc: 'Campo protetor esférico de 360°' },
      signal: { title: '100% Seguro com Redes', desc: 'Sem afetar Wi-Fi, Bluetooth ou celulares' },
      trials: { title: 'Ensaios UTAR (Humanos)', desc: 'Validação clínica em 72 horas' },
    },
    whatIs: {
      eyebrow: 'ARQUITETURA DE EQUILÍBRIO',
      heading: 'O que é o Enagic emGuarde™?',
      sub: 'Um dispositivo eletrônico de precisão que harmoniza o ruído eletromagnético ambiental sem bloquear as redes sem fio que você utiliza no dia a dia.',
      paragraph1:
        'A vida contemporânea nos cerca de uma densidade sem precedentes de frequências eletromagnéticas emitidas por smartphones, antenas 5G, roteadores Wi-Fi 6 e dispositivos digitais. Embora vitais para a conectividade, essa exposição gera ruídos de alta frequência que interagem com o corpo humano.',
      paragraph2:
        'O Enagic emGuarde™ é um supressor harmônico ultraportátil fruto de mais de uma década de pesquisas. Com tecnologia patenteada nos Estados Unidos, ele neutraliza o ruído eletromagnético em um raio de 3 metros, promovendo o equilíbrio biológico onde você estiver.',
      bullets: [
        'Cria um campo harmônico de 360° ao redor do seu corpo',
        'Zero interferência no sinal de celular ou na velocidade da internet Wi-Fi',
        'Acabamento em grafite elegante para levar no bolso, bolsa ou mesa de trabalho',
        'Bateria de lítio recarregável com até 72 horas de funcionamento contínuo',
      ],
      badge: 'Tecnologia Oficial Enagic',
      caption: 'Dispositivo pessoal de proteção aproximada Enagic emGuarde™.',
    },
    environmentShift: {
      eyebrow: 'A REALIDADE MODERNA',
      heading: 'Por Que Nossos Ambientes Mudaram',
      sub: 'Em apenas duas décadas, a intensidade da poluição eletromagnética multiplicou-se exponencialmente em lares, escritórios e transportes.',
      cards: [
        {
          tag: 'LARES CONECTADOS',
          title: 'Imersão Doméstica Constante',
          desc: 'Residências modernas reúnem dezenas de aparelhos inteligentes, roteadores em malha e medidores transmitindo 24 horas por dia.',
        },
        {
          tag: 'AMBIENTES DE TRABALHO',
          title: 'Alta Densidade Digital',
          desc: 'Escritórios e coworkings concentram centenas de laptops, monitores sem fio e servidores operando a curta distância.',
        },
        {
          tag: 'TRANSPORTE E VIAGENS',
          title: 'Habitáculos Metálicos Confinados',
          desc: 'Carros elétricos, aviões e trens concentram fortes correntes elétricas e múltiplos transmissores de rádio em espaços fechados.',
        },
      ],
    },
    techStory: {
      eyebrow: 'MECANISMO CIENTÍFICO',
      heading: 'Como a Tecnologia Foi Projetada',
      sub: 'Supressão harmônica direcionada em vez de bloqueio indiscriminado de sinal.',
      patentNumber: 'US-12539416',
      patentBadge: 'Tecnologia de Ressonância Patenteada nos EUA',
      mechanismHeading: 'Supressão Harmônica vs. Bloqueio de Sinal',
      mechanismBody:
        'Diferente de protetores rudimentares que tentam desviar ondas de rádio (o que força telefones a emitirem mais potência para encontrar sinal), o emGuarde utiliza um microcircuito de ressonância harmônica. Ele neutraliza os picos de ruído eletromagnético prejudiciais aos tecidos biológicos, permitindo que os sinais de dados (Wi-Fi, 4G, 5G, Bluetooth) continuem funcionando normalmente.',
      specsList: [
        { label: 'Raio Harmônico', value: '3 Metros (aprox. 10 pés) em 360°' },
        { label: 'Patente Técnica', value: 'Patente dos EUA nº US-12539416' },
        { label: 'Transparência de Rede', value: '100% de Velocidade Wi-Fi e Telefonia' },
        { label: 'Nível de Ruído', value: '0 dB (Operação Totalmente Silenciosa)' },
      ],
      complianceNotice:
        'O emGuarde é projetado para harmonização ambiental e suporte ao bem-estar celular. Não possui finalidade médica nem promete diagnosticar, tratar ou curar doenças.',
    },
    pillarsBadge: 'DESENVOLVIDO PARA A VIDA MODERNA',
    pillarsTitle: 'Os 5 Pilares de Defesa do emGuarde™',
    pillarsSubtitle: 'Criado para acompanhar sua rotina diária sem alterar seu estilo de vida nem seus dispositivos.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Portabilidade Total',
        subtitle: 'Onde Quer Que Você Vá',
        desc: 'Design ultracompacto que se encaixa facilmente em bolsos, mochilas, no console do carro ou na mesa de cabeceira.',
        tag: 'MOBILIDADE APROXIMADA',
        stat: 'Portátil',
        statLabel: 'Pronto para Qualquer Momento',
      },
      {
        icon: Microscope,
        title: 'Avaliação Clínica',
        subtitle: 'Ensaios Universitários (UTAR)',
        desc: 'Avaliado em pesquisas clínicas com humanos pela Universiti Tunku Abdul Rahman, demonstrando respostas biológicas em 72 horas.',
        tag: 'VALIDAÇÃO CIENTÍFICA',
        stat: '3 Dias',
        statLabel: 'Impacto Biológico Medível',
      },
      {
        icon: ShieldCheck,
        title: 'Cobertura Esférica 360°',
        subtitle: 'Raio Confortável de 3 Metros',
        desc: 'Projeta um envelope estável que protege seu espaço de trabalho, a cabine do veículo ou seu quarto.',
        tag: 'ENVELOPE CONTÍNUO',
        stat: '360°',
        statLabel: 'Raio de 3 Metros',
      },
      {
        icon: Award,
        title: 'Circuito Patenteado',
        subtitle: 'Patente dos EUA US-12539416',
        desc: 'Circuito de ressonância harmônica proprietário projetado para harmonizar sem degradar a conectividade dos aparelhos.',
        tag: 'US-12539416',
        stat: 'Patenteado',
        statLabel: 'Tecnologia Harmônica',
      },
      {
        icon: BatteryCharging,
        title: 'Até 72 Horas',
        subtitle: 'Bateria de Lítio Certificada',
        desc: 'Bateria recarregável de alta capacidade que oferece vários dias de proteção silenciosa com uma única carga USB-C.',
        tag: 'LONGA AUTONOMIA',
        stat: 'Até 72h',
        statLabel: 'Bateria Contínua',
      },
    ],
    environments: {
      eyebrow: 'INTEGRAÇÃO PRÁTICA',
      heading: 'Ambientes do Dia a Dia',
      sub: 'Criado para os locais onde você vive, trabalha e se locomove todos os dias.',
      items: [
        {
          icon: Laptop,
          tag: 'MESA E TRABALHO',
          title: 'Escritórios e Ambientes Corporativos',
          desc: 'Posicione-o ao lado do computador para criar uma área de equilíbrio e foco entre dezenas de redes Wi-Fi e telas.',
        },
        {
          icon: Car,
          tag: 'CONSOLE DO CARRO',
          title: 'Trajetos e Condução Diária',
          desc: 'Encaixa-se no porta-copos ou console central, atenuando campos elétricos emitidos por painéis digitais e navegação.',
        },
        {
          icon: Plane,
          tag: 'BAGAGEM E VIAGENS',
          title: 'Voos e Estadias em Hotéis',
          desc: 'Formato compacto compatível com bagagem de mão, perfeito para salas de embarque, trens e redes Wi-Fi hoteleiras.',
        },
        {
          icon: HomeIcon,
          tag: 'QUARTO E LAR',
          title: 'Santuário de Descanso Noturno',
          desc: 'Funcionamento inaudível na mesa de cabeceira, favorecendo a recuperação celular em casas inteligentes conectadas.',
        },
      ],
    },
    clinicalBadge: 'PESQUISA CLÍNICA UNIVERSITÁRIA UTAR',
    clinicalTitle: 'Resultados Clínicos em Humanos (3 Dias)',
    clinicalSubtitle:
      'Avaliado em ensaios clínicos conduzidos pela Universiti Tunku Abdul Rahman (UTAR). Respostas biológicas observadas em 72 horas.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'REDUÇÃO',
        title: 'Aglomeração de Glóbulos Vermelhos (Rouleaux)',
        subtitle: 'Figura 2.1 Linha de base vs. Figura 2.2 Pós-intervenção',
        desc: 'Redução estatisticamente expressiva na aglomeração de hemácias, favorecendo fluxo sanguíneo microvascular e oxigenação celular.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'MELHORA',
        title: 'Alívio de Sintomas Subjetivos de EHS',
        subtitle: 'Autoavaliação de Hipersensibilidade Eletromagnética',
        desc: '70.3% dos participantes relataram alívio perceptível de fadiga, confusão mental e estresse por radiação ambiental.',
        icon: Users,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'AUMENTO',
        title: 'Elevação nos Níveis de Serotonina',
        subtitle: 'Neurotransmissor do Humor e Sono',
        desc: 'Aumento de 59.5% nos níveis de serotonina, apoiando equilíbrio de humor, sono reparador e clareza cognitiva.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'REDUÇÃO',
        title: 'Queda na Proteína de Estresse (HSP-27)',
        subtitle: 'Biomarcador Celular de Sobrecarga',
        desc: 'Diminuição mensurável de 42.5% na HSP-27, proteína liberada pelas células em resposta à sobrecarga fisiológica e estresse oxidativo.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specsBadge: 'ENGENHARIA E NORMAS',
    specTitle: 'Especificações Técnicas do Aparelho',
    specSubtitle: 'Engenharia de precisão fabricada com os mais altos padrões internacionais de qualidade e segurança.',
    specs: [
      { label: 'Patente Tecnológica', value: 'Patente dos EUA nº US-12539416' },
      { label: 'Instituição de Pesquisa', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Raio de Cobertura', value: '3 Metros (aprox. 10 pés) em 360°' },
      { label: 'Autonomia de Bateria', value: 'Até 72 Horas de Proteção Silenciosa' },
      { label: 'Conexão de Recarga', value: 'USB-C Universal de Recarga Rápida' },
      { label: 'Impacto no Sinal', value: '0% de Bloqueio / 100% Compatível com Wi-Fi e Celular' },
      { label: 'Distribuição Global', value: 'Exclusivamente por Distribuidores Oficiais Enagic' },
    ],
    demoBadge: 'DEMONSTRAÇÃO EM VÍDEO',
    demoTitle: 'Apresentação Completa do Enagic emGuarde™',
    demoSubtitle: 'Conheça o avanço científico, os ensaios clínicos da UTAR e a harmonização de frequências.',
    watchTime: 'Duração: ~8 minutos',
    duoBadge: 'O DUO TRUE LEGACY',
    duoTitle1: 'Duas Tecnologias.',
    duoTitle2: 'Um Estilo de Vida Conectado.',
    duoBody:
      'A True Legacy apresenta o emGuarde e a Água Kangen® como um ecossistema integrado: defesa ambiental externa combinada com hidratação celular interna.',
    duoExploreBtn: 'Explorar o True Legacy Duo',
    duoPricingBtn: 'Solicitar Consulta do Duo',
    faqEyebrow: 'RESPOSTAS CLARAS',
    faqTitle: 'Perguntas Frequentes',
    faqSubtitle: 'Informações comprovadas sobre o funcionamento, uso e pedidos do Enagic emGuarde™.',
    faqs: [
      {
        q: 'O que é o Enagic emGuarde™ e o que ele faz?',
        a: 'The Enagic emGuarde™ é um dispositivo eletrônico portátil projetado para harmonizar ruídos eletromagnéticos de alta frequência. Com tecnologia patenteada nos EUA (US-12539416), cria um campo esférico de 3 metros que apoia o equilíbrio biológico sem interromper redes sem fio.',
      },
      {
        q: 'Ele bloqueia ou elimina as frequências eletromagnéticas?',
        a: 'Não, e por projeto. O emGuarde não bloqueia as ondas de rádio—bloquear sinais forçaria seus aparelhos a transmitirem com maior potência para conectar. O emGuarde suprime os picos de ruído harmônico que afetam a biologia, mantendo seu Wi-Fi, 5G e Bluetooth com velocidade total.',
      },
      {
        q: 'Quais ensaios clínicos comprovam o emGuarde?',
        a: 'Foi avaliado em pesquisas clínicas com humanos pela UTAR. Em 72 horas, verificou-se redução de 50.7% na aglomeração de glóbulos vermelhos, 70.3% de alívio subjetivo em sintomas de EHS, 59.5% de aumento na serotonina e queda de 42.5% na proteína de estresse celular HSP-27.',
      },
      {
        q: 'Qual é a área de cobertura do aparelho?',
        a: 'Gera um raio esférico de 3 metros (aproximadamente 10 pés) em 360 graus. É ideal para sua mesa de trabalho, cabine do carro, quarto de hotel ou mesa de cabeceira.',
      },
      {
        q: 'Quanto tempo dura a bateria e como recarregar?',
        a: 'A bateria de lítio certificada oferece até 72 horas de uso contínuo com uma única recarga. Recarrega facilmente usando cabo USB-C conectado a qualquer carregador ou computador.',
      },
      {
        q: 'Como ele se complementa com a Água Kangen no Duo True Legacy?',
        a: 'A True Legacy promove um padrão de bem-estar em 360°: a ionização da Leveluk K8 proporciona hidratação celular e poder antioxidante interno, enquanto o emGuarde oferece harmonização frequencial no ambiente.',
      },
      {
        q: 'Como posso encomendar e está disponível no meu país?',
        a: 'O emGuarde é vendido exclusivamente por distribuidores independentes autorizados da Enagic, com envios diretos para mais de 150 países. Clique em "Ver Preços" ou fale diretamente com seu distribuidor para consultar os valores oficiais em sua região.',
      },
    ],
    guidance: {
      eyebrow: 'ATENDIMENTO DIRETO',
      heading: 'Orientação Personalizada sobre o emGuarde™',
      sub: 'Conecte-se diretamente com seu distribuidor independente True Legacy para consultar valores de mercado, envio internacional e pacotes recomendados.',
      badge: 'Orientação Dedicada',
      chatAction: 'Conversar no WhatsApp',
      consultationAction: 'Solicitar Atendimento',
    },
    finalCta: {
      heading: 'Pronto para Experimentar a Harmonização emGuarde™?',
      sub: 'Receba valores vigentes, prazos de entrega e atendimento direto do seu distribuidor autorizado True Legacy.',
      primary: 'Consultar Valores e Disponibilidade',
      secondaryWhatsapp: 'Falar pelo WhatsApp',
      secondaryPricing: 'Solicitar Consulta Privada',
      redirectNotice: 'Os pedidos oficiais são processados e enviados pelas filiais corporativas da Enagic em todo o mundo.',
    },
    legal: {
      compliance:
        'Aviso de Conformidade: The Enagic emGuarde™ é um dispositivo eletrônico de harmonização ambiental. Não bloqueia sinais de telecomunicações nem é um dispositivo médico. Não tem por finalidade diagnosticar, tratar, curar ou prevenir qualquer patologia.',
      distributor:
        'Aviso de Distribuidor Independente: Esta página é administrada de forma independente por distribuidores autorizados True Legacy e não representa o site corporativo da Enagic Co., Ltd.',
      disclaimer: 'Todas as marcas, logotipos e patentes citados pertencem aos seus respectivos titulares.',
    },
  },
}

export function EmguardeLandingPage({ profile: propProfile, distributorSlug }: EmguardeLandingPageProps) {
  const { locale, setLocale } = useLocaleContext()
  const [searchParams] = useSearchParams()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedVideoLang, setSelectedVideoLang] = useState<Locale>(locale)
  const [pastVideoSection, setPastVideoSection] = useState(false)
  const videoSectionRef = useRef<HTMLElement>(null)

  const copy = I18N[locale] || I18N.en
  const effectiveSlug = distributorSlug || profile?.slug || 'mehdi-cohen'
  const isLeaderPage = Boolean(distributorSlug || propProfile?.slug)

  useEffect(() => {
    setSelectedVideoLang(locale)
  }, [locale])

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
      return
    }
    getPublicDistributors().then((items) => {
      const match = items.find((item) => item.slug === effectiveSlug)
      setProfile(match || items[0] || null)
    })
  }, [effectiveSlug, propProfile])

  // Scroll observer to update CTA emphasis once scrolled past demo
  useEffect(() => {
    const handleScroll = () => {
      if (!videoSectionRef.current) return
      const rect = videoSectionRef.current.getBoundingClientRect()
      setPastVideoSection(rect.bottom < 120)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const distributorName = profile?.display_name || 'True Legacy Leader'
  const distributorFirstName = distributorName.split(' ')[0]
  const leaderTitle = profile?.title || (locale === 'es' ? 'Líder True Legacy' : locale === 'fr' ? 'Leader True Legacy' : locale === 'pt' ? 'Líder True Legacy' : 'True Legacy Leader')
  const leaderAvatar = profile?.avatar_url || (profile?.slug ? getLeaderPortrait(profile.slug) : '/logos/tl-square-white.png')

  // Dynamic Purchase Link resolution
  const directPurchaseUrl = getProductPurchaseLink(profile?.purchase_links, 'emguarde')
  const hasPurchaseLink = Boolean(directPurchaseUrl)

  // Videos
  const rawVideoUrl = PRODUCT_VIDEOS.emguardeGo[selectedVideoLang] || PRODUCT_VIDEOS.emguardeGo.en
  const embedVideoUrl = useMemo(() => toEmbedUrl(rawVideoUrl), [rawVideoUrl])

  // Routes & Parameters
  const sourceParam = searchParams.get('source') || 'profile'
  const interestParam = searchParams.get('interest') || 'duo'
  const distributorProfileRoute = `/d/${effectiveSlug}`
  const duoUrl = `/d/${effectiveSlug}/duo?source=emguarde&interest=${interestParam}`
  const jotformUrl = `https://form.jotform.com/242948512534056?distributor=${encodeURIComponent(effectiveSlug)}&source=${encodeURIComponent(sourceParam)}&product=emguarde`

  // WhatsApp
  const whatsappNumber = profile?.phone?.replace(/\D/g, '') || ''
  const getWhatsAppMessage = () => {
    if (locale === 'es') {
      return `Hola ${distributorFirstName}, estoy revisando la página de Enagic emGuarde en True Legacy y me gustaría conocer precios y disponibilidad para mi país.`
    }
    if (locale === 'fr') {
      return `Bonjour ${distributorFirstName}, je consulte la page Enagic emGuarde sur True Legacy et j'aimerais connaître les tarifs et la disponibilité pour mon pays.`
    }
    if (locale === 'pt') {
      return `Olá ${distributorFirstName}, estou visualizando a página do Enagic emGuarde na True Legacy e gostaria de saber valores e disponibilidade para meu país.`
    }
    return `Hi ${distributorFirstName}, I'm reviewing the Enagic emGuarde page on True Legacy and would love to ask you about current pricing and availability for my country.`
  }

  const personalWhatsAppUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMessage())}`
    : ''

  const handleActionClick = (actionName: string) => {
    trackEvent('cta_click', {
      action: actionName,
      distributor: effectiveSlug,
      product: 'emguarde',
      locale,
    })
  }

  return (
    <div className="page-wrapper min-h-screen bg-[#070b12] text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`The Enagic emGuarde™ · Patented Close-Body Personal Protection · ${distributorName}`}
        description={`${copy.hero.title1} ${copy.hero.titleAccent} ${copy.hero.title2} ${copy.hero.sub.slice(0, 140)}...`}
        image="/emguarde/emguarde-cinematic-hero.png"
      />

      {/* ── STICKY SLIM HEADER (KANGEN SISTER NAVIGATION ARCHITECTURE) ── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070b12]/85 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Left: Original True Legacy Logo & emGuarde Identifier Badge */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-0.5 shrink-0"
            >
              <TrueLegacyLogo variant="nav" className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-[10px] font-semibold text-cyan-400/90 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
                {copy.nav.badge}
              </span>
            </Link>

            {isLeaderPage && (
              <Link
                to={distributorProfileRoute}
                className="hidden lg:inline-flex items-center gap-1.5 ml-2 pl-3 border-l border-white/10 text-xs text-slate-300 hover:text-white transition-colors group"
                title={`Back to ${distributorName}'s Profile`}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-slate-400">{copy.nav.leader}</span>
                <span className="font-semibold text-white truncate max-w-[120px]">{distributorFirstName}</span>
              </Link>
            )}
          </div>

          {/* Right Header Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Symmetrical Round Language Selector Bubbles */}
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 notranslate" translate="no">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLocale(lang)
                    setSelectedVideoLang(lang)
                  }}
                  className={cn(
                    'w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[11px] uppercase transition-all duration-200 shrink-0 notranslate',
                    locale === lang
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/10 font-bold'
                  )}
                  aria-label={`Switch language to ${lang.toUpperCase()}`}
                  translate="no"
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Header Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2.5">
              {hasPurchaseLink && (
                <a
                  href={directPurchaseUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('header_buy_now')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{copy.nav.buyNow}</span>
                </a>
              )}

              <a
                href="#video-demo"
                onClick={() => handleActionClick('header_watch_demo')}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5',
                  !pastVideoSection && !hasPurchaseLink
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                    : 'border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                )}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{copy.nav.watchDemo}</span>
              </a>

              {personalWhatsAppUrl ? (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('header_whatsapp')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{distributorFirstName}</span>
                </a>
              ) : (
                <Link
                  to={distributorProfileRoute}
                  onClick={() => handleActionClick('header_contact_distributor')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{copy.nav.contactDistributor}</span>
                </Link>
              )}

              <a
                href={jotformUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick('header_get_pricing')}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5 font-bold',
                  pastVideoSection && !hasPurchaseLink
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                )}
              >
                {copy.nav.getPricing}
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
            onClick={() => handleActionClick('mobile_sticky_watch_demo')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-[11px] hover:bg-cyan-500/25 transition-all text-center leading-tight"
          >
            <Play className="w-4 h-4 mb-1 text-cyan-400 fill-cyan-400/20" />
            <span>{copy.nav.watchDemo}</span>
          </a>

          {personalWhatsAppUrl ? (
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
              onClick={() => handleActionClick('mobile_sticky_distributor')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] hover:bg-emerald-500/25 transition-all text-center leading-tight"
            >
              <Users className="w-4 h-4 mb-1 text-emerald-400" />
              <span>{copy.nav.contactDistributor}</span>
            </Link>
          )}

          {hasPurchaseLink ? (
            <a
              href={directPurchaseUrl!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick('mobile_sticky_buy_now')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] shadow-lg shadow-amber-500/25 transition-all text-center leading-tight"
            >
              <ShoppingCart className="w-4 h-4 mb-1 fill-current" />
              <span>{copy.nav.buyNow}</span>
            </a>
          ) : (
            <a
              href={jotformUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick('mobile_sticky_get_pricing')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[11px] shadow-lg shadow-cyan-500/20 transition-all text-center leading-tight"
            >
              <Zap className="w-4 h-4 mb-1 fill-current" />
              <span>{copy.nav.getPricing}</span>
            </a>
          )}
        </div>
      </div>

      <main className="relative overflow-hidden">
        {/* ── 01: HERO SECTION — FULL-BLEED CINEMATIC BACKGROUND ── */}
        <section
          className="relative overflow-hidden border-b border-white/10"
          style={{
            minHeight: 'clamp(620px, 56vw, 840px)',
          }}
        >
          {/* Full-bleed background image */}
          <div
            className="emguarde-hero-bg absolute inset-0 w-full h-full"
            aria-hidden="true"
            style={{
              backgroundImage: "url('/emguarde/emguarde-cinematic-hero.png')",
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center right',
            }}
          />

          {/* Left-to-center dark gradient for high editorial contrast */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(to right, rgba(7,11,18,0.88) 0%, rgba(7,11,18,0.76) 35%, rgba(7,11,18,0.35) 58%, rgba(7,11,18,0.0) 78%)',
            }}
          />

          {/* Subtle top & bottom vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(to bottom, rgba(7,11,18,0.45) 0%, transparent 18%, transparent 80%, rgba(7,11,18,0.6) 100%)',
            }}
          />

          {/* Hero Content — Left Aligned */}
          <div className="relative z-10 h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 'inherit' }}>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="w-full max-w-[530px] lg:max-w-[580px] xl:max-w-[620px] py-14 md:py-20 space-y-5"
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-black/40 backdrop-blur-sm px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{copy.hero.eyebrow}</span>
              </div>

              {/* 3-Line Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                {copy.hero.title1}
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  {copy.hero.titleAccent}
                </span>{' '}
                {copy.hero.title2}
              </h1>

              {/* Supporting Body Copy */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                {copy.hero.sub}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#video-demo"
                  onClick={() => handleActionClick('hero_watch_demo')}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-cyan-500/30 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <Play className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span>{copy.hero.ctaDemo}</span>
                </a>

                {hasPurchaseLink && (
                  <a
                    href={directPurchaseUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('hero_buy_now')}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-amber-500/30"
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span>{copy.hero.ctaBuy}</span>
                  </a>
                )}

                {personalWhatsAppUrl ? (
                  <a
                    href={personalWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('hero_whatsapp')}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>WhatsApp {distributorFirstName}</span>
                  </a>
                ) : (
                  <Link
                    to={distributorProfileRoute}
                    onClick={() => handleActionClick('hero_contact_distributor')}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-5 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Users className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{copy.nav.contactDistributor}</span>
                  </Link>
                )}
              </div>

              {/* 4 Trust Strip Points */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-x-4 gap-y-2">
                {copy.hero.claims.map((claim, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-snug">{claim}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Distributor Attribution Badge */}
              <div className="pt-1">
                {isLeaderPage ? (
                  <Link
                    to={distributorProfileRoute}
                    className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors p-2 pr-4 group"
                  >
                    <img
                      src={leaderAvatar}
                      alt={distributorName}
                      className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0 group-hover:scale-105 transition-transform bg-slate-900"
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
                  <div className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black/40 backdrop-blur-sm p-2 pr-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{copy.hero.presentedBy}</div>
                      <div className="text-[11px] text-cyan-400/90 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{copy.hero.distributorTag}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Responsive background repositioning styles */}
          <style>{`
            @media (max-width: 639px) {
              .emguarde-hero-bg { background-position: 78% center !important; min-height: 680px !important; }
            }
            @media (min-width: 640px) and (max-width: 1023px) {
              .emguarde-hero-bg { background-position: 72% center !important; }
            }
          `}</style>
        </section>

        {/* ── 02: HERO COMPACT TRUST STRIP (KANGEN SISTER BAR) ── */}
        <section className="border-b border-white/10 bg-[#090f1a]/80 py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x md:divide-white/10">
              <div className="flex items-center gap-3 px-2">
                <Award className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{copy.trustStrip.patent.title}</div>
                  <div className="text-[11px] text-slate-400">{copy.trustStrip.patent.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 md:pl-6">
                <Radio className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{copy.trustStrip.coverage.title}</div>
                  <div className="text-[11px] text-slate-400">{copy.trustStrip.coverage.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 md:pl-6">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{copy.trustStrip.signal.title}</div>
                  <div className="text-[11px] text-slate-400">{copy.trustStrip.signal.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 md:pl-6">
                <Microscope className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{copy.trustStrip.trials.title}</div>
                  <div className="text-[11px] text-slate-400">{copy.trustStrip.trials.desc}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03: VIDEO / DEMONSTRATION SECTION (KANGEN SISTER FORMAT) ── */}
        <section
          id="video-demo"
          ref={videoSectionRef}
          className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#09101d] to-[#070b12] relative"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                {copy.demoBadge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                {copy.demoTitle}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                {copy.demoSubtitle}
              </p>
            </div>

            {/* Language Selector Bar for Video */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 notranslate" translate="no">
              <span className="text-xs font-semibold text-slate-400">
                Video Language:
              </span>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-xl">
                {(
                  [
                    { code: 'en', label: 'English (~8m)' },
                    { code: 'es', label: 'Español (~8m)' },
                    { code: 'fr', label: 'Français (~8m)' },
                    { code: 'pt', label: 'Português (~8m)' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedVideoLang(lang.code)
                      setLocale(lang.code)
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all notranslate',
                      selectedVideoLang === lang.code
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                    translate="no"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 16:9 Video Embed */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  key={embedVideoUrl}
                  src={embedVideoUrl}
                  title="The Enagic emGuarde Presentation"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <PlayCircle className="h-4 w-4 text-cyan-400" /> Complete Enagic emGuarde™ Overview
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-cyan-400" /> {copy.watchTime}
              </span>
            </div>
          </div>
        </section>

        {/* ── 04: WHAT IS EMGUARDE? (EDITORIAL HERO PRODUCT OVERVIEW) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12] relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Editorial Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                  {copy.whatIs.eyebrow}
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {copy.whatIs.heading}
                </h2>

                <p className="text-base sm:text-lg text-cyan-300/90 font-medium">
                  {copy.whatIs.sub}
                </p>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {copy.whatIs.paragraph1}
                </p>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {copy.whatIs.paragraph2}
                </p>

                <div className="space-y-2.5 pt-2">
                  {copy.whatIs.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Authentic Product Showcase Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-[#0a101d] to-[#070b12] p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden group">
                  {/* Subtle Ambient Radial Glow */}
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-700" />

                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                      {copy.whatIs.badge}
                    </span>
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300">
                      US-12539416
                    </span>
                  </div>

                  {/* Clean Authentic Product Imagery */}
                  <div className="relative py-6 flex items-center justify-center">
                    <img
                      src="/products/emguarde-go.png"
                      alt="The Enagic emGuarde personal protection device set"
                      className="max-h-[300px] sm:max-h-[340px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,242,254,0.18)] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 text-center">
                    <p className="text-xs text-slate-400 italic">{copy.whatIs.caption}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04: WHY OUR ENVIRONMENTS HAVE CHANGED (ELECTROSMOG CONTEXT) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#090f1a] to-[#070b12]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                {copy.environmentShift.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {copy.environmentShift.heading}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                {copy.environmentShift.sub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {copy.environmentShift.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 space-y-4"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full inline-block">
                      {card.tag}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05: HOW THE TECHNOLOGY WORKS (PATENTED HARMONIC CIRCUITRY) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12] relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#0d1627] via-[#09101c] to-[#070b12] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              {/* Subtle Ambient Radial Lighting */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                    {copy.techStory.eyebrow}
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {copy.techStory.heading}
                  </h2>

                  <p className="text-sm sm:text-base text-cyan-300 font-medium">
                    {copy.techStory.sub}
                  </p>

                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                    <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      {copy.techStory.mechanismHeading}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {copy.techStory.mechanismBody}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 italic">
                    {copy.techStory.complianceNotice}
                  </p>
                </div>

                {/* Right Specs Table Card */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-4 backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Patent Identifier</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{copy.techStory.patentNumber}</span>
                    </div>

                    <div className="divide-y divide-white/10">
                      {copy.techStory.specsList.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="font-bold text-white text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06: 5 FEATURE PILLARS (RETAINED FROM ORIGINAL EMGUARDE) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#0a1220] to-[#070b12]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                {copy.pillarsBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">{copy.pillarsTitle}</h2>
              <p className="text-sm sm:text-base text-slate-300">{copy.pillarsSubtitle}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {copy.pillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={i}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400/30 transition-all duration-300 shadow-xl group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                          {pillar.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white">{pillar.title}</h3>
                      <p className="text-xs font-bold text-cyan-400 mt-1">{pillar.subtitle}</p>
                      <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">{pillar.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <p className="text-2xl font-black text-cyan-300">{pillar.stat}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{pillar.statLabel}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 07: REAL-LIFE ENVIRONMENTS (CINEMATIC LIFESTYLE COMPOSITE) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12] relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                {copy.environments.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {copy.environments.heading}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                {copy.environments.sub}
              </p>
            </div>

            {/* Cinematic 4-in-1 Lifestyle Composite Asset */}
            <div className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-black">
              <img
                src="/emguarde/emguarde-lifestyle-composite.jpg"
                alt="Enagic emGuarde real-life environments: workspace, car console, luggage travel, and pocket portability"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>

            {/* 4 Environment Explanatory Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {copy.environments.items.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 08: UTAR HUMAN CLINICAL VALIDATION (RETAINED VERIFIED DATA) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#09101d] to-[#070b12]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                {copy.clinicalBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">{copy.clinicalTitle}</h2>
              <p className="text-sm sm:text-base text-slate-300">{copy.clinicalSubtitle}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {copy.clinicalStudies.map((study, i) => {
                const Icon = study.icon
                return (
                  <div
                    key={i}
                    className={`rounded-3xl border bg-gradient-to-br ${study.color} p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-black tracking-widest uppercase">{study.change}</span>
                        </div>
                        <span className="text-4xl sm:text-5xl font-black tracking-tight">{study.metric}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white">{study.title}</h3>
                      <p className="text-xs font-bold opacity-80 mt-1">{study.subtitle}</p>
                      <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">{study.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 09: TECHNICAL SPECIFICATIONS & CERTIFICATIONS ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10 shadow-2xl">
              <div className="text-center mb-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                  {copy.specsBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{copy.specTitle}</h2>
                <p className="text-xs sm:text-sm text-slate-400">{copy.specSubtitle}</p>
              </div>

              <div className="divide-y divide-white/10">
                {copy.specs.map((spec, i) => (
                  <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">{spec.label}</span>
                    <span className="font-bold text-white sm:text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 11: THE TRUE LEGACY DUO CONNECTION (KANGEN + EMGUARDE) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-[#0a111f] to-blue-950/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-4">
                <Sparkles className="h-3.5 w-3.5" /> {copy.duoBadge}
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white max-w-2xl mx-auto leading-tight">
                {copy.duoTitle1} <br />
                <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  {copy.duoTitle2}
                </span>
              </h2>

              <p className="mt-4 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {copy.duoBody}
              </p>

              {/* Product Visual Duo Pairing */}
              <div className="mt-8 flex items-center justify-center gap-6 max-w-md mx-auto">
                <div className="flex-1 rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                  <img
                    src="/products/k8.png"
                    alt="Leveluk K8 Water Ionizer"
                    className="max-h-24 mx-auto object-contain drop-shadow-md"
                  />
                  <p className="mt-2 text-xs font-bold text-white">Leveluk K8</p>
                  <p className="text-[10px] text-slate-400">Internal Cellular Hydration</p>
                </div>
                <div className="text-xl font-black text-cyan-400">+</div>
                <div className="flex-1 rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                  <img
                    src="/products/emguarde-go.png"
                    alt="Enagic emGuarde GO"
                    className="max-h-24 mx-auto object-contain drop-shadow-md"
                  />
                  <p className="mt-2 text-xs font-bold text-white">emGuarde™</p>
                  <p className="text-[10px] text-slate-400">External Harmonization</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={duoUrl}
                  onClick={() => handleActionClick('duo_explore')}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-xs font-black text-slate-950 hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
                >
                  {copy.duoExploreBtn} <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={jotformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('duo_pricing')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-white transition-colors"
                >
                  {copy.duoPricingBtn}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12: FREQUENTLY ASKED QUESTIONS (ACCORDION COMPONENT) ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-[#070b12]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block">
                {copy.faqEyebrow}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                {copy.faqTitle}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                {copy.faqSubtitle}
              </p>
            </div>

            <div className="space-y-3">
              {copy.faqs.map((item, idx) => {
                const isOpen = openFaq === idx
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
                          animate={{ height: 'auto', opacity: 1 }}
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
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 13: DISTRIBUTOR GUIDANCE & PERSONAL CONSULTATION ── */}
        <section className="py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-[#070b12] via-[#09101d] to-[#070b12]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/15 bg-black/50 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                <img
                  src={leaderAvatar}
                  alt={distributorName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-xl shrink-0 bg-slate-900"
                />

                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 rounded-full inline-block">
                    {copy.guidance.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{distributorName}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{leaderTitle}</p>
                  <p className="text-xs sm:text-sm text-slate-300 pt-1 leading-relaxed">
                    {copy.guidance.sub}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-end gap-3">
                {personalWhatsAppUrl && (
                  <a
                    href={personalWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleActionClick('guidance_whatsapp')}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:scale-105 shadow-md shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp {distributorFirstName}</span>
                  </a>
                )}

                <a
                  href={jotformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('guidance_consultation')}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-6 py-3 text-sm font-bold text-cyan-300 transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>{copy.guidance.consultationAction}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 14: FINAL CONVERSION CALL TO ACTION ── */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#070b12] via-[#0c1524] to-[#070b12] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {copy.finalCta.heading}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
                {copy.finalCta.sub}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {hasPurchaseLink && (
                <a
                  href={directPurchaseUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('final_buy_now')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-8 py-4 text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/25"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{copy.nav.buyNow}</span>
                </a>
              )}

              {personalWhatsAppUrl ? (
                <a
                  href={personalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick('final_whatsapp')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-7 py-4 text-base transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>WhatsApp {distributorFirstName}</span>
                </a>
              ) : (
                <Link
                  to={distributorProfileRoute}
                  onClick={() => handleActionClick('final_contact_leader')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-7 py-4 text-base transition-all duration-300 hover:scale-105"
                >
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span>{copy.nav.contactDistributor}</span>
                </Link>
              )}

              <a
                href={jotformUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick('final_get_pricing')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-8 py-4 text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-cyan-500/25"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>{copy.finalCta.primary}</span>
              </a>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              {copy.finalCta.redirectNotice}
            </p>
          </div>
        </section>

        {/* ── 15: TRUST & LEGAL COMPLIANCE FOOTER DISCLOSURES ── */}
        <footer className="py-12 border-t border-white/10 bg-[#04070d] text-slate-400 text-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3 leading-relaxed">
              <p>{copy.legal.compliance}</p>
              <p>{copy.legal.distributor}</p>
              <p>{copy.legal.disclaimer}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-white">TRUE LEGACY WORLD</span>
                <span>© {new Date().getFullYear()} All Rights Reserved.</span>
              </div>
              <div className="flex items-center gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Compliance & Disclaimers
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
export default EmguardeLandingPage
