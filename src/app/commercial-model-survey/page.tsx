import type { Metadata } from 'next';
import { CommercialModelSurvey } from './survey-view';

export const metadata: Metadata = {
  title: 'Commercial model — community feedback',
  description:
    'Share your thoughts on the proposed TickerQ commercial model. A short, anonymous questionnaire for the community.',
  // Standalone, unlisted page: keep it out of search indexes and crawls.
  robots: { index: false, follow: false },
};

export default function CommercialModelSurveyPage() {
  return <CommercialModelSurvey />;
}
