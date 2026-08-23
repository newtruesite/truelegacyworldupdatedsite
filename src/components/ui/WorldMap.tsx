import TrueLegacyLogo from "@/components/ui/TrueLegacyLogo";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WORLD_POINTS } from "./worldPoints";

const REGIONS = [
  {
    id: "north-america",
    nameEn: "N. AMERICA",
    nameEs: "NORTEAMÉRICA",
    nameFr: "AMÉRIQUE DU N.",
    namePt: "N. AMÉRICA",
    lat: 45.5,
    lng: -110.0, // adjusted slightly for visual balance on globe
    messageEn: "Established markets and world-class leaders",
    messageEs: "Mercados establecidos y líderes de clase mundial",
    messageFr: "Marchés établis et leaders de classe mondiale",
    messagePt: "Mercados estabelecidos e líderes de classe mundial",
  },
  {
    id: "south-america",
    nameEn: "S. AMERICA / LATAM",
    nameEs: "SUDAMÉRICA / LATAM",
    nameFr: "AMÉRIQUE LATINE",
    namePt: "AMÉRICA DO SUL / LATAM",
    lat: -12.0,
    lng: -60.0,
    messageEn: "Growing True Legacy leadership network",
    messageEs: "Red de liderazgo de True Legacy en crecimiento",
    messageFr: "Réseau de leadership True Legacy en pleine croissance",
    messagePt: "Rede de liderança da True Legacy em crescimento",
  },
  {
    id: "europe",
    nameEn: "EUROPE",
    nameEs: "EUROPA",
    nameFr: "EUROPE",
    namePt: "EUROPA",
    lat: 48.0,
    lng: 15.0,
    messageEn: "Expanding training and community hub",
    messageEs: "Centro de capacitación y comunidad en expansión",
    messageFr: "Centre de formation et communauté en expansion",
    messagePt: "Centro de treinamento e comunidade em expansão",
  },
  {
    id: "africa",
    nameEn: "AFRICA",
    nameEs: "ÁFRICA",
    nameFr: "AFRIQUE",
    namePt: "ÁFRICA",
    lat: 5.0,
    lng: 20.0,
    messageEn: "Emerging markets and new opportunities",
    messageEs: "Mercados emergentes y nuevas oportunidades",
    messageFr: "Marchés émergents et nouvelles opportunités",
    messagePt: "Mercados emergentes e oportunidades",
  },
  {
    id: "middle-east",
    nameEn: "MIDDLE EAST",
    nameEs: "MEDIO ORIENTE",
    nameFr: "MOYEN-ORIENT",
    namePt: "ORIENTE MÉDIO",
    lat: 25.0,
    lng: 45.0,
    messageEn: "Rapidly growing distributor network",
    messageEs: "Red de distribuidores de rápido crecimiento",
    messageFr: "Réseau de distributeurs en croissance rapide",
    messagePt: "Rede de distribuidores em rápido crescimento",
  },
  {
    id: "asia",
    nameEn: "ASIA",
    nameEs: "ASIA",
    nameFr: "ASIE",
    namePt: "ÁSIA",
    lat: 35.0,
    lng: 105.0,
    messageEn: "Established leaders and expanding markets",
    messageEs: "Líderes establecidos y mercados en expansión",
    messageFr: "Leaders établis et marchés en expansion",
    messagePt: "Líderes estabelecidos e mercados em expansão",
  },
];

// Arc connections for international growth visualization (using IDs)
const CONNECTIONS = [
  { from: "north-america", to: "europe" },
  { from: "north-america", to: "asia" },
  { from: "europe", to: "middle-east" },
  { from: "asia", to: "middle-east" },
  { from: "south-america", to: "north-america" },
];

export function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { locale, setLocale } = useLocaleContext();

  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredRegionData, setHoveredRegionData] = useState<{
    name: string;
    message: string;
    x: number;
    y: number;
    regionId: string;
  } | null>(null);

  // Animation values in refs for 60fps canvas loop
  const progressRef = useRef(0); // 0 = Globe, 1 = Flat Map
  const isHoveredRef = useRef(false);
  const rotationRef = useRef(-0.5); // Initial spin position to center Atlantic
  const tiltRef = useRef(0.25); // Globe tilt down around X-axis
  const autoRotationSpeed = 0.002;

  // Dragging states
  const isDragging = useRef(false);
  const startMouseX = useRef(0);
  const startMouseY = useRef(0);
  const dragRotation = useRef(0);
  const dragTilt = useRef(0);
  const dragInertia = useRef(0);

  // Region HTML overlays refs to manipulate styles directly without React re-renders
  const regionPinsRef = useRef<Record<string, HTMLDivElement | null>>({});
  // Ref-shadowed hovered region id for canvas loop (avoids stale closure)
  const hoveredRegionRef = useRef<string | null>(null);
  // Live projected screen positions of each pin — updated every animation frame
  const projectedPositionsRef = useRef<Record<string, { x: number; y: number; visible: boolean }>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    const isMobile = width < 768;
    const height = isMobile ? 380 : 480;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      const nextIsMobile = width < 768;
      const nextHeight = nextIsMobile ? 380 : 480;
      canvas.width = width * dpr;
      canvas.height = nextHeight * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${nextHeight}px`;
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(dpr, dpr);
      }
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      const currentWidth = container.clientWidth;
      const currentIsMobile = currentWidth < 768;
      const currentHeight = currentIsMobile ? 380 : 480;
      ctx.clearRect(0, 0, currentWidth, currentHeight);

      // Interpolate progress towards target (1 when hovered/zoomed, 0 when default rotating globe)
      const targetProgress = isHoveredRef.current ? 1 : 0;
      progressRef.current += (targetProgress - progressRef.current) * 0.08;
      const progress = progressRef.current;

      // Adjust rotation: auto-spin in 3D globe, ease towards 0 (centering Europe/Atlantic) in flat map
      if (!isDragging.current && progress < 0.99) {
        rotationRef.current += autoRotationSpeed * (1 - progress);
      }
      
      // Apply drag inertia
      if (!isDragging.current) {
        rotationRef.current += dragInertia.current;
        dragInertia.current *= 0.95; // dampening
      }

      // If flattening, interpolate rotation and tilt to clean flat values
      const currentRotation = rotationRef.current * (1 - progress) + (-0.5) * progress;
      const currentTilt = tiltRef.current * (1 - progress) + 0.1 * progress; // slight tilt up in flat view

      // Calculations for centering & dimensions
      const cx = currentWidth / 2;
      const cy = currentHeight / 2;

      // Globe parameters (constrained to fit height with top/bottom padding)
      const maxRFromHeight = (currentHeight - 48) * 0.5;
      const R = Math.min(currentWidth * 0.38, maxRFromHeight, 190);

      // Flat map dimensions (expands to be wide and easily readable on hover)
      const flatWidth = Math.min(currentWidth * 0.86, 920);
      const flatHeight = flatWidth * 0.48;

      // 1. Draw Globe Sphere Body (Behind land points)
      if (progress < 0.99) {
        ctx.save();
        ctx.globalAlpha = 1 - progress;

        // Globe sphere fill
        const gradient = ctx.createRadialGradient(
          cx - R * 0.2,
          cy - R * 0.2,
          R * 0.2,
          cx,
          cy,
          R
        );
        gradient.addColorStop(0, "#071124");
        gradient.addColorStop(0.7, "#02050c");
        gradient.addColorStop(1, "#000000");

        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Edge glow
        ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }

      // Pre-compute project positions for regions to use in arcs and overlay pins
      const projectedRegions: Record<string, { x: number; y: number; visible: boolean }> = {};
      REGIONS.forEach((r) => {
        const phi = (r.lat * Math.PI) / 180;
        const theta = (r.lng * Math.PI) / 180;

        // 3D position
        const x3d = R * Math.cos(phi) * Math.sin(theta + currentRotation);
        const y3d = R * Math.sin(phi);
        const z3d = R * Math.cos(phi) * Math.cos(theta + currentRotation);

        const ty = y3d * Math.cos(currentTilt) - z3d * Math.sin(currentTilt);
        const tz = y3d * Math.sin(currentTilt) + z3d * Math.cos(currentTilt);

        const sx3d = cx + x3d;
        const sy3d = cy - ty;

        // 2D position (mapped dynamically to the expanded flatWidth/flatHeight)
        const sx2d = cx + (r.lng / 180) * (flatWidth * 0.5);
        const sy2d = cy - (r.lat / 90) * (flatHeight * 0.5) + (currentIsMobile ? 10 : 20); // slightly offset down to center

        // Blended position
        const sx = sx3d * (1 - progress) + sx2d * progress;
        const sy = sy3d * (1 - progress) + sy2d * progress;

        projectedRegions[r.id] = {
          x: sx,
          y: sy,
          visible: tz > -10 || progress > 0.5,
        };
      });

      // 2. Draw Connection Arcs (International growth arcs)
      if (progress < 0.95) {
        CONNECTIONS.forEach((conn) => {
          const fromProj = projectedRegions[conn.from];
          const toProj = projectedRegions[conn.to];

          if (!fromProj || !toProj) return;

          // Only draw if both points are somewhat on the front/visible
          if (fromProj.visible && toProj.visible) {
            ctx.save();
            ctx.globalAlpha = (1 - progress) * 0.35;
            ctx.strokeStyle = "#06b6d4";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(fromProj.x, fromProj.y);

            // Draw a curved bezier arc bridging the two points
            const midX = (fromProj.x + toProj.x) / 2;
            const midY = (fromProj.y + toProj.y) / 2 - R * 0.25; // lift midpoint for 3D arch height

            ctx.quadraticCurveTo(midX, midY, toProj.x, toProj.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      // 3. Draw Dotted Map (Continents)
      ctx.save();
      WORLD_POINTS.forEach(([lat, lng]) => {
        const phi = (lat * Math.PI) / 180;
        const theta = (lng * Math.PI) / 180;

        // 3D position
        const x3d = R * Math.cos(phi) * Math.sin(theta + currentRotation);
        const y3d = R * Math.sin(phi);
        const z3d = R * Math.cos(phi) * Math.cos(theta + currentRotation);

        const ty = y3d * Math.cos(currentTilt) - z3d * Math.sin(currentTilt);
        const tz = y3d * Math.sin(currentTilt) + z3d * Math.cos(currentTilt);

        // Visibility / depth occlusion in 3D
        if (tz <= -5 && progress < 0.1) return;

        const sx3d = cx + x3d;
        const sy3d = cy - ty;

        // 2D Flat mapping
        const sx2d = cx + (lng / 180) * (flatWidth * 0.5);
        const sy2d = cy - (lat / 90) * (flatHeight * 0.5) + (currentIsMobile ? 10 : 20);

        // Blended positions
        const sx = sx3d * (1 - progress) + sx2d * progress;
        const sy = sy3d * (1 - progress) + sy2d * progress;

        // Opacity based on spherical depth fading near the horizon, fully visible in 2D
        const depthAlpha = Math.max(0, tz / R);
        const pointAlpha = (1 - progress) * depthAlpha + progress * 0.75;

        if (pointAlpha <= 0.05) return;

        // Blue / Cyan continent colors
        ctx.fillStyle = `rgba(34, 211, 238, ${pointAlpha * 0.7})`;
        ctx.beginPath();
        // Dot size: slightly larger in 2D for solid outline clarity
        const dotRadius = 1.2 + progress * 0.4;
        ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 4. Update Region Overlay Div Pins
      REGIONS.forEach((r) => {
        const proj = projectedRegions[r.id];
        const el = regionPinsRef.current[r.id];
        if (!el || !proj) return;

        // Save projected position for mouse hit-testing
        projectedPositionsRef.current[r.id] = proj;

        if (proj.visible) {
          el.style.transform = `translate3d(${proj.x}px, ${proj.y}px, 0) scale(${hoveredRegionRef.current === r.id ? 1.25 : 1})`;
          el.style.opacity = '1';
          el.style.pointerEvents = "none"; // Hit-testing done in mousemove handler
        } else {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredRegion]);

  // Touch & Mouse Drag Handlers for Globe Rotation
  const handleStart = (clientX: number, clientY: number) => {
    // Disable interaction if flattened/map mode
    if (progressRef.current > 0.6) return;

    isDragging.current = true;
    startMouseX.current = clientX;
    startMouseY.current = clientY;
    dragRotation.current = rotationRef.current;
    dragTilt.current = tiltRef.current;
    dragInertia.current = 0;
  };

  const handleMove = (clientX: number, clientY: number) => {
    // Drag rotation
    if (isDragging.current) {
      const deltaX = clientX - startMouseX.current;
      const deltaY = clientY - startMouseY.current;
      const speed = 0.005;
      rotationRef.current = dragRotation.current + deltaX * speed;
      const nextTilt = dragTilt.current - deltaY * speed;
      tiltRef.current = Math.max(-0.6, Math.min(0.6, nextTilt));
      dragInertia.current = deltaX * speed * 0.15;
    }

    // Pin proximity hover detection (works regardless of drag state)
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const HIT_RADIUS = 28; // px — generous hit area

    let closestId: string | null = null;
    let closestDist = HIT_RADIUS;

    for (const r of REGIONS) {
      const proj = projectedPositionsRef.current[r.id];
      if (!proj || !proj.visible) continue;
      const dist = Math.sqrt((mouseX - proj.x) ** 2 + (mouseY - proj.y) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closestId = r.id;
      }
    }

    if (closestId !== hoveredRegionRef.current) {
      if (closestId) {
        // Entering a new pin
        hoveredRegionRef.current = closestId;
        setHoveredRegion(closestId);
        const region = REGIONS.find((r) => r.id === closestId)!;
        setHoveredRegionData({
          name: getRegionName(region),
          message: getRegionMessage(region),
          x: projectedPositionsRef.current[closestId]?.x ?? 0,
          y: projectedPositionsRef.current[closestId]?.y ?? 0,
          regionId: closestId,
        });
      } else {
        // Left all pins
        hoveredRegionRef.current = null;
        setHoveredRegion(null);
        setHoveredRegionData(null);
      }
    }
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const getRegionName = (r: (typeof REGIONS)[0]) => {
    if (locale === "es") return r.nameEs;
    if (locale === "fr") return r.nameFr;
    if (locale === "pt") return r.namePt;
    return r.nameEn;
  };

  const getRegionMessage = (r: (typeof REGIONS)[0]) => {
    if (locale === "es") return r.messageEs;
    if (locale === "fr") return r.messageFr;
    if (locale === "pt") return r.messagePt;
    return r.messageEn;
  };

  const handleRegionClick = (regionId: string) => {
    try {
      sessionStorage.setItem("last_page", window.location.href);
      sessionStorage.setItem("last_page_label", "World Map");
      if (regionId === "south-america") {
        setLocale("es");
      }
    } catch {
      /* ignore */
    }
    navigate(`/select-country?continent=${regionId}`);
  };

  const handlePinMouseLeave = () => {
    setHoveredRegion(null);
    hoveredRegionRef.current = null;
    setHoveredRegionData(null);
  };

  const handlePinMouseEnterById = (regionId: string, e: React.MouseEvent | MouseEvent) => {
    setHoveredRegion(regionId);
    hoveredRegionRef.current = regionId;

    const region = REGIONS.find((r) => r.id === regionId);
    if (!region || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const pinEl = regionPinsRef.current[regionId];
    if (!pinEl) return;

    const pinRect = pinEl.getBoundingClientRect();
    const pinX = pinRect.left - rect.left + pinRect.width / 2;
    const pinY = pinRect.top - rect.top;

    setHoveredRegionData({
      name: getRegionName(region),
      message: getRegionMessage(region),
      x: pinX,
      y: pinY,
      regionId,
    });
  };

  return (
    <div className="map-section w-full relative" style={{ touchAction: "pan-y" }}>
      <div
        ref={containerRef}
        className="relative w-full flex items-center justify-center select-none h-[380px] md:h-[480px] cursor-grab active:cursor-grabbing"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          handlePinMouseLeave();
          handleEnd();
        }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onClick={(e) => {
          // Click a pin if mouse is near one
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          for (const r of REGIONS) {
            const proj = projectedPositionsRef.current[r.id];
            if (!proj || !proj.visible) continue;
            const dist = Math.sqrt((mx - proj.x) ** 2 + (my - proj.y) ** 2);
            if (dist < 36) {
              handleRegionClick(r.id);
              return;
            }
          }
        }}
        onTouchStart={(e) => {
          if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handleEnd}
      >
        {/* Cinematic atmospheric backdrop glow behind the globe */}
        <div className="absolute inset-0 bg-radial-gradient(circle,rgba(6,182,212,0.03),transparent_70%) pointer-events-none z-0" />

        {/* Dynamic 3D Canvas projection — pointer-events-none so pins can receive events */}
        <canvas
          ref={canvasRef}
          className="z-10 block absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Global branding overlay in center */}
        <div
          className="absolute pointer-events-none z-20 transition-opacity duration-700"
          style={{
            top: 16,
            left: "50%",
            transform: "translateX(-50%) scale(1.45)",
            transformOrigin: "top center",
            filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7)) drop-shadow(0 0 20px rgba(6,182,212,0.25))",
            opacity: hoveredRegionData ? 0.15 : 0.9,
          }}
        >
          <TrueLegacyLogo variant="mapOverlay" />
        </div>

        {/* Region overlay markers & labels */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {REGIONS.map((r) => (
            <div
              key={r.id}
              ref={(el) => {
                regionPinsRef.current[r.id] = el;
              }}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: 0,
                top: 0,
                transform: "translate3d(0, 0, 0)",
                opacity: 0, // initially updated by canvas loop animation
                willChange: "transform, opacity",
              }}
              onClick={() => handleRegionClick(r.id)}
              onMouseEnter={(e) => handlePinMouseEnterById(r.id, e)}
              onMouseLeave={handlePinMouseLeave}
            >
              {/* Large invisible hit area so hover is easy to trigger */}
              <div className="absolute" style={{ width: 48, height: 48, left: -24, top: -24 }} />

              {/* Outer throbbing glow rings — high visibility yellow */}
              <div
                className="absolute rounded-full animate-ping"
                style={{ width: 32, height: 32, left: -16, top: -16, animationDuration: '2.2s', backgroundColor: 'rgba(250,204,21,0.35)' }}
              />
              <div
                className="absolute rounded-full animate-ping"
                style={{ width: 48, height: 48, left: -24, top: -24, animationDuration: '3s', animationDelay: '0.6s', backgroundColor: 'rgba(250,204,21,0.15)' }}
              />

              {/* Glowing solid bold dot center — gold/yellow with a dark solid border and white core */}
              <div
                className="absolute rounded-full border-2 border-neutral-950 flex items-center justify-center shadow-lg"
                style={{
                  width: hoveredRegion === r.id ? 16 : 12,
                  height: hoveredRegion === r.id ? 16 : 12,
                  left: hoveredRegion === r.id ? -8 : -6,
                  top: hoveredRegion === r.id ? -8 : -6,
                  backgroundColor: '#fbbf24',
                  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: hoveredRegion === r.id
                    ? '0 0 25px 6px rgba(250,204,21,1), 0 0 45px 15px rgba(234,179,8,0.5)'
                    : '0 0 12px 3px rgba(250,204,21,0.8)',
                  zIndex: 40,
                }}
              >
                {/* Solid inner white core for premium high-contrast indicator shine */}
                <div 
                  className="rounded-full bg-white shadow-inner" 
                  style={{
                    width: hoveredRegion === r.id ? 6 : 4,
                    height: hoveredRegion === r.id ? 6 : 4,
                  }}
                />
              </div>

              {/* Market Name Label (Always displayed under the dot, even while Earth is spinning) */}
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-950/85 backdrop-blur-sm border px-2 py-0.5 rounded text-[10px] md:text-[11px] font-extrabold tracking-wider uppercase transition-all duration-300 shadow-md shadow-black/50"
                style={{
                  color: hoveredRegion === r.id ? '#fbbf24' : '#ffffff',
                  borderColor: hoveredRegion === r.id ? 'rgba(250,204,21,0.6)' : 'rgba(163,163,163,0.2)',
                  boxShadow: hoveredRegion === r.id ? '0 0 12px rgba(250,204,21,0.3)' : '0 2px 4px rgba(0,0,0,0.5)',
                  zIndex: 35,
                }}
              >
                {getRegionName(r)}
              </div>
            </div>
          ))}
        </div>

        {/* Hover / tap popup glassmorphism tooltip — clickable */}
        {hoveredRegionData && (
          <div
            className="absolute z-50 bg-neutral-950/95 backdrop-blur-md border border-yellow-400/30 p-4 rounded-xl shadow-2xl text-center w-64 transition-all duration-300 cursor-pointer group"
            style={{
              left: hoveredRegionData.x,
              top: hoveredRegionData.y - 16,
              transform: "translate(-50%, -100%)",
              pointerEvents: 'auto',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRegionClick(hoveredRegionData.regionId);
            }}
          >
            {/* Region name */}
            <div className="text-[11px] font-black text-yellow-400 tracking-widest uppercase leading-none mb-2">
              {hoveredRegionData.name}
            </div>

            {/* Divider */}
            <div className="w-8 h-[1px] bg-yellow-400/30 mx-auto mb-2" />

            {/* Description */}
            <div className="text-[12px] font-medium text-neutral-200 leading-relaxed">
              {hoveredRegionData.message}
            </div>

            {/* Clickable CTA */}
            <div className="mt-3 flex items-center justify-center gap-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 rounded-lg px-3 py-1.5 transition-colors duration-200">
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                {locale === "es"
                  ? "Ver mercados"
                  : locale === "fr"
                    ? "Voir les marchés"
                    : locale === "pt"
                      ? "Ver mercados"
                      : "Explore markets"}
              </span>
              <span className="text-yellow-400 text-[11px]">→</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorldMap;
