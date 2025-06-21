
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
        console.log('Attempting to fetch RSS feed:', feedUrl);

        // Try multiple CORS proxies in order
        const proxies = [
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
          `https://cors-anywhere.herokuapp.com/${feedUrl}`,
          `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`
        ];

        let response;
        let data;
        let success = false;

        // Try rss2json first (most reliable for RSS)
        try {
          console.log('Trying rss2json proxy...');
          response = await fetch(proxies[0]);
          if (response.ok) {
            data = await response.json();
            if (data.status === 'ok' && data.items) {
              console.log('rss2json success, found', data.items.length, 'items');
              const parsedArticles: Article[] = data.items.slice(0, 12).map((item: any, index: number) => {
                const title = item.title || 'Untitled';
                const description = item.description || item.content || '';
                const link = item.link || item.guid || '';
                const pubDate = item.pubDate || '';
                
                // Extract image from description HTML or use thumbnail
                let imageUrl = '/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png';
                if (item.thumbnail) {
                  imageUrl = item.thumbnail;
                } else if (item.enclosure && item.enclosure.link) {
                  imageUrl = item.enclosure.link;
                }

                // Format date
                const formattedDate = pubDate ? new Date(pubDate).toLocaleDateString() : new Date().toLocaleDateString();

                return {
                  id: `rss-${index}`,
                  title: title.length > 100 ? title.substring(0, 100) + '...' : title,
                  excerpt: description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                  content: description,
                  author: item.author || 'Al Arabiya',
                  category: 'News' as const,
                  publishDate: formattedDate,
                  image: imageUrl,
                  featured: index < 3,
                  tags: ['breaking', 'international']
                };
              });
              
              setArticles(parsedArticles);
              success = true;
            }
          }
        } catch (err) {
          console.log('rss2json failed:', err);
        }

        // If rss2json failed, try the original allorigins approach
        if (!success) {
          try {
            console.log('Trying allorigins proxy...');
            response = await fetch(proxies[2]);
            if (response.ok) {
              data = await response.json();
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
              
              const items = Array.from(xmlDoc.querySelectorAll('item'));
              console.log('allorigins success, found', items.length, 'items');
              
              if (items.length > 0) {
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
