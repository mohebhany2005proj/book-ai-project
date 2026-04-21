'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  bookTitle: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  bookTitle,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect if text contains Arabic characters
  const isArabic = (text: string): boolean => {
    return /[\u0600-\u06FF]/.test(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || sending) return;

    const message = input.trim();
    setInput('');
    setSending(true);

    try {
      await onSendMessage(message);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border border-gray-200 flex flex-col h-[calc(100vh-250px)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div className="space-y-2">
              <p className="font-serif text-xl text-gray-900">Start a conversation</p>
              <p className="text-sm text-gray-500">
                Ask questions about "{bookTitle}"
              </p>
            </div>
            <div className="text-left max-w-md mx-auto space-y-3 pt-4">
              <p className="text-xs text-gray-900 tracking-wide">EXAMPLE QUESTIONS</p>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• What is the main theme of this book?</li>
                <li>• Who are the main characters?</li>
                <li>• Can you summarize chapter 1?</li>
                <li>• What does the author say about [topic]?</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] px-5 py-4 ${
                  message.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
                dir={isArabic(message.content) ? 'rtl' : 'ltr'}
              >
                <div className={`flex items-start ${isArabic(message.content) ? 'space-x-reverse' : ''} space-x-3`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:font-serif prose-p:text-gray-900 prose-p:leading-relaxed" dir={isArabic(message.content) ? 'rtl' : 'ltr'}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    )}
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user'
                          ? 'text-gray-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the book... / اسأل سؤالاً عن الكتاب..."
              disabled={sending}
              dir={isArabic(input) ? 'rtl' : 'ltr'}
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed transition-elegant text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-elegant"
            >
              {sending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                  <span className="text-sm">Sending...</span>
                </div>
              ) : (
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            The AI will answer based only on the book's content
          </p>
        </form>
      </div>
    </div>
  );
}

// Made with Bob - Version 3
