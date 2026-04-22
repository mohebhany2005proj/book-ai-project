'use client';

import { useState, useEffect } from 'react';

interface BookInsights {
  themes: string[];
  characters: string[];
  keyQuotes: string[];
  summary: string;
}

interface BookInsightsDashboardProps {
  bookId: string;
  bookTitle: string;
}

export default function BookInsightsDashboard({
  bookId,
  bookTitle,
}: BookInsightsDashboardProps) {
  const [insights, setInsights] = useState<BookInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [bookId]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call API to generate insights
      const response = await fetch(`/api/insights/${bookId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to load insights');
      }

      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load insights');
      console.error('Error loading insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="text-gray-600 text-sm">Analyzing book content...</p>
        <p className="text-gray-500 text-xs">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-800 px-6 py-4">
        <p className="font-medium mb-2">Error Loading Insights</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={loadInsights}
          className="mt-4 px-4 py-2 bg-red-800 text-white hover:bg-red-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      {insights.summary && (
        <section className="border border-gray-200 bg-gray-50 p-6">
          <h3 className="font-serif text-xl text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📖</span>
            Book Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
        </section>
      )}

      {/* Main Themes */}
      {insights.themes && insights.themes.length > 0 && (
        <section>
          <h3 className="font-serif text-xl text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Main Themes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.themes.map((theme, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-white p-4 hover:border-gray-900 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-gray-900 text-sm leading-relaxed">
                    {theme}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Characters/Entities */}
      {insights.characters && insights.characters.length > 0 && (
        <section>
          <h3 className="font-serif text-xl text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Key Characters & Entities
          </h3>
          <div className="border border-gray-200 bg-white p-6">
            <ul className="space-y-3">
              {insights.characters.map((character, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm">{character}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Important Quotes */}
      {insights.keyQuotes && insights.keyQuotes.length > 0 && (
        <section>
          <h3 className="font-serif text-xl text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💬</span>
            Important Quotes
          </h3>
          <div className="space-y-4">
            {insights.keyQuotes.map((quote, index) => (
              <div
                key={index}
                className="border-l-4 border-gray-900 bg-gray-50 p-4"
              >
                <p className="text-gray-700 italic leading-relaxed">
                  "{quote}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Made with Bob