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
  UserCheck,
  Share2
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { localizedProductVideo } from '@/lib/productVideos'
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
    badge: 'PRIVATE PRODUCT PRESENTATION',
    headline: 'Two Technologies. One Elevated Lifestyle.',
    heroBody1:
      'Most people think carefully about the food they eat and the air they breathe. But two environments are also part of everyday life: the water we use and the technology surrounding us.',
    heroBody2:
      'The Duo introduces two independent technologies designed for those environments: the Leveluk K8 and the portable emGuarde GO.',
    sharedBy: 'Shared personally with you by',
    watchPresentations: 'Watch the Presentations',
    messageDistributor: 'Message',
    contactDistributor: 'Contact',
    takeYourTime: 'Take your time. Watch both presentations and write down any questions that come up.',
    verifiedGuide: 'Your Verified Guide',
    verifiedDistributor: 'Verified Independent Distributor',
    
    // Section 2: Presentations
    presentationsHeading: 'Start With the Presentations',
    presentationsSub:
      'These two presentations offer a closer look at each technology, what it was designed to do, and how it can fit into everyday life.',
    k8Label: '01 · YOUR WATER ENVIRONMENT',
    k8Title: 'Leveluk K8',
    k8Subtitle: 'A different way to think about the water you use every day.',
    k8Time: 'Watch time: approximately 4 minutes',
    
    emguardeLabel: '02 · YOUR ELECTROMAGNETIC ENVIRONMENT',
    emguardeTitle: 'emGuarde GO',
    emguardeSubtitle: 'Portable environmental support for a world surrounded by technology.',
    emguardeTime: 'Watch time: approximately 8 minutes',
    
    postVideosNote:
      'Once you have watched both presentations, continue below to understand why these two technologies are introduced together.',

    // Section 3: Why the Duo
    whyDuoHeading: 'Now You’ve Seen Both Technologies. Why Introduce Them Together?',
    whyDuoP1: 'The K8 and emGuarde GO do not perform the same function.',
    whyDuoP2: 'They were created for two different parts of modern life.',
    whyDuoP3:
      'The Leveluk K8 becomes part of your home water system, producing five types of water for drinking and different household applications.',
    whyDuoP4:
      'emGuarde GO is portable. It is designed to accompany you through the environments where you use phones, Wi-Fi, laptops, vehicles, and other connected technology.',
    whyDuoP5: 'One focuses on the water you use.',
    whyDuoP6: 'The other focuses on the electromagnetic environment around you.',
    whyDuoP7: 'The Duo brings them together for people who want a more intentional approach to both.',
    whyDuoBanner: 'One for your home. One for wherever life takes you.',

    // Section 4: Leveluk K8 Information
    k8SectionTitle: 'Meet the Leveluk K8',
    k8SectionSub: 'More Than Drinking Water',
    k8SectionBody:
      'The Leveluk K8 is a home water-ionization system designed to produce five types of water for drinking and a variety of everyday household applications.',
    k8Features: [
      { title: 'Eight Platinum-Dipped Titanium Plates', desc: 'Engineered for consistent ionization and long-term durability.' },
      { title: 'Five Types of Water', desc: 'Multiple water pH outputs for drinking, cooking, beauty, and cleaning.' },
      { title: 'Automatic Cleaning System', desc: 'Integrated automated maintenance to optimize internal plate performance.' },
      { title: 'Multilingual Display & Audio', desc: 'User-friendly color LCD screen with 8-language voice prompts.' },
      { title: 'Worldwide Voltage Compatibility', desc: 'Auto-sensing power supply adaptable for global electrical standards.' },
      { title: 'Five-Year Manufacturer Warranty', desc: 'Backed by Enagic’s official 5-year parts and service warranty.' },
      { title: 'Manufactured by Enagic in Japan', desc: 'Precision crafted in Enagic’s dedicated Osaka manufacturing facility.' },
    ],
    k8WaterTypesTitle: 'Understanding the 5 Water Types',
    k8WaterTypes: [
      { name: 'Strong Kangen Water (pH 11.5)', usage: 'Food preparation, cleaning produce, and oil-cutting household tasks.' },
      { name: 'Kangen Water® (pH 8.5 – 9.5)', usage: 'Delicious drinking water, tea, coffee, and everyday culinary recipes.' },
      { name: 'Clean Water (pH 7.0)', usage: 'Neutral, filtered water ideal for preparing baby food and taking medications.' },
      { name: 'Beauty Water (pH 4.0 – 6.0)', usage: 'Slightly acidic water tailored for gentle facial washing and skin toning.' },
      { name: 'Strong Acidic Water (pH 2.5)', usage: 'Extra-strength water for sanitizing kitchenware, utensils, and surfaces.' },
    ],
    askAboutK8: 'Ask',
    aboutK8: 'About the K8',

    // Section 5: emGuarde GO Information
    emguardeSectionTitle: 'Meet emGuarde GO',
    emguardeSectionSub: 'Designed for Modern Life',
    emguardeSectionBody:
      'Phones, Wi-Fi, Bluetooth, laptops, vehicles, and connected devices have become part of everyday life. emGuarde GO was created for people who want to be more intentional about their electromagnetic environment without disconnecting from modern technology.',
    emguardeFeatures: [
      { title: 'Portable Set of Two', desc: 'Includes two synchronized units to position in your living, working, or travel spaces.' },
      { title: 'Approximately 9.8-Foot Coverage Diameter', desc: 'Harmonious localized environmental coverage per device.' },
      { title: 'Rechargeable Through USB-C', desc: 'Modern fast-charging interface compatible with standard USB-C cables.' },
      { title: 'Up to 72 Hours Per Charge', desc: 'Long battery life designed for all-day commutes, flights, and remote work.' },
      { title: 'Designed for Home, Work, Vehicles & Travel', desc: 'Compact, sleek form factor that fits effortlessly into any lifestyle.' },
      { title: 'Does Not Block Wi-Fi, Bluetooth or Cellular', desc: 'Operates smoothly alongside all your wireless and smart devices.' },
    ],
    emguardeDisclaimer:
      'emGuarde GO is not a medical device and is not intended to diagnose, treat, cure, or prevent any condition. Product availability and specifications may vary by market.',
    askAboutEmguarde: 'Ask',
    aboutEmguarde: 'About emGuarde GO',

    // Section 6: Why People Explore the Duo
    whyExploreTitle: 'Why People Explore the Duo',
    whyExploreCards: [
      {
        title: 'Two Different Purposes',
        body: 'One technology focuses on your water environment. The other focuses on your electromagnetic environment.',
      },
      {
        title: 'Home and On the Go',
        body: 'The K8 becomes part of your home, while emGuarde GO is designed to move with your lifestyle.',
      },
      {
        title: 'Personal Guidance',
        body: 'Your questions, market availability, installation requirements, and purchasing options are reviewed personally before you move forward.',
      },
      {
        title: 'Continued Support',
        body: 'The relationship does not end with a purchase. You receive guidance on using, maintaining, and getting the most from both technologies.',
      },
    ],

    // Section 7: Enagic Credibility
    credibilityHeading: 'Backed by More Than 50 Years of Innovation',
    credibilityBody:
      'The Duo technologies are produced by Enagic, a Japanese manufacturer established in 1974 with an international presence across multiple markets.',
    credibilityPoints: [
      'Founded in Japan',
      'More than 50 years of company history',
      'International offices and service locations',
      'ISO-certified quality systems',
      'Manufacturer-backed product support',
    ],
    credibilityDisclaimer:
      'Product availability, warranty coverage, service options, and specifications vary by country.',

    // Section 8: Personal Introduction
    guideLabel: 'YOUR PERSONAL GUIDE',
    guideHeadingPrefix: 'Why',
    guideHeadingSuffix: 'Shared This With You',
    mehdiBio1: 'I’ve been involved in the health and wellness industry for over 10 years.',
    mehdiBio2:
      'I’m not here to tell you that every person needs both products. My role is to help you understand the technology, answer your questions honestly, and determine whether either solution fits your lifestyle.',
    mehdiBio3: 'If something does not make sense for you, I will tell you.',
    mehdiBio4:
      'If you decide to move forward, I will personally guide you through the options, ordering process, installation, and continued support.',
    mehdiRole: 'Independent Enagic Distributor',
    mehdiServing: 'Serving English, Spanish, and global markets',
    defaultBio:
      'I’m here to help you understand both technologies, answer your questions honestly, and determine whether either solution fits your lifestyle. If you decide to move forward, I will guide you through the available options, ordering process, and continued product support.',
    messageOnWhatsApp: 'Message on WhatsApp',
    viewProfile: 'View Profile',

    // Section 9: What Happens Next
    nextStepsHeading: 'A Simple, No-Pressure Next Step',
    timelineSteps: [
      { num: '1', title: 'Watch', desc: 'Finish both presentations and write down your questions.' },
      { num: '2', title: 'Connect', desc: 'Message your distributor directly or request a personal conversation.' },
      { num: '3', title: 'Explore', desc: 'Review availability, installation, pricing, payment options, and which product fits your needs.' },
      { num: '4', title: 'Decide', desc: 'Move forward only when you understand what you are purchasing and feel comfortable with your decision.' },
    ],

    // Section 10: FAQ
    faqHeading: 'Questions You May Have',
    faqs: [
      {
        q: 'Do I need to purchase both products?',
        a: 'No. The Duo introduces both technologies together, but your distributor can explain the individual options available in your market.',
      },
      {
        q: 'Can I purchase only the K8 or emGuarde GO?',
        a: 'Yes, depending on product availability in your country. Speak with your distributor to review the current options.',
      },
      {
        q: 'Does the K8 replace a water filter?',
        a: 'The K8 includes internal filtration, but water conditions vary. Your local water source and installation requirements should be reviewed before ordering.',
      },
      {
        q: 'Will the K8 fit my faucet?',
        a: 'The K8 works with many common faucet configurations. Photos of your faucet may be requested to confirm the correct installation accessories.',
      },
      {
        q: 'Does emGuarde GO block electromagnetic signals?',
        a: 'No. It is not designed to block or jam Wi-Fi, Bluetooth, cellular service, or electronic devices.',
      },
      {
        q: 'Is emGuarde GO a medical device?',
        a: 'No. It is an environmental harmonizing device and is not intended to diagnose, treat, cure, or prevent any medical condition.',
      },
      {
        q: 'Are payment options available?',
        a: 'Options vary by country and individual qualification. Your distributor can explain what is currently available in your market.',
      },
      {
        q: 'Can I purchase if I live outside the United States?',
        a: 'Availability, pricing, voltage requirements, and ordering procedures vary by country. Contact your distributor to confirm the available options.',
      },
      {
        q: 'What support will I receive?',
        a: 'You will receive guidance through product selection, ordering, installation, everyday use, and continued product education.',
      },
    ],

    // Section 11: Paths
    exploreHeading: 'What Would You Like to Explore?',
    exploreSub: 'Choose the path that best matches what brought you here.',
    productsCardTitle: 'The Products',
    productsCardBody: 'I’m primarily interested in the K8, emGuarde GO, or the Duo for personal or family use.',
    productsCardBtn: 'Explore Product Options',
    businessCardTitle: 'The Business',
    businessCardBody: 'I’m also interested in understanding how these products connect to the Enagic business model.',
    businessCardBtn: 'Explore the Business Opportunity',

    // Section 12: Final CTA
    finalHeading: 'You’ve Seen the Technologies. Now Let’s Talk About Your Needs.',
    finalBody1: 'You do not need to make a decision today.',
    finalBody2:
      'The next step is simply to ask your questions, confirm what is available in your country, and determine whether one or both technologies make sense for you.',
    requestConsultation: 'Request More Info',
    finalTrust: 'No pressure. No obligation. Just a real conversation.',
    stickyMobileCta: 'Talk With',
  },

  es: {
    badge: 'PRESENTACIÓN PRIVADA DE PRODUCTO',
    headline: 'Dos Tecnologías. Un Estilo de Vida Más Consciente.',
    heroBody1:
      'La mayoría de las personas cuidan con atención los alimentos que consumen y el aire que respiran. Sin embargo, dos entornos también forman parte de nuestra vida cotidiana: el agua que utilizamos y la tecnología que nos rodea.',
    heroBody2:
      'El Duo presenta dos tecnologías independientes diseñadas para estos entornos: el Leveluk K8 y el dispositivo portátil emGuarde GO.',
    sharedBy: 'Compartido personalmente contigo por',
    watchPresentations: 'Ver las Presentaciones',
    messageDistributor: 'Escribir a',
    contactDistributor: 'Contactar a',
    takeYourTime: 'Tómate tu tiempo. Mira ambas presentaciones y anota cualquier pregunta que surja.',
    verifiedGuide: 'Tu Guía Verificado',
    verifiedDistributor: 'Distribuidor Independiente Verificado',

    // Section 2: Presentations
    presentationsHeading: 'Comienza con las Presentaciones',
    presentationsSub:
      'Estas dos presentaciones ofrecen una visión detallada de cada tecnología, su propósito de diseño y cómo se integra en la vida diaria.',
    k8Label: '01 · TU ENTORNO DE AGUA',
    k8Title: 'Leveluk K8',
    k8Subtitle: 'Una forma diferente de entender el agua que utilizas todos los días.',
    k8Time: 'Duración aproximada: 4 minutos',

    emguardeLabel: '02 · TU ENTORNO ELECTROMAGNÉTICO',
    emguardeTitle: 'emGuarde GO',
    emguardeSubtitle: 'Acompañamiento ambiental portátil para un mundo rodeado de tecnología.',
    emguardeTime: 'Duración aproximada: 8 minutos',

    postVideosNote:
      'Una vez que hayas visto ambas presentaciones, continúa abajo para comprender por qué se presentan juntas estas dos tecnologías.',

    // Section 3: Why the Duo
    whyDuoHeading: 'Ahora que has conocido ambas tecnologías, ¿por qué presentarlas juntas?',
    whyDuoP1: 'El K8 y emGuarde GO no cumplen la misma función.',
    whyDuoP2: 'Fueron creados para dos aspectos distintos de la vida moderna.',
    whyDuoP3:
      'El Leveluk K8 se integra en el sistema de agua de tu hogar, produciendo cinco tipos de agua para consumo y diversas aplicaciones domésticas.',
    whyDuoP4:
      'emGuarde GO es portátil. Está diseñado para acompañarte en los entornos donde utilizas teléfonos, Wi-Fi, computadoras portátiles, vehículos y otros dispositivos conectados.',
    whyDuoP5: 'Uno se enfoca en el agua que utilizas.',
    whyDuoP6: 'El otro se enfoca en el entorno electromagnético que te rodea.',
    whyDuoP7: 'El Duo los une para quienes desean un enfoque más consciente en ambos aspectos.',
    whyDuoBanner: 'Uno para tu hogar. Uno para dondequiera que vayas.',

    // Section 4: Leveluk K8 Information
    k8SectionTitle: 'Conoce el Leveluk K8',
    k8SectionSub: 'Mucho Más Que Agua para Beber',
    k8SectionBody:
      'El Leveluk K8 es un sistema de ionización de agua para el hogar diseñado para producir cinco tipos de agua para consumo y una amplia variedad de aplicaciones cotidianas.',
    k8Features: [
      { title: 'Ocho Placas de Titanio Bañadas en Platino', desc: 'Diseñadas para una ionización consistente y máxima durabilidad.' },
      { title: 'Cinco Tipos de Agua', desc: 'Múltiples niveles de pH para beber, cocinar, belleza y limpieza doméstica.' },
      { title: 'Sistema de Limpieza Automática', desc: 'Mantenimiento automatizado que optimiza el rendimiento de las placas.' },
      { title: 'Pantalla y Audio Multilingüe', desc: 'Pantalla LCD a color con instrucciones por voz en 8 idiomas.' },
      { title: 'Compatibilidad de Voltaje Mundial', desc: 'Fuente de alimentación con detección automática de voltaje internacional.' },
      { title: 'Garantía del Fabricante por Cinco Años', desc: 'Respaldado por la garantía oficial de 5 años de Enagic.' },
      { title: 'Fabricado por Enagic en Japón', desc: 'Elaborado con precisión en la fábrica propia de Enagic en Osaka.' },
    ],
    k8WaterTypesTitle: 'Comprende los 5 Tipos de Agua',
    k8WaterTypes: [
      { name: 'Agua Kangen Fuerte (pH 11.5)', usage: 'Preparación de alimentos, limpieza de productos frescos y tareas del hogar.' },
      { name: 'Kangen Water® (pH 8.5 – 9.5)', usage: 'Agua deliciosa para beber, infusiones, café y preparaciones culinarias.' },
      { name: 'Agua Limpia (pH 7.0)', usage: 'Agua neutra y purificada para preparar biberones y tomar medicamentos.' },
      { name: 'Agua de Belleza (pH 4.0 – 6.0)', usage: 'Agua ligeramente ácida para limpieza facial y tonificación de la piel.' },
      { name: 'Agua Ácida Fuerte (pH 2.5)', usage: 'Agua desinfectante para higienizar utensilios y superficies del hogar.' },
    ],
    askAboutK8: 'Preguntar a',
    aboutK8: 'sobre el K8',

    // Section 5: emGuarde GO Information
    emguardeSectionTitle: 'Conoce emGuarde GO',
    emguardeSectionSub: 'Diseñado para la Vida Moderna',
    emguardeSectionBody:
      'Teléfonos, Wi-Fi, Bluetooth, portátiles, vehículos y dispositivos conectados se han convertido en parte de la rutina diaria. emGuarde GO fue creado para quienes buscan cuidar conscientemente su entorno electromagnético sin desconectarse de la tecnología moderna.',
    emguardeFeatures: [
      { title: 'Set Portátil de Dos Unidades', desc: 'Incluye dos dispositivos para ubicar en tu hogar, oficina o viajes.' },
      { title: 'Diámetro de Cobertura de Aprox. 3 Metros', desc: 'Armonización ambiental localizada por cada unidad.' },
      { title: 'Recargable Mediante USB-C', desc: 'Puerto de carga moderno compatible con cables USB-C estándar.' },
      { title: 'Hasta 72 Horas por Carga', desc: 'Batería de larga duración pensada para traslados, vuelos y trabajo diario.' },
      { title: 'Para Casa, Trabajo, Vehículos y Viajes', desc: 'Diseño compacto y elegante que se adapta fácilmente a tu rutina.' },
      { title: 'No Bloquea Wi-Fi, Bluetooth ni Red Móvil', desc: 'Opera en perfecta armonía con todos tus dispositivos conectados.' },
    ],
    emguardeDisclaimer:
      'emGuarde GO no es un dispositivo médico y no está destinado a diagnosticar, tratar, curar o prevenir ninguna afección. La disponibilidad y especificaciones del producto pueden variar según el mercado.',
    askAboutEmguarde: 'Preguntar a',
    aboutEmguarde: 'sobre emGuarde GO',

    // Section 6: Why People Explore the Duo
    whyExploreTitle: '¿Por Qué Muchas Personas Eligen el Duo?',
    whyExploreCards: [
      {
        title: 'Dos Propósitos Complementarios',
        body: 'Una tecnología se enfoca en tu entorno hídrico. La otra se enfoca en tu entorno electromagnético.',
      },
      {
        title: 'Para el Hogar y en Movimiento',
        body: 'El K8 se integra en tu hogar, mientras que emGuarde GO está diseñado para acompañar tu estilo de vida.',
      },
      {
        title: 'Asesoría Personalizada',
        body: 'Tus dudas, la disponibilidad en tu país, los requisitos de instalación y las formas de pago se revisan de forma personalizada antes de dar cualquier paso.',
      },
      {
        title: 'Acompañamiento Continuo',
        body: 'La relación no termina con la compra. Recibes guía constante sobre el uso, mantenimiento y máximo aprovechamiento de ambas tecnologías.',
      },
    ],

    // Section 7: Enagic Credibility
    credibilityHeading: 'Respaldado por Más de 50 Años de Innovación',
    credibilityBody:
      'Las tecnologías del Duo son producidas por Enagic, fabricante japonés fundado en 1974 con presencia internacional consolidada en múltiples mercados.',
    credibilityPoints: [
      'Fundada en Japón',
      'Más de 50 años de trayectoria empresarial',
      'Sedes internacionales y centros de servicio oficiales',
      'Sistemas de gestión de calidad certificados con normas ISO',
      'Respaldo y soporte directo del fabricante',
    ],
    credibilityDisclaimer:
      'La disponibilidad de productos, coberturas de garantía, opciones de servicio y especificaciones varían según el país.',

    // Section 8: Personal Introduction
    guideLabel: 'TU GUÍA PERSONAL',
    guideHeadingPrefix: 'Por Qué',
    guideHeadingSuffix: 'Compartió Esto Contigo',
    mehdiBio1: 'Llevo más de 10 años involucrado en la industria de la salud y el bienestar.',
    mehdiBio2:
      'No estoy aquí para decirte que toda persona necesita ambos productos. Mi función es ayudarte a entender la tecnología, responder tus preguntas con total honestidad y determinar si alguna de estas soluciones se adapta a tu estilo de vida.',
    mehdiBio3: 'Si algo no tiene sentido para ti, te lo diré con franqueza.',
    mehdiBio4:
      'Si decides dar el siguiente paso, te acompañaré personalmente en la revisión de opciones, el proceso de pedido, la instalación y el soporte continuo.',
    mehdiRole: 'Distribuidor Independiente Enagic',
    mehdiServing: 'Atención en inglés, español y mercados globales',
    defaultBio:
      'Estoy aquí para ayudarte a comprender ambas tecnologías, responder a tus preguntas con honestidad y definir si alguna de estas soluciones se ajusta a tu estilo de vida. Si decides avanzar, te guiaré a través de las opciones disponibles, el proceso de pedido y el soporte continuo.',
    messageOnWhatsApp: 'Enviar Mensaje por WhatsApp',
    viewProfile: 'Ver Perfil Completo',

    // Section 9: What Happens Next
    nextStepsHeading: 'Un Siguiente Paso Sencillo y Sin Presión',
    timelineSteps: [
      { num: '1', title: 'Mira', desc: 'Termina de ver ambas presentaciones y anota tus preguntas.' },
      { num: '2', title: 'Conecta', desc: 'Escribe a tu distribuidor directamente o solicita una conversación personalizada.' },
      { num: '3', title: 'Explora', desc: 'Revisa disponibilidad, instalación, precios, opciones de pago y qué producto se adapta mejor a ti.' },
      { num: '4', title: 'Decide', desc: 'Avanza únicamente cuando entiendas con claridad lo que estás adquiriendo y te sientas plenamente cómodo.' },
    ],

    // Section 10: FAQ
    faqHeading: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Necesito comprar ambos productos?',
        a: 'No. El Duo presenta ambas tecnologías juntas, pero tu distribuidor puede explicarte las opciones individuales disponibles en tu país.',
      },
      {
        q: '¿Puedo adquirir únicamente el K8 o emGuarde GO?',
        a: 'Sí, sujeto a la disponibilidad de producto en tu mercado. Habla con tu distribuidor para revisar las opciones actuales.',
      },
      {
        q: '¿El K8 reemplaza un filtro de agua?',
        a: 'El K8 incluye filtración interna de alto rendimiento, pero las condiciones del agua varían. Es recomendable revisar tu fuente de agua antes de ordenar.',
      },
      {
        q: '¿El K8 se adapta a mi grifo?',
        a: 'El K8 es compatible con la gran mayoría de grifos comunes. Puedes compartir fotos de tu grifo para confirmar los adaptadores adecuados.',
      },
      {
        q: '¿emGuarde GO bloquea las señales electromagnéticas?',
        a: 'No. No está diseñado para bloquear ni interferir señales de Wi-Fi, Bluetooth, telefonía o dispositivos electrónicos.',
      },
      {
        q: '¿emGuarde GO es un dispositivo médico?',
        a: 'No. Es un dispositivo de armonización ambiental y no está destinado a diagnosticar, tratar, curar o prevenir ninguna afección.',
      },
      {
        q: '¿Existen facilidades o planes de pago?',
        a: 'Las opciones varían según el país y la calificación crediticia. Tu distribuidor te explicará las alternativas disponibles.',
      },
      {
        q: '¿Puedo comprar si vivo fuera de Estados Unidos?',
        a: 'La disponibilidad, precios, voltaje y procedimientos de compra varían por país. Contacta a tu distribuidor para confirmar.',
      },
      {
        q: '¿Qué tipo de acompañamiento recibiré?',
        a: 'Recibirás orientación en la selección del equipo, proceso de compra, instalación, uso diario y educación continua sobre el producto.',
      },
    ],

    // Section 11: Paths
    exploreHeading: '¿Qué Te Gustaría Explorar?',
    exploreSub: 'Elige la opción que mejor se ajuste a lo que buscas.',
    productsCardTitle: 'Los Productos',
    productsCardBody: 'Me interesa principalmente el K8, emGuarde GO o el Duo para uso personal o familiar.',
    productsCardBtn: 'Explorar Opciones de Producto',
    businessCardTitle: 'El Negocio',
    businessCardBody: 'También me interesa comprender cómo se vinculan estos productos con el modelo de negocio de Enagic.',
    businessCardBtn: 'Explorar la Oportunidad de Negocio',

    // Section 12: Final CTA
    finalHeading: 'Ya Has Visto las Tecnologías. Conversemos Sobre Tus Necesidades.',
    finalBody1: 'No necesitas tomar una decisión hoy.',
    finalBody2:
      'El siguiente paso es simplemente resolver tus dudas, verificar qué está disponible en tu país y determinar si una o ambas tecnologías se adaptan a lo que buscas.',
    requestConsultation: 'Solicitar Más Información',
    finalTrust: 'Sin presión. Sin compromisos. Solo una conversación transparente.',
    stickyMobileCta: 'Hablar con',
  },

  fr: {
    badge: 'PRÉSENTATION PRIVÉE DE PRODUIT',
    headline: 'Deux Technologies. Un Mode de Vie Plus Conscient.',
    heroBody1:
      'La plupart des gens font attention à la nourriture qu\'ils consomment et à l\'air qu\'ils respirent. Mais deux autres environnements font partie intégrante de notre quotidien : l\'eau que nous utilisons et la technologie qui nous entoure.',
    heroBody2:
      'Le Duo présente deux technologies indépendantes conçues pour ces environnements : le Leveluk K8 et l\'appareil portable emGuarde GO.',
    sharedBy: 'Partagé personnellement avec vous par',
    watchPresentations: 'Regarder les Présentations',
    messageDistributor: 'Écrire à',
    contactDistributor: 'Contacter',
    takeYourTime: 'Prenez votre temps. Regardez les deux présentations et notez toutes vos questions.',
    verifiedGuide: 'Votre Guide Vérifié',
    verifiedDistributor: 'Distributeur Indépendant Vérifié',

    // Section 2: Presentations
    presentationsHeading: 'Commencez par les Présentations',
    presentationsSub:
      'Ces deux présentations offrent un aperçu précis de chaque technologie, de sa conception et de son intégration dans votre vie quotidienne.',
    k8Label: '01 · VOTRE ENVIRONNEMENT HYDRIQUE',
    k8Title: 'Leveluk K8',
    k8Subtitle: 'Une nouvelle manière d\'envisager l\'eau que vous utilisez au quotidien.',
    k8Time: 'Durée estimée : environ 4 minutes',

    emguardeLabel: '02 · VOTRE ENVIRONNEMENT ÉLECTROMAGNÉTIQUE',
    emguardeTitle: 'emGuarde GO',
    emguardeSubtitle: 'Un soutien environnemental portable pour un monde entouré de technologies.',
    emguardeTime: 'Durée estimée : environ 8 minutes',

    postVideosNote:
      'Après avoir regardé les deux présentations, continuez ci-dessous pour découvrir pourquoi ces deux technologies sont présentées ensemble.',

    // Section 3: Why the Duo
    whyDuoHeading: 'Maintenant que vous avez vu les deux technologies, pourquoi les présenter ensemble ?',
    whyDuoP1: 'Le K8 et emGuarde GO n\'ont pas la même fonction.',
    whyDuoP2: 'Ils ont été créés pour deux aspects différents de la vie moderne.',
    whyDuoP3:
      'Le Leveluk K8 s\'intègre au système d\'eau de votre foyer, produisant cinq types d\'eau pour la boisson et diverses utilisations quotidiennes.',
    whyDuoP4:
      'emGuarde GO est portable. Il est conçu pour vous accompagner dans les environnements où vous utilisez smartphones, Wi-Fi, ordinateurs, véhicules et autres technologies connectées.',
    whyDuoP5: 'L\'un se concentre sur l\'eau que vous utilisez.',
    whyDuoP6: 'L\'autre se concentre sur l\'environnement électromagnétique qui vous entoure.',
    whyDuoP7: 'Le Duo les réunit pour les personnes qui souhaitent une démarche plus intentionnelle dans ces deux domaines.',
    whyDuoBanner: 'L\'un pour votre foyer. L\'autre pour vous accompagner partout.',

    // Section 4: Leveluk K8 Information
    k8SectionTitle: 'Découvrez le Leveluk K8',
    k8SectionSub: 'Bien Plus Que de l\'Eau de Boisson',
    k8SectionBody:
      'Le Leveluk K8 est un système d\'ionisation d\'eau domestique conçu pour produire cinq types d\'eau destinés à la consommation et à de multiples usages du quotidien.',
    k8Features: [
      { title: 'Huit Plaques en Titane Plaquées Platine', desc: 'Conçues pour une ionisation stable et une longévité éprouvée.' },
      { title: 'Cinq Types d\'Eau', desc: 'Différents niveaux de pH pour la boisson, la cuisine, les soins et l\'entretien.' },
      { title: 'Système de Nettoyage Automatique', desc: 'Cycle automatisé préservant la performance optimale des plaques.' },
      { title: 'Écran et Guidage Audio Multilingues', desc: 'Écran tactile couleur intuitif avec guidage vocal en 8 langues.' },
      { title: 'Compatibilité de Tension Universelle', desc: 'Alimentation avec adaptation automatique aux normes électriques mondiales.' },
      { title: 'Garantie Constructeur de 5 Ans', desc: 'Bénéficie de la garantie officielle pièces et main d\'œuvre Enagic.' },
      { title: 'Fabriqué par Enagic au Japon', desc: 'Conçu avec rigueur dans l\'usine Enagic d\'Osaka.' },
    ],
    k8WaterTypesTitle: 'Comprendre les 5 Types d\'Eau',
    k8WaterTypes: [
      { name: 'Eau Kangen Forte (pH 11.5)', usage: 'Préparation des aliments, nettoyage des produits frais et vaisselle.' },
      { name: 'Kangen Water® (pH 8.5 – 9.5)', usage: 'Eau de boisson savoureuse, thés, cafés et recettes culinaires.' },
      { name: 'Eau Neutre (pH 7.0)', usage: 'Eau filtrée neutre idéale pour les biberons et la prise de médicaments.' },
      { name: 'Eau de Beauté (pH 4.0 – 6.0)', usage: 'Eau légèrement acide parfaite pour la toilette et le soin de la peau.' },
      { name: 'Eau Forte Acide (pH 2.5)', usage: 'Eau assainissante pour l\'hygiène des surfaces et ustensiles ménagers.' },
    ],
    askAboutK8: 'Interroger',
    aboutK8: 'sur le K8',

    // Section 5: emGuarde GO Information
    emguardeSectionTitle: 'Découvrez emGuarde GO',
    emguardeSectionSub: 'Conçu pour la Vie Moderne',
    emguardeSectionBody:
      'Smartphones, Wi-Fi, Bluetooth, ordinateurs portables, véhicules et objets connectés font désormais partie de notre quotidien. emGuarde GO a été conçu pour ceux qui souhaitent aborder leur environnement électromagnétique de manière plus sereine et consciente, sans renoncer à la technologie.',
    emguardeFeatures: [
      { title: 'Ensemble Portable de Deux Appareils', desc: 'Comprend deux unités synchronisées pour la maison, le bureau ou les voyages.' },
      { title: 'Diamètre de Couverture d\'Environ 3 Mètres', desc: 'Harmonisation environnementale de proximité pour chaque appareil.' },
      { title: 'Rechargeable par USB-C', desc: 'Port moderne et rapide compatible avec tous les chargeurs USB-C.' },
      { title: 'Jusqu\'à 72 Heures d\'Autonomie', desc: 'Batterie longue durée pour vos trajets, vols et journées de travail.' },
      { title: 'Maison, Travail, Véhicules & Déplacements', desc: 'Format compact et discret qui s\'intègre naturellement à votre quotidien.' },
      { title: 'Ne Bloque ni Wi-Fi, ni Bluetooth, ni Réseau', desc: 'Fonctionne en parfaite complémentarité avec tous vos appareils connectés.' },
    ],
    emguardeDisclaimer:
      'emGuarde GO n\'est pas un dispositif médical et n\'est pas destiné à diagnostiquer, traiter, guérir ou prévenir une quelconque pathologie. La disponibilité et les spécifications peuvent varier selon les pays.',
    askAboutEmguarde: 'Interroger',
    aboutEmguarde: 'sur emGuarde GO',

    // Section 6: Why People Explore the Duo
    whyExploreTitle: 'Pourquoi Choisir le Duo ?',
    whyExploreCards: [
      {
        title: 'Deux Fonctions Complémentaires',
        body: 'L\'une se concentre sur votre environnement hydrique. L\'autre se concentre sur votre environnement électromagnétique.',
      },
      {
        title: 'Pour la Maison et en Déplacement',
        body: 'Le K8 s\'installe au cœur de votre foyer, tandis qu\'emGuarde GO vous accompagne partout.',
      },
      {
        title: 'Accompagnement Personnalisé',
        body: 'Vos questions, la disponibilité dans votre région, l\'installation et les options d\'achat sont examinées ensemble avant toute démarche.',
      },
      {
        title: 'Suivi dans la Durée',
        body: 'Notre relation ne s\'arrête pas à la commande. Vous bénéficiez d\'un suivi régulier pour tirer le meilleur parti de chaque technologie.',
      },
    ],

    // Section 7: Enagic Credibility
    credibilityHeading: 'Plus de 50 Ans d\'Innovation et de Savoir-Faire',
    credibilityBody:
      'Les technologies du Duo sont développées par Enagic, fabricant japonais fondé en 1974 et présent à l\'échelle internationale sur de nombreux marchés.',
    credibilityPoints: [
      'Fondée au Japon',
      'Plus de 50 ans d\'histoire et d\'expertise',
      'Bureaux et centres de service internationaux',
      'Systèmes de management de la qualité certifiés ISO',
      'Assistance et garantie directe du constructeur',
    ],
    credibilityDisclaimer:
      'La disponibilité des produits, garanties, services et caractéristiques techniques peuvent varier selon les pays.',

    // Section 8: Personal Introduction
    guideLabel: 'VOTRE GUIDE PERSONNEL',
    guideHeadingPrefix: 'Pourquoi',
    guideHeadingSuffix: 'a Partagé Ceci Avec Vous',
    mehdiBio1: 'Je travaille dans l\'univers de la santé et du bien-être depuis plus de 10 ans.',
    mehdiBio2:
      'Mon rôle n\'est pas de vous convaincre que tout le monde a besoin des deux produits. Je suis là pour vous aider à comprendre la technologie, répondre en toute transparence à vos questions et voir ensemble si l\'une de ces solutions correspond à votre mode de vie.',
    mehdiBio3: 'Si une option n\'est pas adaptée à votre situation, je vous le dirai en toute franchise.',
    mehdiBio4:
      'Si vous choisissez d\'aller de l\'avant, je vous guiderai personnellement à chaque étape : choix du modèle, commande, installation et accompagnement dans la durée.',
    mehdiRole: 'Distributeur Indépendant Enagic',
    mehdiServing: 'Accompagnement en anglais, espagnol et à l\'international',
    defaultBio:
      'Je suis là pour vous aider à comprendre ces deux technologies, répondre avec clarté à vos questions et déterminer si ces solutions s\'intègrent à votre quotidien. Si vous souhaitez aller plus loin, je vous accompagnerai dans le choix des options, la commande et l\'assistance produit.',
    messageOnWhatsApp: 'Envoyer un Message sur WhatsApp',
    viewProfile: 'Voir le Profil',

    // Section 9: What Happens Next
    nextStepsHeading: 'Une Démarche Simple et Sans Pression',
    timelineSteps: [
      { num: '1', title: 'Regarder', desc: 'Visionnez les deux présentations et notez vos questions.' },
      { num: '2', title: 'Échanger', desc: 'Écrivez directement à votre distributeur ou demandez un échange personnalisé.' },
      { num: '3', title: 'Explorer', desc: 'Vérifiez la disponibilité, l\'installation, les tarifs, les options de paiement et le choix le plus adapté.' },
      { num: '4', title: 'Décider', desc: 'Ne prenez votre décision que lorsque vous aurez toutes les réponses et vous sentirez parfaitement en confiance.' },
    ],

    // Section 10: FAQ
    faqHeading: 'Questions Fréquentes',
    faqs: [
      {
        q: 'Dois-je obligatoirement acheter les deux produits ?',
        a: 'Non. Le Duo présente les deux technologies ensemble, mais votre distributeur pourra vous détailler les options individuelles.',
      },
      {
        q: 'Puis-je commander uniquement le K8 ou emGuarde GO ?',
        a: 'Oui, selon les disponibilités dans votre pays. Échangez avec votre distributeur pour faire le point.',
      },
      {
        q: 'Le K8 remplace-t-il un filtre à eau classique ?',
        a: 'Le K8 intègre une cartouche de filtration de pointe, mais la qualité de l\'eau varie selon les régions. Un diagnostic de votre eau peut être recommandé.',
      },
      {
        q: 'Le K8 s\'adapte-t-il à mon robinet ?',
        a: 'Le K8 est compatible avec la majorité des robinets standards. Vous pouvez partager des photos pour confirmer l\'adaptateur adéquat.',
      },
      {
        q: 'emGuarde GO bloque-t-il les ondes ou les signaux ?',
        a: 'Non. Il n\'est pas conçu pour bloquer ou brouiller le Wi-Fi, le Bluetooth ou les réseaux mobiles.',
      },
      {
        q: 'emGuarde GO est-il un appareil médical ?',
        a: 'Non. Il s\'agit d\'un dispositif d\'harmonisation environnementale, sans vocation médicale de diagnostic ou de traitement.',
      },
      {
        q: 'Des facilités de paiement sont-elles disponibles ?',
        a: 'Les solutions de financement varient selon les pays. Votre distributeur vous indiquera les modalités envisageables.',
      },
      {
        q: 'Puis-je commander si j\'habite hors des États-Unis ?',
        a: 'La disponibilité, les prix, les voltages et les modalités de commande dépendent de chaque pays. Contactez votre distributeur pour confirmation.',
      },
      {
        q: 'Quel accompagnement vais-je recevoir ?',
        a: 'Vous bénéficierez d\'un suivi complet : choix du matériel, commande, installation, conseils d\'utilisation et formation continue.',
      },
    ],

    // Section 11: Paths
    exploreHeading: 'Que Souhaitez-Vous Découvrir ?',
    exploreSub: 'Choisissez l\'option qui correspond le mieux à votre démarche.',
    productsCardTitle: 'Les Produits',
    productsCardBody: 'Je m\'intéresse principalement au K8, à emGuarde GO ou au Duo pour un usage personnel ou familial.',
    productsCardBtn: 'Découvrir les Options Produits',
    businessCardTitle: 'L\'Opportunité Commerciale',
    businessCardBody: 'Je souhaite également comprendre comment ces produits s\'articulent avec le modèle économique d\'Enagic.',
    businessCardBtn: 'Découvrir l\'Opportunité',

    // Section 12: Final CTA
    finalHeading: 'Vous Avez Découvert les Technologies. Parlons de Vos Besoins.',
    finalBody1: 'Vous n\'avez pas besoin de prendre une décision aujourd\'hui.',
    finalBody2:
      'La prochaine étape consiste simplement à poser vos questions, vérifier les disponibilités dans votre pays et déterminer si l\'une ou l\'autre de ces technologies vous convient.',
    requestConsultation: 'Demander Plus d\'Informations',
    finalTrust: 'Sans pression. Sans engagement. Juste un échange authentique.',
    stickyMobileCta: 'Échanger avec',
  },

  pt: {
    badge: 'APRESENTAÇÃO PRIVADA DE PRODUTO',
    headline: 'Duas Tecnologias. Um Estilo de Vida Mais Consciente.',
    heroBody1:
      'A maioria das pessoas cuida com atenção dos alimentos que consome e do ar que respira. Mas dois ambientes também fazem parte do dia a dia: a água que utilizamos e a tecnologia que nos cerca.',
    heroBody2:
      'O Duo apresenta duas tecnologias independentes desenvolvidas para esses ambientes: o Leveluk K8 e o portátil emGuarde GO.',
    sharedBy: 'Compartilhado pessoalmente com você por',
    watchPresentations: 'Assistir às Apresentações',
    messageDistributor: 'Enviar Mensagem para',
    contactDistributor: 'Contatar',
    takeYourTime: 'Leve o tempo que precisar. Assista a ambas as apresentações e anote as dúvidas que surgirem.',
    verifiedGuide: 'Seu Guia Verificado',
    verifiedDistributor: 'Distribuidor Independente Verificado',

    // Section 2: Presentations
    presentationsHeading: 'Comece pelas Apresentações',
    presentationsSub:
      'Estas duas apresentações oferecem uma visão detalhada de cada tecnologia, seu propósito de desenvolvimento e como ela se integra ao cotidiano.',
    k8Label: '01 · SEU AMBIENTE DE ÁGUA',
    k8Title: 'Leveluk K8',
    k8Subtitle: 'Uma forma diferente de pensar sobre a água que você usa todos os dias.',
    k8Time: 'Tempo estimado: aproximadamente 4 minutos',

    emguardeLabel: '02 · SEU AMBIENTE ELETROMAGNÉTICO',
    emguardeTitle: 'emGuarde GO',
    emguardeSubtitle: 'Apoio ambiental portátil para um mundo cercado de tecnologia.',
    emguardeTime: 'Tempo estimado: aproximadamente 8 minutos',

    postVideosNote:
      'Depois de assistir a ambas as apresentações, continue abaixo para entender por que essas duas tecnologias são apresentadas juntas.',

    // Section 3: Why the Duo
    whyDuoHeading: 'Agora que você conheceu ambas as tecnologias, por que apresentá-las juntas?',
    whyDuoP1: 'O K8 e o emGuarde GO não realizam a mesma função.',
    whyDuoP2: 'Eles foram criados para dois aspectos diferentes da vida moderna.',
    whyDuoP3:
      'O Leveluk K8 se integra ao sistema de água da sua casa, produzindo cinco tipos de água para consumo e diferentes usos domésticos.',
    whyDuoP4:
      'O emGuarde GO é portátil. Foi projetado para acompanhar você nos ambientes onde você utiliza celulares, Wi-Fi, notebooks, veículos e outros aparelhos conectados.',
    whyDuoP5: 'Um foca na água que você utiliza.',
    whyDuoP6: 'O outro foca no ambiente eletromagnético ao seu redor.',
    whyDuoP7: 'O Duo os reúne para quem busca uma abordagem mais consciente em ambos os aspectos.',
    whyDuoBanner: 'Um para o seu lar. Um para onde a vida levar você.',

    // Section 4: Leveluk K8 Information
    k8SectionTitle: 'Conheça o Leveluk K8',
    k8SectionSub: 'Muito Mais Que Água para Beber',
    k8SectionBody:
      'O Leveluk K8 é um sistema doméstico de ionização de água desenvolvido para produzir cinco tipos de água para consumo e diversas aplicações do dia a dia.',
    k8Features: [
      { title: 'Oito Placas de Titânio Banhadas a Platina', desc: 'Desenvolvidas para ionização constante e alta durabilidade.' },
      { title: 'Cinco Tipos de Água', desc: 'Diferentes níveis de pH para beber, cozinhar, beleza e higienização.' },
      { title: 'Sistema de Limpeza Automática', desc: 'Manutenção automática programada para preservar as placas.' },
      { title: 'Display e Áudio Multilíngues', desc: 'Tela LCD colorida com avisos por voz em 8 idiomas.' },
      { title: 'Compatibilidade de Voltagem Internacional', desc: 'Fonte inteligente adaptável às redes elétricas do mundo todo.' },
      { title: 'Garantia de Fábrica de Cinco Anos', desc: 'Suportado pela garantia oficial de 5 anos da Enagic.' },
      { title: 'Fabricado pela Enagic no Japão', desc: 'Produzido com precisão na fábrica própria da Enagic em Osaka.' },
    ],
    k8WaterTypesTitle: 'Entenda os 5 Tipos de Água',
    k8WaterTypes: [
      { name: 'Água Kangen Forte (pH 11.5)', usage: 'Preparo de alimentos, lavagem de vegetais e limpeza doméstica.' },
      { name: 'Kangen Water® (pH 8.5 – 9.5)', usage: 'Água saborosa para hidratação diária, chás, cafés e receitas.' },
      { name: 'Água Limpa (pH 7.0)', usage: 'Água neutra filtrada ideal para remédios e fórmulas infantis.' },
      { name: 'Água de Beleza (pH 4.0 – 6.0)', usage: 'Água levemente ácida para cuidados com a pele e tonificação facial.' },
      { name: 'Água Ácida Forte (pH 2.5)', usage: 'Água desinfetante para higienização de utensílios e superfícies.' },
    ],
    askAboutK8: 'Falar com',
    aboutK8: 'sobre o K8',

    // Section 5: emGuarde GO Information
    emguardeSectionTitle: 'Conheça o emGuarde GO',
    emguardeSectionSub: 'Projetado para a Vida Moderna',
    emguardeSectionBody:
      'Celulares, Wi-Fi, Bluetooth, notebooks, veículos e aparelhos conectados tornaram-se parte do cotidiano. O emGuarde GO foi criado para quem deseja ter mais atenção com seu ambiente eletromagnético sem abrir mão da tecnologia moderna.',
    emguardeFeatures: [
      { title: 'Kit Portátil com Duas Unidades', desc: 'Acompanha duas unidades para posicionar no seu quarto, trabalho ou viagens.' },
      { title: 'Diâmetro de Cobertura de Aprox. 3 Metros', desc: 'Harmonização ambiental de proximidade por dispositivo.' },
      { title: 'Recarregável via USB-C', desc: 'Conector moderno e prático compatível com cabos USB-C comuns.' },
      { title: 'Até 72 Horas de Bateria', desc: 'Longa autonomia para acompanhar você em voos, trajetos e reuniões.' },
      { title: 'Para Casa, Trabalho, Veículos e Viagens', desc: 'Formato compacto e elegante que se integra ao seu dia a dia.' },
      { title: 'Não Bloqueia Sinais de Wi-Fi ou Celular', desc: 'Opera com total tranquilidade junto aos seus aparelhos eletrônicos.' },
    ],
    emguardeDisclaimer:
      'O emGuarde GO não é um dispositivo médico e não se destina a diagnosticar, tratar, curar ou prevenir qualquer condição de saúde. A disponibilidade e especificações podem variar por país.',
    askAboutEmguarde: 'Falar com',
    aboutEmguarde: 'sobre o emGuarde GO',

    // Section 6: Why People Explore the Duo
    whyExploreTitle: 'Por Que as Pessoas Escolhem o Duo?',
    whyExploreCards: [
      {
        title: 'Dois Propósitos Diferentes',
        body: 'Uma tecnologia foca no seu ambiente de água. A outra foca no seu ambiente eletromagnético.',
      },
      {
        title: 'Em Casa e em Movimento',
        body: 'O K8 se torna parte do seu lar, enquanto o emGuarde GO acompanha a sua rotina onde você for.',
      },
      {
        title: 'Orientação Pessoal',
        body: 'Suas dúvidas, disponibilidade no país, requisitos de instalação e formas de compra são avaliados pessoalmente.',
      },
      {
        title: 'Suporte Contínuo',
        body: 'O relacionamento não termina na compra. Você conta com suporte para usar e aproveitar o melhor das tecnologias.',
      },
    ],

    // Section 7: Enagic Credibility
    credibilityHeading: 'Mais de 50 Anos de Inovação e Credibilidade',
    credibilityBody:
      'As tecnologias do Duo são fabricadas pela Enagic, fabricante japonesa fundada em 1974 com sólida presença internacional em múltiplos mercados.',
    credibilityPoints: [
      'Fundada no Japão',
      'Mais de 50 anos de história corporativa',
      'Escritórios e centros de atendimento internacionais',
      'Sistemas de qualidade com certificação ISO',
      'Suporte direto e garantia do fabricante',
    ],
    credibilityDisclaimer:
      'A disponibilidade dos produtos, garantias, opções de suporte e especificações variam de acordo com o país.',

    // Section 8: Personal Introduction
    guideLabel: 'SEU GUIA PESSOAL',
    guideHeadingPrefix: 'Por Que',
    guideHeadingSuffix: 'Compartilhou Isso com Você',
    mehdiBio1: 'Atuo no setor de saúde e bem-estar há mais de 10 anos.',
    mehdiBio2:
      'Não estou aqui para dizer que todo mundo precisa dos dois produtos. Meu papel é ajudar você a compreender a tecnologia, responder às suas dúvidas com total transparência e avaliar se alguma das soluções faz sentido para a sua rotina.',
    mehdiBio3: 'Se algo não for adequado para você, serei o primeiro a lhe dizer.',
    mehdiBio4:
      'Caso decida avançar, vou orientar você pessoalmente quanto às opções, processo de pedido, instalação e suporte contínuo.',
    mehdiRole: 'Distribuidor Independente Enagic',
    mehdiServing: 'Atendimento em inglês, espanhol e mercados globais',
    defaultBio:
      'Estou aqui para ajudar você a compreender ambas as tecnologias, tirar suas dúvidas com total clareza e verificar se alguma das soluções se adapta ao seu estilo de vida. Se decidir avançar, orientarei você nas opções disponíveis, pedidos e suporte contínuo.',
    messageOnWhatsApp: 'Conversar no WhatsApp',
    viewProfile: 'Ver Perfil',

    // Section 9: What Happens Next
    nextStepsHeading: 'Um Próximo Passo Simples e Sem Pressão',
    timelineSteps: [
      { num: '1', title: 'Assista', desc: 'Assista a ambas as apresentações e anote suas dúvidas.' },
      { num: '2', title: 'Conecte-se', desc: 'Fale diretamente com seu distribuidor ou solicite uma conversa personalizada.' },
      { num: '3', title: 'Explore', desc: 'Confira disponibilidade, instalação, valores, formas de pagamento e qual produto atende melhor suas necessidades.' },
      { num: '4', title: 'Decida', desc: 'Avance apenas quando compreender claramente o que está adquirindo e se sentir 100% seguro com sua decisão.' },
    ],

    // Section 10: FAQ
    faqHeading: 'Perguntas Frequentes',
    faqs: [
      {
        q: 'Preciso comprar os dois produtos?',
        a: 'Não. O Duo apresenta as duas tecnologias juntas, mas seu distribuidor pode explicar as opções individuais no seu mercado.',
      },
      {
        q: 'Posso comprar apenas o K8 ou o emGuarde GO?',
        a: 'Sim, de acordo com a disponibilidade de estoque no seu país. Fale com seu distribuidor para avaliar.',
      },
      {
        q: 'O K8 substitui um filtro de água?',
        a: 'O K8 inclui elemento filtrante interno de alta tecnologia, mas as características da água variam. É recomendável avaliar sua água antes da instalação.',
      },
      {
        q: 'O K8 encaixa na minha torneira?',
        a: 'O K8 funciona com os tipos mais comuns de torneiras. Fotos da sua torneira podem ser solicitadas para confirmar os adaptadores.',
      },
      {
        q: 'O emGuarde GO bloqueia o sinal de Wi-Fi ou celular?',
        a: 'Não. Ele não bloqueia nem interfere em sinais de Wi-Fi, Bluetooth, rede móvel ou aparelhos eletrônicos.',
      },
      {
        q: 'O emGuarde GO é um dispositivo médico?',
        a: 'Não. É um dispositivo de harmonização ambiental e não se destina a diagnosticar, tratar, curar ou prevenir condições médicas.',
      },
      {
        q: 'Existem opções de parcelamento?',
        a: 'As condições variam conforme o país e a análise de crédito individual. Seu distribuidor apresentará as opções vigentes.',
      },
      {
        q: 'Posso comprar morando fora dos Estados Unidos?',
        a: 'A disponibilidade, preços, voltagens e procedimentos variam por país. Consulte seu distribuidor para confirmar.',
      },
      {
        q: 'Qual suporte eu receberei?',
        a: 'Você terá orientação na escolha dos equipamentos, pedidos, instalação, uso no dia a dia e suporte educacional contínuo.',
      },
    ],

    // Section 11: Paths
    exploreHeading: 'O Que Você Gostaria de Explorar?',
    exploreSub: 'Escolha a opção que melhor reflete o seu objetivo.',
    productsCardTitle: 'Os Produtos',
    productsCardBody: 'Tenho interesse principalmente no K8, emGuarde GO ou no Duo para uso pessoal ou familiar.',
    productsCardBtn: 'Explorar Opções de Produtos',
    businessCardTitle: 'O Negócio',
    businessCardBody: 'Também quero entender como esses produtos se conectam ao modelo de negócios da Enagic.',
    businessCardBtn: 'Conhecer a Oportunidade',

    // Section 12: Final CTA
    finalHeading: 'Você Conheceu as Tecnologias. Vamos Conversar Sobre Suas Necessidades.',
    finalBody1: 'Você não precisa tomar uma decisão hoje.',
    finalBody2:
      'O próximo passo é apenas esclarecer suas dúvidas, conferir a disponibilidade no seu país e avaliar se uma ou ambas as tecnologias fazem sentido para você.',
    requestConsultation: 'Solicitar Mais Informações',
    finalTrust: 'Sem pressão. Sem compromisso. Apenas uma conversa sincera.',
    stickyMobileCta: 'Conversar com',
  },
}

export function DuoLandingPage({ profile: initialProfile, distributorSlug }: DuoLandingPageProps) {
  const { locale, setLocale } = useLocaleContext()
  const navigate = useNavigate()
  const routeParams = useParams<{ slug?: string }>()
  const [searchParams] = useSearchParams()

  const resolvedSlug = routeParams.slug || searchParams.get('ref') || distributorSlug || 'mehdi-cohen'
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(initialProfile)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [hideStickyAtBottom, setHideStickyAtBottom] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const presentationsRef = useRef<HTMLDivElement>(null)

  const t = I18N[locale] || I18N.en

  // Load profile if missing or dynamic
  useEffect(() => {
    if (initialProfile && initialProfile.slug === resolvedSlug) {
      setProfile(initialProfile)
      return
    }
    getPublicDistributors().then((distributors) => {
      const found = distributors.find((d) => d.slug === resolvedSlug || d.referral_code === resolvedSlug)
      setProfile(found || distributors.find((d) => d.slug === 'mehdi-cohen') || distributors[0] || null)
    })
  }, [initialProfile, resolvedSlug])

  const distributorName = profile?.display_name || (resolvedSlug === 'mehdi-cohen' ? 'Mehdi Cohen' : 'True Legacy')
  const distributorFirstName = distributorName.split(' ')[0]
  const distributorSlugActive = profile?.slug || resolvedSlug || 'mehdi-cohen'
  const referralCode = profile?.referral_code || distributorSlugActive

  const leaderPhoto =
    profile?.avatar_url ||
    getLeaderPortrait(distributorSlugActive, LEADER_PORTRAITS[distributorSlugActive]) ||
    '/leaders/standardized/mehdi-cohen.png'

  // WhatsApp personalized destination
  const whatsappNumber = profile?.phone ? profile.phone.replace(/\D/g, '') : '18649072149'
  
  const generateWhatsAppUrl = (topic?: string) => {
    let message = ''
    if (locale === 'es') {
      message = topic
        ? `Hola ${distributorFirstName}, vi tu presentación del Duo en True Legacy y me gustaría hacerte unas preguntas sobre ${topic}.`
        : `Hola ${distributorFirstName}, vi tu presentación del Duo en True Legacy y me gustaría conversar contigo.`
    } else if (locale === 'fr') {
      message = topic
        ? `Bonjour ${distributorFirstName}, j'ai regardé votre présentation Duo sur True Legacy et j'aimerais vous poser quelques questions sur ${topic}.`
        : `Bonjour ${distributorFirstName}, j'ai regardé votre présentation Duo sur True Legacy et j'aimerais échanger avec vous.`
    } else if (locale === 'pt') {
      message = topic
        ? `Olá ${distributorFirstName}, assisti à sua apresentação do Duo na True Legacy e gostaria de tirar dúvidas sobre ${topic}.`
        : `Olá ${distributorFirstName}, assisti à sua apresentação do Duo na True Legacy e gostaria de conversar com você.`
    } else {
      message = topic
        ? `Hi ${distributorFirstName}, I watched your Duo presentation on True Legacy and would like to ask a few questions about ${topic}.`
        : `Hi ${distributorFirstName}, I watched your Duo presentation on True Legacy and would like to connect with you.`
    }
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  const defaultWhatsAppUrl = generateWhatsAppUrl()
  const k8WhatsAppUrl = generateWhatsAppUrl('Leveluk K8')
  const emguardeWhatsAppUrl = generateWhatsAppUrl('emGuarde GO')

  // Product & Business URLs preserving referral and attribution
  const productInquiryUrl = `/apply?ref=${encodeURIComponent(referralCode)}&interest=duo-products&source=duo`
  const consultationUrl = `/apply?ref=${encodeURIComponent(referralCode)}&interest=duo&source=duo`
  const businessPageUrl = `/d/${encodeURIComponent(distributorSlugActive)}/business`

  // Video URLs
  const k8VideoUrl = localizedProductVideo('kangenWater', locale)
  const emguardeVideoUrl = localizedProductVideo('emguardeGo', locale)

  // Track scroll for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom
        setShowStickyCta(heroBottom < 0)
      }
      if (finalCtaRef.current) {
        const finalTop = finalCtaRef.current.getBoundingClientRect().top
        setHideStickyAtBottom(finalTop < window.innerHeight - 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track Duo Page View in CRM
  useEffect(() => {
    if (distributorSlugActive && crmSupabase) {
      void crmSupabase.rpc('crm_track_share_click', {
        p_slug: distributorSlugActive,
        p_campaign: 'duo',
        p_locale: locale,
      })
    }
  }, [distributorSlugActive, locale])

  const scrollToPresentations = () => {
    if (presentationsRef.current) {
      presentationsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#040711] text-[#f5f5f7] font-sans antialiased selection:bg-cyan-500/30 selection:text-white relative">
      <SEO
        title={`True Legacy Duo | ${distributorName}`}
        description={`${t.headline} — ${t.heroBody1.slice(0, 150)}...`}
        image="https://www.truelegacyworld.com/logos/tl-square-white.png"
      />

      {/* ========================================================================= */}
      {/* SIMPLIFIED DEDICATED HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#040711]/90 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to={`/d/${encodeURIComponent(distributorSlugActive)}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
              title="Return to Leader Hub"
            >
              <ArrowLeft className="h-4 w-4 text-cyan-400" />
              <span className="hidden xs:inline">Back to Profile</span>
              <span className="xs:hidden">Back</span>
            </Link>
            <Link to="/" className="flex items-center gap-3 group">
              <TrueLegacyLogo variant="nav" />
            </Link>
          </div>

          {/* Right Controls: Language Selector + Single Contact Button */}
          <div className="flex items-center gap-3 sm:gap-4">
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
                  {lang === 'en' ? 'EN' : lang === 'es' ? 'ES' : lang === 'fr' ? 'FR' : 'PT'}
                </button>
              ))}
            </div>

            {/* Contact Distributor Button */}
            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  location: 'duo_header',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/15 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xs:inline">{t.contactDistributor} {distributorFirstName}</span>
              <span className="xs:hidden">{t.contactDistributor}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: PREMIUM OPENING */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-white/10"
      >
        {/* Subtle dual-tech lighting background (Blue for K8 Water, Teal/Green for emGuarde) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
          <div className="absolute -top-20 right-1/4 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-indigo-500/5 blur-[160px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Private Presentation Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300 shadow-sm backdrop-blur-md">
            <Lock className="h-3 w-3 text-cyan-400" />
            {t.badge}
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.14] max-w-4xl">
            {t.headline}
          </h1>

          {/* Supporting Copy */}
          <div className="mt-6 max-w-3xl space-y-3 text-base sm:text-lg text-[#cccccc] leading-relaxed">
            <p>{t.heroBody1}</p>
            <p className="font-medium text-slate-200">{t.heroBody2}</p>
          </div>

          {/* Personalized Line & Subtle Verified Badge */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.03] p-2.5 sm:pr-6 backdrop-blur-xl shadow-xl">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-cyan-400/40 bg-slate-900 shadow-inner">
              <img
                src={leaderPhoto}
                alt={distributorName}
                className="h-full w-full object-cover object-top"
              />
              <span
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#040711]"
                title="Verified"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                <span>{t.verifiedGuide}</span>
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <p className="text-sm font-semibold text-white">
                {t.sharedBy} <strong className="text-cyan-300">{distributorName}</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={scrollToPresentations}
              className="w-full sm:w-auto inline-flex min-h-13 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 transition-all active:scale-95"
            >
              <PlayCircle className="h-5 w-5" />
              {t.watchPresentations}
            </button>

            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  location: 'duo_hero',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="w-full sm:w-auto inline-flex min-h-13 items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              {t.messageDistributor} {distributorFirstName}
            </a>

            <Link
              to={consultationUrl}
              onClick={() =>
                trackEvent('form_click', {
                  location: 'duo_hero_consultation',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="w-full sm:w-auto inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-7 py-3.5 text-base font-bold text-white transition-all shadow-lg active:scale-95"
            >
              {t.requestConsultation}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Small Supporting Note */}
          <p className="mt-5 text-xs text-[#86868b] max-w-md">
            {t.takeYourTime}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PRESENTATIONS (EXISTING VIDEOS PRESERVED) */}
      {/* ========================================================================= */}
      <section
        id="presentations"
        ref={presentationsRef}
        className="py-16 sm:py-24 border-b border-white/10 relative bg-[#060a17]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#2997ff]">
              <PlayCircle className="h-3.5 w-3.5" />
              Video Demonstrations
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.presentationsHeading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#cccccc] leading-relaxed">
              {t.presentationsSub}
            </p>
          </div>

          {/* 2 Video Cards Grid */}
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Video 1: K8 Water Ionizer */}
            <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-[#0e1629] to-[#080d1a] p-5 sm:p-7 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                    {t.k8Label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#86868b]">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    {t.k8Time}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{t.k8Title}</h3>
                <p className="mt-1 text-sm text-[#cccccc] mb-4">{t.k8Subtitle}</p>
              </div>

              {/* 16:9 Video Embed */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner">
                <div className="relative w-full pt-[56.25%]">
                  <iframe
                    src={k8VideoUrl.includes('youtu.be') || k8VideoUrl.includes('youtube.com') ? k8VideoUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/').split('?')[0] : k8VideoUrl}
                    title="Leveluk K8 Water Technology Presentation"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs text-[#86868b]">
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  Five Distinct Water Outputs
                </span>
                <span className="font-semibold text-slate-300">Japan Crafted</span>
              </div>
            </div>

            {/* Video 2: emGuarde GO */}
            <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[#0e1f1f] to-[#081212] p-5 sm:p-7 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    {t.emguardeLabel}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#86868b]">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    {t.emguardeTime}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{t.emguardeTitle}</h3>
                <p className="mt-1 text-sm text-[#cccccc] mb-4">{t.emguardeSubtitle}</p>
              </div>

              {/* 16:9 Video Embed */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner">
                <div className="relative w-full pt-[56.25%]">
                  <iframe
                    src={emguardeVideoUrl.includes('youtu.be') || emguardeVideoUrl.includes('youtube.com') ? emguardeVideoUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/').split('?')[0] : emguardeVideoUrl}
                    title="emGuarde GO Environmental Presentation"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs text-[#86868b]">
                <span className="flex items-center gap-1.5">
                  <Radio className="h-4 w-4 text-emerald-400" />
                  Portable Dual Set
                </span>
                <span className="font-semibold text-slate-300">USB-C Rechargeable</span>
              </div>
            </div>
          </div>

          {/* Post-Video Transition Banner */}
          <div className="mt-12 rounded-2xl border border-white/15 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-emerald-500/10 p-6 text-center backdrop-blur-md">
            <p className="text-sm sm:text-base font-medium text-slate-200">
              {t.postVideosNote}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHY INTRODUCE THEM TOGETHER? */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#040711] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(217,170,72,0.06),transparent_60%)]" />
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300/90">
              The Duo Concept
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {t.whyDuoHeading}
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* High Quality Product Composition */}
            <div className="relative rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#15130f] via-[#0d0d0f] to-[#07070a] p-6 sm:p-10 shadow-2xl text-center">
              <div className="absolute top-4 right-4 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">
                Flagship Duo
              </div>

              <div className="grid grid-cols-2 gap-4 items-center justify-center my-4">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center">
                  <img
                    src="/products/k8.png"
                    alt="Leveluk K8 Home Water Ionizer"
                    className="h-36 sm:h-48 w-full object-contain"
                    loading="lazy"
                  />
                  <p className="mt-2 text-xs font-bold text-cyan-300">Leveluk K8</p>
                  <p className="text-[10px] text-[#86868b]">For Your Home Water</p>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center">
                  <img
                    src="/products/emguarde-go.png"
                    alt="emGuarde GO Portable Harmonizer Set"
                    className="h-36 sm:h-48 w-full object-contain"
                    loading="lazy"
                  />
                  <p className="mt-2 text-xs font-bold text-emerald-300">emGuarde GO</p>
                  <p className="text-[10px] text-[#86868b]">For Everywhere You Go</p>
                </div>
              </div>

              {/* Highlighted Statement Banner */}
              <div className="mt-6 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 p-4 text-center">
                <p className="text-base sm:text-lg font-black text-amber-200 tracking-wide">
                  "{t.whyDuoBanner}"
                </p>
              </div>
            </div>

            {/* Structured Logical Explanation */}
            <div className="space-y-5 text-base sm:text-lg text-[#cccccc] leading-relaxed">
              <p className="font-semibold text-white text-lg sm:text-xl">
                {t.whyDuoP1} {t.whyDuoP2}
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                <p className="flex items-start gap-3">
                  <Droplets className="h-5 w-5 shrink-0 text-cyan-400 mt-1" />
                  <span>{t.whyDuoP3}</span>
                </p>
                <p className="flex items-start gap-3">
                  <Radio className="h-5 w-5 shrink-0 text-emerald-400 mt-1" />
                  <span>{t.whyDuoP4}</span>
                </p>
              </div>
              <div className="pt-2 space-y-2 text-slate-300">
                <p className="font-medium">· {t.whyDuoP5}</p>
                <p className="font-medium">· {t.whyDuoP6}</p>
                <p className="mt-4 font-semibold text-white">{t.whyDuoP7}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: LEVELUK K8 PRODUCT INFORMATION */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#060914] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center mb-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                {t.k8SectionSub}
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {t.k8SectionTitle}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-[#cccccc] leading-relaxed">
                {t.k8SectionBody}
              </p>
              <div className="mt-7">
                <a
                  href={k8WhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('whatsapp_click', {
                      location: 'duo_k8_section',
                      distributor: distributorSlugActive,
                      locale,
                    })
                  }
                  className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.askAboutK8} {distributorFirstName} {t.aboutK8}
                </a>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8 shadow-2xl backdrop-blur-xl">
                <img
                  src="/products/k8.png"
                  alt="Leveluk K8 Water Ionizer Unit"
                  className="h-64 sm:h-80 w-auto object-contain mx-auto drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* 7 Feature Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-14">
            {t.k8Features.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/30 transition-all"
              >
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Five Water Types Breakdown */}
          <div className="rounded-3xl border border-cyan-500/20 bg-[#081024] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-cyan-400" />
              {t.k8WaterTypesTitle}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.k8WaterTypes.map((wt, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <p className="font-bold text-sm text-cyan-300">{wt.name}</p>
                  <p className="mt-1.5 text-xs text-[#cccccc] leading-relaxed">{wt.usage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: EMGUARDE GO PRODUCT INFORMATION */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#040c0c] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center mb-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                {t.emguardeSectionSub}
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {t.emguardeSectionTitle}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-[#cccccc] leading-relaxed">
                {t.emguardeSectionBody}
              </p>
              <div className="mt-7">
                <a
                  href={emguardeWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('whatsapp_click', {
                      location: 'duo_emguarde_section',
                      distributor: distributorSlugActive,
                      locale,
                    })
                  }
                  className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.askAboutEmguarde} {distributorFirstName} {t.aboutEmguarde}
                </a>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8 shadow-2xl backdrop-blur-xl">
                <img
                  src="/products/emguarde-go.png"
                  alt="emGuarde GO Dual Portable Set"
                  className="h-64 sm:h-80 w-auto object-contain mx-auto drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {t.emguardeFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-emerald-400/30 transition-all"
              >
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Required Official Compliance Disclaimer */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
            <p className="text-xs text-[#86868b] leading-relaxed max-w-3xl mx-auto">
              {t.emguardeDisclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: WHY PEOPLE EXPLORE THE DUO */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#060a17]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.whyExploreTitle}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.whyExploreCards.map((card, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/15 bg-white/[0.03] p-6 sm:p-7 flex flex-col justify-between hover:border-white/30 transition-all"
              >
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    {i === 0 && <Layers className="h-5 w-5" />}
                    {i === 1 && <Globe2 className="h-5 w-5" />}
                    {i === 2 && <UserCheck className="h-5 w-5" />}
                    {i === 3 && <ShieldCheck className="h-5 w-5" />}
                  </div>
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  <p className="mt-2.5 text-sm text-[#cccccc] leading-relaxed">{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: ENAGIC CREDIBILITY */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#040711] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#2997ff]">
            <Award className="h-4 w-4" />
            Global Manufacturer Heritage
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {t.credibilityHeading}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
            {t.credibilityBody}
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto">
            {t.credibilityPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left text-sm font-medium text-slate-200"
              >
                <Check className="h-4 w-4 shrink-0 text-cyan-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-[#86868b] max-w-xl mx-auto">
            {t.credibilityDisclaimer}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: PERSONAL INTRODUCTION FROM DISTRIBUTOR */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#060a17]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#04060a] p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Distributor Photo */}
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-3xl border-2 border-cyan-400/40 bg-slate-900 shadow-2xl">
                <img
                  src={leaderPhoto}
                  alt={distributorName}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Bio & Details */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300">
                  {t.guideLabel}
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">
                  {t.guideHeadingPrefix} {distributorFirstName} {t.guideHeadingSuffix}
                </h2>

                {/* Specific copy for Mehdi Cohen or dynamic profile bio */}
                <div className="mt-4 space-y-3 text-sm sm:text-base text-[#cccccc] leading-relaxed">
                  {distributorSlugActive === 'mehdi-cohen' ? (
                    <>
                      <p>{t.mehdiBio1}</p>
                      <p>{t.mehdiBio2}</p>
                      <p className="font-semibold text-white">{t.mehdiBio3}</p>
                      <p>{t.mehdiBio4}</p>
                    </>
                  ) : profile?.bio ? (
                    <p className="whitespace-pre-line">{profile.bio}</p>
                  ) : (
                    <p>{t.defaultBio}</p>
                  )}
                </div>

                {/* Signature Tag */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-base">{distributorName}</p>
                    <p className="text-xs text-cyan-400">
                      {distributorSlugActive === 'mehdi-cohen' ? t.mehdiRole : profile?.title || t.verifiedDistributor}
                    </p>
                    {distributorSlugActive === 'mehdi-cohen' && (
                      <p className="text-[11px] text-[#86868b]">{t.mehdiServing}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={defaultWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-md active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t.messageOnWhatsApp}
                    </a>
                    <Link
                      to={`/d/${distributorSlugActive}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                    >
                      {t.viewProfile}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: WHAT HAPPENS NEXT (4-STEP TIMELINE) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#040711]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.nextStepsHeading}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-base font-black text-cyan-300">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">
                    Step {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#cccccc] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#060a17]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.faqHeading}
            </h2>
          </div>

          <div className="space-y-3">
            {t.faqs.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-base sm:text-lg font-bold text-white hover:text-cyan-300 transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-cyan-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-sm sm:text-base text-[#cccccc] leading-relaxed border-t border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11: IDENTIFY INTEREST */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-[#040711]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.exploreHeading}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#cccccc]">
              {t.exploreSub}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1: The Products */}
            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-[#0c1424] to-[#060a12] p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-white">{t.productsCardTitle}</h3>
                <p className="mt-3 text-base text-[#cccccc] leading-relaxed">
                  {t.productsCardBody}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <Link
                  to={productInquiryUrl}
                  onClick={() =>
                    trackEvent('link_click', {
                      location: 'duo_interest_products',
                      distributor: distributorSlugActive,
                      locale,
                    })
                  }
                  className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/15"
                >
                  {t.productsCardBtn}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: The Business */}
            <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#18140c] to-[#0a0806] p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-400/20">
                  <Globe2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-white">{t.businessCardTitle}</h3>
                <p className="mt-3 text-base text-[#cccccc] leading-relaxed">
                  {t.businessCardBody}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <Link
                  to={businessPageUrl}
                  onClick={() =>
                    trackEvent('link_click', {
                      location: 'duo_interest_business',
                      distributor: distributorSlugActive,
                      locale,
                    })
                  }
                  className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 px-6 py-3.5 font-bold text-amber-200 transition-colors shadow-lg shadow-amber-500/10"
                >
                  {t.businessCardBtn}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 12: FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section ref={finalCtaRef} className="py-20 sm:py-28 bg-[#03050c] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full border-2 border-cyan-400/40 p-0.5 shadow-2xl">
            <img
              src={leaderPhoto}
              alt={distributorName}
              className="h-full w-full rounded-full object-cover object-top"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            {t.finalHeading}
          </h2>

          <div className="mt-5 max-w-2xl mx-auto space-y-2 text-base sm:text-lg text-[#cccccc] leading-relaxed">
            <p className="font-semibold text-slate-200">{t.finalBody1}</p>
            <p>{t.finalBody2}</p>
          </div>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  location: 'duo_final_cta',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="w-full sm:w-auto inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-8 py-4 text-base font-bold text-slate-950 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              {t.messageDistributor} {distributorFirstName} on WhatsApp
            </a>

            <Link
              to={consultationUrl}
              onClick={() =>
                trackEvent('form_click', {
                  location: 'duo_final_consultation',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="w-full sm:w-auto inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 px-8 py-4 text-base font-bold text-white transition-all shadow-lg active:scale-95"
            >
              {t.requestConsultation}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-6 text-sm font-medium text-[#86868b]">
            {t.finalTrust}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MOBILE STICKY CTA BUTTON */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showStickyCta && !hideStickyAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-4 left-4 z-40 sm:hidden"
          >
            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  location: 'duo_mobile_sticky',
                  distributor: distributorSlugActive,
                  locale,
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-slate-950 shadow-2xl shadow-emerald-500/30 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              {t.stickyMobileCta} {distributorFirstName}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
