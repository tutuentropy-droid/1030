import { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertTriangle,
  Brain,
  Zap,
  Target,
  Clock,
  Check,
  X,
  RotateCcw,
  Eye,
  Activity,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

interface BrainSystemMalfunctionProps {
  onComplete: () => void;
}

type MalfunctionType =
  | "attention-filter"
  | "time-distortion"
  | "reward-hypersensitivity"
  | "memory-encoding";

type GamePhase =
  | "intro"
  | "normal-intro"
  | "normal-game"
  | "glitch-transition"
  | "malfunction-intro"
  | "malfunction-game"
  | "guess"
  | "reveal";

interface MalfunctionInfo {
  id: MalfunctionType;
  name: string;
  emoji: string;
  color: string;
  glowColor: string;
  description: string;
  brainRegions: { name: string; role: string }[];
  neurosciencePrinciple: string;
}

const MALFUNCTIONS: MalfunctionInfo[] = [
  {
    id: "attention-filter",
    name: "注意力过滤下降",
    emoji: "🎯",
    color: "#ffbe0b",
    glowColor: "rgba(255, 190, 11, 0.4)",
    description:
      "顶叶皮层的注意力过滤功能减弱，无关信息大量涌入意识，导致分心、难以专注。就像大脑的门卫睡着了，什么人都能进来。",
    brainRegions: [
      { name: "顶叶皮层", role: "注意力分配与过滤" },
      { name: "前额叶", role: "目标导向注意力控制" },
      { name: "丘脑", role: "感官信息闸门" },
    ],
    neurosciencePrinciple:
      "注意力由顶叶皮层和前额叶共同管理。顶叶负责筛选感官输入，决定哪些信息可以进入意识层面。当顶叶的过滤功能下降时，大量无关信息会突破防线，导致注意力分散、工作记忆容量下降。这类似于多动症（ADHD）的神经机制——多巴胺能信号不足，导致注意力网络的信噪比降低。丘脑作为感官信息的'中继站'，其网状激活系统的过滤功能也会受到影响。",
  },
  {
    id: "time-distortion",
    name: "时间感失真",
    emoji: "⏰",
    color: "#06ffa5",
    glowColor: "rgba(6, 255, 165, 0.4)",
    description:
      "基底神经节和小脑的计时系统紊乱，时间感知忽快忽慢。一秒钟可能像一小时，一小时也可能像一秒钟。",
    brainRegions: [
      { name: "基底神经节", role: "秒级时间估计" },
      { name: "小脑", role: "毫秒级精确计时" },
      { name: "前额叶", role: "时间跨度判断" },
    ],
    neurosciencePrinciple:
      "大脑没有单一的'时间感知器官'，而是由多个脑区组成的分布式计时网络。小脑负责毫秒级的精确计时（如运动协调），基底神经节参与秒到分钟级的时间估计，前额叶则处理更长的时间跨度。有理论认为，大脑通过神经脉冲的频率和节律来'计算'时间——当神经活动密度改变时，主观时间感也会随之变化。多巴胺和去甲肾上腺素等神经递质水平会显著影响时间感知，这就是为什么兴奋时时间飞逝、恐惧时度日如年。",
  },
  {
    id: "reward-hypersensitivity",
    name: "奖励敏感过强",
    emoji: "💰",
    color: "#fb5607",
    glowColor: "rgba(251, 86, 7, 0.4)",
    description:
      "中脑边缘多巴胺通路过度活跃，对奖励信号异常敏感。一点点诱惑就能让多巴胺飙升，冲动控制完全失效。",
    brainRegions: [
      { name: "腹侧被盖区 (VTA)", role: "多巴胺产生" },
      { name: "伏隔核 (NAc)", role: "奖励评估" },
      { name: "前额叶", role: "冲动控制" },
    ],
    neurosciencePrinciple:
      "奖励回路的核心是中脑边缘多巴胺通路：腹侧被盖区（VTA）产生多巴胺，投射到伏隔核（NAc）和前额叶皮层。当伏隔核对多巴胺的敏感性过高时，即使是微小的奖励线索也会触发强烈的欲望反应。同时，如果前额叶的调控功能不足，就会导致冲动控制障碍。这就是成瘾的神经基础——从药物成瘾到行为成瘾（赌博、游戏、购物），都与多巴胺奖励系统的过度激活和前额叶控制功能的相对削弱有关。",
  },
  {
    id: "memory-encoding",
    name: "记忆编码失败",
    emoji: "🧠",
    color: "#ff006e",
    glowColor: "rgba(255, 0, 110, 0.4)",
    description:
      "海马体的记忆编码功能受损，信息无法从短期记忆转化为长期记忆。就像大脑的硬盘写不进去东西，读完就忘。",
    brainRegions: [
      { name: "海马体", role: "记忆编码与巩固" },
      { name: "前额叶", role: "工作记忆" },
      { name: "内嗅皮层", role: "记忆输入门户" },
    ],
    neurosciencePrinciple:
      "记忆形成是一个多阶段过程：感觉信息首先进入前额叶的工作记忆（只能维持几秒钟），然后通过海马体进行编码，转化为长期记忆存储在大脑皮层各处。海马体就像大脑的'索引系统'——它不存储记忆内容，但记录记忆碎片在皮层中的位置。当海马体功能受损时，信息无法被有效编码为长期记忆，这就是顺行性遗忘症的表现。著名的H.M.患者在切除海马体后，永远无法记住手术后发生的任何事情，但手术前的记忆却完好无损——证明海马体是记忆的'入口'而非'仓库'。",
  },
];

export default function BrainSystemMalfunction({
  onComplete,
}: BrainSystemMalfunctionProps) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentMalfunction, setCurrentMalfunction] =
    useState<MalfunctionInfo | null>(null);
  const [userGuess, setUserGuess] = useState<MalfunctionType | null>(null);
  const [score, setScore] = useState({ normal: 0, malfunction: 0 });
  const [showGlitch, setShowGlitch] = useState(false);

  const startGame = () => {
    const randomMalfunction =
      MALFUNCTIONS[Math.floor(Math.random() * MALFUNCTIONS.length)];
    setCurrentMalfunction(randomMalfunction);
    setScore({ normal: 0, malfunction: 0 });
    setUserGuess(null);
    setPhase("normal-intro");
  };

  const handleNormalComplete = (normalScore: number) => {
    setScore((p) => ({ ...p, normal: normalScore }));
    setPhase("glitch-transition");
    setTimeout(() => {
      setShowGlitch(true);
      setTimeout(() => {
        setShowGlitch(false);
        setPhase("malfunction-intro");
      }, 1500);
    }, 1000);
  };

  const handleMalfunctionComplete = (malfunctionScore: number) => {
    setScore((p) => ({ ...p, malfunction: malfunctionScore }));
    setPhase("guess");
  };

  const handleGuess = (guess: MalfunctionType) => {
    setUserGuess(guess);
    setPhase("reveal");
  };

  const getGuessCorrect = () => {
    return userGuess === currentMalfunction?.id;
  };

  const restart = () => {
    setPhase("intro");
    setCurrentMalfunction(null);
    setUserGuess(null);
    setScore({ normal: 0, malfunction: 0 });
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      {showGlitch && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center animate-glitch">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-shake">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2 glitch-text">
              系统异常
            </h2>
            <p className="text-museum-200/60 text-sm glitch-text-2">
              检测到大脑系统故障...
            </p>
          </div>
        </div>
      )}

      {phase === "intro" && (
        <div className="glass-card p-8 md:p-12 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            大脑系统故障
          </h2>
          <p className="text-museum-200/70 mb-6 leading-relaxed">
            如果你的大脑某个系统突然出了点小故障，会发生什么？
          </p>
          <p className="text-museum-200/60 mb-8 leading-relaxed text-sm">
            你将先在<strong className="text-white">正常模式</strong>
            下完成一个日常任务，建立基准线。
            <br />
            然后...系统会随机激活一个<strong className="text-red-400">
              大脑故障
            </strong>
            。
            <br />
            体验变化，最后猜猜到底是哪个系统出了问题。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {MALFUNCTIONS.map((m) => (
              <div
                key={m.id}
                className="glass-card p-3 text-center"
                style={{ border: `1px solid ${m.color}30` }}
              >
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-xs font-medium" style={{ color: m.color }}>
                  {m.name}
                </div>
              </div>
            ))}
          </div>
          <button onClick={startGame} className="btn-primary text-lg">
            开始体验 <Zap className="w-5 h-5" />
          </button>
        </div>
      )}

      {phase === "normal-intro" && (
        <div className="glass-card p-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              正常模式
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            第一阶段：正常状态
          </h3>
          <p className="text-museum-200/70 mb-6">
            先在正常状态下完成任务，建立你的基准成绩。
          </p>
          <p className="text-museum-300/60 text-sm mb-8">
            任务：在限定时间内点击正确的目标，获得尽可能多的分数
          </p>
          <button
            onClick={() => setPhase("normal-game")}
            className="btn-primary"
          >
            开始任务 <Target className="w-5 h-5" />
          </button>
        </div>
      )}

      {phase === "normal-game" && (
        <AttentionTaskGame
          isMalfunction={false}
          malfunctionType={null}
          onComplete={handleNormalComplete}
        />
      )}

      {phase === "glitch-transition" && (
        <div className="glass-card p-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Activity className="w-10 h-10 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">系统校准中...</h3>
          <p className="text-museum-200/60">
            正在切换大脑运行模式，请稍候...
          </p>
        </div>
      )}

      {phase === "malfunction-intro" && (
        <div className="glass-card p-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">
              故障模式
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            第二阶段：异常状态
          </h3>
          <p className="text-museum-200/70 mb-6">
            你大脑中的某个系统...出了点小问题。
            <br />
            感受一下有什么不同？
          </p>
          <p className="text-museum-300/60 text-sm mb-8">
            任务和之前一样：在限定时间内点击正确目标
          </p>
          <button
            onClick={() => setPhase("malfunction-game")}
            className="btn-primary"
            style={{
              background:
                "linear-gradient(135deg, #e63946, #ff6b6b)",
            }}
          >
            开始挑战 <Zap className="w-5 h-5" />
          </button>
        </div>
      )}

      {phase === "malfunction-game" && currentMalfunction && (
        <AttentionTaskGame
          isMalfunction={true}
          malfunctionType={currentMalfunction.id}
          onComplete={handleMalfunctionComplete}
        />
      )}

      {phase === "guess" && currentMalfunction && (
        <div className="animate-fade-in">
          <div className="glass-card p-8 text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">任务完成！</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              <div className="glass-card p-4">
                <p className="text-museum-300/60 text-sm mb-1">正常模式</p>
                <p className="text-2xl font-bold text-green-400">
                  {score.normal} 分
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-museum-300/60 text-sm mb-1">故障模式</p>
                <p className="text-2xl font-bold text-red-400">
                  {score.malfunction} 分
                </p>
              </div>
            </div>
            {score.normal > score.malfunction ? (
              <p className="text-museum-200/70 mb-2">
                你感受到变化了吗？成绩下降了{" "}
                <span className="text-red-400 font-bold">
                  {score.normal - score.malfunction}
                </span>{" "}
                分
              </p>
            ) : score.normal < score.malfunction ? (
              <p className="text-museum-200/70 mb-2">
                哇！你反而表现得更好！成绩上升了{" "}
                <span className="text-green-400 font-bold">
                  {score.malfunction - score.normal}
                </span>{" "}
                分
              </p>
            ) : (
              <p className="text-museum-200/70 mb-2">
                成绩几乎没变化！{" "}
                <span className="text-yellow-400 font-bold">两种模式下表现相同</span>
              </p>
            )}
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              🤔 你觉得是哪种故障？
            </h3>
            <p className="text-museum-200/60 text-sm text-center mb-6">
              根据你的体验，猜猜大脑哪个系统出了问题？
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MALFUNCTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleGuess(m.id)}
                  className="glass-card p-4 text-left transition-all hover:scale-105 text-left"
                  style={{ border: `1px solid ${m.color}30` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="font-bold text-white">{m.name}</span>
                  </div>
                  <p className="text-xs text-museum-200/50 leading-relaxed">
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === "reveal" && currentMalfunction && (
        <div className="animate-fade-in">
          <div
            className="glass-card p-8 mb-6"
            style={{
              background: `linear-gradient(135deg, ${currentMalfunction.color}15, rgba(0,0,0,0.3))`,
              border: `1px solid ${currentMalfunction.color}40`,
            }}
          >
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                  getGuessCorrect()
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-yellow-500/10 border border-yellow-500/30"
                }`}
              >
                {getGuessCorrect() ? (
                  <>
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-bold">猜对了！</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">
                      没完全猜中~
                    </span>
                  </>
                )}
              </div>
              <div className="text-5xl mb-4">{currentMalfunction.emoji}</div>
              <h3
                className="text-2xl font-display font-bold text-white mb-2"
                style={{ color: currentMalfunction.color }}
              >
                {currentMalfunction.name}
              </h3>
              <p className="text-museum-200/70 leading-relaxed max-w-xl mx-auto">
                {currentMalfunction.description}
              </p>
            </div>

            <div className="glass-card p-5 mb-6" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain
                  className="w-5 h-5"
                  style={{ color: currentMalfunction.color }}
                />
                <span className="font-bold text-white">涉及的脑区</span>
              </div>
              <div className="space-y-2">
                {currentMalfunction.brainRegions.map((region, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{
                      background: `${currentMalfunction.color}08`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentMalfunction.color }}
                    />
                    <span className="text-white text-sm font-medium">
                      {region.name}
                    </span>
                    <span className="text-museum-200/50 text-xs">
                      — {region.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="glass-card p-5"
              style={{
                background: `linear-gradient(135deg, ${currentMalfunction.color}10, rgba(157, 78, 221, 0.05))`,
                border: `1px solid ${currentMalfunction.color}20`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb
                  className="w-5 h-5"
                  style={{ color: currentMalfunction.color }}
                />
                <span className="font-bold text-white">神经原理</span>
              </div>
              <p className="text-sm text-museum-200/70 leading-relaxed">
                {currentMalfunction.neurosciencePrinciple}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={restart} className="btn-secondary gap-2">
              <RotateCcw className="w-4 h-4" />
              再试一次（随机故障）
            </button>
            <button onClick={onComplete} className="btn-primary gap-2">
              查看完整原理解释
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AttentionTaskGameProps {
  isMalfunction: boolean;
  malfunctionType: MalfunctionType | null;
  onComplete: (score: number) => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  isCorrect: boolean;
  type: "star" | "circle" | "square" | "diamond";
}

function AttentionTaskGame({
  isMalfunction,
  malfunctionType,
  onComplete,
}: AttentionTaskGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [displayTime, setDisplayTime] = useState(30);
  const [distractors, setDistractors] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);
  const [flashingTargets, setFlashingTargets] = useState<Set<number>>(new Set());

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const distractorRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnTarget = useCallback(() => {
    if (!gameAreaRef.current) return;
    const area = gameAreaRef.current.getBoundingClientRect();
    const padding = 40;
    const x = padding + Math.random() * (area.width - padding * 2);
    const y = padding + Math.random() * (area.height - padding * 2);

    const types: Target["type"][] = ["star", "circle", "square", "diamond"];
    const type = types[Math.floor(Math.random() * types.length)];
    const isCorrect = type === "star";

    const newTarget: Target = {
      id: nextIdRef.current++,
      x,
      y,
      isCorrect,
      type,
    };

    setTargets((prev) => [...prev, newTarget]);

    const lifetime = isMalfunction
      ? malfunctionType === "memory-encoding"
        ? 600
        : 1200
      : 2000;

    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
    }, lifetime);
  }, [isMalfunction, malfunctionType]);

  const spawnDistractor = useCallback(() => {
    if (!gameAreaRef.current) return;
    const area = gameAreaRef.current.getBoundingClientRect();
    const padding = 20;
    const x = padding + Math.random() * (area.width - padding * 2);
    const y = padding + Math.random() * (area.height - padding * 2);

    const emojis = ["⚡", "✨", "💫", "🌟", "💥", "🎉", "🎊", "💎"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newDistractor = {
      id: nextIdRef.current++,
      x,
      y,
      emoji,
    };

    setDistractors((prev) => [...prev, newDistractor]);

    setTimeout(() => {
      setDistractors((prev) => prev.filter((d) => d.id !== newDistractor.id));
    }, 800);
  }, []);

  const updateFlash = useCallback(() => {
    if (malfunctionType === "reward-hypersensitivity") {
      setTargets((currentTargets) => {
        const correctIds = currentTargets
          .filter((t) => t.isCorrect)
          .map((t) => t.id);
        if (correctIds.length > 0 && Math.random() > 0.3) {
          const randomId =
            correctIds[Math.floor(Math.random() * correctIds.length)];
          setFlashingTargets((prev) => new Set(prev).add(randomId));
          setTimeout(() => {
            setFlashingTargets((prev) => {
              const next = new Set(prev);
              next.delete(randomId);
              return next;
            });
          }, 200);
        }
        return currentTargets;
      });
    }
  }, [malfunctionType]);

  useEffect(() => {
    if (!gameStarted) return;

    spawnTarget();
    spawnRef.current = setInterval(
      spawnTarget,
      isMalfunction && malfunctionType === "memory-encoding" ? 400 : 700
    );

    if (isMalfunction && malfunctionType === "attention-filter") {
      distractorRef.current = setInterval(spawnDistractor, 200);
    }

    if (isMalfunction && malfunctionType === "reward-hypersensitivity") {
      flashRef.current = setInterval(updateFlash, 300);
    }

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (distractorRef.current) clearInterval(distractorRef.current);
      if (flashRef.current) clearInterval(flashRef.current);
    };
  }, [
    gameStarted,
    spawnTarget,
    spawnDistractor,
    updateFlash,
    isMalfunction,
    malfunctionType,
  ]);

  useEffect(() => {
    if (!gameStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 0.1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => onComplete(score), 500);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, onComplete, score]);

  useEffect(() => {
    if (!gameStarted || !isMalfunction || malfunctionType !== "time-distortion")
      return;

    const distortInterval = setInterval(() => {
      setDisplayTime((prev) => {
        const offset = (Math.random() - 0.5) * 2;
        return Math.max(0, Math.min(30, prev + offset));
      });
    }, 200);

    return () => clearInterval(distortInterval);
  }, [gameStarted, isMalfunction, malfunctionType]);

  useEffect(() => {
    if (!isMalfunction || malfunctionType !== "time-distortion") {
      setDisplayTime(timeLeft);
    }
  }, [timeLeft, isMalfunction, malfunctionType]);

  const handleTargetClick = (target: Target) => {
    if (target.isCorrect) {
      const points = 10 + combo * 2;
      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      setCombo(0);
    }
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const getTargetEmoji = (type: Target["type"]) => {
    switch (type) {
      case "star":
        return "⭐";
      case "circle":
        return "🔵";
      case "square":
        return "🟦";
      case "diamond":
        return "💠";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2">
            <span className="text-museum-300/60 text-sm">得分</span>
            <span className="text-xl font-bold text-white ml-2">{score}</span>
          </div>
          {combo > 1 && (
            <div
              className="glass-card px-3 py-2 animate-pulse"
              style={{ borderColor: "#ffbe0b50" }}
            >
              <span className="text-sm text-yellow-400 font-bold">
                🔥 连击 x{combo}
              </span>
            </div>
          )}
        </div>
        <div className="glass-card px-4 py-2">
          <Clock className="w-4 h-4 text-museum-300/60 inline mr-2" />
          <span
            className={`text-xl font-bold ${
              displayTime < 10 ? "text-red-400" : "text-white"
            }`}
          >
            {displayTime.toFixed(1)}s
          </span>
        </div>
      </div>

      <div
        ref={gameAreaRef}
        className="relative w-full h-96 rounded-2xl overflow-hidden glass-card"
        style={{
          background: isMalfunction
            ? malfunctionType === "attention-filter"
              ? "linear-gradient(180deg, rgba(255,190,11,0.1), rgba(0,0,0,0.3))"
              : malfunctionType === "time-distortion"
              ? "linear-gradient(180deg, rgba(6,255,165,0.1), rgba(0,0,0,0.3))"
              : malfunctionType === "reward-hypersensitivity"
              ? "linear-gradient(180deg, rgba(251,86,7,0.1), rgba(0,0,0,0.3))"
              : "linear-gradient(180deg, rgba(255,0,110,0.1), rgba(0,0,0,0.3))"
            : "linear-gradient(180deg, rgba(100,100,100,0.1), rgba(0,0,0,0.3))",
          border: isMalfunction ? "1px solid rgba(255,100,100,0.3)" : undefined,
        }}
      >
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="text-center">
              <p className="text-museum-200/70 mb-4">
                点击 <span className="text-yellow-400 font-bold">⭐ 星星</span>{" "}
                得分
              </p>
              <p className="text-museum-200/50 text-sm mb-6">
                点错其他形状会扣分
              </p>
              <button onClick={startGame} className="btn-primary">
                准备！开始 <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {isMalfunction && malfunctionType === "attention-filter" &&
          distractors.map((d) => (
            <div
              key={d.id}
              className="absolute text-2xl animate-ping pointer-events-none"
              style={{
                left: d.x,
                top: d.y,
                transform: "translate(-50%, -50%)",
                opacity: 0.7,
              }}
            >
              {d.emoji}
            </div>
          ))}

        {targets.map((target) => {
          const isFlashing = flashingTargets.has(target.id);
          return (
            <button
              key={target.id}
              onClick={() => handleTargetClick(target)}
              className="absolute text-3xl transition-all hover:scale-125 cursor-pointer animate-fade-in"
              style={{
                left: target.x,
                top: target.y,
                transform: "translate(-50%, -50%)",
                filter:
                  isFlashing && target.isCorrect
                    ? "drop-shadow(0 0 10px #fb5607) drop-shadow(0 0 20px #fb5607)"
                    : undefined,
                scale:
                  isFlashing && target.isCorrect ? "1.3" : "1",
                transition: "all 0.15s ease",
              }}
            >
              {getTargetEmoji(target.type)}
            </button>
          );
        })}

        {gameStarted && (
          <div className="absolute top-3 left-3 text-xs text-museum-200/50">
            找到 ⭐ 星星点击！
          </div>
        )}

        {isMalfunction && malfunctionType === "time-distortion" && (
          <div className="absolute top-3 right-3 text-xs text-green-400/60 animate-pulse">
            ⚡ 时间校准中...
          </div>
        )}

        {isMalfunction && malfunctionType === "reward-hypersensitivity" && (
          <div className="absolute top-3 right-3 text-xs text-orange-400/60 animate-pulse">
            💰 奖励检测...
          </div>
        )}

        {isMalfunction && malfunctionType === "memory-encoding" && (
          <div className="absolute top-3 right-3 text-xs text-pink-400/60 animate-pulse">
            🧠 记忆缓存...
          </div>
        )}

        {isMalfunction && malfunctionType === "attention-filter" && (
          <div className="absolute top-3 right-3 text-xs text-yellow-400/60 animate-pulse">
            🎯 过滤失效...
          </div>
        )}
      </div>

      <p className="text-center text-museum-300/50 text-sm mt-4">
        {isMalfunction
          ? "感觉到和刚才有什么不同了吗？"
          : "集中注意力，尽可能多地点击星星！"}
      </p>
    </div>
  );
}
