import TrueLegacyLogo from "@/components/ui/TrueLegacyLogo";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsVectorMap?: { new (...args: any[]): { destroy?: () => void } };
  }
}

const CONTINENTS = [
  {
    id: "north-america",
    nameEn: "N. America",
    nameEs: "Norteamérica",
    nameFr: "Amérique du Nord",
    namePt: "N. América",
    lat: 45.5,
    lng: -125.0,
  },
  {
    id: "south-america",
    nameEn: "S. America / LATAM",
    nameEs: "Sudamérica / LATAM",
    nameFr: "Amérique latine",
    namePt: "América do Sul / LATAM",
    lat: -10.0,
    lng: -80.0,
  },
  {
    id: "europe",
    nameEn: "Europe",
    nameEs: "Europa",
    nameFr: "Europe",
    namePt: "Europa",
    lat: 57.5,
    lng: 2.0,
  },
  {
    id: "middle-east",
    nameEn: "Middle East",
    nameEs: "Medio Oriente",
    nameFr: "Moyen-Orient",
    namePt: "Oriente Médio",
    lat: 20.0,
    lng: 64.0,
  },
  {
    id: "africa",
    nameEn: "Africa",
    nameEs: "África",
    nameFr: "Afrique",
    namePt: "África",
    lat: 12.5,
    lng: -8.0,
  },
  {
    id: "asia",
    nameEn: "Asia",
    nameEs: "Asia",
    nameFr: "Asie",
    namePt: "Ásia",
    lat: 60.0,
    lng: 88.0,
  },
];

function latLngToPercent(lat: number, lng: number) {
  const x = (lng + 180) / 360;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const mercFull = 0.5 - mercN / (2 * Math.PI);
  const topBound =
    0.5 -
    Math.log(Math.tan(Math.PI / 4 + (83.5 * Math.PI) / 180 / 2)) /
      (2 * Math.PI);
  const botBound =
    0.5 -
    Math.log(Math.tan(Math.PI / 4 + (-56 * Math.PI) / 180 / 2)) / (2 * Math.PI);
  const y = (mercFull - topBound) / (botBound - topBound);
  return { x, y };
}

export function WorldMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { locale, setLocale } = useLocaleContext();
  const [mapReady, setMapReady] = useState(false);
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.jsVectorMap ||
      !mapContainerRef.current
    )
      return;

    const map = new window.jsVectorMap({
      selector: "#world-map",
      map: "world",
      backgroundColor: "transparent",
      zoomButtons: false,
      zoomOnScroll: false,
      draggable: false,
      showTooltip: false,
      regionsSelectable: false,
      regionsSelectableOne: false,
      selectedRegions: [],
      regionStyle: {
        initial: {
          fill: "#0d2535",
          stroke: "#071824",
          strokeWidth: 0.4,
          fillOpacity: 1,
          cursor: "default",
        },
        hover: {
          fill: "#112d42",
          fillOpacity: 1,
          cursor: "default",
        },
        selected: {
          fill: "#0d2535",
          cursor: "default",
        },
        selectedHover: {
          fill: "#0d2535",
          cursor: "default",
        },
      },
      markers: [],
      onRegionClick(e: Event) {
        e.preventDefault();
        (e as Event & { stopPropagation?: () => void }).stopPropagation?.();
        return false;
      },
      onRegionTooltipShow(e: Event) {
        e.preventDefault();
        return false;
      },
    });

    setTimeout(() => {
      const wrapper = document.getElementById("world-map");
      if (wrapper) {
        wrapper.style.touchAction = "pan-y";
        wrapper
          .querySelectorAll(".jvm-tooltip, text, .jvm-marker-label")
          .forEach((el) => el.remove());
        wrapper.querySelectorAll("path").forEach((p) => {
          (p as SVGElement).style.pointerEvents = "none";
          (p as SVGElement).style.cursor = "default";
        });
        const svg = wrapper.querySelector("svg");
        if (svg) {
          svg.style.touchAction = "pan-y";
        }
      }
      setMapReady(true);
    }, 350);

    return () => {
      try {
        map?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const getContinentName = (c: (typeof CONTINENTS)[0]) => {
    if (locale === "es") return c.nameEs;
    if (locale === "fr") return c.nameFr;
    if (locale === "pt") return (c as { namePt?: string }).namePt ?? c.nameEs;
    return c.nameEn;
  };

  const handleContinentClick = (continentId: string) => {
    try {
      sessionStorage.setItem("last_page", window.location.href);
      sessionStorage.setItem("last_page_label", "World Map");
      if (continentId === "south-america") {
        setLocale("es");
      }
    } catch {
      /* ignore */
    }
    navigate(`/select-country?continent=${continentId}`);
  };

  return (
    <div className="map-section w-full" style={{ touchAction: "pan-y" }}>
      <div
        id="map-wrapper"
        className="map-wrapper relative w-full flex items-center justify-center"
        style={{ position: "relative", touchAction: "pan-y" }}
      >
        <div
          ref={mapContainerRef}
          id="world-map"
          className="w-full rounded-2xl overflow-hidden"
          style={{ width: "100%", height: "300px", touchAction: "pan-y" }}
        />
        <div
          className="map-logo-overlay"
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 50,
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
          }}
          aria-hidden
        >
          <TrueLegacyLogo variant="mapOverlay" />
        </div>

        {mapReady && (
          <div
            id="pin-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 100,
            }}
          >
            {CONTINENTS.map((c) => {
              const { x, y } = latLngToPercent(c.lat, c.lng);
              const left = `${(x * 100).toFixed(2)}%`;
              const top = `${(y * 100).toFixed(2)}%`;

              return (
                <div
                  key={c.id}
                  className={`continent-pin ${hoveredContinent === c.id ? "pin-hovered" : ""}`}
                  style={{
                    position: "absolute",
                    left,
                    top,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "all",
                    cursor: "pointer",
                    zIndex: 101,
                  }}
                  onClick={() => handleContinentClick(c.id)}
                  onMouseEnter={() => setHoveredContinent(c.id)}
                  onMouseLeave={() => setHoveredContinent(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleContinentClick(c.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={getContinentName(c)}
                >
                  <div className="pin-pulse-ring" />
                  <div className="pin-pulse-ring pin-pulse-ring--delay" />
                  <div className="pin-dot">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                    >
                      <circle cx="7" cy="7" r="7" fill="#F5A623" />
                      <circle
                        cx="7"
                        cy="7"
                        r="3.5"
                        fill="#ffffff"
                        fillOpacity="0.9"
                      />
                    </svg>
                  </div>
                  <div className="pin-label">{getContinentName(c)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorldMap;
