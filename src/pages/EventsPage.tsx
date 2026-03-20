import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { EventsFirstTimePrompt } from "@/components/ui/EventsFirstTimePrompt";
import type { TLEvent } from "@/lib/events";
import { EVENTS_FORM_URL, getEventsByRegion, translateEventTimezoneRegion, translateEventTimezoneTime } from "@/lib/events";
import { useEffect } from "react";
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

const LABELS = {
  en: {
    breadcrumbHome: "Home",
    breadcrumbEvents: "Events",
    hero: "Upcoming Events",
    register: "Register now",
    noEvents: "No upcoming events for this region.",
    weeklySessions: "Weekly Live Sessions",
    featuredMasterclass: "Featured Masterclass",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbEvents: "Eventos",
    hero: "Próximos Eventos",
    register: "Regístrate ahora",
    noEvents: "No hay eventos próximos para esta región.",
    weeklySessions: "Sesiones Semanales en Vivo",
    featuredMasterclass: "Clase Magistral Destacada",
  },
  fr: {
    breadcrumbHome: "Accueil",
    breadcrumbEvents: "Événements",
    hero: "Événements à venir",
    register: "S'inscrire maintenant",
    noEvents: "Aucun événement à venir pour cette région.",
    weeklySessions: "Sessions Hebdomadaires en Direct",
    featuredMasterclass: "Masterclass en Vedette",
  },
  pt: {
    breadcrumbHome: "Início",
    breadcrumbEvents: "Eventos",
    hero: "Próximos Eventos",
    register: "Registre-se agora",
    noEvents: "Nenhum evento próximo para esta região.",
    weeklySessions: "Sessões Semanais ao Vivo",
    featuredMasterclass: "Masterclass em Destaque",
  },
};

function EventCard({ event, region, lang, onFirstTimeYes, onFirstTimeNo }: {
  event: TLEvent
  region: string
  lang: "en" | "es" | "fr" | "pt"
  onFirstTimeYes: () => void
  onFirstTimeNo: (url: string) => void
}) {
  const isLatam = region === "latam";

  const desc =
    lang === "es"
      ? event.description_es
      : lang === "fr"
        ? event.description_fr
        : lang === "pt"
          ? (event.description_pt ?? event.description_en)
          : event.description_en;

  const displayTitle =
    lang === "es" && event.title_es
      ? event.title_es
      : lang === "fr" && event.title_fr
        ? event.title_fr
        : lang === "pt" && event.title_pt
          ? event.title_pt
          : event.title;

  const displayDate =
    lang === "es" && event.date_es
      ? event.date_es
      : lang === "fr" && event.date_fr
        ? event.date_fr
        : lang === "pt" && event.date_pt
          ? event.date_pt
          : event.date;

  const timezones = isLatam ? event.latamTimezones : event.timezones;
  const joinUrl = isLatam ? event.latamZoomUrl : (event.joinUrl ?? event.registerUrl);
  const eventImage = isLatam && event.latamImage ? event.latamImage : event.image;

  return (
    <article className="event-card rounded-2xl overflow-hidden border border-white/10 bg-white/5 max-w-3xl mx-auto">
      {eventImage && (
        <div className="relative w-full bg-white/5 flex items-center justify-center p-4">
          <img
            src={eventImage}
            alt={displayTitle}
            className="event-image max-w-full max-h-[500px] w-auto h-auto object-contain"
          />
        </div>
      )}
      <div className="p-5 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {displayTitle}
        </h3>
        <p className="text-[#00a896] font-semibold text-base mb-5">
          {displayDate}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-4 rounded-xl bg-white/5 border border-white/5">
          {timezones.map((tz) => (
            <div key={tz.region} className="text-sm text-slate-300">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
                {translateEventTimezoneRegion(tz.region, lang)}
              </span>
              <span className="font-bold text-white">{translateEventTimezoneTime(tz.time, lang)}</span>
            </div>
          ))}
        </div>
        <div className="whitespace-pre-line text-slate-300 text-sm leading-relaxed mb-6">
          {desc}
        </div>
        {event.hasFirstTimePrompt ? (
          <div className="mb-6">
            <EventsFirstTimePrompt
              onYes={onFirstTimeYes}
              onNo={onFirstTimeNo}
              joinUrl={joinUrl}
              locale={lang}
            />
          </div>
        ) : (
          <div className="mb-6">
            <button
              onClick={() => window.open(joinUrl, '_blank', 'noopener,noreferrer')}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base transition min-h-12"
              style={{ background: "linear-gradient(135deg, #00a896, #00c4ae)" }}
            >
              {lang === "es" ? "Unirse Ahora" : lang === "fr" ? "Rejoindre Maintenant" : lang === "pt" ? "Entrar Agora" : "Join Now"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function EventsPage() {
  const { country: param } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const region = paramToRegion(param);
  const lang = getRegionLocale(region) as keyof typeof LABELS;
  const t = LABELS[lang] ?? LABELS.en;
  const events = getEventsByRegion(region);
  const regionLabel = getRegionBreadcrumbLabel(region, lang);

  const WEEKLY_IDS = new Set(['latam-tuesday-weekly', 'duo-presentation-thursday']);
  const weeklyEvents = events.filter(e => WEEKLY_IDS.has(e.id));
  const featuredEvents = events.filter(e => !WEEKLY_IDS.has(e.id));

  // Redirect old country-slug URLs to region URLs once
  useEffect(() => {
    if (!param) return;
    const lower = param.toLowerCase();
    if (REGIONS.includes(lower as RegionSlug)) return;
    const targetRegion = COUNTRY_TO_REGION[lower] ?? DEFAULT_REGION;
    navigate(`/events/${targetRegion}`, { replace: true });
  }, [param, navigate]);

  const handleFirstTimeYes = () => {
    window.open(EVENTS_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleFirstTimeNo = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-wrapper bg-[#060b1e] text-white">
      <SEO
        title={
          lang === "es"
            ? "True Legacy — Próximos Eventos | LATAM"
            : lang === "fr"
              ? "True Legacy — Événements à Venir"
              : "True Legacy — Upcoming Events in 51+ Countries"
        }
        description={
          lang === "es"
            ? "Uúnete a los eventos semanales de True Legacy — presentaciones en vivo cada jueves y martes para comunidades en más de 51 países."
            : lang === "fr"
              ? "Rejoignez les événements hebdomadaires de True Legacy — présentations en direct chaque jeudi et mardi dans plus de 51 pays."
              : "Join True Legacy's weekly live events — Thursday global presentations and Tuesday LATAM sessions for Enagic distributors across 51+ countries."
        }
        image="/logos/tl-square-white.png"
      />
      <Navbar />
      <div className="content-wrapper mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="section-title text-center mb-10">
          {t.hero} — {regionLabel}
        </h1>

        {events.length === 0 ? (
          <p className="text-slate-400">{t.noEvents}</p>
        ) : (
          <div className="space-y-10">
            {weeklyEvents.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-[#00a896] text-center tracking-wide">
                  {t.weeklySessions}
                </h2>
                {weeklyEvents.map((event) => (
                  <EventCard key={event.id} event={event} region={region} lang={lang} onFirstTimeYes={handleFirstTimeYes} onFirstTimeNo={handleFirstTimeNo} />
                ))}
              </>
            )}
            {featuredEvents.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-[#00a896] text-center tracking-wide mt-4">
                  {t.featuredMasterclass}
                </h2>
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} region={region} lang={lang} onFirstTimeYes={handleFirstTimeYes} onFirstTimeNo={handleFirstTimeNo} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
