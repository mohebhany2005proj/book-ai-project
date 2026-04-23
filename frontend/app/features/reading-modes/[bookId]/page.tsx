'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReadingModeSelector, { ReadingMode } from '@/components/ReadingModeSelector';
import { bookApi, chatApi } from '@/lib/api';
import { Book, ChatMessage } from '@/types';

export default function ReadingModesChatPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('quick');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
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
      const prompts: Array<{ mode: ReadingMode; title: string; prompt: string; intro: string }> = [
        {
          mode: 'quick',
          title: '⚡ Quick Mode Example / مثال الوضع السريع',
          prompt: `Give me a quick overview of "${bookTitle}" in 3-5 bullet points. If the book or user context is Arabic, answer in Arabic; otherwise answer in English.`,
          intro: "Here's how Quick Mode works - concise and to the point / هكذا يعمل الوضع السريع - مختصر ومباشر:",
        },
        {
          mode: 'deep',
          title: '🔍 Deep Dive Mode Example / مثال التحليل العميق',
          prompt: `What is the main theme of "${bookTitle}"? Explain in detail. If the book or user context is Arabic, answer in Arabic; otherwise answer in English.`,
          intro: "Here's how Deep Dive Mode works - comprehensive and detailed / هكذا يعمل وضع التحليل العميق - شامل ومفصل:",
        },
        {
          mode: 'story',
          title: '📚 Story Mode Example / مثال وضع السرد',
          prompt: `Tell me about "${bookTitle}" in an engaging way. If the book or user context is Arabic, answer in Arabic; otherwise answer in English.`,
          intro: "Here's how Story Mode works - engaging and narrative / هكذا يعمل وضع السرد - جذاب وحكائي:",
        },
      ];

      const results = await Promise.all(
        prompts.map(async ({ mode, title, prompt, intro }) => {
          const response = await chatApi.sendMessage(bookId, prompt, [], mode);
          return {
            role: 'assistant' as const,
            content: `## ${title}\n\n${intro}\n\n${response.answer}`,
            timestamp: new Date(),
          };
        })
      );

      setMessages(results);
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
      const data = await chatApi.sendMessage(bookId, message, messages, readingMode);
      
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
          {generatingWelcome ? 'Showcasing Smart Reading Modes... / جارٍ عرض أوضاع القراءة الذكية...' : 'Loading... / جارٍ التحميل...'}
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
            ← Change Book / تغيير الكتاب
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Smart Reading Modes - See examples of all 3 modes below! / أوضاع القراءة الذكية - شاهد أمثلة الأوضاع الثلاثة أدناه!
        </p>
      </div>

      {/* Welcome Message */}
      {messages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">✨</span>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-gray-900 mb-2">
                Welcome to Smart Reading Modes! / مرحباً بك في أوضاع القراءة الذكية!
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Below you'll see examples of all 3 reading modes answering the same question.
                Each mode offers a different way to understand your book.
                Use the normal chat button in your library to ask your own questions in any mode!
                <br />
                ستشاهد أدناه أمثلة لكيفية إجابة الأوضاع الثلاثة على السؤال نفسه.
                يقدم كل وضع طريقة مختلفة لفهم كتابك.
                استخدم زر الدردشة العادي في مكتبتك لطرح أسئلتك الخاصة بأي وضع.
              </p>
            </div>
          </div>
        </div>
      )}

      <ReadingModeSelector
        currentMode={readingMode}
        onModeChange={setReadingMode}
      />

      {/* Mode Examples */}
      <div className="space-y-6">
        {messages.map((message, index) => (
          <div key={index} className="border border-gray-200 bg-white p-6 shadow-sm">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800">
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {messages.length > 0 && (
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-700 mb-4">
            Want to ask your own questions in any of these modes? / هل تريد طرح أسئلتك الخاصة بأي من هذه الأوضاع؟
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-700 transition-colors text-lg font-medium"
          >
            Go to Library / اذهب إلى المكتبة →
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Use the chat button next to your book to start chatting in any mode / استخدم زر الدردشة بجانب كتابك لبدء المحادثة بأي وضع
          </p>
        </div>
      )}
    </div>
  );
}

// Made with Bob