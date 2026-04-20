import axios, { AxiosError } from 'axios';
import { Book, ChatResponse, UploadResponse, ErrorResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    throw new Error(error.response.data.error || 'An error occurred');
  } else if (error.request) {
    throw new Error('No response from server. Please check if the backend is running.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Book API
export const bookApi = {
  /**
   * Upload a new book
   */
  upload: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('book', file);

      const response = await api.post<UploadResponse>('/api/books/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
      throw error;
    }
  },

  /**
   * Get all books
   */
  getAll: async (): Promise<Book[]> => {
    try {
      const response = await api.get<Book[]>('/api/books');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
      throw error;
    }
  },

  /**
   * Get a specific book
   */
  getById: async (id: string): Promise<Book> => {
    try {
      const response = await api.get<Book>(`/api/books/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
      throw error;
    }
  },

  /**
   * Delete a book
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/books/${id}`);
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
      throw error;
    }
  },

  /**
   * Get book statistics
   */
  getStats: async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/api/books/${id}/stats`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
      throw error;
    }
  },
};

// Chat API
export const chatApi = {
  /**
   * Send a chat message
   */
  sendMessage: async (bookId: string, message: string): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse>('/api/chat', {
        bookId,
        message,
      });

      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
      throw error;
    }
  },

  /**
   * Generate book summary
   */
  generateSummary: async (bookId: string): Promise<{ summary: string }> => {
    try {
      const response = await api.get(`/api/chat/summary/${bookId}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
      throw error;
    }
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default api;

// Made with Bob
