import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X, ArrowRight, Gift, Map } from "lucide-react";
import type { BrainRegion } from "@/data/brainRegions";
import { useBrainMap } from "@/hooks/useBrainMap";

export default function UnlockCelebration() {
  const { newlyUnlockedRegions, clearNewlyUnlocked } = useBrainMap();
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (newlyUnlockedRegions.length > 0) {
      setTimeout(() => {
        setIsVisible(true);
        setShowConfetti(true);
      }, 100);
    }
  }, [newlyUnlockedRegions]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      clearNewlyUnlocked();
      setShowConfetti(false);
      setActiveIndex(0);
    }, 300);
  };

  const handleNext = () => {
    if (activeIndex < newlyUnlockedRegions.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  if (newlyUnlockedRegions.length === 0) return null;

  const region: BrainRegion = newlyUnlockedRegions[activeIndex];

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
    >
      {showConfetti && <Confetti />}

      <div className="absolute inset-0 bg-museum-950/80 backdrop-blur-sm" />

      <div
        className={`relative w-full max-w-md transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="glass-card overflow-hidden animate-pulse-glow"
          style={{
            boxShadow: `0 0 80px ${region.glowColor}`,
          }}
        >
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background: `linear-gradient(90deg, ${region.color}, #00d4ff, ${region.color})`,
              backgroundSize: "200% 100%",
              animation: "gradient 2s ease infinite",
            }}
          />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-museum-300/70 hover:text-white hover:bg-white/10 transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className="p-8 text-center relative"
            style={{
              background: `radial-gradient(ellipse at center top, ${region.color}25, transparent 70%)`,
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-yellow/15 border border-neon-yellow/30 mb-6 animate-bounce-slow">
              <Gift className="w-4 h-4 text-neon-yellow" />
              <span className="text-sm font-medium text-neon-yellow">
                🎉 新脑区解锁！
              </span>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: `${region.color}20`,
                }}
              />
              <div
                className="absolute inset-2 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${region.color}30, transparent 70%)`,
                }}
              />
              <div
                className="relative w-full h-full rounded-2xl flex items-center justify-center text-6xl"
                style={{
                  background: `linear-gradient(135deg, ${region.color}40, ${region.color}10)`,
                  border: `2px solid ${region.color}50`,
                  boxShadow: `0 0 40px ${region.glowColor}`,
                }}
              >
                {region.emoji}
              </div>
            </div>

            <div className="mb-2">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: `${region.color}20`,
                  color: region.color,
                  border: `1px solid ${region.color}40`,
                }}
              >
                {region.name}
              </span>
            </div>

            <h2
              className="text-3xl md:text-4xl font-display font-bold text-white mb-3"
              style={{
                textShadow: `0 0 30px ${region.color}60`,
              }}
            >
              {region.chineseName}
            </h2>

            <p className="text-museum-200/75 text-sm leading-relaxed mb-6 line-clamp-3">
              {region.description}
            </p>

            <div className="flex items-center justify-center gap-6 text-sm mb-6">
              <div className="text-center">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: region.color }}
                >
                  {region.relatedExperiments.length}
                </div>
                <p className="text-museum-300/60 text-xs">关联实验</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: region.color }}
                >
                  {region.faqs.length}
                </div>
                <p className="text-museum-300/60 text-xs">常见问题</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: region.color }}
                >
                  {region.realLifeImpacts.length}
                </div>
                <p className="text-museum-300/60 text-xs">现实影响</p>
              </div>
            </div>

            {newlyUnlockedRegions.length > 1 && (
              <div className="flex justify-center gap-1.5 mb-6">
                {newlyUnlockedRegions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6"
                        : "bg-white/20"
                    }`}
                    style={{
                      background:
                        index === activeIndex
                          ? region.color
                          : undefined,
                      boxShadow:
                        index === activeIndex
                          ? `0 0 10px ${region.color}`
                          : undefined,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleNext}
                className="btn-primary flex-1 justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${region.color}, #4040f5)`,
                }}
              >
                {activeIndex < newlyUnlockedRegions.length - 1 ? (
                  <>
                    下一个
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "太酷了！"
                )}
              </button>
              <Link
                to="/brain-map"
                onClick={handleClose}
                className="btn-secondary flex-1 justify-center gap-2"
              >
                <Map className="w-4 h-4" />
                查看脑地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ["#9d4edd", "#00d4ff", "#ff006e", "#ffbe0b", "#06ffa5"];
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
