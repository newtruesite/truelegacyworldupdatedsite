import { COUNTRIES } from "@/lib/countries";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Point {
  x: number;
  y: number;
}

function toSVGCoords(lonPct: number, latPct: number): Point {
  return { x: lonPct * 8, y: latPct * 5 };
}

const countryMap: Record<string, Point> = {};
COUNTRIES.forEach((c) => {
  countryMap[c.slug] = toSVGCoords(c.mapX, c.mapY);
});

// Define regions and their coordinates on the map
// eslint-disable-next-line react-refresh/only-export-components
export const REGIONS = [
  { id: "north-america", name: "North America", mapX: 20, mapY: 28 },
  { id: "latin-america", name: "Latin America", mapX: 25, mapY: 60 },
  { id: "europe", name: "Europe", mapX: 48, mapY: 22 },
  { id: "middle-east", name: "Middle East", mapX: 62, mapY: 37 },
  { id: "africa", name: "Africa", mapX: 45, mapY: 42 },
  { id: "asia", name: "Asia", mapX: 72, mapY: 38 },
];

export function RegionMap() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-hidden rounded-2xl glass border border-white/10">
      <svg
        viewBox="0 0 800 500"
        className="w-full"
        style={{ minHeight: "320px" }}
        aria-label="True Legacy World global region map"
      >
        {/* Subtle grid */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0a0e1a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="500" fill="url(#grid)" />
        <rect width="800" height="500" fill="url(#mapGlow)" />

        {/* Continent outlines (simplified) */}
        {/* North America */}
        <path
          d="M60,80 L200,60 L250,80 L260,130 L240,170 L220,200 L180,210 L160,250 L120,270 L80,260 L60,210 L40,170 L50,120 Z"
          fill="rgba(30,64,175,0.15)"
          stroke="rgba(59,130,246,0.3)"
          strokeWidth="1"
        />
        {/* South America */}
        <path
          d="M160,270 L220,270 L240,310 L260,370 L240,430 L210,450 L180,440 L160,410 L150,360 L155,310 Z"
          fill="rgba(30,64,175,0.15)"
          stroke="rgba(59,130,246,0.3)"
          strokeWidth="1"
        />
        {/* Europe */}
        <path
          d="M320,60 L400,50 L420,80 L410,110 L380,120 L350,115 L330,100 Z"
          fill="rgba(30,64,175,0.15)"
          stroke="rgba(59,130,246,0.3)"
          strokeWidth="1"
        />
        {/* Africa */}
        <path
          d="M330,120 L410,110 L440,140 L450,200 L440,270 L420,330 L390,360 L360,350 L340,310 L320,250 L320,180 Z"
          fill="rgba(30,64,175,0.15)"
          stroke="rgba(59,130,246,0.3)"
          strokeWidth="1"
        />
        {/* Asia */}
        <path
          d="M420,50 L600,40 L680,80 L700,140 L680,180 L640,200 L580,210 L520,190 L480,160 L440,140 L420,110 Z"
          fill="rgba(30,64,175,0.15)"
          stroke="rgba(59,130,246,0.3)"
          strokeWidth="1"
        />
        {/* Australia */}
        <path
          d="M600,280 L680,270 L710,310 L700,360 L660,380 L620,370 L590,340 L590,310 Z"
          fill="rgba(30,64,175,0.15)"
          stroke="rgba(59,130,246,0.3)"
          strokeWidth="1"
        />

        {/* Region nodes matching the TL markers on the live site */}
        {REGIONS.map((region) => {
          const pt = toSVGCoords(region.mapX, region.mapY);
          return (
            <g
              key={region.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/region/${region.id}`)}
            >
              {/* Pulse ring highlight on hover */}
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r="24"
                fill="rgba(6,182,212,0)"
                className="transition-all duration-300 group-hover:fill-cyan-500/20"
              />

              {/* Marker Pin Base */}
              <motion.path
                d={`M ${pt.x} ${pt.y + 12} L ${pt.x - 12} ${pt.y - 10} A 16 16 0 1 1 ${pt.x + 12} ${pt.y - 10} Z`}
                fill="#f59e0b" // TL Orange/Yellow
                stroke="#d97706"
                strokeWidth="1"
                whileHover={{ scale: 1.1, originY: 1 }}
                whileTap={{ scale: 0.95 }}
              />

              {/* Inner Circle for Logo */}
              <circle cx={pt.x} cy={pt.y - 8} r="8" fill="#ffffff" />

              {/* TL Text Instead of image for simplicity, but could be replaced with an SVG icon */}
              <text
                x={pt.x}
                y={pt.y - 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#1e40af" // TL Blue
                className="pointer-events-none select-none"
              >
                TL
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs text-[#cccccc]">Select a Region</span>
        </div>
      </div>
    </div>
  );
}
