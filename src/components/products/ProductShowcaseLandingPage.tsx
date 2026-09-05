import { Footer } from '@/components/layout/Footer'
import { LandingHeaderBackButton } from '@/components/layout/LandingHeaderBackButton'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { getProductPurchaseLink } from '@/config/productPurchaseLinks'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Droplets,
  ExternalLink,
  FileText,
  Layers,
  MessageCircle,
  Radio,
  Send,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sliders,
  Sparkles,
  Star,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const LEADER_PORTRAITS: Record<string, string> = {
  'mehdi-cohen': '/leaders/standardized/mehdi-cohen.png',
  'simon-loh': '/leaders/standardized/simon-loh-v2.png',
  'ming-way-sia': '/leaders/standardized/ming-way-sia.png',
  'zah-naderi': '/leaders/standardized/zah-naderi-v3.png',
  'alex-gonzalez': '/leaders/standardized/alex-gonzalez.png',
  'ryan-pool': '/leaders/standardized/ryan-pool-sr.png',
  'ryan-pool-sr': '/leaders/standardized/ryan-pool-sr.png',
  'magaly-cardona': '/leaders/standardized/magaly-cardona.png',
  emanuela: '/leaders/standardized/emanuela-doustova.png',
  'emanuela-braj': '/leaders/standardized/emanuela-doustova.png',
  'jesse-schexnayder': '/leaders/standardized/jesse-schexnayder.png',
  'angel-mok': '/leaders/standardized/angel-mok-v2.png',
}

interface ProductShowcaseProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

export function ProductShowcaseLandingPage({
  profile: propProfile,
  distributorSlug: propSlug,
}: ProductShowcaseProps) {
  const { slug: routeSlug } = useParams<{ slug?: string }>()
  const effectiveSlug = propSlug || routeSlug || ''
  const { locale, setLocale } = useLocaleContext()

  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile)
  const [activeTab, setActiveTab] = useState<'all' | 'duo' | 'flagship' | 'lineup' | 'matrix' | 'guides'>('all')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  useEffect(() => {
    if (propProfile !== undefined) {
      setProfile(propProfile)
      return
    }
    if (!effectiveSlug) {
      setProfile(null)
      return
    }
    let active = true
    getPublicDistributors().then((items) => {
      if (!active) return
      setProfile(items.find((item) => item.slug === effectiveSlug) || null)
    })
    return () => {
      active = false
    }
  }, [propProfile, effectiveSlug])

  const distributorName = profile?.display_name || 'True Legacy Leader'
  const distributorFirstName = distributorName.split(' ')[0]
  const leaderAvatar =
    profile?.avatar_url ||
    (profile?.slug && getLeaderPortrait(profile.slug, LEADER_PORTRAITS[profile.slug])) ||
    '/logos/tl-square-white.png'

  const whatsappPhone = profile?.phone ? profile.phone.replace(/\D/g, '') : '18649072149'

  const getWhatsAppMessage = (productName?: string) => {
    const item = productName ? ` (${productName})` : ''
    switch (locale) {
      case 'es':
        return `Hola ${distributorFirstName}, estoy revisando el catálogo completo de productos de True Legacy${item} y me gustaría recibir precios y asesoría.`
      case 'fr':
        return `Bonjour ${distributorFirstName}, je consulte le catalogue complet des produits True Legacy${item} et j'aimerais recevoir les tarifs et conseils.`
      case 'pt':
        return `Olá ${distributorFirstName}, estou visualizando o catálogo completo de produtos da True Legacy${item} e gostaria de receber preços e orientação.`
      default:
        return `Hi ${distributorFirstName}, I am browsing the full True Legacy product showcase${item} and would like pricing and consultation details.`
    }
  }

  const defaultWhatsAppUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`
  const applyUrl = `/apply?ref=${profile?.referral_code || effectiveSlug || 'truelegacy'}&interest=products&source=product_showcase`
  const duoPageUrl = profile ? `/d/${profile.slug}/duo` : '/duo'
  const k8PageUrl = profile ? `/d/${profile.slug}/kangen` : '/kangen'
  const emguardePageUrl = profile ? `/d/${profile.slug}/emguarde` : '/emguarde'

  // UI Translation Dictionary
  const I18N = {
    en: {
      back: 'Back to Profile',
      backGeneral: 'Home',
      badge: 'Enagic® Official Technologies · True Legacy Collection',
      headline: 'The Complete Product Collection',
      headlineAccent: 'Engineered for Total Cellular Wellness.',
      subheadline:
        'Explore our premier Duo Package stack, flagship Japanese medical-grade technologies, and the complete lineup of Enagic systems for your home, health, and family.',
      sharedBy: 'Personal Product Showcase Shared By',
      verifiedDistributor: 'Verified True Legacy Distributor',
      requestPricing: 'Request Catalog & Pricing',
      whatsappBtn: 'WhatsApp Consultation',
      tabs: {
        all: 'All Products',
        duo: 'The Duo Package',
        flagship: 'Flagship Systems',
        lineup: 'Complete Catalog',
        matrix: 'Specs Comparison',
        guides: 'PDF Guides',
      },
      tier1Title: 'Tier 1 · The True Legacy Duo Package',
      tier1Sub: 'The synergistic foundation: cellular hydration + continuous 360° EMF protection.',
      tier1Cta: 'Explore The Full Duo Experience',
      tier2Title: 'Tier 2 · Flagship Technologies',
      tier2Sub: 'Our premier medical-grade and clinically backed health systems.',
      tier3Title: 'Tier 3 · Complete Enagic Product Line',
      tier3Sub: 'High-output commercial units, specialized ionizers, luxury skincare, and wellness items.',
      matrixTitle: 'Interactive Technical Comparison',
      matrixSub: 'Side-by-side specifications across electrode plates, pH performance, ORP, and applications.',
      guidesTitle: 'Official Product PDF Brochures',
      guidesSub: 'Download official Enagic specification sheets, medical certificates, and care guides.',
      faqTitle: 'Frequently Asked Questions',
      readyTitle: 'Ready to Transform Your Health & Home?',
      readySub:
        'Connect directly with your verified True Legacy distributor for custom pricing, shipping details, and personalized recommendations.',
      orderConsult: 'Request Consultation',
      viewPresentation: 'Watch Presentation',
      learnMore: 'Learn More',
      downloadPdf: 'Download PDF',
      inquireWhatsApp: 'Inquire on WhatsApp',
      buyNow: 'Buy Now',
      buyK8Now: 'Buy Leveluk K8 Now',
      buyEmguardeNow: 'Buy emGuarde Now',
      plates: 'Plates',
      warranty: 'Warranty',
      phRange: 'pH Range',
      orp: 'Negative ORP',
      idealFor: 'Ideal For',
      certifications: 'Certifications',
    },
    es: {
      back: 'Volver al Perfil',
      backGeneral: 'Inicio',
      badge: 'Tecnologías Oficiales Enagic® · Colección True Legacy',
      headline: 'La Colección Completa de Productos',
      headlineAccent: 'Diseñada para el Bienestar Celular Total.',
      subheadline:
        'Explora nuestro Paquete Dúo insignia, tecnologías médicas japonesas destacadas y la línea completa de sistemas Enagic para tu hogar, salud y familia.',
      sharedBy: 'Muestra de Productos Compartida Por',
      verifiedDistributor: 'Distribuidor Verificado True Legacy',
      requestPricing: 'Solicitar Catálogo y Precios',
      whatsappBtn: 'Consulta por WhatsApp',
      tabs: {
        all: 'Todos los Productos',
        duo: 'El Paquete Dúo',
        flagship: 'Sistemas Destacados',
        lineup: 'Catálogo Completo',
        matrix: 'Comparación Técnica',
        guides: 'Guías en PDF',
      },
      tier1Title: 'Nivel 1 · El Paquete Dúo de True Legacy',
      tier1Sub: 'La combinación sinérgica: hidratación celular + protección continua contra radiación EMF.',
      tier1Cta: 'Explorar la Experiencia del Dúo',
      tier2Title: 'Nivel 2 · Tecnologías Destacadas',
      tier2Sub: 'Nuestros principales sistemas de salud respaldados médicamente y clínicamente.',
      tier3Title: 'Nivel 3 · Línea Completa de Productos Enagic',
      tier3Sub: 'Equipos de alto rendimiento, ionizadores especializados, cuidado de la piel y bienestar.',
      matrixTitle: 'Comparación Técnica Interactiva',
      matrixSub: 'Especificaciones lado a lado: placas de electrodos, rendimiento de pH, ORP y aplicaciones.',
      guidesTitle: 'Folletos Oficiales de Productos en PDF',
      guidesSub: 'Descarga fichas técnicas oficiales de Enagic, certificados médicos y manuales de cuidado.',
      faqTitle: 'Preguntas Frecuentes',
      readyTitle: '¿Listo para Transformar tu Salud y tu Hogar?',
      readySub:
        'Conéctate directamente con tu distribuidor verificado de True Legacy para cotizaciones personalizadas, envíos y asesoría.',
      orderConsult: 'Solicitar Asesoría',
      viewPresentation: 'Ver Presentación',
      learnMore: 'Conocer Más',
      downloadPdf: 'Descargar PDF',
      inquireWhatsApp: 'Consultar por WhatsApp',
      buyNow: 'Comprar Ahora',
      buyK8Now: 'Comprar Leveluk K8',
      buyEmguardeNow: 'Comprar emGuarde',
      plates: 'Placas',
      warranty: 'Garantía',
      phRange: 'Rango de pH',
      orp: 'ORP Negativo',
      idealFor: 'Ideal Para',
      certifications: 'Certificaciones',
    },
    fr: {
      back: 'Retour au Profil',
      backGeneral: 'Accueil',
      badge: 'Technologies Officielles Enagic® · Collection True Legacy',
      headline: 'La Collection Complète de Produits',
      headlineAccent: 'Conçue pour le Bien-Être Cellulaire Total.',
      subheadline:
        'Découvrez notre Pack Duo exclusif, nos technologies médicales japonaises phares et la gamme complète de systèmes Enagic pour votre santé et votre foyer.',
      sharedBy: 'Vitrine Produits Présentée Par',
      verifiedDistributor: 'Distributeur Vérifié True Legacy',
      requestPricing: 'Demander le Catalogue & Tarifs',
      whatsappBtn: 'Consultation WhatsApp',
      tabs: {
        all: 'Tous les Produits',
        duo: 'Le Pack Duo',
        flagship: 'Systèmes Phares',
        lineup: 'Gamme Complète',
        matrix: 'Tableau Comparatif',
        guides: 'Guides PDF',
      },
      tier1Title: 'Niveau 1 · Le Pack Duo True Legacy',
      tier1Sub: 'La synergie fondamentale : hydratation cellulaire + protection anti-ondes 360° en continu.',
      tier1Cta: 'Découvrir le Pack Duo Complet',
      tier2Title: 'Niveau 2 · Technologies Phares',
      tier2Sub: 'Nos systèmes de santé de qualité médicale certifiée et cliniquement éprouvés.',
      tier3Title: 'Niveau 3 · Gamme Complète Enagic',
      tier3Sub: 'Appareils à haut débit, ioniseurs spécialisés, soins cosmétiques et bien-être.',
      matrixTitle: 'Comparatif Technique Interactif',
      matrixSub: 'Spécifications détaillées : plaques d’électrodes, plage de pH, potentiel ORP et usages.',
      guidesTitle: 'Brochures Officielles en PDF',
      guidesSub: 'Téléchargez les fiches produits officielles Enagic, certificats et manuels d’utilisation.',
      faqTitle: 'Foire Aux Questions',
      readyTitle: 'Prêt à Transformer Votre Santé et Votre Foyer ?',
      readySub:
        'Contactez directement votre distributeur True Legacy pour un devis personnalisé, les modalités de livraison et un accompagnement sur mesure.',
      orderConsult: 'Demander un Conseil',
      viewPresentation: 'Voir la Démo',
      learnMore: 'En Savoir Plus',
      downloadPdf: 'Télécharger PDF',
      inquireWhatsApp: 'Échanger sur WhatsApp',
      buyNow: 'Acheter',
      buyK8Now: 'Acheter Leveluk K8',
      buyEmguardeNow: 'Acheter emGuarde',
      plates: 'Plaques',
      warranty: 'Garantie',
      phRange: 'Plage pH',
      orp: 'ORP Négatif',
      idealFor: 'Idéal Pour',
      certifications: 'Certifications',
    },
    pt: {
      back: 'Voltar ao Perfil',
      backGeneral: 'Início',
      badge: 'Tecnologias Oficiais Enagic® · Coleção True Legacy',
      headline: 'A Coleção Completa de Produtos',
      headlineAccent: 'Desenvolvida para o Bem-Estar Celular Total.',
      subheadline:
        'Explore nosso Pacote Duo de destaque, tecnologias médicas japonesas pioneiras e a linha completa de sistemas Enagic para seu lar, saúde e família.',
      sharedBy: 'Catálogo de Produtos Compartilhado Por',
      verifiedDistributor: 'Distribuidor Verificado True Legacy',
      requestPricing: 'Solicitar Catálogo e Preços',
      whatsappBtn: 'Consulta por WhatsApp',
      tabs: {
        all: 'Todos os Produtos',
        duo: 'O Pacote Duo',
        flagship: 'Sistemas em Destaque',
        lineup: 'Catálogo Completo',
        matrix: 'Comparativo Técnico',
        guides: 'Guias em PDF',
      },
      tier1Title: 'Nível 1 · O Pacote Duo True Legacy',
      tier1Sub: 'A base sinérgica: hidratação celular + proteção contínua contra radiação EMF.',
      tier1Cta: 'Explorar a Experiência do Duo',
      tier2Title: 'Nível 2 · Tecnologias em Destaque',
      tier2Sub: 'Nossos principais sistemas de saúde com respaldo médico e estudos clínicos.',
      tier3Title: 'Nível 3 · Linha Completa de Produtos Enagic',
      tier3Sub: 'Equipamentos de alta capacidade, ionizadores especializados, cosméticos e bem-estar.',
      matrixTitle: 'Comparativo Técnico Interativo',
      matrixSub: 'Especificações lado a lado: placas de eletrodos, faixa de pH, ORP e aplicações.',
      guidesTitle: 'Manuais e Folhetos Oficiais em PDF',
      guidesSub: 'Baixe fichas técnicas oficiais da Enagic, certificados médicos e manuais de cuidado.',
      faqTitle: 'Perguntas Frequentes',
      readyTitle: 'Pronto para Transformar sua Saúde e seu Lar?',
      readySub:
        'Fale diretamente com seu distribuidor verificado da True Legacy para cotações personalizadas, envio e orientação.',
      orderConsult: 'Solicitar Consultoria',
      viewPresentation: 'Assistir à Apresentação',
      learnMore: 'Saber Mais',
      downloadPdf: 'Baixar PDF',
      inquireWhatsApp: 'Conversar no WhatsApp',
      buyNow: 'Comprar Agora',
      buyK8Now: 'Comprar Leveluk K8',
      buyEmguardeNow: 'Comprar emGuarde',
      plates: 'Placas',
      warranty: 'Garantia',
      phRange: 'Faixa de pH',
      orp: 'ORP Negativo',
      idealFor: 'Ideal Para',
      certifications: 'Certificações',
    },
  }

  const copy = I18N[locale]

  // Product Catalog Data with Multi-language Content
  const FLAGSHIP_PRODUCTS = [
    {
      id: 'k8',
      name: 'Leveluk K8',
      tagline: {
        en: 'The Premier 8-Plate Medical-Grade Hydrogen Ionizer',
        es: 'El Ionizador de Hidrógeno de Grado Médico de 8 Placas',
        fr: 'L’Ioniseur à Hydrogène de Qualité Médicale à 8 Plaques',
        pt: 'O Ionizador de Hidrogênio de Grau Médico com 8 Placas',
      },
      badge: { en: 'Flagship Ionizer', es: 'Ionizador Insignia', fr: 'Ioniseur Phare', pt: 'Ionizador Principal' },
      accent: 'cyan',
      image: '/products/k8.png',
      link: k8PageUrl,
      whatsappMsg: `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage('Leveluk K8'))}`,
      pdfUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
      specs: {
        plates: '8 Platinum-Dipped Titanium Plates',
        phRange: '2.5 pH – 11.5 pH',
        orp: 'Up to -850 mV',
        warranty: '5 Years Full Warranty',
        production: '5 Distinct Water Types',
        power: '230W Multi-Voltage',
      },
      highlights: {
        en: [
          '8 solid platinum-coated titanium electrolysis plates for maximum H₂ saturation',
          'Full-color interactive touchscreen with multilingual voice guidance',
          'Generates 5 distinct water types: Drinking, Clean, Beauty, Strong Acidic, and Strong Kangen',
          'Automatic cleaning system and energy-saving smart sleep mode',
        ],
        es: [
          '8 placas sólidas de titanio recubiertas de platino para máxima saturación de H₂',
          'Pantalla táctil a color con guía de voz en múltiples idiomas',
          'Genera 5 tipos de agua: Para Beber, Limpia, Belleza, Ácida Fuerte y Kangen Fuerte',
          'Sistema de autolimpieza automático y modo de ahorro inteligente',
        ],
        fr: [
          '8 plaques en titane massif plaquées platine pour une saturation maximale en H₂',
          'Écran tactile couleur avec guidage vocal multilingue',
          'Produit 5 types d’eau : Boisson, Propre, Beauté, Très Acide et Kangen Forte',
          'Système d’auto-nettoyage automatique et veille intelligente',
        ],
        pt: [
          '8 placas de titânio revestidas de platina para máxima saturação de H₂',
          'Tela sensível ao toque colorida com comandos de voz em vários idiomas',
          'Gera 5 tipos de água: Para Beber, Limpa, Beleza, Ácida Forte e Super Kangen',
          'Sistema de autolimpeza inteligente e modo de economia de energia',
        ],
      },
    },
    {
      id: 'emguarde',
      name: 'emGuarde GO™ (Set of 2)',
      tagline: {
        en: 'Patented 360° Electromagnetic Radiation Harmonization',
        es: 'Armonización Patentada de Radiación Electromagnética 360°',
        fr: 'Harmonisation Brevetée du Rayonnement Électromagnétique 360°',
        pt: 'Harmonização Patenteada de Radiação Eletromagnética em 360°',
      },
      badge: { en: 'Flagship EMF Defense', es: 'Defensa EMF Insignia', fr: 'Protection CEM Phare', pt: 'Proteção EMF Principal' },
      accent: 'violet',
      image: '/products/emguarde-go.png',
      link: emguardePageUrl,
      whatsappMsg: `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage('emGuarde GO'))}`,
      pdfUrl: undefined,
      specs: {
        plates: 'Harmonic Resonance Chip',
        phRange: 'Suppresses High-Frequency Noise',
        orp: '3-Meter Radius (360° Sphere)',
        warranty: '1 Year Manufacturer Warranty',
        production: 'Set of 2 Portable Units',
        power: 'USB-C / 5V Low Power',
      },
      highlights: {
        en: [
          'Patented harmonic resonance frequency harmonizes electro smoke and EMF radiation noise',
          'Covers up to 3-meter (10 ft) spherical radius without blocking phone or Wi-Fi signals',
          'Clinically tested at UTAR University: promotes microcirculation & reduces cellular stress',
          'Ultra-portable USB-C powered design for home, office, and travel',
        ],
        es: [
          'Frecuencia de resonancia armónica patentada que armoniza el electrosmog y el ruido de radiación EMF',
          'Cobertura esférica de 3 metros sin bloquear señales de telefonía o Wi-Fi',
          'Respaldado por estudios clínicos en la Universidad UTAR: mejora la microcirculación',
          'Diseño ultra portátil alimentado por USB-C para el hogar, oficina y viajes',
        ],
        fr: [
          'Fréquence de résonance harmonique brevetée harmonisant l\'électrosmog et le bruit des ondes CEM',
          'Protection sphérique sur 3 mètres sans altérer les signaux Wi-Fi ni cellulaires',
          'Validé par des études cliniques UTAR : améliore la microcirculation sanguine',
          'Format nomade USB-C compact idéal pour la maison, le bureau et les déplacements',
        ],
        pt: [
          'Ressonância harmônica patenteada que harmoniza o electrosmog e o ruído de radiação eletromagnética',
          'Cobertura esférica de 3 metros sem bloquear sinal de celular ou Wi-Fi',
          'Comprovado em estudos clínicos da Universidade UTAR: favorece a microcirculação',
          'Design ultraportátil alimentado por USB-C para residência, trabalho e viagens',
        ],
      },
    },
    {
      id: 'anespa_dx',
      name: 'Anespa DX Mineral Ion Shower',
      tagline: {
        en: 'Japanese Hot-Spring Mineral Spa & Chlorine Elimination',
        es: 'Spa Mineral de Aguas Termales Japonesas y Eliminación de Cloro',
        fr: 'Spa Minéral aux Sources Thermales Japonaises & Élimination du Chlore',
        pt: 'Spa Mineral de Águas Termais Japonesas e Eliminação de Cloro',
      },
      badge: { en: 'Mineral Shower Spa', es: 'Ducha Spa Mineral', fr: 'Douche Spa Minérale', pt: 'Chuveiro Spa Mineral' },
      accent: 'teal',
      image: '/products/anespa-dx.png',
      link: applyUrl,
      whatsappMsg: `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage('Anespa DX'))}`,
      pdfUrl: 'https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf?v=1767139664',
      specs: {
        plates: 'Futamata Radium & Chikutan',
        phRange: 'Slightly Acidic 6.8 – 7.2 pH',
        orp: 'Active Mineral Infusion',
        warranty: '3 Years Full Warranty',
        production: 'Continuous Mineral Shower',
        power: 'Non-Electric Water Pressure',
      },
      highlights: {
        en: [
          'Active ceramic cartridge filters out 100% of residual chlorine and harmful chemicals',
          'Infuses shower water with natural minerals from Hokkaido’s Futamata Radium hot springs',
          'Gentle slightly acidic pH moisturizes dry skin and prevents hair damage from hard water',
          'Non-electric, installs easily onto standard residential shower connections',
        ],
        es: [
          'Cartucho cerámico activo que filtra el 100% del cloro residual y químicos del agua',
          'Infunde el agua con minerales naturales de las termas de Futamata Radium en Hokkaido',
          'pH suave que hidrata la piel seca y protege el cabello contra el agua dura',
          'Sin electricidad, se instala fácilmente en cualquier conexión de ducha estándar',
        ],
        fr: [
          'Cartouche en céramique active éliminant 100% du chlore résiduel et impuretés',
          'Enrichit l’eau avec des minéraux naturels des sources chaudes de Futamata Radium à Hokkaido',
          'pH doux hydratant la peau et préservant les cheveux contre le calcaire',
          'Fonctionne sans électricité et s’adapte à toute robinetterie de douche standard',
        ],
        pt: [
          'Cartucho cerâmico ativo que remove 100% do cloro residual e impurezas da água',
          'Enriquece a água com minerais naturais das fontes termais de Futamata Radium em Hokkaido',
          'pH suave que hidrata a pele ressecada e protege os cabelos contra água dura',
          'Funciona sem eletricidade e instala facilmente no chuveiro residencial',
        ],
      },
    },
    {
      id: 'ukon_sigma',
      name: 'Kangen Ukon® Sigma',
      tagline: {
        en: 'Wild Okinawan Spring Turmeric Enriched with Kangen Water®',
        es: 'Cúrcuma Silvestre de Okinawa Enriquecida con Agua Kangen®',
        fr: 'Curcuma Sauvage d’Okinawa Enrichi à l’Eau Kangen®',
        pt: 'Cúrcuma Silvestre de Okinawa Enriquecida com Água Kangen®',
      },
      badge: { en: 'Organic Supplement', es: 'Suplemento Orgánico', fr: 'Complément Bio', pt: 'Suplemento Orgânico' },
      accent: 'amber',
      image: '/products/ukon-sigma.png',
      link: applyUrl,
      whatsappMsg: `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage('Kangen Ukon Sigma'))}`,
      pdfUrl: 'https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf?v=1767139574',
      specs: {
        plates: 'Okinawa Wild Turmeric',
        phRange: 'Infused with Strong Kangen 11.5',
        orp: 'High Curcuminoid Potency',
        warranty: '100% Plant-Based Softgels',
        production: 'Patented Softgel Blister Pack',
        power: 'Squalene & Vitamin E Rich',
      },
      highlights: {
        en: [
          'Cultivated in the mineral-dense soils of Yanbaru, Okinawa with zero artificial fertilizers',
          'Cleansed and sanitized exclusively using Strong Acidic and Strong Kangen water',
          'Encapsulated in 100% plant-based softgels with olive oil, flaxseed oil, and rice bran oil',
          'Individually sealed in sterile blister packs to prevent oxidation and ensure maximum potency',
        ],
        es: [
          'Cultivada en los suelos ricos en minerales de Yanbaru, Okinawa, sin fertilizantes artificiales',
          'Limpia y sanitizada exclusivamente con agua Kangen Fuerte y Ácida Fuerte',
          'Encapsulada en perlas 100% vegetales con aceites de oliva, linaza y salvado de arroz',
          'Sellado individual en blíster hermético para evitar oxidación y garantizar máxima pureza',
        ],
        fr: [
          'Cultivé dans les sols riches de Yanbaru à Okinawa sans aucun engrais artificiel',
          'Nettoyé et purifié exclusivement avec de l’eau Kangen Forte et Très Acide',
          'Capsules 100% végétales enrichies aux huiles d’olive, de lin et de son de riz',
          'Conditionnement individuel sous blister hermétique préservant toute sa puissance',
        ],
        pt: [
          'Cultivada nos solos ricos de Yanbaru, Okinawa, sem fertilizantes químicos',
          'Higienizada exclusivamente com água Super Kangen e Água Ácida Forte',
          'Cápsulas 100% vegetais com óleos de oliva, linhaça e farelo de arroz',
          'Embalagem blister hermética individual para evitar oxidação e manter potência máxima',
        ],
      },
    },
  ]

  const FULL_LINEUP_PRODUCTS = [
    {
      id: 'sd501_dx',
      name: 'Leveluk SD501 DX',
      category: { en: '7-Plate Ionizer', es: 'Ionizador de 7 Placas', fr: 'Ioniseur 7 Plaques', pt: 'Ionizador 7 Placas' },
      description: {
        en: 'The industry benchmark worldwide with 7 platinum-coated plates and crisp metallic chassis.',
        es: 'El estándar de la industria mundial con 7 placas de titanio y elegante acabado metálico.',
        fr: 'La référence mondiale avec 7 plaques en titane et une élégante finition métallisée.',
        pt: 'A referência mundial da indústria com 7 placas de titânio e acabamento metálico.',
      },
      image: '/products/sd501-dx.png',
      specs: '7 Plates · 2.5–11.5 pH · -800mV · 5 Year Warranty',
      pdfUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    },
    {
      id: 'sd501_super',
      name: 'Leveluk Super 501',
      category: { en: '12-Plate Commercial Unit', es: 'Unidad Comercial de 12 Placas', fr: 'Modèle Commercial 12 Plaques', pt: 'Unidade Comercial de 12 Placas' },
      description: {
        en: 'Heavy-duty dual-chamber system for large families, gyms, wellness clinics, and restaurants.',
        es: 'Sistema de doble cámara de alta capacidad para familias numerosas, spas, clínicas y restaurantes.',
        fr: 'Système haute performance à double chambre pour familles nombreuses, spas, cliniques et restaurants.',
        pt: 'Sistema de alta capacidade com câmara dupla para famílias grandes, spas, clínicas e restaurantes.',
      },
      image: '/products/sd501-super.png',
      specs: '12 Plates · High Flow · 2.5–11.5 pH · 3 Year Warranty',
      pdfUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    },
    {
      id: 'sd501',
      name: 'Leveluk Jr IV',
      category: { en: '4-Plate Starter Ionizer', es: 'Ionizador Inicial de 4 Placas', fr: 'Ioniseur Compact 4 Plaques', pt: 'Ionizador Inicial de 4 Placas' },
      description: {
        en: 'Compact, energy-efficient 4-plate model delivering all 5 water types for singles and smaller homes.',
        es: 'Modelo compacto y eficiente de 4 placas que produce los 5 tipos de agua para hogares pequeños.',
        fr: 'Modèle compact et économique à 4 plaques produisant les 5 types d’eau pour petits foyers.',
        pt: 'Modelo compacto e econômico de 4 placas que produz os 5 tipos de água para lares menores.',
      },
      image: '/products/jr-iv.png',
      specs: '4 Plates · Low Energy · 2.5–11.5 pH · 3 Year Warranty',
      pdfUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    },
    {
      id: 'kangen_beaute',
      name: 'Kangen Beauté® Organic Skincare',
      category: { en: 'Luxury Skincare Set', es: 'Set de Cuidado Facial de Lujo', fr: 'Soins Visage Organiques', pt: 'Linha Facial Orgânica' },
      description: {
        en: '3-step organic skincare regimen formulated with fermented botanical extracts and Kangen Beauty water.',
        es: 'Régimen de 3 pasos con extractos botánicos fermentados y agua de belleza Kangen.',
        fr: 'Protocole de beauté en 3 étapes aux extraits botaniques fermentés et à l’eau de beauté Kangen.',
        pt: 'Ritual de cuidados em 3 passos formulado com extratos botânicos e água de beleza Kangen.',
      },
      image: '/products/kangen-beaute.png',
      specs: 'Cleanser · Essence Lotion · Radiance Cream',
      pdfUrl: 'https://www.enagic.com/pdf/1282/Kangen_Beaut%C3%A9_Presentation_-_English.pdf?v=1784249348',
    },
    {
      id: 'kangen_wagyu',
      name: 'Kangen Wagyu™',
      category: { en: 'Pasture-Raised Gourmet', es: 'Gourmet de Pastoreo', fr: 'Bœuf Gourmet d’Okinawa', pt: 'Gourmet Especial' },
      description: {
        en: 'Pure Japanese Wagyu raised on Okinawa pastures with pure Kangen Water® hydration.',
        es: 'Auténtico Wagyu japonés criado en pastizales de Okinawa e hidratado con Agua Kangen®.',
        fr: 'Authentique Wagyu japonais élevé dans les pâturages d’Okinawa et hydraté à l’Eau Kangen®.',
        pt: 'Autêntico Wagyu japonês criado em pastagens de Okinawa e hidratado com Água Kangen®.',
      },
      image: '/products/kangen-wagyu.png',
      specs: 'A5 Grade · Japan & US Availability',
      pdfUrl: 'https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf?v=1766769996',
    },
  ]

  const COMPARISON_ROWS = [
    {
      model: 'Leveluk K8',
      plates: '8 Solid Plates',
      ph: '2.5 – 11.5 pH',
      orp: 'Up to -850 mV',
      display: 'Touchscreen + Voice (8 langs)',
      warranty: '5 Years',
      bestFor: 'Ultimate Home Antioxidant & Hydration',
    },
    {
      model: 'Leveluk SD501 DX',
      plates: '7 Solid Plates',
      ph: '2.5 – 11.5 pH',
      orp: 'Up to -800 mV',
      display: 'LCD + Voice Guidance',
      warranty: '5 Years',
      bestFor: 'Families & Daily Performance Standard',
    },
    {
      model: 'Leveluk Super 501',
      plates: '12 Plates (Dual Chamber)',
      ph: '2.5 – 11.5 pH',
      orp: 'Up to -850 mV (High Flow)',
      display: 'Dual LCD Display',
      warranty: '3 Years',
      bestFor: 'High Volume, Clinics & Commercial Spas',
    },
    {
      model: 'Leveluk Jr IV',
      plates: '4 Solid Plates',
      ph: '2.5 – 11.5 pH',
      orp: 'Up to -450 mV',
      display: 'LCD Display',
      warranty: '3 Years',
      bestFor: 'Singles, Students & Compact Spaces',
    },
    {
      model: 'Anespa DX',
      plates: 'Futamata Mineral Spa',
      ph: '6.8 – 7.2 pH (Chlorine Free)',
      orp: 'Mineral Hot Spring Ionization',
      display: 'Non-Electric Filter System',
      warranty: '3 Years',
      bestFor: 'Shower Water, Hair & Sensitive Skin',
    },
    {
      model: 'emGuarde GO (Set of 2)',
      plates: 'Harmonic Resonance Chip',
      ph: 'Suppresses Noise Frequencies',
      orp: '3-Meter Spherical Protection',
      display: 'LED Status Indicator',
      warranty: '1 Year',
      bestFor: 'Electro Smoke & EMF Environmental Defense · Travel',
    },
  ]

  const FAQS = [
    {
      q: {
        en: 'What makes the True Legacy Duo Package the most recommended setup?',
        es: '¿Por qué el Paquete Dúo de True Legacy es la combinación más recomendada?',
        fr: 'Pourquoi le Pack Duo True Legacy est-il la solution la plus recommandée ?',
        pt: 'Por que o Pacote Duo da True Legacy é a combinação mais recomendada?',
      },
      a: {
        en: 'The Duo Package pairs internal cellular hydration and antioxidant molecular hydrogen (Leveluk K8) with continuous 360° environmental electromagnetic radiation defense (emGuarde GO). This addresses the two primary stressors of modern living: cellular dehydration and constant EMF exposure.',
        es: 'El Paquete Dúo combina la hidratación celular interna y el poder antioxidante del hidrógeno molecular (Leveluk K8) con la defensa continua contra la radiación electromagnética (emGuarde GO). Ataca los dos mayores factores de estrés modernos: la deshidratación y la saturación de ondas electromagnéticas.',
        fr: 'Le Pack Duo associe l’hydratation cellulaire antioxydante à l’hydrogène moléculaire (Leveluk K8) et la protection continue contre les ondes électromagnétiques (emGuarde GO). Il répond aux deux défis majeurs de la vie moderne : la déshydratation cellulaire et l’exposition constante aux rayonnements.',
        pt: 'O Pacote Duo une a hidratação celular antioxidante com hidrogênio molecular (Leveluk K8) à proteção ambiental contínua contra radiação eletromagnética (emGuarde GO), resolvendo os dois maiores desafios da saúde moderna.',
      },
    },
    {
      q: {
        en: 'How do I purchase or order machines in my country?',
        es: '¿Cómo puedo comprar u ordenar máquinas en mi país?',
        fr: 'Comment commander les appareils dans mon pays ?',
        pt: 'Como posso adquirir ou encomendar os aparelhos no meu país?',
      },
      a: {
        en: 'Enagic ships directly through 40+ official branches across 23 countries, supporting over 150 countries worldwide. When you submit an inquiry or contact via WhatsApp, your distributor will provide official order forms and local financing options.',
        es: 'Enagic realiza envíos directos a través de más de 40 sucursales en 23 países, con cobertura en más de 150 países. Al enviar tu solicitud o escribir por WhatsApp, tu distribuidor te proporcionará formularios oficiales y opciones de financiamiento.',
        fr: 'Enagic expédie directement via plus de 40 succursales réparties dans 23 pays, couvrant plus de 150 pays. En envoyant votre demande ou via WhatsApp, votre distributeur vous transmettra les formulaires officiels et facilités de paiement.',
        pt: 'A Enagic envia diretamente através de mais de 40 filiais em 23 países, atendendo mais de 150 países. Ao enviar sua solicitação ou mensagem no WhatsApp, seu distribuidor fornecerá os formulários oficiais e planos de pagamento.',
      },
    },
    {
      q: {
        en: 'What certifications do Enagic water ionizers hold?',
        es: '¿Qué certificaciones tienen los ionizadores de agua Enagic?',
        fr: 'Quelles sont les certifications des ioniseurs d’eau Enagic ?',
        pt: 'Quais certificações os ionizadores de água Enagic possuem?',
      },
      a: {
        en: 'Enagic ionizers are manufactured in Osaka, Japan under ISO 13485 (Medical Device Manufacturing), ISO 9001, and ISO 14001 standards. Enagic is also the only water ionizer manufacturer worldwide awarded the prestigious Gold Seal Certification by the Water Quality Association (WQA).',
        es: 'Los ionizadores Enagic se fabrican en Osaka, Japón, bajo normas ISO 13485 (Dispositivos Médicos), ISO 9001 e ISO 14001. Enagic es el único fabricante galardonado con el prestigioso Sello de Oro de la Water Quality Association (WQA).',
        fr: 'Les ioniseurs Enagic sont fabriqués à Osaka au Japon selon les normes ISO 13485 (Dispositifs Médicaux), ISO 9001 et ISO 14001. Enagic est le seul fabricant au monde certifié Gold Seal par la Water Quality Association (WQA).',
        pt: 'Os ionizadores Enagic são produzidos em Osaka, Japão, sob as normas ISO 13485 (Dispositivos Médicos), ISO 9001 e ISO 14001. A Enagic é a única fabricante mundial premiada com o Selo de Ouro da Water Quality Association (WQA).',
      },
    },
    {
      q: {
        en: 'Can I combine multiple products in a single order?',
        es: '¿Puedo combinar varios productos en una sola orden?',
        fr: 'Puis-je regrouper plusieurs produits dans une même commande ?',
        pt: 'Posso combinar múltiplos produtos em um único pedido?',
      },
      a: {
        en: 'Yes. Many clients combine the Leveluk K8 with emGuarde GO and Anespa DX for a complete whole-home solution (The Trifecta Stack). Your distributor will help structure your purchase for optimal savings.',
        es: 'Sí. Muchos clientes combinan el Leveluk K8 con emGuarde GO y Anespa DX para una solución integral de hogar saludable (Trifecta). Tu distribuidor te asesorará para optimizar precios y beneficios.',
        fr: 'Oui. De nombreux clients associent le Leveluk K8 avec l’emGuarde GO et l’Anespa DX pour une solution complète de bien-être à domicile (Trifecta). Votre distributeur vous aidera à composer votre pack optimal.',
        pt: 'Sim. Muitos clientes combinam o Leveluk K8 com o emGuarde GO e o Anespa DX para uma solução completa de saúde residencial (Trifecta). Seu distribuidor orientará a melhor configuração de compra.',
      },
    },
  ]

  return (
    <div className="page-wrapper bg-[#040711] text-white selection:bg-cyan-500 selection:text-slate-950 min-h-screen">
      <SEO
        title={`${copy.headline} | True Legacy Official Collection`}
        description={copy.subheadline}
        image={leaderAvatar}
      />

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#040711]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LandingHeaderBackButton
              fallbackUrl={profile ? `/d/${profile.slug}` : '/'}
              label={profile ? copy.back : copy.backGeneral}
            />
            <Link to="/" className="flex items-center gap-2 group">
              <TrueLegacyLogo />
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
                <span className="text-xs font-black tracking-wider uppercase text-cyan-400">Enagic®</span>
                <span className="text-xs text-[#86868b]">·</span>
                <span className="text-xs font-bold text-white">Showcase</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#buy-options"
              onClick={() => setActiveTab('all')}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-95"
              aria-label="Browse products available to buy"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{copy.buyNow}</span>
            </a>
            {/* 4-Language Toggle (EN, ES, FR, PT) */}
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold notranslate" translate="no">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md transition-all uppercase tracking-wider text-[11px] sm:text-xs font-bold notranslate ${
                    locale === lang
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                  title={`Switch to ${lang.toUpperCase()}`}
                  translate="no"
                >
                  {lang === 'en' ? 'EN' : lang === 'es' ? 'ES' : lang === 'fr' ? 'FR' : 'PT'}
                </button>
              ))}
            </div>

            {/* Solid Green WhatsApp Button */}
            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 text-xs transition-colors shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>

            <Link
              to={applyUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 sm:px-4 py-1.5 text-xs font-black text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
            >
              <span className="hidden sm:inline">{copy.requestPricing}</span>
              <span className="sm:hidden">Info</span>
              <Send className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:pt-16 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-cyan-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> {copy.badge}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.12]">
            {copy.headline} <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              {copy.headlineAccent}
            </span>
          </h1>

          <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base text-[#cccccc] leading-relaxed">
            {copy.subheadline}
          </p>

          {/* Distributor Personal Card (if accessed via personal referral) */}
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
                  <p className="text-[11px] text-[#86868b] truncate">{profile.title || copy.verifiedDistributor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={defaultWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  aria-label="WhatsApp Message"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <Link
                  to={applyUrl}
                  className="inline-flex items-center gap-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-black text-slate-950 transition-colors shadow-md"
                >
                  {copy.orderConsult}
                </Link>
              </div>
            </div>
          )}

          {/* QUICK CATEGORY NAVIGATION PILLS */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto pb-4">
            {(['all', 'duo', 'flagship', 'lineup', 'matrix', 'guides'] as const).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tabKey
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                    : 'border border-white/10 bg-white/5 text-[#cccccc] hover:bg-white/10 hover:text-white'
                }`}
              >
                {copy.tabs[tabKey]}
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TIER 1: THE TRUE LEGACY DUO PACKAGE SPOTLIGHT */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'duo') && (
          <section id="buy-options" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-b from-[#0e1a38] via-[#091024] to-[#040711] p-6 sm:p-10 shadow-2xl">
              {/* Ambient backdrop glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-violet-500/15 blur-[120px]" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
                <div className="flex-1 text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 mb-4">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    {copy.tier1Title}
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                    Leveluk K8 + emGuarde GO™ <br />
                    <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                      Total Internal & External Cellular Synergy
                    </span>
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-[#cccccc] leading-relaxed">
                    {copy.tier1Sub} Experience 8-plate active molecular hydrogen (H₂) hydration alongside patented 3-meter harmonic resonance technology to harmonize electro smoke and EMF radiation noise.
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <Droplets className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white">Leveluk K8 Water System</p>
                        <p className="text-[11px] text-[#86868b]">8 Platinum Plates · -850mV ORP · 5 pH Types</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <Radio className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white">emGuarde GO (Set of 2)</p>
                        <p className="text-[11px] text-[#86868b]">360° Spherical EMF Suppression · USB-C Portability</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <Link
                      to={duoPageUrl}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                      <Sparkles className="h-4 w-4" />
                      {copy.tier1Cta}
                    </Link>
                    {getProductPurchaseLink(profile?.purchase_links, 'k8') && (
                      <a
                        href={getProductPurchaseLink(profile?.purchase_links, 'k8')!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {copy.buyK8Now}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {getProductPurchaseLink(profile?.purchase_links, 'emguarde') && (
                      <a
                        href={getProductPurchaseLink(profile?.purchase_links, 'emguarde')!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {copy.buyEmguardeNow}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <a
                      href={defaultWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {copy.inquireWhatsApp}
                    </a>
                  </div>
                </div>

                {/* Hero Duo Imagery */}
                <div className="w-full lg:w-[360px] shrink-0 flex items-center justify-center">
                  <div className="w-full overflow-hidden rounded-3xl border border-white/15 bg-black/60 p-5 backdrop-blur-2xl shadow-2xl">
                    <div className="h-44 w-full flex items-center justify-center gap-3 overflow-hidden py-1">
                      <img
                        src="/products/k8.png"
                        alt="Leveluk K8 Water Ionizer"
                        className="max-h-36 max-w-[50%] w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform"
                        style={{ maxHeight: '144px', maxWidth: '50%' }}
                      />
                      <img
                        src="/products/emguarde-go.png"
                        alt="emGuarde GO Set of 2"
                        className="max-h-28 max-w-[42%] w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform"
                        style={{ maxHeight: '112px', maxWidth: '42%' }}
                      />
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#86868b]">
                      <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Complete Health Stack
                      </span>
                      <span>Enagic® Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TIER 2: FLAGSHIP TECHNOLOGIES SHOWCASE */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'flagship') && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 mb-2">
                <Star className="h-3.5 w-3.5" />
                {copy.tier2Title}
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">{copy.tier2Title}</h2>
              <p className="text-xs sm:text-sm text-[#86868b] mt-1">{copy.tier2Sub}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {FLAGSHIP_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:border-cyan-400/40 transition-all"
                >
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 rounded-full">
                          {prod.badge[locale]}
                        </span>
                        <h3 className="text-2xl font-black text-white mt-2">{prod.name}</h3>
                        <p className="text-xs text-[#cccccc] font-medium mt-1">{prod.tagline[locale]}</p>
                      </div>

                      <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 mx-auto sm:mx-0 p-2 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-20 sm:max-h-24 max-w-full w-auto object-contain drop-shadow-lg"
                          style={{ maxHeight: '88px', maxWidth: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-6 text-xs">
                      <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                        <p className="text-[10px] text-[#86868b] uppercase tracking-wider">{copy.plates}</p>
                        <p className="font-bold text-white text-xs mt-0.5 truncate">{prod.specs.plates}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                        <p className="text-[10px] text-[#86868b] uppercase tracking-wider">{copy.phRange}</p>
                        <p className="font-bold text-cyan-300 text-xs mt-0.5 truncate">{prod.specs.phRange}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                        <p className="text-[10px] text-[#86868b] uppercase tracking-wider">{copy.orp}</p>
                        <p className="font-bold text-emerald-400 text-xs mt-0.5 truncate">{prod.specs.orp}</p>
                      </div>
                    </div>

                    {/* Highlights List */}
                    <ul className="space-y-2 text-xs text-[#cccccc] mb-6">
                      {prod.highlights[locale].map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={prod.link}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-md"
                      >
                        {copy.viewPresentation}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      {prod.pdfUrl && (
                        <a
                          href={prod.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2.5 text-xs font-semibold text-white transition-colors"
                        >
                          <Download className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="hidden sm:inline">{copy.downloadPdf}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {getProductPurchaseLink(profile?.purchase_links, prod.id) && (
                        <a
                          href={getProductPurchaseLink(profile?.purchase_links, prod.id)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-md shadow-amber-500/20 active:scale-95"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {copy.buyNow}
                        </a>
                      )}
                      <a
                        href={prod.whatsappMsg}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        {copy.inquireWhatsApp}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TIER 3: FULL ENAGIC PRODUCT CATALOG */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'lineup') && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-blue-300 mb-2">
                <Layers className="h-3.5 w-3.5" />
                {copy.tier3Title}
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">{copy.tier3Title}</h2>
              <p className="text-xs sm:text-sm text-[#86868b] mt-1">{copy.tier3Sub}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FULL_LINEUP_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between hover:border-white/20 transition-all"
                >
                  <div>
                    <div className="h-32 w-full rounded-2xl bg-black/60 border border-white/5 p-3 flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="max-h-24 max-w-[70%] w-auto object-contain drop-shadow-md"
                        style={{ maxHeight: '96px', maxWidth: '70%' }}
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">
                      {prod.category[locale]}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{prod.name}</h3>
                    <p className="text-xs text-[#cccccc] mt-2 leading-relaxed">{prod.description[locale]}</p>
                    <p className="text-[11px] font-mono text-cyan-400 mt-3">{prod.specs}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    {prod.pdfUrl && (
                      <a
                        href={prod.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#86868b] hover:text-white"
                      >
                        <FileText className="h-3.5 w-3.5 text-cyan-400" /> PDF Guide
                      </a>
                    )}
                    <div className="flex items-center gap-2">
                      {getProductPurchaseLink(profile?.purchase_links, prod.id) && (
                        <a
                          href={getProductPurchaseLink(profile?.purchase_links, prod.id)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition-colors shadow-sm shadow-amber-500/20 active:scale-95"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          {copy.buyNow}
                        </a>
                      )}
                      <a
                        href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage(prod.name))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition-colors shadow-sm shadow-emerald-500/20"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Inquire
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE TECHNICAL SPECIFICATION MATRIX */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'matrix') && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#0b1326] to-[#050914] p-6 sm:p-10 shadow-2xl">
              <div className="text-left mb-6 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 mb-2">
                    <Sliders className="h-3.5 w-3.5" />
                    {copy.matrixTitle}
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white">{copy.matrixTitle}</h2>
                  <p className="text-xs sm:text-sm text-[#86868b] mt-1">{copy.matrixSub}</p>
                </div>

                <Link
                  to={applyUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-black text-slate-950 transition-colors shadow-md self-start sm:self-auto"
                >
                  <Send className="h-3.5 w-3.5" /> {copy.requestPricing}
                </Link>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/15 text-[#86868b] uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pr-4 font-bold">Model</th>
                      <th className="pb-3 px-4 font-bold">Plates / Core Tech</th>
                      <th className="pb-3 px-4 font-bold">pH Range</th>
                      <th className="pb-3 px-4 font-bold">ORP / Signal</th>
                      <th className="pb-3 px-4 font-bold">Warranty</th>
                      <th className="pb-3 pl-4 font-bold">Primary Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-white font-medium">
                    {COMPARISON_ROWS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4 font-black text-cyan-300 text-sm">{row.model}</td>
                        <td className="py-4 px-4 text-[#cccccc]">{row.plates}</td>
                        <td className="py-4 px-4 font-mono font-bold text-white">{row.ph}</td>
                        <td className="py-4 px-4 font-mono text-emerald-400">{row.orp}</td>
                        <td className="py-4 px-4">{row.warranty}</td>
                        <td className="py-4 pl-4 text-xs text-[#86868b]">{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* OFFICIAL PDF RESOURCE CENTER */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'guides') && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="text-left mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-300 mb-2">
                <FileText className="h-3.5 w-3.5" />
                {copy.guidesTitle}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{copy.guidesTitle}</h2>
              <p className="text-xs sm:text-sm text-[#86868b] mt-1">{copy.guidesSub}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Kangen Water® Ionizers Guide',
                  desc: 'Comprehensive 8-page overview of Leveluk K8, SD501, Super 501, and Jr IV.',
                  url: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
                },
                {
                  title: 'Anespa DX Mineral Spa Brochure',
                  desc: 'Full specification guide on hot spring minerals and chlorine removal.',
                  url: 'https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf?v=1767139664',
                },
                {
                  title: 'Kangen Ukon® Sigma Product Guide',
                  desc: 'Okinawan turmeric softgel harvesting, patent packaging, and health science.',
                  url: 'https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf?v=1767139574',
                },
                {
                  title: 'Machine Care & Maintenance Guide',
                  desc: 'Deep cleaning, filter replacements, and long-term ionizer preservation.',
                  url: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf?v=1767139562',
                },
              ].map((pdf, i) => (
                <a
                  key={i}
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                      <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {pdf.title}
                    </h4>
                    <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">{pdf.desc}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    Open Official PDF <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* FAQ ACCORDION SECTION */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-4xl font-black text-white">{copy.faqTitle}</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q[locale]}</span>
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
                        className="px-5 pb-5 text-xs sm:text-sm text-[#cccccc] leading-relaxed border-t border-white/5 pt-3"
                      >
                        {faq.a[locale]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 text-center">
          <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-[#0b1324] to-[#040711] p-8 sm:p-12 shadow-2xl">
            <div className="mx-auto mb-6 h-16 w-16 overflow-hidden rounded-full border-2 border-cyan-400/40 p-0.5 shadow-2xl">
              <img src={leaderAvatar} alt={distributorName} className="h-full w-full rounded-full object-cover bg-black" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">{copy.readyTitle}</h2>
            <p className="mt-3 text-xs sm:text-sm text-[#cccccc] max-w-xl mx-auto leading-relaxed">
              {copy.readySub}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to={applyUrl}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-8 py-3.5 text-sm font-black text-slate-950 transition-colors shadow-lg shadow-cyan-500/25 active:scale-95"
              >
                {copy.orderConsult} <Send className="h-4 w-4" />
              </Link>
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" /> {copy.whatsappBtn}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
