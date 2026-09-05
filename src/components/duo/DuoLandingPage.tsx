import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  Droplets,
  Radio,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Play,
  MessageCircle,
  Calendar,
  ChevronDown,
  Layers,
  Zap,
  Globe,
  Sun,
  Moon,
  Laptop,
  Car,
  ShoppingCart,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { getProductPurchaseLink } from '@/config/productPurchaseLinks'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { localizedProductVideo } from '@/lib/productVideos'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { ProductStage } from '@/components/duo/ProductStage'
import { DuoPurchaseModal } from '@/components/duo/DuoPurchaseModal'
import { crmSupabase, getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'
import { trackEvent } from '@/lib/analytics'

interface DuoLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

const LEADER_PORTRAITS: Record<string, string> = {
  'mehdi-cohen': '/leaders/standardized/mehdi-cohen.png',
  'simon-loh': '/leaders/standardized/simon-loh-v2.png',
  'ming-way-sia': '/leaders/standardized/ming-way-sia.png',
  'dr-ed-vance': '/leaders/standardized/dr-ed-vance.png',
  'andrea-freschi': '/leaders/standardized/andrea-freschi.png',
  'elias-cohen': '/leaders/standardized/elias-cohen.png',
  'valery-schwarz': '/leaders/standardized/valery-schwarz.png',
  'nassim-habib': '/leaders/standardized/nassim-habib.png',
  'nour-el-bouhali': '/leaders/standardized/nour-el-bouhali.png',
  'adam-habib': '/leaders/standardized/adam-habib.png',
  'farah-el-kadiri': '/leaders/standardized/farah-el-kadiri.png',
  'ismail-el-bouhali': '/leaders/standardized/ismail-el-bouhali.png',
  'soufiane-el-bouhali': '/leaders/standardized/soufiane-el-bouhali.png',
  'mehdi-d': '/leaders/standardized/mehdi-d.png',
  'elias-d': '/leaders/standardized/elias-d.png',
  'dany-d': '/leaders/standardized/dany-d.png',
}

const I18N = {
  en: {
    badge: 'THE TRUE LEGACY DUO',
    headline: 'YOUR WATER. YOUR ENVIRONMENT. ONE CONNECTED LIFESTYLE.',
    heroSub:
      'Discover two distinct Enagic technologies brought together in one modern lifestyle experience: Kangen Water® for the water you use every day and emGuarde® for the environment around you.',
    exploreDuoBtn: 'EXPLORE THE DUO',
    watchStoryBtn: 'WATCH THE STORY',
    buyDuoBtn: 'ORDER THE DUO',
    buyKangenBtn: 'BUY KANGEN',
    buyEmguardeBtn: 'BUY EMGUARDE',
    askAboutOrdering: 'ASK ABOUT ORDERING',
    talkWith: 'Talk with',
    sharedBy: 'Shared personally with you by',
    verifiedGuide: 'Verified Guide',
    verifiedLeader: 'VERIFIED LEADER',

    trustHighlights: [
      { label: 'Japanese Engineering', sub: '50-Year Heritage' },
      { label: '8 Solid Platinum Plates', sub: 'Electrolyzed Water' },
      { label: '3-Meter Radius', sub: 'Harmonized Ambient Space' },
      { label: 'Portable Dual Set', sub: 'USB-C Rechargeable' },
    ],

    // Section 03: The Duo Equation
    equationEyebrow: 'THE DUO EQUATION',
    equationHeading: 'TWO TECHNOLOGIES. TWO PARTS OF EVERYDAY LIFE.',
    equationSub:
      'One focuses on the water you consume and use across your home. The other focuses on the ambient electromagnetic environment surrounding your living and work spaces.',
    waterCardTag: '01 · YOUR WATER',
    waterCardTitle: 'KANGEN WATER®',
    waterCardDesc:
      'Transforms standard tap water using 8 solid platinum-dipped titanium plates into 5 distinct water outputs for cellular hydration, cooking, beauty, and non-toxic household cleaning.',
    waterCardCta: 'EXPLORE KANGEN →',
    envCardTag: '02 · YOUR ENVIRONMENT',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'A portable dual-unit system utilizing patented harmonic resonance to suppress high-frequency electromagnetic noise across a 3-meter spherical radius without interrupting cellular or Wi-Fi connectivity.',
    envCardCta: 'EXPLORE emGuarde →',
    duoBadge: 'THE TRUE LEGACY DUO',
    duoBadgeSub: 'Two Distinct Technologies · One Connected Lifestyle',

    // Section 04: Day in the Life
    dayHeading: 'FROM MORNING TO NIGHT.',
    daySub: 'Experience how the Duo seamlessly integrates into everyday family routines from sunrise to rest.',
    dayCards: [
      {
        time: '07:00 AM',
        period: 'MORNING RITUAL',
        title: 'Fresh Cellular Hydration',
        desc: 'Start your day with high-antioxidant, negative ORP drinking water freshly produced at pH 9.5.',
        badge: 'Kitchen · Hydration',
        icon: Sun,
      },
      {
        time: '11:00 AM',
        period: 'FOCUSED WORK',
        title: 'Calm Work Environment',
        desc: 'emGuarde GO harmonizes surrounding electromagnetic fields beside your workstation, laptops, and multiple displays.',
        badge: 'Office · Focus',
        icon: Laptop,
      },
      {
        time: '03:30 PM',
        period: 'ON THE MOVE',
        title: 'Portable Lifestyle',
        desc: 'Take your USB-C rechargeable emGuarde set into client meetings, coffee shops, and travel environments.',
        badge: 'Travel · Mobility',
        icon: Car,
      },
      {
        time: '08:00 PM',
        period: 'EVENING REST',
        title: 'Home Tranquility',
        desc: 'Prepare evening meals with Kangen water and unwind in an environment free of ambient electronic noise.',
        badge: 'Home · Evening',
        icon: Moon,
      },
    ],

    // Section 05: Kangen Story
    kangenHeading: 'IT STARTS WITH YOUR WATER.',
    kangenSub:
      'Water is the single most vital component of your daily physical existence. The Leveluk K8 elevates ordinary tap water into an energized, high-performance foundation for your entire household.',
    kangenFeatures: [
      {
        title: '8 Solid Titanium Plates',
        desc: 'Medical-grade platinum-dipped titanium electrode plates engineered for continuous electrolysis and long-term durability.',
      },
      {
        title: '5 Distinct Water Settings',
        desc: 'Produces antioxidant drinking water (pH 8.5–9.5), neutral medication/formula water (pH 7.0), beauty skin toner (pH 6.0), produce wash (pH 11.5), and strong sanitizer (pH 2.5).',
      },
      {
        title: 'Continuous On-Demand Flow',
        desc: 'Generates up to 6 liters per minute directly from your faucet without bottles, cartridges, or waiting.',
      },
      {
        title: '50-Year Japanese Craftsmanship',
        desc: 'Manufactured by Enagic in Osaka, Japan under strict ISO 13485 medical device manufacturing standards.',
      },
    ],
    exploreKangenBtn: 'EXPLORE KANGEN',

    // Section 06: Transition
    transitionLine1: 'From the water that nourishes your body from within —',
    transitionLine2: 'to the technological environment that surrounds your space from without.',

    // Section 07: emGuarde Story
    emguardeHeading: 'NOW LOOK AT THE ENVIRONMENT AROUND YOU.',
    emguardeSub:
      'Smart homes, 5G cellular arrays, high-speed Wi-Fi 6 routers, and connected devices surround modern life. emGuarde brings environmental coherence to your personal space without disrupting your connectivity.',
    emguardeFeatures: [
      {
        title: 'Patented Harmonic Resonance',
        desc: 'Utilizes proprietary frequency suppression to balance high-frequency environmental electronic noise without blocking phone, Bluetooth, or wireless signals.',
      },
      {
        title: '3-Meter Spherical Coverage',
        desc: 'Projects a 3-meter (10-foot) diameter zone of environmental coherence around desks, bedrooms, and lounges.',
      },
      {
        title: 'Dual-Unit Synchronized Set',
        desc: 'Includes two identical harmonizers to establish dual-zone coverage across home, office, and travel.',
      },
      {
        title: 'USB-C Rechargeable Mobility',
        desc: 'Built-in high-capacity batteries provide up to 72 hours of cordless operation on a single USB-C charge.',
      },
    ],
    emguardeDisclaimer:
      'Regulatory Notice: emGuarde GO is an ambient environmental harmonization device. It does not claim to diagnose, treat, cure, or prevent any medical condition, nor does it block cellular or Wi-Fi communication.',
    exploreEmguardeBtn: 'EXPLORE emGuarde',

    // Section 08: Why the Duo
    whyDuoHeading: 'WHY TOGETHER?',
    whyDuoSub: 'Two distinct technologies. One deliberate lifestyle decision.',
    whyDuoKangenRole: 'A conversation about the water you use, drink, and prepare food with.',
    whyDuoEmguardeRole: 'A conversation about the ambient electromagnetic environment surrounding your work and rest.',
    whyDuoTogether:
      'Together, they address the fundamental inputs of modern living: what you put into your body, and what surrounds your physical space.',

    // Section 09: Comparison Matrix
    matrixHeading: 'TWO TECHNOLOGIES. ONE COMPLETE EQUATION.',
    matrixSub: 'Understand each technology and see how they complement your everyday living environments.',
    matrixHeaders: ['Category', 'Primary Environment', 'Core Daily Role', 'Hardware Specs', 'Best Suited For'],
    matrixKangen: {
      name: 'KANGEN WATER®',
      cat: 'Electrolyzed Water Ionizer',
      env: 'Kitchen & Home Countertop',
      role: 'Internal Cellular Hydration & Home Care',
      hw: 'Leveluk K8 (8 Platinum Plates)',
      best: 'Families seeking antioxidant drinking water and chemical-free home cleaning',
    },
    matrixEmguarde: {
      name: 'emGuarde®',
      cat: 'Ambient Harmonic Suppressor',
      env: 'Desks, Bedrooms, Travel & Living Spaces',
      role: 'Environmental Electronic Noise Coherence',
      hw: 'emGuarde GO (Dual-Unit Set)',
      best: 'Individuals surrounded by multiple screens, wireless routers, and modern devices',
    },
    matrixDuo: {
      name: 'THE TRUE LEGACY DUO',
      cat: 'Unified 2-Pillar Lifestyle System',
      env: 'Complete Living: Home, Work, and Travel',
      role: 'Comprehensive Internal & External Care',
      hw: 'Leveluk K8 + emGuarde GO Dual Set',
      best: 'Homes seeking absolute balance in cellular hydration and environmental calm',
    },

    // Section 10: Meet the Duo Showcase
    showcaseHeading: 'MEET THE DUO.',
    showcaseSub: 'Explore each technology side-by-side with verified physical specifications and direct ordering pathways.',
    k8ShowcaseTitle: 'Leveluk K8® Flagship Ionizer',
    k8ShowcaseDesc: 'Enagic’s premier 8-plate water ionizer. Multi-voltage worldwide power, full touchscreen controls, and 5 distinct water settings.',
    emguardeShowcaseTitle: 'emGuarde® GO Frequency Set',
    emguardeShowcaseDesc: 'Dual-unit portable ambient electromagnetic harmonizers. 3-meter radius coverage with up to 72 hours of USB-C battery life.',

    // Section 11: Video Showcase
    videoHeading: 'SEE THE DUO IN ACTION.',
    videoSub: 'Watch the video presentations for both technologies and explore how they integrate into everyday routines.',
    videoTabK8: 'Leveluk K8 Demo (~4 min)',
    videoTabEmguarde: 'emGuarde GO Overview (~8 min)',
    videoK8Title: 'Leveluk K8® Water Ionizer Demonstration',
    videoK8Desc: 'Explore active molecular hydrogen hydration, negative ORP antioxidant power, and 5 continuous water settings with Japanese medical-grade craftsmanship.',
    videoEmguardeTitle: 'emGuarde® GO Technology Overview',
    videoEmguardeDesc: 'Discover how patented harmonic resonance suppresses ambient electromagnetic noise across a 3-meter radius without interrupting wireless connectivity.',

    // Section 12: Explore Individually
    exploreIndHeading: 'GO DEEPER.',
    exploreIndSub: 'Want to focus on one technology first? Take an in-depth tour through either dedicated experience.',
    exploreIndK8Cta: 'EXPLORE KANGEN',
    exploreIndEmguardeCta: 'EXPLORE emGuarde',

    // Section 13: Distributor Guidance
    guidanceHeading: 'NOT SURE WHERE TO START?',
    guidanceSub:
      'Connect directly with your verified guide to discuss regional market availability, shipping, installation, and custom recommendations for your space.',
    messageWhatsApp: 'Message on WhatsApp',
    requestInfo: 'Request Information',
    bookCall: 'Book a Call',

    // Section 14: FAQ
    faqHeading: 'FREQUENTLY ASKED QUESTIONS',
    faqs: [
      {
        q: 'What is the True Legacy Duo?',
        a: 'The True Legacy Duo brings together two distinct technologies: the Enagic Leveluk K8 water ionizer for your internal cellular hydration and home water needs, and the emGuarde GO portable harmonizer set for your ambient electromagnetic living environment.',
      },
      {
        q: 'What is Kangen Water®?',
        a: 'Kangen Water is electrolyzed hydrogen-rich drinking water produced by Enagic water ionizers. The process infuses tap water with active molecular hydrogen (H₂) and creates a negative oxidation-reduction potential (ORP) while generating 5 distinct water settings ranging from pH 2.5 to pH 11.5.',
      },
      {
        q: 'What is emGuarde®?',
        a: 'emGuarde GO is a portable dual-unit environmental harmonization system that uses patented harmonic resonance to suppress high-frequency electromagnetic noise within a 3-meter radius without interfering with Wi-Fi, Bluetooth, or phone connectivity.',
      },
      {
        q: 'Are they the same technology?',
        a: 'No. They are two entirely different technologies addressing two different dimensions of wellness. Kangen Water is a countertop water electrolysis appliance, while emGuarde is an ambient electromagnetic frequency harmonizer.',
      },
      {
        q: 'Can I purchase them separately?',
        a: 'Yes, absolutely. The Leveluk K8 and the emGuarde GO set can be ordered individually or together as a complete lifestyle package depending on your personal needs.',
      },
      {
        q: 'Can I purchase both together?',
        a: 'Yes. You can order both technologies through your distributor. If your distributor has both links or a package checkout configured, you can complete your Duo directly from this page.',
      },
      {
        q: 'How does ordering work?',
        a: 'Orders are fulfilled through Enagic’s official global branches and distribution network. You can order directly via your distributor’s verified checkout links or connect with your guide for assisted ordering and invoice delivery.',
      },
      {
        q: 'Where are the products available?',
        a: 'Enagic delivers to over 150 countries worldwide through regional offices in North America, Europe, Asia, Latin America, and Australia. Specific voltage models and local delivery times vary by market.',
      },
      {
        q: 'Can I speak with a distributor before ordering?',
        a: 'Yes, we encourage it! Your dedicated True Legacy distributor is available via WhatsApp, phone, or scheduled consultation to answer installation, pricing, and regional shipping questions.',
      },
    ],

    // Section 15: Final CTA
    finalHeading: 'YOUR WATER. YOUR ENVIRONMENT. YOUR NEXT STEP.',
    finalSub: 'Two distinct technologies created for two fundamental dimensions of modern life.',
    finalPrimaryCta: 'EXPLORE THE DUO',
    finalSecondaryCta: 'TALK WITH',
    finalTrust: 'Direct Distributor Attribution · Official Manufacturer Warranty · Global Delivery',
  },

  es: {
    badge: 'EL DÚO TRUE LEGACY',
    headline: 'TU AGUA. TU AMBIENTE. UN ESTILO DE VIDA CONECTADO.',
    heroSub:
      'Descubre dos tecnologías distintas de Enagic reunidas en una experiencia de vida moderna: Agua Kangen® para el agua que usas a diario y emGuarde® para el entorno que te rodea.',
    exploreDuoBtn: 'EXPLORAR EL DÚO',
    watchStoryBtn: 'VER LA HISTORIA',
    buyDuoBtn: 'ORDENAR EL DÚO',
    buyKangenBtn: 'COMPRAR KANGEN',
    buyEmguardeBtn: 'COMPRAR EMGUARDE',
    askAboutOrdering: 'CONSULTAR PEDIDO',
    talkWith: 'Hablar con',
    sharedBy: 'Compartido personalmente contigo por',
    verifiedGuide: 'Guía Verificado',
    verifiedLeader: 'LÍDER VERIFICADO',

    trustHighlights: [
      { label: 'Ingeniería Japonesa', sub: '50 Años de Tradición' },
      { label: '8 Placas de Platino', sub: 'Agua Electrolizada' },
      { label: 'Radio de 3 Metros', sub: 'Espacio Armonizado' },
      { label: 'Set Dual Portátil', sub: 'Batería USB-C' },
    ],

    equationEyebrow: 'LA ECUACIÓN DEL DÚO',
    equationHeading: 'DOS TECNOLOGÍAS. DOS PARTES DEL DÍA A DÍA.',
    equationSub:
      'Una cuida el agua que consumes en tu hogar. La otra armoniza el entorno electromagnético alrededor de tus espacios de vida y trabajo.',
    waterCardTag: '01 · TU AGUA',
    waterCardTitle: 'AGUA KANGEN®',
    waterCardDesc:
      'Transforma el agua de grifo mediante 8 placas de titanio bañadas en platino en 5 tipos de agua para hidratación celular, cocina, cuidado de la piel y limpieza sin químicos.',
    waterCardCta: 'EXPLORAR KANGEN →',
    envCardTag: '02 · TU AMBIENTE',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'Sistema portátil de dos unidades que utiliza resonancia armónica patentada para atenuar ruidos electromagnéticos en un radio esférico de 3 metros sin interrumpir tu Wi-Fi ni señal celular.',
    envCardCta: 'EXPLORAR emGuarde →',
    duoBadge: 'EL DÚO TRUE LEGACY',
    duoBadgeSub: 'Dos Tecnologías Distintas · Un Estilo de Vida Consciente',

    dayHeading: 'DE LA MAÑANA A LA NOCHE.',
    daySub: 'Observa cómo el Dúo se integra en la rutina diaria de tu familia, desde el amanecer hasta el descanso.',
    dayCards: [
      {
        time: '07:00 AM',
        period: 'RITUAL MATUTINO',
        title: 'Hidratación Celular Pura',
        desc: 'Inicia el día con agua antioxidante con ORP negativo recién ionizada a pH 9.5.',
        badge: 'Cocina · Hidratación',
        icon: Sun,
      },
      {
        time: '11:00 AM',
        period: 'ENFOQUE LABORAL',
        title: 'Ambiente sin Ruido Electrónico',
        desc: 'emGuarde GO armoniza los campos electromagnéticos junto a tu estación de trabajo y pantallas.',
        badge: 'Oficina · Claridad',
        icon: Laptop,
      },
      {
        time: '03:30 PM',
        period: 'EN MOVIMIENTO',
        title: 'Estilo de Vida Portátil',
        desc: 'Lleva tu set recargable USB-C a reuniones, cafeterías y viajes con total libertad.',
        badge: 'Viajes · Movilidad',
        icon: Car,
      },
      {
        time: '08:00 PM',
        period: 'DESCANSO NOCTURNO',
        title: 'Tranquilidad en el Hogar',
        desc: 'Prepara la cena con Agua Kangen y descansa en un entorno libre de ruidos ambientales.',
        badge: 'Hogar · Serenidad',
        icon: Moon,
      },
    ],

    kangenHeading: 'TODO COMIENZA CON TU AGUA.',
    kangenSub:
      'El agua es el pilar fundamental del organismo humano. El Leveluk K8 transforma el agua de grifo común en una base antioxidante de alto rendimiento para toda la familia.',
    kangenFeatures: [
      {
        title: '8 Placas Sólidas de Titanio',
        desc: 'Placas de titanio grado médico bañadas en platino diseñadas para electrólisis continua y larga duración.',
      },
      {
        title: '5 Tipos de Agua pH',
        desc: 'Agua para beber rica en antioxidantes (pH 8.5–9.5), agua neutra (pH 7.0), agua de belleza (pH 6.0), lavado de vegetales (pH 11.5) y desinfectante (pH 2.5).',
      },
      {
        title: 'Flujo Continuo al Instante',
        desc: 'Genera hasta 6 litros por minuto directamente del grifo sin depender de botellas de plástico.',
      },
      {
        title: '50 Años de Tradición Japonesa',
        desc: 'Fabricado por Enagic en Osaka, Japón, bajo rigurosos estándares ISO 13485 de dispositivos médicos.',
      },
    ],
    exploreKangenBtn: 'EXPLORAR AGUA KANGEN',

    transitionLine1: 'Del agua que nutre tu cuerpo por dentro —',
    transitionLine2: 'al entorno tecnológico que rodea tus espacios por fuera.',

    emguardeHeading: 'AHORA OBSERVA EL AMBIENTE QUE TE RODEA.',
    emguardeSub:
      'Casas inteligentes, redes 5G, enrutadores Wi-Fi 6 y múltiples pantallas rodean nuestra rutina. emGuarde aporta coherencia ambiental a tus espacios sin desconectarte.',
    emguardeFeatures: [
      {
        title: 'Resonancia Armónica Patentada',
        desc: 'Atenúa el ruido electromagnético de alta frecuencia sin interferir con señales de teléfono, Bluetooth o Wi-Fi.',
      },
      {
        title: 'Cobertura Esférica de 3 Metros',
        desc: 'Genera un radio de 3 metros (10 pies) de armonía en escritorios, dormitorios y salas.',
      },
      {
        title: 'Set Sincronizado de 2 Unidades',
        desc: 'Incluye dos dispositivos portátiles para crear cobertura dual en el hogar, la oficina y tus viajes.',
      },
      {
        title: 'Batería USB-C de Larga Duración',
        desc: 'Hasta 72 horas de uso inalámbrico continuo con una sola recarga mediante cable USB-C estándar.',
      },
    ],
    emguardeDisclaimer:
      'Aviso Regulatorio: emGuarde GO es un dispositivo de armonización ambiental. No está diseñado para diagnosticar, tratar, curar ni prevenir enfermedades, ni bloquea las comunicaciones inalámbricas.',
    exploreEmguardeBtn: 'EXPLORAR emGuarde',

    whyDuoHeading: '¿POR QUÉ JUNTOS?',
    whyDuoSub: 'Dos tecnologías diferentes. Una decisión consciente de vida.',
    whyDuoKangenRole: 'Una conversación sobre el agua que bebes, cocinas y utilizas en tu hogar.',
    whyDuoEmguardeRole: 'Una conversación sobre el entorno electromagnético que rodea tu trabajo y descanso.',
    whyDuoTogether:
      'Juntos, abordan las dos dimensiones básicas de la vida moderna: lo que ingresa a tu cuerpo y lo que rodea tu espacio físico.',

    matrixHeading: 'DOS TECNOLOGÍAS. UNA ECUACIÓN COMPLETA.',
    matrixSub: 'Comprende cada tecnología y descubre cómo complementan tu día a día.',
    matrixHeaders: ['Categoría', 'Ambiente Principal', 'Rol Diario', 'Especificaciones', 'Ideal Para'],
    matrixKangen: {
      name: 'AGUA KANGEN®',
      cat: 'Ionizador Médico de Agua',
      env: 'Cocina y Hogar',
      role: 'Hidratación Celular y Cocina',
      hw: 'Leveluk K8 (8 Placas de Platino)',
      best: 'Familias que buscan agua antioxidante y limpieza sin químicos tóxicos',
    },
    matrixEmguarde: {
      name: 'emGuarde®',
      cat: 'Armonizador Ambiental',
      env: 'Escritorios, Dormitorios y Viajes',
      role: 'Coherencia ante Ruido Electrónico',
      hw: 'emGuarde GO (Set de 2 Unidades)',
      best: 'Personas rodeadas de múltiples pantallas, routers y dispositivos móviles',
    },
    matrixDuo: {
      name: 'EL DÚO TRUE LEGACY',
      cat: 'Sistema Integral de 2 Pilares',
      env: 'Vida Completa: Hogar, Trabajo y Viajes',
      role: 'Cuidado Integral Interno y Externo',
      hw: 'K8 + Set emGuarde GO',
      best: 'Hogares que buscan equilibrio absoluto en hidratación y serenidad ambiental',
    },

    showcaseHeading: 'CONOCE EL DÚO.',
    showcaseSub: 'Explora cada tecnología lado a lado con especificaciones físicas verificadas y rutas de compra directas.',
    k8ShowcaseTitle: 'Leveluk K8® Ionizador Insignia',
    k8ShowcaseDesc: 'El ionizador insignia de 8 placas de Enagic. Multivoltaje mundial, pantalla táctil completa y 5 tipos de agua bajo demanda.',
    emguardeShowcaseTitle: 'emGuarde® GO Set de Frecuencia',
    emguardeShowcaseDesc: 'Set de 2 armonizadores electromagnéticos portátiles. Cobertura de 3 metros de radio con hasta 72 horas de batería USB-C.',

    videoHeading: 'EL DÚO EN ACCIÓN.',
    videoSub: 'Mira las presentaciones en video de ambas tecnologías y comprende su integración en la vida diaria.',
    videoTabK8: 'Demostración Leveluk K8 (~4 min)',
    videoTabEmguarde: 'Presentación emGuarde GO (~8 min)',
    videoK8Title: 'Demostración de Agua Leveluk K8®',
    videoK8Desc: 'Descubre la infusión activa de hidrógeno molecular, el potencial antioxidante de ORP negativo y los 5 tipos de agua médica japonesa.',
    videoEmguardeTitle: 'Presentación de Tecnología emGuarde® GO',
    videoEmguardeDesc: 'Conoce cómo la resonancia armónica de 3 metros atenúa el ruido electromagnético ambiental sin interferir con señales Wi-Fi o celulares.',

    exploreIndHeading: 'CONOCE MÁS A FONDO.',
    exploreIndSub: '¿Prefieres explorar una tecnología primero? Descubre la experiencia completa de cada una.',
    exploreIndK8Cta: 'EXPLORAR KANGEN',
    exploreIndEmguardeCta: 'EXPLORAR emGuarde',

    guidanceHeading: '¿NO SABES POR DÓNDE EMPEZAR?',
    guidanceSub:
      'Conversa directamente con tu guía verificado sobre disponibilidad, envíos regionales, instalación y opciones recomendadas para tu hogar.',
    messageWhatsApp: 'Enviar Mensaje en WhatsApp',
    requestInfo: 'Solicitar Información',
    bookCall: 'Agendar una Llamada',

    faqHeading: 'PREGUNTAS FRECUENTES',
    faqs: [
      {
        q: '¿Qué es el Dúo True Legacy?',
        a: 'El Dúo une dos tecnologías distintas: el ionizador de agua Enagic Leveluk K8 para tu hidratación celular interna, y el set de armonización portátil emGuarde GO para tu entorno electromagnético.',
      },
      {
        q: '¿Qué es Agua Kangen®?',
        a: 'Es agua potable electrolizada rica en hidrógeno molecular activo producida por ionizadores Enagic, con ORP negativo y 5 ajustes de pH desde 2.5 hasta 11.5.',
      },
      {
        q: '¿Qué es emGuarde®?',
        a: 'Es un sistema portátil de dos unidades que utiliza resonancia armónica para atenuar ruidos electromagnéticos en un radio esférico de 3 metros sin interrumpir Wi-Fi ni llamadas.',
      },
      {
        q: '¿Son la misma tecnología?',
        a: 'No. Son dos tecnologías independientes. Kangen procesa agua de grifo mediante electrólisis. emGuarde armoniza frecuencias en el ambiente físico.',
      },
      {
        q: '¿Puedo adquirirlos por separado?',
        a: 'Sí, por supuesto. Puedes ordenar el Leveluk K8 o el set emGuarde GO de forma individual según tus prioridades.',
      },
      {
        q: '¿Puedo comprar ambos juntos?',
        a: 'Sí. Puedes solicitar ambos productos a través del enlace de compra de tu distribuidor verificado en esta página.',
      },
      {
        q: '¿Cómo funciona el proceso de orden?',
        a: 'Las órdenes se procesan directamente con Enagic oficial y sus oficinas regionales en más de 150 países con garantía de fábrica y entrega a domicilio.',
      },
      {
        q: '¿En qué países está disponible?',
        a: 'Enagic tiene oficinas oficiales en América del Norte, Europa, América Latina, Asia y Oceanía. Los voltajes y tiempos de entrega varían según el país.',
      },
      {
        q: '¿Puedo hablar con un distribuidor antes de ordenar?',
        a: '¡Totalmente! Tu distribuidor asignado está disponible vía WhatsApp o videollamada para orientarte con precios locales e instalación.',
      },
    ],

    finalHeading: 'TU AGUA. TU AMBIENTE. TU SIGUIENTE PASO.',
    finalSub: 'Dos tecnologías distintas diseñadas para dos dimensiones esenciales de la vida moderna.',
    finalPrimaryCta: 'EXPLORAR EL DÚO',
    finalSecondaryCta: 'HABLAR CON',
    finalTrust: 'Atribución Directa de Distribuidor · Garantía Oficial de Fábrica · Soporte Global',
  },

  fr: {
    badge: 'LE DUO TRUE LEGACY',
    headline: 'VOTRE EAU. VOTRE ENVIRONNEMENT. UN QUOTIDIEN CONNECTÉ.',
    heroSub:
      'Découvrez deux technologies Enagic distinctes réunies dans une expérience de vie moderne : l’Eau Kangen® pour l’eau de tous les jours et emGuarde® pour votre espace ambiant.',
    exploreDuoBtn: 'EXPLORER LE DUO',
    watchStoryBtn: 'VOIR LA VIDÉO',
    buyDuoBtn: 'COMMANDER LE DUO',
    buyKangenBtn: 'ACHETER KANGEN',
    buyEmguardeBtn: 'ACHETER EMGUARDE',
    askAboutOrdering: 'DEMANDER UN DEVIS',
    talkWith: 'Échanger avec',
    sharedBy: 'Partagé personnellement avec vous par',
    verifiedGuide: 'Guide Certifié',
    verifiedLeader: 'LEADER CERTIFIÉ',

    trustHighlights: [
      { label: 'Ingénierie Japonaise', sub: '50 Ans d’Excellence' },
      { label: '8 Plaques de Platine', sub: 'Eau Électrolysée' },
      { label: 'Rayon de 3 Mètres', sub: 'Espace Harmonisé' },
      { label: 'Set Dual Portatif', sub: 'Recharge USB-C' },
    ],

    equationEyebrow: 'L’ÉQUATION DU DUO',
    equationHeading: 'DEUX TECHNOLOGIES. DEUX FACETTES DU QUOTIDIEN.',
    equationSub:
      'L’une veille sur l’eau consommée au quotidien. L’autre harmonise l’environnement électromagnétique de vos pièces à vivre et de travail.',
    waterCardTag: '01 · VOTRE EAU',
    waterCardTitle: 'EAU KANGEN®',
    waterCardDesc:
      'Transforme l’eau du robinet grâce à 8 plaques en titane trempées de platine en 5 types d’eau pour l’hydratation cellulaire, la cuisine et le soin sans produits toxiques.',
    waterCardCta: 'EXPLORER KANGEN →',
    envCardTag: '02 · VOTRE ENVIRONNEMENT',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'Système portatif à double appareil utilisant une résonance harmonique brevetée pour atténuer les bruits électromagnétiques sur un rayon de 3 mètres sans impacter le Wi-Fi ni le réseau mobile.',
    envCardCta: 'EXPLORER emGuarde →',
    duoBadge: 'LE DUO TRUE LEGACY',
    duoBadgeSub: 'Deux Technologies Distinctes · Un Mode de Vie Harmonieux',

    dayHeading: 'DU MATIN JUSQU’AU SOIR.',
    daySub: 'Découvrez comment le Duo s’intègre naturellement dans votre journée, du réveil au repos du soir.',
    dayCards: [
      { time: '07:00', period: 'RITUEL DU MATIN', title: 'Hydratation Cellulaire', desc: 'Commencez la journée avec une eau alcaline et antioxydante ionisée à pH 9.5.', badge: 'Cuisine · Eau', icon: Sun },
      { time: '11:00', period: 'FOCUS AU TRAVAIL', title: 'Espace de Travail Apaisé', desc: 'emGuarde GO harmonise votre bureau entouré d’écrans et de routeurs.', badge: 'Bureau · Clarté', icon: Laptop },
      { time: '15:30', period: 'EN DÉPLACEMENT', title: 'Mobilité Totale', desc: 'Emportez vos appareils légers et rechargeables en voyage ou rendez-vous.', badge: 'Nomade · Léger', icon: Car },
      { time: '20:00', period: 'SOIRÉE SEREINE', title: 'Harmonie à la Maison', desc: 'Cuisinez des produits frais avec l’Eau Kangen et détendez-vous dans une ambiance apaisée.', badge: 'Maison · Repos', icon: Moon },
    ],

    kangenHeading: 'TOUT COMMENCE PAR VOTRE EAU.',
    kangenSub:
      'L’eau représente le socle absolu du bien-être quotidien. Le Leveluk K8 transforme l’eau ordinaire en une ressource revitalisante pour toute la maison.',
    kangenFeatures: [
      { title: '8 Plaques en Titane et Platine', desc: 'Plaques massives de qualité médicale conçues pour une électrolyse continue et durable.' },
      { title: '5 Niveaux de pH Spécifiques', desc: 'Pour la boisson (8.5–9.5), la cuisine, le soin de la peau (6.0) et l’hygiène ménagère.' },
      { title: 'Production Immédiate au Robinet', desc: 'Jusqu’à 6 litres par minute en direct sans dépendre de bouteilles plastiques jetables.' },
      { title: '50 Ans de Précision Japonaise', desc: 'Fabriqué à Osaka par Enagic selon les standards stricts ISO 13485.' },
    ],
    exploreKangenBtn: 'EXPLORER L’EAU KANGEN',

    transitionLine1: 'De l’eau qui nourrit votre corps de l’intérieur —',
    transitionLine2: 'à l’environnement technologique qui entoure votre espace de l’extérieur.',

    emguardeHeading: 'OBSERVEZ MAINTENANT L’ENVIRONNEMENT AUTOUR DE VOUS.',
    emguardeSub:
      'Écrans, réseaux 5G et bornes Wi-Fi sont omniprésents. emGuarde installe une cohérence ambiante dans votre espace sans jamais couper vos connexions.',
    emguardeFeatures: [
      { title: 'Résonance Harmonique Brevetée', desc: 'Supprime les perturbations haute fréquence sans affaiblir les réseaux cellulaires ou Wi-Fi.' },
      { title: 'Rayon de 3 Mètres', desc: 'Installe une bulle sphérique de cohérence sur votre espace de vie et de travail.' },
      { title: 'Set Double Synchronisé', desc: 'Deux unités identiques pour couvrir la chambre, le bureau et vos déplacements.' },
      { title: 'Recharge Rapide USB-C', desc: 'Jusqu’à 72 heures d’autonomie sur batterie pour une liberté complète.' },
    ],
    emguardeDisclaimer:
      'Avis Réglementaire : emGuarde GO est un dispositif d’harmonisation ambiante et n’a pas vocation à diagnostiquer, traiter ou guérir une maladie.',
    exploreEmguardeBtn: 'EXPLORER emGuarde',

    whyDuoHeading: 'POURQUOI ENSEMBLE ?',
    whyDuoSub: 'Deux technologies différentes. Un choix de vie conscient.',
    whyDuoKangenRole: 'Pour l’eau que vous buvez et préparez au quotidien.',
    whyDuoEmguardeRole: 'Pour l’environnement électromagnétique qui entoure votre travail et votre sommeil.',
    whyDuoTogether: 'Ensemble, ils veillent sur vos deux dimensions essentielles : interne et externe.',

    matrixHeading: 'DEUX TECHNOLOGIES. UNE ÉQUATION COMPLÈTE.',
    matrixSub: 'Comprenez chaque technologie et découvrez pourquoi le Duo forme l’équilibre absolu.',
    matrixHeaders: ['Catégorie', 'Environnement', 'Rôle Quotidien', 'Matériel', 'Idéal Pour'],
    matrixKangen: { name: 'EAU KANGEN®', cat: 'Ioniseur d’Eau Médical', env: 'Cuisine & Maison', role: 'Hydratation et Cuisine Saine', hw: 'Leveluk K8 (8 Plaques)', best: 'Familles recherchant une eau antioxydante et écologique' },
    matrixEmguarde: { name: 'emGuarde®', cat: 'Harmoniseur Ambiant', env: 'Bureau, Chambre & Voyage', role: 'Cohérence Électronique', hw: 'emGuarde GO (Set 2 Unités)', best: 'Personnes entourées d’écrans et de routeurs sans fil' },
    matrixDuo: { name: 'LE DUO TRUE LEGACY', cat: 'Écosystème Global 2 Piliers', env: 'Vie Complète : Maison et Voyage', role: 'Soin Interne et Externe', hw: 'K8 + Set emGuarde GO', best: 'Foyers désireux d’un équilibre global parfait' },

    showcaseHeading: 'DÉCOUVREZ LE DUO.',
    showcaseSub: 'Explorez chaque technologie côte à côte avec des caractéristiques vérifiées et des parcours de commande directs.',
    k8ShowcaseTitle: 'Leveluk K8® Ioniseur Phare',
    k8ShowcaseDesc: 'L’ioniseur d’eau référence à 8 plaques d’Enagic. Système multi-voltage universel, écran tactile et 5 eaux à la demande.',
    emguardeShowcaseTitle: 'emGuarde® GO Set Fréquence',
    emguardeShowcaseDesc: 'Set de 2 harmoniseurs portatifs. Couverture de 3 mètres de rayon et autonomie USB-C jusqu’à 72 heures.',

    videoHeading: 'LE DUO EN VIDÉO.',
    videoSub: 'Visionnez les présentations pour comprendre le fonctionnement concret de chaque appareil.',
    videoTabK8: 'Démo Leveluk K8 (~4 min)',
    videoTabEmguarde: 'Présentation emGuarde GO (~8 min)',
    videoK8Title: 'Démonstration Eau Leveluk K8®',
    videoK8Desc: 'Découvrez les 5 types d’eau, l’infusion d’hydrogène moléculaire actif et la fabrication médicale japonaise.',
    videoEmguardeTitle: 'Présentation Technologie emGuarde® GO',
    videoEmguardeDesc: 'Apprenez comment la résonance harmonique sur 3 mètres supprime les bruits électromagnétiques ambiants sans couper les réseaux.',

    exploreIndHeading: 'ALLER PLUS LOIN.',
    exploreIndSub: 'Vous préférez explorer un produit d’abord ? Découvrez leur univers dédié.',
    exploreIndK8Cta: 'EXPLORER KANGEN',
    exploreIndEmguardeCta: 'EXPLORER emGuarde',

    guidanceHeading: 'PAR OÙ COMMENCER ?',
    guidanceSub: 'Échangez directement avec votre distributeur certifié pour poser vos questions, vérifier les délais et options de livraison.',
    messageWhatsApp: 'Message sur WhatsApp',
    requestInfo: 'Demander des Informations',
    bookCall: 'Réserver un Appel',

    faqHeading: 'QUESTIONS FRÉQUEMMENT POSÉES',
    faqs: [
      { q: 'Qu’est-ce que le Duo True Legacy ?', a: 'Le Duo associe l’ioniseur d’eau K8 et le set de résonance électromagnétique emGuarde GO pour une approche globale de votre quotidien.' },
      { q: 'Qu’est-ce que l’Eau Kangen® ?', a: 'Une eau ionisée riche en hydrogène actif et antioxydante générée par électrolyse à travers 8 plaques en titane et platine.' },
      { q: 'Qu’est-ce qu’emGuarde® ?', a: 'Un système portatif à résonance harmonique créant un rayon de cohérence de 3 mètres autour de vos appareils connectés.' },
      { q: 'S’agit-il de la même technologie ?', a: 'Non, ce sont deux technologies différentes. Kangen traite l’eau. emGuarde harmonise l’environnement électromagnétique.' },
      { q: 'Puis-je commander les produits séparément ?', a: 'Oui, tout à fait. Chaque technologie peut être commandée de façon autonome.' },
      { q: 'Puis-je commander les deux ensemble ?', a: 'Oui, vous pouvez commander les deux appareils auprès de votre distributeur via cette page.' },
      { q: 'Comment s’effectue la commande ?', a: 'Les commandes sont traitées directement par les filiales officielles Enagic dans plus de 150 pays.' },
      { q: 'Dans quels pays le Duo est-il disponible ?', a: 'Enagic dispose de bureaux en Amérique du Nord, Europe, Amérique Latine, Asie et Océanie.' },
      { q: 'Puis-je échanger avec un guide avant d’acheter ?', a: 'Absolument, votre distributeur est là pour répondre à toutes vos questions avant tout achat.' },
    ],

    finalHeading: 'VOTRE EAU. VOTRE ENVIRONNEMENT. VOTRE PROCHAINE ÉTAPE.',
    finalSub: 'Deux technologies créées pour deux dimensions essentielles de la vie moderne.',
    finalPrimaryCta: 'EXPLORER LE DUO',
    finalSecondaryCta: 'ÉCHANGER AVEC',
    finalTrust: 'Attribution Directe · Garantie Constructeur · Support Mondial',
  },

  pt: {
    badge: 'O DUO TRUE LEGACY',
    headline: 'SUA ÁGUA. SEU AMBIENTE. UM ESTILO DE VIDA CONECTADO.',
    heroSub:
      'Descubra duas tecnologias distintas da Enagic reunidas em uma experiência de vida moderna: Água Kangen® para a água do dia a dia e emGuarde® para o ambiente ao seu redor.',
    exploreDuoBtn: 'EXPLORAR O DUO',
    watchStoryBtn: 'VER A APRESENTAÇÃO',
    buyDuoBtn: 'PEDIR O DUO',
    buyKangenBtn: 'COMPRAR KANGEN',
    buyEmguardeBtn: 'COMPRAR EMGUARDE',
    askAboutOrdering: 'CONSULTAR PEDIDO',
    talkWith: 'Falar com',
    sharedBy: 'Compartilhado pessoalmente com você por',
    verifiedGuide: 'Guia Verificado',
    verifiedLeader: 'LÍDER VERIFICADO',

    trustHighlights: [
      { label: 'Engenharia Japonesa', sub: '50 Anos de Tradição' },
      { label: '8 Placas de Platina', sub: 'Água Eletrolisada' },
      { label: 'Raio de 3 Metros', sub: 'Ambiente Harmonizado' },
      { label: 'Set Dual Portátil', sub: 'Carga USB-C' },
    ],

    equationEyebrow: 'A EQUAÇÃO DO DUO',
    equationHeading: 'DUAS TECNOLOGIAS. DUAS PARTES DO SEU DIA A DIA.',
    equationSub:
      'Uma foca na água que você consome. A outra no ambiente eletromagnético ao redor dos seus espaços de convivência e trabalho.',
    waterCardTag: '01 · SUA ÁGUA',
    waterCardTitle: 'ÁGUA KANGEN®',
    waterCardDesc:
      'Filtra a água da torneira e usa 8 placas de titânio banhadas a platina para produzir 5 tipos de água para hidratação celular, culinária e cuidados com o lar sem produtos tóxicos.',
    waterCardCta: 'EXPLORAR KANGEN →',
    envCardTag: '02 · SEU AMBIENTE',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'Tecnologia portátil com 2 unidades para harmonizar frequências em um raio esférico de 3 metros sem interferir no sinal Wi-Fi ou no celular.',
    envCardCta: 'EXPLORAR emGuarde →',
    duoBadge: 'O DUO TRUE LEGACY',
    duoBadgeSub: 'Duas Tecnologias Distintas · Um Estilo de Vida Consciente',

    dayHeading: 'DA MANHÃ À NOITE.',
    daySub: 'Veja como o Duo se encaixa perfeitamente na rotina da sua família, do amanhecer ao repouso.',
    dayCards: [
      { time: '07:00', period: 'RITUAL MATINAL', title: 'Água Pura ao Acordar', desc: 'Comece o dia com um copo de Água Kangen a pH 9.5 recém-ionizada.', badge: 'Cozinha · Hidratação', icon: Sun },
      { time: '11:00', period: 'FOCO NO TRABALHO', title: 'Foco sem Ruído', desc: 'emGuarde GO ao lado do seu computador e celular harmonizando o ambiente.', badge: 'Escritório · Foco', icon: Laptop },
      { time: '15:30', period: 'EM MOVIMENTO', title: 'Liberdade onde For', desc: 'Leve seu set recarregável em viagens, reuniões e no trânsito.', badge: 'Viagem · Mobilidade', icon: Car },
      { time: '20:00', period: 'DESCANSO NOTURNO', title: 'Harmonia no Lar', desc: 'Cozinhe alimentos frescos com Água Kangen e relaxe com serenidade.', badge: 'Casa · Repouso', icon: Moon },
    ],

    kangenHeading: 'TUDO COMEÇA PELA SUA ÁGUA.',
    kangenSub:
      'A base do bem-estar começa pela água que você bebe. O Leveluk K8 transforma água comum em uma fonte viva de alto rendimento para toda a família.',
    kangenFeatures: [
      { title: '8 Placas de Titânio e Platina', desc: 'Câmaras de eletrólise médica para fluxo contínuo e máxima durabilidade.' },
      { title: '5 Tipos de Água pH', desc: 'Para beber (8.5–9.5), preparo de alimentos, beleza da pele (6.0) e higienização culinária.' },
      { title: 'Produção Contínua na Torneira', desc: 'Água fresca imediata sem acumular garrafas plásticas descartáveis.' },
      { title: '50 Anos de Tradição Japonesa', desc: 'Fabricado pela Enagic em Osaka, Japão, sob rígidos padrões ISO 13485.' },
    ],
    exploreKangenBtn: 'EXPLORAR ÁGUA KANGEN',

    transitionLine1: 'Da água que nutre o seu corpo por dentro —',
    transitionLine2: 'ao ambiente tecnológico que envolve o seu espaço por fora.',

    emguardeHeading: 'DEPOIS, OLHE PARA O AMBIENTE AO SEU REDOR.',
    emguardeSub:
      'Aparelhos sem fio e telas estão presentes em toda parte. emGuarde traz harmonia aos seus espaços sem desconectar você.',
    emguardeFeatures: [
      { title: 'Ressonância Harmônica Ambiental', desc: 'Harmoniza frequências sem enfraquecer o sinal dos seus aparelhos.' },
      { title: 'Conectividade Total', desc: 'Seu Wi-Fi, 5G e Bluetooth continuam operando com máxima velocidade.' },
      { title: 'Set Sincronizado com 2 Unidades', desc: 'Dois aparelhos compactos para proteger quartos, escritórios e salas.' },
      { title: 'Bateria Recarregável USB-C', desc: 'Até 72 horas de autonomia por carga para acompanhar seu estilo de vida.' },
    ],
    emguardeDisclaimer:
      'Nota regulatória: emGuarde GO é um dispositivo de harmonização ambiental e não tem como objetivo diagnosticar, tratar ou curar doenças.',
    exploreEmguardeBtn: 'EXPLORAR emGuarde',

    whyDuoHeading: 'POR QUE JUNTOS?',
    whyDuoSub: 'Duas tecnologias diferentes. Uma decisão consciente de vida.',
    whyDuoKangenRole: 'Cuida da água que você bebe, cozinha e utiliza no seu lar.',
    whyDuoEmguardeRole: 'Cuida do ambiente eletromagnético ao redor do seu trabalho e repouso.',
    whyDuoTogether: 'Juntos, formam uma base completa para quem valoriza saúde interna e serenidade externa.',

    matrixHeading: 'DUAS TECNOLOGIAS. UMA EQUAÇÃO COMPLETA.',
    matrixSub: 'Entenda cada tecnologia e veja por que o Duo é a solução mais abrangente.',
    matrixHeaders: ['Categoria', 'Ambiente Principal', 'Papel Diário', 'Hardware', 'Ideal Para'],
    matrixKangen: { name: 'ÁGUA KANGEN®', cat: 'Ionizador Médico de Água', env: 'Casa e Cozinha', role: 'Hidratação e Culinária', hw: 'Leveluk K8 (8 Placas)', best: 'Famílias que buscam água pura e antioxidante' },
    matrixEmguarde: { name: 'emGuarde®', cat: 'Harmonizador Ambiental', env: 'Escritório, Viagens e Casa', role: 'Coerência ao Redor de Aparelhos', hw: 'emGuarde GO (Set Portátil)', best: 'Pessoas cercadas por tecnologias sem fio' },
    matrixDuo: { name: 'O DUO TRUE LEGACY', cat: 'Ecossistema de 2 Pilares', env: 'Vida Completa: De Casa a Viagens', role: 'Cuidado Interno e Externo', hw: 'K8 + Set emGuarde GO', best: 'Lares que desejam equilíbrio absoluto' },

    showcaseHeading: 'CONHEÇA O DUO.',
    showcaseSub: 'Explore cada tecnologia lado a lado com especificações verificadas e caminhos de compra diretos.',
    k8ShowcaseTitle: 'Leveluk K8® Ionizador Insígnia',
    k8ShowcaseDesc: 'O ionizador insígnia de 8 placas da Enagic. Bivolt automático, tela touchscreen e 5 tipos de água sob demanda.',
    emguardeShowcaseTitle: 'emGuarde® GO Set de Frequência',
    emguardeShowcaseDesc: 'Set com 2 harmonizadores portáteis. Raio de 3 metros e até 72 horas de autonomia via USB-C.',

    videoHeading: 'O DUO EM VÍDEO.',
    videoSub: 'Assista às apresentações para entender como cada tecnologia funciona na prática.',
    videoTabK8: 'Demonstração Leveluk K8 (~4 min)',
    videoTabEmguarde: 'Apresentação emGuarde GO (~8 min)',
    videoK8Title: 'Demonstração Água Leveluk K8®',
    videoK8Desc: 'Conheça os 5 tipos de água, os antioxidantes de hidrogênio molecular e o padrão de engenharia médica japonesa.',
    videoEmguardeTitle: 'Apresentação Tecnologia emGuarde® GO',
    videoEmguardeDesc: 'Entenda como a ressonância harmônica de 3 metros atenua ruídos eletromagnéticos sem bloquear o sinal de celular ou Wi-Fi.',

    exploreIndHeading: 'CONHEÇA A FUNDO.',
    exploreIndSub: 'Prefere explorar um produto primeiro? Veja os detalhes de cada tecnologia.',
    exploreIndK8Cta: 'EXPLORAR KANGEN',
    exploreIndEmguardeCta: 'EXPLORAR emGuarde',

    guidanceHeading: 'POR ONDE COMEÇAR?',
    guidanceSub: 'Converse diretamente com o seu guia verificado sobre opções, frete regional e instalação.',
    messageWhatsApp: 'Enviar Mensagem no WhatsApp',
    requestInfo: 'Solicitar Informações',
    bookCall: 'Agendar Chamada',

    faqHeading: 'PERGUNTAS FREQUENTES',
    faqs: [
      { q: 'O que é o Duo True Legacy?', a: 'O Duo reúne duas tecnologias distintas: o ionizador Leveluk K8 para hidratação interna, e o set portátil emGuarde GO para o ambiente eletromagnético.' },
      { q: 'O que é a Água Kangen®?', a: 'Água pura e antioxidante rica em hidrogênio molecular produzida por ionizadores Enagic com 5 ajustes de pH.' },
      { q: 'O que é o emGuarde®?', a: 'Um sistema portátil com 2 unidades que usa ressonância harmônica para atenuar ruídos eletromagnéticos em 3 metros sem afetar o Wi-Fi.' },
      { q: 'São a mesma tecnologia?', a: 'Não. São duas tecnologias diferentes. Kangen ioniza água. emGuarde harmoniza o ambiente eletromagnético.' },
      { q: 'Posso comprá-los separadamente?', a: 'Sim, ambos podem ser pedidos de forma individual conforme a sua prioridade.' },
      { q: 'Posso pedir os dois juntos?', a: 'Sim. Você pode pedir ambas as tecnologias através do seu distribuidor nesta página.' },
      { q: 'Como funciona o pedido?', a: 'Os pedidos são processados diretamente pelas filiais oficiais da Enagic em mais de 150 países.' },
      { q: 'Onde o Duo está disponível?', a: 'A Enagic possui filiais na América do Norte, Europa, América Latina, Ásia e Oceania.' },
      { q: 'Posso falar com um distribuidor antes de comprar?', a: 'Com certeza! Seu distribuidor está à disposição para esclarecer dúvidas e verificar prazos de entrega.' },
    ],

    finalHeading: 'SUA ÁGUA. SEU AMBIENTE. SEU PRÓXIMO PASSO.',
    finalSub: 'Duas tecnologias criadas para duas dimensões essenciais da vida moderna.',
    finalPrimaryCta: 'EXPLORAR O DUO',
    finalSecondaryCta: 'FALAR COM',
    finalTrust: 'Atribuição Direta · Garantia Oficial de Fábrica · Suporte Global',
  },
}

export function DuoLandingPage({ profile: propProfile, distributorSlug: propSlug }: DuoLandingPageProps) {
  const { slug: routeSlug } = useParams()
  const [searchParams] = useSearchParams()
  const { locale, setLocale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile || undefined)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  const equationRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const showcaseRef = useRef<HTMLDivElement>(null)
  const distributorRef = useRef<HTMLDivElement>(null)

  const distributorSlugActive = propSlug || routeSlug || 'mehdi-cohen'
  const t = I18N[locale as keyof typeof I18N] || I18N.en

  // Load distributor profile if not provided via props
  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
      return
    }
    let isMounted = true
    async function loadDistributor() {
      try {
        const distributors = await getPublicDistributors()
        const found = distributors.find(
          (d) => d.slug.toLowerCase() === distributorSlugActive.toLowerCase()
        )
        if (isMounted && found) {
          setProfile(found)
        }
      } catch (err) {
        console.error('Error loading distributor for Duo page:', err)
      }
    }
    loadDistributor()
    return () => {
      isMounted = false
    }
  }, [distributorSlugActive, propProfile])

  // Track page visit
  useEffect(() => {
    trackEvent('page_view', {
      page: 'duo_master_landing_page',
      distributor: distributorSlugActive,
      source: searchParams.get('source') || 'direct',
      interest: searchParams.get('interest') || 'duo',
      locale,
    })
  }, [distributorSlugActive, searchParams, locale])

  // Purchase URLs resolution
  const duoPurchaseUrl = useMemo(
    () => getProductPurchaseLink(profile?.purchase_links, 'duo'),
    [profile?.purchase_links]
  )
  const k8PurchaseUrl = useMemo(
    () => getProductPurchaseLink(profile?.purchase_links, 'k8'),
    [profile?.purchase_links]
  )
  const emguardePurchaseUrl = useMemo(
    () => getProductPurchaseLink(profile?.purchase_links, 'emguarde'),
    [profile?.purchase_links]
  )

  const hasDuoDirectUrl = Boolean(duoPurchaseUrl)
  const hasBothUrls = Boolean(k8PurchaseUrl && emguardePurchaseUrl)
  const hasK8Only = Boolean(k8PurchaseUrl && !emguardePurchaseUrl)
  const hasEmguardeOnly = Boolean(!k8PurchaseUrl && emguardePurchaseUrl)

  // Dynamic Distributor attributes
  const distributorName = profile?.display_name || 'Mehdi Cohen'
  const distributorFirstName = distributorName.split(' ')[0]
  const distributorTitle = profile?.title || 'Verified True Legacy Leader'
  const leaderAvatar =
    LEADER_PORTRAITS[profile?.slug || distributorSlugActive] ||
    getLeaderPortrait(profile?.slug || distributorSlugActive, '/leaders/standardized/mehdi-cohen.png')

  // Smooth scroll helpers
  const scrollToEquation = () => equationRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToVideo = () => videoRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToDistributor = () => distributorRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToShowcase = () => showcaseRef.current?.scrollIntoView({ behavior: 'smooth' })

  // WhatsApp Pre-filled message generator
  const getWhatsAppMessage = () => {
    if (locale === 'es') {
      return `Hola ${distributorName}, estoy revisando el Dúo True Legacy (Agua Kangen K8 + emGuarde GO) y me gustaría recibir asesoría sobre precios, disponibilidad y pedido.`
    }
    if (locale === 'fr') {
      return `Bonjour ${distributorName}, je consulte la page True Legacy Duo (K8 + emGuarde GO) et j'aimerais recevoir des informations sur les tarifs, la livraison et les commandes.`
    }
    if (locale === 'pt') {
      return `Olá ${distributorName}, estou conhecendo o True Legacy Duo (K8 + emGuarde GO) e gostaria de tirar dúvidas sobre preços, disponibilidade e pedidos.`
    }
    return `Hi ${distributorName}, I'm reviewing the True Legacy Duo (K8 Water + emGuarde GO) on your personal page and would love some guidance on package pricing, availability, and ordering.`
  }

  const whatsappPhone = profile?.phone || '+14383424103'
  const cleanPhone = whatsappPhone.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(getWhatsAppMessage())}`
  const bookingUrl = `/d/${distributorSlugActive}/contact`

  // Individual product page URLs preserving attribution
  const kangenPageUrl = `/d/${distributorSlugActive}/kangen?source=duo&interest=product`
  const emguardePageUrl = `/d/${distributorSlugActive}/emguarde?source=duo&interest=duo`

  // Primary CTA action router
  const handlePrimaryDuoCta = () => {
    if (hasDuoDirectUrl && duoPurchaseUrl) {
      window.open(duoPurchaseUrl, '_blank', 'noopener,noreferrer')
    } else if (hasBothUrls) {
      setIsPurchaseModalOpen(true)
    } else {
      scrollToEquation()
    }
  }

  return (
    <div className="min-h-screen bg-[#02050a] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">
      <SEO
        title={`True Legacy Duo · Water & Environment | ${distributorName}`}
        description={`Experience the ultimate synergy of Japanese water ionization and ambient harmonic frequency protection. Presented by ${distributorName}.`}
        canonical={`https://www.truelegacyworld.com/d/${distributorSlugActive}/duo`}
      />

      {/* ========================================================================= */}
      {/* 01. STICKY HEADER MATCHING KANGEN / EMGUARDE DESIGN STANDARD */}
      {/* ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-[#02050a]/85 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <LandingHeaderBackButton fallbackUrl={`/d/${distributorSlugActive}`} />
            <Link to={`/d/${distributorSlugActive}`} className="flex items-center gap-2 group">
              <TrueLegacyLogo className="h-6 w-auto text-white transition-opacity group-hover:opacity-80" />
              <div className="hidden md:flex items-center gap-1.5 border-l border-white/20 pl-3">
                <span className="text-xs font-black tracking-wider text-cyan-400">DUO</span>
                <span className="text-[10px] uppercase text-[#88909e] font-mono tracking-tight">K8 + emGuarde</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 text-[11px] font-bold">
              {(['en', 'es', 'fr', 'pt'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                    locale === l ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-[#88909e] hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Direct Purchase / Modal CTA in Header */}
            <button
              type="button"
              onClick={handlePrimaryDuoCta}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 px-3.5 py-1.5 text-xs font-black text-white transition-all cursor-pointer shadow-md shadow-orange-500/25 active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{t.buyDuoBtn}</span>
            </button>

            {/* Guide Contact Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 px-3.5 py-1.5 text-xs font-bold border border-cyan-400/30 transition-all active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.talkWith} {distributorFirstName}</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 02. CINEMATIC HERO SECTION: K8 + EMGUARDE ON RIGHT, TYPOGRAPHY ON LEFT */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] pt-24 pb-16 flex items-center overflow-hidden border-b border-white/10 bg-[#02050a]">
        {/* Background Visual Asset: Hidden on mobile (< lg) for pristine clarity, cinematic right-side on desktop */}
        <div className="hidden lg:block absolute inset-0 z-0">
          <img
            src="/duo/duo-master-hero.jpg"
            alt="True Legacy Duo Leveluk K8 and emGuarde GO on Ocean Terrace"
            fetchPriority="high"
            className="w-full h-full object-cover object-right filter brightness-[0.85] contrast-[1.04]"
          />
          {/* Subtle responsive vignette & dark overlay for text legibility on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#02050a] via-[#02050a]/90 to-transparent w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-black/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Website Generated Typography & CTAs */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-6 text-left">
              {/* Distributor Trust Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-black/60 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
                <img
                  src={leaderAvatar}
                  alt={distributorName}
                  className="h-5 w-5 rounded-full object-cover border border-cyan-400/60"
                />
                <span className="text-[11px] font-semibold text-slate-300">
                  {t.sharedBy} <strong className="text-white font-black">{distributorName}</strong>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
                  {t.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">ENAGIC® OEM</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                {t.headline}
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#c5d0e0] leading-relaxed max-w-xl font-normal">
                {t.heroSub}
              </p>

              {/* Primary, Secondary, and Purchase CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={scrollToEquation}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-6 py-3.5 text-sm shadow-xl shadow-cyan-400/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{t.exploreDuoBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={scrollToVideo}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/40 hover:bg-white/10 text-white font-bold px-5 py-3.5 text-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="h-4 w-4 text-cyan-400 fill-current" />
                  <span>{t.watchStoryBtn}</span>
                </button>

                {/* Direct Purchase Button (Orange color as requested) */}
                <button
                  type="button"
                  onClick={handlePrimaryDuoCta}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black px-6 py-3.5 text-sm shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{t.buyDuoBtn}</span>
                </button>
              </div>

              {/* Mobile Dedicated Picture Card: Clean, uncropped, editorial framing */}
              <div className="lg:hidden my-6 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.08] to-[#050b14] p-1.5 sm:p-2 shadow-2xl relative group">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black">
                  <img
                    src="/duo/duo-master-hero.jpg"
                    alt="True Legacy Duo: Leveluk K8 and emGuarde GO"
                    className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.02]"
                  />
                  {/* Subtle glass badge overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-black/75 backdrop-blur-md px-3 py-1.5 border border-white/15 text-[11px] font-mono text-slate-200">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      Leveluk K8® + emGuarde® GO
                    </span>
                    <span className="text-cyan-400 font-black">ENAGIC® OEM</span>
                  </div>
                </div>
              </div>

              {/* 4 Trust Highlights */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10">
                {t.trustHighlights.map((th, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                    <p className="text-xs font-bold text-white leading-tight">{th.label}</p>
                    <p className="text-[10px] text-cyan-400/80 leading-tight mt-0.5">{th.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Kept visually clear for the high-res penthouse product photograph */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. WATCH THE DUO: DUAL VIDEO THEATER (RIGHT UNDERNEATH HERO) */}
      {/* ========================================================================= */}
      <section ref={videoRef} id="video-story" className="scroll-mt-20 py-20 sm:py-28 border-b border-white/10 bg-[#03050a] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold text-cyan-300 tracking-wider uppercase">
              <Play className="h-3 w-3 fill-current text-cyan-400" />
              DUAL VIDEO THEATER
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.videoHeading}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#b8c0cf]">
              {t.videoSub}
            </p>
          </div>

          {/* DUAL VIDEOS GRID */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Video 1: Leveluk K8 Water Demo */}
            <article className="rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-[#091524] via-[#050b14] to-black p-5 sm:p-6 shadow-2xl shadow-cyan-500/10 flex flex-col justify-between group hover:border-cyan-400/50 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-3 py-1 text-[11px] font-black uppercase text-cyan-300 tracking-wider">
                    <Droplets className="h-3 w-3 text-cyan-400" />
                    {t.videoTabK8}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400/80">JAPANESE MED-TECH</span>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black">
                  <YouTubeEmbed
                    url={localizedProductVideo('kangenWater', locale)}
                    title={t.videoK8Title}
                    className="border-0 bg-black"
                  />
                </div>

                <div className="mt-5">
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {t.videoK8Title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#a4b0c2] leading-relaxed">
                    {t.videoK8Desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Pillar 01: Water Vitality</span>
                <Link
                  to={kangenPageUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>{t.exploreIndK8Cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>

            {/* Video 2: emGuarde GO Frequency Demo */}
            <article className="rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[#061814] via-[#040f0c] to-black p-5 sm:p-6 shadow-2xl shadow-emerald-500/10 flex flex-col justify-between group hover:border-emerald-400/50 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-[11px] font-black uppercase text-emerald-300 tracking-wider">
                    <Radio className="h-3 w-3 text-emerald-400" />
                    {t.videoTabEmguarde}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400/80">PATENTED HARMONIC</span>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black">
                  <YouTubeEmbed
                    url={localizedProductVideo('emguardeGo', locale)}
                    title={t.videoEmguardeTitle}
                    className="border-0 bg-black"
                  />
                </div>

                <div className="mt-5">
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    {t.videoEmguardeTitle}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#a4b0c2] leading-relaxed">
                    {t.videoEmguardeDesc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Pillar 02: Environmental Calm</span>
                <Link
                  to={emguardePageUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>{t.exploreIndEmguardeCta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Official presentation videos localized for {locale.toUpperCase()}. Sound starts only upon your explicit play interaction.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. THE DUO EQUATION: TWO TECHNOLOGIES. TWO PARTS OF EVERYDAY LIFE. */}
      {/* ========================================================================= */}
      <section ref={equationRef} id="duo-equation" className="scroll-mt-20 py-20 sm:py-28 border-b border-white/10 bg-[#030712] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
              {t.equationEyebrow}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.equationHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#a8b4c7] leading-relaxed">
              {t.equationSub}
            </p>
          </div>

          {/* Split Composition: K8 (Water) + emGuarde (Environment) using ProductStage */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-stretch">
            {/* LEFT CARD: 01 YOUR WATER (Kangen Water) */}
            <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.05] via-[#081022] to-[#040711] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300">
              <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                    {t.waterCardTag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ENAGIC® OEM</span>
                </div>

                <h3 className="mt-5 text-2xl sm:text-3xl font-black text-white">
                  {t.waterCardTitle}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#b0b8c7] leading-relaxed">
                  {t.waterCardDesc}
                </p>

                {/* Standardized ProductStage for K8 */}
                <ProductStage product="k8" context="equation" />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">8 Titanium-Platinum Plates</span>
                <Link
                  to={kangenPageUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 px-4 py-2 text-xs font-bold border border-cyan-400/30 transition-all duration-300"
                >
                  <span>{t.waterCardCta}</span>
                </Link>
              </div>
            </div>

            {/* CENTER CONNECTOR: + THE DUO */}
            <div className="lg:col-span-1 flex flex-row lg:flex-col items-center justify-center py-4 lg:py-0">
              <div className="h-px lg:h-20 w-16 lg:w-px bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
              <div className="my-0 lg:my-3 mx-4 lg:mx-0 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-cyan-400 bg-gradient-to-br from-[#0a152e] to-[#040711] shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                <span className="text-xl font-black text-cyan-300">+</span>
              </div>
              <div className="h-px lg:h-20 w-16 lg:w-px bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
            </div>

            {/* RIGHT CARD: 02 YOUR ENVIRONMENT (emGuarde) */}
            <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.05] via-[#0d141e] to-[#040711] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-emerald-400/40 transition-all duration-300">
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    <Radio className="h-3.5 w-3.5 text-emerald-400" />
                    {t.envCardTag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">PATENTED RESONANCE</span>
                </div>

                <h3 className="mt-5 text-2xl sm:text-3xl font-black text-white">
                  {t.envCardTitle}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#b0b8c7] leading-relaxed">
                  {t.envCardDesc}
                </p>

                {/* Standardized ProductStage for emGuarde */}
                <ProductStage product="emguarde" context="equation" />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Dual-Unit Portable Set</span>
                <Link
                  to={emguardePageUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 px-4 py-2 text-xs font-bold border border-emerald-400/30 transition-all duration-300"
                >
                  <span>{t.envCardCta}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. FROM MORNING TO NIGHT: 24-HOUR LIFESTYLE TIMELINE */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#02050c] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              EVERYDAY HARMONY
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.dayHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#a0abbd]">
              {t.daySub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.dayCards.map((card, idx) => {
              const IconComp = card.icon
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 flex flex-col justify-between hover:border-cyan-400/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-cyan-400">{card.time}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-slate-300 font-medium">
                        {card.badge}
                      </span>
                    </div>

                    <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-110 transition-transform">
                      <IconComp className="h-5 w-5" />
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {card.period}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#9da7b8] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. PILLAR 01: IT STARTS WITH YOUR WATER (KANGEN WATER STORY) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-gradient-to-b from-[#071022] via-[#040816] to-[#03050d] relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[160px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Column using ProductStage */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-md aspect-square rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-cyan-900/20 to-black/60 p-6 flex items-center justify-center shadow-2xl">
                <ProductStage product="k8" context="spotlight" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/60 p-3 text-center backdrop-blur-md">
                  <span className="text-xs font-bold text-white">8 Solid Platinum-Dipped Titanium Plates</span>
                  <p className="text-[10px] text-slate-400">pH 2.5 to pH 11.5 Continuous Generation</p>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                PILLAR 01: INTERNAL WELLNESS
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {t.kangenHeading}
              </h2>

              <p className="mt-4 text-base sm:text-lg text-[#c2cbd8] leading-relaxed">
                {t.kangenSub}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {t.kangenFeatures.map((feat, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      {feat.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-[#a0aab8] leading-relaxed pl-6">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons: Explore & Buy Kangen */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={kangenPageUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{t.exploreKangenBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {k8PurchaseUrl ? (
                  <a
                    href={k8PurchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t.buyKangenBtn}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-5 py-3 text-sm transition-all"
                  >
                    <MessageCircle className="h-4 w-4 text-cyan-400" />
                    <span>{t.askAboutOrdering}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. VISUAL TRANSITION: WATER REFRACTIONS → ARCHITECTURAL GRAPHITE */}
      {/* ========================================================================= */}
      <div className="py-12 border-b border-white/10 bg-gradient-to-b from-[#03050d] via-[#08121a] to-[#040911] text-center px-4">
        <div className="mx-auto max-w-3xl flex flex-col items-center">
          <div className="h-10 w-px bg-gradient-to-b from-cyan-400 to-emerald-400" />
          <p className="mt-4 text-sm sm:text-base font-light italic text-[#b5c2d4] max-w-xl">
            "{t.transitionLine1} {t.transitionLine2}"
          </p>
          <div className="mt-4 h-10 w-px bg-gradient-to-b from-emerald-400 to-transparent" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 07. PILLAR 02: NOW LOOK AT THE ENVIRONMENT AROUND YOU (EMGUARDE STORY) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-gradient-to-b from-[#040911] via-[#061114] to-[#03060c] relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[160px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                PILLAR 02: ENVIRONMENTAL CALM
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {t.emguardeHeading}
              </h2>

              <p className="mt-4 text-base sm:text-lg text-[#c2cbd8] leading-relaxed">
                {t.emguardeSub}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {t.emguardeFeatures.map((feat, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      {feat.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-[#a0aab8] leading-relaxed pl-6">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[11px] text-[#868e9d] leading-relaxed">
                {t.emguardeDisclaimer}
              </div>

              {/* Action Buttons: Explore & Buy emGuarde */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={emguardePageUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{t.exploreEmguardeBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {emguardePurchaseUrl ? (
                  <a
                    href={emguardePurchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t.buyEmguardeBtn}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-5 py-3 text-sm transition-all"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    <span>{t.askAboutOrdering}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Visual Column using ProductStage */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-emerald-950/20 to-black/60 p-6 flex items-center justify-center shadow-2xl">
                <ProductStage product="emguarde" context="spotlight" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/60 p-3 text-center backdrop-blur-md">
                  <span className="text-xs font-bold text-white">Dual-Unit Synchronized Set</span>
                  <p className="text-[10px] text-slate-400">Up to 72 Hours USB-C Battery · 3m Diameter Range</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08. WHY THE DUO (WHY TOGETHER?) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#040711] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              THE DUO ADVANTAGE
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.whyDuoHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf]">
              {t.whyDuoSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-cyan-400/25 bg-gradient-to-b from-[#09152b] via-[#050c18] to-black p-8 shadow-xl">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold mb-5">
                01
              </div>
              <h3 className="text-xl font-bold text-white">KANGEN WATER®</h3>
              <p className="mt-3 text-sm text-[#a4b0c2] leading-relaxed">
                {t.whyDuoKangenRole}
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-400/25 bg-gradient-to-b from-[#071915] via-[#040f0c] to-black p-8 shadow-xl">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-5">
                02
              </div>
              <h3 className="text-xl font-bold text-white">emGuarde®</h3>
              <p className="mt-3 text-sm text-[#a4b0c2] leading-relaxed">
                {t.whyDuoEmguardeRole}
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-gradient-to-b from-white/[0.06] via-[#0e1628] to-black p-8 shadow-xl">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-white/30 flex items-center justify-center text-white font-black mb-5">
                +
              </div>
              <h3 className="text-xl font-bold text-white">{t.duoBadge}</h3>
              <p className="mt-3 text-sm text-[#a4b0c2] leading-relaxed">
                {t.whyDuoTogether}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09. DEDICATED PRODUCT SHOWCASE: MEET THE DUO */}
      {/* ========================================================================= */}
      <section ref={showcaseRef} id="meet-the-duo" className="scroll-mt-20 py-20 sm:py-28 border-b border-white/10 bg-[#02050b] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              OFFICIAL PRODUCT SHOWCASE
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.showcaseHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf]">
              {t.showcaseSub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Product 1: K8 Showcase */}
            <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#091526] via-[#050c17] to-black p-6 sm:p-8 flex flex-col justify-between shadow-2xl group hover:border-cyan-400/40 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">FLAGSHIP IONIZER</span>
                  <span className="text-xs text-slate-400">5-Year Warranty</span>
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {t.k8ShowcaseTitle}
                </h3>
                <p className="mt-2 text-sm text-[#a0abbd] leading-relaxed">
                  {t.k8ShowcaseDesc}
                </p>

                {/* ProductStage showcase */}
                <ProductStage product="k8" context="showcase" />
              </div>

              <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <Link
                  to={kangenPageUrl}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{t.exploreIndK8Cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {k8PurchaseUrl ? (
                  <a
                    href={k8PurchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 text-xs shadow-md transition-all active:scale-95"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>{t.buyKangenBtn}</span>
                  </a>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{t.askAboutOrdering}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Product 2: emGuarde Showcase */}
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#061814] via-[#040f0c] to-black p-6 sm:p-8 flex flex-col justify-between shadow-2xl group hover:border-emerald-400/40 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">HARMONIC RESONATOR</span>
                  <span className="text-xs text-slate-400">Set of 2 Units</span>
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {t.emguardeShowcaseTitle}
                </h3>
                <p className="mt-2 text-sm text-[#a0abbd] leading-relaxed">
                  {t.emguardeShowcaseDesc}
                </p>

                {/* ProductStage showcase */}
                <ProductStage product="emguarde" context="showcase" />
              </div>

              <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <Link
                  to={emguardePageUrl}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{t.exploreIndEmguardeCta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {emguardePurchaseUrl ? (
                  <a
                    href={emguardePurchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 text-xs shadow-md transition-all active:scale-95"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>{t.buyEmguardeBtn}</span>
                  </a>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{t.askAboutOrdering}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. SYNERGY COMPARISON MATRIX */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#03060f] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              SIDE-BY-SIDE SPECIFICATIONS
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.matrixHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf]">
              {t.matrixSub}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="border-b border-white/10 bg-white/[0.03] text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="p-5">{t.matrixHeaders[0]}</th>
                  <th className="p-5">{t.matrixHeaders[1]}</th>
                  <th className="p-5">{t.matrixHeaders[2]}</th>
                  <th className="p-5">{t.matrixHeaders[3]}</th>
                  <th className="p-5">{t.matrixHeaders[4]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-bold text-cyan-300">{t.matrixKangen.name}</td>
                  <td className="p-5 text-slate-300">{t.matrixKangen.env}</td>
                  <td className="p-5 text-slate-300">{t.matrixKangen.role}</td>
                  <td className="p-5 font-mono text-xs text-slate-400">{t.matrixKangen.hw}</td>
                  <td className="p-5 text-xs text-[#a0abbd]">{t.matrixKangen.best}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-bold text-emerald-300">{t.matrixEmguarde.name}</td>
                  <td className="p-5 text-slate-300">{t.matrixEmguarde.env}</td>
                  <td className="p-5 text-slate-300">{t.matrixEmguarde.role}</td>
                  <td className="p-5 font-mono text-xs text-slate-400">{t.matrixEmguarde.hw}</td>
                  <td className="p-5 text-xs text-[#a0abbd]">{t.matrixEmguarde.best}</td>
                </tr>
                <tr className="bg-gradient-to-r from-cyan-950/20 via-white/[0.03] to-emerald-950/20 font-semibold">
                  <td className="p-5 font-black text-white flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    {t.matrixDuo.name}
                  </td>
                  <td className="p-5 text-white">{t.matrixDuo.env}</td>
                  <td className="p-5 text-white">{t.matrixDuo.role}</td>
                  <td className="p-5 font-mono text-xs text-cyan-300">{t.matrixDuo.hw}</td>
                  <td className="p-5 text-xs text-cyan-200 font-bold">{t.matrixDuo.best}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 12. EXPLORE INDIVIDUALLY: GO DEEPER */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#040711] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              INDIVIDUAL DEEP-DIVES
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.exploreIndHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf]">
              {t.exploreIndSub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Kangen */}
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.05] via-[#071226] to-[#040711] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  <Droplets className="h-3.5 w-3.5" />
                  WATER EXPERIENCE
                </span>
                <h3 className="mt-4 text-2xl sm:text-3xl font-black text-white">
                  Kangen Water® Experience
                </h3>
                <p className="mt-3 text-sm text-[#b0b9c7] leading-relaxed">
                  Dive into the full Japanese water ionizer story: molecular hydrogen hydration, the 5 water types, produce cleaning, beauty skincare, and household use cases.
                </p>
              </div>

              {/* Standardized ProductStage for K8 */}
              <ProductStage product="k8" context="card" />

              <Link
                to={kangenPageUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3.5 text-sm transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>{t.exploreIndK8Cta}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 2: emGuarde */}
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.05] via-[#0b171c] to-[#040711] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  <Radio className="h-3.5 w-3.5" />
                  ENVIRONMENT EXPERIENCE
                </span>
                <h3 className="mt-4 text-2xl sm:text-3xl font-black text-white">
                  emGuarde® Technology Experience
                </h3>
                <p className="mt-3 text-sm text-[#b0b9c7] leading-relaxed">
                  Explore how harmonic frequency resonance works in workspaces, smart homes, and travel environments without disrupting cellular or Wi-Fi connectivity.
                </p>
              </div>

              {/* Standardized ProductStage for emGuarde */}
              <ProductStage product="emguarde" context="card" />

              <Link
                to={emguardePageUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>{t.exploreIndEmguardeCta}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. DISTRIBUTOR GUIDANCE: NOT SURE WHERE TO START? */}
      {/* ========================================================================= */}
      <section ref={distributorRef} id="distributor-guide" className="scroll-mt-20 py-20 sm:py-28 border-b border-white/10 bg-[#02050b] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#081224] via-[#050b14] to-black p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <img
                src={leaderAvatar}
                alt={distributorName}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 rounded-full border border-white/20 bg-cyan-500 p-1.5 text-slate-950 shadow-lg">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                {t.verifiedLeader}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {t.guidanceHeading}
              </h3>
              <p className="text-sm sm:text-base text-[#a0abbd] leading-relaxed">
                {t.guidanceSub}
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t.messageWhatsApp}</span>
                </a>

                <Link
                  to={`/d/${distributorSlugActive}/contact`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-5 py-3 text-xs transition-all active:scale-95"
                >
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>{t.bookCall}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. INTERACTIVE FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#03060e] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              ANSWERS & CLARITY
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.faqHeading}
            </h2>
          </div>

          <div className="space-y-3">
            {t.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-base hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#a4b0c2] leading-relaxed border-t border-white/5 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15. FINAL CINEMATIC CTA: YOUR WATER. YOUR ENVIRONMENT. YOUR NEXT STEP. */}
      {/* ========================================================================= */}
      <section id="final-cta" className="py-24 sm:py-32 bg-[#020409] relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-cyan-500/10 blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Dual Product Visual Harmony with ProductStage */}
          <div className="flex items-end justify-center gap-6 sm:gap-12 mb-10 h-[220px] sm:h-[250px]">
            <div className="flex flex-col items-center justify-end h-full">
              <ProductStage product="k8" context="cta" />
              <span className="mt-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">Leveluk K8®</span>
            </div>
            <div className="h-20 w-px bg-white/20 mb-5 hidden sm:block" />
            <div className="flex flex-col items-center justify-end h-full">
              <ProductStage product="emguarde" context="cta" />
              <span className="mt-2 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">emGuarde® GO</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            {t.finalHeading}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[#c5cdd9] max-w-xl mx-auto leading-relaxed">
            {t.finalSub}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrimaryDuoCta}
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{t.buyDuoBtn}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>{t.finalSecondaryCta} {distributorFirstName}</span>
            </a>
          </div>

          <p className="mt-8 text-xs text-slate-500 font-mono">
            {t.finalTrust}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 16. PURCHASE CHOICE MODAL / MOBILE BOTTOM SHEET (SCENARIO A) */}
      {/* ========================================================================= */}
      <DuoPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        distributorName={distributorName}
        k8PurchaseUrl={k8PurchaseUrl}
        emguardePurchaseUrl={emguardePurchaseUrl}
        whatsappUrl={whatsappUrl}
        locale={locale}
      />

      {/* ========================================================================= */}
      {/* 17. FOOTER */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  )
}
