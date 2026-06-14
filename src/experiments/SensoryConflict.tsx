import { useState, useRef, useEffect, useCallback } from "react";
import {
  Eye,
  Ear,
  Hand,
  Music,
  Check,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { SubExperiment } from "@/data/experiments";

interface SensoryConflictProps {
  onComplete: () => void;
  subExperiments?: SubExperiment[];
}

type Phase = "intro" | "mcgurk" | "rubber-hand" | "sound-taste" | "result";

export default function SensoryConflict({
  onComplete,
  subExperiments,
}: SensoryConflictProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [completedSubs, setCompletedSubs] = useState<string[]>([]);
  const [mcgurkStep, setMcgurkStep] = useState(0);
  const [rubberStep, setRubberStep] = useState(0);
  const [soundStep, setSoundStep] = useState(0);
  const [mcgurkAnswer, setMcgurkAnswer] = useState<string | null>(null);
  const [rubberFeeling, setRubberFeeling] = useState<number>(3);
  const [tasteRating, setTasteRating] = useState<{ high: number; low: number } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlayingHigh, setIsPlayingHigh] = useState(false);
  const [isPlayingLow, setIsPlayingLow] = useState(false);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, setPlaying: (v: boolean) => void) => {
      const ctx = ensureAudioContext();
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (gainRef.current) {
        try {
          gainRef.current.disconnect();
        } catch {
          // ignore
        }
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);

      oscillatorRef.current = oscillator;
      gainRef.current = gainNode;

      setPlaying(true);
      setTimeout(() => setPlaying(false), duration * 1000);
    },
    [ensureAudioContext]
  );

  const playHighSound = () => playTone(3000, 0.3, setIsPlayingHigh);
  const playLowSound = () => playTone(200, 0.3, setIsPlayingLow);

  const markSubComplete = useCallback((subId: string) => {
    setCompletedSubs((prev) =>
      prev.includes(subId) ? prev : [...prev, subId]
    );
  }, []);

  const nextPhase = () => {
    if (phase === "intro") setPhase("mcgurk");
    else if (phase === "mcgurk") {
      markSubComplete("mcgurk");
      setPhase("rubber-hand");
    } else if (phase === "rubber-hand") {
      markSubComplete("rubber-hand");
      setPhase("sound-taste");
    } else if (phase === "sound-taste") {
      markSubComplete("sound-taste");
      setPhase("result");
      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  };

  const getCurrentSub = (): SubExperiment | undefined => {
    const id =
      phase === "mcgurk"
        ? "mcgurk"
        : phase === "rubber-hand"
        ? "rubber-hand"
        : phase === "sound-taste"
        ? "sound-taste"
        : null;
    return subExperiments?.find((s) => s.id === id);
  };

  const currentSub = getCurrentSub();
  const subList = subExperiments ?? [];
  const progress = phase === "intro" ? 0 : phase === "mcgurk" ? 1 : phase === "rubber-hand" ? 2 : phase === "sound-taste" ? 3 : 3;

  const handleMcgurkAnswer = (answer: string) => {
    setMcgurkAnswer(answer);
    setMcgurkStep(2);
  };

  const handleRubberContinue = () => {
    if (rubberStep < 4) {
      setRubberStep(rubberStep + 1);
    } else {
      nextPhase();
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      {phase !== "result" && (
        <div className="mb-6 flex items-center justify-center gap-2">
          {subList.map((sub, idx) => {
            const done = completedSubs.includes(sub.id);
            const active =
              (phase === "mcgurk" && idx === 0) ||
              (phase === "rubber-hand" && idx === 1) ||
              (phase === "sound-taste" && idx === 2);
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
                    className={`w-12 md:w-20 h-0.5 transition-all ${
                      done || (active && idx === 0) ? "bg-neon-green/40" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="glass-card p-8 text-center">
        {phase === "intro" && (
          <div className="animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 flex items-center justify-center mx-auto mb-6"
              style={{ boxShadow: "0 0 30px rgba(247, 37, 133, 0.3)" }}>
              <Sparkles className="w-10 h-10 text-neon-pink" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              感官打架实验
            </h3>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              你将依次体验三个经典的感官冲突现象：
              <br />
              <span className="text-neon-pink">视觉 vs 听觉</span> · 
              <span className="text-neon-blue"> 视觉 vs 触觉</span> · 
              <span className="text-neon-yellow"> 听觉 vs 味觉</span>
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
              {subList.map((sub, i) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl"
                  style={{
                    background: [
                      "rgba(247, 37, 133, 0.08)",
                      "rgba(56, 176, 0, 0.08)",
                      "rgba(255, 158, 0, 0.08)",
                    ][i],
                    border: `1px solid ${[
                      "rgba(247, 37, 133, 0.2)",
                      "rgba(56, 176, 0, 0.2)",
                      "rgba(255, 158, 0, 0.2)",
                    ][i]}`,
                  }}
                >
                  <div className="text-2xl mb-1">
                    {[<Eye key="e" className="w-5 h-5 inline" />, <Hand key="h" className="w-5 h-5 inline" />, <Music key="m" className="w-5 h-5 inline" />][i]}
                  </div>
                  <p className="text-xs text-white font-medium">{sub.title}</p>
                </div>
              ))}
            </div>
            <button onClick={nextPhase} className="btn-primary">
              开始第一个实验
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {phase === "mcgurk" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Ear className="w-5 h-5 text-neon-pink" />
              <Eye className="w-5 h-5 text-neon-blue" />
              <h3 className="text-xl font-bold text-white">McGurk 效应</h3>
            </div>
            <p className="text-sm text-museum-300/60 mb-6">
              当视觉和听觉不一致时，大脑会相信谁？
            </p>

            {mcgurkStep === 0 && (
              <div>
                <div className="relative inline-block mb-8">
                  <div
                    className="w-48 h-48 md:w-64 md:h-64 rounded-2xl flex items-center justify-center text-7xl md:text-8xl mx-auto"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(247,37,133,0.15), rgba(0,212,255,0.15))",
                      border: "2px solid rgba(247,37,133,0.3)",
                    }}
                  >
                    <span className="animate-pulse-slow">👄</span>
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30 text-xs text-neon-purple">
                    <Volume2 className="w-3 h-3" />
                    播放声音
                  </div>
                </div>
                <p className="text-museum-200/80 mb-6 leading-relaxed">
                  想象这个嘴巴在说 <span className="text-neon-blue font-bold">"嘎(ga)"</span> 的口型，
                  <br />
                  但你听到的声音却是 <span className="text-neon-pink font-bold">"吧(ba)"</span>。
                  <br />
                  <span className="text-sm text-museum-300/60">
                    （真实的McGurk实验中，人们通常会感知到"哒(da)"）
                  </span>
                </p>
                <button
                  onClick={() => setMcgurkStep(1)}
                  className="btn-secondary gap-2 mb-4"
                >
                  <Eye className="w-4 h-4" />
                  播放模拟（文字+提示）
                </button>
                <div className="text-xs text-museum-300/50">
                  （由于浏览器限制，我们用文字描述代替真实音视频）
                </div>
              </div>
            )}

            {mcgurkStep === 1 && (
              <div>
                <div className="p-6 rounded-2xl mb-6 animate-fade-in"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(247,37,133,0.1))",
                    border: "1px solid rgba(247,37,133,0.2)",
                  }}>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-4xl mb-1">👀</div>
                      <p className="text-sm text-neon-blue">看到：嘎(ga)</p>
                    </div>
                    <div className="text-3xl text-museum-300/40">→?←</div>
                    <div className="text-center">
                      <div className="text-4xl mb-1">👂</div>
                      <p className="text-sm text-neon-pink">听到：吧(ba)</p>
                    </div>
                  </div>
                  <div className="text-museum-200/70 text-sm">
                    两种信息在你的大脑中碰撞...
                  </div>
                </div>
                <p className="text-white mb-4">
                  你最终感知到的是什么？
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleMcgurkAnswer("ga")}
                    className="btn-secondary"
                  >
                    嘎(ga) - 相信视觉
                  </button>
                  <button
                    onClick={() => handleMcgurkAnswer("ba")}
                    className="btn-secondary"
                  >
                    吧(ba) - 相信听觉
                  </button>
                  <button
                    onClick={() => handleMcgurkAnswer("da")}
                    className="btn-primary"
                  >
                    哒(da) - 大脑折中了
                  </button>
                  <button
                    onClick={() => handleMcgurkAnswer("confused")}
                    className="btn-secondary"
                  >
                    感觉很混乱
                  </button>
                </div>
              </div>
            )}

            {mcgurkStep === 2 && (
              <div className="animate-fade-in">
                <div
                  className="p-6 rounded-2xl mb-6"
                  style={{
                    background: "rgba(247,37,133,0.08)",
                    border: "1px solid rgba(247,37,133,0.25)",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-neon-pink" />
                    <h4 className="text-lg font-bold text-white">
                      这就是 McGurk 效应！
                    </h4>
                  </div>
                  <p className="text-museum-200/80 text-sm leading-relaxed mb-4">
                    在真实实验中，约 60%-80% 的人会感知到折中后的声音 "哒(da)"。
                    你的大脑颞上沟（STS）检测到视听冲突后，会自动尝试"融合"矛盾信息——
                    结果就是你"听到"了一个从未存在过的声音。
                  </p>
                  <div className="text-xs text-museum-300/60">
                    你的选择：
                    <span className="text-white font-medium">
                      {mcgurkAnswer === "ga" && "嘎(ga) - 更相信视觉"}
                      {mcgurkAnswer === "ba" && "吧(ba) - 更相信听觉"}
                      {mcgurkAnswer === "da" && "哒(da) - 大脑自动折中（最典型）"}
                      {mcgurkAnswer === "confused" && "感觉很混乱 - 感官冲突明显"}
                    </span>
                  </div>
                </div>
                <button onClick={nextPhase} className="btn-primary gap-2">
                  下一个实验
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "rubber-hand" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-neon-blue" />
              <Hand className="w-5 h-5 text-neon-green" />
              <h3 className="text-xl font-bold text-white">橡胶手错觉</h3>
            </div>
            <p className="text-sm text-museum-300/60 mb-6">
              大脑会把假手当成自己的手吗？
            </p>

            {rubberStep === 0 && (
              <div>
                <div className="flex justify-center items-end gap-4 mb-8 h-48">
                  <div className="text-center">
                    <div className="text-7xl mb-2">🤚</div>
                    <p className="text-xs text-museum-300/60">你的左手（藏在挡板后）</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-4 h-24 rounded"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(157,78,221,0.3), rgba(157,78,221,0.1))",
                      }}
                    />
                    <p className="text-xs text-museum-300/60">挡板</p>
                  </div>
                  <div className="text-center">
                    <div className="text-7xl mb-2">🖐️</div>
                    <p className="text-xs text-neon-green">橡胶手（你能看到）</p>
                  </div>
                </div>
                <p className="text-museum-200/80 mb-6 leading-relaxed">
                  你坐在桌子前，左手藏在挡板后面，你能看到的是一只橡胶假手。
                  <br />
                  现在实验人员用刷子同时同步抚摸你的真手和橡胶手...
                </p>
                <button onClick={handleRubberContinue} className="btn-primary">
                  开始同步抚摸
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {rubberStep === 1 && (
              <div>
                <div className="relative inline-block mb-8">
                  <div className="flex justify-center items-end gap-4 h-48">
                    <div className="text-center">
                      <div className="text-7xl mb-2 animate-bounce-slow">🤚</div>
                    </div>
                    <div className="w-4 h-24 rounded opacity-50"
                      style={{ background: "linear-gradient(180deg, rgba(157,78,221,0.3), rgba(157,78,221,0.1))" }} />
                    <div className="text-center">
                      <div className="text-7xl mb-2 animate-bounce-slow">🖐️</div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl animate-pulse">
                    🖌️ 🖌️
                  </div>
                </div>
                <p className="text-museum-200/80 mb-6">
                  刷子同时以相同的节奏和方向，
                  <br />
                  抚摸着你的真手和橡胶手的相同位置...
                </p>
                <button onClick={handleRubberContinue} className="btn-primary">
                  继续（30秒后）
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {rubberStep === 2 && (
              <div>
                <div
                  className="p-6 rounded-2xl mb-6"
                  style={{
                    background: "rgba(56, 176, 0, 0.08)",
                    border: "1px solid rgba(56, 176, 0, 0.25)",
                  }}
                >
                  <p className="text-white font-medium mb-4">
                    此刻，你感觉橡胶手属于你吗？
                  </p>
                  <div className="flex flex-col gap-2 max-w-md mx-auto">
                    {[
                      { v: 1, label: "完全没有，它显然是假的" },
                      { v: 2, label: "不太有这种感觉" },
                      { v: 3, label: "有一点模糊的感觉" },
                      { v: 4, label: "挺强烈的，好像它就是我的手" },
                      { v: 5, label: "非常强烈！它就是我的手" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => {
                          setRubberFeeling(opt.v);
                        }}
                        className={`p-3 rounded-xl text-left transition-all ${
                          rubberFeeling === opt.v
                            ? "bg-neon-green/20 border border-neon-green/40"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-sm text-white">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleRubberContinue} className="btn-primary gap-2">
                  确认我的感受
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {rubberStep === 3 && (
              <div>
                <div
                  className="p-6 rounded-2xl mb-6"
                  style={{
                    background: "rgba(56, 176, 0, 0.08)",
                    border: "1px solid rgba(56, 176, 0, 0.25)",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-neon-green" />
                    <h4 className="text-lg font-bold text-white">
                      橡胶手错觉发生了！
                    </h4>
                  </div>
                  <p className="text-museum-200/80 text-sm leading-relaxed mb-4">
                    当视觉信息（看到橡胶手被抚摸）与触觉信息（感觉到自己的手被抚摸）
                    在时间和空间上匹配时，你的顶叶皮层会更新"身体模型"——
                    将橡胶手纳入"自我"的范畴。这说明你对"自己身体"的感知，
                    其实是大脑实时构建的模型，而不是绝对的事实。
                  </p>
                  <div className="text-xs text-museum-300/60">
                    你的体感强度：
                    <span className="text-white font-medium">
                      {rubberFeeling <= 2 && " 较弱（你需要更多时间或更强的同步刺激）"}
                      {rubberFeeling === 3 && " 中等（你体验到了轻度错觉）"}
                      {rubberFeeling >= 4 && " 很强（你的大脑完全被视觉信息说服了！）"}
                    </span>
                  </div>
                </div>
                <button onClick={handleRubberContinue} className="btn-primary gap-2">
                  下一个实验
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {rubberStep === 4 && (
              <div className="py-8">
                <p className="text-2xl text-white mb-4">突然！</p>
                <div className="text-7xl mb-4 animate-bounce">🔨</div>
                <p className="text-museum-200/80">
                  实验人员假装用锤子砸向橡胶手...
                  <br />
                  <span className="text-neon-green">
                    你是不是会下意识缩手？！
                  </span>
                </p>
                <p className="text-museum-300/60 text-sm mt-4">
                  （这就是橡胶手错觉最强有力的证明）
                </p>
                <button onClick={handleRubberContinue} className="btn-primary gap-2 mt-8">
                  进入下一个实验
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "sound-taste" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Ear className="w-5 h-5 text-neon-yellow" />
              <Sparkles className="w-5 h-5 text-neon-pink" />
              <h3 className="text-xl font-bold text-white">声音改变味觉</h3>
            </div>
            <p className="text-sm text-museum-300/60 mb-6">
              声音频率会改变你对食物酥脆度的感知？
            </p>

            {soundStep === 0 && (
              <div>
                <div className="text-8xl mb-8 animate-bounce-slow">🥨</div>
                <p className="text-museum-200/80 mb-6 leading-relaxed">
                  想象你正在吃一块脆饼干。
                  <br />
                  你咀嚼时会听到"咔嚓"的声音。
                  <br />
                  <span className="text-museum-300/60 text-sm">
                    现在请分别听两种不同频率的"咬碎声"，
                    然后判断它们让你感觉饼干有多酥脆。
                  </span>
                </p>
                <button onClick={() => setSoundStep(1)} className="btn-primary">
                  开始听觉-味觉测试
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {soundStep === 1 && (
              <div>
                <p className="text-museum-200/80 mb-6">
                  先点击播放 <span className="text-neon-blue font-bold">高频声音</span>，
                  想象这是你咬碎饼干的声音
                </p>

                <div className="mb-8">
                  <button
                    onClick={playHighSound}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl flex flex-col items-center justify-center mx-auto transition-all ${
                      isPlayingHigh
                        ? "bg-neon-blue/30 border-2 border-neon-blue scale-105"
                        : "bg-neon-blue/10 border-2 border-neon-blue/30 hover:bg-neon-blue/20"
                    }`}
                    style={{
                      boxShadow: isPlayingHigh
                        ? "0 0 40px rgba(0,212,255,0.5)"
                        : "0 0 20px rgba(0,212,255,0.2)",
                    }}
                  >
                    {isPlayingHigh ? (
                      <Volume2 className="w-12 h-12 text-neon-blue animate-pulse" />
                    ) : (
                      <VolumeX className="w-12 h-12 text-neon-blue/60" />
                    )}
                    <span className="text-sm text-neon-blue font-medium mt-2">
                      高频 3000Hz
                    </span>
                  </button>
                </div>

                <p className="text-white mb-4">
                  这个高频"咔嚓"声让你感觉饼干有多酥脆？
                </p>
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-6">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setTasteRating((prev) => ({
                          high: v,
                          low: prev?.low ?? 0,
                        }));
                      }}
                      className={`aspect-square rounded-lg text-sm font-bold transition-all ${
                        tasteRating?.high === v
                          ? "bg-neon-blue text-white"
                          : "bg-white/5 text-museum-300/70 hover:bg-white/10"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-museum-300/50 max-w-md mx-auto mb-6 -mt-4">
                  <span>不脆</span>
                  <span>超级脆</span>
                </div>

                {tasteRating?.high && (
                  <button
                    onClick={() => setSoundStep(2)}
                    className="btn-primary gap-2"
                  >
                    接下来听低频
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {soundStep === 2 && (
              <div>
                <p className="text-museum-200/80 mb-6">
                  现在播放 <span className="text-neon-orange font-bold">低频声音</span>，
                  同样想象这是你咬碎同一块饼干的声音
                </p>

                <div className="mb-8">
                  <button
                    onClick={playLowSound}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl flex flex-col items-center justify-center mx-auto transition-all ${
                      isPlayingLow
                        ? "bg-neon-orange/30 border-2 border-neon-orange scale-105"
                        : "bg-neon-orange/10 border-2 border-neon-orange/30 hover:bg-neon-orange/20"
                    }`}
                    style={{
                      boxShadow: isPlayingLow
                        ? "0 0 40px rgba(255,158,0,0.5)"
                        : "0 0 20px rgba(255,158,0,0.2)",
                    }}
                  >
                    {isPlayingLow ? (
                      <Volume2 className="w-12 h-12 text-neon-orange animate-pulse" />
                    ) : (
                      <VolumeX className="w-12 h-12 text-neon-orange/60" />
                    )}
                    <span className="text-sm text-neon-orange font-medium mt-2">
                      低频 200Hz
                    </span>
                  </button>
                </div>

                <p className="text-white mb-4">
                  这个低频"咔嚓"声让你感觉饼干有多酥脆？
                </p>
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-6">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setTasteRating((prev) => ({
                          high: prev?.high ?? 0,
                          low: v,
                        }));
                      }}
                      className={`aspect-square rounded-lg text-sm font-bold transition-all ${
                        tasteRating?.low === v
                          ? "bg-neon-orange text-white"
                          : "bg-white/5 text-museum-300/70 hover:bg-white/10"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-museum-300/50 max-w-md mx-auto mb-6 -mt-4">
                  <span>不脆</span>
                  <span>超级脆</span>
                </div>

                {tasteRating?.low && (
                  <button
                    onClick={() => setSoundStep(3)}
                    className="btn-primary gap-2"
                  >
                    查看我的结果
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {soundStep === 3 && (
              <div>
                <div
                  className="p-6 rounded-2xl mb-6"
                  style={{
                    background: "rgba(255,158,0,0.08)",
                    border: "1px solid rgba(255,158,0,0.25)",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-neon-orange" />
                    <h4 className="text-lg font-bold text-white">
                      声音真的改变了味觉！
                    </h4>
                  </div>

                  {tasteRating && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
                        <div className="text-3xl font-bold text-neon-blue mb-1">
                          {tasteRating.high}/5
                        </div>
                        <p className="text-xs text-museum-300/70">高频酥脆感</p>
                      </div>
                      <div className="p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/20">
                        <div className="text-3xl font-bold text-neon-orange mb-1">
                          {tasteRating.low}/5
                        </div>
                        <p className="text-xs text-museum-300/70">低频酥脆感</p>
                      </div>
                    </div>
                  )}

                  <p className="text-museum-200/80 text-sm leading-relaxed mb-3">
                    研究发现，高频的"咔嚓"声会让人们觉得食物更新鲜、更酥脆；
                    而低频声音则让人感觉食物变软、不新鲜。
                    听觉皮层接收到的频率信号会通过岛叶影响味觉皮层的处理过程。
                  </p>
                  <div className="text-xs text-museum-300/60 p-3 rounded-lg bg-black/20">
                    💡 这就是为什么品客薯片特别设计了包装的"咔嚓"声，
                    以及为什么高端餐厅会精心挑选背景音乐——它们都在偷偷改变你对食物味道的感知。
                  </div>
                </div>

                <button onClick={nextPhase} className="btn-primary gap-2">
                  完成所有实验
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "result" && (
          <div className="animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-green/30 to-neon-blue/30 flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
              style={{ boxShadow: "0 0 40px rgba(6,255,165,0.3)" }}>
              <Check className="w-10 h-10 text-neon-green" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              所有感官实验完成！
            </h3>
            <p className="text-museum-200/80 mb-6">
              你已经体验了三种感官冲突现象。
              <br />
              接下来让我们看看这背后的脑区参与链路...
            </p>
            <div className="text-museum-300/60 text-sm">
              即将生成脑区参与链路图...
            </div>
          </div>
        )}
      </div>

      {currentSub && phase !== "intro" && phase !== "result" && (
        <div className="mt-4 text-center text-museum-300/50 text-xs">
          当前实验 {progress}/3 · {currentSub.title}
        </div>
      )}
    </div>
  );
}
