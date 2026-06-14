import type { SubmitAnswerResponse, FunFact, Question } from '../../shared/types';
import { getQuestionById, getRandomFact, getRandomQuestion } from '../data/store';

const CORRECT_TEMP_CHANGE = 15;
const WRONG_TEMP_CHANGE = -25;
const UNLOCK_THRESHOLD = 100;
const MIN_TEMP = 0;
const RESET_TEMP = 50;

export function processAnswer(
  questionId: string,
  selectedIndex: number,
  currentTemperature: number
): SubmitAnswerResponse {
  const question = getQuestionById(questionId);
  
  if (!question) {
    return {
      isCorrect: false,
      correctIndex: -1,
      explanation: '题目不存在',
      newTemperature: currentTemperature,
      shouldUnlock: false,
      gameOver: false,
    };
  }

  const isCorrect = selectedIndex === question.correctIndex;
  let newTemperature = currentTemperature + (isCorrect ? CORRECT_TEMP_CHANGE : WRONG_TEMP_CHANGE);
  newTemperature = Math.max(MIN_TEMP, newTemperature);

  const gameOver = newTemperature <= MIN_TEMP;
  const shouldUnlock = !gameOver && newTemperature >= UNLOCK_THRESHOLD;

  let unlockedFact: FunFact | undefined;
  let nextQuestion: Question | null = null;

  if (shouldUnlock) {
    unlockedFact = getRandomFact(question.chemistId) ?? undefined;
    newTemperature = RESET_TEMP;
  }

  if (!gameOver) {
    nextQuestion = getRandomQuestion(question.chemistId);
  }

  return {
    isCorrect,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    newTemperature,
    shouldUnlock,
    gameOver,
    unlockedFact,
    nextQuestion: nextQuestion ?? undefined,
  };
}
