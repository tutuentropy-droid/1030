import { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  FlaskConical,
  ChevronRight,
  ChevronLeft,
  Eye,
  Brain,
  AlertTriangle,
  Check,
  X,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import type { SubExperiment } from "@/data/experiments";

interface NeuroscienceHistoryProps {
  onComplete: () => void;
  subExperiments?: SubExperiment[];
}

type EraId = "1900-conditioning" | "1960-split-brain" | "modern-attention" | "modern-reward";

interface Era {
  id: EraId;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  glowColor: string;
  emoji: string;
  labBg: string;
}

const ERAS: Era[] = [
  {
    id: "1900-conditioning",
    year: "1902",
    title: "条件反射实验",
    subtitle: "巴甫洛夫的狗",
    description: "在圣彼得堡的实验室里，巴甫洛夫发现了一个改变心理学历史的秘密——铃声如何让狗流口水？",
    color: "#d4a574",
    glowColor: "rgba(212, 165, 116, 0.4)",
    emoji: "🐕",
    labBg: "linear-gradient(135deg, rgba(139,90,43,0.3), rgba(212,165,116,0.15))",
  },
  {
    id: "1960-split-brain",
    year: "1962",
    title: "裂脑实验",
    subtitle: "斯佩里与加扎尼加",
    description: "切断连接两个大脑半球的桥梁后，一个人居然会有两个独立的意识？这究竟是怎么回事？",
    color: "#00d4ff",
    glowColor: "rgba(0, 212, 255, 0.4)",
    emoji: "🧠",
    labBg: "linear-gradient(135deg, rgba(0,100,150,0.3), rgba(0,212,255,0.15))",
  },
  {
    id: "modern-attention",
    year: "1999",
    title: "注意力实验",
    subtitle: "看不见的大猩猩",
    description: "当你的注意力被占用时，一只大猩猩从你面前走过，你会看到吗？答案可能出乎意料。",
    color: "#ffbe0b",
    glowColor: "rgba(255, 190, 11, 0.4)",
    emoji: "👁️",
    labBg: "linear-gradient(135deg, rgba(200,150,0,0.3), rgba(255,190,11,0.15))",
  },
  {
    id: "modern-reward",
    year: "2024",
    title: "奖励预测实验",
    subtitle: "多巴胺的秘密",
    description: "你以为多巴胺是快乐的化学物质？错了！它其实是'意外'的信号分子。来体验预测误差的奇妙感觉。",
    color: "#06ffa5",
    glowColor: "rgba(6, 255, 165, 0.4)",
    emoji: "⚡",
    labBg: "linear-gradient(135deg, rgba(0,150,100,0.3), rgba(6,255,165,0.15))",
  },
];

interface ConditioningState {
  phase: "observe" | "pairing" | "test";
  pairings: number;
  bellRinging: boolean;
  foodPresent: boolean;
  dogSalivating: boolean;
  userGuess: "yes" | "no" | null;
}

interface SplitBrainState {
  phase: "intro" | "left-field" | "right-field";
  leftFieldObject: string;
  rightFieldObject: string;
  leftGuess: "can-name" | "cannot-name" | null;
  rightGuess: "can-name" | "cannot-name" | null;
}

interface AttentionState {
  phase: "counting" | "question";
  userGuessGorilla: "yes" | "no" | null;
  countingProgress: number;
}

interface RewardState {
  trials: number;
  dopamineLevel: number;
  currentTrialType: "expected" | "unexpected" | "omission";
  trialResults: { type: string; dopamine: number }[];
  userGuesses: ("spike" | "same" | "drop")[];
}

type ViewPhase = "era-select" | "intro" | "experiment" | "guess" | "reveal";

export default function NeuroscienceHistory({ onComplete }: NeuroscienceHistoryProps) {
  const [viewPhase, setViewPhase] = useState<ViewPhase>("era-select");
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [completedEras, setCompletedEras] = useState<Set<EraId>>(new Set());
  const [showFailureBranch, setShowFailureBranch] = useState(false);

  const [condState, setCondState] = useState<ConditioningState>({
    phase: "observe", pairings: 0, bellRinging: false, foodPresent: false, dogSalivating: false, userGuess: null,
  });
  const [splitState, setSplitState] = useState<SplitBrainState>({
    phase: "intro", leftFieldObject: "苹果", rightFieldObject: "钥匙", leftGuess: null, rightGuess: null,
  });
  const [attnState, setAttnState] = useState<AttentionState>({
    phase: "counting", userGuessGorilla: null, countingProgress: 0,
  });
  const [rewardState, setRewardState] = useState<RewardState>({
    trials: 0, dopamineLevel: 50, currentTrialType: "expected", trialResults: [], userGuesses: [],
  });

  const condTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (condTimerRef.current) clearTimeout(condTimerRef.current); };
  }, []);

  const markEraComplete = useCallback((eraId: EraId) => {
    setCompletedEras((prev) => { const next = new Set(prev); next.add(eraId); return next; });
  }, []);

  useEffect(() => {
    if (completedEras.size === ERAS.length) onComplete();
  }, [completedEras.size, onComplete]);

  const handleSelectEra = (era: Era) => {
    setSelectedEra(era);
    setViewPhase("intro");
    setShowFailureBranch(false);
    resetEraState(era.id);
  };

  const resetEraState = (eraId: EraId) => {
    if (eraId === "1900-conditioning") {
      setCondState({ phase: "observe", pairings: 0, bellRinging: false, foodPresent: false, dogSalivating: false, userGuess: null });
    } else if (eraId === "1960-split-brain") {
      setSplitState({ phase: "intro", leftFieldObject: "苹果", rightFieldObject: "钥匙", leftGuess: null, rightGuess: null });
    } else if (eraId === "modern-attention") {
      setAttnState({ phase: "counting", userGuessGorilla: null, countingProgress: 0 });
    } else if (eraId === "modern-reward") {
      setRewardState({ trials: 0, dopamineLevel: 50, currentTrialType: "expected", trialResults: [], userGuesses: [] });
    }
  };

  const runConditioning = () => {
    setCondState((p) => ({ ...p, phase: "pairing", pairings: 0 }));
    const runPairing = (count: number) => {
      if (count >= 5) { setCondState((p) => ({ ...p, phase: "test", pairings: 5 })); return; }
      setCondState((p) => ({ ...p, bellRinging: true, foodPresent: false, dogSalivating: false }));
      condTimerRef.current = setTimeout(() => {
        setCondState((p) => ({ ...p, bellRinging: true, foodPresent: true, dogSalivating: true, pairings: p.pairings + 1 }));
        condTimerRef.current = setTimeout(() => {
          setCondState((p) => ({ ...p, bellRinging: false, foodPresent: false, dogSalivating: false }));
          condTimerRef.current = setTimeout(() => runPairing(count + 1), 600);
        }, 1200);
      }, 800);
    };
    runPairing(0);
  };

  const testConditioning = () => {
    setCondState((p) => ({ ...p, bellRinging: true, foodPresent: false, dogSalivating: false }));
    condTimerRef.current = setTimeout(() => {
      setCondState((p) => ({ ...p, bellRinging: true, foodPresent: false, dogSalivating: true }));
    }, 1500);
  };

  const handleConditioningGuess = (guess: "yes" | "no") => {
    setCondState((p) => ({ ...p, userGuess: guess }));
    markEraComplete("1900-conditioning");
    setViewPhase("reveal");
  };

  const startAttentionExperiment = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setAttnState((p) => ({ ...p, countingProgress: progress }));
      if (progress >= 100) { clearInterval(interval); setAttnState((p) => ({ ...p, phase: "question" })); }
    }, 100);
  };

  const handleAttentionGuess = (guess: "yes" | "no") => {
    setAttnState((p) => ({ ...p, userGuessGorilla: guess }));
    markEraComplete("modern-attention");
    setViewPhase("reveal");
  };

  const handleSplitBrainGuess = (field: "left" | "right", guess: "can-name" | "cannot-name") => {
    if (field === "left") setSplitState((p) => ({ ...p, leftGuess: guess }));
    else setSplitState((p) => ({ ...p, rightGuess: guess }));
  };

  const handleRewardTrial = (userGuess: "spike" | "same" | "drop") => {
    const t = rewardState.currentTrialType;
    let dopamine = 0;
    if (t === "expected") dopamine = 0;
    else if (t === "unexpected") dopamine = 1;
    else dopamine = -1;

    const newResult = { type: t, dopamine };
    const newGuesses = [...rewardState.userGuesses, userGuess];
    const newTrials = rewardState.trials + 1;
    const nextTypes: ("expected" | "unexpected" | "omission")[] = ["expected", "unexpected", "omission"];
    const nextTrialType = nextTypes[newTrials % 3];
    const newResults = [...rewardState.trialResults, newResult];

    setRewardState((p) => ({
      ...p, trials: newTrials, trialResults: newResults, userGuesses: newGuesses,
      currentTrialType: nextTrialType,
      dopamineLevel: Math.max(0, Math.min(100, p.dopamineLevel + dopamine * 30)),
    }));

    if (newTrials >= 6) {
      setRewardState((p) => ({ ...p, trialResults: newResults, userGuesses: newGuesses, trials: newTrials }));
      markEraComplete("modern-reward");
      setViewPhase("reveal");
    }
  };

  const renderEraSelect = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <FlaskConical className="w-4 h-4" style={{ color: "#d4a574" }} />
          <span className="text-sm text-museum-200/80">穿越神经科学百年历史</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          选择一个<span className="gradient-text">年代</span>
        </h2>
        <p className="text-museum-200/60 max-w-lg mx-auto">进入不同年代的实验室，亲自体验改变神经科学历史的经典实验。先猜，再看真相。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ERAS.map((era, index) => {
          const completed = completedEras.has(era.id);
          return (
            <button key={era.id} onClick={() => handleSelectEra(era)}
              className="glass-card glass-card-hover group relative overflow-hidden text-left animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}>
              <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" style={{ background: era.color }} />
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${era.color}40, ${era.color}10)`, boxShadow: `0 0 30px ${era.glowColor}` }}>
                    <span className="text-3xl">{era.emoji}</span>
                  </div>
                  {completed && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06ffa5, #00d4ff)", boxShadow: "0 0 15px rgba(6, 255, 165, 0.5)" }}>
                      <Check className="w-4 h-4 text-museum-950" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: era.color }} />
                  <span className="text-sm font-medium" style={{ color: era.color }}>{era.year}年</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-1">{era.title}</h3>
                <p className="text-sm text-museum-200/60 mb-3">{era.subtitle}</p>
                <p className="text-sm text-museum-200/50 leading-relaxed mb-4">{era.description}</p>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: era.color }}>
                  <span>{completed ? "再次体验" : "进入实验室"}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {completedEras.size === ERAS.length && (
        <div className="text-center mt-10 animate-fade-in">
          <div className="glass-card p-6 inline-block" style={{ background: "linear-gradient(135deg, rgba(6, 255, 165, 0.1), rgba(0, 212, 255, 0.1))", border: "1px solid rgba(6, 255, 165, 0.3)" }}>
            <p className="text-lg font-display font-bold text-white mb-2">🎉 恭喜！你已穿越全部年代</p>
            <p className="text-sm text-museum-200/60">你已亲身体验了神经科学史上最重要的四个经典实验</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderIntro = () => {
    if (!selectedEra) return null;
    const introTexts: Record<EraId, string> = {
      "1900-conditioning": "你现在身处圣彼得堡的一间实验室。巴甫洛夫正在研究狗的消化系统，却意外发现了一个惊人的现象——狗不仅在吃到食物时会分泌唾液，甚至在听到饲养员的脚步声时就开始流口水了。这究竟是巧合，还是大脑有着某种神秘的学习机制？让我们来验证吧！",
      "1960-split-brain": "你来到了加州理工学院的实验室。罗杰·斯佩里和迈克尔·加扎尼加正在研究一批特殊的患者——他们的胼胝体（连接左右大脑半球的桥梁）被手术切断了，以治疗严重癫痫。这些患者看起来完全正常，但当研究者仔细测试时，发现了一个惊人的事实……",
      "modern-attention": "哈佛大学的丹尼尔·西蒙斯和克里斯托弗·查布里斯设计了一个看似简单的实验：让受试者观看一段传球视频，数清楚白衣球员传了多少次球。大多数人都能准确数出传球次数，但他们却错过了一件极其明显的事……",
      "modern-reward": "在现代神经科学实验室里，沃尔夫拉姆·舒尔茨发现了一个颠覆认知的现象：多巴胺神经元在你获得预期奖励时几乎不反应，反而在「意外」获得奖励时疯狂放电！这意味着多巴胺不是「快乐分子」，而是「意外信号分子」——它编码的是预测误差。让你亲自来体验一下吧！",
    };
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        <div className="glass-card p-8 md:p-12" style={{ background: selectedEra.labBg, border: `1px solid ${selectedEra.color}30` }}>
          <div className="text-5xl mb-6">{selectedEra.emoji}</div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: `${selectedEra.color}20`, border: `1px solid ${selectedEra.color}40` }}>
            <Clock className="w-3 h-3" style={{ color: selectedEra.color }} />
            <span className="text-xs font-medium" style={{ color: selectedEra.color }}>{selectedEra.year}年</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">{selectedEra.title}</h2>
          <p className="text-lg text-museum-200/80 mb-6">{selectedEra.subtitle}</p>
          <p className="text-museum-200/60 leading-relaxed mb-8">{introTexts[selectedEra.id]}</p>
          <button onClick={() => setViewPhase("experiment")} className="btn-primary text-lg">
            开始实验 <FlaskConical className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderConditioning = () => {
    const era = ERAS[0];
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-6 md:p-8" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          {condState.phase === "observe" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">第一步：观察自然反应</h3>
              <p className="text-museum-200/60 mb-6">首先，让我们看看狗在正常情况下的反应。点击按钮给狗喂食。</p>
              <div className="relative w-64 h-48 mx-auto mb-6 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(139,90,43,0.3), rgba(80,50,20,0.5))", border: `1px solid ${era.color}30` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🐕</div>
                    {condState.foodPresent ? (
                      <div className="animate-fade-in"><div className="text-2xl mb-1">🥩</div><div className="text-xs text-museum-200/60">🐶 唾液分泌中...</div></div>
                    ) : (
                      <div className="text-sm text-museum-200/40">安静等待中...</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => setCondState((p) => ({ ...p, foodPresent: true, dogSalivating: true }))} className="btn-primary" disabled={condState.foodPresent}>🥩 给狗喂食</button>
                {condState.foodPresent && (
                  <button onClick={runConditioning} className="btn-primary animate-fade-in" style={{ background: `linear-gradient(135deg, ${era.color}, ${era.color}cc)` }}>
                    下一步：配对训练 <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
          {condState.phase === "pairing" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">第二步：配对训练</h3>
              <p className="text-museum-200/60 mb-4">现在我们在给食物之前先摇铃。观察狗的反应变化。<span className="ml-1" style={{ color: era.color }}>配对进度：{condState.pairings}/5</span></p>
              <div className="relative w-64 h-48 mx-auto mb-6 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(139,90,43,0.3), rgba(80,50,20,0.5))", border: `1px solid ${era.color}30` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🐕</div>
                    <div className="flex items-center justify-center gap-3">
                      {condState.bellRinging && <span className="text-2xl animate-bounce">🔔</span>}
                      {condState.foodPresent && <span className="text-2xl">🥩</span>}
                    </div>
                    {condState.dogSalivating && <div className="text-xs mt-2 animate-fade-in" style={{ color: era.color }}>🐶 唾液分泌！</div>}
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${(condState.pairings / 5) * 100}%`, background: era.color }} />
              </div>
              {condState.pairings >= 5 && (
                <button onClick={() => setViewPhase("guess")} className="btn-primary animate-fade-in">训练完成！进入测试 <ChevronRight className="w-4 h-4" /></button>
              )}
            </div>
          )}
          {condState.phase === "test" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">第三步：关键测试</h3>
              <p className="text-museum-200/60 mb-6">现在我们只摇铃，不给食物。点击测试！</p>
              <div className="relative w-64 h-48 mx-auto mb-6 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(139,90,43,0.3), rgba(80,50,20,0.5))", border: `1px solid ${era.color}30` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🐕</div>
                    {condState.bellRinging && !condState.foodPresent && (
                      <div className="animate-fade-in">
                        <span className="text-2xl animate-bounce">🔔</span>
                        {condState.dogSalivating && <div className="text-xs mt-2" style={{ color: era.color }}>🐶 唾液分泌！</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={testConditioning} className="btn-primary" disabled={condState.bellRinging}>🔔 只摇铃，不给食物</button>
              {condState.dogSalivating && condState.bellRinging && !condState.foodPresent && (
                <button onClick={() => setViewPhase("guess")} className="btn-primary ml-3 animate-fade-in">结果出来了！ <ChevronRight className="w-4 h-4" /></button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConditioningGuess = () => {
    const era = ERAS[0];
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="glass-card p-8 text-center" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          <h3 className="text-2xl font-display font-bold text-white mb-4">🤔 你觉得发生了什么？</h3>
          <p className="text-museum-200/70 mb-8">铃声响起，没有食物——但狗还是流口水了！<br />在看到结果之前，你觉得这只狗为什么会对铃声产生唾液反应？</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={() => handleConditioningGuess("yes")} className="glass-card px-6 py-4 text-left transition-all hover:scale-105" style={{ border: `1px solid ${era.color}40` }}>
              <div className="font-bold text-white mb-1">大脑学会了联想</div>
              <div className="text-sm text-museum-200/60">铃声和食物反复配对后，大脑将两者关联，铃声变成了食物的"信号"</div>
            </button>
            <button onClick={() => handleConditioningGuess("no")} className="glass-card px-6 py-4 text-left transition-all hover:scale-105" style={{ border: "1px solid rgba(255,100,100,0.3)" }}>
              <div className="font-bold text-white mb-1">这只是巧合</div>
              <div className="text-sm text-museum-200/60">狗可能只是随机流口水，跟铃声没有关系</div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConditioningReveal = () => {
    const era = ERAS[0];
    const isCorrect = condState.userGuess === "yes";
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-8 mb-6" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
              {isCorrect ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />}
              <span className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>{isCorrect ? "正确！" : "不完全对！"}</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">经典条件反射</h3>
            <p className="text-museum-200/70 leading-relaxed">巴甫洛夫发现，当铃声（中性刺激）与食物（无条件刺激）反复配对后，铃声本身就足以引起唾液分泌（条件反应）。这就是<strong className="text-white">经典条件反射</strong>——大脑通过联想学习，将原本无关的刺激赋予了新的意义。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4 text-center"><div className="text-2xl mb-2">🔔 → 🥩</div><div className="text-sm font-bold text-white mb-1">配对前</div><div className="text-xs text-museum-200/60">铃声 = 无意义的声音</div></div>
            <div className="glass-card p-4 text-center"><div className="text-2xl mb-2">🔔 + 🥩 → 🤤</div><div className="text-sm font-bold text-white mb-1">反复配对</div><div className="text-xs text-museum-200/60">铃声+食物 → 唾液反应</div></div>
            <div className="glass-card p-4 text-center"><div className="text-2xl mb-2">🔔 → 🤤</div><div className="text-sm font-bold text-white mb-1">配对后</div><div className="text-xs text-museum-200/60">铃声 = 食物信号！</div></div>
          </div>
          <div className="glass-card p-5 mb-6" style={{ background: "linear-gradient(135deg, rgba(157, 78, 221, 0.15), rgba(0, 212, 255, 0.1))", border: "1px solid rgba(157, 78, 221, 0.2)" }}>
            <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5 text-neon-purple" /><span className="font-bold text-white">神经原理</span></div>
            <p className="text-sm text-museum-200/70 leading-relaxed">条件反射的神经基础是<strong className="text-white">突触可塑性</strong>——反复的铃声-食物配对强化了杏仁核和脑干中听觉通路与唾液核之间的突触连接。这种<strong className="text-white">赫布学习</strong>（"一起放电的神经元连在一起"）是所有联想学习的基石。巴甫洛夫的发现开启了行为主义心理学，至今仍是理解恐惧条件反射、广告效应、味觉厌恶等现象的核心框架。</p>
          </div>
          {!showFailureBranch && (
            <div className="text-center">
              <button onClick={() => setShowFailureBranch(true)} className="btn-secondary gap-2" style={{ borderColor: `${era.color}40`, color: era.color }}>
                <AlertTriangle className="w-4 h-4" /> 如果实验失败了会怎样？
              </button>
            </div>
          )}
          {showFailureBranch && (
            <div className="glass-card p-5 animate-slide-up" style={{ background: "linear-gradient(135deg, rgba(230, 57, 70, 0.15), rgba(255, 100, 100, 0.1))", border: "1px solid rgba(230, 57, 70, 0.3)" }}>
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="font-bold text-red-300">⚡ 如果实验失败：消退与重获</span></div>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-3">如果铃声反复响起却从不伴随食物，条件反射会<strong className="text-white">逐渐消退</strong>（Extinction）——狗不再对铃声流口水。但令人惊讶的是，消退并非"遗忘"！</p>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-3">如果让狗休息一天后再次摇铃，它又会流口水——这叫<strong className="text-white">自发恢复</strong>（Spontaneous Recovery）。原始的条件反射记忆并没有被删除，只是被新的"抑制性记忆"覆盖了。这就是为什么恐惧症治疗后容易复发——旧的条件反射只是被压制，而非根除。</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl" style={{ background: "rgba(212,165,116,0.1)", border: "1px solid rgba(212,165,116,0.2)" }}><div className="text-xs font-bold text-white mb-1">🔔 → ❌🥩 → 🐕</div><div className="text-xs text-museum-200/50">反复不给食物：消退</div></div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(212,165,116,0.1)", border: "1px solid rgba(212,165,116,0.2)" }}><div className="text-xs font-bold text-white mb-1">休息 → 🔔 → 🤤</div><div className="text-xs text-museum-200/50">自发恢复！</div></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={() => { setViewPhase("era-select"); setSelectedEra(null); }} className="btn-secondary gap-2"><ChevronLeft className="w-4 h-4" /> 返回年代选择</button>
          <button onClick={() => { resetEraState(selectedEra!.id); setViewPhase("experiment"); setShowFailureBranch(false); }} className="btn-primary gap-2"><RotateCcw className="w-4 h-4" /> 重新体验</button>
        </div>
      </div>
    );
  };

  const renderSplitBrain = () => {
    const era = ERAS[1];
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-6 md:p-8" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          {splitState.phase === "intro" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">裂脑患者的视觉世界</h3>
              <p className="text-museum-200/60 mb-6">裂脑患者的左右视觉信息无法共享。左视野 → 右半球，右视野 → 左半球。由于语言功能在左半球，只有右视野的信息才能被"说出来"。</p>
              <div className="relative w-80 h-56 mx-auto mb-6 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(90deg, rgba(0,100,200,0.3), rgba(0,50,100,0.5), rgba(200,0,0,0.3))", border: `1px solid ${era.color}30` }}>
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 flex flex-col items-center justify-center border-r border-white/10"><div className="text-xs text-blue-300/60 mb-2">左视野 → 右半球</div><div className="text-4xl">🍎</div><div className="text-xs text-museum-200/40 mt-2">看到 {splitState.leftFieldObject}</div></div>
                  <div className="w-1/2 flex flex-col items-center justify-center"><div className="text-xs text-red-300/60 mb-2">右视野 → 左半球</div><div className="text-4xl">🔑</div><div className="text-xs text-museum-200/40 mt-2">看到 {splitState.rightFieldObject}</div></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="text-2xl">👁️</div></div>
              </div>
              <button onClick={() => setSplitState((p) => ({ ...p, phase: "left-field" }))} className="btn-primary">开始测试 <Eye className="w-5 h-5" /></button>
            </div>
          )}
          {splitState.phase === "left-field" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">测试1：左视野信息</h3>
              <p className="text-museum-200/60 mb-6">🍎 苹果出现在左视野，信息传到了右半球。<br />患者能用<strong className="text-white">语言</strong>说出看到了什么吗？</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button onClick={() => handleSplitBrainGuess("left", "can-name")} className={`glass-card px-6 py-4 text-center transition-all hover:scale-105 ${splitState.leftGuess === "can-name" ? "ring-2 ring-green-400" : ""}`} style={{ borderColor: splitState.leftGuess === "can-name" ? "#06ffa5" : "rgba(255,255,255,0.2)" }}>
                  <div className="font-bold text-white mb-1">能说出</div><div className="text-sm text-museum-200/60">"我看到了苹果"</div>
                </button>
                <button onClick={() => handleSplitBrainGuess("left", "cannot-name")} className={`glass-card px-6 py-4 text-center transition-all hover:scale-105 ${splitState.leftGuess === "cannot-name" ? "ring-2 ring-pink-400" : ""}`} style={{ borderColor: splitState.leftGuess === "cannot-name" ? "#ff006e" : "rgba(255,255,255,0.2)" }}>
                  <div className="font-bold text-white mb-1">说不出</div><div className="text-sm text-museum-200/60">"我什么都没看到"</div>
                </button>
              </div>
              {splitState.leftGuess && <button onClick={() => setSplitState((p) => ({ ...p, phase: "right-field" }))} className="btn-primary animate-fade-in">测试右视野 <ChevronRight className="w-4 h-4" /></button>}
            </div>
          )}
          {splitState.phase === "right-field" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">测试2：右视野信息</h3>
              <p className="text-museum-200/60 mb-6">🔑 钥匙出现在右视野，信息传到了左半球。<br />患者能用<strong className="text-white">语言</strong>说出看到了什么吗？</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button onClick={() => handleSplitBrainGuess("right", "can-name")} className={`glass-card px-6 py-4 text-center transition-all hover:scale-105 ${splitState.rightGuess === "can-name" ? "ring-2 ring-green-400" : ""}`} style={{ borderColor: splitState.rightGuess === "can-name" ? "#06ffa5" : "rgba(255,255,255,0.2)" }}>
                  <div className="font-bold text-white mb-1">能说出</div><div className="text-sm text-museum-200/60">"我看到了钥匙"</div>
                </button>
                <button onClick={() => handleSplitBrainGuess("right", "cannot-name")} className={`glass-card px-6 py-4 text-center transition-all hover:scale-105 ${splitState.rightGuess === "cannot-name" ? "ring-2 ring-pink-400" : ""}`} style={{ borderColor: splitState.rightGuess === "cannot-name" ? "#ff006e" : "rgba(255,255,255,0.2)" }}>
                  <div className="font-bold text-white mb-1">说不出</div><div className="text-sm text-museum-200/60">"我什么都没看到"</div>
                </button>
              </div>
              {splitState.rightGuess && <button onClick={() => setViewPhase("guess")} className="btn-primary animate-fade-in">揭晓答案！ <Lightbulb className="w-4 h-4" /></button>}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSplitBrainGuess = () => {
    const era = ERAS[1];
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="glass-card p-8 text-center" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          <h3 className="text-2xl font-display font-bold text-white mb-4">🤔 准备揭晓真相</h3>
          <p className="text-museum-200/70 mb-8">你已经做出了判断。裂脑患者在左右视野测试中会有怎样不同的表现？<br />点击按钮查看真实实验结果！</p>
          <button onClick={() => { markEraComplete("1960-split-brain"); setViewPhase("reveal"); }} className="btn-primary"><Lightbulb className="w-5 h-5" /> 揭晓结果</button>
        </div>
      </div>
    );
  };

  const renderSplitBrainReveal = () => {
    const era = ERAS[1];
    const leftCorrect = splitState.leftGuess === "cannot-name";
    const rightCorrect = splitState.rightGuess === "can-name";
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-8 mb-6" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold text-white mb-4">裂脑实验的惊人发现</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-5 text-center">
                <div className="text-xs text-blue-300/60 mb-2">左视野 → 右半球</div>
                <div className="text-3xl mb-2">🍎</div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${leftCorrect ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                  {leftCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {leftCorrect ? "你说对了！" : "不对哦！"}
                </div>
                <p className="text-sm text-museum-200/60 mt-2">患者说<strong className="text-red-400">"什么都没看到"</strong>——因为右半球没有语言能力，无法说出看到的东西。但左手能画出苹果！</p>
              </div>
              <div className="glass-card p-5 text-center">
                <div className="text-xs text-red-300/60 mb-2">右视野 → 左半球</div>
                <div className="text-3xl mb-2">🔑</div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${rightCorrect ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                  {rightCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {rightCorrect ? "你说对了！" : "不对哦！"}
                </div>
                <p className="text-sm text-museum-200/60 mt-2">患者轻松说出<strong className="text-green-400">"钥匙"</strong>——左半球有语言中枢（布罗卡区、韦尼克区）。</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-5 mb-6" style={{ background: "linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(157, 78, 221, 0.1))", border: "1px solid rgba(0, 212, 255, 0.2)" }}>
            <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5 text-neon-blue" /><span className="font-bold text-white">神经原理</span></div>
            <p className="text-sm text-museum-200/70 leading-relaxed">裂脑实验揭示了大脑的<strong className="text-white">功能偏侧化</strong>：左半球负责语言、逻辑和分析，右半球负责空间、面部识别和整体感知。胼胝体是连接两半球的"信息高速公路"——切断后，两个半球各自为政，仿佛一个头颅里住着两个独立的意识。斯佩里因此获得1981年诺贝尔生理学或医学奖。</p>
          </div>
          {!showFailureBranch && (
            <div className="text-center">
              <button onClick={() => setShowFailureBranch(true)} className="btn-secondary gap-2" style={{ borderColor: `${era.color}40`, color: era.color }}>
                <AlertTriangle className="w-4 h-4" /> 如果实验失败了会怎样？
              </button>
            </div>
          )}
          {showFailureBranch && (
            <div className="glass-card p-5 animate-slide-up" style={{ background: "linear-gradient(135deg, rgba(230, 57, 70, 0.15), rgba(255, 100, 100, 0.1))", border: "1px solid rgba(230, 57, 70, 0.3)" }}>
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="font-bold text-red-300">⚡ 如果胼胝体没有完全切断</span></div>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-3">如果手术只切断了胼胝体的部分纤维，残余的连接仍然可以让信息在左右半球间"泄漏"。这会导致<strong className="text-white">部分信息传递</strong>——患者可能在某种程度上"模糊地知道"左视野看到了什么。</p>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-3">更有趣的是，如果右半球通过<strong className="text-white">皮下通路</strong>（如前连合）将情绪信息传递给左半球，患者会说："我不知道看到了什么，但我有一种奇怪的感觉。" 这暗示着即使语言中枢无法说出内容，情绪仍然可以跨越半球的隔阂。</p>
              <div className="p-3 rounded-xl mt-3" style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
                <div className="text-xs text-museum-200/60">现实中，有些裂脑患者发展出了<strong className="text-white">交叉提示策略</strong>——比如右半球控制左手在空间中"画出"看到的东西，左半球看到手在画什么后就能说出来了！大脑的适应性远超我们的想象。</div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={() => { setViewPhase("era-select"); setSelectedEra(null); }} className="btn-secondary gap-2"><ChevronLeft className="w-4 h-4" /> 返回年代选择</button>
          <button onClick={() => { resetEraState(selectedEra!.id); setViewPhase("experiment"); setShowFailureBranch(false); }} className="btn-primary gap-2"><RotateCcw className="w-4 h-4" /> 重新体验</button>
        </div>
      </div>
    );
  };

  const renderAttention = () => {
    const era = ERAS[2];
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-6 md:p-8" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          {attnState.phase === "counting" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">数一数传球次数</h3>
              <p className="text-museum-200/60 mb-6">观看下面的动画，<strong className="text-white">只数白衣球员的传球次数</strong>。集中注意力！</p>
              <div className="relative w-full max-w-md mx-auto h-64 rounded-2xl overflow-hidden mb-6" style={{ background: "linear-gradient(180deg, rgba(100,100,100,0.3), rgba(50,50,50,0.5))", border: `1px solid ${era.color}30` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-3xl animate-bounce" style={{ animationDelay: "0s" }}>🤾‍♂️</div>
                      <div className="text-3xl animate-bounce" style={{ animationDelay: "0.3s" }}>🏀</div>
                      <div className="text-3xl animate-bounce" style={{ animationDelay: "0.6s" }}>🤾‍♀️</div>
                    </div>
                    {attnState.countingProgress > 50 && <div className="text-6xl animate-fade-in" style={{ animationDuration: "0.3s" }}>🦍</div>}
                    <div className="text-xs text-museum-200/40 mt-2">专注数传球... {attnState.countingProgress}%</div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-1 transition-all duration-100" style={{ width: `${attnState.countingProgress}%`, background: era.color }} />
                </div>
              </div>
              {attnState.countingProgress === 0 && (
                <button onClick={startAttentionExperiment} className="btn-primary">开始观看 <Eye className="w-5 h-5" /></button>
              )}
            </div>
          )}
          {attnState.phase === "question" && (
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-white mb-4">实验结束！</h3>
              <p className="text-museum-200/60 mb-4">白衣球员传了大约15次球。</p>
              <p className="text-white font-bold text-lg mb-6">但是——你有没有看到什么不寻常的东西？</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => handleAttentionGuess("yes")} className="glass-card px-6 py-4 text-center transition-all hover:scale-105" style={{ border: `1px solid ${era.color}40` }}>
                  <div className="font-bold text-white mb-1">看到了！🦍</div><div className="text-sm text-museum-200/60">有一只大猩猩走过！</div>
                </button>
                <button onClick={() => handleAttentionGuess("no")} className="glass-card px-6 py-4 text-center transition-all hover:scale-105" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div className="font-bold text-white mb-1">没有</div><div className="text-sm text-museum-200/60">我只看到了传球</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAttentionReveal = () => {
    const era = ERAS[2];
    const sawGorilla = attnState.userGuessGorilla === "yes";
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-8 mb-6" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🦍</div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">非注意盲视</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${sawGorilla ? "bg-green-500/10 border border-green-500/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
              {sawGorilla ? (
                <><Check className="w-5 h-5 text-green-400" /><span className="text-green-400 font-bold">你看到了大猩猩！观察力很强！</span></>
              ) : (
                <><Eye className="w-5 h-5 text-yellow-400" /><span className="text-yellow-400 font-bold">你错过了大猩猩！但这很正常！</span></>
              )}
            </div>
            <p className="text-museum-200/70 leading-relaxed">在原始实验中，约<strong className="text-white">50%</strong>的受试者完全没注意到大猩猩！这不是因为大猩猩不够显眼——它就在画面中央捶胸口——而是因为注意力是一种<strong className="text-white">有限资源</strong>。当你专注数球时，大脑的注意力"聚光灯"只照亮了与任务相关的信息，其他一切都被过滤掉了。</p>
          </div>
          <div className="glass-card p-5 mb-6" style={{ background: "linear-gradient(135deg, rgba(255, 190, 11, 0.15), rgba(157, 78, 221, 0.1))", border: "1px solid rgba(255, 190, 11, 0.2)" }}>
            <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5 text-neon-yellow" /><span className="font-bold text-white">神经原理</span></div>
            <p className="text-sm text-museum-200/70 leading-relaxed">注意力由<strong className="text-white">顶叶皮层</strong>（分配注意力）和<strong className="text-white">前额叶皮层</strong>（目标导向控制）共同管理。当认知资源被占用时，视觉皮层虽然接收了大猩猩的图像信息，但高级处理区域没有多余的带宽来"意识"到它——信息在到达意识之前就被过滤掉了。这就是为什么开车打电话极其危险：你"看"到了路，但大脑没有处理它。</p>
          </div>
          {!showFailureBranch && (
            <div className="text-center">
              <button onClick={() => setShowFailureBranch(true)} className="btn-secondary gap-2" style={{ borderColor: `${era.color}40`, color: era.color }}>
                <AlertTriangle className="w-4 h-4" /> 如果实验失败了会怎样？
              </button>
            </div>
          )}
          {showFailureBranch && (
            <div className="glass-card p-5 animate-slide-up" style={{ background: "linear-gradient(135deg, rgba(230, 57, 70, 0.15), rgba(255, 100, 100, 0.1))", border: "1px solid rgba(230, 57, 70, 0.3)" }}>
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="font-bold text-red-300">⚡ 如果意外刺激与任务相关</span></div>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-3">如果穿过画面的是一个<strong className="text-white">穿着黑色衣服的人</strong>（与数白衣传球任务对比度最高），更多的人会注意到它。西蒙斯的后续实验发现，意外刺激被注意到的概率取决于它与当前任务的<strong className="text-white">相关性</strong>和<strong className="text-white">相似性</strong>。</p>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-3">更反直觉的是：如果你<strong className="text-white">没有被分配任何任务</strong>，只是随意观看，你几乎100%会看到大猩猩。这证明了"看不见"不是因为视觉系统的问题，而是<strong className="text-white">注意力分配策略</strong>的问题。</p>
              <div className="p-3 rounded-xl mt-3" style={{ background: "rgba(255,190,11,0.1)", border: "1px solid rgba(255,190,11,0.2)" }}>
                <div className="text-xs text-museum-200/60">这个发现对现实世界的启示是深远的：专家也会因为过于专注而错过明显的问题。安检员可能因为专注于寻找特定类型的威胁而错过其他危险物品，医生可能因为专注于某种诊断而忽略X光片上的明显异常。</div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={() => { setViewPhase("era-select"); setSelectedEra(null); }} className="btn-secondary gap-2"><ChevronLeft className="w-4 h-4" /> 返回年代选择</button>
          <button onClick={() => { resetEraState(selectedEra!.id); setViewPhase("experiment"); setShowFailureBranch(false); }} className="btn-primary gap-2"><RotateCcw className="w-4 h-4" /> 重新体验</button>
        </div>
      </div>
    );
  };

  const renderReward = () => {
    const era = ERAS[3];
    const trialTypeLabels: Record<string, string> = { expected: "预期中的奖励", unexpected: "意外的奖励", omission: "预期奖励未出现" };
    const trialTypeEmojis: Record<string, string> = { expected: "🎯", unexpected: "🎁", omission: "💔" };
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-6 md:p-8" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-display font-bold text-white mb-2">多巴胺预测误差实验</h3>
            <p className="text-museum-200/60 text-sm">你将经历不同类型的奖励场景。在每种场景中，猜测多巴胺神经元的反应。试次 {rewardState.trials + 1}/6</p>
          </div>
          {rewardState.trials < 6 ? (
            <>
              <div className="glass-card p-5 mb-6 text-center" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${era.color}20` }}>
                <div className="text-4xl mb-3">{trialTypeEmojis[rewardState.currentTrialType]}</div>
                <div className="text-lg font-bold text-white mb-2">{trialTypeLabels[rewardState.currentTrialType]}</div>
                {rewardState.currentTrialType === "expected" && <p className="text-sm text-museum-200/60">你已经学会：按下按钮后总会得到果汁奖励。这次按下按钮，果汁如约而至。</p>}
                {rewardState.currentTrialType === "unexpected" && <p className="text-sm text-museum-200/60">你按下按钮，本以为什么都不会发生——但突然出现了果汁奖励！</p>}
                {rewardState.currentTrialType === "omission" && <p className="text-sm text-museum-200/60">你已经学会：按下按钮后总会得到果汁奖励。但这次按下按钮，果汁没有出现！</p>}
              </div>
              <div className="mb-6">
                <p className="text-sm text-museum-200/70 text-center mb-4">这时，多巴胺神经元的放电率会怎样变化？</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => handleRewardTrial("spike")} className="glass-card px-5 py-3 text-center transition-all hover:scale-105" style={{ border: "1px solid #06ffa540" }}>
                    <div className="text-2xl mb-1">📈</div><div className="font-bold text-white text-sm">飙升</div><div className="text-xs text-museum-200/50">远超基线</div>
                  </button>
                  <button onClick={() => handleRewardTrial("same")} className="glass-card px-5 py-3 text-center transition-all hover:scale-105" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                    <div className="text-2xl mb-1">➡️</div><div className="font-bold text-white text-sm">不变</div><div className="text-xs text-museum-200/50">维持基线</div>
                  </button>
                  <button onClick={() => handleRewardTrial("drop")} className="glass-card px-5 py-3 text-center transition-all hover:scale-105" style={{ border: "1px solid rgba(255,100,100,0.3)" }}>
                    <div className="text-2xl mb-1">📉</div><div className="font-bold text-white text-sm">下降</div><div className="text-xs text-museum-200/50">低于基线</div>
                  </button>
                </div>
              </div>
              {rewardState.trialResults.length > 0 && (
                <div className="glass-card p-4" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-xs text-museum-200/40 mb-3">多巴胺反应记录：</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {rewardState.trialResults.map((result, i) => {
                      const barHeight = result.dopamine === 1 ? 80 : result.dopamine === -1 ? 20 : 50;
                      const barColor = result.dopamine > 0 ? "#06ffa5" : result.dopamine < 0 ? "#ff4444" : "#666";
                      return (
                        <div key={i} className="flex flex-col items-center min-w-[60px]">
                          <div className="w-full h-24 flex items-end justify-center mb-1">
                            <div className="w-8 rounded-t transition-all duration-500" style={{ height: `${barHeight}%`, background: barColor, opacity: 0.8 }} />
                          </div>
                          <div className="text-xs text-museum-200/40">{result.type === "expected" ? "🎯" : result.type === "unexpected" ? "🎁" : "💔"}</div>
                          <div className="text-xs font-bold" style={{ color: barColor }}>{result.dopamine > 0 ? "↑" : result.dopamine < 0 ? "↓" : "→"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    );
  };

  const renderRewardReveal = () => {
    const era = ERAS[3];
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-8 mb-6" style={{ background: era.labBg, border: `1px solid ${era.color}30` }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold text-white mb-4">多巴胺的真实身份</h3>
            <div className="glass-card p-5 mb-6" style={{ background: "linear-gradient(135deg, rgba(6, 255, 165, 0.15), rgba(0, 212, 255, 0.1))", border: "1px solid rgba(6, 255, 165, 0.2)" }}>
              <div className="flex items-center justify-center gap-2 mb-3"><Brain className="w-5 h-5 text-neon-green" /><span className="font-bold text-white">神经原理</span></div>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-4">舒尔茨的发现颠覆了认知：多巴胺不是"快乐分子"，而是<strong className="text-white">"预测误差信号"</strong>。它编码的是<strong className="text-white">实际奖励与预期奖励之间的差值</strong>：</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl" style={{ background: "rgba(6,255,165,0.1)", border: "1px solid rgba(6,255,165,0.2)" }}>
                  <div className="text-xl mb-1">🎁 意外奖励</div><div className="text-xs text-museum-200/60">预期0，得到1</div><div className="text-sm font-bold text-green-400">多巴胺飙升 ↑</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(100,100,100,0.1)", border: "1px solid rgba(100,100,100,0.2)" }}>
                  <div className="text-xl mb-1">🎯 预期奖励</div><div className="text-xs text-museum-200/60">预期1，得到1</div><div className="text-sm font-bold text-gray-400">多巴胺不变 →</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.2)" }}>
                  <div className="text-xl mb-1">💔 奖励缺失</div><div className="text-xs text-museum-200/60">预期1，得到0</div><div className="text-sm font-bold text-red-400">多巴胺下降 ↓</div>
                </div>
              </div>
              <p className="text-sm text-museum-200/70 leading-relaxed">这意味着多巴胺不是在编码"快乐"，而是在编码"意外"。这个发现解释了为什么赌博比稳定收入更让人兴奋——不可预测的奖励产生最大的预测误差，释放最多的多巴胺。短视频App的"无限滚动"机制正是利用了这个原理。</p>
            </div>
          </div>
          {!showFailureBranch && (
            <div className="text-center">
              <button onClick={() => setShowFailureBranch(true)} className="btn-secondary gap-2" style={{ borderColor: `${era.color}40`, color: era.color }}>
                <AlertTriangle className="w-4 h-4" /> 如果实验失败了会怎样？
              </button>
            </div>
          )}
          {showFailureBranch && (
            <div className="glass-card p-5 animate-slide-up" style={{ background: "linear-gradient(135deg, rgba(230, 57, 70, 0.15), rgba(255, 100, 100, 0.1))", border: "1px solid rgba(230, 57, 70, 0.3)" }}>
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="font-bold text-red-300">⚡ 如果奖励变得完全不可预测</span></div>
              <p className="text-sm text-museum-200/70 leading-relaxed mb-3">如果奖励完全随机——有时给有时不给，没有规律可循——多巴胺系统会陷入<strong className="text-white">混乱</strong>。动物实验表明，不可预测的奖励会导致：</p>
              <div className="space-y-2 mb-3">
                <div className="p-2 rounded-lg" style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.15)" }}>
                  <div className="text-xs text-museum-200/70"><strong className="text-white">1. 焦虑增加</strong>——前额叶无法建立预测模型，持续的不确定性激活杏仁核</div>
                </div>
                <div className="p-2 rounded-lg" style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.15)" }}>
                  <div className="text-xs text-museum-200/70"><strong className="text-white">2. 成瘾风险</strong>——可变比率强化（如老虎机）产生最强的多巴胺反应，最难消退</div>
                </div>
                <div className="p-2 rounded-lg" style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.15)" }}>
                  <div className="text-xs text-museum-200/70"><strong className="text-white">3. 习得性无助</strong>——如果完全无法预测也无法控制奖励，动物会放弃尝试（Seligman实验）</div>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "rgba(6,255,165,0.1)", border: "1px solid rgba(6,255,165,0.2)" }}>
                <div className="text-xs text-museum-200/60">这也解释了为什么<strong className="text-white">间歇性强化</strong>（偶尔给奖励）比<strong className="text-white">持续强化</strong>（每次都给）产生的行为更持久——赌博者即使长期输钱也不会停止，因为"下一次可能就赢了"的预测误差太诱人了。</div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={() => { setViewPhase("era-select"); setSelectedEra(null); }} className="btn-secondary gap-2"><ChevronLeft className="w-4 h-4" /> 返回年代选择</button>
          <button onClick={() => { resetEraState(selectedEra!.id); setViewPhase("experiment"); setShowFailureBranch(false); }} className="btn-primary gap-2"><RotateCcw className="w-4 h-4" /> 重新体验</button>
        </div>
      </div>
    );
  };

  const renderExperiment = () => {
    if (!selectedEra) return null;
    if (selectedEra.id === "1900-conditioning") return renderConditioning();
    if (selectedEra.id === "1960-split-brain") return renderSplitBrain();
    if (selectedEra.id === "modern-attention") return renderAttention();
    if (selectedEra.id === "modern-reward") return renderReward();
    return null;
  };

  const renderGuess = () => {
    if (!selectedEra) return null;
    if (selectedEra.id === "1900-conditioning") return renderConditioningGuess();
    if (selectedEra.id === "1960-split-brain") return renderSplitBrainGuess();
    if (selectedEra.id === "modern-attention") return null;
    if (selectedEra.id === "modern-reward") return null;
    return null;
  };

  const renderReveal = () => {
    if (!selectedEra) return null;
    if (selectedEra.id === "1900-conditioning") return renderConditioningReveal();
    if (selectedEra.id === "1960-split-brain") return renderSplitBrainReveal();
    if (selectedEra.id === "modern-attention") return renderAttentionReveal();
    if (selectedEra.id === "modern-reward") return renderRewardReveal();
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {viewPhase === "era-select" && renderEraSelect()}
      {viewPhase === "intro" && renderIntro()}
      {viewPhase === "experiment" && renderExperiment()}
      {viewPhase === "guess" && renderGuess()}
      {viewPhase === "reveal" && renderReveal()}
    </div>
  );
}