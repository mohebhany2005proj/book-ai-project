'use client';

import { useState, useEffect } from 'react';
import { Book } from '../types';
import { bookApi } from '../lib/api';
import BookUpload from '../components/BookUpload';
import BookList from '../components/BookList';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookApi.getAll();
      setBooks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load books');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (book: Book) => {
    setBooks([book, ...books]);
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookApi.delete(bookId);
      setBooks(books.filter(b => b.id !== bookId));
    } catch (err: any) {
      alert('Failed to delete book: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Book AI
        </h1>
        <p className="text-lg text-gray-600">
          Upload your books and chat with AI trained on their content
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Upload a New Book
        </h2>
        <BookUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Books Library */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Book Library
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-lg">No books uploaded yet</p>
            <p className="text-sm mt-2">Upload your first book to get started!</p>
          </div>
        ) : (
          <BookList books={books} onDelete={handleDelete} />
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          How it works
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Upload a book (PDF, TXT, or DOCX format)</li>
          <li>Wait for the AI to process and learn from the book</li>
          <li>Click on the book to start chatting</li>
          <li>Ask questions about the book's content</li>
          <li>Get accurate answers based only on the book</li>
        </ol>
      </div>
    </div>
  );
}

// Made with Bob
