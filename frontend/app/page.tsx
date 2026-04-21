'use client';

import { useState, useEffect } from 'react';
import { Book } from '../types';
import { bookApi } from '../lib/api';
import BookUpload from '../components/BookUpload';
import BookList from '../components/BookList';
import WaveGraphic from '../components/WaveGraphic';

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
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-gray-900 tracking-tight">
            Welcome to Book AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Upload your books and chat with AI trained on their content
          </p>
        </div>

        {/* Wave Graphic */}
        <div className="py-8">
          <WaveGraphic />
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            We create intelligent experiences and conversational interfaces
            <br />
            that aim to delight and wonder.
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
            Upload a Book
          </h2>
        </div>
        <BookUpload onUploadSuccess={handleUploadSuccess} />
      </section>

      {/* Books Library Section */}
      <section className="space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
            Your Library
          </h2>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-800 px-6 py-4 text-sm">
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
              <p className="text-sm text-gray-500">Upload your first book to begin.</p>
            </div>
          </div>
        ) : (
          <BookList books={books} onDelete={handleDelete} />
        )}
      </section>

      {/* About Section */}
      <section id="about" className="space-y-8 pt-12">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
            How It Works
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 text-gray-600">
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-gray-900">Upload</h3>
            <p className="text-sm leading-relaxed">
              Upload your books in PDF, TXT, or DOCX format. Our system processes
              and analyzes the content, creating an intelligent understanding of
              the material.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-gray-900">Converse</h3>
            <p className="text-sm leading-relaxed">
              Engage in natural conversations about your books. Ask questions,
              explore themes, and discover insights powered by advanced AI that
              understands the context and nuance of your literary collection.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Made with Bob - Version 3
