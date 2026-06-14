import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ChevronRight, Sparkles } from "lucide-react";
import type { BrainRegion } from "@/data/brainRegions";
import { brainRegions } from "@/data/brainRegions";
import { experiments } from "@/data/experiments";
import { useBrainMap } from "@/hooks/useBrainMap";

interface BrainMapProps {
  onSelectRegion: (region: BrainRegion) => void;
}

export default function BrainMap({ onSelectRegion }: BrainMapProps) {
  const {
    isRegionUnlocked,
    isExperimentCompleted,
    completionStats,
    newlyUnlockedRegions,
    clearNewlyUnlocked,
  } = useBrainMap();

  const stats = completionStats;
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getExperimentTitle = (id: string) =>
    experiments.find((e) => e.id === id)?.title || id;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-30 pointer-events-none" />

            <div className="relative aspect-square max-w-lg mx-auto">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ filter: "drop-shadow(0 0 40px rgba(157, 78, 221, 0.3))" }}
              >
                <defs>
                  <radialGradient id="brainBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1a1a3e" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0f0f24" stopOpacity="0.6" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M20,50 C15,30 30,10 50,10 C70,10 85,30 80,50 C85,70 70,90 50,90 C30,90 15,70 20,50 Z"
                  fill="url(#brainBg)"
                  stroke="rgba(157, 78, 221, 0.3)"
                  strokeWidth="0.5"
                />

                <path
                  d="M25,50 C22,35 35,20 50,20 C65,20 78,35 75,50 C78,65 65,80 50,80 C35,80 22,65 25,50 Z"
                  fill="none"
                  stroke="rgba(157, 78, 221, 0.15)"
                  strokeWidth="0.3"
                />

                <path
                  d="M50,10 C50,30 50,70 50,90"
                  stroke="rgba(157, 78, 221, 0.2)"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                />

                {brainRegions.map((region) => {
                  const unlocked = isRegionUnlocked(region.id);
                  const isNewly = newlyUnlockedRegions.some(
                    (r) => r.id === region.id
                  );
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
                        fill={unlocked ? `${region.color}30` : "rgba(255,255,255,0.03)"}
                        stroke={
                          unlocked
                            ? isHovered
                              ? region.color
                              : `${region.color}60`
                            : "rgba(255,255,255,0.1)"
                        }
                        strokeWidth={isHovered ? "0.6" : "0.3"}
                        style={{
                          cursor: unlocked ? "pointer" : "not-allowed",
                          transition: "all 0.3s ease",
                          filter:
                            unlocked && isHovered
                              ? `drop-shadow(0 0 8px ${region.color})`
                              : isNewly
                              ? `drop-shadow(0 0 15px ${region.color})`
                              : "none",
                        }}
                        className={isNewly ? "animate-pulse-glow" : ""}
                        onMouseEnter={() => setHoveredRegion(region.id)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => {
                          if (unlocked) {
                            onSelectRegion(region);
                            if (isNewly) clearNewlyUnlocked();
                          }
                        }}
                      />

                      {unlocked ? (
                        <text
                          x={region.position.x + region.position.width / 2}
                          y={region.position.y + region.position.height / 2 + 1.5}
                          textAnchor="middle"
                          fontSize="6"
                          fill="white"
                          style={{
                            pointerEvents: "none",
                            userSelect: "none",
                            opacity: isHovered ? 1 : 0.9,
                          }}
                        >
                          {region.emoji}
                        </text>
                      ) : (
                        <foreignObject
                          x={region.position.x + region.position.width / 2 - 3}
                          y={region.position.y + region.position.height / 2 - 3}
                          width="6"
                          height="6"
                        >
                          <Lock
                            className="w-full h-full text-museum-300/40"
                            style={{ pointerEvents: "none" }}
                          />
                        </foreignObject>
                      )}

                      {isNewly && (
                        <g style={{ pointerEvents: "none" }}>
                          <circle
                            cx={region.position.x + region.position.width}
                            cy={region.position.y}
                            r="3"
                            fill="#ffbe0b"
                            className="animate-pulse"
                          />
                          <text
                            x={region.position.x + region.position.width}
                            y={region.position.y + 1.2}
                            textAnchor="middle"
                            fontSize="3"
                            fill="white"
                          >
                            ✨
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {brainRegions.map((region) => {
                const unlocked = isRegionUnlocked(region.id);
                const isHovered = hoveredRegion === region.id;
                return (
                  <div
                    key={region.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                      unlocked
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      background: isHovered
                        ? `${region.color}20`
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${
                        isHovered ? region.color : "rgba(255,255,255,0.1)"
                      }`,
                    }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => unlocked && onSelectRegion(region)}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: unlocked ? region.color : "#444",
                        boxShadow: unlocked
                          ? `0 0 8px ${region.color}`
                          : "none",
                      }}
                    />
                    <span
                      className={unlocked ? "text-white" : "text-museum-300/50"}
                    >
                      {region.chineseName}
                    </span>
                    {!unlocked && (
                      <Lock className="w-3 h-3 text-museum-300/50" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center glow-purple">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">
                  收集进度
                </h3>
                <p className="text-museum-300/60 text-sm">
                  完成实验解锁更多脑区
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-museum-200/80 text-sm">脑区解锁</span>
                  <span className="text-sm font-bold" style={{ color: "#9d4edd" }}>
                    {stats.unlockedRegions}/{stats.totalRegions}
                  </span>
                </div>
                <div className="w-full h-3 bg-museum-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${
                        (stats.unlockedRegions / stats.totalRegions) * 100
                      }%`,
                      background:
                        "linear-gradient(90deg, #9d4edd, #00d4ff, #06ffa5)",
                      boxShadow: "0 0 20px rgba(157, 78, 221, 0.5)",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-museum-200/80 text-sm">实验完成</span>
                  <span className="text-sm font-bold" style={{ color: "#00d4ff" }}>
                    {stats.completedExperiments}/{stats.totalExperiments}
                  </span>
                </div>
                <div className="w-full h-3 bg-museum-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${
                        (stats.completedExperiments / stats.totalExperiments) *
                        100
                      }%`,
                      background: "linear-gradient(90deg, #00d4ff, #06ffa5)",
                      boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)",
                    }}
                  />
                </div>
              </div>
            </div>

            {stats.unlockedRegions === stats.totalRegions && (
              <div
                className="mt-6 p-4 rounded-xl text-center animate-pulse-glow"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(157, 78, 221, 0.2), rgba(6, 255, 165, 0.2))",
                  border: "1px solid rgba(157, 78, 221, 0.4)",
                }}
              >
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-white font-bold gradient-text">
                  恭喜！你已集齐全部脑区！
                </p>
                <p className="text-museum-300/70 text-sm mt-1">
                  成为真正的神经探索大师
                </p>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h4 className="text-lg font-bold text-white mb-4">解锁脑区指南</h4>
            <div className="space-y-3">
              {brainRegions.map((region) => {
                const unlocked = isRegionUnlocked(region.id);
                return (
                  <div
                    key={region.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      unlocked ? "cursor-pointer hover:-translate-y-0.5" : ""
                    }`}
                    style={{
                      background: unlocked
                        ? `${region.color}10`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        unlocked ? `${region.color}30` : "rgba(255,255,255,0.05)"
                      }`,
                    }}
                    onClick={() => unlocked && onSelectRegion(region)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{
                          background: unlocked
                            ? `${region.color}30`
                            : "rgba(255,255,255,0.05)",
                        }}
                      >
                        {unlocked ? region.emoji : "?"}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            unlocked ? "text-white" : "text-museum-300/50"
                          }`}
                        >
                          {region.chineseName}
                        </p>
                        <p className="text-xs text-museum-300/50">
                          {unlocked
                            ? "已解锁"
                            : `完成相关实验解锁 · ${region.relatedExperiments.length}个实验`}
                        </p>
                      </div>
                    </div>
                    {!unlocked && <Lock className="w-4 h-4 text-museum-300/30" />}
                  </div>
                );
              })}
            </div>
          </div>

          {stats.unlockedRegions < stats.totalRegions && (
            <Link to="/" className="btn-primary w-full justify-center">
              去做实验
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}

          {stats.unlockedRegions > 0 && (
            <div className="glass-card p-4">
              <h4 className="text-sm font-medium text-museum-300/80 mb-3">
                实验列表
              </h4>
              <div className="space-y-2">
                {experiments.map((exp) => {
                  const done = isExperimentCompleted(exp.id);
                  return (
                    <Link
                      key={exp.id}
                      to={`/experiment/${exp.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg transition-all hover:bg-white/5 group"
                      style={{
                        borderLeft: `3px solid ${
                          done ? exp.accentColor : "transparent"
                        }`,
                      }}
                    >
                      <span
                        className={`text-sm ${
                          done ? "text-white" : "text-museum-300/60"
                        }`}
                      >
                        {exp.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          done
                            ? "bg-neon-green/20 text-neon-green"
                            : "bg-museum-800 text-museum-300/50"
                        }`}
                      >
                        {done ? "✓ 已完成" : "未完成"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
