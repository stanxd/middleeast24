import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SentimentType } from '@/hooks/useSentimentAnalysis';

interface SentimentBadgeProps {
  sentiment?: SentimentType;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ 
  sentiment, 
  confidence = 0, 
  size = 'md' 
}) => {
  if (!sentiment) return null;

  const getColorClass = () => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const getIcon = () => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      case 'neutral':
      default:
        return '😐';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-0.5 px-1.5';
      case 'lg':
        return 'text-sm py-1 px-3';
      case 'md':
      default:
        return 'text-xs py-0.5 px-2';
    }
  };

  // Format confidence as percentage
  const confidencePercent = confidence ? Math.round(confidence * 100) : 0;

  return (
    <Badge 
      variant="outline" 
      className={`${getColorClass()} ${getSizeClass()} font-medium border rounded-full transition-colors`}
    >
      <span className="mr-1">{getIcon()}</span>
      <span className="capitalize">{sentiment}</span>
      {confidence > 0 && (
        <span className="ml-1 opacity-75 text-[0.7em]">({confidencePercent}%)</span>
      )}
    </Badge>
  );
};

export default SentimentBadge;
