export interface Book {
  id: string;
  title: string;
  filename: string;
  filepath: string;
  filesize: number;
  uploadDate: Date;
  collectionName: string;
  chunkCount?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ReadingMode = 'quick' | 'deep' | 'story';

export interface ChatRequest {
  bookId: string;
  message: string;
  conversationHistory?: ChatMessage[];
  readingMode?: ReadingMode;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
  bookTitle: string;
}

export interface DocumentChunk {
  content: string;
  metadata: {
    bookId: string;
    chunkIndex: number;
    pageNumber?: number;
  };
}

export interface EmbeddingResult {
  embedding: number[];
  text: string;
}

export interface SearchResult {
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export interface UploadResponse {
  success: boolean;
  book?: Book;
  message: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// Made with Bob
