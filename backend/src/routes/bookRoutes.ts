import { Router } from 'express';
import {
  uploadBook,
  getAllBooks,
  getBook,
  deleteBook,
  getBookStats,
} from '../controllers/bookController';
import upload from '../middleware/upload';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Upload a new book
router.post('/upload', upload.single('book'), asyncHandler(uploadBook));

// Get all books
router.get('/', asyncHandler(getAllBooks));

// Get a specific book
router.get('/:id', asyncHandler(getBook));

// Delete a book
router.delete('/:id', asyncHandler(deleteBook));

// Get book statistics
router.get('/:id/stats', asyncHandler(getBookStats));

export default router;

// Made with Bob
