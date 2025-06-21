import { useState, useCallback } from 'react';

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  label: SentimentType;
  confidence: number;
}

// Advanced sentiment analysis for news content with temporal and contextual awareness
const advancedSentimentAnalysis = (text: string): SentimentResult => {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Define positive and negative word lists with weights
  const positiveWords: [string, number][] = [
    // Achievement words
    ['accomplish', 1.2], ['achieved', 1.2], ['achievement', 1.5], ['advance', 1], ['breakthrough', 1.8], 
    ['success', 1.5], ['successful', 1.5], ['triumph', 1.5], ['victory', 1.5], ['win', 1.2], 
    
    // Growth words
    ['boost', 1], ['develop', 0.8], ['development', 0.8], ['enhance', 1], ['expand', 1], 
    ['growth', 1.2], ['improve', 1], ['improvement', 1], ['increase', 0.8], ['progress', 1], 
    ['prosper', 1.2], ['prosperity', 1.5], ['recovery', 1.2], ['strengthen', 1], ['thrive', 1.3],
    
    // Celebration words
    ['celebrate', 1.2], ['celebration', 1.2], ['commemorate', 1], ['congratulate', 1.2], 
    ['festival', 1], ['festive', 1], ['honor', 1], ['independence', 1.2], ['praise', 1.2], 
    
    // Peace words
    ['accord', 1.2], ['agreement', 1.2], ['alliance', 1], ['ceasefire', 1.8], ['coexistence', 1.3], 
    ['cooperation', 1.3], ['diplomatic', 1.2], ['peace', 1.8], ['peaceful', 1.8], ['reconcile', 1.5], 
    ['stability', 1.3], ['stable', 1.3], ['truce', 1.5], ['unity', 1.3],
    
    // Justice words
    ['democracy', 1.2], ['democratic', 1.2], ['dignity', 1.2], ['equality', 1.2], ['freedom', 1.5], 
    ['justice', 1.3], ['liberate', 1.3], ['liberation', 1.3], ['liberty', 1.3], ['rights', 1.2],
    
    // Economic positive
    ['boom', 1.3], ['employment', 1], ['gain', 1], ['opportunity', 1], ['profit', 1], 
    ['profitable', 1.1], ['prosperity', 1.5], ['resource', 0.7], ['wealth', 1],
    
    // Health positive
    ['cure', 1.3], ['heal', 1.2], ['health', 1], ['healthy', 1.2], ['recover', 1.2], 
    ['recovery', 1.2], ['strength', 1], ['strong', 1], ['wellness', 1.2],
    
    // Emotional positive
    ['amazing', 1.3], ['brave', 1.2], ['courage', 1.2], ['delight', 1.1], ['excellent', 1.3], 
    ['fantastic', 1.3], ['good', 0.8], ['great', 1], ['happy', 1.2], ['hope', 0.9], 
    ['joy', 1.3], ['love', 1.2], ['optimism', 1.1], ['positive', 1], ['wonderful', 1.2]
  ];
  
  const negativeWords: [string, number][] = [
    // Conflict words
    ['aggression', 1.5], ['attack', 1.5], ['battle', 1.3], ['bloodshed', 1.8], ['bomb', 1.7], 
    ['conflict', 1.5], ['confrontation', 1.3], ['destroy', 1.5], ['destruction', 1.5], ['enemy', 1.4], 
    ['escalate', 1.3], ['fight', 1.3], ['fighting', 1.3], ['invade', 1.5], ['invasion', 1.5], 
    ['kill', 1.8], ['killed', 1.8], ['missile', 1.4], ['violence', 1.7], ['violent', 1.7], 
    ['war', 1.8], ['weapon', 1.2],
    
    // Disaster words
    ['accident', 1.2], ['catastrophe', 1.8], ['crisis', 1.5], ['damage', 1.3], ['danger', 1.3], 
    ['deadly', 1.6], ['death', 1.7], ['devastate', 1.7], ['disaster', 1.8], ['disease', 1.4], 
    ['emergency', 1.5], ['epidemic', 1.6], ['fatal', 1.6], ['injured', 1.4], ['tragedy', 1.6], 
    ['victim', 1.5], ['victims', 1.5],
    
    // Economic negative
    ['bankrupt', 1.6], ['collapse', 1.5], ['crash', 1.5], ['crisis', 1.5], ['debt', 1.2], 
    ['decline', 1.2], ['deficit', 1.3], ['depression', 1.5], ['downturn', 1.3], ['fail', 1.2], 
    ['failure', 1.3], ['inflation', 1.2], ['poverty', 1.5], ['recession', 1.5], ['unemployment', 1.4],
    
    // Political negative
    ['authoritarian', 1.4], ['corrupt', 1.5], ['corruption', 1.5], ['coup', 1.5], ['dictator', 1.6], 
    ['extremism', 1.5], ['extremist', 1.5], ['fraud', 1.5], ['hostage', 1.5], ['oppress', 1.5], 
    ['oppression', 1.5], ['protest', 1], ['regime', 1], ['riot', 1.4], ['scandal', 1.4], 
    ['terror', 1.6], ['terrorism', 1.7], ['terrorist', 1.7], ['threat', 1.3], ['tyranny', 1.6],
    
    // Emotional negative
    ['anger', 1.3], ['angry', 1.3], ['anxiety', 1.3], ['awful', 1.3], ['bad', 1], 
    ['cruel', 1.5], ['danger', 1.3], ['dangerous', 1.3], ['depressed', 1.4], ['desperate', 1.3], 
    ['fear', 1.3], ['frightening', 1.3], ['hate', 1.5], ['horrible', 1.4], ['horrific', 1.5], 
    ['negative', 1], ['outrage', 1.3], ['sad', 1.2], ['scared', 1.2], ['suffering', 1.5], 
    ['tragic', 1.6], ['worry', 1.1]
  ];
  
  // Context modifiers that can flip sentiment
  const negationWords = ['not', 'no', 'never', 'none', 'neither', 'nor', 'without', 'cannot', "can't", "won't", "didn't", "doesn't", "isn't"];
  
  // Temporal markers for past vs. present/future
  const pastMarkers = ['was', 'were', 'had', 'did', 'used to', 'previously', 'formerly', 'once', 'earlier', 'before', 'ago', 'last', 'yesterday', 'historical', 'history'];
  const presentFutureMarkers = ['is', 'are', 'am', 'being', 'has', 'have', 'now', 'today', 'currently', 'present', 'ongoing', 'will', 'shall', 'going to', 'future', 'soon', 'tomorrow', 'upcoming'];
  
  // Calculate weighted sentiment scores
  let positiveScore = 0;
  let negativeScore = 0;
  
  // Split text into sentences for better context handling
  const sentences = lowerText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Track temporal context
  let hasPastContext = false;
  let hasPresentFutureContext = false;
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const sentencePosition = i / sentences.length; // 0 for first, 1 for last
    
    // Check for temporal markers
    const isPastContext = pastMarkers.some(marker => sentence.includes(marker));
    const isPresentFutureContext = presentFutureMarkers.some(marker => sentence.includes(marker));
    
    if (isPastContext) hasPastContext = true;
    if (isPresentFutureContext) hasPresentFutureContext = true;
    
    // Apply temporal weighting - sentences later in text and with present/future markers get higher weight
    const temporalWeight = isPastContext ? 0.7 : (isPresentFutureContext ? 1.3 : 1.0);
    // Later sentences get slightly more weight (conclusion often states the current situation)
    const positionWeight = 0.8 + (sentencePosition * 0.4); // 0.8 for first sentence, 1.2 for last
    
    // Check for negation in this sentence
    const hasNegation = negationWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(sentence);
    });
    
    // Process positive words
    for (const [word, weight] of positiveWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = sentence.match(regex);
      if (matches) {
        // If negation is present, this positive word contributes to negative score
        if (hasNegation) {
          negativeScore += matches.length * weight * 0.8 * temporalWeight * positionWeight;
        } else {
          positiveScore += matches.length * weight * temporalWeight * positionWeight;
        }
      }
    }
    
    // Process negative words
    for (const [word, weight] of negativeWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = sentence.match(regex);
      if (matches) {
        // If negation is present, this negative word contributes to positive score
        if (hasNegation) {
          positiveScore += matches.length * weight * 0.8 * temporalWeight * positionWeight;
        } else {
          negativeScore += matches.length * weight * temporalWeight * positionWeight;
        }
      }
    }
  }
  
  // Special case: If text has both past negative context and present/future positive context
  // This is common in "overcoming adversity" or "independence day" type stories
  if (hasPastContext && hasPresentFutureContext && positiveScore > 0 && negativeScore > 0) {
    // Boost the present/future sentiment (usually positive in news about overcoming past challenges)
    positiveScore *= 1.2;
  }
  
  // Determine sentiment based on weighted scores
  let sentiment: SentimentType;
  let confidence: number;
  
  const totalScore = positiveScore + negativeScore;
  
  if (totalScore < 0.5) {
    // Very little sentiment detected
    sentiment = 'neutral';
    confidence = 0.7; // Medium confidence for neutral classification
  } else if (positiveScore > negativeScore * 1.2) { // Positive needs to be clearly higher
    sentiment = 'positive';
    confidence = Math.min(0.5 + (positiveScore / (totalScore * 2)), 0.95); // Cap at 0.95
  } else if (negativeScore > positiveScore * 1.2) { // Negative needs to be clearly higher
    sentiment = 'negative';
    confidence = Math.min(0.5 + (negativeScore / (totalScore * 2)), 0.95); // Cap at 0.95
  } else {
    // Scores are too close to call
    sentiment = 'neutral';
    confidence = 0.6;
  }
  
  return {
    label: sentiment,
    confidence: confidence
  };
};

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
      
      // Use our advanced sentiment analysis
      const result = advancedSentimentAnalysis(truncatedText);
      
      console.log('Sentiment analysis result:', result);
      
      return result;
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
