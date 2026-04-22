'use client';

import Link from 'next/link';

interface Feature {
  id: string;
  title: string;
  icon: string;
  description: string;
  path: string;
}

export default function FeatureCards() {
  const features: Feature[] = [
    {
      id: 'reading-modes',
      title: 'Smart Reading Modes',
      icon: '📖',
      description: 'Choose how you consume content: Quick, Deep, or Story mode',
      path: '/features/reading-modes',
    },
    {
      id: 'insights',
      title: 'Book Insights Dashboard',
      icon: '📊',
      description: 'Visual overview of themes, characters, and key concepts',
      path: '/features/insights',
    },
    {
      id: 'summary-cards',
      title: 'Visual Summary Cards',
      icon: '🎴',
      description: 'Swipeable story-style cards with key information',
      path: '/features/summary-cards',
    },
    {
      id: 'quiz',
      title: 'Interactive Quiz Mode',
      icon: '🎯',
      description: 'Test your comprehension with AI-generated questions',
      path: '/features/quiz',
    },
    {
      id: 'speed-reading',
      title: 'Speed Reading Assistant',
      icon: '⚡',
      description: 'Extract key points and absorb content faster',
      path: '/features/speed-reading',
    },
  ];

  return (
    <section className="space-y-8 py-12">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
          Explore Your Books in New Ways
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Discover powerful features to help you understand and retain book content faster
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {features.map((feature) => (
          <Link
            key={feature.id}
            href={feature.path}
            className="group block"
          >
            <div className="
              relative overflow-hidden
              border border-gray-200 
              bg-white
              p-8 
              transition-all duration-300 
              hover:shadow-lg hover:border-gray-900
              cursor-pointer
              h-full
            ">
              {/* Icon */}
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center text-gray-400 group-hover:text-gray-900 transition-colors text-sm">
                <span className="mr-2">Learn more</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Made with Bob