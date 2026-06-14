import { useState, useEffect, useRef, useCallback } from "react";
import {
  Moon,
  Brain,
  Zap,
  ChevronRight,
  Eye,
  AlertTriangle,
  MapPin,
  GraduationCap,
  RotateCcw,
  Waves,
  Activity,
  Play,
  Pause,
  Check,
  X,
  Search,
} from "lucide-react";
import type { SubExperiment } from "@/data/experiments";

interface DreamNeuroscienceProps {
  onComplete: () => void;
  subExperiments?: SubExperiment[];
}

type Phase = "intro" | "keyword" | "rem-simulator" | "result";

interface DreamTheme {
  id: string;
  keyword: string;
  emoji: string;
  color: string;
  prevalence: string;
  emotionTag: string;
  neuroscienceExplanation: string;
  involvedRegions: { name: string; role: string; color: string }[];
  sleepStage: string;
}

interface SleepStage {
  id: string;
  name: string;
  chineseName: string;
  duration: number;
  brainWave: string;
  waveFrequency: string;
  description: string;
  color: string;
  brainActivity: number;
  muscleTone: number;
  dreaming: string;
}

const DREAM_THEMES: DreamTheme[] = [
  {
    id: "chasing",
    keyword: "被追逐",
    emoji: "🏃",
    color: "#ff006e",
    prevalence: "约 70% 的人做过",
    emotionTag: "恐惧 / 焦虑",
    neuroscienceExplanation:
      "被追逐是最普遍的梦境主题之一。杏仁核在REM睡眠中高度活跃，它在处理你近期的焦虑和压力事件。海马体同时回放在白天经历的压力场景或未解决的冲突。由于前额叶在REM中被抑制，大脑无法进行理性分析，只能以最原始的战斗-逃跑反应来呈现这些情绪。梦中追逐者的'身份模糊'是因为默认模式网络在随机激活记忆碎片，前额叶无法将它们整合成一个连贯的形象。",
    involvedRegions: [
      { name: "杏仁核", role: "触发恐惧和逃跑反应", color: "#ff5c8a" },
      { name: "海马体", role: "回放近期压力记忆", color: "#ff006e" },
      { name: "前额叶", role: "被抑制，无法理性分析", color: "#9d4edd" },
      { name: "默认模式网络", role: "随机组合记忆碎片", color: "#f72585" },
    ],
    sleepStage: "主要发生在REM睡眠后期",
  },
  {
    id: "falling",
    keyword: "坠落",
    emoji: "🌠",
    color: "#4361ee",
    prevalence: "约 60% 的人做过",
    emotionTag: "失控感 / 不确定感",
    neuroscienceExplanation:
      "坠落梦与大脑在睡眠阶段过渡时的神经活动密切相关。当你从NREM睡眠向REM睡眠过渡时，肌肉张力突然下降（脑桥启动了肌肉麻痹机制），有时前庭系统会误将这种肌肉放松信号解释为'正在坠落'。同时，杏仁核在处理你生活中的失控感——对工作、关系或未来的不确定。在NREM睡眠中，海马体在整理这些焦虑记忆，坠落的'身体感觉'是前庭系统和躯体感觉皮层在没有真实重力输入的情况下，整合内部信号时产生的错觉。",
    involvedRegions: [
      { name: "脑桥", role: "肌肉张力突然下降，触发坠落错觉", color: "#560bad" },
      { name: "杏仁核", role: "处理失控感和焦虑情绪", color: "#ff5c8a" },
      { name: "前庭系统/顶叶", role: "误读肌肉放松为坠落感", color: "#7209b7" },
      { name: "躯体感觉皮层", role: "构建坠落的身体感觉", color: "#38b000" },
    ],
    sleepStage: "NREM-REM过渡期和REM早期",
  },
  {
    id: "exam",
    keyword: "考试失败",
    emoji: "📝",
    color: "#ff9e00",
    prevalence: "约 40% 的人做过（学生和毕业生尤多）",
    emotionTag: "评价焦虑 / 自我怀疑",
    neuroscienceExplanation:
      "考试梦的核心是杏仁核对'被评价'和'可能失败'的深层焦虑。海马体在回放你过去真实的考试经历、工作评审、面试等场景。在梦中你发现题目都不会、笔写不出来、找不到考场——这些是杏仁核将'准备不足'的焦虑放大的结果。即使已经毕业多年，考试仍然是大脑中'能力被评估'的最强记忆模板。前额叶的抑制让你无法意识到'我早就毕业了'，默认模式网络则将不同时期的记忆碎片混合成新的场景。",
    involvedRegions: [
      { name: "杏仁核", role: "触发评价焦虑和恐惧", color: "#ff5c8a" },
      { name: "海马体", role: "提取考试、评审等评价场景的记忆", color: "#ff006e" },
      { name: "前额叶", role: "被抑制，无法判断场景的合理性", color: "#9d4edd" },
      { name: "默认模式网络", role: "混合不同时期的记忆碎片", color: "#f72585" },
    ],
    sleepStage: "REM中晚期",
  },
  {
    id: "lost",
    keyword: "迷路",
    emoji: "🗺️",
    color: "#06ffa5",
    prevalence: "约 35% 的人做过",
    emotionTag: "迷茫 / 方向感丧失",
    neuroscienceExplanation:
      "迷路梦反映了海马体中的空间导航系统和前额叶的目标规划系统之间的脱节。海马体中的位置细胞（Place Cells）和内嗅皮层的网格细胞（Grid Cells）在睡眠中被激活，它们在回放和巩固你白天的空间记忆。但REM睡眠中前额叶被抑制，无法设定清晰的目标或规划路线。结果就是：你在梦里能清楚地感知环境（海马体在工作），但不知道要去哪里、怎么去（前额叶不工作）。这往往对应清醒时你对人生方向、职业选择或重要决定感到迷茫。",
    involvedRegions: [
      { name: "海马体", role: "位置细胞激活，构建梦境空间", color: "#ff006e" },
      { name: "内嗅皮层", role: "网格细胞提供空间坐标", color: "#4361ee" },
      { name: "前额叶", role: "被抑制，无法设定目标和规划路线", color: "#9d4edd" },
      { name: "顶叶", role: "整合空间信息，但缺少目标导向", color: "#7209b7" },
    ],
    sleepStage: "REM和NREM均可出现",
  },
  {
    id: "teeth",
    keyword: "牙齿脱落",
    emoji: "🦷",
    color: "#f72585",
    prevalence: "约 30% 的人做过",
    emotionTag: "自尊焦虑 / 自我形象",
    neuroscienceExplanation:
      "牙齿脱落梦常被误解为玄学预兆，但神经科学解释是：1）躯体感觉皮层在睡眠中处理面部和口腔的感觉信号，包括夜间磨牙（bruxism）导致的牙齿压力感；2）杏仁核在处理与自我形象和社交评价相关的焦虑——牙齿在进化上是展示健康和吸引力的重要信号；3）海马体可能在回放童年换牙期的记忆，与当前的自我怀疑情绪结合。前额叶被抑制，无法分辨这是'换牙记忆的回放'还是'真实事件'，于是默认模式网络将这些信号整合成牙齿脱落的荒诞场景。",
    involvedRegions: [
      { name: "躯体感觉皮层", role: "处理口腔和面部感觉（可能来自磨牙）", color: "#38b000" },
      { name: "杏仁核", role: "处理自我形象和社交评价焦虑", color: "#ff5c8a" },
      { name: "海马体", role: "提取童年换牙期的记忆", color: "#ff006e" },
      { name: "默认模式网络", role: "混合记忆和感觉信号", color: "#f72585" },
    ],
    sleepStage: "REM睡眠",
  },
  {
    id: "flying",
    keyword: "飞翔",
    emoji: "🕊️",
    color: "#00d4ff",
    prevalence: "约 30% 的人做过",
    emotionTag: "自由 / 掌控感",
    neuroscienceExplanation:
      "飞翔是少数带有强烈积极情绪的普遍梦境。它通常出现在REM睡眠后期，此时默认模式网络高度活跃，顶叶的空间导航系统被激活但不受重力约束。飞翔梦往往与近期获得掌控感、解决了难题或感到自由有关——腹侧被盖区的多巴胺系统在睡眠中回放这些积极体验。同时，前庭系统在没有真实重力输入的情况下，默认模式网络可以自由构建不受物理法则限制的空间体验。前额叶部分被抑制，让你不质疑'人怎么会飞'这个逻辑漏洞。",
    involvedRegions: [
      { name: "默认模式网络", role: "构建不受约束的自由想象", color: "#f72585" },
      { name: "顶叶/空间系统", role: "构建飞翔的空间和运动感", color: "#7209b7" },
      { name: "腹侧被盖区", role: "多巴胺释放，强化积极情绪", color: "#7ae582" },
      { name: "前庭系统", role: "在无重力输入下产生漂浮感", color: "#4361ee" },
    ],
    sleepStage: "REM睡眠后期",
  },
];

const SLEEP_STAGES: SleepStage[] = [
  {
    id: "wake",
    name: "清醒",
    chineseName: "清醒",
    duration: 0,
    brainWave: "β波",
    waveFrequency: "12-30 Hz",
    description: "大脑高度活跃，处理外界信息，前额叶主导理性思考和决策。",
    color: "#ff006e",
    brainActivity: 95,
    muscleTone: 100,
    dreaming: "无",
  },
  {
    id: "n1",
    name: "N1 (浅睡)",
    chineseName: "N1 浅睡期",
    duration: 5,
    brainWave: "θ波",
    waveFrequency: "4-8 Hz",
    description: "入睡的过渡阶段，意识开始模糊，可能出现入睡前幻觉（hypnagogic hallucinations），比如感觉自己在坠落。肌肉开始放松，脑波从α波转为θ波。",
    color: "#ff9e00",
    brainActivity: 70,
    muscleTone: 80,
    dreaming: "偶尔有碎片图像",
  },
  {
    id: "n2",
    name: "N2 (中睡)",
    chineseName: "N2 中睡期",
    duration: 50,
    brainWave: "θ波 + 睡眠纺锤波",
    waveFrequency: "12-14 Hz 纺锤波",
    description: "睡眠主体，占整晚约50%。出现睡眠纺锤波（丘脑-皮层同步放电）和K复合波，大脑开始屏蔽外界干扰。记忆初步整合开始，海马体向皮层传递短期记忆。",
    color: "#ffbe0b",
    brainActivity: 50,
    muscleTone: 50,
    dreaming: "很少，思维较连贯",
  },
  {
    id: "n3",
    name: "N3 (深睡)",
    chineseName: "N3 深睡期",
    duration: 25,
    brainWave: "δ波",
    waveFrequency: "0.5-4 Hz",
    description: "深度慢波睡眠，大脑活动降至最低。这是身体修复和记忆固化的黄金时期：海马体的锐波涟漪将短期记忆转移到大脑皮层形成长期记忆，突触修剪削弱无用的神经连接。很难被叫醒。",
    color: "#06ffa5",
    brainActivity: 20,
    muscleTone: 40,
    dreaming: "极少，如有则非常现实",
  },
  {
    id: "rem",
    name: "REM (做梦期)",
    chineseName: "REM 快速眼动期",
    duration: 20,
    brainWave: "β/θ波（类似清醒）",
    waveFrequency: "混合频率",
    description: "快速眼动睡眠，大脑活动与清醒时几乎相同！脑桥发出PGO波，随机激活视觉皮层、杏仁核和默认模式网络。身体肌肉被脑桥主动麻痹（防止梦游），但眼睛快速运动。绝大多数生动梦境发生在此阶段。",
    color: "#7209b7",
    brainActivity: 90,
    muscleTone: 5,
    dreaming: "绝大多数生动梦境",
  },
];

export default function DreamNeuroscience({
  onComplete,
  subExperiments,
}: DreamNeuroscienceProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState<DreamTheme | null>(null);
  const [currentSleepIndex, setCurrentSleepIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [pgoWaves, setPgoWaves] = useState<{ id: number; x: number; y: number }[]>([]);
  const [completedSubs, setCompletedSubs] = useState<string[]>([]);
  const [showKeywordFeedback, setShowKeywordFeedback] = useState(false);
  const animationRef = useRef<number>();
  const pgoIdRef = useRef(0);

  const subList = subExperiments ?? [];

  const toggleTheme = (themeId: string) => {
    setSelectedThemes((prev) => {
      if (prev.includes(themeId)) {
        return prev.filter((t) => t !== themeId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), themeId];
      }
      return [...prev, themeId];
    });
  };

  const analyzeDream = useCallback(() => {
    if (selectedThemes.length > 0) {
      const theme = DREAM_THEMES.find((t) => t.id === selectedThemes[0]);
      if (theme) {
        setCurrentExplanation(theme);
        setShowKeywordFeedback(true);
        if (!completedSubs.includes("dream-keyword")) {
          setCompletedSubs((prev) => [...prev, "dream-keyword"]);
        }
      }
    }
  }, [selectedThemes, completedSubs]);

  const goToREMSimulator = () => {
    setPhase("rem-simulator");
    setShowKeywordFeedback(false);
  };

  const generatePgoWave = useCallback(() => {
    const id = pgoIdRef.current++;
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    setPgoWaves((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setPgoWaves((prev) => prev.filter((w) => w.id !== id));
    }, 800);
  }, []);

  useEffect(() => {
    if (isSimulating && phase === "rem-simulator") {
      let elapsed = 0;
      const stageDurations = [2, 10, 5, 10, 8];
      const stageOrder = [0, 1, 2, 3, 2, 1, 4, 1, 2, 3, 2, 4];
      let stageIdx = 0;
      let stageElapsed = 0;

      const tick = () => {
        elapsed += 0.05;
        setSimulationTime(elapsed);

        stageElapsed += 0.05;
        const currentStageDuration = stageDurations[stageOrder[stageIdx]];

        if (stageElapsed >= currentStageDuration) {
          stageElapsed = 0;
          stageIdx = (stageIdx + 1) % stageOrder.length;
          setCurrentSleepIndex(stageOrder[stageIdx]);
        }

        if (stageOrder[stageIdx] === 4) {
          if (Math.random() < 0.12) {
            generatePgoWave();
          }
        }

        if (elapsed >= 90) {
          setIsSimulating(false);
          setSimulationTime(0);
          setCurrentSleepIndex(0);
          setPgoWaves([]);
          if (!completedSubs.includes("rem-simulator")) {
            setCompletedSubs((prev) => [...prev, "rem-simulator"]);
          }
          setTimeout(() => {
            setPhase("result");
            setTimeout(() => {
              onComplete();
            }, 2500);
          }, 800);
          return;
        }

        animationRef.current = requestAnimationFrame(tick);
      };

      animationRef.current = requestAnimationFrame(tick);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isSimulating, phase, generatePgoWave, completedSubs, onComplete]);

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentSleepIndex(0);
    setSimulationTime(0);
    setPgoWaves([]);
  };

  const pauseSimulation = () => {
    setIsSimulating(false);
  };

  const currentStage = SLEEP_STAGES[currentSleepIndex];
  const isREM = currentStage.id === "rem";

  return (
    <div className="max-w-5xl mx-auto">
      {phase !== "result" && subList.length > 0 && (
        <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
          {subList.map((sub, idx) => {
            const done = completedSubs.includes(sub.id);
            const active =
              (phase === "intro" && idx === 0) ||
              (phase === "keyword" && idx === 0) ||
              (phase === "rem-simulator" && idx === 1);
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
                      done || (active && idx === 0)
                        ? "bg-neon-green/40"
                        : "bg-white/10"
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
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 flex items-center justify-center mx-auto mb-6"
              style={{ boxShadow: "0 0 30px rgba(114, 9, 183, 0.3)" }}
            >
              <Moon className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              梦境神经学实验
            </h3>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              你将依次完成 <span className="text-purple-400 font-bold">两个子实验</span>：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div
                className="p-5 rounded-2xl text-left"
                style={{
                  background: "rgba(114, 9, 183, 0.1)",
                  border: "1px solid rgba(114, 9, 183, 0.3)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center">
                    <Search className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="font-medium text-white text-sm">子实验 1：梦境关键词解析</p>
                </div>
                <p className="text-xs text-museum-300/60 leading-relaxed">
                  选择或输入你做过的梦境主题，从神经科学角度了解为什么你会做这样的梦——涉及哪些脑区、处理什么情绪、记忆整合机制是什么。
                </p>
              </div>

              <div
                className="p-5 rounded-2xl text-left"
                style={{
                  background: "rgba(67, 97, 238, 0.1)",
                  border: "1px solid rgba(67, 97, 238, 0.3)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="font-medium text-white text-sm">子实验 2：REM睡眠模拟器</p>
                </div>
                <p className="text-xs text-museum-300/60 leading-relaxed">
                  运行完整的睡眠周期模拟（约90分钟循环，实时加速演示），观察脑电波变化、神经元活动、以及REM阶段随机爆发的PGO波——这就是梦境碎片化的原因。
                </p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl mb-8 max-w-lg mx-auto text-left"
              style={{
                background: "rgba(255, 0, 110, 0.08)",
                border: "1px solid rgba(255, 0, 110, 0.25)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-pink-300">
                  科学说明
                </span>
              </div>
              <p className="text-xs text-museum-200/70 leading-relaxed">
                本模块基于神经科学研究（激活-合成理论、睡眠记忆巩固假说等），不提供任何玄学解梦。梦境不是预兆，而是大脑在睡眠中处理情绪、整合记忆、修剪突触的副产品。
              </p>
            </div>

            <button
              onClick={() => setPhase("keyword")}
              className="btn-primary"
            >
              开始体验
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {phase === "keyword" && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                🔍 你最近做过什么梦？
              </h3>
              <p className="text-sm text-museum-300/60">
                选择最多 3 个你做过的梦境主题（或最感兴趣的），我们将从神经科学角度解读
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {DREAM_THEMES.map((theme) => {
                const isSelected = selectedThemes.includes(theme.id);
                return (
                  <button
                    key={theme.id}
                    onClick={() => toggleTheme(theme.id)}
                    className={`p-4 rounded-2xl text-left transition-all ${
                      isSelected
                        ? "scale-[1.02]"
                        : "hover:scale-[1.01] hover:brightness-110"
                    }`}
                    style={{
                      background: isSelected
                        ? `${theme.color}25`
                        : "rgba(255, 255, 255, 0.03)",
                      border: isSelected
                        ? `2px solid ${theme.color}`
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: isSelected ? `0 0 20px ${theme.color}40` : "none",
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl">{theme.emoji}</span>
                      {isSelected && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: theme.color }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-white mb-1">{theme.keyword}</p>
                    <p className="text-xs text-museum-300/50">{theme.prevalence}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${theme.color}20`,
                          color: theme.color,
                        }}
                      >
                        {theme.emotionTag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mb-6">
              <p className="text-sm text-museum-300/60 mb-2">或输入你自己的梦境关键词：</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="例如：游泳、考试迟到、找不到厕所..."
                  className="flex-1 px-4 py-3 rounded-xl bg-museum-900/50 border border-white/10 text-white placeholder:text-museum-400/50 focus:outline-none focus:border-purple-500/50 text-sm"
                />
                <button
                  onClick={() => customKeyword && setSelectedThemes((prev) => [...prev.slice(prev.length >= 3 ? 1 : 0), "custom"])}
                  disabled={!customKeyword || selectedThemes.length >= 3}
                  className="btn-secondary text-sm px-4"
                >
                  添加
                </button>
              </div>
            </div>

            {selectedThemes.length === 0 && (
              <p className="text-center text-museum-300/50 text-sm mb-6">
                请至少选择 1 个梦境主题
              </p>
            )}

            {!showKeywordFeedback ? (
              <div className="text-center">
                <button
                  onClick={analyzeDream}
                  disabled={selectedThemes.length === 0}
                  className="btn-primary gap-2"
                  style={{
                    opacity: selectedThemes.length === 0 ? 0.5 : 1,
                  }}
                >
                  <Brain className="w-5 h-5" />
                  神经科学解析
                </button>
              </div>
            ) : (
              currentExplanation && (
                <div className="animate-fade-in">
                  <div
                    className="p-5 rounded-2xl mb-4"
                    style={{
                      background: `${currentExplanation.color}10`,
                      border: `1px solid ${currentExplanation.color}40`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{currentExplanation.emoji}</span>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {currentExplanation.keyword}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${currentExplanation.color}25`,
                              color: currentExplanation.color,
                            }}
                          >
                            {currentExplanation.emotionTag}
                          </span>
                          <span className="text-xs text-museum-300/60">
                            {currentExplanation.prevalence}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4" style={{ color: currentExplanation.color }} />
                          <p className="text-sm font-medium text-white">神经科学解读</p>
                        </div>
                        <p className="text-sm text-museum-200/80 leading-relaxed">
                          {currentExplanation.neuroscienceExplanation}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white mb-2">🧠 涉及脑区</p>
                        <div className="grid grid-cols-2 gap-2">
                          {currentExplanation.involvedRegions.map((region) => (
                            <div
                              key={region.name}
                              className="p-2 rounded-lg"
                              style={{
                                background: `${region.color}15`,
                                border: `1px solid ${region.color}30`,
                              }}
                            >
                              <p
                                className="text-sm font-medium"
                                style={{ color: region.color }}
                              >
                                {region.name}
                              </p>
                              <p className="text-xs text-museum-300/60 mt-0.5">
                                {region.role}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white mb-1">💤 常见睡眠阶段</p>
                        <p className="text-sm text-museum-200/80">
                          {currentExplanation.sleepStage}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setShowKeywordFeedback(false);
                        setSelectedThemes([]);
                        setCurrentExplanation(null);
                      }}
                      className="btn-secondary gap-2 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      换一个主题
                    </button>
                    <button onClick={goToREMSimulator} className="btn-primary gap-2 text-sm">
                      下一步：REM睡眠模拟器
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {phase === "rem-simulator" && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                🌙 REM 睡眠模拟器
              </h3>
              <p className="text-sm text-museum-300/60">
                观察一个完整睡眠周期（约90分钟，加速演示）中的脑电波和大脑活动
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div
                className="lg:col-span-2 p-5 rounded-2xl relative overflow-hidden"
                style={{
                  background: "rgba(10, 10, 30, 0.8)",
                  border: `1px solid ${currentStage.color}40`,
                  minHeight: "320px",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-museum-300/50">当前阶段</p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: currentStage.color }}
                    >
                      {currentStage.chineseName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-museum-300/50">模拟时间</p>
                    <p className="text-lg font-mono text-white">
                      {Math.floor(simulationTime / 60)}:{(simulationTime % 60).toFixed(0).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className="relative h-40 mb-4 rounded-xl overflow-hidden"
                  style={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                    {Array.from({ length: 400 }).map((_, i) => {
                      let amp = 0;
                      let freq = 0;
                      if (currentStage.id === "wake") {
                        amp = 10;
                        freq = 0.25;
                      } else if (currentStage.id === "n1") {
                        amp = 15;
                        freq = 0.12;
                      } else if (currentStage.id === "n2") {
                        amp = 20;
                        freq = 0.08;
                      } else if (currentStage.id === "n3") {
                        amp = 45;
                        freq = 0.03;
                      } else if (currentStage.id === "rem") {
                        amp = 12 + Math.sin(i * 0.05 + simulationTime * 3) * 8;
                        freq = 0.2;
                      }
                      const y = 80 + Math.sin(i * freq + simulationTime * 2) * amp + (Math.random() - 0.5) * 5;
                      return (
                        <circle
                          key={i}
                          cx={i}
                          cy={y}
                          r={1.5}
                          fill={currentStage.color}
                          opacity={0.7}
                        />
                      );
                    })}
                  </svg>
                  {pgoWaves.map((wave) => (
                    <div
                      key={wave.id}
                      className="absolute rounded-full animate-ping"
                      style={{
                        left: `${wave.x}%`,
                        top: `${wave.y}%`,
                        width: "40px",
                        height: "40px",
                        marginLeft: "-20px",
                        marginTop: "-20px",
                        background: "radial-gradient(circle, rgba(114, 9, 183, 0.8) 0%, transparent 70%)",
                      }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-1 mb-1">
                      <Waves className="w-3 h-3 text-museum-300/60" />
                      <p className="text-xs text-museum-300/60">脑电波</p>
                    </div>
                    <p className="text-sm font-medium text-white">{currentStage.brainWave}</p>
                    <p className="text-xs text-museum-400/60">{currentStage.waveFrequency}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-1 mb-1">
                      <Brain className="w-3 h-3 text-museum-300/60" />
                      <p className="text-xs text-museum-300/60">脑活动</p>
                    </div>
                    <div className="h-1.5 bg-museum-900 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${currentStage.brainActivity}%`,
                          background: currentStage.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-museum-400/60 mt-1">{currentStage.brainActivity}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="w-3 h-3 text-museum-300/60" />
                      <p className="text-xs text-museum-300/60">肌张力</p>
                    </div>
                    <div className="h-1.5 bg-museum-900 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
                        style={{ width: `${currentStage.muscleTone}%` }}
                      />
                    </div>
                    <p className="text-xs text-museum-400/60 mt-1">{currentStage.muscleTone}%</p>
                  </div>
                </div>

                {isREM && (
                  <div
                    className="absolute top-4 right-4 p-2 rounded-lg animate-pulse"
                    style={{
                      background: "rgba(114, 9, 183, 0.3)",
                      border: "1px solid rgba(114, 9, 183, 0.6)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-purple-300" />
                      <span className="text-xs text-purple-200 font-medium">REM：快速眼动中</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl"
                  style={{
                    background: `${currentStage.color}10`,
                    border: `1px solid ${currentStage.color}30`,
                  }}
                >
                  <p className="text-xs text-museum-300/50 mb-1">阶段说明</p>
                  <p className="text-sm text-museum-200/80 leading-relaxed">
                    {currentStage.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-museum-300/50 mb-1">💭 做梦概率</p>
                  <p className="text-sm text-white">{currentStage.dreaming}</p>
                </div>

                {isREM && (
                  <div className="p-4 rounded-2xl"
                    style={{
                      background: "rgba(114, 9, 183, 0.1)",
                      border: "1px solid rgba(114, 9, 183, 0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <p className="text-sm font-medium text-purple-300">PGO 波随机爆发中</p>
                    </div>
                    <p className="text-xs text-museum-200/70 leading-relaxed">
                      脑桥正在随机发出神经脉冲，激活视觉皮层和默认模式网络。这些信号本身没有意义——大脑试图把它们'合成'成故事，这就是为什么梦境跳跃、碎片化的原因！
                    </p>
                  </div>
                )}

                {!isREM && currentStage.id !== "wake" && (
                  <div className="p-4 rounded-2xl"
                    style={{
                      background: "rgba(6, 255, 165, 0.08)",
                      border: "1px solid rgba(6, 255, 165, 0.25)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <p className="text-sm font-medium text-green-300">
                        {currentStage.id === "n3" ? "记忆固化进行中" : "浅睡记忆整理"}
                      </p>
                    </div>
                    <p className="text-xs text-museum-200/70 leading-relaxed">
                      海马体正在将白天的短期记忆'回放'并转移到大脑皮层，突触修剪削弱无用的神经连接。
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              {SLEEP_STAGES.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => {
                    if (!isSimulating) {
                      setCurrentSleepIndex(idx);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-xs transition-all ${
                    !isSimulating ? "cursor-pointer" : "cursor-default"
                  }`}
                  style={{
                    background:
                      currentSleepIndex === idx
                        ? `${stage.color}30`
                        : "rgba(255, 255, 255, 0.03)",
                    border:
                      currentSleepIndex === idx
                        ? `1px solid ${stage.color}`
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    opacity: isSimulating && currentSleepIndex !== idx ? 0.6 : 1,
                  }}
                  disabled={isSimulating}
                >
                  <span style={{ color: stage.color }}>{stage.brainWave}</span>
                  <span className="text-museum-300/60 ml-1">{stage.chineseName}</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              {!isSimulating ? (
                <button onClick={startSimulation} className="btn-primary gap-2">
                  <Play className="w-5 h-5" />
                  启动完整睡眠周期模拟（约90分钟）
                </button>
              ) : (
                <button onClick={pauseSimulation} className="btn-secondary gap-2">
                  <Pause className="w-5 h-5" />
                  暂停模拟
                </button>
              )}
              <p className="text-xs text-museum-300/50 mt-3">
                演示将加速显示完整的睡眠周期：清醒 → N1 → N2 → N3 → N2 → N1 → REM → ...
              </p>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="text-center animate-fade-in">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
              style={{ boxShadow: "0 0 40px rgba(114, 9, 183, 0.3)" }}
            >
              <Moon className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              梦境神经学实验完成！
            </h3>
            <p className="text-museum-200/80 mb-8 max-w-lg mx-auto leading-relaxed">
              你已经了解了梦境的神经科学本质：梦不是预兆，而是大脑在睡眠中处理情绪、整合记忆、修剪突触的副产品。下次做梦醒来，试着回想一下——你的大脑在夜间悄悄做了哪些工作？
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
              {[
                { label: "常见梦境主题", value: `${selectedThemes.length || 3}+`, color: "#7209b7" },
                { label: "完成子实验", value: `${completedSubs.length}/2`, color: "#06ffa5" },
                { label: "学习脑区", value: "8+", color: "#ff006e" },
                { label: "睡眠阶段", value: "5", color: "#4361ee" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-xs text-museum-300/60">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="text-museum-300/60 text-sm">
              即将生成脑区参与链路图...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
