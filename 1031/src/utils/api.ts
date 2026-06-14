import type { Chemist, Question, FunFact, SubmitAnswerRequest, SubmitAnswerResponse } from '../../shared/types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export const api = {
  getChemists: (): Promise<Chemist[]> => 
    fetchJson<Chemist[]>('/chemists'),

  getChemist: (id: string): Promise<Chemist> => 
    fetchJson<Chemist>(`/chemists/${id}`),

  getQuestion: (chemistId: string): Promise<Question> => 
    fetchJson<Question>(`/questions/chemist/${chemistId}`),

  getAllQuestions: (chemistId: string): Promise<Question[]> => 
    fetchJson<Question[]>(`/questions/chemist/${chemistId}/all`),

  getQuestionById: (id: string): Promise<Question> => 
    fetchJson<Question>(`/questions/${id}`),

  submitAnswer: (data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => 
    fetchJson<SubmitAnswerResponse>('/game/submit-answer', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getRandomFact: (chemistId?: string): Promise<FunFact> => 
    fetchJson<FunFact>(`/fun-facts/random${chemistId ? `?chemistId=${chemistId}` : ''}`),

  getFactsByChemist: (chemistId: string): Promise<FunFact[]> => 
    fetchJson<FunFact[]>(`/fun-facts/chemist/${chemistId}`),
};
