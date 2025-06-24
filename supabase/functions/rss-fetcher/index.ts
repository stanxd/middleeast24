// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

// Define the RSS source interface
interface RSSSource {
  name: string;
  url: string;
  category: 'News' | 'Investigations' | 'Exclusive Sources';
}

// Define the RSS item interface
interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  content?: string;
  thumbnail?: string;
  enclosure?: {
    link?: string;
    url?: string;
  };
}

// Define the sentiment type
type SentimentType = 'positive' | 'negative' | 'neutral';

// Default RSS sources
const defaultRSSSources: RSSSource[] = [
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'News'
  },
  {
    name: 'BBC Middle East',
    url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
    category: 'News'
  },
  {
    name: 'Reuters Middle East',
    url: 'https://www.reutersagency.com/feed/?taxonomy=best-regions&post_type=best&taxonomy=best-regions&post_type=best&best-regions=middle-east',
    category: 'News'
  },
  {
    name: 'Al Arabiya',
    url: 'https://english.alarabiya.net/tools/rss',
    category: 'News'
  }
];

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Fetch all RSS sources
    for (const source of defaultRSSSources) {
      try {
        console.log(`Fetching RSS feed from ${source.name}: ${source.url}`);
        await fetchAndProcessFeed(source, supabaseClient);
      } catch (error) {
        console.error(`Error fetching RSS feed from ${source.name}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'RSS feeds processed successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing RSS feeds:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Fetch and process a single RSS feed
 */
async function fetchAndProcessFeed(source: RSSSource, supabaseClient: any): Promise<void> {
  try {
    // Try multiple CORS proxies in order
    const proxies = [
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(source.url)}`
    ];

    let response;
    let data;
    let success = false;
    let items: RSSItem[] = [];

    // Try rss2json first (most reliable for RSS)
    try {
      console.log('Trying rss2json proxy...');
      response = await fetch(proxies[0]);
      if (response.ok) {
        data = await response.json();
        if (data.status === 'ok' && data.items) {
          console.log('rss2json success, found', data.items.length, 'items');
          items = data.items;
          success = true;
        }
      }
    } catch (err) {
      console.log('rss2json failed:', err);
    }

    // If rss2json failed, try the allorigins approach
    if (!success) {
      try {
        console.log('Trying allorigins proxy...');
        response = await fetch(proxies[1]);
        if (response.ok) {
          data = await response.json();
          
          // Parse XML in Deno environment
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
          
          const xmlItems = Array.from(xmlDoc.querySelectorAll('item'));
          console.log('allorigins success, found', xmlItems.length, 'items');
          
          if (xmlItems.length > 0) {
            items = xmlItems.map((item: Element) => {
              const title = item.querySelector('title')?.textContent || 'Untitled';
              const description = item.querySelector('description')?.textContent || '';
              const link = item.querySelector('link')?.textContent || '';
              const pubDate = item.querySelector('pubDate')?.textContent || '';
              const author = item.querySelector('author')?.textContent || '';
              
              // Try to extract image from media:content or enclosure
              const mediaContent = item.querySelector('media\\:content');
              const enclosure = item.querySelector('enclosure');
              
              let thumbnail = undefined;
              let enclosureObj = undefined;
              
              if (mediaContent) {
                thumbnail = mediaContent.getAttribute('url') || undefined;
              } else if (enclosure) {
                enclosureObj = {
                  url: enclosure.getAttribute('url') || undefined
                };
              }

              return {
                title,
                description,
                link,
                pubDate,
                author,
                thumbnail,
                enclosure: enclosureObj
              };
            });
            success = true;
          }
        }
      } catch (err) {
        console.log('allorigins failed:', err);
      }
    }

    if (!success) {
      throw new Error('All RSS proxy methods failed');
    }

    // Process each item
    for (const item of items) {
      await processRSSItem(item, source, supabaseClient);
    }

  } catch (error) {
    console.error('Error in fetchAndProcessFeed:', error);
    throw error;
  }
}

/**
 * Process a single RSS item
 */
async function processRSSItem(item: RSSItem, source: RSSSource, supabaseClient: any): Promise<void> {
  try {
    const title = item.title || 'Untitled';
    const description = item.description || item.content || '';
    const link = item.link || '';
    const pubDate = item.pubDate || new Date().toISOString();
    const author = item.author || source.name;
    
    // Extract image from description HTML or use thumbnail
    let imageUrl = '/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png';
    if (item.thumbnail) {
      imageUrl = item.thumbnail;
    } else if (item.enclosure && (item.enclosure.link || item.enclosure.url)) {
      imageUrl = item.enclosure.link || item.enclosure.url || imageUrl;
    }

    // Format date
    const publishDate = new Date(pubDate);
    
    // Create excerpt
    const excerpt = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

    // Check if article already exists in the database
    const { data: existingArticles, error: checkError } = await supabaseClient
      .from('rss_articles')
      .select('id')
      .eq('title', title)
      .eq('source_url', link)
      .eq('publish_date', publishDate.toISOString());

    if (checkError) {
      console.error('Error checking for existing article:', checkError);
      return;
    }

    // If article already exists, skip it
    if (existingArticles && existingArticles.length > 0) {
      console.log(`Article already exists: ${title}`);
      return;
    }

    // Analyze sentiment
    const sentimentResult = analyzeSentiment(title + ' ' + description);
    
    // Prepare article data
    const articleData = {
      title: title.length > 255 ? title.substring(0, 255) : title,
      content: description,
      excerpt: excerpt.length > 255 ? excerpt.substring(0, 255) : excerpt,
      author,
      publish_date: publishDate.toISOString(),
      source_url: link,
      image_url: imageUrl,
      category: source.category,
      tags: ['rss', source.name.toLowerCase().replace(/\s+/g, '-')],
      sentiment_label: sentimentResult?.label || null,
      sentiment_confidence: sentimentResult?.confidence || null
    };

    // Insert article into database
    const { error: insertError } = await supabaseClient
      .from('rss_articles')
      .insert([articleData]);

    if (insertError) {
      console.error('Error inserting article:', insertError);
      return;
    }

    console.log(`Successfully processed article: ${title}`);
  } catch (error) {
    console.error('Error processing RSS item:', error);
  }
}

/**
 * Analyze sentiment of text using the custom sentiment analysis
 */
function analyzeSentiment(text: string): { label: SentimentType, confidence: number } | null {
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
}

/**
 * Advanced sentiment analysis for news content with temporal and contextual awareness
 */
function advancedSentimentAnalysis(text: string): { label: SentimentType, confidence: number } {
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
}
