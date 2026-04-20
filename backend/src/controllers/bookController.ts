import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Book, UploadResponse } from '../types';
import DocumentProcessor from '../services/documentProcessor';
import EmbeddingService from '../services/embeddingService';
import SimpleVectorStore from '../services/simpleVectorStore';

// Use shared storage from app.locals (set in server.ts)
// This allows chatController to access the same books
const getBooks = (req: Request): Map<string, Book> => {
  if (!req.app.locals.books) {
    req.app.locals.books = new Map();
  }
  return req.app.locals.books;
};

const documentProcessor = new DocumentProcessor(
  parseInt(process.env.CHUNK_SIZE || '1000'),
  parseInt(process.env.CHUNK_OVERLAP || '200')
);
const embeddingService = new EmbeddingService();
const vectorStore = new SimpleVectorStore();

/**
 * Upload and process a book
 */
export const uploadBook = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const bookId = uuidv4();
    const collectionName = `book_${bookId}`;

    console.log(`📚 Processing book upload: ${file.originalname}`);

    // Create book record
    const book: Book = {
      id: bookId,
      title: path.basename(file.originalname, path.extname(file.originalname)),
      filename: file.originalname,
      filepath: file.path,
      filesize: file.size,
      uploadDate: new Date(),
      collectionName,
    };

    // Process document
    console.log('📄 Step 1: Parsing document...');
    const chunks = await documentProcessor.processDocument(file.path, bookId);
    book.chunkCount = chunks.length;

    console.log(`📊 Processing ${chunks.length} chunks...`);

    // Process chunks ONE AT A TIME to minimize memory usage
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      console.log(`  🔄 Processing chunk ${i + 1}/${chunks.length}...`);
      
      // Generate embedding for this single chunk
      const embedding = await embeddingService.generateEmbedding(chunk.content);
      
      // Store immediately to disk (don't keep in memory)
      await vectorStore.storeEmbeddings(
        collectionName,
        [embedding],
        [chunk.content],
        [chunk.metadata]
      );
      
      // Small delay to allow garbage collection
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✅ All ${chunks.length} chunks processed and stored!`);

    // Save book record
    getBooks(req).set(bookId, book);

    console.log(`✅ Book "${book.title}" processed successfully!`);

    const response: UploadResponse = {
      success: true,
      book,
      message: 'Book uploaded and processed successfully',
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('❌ Error uploading book:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to process book',
      details: error.message,
    });
  }
};

/**
 * Get all books
 */
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const bookList = Array.from(getBooks(req).values()).map(book => ({
      id: book.id,
      title: book.title,
      filename: book.filename,
      filesize: book.filesize,
      uploadDate: book.uploadDate,
      chunkCount: book.chunkCount,
    }));

    res.json(bookList);
  } catch (error: any) {
    console.error('❌ Error getting books:', error);
    res.status(500).json({
      error: 'Failed to retrieve books',
      details: error.message,
    });
  }
};

/**
 * Get a specific book
 */
export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = getBooks(req).get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error: any) {
    console.error('❌ Error getting book:', error);
    res.status(500).json({
      error: 'Failed to retrieve book',
      details: error.message,
    });
  }
};

/**
 * Delete a book
 */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = getBooks(req).get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    console.log(`🗑️  Deleting book: ${book.title}`);

    // Delete file
    if (fs.existsSync(book.filepath)) {
      fs.unlinkSync(book.filepath);
      console.log('✅ File deleted');
    }

    // Delete vector collection
    await vectorStore.deleteBookCollection(book.collectionName);
    console.log('✅ Vector collection deleted');

    // Remove from storage
    getBooks(req).delete(id);

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Error deleting book:', error);
    res.status(500).json({
      error: 'Failed to delete book',
      details: error.message,
    });
  }
};

/**
 * Get book statistics
 */
export const getBookStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = getBooks(req).get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const collectionInfo = await vectorStore.getCollectionInfo(book.collectionName);

    res.json({
      id: book.id,
      title: book.title,
      filesize: book.filesize,
      uploadDate: book.uploadDate,
      chunkCount: book.chunkCount,
      vectorCount: collectionInfo.count,
    });
  } catch (error: any) {
    console.error('❌ Error getting book stats:', error);
    res.status(500).json({
      error: 'Failed to retrieve book statistics',
      details: error.message,
    });
  }
};

// Made with Bob
