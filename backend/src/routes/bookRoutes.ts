import { Router } from 'express';
import {
  uploadBook,
  getAllBooks,
  getBook,
  deleteBook,
  getBookStats,
  getBookPreview,
  getBookMetadata,
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

// Get book preview
router.get('/:id/preview', asyncHandler(getBookPreview));

// Get book metadata
router.get('/:id/metadata', asyncHandler(getBookMetadata));

// Get book statistics
router.get('/:id/stats', asyncHandler(getBookStats));

// Delete a book
router.delete('/:id', asyncHandler(deleteBook));

export default router;

// Made with Bob
