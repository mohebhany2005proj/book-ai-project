'use client';

import { useState, useEffect } from 'react';

interface SummaryCard {
  id: number;
  title: string;
  content: string;
  icon: string;
}

interface SummaryCardsProps {
  bookId: string;
  bookTitle: string;
}

export default function SummaryCards({ bookId, bookTitle }: SummaryCardsProps) {
  const [cards, setCards] = useState<SummaryCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
  }, [bookId]);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/features/summary-cards/${bookId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load summary cards');
      }

      const data = await response.json();
      setCards(data.cards || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load summary cards');
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="text-gray-600 text-sm">Creating summary cards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-800 px-6 py-4">
        <p className="font-medium mb-2">Error Loading Cards</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={loadCards}
          className="mt-4 px-4 py-2 bg-red-800 text-white hover:bg-red-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-600">No summary cards available for this book.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToCard(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-gray-900'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Card Container */}
      <div className="relative">
        <div className="border-2 border-gray-200 bg-white p-8 md:p-12 min-h-[500px] flex flex-col justify-between">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">{currentCard.icon}</div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <h3 className="font-serif text-2xl md:text-3xl text-gray-900 text-center leading-tight">
              {currentCard.title}
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
              {currentCard.content}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevCard}
              disabled={cards.length <= 1}
              className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous card"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-gray-600 font-medium">
              {currentIndex + 1} / {cards.length}
            </span>

            <button
              onClick={nextCard}
              disabled={cards.length <= 1}
              className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next card"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-gray-500 text-sm">
        Use arrow buttons or click dots to navigate • Swipe on mobile
      </p>
    </div>
  );
}

// Made with Bob