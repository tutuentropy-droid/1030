import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Brain,
  HelpCircle,
  Zap,
  ChevronRight,
  Eye,
} from "lucide-react";
import type { BrainRegion } from "@/data/brainRegions";
import { experiments } from "@/data/experiments";
import ExplanationCard from "./ExplanationCard";

interface BrainRegionModalProps {
  region: BrainRegion | null;
  onClose: () => void;
}

type TabType = "overview" | "experiments" | "faqs" | "impact";

export default function BrainRegionModal({
  region,
  onClose,
}: BrainRegionModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (region) {
      setActiveTab("overview");
      setOpenFaqIndex(null);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [region]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!region) return null;

  const relatedExperiments = experiments.filter((exp) =>
    region.relatedExperiments.includes(exp.id)
  );

  const tabs: { id: TabType; label: string; icon: typeof Brain }[] = [
    { id: "overview", label: "概述", icon: Brain },
    { id: "experiments", label: "参与实验", icon: Eye },
    { id: "faqs", label: "常见问题", icon: HelpCircle },
    { id: "impact", label: "现实影响", icon: Zap },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-museum-950/90 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="glass-card overflow-hidden flex flex-col max-h-[90vh]"
          style={{
            boxShadow: `0 0 60px ${region.glowColor}`,
          }}
        >
          <div
            className="relative p-6 md:p-8 border-b border-white/10"
            style={{
              background: `linear-gradient(135deg, ${region.color}20, transparent)`,
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-museum-300/70 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${region.color}40, ${region.color}10)`,
                  boxShadow: `0 0 40px ${region.glowColor}`,
                }}
              >
                {region.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${region.color}20`,
                      color: region.color,
                      border: `1px solid ${region.color}40`,
                    }}
                  >
                    {region.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green font-medium">
                    ✓ 已解锁
                  </span>
                </div>
                <h2
                  className="text-2xl md:text-3xl font-display font-bold text-white mb-2"
                  style={{
                    textShadow: `0 0 20px ${region.color}40`,
                  }}
                >
                  {region.chineseName}
                </h2>
                <p className="text-museum-300/60 text-sm">
                  参与了 {region.relatedExperiments.length} 个实验 · 包含{" "}
                  {region.faqs.length} 个常见问题 · {region.realLifeImpacts.length}{" "}
                  个现实影响
                </p>
              </div>
            </div>

            <div className="flex gap-1 md:gap-2 mt-6 overflow-x-auto pb-1 -mx-1 px-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "text-white"
                        : "text-museum-300/60 hover:text-museum-200/80 hover:bg-white/5"
                    }`}
                    style={{
                      background: isActive ? `${region.color}20` : "transparent",
                      border: isActive
                        ? `1px solid ${region.color}40`
                        : "1px solid transparent",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {activeTab === "overview" && (
              <div className="animate-fade-in">
                <ExplanationCard
                  icon={
                    <Brain
                      className="w-6 h-6"
                      style={{ color: region.color }}
                    />
                  }
                  title={`什么是${region.chineseName}？`}
                  content={region.description}
                  color={region.color}
                />

                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: `${region.color}08`,
                      border: `1px solid ${region.color}20`,
                    }}
                  >
                    <div className="text-2xl mb-2">🧪</div>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: region.color }}
                    >
                      {region.relatedExperiments.length}
                    </div>
                    <p className="text-xs text-museum-300/60">关联实验</p>
                  </div>
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: `${region.color}08`,
                      border: `1px solid ${region.color}20`,
                    }}
                  >
                    <div className="text-2xl mb-2">❓</div>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: region.color }}
                    >
                      {region.faqs.length}
                    </div>
                    <p className="text-xs text-museum-300/60">常见问题</p>
                  </div>
                  <div
                    className="p-4 rounded-xl text-center col-span-2 md:col-span-1"
                    style={{
                      background: `${region.color}08`,
                      border: `1px solid ${region.color}20`,
                    }}
                  >
                    <div className="text-2xl mb-2">🌍</div>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: region.color }}
                    >
                      {region.realLifeImpacts.length}
                    </div>
                    <p className="text-xs text-museum-300/60">现实影响</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "experiments" && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-museum-200/70 text-sm mb-6">
                  以下实验揭示了{region.chineseName}在大脑功能中的重要作用：
                </p>
                {relatedExperiments.map((exp, index) => (
                  <Link
                    key={exp.id}
                    to={`/experiment/${exp.id}`}
                    onClick={onClose}
                    className="block p-5 rounded-xl transition-all hover:-translate-y-1 group"
                    style={{
                      background: `linear-gradient(135deg, ${exp.accentColor}10, transparent)`,
                      border: `1px solid ${exp.accentColor}20`,
                      animation: `slide-up 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${exp.accentColor}40, ${exp.accentColor}10)`,
                          boxShadow: `0 0 20px ${exp.glowColor}`,
                        }}
                      >
                        <span style={{ color: exp.accentColor }}>🔬</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white group-hover:gradient-text transition-all">
                            {exp.title}
                          </h3>
                          <ChevronRight
                            className="w-5 h-5 flex-shrink-0 text-museum-300/40 group-hover:text-white group-hover:translate-x-1 transition-all"
                            style={{ color: exp.accentColor }}
                          />
                        </div>
                        <p className="text-museum-300/60 text-sm line-clamp-2">
                          {exp.shortDescription}
                        </p>
                        <p className="text-xs mt-3 text-museum-300/50 line-clamp-3">
                          {exp.neurosciencePrinciple.slice(0, 120)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-museum-200/70 text-sm mb-6">
                  关于{region.chineseName}，大家最常问的问题：
                </p>
                {region.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden transition-all"
                    style={{
                      animation: `slide-up 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <button
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === index ? null : index)
                      }
                      className="w-full p-4 md:p-5 text-left flex items-start justify-between gap-4 transition-all hover:bg-white/5"
                      style={{
                        background:
                          openFaqIndex === index
                            ? `${region.color}10`
                            : "rgba(255,255,255,0.03)",
                        border: `1px solid ${
                          openFaqIndex === index
                            ? `${region.color}30`
                            : "rgba(255,255,255,0.05)"
                        }`,
                        borderRadius: openFaqIndex === index ? null : undefined,
                      }}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: `${region.color}20`,
                          }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color: region.color }}
                          >
                            Q
                          </span>
                        </div>
                        <h4 className="font-medium text-white leading-relaxed">
                          {faq.question}
                        </h4>
                      </div>
                      <span
                        className="text-xl font-light flex-shrink-0 transition-transform"
                        style={{
                          color: region.color,
                          transform:
                            openFaqIndex === index
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {openFaqIndex === index && (
                      <div
                        className="p-4 md:p-5 border-t animate-fade-in"
                        style={{
                          background: `${region.color}05`,
                          borderColor: `${region.color}20`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              background: `${region.color}15`,
                            }}
                          >
                            <span
                              className="text-xs font-bold"
                              style={{ color: region.color }}
                            >
                              A
                            </span>
                          </div>
                          <p className="text-museum-200/80 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "impact" && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-museum-200/70 text-sm mb-6">
                  {region.chineseName}如何影响我们的日常生活：
                </p>
                {region.realLifeImpacts.map((impact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl transition-all hover:translate-x-1"
                    style={{
                      background: `linear-gradient(90deg, ${region.color}10, transparent)`,
                      borderLeft: `3px solid ${region.color}`,
                      animation: `slide-up 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                      style={{
                        background: `${region.color}20`,
                      }}
                    >
                      {["💡", "🧠", "🎯", "🌟", "📱"][index % 5]}
                    </div>
                    <p className="text-museum-200/85 text-sm leading-relaxed pt-1">
                      {impact}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
