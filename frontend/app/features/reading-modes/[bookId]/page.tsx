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
  const [showChat, setShowChat] = useState(false);
  const [generatingWelcome, setGeneratingWelcome] = useState(false);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const data = await bookApi.getById(bookId);
      setBook(data);
      
      // Auto-generate welcome message showcasing the modes
      await generateWelcomeMessage(data.title);
    } catch (error) {
      console.error('Error loading book:', error);
      alert('Failed to load book. Redirecting to book selection...');
      router.push('/features/reading-modes');
    } finally {
      setLoading(false);
    }
  };

  const generateWelcomeMessage = async (bookTitle: string) => {
    setGeneratingWelcome(true);
    
    try {
      // Generate welcome message for each mode
      const welcomeMessages: ChatMessage[] = [];
      
      // Quick Mode Example
      const quickResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          message: `Give me a quick overview of "${bookTitle}" in 3-5 bullet points`,
          conversationHistory: [],
          readingMode: 'quick',
        }),
      });
      
      if (quickResponse.ok) {
        const quickData = await quickResponse.json();
        welcomeMessages.push({
          role: 'assistant',
          content: `## ⚡ Quick Mode Example\n\nHere's how Quick Mode works - concise and to the point:\n\n${quickData.answer}`,
          timestamp: new Date(),
        });
      }

      // Deep Dive Mode Example
      const deepResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          message: `What is the main theme of "${bookTitle}"? Explain in detail.`,
          conversationHistory: [],
          readingMode: 'deep',
        }),
      });
      
      if (deepResponse.ok) {
        const deepData = await deepResponse.json();
        welcomeMessages.push({
          role: 'assistant',
          content: `## 🔍 Deep Dive Mode Example\n\nHere's how Deep Dive Mode works - comprehensive and detailed:\n\n${deepData.answer}`,
          timestamp: new Date(),
        });
      }

      // Story Mode Example
      const storyResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          message: `Tell me about "${bookTitle}" in an engaging way`,
          conversationHistory: [],
          readingMode: 'story',
        }),
      });
      
      if (storyResponse.ok) {
        const storyData = await storyResponse.json();
        welcomeMessages.push({
          role: 'assistant',
          content: `## 📚 Story Mode Example\n\nHere's how Story Mode works - engaging and narrative:\n\n${storyData.answer}`,
          timestamp: new Date(),
        });
      }

      setMessages(welcomeMessages);
    } catch (error) {
      console.error('Error generating welcome:', error);
    } finally {
      setGeneratingWelcome(false);
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

  if (loading || generatingWelcome) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="text-gray-600">
          {generatingWelcome ? 'Showcasing Smart Reading Modes...' : 'Loading...'}
        </p>
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
          Smart Reading Modes - See examples of all 3 modes below!
        </p>
      </div>

      {/* Welcome Message */}
      {messages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">✨</span>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-gray-900 mb-2">
                Welcome to Smart Reading Modes!
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Below you'll see examples of all 3 reading modes answering the same question.
                Each mode offers a different way to understand your book.
                Use the normal chat button in your library to ask your own questions in any mode!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Examples */}
      <div className="space-y-6">
        {messages.map((message, index) => (
          <div key={index} className="border border-gray-200 bg-white p-6 shadow-sm">
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {messages.length > 0 && (
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-700 mb-4">
            Want to ask your own questions in any of these modes?
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-700 transition-colors text-lg font-medium"
          >
            Go to Library →
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Use the chat button next to your book to start chatting in any mode
          </p>
        </div>
      )}
    </div>
  );
}

// Made with Bob