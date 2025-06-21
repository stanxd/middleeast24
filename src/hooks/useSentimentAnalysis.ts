
import { pipeline } from '@huggingface/transformers';
import { useState, useEffect, useRef, useCallback } from 'react';

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  label: SentimentType;
  confidence: number;
}

export const useSentimentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const pipelineRef = useRef<any>(null);
  const initializationRef = useRef<boolean>(false);

  useEffect(() => {
    const initializePipeline = async () => {
      // Prevent multiple initializations
      if (initializationRef.current) return;
      initializationRef.current = true;

      try {
        setIsLoading(true);
        console.log('Loading sentiment analysis model...');
        
        // Use a timeout to prevent indefinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Model loading timeout')), 30000); // 30 second timeout
        });

        const pipelinePromise = pipeline(
          'sentiment-analysis',
          'cardiffnlp/twitter-roberta-base-sentiment'
        );

        pipelineRef.current = await Promise.race([pipelinePromise, timeoutPromise]);
        
        setIsModelReady(true);
        console.log('Sentiment analysis model loaded successfully');
      } catch (error) {
        console.error('Error loading sentiment analysis model:', error);
        setIsModelReady(false);
        // Reset initialization flag to allow retry
        initializationRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    initializePipeline();
  }, []);

  const analyzeSentiment = useCallback(async (text: string): Promise<SentimentResult | null> => {
    if (!pipelineRef.current || !isModelReady) {
      console.warn('Sentiment analysis model not ready');
      return null;
    }

    try {
      // Truncate text to avoid processing very long content
      const truncatedText = text.length > 500 ? text.substring(0, 500) : text;
      
      const result = await pipelineRef.current(truncatedText);
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
  }, [isModelReady]);

  return {
    analyzeSentiment,
    isLoading,
    isModelReady
  };
};
