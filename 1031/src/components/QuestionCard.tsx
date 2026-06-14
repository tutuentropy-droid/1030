import React from 'react';
import type { Question } from '../../shared/types';
import { useGameStore } from '@/store/gameStore';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (index: number) => void;
  disabled?: boolean;
  selectedIndex?: number | null;
  correctIndex?: number;
  showExplanation?: boolean;
  explanation?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  disabled = false,
  selectedIndex = null,
  correctIndex = -1,
  showExplanation = false,
  explanation = '',
}) => {
  const { gameStatus } = useGameStore();

  const getOptionStyle = (index: number) => {
    if (gameStatus !== 'answered') {
      return 'hover:border-alchemy-flame hover:shadow-lg hover:shadow-alchemy-flame/20';
    }
    
    if (index === correctIndex) {
      return 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/30';
    }
    
    if (index === selectedIndex && index !== correctIndex) {
      return 'border-red-500 bg-red-500/20 shadow-lg shadow-red-500/30';
    }
    
    return 'opacity-50';
  };

  const getOptionIcon = (index: number) => {
    if (gameStatus !== 'answered') return null;
    
    if (index === correctIndex) {
      return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
    }
    
    if (index === selectedIndex && index !== correctIndex) {
      return <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto fade-in-up">
      <div className="parchment-bg rounded-lg p-6 md:p-8 shadow-2xl border-4 border-alchemy-copperDark noise-overlay">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-alchemy-copper/20 rounded-lg">
            <BookOpen className="w-6 h-6 text-alchemy-copper" />
          </div>
          <div>
            <h3 className="text-lg font-display text-alchemy-brown mb-1">配方配平挑战</h3>
            <p className="text-sm text-alchemy-brown/70">选择正确的答案来维持反应炉的温度</p>
          </div>
        </div>

        <div className="scroll-decoration pt-4 mb-6">
          <p className="text-lg md:text-xl font-semibold text-alchemy-darkBrown leading-relaxed">
            {question.description}
          </p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
              className={`option-card w-full text-left p-4 rounded-lg border-2 border-alchemy-copper/50 bg-alchemy-parchment/50 transition-all duration-300 flex items-center gap-3 min-h-[60px] ${getOptionStyle(index)} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="w-8 h-8 flex items-center justify-center bg-alchemy-copper/30 rounded-full text-alchemy-darkBrown font-bold text-sm flex-shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-alchemy-darkBrown font-medium">{option}</span>
              {getOptionIcon(index)}
            </button>
          ))}
        </div>

        {showExplanation && explanation && (
          <div className="mt-6 p-4 bg-alchemy-copper/20 rounded-lg border border-alchemy-copper/50 fade-in-up stagger-2">
            <h4 className="font-display text-alchemy-brown mb-2 flex items-center gap-2">
              <span>📜</span> 历史解析
            </h4>
            <p className="text-alchemy-darkBrown/80 leading-relaxed">{explanation}</p>
          </div>
        )}

        {showExplanation && question.historicalContext && (
          <div className="mt-4 p-4 bg-alchemy-flame/10 rounded-lg border border-alchemy-flame/30 fade-in-up stagger-3">
            <h4 className="font-display text-alchemy-flame mb-2 flex items-center gap-2">
              <span>🏛️</span> 历史背景
            </h4>
            <p className="text-alchemy-darkBrown/80 leading-relaxed italic">{question.historicalContext}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
