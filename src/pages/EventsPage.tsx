import { Navbar } from "@/components/layout/Navbar";
import { EventsFirstTimePrompt } from "@/components/ui/EventsFirstTimePrompt";
import { EventsLeadCaptureModal } from "@/components/ui/EventsLeadCaptureModal";
import { UPCOMING_EVENTS } from "@/lib/events";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const REGIONS = ["latam", "global", "asia", "africa"] as const;
type RegionSlug = (typeof REGIONS)[number];

const COUNTRY_TO_REGION: Record<string, RegionSlug> = {
  brazil: "latam",
  mexico: "latam",
  colombia: "latam",
  paraguay: "latam",
  india: "asia",
  uae: "asia",
  malaysia: "asia",
  nigeria: "africa",
  morocco: "africa",
};
const DEFAULT_REGION: RegionSlug = "global";

function paramToRegion(param: string | undefined): RegionSlug {
  if (!param) return DEFAULT_REGION;
  const lower = param.toLowerCase();
  if (REGIONS.includes(lower as RegionSlug)) return lower as RegionSlug;
  return (COUNTRY_TO_REGION[lower] as RegionSlug) ?? DEFAULT_REGION;
}

function getRegionLocale(region: RegionSlug): "en" | "es" | "fr" | "pt" {
  if (region === "latam") return "es";
  if (region === "africa") return "en";
  return "en";
}

function getRegionBreadcrumbLabel(region: RegionSlug, locale: string): string {
  if (region === "latam") return locale === "es" ? "LATAM" : "Sudamérica";
  if (region === "global") return "Global";
  if (region === "asia") return "Asia";
  if (region === "africa") return "Africa";
  return "Events";
}

// UPCOMING_EVENTS is imported from @/lib/events

const LABELS = {
  en: {
    breadcrumbHome: "Home",
    breadcrumbEvents: "Events",
    hero: "Upcoming Events",
    register: "Register now",
    noEvents: "No upcoming events for this region.",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbEvents: "Eventos",
    hero: "Próximos Eventos",
    register: "Regístrate ahora",
    noEvents: "No hay eventos próximos para esta región.",
  },
  fr: {
    breadcrumbHome: "Accueil",
    breadcrumbEvents: "Événements",
    hero: "Événements à venir",
    register: "S'inscrire maintenant",
    noEvents: "Aucun événement à venir pour cette région.",
  },
  pt: {
    breadcrumbHome: "Início",
    breadcrumbEvents: "Eventos",
    hero: "Próximos Eventos",
    register: "Registre-se agora",
    noEvents: "Nenhum evento próximo para esta região.",
  },
};

export default function EventsPage() {
  const { country: param } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const region = paramToRegion(param);
  const lang = getRegionLocale(region) as keyof typeof LABELS;
  const t = LABELS[lang] ?? LABELS.en;
  const events = UPCOMING_EVENTS;
  const regionLabel = getRegionBreadcrumbLabel(region, lang);
  const isSpanish = lang === "es";

  const [leadCaptureOpen, setLeadCaptureOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

  // Redirect old country-slug URLs to region URLs once
  useEffect(() => {
    if (!param) return;
    const lower = param.toLowerCase();
    if (REGIONS.includes(lower as RegionSlug)) return;
    const targetRegion = COUNTRY_TO_REGION[lower] ?? DEFAULT_REGION;
    navigate(`/events/${targetRegion}`, { replace: true });
  }, [param, navigate]);

  const handleFirstTimeYes = (eventTitle: string) => {
    setSelectedEventTitle(eventTitle);
    setLeadCaptureOpen(true);
  };

  const handleFirstTimeNo = (joinUrl: string) => {
    window.open(joinUrl, "_blank");
  };

  const handleLeadCaptureSuccess = () => {
    setLeadCaptureOpen(false);
  };

  return (
    <div className="page-wrapper bg-[#060b1e] text-white">
      <Navbar />
      <div className="content-wrapper mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="section-title text-center mb-10">
          {t.hero} — {regionLabel}
        </h1>

        {events.length === 0 ? (
          <p className="text-slate-400">{t.noEvents}</p>
        ) : (
          <div className="space-y-10">
            {events.map((event) => {
              const desc =
                lang === "es"
                  ? event.description_es
                  : lang === "fr"
                    ? event.description_fr
                    : event.description_en;

              const isLatam = region === "latam";
              const timezones = isLatam
                ? event.latamTimezones
                : event.timezones;
              const joinUrl = isLatam ? event.latamZoomUrl : event.registerUrl;

              return (
                <article
                  key={event.id}
                  className="event-card rounded-2xl overflow-hidden border border-white/10 bg-white/5 max-w-3xl mx-auto"
                >
                  <div className="relative w-full bg-white/5 flex items-center justify-center p-4">
                    <img
                      src={
                        isLatam && event.latamImage
                          ? event.latamImage
                          : event.image
                      }
                      alt={event.title}
                      className="event-image max-w-full max-h-[500px] w-auto h-auto object-contain"
                    />
                  </div>
                  <div className="p-5 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {region === "latam"
                        ? "CLASE MAGISTRAL SOBRE EL VERDADERO LEGADO"
                        : event.title}
                    </h2>
                    <p className="text-[#00a896] font-semibold text-base mb-5">
                      {event.date}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-4 rounded-xl bg-white/5 border border-white/5">
                      {timezones.map((tz) => (
                        <div key={tz.region} className="text-sm text-slate-300">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
                            {tz.region}
                          </span>
                          <span className="font-bold text-white">
                            {tz.time}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="whitespace-pre-line text-slate-300 text-sm leading-relaxed mb-6">
                      {desc}
                    </div>

                    {/* First Time Prompt - Always Visible */}
                    <div className="mb-6">
                      <EventsFirstTimePrompt
                        onYes={() => handleFirstTimeYes(event.title)}
                        onNo={handleFirstTimeNo}
                        joinUrl={joinUrl}
                        isSpanish={isSpanish}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <EventsLeadCaptureModal
        isOpen={leadCaptureOpen}
        onClose={() => setLeadCaptureOpen(false)}
        onSuccess={handleLeadCaptureSuccess}
        region={region}
        eventTitle={selectedEventTitle || events[0]?.title || "Event"}
        isSpanish={isSpanish}
      />
    </div>
  );
}
