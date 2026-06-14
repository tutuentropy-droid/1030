import type { Question } from '../../shared/types';
import { getRandomQuestion, getQuestionById, getQuestionsByChemist } from '../data/store';

export function getQuestionForChemist(chemistId: string): Question | null {
  return getRandomQuestion(chemistId);
}

export function getQuestion(id: string): Question | undefined {
  return getQuestionById(id);
}

export function listQuestions(chemistId: string): Question[] {
  return getQuestionsByChemist(chemistId);
}
