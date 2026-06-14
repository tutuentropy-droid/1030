import { Router } from 'express';
import { getQuestionForChemist, getQuestion, listQuestions } from '../services/questionService';

const router = Router();

router.get('/chemist/:chemistId', (req, res) => {
  const question = getQuestionForChemist(req.params.chemistId);
  if (!question) {
    res.status(404).json({ error: 'No questions available' });
    return;
  }
  res.json(question);
});

router.get('/chemist/:chemistId/all', (req, res) => {
  const questions = listQuestions(req.params.chemistId);
  res.json(questions);
});

router.get('/:id', (req, res) => {
  const question = getQuestion(req.params.id);
  if (!question) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json(question);
});

export default router;
