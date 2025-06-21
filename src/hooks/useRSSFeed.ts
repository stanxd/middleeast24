
import { useState, useEffect } from 'react';
import { Article } from '../types/Article';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  'media:content'?: {
    url: string;
  };
  enclosure?: {
    url: string;
  };
}

export const useRSSFeed = (feedUrl: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use a CORS proxy to fetch the RSS feed
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch RSS feed');
        }

        const data = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
        
        const items = Array.from(xmlDoc.querySelectorAll('item'));
        
        const parsedArticles: Article[] = items.slice(0, 12).map((item, index) => {
          const title = item.querySelector('title')?.textContent || 'Untitled';
          const description = item.querySelector('description')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          
          // Try to extract image from media:content or enclosure
          const mediaContent = item.getElementsByTagName('media:content')[0];
          const enclosure = item.querySelector('enclosure');
          
          let imageUrl = '/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png';
          
          if (mediaContent) {
            imageUrl = mediaContent.getAttribute('url') || imageUrl;
          } else if (enclosure && enclosure.getAttribute('type')?.includes('image')) {
            imageUrl = enclosure.getAttribute('url') || imageUrl;
          }

          // Format date
          const formattedDate = pubDate ? new Date(pubDate).toLocaleDateString() : new Date().toLocaleDateString();

          return {
            id: `rss-${index}`,
            title: title.length > 100 ? title.substring(0, 100) + '...' : title,
            excerpt: description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
            content: description,
            author: 'Al Arabiya',
            category: 'News' as const,
            publishDate: formattedDate,
            image: imageUrl,
            featured: index < 3,
            tags: ['breaking', 'international']
          };
        });

        setArticles(parsedArticles);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError('Failed to load news feed');
      } finally {
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, [feedUrl]);

  return { articles, loading, error };
};
