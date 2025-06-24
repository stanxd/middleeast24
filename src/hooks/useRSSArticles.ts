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
        
        // Fetch RSS articles from the database
        const rssArticles = await RSSService.convertToArticles();
        
        // Apply sentiment filtering if needed
        let filteredArticles = rssArticles;
        if (sentimentFilter !== 'all' && sentimentFilter) {
          filteredArticles = rssArticles.filter(article => 
            article.sentiment === sentimentFilter
          );
        }
        
        setArticles(filteredArticles);
      } catch (err) {
        console.error('Error fetching RSS articles:', err);
        setError('Failed to load RSS articles');
      } finally {
        setLoading(false);
      }
    };

    fetchRSSArticles();
  }, [sentimentFilter]);

  return { articles, loading, error };
};
