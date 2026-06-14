import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, RotateCcw, Lightbulb, Brain, Zap, Map, Sparkles } from "lucide-react";
import { getExperimentById } from "@/data/experiments";
import ExplanationCard from "@/components/ExplanationCard";
import ColorIllusion from "@/experiments/ColorIllusion";
import MotionIllusion from "@/experiments/MotionIllusion";
import MemoryIllusion from "@/experiments/MemoryIllusion";
import AttentionBlindspot from "@/experiments/AttentionBlindspot";
import TimeIllusion from "@/experiments/TimeIllusion";
import SensoryConflict from "@/experiments/SensoryConflict";
import RewardCircuit from "@/experiments/RewardCircuit";
import { useBrainMap } from "@/hooks/useBrainMap";
import { getBrainRegionsByExperiment } from "@/data/brainRegions";
import UnlockCelebration from "@/components/UnlockCelebration";
import BrainPathway from "@/components/BrainPathway";
import type { PathwayData } from "@/components/BrainPathway";

const experimentComponents: Record<string, React.ComponentType<{ onComplete: () => void; subExperiments?: any }>> = {
  "color-illusion": ColorIllusion,
  "motion-illusion": MotionIllusion,
  "memory-illusion": MemoryIllusion,
  "attention-blindspot": AttentionBlindspot,
  "time-illusion": TimeIllusion,
  "sensory-conflict": SensoryConflict,
  "reward-circuit": RewardCircuit,
};

export default function Experiment() {
  const { id } = useParams<{ id: string }>();
  const experiment = id ? getExperimentById(id) : undefined;
  const [gamePhase, setGamePhase] = useState<"intro" | "playing" | "result">("intro");
  const [showExplanation, setShowExplanation] = useState(false);
  const { completeExperiment, isExperimentCompleted } = useBrainMap();

  if (!experiment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">实验未找到</h1>
          <Link to="/" className="btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const ExperimentGame = experimentComponents[experiment.id];
  const relatedBrainRegions = experiment ? getBrainRegionsByExperiment(experiment.id) : [];
  const experimentDone = experiment ? isExperimentCompleted(experiment.id) : false;

  const handleComplete = () => {
    if (experiment) {
      completeExperiment(experiment.id);
    }
    setGamePhase("result");
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const handleRestart = () => {
    setGamePhase("intro");
    setShowExplanation(false);
  };

  const handleStart = () => {
    setGamePhase("playing");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container px-4">
        <div className="mb-8 animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-museum-300/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回大厅
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${experiment.accentColor}40, ${experiment.accentColor}10)`,
                  boxShadow: `0 0 30px ${experiment.glowColor}`,
                }}
              >
                <div className="w-7 h-7" style={{ color: experiment.accentColor }}>
                  {experiment.icon === "Palette" && <Lightbulb className="w-full h-full" />}
                  {experiment.icon === "RotateCw" && <Zap className="w-full h-full" />}
                  {experiment.icon === "Brain" && <Brain className="w-full h-full" />}
                  {experiment.icon === "Eye" && <Lightbulb className="w-full h-full" />}
                  {experiment.icon === "Clock" && <Zap className="w-full h-full" />}
                  {experiment.icon === "Sparkles" && <Sparkles className="w-full h-full" />}
                  {experiment.icon === "Gift" && <Sparkles className="w-full h-full" />}
                </div>
              </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                {experiment.title}
              </h1>
              <p className="text-museum-300/70">{experiment.shortDescription}</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          {gamePhase === "intro" && (
            <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto text-center animate-fade-in">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                准备好开始了吗？
              </h2>
              <p className="text-museum-200/80 mb-8 leading-relaxed">
                {experiment.introduction}
              </p>
              <p className="text-museum-300/60 text-sm mb-8">
                {experiment.gameInstruction}
              </p>
              <button onClick={handleStart} className="btn-primary text-lg">
                开始体验
                <Zap className="w-5 h-5" />
              </button>
            </div>
          )}

          {gamePhase === "playing" && ExperimentGame && (
            <div className="animate-fade-in">
              <ExperimentGame
                onComplete={handleComplete}
                subExperiments={experiment?.subExperiments}
              />
            </div>
          )}

          {gamePhase === "result" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: experimentDone
                      ? "rgba(6, 255, 165, 0.1)"
                      : "rgba(157, 78, 221, 0.15)",
                    border: `1px solid ${experimentDone
                      ? "rgba(6, 255, 165, 0.3)"
                      : "rgba(157, 78, 221, 0.3)"}`,
                  }}
                >
                  <span className="text-sm font-medium"
                    style={{ color: experimentDone ? "#06ffa5" : "#9d4edd" }}
                  >
                    {experimentDone ? "✓ 已完成过" : "🎉 首次完成"}
                  </span>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-4">
                  体验完成！
                </h2>
                <p className="text-museum-200/70 mb-6">
                  想知道这背后的科学原理吗？继续往下看吧
                </p>

                <div className="glass-card p-5 max-w-xl mx-auto mb-8 animate-slide-up"
                  style={{
                    background: "linear-gradient(135deg, rgba(157, 78, 221, 0.15), rgba(0, 212, 255, 0.1))",
                    border: "1px solid rgba(157, 78, 221, 0.2)",
                    animationDelay: "0.1s",
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-neon-purple" />
                  <p className="text-sm text-museum-200/80 font-medium">
                    🧠 本实验涉及的脑区
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {relatedBrainRegions.map((region) => (
                    <div
                      key={region.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl"
                      style={{
                        background: `${region.color}15`,
                        border: `1px solid ${region.color}30`,
                      }}
                    >
                      <span className="text-xl">{region.emoji}</span>
                      <span className="text-sm font-medium"
                        style={{ color: region.color }}
                      >
                        {region.chineseName}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/brain-map"
                  className="inline-flex items-center gap-2 mt-5 text-sm font-medium hover:underline"
                  style={{ color: "#00d4ff" }}
                >
                  前往大脑地图查看详情
                  <span>→</span>
                </Link>
              </div>

              {experiment?.subExperiments && experiment.subExperiments.length > 0 && (
                <div className="max-w-xl mx-auto mb-8 animate-slide-up"
                  style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
                  <BrainPathway
                    pathways={
                      experiment.subExperiments.map(
                        (sub, idx): PathwayData => ({
                          id: sub.id,
                          label: sub.title,
                          description: sub.description,
                          regionIds: sub.brainPathway,
                          color: [
                            "#f72585",
                            "#38b000",
                            "#ff9e00",
                          ][idx % 3],
                        })
                      )
                    }
                    title="🧠 各子实验脑区参与链路（可叠加查看）"
                  />
                </div>
              )}

              {!experiment?.subExperiments && relatedBrainRegions.length > 1 && (
                <div className="max-w-xl mx-auto mb-8 animate-slide-up"
                  style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
                  <BrainPathway
                    pathways={[
                      {
                        id: experiment?.id ?? "default",
                        label: `${experiment?.title ?? "本实验"} 参与通路`,
                        description: "信息处理过程中的主要脑区激活顺序",
                        regionIds: relatedBrainRegions.map((r) => r.id),
                        color: experiment?.accentColor ?? "#9d4edd",
                      },
                    ]}
                    title="🧠 本实验脑区参与链路"
                    showToggleControls={false}
                  />
                </div>
              )}
              </div>

              {showExplanation && (
                <div className="space-y-8">
                  <ExplanationCard
                    icon={<Lightbulb className="w-6 h-6" />}
                    title="现象描述"
                    content={experiment.phenomenon}
                    color={experiment.accentColor}
                    delay={0.1}
                  />

                  <ExplanationCard
                    icon={<Brain className="w-6 h-6" />}
                    title="神经学原理"
                    content={experiment.neurosciencePrinciple}
                    color={experiment.accentColor}
                    delay={0.2}
                  />

                  <div
                    className="glass-card p-6 animate-slide-up"
                    style={{
                      animationDelay: "0.3s",
                      animationFillMode: "both",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${experiment.accentColor}30, ${experiment.accentColor}10)`,
                        boxShadow: `0 0 20px ${experiment.accentColor}20`,
                      }}
                    >
                      <Zap className="w-6 h-6" style={{ color: experiment.accentColor }} />
                    </div>

                    <h3 className="text-xl font-display font-bold text-white mb-4">
                      现实生活例子
                    </h3>

                    <ul className="space-y-3">
                      {experiment.realLifeExamples.map((example, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-museum-200/80 text-sm leading-relaxed"
                        >
                          <span
                            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: experiment.accentColor }}
                          />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-12">
                <button onClick={handleRestart} className="btn-secondary gap-2">
                  <RotateCcw className="w-4 h-4" />
                  重新体验
                </button>
                <Link to="/" className="btn-primary gap-2">
                  探索其他实验
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <UnlockCelebration />
    </div>
  );
}
