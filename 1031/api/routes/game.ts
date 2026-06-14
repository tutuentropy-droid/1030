import { Router } from 'express';
import { processAnswer } from '../services/gameService';
import type { SubmitAnswerRequest } from '../../shared/types';

const router = Router();

router.post('/submit-answer', (req, res) => {
  const { questionId, selectedIndex, currentTemperature } = req.body as SubmitAnswerRequest;
  
  if (typeof questionId !== 'string' || typeof selectedIndex !== 'number' || typeof currentTemperature !== 'number') {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const result = processAnswer(questionId, selectedIndex, currentTemperature);
  res.json(result);
});

export default router;
