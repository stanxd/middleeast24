
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SentimentFilterProps {
  selectedSentiment: string;
  onSentimentChange: (sentiment: string) => void;
}

const SentimentFilter: React.FC<SentimentFilterProps> = ({ 
  selectedSentiment, 
  onSentimentChange 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Filter by Sentiment:</span>
      <Select value={selectedSentiment} onValueChange={onSentimentChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Sentiments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sentiments</SelectItem>
          <SelectItem value="positive">🟢 Positive</SelectItem>
          <SelectItem value="neutral">🔵 Neutral</SelectItem>
          <SelectItem value="negative">🔴 Negative</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SentimentFilter;
