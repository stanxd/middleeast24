import { useState, useCallback } from 'react';
import { SentimentIntensityAnalyzer } from 'vader-sentiment';

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  label: SentimentType;
  confidence: number;
}

export const useSentimentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(true);

  const analyzeSentiment = useCallback(async (text: string): Promise<SentimentResult | null> => {
    if (!isModelReady) {
      console.warn('Sentiment analysis not ready');
      return null;
    }

    try {
      // Truncate text if it's too long
      const truncatedText = text.length > 512 ? text.substring(0, 512) : text;
      
      // Use VADER for sentiment analysis
      const analyzer = new SentimentIntensityAnalyzer();
      const result = analyzer.polarity_scores(truncatedText);
      
      // Check for conflict-related keywords that should influence sentiment
      const lowerText = truncatedText.toLowerCase();
      const conflictKeywords = [
        'war', 'attack', 'strike', 'kill', 'bomb', 'missile', 'conflict', 'violence',
        'death', 'casualty', 'casualties', 'wounded', 'destroy', 'destruction', 'fight',
        'fighting', 'battle', 'invasion', 'invade', 'terror', 'terrorist'
      ];
      
      // Adjust compound score for news about conflicts
      let adjustedCompound = result.compound;
      
      // If text contains conflict keywords, adjust the sentiment
      const containsConflict = conflictKeywords.some(keyword => lowerText.includes(keyword));
      if (containsConflict) {
        // News about conflicts should generally be more negative or neutral
        // Reduce positive sentiment and increase negative sentiment
        if (adjustedCompound > 0) {
          // Reduce positive sentiment by 50-80% for conflict news
          adjustedCompound = adjustedCompound * 0.3;
        } else if (adjustedCompound < 0) {
          // Slightly amplify negative sentiment for conflict news
          adjustedCompound = adjustedCompound * 1.2;
        }
      }
      
      // Map adjusted output to our format
      let sentiment: SentimentType;
      let confidence: number;
      
      // Use adjusted compound score for classification
      if (adjustedCompound >= 0.05) {
        sentiment = 'positive';
        confidence = Math.min(0.5 + Math.abs(adjustedCompound) / 2, 0.95);
      } else if (adjustedCompound <= -0.05) {
        sentiment = 'negative';
        confidence = Math.min(0.5 + Math.abs(adjustedCompound) / 2, 0.95);
      } else {
        sentiment = 'neutral';
        confidence = 0.7; // Medium confidence for neutral classification
      }
      
      console.log('VADER sentiment analysis result:', {
        original: result,
        adjusted: adjustedCompound,
        mapped: { label: sentiment, confidence }
      });
      
      return {
        label: sentiment,
        confidence
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    }
  }, [isModelReady]);

  return {
    analyzeSentiment,
    isLoading,
    isModelReady
  };
};
