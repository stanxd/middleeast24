
import React from 'react';

interface SentimentFilterProps {
  selectedSentiment: string;
  onSentimentChange: (sentiment: string) => void;
}

const SentimentFilter: React.FC<SentimentFilterProps> = ({ 
  selectedSentiment, 
  onSentimentChange 
}) => {
  const sentimentOptions = [
    { value: 'all', color: 'bg-gray-400', hoverColor: 'hover:bg-gray-500' },
    { value: 'positive', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { value: 'neutral', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { value: 'negative', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' }
  ];

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Filter by Sentiment:</span>
      <div className="flex items-center space-x-3">
        {sentimentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSentimentChange(option.value)}
            className={`
              w-8 h-1 rounded-full transition-all duration-200 cursor-pointer
              ${selectedSentiment === option.value 
                ? `${option.color} shadow-md scale-110` 
                : `${option.color} opacity-50 hover:opacity-100 hover:scale-105`
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default SentimentFilter;
