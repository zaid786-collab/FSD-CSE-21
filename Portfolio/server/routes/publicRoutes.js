import express from 'express';
import {
  getPublicPortfolio,
  getProjectDetail,
  getGithub,
  getCompetitiveProgramming,
  handleContactSubmission
} from '../controllers/publicController.js';
import { contactLimiter, honeypotCheck, sanitizeInputs } from '../middleware/securityMiddleware.js';

const router = express.Router();

router.get('/portfolio', getPublicPortfolio);
router.get('/projects/:slug', getProjectDetail);
router.get('/github', getGithub);
router.get('/stats', getCompetitiveProgramming);
router.post('/contact', contactLimiter, honeypotCheck, sanitizeInputs, handleContactSubmission);

export default router;
