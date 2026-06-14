import type { Chemist } from '../../shared/types';
import { chemists, getChemistById } from '../data/store';

export function getAllChemists(): Chemist[] {
  return chemists;
}

export function getChemist(id: string): Chemist | undefined {
  return getChemistById(id);
}
