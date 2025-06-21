
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
    { value: 'all', label: 'All', color: 'bg-gray-400', hoverColor: 'hover:bg-gray-500' },
    { value: 'positive', label: 'Positive', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { value: 'neutral', label: 'Neutral', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { value: 'negative', label: 'Negative', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' }
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
              flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
              ${selectedSentiment === option.value 
                ? `${option.color} text-white shadow-md` 
                : `bg-gray-100 text-gray-600 ${option.hoverColor} hover:text-white`
              }
            `}
          >
            <div className={`w-4 h-1 rounded-full ${option.color}`}></div>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SentimentFilter;
