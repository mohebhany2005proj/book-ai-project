'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '../types';
import BookPreview from './BookPreview';

interface BookListProps {
  books: Book[];
  onDelete: (bookId: string) => void;
}

export default function BookList({ books, onDelete }: BookListProps) {
  const [previewBook, setPreviewBook] = useState<{ id: string; title: string } | null>(null);
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="space-y-1">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="group border-b border-gray-200 py-6 hover:bg-gray-50 transition-elegant"
          >
            <div className="flex items-start gap-8">
              {/* Number */}
              <div className="flex-shrink-0 w-12 text-right">
                <span className="text-sm text-gray-400 font-light">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl text-gray-900 mb-2 group-hover:text-gray-600 transition-elegant">
                  {book.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  {book.metadata?.author && (
                    <>
                      <span>by {book.metadata.author}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{book.filename}</span>
                  <span>•</span>
                  <span>{formatFileSize(book.filesize)}</span>
                  <span>•</span>
                  <span>{formatDate(book.uploadDate)}</span>
                  {book.metadata?.pageCount && (
                    <>
                      <span>•</span>
                      <span>{book.metadata.pageCount} pages</span>
                    </>
                  )}
                  {book.metadata?.chapterCount && (
                    <>
                      <span>•</span>
                      <span>{book.metadata.chapterCount} chapters</span>
                    </>
                  )}
                  {book.chunkCount && (
                    <>
                      <span>•</span>
                      <span>{book.chunkCount} chunks</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-4">
                <button
                  onClick={() => setPreviewBook({ id: book.id, title: book.title })}
                  className="text-sm text-gray-900 hover:text-gray-600 transition-elegant tracking-wide"
                  title="Preview book"
                >
                  Preview
                </button>
                <Link
                  href={`/chat/${book.id}`}
                  className="text-sm text-gray-900 hover:text-gray-600 transition-elegant tracking-wide"
                >
                  Chat
                </Link>
                <button
                  onClick={() => onDelete(book.id)}
                  className="text-sm text-gray-400 hover:text-red-600 transition-elegant"
                  title="Delete book"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewBook && (
        <BookPreview
          bookId={previewBook.id}
          bookTitle={previewBook.title}
          onClose={() => setPreviewBook(null)}
        />
      )}
    </>
  );
}

// Made with Bob - Version 3
