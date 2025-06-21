
import React from 'react';
import { Badge } from './ui/badge';

interface SentimentBadgeProps {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  size?: 'sm' | 'md';
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ 
  sentiment, 
  confidence, 
  size = 'sm' 
}) => {
  const getSentimentConfig = () => {
    switch (sentiment) {
      case 'positive':
        return {
          label: 'Positive',
          className: 'bg-green-100 text-green-800 border-green-200',
          emoji: '🟢'
        };
      case 'negative':
        return {
          label: 'Negative',
          className: 'bg-red-100 text-red-800 border-red-200',
          emoji: '🔴'
        };
      case 'neutral':
        return {
          label: 'Neutral',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          emoji: '🔵'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          emoji: '⚪'
        };
    }
  };

  const config = getSentimentConfig();
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <Badge 
      className={`${config.className} ${sizeClass} font-medium border`}
      title={confidence ? `Confidence: ${(confidence * 100).toFixed(1)}%` : undefined}
    >
      <span className="mr-1">{config.emoji}</span>
      {config.label}
    </Badge>
  );
};

export default SentimentBadge;
