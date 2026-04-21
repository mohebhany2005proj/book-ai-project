'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book, ChatMessage } from '../../../types';
import { bookApi, chatApi } from '../../../lib/api';
import ChatInterface from '../../../components/ChatInterface';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<Book | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const data = await bookApi.getById(bookId);
      setBook(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load book');
      console.error('Error loading book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!book) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    try {
      // Get AI response with conversation history (last 5 messages)
      const response = await chatApi.sendMessage(bookId, message, messages.slice(-5));

      // Add AI message
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to get response'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b border-gray-900 mx-auto"></div>
          <p className="text-sm text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="border border-red-300 bg-red-50 p-8 space-y-4">
          <h2 className="font-serif text-2xl text-red-900">Error</h2>
          <p className="text-sm text-red-800">{error || 'Book not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-900 hover:text-gray-600 transition-elegant"
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-gray-900 transition-elegant mt-1"
              title="Back to library"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="space-y-1">
              <h1 className="font-serif text-3xl text-gray-900">{book.title}</h1>
              <p className="text-sm text-gray-500">
                Conversing with AI about this book
              </p>
            </div>
          </div>
          {book.chunkCount && (
            <div className="text-xs text-gray-400">
              {book.chunkCount} chunks
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        bookTitle={book.title}
      />
    </div>
  );
}

// Made with Bob - Version 3
