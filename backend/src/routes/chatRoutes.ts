import { Router } from 'express';
import { chat, getContext, generateSummary } from '../controllers/chatController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Send a chat message
router.post('/', asyncHandler(chat));

// Get relevant context for a question (debugging)
router.get('/context', asyncHandler(getContext));

// Generate book summary
router.get('/summary/:id', asyncHandler(generateSummary));

export default router;

// Made with Bob
