import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Zap,
  Waves,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  BehaviorInput,
  calculateNeuroStates,
  calculateRegionStates,
  getRecommendedExperiments,
} from "@/data/brainReplay";
import { getExperimentById } from "@/data/experiments";

interface SliderConfig {
  id: keyof BehaviorInput;
  label: string;
  emoji: string;
  max: number;
  step: number;
  unit: string;
  color: string;
  description: string;
  hint: string;
}

const SLIDERS: SliderConfig[] = [
  {
    id: "sleepHours",
    label: "睡眠",
    emoji: "🌙",
    max: 12,
    step: 0.5,
    unit: "小时",
    color: "#7209b7",
    description: "你今天睡了多久？",
    hint: "成人推荐 7-9 小时最佳，睡眠决定记忆巩固和情绪恢复",
  },
  {
    id: "videoTime",
    label: "刷视频",
    emoji: "📱",
    max: 8,
    step: 0.5,
    unit: "小时",
    color: "#fb5607",
    description: "刷短视频/社交媒体",
    hint: "无限滚动和算法推荐会过度刺激多巴胺奖励系统",
  },
  {
    id: "exerciseMinutes",
    label: "运动",
    emoji: "🏃",
    max: 120,
    step: 10,
    unit: "分钟",
    color: "#06ffa5",
    description: "运动或体力活动",
    hint: "有氧运动促进 BDNF 释放，增强神经可塑性和记忆",
  },
  {
    id: "studyHours",
    label: "学习",
    emoji: "📚",
    max: 10,
    step: 0.5,
    unit: "小时",
    color: "#9d4edd",
    description: "深度阅读、学习或工作",
    hint: "主动学习塑造新神经连接，也消耗前额叶资源",
  },
  {
    id: "socialHours",
    label: "社交",
    emoji: "👥",
    max: 8,
    step: 0.5,
    unit: "小时",
    color: "#f72585",
    description: "面对面或在线社交互动",
    hint: "社交激活心智化网络和奖励系统",
  },
];

export default function BrainRotateCcw() {
  const [input, setInput] = useState<BehaviorInput>({
    sleepHours: 7,
    videoTime: 2,
    exerciseMinutes: 30,
    studyHours: 4,
    socialHours: 2,
  });
  const [phase, setPhase] = useState<"input" | "result">("input");

  const neuroStates = useMemo(() => calculateNeuroStates(input), [input]);
  const regionStates = useMemo(() => calculateRegionStates(input), [input]);
  const recommended = useMemo(
    () => getRecommendedExperiments(neuroStates, regionStates, input),
    [neuroStates, regionStates, input]
  );

  const handleSliderChange = (id: keyof BehaviorInput, value: number) => {
    setInput((prev) => ({ ...prev, [id]: value }));
  };

  const getLevelLabel = (level: number) => {
    if (level > 0.5) return "高度活跃";
    if (level > 0.15) return "轻度活跃";
    if (level > -0.15) return "正常范围";
    if (level > -0.5) return "轻度抑制";
    return "显著抑制";
  };

  if (phase === "input") {
    return (
      <div className="container relative min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <RotateCcw className="w-4 h-4 text-neon-purple" />
              <span className="text-sm text-museum-200/80">今日神经快照</span>
            </div>
            <h1 className="section-title text-4xl md:text-5xl text-white mb-4">
              <span className="gradient-text">今天的大脑回放</span>
            </h1>
            <p className="text-museum-200/70 max-w-2xl mx-auto">
              记录今天做了什么，你的大脑就在经历什么。
              <br />
              不是健康打卡，而是一次神经科学视角的自我扫描。
            </p>
          </div>

          <div className="space-y-5">
            {SLIDERS.map((slider, index) => (
              <div
                key={String(slider.id)}
                className="glass-card p-6 animate-slide-up"
                style={{
                  animationDelay: `${index * 0.08}s`,
                  animationFillMode: "both",
                  borderColor: `${slider.color}30`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${slider.color}30, ${slider.color}10)`,
                      }}
                    >
                      {slider.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {slider.label}
                      </h3>
                      <p className="text-sm text-museum-200/50 mt-0.5">
                        {slider.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: slider.color }}
                  >
                    {input[slider.id]}
                    <span className="text-sm text-museum-200/50 ml-1 font-normal">
                      {slider.unit}
                    </span>
                  </div>
                </div>

                <div className="relative mt-4">
                  <input
                    type="range"
                    min={0}
                    max={slider.max}
                    step={slider.step}
                    value={input[slider.id]}
                    onChange={(e) =>
                      handleSliderChange(slider.id, parseFloat(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${slider.color} ${
                        (input[slider.id] / slider.max) * 100
                      }%, rgba(255,255,255,0.1) ${
                        (input[slider.id] / slider.max) * 100
                      }%)`,
                      accentColor: slider.color,
                    }}
                  />
                  <div className="flex justify-between mt-2 text-xs text-museum-200/30">
                    <span>0{slider.unit}</span>
                    <span>
                      {slider.max}
                      {slider.unit}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-museum-200/40 italic">
                  💡 {slider.hint}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center animate-fade-in">
            <button onClick={() => setPhase("result")} className="btn-primary text-lg">
              <Zap className="w-5 h-5" />
              生成今日大脑快照
            </button>
            <p className="text-sm text-museum-200/40 mt-4">
              基于神经科学研究数据建模，结果仅供自我探索参考
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Brain className="w-4 h-4 text-neon-blue" />
            <span className="text-sm text-museum-200/80">大脑神经状态报告</span>
          </div>
          <h1 className="section-title text-3xl md:text-4xl text-white mb-3">
            今天的<span className="gradient-text">大脑快照</span>
          </h1>
          <p className="text-museum-200/60">
            基于你今天的行为模式，系统计算出的神经状态解读
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Waves className="w-5 h-5 text-neon-purple" />
            神经状态图谱
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neuroStates.map((state, i) => (
              <div
                key={state.id}
                className="glass-card p-5 animate-slide-up"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{state.chineseName}</h3>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: state.level > 0 ? state.color : "#ff006e" }}
                    >
                      {getLevelLabel(state.level)}
                    </p>
                  </div>
                </div>

                <div className="relative h-2 rounded-full bg-white/5 overflow-hidden mt-3">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      marginLeft: state.level >= 0 ? "50%" : `${50 + state.level * 50}%`,
                      width: `${Math.abs(state.level) * 50}%`,
                      background: state.level >= 0 ? state.color : "#ff006e",
                      boxShadow: `0 0 20px ${state.level >= 0 ? state.color : "#ff006e"}60`,
                    }}
                  />
                </div>

                <p className="text-xs text-museum-200/50 mt-3 leading-relaxed">
                  {state.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {regionStates.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Brain className="w-5 h-5 text-neon-pink" />
              活跃的脑区
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionStates.slice(0, 6).map((region, i) => (
                <div
                  key={region.id}
                  className="glass-card p-5 animate-slide-up relative overflow-hidden"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    animationFillMode: "both",
                    borderColor: `${region.color}40`,
                  }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-30"
                    style={{ background: region.color }}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{
                          background: `linear-gradient(135deg, ${region.color}40, ${region.color}10)`,
                        }}
                      >
                        {region.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{region.chineseName}</h3>
                        <p
                          className="text-xs"
                          style={{ color: region.activity > 0 ? region.color : "#ff006e" }}
                        >
                          {region.activity > 0 ? "活动增强" : "活动减弱"}
                          {" "}
                          ({(Math.abs(region.activity) * 100).toFixed(0)}%)
                        </p>
                      </div>
                    </div>

                    {region.explanation && (
                      <p className="text-xs text-museum-200/50 mt-3 leading-relaxed whitespace-pre-line">
                        {region.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommended.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-yellow" />
              为你推荐的实验
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommended.map((rec, i) => {
                const exp = getExperimentById(rec.experimentId);
                if (!exp) return null;

                return (
                  <Link
                    key={rec.experimentId}
                    to={`/experiment/${exp.id}`}
                    className="glass-card glass-card-hover group relative overflow-hidden animate-slide-up"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationFillMode: "both",
                    }}
                  >
                    <div
                      className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                      style={{ background: exp.accentColor }}
                    />

                    <div className="relative p-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${exp.accentColor}40, ${exp.accentColor}10)`,
                          boxShadow: `0 0 20px ${exp.glowColor}`,
                        }}
                      >
                        <Brain
                          className="w-6 h-6"
                          style={{ color: exp.accentColor }}
                        />
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-museum-200/60 mb-4 leading-relaxed">
                        {exp.shortDescription}
                      </p>

                      <div
                        className="glass-card p-3 text-xs mb-4"
                        style={{ background: "rgba(0,0,0,0.3)" }}
                      >
                        <div className="flex items-start gap-2">
                          <Sparkles
                            className="w-3 h-3 mt-0.5 flex-shrink-0"
                            style={{ color: exp.accentColor }}
                          />
                          <p className="text-museum-200/70 leading-relaxed">
                            {rec.reason}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1 text-sm font-medium"
                        style={{ color: exp.accentColor }}
                      >
                        <span>进入实验</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center animate-fade-in">
          <button onClick={() => setPhase("input")} className="btn-secondary">
            <RotateCcw className="w-4 h-4" />
            重新记录
          </button>
          <Link to="/" className="btn-primary ml-3">
            返回大厅
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
