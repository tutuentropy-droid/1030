import { useState, useCallback } from "react";
import {
  Gift,
  Brain,
  Zap,
  Check,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Video,
  Cookie,
  Gamepad2,
  Heart,
  BookOpen,
  Dumbbell,
  Briefcase,
  Salad,
} from "lucide-react";
import type { SubExperiment } from "@/data/experiments";

interface RewardCircuitProps {
  onComplete: () => void;
  subExperiments?: SubExperiment[];
}

type Phase = "intro" | "playing" | "result";
type TemptationType = "short-video" | "sugar-craving" | "game-addiction" | "social-likes";

interface ChoiceOption {
  id: "instant" | "delayed";
  label: string;
  description: string;
  icon: React.ReactNode;
  dopamineEffect: number;
  selfControlCost: number;
  sensitivityChange: number;
}

interface Temptation {
  type: TemptationType;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  glowColor: string;
  instantOption: ChoiceOption;
  delayedOption: ChoiceOption;
}

interface GameState {
  round: number;
  totalRounds: number;
  dopamineLevel: number;
  baselineDopamine: number;
  rewardSensitivity: number;
  selfControl: number;
  maxSelfControl: number;
  choices: ("instant" | "delayed")[];
  currentTemptation: Temptation | null;
  showFeedback: boolean;
  lastChoice: "instant" | "delayed" | null;
  completedSubs: string[];
  currentSubIndex: number;
  roundsInCurrentSub: number;
  subRoundTarget: number;
}

const TEMPTATIONS: Temptation[] = [
  {
    type: "short-video",
    title: "短视频诱惑",
    subtitle: "学习还是刷视频？",
    emoji: "📱",
    color: "#ff006e",
    glowColor: "rgba(255, 0, 110, 0.4)",
    instantOption: {
      id: "instant",
      label: "刷15分钟短视频",
      description: "立即获得愉悦感",
      icon: <Video className="w-5 h-5" />,
      dopamineEffect: 25,
      selfControlCost: 12,
      sensitivityChange: -3,
    },
    delayedOption: {
      id: "delayed",
      label: "专注学习1小时",
      description: "长期提升能力",
      icon: <BookOpen className="w-5 h-5" />,
      dopamineEffect: -5,
      selfControlCost: 8,
      sensitivityChange: 2,
    },
  },
  {
    type: "sugar-craving",
    title: "糖分诱惑",
    subtitle: "健康餐还是甜点？",
    emoji: "🍰",
    color: "#ff9e00",
    glowColor: "rgba(255, 158, 0, 0.4)",
    instantOption: {
      id: "instant",
      label: "吃一块巧克力蛋糕",
      description: "甜蜜的满足感",
      icon: <Cookie className="w-5 h-5" />,
      dopamineEffect: 30,
      selfControlCost: 15,
      sensitivityChange: -4,
    },
    delayedOption: {
      id: "delayed",
      label: "吃健康沙拉",
      description: "保持身体健康",
      icon: <Salad className="w-5 h-5" />,
      dopamineEffect: -8,
      selfControlCost: 10,
      sensitivityChange: 2,
    },
  },
  {
    type: "game-addiction",
    title: "游戏诱惑",
    subtitle: "工作还是打游戏？",
    emoji: "🎮",
    color: "#9d4edd",
    glowColor: "rgba(157, 78, 221, 0.4)",
    instantOption: {
      id: "instant",
      label: "打一局游戏",
      description: "升级的快感",
      icon: <Gamepad2 className="w-5 h-5" />,
      dopamineEffect: 28,
      selfControlCost: 14,
      sensitivityChange: -3,
    },
    delayedOption: {
      id: "delayed",
      label: "完成工作任务",
      description: "职业发展积累",
      icon: <Briefcase className="w-5 h-5" />,
      dopamineEffect: -6,
      selfControlCost: 9,
      sensitivityChange: 2,
    },
  },
  {
    type: "social-likes",
    title: "社交点赞诱惑",
    subtitle: "专注还是刷朋友圈？",
    emoji: "❤️",
    color: "#fb5607",
    glowColor: "rgba(251, 86, 7, 0.4)",
    instantOption: {
      id: "instant",
      label: "刷朋友圈看看点赞",
      description: "社交反馈的愉悦",
      icon: <Heart className="w-5 h-5" />,
      dopamineEffect: 22,
      selfControlCost: 11,
      sensitivityChange: -2,
    },
    delayedOption: {
      id: "delayed",
      label: "去健身房锻炼",
      description: "提升身体素质",
      icon: <Dumbbell className="w-5 h-5" />,
      dopamineEffect: -7,
      selfControlCost: 10,
      sensitivityChange: 2,
    },
  },
];

const SUB_ROUND_TARGET = 5;

export default function RewardCircuit({
  onComplete,
  subExperiments,
}: RewardCircuitProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [gameState, setGameState] = useState<GameState>({
    round: 0,
    totalRounds: TEMPTATIONS.length * SUB_ROUND_TARGET,
    dopamineLevel: 50,
    baselineDopamine: 50,
    rewardSensitivity: 100,
    selfControl: 100,
    maxSelfControl: 100,
    choices: [],
    currentTemptation: null,
    showFeedback: false,
    lastChoice: null,
    completedSubs: [],
    currentSubIndex: 0,
    roundsInCurrentSub: 0,
    subRoundTarget: SUB_ROUND_TARGET,
  });

  const subList = subExperiments ?? [];

  const startGame = () => {
    const firstTemptation = TEMPTATIONS[0];
    setGameState((prev) => ({
      ...prev,
      round: 1,
      currentTemptation: firstTemptation,
    }));
    setPhase("playing");
  };

  const makeChoice = (choice: "instant" | "delayed") => {
    const temptation = gameState.currentTemptation;
    if (!temptation) return;

    const option = choice === "instant" ? temptation.instantOption : temptation.delayedOption;

    setGameState((prev) => {
      const newDopamine = Math.max(
        0,
        Math.min(
          100,
          prev.dopamineLevel + option.dopamineEffect * (prev.rewardSensitivity / 100)
        )
      );

      const newSensitivity = Math.max(
        30,
        Math.min(150, prev.rewardSensitivity + option.sensitivityChange)
      );

      const newSelfControl = Math.max(
        0,
        Math.min(prev.maxSelfControl, prev.selfControl - option.selfControlCost)
      );

      let newMaxSelfControl = prev.maxSelfControl;
      if (choice === "delayed") {
        newMaxSelfControl = Math.min(120, prev.maxSelfControl + 0.5);
      }

      return {
        ...prev,
        dopamineLevel: newDopamine,
        rewardSensitivity: newSensitivity,
        selfControl: newSelfControl,
        maxSelfControl: newMaxSelfControl,
        choices: [...prev.choices, choice],
        showFeedback: true,
        lastChoice: choice,
      };
    });
  };

  const nextRound = () => {
    setGameState((prev) => {
      const newRound = prev.round + 1;
      const newRoundsInSub = prev.roundsInCurrentSub + 1;
      let newSubIndex = prev.currentSubIndex;
      let newCompletedSubs = [...prev.completedSubs];
      let newRoundsInCurrentSub = newRoundsInSub;

      if (newRoundsInSub >= prev.subRoundTarget) {
        const currentSub = subList[prev.currentSubIndex];
        if (currentSub && !newCompletedSubs.includes(currentSub.id)) {
          newCompletedSubs.push(currentSub.id);
        }
        newSubIndex = prev.currentSubIndex + 1;
        newRoundsInCurrentSub = 0;
      }

      if (newRound > prev.totalRounds) {
        setTimeout(() => {
          setPhase("result");
          setTimeout(() => {
            onComplete();
          }, 2500);
        }, 500);
        return prev;
      }

      let dopamineRecovery = prev.dopamineLevel + 3;
      if (dopamineRecovery > prev.baselineDopamine) {
        dopamineRecovery = prev.baselineDopamine + (dopamineRecovery - prev.baselineDopamine) * 0.3;
      }

      const selfControlRecovery = Math.min(
        prev.maxSelfControl,
        prev.selfControl + 3
      );

      const newTemptation = TEMPTATIONS[newSubIndex % TEMPTATIONS.length];

      return {
        ...prev,
        round: newRound,
        currentTemptation: newTemptation,
        roundsInCurrentSub: newRoundsInCurrentSub,
        currentSubIndex: newSubIndex,
        completedSubs: newCompletedSubs,
        showFeedback: false,
        lastChoice: null,
        dopamineLevel: dopamineRecovery,
        selfControl: selfControlRecovery,
      };
    });
  };

  const getSelfControlStatus = (level: number) => {
    if (level >= 70) return { label: "充足", color: "#06ffa5" };
    if (level >= 40) return { label: "中等", color: "#ffbe0b" };
    if (level >= 20) return { label: "告急", color: "#fb5607" };
    return { label: "耗尽", color: "#ff006e" };
  };

  const getSensitivityStatus = (level: number) => {
    if (level >= 120) return { label: "过度敏感", color: "#ff006e" };
    if (level >= 90) return { label: "正常", color: "#06ffa5" };
    if (level >= 60) return { label: "迟钝", color: "#ffbe0b" };
    return { label: "严重迟钝", color: "#fb5607" };
  };

  const instantChoiceCount = gameState.choices.filter((c) => c === "instant").length;
  const delayedChoiceCount = gameState.choices.filter((c) => c === "delayed").length;

  const getResultAnalysis = () => {
    const instantRatio = instantChoiceCount / Math.max(1, gameState.choices.length);
    if (instantRatio >= 0.7) {
      return {
        title: "奖励系统主导",
        description:
          "你的大部分选择都偏向了即时奖励。这非常正常——大脑的奖励系统经过数百万年进化，天生偏爱即时、确定的收益。但如你所见，持续选择即时奖励会导致多巴胺受体脱敏，需要越来越强的刺激才能获得同样的愉悦感，同时自控力会持续下降。这就是为什么'刷手机停不下来'、'减肥总是失败'的神经学本质。",
        emoji: "⚡",
      };
    }
    if (instantRatio >= 0.4) {
      return {
        title: "拉锯战",
        description:
          "你在即时奖励和延迟奖励之间摇摆不定。这是大多数人的真实状态——前额叶和奖励系统在不断拉锯。你可能发现：一开始还能坚持'正确选择'，但随着自控力消耗，后面越来越容易屈服。这就是'自我损耗'效应——自控力是有限资源，用完就没了。",
        emoji: "⚖️",
      };
    }
    return {
      title: "前额叶主导",
      description:
        "你成功抵制了大部分诱惑，让前额叶掌握了控制权！这非常不容易。但请观察数据：即使你选择了延迟奖励，自控力仍然在消耗。如果实验继续进行下去，你可能也会开始屈服。这告诉我们：意志力不是品格问题，而是神经资源问题。与其靠意志力硬扛，不如从环境入手——减少诱惑的出现。",
      emoji: "🧠",
    };
  };

  const currentSub = subList[gameState.currentSubIndex];
  const progress = Math.min(
    Math.floor((gameState.round / gameState.totalRounds) * 100),
    100
  );

  return (
    <div className="max-w-4xl mx-auto">
      {phase !== "result" && subList.length > 0 && (
        <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
          {subList.map((sub, idx) => {
            const done = gameState.completedSubs.includes(sub.id);
            const active = idx === gameState.currentSubIndex;
            return (
              <div key={sub.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done
                      ? "bg-neon-green/20 text-neon-green border border-neon-green/40"
                      : active
                      ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40 animate-pulse"
                      : "bg-museum-800 text-museum-300/50 border border-white/10"
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                {idx < subList.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 transition-all ${
                      done || (active && idx === 0) ? "bg-neon-green/40" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="glass-card p-6 md:p-8">
        {phase === "intro" && (
          <div className="text-center animate-fade-in">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center mx-auto mb-6"
              style={{ boxShadow: "0 0 30px rgba(251, 86, 7, 0.3)" }}
            >
              <Gift className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              奖励回路实验
            </h3>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              你将经历 <span className="text-orange-400 font-bold">20轮</span> 选择，
              体验 <span className="text-pink-400">短视频</span>、
              <span className="text-yellow-400">糖分</span>、
              <span className="text-purple-400">游戏</span>、
              <span className="text-red-400">社交点赞</span>
              如何影响你的大脑。
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
              {TEMPTATIONS.map((t, i) => (
                <div
                  key={t.type}
                  className="p-4 rounded-xl text-left"
                  style={{
                    background: `${t.color}10`,
                    border: `1px solid ${t.color}30`,
                  }}
                >
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <p className="text-sm font-medium text-white">{t.title}</p>
                  <p className="text-xs text-museum-300/60 mt-1">
                    {t.subtitle}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-xl mb-8 max-w-lg mx-auto"
              style={{
                background: "rgba(157, 78, 221, 0.1)",
                border: "1px solid rgba(157, 78, 221, 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-neon-purple" />
                <span className="text-sm font-medium text-white">
                  你的大脑状态将被实时追踪
                </span>
              </div>
              <div className="space-y-3 text-sm text-museum-200/70">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>
                    <span className="text-yellow-400">多巴胺水平</span>：选择即时奖励会让多巴胺飙升，但随后会回落更低
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>
                    <span className="text-purple-400">奖励敏感度</span>：频繁刺激会导致多巴胺受体脱敏，越来越难满足
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>
                    <span className="text-green-400">自控能力</span>：每次抵制诱惑都会消耗，用完就会"失控"
                  </span>
                </div>
              </div>
            </div>

            <button onClick={startGame} className="btn-primary">
              开始体验
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {phase === "playing" && gameState.currentTemptation && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl">
                  {gameState.currentTemptation.emoji}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {gameState.currentTemptation.title}
              </h3>
              <p className="text-sm text-museum-300/60">
                第 {gameState.round} / {gameState.totalRounds} 轮 ·
                子实验 {gameState.currentSubIndex + 1} 第 {gameState.roundsInCurrentSub + 1} /{" "}
                {gameState.subRoundTarget} 轮
              </p>
              <div className="w-full max-w-md mx-auto mt-4 h-1.5 bg-museum-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255, 190, 11, 0.08)",
                  border: "1px solid rgba(255, 190, 11, 0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">多巴胺</span>
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255, 190, 11, 0.2)",
                      color: "#ffbe0b",
                    }}
                  >
                    {gameState.dopamineLevel.toFixed(0)}
                  </span>
                </div>
                <div className="h-2 bg-museum-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 transition-all duration-700"
                    style={{ width: `${gameState.dopamineLevel}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-museum-300/50 mt-1">
                  <span>低落</span>
                  <span>正常</span>
                  <span>高涨</span>
                </div>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(157, 78, 221, 0.08)",
                  border: "1px solid rgba(157, 78, 221, 0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">敏感度</span>
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${getSensitivityStatus(gameState.rewardSensitivity).color}20`,
                      color: getSensitivityStatus(gameState.rewardSensitivity).color,
                    }}
                  >
                    {getSensitivityStatus(gameState.rewardSensitivity).label}
                  </span>
                </div>
                <div className="h-2 bg-museum-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, gameState.rewardSensitivity)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-museum-300/50 mt-1">
                  <span>迟钝</span>
                  <span>正常</span>
                  <span>过度</span>
                </div>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(6, 255, 165, 0.08)",
                  border: "1px solid rgba(6, 255, 165, 0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">自控力</span>
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${getSelfControlStatus(gameState.selfControl).color}20`,
                      color: getSelfControlStatus(gameState.selfControl).color,
                    }}
                  >
                    {getSelfControlStatus(gameState.selfControl).label}
                  </span>
                </div>
                <div className="h-2 bg-museum-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-700"
                    style={{
                      width: `${(gameState.selfControl / gameState.maxSelfControl) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-museum-300/50 mt-1">
                  <span>耗尽</span>
                  <span>中等</span>
                  <span>充足</span>
                </div>
              </div>
            </div>

            {gameState.selfControl < 30 && (
              <div
                className="p-3 rounded-xl mb-6 text-center animate-pulse"
                style={{
                  background: "rgba(255, 0, 110, 0.1)",
                  border: "1px solid rgba(255, 0, 110, 0.3)",
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-pink-500" />
                  <span className="text-sm text-pink-400">
                    ⚠️ 自控力严重不足！你会发现选择变得越来越难...
                  </span>
                </div>
              </div>
            )}

            {!gameState.showFeedback ? (
              <div>
                <p className="text-center text-white font-medium mb-6">
                  {gameState.currentTemptation.subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => makeChoice("instant")}
                    className="p-6 rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      background: `${gameState.currentTemptation.color}15`,
                      border: `1px solid ${gameState.currentTemptation.color}40`,
                      boxShadow: gameState.selfControl < 30
                        ? `0 0 30px ${gameState.currentTemptation.glowColor}`
                        : "none",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `${gameState.currentTemptation.color}30`,
                          color: gameState.currentTemptation.color,
                        }}
                      >
                        {gameState.currentTemptation.instantOption.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {gameState.currentTemptation.instantOption.label}
                        </p>
                        <p className="text-xs text-museum-300/60">
                          {gameState.currentTemptation.instantOption.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <TrendingUp className="w-3 h-3" />
                        多巴胺 +{Math.round(gameState.currentTemptation.instantOption.dopamineEffect * (gameState.rewardSensitivity / 100))}
                      </span>
                      <span className="text-museum-300/40">·</span>
                      <span className="flex items-center gap-1 text-red-400">
                        <TrendingDown className="w-3 h-3" />
                        自控 -{gameState.currentTemptation.instantOption.selfControlCost}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => makeChoice("delayed")}
                    className="p-6 rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      background: "rgba(6, 255, 165, 0.08)",
                      border: "1px solid rgba(6, 255, 165, 0.3)",
                      opacity: gameState.selfControl < 20 ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-neon-green/20 text-neon-green"
                      >
                        {gameState.currentTemptation.delayedOption.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {gameState.currentTemptation.delayedOption.label}
                        </p>
                        <p className="text-xs text-museum-300/60">
                          {gameState.currentTemptation.delayedOption.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-yellow-400/60">
                        <TrendingDown className="w-3 h-3" />
                        多巴胺 {Math.round(gameState.currentTemptation.delayedOption.dopamineEffect * (gameState.rewardSensitivity / 100))}
                      </span>
                      <span className="text-museum-300/40">·</span>
                      <span className="flex items-center gap-1 text-orange-400">
                        <TrendingDown className="w-3 h-3" />
                        自控 -{gameState.currentTemptation.delayedOption.selfControlCost}
                      </span>
                      <span className="text-museum-300/40">·</span>
                      <span className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        长期 +
                      </span>
                    </div>
                  </button>
                </div>

                {gameState.selfControl < 20 && (
                  <p className="text-center text-xs text-red-400/70 mt-4">
                    自控力太低，"正确选择"的按钮似乎变难按下了...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center animate-fade-in">
                {gameState.lastChoice === "instant" ? (
                  <div>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: `${gameState.currentTemptation.color}20`,
                        boxShadow: `0 0 30px ${gameState.currentTemptation.glowColor}`,
                      }}
                    >
                      <Zap
                        className="w-8 h-8 animate-pulse"
                        style={{ color: gameState.currentTemptation.color }}
                      />
                    </div>
                    <p className="text-xl font-bold text-white mb-2">
                      多巴胺飙升！
                    </p>
                    <p className="text-museum-200/80 mb-4">
                      你选择了即时奖励，伏隔核被多巴胺淹没，产生了强烈的愉悦感。
                      <br />
                      <span className="text-sm text-museum-300/60">
                        但请注意：多巴胺受体开始脱敏，下次需要更多刺激才能获得同样的感觉。
                      </span>
                    </p>
                    <div className="flex justify-center gap-4 text-sm mb-6">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <TrendingUp className="w-4 h-4" />
                        多巴胺 +
                        {Math.round(
                          gameState.currentTemptation.instantOption.dopamineEffect *
                            (gameState.rewardSensitivity / 100)
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-red-400">
                        <TrendingDown className="w-4 h-4" />
                        自控 -{gameState.currentTemptation.instantOption.selfControlCost}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-neon-green/20"
                      style={{ boxShadow: "0 0 30px rgba(6, 255, 165, 0.3)" }}
                    >
                      <Brain className="w-8 h-8 text-neon-green" />
                    </div>
                    <p className="text-xl font-bold text-white mb-2">
                      前额叶胜利！
                    </p>
                    <p className="text-museum-200/80 mb-4">
                      你的前额叶成功抑制了奖励系统的冲动，做出了有利于长期目标的选择。
                      <br />
                      <span className="text-sm text-museum-300/60">
                        但这消耗了自控力资源——如果诱惑持续出现，你还能坚持多久？
                      </span>
                    </p>
                    <div className="flex justify-center gap-4 text-sm mb-6">
                      <div className="flex items-center gap-1 text-yellow-400/60">
                        <TrendingDown className="w-4 h-4" />
                        多巴胺{" "}
                        {Math.round(
                          gameState.currentTemptation.delayedOption.dopamineEffect *
                            (gameState.rewardSensitivity / 100)
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-orange-400">
                        <TrendingDown className="w-4 h-4" />
                        自控 -{gameState.currentTemptation.delayedOption.selfControlCost}
                      </div>
                      <div className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        敏感度 +{Math.abs(gameState.currentTemptation.delayedOption.sensitivityChange)}
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={nextRound} className="btn-primary gap-2">
                  {gameState.round < gameState.totalRounds ? "下一轮" : "查看结果"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "result" && (
          <div className="text-center animate-fade-in">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
              style={{ boxShadow: "0 0 40px rgba(251, 86, 7, 0.3)" }}
            >
              <Sparkles className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              实验完成！
            </h3>
            <p className="text-museum-200/80 mb-8">
              让我们看看你的大脑奖励系统发生了什么变化
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-neon-green mb-1">
                  {delayedChoiceCount}
                </div>
                <p className="text-xs text-museum-300/60">延迟奖励选择</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-pink-500 mb-1">
                  {instantChoiceCount}
                </div>
                <p className="text-xs text-museum-300/60">即时奖励选择</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    color: getSensitivityStatus(gameState.rewardSensitivity).color,
                  }}
                >
                  {gameState.rewardSensitivity.toFixed(0)}%
                </div>
                <p className="text-xs text-museum-300/60">最终奖励敏感度</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    color: getSelfControlStatus(gameState.selfControl).color,
                  }}
                >
                  {gameState.selfControl.toFixed(0)}%
                </div>
                <p className="text-xs text-museum-300/60">最终自控能力</p>
              </div>
            </div>

            <div className="flex justify-center gap-1 mb-8 max-w-md mx-auto">
              {gameState.choices.map((choice, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    choice === "instant" ? "bg-pink-500" : "bg-neon-green"
                  }`}
                  title={`第 ${idx + 1} 轮：${choice === "instant" ? "即时奖励" : "延迟奖励"}`}
                />
              ))}
            </div>
            <div className="flex justify-center gap-6 text-xs text-museum-300/60 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neon-green" />
                <span>延迟奖励</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span>即时奖励</span>
              </div>
            </div>

            {(() => {
              const analysis = getResultAnalysis();
              return (
                <div
                  className="p-6 rounded-2xl max-w-xl mx-auto mb-8"
                  style={{
                    background: "rgba(157, 78, 221, 0.1)",
                    border: "1px solid rgba(157, 78, 221, 0.3)",
                  }}
                >
                  <div className="text-4xl mb-3">{analysis.emoji}</div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    {analysis.title}
                  </h4>
                  <p className="text-museum-200/80 text-sm leading-relaxed">
                    {analysis.description}
                  </p>
                </div>
              );
            })()}

            <div className="text-museum-300/60 text-sm">
              即将生成脑区参与链路图...
            </div>
          </div>
        )}
      </div>

      {currentSub && phase === "playing" && (
        <div className="mt-4 text-center text-museum-300/50 text-xs">
          当前子实验 {gameState.currentSubIndex + 1}/4 · {currentSub.title}
        </div>
      )}
    </div>
  );
}
