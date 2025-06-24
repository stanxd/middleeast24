import { useState, useEffect } from 'react';
import { Article } from '../types/Article';
import { RSSService } from '../services/RSSService';

export const useRSSArticles = (sentimentFilter: string = 'all') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSArticles = async () => {
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
        console.log(`Total articles after filtering: ${filteredArticles.length}`);
      } catch (err: any) {
        console.error('Error fetching RSS articles:', err);
        // Provide more detailed error message
        setError(err?.message || 'Failed to load RSS articles');
      } finally {
        setLoading(false);
      }
    };

    fetchRSSArticles();
  }, [sentimentFilter]);

  return { articles, loading, error };
};
