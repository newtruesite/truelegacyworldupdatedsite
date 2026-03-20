import { EventsTab } from "@/components/EventsTab";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  ExternalLink,
  FileText,
  Key,
  Lightbulb,
  LogOut,
  Target,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Training Module Types
type TrainingModule = {
  id: string;
  title: string;
  description: string;
  category:
    | "foundation"
    | "product"
    | "leadership"
    | "systems"
    | "prospecting"
    | "closing";
  videoUrl?: string;
  resources: Array<{
    title: string;
    url: string;
    type: "pdf" | "doc" | "template" | "video";
  }>;
  duration?: string;
  level: "beginner" | "intermediate" | "advanced";
};

// Training Modules Data
const TRAINING_MODULES: TrainingModule[] = [
  // 1. Foundation & Purpose
  {
    id: "purpose-vision",
    title: "El Poder de tu Propósito en Enagic",
    description:
      "En esta sesión, tu viaje en Enagic se vuelve personal. Redescubriremos tu Porqué, descubriremos tu propósito más profundo y elaboraremos tu Visión a 3 Años junto con una carta de tu yo del futuro. Espera una reflexión guiada, un ejercicio de visión y pasos para dar forma a tu camino hacia el liderazgo.",
    category: "foundation",
    videoUrl:
      "https://www.youtube.com/watch?v=2O7DboiJBdE&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com",
    level: "beginner",
    duration: "45 min",
    resources: [
      {
        title: "Plantilla: Carta de tu Yo del Futuro",
        url: "https://drive.google.com/file/d/1_yOHfNqi2pomD28jeqSWjpjnFy4xIlY0/view?fbclid=IwY2xjawPwpb5leHRuA2FlbQIxMABicmlkETFDWTEzdmFua3U1Wkt2Tkdoc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHptWaiPgIwt2Fz2sMptJMUjbiZqUUdZdvmXzDchAE23zyzbS5updXJAD-v2G_aem_GM5pTxCd9ro80xVn66pbGQ",
        type: "pdf",
      },
    ],
  },
  // 2. Product Mastery
  {
    id: "kangen-science",
    title: "Dominando los Productos de $10 Billones: LeveLuk y emGuarde",
    description:
      "Esta sesión te prepara para posicionar la serie LeveLuk frente a la competencia y destaca por qué emGuarde es único. Ganarás confianza en la tecnología de Enagic, sus certificaciones y aprenderás cómo las ventajas únicas de emGuarde (como mejorar el sueño y el estado de ánimo) pueden transformar tu poder de cierre.",
    category: "product",
    videoUrl: "https://youtu.be/_LcCVpKnVxk?si=1UTiKWXvUP0MHjhm",
    level: "beginner",
    duration: "60 min",
    resources: [
      {
        title: "Guía de Productos de Ionizadores Kangen",
        url: "https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf",
        type: "pdf",
      },
      {
        title: "Guía de Mantenimiento de Máquina",
        url: "https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf",
        type: "pdf",
      },
    ],
  },
  {
    id: "product-lineup",
    title: "El Sistema de 8 Puntos y Plan de Acción",
    description:
      "Analiza el programa patentado de 8 Puntos de Enagic y descubre cómo los principales líderes lo utilizan para duplicar rápido, subir de rango y construir ingresos sostenibles. Esta es la base central para expandir tu organización globalmente.",
    category: "product",
    videoUrl:
      "https://www.youtube.com/watch?v=FndRvUtZXL0&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com",
    level: "intermediate",
    duration: "60 min",
    resources: [
      {
        title: "Guía del Plan de Compensación 8-Puntos",
        url: "https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf",
        type: "pdf",
      },
      {
        title: "Hoja de Proyección a 6 Meses",
        url: "https://docs.google.com/spreadsheets/d/1zvfw-oBtkKLdSfVTquQw8J3g0ptTvBGT68weJF93MzA/edit#gid=1905539002",
        type: "doc",
      },
    ],
  },
  // 4. Leadership & Structure
  {
    id: "leadership-structure",
    title: "El Plan para Construir tu Legado con Enagic",
    description:
      "Esta sesión cambia todo. Aprenderás por qué los 8 Puntos son solo el comienzo, 6A2 es la entrada, y el verdadero legado empieza más allá. Desglosamos cómo estructurar para un crecimiento exponencial, planificar estabilidad a largo plazo y preparar el escenario para un ingreso generacional. Indispensable si buscas construir un verdadero legado.",
    category: "leadership",
    videoUrl: "https://youtu.be/Jz1LFvYTonI?si=fAbyqC4dChuIMn6t",
    level: "intermediate",
    duration: "75 min",
    resources: [
      {
        title: "Guía del Plan de Compensación",
        url: "https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf",
        type: "pdf",
      },
    ],
  },
  // 5. Systems & Funnels
  {
    id: "systems-funnels",
    title: "El Sistema para Alcanzar 6A Más Rápido (Sin Agotarte)",
    description:
      "Desglosamos el sistema True Legacy: cómo atraer a las personas adecuadas, convertirlas en líderes y escalar sin saturarte. Dominarás los pasos desde el primer contacto hasta la duplicación, construyendo un equipo que crece incluso cuando descansas.",
    category: "systems",
    videoUrl: "https://youtu.be/tL5KtgzCB74?si=C-P3B8IRwfQG32B5",
    level: "advanced",
    duration: "90 min",
    resources: [
      {
        title: "Guion de Conversación e Invitación",
        url: "https://drive.google.com/file/d/1EePq-zNaNgUPnPBdnsg_FKyUelYXZJKR/view?usp=drive_link",
        type: "doc",
      },
      {
        title: "Variaciones de Invitación por Prospecto",
        url: "https://drive.google.com/file/d/1g3k3cyhxwaKMC0a1hGSnIsXTf_U8F0op/view?usp=drive_link",
        type: "doc",
      },
      {
        title: "Plantilla de Presentación Duo",
        url: "https://drive.google.com/file/d/1983E6d1pi6GW0bKZi_6KNkaDBf7zyyNd/view?usp=drive_link",
        type: "doc",
      },
    ],
  },
  // Prospecting & Invitations
  // 6. Prospecting & Invitations
  {
    id: "prospecting-basics",
    title: "El 99% Prospecta a la Persona Equivocada (Soluciónalo en 20 Min)",
    description:
      "Si tu embudo se siente estancado, este entrenamiento es para ti. Aprenderás: Los 6 grupos objetivo, los 4 arquetipos de decisión, los Cuadrantes True Legacy para identificar quién está listo, y la Regla de las 48 Horas para crear impulso. No se trata de coleccionar contactos, sino de identificar líderes.",
    category: "prospecting",
    videoUrl:
      "https://www.youtube.com/watch?v=OAKaQqLIwmg&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com",
    level: "beginner",
    duration: "20 min",
    resources: [
      {
        title: "Dominio de la Lista de Prospectos True Legacy",
        url: "https://docs.google.com/document/d/18JD9AseUR_7gmdSbsrHXge5WqdfQhXTuvTfXOxk5hLA/edit?usp=sharing",
        type: "doc",
      },
    ],
  },
  // 7. Turn Every Presentation Into a Builder Magnet
  {
    id: "social-media-prospecting",
    title: "Convierte Cada Presentación en un Imán de Líderes",
    description:
      "Tu lenguaje determina a quién invitas. No es solo dar una gran demostración, es usar el lenguaje correcto. Aprende los 3 tipos de personas que se unen, cómo invitar según los 4 arquetipos, la psicología de alta conversión, y cómo la presentación DUO activa a los prospectos clave.",
    category: "prospecting",
    videoUrl: "https://www.youtube.com/watch?v=l8Uk9Mbegsk",
    level: "intermediate",
    duration: "90 min",
    resources: [
      {
        title: "Perfil de Arquetipos e Invitación",
        url: "https://docs.google.com/document/d/1V6WPSTj3jBQ5Ja3frJ2sZGAcOEmlm-uXpzC4JzUwqnE/edit?usp=sharing",
        type: "doc",
      },
    ],
  },
  // 8. Closing & Business Media
  {
    id: "closing-techniques",
    title: "DEJA DE HABLAR. EMPIEZA A CERRAR.",
    description:
      "El Sistema de 15 Minutos que Cierra. Desbloquea cómo guiar a los prospectos a la claridad mediante preguntas expertas y psicología de cierre. La mayoría habla demasiado, los líderes preguntan con precisión. Domina el marco de 14 minutos, las 11 preguntas clave y el cierre del 20%.",
    category: "closing",
    videoUrl:
      "https://www.youtube.com/watch?v=ie-tFol7F4Q&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fwww.truelegacyworld.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.truelegacyworld.com",
    level: "advanced",
    duration: "15 min",
    resources: [
      {
        title: "Notas del Marco de Cierre",
        url: "https://www.truelegacyworld.com/true-legacy-leadership-training",
        type: "doc",
      },
    ],
  },
  {
    id: "business-media",
    title: "Por Qué las Objeciones Son Buenas y Cómo Convertirlas en Éxitos",
    description:
      'Convierte la resistencia en claridad. Aprende las 4 categorías principales de objeciones y exactamente cómo manejar el dinero, cónyuge, tiempo, miedo y el "necesito investigar" para construir confianza.',
    category: "closing",
    videoUrl: "https://www.youtube.com/watch?v=ut9H9n9dE70",
    level: "intermediate",
    duration: "60 min",
    resources: [
      {
        title: "Notas para Manejo de Objeciones",
        url: "https://www.truelegacyworld.com/true-legacy-leadership-training",
        type: "doc",
      },
    ],
  },
  // 10. Business Media Training
  {
    id: "income-projection",
    title: "❌ Olvida las Redes Sociales — Esto es Negocio Real",
    description:
      "Entrenamiento con Eunice Seet (6A2). Deja de perseguir likes y empieza a usar los medios para construir tu negocio. Convierte tu presencia en línea en un escaparate que genera confianza, atrae a la gente correcta y trabaja 24/7. Domina tu perfil y los 3 pilares del contenido magnético.",
    category: "systems",
    videoUrl: "https://www.youtube.com/watch?v=fjD6atjMN2g",
    level: "beginner",
    duration: "45 min",
    resources: [
      {
        title: "Resumen de Liderazgo True Legacy",
        url: "https://www.truelegacyworld.com/true-legacy-leadership-training",
        type: "doc",
      },
    ],
  },
];

const CATEGORY_INFO = {
  foundation: { title: "Purpose & Vision", icon: Target, color: "cyan" },
  product: {
    title: "Product & Program Mastery",
    icon: Lightbulb,
    color: "amber",
  },
  leadership: {
    title: "Legacy & Leadership Structure",
    icon: Users,
    color: "purple",
  },
  systems: { title: "Systems & Funnels", icon: CheckCircle, color: "green" },
  prospecting: {
    title: "Prospecting & Invitations",
    icon: ExternalLink,
    color: "blue",
  },
  closing: {
    title: "Closing, Objections & Business Media",
    icon: FileText,
    color: "orange",
  },
};

// Training Module Card Component
type TrainingModuleCardProps = {
  module: TrainingModule;
  isExpanded?: boolean;
  onToggle?: () => void;
  copy: (typeof t)[keyof typeof t];
};

const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({
  module,
  isExpanded = false,
  onToggle,
  copy,
}) => {
  const categoryInfo = CATEGORY_INFO[module.category];
  const IconComponent = categoryInfo.icon;

  // Get localized title and description
  const moduleTranslation =
    copy.trainingModules?.[module.id as keyof typeof copy.trainingModules];
  const localizedTitle = moduleTranslation?.title || module.title;
  const localizedDescription =
    moduleTranslation?.description || module.description;
  const localizedResourceTitles = (moduleTranslation as { resources?: ReadonlyArray<string> } | undefined)?.resources;

  const toEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com/watch")) {
        const u = new URL(url);
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (url.includes("youtu.be/")) {
        const after = url.split("youtu.be/")[1] || "";
        const id = after.split(/[?&]/)[0];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return copy.training?.level_beginner || "Beginner";
      case "intermediate":
        return copy.training?.level_intermediate || "Intermediate";
      case "advanced":
        return copy.training?.level_advanced || "Advanced";
      default:
        return level;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="training-module-card rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-xl bg-${categoryInfo.color}-500/20 shrink-0`}
          >
            <IconComponent
              className={`w-6 h-6 text-${categoryInfo.color}-400`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="section-title text-lg mb-0">{localizedTitle}</h3>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium border ${getLevelBadgeColor(module.level)}`}
              >
                {getLevelText(module.level)}
              </span>
            </div>
            {module.duration && (
              <p className="text-slate-400 text-sm mb-2">{module.duration}</p>
            )}
          </div>
        </div>

        {module.videoUrl && (
          <div className="mb-5 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src={toEmbedUrl(module.videoUrl)}
                title={localizedTitle}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {localizedDescription}
        </p>

        {module.resources.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={onToggle}
              className="btn-secondary inline-flex items-center gap-2 flex-1 justify-center"
            >
              <Download className="w-4 h-4" />
              {copy.training?.resources || "Resources"} (
              {module.resources.length})
            </button>
          </div>
        )}

        {isExpanded && module.resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 pt-4 space-y-2"
          >
            {module.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-200 flex-1">
                  {localizedResourceTitles?.[index] ?? resource.title}
                </span>
                <span className="text-slate-500 text-xs uppercase">
                  {resource.type}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const TRAINING_PDFS = [
  {
    id: "kangen_ionizers_guide",
    category: "products",
    url: "https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf",
  },
  {
    id: "anespa_dx_guide",
    category: "products",
    url: "https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf",
  },
  {
    id: "compensation_plan_guide",
    category: "business",
    url: "https://www.enagic.com/pdf/1095/Compensation_Plan_Guide.pdf",
  },
  {
    id: "machine_care_guide",
    category: "products",
    url: "https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf",
  },
  {
    id: "kangen_ukon_guide",
    category: "products",
    url: "https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf",
  },
  {
    id: "kangen_wagyu_guide",
    category: "products",
    url: "https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf",
  },
];

export default function TrainingPage() {
  const { locale } = useLocaleContext();
  const params = useParams();
  const countrySlug = params.countrySlug;

  const [secretCode, setSecretCode] = useState("");
  const [isSecretCodeValid, setIsSecretCodeValid] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("tl_secret_code_valid") === "true",
  );
  const [secretCodeError, setSecretCodeError] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);

  const handleResetAccess = () => {
    sessionStorage.removeItem("tl_secret_code_valid");
    setIsSecretCodeValid(false);
    setSecretCode("");
  };

  const handleSecretCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode === "Truelegacyworld1!") {
      setIsSecretCodeValid(true);
      setSecretCodeError("");
      sessionStorage.setItem("tl_secret_code_valid", "true");
    } else {
      const copy = t[locale] || t.en;
      setSecretCodeError(
        copy.training?.access_error || "Incorrect code. Join the Facebook group to get the code.",
      );
    }
  };

  const [activeView, setActiveView] = useState<
    "sessions" | "guides" | "slides" | "events"
  >(() =>
    typeof window !== "undefined" && window.location.hash === "#pdf-guides"
      ? "guides"
      : "sessions",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );

  // Check if this is a LATAM training page
  const isLatamTraining =
    countrySlug &&
    ["colombia", "brazil", "mexico", "paraguay"].includes(countrySlug);

  // Get translations for current locale
  const copy = t[locale] || t.en;

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const filteredModules =
    selectedCategory === "all"
      ? TRAINING_MODULES
      : TRAINING_MODULES.filter(
          (module) => module.category === selectedCategory,
        );

  const categories = Object.keys(CATEGORY_INFO) as Array<
    keyof typeof CATEGORY_INFO
  >;

  return (
    <div className="page-wrapper" style={{ background: "#060b1e" }}>
      <SEO
        title={
          locale === "es"
            ? "Academia de Liderazgo True Legacy | Portal de Entrenamiento"
            : locale === "fr"
              ? "Académie de Leadership True Legacy | Portail de Formation"
              : "True Legacy Leadership Academy | Enagic Training Portal"
        }
        description={
          locale === "es"
            ? "Accede a la exclusiva Academia de Liderazgo True Legacy para distribuidores Enagic. Aprende el sistema de 8 puntos, dominio de productos y estrategias para construir tu legado."
            : locale === "fr"
              ? "Accédez à l'académie de leadership True Legacy pour distributeurs Enagic. Apprenez le système des 8 points, la maîtrise des produits et les stratégies de développement de votre héritage."
              : "Access the exclusive True Legacy Leadership Academy for Enagic distributors. Learn the 8-point system, product mastery, and legacy building strategies."
        }
      />
      <Navbar />
      <main className="content-wrapper">
        <AuroraBackground className="pt-24 pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {!isSecretCodeValid ? (
              <div className="max-w-md mx-auto mt-12 min-h-[400px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 text-cyan-400 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                    <Key className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {copy.training?.access_required || "Access Code Required"}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6">
                    {copy.training?.access_desc || "Enter the secret code to access training. Join our Facebook community to get the code."}
                  </p>
                  <a
                    href="https://www.facebook.com/groups/truelegacycommunity"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#1864D9] text-white text-sm font-semibold rounded-lg transition-colors mb-8"
                  >
                    {copy.training?.access_join_fb || "Join Facebook Group"}
                  </a>
                </div>

                <form onSubmit={handleSecretCodeSubmit} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder={copy.training?.access_placeholder || "Secret Code"}
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      required
                    />
                  </div>
                  {secretCodeError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {secretCodeError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 rounded-xl transition-all"
                  >
                    {copy.training?.access_unlock || "Unlock Training"}
                  </button>
                </form>
              </div>
            ) : (
              <div ref={contentRef}>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleResetAccess}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />{" "}
                    {copy.training?.access_reset || "Reset access"}
                  </button>
                </div>
                {/* Hero Section */}
                <div className="text-center mb-12">
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-tl-gold opacity-80"
                  >
                    {copy.training?.academy || "True Legacy Leadership Academy"}
                    {isLatamTraining && (
                      <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-medium">
                        LATAM
                      </span>
                    )}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="page-hero-title mb-4"
                  >
                    {copy.training?.hero_title || "Master Your Enagic Business"}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed"
                  >
                    {copy.training?.hero_subtitle ||
                      "Complete training system designed to take you from beginner to 6A leader. Learn from proven strategies and build your legacy business with confidence."}
                  </motion.p>
                </div>

                {/* Sessions/Guides/Spanish Slides Toggle */}
                <div className="mb-8">
                  <div className="flex justify-center">
                    <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                      <button
                        onClick={() => setActiveView("sessions")}
                        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeView === "sessions"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {copy.training?.sessions_tab || "Training Sessions"}
                      </button>
                      <button
                        onClick={() => setActiveView("guides")}
                        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeView === "guides"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {copy.training?.guides_tab || "Informational Guides"}
                      </button>
                      {locale === "es" && (
                        <button
                          onClick={() => setActiveView("slides")}
                          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                            activeView === "slides"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg"
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          Presentación True Legacy
                        </button>
                      )}
                      <button
                        onClick={() => setActiveView("events")}
                        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeView === "events"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {copy.training?.events_tab || "Upcoming Events"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Filter - Only show for sessions view */}
                {activeView === "sessions" && (
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === "all"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {copy.training?.all_modules || "All Modules"} (
                        {TRAINING_MODULES.length})
                      </button>
                      {categories.map((category) => {
                        const info = CATEGORY_INFO[category];
                        const count = TRAINING_MODULES.filter(
                          (m) => m.category === category,
                        ).length;
                        const categoryTitle =
                          copy.training?.categories?.[category] || info.title;
                        return (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedCategory === category
                                ? `bg-${info.color}-500/20 text-${info.color}-300 border border-${info.color}-500/30`
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {categoryTitle} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Training Sessions View */}
                {activeView === "sessions" && (
                  <div className="space-y-6">
                    {filteredModules.map((module) => (
                      <TrainingModuleCard
                        key={module.id}
                        module={module}
                        isExpanded={expandedModules.has(module.id)}
                        onToggle={() => toggleModule(module.id)}
                        copy={copy}
                      />
                    ))}
                  </div>
                )}

                {/* Informational Guides View */}
                {activeView === "guides" && (
                  <section id="pdf-guides" className="mb-12">
                    <div className="text-center mb-8">
                      <h2 className="section-title mb-4">
                        {copy.training?.essential_guides ||
                          "Essential Product Guides"}
                      </h2>
                      <p className="text-slate-300 max-w-2xl mx-auto">
                        {copy.training?.guides_subtitle ||
                          "Download these comprehensive PDFs to master every product in the Enagic lineup. Essential reading for all distributors building their True Legacy business."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {TRAINING_PDFS.map((pdf, i) => {
                        const pdfTranslation =
                          copy.trainingPdfs?.[
                            pdf.id as keyof typeof copy.trainingPdfs
                          ];
                        const title = pdfTranslation?.title || pdf.id;
                        const desc = pdfTranslation?.desc || "";

                        return (
                          <motion.a
                            key={pdf.id}
                            href={pdf.url}
                            target="_blank" rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="pdf-card flex flex-col p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                          >
                            <div className="flex items-start gap-3 mb-4">
                              <div className="p-3 rounded-lg bg-cyan-500/20 shrink-0">
                                <FileText className="w-6 h-6 text-cyan-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                  {title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                  {desc}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="px-2 py-1 rounded-md text-xs uppercase tracking-wider text-slate-500 bg-white/5 border border-white/10">
                                {pdf.category}
                              </span>
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Spanish Slides View */}
                {activeView === "slides" && locale === "es" && (
                  <div className="space-y-12">
                    {/* 8-Point System */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-cyan-500/30 bg-black/40 backdrop-blur-sm p-8"
                    >
                      <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                        Sistema de 8 Puntos
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">
                            ¿Cómo funciona?
                          </h4>
                          <p className="text-slate-300 mb-4">
                            Enagic utiliza un sistema único de 8 puntos para el
                            pago de comisiones, donde "1A" significa "1 Punto".
                            Cada venta genera un pago de hasta 8 puntos hacia
                            arriba en la estructura de la organización.
                          </p>
                          <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />{" "}
                              <span className="pt-0.5">
                                Sin cuota mensual de inscripción o mantenimiento
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />{" "}
                              <span className="pt-0.5">
                                Sin inventario que mantener
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />{" "}
                              <span className="pt-0.5">
                                Pagos diarios directos a tu cuenta
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <h4 className="text-lg font-semibold text-white mb-4">
                            Valor de 1 Punto (Comisión Base)
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                              <span className="text-slate-300 font-medium">
                                Kangen K8
                              </span>
                              <span className="text-xl font-bold text-cyan-400">
                                $340 USD
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                              <span className="text-slate-300 font-medium">
                                emGuarde
                              </span>
                              <span className="text-xl font-bold text-purple-400">
                                $130 USD
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Ranks */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-8"
                    >
                      <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                        Rangos 1A a 6A (Comisión por K8)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr>
                              <th className="py-4 px-6 bg-white/5 text-white font-semibold rounded-tl-xl border-b border-white/10">
                                Rango
                              </th>
                              <th className="py-4 px-6 bg-white/5 text-white font-semibold border-b border-white/10">
                                Ventas (Directas/Equipo)
                              </th>
                              <th className="py-4 px-6 bg-white/5 text-white font-semibold rounded-tr-xl border-b border-white/10">
                                Comisión por Venta
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-300">
                            <tr>
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-cyan-400">
                                1A
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                0-2
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                $340 USD (1 Pto)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-cyan-400">
                                2A
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                3-10
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                $680 USD (2 Ptos)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-cyan-400">
                                3A
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                11-20
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                $1,020 USD (3 Ptos)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-cyan-400">
                                4A
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                21-50
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                $1,360 USD (4 Ptos)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-cyan-400">
                                5A
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                51-100
                              </td>
                              <td className="py-4 px-6 border-b border-white/5">
                                $1,700 USD (5 Ptos)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-4 px-6 font-bold text-tl-gold">
                                6A
                              </td>
                              <td className="py-4 px-6">101+</td>
                              <td className="py-4 px-6 font-bold text-tl-gold">
                                $2,040 USD (6 Ptos)
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.div>

                    {/* Fast Track & Why 6A */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-8"
                      >
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                          Vía Rápida a 6A
                        </h3>
                        <p className="text-slate-300 mb-6">
                          Para alcanzar las 101 ventas requeridas para 6A, el
                          enfoque del paquete que promueves hace una gran
                          diferencia en la velocidad de tu crecimiento:
                        </p>

                        <div className="space-y-4">
                          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-white">
                                Vendiendo solo K8
                              </span>
                              <span className="text-cyan-400 font-bold">
                                101 Personas
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">
                              Necesitas encontrar 101 compradores individuales
                              de la máquina K8.
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-5 border border-cyan-500/30">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-white">
                                Vendiendo Paquete DUO
                              </span>
                              <span className="text-tl-gold font-bold text-xl">
                                51 Personas
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">
                              Cada paquete DUO (K8 + emGuarde) cuenta como 2
                              ventas. Cortas el tiempo y esfuerzo a la mitad.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-tl-gold/30 bg-black/40 backdrop-blur-sm p-8"
                      >
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                          Por qué 6A es la meta
                        </h3>
                        <ul className="space-y-4 text-slate-300">
                          <li className="flex items-start gap-3">
                            <Target className="w-6 h-6 text-tl-gold shrink-0" />
                            <div>
                              <strong className="text-white block mb-1">
                                Máxima Comisión
                              </strong>
                              Ganas 6 puntos por cada venta directa (ej. $2,040
                              USD por un K8).
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <Target className="w-6 h-6 text-tl-gold shrink-0" />
                            <div>
                              <strong className="text-white block mb-1">
                                Bono de Título
                              </strong>
                              Recibes un bono único de $3,000 USD al alcanzar el
                              rango 6A.
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <Target className="w-6 h-6 text-tl-gold shrink-0" />
                            <div>
                              <strong className="text-white block mb-1">
                                Bono Educativo
                              </strong>
                              Incluso si la venta ocurre por debajo de tus 8
                              puntos, recibes un bono educativo infinito.
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <Target className="w-6 h-6 text-tl-gold shrink-0" />
                            <div>
                              <strong className="text-white block mb-1">
                                Fundación para el Legado
                              </strong>
                              6A es el primer gran paso hacia la creación de
                              ingresos residuales y generacionales (rango 6A2-3
                              y superior).
                            </div>
                          </li>
                        </ul>
                      </motion.div>
                    </div>

                    {/* Paquetes & Opciones de Pago */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-8"
                      >
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                          Opciones de Pago
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-cyan-400" />{" "}
                              Pago de Contado
                            </h4>
                            <p className="text-slate-300 text-sm">
                              Tarjeta de crédito, débito o transferencia
                              bancaria. La forma más rápida de obtener tus
                              productos y comenzar.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-cyan-400" />{" "}
                              Financiamiento Externo
                            </h4>
                            <p className="text-slate-300 text-sm">
                              Tarjetas de crédito a meses (varía por país) o
                              préstamos personales. Ideal para no
                              descapitalizarse e invertir las ganancias en pagar
                              la deuda.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-cyan-400" />{" "}
                              Plan Enagic (In-house)
                            </h4>
                            <p className="text-slate-300 text-sm">
                              Pago inicial (enganche) y mensualidades
                              directamente con Enagic sin revisión de crédito
                              severa. Una opción accesible para todos.
                            </p>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
                            <p className="text-yellow-200/80 text-xs italic">
                              Aviso: Los productos pueden ser deducibles de
                              impuestos como gasto de negocio o equipo médico en
                              muchos países. Consulta a tu contador local para
                              estrategias fiscales específicas.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-8"
                      >
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                          Nuestro Acuerdo
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-cyan-400 mb-4">
                              Qué Necesitamos de Ti
                            </h4>
                            <ul className="space-y-3 text-slate-300 text-sm">
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />{" "}
                                Ganas de aprender y ser enseñable
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />{" "}
                                Compromiso con tu propia visión
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />{" "}
                                Acción consistente
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />{" "}
                                Inversión inicial en tu negocio (tu franquicia
                                global)
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-tl-gold mb-4">
                              Qué Ofrecemos
                            </h4>
                            <ul className="space-y-3 text-slate-300 text-sm">
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tl-gold shrink-0" />{" "}
                                Mentoría uno a uno de líderes 6A+
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tl-gold shrink-0" />{" "}
                                Sistemas de duplicación probados
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tl-gold shrink-0" />{" "}
                                Entrenamiento en cierre y prospección
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tl-gold shrink-0" />{" "}
                                Comunidad global de apoyo
                              </li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Upcoming Events View */}
                {activeView === "events" && (
                  <EventsTab locale={locale} countrySlug={countrySlug} />
                )}
              </div>
            )}
          </div>
        </AuroraBackground>
      </main>
      <Footer />
    </div>
  );
}
