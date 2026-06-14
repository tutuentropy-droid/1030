import { useState, useMemo } from "react";
import type { BrainRegion } from "@/data/brainRegions";
import { getBrainRegionById } from "@/data/brainRegions";
import { Layers, Eye, EyeOff } from "lucide-react";

export interface PathwayData {
  id: string;
  label: string;
  description?: string;
  regionIds: string[];
  color: string;
}

interface BrainPathwayProps {
  pathways: PathwayData[];
  title?: string;
  showToggleControls?: boolean;
}

export default function BrainPathway({
  pathways,
  title = "🧠 脑区参与链路",
  showToggleControls = true,
}: BrainPathwayProps) {
  const [activePathwayIds, setActivePathwayIds] = useState<string[]>(
    pathways.map((p) => p.id)
  );
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const togglePathway = (id: string) => {
    setActivePathwayIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const allRegions = useMemo(() => {
    const regionMap = new Map<string, BrainRegion>();
    pathways.forEach((pw) => {
      pw.regionIds.forEach((rid) => {
        const r = getBrainRegionById(rid);
        if (r) regionMap.set(rid, r);
      });
    });
    return Array.from(regionMap.values());
  }, [pathways]);

  const activePathways = pathways.filter((p) =>
    activePathwayIds.includes(p.id)
  );

  const isRegionInAnyActivePathway = (regionId: string) =>
    activePathways.some((pw) => pw.regionIds.includes(regionId));

  const regionActivePathways = (regionId: string) =>
    activePathways.filter((pw) => pw.regionIds.includes(regionId));

  return (
    <div
      className="glass-card p-5 animate-slide-up"
      style={{
        background:
          "linear-gradient(135deg, rgba(247,37,133,0.08), rgba(0,212,255,0.08), rgba(6,255,165,0.05))",
        border: "1px solid rgba(157,78,221,0.2)",
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-neon-purple" />
          <p className="text-sm text-museum-200/80 font-medium">{title}</p>
        </div>
        {showToggleControls && pathways.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() =>
                setActivePathwayIds(pathways.map((p) => p.id))
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-museum-300/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <Eye className="w-3 h-3" />
              全部显示
            </button>
            <button
              onClick={() => setActivePathwayIds([])}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-museum-300/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <EyeOff className="w-3 h-3" />
              全部隐藏
            </button>
          </div>
        )}
      </div>

      <div className="relative aspect-square max-w-md mx-auto mb-5">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 30px rgba(157, 78, 221, 0.2))" }}
        >
          <defs>
            <radialGradient id="bpBrainBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a3e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f0f24" stopOpacity="0.6" />
            </radialGradient>

            {pathways.map((pw, i) => (
              <linearGradient
                key={`grad-${pw.id}`}
                id={`pw-gradient-${pw.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={pw.color} stopOpacity="0.1" />
                <stop offset="50%" stopColor={pw.color} stopOpacity="0.7" />
                <stop offset="100%" stopColor={pw.color} stopOpacity="0.1" />
              </linearGradient>
            ))}

            <filter id="bpGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M20,50 C15,30 30,10 50,10 C70,10 85,30 80,50 C85,70 70,90 50,90 C30,90 15,70 20,50 Z"
            fill="url(#bpBrainBg)"
            stroke="rgba(157, 78, 221, 0.2)"
            strokeWidth="0.5"
          />
          <path
            d="M25,50 C22,35 35,20 50,20 C65,20 78,35 75,50 C78,65 65,80 50,80 C35,80 22,65 25,50 Z"
            fill="none"
            stroke="rgba(157, 78, 221, 0.1)"
            strokeWidth="0.3"
          />
          <path
            d="M50,10 C50,30 50,70 50,90"
            stroke="rgba(157, 78, 221, 0.15)"
            strokeWidth="0.3"
            strokeDasharray="2,2"
          />

          {activePathways.map((pw) =>
            pw.regionIds.slice(0, -1).map((rid, idx) => {
              const from = getBrainRegionById(rid);
              const to = getBrainRegionById(pw.regionIds[idx + 1]);
              if (!from || !to) return null;

              const fx = from.position.x + from.position.width / 2;
              const fy = from.position.y + from.position.height / 2;
              const tx = to.position.x + to.position.width / 2;
              const ty = to.position.y + to.position.height / 2;

              const mx = (fx + tx) / 2;
              const my = (fy + ty) / 2 - 6;

              const pathD = `M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`;

              const delay = idx * 0.2;

              return (
                <g key={`path-${pw.id}-${idx}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={pw.color}
                    strokeWidth="0.6"
                    strokeOpacity="0.35"
                    strokeLinecap="round"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={pw.color}
                    strokeWidth="0.3"
                    strokeOpacity="0.9"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: "2 3",
                      filter: `drop-shadow(0 0 2px ${pw.color})`,
                      animation: `dash-flow 2.5s linear ${delay}s infinite`,
                    }}
                  />
                  <circle
                    cx={tx}
                    cy={ty}
                    r="1"
                    fill={pw.color}
                    style={{
                      filter: `drop-shadow(0 0 3px ${pw.color})`,
                      animation: `pulse-node 1.8s ease-in-out ${delay + 0.5}s infinite`,
                    }}
                  />
                </g>
              );
            })
          )}

          {allRegions.map((region) => {
            const inPathway = isRegionInAnyActivePathway(region.id);
            const activePws = regionActivePathways(region.id);
            const isHovered = hoveredRegion === region.id;

            return (
              <g key={region.id}>
                <rect
                  x={region.position.x}
                  y={region.position.y}
                  width={region.position.width}
                  height={region.position.height}
                  rx="4"
                  ry="4"
                  fill={inPathway ? `${region.color}35` : "rgba(255,255,255,0.02)"}
                  stroke={
                    inPathway
                      ? isHovered
                        ? region.color
                        : `${region.color}70`
                      : "rgba(255,255,255,0.08)"
                  }
                  strokeWidth={inPathway ? (isHovered ? "0.6" : "0.35") : "0.2"}
                  style={{
                    cursor: inPathway ? "pointer" : "default",
                    transition: "all 0.3s ease",
                    filter:
                      inPathway && isHovered
                        ? `drop-shadow(0 0 8px ${region.color})`
                        : inPathway
                        ? activePws.length > 1
                          ? `drop-shadow(0 0 6px ${region.color})`
                          : "none"
                        : "none",
                  }}
                  onMouseEnter={() => inPathway && setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                {inPathway ? (
                  <text
                    x={region.position.x + region.position.width / 2}
                    y={region.position.y + region.position.height / 2 + 1.5}
                    textAnchor="middle"
                    fontSize="5"
                    fill="white"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {region.emoji}
                  </text>
                ) : (
                  <text
                    x={region.position.x + region.position.width / 2}
                    y={region.position.y + region.position.height / 2 + 1.5}
                    textAnchor="middle"
                    fontSize="4"
                    fill="rgba(255,255,255,0.2)"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    ?
                  </text>
                )}

                {activePws.length > 1 && inPathway && (
                  <g style={{ pointerEvents: "none" }}>
                    {activePws.map((pw, i) => {
                      const angle = (i * 360) / activePws.length - 90;
                      const rad = (angle * Math.PI) / 180;
                      const cx = region.position.x + region.position.width / 2;
                      const cy = region.position.y;
                      const r = 2.5;
                      return (
                        <circle
                          key={`dot-${pw.id}`}
                          cx={cx + Math.cos(rad) * r}
                          cy={cy + Math.sin(rad) * r}
                          r="0.8"
                          fill={pw.color}
                          style={{
                            filter: `drop-shadow(0 0 1.5px ${pw.color})`,
                          }}
                        />
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredRegion && (() => {
          const r = getBrainRegionById(hoveredRegion);
          if (!r) return null;
          const pws = regionActivePathways(hoveredRegion);
          return (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 w-64 p-3 rounded-xl z-10 animate-fade-in pointer-events-none"
              style={{
                background: "rgba(15, 15, 36, 0.95)",
                border: `1px solid ${r.color}40`,
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{r.emoji}</span>
                <span className="text-sm font-bold text-white">
                  {r.chineseName}
                </span>
              </div>
              <p className="text-xs text-museum-300/70 mb-2 leading-relaxed">
                {r.description.slice(0, 60)}...
              </p>
              <div className="flex flex-wrap gap-1">
                {pws.map((pw) => (
                  <span
                    key={pw.id}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: `${pw.color}20`,
                      color: pw.color,
                      border: `1px solid ${pw.color}40`,
                    }}
                  >
                    {pw.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <div className="space-y-2">
        {pathways.map((pw) => {
          const isActive = activePathwayIds.includes(pw.id);
          const regions = pw.regionIds
            .map((rid) => getBrainRegionById(rid))
            .filter(Boolean) as BrainRegion[];
          return (
            <button
              key={pw.id}
              onClick={() => togglePathway(pw.id)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                isActive ? "bg-white/5" : "opacity-50 hover:opacity-80"
              }`}
              style={{
                border: `1px solid ${
                  isActive ? `${pw.color}30` : "rgba(255,255,255,0.05)"
                }`,
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      background: pw.color,
                      boxShadow: isActive ? `0 0 8px ${pw.color}` : "none",
                    }}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-white" : "text-museum-300/60"
                    }`}
                  >
                    {pw.label}
                  </span>
                </div>
                {isActive ? (
                  <Eye className="w-3.5 h-3.5 text-museum-300/60 flex-shrink-0" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-museum-300/40 flex-shrink-0" />
                )}
              </div>
              {pw.description && isActive && (
                <p className="text-xs text-museum-300/60 mb-2 ml-5">
                  {pw.description}
                </p>
              )}
              {isActive && (
                <div className="flex flex-wrap items-center gap-1 ml-5">
                  {regions.map((r, idx) => (
                    <div key={r.id} className="flex items-center gap-1">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: `${r.color}15`,
                          color: r.color,
                          border: `1px solid ${r.color}30`,
                        }}
                      >
                        {r.emoji} {r.chineseName}
                      </span>
                      {idx < regions.length - 1 && (
                        <span className="text-museum-300/40 text-xs">→</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes dash-flow {
          from { stroke-dashoffset: 10; }
          to { stroke-dashoffset: -10; }
        }
        @keyframes pulse-node {
          0%, 100% { opacity: 0.6; r: 1; }
          50% { opacity: 1; r: 1.5; }
        }
      `}</style>
    </div>
  );
}
