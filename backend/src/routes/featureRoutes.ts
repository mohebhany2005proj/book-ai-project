import { Router } from 'express';
import { 
  getInsights, 
  getSummaryCards, 
  getQuiz, 
  getSpeedReading 
} from '../controllers/featureController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get book insights
router.get('/insights/:id', asyncHandler(getInsights));

// Get summary cards
router.get('/summary-cards/:id', asyncHandler(getSummaryCards));

// Get quiz questions
router.get('/quiz/:id', asyncHandler(getQuiz));

// Get speed reading content
router.get('/speed-reading/:id', asyncHandler(getSpeedReading));

export default router;

// Made with Bob