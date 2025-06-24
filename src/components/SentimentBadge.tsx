import React from 'react';
import { SentimentType } from '@/hooks/useSentimentAnalysis';

interface SentimentBadgeProps {
  sentiment?: SentimentType;
  confidence?: number;
  width?: 'full' | 'auto';
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ 
  sentiment, 
  confidence = 0,
  width = 'auto'
}) => {
  if (!sentiment) return null;

  const getColorClass = () => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      case 'neutral':
      default:
        return 'bg-gray-400';
    }
  };

  // Format confidence as percentage
  const confidencePercent = confidence ? Math.round(confidence * 100) : 0;

  return (
    <div 
      className={`h-1 ${width === 'full' ? 'w-full' : 'w-16'} ${getColorClass()}`}
      title={`${sentiment} (${confidencePercent}%)`}
    />
  );
};

export default SentimentBadge;
