
import { pipeline } from '@huggingface/transformers';
import { useState, useEffect, useRef, useCallback } from 'react';

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  label: SentimentType;
  confidence: number;
}

export const useSentimentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const pipelineRef = useRef<any>(null);
  const initializationRef = useRef<boolean>(false);

  useEffect(() => {
    const initializePipeline = async () => {
      if (initializationRef.current) return;
      initializationRef.current = true;

      try {
        console.log('Loading sentiment analysis model...');
        
        // Use the exact model name and ensure proper configuration
        pipelineRef.current = await pipeline(
          'text-classification',
          'cardiffnlp/twitter-roberta-base-sentiment-latest',
          {
            revision: 'main',
            device: 'cpu'
          }
        );
        
        setIsModelReady(true);
        console.log('Sentiment analysis model loaded successfully');
      } catch (error) {
        console.error('Error loading sentiment analysis model:', error);
        
        // Try alternative model identifier
        try {
          console.log('Trying alternative model loading approach...');
          pipelineRef.current = await pipeline(
            'sentiment-analysis',
            'cardiffnlp/twitter-roberta-base-sentiment'
          );
          
          setIsModelReady(true);
          console.log('Sentiment analysis model loaded successfully with alternative approach');
        } catch (secondError) {
          console.error('Failed to load model with alternative approach:', secondError);
          setIsModelReady(false);
        }
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
      const truncatedText = text.length > 512 ? text.substring(0, 512) : text;
      
      const result = await pipelineRef.current(truncatedText);
      const prediction = Array.isArray(result) ? result[0] : result;
      
      console.log('Raw sentiment result:', prediction);
      
      // Map the model's labels to our simplified format
      let sentimentLabel: SentimentType;
      const label = prediction.label.toLowerCase();
      
      if (label.includes('positive') || label === 'label_2') {
        sentimentLabel = 'positive';
      } else if (label.includes('negative') || label === 'label_0') {
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
