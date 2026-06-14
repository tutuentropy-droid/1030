import { useState, useEffect, useRef } from "react";
import { Clock, Play, Zap } from "lucide-react";

interface TimeIllusionProps {
  onComplete: () => void;
}

type Phase = "intro" | "waiting" | "estimate" | "result";

export default function TimeIllusion({ onComplete }: TimeIllusionProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [startTime, setStartTime] = useState<number>(0);
  const [userEstimate, setUserEstimate] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (phase === "waiting") {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const pulse = (Math.sin(elapsed * 0.003) + 1) / 2;
        setPulseIntensity(pulse);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [phase, startTime]);

  const handleStart = () => {
    setStartTime(Date.now());
    setPhase("waiting");
  };

  const handleStop = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    setUserEstimate(elapsed);
    setPhase("result");
    setTimeout(() => {
      setShowResult(true);
      setTimeout(() => {
        onComplete();
      }, 4000);
    }, 300);
  };

  const targetTime = 10;
  const diff = Math.abs(userEstimate - targetTime);
  const accuracy = Math.max(0, 100 - diff * 10);

  const getTimeJudgment = () => {
    if (diff < 0.5) return { text: "时间感超准！", color: "text-neon-green" };
    if (diff < 1.5) return { text: "时间感不错~", color: "text-neon-blue" };
    if (diff < 3) return { text: "有点偏差哦", color: "text-neon-yellow" };
    return { text: "时间感偏差较大", color: "text-neon-pink" };
  };

  const judgment = getTimeJudgment();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 text-center">
        {phase === "intro" && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-neon-green/20 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-neon-green" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              时间感知测试
            </h3>
            <p className="text-museum-200/80 mb-4 leading-relaxed">
              点击开始后，在你感觉过了 <span className="text-neon-green font-bold">10 秒</span> 的时候点击停止。
            </p>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              不要数秒，不要看时钟 —— 完全凭你的时间感来判断。
            </p>
            <p className="text-museum-300/60 text-sm mb-8">
              看看你的时间感有多准确？
            </p>
            <button onClick={handleStart} className="btn-primary gap-2">
              <Play className="w-5 h-5" />
              开始计时
            </button>
          </>
        )}

        {phase === "waiting" && (
          <div className="py-12">
            <p className="text-museum-200/80 mb-8">
              感觉到了 10 秒就点击停止
            </p>

            <div
              className="w-40 h-40 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-100"
              style={{
                background: `radial-gradient(circle, rgba(6, 255, 165, ${0.2 + pulseIntensity * 0.3}) 0%, rgba(6, 255, 165, 0.05) 70%)`,
                boxShadow: `0 0 ${40 + pulseIntensity * 60}px rgba(6, 255, 165, ${0.3 + pulseIntensity * 0.3})`,
              }}
            >
              <div className="text-center">
                <Zap
                  className="w-12 h-12 mx-auto mb-2 transition-opacity duration-100"
                  style={{
                    color: "#06ffa5",
                    opacity: 0.5 + pulseIntensity * 0.5,
                  }}
                />
                <p className="text-museum-300/60 text-sm">感知中...</p>
              </div>
            </div>

            <button onClick={handleStop} className="btn-secondary gap-2 text-lg px-8 py-4">
              <Clock className="w-5 h-5" />
              到 10 秒了！
            </button>
          </div>
        )}

        {phase === "result" && showResult && (
          <div className="animate-slide-up">
            <h3 className="text-2xl font-bold text-white mb-6">
              测试结果
            </h3>

            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6" style={{
              background: `conic-gradient(from 0deg, #06ffa5 ${accuracy * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
            }}>
              <div className="w-24 h-24 rounded-full bg-museum-900 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {Math.round(accuracy)}%
                </span>
              </div>
            </div>

            <p className={`text-xl font-bold mb-6 ${judgment.color}`}>
              {judgment.text}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-museum-300/60 text-sm mb-1">你的估计</p>
                <p className="text-2xl font-bold text-neon-blue">
                  {userEstimate.toFixed(2)} 秒
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-museum-300/60 text-sm mb-1">目标时间</p>
                <p className="text-2xl font-bold text-neon-green">
                  {targetTime}.00 秒
                </p>
              </div>
            </div>

            <div className="bg-neon-purple/10 border border-neon-purple/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-museum-200/80 text-sm leading-relaxed">
                每个人的时间感都不同。情绪、注意力、年龄——
                许多因素都会影响我们对时间的感知。
                你觉得你的时间感是偏快还是偏慢呢？
              </p>
            </div>

            <p className="text-museum-300/60 text-sm">
              即将展示原理解释...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
