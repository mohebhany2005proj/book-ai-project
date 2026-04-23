'use client';

import { useState, useEffect } from 'react';
import { bookApi } from '../lib/api';

interface BookPreviewProps {
  bookId: string;
  bookTitle: string;
  onClose: () => void;
}

export default function BookPreview({ bookId, bookTitle, onClose }: BookPreviewProps) {
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [previewPages, setPreviewPages] = useState(20);

  useEffect(() => {
    loadPreview();
  }, [bookId]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookApi.getPreview(bookId, previewPages);
      setPreview(data.preview);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-gray-900">{bookTitle}</h2>
            <p className="text-sm text-gray-500 mt-1 tracking-wide">
              Preview: First {previewPages} pages {totalPages > 0 && `of ${totalPages}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-elegant"
            aria-label="Close preview"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b border-gray-900"></div>
            </div>
          )}

          {error && (
            <div className="border border-red-300 bg-red-50 text-red-800 px-6 py-4 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && preview && (
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap font-serif text-gray-900 leading-relaxed">
                {preview}
              </div>
            </div>
          )}

          {!loading && !error && !preview && (
            <div className="text-center text-gray-500 py-12">
              No preview available for this book.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <p className="text-xs text-gray-500 tracking-wide">
            This is a preview of the original book content
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-700 transition-elegant tracking-wide"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob