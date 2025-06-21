
import { pipeline } from '@huggingface/transformers';
import { useState, useEffect, useRef } from 'react';

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  label: SentimentType;
  confidence: number;
}

export const useSentimentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const pipelineRef = useRef<any>(null);

  useEffect(() => {
    const initializePipeline = async () => {
      try {
        setIsLoading(true);
        console.log('Loading sentiment analysis model...');
        
        pipelineRef.current = await pipeline(
          'sentiment-analysis',
          'cardiffnlp/twitter-roberta-base-sentiment'
        );
        
        setIsModelReady(true);
        console.log('Sentiment analysis model loaded successfully');
      } catch (error) {
        console.error('Error loading sentiment analysis model:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePipeline();
  }, []);

  const analyzeSentiment = async (text: string): Promise<SentimentResult | null> => {
    if (!pipelineRef.current || !isModelReady) {
      console.warn('Sentiment analysis model not ready');
      return null;
    }

    try {
      const result = await pipelineRef.current(text);
      const prediction = result[0];
      
      // Map the model's labels to our simplified format
      let sentimentLabel: SentimentType;
      if (prediction.label.includes('POSITIVE')) {
        sentimentLabel = 'positive';
      } else if (prediction.label.includes('NEGATIVE')) {
        sentimentLabel = 'negative';
      } else {
        sentimentLabel = 'neutral';
      }

      return {
        label: sentimentLabel,
        confidence: prediction.score
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    }
  };

  return {
    analyzeSentiment,
    isLoading,
    isModelReady
  };
};
