import BookSelector from '@/components/BookSelector';

export default function SpeedReadingPage() {
  return (
    <BookSelector
      featurePath="/features/speed-reading"
      featureTitle="Speed Reading Assistant"
      featureDescription="Extract key points and absorb book content faster with AI-powered summaries"
      featureIcon="⚡"
    />
  );
}

