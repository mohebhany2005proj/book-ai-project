export interface Book {
  id: string;
  title: string;
  filename: string;
  filesize: number;
  uploadDate: string;
  chunkCount?: number;
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
