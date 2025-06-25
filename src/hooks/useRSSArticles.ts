import { useState, useEffect, useCallback } from 'react';
import { Article } from '../types/Article';
import { RSSService } from '../services/RSSService';

export const useRSSArticles = (sentimentFilter: string = 'all') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Define fetchRSSArticles outside useEffect so it can be called manually
  const fetchRSSArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching RSS articles with sentiment filter:', sentimentFilter);
      
      // Fetch RSS articles from the database
      const rssArticles = await RSSService.convertToArticles();
      
      // Apply sentiment filtering if needed
      let filteredArticles = rssArticles;
      if (sentimentFilter !== 'all' && sentimentFilter) {
        console.log(`Filtering articles by sentiment: ${sentimentFilter}`);
        filteredArticles = rssArticles.filter(article => 
          article.sentiment === sentimentFilter
        );
        console.log(`Found ${filteredArticles.length} articles with sentiment: ${sentimentFilter}`);
      }
      
      setArticles(filteredArticles);
      setLastRefreshed(new Date());
      console.log(`Total articles after filtering: ${filteredArticles.length}`);
    } catch (err: any) {
      console.error('Error fetching RSS articles:', err);
      // Provide more detailed error message
      setError(err?.message || 'Failed to load RSS articles');
    } finally {
      setLoading(false);
    }
  }, [sentimentFilter]);

  // Function to manually refresh articles
  const refresh = useCallback(() => {
    console.log('Manually refreshing RSS articles');
    return fetchRSSArticles();
  }, [fetchRSSArticles]);

  // Initial fetch on mount or when sentiment filter changes
  useEffect(() => {
    fetchRSSArticles();
  }, [fetchRSSArticles]);

  return { articles, loading, error, refresh, lastRefreshed };
};
