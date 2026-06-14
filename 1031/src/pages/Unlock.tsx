import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Home, ArrowRight, Trophy, BookOpen, Sparkles } from 'lucide-react';

const Unlock: React.FC = () => {
  const navigate = useNavigate();
  const { currentFact, selectedChemist, unlockedFacts, setCurrentFact, setGameStatus, setSelectedAnswer, setLastAnswerResult, setCurrentQuestion } = useGameStore();
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (!currentFact) {
      navigate('/game');
      return;
    }

    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentFact, navigate]);

  useEffect(() => {
    if (showContent && currentFact) {
      let index = 0;
      const text = currentFact.content;
      const interval = setInterval(() => {
        if (index < text.length) {
          setTypedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [showContent, currentFact]);

  const handleContinue = async () => {
    if (!selectedChemist) return;

    try {
      const response = await fetch(`/api/questions/chemist/${selectedChemist.id}`);
      const nextQuestion = await response.json();
      
      setCurrentQuestion(nextQuestion);
      setCurrentFact(null);
      setSelectedAnswer(null);
      setLastAnswerResult(null);
      setGameStatus('playing');
      navigate('/game');
    } catch (error) {
      console.error('Failed to load next question:', error);
      navigate('/game');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!currentFact) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-alchemy-darkBrown via-alchemy-brown to-alchemy-darkBrown py-8 px-4 flex items-center justify-center noise-overlay">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8 fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-alchemy-emerald to-alchemy-copper mb-6 animate-unlock">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-alchemy-copper text-shadow-glow mb-2">
            冷知识解锁！
          </h1>
          <p className="text-alchemy-copperLight text-lg">
            恭喜你发现了一个化学史上的有趣故事
          </p>
        </div>

        <div className={`relative transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="parchment-bg rounded-lg shadow-2xl overflow-hidden border-4 border-alchemy-copper noise-overlay">
            <div className="bg-gradient-to-r from-alchemy-copper via-alchemy-copperLight to-alchemy-copper p-4">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-alchemy-brown" />
                <h2 className="text-2xl md:text-3xl font-display font-bold text-alchemy-darkBrown">
                  {currentFact.title}
                </h2>
                <Sparkles className="w-6 h-6 text-alchemy-brown" />
              </div>
              {currentFact.year && (
                <p className="text-center text-alchemy-brown/70 mt-1 font-display">
                  {currentFact.year}年
                </p>
              )}
            </div>

            <div className="scroll-decoration my-2" />

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-alchemy-copper/20 rounded-lg flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-alchemy-copper" />
                </div>
                <div className="flex-1">
                  <p className="text-xl md:text-2xl text-alchemy-darkBrown leading-relaxed font-body">
                    {typedText}
                    <span className="inline-block w-1 h-6 bg-alchemy-flame ml-1 animate-pulse" />
                  </p>
                </div>
              </div>

              {currentFact.chemistId && (
                <div className="mt-6 flex items-center justify-center gap-2 text-alchemy-brown/70">
                  <span className="text-2xl">{selectedChemist?.avatar}</span>
                  <span className="font-display">—— {selectedChemist?.name}</span>
                </div>
              )}
            </div>

            <div className="scroll-decoration rotate-180 my-2" />

            <div className="bg-alchemy-copper/20 p-4">
              <div className="flex items-center justify-center gap-2 text-alchemy-brown">
                <Trophy className="w-5 h-5" />
                <span className="font-display">
                  已解锁 {unlockedFacts.length} 条冷知识
                </span>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-alchemy-emerald rounded-tl-lg" />
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-alchemy-emerald rounded-tr-lg" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-alchemy-emerald rounded-bl-lg" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-alchemy-emerald rounded-br-lg" />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up stagger-2">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-alchemy-copper text-alchemy-copper font-display text-lg hover:bg-alchemy-copper/10 transition-colors"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-4 brass-button rounded-lg text-alchemy-darkBrown font-display text-xl hover:scale-105 transition-transform"
          >
            继续炼金
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {unlockedFacts.length > 1 && (
          <div className="mt-8 p-6 bg-alchemy-copper/10 rounded-lg border border-alchemy-copper/30 fade-in-up stagger-3">
            <h3 className="text-lg font-display text-alchemy-copper mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-alchemy-emerald" />
              已解锁的冷知识
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unlockedFacts.map((fact, index) => (
                <div
                  key={fact.id}
                  className={`p-3 rounded-lg border transition-all ${
                    fact.id === currentFact.id
                      ? 'bg-alchemy-emerald/20 border-alchemy-emerald/50'
                      : 'bg-alchemy-copper/10 border-alchemy-copper/30'
                  }`}
                >
                  <div className="font-display text-sm text-alchemy-copperLight mb-1">
                    #{index + 1} {fact.title}
                  </div>
                  <p className="text-xs text-alchemy-copperDark line-clamp-2">
                    {fact.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unlock;
