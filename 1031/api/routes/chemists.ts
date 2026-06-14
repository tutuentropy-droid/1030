import { Router } from 'express';
import { getAllChemists, getChemist } from '../services/chemistService';

const router = Router();

router.get('/', (_req, res) => {
  const chemists = getAllChemists();
  res.json(chemists);
});

router.get('/:id', (req, res) => {
  const chemist = getChemist(req.params.id);
  if (!chemist) {
    res.status(404).json({ error: 'Chemist not found' });
    return;
  }
  res.json(chemist);
});

export default router;
