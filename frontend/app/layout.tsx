import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Book AI - An Intelligent Literary Platform',
  description: 'Upload books and engage in intelligent conversations with AI trained on their content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white">
          {/* Minimalist Navigation */}
          <nav className="border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="flex justify-between items-center h-20">
                {/* Left Nav */}
                <div className="flex items-center space-x-8">
                  <a
                    href="/"
                    className="text-sm tracking-wide text-gray-900 hover:text-gray-600 transition-elegant"
                  >
                    Books
                  </a>
                </div>

                {/* Center Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <a href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <span className="font-serif text-xl tracking-wide">Book AI</span>
                  </a>
                </div>

                {/* Right Nav */}
                <div className="flex items-center space-x-8">
                  <a
                    href="#about"
                    className="text-sm tracking-wide text-gray-900 hover:text-gray-600 transition-elegant"
                  >
                    Info
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 mt-24">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                <div className="space-y-2">
                  <p className="font-serif text-sm text-gray-900">Book AI</p>
                  <p className="text-xs text-gray-500 tracking-wide">
                    An intelligent platform for conversing with your literary collection.
                  </p>
                </div>
                
                <div className="flex flex-col items-start md:items-end space-y-2">
                  <p className="font-serif text-xs text-gray-400 italic tracking-wide">
                    Version 3.0
                  </p>
                  <p className="text-xs text-gray-400">
                    Made with Bob
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

// Made with Bob - Version 3
