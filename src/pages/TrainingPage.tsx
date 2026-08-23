import { EventsTab } from "@/components/EventsTab";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Download,
  ExternalLink,
  FileText,
  Key,
  Lightbulb,
  LogOut,
  PlayCircle,
  Play,
  ArrowRight,
  Target,
  Users,
  BookOpenCheck,
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
    title: "Closing & Business Media",
    icon: FileText,
    color: "orange",
  },
};

const ACADEMY_STRUCTURE = [
  {
    id: "module-1",
    num: 1,
    titleKey: "foundation" as const,
    categories: ["foundation", "product"],
    moduleIds: ["purpose-vision", "kangen-science", "product-lineup"],
  },
  {
    id: "module-2",
    num: 2,
    titleKey: "business" as const,
    categories: ["prospecting", "closing"],
    moduleIds: ["prospecting-basics", "social-media-prospecting", "closing-techniques", "business-media"],
  },
  {
    id: "module-3",
    num: 3,
    titleKey: "leadership" as const,
    categories: ["systems", "leadership"],
    moduleIds: ["systems-funnels", "leadership-structure", "income-projection"],
  },
];

const getYouTubeThumbnail = (url?: string) => {
  if (!url) return '';
  try {
    if (url.includes("youtube.com/watch")) {
      const u = new URL(url);
      const id = u.searchParams.get("v");
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
    }
    if (url.includes("youtu.be/")) {
      const after = url.split("youtu.be/")[1] || "";
      const id = after.split(/[?&]/)[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
    }
  } catch {
    return '';
  }
  return '';
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
        return "bg-slate-500/20 text-[#cccccc] border-slate-500/30";
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
              <p className="text-[#cccccc] text-sm mb-2">{module.duration}</p>
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

        <p className="text-[#cccccc] text-sm leading-relaxed mb-6">
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
                <FileText className="w-4 h-4 text-[#cccccc] shrink-0" />
                <span className="text-slate-200 flex-1">
                  {localizedResourceTitles?.[index] ?? resource.title}
                </span>
                <span className="text-[#86868b] text-xs uppercase">
                  {resource.type}
                </span>
                <ExternalLink className="w-4 h-4 text-[#cccccc]" />
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
  const [hasCompletedDuoIntro, setHasCompletedDuoIntro] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("tl_training_duo_intro") === "complete",
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);

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
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );

  // LMS Academy State: Completed lessons, Active lesson, Module Overviews, & Mobile Curriculum
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set(["purpose-vision"]);
    try {
      const saved = localStorage.getItem("tl_completed_lessons");
      if (saved) return new Set(JSON.parse(saved));
    } catch { /* ignore */ }
    return new Set(["purpose-vision"]);
  });

  const [activeLessonId, setActiveLessonId] = useState<string>("purpose-vision");
  const [activeModuleOverviewId, setActiveModuleOverviewId] = useState<string | null>(null);
  const [showMobileCurriculum, setShowMobileCurriculum] = useState(false);
  const [expandedCurriculumModules, setExpandedCurriculumModules] = useState<Set<string>>(
    new Set(["module-1", "module-2", "module-3"])
  );

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      try {
        localStorage.setItem("tl_completed_lessons", JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  };

  // Check if this is a LATAM training page
  const isLatamTraining =
    countrySlug &&
    ["colombia", "brazil", "mexico", "paraguay"].includes(countrySlug);

  // Get translations for current locale
  const copy = t[locale] || t.en;
  const journeyCopy = {
    en: {
      eyebrow: "Your True Legacy learning path",
      title: "Understand the Duo. Then build the skills.",
      subtitle: "Begin with the two products at the center of the True Legacy story. Once you understand the K8 and emGuarde GO, continue into the structured leadership academy.",
      stepOne: "Step 1",
      stepOneTitle: "Watch the Duo orientation",
      stepOneText: "Two focused demonstrations give you the product foundation before business training begins.",
      water: "K8 Water Demonstration",
      waterText: "See the water technology, the different water types, and the everyday product story.",
      emguarde: "emGuarde GO Demonstration",
      emguardeText: "Learn what the portable set includes and how to explain it clearly and responsibly.",
      duo: "The Full Duo Presentation",
      duoText: "Bring both product stories together and see how the complete True Legacy Duo is presented as one connected solution.",
      continue: "I’ve watched the Duo — continue",
      completed: "Duo orientation complete",
      revisit: "Watch the Duo again",
      stepTwo: "Step 2",
      stepTwoTitle: "Enter the Leadership Academy",
      stepTwoText: "Unlock the organized training library, choose a module, and build your skills in sequence.",
      foundation: "Product foundation",
      modules: "10 training modules",
      languages: "English · Spanish · Portuguese",
    },
    es: {
      eyebrow: "Tu ruta de aprendizaje True Legacy",
      title: "Comprende el Duo. Luego desarrolla las habilidades.",
      subtitle: "Comienza con los dos productos en el centro de la historia True Legacy. Después de comprender el K8 y emGuarde GO, continúa en la academia de liderazgo.",
      stepOne: "Paso 1", stepOneTitle: "Mira la orientación del Duo", stepOneText: "Dos demostraciones claras te dan la base de producto antes de comenzar la capacitación de negocio.",
      water: "Demostración de agua K8", waterText: "Conoce la tecnología, los diferentes tipos de agua y la historia cotidiana del producto.",
      emguarde: "Demostración de emGuarde GO", emguardeText: "Descubre qué incluye el set portátil y cómo explicarlo de forma clara y responsable.",
      duo: "Presentación completa del Duo", duoText: "Une las historias de ambos productos y descubre cómo presentar el True Legacy Duo como una solución conectada.",
      continue: "Ya vi el Duo — continuar", completed: "Orientación del Duo completada", revisit: "Volver a ver el Duo",
      stepTwo: "Paso 2", stepTwoTitle: "Entra a la Academia de Liderazgo", stepTwoText: "Desbloquea la biblioteca organizada, elige un módulo y desarrolla tus habilidades en secuencia.",
      foundation: "Base de producto", modules: "10 módulos de capacitación", languages: "Inglés · Español · Portugués",
    },
    pt: {
      eyebrow: "Sua jornada de aprendizado True Legacy", title: "Entenda o Duo. Depois desenvolva as habilidades.",
      subtitle: "Comece com os dois produtos no centro da história True Legacy. Depois de entender o K8 e o emGuarde GO, continue para a academia de liderança.",
      stepOne: "Etapa 1", stepOneTitle: "Assista à orientação do Duo", stepOneText: "Duas demonstrações objetivas dão a base dos produtos antes do treinamento de negócios.",
      water: "Demonstração da água K8", waterText: "Conheça a tecnologia, os diferentes tipos de água e a história cotidiana do produto.",
      emguarde: "Demonstração do emGuarde GO", emguardeText: "Veja o que acompanha o conjunto portátil e como explicá-lo com clareza e responsabilidade.",
      duo: "Apresentação completa do Duo", duoText: "Una as histórias dos dois produtos e veja como apresentar o True Legacy Duo como uma solução conectada.",
      continue: "Assisti ao Duo — continuar", completed: "Orientação do Duo concluída", revisit: "Assistir ao Duo novamente",
      stepTwo: "Etapa 2", stepTwoTitle: "Entre na Academia de Liderança", stepTwoText: "Desbloqueie a biblioteca organizada, escolha um módulo e desenvolva suas habilidades em sequência.",
      foundation: "Base de produtos", modules: "10 módulos de treinamento", languages: "Inglês · Espanhol · Português",
    },
    fr: {
      eyebrow: "Votre parcours True Legacy", title: "Comprenez le Duo. Développez ensuite vos compétences.",
      subtitle: "Commencez par les deux produits au cœur de l’histoire True Legacy, puis poursuivez avec l’académie structurée de leadership.",
      stepOne: "Étape 1", stepOneTitle: "Regarder l’orientation Duo", stepOneText: "Deux démonstrations ciblées donnent les bases produit avant la formation commerciale.",
      water: "Démonstration de l’eau K8", waterText: "Découvrez la technologie, les différents types d’eau et l’usage quotidien du produit.",
      emguarde: "Démonstration emGuarde GO", emguardeText: "Découvrez le contenu du kit portable et comment le présenter clairement et de façon responsable.",
      duo: "Présentation complète du Duo", duoText: "Réunissez les deux histoires produit et découvrez comment présenter le True Legacy Duo comme une solution cohérente.",
      continue: "J’ai regardé le Duo — continuer", completed: "Orientation Duo terminée", revisit: "Revoir le Duo",
      stepTwo: "Étape 2", stepTwoTitle: "Entrer dans l’Académie de Leadership", stepTwoText: "Déverrouillez la bibliothèque, choisissez un module et progressez dans l’ordre.",
      foundation: "Fondation produit", modules: "10 modules de formation", languages: "Anglais · Espagnol · Portugais",
    },
  }[locale] || {
    eyebrow: "Your True Legacy learning path", title: "Understand the Duo. Then build the skills.", subtitle: "Begin with the two products at the center of the True Legacy story, then continue into the structured leadership academy.",
    stepOne: "Step 1", stepOneTitle: "Watch the Duo orientation", stepOneText: "Two focused demonstrations give you the product foundation before business training begins.",
    water: "K8 Water Demonstration", waterText: "See the water technology, the different water types, and the everyday product story.", emguarde: "emGuarde GO Demonstration", emguardeText: "Learn what the portable set includes and how to explain it clearly and responsibly.", duo: "The Full Duo Presentation", duoText: "Bring both product stories together and see how the complete True Legacy Duo is presented as one connected solution.",
    continue: "I’ve watched the Duo — continue", completed: "Duo orientation complete", revisit: "Watch the Duo again", stepTwo: "Step 2", stepTwoTitle: "Enter the Leadership Academy", stepTwoText: "Unlock the organized training library, choose a module, and build your skills in sequence.",
    foundation: "Product foundation", modules: "10 training modules", languages: "English · Spanish · Portuguese",
  };

  const duoVideos = locale === "es"
    ? { water: "https://youtu.be/6A_UpRmoWWc", emguarde: "https://youtu.be/BS4QEM-zXf0", duo: "https://youtu.be/t1OtNA4p8y4" }
    : { water: "https://youtu.be/1nkOCId-SfQ", emguarde: "https://youtu.be/5wuY1dKjHds", duo: "https://youtu.be/lB5fW55DmaI" };

  const ewsCopy = {
    en: { eyebrow: "Enagic Web System", title: "EWS & company training", text: "Use your personal EWS account and continue learning through the distributor training resources available to you.", login: "Log in to EWS", loginText: "Open your personal Enagic Web System dashboard.", system: "Learn the EWS system", systemText: "Training on how to set up and use EWS.", monday: "Monday training", mondayText: "Access the recurring Monday distributor training.", saturday: "Saturday calls", saturdayText: "Join the EWS Saturday training calls.", portal: "Enagic Distributor Portal", portalWarning: "You are opening the Enagic Distributor Portal. Every distributor must use their own personal Enagic portal credentials. Continue?", open: "Open" },
    es: { eyebrow: "Sistema Web de Enagic", title: "EWS y capacitación de la compañía", text: "Usa tu cuenta personal de EWS y continúa aprendiendo con los recursos de capacitación disponibles para distribuidores.", login: "Iniciar sesión en EWS", loginText: "Abre tu panel personal del Sistema Web de Enagic.", system: "Aprende a usar EWS", systemText: "Capacitación para configurar y utilizar EWS.", monday: "Capacitación del lunes", mondayText: "Accede a la capacitación recurrente de los lunes.", saturday: "Llamadas del sábado", saturdayText: "Únete a las llamadas de capacitación EWS de los sábados.", portal: "Portal de Distribuidores Enagic", portalWarning: "Vas a abrir el Portal de Distribuidores Enagic. Cada distribuidor debe usar sus propias credenciales personales de Enagic. ¿Deseas continuar?", open: "Abrir" },
    pt: { eyebrow: "Sistema Web Enagic", title: "EWS e treinamento da empresa", text: "Use sua conta pessoal do EWS e continue aprendendo com os recursos de treinamento disponíveis para distribuidores.", login: "Entrar no EWS", loginText: "Abra seu painel pessoal do Sistema Web Enagic.", system: "Aprenda a usar o EWS", systemText: "Treinamento para configurar e utilizar o EWS.", monday: "Treinamento de segunda", mondayText: "Acesse o treinamento recorrente de segunda-feira.", saturday: "Chamadas de sábado", saturdayText: "Participe das chamadas de treinamento EWS aos sábados.", portal: "Portal do Distribuidor Enagic", portalWarning: "Você está abrindo o Portal do Distribuidor Enagic. Cada distribuidor deve usar suas próprias credenciais pessoais da Enagic. Deseja continuar?", open: "Abrir" },
    fr: { eyebrow: "Système Web Enagic", title: "EWS et formation de l’entreprise", text: "Utilisez votre compte EWS personnel et poursuivez votre apprentissage avec les ressources destinées aux distributeurs.", login: "Se connecter à EWS", loginText: "Ouvrez votre tableau de bord Enagic Web System.", system: "Apprendre le système EWS", systemText: "Formation pour configurer et utiliser EWS.", monday: "Formation du lundi", mondayText: "Accédez à la formation récurrente du lundi.", saturday: "Appels du samedi", saturdayText: "Participez aux appels de formation EWS du samedi.", portal: "Portail Distributeur Enagic", portalWarning: "Vous allez ouvrir le Portail Distributeur Enagic. Chaque distributeur doit utiliser ses propres identifiants Enagic. Continuer ?", open: "Ouvrir" },
  }[locale] || { eyebrow: "Enagic Web System", title: "EWS & company training", text: "Use your personal EWS account and continue learning through the distributor training resources available to you.", login: "Log in to EWS", loginText: "Open your personal Enagic Web System dashboard.", system: "Learn the EWS system", systemText: "Training on how to set up and use EWS.", monday: "Monday training", mondayText: "Access the recurring Monday distributor training.", saturday: "Saturday calls", saturdayText: "Join the EWS Saturday training calls.", portal: "Enagic Distributor Portal", portalWarning: "You are opening the Enagic Distributor Portal. Every distributor must use their own personal Enagic portal credentials. Continue?", open: "Open" };

  const ewsResources = [
    { title: ewsCopy.login, text: ewsCopy.loginText, href: "https://app.enagicwebsystem.com/backoffice.php?section=logout", icon: Key },
    { title: ewsCopy.system, text: ewsCopy.systemText, href: "https://app.enagicwebsystem.com/training", icon: PlayCircle },
    { title: ewsCopy.monday, text: ewsCopy.mondayText, href: "https://www.truehealthlifestyle.team/monday", icon: Lightbulb },
    { title: ewsCopy.saturday, text: ewsCopy.saturdayText, href: "https://www.truehealthlifestyle.team/saturday", icon: Users },
  ];

  const pathCopy = {
    en: { title: "Choose your training module", text: "Follow the subjects in order or open the module that matches the skill you need now.", lessons: "lessons", open: "View lessons", back: "Back to modules", foundation: "1 · Foundation & Product Mastery", foundationText: "Build your purpose, product confidence, and understanding of the Enagic opportunity.", business: "2 · Business Skills & Conversations", businessText: "Learn prospecting, invitations, presentations, closing, objections, and business media.", leadership: "3 · Systems, Leadership & Duplication", leadershipText: "Develop the systems, structure, and leadership skills required to build a duplicating team." },
    es: { title: "Elige tu módulo de capacitación", text: "Sigue los temas en orden o abre el módulo que corresponde a la habilidad que necesitas ahora.", lessons: "lecciones", open: "Ver lecciones", back: "Volver a los módulos", foundation: "1 · Fundamentos y dominio de productos", foundationText: "Desarrolla tu propósito, confianza en los productos y comprensión de la oportunidad Enagic.", business: "2 · Habilidades de negocio y conversaciones", businessText: "Aprende prospección, invitaciones, presentaciones, cierres, objeciones y medios de negocio.", leadership: "3 · Sistemas, liderazgo y duplicación", leadershipText: "Desarrolla los sistemas, la estructura y el liderazgo necesarios para construir un equipo que se duplica." },
    pt: { title: "Escolha seu módulo de treinamento", text: "Siga os assuntos em ordem ou abra o módulo que corresponde à habilidade que você precisa agora.", lessons: "aulas", open: "Ver aulas", back: "Voltar aos módulos", foundation: "1 · Fundamentos e domínio dos produtos", foundationText: "Desenvolva seu propósito, confiança nos produtos e compreensão da oportunidade Enagic.", business: "2 · Habilidades de negócios e conversas", businessText: "Aprenda prospecção, convites, apresentações, fechamento, objeções e mídia de negócios.", leadership: "3 · Sistemas, liderança e duplicação", leadershipText: "Desenvolva os sistemas, a estrutura e a liderança necessários para construir uma equipe duplicável." },
    fr: { title: "Choisissez votre module de formation", text: "Suivez les sujets dans l’ordre ou ouvrez le module correspondant à la compétence dont vous avez besoin.", lessons: "leçons", open: "Voir les leçons", back: "Retour aux modules", foundation: "1 · Fondations et maîtrise des produits", foundationText: "Développez votre objectif, votre confiance produit et votre compréhension de l’opportunité Enagic.", business: "2 · Compétences commerciales et conversations", businessText: "Apprenez la prospection, les invitations, les présentations, la conclusion, les objections et les médias.", leadership: "3 · Systèmes, leadership et duplication", leadershipText: "Développez les systèmes, la structure et le leadership nécessaires pour bâtir une équipe duplicable." },
  }[locale] || { title: "Choose your training module", text: "Follow the subjects in order or open the module that matches the skill you need now.", lessons: "lessons", open: "View lessons", back: "Back to modules", foundation: "1 · Foundation & Product Mastery", foundationText: "Build your purpose, product confidence, and understanding of the Enagic opportunity.", business: "2 · Business Skills & Conversations", businessText: "Learn prospecting, invitations, presentations, closing, objections, and business media.", leadership: "3 · Systems, Leadership & Duplication", leadershipText: "Develop the systems, structure, and leadership skills required to build a duplicating team." };

  const learningPaths = [
    {
      id: "foundation" as const,
      title: pathCopy.foundation,
      text: pathCopy.foundationText,
      categories: ["foundation", "product"] as Array<keyof typeof CATEGORY_INFO>,
      icon: Target,
      cardClass: "from-cyan-500/[.11] hover:border-white/20",
      iconClass: "bg-cyan-400/10 text-[#2997ff]",
      accentClass: "text-[#2997ff]",
    },
    {
      id: "business" as const,
      title: pathCopy.business,
      text: pathCopy.businessText,
      categories: ["prospecting", "closing"] as Array<keyof typeof CATEGORY_INFO>,
      icon: CheckCircle,
      cardClass: "from-amber-500/[.11] hover:border-amber-300/35",
      iconClass: "bg-amber-400/10 text-amber-300",
      accentClass: "text-amber-300",
    },
    {
      id: "leadership" as const,
      title: pathCopy.leadership,
      text: pathCopy.leadershipText,
      categories: ["systems", "leadership"] as Array<keyof typeof CATEGORY_INFO>,
      icon: Users,
      cardClass: "from-violet-500/[.11] hover:border-white/20",
      iconClass: "bg-violet-400/10 text-[#2997ff]",
      accentClass: "text-[#2997ff]",
    },
  ];

  const completeDuoIntro = () => {
    localStorage.setItem("tl_training_duo_intro", "complete");
    setHasCompletedDuoIntro(true);
    window.setTimeout(() => accessRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

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
              <div className="pt-8 sm:pt-12">
                <div className="mx-auto max-w-4xl text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.32em] text-tl-gold">{journeyCopy.eyebrow}</p>
                  <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">{journeyCopy.title}</h1>
                  <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#cccccc] sm:text-lg">{journeyCopy.subtitle}</p>
                  <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 text-xs font-semibold text-[#cccccc] sm:text-sm">
                    {[journeyCopy.foundation, journeyCopy.modules, journeyCopy.languages].map((item) => (
                      <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">{item}</div>
                    ))}
                  </div>
                </div>

                <section className="mx-auto mt-12 max-w-5xl rounded-[2rem] border border-white/20 bg-gradient-to-br from-cyan-500/[0.08] via-white/[0.03] to-blue-600/[0.08] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-8">
                  <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2997ff]">{journeyCopy.stepOne}</p>
                      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{journeyCopy.stepOneTitle}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cccccc] sm:text-base">{journeyCopy.stepOneText}</p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-cyan-400/10 text-[#2997ff]"><PlayCircle className="h-6 w-6" /></div>
                  </div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <article className="rounded-2xl border border-white/10 bg-black p-4 sm:p-5">
                      <YouTubeEmbed url={duoVideos.water} title={journeyCopy.water} />
                      <div className="mt-4 flex items-start gap-4">
                        <img src="/products/k8.png" alt="K8 water ionizer" className="h-20 w-20 object-contain" />
                        <div><h3 className="font-bold text-white">{journeyCopy.water}</h3><p className="mt-1 text-sm leading-6 text-[#cccccc]">{journeyCopy.waterText}</p></div>
                      </div>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-black p-4 sm:p-5">
                      <YouTubeEmbed url={duoVideos.emguarde} title={journeyCopy.emguarde} />
                      <div className="mt-4 flex items-start gap-4">
                        <img src="/products/emguarde-go.png" alt="emGuarde GO portable set" className="h-20 w-20 object-contain" />
                        <div><h3 className="font-bold text-white">{journeyCopy.emguarde}</h3><p className="mt-1 text-sm leading-6 text-[#cccccc]">{journeyCopy.emguardeText}</p></div>
                      </div>
                    </article>
                    <article className="rounded-2xl border border-tl-gold/25 bg-gradient-to-br from-[#11182c] to-[#071127] p-4 lg:col-span-2 sm:p-5">
                      <div className="grid items-center gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                        <YouTubeEmbed url={duoVideos.duo} title={journeyCopy.duo} />
                        <div className="p-2 sm:p-4">
                          <span className="text-xs font-black uppercase tracking-[0.25em] text-tl-gold">03 · Duo</span>
                          <h3 className="mt-3 text-2xl font-black text-white">{journeyCopy.duo}</h3>
                          <p className="mt-3 text-sm leading-6 text-[#cccccc] sm:text-base">{journeyCopy.duoText}</p>
                          <div className="mt-6 flex items-end justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <img src="/products/k8.png" alt="K8 water ionizer" className="h-28 w-[54%] object-contain" />
                            <img src="/products/emguarde-go.png" alt="emGuarde GO portable set" className="h-24 w-[34%] object-contain" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                  <button onClick={completeDuoIntro} className="mx-auto mt-7 flex min-h-14 w-full max-w-md items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5">
                    {hasCompletedDuoIntro ? journeyCopy.completed : journeyCopy.continue}<ArrowRight className="h-5 w-5" />
                  </button>
                </section>

                <div ref={accessRef} className={`max-w-md mx-auto mt-10 min-h-[400px] rounded-2xl border bg-white/[0.04] backdrop-blur-xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-all ${hasCompletedDuoIntro ? "border-tl-gold/30" : "border-white/10 opacity-60"}`}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-white/20 text-[#2997ff] mb-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                    <Key className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.26em] text-tl-gold">{journeyCopy.stepTwo}</span>
                    {journeyCopy.stepTwoTitle}
                  </h2>
                  <p className="text-[#cccccc] text-sm mb-6">
                    {journeyCopy.stepTwoText} {copy.training?.access_desc || "Enter the secret code to access training. Join our Facebook community to get the code."}
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
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
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
                    disabled={!hasCompletedDuoIntro}
                    className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {copy.training?.access_unlock || "Unlock Training"}
                  </button>
                </form>
              </div>
              </div>
            ) : (
              <div ref={contentRef}>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleResetAccess}
                    className="flex items-center gap-2 text-sm text-[#cccccc] hover:text-white transition-colors px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
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
                      <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-[#2997ff] border border-white/20 rounded text-[10px] font-medium">
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
                    className="text-[#cccccc] text-lg max-w-2xl mx-auto leading-relaxed"
                  >
                    {copy.training?.hero_subtitle ||
                      "Complete training system designed to take you from beginner to 6A leader. Learn from proven strategies and build your legacy business with confidence."}
                  </motion.p>
                </div>

                <section className="mb-10 rounded-[2rem] border border-white/20 bg-gradient-to-br from-cyan-500/[0.09] via-white/[0.025] to-blue-600/[0.09] p-5 shadow-[0_24px_80px_rgba(0,0,0,.35)] sm:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-cyan-400/40 bg-black shadow-xl shadow-cyan-500/20 p-0.5 flex items-center justify-center">
                          <img
                            src="/logos/true-health-lifestyle.png"
                            alt="True Health Lifestyle"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-slate-950"></span>
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.26em] text-[#2997ff]">
                          {ewsCopy.eyebrow} • True Health Lifestyle
                        </p>
                        <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                          {ewsCopy.title}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cccccc]">
                          {ewsCopy.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-3">
                      <a
                        href="https://app.enagicwebsystem.com/backoffice.php?section=logout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 text-sm"
                      >
                        {ewsCopy.login}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a
                        href="https://information.enagic.com/home"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => {
                          if (!window.confirm(ewsCopy.portalWarning)) event.preventDefault();
                        }}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-400 shadow-lg text-sm"
                      >
                        {ewsCopy.portal}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {ewsResources.map(({ title, text, href, icon: Icon }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/[0.05] hover:shadow-xl hover:shadow-cyan-500/10"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border border-white/15 text-[#2997ff] group-hover:scale-105 group-hover:border-cyan-400/40 transition-transform">
                              <Icon className="h-6 w-6" />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b] bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                              EWS / THL
                            </span>
                          </div>
                          <h3 className="mt-4 text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {title}
                          </h3>
                          <p className="mt-2 text-xs leading-relaxed text-[#cccccc]">
                            {text}
                          </p>
                        </div>
                        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#2997ff] group-hover:text-cyan-300">
                          <span>{ewsCopy.open}</span>
                          <span className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>

                {/* Sessions/Guides/Spanish Slides Toggle */}
                <div className="mb-8">
                  <div className="flex justify-center">
                    <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                      <button
                        onClick={() => setActiveView("sessions")}
                        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeView === "sessions"
                            ? "bg-cyan-500/20 text-[#2997ff] border border-white/20 shadow-lg"
                            : "text-[#cccccc] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {copy.training?.sessions_tab || "Training Sessions"}
                      </button>
                      <button
                        onClick={() => setActiveView("guides")}
                        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeView === "guides"
                            ? "bg-cyan-500/20 text-[#2997ff] border border-white/20 shadow-lg"
                            : "text-[#cccccc] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {copy.training?.guides_tab || "Informational Guides"}
                      </button>
                      {locale === "es" && (
                        <button
                          onClick={() => setActiveView("slides")}
                          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                            activeView === "slides"
                              ? "bg-cyan-500/20 text-[#2997ff] border border-white/20 shadow-lg"
                              : "text-[#cccccc] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          Presentación True Legacy
                        </button>
                      )}
                      <button
                        onClick={() => setActiveView("events")}
                        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeView === "events"
                            ? "bg-cyan-500/20 text-[#2997ff] border border-white/20 shadow-lg"
                            : "text-[#cccccc] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {copy.training?.events_tab || "Upcoming Events"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Training Sessions View (MasterClass x Apple LMS Academy 2-Column Experience) */}
                {activeView === "sessions" && (() => {
                  const toEmbedUrl = (url: string) => {
                    try {
                      if (url.includes("youtube.com/watch")) {
                        const u = new URL(url);
                        const id = u.searchParams.get("v");
                        return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
                      }
                      if (url.includes("youtu.be/")) {
                        const after = url.split("youtu.be/")[1] || "";
                        const id = after.split(/[?&]/)[0];
                        return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
                      }
                      return url;
                    } catch {
                      return url;
                    }
                  };

                  const ALL_LESSON_IDS = ACADEMY_STRUCTURE.flatMap((m) => m.moduleIds);
                  const activeLesson = TRAINING_MODULES.find((m) => m.id === activeLessonId) || TRAINING_MODULES[0];
                  const activeAcademyModule = ACADEMY_STRUCTURE.find((m) => m.moduleIds.includes(activeLessonId)) || ACADEMY_STRUCTURE[0];
                  const activeLessonIndexInModule = activeAcademyModule.moduleIds.indexOf(activeLessonId);
                  
                  const currentGlobalIndex = ALL_LESSON_IDS.indexOf(activeLessonId);
                  const prevLessonId = currentGlobalIndex > 0 ? ALL_LESSON_IDS[currentGlobalIndex - 1] : null;
                  const nextLessonId = currentGlobalIndex < ALL_LESSON_IDS.length - 1 ? ALL_LESSON_IDS[currentGlobalIndex + 1] : null;
                  const nextLesson = nextLessonId ? TRAINING_MODULES.find((m) => m.id === nextLessonId) : null;

                  const totalLessonsCount = TRAINING_MODULES.length;
                  const totalCompletedCount = completedLessonIds.size;
                  const academyProgressPercent = Math.round((totalCompletedCount / totalLessonsCount) * 100);

                  const activeModuleCompletedCount = activeAcademyModule.moduleIds.filter((id) => completedLessonIds.has(id)).length;

                  const getLocalizedLesson = (mod: TrainingModule) => {
                    const trans = copy.trainingModules?.[mod.id as keyof typeof copy.trainingModules];
                    return {
                      title: trans?.title || mod.title,
                      description: trans?.description || mod.description,
                      resources: (trans as { resources?: ReadonlyArray<string> } | undefined)?.resources,
                    };
                  };

                  const getModuleTitle = (titleKey: "foundation" | "business" | "leadership") => {
                    return pathCopy[titleKey];
                  };

                  const toggleCurriculumModule = (modId: string) => {
                    setExpandedCurriculumModules((prev) => {
                      const next = new Set(prev);
                      if (next.has(modId)) next.delete(modId);
                      else next.add(modId);
                      return next;
                    });
                  };

                  const renderCurriculumSidebar = () => (
                    <div className="space-y-6">
                      {/* Sidebar Header & Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#2997ff]">
                            {locale === "es" ? "TU ENTRENAMIENTO" : locale === "fr" ? "VOTRE FORMATION" : locale === "pt" ? "SEU TREINAMENTO" : "YOUR TRAINING"}
                          </span>
                          <span className="text-xs font-black text-cyan-400">
                            {academyProgressPercent}%
                          </span>
                        </div>

                        {/* Academy Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-[#cccccc] mb-1.5 font-semibold">
                            <span>{locale === "es" ? "Progreso de la Academia" : locale === "fr" ? "Progrès de l’Académie" : locale === "pt" ? "Progresso da Academia" : "Academy Progress"}</span>
                            <span>{totalCompletedCount} / {totalLessonsCount}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${academyProgressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Active Module Progress Bar */}
                        <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                          <div className="flex items-center justify-between text-xs text-[#cccccc] mb-1 font-semibold">
                            <span>{locale === "es" ? "Progreso del Módulo" : locale === "fr" ? "Progrès du Module" : locale === "pt" ? "Progresso do Módulo" : "Module Progress"}</span>
                            <span className="text-[#2997ff]">
                              {activeModuleCompletedCount} / {activeAcademyModule.moduleIds.length}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-[#2997ff] rounded-full transition-all duration-500"
                              style={{ width: `${Math.round((activeModuleCompletedCount / activeAcademyModule.moduleIds.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Module Accordions */}
                      <div className="space-y-3">
                        {ACADEMY_STRUCTURE.map((acadMod) => {
                          const isExpanded = expandedCurriculumModules.has(acadMod.id);
                          const modTitle = getModuleTitle(acadMod.titleKey);
                          const modLessons = acadMod.moduleIds.map((id) => TRAINING_MODULES.find((m) => m.id === id)!);
                          const modCompleted = acadMod.moduleIds.filter((id) => completedLessonIds.has(id)).length;

                          return (
                            <div key={acadMod.id} className="rounded-xl border border-white/10 bg-black/40 overflow-hidden transition-colors">
                              {/* Module Header Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  toggleCurriculumModule(acadMod.id);
                                }}
                                className="w-full p-3.5 flex items-center justify-between gap-2 text-left hover:bg-white/5 transition-colors"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-tl-gold">
                                      {locale === "es" ? `MÓDULO ${acadMod.num}` : locale === "fr" ? `MODULE ${acadMod.num}` : locale === "pt" ? `MÓDULO ${acadMod.num}` : `MODULE ${acadMod.num}`}
                                    </span>
                                    <span className="text-[10px] font-medium text-[#cccccc] bg-white/10 px-1.5 py-0.5 rounded">
                                      {modCompleted}/{acadMod.moduleIds.length} {locale === "es" ? "completado" : "completed"}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-extrabold text-white truncate">{modTitle}</h4>
                                </div>
                                <span className="text-[#cccccc] p-1">
                                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </span>
                              </button>

                              {/* Lesson Items inside Module */}
                              {isExpanded && (
                                <div className="border-t border-white/10 p-1.5 space-y-1 bg-white/[0.01]">
                                  {modLessons.map((lesson, idx) => {
                                    const loc = getLocalizedLesson(lesson);
                                    const isCurrentActive = lesson.id === activeLessonId && !activeModuleOverviewId;
                                    const isDone = completedLessonIds.has(lesson.id);

                                    return (
                                      <button
                                        key={lesson.id}
                                        type="button"
                                        onClick={() => {
                                          setActiveLessonId(lesson.id);
                                          setActiveModuleOverviewId(null);
                                          setShowMobileCurriculum(false);
                                        }}
                                        className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all text-xs ${
                                          isCurrentActive
                                            ? "border-l-2 border-[#2997ff] bg-cyan-500/15 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                                            : isDone
                                              ? "text-[#cccccc] hover:bg-white/5 hover:text-white"
                                              : "text-[#cccccc] hover:bg-white/5 hover:text-white"
                                        }`}
                                      >
                                        <span className="shrink-0">
                                          {isCurrentActive ? (
                                            <Play className="w-3.5 h-3.5 fill-[#2997ff] text-[#2997ff]" />
                                          ) : isDone ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                          ) : (
                                            <Circle className="w-3.5 h-3.5 text-neutral-600" />
                                          )}
                                        </span>
                                        <span className="truncate flex-1 leading-snug">
                                          {idx + 1}. {loc.title}
                                        </span>
                                        {lesson.duration && (
                                          <span className="text-[10px] text-[#86868b] shrink-0 font-medium">
                                            {lesson.duration}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );

                  return (
                    <section className="mb-12">
                      {/* Mobile Curriculum Toggle Drawer Button */}
                      <div className="mb-6 lg:hidden">
                        <button
                          type="button"
                          onClick={() => setShowMobileCurriculum(!showMobileCurriculum)}
                          className="flex items-center justify-between w-full p-4 rounded-xl border border-cyan-500/30 bg-neutral-900/90 text-white font-bold shadow-lg"
                        >
                          <div className="flex items-center gap-2.5">
                            <BookOpenCheck className="w-5 h-5 text-[#2997ff]" />
                            <span className="text-sm">
                              {showMobileCurriculum
                                ? (locale === "es" ? "Ocultar plan de estudios" : "Hide Course Curriculum")
                                : (locale === "es" ? "Ver plan de estudios" : "View Course Curriculum")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-[#2997ff] border border-cyan-500/30">
                              {academyProgressPercent}%
                            </span>
                            {showMobileCurriculum ? <ChevronDown className="w-4 h-4 text-[#cccccc]" /> : <ChevronRight className="w-4 h-4 text-[#cccccc]" />}
                          </div>
                        </button>

                        {/* Mobile Drawer Accordion */}
                        {showMobileCurriculum && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 rounded-2xl border border-white/15 bg-neutral-950 p-5 shadow-2xl space-y-4"
                          >
                            {renderCurriculumSidebar()}
                          </motion.div>
                        )}
                      </div>

                      {/* Main LMS 2-Column Desktop Grid */}
                      <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 items-start">
                        {/* LEFT COLUMN: Focused Video Player & Active Lesson / Module Overview */}
                        <div className="space-y-6 min-w-0">
                          {activeModuleOverviewId ? (
                            /* MODULE OVERVIEW PAGE */
                            (() => {
                              const overviewMod = ACADEMY_STRUCTURE.find((m) => m.id === activeModuleOverviewId) || ACADEMY_STRUCTURE[0];
                              const overviewModTitle = getModuleTitle(overviewMod.titleKey);
                              const overviewLessons = overviewMod.moduleIds.map((id) => TRAINING_MODULES.find((m) => m.id === id)!);

                              return (
                                <motion.div
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="space-y-6"
                                >
                                  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-md">
                                    <button
                                      type="button"
                                      onClick={() => setActiveModuleOverviewId(null)}
                                      className="inline-flex items-center gap-2 text-xs font-bold text-[#2997ff] mb-4 hover:underline"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      {locale === "es" ? "Volver a la lección activa" : "Back to active lesson"}
                                    </button>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-tl-gold mb-2">
                                      {locale === "es" ? `MÓDULO ${overviewMod.num}` : `MODULE ${overviewMod.num}`}
                                    </p>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white">{overviewModTitle}</h2>
                                    <p className="mt-3 text-sm text-[#cccccc] leading-relaxed">
                                      {locale === "es"
                                        ? "Completa estas lecciones en secuencia para dominar este nivel y avanzar en tu negocio Enagic."
                                        : "Complete these lessons in sequence to master this level and advance your Enagic business."}
                                    </p>
                                  </div>

                                  <div className="space-y-3">
                                    {overviewLessons.map((lesson, idx) => {
                                      const loc = getLocalizedLesson(lesson);
                                      const isDone = completedLessonIds.has(lesson.id);
                                      const thumb = getYouTubeThumbnail(lesson.videoUrl);

                                      return (
                                        <div
                                          key={lesson.id}
                                          onClick={() => {
                                            setActiveLessonId(lesson.id);
                                            setActiveModuleOverviewId(null);
                                          }}
                                          className="group p-4 rounded-xl border border-white/10 bg-black/50 hover:border-cyan-400/40 hover:bg-cyan-500/[0.03] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                        >
                                          {/* Thumbnail image (No iframe loaded for overview performance) */}
                                          <div className="relative w-full sm:w-36 aspect-video rounded-lg overflow-hidden border border-white/10 bg-neutral-900 shrink-0">
                                            {thumb ? (
                                              <img src={thumb} alt={loc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center bg-cyan-950/40 text-[#2997ff]">
                                                <Play className="w-6 h-6" />
                                              </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                              <span className="w-9 h-9 rounded-full bg-cyan-400/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-black text-[#2997ff]">0{idx + 1}</span>
                                              <span className="text-xs text-[#cccccc] font-medium">• {lesson.duration}</span>
                                              {isDone && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                  <CheckCircle2 className="w-3 h-3" /> {locale === "es" ? "Completado" : "Completed"}
                                                </span>
                                              )}
                                            </div>
                                            <h3 className="font-bold text-white text-base group-hover:text-[#2997ff] transition-colors">{loc.title}</h3>
                                            <p className="text-xs text-[#cccccc] line-clamp-2 mt-1">{loc.description}</p>
                                          </div>

                                          <button
                                            type="button"
                                            className="shrink-0 px-4 py-2 rounded-lg bg-white/5 group-hover:bg-cyan-400 group-hover:text-slate-950 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                                          >
                                            {locale === "es" ? "Iniciar lección" : "Start Lesson"} <ArrowRight className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              );
                            })()
                          ) : (
                            /* ACTIVE LESSON FOCUSED PLAYER MODE */
                            (() => {
                              const loc = getLocalizedLesson(activeLesson);
                              const isCompleted = completedLessonIds.has(activeLesson.id);

                              return (
                                <motion.div
                                  key={activeLesson.id}
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-6"
                                >
                                  {/* Lesson Header */}
                                  <div>
                                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                      <span className="text-xs font-black uppercase tracking-[0.25em] text-tl-gold">
                                        {locale === "es" ? `MÓDULO ${activeAcademyModule.num}` : `MODULE ${activeAcademyModule.num}`} • {getModuleTitle(activeAcademyModule.titleKey)}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setActiveModuleOverviewId(activeAcademyModule.id)}
                                        className="text-xs font-bold text-[#2997ff] hover:underline flex items-center gap-1"
                                      >
                                        {locale === "es" ? "Ver resumen del módulo" : "View Module Overview"} →
                                      </button>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                                      {loc.title}
                                    </h1>
                                    <div className="flex items-center gap-3 text-xs text-[#cccccc] font-medium flex-wrap">
                                      {activeLesson.duration && (
                                        <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                          <Clock className="w-3.5 h-3.5 text-[#2997ff]" /> {activeLesson.duration}
                                        </span>
                                      )}
                                      <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md capitalize">
                                        <Target className="w-3.5 h-3.5 text-[#2997ff]" /> {activeLesson.level}
                                      </span>
                                      <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                        {locale === "es" ? `Lección ${activeLessonIndexInModule + 1} de ${activeAcademyModule.moduleIds.length}` : `Lesson ${activeLessonIndexInModule + 1} of ${activeAcademyModule.moduleIds.length}`}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Prominent Video Player (ONLY instantiates iframe for active lesson) */}
                                  <div className="relative w-full aspect-video rounded-2xl border border-white/15 bg-black shadow-2xl overflow-hidden shadow-cyan-500/10">
                                    {activeLesson.videoUrl ? (
                                      <iframe
                                        src={toEmbedUrl(activeLesson.videoUrl)}
                                        title={loc.title}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                      />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-[#cccccc] text-sm">
                                        No video available for this lesson.
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Bar Under Video */}
                                  <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                                    {/* Mark Complete Toggle Button */}
                                    <button
                                      type="button"
                                      onClick={() => toggleLessonComplete(activeLesson.id)}
                                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                                        isCompleted
                                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                                          : "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:shadow-cyan-500/20 hover:scale-[1.02]"
                                      }`}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      {isCompleted
                                        ? (locale === "es" ? "Lección completada ✓" : "Lesson Completed ✓")
                                        : (locale === "es" ? "Marcar como completada" : "Mark Complete")}
                                    </button>

                                    {/* Previous / Next Lesson Buttons */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        disabled={!prevLessonId}
                                        onClick={() => {
                                          if (prevLessonId) {
                                            setActiveLessonId(prevLessonId);
                                            setActiveModuleOverviewId(null);
                                          }
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <ChevronLeft className="w-4 h-4" />
                                        {locale === "es" ? "Anterior" : "Previous"}
                                      </button>
                                      <button
                                        type="button"
                                        disabled={!nextLessonId}
                                        onClick={() => {
                                          if (nextLessonId) {
                                            setActiveLessonId(nextLessonId);
                                            setActiveModuleOverviewId(null);
                                          }
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        {locale === "es" ? "Siguiente" : "Next"}
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Lesson Description & Resources */}
                                  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.025] space-y-6">
                                    <div>
                                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#2997ff] mb-2">
                                        {locale === "es" ? "Acerca de esta lección" : "About this lesson"}
                                      </h3>
                                      <p className="text-[#cccccc] text-sm sm:text-base leading-relaxed">
                                        {loc.description}
                                      </p>
                                    </div>

                                    {/* Resources Downloads */}
                                    {activeLesson.resources.length > 0 && (
                                      <div className="border-t border-white/10 pt-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#cccccc] mb-3 flex items-center gap-2">
                                          <Download className="w-4 h-4 text-[#2997ff]" />
                                          {locale === "es" ? "Descargas y Recursos" : "Downloads & Resources"} ({activeLesson.resources.length})
                                        </h4>
                                        <div className="grid gap-2.5 sm:grid-cols-2">
                                          {activeLesson.resources.map((res, rIdx) => {
                                            const resTitle = loc.resources?.[rIdx] || res.title;
                                            return (
                                              <a
                                                key={rIdx}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-black/40 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all text-xs group"
                                              >
                                                <FileText className="w-4 h-4 text-[#2997ff] shrink-0" />
                                                <span className="text-slate-200 font-medium truncate flex-1 group-hover:text-white">
                                                  {resTitle}
                                                </span>
                                                <span className="text-[10px] text-[#86868b] uppercase font-bold px-1.5 py-0.5 rounded bg-white/5">
                                                  {res.type}
                                                </span>
                                                <ExternalLink className="w-3.5 h-3.5 text-[#cccccc] group-hover:text-[#2997ff]" />
                                              </a>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* NEXT LESSON Preview Card */}
                                  {nextLesson && (() => {
                                    const nextLoc = getLocalizedLesson(nextLesson);
                                    const nextThumb = getYouTubeThumbnail(nextLesson.videoUrl);

                                    return (
                                      <div
                                        onClick={() => {
                                          setActiveLessonId(nextLesson.id);
                                          setActiveModuleOverviewId(null);
                                          window.scrollTo({ top: 300, behavior: "smooth" });
                                        }}
                                        className="group p-5 rounded-2xl border border-white/15 bg-gradient-to-r from-cyan-950/30 via-neutral-950 to-blue-950/30 hover:border-cyan-400/50 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl"
                                      >
                                        <div className="flex items-center gap-4 min-w-0">
                                          {/* Thumbnail */}
                                          <div className="relative w-28 aspect-video rounded-lg overflow-hidden border border-white/10 bg-neutral-900 shrink-0">
                                            {nextThumb ? (
                                              <img src={nextThumb} alt={nextLoc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center bg-cyan-950 text-[#2997ff]">
                                                <Play className="w-5 h-5" />
                                              </div>
                                            )}
                                          </div>

                                          <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2997ff] mb-1">
                                              {locale === "es" ? "SIGUIENTE LECCIÓN" : "NEXT LESSON"}
                                            </p>
                                            <h4 className="font-bold text-white text-base truncate group-hover:text-[#2997ff] transition-colors">
                                              {nextLoc.title}
                                            </h4>
                                            {nextLesson.duration && (
                                              <p className="text-xs text-[#cccccc] mt-1 font-medium">
                                                {nextLesson.duration}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          className="shrink-0 px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 group-hover:bg-cyan-300 transition-colors shadow-md"
                                        >
                                          {locale === "es" ? "Continuar" : "Continue"} <ArrowRight className="w-4 h-4" />
                                        </button>
                                      </div>
                                    );
                                  })()}
                                </motion.div>
                              );
                            })()
                          )}
                        </div>

                        {/* RIGHT COLUMN: Sticky Course Curriculum Sidebar (Desktop) */}
                        <aside className="hidden lg:block sticky top-24 rounded-2xl border border-white/10 bg-neutral-950/90 backdrop-blur-xl p-5 shadow-2xl">
                          {renderCurriculumSidebar()}
                        </aside>
                      </div>
                    </section>
                  );
                })()}

                {/* Informational Guides View */}
                {activeView === "guides" && (
                  <section id="pdf-guides" className="mb-12">
                    <div className="text-center mb-8">
                      <h2 className="section-title mb-4">
                        {copy.training?.essential_guides ||
                          "Essential Product Guides"}
                      </h2>
                      <p className="text-[#cccccc] max-w-2xl mx-auto">
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
                                <FileText className="w-6 h-6 text-[#2997ff]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white mb-2 group-hover:text-[#2997ff] transition-colors">
                                  {title}
                                </h3>
                                <p className="text-[#cccccc] text-sm leading-relaxed">
                                  {desc}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="px-2 py-1 rounded-md text-xs uppercase tracking-wider text-[#86868b] bg-white/5 border border-white/10">
                                {pdf.category}
                              </span>
                              <ExternalLink className="w-4 h-4 text-[#cccccc] group-hover:text-[#2997ff] transition-colors" />
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
                      className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-sm p-8"
                    >
                      <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                        Sistema de 8 Puntos
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-[#2997ff] mb-3">
                            ¿Cómo funciona?
                          </h4>
                          <p className="text-[#cccccc] mb-4">
                            Enagic utiliza un sistema único de 8 puntos para el
                            pago de comisiones, donde "1A" significa "1 Punto".
                            Cada venta genera un pago de hasta 8 puntos hacia
                            arriba en la estructura de la organización.
                          </p>
                          <ul className="space-y-2 text-[#cccccc]">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-[#2997ff] shrink-0" />{" "}
                              <span className="pt-0.5">
                                Sin cuota mensual de inscripción o mantenimiento
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-[#2997ff] shrink-0" />{" "}
                              <span className="pt-0.5">
                                Sin inventario que mantener
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-[#2997ff] shrink-0" />{" "}
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
                              <span className="text-[#cccccc] font-medium">
                                Kangen K8
                              </span>
                              <span className="text-xl font-bold text-[#2997ff]">
                                $340 USD
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                              <span className="text-[#cccccc] font-medium">
                                emGuarde
                              </span>
                              <span className="text-xl font-bold text-[#2997ff]">
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
                          <tbody className="text-[#cccccc]">
                            <tr>
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-[#2997ff]">
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
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-[#2997ff]">
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
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-[#2997ff]">
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
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-[#2997ff]">
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
                              <td className="py-4 px-6 border-b border-white/5 font-bold text-[#2997ff]">
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
                        <p className="text-[#cccccc] mb-6">
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
                              <span className="text-[#2997ff] font-bold">
                                101 Personas
                              </span>
                            </div>
                            <p className="text-sm text-[#cccccc]">
                              Necesitas encontrar 101 compradores individuales
                              de la máquina K8.
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-5 border border-white/20">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-white">
                                Vendiendo Paquete DUO
                              </span>
                              <span className="text-tl-gold font-bold text-xl">
                                51 Personas
                              </span>
                            </div>
                            <p className="text-sm text-[#cccccc]">
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
                        <ul className="space-y-4 text-[#cccccc]">
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
                              <CheckCircle className="w-5 h-5 text-[#2997ff]" />{" "}
                              Pago de Contado
                            </h4>
                            <p className="text-[#cccccc] text-sm">
                              Tarjeta de crédito, débito o transferencia
                              bancaria. La forma más rápida de obtener tus
                              productos y comenzar.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-[#2997ff]" />{" "}
                              Financiamiento Externo
                            </h4>
                            <p className="text-[#cccccc] text-sm">
                              Tarjetas de crédito a meses (varía por país) o
                              préstamos personales. Ideal para no
                              descapitalizarse e invertir las ganancias en pagar
                              la deuda.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-[#2997ff]" />{" "}
                              Plan Enagic (In-house)
                            </h4>
                            <p className="text-[#cccccc] text-sm">
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
                            <h4 className="text-lg font-semibold text-[#2997ff] mb-4">
                              Qué Necesitamos de Ti
                            </h4>
                            <ul className="space-y-3 text-[#cccccc] text-sm">
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
                            <ul className="space-y-3 text-[#cccccc] text-sm">
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
