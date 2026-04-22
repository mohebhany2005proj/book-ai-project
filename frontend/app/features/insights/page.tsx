import BookSelector from '@/components/BookSelector';

export default function InsightsPage() {
  return (
    <BookSelector
      featurePath="/features/insights"
      featureTitle="Book Insights Dashboard"
      featureDescription="Get a visual overview of themes, characters, key concepts, and important quotes from your book"
      featureIcon="📊"
    />
  );
}

// Made with Bob