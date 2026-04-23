'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SummaryCards from '@/components/SummaryCards';
import { bookApi } from '@/lib/api';
import { Book } from '@/types';

export default function SummaryCardsBookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const data = await bookApi.getById(bookId);
      setBook(data);
    } catch (error) {
      console.error('Error loading book:', error);
      alert('Failed to load book. Redirecting to book selection...');
      router.push('/features/summary-cards');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-2xl md:text-3xl text-gray-900">
            🎴 Visual Summary: {book.title}
          </h1>
          <button
            onClick={() => router.push('/features/summary-cards')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Change Book
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Swipe through key concepts and ideas from your book
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards bookId={bookId} bookTitle={book.title} />
    </div>
  );
}

// Made with Bob