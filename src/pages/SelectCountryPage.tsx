import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { GlobeIcon } from "@/components/ui/GlobeIcon";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { COUNTRIES, getFlagSrcSet } from "@/lib/countries";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const CONTINENT_DATA: Record<
  string,
  {
    name: string;
    countries: Array<{ code: string; name: string; slug: string }>;
  }
> = {
  "north-america": {
    name: "North America",
    countries: [
      { code: "us", name: "United States", slug: "usa" },
      { code: "ca", name: "Canada", slug: "canada" },
    ],
  },
  "south-america": {
    name: "Sudamérica",
    countries: [
      { code: "co", name: "Colombia", slug: "colombia" },
      { code: "py", name: "Paraguay", slug: "paraguay" },
      { code: "mx", name: "Mexico", slug: "mexico" },
      { code: "br", name: "Brazil", slug: "brazil" },
    ],
  },
  africa: {
    name: "Africa",
    countries: [
      { code: "ma", name: "Morocco", slug: "morocco" },
      { code: "ng", name: "Nigeria", slug: "nigeria" },
    ],
  },
  europe: {
    name: "Europe",
    countries: [
      { code: "tr", name: "Turkey", slug: "turkey" },
      { code: "es", name: "Spain", slug: "spain" },
      { code: "eu", name: "European Union", slug: "eu" },
    ],
  },
  "middle-east": {
    name: "Middle East",
    countries: [{ code: "ae", name: "UAE", slug: "uae" }],
  },
  asia: {
    name: "Asia",
    countries: [
      { code: "in", name: "India", slug: "india" },
      { code: "my", name: "Malaysia", slug: "malaysia" },
    ],
  },
};

export default function SelectCountryPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const continent = params.get("continent") || "";
  const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(
    new Set(),
  );

  const { locale, setLocale } = useLocaleContext();
  useEffect(() => {
    if (continent === "south-america") {
      setLocale("es");
    }
  }, [continent, setLocale]);

  const isInvalidContinent = continent && !CONTINENT_DATA[continent];
  const isAllCountries = !continent || isInvalidContinent;

  const displayData = useMemo(() => {
    if (isAllCountries) {
      return {
        name: "All Countries",
        countries: COUNTRIES.map((c) => ({
          slug: c.slug,
          name: c.name,
          flagEmoji: c.flagEmoji,
        })),
      };
    }

    // Map the continent data to include the properties we need for rendering
    const contData = CONTINENT_DATA[continent];

    const continentName =
      continent === "europe"
        ? locale === "es"
          ? "Europa"
          : locale === "fr"
            ? "Europe"
            : locale === "pt"
              ? "Europa"
              : "Europe"
        : locale === "es" && continent === "south-america"
          ? "Sudamérica / LATAM"
          : contData.name;

    return {
      name: continentName,
      countries: contData.countries.map((c) => {
        // Find the full country object from COUNTRIES to get the flagEmoji
        const fullCountry = COUNTRIES.find(
          (country) => country.slug === c.slug,
        );
        return {
          slug: c.slug,
          name: fullCountry?.name || c.name,
          flagEmoji: fullCountry?.flagEmoji || "🌍",
        };
      }),
    };
  }, [continent, isAllCountries, locale]);

  if (isInvalidContinent) {
    return (
      <div
        className="page-wrapper min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(160deg, #020d16 0%, #041824 60%, #021018 100%)",
        }}
      >
        <Navbar />
        <div className="content-wrapper flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <GlobeIcon className="w-16 h-16 text-[#2997ff] opacity-80" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight break-words">
              Let's get you to the right region
            </h1>
            <p className="text-[#cccccc] mb-8 text-sm md:text-base leading-relaxed">
              We couldn't find the region you're looking for. Please try
              selecting a region from the world map or view all available
              countries.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Back to World Map
              </Link>
              <Link
                to="/select-country"
                className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-[#cccccc] border border-white/10 hover:text-white hover:bg-white/5 transition-all"
              >
                Browse all countries
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-wrapper min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, #020d16 0%, #041824 60%, #021018 100%)",
      }}
    >
      <SEO title="Choose Your Market | True Legacy World" description="Select one of True Legacy's 14 featured markets to view localized product education, events, and distributor support." />
      <Navbar />
      <div className="content-wrapper flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 relative w-full">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors"
          >
            ←{" "}
            {locale === "es" && continent === "south-america"
              ? "Volver al Mapa"
              : "Back to Map"}
          </button>
        </div>

        <div className="text-center mb-10 w-full max-w-2xl mx-auto px-2">
          <div className="flex justify-center mb-6">
            <GlobeIcon className="w-16 h-16 md:w-20 md:h-20 text-[#2997ff] opacity-80" />
          </div>
          <h1 className="page-hero-title mb-4 gradient-text text-3xl md:text-5xl font-bold break-words leading-tight">
            {displayData.name}
          </h1>
          <p className="text-[#cccccc] text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            {locale === "es" && continent === "south-america"
              ? "Selecciona tu país para explorar los productos y unirte al equipo True Legacy cerca de ti"
              : "Select your country to explore products and join the True Legacy team near you"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 md:gap-5 pb-12 justify-items-center place-content-center w-full max-w-6xl mx-auto">
          {displayData.countries.map((country) => (
            <button
              key={country.slug}
              onClick={() => {
                try {
                  sessionStorage.setItem("last_page", window.location.href);
                  sessionStorage.setItem("last_page_label", "Select Region");
                  sessionStorage.setItem("last_continent_id", continent);
                  sessionStorage.setItem(
                    "last_continent_name",
                    displayData.name,
                  );
                } catch {
                  /* ignore */
                }
                navigate(`/${country.slug}`);
              }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
                padding: "32px 24px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                transition: "all 0.25s ease",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,168,150,0.1)";
                e.currentTarget.style.borderColor = "rgba(0,168,150,0.5)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)";
                const cta = e.currentTarget.querySelector(
                  "[data-cta]",
                ) as HTMLElement | null;
                if (cta) cta.style.color = "#00a896";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
                const cta = e.currentTarget.querySelector(
                  "[data-cta]",
                ) as HTMLElement | null;
                if (cta) cta.style.color = "#4a7a8a";
              }}
            >
              <span
                className="inline-flex overflow-hidden rounded border-2 border-white/15 bg-black shadow-xl"
                style={{ width: "96px", height: "64px" }}
              >
                {failedFlagSlugs.has(country.slug) ? (
                  <span className="flex h-full w-full items-center justify-center text-3xl leading-none">
                    {country.flagEmoji}
                  </span>
                ) : (
                  <img
                    {...getFlagSrcSet(country.slug)}
                    alt={country.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={() =>
                      setFailedFlagSlugs((prev) =>
                        new Set(prev).add(country.slug),
                      )
                    }
                  />
                )}
              </span>
              <div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#ffffff",
                    letterSpacing: "-0.2px",
                    marginBottom: "4px",
                  }}
                >
                  {country.name}
                </div>
                <div
                  data-cta
                  style={{
                    fontSize: "12px",
                    color: "#4a7a8a",
                    fontWeight: "600",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}
                >
                  {locale === "es" ? "VER PRODUCTOS →" : "View Products →"}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="w-full max-w-6xl mx-auto mt-12 mb-8 text-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-2">
            {locale === "es" && continent === "south-america"
              ? "¿No ves tu país?"
              : "Don't see your country?"}
          </h3>
          <p className="text-[#cccccc] mb-6 max-w-2xl mx-auto">
            {locale === "es" && continent === "south-america"
              ? "Contáctanos por WhatsApp para más información. Más países se agregarán pronto."
              : "Contact us via WhatsApp for more information. More countries will be added soon."}
          </p>
          <a
            href={
              continent === "south-america"
                ? "https://wa.me/5213327464016"
                : "https://wa.me/19495726207"
            }
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            {locale === "es" && continent === "south-america"
              ? "Contactar por WhatsApp"
              : "Contact via WhatsApp"}
          </a>
        </div>
      </div>
    </div>
  );
}
