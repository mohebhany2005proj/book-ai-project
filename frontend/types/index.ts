export interface BookMetadata {
  author?: string;
  pageCount?: number;
  chapterCount?: number;
  chapters?: Array<{
    number: number;
    title: string;
    startPage?: number;
  }>;
  wordCount: number;
  estimatedReadingTime: number;
  tableOfContents?: string;
  introduction?: string;
  language?: string;
}

export interface Book {
  id: string;
  title: string;
  filename: string;
  filesize: number;
  uploadDate: string;
  chunkCount?: number;
  metadata?: BookMetadata;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
  bookTitle: string;
}

export interface ChatRequest {
  bookId: string;
  message: string;
  conversationHistory?: ChatMessage[];
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
