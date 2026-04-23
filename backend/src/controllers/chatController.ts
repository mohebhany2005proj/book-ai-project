import { Request, Response } from 'express';
import { ChatRequest, ChatResponse } from '../types';
import RAGService from '../services/ragService';

// Import books storage from bookController
import { Request as ExpressRequest } from 'express';

// In-memory storage for books (should match bookController)
// In production, use a shared database
const books = new Map();

const ragService = new RAGService(parseInt(process.env.TOP_K_RESULTS || '5'));

/**
 * Handle chat message
 */
export const chat = async (req: Request, res: Response) => {
  try {
    const { bookId, message, conversationHistory, readingMode }: ChatRequest = req.body;

    // Validate input
    if (!bookId || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'bookId and message are required',
      });
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid message',
        details: 'Message must be a non-empty string',
      });
    }

    // Get book from storage (in production, fetch from database)
    const book = (req.app.locals.books as Map<string, any>)?.get(bookId);

    if (!book) {
      return res.status(404).json({
        error: 'Book not found',
        details: `No book found with ID: ${bookId}`,
      });
    }

    // Validate book collection exists
    const isValid = await ragService.validateBookCollection(bookId);
    if (!isValid) {
      return res.status(404).json({
        error: 'Book data not found',
        details: 'The book has not been processed or the data is missing',
      });
    }

    console.log(`💬 Chat request for book "${book.title}": ${message}`);
    if (conversationHistory && conversationHistory.length > 0) {
      console.log(`📝 Including ${conversationHistory.length} previous messages in context`);
    }

    // Generate answer using RAG with conversation history, reading mode, and metadata
    const response: ChatResponse = await ragService.answerQuestion(
      bookId,
      book.title,
      message,
      conversationHistory || [],
      readingMode,
      book.metadata // Pass metadata for enhanced context
    );

    res.json(response);
  } catch (error: any) {
    console.error('❌ Error in chat:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message,
    });
  }
};

/**
 * Get relevant context for a question (for debugging)
 */
export const getContext = async (req: Request, res: Response) => {
  try {
    const { bookId, question } = req.query;

    if (!bookId || !question) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: 'bookId and question are required',
      });
    }

    const book = (req.app.locals.books as Map<string, any>)?.get(bookId as string);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const context = await ragService.getRelevantContext(
      bookId as string,
      question as string
    );

    res.json({
      bookId,
      question,
      contextChunks: context,
      count: context.length,
    });
  } catch (error: any) {
    console.error('❌ Error getting context:', error);
    res.status(500).json({
      error: 'Failed to retrieve context',
      details: error.message,
    });
  }
};

/**
 * Generate book summary
 */
export const generateSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = (req.app.locals.books as Map<string, any>)?.get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    console.log(`📝 Generating summary for book "${book.title}"...`);

    const summary = await ragService.generateBookSummary(id, book.title, book.metadata);

    res.json({
      bookId: id,
      bookTitle: book.title,
      summary,
    });
  } catch (error: any) {
    console.error('❌ Error generating summary:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      details: error.message,
    });
  }
};

// Made with Bob
