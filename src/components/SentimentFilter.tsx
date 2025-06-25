import React from 'react';
import { Button } from '@/components/ui/button';
import { SentimentType } from '@/hooks/useSentimentAnalysis';

interface SentimentFilterProps {
  currentFilter: string;
  onChange: (filter: string) => void;
}

const SentimentFilter: React.FC<SentimentFilterProps> = ({ 
  currentFilter, 
  onChange 
}) => {
  const filters: { value: string; label: string; icon: string; color: string }[] = [
    { value: 'all', label: 'All', icon: '🔍', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
    { value: 'positive', label: 'Positive', icon: '😊', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
    { value: 'neutral', label: 'Neutral', icon: '😐', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
    { value: 'negative', label: 'Negative', icon: '😟', color: 'bg-red-100 hover:bg-red-200 text-red-800' }
  ];

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant="outline"
          size="sm"
          className={`${filter.color} border rounded-full px-2 sm:px-3 py-1 text-xs font-medium transition-colors ${
            currentFilter === filter.value ? 'ring-2 ring-offset-1 ring-blue-400' : ''
          }`}
          onClick={() => onChange(filter.value)}
        >
          <span className={filter.value === 'all' ? '' : 'mr-0 sm:mr-1'}>{filter.icon}</span>
          <span className="hidden sm:inline">{filter.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default SentimentFilter;
