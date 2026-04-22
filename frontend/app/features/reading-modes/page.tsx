import BookSelector from '@/components/BookSelector';

export default function ReadingModesPage() {
  return (
    <BookSelector
      featurePath="/features/reading-modes"
      featureTitle="Smart Reading Modes"
      featureDescription="Choose how you want to consume book content: Quick summaries, Deep analysis, or Story-style retelling"
      featureIcon="📖"
    />
  );
}

// Made with Bob