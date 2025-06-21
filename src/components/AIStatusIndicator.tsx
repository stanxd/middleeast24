
import React from 'react';

interface AIStatusIndicatorProps {
  isAnalyzing: boolean;
  isModelReady: boolean;
}

const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ 
  isAnalyzing, 
  isModelReady 
}) => {
  return (
    <div className="flex items-center space-x-4">
      {isAnalyzing && (
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center space-x-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          <span>🤖 Analyzing sentiment...</span>
        </div>
      )}
      {!isModelReady && !isAnalyzing && (
        <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center space-x-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
          <span>🔄 Loading AI model...</span>
        </div>
      )}
      {/* Model ready state is now silent - no indicator shown when ready */}
    </div>
  );
};

export default AIStatusIndicator;
