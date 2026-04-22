'use client';

import { useState, useEffect } from 'react';

interface SpeedReadingContent {
  tldr: string;
  keySentences: string[];
  importantTerms: { term: string; definition: string }[];
  chapterSummaries: { chapter: string; summary: string }[];
}

interface SpeedReadingViewProps {
  bookId: string;
  bookTitle: string;
}

export default function SpeedReadingView({ bookId, bookTitle }: SpeedReadingViewProps) {
  const [content, setContent] = useState<SpeedReadingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sentences' | 'terms' | 'chapters'>('overview');

  useEffect(() => {
    loadContent();
  }, [bookId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/api/features/speed-reading/${bookId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load speed reading content');
      }

      const data = await response.json();
      setContent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
      console.error('Error loading speed reading content:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="text-gray-600 text-sm">Extracting key information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-800 px-6 py-4">
        <p className="font-medium mb-2">Error Loading Content</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={loadContent}
          className="mt-4 px-4 py-2 bg-red-800 text-white hover:bg-red-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '⚡' },
            { id: 'sentences', label: 'Key Sentences', icon: '📝' },
            { id: 'terms', label: 'Important Terms', icon: '📚' },
            { id: 'chapters', label: 'Chapter Summaries', icon: '📖' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-4 px-2 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <section className="border border-gray-200 bg-gray-50 p-6">
              <h3 className="font-serif text-xl text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                TL;DR - Quick Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{content.tldr}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 bg-white p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {content.keySentences?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Key Sentences</div>
              </div>
              <div className="border border-gray-200 bg-white p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {content.importantTerms?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Important Terms</div>
              </div>
              <div className="border border-gray-200 bg-white p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {content.chapterSummaries?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Chapters</div>
              </div>
            </div>
          </div>
        )}

        {/* Key Sentences Tab */}
        {activeTab === 'sentences' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              The most important sentences extracted from the book
            </p>
            {content.keySentences && content.keySentences.length > 0 ? (
              content.keySentences.map((sentence, index) => (
                <div key={index} className="border-l-4 border-gray-900 bg-white p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-gray-700 leading-relaxed">{sentence}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-12">No key sentences available</p>
            )}
          </div>
        )}

        {/* Important Terms Tab */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Key terms and concepts with definitions
            </p>
            {content.importantTerms && content.importantTerms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.importantTerms.map((item, index) => (
                  <div key={index} className="border border-gray-200 bg-white p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{item.term}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">No terms available</p>
            )}
          </div>
        )}

        {/* Chapter Summaries Tab */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Quick summaries of each chapter or section
            </p>
            {content.chapterSummaries && content.chapterSummaries.length > 0 ? (
              content.chapterSummaries.map((item, index) => (
                <div key={index} className="border border-gray-200 bg-white p-6">
                  <h4 className="font-serif text-lg text-gray-900 mb-3">
                    {item.chapter}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{item.summary}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-12">No chapter summaries available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob