import { Router } from 'express';
import { getRandomFunFact, getFunFactsByChemist } from '../services/funFactService';

const router = Router();

router.get('/random', (req, res) => {
  const chemistId = typeof req.query.chemistId === 'string' ? req.query.chemistId : undefined;
  const fact = getRandomFunFact(chemistId);
  if (!fact) {
    res.status(404).json({ error: 'No fun facts available' });
    return;
  }
  res.json(fact);
});

router.get('/chemist/:chemistId', (req, res) => {
  const facts = getFunFactsByChemist(req.params.chemistId);
  res.json(facts);
});

export default router;
