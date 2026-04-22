'use client';

export type ReadingMode = 'quick' | 'deep' | 'story';

interface ReadingModeSelectorProps {
  currentMode: ReadingMode;
  onModeChange: (mode: ReadingMode) => void;
}

export default function ReadingModeSelector({
  currentMode,
  onModeChange,
}: ReadingModeSelectorProps) {
  const modes = [
    {
      id: 'quick' as ReadingMode,
      name: 'Quick',
      icon: '⚡',
      description: '5-min summaries with key points',
      color: 'from-yellow-50 to-yellow-100',
    },
    {
      id: 'deep' as ReadingMode,
      name: 'Deep Dive',
      icon: '🔍',
      description: 'Detailed analysis and explanations',
      color: 'from-blue-50 to-blue-100',
    },
    {
      id: 'story' as ReadingMode,
      name: 'Story',
      icon: '📚',
      description: 'Engaging narrative style',
      color: 'from-purple-50 to-purple-100',
    },
  ];

  return (
    <div className="border border-gray-200 bg-gray-50 p-6">
      <div className="mb-4">
        <h3 className="font-serif text-lg text-gray-900 mb-2">
          Choose Your Reading Mode
        </h3>
        <p className="text-sm text-gray-600">
          Select how you'd like the AI to respond to your questions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              relative
              text-left
              p-4
              border-2
              transition-all duration-300
              ${currentMode === mode.id
                ? 'border-gray-900 bg-white shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-400'
              }
            `}
          >
            {/* Selected indicator */}
            {currentMode === mode.id && (
              <div className="absolute top-2 right-2">
                <svg
                  className="w-5 h-5 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Icon */}
            <div className="text-3xl mb-2">{mode.icon}</div>

            {/* Name */}
            <div className="font-serif text-base text-gray-900 mb-1">
              {mode.name}
            </div>

            {/* Description */}
            <div className="text-xs text-gray-600">
              {mode.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Made with Bob