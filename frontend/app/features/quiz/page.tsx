import BookSelector from '@/components/BookSelector';

export default function QuizPage() {
  return (
    <BookSelector
      featurePath="/features/quiz"
      featureTitle="Interactive Quiz Mode"
      featureDescription="Test your comprehension with AI-generated questions and get instant feedback"
      featureIcon="🎯"
    />
  );
}

// Made with Bob