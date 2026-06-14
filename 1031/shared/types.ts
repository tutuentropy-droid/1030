export interface Chemist {
  id: string;
  name: string;
  era: string;
  description: string;
  avatar: string;
}

export interface Question {
  id: string;
  chemistId: string;
  description: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  historicalContext: string;
}

export interface FunFact {
  id: string;
  chemistId: string;
  title: string;
  content: string;
  year?: number;
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedIndex: number;
  currentTemperature: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
  newTemperature: number;
  shouldUnlock: boolean;
  gameOver: boolean;
  unlockedFact?: FunFact;
  nextQuestion?: Question;
}

export type GameStatus = 'idle' | 'playing' | 'answered' | 'unlock' | 'gameover';
