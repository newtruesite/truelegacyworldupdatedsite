import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  BatteryCharging,
  Brain,
  ChevronDown,
  Clock,
  ExternalLink,
  Globe2,
  HeartPulse,
  MessageCircle,
  Microscope,
  PlayCircle,
  Radio,
  Send,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { Footer } from '@/components/layout/Footer'
import { useLocaleContext, type Locale } from '@/contexts/LocaleContext'
import { PRODUCT_VIDEOS } from '@/lib/productVideos'
import { getLeaderPortrait, getPublicDistributors, type PublicDistributor } from '@/lib/crm'

interface EmguardeLandingPageProps {
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
  pillarsBadge: string
  pillarsTitle: string
  pillarsSubtitle: string
  pillars: FeaturePillar[]
  clinicalBadge: string
  clinicalTitle: string
  clinicalSubtitle: string
  clinicalStudies: ClinicalStudy[]
  specTitle: string
  specSubtitle: string
  specs: { label: string; value: string }[]
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
    heroBadge: 'Patented US Technology (US-12539416)',
    heroTitle1: 'Protect Your Biology.',
    heroTitleAccent: 'Harmonize Your Environment.',
    heroBody: 'Your close-body personal protection device designed for continuous body protection in high electrosmog environments. Clinically validated, universally portable, and completely non-disruptive to wireless connectivity.',
    sharedBy: 'Personal Presentation Shared By',
    leaderDefaultTitle: 'True Legacy Leader',
    connect: 'Connect',
    demoBadge: 'Featured Product Demonstration',
    demoTitle: 'The Enagic emGuarde™ In-Depth Overview',
    demoSubtitle: 'Discover the scientific breakthrough, UTAR human clinical trials, and close-body frequency harmonization.',
    demoFooter: 'Complete Enagic emGuarde™ Personal Defense Presentation',
    watchTime: 'Watch time: ~8 minutes',
    pillarsBadge: 'Engineered For Modern Life',
    pillarsTitle: '5 Pillars of Close-Body EMF Protection',
    pillarsSubtitle: 'Designed to accompany you seamlessly through modern electromagnetic environments without lifestyle disruption.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Portability',
        subtitle: 'Take It Everywhere You Go',
        desc: 'Ultra-compact personal close-body design that fits effortlessly into pockets, purses, backpacks, or gym wear.',
        tag: 'CLOSE-BODY MOBILITY',
        stat: 'Everywhere',
        statLabel: 'Pocket & Travel Ready',
      },
      {
        icon: Microscope,
        title: 'Clinically Backed',
        subtitle: 'University Human Trials (UTAR)',
        desc: 'Validated by human clinical trials demonstrating measurable biological improvements in cellular health in just 3 days.',
        tag: 'PEER-VALIDATED',
        stat: '3 Days',
        statLabel: 'Measurable Biological Results',
      },
      {
        icon: ShieldCheck,
        title: 'Strong Coverage',
        subtitle: 'Powerful Harmonic Field',
        desc: 'Emits a stable, consistent personal protective zone that suppresses environmental high-frequency electrosmog noise.',
        tag: 'CONTINUOUS ENVELOPE',
        stat: '360°',
        statLabel: 'Close-Body Protective Field',
      },
      {
        icon: Award,
        title: 'Patented Technology',
        subtitle: 'US Patent US-12539416',
        desc: 'Proprietary harmonic resonance circuit engineered to harmonize electrosmog radiation without disrupting device connectivity.',
        tag: 'US-12539416',
        stat: 'Patented',
        statLabel: 'Harmonic Technology',
      },
      {
        icon: BatteryCharging,
        title: 'Up to 72 Hours',
        subtitle: 'Certified Lithium Battery',
        desc: 'Certified high-capacity lithium battery providing long-lasting, multi-day silent defense on a single USB charge.',
        tag: 'LONG-LASTING POWER',
        stat: 'Up to 72h',
        statLabel: 'Continuous Battery Life',
      },
    ],
    clinicalBadge: 'UTAR University Clinical Validation',
    clinicalTitle: 'Human Clinical Trial Results (3 Days)',
    clinicalSubtitle: 'Evaluated in human clinical trials conducted by Universiti Tunku Abdul Rahman (UTAR). Measurable biological response within 72 hours.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'REDUCTION',
        title: 'Blood Cell Aggregation (Rouleaux Formation)',
        subtitle: 'Figure 2.1 Pre-intervention vs Figure 2.2 Post-intervention',
        desc: 'Significant reduction in clustered red blood cells, promoting smoother circulation, improved microvascular blood flow, and optimal cellular oxygen delivery.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'IMPROVEMENT',
        title: 'Improvement in EHS Symptoms',
        subtitle: 'Electromagnetic Hypersensitivity Syndrome',
        desc: '70.3% of individuals suffering from electromagnetic hypersensitivity reported noticeable symptom relief from fatigue, brain fog, and electromagnetic radiation stress.',
        icon: UserCheck,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'INCREASE',
        title: 'Elevation in Serotonin Levels',
        subtitle: 'Neurotransmitter & Mood Regulation',
        desc: 'Demonstrated a 59.5% increase in serotonin, directly supporting mood stability, deeper sleep cycles, appetite regulation, and balanced cognitive performance.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'REDUCTION',
        title: 'Heat Shock Protein (HSP-27) Reduction',
        subtitle: 'Cellular Stress Biomarker',
        desc: 'Measurable 42.5% decrease in HSP-27, a key stress protein released by cells in response to physiological strain, heat shock, and environmental oxidative stress.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specTitle: 'Device Specifications & Certifications',
    specSubtitle: 'Precision engineering manufactured to the highest international quality and safety benchmarks.',
    specs: [
      { label: 'Technology Patent', value: 'US-12539416' },
      { label: 'Clinical Institution', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Battery Capacity', value: 'Up to 72 Hours Continuous Protection' },
      { label: 'Signal Impact', value: '0% Wireless Signal Blocking / Wi-Fi Safe' },
      { label: 'Global Distribution', value: 'Exclusively via Authorized Enagic Channels' },
    ],
    duoBadge: '360° Environmental Wellness Standard',
    duoTitle1: 'Harmonize Your Environment.',
    duoTitle2: 'Hydrate Your Cells.',
    duoBody: 'While emGuarde GO protects your body from ambient EMF radiation, Enagic Kangen Water provides internal cellular hydration and antioxidant defense. Discover the True Legacy Duo pairing emGuarde GO with the Leveluk K8.',
    duoExploreBtn: 'Explore The Duo Technologies',
    duoPricingBtn: 'Request emGuarde Package Pricing',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'What is The Enagic emGuarde™ and how does it protect the body?',
        a: 'The Enagic emGuarde™ is your close-body personal protection device designed for continuous protection in high electrosmog environments. Powered by patented US technology (US-12539416), it harmonizes environmental electromagnetic noise to support biological balance and well-being.',
      },
      {
        q: 'What university clinical research backs emGuarde?',
        a: 'emGuarde has been evaluated in human clinical trials conducted by Universiti Tunku Abdul Rahman (UTAR), demonstrating a 50.7% reduction in blood cell aggregation, a 70.3% improvement in EHS symptoms, a 59.5% increase in serotonin levels, and a 42.5% reduction in cellular stress protein (HSP-27) within 3 days.',
      },
      {
        q: 'Does emGuarde interfere with Wi-Fi, phone reception, or Bluetooth?',
        a: 'No. emGuarde harmonizes the ambient electrosmog noise affecting human biology without blocking or degrading wireless signals. Your smartphones, laptops, and Wi-Fi networks continue to function at full signal and speed.',
      },
      {
        q: 'How long does the battery last on the personal emGuarde?',
        a: 'The personal emGuarde is equipped with a certified lithium battery that delivers up to 72 hours of continuous close-body protection on a single charge.',
      },
      {
        q: 'How does emGuarde pair with Kangen Water in the True Legacy Duo?',
        a: 'True Legacy advocates a complete 360° wellness standard: The Enagic emGuarde™ provides external close-body environmental defense against electrosmog, while Enagic Kangen Water provides internal cellular hydration and antioxidant protection.',
      },
    ],
    readyTitle: 'Ready to Experience emGuarde™ Protection?',
    readyBodyPrefix: 'Connect directly with',
    readyBodySuffix: 'to receive full availability details, package pricing, and global delivery schedules.',
    ctaConsultation: 'Request emGuarde Consultation',
    ctaWhatsApp: 'Chat on WhatsApp',
  },
  es: {
    backToProfile: 'Volver al Perfil',
    back: 'Atrás',
    requestInfo: 'Pedir Información',
    heroBadge: 'Tecnología Patentada en EE. UU. (US-12539416)',
    heroTitle1: 'Protege Tu Biología.',
    heroTitleAccent: 'Armoniza Tu Entorno.',
    heroBody: 'Tu dispositivo personal de protección cercana diseñado para defensa corporal continua en entornos con alta contaminación electromagnética. Clínicamente validado, ultraportátil y sin interferencias en señales inalámbricas.',
    sharedBy: 'Presentación Personal Compartida Por',
    leaderDefaultTitle: 'Líder True Legacy',
    connect: 'Conectar',
    demoBadge: 'Demostración Destacada del Producto',
    demoTitle: 'Visión Detallada de Enagic emGuarde™',
    demoSubtitle: 'Descubre el avance científico, los ensayos clínicos en humanos de UTAR y la armonización de frecuencias.',
    demoFooter: 'Presentación Completa de Defensa Personal Enagic emGuarde™',
    watchTime: 'Tiempo de video: ~8 minutos',
    pillarsBadge: 'Diseñado Para la Vida Moderna',
    pillarsTitle: '5 Pilares de Protección CEM Personal',
    pillarsSubtitle: 'Creado para acompañarte en tus entornos cotidianos con total comodidad y sin alterar tu estilo de vida.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Portabilidad',
        subtitle: 'Llévalo a Donde Vayas',
        desc: 'Diseño ultracompacto que cabe fácilmente en bolsillos, carteras, mochilas o ropa deportiva.',
        tag: 'MOVILIDAD CERCANA',
        stat: 'En Todos Lados',
        statLabel: 'Listo para Viajes y Uso Diario',
      },
      {
        icon: Microscope,
        title: 'Respaldo Clínico',
        subtitle: 'Ensayos Clínicos en Humanos (UTAR)',
        desc: 'Validado por ensayos clínicos que demuestran mejoras biológicas medibles en salud celular en solo 3 días.',
        tag: 'VALIDACIÓN MÉDICA',
        stat: '3 Días',
        statLabel: 'Resultados Biológicos Medibles',
      },
      {
        icon: ShieldCheck,
        title: 'Amplia Cobertura',
        subtitle: 'Campo Armónico Potente',
        desc: 'Emite una zona protectora estable que suprime el ruido de la radiación electromagnética de alta frecuencia.',
        tag: 'ENVOLVENTE CONTINUA',
        stat: '360°',
        statLabel: 'Campo Protector Cercano',
      },
      {
        icon: Award,
        title: 'Tecnología Patentada',
        subtitle: 'Patente de EE. UU. US-12539416',
        desc: 'Circuito propietario de resonancia armónica diseñado para armonizar la radiación sin interrumpir la conectividad.',
        tag: 'US-12539416',
        stat: 'Patentado',
        statLabel: 'Tecnología Armónica',
      },
      {
        icon: BatteryCharging,
        title: 'Hasta 72 Horas',
        subtitle: 'Batería de Litio Certificada',
        desc: 'Batería de litio de alta capacidad que ofrece defensa silenciosa durante días con una sola carga USB.',
        tag: 'ENERGÍA PROLONGADA',
        stat: 'Hasta 72h',
        statLabel: 'Duración Continua de Batería',
      },
    ],
    clinicalBadge: 'Validación Clínica Universitaria UTAR',
    clinicalTitle: 'Resultados de Ensayos en Humanos (3 Días)',
    clinicalSubtitle: 'Evaluado en ensayos clínicos en humanos por la Universiti Tunku Abdul Rahman (UTAR). Respuesta biológica cuantificable en 72 horas.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'REDUCCIÓN',
        title: 'Agregación de Glóbulos Rojos (Efecto Rouleaux)',
        subtitle: 'Figura 2.1 Pre-intervención vs Figura 2.2 Post-intervención',
        desc: 'Reducción significativa de glóbulos rojos aglomerados, promoviendo una circulación más fluida y oxigenación celular óptima.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'MEJORA',
        title: 'Alivio de Síntomas de EHS',
        subtitle: 'Síndrome de Hipersensibilidad Electromagnética',
        desc: 'El 70.3% de personas con hipersensibilidad electromagnética reportaron alivio notable de fatiga, niebla mental y estrés por radiación.',
        icon: UserCheck,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'AUMENTO',
        title: 'Elevación de Niveles de Serotonina',
        subtitle: 'Regulación de Estado de Ánimo y Neurotransmisores',
        desc: 'Demostró un aumento del 59.5% en serotonina, apoyando directamente la estabilidad del ánimo, ciclos de sueño más profundos y enfoque mental.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'REDUCCIÓN',
        title: 'Reducción de Proteína de Estrés (HSP-27)',
        subtitle: 'Biomarcador de Estrés Celular',
        desc: 'Disminución cuantificable del 42.5% en HSP-27, proteína liberada por las células en respuesta al estrés oxidativo y fisiológico ambiental.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specTitle: 'Especificaciones del Dispositivo y Certificaciones',
    specSubtitle: 'Ingeniería de precisión fabricada bajo los más altos estándares internacionales de calidad y seguridad.',
    specs: [
      { label: 'Patente de Tecnología', value: 'US-12539416' },
      { label: 'Institución de Ensayos', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Capacidad de Batería', value: 'Hasta 72 horas de protección continua' },
      { label: 'Impacto en Señal', value: '0% de bloqueo de señal inalámbrica / Seguro con Wi-Fi' },
      { label: 'Distribución Global', value: 'Exclusivamente a través de canales oficiales Enagic' },
    ],
    duoBadge: 'Estándar de Bienestar Ambiental 360°',
    duoTitle1: 'Armoniza Tu Entorno.',
    duoTitle2: 'Hidrata Tus Células.',
    duoBody: 'Mientras emGuarde GO protege tu cuerpo de la radiación CEM ambiental, Aqua Kangen de Enagic proporciona hidratación celular interna y defensa antioxidante. Conoce el True Legacy Duo que une emGuarde GO con el Leveluk K8.',
    duoExploreBtn: 'Explorar las Tecnologías Duo',
    duoPricingBtn: 'Solicitar Precios del Paquete emGuarde',
    faqTitle: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Qué es The Enagic emGuarde™ y cómo protege el cuerpo?',
        a: 'The Enagic emGuarde™ es tu dispositivo personal de protección cercana diseñado para defensa continua en entornos con alta radiación electromagnética. Con tecnología patentada en EE. UU. (US-12539416), armoniza el ruido electromagnético ambiental para apoyar el equilibrio biológico.',
      },
      {
        q: '¿Qué investigación clínica universitaria respalda a emGuarde?',
        a: 'emGuarde ha sido evaluado en ensayos clínicos en humanos por la Universiti Tunku Abdul Rahman (UTAR), demostrando una reducción del 50.7% en agregación de glóbulos rojos, 70.3% de mejora en síntomas de EHS, 59.5% de incremento en serotonina y 42.5% de reducción en proteína de estrés celular (HSP-27) en 3 días.',
      },
      {
        q: '¿Interfiere emGuarde con el Wi-Fi, la recepción telefónica o el Bluetooth?',
        a: 'No. emGuarde armoniza el ruido electromagnético ambiental que afecta a la biología humana sin bloquear ni degradar las señales inalámbricas. Tus teléfonos, computadoras y redes Wi-Fi siguen funcionando a máxima velocidad.',
      },
      {
        q: '¿Cuánto dura la batería del emGuarde personal?',
        a: 'El emGuarde personal está equipado con una batería de litio certificada que brinda hasta 72 horas de protección continua con una sola carga.',
      },
      {
        q: '¿Cómo se combina emGuarde con Aqua Kangen en el True Legacy Duo?',
        a: 'True Legacy promueve un estándar de bienestar integral en 360°: emGuarde brinda defensa ambiental externa contra el electrosmog, mientras Aqua Kangen aporta hidratación celular interna y poder antioxidante.',
      },
    ],
    readyTitle: '¿Listo para Experimentar la Protección de emGuarde™?',
    readyBodyPrefix: 'Conecta directamente con',
    readyBodySuffix: 'para consultar disponibilidad, precios de paquetes y opciones de entrega internacional.',
    ctaConsultation: 'Solicitar Consulta de emGuarde',
    ctaWhatsApp: 'Chatear por WhatsApp',
  },
  fr: {
    backToProfile: 'Retour au Profil',
    back: 'Retour',
    requestInfo: 'Demander des Infos',
    heroBadge: 'Technologie Brevetée aux USA (US-12539416)',
    heroTitle1: 'Protégez Votre Biologie.',
    heroTitleAccent: 'Harmonisez Votre Environnement.',
    heroBody: 'Votre dispositif personnel de protection rapprochée conçu pour une défense continue dans les environnements à fort smog électromagnétique. Validé cliniquement, universellement portable et sans blocage des signaux sans fil.',
    sharedBy: 'Présentation Personnelle Partagée Par',
    leaderDefaultTitle: 'Leader True Legacy',
    connect: 'Contacter',
    demoBadge: 'Démonstration Produit Phare',
    demoTitle: 'Présentation Approfondie d’Enagic emGuarde™',
    demoSubtitle: 'Découvrez l’innovation scientifique, les essais cliniques humains de l’UTAR et l’harmonisation des fréquences.',
    demoFooter: 'Présentation Complète de la Défense Personnelle Enagic emGuarde™',
    watchTime: 'Temps de vidéo : ~8 minutes',
    pillarsBadge: 'Conçu Pour la Vie Moderne',
    pillarsTitle: '5 Piliers de la Protection Rapprochée CEM',
    pillarsSubtitle: 'Conçu pour vous accompagner naturellement au quotidien sans perturber votre mode de vie.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Portabilité',
        subtitle: 'Emportez-le Partout avec Vous',
        desc: 'Format ultra-compact se glissant facilement dans une poche, un sac à main, un sac à dos ou une tenue de sport.',
        tag: 'MOBILITÉ RAPPROCHÉE',
        stat: 'Partout',
        statLabel: 'Prêt pour les Voyages et le Quotidien',
      },
      {
        icon: Microscope,
        title: 'Validation Clinique',
        subtitle: 'Essais Cliniques Humains (UTAR)',
        desc: 'Validé par des essais cliniques universitaires montrant des améliorations biologiques notables en seulement 3 jours.',
        tag: 'VALIDATION MÉDICALE',
        stat: '3 Jours',
        statLabel: 'Résultats Biologiques Mesurables',
      },
      {
        icon: ShieldCheck,
        title: 'Forte Couverture',
        subtitle: 'Champ Harmonique Puissant',
        desc: 'Émet une zone de protection stable atténuant le bruit du smog électromagnétique haute fréquence.',
        tag: 'ENVELOPPE CONTINUE',
        stat: '360°',
        statLabel: 'Champ Protecteur Rapproché',
      },
      {
        icon: Award,
        title: 'Technologie Brevetée',
        subtitle: 'Brevet US US-12539416',
        desc: 'Circuit de résonance harmonique exclusif conçu pour harmoniser les rayonnements sans couper les connexions sans fil.',
        tag: 'US-12539416',
        stat: 'Breveté',
        statLabel: 'Technologie Harmonique',
      },
      {
        icon: BatteryCharging,
        title: 'Jusqu’à 72 Heures',
        subtitle: 'Batterie Lithium Certifiée',
        desc: 'Batterie lithium haute capacité assurant plusieurs jours de protection silencieuse sur une seule charge USB.',
        tag: 'AUTONOMIE PROLONGÉE',
        stat: 'Jusqu’à 72h',
        statLabel: 'Autonomie Continue',
      },
    ],
    clinicalBadge: 'Validation Clinique Universitaire UTAR',
    clinicalTitle: 'Résultats des Essais sur l’Humain (3 Jours)',
    clinicalSubtitle: 'Évalué lors d’essais cliniques par l’Universiti Tunku Abdul Rahman (UTAR). Réponse biologique mesurable en 72 heures.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'RÉDUCTION',
        title: 'Agrégation des Globules Rouges (Rouleaux)',
        subtitle: 'Figure 2.1 Avant intervention vs Figure 2.2 Après intervention',
        desc: 'Réduction marquée des hématies agglutinées, favorisant une circulation fluide et une oxygénation cellulaire optimale.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'AMÉLIORATION',
        title: 'Soulagement des Symptômes d’EHS',
        subtitle: 'Syndrome d’Hypersensibilité Électromagnétique',
        desc: '70.3% des sujets souffrant d’EHS ont constaté un soulagement notable de la fatigue, du brouillard mental et du stress électromagnétique.',
        icon: UserCheck,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'AUGMENTATION',
        title: 'Hausse des Niveaux de Sérotonine',
        subtitle: 'Régulation de l’Humeur et Neurotransmetteurs',
        desc: 'Augmentation démontrée de 59.5% de la sérotonine, favorisant la stabilité de l’humeur, un sommeil plus profond et la clarté d’esprit.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'RÉDUCTION',
        title: 'Baisse des Protéines de Stress (HSP-27)',
        subtitle: 'Biomarqueur de Stress Cellulaire',
        desc: 'Diminution mesurable de 42.5% de la HSP-27, protéine libérée par les cellules en réaction au stress oxydatif et environnemental.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specTitle: 'Spécifications de l’Appareil & Certifications',
    specSubtitle: 'Ingénierie de précision fabriquée selon les standards internationaux de qualité et de sécurité les plus stricts.',
    specs: [
      { label: 'Brevet Technologique', value: 'US-12539416' },
      { label: 'Institution Clinique', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Capacité Batterie', value: 'Jusqu’à 72 heures de protection continue' },
      { label: 'Impact Réseau', value: '0% de blocage réseau / 100% compatible Wi-Fi' },
      { label: 'Distribution Globale', value: 'Exclusivement via les réseaux agréés Enagic' },
    ],
    duoBadge: 'Standard de Bien-Être Environnemental 360°',
    duoTitle1: 'Harmonisez Votre Environnement.',
    duoTitle2: 'Hydratez Vos Cellules.',
    duoBody: 'Tandis qu’emGuarde GO protège votre corps des rayonnements CEM, l’eau Kangen d’Enagic assure l’hydratation cellulaire interne et l’apport d’antioxydants. Découvrez le pack True Legacy Duo associant emGuarde GO au Leveluk K8.',
    duoExploreBtn: 'Explorer les Technologies Duo',
    duoPricingBtn: 'Demander les Tarifs du Pack emGuarde',
    faqTitle: 'Foire Aux Questions',
    faqs: [
      {
        q: 'Qu’est-ce qu’Enagic emGuarde™ et comment protège-t-il le corps ?',
        a: 'The Enagic emGuarde™ est votre dispositif personnel de protection rapprochée conçu pour une défense continue dans les environnements à fort smog électromagnétique. Doté d’une technologie brevetée aux USA (US-12539416), il harmonise le bruit électromagnétique pour soutenir l’équilibre biologique.',
      },
      {
        q: 'Quelles recherches cliniques universitaires soutiennent emGuarde ?',
        a: 'emGuarde a été évalué lors d’essais cliniques sur l’humain par l’UTAR, démontrant une baisse de 50.7% de l’agrégation des hématies, 70.3% d’amélioration des symptômes d’EHS, 59.5% de hausse de la sérotonine et 42.5% de réduction de la protéine de stress (HSP-27) en 3 jours.',
      },
      {
        q: 'emGuarde perturbe-t-il le Wi-Fi, la téléphonie ou le Bluetooth ?',
        a: 'Non. emGuarde harmonise le bruit électromagnétique ambiant qui affecte la biologie humaine sans bloquer ni dégrader les signaux sans fil. Vos smartphones, ordinateurs portables et réseaux Wi-Fi conservent leur débit maximal.',
      },
      {
        q: 'Combien de temps dure la batterie d’emGuarde ?',
        a: 'emGuarde personnel est équipé d’une batterie lithium certifiée offrant jusqu’à 72 heures de protection continue sur une seule charge.',
      },
      {
        q: 'Comment emGuarde s’associe-t-il à l’eau Kangen dans le True Legacy Duo ?',
        a: 'True Legacy propose un standard de bien-être à 360° : emGuarde assure la défense environnementale externe contre l’électrosmog, tandis que l’eau Kangen procure une hydratation cellulaire interne antioxydante.',
      },
    ],
    readyTitle: 'Prêt à Découvrir la Protection emGuarde™ ?',
    readyBodyPrefix: 'Échangez directement avec',
    readyBodySuffix: 'pour connaître les disponibilités, les tarifs des packs et les options de livraison internationale.',
    ctaConsultation: 'Demander une Consultation emGuarde',
    ctaWhatsApp: 'Discuter sur WhatsApp',
  },
  pt: {
    backToProfile: 'Voltar ao Perfil',
    back: 'Voltar',
    requestInfo: 'Solicitar Informações',
    heroBadge: 'Tecnologia Patenteada nos EUA (US-12539416)',
    heroTitle1: 'Proteja Sua Biologia.',
    heroTitleAccent: 'Harmonize Seu Ambiente.',
    heroBody: 'Seu dispositivo pessoal de proteção corporal contínua para ambientes com alta poluição eletromagnética. Clinicamente validado, ultraportátil e sem qualquer interferência no sinal sem fio.',
    sharedBy: 'Apresentação Pessoal Compartilhada Por',
    leaderDefaultTitle: 'Líder True Legacy',
    connect: 'Conectar',
    demoBadge: 'Demonstração em Destaque do Produto',
    demoTitle: 'Apresentação Completa do Enagic emGuarde™',
    demoSubtitle: 'Descubra a inovação científica, os estudos clínicos em humanos da UTAR e a harmonização de frequências.',
    demoFooter: 'Visão Geral Completa de Defesa Pessoal Enagic emGuarde™',
    watchTime: 'Tempo de vídeo: ~8 minutos',
    pillarsBadge: 'Projetado Para a Vida Moderna',
    pillarsTitle: '5 Pilares de Proteção Pessoal contra Radiação CEM',
    pillarsSubtitle: 'Feito para acompanhar você no dia a dia com conforto total e sem interferir no seu estilo de vida.',
    pillars: [
      {
        icon: Smartphone,
        title: 'Portabilidade',
        subtitle: 'Leve Para Onde Você For',
        desc: 'Design ultracompacto que cabe perfeitamente em bolsos, bolsas, mochilas ou roupas de academia.',
        tag: 'MOBILIDADE PESSOAL',
        stat: 'Em Qualquer Lugar',
        statLabel: 'Pronto para Viagens e Rotina',
      },
      {
        icon: Microscope,
        title: 'Validação Clínica',
        subtitle: 'Ensaios Clínicos em Humanos (UTAR)',
        desc: 'Validado por ensaios clínicos universitários demonstrando melhorias celulares mensuráveis em apenas 3 dias.',
        tag: 'VALIDAÇÃO MÉDICA',
        stat: '3 Dias',
        statLabel: 'Resultados Biológicos Mensuráveis',
      },
      {
        icon: ShieldCheck,
        title: 'Ampla Cobertura',
        subtitle: 'Campo Harmônico Potente',
        desc: 'Emite uma zona de proteção consistente que neutraliza o ruído do smog eletromagnético de alta frequência.',
        tag: 'ENVELOPE CONTÍNUO',
        stat: '360°',
        statLabel: 'Campo Protetor Pessoal',
      },
      {
        icon: Award,
        title: 'Tecnologia Patenteada',
        subtitle: 'Patente dos EUA US-12539416',
        desc: 'Circuito proprietário de ressonância harmônica que harmoniza a radiação sem afetar a conectividade dos aparelhos.',
        tag: 'US-12539416',
        stat: 'Patenteado',
        statLabel: 'Tecnologia Harmônica',
      },
      {
        icon: BatteryCharging,
        title: 'Até 72 Horas',
        subtitle: 'Bateria de Lítio Certificada',
        desc: 'Bateria de lítio de alta capacidade que oferece proteção silenciosa por dias com apenas uma recarga USB.',
        tag: 'ENERGIA PROLONGADA',
        stat: 'Até 72h',
        statLabel: 'Duração Contínua de Bateria',
      },
    ],
    clinicalBadge: 'Validação Clínica Universitária UTAR',
    clinicalTitle: 'Resultados de Estudos Clínicos (3 Dias)',
    clinicalSubtitle: 'Avaliado em ensaios clínicos em humanos pela Universiti Tunku Abdul Rahman (UTAR). Resposta biológica quantificável em 72 horas.',
    clinicalStudies: [
      {
        metric: '50.7%',
        change: 'REDUÇÃO',
        title: 'Agregação de Glóbulos Vermelhos (Rouleaux)',
        subtitle: 'Figura 2.1 Antes da intervenção vs Figura 2.2 Após intervenção',
        desc: 'Redução expressiva de hemácias agrupadas, promovendo circulação mais fluida e oxigenação celular ideal.',
        icon: HeartPulse,
        color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300',
      },
      {
        metric: '70.3%',
        change: 'MELHORIA',
        title: 'Alívio dos Sintomas de EHS',
        subtitle: 'Síndrome de Hipersensibilidade Eletromagnética',
        desc: '70.3% das pessoas com hipersensibilidade relataram alívio perceptível de fadiga, névoa mental e estresse por radiação.',
        icon: UserCheck,
        color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300',
      },
      {
        metric: '59.5%',
        change: 'AUMENTO',
        title: 'Elevação nos Níveis de Serotonina',
        subtitle: 'Regulação do Humor e Neurotransmissores',
        desc: 'Aumento comprovado de 59.5% na serotonina, favorecendo equilíbrio de humor, sono mais reparador e foco mental.',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300',
      },
      {
        metric: '42.5%',
        change: 'REDUÇÃO',
        title: 'Redução de Proteína de Estresse (HSP-27)',
        subtitle: 'Biomarcador de Estresse Celular',
        desc: 'Diminuição mensurável de 42.5% em HSP-27, proteína liberada pelas células em resposta a sobrecargas fisiológicas e estresse oxidativo.',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300',
      },
    ],
    specTitle: 'Especificações do Aparelho & Certificações',
    specSubtitle: 'Engenharia de precisão fabricada com os mais altos padrões internacionais de qualidade e segurança.',
    specs: [
      { label: 'Patente da Tecnologia', value: 'US-12539416' },
      { label: 'Instituição Clínica', value: 'Universiti Tunku Abdul Rahman (UTAR)' },
      { label: 'Capacidade da Bateria', value: 'Até 72 horas de proteção contínua' },
      { label: 'Impacto no Sinal', value: '0% de interferência / 100% seguro com Wi-Fi' },
      { label: 'Distribuição Global', value: 'Exclusivamente por canais oficiais Enagic' },
    ],
    duoBadge: 'Padrão de Bem-Estar Ambiental 360°',
    duoTitle1: 'Harmonize Seu Ambiente.',
    duoTitle2: 'Hidrate Suas Células.',
    duoBody: 'Enquanto o emGuarde GO protege seu corpo contra a radiação eletromagnética, a Água Kangen da Enagic fornece hidratação celular e poder antioxidante. Descubra o True Legacy Duo combinando o emGuarde GO com o Leveluk K8.',
    duoExploreBtn: 'Explorar as Tecnologias Duo',
    duoPricingBtn: 'Solicitar Preços do Pacote emGuarde',
    faqTitle: 'Perguntas Frequentes',
    faqs: [
      {
        q: 'O que é o The Enagic emGuarde™ e como ele protege o corpo?',
        a: 'O The Enagic emGuarde™ é seu dispositivo pessoal de proteção aproximada projetado para defesa contínua contra electrosmog. Com tecnologia patenteada nos EUA (US-12539416), ele harmoniza o ruído eletromagnético para favorecer o equilíbrio biológico.',
      },
      {
        q: 'Qual pesquisa clínica universitária comprova o emGuarde?',
        a: 'O emGuarde foi avaliado em ensaios clínicos em humanos pela UTAR, demonstrando redução de 50.7% na aglomeração de hemácias, 70.3% de melhora em sintomas de EHS, 59.5% de aumento de serotonina e 42.5% de diminuição da proteína de estresse (HSP-27) em 3 dias.',
      },
      {
        q: 'O emGuarde interfere no Wi-Fi, telefone ou Bluetooth?',
        a: 'Não. O emGuarde harmoniza o ruído eletromagnético ambiente que afeta a biologia humana sem bloquear nem degradar os sinais sem fio. Seus celulares, computadores e redes Wi-Fi continuam operando na velocidade máxima.',
      },
      {
        q: 'Quanto tempo dura a bateria do emGuarde?',
        a: 'O emGuarde pessoal é equipado com bateria de lítio certificada que proporciona até 72 horas de proteção contínua com uma única recarga.',
      },
      {
        q: 'Como o emGuarde se combina com a Água Kangen no True Legacy Duo?',
        a: 'A True Legacy promove um bem-estar integral em 360°: o emGuarde oferece defesa ambiental externa contra a radiação, enquanto a Água Kangen proporciona hidratação celular interna e proteção antioxidante.',
      },
    ],
    readyTitle: 'Pronto para Experimentar a Proteção emGuarde™?',
    readyBodyPrefix: 'Conecte-se diretamente com',
    readyBodySuffix: 'para consultar disponibilidade, valores de pacotes e detalhes de envio internacional.',
    ctaConsultation: 'Solicitar Consulta emGuarde',
    ctaWhatsApp: 'Conversar no WhatsApp',
  },
}

export function EmguardeLandingPage({ profile: propProfile, distributorSlug }: EmguardeLandingPageProps) {
  const { locale, setLocale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(propProfile)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedVideoLang, setSelectedVideoLang] = useState<Locale>(locale)

  const copy = I18N[locale] || I18N.en
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

  const rawVideoUrl = PRODUCT_VIDEOS.emguardeGo[selectedVideoLang] || PRODUCT_VIDEOS.emguardeGo.en
  const embedVideoUrl = useMemo(() => toEmbedUrl(rawVideoUrl), [rawVideoUrl])

  const applyUrl = `/apply?ref=${profile?.referral_code || effectiveSlug}&interest=duo&source=emguarde`
  const duoUrl = `/d/${effectiveSlug}/duo`

  const whatsappNumber = profile?.phone?.replace(/\D/g, '') || ''
  const getWhatsAppMessage = () => {
    if (locale === 'es') {
      return `Hola ${distributorName}, estoy revisando la página de Enagic emGuarde en True Legacy y me gustaría hacerte unas preguntas sobre disponibilidad y opciones del paquete.`
    }
    if (locale === 'fr') {
      return `Bonjour ${distributorName}, je consulte la page Enagic emGuarde sur True Legacy et j'aimerais vous poser quelques questions sur la disponibilité et les tarifs.`
    }
    if (locale === 'pt') {
      return `Olá ${distributorName}, estou visualizando a página do Enagic emGuarde na True Legacy e gostaria de tirar algumas dúvidas sobre disponibilidade e pacotes.`
    }
    return `Hi ${distributorName}, I'm reviewing The Enagic emGuarde page on True Legacy and would love to ask you some questions about availability and personal protection package options.`
  }

  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMessage())}` : null

  return (
    <div className="page-wrapper min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`The Enagic emGuarde™ · Close-Body Personal Protection Device · ${distributorName}`}
        description={`${copy.heroTitle1} ${copy.heroTitleAccent} ${copy.heroBody.slice(0, 150)}...`}
        image={leaderAvatar}
      />

      {/* Navigation Bar with 4-Language Switcher */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to={`/d/${effectiveSlug}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
              title={copy.backToProfile}
            >
              <ArrowLeft className="h-4 w-4 text-violet-400" />
              <span className="hidden xs:inline">{copy.backToProfile}</span>
              <span className="xs:hidden">{copy.back}</span>
            </Link>
            <Link to="/" className="flex items-center gap-2.5">
              <TrueLegacyLogo className="h-7 w-auto text-white" />
              <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-violet-300">
                ENAGIC emGuarde™
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 4-Language Toggle (EN, ES, FR, PT) */}
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold notranslate" translate="no">
              {(['en', 'es', 'fr', 'pt'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLocale(lang)
                    setSelectedVideoLang(lang)
                  }}
                  className={`px-2 sm:px-2.5 py-1 rounded-md transition-all uppercase tracking-wider text-[11px] sm:text-xs font-bold notranslate ${
                    locale === lang
                      ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-950 font-black shadow-md'
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                  title={`Switch to ${lang.toUpperCase()}`}
                  translate="no"
                >
                  {lang === 'en' ? 'EN' : lang === 'es' ? 'ES' : lang === 'fr' ? 'FR' : 'PT'}
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500 hover:bg-violet-400 px-3.5 sm:px-4 py-1.5 text-xs font-black text-slate-950 transition-colors shadow-md shadow-violet-500/20"
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
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-violet-300 mb-6">
            <Radio className="h-3.5 w-3.5" /> {copy.heroBadge}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]">
            {copy.heroTitle1} <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
              {copy.heroTitleAccent}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#cccccc] leading-relaxed">
            {copy.heroBody}
          </p>

          {/* Distributor Personal Card */}
          {profile && (
            <div className="mt-8 mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl text-left flex items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={leaderAvatar}
                  alt={distributorName}
                  className="h-12 w-12 rounded-full object-cover border border-violet-400/40 shrink-0 bg-black"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-violet-400">{copy.sharedBy}</p>
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
                  className="inline-flex items-center gap-1 rounded-xl bg-violet-500 hover:bg-violet-400 px-3.5 py-2 text-xs font-black text-slate-950 transition-colors shadow-md"
                >
                  {copy.connect}
                </Link>
              </div>
            </div>
          )}

          {/* VIDEO PRESENTATION SECTION WITH 4-LANGUAGE SELECTOR */}
          <div className="mt-10 sm:mt-14 mx-auto max-w-4xl rounded-3xl border border-violet-500/20 bg-gradient-to-b from-[#160d29] to-[#0d071a] p-4 sm:p-6 shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                  {copy.demoBadge}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-2">{copy.demoTitle}</h3>
                <p className="text-xs text-[#86868b]">{copy.demoSubtitle}</p>
              </div>

              {/* Language Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1 shrink-0 notranslate" translate="no">
                {(['en', 'es', 'fr', 'pt'] as const).map((lang) => {
                  const label =
                    lang === 'en'
                      ? 'English (~8m)'
                      : lang === 'es'
                        ? 'Español (~8m)'
                        : lang === 'fr'
                          ? 'Français (~8m)'
                          : 'Português (~8m)'
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedVideoLang(lang)
                        setLocale(lang)
                      }}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all notranslate ${
                        locale === lang
                          ? 'bg-violet-500 text-slate-950 font-black shadow-md'
                          : 'text-[#86868b] hover:text-white'
                      }`}
                      translate="no"
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
                  title="The Enagic emGuarde Presentation"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-[#86868b]">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <PlayCircle className="h-4 w-4 text-violet-400" /> {copy.demoFooter}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-violet-400" /> {copy.watchTime}
              </span>
            </div>
          </div>
        </section>

        {/* 5 FEATURE PILLARS */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">{copy.pillarsBadge}</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">{copy.pillarsTitle}</h2>
            <p className="mt-3 text-sm text-[#cccccc]">{copy.pillarsSubtitle}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copy.pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-violet-400/30 transition-all shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-400/10 border border-violet-400/30 text-violet-300 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                        {pillar.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white">{pillar.title}</h3>
                    <p className="text-xs font-bold text-violet-400 mt-1">{pillar.subtitle}</p>
                    <p className="mt-3 text-xs text-[#cccccc] leading-relaxed">{pillar.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-2xl font-black text-violet-300">{pillar.stat}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#86868b]">{pillar.statLabel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* UTAR CLINICAL STUDIES */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">{copy.clinicalBadge}</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">{copy.clinicalTitle}</h2>
            <p className="mt-3 text-sm text-[#cccccc]">{copy.clinicalSubtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {copy.clinicalStudies.map((study, i) => {
              const Icon = study.icon
              return (
                <div
                  key={i}
                  className={`rounded-3xl border bg-gradient-to-br ${study.color} p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-black tracking-widest uppercase">{study.change}</span>
                      </div>
                      <span className="text-3xl sm:text-4xl font-black tracking-tight">{study.metric}</span>
                    </div>

                    <h3 className="text-lg font-black text-white">{study.title}</h3>
                    <p className="text-xs font-bold opacity-80 mt-1">{study.subtitle}</p>
                    <p className="mt-4 text-xs text-[#cccccc] leading-relaxed">{study.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* TECHNICAL SPECIFICATIONS & STANDARDS */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{copy.specTitle}</h2>
              <p className="mt-2 text-xs text-[#86868b]">{copy.specSubtitle}</p>
            </div>

            <div className="divide-y divide-white/10">
              {copy.specs.map((spec, i) => (
                <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-bold text-[#86868b] uppercase tracking-wider">{spec.label}</span>
                  <span className="font-black text-white">{spec.value}</span>
                </div>
              ))}
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
          <div className="rounded-3xl border border-violet-400/30 bg-black/60 p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white">{copy.readyTitle}</h2>
            <p className="mt-3 text-xs sm:text-sm text-[#cccccc] max-w-xl mx-auto">
              {copy.readyBodyPrefix} <strong>{distributorName}</strong> {copy.readyBodySuffix}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {(profile?.purchase_links?.emguarde || profile?.purchase_links?.emguarde_original) && (
                <a
                  href={profile.purchase_links.emguarde || profile.purchase_links.emguarde_original}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-8 py-3.5 text-sm font-black text-slate-950 transition-colors shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {locale === 'es'
                    ? 'Comprar emGuarde'
                    : locale === 'fr'
                      ? 'Acheter emGuarde'
                      : locale === 'pt'
                        ? 'Comprar emGuarde'
                        : 'Buy emGuarde Now'}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <Link
                to={applyUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-8 py-3.5 text-sm font-black text-slate-950 transition-colors shadow-lg shadow-violet-500/25"
              >
                {copy.ctaConsultation} <Send className="h-4 w-4" />
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/25 active:scale-95"
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
