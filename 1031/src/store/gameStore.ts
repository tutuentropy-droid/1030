import { create } from 'zustand';
import type { Chemist, Question, FunFact, GameStatus, SubmitAnswerResponse } from '../../shared/types';

interface GameState {
  selectedChemist: Chemist | null;
  currentQuestion: Question | null;
  temperature: number;
  gameStatus: GameStatus;
  unlockedFacts: FunFact[];
  currentFact: FunFact | null;
  lastAnswerResult: SubmitAnswerResponse | null;
  selectedAnswer: number | null;
  isSmoking: boolean;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;

  selectChemist: (chemist: Chemist) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setTemperature: (temp: number) => void;
  setGameStatus: (status: GameStatus) => void;
  setSelectedAnswer: (index: number | null) => void;
  setIsSmoking: (smoking: boolean) => void;
  setLastAnswerResult: (result: SubmitAnswerResponse | null) => void;
  unlockFact: (fact: FunFact) => void;
  setCurrentFact: (fact: FunFact | null) => void;
  incrementScore: (points: number) => void;
  incrementQuestionsAnswered: (correct: boolean) => void;
  resetGame: () => void;
}

const INITIAL_TEMPERATURE = 50;

export const useGameStore = create<GameState>((set) => ({
  selectedChemist: null,
  currentQuestion: null,
  temperature: INITIAL_TEMPERATURE,
  gameStatus: 'idle',
  unlockedFacts: [],
  currentFact: null,
  lastAnswerResult: null,
  selectedAnswer: null,
  isSmoking: false,
  score: 0,
  questionsAnswered: 0,
  correctAnswers: 0,

  selectChemist: (chemist) => set({ selectedChemist: chemist }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setTemperature: (temp) => set({ temperature: temp }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setSelectedAnswer: (index) => set({ selectedAnswer: index }),
  setIsSmoking: (smoking) => set({ isSmoking: smoking }),
  setLastAnswerResult: (result) => set({ lastAnswerResult: result }),
  unlockFact: (fact) => set((state) => ({
    unlockedFacts: [...state.unlockedFacts, fact],
    currentFact: fact,
  })),
  setCurrentFact: (fact) => set({ currentFact: fact }),
  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  incrementQuestionsAnswered: (correct) => set((state) => ({
    questionsAnswered: state.questionsAnswered + 1,
    correctAnswers: state.correctAnswers + (correct ? 1 : 0),
  })),
  resetGame: () => set({
    selectedChemist: null,
    currentQuestion: null,
    temperature: INITIAL_TEMPERATURE,
    gameStatus: 'idle',
    currentFact: null,
    lastAnswerResult: null,
    selectedAnswer: null,
    isSmoking: false,
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
  }),
}));
