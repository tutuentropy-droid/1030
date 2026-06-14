import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Eye } from "lucide-react";

interface MotionIllusionProps {
  onComplete: () => void;
}

export default function MotionIllusion({ onComplete }: MotionIllusionProps) {
  const [phase, setPhase] = useState<"instruction" | "watching" | "aftereffect" | "done">("instruction");
  const [watchTime, setWatchTime] = useState(30);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (phase === "watching") {
      const animate = (time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const delta = time - lastTimeRef.current;
        lastTimeRef.current = time;

        setRotation((prev) => prev + delta * 0.05);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);

      const timer = setInterval(() => {
        setWatchTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase("aftereffect");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        clearInterval(timer);
        lastTimeRef.current = 0;
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "aftereffect") {
      const timer = setTimeout(() => {
        setPhase("done");
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleStart = () => {
    setPhase("watching");
    setWatchTime(30);
  };

  const handleRestart = () => {
    setPhase("instruction");
    setWatchTime(30);
    setRotation(0);
  };

  const renderSpiral = (isRotating: boolean) => {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <radialGradient id="spiralGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9d4edd" />
            <stop offset="100%" stopColor="#1a1a3e" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="#0f0f24" />
        <g style={{
          transformOrigin: "center",
          transform: isRotating ? `rotate(${rotation}deg)` : "none",
        }}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} style={{ transformOrigin: "center", transform: `rotate(${i * 90}deg)` }}>
              <path
                d="M200,200 Q280,180 300,100 Q250,150 200,200"
                fill="#9d4edd"
                opacity="0.8"
              />
              <path
                d="M200,200 Q260,250 280,320 Q220,280 200,200"
                fill="#00d4ff"
                opacity="0.8"
              />
            </g>
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle
              key={`dot-${i}`}
              cx={200 + 120 * Math.cos((i * Math.PI) / 4 + rotation * 0.02)}
              cy={200 + 120 * Math.sin((i * Math.PI) / 4 + rotation * 0.02)}
              r="8"
              fill={i % 2 === 0 ? "#ff006e" : "#06ffa5"}
              style={{
                filter: "blur(2px)",
              }}
            />
          ))}
        </g>
        <circle cx="200" cy="200" r="6" fill="#ffffff" />
        <circle cx="200" cy="200" r="3" fill="#1a1a3e" />
      </svg>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 text-center">
        {phase === "instruction" && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-neon-blue/20 flex items-center justify-center mx-auto mb-6 glow-blue">
              <Eye className="w-10 h-10 text-neon-blue" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              运动后效实验
            </h3>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              接下来，请盯着下方旋转图案的中心点看 30 秒。
              <br />
              时间到后，我们会切换到一个静止的图案，
              <br />
              看看你会有什么奇妙的发现！
            </p>
            <p className="text-museum-300/60 text-sm mb-8">
              提示：尽量保持视线固定在中心点上
            </p>
            <button onClick={handleStart} className="btn-primary gap-2">
              <Play className="w-5 h-5" />
              开始 30 秒倒计时
            </button>
          </>
        )}

        {phase === "watching" && (
          <>
            <div className="mb-4">
              <div className="text-4xl font-bold gradient-text font-mono">
                {watchTime}
              </div>
              <p className="text-museum-300/60 text-sm mt-1">
                请保持视线在中心点
              </p>
            </div>
            <div className="w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl glow-purple">
              {renderSpiral(true)}
            </div>
            <p className="text-museum-300/50 text-sm mt-6">
              专注地看着中心的白点
            </p>
          </>
        )}

        {phase === "aftereffect" && (
          <>
            <div className="mb-4">
              <p className="text-xl font-bold text-neon-purple">
                现在看这个静止的图案...
              </p>
              <p className="text-museum-200/70 text-sm mt-2">
                你感觉到它在向反方向旋转吗？
              </p>
            </div>
            <div className="w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <circle cx="200" cy="200" r="200" fill="#0f0f24" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={30 + i * 25}
                    fill="none"
                    stroke="#9d4edd"
                    strokeWidth="2"
                    opacity={0.3 + i * 0.1}
                  />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <circle
                    key={`dot-${i}`}
                    cx={200 + 100 * Math.cos((i * Math.PI) / 4)}
                    cy={200 + 100 * Math.sin((i * Math.PI) / 4)}
                    r="6"
                    fill="#ffffff"
                    opacity="0.6"
                  />
                ))}
                <circle cx="200" cy="200" r="6" fill="#ffffff" />
                <circle cx="200" cy="200" r="3" fill="#1a1a3e" />
              </svg>
            </div>
          </>
        )}

        {phase === "done" && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-neon-purple/20 flex items-center justify-center mx-auto mb-6 glow-purple">
              <Eye className="w-10 h-10 text-neon-purple" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              体验完成！
            </h3>
            <p className="text-museum-200/80">
              这就是著名的"运动后效"现象 ——
              <br />
              大脑的运动神经元在长时间刺激后产生了适应，
              <br />
              导致你看到静止的物体也在"运动"。
            </p>
            <p className="text-museum-300/60 text-sm mt-4">
              即将查看原理解释...
            </p>
          </>
        )}

        {phase !== "instruction" && phase !== "done" && (
          <button
            onClick={handleRestart}
            className="mt-6 text-museum-300/60 text-sm hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            重新开始
          </button>
        )}
      </div>
    </div>
  );
}
