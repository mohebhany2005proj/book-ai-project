'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import ReadingModeSelector, { ReadingMode } from '@/components/ReadingModeSelector';
import { bookApi } from '@/lib/api';
import { ChatMessage } from '@/types';

export default function ReadingModesChatPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  
  const [book, setBook] = useState<any>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('quick');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
      router.push('/features/reading-modes');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      // Call API with reading mode
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          message,
          conversationHistory: messages,
          readingMode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };
      
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, errorMessage]);
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
            📖 {book.title}
          </h1>
          <button
            onClick={() => router.push('/features/reading-modes')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Change Book
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Smart Reading Mode - Ask questions and get answers in your preferred style
        </p>
      </div>

      {/* Reading Mode Selector */}
      <ReadingModeSelector
        currentMode={readingMode}
        onModeChange={setReadingMode}
      />

      {/* Mode Description */}
      <div className="bg-gray-50 border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-gray-600">
            {readingMode === 'quick' && (
              <p>
                <strong>Quick Mode:</strong> Get concise answers with key points in bullet format. 
                Perfect for quick understanding and time-saving.
              </p>
            )}
            {readingMode === 'deep' && (
              <p>
                <strong>Deep Dive Mode:</strong> Receive comprehensive explanations with detailed 
                analysis, examples, and connections between concepts.
              </p>
            )}
            {readingMode === 'story' && (
              <p>
                <strong>Story Mode:</strong> Experience engaging, narrative-style responses that 
                make the content memorable and enjoyable to read.
              </p>
            )}
          </div>
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

// Made with Bob