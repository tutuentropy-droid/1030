import { useState, useEffect, useCallback } from "react";
import { Brain, Check, X, HelpCircle } from "lucide-react";

interface MemoryIllusionProps {
  onComplete: () => void;
}

const studyWords = [
  "床", "梦", "枕头", "毛毯", "睡眠", "打盹", "打鼾", "午睡",
  "睡衣", "眼罩", "闹钟", "困倦", "哈欠", "梦游", "摇篮曲",
];

const testWords = [
  { word: "梦", isStudy: true },
  { word: "枕头", isStudy: true },
  { word: "睡眠", isStudy: true },
  { word: "休息", isStudy: false },
  { word: "困倦", isStudy: true },
  { word: "闹钟", isStudy: true },
  { word: "床", isStudy: true },
  { word: "瞌睡", isStudy: false },
  { word: "打鼾", isStudy: true },
  { word: "午睡", isStudy: true },
  { word: "做梦", isStudy: false },
  { word: "眼罩", isStudy: true },
];

export default function MemoryIllusion({ onComplete }: MemoryIllusionProps) {
  const [phase, setPhase] = useState<"intro" | "study" | "delay" | "test" | "result">("intro");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [testIndex, setTestIndex] = useState(0);
  const [answers, setAnswers] = useState<{ word: string; userAnswer: boolean; correct: boolean; isStudy: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);

  const startStudy = () => {
    setPhase("study");
    setCurrentWordIndex(0);
  };

  useEffect(() => {
    if (phase === "study" && currentWordIndex < studyWords.length) {
      const timer = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (phase === "study" && currentWordIndex >= studyWords.length) {
      setPhase("delay");
    }
  }, [phase, currentWordIndex]);

  useEffect(() => {
    if (phase === "delay") {
      const timer = setTimeout(() => {
        setPhase("test");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleAnswer = useCallback((answer: boolean) => {
    const currentTestWord = testWords[testIndex];
    const isCorrect = answer === currentTestWord.isStudy;

    setAnswers((prev) => [
      ...prev,
      {
        word: currentTestWord.word,
        userAnswer: answer,
        correct: isCorrect,
        isStudy: currentTestWord.isStudy,
      },
    ]);

    if (testIndex < testWords.length - 1) {
      setTestIndex((prev) => prev + 1);
    } else {
      setPhase("result");
      setTimeout(() => {
        setShowResult(true);
        setTimeout(() => {
          onComplete();
        }, 4000);
      }, 500);
    }
  }, [testIndex, onComplete]);

  const correctCount = answers.filter((a) => a.correct).length;
  const falseMemoryCount = answers.filter((a) => !a.isStudy && a.userAnswer).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 text-center">
        {phase === "intro" && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-neon-pink/20 flex items-center justify-center mx-auto mb-6 glow-pink">
              <Brain className="w-10 h-10 text-neon-pink" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              记忆测试
            </h3>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              接下来，你会看到一系列词语。
              <br />
              请努力记住它们，但不要做笔记。
              <br />
              稍后我们会测试你的记忆力。
            </p>
            <p className="text-museum-300/60 text-sm mb-8">
              每个词语会显示 1.5 秒
            </p>
            <button onClick={startStudy} className="btn-primary">
              开始记忆
            </button>
          </>
        )}

        {phase === "study" && currentWordIndex < studyWords.length && (
          <div className="py-16">
            <p className="text-museum-300/60 text-sm mb-8">
              第 {currentWordIndex + 1} / {studyWords.length} 个词
            </p>
            <div className="text-5xl md:text-6xl font-display font-bold text-white animate-fade-in py-8">
              {studyWords[currentWordIndex]}
            </div>
            <p className="text-museum-300/50 text-sm mt-8">
              请记住这个词
            </p>
          </div>
        )}

        {phase === "delay" && (
          <div className="py-16">
            <p className="text-xl text-museum-200/80 mb-4">
              准备好接受测试了吗？
            </p>
            <p className="text-museum-300/60">
              请回忆刚才看到的词语...
            </p>
            <div className="mt-8 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-neon-purple animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "test" && (
          <div>
            <p className="text-museum-300/60 text-sm mb-2">
              第 {testIndex + 1} / {testWords.length} 题
            </p>
            <div className="w-full h-2 bg-museum-800 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-purple to-neon-pink transition-all duration-300"
                style={{ width: `${((testIndex) / testWords.length) * 100}%` }}
              />
            </div>

            <div className="text-4xl md:text-5xl font-display font-bold text-white py-8 mb-6">
              {testWords[testIndex].word}
            </div>

            <p className="text-museum-200/70 mb-6">
              这个词在之前出现过吗？
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAnswer(false)}
                className="btn-secondary gap-2"
              >
                <X className="w-4 h-4" />
                没有出现
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="btn-primary gap-2"
              >
                <Check className="w-4 h-4" />
                出现过
              </button>
            </div>
          </div>
        )}

        {phase === "result" && showResult && (
          <div className="animate-slide-up">
            <h3 className="text-2xl font-bold text-white mb-6">
              测试结果
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-4">
                <div className="text-3xl font-bold text-neon-blue mb-1">
                  {correctCount}/{testWords.length}
                </div>
                <p className="text-museum-300/60 text-sm">正确率</p>
              </div>
              <div className="glass-card p-4">
                <div className="text-3xl font-bold text-neon-pink mb-1">
                  {falseMemoryCount}
                </div>
                <p className="text-museum-300/60 text-sm">错误记忆</p>
              </div>
            </div>

            <div className="text-left space-y-2 mb-6 max-h-48 overflow-y-auto">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    answer.correct
                      ? "bg-neon-green/10 border border-neon-green/20"
                      : "bg-neon-pink/10 border border-neon-pink/20"
                  }`}
                >
                  <span className="font-medium text-white">{answer.word}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={answer.correct ? "text-neon-green" : "text-neon-pink"}>
                      {answer.userAnswer ? "你说有" : "你说没有"}
                    </span>
                    <span className="text-museum-300/50">|</span>
                    <span className="text-museum-300/70">
                      {answer.isStudy ? "实际有" : "实际没有"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {falseMemoryCount > 0 && (
              <div className="bg-neon-pink/10 border border-neon-pink/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-neon-pink flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-neon-pink font-medium mb-1">
                      你产生了错误记忆！
                    </p>
                    <p className="text-museum-200/70 text-sm">
                      你的大脑根据词语的关联性，"创造"出了一些实际上没有出现过的记忆。
                      这就是著名的 DRM 错觉效应。
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-museum-300/60 text-sm">
              即将展示原理解释...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
