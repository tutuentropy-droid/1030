import type { FunFact } from '../../shared/types';
import { getRandomFact, funFacts } from '../data/store';

export function getRandomFunFact(chemistId?: string): FunFact | null {
  return getRandomFact(chemistId);
}

export function getFunFactsByChemist(chemistId: string): FunFact[] {
  return funFacts.filter(f => f.chemistId === chemistId);
}
