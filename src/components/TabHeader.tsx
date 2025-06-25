
import React from 'react';
import SentimentFilter from './SentimentFilter';
import AIStatusIndicator from './AIStatusIndicator';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TabHeaderProps {
  title: string;
  description: string;
  color: 'blue' | 'red' | 'green';
  sentimentFilter: string;
  onSentimentChange: (sentiment: string) => void;
  showAIStatus?: boolean;
  isAnalyzing?: boolean;
  isModelReady?: boolean;
  onRefresh?: () => Promise<void>;
  lastRefreshed?: Date | null;
}

const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  description,
  color,
  sentimentFilter,
  onSentimentChange,
  showAIStatus = false,
  isAnalyzing = false,
  isModelReady = false,
  onRefresh,
  lastRefreshed
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'red':
        return 'from-red-500 to-red-600';
      case 'green':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-1 h-8 bg-gradient-to-b ${getColorClasses()} rounded-full`}></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center gap-1"
            disabled={isAnalyzing}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm sm:text-base text-gray-600 pl-7 mb-6">{description}</p>
        {lastRefreshed && (
          <p className="text-xs text-gray-500 mb-6">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        )}
      </div>
      
      <div className="pl-7 space-y-3">
        {showAIStatus && (
          <AIStatusIndicator 
            isAnalyzing={isAnalyzing}
            isModelReady={isModelReady}
          />
        )}
        
        <div className="flex justify-start">
          <SentimentFilter 
            currentFilter={sentimentFilter}
            onChange={onSentimentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TabHeader;
