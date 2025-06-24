import { supabase } from '../integrations/supabase/client';
import { SentimentType } from '../hooks/useSentimentAnalysis';
import { Article } from '../types/Article';
import { SentimentIntensityAnalyzer } from 'vader-sentiment';

// Define the RSS source interface
export interface RSSSource {
  id?: string;
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

/**
 * Service for fetching, analyzing, and storing RSS articles
 */
export class RSSService {
  /**
   * Add a new RSS source
   */
  public async addSource(source: RSSSource): Promise<void> {
    const { error } = await supabase
      .from('rss_sources')
      .insert([{
        name: source.name,
        url: source.url,
        category: source.category
      }]);
    
    if (error) {
      console.error('Error adding RSS source:', error);
      throw error;
    }
  }

  /**
   * Set the RSS sources (replaces all existing sources)
   */
  public async setSources(sources: RSSSource[]): Promise<void> {
    // First delete all existing sources
    const { error: deleteError } = await supabase
      .from('rss_sources')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (deleteError) {
      console.error('Error deleting RSS sources:', deleteError);
      throw deleteError;
    }
    
    // Then insert the new sources
    if (sources.length > 0) {
      const { error: insertError } = await supabase
        .from('rss_sources')
        .insert(sources.map(source => ({
          name: source.name,
          url: source.url,
          category: source.category
        })));
      
      if (insertError) {
        console.error('Error inserting RSS sources:', insertError);
        throw insertError;
      }
    }
  }

  /**
   * Get all RSS sources
   */
  public async getSources(): Promise<RSSSource[]> {
    const { data, error } = await supabase
      .from('rss_sources')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching RSS sources:', error);
      return [];
    }
    
    // Convert the database category (string) to the RSSSource category (union type)
    return (data || []).map(source => ({
      id: source.id,
      name: source.name,
      url: source.url,
      category: source.category as 'News' | 'Investigations' | 'Exclusive Sources'
    }));
  }

  /**
   * Fetch articles from all RSS sources
   */
  public async fetchAllSources(): Promise<void> {
    const sources = await this.getSources();
    
    for (const source of sources) {
      try {
        console.log(`Fetching RSS feed from ${source.name}: ${source.url}`);
        await this.fetchAndProcessFeed(source);
      } catch (error) {
        console.error(`Error fetching RSS feed from ${source.name}:`, error);
      }
    }
  }

  /**
   * Fetch and process a single RSS feed
   */
  private async fetchAndProcessFeed(source: RSSSource): Promise<void> {
    try {
      console.log(`Fetching RSS feed from ${source.name}: ${source.url}`);
      
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
        response = await fetch(proxies[0], { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          data = await response.json();
          console.log('rss2json response:', data);
          
          if (data.status === 'ok' && data.items && data.items.length > 0) {
            console.log('rss2json success, found', data.items.length, 'items');
            items = data.items;
            success = true;
          } else {
            console.log('rss2json returned no items or had an error status');
          }
        } else {
          console.log('rss2json response not OK:', response.status);
        }
      } catch (err) {
        console.log('rss2json failed:', err);
      }

      // If rss2json failed, try the allorigins approach
      if (!success) {
        try {
          console.log('Trying allorigins proxy...');
          response = await fetch(proxies[1], {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (response.ok) {
            data = await response.json();
            console.log('allorigins response received');
            
            if (data.contents) {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
              
              // Try to find items - different RSS feeds might use different structures
              let xmlItems = Array.from(xmlDoc.querySelectorAll('item'));
              
              // If no items found, try entry (Atom format)
              if (xmlItems.length === 0) {
                xmlItems = Array.from(xmlDoc.querySelectorAll('entry'));
              }
              
              console.log('allorigins success, found', xmlItems.length, 'items');
              
              if (xmlItems.length > 0) {
                items = xmlItems.map(item => {
                  // Extract basic fields with fallbacks
                  const title = item.querySelector('title')?.textContent || 'Untitled';
                  
                  // For description, try multiple possible tags
                  let description = '';
                  const descriptionEl = item.querySelector('description') || 
                                       item.querySelector('content') ||
                                       item.querySelector('summary');
                  if (descriptionEl) {
                    description = descriptionEl.textContent || '';
                  }
                  
                  // For link, handle both direct text content and href attribute
                  let link = '';
                  const linkEl = item.querySelector('link');
                  if (linkEl) {
                    link = linkEl.getAttribute('href') || linkEl.textContent || '';
                  }
                  
                  const pubDate = item.querySelector('pubDate')?.textContent || 
                                 item.querySelector('published')?.textContent || 
                                 item.querySelector('date')?.textContent || 
                                 new Date().toISOString();
                                 
                  const author = item.querySelector('author')?.textContent || 
                                item.querySelector('creator')?.textContent || 
                                source.name;
                  
                  // Try to extract image from various possible elements
                  let thumbnail = undefined;
                  let enclosureObj = undefined;
                  
                  // Try media:content with namespace
                  const mediaContent = item.querySelector('*[nodeName="media:content"]') || 
                                      item.querySelector('media\\:content');
                  
                  // Try enclosure
                  const enclosure = item.querySelector('enclosure');
                  
                  // Try image tag
                  const image = item.querySelector('image') || 
                               item.querySelector('thumbnail');
                  
                  if (mediaContent) {
                    thumbnail = mediaContent.getAttribute('url') || undefined;
                  } else if (enclosure) {
                    const type = enclosure.getAttribute('type') || '';
                    if (type.startsWith('image/')) {
                      thumbnail = enclosure.getAttribute('url') || undefined;
                    } else {
                      enclosureObj = {
                        url: enclosure.getAttribute('url') || undefined
                      };
                    }
                  } else if (image) {
                    thumbnail = image.getAttribute('url') || image.textContent || undefined;
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
              } else {
                console.log('No items found in the XML document');
              }
            } else {
              console.log('allorigins response missing contents property');
            }
          } else {
            console.log('allorigins response not OK:', response.status);
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
        await this.processRSSItem(item, source);
      }

    } catch (error) {
      console.error('Error in fetchAndProcessFeed:', error);
      throw error;
    }
  }

  /**
   * Process a single RSS item
   */
  private async processRSSItem(item: RSSItem, source: RSSSource): Promise<void> {
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
      const { data: existingArticles, error: checkError } = await supabase
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
      const sentimentResult = await this.analyzeSentiment(title + ' ' + description);
      
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
      const { error: insertError } = await supabase
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
   * Analyze sentiment of text using VADER sentiment analysis with adjustments for news content
   */
  private async analyzeSentiment(text: string): Promise<{ label: SentimentType, confidence: number } | null> {
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
  }

  /**
   * Convert RSS articles to frontend Article format
   */
  public static async convertToArticles(): Promise<Article[]> {
    try {
      console.log('Fetching RSS articles from database...');
      const { data, error } = await supabase
        .from('rss_articles')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) {
        console.error('Error fetching RSS articles:', error);
        throw error; // Throw the error to be caught by the caller
      }

      if (!data || data.length === 0) {
        console.log('No RSS articles found in database');
        return [];
      }

      console.log(`Found ${data.length} RSS articles in database`);
      return data.map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        category: item.category as 'News' | 'Investigations' | 'Exclusive Sources',
        publishDate: new Date(item.publish_date).toLocaleDateString(),
        image: item.image_url || '/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png',
        featured: false,
        tags: item.tags || [],
        sentiment: item.sentiment_label as SentimentType | undefined,
        sentimentConfidence: item.sentiment_confidence
      }));
    } catch (error) {
      console.error('Error converting RSS articles to frontend format:', error);
      return [];
    }
  }
}

// Create a singleton instance
export const rssService = new RSSService();
