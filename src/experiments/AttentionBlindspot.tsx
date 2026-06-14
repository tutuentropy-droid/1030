import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, Play, Check, HelpCircle, X } from "lucide-react";

interface AttentionBlindspotProps {
  onComplete: () => void;
}

interface Person {
  id: number;
  team: "white" | "black";
  x: number;
  y: number;
  vx: number;
  vy: number;
  hasBall: boolean;
}

export default function AttentionBlindspot({ onComplete }: AttentionBlindspotProps) {
  const [phase, setPhase] = useState<"intro" | "playing" | "count" | "result">("intro");
  const [userCount, setUserCount] = useState(0);
  const [actualCount, setActualCount] = useState(0);
  const [sawGorilla, setSawGorilla] = useState<boolean | null>(null);
  const [showGorillaQuestion, setShowGorillaQuestion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const peopleRef = useRef<Person[]>([]);
  const passCountRef = useRef(0);
  const gorillaRef = useRef({ x: -50, y: 200, active: false, direction: 1 });
  const gameTimeRef = useRef(0);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    const people: Person[] = [];
    for (let i = 0; i < 3; i++) {
      people.push({
        id: i,
        team: "white",
        x: Math.random() * (w - 80) + 40,
        y: Math.random() * (h - 80) + 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        hasBall: i === 0,
      });
    }
    for (let i = 3; i < 6; i++) {
      people.push({
        id: i,
        team: "black",
        x: Math.random() * (w - 80) + 40,
        y: Math.random() * (h - 80) + 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        hasBall: false,
      });
    }

    peopleRef.current = people;
    passCountRef.current = 0;
    gameTimeRef.current = 0;
    gorillaRef.current = { x: -50, y: h / 2, active: false, direction: 1 };
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initGame();

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      gameTimeRef.current += 16;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(26, 26, 62, 0.3)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(157, 78, 221, 0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      if (gameTimeRef.current > 8000 && gameTimeRef.current < 16000) {
        gorillaRef.current.active = true;
        gorillaRef.current.x += 1.2;
        gorillaRef.current.y = h / 2 + Math.sin(gameTimeRef.current * 0.001) * 30;
      } else {
        gorillaRef.current.active = false;
      }

      peopleRef.current.forEach((person) => {
        person.x += person.vx;
        person.y += person.vy;

        if (person.x < 40 || person.x > w - 40) person.vx *= -1;
        if (person.y < 40 || person.y > h - 40) person.vy *= -1;

        ctx.beginPath();
        ctx.arc(person.x, person.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = person.team === "white" ? "#ffffff" : "#2a2a4a";
        ctx.fill();
        ctx.strokeStyle = person.team === "white" ? "#9d4edd" : "#00d4ff";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(person.x, person.y - 10, 15, 0, Math.PI * 2);
        ctx.fillStyle = person.team === "white" ? "#f0f0ff" : "#1a1a3a";
        ctx.fill();

        if (person.hasBall) {
          ctx.beginPath();
          ctx.arc(person.x + 20, person.y - 5, 10, 0, Math.PI * 2);
          ctx.fillStyle = "#ffbe0b";
          ctx.fill();
          ctx.strokeStyle = "#ff9500";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      const whitePlayers = peopleRef.current.filter((p) => p.team === "white");
      if (whitePlayers.length >= 2 && Math.random() < 0.005) {
        const ballHolder = whitePlayers.find((p) => p.hasBall);
        if (ballHolder) {
          const others = whitePlayers.filter((p) => !p.hasBall);
          if (others.length > 0) {
            const newHolder = others[Math.floor(Math.random() * others.length)];
            ballHolder.hasBall = false;
            newHolder.hasBall = true;
            passCountRef.current += 1;
          }
        }
      }

      if (gorillaRef.current.active) {
        const gx = gorillaRef.current.x;
        const gy = gorillaRef.current.y;

        ctx.beginPath();
        ctx.ellipse(gx, gy, 30, 35, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#2a2a2a";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(gx, gy - 30, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#2a2a2a";
        ctx.fill();

        ctx.fillStyle = "#8b4513";
        ctx.beginPath();
        ctx.ellipse(gx - 18, gy - 35, 8, 12, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(gx + 18, gy - 35, 8, 12, 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffbe0b";
        ctx.beginPath();
        ctx.arc(gx - 7, gy - 32, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(gx + 7, gy - 32, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(gx - 7, gy - 32, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(gx + 7, gy - 32, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(gx, gy - 22, 6, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      }

      if (gameTimeRef.current < 25000) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setActualCount(passCountRef.current);
        setPhase("count");
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, initGame]);

  const handleStart = () => {
    setPhase("playing");
  };

  const handleSubmitCount = () => {
    setShowGorillaQuestion(true);
  };

  const handleGorillaAnswer = (saw: boolean) => {
    setSawGorilla(saw);
    setPhase("result");
    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 text-center">
        {phase === "intro" && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-neon-yellow/20 flex items-center justify-center mx-auto mb-6">
              <Eye className="w-10 h-10 text-neon-yellow" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              注意力测试
            </h3>
            <p className="text-museum-200/80 mb-4 leading-relaxed">
              接下来你会看到 6 个人在传球。
            </p>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              你的任务是：<span className="text-neon-yellow font-bold">数清楚穿白色衣服的人传了多少次球</span>
            </p>
            <p className="text-museum-300/60 text-sm mb-8">
              动画持续约 25 秒，请保持专注
            </p>
            <button onClick={handleStart} className="btn-primary gap-2">
              <Play className="w-5 h-5" />
              开始观看
            </button>
          </>
        )}

        {phase === "playing" && (
          <div>
            <p className="text-museum-200/80 mb-4">
              专注数<span className="text-neon-yellow font-bold">白色衣服</span>的传球次数
            </p>
            <div className="rounded-xl overflow-hidden shadow-2xl glow-purple">
              <canvas
                ref={canvasRef}
                width={500}
                height={350}
                className="w-full block bg-museum-900"
              />
            </div>
            <p className="text-museum-300/50 text-sm mt-4">
              保持专注...
            </p>
          </div>
        )}

        {phase === "count" && !showGorillaQuestion && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6">
              你数到了多少次传球？
            </h3>
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setUserCount(Math.max(0, userCount - 1))}
                className="w-12 h-12 rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
              >
                -
              </button>
              <div className="text-5xl font-bold gradient-text w-20 text-center">
                {userCount}
              </div>
              <button
                onClick={() => setUserCount(userCount + 1)}
                className="w-12 h-12 rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
              >
                +
              </button>
            </div>
            <button onClick={handleSubmitCount} className="btn-primary">
              确认答案
            </button>
          </div>
        )}

        {phase === "count" && showGorillaQuestion && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-4">
              顺便问一下...
            </h3>
            <p className="text-museum-200/80 mb-6">
              你在视频中看到一只大猩猩了吗？
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleGorillaAnswer(false)}
                className="btn-secondary gap-2"
              >
                <X className="w-4 h-4" />
                没有看到
              </button>
              <button
                onClick={() => handleGorillaAnswer(true)}
                className="btn-primary gap-2"
              >
                <Check className="w-4 h-4" />
                看到了
              </button>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="animate-slide-up">
            <h3 className="text-2xl font-bold text-white mb-6">
              结果揭晓
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-museum-300/60 text-sm mb-1">你的计数</p>
                <p className="text-3xl font-bold text-neon-blue">{userCount}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-museum-300/60 text-sm mb-1">实际次数</p>
                <p className="text-3xl font-bold text-neon-green">{actualCount}</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-6 ${
              sawGorilla
                ? "bg-neon-green/10 border border-neon-green/30"
                : "bg-neon-pink/10 border border-neon-pink/30"
            }`}>
              <div className="flex items-start gap-3">
                <HelpCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  sawGorilla ? "text-neon-green" : "text-neon-pink"
                }`} />
                <div className="text-left">
                  <p className={`font-medium mb-1 ${
                    sawGorilla ? "text-neon-green" : "text-neon-pink"
                  }`}>
                    {sawGorilla ? "你发现了大猩猩！" : "你错过了大猩猩！"}
                  </p>
                  <p className="text-museum-200/70 text-sm">
                    {sawGorilla
                      ? "你的注意力分配能力很强！但大多数人在专注数数时都会错过它。"
                      : "别担心，大约有一半的人都看不到。这就是著名的'非注意盲视'现象。"}
                  </p>
                </div>
              </div>
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
