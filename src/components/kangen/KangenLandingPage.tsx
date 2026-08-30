import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  ExternalLink,
  Globe2,
  MessageCircle,
  PlayCircle,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext, type Locale } from '@/contexts/LocaleContext'
import { PRODUCT_VIDEOS } from '@/lib/productVideos'
import { getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'

interface KangenLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

function toEmbedUrl(url: string) {
  if (!url) return ''
  if (url.includes('youtu.be/')) {
    const after = url.split('youtu.be/')[1] || ''
    const id = after.split(/[?&]/)[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtube.com/watch')) {
    try {
      const u = new URL(url)
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : url
    } catch {
      return url
    }
  }
  return url
}

interface WaterType {
  id: string
  pH: string
  name: string
  color: string
  tag: string
  description: string
  uses: string[]
}

interface ScientificPillar {
  icon: typeof Sparkles
  title: string
  subtitle: string
  description: string
  stat: string
  statLabel: string
}

interface FaqItem {
  q: string
  a: string
}

const I18N: Record<Locale, {
  backToProfile: string
  back: string
  requestInfo: string
  heroBadge: string
  heroTitle1: string
  heroTitleAccent: string
  heroBody: string
  sharedBy: string
  leaderDefaultTitle: string
  connect: string
  demoBadge: string
  demoTitle: string
  demoSubtitle: string
  demoFooter: string
  watchTime: string
  scienceBadge: string
  scienceTitle: string
  scienceSubtitle: string
  pillars: ScientificPillar[]
  waterSectionBadge: string
  waterSectionTitle: string
  waterSectionSubtitle: string
  waterTypes: WaterType[]
  recommendedUses: string
  specPlatesLabel: string
  specPlatesVal: string
  specMfgLabel: string
  specMfgVal: string
  specCertLabel: string
  specCertVal: string
  specInquireLabel: string
  specInquireVal: string
  duoBadge: string
  duoTitle1: string
  duoTitle2: string
  duoBody: string
  duoExploreBtn: string
  duoPricingBtn: string
  faqTitle: string
  faqs: FaqItem[]
  readyTitle: string
  readyBodyPrefix: string
  readyBodySuffix: string
  ctaConsultation: string
  ctaWhatsApp: string
}> = {
  en: {
    backToProfile: 'Back to Profile',
    back: 'Back',
    requestInfo: 'Request Info',
    heroBadge: 'Japanese Medical-Grade Ionization',
    heroTitle1: 'Change Your Water.',
    heroTitleAccent: 'Elevate Your Cellular Health.',
    heroBody: '50 years of Japanese engineering, active molecular hydrogen (H₂) infusion, and negative ORP antioxidant power. Discover how the Leveluk K8 replaces household chemicals and revitalizes your hydration.',
    sharedBy: 'Personal Presentation Shared By',
    leaderDefaultTitle: 'True Legacy 6A Leader',
    connect: 'Connect',
    demoBadge: 'Featured Product Demonstration',
    demoTitle: 'Leveluk K8 Water Technology',
    demoSubtitle: 'Full scientific demonstration: pH testing, negative ORP readings, and oil emulsification.',
    demoFooter: 'Complete Leveluk K8 Japanese Medical Ionization Overview',
    watchTime: 'Watch time: ~4 minutes',
    scienceBadge: 'The Science of Ionization',
    scienceTitle: 'Why Ordinary Water Falls Short',
    scienceSubtitle: 'Most bottled and tap waters are oxidized, acidic, and clustered into bulky molecular groups. Electrolyzed Reduced Water operates on a cellular level.',
    pillars: [
      {
        icon: Sparkles,
        title: 'Dissolved Molecular Hydrogen (H₂)',
        subtitle: 'The Ultimate Selective Antioxidant',
        description: 'Unlike massive synthetic antioxidants, tiny H₂ molecules freely cross cell membranes and the blood-brain barrier, selectively neutralizing toxic hydroxyl radicals (•OH) while leaving vital physiological free radicals intact.',
        stat: '1.6+ ppm',
        statLabel: 'Peak Dissolved H₂ Concentration',
      },
      {
        icon: Zap,
        title: 'Negative ORP Antioxidant Potential',
        subtitle: 'Oxidation Reduction Power',
        description: 'Standard tap and bottled waters have positive ORP (+200 to +400mV), acting as oxidizing agents. Kangen Water delivers a negative electrical charge (-400mV to -850mV), offering extraordinary cellular antioxidant defense.',
        stat: '-850 mV',
        statLabel: 'Potent Negative ORP Range',
      },
      {
        icon: Droplets,
        title: 'Micro-Clustered Electrolyzed Water',
        subtitle: 'Superior Cellular Permeability',
        description: 'Electrolysis restructures large bulk water clusters into micro-clusters. This drastically reduces surface tension, enabling rapid absorption into tissues and aquaporins without the heavy, bloated feeling of ordinary water.',
        stat: '300%',
        statLabel: 'Faster Cellular Hydration Rate',
      },
    ],
    waterSectionBadge: 'One Machine · Infinite Applications',
    waterSectionTitle: '5 Distinct Waters at the Push of a Button',
    waterSectionSubtitle: 'From deep antioxidant drinking water to medical-grade sanitizers and oil-emulsifiers, see how the Leveluk K8 transforms your home.',
    waterTypes: [
      {
        id: 'strong-kangen',
        pH: '11.5 pH',
        name: 'Strong Kangen Water',
        color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-300',
        tag: 'EMULSIFIER & DEGREASER',
        description: 'High-alkalinity micro-clustered water with powerful solvent and oil-emulsifying properties. Effectively removes oil-based pesticides and chemicals from fresh produce that tap water cannot wash away.',
        uses: ['Pesticide removal from fruits & vegetables', 'Chemical-free kitchen degreasing', 'Deep stain removal without detergents', 'Soaking seeds for accelerated germination'],
      },
      {
        id: 'kangen-drinking',
        pH: '8.5 - 9.5 pH',
        name: 'Kangen Drinking Water',
        color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300',
        tag: 'DAILY CELLULAR HYDRATION',
        description: 'Rich in dissolved molecular hydrogen (H2) and negative ORP antioxidants (-400mV to -850mV). Micro-clustered for rapid cellular absorption, superior taste, and optimal bioavailability.',
        uses: ['Daily cellular hydration and athletic recovery', 'Superior tea and coffee flavor extraction', 'Nutrient-preserving cooking and soups', 'Alkaline balance and metabolic support'],
      },
      {
        id: 'clean-water',
        pH: '7.0 pH',
        name: 'Clean Purified Water',
        color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300',
        tag: 'NEUTRAL PURITY',
        description: 'Double-filtered neutral water free of chlorine, heavy metals, and odors while retaining essential minerals. Perfect for infant nutrition and time-released prescription medications.',
        uses: ['Baby formula and baby food preparation', 'Taking prescription medications', 'Neutral cooking and baking', 'Pure mineral-balanced hydration'],
      },
      {
        id: 'beauty-water',
        pH: '5.5 - 6.0 pH',
        name: 'Beauty Water',
        color: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-300',
        tag: 'NATURAL SKIN & HAIR TONER',
        description: 'Mildly acidic water that precisely matches the acid mantle of human skin and hair. Acts as an organic astringent, tightening pores and enhancing moisture retention naturally.',
        uses: ['Daily facial toner and skin hydration mist', 'Hair rinse for shine and detangling', 'Post-shaving soothing astringent', 'Gentle plant misting for foliage vibrancy'],
      },
      {
        id: 'strong-acidic',
        pH: '2.5 pH',
        name: 'Strong Acidic Water',
        color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300',
        tag: 'NATURAL SANITIZATION (HOCl)',
        description: 'Hypochlorous acid (HOCl) water with exceptional oxidation potential (+1,100mV). Certified by Japanese medical institutions as a powerful, non-toxic sanitizing solution.',
        uses: ['Sanitizing kitchen counters, cutting boards & utensils', 'Natural hand cleanser without alcohol dryness', 'Oral hygiene and gargling', 'Skin hygiene and minor abrasion cleansing'],
      },
    ],
    recommendedUses: 'Recommended Uses:',
    specPlatesLabel: 'Electrolysis Plates',
    specPlatesVal: '8 Solid Platinum-Dipped Titanium',
    specMfgLabel: 'Manufacturing',
    specMfgVal: 'Osaka, Japan (ISO 13485)',
    specCertLabel: 'Certification',
    specCertVal: 'WQA Gold Seal Certified',
    specInquireLabel: 'Direct Consultation',
    specInquireVal: 'Inquire via',
    duoBadge: '360° Environmental Wellness Standard',
    duoTitle1: 'Hydrate Your Cells.',
    duoTitle2: 'Harmonize Your Technology.',
    duoBody: 'While Kangen Water provides internal cellular hydration and antioxidant defense, modern life also exposes us to 5G, Wi-Fi, and EMF radiation. Discover the True Legacy Duo pairing the Leveluk K8 with the portable emGuarde GO.',
    duoExploreBtn: 'Explore The Duo Technologies',
    duoPricingBtn: 'Request Leveluk K8 Package Pricing',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'How does Kangen Water differ from bottled alkaline water?',
        a: 'Bottled alkaline water is chemically alkalized using synthetic bicarbonate additives and loses its charge in plastic bottles. Kangen Water is electrically restructured (Electrolyzed Reduced Water) containing real active molecular hydrogen and negative ORP, fresh from a medical-grade device.',
      },
      {
        q: 'What is the Leveluk K8 and why is it considered the gold standard?',
        a: 'The Leveluk K8 is Enagic’s flagship 8-plate water ionizer. Built in Osaka, Japan with medical-grade platinum-dipped titanium plates, it features multi-voltage worldwide power, full touchscreen controls in 8 languages, and produces 5 distinct water types on demand.',
      },
      {
        q: 'Is Enagic an accredited medical device manufacturer?',
        a: 'Yes. Enagic’s manufacturing facility in Osaka is certified under ISO 13485 (Medical Device Quality Standard), ISO 9001, and ISO 14001. Enagic is also the only water ionizer manufacturer in the world to hold the prestigious Water Quality Association (WQA) Gold Seal.',
      },
      {
        q: 'How does Kangen Water connect to the True Legacy Duo Package?',
        a: 'True Legacy advocates for total 360° environmental wellness: Kangen Water addresses your internal cellular environment, while emGuarde GO harmonizes your external electromagnetic environment. Together, they form the ultimate modern health foundation.',
      },
    ],
    readyTitle: 'Ready to Experience Kangen Water?',
    readyBodyPrefix: 'Connect directly with',
    readyBodySuffix: 'to receive full pricing details, water testing demonstrations, and international shipping options.',
    ctaConsultation: 'Request Leveluk K8 Consultation',
    ctaWhatsApp: 'Chat on WhatsApp',
  },
  es: {
    backToProfile: 'Volver al Perfil',
    back: 'Atrás',
    requestInfo: 'Pedir Información',
    heroBadge: 'Ionización Médica Japonesa',
    heroTitle1: 'Cambia Tu Agua.',
    heroTitleAccent: 'Eleva Tu Salud Celular.',
    heroBody: '50 años de ingeniería japonesa, infusión activa de hidrógeno molecular (H₂) y poder antioxidante de ORP negativo. Descubre cómo el Leveluk K8 reemplaza los químicos domésticos y revitaliza tu hidratación.',
    sharedBy: 'Presentación Personal Compartida Por',
    leaderDefaultTitle: 'Líder 6A True Legacy',
    connect: 'Conectar',
    demoBadge: 'Demostración Destacada del Producto',
    demoTitle: 'Tecnología de Agua Leveluk K8',
    demoSubtitle: 'Demostración científica completa: pruebas de pH, lecturas de ORP negativo y emulsificación de aceites.',
    demoFooter: 'Visión General Completa de la Ionización Médica Japonesa Leveluk K8',
    watchTime: 'Tiempo de video: ~4 minutos',
    scienceBadge: 'La Ciencia de la Ionización',
    scienceTitle: 'Por Qué el Agua Común No es Suficiente',
    scienceSubtitle: 'La mayoría del agua embotellada y de grifo está oxidada, ácida y agrupada en racimos moleculares grandes. El Agua Reducida Electrolizada opera a nivel celular.',
    pillars: [
      {
        icon: Sparkles,
        title: 'Hidrógeno Molecular Disuelto (H₂)',
        subtitle: 'El Antioxidante Selectivo Supremo',
        description: 'A diferencia de los antioxidantes sintéticos de gran tamaño, las diminutas moléculas de H₂ cruzan libremente las membranas celulares y la barrera hematoencefálica, neutralizando selectivamente radicales tóxicos (•OH).',
        stat: '1.6+ ppm',
        statLabel: 'Concentración Máxima de H₂',
      },
      {
        icon: Zap,
        title: 'Potencial Antioxidante ORP Negativo',
        subtitle: 'Poder de Reducción de Oxidación',
        description: 'El agua regular de grifo o botella tiene un ORP positivo (+200 a +400mV), actuando como agente oxidante. Aqua Kangen entrega una carga negativa (-400mV a -850mV), brindando defensa celular extraordinaria.',
        stat: '-850 mV',
        statLabel: 'Rango Potente de ORP Negativo',
      },
      {
        icon: Droplets,
        title: 'Agua Microestructurada Electrolizada',
        subtitle: 'Permeabilidad Celular Superior',
        description: 'La electrólisis reestructura los racimos grandes de agua en micro-racimos. Esto reduce drásticamente la tensión superficial, permitiendo una rápida absorción en los tejidos sin sensación de pesadez.',
        stat: '300%',
        statLabel: 'Mayor Rapidez de Hidratación',
      },
    ],
    waterSectionBadge: 'Una Máquina · Infinitas Aplicaciones',
    waterSectionTitle: '5 Tipos de Agua al Tocar un Botón',
    waterSectionSubtitle: 'Desde agua para beber rica en antioxidantes hasta desinfectantes de grado médico y emulsionantes de aceites, descubre cómo Leveluk K8 transforma tu hogar.',
    waterTypes: [
      {
        id: 'strong-kangen',
        pH: '11.5 pH',
        name: 'Aqua Kangen Fuerte',
        color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-300',
        tag: 'EMULSIONANTE Y DESENGRASANTE',
        description: 'Agua de alta alcalinidad y microestructurada con poderosas propiedades solventes y emulsionantes. Remueve eficazmente pesticidas de base oleosa que el agua común no puede eliminar.',
        uses: ['Eliminación de pesticidas en frutas y verduras', 'Desengrasado de cocina sin químicos', 'Remoción profunda de manchas sin detergente', 'Remojo de semillas para acelerar germinación'],
      },
      {
        id: 'kangen-drinking',
        pH: '8.5 - 9.5 pH',
        name: 'Aqua Kangen® para Beber',
        color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300',
        tag: 'HIDRATACIÓN CELULAR DIARIA',
        description: 'Rica en hidrógeno molecular disuelto (H2) y antioxidantes con ORP negativo (-400mV a -850mV). Microagrupada para absorción celular inmediata, excelente sabor y máxima biodisponibilidad.',
        uses: ['Hidratación celular diaria y recuperación deportiva', 'Extracción superior de sabor en té y café', 'Cocina que preserva nutrientes y sopas', 'Equilibrio alcalino y apoyo metabólico'],
      },
      {
        id: 'clean-water',
        pH: '7.0 pH',
        name: 'Agua Limpia Purificada',
        color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300',
        tag: 'PUREZA NEUTRA',
        description: 'Agua neutra con doble filtración libre de cloro, metales pesados y olores, conservando minerales esenciales. Perfecta para nutrición de bebés y toma de medicamentos.',
        uses: ['Preparación de fórmulas y comida de bebé', 'Toma de medicamentos recetados', 'Cocina y repostería neutra', 'Hidratación balanceada con minerales'],
      },
      {
        id: 'beauty-water',
        pH: '5.5 - 6.0 pH',
        name: 'Agua de Belleza',
        color: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-300',
        tag: 'TÓNICO NATURAL DE PIEL Y CABELLO',
        description: 'Agua suavemente ácida que coincide con el manto ácido de la piel y el cabello humano. Actúa como astringente orgánico, tonificando poros y reteniendo la humedad natural.',
        uses: ['Tónico facial diario y bruma hidratante', 'Enjuague capilar para brillo y desenredo', 'Astringente calmante después del afeitado', 'Rociado suave de plantas para follaje vibrante'],
      },
      {
        id: 'strong-acidic',
        pH: '2.5 pH',
        name: 'Agua Fuertemente Ácida',
        color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300',
        tag: 'DESINFECCIÓN NATURAL (HOCl)',
        description: 'Agua con ácido hipocloroso (HOCl) de altísimo potencial oxidante (+1,100mV). Certificada por instituciones médicas japonesas como potente desinfectante no tóxico.',
        uses: ['Desinfección de mesones, tablas de picar y utensilios', 'Limpieza natural de manos sin resecar con alcohol', 'Higiene oral y gárgaras', 'Limpieza de higiene cutánea y heridas menores'],
      },
    ],
    recommendedUses: 'Usos Recomendados:',
    specPlatesLabel: 'Placas de Electrólisis',
    specPlatesVal: '8 Placas Sólidas de Titanio con Platino',
    specMfgLabel: 'Fabricación',
    specMfgVal: 'Osaka, Japón (ISO 13485)',
    specCertLabel: 'Certificación',
    specCertVal: 'Sello de Oro WQA Certificado',
    specInquireLabel: 'Consulta Directa',
    specInquireVal: 'Consultar con',
    duoBadge: 'Estándar de Bienestar Ambiental 360°',
    duoTitle1: 'Hidrata Tus Células.',
    duoTitle2: 'Armoniza Tu Tecnología.',
    duoBody: 'Mientras Aqua Kangen aporta hidratación celular interna y defensa antioxidante, la vida moderna nos expone a 5G, Wi-Fi y radiación CEM. Descubre el True Legacy Duo que une el Leveluk K8 con el emGuarde GO portátil.',
    duoExploreBtn: 'Explorar las Tecnologías Duo',
    duoPricingBtn: 'Solicitar Precios del Paquete Leveluk K8',
    faqTitle: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Cómo se diferencia Aqua Kangen del agua alcalina embotellada?',
        a: 'El agua alcalina embotellada se alcaliniza químicamente con aditivos de bicarbonato sintético y pierde su carga en las botellas plásticas. Aqua Kangen es reestructurada eléctricamente (Agua Reducida Electrolizada) con hidrógeno molecular activo y ORP negativo real.',
      },
      {
        q: '¿Qué es el Leveluk K8 y por qué se considera el estándar de oro?',
        a: 'El Leveluk K8 es el ionizador insignia de 8 placas de Enagic. Fabricado en Osaka, Japón con placas de titanio de grado médico bañadas en platino, cuenta con multivoltaje universal, pantalla táctil en 8 idiomas y 5 tipos de agua bajo demanda.',
      },
      {
        q: '¿Es Enagic un fabricante acreditado de dispositivos médicos?',
        a: 'Sí. Las instalaciones de fabricación de Enagic en Osaka cuentan con certificación ISO 13485 (Norma de Calidad de Dispositivos Médicos), ISO 9001 e ISO 14001. Además, es el único ionizador en el mundo con el Sello de Oro de la WQA.',
      },
      {
        q: '¿Cómo se conecta Aqua Kangen con el Paquete True Legacy Duo?',
        a: 'True Legacy promueve un bienestar ambiental 360°: Aqua Kangen cuida tu entorno celular interno, mientras emGuarde GO armoniza tu entorno electromagnético externo. Juntos forman la base de salud moderna definitiva.',
      },
    ],
    readyTitle: '¿Listo para Experimentar Aqua Kangen?',
    readyBodyPrefix: 'Conecta directamente con',
    readyBodySuffix: 'para recibir detalles completos de precios, demostraciones de agua y opciones de envío internacional.',
    ctaConsultation: 'Solicitar Consulta de Leveluk K8',
    ctaWhatsApp: 'Chatear por WhatsApp',
  },
  fr: {
    backToProfile: 'Retour au Profil',
    back: 'Retour',
    requestInfo: 'Demander des Infos',
    heroBadge: 'Ionisation Médicale Japonaise',
    heroTitle1: 'Changez Votre Eau.',
    heroTitleAccent: 'Élevez Votre Santé Cellulaire.',
    heroBody: "50 ans d'ingénierie japonaise, infusion d'hydrogène moléculaire actif (H₂) et puissance antioxydante ORP négative. Découvrez comment le Leveluk K8 remplace les produits chimiques ménagers et revitalise votre hydratation.",
    sharedBy: 'Présentation Personnelle Partagée Par',
    leaderDefaultTitle: 'Leader 6A True Legacy',
    connect: 'Contacter',
    demoBadge: 'Démonstration Produit Phare',
    demoTitle: "Technologie de l'Eau Leveluk K8",
    demoSubtitle: "Démonstration scientifique complète : tests de pH, mesures d'ORP négatif et émulsification des huiles.",
    demoFooter: "Aperçu Complet de l'Ionisation Médicale Japonaise Leveluk K8",
    watchTime: 'Temps de vidéo : ~4 minutes',
    scienceBadge: "La Science de l'Ionisation",
    scienceTitle: "Pourquoi l'Eau Ordinaire Ne Suffit Pas",
    scienceSubtitle: "La plupart des eaux en bouteille et du robinet sont oxydées, acides et regroupées en gros amas moléculaires. L'Eau Réduite Électrolysée agit au niveau cellulaire.",
    pillars: [
      {
        icon: Sparkles,
        title: 'Hydrogène Moléculaire Dissous (H₂)',
        subtitle: "L'Antioxydant Sélectif Ultime",
        description: "Contrairement aux gros antioxydants synthétiques, les molécules minuscules de H₂ traversent librement les membranes cellulaires et la barrière hémato-encéphalique, neutralisant sélectivement les radicaux hydroxyles toxiques (•OH).",
        stat: '1.6+ ppm',
        statLabel: 'Concentration Maximale en H₂',
      },
      {
        icon: Zap,
        title: 'Potentiel Antioxydant ORP Négatif',
        subtitle: "Puissance de Réduction de l'Oxydation",
        description: "Les eaux standard ont un ORP positif (+200 à +400 mV), agissant comme des agents oxydants. L'eau Kangen délivre une charge négative (-400 à -850 mV), offrant une protection antioxydante cellulaire remarquable.",
        stat: '-850 mV',
        statLabel: 'Plage Puissante d’ORP Négatif',
      },
      {
        icon: Droplets,
        title: 'Eau Électrolysée Micro-Structurée',
        subtitle: 'Perméabilité Cellulaire Supérieure',
        description: "L'électrolyse restructure les gros amas d'eau en micro-clusters. Cela réduit fortement la tension superficielle, permettant une assimilation rapide par les tissus et les aquaporines sans sensation de ballonnement.",
        stat: '300%',
        statLabel: 'Vitesse d’Hydratation Accélérée',
      },
    ],
    waterSectionBadge: 'Une Seule Machine · Applications Infinies',
    waterSectionTitle: '5 Eaux Distinctes d’une Simple Pression',
    waterSectionSubtitle: "De l'eau de boisson hautement antioxydante aux désinfectants de grade médical et émulsifiants naturels, découvrez comment le Leveluk K8 transforme votre quotidien.",
    waterTypes: [
      {
        id: 'strong-kangen',
        pH: '11.5 pH',
        name: 'Eau Kangen Forte',
        color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-300',
        tag: 'ÉMULSIFIANT & DÉGRAISSANT',
        description: "Eau hautement alcaline micro-structurée avec de puissantes propriétés dissolvantes et émulsifiantes. Élimine efficacement les pesticides huileux sur les fruits et légumes que l'eau du robinet ne peut pas nettoyer.",
        uses: ['Élimination des pesticides sur fruits et légumes', 'Dégraissage cuisine sans produits chimiques', 'Détachage textile en profondeur sans détergent', 'Trempage des graines pour germination rapide'],
      },
      {
        id: 'kangen-drinking',
        pH: '8.5 - 9.5 pH',
        name: 'Eau Kangen® de Boisson',
        color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300',
        tag: 'HYDRATATION CELLULAIRE QUOTIDIENNE',
        description: "Riche en hydrogène moléculaire dissous (H2) et antioxydants à ORP négatif (-400mV à -850mV). Micro-structurée pour une absorption cellulaire immédiate, un goût pur et une biodisponibilité optimale.",
        uses: ['Hydratation cellulaire quotidienne et récupération sportive', 'Extraction supérieure des arômes pour thé et café', 'Cuisson préservant les nutriments et soupes', 'Équilibre alcalin et soutien métabolique'],
      },
      {
        id: 'clean-water',
        pH: '7.0 pH',
        name: 'Eau Neutre Purifiée',
        color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300',
        tag: 'PURETÉ NEUTRE',
        description: 'Eau doublement filtrée, exempte de chlore, métaux lourds et odeurs, tout en conservant les minéraux essentiels. Parfaite pour la préparation des biberons et la prise de médicaments.',
        uses: ['Préparation de biberons et aliments pour bébé', 'Prise de médicaments prescrits', 'Cuisine et pâtisserie neutres', 'Hydratation pure et équilibrée en minéraux'],
      },
      {
        id: 'beauty-water',
        pH: '5.5 - 6.0 pH',
        name: 'Eau de Beauté',
        color: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-300',
        tag: 'TONIQUE NATUREL PEAU & CHEVEUX',
        description: "Eau légèrement acide correspondant parfaitement au film hydrolipidique de la peau et des cheveux. Agit comme un astringent naturel, resserrant les pores et maintenant l'hydratation.",
        uses: ['Tonique visage quotidien et brume hydratante', 'Rinçage capillaire pour brillance et démêlage', 'Soin apaisant et astringent après-rasage', 'Brumisation douce pour plantes d’intérieur'],
      },
      {
        id: 'strong-acidic',
        pH: '2.5 pH',
        name: 'Eau Acide Forte',
        color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300',
        tag: 'DÉSINFECTION NATURELLE (HOCl)',
        description: "Eau d'acide hypochloreux (HOCl) au potentiel d'oxydation très élevé (+1 100 mV). Certifiée par les institutions médicales japonaises comme puissant désinfectant non toxique.",
        uses: ['Désinfection des plans de travail et ustensiles', 'Nettoyant naturel des mains sans assèchement alcoolique', 'Hygiène buccale et gargarismes', 'Hygiène cutanée et nettoyage des égratignures'],
      },
    ],
    recommendedUses: 'Usages Recommandés :',
    specPlatesLabel: "Plaques d'Électrolyse",
    specPlatesVal: '8 Plaques Pleines Titane Platiné',
    specMfgLabel: 'Fabrication',
    specMfgVal: 'Osaka, Japon (ISO 13485)',
    specCertLabel: 'Certification',
    specCertVal: 'Sceau d’Or WQA Certifié',
    specInquireLabel: 'Consultation Directe',
    specInquireVal: 'Consulter avec',
    duoBadge: 'Standard de Bien-Être Environnemental 360°',
    duoTitle1: 'Hydratez Vos Cellules.',
    duoTitle2: 'Harmonisez Votre Technologie.',
    duoBody: "Pendant que l'eau Kangen assure l'hydratation cellulaire interne et la défense antioxydante, notre quotidien nous expose à la 5G, au Wi-Fi et aux rayonnements CEM. Découvrez le pack True Legacy Duo associant le Leveluk K8 à l'appareil portable emGuarde GO.",
    duoExploreBtn: 'Explorer les Technologies Duo',
    duoPricingBtn: 'Demander les Tarifs du Pack Leveluk K8',
    faqTitle: 'Foire Aux Questions',
    faqs: [
      {
        q: "En quoi l'eau Kangen diffère-t-elle de l'eau alcaline en bouteille ?",
        a: "L'eau alcaline en bouteille est alcalinisée chimiquement par des additifs de bicarbonate synthétique et perd sa charge dans les bouteilles en plastique. L'eau Kangen est restructurée électriquement (Eau Réduite Électrolysée) et contient de l'hydrogène moléculaire actif et un ORP négatif bien réel.",
      },
      {
        q: "Qu'est-ce que le Leveluk K8 et pourquoi est-il la référence mondiale ?",
        a: "Le Leveluk K8 est l'ioniseur phare à 8 plaques d'Enagic. Conçu à Osaka au Japon avec des plaques en titane de qualité médicale trempées dans le platine, il dispose d'un système multi-voltage universel, d'un écran tactile en 8 langues et produit 5 types d'eaux à la demande.",
      },
      {
        q: "Enagic est-il un fabricant agréé de dispositifs médicaux ?",
        a: "Oui. L'usine de production d'Enagic à Osaka est certifiée selon les normes ISO 13485 (Norme de qualité des dispositifs médicaux), ISO 9001 et ISO 14001. Enagic est également le seul fabricant d'ioniseurs d'eau au monde titulaire du prestigieux Sceau d'Or de la WQA.",
      },
      {
        q: "Comment l'eau Kangen s'intègre-t-elle au pack True Legacy Duo ?",
        a: "True Legacy propose une approche globale du bien-être à 360° : l'eau Kangen prend soin de votre milieu cellulaire interne, tandis qu'emGuarde GO harmonise votre environnement électromagnétique externe. Ensemble, ils constituent le socle de santé moderne par excellence.",
      },
    ],
    readyTitle: 'Prêt à Découvrir l’Eau Kangen ?',
    readyBodyPrefix: 'Échangez directement avec',
    readyBodySuffix: 'pour obtenir la tarification complète, des démonstrations et les modalités de livraison internationale.',
    ctaConsultation: 'Demander une Consultation Leveluk K8',
    ctaWhatsApp: 'Discuter sur WhatsApp',
  },
  pt: {
    backToProfile: 'Voltar ao Perfil',
    back: 'Voltar',
    requestInfo: 'Solicitar Informações',
    heroBadge: 'Ionização Médica Japonesa',
    heroTitle1: 'Mude Sua Água.',
    heroTitleAccent: 'Eleve Sua Saúde Celular.',
    heroBody: '50 anos de engenharia japonesa, infusão de hidrogênio molecular ativo (H₂) e poder antioxidante de ORP negativo. Descubra como o Leveluk K8 substitui produtos químicos domésticos e revitaliza sua hidratação.',
    sharedBy: 'Apresentação Pessoal Compartilhada Por',
    leaderDefaultTitle: 'Líder 6A True Legacy',
    connect: 'Conectar',
    demoBadge: 'Demonstração em Destaque do Produto',
    demoTitle: 'Tecnologia de Água Leveluk K8',
    demoSubtitle: 'Demonstração científica completa: testes de pH, medições de ORP negativo e emulsificação de óleos.',
    demoFooter: 'Visão Geral Completa da Ionização Médica Japonesa Leveluk K8',
    watchTime: 'Tempo de vídeo: ~4 minutos',
    scienceBadge: 'A Ciência da Ionização',
    scienceTitle: 'Por Que a Água Comum Não é Suficiente',
    scienceSubtitle: 'A maioria das águas engarrafadas e de torneira é oxidada, ácida e agrupada em grandes aglomerados moleculares. A Água Reduzida Eletrolisada atua em nível celular.',
    pillars: [
      {
        icon: Sparkles,
        title: 'Hidrogênio Molecular Dissolvido (H₂)',
        subtitle: 'O Antioxidante Seletivo Supremo',
        description: 'Diferente de grandes antioxidantes sintéticos, minúsculas moléculas de H₂ cruzam livremente as membranas celulares e a barreira hematoencefálica, neutralizando seletivamente radicais hidroxila tóxicos (•OH).',
        stat: '1.6+ ppm',
        statLabel: 'Concentração Máxima de H₂',
      },
      {
        icon: Zap,
        title: 'Potencial Antioxidante ORP Negativo',
        subtitle: 'Poder de Redução da Oxidação',
        description: 'A água comum possui ORP positivo (+200 a +400mV), agindo como agente oxidante. A Água Kangen entrega uma carga negativa (-400mV a -850mV), oferecendo extraordinária defesa celular antioxidante.',
        stat: '-850 mV',
        statLabel: 'Faixa Potente de ORP Negativo',
      },
      {
        icon: Droplets,
        title: 'Água Microestruturada Eletrolisada',
        subtitle: 'Permeabilidade Celular Superior',
        description: 'A eletrólise reestrutura grandes aglomerados de água em microaglomerados. Isso reduz drasticamente a tensão superficial, permitindo rápida absorção celular sem a sensação de inchaço.',
        stat: '300%',
        statLabel: 'Maior Velocidade de Hidratação',
      },
    ],
    waterSectionBadge: 'Uma Máquina · Aplicações Infinitas',
    waterSectionTitle: '5 Águas Distintas com Apenas um Toque',
    waterSectionSubtitle: 'De água para beber rica em antioxidantes a desinfetantes de grau médico e emulsionantes de óleos, veja como o Leveluk K8 transforma seu lar.',
    waterTypes: [
      {
        id: 'strong-kangen',
        pH: '11.5 pH',
        name: 'Água Kangen Forte',
        color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-300',
        tag: 'EMULSIONANTE E DESENGORDURANTE',
        description: 'Água altamente alcalina e microestruturada com fortes propriedades solventes e emulsionantes. Remove com eficácia pesticidas à base de óleo que a água da torneira não consegue eliminar.',
        uses: ['Remoção de pesticidas em frutas e vegetais', 'Desengorduramento de cozinha sem químicos', 'Remoção profunda de manchas sem detergente', 'Demolho de sementes para germinação acelerada'],
      },
      {
        id: 'kangen-drinking',
        pH: '8.5 - 9.5 pH',
        name: 'Água Kangen® para Beber',
        color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300',
        tag: 'HIDRATAÇÃO CELULAR DIÁRIA',
        description: 'Rica em hidrogênio molecular dissolvido (H2) e antioxidantes de ORP negativo (-400mV a -850mV). Microestruturada para absorção celular imediata, sabor puro e máxima biodisponibilidade.',
        uses: ['Hidratação celular diária e recuperação física', 'Extração superior de sabor em café e chá', 'Preparo de alimentos preservando nutrientes e sopas', 'Equilíbrio alcalino e suporte metabólico'],
      },
      {
        id: 'clean-water',
        pH: '7.0 pH',
        name: 'Água Limpa Purificada',
        color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300',
        tag: 'PUREZA NEUTRA',
        description: 'Água neutra com dupla filtragem livre de cloro, metais pesados e odores, retendo minerais essenciais. Ideal para alimentação de bebês e consumo de medicamentos.',
        uses: ['Preparo de fórmulas infantis e papinhas', 'Ingestão de medicamentos prescritos', 'Culinária e panificação neutra', 'Hidratação equilibrada com minerais essenciais'],
      },
      {
        id: 'beauty-water',
        pH: '5.5 - 6.0 pH',
        name: 'Água de Beleza',
        color: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-300',
        tag: 'TÔNICO NATURAL PARA PELE E CABELO',
        description: 'Água suavemente ácida que corresponde exatamente ao manto ácido da pele e cabelo humanos. Atua como adstringente natural, fechando poros e retendo a hidratação.',
        uses: ['Tônico facial diário e bruma hidratante', 'Enxágue capilar para brilho e desembaraço', 'Adstringente calmante pós-barba', 'Borrife suavemente em plantas para folhagem vívida'],
      },
      {
        id: 'strong-acidic',
        pH: '2.5 pH',
        name: 'Água Ácida Forte',
        color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300',
        tag: 'DESINFECÇÃO NATURAL (HOCl)',
        description: 'Água de ácido hipocloroso (HOCl) com altíssimo potencial de oxidação (+1.100mV). Certificada por instituições médicas japonesas como potente desinfetante não tóxico.',
        uses: ['Desinfecção de bancadas, tábuas de corte e utensílios', 'Higienização natural das mãos sem ressecar com álcool', 'Higiene bucal e gargarejos', 'Limpeza da pele e escoriações leves'],
      },
    ],
    recommendedUses: 'Usos Recomendados:',
    specPlatesLabel: 'Placas de Eletrólise',
    specPlatesVal: '8 Placas Sólidas de Titânio com Platina',
    specMfgLabel: 'Fabricação',
    specMfgVal: 'Osaka, Japão (ISO 13485)',
    specCertLabel: 'Certificação',
    specCertVal: 'Selo de Ouro WQA Certificado',
    specInquireLabel: 'Consulta Direta',
    specInquireVal: 'Consultar com',
    duoBadge: 'Padrão de Bem-Estar Ambiental 360°',
    duoTitle1: 'Hidrate Suas Células.',
    duoTitle2: 'Harmonize Sua Tecnologia.',
    duoBody: 'Enquanto a Água Kangen fornece hidratação celular interna e defesa antioxidante, a vida moderna nos expõe a 5G, Wi-Fi e radiação eletromagnética. Conheça o True Legacy Duo unindo o Leveluk K8 com o portátil emGuarde GO.',
    duoExploreBtn: 'Explorar as Tecnologias Duo',
    duoPricingBtn: 'Solicitar Preços do Pacote Leveluk K8',
    faqTitle: 'Perguntas Frequentes',
    faqs: [
      {
        q: 'Como a Água Kangen se diferencia da água alcalina engarrafada?',
        a: 'A água alcalina engarrafada é alcalinizada quimicamente com aditivos sintéticos de bicarbonato e perde sua carga em recipientes plásticos. A Água Kangen é reestruturada eletricamente (Água Reduzida Eletrolisada) com hidrogênio molecular ativo e ORP negativo real.',
      },
      {
        q: 'O que é o Leveluk K8 e por que é considerado a referência mundial?',
        a: 'O Leveluk K8 é o ionizador carro-chefe de 8 placas da Enagic. Fabricado em Osaka, Japão, com placas de titânio de grau médico banhadas a platina, possui bivolt automático mundial, tela touchscreen em 8 idiomas e gera 5 tipos de água sob demanda.',
      },
      {
        q: 'A Enagic é uma fabricante certificada de dispositivos médicos?',
        a: 'Sim. A fábrica da Enagic em Osaka possui certificação ISO 13485 (Norma de Qualidade para Dispositivos Médicos), ISO 9001 e ISO 14001. A Enagic também é a única fabricante de ionizadores do mundo a possuir o prestigiado Selo de Ouro da WQA.',
      },
      {
        q: 'Como a Água Kangen se conecta ao Pacote True Legacy Duo?',
        a: 'A True Legacy defende um bem-estar ambiental integral em 360°: a Água Kangen cuida do seu ambiente celular interno, enquanto o emGuarde GO harmoniza o ambiente eletromagnético externo. Juntos, criam a base ideal de saúde moderna.',
      },
    ],
    readyTitle: 'Pronto para Experimentar a Água Kangen?',
    readyBodyPrefix: 'Conecte-se diretamente com',
    readyBodySuffix: 'para receber informações de preços, demonstrações de água e opções de envio internacional.',
    ctaConsultation: 'Solicitar Consulta Leveluk K8',
    ctaWhatsApp: 'Conversar no WhatsApp',
  },
}

export function KangenLandingPage({ profile: propProfile, distributorSlug }: KangenLandingPageProps) {
  const { locale, setLocale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedVideoLang, setSelectedVideoLang] = useState<Locale>(locale)

  const copy = I18N[locale] || I18N.en
  const [selectedWaterId, setSelectedWaterId] = useState<string>('kangen-drinking')

  const effectiveSlug = distributorSlug || profile?.slug || 'mehdi-cohen'

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

  const distributorName = profile?.display_name || 'True Legacy Leader'
  const leaderAvatar = profile?.avatar_url || (profile?.slug ? getLeaderPortrait(profile.slug) : '/logos/tl-square-white.png')
  
  const rawVideoUrl = PRODUCT_VIDEOS.kangenWater[selectedVideoLang] || PRODUCT_VIDEOS.kangenWater.en
  const embedVideoUrl = useMemo(() => toEmbedUrl(rawVideoUrl), [rawVideoUrl])

  const applyUrl = `/apply?ref=${profile?.referral_code || effectiveSlug}&interest=product&source=kangen`
  const duoUrl = `/d/${effectiveSlug}/duo`

  const selectedWater = useMemo(() => {
    return copy.waterTypes.find((w) => w.id === selectedWaterId) || copy.waterTypes[1]
  }, [copy.waterTypes, selectedWaterId])

  const whatsappNumber = profile?.phone?.replace(/\D/g, '') || ''
  const getWhatsAppMessage = () => {
    if (locale === 'es') {
      return `Hola ${distributorName}, estoy revisando la página de Aqua Kangen Leveluk K8 en True Legacy y me gustaría hacerte unas preguntas sobre la demostración y opciones del paquete.`
    }
    if (locale === 'fr') {
      return `Bonjour ${distributorName}, je consulte la page de l'eau Kangen Leveluk K8 sur True Legacy et j'aimerais vous poser quelques questions sur la démonstration et les tarifs.`
    }
    if (locale === 'pt') {
      return `Olá ${distributorName}, estou visualizando a página da Água Kangen Leveluk K8 na True Legacy e gostaria de tirar algumas dúvidas sobre a demonstração e pacotes.`
    }
    return `Hi ${distributorName}, I'm reviewing the Kangen Water Leveluk K8 page on True Legacy and would love to ask you some questions about the water demo and package options.`
  }

  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMessage())}` : null

  return (
    <div className="min-h-screen bg-[#060913] text-[#f5f5f7] font-sans antialiased selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`True Legacy - Kangen Water® by Enagic - Leveluk K8 Medical Ionization - ${distributorName}`}
        description={`${copy.heroTitle1} ${copy.heroTitleAccent} ${copy.heroBody.slice(0, 150)}...`}
        image={leaderAvatar}
      />

      {/* TOP HEADER WITH 4-LANGUAGE SWITCHER */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#060913]/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to={`/d/${effectiveSlug}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
              title={copy.backToProfile}
            >
              <ArrowLeft className="h-4 w-4 text-cyan-400" />
              <span className="hidden xs:inline">{copy.backToProfile}</span>
              <span className="xs:hidden">{copy.back}</span>
            </Link>
            <Link to="/" className="flex items-center gap-2.5">
              <TrueLegacyLogo className="h-7 w-auto text-white" />
              <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-cyan-300">
                KANGEN WATER®
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 4-Language Toggle (EN, ES, FR, PT) */}
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md transition-all uppercase tracking-wider text-[11px] sm:text-xs ${
                    locale === lang
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                  title={`Switch to ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 text-xs transition-colors shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            )}
            <Link
              to={applyUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 sm:px-4 py-1.5 text-xs font-black text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
            >
              <span className="hidden xs:inline">{copy.requestInfo}</span>
              <span className="xs:hidden">Info</span>
              <Send className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-16 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-cyan-300 mb-6">
            <Droplets className="h-3.5 w-3.5" /> {copy.heroBadge}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]">
            {copy.heroTitle1} <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              {copy.heroTitleAccent}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#cccccc] leading-relaxed">
            {copy.heroBody}
          </p>

          {/* Distributor Personal Introduction Card */}
          {profile && (
            <div className="mt-8 mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl text-left flex items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={leaderAvatar}
                  alt={distributorName}
                  className="h-12 w-12 rounded-full object-cover border border-cyan-400/40 shrink-0 bg-black"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">{copy.sharedBy}</p>
                  <p className="font-bold text-white text-sm sm:text-base truncate">{distributorName}</p>
                  <p className="text-[11px] text-[#86868b] truncate">{profile.title || copy.leaderDefaultTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    aria-label="WhatsApp Message"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
                <Link
                  to={applyUrl}
                  className="inline-flex items-center gap-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-black text-slate-950 transition-colors shadow-md"
                >
                  {copy.connect}
                </Link>
              </div>
            </div>
          )}

          {/* VIDEO PRESENTATION SECTION WITH 4-LANGUAGE SELECTOR */}
          <div className="mt-10 sm:mt-14 mx-auto max-w-4xl rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#0e1629] to-[#080d1a] p-4 sm:p-6 shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                  {copy.demoBadge}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-2">{copy.demoTitle}</h3>
                <p className="text-xs text-[#86868b]">{copy.demoSubtitle}</p>
              </div>

              {/* Language Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1 shrink-0">
                {(['en', 'es', 'fr', 'pt'] as const).map((lang) => {
                  const label =
                    lang === 'en'
                      ? 'English (~4m)'
                      : lang === 'es'
                        ? 'Español (~4m)'
                        : lang === 'fr'
                          ? 'Français (~4m)'
                          : 'Português (~4m)'
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedVideoLang(lang)
                        setLocale(lang)
                      }}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                        selectedVideoLang === lang
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                          : 'text-[#86868b] hover:text-white'
                      }`}
                    >
                      <Globe2 className="h-3.5 w-3.5" /> {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 16:9 Video Embed */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  key={embedVideoUrl}
                  src={embedVideoUrl}
                  title="Kangen Water Leveluk K8 Demonstration"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-[#86868b]">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <PlayCircle className="h-4 w-4 text-cyan-400" /> {copy.demoFooter}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-cyan-400" /> {copy.watchTime}
              </span>
            </div>
          </div>
        </section>

        {/* 3 SCIENTIFIC PILLARS */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">{copy.scienceBadge}</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">{copy.scienceTitle}</h2>
            <p className="mt-3 text-sm text-[#cccccc]">{copy.scienceSubtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {copy.pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400/30 transition-all shadow-xl group"
                >
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-black text-white">{pillar.title}</h3>
                    <p className="text-xs font-bold text-cyan-400 mt-1">{pillar.subtitle}</p>
                    <p className="mt-3 text-xs text-[#cccccc] leading-relaxed">{pillar.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-2xl font-black text-cyan-300">{pillar.stat}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#86868b]">{pillar.statLabel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 5 TYPES OF ENAGIC WATER (INTERACTIVE TABS) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">{copy.waterSectionBadge}</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">{copy.waterSectionTitle}</h2>
            <p className="mt-3 text-sm text-[#cccccc]">{copy.waterSectionSubtitle}</p>
          </div>

          {/* Water Type Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {copy.waterTypes.map((water) => (
              <button
                key={water.id}
                onClick={() => setSelectedWaterId(water.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedWater.id === water.id
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-105'
                    : 'border border-white/10 bg-white/[0.03] text-[#cccccc] hover:border-white/20 hover:text-white'
                }`}
              >
                {water.pH} · {water.name}
              </button>
            ))}
          </div>

          {/* Active Water Card Display */}
          <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-black to-black p-6 sm:p-10 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 mb-3">
                  {selectedWater.tag}
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">{selectedWater.name}</h3>
                <p className="text-2xl font-black text-cyan-400 mt-1 font-mono">{selectedWater.pH}</p>
                <p className="mt-4 text-sm text-[#cccccc] leading-relaxed">{selectedWater.description}</p>

                <div className="mt-6 space-y-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-white">{copy.recommendedUses}</p>
                  {selectedWater.uses.map((use, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#cbd5e1]">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{use}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Spec Panel */}
              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">{copy.specPlatesLabel}</span>
                  <span className="text-xs font-black text-white">{copy.specPlatesVal}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">{copy.specMfgLabel}</span>
                  <span className="text-xs font-black text-white">{copy.specMfgVal}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">{copy.specCertLabel}</span>
                  <span className="text-xs font-black text-amber-300">{copy.specCertVal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-bold">{copy.specInquireLabel}</span>
                  <Link to={applyUrl} className="text-xs font-black text-cyan-400 hover:underline">
                    {copy.specInquireVal} {distributorName} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRIDGE TO THE DUO PACKAGE */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-black to-cyan-950/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-400/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-violet-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> {copy.duoBadge}
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white max-w-2xl mx-auto">
              {copy.duoTitle1} <br />
              <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                {copy.duoTitle2}
              </span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
              {copy.duoBody}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={duoUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-xs font-black text-black hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
              >
                {copy.duoExploreBtn} <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                to={applyUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-white transition-colors"
              >
                {copy.duoPricingBtn}
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-white mb-8">{copy.faqTitle}</h2>
          <div className="space-y-3">
            {copy.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-bold text-white text-sm sm:text-base">{faq.q}</span>
                    <span className={`grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-[#86868b] transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#cccccc] leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 text-center">
          <div className="rounded-3xl border border-cyan-400/30 bg-black/60 p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white">{copy.readyTitle}</h2>
            <p className="mt-3 text-xs sm:text-sm text-[#cccccc] max-w-xl mx-auto">
              {copy.readyBodyPrefix} <strong>{distributorName}</strong> {copy.readyBodySuffix}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={applyUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-8 py-3.5 text-sm font-black text-slate-950 transition-colors shadow-lg shadow-cyan-500/25"
              >
                {copy.ctaConsultation} <Send className="h-4 w-4" />
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-6 py-3.5 text-sm font-bold text-emerald-300 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> {copy.ctaWhatsApp}
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
