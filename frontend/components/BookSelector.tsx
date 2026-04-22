'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '../types';
import { bookApi } from '../lib/api';

interface BookSelectorProps {
  featurePath: string;
  featureTitle: string;
  featureDescription: string;
  featureIcon: string;
}

export default function BookSelector({
  featurePath,
  featureTitle,
  featureDescription,
  featureIcon,
}: BookSelectorProps) {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleBookSelect = (bookId: string) => {
    router.push(`${featurePath}/${bookId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">{featureIcon}</div>
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900">
          {featureTitle}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {featureDescription}
        </p>
      </div>

      {/* Book Selection */}
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="font-serif text-2xl text-gray-900">
            Select a Book
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Choose a book from your library to get started
          </p>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-800 px-6 py-4 text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <div className="space-y-2">
              <p className="font-serif text-xl text-gray-900">No books yet</p>
              <p className="text-sm text-gray-500">
                Upload a book first to use this feature.
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-3 bg-gray-900 text-white hover:bg-gray-700 transition-colors text-sm"
            >
              Go to Homepage
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <button
                key={book.id}
                onClick={() => handleBookSelect(book.id)}
                className="
                  group
                  text-left
                  border border-gray-200
                  bg-white
                  p-6
                  hover:border-gray-900
                  hover:shadow-lg
                  transition-all duration-300
                  cursor-pointer
                "
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-12 h-12 text-gray-400 group-hover:text-gray-900 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-gray-900 mb-1 group-hover:text-gray-700 transition-colors truncate">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(book.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob