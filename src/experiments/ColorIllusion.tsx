import { useState, useRef, useEffect } from "react";
import { Check, X, Eye, HelpCircle } from "lucide-react";

interface ColorIllusionProps {
  onComplete: () => void;
}

export default function ColorIllusion({ onComplete }: ColorIllusionProps) {
  const [step, setStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState<"same" | "different" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    const cols = 8;
    const cellSize = size / cols;

    ctx.clearRect(0, 0, size, size);

    const grayLight = "#d0d0d0";
    const grayDark = "#707070";
    const targetColor = "#909090";

    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < cols; col++) {
        const isLight = (row + col) % 2 === 0;
        ctx.fillStyle = isLight ? grayLight : grayDark;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }

    ctx.fillStyle = targetColor;
    ctx.fillRect(1 * cellSize, 1 * cellSize, cellSize, cellSize);

    ctx.fillStyle = targetColor;
    ctx.fillRect(5 * cellSize, 5 * cellSize, cellSize, cellSize);

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(3 * cellSize, 0);
    ctx.lineTo(8 * cellSize, 5 * cellSize);
    ctx.lineTo(8 * cellSize, 8 * cellSize);
    ctx.lineTo(5 * cellSize, 8 * cellSize);
    ctx.lineTo(0, 3 * cellSize);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", 1.5 * cellSize, 1.5 * cellSize);
    ctx.fillText("B", 5.5 * cellSize, 5.5 * cellSize);
  }, []);

  const handleAnswer = (answer: "same" | "different") => {
    setUserAnswer(answer);
    setShowAnswer(true);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const isCorrect = userAnswer === "same";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-6">
          仔细观察方块 A 和方块 B
        </h3>

        <div className="relative inline-block mb-8 rounded-xl overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="block max-w-full h-auto"
          />

          {showAnswer && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isCorrect ? "bg-neon-green/20" : "bg-neon-pink/20"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-8 h-8 text-neon-green" />
                  ) : (
                    <X className="w-8 h-8 text-neon-pink" />
                  )}
                </div>
                <p className="text-white text-lg font-bold">
                  {isCorrect ? "答对了！" : "这是错觉哦~"}
                </p>
                <p className="text-museum-200/70 text-sm mt-2">
                  两个方块的颜色实际上完全相同
                </p>
              </div>
            </div>
          )}
        </div>

        {!showAnswer && (
          <>
            <p className="text-museum-200/80 mb-6">
              你认为方块 A 和方块 B 的颜色是一样的吗？
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAnswer("same")}
                className="btn-secondary gap-2"
              >
                <Eye className="w-4 h-4" />
                颜色相同
              </button>
              <button
                onClick={() => handleAnswer("different")}
                className="btn-primary gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                颜色不同
              </button>
            </div>
          </>
        )}

        {showAnswer && (
          <p className="text-museum-300/60 text-sm mt-4">
            即将展示原理解释...
          </p>
        )}
      </div>

      <div className="mt-6 text-center text-museum-300/50 text-sm">
        提示：阴影和周围环境会影响我们对颜色的感知
      </div>
    </div>
  );
}
