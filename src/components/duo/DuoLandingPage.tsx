import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ShieldCheck,
  PlayCircle,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Globe2,
  Calendar,
  Layers,
  Zap,
  Activity,
  Droplets,
  Radio,
  Sliders,
  Award,
  Clock,
  ExternalLink,
  Lock,
  Headphones,
  Check,
  Send,
  ShoppingCart,
  UserCheck,
  Share2,
  Sun,
  Moon,
  Laptop,
  Car,
  Home,
  Utensils,
  MapPin,
  Languages,
  X,
  Play
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { getProductPurchaseLink } from '@/config/productPurchaseLinks'
import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { localizedProductVideo } from '@/lib/productVideos'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
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
  'zah-naderi': '/leaders/standardized/zah-naderi-v3.png',
  'alex-gonzalez': '/leaders/standardized/alex-gonzalez.png',
  'ryan-pool': '/leaders/standardized/ryan-pool-sr.png',
  'magaly-cardona': '/leaders/standardized/magaly-cardona.png',
  emanuela: '/leaders/standardized/emanuela-doustova.png',
  'jesse-schexnayder': '/leaders/standardized/jesse-schexnayder.png',
  'angel-mok': '/leaders/standardized/angel-mok-v2.png',
}

const I18N = {
  en: {
    badge: 'THE TRUE LEGACY DUO',
    headline: 'TWO TECHNOLOGIES. ONE CONNECTED LIFESTYLE.',
    heroSub:
      'Discover how Kangen Water® and emGuarde® bring two different technologies into one modern approach to your everyday environment.',
    exploreDuoBtn: 'EXPLORE THE DUO',
    watchStoryBtn: 'WATCH THE STORY',
    talkWith: 'Talk to',
    sharedBy: 'Shared personally with you by',
    verifiedGuide: 'Verified Guide',
    verifiedLeader: 'Verified Leader',
    trustHighlights: [
      { label: 'Japanese Engineering', sub: 'Precision Craftsmanship' },
      { label: '8 Platinum Plates', sub: 'Electrolyzed Water' },
      { label: '3-Meter Ambient Range', sub: 'Environmental Coherence' },
      { label: 'Dual-Unit Protection', sub: 'Portable USB-C Set' },
    ],

    // Section 03: The Duo Equation
    equationEyebrow: 'THE DUO EQUATION',
    equationHeading: 'TWO TECHNOLOGIES. TWO PARTS OF EVERYDAY LIFE.',
    equationSub:
      'One focuses on the water you put into your body. The other on the modern environment surrounding your space.',
    waterCardTag: '01 · YOUR WATER',
    waterCardTitle: 'KANGEN WATER®',
    waterCardDesc:
      'Filters municipal tap water and uses 8 solid platinum-dipped titanium plates to produce 5 distinct water types for daily hydration, cooking, beauty care, and eco-friendly household cleaning.',
    waterCardCta: 'EXPLORE KANGEN →',
    envCardTag: '02 · YOUR ENVIRONMENT',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'A portable dual-unit technology engineered to harmonize electromagnetic environmental noise across a 3-meter radius without blocking Wi-Fi, Bluetooth, or cellular signals.',
    envCardCta: 'EXPLORE emGuarde →',
    duoBadge: 'THE DUO',
    duoBadgeSub: 'Two Distinct Technologies · One Conscious Lifestyle',

    // Section 04: Day in the Life
    dayHeading: 'FROM MORNING TO NIGHT.',
    daySub:
      'Experience how the Duo integrates seamlessly into modern living from first light to evening rest.',
    dayCards: [
      {
        time: '07:00 AM',
        period: 'MORNING RITUAL',
        title: 'Fresh Water at First Light',
        desc: 'Start your morning in a bright kitchen with a glass of freshly ionized 9.5pH Kangen Water. Clean, smooth, and deeply refreshing before the day begins.',
        badge: 'Kitchen · Hydration',
        icon: Sun,
      },
      {
        time: '11:00 AM',
        period: 'FOCUSED WORK',
        title: 'Technology Without the Noise',
        desc: 'emGuarde GO sits quietly on your desk next to your laptop, smartphone, and Wi-Fi router, harmonizing ambient environmental frequencies while you produce your best work.',
        badge: 'Workspace · Focus',
        icon: Laptop,
      },
      {
        time: '03:30 PM',
        period: 'ON THE MOVE',
        title: 'Freedom in Motion',
        desc: 'Take the rechargeable emGuarde GO with you to meetings, cafes, flights, or your commute, accompanied by your refillable water bottle for uninterrupted balance.',
        badge: 'Travel · Mobility',
        icon: Car,
      },
      {
        time: '08:00 PM',
        period: 'EVENING CALM',
        title: 'Sanctuary at Home',
        desc: 'Wash evening produce, prepare dinner with culinary Kangen Water, and unwind in a technology-harmonized home environment built for calm family recovery.',
        badge: 'Home · Restoration',
        icon: Moon,
      },
    ],

    // Section 05: Kangen Story
    kangenHeading: 'IT STARTS WITH YOUR WATER.',
    kangenSub:
      'The foundation of daily vitality begins with what you put into your body every single day. The Leveluk K8 transforms standard tap water into a versatile home resource.',
    kangenFeatures: [
      { title: '8 Platinum-Coated Titanium Plates', desc: 'Medical-grade electrolysis chambers designed for reliable performance and continuous output.' },
      { title: '5 Specialized Water Settings', desc: 'From 8.5–9.5pH drinking water to 5.5pH skin toner and 11.5pH food prep water.' },
      { title: 'Continuous On-Demand Flow', desc: 'Fresh water generated directly at your kitchen tap whenever you or your family need it.' },
      { title: '50 Years of Japanese Heritage', desc: 'Engineered and manufactured by Enagic in Osaka, Japan under strict ISO certifications.' },
    ],
    exploreKangenBtn: 'EXPLORE KANGEN WATER',

    // Section 06: Visual Transition
    transitionLine1: 'From the water that fuels your cells from the inside,',
    transitionLine2: 'to the technological environment that surrounds you from the outside.',

    // Section 07: emGuarde Story
    emguardeHeading: 'THEN LOOK AT THE ENVIRONMENT AROUND YOU.',
    emguardeSub:
      'Phones, laptops, Wi-Fi 6, smart cars, and wireless devices surround modern life. emGuarde brings harmony to your space without disconnecting you.',
    emguardeFeatures: [
      { title: 'Ambient Harmonic Resonance', desc: 'Harmonizes environmental electromagnetic noise without weakening your wireless reception.' },
      { title: 'Full Connectivity Maintained', desc: 'Your 5G, Wi-Fi, and Bluetooth continue operating at maximum speed and clarity.' },
      { title: 'Dual-Unit Synchronized Set', desc: 'Two compact devices provide coverage across your bedroom, office, or living areas.' },
      { title: 'USB-C Rechargeable Freedom', desc: 'Up to 72 hours of continuous operation per charge for effortless portability.' },
    ],
    emguardeDisclaimer:
      'Compliance Note: emGuarde GO is an environmental harmonizing device and is not intended to diagnose, treat, cure, or prevent any illness or medical condition.',
    exploreEmguardeBtn: 'EXPLORE emGuarde',

    // Section 08: Why the Duo
    whyDuoHeading: 'WHY TOGETHER?',
    whyDuoSub: 'Two distinct technologies. One intentional lifestyle.',
    whyDuoKangenRole: 'Focuses on the water you drink, cook with, and use throughout your home every day.',
    whyDuoEmguardeRole: 'Focuses on the modern electromagnetic environment surrounding your workspaces, commute, and rest.',
    whyDuoTogether: 'Together, they form a conscious dual-layer foundation for people who care about both their internal hydration and external living environment.',

    // Section 09: Comparison Matrix
    matrixHeading: 'TWO PRODUCTS. ONE DECISION.',
    matrixSub: 'Understand how each technology functions individually and why the Duo represents the complete lifestyle approach.',
    matrixHeaders: ['Category', 'Primary Environment', 'Everyday Role', 'Hardware Design', 'Best For'],
    matrixKangen: {
      name: 'KANGEN WATER®',
      cat: 'Water Ionization System',
      env: 'Home & Kitchen',
      role: 'Internal Hydration & Culinary Prep',
      hw: 'Leveluk K8 (8 Platinum Plates)',
      best: 'Families seeking pure, versatile water at the tap',
    },
    matrixEmguarde: {
      name: 'emGuarde®',
      cat: 'Environmental Harmonization',
      env: 'Home, Office & Travel',
      role: 'Ambient Coherence Around Devices',
      hw: 'emGuarde GO (Portable Dual-Unit Set)',
      best: 'Individuals surrounded by wireless technology',
    },
    matrixDuo: {
      name: 'TRUE LEGACY DUO',
      cat: 'Integrated Dual-Pillar Ecosystem',
      env: 'Everyday Life: Home to Motion',
      role: 'Complete Internal & External Care',
      hw: 'K8 System + emGuarde GO Dual Set',
      best: 'Conscious homes seeking complete daily balance',
    },

    // Section 10: Lifestyle Story
    lifestyleHeading: 'DESIGNED FOR THE WAY WE LIVE NOW.',
    lifestyleSub:
      'Modern homes are filled with connected screens, high-speed networks, and active schedules. The Duo brings calm and intentionality back to daily living.',
    lifestyleCards: [
      {
        title: 'Conscious Living',
        desc: 'Reduce reliance on single-use plastic bottles while enhancing everyday culinary meals with antioxidant-rich water.',
      },
      {
        title: 'Calm Productivity',
        desc: 'Work long hours in multi-screen environments with portable ambient harmonization beside your workstation.',
      },
      {
        title: 'Global Travel Freedom',
        desc: 'Take your emGuarde GO set across international time zones with standard USB-C charging for complete mobility.',
      },
    ],

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
    exploreIndSub: 'Want to focus on one technology first? Take an in-depth tour through either experience.',
    exploreIndK8Cta: 'EXPLORE KANGEN',
    exploreIndEmguardeCta: 'EXPLORE emGuarde',

    // Section 13: Distributor Guidance
    guidanceHeading: 'NOT SURE WHERE TO START?',
    guidanceSub:
      'Connect directly with your verified guide to discuss regional availability, shipping, installation, and custom recommendations for your space.',
    messageWhatsApp: 'Message on WhatsApp',
    requestInfo: 'Request Information',

    // Section 14: FAQ
    faqHeading: 'FREQUENTLY ASKED QUESTIONS',
    faqs: [
      {
        q: 'What is the True Legacy Duo?',
        a: 'The True Legacy Duo brings together two independent Japanese technologies: the Leveluk K8 water ionization system for your drinking and household water, and the portable emGuarde GO set for your electromagnetic environment.',
      },
      {
        q: 'Are Kangen and emGuarde the same technology?',
        a: 'No. They are two distinct, complementary technologies. Kangen Water is a physical water electrolysis system that alters pH and creates antioxidant water. emGuarde is an electronic environmental device that harmonizes ambient electromagnetic frequencies.',
      },
      {
        q: 'Can I explore or purchase Kangen separately?',
        a: 'Yes. You can explore and purchase the Leveluk K8 individually at any time. Your distributor will provide the specific pricing, regional shipping options, and faucet compatibility details.',
      },
      {
        q: 'Can I explore or purchase emGuarde separately?',
        a: 'Yes. The emGuarde GO set can be ordered on its own as a standalone portable environmental solution.',
      },
      {
        q: 'Where is the Duo available globally?',
        a: 'Enagic distributes globally across North America, Latin America, Europe, Asia, and Australia. Specific voltage standards and local delivery times are confirmed directly with your distributor.',
      },
      {
        q: 'How do I order and what are the payment options?',
        a: 'Orders are processed through authorized distributor channels with official Enagic manufacturer warranty protection. Flexible installment and financing options are available in multiple markets.',
      },
      {
        q: 'Can I speak with a distributor first before ordering?',
        a: 'Absolutely. We encourage speaking directly with your distributor to ensure the setup matches your kitchen faucet, household habits, and travel schedule.',
      },
    ],

    // Section 15: Final CTA
    finalHeading: 'YOUR WATER. YOUR ENVIRONMENT. YOUR NEXT STEP.',
    finalSub: 'Explore two technologies designed for different parts of modern life.',
    finalPrimaryCta: 'EXPLORE THE DUO',
    finalSecondaryCta: 'TALK TO',
    finalTrust: 'Direct Distributor Attribution · Official Manufacturer Warranty · Global Support',
  },

  es: {
    badge: 'EL DÚO TRUE LEGACY',
    headline: 'DOS TECNOLOGÍAS. UN ESTILO DE VIDA CONECTADO.',
    heroSub:
      'Descubre cómo Agua Kangen® y emGuarde® unen dos tecnologías complementarias en un enfoque moderno para tu entorno cotidiano.',
    exploreDuoBtn: 'EXPLORAR EL DÚO',
    watchStoryBtn: 'VER LA HISTORIA',
    talkWith: 'Hablar con',
    sharedBy: 'Compartido personalmente contigo por',
    verifiedGuide: 'Guía Verificado',
    verifiedLeader: 'Líder Verificado',
    trustHighlights: [
      { label: 'Ingeniería Japonesa', sub: 'Precisión y Calidad' },
      { label: '8 Placas de Platino', sub: 'Agua Electrolizada' },
      { label: 'Alcance de 3 Metros', sub: 'Coherencia Ambiental' },
      { label: 'Set Dual Portátil', sub: 'Carga USB-C' },
    ],

    equationEyebrow: 'LA ECUACIÓN DEL DÚO',
    equationHeading: 'DOS TECNOLOGÍAS. DOS PARTES DE LA VIDA DIARIA.',
    equationSub:
      'Una se enfoca en el agua que introduces en tu cuerpo. La otra en el entorno tecnológico que rodea tus espacios.',
    waterCardTag: '01 · TU AGUA',
    waterCardTitle: 'AGUA KANGEN®',
    waterCardDesc:
      'Filtra el agua del grifo y utiliza 8 placas de titanio bañadas en platino para producir 5 tipos de agua para hidratación, cocina, belleza y limpieza ecológica.',
    waterCardCta: 'EXPLORAR KANGEN →',
    envCardTag: '02 · TU ENTORNO',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'Tecnología portátil de dos unidades diseñada para armonizar el ruido electromagnético en un radio de 3 metros sin bloquear las señales de Wi-Fi, Bluetooth o celular.',
    envCardCta: 'EXPLORAR emGuarde →',
    duoBadge: 'EL DÚO',
    duoBadgeSub: 'Dos Tecnologías Distintas · Un Estilo de Vida Consciente',

    dayHeading: 'DE LA MAÑANA A LA NOCHE.',
    daySub:
      'Descubre cómo el Dúo se integra con naturalidad en tu rutina diaria desde el amanecer hasta el descanso nocturno.',
    dayCards: [
      {
        time: '07:00 AM',
        period: 'RITUAL MATUTINO',
        title: 'Agua Fresca al Amanecer',
        desc: 'Comienza tu día en la cocina con un vaso de Agua Kangen a pH 9.5 recién ionizada. Hidratación limpia, suave y profunda.',
        badge: 'Cocina · Hidratación',
        icon: Sun,
      },
      {
        time: '11:00 AM',
        period: 'TRABAJO Y ENFOQUE',
        title: 'Tecnología sin Ruido',
        desc: 'emGuarde GO reposa junto a tu portátil y teléfono, armonizando el entorno mientras mantienes tu concentración.',
        badge: 'Oficina · Claridad',
        icon: Laptop,
      },
      {
        time: '03:30 PM',
        period: 'EN MOVIMIENTO',
        title: 'Libertad en Tus Desplazamientos',
        desc: 'Lleva tu emGuarde GO recargable en tus viajes, reuniones o vehículo, manteniendo tu bienestar donde vayas.',
        badge: 'Viajes · Movilidad',
        icon: Car,
      },
      {
        time: '08:00 PM',
        period: 'CALMA VESPERTINA',
        title: 'Santuario en el Hogar',
        desc: 'Lava alimentos, cocina con agua pura y descansa en un espacio armonizado creado para el bienestar familiar.',
        badge: 'Hogar · Descanso',
        icon: Moon,
      },
    ],

    kangenHeading: 'TODO COMIENZA CON EL AGUA.',
    kangenSub:
      'La base del bienestar comienza con lo que introduces en tu cuerpo cada día. El Leveluk K8 transforma el agua del grifo en una fuente vital para todo el hogar.',
    kangenFeatures: [
      { title: '8 Placas de Titanio y Platino', desc: 'Cámaras de electrólisis de grado médico para un flujo continuo y duradero.' },
      { title: '5 Tipos de Agua pH', desc: 'Desde agua de bebida (8.5–9.5pH) hasta agua de belleza y desinfección de cocina.' },
      { title: 'Flujo Continuo al Instante', desc: 'Agua fresca disponible directamente en tu grifo, sin almacenar botellas de plástico.' },
      { title: '50 Años de Historia Japonesa', desc: 'Fabricado por Enagic en Osaka, Japón, bajo estrictas certificaciones ISO.' },
    ],
    exploreKangenBtn: 'EXPLORAR AGUA KANGEN',

    transitionLine1: 'Desde el agua que nutre tus células desde el interior,',
    transitionLine2: 'hasta el entorno tecnológico que te rodea en el exterior.',

    emguardeHeading: 'LUEGO OBSERVA EL ENTORNO QUE TE RODEA.',
    emguardeSub:
      'Dispositivos inalámbricos, redes Wi-Fi y pantallas están presentes en todo momento. emGuarde aporta calma ambiental a tus espacios sin desconectarte.',
    emguardeFeatures: [
      { title: 'Resonancia Armónica Ambiental', desc: 'Armoniza el ruido electromagnético sin afectar la calidad de tu señal inalámbrica.' },
      { title: 'Conectividad Total Sin Interferencias', desc: 'Tus redes 5G, Wi-Fi y Bluetooth continúan funcionando con máxima velocidad.' },
      { title: 'Set Sincronizado de Dos Unidades', desc: 'Dos dispositivos compactos para cubrir dormitorios, despachos o zonas de estar.' },
      { title: 'Batería Recargable USB-C', desc: 'Hasta 72 horas de autonomía por carga para total libertad de movimiento.' },
    ],
    emguardeDisclaimer:
      'Nota regulatoria: emGuarde GO es un dispositivo de armonización ambiental y no tiene como objetivo diagnosticar, tratar, curar ni prevenir ninguna enfermedad.',
    exploreEmguardeBtn: 'EXPLORAR emGuarde',

    whyDuoHeading: '¿POR QUÉ JUNTOS?',
    whyDuoSub: 'Dos tecnologías diferentes. Una visión intencional del bienestar.',
    whyDuoKangenRole: 'Se ocupa del agua que bebes, cocinas y utilizas en tu hogar todos los días.',
    whyDuoEmguardeRole: 'Se ocupa del entorno electromagnético que rodea tus áreas de trabajo y descanso.',
    whyDuoTogether: 'Juntos proporcionan una base integral para familias y profesionales que buscan cuidar tanto su bienestar interno como su entorno cotidiano.',

    matrixHeading: 'DOS PRODUCTOS. UNA DECISIÓN.',
    matrixSub: 'Conoce cómo funciona cada tecnología individualmente y por qué el Dúo representa la experiencia más completa.',
    matrixHeaders: ['Categoría', 'Entorno Principal', 'Función Cotidiana', 'Diseño de Hardware', 'Ideal Para'],
    matrixKangen: {
      name: 'AGUA KANGEN®',
      cat: 'Ionización Médica de Agua',
      env: 'Hogar y Cocina',
      role: 'Hidratación y Cocina Pura',
      hw: 'Leveluk K8 (8 Placas de Platino)',
      best: 'Familias que desean agua limpia y antioxidante en casa',
    },
    matrixEmguarde: {
      name: 'emGuarde®',
      cat: 'Armonización Ambiental',
      env: 'Oficina, Viajes y Hogar',
      role: 'Coherencia en Entornos con Dispositivos',
      hw: 'emGuarde GO (Set Portátil Dual)',
      best: 'Personas rodeadas de tecnología y redes inalámbricas',
    },
    matrixDuo: {
      name: 'DÚO TRUE LEGACY',
      cat: 'Ecosistema Integral de Dos Pilares',
      env: 'Vida Completa: De Casa a Viajes',
      role: 'Cuidado Interno y Externo Simultáneo',
      hw: 'K8 + Set Dual emGuarde GO',
      best: 'Hogares conscientes que desean equilibrio total',
    },

    lifestyleHeading: 'DISEÑADO PARA CÓMO VIVIMOS HOY.',
    lifestyleSub:
      'Nuestras vidas combinan pantallas, viajes y rutinas dinámicas. El Dúo devuelve armonía e intención a cada jornada.',
    lifestyleCards: [
      {
        title: 'Vida Consciente',
        desc: 'Reduce el uso de botellas de plástico y cocina con agua antioxidante que realza los sabores naturales.',
      },
      {
        title: 'Productividad y Calma',
        desc: 'Trabaja con serenidad en despachos rodeados de monitores y dispositivos inalámbricos.',
      },
      {
        title: 'Movilidad Global',
        desc: 'Lleva tu set portátil emGuarde a cualquier destino con carga estándar USB-C y autonomía prolongada.',
      },
    ],

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
      'Conversa directamente con tu guía verificado sobre disponibilidad, envíos, instalación y opciones recomendadas para tu hogar.',
    messageWhatsApp: 'Enviar Mensaje por WhatsApp',
    requestInfo: 'Solicitar Información',

    faqHeading: 'PREGUNTAS FRECUENTES',
    faqs: [
      {
        q: '¿Qué es el Dúo True Legacy?',
        a: 'El Dúo combina dos tecnologías japonesas complementarias: el ionizador Leveluk K8 para tu agua potable y del hogar, y el set portátil emGuarde GO para armonizar tu entorno electromagnético.',
      },
      {
        q: '¿Kangen y emGuarde son la misma tecnología?',
        a: 'No. Son tecnologías completamente distintas e independientes. Kangen es un sistema de electrólisis de agua. emGuarde es un dispositivo electrónico de armonización ambiental.',
      },
      {
        q: '¿Puedo comprar solo el Leveluk K8?',
        a: 'Sí, puedes adquirir el K8 por separado en cualquier momento con su garantía oficial de fábrica.',
      },
      {
        q: '¿Puedo comprar solo emGuarde GO?',
        a: 'Sí, el set emGuarde GO se puede ordenar de forma individual para protección portátil en tu día a día.',
      },
      {
        q: '¿Dónde está disponible el Dúo?',
        a: 'Enagic cuenta con oficinas y envíos en más de 40 países. Tu distribuidor confirmará el voltaje y disponibilidad exacta de tu mercado.',
      },
      {
        q: '¿Cuáles son las facilidades de pago?',
        a: 'Existen planes de financiamiento y pago a plazos en numerosos países según tu localidad.',
      },
      {
        q: '¿Puedo hablar con mi distribuidor antes de comprar?',
        a: 'Por supuesto. Te recomendamos conversar primero para resolver cualquier duda sobre instalación y compatibilidad de grifos.',
      },
    ],

    finalHeading: 'TU AGUA. TU ENTORNO. TU SIGUIENTE PASO.',
    finalSub: 'Dos tecnologías pensadas para dos dimensiones de la vida moderna.',
    finalPrimaryCta: 'EXPLORAR EL DÚO',
    finalSecondaryCta: 'HABLAR CON',
    finalTrust: 'Atribución Directa · Garantía Oficial de Fábrica · Soporte Global',
  },

  fr: {
    badge: 'LE DUO TRUE LEGACY',
    headline: 'DEUX TECHNOLOGIES. UN STYLE DE VIE CONNECTÉ.',
    heroSub:
      'Découvrez comment Kangen Water® et emGuarde® réunissent deux technologies complémentaires pour une approche moderne de votre environnement quotidien.',
    exploreDuoBtn: 'EXPLORER LE DUO',
    watchStoryBtn: 'VOIR LA PRÉSENTATION',
    talkWith: 'Parler à',
    sharedBy: 'Partagé personnellement avec vous par',
    verifiedGuide: 'Guide Vérifié',
    verifiedLeader: 'Leader Vérifié',
    trustHighlights: [
      { label: 'Ingénierie Japonaise', sub: 'Précision et Savoir-Faire' },
      { label: '8 Plaques Titane Platine', sub: 'Eau Électrolysée' },
      { label: 'Rayon de 3 Mètres', sub: 'Harmonisation Ambiante' },
      { label: 'Set Dual Portatif', sub: 'Recharge USB-C' },
    ],
    equationEyebrow: 'L’ÉQUATION DU DUO',
    equationHeading: 'DEUX TECHNOLOGIES. DEUX FACETTES DU QUOTIDIEN.',
    equationSub:
      'L’une veille sur l’eau que vous buvez. L’autre harmonise l’environnement technologique qui vous entoure.',
    waterCardTag: '01 · VOTRE EAU',
    waterCardTitle: 'KANGEN WATER®',
    waterCardDesc:
      'Filtre l’eau du robinet et utilise 8 plaques de titane trempées dans le platine pour produire 5 types d’eau pour l’hydratation, la cuisine et l’entretien naturel.',
    waterCardCta: 'EXPLORER KANGEN →',
    envCardTag: '02 · VOTRE ENVIRONNEMENT',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'Technologie portative à deux unités conçue pour harmoniser les ondes électromagnétiques ambiantes sur un rayon de 3 mètres sans bloquer le Wi-Fi ni le réseau.',
    envCardCta: 'EXPLORER emGuarde →',
    duoBadge: 'LE DUO',
    duoBadgeSub: 'Deux Technologies Distinctes · Un Mode de Vie Conscient',
    dayHeading: 'DU MATIN JUSQU’AU SOIR.',
    daySub: 'Découvrez comment le Duo s’intègre naturellement dans votre quotidien, du lever au coucher.',
    dayCards: [
      { time: '07:00', period: 'RÉVEIL MATINAL', title: 'Une Eau Fraîche au Lever', desc: 'Commencez votre journée avec un verre d’eau Kangen à pH 9.5 fraîchement ionisée.', badge: 'Cuisine · Hydratation', icon: Sun },
      { time: '11:00', period: 'CONCENTRATION', title: 'Technologie sans Stress', desc: 'emGuarde GO repose sur votre bureau près de vos écrans et harmonise l’espace de travail.', badge: 'Bureau · Focus', icon: Laptop },
      { time: '15:30', period: 'EN DÉPLACEMENT', title: 'Liberté en Mouvement', desc: 'Emmenez emGuarde GO lors de vos trajets, réunions et voyages pour un confort constant.', badge: 'Voyage · Mobilité', icon: Car },
      { time: '20:00', period: 'SÉRÉNITÉ DU SOIR', title: 'Sanctuaire Familial', desc: 'Préparez le dîner avec une eau culinaire saine et profitez d’un foyer apaisé.', badge: 'Maison · Repos', icon: Moon },
    ],
    kangenHeading: 'TOUT COMMENCE PAR VOTRE EAU.',
    kangenSub: 'La base du bien-être commence par l’eau que vous consommez chaque jour. Le Leveluk K8 transforme l’eau ordinaire en ressource vitale.',
    kangenFeatures: [
      { title: '8 Plaques Titane Platine', desc: 'Chambres d’électrolyse de qualité médicale pour un débit régulier et durable.' },
      { title: '5 Réglages d’Eau pH', desc: 'De l’eau de boisson (8.5–9.5pH) à l’eau de beauté et à la désinfection naturelle.' },
      { title: 'Eau Fraîche en Continu', desc: 'Production illimitée au robinet, sans bouteilles plastiques à transporter.' },
      { title: '50 Ans d’Expertise Japonaise', desc: 'Conçu et assemblé par Enagic à Osaka selon les normes ISO les plus strictes.' },
    ],
    exploreKangenBtn: 'EXPLORER KANGEN WATER',
    transitionLine1: 'De l’eau qui nourrit vos cellules de l’intérieur,',
    transitionLine2: 'à l’environnement technologique qui vous entoure à l’extérieur.',
    emguardeHeading: 'REGARDEZ ENSUITE L’ENVIRONNEMENT AUTOUR DE VOUS.',
    emguardeSub: 'Smartphones, Wi-Fi 6 et écrans font partie intégrante de nos vies. emGuarde apporte une harmonie ambiante sans jamais vous couper du monde.',
    emguardeFeatures: [
      { title: 'Résonance Harmonique Ambiante', desc: 'Harmonise les bruits électromagnétiques sans affaiblir votre réception sans fil.' },
      { title: 'Connectivité Totale Préservée', desc: 'Vos connexions 5G, Wi-Fi et Bluetooth fonctionnent à pleine puissance.' },
      { title: 'Set Synchronisé de Deux Unités', desc: 'Deux appareils compacts pour couvrir chambres, bureaux et espaces de vie.' },
      { title: 'Batterie Rechargeable USB-C', desc: 'Jusqu’à 72 heures d’autonomie par charge pour vous suivre partout.' },
    ],
    emguardeDisclaimer: 'Note de conformité : emGuarde GO est un dispositif d’harmonisation environnementale et n’a pas vocation à diagnostiquer, traiter ou guérir une maladie.',
    exploreEmguardeBtn: 'EXPLORER emGuarde',
    whyDuoHeading: 'POURQUOI ENSEMBLE ?',
    whyDuoSub: 'Deux technologies différentes. Une même démarche consciente.',
    whyDuoKangenRole: 'Prend soin de l’eau que vous buvez et utilisez au quotidien chez vous.',
    whyDuoEmguardeRole: 'Prend soin de l’atmosphère électromagnétique entourant vos espaces de travail et de repos.',
    whyDuoTogether: 'Ensemble, ils créent une double protection moderne pour votre foyer et vos déplacements.',
    matrixHeading: 'DEUX PRODUITS. UNE DÉCISION.',
    matrixSub: 'Comprenez chaque technologie et découvrez pourquoi le Duo offre la réponse la plus globale.',
    matrixHeaders: ['Catégorie', 'Environnement', 'Rôle Quotidien', 'Matériel', 'Idéal Pour'],
    matrixKangen: { name: 'KANGEN WATER®', cat: 'Ionisation Médicale', env: 'Cuisine & Maison', role: 'Hydratation & Cuisine', hw: 'Leveluk K8 (8 Plaques)', best: 'Les familles souhaitant une eau antioxydante au robinet' },
    matrixEmguarde: { name: 'emGuarde®', cat: 'Harmonisation Ambiante', env: 'Bureau, Voyage & Maison', role: 'Cohérence Ambiante', hw: 'emGuarde GO (Set Portatif)', best: 'Les personnes entourées d’appareils connectés' },
    matrixDuo: { name: 'DUO TRUE LEGACY', cat: 'Écosystème Global 2 Piliers', env: 'Vie Quotidienne & Déplacements', role: 'Équilibre Interne & Externe', hw: 'K8 + Set emGuarde GO', best: 'Les foyers soucieux d’un bien-être complet' },
    lifestyleHeading: 'CONÇU POUR NOTRE FAÇON DE VIVRE.',
    lifestyleSub: 'Des foyers dynamiques et connectés qui recherchent la tranquillité et l’harmonie.',
    lifestyleCards: [
      { title: 'Vie Conscient', desc: 'Supprimez le plastique jetable et cuisinez avec une eau riche en antioxydants.' },
      { title: 'Focus & Calme', desc: 'Travaillez sereinement devant vos écrans avec une harmonisation portative.' },
      { title: 'Mobilité Sans Limites', desc: 'Emportez emGuarde partout grâce à sa recharge universelle USB-C.' },
    ],
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
    guidanceSub: 'Échangez directement avec votre distributeur certifié pour poser vos questions et vérifier la disponibilité.',
    messageWhatsApp: 'Message sur WhatsApp',
    requestInfo: 'Demander des Informations',
    faqHeading: 'QUESTIONS FRÉQUEMMENT POSÉES',
    faqs: [
      { q: 'Qu’est-ce que le Duo True Legacy ?', a: 'Le Duo associe l’ioniseur d’eau K8 et le set de résonance électromagnétique emGuarde GO pour une approche globale de votre quotidien.' },
      { q: 'S’agit-il de la même technologie ?', a: 'Non, ce sont deux technologies différentes. Kangen traite l’eau par électrolyse. emGuarde harmonise votre environnement électromagnétique.' },
      { q: 'Puis-je commander le K8 seul ?', a: 'Oui, le Leveluk K8 est disponible seul avec sa garantie officielle Enagic de 5 ans.' },
      { q: 'Puis-je commander emGuarde seul ?', a: 'Oui, le set emGuarde GO peut être commandé séparément.' },
      { q: 'Où le Duo est-il disponible ?', a: 'Enagic expédie dans plus de 150 pays à travers son réseau mondial d’agences.' },
      { q: 'Quelles sont les facilités de paiement ?', a: 'Des facilités de financement en plusieurs fois sont disponibles selon votre pays.' },
      { q: 'Puis-je échanger avec mon guide avant de commander ?', a: 'Absolument, votre distributeur est là pour répondre à toutes vos questions avant tout achat.' },
    ],
    finalHeading: 'VOTRE EAU. VOTRE ENVIRONNEMENT. VOTRE PROCHAINE ÉTAPE.',
    finalSub: 'Deux technologies créées pour deux dimensions essentielles de la vie moderne.',
    finalPrimaryCta: 'EXPLORER LE DUO',
    finalSecondaryCta: 'PARLER AVEC',
    finalTrust: 'Attribution Directe · Garantie Constructeur · Support Mondial',
  },

  pt: {
    badge: 'O DUO TRUE LEGACY',
    headline: 'DUAS TECNOLOGIAS. UM ESTILO DE VIDA CONECTADO.',
    heroSub:
      'Descubra como Água Kangen® e emGuarde® unem duas tecnologias distintas para cuidar do seu ambiente cotidiano.',
    exploreDuoBtn: 'EXPLORAR O DUO',
    watchStoryBtn: 'VER A APRESENTAÇÃO',
    talkWith: 'Falar com',
    sharedBy: 'Compartilhado pessoalmente com você por',
    verifiedGuide: 'Guia Verificado',
    verifiedLeader: 'Líder Verificado',
    trustHighlights: [
      { label: 'Engenharia Japonesa', sub: 'Precisão e Qualidade' },
      { label: '8 Placas de Platina', sub: 'Água Eletrolisada' },
      { label: 'Alcance de 3 Metros', sub: 'Harmonização Ambiental' },
      { label: 'Set Dual Portátil', sub: 'Carga USB-C' },
    ],
    equationEyebrow: 'A EQUAÇÃO DO DUO',
    equationHeading: 'DUAS TECNOLOGIAS. DUAS PARTES DO SEU DIA A DIA.',
    equationSub:
      'Uma foca na água que você consome. A outra no ambiente eletromagnético ao redor dos seus espaços.',
    waterCardTag: '01 · SUA ÁGUA',
    waterCardTitle: 'ÁGUA KANGEN®',
    waterCardDesc:
      'Filtra a água da torneira e usa 8 placas de titânio banhadas a platina para produzir 5 tipos de água para beber, cozinhar e cuidar da casa.',
    waterCardCta: 'EXPLORAR KANGEN →',
    envCardTag: '02 · SEU AMBIENTE',
    envCardTitle: 'emGuarde®',
    envCardDesc:
      'Tecnologia portátil de duas unidades para harmonizar frequências em um raio de 3 metros sem bloquear Wi-Fi nem sinal de celular.',
    envCardCta: 'EXPLORAR emGuarde →',
    duoBadge: 'O DUO',
    duoBadgeSub: 'Duas Tecnologias Diferentes · Um Estilo de Vida Consciente',
    dayHeading: 'DA MANHÃ À NOITE.',
    daySub: 'Veja como o Duo se encaixa perfeitamente na rotina da sua família, do amanhecer ao descanso.',
    dayCards: [
      { time: '07:00', period: 'RITUAL MATINAL', title: 'Água Pura ao Acordar', desc: 'Comece a manhã com um copo de Água Kangen a pH 9.5 recém-ionizada.', badge: 'Cozinha · Hidratação', icon: Sun },
      { time: '11:00', period: 'FOCO NO TRABALHO', title: 'Tecnologia sem Ruído', desc: 'emGuarde GO ao lado do seu notebook e celular harmonizando o ambiente.', badge: 'Escritório · Foco', icon: Laptop },
      { time: '15:30', period: 'EM MOVIMENTO', title: 'Liberdade onde For', desc: 'Leve seu set recarregável em viagens, reuniões e no trânsito.', badge: 'Viagem · Mobilidade', icon: Car },
      { time: '20:00', period: 'DESCANSO NOTURNO', title: 'Harmonia no Lar', desc: 'Lave alimentos, prepare o jantar e relaxe em um ambiente acolhedor.', badge: 'Casa · Repouso', icon: Moon },
    ],
    kangenHeading: 'TUDO COMEÇA PELA SUA ÁGUA.',
    kangenSub: 'A base da saúde começa pela água que você bebe. O Leveluk K8 transforma água comum em uma fonte viva para toda a família.',
    kangenFeatures: [
      { title: '8 Placas de Titânio e Platina', desc: 'Câmaras de eletrólise médica para fluxo contínuo e máxima durabilidade.' },
      { title: '5 Tipos de Água pH', desc: 'Para beber (8.5–9.5pH), beleza da pele (5.5pH) e higienização culinária.' },
      { title: 'Produção Contínua na Torneira', desc: 'Água fresca imediata sem acumular garrafas plásticas descartáveis.' },
      { title: '50 Anos de Tradição Japonesa', desc: 'Fabricado pela Enagic em Osaka, Japão, sob rígidos padrões ISO.' },
    ],
    exploreKangenBtn: 'EXPLORAR ÁGUA KANGEN',
    transitionLine1: 'Da água que nutre o seu corpo por dentro,',
    transitionLine2: 'ao ambiente tecnológico que envolve o seu espaço por fora.',
    emguardeHeading: 'DEPOIS, OLHE PARA O AMBIENTE AO SEU REDOR.',
    emguardeSub: 'Dispositivos sem fio e telas estão presentes em toda parte. emGuarde traz harmonia aos seus espaços sem desconectar você.',
    emguardeFeatures: [
      { title: 'Ressonância Harmônica Ambiental', desc: 'Harmoniza frequências sem enfraquecer o sinal dos seus aparelhos.' },
      { title: 'Conectividade Total', desc: 'Seu Wi-Fi, 5G e Bluetooth continuam operando com máxima velocidade.' },
      { title: 'Set Sincronizado com 2 Unidades', desc: 'Dois aparelhos compactos para proteger quartos, escritórios e salas.' },
      { title: 'Bateria Recarregável USB-C', desc: 'Até 72 horas de autonomia por carga para acompanhar seu estilo de vida.' },
    ],
    emguardeDisclaimer: 'Nota regulatória: emGuarde GO é um dispositivo de harmonização ambiental e não tem como objetivo diagnosticar, tratar ou curar doenças.',
    exploreEmguardeBtn: 'EXPLORAR emGuarde',
    whyDuoHeading: 'POR QUE JUNTOS?',
    whyDuoSub: 'Duas tecnologias diferentes. Uma decisão consciente de vida.',
    whyDuoKangenRole: 'Cuida da água que você bebe, cozinha e utiliza no seu lar.',
    whyDuoEmguardeRole: 'Cuida do ambiente eletromagnético ao redor do seu trabalho e repouso.',
    whyDuoTogether: 'Juntos, formam uma base completa para quem valoriza saúde interna e serenidade externa.',
    matrixHeading: 'DOIS PRODUTOS. UMA DECISÃO.',
    matrixSub: 'Entenda cada tecnologia e veja por que o Duo é a solução mais abrangente.',
    matrixHeaders: ['Categoria', 'Ambiente Principal', 'Papel Diário', 'Hardware', 'Ideal Para'],
    matrixKangen: { name: 'ÁGUA KANGEN®', cat: 'Ionizador Médico de Água', env: 'Casa e Cozinha', role: 'Hidratação e Culinária', hw: 'Leveluk K8 (8 Placas)', best: 'Famílias que buscam água pura e antioxidante' },
    matrixEmguarde: { name: 'emGuarde®', cat: 'Harmonizador Ambiental', env: 'Escritório, Viagens e Casa', role: 'Coerência ao Redor de Aparelhos', hw: 'emGuarde GO (Set Portátil)', best: 'Pessoas cercadas por tecnologias sem fio' },
    matrixDuo: { name: 'DUO TRUE LEGACY', cat: 'Ecossistema de 2 Pilares', env: 'Vida Completa: De Casa a Viagens', role: 'Cuidado Interno e Externo', hw: 'K8 + Set emGuarde GO', best: 'Lares que desejam equilíbrio absoluto' },
    lifestyleHeading: 'DESENHADO PARA O MODO COMO VIVEMOS HOJE.',
    lifestyleSub: 'Lares conectados e modernos que valorizam bem-estar e equilíbrio diário.',
    lifestyleCards: [
      { title: 'Vida Consciente', desc: 'Elimine garrafas plásticas e cozinhe com água que valoriza os nutrientes.' },
      { title: 'Foco e Tranquilidade', desc: 'Trabalhe com clareza em ambientes cercados por telas e roteadores.' },
      { title: 'Mobilidade Global', desc: 'Leve seu set emGuarde para onde for com recarga universal USB-C.' },
    ],
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
    guidanceSub: 'Converse diretamente com o seu guia verificado sobre opções, frete e instalação.',
    messageWhatsApp: 'Enviar Mensagem no WhatsApp',
    requestInfo: 'Solicitar Informações',
    faqHeading: 'PERGUNTAS FREQUENTES',
    faqs: [
      { q: 'O que é o Duo True Legacy?', a: 'O Duo reúne o ionizador Leveluk K8 e o harmonizador emGuarde GO para uma experiência completa de bem-estar.' },
      { q: 'São a mesma tecnologia?', a: 'Não. Kangen é um sistema de eletrólise de água e emGuarde é um dispositivo de ressonância ambiental.' },
      { q: 'Posso adquirir apenas o K8?', a: 'Sim, o Leveluk K8 pode ser adquirido individualmente com garantia oficial de 5 anos da Enagic.' },
      { q: 'Posso adquirir apenas o emGuarde?', a: 'Sim, o set portátil emGuarde GO está disponível de forma avulsa.' },
      { q: 'Onde o Duo está disponível?', a: 'A Enagic possui distribuição oficial para mais de 150 países.' },
      { q: 'Quais são as opções de pagamento?', a: 'Existem opções de parcelamento e financiamento de acordo com o seu país.' },
      { q: 'Posso conversar com meu guia antes de comprar?', a: 'Com certeza. Recomendamos conversar para verificar a compatibilidade com sua torneira e rotina.' },
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

  const equationRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const distributorRef = useRef<HTMLDivElement>(null)

  const distributorSlugActive = propSlug || routeSlug || 'mehdi-cohen'
  const t = I18N[locale as keyof typeof I18N] || I18N.en

  // Load profile if not provided
  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
      return
    }
    let active = true
    getPublicDistributors().then((items) => {
      if (!active) return
      const found = items.find((item) => item.slug === distributorSlugActive)
      setProfile(found || null)
    })
    return () => {
      active = false
    }
  }, [propProfile, distributorSlugActive])

  // Track page visit
  useEffect(() => {
    if (distributorSlugActive && crmSupabase) {
      void crmSupabase.rpc('crm_track_share_click', {
        p_slug: distributorSlugActive,
        p_campaign: 'duo',
        p_locale: locale,
      })
    }
  }, [distributorSlugActive, locale])

  const distributorName = profile?.display_name || 'True Legacy Leader'
  const distributorFirstName = distributorName.split(' ')[0] || 'Leader'
  const leaderPhoto =
    profile?.avatar_url ||
    (profile?.slug && getLeaderPortrait(profile.slug, LEADER_PORTRAITS[profile.slug])) ||
    '/leaders/standardized/mehdi-cohen.png'

  const whatsappPhone = profile?.phone ? profile.phone.replace(/\D/g, '') : '18649072149'

  const getWhatsAppMessage = () => {
    switch (locale) {
      case 'es':
        return `Hola ${distributorFirstName}, estuve revisando la página del True Legacy Duo y me gustaría conversar sobre las tecnologías y opciones disponibles.`
      case 'fr':
        return `Bonjour ${distributorFirstName}, j'ai visité la page du True Legacy Duo et j'aimerais échanger sur les technologies et les options disponibles.`
      case 'pt':
        return `Olá ${distributorFirstName}, estive vendo a página do True Legacy Duo e gostaria de conversar sobre as opções e tecnologias.`
      default:
        return `Hi ${distributorFirstName}, I visited the True Legacy Duo page and would like to learn more about both technologies and options.`
    }
  }

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`
  const applyUrl = `/apply?ref=${profile?.referral_code || distributorSlugActive}&interest=duo&source=duo`

  const scrollToEquation = () => {
    equationRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToDistributor = () => {
    distributorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const videoK8Url = localizedProductVideo('kangenWater', locale)
  const videoEmguardeUrl = localizedProductVideo('emguardeGo', locale)

  // Direct paths to dedicated sub-experiences with attribution preserved
  const kangenPageUrl = `/d/${distributorSlugActive}/kangen?source=duo&interest=product`
  const emguardePageUrl = `/d/${distributorSlugActive}/emguarde?source=duo&interest=duo`

  return (
    <div className="min-h-screen bg-[#03050a] text-[#f5f5f7] font-sans antialiased selection:bg-cyan-500/30 selection:text-white relative">
      <SEO
        title={`True Legacy Duo | ${distributorName}`}
        description={`${t.headline} — ${t.heroSub}`}
        image="/duo/duo-cinematic-hero.jpg"
      />

      {/* ========================================================================= */}
      {/* 01. STICKY TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#040711]/90 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Back to Profile + True Legacy Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={`/d/${encodeURIComponent(distributorSlugActive)}`}
              label="Back to Profile"
            />
            <Link to="/" className="flex items-center gap-3 group">
              <TrueLegacyLogo variant="nav" />
            </Link>
          </div>

          {/* Center / Right: Dynamic Distributor Identity Pill + Language + Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Distributor Badge */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 backdrop-blur-md">
              <div className="h-6 w-6 rounded-full overflow-hidden border border-cyan-400/40">
                <img src={leaderPhoto} alt={distributorName} className="h-full w-full object-cover object-top" />
              </div>
              <span className="text-xs font-medium text-slate-300">
                {distributorFirstName} · <strong className="text-cyan-400">{t.verifiedGuide}</strong>
              </span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold notranslate" translate="no">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  className={`px-2.5 py-1 rounded-md transition-all uppercase tracking-wider font-bold notranslate ${
                    locale === lang
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-bold'
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                  title={`Switch to ${lang.toUpperCase()}`}
                  translate="no"
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Message Distributor Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  location: 'duo_nav_header',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/15 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t.talkWith} {distributorFirstName}</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 02. FULL-WIDTH CINEMATIC HERO */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden border-b border-white/10 bg-[#03050a] pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28">
        {/* Atmosphere Background Glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[150px]" />
          <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/08 blur-[160px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-blue-600/08 blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Pill & Headline */}
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t.badge}</span>
            </div>

            <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              {t.headline}
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-[#c9ced7] leading-relaxed">
              {t.heroSub}
            </p>

            {/* Personalized Guide Attribution Banner */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl shadow-lg">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-cyan-400/40 shadow-inner">
                <img src={leaderPhoto} alt={distributorName} className="h-full w-full object-cover object-top" />
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold text-white">{t.sharedBy} <strong className="text-cyan-300">{distributorName}</strong></span>
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> {t.verifiedLeader}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollToEquation}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-7 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/20 hover:from-cyan-300 hover:to-blue-400 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>{t.exploreDuoBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={scrollToVideo}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all backdrop-blur-md active:scale-95 cursor-pointer"
              >
                <PlayCircle className="h-4 w-4 text-cyan-400" />
                <span>{t.watchStoryBtn}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-5 py-3.5 text-sm font-bold text-emerald-300 transition-all active:scale-95"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>{t.talkWith} {distributorFirstName}</span>
              </a>
            </div>
          </div>

          {/* Master Cinematic Hero Image Composition */}
          <div className="mt-12 sm:mt-16 relative overflow-hidden rounded-3xl sm:rounded-[36px] border border-white/15 bg-gradient-to-b from-white/[0.06] to-black/80 shadow-2xl group">
            <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full overflow-hidden">
              <img
                src="/duo/duo-cinematic-hero.jpg"
                alt="True Legacy Duo: Leveluk K8 water system and emGuarde GO environmental technology in a modern luxury penthouse"
                fetchPriority="high"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03050a] via-transparent to-black/20" />
            </div>

            {/* In-Image Atmospheric Overlay Labels */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                <span>YOUR WATER · LEVELUK K8</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                <Radio className="h-3.5 w-3.5 text-cyan-400" />
                <span>YOUR ENVIRONMENT · emGuarde GO</span>
              </div>
            </div>
          </div>

          {/* 4 Bottom Trust Highlights */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {t.trustHighlights.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center backdrop-blur-md"
              >
                <span className="text-xs sm:text-sm font-bold text-white">{item.label}</span>
                <span className="text-[11px] text-[#8e97a8] mt-0.5">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. THE DUO EQUATION: TWO TECHNOLOGIES. TWO PARTS OF EVERYDAY LIFE. */}
      {/* ========================================================================= */}
      <section ref={equationRef} id="equation" className="scroll-mt-20 py-20 sm:py-28 border-b border-white/10 bg-[#040711] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              {t.equationEyebrow}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.equationHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf] leading-relaxed">
              {t.equationSub}
            </p>
          </div>

          {/* Clean Split Composition: K8 (Water) + emGuarde (Environment) */}
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

                {/* Exact Transparent K8 Asset */}
                <div className="my-6 relative h-56 sm:h-64 flex items-center justify-center">
                  <img
                    src="/products/k8.png"
                    alt="Leveluk K8 Water Ionizer System"
                    loading="lazy"
                    className="h-full w-auto max-w-[90%] object-contain scale-[1.18] sm:scale-[1.25] drop-shadow-[0_20px_40px_rgba(6,182,212,0.3)] transition-transform duration-500 group-hover:scale-[1.3]"
                  />
                </div>
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

                {/* Exact Transparent emGuarde GO Asset */}
                <div className="my-6 relative h-44 sm:h-48 flex items-center justify-center">
                  <img
                    src="/products/emguarde-go.png"
                    alt="emGuarde GO Portable Electromagnetic Harmonizer Set"
                    loading="lazy"
                    className="h-full w-auto max-w-[85%] object-contain drop-shadow-[0_15px_30px_rgba(16,185,129,0.25)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
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
      {/* 04. DAY IN THE LIFE: FROM MORNING TO NIGHT */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#020409] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              ASPIRATIONAL LIFESTYLE TIMELINE
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.dayHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#a8b2c5] leading-relaxed">
              {t.daySub}
            </p>
          </div>

          {/* 4 Lifestyle Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.dayCards.map((card, i) => {
              const IconComponent = card.icon
              return (
                <div
                  key={i}
                  className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-cyan-400">{card.time}</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-300">
                        {card.badge}
                      </span>
                    </div>

                    <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4">
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8e98aa]">
                      {card.period}
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-white">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-[#b0b8c7] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-semibold text-slate-400">
                    Step 0{i + 1} of 04
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. KANGEN STORY: IT STARTS WITH YOUR WATER */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-gradient-to-b from-[#071022] via-[#040816] to-[#03050d] relative overflow-hidden">
        {/* Warm daylight & water refractions glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[160px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-md aspect-square rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-cyan-900/20 to-black/60 p-6 flex items-center justify-center shadow-2xl">
                <img
                  src="/products/k8.png"
                  alt="Leveluk K8 Water Ionizer"
                  loading="lazy"
                  className="h-76 sm:h-88 md:h-96 w-auto max-w-[95%] object-contain scale-105 drop-shadow-[0_25px_50px_rgba(6,182,212,0.35)]"
                />
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

              {/* 4 Feature Items */}
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

              <div className="mt-8">
                <Link
                  to={kangenPageUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{t.exploreKangenBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. SOPHISTICATED VISUAL TRANSITION: WATER INTO ENVIRONMENT */}
      {/* ========================================================================= */}
      <section className="relative py-14 sm:py-20 border-b border-white/10 bg-gradient-to-r from-[#040816] via-[#091420] to-[#040711] overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center gap-3 text-xs font-mono text-cyan-300">
              <span>WATER REFLECTIONS</span>
              <span className="text-slate-500">→</span>
              <span>ARCHITECTURAL CALM</span>
              <span className="text-slate-500">→</span>
              <span>ENVIRONMENTAL COHERENCE</span>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
            "{t.transitionLine1} <span className="text-cyan-300">{t.transitionLine2}</span>"
          </h3>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. EMGUARDE STORY: THEN LOOK AT THE ENVIRONMENT AROUND YOU */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#03050a] relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-500/08 blur-[160px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                PILLAR 02: EXTERNAL ENVIRONMENT
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {t.emguardeHeading}
              </h2>

              <p className="mt-4 text-base sm:text-lg text-[#c2cbd8] leading-relaxed">
                {t.emguardeSub}
              </p>

              {/* 4 Feature Items */}
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

              <div className="mt-8">
                <Link
                  to={emguardePageUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{t.exploreEmguardeBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-emerald-950/20 to-black/60 p-6 flex items-center justify-center shadow-2xl">
                <img
                  src="/products/emguarde-go.png"
                  alt="emGuarde GO Dual Set"
                  loading="lazy"
                  className="h-52 sm:h-60 w-auto max-w-[85%] object-contain drop-shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
                />
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
              EDITORIAL PERSPECTIVE
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.whyDuoHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf]">
              {t.whyDuoSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Box 1: Kangen */}
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/[0.03] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">INTERNAL</span>
                <h3 className="text-xl font-bold text-white mt-2">Kangen Water®</h3>
                <p className="mt-3 text-sm text-[#aeb8c9] leading-relaxed">
                  {t.whyDuoKangenRole}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
                Pillar 01 · Hydration & Nutrition
              </div>
            </div>

            {/* Box 2: emGuarde */}
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.03] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">EXTERNAL</span>
                <h3 className="text-xl font-bold text-white mt-2">emGuarde®</h3>
                <p className="mt-3 text-sm text-[#aeb8c9] leading-relaxed">
                  {t.whyDuoEmguardeRole}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
                Pillar 02 · Environmental Harmony
              </div>
            </div>

            {/* Box 3: The Duo Together */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">COMPLETE LIFESTYLE</span>
                <h3 className="text-xl font-bold text-white mt-2">The True Legacy Duo</h3>
                <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                  {t.whyDuoTogether}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-cyan-300 font-semibold">
                Unified Daily Living
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09. TWO PRODUCTS. ONE DECISION (COMPARISON MATRIX) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#020409] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              CLEAR SPECIFICATIONS & FOCUS
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.matrixHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf]">
              {t.matrixSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matrix 1: Kangen */}
            <div className="rounded-3xl border border-white/10 bg-[#060b18] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Option 01</span>
                <h3 className="text-2xl font-black text-white mt-1">{t.matrixKangen.name}</h3>
                <div className="mt-6 space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Category</span>
                    <strong className="text-white font-medium">{t.matrixKangen.cat}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Primary Environment</span>
                    <strong className="text-white font-medium">{t.matrixKangen.env}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Everyday Role</span>
                    <strong className="text-white font-medium">{t.matrixKangen.role}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Hardware</span>
                    <strong className="text-white font-medium">{t.matrixKangen.hw}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Best For</span>
                    <strong className="text-cyan-300 font-medium">{t.matrixKangen.best}</strong>
                  </div>
                </div>
              </div>
              <Link
                to={kangenPageUrl}
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 py-3 text-xs font-bold text-white transition-all"
              >
                Learn About K8 Only
              </Link>
            </div>

            {/* Matrix 2: emGuarde */}
            <div className="rounded-3xl border border-white/10 bg-[#061016] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Option 02</span>
                <h3 className="text-2xl font-black text-white mt-1">{t.matrixEmguarde.name}</h3>
                <div className="mt-6 space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Category</span>
                    <strong className="text-white font-medium">{t.matrixEmguarde.cat}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Primary Environment</span>
                    <strong className="text-white font-medium">{t.matrixEmguarde.env}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Everyday Role</span>
                    <strong className="text-white font-medium">{t.matrixEmguarde.role}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Hardware</span>
                    <strong className="text-white font-medium">{t.matrixEmguarde.hw}</strong>
                  </div>
                  <div>
                    <span className="text-[#88909e] uppercase text-[10px] font-bold block">Best For</span>
                    <strong className="text-emerald-300 font-medium">{t.matrixEmguarde.best}</strong>
                  </div>
                </div>
              </div>
              <Link
                to={emguardePageUrl}
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 py-3 text-xs font-bold text-white transition-all"
              >
                Learn About emGuarde Only
              </Link>
            </div>

            {/* Matrix 3: True Legacy Duo */}
            <div className="rounded-3xl border-2 border-cyan-400/50 bg-gradient-to-b from-[#09152b] to-[#040816] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 right-6 rounded-full bg-cyan-400 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950">
                RECOMMENDED
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">Complete Suite</span>
                <h3 className="text-2xl font-black text-white mt-1">{t.matrixDuo.name}</h3>
                <div className="mt-6 space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-cyan-200/70 uppercase text-[10px] font-bold block">Category</span>
                    <strong className="text-white font-medium">{t.matrixDuo.cat}</strong>
                  </div>
                  <div>
                    <span className="text-cyan-200/70 uppercase text-[10px] font-bold block">Primary Environment</span>
                    <strong className="text-white font-medium">{t.matrixDuo.env}</strong>
                  </div>
                  <div>
                    <span className="text-cyan-200/70 uppercase text-[10px] font-bold block">Everyday Role</span>
                    <strong className="text-white font-medium">{t.matrixDuo.role}</strong>
                  </div>
                  <div>
                    <span className="text-cyan-200/70 uppercase text-[10px] font-bold block">Hardware</span>
                    <strong className="text-white font-medium">{t.matrixDuo.hw}</strong>
                  </div>
                  <div>
                    <span className="text-cyan-200/70 uppercase text-[10px] font-bold block">Best For</span>
                    <strong className="text-cyan-300 font-medium">{t.matrixDuo.best}</strong>
                  </div>
                </div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 py-3 text-xs font-black text-slate-950 transition-all shadow-lg shadow-cyan-400/20"
              >
                <span>Consult on the Duo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CINEMATIC LIFESTYLE STORY: DESIGNED FOR THE WAY WE LIVE NOW */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-gradient-to-b from-[#020409] via-[#050b18] to-[#020409] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              MODERN LIVING SANCTUARY
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.lifestyleHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#b8c0cf]">
              {t.lifestyleSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.lifestyleCards.map((card, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-xs font-bold mb-6">
                    0{i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-sm text-[#aeb7c6] leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-500 font-mono">
                  TRUE LEGACY LIFESTYLE
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. WATCH THE DUO: DUAL VIDEO THEATER (BOTH DEMOS PLAYABLE) */}
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

          {/* DUAL VIDEOS GRID - BOTH DEMO VIDEOS DISPLAYED SIDE-BY-SIDE */}
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
                    url={videoK8Url}
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
                    url={videoEmguardeUrl}
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
            Official presentation videos localized for {locale.toUpperCase()}. Click to play. Sound starts only upon your explicit play interaction.
          </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

              <div className="my-8 flex justify-center items-center h-52 sm:h-60">
                <img
                  src="/products/k8.png"
                  alt="Leveluk K8"
                  loading="lazy"
                  className="h-full w-auto max-w-[90%] object-contain scale-110 drop-shadow-xl transition-transform duration-500 group-hover:scale-115"
                />
              </div>

              <Link
                to={kangenPageUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3.5 text-sm transition-all"
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

              <div className="my-8 flex justify-center items-center h-40 sm:h-44">
                <img
                  src="/products/emguarde-go.png"
                  alt="emGuarde GO"
                  loading="lazy"
                  className="h-full w-auto max-w-[85%] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <Link
                to={emguardePageUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 text-sm transition-all"
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
      <section ref={distributorRef} className="py-20 sm:py-28 border-b border-white/10 bg-[#020409] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] to-black/80 p-8 sm:p-12 text-center shadow-2xl relative">
            <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-cyan-400/40 p-1 shadow-xl">
              <img
                src={leaderPhoto}
                alt={distributorName}
                className="h-full w-full rounded-full object-cover object-top"
              />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase text-cyan-300 mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              {t.verifiedLeader}
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              {t.guidanceHeading}
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#c0c7d4] max-w-xl mx-auto leading-relaxed">
              {t.guidanceSub}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-7 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t.messageWhatsApp}</span>
              </a>

              <Link
                to={applyUrl}
                className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-7 py-3 text-sm font-bold text-white transition-all active:scale-95"
              >
                <span>{t.requestInfo}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#040711] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              CLEAR ANSWERS
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.faqHeading}
            </h2>
          </div>

          <div className="space-y-4">
            {t.faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 text-slate-400 ${
                      activeFaq === i ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#abb4c4] leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15. FINAL CINEMATIC CTA: YOUR WATER. YOUR ENVIRONMENT. YOUR NEXT STEP. */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#020409] relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-cyan-500/10 blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Dual Product Visual Harmony */}
          <div className="flex items-end justify-center gap-6 sm:gap-12 mb-10">
            <img
              src="/products/k8.png"
              alt="Leveluk K8"
              loading="lazy"
              className="h-44 sm:h-56 w-auto object-contain scale-110 drop-shadow-[0_20px_40px_rgba(6,182,212,0.35)]"
            />
            <div className="h-20 w-px bg-white/20 mb-4" />
            <img
              src="/products/emguarde-go.png"
              alt="emGuarde GO"
              loading="lazy"
              className="h-24 sm:h-32 w-auto object-contain drop-shadow-[0_15px_30px_rgba(16,185,129,0.3)] mb-2"
            />
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
              onClick={scrollToEquation}
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-8 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-cyan-400/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>{t.finalPrimaryCta}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-sm font-bold text-white transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>{t.finalSecondaryCta} {distributorFirstName}</span>
            </a>
          </div>

          <p className="mt-8 text-[11px] text-[#7a8394]">
            {t.finalTrust}
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
